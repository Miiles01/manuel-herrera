"use client";

import { animated, type SpringValue } from "@react-spring/web";
import { memo } from "react";
import { ParticleSphere } from "@/components/3d/particle-sphere";
import { ScrollLetters } from "@/views/home/scroll-letters";
import {
  blackScreenTransform,
  sphereSceneTransform,
  starMaskSize,
  starPanelColor,
  sphereLogoTransform,
  sphereLogoOpacity,
  phase4,
  sphereScale,
  sphereDisperse,
  sphereBodyReveal,
  blockLetterStyle,
} from "@/utils/showreel/timeline";

export interface SphereCardProps {
  p: SpringValue<number>;
  headingTop: string;
  headingBottom: string[];
  /** Supporting paragraphs shown in the open sphere scene. */
  body: string[];
  star: string;
  /** Whether the sphere scene is on-screen — gates its render loop. */
  active?: boolean;
}

/**
 * The star → sphere scene. A star-masked black panel (300vw) is centred on the
 * hero photo; it appears, spins and grows to fill the screen, revealing the
 * particle sphere and a white star logo. Block headings rise into focus on scroll.
 */
// `memo` so the stage's visibility re-renders (when an unrelated scene flag
// flips) don't re-render the sphere and re-create its springs.
export const SphereCard = memo(({
  p,
  headingTop,
  headingBottom,
  body,
  star,
  active = true,
}: SphereCardProps) => {
  const maskStyle = {
    WebkitMaskImage: `url(${star})`,
    maskImage: `url(${star})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as const;

  // Block heading is one shared stagger across all three lines (Beyond/all/limits).
  const topLen = [...headingTop].filter((c) => c !== " ").length;
  const lineLens = headingBottom.map((l) => [...l].filter((c) => c !== " ").length);
  const total = topLen + lineLens.reduce((a, b) => a + b, 0);
  const offsets = [topLen];
  lineLens.slice(0, -1).forEach((len, i) => offsets.push(offsets[i] + len));

  return (
    <div className="size-full">
      {/* The star mask reveals this panel: black as the star starts growing,
          turning near-white (--sphere-surface) — the backdrop of the "Piensa
          diferente" block, with dark ink on top (starPanelColor). The corner
          aurora (pinned, behind the sticky stage) shows through the star's
          concave corners during the reveal. */}
      <animated.div
        className="absolute left-1/2 top-1/2 h-[300vh] w-[300vw]"
        style={{
          ...maskStyle,
          WebkitMaskSize: p.to(starMaskSize),
          maskSize: p.to(starMaskSize),
          transform: p.to(blackScreenTransform),
          backgroundColor: p.to(starPanelColor),
        }}
      >
        <animated.div
          className="absolute left-1/2 top-1/2 h-screen w-screen"
          style={{
            transform: p.to(sphereSceneTransform),
          }}
        >
          {/* Sphere shell: shrinks (sphereScale) as it collapses while the star
              logo grows; particles also scatter (sphereDisperse) into the
              portfolio transition. */}
          

          <animated.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-[3] h-[12vh] w-[12vh] bg-sphere-ink"
            style={{
              ...maskStyle,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              transform: p.to(sphereLogoTransform),
              opacity: p.to(v => {
                const baseOpacity = sphereLogoOpacity(v);
                const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
                if (isMobile) {
                  // On mobile, fade out as the mask expands (phase 4)
                  return baseOpacity * (1 - phase4(v));
                }
                return baseOpacity;
              }),
            }}
          />

          <h2 className="pointer-events-none absolute bottom-[4vmin] right-[4vmin] z-[4] m-0 flex flex-col items-end whitespace-nowrap text-right text-[var(--sr-heading-2)] font-normal leading-[0.85] text-sphere-ink max-sm:bottom-auto max-sm:right-auto max-sm:left-[6vw] max-sm:top-[14vh] max-sm:items-start max-sm:text-left">
            {headingBottom.map((line, i) => (
              <span key={i}>
                <ScrollLetters
                  text={line}
                  p={p}
                  styleFn={blockLetterStyle}
                  indexOffset={offsets[i]}
                  totalOverride={total}
                />
              </span>
            ))}
          </h2>

          {/* Supporting copy — bottom-left, fades/rises in just after the
              headings land. */}
          <animated.div
            className="pointer-events-none absolute bottom-[5vmin] left-[4vmin] z-[4] flex max-w-[var(--sr-sphere-body-w)] flex-col gap-[1.8vmin] text-left text-[var(--sr-sphere-body-text)] font-light leading-[1.45] text-sphere-ink"
            style={{
              opacity: p.to(sphereBodyReveal),
              transform: p.to((v) => `translateY(${(1 - sphereBodyReveal(v)) * 2.5}vmin)`),
            }}
          >
            {body.map((para, i) => (
              <p key={i} className="m-0" dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </animated.div>
        </animated.div>
      </animated.div>
    </div>
  );
});
SphereCard.displayName = "SphereCard";
