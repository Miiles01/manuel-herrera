import { create } from "zustand";

export interface UseLoader {
  /**
   * `false` while the intro loader is on screen, flipped to `true` the moment
   * the loader starts to disappear. Above-the-fold reveal animations gate on
   * this so they play in as the loader clears — never behind it.
   */
  ready: boolean;
  setReady: (ready: boolean) => void;
}

export const useLoader = create<UseLoader>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
}));
