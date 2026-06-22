"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";

import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import { CanvasText } from "@/components/CanvasText";
import Loader from "@/components/Loader";
import { GlareCard } from "@/components/GlareCard";
import { AnimatedInterviewLogo } from "@/components/AnimatedInterviewLogo";
import {
    CoachPreferencesIcon,
    PrepLibraryIcon,
    AiCoachIcon,
    InterviewTypeTechnicalIcon,
    InterviewTypeBehavioralIcon,
    InterviewTypeSystemDesignIcon,
    CoachingStarIcon,
    CoachingMicIcon,
    CoachingSchemaIcon,
    CardIconShell,
} from "@/components/AnimatedCardIcons";

const INTERVIEW_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    behavioral: InterviewTypeBehavioralIcon,
    technical: InterviewTypeTechnicalIcon,
    system_design: InterviewTypeSystemDesignIcon,
};

const COACHING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    psychology: CoachingStarIcon,
    mic: CoachingMicIcon,
    schema: CoachingSchemaIcon,
};

const ROLE_OPTIONS = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "Business Analyst",
    "UX Designer",
    "Marketing Manager",
    "Finance Analyst",
    "Machine Learning Engineer"
];

const INTERVIEW_TYPES = [
    {
        id: "behavioral",
        label: "Behavioral",
        icon: "psychology",
        color: "#f97316",
        desc: "STAR-based past experience"
    },
    {
        id: "technical",
        label: "Technical",
        icon: "terminal",
        color: "#1d4ed8",
        desc: "Concepts & problem solving"
    },
    {
        id: "system_design",
        label: "System Design",
        icon: "schema",
        color: "#f59e0b",
        desc: "Architecture & scalability"
    }
];

const DIFFICULTY_LEVELS = [
    {
        id: "beginner",
        label: "Beginner",
        desc: "0–1 yr exp",
        color: "#10b981"
    },
    {
        id: "mid",
        label: "Mid-Level",
        desc: "2–4 yrs exp",
        color: "#f97316"
    },
    {
        id: "senior",
        label: "Senior",
        desc: "5+ yrs exp",
        color: "#ef4444"
    }
];

const QUESTION_COUNTS = [3, 5, 7];

const READINESS_LEVELS: Record<string, { color: string; icon: string; bg: string }> = {
    "Not Ready": {
        color: "#ef4444",
        icon: "sentiment_dissatisfied",
        bg: "rgba(239,68,68,0.1)"
    },
    "Developing": {
        color: "#f59e0b",
        icon: "trending_up",
        bg: "rgba(245,158,11,0.1)"
    },
    "Junior Ready": {
        color: "#f97316",
        icon: "school",
        bg: "rgba(249,115,22,0.1)"
    },
    "Mid Ready": {
        color: "#10b981",
        icon: "verified",
        bg: "rgba(16,185,129,0.1)"
    },
    "Senior Ready": {
        color: "#8b5cf6",
        icon: "workspace_premium",
        bg: "rgba(139,92,246,0.1)"
    }
};

const COACHING_GUIDE = [
    {
        title: "STAR Framework",
        category: "Structuring Behavioral Answers",
        icon: "psychology",
        desc: "Align your responses using Situation, Task, Action, and Result. Describe the context, clarify your direct responsibilities, explain the specific actions you performed, and detail the measurable outcomes/impact of your efforts.",
        pills: ["Situation", "Task", "Action", "Result"]
    },
    {
        title: "Voice Analysis",
        category: "Speech Coaching & Pacing",
        icon: "mic",
        desc: "Leverage real-time voice recognition to capture your spoken answers. The coach measures pacing, clarity, and flags fumbles on filler words like 'uhmm', 'like', and 'so' to suggest exact speech improvements.",
        pills: ["Pacing", "Clarity", "Filler Words", "Sentiment"]
    },
    {
        title: "Concept Mapping",
        category: "Tech & Design Architecture",
        icon: "schema",
        desc: "Demonstrate structured thinking under pressure. Learn to draw architectural diagrams, model database schemas, design highly scalable REST APIs, and optimize algorithmic complexity on the fly.",
        pills: ["Systems", "Algorithms", "APIs", "Data Models"]
    }
];

export default function MockInterviewPage() {
    const { token } = useAuth();
    const [selectedRole, setSelectedRole] = useState("");
    const [sessionType, setSessionType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [company, setCompany] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [customRole, setCustomRole] = useState("");
    const [isCustomRole, setIsCustomRole] = useState(false);
    const [step, setStep] = useState<"setup" | "loading" | "session" | "results">("setup");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerText, setAnswerText] = useState("");
    const [answers, setAnswers] = useState<any[]>([]);
    const [timer, setTimer] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [evaluationFeedback, setEvaluationFeedback] = useState<any | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [sessionResult, setSessionResult] = useState<any | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [pastSessions, setPastSessions] = useState<any[]>([]);
    const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const activeRole = isCustomRole ? customRole : selectedRole;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        setSpeechSupported(
            !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
        );
    }, []);

    useEffect(() => {
        if (step === "session") {
            intervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        };
    }, [step]);

    const formatTime = (secs: number) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        const fetchPastSessions = async () => {
            if (!token) return;
            try {
                const res = await fetch("/api/sessions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setPastSessions(
                        data.sessions?.filter((s: any) => s.status === "completed").slice(0, 5) || []
                    );
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPastSessions();
    }, [token]);

    const startSession = async () => {
        setStep("loading");
        let generatedSessionId = null;
        let loadedQuestions = [];
        if (token) {
            try {
                const res = await fetch("/api/sessions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        role: activeRole,
                        company,
                        sessionType,
                        difficulty,
                        numQuestions
                    })
                });
                const data = await res.json();
                if (data.success && data.session) {
                    generatedSessionId = data.session._id;
                    loadedQuestions = data.session.questions.map((q: any) => ({
                        question: q.question,
                        hint: q.hint || "",
                        category: q.category || "",
                        difficulty: q.difficulty || difficulty
                    }));
                }
            } catch (err) {
                console.error("Failed to start session:", err);
            }
        }
        setSessionId(generatedSessionId);
        setQuestions(loadedQuestions);
        setStep("session");
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setTimer(0);
        setAnswerText("");
        setEvaluationFeedback(null);
        setShowFeedback(false);
    };

    const handleAnswerSubmit = async (skipped = false) => {
        const answer = skipped ? "" : answerText.trim();
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }
        const defaultScores = {
            starScore: 0,
            clarityScore: 0,
            confidenceScore: 0,
            technicalAccuracyScore: 0,
            hasSituation: false,
            hasTask: false,
            hasAction: false,
            hasResult: false,
            fillerWordCount: 0,
            aiSuggestion: "",
            strengthPoints: [],
            improvementPoints: []
        };

        setAnswers(prev => [...prev, { answer, scores: defaultScores }]);

        if (token && sessionId) {
            try {
                await fetch(`/api/sessions/${sessionId}/answer`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        questionIndex: currentQuestionIndex,
                        answer
                    })
                });
            } catch (err) {
                console.error("Error saving answer:", err);
            }
        }

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setAnswerText("");
            setShowHint(false);
        } else {
            completeSession();
        }
    };

    const completeSession = async () => {
        setIsCompleting(true);
        setStep("results");
        if (sessionId && token) {
            try {
                const res = await fetch(`/api/sessions/${sessionId}/complete`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        durationSeconds: timer
                    })
                });
                const data = await res.json();
                if (data.success && data.session) {
                    setSessionResult(data.session);
                    const mappedAnswers = data.session.questions.map((q: any) => ({
                        answer: q.userAnswer || "",
                        scores: {
                            starScore: q.starScore || 0,
                            clarityScore: q.clarityScore || 0,
                            confidenceScore: q.confidenceScore || 0,
                            technicalAccuracyScore: q.technicalAccuracyScore || 0,
                            hasSituation: q.hasSituation || false,
                            hasTask: q.hasTask || false,
                            hasAction: q.hasAction || false,
                            hasResult: q.hasResult || false,
                            fillerWordCount: q.fillerWordCount || 0,
                            aiSuggestion: q.aiSuggestion || "",
                            strengthPoints: q.strengthPoints || [],
                            improvementPoints: q.improvementPoints || [],
                            sampleCorrectAnswer: q.sampleCorrectAnswer || ""
                        }
                    }));
                    setAnswers(mappedAnswers);
                }
            } catch (err) {
                console.error("Error completing session:", err);
            }
        }
        setIsCompleting(false);
    };

    const overallScore = sessionResult?.overallScore ?? 0;

    if (step === "setup") {
        return (
            <div className="relative min-h-screen orange-page-tint">
                <style dangerouslySetInnerHTML={{
                    __html: `
          .animate-title {
            opacity:0;
            transform:translateY(18px);
            animation:fadeUpTitle 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
          }
          .animate-subtitle {
            opacity:0;
            transform:translateY(12px);
            animation:fadeUpSubtitle 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s forwards;
          }
          @keyframes fadeUpTitle {
            to {
              opacity:1;
              transform:translateY(0);
            }
          }
          @keyframes fadeUpSubtitle {
            to {
              opacity:1;
              transform:translateY(0);
            }
          }

          @media (max-width: 639px) {
            .interview-header {
              border-bottom: none !important;
              box-shadow: none !important;
              border-bottom-left-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
              margin-bottom: 0 !important;
            }
            .interview-setup-card {
              border-top: none !important;
              box-shadow: none !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
              margin-top: 0 !important;
            }
          }
        ` }} />
                <GridBackgroundDemo />
                <div
                    className="cursor-glow"
                    style={{
                        transform: `translate3d(${mousePos.x - 130}px, ${mousePos.y - 130}px, 0)`
                    }}
                />
                <TopBar title="AI Mock Interview Coach" />
                <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
                    <div className="w-full max-w-7xl mx-auto">
                        <section className="relative overflow-hidden select-none hero-shell p-6 sm:p-8 md:p-10 interview-header rounded-t-[32px] rounded-b-none border-b-0 mb-0 sm:rounded-[32px] sm:border-b sm:mb-10">
                            <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="hidden sm:block absolute bottom-0 right-0 w-72 h-72 bg-orange-400/5 rounded-full blur-[120px] pointer-events-none" />

                            {/* Clipped background decoration container to match the hero-shell shape */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-t-[32px] rounded-b-none sm:rounded-[32px]">
                                {/* Absolutely positioned giant static background decoration */}
                                <div className="absolute top-1/2 -translate-y-[56%] right-0 w-[760px] h-[380px] sm:w-[1000px] sm:h-[500px] md:w-[1200px] md:h-[600px] lg:w-[1400px] lg:h-[700px] translate-x-[15%] sm:translate-x-[18%] md:translate-x-[20%] lg:translate-x-[22%] -rotate-[8deg] opacity-65">
                                    <AnimatedInterviewLogo />
                                </div>
                            </div>

                            <div className="hidden sm:flex relative z-10 max-w-4xl flex-col items-start text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full eyebrow text-[11px] font-semibold tracking-wider mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                    <span className="font-mono text-orange-300">Neural Engine V4.2.0 • Status: Synced</span>
                                </div>

                                <h1 className="font-headline-lg sm:text-5xl md:text-[64px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent] text-left select-none">
                                    AI Mock
                                    <br />
                                    <span className="text-orange-300 [-webkit-text-stroke:0px] [-webkit-text-fill-color:#fdba74] whitespace-nowrap bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                                        <CanvasText
                                            text="Interview Coach"
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
                                    </span>
                                </h1>

                                <p className="text-sm md:text-lg text-stone-400 max-w-2xl mt-5 leading-relaxed text-left">
                                    AI-generated questions tailored to your role. Voice-ready. Real-time feedback.
                                </p>
                            </div>

                            <div className="flex sm:hidden relative z-10 max-w-4xl flex-col items-center text-center mx-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-[10px] font-bold tracking-[0.15em] font-mono mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
                                    <span>INTERVIEW COACH ACTIVE</span>
                                </div>

                                <div
                                    className="text-stone-400 font-bold uppercase tracking-[0.6em] text-[11px] sm:text-xs mb-3 font-mono"
                                    style={{ letterSpacing: '0.65em' }}
                                >
                                    MOCK INTERVIEW
                                </div>

                                <h1 className="text-4xl xs:text-5xl font-black text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] tracking-tight leading-none text-center select-none font-mono">
                                    <CanvasText
                                        text="Interview Coach"
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

                                <p className="text-xs sm:text-sm text-stone-400 max-w-md mt-4 leading-relaxed text-center">
                                    AI-generated questions tailored to your role. Voice-ready. Real-time feedback.
                                </p>
                            </div>
                        </section>

                        <div className="soft-card p-5 sm:p-8 rounded-b-2xl sm:rounded-2xl interview-setup-card rounded-t-none border-t-0 sm:rounded-t-2xl sm:border-t flex flex-col gap-6 font-mono">
                            <div className="flex items-center justify-between mb-2 border-b border-orange-500/10 pb-3">
                                <h3 className="font-headline-md text-xs sm:text-sm text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                                    <CoachPreferencesIcon />
                                    COACH PREFERENCES
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Processor Online</span>
                                </div>
                            </div>

                            <div className="relative flex flex-col gap-1.5 group">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                                    Target Role
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                                        work
                                    </span>
                                    <input
                                        id="mock-interview-target-role"
                                        name="mock-interview-target-role"
                                        autoComplete="off"
                                        value={activeRole}
                                        onChange={e => {
                                            setCustomRole(e.target.value);
                                            setIsCustomRole(true);
                                        }}
                                        placeholder="Software Engineer, Product Manager, UX Designer..."
                                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-sm rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                                    />
                                </div>
                                <div className="flex overflow-x-auto sm:flex-wrap gap-2 mt-2 scrollbar-none py-0.5 whitespace-nowrap">
                                    {ROLE_OPTIONS.map((r) => {
                                        const active = !isCustomRole && selectedRole === r;
                                        return (
                                            <button
                                                key={r}
                                                onClick={() => {
                                                    setSelectedRole(r);
                                                    setIsCustomRole(false);
                                                }}
                                                className={`px-3 py-1.5 text-[10px] font-semibold cut-tag transition-all ${active ? "active text-orange-300" : "text-stone-400 hover:text-orange-200"}`}
                                                style={active
                                                    ? { "--tag-active-bg": "#2d1a0e", "--tag-border": "rgba(255,255,255,0.9)" } as React.CSSProperties
                                                    : { "--tag-bg": "#1a1817", "--tag-border": "rgba(251,146,60,0.18)" } as React.CSSProperties
                                                }
                                            >
                                                {r}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="relative flex flex-col gap-1.5 group">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors">
                                    Interview Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {INTERVIEW_TYPES.map(st => {
                                        const active = sessionType === st.id;
                                        const activeTheme: Record<string, { bg: string; color: string }> = {
                                            technical: { bg: "#1a2c5a", color: "#60a5fa" },
                                            behavioral: { bg: "#2d1a4a", color: "#c084fc" },
                                            system_design: { bg: "#2e2508", color: "#fbbf24" },
                                        };
                                        const theme = activeTheme[st.id] || { bg: "#1a1716", color: st.color };
                                        return (
                                            <button
                                                key={st.id}
                                                onClick={() => setSessionType(st.id)}
                                                className={`flex flex-col items-center gap-2 p-4 text-center cut-choice-btn ${active ? "text-white" : ""}`}
                                                style={active
                                                    ? { "--btn-bg": theme.bg, "--btn-border": "rgba(255,255,255,1)", "--btn-border-hover": "rgba(255,255,255,1)", "--btn-filter": "drop-shadow(0 0 8px rgba(255,255,255,0.3))" } as React.CSSProperties
                                                    : { "--btn-bg": "#1a1716", "--btn-border": "rgba(251,146,60,0.15)" } as React.CSSProperties
                                                }
                                            >
                                                {(() => {
                                                    const TypeIcon = INTERVIEW_TYPE_ICONS[st.id];
                                                    return TypeIcon ? <TypeIcon /> : null;
                                                })()}
                                                <span className="font-semibold text-xs text-white">{st.label}</span>
                                                <span className="text-[9px] text-stone-500 leading-snug">{st.desc}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative flex flex-col gap-1.5 group">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors">
                                        Difficulty Level
                                    </label>
                                    <div className="flex gap-2">
                                        {DIFFICULTY_LEVELS.map(d => {
                                            const active = difficulty === d.id;
                                            const diffTheme: Record<string, { bg: string; color: string }> = {
                                                beginner: { bg: "#14422b", color: "#34d399" },
                                                mid: { bg: "#0f3040", color: "#22d3ee" },
                                                senior: { bg: "#4c1b1b", color: "#f87171" },
                                            };
                                            const dTheme = diffTheme[d.id] || { bg: "#1a1716", color: d.color };
                                            return (
                                                <button
                                                    key={d.id}
                                                    onClick={() => setDifficulty(d.id)}
                                                    className="flex-1 flex flex-col items-center p-3 text-center cut-choice-btn"
                                                    style={active
                                                        ? { "--btn-bg": dTheme.bg, "--btn-border": "rgba(255,255,255,1)", "--btn-border-hover": "rgba(255,255,255,1)", "--btn-filter": "drop-shadow(0 0 8px rgba(255,255,255,0.3))", color: dTheme.color } as React.CSSProperties
                                                        : { "--btn-bg": "#1a1716", "--btn-border": "rgba(251,146,60,0.15)", color: "#78716c" } as React.CSSProperties
                                                    }
                                                >
                                                    <span className="text-xs font-bold">{d.label}</span>
                                                    <span className="text-[9px] mt-0.5 opacity-70">{d.desc}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="relative flex flex-col gap-1.5 group">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors">
                                        Number of Questions
                                    </label>
                                    <div className="flex gap-2">
                                        {QUESTION_COUNTS.map(n => {
                                            const active = numQuestions === n;
                                            const qTheme: Record<number, { bg: string; color: string }> = {
                                                3: { bg: "#2d1a4a", color: "#c084fc" },
                                                5: { bg: "#0f3040", color: "#22d3ee" },
                                                7: { bg: "#3d0f28", color: "#fb7185" },
                                            };
                                            const qt = qTheme[n] || { bg: "#1a1716", color: "#fb923c" };
                                            return (
                                                <button
                                                    key={n}
                                                    onClick={() => setNumQuestions(n)}
                                                    className="flex-1 py-3 text-sm font-bold text-center cut-choice-btn"
                                                    style={active
                                                        ? { "--btn-bg": qt.bg, "--btn-border": "rgba(255,255,255,1)", "--btn-border-hover": "rgba(255,255,255,1)", "--btn-filter": "drop-shadow(0 0 8px rgba(255,255,255,0.3))", color: qt.color } as React.CSSProperties
                                                        : { "--btn-bg": "#1a1716", "--btn-border": "rgba(251,146,60,0.15)", color: "#78716c" } as React.CSSProperties
                                                    }
                                                >
                                                    {n}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex flex-col gap-1.5 group">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                                    Target Company <span className="normal-case text-stone-600">(optional — for tailored questions)</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-orange-400">
                                        business
                                    </span>
                                    <input
                                        id="mock-interview-target-company"
                                        name="mock-interview-target-company"
                                        autoComplete="off"
                                        value={company}
                                        onChange={e => setCompany(e.target.value)}
                                        placeholder={isMobile ? "Meta, Stripe, OpenAI..." : "Google, Meta, Stripe, OpenAI..."}
                                        className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-sm rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono"
                                    />
                                </div>
                            </div>

                            {pastSessions.length > 0 && (
                                <div className="relative flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                                        Your Past Sessions
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        {pastSessions.map((s: any, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#1a1716] border border-orange-400/10"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                                                        style={{
                                                            background:
                                                                s.overallScore >= 80
                                                                    ? "rgba(16,185,129,0.2)"
                                                                    : s.overallScore >= 60
                                                                        ? "rgba(249,115,22,0.2)"
                                                                        : "rgba(239,68,68,0.2)",
                                                            color:
                                                                s.overallScore >= 80
                                                                    ? "#10b981"
                                                                    : s.overallScore >= 60
                                                                        ? "#f97316"
                                                                        : "#ef4444"
                                                        }}
                                                    >
                                                        {s.overallScore}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-white">
                                                            {s.role}
                                                        </p>
                                                        <p className="text-[10px] text-stone-500">
                                                            {s.sessionType} · {new Date(s.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {s.readinessLevel && (
                                                    <span
                                                        className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                                        style={{
                                                            background:
                                                                (READINESS_LEVELS[s.readinessLevel] ||
                                                                    READINESS_LEVELS["Developing"]
                                                                ).bg,
                                                            color:
                                                                (READINESS_LEVELS[s.readinessLevel] ||
                                                                    READINESS_LEVELS["Developing"]
                                                                ).color
                                                        }}
                                                    >
                                                        {s.readinessLevel}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={startSession}
                                disabled={!activeRole.trim() || !sessionType || !difficulty}
                                className="interactive wavy-blue-btn w-full py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-sans font-medium text-white text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-40 mt-4"
                            >
                                <AiCoachIcon />
                                <span className="hidden sm:inline">Generate AI Questions & Start — {activeRole || "Select a role"}</span>
                                <span className="inline sm:hidden">Launch Session</span>
                            </button>
                        </div>

                        {/* Interview Prep & AI Insights Hub */}
                        <div className="mt-12 flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5 border-b border-orange-500/10 pb-3">
                                <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 uppercase tracking-wider">
                                    <PrepLibraryIcon />
                                    INTERVIEW PREP & AI INSIGHTS
                                </h3>
                                <p className="text-[10px] text-stone-500 uppercase tracking-widest">SYSTEM MANUAL & FRAMEWORK GUIDELINES</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {COACHING_GUIDE.map((card, i) => {
                                    const GuideIcon = COACHING_ICONS[card.icon] || CoachingStarIcon;
                                    return (
                                    <GlareCard key={i} containerClassName="aspect-auto md:[aspect-ratio:4/3]" className="flex flex-col justify-start gap-3 p-5 sm:p-5 bg-[#1d0f0a]/90 border border-orange-600/30 rounded-[24px] h-full text-left font-sans transition-colors hover:bg-[#2c170f]/95 hover:border-orange-500/50">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <CardIconShell className="w-9 h-9 flex items-center justify-center">
                                                <GuideIcon />
                                            </CardIconShell>
                                            <span className="text-[9px] uppercase tracking-widest text-orange-400/80 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10">
                                                Module {i + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] uppercase tracking-wider text-orange-400/60 block leading-none">{card.category}</span>
                                            <h4 className="text-base font-semibold text-xl text-white mt-1 tracking-tight">{card.title}</h4>
                                        </div>
                                        <p className="text-xs text-stone-300 leading-relaxed font-sans">
                                            {card.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {card.pills.map((pill) => (
                                                <span key={pill} className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] tracking-wider bg-orange-500/5 text-orange-300 border border-orange-500/10">
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                    </GlareCard>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (step === "loading") {
        return (
            <div className="relative min-h-screen orange-page-tint flex items-center justify-center">
                <GridBackgroundDemo />
                <div className="relative z-20 text-center flex flex-col items-center gap-6">
                    <Loader title="AI Mock Coach" text="Generating..." />
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Generating Your Interview</h2>
                        <p className="text-stone-400 text-sm max-w-xs">
                            Our AI is crafting {numQuestions} tailored {sessionType} questions for{" "}
                            <span className="text-orange-300 font-semibold">{activeRole}</span>
                            {difficulty !== "mid" ? ` at ${difficulty} level` : ""}
                            {company ? ` at ${company}` : ""}
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === "session") {
        return (
            <div className="h-screen flex flex-col overflow-hidden orange-page-tint sidebar-aware">
                <GridBackgroundDemo />
                <div
                    className="flex items-center justify-between px-6 h-16 border-b border-orange-400/10 flex-shrink-0 relative z-20"
                    style={{ background: "rgba(14,12,11,0.95)" }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30">
                            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-rose-400 tracking-widest">
                                LIVE SESSION
                            </span>
                        </div>
                        <span className="font-body-md text-body-md text-on-surface-variant text-sm">
                            {activeRole} · {INTERVIEW_TYPES.find(t => t.id === sessionType)?.label} ·{" "}
                            {DIFFICULTY_LEVELS.find(l => l.id === difficulty)?.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Timer</p>
                            <p className="text-xl font-black text-white font-mono">{formatTime(timer)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest">Question</p>
                            <p className="text-xl font-black text-white">
                                {currentQuestionIndex + 1}
                                <span className="text-stone-500 font-normal text-sm">/{questions.length}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => completeSession()}
                            className="px-4 py-2 rounded-lg text-sm font-bold border border-orange-400/20 text-stone-400 hover:text-white hover:border-rose-500/50 transition-all"
                        >
                            End Session
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden relative z-20">
                    <div className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl p-6 bg-orange-500/5 border border-orange-400/15"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">
                                        Question {currentQuestionIndex + 1}
                                    </p>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {questions[currentQuestionIndex]?.category && (
                                            <span className="chip-orange text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                                                {questions[currentQuestionIndex].category}
                                            </span>
                                        )}
                                        <span
                                            className="text-[10px] px-2 py-1 rounded-full font-bold uppercase capitalize"
                                            style={{
                                                background:
                                                    difficulty === "senior"
                                                        ? "rgba(239,68,68,0.15)"
                                                        : difficulty === "beginner"
                                                            ? "rgba(16,185,129,0.15)"
                                                            : "rgba(249,115,22,0.15)",
                                                color:
                                                    difficulty === "senior"
                                                        ? "#ef4444"
                                                        : difficulty === "beginner"
                                                            ? "#10b981"
                                                            : "#f97316"
                                            }}
                                        >
                                            {questions[currentQuestionIndex]?.difficulty || difficulty}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xl font-headline-md text-white leading-relaxed">
                                    "{questions[currentQuestionIndex]?.question}"
                                </p>
                                {questions[currentQuestionIndex]?.hint && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setShowHint(prev => !prev)}
                                            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-orange-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                tips_and_updates
                                            </span>
                                            {showHint ? "Hide Hint" : "Show Hint"}
                                        </button>
                                        <AnimatePresence>
                                            {showHint && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-2 p-3 rounded-xl bg-orange-500/5 border border-orange-400/10"
                                                >
                                                    <p className="text-xs text-stone-300 leading-relaxed">
                                                        💡 {questions[currentQuestionIndex].hint}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex-1 soft-card rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="font-headline-md text-body-md text-white">Your Answer</p>
                                <button
                                    onClick={() => {
                                        const SpeechRec =
                                            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                        if (!SpeechRec) return;
                                        if (isRecording) {
                                            recognitionRef.current?.stop();
                                            setIsRecording(false);
                                            return;
                                        }
                                        const rec = new SpeechRec();
                                        rec.continuous = true;
                                        rec.interimResults = true;
                                        rec.lang = "en-US";
                                        recognitionRef.current = rec;
                                        rec.onresult = (event: any) => {
                                            let text = "";
                                            for (let i = 0; i < event.results.length; i++) {
                                                text += event.results[i][0].transcript;
                                            }
                                            setAnswerText(text);
                                        };
                                        rec.onerror = () => setIsRecording(false);
                                        rec.onend = () => setIsRecording(false);
                                        rec.start();
                                        setIsRecording(true);
                                    }}
                                    disabled={!speechSupported}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-30 ${isRecording ? "text-rose-400" : "text-stone-400 hover:text-white"
                                        }`}
                                    style={
                                        isRecording
                                            ? {
                                                background: "rgba(244,63,94,0.15)",
                                                border: "1px solid rgba(244,63,94,0.35)"
                                            }
                                            : {
                                                border: "1px solid rgba(251,146,60,0.15)"
                                            }
                                    }
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {isRecording ? "mic" : "mic_off"}
                                    </span>
                                    {isRecording
                                        ? "Listening…"
                                        : speechSupported
                                            ? "Voice Input"
                                            : "Voice (Chrome only)"}
                                </button>
                            </div>

                            {isRecording && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center gap-1 h-8">
                                        {[0.6, 1, 0.7, 1.2, 0.5, 0.9, 1.1, 0.6, 1, 0.8].map((wave, wIdx) => (
                                            <div
                                                key={wIdx}
                                                className="w-1.5 bg-rose-400 rounded-full wave-bar"
                                                style={{
                                                    height: `${20 * wave}px`,
                                                    animationDelay: `${0.12 * wIdx}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-rose-400 font-bold">
                                        Transcribing your voice...
                                    </span>
                                </div>
                            )}

                            <textarea
                                value={answerText}
                                onChange={e => setAnswerText(e.target.value)}
                                disabled={isEvaluating}
                                placeholder={
                                    "Type your answer here using the STAR method:\n\nSituation: Set the context...\nTask: Describe your responsibility...\nAction: What steps did you take...\nResult: What was the measurable outcome..."
                                }
                                className="flex-1 bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl p-4 border border-orange-400/15 focus:border-orange-500 outline-none resize-none transition-all min-h-[160px] disabled:opacity-60"
                                rows={7}
                            />

                            <AnimatePresence>
                                {(isEvaluating || showFeedback) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="rounded-xl overflow-hidden"
                                    >
                                        {isEvaluating ? (
                                            <div className="flex justify-center p-6 bg-blue-500/5 border border-blue-400/15 rounded-xl">
                                                <Loader title="AI Coach" text="Evaluating..." />
                                            </div>
                                        ) : (
                                            evaluationFeedback && (
                                                <div className="p-4 bg-emerald-500/5 border border-emerald-400/15 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="material-symbols-outlined text-emerald-400 text-[18px]"
                                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                                        >
                                                            smart_toy
                                                        </span>
                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                                            AI Feedback
                                                        </span>
                                                        <span className="ml-auto text-xs text-stone-500">
                                                            Advancing in 3s...
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {[
                                                            ["STAR", evaluationFeedback.starScore, "#f97316"],
                                                            ["Clarity", evaluationFeedback.clarityScore, "#10b981"],
                                                            ["Confidence", evaluationFeedback.confidenceScore, "#f59e0b"]
                                                        ].map(([name, score, color]) => (
                                                            <div
                                                                key={name as string}
                                                                className="flex-1 text-center p-2 rounded-lg"
                                                                style={{ background: `${color}10` }}
                                                            >
                                                                <p className="text-lg font-black" style={{ color: color as string }}>
                                                                    {score as string}
                                                                </p>
                                                                <p className="text-[9px] text-stone-500">{name as string}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {evaluationFeedback.aiSuggestion && (
                                                        <p className="text-xs text-stone-300 leading-relaxed">
                                                            💡 {evaluationFeedback.aiSuggestion}
                                                        </p>
                                                    )}
                                                    {evaluationFeedback.strengthPoints?.length > 0 && (
                                                        <div className="flex gap-1 flex-wrap">
                                                            {evaluationFeedback.strengthPoints.map((pt: string, c: number) => (
                                                                <span
                                                                    key={c}
                                                                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                >
                                                                    {pt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAnswerSubmit(true)}
                                    disabled={isEvaluating}
                                    className="px-5 py-3 rounded-xl text-sm font-bold border border-orange-400/15 text-stone-400 hover:text-white hover:border-stone-400 transition-all disabled:opacity-30"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={() => handleAnswerSubmit(false)}
                                    disabled={!answerText.trim() || isEvaluating}
                                    className="interactive wavy-blue-btn flex-1 py-3 rounded-xl font-headline-md text-body-md text-white flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <span
                                        className="material-symbols-outlined text-[18px]"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        send
                                    </span>
                                    Submit & Get AI Feedback
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="w-80 hidden lg:flex flex-col border-l border-orange-400/10 bg-[#0e0c0b] overflow-y-auto">
                        <div className="p-5 border-b border-orange-400/10">
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">
                                STAR Checklist
                            </p>
                            {[
                                [
                                    "Situation",
                                    "Set the scene",
                                    answerText.toLowerCase().includes("sit") ||
                                    /when|during|at|context/i.test(answerText)
                                ],
                                [
                                    "Task",
                                    "Your responsibility",
                                    /task|challenge|goal|objective|responsible|needed/i.test(answerText)
                                ],
                                [
                                    "Action",
                                    "Steps you took",
                                    /I did|I led|I built|I created|I implemented|I decided|action|step/i.test(
                                        answerText
                                    )
                                ],
                                [
                                    "Result",
                                    "Measurable outcome",
                                    /result|outcome|impact|improved|reduced|achieved|saved|led to/i.test(answerText)
                                ]
                            ].map(([name, desc, done]) => (
                                <div
                                    key={name as string}
                                    className={`flex items-center gap-3 py-2 transition-all ${done ? "opacity-100" : "opacity-40"
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : "border border-orange-400/15"
                                            }`}
                                    >
                                        {done && (
                                            <span className="material-symbols-outlined text-white text-[14px]">
                                                check
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold ${done ? "text-emerald-400" : "text-stone-500"}`}>
                                            {name as string}
                                        </p>
                                        <p className="text-[10px] text-stone-500">{desc as string}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5">
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
                                Session Progress
                            </p>
                            <div className="flex flex-col gap-2">
                                {questions.map((q, cIdx) => (
                                    <div
                                        key={cIdx}
                                        className={`flex items-start gap-3 py-1.5 px-2 rounded-lg ${cIdx === currentQuestionIndex ? "bg-orange-500/10" : ""
                                            }`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 ${cIdx < currentQuestionIndex
                                                ? "bg-emerald-500 text-white"
                                                : cIdx === currentQuestionIndex
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-[#1d1b1a] text-stone-500"
                                                }`}
                                        >
                                            {cIdx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span
                                                className={`text-xs ${cIdx === currentQuestionIndex
                                                    ? "text-white font-bold"
                                                    : cIdx < currentQuestionIndex
                                                        ? "text-emerald-400"
                                                        : "text-stone-500"
                                                    }`}
                                            >
                                                {cIdx < currentQuestionIndex
                                                    ? "Answered ✓"
                                                    : cIdx === currentQuestionIndex
                                                        ? "Current"
                                                        : "Upcoming"}
                                            </span>
                                            {cIdx === currentQuestionIndex && q.category && (
                                                <p className="text-[10px] text-orange-400 mt-0.5">{q.category}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // Results State
    const selectedReadiness = sessionResult?.readinessLevel
        ? READINESS_LEVELS[sessionResult.readinessLevel] || READINESS_LEVELS.Developing
        : null;

    return (
        <div className="relative min-h-screen orange-page-tint">
            <GridBackgroundDemo />
            <div
                className="cursor-glow"
                style={{
                    transform: `translate3d(${mousePos.x - 130}px, ${mousePos.y - 130}px, 0)`
                }}
            />
            <TopBar title="Session Results" />
            <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {isCompleting ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-32">
                            <Loader title="AI Coach" text="Analyzing..." />
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-white mb-2">Generating Your AI Report</h2>
                                <p className="text-stone-400 text-sm">
                                    Our AI coach is analyzing your full session and preparing a comprehensive report...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Session Complete</h1>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                        {activeRole} · {INTERVIEW_TYPES.find(t => t.id === sessionType)?.label} ·{" "}
                                        {DIFFICULTY_LEVELS.find(l => l.id === difficulty)?.label} · {formatTime(timer)}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setStep("setup");
                                            setAnswers([]);
                                            setSessionResult(null);
                                            setQuestions([]);
                                            setTimer(0);
                                        }}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold border border-orange-400/15 text-stone-400 hover:text-white hover:border-orange-500/50 transition-all"
                                    >
                                        New Session
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStep("setup");
                                            setAnswers([]);
                                            setSessionResult(null);
                                            setQuestions([]);
                                            setTimer(0);
                                        }}
                                        className="interactive wavy-blue-btn px-5 py-2.5 rounded-xl font-headline-md text-body-md text-white flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">replay</span>
                                        Try Again
                                    </button>
                                </div>
                            </div>

                            {selectedReadiness && (
                                <div
                                    className="rounded-2xl p-5 mb-6 flex items-center gap-4"
                                    style={{
                                        background: selectedReadiness.bg,
                                        border: `1px solid ${selectedReadiness.color}30`
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined text-[36px]"
                                        style={{
                                            color: selectedReadiness.color,
                                            fontVariationSettings: "'FILL' 1"
                                        }}
                                    >
                                        {selectedReadiness.icon}
                                    </span>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
                                            AI Readiness Assessment
                                        </p>
                                        <p className="text-2xl font-bold" style={{ color: selectedReadiness.color }}>
                                            {sessionResult.readinessLevel}
                                        </p>
                                        {sessionResult.cumulativeScoreAtTime > 0 && (
                                            <p className="text-xs text-stone-400 mt-0.5">
                                                Cumulative score across all sessions:{" "}
                                                <span className="font-bold" style={{ color: selectedReadiness.color }}>
                                                    {sessionResult.cumulativeScoreAtTime}/100
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    ["Overall", overallScore, "#f97316"],
                                    [
                                        "STAR Score",
                                        sessionResult?.starComplianceScore ??
                                        (answers.reduce((acc, a) => acc + (a.scores?.starScore || 0), 0) /
                                            Math.max(answers.length, 1)) |
                                        0,
                                        "#fb923c"
                                    ],
                                    [
                                        "Clarity",
                                        sessionResult?.clarityScore ??
                                        (answers.reduce((acc, a) => acc + (a.scores?.clarityScore || 0), 0) /
                                            Math.max(answers.length, 1)) |
                                        0,
                                        "#10b981"
                                    ],
                                    [
                                        "Confidence",
                                        sessionResult?.confidenceScore ??
                                        (answers.reduce((acc, a) => acc + (a.scores?.confidenceScore || 0), 0) /
                                            Math.max(answers.length, 1)) |
                                        0,
                                        "#f59e0b"
                                    ]
                                ].map(([name, score, color]) => (
                                    <div key={name as string} className="soft-card rounded-2xl p-5 flex flex-col items-center">
                                        <svg className="w-16 h-16 -rotate-90 mb-2" viewBox="0 0 64 64">
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="26"
                                                fill="none"
                                                stroke="#221d1a"
                                                strokeWidth="6"
                                            />
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="26"
                                                fill="none"
                                                stroke={color as string}
                                                strokeWidth="6"
                                                strokeDasharray={`${((score as number) / 100) * 163} 163`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <span className="text-2xl font-black text-white">
                                            {Math.round(score as number)}
                                        </span>
                                        <span className="text-xs text-stone-400 text-center mt-1">{name as string}</span>
                                    </div>
                                ))}
                            </div>

                            {sessionResult?.aiReport && (
                                <div
                                    className="rounded-2xl p-6 mb-6 bg-blue-500/5 border border-blue-400/15"
                                    style={{ borderLeft: "4px solid #3b82f6" }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="material-symbols-outlined text-blue-400 text-[20px]"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            smart_toy
                                        </span>
                                        <p className="text-sm font-bold text-blue-300 uppercase tracking-widest">
                                            AI Coach's Full Report
                                        </p>
                                    </div>
                                    <p className="text-sm text-stone-300 leading-relaxed">
                                        {sessionResult.aiReport}
                                    </p>
                                </div>
                            )}

                            {sessionResult?.coachTip && (
                                <div
                                    className="rounded-2xl p-5 mb-6 bg-orange-500/5 border border-orange-400/15"
                                    style={{ borderLeft: "4px solid #f97316" }}
                                >
                                    <p className="text-sm text-stone-300 leading-relaxed">
                                        <span className="font-bold text-orange-300">🎯 Top Coaching Tip: </span>
                                        {sessionResult.coachTip}
                                    </p>
                                </div>
                            )}

                            {sessionResult?.nextSessionFocus && (
                                <div className="rounded-2xl p-5 mb-8 bg-purple-500/5 border border-purple-400/15">
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">
                                        Next Session Focus
                                    </p>
                                    <p className="text-sm text-stone-300">{sessionResult.nextSessionFocus}</p>
                                </div>
                            )}

                            {(sessionResult?.strengths?.length > 0 || sessionResult?.improvements?.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="soft-card rounded-2xl p-5">
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                                            ✅ Strengths
                                        </p>
                                        <ul className="flex flex-col gap-2">
                                            {(sessionResult.strengths || []).map((strength: string, sIdx: number) => (
                                                <li key={sIdx} className="flex items-start gap-2 text-sm text-stone-300">
                                                    <span className="text-emerald-400 mt-0.5">•</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="soft-card rounded-2xl p-5">
                                        <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                                            📈 Areas to Improve
                                        </p>
                                        <ul className="flex flex-col gap-2">
                                            {(sessionResult.improvements || []).map((imp: string, iIdx: number) => (
                                                <li key={iIdx} className="flex items-start gap-2 text-sm text-stone-300">
                                                    <span className="text-orange-400 mt-0.5">•</span>
                                                    {imp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <div className="soft-card rounded-2xl overflow-hidden">
                                <div className="p-5 border-b border-orange-400/10">
                                    <h3 className="text-lg font-headline-md text-white">
                                        Question-by-Question Breakdown
                                    </h3>
                                </div>
                                <div className="divide-y divide-orange-400/10">
                                    {answers.map((ans, aIdx) => (
                                        <div key={aIdx} className="p-5">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                                                        Q{aIdx + 1} · {questions[aIdx]?.category || sessionType}
                                                    </p>
                                                    <p className="font-headline-md text-body-md text-white">
                                                        "{questions[aIdx]?.question}"
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <span className="chip-orange text-[10px] px-2 py-1 rounded-full font-bold">
                                                        STAR: {ans.scores?.starScore || 0}
                                                    </span>
                                                    <span className="chip-green text-[10px] px-2 py-1 rounded-full font-bold">
                                                        Clarity: {ans.scores?.clarityScore || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {ans.answer ? (
                                                <p className="font-body-md text-body-md text-on-surface-variant italic bg-[#1d1b1a] p-3 rounded-xl mb-2">
                                                    "
                                                    {ans.answer.slice(0, 250)}
                                                    {ans.answer.length > 250 ? "..." : ""}
                                                    "
                                                </p>
                                            ) : (
                                                <p className="text-sm text-stone-500 italic mb-2">Skipped</p>
                                            )}

                                            {ans.scores?.aiSuggestion && (
                                                <p className="text-[11px] text-orange-300 flex items-start gap-1">
                                                    <span className="material-symbols-outlined text-[14px] mt-0.5">
                                                        tips_and_updates
                                                    </span>
                                                    {ans.scores.aiSuggestion}
                                                </p>
                                            )}

                                            <div className="flex flex-col gap-2 mt-3">
                                                {ans.scores?.strengthPoints?.length > 0 && (
                                                    <div>
                                                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                                                            Strengths
                                                        </p>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {ans.scores.strengthPoints.map((pt: string, c: number) => (
                                                                <span
                                                                    key={c}
                                                                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                >
                                                                    {pt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ans.scores?.improvementPoints?.length > 0 && (
                                                    <div className="mt-1">
                                                        <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-1">
                                                            Areas to Improve
                                                        </p>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {ans.scores.improvementPoints.map((pt: string, c: number) => (
                                                                <span
                                                                    key={c}
                                                                    className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20"
                                                                >
                                                                    {pt}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {ans.scores?.sampleCorrectAnswer && (
                                                <div className="mt-3 p-3 rounded-xl bg-orange-500/5 border border-orange-400/10">
                                                    <p className="text-xs text-stone-300 leading-relaxed">
                                                        <span className="font-bold text-orange-300">
                                                            💡 Exemplar / Suggested Answer:
                                                        </span>{" "}
                                                        {ans.scores.sampleCorrectAnswer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
