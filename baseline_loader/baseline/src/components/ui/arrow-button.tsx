"use client";

import { useRef } from "react";

import { Hover } from "@/components/animation/springs/hover";

export interface ArrowButtonProps {
  direction: "prev" | "next";
  label: string;
  variant?: "outline" | "solid";
  onClick?: () => void;
}

/**
 * Circular carousel control. `outline` is the light bordered prev button;
 * `solid` is the filled dark next button. The inner icon spring-scales when the
 * button is hovered.
 */
export const ArrowButton = ({
  direction,
  label,
  variant = "outline",
  onClick,
}: ArrowButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const solid = variant === "solid";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-12 cursor-pointer place-items-center rounded-pill border outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 sm:size-14 ${
        solid
          ? "border-ink bg-ink text-on-brand hover:bg-brand-deep"
          : "border-hairline bg-transparent text-ink hover:border-ink"
      }`}
    >
      <Hover
        tag="span"
        trigger={ref}
        from={{ scale: 1 }}
        to={{ scale: 1.15 }}
        config={{ tension: 320, friction: 18 }}
        className="grid place-items-center"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ transform: direction === "prev" ? "scaleX(-1)" : undefined }}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Hover>
    </button>
  );
};
