import { useEffect, useState } from "react";
import { fetchPopularMovies, searchMovies, Movie } from "../api/Api";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "./home.css";
import NavBar from "../components/Navbar";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";

  useEffect(() => {
    if (query.trim() === "") {
      fetchPopularMovies().then(setMovies);
    } else {
      searchMovies(query).then(setMovies);
    }
  }, [query]);

  return (
    <>
      
        <NavBar />
        <div>
        <h2 >Popular</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>{" "}
      </div>
    </>
  );
};

export default Home;
