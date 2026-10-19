import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...["projetos", "sobre", "escrita"].map((route) => ({
        source: `/${route}/index.html`,
        destination: `/${route}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
