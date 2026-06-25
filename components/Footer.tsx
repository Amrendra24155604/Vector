"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AIBrainIcon } from "@/components/Sidebar";

export default function Footer() {
  const pathname = usePathname();

  const rootSegment = pathname.split("/")[1] || "";
  const VALID_ROOT_SEGMENTS = new Set([
    "",
    "Dashboard",
    "MockInterview",
    "ResumeAnalyzer",
    "InternshipMatch",
    "ColdEmail",
    "Progress",
    "Profile",
    "Notifications",
    "Settings",
    "Upgrade",
    "LandingPage",
    "auth",
    "Background"
  ]);

  // Don't render on login, register, OTP pages, or invalid routes
  const isExcluded = pathname.startsWith("/auth") || !VALID_ROOT_SEGMENTS.has(rootSegment);

  if (isExcluded) return null;

  const isLanding = pathname === "/" || pathname === "/LandingPage";

  return (
    <footer className={`${isLanding ? "" : "sidebar-aware pb-28 lg:pb-8"} border-t border-orange-400/10 bg-[#0c0a09]/95 text-stone-400 py-3 px-4 md:py-8 md:px-8 relative overflow-hidden select-none`}>
      {/* Subtle Background Glows */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[80px] rounded-full bg-orange-500/5 blur-[50px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative z-10">
        
        {/* Left Side: Brand Logo, Website Name, and AI Coach Status */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full md:w-auto justify-center md:justify-start">
          <div className="flex flex-col gap-1 items-center sm:items-start">
            <Link href="/Dashboard" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-600/15 to-amber-600/5 border border-orange-500/25 flex items-center justify-center flex-shrink-0 relative shadow-[0_0_10px_rgba(249,115,22,0.15)] group-hover:border-orange-400/40 transition-colors">
                {/* Viewfinder brackets */}
                <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-orange-400 rounded-tl-sm pointer-events-none" />
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-orange-400 rounded-tr-sm pointer-events-none" />
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-orange-400 rounded-bl-sm pointer-events-none" />
                <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-orange-400 rounded-br-sm pointer-events-none" />
                <AIBrainIcon size={18} className="transform -translate-y-[0.5px]" />
              </div>
              <span className="text-[15px] font-black tracking-tight bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent group-hover:to-orange-300 transition-all duration-300">
                Vector
              </span>
            </Link>
            <span className="text-[9px] font-mono tracking-wider text-stone-500 uppercase">
              Designed for Careers to Gain Direction
            </span>
          </div>

          <span className="hidden sm:inline text-stone-800">|</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
            <span className="text-[10px] tracking-widest font-mono text-emerald-400/90 uppercase">
              AI Coach Engine: Online
            </span>
          </div>
        </div>

        {/* Right Side: Social Media Links and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full md:w-auto justify-center md:justify-end">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/ankush__yadav_17" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg bg-[#120f0e] border border-orange-400/10 hover:border-orange-400/30 text-stone-500 hover:text-orange-400 transition-all duration-300 flex items-center justify-center shadow-sm"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/amrendra-yadav-b28ba3321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg bg-[#120f0e] border border-orange-400/10 hover:border-orange-400/30 text-stone-500 hover:text-orange-400 transition-all duration-300 flex items-center justify-center shadow-sm"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          <span className="hidden sm:inline text-stone-800">|</span>

          <p className="text-[10px] font-mono tracking-wide text-stone-500 uppercase">
            &copy; {new Date().getFullYear()} Vector. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
