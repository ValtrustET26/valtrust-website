// components/ReviewCard.tsx

interface ReviewCardProps {
  name: string;
  review: string;
  rating: number;
}

export default function ReviewCard({
  name,
  review,
  rating,
}: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
      
      {/* User */}
      <div className="mb-4 flex items-center gap-3">
        
        {/* Avatar Placeholder */}
        <div className="h-10 w-10 rounded-full bg-gray-300" />

        <h3 className="text-sm font-semibold text-[#171717]">
          {name}
        </h3>
      </div>

      {/* Review */}
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        {review}
      </p>

      {/* Stars */}
      <div className="flex justify-end gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}