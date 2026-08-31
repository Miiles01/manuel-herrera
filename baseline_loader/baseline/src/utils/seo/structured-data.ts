/**
 * @fileoverview JSON-LD structured data helpers.
 *
 * Structured data lets search engines understand the site as entities
 * (Organization / SportsActivityLocation, WebSite) rather than just text —
 * improving rich results. Render the output inside a
 * `<script type="application/ld+json">` tag.
 */

import { siteConfig } from "@/lib/site";

/**
 * Organization (typed also as a SportsActivityLocation so it carries address,
 * hours, and contact) + WebSite schema for the site root. Emit once, in the
 * root layout. The nodes are linked by `@id` so crawlers treat them as related.
 */
export function getSiteStructuredData() {
  const { contact } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "SportsActivityLocation"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon-512x512.png`,
          width: 512,
          height: 512,
        },
        image: `${siteConfig.url}${siteConfig.ogImage}`,
        email: contact.email,
        telephone: contact.phone,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.locality,
          addressRegion: contact.address.region,
          postalCode: contact.address.postalCode,
          addressCountry: contact.address.country,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "07:00",
            closes: "22:00",
          },
        ],
        sameAs: [...siteConfig.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: "en-US",
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };
}
