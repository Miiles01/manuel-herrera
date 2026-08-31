import { create } from "zustand";

export interface UseContactModal {
  /** Whether the "Book a visit" contact modal is open. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * Global open/close state for the contact modal, so any "Book a visit" CTA
 * (header, menu, footer) can summon the same dialog. Mounted once via
 * `<ContactModal>` in the home view.
 */
export const useContactModal = create<UseContactModal>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
