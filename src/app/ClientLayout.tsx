"use client";

import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark component as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize Firebase Analytics only after hydration + with cleanup
  useEffect(() => {
    if (!isHydrated) return;
    
    let cancelled = false;
    
    const loadAnalytics = async () => {
      try {
        // Lazy-load Firebase to avoid bundling issues with static export
        const { initAnalytics } = await import('@/lib/firebase');
        if (!cancelled) {
          await initAnalytics();
        }
      } catch (error) {
        // Silently fail to avoid breaking the app
        console.warn('Firebase Analytics load failed:', error);
      }
    };
    
    loadAnalytics();
    
    // Cleanup: prevent state updates on unmounted component
    return () => {
      cancelled = true;
    };
  }, [isHydrated]);

  return <>{children}</>;
}
