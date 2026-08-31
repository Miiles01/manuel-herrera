"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";

import { Hover } from "@/components/animation/springs/hover";
import { anchorScroll } from "@/utils/anchor-scroll";

type Variant = "solid" | "outline" | "light";

export interface PillButtonProps {
  children: ReactNode;
  /** Renders an anchor when set; otherwise a button. */
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  withArrow?: boolean;
  ariaLabel?: string;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-on-brand hover:bg-brand-deep",
  outline: "border border-current text-ink hover:bg-ink hover:text-on-brand",
  light: "bg-on-brand text-brand-deep hover:bg-brand-light hover:text-on-brand",
};

/**
 * Pill-shaped call-to-action. The arrow spring-slides on hover; colours swap on
 * hover; focus is always visible. Renders a real `<a>` (via `next/link`) when
 * `href` is provided, otherwise a real `<button type="button">`.
 */
export const PillButton = ({
  children,
  href,
  onClick,
  variant = "solid",
  withArrow = true,
  ariaLabel,
  className,
}: PillButtonProps) => {
  const ref = useRef<HTMLElement>(null);
  const base = `group inline-flex cursor-pointer items-center gap-2 rounded-pill px-7 py-3.5 text-sm font-medium uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 ${VARIANTS[variant]} ${className ?? ""}`;

  const inner = (
    <>
      {children}
      {withArrow && (
        <Hover
          tag="span"
          trigger={ref}
          from={{ x: 0 }}
          to={{ x: 5 }}
          config={{ tension: 320, friction: 20 }}
          className="inline-flex"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Hover>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        onClick={anchorScroll(href, onClick)}
        className={base}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={base}
    >
      {inner}
    </button>
  );
};
