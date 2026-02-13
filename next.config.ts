import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["resend"],
  allowedDevOrigins: ["172.20.10.10"],
};

export default nextConfig;
