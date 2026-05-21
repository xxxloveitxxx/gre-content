import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  
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
  
  // ✅ CRITICAL: These packages MUST NOT be in client bundle for static export
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/*',
    '@genkit-ai/*',
    'genkit',
    'express',
  ],
  
  productionBrowserSourceMaps: true,
  
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // ✅ Disable Node.js built-ins that don't exist in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
      };

      // ✅ CRITICAL: Use webpack externals to completely exclude server packages from client bundle
      config.externals = [
        ...(config.externals || []),
        '@grpc/grpc-js',
        '@opentelemetry/api',
        '@opentelemetry/sdk-node',
        '@genkit-ai/core',
        '@genkit-ai/google-genai',
        'genkit',
        'express',
        'body-parser',
        'cors',
      ].reduce((acc, pkg) => {
        // Handle wildcard patterns like '@opentelemetry/*'
        if (pkg.endsWith('/*')) {
          const prefix = pkg.slice(0, -2);
          acc.push((context: any, request: any, callback: any) => {
            if (request.startsWith(prefix)) {
              return callback(null, 'commonjs ' + request);
            }
            callback();
          });
        } else {
          acc.push(pkg);
        }
        return acc;
      }, [] as any[]);

      // Strip 'node:' prefix
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
