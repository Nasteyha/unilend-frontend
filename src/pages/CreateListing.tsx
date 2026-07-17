import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { API_URL } from "../config"
function CreateListing() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [riskLevel, setRiskLevel] = useState("low")
  const [maxBorrowDays, setMaxBorrowDays] = useState("14")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

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

    setSubmitting(true)

    try {
      // Step 1: upload the photo first (if one was chosen)
      let imageUrl: string | null = null

      if (photo) {
        const formData = new FormData()
        formData.append("file", photo)

        const uploadResponse = await fetch(
          `${API_URL}/items/upload-image`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        )

        if (!uploadResponse.ok) {
          setError("Photo upload failed — try again or remove the photo")
          setSubmitting(false)
          return
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.image_url
      }

      // Step 2: create the item, including the image URL if we have one
      const response = await fetch(`${API_URL}/items/`, {
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
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(
          typeof data?.detail === "string" ? data.detail : "Could not create listing"
        )
        setSubmitting(false)
        return
      }

      navigate("/browse")
    } catch {
      setError("Could not reach the server. Is the backend running?")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-violet-50 to-white px-6 py-10">
      <Navbar/>
      <div className="max-w-lg mx-auto">
        <Link to="/browse" className="text-sm text-slate-500 hover:text-violet-900">
          ← Back to browse
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mt-4">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">List an item</h1>
          <p className="text-sm text-slate-500 mb-6">
            Share something for other students to borrow
          </p>

          <label className="block text-sm font-medium text-slate-700 mb-1">Photo (optional)</label>
          <div className="mb-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null)
                    setPhotoPreview(null)
                  }}
                  className="absolute top-2 right-2 bg-white/90 text-slate-700 text-xs font-semibold rounded-full px-3 py-1 shadow hover:bg-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-slate-500">
                  Click to add a photo of your item
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

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

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="w-full bg-violet-900 text-white font-semibold rounded-full py-3 shadow-lg hover:bg-violet-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Listing your item..." : "List item"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateListing