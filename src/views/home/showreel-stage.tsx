"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShowreelLayout } from "@/hooks/use-showreel-layout";
import { ProgressTrigger } from "@/components/animation/springs/progress-trigger";
import { HeroCard } from "@/views/home/hero-card";
import { SphereCard } from "@/views/home/sphere-card";
import { ScrollGallery } from "@/views/home/scroll-gallery";
import type { ShowreelContent } from "@/data/mocks/home";
import {
  HERO_CARD_WIDTH,
  HERO_CARD_HEIGHT,
  card1Opacity,
  heroCardTransform,
  card4Opacity,
  stageBackdropOpacity,
  sceneVisibility,
  type SceneVisibility,
} from "@/utils/showreel/timeline";

const A = "/assets/showreel";

export interface ShowreelStageProps {
  content: ShowreelContent;
}

/**
 * The scroll-driven core. ONE spring (`p`, 0→1) is scrubbed by a single
 * `ProgressTrigger` off the tall track; every scene reads `p.to(selector)` from
 * the timeline. A sticky stage pins the 3D scene while the track scrolls:
 * hero (photo) → scroll gallery growing from the centre → star that grows over
 * the screen → "Piensa diferente". The CTA is a normal section after the stage
 * (home.tsx); the featured carousel, image grid and camera flight were removed.
 */
export const ShowreelStage = ({ content }: ShowreelStageProps) => {
  // Mount client-only. The stage is a wall of react-spring `animated.div`s whose
  // SSR'd values (transforms/opacities) never match the client's first frame —
  // that mismatch makes React discard the server tree and re-render the whole
  // page (a visible flash). It's hidden behind the loader anyway, so deferring
  // its render one tick removes every hydration mismatch with no UX cost.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Active responsive geometry. Drives the `--sr-*` CSS vars (written onto the
  // document root by the hook) consumed by the card/sphere sizing + the timeline
  // string builders; `geo` is passed to the sphere's JS-math counter-scales.
  const { geo } = useShowreelLayout();

  const trackRef = useRef<HTMLDivElement>(null);
  const [{ p }, api] = useSpring(() => ({ p: 0 }));

  // Interpolations are created ONCE and kept stable across re-renders. The
  // visibility `setVis` below re-renders this component a handful of times per
  // scroll; if the `p.to(...)` selectors were created inline they'd be fresh
  // instances every render, and react-spring would detach/reattach them — a
  // one-frame reset where the whole camera-rig (and every grid image under it)
  // visibly "teleports" and snaps back. Memoising keeps each `animated.div`
  // bound to the same value, so a re-render never disturbs the live transforms.
  const s = useMemo(
    () => ({
      backdrop: p.to(stageBackdropOpacity),
      card1Opacity: p.to(card1Opacity),
      heroCard: p.to(heroCardTransform),
      card4Opacity: p.to(card4Opacity),
    }),
    [p],
  );

  // Which scenes are on-screen. Recomputed every scroll frame but only committed
  // to state when a flag flips, so the (cheap) re-render happens a handful of
  // times per full scroll — not every frame. Each flag gates one canvas's
  // render loop (`frameloop`), so off-screen WebGL scenes stop rendering.
  const [vis, setVis] = useState<SceneVisibility>(() => sceneVisibility(0));
  const visRef = useRef(vis);
  const updateVisibility = (progress: number) => {
    const next = sceneVisibility(progress);
    const prev = visRef.current;
    if (
      next.hero !== prev.hero ||
      next.aurora !== prev.aurora ||
      next.sphere !== prev.sphere ||
      next.target !== prev.target ||
      next.portfolio !== prev.portfolio
    ) {
      visRef.current = next;
      setVis(next);
    }
  };

  // SSR + first client render emit nothing (matches → no hydration mismatch);
  // the effect above then mounts the live stage on the next tick.
  if (!mounted) return null;

  return (
    <>


      <div ref={trackRef} className="relative" style={{ height: `${geo.trackVh}vh` }}>
        <div className="sticky top-0 h-[100dvh] overflow-hidden p-[4vmin]">
          {/* White backdrop for phases 1–4; fades to the black page at gp 0.72. */}
                    <animated.div
            aria-hidden="true"
            className="absolute inset-0 z-0"
            style={{ 
              backgroundColor: "var(--background)",
              opacity: s.backdrop.to(v => 1 - v)
            }}
          />

          {/* 3D scene. */}
          <div className="relative z-[2] flex size-full items-center justify-center [perspective:3000px]">
            <div className="absolute inset-0">
              {/* Flat plane (z = 0): the hero card, then the scroll gallery frame
                  growing from the centre with the star panel on top of it. */}
              <div className="relative flex size-full items-center justify-center pointer-events-none">
                <animated.div
                  className="absolute z-[1] overflow-hidden"
                  style={{
                    width: HERO_CARD_WIDTH,
                    height: HERO_CARD_HEIGHT,
                    opacity: s.card1Opacity,
                    transform: s.heroCard,
                  }}
                >
                  <HeroCard
                    lines={content.hero.lines}
                    image={`${A}/hero-1.webp`}
                    imageAlt={content.hero.photoAlt ?? ""}
                    bottomBlock={content.hero.bottomBlock}
                    active={vis.hero}
                  />
                </animated.div>

                <div className="absolute inset-0 z-[1]">
                  <ScrollGallery
                    p={p}
                    left={content.gallery.left}
                    right={content.gallery.right}
                    cursor={content.gallery.cursor}
                    href={content.gallery.href}
                    images={content.gallery.images}
                  />
                </div>

                <animated.div
                  className="absolute inset-0 z-[2] [overflow:visible]"
                  style={{ opacity: s.card4Opacity }}
                >
                  <SphereCard
                    p={p}
                    headingTop={content.sphere.headingTop}
                    headingBottom={content.sphere.headingBottom}
                    body={content.sphere.body}
                    star={`${A}/manu-estrella.svg`}
                    active={vis.sphere}
                  />
                </animated.div>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* Single scroll driver. `frameInterval={0}` updates progress EVERY frame
          so it tracks the scroll 1:1 — the default 10ms throttle drops to ~60fps
          on 120Hz/ProMotion displays while Lenis scrolls at 120fps, which reads
          as jitter. Now scroll (ticker driver) and progress run in the same tick. */}
      <ProgressTrigger
        tag="span"
        trigger={trackRef as React.RefObject<HTMLElement>}
        start="top top"
        end="bottom bottom"
        className="hidden"
        frameInterval={0}
        onChange={({ progress }) => {
          api.start({ p: progress, immediate: true });
          updateVisibility(progress);
        }}
      />
    </>
  );
};
