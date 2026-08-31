"use client";

import { useRef } from "react";
import Link from "next/link";

import { Inview } from "@/components/animation/springs/in-view";
import { Hover } from "@/components/animation/springs/hover";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StackedLines } from "@/components/ui/stacked-lines";
import type { Program, ProgramsContent } from "@/data/mocks/home";

export interface ProgramsSectionProps {
  programs: ProgramsContent;
}

export const ProgramsSection = ({ programs }: ProgramsSectionProps) => (
  <section
    id="programs"
    aria-labelledby="programs-title"
    className="bg-surface px-6 py-24 sm:px-10"
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow>{programs.eyebrow}</Eyebrow>
        <StackedLines
          tag="h2"
          id="programs-title"
          lines={programs.titleLines}
          className="mt-4 text-5xl font-medium leading-[0.95] tracking-tight"
        />
      </div>
    </div>

    <ul className="mt-14">
      {programs.programs.map((program, i) => (
        <ProgramRow key={program.index} program={program} index={i} />
      ))}
    </ul>
  </section>
);

const ProgramRow = ({ program, index }: { program: Program; index: number }) => {
  const rowRef = useRef<HTMLAnchorElement>(null);
  return (
    <li>
      <Link
        ref={rowRef}
        href={program.href}
        className="block border-t border-hairline outline-none last:border-b focus-visible:bg-background"
      >
        <Inview
          tag="div"
          mode="once"
          from={{ opacity: 0, y: 26 }}
          to={{ opacity: 1, y: 0 }}
          delayIn={index * 90}
          config={{ tension: 190, friction: 26 }}
          className="flex items-center gap-6 py-7"
        >
          <span className="w-10 text-sm font-medium text-ink-soft">
            {program.index}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-2xl font-medium tracking-tight sm:text-3xl">
              {program.name}
            </span>
            <span className="mt-1 block text-sm text-ink-soft">
              {program.description}
            </span>
          </span>
          <Hover
            tag="span"
            trigger={rowRef}
            from={{ x: 0, opacity: 0.55 }}
            to={{ x: 8, opacity: 1 }}
            config={{ tension: 300, friction: 20 }}
            className="grid size-11 shrink-0 place-items-center rounded-pill border border-hairline text-ink"
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
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Hover>
        </Inview>
      </Link>
    </li>
  );
};
