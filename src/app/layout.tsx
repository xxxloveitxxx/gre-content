import type {Metadata} from 'next';
import 'app/globals.css';
import { Toaster } from "@/components/ui/toaster"
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Replyze AI | Real Estate Agent Content Powerhouse',
  description: 'Automated social media and lead nurturing for real estate agents at replyzeai.com.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
