"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "./Loader";

// ============================================================================
// LOADER CONFIGURATION
// ============================================================================
// Enforces a minimum display time (in milliseconds) for the page transition.
// Increase this (e.g., to 2000) to keep the loader visible longer.
// Decrease this (e.g., to 300) to hide it almost immediately when pages load.
const MIN_LOADING_DURATION = 700;
// ============================================================================

// Helper function to resolve the minimum loading duration
const getLoadingDuration = (): number => {
  if (typeof window !== "undefined") {
    // Check localStorage if you want to override dynamically during testing
    const stored = localStorage.getItem("cp_loader_duration");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
    // Check global window configuration
    const winDuration = (window as any).__cp_loader_duration;
    if (typeof winDuration === "number") return winDuration;
  }
  return MIN_LOADING_DURATION;
};

function GlobalLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const loadingStartRef = useRef<number | null>(null);

  // Monitor path and search param changes to hide the loader
  useEffect(() => {
    if (!loading) return;

    const start = loadingStartRef.current;
    if (start === null) {
      setLoading(false);
      return;
    }

    const duration = getLoadingDuration();
    const elapsed = Date.now() - start;

    if (elapsed >= duration) {
      setLoading(false);
      loadingStartRef.current = null;
    } else {
      const remainingTime = duration - elapsed;
      const timeoutId = setTimeout(() => {
        setLoading(false);
        loadingStartRef.current = null;
      }, remainingTime);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams, loading]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
        const isInternal = href.startsWith(window.location.origin) || href.startsWith(window.location.host);
        if (!isInternal) return;
      }

      // Ignore anchor fragments, mailto, tel, javascript links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      // Ignore key modifiers
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Ignore blank targets
      if (target.getAttribute("target") === "_blank") {
        return;
      }

      // Ignore if it matches current path and search params
      try {
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
          return;
        }
      } catch (err) {
        return;
      }

      // Record start time and display loader
      loadingStartRef.current = Date.now();
      setLoading(true);
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  if (!loading) return null;

  return <Loader overlay title="System" text="Loading..." />;
}

export default function GlobalPageLoader() {
  return (
    <Suspense fallback={null}>
      <GlobalLoaderContent />
    </Suspense>
  );
}
