import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/curriculumstudio/api/", "/curriculumstudio/admin/"],
    },
    ...(process.env.CURRICULUM_STUDIO_ORIGIN
      ? { sitemap: "https://samuelproenca.com/curriculumstudio/sitemap.xml" }
      : {}),
  };
}
