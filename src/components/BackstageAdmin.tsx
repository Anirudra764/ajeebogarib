import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Lock, Unlock, Users, Calendar, MessageSquare, 
  Mail, X, Plus, Trash2, Check, Sparkles, Filter, 
  MapPin, Clock, Ticket, Star, FileText, RefreshCw 
} from "lucide-react";
import { PerformanceShow, TicketReservation, ContactMessage } from "../types";
import { UPCOMING_EVENTS, GALLERY_ITEMS } from "../data";

interface AdminStats {
  ticketsSold: number;
  activeEvents: number;
  totalNotes: number;
  contactLeads: number;
}

export default function BackstageAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"shows" | "reservations" | "notes" | "gallery" | "leads">("shows");

  // Dynamic States
  const [shows, setShows] = useState<PerformanceShow[]>([]);
  const [bookings, setBookings] = useState<TicketReservation[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [galleryComments, setGalleryComments] = useState<Record<string, any[]>>({});
  const [leads, setLeads] = useState<ContactMessage[]>([]);

  // Show Editor Form States
  const [showTitle, setShowTitle] = useState("");
  const [showSubtitle, setShowSubtitle] = useState("");
  const [showDesc, setShowDesc] = useState("");
  const [showVenue, setShowVenue] = useState("");
  const [showLocation, setShowLocation] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [showDuration, setShowDuration] = useState("100 min");
  const [showPrice, setShowPrice] = useState("₹299");
  const [showStatus, setShowStatus] = useState<"upcoming" | "soldout" | "completed">("upcoming");
  const [showIsFeatured, setShowIsFeatured] = useState(false);
  const [editorSuccess, setEditorSuccess] = useState(false);
  const [editingPriceShowId, setEditingPriceShowId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");

  // Load all databases from localStorage
  const loadDatabase = () => {
    try {
      // 1. Shows
      const savedShows = localStorage.getItem("ajeeb_shows_store");
      if (savedShows) {
        setShows(JSON.parse(savedShows));
      } else {
        setShows(UPCOMING_EVENTS);
        localStorage.setItem("ajeeb_shows_store", JSON.stringify(UPCOMING_EVENTS));
      }

      // 2. Bookings
      const savedBookings = localStorage.getItem("ajeeb_bookings_store");
      setBookings(savedBookings ? JSON.parse(savedBookings) : []);

      // 3. Notes (Parchment Wall)
      const savedNotes = localStorage.getItem("ajeeb_parchments");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        // Fallback or leave empty
        setNotes([]);
      }

      // 4. Gallery Comments
      const savedComments = localStorage.getItem("ajeeb_gallery_comments_store");
      if (savedComments) {
        setGalleryComments(JSON.parse(savedComments));
      } else {
        const initialComments = {
          "gal-01": [
            { user: "storylover_jamshedpur", text: "The vibe at Cafe Regal was absolutely unreal! Can't wait for the next show.", date: "2 mins ago" },
            { user: "deepika_sen", text: "When Annesha started singin about her father, literal tears in the whole row.", date: "1 hour ago" }
          ],
          "gal-03": [
            { user: "caferegal_regular", text: "We love hosting Annesha! She brings absolute soul into this room.", date: "Yesterday" }
          ]
        };
        setGalleryComments(initialComments);
        localStorage.setItem("ajeeb_gallery_comments_store", JSON.stringify(initialComments));
      }

      // 5. Contact Inquiries / Leads
      const savedLeads = localStorage.getItem("ajeeb_contact_inquiries");
      setLeads(savedLeads ? JSON.parse(savedLeads) : []);

    } catch (e) {
      console.error("Local records loader fault:", e);
    }
  };

  useEffect(() => {
    loadDatabase();

    const handleGlobalUpdate = () => {
      loadDatabase();
    };

    window.addEventListener("ajeeb-state-updated", handleGlobalUpdate);
    return () => window.removeEventListener("ajeeb-state-updated", handleGlobalUpdate);
  }, []);

  // Recalculate metrics
  const getStats = (): AdminStats => {
    const active = shows.filter(s => s.status === "upcoming").length;
    const sold = bookings.reduce((acc, curr) => acc + curr.ticketsCount, 0);
    return {
      ticketsSold: sold,
      activeEvents: active,
      totalNotes: notes.length,
      contactLeads: leads.length
    };
  };

  const handleAuthenticationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    
    if (cleanPass === "1997" || cleanPass === "admin" || cleanPass === "annesha") {
      setIsAuthenticated(true);
      setErrorMessage("");
      setPasscode("");
    } else {
      setErrorMessage("Access Denied. Passphrase incorrect. Hint: try '1997' or 'admin'");
    }
  };

  // Create Show
  const handleCreateShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showTitle.trim() || !showVenue.trim() || !showDate.trim() || !showTime.trim()) {
      alert("Please enter title, venue, date and time.");
      return;
    }

    const newShow: PerformanceShow = {
      id: `show-${Date.now()}`,
      title: showTitle.trim(),
      subtitle: showSubtitle.trim() || "An Acoustic Musical Story Circle",
      description: showDesc.trim() || "An intimate acoustic musical storytelling tour spotlighting raw memories and vulnerability.",
      duration: showDuration,
      date: showDate,
      time: showTime,
      venue: showVenue.trim(),
      location: showLocation.trim() || "Jamshedpur, JH",
      price: showPrice.trim().startsWith("₹") ? showPrice.trim() : `₹${showPrice.trim()}`,
      status: showStatus,
      isFeatured: showIsFeatured
    };

    const updatedShows = [...shows, newShow];
    setShows(updatedShows);
    localStorage.setItem("ajeeb_shows_store", JSON.stringify(updatedShows));
    
    // Reset Form
    setShowTitle("");
    setShowSubtitle("");
    setShowDesc("");
    setShowVenue("");
    setShowLocation("");
    setShowDate("");
    setShowTime("");
    setShowDuration("100 min");
    setShowPrice("₹299");
    setShowStatus("upcoming");
    setShowIsFeatured(false);

    setEditorSuccess(true);
    setTimeout(() => setEditorSuccess(false), 3000);

    // Notify other components
    window.dispatchEvent(new Event("ajeeb-state-updated"));
  };

  // Update Show Status
  const handleToggleShowStatus = (id: string, nextStatus: "upcoming" | "soldout" | "completed") => {
    const updated = shows.map(s => {
      if (s.id === id) {
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setShows(updated);
    localStorage.setItem("ajeeb_shows_store", JSON.stringify(updated));
    window.dispatchEvent(new Event("ajeeb-state-updated"));
  };

  // Save Price
  const handleSavePrice = (id: string, newPrice: string) => {
    if (!newPrice.trim()) return;
    const formattedPrice = newPrice.trim().startsWith("₹") ? newPrice.trim() : `₹${newPrice.trim()}`;
    const updated = shows.map(s => {
      if (s.id === id) {
        return { ...s, price: formattedPrice };
      }
      return s;
    });
    setShows(updated);
    localStorage.setItem("ajeeb_shows_store", JSON.stringify(updated));
    window.dispatchEvent(new Event("ajeeb-state-updated"));
    setEditingPriceShowId(null);
  };

  // Toggle Featured status
  const handleToggleShowIsFeatured = (id: string) => {
    const updated = shows.map(s => {
      if (s.id === id) {
        return { ...s, isFeatured: !s.isFeatured };
      }
      return s;
    });
    setShows(updated);
    localStorage.setItem("ajeeb_shows_store", JSON.stringify(updated));
    window.dispatchEvent(new Event("ajeeb-state-updated"));
  };

  // Delete Show
  const handleDeleteShow = (id: string) => {
    if (confirm("Are you sure you want to remove this show event from the box office list?")) {
      const updated = shows.filter(s => s.id !== id);
      setShows(updated);
      localStorage.setItem("ajeeb_shows_store", JSON.stringify(updated));
      window.dispatchEvent(new Event("ajeeb-state-updated"));
    }
  };

  // Cancel Booking
  const handleDeleteBooking = (id: string) => {
    if (confirm("Cancel and delete this ticket reservation?")) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem("ajeeb_bookings_store", JSON.stringify(updated));
      window.dispatchEvent(new Event("ajeeb-state-updated"));
    }
  };

  // Delete Parchment Note
  const handleDeleteNote = (id: string) => {
    if (confirm("Delete this pinned parchment note? This cannot be undone.")) {
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      localStorage.setItem("ajeeb_parchments", JSON.stringify(updated));
      window.dispatchEvent(new Event("ajeeb-state-updated"));
    }
  };

  // Delete Gallery Comment
  const handleDeleteComment = (itemId: string, indexToDelete: number) => {
    if (confirm("Delete this spectator comment?")) {
      const copy = { ...galleryComments };
      if (copy[itemId]) {
        copy[itemId] = copy[itemId].filter((_, i) => i !== indexToDelete);
        setGalleryComments(copy);
        localStorage.setItem("ajeeb_gallery_comments_store", JSON.stringify(copy));
        window.dispatchEvent(new Event("ajeeb-state-updated"));
      }
    }
  };

  // Delete Contact Lead Inquiries
  const handleDeleteLead = (id: string) => {
    if (confirm("Delete this contact inquiry entry?")) {
      const updated = leads.filter((l: any) => l.id !== id);
      setLeads(updated);
      localStorage.setItem("ajeeb_contact_inquiries", JSON.stringify(updated));
      window.dispatchEvent(new Event("ajeeb-state-updated"));
    }
  };

  // Clear all databases entirely to defaults!
  const handleFullReset = () => {
    if (confirm("WARNING: Doing this will wipe out ALL dynamic comments, notes, show changes, and bookings, and revert the workspace database to static factory defaults. Continue?")) {
      localStorage.removeItem("ajeeb_shows_store");
      localStorage.removeItem("ajeeb_bookings_store");
      localStorage.removeItem("ajeeb_parchments");
      localStorage.removeItem("ajeeb_gallery_comments_store");
      localStorage.removeItem("ajeeb_contact_inquiries");
      loadDatabase();
      window.dispatchEvent(new Event("ajeeb-state-updated"));
      alert("Ajeeb-o-Gareeb database successfully reset back to pristine states.");
    }
  };

  const statMeta = getStats();

  return (
    <>
      {/* Absolute Admin Button placed gracefully in the Footer or corner */}
      <button
        onClick={() => {
          setIsOpen(true);
          loadDatabase();
        }}
        className="text-[11px] font-mono hover:text-[#bc4123] border border-[#2b1f17] hover:border-[#bc4123]/50 bg-black/40 px-3.5 py-1.5 rounded transition-all mt-4 cursor-pointer flex items-center gap-1 mx-auto text-[#a27b5c]"
        id="backstage-gate-btn"
      >
        <Lock size={11} className="text-[#bc4123]" />
        <span>Artists Space Login & Backstage Access</span>
      </button>

      {/* Main Admin Drawer Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
            
            {/* Authenticated Dashboard Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0806] border border-[#302117] rounded-2xl overflow-hidden w-full max-w-6xl shadow-2xl my-8 min-h-[80vh] flex flex-col"
              id="backstage-dashboard-body"
            >
              
              {/* Header Box */}
              <div className="bg-[#150f0c] border-b border-[#302117] p-5 sm:px-6 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded bg-[#bc4123]/20 flex items-center justify-center border border-[#bc4123]/40">
                    <ShieldCheck size={18} className="text-[#bc4123] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <span>Backstage Desk Control</span>
                      <span className="text-[10px] font-mono tracking-widest bg-[#bc4123] text-white px-2 py-0.5 rounded font-black">
                        OFFLINE-PERSISTENT
                      </span>
                    </h3>
                    <p className="text-[10px] font-mono text-[#a27b5c]">
                      ANNEHSA'S DIRECT PORTAL • JAMSHEDPUR STORYTELLER CO.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={handleFullReset}
                      className="text-[10px] bg-red-950/30 text-red-400 hover:bg-red-900 border border-red-900/60 font-mono px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
                      title="Clear database caches"
                    >
                      <RefreshCw size={11} />
                      Wipe Database
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsAuthenticated(false);
                    }}
                    className="text-xs uppercase font-mono tracking-wider text-[#a27b5c] hover:text-[#bc4123] bg-black/50 border border-[#302117] px-3.5 py-1.5 rounded transition"
                    id="backstage-gate-close"
                  >
                    Close Gate
                  </button>
                </div>
              </div>

              {/* AUTH PANEL (IF NOT LOGGED IN) */}
              {!isAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-6">
                  <div className="w-14 h-14 bg-[#1b120c] border border-[#52331f] rounded-full flex items-center justify-center text-[#e6b17a]">
                    <Lock size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">Backstage Verification Required</h4>
                    <p className="text-xs text-[#d1bfae] mt-1 leading-relaxed">
                      Please input your credentials to authorize scheduling changes, reservation analysis, and spectator comment deletion.
                    </p>
                  </div>

                  <form onSubmit={handleAuthenticationSubmit} className="w-full space-y-3">
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder="Enter security passcode..."
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setErrorMessage("");
                      }}
                      className="w-full text-center text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-4 py-3 rounded-lg focus:outline-none"
                      id="backstage-passcode-input"
                    />
                    
                    {errorMessage && (
                      <p className="text-[11px] text-red-500 bg-red-950/20 border border-red-900/40 py-2 px-3 rounded-md italic">
                        {errorMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 rounded-lg transition"
                      id="backstage-verify-submit"
                    >
                      Verify Passport Code
                    </button>
                  </form>

                  <p className="text-[10px] text-[#a27b5c] italic tracking-wide">
                    Default Passcode Hint: <span className="font-bold underline text-[#e6b17a]">1997</span> (Annesha's birth year) or <span className="font-bold">admin</span>
                  </p>
                </div>
              ) : (
                /* ACTUAL ADMIN INTERFACE WRAPPER */
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Left Column Tabs Selector */}
                  <div className="w-full md:w-[220px] bg-[#0c0806] border-b md:border-b-0 md:border-r border-[#302117] p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto scroller-none md:overflow-x-visible">
                    
                    <div className="hidden md:block px-3 py-2 text-[10px] font-mono tracking-widest text-[#a27b5c]/80 uppercase font-black">
                      OPERATIONS ROOM
                    </div>

                    {[
                      { id: "shows", label: "Concerts Manager", icon: Calendar, badge: shows.length },
                      { id: "reservations", label: "Reservations Desk", icon: Ticket, badge: bookings.length },
                      { id: "notes", label: "Pinboard Wall", icon: MessageSquare, badge: notes.length },
                      { id: "gallery", label: "Gallery Reactions", icon: Star, badge: Object.values(galleryComments).flat().length },
                      { id: "leads", label: "Contact Inbox", icon: Mail, badge: leads.length }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center justify-between gap-2.5 transition whitespace-nowrap md:whitespace-normal cursor-pointer ${
                            activeTab === tab.id
                              ? "bg-[#bc4123] text-white shadow-md border border-[#9d341c]"
                              : "text-[#d1bfae] hover:bg-[#150f0c] hover:text-[#e6b17a]"
                          }`}
                          id={`dash-tab-${tab.id}`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon size={14} />
                            <span>{tab.label}</span>
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? "bg-black/30 text-white"
                              : "bg-[#18110c] text-[#a27b5c]"
                          }`}>
                            {tab.badge}
                          </span>
                        </button>
                      );
                    })}

                    <div className="hidden md:block mt-auto bg-[#130d0a] border border-[#302117]/60 p-3.5 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] text-[#a27b5c] font-mono">
                        <span>METRIC STATUS</span>
                        <span className="text-[#3eda76] font-bold">LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-black/50 p-2 rounded border border-[#302117]/40">
                          <span className="text-[10px] text-[#a27b5c]/85 block font-mono">TIX SOLD</span>
                          <span className="text-sm font-serif font-bold text-[#e6b17a]">
                            {statMeta.ticketsSold}
                          </span>
                        </div>
                        <div className="bg-black/50 p-2 rounded border border-[#302117]/40">
                          <span className="text-[10px] text-[#a27b5c]/85 block font-mono">INBOX</span>
                          <span className="text-sm font-serif font-bold text-[#bc4123]">
                            {statMeta.contactLeads}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Dashboard Workspace Panel */}
                  <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-none select-text">
                    
                    {/* ————————————————— 1. CONCERTS SCHEDULER ————————————————— */}
                    {activeTab === "shows" && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Scheduled Musical Performances</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Add new shows to Cafe Regal, configure dates, or mark slots as 'soldout' in milliseconds! What you define here is instantly published to visitors.
                          </p>
                        </div>

                        {/* Combined Grid: Form entry and active shows list */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                          
                          {/* Create Show form */}
                          <form onSubmit={handleCreateShowSubmit} className="xl:col-span-5 bg-[#0e0a07] border border-[#302117] p-5 rounded-2xl space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#e6b17a] border-b border-[#302117]/50 pb-2 mb-2 flex items-center gap-1.5">
                              <Plus size={15} />
                              Publish New Performance Tour
                            </h5>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Show Title</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Ajeeb-o-Gareeb: In the Alleyways"
                                value={showTitle}
                                onChange={(e) => setShowTitle(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Subtitle/Motto</label>
                              <input
                                type="text"
                                placeholder="e.g. Unplugged Micro-Theater Night"
                                value={showSubtitle}
                                onChange={(e) => setShowSubtitle(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Venue</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Cafe Regal 35"
                                  value={showVenue}
                                  onChange={(e) => setShowVenue(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">City/State</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Jamshedpur, JH"
                                  value={showLocation}
                                  onChange={(e) => setShowLocation(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Date (YYYY-MM-DD)</label>
                                <input
                                  type="date"
                                  required
                                  value={showDate}
                                  onChange={(e) => setShowDate(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2.5 rounded focus:outline-none cursor-pointer"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Time Code</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 7:00 PM ILT"
                                  value={showTime}
                                  onChange={(e) => setShowTime(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Duration</label>
                                <input
                                  type="text"
                                  value={showDuration}
                                  onChange={(e) => setShowDuration(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Donation Seat Price</label>
                                <input
                                  type="text"
                                  placeholder="e.g. ₹299"
                                  value={showPrice}
                                  onChange={(e) => setShowPrice(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase block">Description Summary</label>
                              <textarea
                                rows={2}
                                value={showDesc}
                                onChange={(e) => setShowDesc(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white p-2.5 rounded focus:outline-none resize-none"
                                placeholder="Summary notes on what is performative..."
                              />
                            </div>

                            <div className="flex items-center justify-between py-1 bg-black/40 px-3 rounded border border-[#302117]/40">
                              <label className="text-xs text-[#d1bfae] cursor-pointer" htmlFor="back-featured-chk">
                                ★ Spotlight Homecoming
                              </label>
                              <input
                                type="checkbox"
                                id="back-featured-chk"
                                checked={showIsFeatured}
                                onChange={(e) => setShowIsFeatured(e.target.checked)}
                                className="rounded bg-[#070504] border-[#302117] text-[#bc4123] focus:ring-[#bc4123] cursor-pointer"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded transition"
                            >
                              Publish Live Event
                            </button>

                            {editorSuccess && (
                              <div className="bg-[#121c15] border border-[#235338] p-2 rounded text-xs text-[#a3f0c3] text-center flex items-center justify-center gap-1">
                                <Check size={12} />
                                <span>Event scheduled and saved in database!</span>
                              </div>
                            )}

                          </form>

                          {/* Active lists */}
                          <div className="xl:col-span-7 space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#d1bfae] border-b border-[#302117]/50 pb-2 mb-2 flex items-center gap-1.5">
                              Active Concert Catalogs list ({shows.length})
                            </h5>

                            {shows.length === 0 ? (
                              <p className="text-xs text-[#a27b5c] py-8 text-center italic">No events programmed into box office storage.</p>
                            ) : (
                              <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
                                {shows.map((item) => (
                                  <div key={item.id} className="bg-[#100a08] border border-[#302117] p-3.5 rounded-xl flex justify-between items-center gap-4 hover:border-[#422e22] transition-all">
                                    <div className="space-y-1 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold text-white ${
                                          item.status === "upcoming" ? "bg-green-800" : item.status === "soldout" ? "bg-amber-800" : "bg-stone-800"
                                        }`}>
                                          {item.status}
                                        </span>
                                        {item.isFeatured && (
                                          <span className="text-[9px] font-bold text-[#e6b17a] flex items-center gap-0.5 bg-[#20150d] px-1.5 py-0.5 rounded">
                                            <Star size={8} className="fill-[#e6b17a]" /> FEATURED
                                          </span>
                                        )}
                                      </div>
                                      <h6 className="font-serif text-sm font-bold text-white">{item.title}</h6>
                                      <p className="text-[10px] text-[#a27b5c] font-mono">
                                        Date: {item.date} • {item.time} • {item.venue}
                                      </p>

                                      {/* Price display with inline editor */}
                                      <div className="pt-1.5 flex items-center select-none">
                                        {editingPriceShowId === item.id ? (
                                          <div className="flex items-center gap-1.5 bg-[#080504] border border-[#bc4123]/50 px-2 py-1 rounded">
                                            <span className="text-[9px] text-[#a27b5c] font-mono uppercase">New Price:</span>
                                            <input
                                              type="text"
                                              value={editingPriceValue}
                                              onChange={(e) => setEditingPriceValue(e.target.value)}
                                              className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded w-16 text-center font-mono focus:outline-none focus:ring-1 focus:ring-[#bc4123]"
                                              placeholder="e.g. 299"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSavePrice(item.id, editingPriceValue);
                                                if (e.key === "Escape") setEditingPriceShowId(null);
                                              }}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleSavePrice(item.id, editingPriceValue)}
                                              className="text-[10px] text-green-400 hover:text-green-300 p-0.5 cursor-pointer"
                                              title="Save"
                                            >
                                              <Check size={11} className="stroke-[3]" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setEditingPriceShowId(null)}
                                              className="text-[10px] text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                                              title="Cancel"
                                            >
                                              <X size={11} className="stroke-[3]" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-[#a27b5c] font-mono uppercase">Price:</span>
                                            <span className="text-xs font-serif font-black text-[#e6b17a]">
                                              {item.price}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingPriceShowId(item.id);
                                                setEditingPriceValue(item.price);
                                              }}
                                              className="text-[9px] text-[#bc4123] hover:text-[#ce4c2a] underline cursor-pointer bg-[#0e0806] border border-[#302117] px-1.5 py-0.5 rounded transition"
                                            >
                                              Change
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action row controls */}
                                    <div className="flex flex-col items-end gap-1.5">
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShowStatus(item.id, "upcoming")}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition ${item.status === "upcoming" ? "bg-green-950 text-green-300 font-bold border border-green-800" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                          title="Set status: upcoming"
                                        >
                                          Live
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShowStatus(item.id, "soldout")}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition ${item.status === "soldout" ? "bg-amber-950 text-amber-300 font-bold border border-amber-800" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                          title="Set status: soldout"
                                        >
                                          SoldOut
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShowStatus(item.id, "completed")}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition ${item.status === "completed" ? "bg-stone-900 text-stone-300 font-bold border border-stone-700" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                          title="Set status: completed"
                                        >
                                          Done
                                        </button>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button 
                                          type="button"
                                          onClick={() => handleToggleShowIsFeatured(item.id)}
                                          className="text-[10px] font-mono text-[#a27b5c] hover:text-[#e6b17a]"
                                        >
                                          {item.isFeatured ? "★ Unstar" : "☆ Star"}
                                        </button>
                                        <span className="text-[#302117]">|</span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteShow(item.id)}
                                          className="text-red-500 hover:text-red-400 p-1 bg-red-950/20 rounded hover:bg-red-900 transition"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>

                        </div>
                      </div>
                    )}


                    {/* ————————————————— 2. BOOKINGS RESERVATIONS LIST ————————————————— */}
                    {activeTab === "reservations" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Ticket Sales & Registrations</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Monitor guests who booked digital simulated seat ticket passes for Jamshedpur showcases. Use list notes to contact guests on WhatsApp!
                          </p>
                        </div>

                        {bookings.length === 0 ? (
                          <div className="border border-dashed border-[#3e2c1f] p-12 text-center rounded-xl text-xs text-[#d1bfae]/60">
                            No active tickets sold yet. The booking vault database is clear.
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-[#302117] rounded-xl bg-black/40">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#150f0c] text-[#a27b5c] border-b border-[#302117] font-mono tracking-wider uppercase text-[9px]">
                                  <th className="p-3.5 pl-4">Pass ID</th>
                                  <th className="p-3.5">Guest & Contacts</th>
                                  <th className="p-3.5">Show Title</th>
                                  <th className="p-3.5">Seats</th>
                                  <th className="p-3.5">Booked date</th>
                                  <th className="p-3.5 text-right pr-4">Cancel</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#261c15]">
                                {bookings.map((booking) => (
                                  <tr key={booking.id} className="hover:bg-[#140e0a] transition-all">
                                    <td className="p-3.5 pl-4 font-mono text-[#bc4123] font-bold">
                                      {booking.id}
                                    </td>
                                    <td className="p-3.5 space-y-0.5">
                                      <p className="text-white font-bold">{booking.name}</p>
                                      <p className="text-[10px] text-[#d1bfae]/90 font-mono">{booking.email}</p>
                                      <p className="text-[10px] text-[#e6b17a] font-mono">{booking.phone}</p>
                                    </td>
                                    <td className="p-3.5 space-y-0.5 max-w-[200px]">
                                      <p className="text-white font-medium truncate">{booking.showTitle}</p>
                                      <p className="text-[10px] text-[#a27b5c]">{booking.date}</p>
                                    </td>
                                    <td className="p-3.5 font-bold text-[#e6b17a]">
                                      {booking.ticketsCount} Seats
                                    </td>
                                    <td className="p-3.5 text-[#a27b5c] font-mono text-[10px]">
                                      {booking.reservedAt}
                                    </td>
                                    <td className="p-3.5 text-right pr-4">
                                      <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="p-1 px-2 border border-[#8c2a1c]/40 text-red-400 hover:bg-red-950/40 hover:text-white transition rounded text-[10px] font-mono"
                                        title="Revoke pass"
                                      >
                                        Revoke
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}


                    {/* ————————————————— 3. PARCHMENT WALL MODERATION ————————————————— */}
                    {activeTab === "notes" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Spectator Memory Board Moderator</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Monitor notes left on the Parchment Story Wall by Café Regal audiences or university students. Instantly wipe out spam or inappropriate postings.
                          </p>
                        </div>

                        {notes.length === 0 ? (
                          <div className="border border-dashed border-[#3e2c1f] p-12 text-center rounded-xl text-xs text-[#d1bfae]/60">
                            The parchment board is current clean. No notes found.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {notes.map((note) => (
                              <div key={note.id} className="bg-[#120d0a] border border-[#2b1f16] p-4 rounded-xl relative hover:border-[#422e22] transition flex flex-col justify-between">
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="absolute top-2.5 right-2.5 p-1 bg-red-950/30 text-red-400 border border-red-900/40 rounded hover:bg-red-900 transition cursor-pointer"
                                  title="Delete Note"
                                >
                                  <Trash2 size={11} />
                                </button>
                                
                                <div className="space-y-2">
                                  <div className="text-[10px] font-mono text-[#a27b5c] flex justify-between pr-6 border-b border-[#302117]/50 pb-1.5">
                                    <span>{note.relation}</span>
                                    <span>{note.date || "June 2026"}</span>
                                  </div>
                                  <p className="text-xs italic text-stone-200 leading-relaxed font-serif select-text">
                                    "{note.text}"
                                  </p>
                                </div>

                                <div className="mt-4 pt-2 border-t border-[#302117]/30 flex justify-between items-center text-[10px] font-mono text-[#e6b17a]">
                                  <span>Author: {note.author}</span>
                                  <span className="text-[#bc4123] font-bold">ID: {note.id.split("-")[1] || "Static"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}


                    {/* ————————————————— 4. GALLERY COMMENTS MODERATION ————————————————— */}
                    {activeTab === "gallery" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Gallery Storyreel Reactions</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Monitor comments submitted on visual items or behind-the-scenes slides. High fidelity filtering keeps content safe.
                          </p>
                        </div>

                        {Object.values(galleryComments).flat().length === 0 ? (
                          <p className="text-xs text-[#a27b5c] py-8 text-center italic">No reactions written yet on any showcase reel.</p>
                        ) : (
                          <div className="space-y-6">
                            {Object.entries(galleryComments).map(([itemId, list]) => {
                              const listTyped = list as any[];
                              if (!listTyped || listTyped.length === 0) return null;
                              return (
                                <div key={itemId} className="bg-[#100a08] border border-[#2c1e15] p-5 rounded-xl space-y-4">
                                  <h5 className="font-mono text-xs text-[#e6b17a] font-bold tracking-wider uppercase border-b border-[#302117]/50 pb-2">
                                    COMMENTS ON REEL ID: <span className="text-white bg-[#bc4123] px-2 py-0.5 rounded font-bold">{itemId}</span>
                                  </h5>
                                  
                                  <div className="space-y-3">
                                    {listTyped.map((c: any, idx: number) => (
                                      <div key={idx} className="bg-black/50 border border-[#241710] p-3 rounded-lg flex justify-between items-start gap-4">
                                        <div className="space-y-0.5">
                                          <p className="text-xs text-white">
                                            <strong className="text-[#e6b17a] mr-2 font-bold font-mono">@{c.user}</strong>
                                            <span className="font-light italic select-text">"{c.text}"</span>
                                          </p>
                                          <span className="block text-[9px] font-mono text-[#a27b5c]">{c.date}</span>
                                        </div>

                                        <button
                                          onClick={() => handleDeleteComment(itemId, idx)}
                                          className="text-red-400 hover:text-white p-1 bg-red-950/20 rounded border border-red-900/30 hover:bg-red-900 transition cursor-pointer"
                                          title="Delete individual Comment"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}


                    {/* ————————————————— 5. CONTACT INBOX LEADS ————————————————— */}
                    {activeTab === "leads" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Contact Inbox Proposals ({leads.length})</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Read detailed booking proposals, show invitations, crowdfunding inquiries, and podcast collaborate applications sent through the online form.
                          </p>
                        </div>

                        {leads.length === 0 ? (
                          <div className="border border-dashed border-[#3e2c1f] p-12 text-center rounded-xl text-xs text-[#d1bfae]/60">
                            No inquiries submitted yet. Post a sample on the contact form to verify!
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {leads.map((lead: any) => (
                              <div key={lead.id} className="bg-[#120d0a] border border-[#3a271b] p-5 rounded-2xl relative hover:border-[#bc4123]/30 transition select-text">
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="absolute top-4 right-4 p-1.5 bg-red-950/30 text-red-400 border border-red-900/40 rounded-lg hover:bg-red-900 transition cursor-pointer"
                                  title="Delete inquiry"
                                >
                                  <Trash2 size={12} />
                                </button>

                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span className="bg-[#bc4123] text-white text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                                    {lead.subject || "Collaboration Detail"}
                                  </span>
                                  <span className="text-[10px] text-[#a27b5c] font-mono font-medium">
                                    {lead.sentAt || "Just now"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#302117]/50 pb-3 mb-3">
                                  <div>
                                    <span className="text-[10px] text-[#a27b5c] font-mono uppercase block">Sender Name</span>
                                    <span className="text-xs font-bold text-white uppercase">{lead.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-[#a27b5c] font-mono uppercase block">Email Address String</span>
                                    <span className="text-xs font-mono text-[#e6b17a] font-semibold">{lead.email}</span>
                                  </div>
                                </div>

                                <div className="space-y-1 bg-[#090605] border border-black/40 p-4 rounded-xl">
                                  <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">Proposing Message</span>
                                  <p className="text-xs text-stone-200 font-light leading-relaxed whitespace-pre-wrap select-text italic">
                                    "{lead.message}"
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
