"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/portfolio";

/** How long each gallery image stays on screen while hovering (ms). */
const FRAME_MS = 450;
const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;

/**
 * Work-page cover. Shows the project's cover; while the pointer is over it,
 * it flips through the project's gallery images in place (videos skipped),
 * and returns to the cover on leave. Touch screens just see the cover.
 */
export function ProjectHoverPreview({ project }: { project: Project }) {
  const cover = project.previewImages[0];
  const frames = useMemo(() => {
    const gallery = project.images
      .map((img) => img.src)
      .filter((src) => IMAGE_EXT.test(src) && src !== cover);
    return [cover, ...Array.from(new Set(gallery))];
  }, [project.images, cover]);

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const preloaded = useRef(false);

  useEffect(() => {
    if (!hovering || frames.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [hovering, frames.length]);

  const start = () => {
    if (!preloaded.current) {
      preloaded.current = true;
      frames.forEach((src) => {
        const img = new Image();
        img.src = `/proyectos/${project.folder}/${src}`;
      });
    }
    setIndex(frames.length > 1 ? 1 : 0);
    setHovering(true);
  };

  const stop = () => {
    setHovering(false);
    setIndex(0);
  };

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden"
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <img
        loading="lazy"
        decoding="async"
        src={`/proyectos/${project.folder}/${frames[index]}`}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}
