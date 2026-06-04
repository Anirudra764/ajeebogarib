import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Instagram, Youtube, Compass, Filter, Share2, CornerDownRight } from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";
import { GalleryItem } from "../types";

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<"all" | "live" | "bts" | "promo" | "quote">("all");
  const { gallery: items, comments: commentsStore, likeGalleryItem, addComment, currentUser } = useAjeebData();
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  
  const [newCommentUser, setNewCommentUser] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    if (currentUser) {
      setNewCommentUser(currentUser.displayName || currentUser.email?.split("@")[0] || "");
    } else {
      setNewCommentUser("");
    }
  }, [currentUser]);

  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter(it => it.category === activeTab);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    likeGalleryItem(id);
  };

  const handleAddComment = async (itemId: string) => {
    if (!newCommentText.trim()) return;
    const author = newCommentUser.trim() || "Anonymous Storyteller";
    
    await addComment(itemId, author, newCommentText.trim());

    setNewCommentText("");
    setNewCommentUser("");
  };

  const tabs = [
    { id: "all", label: "Show All" },
    { id: "live", label: "Live Moments" },
    { id: "bts", label: "Behind The Stage" },
    { id: "promo", label: "Podcasts & Promos" },
    { id: "quote", label: "Words & Quotes" }
  ];

  return (
    <section
      id="gallery"
      className="py-24 bg-[#140e0a] border-t border-b border-[#302117]/40 relative"
    >
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-[#e6b17a]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Headings */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs text-[#bc4123] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 mb-2">
            <Instagram size={14} className="text-[#e6b17a]" />
            @ajeebogareeblive • On Instagram & Bio link
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight mb-4">
            Showreel & Visual Stories
          </h2>
          <div className="w-16 h-1 bg-[#bc4123] mx-auto mb-6"></div>
          <p className="text-[#d1bfae] text-sm max-w-xl mx-auto mb-6">
            Glimpses of raw emotions, live musical rehearsals, behind the scenes script-writings, and clips from Jamshedpur cafes. Click on any card to interact or comment!
          </p>

          {/* Social Badges Row */}
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.instagram.com/ajeebogareeblive/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#20130e] hover:bg-[#342016] text-[#e6b17a] border border-[#52331f] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
              id="gallery-ig-live"
            >
              <Instagram size={14} />
              <span>@ajeebogareeblive</span>
            </a>
            <a
              href="https://www.instagram.com/anneshapartha/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#20130e] hover:bg-[#342016] text-[#e6b17a] border border-[#52331f] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
              id="gallery-ig-annesha"
            >
              <Instagram size={14} />
              <span>@anneshapartha</span>
            </a>
          </div>
        </div>

        {/* Categories Tab Selector with responsive filter scroll */}
        <div className="flex justify-center mb-12">
          <div className="flex border-b border-[#302117] overflow-x-auto scroller-none max-w-full gap-2 p-1 bg-[#0b0705] rounded-lg border border-[#302117]/60">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#bc4123] text-white shadow-md"
                    : "text-[#d1bfae] hover:text-[#e6b17a]"
                }`}
                id={`gal-tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActiveModalItem(item)}
              className="bg-[#0b0705] border border-[#2b1b12] rounded-2xl overflow-hidden shadow-xl hover:border-[#523320] transition-all group flex flex-col justify-between cursor-pointer"
              id={`gal-item-${item.id}`}
            >
              {/* Card visual wrapper */}
              <div className="relative aspect-square overflow-hidden bg-[#241710]">
                {/* Visual hover stats mask */}
                <div className="absolute inset-0 bg-[#050302]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 z-10">
                  <span className="flex items-center space-x-2 text-white font-bold">
                    <Heart size={20} className="fill-[#bc4123] text-[#bc4123]" />
                    <span>{item.likes}</span>
                  </span>
                  <span className="flex items-center space-x-2 text-white font-bold">
                    <MessageCircle size={20} className="fill-[#e6b17a] text-[#e6b17a]" />
                    <span>{commentsStore[item.id]?.length || item.comments}</span>
                  </span>
                </div>

                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Category tag bubble */}
                <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-[#e6b17a] border border-[#4a3a2a] text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-full z-10">
                  {item.category === "live" ? "Live Show" : item.category === "bts" ? "Behind the scenes" : item.category === "promo" ? "Podcast Promo" : "Quote Panel"}
                </span>
              </div>

              {/* Card captions footer details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#f7ede2] mb-1.5 group-hover:text-[#e6b17a] transition-colors select-none">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#d1bfae]/80 leading-relaxed font-light line-clamp-2 select-text">
                    {item.caption}
                  </p>
                </div>

                {/* Action panel */}
                <div className="pt-4 mt-4 border-t border-[#302117]/50 flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="text-[#d1bfae]/70 hover:text-[#bc4123] transition-colors flex items-center space-x-1 cursor-pointer"
                      id={`like-card-${item.id}`}
                      title="Heart this story"
                    >
                      <Heart size={15} className="hover:scale-125 transition-transform" />
                      <span className="text-xs font-mono">{item.likes}</span>
                    </button>
                    <div className="text-[#d1bfae]/70 flex items-center space-x-1">
                      <MessageCircle size={15} />
                      <span className="text-xs font-mono">{commentsStore[item.id]?.length || item.comments}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#bc4123] uppercase group-hover:underline">
                    Interact & Post Comment →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Commentary Screen */}
        <AnimatePresence>
          {activeModalItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0f0a07] border border-[#443022] rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[85vh]"
              >
                {/* Visual side */}
                <div className="relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                  <img
                    src={activeModalItem.url}
                    alt={activeModalItem.title}
                    className="w-full h-full object-cover max-h-[500px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a07] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-[#bc4123] text-white text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded mb-2 inline-block">
                      {activeModalItem.category.toUpperCase()} SHOWCASE
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                      {activeModalItem.title}
                    </h3>
                  </div>
                </div>

                {/* Commentary & Social side */}
                <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-none">
                  
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-[#302117] pb-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Instagram className="text-[#e6b17a]" size={18} />
                        <span className="text-sm font-semibold text-[#f7ede2]">@ajeebogareeblive</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveModalItem(null);
                          setNewCommentText("");
                          setNewCommentUser("");
                        }}
                        className="text-xs font-semibold text-[#bc4123] bg-[#22120a] hover:bg-[#341d13] border border-[#52331f] px-3 py-1 rounded transition-colors"
                        id="comment-modal-close"
                      >
                        Back to Grid
                      </button>
                    </div>

                    {/* Original Caption */}
                    <div className="bg-[#16100c] border border-[#2b1f15] p-3.5 rounded-lg mb-6 text-xs text-[#d1bfae] leading-relaxed select-text font-light">
                      <strong className="text-[#e6b17a] block font-semibold mb-1">Ajeeb-o-Gareeb Notes:</strong>
                      {activeModalItem.caption}
                    </div>

                    {/* Interactive Comments Stream */}
                    <div className="space-y-4 mb-6">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#a27b5c]">
                        Audience Reactions ({commentsStore[activeModalItem.id]?.length || 0})
                      </h4>

                      <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-2">
                        {(commentsStore[activeModalItem.id] || []).length === 0 ? (
                          <p className="text-xs text-[#d1bfae]/60 italic font-light py-2">
                            No shared thoughts on this storytelling segment yet. Be the first to reflect!
                          </p>
                        ) : (
                          commentsStore[activeModalItem.id].map((comm, cIdx) => (
                            <div key={cIdx} className="text-xs bg-[#120d0a]/60 border border-[#302117]/30 p-2.5 rounded flex items-start gap-2">
                              <CornerDownRight size={12} className="text-[#bc4123] shrink-0 mt-0.5" />
                              <div className="select-text">
                                <span className="font-bold text-[#e6b17a] mr-1.5">{comm.user}</span>
                                <span className="text-[#d1bfae]/90 font-light">{comm.text}</span>
                                <span className="block text-[9px] font-mono text-[#a27b5c] mt-1">{comm.date}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add interactive Commentary form */}
                  <div className="mt-4 pt-4 border-t border-[#302117]">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#e6b17a] mb-2.5">
                      Share Your Experience or Emotion
                    </h4>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Your Handle or Name (e.g. jampot_poet)"
                        value={newCommentUser}
                        onChange={(e) => setNewCommentUser(e.target.value)}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] focus:ring-1 focus:ring-[#e6b17a] text-white px-3 py-2 rounded focus:outline-none"
                        id="inp-comment-user"
                      />
                      <textarea
                        rows={2}
                        placeholder="Type what this storytelling theme evokes in you..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] focus:ring-1 focus:ring-[#e6b17a] text-white px-3 py-2 rounded focus:outline-none resize-none"
                        id="inp-comment-text"
                      />
                      <button
                        onClick={() => handleAddComment(activeModalItem.id)}
                        className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2 rounded shadow transition-colors cursor-pointer"
                        id="btn-comment-submit"
                      >
                        Publish Comment on Page
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
