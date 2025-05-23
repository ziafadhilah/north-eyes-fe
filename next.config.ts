import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;

const nextConfig: NextConfig = {
  trailingSlash: false,
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
