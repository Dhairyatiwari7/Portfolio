import { useState, useEffect } from "react";
import { Database, Trash2, Mail, ExternalLink, Calendar, Users, RefreshCw, Layers } from "lucide-react";
import { Lead } from "../types.js";

export default function RecruiterDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Could not fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/messages/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        // Remove locally
        setLeads(prev => prev.filter(lead => lead.id !== id));
      }
    } catch (err) {
      console.error("Could not delete message lead:", err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const textStr = `${lead.name} ${lead.company} ${lead.email} ${lead.message}`.toLowerCase();
    return textStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Visual Header */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-xs font-mono text-blue-500 uppercase tracking-widest block mb-2">Back-office Sandbox</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-100 tracking-tight">Active Recruiter Leads Inbox</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Monitor real-time full-stack contact logs stored in the Express.js server memory. Useful for reviewers logging mock requests.
          </p>
        </div>

        <button
          id="refresh-leads-btn"
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 py-2 px-4 rounded-xl transition duration-200"
          style={{ cursor: "pointer" }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-500" : ""}`} />
          <span>Synchronize Backend Database</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono text-left block">INBOX CAPACITY</span>
            <span className="text-base font-bold text-slate-200">100 Leads</span>
          </div>
          <Database className="w-5 h-5 text-blue-400 opacity-60" />
        </div>
        <div className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono text-left block">REGISTERED INQUIRIES</span>
            <span className="text-base font-bold text-slate-200">{leads.length} Contacts</span>
          </div>
          <Users className="w-5 h-5 text-blue-400 opacity-60" />
        </div>
        <div className="p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono text-left block">AI CO-RESPOND NODE</span>
            <span className="text-base font-bold text-slate-200">Enabled</span>
          </div>
          <Layers className="w-5 h-5 text-emerald-400 opacity-60" />
        </div>
      </div>

      {/* Filter and Content details */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            id="leads-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter leads by recruiter name, company, stack keywords..."
            className="flex-1 bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
            <span className="text-sm text-slate-500">No recruiters match your search terms. Create one in the contact tab!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition duration-300 relative overflow-hidden"
              >
                {/* Delete overlay handler */}
                <button
                  id={`delete-lead-${lead.id}`}
                  onClick={() => handleDelete(lead.id)}
                  className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 hover:bg-slate-950 border border-transparent hover:border-red-950/40 rounded-lg duration-200"
                  title="Purge Submission"
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 font-sans">{lead.name}</h4>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">{lead.company}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 font-mono text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {lead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(lead.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Submitter Content Message */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Recruiter Enquiry text:</span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                      {lead.message}
                    </p>
                  </div>

                  {lead.autoResponse && (
                    <div className="pt-3 border-t border-slate-850 bg-slate-950/20 p-4 rounded-xl border border-slate-850/50">
                      <span className="text-[9px] uppercase tracking-wider text-blue-400 font-mono block">Automated instant response generated:</span>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1.5 italic">
                        "{lead.autoResponse}"
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
