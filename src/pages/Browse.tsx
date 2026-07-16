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
  image_url: string | null
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
        const response = await fetch("http://localhost:8000/items/", {
          cache: "no-store",
        })
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
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5 transition"
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-violet-50 to-amber-50 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-violet-200"
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

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${riskStyles[item.risk_level]}`}
                    >
                      {item.risk_level} risk
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                  <p className="text-xs text-slate-400">Up to {item.max_borrow_days} days</p>
                </div>
              </Link>
            ))}
          </div>
        )}
          </div>
    </div>
  )
}

export default Browse