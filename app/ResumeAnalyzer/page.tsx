"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import Loader from "@/components/Loader";
import { CanvasText } from "@/components/CanvasText";
import { AnimatedResumeAnalyzerLogo } from "@/components/AnimatedResumeAnalyzerLogo";
import { ResumeScannerIcon, AtsScoreGaugeIcon, HistoryGraphIcon, SettingsTuneIcon, DocumentFileIcon, CardIconShell } from "@/components/AnimatedCardIcons";
import { GlareCard } from "@/components/GlareCard";


const DEFAULT_SUGGESTIONS = [
    {
        original: "Worked on backend APIs",
        improved: "Engineered 12 RESTful APIs in Node.js, reducing latency by 34% and supporting 50K+ daily requests",
        reason: "Added quantified impact and specific technology"
    },
    {
        original: "Helped with database migrations",
        improved: "Led zero-downtime PostgreSQL migration for 2TB dataset across 3 production environments, saving $8K/month",
        reason: "Shows ownership, scale, and business impact"
    },
    {
        original: "Worked in an agile team",
        improved: "Collaborated in 2-week sprints using Jira and GitHub, consistently delivering features on time across a 6-person cross-functional team",
        reason: "Specific methodology and team context added"
    }
];

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#221d1a" strokeWidth="8" />
                    <circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={`${(score / 100) * 201} 201`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg text-white">
                    {score}
                </span>
            </div>
            <span className="text-xs text-stone-400 text-center font-medium">{label}</span>
        </div>
    );
}

function renderSkills(skillsStr: string, templateStyle: string) {
    if (!skillsStr) return null;
    const skills = skillsStr
        .split(/,|\n|[-*•]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 40 && !s.startsWith("#"));

    const styleClasses: Record<string, string> = {
        Modern: "bg-orange-500/10 border border-orange-500/30 text-orange-300",
        Minimalist: "bg-stone-800/40 border border-stone-700 text-stone-300",
        Creative: "bg-violet-500/10 border border-violet-500/30 text-violet-300",
        Executive: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
    };

    const cls = styleClasses[templateStyle] || "bg-orange-500/10 border border-orange-500/30 text-orange-300";

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${cls}`}>
                    {skill}
                </span>
            ))}
        </div>
    );
}

function renderText(text: string, templateStyle: string) {
    if (!text) return "";
    const boldParts = text.split("**");
    const boldClasses: Record<string, string> = {
        Modern: "text-orange-300 font-semibold",
        Minimalist: "text-white font-semibold",
        Creative: "text-violet-300 font-semibold",
        Executive: "text-emerald-300 font-semibold"
    };
    const boldCls = boldClasses[templateStyle || "Modern"] || "text-orange-300 font-semibold";

    return boldParts.map((part, bIdx) => {
        const isBold = bIdx % 2 === 1;
        const italicParts = part.split("*").map((subPart, iIdx) => {
            const isItalic = iIdx % 2 === 1;
            return isItalic ? (
                <em key={iIdx} className="italic text-stone-300 font-medium">{subPart}</em>
            ) : (
                subPart
            );
        });

        return isBold ? (
            <strong key={bIdx} className={boldCls}>{italicParts}</strong>
        ) : (
            <span key={bIdx}>{italicParts}</span>
        );
    });
}

function renderSectionContent(content: string, templateStyle: string) {
    if (!content) return null;
    const lines = content.split("\n");
    const bullets: Record<string, React.ReactNode> = {
        Modern: <span className="text-orange-400 mt-1.5 text-[6px]">●</span>,
        Minimalist: <span className="text-stone-400 mt-1 text-[8px] font-bold">-</span>,
        Creative: <span className="text-violet-400 mt-1.5 text-[6px]">◆</span>,
        Executive: <span className="text-emerald-400 mt-1.5 text-[6px]">✦</span>
    };
    const bulletIcon = bullets[templateStyle || "Modern"] || <span className="text-orange-400 mt-1.5 text-[6px]">●</span>;

    const orgClasses: Record<string, string> = {
        Modern: "text-orange-400 font-bold",
        Minimalist: "text-stone-300 font-semibold",
        Creative: "text-violet-400 font-bold",
        Executive: "text-emerald-400 font-bold"
    };
    const orgClass = orgClasses[templateStyle || "Modern"] || "text-orange-400 font-bold";

    return (
        <div className="space-y-2">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-2" />;

                if (trimmed.startsWith("#")) {
                    const headingLevel = (trimmed.match(/^#+/) || ["#"])[0].length;
                    const text = renderText(trimmed.replace(/^#+\s*/, ""), templateStyle);
                    if (headingLevel === 1) {
                        return <h1 key={idx} className="text-base font-extrabold text-white mb-2 tracking-tight mt-3">{text}</h1>;
                    } else if (headingLevel === 2) {
                        return <h2 key={idx} className="text-sm font-bold text-white mb-1.5 mt-2">{text}</h2>;
                    } else {
                        return <h3 key={idx} className="text-xs font-semibold text-white mb-1 mt-1">{text}</h3>;
                    }
                }

                if (trimmed.includes("|")) {
                    const parts = trimmed.split("|").map(p => p.trim()).filter(Boolean);
                    if (parts.length >= 2) {
                        const role = parts[0];
                        const org = parts[1];
                        const date = parts[2] || "";
                        const loc = parts[3] || "";
                        return (
                            <div key={idx} className="my-4 space-y-1">
                                <div className="flex justify-between items-baseline gap-4">
                                    <span className="text-sm font-bold text-white tracking-tight leading-snug">
                                        {renderText(role, templateStyle)}
                                    </span>
                                    {date && (
                                        <span className="text-[11px] font-semibold text-stone-400 tracking-wider whitespace-nowrap bg-stone-900/60 px-2 py-0.5 rounded border border-stone-800/40">
                                            {renderText(date, templateStyle)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-baseline gap-4">
                                    <span className={`text-[12px] font-semibold ${orgClass}`}>
                                        {renderText(org, templateStyle)}
                                    </span>
                                    {loc && (
                                        <span className="text-[11px] text-stone-500 italic tracking-wide font-medium">
                                            {renderText(loc, templateStyle)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    }
                }

                if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
                    const cleanText = trimmed.replace(/^[-*•]\s*/, "");
                    return (
                        <div key={idx} className="flex items-start gap-2 pl-4 py-0.5">
                            {bulletIcon}
                            <p className="text-sm text-stone-300 leading-relaxed flex-1 font-medium font-sans">
                                {renderText(cleanText, templateStyle)}
                            </p>
                        </div>
                    );
                }

                return (
                    <p key={idx} className="text-sm text-stone-300 leading-relaxed font-medium font-sans">
                        {renderText(trimmed, templateStyle)}
                    </p>
                );
            })}
        </div>
    );
}

export default function ResumeAnalyzerPage() {
    const { token } = useAuth();
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [jd, setJd] = useState("");
    const [templateStyle, setTemplateStyle] = useState("Modern");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("bullets");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

    const bulletsTabRef = useRef<HTMLDivElement>(null);
    const rebuiltTabRef = useRef<HTMLDivElement>(null);
    const changesTabRef = useRef<HTMLDivElement>(null);
    const learnTabRef = useRef<HTMLDivElement>(null);
    const skillsTabRef = useRef<HTMLDivElement>(null);
    const keywordsTabRef = useRef<HTMLDivElement>(null);

    const [tabHeight, setTabHeight] = useState<number | string>("auto");

    useEffect(() => {
        const tabRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
            bullets: bulletsTabRef,
            rebuilt: rebuiltTabRef,
            changes: changesTabRef,
            learn: learnTabRef,
            skills: skillsTabRef,
            keywords: keywordsTabRef
        };
        const activeRef = tabRefs[activeTab]?.current;
        if (activeRef) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setTabHeight(entry.target.getBoundingClientRect().height + 8);
                }
            });
            resizeObserver.observe(activeRef);
            return () => resizeObserver.disconnect();
        }
    }, [activeTab, analysisResult]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (token) {
            fetch("/api/resume", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.resume) {
                        setAnalysisResult(data.resume);
                        if (data.resume.fileName) {
                            setFile(new File([], data.resume.fileName));
                        }
                    }
                })
                .catch(err => console.error("Failed to load active resume", err));
        }
    }, [token]);

    const handleAnalyze = async () => {
        if (file) {
            setAnalyzing(true);
            try {
                if (analysisResult && file.size === 0 && jd) {
                    const res = await fetch("/api/resume/analyze-jd", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ jd, templateStyle })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setAnalysisResult(data.resume);
                    }
                    setAnalyzing(false);
                    return;
                }

                const formData = new FormData();
                formData.append("resume", file);
                formData.append("jd", jd);
                formData.append("templateStyle", templateStyle);

                const res = await fetch("/api/resume/upload", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    setAnalysisResult(data.resume);
                }
            } catch (err) {
                console.error("Failed to analyze resume", err);
            } finally {
                setAnalyzing(false);
            }
        }
    };

    const handlePrint = () => {
        if (!analysisResult || !analysisResult.newResume) return;
        const { templateName, header, summary, sections } = analysisResult.newResume;
        const color = ({
            Modern: "#f97316",
            Minimalist: "#475569",
            Creative: "#8b5cf6",
            Executive: "#10b981"
        } as any)[templateName || "Modern"] || "#f97316";

        const headerLines = header ? header.split("\n") : [];
        const candidateName = headerLines[0] ? headerLines[0].replace(/#/g, "").trim() : "Candidate Name";
        const contactInfo = headerLines
            .slice(1)
            .map((line: string) => line.replace(/[-\*\#]/g, "").trim())
            .filter(Boolean)
            .join("  ·  ")
            .split("  ·  ")
            .map((info: string) => (info.toLowerCase().includes("@") ? info.toLowerCase() : info))
            .join("  ·  ");

        let styles = "";
        let htmlContent = "";

        const renderSkillsHtml = (skillsStr: string, template: string) => {
            const skills = skillsStr
                .split(/,|\n|[-*•]/)
                .map(s => s.trim())
                .filter(s => s.length > 0 && s.length < 40 && !s.startsWith("#"));
            const bg = ({
                Modern: "rgba(249, 115, 22, 0.06)",
                Minimalist: "#f8fafc",
                Creative: "rgba(139, 92, 246, 0.06)",
                Executive: "rgba(16, 185, 129, 0.06)"
            } as any)[template] || "rgba(249, 115, 22, 0.06)";
            const border = ({
                Modern: "1px solid rgba(249, 115, 22, 0.2)",
                Minimalist: "1px solid #e2e8f0",
                Creative: "1px solid rgba(139, 92, 246, 0.2)",
                Executive: "1px solid rgba(16, 185, 129, 0.2)"
            } as any)[template] || "1px solid rgba(249, 115, 22, 0.2)";
            const textColor = ({
                Modern: "#c2410c",
                Minimalist: "#475569",
                Creative: "#6d28d9",
                Executive: "#047857"
            } as any)[template] || "#c2410c";

            return `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; margin-bottom: 12px;">
          ${skills
                    .map(
                        s => `
            <span style="background-color: ${bg}; border: ${border}; color: ${textColor}; padding: 4px 10px; border-radius: 5px; font-size: 11px; font-weight: 600; display: inline-block;">
              ${s}
            </span>
          `
                    )
                    .join("")}
        </div>
      `;
        };

        const renderContentHtml = (content: string, template: string, accentColor: string) => {
            if (!content) return "";
            const bullet = ({
                Modern: `<span style="color: ${accentColor}; margin-right: 8px; font-size: 8px; margin-top: 4px;">●</span>`,
                Minimalist: '<span style="color: #64748b; margin-right: 8px; font-size: 11px; margin-top: 2px; font-weight: bold;">-</span>',
                Creative: `<span style="color: ${accentColor}; margin-right: 8px; font-size: 8px; margin-top: 4px;">◆</span>`,
                Executive: `<span style="color: ${accentColor}; margin-right: 8px; font-size: 8px; margin-top: 4px;">✦</span>`
            } as any)[template || "Modern"] || `<span style="color: ${accentColor}; margin-right: 8px; font-size: 8px; margin-top: 4px;">●</span>`;

            return content
                .split("\n")
                .map(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return "<div style='height: 6px;'></div>";
                    if (trimmed.startsWith("#")) {
                        const headingLevel = (trimmed.match(/^#+/) || ["#"])[0].length;
                        const text = renderTextHtml(trimmed.replace(/^#+\s*/, ""), template, accentColor);
                        return headingLevel === 1
                            ? `<h1 style="font-size: 14px; font-weight: 800; margin: 12px 0 6px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">${text}</h1>`
                            : headingLevel === 2
                                ? `<h2 style="font-size: 12px; font-weight: 700; margin: 10px 0 4px 0; color: #1e293b;">${text}</h2>`
                                : `<h3 style="font-size: 11px; font-weight: 600; margin: 6px 0 2px 0; color: #334155;">${text}</h3>`;
                    }
                    if (trimmed.includes("|")) {
                        const parts = trimmed.split("|").map(p => p.trim()).filter(Boolean);
                        if (parts.length >= 2) {
                            const role = parts[0];
                            const org = parts[1];
                            const date = parts[2] || "";
                            const loc = parts[3] || "";
                            return `
              <div style="margin: 8px 0; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; gap: 2px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <span style="font-size: 12px; font-weight: 700; color: #0f172a;">${renderTextHtml(role, template, accentColor)}</span>
                  ${date
                                    ? `<span style="font-size: 10.5px; font-weight: 600; color: #475569; font-family: monospace; white-space: nowrap;">${renderTextHtml(
                                        date,
                                        template,
                                        accentColor
                                    )}</span>`
                                    : ""
                                }
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <span style="font-size: 11.5px; font-weight: 600; color: ${accentColor};">${renderTextHtml(
                                    org,
                                    template,
                                    accentColor
                                )}</span>
                  ${loc ? `<span style="font-size: 10.5px; font-style: italic; color: #64748b;">${renderTextHtml(loc, template, accentColor)}</span>` : ""}
                </div>
              </div>
            `;
                        }
                    }
                    if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
                        const cleanText = renderTextHtml(trimmed.replace(/^[-*•]\s*/, ""), template, accentColor);
                        return `
            <div style="display: flex; align-items: flex-start; margin-bottom: 4px; padding-left: 8px;">
              ${bullet}
              <span style="font-size: 12px; color: #334155; line-height: 1.5; flex: 1; font-weight: 500;">${cleanText}</span>
            </div>
          `;
                    }
                    return `<p style="font-size: 12px; color: #334155; line-height: 1.5; margin: 4px 0; font-weight: 500;">${renderTextHtml(
                        trimmed,
                        template,
                        accentColor
                    )}</p>`;
                })
                .join("");
        };

        const renderTextHtml = (text: string, template: string, accentColor: string) => {
            const boldStyle = {
                Modern: `font-weight: 600; color: ${accentColor};`,
                Minimalist: "font-weight: 600; color: #0f172a;",
                Creative: `font-weight: 600; color: ${accentColor};`,
                Executive: `font-weight: 600; color: ${accentColor};`
            }[template || "Modern"] || `font-weight: 600; color: ${accentColor};`;

            const parts = text.replace(/\*\*(.*?)\*\*/g, `<strong style="${boldStyle}">$1</strong>`);
            return parts.replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #64748b;">$1</em>');
        };

        if (templateName === "Minimalist") {
            styles = `
        body { font-family: 'Garamond', 'Georgia', serif; padding: 40px; color: #1e293b; background-color: #fff; line-height: 1.6; font-size: 13px; }
        .header { text-align: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 14px; margin-bottom: 22px; }
        .name { font-size: 28px; font-weight: 300; letter-spacing: 0.1em; color: #0f172a; text-transform: uppercase; margin: 0; }
        .contact { font-size: 11px; color: #64748b; margin-top: 6px; font-family: sans-serif; letter-spacing: 0.5px; }
        .summary { font-style: italic; margin-bottom: 22px; color: #334155; font-size: 12.5px; padding: 0 15px; text-align: center; line-height: 1.6; }
        .section { page-break-inside: avoid; margin-bottom: 22px; }
        .section-title { font-size: 12px; font-weight: bold; color: ${color}; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
        .section-content { font-size: 12px; color: #334155; }
      `;
            htmlContent = `
        <div class="header">
          <h1 class="name">${candidateName}</h1>
          <div class="contact">${contactInfo}</div>
        </div>
        ${summary ? `<div class="summary">"${summary}"</div>` : ""}
        <div class="sections">
          ${sections
                    .map((sec: any) => {
                        const isSkills = /skills|technologies|tools/i.test(sec.title);
                        return `
              <div class="section">
                <h4 class="section-title">${sec.title}</h4>
                <div class="section-content">
                  ${isSkills ? renderSkillsHtml(sec.content, templateName) : renderContentHtml(sec.content, templateName, color)}
                </div>
              </div>
            `;
                    })
                    .join("")}
        </div>
      `;
        } else if (templateName === "Creative") {
            styles = `
        body { font-family: 'Montserrat', 'Inter', sans-serif; padding: 40px; color: #2d3748; background-color: #fff; line-height: 1.6; font-size: 12.5px; }
        .header { text-align: left; border-left: 5px solid ${color}; padding-left: 18px; margin-bottom: 24px; }
        .name { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: #1a202c; text-transform: uppercase; margin: 0; }
        .contact-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .contact-chip { background-color: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.15); padding: 3px 10px; border-radius: 20px; font-size: 10.5px; font-weight: bold; color: #6d28d9; }
        .summary { margin-bottom: 24px; color: #4a5568; background-color: #f8fafc; padding: 12px 16px; border-radius: 6px; font-size: 12px; border-left: 3px solid ${color}; font-style: italic; line-height: 1.6; }
        .section { page-break-inside: avoid; margin-bottom: 22px; }
        .section-title { font-size: 13px; font-weight: 800; color: ${color}; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #edf2f7; padding-bottom: 4px; }
        .section-content { font-size: 12px; color: #4a5568; }
      `;
            const sideSections = sections.filter((sec: any) =>
                /skills|education|certifications|contact|languages|technologies|tools/i.test(sec.title)
            );
            const mainSections = sections.filter(
                (sec: any) => !/skills|education|certifications|contact|languages|technologies|tools/i.test(sec.title)
            );

            htmlContent = `
        <div class="header">
          <h1 class="name">${candidateName}</h1>
          <div class="contact-container">
            ${contactInfo
                    .split("  ·  ")
                    .map((info: string) => `<span class="contact-chip">${info}</span>`)
                    .join("")}
          </div>
        </div>
        ${summary ? `<div class="summary">"${summary}"</div>` : ""}
        <div style="display: flex; flex-direction: row; gap: 30px; margin-top: 20px;">
          <div style="width: 32%; border-right: 1px solid #edf2f7; padding-right: 20px;">
            ${sideSections
                    .map((sec: any) => {
                        const isSkills = /skills|technologies|tools/i.test(sec.title);
                        return `
                <div class="section">
                  <h4 class="section-title">${sec.title}</h4>
                  <div class="section-content">
                    ${isSkills ? renderSkillsHtml(sec.content, templateName) : renderContentHtml(sec.content, templateName, color)}
                  </div>
                </div>
              `;
                    })
                    .join("")}
          </div>
          <div style="width: 68%;">
            ${mainSections
                    .map(
                        (sec: any) => `
              <div class="section">
                <h4 class="section-title">${sec.title}</h4>
                <div class="section-content">
                  ${renderContentHtml(sec.content, templateName, color)}
                </div>
              </div>
            `
                    )
                    .join("")}
          </div>
        </div>
      `;
        } else if (templateName === "Executive") {
            styles = `
        body { font-family: 'Georgia', Times, serif; padding: 40px; color: #111; background-color: #fff; line-height: 1.6; font-size: 13px; }
        .header { text-align: center; border-bottom: 2px double #888; padding-bottom: 14px; margin-bottom: 22px; }
        .name { font-size: 28px; font-weight: 700; color: #111; text-transform: uppercase; margin: 0; letter-spacing: 0.05em; }
        .contact { font-size: 11px; color: #333; margin-top: 6px; font-family: 'Georgia', Times, serif; letter-spacing: 0.5px; }
        .summary { text-align: justify; margin-bottom: 22px; color: #222; font-size: 12.5px; line-height: 1.6; font-style: italic; }
        .section { page-break-inside: avoid; margin-bottom: 22px; }
        .section-title { font-size: 13px; font-weight: bold; color: ${color}; border-bottom: 1px solid #111; padding-bottom: 3px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
        .section-content { font-size: 12px; color: #222; }
      `;
            htmlContent = `
        <div class="header">
          <h1 class="name">${candidateName}</h1>
          <div class="contact">
            ${contactInfo
                    .split("  ·  ")
                    .map((info: string, idx: number) => `${idx > 0 ? ' <span style="color:#10b981; margin:0 6px;">◆</span> ' : ""}${info}`)
                    .join("")}
          </div>
        </div>
        ${summary ? `<div class="summary">"${summary}"</div>` : ""}
        <div class="sections">
          ${sections
                    .map((sec: any) => {
                        const isSkills = /skills|technologies|tools/i.test(sec.title);
                        return `
              <div class="section">
                <h4 class="section-title">${sec.title}</h4>
                <div class="section-content">
                  ${isSkills ? renderSkillsHtml(sec.content, templateName) : renderContentHtml(sec.content, templateName, color)}
                </div>
              </div>
            `;
                    })
                    .join("")}
        </div>
      `;
        } else {
            styles = `
        body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1f2937; background-color: #fff; line-height: 1.6; font-size: 13px; }
        .header { text-align: left; border-bottom: 3px solid ${color}; padding-bottom: 14px; margin-bottom: 22px; }
        .name { font-size: 30px; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.02em; }
        .contact { font-size: 12px; color: #4b5563; margin-top: 6px; }
        .summary { font-size: 12.5px; color: #374151; margin-bottom: 22px; line-height: 1.6; }
        .section { page-break-inside: avoid; margin-bottom: 22px; }
        .section-title { font-size: 13.5px; font-weight: 700; color: ${color}; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; }
        .section-title-bar { width: 4px; height: 14px; background-color: ${color}; border-radius: 2px; margin-right: 8px; display: inline-block; }
        .section-content { font-size: 12px; color: #374151; }
      `;
            htmlContent = `
        <div class="header">
          <h1 class="name">${candidateName}</h1>
          <div class="contact">${contactInfo}</div>
        </div>
        ${summary ? `<div class="summary">${summary}</div>` : ""}
        <div class="sections">
          ${sections
                    .map((sec: any) => {
                        const isSkills = /skills|technologies|tools/i.test(sec.title);
                        return `
              <div class="section">
                <h4 class="section-title"><span class="section-title-bar"></span>${sec.title}</h4>
                <div class="section-content">
                  ${isSkills ? renderSkillsHtml(sec.content, templateName) : renderContentHtml(sec.content, templateName, color)}
                </div>
              </div>
            `;
                    })
                    .join("")}
        </div>
      `;
        }

        const printWindow = window.open("", "_blank", "width=850,height=950");
        printWindow?.document.write(`
      <html>
        <head>
          <title>${candidateName} - Rebuilt Resume (${templateName})</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 12mm 15mm; }
            * { box-sizing: border-box; }
            ${styles}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
        printWindow?.document.close();
        setTimeout(() => {
            printWindow?.print();
        }, 450);
    };

    return (
        <div className="relative min-h-screen orange-page-tint overflow-x-hidden">
            {analyzing && <Loader overlay={true} title="Resume Analyzer" text="Analyzing..." />}
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .tab-slider-container {
          transition: height 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-title {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUpTitle 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-subtitle {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUpSubtitle 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        .animate-tab-slide {
          opacity: 0;
          transform: translateX(16px);
          animation: tabSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeUpTitle {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpSubtitle {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tabSlideIn {
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 639px) {
          .resume-header {
            border-bottom: none !important;
            box-shadow: none !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-bottom: 0 !important;
          }
          .resume-upload-card {
            border-top: none !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
            margin-top: 0 !important;
          }
        }
      `}</style>

            <GridBackgroundDemo />

            <div
                className="cursor-glow"
                style={{
                    transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`
                }}
            />

            <TopBar title="Resume Analyzer" ctaLabel="Download Report" />

            <main className="relative z-20 sidebar-aware pt-24 pb-8 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <section className="relative overflow-hidden select-none hero-shell p-6 sm:p-8 md:p-10 resume-header rounded-t-[32px] rounded-b-none border-b-0 mb-0 sm:rounded-[32px] sm:border-b sm:mb-10">
                        <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="hidden sm:block absolute bottom-0 right-0 w-72 h-72 bg-orange-400/5 rounded-full blur-[120px] pointer-events-none" />

                        {/* Clipped background decoration container to match the hero-shell shape */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-t-[32px] rounded-b-none sm:rounded-[32px]">
                            {/* Absolutely positioned giant static background decoration */}
                            <div className="absolute top-0 right-0 w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] md:w-[1350px] md:h-[1350px] lg:w-[1600px] lg:h-[1600px] translate-x-[30%] sm:translate-x-[32%] md:translate-x-[35%] lg:translate-x-[35%] -translate-y-[20%] sm:-translate-y-[22%] md:-translate-y-[25%] lg:-translate-y-[25%] -rotate-[12deg] opacity-65">
                                <AnimatedResumeAnalyzerLogo />
                            </div>
                        </div>


                        {/* Laptop / Desktop Version (widths >= 640px) */}
                        <div className="hidden sm:flex relative z-10 max-w-4xl flex-col items-start text-left">
                            {/* Clean Status Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full eyebrow text-[11px] font-semibold tracking-wider mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                <span className="font-mono text-orange-300">Neural Engine V4.2.0 • Status: Synced</span>
                            </div>

                            {/* Bold outlines / solid combination title */}
                            <h1 className="font-headline-lg sm:text-5xl md:text-[64px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent] text-left select-none">
                                ATS Resume
                                <br />
                                <span className="text-orange-300 [-webkit-text-stroke:0px] [-webkit-text-fill-color:#fdba74] whitespace-nowrap bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                                    <CanvasText
                                        text="Analyzer & Optimiser"
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

                            {/* Description Subtitle */}
                            <p className="text-sm md:text-lg text-stone-400 max-w-2xl mt-5 leading-relaxed text-left">
                                Get real-time ATS scoring, keyword optimization, and custom templates to pass top-tier recruitment screeners.
                            </p>
                        </div>

                        {/* Mobile Version (widths < 640px) */}
                        <div className="flex sm:hidden relative z-10 max-w-4xl flex-col items-center text-center mx-auto">
                            {/* Active Analyzer status pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-[10px] font-bold tracking-[0.15em] font-mono mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
                                <span>ANALYZER ENGINE ACTIVE</span>
                            </div>

                            {/* Spaced out category indicator */}
                            <div
                                className="text-stone-400 font-bold uppercase tracking-[0.6em] text-[11px] sm:text-xs mb-3 font-mono"
                                style={{ letterSpacing: '0.65em' }}
                            >
                                RESUME ANALYZER
                            </div>

                            {/* Large solid glowing heading */}
                            <h1 className="text-4xl xs:text-5xl font-black text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] tracking-tight leading-none text-center select-none font-mono">
                                <CanvasText
                                    text="Resume Analyzer"
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

                            {/* Description Subtitle */}
                            <p className="text-xs sm:text-sm text-stone-400 max-w-md mt-4 leading-relaxed text-center">
                                Get real-time ATS scoring, keyword optimization, and custom templates to pass top-tier recruitment screeners.
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 2xl:grid-cols-5 gap-8">
                        <div className="2xl:col-span-2 flex flex-col gap-6">
                            {/* Unified form card — mirrors MockInterview "COACH PREFERENCES" template */}
                            <div className="soft-card p-5 sm:p-8 rounded-b-2xl sm:rounded-2xl resume-upload-card rounded-t-none border-t-0 sm:rounded-t-2xl sm:border-t flex flex-col gap-6 font-mono">

                                {/* Card header bar */}
                                <div className="flex items-center justify-between mb-2 border-b border-orange-500/10 pb-3">
                                    <h3 className="font-headline-md text-xs sm:text-sm text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                                        <SettingsTuneIcon />
                                        ANALYZER SETTINGS
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Engine Ready</span>
                                    </div>
                                </div>

                                {/* ── Resume Upload ────────────────────── */}
                                <div className="relative flex flex-col gap-1.5 group">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                                        Resume File <span className="normal-case text-stone-600">(PDF / DOC / DOCX)</span>
                                    </label>
                                    <div
                                        className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 ${
                                            dragging ? "border-orange-500 bg-orange-500/10 scale-[1.02]"
                                                : file ? "border-orange-500/60 bg-orange-500/5"
                                                : "border-orange-400/20 hover:border-orange-500/50 hover:bg-[#1a1716]"
                                        }`}
                                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={e => {
                                            e.preventDefault();
                                            setDragging(false);
                                            const droppedFile = e.dataTransfer.files[0];
                                            if (droppedFile) setFile(droppedFile);
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
                                        />
                                        {file ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <CardIconShell className="w-12 h-12 flex items-center justify-center">
                                                    <DocumentFileIcon />
                                                </CardIconShell>
                                                <div>
                                                    <p className="text-sm font-bold text-white font-mono">{file.name}</p>
                                                    <p className="text-[10px] text-stone-500 mt-0.5">
                                                        {file.size > 0 ? `${(file.size / 1024).toFixed(0)} KB` : "Loaded"} · Ready to analyze
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                        setAnalysisResult(null);
                                                    }}
                                                    className="text-[10px] text-stone-500 hover:text-red-400 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-400/20">
                                                    <ResumeScannerIcon />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Drop your resume here</p>
                                                    <p className="text-[10px] text-stone-500 mt-0.5">PDF, DOC, DOCX up to 5 MB</p>
                                                </div>
                                                <span className="chip-orange text-[10px] px-3 py-1 rounded-full">Browse Files</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Job Description ──────────────────── */}
                                <div className="relative flex flex-col gap-1.5 group">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block transition-colors group-focus-within:text-orange-400">
                                        Job Description <span className="normal-case text-stone-600">(optional — boosts ATS match score)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined text-[16px] text-stone-500 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-orange-400">
                                            work
                                        </span>
                                        <textarea
                                            value={jd}
                                            onChange={e => setJd(e.target.value)}
                                            placeholder="Paste the job description here to get a tailored ATS match score and missing keywords..."
                                            className="w-full bg-[#1d1b1a] hover:bg-[#252221] text-[#e8e1df] text-sm rounded-xl pl-10 pr-4 py-3 border border-orange-400/15 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-stone-500 font-mono resize-none"
                                            rows={5}
                                        />
                                    </div>
                                </div>

                                {/* ── Design Template ──────────────────── */}
                                <div className="relative flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                                        Rebuilt Resume Template
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["Modern", "Minimalist", "Creative", "Executive"] as const).map(style => {
                                            const active = templateStyle === style;
                                            const styleConfigs: Record<string, { color: string; bg: string }> = {
                                                Modern:     { color: "#fb923c", bg: "#3d2315" },
                                                Minimalist: { color: "#94a3b8", bg: "#252932" },
                                                Creative:   { color: "#a78bfa", bg: "#2c1b4d" },
                                                Executive:  { color: "#34d399", bg: "#14422b" },
                                            };
                                            const cfg = styleConfigs[style];
                                            return (
                                                <button
                                                    key={style}
                                                    onClick={() => setTemplateStyle(style)}
                                                    className="px-3 py-2.5 text-xs font-semibold cut-choice-btn"
                                                    style={active
                                                        ? { "--btn-bg": cfg.bg, "--btn-border": "rgba(255,255,255,1)", "--btn-border-hover": "rgba(255,255,255,1)", "--btn-filter": "drop-shadow(0 0 8px rgba(255,255,255,0.3))", color: cfg.color } as React.CSSProperties
                                                        : { "--btn-bg": "#1a1716", "--btn-border": "rgba(251,146,60,0.15)", color: "#78716c" } as React.CSSProperties
                                                    }
                                                >
                                                    {style}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Submit Button ────────────────────── */}
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file || analyzing}
                                    className="interactive wavy-blue-btn w-full py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-sans font-medium text-white text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-40 mt-2"
                                >
                                    {analyzing ? (
                                        <svg className="w-[28px] h-[28px] text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <style>{`
                                                @keyframes laser-scan-fast {
                                                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                                                    50% { transform: translateY(12px); opacity: 1; filter: drop-shadow(0 0 3px #fff); }
                                                }
                                                .anim-laser-line-fast {
                                                    animation: laser-scan-fast 0.8s ease-in-out infinite;
                                                }
                                            `}</style>
                                            <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeWidth="2" />
                                            <line x1="8" y1="7" x2="16" y2="7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="8" y1="11" x2="16" y2="11" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="8" y1="15" x2="13" y2="15" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" className="anim-laser-line-fast" />
                                        </svg>
                                    ) : (
                                        <svg className="w-[28px] h-[28px] text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <style>{`
                                                @keyframes laser-scan {
                                                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                                                    50% { transform: translateY(12px); opacity: 1; }
                                                }
                                                .anim-laser-line {
                                                    animation: laser-scan 2.4s ease-in-out infinite;
                                                }
                                            `}</style>
                                            <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeWidth="2" />
                                            <line x1="8" y1="7" x2="16" y2="7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="8" y1="11" x2="16" y2="11" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="8" y1="15" x2="13" y2="15" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" className="anim-laser-line" />
                                        </svg>
                                    )}
                                    <span className="hidden sm:inline">
                                        {analyzing ? "Analyzing with AI..." : `Analyze My Resume${file ? ` — ${file.name.replace(/\.[^.]+$/, "")}` : ""}`}
                                    </span>
                                    <span className="inline sm:hidden">
                                        {analyzing ? "Analyzing..." : "Analyze Resume"}
                                    </span>
                                </button>
                            </div>
                        </div>{/* end xl:col-span-2 */}

                        <div className="2xl:col-span-3 flex flex-col gap-6">
                            {analysisResult ? (
                                <>
                                    <div className="soft-card rounded-2xl p-4 sm:p-6">
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <h3 className="text-sm sm:text-lg font-headline-md text-white flex items-center gap-2">
                                                <AtsScoreGaugeIcon />
                                                Analysis Scores
                                            </h3>
                                            <span className="chip-orange text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">AI Scored</span>
                                        </div>
                                        {/* Score grid: 2 cols on mobile, wrap naturally on larger */}
                                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-around gap-4 sm:gap-6">
                                            <ScoreCircle score={analysisResult.atsScore} label="ATS Score" color="#f97316" />
                                            <ScoreCircle score={analysisResult.formattingScore} label="Formatting" color="#10b981" />
                                            <ScoreCircle score={analysisResult.keywordScore} label="Keywords" color="#f59e0b" />
                                            <ScoreCircle score={analysisResult.impactScore} label="Impact" color="#fb923c" />
                                            {jd && <ScoreCircle score={analysisResult.jdMatchScore} label="JD Match" color="#f43f5e" />}
                                        </div>
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-orange-500/5 border border-orange-400/15">
                                            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                                                <span className="font-bold text-orange-300">AI Summary: </span>
                                                Your resume scores <strong className="text-white">{analysisResult.atsScore}/100</strong> on ATS.{" "}
                                                {analysisResult.summaryFeedback ||
                                                    "Quantify achievements using STAR format — recruiters are 3x more likely to respond to metrics-driven bullets."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="soft-card rounded-2xl overflow-hidden">
                                        {/* Tab bar: 3×2 grid on mobile, single flex row on sm+ */}

                                        {/* ── Mobile tab grid (< sm) ── */}
                                        <div className="sm:hidden grid grid-cols-3 border-b border-orange-400/10 bg-[#120f0e]">
                                            {([
                                                { id: "bullets",  label: "✦ Bullets" },
                                                { id: "rebuilt",  label: "📄 Rebuilt" },
                                                { id: "changes",  label: "◐ Opts" },
                                                { id: "learn",    label: "⌘ Skills" },
                                                { id: "skills",   label: "⚡ Gaps" },
                                                { id: "keywords", label: "🗝 Keys" },
                                            ] as const).map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`py-2.5 text-[9px] font-bold text-center transition-all border-b-2 ${
                                                        activeTab === tab.id
                                                            ? "border-orange-500 text-orange-400 bg-orange-500/5"
                                                            : "border-transparent text-stone-500 hover:text-white"
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* ── Desktop tab bar (sm+) ── */}
                                        <div className="relative hidden sm:flex border-b border-orange-400/10 bg-[#120f0e]">
                                            {([
                                                { id: "bullets",  label: "✦ Bullet Rewrites" },
                                                { id: "rebuilt",  label: "📄 Rebuilt Resume" },
                                                { id: "changes",  label: "◐ Optimizations" },
                                                { id: "learn",    label: "⌘ Up-skilling" },
                                                { id: "skills",   label: "⚡︎ Skill Gaps" },
                                                { id: "keywords", label: "🗝︎ Keywords" },
                                            ] as const).map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex-1 py-3.5 px-2 text-xs font-bold transition-all whitespace-nowrap text-center relative z-10 ${activeTab === tab.id ? "wavy-tab-active" : "text-stone-400 hover:text-white"}`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                            <div
                                                className="absolute bottom-0 left-0 h-[2.5px] bg-orange-500 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20"
                                                style={{
                                                    width: "calc(100% / 6)",
                                                    transform: `translate3d(${100 * ["bullets", "rebuilt", "changes", "learn", "skills", "keywords"].indexOf(activeTab)}%, 0, 0)`
                                                }}
                                            />
                                        </div>

                                        <div className="tab-slider-container relative overflow-hidden" style={{ height: tabHeight }}>
                                            <div
                                                className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                                style={{
                                                    width: "100%",
                                                    transform: `translate3d(-${100 * ["bullets", "rebuilt", "changes", "learn", "skills", "keywords"].indexOf(activeTab)}%, 0, 0)`
                                                }}
                                            >
                                                {/* Tab 1: Bullet Points */}
                                                <div ref={bulletsTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    <div className="space-y-3 sm:space-y-4">
                                                        {(analysisResult.bulletSuggestions || DEFAULT_SUGGESTIONS).map((item: any, idx: number) => (
                                                            <div key={idx} className="rounded-xl overflow-hidden border border-orange-400/10">
                                                                <div className="p-3 sm:p-4 bg-[#1d1b1a]">
                                                                    <p className="text-[10px] text-stone-500 mb-1 font-bold uppercase tracking-widest">Before</p>
                                                                    <p className="text-xs sm:text-sm text-stone-400 italic leading-relaxed">{item.original}</p>
                                                                </div>
                                                                <div className="p-3 sm:p-4 bg-emerald-500/5 border-t border-emerald-500/15">
                                                                    <p className="text-[10px] text-emerald-400 mb-1 font-bold uppercase tracking-widest">After (AI Rewrite)</p>
                                                                    <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">{item.improved}</p>
                                                                    <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-[13px]">auto_awesome</span> {item.reason}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tab 2: Rebuilt Resume */}
                                                <div ref={rebuiltTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    {analysisResult.newResume && (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Live Interactive Preview</span>
                                                                <span className="text-xs px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold uppercase">
                                                                    {analysisResult.newResume.templateName} Template
                                                                </span>
                                                            </div>

                                                            {(() => {
                                                                const template = analysisResult.newResume.templateName || "Modern";
                                                                const accentColor = ({
                                                                    Modern: "#f97316",
                                                                    Minimalist: "#475569",
                                                                    Creative: "#8b5cf6",
                                                                    Executive: "#10b981"
                                                                } as any)[template] || "#f97316";

                                                                const borderCls = ({
                                                                    Modern: "border-orange-500/20",
                                                                    Minimalist: "border-stone-500/20",
                                                                    Creative: "border-violet-500/20",
                                                                    Executive: "border-emerald-500/20"
                                                                } as any)[template] || "border-orange-500/20";

                                                                const fontCls = ({
                                                                    Modern: "font-sans",
                                                                    Minimalist: "font-serif",
                                                                    Creative: "font-sans",
                                                                    Executive: "font-serif"
                                                                } as any)[template] || "font-sans";

                                                                const barBg = ({
                                                                    Modern: "bg-orange-500",
                                                                    Minimalist: "bg-stone-500",
                                                                    Creative: "bg-violet-500",
                                                                    Executive: "bg-emerald-500"
                                                                } as any)[template] || "bg-orange-500";

                                                                const rawHeader = analysisResult.newResume.header || "";
                                                                const headerLines = rawHeader.split("\n").map((s: string) => s.trim()).filter(Boolean);
                                                                const candidateName = headerLines[0] ? headerLines[0].replace(/#/g, "").trim() : "Candidate Name";
                                                                const contactParts = headerLines.slice(1)
                                                                    .join(" | ")
                                                                    .split(/[|·•]/)
                                                                    .map((s: string) => s.trim())
                                                                    .filter(Boolean);

                                                                return (
                                                                    <div
                                                                        id="resume-print-sheet"
                                                                        className={`p-8 bg-[#181615] rounded-xl border ${borderCls} shadow-2xl text-[#e8e1df] ${fontCls} selection:bg-orange-500/30`}
                                                                    >
                                                                        {template !== "Creative" && (
                                                                            <div className={`h-1.5 w-full rounded-t ${barBg} mb-6`} />
                                                                        )}

                                                                        {template === "Executive" ? (
                                                                            <div className="border-b-2 border-double border-emerald-500/30 pb-6 mb-6 text-center">
                                                                                <h1 className="text-4xl font-bold text-white tracking-tight uppercase font-serif mb-2">
                                                                                    {candidateName}
                                                                                </h1>
                                                                                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-stone-300 font-serif font-medium">
                                                                                    {contactParts.map((info: string, idx: number) => {
                                                                                        const clean = info.toLowerCase().includes("@") ? info.toLowerCase() : info;
                                                                                        return (
                                                                                            <span key={idx} className="flex items-center gap-1.5">
                                                                                                {idx > 0 && <span className="text-emerald-500 text-[10px]">◆</span>}
                                                                                                <span>{clean}</span>
                                                                                            </span>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : template === "Minimalist" ? (
                                                                            <div className="border-b border-stone-800 pb-5 mb-6 text-center">
                                                                                <h1 className="text-3xl font-light text-white tracking-widest uppercase font-serif mb-2">
                                                                                    {candidateName}
                                                                                </h1>
                                                                                <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400 text-[11px] font-sans tracking-wide">
                                                                                    {contactParts.map((info: string, idx: number) => {
                                                                                        const clean = info.toLowerCase().includes("@") ? info.toLowerCase() : info;
                                                                                        return (
                                                                                            <span key={idx} className="flex items-center gap-2">
                                                                                                {idx > 0 && <span className="text-stone-700 font-bold">·</span>}
                                                                                                <span>{clean}</span>
                                                                                            </span>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : template === "Creative" ? (
                                                                            <div className="border-l-4 border-violet-500 pl-6 pb-2 mb-6">
                                                                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-1">
                                                                                    {candidateName}
                                                                                </h1>
                                                                                <div className="flex flex-wrap gap-2 mt-3 justify-start">
                                                                                    {contactParts.map((info: string, idx: number) => {
                                                                                        let icon = "info";
                                                                                        const lower = info.toLowerCase();
                                                                                        if (lower.includes("@")) icon = "mail";
                                                                                        else if (lower.includes("github")) icon = "code";
                                                                                        else if (lower.includes("linkedin")) icon = "badge";
                                                                                        else if (lower.includes("phone") || /\+?\d{9,}/.test(lower)) icon = "phone_in_talk";
                                                                                        else if (lower.includes("location") || lower.includes("city")) icon = "location_on";

                                                                                        const clean = lower.includes("@") ? info.toLowerCase() : info;
                                                                                        const badgeBg = "bg-violet-500/10 border-violet-500/25";
                                                                                        return (
                                                                                            <span
                                                                                                key={idx}
                                                                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border ${badgeBg} text-violet-300`}
                                                                                            >
                                                                                                <span className="material-symbols-outlined text-[12px]">{icon}</span>
                                                                                                {clean}
                                                                                            </span>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            // Modern / Default
                                                                            <div className="border-b border-stone-800 pb-5 mb-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                                                                                <div>
                                                                                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none mb-2">
                                                                                        {candidateName}
                                                                                    </h1>
                                                                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-300 font-medium mt-3">
                                                                                        {contactParts.map((info: string, idx: number) => {
                                                                                            let icon = "info";
                                                                                            const lower = info.toLowerCase();
                                                                                            if (lower.includes("@")) icon = "mail";
                                                                                            else if (lower.includes("github")) icon = "code";
                                                                                            else if (lower.includes("linkedin")) icon = "badge";
                                                                                            else if (lower.includes("phone") || /\+?\d{9,}/.test(lower)) icon = "phone_in_talk";
                                                                                            else if (lower.includes("location") || lower.includes("city")) icon = "location_on";

                                                                                            const clean = lower.includes("@") ? info.toLowerCase() : info;
                                                                                            const iconColor = "text-orange-400";
                                                                                            return (
                                                                                                <span key={idx} className="flex items-center gap-1.5">
                                                                                                    <span className={`material-symbols-outlined text-[13px] ${iconColor}`}>
                                                                                                        {icon}
                                                                                                    </span>
                                                                                                    <span>{clean}</span>
                                                                                                </span>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {analysisResult.newResume.summary && (
                                                                            <div className="mb-6">
                                                                                <h4 className={`text-xs font-bold ${(() => {
                                                                                    if (template === "Modern") return "text-orange-400";
                                                                                    if (template === "Minimalist") return "text-stone-400";
                                                                                    if (template === "Creative") return "text-violet-400";
                                                                                    return "text-emerald-400";
                                                                                })()} uppercase tracking-widest mb-2`}>
                                                                                    {template === "Executive" ? "I. Executive Summary" : "Professional Summary"}
                                                                                </h4>
                                                                                <p className="text-xs text-stone-300 leading-relaxed font-medium bg-[#1d1b1a] p-4 rounded-xl border border-stone-800 italic">
                                                                                    "{analysisResult.newResume.summary}"
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {template === "Creative" ? (
                                                                            (() => {
                                                                                const sideSecs = analysisResult.newResume.sections.filter((s: any) =>
                                                                                    /skills|education|certifications|contact|languages|technologies|tools/i.test(s.title)
                                                                                );
                                                                                const mainSecs = analysisResult.newResume.sections.filter((s: any) =>
                                                                                    !/skills|education|certifications|contact|languages|technologies|tools/i.test(s.title)
                                                                                );
                                                                                return (
                                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                                                                                        <div className="md:col-span-1 border-r border-stone-800 pr-6 space-y-6">
                                                                                            {sideSecs.map((sec: any, idx: number) => (
                                                                                                <div key={idx}>
                                                                                                    <h4 className={`text-xs font-black ${template === "Creative" ? "text-violet-400" : "text-orange-400"
                                                                                                        } uppercase tracking-widest mb-3 border-b border-stone-800 pb-1.5 flex items-center gap-1.5`}>
                                                                                                        <span className="material-symbols-outlined text-[14px]">grid_view</span>
                                                                                                        {sec.title}
                                                                                                    </h4>
                                                                                                    <div className="text-xs text-stone-300 leading-relaxed">
                                                                                                        {/skills|technologies|tools/i.test(sec.title)
                                                                                                            ? renderSkills(sec.content, template)
                                                                                                            : renderSectionContent(sec.content, template)}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="md:col-span-2 space-y-6">
                                                                                            {mainSecs.map((sec: any, idx: number) => (
                                                                                                <div key={idx}>
                                                                                                    <h4 className={`text-xs font-black ${template === "Creative" ? "text-violet-400" : "text-orange-400"
                                                                                                        } uppercase tracking-widest mb-3 border-b border-stone-800 pb-1.5`}>
                                                                                                        {sec.title}
                                                                                                    </h4>
                                                                                                    <div className="text-xs text-stone-300 leading-relaxed">
                                                                                                        {renderSectionContent(sec.content, template)}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })()
                                                                        ) : (
                                                                            <div className="space-y-6">
                                                                                {analysisResult.newResume.sections.map((sec: any, idx: number) => (
                                                                                    <div key={idx}>
                                                                                        <h4 className={`text-xs font-black ${template === "Modern" ? "text-orange-400" : template === "Minimalist" ? "text-stone-400" : template === "Creative" ? "text-violet-400" : "text-emerald-400"
                                                                                            } uppercase tracking-widest mb-2.5 border-b border-stone-800 pb-1.5 flex items-center`}>
                                                                                            {template === "Modern" && (
                                                                                                <span className="w-1.5 h-3 bg-orange-500 rounded-sm mr-2 inline-block" />
                                                                                            )}
                                                                                            {sec.title}
                                                                                        </h4>
                                                                                        <div className="text-xs text-stone-300 leading-relaxed">
                                                                                            {/skills|technologies|tools/i.test(sec.title)
                                                                                                ? renderSkills(sec.content, template)
                                                                                                : renderSectionContent(sec.content, template)}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}

                                                            <div className="flex gap-2 mt-4">
                                                                <button
                                                                    onClick={handlePrint}
                                                                    className="interactive wavy-blue-btn w-full py-3 rounded-xl text-white flex items-center justify-center gap-2"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">print</span>
                                                                    Print / Save as PDF
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tab 3: Optimizations */}
                                                <div ref={changesTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    {analysisResult.changesMade && (
                                                        <div className="space-y-4">
                                                            <p className="font-body-md text-body-md text-on-surface-variant">
                                                                Here are the key optimizations the AI completed in each section of the resume:
                                                            </p>
                                                            <div className="space-y-3">
                                                                {analysisResult.changesMade.map((item: any, idx: number) => (
                                                                    <div key={idx} className="p-4 rounded-xl bg-orange-500/5 border border-orange-400/10">
                                                                        <h4 className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-1.5">
                                                                            {item.sectionName}
                                                                        </h4>
                                                                        <p className="text-xs text-stone-300 leading-relaxed font-medium">
                                                                            {item.changeExplanation}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tab 4: Up-skilling */}
                                                <div ref={learnTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    {analysisResult.thingsToLearn && (
                                                        <div className="space-y-4">
                                                            <p className="font-body-md text-body-md text-on-surface-variant">
                                                                To make yourself a 100% match for this target role, focus on acquiring these critical skills & tools:
                                                            </p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {analysisResult.thingsToLearn.map((item: any, idx: number) => (
                                                                    <div key={idx} className="soft-card rounded-xl p-4 flex flex-col justify-between border border-orange-400/10">
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                                                                <h4 className="text-sm font-bold text-white tracking-tight">{item.skill}</h4>
                                                                            </div>
                                                                            <p className="text-xs text-stone-400 leading-relaxed mb-4">{item.importance}</p>
                                                                        </div>
                                                                        {item.learningResource && (
                                                                            <div className="pt-3 border-t border-orange-400/5">
                                                                                <p className="text-[9px] font-bold text-orange-300 uppercase tracking-widest">Recommended Resource</p>
                                                                                <a
                                                                                    href={item.learningResource.includes("http") ? item.learningResource : "#"}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-1 block leading-tight"
                                                                                >
                                                                                    {item.learningResource}
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tab 5: Skill Gaps */}
                                                <div ref={skillsTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    <div className="space-y-4">
                                                        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                                                            Based on your target role, these skills are frequently required but absent from your resume:
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(analysisResult.skillGaps || []).map((skill: string) => (
                                                                <span key={skill} className="chip-rose text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-400/15">
                                                            <p className="text-sm text-orange-300 font-bold mb-1">💡 Action Plan</p>
                                                            <p className="font-body-md text-body-md text-on-surface-variant">
                                                                Add a Personal Projects section showcasing {analysisResult.skillGaps?.[0] || "missing skills"} and{" "}
                                                                {analysisResult.skillGaps?.[1] || "core tools"}. Link to GitHub repos with real implementations.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tab 6: Keywords */}
                                                <div ref={keywordsTabRef} className="w-full min-w-0 flex-shrink-0 p-3 sm:p-6">
                                                    <div className="space-y-5">
                                                        <div>
                                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">✓ Matched Keywords</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(analysisResult.matchedKeywords || []).map((kw: string) => (
                                                                    <span key={kw} className="chip-green text-xs px-3 py-1.5 rounded-full">
                                                                        {kw}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {jd && (
                                                            <div>
                                                                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">✗ Missing from JD</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(analysisResult.missingKeywords || ["Docker", "CI/CD", "AWS Lambda", "Terraform"]).map((kw: string) => (
                                                                        <span key={kw} className="chip-rose text-xs px-3 py-1.5 rounded-full">
                                                                            {kw}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePrint}
                                        className="interactive wavy-blue-btn w-full py-3.5 rounded-xl font-headline-md text-white flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            download
                                        </span>
                                        Download Optimized Resume (PDF)
                                    </button>
                                </>
                            ) : (
                                <div className="soft-card rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-orange-500/10 border border-orange-400/20">
                                        <HistoryGraphIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-headline-md text-white mb-2">Upload your resume to begin</h3>
                                        <p className="text-stone-400 max-w-sm">
                                            Our AI will score your ATS compatibility, rewrite weak bullet points, and reveal skill gaps — all in seconds.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-4">
                                        {[
                                            ["74%", "Avg ATS Score"],
                                            ["3x", "More Interviews"],
                                            ["2 min", "Analysis Time"]
                                        ].map(([val, desc]) => (
                                            <div key={desc} className="soft-card rounded-xl p-3 text-center">
                                                <p className="text-xl font-bold text-orange-300">{val}</p>
                                                <p className="text-[10px] text-stone-500 mt-0.5">{desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* How Resume Analysis Works — Glare Cards */}
                <div className="mt-14 flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5 border-b border-orange-500/10 pb-3">
                        <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 uppercase tracking-wider">
                            <CardIconShell className="w-8 h-8 flex items-center justify-center">
                                <ResumeScannerIcon />
                            </CardIconShell>
                            RESUME INTELLIGENCE GUIDE
                        </h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest">HOW THE RESUME SCANNER ENGINE WORKS</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                Icon: ResumeScannerIcon,
                                category: "Step 1 — Resume Parsing",
                                title: "Paste & Parse Your Content",
                                desc: "Paste your raw resume text into the scanner. The AI tokenizes your content section-by-section — work experience, skills, education — extracting every claim, metric, and keyword for deep structural analysis.",
                                pills: ["Text Parsing", "Section Detection", "Keyword Extraction", "Tokenization"]
                            },
                            {
                                Icon: AtsScoreGaugeIcon,
                                category: "Step 2 — ATS Compatibility Check",
                                title: "ATS Score & Gap Analysis",
                                desc: "The scanner simulates how an Applicant Tracking System reads your resume. It calculates an ATS compatibility score, flags missing action verbs, checks formatting robustness, and evaluates keyword density against real job descriptions.",
                                pills: ["ATS Score", "Action Verbs", "Keyword Density", "Formatting Check"]
                            },
                            {
                                Icon: HistoryGraphIcon,
                                category: "Step 3 — AI Improvement Engine",
                                title: "Bullet Rewrites & History",
                                desc: "Receive AI-powered rewrites for your weakest bullet points with specific quantification suggestions. Every analyzed resume is saved to your history with its score, allowing you to track improvements across resume versions over time.",
                                pills: ["Bullet Rewrites", "Quantification", "Score History", "Version Tracking"]
                            }
                        ].map((card, i) => (
                            <GlareCard key={i} containerClassName="aspect-auto" className="flex flex-col justify-start gap-3 p-5 bg-[#1d0f0a]/90 border border-orange-600/30 rounded-[24px] text-left font-sans transition-colors hover:bg-[#2c170f]/95 hover:border-orange-500/50 overflow-hidden">
                                <div className="flex items-center justify-between mb-0.5">
                                    <CardIconShell className="w-9 h-9 flex items-center justify-center">
                                        <card.Icon />
                                    </CardIconShell>
                                    <span className="text-[9px] uppercase tracking-widest text-orange-400/80 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10">
                                        Step {i + 1}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase tracking-wider text-orange-400/60 block leading-none">{card.category}</span>
                                    <h4 className="text-base font-semibold text-xl text-white mt-1 tracking-tight">{card.title}</h4>
                                </div>
                                <p className="text-xs text-stone-300 leading-relaxed font-sans">{card.desc}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {card.pills.map((pill) => (
                                        <span key={pill} className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] tracking-wider bg-orange-500/5 text-orange-300 border border-orange-500/10">
                                            {pill}
                                        </span>
                                    ))}
                                </div>
                            </GlareCard>
                        ))}
                    </div>
                </div>
            </main>


        </div>
    );
}
