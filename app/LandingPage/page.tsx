"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GridBackgroundDemo from "../Background/page";
import { CanvasText } from "@/components/CanvasText";
import { InfiniteMovingCards } from "@/components/Infinite_moving";
import { MaskContainer } from "@/components/svg-mask";

export default function Page() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const items = [
    {
      quote: "Smart Resume Analyzer",
      name: "Upload your resume and instantly see what to improve, what to cut, and how to make it stronger for real hiring systems.",
      title: "Career Foundation",
    },
    {
      quote: "Internship Match Agent",
      name: "Get matched with internships that fit your profile, goals, and current skill level â€” without endless searching.",
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
        <GridBackgroundDemo />

        <div
          className="cursor-glow"
          style={{
            transform: `translate3d(${mousePosition.x - 130}px, ${mousePosition.y - 130}px, 0)`,
          }}
        />
        <div className="relative z-20">
          <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-stone-950/80 backdrop-blur-md border-b border-stone-800 flex items-center px-6 justify-between">
            <div className="flex items-center gap-8">
              <span className="text-xl font-black text-white tracking-tighter">KareerPilot</span>
              <div className="hidden md:flex items-center gap-6">
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/Dashboard">Dashboard</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/MockInterview">Practice</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/ResumeAnalyzer">Resume</Link>
                <Link className="text-stone-400 hover:text-white transition-colors font-body-md text-body-md" href="/Progress">Progress</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="px-6 py-2 bg-stone-900 text-white rounded-lg font-label-md text-label-md hover:bg-stone-800 transition-all active:scale-95">Sign In</Link>
              <Link
                href="/MockInterview"
                className="interactive primary-blue px-6 py-2 rounded-lg font-label-md text-label-md shadow-lg"
              >
                Start Interview
              </Link>
            </div>
          </nav>

          <main className=" relative z-20">

            {/* Hero Section */}
            <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-6">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-500/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-orange-400/10 rounded-full blur-[140px]"></div>
              </div>
              <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-orange-300 font-label-md text-label-md">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                  <span>Revolutionizing Career Prep with Generative AI</span>
                </div>
                <h1 className="font-headline-lg text-[64px] leading-[1.1] tracking-tighter text-transparent [-webkit-text-stroke:2px_white] [-webkit-text-fill-color:transparent]">
                  Master your next interview <br />

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
                <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                  Experience hyper-realistic interview simulations tailored to your industry. Get instant, actionable feedback and close your skill gaps with Lumina&apos;s proprietary training engine.
                </p>

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
            </section>

            {/* Features Bento Grid */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/Dashboard"
                className="interactive primary-blue w-full md:w-auto px-10 py-4 rounded-xl shadow-xl text-center font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                href="/MockInterview"
                className="w-full md:w-auto px-10 py-4 font-headline-md text-body-lg rounded-xl border hover:bg-surface-variant transition-all text-center"
                style={{ borderColor: "#f97316", color: "#fdba74" }}
              >
                View Demo
              </Link>
            </div>
            <section className="py-24 px-6 max-w-7xl mx-auto">
              <div className="mb-16 text-center space-y-4">
                <h2 className="font-headline-lg text-white">Engineered for Success</h2>
                <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">
                  Our multi-layered AI approach simulates realistic scenarios while providing depth that traditional coaching can&apos;t match.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                <div className="md:col-span-7 bg-[#151312] rounded-3xl p-10 border border-orange-400/25 shadow-[0_0_0_1px_rgba(251,146,60,0.06)] flex flex-col justify-between group overflow-hidden relative">
                  <div className="relative z-10 space-y-4">
                    <span className="material-symbols-outlined text-orange-400 text-4xl">psychology</span>
                    <h3 className="font-headline-md text-white">Emotional Intelligence Analysis</h3>
                    <p className="font-body-md text-on-surface-variant max-w-sm">
                      Our AI monitors your tone, pace, and facial expressions to provide a holistic view of your professional presence.
                    </p>
                  </div>
                  <div className="relative z-10 pt-8">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-full text-xs font-label-md">
                        Real-time
                      </span>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-label-md">
                        Linguistics
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-2/3 h-2/3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      data-alt="A complex data visualization map with interconnected nodes and glowing pathways, representing neural networks and artificial intelligence processing. The color palette features deep ambers and dark rose tones on a pitch-black background, echoing the Lumina Modern design system's aesthetic of professional tech-focused sophistication."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVDu605Ug2GjFG81IgrmsIvb5OMTuUjSqugt7Tk-Jup8roRxmwIAcMVNOAL7lvuSUPK5wS6ShP-B-ESxM4FgTp_A2g6kl3wS6lsGJPwDHnXDd8bmeykcnpB0EZPq3t1Fi7ffoX8DYdolDcTJ1eCLd0_gA9A7sB-qiKIn1InjjkQ1ve1tVw4K35pbyMm9Ymw9YCoi3XovGshPZptkFUbTZo9g6iV0Oxgsl7v1Plz5OSzS2DNappA9NRmmabEJhYhs-HuOLmxZCZf7SM"
                      alt=""
                    />
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-rows-2 gap-6">
                  <div className="bg-[#181615] rounded-3xl p-8 border border-orange-400/25 shadow-[0_0_0_1px_rgba(251,146,60,0.05)] flex flex-col justify-center space-y-4">   <span className="material-symbols-outlined text-orange-400 text-3xl">terminal</span>
                    <h4 className="font-headline-md text-white text-lg">Industry-Specific Scenarios</h4>
                    <p className="font-body-md text-on-surface-variant">
                      From FAANG coding rounds to Wall Street case studies, we have 500+ specialized tracks.
                    </p>
                  </div>
                  <div className="bg-[#181615] rounded-3xl p-8 border border-orange-400/25 shadow-[0_0_0_1px_rgba(251,146,60,0.05)] flex flex-col justify-center space-y-4 relative overflow-hidden">  <span className="material-symbols-outlined text-orange-400 text-3xl">auto_graph</span>
                    <h4 className="font-headline-md text-white text-lg">Progressive Analytics</h4>
                    <p className="font-body-md text-on-surface-variant">
                      Watch your &quot;Readiness Score&quot; climb as you refine your technique across multiple sessions.
                    </p>
                    <div className="absolute right-0 bottom-0 p-4">
                      <span className="text-6xl font-black text-white/5 tracking-tighter">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Success Stories */}
            <section className="py-24 bg-surface-container-lowest">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                  <div className="space-y-4">
                    <h2 className="font-headline-lg text-white">Proven Results</h2>
                    <p className="font-body-md text-on-surface-variant">
                      Join 10,000+ professionals who landed their dream roles.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-surface-container border border-orange-500/20 rounded-full hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <button className="p-3 bg-orange-500 text-white rounded-full hover:brightness-110 transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      quote:
                        `"The AI's ability to catch my 'filler words' and suggest better structured answers was the turning point in my Google interview preparation."`,
                      name: "David Chen",
                      role: "Software Engineer @ Google",
                      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoFYOiPZuzcLDoeN8QqqbtFDFafdP-RJ6cGNArVFLFb9i3CVfui7UZp5Ayb9xOyTsuMTUrthQA-uzqqQD6H0SaQSK3_NH9CBkMS0ck0yz4JIOzjfDCg_Fct719_qQWkY3gphIouT97FyjrAE3OY4zPadr1q9oGyrWq6Qyz_941K3nWngV6L2CBOth31xblCSRj0D7meVpt7oXFyKud6cOnpS6Ity4XZp46cuxPr51PLUMedMVZRjUv_KQHihLX1RXi-2UWvWPKhziX",
                    },
                    {
                      quote:
                        `"I felt so much more confident during my interviews. The personalized feedback gave me specific points to improve on that I hadn't even noticed."`,
                      name: "Sarah Jenkins",
                      role: "Product Manager @ Stripe",
                      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLisohwXI316eQn_E141PPb29-txQKuxtC-iK7GtNQs8GrwughrKbO_IDwsmmoIiaWHzs1C5f_MG4pAlT2-5sILIEnpvumgyOrgUJVBg_TxAmI0xMEPkOZY4slxtTbeFPUzdrpuyJbqBJWJT2hqRW4j0QRi9j2kmZphtmpmgzCBSAbFtuen6pZTaQ_am4L6A48a7_b0ynFRNuEyOEQgjHz-YGEafIMrBQGAR9nbYprYSLjC8jaFYufHBBYAZ2uUwAobl-pDSvL9_yw",
                    },
                    {
                      quote:
                        `"The industry-specific mocks are terrifyingly accurate. It felt exactly like the real thing, which made the actual interview feel like a breeze."`,
                      name: "Marcus Thorne",
                      role: "Senior Analyst @ Goldman Sachs",
                      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvDdVjrSCkHe3CZNlBpkgsb3k1ldXwNZxjDtLqJA9OHUpcr_0RezqbHwGuUPI5tnma4zlfRAvespGer97YYI1aUs8AqFYzS0RG308dxPmtuykHL7nWdn9yYebR9oS7oC-JUPQZqj_aqnIe-foQ3l9lgP1l9aQnFXMExFzzgQj-py6GzOzFEApXO7YZ5vMmbMviAV-SNaMbkjdqFJ9fHmiKE5eyH8sjkr0FrNS27viXu0dEXdSz-3L_RmIXvmyBDu7uyIQq2Gaztbbs",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#161413] p-8 rounded-3xl border border-orange-400/25 shadow-[0_0_0_1px_rgba(251,146,60,0.05)] space-y-6"  >
                      <div className="flex gap-1 text-orange-400">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="font-body-lg text-white italic">{item.quote}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant">
                          <img className="w-full h-full object-cover" src={item.img} alt="" />
                        </div>
                        <div>
                          <p className="font-headline-md text-sm text-white">{item.name}</p>
                          <p className="font-label-md text-on-surface-variant">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 overflow-hidden relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/20 rounded-full blur-[160px] z-0"></div>
              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                <h2 className="font-headline-lg text-5xl md:text-6xl text-white tracking-tight">
                  Ready to land your <span className="text-orange-400 underline decoration-orange-500/30 underline-offset-8">dream offer?</span>
                </h2>
                <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                  Start practicing today with our AI-driven platform. No credit card required to start your first session.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/Dashboard"
                    className="interactive primary-blue w-full sm:w-auto px-12 py-5 rounded-full text-center font-semibold"
                  >
                    Create Your Free Account
                  </Link>
                  <Link
                    href="/MockInterview"
                    className="w-full sm:w-auto px-12 py-5 bg-white/5 font-headline-md text-lg rounded-full border hover:bg-white/10 transition-all backdrop-blur-md text-center"
                    style={{ borderColor: "#f97316", color: "#fdba74" }}
                  >
                    Talk to an Expert
                  </Link>
                </div>
                <div className="pt-12 flex items-center justify-center gap-8 grayscale opacity-50">
                  <span className="font-headline-md text-white text-xl">TRUSTED BY</span>
                  <div className="flex gap-8 items-center">
                    <span className="material-symbols-outlined text-4xl">domain</span>
                    <span className="material-symbols-outlined text-4xl">apartment</span>
                    <span className="material-symbols-outlined text-4xl">corporate_fare</span>
                    <span className="material-symbols-outlined text-4xl">business</span>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="bg-stone-950 border-t border-stone-900 py-12 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                  <Link href="/" className="text-2xl font-black text-white tracking-tighter">KareerPilot</Link>
                  <p className="font-body-md text-stone-500">
                    Empowering the next generation of global talent through hyper-realistic AI simulation.
                  </p>
                </div>
                <div className="space-y-4">
                  <h5 className="text-white font-headline-md text-sm uppercase tracking-widest">Product</h5>
                  <ul className="space-y-2">
                    <li><Link className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="/Dashboard">Dashboard</Link></li>
                    <li><Link className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="/MockInterview">Mock Interview</Link></li>
                    <li><Link className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="/ResumeAnalyzer">Resume Analyzer</Link></li>
                    <li><Link className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="/Progress">Progress</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-white font-headline-md text-sm uppercase tracking-widest">Resources</h5>
                  <ul className="space-y-2">
                    <li><a className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="#">Interview Guides</a></li>
                    <li><a className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="#">AI Insights</a></li>
                    <li><a className="text-stone-500 hover:text-orange-300 transition-colors text-body-md" href="#">Case Studies</a></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-white font-headline-md text-sm uppercase tracking-widest">Connect</h5>
                  <div className="flex gap-4">
                    <a className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-stone-400 hover:text-white transition-all" href="#">
                      <span className="material-symbols-outlined text-[20px]">public</span>
                    </a>
                    <a className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-stone-400 hover:text-white transition-all" href="#">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </a>
                    <a className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-stone-400 hover:text-white transition-all" href="#">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="font-inter text-xs text-stone-500">© 2025 KareerPilot. AI-powered career coaching for college students.</p>
                <div className="flex gap-6">
                  <a className="text-stone-500 hover:text-stone-300 transition-colors text-xs hover:underline" href="#">
                    Privacy Policy
                  </a>
                  <a className="text-stone-500 hover:text-stone-300 transition-colors text-xs hover:underline" href="#">
                    Terms of Service
                  </a>
                  <a className="text-stone-500 hover:text-stone-300 transition-colors text-xs hover:underline" href="#">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
