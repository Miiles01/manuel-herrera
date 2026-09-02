import { create } from 'zustand';

interface TransitionState {
  isTransitioning: boolean;
  targetUrl: string | null;
  startTransition: (url: string) => void;
  finishTransition: () => void;
}

export const usePageTransition = create<TransitionState>((set) => ({
  isTransitioning: false,
  targetUrl: null,
  startTransition: (url) => set({ isTransitioning: true, targetUrl: url }),
  finishTransition: () => set({ isTransitioning: false, targetUrl: null }),
}));
