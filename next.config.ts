import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storageaccmagenta01.blob.core.windows.net',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
