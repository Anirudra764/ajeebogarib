import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Calendar, HelpCircle, Volume2, VolumeX, Flame, Sparkles, ChevronDown } from "lucide-react";
import { SHOW_DETAILS } from "../data";

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export default function Hero({ scrollToSection }: HeroProps) {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [activeHarmonic, setActiveHarmonic] = useState<string | null>(null);

  // Simple Web Audio API Synthesizer to create beautiful ambient organic guitar-like cozy sounds on tap! 
  // It gives the user a genuine acoustic trigger that makes the storytelling portal feel interactive.
  const playHarmonic = (note: string, freq: number) => {
    setActiveHarmonic(note);
    setTimeout(() => setActiveHarmonic(null), 800);

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Storyteller vintage warmth: triangle wave
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Soft vibrato
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      // Low pass filter for warm dusty texture
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio Context not allowed by browser permissions until user interacts directly.", e);
    }
  };

  const chords = [
    { note: "C maj (Nostalgia)", freq: 261.63, bg: "from-[#8c2a1c] to-[#4a150f]" },
    { note: "Amin (Father's Waltz)", freq: 220.00, bg: "from-[#a27b5c] to-[#4b382a]" },
    { note: "F maj (Jamshedpur Cafe)", freq: 349.23, bg: "from-[#a0522c] to-[#45200e]" },
    { note: "G maj (The Stage Return)", freq: 392.00, bg: "from-[#bc4123] to-[#511608]" }
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-[#0f0a07]"
    >
      {/* Decorative Warm Backlights & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[150px] sm:w-[350px] h-[150px] sm:h-[350px] rounded-full bg-[#8c2a1c]/25 blur-[60px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[180px] sm:w-[400px] h-[180px] sm:h-[400px] rounded-full bg-[#e6b17a]/15 blur-[80px] sm:blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(40,25,15,0.7),rgba(15,10,7,1))]" />
        
        {/* Subtle retro overlay grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2 bg-[#2d190e] border border-[#52331f] px-3.5 py-1.5 rounded-full text-xs text-[#e6b17a] font-medium tracking-wide mb-6 uppercase"
        >
          <Flame size={12} className="text-[#bc4123] animate-pulse" />
          <span>Live 100-Minute Musical Storytelling Experience</span>
        </motion.div>

        {/* Hindi Calligraphic Subtitle Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-2"
        >
          <span className="font-serif text-lg sm:text-2xl text-[#a27b5c]/95 italic tracking-wide">
            {SHOW_DETAILS.hindiTitle}
          </span>
        </motion.div>

        {/* Full Show Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-[#f7ede2] tracking-tight leading-none mb-6 relative"
          id="hero-title"
        >
          Ajeeb-o-Gareeb
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#bc4123] to-transparent"></span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl text-base sm:text-lg text-[#e6b17a] italic font-medium tracking-wide mb-4 mt-2"
        >
          "{SHOW_DETAILS.tagline}"
        </motion.p>

        {/* Subtitle Details */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl text-sm sm:text-base text-[#d1bfae] mb-10 leading-relaxed font-light"
        >
          {SHOW_DETAILS.subtitle}
        </motion.p>

        {/* Call to Actions Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button
            onClick={() => scrollToSection("events")}
            className="w-full sm:w-auto bg-gradient-to-r from-[#8c2a1c] to-[#bc4123] hover:from-[#a03625] hover:to-[#ce4c2a] text-white font-medium px-8 py-3.5 rounded-lg shadow-xl border border-[#91311e] flex items-center justify-center space-x-2 tracking-wider transition-all hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
            id="hero-book-btn"
          >
            <Calendar size={18} />
            <span>Book Show Seats</span>
          </button>

          <button
            onClick={() => setIsPlayingTeaser(true)}
            className="w-full sm:w-auto bg-[#1a120e] hover:bg-[#281c16] text-[#e6b17a] hover:text-[#f3d4b3] font-medium px-8 py-3.5 rounded-lg border border-[#483325] flex items-center justify-center space-x-2 transition-all hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
            id="hero-watch-btn"
          >
            <Play size={18} className="fill-current text-[#e6b17a]" />
            <span>Watch Live Teaser</span>
          </button>
        </motion.div>

        {/* Dynamic Interactive Instrument Widget (Acoustic Guitar Soundboard Block) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full max-w-xl bg-[#160f0b]/80 border border-[#3a271c] p-6 rounded-2xl shadow-2xl backdrop-blur-sm relative"
          id="acoustic-soundboard"
        >
          <div className="absolute top-2 right-4 flex items-center space-x-1.5 text-[10px] text-[#a27b5c] font-mono uppercase tracking-widest">
            <Volume2 size={12} className="text-[#e6b17a]" />
            <span>Acoustic Ambient Board</span>
          </div>

          <div className="text-left mb-4">
            <h4 className="text-xs font-semibold text-[#e6b17a] font-mono tracking-wider uppercase mb-1">
              Tap to Strum Narrative Harmonics
            </h4>
            <p className="text-[11px] text-[#d1bfae]/75">
              Experience the emotional reverb chords of "Ajeeb-o-Gareeb" that Annesha triggers on stage.
            </p>
          </div>

          {/* Harmonic Chord Triggers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {chords.map((chord) => (
              <button
                key={chord.note}
                onClick={() => playHarmonic(chord.note, chord.freq)}
                className={`relative py-3 px-2 rounded-lg border text-left flex flex-col justify-between overflow-hidden transition-all duration-300 transform active:scale-95 ${
                  activeHarmonic === chord.note
                    ? "bg-gradient-to-r " + chord.bg + " border-[#e6b17a]"
                    : "bg-[#0b0705] hover:bg-[#1f1510] border-[#3a271c]"
                }`}
                id={`chord-${chord.note.substring(0, 1).toLowerCase()}`}
              >
                {/* Visualizer ripple if active */}
                {activeHarmonic === chord.note && (
                  <span className="absolute inset-0 bg-white/5 animate-ping rounded-lg pointer-events-none" />
                )}

                <span className="text-[11px] font-mono text-[#a27b5c] font-semibold tracking-wider">
                  TRIGGER CHORD
                </span>
                <span className="text-xs font-bold text-[#f7ede2] mt-3 block truncate">
                  {chord.note}
                </span>

                {/* Micro Audio Wave Animation */}
                <div className="flex h-3 items-end space-x-0.5 mt-2 overflow-hidden">
                  <div
                    className={`w-0.5 rounded-full bg-[#e6b17a] transition-all duration-300 ${
                      activeHarmonic === chord.note
                        ? "animate-[bounce_0.6s_infinite]"
                        : "h-1"
                    }`}
                  />
                  <div
                    className={`w-0.5 rounded-full bg-[#bc4123] transition-all duration-300 ${
                      activeHarmonic === chord.note
                        ? "animate-[bounce_0.8s_infinite_delay-150]"
                        : "h-0.5"
                    }`}
                  />
                  <div
                    className={`w-0.5 rounded-full bg-[#e6b17a] transition-all duration-300 ${
                      activeHarmonic === chord.note
                        ? "animate-[bounce_0.5s_infinite_delay-300]"
                        : "h-1"
                    }`}
                  />
                  <div
                    className={`w-0.5 rounded-full bg-[#bc4123] transition-all duration-300 ${
                      activeHarmonic === chord.note
                        ? "animate-[bounce_0.7s_infinite_delay-100]"
                        : "h-0.5"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#a27b5c] italic border-t border-[#3a271c]/30 pt-3">
            <span>"Feelings with reverb, stories with voice"</span>
            <span>Jamshedpur Spotlight</span>
          </div>
        </motion.div>

        {/* Scroll helper */}
        <button
          onClick={() => scrollToSection("about-show")}
          className="mt-12 text-[#a27b5c] hover:text-[#e6b17a] transition-colors p-2 flex flex-col items-center space-y-1 group"
          id="hero-scroll-btn"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">The Story unfolds</span>
          <ChevronDown size={16} className="animate-bounce group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Modal Video Teaser (Simulated Theatre Cinema Player) */}
      <AnimatePresence>
        {isPlayingTeaser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#110c09] border border-[#443022] rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl"
            >
              {/* Teaser Header bar */}
              <div className="bg-[#16100c] border-b border-[#302117] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8c2a1c] animate-pulse" />
                  <h3 className="font-serif text-base font-bold text-[#e6b17a]">
                    Ajeeb-o-Gareeb Showcase (Live Teaser Mock)
                  </h3>
                </div>
                <button
                  onClick={() => setIsPlayingTeaser(false)}
                  className="text-[#d1bfae] hover:text-[#fcffff] text-sm font-semibold hover:bg-[#2c1d15] px-2.5 py-1 rounded transition-colors"
                  id="close-teaser"
                >
                  Close
                </button>
              </div>

              {/* Theater Video Simulation Panel */}
              <div className="relative bg-black aspect-video flex flex-col items-center justify-center p-8 text-center group overflow-hidden">
                {/* Simulated ambient lighting */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800"
                  alt="Live show theatre background"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 group-hover:scale-100 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />

                <div className="relative z-20 flex flex-col items-center">
                  {/* Dynamic waveform visualizer bar representing live music playing */}
                  <div className="flex items-end justify-center space-x-1.5 h-16 mb-6">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 6, 4, 2, 3].map((val, idx) => (
                      <motion.div
                        key={idx}
                        className="w-1 bg-[#bc4123] rounded-full"
                        animate={{
                          height: [12, val * 8, 12],
                        }}
                        transition={{
                          duration: 1 + (idx % 3) * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono text-[#e6b17a] tracking-widest uppercase mb-1">
                    PLAYING AUDIO TEASER
                  </span>
                  <h4 className="font-serif text-lg sm:text-2xl font-bold text-white mb-2">
                    "Strange stories with an echo..."
                  </h4>
                  <p className="text-xs text-[#d1bfae]/90 max-w-md">
                    Live from Cafe Regal, Jamshedpur: Annesha sings a composition on nostalgia, transitioning gracefully into a story representing 2017.
                  </p>

                  <div className="flex items-center space-x-3 mt-6">
                    <button
                      onClick={() => {
                        // Play a lovely resonant synth when clicking listen
                        playHarmonic("Am", 440);
                      }}
                      className="bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1.5 shadow transition-all cursor-pointer"
                      id="listen-harmonic-teaser"
                    >
                      <Volume2 size={14} />
                      <span>Sound Check Harmonic</span>
                    </button>
                    <a
                      href="https://www.instagram.com/ajeebogareeblive/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#281810] hover:bg-[#3d261a] border border-[#52331f] text-[#e6b17a] text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1"
                      id="teaser-ig-go"
                    >
                      <span>Go watch on Reels</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer status */}
              <div className="bg-[#16100c] px-6 py-4 flex items-center justify-between border-t border-[#302117] text-xs text-[#a27b5c]">
                <span>100-Minute Musical Production</span>
                <span className="font-mono text-[#e6b17a]">#ajeebogareeblive</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
