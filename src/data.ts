import { PerformanceShow, GalleryItem } from "./types";

export const SHOW_DETAILS = {
  title: "Ajeeb-o-Gareeb",
  hindiTitle: "अजीब ओ गरीब",
  bengaliTitle: "অজিব ও গরিব",
  duration: "100 Minutes",
  tagline: "storytelling • live music",
  subtitle: "An intimate live storytelling musical blending acoustic guitar reverb, interactive theater, and raw vulnerability.",
  taglineSecondary: "Feelings with reverb, stories with voice",
  shortDesc: "Experience the vintage allure of physical connection and raw emotion in a modern world. A live 100-minute theatrical performance where personal experiences flow seamlessly into acoustic chords, inviting collective resonance and absolute transparency.",
  atmosphere: "Strange, surreal, and seriously unmissable",
  style: "Storytelling Live Music + Acoustic Reverb + Interactive Theatre + Nostalgic Memory Loops",
  hashtags: ["#ajeebogareeb", "#jamshedpur", "#storytellingnight", "#caferegal"],
  heroImage: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800"
};

export const PERFORMER_BIO = {
  name: "Annesha Partha Mishra",
  instagramHandle: "@anneshapartha",
  showInstagramHandle: "@ajeebogareeblive",
  followersCount: "26K+",
  roles: ["Singer", "Storyteller", "Dancer", "Composer", "Writer", "Orator"],
  stats: [
    { label: "Years of Music Training", value: "16 Years" },
    { label: "Professional Grooming", value: "5 Years" },
    { label: "Stage Debut", value: "Age 3" },
    { label: "Songs Created", value: "20+" }
  ],
  education: {
    degree: "BA (H) English",
    institution: "Arka Jain University, Jamshedpur",
    batch: "2023-2026",
    scholarshipStory: "Recognizing her immense talent in scripting and direction, Arka Jain University awarded her a full storytelling scholarship. This space allowed her to refine her narrative systems, laying the physical, structural, and musical blueprint for 'Ajeeb-o-Gareeb'."
  },
  keyMilestones: [
    {
      age: "1.5 Years",
      title: "First Voice Notes",
      description: "Started humming before fully speaking, mirroring classical melodies heard around the house."
    },
    {
      age: "3 Years",
      title: "Standing spotlight",
      description: "First public stage appearance in Jamshedpur, capturing the local audience with unfiltered vocal energy."
    },
    {
      year: "2017",
      title: "A Father's Legacy",
      description: "Lost her beloved father. In her grief, his life lessons, artistic encouragements, and philosophy of resilience became her absolute foundation, teaching her that stories are meant to heal."
    },
    {
      year: "TV Run",
      title: "Sa Re Ga Ma Pa Contestant",
      description: "Stepped onto one of India's biggest national singing stages. Though she chose to withdraw in the 3rd round due to personal crossroads, she never lost her burning artistic fire—vowing to create her own stage."
    },
    {
      year: "2023-26",
      title: "The Birth of @ajeebogareeblive",
      description: "Synthesized theater, musicality, and literature during her university years to launch India's first 100-minute solo musical-storytelling journey."
    }
  ],
  podcast: {
    name: "Dopamine Hit",
    description: "Annesha's conversational podcast exploring human behaviors, creative blocks, raw emotions, and the backstage vulnerability of a young independent storyteller.",
    linkNote: "Link available in Instagram bio (@anneshapartha)"
  }
};

export const UPCOMING_EVENTS: PerformanceShow[] = [
  {
    id: "show-01",
    title: "Ajeeb-o-Gareeb: The Homecoming",
    subtitle: "A Night of Relentless Stories & Acoustic Guitars",
    description: "The premium showcase that started it all. Experience 100 minutes of pure emotional resonance in Jamshedpur's historical artistic spot.",
    duration: "100 min",
    date: "2026-06-20",
    time: "7:00 PM ILT",
    venue: "Cafe Regal 35",
    location: "Jamshedpur, JH",
    price: "₹349",
    status: "upcoming",
    isFeatured: true
  },
  {
    id: "show-02",
    title: "The 30-Day Stories Challenge: Grand Finale",
    subtitle: "Public Speaking & Interactive Crowdfunded Showcase",
    description: "Culmination of Annesha's extreme 30-day oral storytelling marathon. Witness absolute raw, unscripted poetry and public performance.",
    duration: "100 min",
    date: "2026-07-12",
    time: "6:30 PM ILT",
    venue: "Arka Jain University Auditorium",
    location: "Jamshedpur, JH",
    price: "₹199",
    status: "upcoming"
  },
  {
    id: "show-03",
    title: "Ajeeb-o-Gareeb: Monsoon Tour Kickoff",
    subtitle: "Traveling Stories",
    description: "Taking Jamshedpur's signature storytelling flavor to regional artistic cafes. Deep acoustics and shared memories.",
    duration: "100 min",
    date: "2026-08-05",
    time: "7:30 PM ILT",
    venue: "The Vintage Lounge",
    location: "Ranchi, JH",
    price: "₹399",
    status: "upcoming"
  }
];

// High-quality atmospheric images reflecting the storytelling vibe
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-01",
    type: "photo",
    url: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=600",
    title: "Under the Spotlight",
    category: "live",
    likes: 842,
    comments: 112,
    caption: "Feelings with reverb, stories with voice. A magical response from Jamshedpur. #ajeebogareeb #caferegal"
  },
  {
    id: "gal-02",
    type: "photo",
    url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600",
    title: "The Old-school Guild",
    category: "bts",
    likes: 521,
    comments: 48,
    caption: "Late night compositions, tuning and script review. Making sure every story beats matching the chords."
  },
  {
    id: "gal-03",
    type: "photo",
    url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=600",
    title: "Cafe Regal Ambience",
    category: "live",
    likes: 914,
    comments: 153,
    caption: "#jamshedpur turned up on a weekend with collective laughter and wet eyes. Warm tea and nostalgic memories."
  },
  {
    id: "gal-04",
    type: "photo",
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600",
    title: "Dopamine Hit Podcast Studio",
    category: "promo",
    likes: 721,
    comments: 89,
    caption: "EP 08: Why independent storytellers withdraw from national frameworks but keep performing in intimacy. Link in bio!"
  },
  {
    id: "gal-05",
    type: "photo",
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=600",
    title: "Collective Chords",
    category: "live",
    likes: 642,
    comments: 54,
    caption: "The crowd hummed along to original tunes drafted on old university benches. #storytellingnight"
  },
  {
    id: "gal-06",
    type: "photo",
    url: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&q=80&w=600",
    title: "The Script That Conquered",
    category: "quote",
    likes: 1205,
    comments: 204,
    caption: "'We are strange, we are surreally unmissable, and above all, we are deeply persistent.' - Ajeeb-o-Gareeb"
  }
];
