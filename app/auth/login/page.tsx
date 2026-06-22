"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden orange-page-tint">
      {loading && <Loader overlay title="Auth Gateway" text="Signing in..." />}
      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{
          transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
        }}
      />

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-20 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/LandingPage" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-300 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">KareerPilot</span>
          </Link>
          <h1 className="font-headline-lg text-white mb-2">Welcome back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your AI career coach</p>
        </div>

        {/* Card */}
        <div className="soft-card rounded-3xl p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl flex items-center gap-3 text-sm bg-rose-500/10 border border-rose-500/20">
              <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
              <span className="text-rose-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-2 block">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-[20px]">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  required
                  className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl pl-11 pr-4 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] text-orange-300 hover:text-orange-200 transition-colors font-bold">Forgot password?</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-[20px]">lock</span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl pl-11 pr-11 py-3.5 border border-orange-400/15 focus:border-orange-500 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="interactive primary-blue w-full py-4 rounded-2xl font-headline-md text-white text-base flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>Signing in...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>Sign In</>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-orange-400/10" /></div>
            <div className="relative flex justify-center">
              <span className="bg-[#181615] px-3 text-[11px] text-stone-500 font-medium">or continue with</span>
            </div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full py-3.5 rounded-2xl font-bold text-[#e8e1df] text-sm flex items-center justify-center gap-3 border border-orange-400/15 hover:border-orange-400/30 hover:bg-[#1a1716] transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-orange-300 hover:text-orange-200 font-bold transition-colors">Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
