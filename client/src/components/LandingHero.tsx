import React, { useState } from "react";
import { Sparkles, Terminal, ChevronRight, FolderCode, ShieldCheck, Cpu, Award } from "lucide-react";
import { resumeData } from "../resumeData";

interface LandingHeroProps {
  onNavigate: (tab: any) => void;
}

export default function LandingHero({ onNavigate }: LandingHeroProps) {
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ry = -((x / rect.width) - 0.5) * 18; // Rotation angles
    const rx = ((y / rect.height) - 0.5) * 18;
    setCardTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setCardTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-4">
      {/* Left Column: Bold Typography & Core Bio */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/50 rounded-full px-3.5 py-1 text-[11px] text-blue-300 font-mono shadow-[0_2px_10px_rgba(59,130,246,0.05)]">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>3D STEREOSCOPIC DESIGN ACTIVATED</span>
        </div>

        {/* Hero Title with Balanced Gradients */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.08] uppercase font-sans">
            Architecting <br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-blue-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(59,130,246,0.1)]">
              Full-Stack &amp; ML
            </span> <br />
            Systems
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-xl">
            I am a Computer Science major at VIT Chennai. I bridge high-performance frontend interfaces with highly scalable, secure RESTful backends and custom PyTorch deep learning architectures.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap gap-4 pt-2">
          {/* Primary Action Button (Slate/White) */}
          <button
            onClick={() => onNavigate("contact")}
            className="relative group bg-slate-200 hover:bg-white text-slate-950 font-sans text-xs sm:text-sm font-black py-3 px-6 rounded-xl flex items-center gap-2 border-b-4 border-slate-400 active:border-b-0 active:translate-y-[4px] shadow-[0_6px_25px_rgba(255,255,255,0.05)] transition-all cursor-pointer"
          >
            <span>Connect &amp; View Credentials</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Secondary Action Button (Obsidian/Slate) */}
          <button
            onClick={() => onNavigate("projects")}
            className="bg-[#0e111a] hover:bg-[#141824] text-slate-300 font-mono text-xs py-3 px-5 rounded-xl border border-slate-800 border-b-4 border-b-[#0a0d14] active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FolderCode className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore Deployed Projects</span>
          </button>
        </div>

        {/* Dynamic Visual Badges */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-4">
          <span className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md text-slate-400">
            <Cpu className="w-3 h-3 text-slate-400" /> MERN STACK
          </span>
          <span className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md text-slate-400">
            <Award className="w-3 h-3 text-blue-400/80" /> PYTORCH DEEP LEARNING
          </span>
          <span className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md text-slate-400">
            <Terminal className="w-3 h-3 text-slate-400" /> LeetCode Rating: 1750+
          </span>
        </div>
      </div>

      {/* Right Column: Floating 3D Interactive Credentials Panel (Steel Blue Theme) */}
      <div className="lg:col-span-5 flex justify-center">
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-700/40 via-[#101424] to-[#090b11] p-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-150 ease-out cursor-crosshair"
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) translateZ(15px)`,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Subtle Blue Backdrop Glow */}
          <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 duration-500" />

          {/* Card Body */}
          <div className="p-6 bg-[#0c0f19]/95 rounded-2xl space-y-6 relative z-10 border border-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <Terminal className="w-3.5 h-3.5 animate-pulse text-blue-400" />
                <span>credentials.v2</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500/70 animate-ping" />
            </div>

            {/* Matrix Data Stack */}
            <div className="space-y-4 font-mono text-xs text-slate-300" style={{ transform: "translateZ(30px)" }}>
              <div className="flex items-start gap-3 border-l-2 border-slate-800 pl-2.5 hover:border-slate-400 transition-colors py-0.5">
                <span className="text-slate-400 font-extrabold">01</span>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Identity:</span>
                  <span className="text-slate-100 font-sans font-bold">{resumeData.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-slate-800 pl-2.5 hover:border-blue-400 transition-colors py-0.5">
                <span className="text-blue-400 font-extrabold">02</span>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Academy Node:</span>
                  <span className="text-slate-200">VIT Chennai • B.Tech CSE (2027)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-slate-800 pl-2.5 hover:border-slate-400 transition-colors py-0.5">
                <span className="text-slate-400 font-extrabold">03</span>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Primary Systems:</span>
                  <span className="text-slate-200">MERN Ecosystem, SQL &amp; FastAPI</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l-2 border-slate-800 pl-2.5 hover:border-blue-400 transition-colors py-0.5">
                <span className="text-blue-400 font-extrabold">04</span>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">ML Deployment:</span>
                  <span className="text-slate-200">GoogLeNet Inception / PyTorch</span>
                </div>
              </div>
            </div>

            {/* Interactive verification seal */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5" style={{ transform: "translateZ(20px)" }}>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Verification Seal</span>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-sans text-slate-300">Academic Integrity Rank</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono font-bold bg-[#090b11] border border-slate-800 py-0.5 px-2 rounded">
                  9.3 CGPA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}