import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"

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
      const response = await fetch("http://localhost:8000/auth/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">USIU-A students only</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@usiu.ac.ke"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-medium rounded-lg py-2 hover:bg-purple-700 transition"
        >
          Create account
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register