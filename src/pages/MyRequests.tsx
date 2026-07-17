import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { API_URL } from "../config"

interface MyRequest {
  id: string
  status: "pending" | "approved" | "rejected" | "returned"
  requested_at: string
  return_deadline: string | null
  item_id: string
  item_title: string
  lender_name: string
  lender_email: string
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  returned: "bg-violet-100 text-violet-700 border-violet-200",
}

function MyRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<MyRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyRequests() {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }
      try {
        const response = await fetch(`${API_URL}/borrow-requests/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        if (!response.ok) {
          setRequests([])
          return
        }
        const data = await response.json()
        setRequests(data)
        localStorage.setItem(
          "seenApprovedCount",
           String(data.filter((r: MyRequest) => r.status === "approved").length)
)
      } catch {
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetchMyRequests()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-8">
          My requests
        </h1>

        {loading ? (
          <p className="text-slate-500">Loading your requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500">You haven't requested anything yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                  {r.return_deadline && (
                    <p className="text-sm text-slate-500 mt-1">
                      Return by: {new Date(r.return_deadline).toLocaleDateString()}
                    </p>
                  )}
                  {r.status === "approved" && (
                    <p className="text-sm text-slate-600 mt-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2">
                      Approved! Contact{" "}
                      <span className="font-semibold">{r.lender_name}</span> at{" "}
                      <a
                        href={`mailto:${r.lender_email}`}
                        className="text-violet-700 font-medium hover:underline"
                      >
                        {r.lender_email}
                      </a>{" "}
                      to arrange pickup.
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold border rounded-full px-3 py-1 capitalize shrink-0 ${statusStyles[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRequests