import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, PackageOpen, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import type { ReactElement } from "react"
import Navbar from "../components/Navbar"
import { API_URL } from "../config"

interface Item {
  id: string
  title: string
  description: string
  category: string
  risk_level: "low" | "medium" | "high"
  status: string
  owner_id: string
  max_borrow_days: number
  image_url: string | null
}

const riskStyles: Record<string, { badge: string; icon: ReactElement }> = {
  low: {
    badge: "bg-green-50 text-green-700 border-green-200",
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  medium: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <ShieldQuestion className="w-3 h-3" />,
  },
  high: {
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: <ShieldAlert className="w-3 h-3" />,
  },
}

// --- reused doodle set, same style as the rest of the app ---
function CameraDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="14" width="62" height="32" rx="6" />
      <path d="M18 14 L23 5 H41 L46 14" />
      <circle cx="32" cy="30" r="12" />
      <circle cx="32" cy="30" r="5" />
      <circle cx="52" cy="21" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function LaptopDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="1" width="64" height="42" rx="3" />
      <path d="M1 51 H79 L70 43 H10 Z" />
      <line x1="24" y1="14" x2="56" y2="14" />
    </svg>
  )
}
function BackpackDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 76" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="18" width="52" height="54" rx="14" />
      <path d="M16 18 V8 a14 14 0 0 1 28 0 v10" />
      <rect x="20" y="34" width="20" height="14" rx="3" />
      <line x1="4" y1="30" x2="0" y2="30" />
      <line x1="56" y1="30" x2="60" y2="30" />
    </svg>
  )
}
function MugDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 54 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="14" width="42" height="40" rx="8" />
      <path d="M44 22 h8 a9 9 0 0 1 0 18 h-8" />
      <path d="M12 2 q3 5 0 8" />
      <path d="M22 0 q3 5 0 8" />
      <path d="M32 2 q3 5 0 8" />
    </svg>
  )
}
function BooksDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 70 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="26" width="60" height="10" rx="2" />
      <rect x="6" y="14" width="52" height="10" rx="2" />
      <rect x="0" y="2" width="56" height="10" rx="2" />
    </svg>
  )
}
function PlaneDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 20 L58 2 L34 42 L24 26 Z" />
      <path d="M24 26 L2 20" />
    </svg>
  )
}
function NotebookDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="44" height="56" rx="4" />
      <line x1="2" y1="14" x2="10" y2="14" />
      <line x1="2" y1="24" x2="10" y2="24" />
      <line x1="2" y1="34" x2="10" y2="34" />
      <line x1="16" y1="16" x2="38" y2="16" />
      <line x1="16" y1="24" x2="38" y2="24" />
      <line x1="16" y1="32" x2="30" y2="32" />
    </svg>
  )
}
function CalculatorDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="40" height="52" rx="5" />
      <rect x="8" y="8" width="28" height="10" rx="2" />
      <circle cx="12" cy="28" r="2.5" />
      <circle cx="22" cy="28" r="2.5" />
      <circle cx="32" cy="28" r="2.5" />
      <circle cx="12" cy="38" r="2.5" />
      <circle cx="22" cy="38" r="2.5" />
      <circle cx="32" cy="38" r="2.5" />
      <circle cx="12" cy="48" r="2.5" />
      <circle cx="22" cy="48" r="2.5" />
    </svg>
  )
}
function HeadphonesDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 30 V24 a26 26 0 0 1 52 0 v6" />
      <rect x="0" y="28" width="14" height="18" rx="5" />
      <rect x="46" y="28" width="14" height="18" rx="5" />
    </svg>
  )
}
function RulerDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 70 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="1" width="68" height="20" rx="3" />
      <line x1="10" y1="1" x2="10" y2="9" />
      <line x1="20" y1="1" x2="20" y2="13" />
      <line x1="30" y1="1" x2="30" y2="9" />
      <line x1="40" y1="1" x2="40" y2="13" />
      <line x1="50" y1="1" x2="50" y2="9" />
      <line x1="60" y1="1" x2="60" y2="13" />
    </svg>
  )
}
function PencilDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 14 L44 2 L58 6 L48 16 Z" />
      <line x1="38" y1="4" x2="42" y2="14" />
      <path d="M2 14 L6 18 L10 15 Z" fill="currentColor" />
    </svg>
  )
}
function BulbDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 2 a16 16 0 0 1 8 30 c-2 2-3 5-3 8 H15 c0-3-1-6-3-8 A16 16 0 0 1 20 2Z" />
      <line x1="15" y1="44" x2="25" y2="44" />
      <line x1="16" y1="50" x2="24" y2="50" />
    </svg>
  )
}
function SparkleDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
    </svg>
  )
}
function DiamondDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" />
    </svg>
  )
}

function BackgroundDoodles() {
  return (
    <div className="doodle-layer absolute inset-0 pointer-events-none text-violet-600">
      <CameraDoodle className="absolute top-24 left-4 w-16 h-12 opacity-[0.20] -rotate-6" />
      <PlaneDoodle className="absolute top-72 left-10 w-14 h-10 opacity-[0.18] -rotate-12" />
      <BackpackDoodle className="absolute top-[30rem] left-4 w-14 h-18 opacity-[0.20] rotate-3" />
      <RulerDoodle className="absolute bottom-64 left-6 w-16 h-6 opacity-[0.18] rotate-6 text-amber-600" />
      <NotebookDoodle className="absolute bottom-24 left-8 w-12 h-16 opacity-[0.18] -rotate-6" />

      <LaptopDoodle className="absolute top-16 right-4 w-20 h-14 opacity-[0.20] rotate-3" />
      <MugDoodle className="absolute top-72 right-8 w-12 h-14 opacity-[0.18] -rotate-6 text-amber-600" />
      <HeadphonesDoodle className="absolute top-[28rem] right-4 w-16 h-14 opacity-[0.18] rotate-6" />
      <BooksDoodle className="absolute bottom-56 right-6 w-16 h-10 opacity-[0.20] rotate-2 text-amber-600" />
      <CalculatorDoodle className="absolute bottom-20 right-10 w-11 h-14 opacity-[0.18]" />
      <BulbDoodle className="absolute top-[20rem] right-2 w-10 h-14 opacity-[0.18] text-amber-600" />
      <PencilDoodle className="absolute bottom-96 left-40 w-14 h-5 opacity-[0.16] -rotate-3 text-amber-600" />

      <SparkleDoodle className="absolute top-32 left-24 w-4 h-4 text-amber-500 opacity-45" />
      <DiamondDoodle className="absolute top-52 left-14 w-3.5 h-3.5 text-violet-500 opacity-40" />
      <span className="absolute top-64 left-32 w-2 h-2 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute top-96 left-18 w-3 h-3 text-violet-500 opacity-40" />
      <DiamondDoodle className="absolute top-[18rem] left-28 w-3 h-3 text-amber-500 opacity-35" />
      <span className="absolute top-[26rem] left-10 w-1.5 h-1.5 rounded-full bg-violet-500 opacity-45" />
      <SparkleDoodle className="absolute bottom-80 left-20 w-3.5 h-3.5 text-amber-500 opacity-40" />
      <DiamondDoodle className="absolute bottom-52 left-12 w-3 h-3 text-violet-500 opacity-35" />
      <span className="absolute bottom-12 left-24 w-2 h-2 rounded-full bg-amber-500 opacity-45" />

      <SparkleDoodle className="absolute top-40 right-24 w-4 h-4 text-violet-500 opacity-45" />
      <DiamondDoodle className="absolute top-60 right-14 w-3.5 h-3.5 text-amber-500 opacity-40" />
      <span className="absolute top-84 right-32 w-2 h-2 rounded-full bg-violet-500 opacity-50" />
      <SparkleDoodle className="absolute top-[16rem] right-20 w-3 h-3 text-amber-500 opacity-40" />
      <DiamondDoodle className="absolute top-[22rem] right-28 w-3 h-3 text-violet-500 opacity-35" />
      <span className="absolute top-[32rem] right-10 w-1.5 h-1.5 rounded-full bg-amber-500 opacity-45" />
      <SparkleDoodle className="absolute bottom-72 right-16 w-3.5 h-3.5 text-violet-500 opacity-40" />
      <DiamondDoodle className="absolute bottom-40 right-24 w-3 h-3 text-amber-500 opacity-35" />
      <span className="absolute bottom-8 right-14 w-2 h-2 rounded-full bg-violet-500 opacity-45" />
    </div>
  )
}

function BlueprintPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="blueprint-browse" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <rect x="70" y="20" width="34" height="34" transform="rotate(45 87 37)" fill="none" stroke="#6d28d9" strokeWidth="0.6" />
          <rect x="10" y="90" width="30" height="30" transform="skewX(-15) rotate(10 25 105)" fill="none" stroke="#f59e0b" strokeWidth="0.6" />
          <path d="M130 110 L155 150 L105 150 Z" fill="none" stroke="#6d28d9" strokeWidth="0.5" />
          <rect x="10" y="10" width="14" height="14" transform="rotate(45 17 17)" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-browse)" opacity="0.025" />
    </svg>
  )
}

function Browse() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch(`${API_URL}/items/`, {
          cache: "no-store",
        })
        const data = await response.json()
        setItems(data)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #F5F1FF, #FFF7E8)" }}
    >
      <div
        className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.13) 0%, transparent 70%)" }}
      />

      <BlueprintPattern />
      <BackgroundDoodles />

      <Navbar />

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Browse{" "}
              <span className="bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent">
                items
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Discover what your campus community is lending
            </p>
          </div>
          <Link
            to="/create-listing"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden text-sm font-semibold bg-gradient-to-r from-violet-700 via-violet-800 to-violet-900 text-white rounded-full px-5 py-2.5 shadow-lg shadow-violet-900/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
              List an item
            </span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden animate-pulse"
              >
                <div className="w-full h-40 bg-slate-100/80" />
                <div className="p-5 space-y-2">
                  <div className="h-3 w-16 bg-slate-100/80 rounded-full" />
                  <div className="h-4 w-3/4 bg-slate-100/80 rounded-full" />
                  <div className="h-3 w-full bg-slate-100/80 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center text-center py-20 bg-white/[0.70] backdrop-blur-sm rounded-3xl border border-white/60 overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200 to-transparent rounded-full blur-2xl opacity-50" />
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
              <PackageOpen className="w-7 h-7 text-violet-500" />
            </div>
            <p className="text-slate-600 font-medium">No items available right now</p>
            <p className="text-sm text-slate-400 mt-1">Be the first to list something for others to borrow</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="group bg-white/[0.88] backdrop-blur-xl rounded-2xl border border-white/70 shadow-[0_8px_30px_rgba(109,40,217,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_50px_rgba(109,40,217,0.16)] hover:border-violet-200 hover:-translate-y-1"
              >
                {item.image_url ? (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-violet-50 to-amber-50 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-violet-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-0.5 ${riskStyles[item.risk_level].badge}`}
                    >
                      {riskStyles[item.risk_level].icon}
                      {item.risk_level} risk
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 transition-colors group-hover:text-violet-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                  <p className="text-xs text-slate-400">Up to {item.max_borrow_days} days</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse