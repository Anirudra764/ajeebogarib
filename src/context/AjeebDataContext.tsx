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
  writeBatch
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

  // Auto seeding when administrator logs in
  const checkAndSeedDatabase = async (adminUid: string) => {
    try {
      console.log("[Firebase Seed] Admin logged in. Verifying database seeds.");
      
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
      setCurrentUser(user);
      setAuthLoading(false);

      if (user && user.email === "anirudrapaul31@gmail.com") {
        // Enforce admins lookup path so that isAdmin() rule returns true instantly
        try {
          await setDoc(doc(db, "admins", user.uid), {
            uid: user.uid,
            email: user.email,
            assignedAt: new Date().toISOString()
          }, { merge: true });
        } catch (adminSetErr) {
          console.warn("[Admins write warning]", adminSetErr);
        }
        // Run auto-seeder to ensure collections exist matching full-stack schemas
        await checkAndSeedDatabase(user.uid);
      }
    });
    return () => unsubscribe();
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

    // 6. Bookings ticket snapshot (Admin watches all, viewer watches private or fallbacks)
    const unsubBookings = onSnapshot(collection(db, "bookings"), (snap) => {
      const items: TicketReservation[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as TicketReservation);
      });
      setBookings(items);
    }, (err) => {
      console.warn("Bookings real-time list unavailable:", err);
    });

    // 7. Leads snapshot
    const unsubLeads = onSnapshot(collection(db, "leads"), (snap) => {
      const items: ContactMessage[] = [];
      snap.forEach((docSnap) => {
        items.push(docSnap.data() as ContactMessage);
      });
      setLeads(items);
    }, (err) => {
      console.warn("Leads list unavailable:", err);
    });

    return () => {
      unsubShowDetails();
      unsubBio();
      unsubShows();
      unsubGallery();
      unsubComments();
      unsubBookings();
      unsubLeads();
    };
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    try {
      const isSpecAdmin = email === "anirudrapaul31@gmail.com";
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role: isSpecAdmin ? "admin" : "viewer",
        registeredAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Firestore user profile save error: ", err);
    }
    return cred.user;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return cred.user;
    } catch (err: any) {
      // In case admin hasn't signed up yet, automatically register them!
      if (email === "anirudrapaul31@gmail.com" && pass === "987654") {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/cannot-find-user") {
          console.log("[Authenticating Admin] Auto-registering admin account.");
          return await signUpWithEmail(email, pass, "Super Admin");
        }
      }
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      try {
        const isSpecAdmin = cred.user.email === "anirudrapaul31@gmail.com";
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          name: cred.user.displayName || "Spectator Guest",
          email: cred.user.email || "",
          role: isSpecAdmin ? "admin" : "viewer",
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

  const refreshAll = async () => {
    // Relying on automatic onSnapshot sync above!
  };

  const updateShowDetails = async (newDetails: typeof SHOW_DETAILS) => {
    const path = "settings/show_details";
    try {
      await setDoc(doc(db, "settings", "show_details"), {
        id: "show_details",
        data: newDetails
      });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const updatePerformerBio = async (newBio: typeof PERFORMER_BIO) => {
    const path = "settings/performer_bio";
    try {
      await setDoc(doc(db, "settings", "performer_bio"), {
        id: "performer_bio",
        data: newBio
      });
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const saveShow = async (show: PerformanceShow) => {
    const path = `shows/${show.id}`;
    try {
      await setDoc(doc(db, "shows", show.id), show);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const deleteShow = async (id: string) => {
    const path = `shows/${id}`;
    try {
      await deleteDoc(doc(db, "shows", id));
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
    return false;
  };

  const saveGalleryItem = async (item: Partial<GalleryItem>) => {
    if (!item.id) {
      item.id = `gal-${Date.now()}`;
      item.likes = 0;
      item.comments = 0;
    }
    const path = `gallery/${item.id}`;
    try {
      await setDoc(doc(db, "gallery", item.id), item);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const deleteGalleryItem = async (id: string) => {
    const path = `gallery/${id}`;
    try {
      await deleteDoc(doc(db, "gallery", id));
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
    return false;
  };

  const likeGalleryItem = async (id: string) => {
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
      await setDoc(doc(db, "gallery_comments", commentId), commentData);
      
      // Update comment count on gallery item
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

  const deleteComment = async (photoId: string, commentId: string) => {
    const path = `gallery_comments/${commentId}`;
    try {
      await deleteDoc(doc(db, "gallery_comments", commentId));

      // Decrement comment count on gallery item
      const item = gallery.find(g => g.id === photoId);
      if (item) {
        const itemCommentsCount = Math.max(0, (comments[photoId]?.length || 1) - 1);
        await setDoc(doc(db, "gallery", photoId), {
          ...item,
          comments: itemCommentsCount
        });
      }
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
    return false;
  };

  const submitReservation = async (res: Omit<TicketReservation, "id" | "reservedAt">) => {
    const reservationId = `res-${Date.now()}`;
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
      reservedAt: new Date().toLocaleDateString("en-IN")
    };
    const path = `bookings/${reservationId}`;
    try {
      await setDoc(doc(db, "bookings", reservationId), bookingData);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const cancelReservation = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await deleteDoc(doc(db, "bookings", id));
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
      await setDoc(doc(db, "leads", leadId), contactData);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
    return false;
  };

  const deleteLead = async (id: string) => {
    const path = `leads/${id}`;
    try {
      await deleteDoc(doc(db, "leads", id));
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
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
