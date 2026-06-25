"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "hover" | "view" | "click";
  clickMode?: "once" | "toggle";
  revealDirection?: "start" | "end" | "center";
  sequential?: boolean;
  useOriginalCharsOnly?: boolean;
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,./<>?",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  revealDirection = "start",
  sequential = false,
  useOriginalCharsOnly = false,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(text.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasClickedOnce, setHasClickedOnce] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set of characters allowed for scrambling
  const getCharsPool = () => {
    if (useOriginalCharsOnly) {
      const pool = Array.from(new Set(text.replace(/\s/g, "").split("")));
      return pool.length > 0 ? pool : characters.split("");
    }
    return characters.split("");
  };

  const triggerAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    const charsPool = getCharsPool();
    const length = text.length;

    // Initially, space characters are considered revealed immediately so they don't scramble
    const initialRevealed = new Set<number>();
    text.split("").forEach((char, idx) => {
      if (char === " ") {
        initialRevealed.add(idx);
      }
    });
    setRevealedIndices(initialRevealed);

    // Build reveal sequence indices
    const nonSpaceIndices = Array.from({ length }, (_, idx) => idx).filter(
      (idx) => text[idx] !== " "
    );

    if (sequential) {
      // Sort reveal order based on revealDirection
      if (revealDirection === "end") {
        nonSpaceIndices.reverse();
      } else if (revealDirection === "center") {
        const center = (length - 1) / 2;
        nonSpaceIndices.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
      }

      let currentSequenceIndex = 0;
      let iterationsCount = 0;

      // Start interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setDisplayText((prev) => {
          const next = [...prev];
          
          // Scramble all unrevealed indices
          for (let i = 0; i < length; i++) {
            if (text[i] === " ") {
              next[i] = " ";
            } else if (initialRevealed.has(i) || nonSpaceIndices.slice(0, currentSequenceIndex).includes(i)) {
              next[i] = text[i];
            } else {
              next[i] = charsPool[Math.floor(Math.random() * charsPool.length)];
            }
          }

          // Advance current sequence character
          if (currentSequenceIndex < nonSpaceIndices.length) {
            iterationsCount++;
            const activeIndex = nonSpaceIndices[currentSequenceIndex];
            
            // Randomize active character on each tick
            next[activeIndex] = charsPool[Math.floor(Math.random() * charsPool.length)];

            if (iterationsCount >= maxIterations) {
              setRevealedIndices((prevSet) => {
                const newSet = new Set(prevSet);
                newSet.add(activeIndex);
                return newSet;
              });
              currentSequenceIndex++;
              iterationsCount = 0;
            }
          } else {
            // Animation finished
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsAnimating(false);
            setDisplayText(text.split(""));
            setRevealedIndices(new Set(Array.from({ length }, (_, i) => i)));
          }

          return next;
        });
      }, speed);
    } else {
      // Non-sequential: all characters scramble and resolve around the same time
      const iterationsLeft = new Map<number, number>();
      nonSpaceIndices.forEach((idx) => {
        const variations = Math.floor(Math.random() * 5);
        iterationsLeft.set(idx, maxIterations + variations);
      });

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        let allResolved = true;

        setDisplayText((prev) => {
          const next = [...prev];

          for (let i = 0; i < length; i++) {
            if (text[i] === " ") {
              next[i] = " ";
              continue;
            }

            const left = iterationsLeft.get(i);
            if (left !== undefined && left > 0) {
              allResolved = false;
              next[i] = charsPool[Math.floor(Math.random() * charsPool.length)];
              iterationsLeft.set(i, left - 1);
            } else {
              next[i] = text[i];
              setRevealedIndices((prevSet) => {
                if (!prevSet.has(i)) {
                  const newSet = new Set(prevSet);
                  newSet.add(i);
                  return newSet;
                }
                return prevSet;
              });
            }
          }

          if (allResolved) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsAnimating(false);
            setDisplayText(text.split(""));
            setRevealedIndices(new Set(Array.from({ length }, (_, i) => i)));
          }

          return next;
        });
      }, speed);
    }
  };

  useEffect(() => {
    if (animateOn === "view" && isInView) {
      triggerAnimation();
    }
  }, [isInView, animateOn]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (animateOn === "hover") {
      triggerAnimation();
    }
  };

  const handleClick = () => {
    if (animateOn === "click") {
      if (clickMode === "once" && hasClickedOnce) return;
      if (clickMode === "once") setHasClickedOnce(true);
      triggerAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`inline-block ${parentClassName}`}
      style={{ cursor: animateOn === "hover" ? "pointer" : "default" }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.map((char, index) => {
          const isRevealed = revealedIndices.has(index);
          return (
            <span
              key={index}
              className={isRevealed ? className : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
