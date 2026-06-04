import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Pin, BookOpen, PenTool, CheckCircle } from "lucide-react";

interface ParchmentNote {
  id: string;
  author: string;
  relation: string; // Jamshedpur Local, Student, Artist, Backstage Crew etc.
  text: string;
  colorClass: string;
  date: string;
  tilt: number;
}

export default function ParchmentWall() {
  const [notes, setNotes] = useState<ParchmentNote[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [relation, setRelation] = useState("Jamshedpur Local");
  const [noteText, setNoteText] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-[#281c12] border-[#744e32]"); 
  const [isSuccess, setIsSuccess] = useState(false);

  const colors = [
    { label: "Ochre Earth", bg: "bg-[#281c12] border-[#744e32]", ink: "text-[#e6b17a]" },
    { label: "Thespian Crimson", bg: "bg-[#26100c] border-[#722014]", ink: "text-[#f29f90]" },
    { label: "Parchment Wood", bg: "bg-[#181410] border-[#48392d]", ink: "text-[#d1bfae]" },
    { label: "Night Reverb", bg: "bg-[#0f1115] border-[#293d52]", ink: "text-[#9cbcd0]" }
  ];

  // Default atmospheric starting notes
  const initialNotes: ParchmentNote[] = [
    {
      id: "note-1",
      author: "Pritha Sen",
      relation: "Cafe Regal Regular",
      text: "The homecoming gig felt like magic. We huddled near the ancient fireplace drinking bad tea, but the melodies felt like actual physical blankets. Jamshedpur has been waiting for this kind of writing.",
      colorClass: "bg-[#281c12] border-[#744e32]",
      date: "May 2026",
      tilt: -2
    },
    {
      id: "note-2",
      author: "Abhishek K.",
      relation: "Arka Jain Alumnus",
      text: "I remember when Annesha won that storytelling scripting scholarship. Most of us thought english theater was dead here. She proved that if you play chords on top of true stories, Jamshedpur will listen.",
      colorClass: "bg-[#181410] border-[#48392d]",
      date: "March 2026",
      tilt: 3
    },
    {
      id: "note-3",
      author: "Sujata Singh",
      relation: "Storyteller & Fan",
      text: "Dopamine Hit is currently my favorite podcast on my evening walks. EP 05 about her father's values and lessons made me call mine right after it finished. Much love and light, Annesha!",
      colorClass: "bg-[#26100c] border-[#722014]",
      date: "April 2026",
      tilt: -1
    }
  ];

  const loadNotesFromStorage = () => {
    try {
      const stored = localStorage.getItem("ajeeb_parchments");
      if (stored) {
        setNotes(JSON.parse(stored));
      } else {
        setNotes(initialNotes);
        localStorage.setItem("ajeeb_parchments", JSON.stringify(initialNotes));
      }
    } catch (e) {
      setNotes(initialNotes);
    }
  };

  useEffect(() => {
    loadNotesFromStorage();

    const handleUpdate = () => {
      loadNotesFromStorage();
    };

    window.addEventListener("ajeeb-state-updated", handleUpdate);
    return () => window.removeEventListener("ajeeb-state-updated", handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote: ParchmentNote = {
      id: `NOTE-${Date.now()}`,
      author: authorName.trim() || "Anonymous storybox",
      relation: relation,
      text: noteText.trim(),
      colorClass: selectedColor,
      date: "June 2026",
      tilt: Math.floor(Math.random() * 8) - 4 // tilt -4 to 3 deg for physical look
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem("ajeeb_parchments", JSON.stringify(updated));
      window.dispatchEvent(new Event("ajeeb-state-updated"));
    } catch (err) {}

    // Form Reset
    setAuthorName("");
    setNoteText("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const clearMyNotes = () => {
    if (confirm("Reset the Parchment Wall to original entries?")) {
      setNotes(initialNotes);
      try {
        localStorage.setItem("ajeeb_parchments", JSON.stringify(initialNotes));
        window.dispatchEvent(new Event("ajeeb-state-updated"));
      } catch (e) {}
    }
  };

  return (
    <section
      id="community"
      className="py-24 bg-[#0f0a07] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(40,20,10,0.15),transparent_80%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title details */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#bc4123] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 mb-2">
            <PenTool size={13} className="text-[#e6b17a]" />
            interactive board of stories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight mb-4">
            The Parchment Wall
          </h2>
          <div className="w-16 h-1 bg-[#bc4123] mx-auto mb-6"></div>
          <p className="text-[#d1bfae] text-sm max-w-xl mx-auto">
            Storytelling is a collective act. Leave a physical-looking virtual note with your memory, an emotional feeling that "Ajeeb-o-Gareeb" inspires, or a blessing for Jamshedpur's musical.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Post box form */}
          <div className="lg:col-span-5 bg-[#0b0705] border border-[#3a271c] p-6 sm:p-8 rounded-2xl shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#e6b17a] mb-2">
              Write a Parchment Note
            </h3>
            <p className="text-xs text-[#d1bfae] mb-6">
              Your message will immediately be pinned to the wooden boards on the right! Feel free to write under a pseudonym.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block mb-1">
                  Your Signature Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jamshedpur Dreamer"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none"
                  id="form-parch-author"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block mb-1">
                  Who Are You?
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white px-3 py-2.5 rounded focus:outline-none cursor-pointer"
                  id="form-parch-relation"
                >
                  <option value="Jamshedpur Local">Jamshedpur Local</option>
                  <option value="Cafe Regal regular">Cafe Regal regular</option>
                  <option value="AJU Student">Arka Jain University Student</option>
                  <option value="Independent Artist">Independent Artist</option>
                  <option value="Fellow Traveler">Fellow Traveler</option>
                </select>
              </div>

              {/* Ink & parchment choice */}
              <div>
                <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block mb-2">
                  Select Ink & Parchment Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {colors.map((col) => (
                    <button
                      type="button"
                      key={col.label}
                      onClick={() => setSelectedColor(col.bg)}
                      className={`text-[10px] py-2 px-1.5 rounded border text-center transition-all cursor-pointer ${
                        selectedColor === col.bg
                          ? "bg-stone-900 border-[#e6b17a] text-white font-bold"
                          : "bg-black border-[#2c1d15] text-[#d1bfae]"
                      }`}
                      id={`parch-color-${col.label.toLowerCase().replace(" ", "-")}`}
                    >
                      <span className={col.ink}>{col.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-medium text-[#a27b5c] uppercase block mb-1">
                  Your Note or Memory
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type a memory of Annesha's music, a reflection on Sa Re Ga Ma Pa resilience, or a note representing your own strange storytelling mind..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full text-xs bg-[#0f0a07] border border-[#3e2b1d] focus:border-[#e6b17a] text-white p-3 rounded focus:outline-none resize-none"
                  id="form-parch-text"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#bc4123] hover:bg-[#ce4c2a] text-white text-xs font-bold py-3 px-5 rounded-lg transition-transform active:scale-95 cursor-pointer"
                  id="form-parch-submit"
                >
                  Pin to Wall
                </button>

                {notes.length > 0 && (
                  <button
                    type="button"
                    onClick={clearMyNotes}
                    className="text-[#a27b5c] hover:text-[#bc4123] text-xs font-mono px-3 py-2 rounded border border-[#2c1d15] hover:border-[#8c2a1c] cursor-pointer"
                    id="form-parch-reset"
                  >
                    Reset Wall
                  </button>
                )}
              </div>

              {/* Status feedback */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#121c15] border border-[#235338] p-3 rounded text-xs text-[#a3f0c3] flex items-center gap-2"
                  >
                    <CheckCircle size={14} className="text-[#2ed573]" />
                    <span>Your note is pinned successfully onto the wall!</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>

          {/* Wooden note wall board */}
          <div className="lg:col-span-7 bg-[#1c140e] border border-[#443021] p-6 rounded-2xl shadow-inner relative min-h-[450px]">
            {/* Wooden textured planks background vectors */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="h-0.5 bg-black w-full" />
              <div className="h-0.5 bg-black w-full" />
              <div className="h-0.5 bg-black w-full" />
              <div className="h-0.5 bg-black w-full" />
            </div>

            <div className="relative z-10 flex flex-wrap gap-6 justify-center">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: note.tilt }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${note.colorClass} border-2 p-5 rounded shadow-lg w-full sm:w-[240px] relative transition-shadow hover:shadow-2xl z-20`}
                  id={`parch-card-${note.id}`}
                >
                  {/* Pin anchor */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-5 text-stone-500 flex flex-col items-center">
                    <Pin size={16} className="text-[#bc4123] fill-[#bc4123] drop-shadow-md" />
                  </div>

                  <div className="text-[9px] font-mono font-medium text-[#a27b5c] flex justify-between items-center mb-3">
                    <span>{note.relation}</span>
                    <span>{note.date}</span>
                  </div>

                  <p className="text-xs text-[#f7ede2] italic font-serif leading-relaxed line-clamp-5 select-text">
                    "{note.text}"
                  </p>

                  <div className="mt-4 pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                    <span className="font-mono text-[#e6b17a]">@sig: {note.author}</span>
                    <Sparkles size={11} className="text-[#bc4123]/80" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
