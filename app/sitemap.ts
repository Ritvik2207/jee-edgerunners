import type { MetadataRoute } from "next";
import { resourceArticles, resourcePath } from "@/lib/resource-content";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/dashboard",
  "/planner",
  "/syllabus",
  "/error-book",
  "/mocks",
  "/settings",
  "/resources"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" || route === "/resources" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : route === "/resources" ? 0.9 : 0.7
    })),
    ...resourceArticles.map((article) => ({
      url: absoluteUrl(resourcePath(article.slug)),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
