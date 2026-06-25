"use client";

import React from "react";
import FuzzyText from "@/components/FuzzyText";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden z-20">
      <div className="select-none flex flex-col items-center justify-center cursor-default">
        <FuzzyText
          baseIntensity={0.3}
          hoverIntensity={0.87}
          enableHover={true}
          fontSize="clamp(6rem, 20vw, 15rem)"
          fontWeight={950}
          color="#ffffff"
          glitchMode={true}
          glitchInterval={1800}
          glitchDuration={150}
          fuzzRange={30}
          direction="both"
          className="drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          404
        </FuzzyText>
        <FuzzyText
          baseIntensity={0.3}
          hoverIntensity={0.87}
          enableHover={true}
          fontSize="clamp(10rem, 10vw, 10rem)"
          fontWeight={950}
          color="#ffffff"
          glitchMode={true}
          glitchInterval={1800}
          glitchDuration={150}
          fuzzRange={30}
          direction="both"
          className="drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          not found
        </FuzzyText>
      </div>
    </main>
  );
}
