"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import TopBar from "@/components/TopBar";
import GridBackgroundDemo from "../Background/page";
import {
  CardIconShell,
  SettingsTuneIcon,
  AiCoachIcon,
  OpportunityRadarIcon,
  ConcentricGaugeIcon,
  VoiceWaveformIcon,
  SpeechCoherenceIcon,
  RocketGrowthIcon,
  UpcomingSessionIcon,
  SkillsConstellationIcon
} from "@/components/AnimatedCardIcons";

interface CoachVoice {
  id: string;
  name: string;
  desc: string;
}

const COACH_VOICES: CoachVoice[] = [
  { id: "voice-1", name: "Warm Recruiter (Female)", desc: "Friendly, supportive tone ideal for mock behavioral loops." },
  { id: "voice-2", name: "Assertive Tech Lead (Male)", desc: "Direct, fast-paced technical questions with critical review." },
  { id: "voice-3", name: "Structured PM Coach (Female)", desc: "Logical product-oriented scenarios with pyramid strategy tips." }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [activeTab, setActiveTab] = useState<"coach" | "targets" | "system">("coach");

  // State values for settings configuration
  const [selectedVoice, setSelectedVoice] = useState("voice-2");
  const [coachSpeed, setCoachSpeed] = useState(100); // 80% to 120%
  const [strictFeedback, setStrictFeedback] = useState(true);
  const [targetTrack, setTargetTrack] = useState("Software Engineer");
  const [targetIndustry, setTargetIndustry] = useState("FAANG & High Growth Tech");
  const [atsThreshold, setAtsThreshold] = useState(85);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [telemetrySync, setTelemetrySync] = useState(true);
  const [themeMode, setThemeMode] = useState("amber-dark");

  const [savingState, setSavingState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("command-center-settings");
      if (saved) {
        const config = JSON.parse(saved);
        if (config.selectedVoice) setSelectedVoice(config.selectedVoice);
        if (config.coachSpeed !== undefined) setCoachSpeed(config.coachSpeed);
        if (config.strictFeedback !== undefined) setStrictFeedback(config.strictFeedback);
        if (config.targetTrack) setTargetTrack(config.targetTrack);
        if (config.targetIndustry) setTargetIndustry(config.targetIndustry);
        if (config.atsThreshold !== undefined) setAtsThreshold(config.atsThreshold);
        if (config.matchAlerts !== undefined) setMatchAlerts(config.matchAlerts);
        if (config.weeklyDigest !== undefined) setWeeklyDigest(config.weeklyDigest);
        if (config.telemetrySync !== undefined) setTelemetrySync(config.telemetrySync);
        if (config.themeMode) setThemeMode(config.themeMode);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, []);

  const handleSave = () => {
    setSavingState("saving");
    setTimeout(() => {
      try {
        const config = {
          selectedVoice,
          coachSpeed,
          strictFeedback,
          targetTrack,
          targetIndustry,
          atsThreshold,
          matchAlerts,
          weeklyDigest,
          telemetrySync,
          themeMode
        };
        localStorage.setItem("command-center-settings", JSON.stringify(config));
      } catch (e) {
        console.error("Failed to save settings", e);
      }
      setSavingState("saved");
      setTimeout(() => {
        setSavingState("idle");
      }, 2000);
    }, 1200);
  };

  return (
    <div className={`relative min-h-screen ${themeMode === "stealth-midnight" ? "stealth-tint" : "orange-page-tint"}`}>
      <style>{`
        .setting-row {
          transition: background-color 0.2s ease;
        }
        .setting-row:hover {
          background-color: rgba(251, 146, 60, 0.02);
        }
        .toggle-switch {
          width: 38px;
          height: 20px;
          background-color: #2e2a27;
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(251, 146, 60, 0.1);
        }
        .toggle-switch.active {
          background-color: #f97316;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.4);
        }
        .toggle-knob {
          width: 14px;
          height: 14px;
          background-color: #fff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 3px;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toggle-switch.active .toggle-knob {
          transform: translateX(16px);
        }
        .save-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wavy-blue-btn {
          font-family: 'Classy Vintage', sans-serif !important;
          font-size: 10px !important;
          padding: 6px 14px !important;
        }
        .wavy-blue-btn:hover .button-icon-sync {
          animation: spin-cw-fast 1.2s linear infinite;
        }
        .wavy-blue-btn:hover .button-icon-check {
          animation: check-pulse-btn 0.8s ease-in-out infinite;
        }
        @keyframes spin-cw-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes check-pulse-btn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.22); filter: brightness(1.25); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .option-card {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .option-card:hover {
          transform: translateY(-2px);
          border-color: rgba(249, 115, 22, 0.4) !important;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.08);
        }
        .stealth-tint {
          background:
            radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.015), transparent 26%),
            radial-gradient(circle at 82% 78%, rgba(255, 255, 255, 0.01), transparent 24%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.005), rgba(255, 255, 255, 0.002));
          background-color: #080707;
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

      <TopBar title="Settings Center" />

      <main className="relative z-20 sidebar-aware pt-24 pb-8 px-6 min-h-screen">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <SettingsTuneIcon className="scale-110" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-3 select-none">
                  Command Center Settings
                </h1>
                <p className="text-sm text-stone-400 mt-1 font-sans">
                  Customize AI mock pacing, telemetry settings, target thresholds, and alert configurations.
                </p>
              </div>
            </div>
            <div>
              <button
                id="save-settings-btn"
                onClick={handleSave}
                disabled={savingState !== "idle"}
                className="interactive wavy-blue-btn px-4 py-1.5 font-bold font-mono min-w-[110px] text-[10px] flex items-center justify-center gap-1.5 text-white"
              >
                {savingState === "saving" ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Syncing...
                  </>
                ) : savingState === "saved" ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <style>{`
                        @keyframes check-pop {
                          0% { transform: scale(0.8); opacity: 0.5; }
                          50% { transform: scale(1.15); opacity: 1; }
                          100% { transform: scale(1); opacity: 1; }
                        }
                        .anim-check-pop {
                          animation: check-pop 0.3s ease-out forwards;
                          transform-origin: center;
                        }
                      `}</style>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="anim-check-pop" />
                    </svg>
                    Synced
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <style>{`
                        @keyframes hud-btn-spin {
                          from { transform: rotate(0deg); }
                          to { transform: rotate(360deg); }
                        }
                        @keyframes hud-btn-pulse {
                          0%, 100% { transform: scale(0.85); opacity: 0.6; }
                          50% { transform: scale(1.15); opacity: 1; }
                        }
                        .anim-hud-ring {
                          animation: hud-btn-spin 6s linear infinite;
                          transform-origin: center;
                        }
                        .anim-hud-core {
                          animation: hud-btn-pulse 1.6s ease-in-out infinite;
                          transform-origin: center;
                        }
                      `}</style>
                      <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="4 3" className="anim-hud-ring" />
                      <circle cx="12" cy="12" r="3.5" fill="currentColor" className="anim-hud-core" />
                    </svg>
                    Sync Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 pb-4 mb-6 border-b border-orange-500/10 overflow-x-auto no-scrollbar select-none">
            {[
              { id: "coach", label: "AI Interview Coach", Icon: AiCoachIcon },
              { id: "targets", label: "Career & Targets", Icon: OpportunityRadarIcon },
              { id: "system", label: "System Preferences", Icon: ConcentricGaugeIcon },
            ].map(tab => {
              const TabIcon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  id={`settings-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold classy-vintage transition-all border whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
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

          {/* Settings Grid Content */}
          <div className="fade-in">
            {activeTab === "coach" && (
              <div className="flex flex-col gap-6">
                {/* Voice Selection */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CardIconShell className="p-1">
                      <VoiceWaveformIcon className="scale-75" />
                    </CardIconShell>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        AI COACH VOICE PROFILE
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 font-sans">
                        Select which speaking profile you want the neural coach model to interact with during mocks.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {COACH_VOICES.map(voice => (
                      <div
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 select-none option-card ${
                          selectedVoice === voice.id
                            ? "bg-orange-500/5 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.22)] scale-[1.01]"
                            : "bg-[#181615] border-stone-850 text-stone-400 hover:text-stone-300"
                        }`}
                        style={{ borderColor: selectedVoice === voice.id ? "#f97316" : "#292524" }}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold font-mono ${selectedVoice === voice.id ? "text-orange-300" : "text-stone-450"}`}>
                            {voice.name}
                          </span>
                          {selectedVoice === voice.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 leading-normal font-sans">
                          {voice.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Range Sliders */}
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b border-orange-500/5 pb-3">
                    <CardIconShell className="p-1">
                      <SpeechCoherenceIcon className="scale-75" />
                    </CardIconShell>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Speech & Evaluation Parameters
                    </h3>
                  </div>

                  {/* Speed Parameter */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-300">Speaking Pacing Rate</span>
                      <span className="text-orange-300 font-bold">{coachSpeed}% (Normal)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-stone-500 font-mono">Slow</span>
                      <input
                        id="coach-speed-range"
                        type="range"
                        min="80"
                        max="130"
                        value={coachSpeed}
                        onChange={(e) => setCoachSpeed(Number(e.target.value))}
                        className="flex-1 accent-orange-500 h-1 rounded bg-[#2e2a27] outline-none"
                      />
                      <span className="text-[10px] text-stone-500 font-mono">Fast</span>
                    </div>
                  </div>

                  {/* Toggle Parameters */}
                  <div className="flex items-center justify-between py-3 border-t border-orange-400/5 mt-2">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">STRICT CRITIQUE MODE</p>
                      <p className="text-[11px] text-stone-400 mt-1 font-sans">
                        When active, the AI evaluator screens heavily for filler words (um, ah, like) and pacing gaps.
                      </p>
                    </div>
                    <div
                      id="strict-feedback-toggle"
                      onClick={() => setStrictFeedback(!strictFeedback)}
                      className={`toggle-switch ${strictFeedback ? "active" : ""}`}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "targets" && (
              <div className="flex flex-col gap-6">
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-5">
                  <div className="flex items-center gap-3 border-b border-orange-500/5 pb-3">
                    <CardIconShell className="p-1">
                      <RocketGrowthIcon className="scale-75" />
                    </CardIconShell>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Career Goals & Target Runways
                    </h3>
                  </div>

                  {/* Track Selection */}
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-stone-400 font-mono">TARGET CAREER PATHWAY</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { id: "Software Engineer", icon: "code" },
                          { id: "Product Manager", icon: "assignment" },
                          { id: "Data Analyst", icon: "analytics" },
                          { id: "UX Designer", icon: "palette" },
                          { id: "Hardware Engineer", icon: "memory" }
                        ].map(track => (
                          <div
                            key={track.id}
                            id={`track-${track.id.replace(/\s+/g, "-")}`}
                            onClick={() => setTargetTrack(track.id)}
                            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-2.5 select-none option-card ${
                              targetTrack === track.id
                                ? "bg-orange-500/5 text-white shadow-[0_0_12px_rgba(249,115,22,0.22)] scale-[1.02]"
                                : "bg-[#181615] text-stone-400 hover:text-stone-300"
                            }`}
                            style={{ borderColor: targetTrack === track.id ? "#f97316" : "#292524" }}
                          >
                            <span className="material-symbols-outlined text-lg">{track.icon}</span>
                            <span className="text-[11px] font-bold font-mono">{track.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <label className="text-[11px] font-bold text-stone-400 font-mono">TARGET INDUSTRIES / COs</label>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        {[
                          { id: "FAANG & High Growth Tech", label: "FAANG & Tech", desc: "Google, Meta, Stripe", icon: "rocket_launch" },
                          { id: "Fintech & High Frequency Trading", label: "Fintech & HFT", desc: "Jane St, Stripe, Plaid", icon: "currency_exchange" },
                          { id: "Venture Backed Early Startups", label: "Early Startups", desc: "Y-Combinator seed stage", icon: "explore" },
                          { id: "Consulting & Agencies", label: "Consulting", desc: "McKinsey, Accenture", icon: "corporate_fare" }
                        ].map(ind => (
                          <div
                            key={ind.id}
                            id={`industry-${ind.id.replace(/\s+/g, "-")}`}
                            onClick={() => setTargetIndustry(ind.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 select-none option-card ${
                              targetIndustry === ind.id
                                ? "bg-orange-500/5 text-white shadow-[0_0_12px_rgba(249,115,22,0.22)] scale-[1.02]"
                                : "bg-[#181615] text-stone-400 hover:text-stone-300"
                            }`}
                            style={{ borderColor: targetIndustry === ind.id ? "#f97316" : "#292524" }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">{ind.icon}</span>
                              <span className="text-[11px] font-bold font-mono">{ind.label}</span>
                            </div>
                            <span className="text-[9px] text-stone-500 block leading-tight">{ind.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ATS Threshold slider */}
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-orange-400/5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-300">Target ATS Match Score (Threshold)</span>
                      <span className="text-orange-300 font-bold">{atsThreshold}% match</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-stone-500 font-mono">70%</span>
                      <input
                        id="ats-threshold-range"
                        type="range"
                        min="70"
                        max="95"
                        value={atsThreshold}
                        onChange={(e) => setAtsThreshold(Number(e.target.value))}
                        className="flex-1 accent-orange-500 h-1 rounded bg-[#2e2a27] outline-none"
                      />
                      <span className="text-[10px] text-stone-500 font-mono">95%</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-sans mt-0.5 leading-normal">
                      The analyzer flags matches below this threshold. Targeting 85% is ideal for ATS screening.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="flex flex-col gap-6">
                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-orange-500/5 pb-3">
                    <CardIconShell className="p-1">
                      <UpcomingSessionIcon className="scale-75" />
                    </CardIconShell>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      System Notifications & Preferences
                    </h3>
                  </div>

                  {/* Toggle match alerts */}
                  <div className="flex items-center justify-between py-3 border-b border-orange-400/5">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">REALTIME INTERNSHIP MATCH ALERTS</p>
                      <p className="text-[11px] text-stone-400 mt-1 font-sans">
                        Trigger dashboard alerts immediately when a new matching opening crosses your score target.
                      </p>
                    </div>
                    <div
                      id="match-alerts-toggle"
                      onClick={() => setMatchAlerts(!matchAlerts)}
                      className={`toggle-switch ${matchAlerts ? "active" : ""}`}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>

                  {/* Toggle weekly digest */}
                  <div className="flex items-center justify-between py-3 border-b border-orange-400/5">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">WEEKLY COACH REPORT BY EMAIL</p>
                      <p className="text-[11px] text-stone-400 mt-1 font-sans">
                        Send a summary report detailing your practice hours, streak info, and score improvements.
                      </p>
                    </div>
                    <div
                      id="weekly-digest-toggle"
                      onClick={() => setWeeklyDigest(!weeklyDigest)}
                      className={`toggle-switch ${weeklyDigest ? "active" : ""}`}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>

                  {/* Toggle telemetry sync */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">NEURAL TELEMETRY SYNC (SECURE)</p>
                      <p className="text-[11px] text-stone-400 mt-1 font-sans">
                        Securely stream anonymous interview evaluation metrics back to base to optimize feedback accuracy.
                      </p>
                    </div>
                    <div
                      id="telemetry-sync-toggle"
                      onClick={() => setTelemetrySync(!telemetrySync)}
                      className={`toggle-switch ${telemetrySync ? "active" : ""}`}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>
                </div>

                <div className="soft-card p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-orange-500/5 pb-3">
                    <CardIconShell className="p-1">
                      <SkillsConstellationIcon className="scale-75" />
                    </CardIconShell>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      App Theme Config
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-stone-400 font-mono">DASHBOARD COLORWAY</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      {[
                        { id: "amber-dark", label: "Amber Dark (Default)", preview: "border-orange-500 bg-orange-500/5 text-orange-400" },
                        { id: "stealth-midnight", label: "Stealth Midnight", preview: "border-stone-800 bg-stone-900/40 text-stone-300" },
                      ].map(theme => (
                        <div
                          key={theme.id}
                          id={`theme-${theme.id}`}
                          onClick={() => setThemeMode(theme.id)}
                          className={`p-3 rounded-xl border text-[11px] font-bold font-mono cursor-pointer select-none text-center transition-all option-card`}
                          style={{
                            borderColor: themeMode === theme.id ? "#f97316" : "#292524",
                            background: themeMode === theme.id ? "rgba(249,115,22,0.05)" : "#181615",
                            color: themeMode === theme.id ? "#fdba74" : "#a8a29e"
                          }}
                        >
                          {theme.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
