import { Star } from "lucide-react"

export function BuyerRating({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((item) => (
          <Star
            key={item}
            size={size}
            className={item <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-500">{rating.toFixed(1)}{count !== undefined ? ` (${count})` : ""}</span>
    </div>
  )
}
