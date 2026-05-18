"use client";

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
