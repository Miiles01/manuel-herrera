import Image from "next/image";
import type { CatalistContent } from "@/data/mocks/home";

export interface CatalistCardProps {
  variant: "dark" | "light";
  content: CatalistContent;
  bg: string;
}

const Logo = () => (
  <span
    aria-hidden="true"
    className="flex size-[3.4vmin] shrink-0 items-center justify-center rounded-[0.9vmin] bg-white text-ink"
  >
    {/* Brand sparkle (four-point star), echoing the site star logo. */}
    <svg viewBox="0 0 24 24" className="size-[2.2vmin]" fill="currentColor" aria-hidden="true">
      <path d="M12 2 L13.9 10.1 L22 12 L13.9 13.9 L12 22 L10.1 13.9 L2 12 L10.1 10.1 Z" />
    </svg>
  </span>
);

/**
 * "Catalist" product UI mockup — carousel cards 2 (dark) and 3 (light). The
 * outer sizing/transform is applied by the stage; this renders the full-bleed
 * background image and the overlaid mock chrome.
 */
export const CatalistCard = ({ variant, content, bg }: CatalistCardProps) => {
  const dark = variant === "dark";
  const ink = dark ? "text-cc-dark-ink" : "text-cc-light-ink";

  return (
    <div className="relative size-full overflow-hidden rounded-card bg-[#1e1e1e]">
      {bg && (
        <Image
          src={bg}
          alt=""
          fill
          sizes="42vmin"
          className="object-cover"
        />
      )}
    </div>
  );
};
