"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

interface TopBarProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function TopBar({ title, ctaLabel = "Start Interview", ctaHref = "/MockInterview" }: TopBarProps) {
  const { user } = useAuth();

  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hue = (displayName.charCodeAt(0) * 47 + displayName.charCodeAt(displayName.length - 1) * 13) % 360;
  const gradient = `linear-gradient(135deg, hsl(${hue},65%,52%), hsl(${(hue + 40) % 360},70%,40%))`;

  return (
    <header
      className="fixed top-0 right-0 z-40 sidebar-aware-top"
      style={{
        background: "rgba(12, 10, 9, 0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(251, 146, 60, 0.10)",
      }}
    >
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-xl font-headline-lg text-white lg:hidden">
            KareerPilot
          </span>
          {title && (
            <span className="hidden lg:block font-body-md text-body-md text-on-surface-variant">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div
            className="hidden md:flex items-center rounded-full px-4 py-2"
            style={{
              background: "rgba(28, 25, 23, 0.82)",
              border: "1px solid rgba(251, 146, 60, 0.10)",
            }}
          >
            <span className="material-symbols-outlined text-stone-500 text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none text-sm text-stone-200 placeholder:text-stone-500 w-48 outline-none ml-2"
              placeholder="Search resources..."
              type="text"
            />
          </div>

          <button className="material-symbols-outlined text-stone-400 p-2 hover:bg-[#1a1716] rounded-lg transition-all">
            notifications
          </button>

          <button className="material-symbols-outlined text-stone-400 p-2 hover:bg-[#1a1716] rounded-lg transition-all">
            settings
          </button>

          <Link
            href="/Profile"
            className="h-8 w-8 rounded-full overflow-hidden border border-orange-400/20 transition-all duration-200 hover:border-orange-400/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.35)] flex items-center justify-center"
            title="View Profile"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: gradient }}
              >
                <span>{initials}</span>
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
