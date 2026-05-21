import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAd-lCSweDVepOlWm2_pjJ-ZrikhfBwuxo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "content-gre.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "content-gre",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "content-gre.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "685726780436",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:685726780436:web:76c734694e0bf2b97c6b01",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F7NTMB65GV"
};

// Safe Firebase app initialization (works in SSR + static export)
let app: FirebaseApp;
if (typeof window !== "undefined") {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} else {
  // SSR fallback: create minimal app object to avoid undefined references
  app = initializeApp(firebaseConfig, "ssr-instance");
}

let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

/**
 * Initialize Firebase Analytics safely for static exports + React 19
 * - Prevents duplicate initialization
 * - Guards against prototype access errors
 * - Defers to browser environment only
 */
export const initAnalytics = async (): Promise<Analytics | null> => {
  // Guard 1: Must be in browser
  if (typeof window === "undefined") {
    return null;
  }
  
  // Guard 2: Return cached instance if already initialized
  if (analyticsInstance) {
    return analyticsInstance;
  }
  
  // Guard 3: Prevent concurrent initialization attempts
  if (analyticsInitPromise) {
    return analyticsInitPromise;
  }
  
  // Guard 4: Wait for next microtask to ensure hydration is complete
  await Promise.resolve();
  
  analyticsInitPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.debug("Firebase Analytics not supported in this environment");
        return null;
      }
      
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    } catch (error) {
      // Catch "Cannot read properties of undefined (reading 'prototype')" and similar
      console.warn("Firebase Analytics initialization failed:", error);
      analyticsInitPromise = null; // Reset to allow retry
      return null;
    }
  })();
  
  return analyticsInitPromise;
};

export { app };
export const getFirebaseApp = () => app;
