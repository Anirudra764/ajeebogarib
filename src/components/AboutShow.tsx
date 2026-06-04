import React from "react";
import { motion } from "motion/react";
import { Sparkles, Music, Star, Compass, Clock, Heart, Pocket } from "lucide-react";
import { useAjeebData } from "../context/AjeebDataContext";

export default function AboutShow() {
  const { showDetails } = useAjeebData();
  const cards = [
    {
      icon: <Clock className="text-[#bc4123]" size={24} />,
      title: "100 Minutes Unchecked",
      subtitle: "Duration",
      desc: "Exactly 100 minutes of continuous storytelling where time dilates, leaving absolutely zero margin for standard boredom."
    },
    {
      icon: <Music className="text-[#e6b17a]" size={24} />,
      title: "Feelings with Reverb",
      subtitle: "The Acoustic Engine",
      desc: "Live unplugged music layered with custom physical acoustics, turning spoken words directly into a spatial melodic envelope."
    },
    {
      icon: <Heart className="text-[#bc4123]" size={24} />,
      title: "Old-School Charm",
      subtitle: "Sensory Aesthetic",
      desc: "A warm throwback to candle-lit parlors, classic literature, vinyl records, and genuine, uninterrupted human intimacy."
    },
    {
      icon: <Sparkles className="text-[#e6b17a]" size={24} />,
      title: "Surreal & Strange",
      subtitle: "The Narrative Frame",
      desc: "Crafted specifically for the thinkers, the wanderers, and the emotional rebels. An experience designed to keep you spellbound."
    }
  ];

  return (
    <section
      id="about-show"
      className="py-24 bg-[#140e0a] border-t border-b border-[#302117]/50 relative"
    >
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8c2a1c]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e6b17a]/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Playbill Header Frame */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#bc4123] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 mb-2">
            <Star size={12} className="animate-spin" />
            Introducing the Show
            <Star size={12} className="animate-spin" />
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#f7ede2] tracking-tight mb-4">
            The Theatrical Essence
          </h2>
          <div className="w-16 h-1 bg-[#bc4123] mx-auto mb-6"></div>
          <p className="text-[#d1bfae] text-base leading-relaxed">
            {showDetails.shortDesc}
          </p>
        </div>

        {/* Vintage Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-[#0b0705] hover:bg-[#1a0f0a] border-t-4 border-t-[#8c2a1c] border border-[#3a271c] p-6 rounded-xl transition-all hover:translate-y-[-4px] shadow-lg group"
              id={`show-card-${idx}`}
            >
              <div className="bg-[#1f130c] w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <span className="text-[10px] font-mono tracking-widest font-semibold text-[#a27b5c] uppercase mb-1 block">
                {card.subtitle}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#e6b17a] mb-2 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-[#d1bfae]/80 leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Double-Column Vintage Brochure Feature */}
        <div className="bg-[#0b0705] border border-[#3a271c] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Poster representation */}
          <div className="lg:col-span-5 relative py-12 px-8 flex flex-col justify-between bg-gradient-to-br from-[#25130a] to-[#0c0806] border-r border-[#3a271c]">
            {/* Background texture watermark */}
            <div className="absolute inset-0 bg-[radial-gradient(#8c2a1c_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            <div className="relative z-10">
              <span className="font-serif text-sm text-[#e6b17a] tracking-widest uppercase block mb-3">
                THE PLAYBILL • PROGRAMME
              </span>
              <h3 className="font-serif text-3xl font-extrabold text-[#f7ede2] tracking-tight leading-tight">
                अजीब ओ गरीब
              </h3>
              <h4 className="font-serif text-2xl font-black text-red-500 tracking-wide mt-1 mb-2">
                অজিব ও গরিব
              </h4>
              <p className="text-xs text-[#a27b5c] font-medium tracking-widest uppercase mb-8">
                Jamshedpur Artistry Live
              </p>

              <div className="space-y-4 text-xs text-[#d1bfae]/90">
                <div className="border-b border-[#3a271c] pb-2 flex justify-between">
                  <span className="text-[#a27b5c]">GENRE</span>
                  <span className="font-medium text-white">Storytelling Musical</span>
                </div>
                <div className="border-b border-[#3a271c] pb-2 flex justify-between">
                  <span className="text-[#a27b5c]">LANGUAGE</span>
                  <span className="font-medium text-white">Hindi, English & Chords</span>
                </div>
                <div className="border-b border-[#3a271c] pb-2 flex justify-between">
                  <span className="text-[#a27b5c]">CREATOR</span>
                  <span className="font-medium text-white">Annesha Partha Mishra</span>
                </div>
                <div className="border-b border-[#3a271c] pb-2 flex justify-between">
                  <span className="text-[#a27b5c]">ATMOSPHERE</span>
                  <span className="font-medium text-white">{showDetails.atmosphere}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#3a271c] relative z-10">
              <p className="text-[#e6b17a] text-sm font-semibold italic mb-2">
                "Feelings with reverb, stories with voice..."
              </p>
              <span className="text-[10px] text-[#a27b5c]/85 block font-mono">
                COOPERATIVE THEATER FOR COZY SPACES
              </span>
            </div>
          </div>

          {/* Core Content explanation */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#e6b17a] mb-6">
              Strange, Surreal, and Seriously Unmissable
            </h3>
            <p className="text-[#d1bfae] text-sm leading-relaxed mb-6">
              What happens when acoustic guitar resonates directly on top of a story of grieving? "Ajeeb-o-Gareeb" is not a standard concert, and definitely not a dry recitation. It is an interactive circle of mutual trust. 
            </p>
            <p className="text-[#d1bfae] text-sm leading-relaxed mb-8">
              Born from late-night scripts and a theater-composition scholarship, the show features acoustic textures, deep pauses, interactive elements with the crowd, and a narrative thread honoring Jamshedpur's cozy coffee house roots. It's a gorgeous 100 minutes compiled specifically to wake your heart up.
            </p>

            {/* List tags */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {(showDetails.style || "").split("+").map((tag, i) => (
                <span
                  key={i}
                  className="bg-[#2a1a10] border border-[#543b2a] text-[#e6b17a] font-mono text-[10px] tracking-wide font-medium px-3 py-1.5 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            {/* Micro Hashtags Display */}
            <div className="pt-6 border-t border-[#3a271c]/40 flex items-center justify-between">
              <span className="text-xs text-[#a27b5c] font-medium font-mono uppercase tracking-wider">
                Follow the live story:
              </span>
              <div className="flex gap-2">
                {(showDetails.hashtags || []).map((ht) => (
                  <span key={ht} className="text-xs text-[#bc4123] font-mono font-bold hover:underline cursor-pointer">
                    {ht}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
