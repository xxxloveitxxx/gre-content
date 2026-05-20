import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Required for static export to Firebase Hosting
  output: 'export',
  
  // ✅ Keep your basePath (deploying to yourdomain.com/gre-content)
  basePath: '/gre-content',
  
  // ✅ Image optimization settings for static export
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
  
  // ✅ Skip type/lint errors during build (optional but helpful for CI)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ Exclude server-only packages from static bundle (Next.js 15+)
  // This prevents gRPC/OpenTelemetry/Genkit from breaking the build
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/*',
    '@genkit-ai/*',
    'genkit',
  ],
  
  // ✅ Webpack fallbacks for Node.js built-ins (extra safety for browser build)
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Fallback Node.js modules to empty/false for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
        // Keep these for compatibility
        assert: false,
        querystring: false,
        url: false,
      };

      // Strip 'node:' prefix from imports (helps with some packages)
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
