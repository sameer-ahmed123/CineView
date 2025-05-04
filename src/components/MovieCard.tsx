import { Link } from "react-router-dom";
import { Movie } from "../api/Api";
import "./MovieCard.css";

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-content">
        <img
          className="movie-card-image"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-card-voteaverage">
          <p>{Math.round(movie.vote_average * 10)}%</p>
        </div>
      </div>
      <h3 className="movie-card-title">{movie.title}</h3>
    </Link>
  );
};

export default MovieCard;
