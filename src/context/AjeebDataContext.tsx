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
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  getDoc,
  writeBatch,
  where
} from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AjeebContextType {
  showDetails: typeof SHOW_DETAILS;
  performerBio: typeof PERFORMER_BIO;
  shows: PerformanceShow[];
  gallery: GalleryItem[];
  bookings: TicketReservation[];
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

  likeGalleryItem: (id: string) => Promise<void>;
  
  // Interactive handlers
  addComment: (photoId: string, user: string, text: string) => Promise<boolean>;
  submitReservation: (res: Omit<TicketReservation, "id" | "reservedAt">) => Promise<boolean>;
  cancelReservation: (id: string) => Promise<boolean>;
  submitLead: (lead: Omit<ContactMessage, "sentAt">) => Promise<boolean>;
}

const AjeebDataContext = createContext<AjeebContextType | undefined>(undefined);

export const AjeebDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showDetails, setShowDetails] = useState<typeof SHOW_DETAILS>(SHOW_DETAILS);
  const [performerBio, setPerformerBio] = useState<typeof PERFORMER_BIO>(PERFORMER_BIO);
  const [shows, setShows] = useState<PerformanceShow[]>(UPCOMING_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [bookings, setBookings] = useState<TicketReservation[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Auto seeding when user/spectator logs in or database is empty
  const checkAndSeedDatabase = async (uid: string) => {
    try {
      console.log("[Firebase Seed] Verifying database seeds.");
      
      // 1. Seed Show Details
      const showDetailsDoc = await getDoc(doc(db, "settings", "show_details"));
      if (!showDetailsDoc.exists()) {
        await setDoc(doc(db, "settings", "show_details"), {
          id: "show_details",
          data: SHOW_DETAILS
        });
        console.log("[Firebase Seed] Seeded show_details");
      }

      // 2. Seed Performer Bio
      const bioDoc = await getDoc(doc(db, "settings", "performer_bio"));
      if (!bioDoc.exists()) {
        await setDoc(doc(db, "settings", "performer_bio"), {
          id: "performer_bio",
          data: PERFORMER_BIO
        });
        console.log("[Firebase Seed] Seeded performer_bio");
      }

      // 3. Seed Shows
      const showsSnap = await getDocs(collection(db, "shows"));
      if (showsSnap.empty) {
        for (const show of UPCOMING_EVENTS) {
          await setDoc(doc(db, "shows", show.id), show);
        }
        console.log("[Firebase Seed] Seeded upcoming events shows list");
      }

      // 4. Seed Gallery
      const gallerySnap = await getDocs(collection(db, "gallery"));
      if (gallerySnap.empty) {
        for (const item of GALLERY_ITEMS) {
          await setDoc(doc(db, "gallery", item.id), item);
        }
        console.log("[Firebase Seed] Seeded gallery items list");
      }

      // 5. Seed Starter Comments
      const commentsSnap = await getDocs(collection(db, "gallery_comments"));
      if (commentsSnap.empty) {
        const initialComments = [
          { id: "c-01", photoId: "gal-01", user: "storylover_jamshedpur", text: "The vibe at Cafe Regal was absolutely unreal! Can't wait for the next show.", date: "2 mins ago" },
          { id: "c-02", photoId: "gal-01", user: "deepika_sen", text: "When Annesha started singing about her father, literal tears in the whole row.", date: "1 hour ago" },
          { id: "c-03", photoId: "gal-03", user: "caferegal_regular", text: "We love hosting Annesha! She brings absolute soul into this room.", date: "Yesterday" }
        ];
        for (const comm of initialComments) {
          await setDoc(doc(db, "gallery_comments", comm.id), comm);
        }
        console.log("[Firebase Seed] Seeded starter gallery comments list");
      }

      console.log("[Firebase Seed] All dynamic database references successfully initialized!");
    } catch (err) {
      console.warn("[Firebase Seed Error] Failed to complete dynamic syncing:", err);
    }
  };

  // Monitor auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && (window as any).isRegistering) {
        await firebaseSignOut(auth);
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Run auto-seeder to ensure collections exist matching full-stack schemas
        await checkAndSeedDatabase(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial master parameters from Full-stack Express APIs on startup
  const fetchBackendData = async () => {
    try {
      // 1. Fetch show-details
      const resDetails = await fetch("/api/show-details");
      if (resDetails.ok) {
        const dataDetails = await resDetails.json();
        setShowDetails(dataDetails);
      }
      
      // 2. Fetch bio
      const resBio = await fetch("/api/bio");
      if (resBio.ok) {
        const dataBio = await resBio.json();
        setPerformerBio(dataBio);
      }
      
      // 3. Fetch shows
      const resShows = await fetch("/api/shows");
      if (resShows.ok) {
        const dataShows = await resShows.json();
        if (Array.isArray(dataShows)) {
          dataShows.sort((a, b) => a.date.localeCompare(b.date));
          setShows(dataShows);
        }
      }
      
      // 4. Fetch gallery
      const resGallery = await fetch("/api/gallery");
      if (resGallery.ok) {
        const dataGallery = await resGallery.json();
        if (Array.isArray(dataGallery)) {
          setGallery(dataGallery);
        }
      }
      
      // 5. Fetch comments
      const resComments = await fetch("/api/gallery/comments");
      if (resComments.ok) {
        const dataComments = await resComments.json();
        setComments(dataComments);
      }
    } catch (error) {
      console.warn("Backend API fetching error. Running side-by-side with Firebase: ", error);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Set up live Firestore synchronization listeners
  useEffect(() => {
    // 1. Show Details listener
    const unsubShowDetails = onSnapshot(doc(db, "settings", "show_details"), (snap) => {
      if (snap.exists()) {
        setShowDetails(snap.data().data);
      }
    }, (err) => {
      console.warn("Using offline fallback file for show details:", err);
    });

    // 2. Performer Bio listener
    const unsubBio = onSnapshot(doc(db, "settings", "performer_bio"), (snap) => {
      if (snap.exists()) {
        setPerformerBio(snap.data().data);
      }
    }, (err) => {
      console.warn("Using offline fallback file for bio:", err);
    });

    // 3. Shows list listener
    const unsubShows = onSnapshot(collection(db, "shows"), (snap) => {
      if (!snap.empty) {
        const loadedShows: PerformanceShow[] = [];
        snap.forEach((docSnap) => {
          loadedShows.push(docSnap.data() as PerformanceShow);
        });
        // Sort by date YYYY-MM-DD
        loadedShows.sort((a, b) => a.date.localeCompare(b.date));
        setShows(loadedShows);
      }
    }, (err) => {
      console.warn("Using offline fallback for shows catalog:", err);
    });

    // 4. Media Gallery list listener
    const unsubGallery = onSnapshot(collection(db, "gallery"), (snap) => {
      if (!snap.empty) {
        const loadedGallery: GalleryItem[] = [];
        snap.forEach((docSnap) => {
          loadedGallery.push(docSnap.data() as GalleryItem);
        });
        setGallery(loadedGallery);
      }
    }, (err) => {
      console.warn("Using offline fallback for gallery catalog:", err);
    });

    // 5. Gallery Comments listener
    const unsubComments = onSnapshot(collection(db, "gallery_comments"), (snap) => {
      const grouped: Record<string, any[]> = {};
      snap.forEach((docSnap) => {
        const comm = docSnap.data();
        if (!grouped[comm.photoId]) {
          grouped[comm.photoId] = [];
        }
        grouped[comm.photoId].push(comm);
      });
      setComments(grouped);
      setLoading(false);
    }, (err) => {
      console.warn("Comments snapshot offline:", err);
      setLoading(false);
    });

    return () => {
      unsubShowDetails();
      unsubBio();
      unsubShows();
      unsubGallery();
      unsubComments();
    };
  }, []);

  // Dynamic database listeners for user-specific data and offline guest fallback
  useEffect(() => {
    let unsubBookings = () => {};

    if (currentUser) {
      // 1. Live bookings: spectators only stream their private subset
      const bookingsRef = collection(db, "bookings");
      const bookingsQuery = query(bookingsRef, where("uid", "==", currentUser.uid));

      unsubBookings = onSnapshot(bookingsQuery, (snap) => {
        const items: TicketReservation[] = [];
        snap.forEach((docSnap) => {
          items.push(docSnap.data() as TicketReservation);
        });
        setBookings(items);
      }, (err) => {
        console.warn("User bookings list snap error:", err);
      });
    } else {
      // Unsigned Guest: Retrieve cached local bookings
      const localStr = localStorage.getItem("ajeeb_bookings");
      if (localStr) {
        try {
          const list = JSON.parse(localStr);
          setBookings(Array.isArray(list) ? list : []);
        } catch (e) {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    }

    return () => {
      unsubBookings();
    };
  }, [currentUser]);

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      (window as any).isRegistering = true;
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      await cred.user.reload();
      const updatedUser = auth.currentUser;
      
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
      
      // Force sign-out right after creation so the user must log in manually to continue as requested
      await firebaseSignOut(auth);
      (window as any).isRegistering = false;
      setCurrentUser(null);
      
      return updatedUser || cred.user;
    } catch (err: any) {
      (window as any).isRegistering = false;
      if (err.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. If you already have an account, please switch to 'Sign In' or use 'Continue with Google Account'.");
      }
      if (err.code === "auth/weak-password") {
        throw new Error("Password is too weak. Please enter at least 6 characters.");
      }
      if (err.code === "auth/invalid-email") {
        throw new Error("The email address is badly formatted. Please enter a valid email address.");
      }
      throw new Error(err.message || "An unexpected registration error occurred.");
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return cred.user;
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        throw new Error("Invalid email or password. If you signed up via Google, please click 'Continue with Google Account'.");
      }
      if (err.code === "auth/invalid-email") {
        throw new Error("The email address is badly formatted. Please enter a valid email address.");
      }
      throw new Error(err.message || "An unexpected sign-in error occurred.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
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
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        throw new Error(
          `Google link was closed or blocked. Since this application runs in a secure sandbox frame, browser popup blockers might reject Google's window. Please enable popups, open this app in a new tab, or use the secure Email & Password form below.`
        );
      }
      throw err;
    }
  };

  const signOutUser = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setBookings([]);
    // Clear previous loaded user caches to prevent leakage of credentials or data across accounts
    localStorage.removeItem("ajeeb_bookings");
    sessionStorage.clear();
    console.log("Cleared all previously loaded user data successfully on sign out.");
  };

  const refreshAll = async () => {
    await fetchBackendData();
  };

  const likeGalleryItem = async (id: string) => {
    // 1. Call Full-Stack Backend API
    try {
      await fetch(`/api/gallery/${id}/like`, { method: "POST" });
    } catch (err) {
      console.warn("Backend dynamic like failed: ", err);
    }

    // 2. Hydrate/update Firebase Firestore real-time engine
    const path = `gallery/${id}`;
    try {
      const match = gallery.find(g => g.id === id);
      if (match) {
        await setDoc(doc(db, "gallery", id), {
          ...match,
          likes: match.likes + 1
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  };

  const addComment = async (photoId: string, user: string, text: string) => {
    const commentId = `c-${Date.now()}`;
    const commentData = {
      id: commentId,
      photoId,
      user,
      text,
      date: new Date().toLocaleDateString("en-IN")
    };
    const path = `gallery_comments/${commentId}`;
    try {
      // 1. Store in Full-Stack Backend API
      try {
        await fetch("/api/gallery/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoId, user, text })
        });
      } catch (err) {
        console.warn("Backend post comment failed: ", err);
      }

      // 2. Hydrate/update Firebase Firestore database
      await setDoc(doc(db, "gallery_comments", commentId), commentData);
      
      const item = gallery.find(g => g.id === photoId);
      if (item) {
        const itemCommentsCount = (comments[photoId]?.length || 0) + 1;
        await setDoc(doc(db, "gallery", photoId), {
          ...item,
          comments: itemCommentsCount
        });
      }
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const submitReservation = async (res: Omit<TicketReservation, "id" | "reservedAt">) => {
    const reservationId = `res-${Date.now()}`;
    const userUid = currentUser ? currentUser.uid : "guest";
    const bookingData: TicketReservation = {
      id: reservationId,
      showId: res.showId,
      showTitle: res.showTitle,
      date: res.date,
      name: res.name,
      email: res.email,
      phone: res.phone,
      ticketsCount: res.ticketsCount,
      status: "confirmed",
      reservedAt: new Date().toLocaleDateString("en-IN"),
      uid: userUid
    };
    const path = `bookings/${reservationId}`;
    try {
      // 1. Send to Full-Stack Backend API
      try {
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });
      } catch (err) {
        console.warn("Backend submit booking failed: ", err);
      }

      // 2. Hydrate/update Firebase Firestore database
      await setDoc(doc(db, "bookings", reservationId), bookingData);

      // Save to local storage for local offline redundancy
      const localStr = localStorage.getItem("ajeeb_bookings") || "[]";
      let localList = [];
      try {
        localList = JSON.parse(localStr);
        if (!Array.isArray(localList)) localList = [];
      } catch (err) {
        localList = [];
      }
      localList.push(bookingData);
      localStorage.setItem("ajeeb_bookings", JSON.stringify(localList));

      if (!currentUser) {
        setBookings(prev => [...prev, bookingData]);
      }
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const cancelReservation = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      // 1. Delete from Full-Stack Backend API
      try {
        await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Backend cancel booking failed: ", err);
      }

      // 2. Hydrate/delete from Firebase Firestore database
      await deleteDoc(doc(db, "bookings", id));

      // Remove from browser storage cache
      const localStr = localStorage.getItem("ajeeb_bookings") || "[]";
      let localList = [];
      try {
        localList = JSON.parse(localStr);
        if (!Array.isArray(localList)) localList = [];
      } catch (err) {
        localList = [];
      }
      localList = localList.filter((b: any) => b.id !== id);
      localStorage.setItem("ajeeb_bookings", JSON.stringify(localList));

      if (!currentUser) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
    return false;
  };

  const submitLead = async (lead: Omit<ContactMessage, "sentAt">) => {
    const leadId = `lead-${Date.now()}`;
    const contactData: ContactMessage & { id: string } = {
      id: leadId,
      name: lead.name,
      email: lead.email,
      subject: lead.subject,
      message: lead.message,
      sentAt: new Date().toISOString()
    };
    const path = `leads/${leadId}`;
    try {
      // 1. Send to Full-Stack Backend API
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData)
        });
      } catch (err) {
        console.warn("Backend submit lead failed: ", err);
      }

      // 2. Hydrate/update Firebase Firestore database
      await setDoc(doc(db, "leads", leadId), contactData);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
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
        comments,
        loading,
        refreshAll,
        currentUser,
        authLoading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOutUser,
        likeGalleryItem,
        addComment,
        submitReservation,
        cancelReservation,
        submitLead
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
