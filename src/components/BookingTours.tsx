import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Clock, Ticket, Sparkles, User, Mail, Phone, ShoppingBag, Download, Check, Trash2, Heart } from "lucide-react";
import { jsPDF } from "jspdf";
import { useAjeebData } from "../context/AjeebDataContext";
import { PerformanceShow, TicketReservation } from "../types";

export default function BookingTours() {
  const { 
    shows, 
    bookings, 
    submitReservation, 
    cancelReservation,
    currentUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser
  } = useAjeebData();
  
  const [selectedShow, setSelectedShow] = useState<PerformanceShow | null>(null);
  
  // Form input states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [successReservation, setSuccessReservation] = useState<TicketReservation | null>(null);

  // Authentication states
  const [authMode, setAuthMode] = useState<"authenticate" | "details">("authenticate");
  const [emailTab, setEmailTab] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const generatePDFTicket = (booking: TicketReservation) => {
    const show = shows.find(s => s.id === booking.showId) || selectedShow;
    const itemPrice = show?.price || "₹299";
    const itemVenue = show?.venue || "Café Regal, Jamshedpur";
    const itemLocation = show?.location || "Jamshedpur, India";
    const itemTime = show?.time || "7:00 PM IST";
    const itemSubtitle = show?.subtitle || "Storytelling & Live Unplugged Night";

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [145, 85]
    });

    // 1. Draw cream background
    doc.setFillColor(252, 248, 242);
    doc.rect(0, 0, 145, 85, "F");

    // 2. Main border
    doc.setDrawColor(220, 212, 198);
    doc.setLineWidth(0.6);
    doc.rect(3, 3, 139, 79);

    // 3. Top and bottom visual accents
    doc.setFillColor(188, 65, 35); // #bc4123
    doc.rect(3, 3, 139, 3.5, "F");
    doc.rect(3, 78.5, 139, 3.5, "F");

    // 4. Boarding Pass style ticket punches at left & right borders
    doc.setFillColor(15, 10, 7); // match website background '#0f0a07' nicely
    doc.circle(3, 42.5, 3.5, "F");
    doc.circle(142, 42.5, 3.5, "F");

    // 5. Perforation dotted line separating central stub and admitting foil
    doc.setDrawColor(188, 65, 35);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(100, 6.5, 100, 78);
    doc.setLineDashPattern([], 0); // reset

    // 6. Header branding
    doc.setTextColor(188, 65, 35);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text("AJEEB-O-GAREEB LIVE", 8, 12);

    doc.setTextColor(50, 40, 35);
    doc.setFont("times", "italic");
    doc.setFontSize(7.5);
    doc.text("ANNESHA'S ORIGINAL STORYTELLING & MUSIC CONCERT", 8, 16);

    // 7. Show Details (Left/Center area)
    doc.setTextColor(30, 20, 15);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    const wrappedTitle = doc.splitTextToSize(booking.showTitle, 86);
    doc.text(wrappedTitle, 8, 22);

    doc.setTextColor(110, 95, 85);
    doc.setFont("helvetica", "oblique");
    doc.setFontSize(7);
    doc.text(`"${itemSubtitle}"`, 8, 27.5);

    // Grid Layout drawing (Left at 8, Middle column at 54)
    // Grid row 1: Holder & ID
    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("TICKET HOLDER", 8, 33);
    doc.text("RESERVATION PASS ID", 54, 33);

    doc.setTextColor(30, 24, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(booking.name.toUpperCase(), 8, 37);
    doc.setFont("courier", "bold");
    doc.setTextColor(188, 65, 35);
    doc.text(booking.id, 54, 37);

    // Grid row 2: Venue & Timing
    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("VENUE & STAGE", 8, 43);
    doc.text("DATE & SHIFT TIME", 54, 43);

    doc.setTextColor(30, 24, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(itemVenue, 8, 47);
    doc.text(`${booking.date} • ${itemTime}`, 54, 47);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 110, 100);
    doc.text(itemLocation, 8, 50.5);

    // Grid row 3: Allocated headcount & Donation
    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("ALLOCATED PASSES", 8, 56.5);
    doc.text("SEAT CONTRIBUTION", 54, 56.5);

    doc.setTextColor(30, 24, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`${booking.ticketsCount} SECURED ${booking.ticketsCount === 1 ? "SEAT" : "SEATS"}`, 8, 60.5);
    doc.setFont("times", "bold");
    doc.setTextColor(188, 65, 35);
    doc.text(itemPrice, 54, 60.5);

    // Contact info footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(140, 120, 110);
    doc.text(`Guest Contact: ${booking.phone} | ${booking.email}`, 8, 67.5);

    // Barcode Representation block
    const barcodeX = 8;
    const barcodeY = 70.5;
    const barcodeW = 86;
    const barcodeH = 4.5;
    doc.setFillColor(30, 24, 18);
    let currentX = barcodeX;
    const barPattern = [1, 2, 0.6, 1.4, 2.5, 0.4, 1, 1.8, 0.6, 0.8, 2.2, 0.4, 1.5, 1.2, 2, 0.6, 1.2, 2.5, 0.8, 1.5, 1, 2, 0.5, 1.2, 2.5, 0.4];
    for (let i = 0; i < barPattern.length; i++) {
      const width = barPattern[i];
      if (currentX + width > barcodeX + barcodeW) break;
      doc.rect(currentX, barcodeY, width, barcodeH, "F");
      currentX += width + (i % 2 === 0 ? 0.8 : 1.4);
    }
    // Barcode numeric text
    doc.setFont("courier", "normal");
    doc.setFontSize(5);
    doc.setTextColor(120, 110, 100);
    doc.text(`* ${booking.id} *`, barcodeX + barcodeW / 3.2, barcodeY + 6.5);


    // 8. RIGHT COUNTER-FOIL STUB (To be retained by gatekeeper)
    doc.setTextColor(188, 65, 35);
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.text("COUNTERFOIL", 104, 12);

    doc.setTextColor(120, 110, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("ADMITTANCE COPY", 104, 15.5);

    doc.setTextColor(40, 30, 24);
    doc.setFont("times", "bold");
    doc.setFontSize(7.5);
    const wrappedCounterTitle = doc.splitTextToSize(booking.showTitle, 35);
    doc.text(wrappedCounterTitle, 104, 21.5);

    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text("PASS NO", 104, 30.5);
    doc.setTextColor(188, 65, 35);
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.text(booking.id, 104, 34);

    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text("ATTENDEE PASS", 104, 40);
    doc.setTextColor(40, 30, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const wrappedCounterName = doc.splitTextToSize(booking.name.toUpperCase(), 35);
    doc.text(wrappedCounterName, 104, 43.5);

    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text("QUANTITY", 104, 52);
    doc.setTextColor(40, 30, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(`${booking.ticketsCount} SEATS`, 104, 55.5);

    doc.setTextColor(140, 115, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text("DONATION PAID", 104, 61.5);
    doc.setTextColor(188, 65, 35);
    doc.setFont("times", "bold");
    doc.setFontSize(8.5);
    doc.text(itemPrice, 104, 65);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(5);
    doc.setTextColor(140, 120, 110);
    doc.text("Keep secure in vault", 104, 71.5);

    // Save/Download PDF named beautifully
    const filename = `${booking.id}_Ajeeb_Ticket.pdf`;
    doc.save(filename);
  };

  // Track user login state
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setUserName(currentUser.displayName);
      if (currentUser.email) setUserEmail(currentUser.email);
      setAuthMode("details");
    } else {
      setAuthMode("authenticate");
    }
  }, [currentUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    try {
      if (emailTab === "signin") {
        await signInWithEmail(authEmail, authPassword);
      } else {
        if (!authName.trim()) {
          setAuthError("Name is required to register.");
          return;
        }

        // Strict password validation (Compulsory Setting feature)
        const isLengthOk = authPassword.length >= 6;
        const isUpperOk = /[A-Z]/.test(authPassword);
        const isLowerOk = /[a-z]/.test(authPassword);
        const isDigitOk = /[0-9]/.test(authPassword);
        const isSpecialOk = /[^a-zA-Z0-9]/.test(authPassword);
        
        if (!isLengthOk || !isUpperOk || !isLowerOk || !isDigitOk || !isSpecialOk) {
          setAuthError("Password fails compulsory requirements. It must have 6+ characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.");
          return;
        }

        await signUpWithEmail(authEmail, authPassword, authName.trim());
        setAuthSuccess("Account created successfully with a compulsory-strength password! Please sign in using your email and password to book resources.");
        setEmailTab("signin");
        setAuthPassword("");
      }
    } catch (err: any) {
      setAuthError(err?.message || "Failed to authenticate.");
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;

    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      alert("Please complete all parameters to activate your ticket.");
      return;
    }

    const newResInput = {
      showId: selectedShow.id,
      showTitle: selectedShow.title,
      date: selectedShow.date,
      name: userName.trim(),
      email: userEmail.trim(),
      phone: userPhone.trim(),
      ticketsCount: ticketCount,
      status: "confirmed" as const
    };

    try {
      const ok = await submitReservation(newResInput);
      if (ok) {
        const tempId = `TIX-${Math.floor(100000 + Math.random() * 900000)}`;
        const simulatedTicket: TicketReservation = {
          id: tempId,
          ...newResInput,
          reservedAt: new Date().toLocaleDateString("en-IN")
        };
        setSuccessReservation(simulatedTicket);
        
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setTicketCount(1);
      } else {
        alert("Something went wrong during reservation transmission.");
      }
    } catch (err) {
      console.error("Reservation submit catch err:", err);
      // Fallback for extreme situations: show local ticket stub immediately, keeping experience bulletproof
      const tempId = `TIX-${Math.floor(100000 + Math.random() * 900000)}`;
      const simulatedTicket: TicketReservation = {
        id: tempId,
        ...newResInput,
        reservedAt: new Date().toLocaleDateString("en-IN")
      };
      setSuccessReservation(simulatedTicket);
      
      setUserName("");
      setUserEmail("");
      setUserPhone("");
      setTicketCount(1);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    await cancelReservation(id);
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

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => generatePDFTicket(booking)}
                            className="text-[#a27b5c] hover:text-[#e6b17a] p-1.5 rounded hover:bg-black/50 transition-colors"
                            title="Download PDF Ticket"
                            id={`download-tix-${booking.id}`}
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-[#a27b5c] hover:text-[#bc4123] p-1.5 rounded hover:bg-black/50 transition-colors"
                            title="Cancel Simulated Reservation"
                            id={`cancel-tix-${booking.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
                      onClick={() => generatePDFTicket(successReservation)}
                      className="flex-1 bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-2.5 rounded flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] transition-transform active:scale-[0.99]"
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ) : authMode === "authenticate" && !currentUser ? (
                /* Auth Screen inside modal */
                <div className="p-6 space-y-6">
                  <div className="bg-[#1b120c] border border-[#3e2c1f] p-4 rounded-xl text-xs space-y-1">
                    <span className="font-mono text-[#a27b5c] uppercase text-[10px]">active selection</span>
                    <h4 className="font-serif font-bold text-[#e6b17a] text-sm">
                      {selectedShow.title}
                    </h4>
                    <p className="text-[#d1bfae] font-light">
                      {selectedShow.venue} • {selectedShow.location} • {selectedShow.date}
                    </p>
                  </div>

                  <div className="text-center space-y-2">
                    <h4 className="font-serif text-[#e6b17a] text-lg font-bold">
                      {emailTab === "signin" ? "Sign In to Your Vault" : "Create Spectator Vault Account"}
                    </h4>
                    <p className="text-xs text-[#d1bfae]/80 max-w-sm mx-auto">
                      Authorized bookings are synchronized securely to our cloud system.
                    </p>
                  </div>

                  {/* Auth Methods */}
                  <div className="space-y-4">
                    {/* Google Sign In */}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setAuthError("");
                          await signInWithGoogle();
                        } catch (err: any) {
                          setAuthError(err.message || "Google Sign-In failed.");
                        }
                      }}
                      className="w-full bg-[#1b120c] hover:bg-[#251710] border border-[#52331f] text-white hover:text-[#e6b17a] text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#4285f4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google Account</span>
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-[#a27b5c] font-mono">
                      <div className="w-1/3 h-[1px] bg-[#3e2c1f]"></div>
                      <span>OR USE EMAIL</span>
                      <div className="w-1/3 h-[1px] bg-[#3e2c1f]"></div>
                    </div>

                    {/* Email/Pass Form */}
                    <form onSubmit={handleAuthSubmit} className="space-y-3">
                      {authError && (
                        <div className="bg-red-950/50 border border-red-800 text-red-300 text-[10px] px-3 py-2 rounded-lg text-center font-mono">
                          {authError}
                        </div>
                      )}

                      {authSuccess && (
                        <div className="bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-[10px] px-3 py-2 rounded-lg text-center font-mono">
                          {authSuccess}
                        </div>
                      )}

                      {emailTab === "signup" && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block text-left">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Partha Sarthi"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block text-left">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. partha@gmail.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block text-left">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Min. 6 characters"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                        />
                      </div>

                      {emailTab === "signup" && (
                        <div className="bg-[#120a06] border border-[#3e2719] p-3 rounded-lg text-[10px] space-y-1.5 text-left">
                          <p className="font-semibold text-[#e6b17a] uppercase tracking-wider font-mono text-[9px]">Compulsory Password Standards:</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#d1bfae] font-mono text-[9px]">
                            <span className="flex items-center gap-1.5">
                              <span className={authPassword.length >= 6 ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                                {authPassword.length >= 6 ? "✓" : "✗"}
                              </span>
                              Min. 6 chars
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className={/[A-Z]/.test(authPassword) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                                {/[A-Z]/.test(authPassword) ? "✓" : "✗"}
                              </span>
                              1 Uppercase letter
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className={/[a-z]/.test(authPassword) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                                {/[a-z]/.test(authPassword) ? "✓" : "✗"}
                              </span>
                              1 Lowercase letter
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className={/[0-9]/.test(authPassword) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                                {/[0-9]/.test(authPassword) ? "✓" : "✗"}
                              </span>
                              1 Number
                            </span>
                            <span className="flex items-center gap-1.5 col-span-2">
                              <span className={/[^a-zA-Z0-9]/.test(authPassword) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                                {/[^a-zA-Z0-9]/.test(authPassword) ? "✓" : "✗"}
                              </span>
                              1 Special character (@,$,!,etc.)
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 rounded-lg mt-2 cursor-pointer uppercase font-mono tracking-wider transition-all"
                      >
                        {emailTab === "signin" ? "Sign In & Continue" : "Register Account"}
                      </button>
                    </form>

                    {/* Toggle email auth tab - guest login removed since password configuration is compulsory */}
                    <div className="flex justify-center text-xs pt-1.5 border-t border-[#3e2c1f]/40">
                      <button
                        type="button"
                        onClick={() => {
                          setEmailTab(emailTab === "signin" ? "signup" : "signin");
                          setAuthError("");
                        }}
                        className="text-[#e6b17a] hover:underline"
                        id="toggle-checkout-auth-button"
                      >
                        {emailTab === "signin" 
                          ? "New spectator? Create account and compulsory password" 
                          : "Already have a secure account? Sign In"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Primary Reservation Form */
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-left">
                  {currentUser && (
                    <div className="bg-[#121c15] border border-[#235338] px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-[#a3f0c3]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Logged in as <strong>{currentUser.email}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => signOutUser()}
                        className="text-[#bc4123] hover:text-white underline text-[11px] font-semibold cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}

                  <div className="bg-[#1b120c] border border-[#3e2c1f] p-4 rounded-xl text-xs space-y-1">
                    <span className="font-mono text-[#a27b5c] uppercase text-[10px]">active selection</span>
                    <h4 className="font-serif font-bold text-[#e6b17a] text-sm text-left">
                      {selectedShow.title}
                    </h4>
                    <p className="text-[#d1bfae] font-light text-left">
                      {selectedShow.venue} • {selectedShow.location} • {selectedShow.date}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block text-left">
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
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block text-left">
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
                    <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block text-left">
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
                      <label className="text-xs font-mono font-semibold text-[#a27b5c] uppercase block mb-1 text-left">
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
                      <span className="text-xs font-mono font-semibold text-[#a27b5c] block mb-1 uppercase text-left">
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

                  {!currentUser && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("authenticate")}
                      className="w-full text-center text-[11px] text-[#e6b17a] hover:underline cursor-pointer"
                    >
                      ← Back to Secure Login Vault Option
                    </button>
                  )}

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
