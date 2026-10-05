import type { MetadataRoute } from "next";

import { portfolioProjects } from "@/data/portfolio";
import { siteConfig } from "@/lib/site";
import { alternatesFor, LANGS, pathFor, type RouteKey } from "@/utils/seo/routes";

/**
 * Generates `/sitemap.xml`: every public page in both languages, each entry
 * carrying its hreflang alternates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const abs = (path: string) => `${siteConfig.url}${path}`;

  const entry = (
    route: RouteKey,
    slug: string | undefined,
    priority: number,
    changeFrequency: "weekly" | "monthly",
  ): MetadataRoute.Sitemap =>
    LANGS.map((lang) => {
      const { languages } = alternatesFor(route, lang, slug);
      return {
        url: abs(pathFor(route, lang, slug)),
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, abs(v)])),
        },
      };
    });

  return [
    ...entry("home", undefined, 1, "monthly"),
    ...entry("work", undefined, 0.9, "monthly"),
    ...entry("contact", undefined, 0.6, "monthly"),
    ...Object.values(portfolioProjects).flatMap((p) => entry("project", p.slug, 0.8, "monthly")),
  ];
}
