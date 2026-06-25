"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Script from "next/script";
import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import {
  CardIconShell,
  AiCoachIcon,
  OpportunityRadarIcon,
  ResumeScannerIcon,
  CoachingStarIcon
} from "@/components/AnimatedCardIcons";

export default function UpgradePage() {
  const { user, token, loading, updateUser } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Payment states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const price = selectedPlan === "yearly" ? 1499 : 149;
  const planLabel = selectedPlan === "yearly" ? "Yearly Pro Membership" : "Monthly Pro Membership";

  const handlePayWithRazorpay = async () => {
    if (typeof (window as any).Razorpay === "undefined") {
      setErrorMessage("Razorpay checkout SDK is still loading. Please check your internet connection and try again.");
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);
    setProcessingStep("Contacting Razorpay Secure Server...");

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_p0yvPry3l5u6h4",
        amount: price * 100, // Amount in paise
        currency: "INR",
        name: "Vector Pro",
        description: planLabel,
        image: "https://cdn-icons-png.flaticon.com/512/3661/3661313.png", // Premium gear/brain avatar URL
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: ""
        },
        theme: {
          color: "#f97316" // Orange brand theme accent
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        handler: async function (response: any) {
          setProcessingStep("Verifying payment token via security gateways...");
          
          try {
            const res = await fetch("/api/auth/upgrade", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id
              })
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "Failed to upgrade user subscription status");
            }

            if (data.success && data.user) {
              updateUser(data.user);
              setIsProcessing(false);
              setIsSuccess(true);
              setTimeout(() => {
                router.push("/Profile");
              }, 3000);
            } else {
              throw new Error("Invalid response schema from backend endpoints");
            }
          } catch (err: any) {
            setIsProcessing(false);
            setErrorMessage(err.message || "Token verification failed. Membership not updated.");
          }
        }
      };

      setIsProcessing(false);
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage("Could not initialize Razorpay SDK. Try refreshing the window.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen orange-page-tint overflow-x-hidden">
      {/* Load Razorpay Checkout SDK Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <style>{`
        .upgrade-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .upgrade-card:hover {
          border-color: rgba(251, 146, 60, 0.35);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        .fade-in {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .check-animate {
          animation: scaleInCheck 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
          opacity: 0;
          transform: scale(0.6);
        }
        @keyframes scaleInCheck {
          to { opacity: 1; transform: scale(1); }
        }
        .pro-glow-badge {
          background: linear-gradient(135deg, #f97316, #b45309);
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.45);
        }
      `}</style>

      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{
          transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
        }}
      />

      <TopBar title="Upgrade Membership" />

      <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header Area */}
          <div className="text-center max-w-2xl mx-auto mb-12 fade-in">
            <span className="pro-glow-badge text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full font-mono mb-4 inline-block">
              Vector Pro
            </span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3 font-mono">
              Accelerate Your Career Transition
            </h1>
            <p className="text-sm text-stone-400 font-sans">
              Upgrade to the premium suite and get full, unrestricted neural evaluations, cold outreach runways, and advanced resume matches.
            </p>
          </div>

          {/* Success / Pro Screen */}
          {user.isPro || isSuccess ? (
            <div className="max-w-lg mx-auto bg-[#181615] border border-orange-500/30 rounded-3xl p-8 text-center glass-card relative overflow-hidden fade-in shadow-[0_15px_40px_rgba(249,115,22,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10 py-6">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-6 check-animate">
                  <span className="material-symbols-outlined text-orange-400 text-3xl font-black">done</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-mono">You are a Pro Member!</h2>
                <p className="text-sm text-stone-400 leading-relaxed max-w-sm mx-auto mb-8 font-sans">
                  Thank you for upgrading! Your subscription is active. All professional interview models and matching runways are now unlocked.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  Redirecting you back to your workspace...
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start fade-in" style={{ animationDelay: "0.1s" }}>
              {/* Left Column: Pro Plan features & Plan Picker */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* Plan selector card */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">
                    Select Membership Plan
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Monthly plan */}
                    <div
                      onClick={() => setSelectedPlan("monthly")}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                        selectedPlan === "monthly"
                          ? "bg-orange-500/5 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                          : "bg-[#161413] border-stone-850 text-stone-400 hover:text-stone-300"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold font-mono">Monthly</span>
                        {selectedPlan === "monthly" && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white font-mono">₹149</span>
                        <span className="text-[10px] text-stone-500 font-mono"> / month</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">Best for short trial prep</p>
                    </div>

                    {/* Yearly plan */}
                    <div
                      onClick={() => setSelectedPlan("yearly")}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between relative overflow-hidden ${
                        selectedPlan === "yearly"
                          ? "bg-orange-500/5 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                          : "bg-[#161413] border-stone-850 text-stone-400 hover:text-stone-300"
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl font-mono">
                        Save 15%
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold font-mono">Yearly</span>
                        {selectedPlan === "yearly" && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white font-mono">₹1,499</span>
                        <span className="text-[10px] text-stone-500 font-mono"> / year</span>
                      </div>
                      <p className="text-[9px] text-stone-500 mt-2">Includes priority model access</p>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">
                    PRO FEATURES UNLOCKED
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {/* Feature 1 */}
                    <div className="flex gap-3">
                      <CardIconShell className="p-1 flex items-center justify-center w-9 h-9 border-orange-500/10">
                        <AiCoachIcon className="scale-75" />
                      </CardIconShell>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                          Unlimited AI Coaching Mocks
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed font-sans">
                          Conduct unlimited speech reviews, pacing assessments, and get precise filler-word correction diagnostics.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex gap-3">
                      <CardIconShell className="p-1 flex items-center justify-center w-9 h-9 border-orange-500/10">
                        <ResumeScannerIcon className="scale-75" />
                      </CardIconShell>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                          Deep ATS Parser & Scan Reports
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed font-sans">
                          Unlock deep compliance audits of section headings, formatting issues, and precise keyword matching benchmarks.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex gap-3">
                      <CardIconShell className="p-1 flex items-center justify-center w-9 h-9 border-orange-500/10">
                        <OpportunityRadarIcon className="scale-75" />
                      </CardIconShell>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                          Priority Internship Matching
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed font-sans">
                          Gain instant notifications for 90%+ match scoring roles. First-look analytics on active postings.
                        </p>
                      </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex gap-3">
                      <CardIconShell className="p-1 flex items-center justify-center w-9 h-9 border-orange-500/10">
                        <CoachingStarIcon className="scale-75" />
                      </CardIconShell>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                          Cold Outreach Generative Engine
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed font-sans">
                          Generate unlimited customized recruiter emails, cover letters, and follow-ups. Runways verified by AI.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Razorpay Secure Order Summary */}
              <div className="lg:col-span-6">
                <div className="bg-[#181615]/80 border border-orange-500/15 p-6 md:p-8 rounded-3xl relative overflow-hidden glass-card flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest font-mono block">
                      Order Summary
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 font-mono">
                      Pay with Razorpay
                    </h2>
                  </div>

                  <div className="flex justify-between items-center bg-[#141211] p-4 rounded-xl border border-stone-850">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">{planLabel}</p>
                      <p className="text-[10px] text-stone-400 font-sans mt-0.5">Recurring subscription billing</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white font-mono">₹{price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-stone-400 font-sans">
                      <span>Subtotal</span>
                      <span>₹{price.toLocaleString("en-IN")}.00</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400 font-sans">
                      <span>Gateway Processing Fees</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="border-t border-orange-500/10 pt-3 flex justify-between text-sm font-bold text-white font-mono">
                      <span>Total Amount due</span>
                      <span className="text-orange-400">₹{price.toLocaleString("en-IN")}.00</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handlePayWithRazorpay}
                      disabled={isProcessing}
                      className="interactive wavy-blue-btn w-full py-4 rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 select-none cursor-pointer"
                    >
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
                      <span>Pay Securely via Razorpay</span>
                    </button>
                    
                    <div className="flex items-center justify-center gap-4 text-[10px] text-stone-500 font-mono mt-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified_user</span>
                        UPI & Card Sandbox
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        SSL Encrypted
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-850 pt-4 mt-2 flex flex-col gap-2">
                    <p className="text-[10px] text-stone-500 font-sans leading-relaxed text-center">
                      Note: You are currently checking out in Razorpay **Test Mode**. You can simulate successful payments using dummy cards or test UPI addresses without any real charges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Gateway Loading Overlay Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-[#0c0a09]/92 backdrop-blur-md flex items-center justify-center p-6 select-none">
          <div className="bg-[#181615] border border-orange-500/25 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
            <div className="relative w-14 h-14 mx-auto mb-6">
              <div className="w-14 h-14 border-4 border-orange-500/10 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-mono uppercase tracking-wider">
              Secure Gateway Link
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans mb-4">
              {processingStep}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-stone-500 font-mono">
              <span className="material-symbols-outlined text-[10px]">shield</span>
              Razorpay API Security Shield
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
