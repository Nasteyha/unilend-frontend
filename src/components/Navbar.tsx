import { Link, NavLink, useNavigate } from "react-router-dom"

const links = [
  { to: "/browse", label: "Browse" },
  { to: "/create-listing", label: "List an item" },
  { to: "/received-requests", label: "Requests for my items" },
  { to: "/my-requests", label: "My requests" },
]

function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link
          to="/dashboard"
          className="text-xl font-extrabold bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent shrink-0"
        >
          UniLend
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600 hover:text-violet-800 hover:bg-violet-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-500 hover:text-violet-700 transition shrink-0"
        >
          Log out
        </button>
      </div>
    </header>
  )
}

export default Navbar