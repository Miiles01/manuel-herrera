"use client";

import Image from "next/image";
import TextEngine from "spring-text-engine";
import { easings } from "@react-spring/web";

import { Inview } from "@/components/animation/springs/in-view";
import { Hover } from "@/components/animation/springs/hover";
import { StackedLines } from "@/components/ui/stacked-lines";
import type { CourtCard, FacilitiesContent } from "@/data/mocks/home";

export interface FacilitiesSectionProps {
  facilities: FacilitiesContent;
}

export const FacilitiesSection = ({ facilities }: FacilitiesSectionProps) => (
  <section
    id="facilities"
    aria-labelledby="facilities-title"
    className="relative -mt-10 rounded-card-lg bg-background px-6 pb-20 pt-16 sm:px-10"
  >
    <div className="grid items-end gap-10 md:grid-cols-2">
      {/* Intro column */}
      <div className="max-w-sm">
        <Inview
          tag="span"
          mode="once"
          from={{ opacity: 0, scale: 0.85 }}
          to={{ opacity: 1, scale: 1 }}
          config={{ tension: 240, friction: 20 }}
          className="relative block size-16 overflow-hidden rounded-card"
        >
          <Image
            src={facilities.icon}
            alt={facilities.iconAlt}
            fill
            sizes="64px"
            className="object-cover"
          />
        </Inview>

        <StackedLines
          tag="h2"
          id="facilities-title"
          lines={facilities.titleLines}
          stagger={120}
          className="mt-6 text-5xl font-medium leading-[0.95] tracking-tight"
        />

        <TextEngine
          tag="p"
          mode="once"
          wordIn={{ y: 0, opacity: 1 }}
          wordOut={{ y: 18, opacity: 0 }}
          wordStagger={28}
          delayIn={250}
          wordConfig={{ duration: 700, easing: easings.easeOutQuart }}
          className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft"
        >
          {facilities.body}
        </TextEngine>
      </div>

      {/* Court cards */}
      <div className="flex items-end gap-5">
        {facilities.courts.map((court, i) => (
          <CourtTile key={court.name} court={court} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const CourtTile = ({ court, index }: { court: CourtCard; index: number }) => (
  <Inview
    tag="figure"
    mode="once"
    from={{ opacity: 0, y: 48 }}
    to={{ opacity: 1, y: 0 }}
    delayIn={index * 140}
    config={{ tension: 180, friction: 26 }}
    className={`flex-1 ${index === 1 ? "mb-8" : ""}`}
  >
    <Hover
      tag="div"
      from={{ scale: 1 }}
      to={{ scale: 1.03 }}
      config={{ tension: 300, friction: 22 }}
      className="relative block aspect-[3/4] overflow-hidden rounded-card bg-surface"
    >
      <Image
        src={court.image}
        alt={court.imageAlt}
        fill
        sizes="(max-width: 768px) 50vw, 20rem"
        className="object-cover"
      />
      <figcaption
        className={`absolute inset-x-3 bottom-3 rounded-xl px-4 py-3 backdrop-blur-md ${
          court.tone === "blue"
            ? "bg-accent-teal/55 text-on-brand"
            : "bg-brand-deep/40 text-on-brand"
        }`}
      >
        <span className="block text-sm font-medium">{court.name}</span>
        <span className="mt-0.5 block text-[0.65rem] leading-snug opacity-85">
          {court.description}
        </span>
      </figcaption>
    </Hover>
  </Inview>
);
