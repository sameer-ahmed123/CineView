import { useEffect, useRef, useState } from "react";
import { fetchPopularMovies, searchMovies, Movie } from "../api/Api";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "./home.css";
import NavBar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";

const categoryList = [
  "Popular", "Comedy", "Action", "Drama", "Horror",
  "Romance", "Crime", "Sci-Fi", "Adventure", "Animation",
  "Romance", "Crime", "Sci-Fi", "Adventure", "Animation",
  "Romance", "Crime", "Sci-Fi", "Adventure", "Animation"
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setIsloading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [activeCategory, setActiveCategory] = useState("Popular");

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetch = async () => {
      setIsloading(true);
      const data =
        query.trim() === ""
          ? await fetchPopularMovies(page)
          : await searchMovies(query, page);
      setMovies(data);
      setIsloading(false);
    };
    fetch();
  }, [query, page]);

  const updatePage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const handleNext = () => updatePage(page + 1);

  const scrollCategory = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      categoryScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag handlers
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
          <button className="scroll-btn left" onClick={() => scrollCategory("left")}>◀</button>

          <div
            className="category-bar"
            ref={categoryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {categoryList.map((genre) => (
              <button
                key={genre}
                className={`category-tab ${activeCategory === genre ? "active" : ""}`}
                onClick={() => setActiveCategory(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          <button className="scroll-btn right" onClick={() => scrollCategory("right")}>▶</button>
        </div>

        <div className="movie-grid">
          {loading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="movie-card">
                  <Skeleton height={450} width={300} />
                  <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
                </div>
              ))
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>

        <div className="pagination-buttons">
          <button onClick={handleNext}>Load More</button>
        </div>
      </div>
    </>
  );
};

export default Home;
