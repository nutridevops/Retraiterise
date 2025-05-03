/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure all pages are properly included in the build
  output: 'standalone',
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
  // Explicitly include all existing routes in the build
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/client/dashboard': { page: '/client/dashboard' },
      '/client/booking': { page: '/client/booking' },
      '/client/profile': { page: '/client/profile' },
      '/client/resources': { page: '/client/resources' },
      '/client/messages': { page: '/client/messages' },
      '/client/settings': { page: '/client/settings' },
      '/organizer/dashboard': { page: '/organizer/dashboard' },
      '/organizer/bookings': { page: '/organizer/bookings' },
      '/organizer/clients': { page: '/organizer/clients' },
      '/organizer/profile': { page: '/organizer/profile' },
      '/organizer/resources': { page: '/organizer/resources' },
      '/organizer/messages': { page: '/organizer/messages' },
      '/organizer/settings': { page: '/organizer/settings' },
      '/organizer/events': { page: '/organizer/events' },
      '/documentation': { page: '/documentation' },
      '/documentation/client': { page: '/documentation/client' },
      '/documentation/organizer': { page: '/documentation/organizer' },
      '/login': { page: '/login' },
    };
  },
}

module.exports = nextConfig
