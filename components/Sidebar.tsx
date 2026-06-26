"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useId } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useAuth, getAvatarProps } from "@/lib/auth";

const COLLAPSED = 68;
const EXPANDED = 260;

// Silky spring for width expansion
const SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const;
// Smoother spring for label slides
const LABEL_SPRING = { type: "spring", stiffness: 400, damping: 35, mass: 0.6 } as const;
// Mobile drawer spring
const DRAWER_SPRING = { type: "spring", stiffness: 280, damping: 28, mass: 0.9 } as const;

// ── CUSTOM HIGH-FIDELITY ANIMATED LOGOS ──

// Brand / AI Brain Logo
export const AIBrainIcon = ({ size = 22, className = "", animate = true }: { size?: number; className?: string; animate?: boolean }) => {
  const uniqueId = useId().replace(/:/g, "");
  const leftGradId = `left-grad-${uniqueId}`;
  const rightGradId = `right-grad-${uniqueId}`;
  const fullGradId = `full-grad-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;
  const tipglowId = `tipglow-${uniqueId}`;
  const arrowglowId = `arrowglow-${uniqueId}`;

  return (
    <svg width={size} height={(size * 250) / 410} viewBox="130 75 410 250" xmlns="http://www.w3.org/2000/svg" className={`flex-shrink-0 relative z-10 ${className}`}>
      <defs>
        <linearGradient id={leftGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={rightGradId} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" stopOpacity="1" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={fullGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
          <stop offset="100%" stopColor="#fdba74" stopOpacity="1" />
        </linearGradient>

        <filter id={glowId}>
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={tipglowId}>
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={arrowglowId}>
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Left leg of V */}
      <line x1="168" y1="110" x2="340" y2="295" stroke={`url(#${leftGradId})`} strokeWidth="30" strokeLinecap="round" opacity="0.10" />
      <line x1="168" y1="110" x2="340" y2="295" stroke={`url(#${leftGradId})`} strokeWidth="15" strokeLinecap="round" opacity="0.22" />
      <line x1="168" y1="110" x2="340" y2="295" stroke={`url(#${leftGradId})`} strokeWidth="10" strokeLinecap="round" />

      {/* Right leg of V */}
      <line x1="512" y1="110" x2="340" y2="295" stroke={`url(#${rightGradId})`} strokeWidth="30" strokeLinecap="round" opacity="0.10" />
      <line x1="512" y1="110" x2="340" y2="295" stroke={`url(#${rightGradId})`} strokeWidth="15" strokeLinecap="round" opacity="0.22" />
      <line x1="512" y1="110" x2="340" y2="295" stroke={`url(#${rightGradId})`} strokeWidth="10" strokeLinecap="round" />

      {/* Glowing double/dashed lines */}
      <polyline points="168,110 340,295 512,110" fill="none" stroke={`url(#${fullGradId})`} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.08" />
      <polyline points="168,110 340,295 512,110" fill="none" stroke={`url(#${fullGradId})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
      <polyline points="168,110 340,295 512,110" fill="none" stroke={`url(#${fullGradId})`} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Arrowhead detail on top right - scaled up for mobile legibility */}
      <g filter={`url(#${arrowglowId})`}>
        <polygon points="512,110 487,175 451,141" fill="#fdba74" opacity="0.25" />
        <polygon points="512,110 487,175 451,141" fill="#fdba74" />
        <polygon points="512,110 481,166 456,146" fill="#fff" opacity="0.3" />
        <circle cx="512" cy="110" r="7" fill="#fff" opacity="0.9" />
      </g>

      {/* Core matching node details */}
      <circle cx="340" cy="295" r="14" fill="none" stroke="#f97316" strokeWidth="1.8" opacity="0.42" />
      <circle cx="340" cy="295" r="14" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.03" />

      {/* Center tip pulse */}
      <g filter={`url(#${tipglowId})`}>
        <circle cx="340" cy="295" r="14" fill="#f97316" opacity="0.45" />
        <circle cx="340" cy="295" r="9" fill="#f97316" />
        <circle cx="340" cy="295" r="4" fill="#fdba74" />
      </g>
    </svg>
  );
};

// Home / Dashboard Icon
const DashboardIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .gauge-needle-path {
        transform-origin: 12px 18px;
        animation: gauge-needle 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .animate .radar-sweep-arc {
        transform-origin: 12px 18px;
        animation: radar-sweep 2.5s linear infinite;
      }
      @keyframes gauge-needle {
        0%, 100% { transform: rotate(-10deg); }
        35% { transform: rotate(55deg); }
        70% { transform: rotate(20deg); }
      }
      @keyframes radar-sweep {
        0% { transform: rotate(0deg); opacity: 0; }
        10% { opacity: 0.4; }
        90% { opacity: 0.4; }
        100% { transform: rotate(180deg); opacity: 0; }
      }
    `}</style>
    {/* Outer Dial Gauge */}
    <path d="M4 18A8 8 0 0 1 20 18" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.8" strokeLinecap="round" />
    {/* Background dashboard ticks */}
    <path d="M7 13L8 14 M12 6V8 M17 13L16 14" stroke={active ? "rgba(253,186,116,0.4)" : "rgba(120,113,108,0.4)"} strokeWidth="1.5" strokeLinecap="round" />

    {/* Sweeping Radar Arc */}
    <path d="M12 18 L19 14 A 8 8 0 0 0 12 10 Z" fill={active ? "rgba(251,146,60,0.12)" : "rgba(120,113,108,0.06)"} className="radar-sweep-arc" />

    {/* Core node */}
    <circle cx="12" cy="18" r="2.8" fill={active ? "#f97316" : "#a8a29e"} />
    {/* Dial needle */}
    <line x1="12" y1="18" x2="12" y2="9" stroke={active ? "#ffedd5" : "#f97316"} strokeWidth="2.2" strokeLinecap="round" className="gauge-needle-path" />
  </svg>
);

// Mock Interviews Icon
const MockInterviewIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .bounce-bar-1 { animation: bounce-b1 0.9s ease-in-out infinite; transform-origin: 4px 12px; }
      .animate .bounce-bar-2 { animation: bounce-b2 1.1s ease-in-out infinite 0.05s; transform-origin: 8px 12px; }
      .animate .bounce-bar-3 { animation: bounce-b3 0.75s ease-in-out infinite 0.15s; transform-origin: 12px 12px; }
      .animate .bounce-bar-4 { animation: bounce-b2 1.05s ease-in-out infinite 0.1s; transform-origin: 16px 12px; }
      .animate .bounce-bar-5 { animation: bounce-b1 1.2s ease-in-out infinite 0.2s; transform-origin: 20px 12px; }
      .animate .mic-ring-glow { animation: ring-glow 2s ease-in-out infinite; }
      @keyframes bounce-b1 { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(0.9); } }
      @keyframes bounce-b2 { 0%, 100% { transform: scaleY(0.8); } 50% { transform: scaleY(0.25); } }
      @keyframes bounce-b3 { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(1.15); } }
      @keyframes ring-glow {
        0%, 100% { stroke-width: 1; opacity: 0.15; }
        50% { stroke-width: 1.8; opacity: 0.35; }
      }
    `}</style>
    {/* Micro-equalizer bars */}
    <rect x="3.1" y="4" width="1.8" height="16" rx="0.9" fill={active ? "#fdba74" : "#a8a29e"} className="bounce-bar-1" />
    <rect x="7.1" y="4" width="1.8" height="16" rx="0.9" fill={active ? "#fb923c" : "#78716c"} className="bounce-bar-2" />
    <rect x="11.1" y="4" width="1.8" height="16" rx="0.9" fill={active ? "#f97316" : "#a8a29e"} className="bounce-bar-3" />
    <rect x="15.1" y="4" width="1.8" height="16" rx="0.9" fill={active ? "#fb923c" : "#78716c"} className="bounce-bar-4" />
    <rect x="19.1" y="4" width="1.8" height="16" rx="0.9" fill={active ? "#fdba74" : "#a8a29e"} className="bounce-bar-5" />
    {/* Overlaying voice boundary loops */}
    <circle cx="12" cy="12" r="9" stroke={active ? "#fb923c" : "#f97316"} strokeWidth="1" className="mic-ring-glow" />
  </svg>
);

// Resume Analyzer Icon
const ResumeAnalyzerIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .resume-laser-beam {
        animation: resume-laser 2.8s ease-in-out infinite;
      }
      .animate .resume-text-lines {
        animation: doc-lines-pulse 1.8s ease-in-out infinite;
      }
      @keyframes resume-laser {
        0%, 100% { transform: translateY(0px); opacity: 0; }
        15%, 85% { opacity: 1; }
        90% { transform: translateY(13px); opacity: 0; }
      }
      @keyframes doc-lines-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `}</style>
    {/* Page outline with top-right fold */}
    <path d="M4 3.5 C4 2.7 4.7 2 5.5 2 H14.5 L19.5 7 V20.5 C19.5 21.3 18.8 22 18 22 H5.5 C4.7 22 4 21.3 4 20.5 V3.5 Z" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.8" fill="none" />
    {/* Top Right fold crease */}
    <path d="M14 2 V7 H19.5" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.5" />
    {/* Page content blocks */}
    <g className="resume-text-lines">
      <line x1="7" y1="9.5" x2="16.5" y2="9.5" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="13.5" x2="16.5" y2="13.5" stroke={active ? "#f97316" : "#78716c"} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="17.5" x2="12.5" y2="17.5" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.8" strokeLinecap="round" />
    </g>
    {/* Laser scan line with green accent */}
    <line x1="3" y1="7" x2="20.5" y2="7" stroke={active ? "#fb923c" : "#f97316"} strokeWidth="1.8" className="resume-laser-beam" style={{ filter: "drop-shadow(0 0 3px #ea580c)" }} />
  </svg>
);

// Internship Match Icon
const InternshipMatchIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .gear-left-spin {
        transform-origin: 9px 13px;
        animation: gear-left 7s linear infinite;
      }
      .animate .gear-right-spin {
        transform-origin: 15.5px 8.5px;
        animation: gear-right 7s linear infinite;
      }
      .animate .matching-link-path {
        stroke-dasharray: 4 2;
        animation: link-pulse 1.8s linear infinite;
      }
      @keyframes gear-left {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes gear-right {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
      @keyframes link-pulse {
        0%, 100% { stroke-dashoffset: 0; }
        50% { stroke-dashoffset: 8; }
      }
    `}</style>
    {/* Left gear (larger) */}
    <g className="gear-left-spin">
      <circle cx="9" cy="13" r="5" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.5" />
      {/* Gear teeth */}
      <path d="M9 7V9 M9 17V19 M3 13H5 M13 13H15 M4.8 8.8L6.2 10.2 M11.8 15.8L13.2 17.2 M13.2 8.8L11.8 10.2 M4.8 15.8L6.2 17.2" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.5" strokeLinecap="round" />
    </g>
    {/* Right gear (smaller) */}
    <g className="gear-right-spin">
      <circle cx="15.5" cy="8.5" r="3.5" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.2" />
      {/* Gear teeth */}
      <path d="M15.5 4.5V5.5 M15.5 11.5V12.5 M11.5 8.5H12.5 M18.5 8.5H19.5 M12.7 5.7L13.4 6.4 M17.6 10.6L18.3 11.3 M18.3 5.7L17.6 6.4 M12.7 10.6L13.4 11.3" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.2" strokeLinecap="round" />
    </g>
    {/* Intersect matching links */}
    <line x1="9" y1="13" x2="15.5" y2="8.5" stroke={active ? "#f97316" : "#fb923c"} strokeWidth="1.5" className="matching-link-path" />
  </svg>
);

// Cold Email Icon
const ColdEmailIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .plane-glide-path {
        animation: plane-glide 3s ease-in-out infinite;
      }
      .animate .envelope-pulse-line {
        animation: envelope-pulse 2s ease-in-out infinite;
      }
      @keyframes plane-glide {
        0% { transform: translate(-2px, 2px); }
        50% { transform: translate(3px, -3px); }
        100% { transform: translate(-2px, 2px); }
      }
      @keyframes envelope-pulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.7; }
      }
    `}</style>
    {/* Background Envelope outline */}
    <rect x="2" y="6" width="16" height="12" rx="2" stroke={active ? "rgba(253,186,116,0.35)" : "rgba(120,113,108,0.3)"} strokeWidth="1.5" className="envelope-pulse-line" fill="none" />
    <path d="M2 7L10 12.5L18 7" stroke={active ? "rgba(249,115,22,0.3)" : "rgba(168,162,158,0.3)"} strokeWidth="1.2" className="envelope-pulse-line" />

    {/* Gliding Paper Airplane representing Outreach */}
    <g className="plane-glide-path">
      <path d="M9 19L21 9L15 21L13 14L9 19Z" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M21 9L13 14" stroke={active ? "#fb923c" : "#f97316"} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

// Progress Icon
const ProgressIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .growth-trajectory-line {
        stroke-dasharray: 28;
        animation: growth-sweep 3s ease-out infinite;
      }
      .animate .growth-beacon-dot {
        transform-origin: 20px 4px;
        animation: growth-beacon 1.4s ease-in-out infinite;
      }
      .animate .growth-bar-1 { animation: grid-bar-fill 2s ease-in-out infinite; transform-origin: 6px 20px; }
      .animate .growth-bar-2 { animation: grid-bar-fill 2.2s ease-in-out infinite 0.3s; transform-origin: 10px 20px; }
      .animate .growth-bar-3 { animation: grid-bar-fill 1.8s ease-in-out infinite 0.6s; transform-origin: 14px 20px; }
      @keyframes growth-sweep {
        0% { stroke-dashoffset: 28; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes growth-beacon {
        0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 1px #fb923c); }
        50% { transform: scale(1.3); filter: brightness(1.35) drop-shadow(0 0 5px #fb923c); }
      }
      @keyframes grid-bar-fill {
        0%, 100% { transform: scaleY(0.7); }
        50% { transform: scaleY(1.05); }
      }
    `}</style>
    {/* Grid System Background */}
    <line x1="4" y1="20" x2="21" y2="20" stroke={active ? "rgba(253,186,116,0.3)" : "rgba(120,113,108,0.3)"} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4" y1="4" x2="4" y2="20" stroke={active ? "rgba(253,186,116,0.3)" : "rgba(120,113,108,0.3)"} strokeWidth="1.8" strokeLinecap="round" />

    {/* Dynamic Background histogram bars */}
    <rect x="5.5" y="13" width="1.5" height="7" rx="0.5" fill={active ? "rgba(253,186,116,0.15)" : "rgba(120,113,108,0.15)"} className="growth-bar-1" />
    <rect x="9.5" y="10" width="1.5" height="10" rx="0.5" fill={active ? "rgba(251,146,60,0.15)" : "rgba(168,162,158,0.15)"} className="growth-bar-2" />
    <rect x="13.5" y="7" width="1.5" height="13" rx="0.5" fill={active ? "rgba(249,115,22,0.15)" : "rgba(120,113,108,0.15)"} className="growth-bar-3" />

    {/* Growth Curve */}
    <path d="M4 17C9 17 12 10 20 4" stroke={active ? "#fdba74" : "#a8a29e"} strokeWidth="2.2" strokeLinecap="round" className="growth-trajectory-line" />
    {/* Glowing climax point */}
    <circle cx="20" cy="4" r="2.5" fill={active ? "#fb923c" : "#f97316"} className="growth-beacon-dot" />
  </svg>
);

// Profile Icon
const ProfileIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      @keyframes user-glow {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      .animate .user-head-path {
        animation: user-glow 2s ease-in-out infinite;
      }
    `}</style>
    {/* Body shoulders */}
    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.8" strokeLinecap="round" />
    {/* Head circle */}
    <circle cx="12" cy="7.5" r="4" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.8" className="user-head-path" />
  </svg>
);

// Bottom: Help Icon
const HelpIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .help-bounce-element {
        animation: help-bounce 2s ease-in-out infinite;
      }
      @keyframes help-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }
    `}</style>
    <circle cx="12" cy="12" r="8.5" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.8" className="help-bounce-element" />
    <path d="M9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.2 13.5 10.8 12.8 11.2C12.3 11.5 12 12 12 12.5" stroke={active ? "#fb923c" : "#a8a29e"} strokeWidth="1.5" strokeLinecap="round" className="help-bounce-element" />
    <circle cx="12" cy="16" r="1.2" fill={active ? "#f97316" : "#78716c"} className="help-bounce-element" />
  </svg>
);

// Bottom: Logout Icon
const LogoutIcon = ({ active, animate }: { active: boolean; animate: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 relative z-10 ${animate ? "animate" : ""}`}>
    <style>{`
      .animate .logout-arrow {
        animation: logout-slide 1.5s ease-in-out infinite;
      }
      @keyframes logout-slide {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(2px); }
      }
    `}</style>
    <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke={active ? "#fdba74" : "#78716c"} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 17L21 12L16 7" stroke={active ? "#fb923c" : "#f97316"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="logout-arrow" />
    <line x1="21" y1="12" x2="9" y2="12" stroke={active ? "#fb923c" : "#f97316"} strokeWidth="1.8" strokeLinecap="round" className="logout-arrow" />
  </svg>
);

function SidebarIcon({ icon, active, animate }: { icon: string; active: boolean; animate: boolean }) {
  switch (icon) {
    case "dashboard":
      return <DashboardIcon active={active} animate={animate} />;
    case "record_voice_over":
      return <MockInterviewIcon active={active} animate={animate} />;
    case "description":
      return <ResumeAnalyzerIcon active={active} animate={animate} />;
    case "work_history":
      return <InternshipMatchIcon active={active} animate={animate} />;
    case "mail":
      return <ColdEmailIcon active={active} animate={animate} />;
    case "insights":
      return <ProgressIcon active={active} animate={animate} />;
    case "profile":
      return <ProfileIcon active={active} animate={animate} />;
    case "help":
      return <HelpIcon active={active} animate={animate} />;
    case "logout":
      return <LogoutIcon active={active} animate={animate} />;
    default:
      return null;
  }
}

// ── END LOGO COMPONENTS ──

const NAV_ITEMS = [
  { href: "/Dashboard", icon: "dashboard", label: "Home" },
  { href: "/MockInterview", icon: "record_voice_over", label: "Mock Interviews" },
  { href: "/ResumeAnalyzer", icon: "description", label: "Resume Analyzer" },
  { href: "/InternshipMatch", icon: "work_history", label: "Internship Match" },
  { href: "/ColdEmail", icon: "mail", label: "Cold Email" },
  { href: "/Progress", icon: "insights", label: "Progress" },
];

const BOTTOM_ITEMS = [
  { href: "/Progress", icon: "help", label: "Help" },
  { href: "/auth/login", icon: "logout", label: "Logout" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/Dashboard", icon: "dashboard", label: "HOME" },
  { href: "/MockInterview", icon: "record_voice_over", label: "INTERVIEW" },
  { href: "/Progress", icon: "insights", label: "PROGRESS" },
  { href: "/Profile", icon: "profile", label: "PROFILE" },
];

const SHOW_NAV_PATHS = new Set([
  "/Dashboard",
  "/MockInterview",
  "/ResumeAnalyzer",
  "/ColdEmail",
  "/Progress",
  "/Profile",
  "/Notifications",
  "/Settings",
  "/Upgrade"
]);

function setSidebarVar(w: number) {
  document.documentElement.style.setProperty("--sidebar-w", `${w}px`);
}

const activeStyle = {
  background: "rgba(249,115,22,0.12)",
  color: "#fdba74",
  border: "1px solid rgba(249,115,22,0.25)",
  boxShadow: "0 0 15px rgba(249,115,22,0.1)",
};

const HIDDEN_PATHS = new Set(["/", "/LandingPage"]);

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const [sidebarImgError, setSidebarImgError] = useState(false);

  useEffect(() => {
    setSidebarImgError(false);
  }, [user?.avatarUrl]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredBottomIdx, setHoveredBottomIdx] = useState<number | null>(null);

  useEffect(() => {
    if (mobileOpen) {
      const preventDefault = (e: Event) => {
        const drawer = document.getElementById("mobile-drawer-container");
        if (drawer && drawer.contains(e.target as Node)) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        const drawer = document.getElementById("mobile-drawer-container");
        if (drawer && drawer.contains(e.target as Node)) {
          return;
        }
        const keys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "End", "Home"];
        if (keys.includes(e.key)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      };

      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");

      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
      window.addEventListener("keydown", preventScrollKeys, { passive: false });

      return () => {
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
        window.removeEventListener("keydown", preventScrollKeys);
      };
    }
  }, [mobileOpen]);

  const rootSegment = pathname.split("/")[1] || "";
  const VALID_ROOT_SEGMENTS = new Set([
    "",
    "Dashboard",
    "MockInterview",
    "ResumeAnalyzer",
    "InternshipMatch",
    "ColdEmail",
    "Progress",
    "Profile",
    "Notifications",
    "Settings",
    "Upgrade",
    "LandingPage",
    "auth",
    "Background"
  ]);

  if (!VALID_ROOT_SEGMENTS.has(rootSegment)) return null;

  // Don't render on landing / home / auth pages
  if (HIDDEN_PATHS.has(pathname) || pathname.startsWith("/auth/")) return null;

  const handleEnter = () => { setOpen(true); setSidebarVar(EXPANDED); };
  const handleLeave = () => { setOpen(false); setSidebarVar(COLLAPSED); };

  // Slightly larger sizing for sidebar buttons: gap-3.5, py-3, px-4
  const linkBase =
    "flex items-center rounded-xl overflow-hidden relative group transition-all duration-200";

  // Check if current page is one of the allowed mobile bottom nav pages
  const shouldShowBottomNav = Array.from(SHOW_NAV_PATHS).some(path => pathname === path || pathname.startsWith(path + "/"));

  return (
    <>
      {/* Dynamic white light glow and scale animations on logo + text hover */}
      <style>{`
        .sidebar-icon-wrapper {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .sidebar-icon-wrapper {
          transform: scale(1.22) !important;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.4)) !important;
        }
        .brand-icon-wrapper {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brand-icon-wrapper:hover {
          transform: scale(1.18) !important;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.85)) !important;
        }
        .sidebar-text-label {
          display: inline-block;
          transform-origin: left center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
        }
        .group:hover .sidebar-text-label {
          transform: scale(1.06) !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* ── Desktop sliding sidebar ── */}
      <motion.nav
        className="fixed left-0 top-0 h-screen z-50 hidden lg:flex flex-col overflow-hidden"
        animate={{ width: open ? EXPANDED : COLLAPSED }}
        transition={SPRING}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          background: "rgba(18,15,14,0.96)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(251,146,60,0.10)",
          willChange: "width",
        }}
      >
        {/* Brand */}
        <div className="flex items-center h-16 px-[14px] gap-3 flex-shrink-0 overflow-hidden">
          <Link href="/LandingPage" className="flex items-center gap-3">
            <motion.div
              className="brand-icon-wrapper w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_15px_rgba(249,115,22,0.18),inset_0_0_12px_rgba(249,115,22,0.1)] select-none"
              whileHover={{ scale: 1.06, borderColor: "rgba(249,115,22,0.5)", boxShadow: "0 0 20px rgba(249,115,22,0.35), inset 0 0 10px rgba(249,115,22,0.2)" }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {/* Unique high-tech corner viewfinder brackets for logo brand identity */}
              <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
              <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
              <AIBrainIcon size={34} animate={open} />
            </motion.div>

            <motion.div
              className="overflow-hidden whitespace-nowrap"
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -8 }}
              transition={LABEL_SPRING}
            >
              <p className="text-[15px] font-semibold text-white font-sans leading-tight">
                Vector
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-sans">
                AI Career Coach
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-0.5 flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(({ href, icon, label }, i) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const getScaleAndX = (index: number) => {
              if (hoveredIdx === null) return { scale: 1, x: 0 };
              const dist = Math.abs(hoveredIdx - index);
              if (open) {
                if (dist === 0) return { scale: 1.03, x: 2 };
                if (dist === 1) return { scale: 1.015, x: 1 };
                return { scale: 1, x: 0 };
              } else {
                if (dist === 0) return { scale: 1.06, x: 3 };
                if (dist === 1) return { scale: 1.03, x: 1.5 };
                return { scale: 1, x: 0 };
              }
            };
            return (
              <motion.div
                key={href}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                animate={getScaleAndX(i)}
                transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
                style={{ originX: 0 }}
              >
                <Link
                  href={href}
                  className={`${linkBase} ${open ? "justify-start gap-3.5 py-3 px-4" : "justify-center gap-0 py-3 px-0"
                    } ${active ? "" : "text-stone-400 hover:text-white"
                    }`}
                  style={active ? activeStyle : {}}
                >


                  {/* Icon */}
                  <div className="flex-shrink-0 relative z-10 sidebar-icon-wrapper">
                    <SidebarIcon icon={icon} active={active} animate={open} />
                  </div>

                  {/* Label slides + fades: text size increased to text-[15px] and handles active scales */}
                  <motion.span
                    animate={{
                      opacity: open ? 1 : 0,
                      x: open ? 0 : -6,
                      display: open ? "inline-block" : "none"
                    }}
                    transition={LABEL_SPRING}
                    className="text-[15px] font-medium whitespace-nowrap font-sans relative z-10 sidebar-text-label"
                  >
                    {label}
                  </motion.span>

                  {/* Active indicator dot: premium glowing capsule shape */}
                  {active && open && (
                    <motion.span
                      layoutId="active-dot"
                      className="ml-auto w-1 h-3 rounded-full bg-orange-400 flex-shrink-0 relative z-10 shadow-[0_0_8px_#fb923c]"
                      transition={SPRING}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom: pro card + help/logout */}
        <div className="px-2 pb-3 pt-3 border-t border-orange-400/10 overflow-hidden">
          {/* Pro card — always in DOM, animates via maxHeight so it never pops */}
          <motion.div
            animate={{
              maxHeight: (open && !user?.isPro) ? 160 : 0,
              opacity: (open && !user?.isPro) ? 1 : 0,
              marginBottom: (open && !user?.isPro) ? 10 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="rounded-xl p-3 border border-orange-400/20 bg-orange-500/5">
              <p className="text-xs text-orange-300 mb-1 font-semibold font-sans">PRO PLAN</p>
              <p className="text-[11px] text-stone-400 mb-2 font-sans leading-relaxed">
                Unlock unlimited AI simulations and expert reviews.
              </p>
              <Link href="/Upgrade" className="block w-full">
                <motion.button
                  className="interactive primary-blue w-full py-2 rounded-lg text-xs font-medium text-white font-sans cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                >
                  Upgrade to Pro
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {BOTTOM_ITEMS.map(({ href, icon, label }, i) => {
            const getBottomScaleAndX = (index: number) => {
              if (hoveredBottomIdx === null) return { scale: 1, x: 0 };
              const dist = Math.abs(hoveredBottomIdx - index);
              if (open) {
                if (dist === 0) return { scale: 1.03, x: 2 };
                if (dist === 1) return { scale: 1.015, x: 1 };
                return { scale: 1, x: 0 };
              } else {
                if (dist === 0) return { scale: 1.06, x: 3 };
                if (dist === 1) return { scale: 1.03, x: 1.5 };
                return { scale: 1, x: 0 };
              }
            };
            return (
              <motion.div
                key={href}
                onMouseEnter={() => setHoveredBottomIdx(i)}
                onMouseLeave={() => setHoveredBottomIdx(null)}
                animate={getBottomScaleAndX(i)}
                transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }}
                style={{ originX: 0 }}
              >
                <Link
                  href={href}
                  className={`${linkBase} ${open ? "justify-start gap-3.5 py-3 px-4" : "justify-center gap-0 py-3 px-0"
                    } text-stone-400 hover:text-white`}
                >

                  <div className="flex-shrink-0 relative z-10 sidebar-icon-wrapper">
                    <SidebarIcon icon={icon} active={false} animate={open} />
                  </div>
                  <motion.span
                    animate={{
                      opacity: open ? 1 : 0,
                      x: open ? 0 : -6,
                      display: open ? "inline-block" : "none"
                    }}
                    transition={LABEL_SPRING}
                    className="text-[15px] font-medium whitespace-nowrap font-sans relative z-10 sidebar-text-label"
                  >
                    {label}
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* ── Mobile top bar ── */}
      <div
        className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 justify-between lg:hidden"
        style={{
          background: "rgba(18,15,14,0.99)",
          borderBottom: "1px solid rgba(251,146,60,0.10)",
        }}
      >
        <Link href="/LandingPage" className="flex items-center gap-2.5">
          <div className="brand-icon-wrapper w-9 h-9 rounded-lg bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_12px_rgba(249,115,22,0.15)] select-none">
            {/* Viewfinder brackets - fixed standard classes */}
            <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-orange-400 rounded-tl-sm pointer-events-none" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-orange-400 rounded-tr-sm pointer-events-none" />
            <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-orange-400 rounded-bl-sm pointer-events-none" />
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-orange-400 rounded-br-sm pointer-events-none" />
            <AIBrainIcon size={24} className="transform -translate-y-[0.5px]" animate={true} />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="text-[15px] font-black tracking-tight leading-none bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent font-sans">Vector</span>
            <span className="text-[8px] uppercase tracking-[0.18em] text-stone-500 font-sans mt-0.5 font-bold">AI Career Coach</span>
          </div>
        </Link>
        <motion.button
          onClick={() => setMobileOpen(true)}
          className="text-stone-400 hover:text-white p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          <IconMenu2 size={22} />
        </motion.button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              className="fixed inset-0 z-[99] lg:hidden"
              style={{ background: "rgba(0,0,0,0.72)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              id="mobile-drawer-container"
              className="fixed inset-y-0 left-0 z-[100] flex flex-col p-6 lg:hidden"
              style={{
                width: "min(300px, 85vw)",
                background: "rgb(10,9,8)",
                borderRight: "1px solid rgba(251,146,60,0.12)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={DRAWER_SPRING}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                <IconX size={20} />
              </motion.button>

              {/* Brand */}
              <motion.div
                className="flex items-center gap-3 mb-8 mt-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, ...LABEL_SPRING }}
              >
                <div className="brand-icon-wrapper w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_15px_rgba(249,115,22,0.18)] select-none">
                  {/* Viewfinder brackets */}
                  <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
                  <AIBrainIcon size={26} className="transform -translate-y-[0.5px]" animate={true} />
                </div>
                <div className="flex flex-col justify-center text-left">
                  <p className="text-[16px] font-black tracking-tight leading-none bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent font-sans">Vector</p>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-stone-500 font-sans mt-1 font-bold">
                    AI Career Coach
                  </p>
                </div>
              </motion.div>

              {/* Nav items — staggered */}
              <div className="flex flex-col gap-1 flex-1">
                {NAV_ITEMS.map(({ href, icon, label }, i) => {
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.055, ...LABEL_SPRING }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3.5 py-3 px-4 rounded-xl transition-all duration-200 relative overflow-hidden group"
                        style={active ? activeStyle : { color: "#a8a29e" }}
                      >

                        <div className="flex-shrink-0 relative z-10 sidebar-icon-wrapper">
                          <SidebarIcon icon={icon} active={active} animate={true} />
                        </div>
                        <span className="text-[15px] font-medium font-sans relative z-10 sidebar-text-label">{label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom items */}
              <motion.div
                className="pt-4 border-t border-orange-400/10 flex flex-col gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...LABEL_SPRING }}
              >
                {BOTTOM_ITEMS.map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3.5 py-2.5 px-4 rounded-lg text-stone-400 hover:text-white transition-all duration-200 hover:bg-white/5"
                  >
                    <div className="flex-shrink-0 relative z-10 sidebar-icon-wrapper">
                      <SidebarIcon icon={icon} active={false} animate={true} />
                    </div>
                    <span className="text-[15px] font-medium font-sans sidebar-text-label">{label}</span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom navigation bar ── */}
      {shouldShowBottomNav && (
        <div
          className="fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-around lg:hidden"
          style={{
            background: "rgba(18,15,14,0.99)",
            borderTop: "1px solid rgba(251,146,60,0.12)",
          }}
        >
          {BOTTOM_NAV_ITEMS.map(({ href, icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative"
                style={{ color: active ? "#fdba74" : "#a8a29e" }}
              >
                {/* Active indicator bar top of the link */}
                {active && (
                  <motion.div
                    layoutId="active-bottom-bar"
                    className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-500 shadow-[0_0_8px_#fb923c]"
                    transition={SPRING}
                  />
                )}
                {/* Icon wrapper */}
                <div className="flex-shrink-0 relative z-10 sidebar-icon-wrapper flex items-center justify-center">
                  {icon === "profile" ? (
                    user?.avatarUrl && !sidebarImgError ? (
                      <div
                        className={`w-[22px] h-[22px] rounded-full overflow-hidden border transition-all duration-300 ${active
                            ? "border-orange-400 shadow-[0_0_8px_#ea580c]"
                            : "border-stone-500"
                          }`}
                      >
                        <img
                          src={user.avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={() => setSidebarImgError(true)}
                        />
                      </div>
                    ) : (
                      (() => {
                        const { char, bgColor } = getAvatarProps(user?.name);
                        return (
                          <div
                            className={`w-[22px] h-[22px] rounded-full overflow-hidden border transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white ${active
                                ? "border-orange-400 shadow-[0_0_8px_#ea580c]"
                                : "border-stone-500"
                              }`}
                            style={{ backgroundColor: bgColor }}
                          >
                            <span>{char}</span>
                          </div>
                        );
                      })()
                    )
                  ) : (
                    <SidebarIcon icon={icon} active={active} animate={true} />
                  )}
                </div>
                {/* Label text */}
                <span className="text-[10px] font-bold tracking-wider font-mono">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
