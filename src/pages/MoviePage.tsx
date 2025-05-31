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
  const default_img = "https://static.vecteezy.com/system/resources/previews/053/547/120/large_2x/generic-user-profile-avatar-for-online-platforms-and-social-media-vector.jpg";
  const [movie, setMovie] = useState<Movie | null>(null);
  const [video, setVideo] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [modalVideoKey, setModalVideoKey] = useState<string | null>(null);
  const [showAllMedia, setShowAllMedia] = useState(false);
  const trailer = video.find(
  (v) => v.type === "Trailer" && v.site === "YouTube"
);


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
              {trailer && (
                <button className="watch-trailer-btn" onClick={() => setModalVideoKey(trailer.key)}>
                  🎬 Watch Trailer
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
      {modalVideoKey && (
        <div className="trailer-modal" onClick={() => setModalVideoKey(null)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalVideoKey(null)}>×</button>
            <iframe
              src={`https://www.youtube.com/embed/${modalVideoKey}?autoplay=1`}
              title="Movie Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {/* Trailer Section */}
      <section className="container trailer-section">
        {/* heading and load more button for media */}
        <div className="media-header">
          <h2>Media</h2>
          {video.length > 6 && (
            <button
              className="view-all-btn"
              onClick={() => setShowAllMedia(!showAllMedia)}
            >
              {showAllMedia ? "Hide Media" : "View All Media"}
            </button>
          )}
        </div>

        {video.length > 0 ? (
      <div className="video-grid limited">
      {(showAllMedia ? video : video.slice(0, 6)).map((vid) => (
        <div
            className="video-item"
            key={vid.id}
            onClick={() => setModalVideoKey(vid.key)}
          >
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
