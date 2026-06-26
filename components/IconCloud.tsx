"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ icons, images }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconPositionsRef = useRef<Icon[]>([]);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  const prevItemsRef = useRef<(React.ReactNode | string)[]>([]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return;

    const items = icons ?? images ?? [];

    // Check if items list actually changed to prevent resetting on parent re-renders
    const itemsChanged =
      items.length !== prevItemsRef.current.length ||
      items.some((item, idx) => item !== prevItemsRef.current[idx]);

    if (!itemsChanged) return;
    prevItemsRef.current = items;

    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 64;
      offscreen.height = 64;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        if (images) {
          // Handle image URLs directly
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = items[index] as string;
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

            // Create circular clipping path
            offCtx.beginPath();
            offCtx.arc(32, 32, 32, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();

            // Draw the image
            offCtx.drawImage(img, 0, 0, 64, 64);

            imagesLoadedRef.current[index] = true;
          };
        } else {
          // Handle SVG icons
          offCtx.scale(0.64, 0.64);
          const svgString = renderToString(item as React.ReactElement);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + btoa(svgString);
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, 0, 0);
            imagesLoadedRef.current[index] = true;
          };
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [icons, images]);

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = icons ?? images ?? [];
    const newIcons: Icon[] = [];
    const numIcons = items.length || 20;

    // Fibonacci sphere parameters
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * 150,
        y: y * 150,
        z: z * 150,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    iconPositionsRef.current = newIcons;
  }, [icons, images]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    iconPositionsRef.current.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvasRef.current!.width / 2 + rotatedX;
      const screenY = canvasRef.current!.height / 2 + rotatedY;

      const scale = (rotatedZ + 250) / 400;
      const radius = 32 * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z)
        );
        const targetY = Math.atan2(icon.x, icon.z);

        const currentX = rotationRef.current.x;
        const currentY = rotationRef.current.y;
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
        );

        const duration = Math.min(2000, Math.max(800, distance * 1000));

        targetRotationRef.current = {
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        };
        return;
      }
    });

    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePosRef.current = { x, y };
    }

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && isInView) {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const dx = mousePosRef.current.x - centerX;
        const dy = mousePosRef.current.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 0.003 + (distance / maxDistance) * 0.01;

        const targetRotationVal = targetRotationRef.current;
        if (targetRotationVal) {
          const elapsed = performance.now() - targetRotationVal.startTime;
          const progress = Math.min(1, elapsed / targetRotationVal.duration);
          const easedProgress = easeOutCubic(progress);

          rotationRef.current = {
            x:
              targetRotationVal.startX +
              (targetRotationVal.x - targetRotationVal.startX) * easedProgress,
            y:
              targetRotationVal.startY +
              (targetRotationVal.y - targetRotationVal.startY) * easedProgress,
          };

          if (progress >= 1) {
            targetRotationRef.current = null;
          }
        } else if (!isDraggingRef.current) {
          rotationRef.current = {
            x: rotationRef.current.x + (dy / canvas.height) * speed,
            y: rotationRef.current.y + (dx / canvas.width) * speed,
          };
        }

        iconPositionsRef.current.forEach((icon, index) => {
          const cosX = Math.cos(rotationRef.current.x);
          const sinX = Math.sin(rotationRef.current.x);
          const cosY = Math.cos(rotationRef.current.y);
          const sinY = Math.sin(rotationRef.current.y);

          const rotatedX = icon.x * cosY - icon.z * sinY;
          const rotatedZ = icon.x * sinY + icon.z * cosY;
          const rotatedY = icon.y * cosX + rotatedZ * sinX;

          const scale = (rotatedZ + 250) / 400;
          const opacity = Math.max(0.15, Math.min(1, (rotatedZ + 200) / 300));

          ctx.save();
          ctx.translate(
            canvas.width / 2 + rotatedX,
            canvas.height / 2 + rotatedY
          );
          ctx.scale(scale, scale);
          ctx.globalAlpha = opacity;

          if (icons || images) {
            // Only try to render icons/images if they exist
            if (
              iconCanvasesRef.current[index] &&
              imagesLoadedRef.current[index]
            ) {
              ctx.drawImage(iconCanvasesRef.current[index], -32, -32, 64, 64);
            }
          } else {
            // Show numbered circles if no icons/images are provided
            ctx.beginPath();
            ctx.arc(0, 0, 32, 0, Math.PI * 2);
            ctx.fillStyle = "#4444ff";
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "24px Arial";
            ctx.fillText(`${icon.id + 1}`, 0, 0);
          }

          ctx.restore();
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [icons, images, isInView]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="rounded-lg bg-transparent w-full h-full max-w-[400px] max-h-[400px]"
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

const IMAGES_LIST = slugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
);

export function IconCloudDemo() {
  return (
    <div className="relative flex w-full h-full items-center justify-center overflow-hidden bg-transparent">
      <IconCloud images={IMAGES_LIST} />
    </div>
  );
}
