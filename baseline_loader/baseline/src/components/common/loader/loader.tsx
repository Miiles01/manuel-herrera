"use client";

import { useEffect, useRef, useState } from "react";
import { easings } from "@react-spring/web";

import { Spring } from "@/components/animation/springs/spring";
import { BrandMark } from "@/components/ui/brand-mark";
import { useLoader } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

export interface LoaderProps {
  /** Wordmark shown while the page loads. */
  brand?: string;
}

/** Minimum on-screen time so the loader never flashes on a fast load. */
const MIN_VISIBLE_MS = 1400;
/** Hard cap so a slow asset can't trap the visitor behind the curtain. */
const MAX_VISIBLE_MS = 2600;
/** Matches the curtain slide-up config below. */
const EXIT_MS = 850;

/**
 * Simple intro curtain. Covers the page on first paint, fills a slim progress
 * bar, then slides up to reveal the content. The moment it starts leaving it
 * flips the shared `ready` flag so the hero's reveal animations play in behind
 * it — never while hidden. All motion is spring-based ([[animation-system]]).
 */
export const Loader = ({ brand = "Baseline" }: LoaderProps) => {
  const setReady = useLoader((s) => s.setReady);
  const startScroll = useScroll((s) => s.start);
  const stopScroll = useScroll((s) => s.stop);

  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    stopScroll();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const minVisible = reduced ? 200 : MIN_VISIBLE_MS;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const triggerExit = () => {
      setExiting(true);
      setReady(true);
      startScroll();
      timers.push(setTimeout(() => setDone(true), reduced ? 0 : EXIT_MS));
    };

    const beginCountdown = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      timers.push(setTimeout(triggerExit, minVisible));
    };

    if (document.readyState === "complete") {
      beginCountdown();
    } else {
      window.addEventListener("load", beginCountdown, { once: true });
      // Don't wait forever on a stalled asset.
      timers.push(setTimeout(beginCountdown, MAX_VISIBLE_MS));
    }

    return () => {
      window.removeEventListener("load", beginCountdown);
      timers.forEach(clearTimeout);
    };
  }, [setReady, startScroll, stopScroll]);

  if (done) return null;

  return (
    <Spring
      tag="div"
      enabled={exiting}
      from={{ y: "0%" }}
      to={{ y: "-105%" }}
      config={{ duration: EXIT_MS, easing: easings.easeInOutCubic }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-brand-deep text-on-brand"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Spring
        tag="span"
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 200, friction: 22 }}
        className="flex items-center gap-3 text-2xl font-medium uppercase tracking-[0.2em]"
      >
        <BrandMark className="size-7" title={`${brand} logo`} />
        {brand}
      </Spring>

      <span className="h-px w-40 overflow-hidden rounded-pill bg-on-brand/20">
        <Spring
          tag="span"
          from={{ scaleX: 0 }}
          to={{ scaleX: 1 }}
          delayIn={120}
          config={{ duration: MIN_VISIBLE_MS - 120, easing: easings.easeInOutCubic }}
          style={{ transformOrigin: "left center" }}
          className="block h-full w-full bg-on-brand"
        />
      </span>
    </Spring>
  );
};
