"use client";

import React, { useState, useRef, useEffect } from "react";

interface SleekDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
  menuWidth?: string;
  position?: "down" | "up";
  align?: "left" | "right";
}

export default function SleekDropdown({
  value,
  onChange,
  options,
  className = "",
  menuWidth,
  position = "down",
  align = "left"
}: SleekDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFullWidth = className.includes("w-full");

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${isFullWidth ? "w-full" : "w-fit flex-shrink-0"}`}
    >
      {/* Trigger Button: retains original style, size, and color */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex items-center justify-between text-left overflow-hidden`}
      >
        <span className="truncate">{value}</span>
        {/* Sleek minimal custom arrow */}
        <span
          className="material-symbols-outlined text-[12px] ml-1 opacity-60 transition-transform duration-200 flex-shrink-0"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
        >
          expand_more
        </span>
      </button>

      {/* Sleek Minimal Dropdown Options Box */}
      {isOpen && (
        <div
          className={`absolute z-[9999] rounded-xl bg-[#131110]/95 border border-orange-500/15 shadow-[0_12px_30px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden py-1`}
          style={{
            width: menuWidth || "100%",
            minWidth: "120px",
            ...(position === "up" ? { bottom: "100%", marginBottom: "4px" } : { top: "100%", marginTop: "4px" }),
            ...(align === "right" ? { right: 0 } : { left: 0 }),
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 text-stone-300 hover:text-white hover:bg-orange-500/8 transition-colors select-none text-[13px]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
