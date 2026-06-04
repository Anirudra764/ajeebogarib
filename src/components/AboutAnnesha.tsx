import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Award, Heart, Scroll, Instagram, Quote, Flame, BookOpen } from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";

export default function AboutAnnesha() {
  const [selectedMilestone, setSelectedMilestone] = useState(2); // Default to Father's Legacy (middle)
  const { performerBio } = useAjeebData();

  return (
    <section
      id="about-annesha"
      className="py-24 bg-[#0f0a07] relative overflow-hidden"
    >
      {/* Visual background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#bc4123]/10 rounded-full blur-[110px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-[#e6b17a] uppercase tracking-widest block mb-2 font-bold">
              MEET THE ARTIST
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight mb-2">
              {performerBio.name}
            </h2>
            <p className="text-xs text-[#a27b5c] font-mono tracking-widest select-none uppercase">
              {(performerBio.roles || []).join(" • ")}
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-[#1e130c] border border-[#3e2719] px-5 py-3 rounded-xl max-w-xs">
            <Instagram className="text-[#e6b17a]" size={20} />
            <div>
              <p className="text-xs text-[#d1bfae]/80">Instagram Creator</p>
              <p className="font-serif text-sm font-bold text-[#f7ede2]">
                {performerBio.instagramHandle}{" "}
                <span className="text-[#e6b17a] text-xs font-mono">({performerBio.followersCount})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Big Artistic Stat Card Banner */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0c0806] border border-[#302015] p-6 rounded-2xl relative">
              <div className="absolute -top-3 left-4 bg-[#8c2a1c] text-white font-mono text-[9px] tracking-wider uppercase font-bold px-3 py-1 rounded">
                EXPERIENCE PROFILE
              </div>
              
              <div className="pt-4 grid grid-cols-2 gap-4">
                {(performerBio.stats || []).map((stat: any, i: number) => (
                  <div key={i} className="border-b border-l border-[#302015]/80 p-3 bg-[#120c09]/30 rounded">
                    <span className="block font-serif text-2xl font-bold text-[#e6b17a]">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-[#a27b5c] font-medium tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#302015] text-xs text-[#d1bfae] leading-relaxed">
                Annesha's voice is forged through 16 full years of rigorous training, fueled by 5 years of professional grooming, debuting as an energetic 3-year-old on Jamshedpur's local stages.
              </div>
            </div>

            {/* University & Scholarship Card */}
            <div className="bg-gradient-to-br from-[#1b120c] to-[#0c0806] border border-[#483325] p-6 rounded-2xl">
              <div className="flex items-center space-x-2 text-[#e6b17a] mb-3">
                <BookOpen size={18} />
                <h4 className="font-serif font-bold text-sm">Academic & Writing Roots</h4>
              </div>
              <p className="text-xs text-[#e6b17a] font-sans font-medium mb-1">
                {performerBio.education?.degree} Student
              </p>
              <p className="text-[10px] text-[#a27b5c] font-mono mb-4 uppercase">
                {performerBio.education?.institution} ({performerBio.education?.batch})
              </p>
              <p className="text-xs text-[#d1bfae]/90 leading-relaxed italic">
                "{performerBio.education?.scholarshipStory}"
              </p>
            </div>
          </div>

          {/* Interactive Stepper Journey (Chronological Steps) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0b0705] border border-[#302117] p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#e6b17a] mb-3 flex items-center gap-2">
                <Scroll size={20} className="text-[#bc4123]" />
                Tracing her Steps & Resilience
              </h3>
              <p className="text-xs text-[#d1bfae] mb-8">
                Click on each emotional milestone card below to follow her journey from standing spotlights to national television, and back to independent musical theater.
              </p>

              {/* Steps timeline selector circles */}
              <div className="flex justify-between items-center relative mb-8 px-4">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#3a271c] -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-[2px] bg-[#bc4123] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${(selectedMilestone / (Math.max(1, (performerBio.keyMilestones || []).length - 1))) * 100}%`
                  }}
                />

                {/* Steps Nodes */}
                {(performerBio.keyMilestones || []).map((ms: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMilestone(idx)}
                    className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedMilestone === idx
                        ? "bg-[#bc4123] border-[#e6b17a] text-white shadow-lg shadow-[#bc4123]/40"
                        : "bg-[#0f0a07] border-[#3a271c] text-[#a27b5c] hover:border-[#bc4123] hover:text-[#e6b17a]"
                    }`}
                    id={`milestone-btn-${idx}`}
                  >
                    {ms.age || ms.year?.substring(0, 4) || "Run"}
                  </button>
                ))}
              </div>

              {/* Active Milestone Card Detail with motion transitions */}
              <div className="min-h-[160px] relative bg-[#120d09]/60 border border-[#2b1f15] p-5 sm:p-6 rounded-xl flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMilestone}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#bc4123] font-bold uppercase tracking-widest bg-[#2b1812] px-2.5 py-1 rounded">
                        Milestone Profile {selectedMilestone + 1} of {(performerBio.keyMilestones || []).length}
                      </span>
                      <span className="text-xs text-[#a27b5c] font-semibold">
                        {performerBio.keyMilestones?.[selectedMilestone]?.age
                          ? `Age: ${performerBio.keyMilestones[selectedMilestone].age}`
                          : `Year / Stage: ${performerBio.keyMilestones?.[selectedMilestone]?.year}`}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#e6b17a] select-text">
                      {performerBio.keyMilestones?.[selectedMilestone]?.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#d1bfae] leading-relaxed select-text font-light">
                      {performerBio.keyMilestones?.[selectedMilestone]?.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Legacy Special Box if Father is selected */}
                {selectedMilestone === 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(140,42,28,0.25),rgba(17,12,9,0.9))] border border-[#8c2a1c]/30 flex items-start gap-3"
                  >
                    <Heart className="text-[#bc4123] mt-1 shrink-0 animate-pulse" size={16} />
                    <div>
                      <p className="text-xs font-serif font-bold text-[#f7ede2] mb-1">
                        "Stories are meant to heal."
                      </p>
                      <p className="text-[10px] text-[#d1bfae]/80">
                        His teachings of continuous perseverance, even in profound silence, live of their own accord in every acoustic strum she plays on stage.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Podcast Section Banner */}
        <div className="bg-[#0b0705] border border-[#302117] rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Subtle background icon watermark */}
          <div className="absolute right-4 bottom-4 text-white/5 font-serif font-black select-none text-[150px] leading-none pointer-events-none">
            🎙️
          </div>

          <div className="md:w-2/3 space-y-4">
            <span className="inline-flex items-center gap-1 bg-[#20150e] border border-[#52331f] text-[#e6b17a] font-mono text-[9px] tracking-wider uppercase font-extrabold px-3 py-1 rounded">
              <Flame size={10} className="text-[#bc4123]" />
              YOUTUBE PODCAST • DOPAMINE HIT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#f7ede2]">
              Podcast: "{performerBio.podcast?.name || "Dopamine & Reverb"}"
            </h3>
            <p className="text-xs sm:text-sm text-[#d1bfae]/95 leading-relaxed">
              {performerBio.podcast?.description || "An intimate soundbox dedicated to addressing raw independent growth steps, creative blocks, and the physical grind of keeping the fire lit."}
            </p>
            <p className="text-xs text-[#a27b5c] font-mono">
              ★ {performerBio.podcast?.linkNote || "Listen on Spotify & YouTube"}
            </p>
          </div>

          <div className="md:w-1/3 w-full flex flex-col items-center">
            <a
              href="https://www.instagram.com/anneshapartha/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#bc4123] to-[#8c2a1c] hover:from-[#ce4c2a] hover:to-[#a03625] text-white text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
              id="annesha-ig-link"
            >
              <Instagram size={16} />
              <span>Visit Link in Bio on Instagram</span>
            </a>
            <span className="text-[10px] text-[#a27b5c] mt-2 block tracking-widest text-center">
              JOIN 26K+ CURIOUS MINDSETS
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
