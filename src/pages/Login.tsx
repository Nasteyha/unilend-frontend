import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      // find out who just logged in, and send them to their home:
      // admins land on the platform overview, everyone else on the dashboard
      try {
        const meResponse = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${data.access_token}` },
          cache: "no-store",
        });

        if (meResponse.ok) {
          const me = await meResponse.json();
          navigate(me.role === "admin" ? "/admin" : "/dashboard");
          return;
        }
      } catch {
        // role lookup failed: fall through to the default home
      }

      navigate("/dashboard");
    } catch {
      setError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-100 via-violet-100 to-white px-6">

      {/* background glow */}
      <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-violet-500 rounded-full blur-3xl opacity-25" />
      <div className="absolute bottom-0 -left-40 w-[28rem] h-[28rem] bg-amber-400 rounded-full blur-3xl opacity-25" />

      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md bg-white/80 backdrop-blur border border-slate-200 rounded-3xl shadow-xl p-8"
      >

        {/* badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-900 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 mb-6">
          <span className="w-2 h-2 bg-violet-700 rounded-full animate-pulse" />
          Verified USIU-Africa access only
        </div>

        {/* heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h1>

        <p className="text-sm text-slate-600 mt-1 mb-6">
          Sign in to your UniLend account
        </p>

        {/* email */}
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@usiu.ac.ke"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />

        {/* password */}
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />

        {/* error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {/* button */}
        <button
          type="submit"
          className="w-full bg-violet-900 text-white font-semibold rounded-full py-3 shadow-lg hover:bg-violet-950 transition"
        >
          Sign in
        </button>

        {/* footer link */}
        <p className="text-sm text-slate-600 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-900 hover:text-violet-950 hover:underline"
          >
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;