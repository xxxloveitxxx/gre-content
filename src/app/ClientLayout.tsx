"use client";

// ✅ Minimal layout - no imports that could trigger server code
export default function ClientLayout({ 
  children 
}: { 
  children: React.ReactNode; 
}) {
  return <>{children}</>;
}
