import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Calendar, Volume2, Flame, Sparkles, ChevronDown, 
  Phone, MessageSquare, ExternalLink, QrCode, Check, Award 
} from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export default function Hero({ scrollToSection }: HeroProps) {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [activeHarmonic, setActiveHarmonic] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const { showDetails } = useAjeebData();

  // Web Audio Context Synthesizer with vintage warmth
  const playHarmonic = (note: string, freq: number) => {
    setActiveHarmonic(note);
    setTimeout(() => setActiveHarmonic(null), 850);

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Warm, vintage acoustic wave
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.008, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.45);

      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(850, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.warn("Audio Context blocked by browser safety protocol.", e);
    }
  };

  const chords = [
    { note: "C maj (Nostalgia)", freq: 261.63, bg: "from-[#8c2a1c] to-[#4a150f]" },
    { note: "Amin (Father's Waltz)", freq: 220.00, bg: "from-[#a27b5c] to-[#4b382a]" },
    { note: "F maj (Jamshedpur Cafe)", freq: 349.23, bg: "from-[#a0522c] to-[#45200e]" },
    { note: "G maj (The Stage Return)", freq: 392.00, bg: "from-[#bc4123] to-[#511608]" }
  ];

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("8252933956");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 bg-black"
    >
      {/* Dynamic Background Atmosphere and Backlights with Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 0.35 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img 
            src="/images/502621126_17855485995441412_6026046547883275418_n.webp" 
            alt="Ajeeb-O-Gareeb Acoustic Stage Backdrop" 
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Sophisticated Darkening Gradients for Pristine Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,9,6,0.3),rgba(0,0,0,0.96))]" />

        <div className="absolute top-1/10 left-1/12 w-[220px] sm:w-[450px] h-[220px] sm:h-[450px] rounded-full bg-[#bc4123]/15 blur-[80px] sm:blur-[140px]" />
        <div className="absolute bottom-1/12 right-1/10 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-yellow-600/10 blur-[100px] sm:blur-[180px]" />
        
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* ————————————————— CENTER CONCERT BRANDING & INTERACTIVE PANEL ————————————————— */}
          <div className="w-full space-y-8 text-center flex flex-col items-center">
            
            {/* Spotlight Banner Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-[#1c0f09] border border-[#5c3e29] px-4 py-1.5 rounded-full text-xs text-[#e6b17a] font-medium tracking-wide uppercase"
            >
              <Flame size={12} className="text-[#bc4123] animate-pulse" />
              <span>AJEEB-O-GAREEB • CONCERT PROFILE</span>
            </motion.div>

            {/* Red Bengali calligraphy representation & main titles */}
            <div className="space-y-4 flex flex-col items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="flex items-center justify-center gap-3.5"
              >
                <span className="font-serif text-3xl sm:text-4xl text-[#bc4123] font-black tracking-widest bg-red-950/20 border border-red-950 px-4 py-1 rounded-xl shadow-lg shadow-red-950/20 antialiased selection:bg-[#fff] selection:text-red-600">
                  {showDetails.bengaliTitle || "অজিব ও গরিব"}
                </span>
                <span className="font-serif text-sm text-[#a27b5c] uppercase tracking-widest font-bold">
                  {showDetails.hindiTitle}
                </span>
              </motion.div>

              <motion.h1
                className="font-serif text-4xl sm:text-7xl font-black text-white tracking-tight leading-none text-center flex flex-wrap justify-center gap-x-[0.25em] select-none"
                id="hero-title"
              >
                {showDetails.title.split(" ").map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="inline-block overflow-hidden py-1"
                  >
                    <motion.span
                      className="inline-block origin-bottom hover:text-[#e6b17a] transition-all duration-300 cursor-default"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.15 + wordIdx * 0.12,
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -3,
                        textShadow: "0 0 20px rgba(230, 177, 122, 0.75)"
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="block w-full text-xs sm:text-sm font-mono mt-5 tracking-[0.3em] text-[#e6b17a]/90 uppercase font-black"
                >
                  Performed by Annesha Partha and team
                </motion.span>
              </motion.h1>
            </div>

            {/* Tagline Secondary */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-xl text-yellow-500 font-bold italic tracking-wide text-center"
            >
              "{showDetails.tagline}" — {showDetails.taglineSecondary || "Feelings with reverb, stories with voice."}
            </motion.p>

            {/* Long synopsis description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.45,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-sm sm:text-base text-[#d1bfae] leading-relaxed font-light max-w-2xl text-center mx-auto relative px-6 py-4 bg-[#0d0705]/40 border-y border-[#3d2312]/20 backdrop-blur-[2px] rounded-xl shadow-inner"
            >
              <span className="block mb-2 font-serif text-[#e4ab74] text-base sm:text-lg font-medium tracking-wide">
                {showDetails.subtitle.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.04,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </span>
              <span className="block text-xs sm:text-sm text-[#c0ae9d] font-sans font-light tracking-wide mt-3 leading-relaxed">
                {(showDetails.shortDesc || "An unplugged fusion built specifically for Jamshedpur spaces like Cafe Regal of 1935, blending retro acoustic chords with deeply honest personal memories.").split(". ").map((sentence, sIdx) => {
                  const cleanSentence = sentence.trim();
                  if (!cleanSentence) return null;
                  return (
                    <motion.span
                      key={sIdx}
                      className="inline-block mr-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.95 + sIdx * 0.25,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      {cleanSentence}{sIdx < (showDetails.shortDesc || "").split(". ").length - 1 ? "." : ""}&nbsp;
                    </motion.span>
                  );
                })}
              </span>
            </motion.p>

            {/* Action buttons matching the aesthetic */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <button
                onClick={() => scrollToSection("events")}
                className="w-full sm:w-auto bg-gradient-to-r from-[#bc4123] to-[#8c2a1c] hover:from-[#ce4c2a] hover:to-[#a03625] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-red-950/20 border border-red-900/50 flex items-center justify-center space-x-2 tracking-wider transition-all hover:scale-103 active:scale-97 cursor-pointer"
                id="hero-book-btn"
              >
                <Calendar size={18} />
                <span>BOOK PASSES NOW</span>
              </button>

              <button
                onClick={() => setIsPlayingTeaser(true)}
                className="w-full sm:w-auto bg-[#110c09] hover:bg-[#20150e] text-[#e6b17a] hover:text-white font-bold px-7 py-4 rounded-xl border border-[#4d3221] flex items-center justify-center space-x-2 transition-all hover:scale-103 cursor-pointer"
                id="hero-watch-btn"
              >
                <Play size={16} className="fill-[#e6b17a]" />
                <span>WATCH LIVE PROMO</span>
              </button>
            </motion.div>

            {/* Interactive Guitar Soundboard widget representing acoustic engine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-[#0b0806] border border-[#26180f] p-6 rounded-2xl relative shadow-2xl max-w-2xl w-full text-left"
              id="acoustic-soundboard"
            >
              <div className="absolute top-2.5 right-4 flex items-center space-x-1.5 text-[9px] text-[#a27b5c] font-mono uppercase tracking-widest font-extrabold select-none">
                <Volume2 size={12} className="text-yellow-500" />
                <span>TAP TO REVERB</span>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-bold text-[#e6b17a] font-mono tracking-wider uppercase mb-1 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#bc4123]" />
                  Acoustic G-chord Harvester
                </h4>
                <p className="text-[11px] text-[#d1bfae]/80">
                  Tap notes to strum real live harmonic frequencies of "Ajeeb-o-Gareeb" chords directly on your speakers.
                </p>
              </div>

              {/* Chords matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {chords.map((chord) => (
                  <button
                    key={chord.note}
                    onClick={() => playHarmonic(chord.note, chord.freq)}
                    className={`relative py-3.5 px-3 rounded-xl border text-left flex flex-col justify-between overflow-hidden transition-all duration-300 transform active:scale-95 ${
                      activeHarmonic === chord.note
                        ? "bg-gradient-to-br " + chord.bg + " border-yellow-500"
                        : "bg-black/90 hover:bg-[#150f0c] border-[#332014]"
                    }`}
                    id={`chord-${chord.note.substring(0, 1).toLowerCase()}`}
                  >
                    {activeHarmonic === chord.note && (
                      <span className="absolute inset-0 bg-white/5 animate-pulse rounded-xl pointer-events-none" />
                    )}

                    <span className="text-[9px] font-mono text-[#a27b5c] font-black tracking-widest">
                      NARRATIVE CODE
                    </span>
                    <span className="text-xs font-bold text-[#f7ede2] mt-2 block truncate">
                      {chord.note.split(" ")[0]}
                    </span>
                    <span className="text-[8px] font-mono text-[#e6b17a] opacity-80 block truncate mt-0.5">
                      {chord.note.substring(chord.note.indexOf("("))}
                    </span>

                    {/* Micro audio ripples indicator */}
                    <div className="flex h-3 items-end space-x-0.5 mt-2 overflow-hidden">
                      <div
                        className={`w-0.5 rounded-full bg-yellow-500 transition-all duration-300 ${
                          activeHarmonic === chord.note ? "animate-[bounce_0.6s_infinite] h-full" : "h-1"
                        }`}
                      />
                      <div
                        className={`w-0.5 rounded-full bg-red-500 transition-all duration-300 ${
                          activeHarmonic === chord.note ? "animate-[bounce_0.8s_infinite_delay-150] h-3" : "h-1.5"
                        }`}
                      />
                      <div
                        className={`w-0.5 rounded-full bg-yellow-500 transition-all duration-300 ${
                          activeHarmonic === chord.note ? "animate-[bounce_0.5s_infinite_delay-300] h-2" : "h-1"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>

        </div>

        {/* Scroll helper down */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => scrollToSection("about-show")}
            className="text-stone-400 hover:text-yellow-500 transition p-2 flex flex-col items-center space-y-1 group cursor-pointer"
            id="hero-scroll-btn"
          >
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-[#a27b5c]">
              The Story unfolds
            </span>
            <ChevronDown size={18} className="animate-bounce group-hover:translate-y-1 transition-transform text-[#bc4123]" />
          </button>
        </div>

      </div>

      {/* Teaser Video Mock Modal */}
      <AnimatePresence>
        {isPlayingTeaser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#100b08] border border-stone-800 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl"
            >
              <div className="bg-[#1a110a] border-b border-[#301f14] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="font-serif text-sm font-black text-yellow-500 uppercase">
                    Ajeeb-o-Gareeb • Live Showcase
                  </h3>
                </div>
                <button
                  onClick={() => setIsPlayingTeaser(false)}
                  className="text-xs uppercase font-mono border border-stone-800 text-stone-300 hover:text-red-500 px-3 py-1.5 rounded transition"
                  id="close-teaser"
                >
                  Close Teaser
                </button>
              </div>

              {/* Theater Video Frame simulation */}
              <div className="relative aspect-video bg-black p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-10" />
                <img
                  src={showDetails.heroImage || "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800"}
                  alt="Spotlight on stage background"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                  referrerPolicy="no-referrer"
                />

                <div className="relative z-20 space-y-4">
                  {/* Waveform audio simulator */}
                  <div className="flex justify-center items-end space-x-1 h-12 mb-4">
                    {[1, 3, 2, 4, 6, 4, 3, 5, 2, 4, 1, 3, 5, 3, 2].map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#bc4123] rounded-full"
                        animate={{ height: [8, height * 7, 8] }}
                        transition={{
                          duration: 0.9 + (i % 3) * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-[#e6b17a] tracking-[0.2em] uppercase font-black block">
                    STREAMING REVERB PREVIEW
                  </span>
                  <h4 className="font-serif text-lg sm:text-2xl font-bold text-white uppercase">
                    "Feelings with reverb, stories with voice."
                  </h4>
                  <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                    Live at Cafe Regal, Jamshedpur: Annesha sings a composition built dedicated to her father's memories, weaving deep literature into cozy acoustic guitars.
                  </p>

                  <div className="flex gap-3 justify-center pt-3">
                    <button
                      onClick={() => playHarmonic("A Minor", 220)}
                      className="bg-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow hover:bg-yellow-400"
                    >
                      <Volume2 size={14} />
                      <span>Test Sound Reverb</span>
                    </button>
                    <a
                      href="https://www.instagram.com/ajeebogareeblive/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-900 border border-neutral-700 text-white text-xs px-4 py-2 rounded-lg flex items-center shadow hover:bg-neutral-800"
                    >
                      Go watch on Instagram Reel
                    </a>
                  </div>
                </div>

              </div>

              <div className="bg-[#19110a] px-6 py-3 flex items-center justify-between border-t border-[#301f14] text-[10px] font-mono text-stone-400">
                <span>100-MINUTE THEATER PRODUCTION</span>
                <span>@ajeebogareeblive</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
