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
import "react-loading-skeleton/dist/skeleton.css";

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [currentQuery, setCurrentQuery] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("genre") || "Popular"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const genreNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    genres.forEach((genre) => {
      map.set(genre.name, genre.id);
    });
    console.log(map);
    return map;
  }, [genres]);

  // Effect to fetch movie genres once
  useEffect(() => {
    const getGenres = async () => {
      try {
        const fetchedGenres = await fetchMovieGenres();
        setGenres([{ id: 0, name: "Popular" }, ...fetchedGenres]);
      } catch (error) {
        console.error("Error fetching genres:", error);
        // Fallback list
        setGenres([
          { id: 0, name: "Popular" },
          { id: 28, name: "Action" },
        ]);
      }
    };
    getGenres();
  }, []); // Empty dependency means this runs only once

  useEffect(() => {
    const queryFromUrl = searchParams.get("search") || "";
    const genreFromUrl = searchParams.get("genre") || "Popular";

    if (queryFromUrl !== currentQuery || genreFromUrl !== activeCategory) {
      setCurrentQuery(queryFromUrl);
      setActiveCategory(genreFromUrl);
      setCurrentPage(1);
      setMovies([]); // Clear movies to trigger a fresh fetch for the new criteria
    }
  }, [searchParams]); // Re-run when searchParams (url parameters) change

  // useCallback for fetching movie data
  const fetchMoviesData = useCallback(async () => {
    setIsLoading(true);
    let apiResponse: MovieApiResponse | null = null;
    let moviesToDisplay: Movie[] = [];

    const genreIdForClientFilter =
      activeCategory !== "Popular"
        ? genreNameToIdMap.get(activeCategory)
        : undefined;

    if (currentQuery.trim() !== "") {
      // 1. A search query is active
      apiResponse = await searchMovies(currentQuery, currentPage);
      if (apiResponse) {
        let searchedMovies = apiResponse.results;
        // 2. If a specific genre is also active, filter the search results client-side
        if (genreIdForClientFilter) {
          searchedMovies = searchedMovies.filter(
            (movie) =>
              movie.genre_ids &&
              movie.genre_ids.includes(genreIdForClientFilter)
          );
        }
        moviesToDisplay = searchedMovies;
        // WARNING: totalPages is for the original search (e.g., "cars"),
        setTotalPages(apiResponse.total_pages);
      }
    } else {
      // 3. No search query: fetch by "Popular" or selected genre directly
      if (activeCategory === "Popular" || !genreIdForClientFilter) {
        apiResponse = await fetchPopularMovies(currentPage);
      } else {
        apiResponse = await FetchMoviesByGenre(
          genreIdForClientFilter,
          currentPage
        );
      }
      if (apiResponse) {
        moviesToDisplay = apiResponse.results;
        setTotalPages(apiResponse.total_pages);
      }
    }

    setMovies((prevMovies) => {
      if (currentPage === 1) {
        return moviesToDisplay; // Replace movies if it's the first page
      } else {
        // Append new unique movies if loading more
        const newUniqueMovies = moviesToDisplay.filter(
          (newMovie) =>
            !prevMovies.some(
              (existingMovie) => existingMovie.id === newMovie.id
            )
        );
        return [...prevMovies, ...newUniqueMovies];
      }
    });
    setIsLoading(false);
  }, [currentQuery, activeCategory, currentPage, genreNameToIdMap]); // Dependencies for this callback

  // Effect to call fetchMoviesData when its dependencies (currentQuery, activeCategory, currentPage) change
  useEffect(() => {
    // Only fetch if genres have been loaded (so genreNameToIdMap is ready)
    if (genres.length > 0) {
      fetchMoviesData();
    }
  }, [fetchMoviesData, genres.length]); // Re-run if fetchMoviesData function instance changes or genres are loaded

  // Handler for category tab click
  const handleCategoryClick = (genreName: string) => {
    if (activeCategory === genreName) return; // Prevent re-fetching if same category clicked

    // Update internal state immediately for responsiveness (optional)
    // setActiveCategory(genreName);
    // setCurrentPage(1);
    // setMovies([]);

    // Update URL search parameters to reflect the new genre selection
    // The useEffect listening to searchParams will then handle state updates and trigger data fetching.
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams); // Preserve existing params (like 'search')
        if (genreName === "Popular" || !genreName) {
          newParams.delete("genre");
        } else {
          newParams.set("genre", genreName);
        }
        return newParams;
      },
      { replace: true }
    ); // Use replace to avoid polluting browser history
  };

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
      <NavBar /> {/* Assuming NavBar updates the 'search' URL parameter */}
      <div className="home-container">
        <h2>Movies</h2>

        <div className="category-wrapper">
          {/* Scroll buttons and category bar JSX as in your original code */}
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
          {/* Skeleton loading and movie card rendering JSX as in your original code */}
          {/* (Consider the skeleton count and "No movies found" message carefully due to client-side filtering) */}
          {loading && movies.length === 0 ? ( // Initial load skeletons
            [...Array(10)].map((_, i) => (
              <div key={i} className="movie-card">
                <Skeleton height={450} width={300} />
                <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
              </div>
            ))
          ) : movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : !loading ? (
            <p className="no-results">
              No movies found for this selection. (Please note: genre filters on
              search results might reduce movie count significantly).
            </p>
          ) : null}
          {loading &&
            movies.length > 0 && // Skeletons for "Load More"
            [...Array(5)].map((_, i) => (
              <div key={`loading-${i}`} className="movie-card">
                <Skeleton height={450} width={300} />
                <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
              </div>
            ))}
        </div>

        <div className="pagination-buttons">
          {currentPage < totalPages && movies.length > 0 && (
            <button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
          {currentPage >= totalPages && !loading && movies.length > 0 && (
            <p>
              You've reached the end of the movie list for the current criteria.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
