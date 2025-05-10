import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieById, fetchMovieVideos, Movie } from "../api/Api";
import { ReviewForm } from "../components/ReviewForm";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

import NavBar from "../components/Navbar";
import "./MoviePage.css";

const MoviePage: React.FC = () => {
  const { user } = useAuth();
  const default_img =
    "https://www.pngall.com/wp-content/uploads/5/Avatar-Profile-PNG-Clipart.png";
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
      <section className="Review-section">
        <ReviewForm movieId={String(id)} />
      </section>
      <section className="reviews-section">
        <h2>User Reviews</h2>
        {isLoadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review, index) => (
              <li className="review-item" key={index}>
                <div className="review-strong">
                  <img
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 50,
                      display: "inline-block",
                    }}
                    src={review?.avatar || default_img}
                    alt=""
                  />{" "}
                  <p>
                    <span style={{ fontSize: 24, fontWeight: 600 }}>
                      {review.username}
                    </span>{" "}
                    rated it {review.rating}/10⭐{" "}
                  </p>
                </div>{" "}
                <p>{review.review}</p>
                {/* Only show if current user is the author */}
                {user?.uid === review.userId && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this review?"
                            )
                          ) {
                            await deleteDoc(
                              doc(
                                db,
                                "reviews",
                                id!,
                                "userReviews",
                                review.userId
                              )
                            );
                            setReviews((prev) =>
                              prev.filter((r) => r.userId !== review.userId)
                            );
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default MoviePage;
