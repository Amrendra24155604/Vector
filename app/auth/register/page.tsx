"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";

const STEPS = ["Account", "Profile", "Skills"];
const MAJORS = ["Computer Science", "Data Science", "Electrical Engineering", "Mechanical Engineering", "Business Administration", "Finance", "Marketing", "Psychology", "Biology", "Chemistry", "Other"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    university: "", major: "", gradYear: "",
    skills: [] as string[], interests: "",
  });
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const SKILL_OPTS = ["React", "Node.js", "Python", "TypeScript", "Java", "SQL", "MongoDB", "AWS", "Docker", "Figma", "ML/AI", "GraphQL", "Next.js", "Go", "Rust", "Swift"];

  const set = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s: string) => set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        university: form.university,
        major: form.major,
        graduationYear: form.gradYear,
        skills: form.skills,
        interests: form.interests,
      });
      window.location.href = `/auth/verify-otp?email=${encodeURIComponent(result.email)}`;
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden orange-page-tint">
      {loading && <Loader overlay title="Auth Gateway" text="Registering..." />}
      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{
          transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
        }}
      />

      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)" }} />

      <div className="relative z-20 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/LandingPage" className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-300 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <span className="text-2xl font-headline-lg text-white tracking-tighter">KareerPilot</span>
          </Link>
          <h1 className="font-headline-lg text-white mb-1">Create your account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Free forever — no credit card needed</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i <= step ? "text-white" : "text-stone-500 bg-[#1d1b1a] border border-orange-400/15"}`}
                style={i <= step ? { background: "linear-gradient(135deg,#ea580c,#f97316)" } : {}}>
                {i < step ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
              </div>
              <span className={`text-xs font-bold ${i === step ? "text-white" : "text-stone-500"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 rounded-full ${i < step ? "bg-orange-500" : "bg-[#221d1a]"}`} />}
            </div>
          ))}
        </div>

        <div className="soft-card rounded-3xl p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl flex items-center gap-3 text-sm bg-rose-500/10 border border-rose-500/20">
              <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
              <span className="text-rose-300">{error}</span>
            </div>
          )}
          {/* Step 0 — Account */}
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-headline-md text-white mb-1">Create your login</h2>
              {[
                { l: "Full Name", k: "name", t: "text", ph: "Alex Johnson", ic: "person" },
                { l: "University Email", k: "email", t: "email", ph: "alex@university.edu", ic: "mail" },
              ].map(({ l, k, t, ph, ic }) => (
                <div key={k}>
                  <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">{l}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-[20px]">{ic}</span>
                    <input type={t} value={form[k as keyof typeof form] as string} onChange={e => set(k, e.target.value)} placeholder={ph}
                      className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl pl-11 pr-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all" />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-[20px]">lock</span>
                  <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 8 characters"
                    className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl pl-11 pr-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all" />
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all ${form.password.length >= i * 2 ? "bg-orange-500" : "bg-[#221d1a]"}`} />
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(1)} disabled={!form.name || !form.email || form.password.length < 6}
                className="interactive primary-blue w-full py-4 rounded-2xl font-headline-lg text-white flex items-center justify-center gap-2 mt-2">
                Continue <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Step 1 — Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-headline-md text-white mb-1">Tell us about yourself</h2>
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">University / College</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-[20px]">school</span>
                  <input value={form.university} onChange={e => set("university", e.target.value)} placeholder="MIT, Stanford, State University..."
                    className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl pl-11 pr-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">Major</label>
                <select value={form.major} onChange={e => set("major", e.target.value)}
                  className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl px-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select your major...</option>
                  {MAJORS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">Graduation Year</label>
                <div className="grid grid-cols-4 gap-2">
                  {["2025", "2026", "2027", "2028"].map(y => (
                    <button key={y} onClick={() => set("gradYear", y)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${form.gradYear === y ? "text-orange-300 border-orange-500 bg-orange-500/10" : "text-stone-400 border-orange-400/15 hover:border-orange-500/40"}`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-2xl font-bold text-stone-400 border border-orange-400/15 hover:text-white hover:border-orange-500/40 transition-all">Back</button>
                <button onClick={() => setStep(2)} disabled={!form.university || !form.major || !form.gradYear}
                  className="interactive primary-blue flex-1 py-3.5 rounded-2xl font-headline-lg text-white flex items-center justify-center gap-2">
                  Continue <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Skills */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-headline-md text-white mb-1">Your skills & interests</h2>
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">
                  Select your skills <span className="text-orange-300">({form.skills.length} selected)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTS.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${form.skills.includes(s) ? "chip-orange" : "border-orange-400/15 text-stone-400 hover:border-orange-500/40 hover:text-white"}`}>
                      {form.skills.includes(s) && "✓ "}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">Career Interests</label>
                <input value={form.interests} onChange={e => set("interests", e.target.value)}
                  placeholder="e.g. FinTech, AI, Developer Tools, Startups..."
                  className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl px-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl font-bold text-stone-400 border border-orange-400/15 hover:text-white hover:border-orange-500/40 transition-all">Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="interactive primary-blue flex-1 py-3.5 rounded-2xl font-headline-lg text-white flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>Creating account...</>
                  ) : (
                    <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>Launch KareerPilot!</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-300 hover:text-orange-200 font-bold transition-colors">Sign in →</Link>
        </p>
        <p className="text-center text-[11px] text-stone-500 mt-3 opacity-60">
          By creating an account, you agree to our{" "}
          <span className="text-orange-300 cursor-pointer hover:underline">Terms of Service</span> and{" "}
          <span className="text-orange-300 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
