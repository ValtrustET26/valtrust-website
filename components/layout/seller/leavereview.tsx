"use client";
import { useState } from "react";
interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
}
export default function ReviewForm() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const handleSubmitReview = () => {
    if (!name || !reviewText || rating === 0) return;
    const newReview: Review = {
      id: Date.now(),
      name,
      review: reviewText,
      rating,
    };

    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setReviewText("");
    setRating(0);
    setShowForm(false);
  };
  const handleCancelReview = () => {
    setName("");
    setReviewText("");
    setRating(0);

    setShowForm(false);
  };
  const handleDeleteReview = (id: number) => {
    setReviews((prev) =>
      prev.filter((review) => review.id !== id)
    );
  };
  return (
    <section className="mx-auto mt-16 max-w-5xl p-10">
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#0B1E4A]">
          Share your experience
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Your feedback helps us maintain our standards of excellence
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="rounded-md bg-[#0B1E4A] px-6 py-3 text-sm font-medium text-[#fafaf9] shadow-md transition hover:opacity-90"
      >
        {showForm ? "Close Review" : "Leave Review"}
      </button>

      {showForm && (
        <div className="mt-10 rounded-sm border border-gray-400 bg-white p-8 shadow-sm">
          
          <div className="mb-8">
            <p className="mb-4 text-sm font-medium text-[#171717]">
              Overall Rating
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition hover:scale-110 ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-[#171717]">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marisol Elena Martínez Guevara"
              className=" text-black w-full rounded-md border border-gray-300 px-4 py-4 text-sm outline-none transition focus:border-[#1E5EDB]"
            />
          </div>
          <div className="mb-10">
            <label className="mb-3 block text-sm font-medium text-[#171717]">
              Your Review
            </label>

            <textarea
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with our services..."
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-4 text-sm outline-none transition focus:border-[#1E5EDB] text-black"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            

            <button
              onClick={handleSubmitReview}
              className="rounded-md bg-[#0B1E4A] px-16 py-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Submit Review
            </button>

          
            <button
              onClick={handleCancelReview}
              className="rounded-md border border-gray-300 bg-white px-16 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel Review
            </button>
          </div>
        </div>
      )}
      {reviews.length > 0 && (
        <div className="mt-14 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                
                <div className="flex items-center gap-3">
                  
                  <div className="h-10 w-10 rounded-full bg-gray-300" />

                  <h3 className="text-sm font-semibold text-[#171717]">
                    {review.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-sm font-medium text-red-500 transition hover:text-red-700"
                >
                  Delete
                </button>
              </div>

              {/* REVIEW */}
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                {review.review}
              </p>

              {/* STARS */}
              <div className="flex justify-end gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}