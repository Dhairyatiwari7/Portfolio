import React, { useState, useEffect } from "react";
import {
  Terminal,
  Sparkles,
  FolderCode,
  GraduationCap,
  Server,
  Mail,
  Bot,
  FileDown,
  Rocket,
  Layers,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import ThreeDBackground from "./components/ThreeDBackground";
import AboutTimeline from "./components/AboutTimeline";
import ProjectsGrid from "./components/ProjectsGrid";
import SkillsGrid from "./components/SkillsGrid";
import ContactForm from "./components/ContactForm";
import RecruiterDashboard from "./components/RecruiterDashboard";
import ResumePreview from "./components/ResumePreview";
import AiAssistant from "./components/AiAssistant";
import { TabType } from "./types";
import { resumeData } from "./resumeData";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isStereo3D, setIsStereo3D] = useState<boolean>(true);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });
  const [globalTilt, setGlobalTilt] = useState({ rx: 4, ry: -4 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleGlobalMouse = (e: MouseEvent) => {
      if (!isStereo3D) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setGlobalTilt({
        rx: 5 - y * 12,
        ry: -5 + x * 12,
      });
    };
    window.addEventListener("mousemove", handleGlobalMouse);
    return () => window.removeEventListener("mousemove", handleGlobalMouse);
  }, [isStereo3D]);

  const handleHeroCardMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ry = -(x / rect.width - 0.5) * 24;
    const rx = (y / rect.height - 0.5) * 24;
    setCardTilt({ rx, ry });
  };

  const handleHeroCardLeave = () => setCardTilt({ rx: 0, ry: 0 });

  const navigationItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "home", label: "Home", icon: <Rocket className="w-4 h-4 md:w-3.5 md:h-3.5" /> },
    {
      id: "about",
      label: "Experience",
      icon: <GraduationCap className="w-4 h-4 md:w-3.5 md:h-3.5" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderCode className="w-4 h-4 md:w-3.5 md:h-3.5" />,
    },
    { id: "skills", label: "Skills", icon: <Server className="w-4 h-4 md:w-3.5 md:h-3.5" /> },
    { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4 md:w-3.5 md:h-3.5" /> },
  ];

  return (
    <div
      id="app-root-container"
      className="min-h-screen text-slate-100 flex flex-col relative bg-[#090b11] select-none transition-colors duration-500"
    >
      <ThreeDBackground />
      <AiAssistant />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-[#0c0e17]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[64px] md:h-[58px] flex items-center justify-between gap-4 relative">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-[38px] h-[38px] md:w-[34px] md:h-[34px] shrink-0">
                <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-blue-500/20 to-slate-400/20 opacity-40" />
                <div className="absolute inset-[1px] rounded-[8px] bg-[#0c0e17] flex items-center justify-center border border-slate-700/30">
                  <span className="text-[12px] md:text-[11px] font-black text-slate-300 tracking-tight leading-none">
                    DT
                  </span>
                </div>
              </div>
              <div className="leading-none">
                <p className="text-[15px] md:text-[13px] font-semibold text-[#dde0e8] tracking-tight">
                  {resumeData.name}
                </p>
              </div>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-[3px] p-[4px] rounded-[13px] bg-slate-900/60 border border-slate-800/60">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative flex items-center gap-[7px] px-3.5 py-[7px] rounded-[9px]
                    text-[11.5px] font-medium tracking-[0.1px] transition-all duration-150
                    border cursor-pointer whitespace-nowrap
                    ${
                      activeTab === item.id
                        ? "bg-slate-700/40 text-blue-300 border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-blue-400 opacity-90" />
                  )}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsStereo3D(!isStereo3D)}
                title="Toggle 3D depth"
                className={`
                  hidden sm:flex items-center gap-[6px] px-3 py-[6px] rounded-full
                  text-[10px] font-mono tracking-[0.4px] transition-all duration-200
                  border cursor-pointer
                  ${
                    isStereo3D
                      ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
                      : "text-slate-500 border-slate-800 hover:text-slate-400"
                  }
                `}
              >
                <span
                  className={`w-[6px] h-[6px] rounded-full transition-colors ${isStereo3D ? "bg-blue-400 animate-pulse" : "bg-slate-700"}`}
                />
                3D
              </button>

              <a
                href="https://drive.google.com/file/d/1mDShysijBFIuatY-3u-wi11GSnSpmIAj/view"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-[6px] px-3.5 py-[7px] rounded-[9px]
                  text-[11px] font-semibold tracking-[0.1px]
                  bg-slate-800 border border-slate-700
                  text-slate-200 hover:text-white hover:bg-slate-700
                  hover:border-slate-500 transition-all duration-150 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Resume</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex flex-col gap-[6px] p-2 cursor-pointer bg-slate-800/50 rounded-lg border border-slate-700/50 active:bg-slate-700/50"
                onClick={() => setMobileMenuOpen((p) => !p)}
                aria-label="Open menu"
              >
                <span
                  className={`block w-5 h-[1.5px] bg-slate-300 transition-transform duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-slate-300 transition-opacity duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-slate-300 transition-transform duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-b border-slate-800 bg-[#0c0e17]/95 backdrop-blur-2xl px-4 py-4 flex flex-col gap-2 shadow-2xl">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-[15px] font-medium transition-all border cursor-pointer ${
                  activeTab === item.id
                    ? "bg-slate-800/80 border-slate-700 text-blue-300 shadow-inner"
                    : "border-transparent text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <a
              href="https://drive.google.com/file/d/1mDShysijBFIuatY-3u-wi11GSnSpmIAj/view"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex justify-center items-center gap-2 w-full px-5 py-4 rounded-xl text-[15px] font-bold tracking-[0.1px] bg-blue-600/10 border border-blue-500/30 text-blue-400 active:bg-blue-600/20 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-30 transition-transform duration-500 ease-out"
        style={{
          transform: isStereo3D
            ? `perspective(1200px) rotateX(${globalTilt.rx}deg) rotateY(${globalTilt.ry}deg)`
            : "none",
        }}
      >
        {activeTab === "home" && (
          <div className="space-y-12 sm:space-y-16 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/50 rounded-full px-4 py-1.5 text-[11px] sm:text-xs text-blue-300 font-mono shadow-[0_2px_10px_rgba(59,130,246,0.05)] mx-auto sm:mx-0">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-blue-400" />
                  <span>OPEN TO NEW OPPORTUNITIES</span>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black text-slate-100 tracking-tight leading-[1.1] uppercase">
                    Engineering <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-blue-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(59,130,246,0.1)] block mt-1 sm:mt-2">
                      Intelligent, Scalable Systems
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-sans max-w-xl mx-auto sm:mx-0">
                    I engineer high-performance web applications and intelligent data pipelines. By bridging modern full-stack infrastructure with advanced machine learning, I build software that scales seamlessly from initial concept to production deployment.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="w-full sm:w-auto justify-center relative group bg-slate-200 hover:bg-white text-slate-950 font-sans text-sm sm:text-base font-black py-4 sm:py-3 px-6 sm:px-8 rounded-xl flex items-center gap-2 border-b-4 border-slate-400 active:border-b-0 active:translate-y-[4px] shadow-[0_6px_25px_rgba(255,255,255,0.05)] transition-all cursor-pointer"
                  >
                    <span>Initiate Contact</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveTab("projects")}
                    className="w-full sm:w-auto justify-center bg-[#0e111a] hover:bg-[#141824] text-slate-300 font-mono text-sm sm:text-xs py-4 sm:py-3 px-6 sm:px-5 rounded-xl border border-slate-800 border-b-4 border-b-[#0a0d14] active:border-b-0 active:translate-y-[4px] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FolderCode className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>View Engineering Portfolio</span>
                  </button>
                </div>
              </div>

              {/* Right Column – Interactive 3D Card (Steel Blue Theme) */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  onMouseMove={handleHeroCardMouse}
                  onMouseLeave={handleHeroCardLeave}
                  className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-700/40 via-[#101424] to-[#090b11] p-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-transform duration-150 ease-out cursor-crosshair"
                  style={{
                    transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) translateZ(10px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 duration-500" />
                  <div className="p-5 sm:p-6 bg-[#0c0f19]/95 rounded-2xl space-y-6 relative z-10 border border-slate-800/80">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 font-mono text-[11px] sm:text-[10px] text-slate-400">
                        <Terminal className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-pulse text-blue-400" />
                        <span>developer_profile.exe</span>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500/70 animate-ping" />
                    </div>

                    <div
                      className="space-y-4 font-mono text-[13px] sm:text-xs text-slate-300"
                      style={{ transform: "translateZ(25px)" }}
                    >
                      <div className="text-slate-500 text-xs sm:text-[11px]">
                        // Core Engineering Competencies
                      </div>
                      {[
                        { n: "1", t: "Full-Stack: Next.js, Node.js, TS" },
                        { n: "2", t: "Backend: Scalable API Microservices" },
                        { n: "3", t: "ML: PyTorch & Hybrid Recommendation Engines" },
                        { n: "4", t: "Cloud: Agile CI/CD Pipeline Automation" },
                      ].map((row) => (
                        <div
                          key={row.n}
                          className="flex items-start gap-3 sm:gap-2 border-l-2 border-slate-800 pl-3 sm:pl-2 hover:border-blue-500/50 transition-colors"
                        >
                          <span className="text-blue-400 font-bold mt-0.5 sm:mt-0">
                            {row.n}
                          </span>
                          <span className="leading-snug">{row.t}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="pt-4 border-t border-slate-800 space-y-3"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      <span className="text-[10px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-mono block">
                        Verified Credentials:
                      </span>
                      <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-blue-400" />
                          <span className="text-[12px] sm:text-[11px] text-slate-300 font-medium">
                            VIT Chennai '27
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono font-bold bg-[#090b11] border border-slate-800 py-1 sm:py-0.5 px-2 rounded">
                          Hackathon Winner
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid (Teal/Slate and Steel/Blue Tones) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-10 border-t border-slate-900">
              {/* Full-Stack Capability Card */}
              <div className="bg-[#0b0e17]/80 border border-slate-800/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-teal-500/30 hover:bg-[#0f1320] transition-all duration-300 relative overflow-hidden shadow-[inset_0_2px_15px_rgba(20,180,180,0.01)] border-b-4 border-b-slate-950">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <h4 className="text-base sm:text-sm font-bold sm:font-semibold text-slate-200 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-teal-400" />
                    Production-Ready Full Stack
                  </h4>
                  <p className="text-[13px] sm:text-xs text-slate-400 mt-3 sm:mt-2 leading-relaxed">
                    Focused on building resilient, user-centric applications. I design normalized database schemas, implement secure multi-layered authentication, and optimize frontend architecture for maximum performance.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("projects")}
                  className="text-[13px] sm:text-xs text-slate-400 font-mono mt-6 sm:mt-4 flex items-center gap-2 sm:gap-1 hover:text-teal-300 w-fit transition-transform hover:translate-x-1 cursor-pointer"
                >
                  <span>Verify Work Showroom</span>
                  <span>→</span>
                </button>
              </div>

              {/* AI & ML Card */}
              <div className="bg-[#0b0e17]/80 border border-slate-800/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-blue-500/30 hover:bg-[#0f1320] transition-all duration-300 relative overflow-hidden shadow-[inset_0_2px_15px_rgba(59,130,246,0.01)] border-b-4 border-b-slate-950">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <h4 className="text-base sm:text-sm font-bold sm:font-semibold text-slate-200 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400" />
                    Applied Machine Learning
                  </h4>
                  <p className="text-[13px] sm:text-xs text-slate-400 mt-3 sm:mt-2 leading-relaxed">
                    I don't just train models; I integrate them. From deploying lightweight REST prediction endpoints to crafting complex diagnostic pipelines, I turn raw data algorithms into highly actionable, consumer-facing features.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("skills")}
                  className="text-[13px] sm:text-xs text-slate-400 font-mono mt-6 sm:mt-4 flex items-center gap-2 sm:gap-1 hover:text-blue-300 w-fit transition-transform hover:translate-x-1 cursor-pointer"
                >
                  <span>Inspect Capability Matrix</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Soft Charcoal/Blue AI Banner */}
            <div className="p-6 sm:p-4 bg-[#0d111c] border border-slate-800/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 border-b-4 border-b-[#080a12] transform sm:hover:scale-[1.005] duration-200 shadow-xl text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
                <div className="w-12 h-12 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                  <Bot className="w-6 h-6 sm:w-4 sm:h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-[15px] sm:text-xs font-bold sm:font-semibold text-slate-200">
                    Recruiter Fast-Track: Ask the AI
                  </h4>
                  <p className="text-[13px] sm:text-[11px] text-slate-400 leading-normal mt-1 sm:mt-0.5 px-4 sm:px-0">
                    Skip the standard screening. The embedded AI Envoy is trained directly on my engineering stack, architectural decisions, and project history.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const btn = document.getElementById("chat-toggle-btn");
                  if (btn) btn.click();
                }}
                className="w-full sm:w-auto justify-center text-[13px] sm:text-[11px] font-mono text-blue-300 hover:text-blue-200 bg-slate-900 border border-slate-800 hover:border-slate-700 px-5 sm:px-3.5 py-3 sm:py-1.5 rounded-xl sm:rounded-lg shrink-0 flex items-center gap-2 border-b-2 font-bold cursor-pointer transition-all active:translate-y-[1px]"
              >
                <span>Launch Interactive Envoy</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "about" && <AboutTimeline />}
        {activeTab === "projects" && <ProjectsGrid />}
        {activeTab === "skills" && <SkillsGrid />}
        {activeTab === "contact" && (
          <div className="space-y-12">
            <ContactForm />
            <div className="border-t border-slate-900 pt-10">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 p-6 sm:p-4 bg-[#0b0e17] border border-slate-800 rounded-2xl border-b-4 border-b-slate-950 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
                  <div className="w-12 h-12 sm:w-8 sm:h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                    <Layers className="w-6 h-6 sm:w-4 sm:h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-[15px] sm:text-xs font-bold text-slate-200">
                      Prefer an interactive readable document copy?
                    </h4>
                    <p className="text-[13px] sm:text-[10px] text-slate-400 mt-1 sm:mt-0.5">
                      Open the beautifully rendered, printable resume sheet to
                      inspect or trigger custom browser prints.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("resume-view")}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-sans text-sm sm:text-xs font-semibold py-3 sm:py-2 px-6 sm:px-4 rounded-xl transition duration-200 shrink-0 border-b-2 border-b-slate-950 active:translate-y-[1.5px] cursor-pointer"
                >
                  View Printable Resume
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "dashboard" && <RecruiterDashboard />}
        {activeTab === "resume-view" && <ResumePreview />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800/60 bg-[#030712] py-10 sm:py-8 mt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-4 text-xs font-medium tracking-wide text-slate-400">
          {/* Left Section: Branding & Identity */}
          <div className="flex flex-col items-center md:items-start gap-2 sm:gap-1 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 text-sm sm:text-xs">
                Dhairya Tiwari
              </span>
              <span className="text-slate-600 text-[10px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 font-mono">
                v1.0.0
              </span>
            </div>
            <p className="text-[12px] sm:text-[11px] text-slate-500 font-normal">
              Full-Stack &amp; ML Engineer • VIT Chennai &apos;27
            </p>
          </div>

          {/* Center/Right Section: Professional Navigation & Stack Info */}
          <div className="flex flex-col flex-wrap sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[12px] sm:text-[11px]">
            <div className="flex gap-6 sm:gap-4 font-mono text-slate-400 sm:text-slate-500">
              <a
                href="https://github.com/Dhairyatiwari7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors duration-200 p-2 sm:p-0"
              >
                github
              </a>
              <a
                href="https://www.linkedin.com/in/dhairya-tiwari7/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors duration-200 p-2 sm:p-0"
              >
                linkedin
              </a>
              <a
                href="mailto:dhairyatiwari186@gmail.com"
                className="hover:text-sky-400 transition-colors duration-200 p-2 sm:p-0"
              >
                email
              </a>
            </div>

            <span className="hidden sm:inline text-slate-700">|</span>

            <p className="text-slate-500 font-normal text-center sm:text-right tracking-normal mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} — Designed &amp; Engineered by
              Dhairya Tiwari
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}