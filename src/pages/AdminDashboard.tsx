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
import StarRating from "../components/StarRating"
import { API_URL } from "../config"

interface PlatformStats {
  total_users: number
  total_items: number
  requests_pending: number
  requests_approved: number
  requests_rejected: number
  requests_returned: number
  transactions_active: number
  returns_on_time: number
  returns_late: number
}

interface AdminUser {
  id: string
  full_name: string
  email: string
  role: string
  trust_score: number
  average_rating: number | null
  completed_loans: number
  created_at: string
}

interface AdminTransaction {
  id: string
  status: string
  borrowed_at: string
  returned_at: string | null
  item_title: string
  borrower_name: string
  return_note: string | null
}

const txStyles: Record<string, string> = {
  active: "bg-amber-100 text-amber-700 border-amber-200",
  returned: "bg-green-100 text-green-700 border-green-200",
  returned_late: "bg-red-100 text-red-700 border-red-200",
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [forbidden, setForbidden] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    async function fetchAll() {
      try {
        const [statsRes, usersRes, txRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers, cache: "no-store" }),
          fetch(`${API_URL}/admin/users`, { headers, cache: "no-store" }),
          fetch(`${API_URL}/admin/transactions`, { headers, cache: "no-store" }),
        ])

        if (statsRes.status === 403 || usersRes.status === 403 || txRes.status === 403) {
          setForbidden(true)
          return
        }

        if (statsRes.ok) setStats(await statsRes.json())
        if (usersRes.ok) setUsers(await usersRes.json())
        if (txRes.ok) setTransactions(await txRes.json())
      } catch {
        // leave empty states
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [navigate])

  if (forbidden) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Admin access required</h1>
          <p className="text-slate-500">This page is only available to platform administrators.</p>
        </div>
      </div>
    )
  }

  // --- derived analytics, computed from the users list already fetched above ---

  const sortedByTrust = [...users].sort((a, b) => b.trust_score - a.trust_score)

  const chartData = sortedByTrust.map((u) => ({
    name: u.full_name.split(" ")[0], // first name only, keeps bar labels short
    score: u.trust_score,
  }))

  const topBorrower =
    users.length > 0
      ? users.reduce((top, u) => (u.completed_loans > (top?.completed_loans ?? -1) ? u : top), users[0])
      : null

  const ratedUsers = users.filter((u) => u.average_rating !== null)
  const highestRated =
    ratedUsers.length > 0
      ? ratedUsers.reduce((best, u) => (u.average_rating! > best.average_rating! ? u : best))
      : null
  const lowestRated =
    ratedUsers.length > 0
      ? ratedUsers.reduce((worst, u) => (u.average_rating! < worst.average_rating! ? u : worst))
      : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Platform Overview</h1>
        <p className="text-slate-500 mb-8">Monitoring UniLend activity across all users</p>

        {loading ? (
          <p className="text-slate-500">Loading platform data...</p>
        ) : (
          <>
            {stats && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total users", value: stats.total_users },
                    { label: "Items listed", value: stats.total_items },
                    { label: "Active loans", value: stats.transactions_active },
                    { label: "Pending requests", value: stats.requests_pending },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                    >
                      <p className="text-3xl font-extrabold text-violet-800">{card.value}</p>
                      <p className="text-sm text-slate-500 mt-1">{card.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { label: "On-time returns", value: stats.returns_on_time, style: "bg-green-100 text-green-700" },
                    { label: "Late returns", value: stats.returns_late, style: "bg-red-100 text-red-700" },
                    { label: "Approved", value: stats.requests_approved, style: "bg-violet-100 text-violet-700" },
                    { label: "Rejected", value: stats.requests_rejected, style: "bg-slate-100 text-slate-600" },
                    { label: "Completed", value: stats.requests_returned, style: "bg-amber-100 text-amber-700" },
                  ].map((chip) => (
                    <span
                      key={chip.label}
                      className={`text-xs font-semibold rounded-full px-3 py-1 ${chip.style}`}
                    >
                      {chip.label}: {chip.value}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* USER INSIGHTS: highlight cards + trust score distribution */}
            {users.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
                <h2 className="font-bold text-slate-900 mb-1">User Insights</h2>
                <p className="text-sm text-slate-500 mb-5">
                  How trust and activity are distributed across the platform
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-violet-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1">
                      Top Borrower
                    </p>
                    {topBorrower && topBorrower.completed_loans > 0 ? (
                      <>
                        <p className="font-bold text-slate-900">{topBorrower.full_name}</p>
                        <p className="text-sm text-slate-500">
                          {topBorrower.completed_loans} completed loan
                          {topBorrower.completed_loans === 1 ? "" : "s"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">No completed loans yet</p>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                      Highest Rated
                    </p>
                    {highestRated ? (
                      <>
                        <p className="font-bold text-slate-900">{highestRated.full_name}</p>
                        <StarRating score={highestRated.trust_score} size="sm" showValue={false} />
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">No ratings yet</p>
                    )}
                  </div>

                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                      Lowest Rated
                    </p>
                    {lowestRated ? (
                      <>
                        <p className="font-bold text-slate-900">{lowestRated.full_name}</p>
                        <StarRating score={lowestRated.trust_score} size="sm" showValue={false} />
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">No ratings yet</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-2">Trust score by user, highest to lowest</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        <LabelList
                          dataKey="score"
                          position="top"
                          style={{ fill: "#334155", fontSize: 11, fontWeight: 700 }}
                        />
                        {chartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              index === 0
                                ? "#22c55e" // highest: green
                                : index === chartData.length - 1
                                ? "#ef4444" // lowest: red
                                : "#8b5cf6" // everyone else: violet
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
              <h2 className="font-bold text-slate-900 mb-4">Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-100">
                      <th className="pb-2 pr-4 font-medium">Name</th>
                      <th className="pb-2 pr-4 font-medium">Email</th>
                      <th className="pb-2 pr-4 font-medium">Role</th>
                      <th className="pb-2 pr-4 font-medium">Trust score</th>
                      <th className="pb-2 pr-4 font-medium">Rating</th>
                      <th className="pb-2 font-medium">Avg. Lender Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-2.5 pr-4 font-medium text-slate-900">{u.full_name}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{u.email}</td>
                        <td className="py-2.5 pr-4">
                          <span
                            className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                              u.role === "admin"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 font-semibold text-violet-800">{u.trust_score}</td>
                        <td className="py-2.5 pr-4">
                          <StarRating score={u.trust_score} size="sm" />
                        </td>
                        <td className="py-2.5 text-slate-600">
                          {u.average_rating !== null
                            ? `${u.average_rating.toFixed(1)} ★`
                            : "No ratings yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
              <h2 className="font-bold text-slate-900 mb-4">Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-sm text-slate-500">No transactions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-100">
                        <th className="pb-2 pr-4 font-medium">Item</th>
                        <th className="pb-2 pr-4 font-medium">Borrower</th>
                        <th className="pb-2 pr-4 font-medium">Borrowed</th>
                        <th className="pb-2 pr-4 font-medium">Returned</th>
                        <th className="pb-2 pr-4 font-medium">Note</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b border-slate-50 last:border-0">
                          <td className="py-2.5 pr-4 font-medium text-slate-900">{t.item_title}</td>
                          <td className="py-2.5 pr-4 text-slate-600">{t.borrower_name}</td>
                          <td className="py-2.5 pr-4 text-slate-600">
                            {new Date(t.borrowed_at).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-600">
                            {t.returned_at ? new Date(t.returned_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-600">{t.return_note || "—"}</td>
                          <td className="py-2.5">
                            <span
                              className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${txStyles[t.status]}`}
                            >
                              {t.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard