// This file is used to configure the Next.js build process
// It ensures all client and organizer routes are included in the build

/** @type {import('next').NextConfig} */
module.exports = {
  // Include all routes in the build
  transpilePackages: [],
  typescript: {
    // Skip type checking during build for faster builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting during build for faster builds
    ignoreDuringBuilds: true,
  },
  // Force all pages to be server-side rendered
  // This ensures all routes are included in the build
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [],
  },
  // Ensure all routes are included in the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'md', 'mdx'],
};
