// src/components/ReviewForm.tsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "reviews", movieId, "userReviews", user.uid), {
        username: user.displayName,
        review: review,
        rating: rating,
        userId: user.uid,
        avatar:user.photoURL,
        timestamp: new Date(),
      });
      alert("Review submitted!");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review: ", error);
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
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        placeholder="Rating (0-10)"
        min={0}
        max={10}
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}
