import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, X, RefreshCw, Plus, Trash2, Edit3, Settings, Check, HelpCircle } from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";

interface BackstageConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackstageConsole({ isOpen, onClose }: BackstageConsoleProps) {
  const { showDetails, performerBio, shows, refreshAll } = useAjeebData();
  
  // Administrative credentials & auth states
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ajeeb_backstage_verified") === "true";
  });
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Edit states
  const [editDetails, setEditDetails] = useState({
    title: showDetails.title || "",
    bengaliTitle: showDetails.bengaliTitle || "",
    hindiTitle: showDetails.hindiTitle || "",
    tagline: showDetails.tagline || "",
    taglineSecondary: showDetails.taglineSecondary || "",
    description: showDetails.description || "",
    venueText: showDetails.venueText || ""
  });

  const [editBio, setEditBio] = useState({
    subtitle: performerBio.subtitle || "",
    storyTitle: performerBio.storyTitle || "",
    description: performerBio.description || "",
    quoteText: performerBio.quoteText || "",
    quoteSubtitle: performerBio.quoteSubtitle || ""
  });

  // Schedule creator states
  const [newShow, setNewShow] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    city: "Jamshedpur",
    ticketPrice: 150,
    totalSeats: 45,
    remainingSeats: 45,
    bookingLink: "",
    soldOut: false
  });

  const [activeTab, setActiveTab] = useState<"general" | "biography" | "schedule">("general");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("ajeeb_backstage_verified", "true");
        // Pull latest values on successful authentication
        setEditDetails({
          title: showDetails.title || "",
          bengaliTitle: showDetails.bengaliTitle || "",
          hindiTitle: showDetails.hindiTitle || "",
          tagline: showDetails.tagline || "",
          taglineSecondary: showDetails.taglineSecondary || "",
          description: showDetails.description || "",
          venueText: showDetails.venueText || ""
        });
        setEditBio({
          subtitle: performerBio.subtitle || "",
          storyTitle: performerBio.storyTitle || "",
          description: performerBio.description || "",
          quoteText: performerBio.quoteText || "",
          quoteSubtitle: performerBio.quoteSubtitle || ""
        });
      } else {
        setAuthError(data.error || "Access Denied. Incorrect passcode.");
      }
    } catch (err) {
      setAuthError("Failed to verify credentials with the backstage server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/show-details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...showDetails, ...editDetails })
      });

      if (res.ok) {
        await refreshAll();
        setSuccessMsg("Show metadata changed persistently on the server!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setAuthError("Could not update show-details on the server.");
      }
    } catch (err) {
      setAuthError("Network error updating general settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...performerBio, ...editBio })
      });

      if (res.ok) {
        await refreshAll();
        setSuccessMsg("Biography changed persistently on the server!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setAuthError("Could not update biography on the server.");
      }
    } catch (err) {
      setAuthError("Network error updating performer biography.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShow.title || !newShow.date || !newShow.venue) {
      setAuthError("Please specify a Show Title, Date, and Venue.");
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShow)
      });

      if (res.ok) {
        await refreshAll();
        setSuccessMsg("New concert successfully scheduled and written to persistent storage!");
        setNewShow({
          title: "",
          date: "",
          time: "",
          venue: "",
          city: "Jamshedpur",
          ticketPrice: 150,
          totalSeats: 45,
          remainingSeats: 45,
          bookingLink: "",
          soldOut: false
        });
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setAuthError("Failed to schedule the new show.");
      }
    } catch (err) {
      setAuthError("Network error while registering show.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShow = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to retire this show from the active lineup?")) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/shows/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refreshAll();
        setSuccessMsg("Concert retired and removed from active schedules.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setAuthError("Could not delete show.");
      }
    } catch (err) {
      setAuthError("Network error while removing show.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ajeeb_backstage_verified");
    setPasscode("");
    setAuthError("");
    setSuccessMsg("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-[#0e0705] border border-[#3e2312] rounded-xl shadow-2xl overflow-hidden text-[#f7ede2] flex flex-col font-sans"
        id="backstage-card"
      >
        {/* Header toolbar */}
        <div className="bg-[#1b100a] border-b border-[#301b0e] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Settings className="text-[#bc4123] w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#e6b17a] tracking-tight uppercase">
                Ajeeb Backstage Console
              </h2>
              <p className="text-[10px] text-[#a27b5c] font-mono tracking-widest uppercase">
                Persistent Realtime Server Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#a27b5c] hover:text-white p-1 rounded-full hover:bg-white/5 transition"
            id="close-backstage"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
          
          {/* Status and Error banners */}
          {authError && (
            <div className="bg-red-950/40 border border-red-900/60 p-3 rounded-lg text-red-300 text-xs font-mono flex items-center gap-2">
              <span className="font-bold">Error:</span> {authError}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check size={14} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Authentication Screen */}
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-8 text-center space-y-5">
              <div className="w-16 h-16 bg-[#1f110a] rounded-full flex items-center justify-center mx-auto border border-[#3e2312]">
                <Lock className="text-[#e6b17a]" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-md font-bold text-white">Backstage Access Required</h3>
                <p className="text-xs text-[#a27b5c] px-4 leading-relaxed">
                  Please supply the administrative passcode to dynamic full-stack APIs.
                  Changes configured here persist directly in the backend JSON stores and hydrate instantly.
                </p>
              </div>

              <div className="space-y-2 text-left max-w-xs mx-auto">
                <label className="text-[10px] font-mono text-[#a27b5c] uppercase font-bold tracking-wider block">
                  PASSCODE (SEED DEFAULT: 1935)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin code..."
                    className="w-full bg-[#150a06] border border-[#3e2312] rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#bc4123] tracking-widest text-center"
                    id="backstage-passcode-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs mx-auto bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded shadow hover:shadow-lg transition-all font-mono uppercase tracking-widest flex items-center justify-center gap-2"
                id="backstage-login-btn"
              >
                {isSubmitting ? "Verifying..." : "Validate Passcode"}
              </button>
            </form>
          ) : (
            /* Admin Panel Dashboard */
            <div className="space-y-6">
              
              {/* Toolbar and profile control */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#130b08] p-3 rounded-lg border border-[#3b1f11]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-[#e6b17a] font-bold">Authenticated Backstage Agent Mode</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-mono underline uppercase tracking-wider text-left sm:text-right"
                  id="admin-logout-btn"
                >
                  Terminate session (Sign Out)
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#301b0e] gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "general"
                      ? "border-[#bc4123] text-[#e6b17a] bg-[#1a0f0a]"
                      : "border-transparent text-[#a27b5c] hover:text-white"
                  }`}
                >
                  1. Front-end Titles
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("biography")}
                  className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "biography"
                      ? "border-[#bc4123] text-[#e6b17a] bg-[#1a0f0a]"
                      : "border-transparent text-[#a27b5c] hover:text-white"
                  }`}
                >
                  2. Biography & Bio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("schedule")}
                  className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "schedule"
                      ? "border-[#bc4123] text-[#e6b17a] bg-[#1a0f0a]"
                      : "border-transparent text-[#a27b5c] hover:text-white"
                  }`}
                >
                  3. Scheduled Shows ({shows.length})
                </button>
              </div>

              {/* TAB CONTENT: General Config */}
              {activeTab === "general" && (
                <form onSubmit={handleUpdateDetails} className="space-y-4">
                  <div className="bg-[#120a06] p-4 rounded-lg border border-[#301b0e]/80 space-y-3">
                    <p className="text-[11px] text-[#e6b17a] font-mono uppercase font-bold tracking-wider border-b border-[#3e2312] pb-1.5">
                      Live Performance Metadata Settings
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">App Title</label>
                        <input
                          type="text"
                          value={editDetails.title}
                          onChange={(e) => setEditDetails({ ...editDetails, title: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Bengali Heading</label>
                        <input
                          type="text"
                          value={editDetails.bengaliTitle}
                          onChange={(e) => setEditDetails({ ...editDetails, bengaliTitle: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Hindi Accent Subheading</label>
                        <input
                          type="text"
                          value={editDetails.hindiTitle}
                          onChange={(e) => setEditDetails({ ...editDetails, hindiTitle: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Acoustic Tagline</label>
                        <input
                          type="text"
                          value={editDetails.tagline}
                          onChange={(e) => setEditDetails({ ...editDetails, tagline: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Secondary Tagline (Quotes/Footer)</label>
                      <input
                        type="text"
                        value={editDetails.taglineSecondary}
                        onChange={(e) => setEditDetails({ ...editDetails, taglineSecondary: e.target.value })}
                        className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Hero Description Text</label>
                      <textarea
                        rows={3}
                        value={editDetails.description}
                        onChange={(e) => setEditDetails({ ...editDetails, description: e.target.value })}
                        className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Cafe & Venue Text Settings</label>
                      <input
                        type="text"
                        value={editDetails.venueText}
                        onChange={(e) => setEditDetails({ ...editDetails, venueText: e.target.value })}
                        className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded font-mono uppercase tracking-wider"
                  >
                    {isSubmitting ? "Synching Server..." : "Save Front-end Titles Persistently"}
                  </button>
                </form>
              )}

              {/* TAB CONTENT: Biography Config */}
              {activeTab === "biography" && (
                <form onSubmit={handleUpdateBio} className="space-y-4">
                  <div className="bg-[#120a06] p-4 rounded-lg border border-[#301b0e]/80 space-y-3">
                    <p className="text-[11px] text-[#e6b17a] font-mono uppercase font-bold tracking-wider border-b border-[#3e2312] pb-1.5">
                      Performer Biography & Quote Settings
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Bio Subtitle</label>
                        <input
                          type="text"
                          value={editBio.subtitle}
                          onChange={(e) => setEditBio({ ...editBio, subtitle: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Story Title Accent</label>
                        <input
                          type="text"
                          value={editBio.storyTitle}
                          onChange={(e) => setEditBio({ ...editBio, storyTitle: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Biography Paragraph Description</label>
                      <textarea
                        rows={4}
                        value={editBio.description}
                        onChange={(e) => setEditBio({ ...editBio, description: e.target.value })}
                        className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123] leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Tribute Blockquote Text</label>
                        <input
                          type="text"
                          value={editBio.quoteText}
                          onChange={(e) => setEditBio({ ...editBio, quoteText: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Quote Subauthor/Subheading</label>
                        <input
                          type="text"
                          value={editBio.quoteSubtitle}
                          onChange={(e) => setEditBio({ ...editBio, quoteSubtitle: e.target.value })}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded font-mono uppercase tracking-wider"
                  >
                    {isSubmitting ? "Syncing Server..." : "Save Biography Persistently"}
                  </button>
                </form>
              )}

              {/* TAB CONTENT: Concert Schedule Config */}
              {activeTab === "schedule" && (
                <div className="space-y-5">
                  {/* Create Show Form */}
                  <form onSubmit={handleAddShow} className="bg-[#120a06] p-4 rounded-lg border border-[#3b2111]/70 space-y-3">
                    <p className="text-[11px] text-[#e6b17a] font-mono uppercase font-bold tracking-wider block border-b border-[#301b0e] pb-1.5">
                      Schedule a New Live Concert
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Concert Mini-Title</label>
                        <input
                          type="text"
                          required
                          value={newShow.title}
                          onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
                          placeholder="e.g. Acoustic Monsoon Soul"
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Date Text representation</label>
                        <input
                          type="text"
                          required
                          value={newShow.date}
                          onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                          placeholder="e.g. JUNE 15, 2026"
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Time Representation</label>
                        <input
                          type="text"
                          value={newShow.time}
                          onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                          placeholder="e.g. 6:30 PM - 8:30 PM"
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1 col-span-1 sm:col-span-2">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Acoustic Venue & address</label>
                        <input
                          type="text"
                          required
                          value={newShow.venue}
                          onChange={(e) => setNewShow({ ...newShow, venue: e.target.value })}
                          placeholder="e.g. Boulevard Cafe, Bistupur"
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Ticket Price (INR)</label>
                        <input
                          type="number"
                          value={newShow.ticketPrice}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setNewShow({ ...newShow, ticketPrice: val });
                          }}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-[#a27b5c] uppercase font-bold block">Hall Seat Capacity</label>
                        <input
                          type="number"
                          value={newShow.totalSeats}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setNewShow({ ...newShow, totalSeats: val, remainingSeats: val });
                          }}
                          className="w-full bg-[#0a0503] border border-[#3e2312] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded font-mono uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>{isSubmitting ? "Writing server files..." : "Publish & Broadcast Live Concert"}</span>
                    </button>
                  </form>

                  {/* Active List with Actions */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-[#a27b5c] uppercase font-bold tracking-wider">
                      Currently Available Scheduled Shows ({shows.length})
                    </p>
                    <div className="divide-y divide-[#3e2312]/60 bg-[#0e0705] border border-[#3e2312] rounded-lg overflow-hidden">
                      {shows.length === 0 ? (
                        <p className="p-4 text-center text-xs text-[#a27b5c]">No active tour locations scheduled.</p>
                      ) : (
                        shows.map((show) => (
                          <div key={show.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-[#1a0f0a] transition">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-white font-serif">{show.title}</p>
                                <span className="text-[8px] font-mono bg-[#3a2012] px-2 py-0.5 rounded text-[#e6b17a]">
                                  {show.id}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#a27b5c] font-mono uppercase">
                                {show.date} • {show.time || "Unspecified time"}
                              </p>
                              <p className="text-[11px] text-[#d1bfae]/90">{show.venue}, {show.city}</p>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleDeleteShow(show.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition shrink-0"
                              title="Retire Concert Show"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer toolbar info */}
        <div className="bg-[#0b0503] border-t border-[#301b0e] px-6 py-3 flex justify-between items-center text-[9px] text-[#a27b5c] font-mono">
          <span>STABLE PERSISTENT MODE</span>
          <span>&copy; {new Date().getFullYear()} AJEEB-O-GAREEB BACKSTAGE</span>
        </div>
      </motion.div>
    </div>
  );
}
