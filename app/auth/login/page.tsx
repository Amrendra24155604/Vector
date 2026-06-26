"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";
import { AIBrainIcon } from "@/components/Sidebar";
import CursorGlow from "@/components/CursorGlow";

const LoginIllustration = () => (
  <svg width="360" height="360" viewBox="0 0 200 200" fill="none" className="w-full max-w-[340px] aspect-square">
    <style>{`
      @keyframes spin-cw {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spin-ccw {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
      @keyframes pulse-core {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px #3b82f6); opacity: 0.95; }
        50% { transform: scale(1.08); filter: drop-shadow(0 0 24px #ef4444); opacity: 1; }
      }
      @keyframes scanning {
        0%, 100% { transform: translateY(-55px) rotate(0deg); opacity: 0.2; }
        50% { transform: translateY(55px) rotate(180deg); opacity: 0.85; }
      }
      @keyframes hud-flicker {
        0%, 19%, 21%, 23%, 25%, 39%, 41%, 89%, 100% { opacity: 0.95; }
        20%, 24%, 40% { opacity: 0.35; }
      }
      .core-pulse {
        transform-origin: 100px 100px;
        animation: pulse-core 3s ease-in-out infinite;
      }
      .ring-slow {
        transform-origin: 100px 100px;
        animation: spin-cw 30s linear infinite;
      }
      .ring-fast {
        transform-origin: 100px 100px;
        animation: spin-ccw 12s linear infinite;
      }
      .hud-flicker {
        animation: hud-flicker 5s linear infinite;
      }
      .scanner-sweep {
        transform-origin: 100px 100px;
        animation: scanning 4s ease-in-out infinite;
      }
    `}</style>

    {/* Outer Radar Boundary Grid */}
    <circle cx="100" cy="100" r="95" stroke="rgba(30,58,138,0.15)" strokeWidth="1" />
    <circle cx="100" cy="100" r="95" stroke="url(#blue-grad)" strokeWidth="1.5" strokeDasharray="6 44" className="ring-slow" />

    {/* Segmented Outer Telemetry Ring */}
    <circle cx="100" cy="100" r="87" stroke="rgba(239,68,68,0.15)" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="87" stroke="url(#red-grad)" strokeWidth="2.2" strokeDasharray="30 15 5 15 15 10" className="ring-slow" />

    {/* Inner Telemetry Compass Ring */}
    <circle cx="100" cy="100" r="74" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="66" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="70 30" className="ring-fast" opacity="0.85" />

    {/* Crosshair / HUD locks */}
    <g className="hud-flicker" opacity="0.95">
      {/* Corner Brackets using Gradient */}
      <path d="M45 45 H55 M45 45 V55" stroke="url(#blue-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M155 45 H145 M155 45 V55" stroke="url(#blue-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M45 155 H55 M45 155 V145" stroke="url(#red-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M155 155 H145 M155 155 V145" stroke="url(#red-grad)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Telemetry Indicator Texts with White, Blue, Red and Dark Navy styles */}
      <text x="45" y="38" fill="#ffffff" className="font-mono text-[7.5px] tracking-wider uppercase font-black">SYS_LOAD: 98%</text>
      <text x="122" y="38" fill="#ef4444" className="font-mono text-[7.5px] tracking-wider uppercase font-black text-right">LOCK_ON: AI</text>
      <text x="45" y="168" fill="#93c5fd" className="font-mono text-[6.5px] tracking-widest font-bold">COACH_MODEL_V4.2</text>
      <text x="122" y="168" fill="#ffffff" className="font-mono text-[6.5px] tracking-widest font-bold text-right">LINK: SECURE</text>
    </g>

    {/* 3D Interlocking Gyroscope Rings in Electric Blue, Crimson Red, and Pure White */}
    <g className="ring-slow">
      <ellipse cx="100" cy="100" rx="55" ry="18" stroke="url(#white-blue-grad)" strokeWidth="2" fill="none" transform="rotate(30 100 100)" opacity="0.85" />
      <ellipse cx="100" cy="100" rx="55" ry="18" stroke="url(#blue-grad)" strokeWidth="1.8" fill="none" transform="rotate(120 100 100)" opacity="0.8" />
    </g>
    <g className="ring-fast">
      <ellipse cx="100" cy="100" rx="50" ry="12" stroke="url(#red-grad)" strokeWidth="1.5" fill="none" transform="rotate(-45 100 100)" opacity="0.85" />
    </g>

    {/* Radar sweep line in White/Blue/Red/Navy gradient */}
    <line x1="100" y1="100" x2="100" y2="5" stroke="url(#radar-grad-blue-red)" strokeWidth="3" strokeLinecap="round" className="ring-fast" />

    {/* Horizontal Scanning Laser with neon red dual-glow */}
    <g className="scanner-sweep">
      <line x1="22" y1="100" x2="178" y2="100" stroke="#ef4444" strokeWidth="1.8" opacity="0.85" style={{ filter: "drop-shadow(0 0 6px #ef4444)" }} />
      <polygon points="22,100 178,100 162,112 38,112" fill="url(#laser-glow)" opacity="0.25" />
    </g>

    {/* Glowing Telemetry Fusion Core (White/Blue/Navy/Red radial glow) */}
    <g className="core-pulse">
      <circle cx="100" cy="100" r="18" fill="url(#core-gradient-blue-red)" />
      <circle cx="100" cy="100" r="8" fill="#ffffff" style={{ filter: "drop-shadow(0 0 8px #ffffff)" }} />

      {/* Orbiting core satellites (White, Blue, Navy, Red) */}
      <g className="ring-slow">
        <circle cx="100" cy="76" r="3.5" fill="#ffffff" style={{ filter: "drop-shadow(0 0 4px #ffffff)" }} />
        <circle cx="100" cy="124" r="3.5" fill="#ef4444" style={{ filter: "drop-shadow(0 0 4px #ef4444)" }} />
      </g>
      <g className="ring-fast">
        <circle cx="76" cy="100" r="3.5" fill="#3b82f6" style={{ filter: "drop-shadow(0 0 4px #3b82f6)" }} />
        <circle cx="124" cy="100" r="3.5" fill="#1e3a8a" style={{ filter: "drop-shadow(0 0 4px #1e3a8a)" }} />
      </g>
    </g>

    {/* Audio wave bars in White, Electric Blue, Crimson Red, Navy Blue */}
    <g opacity="0.8" className="hud-flicker">
      {/* Left group */}
      <line x1="15" y1="75" x2="25" y2="75" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="12" y1="80" x2="25" y2="80" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="15" y1="85" x2="25" y2="85" stroke="#1e3a8a" strokeWidth="1.5" />
      <line x1="10" y1="90" x2="25" y2="90" stroke="#ef4444" strokeWidth="1.5" />

      {/* Right group */}
      <line x1="175" y1="75" x2="185" y2="75" stroke="#ef4444" strokeWidth="1.5" />
      <line x1="175" y1="80" x2="188" y2="80" stroke="#1e3a8a" strokeWidth="1.5" />
      <line x1="175" y1="85" x2="185" y2="85" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="175" y1="90" x2="190" y2="90" stroke="#ffffff" strokeWidth="1.5" />
    </g>

    <defs>
      {/* White, Blue, Red, Navy Blue, Black color scheme Gradients */}
      <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>

      <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>

      <linearGradient id="white-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>

      <radialGradient id="core-gradient-blue-red" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#38bdf8" />
        <stop offset="70%" stopColor="#1e3a8a" />
        <stop offset="95%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>

      <linearGradient id="laser-glow" x1="100" y1="100" x2="100" y2="112" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="radar-grad-blue-red" x1="100" y1="100" x2="100" y2="5" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
        <stop offset="80%" stopColor="#1e3a8a" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="corner-bracket-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>

      <linearGradient id="corner-bracket-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
    </defs>
  </svg>
);

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.needsVerification && err.email) {
        window.location.href = `/auth/verify-otp?email=${encodeURIComponent(err.email)}`;
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden orange-page-tint">
      {loading && <Loader overlay title="Auth Gateway" text="Signing in..." />}
      <GridBackgroundDemo />
      <CursorGlow />

      {/* Main split viewport container (spans at least 80% viewport size) */}
      <div className="relative z-20 w-full max-w-5xl min-h-[80vh] deep-card flex">
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
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6 my-4 select-none">
            <LoginIllustration />
            <div className="text-center max-w-xs">
              <p className="text-sm font-bold text-white font-mono uppercase tracking-widest">Interactive Sandbox</p>
              <p className="text-[11px] text-stone-400 font-sans mt-1.5 leading-relaxed">
                Connect your credentials to access neural voice coaches and resume scanning modules.
              </p>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-orange-400 font-mono font-bold">Neural Engine V4.2.0</span>
            <span className="text-[11px] text-stone-500 font-sans">Empowering developers, designers, and managers with AI prep logic.</span>
          </div>
        </div>

        {/* Right Side Panel: Form details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-[#181615]/95 relative">
          <div className="w-full max-w-md mx-auto">

            {/* Mobile Header / Branding (hidden on desktop) */}
            <div className="text-center md:text-left mb-8">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">Welcome Back</h1>
              <p className="text-xs text-stone-400 mt-1.5 font-sans">Sign in to your Vector career coach gateway.</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl flex items-center gap-3 text-sm bg-rose-500/10 border border-rose-500/20">
                <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
                <span className="text-rose-300 text-xs">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Hidden autocomplete traps to prevent browser pre-filling */}
              <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} />
              <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} />

              <div>
                <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2 block font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  Email Address
                </label>
                <div className="relative group hud-input-group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-orange-400 text-[18px] transition-colors duration-200 icon-animate-mail">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    autoComplete="off"
                    required
                    className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-4 py-3.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-orange"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-widest font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Password
                  </label>
                  <button type="button" className="text-[10px] text-orange-300 hover:text-orange-200 transition-colors font-bold font-mono">Forgot password?</button>
                </div>
                <div className="relative group hud-input-group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 group-focus-within:text-red-400 text-[18px] transition-colors duration-200 icon-animate-lock">lock</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="w-full bg-[#12100f] text-[#e8e1df] text-xs rounded-xl pl-11 pr-10 py-3.5 border border-stone-800/80 outline-none font-mono placeholder:text-stone-600 hud-input-red"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="interactive primary-blue w-full py-3.5 rounded-2xl font-bold text-white text-xs flex items-center justify-center gap-2 mt-2 font-mono transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>Signing in...</>
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
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-orange-500/10" /></div>
              <div className="relative flex justify-center">
                <span className="bg-[#181615] px-3 text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">or continue with</span>
              </div>
            </div>

            <button onClick={handleGoogleLogin} className="w-full py-3.5 rounded-2xl font-bold text-[#e8e1df] text-xs flex items-center justify-center gap-2 border border-orange-400/15 hover:border-orange-400/30 hover:bg-[#1a1716] transition-all font-mono hover:shadow-[0_0_15px_rgba(249,115,22,0.05)]">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google Account
            </button>

            <p className="text-center text-xs text-stone-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-orange-300 hover:text-orange-200 font-bold transition-colors font-mono">Create one free →</Link>
            </p>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
}
