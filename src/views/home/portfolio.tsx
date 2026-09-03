"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { TransitionLink } from "@/components/ui/transition-link";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioItem } from "@/data/mocks/home";
import { portfolioTransform, pfTrackTransform } from "@/utils/showreel/timeline";

export interface PortfolioProps {
  p: SpringValue<number>;
  items: PortfolioItem[];
  /** Whether the portfolio is within its scroll range — gates video loading. */
  active: boolean;
}

const PfCard = ({ item, active }: { item: PortfolioItem; active: boolean }) => {
  const CardWrapper = item.slug ? TransitionLink : "div" as any;
  return (
    <CardWrapper href={item.slug ? `/proyecto/${item.slug}` : "#"} className="relative flex h-full w-[62vw] shrink-0 flex-col justify-end overflow-hidden rounded-pf bg-[#1e1e1e] p-[4vmin] text-white [backface-visibility:hidden] [transform:translateZ(0)] block cursor-pointer group">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      )}
      
      {/* Gradiente y texto — ocultos por defecto, visibles al hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

      {/* Contenedor de texto en la parte inferior */}
      <div className="relative z-[2] flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
        <h3 className="m-0 text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.05] tracking-[-0.02em]">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="m-0 text-sm md:text-base lg:text-lg text-white/80 font-light leading-snug max-w-[85%]">
            {item.subtitle}
          </p>
        )}
      </div>
    </CardWrapper>
  );
};

/**
 * Fixed portfolio section. Flies up from below, scrolls its three video cards
 * horizontally, then exits left with a scale-down — all scrubbed by the global
 * scroll spring. The aurora background counter-translates so it stays put while
 * the cards slide over it. Max horizontal pan is measured from the track.
 */
// `memo` so the stage's visibility re-renders don't re-render the portfolio
// (and reconcile its videos) when only an unrelated scene flag flips.
export const Portfolio = memo(({ p, items, active }: PortfolioProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxPan, setMaxPan] = useState(0);

  // Stable interpolations — recreating them on the `active`/`maxPan` re-renders
  // would re-attach the transforms and flash the section for a frame.
  const sectionTransform = useMemo(() => p.to(portfolioTransform), [p]);
  const trackTransform = useMemo(
    () => p.to((v) => pfTrackTransform(v, maxPan)),
    [p, maxPan],
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const vp = el.parentElement;
      if (!vp) return;
      const rightGap = (3 * Math.min(window.innerWidth, window.innerHeight)) / 100;
      const next = Math.max(0, el.scrollWidth - vp.clientWidth + rightGap);
      setMaxPan((prev) => (prev === next ? prev : next));
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <animated.section
      className="fixed inset-0 z-40 flex flex-col overflow-hidden pb-[8vmin] pt-[9vmin] text-paper-alt will-change-transform"
      style={{ transform: sectionTransform }}
    >
      {/* No own background: the section sits on the shared pinned aurora behind
          the sticky stage (ADR-0018). No header — just the horizontally
          scrolling cards. */}
      <div className="relative z-[1] min-h-0 flex-1 overflow-hidden">
        <animated.div
          ref={trackRef}
          className="flex h-full gap-[3vmin] pl-[3vmin] will-change-transform"
          style={{ transform: trackTransform }}
        >
          {items.map((item) => (
            <PfCard key={item.title} item={item} active={active} />
          ))}
        </animated.div>
      </div>
    </animated.section>
  );
});
Portfolio.displayName = "Portfolio";
