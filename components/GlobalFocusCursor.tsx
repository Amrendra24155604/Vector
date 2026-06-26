"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalFocusCursor() {
  const [focusedStyles, setFocusedStyles] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius: string;
  } | null>(null);

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    setIsEnabled(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsEnabled(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    let activeElement: HTMLElement | null = null;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true")
      ) {
        activeElement = target;

        const updateBounds = () => {
          if (!activeElement) return;
          const rect = activeElement.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(activeElement);
          setFocusedStyles({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
            borderRadius: computedStyle.borderRadius || "12px",
          });
        };

        updateBounds();

        window.addEventListener("scroll", updateBounds, { passive: true });
        window.addEventListener("resize", updateBounds, { passive: true });

        // Periodically monitor layout shifts
        const interval = setInterval(updateBounds, 150);

        (target as any)._focusCleanup = () => {
          window.removeEventListener("scroll", updateBounds);
          window.removeEventListener("resize", updateBounds);
          clearInterval(interval);
        };
      } else {
        setFocusedStyles(null);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target as any)._focusCleanup) {
        (target as any)._focusCleanup();
        delete (target as any)._focusCleanup;
      }
      
      setTimeout(() => {
        const active = document.activeElement;
        if (
          !active ||
          (active.tagName !== "INPUT" &&
            active.tagName !== "TEXTAREA" &&
            active.getAttribute("contenteditable") !== "true")
        ) {
          activeElement = null;
          setFocusedStyles(null);
        }
      }, 50);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (activeElement && (activeElement as any)._focusCleanup) {
        (activeElement as any)._focusCleanup();
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <AnimatePresence>
      {focusedStyles && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: focusedStyles.left - 1.5,
            y: focusedStyles.top - 1.5,
            width: focusedStyles.width + 3,
            height: focusedStyles.height + 3,
            borderRadius: focusedStyles.borderRadius,
          }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="absolute top-0 left-0 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.35)] pointer-events-none z-[99999]"
          style={{
            transformOrigin: "center center",
          }}
        />
      )}
    </AnimatePresence>
  );
}
