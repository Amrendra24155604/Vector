"use client";

import React from "react";

export function AnimatedResumeAnalyzerLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 640 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI Resume Analyzer scanning laser document mark"
      >
        <title>AI Resume Analyzer — animated document scanner mark</title>

        <defs>
          <radialGradient id="analyzer-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.16)"/>
            <stop offset="55%" stopColor="rgba(194,65,12,0.08)"/>
            <stop offset="100%" stopColor="rgba(194,65,12,0)"/>
          </radialGradient>
          <linearGradient id="analyzer-sheetFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.11)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.04)"/>
          </linearGradient>
          <linearGradient id="analyzer-laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(249,115,22,0)"/>
            <stop offset="15%" stopColor="#fdba74"/>
            <stop offset="50%" stopColor="#f97316"/>
            <stop offset="85%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
          </linearGradient>
          <linearGradient id="analyzer-barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#fdba74"/>
          </linearGradient>
          <linearGradient id="analyzer-blueBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#60a5fa"/>
          </linearGradient>
          <linearGradient id="analyzer-blueGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#60a5fa"/>
          </linearGradient>
          <linearGradient id="analyzer-purpleBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#d8b4fe"/>
          </linearGradient>
          <linearGradient id="analyzer-purpleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#d8b4fe"/>
          </linearGradient>
          <linearGradient id="analyzer-donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
          <filter id="analyzer-bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26"/>
          </filter>
          <filter id="analyzer-softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
          <filter id="analyzer-dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="analyzer-laserGlow" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="analyzer-sheetShadow" x="-30%" y="-30%" width="160%" height="160%">
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
            .laser-sweep {
              animation: sweep 4.2s ease-in-out infinite;
              transform-origin: center;
            }
            .pulse-tag-1 { animation: tag-blink 3.5s ease-in-out infinite; }
            .pulse-tag-2 { animation: tag-blink 3.5s ease-in-out infinite 1.2s; }
            .pulse-tag-3 { animation: tag-blink 3.5s ease-in-out infinite 2.4s; }

            .text-line-1 { animation: line-glow 3s ease-in-out infinite 0.2s; }
            .text-line-2 { animation: line-glow 3s ease-in-out infinite 0.5s; }
            .text-line-3 { animation: line-glow 3s ease-in-out infinite 0.8s; }
            .text-line-4 { animation: line-glow 3s ease-in-out infinite 1.1s; }
            .text-line-5 { animation: line-glow 3s ease-in-out infinite 1.4s; }
            .text-line-6 { animation: line-glow 3s ease-in-out infinite 1.7s; }

            .donut-arc { animation: donut-grow 7s ease-in-out infinite; }
            .status-blink { animation: blink 2.2s ease-in-out infinite; }
            .node-blink { animation: blink 1.6s ease-in-out infinite; }

            .bar-grow-1 { animation: bar-scale 3.8s ease-in-out infinite; transform-origin: left; }
            .bar-grow-2 { animation: bar-scale 3.8s ease-in-out infinite 0.6s; transform-origin: left; }
            .bar-grow-3 { animation: bar-scale 3.8s ease-in-out infinite 1.2s; transform-origin: left; }

            @keyframes float-sway {
              0%, 100% { transform: rotate(-2.5deg) translateY(0px); }
              50%      { transform: rotate(2deg) translateY(-8px); }
            }
            @keyframes glow-breathe {
              0%, 100% { opacity: 0.55; }
              50%      { opacity: 0.9; }
            }
            @keyframes sweep {
              0%, 100% { transform: translateY(0px); opacity: 0.4; }
              50%      { transform: translateY(275px); opacity: 1; }
            }
            @keyframes tag-blink {
              0%, 100% { opacity: 0.4; transform: scale(0.96); }
              50%      { opacity: 0.95; transform: scale(1.04); }
            }
            @keyframes line-glow {
              0%, 100% { fill-opacity: 0.35; }
              50%      { fill-opacity: 0.85; }
            }
            @keyframes donut-grow {
              0%, 100% { stroke-dashoffset: 75.4; } /* 25% empty */
              50%      { stroke-dashoffset: 30.1; } /* 90% full */
            }
            @keyframes bar-scale {
              0%, 100% { transform: scaleX(0.55); }
              50%      { transform: scaleX(1); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%      { opacity: 0.25; }
            }

            @media (prefers-reduced-motion: reduce) {
              .float-root, .glow-pulse, .laser-sweep, .pulse-tag-1, .pulse-tag-2, .pulse-tag-3,
              .text-line-1, .text-line-2, .text-line-3, .text-line-4, .text-line-5, .text-line-6,
              .donut-arc, .status-blink, .node-blink, .bar-grow-1, .bar-grow-2, .bar-grow-3 {
                animation: none;
              }
            }
          `}</style>
        </defs>

        {/* Outer radial glow */}
        <circle cx="330" cy="240" r="280" fill="url(#analyzer-backGlow)" filter="url(#analyzer-bigBlur)" className="glow-pulse"/>

        <g className="float-root">
          {/* Main Resume Sheet */}
          <rect x="190" y="80" width="280" height="320" rx="14" fill="url(#analyzer-sheetFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#analyzer-sheetShadow)"/>
          
          {/* Resume Header (Avatar + Name lines) */}
          <rect x="214" y="104" width="36" height="36" rx="8" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="0.75" strokeOpacity="0.5"/>
          <circle cx="232" cy="118" r="6" fill="#60a5fa" fillOpacity="0.8"/>
          <path d="M 220 134 C 220 128, 244 128, 244 134" fill="none" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.8"/>

          <rect x="264" y="110" width="100" height="6" rx="3" fill="#fdba74" fillOpacity="0.7" className="text-line-1"/>
          <rect x="264" y="124" width="70" height="4" rx="2" fill="#fdba74" fillOpacity="0.45" className="text-line-2"/>

          {/* Divider Line */}
          <line x1="214" y1="154" x2="446" y2="154" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.25"/>

          {/* Text block lines representing experience sections */}
          <rect x="214" y="174" width="60" height="5" rx="2.5" fill="#f97316" fillOpacity="0.65"/>
          <rect x="214" y="190" width="210" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-3"/>
          <rect x="214" y="202" width="180" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-4"/>
          <rect x="214" y="214" width="120" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-5"/>

          <rect x="214" y="238" width="80" height="5" rx="2.5" fill="#f97316" fillOpacity="0.65"/>
          <rect x="214" y="254" width="220" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-6"/>
          <rect x="214" y="266" width="190" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-3"/>
          <rect x="214" y="278" width="140" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-4"/>

          <rect x="214" y="302" width="50" height="5" rx="2.5" fill="#f97316" fillOpacity="0.65"/>
          <rect x="214" y="318" width="170" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-5"/>
          <rect x="214" y="330" width="130" height="4" rx="2" fill="#fdba74" fillOpacity="0.4" className="text-line-6"/>

          {/* Interactive Parsing Highlights (simulating form scanner extracting fields) */}
          {/* Header Info Field Highlight */}
          <rect x="204" y="98" width="252" height="48" rx="5" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" fill="rgba(59,130,246,0.02)"/>
          <g>
            <rect x="210" y="93" width="34" height="10" rx="2" fill="#3b82f6"/>
            <rect x="214" y="96.5" width="26" height="3" rx="0.75" fill="#fff" fillOpacity="0.9"/>
          </g>

          {/* Work Experience Field Highlight */}
          <rect x="204" y="160" width="252" height="128" rx="5" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" fill="rgba(249,115,22,0.02)"/>
          <g>
            <rect x="210" y="155" width="46" height="10" rx="2" fill="#f97316"/>
            <rect x="214" y="158.5" width="38" height="3" rx="0.75" fill="#fff" fillOpacity="0.9"/>
          </g>

          {/* Skills Field Highlight */}
          <rect x="204" y="296" width="252" height="46" rx="5" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" fill="rgba(16,185,129,0.02)"/>
          <g>
            <rect x="210" y="291" width="30" height="10" rx="2" fill="#10b981"/>
            <rect x="214" y="294.5" width="22" height="3" rx="0.75" fill="#fff" fillOpacity="0.9"/>
          </g>

          {/* Left Widget 1: Floating Profile Form Panel (Top Left) */}
          <g className="pulse-tag-1" style={{ transformOrigin: "110px 155px" }}>
            <rect x="50" y="100" width="120" height="110" rx="10" fill="url(#analyzer-sheetFill)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.4" filter="url(#analyzer-sheetShadow)"/>
            {/* Header pill with tiny icon */}
            <circle cx="64" cy="116" r="3.5" fill="#f97316"/>
            <rect x="74" y="113" width="45" height="5.5" rx="2" fill="#f97316" fillOpacity="0.8"/>
            
            {/* Text input form box */}
            <rect x="62" y="130" width="96" height="20" rx="5" fill="rgba(249,115,22,0.08)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <rect x="70" y="138" width="36" height="4" rx="1" fill="#fdba74" fillOpacity="0.6"/>
            <line x1="112" y1="135" x2="112" y2="145" stroke="#fdba74" strokeWidth="1.25" className="status-blink"/>
            
            {/* Toggle switch control */}
            <rect x="62" y="164" width="30" height="4" rx="1" fill="#fdba74" fillOpacity="0.5"/>
            <rect x="124" y="160" width="22" height="11" rx="5.5" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="0.75" strokeOpacity="0.5"/>
            <circle cx="130" cy="165.5" r="3.5" fill="#60a5fa" className="node-blink"/>
            
            {/* Checked form checkbox */}
            <rect x="62" y="182" width="10" height="10" rx="2.5" fill="none" stroke="#10b981" strokeWidth="0.75" strokeOpacity="0.5"/>
            <path d="M 64.5 187 L 67 189.5 L 70.5 184" fill="none" stroke="#10b981" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="status-blink"/>
            <rect x="78" y="185" width="40" height="4" rx="1" fill="#fdba74" fillOpacity="0.5"/>
          </g>

          {/* Left Widget 2: Job Description Textarea Form Card (Bottom Left) */}
          <g className="pulse-tag-2" style={{ transformOrigin: "105px 285px" }}>
            <rect x="40" y="230" width="130" height="110" rx="10" fill="url(#analyzer-sheetFill)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.4" filter="url(#analyzer-sheetShadow)"/>
            {/* Header pill with tiny icon */}
            <circle cx="54" cy="246" r="3.5" fill="#f97316"/>
            <rect x="64" y="243" width="55" height="5.5" rx="2" fill="#f97316" fillOpacity="0.8"/>
            
            {/* Form Textarea box */}
            <rect x="52" y="260" width="106" height="50" rx="6" fill="rgba(249,115,22,0.08)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <rect x="60" y="268" width="90" height="3" rx="1" fill="#fdba74" fillOpacity="0.6" className="text-line-1"/>
            <rect x="60" y="276" width="75" height="3" rx="1" fill="#fdba74" fillOpacity="0.6" className="text-line-2"/>
            <rect x="60" y="284" width="80" height="3" rx="1" fill="#fdba74" fillOpacity="0.6" className="text-line-3"/>
            <rect x="142" y="283" width="1.5" height="5" rx="0.5" fill="#f97316" className="status-blink"/>
            
            {/* Toggle switch control */}
            <rect x="52" y="322" width="40" height="4" rx="1" fill="#fdba74" fillOpacity="0.5"/>
            <rect x="124" y="318" width="22" height="11" rx="5.5" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="0.75" strokeOpacity="0.5"/>
            <circle cx="140" cy="323.5" r="3.5" fill="#d8b4fe"/>
          </g>

          {/* Connection Lines from Left Form Panels */}
          <path d="M 170 155 L 187 155 C 195 155, 195 122, 204 122" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="2 3" fill="none"/>
          <path d="M 170 285 L 187 285 C 195 285, 195 224, 204 224" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="2 3" fill="none"/>

          {/* Glowing Match Score Donut (Right side) */}
          <g className="pulse-tag-3" style={{ transformOrigin: "520px 150px" }}>
            <circle cx="520" cy="150" r="40" fill="url(#analyzer-sheetFill)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.4" filter="url(#analyzer-sheetShadow)"/>
            <circle cx="520" cy="150" r="24" fill="none" stroke="rgba(249,115,22,0.12)" strokeWidth="5.5"/>
            <circle cx="520" cy="150" r="24" fill="none" stroke="url(#analyzer-donutGrad)" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="150.8 150.8" transform="rotate(-90 520 150)" className="donut-arc"/>
            <circle cx="520" cy="150" r="2.5" fill="#a855f7" filter="url(#analyzer-dotGlow)"/>
          </g>

          {/* Stats Bar Chart Widget (Right side) */}
          <g className="pulse-tag-1" style={{ transformOrigin: "520px 270px" }}>
            <rect x="490" y="230" width="70" height="85" rx="10" fill="url(#analyzer-sheetFill)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.4" filter="url(#analyzer-sheetShadow)"/>
            <rect x="502" y="280" width="6" height="20" rx="1.5" fill="url(#analyzer-barGrad)" className="bar-grow-1" style={{ transform: "rotate(-90deg)", transformOrigin: "502px 290px" }}/>
            <rect x="518" y="265" width="6" height="35" rx="1.5" fill="url(#analyzer-blueBarGrad)" className="bar-grow-2" style={{ transform: "rotate(-90deg)", transformOrigin: "518px 282.5px" }}/>
            <rect x="534" y="250" width="6" height="50" rx="1.5" fill="url(#analyzer-purpleBarGrad)" className="bar-grow-3" style={{ transform: "rotate(-90deg)", transformOrigin: "534px 275px" }}/>
          </g>

          {/* Connection Lines from Right Widgets */}
          <path d="M 470 180 L 490 160" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="2 3"/>
          <path d="M 470 270 L 490 270" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="2 3"/>

          {/* Moving Scanning Laser Line */}
          <g className="laser-sweep">
            <line x1="172" y1="92" x2="488" y2="92" stroke="url(#analyzer-laserGrad)" strokeWidth="3" filter="url(#analyzer-laserGlow)"/>
            <line x1="172" y1="92" x2="488" y2="92" stroke="#fef3e8" strokeWidth="0.75" strokeOpacity="0.8"/>
            <circle cx="172" cy="92" r="3.5" fill="#f97316" filter="url(#analyzer-dotGlow)"/>
            <circle cx="488" cy="92" r="3.5" fill="#f97316" filter="url(#analyzer-dotGlow)"/>
          </g>
        </g>

      </svg>
    </div>
  );
}
