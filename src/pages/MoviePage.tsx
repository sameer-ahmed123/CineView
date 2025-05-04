import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieById, fetchMovieVideos, Movie } from "../api/Api";
import { ReviewForm } from "../components/ReviewForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import NavBar from "../components/Navbar";
import "./MoviePage.css";

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [video, setVideo] = useState<any[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchMovieById(id).then(setMovie);
      fetchMovieVideos(id).then(setVideo);

      const fetchReviews = async () => {
        const reviewRef = collection(db, "reviews", id, "userReviews");
        const snapshot = await getDocs(reviewRef);
        const reviewsData = snapshot.docs.map((doc) => doc.data());
        setReviews(reviewsData);
        setIsLoadingReviews(false);
      };

      fetchReviews();
    }
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <NavBar />
      <section className="movie-detail">
        <h1>{movie.title}</h1>
        <div className="movie-main">
          <div className="movie-main_left">
            <img
              className="movie_poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt=""
            />
            <div className="movie_left_movie_details">
              <div className="movie_tags">
                <div>
                  {movie.genres?.map((genre) => {
                    return (
                      <span className="tag" key={genre.id}>
                        {" "}
                        {genre.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="movie_description">
                <p>{movie.overview}</p>
              </div>
              <div className="rating">
                <small>IMDB rating</small>
                <br />
                <small>{movie.vote_average}⭐/10</small>
              </div>
            </div>
          </div>
          <div className="movie-main_right">
            {/* <img
              className="movie_backdrop"
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
            /> */}
            {video.length > 0 ? (
              <iframe
                className="movie_backdrop"
                width="500"
                height="300"
                src={`https://www.youtube.com/embed/${video[0].key}`}
                title="YouTube trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No trailer available</p>
            )}
          </div>
        </div>
      </section>
      <section>
        <ReviewForm movieId={String(id)} />
      </section>
      <section>
        <h2>User Reviews</h2>
        {isLoadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <strong>{review.username}</strong> rated it {review.rating}/10
                <p>{review.review}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default MoviePage;
