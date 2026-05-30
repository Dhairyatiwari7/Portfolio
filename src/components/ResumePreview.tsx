import { FileDown, Printer, Copy, Check, Mail, Phone, Github, Linkedin, Award, Briefcase, GraduationCap } from "lucide-react";
import { useState } from "react";
import { resumeData } from "../resumeData.js";

export default function ResumePreview() {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    // Generate clean copyable plain text formatted nicely
    const rawText = `
Dhaurya Tiwari Portfolio Official Resume Raw Text
Name: Dhairya Tiwari
Email: dhairyatiwari186@gmail.com
Phone: +91-9721631005
Education:
- VIT Chennai: B.Tech CSE (Expected 2027)
Experience:
- BrandedBuddies: Full-Stack Intern (May-June 2025)
- DevLaunch: Web Developer Intern (May-July 2025)
Projects:
- Prescripto Healthcare
- AI Website Builder
- Tomato Disease Predictor
Achievements:
- Competitive Programming Specialist
- 1st Place EmpowerTech Hackathon
    `.trim();

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.location.href = "/api/download-resume";
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Upper Controls Menu Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-sans">Printable Document copy</h3>
          <p className="text-xs text-slate-400 mt-1">Sized perfectly for Letter dimensions. Print or download instantly.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Print Trigger */}
          <button
            id="print-resume-btn"
            onClick={handlePrint}
            className="p-2 sm:px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition"
            title="Trigger browser print"
            style={{ cursor: "pointer" }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save as PDF</span>
          </button>

          {/* Copy Plaintext Trigger */}
          <button
            id="copy-plain-resume-btn"
            onClick={handleCopyText}
            className="p-2 sm:px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition"
            style={{ cursor: "pointer" }}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold hidden sm:inline">Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Plaintext</span>
              </>
            )}
          </button>

          {/* Direct Download Trigger */}
          <button
            id="download-resume-preview-btn"
            onClick={handleDownload}
            className="p-2 sm:px-4 bg-blue-600 hover:bg-blue-505 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            style={{ cursor: "pointer" }}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download MD</span>
          </button>
        </div>
      </div>

      {/* Main Sheet Container representing actual layout */}
      <div 
        id="resume-printable-sheet"
        className="bg-zinc-950 text-slate-200 border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl relative overflow-hidden font-sans print:bg-white print:text-black print:p-0 print:border-none print:shadow-none"
      >
        
        {/* Printable Layout CSS overrides to protect printable layouts during native prints */}
        <span className="hidden print:block text-[10px] text-right font-mono italic text-slate-400 mb-4 border-b pb-2">
          Dhairya Tiwari Portfolio Verification Node • dhairyatiwari186@gmail.com
        </span>

        {/* Header Title Section Block */}
        <div className="border-b border-slate-800 print:border-slate-350 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 print:text-black tracking-tight">{resumeData.name}</h1>
              <p className="text-xs sm:text-sm font-mono text-blue-400 print:text-blue-700 font-medium mt-1 uppercase tracking-widest">{resumeData.title}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400 print:text-slate-650 font-mono">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                {resumeData.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                {resumeData.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-blue-500" />
                GitHub Portfolio
              </span>
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                LinkedIn Profile
              </span>
            </div>
          </div>
        </div>

        {/* Summary Block */}
        <div className="mb-8">
          <p className="text-xs sm:text-sm text-slate-300 print:text-zinc-700 leading-relaxed italic">
            "{resumeData.summary}"
          </p>
        </div>

        {/* Two Columns Printable layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column printable (9 cols for detailed experiences) */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Internships List */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 print:text-slate-500 uppercase border-b border-slate-850 pb-1.5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span>Internships & Alignments</span>
              </h3>
              
              <div className="space-y-6">
                {resumeData.internships.map((int, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 print:text-black">{int.role}</h4>
                        <span className="text-xs text-blue-400 print:text-blue-700 font-mono">{int.company}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{int.period}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300 print:text-zinc-700 leading-relaxed">
                      {int.bullets.map((b, bI) => (
                        <li key={bI}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Project work sheet */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 print:text-slate-500 uppercase border-b border-slate-850 pb-1.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span>Core Research & Engineering Projects</span>
              </h3>

              <div className="space-y-6">
                {resumeData.projects.map((proj, pI) => (
                  <div key={pI} className="space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 print:text-black">{proj.title}</h4>
                        <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 rounded print:border-slate-300 print:bg-slate-50">
                          {proj.technologies.join(", ")}
                        </span>
                      </div>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300 print:text-zinc-700 leading-relaxed">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column printable (4 cols for Education/Skills meta-data summary) */}
          <div className="md:col-span-4 space-y-8">
            
            {/* Print Education */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 print:text-slate-500 uppercase border-b border-slate-850 pb-1.5 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>Academic Record</span>
              </h3>

              <div className="space-y-4">
                {resumeData.education.map((edu, eI) => (
                  <div key={eI} className="text-xs space-y-1 bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                    <h4 className="text-xs font-bold text-slate-200 print:text-black">{edu.institution}</h4>
                    <p className="text-[10px] text-slate-400">{edu.degree}</p>
                    <div className="flex justify-between items-center text-[10px] text-blue-400 font-mono mt-1">
                      <span>{edu.period}</span>
                      <span className="font-bold">{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Skills tags */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 print:text-slate-500 uppercase border-b border-slate-850 pb-1.5 flex items-center gap-2">
                <span>Core Skill Matrix</span>
              </h3>

              <div className="space-y-3 font-mono text-[10px] text-slate-300 print:text-zinc-700">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block mb-1">Languages:</span>
                  <span>{resumeData.skills.languages.join(", ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block mb-1">Frontend:</span>
                  <span>{resumeData.skills.frontend.join(", ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block mb-1">Backend:</span>
                  <span>{resumeData.skills.backend.join(", ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block mb-1">Databases:</span>
                  <span>{resumeData.skills.databases.join(", ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block mb-1">ML & Algorithms:</span>
                  <span>{resumeData.skills.mlAi.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Achievements overview panel */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 print:text-slate-500 uppercase border-b border-slate-850 pb-1.5 flex items-center gap-2">
                <span>Vetted Streaks</span>
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-[10px] text-slate-400 print:text-zinc-700">
                {resumeData.achievements.map((a, aK) => (
                  <li key={aK}>{a}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
