"use client";

import { useEffect } from 'react';

export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode; 
}) {
  useEffect(() => {
    // Lazy-load analytics after a delay to avoid hydration conflicts
    const timer = setTimeout(() => {
      import('@/lib/firebase')
        .then(({ initAnalytics }) => initAnalytics())
        .catch(() => {}); // Fail silently
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
