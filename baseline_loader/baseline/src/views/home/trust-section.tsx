"use client";

import Image from "next/image";
import TextEngine from "spring-text-engine";
import { easings } from "@react-spring/web";

import { Inview } from "@/components/animation/springs/in-view";
import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { Handle } from "@/components/animation/springs/handle";
import { ArrowButton } from "@/components/ui/arrow-button";
import { CarouselDots } from "@/components/ui/carousel-dots";
import { useCarousel } from "@/hooks/use-carousel";
import type { TrustContent } from "@/data/mocks/home";

export interface TrustSectionProps {
  trust: TrustContent;
}

/** A single oversized ghost word that re-plays its slide-up reveal whenever the
 *  active coach (and therefore the word) changes — keyed so it remounts. */
const GhostWord = ({ word, tone }: { word: string; tone: "ghost" | "ink" }) => (
  <TextEngine
    key={word}
    tag="span"
    mode="once"
    overflow
    wordIn={{ y: "0%", opacity: 1 }}
    wordOut={{ y: "110%", opacity: 0 }}
    wordConfig={{ duration: 700, easing: easings.easeOutExpo }}
    lineClassName="pb-[0.12em]"
    className={`block ${tone === "ink" ? "text-ink" : "text-ghost"}`}
  >
    {word}
  </TextEngine>
);

export const TrustSection = ({ trust }: TrustSectionProps) => {
  const { index, next, prev, go } = useCarousel(trust.slides.length);
  const slide = trust.slides[index];
  const [skilled, quality, focus, instructor] = slide.headline;

  return (
    <section
      aria-labelledby="trust-title"
      className="relative isolate overflow-hidden bg-background px-6 py-16 sm:px-10 sm:py-20"
    >
      {/* Top badges */}
      <div className="relative z-20 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Inview
          tag="div"
          mode="once"
          from={{ opacity: 0, scale: 0.9 }}
          to={{ opacity: 1, scale: 1 }}
          config={{ tension: 220, friction: 22 }}
          className="grid size-28 shrink-0 place-items-center rounded-pill bg-surface text-center sm:size-32"
        >
          <span>
            <span className="block text-2xl font-medium">{trust.percent.value}</span>
            <span className="mx-auto mt-1 block max-w-[7em] text-[0.6rem] leading-tight text-ink-soft">
              {trust.percent.caption}
            </span>
          </span>
        </Inview>

        <Inview
          tag="article"
          mode="once"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          delayIn={120}
          config={{ tension: 200, friction: 26 }}
          className="flex max-w-md gap-4 rounded-card bg-surface p-5 sm:gap-5 sm:p-6"
        >
          <span className="h-fit rounded-xl bg-background px-4 py-2 text-xl font-medium">
            {trust.badge.index}
          </span>
          <span>
            <span className="block text-lg font-medium">{trust.badge.title}</span>
            <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
              {trust.badge.body}
            </span>
          </span>
        </Inview>
      </div>

      {/* Oversized ghost heading with opposing parallax */}
      <h2
        id="trust-title"
        aria-label={slide.headline.join(" ")}
        className="pointer-events-none relative z-0 mx-auto mt-12 max-w-[88rem] select-none text-[8.2vw] font-medium uppercase leading-[1.02] tracking-tight"
      >
        <span className="flex items-baseline justify-between" aria-hidden="true">
          <SpringTrigger tag="span" innerTag="span" mode="scrub" from={{ x: "-3%" }} to={{ x: "3%" }} innerClassName="block">
            <GhostWord word={skilled} tone="ghost" />
          </SpringTrigger>
          <SpringTrigger tag="span" innerTag="span" mode="scrub" from={{ x: "3%" }} to={{ x: "-3%" }} innerClassName="block">
            <GhostWord word={quality} tone="ghost" />
          </SpringTrigger>
        </span>
        <span className="flex items-baseline justify-between" aria-hidden="true">
          <SpringTrigger tag="span" innerTag="span" mode="scrub" from={{ x: "-2%" }} to={{ x: "4%" }} innerClassName="block">
            <GhostWord word={focus} tone="ink" />
          </SpringTrigger>
          <SpringTrigger tag="span" innerTag="span" mode="scrub" from={{ x: "4%" }} to={{ x: "-3%" }} innerClassName="block">
            <GhostWord word={instructor} tone="ghost" />
          </SpringTrigger>
        </span>
      </h2>

      {/* Center coach card — static wrapper centres it, Inview reveals it once,
          Handle swaps the slide, the inner span holds the static tilt. */}
      <div className="pointer-events-none relative z-10 mx-auto mt-8 w-52 sm:absolute sm:left-1/2 sm:top-1/2 sm:mt-0 sm:w-64 sm:-translate-x-1/2 sm:-translate-y-1/2">
        <Inview
          tag="figure"
          mode="once"
          from={{ opacity: 0, y: 60, scale: 0.92 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          config={{ tension: 170, friction: 26 }}
          className="pointer-events-auto"
        >
          <span className="block rotate-[6deg]">
            <Handle
              tag="div"
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ tension: 260, friction: 26 }}
            >
              <span
                key={slide.name}
                className="relative block aspect-[3/4] overflow-hidden rounded-card bg-brand"
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 640px) 13rem, 16rem"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-brand-deep/40 px-3 py-2 text-on-brand backdrop-blur-md">
                  <span className="block text-sm font-medium">{slide.name}</span>
                  <span className="block text-[0.65rem] opacity-80">{slide.role}</span>
                </figcaption>
              </span>
            </Handle>
          </span>
        </Inview>
      </div>

      {/* Carousel controls */}
      <div className="relative z-20 mt-12 flex items-center justify-between sm:mt-24">
        <ArrowButton direction="prev" label="Previous coach" variant="outline" onClick={prev} />
        <CarouselDots
          count={trust.slides.length}
          active={index}
          onSelect={go}
          label="Coach"
        />
        <ArrowButton direction="next" label="Next coach" variant="solid" onClick={next} />
      </div>
    </section>
  );
};
