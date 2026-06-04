import React, { createContext, useContext, useState, useEffect } from "react";
import { SHOW_DETAILS, PERFORMER_BIO, UPCOMING_EVENTS, GALLERY_ITEMS } from "../data";
import { PerformanceShow, GalleryItem, TicketReservation, ContactMessage } from "../types";
import { auth, db } from "../firebase";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

interface AjeebContextType {
  showDetails: typeof SHOW_DETAILS;
  performerBio: typeof PERFORMER_BIO;
  shows: PerformanceShow[];
  gallery: GalleryItem[];
  bookings: TicketReservation[];
  leads: ContactMessage[];
  comments: Record<string, any[]>;
  loading: boolean;
  refreshAll: () => Promise<void>;
  
  // Auth Controls
  currentUser: User | null;
  authLoading: boolean;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOutUser: () => Promise<void>;

  // Update handlers
  updateShowDetails: (newDetails: typeof SHOW_DETAILS) => Promise<boolean>;
  updatePerformerBio: (newBio: typeof PERFORMER_BIO) => Promise<boolean>;
  saveShow: (show: PerformanceShow) => Promise<boolean>;
  deleteShow: (id: string) => Promise<boolean>;
  saveGalleryItem: (item: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  likeGalleryItem: (id: string) => Promise<void>;
  
  // Interactive handlers
  addComment: (photoId: string, user: string, text: string) => Promise<boolean>;
  deleteComment: (photoId: string, commentId: string) => Promise<boolean>;
  submitReservation: (res: Omit<TicketReservation, "id" | "reservedAt">) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<boolean>;
  submitLead: (lead: Omit<ContactMessage, "sentAt">) => Promise<boolean>;
  deleteLead: (id: string) => Promise<boolean>;
}

const AjeebDataContext = createContext<AjeebContextType | undefined>(undefined);

export const AjeebDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showDetails, setShowDetails] = useState<typeof SHOW_DETAILS>(SHOW_DETAILS);
  const [performerBio, setPerformerBio] = useState<typeof PERFORMER_BIO>(PERFORMER_BIO);
  const [shows, setShows] = useState<PerformanceShow[]>(UPCOMING_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [bookings, setBookings] = useState<TicketReservation[]>([]);
  const [leads, setLeads] = useState<ContactMessage[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Monitor auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    // Write user info to Firestore
    try {
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role: "viewer",
        registeredAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Firestore user profile save error: ", err);
    }
    return cred.user;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // Write user profile info to Firestore if first time
      try {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          name: cred.user.displayName || "Spectator Guest",
          email: cred.user.email || "",
          role: "viewer",
          registeredAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore user profile merge error: ", err);
      }
      return cred.user;
    } catch (err: any) {
      if (err?.code === "auth/unauthorized-domain") {
        throw new Error(
          `Unauthorized Domain: Please add "${window.location.hostname}" and the preview domains to your Firebase Authentication Settings -> Authorized Domains.`
        );
      }
      throw err;
    }
  };

  const signOutUser = async () => {
    await firebaseSignOut(auth);
  };

  const fetchShowDetails = async () => {
    try {
      const res = await fetch("/api/show-details");
      if (res.ok) {
        const data = await res.json();
        setShowDetails(data);
      }
    } catch (e) {
      console.warn("Express backend offline, utilizing SHOW_DETAILS fallback.");
    }
  };

  const fetchBio = async () => {
    try {
      const res = await fetch("/api/bio");
      if (res.ok) {
        const data = await res.json();
        setPerformerBio(data);
      }
    } catch (e) {
      console.warn("Express backend offline, utilizing PERFORMER_BIO fallback.");
    }
  };

  const fetchShows = async () => {
    try {
      const res = await fetch("/api/shows");
      if (res.ok) {
        const data = await res.json();
        setShows(data);
      }
    } catch (e) {
      console.warn("Express backend offline, utilizing UPCOMING_EVENTS fallback.");
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
      }
    } catch (e) {
      console.warn("Express backend offline, utilizing GALLERY_ITEMS fallback.");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/gallery/comments");
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.warn("Express backend offline, using localStorage or mock gallery comments.");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.warn("Could not retrieve dynamic reservations.");
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.warn("Could not retrieve contact outreach leads.");
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchShowDetails(),
      fetchBio(),
      fetchShows(),
      fetchGallery(),
      fetchComments(),
      fetchBookings(),
      fetchLeads()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const updateShowDetails = async (newDetails: typeof SHOW_DETAILS) => {
    try {
      const res = await fetch("/api/show-details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDetails)
      });
      if (res.ok) {
        const result = await res.json();
        setShowDetails(result.data);
        return true;
      }
    } catch (e) {
      console.error("Failed to post showDetails changes on backend.", e);
    }
    return false;
  };

  const updatePerformerBio = async (newBio: typeof PERFORMER_BIO) => {
    try {
      const res = await fetch("/api/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBio)
      });
      if (res.ok) {
        const result = await res.json();
        setPerformerBio(result.data);
        return true;
      }
    } catch (e) {
      console.error("Failed to post bio changes on backend.", e);
    }
    return false;
  };

  const saveShow = async (show: PerformanceShow) => {
    try {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(show)
      });
      if (res.ok) {
        const result = await res.json();
        setShows(result.allShows);
        return true;
      }
    } catch (e) {
      console.error("Error setting show state on backend.", e);
    }
    return false;
  };

  const deleteShow = async (id: string) => {
    try {
      const res = await fetch(`/api/shows/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const result = await res.json();
        setShows(result.allShows);
        return true;
      }
    } catch (e) {
      console.error("Error removing show from backend.", e);
    }
    return false;
  };

  const saveGalleryItem = async (item: Partial<GalleryItem>) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const result = await res.json();
        setGallery(result.gallery);
        return true;
      }
    } catch (e) {
      console.error("Failed to post gallery modifications.", e);
    }
    return false;
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const result = await res.json();
        setGallery(result.gallery);
        return true;
      }
    } catch (e) {
      console.error("Failed to delete gallery item from server.", e);
    }
    return false;
  };

  const likeGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}/like`, {
        method: "POST"
      });
      if (res.ok) {
        const result = await res.json();
        setGallery(result.gallery);
      }
    } catch (e) {
      console.error("Failed to register like on server.", e);
    }
  };

  const addComment = async (photoId: string, user: string, text: string) => {
    try {
      const res = await fetch("/api/gallery/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, user, text })
      });
      if (res.ok) {
        const result = await res.json();
        setComments(prev => ({
          ...prev,
          [photoId]: result.comments
        }));
        setGallery(result.gallery);
        return true;
      }
    } catch (e) {
      console.error("Could not upload comment dynamically.", e);
    }
    return false;
  };

  const deleteComment = async (photoId: string, commentId: string) => {
    try {
      const res = await fetch(`/api/gallery/comments/${photoId}/${commentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const result = await res.json();
        setComments(prev => ({
          ...prev,
          [photoId]: result.comments
        }));
        await fetchGallery(); // Reload gallery counts
        return true;
      }
    } catch (e) {
      console.error("Failed to drop comment.", e);
    }
    return false;
  };

  const submitReservation = async (res: Omit<TicketReservation, "id" | "reservedAt">) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res)
      });
      if (response.ok) {
        const result = await response.json();
        setBookings(result.bookings);

        // Also write to Firestore for user data cloud persistence
        if (auth.currentUser) {
          const bookingId = result.reservation?.id || `res-${Date.now()}`;
          await setDoc(doc(db, "bookings", bookingId), {
            id: bookingId,
            showId: res.showId,
            showTitle: res.showTitle,
            date: res.date,
            name: res.name,
            email: res.email,
            phone: res.phone,
            ticketsCount: res.ticketsCount,
            status: "confirmed",
            reservedAt: new Date().toLocaleDateString("en-IN"),
            uid: auth.currentUser.uid
          });
        }
        return true;
      }
    } catch (e) {
      console.error("Reservation failed to transmit.", e);
    }
    return false;
  };

  const cancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        const result = await response.json();
        setBookings(result.bookings);

        // Delete from Firestore
        try {
          await deleteDoc(doc(db, "bookings", id));
        } catch (err) {}
        return true;
      }
    } catch (e) {
      console.error("Cancellation transmission failed.", e);
    }
    return false;
  };

  const submitLead = async (lead: Omit<ContactMessage, "sentAt">) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      if (response.ok) {
        const result = await response.json();
        setLeads(result.leads);
        return true;
      }
    } catch (e) {
      console.error("Outreach fail to register.", e);
    }
    return false;
  };

  const deleteLead = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        const result = await response.json();
        setLeads(result.leads);
        return true;
      }
    } catch (e) {
      console.error("Contact outreach delivery deletion failed.", e);
    }
    return false;
  };

  return (
    <AjeebDataContext.Provider
      value={{
        showDetails,
        performerBio,
        shows,
        gallery,
        bookings,
        leads,
        comments,
        loading,
        refreshAll,
        currentUser,
        authLoading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOutUser,
        updateShowDetails,
        updatePerformerBio,
        saveShow,
        deleteShow,
        saveGalleryItem,
        deleteGalleryItem,
        likeGalleryItem,
        addComment,
        deleteComment,
        submitReservation,
        cancelReservation,
        submitLead,
        deleteLead
      }}
    >
      {children}
    </AjeebDataContext.Provider>
  );
};

export const useAjeebData = () => {
  const context = useContext(AjeebDataContext);
  if (!context) {
    throw new Error("useAjeebData must be used within an AjeebDataProvider");
  }
  return context;
};
