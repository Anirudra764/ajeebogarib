import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAjeebData } from "../context/AjeebDataContext";
import { jsPDF } from "jspdf";
import { 
  User, 
  Mail, 
  Lock, 
  Check, 
  X, 
  Download, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  LogOut, 
  Calendar, 
  Ticket 
} from "lucide-react";
import { TicketReservation } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialTab = "signin" }: AuthModalProps) {
  const {
    currentUser,
    bookings,
    shows,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    cancelReservation
  } = useAjeebData();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setError("");
    setSuccess("");
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (activeTab === "signin") {
        await signInWithEmail(email, password);
        setSuccess("Signed in successfully!");
        setTimeout(() => {
          onClose();
          // Reset form fields
          setEmail("");
          setPassword("");
        }, 1200);
      } else {
        if (!name.trim()) {
          setError("Display name is required to register.");
          setLoading(false);
          return;
        }

        // Strict password validation (Compulsory Setting feature)
        const isLengthOk = password.length >= 6;
        const isUpperOk = /[A-Z]/.test(password);
        const isLowerOk = /[a-z]/.test(password);
        const isDigitOk = /[0-9]/.test(password);
        const isSpecialOk = /[^a-zA-Z0-9]/.test(password);

        if (!isLengthOk || !isUpperOk || !isLowerOk || !isDigitOk || !isSpecialOk) {
          setError("Password fails compulsory requirements. It must have 6+ characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.");
          setLoading(false);
          return;
        }

        await signUpWithEmail(email, password, name.trim());
        setSuccess("Account configured successfully with your compulsory-strength password! Please sign in using your credentials to enter.");
        setActiveTab("signin");
        setPassword("");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate. Please verify and retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess("Authenticated via Google successfully!");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Google Authentication failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDFTicket = (booking: TicketReservation) => {
    const show = shows.find(s => s.id === booking.showId);
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
    doc.setFillColor(15, 10, 7); // match website background '#0f0a07'
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

    const filename = `${booking.id}_Ajeeb_Ticket.pdf`;
    doc.save(filename);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      {/* Backdrop interaction click off */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f0a07] border border-[#443022] rounded-2xl overflow-hidden w-full max-w-md shadow-2xl relative z-10 my-8"
      >
        {/* Header decoration block */}
        <div className="bg-[#16100c] border-b border-[#302117] px-6 py-4 flex justify-between items-center">
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#e6b17a] flex items-center gap-1.5">
            <Ticket size={16} className="text-[#bc4123]" />
            {currentUser ? "My Spectator Vault" : "Authentication Vault"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#bc4123] hover:text-white text-xs font-semibold hover:bg-black/40 p-1.5 rounded-full"
            id="close-auth-modal"
          >
            <X size={16} />
          </button>
        </div>

        {currentUser ? (
          /* Profile / Spectator Vault View */
          <div className="p-6 space-y-5">
            <div className="bg-[#1a120c] border border-[#3e2b1d] p-4 rounded-xl text-xs space-y-2">
              <span className="font-mono text-[#a27b5c] uppercase text-[9px] tracking-wider block">Logged In Spectator</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#bc4123]/10 border border-[#bc4123]/30 flex items-center justify-center text-[#e6b17a] font-serif text-base font-bold">
                  {(currentUser.displayName || currentUser.email || "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">
                    {currentUser.displayName || "Spectator Guest"}
                  </h4>
                  <p className="text-[#d1bfae]/80 text-[11px] font-mono select-all">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* List Active Bookings */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a27b5c] block">
                Synchronized Concert Passes ({bookings.length})
              </span>

              {bookings.length === 0 ? (
                <div className="border border-dashed border-[#3e2c1f] p-6 text-center rounded-xl text-[11px] text-[#d1bfae]/70 leading-relaxed bg-[#0b0c09]/30">
                  You don't have any seats reserved under this account. Use the "Shows & Tours" section below to make a live reservation!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-[#140e0a] border border-[#302117]/85 p-3 rounded-lg flex items-center justify-between gap-2"
                      id={`vault-modal-booking-${booking.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[9px] text-[#bc4123] font-bold bg-[#2a130d] px-1.5 py-0.5 rounded">
                          {booking.id}
                        </span>
                        <h5 className="font-serif text-xs font-semibold text-white mt-1 truncation line-clamp-1">
                          {booking.showTitle}
                        </h5>
                        <p className="text-[9px] text-[#a27b5c] font-mono mt-0.5">
                          {booking.date} • {booking.ticketsCount} {booking.ticketsCount === 1 ? "Seat" : "Seats"}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => generatePDFTicket(booking)}
                          className="p-1.5 rounded hover:bg-black/60 text-[#a27b5c] hover:text-[#e6b17a] transition-colors"
                          title="Print/Download high-fidelity ticket"
                          id={`vault-modal-dl-${booking.id}`}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => cancelReservation(booking.id)}
                          className="p-1.5 rounded hover:bg-black/60 text-[#a27b5c] hover:text-[#bc4123] transition-colors"
                          title="Cancel simulated booking reservation"
                          id={`vault-modal-del-${booking.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout control button */}
            <button
              onClick={async () => {
                await signOutUser();
                onClose();
              }}
              className="w-full bg-[#1b120c] hover:bg-[#2c130d] border border-[#522a1f]/80 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-white hover:text-red-300 transition-colors cursor-pointer"
              id="vault-logout-btn"
            >
              <LogOut size={13} />
              <span>Sign Out of Vault</span>
            </button>
          </div>
        ) : (
          /* Authentication Screen */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1.5">
              <h4 className="font-serif text-[#e6b17a] text-base font-bold">
                {activeTab === "signin" ? "Explore Spectator Vault" : "Register Spectator Identity"}
              </h4>
              <p className="text-xs text-[#d1bfae]/80 max-w-xs mx-auto">
                Keep track of offline tickets and comment on concert photos.
              </p>
            </div>

            {/* Google provider button login alternative */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={loading}
              className="w-full bg-[#1a120c] hover:bg-[#251810] border border-[#52331f] text-white hover:text-[#e6b17a] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              id="modal-google-auth-btn"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#4285f4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? "Authenticating..." : "Continue with Google"}</span>
            </button>

            <div className="flex items-center justify-between text-[9px] text-[#a27b5c] font-mono">
              <div className="w-[30%] h-[1px] bg-[#3e2c1f]"></div>
              <span>OR USE SPECTATOR EMAIL</span>
              <div className="w-[30%] h-[1px] bg-[#3e2c1f]"></div>
            </div>

            {/* Email/Password Fields submission form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-left">
              {error && (
                <div className="bg-red-950/45 border border-red-800 text-red-300 text-[10px] px-3 py-2 rounded-lg text-center font-mono flex items-center justify-center gap-1.5">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-950/45 border border-emerald-800 text-emerald-300 text-[10px] px-3 py-2 rounded-lg text-center font-mono flex items-center justify-center gap-1.5">
                  <Check size={12} className="shrink-0 text-emerald-400" />
                  <span>{success}</span>
                </div>
              )}

              {activeTab === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block">
                    Spectator Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={13} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Partha Sarthi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={13} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. viewer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-[#a27b5c] uppercase block">
                  Vault Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a27b5c]" size={13} />
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs bg-[#0b0705] border border-[#3e2b1d] focus:border-[#e6b17a] text-white pl-9 pr-3 py-2.5 rounded focus:outline-none"
                  />
                </div>
              </div>

              {activeTab === "signup" && (
                <div className="bg-[#120a06] border border-[#3e2719] p-3 rounded-lg text-[10px] space-y-1.5 text-left">
                  <p className="font-semibold text-[#e6b17a] uppercase tracking-wider font-mono text-[9px]">Compulsory Password Standards:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[#d1bfae] font-mono text-[9px]">
                    <span className="flex items-center gap-1.5">
                      <span className={password.length >= 6 ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                        {password.length >= 6 ? "✓" : "✗"}
                      </span>
                      Min. 6 chars
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={/[A-Z]/.test(password) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                        {/[A-Z]/.test(password) ? "✓" : "✗"}
                      </span>
                      1 Uppercase letter
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={/[a-z]/.test(password) ? "text-emerald-500 font-bold" : "text-neutral-600"}>
                        {/[a-z]/.test(password) ? "✓" : "✗"}
                      </span>
                      1 Lowercase letter
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={/[0-9]/.test(password) ? "text-[#10b981] font-bold" : "text-neutral-600"}>
                        {/[0-9]/.test(password) ? "✓" : "✗"}
                      </span>
                      1 Number
                    </span>
                    <span className="flex items-center gap-1.5 col-span-2">
                      <span className={/[^a-zA-Z0-9]/.test(password) ? "text-[#10b981] font-bold" : "text-neutral-600"}>
                        {/[^a-zA-Z0-9]/.test(password) ? "✓" : "✗"}
                      </span>
                      1 Special character (@,$,!,etc.)
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 rounded-lg mt-3 cursor-pointer uppercase font-mono tracking-wider transition-all disabled:opacity-50"
              >
                {loading 
                  ? "Verifying Secure Vault..." 
                  : activeTab === "signin" 
                    ? "Enter Spectator Vault" 
                    : "Create Secure Vault"}
              </button>
            </form>

            {/* Dialog tab switcher */}
            <div className="text-center pt-1.5 border-t border-[#302117]/30">
              <button
                onClick={() => {
                  setActiveTab(activeTab === "signin" ? "signup" : "signin");
                  setError("");
                  setSuccess("");
                }}
                className="text-xs text-[#e6b17a] hover:underline cursor-pointer"
              >
                {activeTab === "signin" 
                  ? "New Spectator? Register Private Vault Account" 
                  : "Already registered? Sign In to your Vault"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
