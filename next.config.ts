import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
