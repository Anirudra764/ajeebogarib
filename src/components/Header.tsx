import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Instagram, Youtube, Sparkles } from "lucide-react";
import { SHOW_DETAILS } from "../data";

interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function Header({ activeSection, scrollToSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about-show", label: "About The Show" },
    { id: "about-annesha", label: "The Performer" },
    { id: "gallery", label: "Media & Podcast" },
    { id: "events", label: "Shows & Tours" },
    { id: "community", label: "Community Notes" },
    { id: "contact", label: "Inquiries" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0b0705]/95 backdrop-blur-md shadow-lg border-b border-[#302015]/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Brand / Hindi Text */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex flex-col text-left group focus:outline-none cursor-pointer"
            id="nav-logo-btn"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#e6b17a] group-hover:text-[#f3d4b3] transition-colors leading-none">
              {SHOW_DETAILS.title}
            </span>
            <span className="font-serif text-xs text-[#a27b5c] tracking-widest mt-0.5 font-medium">
              {SHOW_DETAILS.hindiTitle} • अजीबो गरीब
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 relative cursor-pointer ${
                  activeSection === item.id
                    ? "text-[#e6b17a]"
                    : "text-[#d1bfae]/80 hover:text-[#e6b17a]"
                }`}
                id={`desk-nav-${item.id}`}
              >
                <span className="relative z-10">{item.label}</span>
                {activeSection === item.id && (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-[#3a2012]/50 border border-[#8f5a34]/30 rounded-md -z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Widgets */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="https://www.instagram.com/ajeebogareeblive/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d1bfae]/70 hover:text-[#e6b17a] transition-all p-2 rounded-full hover:bg-[#25150c]/80"
              title="Official Instagram"
              id="header-ig-live"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.instagram.com/anneshapartha/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-[#d1bfae] bg-[#22130a] hover:bg-[#3d1f0f] border border-[#52321c] px-3 py-1.5 rounded-full transition-all"
              id="header-ig-profile"
            >
              <Sparkles size={12} className="text-[#e6b17a] animate-pulse" />
              <span>@anneshapartha</span>
            </a>
            <button
              onClick={() => scrollToSection("events")}
              className="bg-gradient-to-r from-[#8c2a1c] to-[#bc4123] hover:from-[#a03625] hover:to-[#ce4c2a] text-[#ffffff] text-xs font-semibold px-4 py-2 rounded-md shadow-md border border-[#8a2f1c]/50 tracking-wider uppercase transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer"
              id="header-book-cta"
            >
              Reserve Seats
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => scrollToSection("events")}
              className="bg-gradient-to-r from-[#8c2a1c] to-[#bc4123] text-white text-xs font-medium px-3 py-1.5 rounded shadow-sm border border-[#8a2f1c]/40 cursor-pointer"
              id="mobile-quick-book"
            >
              Book
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#d1bfae] hover:text-[#e6b17a] p-1.5 focus:outline-none focus:ring-1 focus:ring-[#8c2a1c] rounded"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0c0806] border-b border-[#302015] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    scrollToSection(item.id);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-base font-medium transition-all ${
                    activeSection === item.id
                      ? "bg-[#331d10] text-[#e6b17a] border-l-4 border-[#8c2a1c]"
                      : "text-[#d1bfae] hover:bg-[#1a0f0a] hover:text-[#e6b17a]"
                  }`}
                  id={`mob-nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-[#302015] flex flex-wrap gap-3 items-center px-4">
                <a
                  href="https://www.instagram.com/ajeebogareeblive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs text-[#d1bfae]/80 hover:text-[#e6b17a]"
                  id="mob-ig-live"
                >
                  <Instagram size={16} />
                  <span>@ajeebogareeblive</span>
                </a>
                <a
                  href="https://www.instagram.com/anneshapartha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs text-[#d1bfae]/80 hover:text-[#e6b17a]"
                  id="mob-ig-performer"
                >
                  <Instagram size={16} />
                  <span>@anneshapartha (26k)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
