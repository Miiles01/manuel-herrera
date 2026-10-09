"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { memo, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/hooks/use-page-transition";
import { CURSOR_LABEL_CLASS, canHover, fadeCursorLabel, moveCursorLabel } from "@/components/ui/cursor-label";
import {
  galleryScale,
  galleryOpacity,
  galleryEnterTransform,
  galleryIndex,
  galleryLabelOpacity,
  galleryCursorActive,
} from "@/utils/showreel/timeline";

export interface ScrollGalleryProps {
  p: SpringValue<number>;
  left: string;
  right: string;
  /** Word shown instead of the mouse cursor over the frame. */
  cursor: string;
  /** Where a click on the frame goes (with the page transition). */
  href: string;
  images: string[];
}

/** The frame at full size is the whole screen (the last cover is full-bleed). */
const FRAME_W = "100vw";
const FRAME_H = "100dvh";
/** Half the frame's full width, as a CSS length. */
const HALF_W = "50vw";

/**
 * Scroll gallery under the hero (after Haven's "ScrollGallery"): the section
 * scrolls in from below as the hero leaves, then pins while a frame in the
 * centre grows from small to the full screen and project covers flick
 * through it; two labels sit at its sides, sliding outwards as it grows. The star
 * (SphereCard, above this layer) appears on the last cover. Everything is a pure
 * function of the stage spring `p`.
 */
export const ScrollGallery = memo(({ p, left, right, cursor, href, images }: ScrollGalleryProps) => {
  const router = useRouter();
  const frameRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Custom cursor over the frame: the star layer sits above the gallery and
  // takes the pointer events, so instead of :hover we hit-test the frame's box
  // against the last pointer position — on every move and on scroll (the frame
  // grows under a still mouse). A click while it shows goes to `href` through
  // the page transition. Mouse/trackpad only — phones get neither.
  useEffect(() => {
    if (!canHover()) return;
    const root = document.documentElement;
    let x = -1, y = -1, on = false, raf = 0, warmed = false;
    const fadeTo = (target: 0 | 1) => {
      if (cursorRef.current) fadeCursorLabel(cursorRef.current, target);
    };

    const update = () => {
      raf = 0;
      const frame = frameRef.current, label = cursorRef.current;
      if (!frame || !label) return;
      const r = frame.getBoundingClientRect();
      const overFrame = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && galleryCursorActive(p.get());
      // Whatever is actually on top under the pointer must belong to this stage:
      // over the navbar, its open menu or the language panel the normal cursor
      // wins. (The "Ver" label is pointer-events: none, so it's never the hit.)
      const stage = frame.closest(".sticky");
      const hit = overFrame ? document.elementFromPoint(x, y) : null;
      const inside = overFrame && !!hit && !!stage?.contains(hit);
      moveCursorLabel(label, x, y);
      if (inside === on) return;
      on = inside;
      root.classList.toggle("cursor-label", on);
      // First time "Ver" shows, warm the work page so a click slides right away.
      if (on && !warmed) { warmed = true; router.prefetch(href); }
      fadeTo(on ? 1 : 0);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onMove = (e: PointerEvent) => { x = e.clientX; y = e.clientY; schedule(); };
    const onLeave = () => { x = -1; y = -1; schedule(); };
    const onClick = (e: MouseEvent) => {
      if (!on) return;
      e.preventDefault();
      on = false;
      root.classList.remove("cursor-label");
      fadeTo(0); // the label fades out while the page transition starts
      usePageTransition.getState().startTransition(href);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("cursor-label");
    };
  }, [p, href, router]);

  // Label widths (px), measured after mount, so each label can fade out just
  // before it would touch the screen edge — never cut off, on any screen size.
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const labelW = useRef({ left: 0, right: 0 });
  useEffect(() => {
    const measure = () => {
      labelW.current = { left: leftRef.current?.offsetWidth ?? 0, right: rightRef.current?.offsetWidth ?? 0 };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const s = useMemo(() => {
    const count = images.length;
    /** 1 while the label has room, fading to 0 over the last 24px before the edge. */
    const edgeFade = (v: number, w: number) => {
      const vw = window.innerWidth;
      const gap = 0.03 * Math.min(vw, window.innerHeight); // 3vmin
      const room = vw / 2 - (vw / 2) * galleryScale(v) - gap - w;
      return Math.max(0, Math.min(1, room / 24));
    };
    // Label offsets track the frame's edge: centre ± (half width × scale) + gap.
    const edgeX = (v: number) => `calc(${HALF_W} * ${galleryScale(v)} + 3vmin)`;
    return {
      frame: p.to((v) => `translate(-50%, -50%) scale(${galleryScale(v)})`),
      opacity: p.to(galleryOpacity),
      enter: p.to(galleryEnterTransform),
      leftOpacity: p.to((v) => galleryLabelOpacity(v) * edgeFade(v, labelW.current.left)),
      rightOpacity: p.to((v) => galleryLabelOpacity(v) * edgeFade(v, labelW.current.right)),
      cover: images.map((_, i) => p.to((v) => (galleryIndex(v, count) === i ? 1 : 0))),
      left: p.to((v) => `translate(calc(-100% - ${edgeX(v)}), -50%)`),
      right: p.to((v) => `translate(${edgeX(v)}, -50%)`),
    };
  }, [p, images]);

  const label = "pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap text-gray-900";

  return (
    <animated.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity: s.opacity, transform: s.enter }}
    >
      <animated.div
        ref={frameRef}
        className="absolute left-1/2 top-1/2 overflow-hidden bg-gray-100"
        style={{ width: FRAME_W, height: FRAME_H, transform: s.frame }}
      >
        {images.map((src, i) => (
          <animated.div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})`, opacity: s.cover[i] }}
          />
        ))}
      </animated.div>

      <animated.span
        className={`${label} text-[7vmin] font-normal leading-none tracking-[-0.03em]`}
        ref={leftRef}
        style={{ transform: s.left, opacity: s.leftOpacity }}
      >
        {left}
      </animated.span>
      <animated.span
        className={`${label} text-[7vmin] font-normal leading-none tracking-[-0.03em]`}
        ref={rightRef}
        style={{ transform: s.right, opacity: s.rightOpacity }}
      >
        {right}
      </animated.span>
      {/* The "Ver" cursor lives on <body>: the stage's transforms would
          otherwise turn its position: fixed into a local one. White with
          mix-blend-difference (like the navbar logo), so it inverts whatever
          cover passes under it and always reads. */}
      {createPortal(
        <div
          ref={cursorRef}
          aria-hidden="true"
          className={CURSOR_LABEL_CLASS}
          style={{ opacity: 0 }}
        >
          {cursor}
        </div>,
        document.body,
      )}
    </animated.div>
  );
});
ScrollGallery.displayName = "ScrollGallery";
