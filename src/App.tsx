import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutShow from "./components/AboutShow";
import AboutAnnesha from "./components/AboutAnnesha";
import GallerySection from "./components/GallerySection";
import BookingTours from "./components/BookingTours";
import ParchmentWall from "./components/ParchmentWall";
import ContactForm from "./components/ContactForm";
import { useAjeebData } from "./context/AjeebDataContext";
import { Instagram, Youtube, Sparkles, Heart, Anchor, Coffee } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const { showDetails } = useAjeebData();

  // Intersection Observer to track active section dynamically
  useEffect(() => {
    const sections = [
      "hero",
      "about-show",
      "about-annesha",
      "gallery",
      "events",
      "community",
      "contact"
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // Offset for header trigger

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a07] text-[#f7ede2] font-sans antialiased selection:bg-[#bc4123] selection:text-white">
      {/* Sticky navigation bar */}
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Main Sections */}
      <main>
        {/* HERO SECTION */}
        <Hero scrollToSection={scrollToSection} />

        {/* ABOUT SHOW BRIEF */}
        <AboutShow />

        {/* ABOUT ANNESHA BIOGRAPHY */}
        <AboutAnnesha />

        {/* GALLERY & MEDIA INSTAGRAM MOCK */}
        <GallerySection />

        {/* TOURS SCHEDULES & BOOKINGS */}
        <BookingTours />

        {/* STORY BOARD PARCHMENT WALL */}
        <ParchmentWall />

        {/* CONTACT INQUIRY PAGE */}
        <ContactForm />
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#0b0705] border-t border-[#302117] py-16 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Logo brand */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex flex-col items-center group focus:outline-none cursor-pointer mb-6"
            id="footer-logo-btn"
          >
            <span className="font-serif text-2xl font-black tracking-tight text-[#e6b17a]">
              {showDetails.title}
            </span>
            <span className="font-serif text-xs text-[#a27b5c] tracking-widest mt-0.5">
              {showDetails.bengaliTitle || showDetails.hindiTitle} • LIVE STORYTELLING MUSICAL
            </span>
          </button>

          {/* Tagline Reverb */}
          <p className="font-light italic text-[#d1bfae]/80 max-w-lg text-sm mb-6 leading-relaxed">
            "{showDetails.taglineSecondary || "Feelings with reverb, stories with voice"}"
          </p>

          <p className="text-xs text-[#a27b5c] uppercase tracking-wider font-semibold mb-8 flex items-center justify-center gap-1.5">
            <Coffee size={14} className="text-[#bc4123]" />
            Musical Storyteller at {showDetails.title}, Jamshedpur
          </p>

          {/* Social Links Row */}
          <div className="flex justify-center gap-5 mb-10">
            <a
              href="https://www.instagram.com/ajeebogareeblive/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1b120c] hover:bg-[#bc4123] hover:text-white border border-[#483325] text-[#e6b17a] flex items-center justify-center transition-colors transition-transform hover:scale-110"
              title="Ajeeb-o-Gareeb Instagram"
              id="footer-ig-live"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.instagram.com/anneshapartha/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1b120c] hover:bg-[#bc4123] hover:text-white border border-[#483325] text-[#e6b17a] flex items-center justify-center transition-colors transition-transform hover:scale-110"
              title="Annesha Partha Instagram (26K)"
              id="footer-ig-annesha"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.instagram.com/anneshapartha/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1b120c] hover:bg-[#bc4123] hover:text-white border border-[#483325] text-[#e6b17a] flex items-center justify-center transition-colors transition-transform hover:scale-110"
              title="YouTube Podcast (Dopamine Hit)"
              id="footer-yt-podcast"
            >
              <Youtube size={18} />
            </a>
          </div>

          {/* Separator */}
          <div className="w-full max-w-md h-[1px] bg-[#302117]/60 mb-6"></div>

          {/* Fineprint & credits */}
          <div className="text-[11px] text-[#a27b5c]/85 tracking-wide space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Ajeeb-o-Gareeb. All rights reserved.
            </p>
            <p className="flex items-center justify-center gap-1">
              Crafted in Jamshedpur, Jharkhand • Honoring her late father's legacy of resilience.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}

