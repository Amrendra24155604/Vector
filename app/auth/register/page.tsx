"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";
import { AIBrainIcon } from "@/components/Sidebar";
import SleekDropdown from "@/components/SleekDropdown";
import CursorGlow from "@/components/CursorGlow";

const STEPS = ["Account", "Profile", "Skills"];
const MAJORS = [
  "Computer Science",
  "Data Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Business Administration",
  "Finance",
  "Marketing",
  "Psychology",
  "Biology",
  "Chemistry",
  "Other"
];

const RegisterIllustration = () => (
  <svg width="360" height="360" viewBox="0 0 200 200" fill="none" className="w-full max-w-[340px] aspect-square">
    <style>{`
      @keyframes float-rocket {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      @keyframes engine-fire {
        0%, 100% { transform: scaleY(0.9) scaleX(0.95); opacity: 0.85; filter: brightness(1); }
        50% { transform: scaleY(1.25) scaleX(1.05); opacity: 1; filter: brightness(1.2) drop-shadow(0 0 10px #f97316); }
      }
      @keyframes orbital-rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes star-flare {
        0%, 100% { transform: scale(0.7); opacity: 0.3; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      @keyframes stream-lines {
        0% { stroke-dashoffset: 60; opacity: 0; }
        40% { opacity: 0.8; }
        80% { opacity: 0.8; }
        100% { stroke-dashoffset: -60; opacity: 0; }
      }
      .rocket-group {
        transform-origin: 100px 90px;
        animation: float-rocket 4s ease-in-out infinite;
      }
      .booster-flame {
        transform-origin: 100px 130px;
        animation: engine-fire 0.35s ease-in-out infinite;
      }
      .side-flame-l {
        transform-origin: 86px 125px;
        animation: engine-fire 0.3s ease-in-out infinite;
      }
      .side-flame-r {
        transform-origin: 114px 125px;
        animation: engine-fire 0.3s ease-in-out infinite;
      }
      .cosmic-orbit {
        transform-origin: 100px 100px;
        animation: orbital-rotation 30s linear infinite;
      }
      .cosmic-orbit-reverse {
        transform-origin: 100px 100px;
        animation: orbital-rotation 20s linear infinite reverse;
      }
      .pulsing-star {
        transform-origin: center;
        animation: star-flare 2.2s ease-in-out infinite;
      }
      .jetstream {
        stroke-dasharray: 12 30;
        animation: stream-lines 2.5s linear infinite;
      }
    `}</style>

    {/* Background Starfield and Space dust */}
    <g className="cosmic-orbit-reverse" opacity="0.3">
      <circle cx="100" cy="100" r="88" stroke="rgba(253,186,116,0.06)" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="76" stroke="rgba(249,115,22,0.06)" strokeWidth="0.8" strokeDasharray="3 6" />
    </g>

    {/* Giant Glowing Planet with Rings */}
    <g transform="translate(150, 40)" opacity="0.45">
      <ellipse cx="0" cy="0" rx="14" ry="14" fill="url(#planet-grad)" style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.25))" }} />
      <ellipse cx="0" cy="0" rx="26" ry="4" stroke="#fdba74" strokeWidth="1.5" transform="rotate(-15)" fill="none" opacity="0.7" />
    </g>

    {/* Jetstreams / Wind Draft speed lines */}
    <line x1="30" y1="10" x2="30" y2="190" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" className="jetstream" style={{ animationDelay: "0.2s" }} />
    <line x1="170" y1="5" x2="170" y2="185" stroke="rgba(253,186,116,0.2)" strokeWidth="1.5" className="jetstream" style={{ animationDelay: "1s" }} />
    <line x1="55" y1="30" x2="55" y2="170" stroke="rgba(249,115,22,0.15)" strokeWidth="1" className="jetstream" style={{ animationDelay: "0.6s" }} />
    <line x1="145" y1="20" x2="145" y2="180" stroke="rgba(253,186,116,0.15)" strokeWidth="1" className="jetstream" style={{ animationDelay: "1.4s" }} />

    {/* Twinkling 4-point Stars */}
    <g className="pulsing-star" style={{ animationDelay: "0.2s" }} transform="translate(45, 60) scale(0.6)"><path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="#fdba74" /></g>
    <g className="pulsing-star" style={{ animationDelay: "0.9s" }} transform="translate(135, 120) scale(0.5)"><path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="#ffffff" /></g>
    <g className="pulsing-star" style={{ animationDelay: "1.5s" }} transform="translate(70, 160) scale(0.7)"><path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="#f97316" /></g>
    <g className="pulsing-star" style={{ animationDelay: "2.1s" }} transform="translate(155, 155) scale(0.4)"><path d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="#ffffff" /></g>

    {/* Floating Rocket Assembly */}
    <g className="rocket-group">
      {/* Rocket Engine Fire (triple boosters) */}
      <path d="M90 128C90 142 100 156 100 156C100 156 110 142 110 128Z" fill="url(#fire-orange)" className="booster-flame" />
      <path d="M94 128C94 135 100 146 100 146C100 146 106 135 106 128Z" fill="#ffffff" className="booster-flame" style={{ animationDelay: "0.1s" }} />

      <path d="M82 124C82 133 87 142 87 142C87 142 92 133 92 124Z" fill="url(#fire-red)" className="side-flame-l" />
      <path d="M108 124C108 133 113 142 113 142C113 142 118 133 118 124Z" fill="url(#fire-red)" className="side-flame-r" />

      {/* Fins */}
      <path d="M80 106C80 106 66 120 70 129C74 131 87 122 87 122" fill="#7f1d1d" stroke="#b45309" strokeWidth="1" />
      <path d="M120 106C120 106 134 120 130 129C126 131 113 122 113 122" fill="#7f1d1d" stroke="#b45309" strokeWidth="1" />

      {/* Struts */}
      <line x1="86" y1="120" x2="74" y2="128" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
      <line x1="114" y1="120" x2="126" y2="128" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />

      <path d="M86 118H114V124H86V118Z" fill="#334155" />

      {/* Hull */}
      <path d="M100 42C85 68 85 108 85 120H115C115 108 115 68 100 42Z" fill="url(#hull-grad)" stroke="#fdba74" strokeWidth="2.5" />

      <path d="M85.5 90C85.5 102 86 114 86 120H88C88 114 87.5 102 87.5 90Z" fill="#f97316" />
      <path d="M114.5 90C114.5 102 114 114 114 120H112C112 114 112.5 102 112.5 90Z" fill="#f97316" />

      <path d="M100 42C93 54 86.5 66 86 72H114C113.5 66 107 54 100 42Z" fill="#f97316" />

      <circle cx="100" cy="80" r="6" fill="#1e293b" stroke="#fdba74" strokeWidth="1.5" />
      <circle cx="100" cy="80" r="3.5" fill="#38bdf8" />
      <circle cx="100" cy="98" r="5" fill="#1e293b" stroke="#fdba74" strokeWidth="1.5" />
      <circle cx="100" cy="98" r="2.5" fill="#38bdf8" />
    </g>

    <defs>
      <linearGradient id="planet-grad" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
      <linearGradient id="fire-orange" x1="100" y1="128" x2="100" y2="156" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#f97316" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
      <linearGradient id="fire-red" x1="100" y1="124" x2="100" y2="142" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="hull-grad" x1="85" y1="42" x2="115" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="40%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
  </svg>
);

export default function RegisterPage() {
  const { register, loginWithGoogle, token, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    major: "",
    gradYear: "",
    skills: [] as string[],
    interests: ""
  });
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loginWithGoogle(false);
      if (!data) return; // popup closed or cancelled

      // Store token locally to authorize patch profile request at final step
      setGoogleToken(data.token);
      setIsGoogleRegistration(true);

      // Pre-fill form fields
      set("name", data.user.name || "");
      set("email", data.user.email || "");
      set("university", data.user.university || "");
      set("major", data.user.major || "");
      set("gradYear", data.user.graduationYear ? String(data.user.graduationYear) : "");
      set("skills", data.user.skills || []);
      set("interests", data.user.interests || "");

      // Advance to Step 1 (Profile Info)
      setStep(1);
    } catch (err: any) {
      setError(err.message || "Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [mousePosition, setMousePosition] = useState({
    x: -200,
    y: -200,
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const SKILL_OPTS = [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "Java",
    "SQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Figma",
    "ML/AI",
    "GraphQL",
    "Next.js",
    "Go",
    "Rust",
    "Swift"
  ];

  const set = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s: string) =>
    set("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isGoogleRegistration) {
        // Perform profile update instead of registration for Google users
        const authToken = googleToken || token;
        if (!authToken) {
          throw new Error("Authentication token is missing. Please log in again.");
        }

        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
          body: JSON.stringify({
            university: form.university,
            major: form.major,
            graduationYear: Number(form.gradYear),
            skills: form.skills,
            interests: form.interests
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update profile.");

        // Update user context and redirect to Dashboard
        updateUser(data.user);
        window.location.href = "/Dashboard";
      } else {
        // Standard email registration flow
        const result = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          university: form.university,
          major: form.major,
          graduationYear: form.gradYear,
          skills: form.skills,
          interests: form.interests
        });
        window.location.href = `/auth/verify-otp?email=${encodeURIComponent(result.email)}`;
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-4 overflow-y-auto lg:overflow-y-hidden orange-page-tint">
      {loading && <Loader overlay title="Auth Gateway" text="Registering..." />}
      <GridBackgroundDemo />
      <CursorGlow />

      {/* Main split viewport container (spans at least 80% viewport size) */}
      <div className="relative z-20 w-full max-w-5xl min-h-[80vh] lg:min-h-0 lg:h-[82vh] deep-card flex animate-fadeIn">
        <div
          className="w-full flex flex-col md:flex-row items-stretch overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
        >

          {/* Left Side Panel (hidden on mobile, animated SVG illustration on desktop) */}
          <div className="hidden md:flex md:w-1/2 flex-col justify-between p-10 relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-transparent to-transparent border-r border-orange-500/10">
            <div className="absolute top-10 left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-400/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Brand */}
            <Link href="/LandingPage" className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_15px_rgba(249,115,22,0.18),inset_0_0_12px_rgba(249,115,22,0.1)] select-none">
                <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
                <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
                <AIBrainIcon size={26} className="transform -translate-y-[0.5px]" />
              </div>
              <div className="flex flex-col text-left justify-center">
                <span className="text-[17px] font-black tracking-tight leading-none bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">Vector</span>
                <span className="text-[9px] font-mono tracking-wider text-orange-400/80 mt-1.5 uppercase">Designed for Careers to Gain Direction</span>
              </div>
            </Link>

            {/* Animated SVG center panel */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6 my-4 select-none animate-fadeIn">
              <RegisterIllustration />
              <div className="text-center max-w-xs">
                <p className="text-sm font-bold text-white font-mono uppercase tracking-widest">Career Launchpad</p>
                <p className="text-[11px] text-stone-400 font-sans mt-1.5 leading-relaxed">
                  Create a customized student profile to dynamically sync interview sessions with relevant job radar openings.
                </p>
              </div>
            </div>

            {/* Telemetry Footer */}
            <div className="relative z-10 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-orange-400 font-mono font-bold">Neural Engine V4.2.0</span>
              <span className="text-[11px] text-stone-500 font-sans">Empowering developers, designers, and managers with AI prep logic.</span>
            </div>
          </div>

          {/* Right Side Panel: Form Wizard */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10 lg:py-6 lg:px-10 bg-[#181615]/95 relative">
            <div className="w-full max-w-md mx-auto">

              {/* Mobile Header / Branding (hidden on desktop) */}
              <div className="text-center md:text-left mb-6 lg:mb-4">
                <div className="flex flex-col items-center md:hidden mb-6">
                  {/* HUD Branding Capsule */}
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#181514]/60 border border-orange-500/15 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.06),inset_0_0_12px_rgba(249,115,22,0.04)] select-none mb-3">
                    {/* Viewfinder Logo */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_12px_rgba(249,115,22,0.15)]">
                      <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
                      <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
                      <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
                      <AIBrainIcon size={20} className="transform -translate-y-[0.5px]" />
                    </div>
                    {/* Vector Name */}
                    <span className="text-[16px] font-black tracking-[0.2em] bg-gradient-to-r from-white via-orange-300 to-orange-500 bg-clip-text text-transparent font-sans uppercase">
                      Vector
                    </span>
                  </div>
                  {/* Sub-Tagline & Status Indicator */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-mono tracking-[0.18em] text-stone-400/90 uppercase text-center select-none">
                      Designed for Careers to Gain Direction
                    </span>
                    <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-[0.25em] text-orange-400/60 uppercase select-none mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      SECURE_PORTAL_ACTIVE
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">Create Your Account</h1>
                <p className="text-xs text-stone-400 mt-1 font-sans">Free forever — no credit card needed</p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6 lg:mb-4 select-none">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${i <= step ? "text-white" : "text-stone-500 bg-[#1d1b1a] border border-orange-400/15"
                        }`}
                      style={i <= step ? { background: "linear-gradient(135deg,#ea580c,#f97316)" } : {}}
                    >
                      {i < step ? <span className="material-symbols-outlined text-[12px]">check</span> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${i === step ? "text-white" : "text-stone-500"}`}>{s}</span>
                    {i < STEPS.length - 1 && (
                      <div className={`w-6 h-0.5 rounded-full ${i < step ? "bg-orange-500" : "bg-[#221d1a]"}`} />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl flex items-center gap-3 text-sm bg-rose-500/10 border border-rose-500/20">
                  <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
                  <span className="text-rose-300 text-xs">{error}</span>
                </div>
              )}

              {/* Step 0 — Account Info */}
              {step === 0 && (
                <div className="flex flex-col gap-4 lg:gap-3 animate-fadeIn">
                  {/* Hidden autocomplete traps to prevent browser pre-filling */}
                  <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} />
                  <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} />

                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Create your login credentials</h2>
                  {[
                    { l: "Full Name", k: "name", t: "text", ph: "Alex Johnson", ic: "person", col: "orange" },
                    { l: "University Email Address", k: "email", t: "email", ph: "alex@university.edu", ic: "mail", col: "orange" }
                  ].map(({ l, k, t, ph, ic, col }) => (
                    <div key={k}>
                      <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${col}-500 animate-pulse`}></span>
                        {l}
                      </label>
                      <div className="relative group hud-input-group">
                        <span className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-${col}-400 text-[18px] transition-colors duration-200 icon-animate-${ic === "person" ? "person" : "mail"}`}>{ic}</span>
                        <input
                          type={t}
                          value={form[k as keyof typeof form] as string}
                          onChange={e => set(k, e.target.value)}
                          placeholder={ph}
                          autoComplete="off"
                          className={`w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-4 py-3.5 lg:py-2.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-${col}`}
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Password
                    </label>
                    <div className="relative group hud-input-group">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-red-400 text-[18px] transition-colors duration-200 icon-animate-lock">lock</span>
                      <input
                        type="password"
                        value={form.password}
                        onChange={e => set("password", e.target.value)}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-4 py-3.5 lg:py-2.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-red"
                      />
                    </div>
                    <div className="flex gap-1 mt-2.5 lg:mt-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${form.password.length >= i * 2 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-[#221d1a]"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    disabled={!form.name || !form.email || form.password.length < 6}
                    className="interactive primary-blue w-full py-3.5 lg:py-2.5 rounded-2xl font-bold text-white text-xs flex items-center justify-center gap-2 mt-3 lg:mt-2.5 font-mono cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    Continue
                    <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <style>{`
                      @keyframes hud-btn-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                      @keyframes hud-btn-pulse {
                        0%, 100% { transform: scale(0.85); opacity: 0.6; }
                        50% { transform: scale(1.15); opacity: 1; }
                      }
                      .anim-hud-ring {
                        animation: hud-btn-spin 6s linear infinite;
                        transform-origin: center;
                      }
                      .anim-hud-core {
                        animation: hud-btn-pulse 1.6s ease-in-out infinite;
                        transform-origin: center;
                      }
                    `}</style>
                      <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="4 3" className="anim-hud-ring" />
                      <circle cx="12" cy="12" r="3.5" fill="currentColor" className="anim-hud-core" />
                    </svg>
                  </button>

                  <div className="relative my-6 lg:my-3">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-orange-500/10" /></div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#181615] px-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">or continue with</span>
                    </div>
                  </div>

                  <button onClick={handleGoogleLogin} className="w-full py-3.5 lg:py-2.5 rounded-2xl font-bold text-[#e8e1df] text-xs flex items-center justify-center gap-2 border border-orange-400/15 hover:border-orange-400/30 hover:bg-[#1a1716] transition-all font-mono hover:shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google Account
                  </button>
                </div>
              )}

              {/* Step 1 — Profile Info */}
              {step === 1 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Tell us about your background</h2>
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      University / College
                    </label>
                    <div className="relative group hud-input-group">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-orange-400 text-[18px] transition-colors duration-200 icon-animate-school">school</span>
                      <input
                        value={form.university}
                        onChange={e => set("university", e.target.value)}
                        placeholder="MIT, Stanford, State University..."
                        autoComplete="off"
                        className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-4 py-3.5 lg:py-2.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      Major / Course
                    </label>
                    <div className="relative group hud-input-group">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-orange-400 text-[18px] transition-colors duration-200 pointer-events-none icon-animate-school">list</span>
                      <SleekDropdown
                        value={form.major || "Select your major..."}
                        onChange={val => set("major", val === "Select your major..." ? "" : val)}
                        options={["Select your major...", ...MAJORS]}
                        className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-10 py-3.5 lg:py-2.5 border border-stone-800/80 outline-none cursor-pointer font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      Graduation Year
                    </label>
                    <div className="grid grid-cols-4 gap-2 lg:gap-1.5">
                      {["2025", "2026", "2027", "2028"].map(y => (
                        <button
                          key={y}
                          onClick={() => set("gradYear", y)}
                          className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all border ${form.gradYear === y
                            ? "text-orange-300 border-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                            : "text-stone-400 border-orange-400/15 hover:border-orange-500/40"
                            }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 lg:mt-2.5">
                    {!isGoogleRegistration && (
                      <button
                        onClick={() => setStep(0)}
                        className="flex-1 py-3.5 lg:py-2.5 rounded-2xl font-bold font-mono text-stone-400 border border-orange-400/15 hover:text-white hover:border-orange-500/40 transition-all text-xs"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={() => setStep(2)}
                      disabled={!form.university || !form.major || !form.gradYear}
                      className={`interactive primary-blue ${isGoogleRegistration ? "w-full" : "flex-1"} py-3.5 lg:py-2.5 rounded-2xl font-bold text-white text-xs flex items-center justify-center gap-2 font-mono cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
                    >
                      Continue
                      <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <style>{`
                        @keyframes hud-btn-spin {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                        @keyframes hud-btn-pulse {
                          0%, 100% { transform: scale(0.85); opacity: 0.6; }
                          50% { transform: scale(1.15); opacity: 1; }
                        }
                        .anim-hud-ring {
                          animation: hud-btn-spin 6s linear infinite;
                          transform-origin: center;
                        }
                        .anim-hud-core {
                          animation: hud-btn-pulse 1.6s ease-in-out infinite;
                          transform-origin: center;
                        }
                      `}</style>
                        <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="4 3" className="anim-hud-ring" />
                        <circle cx="12" cy="12" r="3.5" fill="currentColor" className="anim-hud-core" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Skills and Interests */}
              {step === 2 && (
                <div className="flex flex-col gap-4 lg:gap-3 animate-fadeIn">
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">Select your skills & interests</h2>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      Key Strengths <span className="text-orange-300 font-bold">({form.skills.length} selected)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] lg:max-h-[110px] overflow-y-auto custom-scrollbar p-1">
                      {SKILL_OPTS.map(s => (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-mono transition-all border whitespace-nowrap ${form.skills.includes(s)
                            ? "chip-orange"
                            : "border-orange-400/15 text-stone-400 hover:border-orange-500/40 hover:text-white"
                            }`}
                        >
                          {form.skills.includes(s) && "✓ "}{s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 lg:mb-1.5 block font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      Industry Interests
                    </label>
                    <div className="relative group hud-input-group">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-orange-400 text-[18px] transition-colors duration-200 icon-animate-work">work</span>
                      <input
                        value={form.interests}
                        onChange={e => set("interests", e.target.value)}
                        placeholder="e.g. FinTech, AI, Developer Tools, Startups..."
                        autoComplete="off"
                        className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-4 py-3.5 lg:py-2.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-orange"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 lg:mt-2.5">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 lg:py-2.5 rounded-2xl font-bold font-mono text-stone-400 border border-orange-400/15 hover:text-white hover:border-orange-500/40 transition-all text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="interactive primary-blue flex-1 py-3.5 lg:py-2.5 rounded-2xl font-bold text-white text-xs flex items-center justify-center gap-2 font-mono cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                      {loading ? (
                        <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>Registering...</>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <style>{`
                        @keyframes hud-btn-spin {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                        @keyframes hud-btn-pulse {
                          0%, 100% { transform: scale(0.85); opacity: 0.6; }
                          50% { transform: scale(1.15); opacity: 1; }
                        }
                        .anim-hud-ring {
                          animation: hud-btn-spin 6s linear infinite;
                          transform-origin: center;
                        }
                        .anim-hud-core {
                          animation: hud-btn-pulse 1.6s ease-in-out infinite;
                          transform-origin: center;
                        }
                      `}</style>
                            <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="4 3" className="anim-hud-ring" />
                            <circle cx="12" cy="12" r="3.5" fill="currentColor" className="anim-hud-core" />
                          </svg>
                          Launch Vector
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-stone-400 mt-6 lg:mt-3">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors font-mono">Sign in →</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
