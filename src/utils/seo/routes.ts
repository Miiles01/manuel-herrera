/**
 * Single source of truth for the localized URL of every public route. Used by
 * page metadata (canonical + hreflang), the sitemap and the language switcher so
 * the ES ↔ EN mapping never drifts (the two languages use different slugs).
 */

export type Lang = "es" | "en";
export type RouteKey = "home" | "work" | "contact" | "project";

export const LANGS: readonly Lang[] = ["es", "en"];

const PATHS: Record<RouteKey, Record<Lang, string>> = {
  home: { es: "/es", en: "/en" },
  work: { es: "/es/trabajo", en: "/en/work" },
  contact: { es: "/es/contacto", en: "/en/contact" },
  project: { es: "/es/proyecto", en: "/en/project" },
};

/** Localized path for a route (`slug` is appended for `project`). */
export const pathFor = (route: RouteKey, lang: Lang, slug?: string): string =>
  slug ? `${PATHS[route][lang]}/${slug}` : PATHS[route][lang];

/** BCP-47 tags used in `hreflang`/`og:locale`. */
export const HREFLANG: Record<Lang, string> = { es: "es-MX", en: "en-US" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_MX", en: "en_US" };

/** Canonical + hreflang alternates for a route (x-default = Spanish). */
export const alternatesFor = (route: RouteKey, lang: Lang, slug?: string) => ({
  canonical: pathFor(route, lang, slug),
  languages: {
    [HREFLANG.es]: pathFor(route, "es", slug),
    [HREFLANG.en]: pathFor(route, "en", slug),
    "x-default": pathFor(route, "es", slug),
  },
});

/**
 * Maps the CURRENT pathname to the equivalent page in `target` language
 * (e.g. `/es/proyecto/tulum` → `/en/project/tulum`). Falls back to the target
 * home for unknown paths. Used by the language switcher.
 */
export const localizedPath = (pathname: string, target: Lang): string => {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const lang of LANGS) {
    const projectBase = PATHS.project[lang];
    if (clean.startsWith(`${projectBase}/`)) {
      const slug = clean.slice(projectBase.length + 1).split("/")[0];
      return pathFor("project", target, slug);
    }
    for (const route of ["work", "contact", "home"] as const) {
      if (clean === PATHS[route][lang]) return PATHS[route][target];
    }
  }
  return PATHS.home[target];
};
