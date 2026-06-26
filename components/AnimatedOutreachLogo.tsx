"use client";

import React from "react";

export function AnimatedOutreachLogo({ className = "" }: { className?: string }) {

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 880 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI Cold Email and LinkedIn Outreach Agent animation mark"
      >
        <title>AI Outreach Agent — animated communication constellation mark</title>

        <defs>
          <radialGradient id="outreach-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.15)"/>
            <stop offset="60%" stopColor="rgba(59,130,246,0.06)"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0)"/>
          </radialGradient>
          <linearGradient id="outreach-laserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="outreach-laserRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.7)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.7)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.7)" />
          </linearGradient>
          <linearGradient id="email-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.14)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.02)"/>
          </linearGradient>
          <linearGradient id="email-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.7)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
          </linearGradient>
          <linearGradient id="linkedin-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.14)"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.02)"/>
          </linearGradient>
          <linearGradient id="linkedin-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.7)"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.15)"/>
          </linearGradient>
          <linearGradient id="outreach-waveGradOrangeToBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="outreach-waveGradBlueToOrange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="console-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.35)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.35)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.35)" />
          </linearGradient>

          <filter id="outreach-bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30"/>
          </filter>
          <filter id="outreach-softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
          <filter id="outreach-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="outreach-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1e1b1a" floodOpacity="0.5"/>
          </filter>
          
          <style>{`
            .float-email {
              animation: email-float-anim 6s ease-in-out infinite;
            }
            .float-network {
              animation: network-float-anim 7s ease-in-out infinite 0.5s;
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
            .email-sheet-anim {
              animation: sheet-slide-anim 8s ease-in-out infinite;
            }
            .laser-scanner-ring-1 {
              animation: scan-move-1 4.5s ease-in-out infinite;
            }
            .laser-scanner-ring-2 {
              animation: scan-move-2 4.5s ease-in-out infinite 0.75s;
            }
            .orbit-rotate-cw {
              animation: spin-cw 20s linear infinite;
            }
            .orbit-rotate-ccw {
              animation: spin-ccw 20s linear infinite;
            }
            .data-pulse-fwd {
              stroke-dasharray: 12 35;
              animation: wave-flow-fwd 6s linear infinite;
            }
            .data-pulse-rev {
              stroke-dasharray: 12 35;
              animation: wave-flow-rev 6s linear infinite;
            }
            .laser-data-stream-1 {
              animation: laser-stream-move-1 5s linear infinite;
            }
            .laser-data-stream-2 {
              animation: laser-stream-move-2 5s linear infinite 2.5s;
            }
            .oscilloscope-wave {
              stroke-dasharray: 10 90;
              animation: wave-flow-rev 5s linear infinite;
            }
            .node-blink-orange { animation: blink 2.2s ease-in-out infinite; }
            .node-blink-cyan { animation: blink 1.8s ease-in-out infinite 0.6s; }
            .node-blink-blue { animation: blink 2s ease-in-out infinite 1.2s; }
            .bar-grow-1 { animation: bar-scale 3s ease-in-out infinite; }
            .bar-grow-2 { animation: bar-scale 3s ease-in-out infinite 0.6s; }
            .bar-grow-3 { animation: bar-scale 3s ease-in-out infinite 1.2s; }
            
            .text-line-1 { animation: flicker-anim 4s infinite; }
            .text-line-2 { animation: flicker-anim 4s infinite 1s; }
            .text-line-3 { animation: flicker-anim 4s infinite 2s; }
            .text-line-4 { animation: flicker-anim 4s infinite 3s; }

            @keyframes email-float-anim {
              0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
              50%      { transform: translateY(-7px) rotate(0.5deg); }
            }
            @keyframes network-float-anim {
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
            @keyframes sheet-slide-anim {
              0%, 100% { transform: translateY(0px); }
              50%      { transform: translateY(-14px); }
            }
            @keyframes scan-move-1 {
              0%, 100% { transform: translateY(-130px); opacity: 0.25; }
              50%      { transform: translateY(130px); opacity: 0.85; }
            }
            @keyframes scan-move-2 {
              0%, 100% { transform: translateY(130px); opacity: 0.85; }
              50%      { transform: translateY(-130px); opacity: 0.25; }
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
            @keyframes wave-flow-rev {
              to { stroke-dashoffset: 200; }
            }
            @keyframes laser-stream-move-1 {
              0%   { transform: translateY(-105px); opacity: 0; }
              15%, 85% { opacity: 0.8; }
              100% { transform: translateY(105px); opacity: 0; }
            }
            @keyframes laser-stream-move-2 {
              0%   { transform: translateY(-105px); opacity: 0; }
              15%, 85% { opacity: 0.8; }
              100% { transform: translateY(105px); opacity: 0; }
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
              .float-email, .float-network, .float-stats-left, .float-stats-right,
              .float-param-1, .float-param-2, .float-param-3,
              .email-sheet-anim, .laser-scanner-ring-1, .laser-scanner-ring-2,
              .orbit-rotate-cw, .orbit-rotate-ccw, .data-pulse-fwd, .data-pulse-rev,
              .node-blink-orange, .node-blink-cyan, .node-blink-blue,
              .bar-grow-1, .bar-grow-2, .bar-grow-3,
              .text-line-1, .text-line-2, .text-line-3, .text-line-4,
              .laser-data-stream-1, .laser-data-stream-2, .oscilloscope-wave {
                animation: none;
              }
            }
          `}</style>
        </defs>

        {/* Backdrop radial glow */}
        <circle cx="440" cy="220" r="300" fill="url(#outreach-backGlow)" filter="url(#outreach-bigBlur)" opacity="0.6"/>

        {/* Symmetrical grid floor */}
        <g opacity="0.75">
          <line x1="140" y1="360" x2="740" y2="360" stroke="rgba(249,115,22,0.12)" strokeWidth="1"/>
          <line x1="100" y1="390" x2="780" y2="390" stroke="rgba(59,130,246,0.1)" strokeWidth="1"/>
          <line x1="440" y1="320" x2="140" y2="420" stroke="rgba(249,115,22,0.08)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="300" y2="420" stroke="rgba(168,85,247,0.08)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="440" y2="420" stroke="rgba(168,85,247,0.08)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="580" y2="420" stroke="rgba(168,85,247,0.08)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="740" y2="420" stroke="rgba(59,130,246,0.08)" strokeWidth="0.8"/>
        </g>

        {/* Central Vertical Laser Conduit (x = 440) */}
        <g>
          {/* Laser beam */}
          <line x1="440" y1="50" x2="440" y2="390" stroke="url(#outreach-laserGrad)" strokeWidth="3" opacity="0.8" filter="url(#outreach-glow)" />
          <line x1="440" y1="50" x2="440" y2="390" stroke="#a855f7" strokeWidth="8" opacity="0.15" filter="url(#outreach-bigBlur)" />
          
          {/* Scanning rings */}
          <ellipse cx="440" cy="220" rx="36" ry="9" stroke="url(#outreach-laserRingGrad)" strokeWidth="1.5" fill="none" className="laser-scanner-ring-1" style={{ transformOrigin: '440px 220px' }} />
          <ellipse cx="440" cy="220" rx="22" ry="6" stroke="#3b82f6" strokeWidth="1.2" fill="none" className="laser-scanner-ring-2" style={{ transformOrigin: '440px 220px' }} />
        </g>

        {/* Curved Bezier Transmission Signal Waves */}
        <g>
          {/* Top Wave */}
          <path d="M 330 180 Q 440 130 550 180" stroke="rgba(168,85,247,0.12)" strokeWidth="1.5" fill="none" />
          <path d="M 330 180 Q 440 130 550 180" stroke="url(#outreach-waveGradOrangeToBlue)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="data-pulse-fwd" />
          
          {/* Middle Oscilloscope Frequency Wave */}
          <path d="M 330 220 H 370 L 378 202 L 386 238 L 394 220 H 425 Q 440 235 455 220 H 486 L 494 202 L 502 238 L 510 220 H 550" stroke="rgba(168,85,247,0.18)" strokeWidth="1.5" fill="none" />
          <path d="M 330 220 H 370 L 378 202 L 386 238 L 394 220 H 425 Q 440 235 455 220 H 486 L 494 202 L 502 238 L 510 220 H 550" stroke="url(#outreach-waveGradBlueToOrange)" strokeWidth="2" strokeLinecap="round" fill="none" className="oscilloscope-wave" />

          {/* Bottom Wave */}
          <path d="M 330 260 Q 440 310 550 260" stroke="rgba(168,85,247,0.12)" strokeWidth="1.5" fill="none" />
          <path d="M 330 260 Q 440 310 550 260" stroke="url(#outreach-waveGradOrangeToBlue)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="data-pulse-fwd" />
        </g>

        {/* Central AI Router Matrix Hub (Inter-Console Gateway) */}
        <g>
          {/* Outer rotating dashboard ring */}
          <circle cx="440" cy="220" r="26" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="8 6" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Inner counter-rotating dashboard ring */}
          <circle cx="440" cy="220" r="18" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="4 4" fill="none" className="orbit-rotate-ccw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Central AI core junction nodes */}
          <circle cx="440" cy="220" r="11" fill="url(#outreach-laserGrad)" opacity="0.55" filter="url(#outreach-softBlur)" />
          <circle cx="440" cy="220" r="5" fill="#fff" filter="url(#outreach-glow)" className="node-blink-orange" />
          
          {/* Connecting lines from Central Matrix Hub to left & right consoles */}
          <line x1="330" y1="220" x2="414" y2="220" stroke="rgba(249,115,22,0.35)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="466" y1="220" x2="550" y2="220" stroke="rgba(59,130,246,0.35)" strokeWidth="1" strokeDasharray="2 3" />
        </g>

        {/* Vertical Data Streams along Laser Conduit */}
        <g className="laser-data-stream-1" style={{ transformOrigin: '440px 220px' }}>
          <text x="446" y="220" fill="#a855f7" fontSize="5.5" fontFamily="monospace" fontWeight="bold">0xFD</text>
        </g>
        <g className="laser-data-stream-2" style={{ transformOrigin: '440px 220px' }}>
          <text x="446" y="220" fill="#3b82f6" fontSize="5.5" fontFamily="monospace" fontWeight="bold">SYNC</text>
        </g>

        {/* Bridge Station Pipeline Badges along the waves */}
        <g>
          {/* Badges on Top Wave */}
          {/* Node 1: DRAFT (Orange/Amber theme) */}
          <g transform="translate(381, 144)">
            <circle cx="15" cy="15" r="10" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#f97316" className="node-blink-orange" />
            <text x="15" y="-1.5" fill="#fdba74" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DRAFT</text>
          </g>

          {/* Node 2: SENT (Purple/Pink theme) */}
          <g transform="translate(469, 144)">
            <circle cx="15" cy="15" r="10" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#a855f7" className="node-blink-blue" />
            <text x="15" y="-1.5" fill="#d8b4fe" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SENT</text>
          </g>

          {/* Badges on Bottom Wave */}
          {/* Node 3: DELIVERED (Cyan theme) */}
          <g transform="translate(381, 266)">
            <circle cx="15" cy="15" r="10" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#06b6d4" className="node-blink-cyan" />
            <text x="15" y="32" fill="#a5f3fc" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DELIV</text>
          </g>

          {/* Node 4: REPLIED (Blue theme) */}
          <g transform="translate(469, 266)">
            <circle cx="15" cy="15" r="10" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#3b82f6" className="node-blink-blue" />
            <text x="15" y="32" fill="#93c5fd" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">REPLY</text>
          </g>
        </g>

        {/* Center: Holographic Terminal Code/Log Window */}
        <g>
          {/* Card container */}
          <rect x="350" y="48" width="180" height="66" rx="8" fill="rgba(20, 18, 17, 0.85)" stroke="url(#console-borderGrad)" strokeWidth="1.2" filter="url(#outreach-shadow)" />
          {/* Header dots */}
          <circle cx="362" cy="56" r="2" fill="#ef4444" opacity="0.8" />
          <circle cx="368" cy="56" r="2" fill="#f59e0b" opacity="0.8" />
          <circle cx="374" cy="56" r="2" fill="#10b981" opacity="0.8" />
          <text x="522" y="58" fill="rgba(168,85,247,0.5)" fontSize="5.2" fontFamily="monospace" textAnchor="end">SYS.MONITOR</text>
          
          {/* Animated Log Lines */}
          <text x="362" y="68" fill="#a855f7" fontSize="5.5" fontFamily="monospace" className="text-line-1">&gt; INIT OUTREACH ENGINE... OK</text>
          <text x="362" y="78" fill="#fb923c" fontSize="5.5" fontFamily="monospace" className="text-line-2">&gt; CONFIG CHANNELS: ACTIVE</text>
          <text x="362" y="88" fill="#60a5fa" fontSize="5.5" fontFamily="monospace" className="text-line-3">&gt; SYNC PROFILE TARGET... DONE</text>
          <text x="362" y="98" fill="#4ade80" fontSize="5.5" fontFamily="monospace" className="text-line-4">&gt; ENGAGING DATA CONDUITS...</text>
        </g>

        {/* Left Side: Cold Email Console (Centered at 260, 220) */}
        <g className="float-email" style={{ transformOrigin: '260px 220px' }}>
          {/* Corner tech scope brackets */}
          <path d="M 180 142 L 180 132 L 190 132" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 340 142 L 340 132 L 330 132" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 180 298 L 180 308 L 190 308" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 340 298 L 340 308 L 330 308" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" fill="none" />

          {/* Orbital Circle & Satellite */}
          <ellipse cx="260" cy="220" rx="90" ry="35" stroke="rgba(249,115,22,0.12)" strokeWidth="1" strokeDasharray="3 6" fill="none" className="orbit-rotate-ccw" style={{ transformOrigin: '260px 220px' }} />
          <g className="orbit-rotate-ccw" style={{ transformOrigin: '260px 220px' }}>
            <circle cx="350" cy="220" r="3.2" fill="#f97316" filter="url(#outreach-glow)" />
          </g>

          {/* Glassmorphic Background Panel */}
          <rect x="190" y="150" width="140" height="140" rx="16" fill="url(#email-panelFill)" stroke="url(#email-borderGrad)" strokeWidth="1.5" filter="url(#outreach-shadow)" />
          
          {/* Sliding Document Sheet */}
          <g className="email-sheet-anim" style={{ transformOrigin: '260px 190px' }}>
            <rect x="210" y="120" width="100" height="85" rx="6" fill="rgba(251,146,60,0.06)" stroke="rgba(251,146,60,0.25)" strokeWidth="1" />
            {/* Glowing Text Lines */}
            <line x1="222" y1="135" x2="275" y2="135" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="222" y1="147" x2="295" y2="147" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
            <line x1="222" y1="159" x2="265" y2="159" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
            <line x1="222" y1="171" x2="288" y2="171" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="222" y1="183" x2="250" y2="183" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Lower Envelope Cover Body (Overlays sliding text sheet) */}
          <path d="M 190 205 L 190 290 L 330 290 L 330 205 Z" fill="url(#email-panelFill)" opacity="0.92" />
          {/* Envelope Edges & Folds */}
          <path d="M 190 205 L 260 245 L 330 205" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 190 290 L 260 245 L 330 290" stroke="rgba(249,115,22,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          
          {/* Concentric diagnostic circle at seal */}
          <circle cx="260" cy="245" r="7" fill="none" stroke="rgba(249,115,22,0.2)" strokeWidth="1" />
          <circle cx="260" cy="245" r="4.5" fill="#f97316" filter="url(#outreach-glow)" className="node-blink-orange" />
        </g>

        {/* Left Side Parameter Cartridges (Data inputs feeding console) */}
        {/* TONE module */}
        <g className="float-param-1">
          <rect x="215" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#outreach-shadow)" />
          <circle cx="222" cy="79" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="82.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">TONE</text>
          <line x1="242" y1="88" x2="255" y2="150" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* SUBJECT module */}
        <g className="float-param-3">
          <rect x="215" y="350" width="60" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#outreach-shadow)" />
          <circle cx="222" cy="359" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="362.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">SUBJECT</text>
          <line x1="245" y1="350" x2="255" y2="290" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>

        {/* Right Side: LinkedIn Network Dome Console (Centered at 620, 220) */}
        <g className="float-network" style={{ transformOrigin: '620px 220px' }}>
          {/* Corner tech scope brackets */}
          <path d="M 540 142 L 540 132 L 550 132" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 142 L 700 132 L 690 132" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 540 298 L 540 308 L 550 308" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 298 L 700 308 L 690 308" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" fill="none" />

          {/* Glassmorphic Background Panel */}
          <circle cx="620" cy="220" r="70" fill="url(#linkedin-panelFill)" stroke="url(#linkedin-borderGrad)" strokeWidth="1.5" filter="url(#outreach-shadow)" />
          
          {/* Orbit rings & Satellite node */}
          <circle cx="620" cy="220" r="54" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="3 7" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }} />
          <g className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }}>
            <circle cx="674" cy="220" r="3.2" fill="#06b6d4" filter="url(#outreach-glow)" />
          </g>
          
          {/* Network Connection Lines */}
          <line x1="620" y1="220" x2="590" y2="190" stroke="rgba(96,165,250,0.45)" strokeWidth="1.2" />
          <line x1="620" y1="220" x2="655" y2="195" stroke="rgba(96,165,250,0.45)" strokeWidth="1.2" />
          <line x1="620" y1="220" x2="585" y2="245" stroke="rgba(96,165,250,0.45)" strokeWidth="1.2" />
          <line x1="620" y1="220" x2="650" y2="248" stroke="rgba(96,165,250,0.45)" strokeWidth="1.2" />
          
          {/* User/Central Node */}
          <circle cx="620" cy="220" r="7.5" fill="#3b82f6" stroke="#fff" strokeWidth="1" filter="url(#outreach-glow)" />

          {/* Connection Targets (Pulsing recruiter nodes) */}
          <circle cx="590" cy="190" r="4.5" fill="#06b6d4" stroke="#93c5fd" strokeWidth="0.8" className="node-blink-cyan" />
          <circle cx="655" cy="195" r="4" fill="#06b6d4" stroke="#93c5fd" strokeWidth="0.8" className="node-blink-blue" />
          <circle cx="585" cy="245" r="4.5" fill="#06b6d4" stroke="#93c5fd" strokeWidth="0.8" className="node-blink-blue" />
          <circle cx="650" cy="248" r="5" fill="#06b6d4" stroke="#93c5fd" strokeWidth="0.8" className="node-blink-cyan" />
        </g>

        {/* Right Side Parameter Cartridges */}
        {/* TARGET module */}
        <g className="float-param-2">
          <rect x="610" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" filter="url(#outreach-shadow)" />
          <circle cx="617" cy="79" r="2" fill="#3b82f6" className="node-blink-blue" />
          <text x="625" y="82.5" fill="#93c5fd" fontSize="6.2" fontWeight="bold" fontFamily="monospace">TARGET</text>
          <line x1="637" y1="88" x2="615" y2="150" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* CONTEXT module */}
        <g className="float-param-1">
          <rect x="605" y="350" width="60" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" filter="url(#outreach-shadow)" />
          <circle cx="612" cy="359" r="2" fill="#3b82f6" className="node-blink-blue" />
          <text x="620" y="362.5" fill="#93c5fd" fontSize="6.2" fontWeight="bold" fontFamily="monospace">CONTEXT</text>
          <line x1="635" y1="350" x2="615" y2="290" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>

        {/* Left Floating Email Stats Card */}
        <g className="float-stats-left" style={{ transformOrigin: '215px 335px' }}>
          <rect x="180" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(251,146,60,0.25)" strokeWidth="1" />
          <text x="188" y="324" fill="#f97316" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">DELIVERY</text>
          <text x="188" y="337" fill="#fff" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">99.2%</text>
          <path d="M 188 348 L 202 344 L 215 349 L 230 343 L 242 346" stroke="#22c55e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Right Floating LinkedIn Stats Card */}
        <g className="float-stats-right" style={{ transformOrigin: '645px 335px' }}>
          <rect x="610" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />
          <text x="618" y="324" fill="#3b82f6" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">RESPONSE</text>
          <text x="618" y="337" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="system-ui, sans-serif">A+ INDEX</text>
          
          {/* Mini animating bar graph */}
          <rect x="618" y="347" width="5" height="8" rx="1" fill="#3b82f6" className="bar-grow-1" style={{ transformOrigin: '620px 355px' }} />
          <rect x="627" y="345" width="5" height="10" rx="1" fill="#60a5fa" className="bar-grow-2" style={{ transformOrigin: '629px 355px' }} />
          <rect x="636" y="343" width="5" height="12" rx="1" fill="#93c5fd" className="bar-grow-3" style={{ transformOrigin: '638px 355px' }} />
          <rect x="645" y="346" width="5" height="9" rx="1" fill="#3b82f6" className="bar-grow-1" style={{ transformOrigin: '647px 355px' }} />
        </g>

        {/* Diagnostic Telemetry Logs */}
        <g opacity="0.65">
          {/* Top Left */}
          <text x="180" y="75" fill="#f97316" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[SYS.OUTREACH // READY]</text>
          <text x="180" y="87" fill="#fb923c" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[CHANNEL.A // COLD_EMAIL]</text>
          
          {/* Bottom Right */}
          <text x="590" y="375" fill="#3b82f6" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[CHANNEL.B // LINKEDIN]</text>
          <text x="590" y="387" fill="#60a5fa" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[TRANSMITTING // SYNC: OK]</text>
          
          {/* Bottom Center Compiling indicator */}
          <text x="440" y="415" fill="#d8b4fe" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px" textAnchor="middle" opacity="0.8">CROSS-CHANNEL COMPILING: 94%</text>
        </g>

        {/* Small floating sparkles / ambient nodes */}
        <g opacity="0.8">
          <circle cx="210" cy="110" r="1.5" fill="#fdba74" className="node-blink-orange" />
          <circle cx="340" cy="120" r="1" fill="#f97316" />
          <circle cx="530" cy="90" r="1.5" fill="#93c5fd" className="node-blink-blue" />
          <circle cx="670" cy="120" r="1.2" fill="#06b6d4" className="node-blink-cyan" />
          <circle cx="300" cy="330" r="1" fill="#fdba74" />
          <circle cx="560" cy="340" r="1.5" fill="#93c5fd" />
        </g>
      </svg>
    </div>
  );
}
