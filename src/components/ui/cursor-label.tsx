"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Text cursor ("Ver"): over marked elements the mouse pointer is replaced by a
 * word that follows it — white with `mix-blend-difference` (like the navbar
 * logo), so it inverts whatever image is under it and always reads.
 *
 * - `<CursorLabel />` handles any element marked `data-cursor-label="Ver"`
 *   (the work page's project images): plain hover, the label shows that value.
 * - The home's scroll gallery can't use hover (a layer above it takes the
 *   pointer), so it hit-tests itself and reuses `CURSOR_LABEL_CLASS` +
 *   `fadeCursorLabel` to look and move the same.
 *
 * `html.cursor-label` hides the system cursor (globals.css). Mouse / trackpad
 * only — touch screens get nothing.
 */

export const CURSOR_LABEL_CLASS =
  "pointer-events-none fixed left-0 top-0 z-[45] whitespace-nowrap text-[6vmin] font-normal leading-none tracking-[-0.03em] text-white mix-blend-difference";

const fades = new WeakMap<HTMLElement, Animation>();

/** Fade only (no scale): in 0.4s, out 0.5s — from wherever it is now. */
export function fadeCursorLabel(label: HTMLElement, target: 0 | 1) {
  const from = Number(getComputedStyle(label).opacity);
  fades.get(label)?.cancel();
  fades.set(
    label,
    label.animate(
      { opacity: [from, target] },
      { duration: target ? 400 : 500, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    ),
  );
}

export function moveCursorLabel(label: HTMLElement, x: number, y: number) {
  label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

export const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Hover-driven label for `[data-cursor-label]` elements. */
export function CursorLabel() {
  const labelRef = useRef<HTMLDivElement>(null);
  // Portal only after mount: the server renders nothing here, so rendering the
  // portal during hydration would be a mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !canHover()) return;
    const label = labelRef.current;
    if (!label) return;
    const root = document.documentElement;
    let current: Element | null = null;

    const onMove = (e: PointerEvent) => {
      moveCursorLabel(label, e.clientX, e.clientY);
      const host = (e.target as Element | null)?.closest?.("[data-cursor-label]") ?? null;
      if (host === current) return;
      current = host;
      if (host) label.textContent = host.getAttribute("data-cursor-label");
      root.classList.toggle("cursor-label", !!host);
      fadeCursorLabel(label, host ? 1 : 0);
    };
    const onLeave = () => {
      if (!current) return;
      current = null;
      root.classList.remove("cursor-label");
      fadeCursorLabel(label, 0);
    };
    // A click navigates (page transition): let the label fade with the page.
    const onClick = () => {
      if (current) root.classList.remove("cursor-label");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
      root.classList.remove("cursor-label");
    };
  }, [mounted]);

  if (!mounted) return null;
  return createPortal(
    <div ref={labelRef} aria-hidden="true" className={CURSOR_LABEL_CLASS} style={{ opacity: 0 }} />,
    document.body,
  );
}
