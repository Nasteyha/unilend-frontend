import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  id: string
  full_name: string
  email: string
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          localStorage.removeItem("token")
          navigate("/login")
          return
        }

        const data = await response.json()
        setUser(data)
      } catch {
        navigate("/login")
      }
    }

    fetchUser()
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">UniLend</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-purple-600"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {user ? `Welcome, ${user.full_name}` : "Loading..."}
        </h2>
        <p className="text-gray-600">{user ? `Signed in as ${user.email}` : ""}</p>
      </main>
    </div>
  )
}

export default Dashboard