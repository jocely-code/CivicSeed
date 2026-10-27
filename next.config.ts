import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Project keeps its own curated AGENTS.md — don't let next dev regenerate it.
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
