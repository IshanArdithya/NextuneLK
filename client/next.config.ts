import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/usage',
        permanent: true,
      },
      {
        source: '/setup',
        destination: '/usage',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
