"use client";

export interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** `dark` for light surfaces, `light` for dark surfaces. */
  tone?: "dark" | "light";
  label?: string;
  className?: string;
}

/**
 * Clickable carousel indicators. The active dot widens; each is a real button
 * with an accessible name and visible focus.
 */
export const CarouselDots = ({
  count,
  active,
  onSelect,
  tone = "dark",
  label = "Slide",
  className,
}: CarouselDotsProps) => {
  const activeColor = tone === "light" ? "bg-on-brand" : "bg-ink";
  const idleColor = tone === "light" ? "bg-on-brand/40" : "bg-ghost";

  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`${label} ${i + 1}`}
            aria-current={isActive}
            onClick={() => onSelect(i)}
            className="cursor-pointer rounded-pill p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
          >
            <span
              className={`block h-1.5 rounded-pill ${isActive ? `w-5 ${activeColor}` : `w-1.5 ${idleColor}`}`}
            />
          </button>
        );
      })}
    </span>
  );
};
