import { usePageTransition } from "@/hooks/use-page-transition";

/**
 * Whether navigations get the page slide (View Transitions). Off on phones
 * (< 640px) — there a page change is a plain swap — and when the browser lacks
 * support or the visitor prefers reduced motion. Tablet / desktop keep it.
 */
export function usesPageSlide(): boolean {
  if (typeof document === "undefined" || !document.startViewTransition) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return !window.matchMedia("(max-width: 639px)").matches;
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
  if (!usePageTransition.getState().isTransitioning || !usesPageSlide()) return false;
  const docTop = el.getBoundingClientRect().top + window.scrollY;
  return docTop < window.innerHeight;
}
