import { useState } from "react"

interface StarRatingInputProps {
  value: number | null
  onChange: (rating: number) => void
}

const STAR_PATH =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"

function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const active = hovered ?? value ?? 0

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-0.5"
        >
          <svg
            className={`w-6 h-6 transition ${
              star <= active ? "text-amber-400" : "text-slate-200"
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default StarRatingInput