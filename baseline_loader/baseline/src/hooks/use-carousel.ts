"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Carousel {
  index: number;
  next: () => void;
  prev: () => void;
  go: (index: number) => void;
}

export interface CarouselOptions {
  /** Auto-advance to the next slide on an interval. */
  autoPlay?: boolean;
  /** Interval between auto-advances, in ms. */
  interval?: number;
  /** Hold autoplay until this is true (e.g. wait for the loader to finish). */
  enabled?: boolean;
}

/**
 * Minimal wrap-around carousel index state. Manual by default; pass
 * `{ autoPlay: true }` for an infinite, self-advancing loop. A manual `next` /
 * `prev` / `go` resets the autoplay timer so the slide the user picks gets a
 * full dwell before the loop resumes.
 */
export const useCarousel = (
  count: number,
  { autoPlay = false, interval = 4000, enabled = true }: CarouselOptions = {},
): Carousel => {
  const [index, setIndex] = useState(0);
  // Bumping this restarts the autoplay effect, giving each manual jump a full dwell.
  const [tick, setTick] = useState(0);

  const next = useCallback(() => {
    setIndex((p) => (p + 1) % count);
    setTick((t) => t + 1);
  }, [count]);
  const prev = useCallback(() => {
    setIndex((p) => (p - 1 + count) % count);
    setTick((t) => t + 1);
  }, [count]);
  const go = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
      setTick((t) => t + 1);
    },
    [count],
  );

  // Keep the latest index reachable from the interval without it being a
  // dependency (which would clear/restart the timer on every advance).
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!autoPlay || !enabled || count <= 1) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % count),
      interval,
    );
    return () => clearInterval(id);
  }, [autoPlay, enabled, count, interval, tick]);

  return { index, next, prev, go };
};
