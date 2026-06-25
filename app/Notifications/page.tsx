"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import Link from "next/link";
import {
  CardIconShell,
  NotificationsBellIcon,
  AiCoachIcon,
  OpportunityRadarIcon,
  ResumeScannerIcon,
  PaperAirplaneOutreachIcon,
  SettingsTuneIcon,
  CoachingStarIcon
} from "@/components/AnimatedCardIcons";

interface NotificationItem {
  id: string;
  category: "coach" | "match" | "resume" | "outreach" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "coach",
    title: "AI Interview Feedback Ready",
    message: "Your mock interview score for Backend Developer role is 88/100. High communication clarity, review complete.",
    time: "10 minutes ago",
    read: false,
    actionLabel: "View Feedback",
    actionHref: "/Progress"
  }
];

const DYNAMIC_POOL: Omit<NotificationItem, "id" | "time">[] = [
  {
    category: "coach",
    title: "Live Speech Analysis Ready",
    message: "Your voice response pacing was analyzed. Excellent rhythm detected at 142 WPM.",
    read: false,
    actionLabel: "Analyze Pacing",
    actionHref: "/Progress"
  },
  {
    category: "match",
    title: "New Internship opening at Apple",
    message: "Software Engineering Intern role just posted. 89% match score with your profile.",
    read: false,
    actionLabel: "View Match",
    actionHref: "/InternshipMatch"
  },
  {
    category: "resume",
    title: "ATS Format Scan Score",
    message: "Strict section header compliance check passed. ATS compatibility is high.",
    read: false,
    actionLabel: "View Scan",
    actionHref: "/ResumeAnalyzer"
  },
  {
    category: "outreach",
    title: "Response from Recruiter at Meta",
    message: "Your cold outreach email was opened. Follow-up runway is recommended.",
    read: false,
    actionLabel: "View Runway",
    actionHref: "/ColdEmail"
  },
  {
    category: "coach",
    title: "Behavioral Star Response Review",
    message: "AI evaluated your STAR method structure. Action details were strong, add metrics to Result.",
    read: false,
    actionLabel: "Review Mock",
    actionHref: "/MockInterview"
  }
];

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>("all");
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Dynamic notification generator (1 notification every 12 hours)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = DYNAMIC_POOL[Math.floor(Math.random() * DYNAMIC_POOL.length)];
      const newNotif: NotificationItem = {
        ...randomItem,
        id: `dynamic-${Date.now()}`,
        time: "Just now",
        read: false
      };

      setNotifications(prev => [newNotif, ...prev]);
      setToast({ title: newNotif.title, message: newNotif.message });

      // Auto-clear toast after 4.5 seconds
      const timeout = setTimeout(() => {
        setToast(null);
      }, 4500);

      return () => clearTimeout(timeout);
    }, 12 * 60 * 60 * 1000); // 12 hours (1 notification every 12 hours)

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  const getCategoryIconComponent = (category: string) => {
    switch (category) {
      case "coach":
        return AiCoachIcon;
      case "match":
        return OpportunityRadarIcon;
      case "resume":
        return ResumeScannerIcon;
      case "outreach":
        return PaperAirplaneOutreachIcon;
      default:
        return SettingsTuneIcon;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative min-h-screen orange-page-tint">
      <style>{`
        .notification-card {
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .notification-card:hover {
          border-color: rgba(251, 146, 60, 0.35);
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wavy-blue-btn {
          font-family: 'Classy Vintage', sans-serif !important;
          font-size: 10px !important;
          padding: 6px 14px !important;
        }
        .wavy-blue-btn:hover .button-icon-done {
          animation: check-bounce 0.8s ease-in-out infinite;
        }
        .wavy-blue-btn:hover .button-action-icon {
          animation: arrow-slide-right 0.8s ease-in-out infinite;
        }
        @keyframes check-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.22); filter: brightness(1.25); }
        }
        @keyframes arrow-slide-right {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(3px, 0, 0); }
        }
        .animate-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .classy-vintage {
          font-family: 'Classy Vintage', sans-serif !important;
        }
      `}</style>

      <GridBackgroundDemo />
      <div
        className="cursor-glow"
        style={{
          transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
        }}
      />

      {/* Real-time Dynamic Toast Alert popup */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm rounded-2xl border border-orange-500/30 bg-[#181615]/95 p-4 shadow-[0_10px_30px_rgba(234,88,12,0.25)] backdrop-blur-md animate-slide-in">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-orange-400 animate-bounce">notifications_active</span>
            <div>
              <p className="text-xs font-bold text-white font-mono">{toast.title}</p>
              <p className="text-[11px] text-stone-400 leading-normal mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <TopBar title="Notification Center" />

      <main className="relative z-20 sidebar-aware pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-full mx-auto">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <NotificationsBellIcon className="scale-110" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-3 select-none">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-mono shadow-[0_0_8px_#f97316]">
                      {unreadCount} new
                    </span>
                  )}
                </h1>
                <p className="text-sm text-stone-400 mt-1 font-sans">
                  Stay updated with AI mock evaluations, application matches, and optimization alerts.
                </p>
              </div>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  id="mark-all-read-btn"
                  onClick={markAllAsRead}
                  className="interactive wavy-blue-btn text-[10px] font-semibold text-white px-3.5 py-1.5 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm button-icon-done">done_all</span>
                  Mark all read
                </button>
                <button
                  id="clear-all-btn"
                  onClick={clearAll}
                  className="interactive text-[10px] font-semibold text-stone-400 hover:text-stone-300 transition-colors border border-stone-800 px-3.5 py-1.5 rounded-xl bg-stone-900/40 hover:bg-stone-900/80 font-mono"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Filter Category Tabs */}
          <div className="flex gap-2 pb-4 mb-6 border-b border-orange-500/10 overflow-x-auto no-scrollbar select-none">
            {[
              { id: "all", label: "All Feed", Icon: CoachingStarIcon },
              { id: "coach", label: "AI Coach", Icon: AiCoachIcon },
              { id: "match", label: "Internships", Icon: OpportunityRadarIcon },
              { id: "resume", label: "Resume", Icon: ResumeScannerIcon },
              { id: "outreach", label: "Outreach", Icon: PaperAirplaneOutreachIcon },
            ].map(tab => {
              const TabIcon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold classy-vintage transition-all border whitespace-nowrap flex items-center gap-2 ${
                    filter === tab.id
                      ? "bg-orange-500/10 border-orange-400/30 text-orange-300 shadow-[inset_0_0_10px_rgba(249,115,22,0.08)]"
                      : "bg-transparent border-transparent text-stone-400 hover:text-white"
                  }`}
                >
                  <TabIcon className="scale-75" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main List */}
          <div className="flex flex-col gap-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif, index) => {
                const IconComponent = getCategoryIconComponent(notif.category);

                return (
                  <div
                    key={notif.id}
                    className={`soft-card rounded-2xl p-5 flex gap-4 notification-card fade-in relative overflow-hidden ${
                      !notif.read ? "border-l-2 border-l-orange-500 bg-[#1a1716]/60" : "bg-[#181615]"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Unread dot */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]" />
                    )}

                    {/* Left Icon Block */}
                    <div className="flex-shrink-0">
                      <CardIconShell className="p-1 flex items-center justify-center overflow-hidden w-10 h-10 relative border-orange-500/10">
                        <IconComponent className="scale-90" />
                      </CardIconShell>
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                        <h3 className={`text-[15px] font-bold tracking-tight ${notif.read ? "text-stone-300" : "text-white"}`}>
                          {notif.title}
                        </h3>
                        <span className="text-[11px] text-stone-500 font-mono whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed font-sans mb-3">
                        {notif.message}
                      </p>

                      {/* Action & Toggle Block */}
                      <div className="flex items-center gap-3">
                        {notif.actionLabel && notif.actionHref && (
                          <Link
                            href={notif.actionHref}
                            className="interactive wavy-blue-btn px-3 py-1.5 text-[9px] font-bold text-white flex items-center gap-1 font-mono"
                          >
                            {notif.actionLabel}
                            <span className="material-symbols-outlined text-[12px] button-action-icon">arrow_forward</span>
                          </Link>
                        )}
                        <button
                          id={`toggle-read-btn-${notif.id}`}
                          onClick={() => toggleRead(notif.id)}
                          className="text-[11px] text-stone-500 hover:text-stone-400 transition-colors font-mono"
                        >
                          {notif.read ? "Mark unread" : "Mark read"}
                        </button>
                      </div>
                    </div>

                    {/* Right Delete Button */}
                    <button
                      id={`delete-btn-${notif.id}`}
                      onClick={() => deleteNotification(notif.id)}
                      className="text-stone-600 hover:text-stone-400 p-1 flex-shrink-0 self-start transition-all"
                      title="Delete alert"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-stone-500 border border-dashed border-orange-400/10 rounded-2xl bg-orange-500/5 select-none fade-in">
                <span className="material-symbols-outlined text-4xl text-stone-600 mb-2.5">notifications_off</span>
                <p className="text-sm font-bold text-white">All caught up!</p>
                <p className="text-xs text-stone-500 mt-1.5 max-w-sm mx-auto">
                  No notifications matching this filter. New alerts will slide in automatically as you use the command center.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
