"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import type { Project } from "@/data/portfolio";

/** Minimum time each gallery image stays on screen while hovering (ms). */
const FRAME_MS = 1400;
/** Fade-in of each new image over the previous one (ms). */
const FADE_MS = 500;
const SIZES = "(min-width: 768px) 92vw, 100vw";
const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;

type Frame = { src: string; srcSet?: string };

/** Optimised (resized, WebP/AVIF) URLs via the Next image optimiser. */
function optimised(path: string): Frame {
  const { props } = getImageProps({
    src: path,
    alt: "",
    width: 1920,
    height: 1080,
    sizes: SIZES,
    quality: 75,
  });
  return { src: props.src, srcSet: props.srcSet };
}

/** Download + decode a frame so showing it never flashes a blank. */
function loadFrame(frame: Frame): Promise<void> {
  const img = new Image();
  img.sizes = SIZES;
  if (frame.srcSet) img.srcset = frame.srcSet;
  img.src = frame.src;
  return img.decode().catch(() => undefined);
}

const IMG_CLASS =
  "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]";

/**
 * Work-page cover. Shows the project's cover; while the pointer is over it,
 * it steps through the project's gallery images in place (videos skipped),
 * each one fading in over the last, and fades back to the cover on leave.
 * The next image is always downloaded and decoded before it's shown — and
 * the one after starts loading right away — so nothing flashes. Images come
 * from the Next optimiser (resized WebP/AVIF), not the original files.
 * Touch screens just see the cover.
 */
export function ProjectHoverPreview({ project }: { project: Project }) {
  const cover = project.previewImages[0];
  const frames = useMemo(() => {
    const gallery = project.images
      .map((img) => img.src)
      .filter((src) => IMAGE_EXT.test(src) && src !== cover);
    return [cover, ...Array.from(new Set(gallery))].map((src) =>
      optimised(`/proyectos/${project.folder}/${src}`),
    );
  }, [project.images, project.folder, cover]);

  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLImageElement>(null);
  const loads = useRef(new Map<number, Promise<void>>());
  const [hovering, setHovering] = useState(false);
  // `current` is on top; `under` stays fully opaque beneath it while it fades in.
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

  // Warm up the first hover image once the card is near the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || frames.length < 2) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void ensureLoaded(1);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
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

  // Fade the new top image in over the one underneath.
  useEffect(() => {
    const el = topRef.current;
    if (!el || under < 0) return;
    const anim = el.animate(
      { opacity: [0, 1] },
      { duration: FADE_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "backwards" },
    );
    return () => anim.cancel();
  }, [current, under]);

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
          sizes={SIZES}
          alt=""
          aria-hidden
          decoding="async"
          className={IMG_CLASS}
        />
      )}
      <img
        key={`top-${current}`}
        ref={topRef}
        src={frames[current].src}
        srcSet={frames[current].srcSet}
        sizes={SIZES}
        alt={project.title}
        loading={current === 0 && under < 0 ? "lazy" : "eager"}
        decoding="async"
        className={IMG_CLASS}
      />
    </div>
  );
}
