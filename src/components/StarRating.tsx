interface StarRatingProps {
  score: number // trust score, 0–100
  size?: "sm" | "md" | "lg"
  showValue?: boolean
}

const STAR_PATH =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"

const sizeMap = {
  sm: { star: "w-4 h-4", text: "text-xs" },
  md: { star: "w-5 h-5", text: "text-sm" },
  lg: { star: "w-6 h-6", text: "text-base" },
}

function StarRating({ score, size = "md", showValue = true }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const starValue = clamped / 20 // convert 0–100 score to a 0–5 star scale
  const fillPercent = (starValue / 5) * 100

  const dims = sizeMap[size]

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative inline-flex">
        {/* empty stars underneath */}
        <div className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} className={`${dims.star} text-slate-200`} viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
          ))}
        </div>
        {/* filled stars on top, clipped to the exact score percentage */}
        <div
          className="absolute inset-0 flex gap-0.5 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} className={`${dims.star} text-amber-400 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
          ))}
        </div>
      </div>
      {showValue && (
        <span className={`${dims.text} font-semibold text-slate-600`}>
          {starValue.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating