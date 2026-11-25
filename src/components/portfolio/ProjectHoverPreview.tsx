"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import type { Project } from "@/data/portfolio";

/** Minimum time each gallery image stays on screen while hovering (ms). */
const FRAME_MS = 1400;
/** Cover: full quality. */
const COVER_SIZES = "(min-width: 768px) 92vw, 100vw";
/** Hover images: capped so a retina screen fetches at most the 1920 px file. */
const HOVER_SIZES = "(min-width: 768px) min(92vw, 960px), 100vw";
/** How many hover images download at the same time per project. */
const PRELOAD_CONCURRENCY = 2;
const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;

type Frame = { src: string; srcSet?: string; sizes: string };

/** Optimised (resized, WebP/AVIF) URLs via the Next image optimiser. */
function optimised(path: string, sizes: string): Frame {
  const { props } = getImageProps({
    src: path,
    alt: "",
    width: 1920,
    height: 1080,
    sizes,
    quality: 75,
  });
  return { src: props.src, srcSet: props.srcSet, sizes };
}

/** Download + decode a frame so showing it never flashes a blank. */
function loadFrame(frame: Frame): Promise<void> {
  const img = new Image();
  img.sizes = frame.sizes;
  if (frame.srcSet) img.srcset = frame.srcSet;
  img.src = frame.src;
  return img.decode().catch(() => undefined);
}

const IMG_CLASS =
  "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]";

/**
 * Work-page cover. Shows the project's cover; while the pointer is over it,
 * it steps through the project's gallery images in place (videos skipped) —
 * a straight cut, no animation — and goes back to the cover on leave.
 * All hover images preload in the background as the card nears the viewport,
 * and each is decoded before it's shown, so nothing flashes. Images come
 * from the Next optimiser (resized WebP/AVIF), not the original files.
 * Touch screens just see the cover.
 */
export function ProjectHoverPreview({ project }: { project: Project }) {
  const cover = project.previewImages[0];
  const frames = useMemo(() => {
    const gallery = project.images
      .map((img) => img.src)
      .filter((src) => IMAGE_EXT.test(src) && src !== cover);
    return [cover, ...Array.from(new Set(gallery))].map((src, i) =>
      optimised(`/proyectos/${project.folder}/${src}`, i === 0 ? COVER_SIZES : HOVER_SIZES),
    );
  }, [project.images, project.folder, cover]);

  const rootRef = useRef<HTMLDivElement>(null);
  const loads = useRef(new Map<number, Promise<void>>());
  const [hovering, setHovering] = useState(false);
  // `current` is on top; `under` (the previous image) stays beneath it so the
  // swap never shows a blank while the new <img> paints.
  const [{ current, under }, setLayers] = useState({ current: 0, under: -1 });

  const ensureLoaded = (i: number) => {
    let p = loads.current.get(i);
    if (!p) {
      p = loadFrame(frames[i]);
      loads.current.set(i, p);
    }
    return p;
  };

  const show = (next: number) =>
    setLayers((l) => (l.current === next ? l : { current: next, under: l.current }));

  // Background preload: once the card is near the viewport, download every
  // hover image in the order they'll be shown, PRELOAD_CONCURRENCY at a time,
  // so they're ready before the pointer arrives. Mouse/trackpad devices only,
  // and never when the visitor asked to save data.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || frames.length < 2) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const preloadAll = () => {
      let nextUp = 1;
      const worker = (): Promise<void> =>
        nextUp < frames.length ? ensureLoaded(nextUp++).then(worker) : Promise.resolve();
      for (let k = 0; k < PRELOAD_CONCURRENCY; k++) void worker();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadAll();
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  // While hovering: advance once FRAME_MS has passed *and* the next image is
  // ready; start loading the one after it straight away.
  useEffect(() => {
    if (!hovering || frames.length < 2) return;
    let cancelled = false;
    let timer = 0;
    const step = (at: number) => {
      const next = (at + 1) % frames.length;
      void ensureLoaded(next);
      const wait = new Promise<void>((r) => {
        timer = window.setTimeout(r, at === 0 ? 0 : FRAME_MS);
      });
      void Promise.all([wait, ensureLoaded(next)]).then(() => {
        if (cancelled) return;
        show(next);
        step(next);
      });
    };
    step(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering, frames]);

  return (
    <div
      ref={rootRef}
      className="relative aspect-[16/9] w-full overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        show(0);
      }}
    >
      {under >= 0 && (
        <img
          key={`under-${under}`}
          src={frames[under].src}
          srcSet={frames[under].srcSet}
          sizes={frames[under].sizes}
          alt=""
          aria-hidden
          decoding="async"
          className={IMG_CLASS}
        />
      )}
      <img
        key={`top-${current}`}
        src={frames[current].src}
        srcSet={frames[current].srcSet}
        sizes={frames[current].sizes}
        alt={project.title}
        loading={current === 0 && under < 0 ? "lazy" : "eager"}
        decoding="async"
        className={IMG_CLASS}
      />
    </div>
  );
}
