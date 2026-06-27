import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/rapier'],

  // ── CORS headers for all API routes ─────────────────────────────
  // Required when the deployed frontend domain differs from the API
  // domain, or when called from browser dev tools / mobile apps.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            // Allow all origins — lock this down to your domain in production
            // e.g. "https://www.kareerpilot.com" if you want strict CORS
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization, Accept",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
