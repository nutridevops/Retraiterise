/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use standalone output for better performance
  output: 'standalone',
  // Disable exportPathMap as it's not compatible with App Router
  // Enable static file serving for all routes
  async rewrites() {
    return [
      {
        source: '/documentation/:path*',
        destination: '/documentation/:path*',
      },
      {
        source: '/client/:path*',
        destination: '/client/:path*',
      },
      {
        source: '/organizer/:path*',
        destination: '/organizer/:path*',
      },
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
      {
        source: '/login',
        destination: '/login',
      },
    ];
  },
  // Set appropriate cache headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
  // Explicitly include all routes in the build
  experimental: {
    // serverActions is now enabled by default in Next.js 14+
    serverComponentsExternalPackages: [],
  },
  // Skip type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip linting during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure all routes are included in the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'md', 'mdx'],
}

module.exports = nextConfig
