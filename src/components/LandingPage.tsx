import React, { useState } from "react";
import { 
  Laptop, Code, Server, Database, BrainCircuit, Award, Calendar, Briefcase, GraduationCap, ChevronRight, FileCode2, ExternalLink, Flame, Trophy, LineChart, Code2
} from "lucide-react";
import { resumeData } from "../resumeData";
import LandingHero from "./LandingHero";

interface LandingPageProps {
  setActiveTab: (tab: any) => void;
}

// Map project keys to active URLs
const projectLinks: Record<string, string | null> = {
  "Prescripto Healthcare Management System": "https://doctor-portal-frontend.onrender.com/",
  "AI Website Builder": "https://ai-website-builder-frontend-heql.onrender.com/",
  "Tomato Disease Predictor": null
};

// Custom accent configurations for project cards
const projectColors: Record<string, { base: string; border: string; glow: string; text: string; bg: string }> = {
  "Prescripto Healthcare Management System": {
    base: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/30 hover:border-cyan-400",
    glow: "rgba(6,182,212,0.18)",
    text: "text-cyan-400",
    bg: "bg-cyan-950/40"
  },
  "AI Website Builder": {
    base: "from-amber-500 to-orange-500",
    border: "border-amber-500/30 hover:border-amber-400",
    glow: "rgba(245,158,11,0.15)",
    text: "text-amber-400",
    bg: "bg-amber-950/40"
  },
  "Tomato Disease Predictor": {
    base: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/30 hover:border-emerald-400",
    glow: "rgba(16,185,129,0.15)",
    text: "text-emerald-400",
    bg: "bg-emerald-950/40"
  }
};

export default function LandingPage({ setActiveTab }: LandingPageProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [projectTilts, setProjectTilts] = useState<Record<string, { rx: number; ry: number }>>({});
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const handleProjectMouseMove = (e: React.MouseEvent<HTMLDivElement>, title: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setProjectTilts(prev => ({
      ...prev,
      [title]: {
        rx: (y - 0.5) * 10,
        ry: -(x - 0.5) * 10
      }
    }));
  };

  const handleProjectMouseLeave = (title: string) => {
    setHoveredProject(null);
    setProjectTilts(prev => ({ ...prev, [title]: { rx: 0, ry: 0 } }));
  };

  const stats = [
    { label: "LeetCode Questions", value: "730+", note: "Rating: 1750+", icon: <Flame className="w-5 h-5 text-orange-400" /> },
    { label: "VIT CSE Score", value: "9.3 CGPA", note: "VIT Chennai Undergrad", icon: <LineChart className="w-5 h-5 text-teal-400" /> },
    { label: "Production Internships", value: "2 Completed", note: "BrandedBuddies & DevLaunch", icon: <Briefcase className="w-5 h-5 text-cyan-400" /> },
    { label: "Hackathons Won", value: "1st Place", note: "EmpowerTech / Rank 8 HacknDroid", icon: <Trophy className="w-5 h-5 text-yellow-400" /> }
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO BANNER GRID */}
      <LandingHero onNavigate={setActiveTab} />

      {/* 2. RECRUITER FAST-PASS STATS */}
      <section className="space-y-6">
        <div className="border-l-2 border-teal-500 pl-3">
          <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">Executive Dashboard</p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-sans">
            Key Performance Indicators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const isHovered = hoveredStat === idx;
            return (
              <div
                key={stat.label}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`p-6 rounded-2xl bg-gradient-to-b from-[#061114] to-[#010609] border transition-all duration-300 transform ${
                  isHovered 
                    ? "border-teal-500/40 -translate-y-1 shadow-[0_10px_25px_rgba(13,242,201,0.12)]" 
                    : "border-slate-850"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">KPI.0{idx + 1}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-100 font-sans tracking-tight block">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-350 block uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {stat.note}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED WORK GRID */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-l-2 border-cyan-500 pl-3">
          <div>
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Engineering Showroom</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-sans">
              Featured Systems
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab("projects")}
            className="text-xs text-cyan-400 font-mono flex items-center gap-1 hover:text-cyan-300 cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            <span>View All Deployed Work</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {resumeData.projects.map((project) => {
            const colors = projectColors[project.title] || {
              base: "from-teal-500 to-cyan-500",
              border: "border-teal-500/20 hover:border-teal-400",
              glow: "rgba(13,242,201,0.1)",
              text: "text-teal-400",
              bg: "bg-teal-950/20"
            };
            const liveUrl = projectLinks[project.title];
            const isHovered = hoveredProject === project.title;
            const t = projectTilts[project.title] || { rx: 0, ry: 0 };

            return (
              <div
                key={project.title}
                onMouseMove={(e) => handleProjectMouseMove(e, project.title)}
                onMouseEnter={() => setHoveredProject(project.title)}
                onMouseLeave={() => handleProjectMouseLeave(project.title)}
                onClick={() => liveUrl && window.open(liveUrl, "_blank", "noopener noreferrer")}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#061114] to-[#010609] border flex flex-col justify-between transition-all duration-300 relative overflow-hidden transform cursor-pointer"
                style={{
                  cursor: liveUrl ? "pointer" : "default",
                  transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(0)`,
                  transformStyle: "preserve-3d",
                  borderColor: isHovered ? "rgba(13,242,201,0.3)" : "rgba(255,255,255,0.06)",
                  boxShadow: isHovered 
                    ? `0 20px 45px rgba(0,0,0,0.65), 0 0 35px ${colors.glow}`
                    : "0 4px 20px rgba(0,0,0,0.4)"
                }}
              >
                {/* Glowing top line accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)`,
                    opacity: isHovered ? 1 : 0
                  }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      {project.role}
                    </span>
                    {liveUrl ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                        SOON
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-100 font-sans tracking-tight uppercase leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {project.description}
                  </p>

                  <div className="h-px bg-slate-900" />

                  <ul className="space-y-1.5">
                    {project.bullets.slice(0, 2).map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-teal-400 mt-1 shrink-0 select-none">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/60 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border ${colors.bg} ${colors.text} border-slate-800/50`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SKILLS / CAPABILITIES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: core summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-l-2 border-emerald-500 pl-3">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Capability Matrix</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-sans">
              Technical Stack
            </h2>
          </div>
          <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
            Evaluating systems using specialized algorithmic designs on Python/C++, full-stack deployments using the MERN architecture, and deep classification nodes on PyTorch.
          </p>
          <button
            onClick={() => setActiveTab("skills")}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono pt-2 cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            <span>Inspect Full Capability Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right column: categories lists */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Machine Learning & AI",
              items: resumeData.skills.mlAi,
              icon: <BrainCircuit className="w-4 h-4 text-teal-400" />
            },
            {
              title: "Backend & Core Systems",
              items: resumeData.skills.backend,
              icon: <Server className="w-4 h-4 text-cyan-400" />
            },
            {
              title: "Frontend Architecture",
              items: resumeData.skills.frontend,
              icon: <Laptop className="w-4 h-4 text-emerald-400" />
            },
            {
              title: "Databases & Schemas",
              items: resumeData.skills.databases,
              icon: <Database className="w-4 h-4 text-teal-400" />
            }
          ].map((cat) => (
            <div 
              key={cat.title} 
              className="p-5 rounded-2xl bg-gradient-to-b from-[#061114]/40 to-[#010609]/60 border border-slate-900 hover:border-slate-800/80 transition duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-850">
                  {cat.icon}
                </div>
                <h3 className="text-xs font-bold font-sans text-slate-200 tracking-tight uppercase">
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span 
                    key={item}
                    className="text-[10px] font-mono bg-slate-950/60 border border-slate-850 text-slate-350 px-2 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CAREER & ACADEMIC PROGRESS TIMELINE */}
      <section className="space-y-10">
        <div className="border-l-2 border-teal-500 pl-3">
          <p className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">Progress Log</p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-sans">
            Career Timeline
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative border-l border-slate-850/80 pl-6 ml-4 space-y-10 py-2">
          {/* Timeline Nodes */}
          {[
            ...resumeData.internships.map(int => ({
              title: int.role,
              sub: int.company,
              tag: "Internship",
              period: int.period,
              bullets: int.bullets,
              icon: <Briefcase className="w-4 h-4 text-teal-400" />,
              border: "border-teal-500"
            })),
            ...resumeData.education.slice(0, 1).map(edu => ({
              title: edu.degree,
              sub: edu.institution,
              tag: "Academics",
              period: edu.period,
              bullets: [`Achieved a strong academic profile (B.Tech CSE Undergraduate CGPA: 9.3) at VIT Chennai.`, `Focusing core research on Data Structures & Algorithms, Operating Systems, Machine Learning, Database Management, and Object Oriented Programming.`],
              icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
              border: "border-cyan-500"
            }))
          ].map((node, index) => (
            <div key={index} className="relative group">
              {/* Dynamic connector marker node */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#01080a] border-2 ${node.border} group-hover:scale-110 duration-200 shadow-md`} />
              
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#061114]/40 to-[#010609]/60 border border-slate-900 hover:border-slate-800 p-6 transition duration-300 relative overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 font-sans uppercase tracking-tight">
                      {node.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-teal-450 font-mono font-medium">{node.sub}</span>
                      <span className="text-[9px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-800/80">
                        {node.tag}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-900 py-1 px-3 rounded-full">
                    {node.period}
                  </span>
                </div>
                
                <ul className="space-y-1.5 text-xs text-slate-350 leading-relaxed list-none pl-0 mt-4">
                  {node.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-400 mt-1 select-none font-bold">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
