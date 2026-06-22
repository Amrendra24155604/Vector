"use client";

import React, { useState, useEffect } from "react";

export function AnimatedInterviewLogo({ className = "" }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTimestamp: number | null = null;
    const duration = 6000; // 6 seconds for a full cycle

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      setProgress((elapsed % duration) / duration);
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const getPercent = (offset: number, speedMultiplier: number = 1) => {
    const p = ((progress * speedMultiplier) + offset + 1) % 1;
    const val = p * 100;
    return val <= 50 ? Math.floor(90 + val * 0.2) : Math.floor(100 - (val - 50) * 0.2); // Yoyo between 90% and 100%
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 880 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="AI Mock Interview Coach Agent animation mark"
      >
        <title>AI Interview Coach — animated speech equalizing mark</title>

        <defs>
          <radialGradient id="interview-backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.15)"/>
            <stop offset="60%" stopColor="rgba(168,85,247,0.06)"/>
            <stop offset="100%" stopColor="rgba(168,85,247,0)"/>
          </radialGradient>
          
          <linearGradient id="interview-soundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="behavioral-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.14)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.02)"/>
          </linearGradient>
          <linearGradient id="behavioral-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.7)"/>
            <stop offset="100%" stopColor="rgba(249,115,22,0.15)"/>
          </linearGradient>

          <linearGradient id="technical-panelFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.14)"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.02)"/>
          </linearGradient>
          <linearGradient id="technical-borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
            .float-voice {
              animation: voice-float-anim 6s ease-in-out infinite;
            }
            .float-tech {
              animation: tech-float-anim 7s ease-in-out infinite 0.5s;
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
            
            .eq-grow-1 { animation: eq-scale-anim 2s ease-in-out infinite; }
            .eq-grow-2 { animation: eq-scale-anim 2s ease-in-out infinite 0.3s; }
            .eq-grow-3 { animation: eq-scale-anim 2s ease-in-out infinite 0.6s; }
            .eq-grow-4 { animation: eq-scale-anim 2s ease-in-out infinite 0.9s; }
            .eq-grow-5 { animation: eq-scale-anim 2s ease-in-out infinite 1.2s; }

            .bar-grow-1 { animation: bar-scale 3s ease-in-out infinite; }
            .bar-grow-2 { animation: bar-scale 3s ease-in-out infinite 0.6s; }
            .bar-grow-3 { animation: bar-scale 3s ease-in-out infinite 1.2s; }

            .text-line-1 { animation: flicker-anim 4s infinite; }
            .text-line-2 { animation: flicker-anim 4s infinite 1s; }
            .text-line-3 { animation: flicker-anim 4s infinite 2s; }
            .text-line-4 { animation: flicker-anim 4s infinite 3s; }

            .radar-pulse {
              animation: ripple-pulse 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            }

            @keyframes voice-float-anim {
              0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
              50%      { transform: translateY(-7px) rotate(0.5deg); }
            }
            @keyframes tech-float-anim {
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
            @keyframes eq-scale-anim {
              0%, 100% { transform: scaleY(0.45); }
              50%      { transform: scaleY(1.35); }
            }
            @keyframes flicker-anim {
              0%, 100% { opacity: 0.85; }
              45%      { opacity: 0.85; }
              50%      { opacity: 0.25; }
              55%      { opacity: 0.85; }
            }
            @keyframes ripple-pulse {
              0%   { transform: scale(0.6); opacity: 0.85; }
              75%  { opacity: 0.3; }
              100% { transform: scale(1.4); opacity: 0; }
            }

            @media (prefers-reduced-motion: reduce) {
              .float-voice, .float-tech, .float-stats-left, .float-stats-right,
              .float-param-1, .float-param-2, .float-param-3,
              .orbit-rotate-cw, .orbit-rotate-ccw, .vector-pulse-fwd,
              .node-blink-orange, .node-blink-cyan, .node-blink-blue, .node-blink-green,
              .eq-grow-1, .eq-grow-2, .eq-grow-3, .eq-grow-4, .eq-grow-5,
              .bar-grow-1, .bar-grow-2, .bar-grow-3,
              .text-line-1, .text-line-2, .text-line-3, .text-line-4, .radar-pulse {
                animation: none;
              }
            }
          `}</style>
        </defs>

        {/* Backdrop radial glow */}
        <circle cx="440" cy="220" r="300" fill="url(#interview-backGlow)" filter="url(#progress-bigBlur)" opacity="0.6"/>

        {/* Symmetrical grid floor */}
        <g opacity="0.75">
          <line x1="140" y1="360" x2="740" y2="360" stroke="rgba(249,115,22,0.1)" strokeWidth="1"/>
          <line x1="100" y1="390" x2="780" y2="390" stroke="rgba(168,85,247,0.1)" strokeWidth="1"/>
          <line x1="440" y1="320" x2="140" y2="420" stroke="rgba(249,115,22,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="300" y2="420" stroke="rgba(168,85,247,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="440" y2="420" stroke="rgba(168,85,247,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="580" y2="420" stroke="rgba(168,85,247,0.06)" strokeWidth="0.8"/>
          <line x1="440" y1="320" x2="740" y2="420" stroke="rgba(59,130,246,0.06)" strokeWidth="0.8"/>
        </g>

        {/* Voice Equalizer Center Soundwave Column (x = 440) */}
        <g opacity="0.85">
          <rect x="402" y="208" width="4" height="24" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-1" style={{ transformOrigin: '404px 220px' }} />
          <rect x="411" y="196" width="4" height="48" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-2" style={{ transformOrigin: '413px 220px' }} />
          <rect x="420" y="184" width="4" height="72" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-3" style={{ transformOrigin: '422px 220px' }} />
          <rect x="429" y="172" width="4" height="96" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-4" style={{ transformOrigin: '431px 220px' }} />
          <rect x="438" y="160" width="4" height="120" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-5" style={{ transformOrigin: '440px 220px' }} />
          <rect x="447" y="172" width="4" height="96" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-4" style={{ transformOrigin: '449px 220px' }} />
          <rect x="456" y="184" width="4" height="72" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-3" style={{ transformOrigin: '458px 220px' }} />
          <rect x="465" y="196" width="4" height="48" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-2" style={{ transformOrigin: '467px 220px' }} />
          <rect x="474" y="208" width="4" height="24" rx="2" fill="url(#interview-soundGrad)" className="eq-grow-1" style={{ transformOrigin: '476px 220px' }} />
        </g>

        {/* Curved Voice Signal Loop Waves */}
        <g>
          {/* Top Voice Loop */}
          <path d="M 330 180 Q 440 130 550 180" stroke="rgba(168,85,247,0.12)" strokeWidth="1.5" fill="none" />
          <path d="M 330 180 Q 440 130 550 180" stroke="url(#outreach-waveGradOrangeToBlue)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="vector-pulse-fwd" />
          
          {/* Bottom Voice Loop */}
          <path d="M 330 260 Q 440 310 550 260" stroke="rgba(168,85,247,0.12)" strokeWidth="1.5" fill="none" />
          <path d="M 330 260 Q 440 310 550 260" stroke="url(#outreach-waveGradBlueToOrange)" strokeWidth="2.5" strokeLinecap="round" fill="none" className="vector-pulse-fwd" />
        </g>

        {/* Voice Loop Check-Nodes */}
        <g>
          {/* Node 1: MIC_IN (x=380, top wave y=140) */}
          <g transform="translate(365, 140)">
            <circle cx="15" cy="15" r="9" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#f97316" className="node-blink-orange" />
            <text x="15" y="-1.5" fill="#fdba74" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VOICE</text>
          </g>

          {/* Node 2: TRANS (x=495, top wave y=140) */}
          <g transform="translate(485, 140)">
            <circle cx="15" cy="15" r="9" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="4.5" fill="#3b82f6" className="node-blink-blue" />
            <text x="15" y="-1.5" fill="#93c5fd" fontSize="6.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TRANS</text>
          </g>
        </g>

        {/* Center: Sys.Monitor Diagnostic Terminal Log Window */}
        <g>
          {/* Card container */}
          <rect x="350" y="268" width="180" height="66" rx="8" fill="rgba(20, 18, 17, 0.85)" stroke="url(#console-borderGrad)" strokeWidth="1.2" backdrop-filter="blur(6px)" filter="url(#outreach-shadow)" />
          {/* Header dots */}
          <circle cx="362" cy="276" r="2" fill="#ef4444" opacity="0.8" />
          <circle cx="368" cy="276" r="2" fill="#f59e0b" opacity="0.8" />
          <circle cx="374" cy="276" r="2" fill="#10b981" opacity="0.8" />
          <text x="522" y="278" fill="rgba(168,85,247,0.5)" fontSize="5.2" fontFamily="monospace" textAnchor="end">SPEECH.EVAL</text>
          
          {/* Animated Log Lines */}
          <text x="362" y="288" fill="#f97316" fontSize="5.5" fontFamily="monospace" className="text-line-1">&gt; STREAM ON... mic ready</text>
          <text x="362" y="298" fill="#a855f7" fontSize="5.5" fontFamily="monospace" className="text-line-2">&gt; PACING: 135 WPM ... optimal</text>
          <text x="362" y="308" fill="#3b82f6" fontSize="5.5" fontFamily="monospace" className="text-line-3">&gt; FILLERS: 'like', 'uhm' [0]</text>
          <text x="362" y="318" fill="#4ade80" fontSize="5.5" fontFamily="monospace" className="text-line-4">&gt; EVALUATION COMPLETE... 92%</text>
        </g>

        {/* Central AI Analytics Router Node */}
        <g>
          {/* Outer rotating dashboard ring */}
          <circle cx="440" cy="220" r="30" stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="8 6" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Inner counter-rotating dashboard ring */}
          <circle cx="440" cy="220" r="22" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" fill="none" className="orbit-rotate-ccw" style={{ transformOrigin: '440px 220px' }} />
          
          {/* Central AI core junction node */}
          <circle cx="440" cy="220" r="11" fill="url(#interview-soundGrad)" opacity="0.55" filter="url(#progress-softBlur)" />
          <circle cx="440" cy="220" r="5" fill="#fff" filter="url(#progress-glow)" className="node-blink-orange" />

          {/* Floating Diagnostic Tag above core */}
          <g transform="translate(410, 172)">
            <rect x="0" y="0" width="60" height="15" rx="3.5" fill="rgba(24, 22, 21, 0.85)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8" />
            <text x="30" y="10" fill="#a855f7" fontSize="6.2" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ANALYZE: ON</text>
          </g>

          {/* Dash connection lines linking matrices */}
          <line x1="330" y1="220" x2="410" y2="220" stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="470" y1="220" x2="550" y2="220" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="2 3" />
        </g>

        {/* Left Side: Speech & STAR Framework Console (Centered at 260, 220) */}
        <g className="float-voice" style={{ transformOrigin: '260px 220px' }}>
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
          <rect x="190" y="150" width="140" height="140" rx="16" fill="url(#behavioral-panelFill)" stroke="url(#behavioral-borderGrad)" strokeWidth="1.5" filter="url(#progress-shadow)" />
          
          {/* STAR Framework Audio Radar Scope */}
          <circle cx="260" cy="220" r="50" fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="3" />
          <circle cx="260" cy="220" r="50" fill="none" stroke="url(#behavioral-borderGrad)" strokeWidth="1.5" className="radar-pulse" style={{ transformOrigin: '260px 220px' }} />

          {/* Crosshairs & Letters */}
          <line x1="260" y1="188" x2="260" y2="252" stroke="rgba(249,115,22,0.25)" strokeWidth="0.8" />
          <line x1="228" y1="220" x2="292" y2="220" stroke="rgba(249,115,22,0.25)" strokeWidth="0.8" />
          <circle cx="260" cy="220" r="30" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="0.8" strokeDasharray="2 2" />

          <text x="260" y="184" fill="#f97316" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">S</text>
          <text x="298" y="222.5" fill="#f97316" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">T</text>
          <text x="260" y="261" fill="#f97316" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A</text>
          <text x="222" y="222.5" fill="#f97316" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">R</text>

          {/* Glowing target nodes */}
          <circle cx="260" cy="202" r="3" fill="#f97316" className="node-blink-orange" />
          <circle cx="260" cy="238" r="3" fill="#a855f7" className="node-blink-blue" />
        </g>

        {/* Left Side Parameter Cartridges (STAR parameters) */}
        {/* TONE module */}
        <g className="float-param-1">
          <rect x="215" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="222" cy="79" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="82.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">SPEECH</text>
          <line x1="242" y1="88" x2="255" y2="150" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* SUBJECT module */}
        <g className="float-param-3">
          <rect x="215" y="350" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="222" cy="359" r="2" fill="#f97316" className="node-blink-orange" />
          <text x="230" y="362.5" fill="#fdba74" fontSize="6.2" fontWeight="bold" fontFamily="monospace">PACING</text>
          <line x1="245" y1="350" x2="255" y2="290" stroke="rgba(249,115,22,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        
        {/* Floating Mic Ready Badge */}
        <g className="float-param-2">
          <rect x="175" y="115" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.85)" stroke="rgba(249,115,22,0.35)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="183" cy="124" r="2.5" fill="#ea580c" className="node-blink-orange" />
          <text x="191" y="127" fill="#fdba74" fontSize="6" fontWeight="bold" fontFamily="monospace">MIC ON</text>
        </g>

        {/* Right Side: Technical Database & Concept Nexus (Centered at 620, 220) */}
        <g className="float-tech" style={{ transformOrigin: '620px 220px' }}>
          {/* Corner tech scope brackets */}
          <path d="M 540 142 L 540 132 L 550 132" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 142 L 700 132 L 690 132" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 540 298 L 540 308 L 550 308" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" fill="none" />
          <path d="M 700 298 L 700 308 L 690 308" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" fill="none" />

          {/* Glassmorphic Background Panel */}
          <rect x="550" y="150" width="140" height="140" rx="16" fill="url(#technical-panelFill)" stroke="url(#technical-borderGrad)" strokeWidth="1.5" filter="url(#progress-shadow)" />
          
          {/* Orbit rings & Satellite node */}
          <circle cx="620" cy="220" r="54" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="3 7" fill="none" className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }} />
          <g className="orbit-rotate-cw" style={{ transformOrigin: '620px 220px' }}>
            <circle cx="674" cy="220" r="3.2" fill="#3b82f6" filter="url(#progress-glow)" />
          </g>

          {/* System Design Stack / Database cylinders */}
          <g transform="translate(575, 170)">
            {/* Cylinder Stack 1 */}
            <rect x="0" y="0" width="90" height="16" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
            <circle cx="78" cy="8" r="2.5" fill="#10b981" className="node-blink-green" />
            <line x1="8" y1="8" x2="38" y2="8" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Cylinder Stack 2 */}
            <rect x="0" y="22" width="90" height="16" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
            <circle cx="78" cy="30" r="2.5" fill="#3b82f6" className="node-blink-blue" />
            <line x1="8" y1="30" x2="48" y2="30" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Cylinder Stack 3 */}
            <rect x="0" y="44" width="90" height="16" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.35)" strokeWidth="1" />
            <circle cx="78" cy="52" r="2.5" fill="#10b981" className="node-blink-green" />
            <line x1="8" y1="52" x2="28" y2="52" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* Concept flowchart nodes branching downwards */}
          <g>
            <line x1="620" y1="246" x2="595" y2="270" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" />
            <line x1="620" y1="246" x2="645" y2="270" stroke="rgba(96,165,250,0.4)" strokeWidth="1.2" />
            <circle cx="595" cy="270" r="4.5" fill="#3b82f6" stroke="#fff" strokeWidth="0.8" className="node-blink-blue" />
            <circle cx="645" cy="270" r="4.5" fill="#06b6d4" stroke="#fff" strokeWidth="0.8" className="node-blink-cyan" />
          </g>
        </g>

        {/* Right Side Parameter Cartridges */}
        {/* RESUME module */}
        <g className="float-param-2">
          <rect x="610" y="70" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="617" cy="79" r="2" fill="#3b82f6" className="node-blink-blue" />
          <text x="625" y="82.5" fill="#93c5fd" fontSize="6.2" fontWeight="bold" fontFamily="monospace">SYSTEM</text>
          <line x1="637" y1="88" x2="615" y2="150" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
        {/* SCORE module */}
        <g className="float-param-1">
          <rect x="610" y="350" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.8)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="617" cy="359" r="2" fill="#3b82f6" className="node-blink-blue" />
          <text x="625" y="362.5" fill="#93c5fd" fontSize="6.2" fontWeight="bold" fontFamily="monospace">CODING</text>
          <line x1="635" y1="350" x2="615" y2="290" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>

        {/* Floating Dev On tag badge */}
        <g className="float-param-3">
          <rect x="650" y="115" width="55" height="18" rx="4" fill="rgba(24, 22, 21, 0.85)" stroke="rgba(96,165,250,0.35)" strokeWidth="1" filter="url(#progress-shadow)" />
          <circle cx="658" cy="124" r="2.5" fill="#00c5ff" className="node-blink-cyan" />
          <text x="666" y="127" fill="#93c5fd" fontSize="6" fontWeight="bold" fontFamily="monospace">DEV ON</text>
        </g>

        {/* Left Floating Pacing Stats Card */}
        <g className="float-stats-left" style={{ transformOrigin: '215px 335px' }}>
          <rect x="180" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(251,146,60,0.25)" strokeWidth="1" backdrop-filter="blur(4px)" />
          <text x="188" y="324" fill="#f97316" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">SPEECH</text>
          <text x="188" y="337" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="system-ui, sans-serif">135 WPM</text>
          <path d="M 188 349 L 202 346 L 215 350 L 230 344 L 242 347" stroke="#22c55e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Right Floating Score Stats Card */}
        <g className="float-stats-right" style={{ transformOrigin: '645px 335px' }}>
          <rect x="610" y="310" width="70" height="50" rx="8" fill="rgba(29, 27, 26, 0.75)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" backdrop-filter="blur(4px)" />
          <text x="618" y="324" fill="#3b82f6" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.2px">RATING</text>
          <text x="618" y="337" fill="#fff" fontSize="10.5" fontWeight="bold" fontFamily="system-ui, sans-serif">92% AVG</text>
          
          {/* Mini animating bar graph */}
          <rect x="618" y="347" width="5" height="8" rx="1" fill="#3b82f6" className="bar-grow-1" style={{ transformOrigin: '620px 355px' }} />
          <rect x="627" y="345" width="5" height="10" rx="1" fill="#60a5fa" className="bar-grow-2" style={{ transformOrigin: '629px 355px' }} />
          <rect x="636" y="343" width="5" height="12" rx="1" fill="#93c5fd" className="bar-grow-3" style={{ transformOrigin: '638px 355px' }} />
          <rect x="645" y="346" width="5" height="9" rx="1" fill="#3b82f6" className="bar-grow-1" style={{ transformOrigin: '647px 355px' }} />
        </g>

        {/* Diagnostic Telemetry Logs */}
        <g opacity="0.65">
          {/* Top Left */}
          <text x="180" y="75" fill="#f97316" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[COACH_SYS // DEPLOYED]</text>
          <text x="180" y="87" fill="#fb923c" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[ACTIVE.SESSION // LIVE]</text>
          
          {/* Bottom Right */}
          <text x="590" y="375" fill="#3b82f6" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[EVALUATION // SYNCED]</text>
          <text x="590" y="387" fill="#60a5fa" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px">[STAR_METRICS // SYNTHESIS]</text>
          
          {/* Bottom Center Compiling indicator */}
          <text x="440" y="415" fill="#a855f7" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5px" textAnchor="middle" opacity="0.8">SPEECH COHERENCE FACTOR: {getPercent(0.15, 0.45)}%</text>
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
