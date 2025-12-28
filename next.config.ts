import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 호환 설정
  output: 'standalone',

  // Edge Runtime 최적화
  experimental: {
    // Cloudflare에서 필요한 설정
  },
};

export default nextConfig;
