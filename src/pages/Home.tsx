import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  fetchPopularMovies,
  searchMovies,
  Movie,
  Genre,
  FetchMoviesByGenre,
  fetchMovieGenres,
  MovieApiResponse,
} from "../api/Api";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "./home.css";
import NavBar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton CSS

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || ""; // Get initial search query from URL
  const [currentQuery, setCurrentQuery] = useState(initialQuery); // Manage search query internally
  const [currentPage, setCurrentPage] = useState(1); // Manage current page internally for "Load More"
  const [totalPages, setTotalPages] = useState(1); // To store total pages for "Load More"
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [genres, setGenres] = useState<Genre[]>([]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  //momoize genre map for quick loolip  jaldi search karega genre ki id
  const genreNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    genres.forEach((genre) => {
      map.set(genre.name, genre.id);
    });
    return map;
  }, [genres]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const fetchedGenres = await fetchMovieGenres();
        setGenres([{ id: 0, name: "Popular" }, ...fetchedGenres]);
      } catch (error) {
        console.error("Error fetching genres:", error);
        // Fallback list if API fails
        setGenres([
          { id: 0, name: "Popular" },
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" },
        ]);
      }
    };
    getGenres();
  }, []); // Empty dependency means this runs only once on mount

const fetchMoviesData = useCallback(async () => {
  setIsLoading(true);
  let response: MovieApiResponse;

  // Always start with search if query is provided
  if (currentQuery.trim() !== "") {
    const searchResults = await searchMovies(currentQuery, currentPage);

    // Filter by genre if a non-"Popular" category is selected
    if (activeCategory !== "Popular") {
      const genreId = genreNameToIdMap.get(activeCategory);
      if (genreId) {
        response = {
          ...searchResults,
          results: searchResults.results.filter((movie) =>
            movie.genre_ids?.includes(genreId)
          ),
        };
      } else {
        response = searchResults;
      }
    } else {
      response = searchResults;
    }
  } else if (activeCategory === "Popular") {
    response = await fetchPopularMovies(currentPage);
  } else {
    const genreId = genreNameToIdMap.get(activeCategory);
    if (genreId) {
      response = await FetchMoviesByGenre(genreId, currentPage);
    } else {
      console.warn(`Genre ID not found for category: ${activeCategory}`);
      response = { page: 1, results: [], total_pages: 1, total_results: 0 };
    }
  }

  // Append or replace movie list
  setMovies((prevMovies) => {
    if (currentPage === 1) return response.results;
    const newMovies = response.results.filter(
      (newMovie) => !prevMovies.some((m) => m.id === newMovie.id)
    );
    return [...prevMovies, ...newMovies];
  });

  setTotalPages(response.total_pages);
  setIsLoading(false);
}, [currentQuery, currentPage, activeCategory, genreNameToIdMap]);


  // Effect for initial load and when query/page/category changes
useEffect(() => {
  if (initialQuery !== currentQuery) {
    // New search input from URL
    setCurrentQuery(initialQuery);
    setActiveCategory("Popular"); // search should reset category to default
    setCurrentPage(1);
    setMovies([]);
  }

  fetchMoviesData();
}, [
  initialQuery,
  currentPage,
  activeCategory,
  fetchMoviesData,
]);

// Added activeCategory to dependencies
  // Added movies.length and loading to ensure the effect re-evaluates if initial empty state remains.

  // Handler for "Load More" button
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const scrollCategory = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      categoryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handler for category tab click
  const handleCategoryClick = (genreName: string) => {
    if (activeCategory === genreName) return; // Prevent re-fetching if same category clicked

    setActiveCategory(genreName); // Update active category for styling
    setCurrentQuery(""); // Clear search query when selecting a category
    setCurrentPage(1); // Reset page to 1 for the new category
    setMovies([]); // Clear existing movies to show new category results
  };

  // Mouse drag handlers (unchanged)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - categoryScrollRef.current.offsetLeft;
    scrollLeft.current = categoryScrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // scroll speed
    categoryScrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h2>Movies</h2>

        <div className="category-wrapper">
          <button
            className="scroll-btn left"
            onClick={() => scrollCategory("left")}
          >
            ◀
          </button>

          <div
            className="category-bar"
            ref={categoryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`category-tab ${
                  activeCategory === genre.name ? "active" : ""
                }`}
                // This setActiveCategory only changes the visual state of the button
                // You'd need to add logic here to fetch movies by genre if desired.
                onClick={() => handleCategoryClick(genre.name)}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <button
            className="scroll-btn right"
            onClick={() => scrollCategory("right")}
          >
            ▶
          </button>
        </div>

        <div className="movie-grid">
          {movies.length === 0 && loading // Show skeletons on initial load or while more movies are loading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="movie-card">
                  <Skeleton height={450} width={300} />
                  <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
                </div>
              ))
            : movies.length > 0
            ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            : !loading && (
                <p className="no-results">
                  No movies found for this selection.
                </p>
              )}
          {loading &&
            movies.length > 0 && // Show skeletons when loading *more* movies
            [...Array(5)].map(
              (
                _,
                i // Show fewer skeletons for loading more
              ) => (
                <div key={`loading-${i}`} className="movie-card">
                  <Skeleton height={450} width={300} />
                  <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
                </div>
              )
            )}
        </div>

        <div className="pagination-buttons">
          {currentPage < totalPages && ( // Only show "Load More" if there are more pages
            <button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
          {/* Optional: Message when all movies are loaded */}
          {currentPage >= totalPages && !loading && movies.length > 0 && (
            <p>You've reached the end of the movie list.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
