import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Phone, MessageSquare, Instagram, Mail, Navigation, Star, Sparkles, Check } from "lucide-react";
import { SHOW_DETAILS, PERFORMER_BIO } from "../data";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Show Booking Invitation");
  const [message, setMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  // Pre-formatted Whatsapp message links for bookings!
  const whatsappNumber = "919031123456"; // Jamshedpur standard placeholder
  const encodedMsg = encodeURIComponent(
    `Heila! I visited the Ajeeb-o-Gareeb website and would like to reserve seats or invite Annesha for a show!`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate inquiry sent
    setSentSuccess(true);
    setName("");
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setSentSuccess(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-[#140e0a] border-t border-[#302117]/30 relative"
    >
      <div className="absolute top-1/2 left-1/4 w-[300px] bg-[#bc4123]/5 h-[300px] rounded-full blur-[110px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Topic details */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#bc4123] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 mb-2">
            <Mail size={13} className="text-[#e6b17a]" />
            Connect & Bring Us to your Space
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight mb-4">
            Booking & Media Inquiries
          </h2>
          <div className="w-16 h-1 bg-[#bc4123] mx-auto mb-6"></div>
          <p className="text-[#d1bfae] text-sm">
            Interested in booking "Ajeeb-o-Gareeb" or inviting Annesha Partha Mishra for an intimate musical storytelling night or podcast collaboration? Drop a line below.
          </p>
        </div>

        {/* Contact panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick links & physical details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b0705] border border-[#302117] p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="font-serif text-xl font-bold text-[#e6b17a] mb-3">
                Let's Build Strange Circles
              </h3>
              <p className="text-xs text-[#d1bfae]/90 leading-relaxed mb-6">
                Based in **Jamshedpur, Jharkhand, India**, the musical is optimized for cozy cafes, backyard amphitheaters, and cultural gallery spaces.
              </p>

              {/* Information widgets */}
              <div className="space-y-4">
                
                {/* Instant WhatsApp booking button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd5d] text-white p-4 rounded-xl flex items-center gap-3 transition-colors group"
                  id="contact-whatsapp-btn"
                >
                  <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="block text-[10px] font-mono uppercase tracking-widest font-extrabold text-white/80 leading-none">
                      INSTANT WhatsApp BOOKING
                    </span>
                    <span className="font-serif text-xs font-bold block mt-1">
                      Direct Chat with @ajeebogareeblive
                    </span>
                  </div>
                </a>

                {/* Instagram Direct Link */}
                <a
                  href="https://www.instagram.com/ajeebogareeblive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#241310] hover:bg-[#341d1a] border border-[#5a2e28] text-white p-4 rounded-xl flex items-center gap-3 transition-colors group"
                  id="contact-ig-booking"
                >
                  <Instagram size={22} className="text-[#e6b17a] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="block text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#e6b17a] leading-none">
                      Instagram Direct Message
                    </span>
                    <span className="font-serif text-xs font-semibold block mt-1">
                      DM @ajeebogareeblive for instant replies
                    </span>
                  </div>
                </a>

                {/* Academic/Base Location info */}
                <div className="bg-[#120d0a] border border-[#302117]/60 p-4 rounded-xl flex items-start gap-3">
                  <Star className="text-[#bc4123] mt-1 shrink-0" size={16} />
                  <div className="text-xs">
                    <p className="font-bold text-white mb-0.5">Base Operations</p>
                    <p className="text-[#d1bfae]">Jamshedpur/Ranchi, Jharkhand, India</p>
                  </div>
                </div>

                <div className="bg-[#120d0a] border border-[#302117]/60 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles className="text-[#e6b17a] mt-1 shrink-0 animate-spin" size={16} />
                  <div className="text-xs">
                    <p className="font-bold text-white mb-0.5">Dopamine Hit Backstage</p>
                    <p className="text-[#d1bfae]">For podcast collaborations, email with subject 'DOPAMINE'</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Email Enquiry Form simulation */}
          <div className="lg:col-span-7">
            <div className="bg-[#0b0705] border border-[#302117] p-6 sm:p-8 rounded-2xl shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#e6b17a] mb-2">
                Send an Email Inquiry
              </h3>
              <p className="text-xs text-[#d1bfae] mb-6">
                Fill this client-side simulated secure form to pitch calendar dates, sponsor crowdfunding challenge gigs, or schedule podcasts.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Das"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                      id="contact-form-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. contact@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                      id="contact-form-email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none cursor-pointer"
                    id="contact-form-subject"
                  >
                    <option value="Show Booking Invitation">Show Booking Invitation</option>
                    <option value="Podcast 'Dopamine Hit' Pitch">Podcast "Dopamine Hit" Pitch</option>
                    <option value="Media/Journalism Coverage">Media/Journalism Coverage</option>
                    <option value="Crowdfund Sponsorship Support">Crowdfund Sponsorship Support</option>
                    <option value="General Support Reaction">General Support Reaction</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block">
                    Detailed Proposal/Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="We'd love to host Ajeeb-o-Gareeb on..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white p-3 rounded focus:outline-none resize-none"
                    id="contact-form-message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  id="contact-form-submit-btn"
                >
                  <Send size={14} />
                  <span>Send Secure Inquiry</span>
                </button>

                {/* Toast status */}
                <AnimatePresence>
                  {sentSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#121c15] border border-[#235338] p-3.5 rounded-lg text-xs text-[#a3f0c3] flex items-center gap-2 justify-center"
                    >
                      <Check size={14} className="text-[#2ed573]" />
                      <span>Thank you, {name || "there"}! Your simulated message has been queued successfully. We will follow up.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
