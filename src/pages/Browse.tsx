import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Item {
  id: string
  title: string
  description: string
  category: string
  risk_level: "low" | "medium" | "high"
  status: string
  owner_id: string
  max_borrow_days: number
}

const riskStyles: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
}

function Browse() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("http://localhost:8000/items/")
        const data = await response.json()
        setItems(data)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Browse items</h1>
          <Link
            to="/create-listing"
            className="text-sm font-semibold bg-violet-900 text-white rounded-full px-5 py-2.5 hover:bg-violet-950 transition shadow"
          >
            List an item
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500">No items available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-violet-200 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${riskStyles[item.risk_level]}`}>
                    {item.risk_level} risk
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                <p className="text-xs text-slate-400">Up to {item.max_borrow_days} days</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse