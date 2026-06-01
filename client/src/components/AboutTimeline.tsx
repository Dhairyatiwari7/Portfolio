import { Calendar, Briefcase, GraduationCap, Layers } from "lucide-react";
import { resumeData } from "../resumeData.js";

export default function AboutTimeline() {
  const { education = [], internships = [] } = resumeData;

  // Intercept the data array to seamlessly apply your school correction 
  const displayEducation = education.map((edu) =>
    edu.institution?.toLowerCase().includes("st thomas")
      ? { ...edu, institution: "Sk higher secondary school" }
      : edu
  );

  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in relative z-10">
      {/* Section Header */}
      <div className="border-b border-[#2A3342] pb-6 px-4 sm:px-0">
        <span className="text-xs font-mono text-[#a8a8b3] uppercase tracking-widest block mb-2">
          Professional Progress
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#ffffff] via-[#c0c0c0] to-[#9090a0] bg-clip-text text-transparent tracking-tight uppercase">
          Experience & Academic Milestones
        </h2>
        <p className="text-sm text-[#9090a0] mt-2 max-w-2xl leading-relaxed">
          How rigorous computer science coursework at VIT Chennai combines with practical industry-level full-stack internship credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 px-2 sm:px-0">
        {/* =========================================================
            INDUSTRY EXPERIENCE (AMBER THEME)
           ========================================================= */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1a120b]/80 border border-[#7C5A2C] text-[#FFB84D] shadow-[0_0_25px_rgba(255,184,77,0.15)]">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#FFB84D] uppercase tracking-wider">
              Industry Experience
            </h3>
          </div>

          <div className="relative border-l border-[#2A3342] pl-6 ml-2 sm:ml-4 space-y-10 sm:space-y-12">
            {internships.map((intern, idx) => (
              <div key={idx} className="relative group">
                {/* Amber Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d0f14] border-2 border-[#FFB84D] group-hover:border-[#FFD18A] group-hover:scale-125 transition-all duration-300 shadow-[0_0_20px_rgba(255,184,77,0.4)]" />

                {/* Deep Slate Glass Card */}
                <div className="bg-[#0d0f14]/60 hover:bg-[#151b23]/80 border border-[#2A3342] hover:border-[#c0c0c0]/30 p-5 sm:p-6 rounded-2xl transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.45)] relative overflow-hidden backdrop-blur-md border-b-4 border-b-[#1a1e26] hover:border-b-[#c0c0c0] group-hover:-translate-y-1.5">
                  
                  {/* Glowing Orbs */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FFB84D]/10 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFB84D]/5 blur-2xl pointer-events-none" />

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      {/* Role Text Hover Accent */}
                      <h4 className="text-base sm:text-lg font-bold text-[#c0c0c0] group-hover:text-[#FFB84D] transition-colors uppercase">
                        {intern.role}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#a8a8b3] font-mono font-medium">
                          {intern.company}
                        </span>

                        {/* Premium Gradient Badge */}
                        {intern.website && (
                          <span className="text-[10px] bg-gradient-to-r from-[#1a120b] to-[#2a1e12] text-[#FFB84D] font-mono px-2 py-0.5 rounded border border-[#7C5A2C] flex items-center gap-0.5">
                            <Layers className="w-2.5 h-2.5" />
                            {intern.website}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#9090a0] font-mono bg-[#0d0f14]/80 border border-[#2A3342] py-1 px-3 rounded-full">
                      <Calendar className="w-3.5 h-3.5 text-[#a8a8b3]" />
                      <span>{intern.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mt-4 text-xs sm:text-sm text-[#9090a0] leading-relaxed list-none pl-0">
                    {intern.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-[#a8a8b3] mt-0.5 font-bold">›</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            ACADEMIC BACKGROUND (ELECTRIC BLUE THEME)
           ========================================================= */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0a1122]/80 border border-[#2C5D94] text-[#60A5FA] shadow-[0_0_25px_rgba(96,165,250,0.15)]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#60A5FA] uppercase tracking-wider">
              Academic Background
            </h3>
          </div>

          <div className="relative border-l border-[#2A3342] pl-6 ml-2 sm:ml-4 space-y-10 sm:space-y-12">
            {displayEducation.map((edu, idx) => (
              <div key={idx} className="relative group">
                {/* Electric Blue Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d0f14] border-2 border-[#60A5FA] group-hover:border-[#93C5FD] group-hover:scale-125 transition-all duration-300 shadow-[0_0_20px_rgba(96,165,250,0.4)]" />

                {/* Deep Slate Glass Card */}
                <div className="bg-[#0d0f14]/60 hover:bg-[#151b23]/80 border border-[#2A3342] hover:border-[#c0c0c0]/30 p-5 sm:p-6 rounded-2xl transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.45)] relative overflow-hidden backdrop-blur-md border-b-4 border-b-[#1a1e26] hover:border-b-[#c0c0c0] group-hover:-translate-y-1.5">
                  
                  {/* Glowing Orbs */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#60A5FA]/10 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#60A5FA]/5 blur-2xl pointer-events-none" />

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      {/* Institution Hover Accent */}
                      <h4 className="text-base sm:text-lg font-bold text-[#c0c0c0] group-hover:text-[#60A5FA] uppercase transition-colors">
                        {edu.institution}
                      </h4>
                      <p className="text-xs text-[#9090a0] mt-1">{edu.degree}</p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#9090a0] font-mono bg-[#0d0f14]/80 border border-[#2A3342] py-1 px-3 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-[#a8a8b3]" />
                        <span>{edu.period}</span>
                      </div>

                      {/* Premium Glow Score Badge */}
                      <span className="text-xs font-mono font-bold bg-gradient-to-r from-[#0a1122] to-[#111e33] border border-[#2C5D94] text-[#93C5FD] py-0.5 px-2.5 rounded shadow-[0_0_15px_rgba(96,165,250,0.15)]">
                        {edu.score}
                      </span>
                    </div>
                  </div>

                  {/* Coursework Tags */}
                  {edu.coursework && (
                    <div className="mt-5 pt-4 border-t border-[#2A3342]/50">
                      <span className="text-[10px] text-[#9090a0] font-mono uppercase tracking-widest block mb-2.5">
                        Relevant Core Coursework:
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {edu.coursework.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[10px] sm:text-xs bg-[#1a1e26]/60 border border-[#2A3342] hover:border-[#60A5FA] text-[#a8a8b3] hover:text-[#60A5FA] hover:bg-[#111e33] px-2.5 py-1 rounded-md transition duration-200 hover:scale-105"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}