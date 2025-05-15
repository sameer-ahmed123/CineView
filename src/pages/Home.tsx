import { useEffect, useState } from "react";
import { fetchPopularMovies, searchMovies, Movie } from "../api/Api";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "./home.css";
import NavBar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setIsloading] = useState(true);
  const [searchParams,setSearchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1",10);

  useEffect(() => {
    const fetch = async () => {
      setIsloading(true);
      const data =
        query.trim() === "" // if no query just get regular page result
          ? await fetchPopularMovies(page) // regular
          : await searchMovies(query, page); // search 
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
  const handlePrevious = () => updatePage(Math.max(1, page - 1));
  return (
    <>
      <NavBar />
      <div>
        <h2>Popular</h2>
        <div className="movie-grid">
          {loading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="movie-card">
                  <Skeleton height={450} width={300} />
                  <Skeleton width={280} height={24} style={{ marginTop: 10 }} />
                </div>
              ))
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>{" "}
        <div className="pagination-buttons">
          <button onClick={handlePrevious} disabled={page === 1}>
            ◀ Prev
          </button>
          <span>Page {page}</span>
          <button onClick={handleNext}>Next ▶</button>
        </div>
      </div>
    </>
  );
};

export default Home;
