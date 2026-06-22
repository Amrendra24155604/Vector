"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import { CanvasText } from "@/components/CanvasText";
import { AnimatedOutreachLogo } from "@/components/AnimatedOutreachLogo";
import {
  CoachPreferencesIcon,
  OutreachMailHeroIcon,
  PaperAirplaneOutreachIcon,
  DraftQuillIcon,
  CardIconShell,
} from "@/components/AnimatedCardIcons";

const TONES = [
  { id: "formal", label: "Formal", desc: "Professional & polished", icon: "business_center", color: "#f97316" },
  { id: "conversational", label: "Conversational", desc: "Warm & human", icon: "chat", color: "#fb923c" },
  { id: "bold", label: "Bold", desc: "Confident & direct", icon: "bolt", color: "#fdba74" },
];

// Mock history removed to prevent hardcoded items from showing under DB logs

function genEmail(company: string, recruiter: string, role: string, context: string, tone: string): string {
  const greet = recruiter ? `Hi ${recruiter},` : "Hi there,";
  const openers: Record<string, string> = {
    formal: `I am writing to express my strong interest in the ${role} position at ${company}.`,
    conversational: `I came across the ${role} role at ${company} and had to reach out —`,
    bold: `I want to join ${company} as a ${role}, and I think you should know why.`,
  };
  return `${greet}

${openers[tone] || openers.conversational} ${context ? `I've been following ${company}'s work on ${context} and I'm genuinely excited by the direction the team is heading.` : `${company}'s reputation for shipping exceptional products really caught my attention.`}

I'm a CS student with hands-on experience building full-stack applications, shipping production features, and contributing to open source. My recent work includes a real-time collaboration tool (10K+ users) and an ML-powered recommendation engine — the kind of impact I'd love to bring to ${company}.

I'd love to chat about the ${role} opportunity and how my background could add value to your team. I've attached my resume and am happy to do a quick 15-minute call at your convenience.

Thank you for your time!

Best,
[Your Name]
[LinkedIn] • [GitHub] • [Portfolio]`;
}

function genLinkedIn(company: string, recruiter: string, role: string, context: string): string {
  const greet = recruiter ? `Hi ${recruiter}` : "Hi there";
  return `${greet}! 👋 I'm a CS student passionate about building impactful products, and I came across the ${role} role at ${company}.${context ? ` Your work on ${context} is genuinely fascinating!` : ""} Would you be open to a brief chat? Happy to share my resume if helpful. Looking forward to connecting!`;
}

export default function ColdEmailPage() {
  const { token } = useAuth();
  const [company, setCompany] = useState("");
  const [recruiter, setRecruiter] = useState("");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ email: string; linkedin: string } | null>(null);
  const [activeOutput, setActiveOutput] = useState<"email" | "linkedin">("email");
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; draftId: string; company: string } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Screen width tracking for mobile optimizations
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/emails', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.emails)) {
        const formatted = data.emails.map((e: any) => ({
          _id: e._id,
          company: e.company,
          role: e.role,
          recruiter: e.recruiterName || '',
          generated: new Date(e.createdAt).toLocaleDateString() || 'Recent',
          used: e.wasUsed,
          generatedEmail: e.generatedEmail || '',
          generatedLinkedIn: e.generatedLinkedIn || '',
          companyContext: e.companyContext || '',
          tone: e.tone || 'conversational',
          userNotes: e.userNotes || '',
        }));
        setHistory(formatted);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const deleteHistory = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/emails/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (generatedId === id) {
          setResult(null);
          setGeneratedId(null);
        }
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to delete history draft", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const generate = async () => {
    if (!company || !role) return;
    setGenerating(true);

    try {
      if (token) {
        const res = await fetch('/api/emails/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            company,
            recruiterName: recruiter,
            role,
            companyContext: context,
            tone,
            userNotes: notes
          })
        });
        const data = await res.json();
        if (data.success && data.email) {
          setResult({
            email: data.email.generatedEmail,
            linkedin: data.email.generatedLinkedIn
          });
          setGeneratedId(data.email._id);
          fetchHistory();
          setGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to call API emails generate", err);
    }

    // Fallback Mock
    setTimeout(() => {
      setResult({ email: genEmail(company, recruiter, role, context, tone), linkedin: genLinkedIn(company, recruiter, role, context) });
      setGenerating(false);
    }, 2000);
  };

  const copy = async () => {
    const text = result ? (activeOutput === "email" ? result.email : result.linkedin) : "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (generatedId && token) {
      try {
        await fetch(`/api/emails/${generatedId}/mark-used`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchHistory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative min-h-screen orange-page-tint">
      {generating && <Loader overlay title="Cold Email AI" text="Researching..." />}
      <style>{`
        .animate-title {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUpTitle 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-subtitle {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUpSubtitle 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }

        @keyframes fadeUpTitle {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUpSubtitle {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-w: 639px) {
          .email-header {
            border-bottom: none !important;
            box-shadow: none !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-bottom: 0 !important;
          }
          .email-setup-card {
            border-top: none !important;
            box-shadow: none !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
            margin-top: 0 !important;
          }
        }
      `}
      </style>
      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{
          transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
        }}
      />

      <TopBar title="Cold Email Generator" ctaLabel="Generate Email" />
      <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-6xl w-full mx-auto">
          {/* Header */}
          <section className="relative overflow-hidden select-none hero-shell p-6 sm:p-8 md:p-10 email-header rounded-t-[32px] rounded-b-none border-b-0 mb-0 sm:rounded-[32px] sm:border-b sm:mb-10">
            <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="hidden sm:block absolute bottom-0 right-0 w-72 h-72 bg-orange-400/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Clipped background decoration container to match the hero-shell shape */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-t-[32px] rounded-b-none sm:rounded-[32px]">
                {/* Absolutely positioned giant static background decoration */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[760px] h-[380px] sm:w-[1000px] sm:h-[500px] md:w-[1200px] md:h-[600px] lg:w-[1400px] lg:h-[700px] translate-x-[15%] sm:translate-x-[18%] md:translate-x-[20%] lg:translate-x-[22%] -rotate-[8deg] opacity-65">
                    <AnimatedOutreachLogo />
                </div>
            </div>

            {/* Laptop / Desktop Version (widths >= 640px) */}
            <div className="hidden sm:flex relative z-10 max-w-4xl flex-col items-start text-left">
              {/* Clean Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full eyebrow text-[11px] font-semibold tracking-wider mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="font-mono text-orange-300">Neural Engine V4.2.0 • Status: Synced</span>
              </div>

              {/* Bold outlines / solid combination title */}
              <h1 className="font-headline-lg sm:text-5xl md:text-[64px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent] text-left select-none">
                Professional Outreach
                <br />
                <span className="text-orange-300 [-webkit-text-stroke:0px] [-webkit-text-fill-color:#fdba74] whitespace-nowrap bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                  <CanvasText
                    text="Message Generator"
                    backgroundClassName="bg-orange-400 dark:bg-orange-500"
                    colors={[
                      "rgba(255, 190, 120, 1)",
                      "rgba(255, 170, 90, 0.95)",
                      "rgba(255, 150, 60, 0.9)",
                      "rgba(249, 115, 22, 0.85)",
                      "rgba(249, 115, 22, 0.75)",
                      "rgba(249, 115, 22, 0.65)",
                      "rgba(249, 115, 22, 0.55)",
                      "rgba(249, 115, 22, 0.45)",
                      "rgba(249, 115, 22, 0.3)",
                      "rgba(249, 115, 22, 0.18)",
                    ]}
                    lineGap={3}
                    animationDuration={16}
                  />
                </span>
              </h1>

              {/* Description Subtitle */}
              <p className="text-sm md:text-lg text-stone-400 max-w-2xl mt-5 leading-relaxed text-left">
                AI-crafted outreach drafts that capture attention and sound genuinely human, tailored to company context and target tone.
              </p>
            </div>

            {/* Mobile Version (widths < 640px) */}
            <div className="flex sm:hidden relative z-10 max-w-4xl flex-col items-center text-center mx-auto">
              {/* Active Outreach status pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-[10px] font-bold tracking-[0.15em] font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
                <span>OUTREACH PROCESSOR ACTIVE</span>
              </div>

              {/* Spaced out category indicator */}
              <div
                className="text-stone-400 font-bold uppercase tracking-[0.6em] text-[11px] sm:text-xs mb-3 font-mono"
                style={{ letterSpacing: '0.65em' }}
              >
                ACCELERATED
              </div>

              {/* Large solid glowing heading */}
              <h1 className="text-4xl xs:text-5xl font-black text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] tracking-tight leading-none text-center select-none font-mono">
                <CanvasText
                  text="Outreach Hub"
                  backgroundClassName="bg-orange-400 dark:bg-orange-500"
                  colors={[
                    "rgba(255, 190, 120, 1)",
                    "rgba(255, 170, 90, 0.95)",
                    "rgba(255, 150, 60, 0.9)",
                    "rgba(249, 115, 22, 0.85)",
                    "rgba(249, 115, 22, 0.75)",
                    "rgba(249, 115, 22, 0.65)",
                    "rgba(249, 115, 22, 0.55)",
                    "rgba(249, 115, 22, 0.45)",
                    "rgba(249, 115, 22, 0.3)",
                    "rgba(249, 115, 22, 0.18)",
                  ]}
                  lineGap={3}
                  animationDuration={16}
                />
              </h1>

              {/* Neural Engine Synced Info */}
              <p className="text-sm md:text-lg text-stone-400 max-w-2xl font-mono mt-5 leading-relaxed text-center">
                Slide into recruiters' inboxes with personalized emails and LinkedIn messages that actually get noticed.                            </p>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Form */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="soft-card p-4 sm:p-8 rounded-b-2xl sm:rounded-2xl email-setup-card rounded-t-none border-t-0 sm:rounded-t-2xl sm:border-t flex flex-col gap-4 sm:gap-6 font-mono">
                {/* Preferences Header */}
                <div className="flex items-center justify-between mb-2 border-b border-orange-500/10 pb-3">
                  <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                    <CoachPreferencesIcon />
                    OUTREACH PREFERENCES
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">Processor Online</span>
                  </div>
                </div>

                {/* Company Name + Recruiter Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Company Name Field group */}
                  <div className="relative flex flex-col gap-1.5 group">
                    <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                      Company Name *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                        business
                      </span>
                      <input
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder={isMobile ? "Stripe, Notion..." : "Stripe, Google, Notion..."}
                        autoComplete="off"
                        name="cold-email-company-name"
                        id="cold-email-company-name"
                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-base rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Recruiter Name Field group */}
                  <div className="relative flex flex-col gap-1.5 group">
                    <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                      Recruiter Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                        person
                      </span>
                      <input
                        value={recruiter}
                        onChange={e => setRecruiter(e.target.value)}
                        placeholder="Sarah Kim (optional)"
                        autoComplete="off"
                        name="cold-email-recruiter-name"
                        id="cold-email-recruiter-name"
                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-base rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Role + What excites you Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Target Role Field group */}
                  <div className="relative flex flex-col gap-1.5 group">
                    <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                      Target Role *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                        work
                      </span>
                      <input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="Software Engineering Intern"
                        autoComplete="off"
                        name="cold-email-target-role"
                        id="cold-email-target-role"
                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-base rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* What excites you Field group */}
                  <div className="relative flex flex-col gap-1.5 group">
                    <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                      What excites you? <span className="normal-case text-xs text-stone-500">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                        chat_bubble
                      </span>
                      <input
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        placeholder="Their payments infrastructure, developer tools..."
                        autoComplete="off"
                        name="cold-email-what-excites-you"
                        id="cold-email-what-excites-you"
                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-base rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Tone selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block">Tone</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {TONES.map(t => {
                      const toneTheme: Record<string, { bg: string; color: string }> = {
                        formal: { bg: "#1a2c5a", color: "#60a5fa" },
                        conversational: { bg: "#14422b", color: "#34d399" },
                        bold: { bg: "#3d0f28", color: "#fb7185" },
                      };
                      const tt = toneTheme[t.id] || { bg: "#1a1716", color: t.color };
                      return (
                        <button key={t.id} onClick={() => setTone(t.id)}
                          className="flex flex-row sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 p-3 sm:p-4 w-full cut-choice-btn"
                          style={tone === t.id
                            ? { "--btn-bg": tt.bg, "--btn-border": "rgba(255,255,255,1)", "--btn-border-hover": "rgba(255,255,255,1)", "--btn-filter": "drop-shadow(0 0 8px rgba(255,255,255,0.3))", color: tt.color } as React.CSSProperties
                            : { "--btn-bg": "#1a1716", "--btn-border": "rgba(251,146,60,0.15)" } as React.CSSProperties
                          }
                        >
                          <span className="material-symbols-outlined text-[20px] sm:text-[24px] flex-shrink-0" style={{ color: tone === t.id ? t.color : "#78716c" }}>{t.icon}</span>
                          <div className="flex flex-col sm:items-center min-w-0">
                            <span className="text-sm font-bold text-white leading-tight">{t.label}</span>
                            <span className="text-[10px] sm:text-xs text-stone-500 mt-0.5 leading-normal truncate sm:text-center sm:whitespace-normal" title={t.desc}>{t.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes Field group */}
                <div className="relative flex flex-col gap-1.5 group">
                  <label className="text-sm font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                    Additional Notes <span className="normal-case text-xs text-stone-500">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-4 transition-colors group-focus-within:text-orange-400">
                      edit_note
                    </span>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Any specific skills, projects, or context to highlight..."
                      className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-base rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit button (CTA) */}
                <button
                  onClick={generate}
                  disabled={!company || !role || !tone || generating}
                  className="interactive wavy-blue-btn w-full py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-sans font-medium text-white text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-40"
                  style={company && role && tone && !generating ? {} : { background: "#221f1e", border: "1px solid rgba(251, 146, 60, 0.15)", color: "#78716c", cursor: "not-allowed" }}
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".25" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <span>Researching & Crafting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] sm:text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                      <span className="hidden sm:inline">Research Company & Generate Outreach Drafts</span>
                      <span className="inline sm:hidden">Generate Email</span>
                    </>
                  )}
                </button>
              </div>

              {/* History */}
              <div className="soft-card rounded-2xl p-5">
                <h3 className="text-xs font-label-md text-on-surface-variant uppercase tracking-widest mb-3">Recent Emails</h3>
                <div className="flex flex-col gap-2 relative">
                  <AnimatePresence initial={false}>
                    {history.length === 0 ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center py-6 text-stone-500 border border-dashed border-orange-400/10 rounded-xl bg-orange-500/5"
                      >
                        <div className="flex justify-center mb-2 opacity-60">
                          <PaperAirplaneOutreachIcon />
                        </div>
                        <p className="text-xs">No recent outreach drafts.</p>
                        <p className="text-[10px] text-stone-600 mt-0.5">Generate one to start your campaign!</p>
                      </motion.div>
                    ) : (
                      history.map((h) => (
                        <motion.div
                          key={h._id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: -80,
                            scale: 0.95,
                            filter: "blur(4px)",
                            transition: { duration: 0.25, ease: "easeOut" }
                          }}
                          onClick={() => {
                            setCompany(h.company);
                            setRole(h.role);
                            setRecruiter(h.recruiter);
                            setContext(h.companyContext);
                            setTone(h.tone);
                            setNotes(h.userNotes);
                            setResult({
                              email: h.generatedEmail,
                              linkedin: h.generatedLinkedIn
                            });
                            setGeneratedId(h._id);
                            setActiveOutput("email");
                          }}
                          className="flex items-center justify-between py-2 border-b border-orange-400/10 last:border-0 cursor-pointer hover:bg-orange-500/5 px-2 rounded-lg transition-all"
                          title="Click to reload this generated template"
                        >
                          <div>
                            <p className="font-headline-md text-body-md text-white">{h.company}</p>
                            <p className="text-[11px] text-stone-500">{h.role} • {h.generated}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${h.used ? "chip-green" : "chip-blue"}`}>{h.used ? "Sent" : "Draft"}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModal({ isOpen: true, draftId: h._id, company: h.company });
                              }}
                              className="p-1 rounded hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-all flex items-center justify-center bg-transparent border-0"
                              title="Delete this draft"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="xl:col-span-3">
              {!result ? (
                <div className="soft-card rounded-2xl flex flex-col items-center justify-center min-h-[500px] gap-5 text-center p-10">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-orange-500/10 border border-orange-400/20">
                    <OutreachMailHeroIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline-md text-white mb-2">Your email will appear here</h3>
                    <p className="text-stone-400 max-w-sm text-sm">Fill in the details and hit Generate. Our AI will research the company and craft a personalized message that doesn&apos;t sound AI-generated.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                    {[["94%", "Reply Rate"], ["2 min", "Gen Time"], ["3", "Tone Variants"]].map(([v, l]) => (
                      <div key={l} className="soft-card rounded-xl p-2.5 text-center">
                        <p className="text-lg font-black text-orange-300">{v}</p>
                        <p className="text-[9px] text-stone-500">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 font-sans">
                  {/* Tab */}
                  <div className="flex gap-2">
                    {(["email", "linkedin"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveOutput(t)}
                        className={`choice-btn interactive px-5 py-2.5 text-sm font-medium flex items-center gap-2 ${activeOutput === t ? 'selected' : ''}`}
                        style={activeOutput === t ? { '--active-color': '#93c5fd', '--active-bg': 'rgba(29,78,216,0.15)' } as React.CSSProperties : {}}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {t === "email" ? "mail" : "public"}
                        </span>
                        {t === "email" ? "Cold Email" : "LinkedIn Message"}
                      </button>
                    ))}
                  </div>

                  <div className="soft-card rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-orange-400/10">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-stone-500 font-normal">
                          {activeOutput === "email"
                            ? `To: ${recruiter || "Hiring Manager"} @ ${company}`
                            : `LinkedIn DM to ${recruiter || company}`}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setResult(null)}
                          className="text-[11px] text-stone-400 hover:text-orange-400 transition-colors px-3 py-1.5 rounded-lg border border-orange-400/20 font-medium"
                        >
                          Regenerate
                        </button>

                        <button
                          onClick={copy}
                          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all ${copied ? "chip-green" : "chip-blue"
                            }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copied ? "check" : "content_copy"}
                          </span>
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <pre className="text-sm text-[#e8e1df] whitespace-pre-wrap leading-relaxed font-sans">
                        {activeOutput === "email" ? result.email : result.linkedin}
                      </pre>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="rounded-xl p-4 flex items-start gap-3 bg-orange-500/5 border border-orange-400/20">
                    <CardIconShell className="mt-0.5">
                      <DraftQuillIcon />
                    </CardIconShell>
                    <div>
                      <p className="text-xs font-semibold text-orange-300 mb-1">Pro Tip</p>
                      <p className="text-xs font-normal text-stone-400 leading-relaxed">
                        Send on Tuesday–Thursday, 9–11am in the recipient&apos;s timezone.
                        Personalize the first line further with a recent company blog post or
                        product launch for best results.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-[#120f0e]/85 backdrop-blur-lg border-t border-orange-400/10 flex justify-around items-center px-4 pb-4 pt-2">
        {[["Dashboard", "dashboard", "/Dashboard"], ["Resume", "description", "/ResumeAnalyzer"], ["Email", "mail", "/ColdEmail"], ["Progress", "insights", "/Progress"]].map(([label, icon, href]) => (
          <a key={href} href={href} className={`flex flex-col items-center gap-0.5 ${href === "/ColdEmail" ? "text-orange-300" : "text-stone-400"}`}>
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-[10px] font-semibold">{label}</span>
          </a>
        ))}
      </nav>
      <AnimatePresence>
        {deleteModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative z-10 w-full max-w-md soft-card rounded-3xl p-6 bg-[#120f0e] border border-orange-500/20 text-center flex flex-col items-center gap-5"
            >
              {/* Warning Header Symbol */}
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <span className="material-symbols-outlined text-[32px]">delete_forever</span>
              </div>

              <div>
                <h4 className="text-xl font-headline-md text-white font-bold mb-2">Delete this draft?</h4>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Are you sure you want to permanently delete your generated draft for <span className="text-orange-300 font-bold">{deleteModal.company}</span>?
                  This will remove the record from your database logs forever.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold border border-orange-400/15 text-stone-400 hover:text-white hover:border-orange-500/40 transition-all bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const id = deleteModal.draftId;
                    setDeleteModal(null);
                    await deleteHistory(id);
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all bg-rose-600 hover:bg-rose-500 flex items-center justify-center gap-2 cursor-pointer border-0"
                  style={{ boxShadow: "0 8px 25px rgba(244,63,94,0.25)" }}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
