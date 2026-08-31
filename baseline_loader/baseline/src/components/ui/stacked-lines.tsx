"use client";

import type { ElementType } from "react";
import TextEngine from "spring-text-engine";
import { easings } from "@react-spring/web";

import type { Tags } from "@/types/springs";

export interface StackedLinesProps {
  /** Semantic element for the heading/paragraph container. */
  tag?: Tags;
  id?: string;
  /** Each entry renders on its own clipped line and animates independently. */
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Delay between consecutive lines, in ms. */
  stagger?: number;
  /** Delay before the first line, in ms. */
  baseDelay?: number;
  duration?: number;
  /** Master switch — hold the reveal until `true` (e.g. behind the loader). */
  enabled?: boolean;
}

/**
 * Stacked, line-by-line text reveal. Each line is an independent
 * `spring-text-engine` instance so the line breaks are explicit (not at the
 * mercy of greedy wrapping) while still getting the clipped slide-up reveal.
 */
export const StackedLines = ({
  tag = "div",
  id,
  lines,
  className,
  lineClassName,
  stagger = 120,
  baseDelay = 0,
  duration = 950,
  enabled = true,
}: StackedLinesProps) => {
  const Tag = tag as ElementType;
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <TextEngine
          key={`${enabled ? "on" : "off"}-${line}`}
          tag="span"
          mode="once"
          enabled={enabled}
          overflow
          lineIn={{ y: "0%", opacity: 1 }}
          lineOut={{ y: "115%", opacity: 0 }}
          lineConfig={{ duration, easing: easings.easeOutExpo }}
          delayIn={baseDelay + i * stagger}
          // Bottom padding keeps descenders (y, p, g) from being clipped by the
          // overflow-hidden line wrapper used for the slide-up reveal.
          lineClassName="pb-[0.14em]"
          className={`block whitespace-nowrap ${lineClassName ?? ""}`}
        >
          {line}
        </TextEngine>
      ))}
    </Tag>
  );
};
