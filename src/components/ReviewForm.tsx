// src/components/ReviewForm.tsx
import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import "./ReviewForm.css";

interface ReviewFormProps {
  movieId: string;
}

export function ReviewForm({ movieId }: ReviewFormProps) {
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedReview = review.trim();
    if (trimmedReview.length < 5) {
      setError("please enter atleast 5 characters");
      return;
    }
    if (isNaN(Number(rating)) || rating < 0 || rating > 10) {
      setError("rating must be between 0 and 10 ");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await setDoc(doc(db, "reviews", movieId, "userReviews", user.uid), {
        username: user.displayName,
        review: review,
        rating: Number(rating),
        userId: user.uid,
        avatar: user.photoURL,
        timestamp: serverTimestamp(),
      });
      alert("Review submitted!");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review: ", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      {/* <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        placeholder="Rating (0-10)"
        min={0}
        max={10}
        required
      /> */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      >
        <option value="">Select rating</option>
        {[...Array(11)].map((_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      <button disabled={submitting} type="submit">
        {submitting ? "submiting..." : "Submit Review"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
