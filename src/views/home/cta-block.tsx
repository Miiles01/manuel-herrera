"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { memo } from "react";
import { ctaReveal } from "@/utils/showreel/timeline";
import { TransitionLink } from "@/components/ui/transition-link";

export interface CtaBlockProps {
  /** Global scroll spring (0→1). */
  p: SpringValue<number>;
  heading: string;
  /** Second heading line, rendered semi-transparent (like the hero subtitle). */
  headingFaded: string;
  sub: string;
  button: string;
  href: string;
}

/**
 * Call-to-action overlaid on the final chrome-star block. Left-aligned copy (the
 * star sits to the right of the frame) that fades + rises in as the camera flies
 * into the block — driven by the global spring (`ctaReveal`), no CSS transition.
 * Heading uses the hero-H1 scale (`7vw`) and breaks onto two lines, the second
 * one semi-transparent like the hero subtitle.
 */
// `memo`: props are stable, so it mounts once and its interpolations are never
// re-created by the stage's visibility re-renders (avoids a one-frame reset).
import { Testimonials } from "./testimonials";

export const CtaBlock = memo(({ p, heading, headingFaded, sub, button, href }: CtaBlockProps) => (
  <animated.div
    className="pointer-events-none absolute max-sm:relative inset-0 max-sm:inset-auto z-[2] flex flex-col md:flex-row items-start md:items-center justify-between gap-[5vmin] p-[9vmin] max-sm:p-0 max-sm:w-full max-sm:h-auto"
    style={{ opacity: 1, transform: 'translateY(0)' }}
  >
    <div className="flex flex-col items-start gap-[2.5vmin] max-w-[50vw] max-sm:max-w-full">
      <h2 className="m-0 flex flex-col items-start text-[7vw] font-normal leading-[0.95] tracking-[-0.03em] text-white">
        <span>{heading}</span>
        <span>{headingFaded}</span>
      </h2>
      {sub && <p className="m-0 max-w-[30vw] max-sm:max-w-[80vw] text-[2.2vmin] max-sm:text-[3.4vmin] leading-snug text-white opacity-90">{sub}</p>}
      <TransitionLink
        href={href}
        className="pointer-events-auto mt-[1.5vmin] inline-flex items-center justify-center rounded-full bg-paper px-[4.6vmin] py-[2.2vmin] text-[2.5vmin] max-sm:text-[3.5vmin] leading-none text-ink hover:scale-105 transition-transform duration-300"
      >
        {button}
      </TransitionLink>
    </div>

    <div className="pointer-events-auto w-[35vw] max-sm:w-full max-sm:mt-[4vmin] flex flex-col">
      <Testimonials />
    </div>
  </animated.div>
));
CtaBlock.displayName = "CtaBlock";
