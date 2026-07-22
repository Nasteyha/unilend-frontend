import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Inbox,
  Clock3,
  Mail,
  AlertTriangle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import StarRating from "../components/StarRating"
import StarRatingInput from "../components/StarRatingInput"
import { API_URL } from "../config"

interface ReceivedRequest {
  id: string
  status: string
  requested_at: string
  return_deadline: string | null
  item_id: string
  item_title: string
  borrower_id: string
  borrower_name: string
  borrower_trust_score: number
  borrower_email: string
}

// --- reused doodle set, same style as Create Listing ---
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
      {/* anchor icons, left flank */}
      <CameraDoodle className="absolute top-24 left-4 w-16 h-12 opacity-[0.20] -rotate-6" />
      <PlaneDoodle className="absolute top-72 left-10 w-14 h-10 opacity-[0.18] -rotate-12" />
      <BackpackDoodle className="absolute top-[30rem] left-4 w-14 h-18 opacity-[0.20] rotate-3" />
      <RulerDoodle className="absolute bottom-64 left-6 w-16 h-6 opacity-[0.18] rotate-6 text-amber-600" />
      <NotebookDoodle className="absolute bottom-24 left-8 w-12 h-16 opacity-[0.18] -rotate-6" />

      {/* anchor icons, right flank */}
      <LaptopDoodle className="absolute top-16 right-4 w-20 h-14 opacity-[0.20] rotate-3" />
      <MugDoodle className="absolute top-72 right-8 w-12 h-14 opacity-[0.18] -rotate-6 text-amber-600" />
      <HeadphonesDoodle className="absolute top-[28rem] right-4 w-16 h-14 opacity-[0.18] rotate-6" />
      <BooksDoodle className="absolute bottom-56 right-6 w-16 h-10 opacity-[0.20] rotate-2 text-amber-600" />
      <CalculatorDoodle className="absolute bottom-20 right-10 w-11 h-14 opacity-[0.18]" />
      <BulbDoodle className="absolute top-[20rem] right-2 w-10 h-14 opacity-[0.18] text-amber-600" />
      <PencilDoodle className="absolute bottom-96 left-40 w-14 h-5 opacity-[0.16] -rotate-3 text-amber-600" />

      {/* left scatter — sparkles, diamonds, dots */}
      <SparkleDoodle className="absolute top-32 left-24 w-4 h-4 text-amber-500 opacity-45" />
      <DiamondDoodle className="absolute top-52 left-14 w-3.5 h-3.5 text-violet-500 opacity-40" />
      <span className="absolute top-64 left-32 w-2 h-2 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute top-96 left-18 w-3 h-3 text-violet-500 opacity-40" />
      <DiamondDoodle className="absolute top-[18rem] left-28 w-3 h-3 text-amber-500 opacity-35" />
      <span className="absolute top-[26rem] left-10 w-1.5 h-1.5 rounded-full bg-violet-500 opacity-45" />
      <SparkleDoodle className="absolute bottom-80 left-20 w-3.5 h-3.5 text-amber-500 opacity-40" />
      <DiamondDoodle className="absolute bottom-52 left-12 w-3 h-3 text-violet-500 opacity-35" />
      <span className="absolute bottom-12 left-24 w-2 h-2 rounded-full bg-amber-500 opacity-45" />

      {/* right scatter — sparkles, diamonds, dots */}
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
        <pattern id="blueprint-rr" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <rect x="70" y="20" width="34" height="34" transform="rotate(45 87 37)" fill="none" stroke="#6d28d9" strokeWidth="0.6" />
          <rect x="10" y="90" width="30" height="30" transform="skewX(-15) rotate(10 25 105)" fill="none" stroke="#f59e0b" strokeWidth="0.6" />
          <path d="M130 110 L155 150 L105 150 Z" fill="none" stroke="#6d28d9" strokeWidth="0.5" />
          <rect x="10" y="10" width="14" height="14" transform="rotate(45 17 17)" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-rr)" opacity="0.025" />
    </svg>
  )
}



function ReceivedRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ReceivedRequest[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  async function fetchRequests() {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await fetch(`${API_URL}/borrow-requests/received`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (!response.ok) {
        setRequests([])
        return
      }
      const data = await response.json()
      setRequests(data)
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleAction(requestId: string, action: "approve" | "reject" | "return") {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await fetch(
        `${API_URL}/borrow-requests/${requestId}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:
            action === "return"
              ? JSON.stringify({
                  return_note: notes[requestId] || null,
                  lender_rating: ratings[requestId] || null,
                })
              : undefined,
        }
      )
      if (response.ok) {
        await fetchRequests()
      }
    } catch {
      // leave the list as is on failure
    }
  }

  const pending = requests.filter((r) => r.status === "pending")
  const borrowed = requests.filter((r) => r.status === "approved")

  const isOverdue = (deadline: string | null) =>
    deadline ? new Date(deadline) < new Date() : false

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #F5F1FF, #FFF7E8)" }}
    >
      {/* soft glow blobs, opposite corners */}
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

      <div className="relative max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-sm shrink-0">
            <Inbox className="w-4.5 h-4.5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Requests for your{" "}
            <span className="bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent">
              items
            </span>
          </h1>
        </div>
        <p className="text-sm text-slate-500 mb-8 ml-11">
          Review borrow requests and manage items currently on loan
        </p>

        {loading ? (
          <p className="text-slate-500">Loading requests...</p>
        ) : (
          <>
            {/* SECTION 1: waiting for a decision */}
            <div className="flex items-center gap-2 mb-3">
              <Clock3 className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Waiting for your decision
              </h2>
            </div>

            {pending.length === 0 ? (
              <div className="bg-white/[0.70] backdrop-blur-sm rounded-2xl border border-white/60 px-6 py-5 mb-10">
                <p className="text-sm text-slate-500">No pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4 mb-10">
                {pending.map((r) => (
                  <div
                    key={r.id}
                    className="relative bg-white/[0.88] backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_10px_40px_rgba(109,40,217,0.10)] p-6 overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-violet-200 to-transparent rounded-full blur-2xl opacity-60" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Requested by <span className="font-medium">{r.borrower_name}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-slate-500">Trust score:</span>
                          <StarRating score={r.borrower_trust_score} size="sm" />
                        </div>
                        {r.return_deadline && (
                          <p className="text-xs text-slate-400 mt-1.5">
                            Proposed return: {new Date(r.return_deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(r.id, "approve")}
                          className="group relative overflow-hidden text-sm font-semibold bg-gradient-to-r from-violet-700 to-violet-900 text-white rounded-full px-5 py-2 shadow-md shadow-violet-900/25 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/40 hover:-translate-y-0.5"
                        >
                          <span className="relative z-10">Approve</span>
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "reject")}
                          className="text-sm font-semibold bg-white/70 text-slate-700 border border-slate-300/70 rounded-full px-5 py-2 hover:border-red-300 hover:text-red-600 hover:bg-white transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 2: currently borrowed, awaiting return */}
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Currently borrowed
              </h2>
            </div>

            {borrowed.length === 0 ? (
              <div className="bg-white/[0.70] backdrop-blur-sm rounded-2xl border border-white/60 px-6 py-5">
                <p className="text-sm text-slate-500">None of your items are out right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {borrowed.map((r) => (
                  <div
                    key={r.id}
                    className="relative bg-white/[0.88] backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_10px_40px_rgba(109,40,217,0.10)] p-6 overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-2xl opacity-60" />
                    <div className="relative flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                          {isOverdue(r.return_deadline) && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Borrowed by <span className="font-medium">{r.borrower_name}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`mailto:${r.borrower_email}`}
                            className="text-violet-700 hover:underline"
                          >
                            {r.borrower_email}
                          </a>
                        </p>
                        {r.return_deadline && (
                          <p className="text-xs text-slate-400 mt-1.5">
                            Due back: {new Date(r.return_deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0 w-full sm:w-56">
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-1">Rate this borrower</p>
                          <StarRatingInput
                            value={ratings[r.id] || null}
                            onChange={(rating) => setRatings({ ...ratings, [r.id]: rating })}
                          />
                        </div>
                        <input
                          type="text"
                          value={notes[r.id] || ""}
                          onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                          placeholder="Condition note (optional)"
                          className="border border-slate-200/80 rounded-xl px-3 py-2.5 text-sm bg-slate-50/70 transition-all duration-300 hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400 focus:bg-white"
                        />
                        <button
                          onClick={() => handleAction(r.id, "return")}
                          className="text-sm font-semibold bg-white/80 text-violet-900 border border-violet-300/80 rounded-full px-4 py-2 hover:bg-violet-50 hover:shadow-sm transition"
                        >
                          Mark as returned
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReceivedRequests