import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"

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

const riskStyles: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
}

function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [returnDate, setReturnDate] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(`http://localhost:8000/items/${id}`)
        if (!response.ok) {
          setItem(null)
          return
        }
        const data = await response.json()
        setItem(data)
      } catch {
        setItem(null)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  async function handleRequest() {
    setMessage("")
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    if (!returnDate) {
      setError("Please choose a return date")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/borrow-requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: id,
          return_deadline: `${returnDate}T00:00:00`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Could not send request")
        return
      }

      setMessage("Borrow request sent! The owner will review it.")
    } catch {
      setError("Could not reach the server. Is the backend running?")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-slate-600">Item not found.</p>
        <Link to="/browse" className="text-violet-900 font-semibold hover:underline">Back to browse</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">← Back to browse</Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-violet-50 to-amber-50 flex items-center justify-center">
              <svg
                className="w-14 h-14 text-violet-200"
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

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.category}</span>
              <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${riskStyles[item.risk_level]}`}>
                {item.risk_level} risk
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{item.title}</h1>
            <p className="text-slate-600 mb-4">{item.description}</p>
            <p className="text-sm text-slate-400 mb-6">Can be borrowed for up to {item.max_borrow_days} days</p>

            <div className="border-t border-slate-100 pt-6">
              <h2 className="font-semibold text-slate-900 mb-3">Request to borrow</h2>

              <label className="block text-sm font-medium text-slate-700 mb-1">Return date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />

              {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">{message}</p>}
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">{error}</p>}

              <button
                onClick={handleRequest}
                className="w-full bg-violet-900 text-white font-semibold rounded-full py-3 shadow-lg hover:bg-violet-950 transition"
              >
                Send borrow request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail