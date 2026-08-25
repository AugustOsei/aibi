import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "knowaibi.com" }],
        destination: "https://www.knowaibi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
