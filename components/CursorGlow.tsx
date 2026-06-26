"use client";

import { useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = 768;

export default function CursorGlow({ offset = 130 }: { offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;

    // Disable only on pure touch devices (primary pointer is coarse, i.e. no mouse at all)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      glow.style.display = "none";
      return;
    }

    // Disable on small screen widths (mobile breakpoint)
    const isMobileSize = () => window.innerWidth <= MOBILE_BREAKPOINT;

    const applyVisibility = () => {
      glow.style.display = isMobileSize() ? "none" : "";
    };

    applyVisibility();
    window.addEventListener("resize", applyVisibility, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileSize()) return;
      glow.style.transform = `translate3d(${e.clientX - offset}px, ${e.clientY - offset}px, 0)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", applyVisibility);
    };
  }, [offset]);

  return (
    <div
      ref={ref}
      className="cursor-glow pointer-events-none"
      style={{
        transform: "translate3d(-500px, -500px, 0)",
      }}
    />
  );
}
