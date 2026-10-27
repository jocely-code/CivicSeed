import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Project keeps its own curated AGENTS.md — don't let next dev regenerate it.
  agentRules: false,

  // Static export for GitHub Pages (repo is at /CivicSeed, not github.io)
  output: "export",
  basePath: "/CivicSeed",
  assetPrefix: "/CivicSeed",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
