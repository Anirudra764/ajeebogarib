import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Calendar, 
  Ticket, 
  Mail, 
  Star, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Lock, 
  MessageSquare,
  Settings,
  User,
  Image as ImageIcon
} from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";
import { PerformanceShow, GalleryItem, TicketReservation } from "../types";

export default function BackstageAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"shows" | "reservations" | "gallery" | "leads" | "settings">("shows");

  // Admin credentials auth form states
  const [emailInput, setEmailInput] = useState("anirudrapaul31@gmail.com");
  const [passwordInput, setPasswordInput] = useState("987654");
  const [authError, setAuthError] = useState("");
  const [isSignLoading, setIsSignLoading] = useState(false);

  // Retrieve states from centralized Ajeeb Context syncing directly with live Firestore
  const {
    shows,
    gallery,
    bookings,
    leads,
    comments,
    showDetails,
    performerBio,
    currentUser,
    signInWithEmail,
    signOutUser,
    updateShowDetails,
    updatePerformerBio,
    saveShow,
    deleteShow,
    saveGalleryItem,
    deleteGalleryItem,
    deleteComment,
    cancelReservation,
    deleteLead
  } = useAjeebData();

  // Determine administrative state
  const isAuthorizedAdmin = currentUser && currentUser.email === "anirudrapaul31@gmail.com";

  // Form input states for creating a new show
  const [showTitle, setShowTitle] = useState("");
  const [showSubtitle, setShowSubtitle] = useState("");
  const [showVenue, setShowVenue] = useState("");
  const [showLocation, setShowLocation] = useState("Jamshedpur, JH");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("7:00 PM ILT");
  const [showDuration, setShowDuration] = useState("120 mins");
  const [showPrice, setShowPrice] = useState("₹299");
  const [showDesc, setShowDesc] = useState("");
  const [showIsFeatured, setShowIsFeatured] = useState(false);

  // Editing state for show price
  const [editingPriceShowId, setEditingPriceShowId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");

  // Create local states for editing website details
  const [editedShowTitle, setEditedShowTitle] = useState("");
  const [editedBengaliTitle, setEditedBengaliTitle] = useState("");
  const [editedHindiTitle, setEditedHindiTitle] = useState("");
  const [editedTagline, setEditedTagline] = useState("");
  const [editedTaglineSec, setEditedTaglineSec] = useState("");
  const [editedAboutNarrative, setEditedAboutNarrative] = useState("");
  const [editedAudioSpotify, setEditedAudioSpotify] = useState("");

  const [editedPerfName, setEditedPerfName] = useState("");
  const [editedPerfSubtitle, setEditedPerfSubtitle] = useState("");
  const [editedPerfTitleText, setEditedPerfTitleText] = useState("");
  const [editedPerfBioLong, setEditedPerfBioLong] = useState("");
  const [editedStatListeners, setEditedStatListeners] = useState("");
  const [editedStatShows, setEditedStatShows] = useState("");
  const [editedStatCafes, setEditedStatCafes] = useState("");

  // Gallery publishing helper forms
  const [galTitle, setGalTitle] = useState("");
  const [galUrl, setGalUrl] = useState("");
  const [galType, setGalType] = useState<"photo" | "video">("photo");
  const [galCategory, setGalCategory] = useState<"live" | "bts" | "promo" | "quote">("live");
  const [galCaption, setGalCaption] = useState("");

  // Feedback flags
  const [editorSuccess, setEditorSuccess] = useState(false);
  const [gallerySuccess, setGallerySuccess] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Authenticate admin manually via Firebase Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSignLoading(true);

    try {
      await signInWithEmail(emailInput.trim(), passwordInput.trim());
      // Successful auth automatically binds user listener
    } catch (err: any) {
      console.error("[Backstage Admin Auth error]:", err);
      setAuthError(err.message || "Failed to authenticate dashboard passcode.");
    } finally {
      setIsSignLoading(false);
    }
  };

  // Pre-populate settings form input values when opening tab
  const handleOpenSettingsTab = () => {
    setEditedShowTitle(showDetails.title || "");
    setEditedBengaliTitle(showDetails.bengaliTitle || "");
    setEditedHindiTitle(showDetails.hindiTitle || "");
    setEditedTagline(showDetails.taglineMain || "");
    setEditedTaglineSec(showDetails.taglineSecondary || "");
    setEditedAboutNarrative(showDetails.aboutNarrative || "");
    setEditedAudioSpotify(showDetails.audioSpotifyLink || "");

    setEditedPerfName(performerBio.name || "");
    setEditedPerfSubtitle(performerBio.subtitle || "");
    setEditedPerfTitleText(performerBio.bioTitle || "");
    setEditedPerfBioLong(performerBio.biographyDetailed || "");

    setEditedStatListeners(performerBio.metrics?.monthlyListeners || "5K+");
    setEditedStatShows(performerBio.metrics?.completedSessions || "24+");
    setEditedStatCafes(performerBio.metrics?.partneredOutlets || "12+");
    
    setActiveTab("settings");
  };

  // Submit show details modifications
  const handleUpdateSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);

    try {
      const updatedDetails = {
        ...showDetails,
        title: editedShowTitle,
        bengaliTitle: editedBengaliTitle,
        hindiTitle: editedHindiTitle,
        taglineMain: editedTagline,
        taglineSecondary: editedTaglineSec,
        aboutNarrative: editedAboutNarrative,
        audioSpotifyLink: editedAudioSpotify
      };

      const updatedBio = {
        ...performerBio,
        name: editedPerfName,
        subtitle: editedPerfSubtitle,
        bioTitle: editedPerfTitleText,
        biographyDetailed: editedPerfBioLong,
        metrics: {
          monthlyListeners: editedStatListeners,
          completedSessions: editedStatShows,
          partneredOutlets: editedStatCafes
        }
      };

      await updateShowDetails(updatedDetails);
      await updatePerformerBio(updatedBio);

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle publishing a new show Event
  const handleCreateShowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorSuccess(false);

    const newShow: PerformanceShow = {
      id: `show-${Date.now()}`,
      title: showTitle,
      subtitle: showSubtitle,
      description: showDesc,
      duration: showDuration,
      date: showDate,
      time: showTime,
      venue: showVenue,
      location: showLocation,
      price: showPrice,
      status: "upcoming",
      isFeatured: showIsFeatured
    };

    const ok = await saveShow(newShow);
    if (ok) {
      setEditorSuccess(true);
      setTimeout(() => setEditorSuccess(false), 3000);

      // Reset form variables
      setShowTitle("");
      setShowSubtitle("");
      setShowVenue("");
      setShowDesc("");
      setShowIsFeatured(false);
    }
  };

  // Handle publishing new gallery items
  const handlePublishGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGallerySuccess(false);

    const newItem: Partial<GalleryItem> = {
      title: galTitle,
      url: galUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80",
      type: galType,
      category: galCategory,
      caption: galCaption,
      likes: 0,
      comments: 0
    };

    const ok = await saveGalleryItem(newItem);
    if (ok) {
      setGallerySuccess(true);
      setTimeout(() => setGallerySuccess(false), 3000);

      // Reset
      setGalTitle("");
      setGalUrl("");
      setGalCaption("");
    }
  };

  // Delete dynamic show posting
  const handleDeleteShow = async (id: string) => {
    if (confirm("Delete this storytelling dynamic event permanently?")) {
      await deleteShow(id);
    }
  };

  // Delete dynamic gallery card
  const handleDeleteGallery = async (id: string) => {
    if (confirm("Delete this gallery storyreel item?")) {
      await deleteGalleryItem(id);
    }
  };

  // Toggle dynamic ticket state status
  const handleToggleShowStatus = async (id: string, nextStatus: "upcoming" | "soldout" | "completed") => {
    const show = shows.find(s => s.id === id);
    if (show) {
      await saveShow({
        ...show,
        status: nextStatus
      });
    }
  };

  // Toggle Spotlights Status
  const handleToggleShowIsFeatured = async (id: string) => {
    const show = shows.find(s => s.id === id);
    if (show) {
      await saveShow({
        ...show,
        isFeatured: !show.isFeatured
      });
    }
  };

  // Edit show price inline
  const handleSavePrice = async (id: string, val: string) => {
    const show = shows.find(s => s.id === id);
    if (show) {
      await saveShow({
        ...show,
        price: val
      });
      setEditingPriceShowId(null);
    }
  };

  // Deletion proxies
  const handleDeleteCommentRow = async (photoId: string, itemIdx: number) => {
    if (confirm("Moderate and prune this spectator comment?")) {
      const comms = comments[photoId];
      if (comms && comms[itemIdx]) {
        await deleteComment(photoId, comms[itemIdx].id);
      }
    }
  };

  const handleDeleteLeadRow = async (id: string) => {
    if (confirm("Archive and remove this inbox business inquiry lead?")) {
      await deleteLead(id);
    }
  };

  const handleDeleteBookingRow = async (id: string) => {
    if (confirm("Revoke this ticket seat reservation?")) {
      await cancelReservation(id);
    }
  };

  // Simple statistics metadata counter
  const ticketsSold = bookings.reduce((sum, b) => sum + (b.ticketsCount || 0), 0);

  return (
    <>
      {/* Footer trigger button overlay entry point */}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="text-[11px] font-mono hover:text-[#bc4123] border border-[#2b1f17] hover:border-[#bc4123]/50 bg-black/40 px-3.5 py-1.5 rounded-lg transition-all mt-4 cursor-pointer flex items-center justify-center gap-1.5 mx-auto text-[#a27b5c]"
        id="backstage-gate-btn"
      >
        <Lock size={12} className="text-[#bc4123]" />
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
              className="bg-[#0c0806] border border-[#302117] rounded-2xl overflow-hidden w-full max-w-6xl shadow-2xl my-8 min-h-[85vh] flex flex-col select-text"
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
                      {isAuthorizedAdmin && (
                        <span className="text-[10px] font-mono tracking-widest bg-[#bc4123] text-white px-2 py-0.5 rounded font-black uppercase">
                          Authorized Admin
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] font-mono text-[#a27b5c]">
                      ANNEHSA'S DIRECT PORTAL • CLOUD INTEGRATED SECURE TERMINAL
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentUser && (
                    <button
                      onClick={async () => {
                        await signOutUser();
                      }}
                      className="text-[10px] bg-red-950/20 text-red-400 hover:bg-red-900/40 border border-red-900/60 font-mono px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="text-xs uppercase font-mono tracking-wider text-[#a27b5c] hover:text-[#bc4123] bg-black/50 border border-[#302117] px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                    id="backstage-gate-close"
                  >
                    Close Gate
                  </button>
                </div>
              </div>

              {/* AUTH PANEL (IF NOT ADMIN LOGGED IN) */}
              {!isAuthorizedAdmin ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-6">
                  <div className="w-14 h-14 bg-[#1b120c] border border-[#52331f] rounded-full flex items-center justify-center text-[#e6b17a]">
                    <Lock size={24} className="animate-bounce text-[#bc4123]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">Backstage Verification Required</h4>
                    <p className="text-xs text-[#d1bfae] mt-1.5 leading-relaxed">
                      Verify your administrative credentials below to unlock schedule changes, comments moderation, and real-time website information overrides.
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="w-full space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Admin Email</label>
                      <input
                        type="email"
                        required
                        placeholder="Enter email..."
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setAuthError("");
                        }}
                        className="w-full text-xs font-mono bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Security Passcode / Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter secret passcode..."
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setAuthError("");
                        }}
                        className="w-full text-xs font-mono bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded-lg focus:outline-none"
                      />
                    </div>

                    {authError && (
                      <p className="text-[11px] text-red-500 bg-red-950/20 border border-red-900/40 py-2 px-3 rounded-md italic">
                        {authError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSignLoading}
                      className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 rounded-lg transition cursor-pointer disabled:opacity-50"
                      id="backstage-verify-submit"
                    >
                      {isSignLoading ? "Verifying Credentials..." : "Authenticate Admin Session"}
                    </button>
                  </form>

                  <p className="text-[10px] text-[#a27b5c] italic tracking-normal border border-[#3a2212]/40 bg-[#160f0b]/40 rounded p-2.5">
                    Admin access configured: <span className="font-bold text-[#e6b17a]">anirudrapaul31@gmail.com</span> with password <span className="font-bold text-[#e6b17a]">987654</span>. Enter credentials to log in!
                  </p>
                </div>
              ) : (
                /* ACTUAL ADMIN INTERFACE WRAPPER */
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Left Column Tabs Selector */}
                  <div className="w-full md:w-[220px] bg-[#0c0806] border-b md:border-b-0 md:border-r border-[#302117] p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto scroller-none md:overflow-x-visible shrink-0">
                    
                    <div className="hidden md:block px-3 py-2 text-[10px] font-mono tracking-widest text-[#a27b5c]/80 uppercase font-black">
                      OPERATIONS ROOM
                    </div>

                    {[
                      { id: "shows", label: "Concerts Scheduler", icon: Calendar, badge: shows.length },
                      { id: "reservations", label: "Bookings Desk", icon: Ticket, badge: bookings.length },
                      { id: "leads", label: "Contact Inbox", icon: Mail, badge: leads.length },
                      { id: "gallery", label: "Showreel Gallery", icon: Star, badge: `${gallery.length} posts` },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center justify-between gap-2.5 transition whitespace-nowrap cursor-pointer ${
                            activeTab === tab.id
                              ? "bg-[#bc4123] text-white shadow-md border border-[#9d341c]"
                              : "text-[#d1bfae] hover:bg-[#150f0c] hover:text-[#e6b17a]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon size={14} />
                            <span>{tab.label}</span>
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.id ? "bg-black/30 text-white" : "bg-[#18110c] text-[#a27b5c]"
                          }`}>
                            {tab.badge}
                          </span>
                        </button>
                      );
                    })}

                    <button
                      onClick={handleOpenSettingsTab}
                      className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center justify-between gap-2.5 transition whitespace-nowrap cursor-pointer ${
                        activeTab === "settings"
                          ? "bg-[#bc4123] text-white shadow-md border border-[#9d341c]"
                          : "text-[#d1bfae] hover:bg-[#150f0c] hover:text-[#e6b17a]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Settings size={14} />
                        <span>Override Site Copy</span>
                      </span>
                      <span className="text-[10px] font-mono text-green-400 font-bold uppercase animate-pulse">
                        Any
                      </span>
                    </button>

                    <div className="hidden md:block mt-auto bg-[#130d0a] border border-[#302117]/60 p-3.5 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] text-[#a27b5c] font-mono">
                        <span>METRIC STATUS</span>
                        <span className="text-[#3eda76] font-bold uppercase">Cloud Sync</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-black/50 p-2 rounded border border-[#302117]/40">
                          <span className="text-[10px] text-[#a27b5c]/85 block font-mono">SEATS SOLD</span>
                          <span className="text-sm font-serif font-bold text-[#e6b17a]">
                            {ticketsSold}
                          </span>
                        </div>
                        <div className="bg-black/50 p-2 rounded border border-[#302117]/40">
                          <span className="text-[10px] text-[#a27b5c]/85 block font-mono">INBOX</span>
                          <span className="text-sm font-serif font-bold text-[#bc4123]">
                            {leads.length}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Dashboard Workspace Panel */}
                  <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[65vh] md:max-h-none select-text">
                    
                    {/* ————————————————— 1. CONCERTS SCHEDULER ————————————————— */}
                    {activeTab === "shows" && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Scheduled Performance Concerts</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Publish new concert events, mark slots as "soldout", or edit pricing. What you perform here is instantly published to everyone in real-time.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                          
                          {/* Create Show form */}
                          <form onSubmit={handleCreateShowSubmit} className="xl:col-span-12 lg:xl:col-span-5 bg-[#0e0a07] border border-[#302117] p-5 rounded-2xl space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#e6b17a] border-b border-[#302117]/50 pb-2 mb-2 flex items-center gap-1.5">
                              <Plus size={15} />
                              Add New Tour Performance
                            </h5>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Show Title</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Ajeeb-o-Gareeb: Jamshedpur Unplugged"
                                value={showTitle}
                                onChange={(e) => setShowTitle(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Subtitle/Tagline</label>
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
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Venue Room</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Café Regal, Jamshedpur"
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
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Time Slot</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 7:00 PM IST"
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
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Ticket Seat Price</label>
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
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase block">Event Description Brief</label>
                              <textarea
                                rows={2}
                                value={showDesc}
                                onChange={(e) => setShowDesc(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white p-2.5 rounded focus:outline-none resize-none"
                                placeholder="Details about this narrative show details..."
                              />
                            </div>

                            <div className="flex items-center justify-between py-1 bg-black/40 px-3 rounded border border-[#302117]/40">
                              <label className="text-xs text-[#d1bfae] cursor-pointer" htmlFor="back-featured-chk">
                                ★ Spotlight Event Card (Featured on Home)
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
                              className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                            >
                              Publish Live Event
                            </button>

                            {editorSuccess && (
                              <div className="bg-[#121c15] border border-[#235338] p-2 rounded text-xs text-[#a3f0c3] text-center flex items-center justify-center gap-1">
                                <Check size={12} />
                                <span>Event scheduled and saved in dynamic database!</span>
                              </div>
                            )}
                          </form>

                          {/* Active lists */}
                          <div className="xl:col-span-12 space-y-4 pt-4">
                            <h5 className="font-serif text-sm font-bold text-[#d1bfae] border-b border-[#302117]/50 pb-2 mb-2">
                              Active Concert Catalogs ({shows.length})
                            </h5>

                            {shows.length === 0 ? (
                              <p className="text-xs text-[#a27b5c] py-8 text-center italic">No dynamic events found in Database.</p>
                            ) : (
                              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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
                                            <Star size={8} className="fill-[#e6b17a]" /> SPOTLIGHT
                                          </span>
                                        )}
                                      </div>
                                      <h6 className="font-serif text-sm font-bold text-white">{item.title}</h6>
                                      <p className="text-[10px] text-[#a27b5c] font-mono">
                                        {item.date} • {item.time} • {item.venue}
                                      </p>

                                      <div className="pt-1.5 flex items-center">
                                        {editingPriceShowId === item.id ? (
                                          <div className="flex items-center gap-1.5 bg-[#080504] border border-[#bc4123]/50 px-2 py-1 rounded">
                                            <span className="text-[9px] text-[#a27b5c] font-mono uppercase">New Price:</span>
                                            <input
                                              type="text"
                                              value={editingPriceValue}
                                              onChange={(e) => setEditingPriceValue(e.target.value)}
                                              className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded w-16 text-center font-mono focus:outline-none"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSavePrice(item.id, editingPriceValue);
                                                if (e.key === "Escape") setEditingPriceShowId(null);
                                              }}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleSavePrice(item.id, editingPriceValue)}
                                              className="text-[10px] text-green-400 p-0.5 cursor-pointer"
                                            >
                                              <Check size={11} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setEditingPriceShowId(null)}
                                              className="text-[10px] text-red-400 p-0.5 cursor-pointer"
                                            >
                                              <X size={11} />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-[#a27b5c] font-mono uppercase">Cost:</span>
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
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition cursor-pointer ${item.status === "upcoming" ? "bg-green-950 text-green-300 font-bold border border-green-800" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                        >
                                          Live
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShowStatus(item.id, "soldout")}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition cursor-pointer ${item.status === "soldout" ? "bg-amber-950 text-amber-300 font-bold border border-amber-800" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                        >
                                          Sold
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShowStatus(item.id, "completed")}
                                          className={`text-[9px] font-mono px-2 py-1 rounded transition cursor-pointer ${item.status === "completed" ? "bg-stone-900 text-stone-300 font-bold border border-stone-700" : "bg-black/40 text-stone-400 border border-transparent hover:bg-stone-800"}`}
                                        >
                                          Done
                                        </button>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button 
                                          type="button"
                                          onClick={() => handleToggleShowIsFeatured(item.id)}
                                          className="text-[10px] font-mono text-[#a27b5c] hover:text-[#e6b17a] cursor-pointer"
                                        >
                                          {item.isFeatured ? "★ Un spotlight" : "☆ Spotlight"}
                                        </button>
                                        <span className="text-[#302117]">|</span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteShow(item.id)}
                                          className="text-red-500 hover:text-red-400 p-1 bg-red-950/20 rounded hover:bg-red-900 transition cursor-pointer"
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
                            Audience members who booked and signed reservation passes on your website. Use contacts to trace admissions.
                          </p>
                        </div>

                        {bookings.length === 0 ? (
                          <div className="border border-dashed border-[#3e2c1f] p-12 text-center rounded-xl text-xs text-[#d1bfae]/60">
                            No reservations yet. The tickets database is clear.
                          </div>
                        ) : (
                          <div className="overflow-x-auto border border-[#302117] rounded-xl bg-black/40">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-[#150f0c] text-[#a27b5c] border-b border-[#302117] font-mono tracking-wider uppercase text-[9px]">
                                  <th className="p-3.5 pl-4">Pass ID</th>
                                  <th className="p-3.5">Guest & Contacts</th>
                                  <th className="p-3.5">Show Event</th>
                                  <th className="p-3.5">Seats Count</th>
                                  <th className="p-3.5">Approved At</th>
                                  <th className="p-3.5 text-right pr-4">Revoke</th>
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
                                        onClick={() => handleDeleteBookingRow(booking.id)}
                                        className="p-1 px-2 border border-[#8c2a1c]/40 text-red-400 hover:bg-red-950/40 hover:text-white transition rounded text-[10px] font-mono cursor-pointer"
                                      >
                                        Delete
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

                    {/* ————————————————— 3. GALLERY SHOWREEL MANAGER ————————————————— */}
                    {activeTab === "gallery" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Gallery Storyreels & Comments Moderator</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Prune and publish visual items, live moments, backstage secrets, and quotes. You can also view or moderate active guest comments on each reel instantly!
                          </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                          
                          {/* Publish Gallery Item Form */}
                          <form onSubmit={handlePublishGallerySubmit} className="xl:col-span-5 bg-[#0e0a07] border border-[#302117] p-5 rounded-2xl space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#e6b17a] border-b border-[#302117]/50 pb-2 flex items-center gap-1.5">
                              <ImageIcon size={15} />
                              Insert New Media Element
                            </h5>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Media Title</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Acoustic Rehearsals at Cafe Regal"
                                value={galTitle}
                                onChange={(e) => setGalTitle(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Media URL Link</label>
                              <input
                                type="url"
                                required
                                placeholder="https://images.unsplash.com/..."
                                value={galUrl}
                                onChange={(e) => setGalUrl(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Core Type</label>
                                <select
                                  value={galType}
                                  onChange={(e: any) => setGalType(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-2.5 py-2 rounded focus:outline-none cursor-pointer"
                                >
                                  <option value="photo">Photo Post</option>
                                  <option value="video">Video Reel</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Billboard Category</label>
                                <select
                                  value={galCategory}
                                  onChange={(e: any) => setGalCategory(e.target.value)}
                                  className="w-full text-xs bg-[#070504] border border-[#302117] text-white px-2.5 py-2 rounded focus:outline-none cursor-pointer"
                                >
                                  <option value="live">LiveMoments</option>
                                  <option value="bts">Behind the Stage (BTS)</option>
                                  <option value="promo">Promo & Podcast</option>
                                  <option value="quote">Words & Quotes</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Description Caption</label>
                              <textarea
                                rows={2}
                                value={galCaption}
                                onChange={(e) => setGalCaption(e.target.value)}
                                className="w-full text-xs bg-[#070504] border border-[#302117] text-white p-2.5 rounded focus:outline-none resize-none"
                                placeholder="Aesthetic details or quotes..."
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                            >
                              Publish Media Element
                            </button>

                            {gallerySuccess && (
                              <div className="bg-[#121c15] border border-[#235338] p-2 rounded text-xs text-[#a3f0c3] text-center flex items-center justify-center gap-1">
                                <Check size={12} />
                                <span>Media item uploaded to dynamic showreel successfully!</span>
                              </div>
                            )}

                          </form>

                          {/* Existing Gallery Lists and commenting */}
                          <div className="xl:col-span-7 space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#d1bfae] border-b border-[#302117]/50 pb-2 mb-2">
                              Showreel Media Items ({gallery.length})
                            </h5>

                            <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                              {gallery.map((g) => (
                                <div key={g.id} className="bg-black/60 border border-[#261c14] rounded-lg p-2 flex gap-3.5 relative hover:border-[#bc4123]/30 transition-all">
                                  <div className="w-14 h-14 bg-[#1f1610] rounded overflow-hidden shrink-0">
                                    <img src={g.url} alt={g.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div className="text-[11px] space-y-0.5 flex-1 min-w-0">
                                    <span className="text-[8px] bg-red-950 text-red-300 font-mono px-1 py-0.5 rounded font-black uppercase">
                                      {g.category}
                                    </span>
                                    <p className="text-white font-bold truncate">{g.title}</p>
                                    <p className="text-[#a27b5c] font-mono text-[9px]">
                                      ♥ {g.likes} likes • 💬 {comments[g.id]?.length || g.comments} comments
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteGallery(g.id)}
                                    className="absolute bottom-1.5 right-1.5 p-1 bg-red-950/20 text-red-400 hover:bg-red-900 rounded hover:text-white transition cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <h5 className="font-serif text-sm font-bold text-[#d1bfae] border-b border-[#302117]/50 pb-2 mt-6">
                              Gallery Reaction Comments
                            </h5>

                            {Object.keys(comments).length === 0 ? (
                              <p className="text-xs text-[#a27b5c] italic">No guest feedback comments found.</p>
                            ) : (
                              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                                {Object.entries(comments).map(([photoId, comms]) => {
                                  const commsList = comms as any[];
                                  if (!commsList || commsList.length === 0) return null;
                                  const parentItem = gallery.find(g => g.id === photoId);
                                  return (
                                    <div key={photoId} className="bg-[#100a08] border border-[#2c1e15] p-3.5 rounded-xl space-y-2">
                                      <div className="text-[10px] font-mono text-[#e6b17a] font-black border-b border-[#302117]/50 pb-1 flex justify-between uppercase">
                                        <span>Item: {parentItem?.title || photoId}</span>
                                        <span>({commsList.length} rows)</span>
                                      </div>
                                      <div className="space-y-2">
                                        {commsList.map((c: any, idx: number) => (
                                          <div key={idx} className="bg-black/30 border border-black/40 p-2 rounded flex justify-between items-start gap-4">
                                            <div className="text-[11px] leading-snug">
                                              <strong className="text-[#e6b17a] font-mono mr-1">@{c.user}</strong>
                                              <span className="text-stone-300 italic">"{c.text}"</span>
                                              <span className="block text-[8px] font-mono text-[#a27b5c] mt-0.5">{c.date}</span>
                                            </div>
                                            <button
                                              onClick={() => handleDeleteCommentRow(photoId, idx)}
                                              className="text-red-400 p-0.5 hover:text-red-300 transition cursor-pointer"
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
                        </div>
                      </div>
                    )}

                    {/* ————————————————— 4. CONTACT INBOX LEADS ————————————————— */}
                    {activeTab === "leads" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Contact Inbox Proposals ({leads.length})</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Read custom inquiries, show sponsorships, crowdfunding pitches, and cafe scheduling invitations.
                          </p>
                        </div>

                        {leads.length === 0 ? (
                          <div className="border border-dashed border-[#3e2c1f] p-12 text-center rounded-xl text-xs text-[#d1bfae]/60">
                            No inquiries in contact mailbox. Database is clear.
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                            {leads.map((lead: any) => (
                              <div key={lead.id} className="bg-[#120d0a] border border-[#3a271b] p-5 rounded-2xl relative hover:border-[#bc4123]/30 transition select-text">
                                <button
                                  onClick={() => handleDeleteLeadRow(lead.id)}
                                  className="absolute top-4 right-4 p-1.5 bg-red-950/30 text-red-400 border border-red-900/40 rounded-lg hover:bg-red-900 transition cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>

                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <span className="bg-[#bc4123] text-white text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                                    {lead.subject || "Collaboration Detail"}
                                  </span>
                                  <span className="text-[10px] text-[#a27b5c] font-mono font-medium">
                                    {new Date(lead.sentAt).toLocaleString("en-IN")}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#302117]/50 pb-3 mb-3">
                                  <div>
                                    <span className="text-[10px] text-[#a27b5c] font-mono uppercase block">Sender Name</span>
                                    <span className="text-xs font-bold text-white uppercase">{lead.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-[#a27b5c] font-mono uppercase block">Email Address</span>
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

                    {/* ————————————————— 5. SITE COPY PARAMETERS OVERRIDES ————————————————— */}
                    {activeTab === "settings" && (
                      <form onSubmit={handleUpdateSettingsSubmit} className="space-y-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white mb-1.5">Override Website Copy & Information Details</h4>
                          <p className="text-xs text-[#d1bfae]">
                            Correct general typos, edit tagline headers, adapt the Jamshedpur bio details, or configure Spotify embeds! What you modify here automatically, instantly updates across all spectators in real-time.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                          
                          {/* Main Home Details */}
                          <div className="bg-[#120e0c] border border-[#34241a] p-5 rounded-2xl space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#e6b17a] border-b border-[#302117] pb-2 flex items-center gap-1.5">
                              <Settings size={14} className="text-[#bc4123]" />
                              Homepage Branding details
                            </h5>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Show Logo Title</label>
                              <input
                                type="text"
                                required
                                value={editedShowTitle}
                                onChange={(e) => setEditedShowTitle(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Bengali script Logo</label>
                                <input
                                  type="text"
                                  value={editedBengaliTitle}
                                  onChange={(e) => setEditedBengaliTitle(e.target.value)}
                                  className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Hindi script Logo</label>
                                  <input
                                  type="text"
                                  value={editedHindiTitle}
                                  onChange={(e) => setEditedHindiTitle(e.target.value)}
                                  className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Hero Tagline Primary</label>
                              <input
                                type="text"
                                required
                                value={editedTagline}
                                onChange={(e) => setEditedTagline(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Hero Tagline Secondary</label>
                              <input
                                type="text"
                                required
                                value={editedTaglineSec}
                                onChange={(e) => setEditedTaglineSec(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">About Narrative Block</label>
                              <textarea
                                rows={4}
                                required
                                value={editedAboutNarrative}
                                onChange={(e) => setEditedAboutNarrative(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white p-2.5 rounded focus:outline-none resize-none leading-relaxed"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Spotify PODCAST EMBED (IFRAME SRC LINK)</label>
                              <input
                                type="text"
                                value={editedAudioSpotify}
                                onChange={(e) => setEditedAudioSpotify(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none font-mono"
                              />
                            </div>
                          </div>

                          {/* Performer Details */}
                          <div className="bg-[#120e0c] border border-[#34241a] p-5 rounded-2xl space-y-4">
                            <h5 className="font-serif text-sm font-bold text-[#e6b17a] border-b border-[#302117] pb-2 flex items-center gap-1.5">
                              <User size={14} className="text-[#bc4123]" />
                              Artist Biography & Stats Details
                            </h5>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Artist Name</label>
                              <input
                                type="text"
                                required
                                value={editedPerfName}
                                onChange={(e) => setEditedPerfName(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Artist Role/Subtitle</label>
                              <input
                                type="text"
                                required
                                value={editedPerfSubtitle}
                                onChange={(e) => setEditedPerfSubtitle(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Biographical Hook</label>
                              <input
                                type="text"
                                required
                                value={editedPerfTitleText}
                                onChange={(e) => setEditedPerfTitleText(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-[#a27b5c] uppercase">Biography narrative markdown</label>
                              <textarea
                                rows={4}
                                required
                                value={editedPerfBioLong}
                                onChange={(e) => setEditedPerfBioLong(e.target.value)}
                                className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white p-2.5 rounded focus:outline-none resize-none leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold text-[#a27b5c] uppercase">Listeners count</label>
                                <input
                                  type="text"
                                  required
                                  value={editedStatListeners}
                                  onChange={(e) => setEditedStatListeners(e.target.value)}
                                  className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none font-mono text-center"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold text-[#a27b5c] uppercase">Concerts Finished</label>
                                <input
                                  type="text"
                                  required
                                  value={editedStatShows}
                                  onChange={(e) => setEditedStatShows(e.target.value)}
                                  className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none font-mono text-center"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold text-[#a27b5c] uppercase">Cafe partnerships</label>
                                <input
                                  type="text"
                                  required
                                  value={editedStatCafes}
                                  onChange={(e) => setEditedStatCafes(e.target.value)}
                                  className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] text-white px-3 py-2 rounded focus:outline-none font-mono text-center"
                                />
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-[#302117] shrink-0">
                          {settingsSuccess && (
                            <span className="text-xs text-green-400 font-serif italic animate-bounce flex items-center gap-1">
                              <Check size={12} /> Modifications propagated and pushed to Firestore successfully!
                            </span>
                          )}
                          <div />
                          <button
                            type="submit"
                            className="bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow transition cursor-pointer"
                          >
                            Propagate Changes Globally
                          </button>
                        </div>
                      </form>
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
