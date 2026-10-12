import { create } from 'zustand';

/** Map a destination URL to the word shown in the loader */
export function getLoaderLabel(url: string): string {
  if (url === "/" || url === "") return "Portafolio";
  if (url.startsWith("/trabajo")) return "Trabajo";
  if (url.startsWith("/contacto")) return "Contacto";
  if (url.startsWith("/proyecto/")) {
    const slug = url.replace("/proyecto/", "");
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "Portafolio";
}

interface TransitionState {
  isTransitioning: boolean;
  targetUrl: string | null;
  label: string;
  /** Whether the current navigation is animated with a page snapshot — the
   *  slide or the fade (set by GlobalLoader when it starts; see pageTransitionKind).
   *  Pages read it to decide whether their own entrance animation would be
   *  hidden under it. */
  slide: boolean;
  setSlide: (slide: boolean) => void;
  startTransition: (url: string) => void;
  finishTransition: () => void;
}

export const usePageTransition = create<TransitionState>((set) => ({
  isTransitioning: false,
  targetUrl: null,
  label: "Hola",
  slide: false,
  setSlide: (slide) => set({ slide }),
  // Label is computed HERE, at click time, from the destination URL
  startTransition: (url) => set({
    isTransitioning: true,
    targetUrl: url,
    label: getLoaderLabel(url),
  }),
  finishTransition: () => set({ isTransitioning: false, targetUrl: null, slide: false }),
}));
