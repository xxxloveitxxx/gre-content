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
  
  productionBrowserSourceMaps: true,
  
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // ✅ Only disable Node.js built-ins that truly don't exist in browser
      // ✅ Remove entries that webpack can handle natively or Firebase needs
      config.resolve.fallback = {
        ...config.resolve.fallback,
        
        // ❌ Disable these (not available in browser, not needed by Firebase)
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
        
        // ✅ REMOVE these entries entirely (let webpack/browser handle them):
        // crypto, buffer, stream, events, util, url, process, timers, string_decoder
        // Deleting them prevents webpack validation errors AND lets Firebase work
      };

      // Remove any undefined/null fallbacks that might have been set
      const fallback = config.resolve.fallback;
      if (fallback) {
        Object.keys(fallback).forEach(key => {
          if (fallback[key] === undefined || fallback[key] === null) {
            delete fallback[key];
          }
        });
      }

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
