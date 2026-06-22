"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

// Curated list of useful AI career coaching tips
const CAREER_TIPS = [
  "💡 STAR Method: Detail Situation, Task, Action, and Result for behavioral interview questions.",
  "💡 ATS Rule: Match the action verbs in your resume directly with target job requirements.",
  "💡 Outreach: Keep cold emails under 150 words with a clear, singular call to action.",
  "💡 Tone Check: Speak at a steady, confident pace of 130-150 words per minute during mocks.",
  "💡 Resume Impact: Start every experience bullet point with a strong, quantifiable action verb.",
  "💡 Strategy: Track weekly progress and practice mock interviews at least twice a week.",
  "💡 Alumni Connection: Target university alumni on LinkedIn for a much higher response rate.",
];

export default function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [tip, setTip] = useState("");

  // Select a dynamic tip based on pathname or random seed
  useEffect(() => {
    const index = Math.floor(Math.random() * CAREER_TIPS.length);
    setTip(CAREER_TIPS[index]);
  }, [pathname]);

  // Don't render on landing, login, register, or OTP pages
  const isExcluded =
    pathname === "/" ||
    pathname === "/LandingPage" ||
    pathname.startsWith("/auth");

  if (isExcluded) return null;

  return (
    <footer className="sidebar-aware border-t border-orange-400/10 bg-[#0c0a09]/95 text-stone-400 py-6 px-4 md:py-8 md:px-8 relative overflow-hidden select-none pb-20 lg:pb-8">
      {/* Subtle Background Glows */}
      <div className="absolute -bottom-10 left-1/4 w-[300px] h-[100px] rounded-full bg-orange-500/5 blur-[70px] pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-[200px] h-[80px] rounded-full bg-blue-500/5 blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {/* Branding & Status */}
        <div className="flex flex-col gap-2.5">
          <Link href="/Dashboard" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-300 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <span className="text-base font-black text-white tracking-tighter">KareerPilot</span>
          </Link>
          <p className="text-[11px] md:text-xs text-stone-500 leading-normal max-w-xs">
            Your personal AI career coach, empowering you to practice mock interviews, analyze resumes, and find top matches.
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
            <span className="text-[9px] tracking-wider font-mono text-emerald-400/90 uppercase">
              AI Coach Engine: Online
            </span>
          </div>
        </div>

        {/* AI Career Assistant Tip of the Day */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            COACH'S DAILY TIP
          </h4>
          <div className="bg-orange-500/5 border border-orange-400/10 rounded-xl p-3 relative overflow-hidden flex flex-col justify-center min-h-[60px] md:min-h-[70px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/5 rounded-full blur-xl pointer-events-none" />
            <p className="text-xs text-stone-200 font-medium leading-relaxed italic">
              {tip || CAREER_TIPS[0]}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation & User Actions */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            QUICK RUNWAYS
          </h4>
          <ul className="grid grid-cols-2 sm:flex sm:flex-col gap-1.5 text-[11px]">
            <li>
              <Link href="/Dashboard" className="hover:text-orange-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">home</span> Home
              </Link>
            </li>
            <li>
              <Link href="/MockInterview" className="hover:text-orange-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">record_voice_over</span> AI Coach
              </Link>
            </li>
            <li>
              <Link href="/ResumeAnalyzer" className="hover:text-orange-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">description</span> Resume
              </Link>
            </li>
            <li>
              <Link href="/Progress" className="hover:text-orange-300 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">insights</span> Stats
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-stone-900 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 text-[10px] text-stone-500">
        <div>
          © {new Date().getFullYear()} KareerPilot. Professional AI Coaching.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-orange-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-300 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
