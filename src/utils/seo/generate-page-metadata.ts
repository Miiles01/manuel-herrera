/**
 * @fileoverview Standardised metadata + viewport generators for pages.
 *
 * `generateMetadata` builds a Next.js `Metadata` object — title, description,
 * OpenGraph, Twitter card, **per-page canonical + hreflang alternates**, robots.
 * `metadataBase` is always set (from `siteConfig`) so relative URLs resolve to
 * absolute — required by social scrapers.
 *
 * Pass `route` (+ `slug` for projects) so the canonical points at the page itself
 * and `hreflang` links the ES/EN versions. `title` is the FULL document title
 * (rendered as-is, no template).
 */

import { Metadata, Viewport } from "next";

import { siteConfig } from "@/lib/site";
import {
  alternatesFor,
  OG_LOCALE,
  type Lang,
  type RouteKey,
} from "@/utils/seo/routes";

interface MetadataProps {
  lang?: Lang;
  /** Full document title. */
  title?: string;
  description?: string;
  route?: RouteKey;
  slug?: string;
  /** Share image (path under `public/` or absolute URL). Falls back to the generated OG card. */
  image?: string;
}

export function generateMetadata({
  lang = "es",
  title = `${siteConfig.name} — ${siteConfig.tagline}`,
  description = siteConfig.description,
  route = "home",
  slug,
  image,
}: MetadataProps = {}): Metadata {
  const alternates = alternatesFor(route, lang, slug);
  const otherLang: Lang = lang === "es" ? "en" : "es";
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    // Resolves every relative URL below to an absolute one.
    metadataBase: new URL(siteConfig.url),
    title: { absolute: title },
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[otherLang]],
      type: "website",
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images && { images: images.map((i) => i.url) }),
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: siteConfig.themeColor,
    width: "device-width",
    initialScale: 1,
  };
}
