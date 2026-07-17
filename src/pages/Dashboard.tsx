import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts"
import Navbar from "../components/Navbar"
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

const CHART_LEGEND = [
  {
    color: "bg-amber-400",
    label: "Items listed",
    desc: "Everything you've put up for others to borrow",
  },
  {
    color: "bg-violet-300",
    label: "Requests sent",
    desc: "Items you've asked to borrow from other students",
  },
  {
    color: "bg-violet-500",
    label: "Pending",
    desc: "Requests on your items waiting for your decision",
  },
  {
    color: "bg-violet-800",
    label: "Approved",
    desc: "Your requests that lenders have accepted",
  },
]

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
        { name: "Items listed", value: stats.items_listed },
        { name: "Requests sent", value: stats.requests_sent },
        { name: "Pending", value: stats.requests_received_pending },
        { name: "Approved", value: stats.requests_approved },
      ]
    : []

  const statCards = stats
    ? [
        {
          label: "Items listed",
          value: stats.items_listed,
          accent: "text-violet-700",
          chip: "bg-violet-100 text-violet-700",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          label: "Currently borrowed",
          value: stats.items_currently_borrowed,
          accent: "text-violet-700",
          chip: "bg-purple-100 text-purple-700",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
        },
        {
          label: "Pending requests",
          value: stats.requests_received_pending,
          accent: "text-violet-700",
          chip: "bg-indigo-100 text-indigo-700",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: "Trust score",
          value: stats.trust_score,
          accent: "text-amber-600",
          chip: "bg-amber-100 text-amber-700",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
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
        <p className="text-slate-500">
          {user ? `Signed in as ${user.email}` : ""}
        </p>

        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.chip}`}
                  >
                    {card.icon}
                  </div>
                  <p className={`text-3xl font-extrabold ${card.accent}`}>
                    {card.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
              <h3 className="font-bold text-slate-900">Activity overview</h3>
              <p className="text-sm text-slate-500 mb-5">
                Your lending activity at a glance
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={52}>
                    <defs>
                      {BAR_GRADIENTS.map((g) => (
                        <linearGradient
                          key={g.id}
                          id={g.id}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={g.from} />
                          <stop offset="100%" stopColor={g.to} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "13px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        style={{ fill: "#334155", fontSize: 13, fontWeight: 700 }}
                      />
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={`url(#${BAR_GRADIENTS[index].id})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
                {CHART_LEGEND.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${item.color}`}
                    />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {item.label}
                      </span>{" "}
                      — {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard