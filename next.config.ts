import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `/api/users/login`,
        destination: `${apiUrl}/users/login`,
      },
    ];
  },
};

export default nextConfig;
