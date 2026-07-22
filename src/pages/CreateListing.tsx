import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ImagePlus,
  X,
  Type,
  FileText,
  Tag,
  ShieldCheck,
  ShieldQuestion,
  ShieldAlert,
  CalendarClock,
  Sparkles,
  Loader2,
} from "lucide-react"
import Navbar from "../components/Navbar"
import { API_URL } from "../config"

const RISK_OPTIONS = [
  {
    value: "low",
    label: "Low risk",
    desc: "Open to everyone",
    icon: ShieldCheck,
    active: "border-green-400 bg-green-50 text-green-700 shadow-green-200/50",
  },
  {
    value: "medium",
    label: "Medium",
    desc: "Trust score 50+",
    icon: ShieldQuestion,
    active: "border-amber-400 bg-amber-50 text-amber-700 shadow-amber-200/50",
  },
  {
    value: "high",
    label: "High risk",
    desc: "Trust score 70+",
    icon: ShieldAlert,
    active: "border-red-400 bg-red-50 text-red-700 shadow-red-200/50",
  },
]

// --- hand-drawn outline doodle icons, edge decoration only ---
function CameraDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="14" width="62" height="32" rx="6" />
      <path d="M18 14 L23 5 H41 L46 14" />
      <circle cx="32" cy="30" r="12" />
      <circle cx="32" cy="30" r="5" />
      <circle cx="52" cy="21" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LaptopDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="1" width="64" height="42" rx="3" />
      <path d="M1 51 H79 L70 43 H10 Z" />
      <line x1="24" y1="14" x2="56" y2="14" />
    </svg>
  )
}

function BackpackDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 76" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="18" width="52" height="54" rx="14" />
      <path d="M16 18 V8 a14 14 0 0 1 28 0 v10" />
      <rect x="20" y="34" width="20" height="14" rx="3" />
      <line x1="4" y1="30" x2="0" y2="30" />
      <line x1="56" y1="30" x2="60" y2="30" />
    </svg>
  )
}

function MugDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 54 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="14" width="42" height="40" rx="8" />
      <path d="M44 22 h8 a9 9 0 0 1 0 18 h-8" />
      <path d="M12 2 q3 5 0 8" />
      <path d="M22 0 q3 5 0 8" />
      <path d="M32 2 q3 5 0 8" />
    </svg>
  )
}

function BooksDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 70 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="26" width="60" height="10" rx="2" />
      <rect x="6" y="14" width="52" height="10" rx="2" />
      <rect x="0" y="2" width="56" height="10" rx="2" />
    </svg>
  )
}

function PlaneDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 20 L58 2 L34 42 L24 26 Z" />
      <path d="M24 26 L2 20" />
    </svg>
  )
}

function NotebookDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="44" height="56" rx="4" />
      <line x1="2" y1="14" x2="10" y2="14" />
      <line x1="2" y1="24" x2="10" y2="24" />
      <line x1="2" y1="34" x2="10" y2="34" />
      <line x1="16" y1="16" x2="38" y2="16" />
      <line x1="16" y1="24" x2="38" y2="24" />
      <line x1="16" y1="32" x2="30" y2="32" />
    </svg>
  )
}

function CalculatorDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="40" height="52" rx="5" />
      <rect x="8" y="8" width="28" height="10" rx="2" />
      <circle cx="12" cy="28" r="2.5" />
      <circle cx="22" cy="28" r="2.5" />
      <circle cx="32" cy="28" r="2.5" />
      <circle cx="12" cy="38" r="2.5" />
      <circle cx="22" cy="38" r="2.5" />
      <circle cx="32" cy="38" r="2.5" />
      <circle cx="12" cy="48" r="2.5" />
      <circle cx="22" cy="48" r="2.5" />
    </svg>
  )
}

function HeadphonesDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 30 V24 a26 26 0 0 1 52 0 v6" />
      <rect x="0" y="28" width="14" height="18" rx="5" />
      <rect x="46" y="28" width="14" height="18" rx="5" />
    </svg>
  )
}

function RulerDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 70 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="1" width="68" height="20" rx="3" />
      <line x1="10" y1="1" x2="10" y2="9" />
      <line x1="20" y1="1" x2="20" y2="13" />
      <line x1="30" y1="1" x2="30" y2="9" />
      <line x1="40" y1="1" x2="40" y2="13" />
      <line x1="50" y1="1" x2="50" y2="9" />
      <line x1="60" y1="1" x2="60" y2="13" />
    </svg>
  )
}

function PencilDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 14 L44 2 L58 6 L48 16 Z" />
      <line x1="38" y1="4" x2="42" y2="14" />
      <path d="M2 14 L6 18 L10 15 Z" fill="currentColor" />
    </svg>
  )
}

function BulbDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 2 a16 16 0 0 1 8 30 c-2 2-3 5-3 8 H15 c0-3-1-6-3-8 A16 16 0 0 1 20 2Z" />
      <line x1="15" y1="44" x2="25" y2="44" />
      <line x1="16" y1="50" x2="24" y2="50" />
    </svg>
  )
}

function SparkleDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
    </svg>
  )
}

function DiamondDoodle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
      <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" />
    </svg>
  )
}

function BackgroundDoodles() {
  return (
    <div className="doodle-layer absolute inset-0 pointer-events-none text-violet-600">
      {/* anchor icons, spread across left flank */}
      <CameraDoodle className="absolute top-20 left-4 w-16 h-12 opacity-[0.22] -rotate-6" />
      <PlaneDoodle className="absolute top-56 left-40 w-14 h-10 opacity-[0.20] -rotate-12" />
      <RulerDoodle className="absolute top-[16rem] left-10 w-16 h-6 opacity-[0.20] rotate-6 text-amber-600" />
      <BackpackDoodle className="absolute top-[24rem] left-36 w-14 h-18 opacity-[0.22] rotate-3" />
      <PencilDoodle className="absolute bottom-[26rem] left-6 w-14 h-5 opacity-[0.20] -rotate-3 text-amber-600" />
      <BulbDoodle className="absolute bottom-64 left-40 w-10 h-14 opacity-[0.20] text-amber-600" />
      <NotebookDoodle className="absolute bottom-24 left-8 w-12 h-16 opacity-[0.20] -rotate-6" />

      {/* anchor icons, spread across right flank */}
      <LaptopDoodle className="absolute top-16 right-4 w-20 h-14 opacity-[0.22] rotate-3" />
      <CalculatorDoodle className="absolute top-52 right-40 w-11 h-14 opacity-[0.20]" />
      <MugDoodle className="absolute top-[18rem] right-8 w-12 h-14 opacity-[0.20] -rotate-6 text-amber-600" />
      <HeadphonesDoodle className="absolute top-[26rem] right-36 w-16 h-14 opacity-[0.20] rotate-6" />
      <BooksDoodle className="absolute bottom-56 right-6 w-16 h-10 opacity-[0.22] rotate-2 text-amber-600" />

      {/* LEFT — dense scatter spanning the full width of the flank, not just the edge */}
      <SparkleDoodle className="absolute top-32 left-52 w-4 h-4 text-amber-500 opacity-50" />
      <DiamondDoodle className="absolute top-14 left-64 w-3.5 h-3.5 text-violet-500 opacity-45" />
      <span className="absolute top-44 left-72 w-2 h-2 rounded-full bg-amber-500 opacity-55" />
      <SparkleDoodle className="absolute top-72 left-20 w-3 h-3 text-violet-500 opacity-45" />
      <DiamondDoodle className="absolute top-96 left-56 w-3 h-3 text-amber-500 opacity-40" />
      <span className="absolute top-[12rem] left-2 w-2 h-2 rounded-full bg-violet-500 opacity-50" />
      <SparkleDoodle className="absolute top-[14rem] left-64 w-4 h-4 text-amber-500 opacity-45" />
      <DiamondDoodle className="absolute top-[20rem] left-68 w-3.5 h-3.5 text-violet-500 opacity-40" />
      <span className="absolute top-[22rem] left-24 w-1.5 h-1.5 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute top-[28rem] left-2 w-3 h-3 text-violet-500 opacity-40" />
      <DiamondDoodle className="absolute top-[30rem] left-60 w-3 h-3 text-amber-500 opacity-40" />
      <span className="absolute bottom-[22rem] left-72 w-2 h-2 rounded-full bg-violet-500 opacity-50" />
      <SparkleDoodle className="absolute bottom-96 left-16 w-3.5 h-3.5 text-amber-500 opacity-45" />
      <DiamondDoodle className="absolute bottom-80 left-64 w-3.5 h-3.5 text-violet-500 opacity-40" />
      <span className="absolute bottom-64 left-4 w-2 h-2 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute bottom-48 left-56 w-3 h-3 text-violet-500 opacity-40" />
      <DiamondDoodle className="absolute bottom-32 left-24 w-3 h-3 text-amber-500 opacity-40" />
      <span className="absolute bottom-12 left-60 w-1.5 h-1.5 rounded-full bg-violet-500 opacity-45" />

      {/* RIGHT — dense scatter spanning the full width of the flank, not just the edge */}
      <SparkleDoodle className="absolute top-36 right-52 w-4 h-4 text-violet-500 opacity-50" />
      <DiamondDoodle className="absolute top-16 right-64 w-3.5 h-3.5 text-amber-500 opacity-45" />
      <span className="absolute top-48 right-72 w-2 h-2 rounded-full bg-violet-500 opacity-55" />
      <SparkleDoodle className="absolute top-88 right-20 w-3 h-3 text-amber-500 opacity-45" />
      <DiamondDoodle className="absolute top-[11rem] right-56 w-3 h-3 text-violet-500 opacity-40" />
      <span className="absolute top-[13rem] right-2 w-2 h-2 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute top-[19rem] right-64 w-4 h-4 text-violet-500 opacity-45" />
      <DiamondDoodle className="absolute top-[23rem] right-68 w-3.5 h-3.5 text-amber-500 opacity-40" />
      <span className="absolute top-[25rem] right-24 w-1.5 h-1.5 rounded-full bg-violet-500 opacity-50" />
      <SparkleDoodle className="absolute top-[31rem] right-2 w-3 h-3 text-amber-500 opacity-40" />
      <DiamondDoodle className="absolute top-[33rem] right-60 w-3 h-3 text-violet-500 opacity-40" />
      <span className="absolute bottom-[20rem] right-72 w-2 h-2 rounded-full bg-amber-500 opacity-50" />
      <SparkleDoodle className="absolute bottom-88 right-16 w-3.5 h-3.5 text-violet-500 opacity-45" />
      <DiamondDoodle className="absolute bottom-72 right-64 w-3.5 h-3.5 text-amber-500 opacity-40" />
      <span className="absolute bottom-56 right-4 w-2 h-2 rounded-full bg-violet-500 opacity-50" />
      <SparkleDoodle className="absolute bottom-40 right-56 w-3 h-3 text-amber-500 opacity-40" />
      <DiamondDoodle className="absolute bottom-24 right-24 w-3 h-3 text-violet-500 opacity-40" />
      <span className="absolute bottom-8 right-60 w-1.5 h-1.5 rounded-full bg-amber-500 opacity-45" />
    </div>
  )
}
// ultra-subtle blueprint geometry, diagonal, embossed-wallpaper feel
function BlueprintPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <pattern id="blueprint" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <rect x="70" y="20" width="34" height="34" transform="rotate(45 87 37)" fill="none" stroke="#6d28d9" strokeWidth="0.6" />
          <rect x="10" y="90" width="30" height="30" transform="skewX(-15) rotate(10 25 105)" fill="none" stroke="#f59e0b" strokeWidth="0.6" />
          <path d="M130 110 L155 150 L105 150 Z" fill="none" stroke="#6d28d9" strokeWidth="0.5" />
          <rect x="10" y="10" width="14" height="14" transform="rotate(45 17 17)" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint)" opacity="0.025" />
    </svg>
  )
}

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

  // purely presentational: drag state for the upload zone, no business logic
  const [isDragging, setIsDragging] = useState(false)

  function setPhotoFile(file: File | null) {
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setPhotoFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file)
    }
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

  // purely visual completeness indicator, computed from existing state
  const fieldsCompleted = [title, description, category, photo].filter(Boolean).length

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #F5F1FF, #FFF7E8)" }}
    >
      {/* large soft glow blobs, opposite corners, low opacity */}
      <div
        className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)" }}
      />

      <BlueprintPattern />
      <BackgroundDoodles />

      <Navbar />
       <div
        className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.13) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-md mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                New{" "}
                <span className="bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent">
                  listing
                </span>
              </h1>
            </div>
            <span className="text-xs font-medium text-violet-700 bg-violet-100/80 backdrop-blur-sm rounded-full px-3 py-1 whitespace-nowrap shrink-0">
              Draft · {fieldsCompleted} of 4 completed
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">Share something for other students to borrow</p>
        </div>

        {/* PHOTO SECTION */}
        <div className="relative bg-white/[0.88] backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_10px_40px_rgba(109,40,217,0.10)] p-6 mb-5 overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br from-violet-200 to-transparent rounded-full blur-2xl opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3.5">
              <ImagePlus className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wide">Photo</h2>
              <span className="text-[11px] text-slate-400 font-normal normal-case">optional, builds trust</span>
            </div>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden group">
                <img src={photoPreview} alt="Preview" className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => setPhotoFile(null)}
                  className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold rounded-full px-3 py-1.5 shadow hover:bg-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-12 cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-violet-500 bg-violet-100/70 scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.25)]"
                    : "border-slate-300/70 hover:border-violet-400 hover:bg-violet-50/50"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 ${
                    isDragging ? "bg-violet-200 scale-110 rotate-3" : "bg-violet-100"
                  }`}
                >
                  <ImagePlus className="w-7 h-7 text-violet-500" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {isDragging ? "Drop it here" : "Click or drag a photo"}
                </span>
                <span className="text-xs text-slate-400">PNG or JPG · items with photos borrow faster</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* ITEM DETAILS SECTION */}
        <div className="relative bg-white/[0.88] backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_10px_40px_rgba(109,40,217,0.10)] p-6 mb-5 overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-2xl opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wide">Item details</h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Title</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Scientific Calculator"
                    className="w-full border border-slate-200/70 rounded-xl pl-10 pr-4 py-3 bg-slate-50/70 text-sm transition-all duration-300 hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the item and its condition"
                    rows={3}
                    className="w-full border border-slate-200/70 rounded-xl pl-10 pr-4 py-3 bg-slate-50/70 text-sm transition-all duration-300 hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Electronics, Tools, Textbooks"
                    className="w-full border border-slate-200/70 rounded-xl pl-10 pr-4 py-3 bg-slate-50/70 text-sm transition-all duration-300 hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BORROWING RULES SECTION */}
        <div className="relative bg-white/[0.88] backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_10px_40px_rgba(109,40,217,0.10)] p-6 mb-6 overflow-hidden">
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-br from-violet-100 to-transparent rounded-full blur-2xl opacity-60" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wide">Borrowing rules</h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Risk level</label>
              <p className="text-[11px] text-slate-400 mb-2">
                Higher risk items require a higher borrower trust score
              </p>
              <div className="grid grid-cols-3 gap-2">
                {RISK_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const selected = riskLevel === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRiskLevel(option.value)}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all duration-200 ${
                        selected
                          ? option.active + " shadow-md scale-[1.03]"
                          : "border-slate-200/80 bg-white/50 text-slate-500 hover:border-slate-300 hover:bg-white/90 hover:scale-[1.02]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{option.label}</span>
                      <span className="text-[10px] opacity-80">{option.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Max borrow days</label>
              <div className="relative">
                <CalendarClock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={maxBorrowDays}
                  onChange={(e) => setMaxBorrowDays(e.target.value)}
                  min="1"
                  className="w-full border border-slate-200/70 rounded-xl pl-10 pr-4 py-3 bg-slate-50/70 text-sm transition-all duration-300 hover:border-violet-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400 focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                The longest a borrower can keep this item before returning it
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50/90 border border-red-200 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleCreate}
          disabled={submitting}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-700 via-violet-800 to-violet-900 text-white font-semibold rounded-2xl py-4 shadow-lg shadow-violet-900/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Publishing your listing...
              </>
            ) : (
              "Publish listing"
            )}
          </span>
          {!submitting && (
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
          )}
        </button>
      </div>
    </div>
  )
}

export default CreateListing