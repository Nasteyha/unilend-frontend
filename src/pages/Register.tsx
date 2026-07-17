import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { API_URL } from "../config"
function Register() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        let message = "Could not create account"
        if (typeof data?.detail === "string") message = data.detail
        else if (Array.isArray(data?.detail) && data.detail[0]?.msg) message = data.detail[0].msg
        setError(message)
        return
      }

      alert("Account created! Please sign in.")
      navigate("/login")
    } catch {
      setError("Could not reach the server. Is the backend running?")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-100 via-violet-100 to-white px-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-violet-500 rounded-full blur-3xl opacity-25" />
      <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] bg-amber-400 rounded-full blur-3xl opacity-25" />

      <form
        onSubmit={handleRegister}
        className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-lg p-8"
      >
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-900 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 mb-5">
          <span className="w-2 h-2 bg-violet-700 rounded-full animate-pulse" />
          Verified USIU-A students only
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">Join the UniLend campus community</p>

        <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@usiu.ac.ke"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-violet-900 text-white font-semibold rounded-full py-3 shadow-lg hover:bg-violet-950 transition"
        >
          Create account
        </button>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-900 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register