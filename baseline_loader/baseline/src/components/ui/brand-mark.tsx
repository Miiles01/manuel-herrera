import type { CSSProperties } from "react";

export interface BrandMarkProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
}

/**
 * Baseline mark — a tennis ball drawn with a single seam. Stroke-only and
 * single-colour so it reads correctly on both the dark hero and light surfaces
 * via `currentColor`.
 */
export const BrandMark = ({ className, style, title }: BrandMarkProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    role="img"
    aria-label={title}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M4.8 5.6A9 9 0 0 0 4.8 18.4" />
    <path d="M19.2 5.6a9 9 0 0 1 0 12.8" />
  </svg>
);
