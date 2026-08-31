"use client";

import Image from "next/image";
import Link from "next/link";
import TextEngine from "spring-text-engine";
import { easings } from "@react-spring/web";

import { Inview } from "@/components/animation/springs/in-view";
import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { Handle } from "@/components/animation/springs/handle";
import { CarouselDots } from "@/components/ui/carousel-dots";
import { StackedLines } from "@/components/ui/stacked-lines";
import { useCarousel } from "@/hooks/use-carousel";
import { useLoader } from "@/hooks/use-loader";
import { anchorScroll } from "@/utils/anchor-scroll";
import type { HeroContent, NavLink } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";

export interface HeroSectionProps {
  brand: string;
  navLeft: NavLink[];
  cta: string;
  hero: HeroContent;
}

export const HeroSection = ({ brand, navLeft, cta, hero }: HeroSectionProps) => {
  // Reveal animations wait behind the intro loader, then play in as it clears.
  const ready = useLoader((s) => s.ready);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-[calc(100svh-1rem)] min-h-[36rem] flex-col overflow-hidden rounded-card-lg bg-brand-deep text-on-brand sm:h-[calc(100svh-1.5rem)]"
    >
      {/* Parallax background plate */}
      <SpringTrigger
        tag="div"
        mode="scrub"
        from={{ y: "0%" }}
        to={{ y: "12%" }}
        className="absolute inset-0 -z-10"
        // Oversized + shifted up so the downward parallax (translateY up to 12%
        // of this layer's height) never exposes a gap at the top or bottom edge.
        innerClassName="absolute inset-x-0 -top-[16%] h-[132%] w-full"
      >
        <Image
          src={hero.backgroundImage}
          alt={hero.backgroundAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/65 via-brand-deep/35 to-brand-deep/75" />
      </SpringTrigger>

      <SiteHeader brand={brand} navLeft={navLeft} cta={cta} />

      {/* Giant title */}
      <div className="px-6 pt-4 sm:px-10">
        <TextEngine
          key={ready ? "title-on" : "title-off"}
          tag="h1"
          id="hero-title"
          mode="once"
          enabled={ready}
          overflow
          wordIn={{ y: "0%", opacity: 1 }}
          wordOut={{ y: "115%", opacity: 0 }}
          wordStagger={140}
          wordConfig={{ duration: 1100, easing: easings.easeOutExpo }}
          className="whitespace-nowrap text-[12.5vw] font-medium uppercase leading-[0.85] tracking-tight"
        >
          {hero.titleLines.join(" ")}
        </TextEngine>
      </div>

      {/* Bottom row: tagline + cards */}
      <div className="mt-auto flex flex-col items-start gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
        <StackedLines
          tag="p"
          lines={hero.taglineLines}
          enabled={ready}
          baseDelay={350}
          stagger={110}
          duration={900}
          className="text-[2.4rem] font-medium uppercase leading-[0.95] tracking-tight text-on-brand/85"
        />

        <div className="flex w-full items-end gap-4 sm:w-auto">
          <CollectionSlider collections={hero.collections} ready={ready} />
          <MembershipCard membership={hero.membership} ready={ready} />
        </div>
      </div>
    </section>
  );
};

const CollectionSlider = ({
  collections,
  ready,
}: {
  collections: HeroContent["collections"];
  ready: boolean;
}) => {
  const { index, go } = useCarousel(collections.length, {
    autoPlay: true,
    interval: 3800,
    enabled: ready,
  });
  const item = collections[index];

  return (
    <Inview
      tag="div"
      mode="once"
      enabled={ready}
      from={{ opacity: 0, y: 28 }}
      to={{ opacity: 1, y: 0 }}
      delayIn={650}
      config={{ tension: 200, friction: 26 }}
      className="hidden w-64 flex-col gap-3 md:flex"
    >
      {/* Handle caches the outgoing card and cross-fades it for the incoming one,
          so each auto-advance reads as "old card out, new card in". */}
      <Handle
        tag="div"
        from={{ opacity: 0, y: 16, scale: 0.96 }}
        to={{ opacity: 1, y: 0, scale: 1 }}
        config={{ tension: 210, friction: 24 }}
      >
        <article
          key={item.brand}
          className="flex items-center gap-3 rounded-card border border-on-brand/15 bg-on-brand/10 p-3 shadow-lg shadow-brand-deep/20 backdrop-blur-md"
        >
          <span className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="56px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.7rem] font-medium uppercase tracking-wide">
              {item.brand}
            </span>
            <span className="block text-[0.7rem] uppercase opacity-80">
              {item.title}
            </span>
            <Link
              href="#programs"
              onClick={anchorScroll("#programs")}
              className="mt-1 inline-block text-[0.65rem] underline underline-offset-2 opacity-90 outline-none hover:opacity-100 focus-visible:opacity-100"
            >
              {item.cta} →
            </Link>
          </span>
        </article>
      </Handle>
      <CarouselDots
        count={collections.length}
        active={index}
        onSelect={go}
        tone="light"
        label="Collection"
      />
    </Inview>
  );
};

const MembershipCard = ({
  membership,
  ready,
}: {
  membership: HeroContent["membership"];
  ready: boolean;
}) => (
  <Inview
    tag="article"
    mode="once"
    enabled={ready}
    from={{ opacity: 0, y: 28 }}
    to={{ opacity: 1, y: 0 }}
    delayIn={780}
    config={{ tension: 200, friction: 26 }}
    className="flex w-full max-w-xs items-stretch gap-3 rounded-card border border-on-brand/15 bg-on-brand/10 p-3 shadow-lg shadow-brand-deep/20 backdrop-blur-md sm:w-60"
  >
    <span className="flex flex-col justify-between">
      <span className="text-3xl font-medium leading-none">{membership.value}</span>
      <span className="flex -space-x-2">
        {["#5790e6", "#c2e029", "#0b6e97", "#ffffff"].map((c) => (
          <span
            key={c}
            className="size-5 rounded-pill border border-brand-deep/40"
            style={{ background: c }}
          />
        ))}
      </span>
      <span className="text-[0.65rem] opacity-80">{membership.caption}</span>
    </span>
    <span className="relative ml-auto aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xl">
      <Image
        src={membership.image}
        alt={membership.imageAlt}
        fill
        sizes="64px"
        className="object-cover"
      />
    </span>
  </Inview>
);
