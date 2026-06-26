"use client";

import React from "react";

export function AnimatedProgressLogo({ className = "" }: { className?: string }) {

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 880 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI Career Progress and Metrics Tracking Agent animation mark"
      >
        <title>AI Progress Dashboard — animated metric constellation mark</title>

        <defs>
          <radialGradient id="progress-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.15)"/>
            <stop offset="60%" stopColor="rgba(16,-185,129,0.06)"/>
            <stop offset="100%" stopColor="rgba(16,185,129,0)"/>
          </radialGradient>
          
          <linearGradient id="progress-growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="streak-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.14)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.02)"/>
          </linearGradient>
          <linearGradient id="streak-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.7)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
          </linearGradient>

          <linearGradient id="ats-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.14)"/>
            <stop offset="100%" stopColor="rgba(16,185,129,0.02)"/>
          </linearGradient>
          <linearGradient id="ats-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.7)"/>
            <stop offset="100%" stopColor="rgba(16,185,129,0.15)"/>
          </linearGradient>

          <linearGradient id="ats-scoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          
          <linearGradient id="console-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.35)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.35)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.35)" />
          </linearGradient>

          <filter id="progress-bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30"/>
          </filter>
          <filter id="progress-softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
          <filter id="progress-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="progress-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1e1b1a" floodOpacity="0.5"/>
          </filter>
          
          <style>{`
            .float-streak {
              animation: streak-float-anim 6s ease-in-out infinite;
            }
            .float-metrics {
              animation: metrics-float-anim 7s ease-in-out infinite 0.5s;
            }
            .float-stats-left {
              animation: stats-float-left-anim 5s ease-in-out infinite 1s;
            }
            .float-stats-right {
              animation: stats-float-right-anim 5s ease-in-out infinite 1.5s;
            }
            .float-param-1 {
              animation: param-float-anim-1 6.5s ease-in-out infinite;
            }
            .float-param-2 {
              animation: param-float-anim-2 7s ease-in-out infinite 0.8s;
            }
            .float-param-3 {
              animation: param-float-anim-3 6.8s ease-in-out infinite 1.2s;
            }
            .orbit-rotate-cw {
              animation: spin-cw 20s linear infinite;
            }
            .orbit-rotate-ccw {
              animation: spin-ccw 20s linear infinite;
            }
            .vector-pulse-fwd {
              stroke-dasharray: 12 35;
              animation: wave-flow-fwd 6s linear infinite;
            }
            .node-blink-orange { animation: blink 2.2s ease-in-out infinite; }
            .node-blink-cyan { animation: blink 1.8s ease-in-out infinite 0.6s; }
            .node-blink-blue { animation: blink 2s ease-in-out infinite 1.2s; }
            .node-blink-green { animation: blink 2.4s ease-in-out infinite 0.3s; }
            .bar-grow-1 { animation: bar-scale 3s ease-in-out infinite; }
            .bar-grow-2 { animation: bar-scale 3s ease-in-out infinite 0.6s; }
            .bar-grow-3 { animation: bar-scale 3s ease-in-out infinite 1.2s; }
            
            .text-line-1 { animation: flicker-anim 4s infinite; }
            .text-line-2 { animation: flicker-anim 4s infinite 1s; }
            .text-line-3 { animation: flicker-anim 4s infinite 2s; }
            .text-line-4 { animation: flicker-anim 4s infinite 3s; }

            .grid-sq {
              transition: fill 0.3s ease;
            }

            @keyframes streak-float-anim {
              0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
              50%      { transform: translateY(-7px) rotate(0.5deg); }
            }
            @keyframes metrics-float-anim {
              0%, 100% { transform: translateY(0px) rotate(0.5deg); }
              50%      { transform: translateY(-7px) rotate(-0.5deg); }
            }
            @keyframes stats-float-left-anim {
              0%, 100% { transform: translateY(0px) scale(1); }
              50%      { transform: translateY(-4px) scale(1.02); }
            }
            @keyframes stats-float-right-anim {
              0%, 100% { transform: translateY(0px) scale(1); }
              50%      { transform: translateY(-4px) scale(1.02); }
            }
            @keyframes param-float-anim-1 {
              0%, 100% { transform: translateY(0px); }
              50%      { transform: translateY(-4px); }
            }
            @keyframes param-float-anim-2 {
              0%, 100% { transform: translateY(0px); }
              50%      { transform: translateY(-5px); }
            }
            @keyframes param-float-anim-3 {
              0%, 100% { transform: translateY(0px); }
              50%      { transform: translateY(-3.5px); }
            }
            @keyframes spin-cw {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-ccw {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes wave-flow-fwd {
              to { stroke-dashoffset: -200; }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%      { opacity: 0.35; }
            }
            @keyframes bar-scale {
              0%, 100% { transform: scaleY(0.4); }
              50%      { transform: scaleY(1); }
            }
            @keyframes flicker-anim {
              0%, 100% { opacity: 0.85; }
              45%      { opacity: 0.85; }
              50%      { opacity: 0.25; }
              55%      { opacity: 0.85; }
            }

            @media (prefers-reduced-motion: reduce) {
              .float-streak, .float-metrics, .float-stats-left, .float-stats-right,
              .float-param-1, .float-param-2, .float-param-3,
              .orbit-rotate-cw, .orbit-rotate-ccw, .vector-pulse-fwd,
              .node-blink-orange, .node-blink-cyan, .node-blink-blue, .node-blink-green,
              .bar-grow-1, .bar-grow-2, .bar-grow-3,
              .text-line-1, .text-line-2, .text-line-3, .text-line-4 {
                animation: none;
              }
            }
          `}</style>
        </defs>

        {/* Backdrop radial glow */}
        <circle cx="440" cy="220" r="300" fill="url(#progress-backGlow)" filter="url(#progress-bigBlur)" opacity="0.6"/>

        {/* Symmetrical grid floor */}
        <g opacity="0.75">
          <line x1="140" y1="360" x2="740" y2="360" stroke="rgba(16,185,129,0.1)" strokeWidth="1"/>
          <line x1="100" y1="390" x2="780" y2="390" stroke="rgba(249,115,22,0.1)" strokeWidth="1"/>
          <line x1="440" y1="320" x2="140" y2="420" stroke="rgba(249,115,22,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="300" y2="420" stroke="rgba(168,85,247,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="440" y2="420" stroke="rgba(16,185,129,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="580" y2="420" stroke="rgba(168,85,247,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="740" y2="420" stroke="rgba(16,185,129,0.06)" strokeWidth="0.8"/>
        </g>

        {/* Central Diagonal Exponential Growth Vector Curve */}
        <g>
          {/* Static curve */}
          <path d="M 180 330 C 320 330, 440 110, 700 110" stroke="rgba(168,85,247,0.15)" strokeWidth="2.5" fill="none" />
          <path d="M 180 330 C 320 330, 440 110, 700 110" stroke="url(#progress-growthGrad)" strokeWidth="1.2" strokeDasharray="3 5" fill="none" />
          
          {/* Animated data pulses climbing the vector curve */}
          <path d="M 180 330 C 320 330, 440 110, 700 110" stroke="url(#progress-growthGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" className="vector-pulse-fwd" />
        </g>

        {/* Diagonal Wave Station Badges along the growth vector */}
        <g>
          {/* Badge 1: PREPARATION (x=300, y=280) */}
          <g transform="translate(290, 230)">
            <circle cx="15" cy="15" r="9" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4" fill="#f97316" className="node-blink-orange" />
            <text x="15" y="-2" fill="#fdba74" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PREP</text>
          </g>

          {/* Badge 2: INTERVIEW (x=380, y=200) */}
          <g transform="translate(365, 175)">
            <circle cx="15" cy="15" r="9" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4" fill="#a855f7" className="node-blink-blue" />
            <text x="15" y="-2" fill="#d8b4fe" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">INTVIEW</text>
          </g>

          {/* Badge 3: OUTREACH (x=495, y=140) */}
          <g transform="translate(485, 120)">
            <circle cx="15" cy="15" r="9" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4" fill="#06b6d4" className="node-blink-cyan" />
            <text x="15" y="32" fill="#a5f3fc" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OUTREACH</text>
          </g>

          {/* Badge 4: MATCHED (x=585, y=120) */}
          <g transform="translate(565, 95)">
            <circle cx="15" cy="15" r="9" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4" fill="#10b981" className="node-blink-green" />
            <text x="15" y="32" fill="#a7f3d0" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OFFER</text>
          </g>
        </g>

        {/* Center: Sys.Monitor Diagnostic Terminal Log Window */}
        <g>
          {/* Card container */}
          <rect x="350" y="48" width="180" height="66" rx="8" fill="rgba(20, 18, 17, 0.85)" stroke="url(#console-borderGrad)" strokeWidth="1.2" backdrop-filter="blur(6px)" filter="url(#outreach-shadow)" />
          {/* Header dots */}
          <circle cx="362" cy="56" r="2" fill="#ef4444" opacity="0.8" />
          <circle cx="368" cy="56" r="2" fill="#f59e0b" opacity="0.8" />
          <circle cx="374" cy="56" r="2" fill="#10b981" opacity="0.8" />
          <text x="522" y="58" fill="rgba(16,185,129,0.5)" fontSize="5.2" fontFamily="monospace" textAnchor="end">SCORE.TRACKER</text>
          
          {/* Animated Log Lines */}
          <text x="362" y="68" fill="#10b981" fontSize="5.5" fontFamily="monospace" className="text-line-1">&gt; SYNCING PREP GRID... OK</text>
          <text x="362" y="78" fill="#fb923c" fontSize="5.5" fontFamily="monospace" className="text-line-2">&gt; RESUME ATS MATRIX: 94%</text>
          <text x="362" y="88" fill="#a855f7" fontSize="5.5" fontFamily="monospace" className="text-line-3">&gt; FUNNEL: Saved-Applied-Interview</text>
          <text x="362" y="98" fill="#60a5fa" fontSize="5.5" fontFamily="monospace" className="text-line-4">&gt; COMPILING METRIC INDEX...</text>
        </g>

        {/* Central AI Analytics Hub / Gateway */}
        <g>
          {/* Outer rotating dashboard ring */}
          <circle cx="440" cy="220" r="28" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="8 6" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Inner counter-rotating dashboard ring */}
          <circle cx="440" cy="220" r="20" stroke="#10b981" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="4 4" fill="none" className="orbit-rotate-ccw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Central core node */}
          <circle cx="440" cy="220" r="11" fill="url(#progress-growthGrad)" opacity="0.55" filter="url(#progress-softBlur)" />
          <circle cx="440" cy="220" r="5.5" fill="#fff" filter="url(#progress-glow)" className="node-blink-green" />

          {/* Floating Growth Tag above core */}
          <g transform="translate(410, 172)">
            <rect x="0" y="0" width="60" height="15" rx="3.5" fill="rgba(24, 22, 21, 0.85)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
            <text x="30" y="10" fill="#10b981" fontSize="6.2" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GROWTH: +24%</text>
          </g>
          
          {/* Dash connection lines linking matrices */}
          <line x1="330" y1="220" x2="412" y2="220" stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="468" y1="220" x2="550" y2="220" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="2 3" />
        </g>

        {/* Left Side: Activity Streaks Nexus (Centered at 260, 220) */}
        <g className="float-streak" style={{ transformOrigin: '260px 220px' }}>
          {/* Corner tech scope brackets */}
          <path d="M 180 142 L 180 132 L 190 132" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 340 142 L 340 132 L 330 132" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 180 298 L 180 308 L 190 308" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 340 298 L 340 308 L 330 308" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />

          {/* Orbital Circle & Satellite */}
          <ellipse cx="260" cy="220" rx="90" ry="35" stroke="rgba(249,115,22,0.12)" strokeWidth="1" strokeDasharray="3 6" fill="none" className="orbit-rotate-ccw" style={{ transformOrigin: '260px 220px' }} />
          <g className="orbit-rotate-ccw" style={{ transformOrigin: '260px 220px' }}>
            <circle cx="350" cy="220" r="3.2" fill="#f97316" filter="url(#progress-glow)" />
          </g>

          {/* Glassmorphic Background Panel */}
          <rect x="190" y="150" width="140" height="140" rx="16" fill="url(#streak-panelFill)" stroke="url(#streak-borderGrad)" strokeWidth="1.5" filter="url(#progress-shadow)" />
          
          {/* GitHub Prep matrix grid (5x5 squares) */}
          <g transform="translate(212, 172)">
            {/* Row 1 */}
            <rect x="0" y="0" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.8" className="grid-sq" />
            <rect x="18" y="0" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.2" />
            <rect x="36" y="0" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.5" className="grid-sq" />
            <rect x="54" y="0" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.8" className="grid-sq" />
            <rect x="72" y="0" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.1" />

            {/* Row 2 */}
            <rect x="0" y="18" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.3" />
            <rect x="18" y="18" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.9" className="grid-sq" />
            <rect x="36" y="18" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.4" />
            <rect x="54" y="18" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.2" />
            <rect x="72" y="18" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.7" className="grid-sq" />

            {/* Row 3 */}
            <rect x="0" y="36" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.6" className="grid-sq" />
            <rect x="18" y="36" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.1" />
            <rect x="36" y="36" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.8" className="grid-sq" />
            <rect x="54" y="36" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.9" className="grid-sq" />
            <rect x="72" y="36" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.3" />

            {/* Row 4 */}
            <rect x="0" y="54" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.2" />
            <rect x="18" y="54" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.5" className="grid-sq" />
            <rect x="36" y="54" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.1" />
            <rect x="54" y="54" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.7" className="grid-sq" />
            <rect x="72" y="54" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.9" className="grid-sq" />

            {/* Row 5 */}
            <rect x="0" y="72" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.8" className="grid-sq" />
            <rect x="18" y="72" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.9" className="grid-sq" />
            <rect x="36" y="72" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.4" />
            <rect x="54" y="72" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.2" />
            <rect x="72" y="72" width="14" height="14" rx="2" fill="#f97316" fillOpacity="0.8" className="grid-sq" />
          </g>
        </g>

        {/* Left Side Parameter Cartridges (Streaks parameters) */}
        {/* TONE module */}
        <g className="float-param-1">
          <rect x="215" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="222" cy="79" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="82.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">STREAK</text>
          <line x1="242" y1="88" x2="255" y2="150" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* TARGET module */}
        <g className="float-param-3">
          <rect x="215" y="350" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="222" cy="359" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="362.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">DAILY</text>
          <line x1="245" y1="350" x2="255" y2="290" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        
        {/* Floating Streak Badge: 7 DAYS */}
        <g className="float-param-2">
          <rect x="175" y="115" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.85)" stroke="rgba(249,115,22,0.35)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="183" cy="124" r="2.5" fill="#ea580c" className="node-blink-orange" />
          <text x="191" y="127" fill="#fdba74" fontSize="6" fontWeight="bold" fontFamily="monospace">7 DAYS</text>
        </g>

        {/* Right Side: ATS Target Scope Console (Centered at 620, 220) */}
        <g className="float-metrics" style={{ transformOrigin: '620px 220px' }}>
          {/* Corner tech scope brackets */}
          <path d="M 540 142 L 540 132 L 550 132" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 142 L 700 132 L 690 132" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 540 298 L 540 308 L 550 308" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 298 L 700 308 L 690 308" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" fill="none" />

          {/* Glassmorphic Background Panel */}
          <circle cx="620" cy="220" r="70" fill="url(#ats-panelFill)" stroke="url(#ats-borderGrad)" strokeWidth="1.5" filter="url(#progress-shadow)" />
          
          {/* Scope orbit rings & Satellite node */}
          <circle cx="620" cy="220" r="54" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="3 7" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }} />
          <g className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }}>
            <circle cx="674" cy="220" r="3.2" fill="#10b981" filter="url(#progress-glow)" />
          </g>

          {/* Concentric Progress Score Dial */}
          <circle cx="620" cy="220" r="44" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="5.5" />
          <circle cx="620" cy="220" r="44" fill="none" stroke="url(#ats-scoreGrad)" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="276" strokeDashoffset="45" transform="rotate(-90 620 220)" />

          {/* Targeting Scope crosshairs */}
          <line x1="595" y1="220" x2="645" y2="220" stroke="rgba(16,185,129,0.22)" strokeWidth="0.8" />
          <line x1="620" y1="195" x2="620" y2="245" stroke="rgba(16,185,129,0.22)" strokeWidth="0.8" />
          <circle cx="620" cy="220" r="28" fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth="0.8" strokeDasharray="2 3" />
          
          {/* Dial Center Rating text */}
          <text x="620" y="216" fill="#fff" fontSize="12.5" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">94%</text>
          <text x="620" y="228" fill="#10b981" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ATS SCORE</text>
        </g>

        {/* Right Side Parameter Cartridges */}
        {/* RESUME module */}
        <g className="float-param-2">
          <rect x="610" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="617" cy="79" r="2" fill="#10b981" className="node-blink-green" />
          <text x="625" y="82.5" fill="#a7f3d0" fontSize="6.2" fontWeight="bold" fontFamily="monospace">RESUME</text>
          <line x1="637" y1="88" x2="615" y2="150" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* SCORE module */}
        <g className="float-param-1">
          <rect x="610" y="350" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="617" cy="359" r="2" fill="#10b981" className="node-blink-green" />
          <text x="625" y="362.5" fill="#a7f3d0" fontSize="6.2" fontWeight="bold" fontFamily="monospace">SCORES</text>
          <line x1="635" y1="350" x2="615" y2="290" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>

        {/* Left Floating Funnel Stats Card */}
        <g className="float-stats-left" style={{ transformOrigin: '215px 335px' }}>
          <rect x="180" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(251,146,60,0.25)" strokeWidth="1" backdrop-filter="blur(4px)" />
          <text x="188" y="324" fill="#f97316" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">FUNNEL</text>
          <text x="188" y="337" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="system-ui, sans-serif">SAVED ➔ APPL</text>
          <path d="M 188 349 L 202 346 L 215 350 L 230 344 L 242 347" stroke="#fb923c" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Right Floating Conversion Stats Card */}
        <g className="float-stats-right" style={{ transformOrigin: '645px 335px' }}>
          <rect x="610" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" backdrop-filter="blur(4px)" />
          <text x="618" y="324" fill="#10b981" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">CONVERT</text>
          <text x="618" y="337" fill="#fff" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">14.8%</text>
          
          {/* Mini animating bar graph */}
          <rect x="618" y="347" width="5" height="8" rx="1" fill="#10b981" className="bar-grow-1" style={{ transformOrigin: '620px 355px' }} />
          <rect x="627" y="345" width="5" height="10" rx="1" fill="#34d399" className="bar-grow-2" style={{ transformOrigin: '629px 355px' }} />
          <rect x="636" y="343" width="5" height="12" rx="1" fill="#6ee7b7" className="bar-grow-3" style={{ transformOrigin: '638px 355px' }} />
          <rect x="645" y="346" width="5" height="9" rx="1" fill="#10b981" className="bar-grow-1" style={{ transformOrigin: '647px 355px' }} />
        </g>

        {/* Diagnostic Telemetry Logs */}
        <g opacity="0.65">
          {/* Top Left */}
          <text x="180" y="75" fill="#f97316" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[TRACKING_SYS // READY]</text>
          <text x="180" y="87" fill="#fb923c" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[KPI.A // DAILY_PREP]</text>
          
          {/* Bottom Right */}
          <text x="590" y="375" fill="#10b981" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[KPI.B // ATS_COMPLIANCE]</text>
          <text x="590" y="387" fill="#34d399" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[CONVERSION // SYNC: OK]</text>
          
          {/* Bottom Center Compiling indicator */}
          <text x="440" y="415" fill="#a855f7" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px" textAnchor="middle" opacity="0.8">METRIC ANALYSIS COMPLETE: 94%</text>
        </g>

        {/* Small floating sparkles / ambient nodes */}
        <g opacity="0.8">
          <circle cx="210" cy="110" r="1.5" fill="#fdba74" className="node-blink-orange" />
          <circle cx="340" cy="120" r="1" fill="#f97316" />
          <circle cx="530" cy="90" r="1.5" fill="#a7f3d0" className="node-blink-green" />
          <circle cx="670" cy="120" r="1.2" fill="#6ee7b7" className="node-blink-cyan" />
          <circle cx="300" cy="330" r="1" fill="#fdba74" />
          <circle cx="560" cy="340" r="1.5" fill="#a7f3d0" />
        </g>
      </svg>
    </div>
  );
}
