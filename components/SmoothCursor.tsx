"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";

export interface SmoothCursorProps {
  cursor?: React.ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isTrackablePointer(pointerType: string) {
  return pointerType !== "touch";
}

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5, transformOrigin: "0 0" }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 40,
    stiffness: 400,
    mass: 0.5,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const velocityX = useVelocity(cursorX);
  const velocityY = useVelocity(cursorY);

  const targetRotation = useMotionValue(0);
  const rotation = useSpring(targetRotation, {
    ...springConfig,
    damping: 20,
    stiffness: 150,
  });

  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 200,
    damping: 22,
  });

  // Check if desktop pointer
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);
    const updateEnabled = () => setIsEnabled(mediaQuery.matches);
    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);
    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  // Hide browser cursor globally
  useEffect(() => {
    if (!isEnabled) return;
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [isEnabled]);

  // Main animation logic
  useAnimationFrame(() => {
    if (!isEnabled || !isVisible) return;

    const vx = velocityX.get();
    const vy = velocityY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);

    if (speed > 80) {
      // speed is in px/sec
      let angle = Math.atan2(vy, vx) * (180 / Math.PI) + 90;

      // Normalize angle to [-180, 180]
      if (angle > 180) angle -= 360;
      if (angle < -180) angle += 360;

      // Scale the tilt based on speed
      const tiltFactor = Math.min(speed / 400, 1);
      const targetAngle = angle * tiltFactor;
      targetRotation.set(targetAngle);
    } else {
      targetRotation.set(0);
    }

    // Dynamic scale based on speed (in px/sec)
    const targetScale = 1 - Math.min(speed * 0.00008, 0.15);
    scale.set(targetScale);
  });

  useEffect(() => {
    if (!isEnabled) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) return;
      
      // On first movement, initialize the cursor position to avoid flying from (0,0)
      if (!isVisible) {
        cursorX.jump(e.clientX);
        cursorY.jump(e.clientY);
        setIsVisible(true);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [isEnabled, isVisible, cursorX, cursorY]);

  if (!isEnabled) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        rotate: rotation,
        scale: scale,
        zIndex: 99999,
        pointerEvents: "none",
        willChange: "transform, opacity",
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      <div style={{ transform: "translate(-50%, -50%)" }}>
        {cursor}
      </div>
    </motion.div>
  );
}
