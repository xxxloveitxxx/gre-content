import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed output: 'export' to support Server Actions and dynamic features on Firebase App Hosting
  
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // ✅ Server-side packages
  serverExternalPackages: [
    '@grpc/grpc-js',
  ],
  
  productionBrowserSourceMaps: true,
};

export default nextConfig;
