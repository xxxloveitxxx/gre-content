import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAd-lCSweDVepOlWm2_pjJ-ZrikhfBwuxo",
  authDomain: "content-gre.firebaseapp.com",
  projectId: "content-gre",
  storageBucket: "content-gre.firebasestorage.app",
  messagingSenderId: "685726780436",
  appId: "1:685726780436:web:76c734694e0bf2b97c6b01",
  measurementId: "G-F7NTMB65GV"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics conditionally (it only works in the browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app };
