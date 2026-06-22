"use client";

import React from "react";

export function AnimatedMedallionLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 640 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI mock interview rotating medallion mark, maximal instrument design"
      >
        <title>AI Mock Interview — animated maximal medallion mark</title>

        <defs>
          <radialGradient id="medallion-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.16)"/>
            <stop offset="55%" stopColor="rgba(194,65,12,0.08)"/>
            <stop offset="100%" stopColor="rgba(194,65,12,0)"/>
          </radialGradient>
          <radialGradient id="medallion-discFill" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.13)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.05)"/>
          </radialGradient>
          <radialGradient id="medallion-avatarGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fef3e8"/>
            <stop offset="40%" stopColor="#fdba74"/>
            <stop offset="80%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </radialGradient>
          <radialGradient id="medallion-userGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fef3e8"/>
            <stop offset="50%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </radialGradient>
          <linearGradient id="medallion-donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
          <linearGradient id="medallion-donutGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="medallion-bigBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26"/>
          </filter>
          <filter id="medallion-softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
          <filter id="medallion-dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="medallion-avatarGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="medallion-discShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#ea580c" floodOpacity="0.18"/>
          </filter>
          <style>{`
            .medallion-spin { transform-origin: 330px 240px; animation: medallion-rotate 70s linear infinite; }
            .stream-spin    { transform-origin: 330px 240px; animation: medallion-rotate 22s linear infinite; }
            .eval-spin      { transform-origin: 330px 240px; animation: counter-rotate 46s linear infinite; }
            .mesh-spin      { transform-origin: 330px 240px; animation: medallion-rotate 34s linear infinite; }
            .microtick-spin { transform-origin: 330px 240px; animation: counter-rotate 60s linear infinite; }
            .tag-orbit      { transform-origin: 330px 240px; animation: counter-rotate 90s linear infinite; }
            .counter-spin   { transform-origin: 330px 240px; animation: counter-rotate 70s linear infinite; }
            .glow-pulse     { animation: glow-breathe 6s ease-in-out infinite; transform-origin: 330px 240px; }

            .avatar-ring-1 { animation: ring-pulse 2.6s ease-in-out infinite; transform-origin: center; }
            .avatar-ring-2 { animation: ring-pulse 2.6s ease-in-out infinite 0.5s; transform-origin: center; }
            .avatar-ring-3 { animation: ring-pulse 2.6s ease-in-out infinite 1s; transform-origin: center; }
            .avatar-core   { animation: avatar-breathe 3.4s ease-in-out infinite; transform-origin: center; }
            .avatar-accent { transform-origin: center; animation: medallion-rotate 5s linear infinite; }

            .user-pulse { animation: user-breathe 2.8s ease-in-out infinite 0.6s; transform-origin: center; }

            .turn-out  { animation: pulse-travel-out 4s ease-in-out infinite; }
            .turn-back { animation: pulse-travel-back 4s ease-in-out infinite 2s; }

            .seg-fill { animation: seg-light 4.5s ease-in-out infinite; }
            .tick-pulse { animation: tick-fade 5s ease-in-out infinite; }
            .dash-fade { animation: dash-blink 3s ease-in-out infinite; }

            .eval-band-a { animation: arc-breathe 4.2s ease-in-out infinite; }
            .eval-band-b { animation: arc-breathe 5.1s ease-in-out infinite 0.6s; }
            .eval-band-c { animation: arc-breathe 4.7s ease-in-out infinite 1.2s; }

            .eq-bar { animation: eq-pulse 1.3s ease-in-out infinite; transform-origin: center; }

            .tag-node { animation: tag-twinkle 3s ease-in-out infinite; }
            .tag-pulse-ring { animation: tag-ring-pulse 3s ease-in-out infinite; transform-origin: center; }

            .particle-1 { animation: particle-drift 6s ease-in-out infinite; }
            .particle-2 { animation: particle-drift 7.5s ease-in-out infinite 1s; }
            .particle-3 { animation: particle-drift 5.5s ease-in-out infinite 2s; }
            .particle-4 { animation: particle-drift 8s ease-in-out infinite 0.5s; }

            .score-arc { animation: score-grow 7s ease-in-out infinite; }
            .score-arc-2 { animation: score-grow2 6.2s ease-in-out infinite 0.8s; }
            .status-blink { animation: blink 2.2s ease-in-out infinite; }
            .reticle-fade { animation: tick-fade 4s ease-in-out infinite; }

            @keyframes medallion-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes counter-rotate   { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            @keyframes glow-breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }
            @keyframes ring-pulse {
              0%   { opacity: 0.55; transform: scale(1); }
              70%, 100% { opacity: 0; transform: scale(1.55); }
            }
            @keyframes avatar-breathe {
              0%, 100% { transform: scale(1); }
              50%      { transform: scale(1.07); }
            }
            @keyframes user-breathe {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50%      { transform: scale(1.12); opacity: 1; }
            }
            @keyframes pulse-travel-out {
              0%        { offset-distance: 0%; opacity: 0; }
              10%       { opacity: 1; }
              45%       { offset-distance: 100%; opacity: 1; }
              52%, 100% { offset-distance: 100%; opacity: 0; }
            }
            @keyframes pulse-travel-back {
              0%        { offset-distance: 100%; opacity: 0; }
              10%       { opacity: 1; }
              45%       { offset-distance: 0%; opacity: 1; }
              52%, 100% { offset-distance: 0%; opacity: 0; }
            }
            @keyframes seg-light {
              0%, 100% { opacity: 0.35; }
              50%      { opacity: 1; }
            }
            @keyframes tick-fade {
              0%, 100% { opacity: 0.3; }
              50%      { opacity: 0.7; }
            }
            @keyframes dash-blink {
              0%, 100% { opacity: 0.2; }
              50%      { opacity: 0.65; }
            }
            @keyframes arc-breathe {
              0%, 100% { opacity: 0.45; }
              50%      { opacity: 0.95; }
            }
            @keyframes eq-pulse {
              0%, 100% { transform: scaleY(0.4); }
              50%      { transform: scaleY(1); }
            }
            @keyframes tag-twinkle {
              0%, 100% { opacity: 0.5; }
              50%      { opacity: 1; }
            }
            @keyframes tag-ring-pulse {
              0%   { opacity: 0.5; transform: scale(1); }
              70%, 100% { opacity: 0; transform: scale(1.8); }
            }
            @keyframes particle-drift {
              0%, 100% { opacity: 0.3; transform: translate(0,0); }
              50%      { opacity: 0.8; transform: translate(4px, -6px); }
            }
            @keyframes score-grow {
              0%, 100% { stroke-dashoffset: var(--off-a, 0); }
              50%      { stroke-dashoffset: var(--off-b, 0); }
            }
            @keyframes score-grow2 {
              0%, 100% { stroke-dashoffset: var(--off-a2, 0); }
              50%      { stroke-dashoffset: var(--off-b2, 0); }
            }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

            @media (prefers-reduced-motion: reduce) {
              .medallion-spin, .stream-spin, .eval-spin, .mesh-spin, .microtick-spin, .tag-orbit, .counter-spin, .glow-pulse,
              .avatar-ring-1, .avatar-ring-2, .avatar-ring-3, .avatar-core, .avatar-accent, .user-pulse,
              .turn-out, .turn-back, .seg-fill, .tick-pulse, .dash-fade, .eval-band-a, .eval-band-b, .eval-band-c,
              .eq-bar, .tag-node, .tag-pulse-ring, .particle-1, .particle-2, .particle-3, .particle-4,
              .score-arc, .score-arc-2, .status-blink, .reticle-fade {
                animation: none;
              }
            }
          `}</style>
        </defs>

        <circle cx="330" cy="240" r="295" fill="url(#medallion-backGlow)" filter="url(#medallion-bigBlur)" className="glow-pulse"/>

        <circle cx="330" cy="240" r="194" fill="none" stroke="rgba(249,115,22,0.06)" strokeWidth="1" strokeDasharray="2 10"/>

        <g className="tag-orbit">
          <circle cx="376.07" cy="68.07" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "0.0s" }}/>
          <circle cx="376.07" cy="68.07" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" className="tag-node" style={{ animationDelay: "0.0s" }}/>
          <circle cx="376.07" cy="68.07" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="372.45" y1="81.59" x2="376.07" y2="68.07" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
          
          <circle cx="501.93" cy="193.93" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "0.4s" }}/>
          <circle cx="501.93" cy="193.93" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" className="tag-node" style={{ animationDelay: "0.4s" }}/>
          <circle cx="501.93" cy="193.93" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="488.41" y1="197.55" x2="501.93" y2="193.93" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
          
          <circle cx="455.87" cy="365.87" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "0.8s" }}/>
          <circle cx="455.87" cy="365.87" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" stroke-opacity="0.5" className="tag-node" style={{ animationDelay: "0.8s" }}/>
          <circle cx="455.87" cy="365.87" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="445.97" y1="355.97" x2="455.87" y2="365.87" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
          
          <circle cx="283.93" cy="411.93" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "1.2s" }}/>
          <circle cx="283.93" cy="411.93" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" className="tag-node" style={{ animationDelay: "1.2s" }}/>
          <circle cx="283.93" cy="411.93" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="287.55" y1="398.41" x2="283.93" y2="411.93" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
          
          <circle cx="158.07" cy="286.07" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "1.6s" }}/>
          <circle cx="158.07" cy="286.07" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" className="tag-node" style={{ animationDelay: "1.6s" }}/>
          <circle cx="158.07" cy="286.07" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="171.59" y1="282.45" x2="158.07" y2="286.07" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
          
          <circle cx="204.13" cy="114.13" r="7" fill="none" stroke="#fb923c" strokeWidth="1" className="tag-pulse-ring" style={{ animationDelay: "2.0s" }}/>
          <circle cx="204.13" cy="114.13" r="7" fill="rgba(249,115,22,0.12)" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" className="tag-node" style={{ animationDelay: "2.0s" }}/>
          <circle cx="204.13" cy="114.13" r="2.2" fill="#fdba74" filter="url(#medallion-dotGlow)"/>
          <line x1="214.03" y1="124.03" x2="204.13" y2="114.13" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6"/>
        </g>

        <g className="stream-spin">
          <path d="M 330.0 84.0 A 156 156 0 0 1 357.09 86.37" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.0s" }}/>
          <path d="M 373.0 90.04 A 156 156 0 0 1 398.39 99.79" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.4s" }}/>
          <path d="M 449.5 139.73 A 156 156 0 0 1 465.1 162.0" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.0s" }}/>
          <path d="M 470.21 171.61 A 156 156 0 0 1 474.64 181.56" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.2s" }}/>
          <path d="M 478.36 191.79 A 156 156 0 0 1 481.37 202.26" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.0s" }}/>
          <path d="M 485.41 226.4 A 156 156 0 0 1 485.98 237.28" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.8s" }}/>
          <path d="M 485.41 253.6 A 156 156 0 0 1 480.68 280.38" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.0s" }}/>
          <path d="M 472.51 303.45 A 156 156 0 0 1 465.1 318.0" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.2s" }}/>
          <path d="M 436.39 354.09 A 156 156 0 0 1 423.88 364.59" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.4s" }}/>
          <path d="M 410.35 373.72 A 156 156 0 0 1 390.95 383.6" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.0s" }}/>
          <path d="M 380.79 387.5 A 156 156 0 0 1 365.09 392.0" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.6s" }}/>
          <path d="M 349.01 394.84 A 156 156 0 0 1 338.16 395.79" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.4s" }}/>
          <path d="M 321.84 395.79 A 156 156 0 0 1 300.23 393.13" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.6s" }}/>
          <path d="M 276.64 386.59 A 156 156 0 0 1 266.55 382.51" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.4s" }}/>
          <path d="M 252.0 375.1 A 156 156 0 0 1 238.31 366.21" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.6s" }}/>
          <path d="M 229.73 359.5 A 156 156 0 0 1 221.63 352.22" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "0.8s" }}/>
          <path d="M 179.32 199.62 A 156 156 0 0 1 188.62 174.07" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.2s" }}/>
          <path d="M 200.67 152.77 A 156 156 0 0 1 210.5 139.73" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.4s" }}/>
          <path d="M 252.0 104.9 A 156 156 0 0 1 261.61 99.79" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.2s" }}/>
          <path d="M 324.56 84.1 A 156 156 0 0 1 340.88 84.38" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" className="dash-fade" style={{ animationDelay: "1.4s" }}/>
        </g>

        <g className="medallion-spin">
          <circle cx="330" cy="240" r="150" fill="url(#medallion-discFill)" stroke="#fb923c" strokeWidth="1.25" strokeOpacity="0.45" filter="url(#medallion-discShadow)"/>
          <line x1="330.0" y1="96.0" x2="330.0" y2="109.0" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="345.05" y1="96.79" x2="344.42" y2="102.76" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="359.94" y1="99.15" x2="358.69" y2="105.02" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="374.5" y1="103.05" x2="372.64" y2="108.75" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="388.57" y1="108.45" x2="386.13" y2="113.93" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="402.0" y1="115.29" x2="395.5" y2="126.55" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="414.64" y1="123.5" x2="411.11" y2="128.36" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="426.35" y1="132.99" x2="422.34" y2="137.45" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="437.01" y1="143.65" x2="432.55" y2="147.66" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="446.5" y1="155.36" x2="441.64" y2="158.89" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="454.71" y1="168.0" x2="443.45" y2="174.5" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="461.55" y1="181.43" x2="456.07" y2="183.87" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="466.95" y1="195.5" x2="461.25" y2="197.36" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="470.85" y1="210.06" x2="464.98" y2="211.31" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="473.21" y1="224.95" x2="467.24" y2="225.58" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="474.0" y1="240.0" x2="461.0" y2="240.0" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="473.21" y1="255.05" x2="467.24" y2="254.42" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="470.85" y1="269.94" x2="464.98" y2="268.69" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="466.95" y1="284.5" x2="461.25" y2="282.64" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="461.55" y1="298.57" x2="456.07" y2="296.13" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="454.71" y1="312.0" x2="443.45" y2="305.5" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="446.5" y1="324.64" x2="441.64" y2="321.11" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="437.01" y1="336.35" x2="432.55" y2="332.34" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="426.35" y1="347.01" x2="422.34" y2="342.55" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="414.64" y1="356.5" x2="411.11" y2="351.64" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="402.0" y1="364.71" x2="395.5" y2="353.45" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="388.57" y1="371.55" x2="386.13" y2="366.07" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="374.5" y1="376.95" x2="372.64" y2="371.25" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="359.94" y1="380.85" x2="358.69" y2="374.98" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="345.05" y1="383.21" x2="344.42" y2="377.24" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="330.0" y1="384.0" x2="330.0" y2="371.0" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="314.95" y1="383.21" x2="315.58" y2="377.24" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="300.06" y1="380.85" x2="301.31" y2="374.98" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="285.5" y1="376.95" x2="287.36" y2="371.25" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="271.43" y1="371.55" x2="273.87" y2="366.07" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="258.0" y1="364.71" x2="264.5" y2="353.45" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="245.36" y1="356.5" x2="248.89" y2="351.64" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="233.65" y1="347.01" x2="237.66" y2="342.55" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="222.99" y1="336.35" x2="227.45" y2="332.34" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="213.5" y1="324.64" x2="218.36" y2="321.11" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="205.29" y1="312.0" x2="216.55" y2="305.5" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="198.45" y1="298.57" x2="203.93" y2="296.13" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="193.05" y1="284.5" x2="198.75" y2="282.64" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="189.15" y1="269.94" x2="195.02" y2="268.69" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="186.79" y1="255.05" x2="192.76" y2="254.42" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="186.0" y1="240.0" x2="199.0" y2="240.0" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="186.79" y1="224.95" x2="192.76" y2="225.58" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="189.15" y1="210.06" x2="195.02" y2="211.31" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="193.05" y1="195.5" x2="198.75" y2="197.36" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="198.45" y1="181.43" x2="203.93" y2="183.87" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="205.29" y1="168.0" x2="216.55" y2="174.5" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="213.5" y1="155.36" x2="218.36" y2="158.89" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="222.99" y1="143.65" x2="227.45" y2="147.66" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="233.65" y1="132.99" x2="237.66" y2="137.45" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="245.36" y1="123.5" x2="248.89" y2="128.36" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="258.0" y1="115.29" x2="264.5" y2="126.55" stroke="rgba(253,186,116,0.5)" strokeWidth="1.5" className="tick-pulse"/>
          <line x1="271.43" y1="108.45" x2="273.87" y2="113.93" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="285.5" y1="103.05" x2="287.36" y2="108.75" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="300.06" y1="99.15" x2="301.31" y2="105.02" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          <line x1="314.95" y1="96.79" x2="315.58" y2="102.76" stroke="rgba(253,186,116,0.2)" strokeWidth="0.65"/>
          
          <path d="M 330.0 114.0 A 126 126 0 0 1 377.2 123.17" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 393.0 130.88 A 126 126 0 0 1 429.29 162.43" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 439.12 177.0 A 126 126 0 0 1 454.77 222.46" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 456.0 240.0 A 126 126 0 0 1 446.83 287.2" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 439.12 303.0 A 126 126 0 0 1 407.57 339.29" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 393.0 349.12 A 126 126 0 0 1 347.54 364.77" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          <path d="M 330.0 366.0 A 126 126 0 0 1 282.8 356.83" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" className="seg-fill"/>
          
          <path d="M 267.0 349.12 A 126 126 0 0 1 230.71 317.57" fill="none" stroke="rgba(249,115,22,0.16)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 220.88 303.0 A 126 126 0 0 1 205.23 257.54" fill="none" stroke="rgba(249,115,22,0.16)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 204.0 240.0 A 126 126 0 0 1 213.17 192.8" fill="none" stroke="rgba(249,115,22,0.16)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 220.88 177.0 A 126 126 0 0 1 252.43 140.71" fill="none" stroke="rgba(249,115,22,0.16)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 267.0 130.88 A 126 126 0 0 1 312.46 115.23" fill="none" stroke="rgba(249,115,22,0.16)" strokeWidth="3.5" strokeLinecap="round"/>
        </g>

        <g className="eval-spin">
          <path d="M 330.0 130.0 A 110 110 0 0 1 439.58 249.59" fill="none" stroke="#fdba74" strokeWidth="2.25" strokeOpacity="0.55" strokeLinecap="round" className="eval-band-a"/>
          <path d="M 429.69 286.49 A 110 110 0 0 1 301.53 346.25" fill="none" stroke="#fb923c" strokeWidth="2.25" strokeOpacity="0.55" strokeLinecap="round" className="eval-band-b"/>
          <path d="M 275.0 335.26 A 110 110 0 0 1 259.29 155.74" fill="none" stroke="#f97316" strokeWidth="2.25" strokeOpacity="0.55" strokeLinecap="round" className="eval-band-c"/>
        </g>

        <g className="mesh-spin">
          <line x1="330.0" y1="144.0" x2="397.88" y2="307.88" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="397.88" y1="172.12" x2="330.0" y2="336.0" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="426.0" y1="240.0" x2="262.12" y2="307.88" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="397.88" y1="307.88" x2="234.0" y2="240.0" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="330.0" y1="336.0" x2="262.12" y2="172.12" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="262.12" y1="307.88" x2="330.0" y2="144.0" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="234.0" y1="240.0" x2="397.88" y2="172.12" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <line x1="262.12" y1="172.12" x2="426.0" y2="240.0" stroke="rgba(251,146,60,0.16)" strokeWidth="0.5"/>
          <circle cx="330.0" cy="144.0" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="397.88" cy="172.12" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="426.0" cy="240.0" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="397.88" cy="307.88" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="330.0" cy="336.0" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          
          <circle cx="330.0" cy="336.0" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="262.12" cy="307.88" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="234.0" cy="240.0" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
          <circle cx="262.12" cy="172.12" r="2.5" fill="#fb923c" fillOpacity="0.6"/>
        </g>

        <g className="microtick-spin">
          <line x1="330.0" y1="152.0" x2="330.0" y2="155.0" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="336.14" y1="152.21" x2="335.93" y2="155.21" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="342.25" y1="152.86" x2="341.83" y2="155.83" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="348.3" y1="153.92" x2="347.67" y2="156.86" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="354.26" y1="155.41" x2="353.43" y2="158.29" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="360.1" y1="157.31" x2="359.07" y2="160.13" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="365.79" y1="159.61" x2="364.57" y2="162.35" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="371.31" y1="162.3" x2="369.91" y2="164.95" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="376.63" y1="165.37" x2="375.04" y2="167.92" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="381.73" y1="168.81" x2="379.96" y2="171.23" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="386.57" y1="172.59" x2="384.64" y2="174.89" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="391.13" y1="176.7" x2="389.05" y2="178.86" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="395.4" y1="181.12" x2="393.17" y2="183.12" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="399.34" y1="185.82" x2="396.98" y2="187.67" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="402.96" y1="190.79" x2="400.47" y2="192.47" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="406.21" y1="196.0" x2="403.61" y2="197.5" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="409.09" y1="201.42" x2="406.4" y2="202.74" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="411.59" y1="207.03" x2="408.81" y2="208.16" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="413.69" y1="212.81" x2="410.84" y2="213.73" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="415.39" y1="218.71" x2="412.48" y2="219.44" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="416.66" y1="224.72" x2="413.71" y2="225.24" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="417.52" y1="230.8" x2="414.53" y2="231.12" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="417.95" y1="236.93" x2="414.95" y2="237.03" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="417.95" y1="243.07" x2="414.95" y2="242.97" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="417.52" y1="249.2" x2="414.53" y2="248.88" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="416.66" y1="255.28" x2="413.71" y2="254.76" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="415.39" y1="261.29" x2="412.48" y2="260.56" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="413.69" y1="267.19" x2="410.84" y2="266.27" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="411.59" y1="272.97" x2="408.81" y2="271.84" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="409.09" y1="278.58" x2="406.4" y2="277.26" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="406.21" y1="284.0" x2="403.61" y2="282.5" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="402.96" y1="289.21" x2="400.47" y2="287.53" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="399.34" y1="294.18" x2="396.98" y2="292.33" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="395.4" y1="298.88" x2="393.17" y2="296.88" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="391.13" y1="303.3" x2="389.05" y2="301.14" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="386.57" y1="307.41" x2="384.64" y2="305.11" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="381.73" y1="311.19" x2="379.96" y2="308.77" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="376.63" y1="314.63" x2="375.04" y2="312.08" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="371.31" y1="317.7" x2="369.91" y2="315.05" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="365.79" y1="320.39" x2="364.57" y2="317.65" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="360.1" y1="322.69" x2="359.07" y2="319.87" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="354.26" y1="324.59" x2="353.43" y2="321.71" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="348.3" y1="326.08" x2="347.67" y2="323.14" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="342.25" y1="327.14" x2="341.83" y2="324.17" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="336.14" y1="327.79" x2="335.93" y2="324.79" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="330.0" y1="328.0" x2="330.0" y2="325.0" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="323.86" y1="327.79" x2="324.07" y2="324.79" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="317.75" y1="327.14" x2="318.17" y2="324.17" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="311.7" y1="326.08" x2="312.33" y2="323.14" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="305.74" y1="324.59" x2="306.57" y2="321.71" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="299.9" y1="322.69" x2="300.93" y2="319.87" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="294.21" y1="320.39" x2="295.43" y2="317.65" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="288.69" y1="317.7" x2="290.09" y2="315.05" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="283.37" y1="314.63" x2="284.96" y2="312.08" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="278.27" y1="311.19" x2="280.04" y2="308.77" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="273.43" y1="307.41" x2="275.36" y2="305.11" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="268.87" y1="303.3" x2="270.95" y2="301.14" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="264.6" y1="298.88" x2="266.83" y2="296.88" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="260.66" y1="294.18" x2="263.02" y2="292.33" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="257.04" y1="289.21" x2="259.53" y2="287.53" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="253.79" y1="284.0" x2="256.39" y2="282.5" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="250.91" y1="278.58" x2="253.6" y2="277.26" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="248.41" y1="272.97" x2="251.19" y2="271.84" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="246.31" y1="267.19" x2="249.16" y2="266.27" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="244.61" y1="261.29" x2="247.52" y2="260.56" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="243.34" y1="255.28" x2="246.29" y2="254.76" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="242.48" y1="249.2" x2="245.47" y2="248.88" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="242.05" y1="243.07" x2="245.05" y2="242.97" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="242.05" y1="236.93" x2="245.05" y2="237.03" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="242.48" y1="230.8" x2="245.47" y2="231.12" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="243.34" y1="224.72" x2="246.29" y2="225.24" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="244.61" y1="218.71" x2="247.52" y2="219.44" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="246.31" y1="212.81" x2="249.16" y2="213.73" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="248.41" y1="207.03" x2="251.19" y2="208.16" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="250.91" y1="201.42" x2="253.6" y2="202.74" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="253.79" y1="196.0" x2="256.39" y2="197.5" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="257.04" y1="190.79" x2="259.53" y2="192.47" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="260.66" y1="185.82" x2="263.02" y2="187.67" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="264.6" y1="181.12" x2="266.83" y2="183.12" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="268.87" y1="176.7" x2="270.95" y2="178.86" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="273.43" y1="172.59" x2="275.36" y2="174.89" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="278.27" y1="168.81" x2="280.04" y2="171.23" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="283.37" y1="165.37" x2="284.96" y2="167.92" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="288.69" y1="162.3" x2="290.09" y2="164.95" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="294.21" y1="159.61" x2="295.43" y2="162.35" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="299.9" y1="157.31" x2="300.93" y2="160.13" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="305.74" y1="155.41" x2="306.57" y2="158.29" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="311.7" y1="153.92" x2="312.33" y2="156.86" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="317.75" y1="152.86" x2="318.17" y2="155.83" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
          <line x1="323.86" y1="152.21" x2="324.07" y2="155.21" stroke="rgba(249,115,22,0.18)" strokeWidth="0.4"/>
        </g>

        <g className="counter-spin">
          <line x1="330.0" y1="170.0" x2="330.0" y2="164.0" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.0s" }}/>
          <line x1="342.16" y1="171.06" x2="343.54" y2="163.18" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.12s" }}/>
          <line x1="353.94" y1="174.22" x2="355.65" y2="169.52" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.24s" }}/>
          <line x1="365.0" y1="179.38" x2="368.0" y2="174.18" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.36s" }}/>
          <line x1="375.0" y1="186.38" x2="380.78" y2="179.48" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.48s" }}/>
          <line x1="383.62" y1="195.0" x2="387.45" y2="191.79" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.6s" }}/>
          <line x1="390.62" y1="205.0" x2="397.55" y2="201.0" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.72s" }}/>
          <line x1="395.78" y1="216.06" x2="404.24" y2="212.98" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.84s" }}/>
          <line x1="398.94" y1="227.84" x2="406.82" y2="226.46" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.96s" }}/>
          <line x1="400.0" y1="240.0" x2="405.0" y2="240.0" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.0s" }}/>
          <line x1="398.94" y1="252.16" x2="401.89" y2="252.68" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.12s" }}/>
          <line x1="395.78" y1="263.94" x2="398.6" y2="264.97" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.24s" }}/>
          <line x1="390.62" y1="275.0" x2="393.22" y2="276.5" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.36s" }}/>
          <line x1="383.62" y1="285.0" x2="392.05" y2="292.07" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.48s" }}/>
          <line x1="375.0" y1="293.62" x2="379.49" y2="298.99" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.6s" }}/>
          <line x1="365.0" y1="300.62" x2="370.5" y2="310.15" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.72s" }}/>
          <line x1="353.94" y1="305.78" x2="355.65" y2="310.48" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.84s" }}/>
          <line x1="342.16" y1="308.94" x2="343.2" y2="314.85" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.96s" }}/>
          <line x1="330.0" y1="310.0" x2="330.0" y2="315.0" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.0s" }}/>
          <line x1="317.84" y1="308.94" x2="316.28" y2="317.8" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.12s" }}/>
          <line x1="306.06" y1="305.78" x2="303.32" y2="313.3" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.55" className="eq-bar" style={{ animationDelay: "0.24s" }}/>
          <line x1="295.0" y1="300.62" x2="293.0" y2="304.09" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.36s" }}/>
          <line x1="285.0" y1="293.62" x2="281.15" y2="298.22" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.55" className="eq-bar" style={{ animationDelay: "0.48s" }}/>
          <line x1="276.38" y1="285.0" x2="269.48" y2="290.78" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.45" className="eq-bar" style={{ animationDelay: "0.6s" }}/>
          <line x1="269.38" y1="275.0" x2="261.58" y2="279.5" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.72s" }}/>
          <line x1="264.22" y1="263.94" x2="253.88" y2="267.7" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.84s" }}/>
          <line x1="261.06" y1="252.16" x2="255.15" y2="253.2" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.96s" }}/>
          <line x1="260.0" y1="240.0" x2="249.0" y2="240.0" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.0s" }}/>
          <line x1="261.06" y1="227.84" x2="255.14" y2="226.98" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.12s" }}/>
          <line x1="264.22" y1="216.06" x2="257.64" y2="213.66" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.55" className="eq-bar" style={{ animationDelay: "0.24s" }}/>
          <line x1="269.38" y1="205.0" x2="263.32" y2="201.5" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.36s" }}/>
          <line x1="276.38" y1="195.0" x2="270.25" y2="189.86" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.48s" }}/>
          <line x1="285.0" y1="186.38" x2="281.79" y2="182.55" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.55" className="eq-bar" style={{ animationDelay: "0.6s" }}/>
          <line x1="295.0" y1="179.38" x2="292.0" y2="174.18" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.55" className="eq-bar" style={{ animationDelay: "0.72s" }}/>
          <line x1="306.06" y1="174.22" x2="304.69" y2="170.46" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.65" className="eq-bar" style={{ animationDelay: "0.84s" }}/>
          <line x1="317.84" y1="171.06" x2="316.98" y2="166.14" stroke="#fdba74" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.35" className="eq-bar" style={{ animationDelay: "0.96s" }}/>

          <path d="M 356.11 194.89 L 361.11 194.89 L 361.11 189.89" fill="none" stroke="rgba(253,186,116,0.4)" strokeWidth="1" transform="rotate(45 361.11 194.89)" className="reticle-fade"/>
          <path d="M 356.11 257.11 L 361.11 257.11 L 361.11 252.11" fill="none" stroke="rgba(253,186,116,0.4)" strokeWidth="1" transform="rotate(135 361.11 257.11)" className="reticle-fade"/>
          <path d="M 293.89 257.11 L 298.89 257.11 L 298.89 252.11" fill="none" stroke="rgba(253,186,116,0.4)" strokeWidth="1" transform="rotate(225 298.89 257.11)" className="reticle-fade"/>
          <path d="M 293.89 194.89 L 298.89 194.89 L 298.89 189.89" fill="none" stroke="rgba(253,186,116,0.4)" strokeWidth="1" transform="rotate(315 298.89 194.89)" className="reticle-fade"/>
          
          <circle cx="330" cy="226" r="30" fill="none" stroke="#fdba74" strokeWidth="1.5" className="avatar-ring-1"/>
          <circle cx="330" cy="226" r="30" fill="none" stroke="#fdba74" strokeWidth="1.5" className="avatar-ring-2"/>
          <circle cx="330" cy="226" r="30" fill="none" stroke="#fdba74" strokeWidth="1.5" className="avatar-ring-3"/>
          <g className="avatar-accent" style={{ transformOrigin: "330px 226px" }}>
            <path d="M 330.0 208.0 A 18 18 0 0 1 347.73 229.13" fill="none" stroke="#fef3e8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8"/>
            <path d="M 330.0 244.0 A 18 18 0 0 1 312.27 222.87" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
          </g>
          <g className="avatar-core">
            <circle cx="330" cy="226" r="21" fill="url(#medallion-avatarGrad)" filter="url(#medallion-avatarGlow)"/>
            <circle cx="330" cy="226" r="21" fill="none" stroke="#fef3e8" strokeWidth="1" strokeOpacity="0.6"/>
            <circle cx="330" cy="226" r="8.5" fill="none" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.5"/>
            <circle cx="330" cy="226" r="3" fill="#fef3e8"/>
          </g>
          <g className="user-pulse">
            <circle cx="330" cy="258" r="10" fill="url(#medallion-userGrad)" filter="url(#medallion-dotGlow)"/>
            <circle cx="330" cy="258" r="10" fill="none" stroke="#fef3e8" strokeWidth="0.75" strokeOpacity="0.5"/>
          </g>
          <path id="medallion-turnPath" d="M 330 247 L 330 248" fill="none" stroke="rgba(251,146,60,0.2)" strokeWidth="0.75" strokeDasharray="1 3"/>
          <circle r="3" fill="#fdba74" filter="url(#medallion-dotGlow)" className="turn-out" style={{ offsetPath: "path('M 330 247 L 330 248')" }}/>
          <circle r="3" fill="#f97316" filter="url(#medallion-dotGlow)" className="turn-back" style={{ offsetPath: "path('M 330 247 L 330 248')" }}/>

          <circle cx="306" cy="278" r="3" fill="#fdba74" className="status-blink" filter="url(#medallion-dotGlow)"/>
          <rect x="314" y="276.25" width="38" height="3.5" rx="1.75" fill="#fdba74" fillOpacity="0.5"/>
          <circle cx="316" cy="291" r="10" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="3.5"/>
          <circle cx="316" cy="291" r="10" fill="none" stroke="url(#medallion-donutGrad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="62.8 62.8" transform="rotate(-90 316 291)" className="score-arc" style={{ "--off-a": "22.0", "--off-b": "11.3" } as React.CSSProperties}/>
          <circle cx="316" cy="291" r="2" fill="#fef3e8"/>
          <circle cx="344" cy="291" r="10" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="3.5"/>
          <circle cx="344" cy="291" r="10" fill="none" stroke="url(#medallion-donutGrad2)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="62.8 62.8" transform="rotate(-90 344 291)" className="score-arc-2" style={{ "--off-a2": "28.3", "--off-b2": "16.3" } as React.CSSProperties}/>
          <circle cx="344" cy="291" r="2" fill="#fef3e8"/>
        </g>

        <circle cx="150" cy="200" r="2.5" fill="#fdba74" filter="url(#medallion-dotGlow)" className="particle-1"/>
        <circle cx="506" cy="260" r="2.5" fill="#fdba74" filter="url(#medallion-dotGlow)" className="particle-2"/>
        <circle cx="170" cy="330" r="2.5" fill="#fdba74" filter="url(#medallion-dotGlow)" className="particle-3"/>
        <circle cx="516" cy="160" r="2.5" fill="#fdba74" filter="url(#medallion-dotGlow)" className="particle-4"/>
      </svg>
    </div>
  );
}
