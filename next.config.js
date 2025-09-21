/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:7470',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:7470'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;