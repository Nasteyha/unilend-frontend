import { Link } from "react-router-dom";

const features = [
  {
    title: "Verified campus access",
    desc: "Only USIU-Africa students with valid credentials can join the platform.",
    icon: "🎓",
  },
  {
    title: "Campus identity system",
    desc: "Every user is tied to a real student profile for instant trust.",
    icon: "🪪",
  },
  {
    title: "Trust scoring engine",
    desc: "Reputation builds over time based on successful borrowing activity.",
    icon: "📊",
  },
  {
    title: "Risk-based lending",
    desc: "High-value items require stronger trust history before approval.",
    icon: "🛡️",
  },
  {
    title: "Condition tracking",
    desc: "Before and after proof ensures transparency and fair returns.",
    icon: "📸",
  },
  {
    title: "Community accountability",
    desc: "A self-regulating system where reliability matters more than access.",
    icon: "🤝",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-violet-100 to-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* background glow */}
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-violet-500 rounded-full blur-3xl opacity-25" />
        <div className="absolute top-40 -left-40 w-[28rem] h-[28rem] bg-amber-400 rounded-full blur-3xl opacity-25" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-14 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-900 bg-white/70 backdrop-blur border border-violet-200 rounded-full px-4 py-1 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-violet-700 rounded-full animate-pulse" />
              Verified USIU-Africa ecosystem
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Borrow what you need.
              <br />
              <span className="bg-gradient-to-r from-violet-900 to-amber-600 text-transparent bg-clip-text">
                Lend what you don’t.
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed max-w-md">
              UniLend is a trusted peer-to-peer lending platform for USIU-Africa students.
              Share textbooks, electronics, and gear safely with built-in trust and accountability.
            </p>

            <div className="mt-7 flex gap-4">
              <Link
                to="/register"
                className="bg-violet-900 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:bg-violet-950 transition"
              >
                Get started
              </Link>

              <Link
                to="/login"
                className="font-semibold text-slate-800 rounded-full px-7 py-3 border border-slate-300 hover:border-violet-400 hover:text-violet-900 transition"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Built exclusively for verified campus members.
            </p>
          </div>

          {/* RIGHT SIDE (TRUST PANEL) */}
          <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold mb-1">🔐 Identity verification</h3>
              <p className="text-sm text-slate-600">
                Only verified USIU-Africa emails are allowed on the platform.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold mb-1">📊 Trust system</h3>
              <p className="text-sm text-slate-600">
                Users build reputation through successful lending activity.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold mb-1">🛡️ Risk protection</h3>
              <p className="text-sm text-slate-600">
                High-value items require higher trust levels before approval.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-14">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Everything built for trust</h2>
          <p className="text-slate-600 mt-2">
            A structured system for safe campus lending and borrowing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-white/60 border-y border-slate-200 py-14 text-center">

        <h2 className="text-2xl md:text-3xl font-bold">
          Start lending and borrowing safely today
        </h2>

        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
          Join a trusted student ecosystem where accountability and reputation matter.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-violet-900 text-white font-semibold rounded-full px-8 py-3 hover:bg-violet-950 transition"
          >
            Get started
          </Link>

          <Link
            to="/login"
            className="font-semibold text-slate-800 border border-slate-300 rounded-full px-8 py-3 hover:border-violet-400 hover:text-violet-900 transition"
          >
            Sign in
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-amber-100/40 py-6 text-center text-sm text-slate-600">
        UniLend · Built for USIU-Africa · Trust-first campus economy
      </footer>

    </div>
  );
}

export default Landing;