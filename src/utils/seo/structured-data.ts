/**
 * @fileoverview JSON-LD structured data helpers.
 *
 * Structured data lets search engines understand the site as entities
 * (Person, WebSite) rather than just text — improving rich results.
 * Render the output inside a `<script type="application/ld+json">` tag.
 */

import { siteConfig } from "@/lib/site";
import { HREFLANG, pathFor, type Lang } from "@/utils/seo/routes";

const JOB_TITLE: Record<Lang, string> = {
  es: "Estratega de marca y creador visual",
  en: "Brand strategist and visual creator",
};

/**
 * Person + WebSite schema for the site root. Emit once, in the root layout. The
 * two nodes are linked by `@id` so crawlers treat them as related.
 */
export function getSiteStructuredData(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: `${siteConfig.url}${pathFor("home", lang)}`,
        jobTitle: JOB_TITLE[lang],
        sameAs: [siteConfig.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: HREFLANG[lang],
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
    ],
  };
}
