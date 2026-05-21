import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  
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
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/*',
    '@genkit-ai/*',
    'genkit',
  ],
  
  // Enable source maps to debug production errors
  productionBrowserSourceMaps: true,
  
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // ✅ Keep these disabled (not available in browser)
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
        http2: false,
        dns: false,
        child_process: false,
        async_hooks: false,
        dgram: false,
        perf_hooks: false,
        canvas: false,
        assert: false,
        querystring: false,
        
        // 🔥 CRITICAL FIX FOR FIREBASE V11 + REACT 19:
        // Let webpack use browser-native implementations instead of forcing `false`
        // Setting these to `false` breaks Firebase's internal module resolution
        crypto: undefined,
        buffer: undefined,
        stream: undefined,
        events: undefined,
        util: undefined,
        url: undefined,
        process: undefined,
        timers: undefined,
        string_decoder: undefined,
      };

      // Strip 'node:' prefix from imports for better compatibility
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
