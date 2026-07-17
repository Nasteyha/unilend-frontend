import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
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

function ReceivedRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ReceivedRequest[]>([])
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
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.ok) {
        // refetch so the request moves to its new section (or disappears)
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <Navbar/>
      <div className="max-w-3xl mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">
          ← Back to browse
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-4 mb-8">
          Requests for your items
        </h1>

        {loading ? (
          <p className="text-slate-500">Loading requests...</p>
        ) : (
          <>
            {/* SECTION 1: waiting for a decision */}
            <h2 className="font-bold text-slate-900 mb-3">Waiting for your decision</h2>
            {pending.length === 0 ? (
              <p className="text-sm text-slate-500 mb-8">No pending requests right now.</p>
            ) : (
              <div className="space-y-4 mb-10">
                {pending.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Requested by <span className="font-medium">{r.borrower_name}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Trust score:{" "}
                          <span className="font-semibold text-violet-900">
                            {r.borrower_trust_score}
                          </span>
                        </p>
                        {r.return_deadline && (
                          <p className="text-sm text-slate-500 mt-1">
                            Proposed return: {new Date(r.return_deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(r.id, "approve")}
                          className="text-sm font-semibold bg-violet-900 text-white rounded-full px-5 py-2 hover:bg-violet-950 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "reject")}
                          className="text-sm font-semibold bg-white text-slate-700 border border-slate-300 rounded-full px-5 py-2 hover:border-red-300 hover:text-red-600 transition"
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
            <h2 className="font-bold text-slate-900 mb-3">Currently borrowed</h2>
            {borrowed.length === 0 ? (
              <p className="text-sm text-slate-500">None of your items are out right now.</p>
            ) : (
              <div className="space-y-4">
                {borrowed.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                          {isOverdue(r.return_deadline) && (
                            <span className="text-xs font-semibold bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5">
                              overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Borrowed by <span className="font-medium">{r.borrower_name}</span>
                        </p>
                        {r.return_deadline && (
                          <p className="text-sm text-slate-500 mt-1">
                            Contact: <a href={`mailto:${r.borrower_email}`} className="text-violet-700 hover:underline">{r.borrower_email}</a>
                            Due back: {new Date(r.return_deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAction(r.id, "return")}
                        className="text-sm font-semibold bg-white text-violet-900 border border-violet-300 rounded-full px-5 py-2 hover:bg-violet-50 transition shrink-0"
                      >
                        Mark as returned
                      </button>
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