import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { BENCHMARKS } from "@/lib/benchmarks-config";

const BASE_URL = "https://embra7e.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/benchmarks`, lastModified: now, changeFrequency: "hourly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: a.updated ? new Date(a.updated) : new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const benchmarkRoutes: MetadataRoute.Sitemap = BENCHMARKS.flatMap((b) =>
    b.difficulties.map((d) => ({
      url: `${BASE_URL}/benchmarks/${b.slug}/${d.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.5,
    })),
  );

  return [...staticRoutes, ...articleRoutes, ...benchmarkRoutes];
}
