"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/transition-link";
import { TESTIMONIALS, TESTIMONIALS_EN, type Testimonial } from "@/views/home/testimonials";

export interface CtaSectionProps {
  lang?: "es" | "en";
  heading: string;
  /** Second heading line, semi-transparent (like the hero subtitle). */
  headingFaded: string;
  button: string;
  href: string;
  /** Link under the carousel to the full set of LinkedIn recommendations. */
  reviewsLabel: string;
  reviewsHref: string;
}

/**
 * "Hagamos esa idea realidad" — a plain section after the pinned stage: the
 * heading + "Ver proyectos" on top, below it a carousel of plain white
 * testimonial cards (no border, no shadow), and a link to the LinkedIn
 * recommendations under that. The
 * background runs from the previous block's #FDFDFD down to white, so the two
 * sections meet without a seam.
 *
 * The carousel is a native horizontal scroller (trackpad / touch drag, snap per
 * card); the arrows step one card and grey out at either end.
 */
export function CtaSection({ lang = "es", heading, headingFaded, button, href, reviewsLabel, reviewsHref }: CtaSectionProps) {
  const items = lang === "en" ? TESTIMONIALS_EN : TESTIMONIALS;
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const start = t.scrollLeft <= 2;
    const end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    measure();
    t.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      t.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /** Step one card (card width + gap) in the given direction. */
  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    const card = t?.querySelector<HTMLElement>("[data-card]");
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    t.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const prevLabel = lang === "en" ? "Previous testimonial" : "Reseña anterior";
  const nextLabel = lang === "en" ? "Next testimonial" : "Siguiente reseña";
  const arrow = "flex size-[5.5vmin] max-sm:size-11 items-center justify-center rounded-full border border-sphere-ink/15 text-sphere-ink transition-opacity hover:bg-sphere-ink/5 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer";

  return (
    <section
      aria-label={lang === "en" ? "Contact" : "Contacto"}
      className="relative bg-linear-to-b from-sphere-surface to-white py-[14vmin] max-sm:py-20"
    >
      <div className="flex items-end justify-between gap-[5vmin] px-[4vmin] max-sm:flex-col max-sm:items-start max-sm:px-6">
        <div className="flex flex-col items-start gap-[3vmin] max-sm:gap-8">
          <h2 className="m-0 flex flex-col text-[7vw] max-sm:text-4xl font-normal leading-[0.95] tracking-[-0.03em] text-sphere-ink">
            <span>{heading}</span>
            <span className="opacity-40">{headingFaded}</span>
          </h2>
          <TransitionLink
            href={href}
            className="inline-flex items-center justify-center rounded-full bg-sphere-ink px-[4.6vmin] py-[2.2vmin] max-sm:px-7 max-sm:py-4 text-[2.3vmin] max-sm:text-base leading-none text-white transition-opacity hover:opacity-80"
          >
            {button}
          </TransitionLink>
        </div>

        <div className="flex gap-[1.2vmin] max-sm:gap-3">
          <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={prevLabel} className={arrow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[2.4vmin] max-sm:size-5" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label={nextLabel} className={arrow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[2.4vmin] max-sm:size-5" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-[7vmin] max-sm:mt-12 flex snap-x snap-mandatory gap-[2vmin] max-sm:gap-4 overflow-x-auto scroll-px-[4vmin] max-sm:scroll-px-6 px-[4vmin] max-sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </div>

      <div className="mt-[4vmin] max-sm:mt-8 px-[4vmin] max-sm:px-6">
        <a
          href={reviewsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[0.8vmin] max-sm:gap-2 text-[2vmin] max-sm:text-[15px] text-sphere-ink/70 transition-colors hover:text-sphere-ink"
        >
          {reviewsLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-[2vmin] max-sm:size-4 opacity-60" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article
      data-card=""
      className="flex w-[30vw] max-lg:w-[42vw] max-sm:w-[82vw] shrink-0 snap-start flex-col justify-between gap-[4vmin] max-sm:gap-8 bg-white p-[3.5vmin] max-sm:p-6 text-sphere-ink"
    >
      <p className="m-0 line-clamp-6 text-[2vmin] max-sm:text-[15px] font-light leading-[1.5] opacity-90">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-center gap-[1.8vmin] max-sm:gap-3">
        <div className="relative size-[5vmin] max-sm:size-11 shrink-0 overflow-hidden rounded-full bg-sphere-ink/5">
          {item.image && <Image src={item.image} alt={item.author} fill sizes="64px" className="object-cover" />}
        </div>
        <div className="flex flex-col">
          <strong className="text-[1.8vmin] max-sm:text-sm font-medium leading-tight">{item.author}</strong>
          <span className="text-[1.45vmin] max-sm:text-xs leading-tight opacity-60">{item.role}</span>
        </div>
      </div>
    </article>
  );
}
