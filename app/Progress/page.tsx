"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import { CanvasText } from "@/components/CanvasText";
import { MovingWavyProgress } from "@/components/MovingWavyProgress";
import { AnimatedProgressLogo } from "@/components/AnimatedProgressLogo";
import {
  CardIconShell,
  AiCoachIcon,
  AverageScoreIcon,
  ApplicationFunnelIcon,
  RecentApplicationsIcon,
  PROGRESS_STAT_ICONS,
} from "@/components/AnimatedCardIcons";

const STATS = [
  { label: "Interviews Done", value: 0, change: "+0 this week", icon: "record_voice_over", color: "#f97316", chip: "chip-orange" },
  { label: "Avg Score", value: "0/100", change: "0 pts", icon: "analytics", color: "#10b981", chip: "chip-green" },
  { label: "Applications", value: 0, change: "0 active", icon: "work_history", color: "#fb923c", chip: "chip-orange" },
  { label: "Emails Sent", value: 0, change: "0 replied", icon: "mail", color: "#f59e0b", chip: "chip-orange" },
  { label: "Resume Score", value: "0%", change: "Needs work", icon: "description", color: "#f43f5e", chip: "chip-rose" },
  { label: "Streak", value: "0 days", change: "🔥 Keep going!", icon: "local_fire_department", color: "#f97316", chip: "chip-orange" },
];

const SCORE_HISTORY = [0, 0, 0, 0, 0, 0, 0];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FUNNEL = [
  { label: "Saved", count: 0, color: "#3b82f6", w: "0%" },
  { label: "Applied", count: 0, color: "#f97316", w: "0%" },
  { label: "Interview", count: 0, color: "#f59e0b", w: "0%" },
  { label: "Offer", count: 0, color: "#10b981", w: "0%" },
  { label: "Rejected", count: 0, color: "#f43f5e", w: "0%" },
];

const RECENT_APPS: any[] = [];

const NUDGES = [
  { icon: "", text: "You're in the top 12% of users this week. One more mock interview gets you to top 5%!" },
  { icon: "", text: "Your cold email reply rate (17%) is above average. Try sending 5 more this week!" },
  { icon: "", text: "Boosting your resume score from 74 to 85+ will 2x your callback rate. Upload a revised version!" },
  { icon: "", text: "You have 2 active interviews. Prep 2 STAR stories for each company — you've got this!" },
];

interface HistoryItem {
  date: string;
  score: number;
  role: string;
}

function MiniBarChart({ history }: { history: HistoryItem[] }) {
  const dataPoints = history && history.length > 0
    ? history.map(h => h.score)
    : [0, 0, 0, 0, 0, 0, 0];

  const labels = history && history.length > 0
    ? history.map(h => new Date(h.date).toLocaleDateString(undefined, { weekday: 'short' }))
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const max = Math.max(...dataPoints, 100);

  return (
    <div className="flex items-end gap-2 h-24 px-2">
      {dataPoints.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all duration-700" style={{ height: `${(v / max) * 80}px`, background: `linear-gradient(to top, #ea580c, #f97316)` }} />
          <span className="text-[9px] text-stone-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProgressPage() {
  const { token } = useAuth();
  const [statsData, setStatsData] = useState<any>(null);
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const nudge = NUDGES[nudgeIdx];
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isMobile, setIsMobile] = useState(false);

  const getFirstSentence = (text: string) => {
    if (!text) return "";
    const match = text.match(/[^.!?]+[.!?]/);
    return match ? match[0].trim() : text;
  };

  useEffect(() => {
    setNudgeIdx(Math.floor(Math.random() * NUDGES.length));
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/progress/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.stats) {
          setStatsData(data.stats);
        }
      })
      .catch(err => console.error("Failed to load progress stats", err));

    fetch('/api/progress/stats?nudge=true', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.stats?.aiNudge) {
          setStatsData((prev: any) => prev ? { ...prev, aiNudge: data.stats.aiNudge } : null);
        }
      })
      .catch(err => console.error("Failed to load progress nudge", err));
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Offer": return "#10b981";
      case "Interview": return "#f59e0b";
      case "Saved": return "#3b82f6";
      case "Rejected": return "#f43f5e";
      default: return "#f97316"; // Applied
    }
  };

  const displayStats = [
    {
      label: "Interviews Done",
      value: statsData?.totalSessions !== undefined ? statsData.totalSessions : 0,
      change: statsData?.sessionsThisWeek !== undefined ? `+${statsData.sessionsThisWeek} this week` : "+0 this week",
      icon: "record_voice_over",
      color: "#f97316",
      chip: "chip-orange"
    },
    {
      label: "Avg Score",
      value: statsData?.avgInterviewScore !== undefined ? `${statsData.avgInterviewScore}/100` : "0/100",
      change: statsData?.avgInterviewScore !== undefined ? `Target: 85+` : "0 pts",
      icon: "analytics",
      color: "#10b981",
      chip: "chip-green"
    },
    {
      label: "Applications",
      value: statsData?.totalApplications !== undefined ? statsData.totalApplications : 0,
      change: statsData?.recentApplications !== undefined ? `${statsData.recentApplications.length} active` : "0 active",
      icon: "work_history",
      color: "#fb923c",
      chip: "chip-orange"
    },
    {
      label: "Emails Sent",
      value: statsData?.totalEmails !== undefined ? statsData.totalEmails : 0,
      change: statsData?.emailsThisWeek !== undefined ? `+${statsData.emailsThisWeek} this week` : "0 replied",
      icon: "mail",
      color: "#f59e0b",
      chip: "chip-orange"
    },
    {
      label: "Resume Score",
      value: statsData?.resumeScore !== undefined ? `${statsData.resumeScore}%` : "0%",
      change: statsData?.resumeScore !== undefined && statsData.resumeScore >= 75 ? "ATS ready" : "Needs work",
      icon: "description",
      color: "#f43f5e",
      chip: "chip-rose"
    },
    {
      label: "Streak",
      value: statsData?.streak !== undefined ? `${statsData.streak} days` : "0 days",
      change: "🔥 Keep going!",
      icon: "local_fire_department",
      color: "#f97316",
      chip: "chip-orange"
    },
  ];

  const displayFunnel = statsData?.funnel ? [
    { label: "Saved", count: statsData.funnel.saved, color: "#3b82f6", w: `${statsData.totalApplications ? (statsData.funnel.saved / statsData.totalApplications) * 100 : 0}%` },
    { label: "Applied", count: statsData.funnel.applied, color: "#f97316", w: `${statsData.totalApplications ? (statsData.funnel.applied / statsData.totalApplications) * 100 : 0}%` },
    { label: "Interview", count: statsData.funnel.interview, color: "#f59e0b", w: `${statsData.totalApplications ? (statsData.funnel.interview / statsData.totalApplications) * 100 : 0}%` },
    { label: "Offer", count: statsData.funnel.offer, color: "#10b981", w: `${statsData.totalApplications ? (statsData.funnel.offer / statsData.totalApplications) * 100 : 0}%` },
    { label: "Rejected", count: statsData.funnel.rejected, color: "#f43f5e", w: `${statsData.totalApplications ? (statsData.funnel.rejected / statsData.totalApplications) * 100 : 0}%` },
  ] : FUNNEL;

  const conversionRate = statsData?.funnel
    ? (statsData.totalApplications ? ((statsData.funnel.offer / statsData.totalApplications) * 100).toFixed(1) : "0.0")
    : "0.0";

  const displayRecentApps = statsData?.recentApplications && statsData.recentApplications.length > 0
    ? statsData.recentApplications.map((app: any) => ({
      company: app.company,
      role: app.role,
      status: app.status,
      statusColor: getStatusColor(app.status)
    }))
    : RECENT_APPS;

  return (
    <div className="relative min-h-screen orange-page-tint">
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
  .progress-header {
    border-bottom: none !important;
    box-shadow: none !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    margin-bottom: 0 !important;
  }
  .progress-nudge-card {
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

      <TopBar title="Career Progress Dashboard" />
      <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <section className="relative overflow-hidden select-none hero-shell p-6 sm:p-8 md:p-10 progress-header rounded-t-[32px] rounded-b-none border-b-0 mb-0 sm:rounded-[32px] sm:border-b sm:mb-10">
            <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="hidden sm:block absolute bottom-0 right-0 w-72 h-72 bg-orange-400/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Clipped background decoration container to match the hero-shell shape */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-t-[32px] rounded-b-none sm:rounded-[32px]">
              {/* Absolutely positioned giant static background decoration */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[760px] h-[380px] sm:w-[1000px] sm:h-[500px] md:w-[1200px] md:h-[600px] lg:w-[1400px] lg:h-[700px] translate-x-[15%] sm:translate-x-[18%] md:translate-x-[20%] lg:translate-x-[22%] -rotate-[8deg] opacity-65">
                <AnimatedProgressLogo />
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
                Career Performance
                <br />
                <span className="text-orange-300 [-webkit-text-stroke:0px] [-webkit-text-fill-color:#fdba74] whitespace-nowrap bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                  <CanvasText
                    text="Analysis Hub"
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
                Monitor your job applications, email outreach response rates, and interview preparation metrics in one unified dashboard.
              </p>
            </div>

            {/* Mobile Version (widths < 640px) */}
            <div className="flex sm:hidden relative z-10 max-w-4xl flex-col items-center text-center mx-auto">
              {/* Active Tracker status pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-[10px] font-bold tracking-[0.15em] font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
                <span>TRACKING ENGINE ACTIVE</span>
              </div>

              {/* Spaced out category indicator */}
              <div
                className="text-stone-400 font-bold uppercase tracking-[0.6em] text-[11px] sm:text-xs mb-1 font-mono"
                style={{ letterSpacing: '0.65em' }}
              >
                ANALYTICS
              </div>

              {/* Large solid glowing heading */}
              <h1 className="text-4xl xs:text-5xl font-black text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] tracking-tight leading-none text-center select-none font-mono">
                <CanvasText
                  text="Career Progress"
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
              <p className="text-sm md:text-lg text-stone-400 max-w-2xl font-mono leading-relaxed text-center">
                Watch your progress level up as you complete tasks and unlock new opportunities.</p>

            </div>
          </section>

          {/* AI Nudge */}
          <div className="soft-card p-4 sm:p-6 rounded-b-2xl sm:rounded-2xl progress-nudge-card rounded-t-none border-t-0 sm:border-t flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between border-b border-orange-500/10 pb-3">
              <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                <AiCoachIcon />
                AI MOTIVATIONAL NUDGE
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">System Synced</span>
              </div>
            </div>
            <div className="flow-root sm:flex sm:items-center gap-4">
              <div className="float-left sm:float-none mr-3 mb-1 sm:mr-0 sm:mb-0 flex-shrink-0">
                <CardIconShell>
                  <AiCoachIcon />
                </CardIconShell>
              </div>
              <p className="text-sm text-white leading-relaxed clear-none">{isMobile ? getFirstSentence(statsData?.aiNudge || nudge.text) : (statsData?.aiNudge || nudge.text)}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 font-mono">
            {displayStats.map((s) => {
              const StatIcon = PROGRESS_STAT_ICONS[s.icon] || AverageScoreIcon;
              return (
              <div key={s.label} className="soft-card rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <CardIconShell className="p-2">
                    <StatIcon />
                  </CardIconShell>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                  <p className="text-xs font-normal text-stone-400 mt-0.5">{s.label}</p>
                </div>
                <span className={`${s.chip} text-[10px] px-2 py-0.5 rounded-full font-medium self-start`}>
                  {s.change}
                </span>
              </div>
            );})}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono">
            <div className="xl:col-span-2 soft-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-3 mb-4">
                <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <AverageScoreIcon />
                  INTERVIEW SCORES
                </h3>
                <div className="flex items-center gap-3">
                  <span className="chip-orange text-[10px] px-2 py-0.5 rounded-md font-mono">Last 7 sessions</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] text-stone-500 uppercase tracking-widest">Active Trend</span>
                  </div>
                </div>
              </div>
              {statsData?.scoreHistory && statsData.scoreHistory.length > 0 ? (
                <>
                  <MiniBarChart history={statsData.scoreHistory} />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-400/10">
                    <div className="text-center">
                      <p className="text-xs font-normal text-stone-500 font-mono">Start</p>
                      <p className="text-lg font-bold text-white tracking-tight">
                        {statsData.scoreHistory[0].score}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-emerald-400 font-mono">
                        {statsData.scoreHistory[statsData.scoreHistory.length - 1].score - statsData.scoreHistory[0].score >= 0 ? '+' : ''}
                        {statsData.scoreHistory[statsData.scoreHistory.length - 1].score - statsData.scoreHistory[0].score} pts change
                      </p>
                      <div
                        className="h-0.5 w-32 mx-auto mt-1 rounded"
                        style={{ background: "linear-gradient(to right,#ea580c,#10b981)" }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-normal text-stone-500 font-mono">Latest</p>
                      <p className="text-lg font-bold text-white tracking-tight">
                        {statsData.scoreHistory[statsData.scoreHistory.length - 1].score}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-stone-500 border border-dashed border-orange-400/10 rounded-xl bg-orange-500/5">
                  <div className="flex justify-center mb-2 opacity-60">
                    <AverageScoreIcon />
                  </div>
                  <p className="text-xs font-bold text-white">No interview scores yet</p>
                  <p className="text-[10px] text-stone-500 mt-1 max-w-xs mx-auto">Complete a mock interview session to begin charting your communication and technical score improvements.</p>
                  <a href="/MockInterview" className="inline-block mt-3 text-xs text-orange-300 hover:text-orange-200 font-bold transition-all hover:underline">Start an Interview →</a>
                </div>
              )}
            </div>

            <div className="soft-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-3 mb-4">
                <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <ApplicationFunnelIcon />
                  APPLICATION FUNNEL
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] text-stone-500 uppercase tracking-widest">Funnel Sync</span>
                </div>
              </div>
              {statsData?.totalApplications > 0 ? (
                <>
                  <div className="flex flex-col gap-3">
                    {displayFunnel.map((f) => (
                      <div key={f.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-stone-400 font-medium">{f.label}</span>
                          <span className="font-semibold text-white">{f.count}</span>
                        </div>
                        <MovingWavyProgress pct={f.w} color={f.color} trackColor="#221d1a" className="w-full mt-1" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-orange-400/10 flex items-center justify-between">
                    <span className="text-xs font-normal text-stone-500">Conversion rate</span>
                    <span className="text-sm font-semibold text-emerald-400">{conversionRate}%</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-stone-500 border border-dashed border-orange-400/10 rounded-xl bg-orange-500/5">
                  <div className="flex justify-center mb-2 opacity-60">
                    <ApplicationFunnelIcon />
                  </div>
                  <p className="text-xs font-bold text-white">Funnel is empty</p>
                  <p className="text-[10px] text-stone-500 mt-1 max-w-xs mx-auto">Saved and active job applications will dynamically generate conversion funnel metrics here.</p>
                </div>
              )}
            </div>

            <div className="soft-card rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-3 mb-4">
                <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <RecentApplicationsIcon />
                  RECENT APPLICATIONS
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href="/InternshipMatch"
                    className="text-xs text-orange-300 hover:text-orange-200 font-bold transition-colors flex items-center gap-0.5 hover:underline"
                  >
                    View all
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] text-stone-500 uppercase tracking-widest">Timeline Synced</span>
                  </div>
                </div>
              </div>
              {statsData?.recentApplications && statsData.recentApplications.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {displayRecentApps.map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-orange-400/10 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{a.company}</p>
                        <p className="text-xs font-normal text-stone-500">{a.role}</p>
                      </div>
                      <span
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                        style={{
                          color: a.statusColor,
                          background: `${a.statusColor}18`,
                          border: `1px solid ${a.statusColor}40`,
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-stone-500 border border-dashed border-orange-400/10 rounded-xl bg-orange-500/5">
                  <div className="flex justify-center mb-2 opacity-60">
                    <RecentApplicationsIcon />
                  </div>
                  <p className="text-xs font-bold text-white">No applications tracked yet</p>
                  <p className="text-[10px] text-stone-500 mt-1 max-w-xs mx-auto">Track your internships or jobs to monitor their progress through the funnel stages.</p>
                  <a href="/InternshipMatch" className="inline-block mt-3 text-xs text-orange-300 hover:text-orange-200 font-bold transition-all hover:underline">Find Internships →</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-[#120f0e]/85 backdrop-blur-lg border-t border-orange-400/10 flex justify-around items-center px-4 pb-4 pt-2">
        {[["Dashboard", "dashboard", "/Dashboard"], ["Resume", "description", "/ResumeAnalyzer"], ["Interview", "record_voice_over", "/MockInterview"], ["Progress", "insights", "/Progress"]].map(([label, icon, href]) => (
          <a key={href} href={href} className={`flex flex-col items-center gap-0.5 ${href === "/Progress" ? "text-orange-300" : "text-stone-400"}`}>
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-[10px] font-semibold">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
