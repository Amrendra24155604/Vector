"use client";

import Link from "next/link";
import { useAuth, getAvatarProps } from "@/lib/auth";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const RESOURCES = [
  { label: "Dashboard", href: "/Dashboard", icon: "dashboard", desc: "Overview & activity" },
  { label: "Internship Match", href: "/InternshipMatch", icon: "work_history", desc: "Find matching internships" },
  { label: "Resume Analyzer", href: "/ResumeAnalyzer", icon: "description", desc: "Analyze & improve resume" },
  { label: "Cold Email Generator", href: "/ColdEmail", icon: "mail", desc: "Generate outreach emails" },
  { label: "AI Mock Interview", href: "/MockInterview", icon: "record_voice_over", desc: "Practice with AI coach" },
  { label: "Background Generator", href: "/Background", icon: "wallpaper", desc: "Create profile backgrounds" },
  { label: "Progress Tracker", href: "/Progress", icon: "trending_up", desc: "Track your progress" },
  { label: "Notifications", href: "/Notifications", icon: "notifications", desc: "View notifications" },
  { label: "Settings", href: "/Settings", icon: "settings", desc: "App preferences" },
  { label: "Profile", href: "/Profile", icon: "person", desc: "View & edit profile" },
  { label: "Upgrade", href: "/Upgrade", icon: "workspace_premium", desc: "Unlock premium features" },
];

function ResourceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? RESOURCES.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.desc.toLowerCase().includes(query.toLowerCase())
      )
    : RESOURCES;

  const navigate = useCallback(
    (href: string) => {
      setQuery("");
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[highlighted]) navigate(filtered[highlighted].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="hidden md:block relative">
      {/* Input pill */}
      <div
        className="flex items-center rounded-full px-4 py-2 transition-all duration-200"
        style={{
          background: "rgba(28, 25, 23, 0.82)",
          border: open
            ? "1px solid rgba(251, 146, 60, 0.45)"
            : "1px solid rgba(251, 146, 60, 0.10)",
          boxShadow: open ? "0 0 16px rgba(251,146,60,0.08)" : "none",
        }}
      >
        <span className="material-symbols-outlined text-stone-500 text-sm">search</span>
        <input
          ref={inputRef}
          className="bg-transparent border-none text-sm text-stone-200 placeholder:text-stone-500 w-48 outline-none ml-2"
          placeholder="Search resources..."
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="ml-1 text-stone-500 hover:text-stone-300 transition-colors"
            style={{ fontSize: 14, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-2xl overflow-hidden topbar-dropdown"
          style={{
            width: 280,
            background: "rgba(18, 15, 14, 0.99)",
            border: "1px solid rgba(251, 146, 60, 0.15)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,146,60,0.05)",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(251,146,60,0.08)" }}>
            <span className="text-xs text-stone-500 font-medium tracking-wider uppercase">
              {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : "All Resources"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <span className="material-symbols-outlined text-stone-600" style={{ fontSize: 32 }}>search_off</span>
              <p className="text-stone-500 text-sm mt-2">No resources found</p>
            </div>
          ) : (
            <ul className="py-1 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {filtered.map((r, i) => (
                <li key={r.href}>
                  <button
                    className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-150"
                    style={{
                      background:
                        i === highlighted
                          ? "rgba(251, 146, 60, 0.10)"
                          : "transparent",
                      borderLeft:
                        i === highlighted
                          ? "2px solid rgba(251,146,60,0.6)"
                          : "2px solid transparent",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => navigate(r.href)}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-lg"
                      style={{
                        width: 32,
                        height: 32,
                        background:
                          i === highlighted
                            ? "rgba(251,146,60,0.18)"
                            : "rgba(255,255,255,0.04)",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: i === highlighted ? "rgba(251,146,60,0.9)" : "#78716c",
                          transition: "color 0.15s",
                        }}
                      >
                        {r.icon}
                      </span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: i === highlighted ? "#fafaf9" : "#d6d3d1" }}
                      >
                        {r.label}
                      </p>
                      <p className="text-xs text-stone-500">{r.desc}</p>
                    </div>
                    {i === highlighted && (
                      <span
                        className="material-symbols-outlined ml-auto text-stone-500"
                        style={{ fontSize: 14 }}
                      >
                        arrow_forward
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          <div
            className="px-4 py-2 border-t flex items-center gap-3"
            style={{ borderColor: "rgba(251,146,60,0.08)" }}
          >
            <span className="text-xs text-stone-600 flex items-center gap-1">
              <kbd style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, padding: "1px 5px", fontSize: 10, color: "#78716c" }}>↑↓</kbd>
              navigate
            </span>
            <span className="text-xs text-stone-600 flex items-center gap-1">
              <kbd style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, padding: "1px 5px", fontSize: 10, color: "#78716c" }}>↵</kbd>
              open
            </span>
            <span className="text-xs text-stone-600 flex items-center gap-1">
              <kbd style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, padding: "1px 5px", fontSize: 10, color: "#78716c" }}>esc</kbd>
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopBar({ title, ctaLabel = "Start Interview", ctaHref = "/MockInterview" }: TopBarProps) {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatarUrl]);

  const displayName = user?.name || "User";
  const { char, bgColor } = getAvatarProps(user?.name);

  return (
    <header
      className="fixed top-0 right-0 z-40 sidebar-aware-top topbar-shell"
      style={{
        background: "rgba(12, 10, 9, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(251, 146, 60, 0.10)",
      }}
    >
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-xl font-headline-lg text-white lg:hidden">
            Vector
          </span>
          {title && (
            <span className="hidden lg:block font-body-md text-body-md text-on-surface-variant">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ResourceSearch />

          <Link
            href="/Notifications"
            className="material-symbols-outlined text-stone-400 p-2 hover:bg-[#1a1716] rounded-lg transition-all"
            title="Notifications"
          >
            notifications
          </Link>

          <Link
            href="/Settings"
            className="material-symbols-outlined text-stone-400 p-2 hover:bg-[#1a1716] rounded-lg transition-all"
            title="Settings"
          >
            settings
          </Link>

          <Link
            href="/Profile"
            className="h-8 w-8 rounded-full overflow-hidden border border-orange-400/20 transition-all duration-200 hover:border-orange-400/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.35)] flex items-center justify-center"
            title="View Profile"
          >
            {user?.avatarUrl && !imgError ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ backgroundColor: bgColor }}
              >
                <span>{char}</span>
              </div>
            )}
          </Link>

          <Link
            href={ctaHref}
            className="interactive primary-blue hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-label-md text-label-md text-white"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
