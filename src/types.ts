export interface PerformanceShow {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string; // "YYYY-MM-DD" style or formatted
  time: string;
  venue: string;
  location: string;
  price: string;
  status: "upcoming" | "soldout" | "completed";
  bookingUrl?: string;
  isFeatured?: boolean;
}

export interface TicketReservation {
  id: string;
  showId: string;
  showTitle: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  ticketsCount: number;
  reservedAt: string;
  status: "confirmed" | "pending";
}

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  url: string; // Fallback Picsum or specific visual context
  title: string;
  category: "live" | "bts" | "promo" | "quote";
  likes: number;
  comments: number;
  caption: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}
