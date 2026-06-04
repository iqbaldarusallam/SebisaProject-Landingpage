import type { NextConfig } from "next";

const apiCorsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
  {
    key: "Access-Control-Allow-Headers",
    value:
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/checkout/webhook",
        headers: apiCorsHeaders,
      },
    ];
  },
};

export default nextConfig;
