import { cn } from "@/lib/utils";
import React from "react";

export default function GridBackgroundDemo() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes grid-drift {
          0% {
            background-position: 0px 0px, 0px 0px;
          }
          100% {
            background-position: 40px 40px, 40px 40px;
          }
        }

        @keyframes orange-travel {
          0% {
            transform: translate3d(-30vw, -10vh, 0) scale(1);
            opacity: 0.18;
          }
          20% {
            transform: translate3d(5vw, 0vh, 0) scale(1.08);
            opacity: 0.28;
          }
          45% {
            transform: translate3d(35vw, 8vh, 0) scale(1.18);
            opacity: 0.36;
          }
          70% {
            transform: translate3d(62vw, -4vh, 0) scale(1.12);
            opacity: 0.30;
          }
          100% {
            transform: translate3d(95vw, 10vh, 0) scale(1);
            opacity: 0.16;
          }
        }

        @keyframes orange-travel-2 {
          0% {
            transform: translate3d(85vw, 70vh, 0) scale(1);
            opacity: 0.12;
          }
          30% {
            transform: translate3d(55vw, 58vh, 0) scale(1.08);
            opacity: 0.18;
          }
          60% {
            transform: translate3d(25vw, 68vh, 0) scale(1.16);
            opacity: 0.24;
          }
          100% {
            transform: translate3d(-10vw, 74vh, 0) scale(1);
            opacity: 0.10;
          }
        }

        @keyframes center-pulse {
          0%, 100% {
            opacity: 0.14;
            transform: scale(1);
          }
          50% {
            opacity: 0.24;
            transform: scale(1.12);
          }
        }

        @keyframes grid-shine {
          0% {
            transform: translateX(-40%) skewX(-12deg);
            opacity: 0;
          }
          25% {
            opacity: 0.14;
          }
          50% {
            opacity: 0.24;
          }
          75% {
            opacity: 0.14;
          }
          100% {
            transform: translateX(150%) skewX(-12deg);
            opacity: 0;
          }
        }

        /* ── Mobile: replace animated background with a static,
           cheap version. All filter+blur+animation on fixed/large
           elements is the primary source of mobile GPU flicker. ── */
        @media (max-width: 767px) {
          .bg-grid-drift-1,
          .bg-grid-drift-2 {
            animation: none !important;
          }
          .bg-glow-orb-1,
          .bg-glow-orb-2,
          .bg-shine-sweep {
            display: none !important;
          }
          .bg-center-pulse {
            animation: none !important;
            opacity: 0.10 !important;
          }
        }
      `}</style>

      {/* Base grid */}
      <div
        className={cn(
          "absolute inset-0 bg-grid-drift-1",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(249,115,22,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.18)_1px,transparent_1px)]"
        )}
        style={{
          animation: "grid-drift 12s linear infinite",
        }}
      />

      {/* Brighter glow grid */}
      <div
        className={cn(
          "absolute inset-0 blur-[1px] bg-grid-drift-2",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(255,180,90,0.08)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,180,90,0.08)_2px,transparent_2px)]"
        )}
        style={{
          opacity: 0.95,
          animation: "grid-drift 18s linear infinite reverse",
        }}
      />

      {/* Main moving orange glow across screen — hidden on mobile */}
      <div
        className="absolute top-0 left-0 h-[46rem] w-[46rem] rounded-full bg-glow-orb-1"
        style={{
          background:
            "radial-gradient(circle, rgba(255,170,70,0.34) 0%, rgba(249,115,22,0.26) 24%, rgba(234,88,12,0.16) 46%, rgba(194,65,12,0.07) 62%, rgba(0,0,0,0) 76%)",
          filter: "blur(80px)",
          animation: "orange-travel 16s ease-in-out infinite alternate",
        }}
      />

      {/* Secondary moving orange glow — hidden on mobile */}
      <div
        className="absolute top-0 left-0 h-[34rem] w-[34rem] rounded-full bg-glow-orb-2"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,120,0.20) 0%, rgba(251,146,60,0.16) 28%, rgba(249,115,22,0.08) 54%, rgba(0,0,0,0) 74%)",
          filter: "blur(70px)",
          animation: "orange-travel-2 20s ease-in-out infinite alternate",
        }}
      />

      {/* Visible center orange atmosphere — static on mobile */}
      <div
        className="absolute inset-0 bg-center-pulse"
        style={{
          background:
            "radial-gradient(circle at center, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.10) 22%, rgba(249,115,22,0.04) 40%, transparent 58%)",
          animation: "center-pulse 7s ease-in-out infinite",
        }}
      />

      {/* Shine sweep — hidden on mobile */}
      <div
        className="absolute inset-y-0 -left-1/3 w-2/3 bg-shine-sweep"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,200,120,0.06) 44%, rgba(255,230,200,0.16) 50%, rgba(255,200,120,0.06) 56%, rgba(255,255,255,0) 64%, transparent 100%)",
          filter: "blur(14px)",
          animation: "grid-shine 7s linear infinite",
        }}
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(ellipse_at_center,transparent_12%,black)] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_12%,black)]" />
    </div>
  );
}