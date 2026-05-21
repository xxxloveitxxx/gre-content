"use client";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Remove all analytics init code for now
  return <>{children}</>;
}
