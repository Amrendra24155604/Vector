"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../Background/page";
import TopBar from "@/components/TopBar";
import Loader from "@/components/Loader";
import { MovingWavyProgress } from "@/components/MovingWavyProgress";
import {
  CardIconShell,
  PROFILE_STAT_ICONS,
  InterviewsCompletedIcon,
  SkillsCodeIcon,
  InterestsSparkIcon,
  ProfileInfoIcon,
  UserAvatarShieldIcon,
} from "@/components/AnimatedCardIcons";

/* ─── tiny avatar colour helper ─── */
function nameToGradient(name: string) {
  const hue = (name.charCodeAt(0) * 47 + name.charCodeAt(name.length - 1) * 13) % 360;
  return `hsl(${hue},65%,52%), hsl(${(hue + 40) % 360},70%,40%)`;
}

/* ─── skill tag colours ─── */
const tagPalette = [
  { bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.28)", text: "#fdba74" },
  { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.28)", text: "#6ee7b7" },
  { bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.28)", text: "#93c5fd" },
  { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.28)", text: "#fcd34d" },
  { bg: "rgba(244,63,94,0.10)", border: "rgba(244,63,94,0.28)", text: "#fda4af" },
  { bg: "rgba(168,85,247,0.10)", border: "rgba(168,85,247,0.28)", text: "#d8b4fe" },
];

export default function ProfilePage() {
  const { user, token, loading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [avatarHover, setAvatarHover] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "settings">("overview");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* editable fields */
  const [form, setForm] = useState({
    name: "",
    university: "",
    major: "",
    graduationYear: "",
    location: "",
    interests: "",
    skills: "",
    avatarUrl: "",
  });

  /* populate from auth user */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        university: (user as any).university || "",
        major: (user as any).major || "",
        graduationYear: String((user as any).graduationYear || ""),
        location: (user as any).location || "",
        interests: Array.isArray((user as any).interests)
          ? (user as any).interests.join(", ")
          : (user as any).interests || "",
        skills: Array.isArray((user as any).skills)
          ? (user as any).skills.join(", ")
          : (user as any).skills || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  /* cursor glow */
  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* redirect if not authenticated */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  // Show loading gate while credentials are being validated
  if (loading || !user) {
    return (
      <div className="relative min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <Loader overlay title="CareerPilot" text="Loading Profile..." />
      </div>
    );
  }

  /* trigger file input click */
  function handleAvatarClick() {
    if (!editing) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  /* handle avatar file upload */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setSaving(true);
    setSaveMsg("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");

      if (data.success && data.user) {
        setForm((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
        updateUser(data.user);
        setSaveMsg("Avatar updated ✓");
      } else {
        throw new Error("Upload response invalid");
      }
    } catch (err: any) {
      setSaveMsg(err.message || "Failed to upload avatar");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  /* save profile */
  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const body: Record<string, any> = {
        name: form.name,
        university: form.university,
        major: form.major,
        location: form.location,
        avatarUrl: form.avatarUrl,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        interests: form.interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (form.graduationYear) body.graduationYear = Number(form.graduationYear);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");

      if (data.success && data.user) {
        updateUser(data.user);
        setSaveMsg("Profile updated ✓");
        setEditing(false);
      } else {
        throw new Error("Save response invalid");
      }
    } catch (err: any) {
      setSaveMsg(err.message || "Something went wrong. Try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  const displayName = form.name || user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const gradient = nameToGradient(displayName);
  const skillsList = form.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const interestsList = form.interests
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const statsItems = [
    { icon: "task_alt", label: "Interviews Done", value: (user as any)?.interviewSessionsCount ?? 0 },
    { icon: "analytics", label: "Resume Score", value: `${(user as any)?.resumeScore ?? 0}%` },
    { icon: "local_fire_department", label: "Streak", value: `${(user as any)?.streak ?? 0}d` },
    { icon: "send", label: "Emails Sent", value: (user as any)?.emailsSentCount ?? 0 },
  ];

  return (
    <div className="dark">
      <style>{`
        body {
          background-color: #0c0a09;
          color: #e8e1df;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .orange-page-tint {
          background:
            radial-gradient(circle at 18% 12%, rgba(249,115,22,0.045), transparent 26%),
            radial-gradient(circle at 82% 78%, rgba(251,146,60,0.04), transparent 24%),
            linear-gradient(to bottom, rgba(255,120,0,0.015), rgba(255,120,0,0.008));
          background-color: #0c0a09;
        }

        .cursor-glow {
          position: fixed;
          top: 0; left: 0;
          width: 380px; height: 380px;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.5;
          filter: blur(70px);
          background: radial-gradient(
            circle,
            rgba(251,146,60,0.30) 0%,
            rgba(249,115,22,0.22) 28%,
            rgba(234,88,12,0.16) 48%,
            rgba(194,65,12,0.08) 68%,
            rgba(120,53,15,0.00) 85%
          );
          transform: translate3d(0,0,0);
          transition: transform 0.07s linear;
          mix-blend-mode: screen;
        }

        .soft-card {
          background: rgba(24, 22, 21, 0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(251, 146, 60, 0.16);
          box-shadow: 
            0 0 0 1px rgba(251, 146, 60, 0.04), 
            0 15px 35px rgba(0, 0, 0, 0.35);
        }

        .deep-card {
          background: rgba(21, 19, 18, 0.75);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(251, 146, 60, 0.12);
          box-shadow: 
            0 0 0 1px rgba(251, 146, 60, 0.03), 
            0 20px 45px rgba(0, 0, 0, 0.45);
        }

        .eyebrow {
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(251, 146, 60, 0.18);
          color: #fdba74;
        }

        .orange-soft { color: #fdba74; }
        .orange-main { color: #fb923c; }

        .input-shell {
          background: rgba(28, 25, 23, 0.85);
          border: 1px solid rgba(251, 146, 60, 0.14);
          border-radius: 12px;
          color: #e8e1df;
          padding: 12px 16px;
          font-size: 0.875rem;
          width: 100%;
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
        }
        .input-shell:focus {
          border-color: rgba(249, 115, 22, 0.45);
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.14);
          background: rgba(28, 25, 23, 0.95);
        }
        .input-shell::placeholder { color: #57534e; }

        .interactive {
          transition:
            color 180ms cubic-bezier(0.16,1,0.3,1),
            background 180ms cubic-bezier(0.16,1,0.3,1),
            border-color 180ms cubic-bezier(0.16,1,0.3,1),
            box-shadow 180ms cubic-bezier(0.16,1,0.3,1),
            transform 180ms cubic-bezier(0.16,1,0.3,1);
        }
        .interactive:active { transform: scale(0.98); }

        /* progress bars */
        .progress-track { background: #221d1a; }
        .progress-fill {
          background: linear-gradient(90deg,
            #ea580c 0%,
            #f97316 50%,
            #fdba74 100%
          );
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
        }

        /* Avatar ring pulse */
        @keyframes ring-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.40), 0 0 0 4px rgba(249,115,22,0.12); }
          50%      { box-shadow: 0 0 0 6px rgba(249,115,22,0.16), 0 0 0 12px rgba(249,115,22,0.06); }
        }
        .avatar-ring { animation: ring-pulse 3s ease-in-out infinite; }

        /* tab active */
        .tab-active {
          color: #fdba74;
          border-bottom: 2px solid #f97316;
          text-shadow: 0 0 8px rgba(249, 115, 22, 0.35);
        }
        .tab-idle {
          color: #78716c;
          border-bottom: 2px solid transparent;
        }
        .tab-idle:hover { color: #d6d3d1; }

        /* card reveal */
        @keyframes fade-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        /* badge pro glow */
        @keyframes pro-glow {
          0%,100% { box-shadow: 0 0 8px rgba(251,191,36,0.4); }
          50%      { box-shadow: 0 0 20px rgba(251,191,36,0.7); }
        }
        .pro-badge { animation: pro-glow 2.2s ease-in-out infinite; }

        .section-glow {
          position: absolute;
          inset: auto -10% -20% auto;
          width: 260px; height: 260px;
          border-radius: 9999px;
          background: rgba(249,115,22,0.10);
          filter: blur(90px);
          pointer-events: none;
        }
      `}</style>

      <div className="relative min-h-screen orange-page-tint">
        <GridBackgroundDemo />

        {/* cursor glow */}
        <div
          className="cursor-glow"
          style={{ transform: `translate3d(${mousePos.x - 190}px,${mousePos.y - 190}px,0)` }}
        />

        <div className="relative z-20">
          <TopBar title="My Profile" />

          <main className="relative z-20 sidebar-aware pt-24 pb-20 px-4 md:px-8 min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* ── Hero card ─────────────────────────────────────────── */}
              <div className="soft-card rounded-[28px] p-6 md:p-10 relative overflow-hidden fade-up">
                <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-400/8 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  {/* avatar */}
                  <div
                    className={`relative flex-shrink-0 ${editing ? "cursor-pointer" : "cursor-default"}`}
                    onMouseEnter={() => {
                      if (editing) setAvatarHover(true);
                    }}
                    onMouseLeave={() => setAvatarHover(false)}
                    onClick={handleAvatarClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <div
                      className="w-28 h-28 rounded-full avatar-ring overflow-hidden flex items-center justify-center text-3xl font-bold text-white"
                      style={{
                        background: form.avatarUrl
                          ? undefined
                          : `linear-gradient(135deg, ${gradient})`,
                      }}
                    >
                      {form.avatarUrl ? (
                        <img
                          src={form.avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    {/* hover overlay */}
                    <div
                      className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        opacity: avatarHover && editing ? 1 : 0,
                      }}
                    >
                      <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                    </div>
                  </div>

                  {/* name / meta */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white tracking-tight">{displayName}</h1>
                      {user?.isPro && (
                        <span
                          className="pro-badge inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: "linear-gradient(90deg,rgba(251,191,36,0.15),rgba(245,158,11,0.20))",
                            border: "1px solid rgba(251,191,36,0.40)",
                            color: "#fbbf24",
                          }}
                        >
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            workspace_premium
                          </span>
                          Pro Member
                        </span>
                      )}
                    </div>

                    <p className="text-stone-400 text-sm mb-1">{user?.email}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-stone-400">
                      {form.university && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-orange-400 text-[16px]">school</span>
                          {form.university}
                        </span>
                      )}
                      {form.major && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-orange-400 text-[16px]">auto_stories</span>
                          {form.major}
                        </span>
                      )}
                      {form.graduationYear && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-orange-400 text-[16px]">event</span>
                          Class of {form.graduationYear}
                        </span>
                      )}
                      {form.location && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-orange-400 text-[16px]">location_on</span>
                          {form.location}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                      {!editing ? (
                        <button
                          id="profile-edit-btn"
                          className="interactive primary-blue px-6 py-2.5 rounded-xl text-sm font-semibold"
                          onClick={() => setEditing(true)}
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button
                            id="profile-save-btn"
                            className="interactive primary-blue px-6 py-2.5 rounded-xl text-sm font-bold"
                            onClick={handleSave}
                            disabled={saving}
                          >
                            {saving ? "Saving…" : "Save Changes"}
                          </button>
                          <button
                            id="profile-cancel-btn"
                            className="interactive orange-ghost px-5 py-2.5 text-sm font-bold"
                            onClick={() => setEditing(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        id="profile-logout-btn"
                        className="interactive orange-ghost px-5 py-2.5 text-sm font-bold flex items-center gap-1"
                        onClick={logout}
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Sign Out
                      </button>
                    </div>

                    {saveMsg && (
                      <p className={`mt-3 text-sm font-medium ${saveMsg.includes("✓") ? "text-emerald-400" : "text-rose-400"}`}>
                        {saveMsg}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── stat bar ──────────────────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up" style={{ animationDelay: "60ms" }}>
                {statsItems.map((s) => {
                  const StatIcon = PROFILE_STAT_ICONS[s.icon] || InterviewsCompletedIcon;
                  return (
                  <div key={s.label} className="deep-card rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden interactive hover:-translate-y-0.5">
                    <div className="section-glow" />
                    <CardIconShell className="p-2 w-fit">
                      <StatIcon />
                    </CardIconShell>
                    <div>
                      <p className="text-stone-500 text-xs font-medium">{s.label}</p>
                      <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* ── Tabs ──────────────────────────────────────────────── */}
              <div className="soft-card rounded-[24px] overflow-hidden fade-up" style={{ animationDelay: "120ms" }}>
                {/* tab bar */}
                <div className="flex border-b border-orange-400/10 px-6">
                  {(["overview", "stats", "settings"] as const).map((t) => (
                    <button
                      key={t}
                      id={`profile-tab-${t}`}
                      className={`py-4 px-4 text-sm font-bold capitalize transition-all duration-200 ${activeTab === t ? "tab-active" : "tab-idle"}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* ── Overview ── */}
                {activeTab === "overview" && (
                  <div className="p-6 md:p-8 space-y-8">
                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <SkillsCodeIcon />
                        Skills
                      </h3>
                      {skillsList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skillsList.map((sk, i) => {
                            const c = tagPalette[i % tagPalette.length];
                            return (
                              <span
                                key={sk}
                                className="text-xs font-bold px-3 py-1.5 rounded-full"
                                style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                              >
                                {sk}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-stone-500 text-sm">No skills listed yet.</p>
                      )}
                    </div>

                    {/* Interests */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <InterestsSparkIcon />
                        Interests
                      </h3>
                      {interestsList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {interestsList.map((it, i) => {
                            const c = tagPalette[(i + 2) % tagPalette.length];
                            return (
                              <span
                                key={it}
                                className="text-xs font-bold px-3 py-1.5 rounded-full"
                                style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                              >
                                {it}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-stone-500 text-sm">No interests listed yet.</p>
                      )}
                    </div>

                    {/* Account info */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ProfileInfoIcon />
                        Account Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Auth Provider", value: user?.authProvider || "email", icon: "key" },
                          { label: "Email Verified", value: user?.emailVerified ? "Yes ✓" : "Pending", icon: "verified" },
                          { label: "Membership", value: user?.isPro ? "Pro ⭐" : "Free", icon: "workspace_premium" },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center gap-3 p-4 rounded-2xl"
                            style={{ background: "rgba(28,25,23,0.6)", border: "1px solid rgba(251,146,60,0.08)" }}
                          >
                            <span className="material-symbols-outlined text-orange-400 text-[20px]">{row.icon}</span>
                            <div>
                              <p className="text-xs text-stone-500 font-medium">{row.label}</p>
                              <p className="text-sm text-white font-bold capitalize">{row.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Stats ── */}
                {activeTab === "stats" && (
                  <div className="p-6 md:p-8 space-y-8">
                    <h3 className="text-lg font-bold text-white">Performance Overview</h3>

                    {/* progress bars */}
                    {[
                      { label: "Technical Communication", pct: Math.min(100, Math.max(10, (user as any)?.resumeScore ?? 68)) },
                      { label: "Interview Readiness", pct: Math.min(100, Math.max(10, (user as any)?.avgInterviewScore ?? 74)) },
                      { label: "Streak Consistency", pct: Math.min(100, Math.max(0, ((user as any)?.streak ?? 3) * 10)) },
                    ].map(({ label, pct }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-stone-400">{label}</span>
                          <span className="text-sm font-bold text-orange-300">{pct}%</span>
                        </div>
                        <MovingWavyProgress pct={pct} color="#fb923c" className="w-full mt-1" />
                      </div>
                    ))}

                    {/* quick links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <Link
                        href="/MockInterview"
                        className="interactive primary-blue px-5 py-3 rounded-xl text-sm font-bold text-center"
                      >
                        Start Mock Interview
                      </Link>
                      <Link
                        href="/Progress"
                        className="interactive orange-ghost px-5 py-3 rounded-xl text-sm font-bold text-center"
                      >
                        View Full Progress
                      </Link>
                    </div>
                  </div>
                )}

                {/* ── Settings ── */}
                {activeTab === "settings" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white mb-2">Edit Profile Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Full Name</label>
                        <input
                          id="profile-field-name"
                          className="input-shell"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">University</label>
                        <input
                          id="profile-field-university"
                          className="input-shell"
                          value={form.university}
                          onChange={(e) => setForm({ ...form, university: e.target.value })}
                          placeholder="Your university"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Major</label>
                        <input
                          id="profile-field-major"
                          className="input-shell"
                          value={form.major}
                          onChange={(e) => setForm({ ...form, major: e.target.value })}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Graduation Year</label>
                        <input
                          id="profile-field-grad-year"
                          className="input-shell"
                          value={form.graduationYear}
                          onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                          placeholder="e.g. 2026"
                          type="number"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Location</label>
                        <input
                          id="profile-field-location"
                          className="input-shell"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Avatar URL</label>
                        <input
                          id="profile-field-avatar"
                          className="input-shell"
                          value={form.avatarUrl}
                          onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                          placeholder="https://…"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Skills <span className="normal-case text-stone-600">(comma-separated)</span></label>
                        <input
                          id="profile-field-skills"
                          className="input-shell"
                          value={form.skills}
                          onChange={(e) => setForm({ ...form, skills: e.target.value })}
                          placeholder="Python, React, Machine Learning, …"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Interests <span className="normal-case text-stone-600">(comma-separated)</span></label>
                        <input
                          id="profile-field-interests"
                          className="input-shell"
                          value={form.interests}
                          onChange={(e) => setForm({ ...form, interests: e.target.value })}
                          placeholder="AI, Startups, Open Source, …"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        id="profile-settings-save-btn"
                        className="interactive primary-blue px-7 py-3 rounded-xl text-sm font-semibold"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving…" : "Save Profile"}
                      </button>
                      {saveMsg && (
                        <p className={`self-center text-sm font-medium ${saveMsg.includes("✓") ? "text-emerald-400" : "text-rose-400"}`}>
                          {saveMsg}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Upgrade CTA (only for free users) ─────────────────── */}
              {!user?.isPro && (
                <div
                  className="soft-card rounded-[24px] p-8 relative overflow-hidden fade-up"
                  style={{ animationDelay: "180ms" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/12 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full eyebrow text-xs font-bold mb-3">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        Upgrade to Pro
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Unlock Your Full Potential</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">
                        Get unlimited mock interviews, AI-powered feedback reports, resume insights, and priority support.
                      </p>
                    </div>
                    <Link
                      href="/upgrade"
                      className="interactive primary-blue px-8 py-3 rounded-xl text-sm font-semibold whitespace-nowrap"
                    >
                      Go Pro →
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
