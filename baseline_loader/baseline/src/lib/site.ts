/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update these values per project.
 */
import { publicEnv } from "@/env";

export const siteConfig = {
  name: "Baseline",
  shortName: "Baseline",
  /** Used in the title template and OG/structured-data where the full name reads better. */
  legalName: "Baseline Tennis Club & Academy",
  description:
    "Baseline — a members' tennis club and academy where result-driven coaching meets championship courts. Book courts, coaching, and membership.",
  /** Short tagline reused in OG copy / structured data. */
  tagline: "Result-driven coaching. Championship courts.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Baseline — Tennis Club & Academy",
  /** Search keywords (kept tight — keyword stuffing is ignored / penalised). */
  keywords: [
    "tennis club",
    "tennis academy",
    "tennis coaching",
    "tennis lessons",
    "tennis courts",
    "junior tennis",
    "private coaching",
    "membership",
    "Baseline",
  ],
  twitterHandle: "@baselineclub",
  author: "Baseline Tennis Club",
  locale: "en_US",
  /** Browser theme-color (address bar / PWA). */
  themeColor: "#0f2f63",
  /** PWA splash background. */
  backgroundColor: "#0f2f63",
  /** Real-world contact — also feeds the LocalBusiness structured data. */
  contact: {
    email: "play@baseline.club",
    phone: "+1 (212) 555-0148",
    address: {
      street: "120 Court Lane",
      locality: "New York",
      region: "NY",
      postalCode: "10001",
      country: "US",
    },
  },
  /** Official profiles — emitted as `sameAs` for entity disambiguation. */
  sameAs: [
    "https://instagram.com/baselineclub",
    "https://x.com/baselineclub",
    "https://youtube.com/@baselineclub",
    "https://linkedin.com/company/baselineclub",
  ],
} as const;
