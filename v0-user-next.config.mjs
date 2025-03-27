/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['v0.blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v0.blob.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;

