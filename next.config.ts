import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of turbopack to avoid bundling test files
  // Run with: pnpm build --webpack
};

export default nextConfig;
