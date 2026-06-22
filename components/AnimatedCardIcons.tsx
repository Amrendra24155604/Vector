"use client";

import React from "react";

// Helper style variables for uniform colors
const orangeMain = "#fb923c"; // Orange 400
const orangeLight = "#fdba74"; // Orange 300
const orangeDark = "#ea580c"; // Orange 600
const blueMain = "#3b82f6"; // Blue 500
const blueLight = "#60a5fa"; // Blue 400
const emeraldMain = "#10b981"; // Emerald 500
const amberMain = "#f59e0b"; // Amber 500

export function CardIconShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-1 rounded-xl bg-orange-500/10 border border-orange-400/10 flex-shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

function IconFrame({
  children,
  className = "",
  size = 38,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {children}
      </svg>
    </div>
  );
}

// Dashboard stat box icons (interviews completed, avg score, prep streak)
export function InterviewsCompletedIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="rgba(251, 146, 60, 0.1)" strokeWidth="1" />
      <circle cx="16" cy="16" r="11" stroke="rgba(251, 146, 60, 0.25)" strokeWidth="1.2" strokeDasharray="3 3" className="outer-ring" />
      <line x1="6" y1="16" x2="26" y2="16" stroke="rgba(251, 146, 60, 0.08)" strokeWidth="1" />
      <path d="M16 6V8 M16 24V26 M6 16H8 M24 16H26" stroke="rgba(251, 146, 60, 0.4)" strokeWidth="1" strokeLinecap="round" />
      <path d="M10.5 16.5L14 20L21.5 12" stroke={orangeMain} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
    </IconFrame>
  );
}

export function AverageScoreIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="16" cy="16" r="13" stroke="rgba(251, 146, 60, 0.08)" strokeWidth="1" />
      <circle cx="16" cy="16" r="9" stroke="rgba(251, 146, 60, 0.05)" strokeWidth="1" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(251, 146, 60, 0.06)" strokeWidth="1" />
      <line x1="16" y1="3" x2="16" y2="29" stroke="rgba(251, 146, 60, 0.06)" strokeWidth="1" />
      <rect x="7" y="15" width="2.5" height="9" rx="1.25" fill="rgba(251, 146, 60, 0.2)" className="bar-1" />
      <rect x="12" y="11" width="2.5" height="13" rx="1.25" fill="rgba(251, 146, 60, 0.28)" className="bar-2" />
      <rect x="17" y="16" width="2.5" height="8" rx="1.25" fill="rgba(251, 146, 60, 0.2)" className="bar-3" />
      <path d="M5 22C8.5 17.5 11.5 10.5 15.5 12.5C19.5 14.5 21.5 7.5 26.5 8.5" stroke={orangeMain} strokeWidth="2.2" strokeLinecap="round" className="scope-line" />
      <circle cx="26.5" cy="8.5" r="2.2" fill="#fff" className="glowing-target-dot" />
    </IconFrame>
  );
}

export function PrepStreakIcon({ className = "", gradId = "flameGradCard" }: { className?: string; gradId?: string }) {
  const hoverGradId = `${gradId}Hover`;
  return (
    <IconFrame className={className}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient id={hoverGradId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" stroke="rgba(249, 115, 22, 0.12)" strokeWidth="1" />
      <path d="M16 26C20.5 26 23 22.5 23 18C23 11.5 16 5.5 16 5.5C16 5.5 9 11.5 9 18C9 22.5 11.5 26 16 26Z" fill={`url(#${gradId})`} className="flame-core" />
      <circle cx="11" cy="12" r="1" fill="#fde047" className="spark-1" />
      <circle cx="20" cy="14" r="0.8" fill="#f97316" className="spark-2" />
      <circle cx="16" cy="9" r="1.2" fill="#fff" className="spark-3" />
    </IconFrame>
  );
}

// 1. Dashboard - Upcoming Session Icon
export function UpcomingSessionIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .up-rotate-cw { animation: spin-cw 25s linear infinite; transform-origin: 16px 16px; }
          .up-min-hand { animation: spin-cw 3s linear infinite; transform-origin: 16px 16px; }
          .up-hour-hand { animation: spin-cw 18s linear infinite; transform-origin: 16px 16px; }
          .up-pulse { animation: breathe 2s ease-in-out infinite; transform-origin: 16px 16px; }
          @keyframes spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
        <circle cx="16" cy="16" r="11" stroke="rgba(251,146,60,0.22)" strokeWidth="1" strokeDasharray="3 3" className="up-rotate-cw" />
        {/* Clock Hands */}
        <line x1="16" y1="16" x2="16" y2="9" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="up-min-hand" />
        <line x1="16" y1="16" x2="20" y2="16" stroke={orangeLight} strokeWidth="1.8" strokeLinecap="round" className="up-hour-hand" />
        {/* Core glowing dot */}
        <circle cx="16" cy="16" r="2.5" fill="#fff" className="up-pulse" style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} />
        {/* Outer ticks */}
        <path d="M16 4V6 M16 26V28 M4 16H6 M26 16H28" stroke="rgba(251,146,60,0.35)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 2. Dashboard - Recent Activity Icon
export function ActivityTimelineIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .act-draw { stroke-dasharray: 40; stroke-dashoffset: 40; animation: draw-line 3s ease-in-out infinite; }
          .act-node-1 { animation: twinkle 1.5s ease-in-out infinite; }
          .act-node-2 { animation: twinkle 1.5s ease-in-out infinite 0.5s; }
          .act-node-3 { animation: twinkle 1.5s ease-in-out infinite 1s; }
          @keyframes draw-line {
            0% { stroke-dashoffset: 40; }
            50%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.15); fill: ${orangeLight}; }
          }
        `}</style>
        {/* Grid lines */}
        <line x1="6" y1="8" x2="26" y2="8" stroke="rgba(251,146,60,0.06)" strokeWidth="1" />
        <line x1="6" y1="16" x2="26" y2="16" stroke="rgba(251,146,60,0.06)" strokeWidth="1" />
        <line x1="6" y1="24" x2="26" y2="24" stroke="rgba(251,146,60,0.06)" strokeWidth="1" />

        {/* Timeline main flow line */}
        <path d="M12 6V26" stroke="rgba(251,146,60,0.18)" strokeWidth="1.5" />
        <path d="M12 6V26" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="act-draw" />

        {/* Nodes */}
        <g className="act-node-1" style={{ transformOrigin: "12px 10px" }}>
          <circle cx="12" cy="10" r="4.5" fill="rgba(251,146,60,0.15)" stroke={orangeMain} strokeWidth="1" />
          <circle cx="12" cy="10" r="1.8" fill="#fff" />
        </g>
        <g className="act-node-2" style={{ transformOrigin: "12px 18px" }}>
          <circle cx="12" cy="18" r="4.5" fill="rgba(251,146,60,0.15)" stroke={orangeMain} strokeWidth="1" />
          <circle cx="12" cy="18" r="1.8" fill="#fff" />
        </g>
        <g className="act-node-3" style={{ transformOrigin: "12px 24px" }}>
          <circle cx="12" cy="24" r="4.5" fill="rgba(251,146,60,0.15)" stroke={orangeMain} strokeWidth="1" />
          <circle cx="12" cy="24" r="1.8" fill="#fff" />
        </g>

        {/* Connection pointers */}
        <line x1="16" y1="10" x2="22" y2="10" stroke="rgba(251,146,60,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="16" y1="18" x2="22" y2="18" stroke="rgba(251,146,60,0.3)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

// 3. Dashboard - AI Feedback Trends Icon
export function FeedbackTrendsIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .trends-ripple-1 { animation: ripple-expand 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; transform-origin: 16px 16px; }
          .trends-ripple-2 { animation: ripple-expand 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 0.8s; transform-origin: 16px 16px; }
          .trends-ripple-3 { animation: ripple-expand 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 1.6s; transform-origin: 16px 16px; }
          .trends-core { animation: core-glow 2s ease-in-out infinite; }
          @keyframes ripple-expand {
            0% { r: 3px; opacity: 0.9; stroke: ${orangeMain}; }
            50% { opacity: 0.4; }
            100% { r: 14px; opacity: 0; stroke: ${orangeLight}; }
          }
          @keyframes core-glow {
            0%, 100% { fill: ${orangeMain}; filter: drop-shadow(0 0 2px ${orangeMain}); }
            50% { fill: ${orangeLight}; filter: drop-shadow(0 0 6px ${orangeLight}); }
          }
        `}</style>
        {/* Pulsing Concentric Rings */}
        <circle cx="16" cy="16" r="6" fill="none" strokeWidth="1" className="trends-ripple-1" />
        <circle cx="16" cy="16" r="9" fill="none" strokeWidth="1" className="trends-ripple-2" />
        <circle cx="16" cy="16" r="12" fill="none" strokeWidth="1" className="trends-ripple-3" />

        {/* Central Core */}
        <circle cx="16" cy="16" r="4.5" fill={orangeMain} className="trends-core" />

        {/* Horizontal & Vertical Crosshairs */}
        <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(251,146,60,0.08)" strokeWidth="0.8" />
        <line x1="16" y1="3" x2="16" y2="29" stroke="rgba(251,146,60,0.08)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// 4. Resume Analyzer - Laser Document Scanner Icon
export function ResumeScannerIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .scan-laser { animation: laser-sweep 2.8s ease-in-out infinite; }
          .scan-doc-glow { animation: document-breathe 2.8s ease-in-out infinite; }
          @keyframes laser-sweep {
            0%, 100% { transform: translateY(0px); opacity: 0.3; }
            50% { transform: translateY(18px); opacity: 1; }
          }
          @keyframes document-breathe {
            0%, 100% { stroke-opacity: 0.3; }
            50% { stroke-opacity: 0.65; }
          }
        `}</style>
        {/* Outer document frame */}
        <path d="M8 5C8 3.9 8.9 3 10 3 H20 L25 8 V27C25 28.1 24.1 29 23 29 H10C8.9 29 8 28.1 8 27 V5Z" stroke={orangeMain} strokeWidth="1.25" strokeOpacity="0.45" fill="rgba(251,146,60,0.02)" className="scan-doc-glow" />
        {/* Fold creasline */}
        <path d="M19.5 3.5 V8 H24.5" stroke={orangeMain} strokeWidth="1" strokeOpacity="0.45" />

        {/* Text lines */}
        <line x1="11" y1="12" x2="17" y2="12" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="16" x2="21" y2="16" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="20" x2="19" y2="20" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="24" x2="15" y2="24" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Scanning Laser Line */}
        <g className="scan-laser">
          <line x1="6" y1="7" x2="26" y2="7" stroke={orangeLight} strokeWidth="1.8" style={{ filter: "drop-shadow(0 0 2px #f97316)" }} />
          <circle cx="6" cy="7" r="1.5" fill="#fff" />
          <circle cx="26" cy="7" r="1.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

// 5. Resume Analyzer - ATS Score Gauge Icon
export function AtsScoreGaugeIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .ats-hex-spin { animation: spin-cw 20s linear infinite; transform-origin: 16px 16px; }
          .ats-check-draw { stroke-dasharray: 22; stroke-dashoffset: 22; animation: draw-check-ats 2.5s ease-in-out infinite; }
          @keyframes draw-check-ats {
            0%, 20% { stroke-dashoffset: 22; }
            50%, 100% { stroke-dashoffset: 0; }
          }
        `}</style>
        {/* Hex grid backdrop */}
        <path d="M16 3L27 9V23L16 29L5 23V9L16 3Z" stroke="rgba(251,146,60,0.12)" strokeWidth="1" className="ats-hex-spin" />

        {/* Concentric telemetry guide */}
        <circle cx="16" cy="16" r="11" stroke="rgba(251,146,60,0.22)" strokeWidth="1" strokeDasharray="2 4" />

        {/* Target dots */}
        <circle cx="16" cy="6" r="1.2" fill={orangeMain} />
        <circle cx="16" cy="26" r="1.2" fill={orangeMain} />

        {/* Animated Checkmark */}
        <path d="M10 16.5L14 20L21.5 12" stroke={orangeMain} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ats-check-draw" />
      </svg>
    </div>
  );
}

// 6. Resume Analyzer - History Graph Icon
export function HistoryGraphIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .hist-bar-1 { animation: scale-y-bar 2s ease-in-out infinite; transform-origin: 8px 24px; }
          .hist-bar-2 { animation: scale-y-bar 2s ease-in-out infinite 0.4s; transform-origin: 14px 24px; }
          .hist-bar-3 { animation: scale-y-bar 2s ease-in-out infinite 0.8s; transform-origin: 20px 24px; }
          .hist-bar-4 { animation: scale-y-bar 2s ease-in-out infinite 1.2s; transform-origin: 26px 24px; }
          @keyframes scale-y-bar {
            0%, 100% { transform: scaleY(0.4); }
            50% { transform: scaleY(1.05); }
          }
        `}</style>
        {/* Axis grid */}
        <line x1="5" y1="25" x2="28" y2="25" stroke="rgba(251,146,60,0.25)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="7" x2="5" y2="25" stroke="rgba(251,146,60,0.12)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Dynamic rising bars */}
        <rect x="7.5" y="11" width="3.2" height="13" rx="1" fill={orangeDark} className="hist-bar-1" />
        <rect x="13.5" y="7" width="3.2" height="17" rx="1" fill={orangeMain} className="hist-bar-2" />
        <rect x="19.5" y="13" width="3.2" height="11" rx="1" fill={orangeLight} className="hist-bar-3" />
        <rect x="25.5" y="9" width="3.2" height="15" rx="1" fill={orangeMain} className="hist-bar-4" />
      </svg>
    </div>
  );
}

// 7. Mock Interview - Voice Waveform Icon
export function VoiceWaveformIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .voice-bar-1 { animation: voice-bounce-key 1s ease-in-out infinite; transform-origin: 6px 16px; }
          .voice-bar-2 { animation: voice-bounce-key 1s ease-in-out infinite 0.15s; transform-origin: 10px 16px; }
          .voice-bar-3 { animation: voice-bounce-key 1s ease-in-out infinite 0.3s; transform-origin: 14px 16px; }
          .voice-bar-4 { animation: voice-bounce-key 1s ease-in-out infinite 0.45s; transform-origin: 18px 16px; }
          .voice-bar-5 { animation: voice-bounce-key 1s ease-in-out infinite 0.6s; transform-origin: 22px 16px; }
          .voice-bar-6 { animation: voice-bounce-key 1s ease-in-out infinite 0.75s; transform-origin: 26px 16px; }
          @keyframes voice-bounce-key {
            0%, 100% { transform: scaleY(0.35); }
            50% { transform: scaleY(1.3); }
          }
        `}</style>
        {/* Ambient surrounding loop */}
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.08)" strokeWidth="1" />

        {/* Equalizer bars */}
        <rect x="5" y="11" width="2" height="10" rx="1" fill={orangeLight} className="voice-bar-1" />
        <rect x="9" y="8" width="2" height="16" rx="1" fill={orangeMain} className="voice-bar-2" />
        <rect x="13" y="5" width="2" height="22" rx="1" fill={orangeDark} className="voice-bar-3" />
        <rect x="17" y="7" width="2" height="18" rx="1" fill={orangeMain} className="voice-bar-4" />
        <rect x="21" y="9" width="2" height="14" rx="1" fill={orangeLight} className="voice-bar-5" />
        <rect x="25" y="12" width="2" height="8" rx="1" fill={orangeMain} className="voice-bar-6" />
      </svg>
    </div>
  );
}

// 8. Mock Interview - Speech Coherence Icon
export function SpeechCoherenceIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .sine-slide-1 { stroke-dasharray: 60 120; animation: sine-move 4s linear infinite; }
          .sine-slide-2 { stroke-dasharray: 60 120; animation: sine-move-reverse 4s linear infinite; }
          @keyframes sine-move {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -180; }
          }
          @keyframes sine-move-reverse {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 180; }
          }
        `}</style>
        {/* Border telemetry rings */}
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.1)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Horizontal Center line */}
        <line x1="4" y1="16" x2="28" y2="16" stroke="rgba(251,146,60,0.12)" strokeWidth="0.8" />

        {/* Overlaying animating sine wave paths */}
        <path d="M 4 16 Q 10 7 16 16 T 28 16" stroke={orangeMain} strokeWidth="1.8" strokeLinecap="round" fill="none" className="sine-slide-1" />
        <path d="M 4 16 Q 10 25 16 16 T 28 16" stroke={orangeLight} strokeWidth="1" strokeLinecap="round" fill="none" className="sine-slide-2" />

        {/* Central glowing diagnostic node */}
        <circle cx="16" cy="16" r="2.5" fill="#fff" style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} />
      </svg>
    </div>
  );
}

// 9. Internship Match - Match Gears Icon
export function MatchGearsIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .gear-cw { animation: spin-cw 8s linear infinite; transform-origin: 12px 20px; }
          .gear-ccw { animation: spin-ccw 8s linear infinite; transform-origin: 20px 12px; }
          @keyframes spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
        `}</style>
        {/* Left gear (larger) */}
        <g className="gear-cw">
          <circle cx="12" cy="20" r="6" stroke={orangeMain} strokeWidth="1.5" />
          <path d="M12 12V14 M12 26V28 M4 20H6 M18 20H20 M6.3 14.3L7.7 15.7 M16.3 24.3L17.7 25.7 M17.7 14.3L16.3 15.7 M7.7 24.3L6.3 25.7" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right gear (smaller) */}
        <g className="gear-ccw">
          <circle cx="20" cy="12" r="4" stroke={orangeLight} strokeWidth="1.2" />
          <path d="M20 7V9 M20 15V17 M15 12H17 M23 12H25 M16.5 8.5L17.5 9.5 M22.5 14.5L23.5 15.5 M23.5 8.5L22.5 9.5 M17.5 14.5L16.5 15.5" stroke={orangeLight} strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Connection line representation */}
        <line x1="12" y1="20" x2="20" y2="12" stroke={orangeLight} strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

// 10. Internship Match - Opportunity Radar Icon
export function OpportunityRadarIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .radar-sweep-hand { animation: spin-cw 3.5s linear infinite; transform-origin: 16px 16px; }
          .radar-target { animation: flash-node 1.5s ease-in-out infinite; }
          @keyframes flash-node {
            0%, 100% { fill: rgba(251,146,60,0.15); stroke: ${orangeMain}; }
            50% { fill: #fff; stroke: ${orangeLight}; filter: drop-shadow(0 0 3px #fb923c); }
          }
        `}</style>
        {/* Outer boundaries */}
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
        <circle cx="16" cy="16" r="9" stroke="rgba(251,146,60,0.06)" strokeWidth="1" />

        {/* Crosshair ticks */}
        <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(251,146,60,0.1)" strokeWidth="0.8" />
        <line x1="16" y1="3" x2="16" y2="29" stroke="rgba(251,146,60,0.1)" strokeWidth="0.8" />

        {/* Sweeping line */}
        <g className="radar-sweep-hand">
          <line x1="16" y1="16" x2="27" y2="8" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 16 16 L 27 8 A 13 13 0 0 0 16 3 Z" fill="rgba(251,146,60,0.06)" />
        </g>

        {/* Detected Targets */}
        <circle cx="21" cy="9" r="2.5" className="radar-target" strokeWidth="0.75" />
        <circle cx="10" cy="21" r="2" fill={orangeLight} opacity="0.6" />
      </svg>
    </div>
  );
}

// 11. Cold Email - Paper Airplane Icon
export function PaperAirplaneOutreachIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .plane-fly { animation: glide-soar 3.5s ease-in-out infinite; }
          .env-pulse { animation: env-pulse-key 2s ease-in-out infinite; }
          @keyframes glide-soar {
            0%, 100% { transform: translate(-1.5px, 1.5px); }
            50% { transform: translate(2.5px, -2.5px); }
          }
          @keyframes env-pulse-key {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.65; }
          }
        `}</style>
        {/* Envelope outline */}
        <rect x="5" y="10" width="16" height="12" rx="2" stroke={orangeMain} strokeWidth="1.25" strokeOpacity="0.45" className="env-pulse" fill="rgba(251,146,60,0.02)" />
        <path d="M5 11 L13 16.5 L21 11" stroke={orangeMain} strokeWidth="1" strokeOpacity="0.45" className="env-pulse" />

        {/* Flying paper airplane representing outreach */}
        <g className="plane-fly">
          <path d="M12 25 L27 10 L20 27 L17 19 L12 25 Z" stroke={orangeLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(251,146,60,0.06)" />
          <path d="M27 10 L17 19" stroke={orangeMain} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// 12. Cold Email - Draft Quill Icon
export function DraftQuillIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .quill-sketch { animation: sketch-pencil 3s ease-in-out infinite; }
          .writer-line-1 { animation: type-fill 2s infinite; }
          .writer-line-2 { animation: type-fill 2s infinite 0.5s; }
          @keyframes sketch-pencil {
            0%, 100% { transform: translate(0px, 0px); }
            50% { transform: translate(-2px, -2px); }
          }
          @keyframes type-fill {
            0%, 100% { stroke-opacity: 0.25; }
            50% { stroke-opacity: 0.75; }
          }
        `}</style>
        {/* Document panel outline */}
        <rect x="6" y="5" width="20" height="23" rx="4" stroke={orangeMain} strokeWidth="1.25" strokeOpacity="0.45" fill="rgba(251,146,60,0.02)" />

        {/* Document content lines */}
        <line x1="9" y1="10" x2="19" y2="10" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="writer-line-1" />
        <line x1="9" y1="14" x2="23" y2="14" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="writer-line-2" />
        <line x1="9" y1="18" x2="17" y2="18" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="writer-line-1" />
        <line x1="9" y1="22" x2="21" y2="22" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" className="writer-line-2" />

        {/* Animated Quill pen sketching on the right */}
        <g className="quill-sketch" style={{ transformOrigin: "24px 12px" }}>
          <path d="M22 20 L27 8 Q 28 5 25 6 L 14 16 L 22 20 Z" fill="rgba(251,146,60,0.2)" stroke={orangeLight} strokeWidth="1.2" />
          <line x1="22" y1="20" x2="13" y2="25" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// 13. Progress - Rocket Growth Icon
export function RocketGrowthIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .growth-rocket { animation: soar-rocket 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
          .growth-rings { animation: spin-cw 30s linear infinite; transform-origin: 16px 16px; }
          @keyframes soar-rocket {
            0%, 100% { transform: translate(-2px, 2px); }
            50% { transform: translate(3px, -3px) scale(1.05); }
          }
        `}</style>
        {/* Orbital grid */}
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
        <circle cx="16" cy="16" r="10" stroke="rgba(251,146,60,0.2)" strokeWidth="1" strokeDasharray="3 3" className="growth-rings" />

        {/* Growing trace line */}
        <path d="M 6 26 C 12 26, 16 16, 26 6" stroke="rgba(251,146,60,0.25)" strokeWidth="1" strokeLinecap="round" />
        <path d="M 6 26 C 12 26, 16 16, 26 6" stroke={orangeMain} strokeWidth="2" strokeLinecap="round" strokeDasharray="10 30" className="growth-rocket" />

        {/* Glowing peak tip */}
        <circle cx="26" cy="6" r="2" fill="#fff" style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} className="growth-rocket" />
      </svg>
    </div>
  );
}

// 14. Progress - Concentric Gauge Icon
export function ConcentricGaugeIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .gauge-dial-arc { stroke-dasharray: 80 80; animation: gauge-load 3s ease-in-out infinite; }
          .gauge-dot { animation: spin-cw 3s linear infinite; transform-origin: 16px 16px; }
          @keyframes gauge-load {
            0%, 100% { stroke-dashoffset: 75; }
            50% { stroke-dashoffset: 15; }
          }
        `}</style>
        {/* Telemetry boundaries */}
        <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.1)" strokeWidth="1.2" />

        {/* Ring Gauge path */}
        <circle cx="16" cy="16" r="10" stroke="rgba(251,146,60,0.15)" strokeWidth="3.5" />
        <circle cx="16" cy="16" r="10" stroke={orangeMain} strokeWidth="3.5" strokeLinecap="round" transform="rotate(-90 16 16)" className="gauge-dial-arc" />

        {/* Center score readout */}
        <circle cx="16" cy="16" r="4.5" fill="rgba(251,146,60,0.06)" stroke="rgba(251,146,60,0.25)" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="2.2" fill="#fff" style={{ filter: "drop-shadow(0 0 2px #fb923c)" }} />

        {/* Animating satellite node */}
        <g className="gauge-dot">
          <circle cx="26" cy="16" r="1.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

// 15. Profile - User Avatar Shield Icon
export function UserAvatarShieldIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .shield-breathe { animation: shield-glow 2.8s ease-in-out infinite; }
          .shield-avatar { animation: avatar-grow 2.8s ease-in-out infinite; transform-origin: 16px 13px; }
          @keyframes shield-glow {
            0%, 100% { stroke-opacity: 0.3; }
            50% { stroke-opacity: 0.7; }
          }
          @keyframes avatar-grow {
            0%, 100% { transform: scale(0.96); }
            50% { transform: scale(1.04); }
          }
        `}</style>
        {/* Circular shield ring */}
        <circle cx="16" cy="16" r="13" stroke={orangeMain} strokeWidth="1.25" strokeOpacity="0.4" className="shield-breathe" fill="rgba(251,146,60,0.02)" />
        <circle cx="16" cy="16" r="11" stroke="rgba(251,146,60,0.18)" strokeWidth="0.8" strokeDasharray="2 3" />

        {/* User avatar geometry */}
        <g className="shield-avatar">
          {/* Head */}
          <circle cx="16" cy="12" r="3.5" stroke={orangeLight} strokeWidth="1.8" fill="rgba(253,186,116,0.15)" />
          {/* Shoulders */}
          <path d="M9.5 22C9.5 19 12 17.5 16 17.5C20 17.5 22.5 19 22.5 22" stroke={orangeLight} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// 16. Profile - Skills Constellation Icon
export function SkillsConstellationIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
        <style>{`
          .const-node-1 { animation: twinkle 2s ease-in-out infinite; }
          .const-node-2 { animation: twinkle 2s ease-in-out infinite 0.6s; }
          .const-node-3 { animation: twinkle 2s ease-in-out infinite 1.2s; }
          .const-line { animation: line-glow-key 2s ease-in-out infinite; }
          @keyframes line-glow-key {
            0%, 100% { stroke-opacity: 0.15; }
            50% { stroke-opacity: 0.45; }
          }
        `}</style>
        {/* Constellation link lines */}
        <line x1="8" y1="12" x2="16" y2="8" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="16" y1="8" x2="24" y2="12" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="24" y1="12" x2="20" y2="22" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="20" y1="22" x2="12" y2="22" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="12" y1="22" x2="8" y2="12" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="16" y1="8" x2="16" y2="18" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="16" y1="18" x2="12" y2="22" stroke={orangeLight} strokeWidth="0.8" className="const-line" />
        <line x1="16" y1="18" x2="20" y2="22" stroke={orangeLight} strokeWidth="0.8" className="const-line" />

        {/* Nodes */}
        <circle cx="8" cy="12" r="2.5" fill={orangeMain} className="const-node-1" />
        <circle cx="16" cy="8" r="3" fill={orangeLight} className="const-node-2" style={{ filter: "drop-shadow(0 0 2px #fb923c)" }} />
        <circle cx="24" cy="12" r="2" fill={orangeMain} className="const-node-3" />
        <circle cx="20" cy="22" r="2.5" fill={orangeLight} className="const-node-1" />
        <circle cx="12" cy="22" r="2" fill={orangeMain} className="const-node-2" />
        <circle cx="16" cy="18" r="3.2" fill={orangeMain} className="const-node-3" />
      </svg>
    </div>
  );
}

// Section header & utility icons
export function SettingsTuneIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .tune-spin { animation: spin-cw 12s linear infinite; transform-origin: 16px 16px; }
      `}</style>
      <circle cx="16" cy="16" r="12" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
      <g className="tune-spin">
        <circle cx="16" cy="16" r="7" stroke={orangeMain} strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
        <path d="M16 9V11 M16 21V23 M9 16H11 M21 16H23" stroke={orangeLight} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <circle cx="16" cy="16" r="2.5" fill="#fff" style={{ filter: "drop-shadow(0 0 2px #fb923c)" }} />
    </IconFrame>
  );
}

export function AiCoachIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .coach-orbit { animation: spin-cw 8s linear infinite; transform-origin: 16px 16px; }
        .coach-core { animation: breathe 2s ease-in-out infinite; transform-origin: 16px 16px; }
      `}</style>
      <circle cx="16" cy="16" r="12" stroke="rgba(251,146,60,0.15)" strokeWidth="1" className="coach-orbit" strokeDasharray="3 3" />
      <rect x="11" y="12" width="10" height="8" rx="2" stroke={orangeMain} strokeWidth="1.2" fill="rgba(251,146,60,0.08)" />
      <circle cx="13.5" cy="15" r="1" fill={orangeLight} />
      <circle cx="18.5" cy="15" r="1" fill={orangeLight} />
      <path d="M13 18.5H19" stroke={orangeMain} strokeWidth="1" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2" fill="#fff" className="coach-core" style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} />
    </IconFrame>
  );
}

export function CoachPreferencesIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .pref-orbit { animation: spin-cw 14s linear infinite; transform-origin: 16px 16px; }
      `}</style>
      <circle cx="16" cy="16" r="12" stroke="rgba(251,146,60,0.12)" strokeWidth="1" className="pref-orbit" strokeDasharray="2 4" />
      <circle cx="16" cy="12" r="3.5" stroke={orangeLight} strokeWidth="1.5" fill="rgba(253,186,116,0.12)" />
      <path d="M10 22C10 19 12.5 17.5 16 17.5C19.5 17.5 22 19 22 22" stroke={orangeMain} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="10" r="2.5" fill={orangeMain} style={{ filter: "drop-shadow(0 0 2px #fb923c)" }} />
    </IconFrame>
  );
}

export function ApplicationFunnelIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .funnel-flow { animation: funnel-drop 2.5s ease-in-out infinite; }
        @keyframes funnel-drop {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50% { transform: translateY(3px); opacity: 1; }
        }
      `}</style>
      <path d="M8 8H24L19 16L19 24H13V16L8 8Z" stroke="rgba(251,146,60,0.2)" strokeWidth="1" fill="rgba(251,146,60,0.04)" />
      <path d="M10 10H22L18.5 16L18.5 22H13.5V16L10 10Z" stroke={orangeMain} strokeWidth="1.2" fill="none" />
      <circle cx="16" cy="13" r="1.5" fill={orangeLight} className="funnel-flow" />
    </IconFrame>
  );
}

export function RecentApplicationsIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .app-pulse { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
      <rect x="9" y="10" width="14" height="12" rx="2" stroke={orangeMain} strokeWidth="1.2" strokeOpacity="0.5" fill="rgba(251,146,60,0.04)" />
      <path d="M9 13H23" stroke={orangeMain} strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="13" cy="17" r="1.5" fill={orangeLight} className="app-pulse" />
      <circle cx="19" cy="17" r="1.5" fill={orangeMain} className="app-pulse" style={{ animationDelay: "0.5s" }} />
      <path d="M16 6V9 M12 7L16 4L20 7" stroke={orangeLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </IconFrame>
  );
}

export function PrepLibraryIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .lib-float { animation: breathe 3s ease-in-out infinite; transform-origin: 16px 16px; }
      `}</style>
      <rect x="8" y="7" width="8" height="18" rx="1.5" stroke={orangeMain} strokeWidth="1" strokeOpacity="0.45" fill="rgba(251,146,60,0.06)" className="lib-float" />
      <rect x="13" y="5" width="8" height="18" rx="1.5" stroke={orangeLight} strokeWidth="1" strokeOpacity="0.55" fill="rgba(251,146,60,0.08)" />
      <rect x="18" y="9" width="8" height="18" rx="1.5" stroke={orangeMain} strokeWidth="1" strokeOpacity="0.35" fill="rgba(251,146,60,0.04)" />
      <line x1="15" y1="10" x2="15" y2="20" stroke={orangeLight} strokeWidth="0.8" strokeOpacity="0.5" />
    </IconFrame>
  );
}

export function InterviewTypeTechnicalIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={36}>
      <path d="M10 10L7 16L10 22M22 10L25 16L22 22" stroke={orangeMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="9" x2="14" y2="23" stroke={orangeLight} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
    </IconFrame>
  );
}

export function InterviewTypeBehavioralIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={36}>
      <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.12)" strokeWidth="1" />
      <path d="M10 14C10 14 12 10 16 10C20 10 22 14 22 14V18C22 20 20 22 16 22C12 22 10 20 10 18V14Z" stroke={orangeMain} strokeWidth="1.3" fill="rgba(251,146,60,0.06)" />
      <circle cx="13" cy="15" r="1" fill={orangeLight} />
      <circle cx="19" cy="15" r="1" fill={orangeLight} />
      <path d="M13 18H19" stroke={orangeMain} strokeWidth="1" strokeLinecap="round" />
    </IconFrame>
  );
}

export function InterviewTypeSystemDesignIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={36}>
      <style>{`
        .sd-node { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
      <circle cx="16" cy="8" r="3" stroke={orangeMain} strokeWidth="1.2" fill="rgba(251,146,60,0.1)" className="sd-node" />
      <circle cx="8" cy="22" r="3" stroke={orangeLight} strokeWidth="1.2" fill="rgba(251,146,60,0.08)" className="sd-node" style={{ animationDelay: "0.4s" }} />
      <circle cx="24" cy="22" r="3" stroke={orangeMain} strokeWidth="1.2" fill="rgba(251,146,60,0.08)" className="sd-node" style={{ animationDelay: "0.8s" }} />
      <line x1="16" y1="11" x2="10" y2="19" stroke="rgba(251,146,60,0.35)" strokeWidth="1" />
      <line x1="16" y1="11" x2="22" y2="19" stroke="rgba(251,146,60,0.35)" strokeWidth="1" />
      <circle cx="16" cy="16" r="13" stroke="rgba(251,146,60,0.1)" strokeWidth="1" strokeDasharray="2 3" />
    </IconFrame>
  );
}

export function ActivityCheckIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <path d="M16 3L27 9V23L16 29L5 23V9L16 3Z" stroke="rgba(16,185,129,0.25)" strokeWidth="1" fill="rgba(16,185,129,0.06)" />
      <path d="M10 16L14 20L22 12" stroke={emeraldMain} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </IconFrame>
  );
}

export function ActivitySchoolIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <path d="M16 6L6 12L16 18L26 12L16 6Z" stroke={orangeMain} strokeWidth="1.3" fill="rgba(251,146,60,0.08)" strokeLinejoin="round" />
      <path d="M10 14V20C10 20 12.5 22 16 22C19.5 22 22 20 22 20V14" stroke={orangeLight} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="26" y1="12" x2="26" y2="20" stroke={orangeMain} strokeWidth="1.2" strokeLinecap="round" />
    </IconFrame>
  );
}

export function ActivityPsychologyIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <circle cx="16" cy="16" r="10" stroke="rgba(245,158,11,0.25)" strokeWidth="1" fill="rgba(245,158,11,0.06)" />
      <path d="M11 14C11 14 13 11 16 11C19 11 21 14 21 14" stroke={amberMain} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 19C13 20 14.5 21 16 21C17.5 21 19 20 20 19" stroke={amberMain} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="15" r="1" fill={amberMain} />
      <circle cx="19" cy="15" r="1" fill={amberMain} />
    </IconFrame>
  );
}

export function DocumentFileIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={40}>
      <path d="M9 4H18L23 9V27C23 28.1 22.1 29 21 29H9C7.9 29 7 28.1 7 27V6C7 4.9 7.9 4 9 4Z" stroke={orangeMain} strokeWidth="1.3" fill="rgba(251,146,60,0.06)" />
      <path d="M17 4V9H22" stroke={orangeLight} strokeWidth="1" />
      <line x1="10" y1="14" x2="18" y2="14" stroke="rgba(251,146,60,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="18" x2="20" y2="18" stroke="rgba(251,146,60,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 23L14 26L21 19" stroke={orangeMain} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconFrame>
  );
}

export function OutreachMailHeroIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={56}>
      <style>{`
        .hero-mail { animation: breathe 2.5s ease-in-out infinite; transform-origin: 16px 16px; }
      `}</style>
      <circle cx="16" cy="16" r="14" stroke="rgba(251,146,60,0.15)" strokeWidth="1" />
      <g className="hero-mail">
        <rect x="6" y="10" width="20" height="14" rx="2.5" stroke={orangeMain} strokeWidth="1.3" fill="rgba(251,146,60,0.08)" />
        <path d="M6 12L16 19L26 12" stroke={orangeLight} strokeWidth="1.2" />
      </g>
      <circle cx="24" cy="10" r="2" fill="#fff" style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} />
    </IconFrame>
  );
}

export function SkillsCodeIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <path d="M10 10L7 16L10 22M22 10L25 16L22 22" stroke={orangeMain} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="9" x2="14" y2="23" stroke={orangeLight} strokeWidth="1.3" strokeLinecap="round" />
    </IconFrame>
  );
}

export function InterestsSparkIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <path d="M16 4V8M16 24V28M4 16H8M24 16H28" stroke="rgba(251,146,60,0.35)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill={orangeMain} style={{ filter: "drop-shadow(0 0 3px #fb923c)" }} />
      <circle cx="16" cy="8" r="1.5" fill={orangeLight} />
      <circle cx="24" cy="16" r="1.2" fill={orangeLight} />
      <circle cx="16" cy="24" r="1.5" fill={orangeLight} />
      <circle cx="8" cy="16" r="1.2" fill={orangeLight} />
    </IconFrame>
  );
}

export function ProfileInfoIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <circle cx="16" cy="16" r="12" stroke="rgba(251,146,60,0.25)" strokeWidth="1.2" fill="rgba(251,146,60,0.04)" />
      <circle cx="16" cy="11" r="1.5" fill={orangeMain} />
      <line x1="16" y1="14" x2="16" y2="22" stroke={orangeLight} strokeWidth="2" strokeLinecap="round" />
    </IconFrame>
  );
}

export function SearchBrowseIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <style>{`
        .search-spin { animation: spin-cw 6s linear infinite; transform-origin: 14px 14px; }
      `}</style>
      <circle cx="14" cy="14" r="8" stroke={orangeMain} strokeWidth="1.5" fill="none" className="search-spin" strokeDasharray="3 2" />
      <line x1="20" y1="20" x2="26" y2="26" stroke={orangeLight} strokeWidth="2" strokeLinecap="round" />
    </IconFrame>
  );
}

export function KanbanBoardIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <rect x="5" y="7" width="6" height="18" rx="1.5" stroke={orangeMain} strokeWidth="1" fill="rgba(251,146,60,0.06)" />
      <rect x="13" y="7" width="6" height="18" rx="1.5" stroke={orangeLight} strokeWidth="1" fill="rgba(251,146,60,0.08)" />
      <rect x="21" y="7" width="6" height="18" rx="1.5" stroke={orangeMain} strokeWidth="1" fill="rgba(251,146,60,0.04)" />
      <rect x="6" y="10" width="4" height="3" rx="0.75" fill={orangeMain} fillOpacity="0.5" />
      <rect x="14" y="14" width="4" height="3" rx="0.75" fill={orangeLight} fillOpacity="0.6" />
      <rect x="22" y="11" width="4" height="3" rx="0.75" fill={orangeMain} fillOpacity="0.45" />
    </IconFrame>
  );
}

export function CoachingStarIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <path d="M16 5L18.5 12.5H26.5L20 17L22.5 24.5L16 20L9.5 24.5L12 17L5.5 12.5H13.5L16 5Z" stroke={orangeMain} strokeWidth="1" fill="rgba(251,146,60,0.12)" strokeLinejoin="round" />
    </IconFrame>
  );
}

export function CoachingMicIcon({ className = "" }: { className?: string }) {
  return (
    <IconFrame className={className} size={32}>
      <rect x="13" y="6" width="6" height="11" rx="3" stroke={orangeMain} strokeWidth="1.3" fill="rgba(251,146,60,0.08)" />
      <path d="M10 14C10 17.3 12.7 20 16 20C19.3 20 22 17.3 22 14" stroke={orangeLight} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="24" stroke={orangeMain} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="24" x2="20" y2="24" stroke={orangeMain} strokeWidth="1.2" strokeLinecap="round" />
    </IconFrame>
  );
}

export function CoachingSchemaIcon({ className = "" }: { className?: string }) {
  return InterviewTypeSystemDesignIcon({ className });
}

export function ActivityIconForType({ icon, className = "" }: { icon: string; className?: string }) {
  if (icon === "check_circle") return <ActivityCheckIcon className={className} />;
  if (icon === "school") return <ActivitySchoolIcon className={className} />;
  if (icon === "psychology") return <ActivityPsychologyIcon className={className} />;
  return <ActivityCheckIcon className={className} />;
}

export const PROGRESS_STAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  record_voice_over: VoiceWaveformIcon,
  analytics: AverageScoreIcon,
  work_history: RecentApplicationsIcon,
  mail: PaperAirplaneOutreachIcon,
  description: ResumeScannerIcon,
  local_fire_department: PrepStreakIcon,
};

export const PROFILE_STAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  task_alt: InterviewsCompletedIcon,
  analytics: AtsScoreGaugeIcon,
  local_fire_department: PrepStreakIcon,
  send: PaperAirplaneOutreachIcon,
};
