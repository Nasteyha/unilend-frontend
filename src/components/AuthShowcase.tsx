import { useEffect, useState } from "react"

const SLIDES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    chip: "bg-violet-100 text-violet-700",
    title: "Toto listed a Canon Camera",
    desc: "Available now on Browse for other students",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    chip: "bg-amber-100 text-amber-700",
    title: "Request approved",
    desc: "Farah can now contact the lender to arrange pickup",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    chip: "bg-indigo-100 text-indigo-700",
    title: "Trust score: 55 → 60",
    desc: "Another on-time return, another point of reputation earned",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    chip: "bg-purple-100 text-purple-700",
    title: "Item returned on time",
    desc: "Loan closed, item back on the shelf for the next student",
  },
]

function AuthShowcase() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % SLIDES.length)
        setVisible(true)
      }, 300) // matches the fade-out duration below
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const slide = SLIDES[index]

  return (
    <div>
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-900 bg-white/70 backdrop-blur border border-violet-200 rounded-full px-4 py-1 mb-6 shadow-sm">
        <span className="w-2 h-2 bg-violet-700 rounded-full animate-pulse" />
        Live on UniLend
      </div>

      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
        Trust, built one
        <br />
        <span className="bg-gradient-to-r from-amber-500 to-violet-700 text-transparent bg-clip-text">
          borrow at a time.
        </span>
      </h2>

      <p className="mt-4 text-slate-700 leading-relaxed max-w-sm">
        Every listing, approval, and return moves the platform forward —
        here's what that looks like in practice.
      </p>

      {/* the cycling card */}
      <div className="mt-8 relative h-28">
        <div
          className={`absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 flex items-start gap-4 transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${slide.chip}`}>
            {slide.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{slide.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{slide.desc}</p>
          </div>
        </div>
      </div>

      {/* progress dots */}
      <div className="flex gap-1.5 mt-6">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-violet-700" : "w-1.5 bg-violet-200"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default AuthShowcase