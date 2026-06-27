import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

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
}

function ReceivedRequests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ReceivedRequest[]>([])
  const [loading, setLoading] = useState(true)

  function getToken() {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")
    return token
  }

  async function fetchRequests() {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await fetch("http://localhost:8000/borrow-requests/received", {
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

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleDecision(requestId: string, action: "approve" | "reject") {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await fetch(`http://localhost:8000/borrow-requests/${requestId}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        // remove the decided request from the list
        setRequests((prev) => prev.filter((r) => r.id !== requestId))
      }
    } catch {
      // leave the list as is on failure
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">← Back to browse</Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-4 mb-8">Requests for your items</h1>

        {loading ? (
          <p className="text-slate-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-slate-500">No pending requests right now.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{r.item_title}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Requested by <span className="font-medium">{r.borrower_name}</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Trust score:{" "}
                      <span className="font-semibold text-violet-900">{r.borrower_trust_score}</span>
                    </p>
                    {r.return_deadline && (
                      <p className="text-sm text-slate-500 mt-1">
                        Proposed return: {new Date(r.return_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(r.id, "approve")}
                      className="text-sm font-semibold bg-violet-900 text-white rounded-full px-5 py-2 hover:bg-violet-950 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(r.id, "reject")}
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
      </div>
    </div>
  )
}

export default ReceivedRequests