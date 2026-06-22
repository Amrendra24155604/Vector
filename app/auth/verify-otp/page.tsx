"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../../Background/page";
import Loader from "@/components/Loader";

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
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-300 text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">KareerPilot</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-sm text-stone-400">
            We sent a 6-digit code to{" "}
            <span className="text-orange-300 font-semibold">{email}</span>
          </p>
        </div>

        <div className="soft-card rounded-3xl p-8">
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
                      className="w-12 h-14 text-center text-2xl font-bold text-white bg-[#1d1b1a] border rounded-xl outline-none transition-all"
                      style={{
                        borderColor: digit ? "rgba(249,115,22,0.5)" : "rgba(251,146,60,0.15)",
                        boxShadow: digit ? "0 0 0 3px rgba(249,115,22,0.08)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={loading || otp.join("").length !== 6}
                className="interactive primary-blue w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-3 mb-4"
              >
                {loading ? (
                  <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>Verifying...</>
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>Verify Email</>
                )}
              </button>

              <p className="text-center text-sm text-stone-400">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="text-orange-300 hover:text-orange-200 font-bold transition-colors disabled:opacity-50"
                >
                  {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Wrong email?{" "}
          <Link href="/auth/register" className="text-orange-300 hover:text-orange-200 font-bold transition-colors">
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
