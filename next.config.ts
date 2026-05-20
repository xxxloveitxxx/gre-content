import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Required for static export to Firebase Hosting
  output: 'export',
  
  // ✅ Your basePath for /gre-content routing
  basePath: '/gre-content',
  
  // ✅ CRITICAL: 'images' must be at ROOT level, NOT inside experimental
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  
  // ✅ Skip type/lint errors during CI build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ CRITICAL: Exclude server-only packages from static bundle
  // This prevents @grpc/grpc-js, @opentelemetry, genkit from breaking the build
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/*',
    '@genkit-ai/*',
    'genkit',
  ],
  
  // ✅ Webpack fallbacks for Node.js built-ins (extra safety)
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js built-ins that don't exist in browser
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        http2: false,
        dns: false,
        child_process: false,
        async_hooks: false,
        dgram: false,
        process: false,
        buffer: false,
        events: false,
        util: false,
        perf_hooks: false,
        canvas: false,
        assert: false,
        querystring: false,
        url: false,
      };

      // Strip 'node:' prefix from imports
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
          resource.request = resource.request.replace(/^node:/, '');
        })
      );
    }
    return config;
  },
};

export default nextConfig;
