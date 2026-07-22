import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import { API_URL } from "../config"
import AuthShowcase from "../components/AuthShowcase"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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
        const meResponse = await fetch(`${API_URL}/auth/me`, {
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
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-violet-50 to-white px-6 py-16">

      {/* floating gradient glows */}
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-violet-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-0 -left-40 w-[30rem] h-[30rem] bg-amber-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300 rounded-full blur-3xl opacity-10" />

      <div className="relative w-full max-w-5xl auth-grid gap-12 items-center">

        {/* SIDE PANEL */}
        <div className="auth-side-panel">
          <AuthShowcase />
        </div>

        {/* CARD */}
        <div className="relative w-full max-w-md mx-auto">

          {/* subtle gradient ring behind the card for a floating effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-400/40 via-amber-300/30 to-violet-500/40 rounded-[2rem] blur-lg opacity-60" />

          <form
            onSubmit={handleLogin}
            className="relative bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_rgba(109,40,217,0.15)] p-8 sm:p-10 overflow-hidden"
          >
            {/* glass sheen overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/50 via-transparent to-transparent" />

            <div className="relative">
              {/* badge — only on small screens, since the side panel carries it above lg */}
              <div className="auth-mobile-badge items-center gap-2 text-xs font-semibold text-violet-900 bg-violet-50/80 border border-violet-200 rounded-full px-3 py-1 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Verified USIU-Africa access only
              </div>

              {/* heading */}
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 mb-8">
                Sign in to your UniLend account
              </p>

              {/* email */}
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative mb-5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@usiu.ac.ke"
                  className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 bg-white/80 text-slate-900 placeholder:text-slate-400 transition-all duration-300 hover:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400"
                />
              </div>

              {/* password */}
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative mb-5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full border border-slate-200 rounded-2xl pl-11 pr-11 py-3 bg-white/80 text-slate-900 placeholder:text-slate-400 transition-all duration-300 hover:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/15 focus:border-violet-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* error */}
              {error && (
                <div className="mb-5 text-sm text-red-600 bg-red-50/90 border border-red-200 rounded-2xl px-4 py-2.5">
                  {error}
                </div>
              )}

              {/* button with animated shine */}
              <button
                type="submit"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-700 to-violet-900 text-white font-semibold rounded-2xl py-3.5 shadow-lg shadow-violet-900/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10">Sign in</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
              </button>

              {/* footer link */}
              <p className="text-sm text-slate-600 mt-6 text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-violet-900 hover:text-violet-700 transition-colors"
                >
                  Register
                </Link>
              </p>

              {/* trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-7 pt-6 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                  Verified campus community
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                  Secure authentication
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-violet-500" />
                  Encrypted passwords
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;