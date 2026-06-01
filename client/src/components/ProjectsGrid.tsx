import React, { useState } from "react";
import { Github, Clock, Cpu, DatabaseZap, Sparkles, ArrowUpRight } from "lucide-react";
import { resumeData } from "../resumeData.js";

import prescriptoMockupImg from "../assets/images/prescripto.png";
import aiBuilderMockupImg from "../assets/images/website builder.png";
import tomatoMockupImg from "../assets/images/tomato_mockup_1779968252173.png";

type ProjectType = "prescripto" | "ai-builder" | "tomato-model";

const projectLinks: Record<ProjectType, string | null> = {
  "prescripto": "https://doctor-portal-frontend.onrender.com/",
  "ai-builder": "https://ai-website-builder-frontend-heql.onrender.com/",
  "tomato-model": null,
};

// Per-project accent colors (hue in degrees for HSL)
const projectAccents: Record<ProjectType, { from: string; to: string; glow: string; badge: string }> = {
  "prescripto": { from: "#0ea5e9", to: "#06b6d4", glow: "rgba(14,165,233,0.25)", badge: "bg-sky-950/60 text-sky-300 border-sky-800/50" },
  "ai-builder": { from: "#f59e0b", to: "#f97316", glow: "rgba(245,158,11,0.20)", badge: "bg-amber-950/60 text-amber-300 border-amber-800/50" },
  "tomato-model": { from: "#10b981", to: "#14b8a6", glow: "rgba(16,185,129,0.20)", badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/50" },
};

export default function ProjectsGrid() {
  const { projects } = resumeData;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tilt, setTilt] = useState<Record<number, { rx: number; ry: number }>>({});

  const getProjectKey = (title: string): ProjectType => {
    if (title.includes("Healthcare")) return "prescripto";
    if (title.includes("AI Website")) return "ai-builder";
    return "tomato-model";
  };

  const getProjectThumbnail = (title: string) => {
    if (title.includes("Healthcare")) return prescriptoMockupImg;
    if (title.includes("AI Website")) return aiBuilderMockupImg;
    return tomatoMockupImg;
  };

  const getProjectIcon = (title: string) => {
    if (title.includes("Predictor")) return <Cpu className="w-4 h-4" />;
    if (title.includes("Healthcare")) return <DatabaseZap className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt(prev => ({
      ...prev,
      [idx]: {
        rx: (y - 0.5) * 8,
        ry: -(x - 0.5) * 8,
      }
    }));
  };

  const handleMouseLeave = (idx: number) => {
    setHoveredIdx(null);
    setTilt(prev => ({ ...prev, [idx]: { rx: 0, ry: 0 } }));
  };

  return (
    <div className="space-y-14">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <p className="text-[11px] font-mono tracking-[0.2em] text-teal-400 uppercase mb-3">Selected Work</p>
          <h2
            className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
          >
            Project<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
              Showcase
            </span>
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed text-right hidden sm:block">
          Production deployments across full-stack and machine learning domains.
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {projects.map((project, idx) => {
          const key = getProjectKey(project.title);
          const liveUrl = projectLinks[key];
          const accent = projectAccents[key];
          const isDeployed = !!liveUrl;
          const isHovered = hoveredIdx === idx;
          const t = tilt[idx] || { rx: 0, ry: 0 };

          return (
            <div
              key={project.title}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
              onClick={() => isDeployed && window.open(liveUrl!, "_blank", "noopener noreferrer")}
              className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                cursor: isDeployed ? "pointer" : "default",
                transform: `perspective(1200px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(0)`,
                transformStyle: "preserve-3d",
                // card background
                background: "linear-gradient(145deg, #0c1315 0%, #080f11 100%)",
                border: isHovered
                  ? `1px solid ${accent.from}55`
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isHovered
                  ? `0 0 0 1px ${accent.from}22, 0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accent.glow}`
                  : "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >

              {/* ── Glowing top edge line ── */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent.from}, ${accent.to}, transparent)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />

              {/* ── Image block ── */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={getProjectThumbnail(project.title)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: isHovered ? "scale(1.07)" : "scale(1.0)" }}
                  referrerPolicy="no-referrer"
                />

                {/* dark cinematic overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(8,15,17,0.85) 100%)`,
                    opacity: isHovered ? 0.95 : 0.7,
                  }}
                />

                {/* Index number — oversized watermark */}
                <div
                  className="absolute top-3 left-4 font-black text-white/5 select-none leading-none"
                  style={{ fontSize: "clamp(64px, 10vw, 96px)", fontFamily: "'Syne', sans-serif" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Status badge top-right */}
                <div className="absolute top-3 right-3">
                  {isDeployed ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: accent.from }}
                      />
                      LIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-slate-400">
                      <Clock className="w-3 h-3" />
                      SOON
                    </span>
                  )}
                </div>

                {/* Hover CTA slides up from bottom of image */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 transition-all duration-400"
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(12px)",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  {isDeployed ? (
                    <a
                      href={liveUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:brightness-110"
                      style={{
                        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                        color: "#000",
                        boxShadow: `0 4px 20px ${accent.glow}`,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      View Live Project
                    </a>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Deployment Coming Soon
                    </div>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 rounded-xl bg-white/8 border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* ── Card body ── */}
              <div className="flex flex-col flex-1 p-5 gap-4">

                {/* Role + icon */}
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{
                      background: `${accent.from}18`,
                      border: `1px solid ${accent.from}30`,
                      color: accent.from,
                    }}
                  >
                    {getProjectIcon(project.title)}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                    {project.role}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-base font-black text-white leading-snug uppercase"
                  style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em" }}
                >
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-[13px] text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {project.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Bullets */}
                <ul className="space-y-1.5">
                  {project.bullets.map((bullet: string, bIdx: number) => (
                    <li key={bIdx} className="flex items-start gap-2 text-[12px] text-slate-400 leading-relaxed">
                      <span
                        className="mt-[5px] w-1 h-1 rounded-full shrink-0"
                        style={{ background: accent.from }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div className="mt-auto pt-1 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${accent.badge}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}