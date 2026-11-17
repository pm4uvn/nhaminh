import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 15,
  onChange,
  className,
}: {
  rating: number;
  size?: number;
  onChange?: (rating: number) => void;
  className?: string;
}) {
  const interactive = !!onChange;
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(rating);
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            aria-label={interactive ? `${n} sao` : undefined}
            className={interactive ? "cursor-pointer" : "pointer-events-none"}
          >
            <Star size={size} className={filled ? "fill-warning text-warning" : "text-border"} />
          </button>
        );
      })}
    </div>
  );
}

export function averageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
