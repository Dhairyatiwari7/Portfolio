import { useState } from "react";
import { 
  Laptop, Code, Server, Database, BrainCircuit, Wrench, Globe, Milestone, Award, CheckCircle
} from "lucide-react";
import { resumeData } from "../resumeData.js";

export default function SkillsGrid() {
  const { skills, achievements, certifications } = resumeData;
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);

  // Group configurations for aesthetic icon pairing - Updated to Slate & Blue theme
  const categories = [
    {
      key: "mlAi",
      title: "Machine Learning & AI",
      items: skills.mlAi,
      icon: <BrainCircuit className="w-4 h-4 text-blue-400" />,
      color: "from-blue-600/20 to-slate-600/5",
      accent: "bg-blue-400"
    },
    {
      key: "backend",
      title: "Backend & Systems",
      items: skills.backend,
      icon: <Server className="w-4 h-4 text-slate-300" />,
      color: "from-slate-500/20 to-blue-500/5",
      accent: "bg-slate-400"
    },
    {
      key: "frontend",
      title: "Frontend Architecture",
      items: skills.frontend,
      icon: <Laptop className="w-4 h-4 text-blue-400" />,
      color: "from-blue-600/20 to-slate-600/5",
      accent: "bg-blue-400"
    },
    {
      key: "databases",
      title: "Databases & Schemas",
      items: skills.databases,
      icon: <Database className="w-4 h-4 text-slate-300" />,
      color: "from-slate-500/20 to-blue-500/5",
      accent: "bg-slate-400"
    },
    {
      key: "languages",
      title: "Languages",
      items: skills.languages,
      icon: <Code className="w-4 h-4 text-blue-400" />,
      color: "from-blue-600/20 to-slate-600/5",
      accent: "bg-blue-400"
    },
    {
      key: "tools",
      title: "Engineering Tools",
      items: skills.tools,
      icon: <Wrench className="w-4 h-4 text-slate-300" />,
      color: "from-slate-500/20 to-blue-500/5",
      accent: "bg-slate-400"
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header Banner */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-2">Capabilities Registry</span>
        <h2 className="text-3xl sm:text-4xl font-sans font-black text-slate-100 tracking-tight uppercase">Technical Stack</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Full-stack capabilities evaluated across core computer science concepts, machine learning algorithms, and real-world deployment stacks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Skill Groups Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.key}
              onMouseEnter={() => setHoverCategory(cat.key)}
              onMouseLeave={() => setHoverCategory(null)}
              className={`p-6 rounded-2xl bg-[#0c0f19]/95 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between backdrop-blur-md ${
                hoverCategory === cat.key 
                ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                : "border-slate-800/80"
              }`}
            >
              {/* Corner Ambient Glow layer */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} blur-xl opacity-40 pointer-events-none`} />

              {/* Title Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-[#0e111a] border border-slate-800">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-sans text-slate-200 tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                {/* Sub-Items Tags layout */}
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] font-mono tracking-wide bg-[#0e111a] hover:bg-[#131722] border border-slate-800 hover:border-blue-500/30 text-slate-300 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Static visual stats indicator bar (grows on hover) */}
              <div className="mt-8 w-full h-[3px] bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${cat.accent} transition-all duration-700 ease-out`}
                  style={{ width: hoverCategory === cat.key ? "100%" : "30%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Achievements & Credentials Side Panel */}
        <div className="space-y-6">
          
          {/* Achievements Container Card */}
          <div className="bg-[#0c0f19]/95 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-black text-slate-100 font-sans tracking-tight uppercase">Milestones</h3>
            </div>

            <div className="space-y-3 relative z-10">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs leading-relaxed text-slate-300 bg-[#0e111a] border border-slate-800 p-3.5 rounded-xl transition duration-300 hover:border-blue-500/30 hover:bg-[#131722]">
                  <span className="text-blue-400 mt-[2px] font-bold text-[10px]">★</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Container Card */}
          <div className="bg-[#0c0f19]/95 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <CheckCircle className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-black text-slate-100 font-sans tracking-tight uppercase">Vetted Credentials</h3>
            </div>

            <div className="space-y-3 relative z-10">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs leading-relaxed text-slate-300 bg-[#0e111a] border border-slate-800 p-3.5 rounded-xl transition duration-300 hover:border-slate-500/40 hover:bg-[#131722]">
                  <span className="text-slate-400 mt-[2px] font-bold text-[10px]">✓</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}