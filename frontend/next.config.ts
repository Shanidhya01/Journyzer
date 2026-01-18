import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/Profile",
        permanent: false,
      },
      {
        source: "/settings",
        destination: "/setting",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
