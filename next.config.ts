import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos envoyées depuis /admin (Sanity)
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
};

export default nextConfig;
