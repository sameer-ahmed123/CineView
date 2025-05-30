import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieById, fetchMovieVideos, Movie } from "../api/Api";
import NavBar from "../components/Navbar";
import { ReviewForm } from "../components/ReviewForm";
import Skeleton from "react-loading-skeleton";
import "./MoviePage.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const default_img = "https://www.vectorstock.com/royalty-free-vector/default-profile-picture-avatar-user-icon-vector-46389216";
  const [movie, setMovie] = useState<Movie | null>(null);
  const [video, setVideo] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  // const trailers = video.filter(v => v.type === "Trailer");
  // const clips = video.filter(v => v.type === "Clip");


useEffect(() => {
  if (id) {
    fetchMovieById(id).then(setMovie);
    fetchMovieVideos(id).then(setVideo);

    const reviewRef = collection(db, "reviews", id, "userReviews");
    const unsubscribe = onSnapshot(reviewRef, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }
}, [id]);

  if (!movie) {
    return (
      <div className="container movie-loading">
        <Skeleton height={500} />
      </div>
    );
  }

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <div
        className="movie-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="overlay">
          <div className="movie-hero-content container">
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-info">
              <h1>{movie.title}</h1>
              {movie.tagline && <p className="tagline">“{movie.tagline}”</p>}
              <p className="overview">{movie.overview}</p>
              <div className="genres">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
              <p className="rating">⭐ {movie.vote_average}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      <section className="container trailer-section">
        <h2>Trailer</h2>
        {video.length > 0 ? (
  <div className="video-grid">
        {video.map((vid) => (
          <div className="video-item" key={vid.id}>
            <iframe
              src={`https://www.youtube.com/embed/${vid.key}`}
              title={vid.name}
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <p className="video-label">{vid.name}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>No media available.</p>
    )}
      </section>

      {/* Reviews */}
      <section className="container">
        <h2>Leave a Review</h2>
        <ReviewForm movieId={String(id)} />
      </section>    


      <section className="container reviews-section">
        <h2>User Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="review-list">
            {reviews.map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <img src={review.avatar || default_img} alt="avatar" />
                  <div>
                    <strong>{review.username}</strong>
                    <p className="user-rating">⭐ {review.rating}/10</p>
                  </div>
                </div>
                <p className="review-text">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </section>
 
    </>
  );
};

export default MoviePage;
