import { usePageTransition } from "@/hooks/use-page-transition";

/** The home pages (one per language). */
const isHome = (path: string) => path === "/es" || path === "/en" || path === "/";

export type PageTransitionKind = "slide" | "fade" | "none";

/**
 * How a navigation is animated (View Transitions):
 * - "fade": leaving the home — a simple cross-fade into the new page.
 * - "slide": between the other pages (work ↔ projects, project ↔ project, back
 *   to the home).
 * - "none": phones (< 640px), no browser support, or reduced motion — a plain swap.
 */
export function pageTransitionKind(fromPath: string): PageTransitionKind {
  if (typeof document === "undefined" || !document.startViewTransition) return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  if (window.matchMedia("(max-width: 639px)").matches) return "none";
  return isHome(fromPath) ? "fade" : "slide";
}

/**
 * Whether an element's own entrance animation should be skipped because the
 * page is arriving through the page transition and the element sits in the
 * first screen.
 *
 * The page transition snapshots the new page the moment its route renders and
 * slides that snapshot in. A fade-up that starts at opacity 0 is therefore
 * captured invisible, plays unseen under the snapshot, and the finished
 * content pops in when the transition ends — a flash. For first-screen content
 * the slide itself is the entrance, so it should just be shown.
 *
 * Measured against the document (not the viewport): when this runs, the window
 * may still be scrolled where the previous page was.
 */
export function arrivesWithPageTransition(el: Element): boolean {
  const { isTransitioning, slide } = usePageTransition.getState();
  if (!isTransitioning || !slide) return false;
  const docTop = el.getBoundingClientRect().top + window.scrollY;
  return docTop < window.innerHeight;
}
