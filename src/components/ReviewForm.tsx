import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import "./ReviewForm.css";

interface Props {
  movieId: string;
}

export const ReviewForm: React.FC<Props> = ({ movieId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(10);
  const [review, setReview] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Please log in to submit a review.");
    if (review.trim().length === 0) return alert("Please write a review.");

    const reviewData = {
      username: user.displayName || "Anonymous",
      avatar: user.photoURL || "",
      userId: user.uid,
      rating,
      review,
    };

    const reviewRef = doc(db, "reviews", movieId, "userReviews", user.uid);
    await setDoc(reviewRef, reviewData);

    setReview("");
    setRating(10);
    // alert("Review submitted!");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        Your Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => 10 - i).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </label>

      <label>
        Your Review:
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Write your thoughts..."
        />
      </label>

      <button type="submit" className="submit-btn">Submit Review</button>
    </form>
  );
};
