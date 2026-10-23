import type { NextConfig } from "next";
import { curriculumStudioRewrites } from "./src/lib/curriculum-studio";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "samuelproenca.com"],
  async rewrites() {
    return curriculumStudioRewrites(
      process.env.CURRICULUM_STUDIO_ORIGIN,
      process.env.NODE_ENV !== "production",
    );
  },
  async headers() {
    return ["/curriculumstudio/api/:path*", "/curriculumstudio/admin/:path*"].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "private, no-store" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    }));
  },
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
