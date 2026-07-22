import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import { Package, ArrowLeftRight, Clock, TrendingUp, Activity } from "lucide-react"
import Navbar from "../components/Navbar"
import StarRating from "../components/StarRating"
import { API_URL } from "../config"

interface User {
  id: string
  full_name: string
  email: string
}

interface DashboardStats {
  items_listed: number
  items_currently_borrowed: number
  requests_sent: number
  requests_received_pending: number
  requests_approved: number
  trust_score: number
}

const BAR_GRADIENTS = [
  { id: "gradAmber", from: "#fbbf24", to: "#f59e0b" },
  { id: "gradLilac", from: "#c4b5fd", to: "#a78bfa" },
  { id: "gradViolet", from: "#a78bfa", to: "#8b5cf6" },
  { id: "gradDeep", from: "#8b5cf6", to: "#6d28d9" },
]

// same thresholds enforced on the backend: low=0, medium=50, high=70
function getTrustLevel(score: number) {
  if (score >= 70) {
    return {
      label: "Power Lender",
      next: null,
      nextLabel: null,
      floor: 70,
      ceiling: 100,
    }
  }
  if (score >= 50) {
    return {
      label: "Trusted Member",
      next: 70,
      nextLabel: "Power Lender",
      floor: 50,
      ceiling: 70,
    }
  }
  return {
    label: "Building Trust",
    next: 50,
    nextLabel: "Trusted Member",
    floor: 0,
    ceiling: 50,
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    async function fetchUser() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }

        const data = await response.json()
        setUser(data)
      } catch {
        navigate("/login")
      }
    }

    async function fetchStats() {
      try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) return

        const data = await response.json()
        setStats(data)
      } catch {
        // stats are non-critical: the dashboard still works without them
      }
    }

    fetchUser()
    fetchStats()
  }, [navigate])

  const chartData = stats
    ? [
        { name: "Listed", value: stats.items_listed },
        { name: "Sent", value: stats.requests_sent },
        { name: "Pending", value: stats.requests_received_pending },
        { name: "Approved", value: stats.requests_approved },
      ]
    : []

  const totalActivity = chartData.reduce((sum, d) => sum + d.value, 0)

  const statCards = stats
    ? [
        {
          key: "items_listed",
          label: "Items listed",
          value: stats.items_listed,
          accent: "text-violet-700",
          chip: "bg-violet-100 text-violet-700",
          icon: <Package className="w-4.5 h-4.5" />,
        },
        {
          key: "currently_borrowed",
          label: "Currently borrowed",
          value: stats.items_currently_borrowed,
          accent: "text-violet-700",
          chip: "bg-purple-100 text-purple-700",
          icon: <ArrowLeftRight className="w-4.5 h-4.5" />,
        },
        {
          key: "pending_requests",
          label: "Pending requests",
          value: stats.requests_received_pending,
          accent: "text-violet-700",
          chip: "bg-indigo-100 text-indigo-700",
          icon: <Clock className="w-4.5 h-4.5" />,
        },
      ]
    : []

  const trustLevel = stats ? getTrustLevel(stats.trust_score) : null
  const progressPercent =
    trustLevel && trustLevel.next
      ? Math.min(100, ((stats!.trust_score - trustLevel.floor) / (trustLevel.ceiling - trustLevel.floor)) * 100)
      : 100

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute top-96 -left-32 w-80 h-80 bg-amber-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <Navbar />

      <main className="relative max-w-6xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-0.5">
          {user ? (
            <>
              Welcome,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent">
                {user.full_name}
              </span>
            </>
          ) : (
            "Loading..."
          )}
        </h2>
        <p className="text-sm text-slate-500">{user ? `Signed in as ${user.email}` : ""}</p>

        {!stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 rounded-xl border border-slate-200 h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* STAT CARDS — compact row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {statCards.map((card) => (
                <div
                  key={card.key}
                  className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm px-4 py-3 transition-all duration-300 hover:shadow-md hover:border-violet-200"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${card.chip}`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xl font-extrabold leading-tight ${card.accent}`}>{card.value}</p>
                    <p className="text-xs text-slate-500 truncate">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN ROW: chart + trust card side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
              {/* ACTIVITY CHART — takes more width */}
              <div className="lg:col-span-3 relative bg-white rounded-2xl border border-slate-200 shadow-md shadow-violet-900/5 p-5 overflow-hidden">
                <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-violet-200 rounded-full blur-3xl opacity-25" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-sm">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Activity overview</h3>
                        <p className="text-xs text-slate-500">Your lending activity</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent leading-tight">
                        {totalActivity}
                      </p>
                      <p className="text-[11px] text-slate-400">total</p>
                    </div>
                  </div>

                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={44}>
                        <defs>
                          {BAR_GRADIENTS.map((g) => (
                            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={g.from} />
                              <stop offset="100%" stopColor={g.to} />
                            </linearGradient>
                          ))}
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
                          contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={700}>
                          <LabelList dataKey="value" position="top" style={{ fill: "#1e293b", fontSize: 12, fontWeight: 700 }} />
                          {chartData.map((entry, index) => (
                            <Cell key={entry.name} fill={`url(#${BAR_GRADIENTS[index].id})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* compact single-line legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-400" />Listed</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-full bg-violet-300" />Sent</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-full bg-violet-500" />Pending</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-full bg-violet-800" />Approved</span>
                  </div>
                </div>
              </div>

              {/* TRUST REPUTATION CARD */}
              {trustLevel && (
                <div className="lg:col-span-2 relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-5 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                            {trustLevel.label}
                          </span>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900 leading-tight">
                          {stats.trust_score}
                          <span className="text-sm font-medium text-slate-400"> / 100</span>
                        </p>
                      </div>
                      <StarRating score={stats.trust_score} size="sm" showValue={false} />
                    </div>

                    {trustLevel.next && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>{trustLevel.label}</span>
                          <span>{trustLevel.nextLabel} · {trustLevel.next}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-violet-600 transition-all duration-700 ease-out"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* tier breakdown — fills the space with real, useful info */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      {[
                        { name: "Low risk", threshold: 0 },
                        { name: "Medium", threshold: 50 },
                        { name: "High risk", threshold: 70 },
                      ].map((tier) => {
                        const unlocked = stats.trust_score >= tier.threshold
                        return (
                          <div
                            key={tier.name}
                            className={`rounded-lg px-2 py-1.5 text-center ${
                              unlocked ? "bg-violet-50" : "bg-slate-50"
                            }`}
                          >
                            <p className={`text-[10px] font-semibold ${unlocked ? "text-violet-700" : "text-slate-400"}`}>
                              {tier.name}
                            </p>
                            <p className={`text-[10px] mt-0.5 ${unlocked ? "text-violet-500" : "text-slate-400"}`}>
                              {unlocked ? "Unlocked" : `Needs ${tier.threshold}`}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECONDARY ROW: activity snapshot chips */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm px-5 py-4 mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-bold text-sm text-slate-900">Your activity snapshot</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium bg-violet-50 text-violet-700 rounded-full px-3 py-1">
                  {stats.items_listed} listed
                </span>
                <span className="text-xs font-medium bg-amber-50 text-amber-700 rounded-full px-3 py-1">
                  {stats.requests_approved} approved
                </span>
                <span className="text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">
                  {stats.requests_sent} sent
                </span>
                <span className="text-xs font-medium bg-purple-50 text-purple-700 rounded-full px-3 py-1">
                  {stats.items_currently_borrowed} on loan
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard