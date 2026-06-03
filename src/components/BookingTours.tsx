import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Clock, Ticket, Sparkles, User, Mail, Phone, ShoppingBag, Download, Check, Trash2, Heart } from "lucide-react";
import { UPCOMING_EVENTS } from "../data";
import { PerformanceShow, TicketReservation } from "../types";

export default function BookingTours() {
  const [shows] = useState<PerformanceShow[]>(UPCOMING_EVENTS);
  const [selectedShow, setSelectedShow] = useState<PerformanceShow | null>(null);
  const [bookings, setBookings] = useState<TicketReservation[]>([]);
  
  // Form input states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [successReservation, setSuccessReservation] = useState<TicketReservation | null>(null);

  // Synchronize dynamic offline local storage bookmarks for permanent reservations history!
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("ajeeb_bookings_store");
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (e) {
      console.warn("Storage reading error: ", e);
    }
  }, []);

  const saveBookingsToStorage = (newBookings: TicketReservation[]) => {
    setBookings(newBookings);
    try {
      localStorage.setItem("ajeeb_bookings_store", JSON.stringify(newBookings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      alert("Please complete all parameters to activate your ticket.");
      return;
    }

    const tix: TicketReservation = {
      id: `TIX-${Math.floor(100000 + Math.random() * 900000)}`,
      showId: selectedShow.id,
      showTitle: selectedShow.title,
      date: selectedShow.date,
      name: userName.trim(),
      email: userEmail.trim(),
      phone: userPhone.trim(),
      ticketsCount: ticketCount,
      reservedAt: new Date().toLocaleDateString("en-IN"),
      status: "confirmed"
    };

    const updated = [tix, ...bookings];
    saveBookingsToStorage(updated);
    setSuccessReservation(tix);
    
    // Clear inputs
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setTicketCount(1);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookingsToStorage(updated);
    if (successReservation && successReservation.id === id) {
      setSuccessReservation(null);
    }
  };

  return (
    <section
      id="events"
      className="py-24 bg-[#0f0a07] relative border-b border-[#302117]/30"
    >
      <div className="absolute top-1/4 left-10 w-[200px] h-[200px] bg-[#bc4123]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-[#bc4123] tracking-widest uppercase font-bold block mb-2">
              LIVE BOX OFFICE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight leading-none mb-4">
              Schedule & Reservations
            </h2>
            <div className="w-16 h-1 bg-[#bc4123] mb-6"></div>
            <p className="text-[#d1bfae] text-sm leading-relaxed">
              Find upcoming performance dates, crowdfunding final shows, and regional touring nodes starting from our home-basement at Cafe Regal 35 in Jamshedpur, Jharkhand.
            </p>
          </div>

          <div className="bg-[#120d0a] border border-[#3e2c1f] p-4 rounded-xl flex items-center justify-between shrink-0 space-x-3 text-xs w-full md:max-w-xs">
            <Ticket className="text-[#e6b17a]" size={20} />
            <div>
              <p className="font-bold text-[#e6b17a]">Crowdfunded Challenge Tours</p>
              <p className="text-[#d1bfae]/80">Jamshedpur-centric intimate circles.</p>
            </div>
          </div>
        </div>

        {/* Shows list layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Events table */}
          <div className="lg:col-span-8 space-y-6">
            {shows.map((show) => (
              <div
                key={show.id}
                className={`border p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
                  show.isFeatured
                    ? "bg-[#18100c] border-[#8c2a1c] shadow-[#8c2a1c]/10 shadow-lg"
                    : "bg-[#0b0705] border-[#2c1d15] hover:border-[#422e22]"
                }`}
                id={`event-row-${show.id}`}
              >
                {/* Spotlights Indicator */}
                {show.isFeatured && (
                  <span className="absolute top-4 right-4 bg-[#8c2a1c] text-white font-mono text-[9px] tracking-wide uppercase font-extrabold px-3 py-1 rounded-full animate-bounce">
                    ★ Homecoming Special
                  </span>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  
                  {/* Calendar / Info column */}
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#e6b17a] font-mono">
                      <span className="flex items-center gap-1 bg-[#281810] border border-[#52331f] px-2.5 py-1 rounded text-white">
                        <Calendar size={13} className="text-[#bc4123]" />
                        {show.date}
                      </span>
                      <span className="flex items-center gap-1 bg-[#281810] border border-[#52331f] px-2.5 py-1 rounded">
                        <Clock size={13} />
                        {show.time}
                      </span>
                      <span className="bg-[#241c17] text-[#a27b5c] px-2 py-0.5 rounded">
                        {show.duration}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                        {show.title}
                      </h3>
                      <p className="text-xs text-[#e6b17a] font-medium italic">
                        "{show.subtitle}"
                      </p>
                      <p className="text-xs text-[#d1bfae]/80 max-w-xl mt-2 leading-relaxed">
                        {show.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#d1bfae]">
                      <MapPin size={14} className="text-[#bc4123]" />
                      <span className="font-semibold text-[#f7ede2]">{show.venue}</span>
                      <span className="text-[#a27b5c]">• {show.location}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full sm:w-auto text-right border-t border-[#2c1d15] sm:border-0 pt-4 sm:pt-0 shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                    <div>
                      <span className="text-[10px] text-[#a27b5c] font-mono uppercase block">SEAT DONATION</span>
                      <span className="text-2xl font-serif font-bold text-[#e6b17a]">
                        {show.price}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedShow(show);
                        setSuccessReservation(null);
                      }}
                      className="bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold px-6 py-3 rounded-lg shadow border border-[#9d341c] hover:translate-y-[-1px] transition-all cursor-pointer"
                      id={`book-trigger-${show.id}`}
                    >
                      Book Ticket Pass
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* User's reservation vault tracking list */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b0705] border border-[#302117] p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-[#e6b17a] mb-2 flex items-center gap-1.5">
                <Ticket className="text-[#bc4123]" size={18} />
                My Booking Vault
              </h3>
              <p className="text-xs text-[#d1bfae] mb-6">
                Your offline simulated tickets are active in this container. Bring these reservation codes to Cafe Regal!
              </p>

              {bookings.length === 0 ? (
                <div className="border border-dashed border-[#3e2c1f] p-8 text-center rounded-xl text-xs text-[#d1bfae]/60">
                  No seats reserved yet. Use the "Book Ticket Pass" button next to any tour slot to secure your physical ticket mockup.
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#140e0a] border border-[#3e2c1f] p-3.5 rounded-lg flex flex-col justify-between"
                      id={`booked-vault-${booking.id}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="font-mono text-[9px] text-[#bc4123] font-bold tracking-widest uppercase bg-[#2a130d] px-2 py-0.5 rounded">
                            {booking.id}
                          </span>
                          <h4 className="font-serif text-sm font-semibold text-[#f7ede2] mt-2 line-clamp-1">
                            {booking.showTitle}
                          </h4>
                          <p className="text-[10px] text-[#a27b5c] font-mono mt-0.5">
                            Show date: {booking.date} • {booking.ticketsCount} Seats
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-[#a27b5c] hover:text-[#bc4123] p-1 rounded hover:bg-black/50"
                          title="Cancel Simulated Reservation"
                          id={`cancel-tix-${booking.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#302117]/50 flex items-center justify-between text-[11px] text-[#e6b17a]">
                        <span className="font-mono text-[10px]">PASS: {booking.name}</span>
                        <span className="bg-[#1f1a15] px-2 py-0.5 text-white/90 rounded text-[9px]">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Booking Form Overlay / Retro Ticket generator Modal */}
      <AnimatePresence>
        {selectedShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0a07] border border-[#443022] rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl my-8"
            >
              {/* Box header */}
              <div className="bg-[#16100c] border-b border-[#302117] px-6 py-4 flex justify-between items-center">
                <h3 className="font-serif text-base font-bold text-[#e6b17a] flex items-center gap-1.5">
                  <Ticket size={16} />
                  Book Seat Reservation
                </h3>
                <button
                  onClick={() => {
                    setSelectedShow(null);
                    setSuccessReservation(null);
                  }}
                  className="text-[#bc4123] hover:text-white text-xs font-semibold hover:bg-black/50 px-2.5 py-1 rounded"
                  id="close-booking-modal"
                >
                  Close
                </button>
              </div>

              {/* Success Screen: Virtual PHYSICAL TICKET STUB */}
              {successReservation ? (
                <div className="p-6 text-center space-y-6">
                  <div className="bg-[#121c15] border border-[#235338] px-4 py-3 rounded-lg flex items-center gap-2 justify-center text-xs text-[#a3f0c3]">
                    <Check size={16} className="text-[#2ed573]" />
                    <span>Your seat has been reserved successfully!</span>
                  </div>

                  {/* Physical retro perforation styled ticket box */}
                  <div className="bg-[#1a120c] border border-[#52331f] rounded-2xl overflow-hidden relative shadow-lg">
                    {/* Retro ticket header */}
                    <div className="bg-[#24130a] text-center py-3.5 border-b border-[#52331f]/70 relative">
                      <div className="absolute top-2 left-3 text-[9px] font-mono text-[#a27b5c]">
                        BOARDING PASS
                      </div>
                      <span className="font-serif text-sm font-bold tracking-widest text-[#e6b17a] uppercase">
                        AJEEB-O-GAREEB LIVE
                      </span>
                      <p className="text-[10px] text-[#d1bfae]/80">A 100-MIN CONCERT STORY SHOW</p>
                    </div>

                    {/* Perforated ticket details body */}
                    <div className="p-5 text-left space-y-4 relative">
                      {/* Left and right ticket side punches */}
                      <div className="absolute top-1/2 left-[-10px] w-5 h-5 rounded-full bg-[#0f0a07] border-r border-[#52331f]/75 -translate-y-1/2" />
                      <div className="absolute top-1/2 right-[-10px] w-5 h-5 rounded-full bg-[#0f0a07] border-l border-[#52331f]/75 -translate-y-1/2" />

                      <div className="grid grid-cols-2 gap-4 border-b border-[#302117] pb-3.5">
                        <div>
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">HOLDER</span>
                          <span className="text-xs font-bold text-white block uppercase truncate">
                            {successReservation.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">PASS ID</span>
                          <span className="text-xs font-bold font-mono text-[#e6b17a] block">
                            {successReservation.id}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b border-[#302117] pb-3.5">
                        <div>
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">VENUE</span>
                          <span className="text-xs font-bold text-white block">
                            {selectedShow.venue}
                          </span>
                          <span className="text-[9px] text-[#d1bfae]/80 font-mono">
                            {selectedShow.location}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">DATE & TIME</span>
                          <span className="text-xs font-bold text-white block">
                            {selectedShow.date}
                          </span>
                          <span className="text-[10px] text-[#e6b17a] font-mono block">
                            {selectedShow.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">COUNT</span>
                          <span className="text-sm font-black text-white">
                            {successReservation.ticketsCount} Seats Secured
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-[#a27b5c] font-mono uppercase block">DONATION SLUR</span>
                          <span className="text-sm font-serif font-black text-[#e6b17a]">
                            {selectedShow.price}
                          </span>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="pt-4 flex flex-col items-center">
                        <div className="h-8 bg-white/10 w-full rounded flex items-center justify-around overflow-hidden px-4 mb-1">
                          {[1,2,1,3,1,4,1,2,3,1,2,1,4,2,1,3,1,2,1,4,1,2,1,3,1,4,1,2,3,1].map((bar, i) => (
                            <div
                              key={i}
                              className="bg-white h-full"
                              style={{ width: `${bar * 1}px`, opacity: i % 3 === 0 ? 0.35 : 0.8 }}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] text-[#a27b5c] tracking-[6px] font-mono">
                          {successReservation.id}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#24130a] text-center py-2.5 border-t border-[#52331f]/75">
                      <span className="text-[9px] font-mono text-[#e6b17a]">
                        PERFORMER: ANNESHA PARTHA MISHRA
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#d1bfae]/85">
                    This ticket is saved in your personalized **Booking Vault** panel. Tap to go back and book another date or close the frame.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedShow(null)}
                      className="flex-1 bg-[#16100c] hover:bg-[#201712] border border-[#3e2c1f] text-white text-xs font-bold py-2.5 rounded"
                    >
                      Return to Events Catalog
                    </button>
                    <button
                      onClick={() => {
                        alert("In a production web space, this downloads the PDF ticket. We've saved it inside your local layout's vault successfully!");
                      }}
                      className="flex-1 bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Reservation Form */
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="bg-[#1b120c] border border-[#3e2c1f] p-4 rounded-xl text-xs space-y-1">
                    <span className="font-mono text-[#a27b5c] uppercase text-[10px]">active selection</span>
                    <h4 className="font-serif font-bold text-[#e6b17a] text-sm">
                      {selectedShow.title}
                    </h4>
                    <p className="text-[#d1bfae] font-light">
                      {selectedShow.venue} • {selectedShow.location} • {selectedShow.date}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block">
                      Full Guest Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={14} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] focus:ring-1 focus:ring-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                        id="form-booking-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={14} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@gmail.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] focus:ring-1 focus:ring-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                        id="form-booking-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block">
                      WhatsApp Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={14} />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] focus:ring-1 focus:ring-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                        id="form-booking-phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block mb-1">
                        Seat Tickets
                      </label>
                      <select
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none cursor-pointer"
                        id="form-booking-tcount"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Seat" : "Seats"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-xs font-mono font-semibold text-[#a27b5c] block mb-1 uppercase">
                        Seat Contribution
                      </span>
                      <div className="bg-[#1a120c] border border-[#3e2b1d] px-3 py-2 rounded text-base font-serif font-black text-[#e6b17a]">
                        ₹{parseFloat(selectedShow.price.replace("₹", "")) * ticketCount}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#bc4123] to-[#8c2a1c] hover:from-[#ce4c2a] hover:to-[#a03625] text-white text-xs font-bold py-3.5 rounded-lg shadow-lg tracking-wider uppercase transition-transform active:scale-95 cursor-pointer mt-4"
                    id="form-submit-booking-btn"
                  >
                    Confirm simulated Seat & Print Ticket
                  </button>
                  <p className="text-[10px] text-center text-[#a27b5c] italic">
                    By reserving options, you support Jamshedpur independent musical storytelling.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
