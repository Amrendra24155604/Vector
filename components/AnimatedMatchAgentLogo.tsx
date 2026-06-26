"use client";

import React from "react";

export function AnimatedMatchAgentLogo({ className = "" }: { className?: string }) {

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 880 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI Internship Match Agent network constellation mark"
      >
        <title>AI Internship Match Agent — animated complex constellation mark</title>

        <defs>
          <radialGradient id="match-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.18)"/>
            <stop offset="60%" stopColor="rgba(194,65,12,0.08)"/>
            <stop offset="100%" stopColor="rgba(194,65,12,0)"/>
          </radialGradient>
          <linearGradient id="match-prismFace1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3e8"/>
            <stop offset="100%" stopColor="#fdba74"/>
          </linearGradient>
          <linearGradient id="match-prismFace2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <linearGradient id="match-prismFace3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
          <linearGradient id="match-prismFace4" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c"/>
            <stop offset="100%" stopColor="#c2410c"/>
          </linearGradient>
          <linearGradient id="match-hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.14)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.04)"/>
          </linearGradient>
          <linearGradient id="match-paramFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.06)"/>
            <stop offset="100%" stopColor="rgba(251,146,60,0.02)"/>
          </linearGradient>
          <linearGradient id="match-pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="50%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#fdba74"/>
          </linearGradient>
          <linearGradient id="match-radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.16)"/>
            <stop offset="65%" stopColor="rgba(249,115,22,0.02)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
          </linearGradient>
          
          <filter id="match-bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="28"/>
          </filter>
          <filter id="match-softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
          <filter id="match-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="match-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#ea580c" floodOpacity="0.18"/>
          </filter>
          <style>{`
            .sway-core {
              transform-origin: 520px 220px;
              animation: sway-prism 8s ease-in-out infinite;
            }
            .prism-inner {
              transform-origin: 520px 220px;
              animation: spin-prism 20s linear infinite;
            }
            .radar-sweep {
              transform-origin: 520px 220px;
              animation: rotate-radar 12s linear infinite;
            }
            .glow-pulse {
              animation: glow-breathe 6s ease-in-out infinite;
              transform-origin: 520px 220px;
            }
            .data-pulse-forward {
              stroke-dasharray: 8 18;
              animation: pulse-flow-fwd 5.5s linear infinite;
            }
            .data-pulse-reverse {
              stroke-dasharray: 10 20;
              animation: pulse-flow-rev 4.5s linear infinite;
            }
            .float-hex-1 { animation: hex-float 7s ease-in-out infinite; transform-origin: 620px 150px; }
            .float-hex-2 { animation: hex-float 9s ease-in-out infinite 0.7s; transform-origin: 620px 290px; }
            .float-hex-3 { animation: hex-float 8s ease-in-out infinite 1.4s; transform-origin: 420px 150px; }
            .float-hex-4 { animation: hex-float 10s ease-in-out infinite 2.1s; transform-origin: 380px 220px; }
            .float-hex-5 { animation: hex-float 8.5s ease-in-out infinite 1.0s; transform-origin: 420px 290px; }
            
            .float-param-1 { animation: param-float 8s ease-in-out infinite; transform-origin: 440px 220px; }
            .float-param-2 { animation: param-float 8s ease-in-out infinite 2s; transform-origin: 520px 320px; }
            .float-param-3 { animation: param-float 8s ease-in-out infinite 4s; transform-origin: 600px 220px; }
            .float-param-4 { animation: param-float 8s ease-in-out infinite 6s; transform-origin: 520px 120px; }

            .node-blink { animation: blink 2.2s ease-in-out infinite; }
            .node-blink-applied { animation: blink 1.8s ease-in-out infinite; }
            .node-blink-offered { animation: blink 2.2s ease-in-out infinite 0.4s; }
            .node-blink-saved { animation: blink 2.6s ease-in-out infinite 0.8s; }
            .node-blink-rejected { animation: blink 2.0s ease-in-out infinite 1.2s; }
            .node-blink-interview { animation: blink 2.4s ease-in-out infinite 1.6s; }

            .star-blink-1 { animation: star-glow 3.5s ease-in-out infinite; }
            .star-blink-2 { animation: star-glow 3.5s ease-in-out infinite 1.2s; }
            .star-blink-3 { animation: star-glow 3.5s ease-in-out infinite 2.4s; }

            /* Advanced concentric gyroscope orbits */
            .orbit-rotate-cw {
              transform-origin: 520px 220px;
              animation: rotate-orbit-cw 10s linear infinite;
            }
            .orbit-rotate-ccw {
              transform-origin: 520px 220px;
              animation: rotate-orbit-ccw 12s linear infinite;
            }
            .orbit-rotate-cw-slow {
              transform-origin: 520px 220px;
              animation: rotate-orbit-cw 18s linear infinite;
            }

            /* Holographic ripple signal waves */
            .signal-ring-1 {
              transform-origin: 520px 220px;
              animation: ripple 5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            }
            .signal-ring-2 {
              transform-origin: 520px 220px;
              animation: ripple 5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 2.5s;
            }

            /* Analytics mini bars anim */
            .bar-grow-1 { animation: bar-scale 3.8s ease-in-out infinite; transform-origin: bottom; }
            .bar-grow-2 { animation: bar-scale 3.8s ease-in-out infinite 0.6s; transform-origin: bottom; }
            .bar-grow-3 { animation: bar-scale 3.8s ease-in-out infinite 1.2s; transform-origin: bottom; }

            @keyframes rotate-orbit-cw {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes rotate-orbit-ccw {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes ripple {
              0%   { transform: scale(0.35); opacity: 0.8; stroke-width: 2.5; }
              50%  { opacity: 0.35; stroke-width: 1.25; }
              100% { transform: scale(1.6); opacity: 0; stroke-width: 0.5; }
            }
            @keyframes bar-scale {
              0%, 100% { transform: scaleY(0.4); }
              50%      { transform: scaleY(1); }
            }
            @keyframes sway-prism {
              0%, 100% { transform: translateY(0px) rotate(-2.5deg); }
              50%      { transform: translateY(-7px) rotate(2.5deg); }
            }
            @keyframes spin-prism {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes rotate-radar {
              0%   { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes glow-breathe {
              0%, 100% { opacity: 0.45; }
              50%      { opacity: 0.85; }
            }
            @keyframes pulse-flow-fwd {
              to { stroke-dashoffset: -120; }
            }
            @keyframes pulse-flow-rev {
              to { stroke-dashoffset: 120; }
            }
            @keyframes hex-float {
              0%, 100% { transform: translateY(0) scale(1); }
              50%      { transform: translateY(-5px) scale(1.015); }
            }
            @keyframes param-float {
              0%, 100% { transform: translateY(0) scale(1); }
              50%      { transform: translateY(-3px) scale(1.01); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%      { opacity: 0.35; }
            }
            @keyframes star-glow {
              0%, 100% { opacity: 0.35; transform: scale(0.9); }
              50%      { opacity: 1; transform: scale(1.1); }
            }

            @media (prefers-reduced-motion: reduce) {
              .sway-core, .prism-inner, .radar-sweep, .glow-pulse, .data-pulse-forward, .data-pulse-reverse,
              .float-hex-1, .float-hex-2, .float-hex-3, .float-hex-4, .float-hex-5,
              .float-param-1, .float-param-2, .float-param-3, .float-param-4,
              .orbit-rotate-cw, .orbit-rotate-ccw, .orbit-rotate-cw-slow,
              .signal-ring-1, .signal-ring-2,
              .bar-grow-1, .bar-grow-2, .bar-grow-3,
              .node-blink, .node-blink-applied, .node-blink-offered, .node-blink-saved, .node-blink-rejected, .node-blink-interview,
              .star-blink-1, .star-blink-2, .star-blink-3 {
                animation: none;
              }
            }
          `}</style>
        </defs>

        {/* Dynamic radial glow background */}
        <circle cx="520" cy="220" r="280" fill="url(#match-backGlow)" filter="url(#match-bigBlur)" className="glow-pulse"/>

        {/* Rotating Holographic Radar Sweep */}
        <path d="M 520 220 L 670 70 A 212 212 0 0 1 732 220 Z" fill="url(#match-radarGrad)" className="radar-sweep" />

        {/* Dynamic Pulsing Signal Waves propagating from the Match Engine center */}
        <g>
          <circle cx="520" cy="220" r="140" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25" fill="none" className="signal-ring-1"/>
          <circle cx="520" cy="220" r="200" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.2" fill="none" className="signal-ring-2"/>
        </g>

        {/* Holographic Tech Telemetry Labels */}
        <g opacity="0.55">
          <text x="65" y="80" fill="#f97316" fontSize="7" fontFamily="monospace" letterSpacing="0.5px">[MATCH_ENGINE: v4.2 // SCAN_ACTIVE]</text>
          <text x="65" y="92" fill="#fb923c" fontSize="7" fontFamily="monospace" letterSpacing="0.5px">[FLOW_SYS: SAVED =&gt; APPLIED =&gt; OFFERED]</text>
          <text x="680" y="360" fill="#fb923c" fontSize="7" fontFamily="monospace" letterSpacing="0.5px">[SYS.READY // DATA: CONSTELLATION]</text>
          <text x="680" y="372" fill="#f43f5e" fontSize="7" fontFamily="monospace" letterSpacing="0.5px">[STATUS_ARCHIVE: REJECTED =&gt; DISCARD]</text>
          <text x="460" y="340" fill="#fdba74" fontSize="6.5" fontFamily="monospace" letterSpacing="0.25px">LAT_COORDS: 52.220 // 88.440</text>
        </g>

        {/* Holographic Isometric Perspective Grid Floor */}
        <g opacity="0.85">
          <line x1="100" y1="350" x2="800" y2="350" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="60" y1="380" x2="840" y2="380" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="20" y1="410" x2="880" y2="410" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          
          <line x1="520" y1="310" x2="20" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="520" y1="310" x2="220" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="520" y1="310" x2="420" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="520" y1="310" x2="520" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="520" y1="310" x2="620" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
          <line x1="520" y1="310" x2="820" y2="430" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.12"/>
        </g>

        {/* Concentric Gyroscope Orbits surrounding the central core */}
        <g>
          {/* Orbit Ring 1 (Tilted CW) */}
          <g transform="rotate(35 520 220)">
            <ellipse cx="520" cy="220" rx="55" ry="22" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 12" fill="none" className="orbit-rotate-cw"/>
          </g>
          {/* Orbit Ring 2 (Tilted CCW) */}
          <g transform="rotate(-40 520 220)">
            <ellipse cx="520" cy="220" rx="70" ry="28" stroke="#f97316" strokeWidth="0.85" strokeOpacity="0.25" strokeDasharray="35 10" fill="none" className="orbit-rotate-ccw"/>
          </g>
          {/* Orbit Ring 3 (Tilted CW Slow) */}
          <g transform="rotate(15 520 220)">
            <ellipse cx="520" cy="220" rx="85" ry="34" stroke="#fdba74" strokeWidth="0.75" strokeOpacity="0.18" strokeDasharray="20 40" fill="none" className="orbit-rotate-cw-slow"/>
          </g>
        </g>

        {/* Tech Scope Brackets around core */}
        <g stroke="#fb923c" strokeWidth="1" strokeOpacity="0.38" fill="none">
          <path d="M 480 195 L 480 180 L 495 180" />
          <path d="M 560 195 L 560 180 L 545 180" />
          <path d="M 480 245 L 480 260 L 495 260" />
          <path d="M 560 245 L 560 260 L 545 260" />
        </g>

        {/* Network Constellation Pathways (Dashed pulsing connection lines to matched roles) */}
        <g>
          {/* Core to Hex 1 (Top Right) */}
          <line x1="520" y1="220" x2="620" y2="150" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25"/>
          <line x1="520" y1="220" x2="620" y2="150" stroke="url(#match-pulseGrad)" strokeWidth="2" strokeOpacity="0.8" className="data-pulse-forward"/>

          {/* Core to Hex 2 (Bottom Right) */}
          <line x1="520" y1="220" x2="620" y2="290" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25"/>
          <line x1="520" y1="220" x2="620" y2="290" stroke="url(#match-pulseGrad)" strokeWidth="2" strokeOpacity="0.8" className="data-pulse-reverse"/>

          {/* Core to Hex 3 (Top Left) */}
          <line x1="520" y1="220" x2="420" y2="150" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25"/>
          <line x1="520" y1="220" x2="420" y2="150" stroke="url(#match-pulseGrad)" strokeWidth="2" strokeOpacity="0.8" className="data-pulse-reverse"/>

          {/* Core to Hex 4 (Left-Middle) */}
          <line x1="520" y1="220" x2="380" y2="220" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25"/>
          <line x1="520" y1="220" x2="380" y2="220" stroke="url(#match-pulseGrad)" strokeWidth="2" strokeOpacity="0.8" className="data-pulse-forward"/>

          {/* Core to Hex 5 (Bottom-Left) */}
          <line x1="520" y1="220" x2="420" y2="290" stroke="#f97316" strokeWidth="1.25" strokeOpacity="0.25"/>
          <line x1="520" y1="220" x2="420" y2="290" stroke="url(#match-pulseGrad)" strokeWidth="2" strokeOpacity="0.8" className="data-pulse-forward"/>
        </g>

        {/* Input Parameter Pathways (Connecting SKILLS, MAJOR, LOC, INT nodes to central Match Engine) */}
        <g stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3">
          <line x1="440" y1="220" x2="520" y2="220" />
          <line x1="520" y1="320" x2="520" y2="220" />
          <line x1="600" y1="220" x2="520" y2="220" />
          <line x1="520" y1="120" x2="520" y2="220" />
        </g>

        {/* Inter-node Mesh Cross Connections (Complex networking comparisons) */}
        <g stroke="#fdba74" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="2 4">
          <line x1="420" y1="150" x2="380" y2="220" />
          <line x1="380" y1="220" x2="420" y2="290" />
          <line x1="420" y1="290" x2="620" y2="290" />
          <line x1="620" y1="290" x2="620" y2="150" />
          <line x1="620" y1="150" x2="420" y2="150" />
          
          <line x1="420" y1="150" x2="520" y2="120" />
          <line x1="620" y1="150" x2="520" y2="120" />
          <line x1="620" y1="290" x2="520" y2="320" />
          <line x1="420" y1="290" x2="520" y2="320" />
          <line x1="380" y1="220" x2="440" y2="220" />
          <line x1="620" y1="290" x2="600" y2="220" />
        </g>

        {/* Floating Matched Role Constellation Nodes (Hexagons with match scores + pipeline status pills) */}
        <g>
          {/* Hex 1: Top Right - OFFERED STATUS */}
          <g className="float-hex-1">
            <polygon points="620,104 660,127 660,173 620,196 580,173 580,127" fill="url(#match-hexFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.5" filter="url(#match-shadow)"/>
            <polygon points="620,112 652,131 652,169 620,188 588,169 588,131" fill="none" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 2"/>
            
            {/* Match Percentage */}
            <text x="620" y="142" fill="#fef3e8" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle" filter="url(#match-glow)">96%</text>
            <text x="620" y="156" fill="#fdba74" fillOpacity="0.65" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5px">MATCH</text>
            <circle cx="620" cy="118" r="2.5" fill="#f97316" className="node-blink-offered"/>
            
            {/* Pipeline Status Tag: OFFERED (Green tag) - Translated to the left of Hex 1 */}
            <g transform="translate(522, 138)">
              <rect x="0" y="0" width="48" height="15" rx="3.5" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="0.75" strokeOpacity="0.5"/>
              <circle cx="6" cy="7.5" r="2" fill="#10b981" className="node-blink-offered"/>
              <text x="27" y="10.5" fill="#10b981" fontSize="7" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">OFFERED</text>
            </g>
          </g>

          {/* Hex 2: Bottom Right - INTERVIEW STATUS */}
          <g className="float-hex-2">
            <polygon points="620,244 660,267 660,313 620,336 580,313 580,267" fill="url(#match-hexFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#match-shadow)"/>
            <polygon points="620,252 652,271 652,309 620,328 588,309 588,271" fill="none" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 2"/>
            
            {/* Match Percentage */}
            <text x="620" y="292" fill="#fdba74" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">91%</text>
            <text x="620" y="306" fill="#fb923c" fillOpacity="0.6" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">MATCH</text>
            <circle cx="620" cy="258" r="2" fill="#fb923c" className="node-blink-interview"/>
            
            {/* Pipeline Status Tag: INTVIEW (Amber tag) - Translated to the left of Hex 2 */}
            <g transform="translate(524, 278)">
              <rect x="0" y="0" width="46" height="15" rx="3.5" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="0.75" strokeOpacity="0.5"/>
              <circle cx="6" cy="7.5" r="2" fill="#f59e0b" className="node-blink-interview"/>
              <text x="25" y="10.5" fill="#f59e0b" fontSize="6.5" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">INTVIEW</text>
            </g>

            {/* Sub-Histogram Match Factor indicators */}
            <g transform="translate(580, 346)" opacity="0.65">
              <rect x="0" y="-12" width="2" height="12" rx="0.5" fill="#f97316" className="bar-grow-3" />
              <rect x="4" y="-15" width="2" height="15" rx="0.5" fill="#fb923c" className="bar-grow-1" />
              <rect x="8" y="-9" width="2" height="9" rx="0.5" fill="#fdba74" className="bar-grow-2" />
            </g>
          </g>

          {/* Hex 3: Top Left - APPLIED STATUS */}
          <g className="float-hex-3">
            <polygon points="420,104 460,127 460,173 420,196 380,173 380,127" fill="url(#match-hexFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#match-shadow)"/>
            <polygon points="420,112 452,131 452,169 420,188 388,169 388,131" fill="none" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 2"/>
            
            {/* Match Percentage */}
            <text x="420" y="142" fill="#fdba74" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">88%</text>
            <text x="420" y="156" fill="#fb923c" fillOpacity="0.6" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">MATCH</text>
            <circle cx="420" cy="118" r="2" fill="#fb923c" className="node-blink-applied"/>

            {/* Pipeline Status Tag: APPLIED (Orange tag) */}
            <g transform="translate(322, 138)">
              <rect x="0" y="0" width="48" height="15" rx="3.5" fill="rgba(249,115,22,0.08)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.5"/>
              <circle cx="6" cy="7.5" r="2" fill="#f97316" className="node-blink-applied"/>
              <text x="26" y="10.5" fill="#f97316" fontSize="7" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">APPLIED</text>
            </g>

            {/* Sub-Histogram Match Factor indicators */}
            <g transform="translate(380, 206)" opacity="0.65">
              <rect x="0" y="-10" width="2" height="10" rx="0.5" fill="#f97316" className="bar-grow-1" />
              <rect x="4" y="-7" width="2" height="7" rx="0.5" fill="#fb923c" className="bar-grow-2" />
              <rect x="8" y="-13" width="2" height="13" rx="0.5" fill="#fdba74" className="bar-grow-3" />
            </g>
          </g>

          {/* Hex 4: Left-Middle - SAVED STATUS */}
          <g className="float-hex-4">
            <polygon points="380,174 420,197 420,243 380,266 340,243 340,197" fill="url(#match-hexFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.5" filter="url(#match-shadow)"/>
            <polygon points="380,182 412,201 412,239 380,258 348,239 348,201" fill="none" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 2"/>
            
            {/* Match Percentage */}
            <text x="380" y="222" fill="#fef3e8" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle" filter="url(#match-glow)">94%</text>
            <text x="380" y="236" fill="#fdba74" fillOpacity="0.65" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5px">MATCH</text>
            <circle cx="380" cy="188" r="2.5" fill="#f97316" className="node-blink-saved"/>

            {/* Pipeline Status Tag: SAVED (Blue tag) */}
            <g transform="translate(288, 208)">
              <rect x="0" y="0" width="42" height="15" rx="3.5" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth="0.75" strokeOpacity="0.5"/>
              <circle cx="6" cy="7.5" r="2" fill="#3b82f6" className="node-blink-saved"/>
              <text x="23" y="10.5" fill="#3b82f6" fontSize="7" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">SAVED</text>
            </g>

            {/* Sub-Histogram Match Factor indicators */}
            <g transform="translate(340, 276)" opacity="0.65">
              <rect x="0" y="-12" width="2" height="12" rx="0.5" fill="#f97316" className="bar-grow-2" />
              <rect x="4" y="-8" width="2" height="8" rx="0.5" fill="#fb923c" className="bar-grow-3" />
              <rect x="8" y="-14" width="2" height="14" rx="0.5" fill="#fdba74" className="bar-grow-1" />
            </g>
          </g>

          {/* Hex 5: Bottom-Left - REJECTED STATUS */}
          <g className="float-hex-5">
            <polygon points="420,244 460,267 460,313 420,336 380,313 380,267" fill="url(#match-hexFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#match-shadow)"/>
            <polygon points="420,252 452,271 452,309 420,328 388,309 388,271" fill="none" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 2"/>
            
            {/* Match Percentage */}
            <text x="420" y="282" fill="#fdba74" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">85%</text>
            <text x="420" y="296" fill="#fb923c" fillOpacity="0.6" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">MATCH</text>
            <circle cx="420" cy="258" r="2" fill="#fb923c" className="node-blink-rejected"/>

            {/* Pipeline Status Tag: REJECTED (Rose tag) */}
            <g transform="translate(316, 278)">
              <rect x="0" y="0" width="54" height="15" rx="3.5" fill="rgba(244,63,94,0.08)" stroke="#f43f5e" strokeWidth="0.75" strokeOpacity="0.5"/>
              <circle cx="6" cy="7.5" r="2" fill="#f43f5e" className="node-blink-rejected"/>
              <text x="30" y="10.5" fill="#f43f5e" fontSize="7" fontWeight="black" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">REJECTED</text>
            </g>

            {/* Sub-Histogram Match Factor indicators */}
            <g transform="translate(380, 346)" opacity="0.65">
              <rect x="0" y="-8" width="2" height="8" rx="0.5" fill="#f97316" className="bar-grow-2" />
              <rect x="4" y="-12" width="2" height="12" rx="0.5" fill="#fb923c" className="bar-grow-3" />
              <rect x="8" y="-6" width="2" height="6" rx="0.5" fill="#fdba74" className="bar-grow-1" />
            </g>
          </g>
        </g>

        {/* Profile Parameter Nodes (Hexagons feeding data: Skills, Major, Loc, Interests) */}
        <g>
          {/* SKILLS Node */}
          <g className="float-param-1">
            <polygon points="440,200 457,210 457,230 440,240 423,230 423,210" fill="url(#match-paramFill)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <text x="440" y="223.5" fill="#fdba74" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">SKILLS</text>
            <circle cx="440" cy="208" r="1.5" fill="#f97316" className="node-blink"/>
          </g>

          {/* MAJOR Node */}
          <g className="float-param-2">
            <polygon points="520,300 537,310 537,330 520,340 503,330 503,310" fill="url(#match-paramFill)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <text x="520" y="323.5" fill="#fdba74" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">MAJOR</text>
            <circle cx="520" cy="308" r="1.5" fill="#f97316"/>
          </g>

          {/* LOCATION Node */}
          <g className="float-param-3">
            <polygon points="600,200 617,210 617,230 600,240 583,230 583,210" fill="url(#match-paramFill)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <text x="600" y="223.5" fill="#fdba74" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">LOC</text>
            <circle cx="600" cy="208" r="1.5" fill="#f97316" className="node-blink"/>
          </g>

          {/* INTERESTS Node */}
          <g className="float-param-4">
            <polygon points="520,100 537,110 537,130 520,140 503,130 503,110" fill="url(#match-paramFill)" stroke="#f97316" strokeWidth="0.75" strokeOpacity="0.4"/>
            <text x="520" y="123.5" fill="#fdba74" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="0.25px">INT</text>
            <circle cx="520" cy="108" r="1.5" fill="#f97316"/>
          </g>
        </g>

        {/* Central Core: Rotating 3D-Like Glassmorphic Octahedron Prism */}
        <g className="sway-core">
          {/* Outer floating diamond ring */}
          <polygon points="520,150 565,185 580,220 565,255 520,290 475,255 460,220 475,185" fill="none" stroke="#fb923c" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="4 6"/>
          
          <g className="prism-inner">
            {/* Back facets (providing background depth) */}
            <polygon points="520,172 484,220 520,220" fill="url(#match-prismFace4)" opacity="0.4"/>
            <polygon points="520,172 556,220 520,220" fill="url(#match-prismFace3)" opacity="0.5"/>
            <polygon points="520,268 484,220 520,220" fill="url(#match-prismFace2)" opacity="0.4"/>
            <polygon points="520,268 556,220 520,220" fill="url(#match-prismFace1)" opacity="0.3"/>

            {/* Glowing core sphere */}
            <circle cx="520" cy="220" r="10" fill="#f97316" opacity="0.75" filter="url(#match-softBlur)"/>
            <circle cx="520" cy="220" r="5" fill="#fef3e8" filter="url(#match-glow)"/>

            {/* Front facets (sharp overlays for realistic refraction) */}
            <polygon points="520,172 484,220 520,220" fill="url(#match-prismFace1)" opacity="0.75"/>
            <polygon points="520,172 556,220 520,220" fill="url(#match-prismFace2)" opacity="0.85"/>
            <polygon points="520,268 484,220 520,220" fill="url(#match-prismFace3)" opacity="0.75"/>
            <polygon points="520,268 556,220 520,220" fill="url(#match-prismFace4)" opacity="0.85"/>

            {/* Facet highlights/reflections */}
            <line x1="520" y1="172" x2="520" y2="268" stroke="#fef3e8" strokeWidth="1.25" strokeOpacity="0.45"/>
            <line x1="484" y1="220" x2="556" y2="220" stroke="#fef3e8" strokeWidth="1.25" strokeOpacity="0.45"/>
          </g>
        </g>

        {/* Floating Constellation Stars / Sparks */}
        <g>
          <polygon points="450,100 453,103 450,106 447,103" fill="#fdba74" className="star-blink-1"/>
          <polygon points="600,340 603,343 600,346 597,343" fill="#fdba74" className="star-blink-2"/>
          <polygon points="420,330 423,333 420,336 417,333" fill="#f97316" className="star-blink-3"/>
          <polygon points="610,90 612,92 610,94 608,92" fill="#f97316" className="star-blink-1"/>
          <polygon points="250,190 252,192 250,194 248,192" fill="#fdba74" className="star-blink-2"/>
        </g>
      </svg>
    </div>
  );
}
