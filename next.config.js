/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { 
    unoptimized: true,
    domains: ['source.unsplash.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;