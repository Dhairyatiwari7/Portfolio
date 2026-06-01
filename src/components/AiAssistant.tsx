import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ArrowUpRight, HelpCircle, Bot, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "wel",
      sender: "assistant",
      text: "Connection established. I am Dhairya's AI Envoy. How can I assist you?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Tell me about SafarBuddy",
    "What is Dhairya's academic background?",
    "What was his role at BrandedBuddies?",
    "Tell me about Tomato Disease ML"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map all previous user messages and assistant messages to send as session history
      const history = [...messages, userMsg].map(m => ({
        role: m.sender === "assistant" ? "assistant" : "user",
        content: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response content type from AI API");
      }

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: data.message || "I apologize, our network socket timed out. Try asking again!"
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      let errorMsg = "I appear to be in local deployment mode. Please configure GEMINI_API_KEY on the server to enable AI responses.";
      
      if (err?.message?.includes("503")) {
        errorMsg = "AI service not available. GEMINI_API_KEY environment variable is not configured.";
      } else if (err?.message?.includes("Invalid response")) {
        errorMsg = "Server error. Backend may not be running correctly.";
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 2),
          sender: "assistant",
          text: errorMsg
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 1. Chat Widget Toggle Button */}
      {!isOpen && (
        <button
          id="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center border border-blue-400/20 duration-300 transform hover:scale-105"
          style={{ cursor: "pointer" }}
        >
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-40 group-hover:opacity-75 duration-300" />
          <Bot className="w-6 h-6 relative z-10 animate-pulse" />
          <span className="absolute right-14 bg-slate-900 border border-slate-800 text-xs text-blue-400 font-mono py-1 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300 translate-x-2 group-hover:translate-x-0">
            Chat with DevEnvoy
          </span>
        </button>
      )}

      {/* 2. Floating AI Dialogue Panel */}
      {isOpen && (
        <div 
          id="chat-dialogue-panel"
          className="w-80 md:w-96 h-[500px] rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl animate-fade-in divide-y divide-slate-800"
          style={{ transform: "translateY(0)" }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between bg-slate-950 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              
            </div>
            <button
              id="close-chat-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              style={{ cursor: "pointer" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Node */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-slate-900 text-slate-400 rounded-xl px-3 py-2 text-xs border border-slate-800">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>Envoy is writing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Click Prompts */}
          {messages.length === 1 && !loading && (
            <div className="p-3 bg-slate-950/45 space-y-1.5 border-t border-slate-800/65">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">Recruiter Hotlinks:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-[11px] bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-400 px-2.5 py-1 rounded transition duration-200 text-left flex items-center justify-between w-full group"
                    style={{ cursor: "pointer" }}
                  >
                    <span>{p}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-400 duration-200" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-950 rounded-b-2xl flex gap-1.5">
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query Dhairya's professional background..."
              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-sans"
              disabled={loading}
            />
            <button
              id="send-chat-btn"
              type="submit"
              className="p-2 sm:px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs flex items-center justify-center transition-all disabled:opacity-50"
              disabled={loading || !input.trim()}
              style={{ cursor: "pointer" }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
