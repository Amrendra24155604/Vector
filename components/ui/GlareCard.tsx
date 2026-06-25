"use client";

import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
}

export function GlareCard({
  children,
  className,
  glareColor = "rgba(255, 200, 120, 0.12)",
  glareOpacity = 1,
}: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt angles
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Glare position as percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 60%)`;
    glare.style.opacity = String(glareOpacity);
  }, [glareColor, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    glare.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 ease-out will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glare overlay */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
}
