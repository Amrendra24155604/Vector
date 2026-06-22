"use client";

import React from "react";

export function AnimatedBrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 640 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Internship Match Agent floating dashboard window mark"
      >
        <title>Internship Match Agent — animated dashboard window mark</title>

        <defs>
          <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.16)"/>
            <stop offset="55%" stopColor="rgba(194,65,12,0.08)"/>
            <stop offset="100%" stopColor="rgba(194,65,12,0)"/>
          </radialGradient>
          <linearGradient id="windowFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.10)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.05)"/>
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea580c"/>
            <stop offset="100%" stopColor="#fdba74"/>
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#60a5fa"/>
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#d8b4fe"/>
          </linearGradient>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
          <filter id="bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26"/>
          </filter>
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="windowShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#ea580c" floodOpacity="0.18"/>
          </filter>
          <style>{`
            .float-root {
              transform-origin: 330px 240px;
              animation: float-sway 14s ease-in-out infinite;
            }
            .glow-pulse {
              animation: glow-breathe 6s ease-in-out infinite;
              transform-origin: 330px 240px;
            }

            .bar-1 { animation: bar-grow 5.5s ease-in-out infinite; transform-origin: bottom; }
            .bar-2 { animation: bar-grow 5.5s ease-in-out infinite 0.3s; transform-origin: bottom; }
            .bar-3 { animation: bar-grow 5.5s ease-in-out infinite 0.6s; transform-origin: bottom; }
            .bar-4 { animation: bar-grow 5.5s ease-in-out infinite 0.9s; transform-origin: bottom; }
            .bar-5 { animation: bar-grow 5.5s ease-in-out infinite 1.2s; transform-origin: bottom; }

            .line-draw { stroke-dasharray: 240; animation: draw-line 4.5s ease-in-out infinite; }
            .line-dot { animation: dot-pulse 2.2s ease-in-out infinite; }

            .donut-arc { animation: donut-grow 6.5s ease-in-out infinite; }

            .progress-1 { animation: prog-grow 5s ease-in-out infinite; }
            .progress-2 { animation: prog-grow 5s ease-in-out infinite 0.5s; }
            .progress-3 { animation: prog-grow 5s ease-in-out infinite 1s; }

            .status-blink { animation: blink 2.4s ease-in-out infinite; }
            .cursor-blink { animation: blink 1.2s step-end infinite; }

            @keyframes float-sway {
              0%, 100% { transform: rotate(-3.5deg) translateY(0px); }
              50%      { transform: rotate(2.5deg) translateY(-10px); }
            }
            @keyframes glow-breathe {
              0%, 100% { opacity: 0.55; }
              50%      { opacity: 0.9; }
            }
            @keyframes bar-grow {
              0%, 100% { transform: scaleY(0.55); }
              50%      { transform: scaleY(1); }
            }
            @keyframes draw-line {
              0%   { stroke-dashoffset: 240; }
              45%  { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes dot-pulse {
              0%, 100% { opacity: 0.6; r: 4; }
              50%      { opacity: 1; r: 6; }
            }
            @keyframes donut-grow {
              0%, 100% { stroke-dashoffset: var(--off-start, 0); }
              50%      { stroke-dashoffset: var(--off-end, 0); }
            }
            @keyframes prog-grow {
              0%, 100% { transform: scaleX(0.7); }
              50%      { transform: scaleX(1); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%      { opacity: 0.25; }
            }

            @media (prefers-reduced-motion: reduce) {
              .float-root, .glow-pulse, .bar-1, .bar-2, .bar-3, .bar-4, .bar-5,
              .line-draw, .line-dot, .donut-arc, .progress-1, .progress-2, .progress-3,
              .status-blink, .cursor-blink { animation: none; }
            }
          `}</style>
        </defs>

        <circle cx="330" cy="240" r="280" fill="url(#backGlow)" filter="url(#bigBlur)" className="glow-pulse"/>

        <g className="float-root">
          <rect x="90" y="70" width="480" height="340" rx="16" fill="url(#windowFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#windowShadow)"/>
          <rect x="90" y="70" width="480" height="36" rx="16" fill="rgba(249,115,22,0.08)"/>
          <rect x="90" y="98" width="480" height="8" fill="rgba(249,115,22,0.08)"/>
          <line x1="90" y1="106" x2="570" y2="106" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.3"/>
          <circle cx="112" cy="88" r="5" fill="#ef4444" fillOpacity="0.95"/>
          <circle cx="130" cy="88" r="5" fill="#eab308" fillOpacity="0.95"/>
          <circle cx="148" cy="88" r="5" fill="#22c55e" fillOpacity="0.95"/>
          <rect x="180" y="86" width="86" height="4" rx="2" fill="#fdba74" fillOpacity="0.5"/>
          <rect x="490" y="79" width="64" height="18" rx="9" fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="0.75" strokeOpacity="0.5"/>
          <circle cx="504" cy="88" r="3" fill="#10b981" className="status-blink" filter="url(#dotGlow)"/>
          <rect x="514" y="86" width="30" height="4" rx="2" fill="#fdba74" fillOpacity="0.6"/>

          <rect x="90" y="106" width="48" height="304" fill="rgba(249,115,22,0.05)"/>
          <line x1="138" y1="106" x2="138" y2="410" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.25"/>
          <rect x="104" y="130" width="20" height="20" rx="6" fill="rgba(59,130,246,0.18)" stroke="rgba(59,130,246,0.35)" strokeWidth="0.75"/>
          <g>
            <rect x="104" y="176" width="20" height="20" rx="6" fill="rgba(249,115,22,0.85)" stroke="#f97316" strokeWidth="0.75"/>
            <rect x="95" y="182" width="3" height="8" rx="1.5" fill="#f97316"/>
          </g>
          <rect x="104" y="222" width="20" height="20" rx="6" fill="rgba(168,85,247,0.18)" stroke="rgba(168,85,247,0.35)" strokeWidth="0.75"/>
          <rect x="104" y="268" width="20" height="20" rx="6" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.75"/>

          <rect x="152" y="120" width="196" height="132" rx="10" fill="rgba(249,115,22,0.06)" stroke="#fb923c" strokeWidth="0.6" strokeOpacity="0.3"/>
          <rect x="162" y="128" width="46" height="4" rx="2" fill="#fdba74" fillOpacity="0.5"/>
          <rect x="213.5" y="218" width="9" height="22" rx="2" fill="url(#barGrad)" className="bar-1"/>
          <rect x="229.5" y="206" width="9" height="34" rx="2" fill="url(#barGrad)" className="bar-2"/>
          <rect x="245.5" y="222" width="9" height="18" rx="2" fill="url(#purpleGrad)" className="bar-3"/>
          <rect x="261.5" y="200" width="9" height="40" rx="2" fill="url(#barGrad)" className="bar-4"/>
          <rect x="277.5" y="213" width="9" height="27" rx="2" fill="url(#barGrad)" className="bar-5"/>
          <line x1="162" y1="240" x2="338" y2="240" stroke="#fb923c" strokeWidth="0.5" strokeOpacity="0.3"/>

          <rect x="360" y="120" width="196" height="132" rx="10" fill="rgba(249,115,22,0.06)" stroke="#fb923c" strokeWidth="0.6" strokeOpacity="0.3"/>
          <rect x="370" y="128" width="50" height="4" rx="2" fill="#fdba74" fillOpacity="0.5"/>
          <path d="M 372 220 L 409.8 208 L 449.4 230 L 489 216 L 518.2 234 L 544 226" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="line-draw"/>
          <circle cx="544" cy="226" r="4" fill="#60a5fa" className="line-dot" filter="url(#dotGlow)"/>

          <rect x="152" y="264" width="196" height="132" rx="10" fill="rgba(249,115,22,0.06)" stroke="#fb923c" strokeWidth="0.6" strokeOpacity="0.3"/>
          <rect x="162" y="272" width="40" height="4" rx="2" fill="#fdba74" fillOpacity="0.5"/>
          <circle cx="250" cy="338" r="48" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="7"/>
          <circle cx="250" cy="338" r="48" fill="none" stroke="url(#donutGrad)" strokeWidth="7" strokeLinecap="round" strokeDasharray="301.6 301.6" transform="rotate(-90 250 338)" className="donut-arc" style={{ "--off-start": "114.6", "--off-end": "66.4" } as React.CSSProperties}/>
          <circle cx="250" cy="338" r="3" fill="#a855f7" filter="url(#dotGlow)"/>

          <rect x="360" y="264" width="196" height="132" rx="10" fill="rgba(249,115,22,0.06)" stroke="#fb923c" strokeWidth="0.6" strokeOpacity="0.3"/>
          <rect x="370" y="272" width="56" height="4" rx="2" fill="#fdba74" fillOpacity="0.5"/>
          <rect x="371" y="288" width="174" height="5" rx="2.5" fill="rgba(249,115,22,0.14)"/>
          <rect x="371" y="288" width="139.2" height="5" rx="2.5" fill="url(#barGrad)" className="progress-1" style={{ transformOrigin: "371px 290.5px" }}/>
          <rect x="371" y="305" width="174" height="5" rx="2.5" fill="rgba(249,115,22,0.14)"/>
          <rect x="371" y="305" width="95.7" height="5" rx="2.5" fill="url(#blueGrad)" className="progress-2" style={{ transformOrigin: "371px 307.5px" }}/>
          <rect x="371" y="322" width="174" height="5" rx="2.5" fill="rgba(249,115,22,0.14)"/>
          <rect x="371" y="322" width="60.9" height="5" rx="2.5" fill="url(#purpleGrad)" className="progress-3" style={{ transformOrigin: "371px 324.5px" }}/>

          <rect x="104" y="394" width="2" height="10" fill="#fdba74" className="cursor-blink"/>
          <rect x="112" y="397" width="70" height="3.5" rx="1.75" fill="#fb923c" fillOpacity="0.35"/>
        </g>
      </svg>
    </div>
  );
}
