import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { fetchMovieById } from "../api/Api";
import NavBar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import Skeleton from "react-loading-skeleton";

interface MovieReview {
  movieId: string;
  reviewData: DocumentData;
  movieDetails: any;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviewedMovies = async () => {
      if (!user) return;

      try {
        const q = query(
          collectionGroup(db, "userReviews"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const reviewData: MovieReview[] = [];

        for (const docSnap of querySnapshot.docs) {
          const pathSegments = docSnap.ref.path.split("/");
          const movieId = pathSegments[1]; // "reviews(0)/{movieId}(1)/userReviews(2)/{userId}(3)"
          const movieDetails = await fetchMovieById(movieId);

          reviewData.push({
            movieId,
            reviewData: docSnap.data(),
            movieDetails,
          });
          console.log(movieDetails);
        }
        console.log(reviewData);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching reviewed movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviewedMovies();
  }, [user]);

  if (loading)
    return (
      <>
        <NavBar />
        <section className="max-w-5xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Movies You've Reviewed
          </h1>
          <div className="profile-list-view">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="profile-movie-card">
                <Skeleton width={300} height={250} />
                <div
                  className="profile-movie-details"
                  style={{ marginLeft: 20 }}
                >
                  <Skeleton width={200} height={30} />
                  <Skeleton width={100} />
                  <Skeleton count={2} width={250} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );

  return (
    <>
      <NavBar />
      <section className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Movies You've Reviewed
        </h1>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't reviewed any movies yet.
          </p>
        ) : (
          <div className="profile-list-view">
            {reviews.map(({ movieDetails, reviewData }) => (
              <Link to={`/movie/${movieDetails.id}`} key={movieDetails.id}>
                <div className="profile-movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    className="profile-movie-poster"
                  />
                  <div className="profile-movie-details">
                    <h3>{movieDetails.title}</h3>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {reviewData.rating ?? "No rating given"}
                    </p>
                    {reviewData.review && (
                      <p className="profile-movie-review">
                        “{reviewData.review}”
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProfilePage;
