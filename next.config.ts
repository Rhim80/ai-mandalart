import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 호환 설정
  output: 'standalone',

  // Edge Runtime에서 환경변수 사용을 위한 설정
  env: {
    CLOUDFLARE_AI_GATEWAY_URL: process.env.CLOUDFLARE_AI_GATEWAY_URL,
  },
};

export default nextConfig;
