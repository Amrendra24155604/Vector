"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import GridBackgroundDemo from "../Background/page";
import { CanvasText } from "@/components/CanvasText";
import TopBar from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { MovingWavyProgress } from "@/components/MovingWavyProgress";
import { AnimatedBrandLogo } from "@/components/AnimatedBrandLogo";
import SleekDropdown from "@/components/SleekDropdown";
import {
  UpcomingSessionIcon,
  ActivityTimelineIcon,
  FeedbackTrendsIcon,
  InterviewsCompletedIcon,
  AverageScoreIcon,
  PrepStreakIcon,
  CardIconShell,
  ActivityIconForType,
} from "@/components/AnimatedCardIcons";

export default function Page() {
  const { token, user } = useAuth();
  const [statsData, setStatsData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  const [upcomingSession, setUpcomingSession] = useState<{
    role: string;
    company: string;
    sessionType: string;
    dateTime: string;
  } | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleRole, setScheduleRole] = useState("Software Engineer");
  const [scheduleCompany, setScheduleCompany] = useState("Google");
  const [scheduleType, setScheduleType] = useState("behavioral");
  const [scheduleTimeOffset, setScheduleTimeOffset] = useState("5"); // default 5 minutes
  const [countdownText, setCountdownText] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cp_upcoming_session");
    if (stored) {
      try {
        setUpcomingSession(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (!upcomingSession) {
      setCountdownText("");
      setIsReady(false);
      return;
    }

    const updateCountdown = () => {
      const target = new Date(upcomingSession.dateTime).getTime();
      const diff = target - Date.now();

      if (diff <= 0) {
        setCountdownText("00:00");
        setIsReady(true);
      } else {
        setIsReady(false);
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hStr = hours > 0 ? `${String(hours).padStart(2, "0")}:` : "";
        const mStr = String(minutes).padStart(2, "0");
        const sStr = String(seconds).padStart(2, "0");
        setCountdownText(`${hStr}${mStr}:${sStr}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [upcomingSession]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(scheduleTimeOffset, 10) || 5;
    const targetTime = new Date(Date.now() + minutes * 60 * 1000).toISOString();

    const newSession = {
      role: scheduleRole,
      company: scheduleCompany,
      sessionType: scheduleType,
      dateTime: targetTime,
    };

    localStorage.setItem("cp_upcoming_session", JSON.stringify(newSession));
    setUpcomingSession(newSession);
    setShowScheduleModal(false);
  };

  const handleCancelUpcoming = () => {
    localStorage.removeItem("cp_upcoming_session");
    setUpcomingSession(null);
    setCountdownText("");
    setIsReady(false);
  };

  useEffect(() => {
    if (!token) return;
    fetch('/api/progress/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.stats) {
          setStatsData(data.stats);
        }
      })
      .catch(err => console.error("Failed to load dashboard stats", err));
  }, [token]);

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

  const displayActivity = statsData?.recentSessions && statsData.recentSessions.length > 0
    ? statsData.recentSessions.map((session: any) => {
      const scoreStr = session.overallScore !== undefined ? ` • Score: ${session.overallScore}/100` : "";
      const formattedDate = new Date(session.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        title: `${session.role} Mock Interview`,
        subtitle: `${formattedDate}${scoreStr}`,
        icon: "check_circle",
        color: "emerald"
      };
    })
    : [
      { title: "Full Mock Interview", subtitle: "2 hours ago • Score: 92/100", icon: "check_circle", color: "emerald" },
      { title: "System Design Lesson", subtitle: "Yesterday • Completed", icon: "school", color: "orange" },
      { title: "Behavioral Drill", subtitle: "May 12 • Score: 85/100", icon: "psychology", color: "amber" }
    ];

  const dynamicTechnicalScore = statsData?.avgTechnicalScore !== undefined && statsData.avgTechnicalScore > 0
    ? `${statsData.avgTechnicalScore}%`
    : "85%";
  const dynamicToneScore = statsData?.avgConfidenceScore !== undefined && statsData.avgConfidenceScore > 0
    ? `${statsData.avgConfidenceScore}%`
    : "78%";
  const dynamicPacingScore = statsData?.avgClarityScore !== undefined && statsData.avgClarityScore > 0
    ? `${statsData.avgClarityScore}%`
    : "65%";

  const [activePrepLesson, setActivePrepLesson] = useState<"system-design" | "behavioral" | "faang-prep" | "communication-prep" | null>(null);

  const lessonDetails = {
    "system-design": {
      title: "System Design Prep",
      subtitle: "Master the architectural building blocks of distributed systems",
      skills: [
        { name: "Horizontal Scaling & Load Balancing", desc: "Understand Round Robin, Nginx/HAProxy configs, routing, and SSL termination." },
        { name: "Caching Strategies", desc: "Master Cache-Aside, Write-Through patterns, eviction policies (LRU, LFU), and Redis/Memcached." },
        { name: "Databases & Partitioning", desc: "Compare Relational vs. NoSQL, learn Replication (Leader-Follower), Sharding, and Indexes." },
        { name: "Content Delivery Networks (CDNs)", desc: "Utilize edge caching, push/pull CDNs, static asset delivery, and Cache-Control headers." },
        { name: "Microservices & API Gateway", desc: "Understand service discovery, routing, rate limiting, and circuit breakers." },
        { name: "Message Queues & Pub/Sub", desc: "Decouple services using Kafka or RabbitMQ, ensuring async execution and consistency." },
        { name: "System Constraints & CAP Theorem", desc: "Calculate network bandwidth, storage requirements, and balance Consistency vs. Availability." }
      ],
      materials: [
        {
          title: "System Design Primer (GitHub)",
          url: "https://github.com/donnemartin/system-design-primer",
          desc: "The gold standard visual primer with diagrams, cheatsheets, and walkthroughs for large-scale architectures.",
          icon: "code"
        },
        {
          title: "ByteByteGo by Alex Xu",
          url: "https://bytebytego.com/",
          desc: "Step-by-step visual breakdowns of real-world system designs like YouTube, Messenger, and Uber.",
          icon: "menu_book"
        },
        {
          title: "Designing Data-Intensive Applications",
          url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
          desc: "Definitive O'Reilly book by Martin Kleppmann on databases, consistency guarantees, and distributed storage.",
          icon: "book"
        },
        {
          title: "Grokking the System Design Interview",
          url: "https://www.designgurus.io/course/grokking-the-system-design-interview",
          desc: "Highly practical, interactive, and structured patterns for solving common system design interview problems.",
          icon: "school"
        }
      ]
    },
    "behavioral": {
      title: "Behavioral Interview Prep",
      subtitle: "Structure your personal stories for maximum impact",
      skills: [
        { name: "STAR Method Application", desc: "Structure responses logically: Situation, Task, Action, and Result (quantifiable impact)." },
        { name: "Conflict Resolution", desc: "Articulate how you navigate disagreements with colleagues or managers in a constructive manner." },
        { name: "Leadership & Ownership", desc: "Show initiative, make high-quality long-term decisions, and take full responsibility for outcomes." },
        { name: "Failure & Self-Reflection", desc: "Explain past failures or mistakes honestly, highlight what you learned, and demonstrate growth." },
        { name: "Collaboration & Empathy", desc: "Showcase cross-functional communication, mentoring peers, and prioritizing team success." },
        { name: "Prioritization & Deadlines", desc: "Describe how you handle competing deadlines, resource constraints, and make conscious trade-offs." }
      ],
      materials: [
        {
          title: "The STAR Method Guide (The Muse)",
          url: "https://www.themuse.com/advice/star-interview-method",
          desc: "A comprehensive guide on how to outline and present behavioral stories with impact and clarity.",
          icon: "psychology"
        },
        {
          title: "Amazon Leadership Principles (ALPs)",
          url: "https://www.amazon.jobs/content/en/our-value/leadership-principles",
          desc: "The industry standard framework for behavioral evaluations. Learn ownership, customer obsession, and dive deep.",
          icon: "workspace_premium"
        },
        {
          title: "Tech Interview Handbook: Behavioral",
          url: "https://www.techinterviewhandbook.org/behavioral-interview/",
          desc: "Free, tech-focused handbook covering typical questions on conflict, leadership, failures, and projects.",
          icon: "tips_and_updates"
        },
        {
          title: "Levels.fyi Prep Worksheet",
          url: "https://www.levels.fyi/",
          desc: "Interactive planning worksheets to compile and polish your personal stories for senior tech roles.",
          icon: "assignment"
        }
      ]
    },
    "faang-prep": {
      title: "FAANG Crack Guide",
      subtitle: "Master data structures, algorithms, and technical rigor",
      skills: [
        { name: "Data Structures & Core Patterns", desc: "Practice advanced Arrays, HashMaps, Trees, Graphs, Heap structures, and complex traversal models." },
        { name: "Algorithmic Paradigms", desc: "Internalize Sliding Window, Two Pointers, BFS/DFS, Backtracking, and Dynamic Programming." },
        { name: "Time & Space Complexity", desc: "Perform rigorous Big O complexity analysis and reason about stack memory and auxiliary space." },
        { name: "FAANG Behavioral Bar", desc: "Map stories to Amazon Leadership Principles, Google's Googlyness metrics, and Meta's core values." },
        { name: "Coding Practice Under Pressure", desc: "Conduct rapid speed drills, dry-run code on boards, and talk through assumptions clearly while coding." }
      ],
      materials: [
        {
          title: "LeetCode Patterns (NeetCode)",
          url: "https://neetcode.io/",
          desc: "The definitive roadmap for visual patterns, solutions, and tracking worksheets for coding interviews.",
          icon: "code"
        },
        {
          title: "Tech Interview Handbook: Coding",
          url: "https://www.techinterviewhandbook.org/",
          desc: "Free, high-quality roadmap for mastering coding rounds, patterns, resume prep, and behavioral steps.",
          icon: "menu_book"
        },
        {
          title: "Cracking the Coding Interview",
          url: "https://www.careercup.com/book",
          desc: "Legendary engineering book by Gayle Laakmann McDowell covering key algorithms and FAANG prep tips.",
          icon: "book"
        },
        {
          title: "Google Tech Dev Guide Hub",
          url: "https://techdevguide.withgoogle.com/",
          desc: "Curated learning paths, resources, and practice problems recommended directly by Google engineers.",
          icon: "school"
        }
      ]
    },
    "communication-prep": {
      title: "Effective Communication",
      subtitle: "Refine technical delivery and cross-functional explanations",
      skills: [
        { name: "Technical Clarity & Pitching", desc: "Translate deep architectural code choices into simple, business-oriented terms for managers." },
        { name: "Pacing & Filler Reduction", desc: "Optimize pause usage, vary volume/pitch, and actively screen out filler words (um, ah, like)." },
        { name: "Structured Explanations", desc: "Deliver logical explanations using frameworks like the Pyramid Principle (Bottom-Line-First)." },
        { name: "Active Listening", desc: "Parse complex prompts from interviewers, identify core requirements, and validate assumptions first." },
        { name: "Cross-Functional Collaboration", desc: "Demonstrate high-impact communication with PMs, UX designers, support staff, and peer engineers." }
      ],
      materials: [
        {
          title: "Think Fast, Talk Smart Podcast",
          url: "https://www.gsb.stanford.edu/business-podcasts/think-fast-talk-smart-podcast",
          desc: "Highly practical, Stanford-hosted podcast sharing techniques for spontaneous public speaking and communications.",
          icon: "psychology"
        },
        {
          title: "The Pyramid Principle logic",
          url: "https://www.levels.fyi/",
          desc: "The logic framework for formatting structured thoughts, making points clear, and delivering answers bottom-line-first.",
          icon: "workspace_premium"
        },
        {
          title: "Developer to Leader Guides",
          url: "https://refactoring.fm/",
          desc: "In-depth engineering blog details sharing how devs can communicate metrics, impact, and plans to non-tech staff.",
          icon: "tips_and_updates"
        },
        {
          title: "Toastmasters Filler Elimination",
          url: "https://www.toastmasters.org/",
          desc: "Speaking workshops and public guidelines to eliminate speaking anxieties and verbal fillers.",
          icon: "assignment"
        }
      ]
    }
  };

  const prepCards = [
    {
      id: "system-design" as const,
      alt: "System Design",
      tag: "TECHNICAL",
      title: "System Design Basics",
      desc: "Master load balancing, caching strategies, and database sharding for senior roles.",
      time: "45 mins",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpO0EBON4e07Y05XfvH1qI4uXjtyQ0Sw_VyxsCXxNxBMvLPbw8At5nsixf8TbM1_Szaj7TdZwqXEuE_XxJC0qQGR22yDPB3OMBL0dvlFp7p3mErAkUkpOQISP0Yhr6ydh6teH4wuJX2kPIbRI0Rsrq8RjM9n-5tOU9l2PtozRG_1Z17g70TiGHN7jecnofREYD2jaSuOSKUfNw-ER0tJ05bbIrfQs2x3f0ET1HD_VPOYz6R7_8j1IxrW5wTNpbXNF3k23juyRg2Rxj",
    },
    {
      id: "behavioral" as const,
      alt: "Behavioral",
      tag: "SOFT SKILLS",
      title: "Behavioral Questions",
      desc: "Learn the STAR method to answer high-pressure behavioral prompts with more structure and impact.",
      time: "30 mins",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-KKrXDxKHvha7IS2EyqUe-_5OFYmZb7JwFtb2jCPL4h36ZF2lxXE6BJwOxVOLYfgObY7XkYAISOLwBgFBWHddyUKrPdwenenqBggvdPol1eTclUYCqwoVRCvq03xLx2dgFj8giRgv2zuIYHp1VA6lqrmcCxSK8GUOzTAUH42wr3jyfNAgdbLWEPfRzn7j-v0sKqB7CtGmiIykyi4S6UC7H-0UOQuxcbeJ8-utaLLZ_IUcbegxD2bQV-u4PYQlMsYpC0tH8wraEX5k",
    },

    {
      id: "faang-prep" as const,
      alt: "FAANG Prep",
      tag: "INTERVIEWS",
      title: "FAANG Crack Guide",
      desc: "Master data structures, algorithm patterns, and large-scale architectural trade-offs.",
      time: "60 mins",
      src: "/faang_prep_art.jpg",
    },
    {
      id: "communication-prep" as const,
      alt: "Effective Communication",
      tag: "SOFT SKILLS",
      title: "Effective Communication",
      desc: "Perfect your tech delivery, confidence, structures, and cross-functional explanations.",
      time: "20 mins",
      src: "/communication_prep_art.jpg",
    }
  ];

  // Dynamic stats calculations
  const currentSessions = statsData?.totalSessions !== undefined ? statsData.totalSessions : 24;
  const nextMilestoneSessions = Math.ceil((currentSessions + 1) / 10) * 10 || 10;
  const completionPctSessions = Math.min(100, Math.round((currentSessions / nextMilestoneSessions) * 100));

  const currentScore = statsData?.avgInterviewScore !== undefined ? statsData.avgInterviewScore : 88;
  const readyTier = currentScore >= 90 ? "L5 FAANG Ready" : currentScore >= 80 ? "Ready for L4 Tech" : currentScore >= 70 ? "Associate Ready" : "Prep Mode";
  const percentileVal = Math.max(1, 100 - Math.round(currentScore * 1.05));
  const percentileStr = currentScore >= 98 ? "Top 1%" : `Top ${percentileVal}% User`;

  // Calculate currentWeekActivity based on sessions completed during this week (Monday-Sunday) AND backend login streak
  const currentWeekActivity = [false, false, false, false, false, false, false];
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, ...
  const todayIdx = currentDay === 0 ? 6 : currentDay - 1;

  // Today (the current day index of the week) is always active because the user has logged in today
  currentWeekActivity[todayIdx] = true;

  // Use the backend streak to light up the weekdays leading up to today
  if (statsData) {
    const streakVal = statsData.streak || 0;
    // Light up the days corresponding to the login streak (backwards from today)
    for (let i = 0; i < streakVal; i++) {
      const idx = todayIdx - i;
      if (idx >= 0) {
        currentWeekActivity[idx] = true;
      }
    }

    // Also light up days with completed sessions from recentSessions
    if (statsData.recentSessions) {
      try {
        const startOfWeek = new Date(now);
        const distance = currentDay === 0 ? -6 : 1 - currentDay;
        startOfWeek.setDate(now.getDate() + distance);
        startOfWeek.setHours(0, 0, 0, 0);

        for (let i = 0; i < todayIdx; i++) {
          const targetDate = new Date(startOfWeek);
          targetDate.setDate(startOfWeek.getDate() + i);
          const nextDate = new Date(targetDate);
          nextDate.setDate(targetDate.getDate() + 1);

          const hasSession = statsData.recentSessions.some((sess: any) => {
            const sessDate = new Date(sess.createdAt);
            return sessDate >= targetDate && sessDate < nextDate;
          });
          if (hasSession) {
            currentWeekActivity[i] = true;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Calculate currentStreak (resets every week on Monday, counting consecutive active days backwards from today)
  let currentStreak = 0;
  for (let i = todayIdx; i >= 0; i--) {
    if (currentWeekActivity[i]) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="dark">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        body {
          background-color: #0c0a09;
          color: #e8e1df;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
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

        .nav-shell {
          background: rgba(18, 15, 14, 0.90);
          backdrop-filter: blur(16px);
          border-right: 1px solid rgba(251, 146, 60, 0.10);
        }

        .top-shell {
          background: rgba(12, 10, 9, 0.82);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(251, 146, 60, 0.10);
        }

        .hero-shell {
          background:
            radial-gradient(circle at top left, rgba(249, 115, 22, 0.08), transparent 32%),
            linear-gradient(180deg, rgba(24, 21, 19, 0.92), rgba(18, 15, 14, 0.96));
          border: 1px solid rgba(251, 146, 60, 0.18);
          box-shadow:
            0 0 0 1px rgba(251, 146, 60, 0.04),
            0 30px 70px rgba(0, 0, 0, 0.24);
        }

        .soft-card {
          background: #181615;
          border: 1px solid rgba(251, 146, 60, 0.18);
          box-shadow:
            0 0 0 1px rgba(251, 146, 60, 0.04),
            0 14px 35px rgba(0, 0, 0, 0.22);
        }

        .deep-card {
          background: #151312;
          border: 1px solid rgba(251, 146, 60, 0.16);
          box-shadow:
            0 0 0 1px rgba(251, 146, 60, 0.03),
            0 18px 45px rgba(0, 0, 0, 0.22);
        }

        .sidebar-active {
          background: rgba(249, 115, 22, 0.10);
          color: #fdba74;
          border: 1px solid rgba(249, 115, 22, 0.20);
          box-shadow: inset 0 0 0 1px rgba(251, 146, 60, 0.05);
        }

        .eyebrow {
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(251, 146, 60, 0.18);
          color: #fdba74;
        }

        .orange-soft {
          color: #fdba74;
        }

        .orange-main {
          color: #fb923c;
        }

        .input-shell {
          background: rgba(28, 25, 23, 0.82);
          border: 1px solid rgba(251, 146, 60, 0.10);
        }

        .input-shell:focus-within {
          border-color: rgba(251, 146, 60, 0.24);
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.08);
        }

        .orange-ghost {
          border: 1px solid #f97316;
          color: #fdba74;
          background: rgba(249, 115, 22, 0.04);
        }

        .orange-ghost:hover {
          background: rgba(249, 115, 22, 0.08);
        }

        .progress-track {
          background: #221d1a;
        }

        .progress-fill {
          background: linear-gradient(
            90deg,
            rgba(255, 190, 120, 1) 0%,
            rgba(255, 170, 90, 0.95) 25%,
            rgba(249, 115, 22, 0.85) 65%,
            rgba(234, 88, 12, 0.92) 100%
          );
          box-shadow: 0 0 18px rgba(249, 115, 22, 0.18);
        }

        .section-glow {
          position: absolute;
          inset: auto -10% -20% auto;
          width: 280px;
          height: 280px;
          border-radius: 9999px;
          background: rgba(249, 115, 22, 0.12);
          filter: blur(90px);
          pointer-events: none;
        }

        .interactive {
          transition:
            color 180ms cubic-bezier(0.16, 1, 0.3, 1),
            background 180ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 180ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .interactive:active {
          transform: scale(0.98);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Dynamic SVG stats logo animations */
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }

        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }

        @keyframes scan-up-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        @keyframes scale-flame {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.18) scaleX(0.95); filter: brightness(1.2); }
        }

        @keyframes wave-left-right {
          0%, 100% { transform: skewX(-2deg); }
          50% { transform: skewX(2deg); }
        }

        @keyframes float-spark {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-16px) scale(0.4); opacity: 0; }
        }

        /* Stats Cards Hover Glows & Animations */
        .completed-card {
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .completed-card:hover {
          border-color: rgba(251, 146, 60, 0.4);
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.15), 0 14px 35px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        .completed-card:hover .completed-logo-container svg {
          transform: scale(1.15);
        }
        .completed-card:hover .outer-ring {
          stroke: #fb923c;
          animation: rotate-slow 3s linear infinite;
        }
        .completed-card:hover .check-path {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: draw-check 0.4s ease-out forwards;
        }
        .completed-card:hover .radar-grid {
          stroke: rgba(249, 115, 22, 0.35);
        }

        .score-card {
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .score-card:hover {
          border-color: rgba(251, 146, 60, 0.4);
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.15), 0 14px 35px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        .score-card:hover .score-logo-container svg {
          transform: scale(1.15);
        }
        .score-card:hover .scope-line {
          stroke: #f97316;
          filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.6));
        }
        .score-card:hover .bar-1 { animation: scan-up-down 0.7s ease-in-out infinite; }
        .score-card:hover .bar-2 { animation: scan-up-down 0.6s ease-in-out infinite 0.1s; }
        .score-card:hover .bar-3 { animation: scan-up-down 0.8s ease-in-out infinite 0.2s; }
        .score-card:hover .glowing-target-dot {
          fill: #f97316;
          filter: drop-shadow(0 0 4px #f97316);
        }

        .streak-card {
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .streak-card:hover {
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.15), 0 14px 35px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        .streak-card:hover .streak-logo-container svg {
          transform: scale(1.15);
        }
        .streak-card:hover .flame-core {
          animation: scale-flame 0.7s ease-in-out infinite, wave-left-right 1s ease-in-out infinite;
          fill: url(#flameGradHover);
          filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.95));
        }
        .streak-card:hover .spark-1, 
        .streak-card:hover .spark-2, 
        .streak-card:hover .spark-3 {
          filter: brightness(1.4);
        }

        /* Default SVG Containers Static Styling */
        .completed-logo-container svg, .score-logo-container svg, .streak-logo-container svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .score-logo-container .bar-1 { animation: scan-up-down 1.4s ease-in-out infinite; }
        .score-logo-container .bar-2 { animation: scan-up-down 1.2s ease-in-out infinite 0.2s; }
        .score-logo-container .bar-3 { animation: scan-up-down 1.6s ease-in-out infinite 0.4s; }
        .streak-logo-container .flame-core {
          animation: scale-flame 1.5s ease-in-out infinite, wave-left-right 2s ease-in-out infinite;
          transform-origin: 16px 22px;
        }
        .streak-logo-container .spark-1 { animation: float-spark 1.2s linear infinite; transform-origin: center; }
        .streak-logo-container .spark-2 { animation: float-spark 0.9s linear infinite 0.3s; transform-origin: center; }
        .streak-logo-container .spark-3 { animation: float-spark 1.5s linear infinite 0.6s; transform-origin: center; }
      `}</style>

      <div className="relative min-h-screen orange-page-tint">
        <GridBackgroundDemo />

        <div
          className="cursor-glow"
          style={{
            transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
          }}
        />

        <div className="relative z-20">

          <TopBar title="Dashboard" />

          <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <section className="hero-shell rounded-[32px] p-8 md:p-10 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400/10 rounded-full blur-[120px]" />
                {/* Clipped background decoration container to match the hero-shell cut-corner shape */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))"
                  }}
                >
                  {/* Absolutely positioned giant static background decoration */}
                  <div className="absolute top-0 right-0 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] md:w-[760px] md:h-[760px] lg:w-[920px] lg:h-[920px] translate-x-[15%] sm:translate-x-[20%] md:translate-x-[20%] lg:translate-x-[25%] -translate-y-[10%] -rotate-[12deg] opacity-65">
                    <AnimatedBrandLogo />
                  </div>
                </div>

                <div className="relative z-10 max-w-3xl lg:max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-xs font-bold tracking-wide mb-5">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bolt
                    </span>
                    <span>Realtime Career Command Center</span>
                  </div>

                  {/* Mobile Heading */}
                  <h1 className="sm:hidden font-headline-lg text-[36px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_white] [-webkit-text-fill-color:transparent]">
                    <span className="block whitespace-nowrap">
                      Practice smarter.
                    </span>
                    <CanvasText
                      text="Perform better."
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

                  {/* Desktop & Tablet Heading */}
                  <h1 className="hidden sm:block font-headline-lg text-[40px] sm:text-[52px] md:text-[60px] lg:text-[64px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent]">
                    <span className="block lg:inline-block lg:whitespace-nowrap">
                      Sharpen your interview game
                    </span>
                    <br />
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

                  <p className="text-sm sm:text-base md:text-lg text-stone-400 max-w-2xl mt-5 leading-relaxed font-mono sm:font-sans text-center sm:text-left">
                    Ready to practice today? You&apos;re in the top 5% of users this week.
                    Track readiness, improve weak spots, and move faster toward your next offer.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mt-8">
                    <Link
                      href="/MockInterview"
                      className="interactive primary-blue px-6 py-3 rounded-xl text-sm font-bold"
                    >
                      Start Mock Interview
                    </Link>
                    <Link
                      href="/Progress"
                      className="hidden sm:inline-block interactive orange-ghost px-6 py-3 rounded-xl text-sm font-bold"
                    >
                      View Progress
                    </Link>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="soft-card completed-card p-6 rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="section-glow" />
                  <div className="flex justify-between items-start relative z-10">
                    <CardIconShell className="completed-logo-container">
                      <InterviewsCompletedIcon />
                    </CardIconShell>
                    <span className="text-orange-300 text-xs font-bold">
                      {statsData?.sessionsThisWeek !== undefined ? `+${statsData.sessionsThisWeek} this week` : "+4 this week"}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-stone-400 text-sm font-medium">Interviews completed</p>
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                      {currentSessions}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>Next Milestone: {nextMilestoneSessions}</span>
                      <span>{completionPctSessions}%</span>
                    </div>
                    <MovingWavyProgress pct={completionPctSessions} color="#fb923c" />
                  </div>
                </div>

                <div className="soft-card score-card p-6 rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="section-glow" />
                  <div className="flex justify-between items-start relative z-10">
                    <CardIconShell className="score-logo-container">
                      <AverageScoreIcon />
                    </CardIconShell>
                    <span className="text-orange-300 text-xs font-bold">Target: 85+</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-stone-400 text-sm font-medium">Average score</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {currentScore}
                      <span className="text-lg text-stone-500 font-normal">/100</span>
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>{readyTier}</span>
                      <span>{percentileStr}</span>
                    </div>
                    <MovingWavyProgress pct={currentScore} color="#fb923c" />
                  </div>
                </div>

                <div className="soft-card streak-card p-6 rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden">
                  <div className="section-glow" />
                  <div className="flex justify-between items-start relative z-10">
                    <CardIconShell className="streak-logo-container">
                      <PrepStreakIcon gradId="flameGrad" />
                    </CardIconShell>
                    <span className="text-orange-300 text-xs font-bold">Active Streak</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-stone-400 text-sm font-medium">Prep Streak</p>
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                      {currentStreak} days
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-2 overflow-hidden">
                      <div className="flex gap-1.5 flex-shrink-0">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                          const isActive = currentWeekActivity[idx];
                          return (
                            <div key={idx} className="flex flex-col items-center gap-0.5">
                              <span className="text-[9px] text-stone-600 font-bold font-mono">{day}</span>
                              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-orange-500 shadow-[0_0_6px_#f97316]' : 'bg-stone-800'}`} />
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-right flex-shrink min-w-0">
                        {currentStreak >= 7 ? (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse block truncate whitespace-nowrap" title="Milestone achieved congrats">
                            Milestone achieved congrats
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-500 font-mono block whitespace-nowrap">
                            Milestone: 7d
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-10">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold tracking-tight text-white">
                        Recommended Prep
                      </h3>
                      <Link
                        className="orange-soft text-sm font-bold flex items-center gap-1"
                        href="/MockInterview"
                      >
                        Start Practice
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {prepCards.map((item) => (
                        <div
                          key={item.title}
                          onClick={() => setActivePrepLesson(item.id)}
                          className="soft-card rounded-3xl overflow-hidden group transition-all duration-300 hover:border-orange-300/40 hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="h-40 bg-[#221d1a] relative overflow-hidden">
                            <img
                              alt={item.alt}
                              className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                              src={item.src}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-transparent to-transparent" />
                            <div className="absolute top-3 left-3 bg-[#120f0e]/80 backdrop-blur text-[10px] font-bold text-orange-200 px-2 py-1 rounded">
                              {item.tag}
                            </div>
                          </div>

                          <div className="p-5">
                            <h4 className="text-lg font-bold tracking-tight text-white mb-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
                              {item.desc}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-stone-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">timer</span>
                                {item.time}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePrepLesson(item.id);
                                }}
                                className="orange-soft text-sm font-bold hover:text-white transition-colors"
                              >
                                Start Lesson
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FeedbackTrendsIcon />
                      <h3 className="text-2xl font-bold tracking-tight text-white">
                        AI Feedback Trends
                      </h3>
                    </div>

                    <div className="soft-card rounded-3xl p-6">
                      <div className="space-y-6">
                        {[
                          ["Technical Communication", dynamicTechnicalScore],
                          ["Tone & Confidence", dynamicToneScore],
                          ["Pacing & Structure", dynamicPacingScore],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-stone-400">
                                {label}
                              </span>
                              <span className="text-sm font-bold text-orange-300">
                                {value}
                              </span>
                            </div>
                            <MovingWavyProgress pct={value} color="#fb923c" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-orange-500/5 rounded-2xl border border-orange-400/10">
                        <p className="text-sm text-stone-300 leading-relaxed">
                          <span className="font-bold text-orange-300">Coach&apos;s Tip:</span>{" "}
                          {statsData?.aiNudge || "You've improved your technical clarity by 15% this week. Focus on slowing down during behavioral answers to project more authority."}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="deep-card rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
                    <div className="relative p-8">
                      {upcomingSession ? (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <UpcomingSessionIcon />
                              <span className="text-xs font-bold text-white tracking-widest uppercase">
                                Upcoming Session
                              </span>
                            </div>
                            <button
                              onClick={handleCancelUpcoming}
                              className="text-xs text-stone-500 hover:text-stone-300 transition-colors font-mono"
                            >
                              Cancel
                            </button>
                          </div>

                          <h4 className="text-2xl font-bold tracking-tight text-white mb-2 truncate" title={`${upcomingSession.sessionType === "system_design" ? "System Design" : upcomingSession.sessionType === "technical" ? "Technical" : "Behavioral"} Mock`}>
                            {upcomingSession.sessionType === "system_design" ? "System Design" : upcomingSession.sessionType === "technical" ? "Technical" : "Behavioral"} Mock: {upcomingSession.role}
                          </h4>
                          <p className="text-stone-400 text-xs font-mono mb-1">
                            Target: <span className="text-white font-bold">{upcomingSession.company}</span>
                          </p>
                          <p className="text-stone-400 text-sm mb-6 font-mono">
                            {isReady ? (
                              <span className="text-emerald-400 font-bold animate-pulse">Now Ready</span>
                            ) : (
                              <>
                                Starting in <span className="text-white font-bold">{countdownText}</span>
                              </>
                            )}
                          </p>

                          <div className="flex items-center gap-4 mb-8">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full border-2 border-[#181615] bg-[#221d1a] flex items-center justify-center">
                                <span className="material-symbols-outlined text-xs text-orange-300">
                                  smart_toy
                                </span>
                              </div>
                              <img
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full border-2 border-[#181615] object-cover"
                                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB5rIby0qT7x8tQ1GUTLg11A38nutN8DwnWtpULrpErf2sILw9LL5MUu2yJgJJxGZssHmqwWil6wQ76D6A53SUDte-fM5LTVOxu0f90geB2GQbAwg9LY9OB1YA2FK34ItyiUw5ch5iZlJ6kjR-Trz_DjwpaCYlcvfXIaGcJEvkVETQLpeDVkp4q5Hha2l7ur3Up6JAz3S4rxv2_ovfGDvLEK9OGpcCBRQRYCBFIWdmh0k8kMpTgkTTHYreYV8WKjE-7gpet0rHGXF52"}
                              />
                            </div>
                            <span className="text-xs text-stone-500">AI Coach vs. You</span>
                          </div>

                          <Link
                            href={`/MockInterview?role=${encodeURIComponent(upcomingSession.role)}&company=${encodeURIComponent(upcomingSession.company)}&type=${encodeURIComponent(upcomingSession.sessionType)}&start=true`}
                            className="interactive w-full primary-blue font-bold py-4 rounded-xl flex items-center justify-center gap-2 group text-center block text-sm animate-pulse"
                          >
                            {isReady ? "Join Now" : "Start Early"}
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                              play_arrow
                            </span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-6">
                            <UpcomingSessionIcon />
                            <span className="text-xs font-bold text-white tracking-widest uppercase">
                              Upcoming Session
                            </span>
                          </div>

                          <h4 className="text-xl font-bold tracking-tight text-white mb-2">
                            No scheduled mock
                          </h4>
                          <p className="text-stone-400 text-xs mb-6 leading-relaxed">
                            Consistency is key. Schedule a practice session to keep your streak going!
                          </p>

                          <button
                            onClick={() => setShowScheduleModal(true)}
                            className="interactive w-full orange-soft font-semibold py-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 flex items-center justify-center gap-2 group text-sm"
                          >
                            Schedule Session
                            <span className="material-symbols-outlined transition-transform group-hover:scale-110">
                              schedule
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="soft-card rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <ActivityTimelineIcon />
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        Recent Activity
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {displayActivity.map((act: any, idx: number) => {
                        const bgClass = act.color === "emerald" ? "bg-emerald-500/10 border-emerald-500/10" : act.color === "orange" ? "bg-orange-500/10 border-orange-400/10" : "bg-amber-500/10 border-amber-500/10";
                        return (
                          <div key={idx} className="flex gap-4">
                            <CardIconShell className={`w-10 h-10 flex items-center justify-center ${bgClass}`}>
                              <ActivityIconForType icon={act.icon} />
                            </CardIconShell>
                            <div>
                              <p className="text-sm font-bold text-white">{act.title}</p>
                              <p className="text-xs text-stone-500">{act.subtitle}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Link href="/Progress" className="interactive block text-center w-full mt-6 py-2 text-sm text-stone-400 font-medium hover:text-white">
                      See all history
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <AnimatePresence>
            {activePrepLesson && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePrepLesson(null)}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="relative z-10 w-full max-w-4xl soft-card rounded-[24px] sm:rounded-[32px] bg-[#120f0e] border border-orange-500/20 p-5 sm:p-6 md:p-8 max-h-[90vh] md:max-h-[85vh] flex flex-col overflow-hidden"
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-5 pb-4 border-b border-orange-500/10 flex-shrink-0">
                    <div>
                      <h3 className="text-xl md:text-3xl font-mono tracking-tight text-white">
                        {lessonDetails[activePrepLesson].title}
                      </h3>
                      <p className="text-stone-400 text-xs md:text-sm mt-1">
                        {lessonDetails[activePrepLesson].subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePrepLesson(null)}
                      className="p-1.5 rounded-full hover:bg-orange-500/10 text-stone-400 hover:text-orange-300 transition-colors border border-orange-400/10 bg-transparent flex items-center justify-center cursor-pointer"
                      title="Close"
                    >
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {/* Left Column: Required Skills */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-mono md:text-sm font-bold uppercase tracking-wider text-orange-300 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm md:text-base">stars</span>
                          Key Skills Required
                        </h4>
                        <div className="space-y-3">
                          {lessonDetails[activePrepLesson].skills.map((skill, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-orange-500/5 border border-orange-400/10 flex items-start gap-3 text-left"
                            >
                              <span className="material-symbols-outlined text-orange-400 text-[16px] md:text-[18px] mt-0.5 select-none">
                                check_circle
                              </span>
                              <div>
                                <p className="text-xs md:text-sm font-mono font-bold text-white leading-snug">
                                  {skill.name}
                                </p>
                                <p className="text-[11px] md:text-xs font-sans text-stone-400 mt-0.5 leading-relaxed">
                                  {skill.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Curated Study Materials */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-mono md:text-sm font-bold uppercase tracking-wider text-orange-300 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm md:text-base">menu_book</span>
                          Recommended Resources
                        </h4>
                        <div className="space-y-3">
                          {lessonDetails[activePrepLesson].materials.map((mat, idx) => (
                            <a
                              key={idx}
                              href={mat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3.5 rounded-xl bg-[#1d1b1a] border border-orange-400/15 hover:border-orange-500/40 hover:bg-[#252221] transition-all group cursor-pointer text-left"
                            >
                              <div className="flex justify-between items-start mb-0.5">
                                <span className="font-mono font-bold text-xs md:text-sm text-orange-200 group-hover:text-orange-300 transition-colors flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                                    {mat.icon}
                                  </span>
                                  {mat.title}
                                </span>
                                <span className="material-symbols-outlined text-[14px] md:text-[16px] text-stone-500 group-hover:text-orange-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                  open_in_new
                                </span>
                              </div>
                              <p className="text-[11px] md:text-xs font-sans text-stone-400 leading-relaxed mt-0.5">
                                {mat.desc}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-orange-500/10 flex justify-end gap-3 flex-shrink-0">
                    <button
                      onClick={() => setActivePrepLesson(null)}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold border border-orange-400/15 text-stone-400 hover:text-white hover:border-orange-500/40 transition-all bg-transparent cursor-pointer"
                    >
                      Close Guide
                    </button>
                    <Link
                      href="/MockInterview"
                      onClick={() => setActivePrepLesson(null)}
                      className="interactive primary-blue px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">play_arrow</span>
                      Start Mock Interview
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScheduleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowScheduleModal(false)}
                  className="absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="relative w-full max-w-md deep-card rounded-[32px] p-8 overflow-hidden z-10 border border-orange-500/20"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono uppercase text-sm">
                        <UpcomingSessionIcon />
                        Schedule Practice
                      </h3>
                      <button
                        onClick={() => setShowScheduleModal(false)}
                        className="text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <form onSubmit={handleScheduleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">
                          Target Role
                        </label>
                        <SleekDropdown
                          value={scheduleRole}
                          onChange={(val) => setScheduleRole(val)}
                          options={["Software Engineer", "Product Manager", "Data Scientist", "Business Analyst", "UX Designer", "Machine Learning Engineer"]}
                          className="w-full rounded-xl bg-[#1c1917] border border-orange-400/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">
                          Target Company
                        </label>
                        <input
                          type="text"
                          required
                          value={scheduleCompany}
                          onChange={(e) => setScheduleCompany(e.target.value)}
                          placeholder="Google, Meta, etc."
                          className="w-full rounded-xl bg-[#1c1917] border border-orange-400/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/30 placeholder-stone-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">
                          Interview Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "behavioral", label: "Behavioral" },
                            { id: "technical", label: "Technical" },
                            { id: "system_design", label: "System Design" }
                          ].map(type => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setScheduleType(type.id)}
                              className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${scheduleType === type.id
                                ? "bg-orange-500/10 border-orange-500 text-orange-200"
                                : "bg-[#1c1917] border-orange-400/10 text-stone-400 hover:border-orange-400/20"
                                }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">
                          When to practice?
                        </label>
                        <div className="grid grid-cols-4 gap-2 font-mono">
                          {[
                            { val: "2", label: "In 2m" },
                            { val: "5", label: "In 5m" },
                            { val: "10", label: "In 10m" },
                            { val: "30", label: "In 30m" }
                          ].map(t => (
                            <button
                              key={t.val}
                              type="button"
                              onClick={() => setScheduleTimeOffset(t.val)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all ${scheduleTimeOffset === t.val
                                ? "bg-orange-500/10 border-orange-500 text-orange-200"
                                : "bg-[#1c1917] border-orange-400/10 text-stone-400 hover:border-orange-400/20"
                                }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="interactive w-full primary-blue font-bold py-3.5 rounded-xl mt-4 text-sm flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">done</span>
                        Confirm Schedule
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-[#120f0e]/85 backdrop-blur-lg border-t border-orange-400/10 flex justify-around items-center px-4 pb-4 pt-2">
            <Link className="flex flex-col items-center bg-orange-500/10 rounded-lg px-3 py-1 text-orange-300" href="/Dashboard">
              <span className="material-symbols-outlined">home</span>
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <Link className="flex flex-col items-center text-stone-400" href="/MockInterview">
              <span className="material-symbols-outlined">record_voice_over</span>
              <span className="text-xs font-semibold">Interview</span>
            </Link>
            <Link className="flex flex-col items-center text-stone-400" href="/Progress">
              <span className="material-symbols-outlined">insights</span>
              <span className="text-xs font-semibold">Progress</span>
            </Link>
            <Link className="flex flex-col items-center text-stone-400" href="/Profile">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "User"}
                  className="w-6 h-6 rounded-full object-cover border border-orange-400/20 mb-0.5"
                />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
              <span className="text-xs font-semibold">Profile</span>
            </Link>
          </nav>


        </div>
      </div>
    </div>
  );
}