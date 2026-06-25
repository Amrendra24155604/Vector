"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import Loader from "@/components/Loader";
import { CanvasText } from "@/components/CanvasText";
import { AnimatedMatchAgentLogo } from "@/components/AnimatedMatchAgentLogo";
import {
  CoachPreferencesIcon,
  SearchBrowseIcon,
  KanbanBoardIcon,
  OpportunityRadarIcon,
  MatchGearsIcon,
  CardIconShell,
} from "@/components/AnimatedCardIcons";
import { GlareCard } from "@/components/GlareCard";
import SleekDropdown from "@/components/SleekDropdown";


const KANBAN_COLS = ["Saved", "Applied", "Interview", "Offer", "Rejected"] as const;
type KanbanStatus = typeof KANBAN_COLS[number] | "None";

const COL_DOT: Record<KanbanStatus, string> = {
    Saved: "#3b82f6",
    Applied: "#f97316",
    Interview: "#f59e0b",
    Offer: "#10b981",
    Rejected: "#f43f5e",
    None: "#78716c",
};

interface Internship {
    id: string;
    company: string;
    role: string;
    location: string;
    match: number;
    status: KanbanStatus;
    reason: string;
    tags: string[];
    logo: string;
    link?: string;
}

function cleanCompanyName(company: string): string {
    if (!company) return "";
    let clean = company;
    // Remove content in brackets or parentheses
    clean = clean.replace(/\s*\([^)]*\)/g, "");
    clean = clean.replace(/\s*\[[^\]]*\]/g, "");

    // Split by common separators and take the first part
    const separators = [" - ", " | ", " / ", ", ", " – "];
    for (const sep of separators) {
        if (clean.includes(sep)) {
            clean = clean.split(sep)[0];
        }
    }

    return clean.trim();
}

function isGenericCompany(companyName: string): boolean {
    if (!companyName) return true;
    const name = cleanCompanyName(companyName).toLowerCase();
    const anonymousNames = ["confidential", "company", "anonymous", "not disclosed", "tbd", "employer", "various", "unknown"];
    return anonymousNames.some(word => name === word || name.includes(word));
}

function getCompanyDomain(company: string): string {
    if (!company) return "";
    const cleaned = cleanCompanyName(company);
    const cleanName = cleaned
        .toLowerCase()
        .replace(/\b(inc|corp|co|corporation|llc|ltd|limited)\b\.?/gi, "")
        .trim();

    const domainWord = cleanName.replace(/[^a-z0-9]/gi, "");
    if (!domainWord) return "";

    const customMappings: Record<string, string> = {
        google: "google.com",
        microsoft: "microsoft.com",
        apple: "apple.com",
        meta: "meta.com",
        facebook: "meta.com",
        amazon: "amazon.com",
        netflix: "netflix.com",
        twitter: "twitter.com",
        uber: "uber.com",
        lyft: "lyft.com",
        airbnb: "airbnb.com",
        stripe: "stripe.com",
        coinbase: "coinbase.com",
        roblox: "roblox.com",
        linkedin: "linkedin.com",
        salesforce: "salesforce.com",
        slack: "slack.com",
        adobe: "adobe.com",
        tesla: "tesla.com",
        nvidia: "nvidia.com",
        tiktok: "tiktok.com",
        bytedance: "bytedance.com",
        spotify: "spotify.com",
        intel: "intel.com",
        ibm: "ibm.com",
        oracle: "oracle.com",
        cisco: "cisco.com",
        github: "github.com",
        gitlab: "gitlab.com",
        figma: "figma.com",
        atlassian: "atlassian.com",
        zoom: "zoom.us",
        openai: "openai.com",
        anthropic: "anthropic.com",
        palantir: "palantir.com",
        snowflake: "snowflake.com",
        databricks: "databricks.com",
        pinterest: "pinterest.com",
        snap: "snap.com",
        reddit: "reddit.com",
        ebay: "ebay.com",
        paypal: "paypal.com",
        shopify: "shopify.com",
        squarespace: "squarespace.com",
        wix: "wix.com",
        canva: "canva.com",
        notion: "notion.so",
        slackhq: "slack.com",
        trello: "trello.com",
        asana: "asana.com",
        monday: "monday.com",
        zoomvideo: "zoom.us"
    };

    return customMappings[domainWord] || `${domainWord}.com`;
}

function getInitialsStyle(company: string) {
    const name = company || "Company";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Vibrant HSL hue values to generate elegant gradients
    const hues = [15, 35, 160, 200, 220, 260, 280, 320];
    const index = Math.abs(hash) % hues.length;
    const hue = hues[index];
    const color1 = `hsl(${hue}, 75%, 45%)`;
    const color2 = `hsl(${(hue + 35) % 360}, 85%, 55%)`;
    return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
    };
}

function CompanyLogo({ logo, company, className = "w-9 h-9" }: { logo?: string; company: string; className?: string }) {
    const [stage, setStage] = useState<"primary" | "unavatar" | "favicon" | "fallback">("primary");
    const [resolvedDomain, setResolvedDomain] = useState<string>("");
    const firstLetter = (company || "C").charAt(0).toUpperCase();

    useEffect(() => {
        setStage("primary");
        setResolvedDomain("");

        if (logo && logo.startsWith("http")) {
            return;
        }

        const isGeneric = isGenericCompany(company);
        if (isGeneric) {
            setStage("fallback");
            return;
        }

        let active = true;
        const resolveDomain = async () => {
            try {
                // Clean the company name query to remove locations and suffixes to improve suggest accuracy
                const cleanedName = cleanCompanyName(company);
                const cleanQuery = cleanedName
                    .replace(/\b(inc|corp|co|corporation|llc|ltd|limited)\b\.?/gi, "")
                    .replace(/[^a-zA-Z0-9\s]/g, "")
                    .trim();

                const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(cleanQuery)}`);
                if (res.ok) {
                    const suggestions = await res.json();
                    if (suggestions && suggestions.length > 0 && suggestions[0].domain && active) {
                        setResolvedDomain(suggestions[0].domain);
                        return;
                    }
                }
            } catch (err) {
                console.error("Autocomplete suggest failed in CompanyLogo:", err);
            }

            if (active) {
                setResolvedDomain(getCompanyDomain(company));
            }
        };

        resolveDomain();

        return () => {
            active = false;
        };
    }, [company, logo]);

    const isGeneric = isGenericCompany(company);

    let primaryUrl = logo && logo.startsWith("http") ? logo : null;
    const domain = resolvedDomain || (!isGeneric ? getCompanyDomain(company) : "");
    if (!primaryUrl && domain) {
        primaryUrl = `https://logo.clearbit.com/${domain}`;
    }

    const unavatarUrl = domain ? `https://unavatar.io/${domain}?fallback=404` : null;
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128&default=404` : null;

    const handlePrimaryError = () => {
        if (unavatarUrl) {
            setStage("unavatar");
        } else if (faviconUrl) {
            setStage("favicon");
        } else {
            setStage("fallback");
        }
    };

    const handleUnavatarError = () => {
        if (faviconUrl) {
            setStage("favicon");
        } else {
            setStage("fallback");
        }
    };

    const handleFaviconError = () => {
        setStage("fallback");
    };

    if (stage === "fallback" || (!primaryUrl && !unavatarUrl && !faviconUrl)) {
        return (
            <div
                className={`${className} rounded-lg flex items-center justify-center font-black text-white flex-shrink-0 shadow-sm text-sm`}
                style={getInitialsStyle(company)}
            >
                {firstLetter}
            </div>
        );
    }

    const activeUrl = stage === "primary" ? primaryUrl! : stage === "unavatar" ? unavatarUrl! : faviconUrl!;
    const handleError = stage === "primary" ? handlePrimaryError : stage === "unavatar" ? handleUnavatarError : handleFaviconError;

    return (
        <div className={`${className} rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-400/10`}>
            <img
                src={activeUrl}
                alt={`${company} Logo`}
                className="w-full h-full object-contain p-1"
                onError={handleError}
            />
        </div>
    );
}

function BrowseCard({
    card,
    onMove,
    isDraggable,
    hoveredCardId,
    setHoveredCardId,
    layoutId = "hoverBackground"
}: {
    card: Internship;
    onMove: (id: string, to: KanbanStatus) => void;
    isDraggable?: boolean;
    hoveredCardId: string | null;
    setHoveredCardId: (id: string | null) => void;
    layoutId?: string;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
        >
            {hoveredCardId === card.id && (
                <motion.span
                    className="absolute inset-0 h-full w-full bg-orange-500/10 block rounded-3xl"
                    layoutId={layoutId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        layout: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.15 }
                    }}
                />
            )}
            <div
                draggable={isDraggable}
                onDragStart={isDraggable ? (e) => {
                    e.dataTransfer.setData("text/plain", card.id);
                    e.dataTransfer.effectAllowed = "move";
                } : undefined}
                className={`soft-card relative z-20 rounded-xl p-5 w-full flex flex-col gap-3 flex-shrink-0 hover:border-orange-300/30 transition-[border-color,background-color,box-shadow,transform] duration-200 ${expanded ? "h-auto" : "h-[300px]"
                    } ${isDraggable ? "cursor-grab active:cursor-grabbing hover:-translate-y-0.5" : ""}`}
            >
                <div className="flex flex-col gap-1.5 flex-shrink-0 h-[125px]">
                    <div className="flex items-center justify-between flex-shrink-0">
                        <CompanyLogo logo={card.logo} company={card.company} className="w-9 h-9" />
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-300 flex-shrink-0">
                            {card.match}% Match
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
                        <h4 className="font-bold text-sm text-white leading-snug">{card.role}</h4>
                        <p className="text-xs text-stone-400 font-medium">{card.company}</p>
                        <div className="flex items-center gap-0.5 text-[10px] text-stone-500">
                            <span className="material-symbols-outlined text-[12px] flex-shrink-0">location_on</span>
                            <span className="truncate" title={card.location}>{card.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 h-[22px] overflow-hidden flex-shrink-0">
                    {card.tags.map((tag) => (
                        <span
                            key={tag}
                            className="chip-orange text-[10px] px-2 py-0.5 rounded-full truncate max-w-[80px]"
                            title={tag}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out flex-shrink-0 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}>
                    <div className="overflow-hidden min-h-0">
                        <div className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-400/10 text-[11px] leading-relaxed text-stone-300">
                            <span className="text-orange-300 font-bold">Why this fits: </span>
                            {card.reason}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] text-orange-300 hover:text-orange-200 transition-colors font-bold flex items-center gap-0.5 self-start flex-shrink-0"
                >
                    <span className="material-symbols-outlined text-[14px]">
                        {expanded ? "expand_less" : "expand_more"}
                    </span>
                    <span>{expanded ? "Less" : "Why this fits"}</span>
                </button>

                <div className="flex items-center justify-between gap-2 border-t border-orange-400/5 pt-3 mt-auto flex-shrink-0">
                    {card.link ? (
                        <a
                            href={card.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-0.5"
                        >
                            <span>Apply</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        </a>
                    ) : (
                        <span className="text-[11px] font-bold text-stone-500 select-none">Saved</span>
                    )}
                    <SleekDropdown
                        value={card.status}
                        onChange={(val) => onMove(card.id, val as KanbanStatus)}
                        options={["None", ...KANBAN_COLS]}
                        className="text-[11px] bg-[#1d1b1a] border border-orange-400/15 text-stone-300 rounded-lg px-1.5 py-1 focus:outline-none focus:border-orange-500 transition-all cursor-pointer font-medium max-w-[90px] flex-shrink-0"
                        menuWidth="130px"
                        position="up"
                        align="right"
                    />
                </div>
            </div>
        </div>
    );
}

function KanbanCard({
    card,
    onMove,
    isDraggable,
    draggingCardId,
    setDraggingCardId,
    onTouchDragStart,
    onTouchDragMove,
    onTouchDragEnd,
    hoveredCardId,
    setHoveredCardId,
    layoutId = "hoverBackground"
}: {
    card: Internship;
    onMove: (id: string, to: KanbanStatus) => void;
    isDraggable?: boolean;
    draggingCardId: string | null;
    setDraggingCardId: (id: string | null) => void;
    onTouchDragStart?: (card: Internship, x: number, y: number, offsetX?: number, offsetY?: number) => void;
    onTouchDragMove?: (x: number, y: number) => void;
    onTouchDragEnd?: () => void;
    hoveredCardId: string | null;
    setHoveredCardId: (id: string | null) => void;
    layoutId?: string;
}) {
    const [expanded, setExpanded] = useState(false);
    const isDragging = draggingCardId === card.id;
    const cardRef = useRef<HTMLDivElement>(null);
    const [touchActive, setTouchActive] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);
    const startTouchPos = useRef<{ x: number; y: number } | null>(null);
    const isTouchDragging = useRef(false);

    const onTouchDragStartRef = useRef(onTouchDragStart);
    const onTouchDragMoveRef = useRef(onTouchDragMove);
    const onTouchDragEndRef = useRef(onTouchDragEnd);

    useEffect(() => {
        onTouchDragStartRef.current = onTouchDragStart;
        onTouchDragMoveRef.current = onTouchDragMove;
        onTouchDragEndRef.current = onTouchDragEnd;
    });

    useEffect(() => {
        return () => {
            if (touchTimer.current) clearTimeout(touchTimer.current);
        };
    }, []);

    useEffect(() => {
        if (!touchActive) return;

        const handleGlobalTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (!isTouchDragging.current) return;
            if (e.cancelable) {
                e.preventDefault();
            }
            onTouchDragMoveRef.current?.(touch.clientX, touch.clientY);
        };

        const handleGlobalTouchEnd = () => {
            setIsPressed(false);
            if (touchTimer.current) {
                clearTimeout(touchTimer.current);
                touchTimer.current = null;
            }
            if (isTouchDragging.current) {
                isTouchDragging.current = false;
                setTouchActive(false);
                onTouchDragEndRef.current?.();
            }
            startTouchPos.current = null;
        };

        window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
        window.addEventListener("touchend", handleGlobalTouchEnd);
        window.addEventListener("touchcancel", handleGlobalTouchEnd);

        return () => {
            window.removeEventListener("touchmove", handleGlobalTouchMove);
            window.removeEventListener("touchend", handleGlobalTouchEnd);
            window.removeEventListener("touchcancel", handleGlobalTouchEnd);
        };
    }, [touchActive]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isDraggable) return;
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        startTouchPos.current = { x: touch.clientX, y: touch.clientY };
        isTouchDragging.current = false;
        setIsPressed(true);

        if (touchTimer.current) clearTimeout(touchTimer.current);
        touchTimer.current = setTimeout(() => {
            isTouchDragging.current = true;
            setTouchActive(true);
            onTouchDragStartRef.current?.(card, touch.clientX, touch.clientY, offsetX, offsetY);
            if (navigator.vibrate) navigator.vibrate(40);
        }, 120);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDraggable) return;
        if (isTouchDragging.current) return;
        const touch = e.touches[0];
        if (startTouchPos.current) {
            const dx = Math.abs(touch.clientX - startTouchPos.current.x);
            const dy = Math.abs(touch.clientY - startTouchPos.current.y);
            if (dx > 15 || dy > 15) {
                setIsPressed(false);
                if (touchTimer.current) {
                    clearTimeout(touchTimer.current);
                    touchTimer.current = null;
                }
            }
        }
    };

    const handleTouchEnd = () => {
        if (!isDraggable) return;
        if (isTouchDragging.current) return;
        setIsPressed(false);
        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }
        startTouchPos.current = null;
    };

    const showPlaceholder = isDragging || touchActive;
    const cardColor = COL_DOT[card.status];

    return (
        <div
            ref={cardRef}
            draggable={isDraggable && !touchActive}
            onDragStart={isDraggable ? (e) => {
                e.dataTransfer.setData("text/plain", card.id);
                e.dataTransfer.effectAllowed = "move";
                setTimeout(() => setDraggingCardId?.(card.id), 0);
            } : undefined}
            onDragEnd={isDraggable ? () => {
                setDraggingCardId?.(null);
            } : undefined}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="relative group block p-2 h-full w-full font-sans"
            style={{ touchAction: "none" }}
            onMouseEnter={() => setHoveredCardId(card.id)}
            onMouseLeave={() => setHoveredCardId(null)}
        >
            {hoveredCardId === card.id && !showPlaceholder && (
                <motion.span
                    className="absolute inset-0 h-full w-full bg-orange-500/10 block rounded-3xl"
                    layoutId={layoutId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        layout: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.15 }
                    }}
                />
            )}
            <div
                className={`soft-card relative z-20 rounded-xl sm:p-4 p-3 w-full flex flex-col gap-2 sm:gap-2.5 flex-shrink-0 transition-all duration-300 ease-out h-auto ${showPlaceholder
                        ? "scale-95 pointer-events-none"
                        : isPressed
                            ? "scale-98 border-orange-500/30 bg-orange-500/[0.02]"
                            : isDraggable
                                ? "cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_12px_24px_rgba(234,88,12,0.08)] hover:border-orange-300/30"
                                : ""
                    }`}
                style={showPlaceholder ? {
                    border: `2px dashed ${cardColor}40`,
                    backgroundColor: `${cardColor}03`,
                    boxShadow: `inset 0 0 12px ${cardColor}0d`
                } : undefined}
            >
                <div className={`flex flex-col gap-2 sm:gap-2.5 w-full h-full transition-opacity duration-200 ${showPlaceholder ? "opacity-0" : ""}`}>
                    <div className="flex items-center justify-between flex-shrink-0 gap-1.5">
                        <CompanyLogo logo={card.logo} company={card.company} className="w-6 h-6 sm:w-7 h-7" />
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-300 flex-shrink-0">
                            {card.match}% Match
                        </span>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <h4 className="font-bold text-[11px] sm:text-xs text-white leading-tight line-clamp-2" title={card.role}>
                            {card.role}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-stone-400 truncate" title={card.company}>
                            {card.company}
                        </p>
                        <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-stone-500">
                            <span className="material-symbols-outlined text-[9px] sm:text-[10px] flex-shrink-0">location_on</span>
                            <span className="truncate" title={card.location}>{card.location}</span>
                        </div>
                    </div>

                    {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 sm:gap-1 overflow-hidden flex-shrink-0">
                            {card.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="chip-orange text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full truncate max-w-[65px] sm:max-w-[70px]"
                                    title={tag}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out flex-shrink-0 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                        }`}>
                        <div className="overflow-hidden min-h-0">
                            <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-400/10 text-[9px] sm:text-[10px] leading-relaxed text-stone-300">
                                <span className="text-orange-300 font-bold">Why fits: </span>
                                {card.reason}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[8px] sm:text-[9px] text-orange-300 hover:text-orange-200 transition-colors font-bold flex items-center gap-0.5 self-start flex-shrink-0"
                    >
                        <span className="material-symbols-outlined text-[10px] sm:text-[12px]">
                            {expanded ? "expand_less" : "expand_more"}
                        </span>
                        <span>{expanded ? "Less" : "Why this fits"}</span>
                    </button>

                    <div className="flex flex-col gap-1.5 border-t border-orange-400/5 pt-2 mt-1.5 flex-shrink-0 sm:flex-row sm:items-center sm:justify-between">
                        {card.link ? (
                            <a
                                href={card.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] sm:text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-0.5 self-center sm:self-auto"
                            >
                                <span>Apply</span>
                                <span className="material-symbols-outlined text-[10px] sm:text-[11px]">open_in_new</span>
                            </a>
                        ) : (
                            <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 select-none self-center sm:self-auto">
                                Saved
                            </span>
                        )}
                        <SleekDropdown
                            value={card.status}
                            onChange={(val) => onMove(card.id, val as KanbanStatus)}
                            options={["None", ...KANBAN_COLS]}
                            className="text-[9px] sm:text-[10px] bg-[#1d1b1a] border border-orange-400/15 text-stone-300 rounded-lg px-1 py-0.5 focus:outline-none focus:border-orange-500 transition-all cursor-pointer font-medium w-full sm:w-auto max-w-none sm:max-w-[80px] flex-shrink-0"
                            menuWidth="120px"
                            position="up"
                            align="right"
                        />
                    </div>
                </div>

                {showPlaceholder && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 w-full h-full animate-pulse pointer-events-none">
                        <span className="material-symbols-outlined text-[20px] mb-1" style={{ color: `${cardColor}40` }}>space_dashboard</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-center" style={{ color: `${cardColor}40` }}>Moving card...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function KanbanColumn({
    status,
    cards,
    onMove,
    draggingCardId,
    setDraggingCardId,
    onTouchDragStart,
    onTouchDragMove,
    onTouchDragEnd,
    hoveredCardId,
    setHoveredCardId,
    isDraggingActive
}: {
    status: KanbanStatus;
    cards: Internship[];
    onMove: (id: string, to: KanbanStatus) => void;
    draggingCardId: string | null;
    setDraggingCardId: (id: string | null) => void;
    onTouchDragStart?: (card: Internship, x: number, y: number, offsetX?: number, offsetY?: number) => void;
    onTouchDragMove?: (x: number, y: number) => void;
    onTouchDragEnd?: () => void;
    hoveredCardId: string | null;
    setHoveredCardId: (id: string | null) => void;
    isDraggingActive?: boolean;
}) {
    const [isOver, setIsOver] = useState(false);
    const [isPulse, setIsPulse] = useState(false);
    const dragCounter = useRef(0);
    const prevCount = useRef(cards.length);

    useEffect(() => {
        if (cards.length > prevCount.current) {
            setIsPulse(true);
            const timer = setTimeout(() => setIsPulse(false), 800);
            return () => clearTimeout(timer);
        }
        prevCount.current = cards.length;
    }, [cards.length]);

    const color = COL_DOT[status];

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => {
                e.preventDefault();
                dragCounter.current++;
                setIsOver(true);
            }}
            onDragLeave={() => {
                dragCounter.current--;
                if (dragCounter.current === 0) {
                    setIsOver(false);
                }
            }}
            onDrop={(e) => {
                e.preventDefault();
                dragCounter.current = 0;
                setIsOver(false);
                setDraggingCardId(null);
                const cardId = e.dataTransfer.getData("text/plain");
                if (cardId) onMove(cardId, status);
            }}
            className="w-full flex flex-col gap-3"
            data-drop-status={status}
        >
            <div
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1d1b1a]/60 border backdrop-blur-md transition-all duration-300"
                style={{
                    borderColor: isPulse ? color : "rgba(251, 146, 60, 0.1)",
                    boxShadow: isPulse ? `0 0 15px ${color}33` : undefined,
                    transform: isPulse ? "scale(1.02)" : "scale(1)"
                }}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{
                            backgroundColor: color,
                            boxShadow: `0 0 8px ${color}`
                        }}
                    />
                    <span className="text-sm font-semibold text-white tracking-wide">{status}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#252120] text-stone-400 font-bold border border-orange-400/5">
                    {cards.length}
                </span>
            </div>

            <div
                className="kanban-column-body flex flex-col gap-2.5 overflow-y-auto pr-1.5 h-[400px] sm:h-[440px] md:h-[480px] lg:h-[560px] xl:h-[640px] rounded-2xl p-2.5 bg-gradient-to-b from-[#131110]/80 to-[#181514]/40 border backdrop-blur-md transition-all duration-300 ease-out"
                style={{
                    borderColor: isOver
                        ? color
                        : isPulse
                            ? color
                            : draggingCardId
                                ? `${color}38`
                                : "rgba(251, 146, 60, 0.1)",
                    borderStyle: (isOver || isPulse) ? "solid" : draggingCardId ? "dashed" : "solid",
                    backgroundColor: isOver
                        ? `${color}0d`
                        : isPulse
                            ? "transparent"
                            : undefined,
                    boxShadow: isOver
                        ? `0 0 25px ${color}25, inset 0 0 15px ${color}0d`
                        : isPulse
                            ? `0 0 30px ${color}33`
                            : undefined,
                    transform: isOver ? "scale(1.015) translateY(-2px)" : "scale(1)",
                    backgroundImage: isPulse ? `linear-gradient(to bottom, ${color}08, #18151440)` : undefined
                }}
            >
                <AnimatePresence mode="popLayout">
                    {cards.map((card) => (
                        <motion.div
                            layout={isDraggingActive ? false : "position"}
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.92, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: -15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 250 }}
                            className="w-full flex-shrink-0"
                        >
                            <KanbanCard
                                card={card}
                                onMove={onMove}
                                isDraggable={true}
                                draggingCardId={draggingCardId}
                                setDraggingCardId={setDraggingCardId}
                                onTouchDragStart={onTouchDragStart}
                                onTouchDragMove={onTouchDragMove}
                                onTouchDragEnd={onTouchDragEnd}
                                hoveredCardId={hoveredCardId}
                                setHoveredCardId={setHoveredCardId}
                                layoutId="hoverBackground-kanban"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {cards.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 py-12 opacity-25 border border-dashed border-stone-700 rounded-xl m-2">
                        <div className="mb-2">
                            <KanbanBoardIcon />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Drop here</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InternshipMatchPage() {
    const { user, token, updateUser } = useAuth();
    const [cards, setCards] = useState<Internship[]>([]);
    const [searchResults, setSearchResults] = useState<Internship[]>([]);
    const [activeTab, setActiveTab] = useState<"browse" | "kanban">("browse");
    const [kanbanTab, setKanbanTab] = useState<KanbanStatus>("Saved");
    const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
    const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializedRef = useRef(false);

    const handleHoverChange = (id: string | null) => {
        if (draggingCardId || touchDragCard) return;
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (id === null) {
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredCardId(null);
            }, 100);
        } else {
            setHoveredCardId(id);
        }
    };

    const [touchDragCard, setTouchDragCard] = useState<Internship | null>(null);
    const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
    const [touchDropStatus, setTouchDropStatus] = useState<KanbanStatus | null>(null);
    const touchDropStatusRef = useRef<KanbanStatus | null>(null);
    const touchPreviewRef = useRef<HTMLDivElement>(null);
    const cursorGlowRef = useRef<HTMLDivElement>(null);
    const touchOffsetRef = useRef<{ x: number; y: number }>({ x: 130, y: 120 });

    const touchTargetX = useRef(0);
    const touchTargetY = useRef(0);
    const touchCurrentX = useRef(0);
    const touchCurrentY = useRef(0);
    const touchAnimFrame = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);
    const lastCheckTime = useRef(0);

    useEffect(() => {
        return () => {
            if (touchAnimFrame.current) {
                cancelAnimationFrame(touchAnimFrame.current);
            }
        };
    }, []);

    const onTouchDragStart = (card: Internship, x: number, y: number, offsetX = 130, offsetY = 120) => {
        setTouchDragCard(card);
        touchDropStatusRef.current = null;
        setTouchPosition({ x, y });
        touchOffsetRef.current = { x: offsetX, y: offsetY };

        const startX = x - offsetX;
        const startY = y - offsetY;
        touchTargetX.current = startX;
        touchTargetY.current = startY;
        touchCurrentX.current = startX;
        touchCurrentY.current = startY;
        lastCheckTime.current = 0;

        document.documentElement.style.setProperty('--touch-transform', `translate3d(${startX}px, ${startY}px, 0) scale(1.05) rotate(3deg)`);

        if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;
            const animate = (timestamp: number) => {
                if (!isAnimatingRef.current) return;
                
                // Lerp with responsive factor (0.35) to filter high-frequency finger jitter
                touchCurrentX.current += (touchTargetX.current - touchCurrentX.current) * 0.35;
                touchCurrentY.current += (touchTargetY.current - touchCurrentY.current) * 0.35;

                document.documentElement.style.setProperty(
                    '--touch-transform',
                    `translate3d(${touchCurrentX.current}px, ${touchCurrentY.current}px, 0) scale(1.05) rotate(3deg)`
                );

                // Throttle heavy element lookup to 60ms intervals (prevents layout thrashing)
                if (timestamp - lastCheckTime.current > 60) {
                    lastCheckTime.current = timestamp;
                    const fingerX = touchTargetX.current + touchOffsetRef.current.x;
                    const fingerY = touchTargetY.current + touchOffsetRef.current.y;
                    const el = document.elementFromPoint(fingerX, fingerY);
                    const col = el?.closest("[data-drop-status]");
                    const newStatus = col ? (col.getAttribute("data-drop-status") as KanbanStatus) : null;
                    if (newStatus !== touchDropStatusRef.current) {
                        touchDropStatusRef.current = newStatus;
                        setTouchDropStatus(newStatus);
                    }
                }

                touchAnimFrame.current = requestAnimationFrame(animate);
            };
            touchAnimFrame.current = requestAnimationFrame(animate);
        }
    };

    const onTouchDragMove = (x: number, y: number) => {
        const offset = touchOffsetRef.current;
        touchTargetX.current = x - offset.x;
        touchTargetY.current = y - offset.y;
    };

    const onTouchDragEnd = () => {
        isAnimatingRef.current = false;
        if (touchAnimFrame.current) {
            cancelAnimationFrame(touchAnimFrame.current);
            touchAnimFrame.current = null;
        }

        const targetStatus = touchDropStatusRef.current;
        if (touchDragCard && targetStatus) {
            handleMove(touchDragCard.id, targetStatus);
        }
        setTouchDragCard(null);
        setTouchPosition(null);
        setTouchDropStatus(null);
        touchDropStatusRef.current = null;
        document.documentElement.style.removeProperty('--touch-transform');
    };

    const [profile, setProfile] = useState<any>({});
    const handleQuickTagClick = (key: string, value: string) => {
        setProfile((prev: any) => {
            const current = prev[key] || "";
            if (key === "skills" || key === "interests") {
                if (!current) return { ...prev, [key]: value };
                const list = current.split(",").map((s: string) => s.trim()).filter(Boolean);
                if (list.includes(value)) return prev;
                return { ...prev, [key]: [...list, value].join(", ") };
            } else {
                return { ...prev, [key]: value };
            }
        });
    };
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cursorGlowRef.current) {
                cursorGlowRef.current.style.transform = `translate3d(${e.clientX - 130}px, ${e.clientY - 130}px, 0)`;
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (touchDragCard) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            const preventDefault = (e: TouchEvent) => {
                if (e.cancelable) e.preventDefault();
            };
            document.addEventListener("touchmove", preventDefault, { passive: false });
            return () => {
                document.body.style.overflow = "";
                document.body.style.touchAction = "";
                document.removeEventListener("touchmove", preventDefault);
            };
        }
    }, [touchDragCard]);

    // Load existing applications
    useEffect(() => {
        (async () => {
            if (token) {
                try {
                    const res = await fetch("/api/applications", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.applications) {
                        const mapped = data.applications.map((app: any) => ({
                            id: app._id,
                            company: app.company,
                            role: app.role,
                            location: app.location || "",
                            match: app.matchScore || 80,
                            status: app.status as KanbanStatus,
                            reason: app.notes || "Saved from search",
                            tags: app.tags || [],
                            logo: (app.company || "C").charAt(0).toUpperCase(),
                            link: app.link || ""
                        }));
                        setCards(mapped);
                    }
                } catch (err) {
                    console.error("Failed to load applications", err);
                }
            }
        })();
    }, [token]);

    // Populate profile fields and run initial search
    useEffect(() => {
        if (user && !isInitializedRef.current) {
            isInitializedRef.current = true;
            const u = user as any;
            const initialProfile = {
                skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "",
                major: u.major || "",
                location: u.location || "",
                interests: Array.isArray(u.interests) ? u.interests.join(", ") : u.interests || ""
            };
            setProfile(initialProfile);

            (async () => {
                if (token) {
                    setSearching(true);
                    try {
                        const res = await fetch("/api/internship/search", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(initialProfile)
                        });
                        const data = await res.json();
                        if (data.success && data.results) {
                            setSearchResults(data.results);
                        }
                    } catch (err) {
                        console.error("Initial search failed", err);
                    } finally {
                        setSearching(false);
                    }
                }
            })();
        }
    }, [user, token]);

    const handleMove = async (cardId: string, to: KanbanStatus) => {
        if (!token) return;

        const existingCardIndex = cards.findIndex(c => c.id === cardId);

        if (existingCardIndex > -1) {
            if (to === "None") {
                try {
                    const res = await fetch(`/api/applications/${cardId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setCards(prev => prev.filter(c => c.id !== cardId));
                    }
                } catch (err) {
                    console.error("Failed to delete application", err);
                }
            } else {
                try {
                    const res = await fetch(`/api/applications/${cardId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: to })
                    });
                    const data = await res.json();
                    if (data.success && data.application) {
                        setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: to } : c));
                    }
                } catch (err) {
                    console.error("Failed to update status", err);
                }
            }
        } else {
            if (to === "None") return;

            const searchCard = syncedSearchResults.find(c => c.id === cardId);
            if (!searchCard) return;

            try {
                const res = await fetch("/api/applications", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        company: searchCard.company,
                        role: searchCard.role,
                        location: searchCard.location,
                        status: to,
                        matchScore: searchCard.match,
                        notes: searchCard.reason,
                        tags: searchCard.tags,
                        link: searchCard.link,
                        source: "Other"
                    })
                });
                const data = await res.json();
                if (data.success && data.application) {
                    const newDbCard: Internship = {
                        id: data.application._id,
                        company: data.application.company,
                        role: data.application.role,
                        location: data.application.location || "",
                        match: data.application.matchScore || searchCard.match,
                        status: data.application.status as KanbanStatus,
                        reason: data.application.notes || searchCard.reason,
                        tags: data.application.tags || [],
                        logo: searchCard.logo,
                        link: data.application.link || ""
                    };
                    setCards(prev => [newDbCard, ...prev]);
                }
            } catch (err) {
                console.error("Failed to save application", err);
            }
        }
    };

    const handleSearch = async () => {
        if (!token) return;
        setSearching(true);
        setSearchError("");
        try {
            // Save modified profile fields to the database so they persist on reload
            const profileRes = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: profile.skills ? profile.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
                    major: profile.major || "",
                    location: profile.location || "",
                    interests: profile.interests ? profile.interests.split(",").map((s: string) => s.trim()).filter(Boolean) : []
                })
            });
            const profileData = await profileRes.json();
            if (profileData.success && profileData.user) {
                updateUser(profileData.user);
            }

            const res = await fetch("/api/internship/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            if (data.success && data.results) {
                setSearchResults(data.results);
            } else {
                setSearchError(data.message || "Failed to find matches");
            }
        } catch (err: any) {
            setSearchError(err.message || "Something went wrong.");
        } finally {
            setSearching(false);
        }
    };

    const syncedSearchResults = useMemo(() => {
        return searchResults.map(resCard => {
            const dbMatch = cards.find(
                dbc =>
                    dbc.company.toLowerCase() === resCard.company.toLowerCase() &&
                    dbc.role.toLowerCase() === resCard.role.toLowerCase()
            );
            return dbMatch ? { ...resCard, id: dbMatch.id, status: dbMatch.status } : { ...resCard, status: "None" as const };
        });
    }, [searchResults, cards]);

    const sortedResults = useMemo(() => {
        return [...syncedSearchResults].sort((a, b) => b.match - a.match);
    }, [syncedSearchResults]);

    return (
        <div className="relative min-h-screen orange-page-tint">
            {searching && (
                <Loader overlay={true} title="Internship Matcher" text="Matching..." />
            )}
            <style>{`
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
        @keyframes fadeUpTitle {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeUpSubtitle {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .kanban-column-body::-webkit-scrollbar {
          width: 4px;
        }
        .kanban-column-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-column-body::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.15);
          border-radius: 4px;
        }
        .kanban-column-body::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.35);
        }

        @media (max-width: 639px) {
          .match-header {
            border-bottom: none !important;
            box-shadow: none !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            margin-bottom: 0 !important;
          }
          .match-profile-card {
            border-top: none !important;
            box-shadow: none !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
            margin-top: 0 !important;
          }
          .mobile-kanban-unified-card {
            position: relative;
            background: transparent !important;
            border: none !important;
            border-radius: 0px !important;
            box-shadow: none !important;
            overflow: visible !important;
            filter: drop-shadow(0 0 0.5px rgba(255, 255, 255, 0.55)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.18)) drop-shadow(0 14px 35px rgba(0, 0, 0, 0.35)) !important;
            transition: filter 200ms ease-out !important;
          }
          .mobile-kanban-unified-card::before {
            content: "";
            position: absolute;
            inset: 0;
            background: #181615 !important;
            z-index: -2;
            clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)) !important;
          }
          .mobile-kanban-unified-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: transparent !important;
            border: 1.5px solid rgba(255, 255, 255, 1) !important;
            z-index: -1;
            pointer-events: none;
            clip-path: polygon(0 calc(100% - 12px), 0 100%, 12px 100%, 100% 12px, 100% 0, calc(100% - 12px) 0) !important;
            filter: drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4.5px rgba(255, 255, 255, 0.65)) !important;
            transition: filter 200ms ease-out !important;
          }
          .mobile-kanban-unified-card:hover::after {
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 1)) drop-shadow(0 0 7.5px rgba(255, 255, 255, 0.85)) !important;
          }
        }
      `}</style>

            <GridBackgroundDemo />

            <div
                ref={cursorGlowRef}
                className="cursor-glow"
                style={{
                    transform: "translate3d(-200px, -200px, 0)"
                }}
            />

            <TopBar title="Internship Match Agent" ctaLabel="Find Matches" />

            <main className="relative z-20 sidebar-aware pt-24 pb-8 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <section className="relative overflow-hidden select-none hero-shell p-6 sm:p-8 md:p-10 match-header rounded-t-[32px] rounded-b-none border-b-0 mb-0 sm:rounded-[32px] sm:border-b sm:mb-10">
                        <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="hidden sm:block absolute bottom-0 right-0 w-72 h-72 bg-orange-400/5 rounded-full blur-[120px] pointer-events-none" />

                        {/* Clipped background decoration container to match the hero-shell shape */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-t-[32px] rounded-b-none sm:rounded-[32px]">
                            {/* Absolutely positioned giant static background decoration */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-[55%] sm:left-auto sm:right-0 w-[760px] h-[380px] sm:w-[1000px] sm:h-[500px] md:w-[1200px] md:h-[600px] lg:w-[1400px] lg:h-[700px] sm:translate-x-[18%] md:translate-x-[20%] lg:translate-x-[22%] -rotate-[8deg] opacity-65">
                                <AnimatedMatchAgentLogo />
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
                                Internship
                                <br />
                                <span className="text-orange-300 [-webkit-text-stroke:0px] [-webkit-text-fill-color:#fdba74] whitespace-nowrap bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                                    <CanvasText
                                        text="Match Agent"
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
                                AI finds roles that fit your profile — and explains exactly why.
                            </p>
                        </div>

                        {/* Mobile Version (widths < 640px) */}
                        <div className="flex sm:hidden relative z-10 max-w-4xl flex-col items-center text-center mx-auto">
                            {/* Active Match status pill */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full eyebrow text-[10px] font-bold tracking-[0.15em] font-mono mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] animate-pulse" />
                                <span>MATCH ENGINE ACTIVE</span>
                            </div>

                            {/* Spaced out category indicator */}
                            <div
                                className="text-stone-400 font-bold uppercase tracking-[0.6em] text-[11px] sm:text-xs mb-2 font-mono"
                                style={{ letterSpacing: '0.65em' }}
                            >
                                INTERNSHIP
                            </div>

                            {/* Large solid glowing heading */}
                            <h1 className="text-4xl xs:text-5xl font-black text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] tracking-tight leading-none text-center select-none font-mono">
                                <CanvasText
                                    text="Match Engine"
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
                            <p className="text-xs sm:text-sm font-mono text-stone-400 max-w-md mt-2 mb-4 leading-relaxed text-center">
                                AI finds roles that fit your profile — and explains exactly why.
                            </p>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2 mb-2 lg:mt-4 sm:mt-0 justify-center sm:justify-start">
                            {(["browse", "kanban"] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`classy-vintage flex-1 sm:flex-none w-1/2 sm:w-[180px] px-2 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 whitespace-nowrap ${activeTab === tab
                                        ? "wavy-blue-btn text-white border border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                        : "text-stone-400 bg-[#1a1716] border border-orange-500/10 hover:text-white hover:border-orange-500/20"
                                        }`}
                                >
                                    {tab === "browse" ? <SearchBrowseIcon /> : <KanbanBoardIcon />}
                                    {tab === "browse" ? (
                                        <>
                                            <span className="sm:hidden">Find Matches</span>
                                            <span className="hidden sm:inline">Browse Matches</span>
                                        </>
                                    ) : (
                                        "Kanban Board"
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>



                    {activeTab === "browse" ? (
                        <div className="grid grid-cols-1 2xl:grid-cols-4 gap-8">
                            <div className="2xl:col-span-1 flex flex-col gap-4">
                                <div className="soft-card rounded-b-2xl sm:rounded-2xl match-profile-card rounded-t-none border-t-0 sm:rounded-t-2xl sm:border-t p-5">
                                    <h3 className="font-headline-md text-body-md text-white mb-4 flex items-center gap-2">
                                        <CoachPreferencesIcon />
                                        Your Profile
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { l: "Skills", k: "skills" as const, ph: "React, Python, SQL...", suggestions: ["React", "Python", "SQL", "TypeScript", "Next.js"] },
                                            { l: "Major", k: "major" as const, ph: "Computer Science...", suggestions: ["Computer Science", "Data Science", "Software Eng", "Finance"] },
                                            { l: "Location", k: "location" as const, ph: "Remote, NYC, SF...", suggestions: ["Remote", "Delhi", "Bhubaneswar", "Bangalore"] },
                                            { l: "Interests", k: "interests" as const, ph: "FinTech, AI, DevTools...", suggestions: ["AI/ML", "FinTech", "SaaS", "DevTools"] }
                                        ].map(({ l: label, k: key, ph: placeholder, suggestions }) => (
                                            <div key={key}>
                                                <label className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest mb-1 block">
                                                    {label}
                                                </label>
                                                <input
                                                    id={`internship-match-${key}`}
                                                    name={`internship-match-${key}`}
                                                    autoComplete="off"
                                                    value={profile[key] || ""}
                                                    onChange={(e) => setProfile((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    className="w-full bg-[#1d1b1a] text-[#e8e1df] text-sm rounded-xl p-3 border border-orange-400/15 focus:border-orange-500 outline-none transition-all placeholder:text-stone-600 font-mono"
                                                />
                                                <div className="flex overflow-x-auto sm:flex-wrap gap-2 mt-1.5 scrollbar-none py-0.5 whitespace-nowrap">
                                                    {suggestions.map(s => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => handleQuickTagClick(key, s)}
                                                            className="text-[9px] px-2.5 py-1 cut-tag text-stone-400 hover:text-orange-200 font-mono transition-all active:scale-95 cursor-pointer"
                                                            style={{ "--tag-bg": "#1d1b1a", "--tag-border": "rgba(251,146,60,0.15)", "--tag-bg-hover": "#2c2826", "--tag-border-hover": "rgba(251,146,60,0.38)" } as React.CSSProperties}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleSearch}
                                            disabled={searching}
                                            className="interactive wavy-blue-btn w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-sans font-medium text-white text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-40 mt-4"
                                        >
                                            {searching ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity=".3" />
                                                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                                    </svg>
                                                    Searching...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-[28px] h-[28px] text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 32 32">
                                                        <style>{`
                                                            @keyframes search-spin {
                                                                from { transform: rotate(0deg); }
                                                                to { transform: rotate(360deg); }
                                                            }
                                                            .anim-search-spin {
                                                                animation: search-spin 6s linear infinite;
                                                                transform-origin: 14px 14px;
                                                            }
                                                        `}</style>
                                                        <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" className="anim-search-spin" strokeDasharray="3 2" />
                                                        <line x1="20" y1="20" x2="26" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                                    </svg>
                                                    Find Matches
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="soft-card rounded-2xl p-5">
                                    <h3 className="text-xs font-label-md text-on-surface-variant uppercase tracking-widest mb-3">
                                        Pipeline
                                    </h3>
                                    {KANBAN_COLS.map(col => (
                                        <div key={col} className="flex items-center justify-between py-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COL_DOT[col] }} />
                                                <span className="font-body-md text-body-md text-on-surface-variant">{col}</span>
                                            </div>
                                            <span className="font-headline-md text-body-md text-white">
                                                {cards.filter(c => c.status === col).length}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="2xl:col-span-3">
                                {searchError && (
                                    <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                                        {searchError}
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-5">
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        <span className="text-white font-bold">{sortedResults.length} roles</span> matched
                                    </p>
                                    <span className="chip-green text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                                        <MatchGearsIcon />
                                        AI Ranked
                                    </span>
                                </div>

                                {sortedResults.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#1d1b1a]/40 border border-orange-400/10 backdrop-blur-md">
                                        <div className="mb-4 opacity-60 animate-pulse">
                                            <OpportunityRadarIcon />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">0 results found for the given location</h3>
                                        <p className="text-sm text-stone-400 max-w-md">
                                            Try checking the spelling, entering a nearby city, or searching for a broader region.
                                        </p>
                                    </div>
                                ) : (
                                    <LayoutGroup id="browse-matches">
                                        <div className="hidden lg:grid grid-cols-3 gap-4 items-start">
                                            <div className="flex flex-col gap-4">
                                                {sortedResults.filter((_, idx) => idx % 3 === 0).map(card => (
                                                    <BrowseCard
                                                        key={card.id}
                                                        card={card}
                                                        onMove={handleMove}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        layoutId="hoverBackground-desktop"
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {sortedResults.filter((_, idx) => idx % 3 === 1).map(card => (
                                                    <BrowseCard
                                                        key={card.id}
                                                        card={card}
                                                        onMove={handleMove}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        layoutId="hoverBackground-desktop"
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {sortedResults.filter((_, idx) => idx % 3 === 2).map(card => (
                                                    <BrowseCard
                                                        key={card.id}
                                                        card={card}
                                                        onMove={handleMove}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        layoutId="hoverBackground-desktop"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 items-start">
                                            <div className="flex flex-col gap-4">
                                                {sortedResults.filter((_, idx) => idx % 2 === 0).map(card => (
                                                    <BrowseCard
                                                        key={card.id}
                                                        card={card}
                                                        onMove={handleMove}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        layoutId="hoverBackground-tablet"
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {sortedResults.filter((_, idx) => idx % 2 === 1).map(card => (
                                                    <BrowseCard
                                                        key={card.id}
                                                        card={card}
                                                        onMove={handleMove}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        layoutId="hoverBackground-tablet"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid md:hidden grid-cols-1 gap-4 items-start">
                                            {sortedResults.map(card => (
                                                <BrowseCard
                                                    key={card.id}
                                                    card={card}
                                                    onMove={handleMove}
                                                    hoveredCardId={hoveredCardId}
                                                    setHoveredCardId={handleHoverChange}
                                                    layoutId="hoverBackground-mobile"
                                                />
                                            ))}
                                        </div>
                                    </LayoutGroup>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full pb-4">
                            <div className="mobile-kanban-unified-card p-4 sm:p-0">
                                <div className="relative -mx-4 mb-4">
                                    {/* Fade indicators */}
                                    <div className="absolute left-0 top-0 bottom-2.5 w-6 bg-gradient-to-r from-[#181615] to-transparent pointer-events-none z-10 sm:hidden" />
                                    <div className="absolute right-0 top-0 bottom-2.5 w-6 bg-gradient-to-l from-[#181615] to-transparent pointer-events-none z-10 sm:hidden" />

                                    <div className="sm:hidden flex overflow-x-auto gap-2 pb-2.5 px-4 scrollbar-none border-b border-orange-400/5 flex-nowrap">
                                        {KANBAN_COLS.map(col => {
                                            const count = cards.filter(c => c.status === col).length;
                                            const active = kanbanTab === col;

                                            // Themed active states matching the column colors
                                            const colColors = {
                                                Saved: {
                                                    bg: "bg-blue-500/10",
                                                    border: "border-blue-500/30",
                                                    text: "text-blue-400",
                                                    shadow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]",
                                                },
                                                Applied: {
                                                    bg: "bg-orange-500/10",
                                                    border: "border-orange-500/30",
                                                    text: "text-orange-400",
                                                    shadow: "shadow-[0_0_12px_rgba(249,115,22,0.15)]",
                                                },
                                                Interview: {
                                                    bg: "bg-amber-500/10",
                                                    border: "border-amber-500/30",
                                                    text: "text-amber-400",
                                                    shadow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
                                                },
                                                Offer: {
                                                    bg: "bg-emerald-500/10",
                                                    border: "border-emerald-500/30",
                                                    text: "text-emerald-400",
                                                    shadow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
                                                },
                                                Rejected: {
                                                    bg: "bg-rose-500/10",
                                                    border: "border-rose-500/30",
                                                    text: "text-rose-400",
                                                    shadow: "shadow-[0_0_12px_rgba(244,63,94,0.15)]",
                                                },
                                            }[col];

                                            return (
                                                <button
                                                    key={col}
                                                    data-drop-status={col}
                                                    onClick={() => setKanbanTab(col)}
                                                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 border ${active
                                                        ? `${colColors.bg} ${colColors.border} ${colColors.text} ${colColors.shadow}`
                                                        : "bg-[#1a1716]/65 border-orange-400/5 text-stone-400 hover:text-white"
                                                        }`}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COL_DOT[col] }} />
                                                    {col}
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-all ${active
                                                        ? "bg-black/30 text-white opacity-90"
                                                        : "bg-[#252120] opacity-60 text-stone-400"
                                                        }`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <LayoutGroup id="kanban-board">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {KANBAN_COLS.map(col => {
                                            const visible = kanbanTab === col;
                                            return (
                                                <div key={col} className={visible ? "block" : "hidden sm:block"}>
                                                    <KanbanColumn
                                                        status={col}
                                                        cards={cards.filter(c => c.status === col)}
                                                        onMove={handleMove}
                                                        draggingCardId={draggingCardId}
                                                        setDraggingCardId={setDraggingCardId}
                                                        onTouchDragStart={onTouchDragStart}
                                                        onTouchDragMove={onTouchDragMove}
                                                        onTouchDragEnd={onTouchDragEnd}
                                                        hoveredCardId={hoveredCardId}
                                                        setHoveredCardId={handleHoverChange}
                                                        isDraggingActive={!!draggingCardId || !!touchDragCard}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </LayoutGroup>
                            </div>
                        </div>
                    )}
                </div>

                {/* How Internship Match Works — Glare Cards */}
                <div className="mt-14 flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5 border-b border-orange-500/10 pb-3">
                        <h3 className="font-headline-md text-sm sm:text-base text-white flex items-center gap-2 uppercase tracking-wider">
                            <CardIconShell className="w-8 h-8 flex items-center justify-center">
                                <OpportunityRadarIcon />
                            </CardIconShell>
                            MATCH AGENT SYSTEM GUIDE
                        </h3>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest">HOW THE INTERNSHIP MATCHING ENGINE WORKS</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                Icon: OpportunityRadarIcon,
                                category: "Module 1 — Smart Search",
                                title: "AI-Powered Opportunity Radar",
                                desc: "Enter your target role, location, and desired remote preference. The AI Match Agent then scans live opportunities across our sourced database, surfacing internships and jobs most aligned to your profile skills, experience level, and stated preferences.",
                                pills: ["Role Matching", "Location Filter", "Remote/Hybrid", "Skill Alignment"]
                            },
                            {
                                Icon: MatchGearsIcon,
                                category: "Module 2 — Profile Matching",
                                title: "Compatibility Scoring Engine",
                                desc: "Each result is scored against your saved profile skills, experience, and preferences. The engine applies weighted scoring across role relevance, company culture signals, and compensation range to rank results from best to good fit for your specific career stage.",
                                pills: ["Compatibility Score", "Skill Weighting", "Role Relevance", "Culture Signals"]
                            },
                            {
                                Icon: KanbanBoardIcon,
                                category: "Module 3 — Kanban Pipeline",
                                title: "Application Tracker Board",
                                desc: "Drag saved internships through your personal pipeline: Saved → Applied → Interview → Offer. The Kanban board syncs with your Progress page so your application funnel stats update in real-time as you move cards between columns.",
                                pills: ["Kanban Board", "Drag & Drop", "Status Sync", "Progress Feed"]
                            }
                        ].map((card, i) => (
                            <GlareCard key={i} containerClassName="aspect-auto" className="flex flex-col justify-start gap-3 p-5 bg-[#1d0f0a]/90 border border-orange-600/30 rounded-[24px] text-left font-sans transition-colors hover:bg-[#2c170f]/95 hover:border-orange-500/50 overflow-hidden">
                                <div className="flex items-center justify-between mb-0.5">
                                    <CardIconShell className="w-9 h-9 flex items-center justify-center">
                                        <card.Icon />
                                    </CardIconShell>
                                    <span className="text-[9px] uppercase tracking-widest text-orange-400/80 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10">
                                        Module {i + 1}
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



            <AnimatePresence>
                {touchDragCard && (
                    <motion.div
                        initial={{ opacity: 0, y: 120 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 120 }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#120f0e]/95 backdrop-blur-xl border-t border-orange-400/20 rounded-t-3xl shadow-[0_-15px_30px_rgba(0,0,0,0.65)] flex flex-col gap-3 pb-8"
                    >
                        <div className="w-12 h-1 bg-stone-700 rounded-full self-center mb-1" />
                        <div className="text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-300">
                                Drag card to move status
                            </h4>
                            <p className="text-[11px] text-stone-400 mt-1 truncate max-w-[90%] mx-auto font-medium">
                                {touchDragCard.role} <span className="text-stone-500">at</span> {touchDragCard.company}
                            </p>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 mt-2">
                            {KANBAN_COLS.map(col => {
                                const target = touchDropStatus === col;
                                const active = touchDragCard.status === col;
                                const color = COL_DOT[col];
                                return (
                                    <div
                                        key={col}
                                        data-drop-status={col}
                                        className={`flex flex-col items-center justify-center py-3.5 rounded-2xl border transition-all duration-150 cursor-pointer ${active ? "opacity-30 cursor-not-allowed" : ""
                                            }`}
                                        style={{
                                            borderColor: target ? color : "rgba(251, 146, 60, 0.05)",
                                            backgroundColor: target ? `${color}15` : active ? "#181514" : "#1815149c",
                                            boxShadow: target ? `0 0 15px ${color}33, inset 0 0 10px ${color}15` : undefined,
                                            transform: target ? "scale(1.08) translateY(-2px)" : "scale(1)",
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined text-[22px] mb-1"
                                            style={{ color: target ? color : active ? "#52525b" : "#a8a29e" }}
                                        >
                                            {col === "Saved"
                                                ? "bookmark"
                                                : col === "Applied"
                                                    ? "send"
                                                    : col === "Interview"
                                                        ? "forum"
                                                        : col === "Offer"
                                                            ? "workspace_premium"
                                                            : "cancel"}
                                        </span>
                                        <span
                                            className="text-[9px] font-black tracking-wide"
                                            style={{ color: target ? "#ffffff" : active ? "#52525b" : "#a8a29e" }}
                                        >
                                            {col}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {touchDragCard && touchPosition && (() => {
                const cardColor = COL_DOT[touchDragCard.status];
                return (
                    <div
                        className="fixed pointer-events-none z-[100] w-[260px] shadow-[0_25px_50px_rgba(0,0,0,0.65)] rounded-2xl bg-[#1d1b1a]/95 border backdrop-blur-md p-4 flex flex-col gap-2"
                        style={{
                            left: 0,
                            top: 0,
                            transform: "var(--touch-transform)",
                            borderColor: `${cardColor}40`,
                            boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 15px ${cardColor}15`
                        }}
                    >
                        <div className="flex items-center justify-between gap-1.5">
                            <CompanyLogo logo={touchDragCard.logo} company={touchDragCard.company} className="w-6 h-6" />
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-400/20 text-orange-300">
                                {touchDragCard.match}% Match
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h5 className="font-bold text-[11px] text-white leading-tight truncate">
                                {touchDragCard.role}
                            </h5>
                            <p className="text-[10px] text-stone-400 truncate">
                                {touchDragCard.company}
                            </p>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
