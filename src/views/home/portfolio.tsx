"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { TransitionLink } from "@/components/ui/transition-link";
import { CtaBlock } from "@/views/home/cta-block";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioItem } from "@/data/mocks/home";
import { portfolioTransform, pfTrackTransform } from "@/utils/showreel/timeline";

export interface PortfolioProps {
  p: SpringValue<number>;
  items: PortfolioItem[];
  /** Whether the portfolio is within its scroll range — gates video loading. */
  active: boolean;
  ctaContent?: any;
}

const PfCard = ({ item, active, lang = "es" }: { item: PortfolioItem; active: boolean, lang?: "es"|"en" }) => {
  const CardWrapper = item.slug ? TransitionLink : "div" as any;
  return (
    <CardWrapper href={item.slug ? (lang === "en" ? `/en/project/${item.slug}` : `/es/proyecto/${item.slug}`) : "#"} className="pointer-events-auto relative flex h-full w-[62vw] shrink-0 flex-col justify-end overflow-hidden rounded-pf bg-white p-[4vmin] text-black [backface-visibility:hidden] [transform:translateZ(0)] block cursor-pointer group shadow-xl">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      )}
      
      {/* Gradiente y texto — ocultos por defecto, visibles al hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/95 via-white/70 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

      {/* Contenedor de texto en la parte inferior */}
      <div className="relative z-[2] flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
        <h2 className="m-0 text-3xl md:text-4xl lg:text-[3.5vw] font-normal leading-[1.05] tracking-[-0.02em] text-black">
          {item.title}
        </h2>
        {item.subtitle && (
          <p className="m-0 text-sm md:text-base lg:text-lg text-gray-700 font-light leading-snug max-w-[85%]">
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
export const Portfolio = memo(({ p, items, active, ctaContent }: PortfolioProps) => {
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
      const isMobile = window.innerWidth < 640;
      const rightGap = (3 * Math.min(window.innerWidth, window.innerHeight)) / 100;
      let next = 0;
      if (isMobile) {
        next = Math.max(0, el.scrollHeight - vp.clientHeight + rightGap);
      } else {
        next = Math.max(0, el.scrollWidth - vp.clientWidth + rightGap);
      }
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
      className="fixed inset-0 z-40 flex flex-col overflow-hidden pb-[8vmin] pt-[9vmin] text-paper-alt will-change-transform max-sm:hidden pointer-events-none"
      style={{ transform: sectionTransform }}
    >
      {/* No own background: the section sits on the shared pinned aurora behind
          the sticky stage (ADR-0018). No header — just the horizontally
          scrolling cards. */}
      <div className="relative z-[1] min-h-0 flex-1 overflow-hidden">
        <animated.div
          ref={trackRef}
          className="flex h-full max-sm:h-auto max-sm:flex-col gap-[3vmin] max-sm:gap-[6vmin] pl-[3vmin] max-sm:px-[5vw] max-sm:pt-[10vh] will-change-transform pointer-events-auto"
          style={{ transform: trackTransform }}
        >
          {/* Text Intro Block inside the Carousel */}
          <div className="flex flex-col justify-center h-full w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 pl-[5vw] pr-[2vw] text-white">
            <h3 className="text-sm md:text-base uppercase tracking-[0.2em] mb-4 opacity-70">Our favorites for you</h3>
            <h2 className="text-5xl md:text-[4vw] font-normal tracking-tight mb-6 leading-[1.1]">Dishes that tell a story</h2>
            <p className="text-lg md:text-[1.25vw] font-light opacity-80 leading-relaxed max-w-lg">
              Every recipe holds a piece of our heritage. Sourced daily and prepared with passion, these are the flavors that define Tulum.
            </p>
          </div>

          {items.map((item) => (
            <PfCard key={item.title} item={item} active={active} />
          ))}
          {ctaContent && (
            <div className="sm:hidden w-[90vw] shrink-0 mt-[10vh] pb-[20vh]">
              <CtaBlock
                p={p}
                heading={ctaContent.heading}
                headingFaded={ctaContent.headingFaded}
                sub={ctaContent.sub}
                button={ctaContent.button}
                href={ctaContent.href}
              />
            </div>
          )}
        </animated.div>
      </div>
    </animated.section>
  );
});
Portfolio.displayName = "Portfolio";
