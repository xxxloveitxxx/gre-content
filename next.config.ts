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
  
  // ✅ These packages are server-only and must not be in client bundle
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

      // ✅ CRITICAL: Proper externals config for scoped packages
      // Use object syntax: 'package-name': 'commonjs package-name'
      config.externals = {
        ...(config.externals as any),
        // gRPC + OpenTelemetry (server-only)
        '@grpc/grpc-js': 'commonjs @grpc/grpc-js',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
        '@opentelemetry/sdk-node': 'commonjs @opentelemetry/sdk-node',
        '@opentelemetry/sdk-trace-base': 'commonjs @opentelemetry/sdk-trace-base',
        // Genkit (server-only AI framework)
        'genkit': 'commonjs genkit',
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        '@genkit-ai/google-genai': 'commonjs @genkit-ai/google-genai',
        '@genkit-ai/flow': 'commonjs @genkit-ai/flow',
        // Express + related (server framework)
        'express': 'commonjs express',
        'body-parser': 'commonjs body-parser',
        'cors': 'commonjs cors',
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
