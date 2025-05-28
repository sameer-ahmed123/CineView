import { Link } from "react-router-dom";
import { Movie } from "../api/Api";
import "./MovieCard.css";

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card-content">
        <img
          className="movie-card-image"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />

        {/* Bottom fade effect */}
        <div className="image-bottom-fade"></div>

        <div className="movie-card-overlay">
          {/* Backdrop with gradient overlay */}
          <div className="overlay-backdrop">
            <div
              className="backdrop-image"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
              }}
            ></div>
            <div className="backdrop-gradient"></div>
          </div>

          <div className="overlay-info">
            <h3 className="overlay-title">{movie.title}</h3>
            <div className="overlay-meta">
            <div className="meta-group">
              <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              <span className="hd-badge">HD</span>
              <span className="release-year">{year}</span>
            </div>
          </div>


            <p className="overlay-description">
              {movie.overview.length > 100
                ? movie.overview.slice(0, 100) + "..."
                : movie.overview}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
