"use client";
import React, { useId } from "react";

interface MovingWavyProgressProps {
  pct: number | string;
  color?: string;
  className?: string;
  trackColor?: string;
}

export function MovingWavyProgress({
  pct,
  color = "#f97316",
  className = "w-full mt-1.5",
  trackColor = "#221d1a"
}: MovingWavyProgressProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  
  const numericPct = typeof pct === "string" ? (parseFloat(pct) || 0) : pct;

  // Wavelength is 10. We build a repeating path of 15 cycles starting at -20
  let waveD = "M -20 5";
  for (let i = 0; i < 15; i++) {
    const startX = -20 + i * 10;
    waveD += ` Q ${startX + 2.5} 2.2 ${startX + 5} 5 Q ${startX + 7.5} 7.8 ${startX + 10} 5`;
  }

  return (
    <div className={`select-none relative h-3 overflow-visible ${className}`}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
        <defs>
          {/* Static Gradients to smoothly fade out the ends */}
          <linearGradient id={`trackGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={trackColor} stopOpacity="0" />
            <stop offset="6%" stopColor={trackColor} stopOpacity="1" />
            <stop offset="94%" stopColor={trackColor} stopOpacity="1" />
            <stop offset="100%" stopColor={trackColor} stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`progGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="8%" stopColor={color} stopOpacity="1" />
            <stop offset="92%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>

          {/* Clip path for progress bar width */}
          <clipPath id={`progClip-${id}`}>
            <rect x="0" y="0" width={numericPct} height="10" />
          </clipPath>
          
          <clipPath id={`trackClip-${id}`}>
            <rect x="0" y="0" width="100" height="10" />
          </clipPath>
        </defs>

        {/* CSS GPU-accelerated Infinite Scroll Animation */}
        <style>{`
          @keyframes flow-wave-${id} {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-10px, 0, 0);
            }
          }
          .animate-wave-${id} {
            animation: flow-wave-${id} 0.45s linear infinite;
          }
        `}</style>

        {/* Track Line - flat, straight background line */}
        <rect
          x="0"
          y="3.5"
          width="100"
          height="3"
          rx="1.5"
          fill={`url(#trackGrad-${id})`}
        />

        {/* Progress Wave */}
        {numericPct > 0 && (
          <g clipPath={`url(#progClip-${id})`}>
            <path
              d={waveD}
              fill="none"
              stroke={`url(#progGrad-${id})`}
              strokeWidth="1.8"
              strokeLinecap="round"
              className={`animate-wave-${id}`}
              style={{
                filter: `drop-shadow(0 0 2px ${color}dd)`,
              }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
