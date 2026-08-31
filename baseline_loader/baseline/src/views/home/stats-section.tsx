"use client";

import { Inview } from "@/components/animation/springs/in-view";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StackedLines } from "@/components/ui/stacked-lines";
import type { StatItem, StatsContent } from "@/data/mocks/home";

export interface StatsSectionProps {
  stats: StatsContent;
}

export const StatsSection = ({ stats }: StatsSectionProps) => (
  <section
    aria-labelledby="stats-title"
    className="mt-3 rounded-card-lg bg-brand-deep px-6 py-20 text-on-brand sm:px-10"
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow tone="light">{stats.eyebrow}</Eyebrow>
        <StackedLines
          tag="h2"
          id="stats-title"
          lines={stats.titleLines}
          className="mt-4 text-5xl font-medium leading-[0.95] tracking-tight"
        />
      </div>
    </div>

    <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
      {stats.stats.map((stat, i) => (
        <StatCell key={stat.label} stat={stat} index={i} />
      ))}
    </dl>
  </section>
);

const StatCell = ({ stat, index }: { stat: StatItem; index: number }) => (
  <Inview
    tag="div"
    mode="once"
    from={{ opacity: 0, y: 30 }}
    to={{ opacity: 1, y: 0 }}
    delayIn={index * 110}
    config={{ tension: 180, friction: 24 }}
    className="border-t border-on-brand/20 pt-5"
  >
    <dt className="sr-only">{stat.label}</dt>
    <dd>
      <span className="block text-6xl font-medium tracking-tight sm:text-7xl">
        {stat.value}
      </span>
      <span className="mt-3 block text-sm text-on-brand/65">{stat.label}</span>
    </dd>
  </Inview>
);
