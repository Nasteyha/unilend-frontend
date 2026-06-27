import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

interface MyRequest {
  id: string
  status: "pending" | "approved" | "rejected"
  requested_at: string
  return_deadline: string | null
  item_id: string
  item_title: string
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
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
        const response = await fetch("http://localhost:8000/borrow-requests/mine", {
          headers: { Authorization: `Bearer ${token}` },
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
    fetchMyRequests()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">← Back to browse</Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-4 mb-8">My requests</h1>

        {loading ? (
          <p className="text-slate-500">Loading your requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500">You haven't requested anything yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                  {r.return_deadline && (
                    <p className="text-sm text-slate-500 mt-1">
                      Return by: {new Date(r.return_deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-semibold border rounded-full px-3 py-1 capitalize ${statusStyles[r.status]}`}>
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