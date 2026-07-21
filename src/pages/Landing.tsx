import { Link } from "react-router-dom";

const chipStyles = [
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
];

const features = [
  {
    title: "Verified campus access",
    desc: "Only USIU-Africa students with valid credentials can join the platform.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
  {
    title: "Campus identity system",
    desc: "Every user is tied to a real student profile for instant trust.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
  },
  {
    title: "Trust scoring engine",
    desc: "Reputation builds over time based on successful borrowing activity.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Risk-based lending",
    desc: "High-value items require stronger trust history before approval.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Tracked lending lifecycle",
    desc: "Every borrow is recorded from approval to return, with on-time and late returns shaping reputation.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Community accountability",
    desc: "A self-regulating system where reliability matters more than access.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const trustPanel = [
  {
    title: "Identity verification",
    desc: "Only verified USIU-Africa emails are allowed on the platform.",
    chip: "bg-violet-100 text-violet-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Trust system",
    desc: "Users build reputation through successful lending activity.",
    chip: "bg-amber-100 text-amber-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Risk protection",
    desc: "High-value items require higher trust levels before approval.",
    chip: "bg-indigo-100 text-indigo-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-violet-100 to-white text-slate-900">

      {/* PUBLIC HEADER */}
      <header className="bg-white/70 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold bg-gradient-to-r from-amber-500 to-violet-700 bg-clip-text text-transparent">
            UniLend
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-violet-800 transition px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-violet-900 text-white rounded-full px-5 py-2 hover:bg-violet-950 transition shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

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
              <span className="bg-gradient-to-r from-amber-500 to-violet-700 text-transparent bg-clip-text">
                Lend what you don't.
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-700 leading-relaxed max-w-md">
              UniLend is a trusted peer-to-peer lending platform for USIU-Africa students.
              Share textbooks, electronics, and gear safely with built-in trust and accountability.
            </p>

            <div className="mt-7 flex gap-4">
              <Link
                to="/register"
                className="bg-violet-900 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:bg-violet-950 hover:-translate-y-0.5 transition"
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
            {trustPanel.map((panel) => (
              <div
                key={panel.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${panel.chip}`}
                  >
                    {panel.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{panel.title}</h3>
                    <p className="text-sm text-slate-600">{panel.desc}</p>
                  </div>
                </div>
              </div>
            ))}
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
          {features.map((f, index) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${chipStyles[index]}`}
              >
                {f.icon}
              </div>
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