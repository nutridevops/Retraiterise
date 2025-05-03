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
    serverActions: true,
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
