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

  if (loading) return <p className="text-center mt-8">Loading...</p>;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(({ movieDetails, reviewData }) => (
              <div
                key={movieDetails.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`}
                  alt={movieDetails.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {movieDetails.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    <strong>Rating:</strong>{" "}
                    {reviewData.rating ?? "No rating given"}
                  </p>
                  {reviewData.review && (
                    <p className="mt-2 text-gray-600 italic">
                      “{reviewData.review}”
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ProfilePage;
