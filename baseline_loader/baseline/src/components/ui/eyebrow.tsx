import type { ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  /** `dark` for light surfaces, `light` for dark surfaces. */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Small uppercase section label with a leading brand dot. A repeated visual
 * pattern across sections, so it lives as a component rather than a CSS class.
 */
export const Eyebrow = ({ children, tone = "dark", className }: EyebrowProps) => (
  <span
    className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] ${
      tone === "light" ? "text-on-brand/70" : "text-ink-soft"
    } ${className ?? ""}`}
  >
    <span
      className={`size-1.5 rounded-pill ${tone === "light" ? "bg-brand-light" : "bg-brand"}`}
      aria-hidden="true"
    />
    {children}
  </span>
);
