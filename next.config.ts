import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Fallback for older Next.js versions
    domains: [
      "res.cloudinary.com"
    ],
  },
};

export default nextConfig;
