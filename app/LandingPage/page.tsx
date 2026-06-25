"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import GridBackgroundDemo from "../Background/page";
import { CanvasText } from "@/components/CanvasText";
import { InfiniteMovingCards } from "@/components/Infinite_moving";
import { MaskContainer } from "@/components/svg-mask";
import { AIBrainIcon } from "@/components/Sidebar";
import { useAuth, getAvatarProps } from "@/lib/auth";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import TargetCursor from "@/components/ui/TargetCursor";

const GlobeComponent = dynamic(() => import("@/components/GlobeComponent"), {
  ssr: false,
  loading: () => (
    <div className="relative flex flex-col justify-center items-center rounded-3xl p-6 md:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full h-[24rem] sm:h-[32rem] mx-auto overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.03)] animate-pulse">
      <div className="text-stone-400 font-mono text-xs sm:text-sm uppercase tracking-widest">
        Loading Global Opportunity Hub...
      </div>
    </div>
  ),
});

const IconCloudComponent = dynamic(() => import("@/components/IconCloud").then((m) => m.IconCloudDemo), {
  ssr: false,
  loading: () => (
    <div className="relative flex justify-center items-center rounded-3xl p-6 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full h-[20rem] sm:h-[28rem] mx-auto overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.03)] animate-pulse">
      <div className="text-stone-500 font-mono text-xs uppercase tracking-widest">
        Loading Skills Cloud...
      </div>
    </div>
  ),
});

import { MovingWavyProgress } from "@/components/MovingWavyProgress";
import FuzzyText from "@/components/FuzzyText";
import { Terminal } from "@/components/ui/terminal";
import LightRays from "@/components/ui/LightRays";
import { GlareCard } from "@/components/GlareCard";

const Lanyard = dynamic(() => import("@/components/ui/Lanyard"), {
  ssr: false,
});


// Custom Magnetic Button component matching the Vector design system
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    const distance = Math.sqrt(x * x + y * y);

    if (distance < 120) {
      setPosition({ x: x * 0.35, y: y * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const targetIndexRef = useRef(-1);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const childWrapper = container.firstElementChild;
    if (!childWrapper) return;

    const children = childWrapper.children;
    const containerCenter = container.scrollTop + container.clientHeight / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetTop + child.clientHeight / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    const mappedCard = closestIndex - 1;
    setActiveCard(mappedCard);

    if (!isAnimating.current) {
      targetIndexRef.current = mappedCard;
    }
  };

  useEffect(() => {
    const container = scrollAreaRef.current;
    const scrollContainer = leftScrollRef.current;
    if (!container || !scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const childWrapper = scrollContainer.firstElementChild;
      if (!childWrapper) return;
      const children = childWrapper.children;

      const delta = e.deltaY;
      const direction = delta > 0 ? 1 : -1;
      const nextCard = targetIndexRef.current + direction;
      const targetChildIndex = nextCard + 1;

      if (targetChildIndex >= 0 && targetChildIndex < children.length) {
        e.preventDefault();

        if (isAnimating.current || Math.abs(delta) < 10) {
          return;
        }

        isAnimating.current = true;
        targetIndexRef.current = nextCard;

        const targetChild = children[targetChildIndex] as HTMLElement;
        if (targetChild) {
          const targetScrollTop = targetChild.offsetTop - (scrollContainer.clientHeight - targetChild.clientHeight) / 2;
          scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          });
          setActiveCard(nextCard);
        }

        setTimeout(() => {
          isAnimating.current = false;
        }, 800);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const childWrapper = scrollContainer.firstElementChild;
      if (!childWrapper) return;
      const children = childWrapper.children;

      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY.current - touchEndY;

      if (Math.abs(diffY) > 5) {
        const direction = diffY > 0 ? 1 : -1;
        const nextCard = targetIndexRef.current + direction;
        const targetChildIndex = nextCard + 1;

        if (targetChildIndex >= 0 && targetChildIndex < children.length) {
          e.preventDefault();

          if (isAnimating.current) return;

          if (Math.abs(diffY) > 45) {
            isAnimating.current = true;
            targetIndexRef.current = nextCard;

            const targetChild = children[targetChildIndex] as HTMLElement;
            if (targetChild) {
              const targetScrollTop = targetChild.offsetTop - (scrollContainer.clientHeight - targetChild.clientHeight) / 2;
              scrollContainer.scrollTo({
                top: targetScrollTop,
                behavior: "smooth",
              });
              setActiveCard(nextCard);
            }

            setTimeout(() => {
              isAnimating.current = false;
            }, 800);
          }
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [content.length]);

  const backgroundColors = [
    "rgba(24, 22, 21, 0.5)", // Var `--cp-bg`
    "#151312", // Var `--cp-surface`
    "#1d1b1a", // Var `--cp-surface-low`
    "#110f0e",
    "#080706",
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #ea580c, #f97316)", // header gradient
    "linear-gradient(to bottom right, #f97316, #ea580c)", // orange gradient
    "linear-gradient(to bottom right, #ea580c, #3b82f6)", // orange-to-blue
    "linear-gradient(to bottom right, #3b82f6, #1e40af)", // blue gradient
    "linear-gradient(to bottom right, #f59e0b, #f97316)", // amber-to-orange
  ];

  const timelinePhotos = [
    // Header Photo (overview dashboard blueprint)
    (
      <div className="w-full h-full bg-[#181615]/50 backdrop-blur-md rounded-xl p-5 lg:p-8 border border-orange-500/20 flex flex-col justify-between select-none relative overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.03)]">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731608_1px,transparent_1px),linear-gradient(to_bottom,#f9731608_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-880 pb-3">
            <span className="text-xs lg:text-sm font-mono text-orange-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              SYSTEM BLUEPRINT v2.0
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
              ACTIVE
            </span>
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex justify-between text-[11px] font-mono text-stone-400">
              <span>Timeline Tracking</span>
              <span>12 Month Cycle</span>
            </div>
            <div className="h-7 w-full bg-stone-950 rounded-lg border border-stone-905 p-0.5 overflow-hidden flex">
              <div className="h-full w-1/4 bg-orange-500/80 border-r border-stone-950 flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold">M1-3</div>
              <div className="h-full w-1/4 bg-orange-500/60 border-r border-stone-950 flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold">M4-6</div>
              <div className="h-full w-1/4 bg-orange-500/40 border-r border-stone-950 flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold">M7-9</div>
              <div className="h-full w-1/4 bg-orange-500/20 flex items-center justify-center text-[9px] font-mono text-stone-300 font-bold">M10-12</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-stone-950/45 border border-stone-900 p-3 rounded-lg flex flex-col justify-center">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Readiness Goal</span>
              <span className="text-lg font-bold font-mono text-white mt-1">95%+</span>
            </div>
            <div className="bg-stone-950/45 border border-stone-900 p-3 rounded-lg flex flex-col justify-center">
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Success Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-450 mt-1">98.4%</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-[10px] font-mono text-stone-600 uppercase tracking-wider text-right border-t border-stone-900 pt-3">
          Vector Telemetry Overview
        </div>
      </div>
    ),
    // Step photos
    ...content.map(item => item.content)
  ];

  const activePhotoIndex = activeCard + 1;

  return (
    <motion.div
      ref={outerRef}
      animate={{
        backgroundColor: backgroundColors[activePhotoIndex % backgroundColors.length],
      }}
      className="relative flex flex-col h-auto lg:h-[42rem] justify-start rounded-3xl p-5 lg:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full mx-auto shadow-[0_0_30px_rgba(249,115,22,0.03)]"
    >
      {/* Component Heading inside the boundary at the top */}
      <div
        className="mb-4 lg:mb-8 text-center space-y-2 lg:space-y-4 border-b border-orange-500/10 pb-4 lg:pb-6 flex-shrink-0"
      >
        <h2 className="font-mono text-2xl lg:text-4xl font-black text-white tracking-tight uppercase">Placement Roadmap</h2>
        <p className="font-body-md text-stone-400 text-xs lg:text-base max-w-xl mx-auto">
          A structured timeline designed to systematically guide you from foundation prep to landing your target placement offer.
        </p>
      </div>

      {/* Mobile static layout (visible on mobile only) */}
      <div className="block lg:hidden space-y-4 mt-2 w-full">
        {/* Intro Header Card content */}
        <div className="bg-[#181615]/75 border border-orange-500/30 p-4 rounded-2xl space-y-2.5">
          <h3 className="font-mono text-base font-bold text-white tracking-tight uppercase">
            YOUR YEAR TO LANDING THE OFFER
          </h3>
          <p className="font-body-md text-stone-400 text-[11px] leading-relaxed">
            Scroll down to see how you can systematically use Vector&apos;s tools over the next 12 months to go from zero prep to placement.
          </p>
          <div className="w-full max-w-md h-48 select-none mx-auto pt-2">
            {timelinePhotos[0]}
          </div>
        </div>

        {/* Steps */}
        {content.map((item, index) => {
          // First card has lighter orange-ish background
          const isFirst = index === 0;
          const cardBg = isFirst ? "bg-[#181615]/75 border-orange-500/30" : "bg-[#151312]/90 border-orange-500/10";
          return (
            <div key={index} className={cn("p-4 rounded-2xl border space-y-2.5", cardBg)}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                  STEP {index + 1}
                </span>
              </div>
              <h3 className="text-sm font-bold font-mono text-white tracking-tight uppercase">
                {item.title}
              </h3>
              <p className="text-stone-400 font-body-md text-[11px] leading-relaxed">
                {item.description}
              </p>
              <div className="w-full max-w-md h-48 select-none mx-auto pt-2">
                {item.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop scrolling layout (hidden on mobile) */}
      <div
        ref={scrollAreaRef}
        className="hidden lg:flex flex-1 justify-center lg:gap-12 gap-0 overflow-hidden h-full w-full"
      >
        <div
          onScroll={handleScroll}
          ref={leftScrollRef}
          className="relative w-full lg:max-w-2xl h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory touch-pan-y custom-scrollbar"
        >
          <div className="w-full overflow-x-hidden">
            {/* Header block */}
            <div className="h-[32rem] lg:h-[28rem] flex flex-col justify-center snap-center snap-always flex-shrink-0 border-b border-stone-900/60 pb-10">
              <h2 className="font-mono text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                YOUR YEAR TO LANDING THE OFFER
              </h2>
              <p className="font-body-md text-stone-450 leading-relaxed text-sm md:text-base max-w-xl">
                Scroll down to see how you can systematically use Vector&apos;s tools over the next 12 months to go from zero prep to placement.
              </p>
              {/* Mobile View Inline Graphic for Header */}
              <motion.div
                initial={{ opacity: 0.4, scale: 0.95 }}
                animate={{
                  opacity: activeCard === -1 ? 1 : 0.4,
                  scale: activeCard === -1 ? 1 : 0.95,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="mt-4 w-full lg:hidden block max-w-md h-56 select-none"
              >
                {timelinePhotos[0]}
              </motion.div>
            </div>

            {content.map((item, index) => (
              <div
                key={item.title + index}
                className="h-[32rem] lg:h-[28rem] flex flex-col justify-center snap-center snap-always flex-shrink-0"
              >
                <motion.h2
                  initial={{ opacity: 0.3, x: -8 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    x: activeCard === index ? 0 : -8,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight uppercase"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0.3, x: -8 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    x: activeCard === index ? 0 : -8,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  className="text-stone-400 font-body-md mt-6 leading-relaxed text-sm md:text-base max-w-md"
                >
                  {item.description}
                </motion.p>

                {/* Mobile View Inline Graphic */}
                <motion.div
                  initial={{ opacity: 0.4, scale: 0.95 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.4,
                    scale: activeCard === index ? 1 : 0.95,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className="mt-4 w-full lg:hidden block max-w-md h-56 select-none"
                >
                  {item.content}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "hidden lg:block h-[26rem] w-[34rem] rounded-2xl flex-shrink-0 relative overflow-hidden bg-stone-950 border border-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.05)] p-6",
            contentClassName,
          )}
        >
          {/* Animated Gradient Backgrounds cross-fading */}
          {linearGradients.map((grad, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 pointer-events-none"
              style={{ background: grad }}
              animate={{ opacity: activePhotoIndex % linearGradients.length === i ? 0.15 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ))}

          <div className="w-full h-full flex items-center justify-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -15 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="w-full h-full"
              >
                {timelinePhotos[activePhotoIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Transparent overlay to capture all pointer/scroll events without unmounting */}
          <div className="absolute inset-0 z-20 bg-transparent pointer-events-auto" />
        </div>
      </div>
    </motion.div>
  );
};

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: any, info: any) {
    const isSwipe =
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity ||
      Math.abs(info.velocity.x) > 500 ||
      Math.abs(info.velocity.y) > 500;

    if (isSwipe) {
      onSendToBack();
      // Instantly reset coordinates to 0 so when the card is moved to the bottom of the deck, it starts centered
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="card-rotate-disabled" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    setMounted(true);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>(() => {
    if (cards.length) {
      return cards.map((content, index) => ({ id: index + 1, content }));
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })));
    }
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack(prev => {
      const newStack = [...prev];
      const index = newStack.findIndex(card => card.id === id);
      if (index === -1) return prev;
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only capture horizontal scrolls/swipes on trackpads/tilt-wheels
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
        return; // Bubble vertical scroll events to scroll the webpage naturally
      }

      if (Math.abs(e.deltaX) < 15) return; // ignore micro-scrolls

      e.preventDefault(); // prevent any horizontal swipe navigation behaviors

      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      setStack(prev => {
        if (prev.length <= 1) return prev;
        const newStack = [...prev];
        const [card] = newStack.splice(newStack.length - 1, 1);
        newStack.unshift(card);
        return newStack;
      });

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 500);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [stack.length]);

  return (
    <div
      ref={containerRef}
      className="stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = (mounted && randomRotation) ? Math.random() * 10 - 5 : 0;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="card"
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}

const stickyScrollContent = [
  {
    title: "Months 1–3: Foundation & ATS Optimization",
    description: "Map your target pathway (Software Engineering, PM, Analyst, or Designer) and run initial audits on your resume. Scan and score your resume against placement keywords using Vector's diagnostic tools to bypass automated ATS recruiter filters while matching your target company expectations. Identify critical skill gaps early and layout a study plan.",
    content: (
      <div className="w-full h-full bg-[#181615]/50 backdrop-blur-md rounded-xl p-5 lg:p-8 border border-orange-500/20 flex flex-col justify-between select-none shadow-[0_0_20px_rgba(249,115,22,0.03)]">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-stone-850 pb-3">
            <span className="text-xs lg:text-sm font-mono text-orange-300 uppercase tracking-widest">ATS Scan Profile</span>
            <span className="text-sm lg:text-base font-mono font-bold text-emerald-450 px-2.5 py-1 rounded bg-emerald-500/10">84/100</span>
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-3 w-3/4 bg-stone-800 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-stone-800 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-stone-850 rounded" />
          </div>
          <div className="space-y-2.5 pt-4">
            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Python & SQL skills matched</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Missing PM frameworks (Actionable)</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] lg:text-xs font-mono text-stone-600 uppercase tracking-wider text-right">Vector Resume Analyser v1</div>
      </div>
    )
  },
  {
    title: "Months 4–6: Technical Mocks & Speech Cadence",
    description: "Transition to active interview training, building your confidence across specialized technical and emotional intelligence tracks. Refine speech delivery, pacing, filler-word elimination, and facial expressions with real-time audio coach telemetry feedback. Make use of live cadence cues to achieve speech flow.",
    content: (
      <div className="w-full h-full bg-[#151312]/90 backdrop-blur-md rounded-xl p-5 lg:p-8 border border-orange-500/10 flex flex-col justify-between select-none">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-stone-855 pb-3">
            <span className="text-xs lg:text-sm font-mono text-orange-300 uppercase tracking-widest">AI Interview Coach</span>
            <span className="text-xs font-mono text-emerald-450 uppercase tracking-wider animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
              Active Session
            </span>
          </div>
          <div className="flex items-end justify-center gap-2 py-4 h-24 lg:h-36">
            {[35, 65, 90, 50, 40, 70, 45, 85, 25, 60, 40].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h - 8, h + 8, h - 8] }}
                transition={{ duration: 1.2 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                style={{ height: `${h}%` }}
                className="w-1.5 bg-gradient-to-t from-orange-500 to-amber-400 rounded-full"
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-stone-400 font-mono">
            <span>Pacing: 135 WPM</span>
            <span>Filler: 2 (Excellent)</span>
          </div>
        </div>
        <div className="text-[10px] lg:text-xs font-mono text-stone-600 uppercase tracking-wider text-right">Readiness Score: 86%</div>
      </div>
    )
  },
  {
    title: "Months 7–9: Outbound Outreach & Networking",
    description: "Initiate direct networking campaigns to college alumni, recruiters, and target hiring teams to secure referral opportunities. Deploy the Cold Outreach generator to write personal LinkedIn pitches and email letters that get responses. Track active open-rates and connection confirmations.",
    content: (
      <div className="w-full h-full bg-[#151312]/90 backdrop-blur-md rounded-xl p-5 lg:p-8 border border-orange-500/10 flex flex-col justify-between select-none">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-stone-855 pb-3">
            <span className="text-xs lg:text-sm font-mono text-orange-300 uppercase tracking-widest">Outreach generator</span>
            <span className="text-xs font-mono text-stone-450 cursor-pointer hover:text-white transition-colors">Copy Template</span>
          </div>
          <div className="text-[11px] lg:text-xs text-stone-300 font-mono leading-relaxed bg-stone-950/60 p-3 lg:p-5 rounded-xl border border-stone-900 space-y-2">
            <div className="text-stone-500 border-b border-stone-900 pb-1">To: alumni@company.com</div>
            <p className="pt-1">
              Subject: Alumni Referral Request<br /><br />
              Hi Amit, I saw your work at Stripe and wanted to ask for advice on junior product roles...
            </p>
          </div>
        </div>
        <div className="text-[10px] lg:text-xs font-mono text-stone-600 uppercase tracking-wider text-right">Response Rate: 72%</div>
      </div>
    )
  },
  {
    title: "Months 10–12: Offer Lock-In & Career Launch",
    description: "Excel in partner/manager rounds, handle company assessment checks, and secure your final target employment offer. Verify target alignment, complete on-boarding modules, and transition cleanly into your new role with placement probability statistics backing you.",
    content: (
      <div className="w-full h-full bg-[#151312]/90 backdrop-blur-md rounded-xl p-5 lg:p-8 border border-orange-500/10 flex flex-col justify-between select-none">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-stone-855 pb-3">
            <span className="text-xs lg:text-sm font-mono text-orange-300 uppercase tracking-widest">Placement Status</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 lg:p-8 rounded-2xl text-center space-y-3 lg:space-y-4">
            <span className="material-symbols-outlined text-emerald-400 text-3xl lg:text-5xl animate-bounce">celebration</span>
            <div className="space-y-1.5">
              <h6 className="text-white font-bold text-sm lg:text-base font-mono">Offer Confirmed</h6>
              <p className="text-xs text-stone-400">Stripe - Associate PM</p>
            </div>
          </div>
        </div>
        <div className="text-[10px] lg:text-xs font-mono text-stone-600 uppercase tracking-wider text-right">Vector placement Engine</div>
      </div>
    )
  }
];

const faqCardsData = [
  {
    question: "How does the AI Mock Interview feedback work?",
    answer: "Our system analyzes both your verbal responses, structural reasoning, and speech cadence (including facial/emotional expressions if camera is enabled) in real time. We score your performance against 100+ diagnostic metrics and suggest better phrasing or action structures based on top-performing industry models. Get immediate guidance on filler word usage, speaking pace, and content delivery.",
    category: "INTERVIEWS",
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 50 H90 M50 10 V90" strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.2)" />
        <circle cx="50" cy="50" r="40" stroke="rgba(249, 115, 22, 0.2)" />
        <path d="M30 50 C 35 20, 40 80, 45 50 C 50 20, 55 80, 60 50 C 65 30, 70 70, 75 50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="50" r="3" fill="#f97316" />
        <circle cx="75" cy="50" r="3" fill="#f97316" />
        <path d="M20 35 H25 M20 65 H25 M80 35 H75 M80 65 H75" strokeWidth="2" />
      </svg>
    )
  },
  {
    question: "Can I tailor interviews to specific roles or companies?",
    answer: "Yes, Vector supports over 500+ specialized tracks. You can select specific pathways (such as Software Engineering, Product Management, Investment Banking, Consulting, or UX Design) and target top-tier companies (like Google, Stripe, McKinsey, Goldman Sachs). We dynamically compile interview question banks that mimic active corporate hiring cycles.",
    category: "SPECIALIZATION",
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="15" y="15" width="70" height="70" rx="6" stroke="rgba(249, 115, 22, 0.2)" />
        <path d="M50 15 V85 M15 50 H85" strokeDasharray="4 4" stroke="rgba(249, 115, 22, 0.15)" />
        <circle cx="50" cy="50" r="18" strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill="#f97316" />
        <path d="M30 30 L40 40 M70 30 L60 40 M30 70 L40 60 M70 70 L60 60" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="30" r="3" fill="currentColor" />
        <circle cx="70" cy="30" r="3" fill="currentColor" />
        <circle cx="30" cy="70" r="3" fill="currentColor" />
        <circle cx="70" cy="70" r="3" fill="currentColor" />
      </svg>
    )
  },
  {
    question: "Is the resume analyzer optimized for ATS scanners?",
    answer: "Absolutely. The analyzer runs direct parser checks against common Applicant Tracking System (ATS) rules, identifying complex layout issues, column parsing errors, formatting anomalies, and missing high-impact keywords. Get an instant score and step-by-step optimization recommendations to bypass automated HR screening filters.",
    category: "RESUME",
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M25 15 H65 L75 25 V85 H25 Z" strokeWidth="2" />
        <path d="M35 30 H55 M35 45 H65 M35 60 H65 M35 75 H50" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 50 H80" stroke="#f97316" strokeWidth="2.5" className="animate-pulse" />
        <path d="M65 15 V25 H75" />
      </svg>
    )
  },
  {
    question: "How does the Cold Email & Outreach generator work?",
    answer: "It reads your profile target, target industry, and career experience level to compile custom outreach templates for LinkedIn or email. The generator writes organic, personalized message pitches tailored for alumni, hiring managers, or recruiters that achieve up to 72% response rates in test cohorts.",
    category: "OUTREACH",
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 25 H85 V75 H15 Z" strokeWidth="2" />
        <path d="M15 25 L50 52 L85 25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 52 V85" strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.3)" />
        <path d="M70 60 L80 65 L70 70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="55" y1="65" x2="80" y2="65" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
];

const faqCards = faqCardsData.map((faq, idx) => (
  <div key={idx} className="w-full h-full bg-[#151312]/95 border border-orange-500/20 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none relative shadow-[0_0_25px_rgba(249,115,22,0.04)]">
    {/* Grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731604_1px,transparent_1px),linear-gradient(to_bottom,#f9731604_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl pointer-events-none" />

    <div className="relative z-10 space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center border-b border-stone-800/80 pb-2 sm:pb-3">
        <span className="text-[10px] sm:text-xs font-mono text-orange-300 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          FAQ // {faq.category}
        </span>
        <span className="text-[9px] sm:text-[10px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-850">
          CARD {idx + 1}/4
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 pt-1 sm:pt-2">
        {/* Visual SVG Icon wrapper inside high-tech viewport capsule */}
        <div className="flex-shrink-0 bg-stone-950/80 p-2 sm:p-3 rounded-2xl border border-stone-850/65 shadow-[inset_0_0_12px_rgba(249,115,22,0.05)] text-orange-400">
          {faq.icon}
        </div>

        <div className="space-y-1.5 sm:space-y-3 flex-1">
          <h3 className="font-mono text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight uppercase leading-snug">
            {faq.question}
          </h3>
          <p className="font-body-md text-stone-400 text-[11px] sm:text-sm md:text-base leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>

    <div className="relative z-10 flex justify-between items-center text-xs font-mono text-stone-500 border-t border-stone-900/80 pt-4 mt-2">
      <span className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px]">swipe</span>
        Swipe / Drag / Click to cycle
      </span>
      <span className="text-orange-400/50 uppercase tracking-widest">Vector Coaching</span>
    </div>
  </div>
));

const MockCoachSkeleton = () => (
  <div className="h-full w-full rounded-xl bg-stone-950/80 border border-stone-850/80 flex items-center justify-center gap-1.5 p-4 relative overflow-hidden select-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f9731608,transparent_60%)]" />
    {[35, 65, 90, 50, 40, 70, 45, 85, 25, 60, 40].map((h, i) => (
      <motion.div
        key={i}
        animate={{ height: [h - 8, h + 8, h - 8] }}
        transition={{ duration: 1.2 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
        style={{ height: `${h}%` }}
        className="w-1.5 md:w-2 bg-gradient-to-t from-orange-500 to-amber-400 rounded-full"
      />
    ))}
  </div>
);

const ResumeScannerSkeleton = () => (
  <div className="h-full w-full rounded-xl bg-stone-950/80 border border-stone-850/80 p-4 md:p-6 flex flex-col justify-between relative overflow-hidden select-none">
    <div className="space-y-2.5">
      <div className="h-2.5 w-1/3 bg-orange-500/20 rounded" />
      <div className="h-2 w-3/4 bg-stone-800 rounded" />
      <div className="h-2 w-5/6 bg-stone-800 rounded" />
      <div className="h-2 w-1/2 bg-stone-850 rounded" />
    </div>
    <div className="space-y-2">
      <div className="h-2 w-2/3 bg-stone-800 rounded" />
      <div className="h-2.5 w-1/2 bg-emerald-500/20 rounded" />
    </div>
    <motion.div
      animate={{ top: ["0%", "95%", "0%"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-0 right-0 h-[1.5px] bg-orange-400 shadow-[0_0_8px_#f97316] pointer-events-none"
    />
  </div>
);

const OutreachSkeleton = () => (
  <div className="h-full w-full rounded-xl bg-stone-950/80 border border-stone-850/80 p-4 md:p-6 flex flex-col justify-center items-center relative overflow-hidden select-none">
    <motion.div
      animate={{ scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-orange-400 relative z-10 flex flex-col items-center gap-2"
    >
      <span className="material-symbols-outlined text-4xl animate-pulse">mail</span>
      <span className="text-[10px] font-mono text-stone-500 tracking-widest uppercase">OUTBOUND GENERATOR</span>
    </motion.div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#f9731603_60%,transparent_70%)] pointer-events-none" />
  </div>
);

const TelemetrySkeleton = () => (
  <div className="h-full w-full rounded-xl bg-stone-950/80 border border-stone-850/80 p-4 flex flex-col justify-between relative overflow-hidden select-none">
    <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 border-b border-stone-900 pb-2">
      <span>READINESS STATUS</span>
      <span className="text-emerald-450">ACTIVE</span>
    </div>
    <div className="flex-1 flex items-end gap-2.5 pt-3">
      {[45, 60, 55, 75, 90, 85].map((h, i) => (
        <div key={i} className="flex-1 bg-stone-900 rounded-t-sm h-full flex flex-col justify-end">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
            className="w-full bg-orange-500/60 hover:bg-orange-500 rounded-t-sm"
          />
        </div>
      ))}
    </div>
  </div>
);

const PathwaySkeleton = () => (
  <div className="h-full w-full rounded-xl bg-stone-950/80 border border-stone-850/80 p-4 flex flex-col justify-between relative overflow-hidden select-none">
    <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 pb-2">
      <span>PATHWAY COMPILER</span>
      <span>v1.2</span>
    </div>
    <div className="flex-1 flex flex-col gap-2.5 justify-center relative">
      <div className="flex justify-between text-[11px] font-mono text-stone-400">
        <span>Software Engineering</span>
        <span className="text-orange-400">80% Match</span>
      </div>
      <div className="h-1.5 w-full bg-stone-900 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
        />
      </div>
      <div className="flex justify-between text-[11px] font-mono text-stone-400">
        <span>Investment Banking</span>
        <span className="text-stone-500">20% Match</span>
      </div>
      <div className="h-1.5 w-full bg-stone-900 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "20%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-stone-800"
        />
      </div>
    </div>
  </div>
);

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export interface CardsProps {
  spring?: SpringConfig;
  activeScale?: number;
  cardSpacing?: number;
}

type CareerCard = {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className: string;
  tag: string;
  config: {
    y: number;
    x: number;
    rotate: number;
    zIndex: number;
  };
};

const defaultCardsSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

export const CareerToolsCards = ({
  spring = defaultCardsSpring,
  activeScale = 1.15,
  cardSpacing = 180,
}: CardsProps = {}) => {
  const cards: CareerCard[] = [
    {
      title: "AI Mock Coach",
      description:
        "Practice realistic technical and behavioral interviews with a real-time voice, pacing, and cadence telemetry coach.",
      skeleton: <MockCoachSkeleton />,
      className: "border-orange-500/25",
      tag: "Interview Prep",
      config: {
        y: -20,
        x: 0,
        rotate: -15,
        zIndex: 2,
      },
    },
    {
      title: "ATS Analyzer",
      description:
        "Audit layout parsing, keyword density, and skill gaps against active job specifications to bypass automatic filters.",
      skeleton: <ResumeScannerSkeleton />,
      className: "border-emerald-500/25",
      tag: "Resume Audit",
      config: {
        y: 20,
        x: 180,
        rotate: 8,
        zIndex: 3,
      },
    },
    {
      title: "Outreach Builder",
      description:
        "Create organic and highly personalized LinkedIn outreach templates or email messages for alumni referrals in seconds.",
      skeleton: <OutreachSkeleton />,
      className: "border-blue-500/25",
      tag: "Networking",
      config: {
        y: -80,
        x: 360,
        rotate: -5,
        zIndex: 4,
      },
    },
    {
      title: "Progress Telemetry",
      description:
        "Monitor your placement probability index, mock coaching history, and preparation milestones dynamically.",
      skeleton: <TelemetrySkeleton />,
      className: "border-amber-500/25",
      tag: "Tracking",
      config: {
        y: 20,
        x: 540,
        rotate: 12,
        zIndex: 5,
      },
    },
    {
      title: "Pathway Library",
      description:
        "Access over 500+ custom interview question paths designed specifically for engineering, PM, finance, and consulting.",
      skeleton: <PathwaySkeleton />,
      className: "border-orange-500/25",
      tag: "Specialized Paths",
      config: {
        y: 20,
        x: 720,
        rotate: -5,
        zIndex: 6,
      },
    },
  ];

  const [active, setActive] = useState<CareerCard | null>(null);
  const [spacing, setSpacing] = useState(cardSpacing);
  const [isDesktop, setIsDesktop] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  const cardSpring = spring;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setSpacing(mq.matches ? cardSpacing : Math.round(cardSpacing * 0.39));
      setIsDesktop(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSpacing]);

  const middle = (cards.length - 1) / 2;

  const isAnyCardActive = () => {
    return active?.title;
  };

  const isCurrentActive = (card: CareerCard) => {
    return active?.title === card.title;
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden py-6 md:py-10">
      <motion.div
        ref={ref}
        onClick={() => setActive(null)}
        className="relative mx-auto flex h-[26rem] lg:h-[35rem] w-full max-w-5xl items-center justify-center [--height:290px] [--width:220px] lg:[--height:400px] lg:[--width:300px]"
      >
        {cards.map((card, index) => {
          const offsetX = (index - middle) * spacing;
          return (
            <motion.div key={card.title}>
              <motion.button
                initial={{
                  x: 0,
                  scale: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(card);
                }}
                animate={{
                  y: isCurrentActive(card)
                    ? (isDesktop ? 0 : -30)
                    : isAnyCardActive()
                      ? (isDesktop ? (index - middle) * 8 : 110)
                      : (isDesktop ? card.config.y : (index - middle) * 4),
                  x: isCurrentActive(card)
                    ? (isDesktop ? -220 : 0)
                    : isAnyCardActive()
                      ? (isDesktop ? (180 + index * 20) : (index - middle) * 30)
                      : (isDesktop ? offsetX : (index - middle) * 12),
                  rotate: isCurrentActive(card)
                    ? 0
                    : isAnyCardActive()
                      ? (isDesktop ? (index - middle) * 3 : (index - middle) * 2)
                      : (isDesktop ? card.config.rotate : (index - middle) * 4),
                  scale: isCurrentActive(card)
                    ? 1.02
                    : isAnyCardActive()
                      ? (isDesktop ? 0.8 : 0.7)
                      : (isDesktop ? 1 : 0.95),
                }}
                whileHover={{
                  scale: isCurrentActive(card)
                    ? 1.02
                    : isAnyCardActive()
                      ? (isDesktop ? 0.8 : 0.7)
                      : (isDesktop ? 1.05 : 0.95),
                }}
                transition={cardSpring}
                style={{
                  width: `var(--width)`,
                  height: `var(--height)`,
                  marginLeft: `calc(var(--width) / -2)`,
                  marginTop: `calc(var(--height) / -2)`,
                  zIndex: isCurrentActive(card) ? 50 : card.config.zIndex,
                  borderColor: isCurrentActive(card)
                    ? "#f97316"
                    : isAnyCardActive()
                      ? "rgba(249, 115, 22, 0.05)"
                      : undefined,
                  boxShadow: isCurrentActive(card)
                    ? "0 0 35px rgba(249, 115, 22, 0.15)"
                    : undefined,
                }}
                className={cn(
                  "absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start justify-between overflow-hidden rounded-2xl p-3 md:p-6 border bg-[#151312]/95 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.02)] select-none text-white transition-colors duration-300",
                  card.className,
                )}
              >
                <div className="w-full flex justify-between items-center pb-2">
                  <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-full text-[9px] font-mono uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>

                <div className="w-full flex-1 min-h-0 flex items-center justify-center py-2">
                  {card.skeleton}
                </div>

                <div className="mt-4 w-full flex flex-col items-start">
                  <motion.h2
                    layoutId={card.title + "title"}
                    className="font-mono text-left text-lg md:text-xl font-bold uppercase tracking-tight text-white"
                  >
                    {card.title}
                  </motion.h2>
                  <AnimatePresence mode="popLayout">
                    {active?.title === card.title && (
                      <motion.p
                        layoutId={card.title + "description"}
                        initial={{ opacity: 0, x: 20, y: 20, height: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 40, y: 40, height: 0 }}
                        transition={cardSpring}
                        className="mt-2 text-left text-xs md:text-sm text-stone-400 leading-relaxed font-body-md"
                      >
                        {card.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

function TimelineConnector({
  fromColor = "#f97316",
  toColor = "#3b82f6",
  label
}: {
  fromColor?: string;
  toColor?: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center my-3 sm:my-6 relative z-20">
      {/* Top Node */}
      <div
        className="w-3.5 h-3.5 rounded-full border bg-stone-950 flex items-center justify-center"
        style={{ borderColor: fromColor, boxShadow: `0 0 10px ${fromColor}30` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fromColor }} />
      </div>

      {/* Connecting Line 1 (Top half) */}
      <div
        className="w-[2px] h-6 sm:h-10 relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        }}
      >
        <motion.div
          animate={{
            y: ["-100%", "200%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: `linear-gradient(to bottom, transparent, #fff, transparent)`,
          }}
          className="absolute top-0 left-0 w-full h-8 opacity-60"
        />
      </div>

      {/* Label Badge */}
      {label && (
        <div
          className="px-4 py-1.5 rounded-full border bg-stone-950/90 text-[10px] font-mono font-bold tracking-widest text-center shadow-[0_0_20px_rgba(0,0,0,0.8)] whitespace-nowrap uppercase"
          style={{
            borderColor: `${fromColor}40`,
            color: fromColor,
            boxShadow: `0 0 15px ${fromColor}15`
          }}
        >
          {label}
        </div>
      )}

      {/* Connecting Line 2 (Bottom half) */}
      <div
        className="w-[2px] h-6 sm:h-10 relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        }}
      >
        <motion.div
          animate={{
            y: ["-100%", "200%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          style={{
            background: `linear-gradient(to bottom, transparent, #fff, transparent)`,
          }}
          className="absolute top-0 left-0 w-full h-8 opacity-60"
        />
      </div>

      {/* Bottom Node */}
      <div
        className="w-3.5 h-3.5 rounded-full border bg-stone-950 flex items-center justify-center"
        style={{ borderColor: toColor, boxShadow: `0 0 10px ${toColor}30` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: toColor }} />
      </div>
    </div>
  );
}

function InteractivePlayground() {
  const [activeTab, setActiveTab] = useState<"ats" | "code" | "speech">("ats");
  const [isExecuted, setIsExecuted] = useState(false);

  // Reset execution when switching tabs
  useEffect(() => {
    setIsExecuted(false);
  }, [activeTab]);

  const atsInitialLines = [
    { type: "output" as const, content: "# Target file: MockResume_SeniorSWE.pdf" },
    { type: "output" as const, content: "# Target role: Senior Software Engineer" },
    { type: "output" as const, content: "" },
  ];

  const atsCommands = [
    "vector resume --audit MockResume_SeniorSWE.pdf",
    "vector resume --list-gaps",
  ];
  const atsOutputs = {
    0: [
      "✔ Preflight resume parser ok.",
      "✔ Extracted 142 valid skill tokens.",
      "✔ Computed ATS Match Score: 88/100",
    ],
    1: [
      "✔ Matches Found: Docker, RESTful API, Python, Next.js",
      "⚠️  Gaps Found: OAuth2 flow, Redis cache (Recommended)",
    ],
  };

  const codeInitialLines = [
    { type: "output" as const, content: "# Current implementation in fibonacci.py:" },
    { type: "output" as const, content: "def fibonacci(n):" },
    { type: "output" as const, content: "    if n <= 1: return n" },
    { type: "output" as const, content: "    return fibonacci(n-1) + fibonacci(n-2)" },
    { type: "output" as const, content: "" },
  ];

  const codeCommands = [
    "vector code --optimize fibonacci.py",
    "vector code --test fibonacci.py",
  ];
  const codeOutputs = {
    0: [
      "✔ Analyzing recursion depth...",
      "✔ Sub-optimal O(2^n) recursion resolved.",
      "✔ Memoization cache map injected.",
      "✔ Refactored Complexity: O(n) - OPTIMAL",
    ],
    1: [
      "✔ Running test suite...",
      "✔ Test 1-10: passed (0.01ms)",
      "✔ 100% logic coverage verified.",
    ],
  };

  const speechInitialLines = [
    { type: "output" as const, content: "# Input stream: conflict_response.wav" },
    { type: "output" as const, content: "# Prompt: 'Describe a situation where you resolved a critical production bug.'" },
    { type: "output" as const, content: "" },
  ];

  const speechCommands = [
    "vector speech --listen conflict_response.wav",
    "vector speech --evaluate",
  ];
  const speechOutputs = {
    0: [
      "✔ Parsing audio wave frequency...",
      "✔ Pacing index: 135 Words Per Minute (Optimal)",
      "✔ Filler word count: 1 'like' (Excellent)",
    ],
    1: [
      "✔ STAR response check complete.",
      "✔ Structural situation context: clear",
      "✔ Results verification: complete",
    ],
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 rounded-3xl p-4 sm:p-6 md:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm shadow-[0_0_30px_rgba(249,115,22,0.03)] overflow-hidden">
      <div className="w-full lg:w-1/3 flex flex-col justify-between space-y-4 text-left">
        <div>
          <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
            Interactive Playground
          </span>
          <h2 className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase mt-2 mb-4">
            Try the Engine
          </h2>
          <p className="font-body-md text-stone-400 text-xs sm:text-sm leading-relaxed mb-6">
            Run real-time diagnostics, refactor code, and monitor speech patterns instantly using our lightweight mock simulator.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { id: "ats", label: "ATS Resume Scan", desc: "Test resume alignment indices", icon: "folder_shared" },
            { id: "code", label: "Code Optimization", desc: "Refactor nested algorithms", icon: "terminal" },
            { id: "speech", label: "Speech Telemetry", desc: "Audit filler words & speed", icon: "mic" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 group cursor-pointer",
                activeTab === tab.id
                  ? "bg-orange-500/10 border-orange-500/30 text-white shadow-[0_0_15px_rgba(249,115,22,0.05)]"
                  : "bg-transparent border-stone-900/50 hover:border-orange-500/20 text-stone-400 hover:text-white"
              )}
            >
              <span className={cn(
                "material-symbols-outlined text-lg mt-0.5 transition-colors duration-300",
                activeTab === tab.id ? "text-orange-400" : "text-stone-500 group-hover:text-orange-300"
              )}>
                {tab.icon}
              </span>
              <div className="flex-1 space-y-0.5">
                <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wide">
                  {tab.label}
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 leading-normal">
                  {tab.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-2/3 relative min-h-[480px] flex items-center justify-center">
        {!isExecuted ? (
          <div className="w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl relative h-[30rem] flex flex-col">
            {/* Title Bar */}
            <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center font-mono text-xs text-neutral-400">
                Vector-Console — bash
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Mock console background content */}
            <div className="flex-1 p-4 font-mono text-[11px] sm:text-xs text-left text-neutral-500 overflow-hidden leading-relaxed select-none relative">
              {activeTab === "ats" && (
                <div className="space-y-1">
                  <div># Target file: MockResume_SeniorSWE.pdf</div>
                  <div># Target role: Senior Software Engineer</div>
                  <div className="text-neutral-600 mt-2">$ vector resume --audit MockResume_SeniorSWE.pdf <span className="animate-pulse">|</span></div>
                </div>
              )}
              {activeTab === "code" && (
                <div className="space-y-1">
                  <div># Current implementation in fibonacci.py:</div>
                  <div className="text-orange-500/60">def fibonacci(n):</div>
                  <div className="text-orange-500/60">    if n &lt;= 1: return n</div>
                  <div className="text-orange-500/60">    return fibonacci(n-1) + fibonacci(n-2)</div>
                  <div className="text-neutral-600 mt-2">$ vector code --optimize fibonacci.py <span className="animate-pulse">|</span></div>
                </div>
              )}
              {activeTab === "speech" && (
                <div className="space-y-1">
                  <div># Input stream: conflict_response.wav</div>
                  <div># Prompt: &quot;Describe a situation where you resolved a critical production bug.&quot;</div>
                  <div className="text-neutral-600 mt-2">$ vector speech --listen conflict_response.wav <span className="animate-pulse">|</span></div>
                </div>
              )}

              {/* Click to start layout centered overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-955/85 backdrop-blur-[1px] p-6">
                <span className="material-symbols-outlined text-orange-400 text-5xl mb-3 animate-bounce">
                  {activeTab === "ats" ? "folder_shared" : activeTab === "code" ? "terminal" : "mic"}
                </span>
                <p className="text-center font-mono text-xs text-stone-300 max-w-xs mb-4 leading-relaxed">
                  {activeTab === "ats"
                    ? "Audit resume alignment against Senior Software Engineer target specs."
                    : activeTab === "code"
                      ? "Trace recursive algorithmic complexity and compile a memoization refactor."
                      : "Benchmark sound wave frequency and filler phrase density metrics."}
                </p>
                {activeTab === "ats" ? (
                  <Link
                    href="/ResumeAnalyzer"
                    className="px-6 py-2.5 bg-orange-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl border border-orange-400/50 hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95 text-center justify-center font-bold"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Run ATS Edit
                  </Link>
                ) : activeTab === "code" ? (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-stone-900 text-stone-500 font-mono text-xs uppercase tracking-wider rounded-xl border border-stone-800 cursor-not-allowed text-center justify-center font-bold"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-stone-900 text-stone-500 font-mono text-xs uppercase tracking-wider rounded-xl border border-stone-800 cursor-not-allowed text-center justify-center font-bold"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full relative">
            <Terminal
              commands={
                activeTab === "ats"
                  ? atsCommands
                  : activeTab === "code"
                    ? codeCommands
                    : speechCommands
              }
              outputs={
                activeTab === "ats"
                  ? atsOutputs
                  : activeTab === "code"
                    ? codeOutputs
                    : speechOutputs
              }
              initialLines={
                activeTab === "ats"
                  ? atsInitialLines
                  : activeTab === "code"
                    ? codeInitialLines
                    : speechInitialLines
              }
              username="Vector-Console"
              typingSpeed={40}
              delayBetweenCommands={1000}
              enableSound={false} // Disable key sounds by default to prevent unexpected browser audio blocking
            />
            {/* Tab Specific Action Buttons */}
            {activeTab === "ats" ? (
              <Link
                href="/ResumeAnalyzer"
                className="absolute left-4 bottom-4 px-3.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] uppercase tracking-wider rounded border border-orange-400/50 transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] cursor-pointer z-30 flex items-center gap-1 hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                Launch Resume Analyzer
              </Link>
            ) : activeTab === "code" ? (
              <button
                disabled
                className="absolute left-4 bottom-4 px-3.5 py-1 bg-stone-900 text-stone-500 font-mono text-[10px] uppercase tracking-wider rounded border border-stone-850 cursor-not-allowed z-30"
              >
                Code Optimizer (Coming Soon)
              </button>
            ) : (
              <button
                disabled
                className="absolute left-4 bottom-4 px-3.5 py-1 bg-stone-900 text-stone-500 font-mono text-[10px] uppercase tracking-wider rounded border border-stone-850 cursor-not-allowed z-30"
              >
                Speech Telemetry (Coming Soon)
              </button>
            )}
            {/* Reset Button */}
            <button
              onClick={() => setIsExecuted(false)}
              className="absolute right-4 bottom-4 px-3 py-1 bg-stone-850 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white rounded text-[10px] font-mono uppercase transition-colors cursor-pointer z-30 shadow-lg"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



const scrollRevealLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const scrollRevealRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const scrollRevealCenter = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function Page() {
  const { user } = useAuth();
  const { char, bgColor } = getAvatarProps(user?.name);
  const [landingImgError, setLandingImgError] = useState(false);

  useEffect(() => {
    setLandingImgError(false);
  }, [user?.avatarUrl]);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const items = [
    {
      quote: "Smart Resume Analyzer",
      name: "Upload your resume and instantly see what to improve, what to cut, and how to make it stronger for real hiring systems.",
      title: "Career Foundation",
    },
    {
      quote: "Internship Match Agent",
      name: "Get matched with internships that fit your profile, goals, and current skill level — without endless searching.",
      title: "Opportunity Discovery",
    },
    {
      quote: "AI Mock Interview Coach",
      name: "Practice realistic interviews, answer tough questions, and get clear feedback that helps you improve fast.",
      title: "Interview Practice",
    },
    {
      quote: "Cold Email + LinkedIn Generator",
      name: "Write outreach messages that feel personal, professional, and ready to send in seconds.",
      title: "Smart Outreach",
    },
    {
      quote: "Career Progress Dashboard",
      name: "Track your learning, interview readiness, and growth in one clear view that shows where you stand.",
      title: "Progress Tracking",
    },
    {
      quote: "Live Industry Intelligence Feed",
      name: "Stay updated with trending news, hiring shifts, and market signals that matter to your career path.",
      title: "Market Awareness",
    },
    {
      quote: "Hackathon Command Center",
      name: "Plan projects, manage deadlines, and keep your hackathon workflow organized from start to finish.",
      title: "Competition Mode",
    },
    {
      quote: "Cohort Program Navigator",
      name: "Find the right cohort, compare programs, and choose learning paths that match your goals.",
      title: "Learning Path",
    },
    {
      quote: "Skill Gap Analyzer",
      name: "See exactly which skills you are missing and get a practical plan to close those gaps.",
      title: "Upskilling Map",
    },
    {
      quote: "Placement Probability Dashboard",
      name: "Understand your chances based on your current profile, progress, and readiness signals.",
      title: "Outcome Forecast",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        body {
          background-color: #0c0a09;
          color: #e8e1df;
        }

        ::selection {
          background-color: rgba(249, 115, 22, 0.22);
          color: #fff7ed;
        }

        ::-moz-selection {
          background-color: rgba(249, 115, 22, 0.22);
          color: #fff7ed;
        }

        .orange-page-tint {
          background:
            radial-gradient(circle at 18% 12%, rgba(249, 115, 22, 0.045), transparent 26%),
            radial-gradient(circle at 82% 78%, rgba(251, 146, 60, 0.04), transparent 24%),
            linear-gradient(to bottom, rgba(255, 120, 0, 0.015), rgba(255, 120, 0, 0.008));
          background-color: #0c0a09;
        }

        .stack-container {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }

        .card-rotate {
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: grab;
        }

        .card-rotate-disabled {
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .card {
          border-radius: 1rem;
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card img {
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

      .cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 380px;
  height: 380px;
  border-radius: 9999px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.55;
  filter: blur(70px);
  background: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.30) 0%,
    rgba(249, 115, 22, 0.22) 28%,
    rgba(234, 88, 12, 0.16) 48%,
    rgba(194, 65, 12, 0.08) 68%,
    rgba(120, 53, 15, 0.00) 85%
  );
  transform: translate3d(0, 0, 0);
  transition: transform 0.07s linear;
  mix-blend-mode: screen;
}

      `}</style>

      <div className="relative min-h-screen bg-[#0c0a09]">
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
          cursorColor="#ffffff"
          cursorColorOnTarget="#B497CF"
        />
        <GridBackgroundDemo />

        <div
          className="cursor-glow"
          style={{
            transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
          }}
        />
        <div className="relative z-20">
          <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 flex items-center px-4 sm:px-6 justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_10px_rgba(249,115,22,0.15)] group-hover:border-orange-400/40 transition-colors select-none">
                  {/* Viewfinder brackets */}
                  <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
                  <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
                  <AIBrainIcon size={20} className="transform -translate-y-[0.5px]" />
                </div>
                <span className="text-[17px] font-black tracking-tight leading-none bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent group-hover:to-orange-300 transition-all duration-300">Vector</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/Dashboard">Dashboard</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/MockInterview">Practice</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/ResumeAnalyzer">Resume</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/Progress">Progress</Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <Link
                  href="/Profile"
                  className="h-8 w-8 rounded-full overflow-hidden border border-orange-400/20 transition-all duration-200 hover:border-orange-400/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.35)] flex items-center justify-center"
                  title="View Profile"
                >
                  {user.avatarUrl && !landingImgError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                      onError={() => setLandingImgError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ backgroundColor: bgColor }}
                    >
                      <span>{char}</span>
                    </div>
                  )}
                </Link>
              ) : (
                <Link href="/auth/login" className="px-3 sm:px-6 py-1.5 sm:py-2 bg-stone-900 text-white rounded-lg font-label-md text-xs sm:text-label-md hover:bg-stone-800 transition-all active:scale-95">Sign In</Link>
              )}
              <Link
                href="/MockInterview"
                className="interactive primary-blue px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-label-md text-xs sm:text-label-md shadow-lg"
              >
                Start Interview
              </Link>
            </div>
          </nav>

          <main className=" relative z-20">

            {/* Hero Section */}
            <section className="relative min-h-[70vh] md:min-h-[921px] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-10 md:py-0">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-500/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-orange-400/10 rounded-full blur-[140px]"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-12 items-center pt-8 sm:pt-10 md:pt-24 px-4 sm:px-6">

                {/* Unified Glass Container wrapping both columns */}
                <div className="lg:col-span-12 w-full bg-[#181615]/30 backdrop-blur-md border border-orange-500/10 p-8 sm:p-12 md:p-14 rounded-3xl shadow-[0_0_50px_rgba(249,115,22,0.02)] relative overflow-hidden">

                  {/* LightRays rendering inside the glass container background */}
                  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                    <LightRays
                      raysOrigin="top-center"
                      raysColor="#ffffff"
                      raysSpeed={1}
                      lightSpread={1.5}
                      rayLength={5}
                      followMouse={true}
                      mouseInfluence={0.1}
                      noiseAmount={0}
                      distortion={0}
                      className="w-full h-full"
                      pulsating={false}
                      fadeDistance={2}
                      saturation={1}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
                    {/* Left Column: Heading, Paragraph, and Buttons */}
                    <div className="w-full lg:w-[70%] min-w-0 space-y-6 relative z-10 flex flex-col items-center sm:items-start">
                      <h1 className="font-headline-lg text-2xl sm:text-5xl md:text-6xl text-center sm:text-left leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.85)] md:[-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent] flex flex-col items-center sm:items-start gap-1">
                        <span className="whitespace-nowrap">Master your next interview</span>
                        <CanvasText
                          text="With AI Precision"
                          backgroundClassName="bg-orange-400 dark:bg-orange-500"
                          colors={[
                            "rgba(255, 190, 120, 1)",
                            "rgba(255, 170, 90, 0.95)",
                            "rgba(255, 150, 60, 0.9)",
                            "rgba(249, 115, 22, 0.85)",
                            "rgba(249, 115, 22, 0.75)",
                            "rgba(249, 115, 22, 0.65)",
                            "rgba(249, 115, 22, 0.55)",
                            "rgba(249, 115, 22, 0.45)",
                            "rgba(249, 115, 22, 0.3)",
                            "rgba(249, 115, 22, 0.18)",
                          ]}
                          lineGap={3}
                          animationDuration={16}
                        />
                      </h1>

                      <p className="font-body-lg text-on-surface-variant text-xs sm:text-sm md:text-base text-center sm:text-left max-w-2xl">
                        Experience hyper-realistic interview simulations tailored to your industry. Get instant, actionable feedback and close your skill gaps with Lumina&apos;s proprietary training engine.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-4 w-full">
                        <Link
                          href="/Dashboard"
                          className="interactive primary-blue w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-xl text-center font-semibold text-sm text-white"
                        >
                          Get Started Free
                        </Link>
                        <Link
                          href="/MockInterview"
                          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 font-headline-md text-sm rounded-xl border hover:bg-surface-variant transition-all text-center"
                          style={{ borderColor: "#f97316", color: "#fdba74" }}
                        >
                          View Demo
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Swinging Physics Lanyard Card — hidden on mobile */}
                    <div className="hidden lg:flex w-full lg:w-[30%] min-w-0 justify-center items-center relative min-h-[400px] z-10">
                      <div style={{ height: '400px', position: 'relative', width: '100%', maxWidth: '500px' }} className="flex justify-center items-center">
                        <Lanyard
                          position={[0, 0, 20]}
                          gravity={[0, -40, 0]}
                          lanyardWidth={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infinite Moving Cards running below the columns */}
                <div className="lg:col-span-12 space-y-1 md:space-y-4 pt-0 -mt-4 lg:-mt-8">
                  <InfiniteMovingCards
                    items={items}
                    direction="left"
                    speed="normal"
                    pauseOnHover={true}
                  />

                  <InfiniteMovingCards
                    items={items}
                    direction="right"
                    speed="normal"
                    pauseOnHover={true}
                  />
                </div>
              </div>
            </section>



            {/* Features Section */}
            <motion.section
              variants={scrollRevealLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="pt-12 md:pt-24 pb-4 md:pb-6 px-4 sm:px-6 max-w-7xl mx-auto border-t border-stone-900/50"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 md:mb-12 text-center space-y-2"
              >
                <h2 className="font-headline-lg text-2xl font-mono sm:text-3xl md:text-5xl text-white tracking-tight">Engineered for Success</h2>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm md:text-base max-w-xl mx-auto">
                  Our multi-layered AI approach simulates realistic scenarios while providing depth that traditional coaching can&apos;t match.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[540px]"
              >
                <GlareCard containerClassName="md:col-span-7 rounded-3xl aspect-auto" className="flex flex-col justify-between bg-[#151312] rounded-3xl p-5 md:p-10 border border-orange-400/25 shadow-[0_0_0_1px_rgba(251,146,60,0.06)] group overflow-hidden relative min-h-[260px] md:min-h-0 h-full">
                  {/* Subtle hover orange glow layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-2 md:space-y-4">
                    <span className="material-symbols-outlined text-orange-400 text-3xl md:text-4xl">psychology</span>
                    <h3 className="font-headline-md text-white text-lg md:text-2xl font-semibold">Emotional Intelligence Analysis</h3>
                    <p className="font-body-md text-on-surface-variant text-xs md:text-sm max-w-sm">
                      Our AI monitors your tone, pace, and facial expressions to provide a holistic view of your professional presence.
                    </p>
                  </div>
                  <div className="relative z-10 pt-4 md:pt-8">
                    <div className="flex gap-2">
                      <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-full text-[10px] md:text-xs font-label-md">
                        Real-time
                      </span>
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] md:text-xs font-label-md">
                        Linguistics
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-2/3 h-2/3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      data-alt="A complex data visualization map with interconnected nodes..."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVDu605Ug2GjFG81IgrmsIvb5OMTuUjSqugt7Tk-Jup8roRxmwIAcMVNOAL7lvuSUPK5wS6ShP-B-ESxM4FgTp_A2g6kl3wS6lsGJPwDHnXDd8bmeykcnpB0EZPq3t1Fi7ffoX8DYdolDcTJ1eCLd0_gA9A7sB-qiKIn1InjjkQ1ve1tVw4K35pbyMm9Ymw9YCoi3XovGshPZptkFUbTZo9g6iV0Oxgsl7v1Plz5OSzS2DNappA9NRmmabEJhYhs-HuOLmxZCZf7SM"
                      alt=""
                    />
                  </div>
                </GlareCard>

                <div className="md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
                  <GlareCard containerClassName="rounded-3xl aspect-auto" className="flex flex-col justify-center space-y-2 md:space-y-4 bg-[#181615] p-5 md:p-8 border border-orange-400/25 group overflow-hidden relative min-h-[140px] md:min-h-0 h-full">
                    <span className="material-symbols-outlined text-orange-400 text-2xl md:text-3xl relative z-10">terminal</span>
                    <h4 className="font-headline-md text-white text-base md:text-lg relative z-10">Industry-Specific Scenarios</h4>
                    <p className="font-body-md text-on-surface-variant text-xs md:text-sm relative z-10">
                      From FAANG coding rounds to Wall Street case studies, we have 500+ specialized tracks.
                    </p>
                  </GlareCard>

                  <GlareCard containerClassName="rounded-3xl aspect-auto" className="flex flex-col justify-center space-y-2 md:space-y-4 bg-[#181615] p-5 md:p-8 border border-orange-400/25 group overflow-hidden relative min-h-[140px] md:min-h-0 h-full">
                    <span className="material-symbols-outlined text-orange-400 text-2xl md:text-3xl relative z-10">auto_graph</span>
                    <h4 className="font-headline-md text-white text-base md:text-lg relative z-10">Progressive Analytics</h4>
                    <p className="font-body-md text-on-surface-variant text-xs md:text-sm relative z-10">
                      Watch your &quot;Readiness Score&quot; climb as you refine your technique across multiple sessions.
                    </p>
                    <div className="absolute right-0 bottom-0 p-4">
                      <span className="text-4xl md:text-6xl font-black text-white/5 tracking-tighter">85%</span>
                    </div>
                  </GlareCard>
                </div>
              </motion.div>
            </motion.section>

            {/* Glowing Timeline Connector */}
            <TimelineConnector fromColor="#f97316" toColor="#f97316" label="00 / Placement Roadmap" />

            {/* Combined Career Prep Timeline Hub */}
            <section className="pt-4 md:pt-6 pb-12 md:pb-24 px-4 sm:px-6 border-t border-stone-900/50 max-w-7xl mx-auto relative">

              {/* Preparation Roadmap Section (Timeline) */}
              <motion.div
                variants={scrollRevealRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative z-10"
              >
                <StickyScroll content={stickyScrollContent} />
              </motion.div>

              {/* Glowing Timeline Connector */}
              <TimelineConnector fromColor="#f97316" toColor="#3b82f6" label="01 / Integrated Career Tools" />

              {/* Features Marquee Section (Integrated Career Tools) */}
              <motion.div
                variants={scrollRevealCenter}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex flex-col justify-start rounded-3xl p-4 sm:p-6 md:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full mx-auto overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.03)]"
              >
                {/* Heading and description inside the boundary at the top */}
                <div className="mb-4 lg:mb-8 text-center space-y-2 lg:space-y-4 border-b border-orange-500/10 pb-4 lg:pb-6 flex-shrink-0">
                  <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl font-mono text-white tracking-tight">Integrated Career Tools</h2>
                  <p className="font-body-md text-stone-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
                    Vector provides a modular workspace with everything you need to prepare, apply, and land your target role.
                  </p>
                </div>
                <div className="w-full">
                  <CareerToolsCards />
                </div>
              </motion.div>

              {/* Glowing Timeline Connector */}
              <TimelineConnector fromColor="#3b82f6" toColor="#f97316" label="02 / Global Opportunity Hub" />

              {/* Global Opportunity Hub Section (Globe) */}
              <motion.div
                variants={scrollRevealLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative z-10"
              >
                <GlobeComponent />
              </motion.div>

              {/* Glowing Timeline Connector */}
              <TimelineConnector fromColor="#f97316" toColor="#ec4899" label="03 / Interactive Playground" />

              {/* Interactive Playground Section */}
              <motion.div
                variants={scrollRevealRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative z-10"
              >
                <InteractivePlayground />
              </motion.div>

              {/* Glowing Timeline Connector */}
              <TimelineConnector fromColor="#ec4899" toColor="#a855f7" label="04 / Skill Directory" />

              {/* Skills & Knowledge Section (IconCloud) */}
              <motion.div
                variants={scrollRevealCenter}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex flex-col md:flex-row items-center justify-between rounded-3xl p-4 sm:p-6 md:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full mx-auto overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.03)] gap-6 md:gap-10"
              >
                {/* Icon Cloud on the LEFT */}
                <div className="w-full md:w-1/2 aspect-square max-h-[20rem] sm:max-h-[24rem] md:max-h-[28rem] lg:max-h-[32rem] relative flex items-center justify-center overflow-hidden">
                  <IconCloudComponent />
                </div>
                {/* Font/Text on the RIGHT */}
                <div className="text-left space-y-4 md:space-y-6 md:w-1/2 flex-shrink-0">
                  <div className="space-y-2 lg:space-y-4">
                    <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                      Continuous Learning
                    </span>
                    <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono text-white tracking-tight uppercase">Master the Tech Stack</h2>
                    <p className="font-body-md text-stone-400 text-xs sm:text-sm md:text-base max-w-md leading-relaxed">
                      Prepare for any tech stack or framework. Vector helps you identify skill gaps, practice language-specific mocks, and master standard algorithms to confidently clear high-bar technical interviews.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-orange-500/10 max-w-md">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5 select-none">terminal</span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase">Algorithm Mock Drilling</h4>
                        <p className="text-stone-400 text-[11px] sm:text-xs font-body-md leading-relaxed">
                          Practice live algorithmic coding in Node, Java, Go, and Python with real-time optimization hints.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5 select-none">layers</span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase">Framework Competency</h4>
                        <p className="text-stone-400 text-[11px] sm:text-xs font-body-md leading-relaxed">
                          Vet your knowledge in core frameworks like Next.js, React, and Flutter, matching production-level designs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Glowing Timeline Connector */}
              <TimelineConnector fromColor="#a855f7" toColor="#ea580c" label="05 / Frequently Asked Questions" />

              {/* FAQ Section */}
              <motion.div
                variants={scrollRevealLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex flex-col justify-start rounded-3xl p-4 sm:p-6 md:p-10 border border-orange-500/20 bg-[#181615]/50 backdrop-blur-sm w-full mx-auto overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.03)]"
              >
                {/* Heading and description inside the boundary at the top */}
                <div className="mb-4 lg:mb-8 text-center space-y-2 lg:space-y-4 border-b border-orange-500/10 pb-4 lg:pb-6 flex-shrink-0">
                  <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Frequently Asked Questions</h2>
                  <p className="font-body-md text-stone-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
                    Everything you need to know about the Vector AI career coaching platform.
                  </p>
                </div>
                {/* Stack component with responsive dimensions */}
                <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl h-[26rem] lg:h-[28rem] mx-auto relative mt-2 md:mt-4">
                  <Stack
                    cards={faqCards}
                    randomRotation={true}
                    sensitivity={80}
                    sendToBackOnClick={true}
                  />
                </div>
              </motion.div>
            </section>

            {/* Final CTA Section */}
            <motion.section
              variants={scrollRevealRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="py-32 px-6 overflow-hidden relative border-t border-stone-900"
            >
              {/* Aurora background animation */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                  animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -35, 20, 0],
                    scale: [1, 1.15, 0.9, 1]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none"
                />
                <motion.div
                  animate={{
                    x: [0, -50, 30, 0],
                    y: [0, 35, -30, 0],
                    scale: [1, 0.9, 1.1, 1]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none"
                />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                <h2 className="font-headline-lg font-mono text-5xl md:text-6xl text-white tracking-tight overflow-hidden py-1">
                  <motion.span
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="inline-block"
                  >
                    Ready to land your <span className="text-orange-400 underline decoration-orange-500/30 underline-offset-8">dream offer?</span>
                  </motion.span>
                </h2>
                <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                  Start practicing today with our AI-driven platform. No credit card required to start your first session.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/Dashboard"
                    className="interactive primary-blue w-full sm:w-auto px-12 py-5 rounded-full text-center font-semibold block text-white"
                  >
                    Create Your Free Account
                  </Link>
                  {/* <Link
                    href="/MockInterview"
                    className="w-full sm:w-auto px-12 py-5 bg-white/5 font-headline-md text-lg rounded-full border hover:bg-white/10 transition-all backdrop-blur-md text-center block"
                    style={{ borderColor: "#f97316", color: "#fdba74" }}
                  >
                    Talk to an Expert
                  </Link> */}
                </div>

              </div>
            </motion.section>
          </main>


        </div>
      </div>
    </>
  );
}
