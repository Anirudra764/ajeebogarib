import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

// Fallback seeds if local file storage gets wiped
import { SHOW_DETAILS, PERFORMER_BIO, UPCOMING_EVENTS, GALLERY_ITEMS } from "./src/data";

const app = express();
const PORT = 3000;

app.use(express.json());

// Setup a persistent directory inside root for storing JSON files
const STORE_DIR = path.join(process.cwd(), "data_store");
if (!fs.existsSync(STORE_DIR)) {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

// Helpers for reading/writing dynamic models
const getFilePath = (filename: string) => path.join(STORE_DIR, filename);

const readStore = (filename: string, defaultValue: any) => {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading store ${filename}:`, err);
    return defaultValue;
  }
};

const writeStore = (filename: string, content: any) => {
  const filePath = getFilePath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing store ${filename}:`, err);
  }
};

// Seed administrative passcode config (Default: 1935)
const defaultAuth = { passcode: "1935" };

// Initialize stores
let shows = readStore("shows.json", UPCOMING_EVENTS);
let bio = readStore("bio.json", PERFORMER_BIO);
let showDetails = readStore("show_details.json", SHOW_DETAILS);
let gallery = readStore("gallery.json", GALLERY_ITEMS);
let authConfig = readStore("auth.json", defaultAuth);
let bookings = readStore("bookings.json", []);
if (!bookings.some((b: any) => b.id === "TIX-201600")) {
  bookings.push({
    id: "TIX-201600",
    showId: "show-01",
    showTitle: "Ajeeb-O-Gareeb Acoustic Monsoon",
    date: "JUNE 15, 2026",
    name: "Anirudra Paul",
    email: "anirudrapaul764@gmail.com",
    phone: "+91 98765 43210",
    ticketsCount: 2,
    reservedAt: "04/06/2026",
    status: "confirmed",
    uid: "guest"
  });
  writeStore("bookings.json", bookings);
}
let leads = readStore("leads.json", []);
let commentsState = readStore("gallery_comments.json", {
  "gal-01": [
    { id: "c-01", user: "storylover_jamshedpur", text: "The vibe at Cafe Regal was absolutely unreal! Can't wait for the next show.", date: "2 mins ago" },
    { id: "c-02", user: "deepika_sen", text: "When Annesha started singing about her father, literal tears in the whole row.", date: "1 hour ago" }
  ],
  "gal-03": [
    { id: "c-03", user: "caferegal_regular", text: "We love hosting Annesha! She brings absolute soul into this room.", date: "Yesterday" }
  ]
});

// ————————————————————————————————————————————————————
// BACKSTAGE AUTH API ENDPOINTS
// ————————————————————————————————————————————————————

// Validate login
app.post("/api/auth/login", (req, res) => {
  const { passcode } = req.body;
  const currentAuth = readStore("auth.json", defaultAuth);
  
  if (passcode === currentAuth.passcode) {
    res.json({ success: true, token: "ajeeb-token-active" });
  } else {
    res.status(401).json({ success: false, error: "Incorrect passcode. Please try again." });
  }
});

// Change login passcode
app.post("/api/auth/change-passcode", (req, res) => {
  const { currentPasscode, newPasscode } = req.body;
  const currentAuth = readStore("auth.json", defaultAuth);

  if (currentPasscode !== currentAuth.passcode) {
    return res.status(401).json({ success: false, error: "Current passcode is incorrect." });
  }

  if (!newPasscode || newPasscode.trim().length === 0) {
    return res.status(400).json({ success: false, error: "New passcode cannot be empty." });
  }

  const updatedAuth = { passcode: newPasscode.trim() };
  writeStore("auth.json", updatedAuth);
  res.json({ success: true, message: "Passcode updated successfully!" });
});


// ————————————————————————————————————————————————————
// MAIN APP CONTENT API ENDPOINTS
// ————————————————————————————————————————————————————

// Global Settings Metadata (Titles, tagline, subtitles)
app.get("/api/show-details", (req, res) => {
  const data = readStore("show_details.json", SHOW_DETAILS);
  res.json(data);
});

app.put("/api/show-details", (req, res) => {
  const updated = req.body;
  writeStore("show_details.json", updated);
  res.json({ success: true, data: updated });
});


// Performer Biography & Achievements
app.get("/api/bio", (req, res) => {
  const data = readStore("bio.json", PERFORMER_BIO);
  res.json(data);
});

app.put("/api/bio", (req, res) => {
  const updated = req.body;
  writeStore("bio.json", updated);
  res.json({ success: true, data: updated });
});


// Upcoming shows lists
app.get("/api/shows", (req, res) => {
  const data = readStore("shows.json", UPCOMING_EVENTS);
  res.json(data);
});

// Save or Update a show
app.post("/api/shows", (req, res) => {
  const showItem = req.body;
  let currentShows = readStore("shows.json", UPCOMING_EVENTS);

  if (!showItem.id) {
    // Generate new ID
    showItem.id = `show-${Date.now()}`;
    currentShows.push(showItem);
  } else {
    // Update existing ID
    currentShows = currentShows.map((s: any) => s.id === showItem.id ? showItem : s);
  }

  writeStore("shows.json", currentShows);
  res.json({ success: true, data: showItem, allShows: currentShows });
});

// Delete a show
app.delete("/api/shows/:id", (req, res) => {
  const { id } = req.params;
  let currentShows = readStore("shows.json", UPCOMING_EVENTS);
  currentShows = currentShows.filter((s: any) => s.id !== id);
  writeStore("shows.json", currentShows);
  res.json({ success: true, allShows: currentShows });
});


// Media Gallery
app.get("/api/gallery", (req, res) => {
  const data = readStore("gallery.json", GALLERY_ITEMS);
  res.json(data);
});

app.post("/api/gallery", (req, res) => {
  const newItem = req.body;
  let currentGallery = readStore("gallery.json", GALLERY_ITEMS);
  
  if (!newItem.id) {
    newItem.id = `gal-${Date.now()}`;
    newItem.likes = 0;
    newItem.comments = 0;
    currentGallery.unshift(newItem);
  } else {
    currentGallery = currentGallery.map((g: any) => g.id === newItem.id ? newItem : g);
  }
  
  writeStore("gallery.json", currentGallery);
  res.json({ success: true, data: newItem, gallery: currentGallery });
});

app.delete("/api/gallery/:id", (req, res) => {
  const { id } = req.params;
  let currentGallery = readStore("gallery.json", GALLERY_ITEMS);
  currentGallery = currentGallery.filter((g: any) => g.id !== id);
  writeStore("gallery.json", currentGallery);
  res.json({ success: true, gallery: currentGallery });
});


// Gallery Comments
app.get("/api/gallery/comments", (req, res) => {
  const comments = readStore("gallery_comments.json", {});
  res.json(comments);
});

app.post("/api/gallery/comments", (req, res) => {
  const { photoId, user, text } = req.body;
  if (!photoId || !user || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const comments = readStore("gallery_comments.json", {});
  if (!comments[photoId]) {
    comments[photoId] = [];
  }

  const newComment = {
    id: `c-${Date.now()}`,
    user,
    text,
    date: "Just now"
  };

  comments[photoId].push(newComment);
  writeStore("gallery_comments.json", comments);

  // Update comment count on gallery item
  let currentGallery = readStore("gallery.json", GALLERY_ITEMS);
  currentGallery = currentGallery.map((g: any) => {
    if (g.id === photoId) {
      return { ...g, comments: comments[photoId].length };
    }
    return g;
  });
  writeStore("gallery.json", currentGallery);

  res.json({ success: true, comments: comments[photoId], gallery: currentGallery });
});

app.delete("/api/gallery/comments/:photoId/:commentId", (req, res) => {
  const { photoId, commentId } = req.params;
  const comments = readStore("gallery_comments.json", {});
  if (comments[photoId]) {
    comments[photoId] = comments[photoId].filter((c: any) => c.id !== commentId);
    writeStore("gallery_comments.json", comments);

    // Update comment count on gallery item
    let currentGallery = readStore("gallery.json", GALLERY_ITEMS);
    currentGallery = currentGallery.map((g: any) => {
      if (g.id === photoId) {
        return { ...g, comments: comments[photoId].length };
      }
      return g;
    });
    writeStore("gallery.json", currentGallery);
  }
  res.json({ success: true, comments: comments[photoId] || [] });
});


// Ticket Reservations
app.get("/api/bookings", (req, res) => {
  const data = readStore("bookings.json", []);
  res.json(data);
});

app.get("/api/bookings/lookup/:id", (req, res) => {
  const { id } = req.params;
  const data = readStore("bookings.json", []);
  const found = data.find((b: any) => b.id.toLowerCase() === id.trim().toLowerCase());
  if (found) {
    res.json({ success: true, booking: found });
  } else {
    res.status(404).json({ success: false, error: "No reservation found with this Pass ID." });
  }
});

app.post("/api/bookings", (req, res) => {
  const reservation = req.body;
  const data = readStore("bookings.json", []);
  reservation.id = reservation.id || `res-${Date.now()}`;
  reservation.reservedAt = reservation.reservedAt || new Date().toISOString();
  reservation.status = reservation.status || "confirmed";
  data.push(reservation);
  writeStore("bookings.json", data);
  res.json({ success: true, reservation, bookings: data });
});

app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  let data = readStore("bookings.json", []);
  data = data.filter((b: any) => b.id !== id);
  writeStore("bookings.json", data);
  res.json({ success: true, bookings: data });
});


// Contact form leads
app.get("/api/leads", (req, res) => {
  const data = readStore("leads.json", []);
  res.json(data);
});

app.post("/api/leads", (req, res) => {
  const message = req.body;
  const data = readStore("leads.json", []);
  message.id = `lead-${Date.now()}`;
  message.sentAt = new Date().toISOString();
  data.push(message);
  writeStore("leads.json", data);
  res.json({ success: true, message, leads: data });
});

app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  let data = readStore("leads.json", []);
  data = data.filter((l: any) => l.id !== id);
  writeStore("leads.json", data);
  res.json({ success: true, leads: data });
});


// Incremental likes on dynamic images
app.post("/api/gallery/:id/like", (req, res) => {
  const { id } = req.params;
  let currentGallery = readStore("gallery.json", GALLERY_ITEMS);
  currentGallery = currentGallery.map((g: any) => {
    if (g.id === id) {
      return { ...g, likes: g.likes + 1 };
    }
    return g;
  });
  writeStore("gallery.json", currentGallery);
  const updatedItem = currentGallery.find((g: any) => g.id === id);
  res.json({ success: true, item: updatedItem, gallery: currentGallery });
});


// ————————————————————————————————————————————————————
// VITE OR STATIC SERVING MIDDLEWARES
// ————————————————————————————————————————————————————

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Let SPA routing handle all outer requests
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AJEEB BACKEND] Full-stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
