import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">
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