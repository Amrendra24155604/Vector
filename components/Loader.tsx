"use client";

import React from "react";

interface LoaderProps {
  title?: string;
  text?: string;
  overlay?: boolean;
}

export default function Loader({
  title = "Status",
  text = "Loading...",
  overlay = false,
}: LoaderProps) {
  React.useEffect(() => {
    if (overlay) {
      const preventDefault = (e: Event) => {
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        const keys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "End", "Home"];
        if (keys.includes(e.key)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      };

      document.documentElement.classList.add("no-scroll");
      document.body.classList.add("no-scroll");

      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
      window.addEventListener("keydown", preventScrollKeys, { passive: false });

      return () => {
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
        window.removeEventListener("keydown", preventScrollKeys);
      };
    }
  }, [overlay]);

  // Extract the base text and the trailing dots (if any)
  const match = text.match(/^(.*?)(\.*)$/);
  const baseText = match ? match[1] : text;
  const dots = match && match[2] ? match[2] : "";
  const dotsLen = dots.length;
  // #0f0 for green original
  const content = (
    <div className="cp-loader-container">
      <style>{`
        @keyframes cp-blinkCursor {
          50% {
            opacity: 0;
          }
        }

        @keyframes cp-dots-typing {
          0%, 25% {
            width: 0ch;
          }
          26%, 50% {
            width: 1ch;
          }
          51%, 75% {
            width: 2ch;
          }
          76%, 100% {
            width: 3ch;
          }
        }

        .cp-terminal-loader {
          border: 0.1em solid #333;
          background-color: #1a1a1a;
          color: #0f0;  
         
          font-family: "Courier New", Courier, monospace;
          font-size: 1.1rem;
          padding: 2.2em 1.5em 1.5em 1.5em;
          width: 14em;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.65), 0 0 20px rgba(0, 255, 0, 0.05);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          text-align: left;
        }

        .cp-terminal-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.8em;
          background-color: #333;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          padding: 0 0.8em;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 255, 0, 0.1);
        }

        .cp-terminal-controls {
          display: flex;
          gap: 0.4em;
          margin-left: auto;
        }

        .cp-control {
          display: inline-block;
          width: 0.6em;
          height: 0.6em;
          border-radius: 50%;
        }

        .cp-control.close {
          background-color: #e33;
        }

        .cp-control.minimize {
          background-color: #ee0;
        }

        .cp-control.maximize {
          background-color: #0b0;
        }

        .cp-terminal-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #eee;
        }

        .cp-text {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          margin-top: 0.6em;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .cp-text-dots {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          white-space: nowrap;
          /* Change 0.6s below to adjust the speed of the dots blinking (e.g. 0.3s for faster, 1.2s for slower) */
          animation: cp-dots-typing 0.5s infinite;
          width: 0ch;
        }

        .cp-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          background-color: #0f0;
          margin-left: 0.15em;
          animation: cp-blinkCursor 0.8s step-end infinite;
        }

        .cp-loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .cp-loader-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(12, 10, 9, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          animation: cp-fadeIn 0.3s ease-out forwards;
        }

        @keyframes cp-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 767px) {
          .cp-loader-overlay {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background-color: rgba(10, 8, 7, 0.97);
          }
        }
      `}</style>
      <div className="cp-terminal-loader">
        <div className="cp-terminal-header">
          <div className="cp-terminal-title">{title}</div>
          <div className="cp-terminal-controls">
            <div className="cp-control close" />
            <div className="cp-control minimize" />
            <div className="cp-control maximize" />
          </div>
        </div>
        <div className="cp-text">
          <span className="cp-text-base">{baseText}</span>
          {dotsLen > 0 && (
            <span
              className="cp-text-dots"
              style={{
                ["--dots-width" as any]: `${dotsLen}ch`,
                ["--dots-steps" as any]: dotsLen + 1,
              }}
            >
              {dots}
            </span>
          )}
          <span className="cp-cursor" />
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return <div className="cp-loader-overlay">{content}</div>;
  }

  return content;
}
