import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAd-lCSweDVepOlWm2_pjJ-ZrikhfBwuxo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "content-gre.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "content-gre",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "content-gre.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "685726780436",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:685726780436:web:76c734694e0bf2b97c6b01",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F7NTMB65GV"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export { app };

// ✅ Ultra-safe analytics init: fully lazy + error-isolated
export const initAnalytics = async () => {
  if (typeof window === "undefined") return null;
  
  try {
    // Dynamic import avoids bundling Firebase Analytics if not needed
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    
    // Small delay ensures React hydration is complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    // Never let analytics errors crash the app
    console.warn("Firebase Analytics skipped:", error);
    return null;
  }
};
