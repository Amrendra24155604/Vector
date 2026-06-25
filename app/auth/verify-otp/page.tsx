"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";
import { AIBrainIcon } from "@/components/Sidebar";

function VerifyOtpContent() {
  const { verifyOtp, sendOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace("/auth/register");
  }, [email, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-focus first input
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    // Auto-submit when all filled
    if (val && i === 5 && next.every(d => d)) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      handleVerify(text);
    }
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code || otp.join("");
    if (finalCode.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      await verifyOtp(email, finalCode);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setError("");
    try {
      await sendOtp(email);
      setCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden orange-page-tint">
      {loading && <Loader overlay title="Auth Gateway" text="Verifying..." />}
      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{ transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)` }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-20 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-6">
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
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-sm text-stone-400">
            We sent a 6-digit code to{" "}
            <span className="text-orange-300 font-semibold">{email}</span>
          </p>
        </div>

        <div className="deep-card p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-emerald-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email verified!</h2>
              <p className="text-sm text-stone-400">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 rounded-xl flex items-center gap-3 text-sm bg-rose-500/10 border border-rose-500/20">
                  <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
                  <span className="text-rose-300">{error}</span>
                </div>
              )}

              <div className="mb-6">
                <label className="text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-4 block text-center">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-12 h-14 text-center text-2xl font-bold text-white bg-[#12100f] border rounded-xl outline-none transition-all focus:-translate-y-[2px] hud-input-orange"
                      style={{
                        borderColor: digit ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.08)",
                        boxShadow: digit ? "0 0 15px rgba(249,115,22,0.15)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={loading || otp.join("").length !== 6}
                className="interactive primary-blue w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-3 mb-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {loading ? (
                  <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>Verifying...</>
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
                    Verify Email
                  </>
                )}
              </button>

              <p className="text-center text-sm text-stone-400">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors disabled:opacity-50"
                >
                  {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Wrong email?{" "}
          <Link href="/auth/register" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
            Back to register →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <Loader title="Auth Gateway" text="Loading..." />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
