import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy browser calls to same-origin /api/* over to the backend.
    // This prevents third-party cookie issues and keeps auth cookies first-party.
    const backendBase = process.env.NEXT_PUBLIC_API_URL;
    if (!backendBase) return [];

    const trimmed = backendBase.replace(/\/+$/, "");
    const apiBase = /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;

    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;