import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function CreateListing() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [riskLevel, setRiskLevel] = useState("low")
  const [maxBorrowDays, setMaxBorrowDays] = useState("14")
  const [error, setError] = useState("")

  async function handleCreate() {
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    if (!title || !description || !category) {
      setError("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          risk_level: riskLevel,
          max_borrow_days: parseInt(maxBorrowDays),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(typeof data?.detail === "string" ? data.detail : "Could not create listing")
        return
      }

      navigate("/browse")
    } catch {
      setError("Could not reach the server. Is the backend running?")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <div className="max-w-lg mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">← Back to browse</Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-4">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">List an item</h1>
          <p className="text-sm text-slate-500 mb-6">Share something for other students to borrow</p>

          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scientific Calculator"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item and its condition"
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Electronics, Tools, Textbooks"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Risk level</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max borrow days</label>
              <input
                type="number"
                value={maxBorrowDays}
                onChange={(e) => setMaxBorrowDays(e.target.value)}
                min="1"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">{error}</p>}

          <button
            onClick={handleCreate}
            className="w-full bg-violet-900 text-white font-semibold rounded-full py-3 shadow-lg hover:bg-violet-950 transition"
          >
            List item
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateListing