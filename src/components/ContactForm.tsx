import React, { useState } from "react";
import {
  Send,
  Mail,
  Building,
  User,
  MailCheck,
  Loader2,
  MessageSquare,
  Globe,
  ArrowRight,
  Sparkles,
  Github,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [aiResponseText, setAiResponseText] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Send contact request to backend (handles email + AI response)
      const backendRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.text().catch(() => "");
        throw new Error(`Backend error: ${backendRes.status} - ${errorData}`);
      }

      const contentType = backendRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response content type from server");
      }

      const data = await backendRes.json();
      if (data?.autoReply) {
        setAiResponseText(data.autoReply);
      }

      setStatus("success");
      setFormData({
        name: "",
        company: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Form handling failed:", err);
      setStatus("error");
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 overflow-hidden bg-[#090b11]">
      {/* Background Slate/Blue Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-slate-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-400/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Context Info */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/50 rounded-full px-3.5 py-1 text-[11px] text-blue-300 font-mono shadow-[0_2px_10px_rgba(59,130,246,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>LET'S BUILD SOMETHING PREMIUM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight leading-[1.08] uppercase font-sans">
            Have an Idea? <br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-blue-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(59,130,246,0.1)]">
              Let's Connect.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-xl">
            Whether you are looking to build a highly scalable web application,
            integrate deep learning pipelines, or simply want to sync up—drop a
            message.
          </p>

          <div className="pt-6 space-y-5">
            {/* Email */}
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-[#0e111a] border border-slate-800 text-blue-400 transition-transform duration-300 group-hover:scale-105 group-hover:border-slate-700">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">
                  Direct Communication
                </p>
                <a
                  href="mailto:dhairyatiwari186@gmail.com"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-blue-400 transition-colors group/link"
                >
                  Send an Email
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover/link:text-blue-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-[#0e111a] border border-slate-800 text-blue-400 transition-transform duration-300 group-hover:scale-105 group-hover:border-slate-700">
                <Github className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">
                  Open Source
                </p>
                <a
                  href="https://github.com/Dhairyatiwari7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-blue-400 transition-colors group/link"
                >
                  Explore Repositories
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover/link:text-blue-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-[#0e111a] border border-slate-800 text-blue-400 transition-transform duration-300 group-hover:scale-105 group-hover:border-slate-700">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">
                  Professional Network
                </p>
                <a
                  href="https://www.linkedin.com/in/dhairya-tiwari7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-blue-400 transition-colors group/link"
                >
                  Connect on LinkedIn
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover/link:text-blue-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 group">
              <div className="p-3 rounded-xl bg-[#0e111a] border border-slate-800 text-blue-400 transition-transform duration-300 group-hover:scale-105 group-hover:border-slate-700">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-0.5">
                  Location Base
                </p>
                <p className="text-sm font-bold text-slate-200">
                  Available globally for remote engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Interface */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl border border-slate-800/80 bg-[#0c0f19]/95 p-8 sm:p-10 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
            {/* Embedded Ambient Glows within Card */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-slate-400/5 blur-2xl pointer-events-none" />

            {status !== "success" ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                      Company <span className="text-slate-600">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    Your Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell me about your project context or requirements..."
                      className="w-full pl-10 pr-4 py-3 bg-[#0e111a] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full relative group bg-slate-200 hover:bg-white text-slate-950 font-sans text-sm font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 border-b-4 border-slate-400 active:border-b-0 active:translate-y-[4px] shadow-[0_6px_25px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0 transition-all cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      <span>Dispatching Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Request</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-center text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/40 py-2.5 rounded-lg">
                    Submission error occurred. Please verify connections or try
                    again directly via email.
                  </p>
                )}
              </form>
            ) : (
              /* Success State */
              <div className="text-center py-8 space-y-6 relative z-10 animate-fade-in">
                <div className="w-16 h-16 bg-blue-950/40 border border-blue-900/50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  <MailCheck className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-100 font-sans uppercase tracking-tight">
                    Transmission Authenticated
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Your transmission data has been accepted securely by both
                    database and email dispatch systems.
                  </p>
                </div>

                {aiResponseText && (
                  <div className="bg-[#0e111a] border border-slate-800 text-slate-300 text-left p-4 rounded-xl text-xs space-y-2 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block font-mono">
                      System Node Auto-Reply:
                    </span>
                    <p className="italic leading-relaxed">"{aiResponseText}"</p>
                  </div>
                )}

                <button
                  onClick={() => setStatus("idle")}
                  className="inline-flex items-center gap-2 text-xs font-bold font-sans text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer"
                >
                  <span>Return to Messaging Interface</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
