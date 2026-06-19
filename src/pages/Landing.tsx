import { Link } from "react-router-dom"

function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-3">UniLend</h1>
      <p className="text-lg text-gray-700 mb-1">Borrow what you need. Lend what you don't.</p>
      <p className="text-sm text-gray-500 mb-8">A lending community for verified USIU-A students.</p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-purple-600 text-white font-medium rounded-lg px-6 py-2.5 hover:bg-purple-700 transition"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="bg-white text-purple-600 font-medium rounded-lg px-6 py-2.5 border border-purple-200 hover:bg-purple-50 transition"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default Landing