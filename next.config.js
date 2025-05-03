/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static file serving for documentation files
  async rewrites() {
    return [
      {
        source: '/documentation/:path*',
        destination: '/documentation/:path*',
      },
    ];
  },
}

module.exports = nextConfig
