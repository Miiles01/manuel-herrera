/**
 * Showreel scroll timeline — a faithful port of the original vanilla
 * `updateScroll()` choreography (Showreel/script.js).
 *
 * The whole experience is driven by ONE normalised scroll progress `p` (0→1)
 * across the tall scroll track. Every animated value is a pure function of `p`
 * (and the live `vmin` in px where a calc can't stay unit-only), so the stage
 * needs only a single react-spring value scrubbed by a `ProgressTrigger`
 * (the sanctioned "one spring, many `.to()` selectors" pattern).
 *
 * Progress model (matches the original's virtual-timeline compression):
 *   SCROLL_COMPRESS = 0.4 → real scroll is multiplied by 1/0.4 = 2.5.
 *   The original used 2000vh of virtual scroll for phases 1–5, then absolute
 *   virtual thresholds for portfolio / camera-flight. We map `p` to the same
 *   virtual-scroll axis (`vScroll`, in vh) and reuse every original formula.
 *
 * Responsive geometry: the card/sphere constants that read wrong in portrait are
 * driven from `geometry.ts`. Pure-string builders emit `var(--sr-*)` (swapped
 * live by `useShowreelLayout`, so their spring selectors never rebuild); the two
 * JS-math counter-scales take a numeric `geo` (default desktop → unchanged
 * output). `PERSP` is shared and constant across layouts (see geometry.ts).
 */

import { PERSP } from "@/utils/showreel/geometry";

// ── Track / progress geometry ──────────────────────────────────────────────
// The timeline starts at 0: the hero holds, then the scroll gallery grows out of
// the centre (0..800vh of virtual scroll) with the star inside it, and from 800vh
// on everything keeps its original absolute thresholds (star grows → sphere →
// portfolio → camera flight). The track grew in proportion (geometry.ts) so the
// later scenes keep their pace.
const VSCROLL_START = 0;
// The timeline now ENDS on the "Piensa diferente" block (fully revealed by ~1480,
// then a short hold): the featured-projects carousel, the scattered image grid and
// the camera flight to the CTA were removed — the CTA is a normal page section
// after the stage. Their thresholds below are kept but never reached.
const VSCROLL_MAX = 1750; // virtual scroll (vh) reached at p = 1
export const TRACK_VH = 742; // total scroll-track height (vh) on desktop
const SCROLL_COMPRESS = 0.4;

// Virtual-scroll thresholds (vh), identical to the original derivation.
const OLD_MAX = 2000; // phases 1–5 span 0..2000vh of virtual scroll
const PS = OLD_MAX - 400; // portfolioStart = 1600
const PF_DUR = 1500;
const PF_END = PS + PF_DUR; // 3100
const GRID_START = PS + 0.72 * PF_DUR; // 2680
const P6_END = GRID_START + 1000; // 3680
const P7_START = P6_END; // 3680
const P7_END = P7_START + 900; // 4580
// PERSP (scene perspective px, used for counter-scales) is imported from
// geometry.ts — it is shared with the `[perspective:1500px]` CSS and the grid
// depth scale, so it must stay one constant across layouts.

// ── Helpers ──────────────────────────────────────────────────────────────
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Smoothstep (cubic hermite). */
const smooth = (t: number) => t * t * (3 - 2 * t);

const vScroll = (p: number) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  // On mobile, the 3D timeline stops entirely at OLD_MAX (2000), which is the end of the Sphere phase.
  // The subsequent Portfolio and CTA phases are rendered statically in a standard scrolling flow.
  if (isMobile) return clamp01(p) * OLD_MAX;
  return VSCROLL_START + clamp01(p) * (VSCROLL_MAX - VSCROLL_START);
};
const gp = (p: number) => clamp01(vScroll(p) / OLD_MAX);

// Phase progresses. The scroll gallery takes the first stretch (vScroll):
//   0 – 273    the hero scrolls up and away while the gallery section (small
//              frame + labels) scrolls in from below, at exactly the native
//              scroll speed — no hold, so it never feels "caught" (see below)
//   273 – 710  pinned: the frame grows to full size while covers flick through
//   710 – 760  the last cover fills the screen, no star yet
//   760 – 1500 the star is born at 0 and grows continuously over the screen
//              (one motion: 0 → huge, no intermediate size or pause)
/** Virtual vh that one viewport of real scroll covers. Progress runs "top top" →
 *  "bottom bottom", i.e. over (trackVh − 100)vh of real scroll, so this is
 *  VSCROLL_MAX / (742 − 100) × 100 ≈ 273. Moving the hero by 100vh over it keeps
 *  it in step with the page, so entering the stage reads as ordinary scrolling.
 *  Keep in sync with `trackVh` in geometry.ts (desktop and tablet share it). */
const VIEWPORT_V = (VSCROLL_MAX / (742 - 100)) * 100;
const galleryEnter = (p: number) => clamp01(vScroll(p) / VIEWPORT_V); // 0 – 273
const galleryGrowRaw = (p: number) =>
  clamp01((vScroll(p) - VIEWPORT_V) / (710 - VIEWPORT_V)); // 273 – 710
export const galleryGrow = (p: number) => smooth(galleryGrowRaw(p));
/** Star growth (0 → 1): starts once the last cover has filled the screen and
 *  runs until the screen is covered (vScroll 760 → 1500). */
const starGrow = (p: number) => clamp01((vScroll(p) - 760) / 740);
export const phase4 = (p: number) => clamp01((gp(p) - 0.4) / 0.35); // 40 – 75%

// ── Hero card ──────────────────────────────────────────────────────────────
// Static: it fills the stage (minus the white margin) and never moves — the star
// grows out of the photo and covers it.
export const HERO_CARD_WIDTH = "calc(100vw - var(--sr-hero-pad))";
export const HERO_CARD_HEIGHT = "calc(100vh - var(--sr-hero-pad))";
export const card1Opacity = (p: number) => (gp(p) >= 0.75 ? 0 : 1);
/** Hero card scrolls up out of the stage as the gallery section comes in. */
export const heroCardTransform = (p: number) => `translateY(${-galleryEnter(p) * 100}vh)`;

/** Sphere panel (star mask + "Piensa diferente"): always on — the star is simply
 *  size 0 until it starts growing. The page then scrolls on to the CTA section. */
export const card4Opacity = () => 1;

// ── Scroll gallery (frame that grows from the centre) ──────────────────────
/** Frame scale: small in the centre → the full screen (the last cover is
 *  full-bleed). The frame is 100vw × 100dvh at scale 1. */
const GALLERY_MIN_SCALE = 0.38;
export const galleryScale = (p: number) =>
  GALLERY_MIN_SCALE + (1 - GALLERY_MIN_SCALE) * galleryGrow(p);
export const galleryOpacity = (p: number) => (gp(p) >= 0.75 ? 0 : 1);
/** The whole gallery section scrolls in from below the stage, then pins. */
export const galleryEnterTransform = (p: number) => `translateY(${(1 - galleryEnter(p)) * 100}vh)`;
/** Which cover is showing (0 … count-1): flicks fast while the frame grows and
 *  settles on the last one once it's full. */
export const galleryIndex = (p: number, count: number) =>
  Math.min(count - 1, Math.floor(galleryGrowRaw(p) * count));
/** The "Ver" cursor works over the frame once the section is (mostly) in and
 *  until the star starts covering it. */
export const galleryCursorActive = (p: number) => galleryEnter(p) > 0.5 && starGrow(p) < 0.2;
/** Side labels slide away from the frame as it grows, and fade near full size. */
export const galleryLabelOpacity = (p: number) =>
  1 - smooth(clamp01((galleryGrowRaw(p) - 0.75) / 0.2));

// ── Star mask (appears on the last gallery cover, then grows over the screen) ─
/** Star size (vmin): one continuous growth from 0 to past the screen edges —
 *  slow at first, then accelerating (cubic). */
const STAR_MAX_VMIN = 1500;
export const starMaskSize = (p: number) => `${Math.pow(starGrow(p), 3) * STAR_MAX_VMIN}vmin`;

/** Star colour: black as it starts growing, turning into --sphere-surface
 *  (#FDFDFD) between 20% and 60% of its growth — fully light before the
 *  "Piensa diferente" copy (dark ink) comes in. Mixed from the CSS tokens. */
export const starPanelColor = (p: number) => {
  const t = smooth(clamp01((starGrow(p) - 0.2) / 0.4));
  return `color-mix(in srgb, var(--sphere-surface) ${(t * 100).toFixed(1)}%, var(--sphere-start))`;
};

/** Star rotation (deg): turns 180° while it grows. */
export const starSpin = (p: number) => smooth(starGrow(p)) * 180;

export const blackScreenTransform = (p: number) =>
  `translate(-50%, -50%) rotate(${starSpin(p)}deg)`;
export const sphereSceneTransform = (p: number) =>
  `translate(-50%, -50%) rotate(${-starSpin(p)}deg)`;
export const sphereLogoEase = (p: number) => smooth(starGrow(p));

/** Supporting copy in the sphere block fades/rises in just after the headings
 *  land (gp 0.64→0.74). */
export const sphereBodyReveal = (p: number) => smooth(clamp01((gp(p) - 0.64) / 0.1));

/**
 * "Collapse" progress through the fully-open sphere state: the particle sphere
 * grows to fill the frame while the white star logo shrinks back. Runs after
 * the reveal (gp 0.52→0.72), before the portfolio scrolls in.
 */
export const sphereCollapse = (p: number) => smooth(clamp01((gp(p) - 0.52) / 0.2));
/** Sphere shell scale — grows as it collapses (canvas grows past the viewport so
 *  scattered particles aren't clipped by the canvas edge). */
export const sphereScale = (p: number) => 1 + 0.5 * sphereCollapse(p);

export const sphereLogoTransform = (p: number) => {
  const rot = starSpin(p);
  return `translate(-50%, -50%) rotate(${rot}deg) scale(${0.12 + 0.88 * sphereLogoEase(p) - 0.55 * sphereCollapse(p)})`;
};
export const sphereLogoOpacity = (p: number) => sphereLogoEase(p);

/**
 * Particle dispersion (0→1) as the portfolio takes over: the sphere's particles
 * loosen + dissolve. Gentle + long (vScroll PS-400 → PS+200) and overlapping the
 * end of the collapse, so it reads as a soft fade-out rather than a hard burst
 * at the scene seam.
 */
export const sphereDisperse = (p: number) => smooth(clamp01((vScroll(p) - (PS - 400)) / 600));

/**
 * Tracks the "hero" sequence (phases 1–4). 1 means white backdrop, 0 means black.
 * Fades to 0 (black page) just before portfolio starts, as the card flips and the
 * sphere fully opens (gp 0.72→0.75). Fades back to 1 (white) after the portfolio
 * ends (vScroll 3100→3300) so the camera flight happens over white.
 */
export const stageBackdropOpacity = () => 1;
// The stage used to fade to black under the (black) star panel. The panel is now
// near-white (--sphere-surface), so the backdrop simply stays white throughout.

// ── Unified aurora background (sphere + portfolio) ──────────────────────────
// One pinned mesh-gradient ("northern lights") shared by the sphere scene and
// the portfolio so the background reads as continuous across both blocks
// (replaces the flame backdrop there + the portfolio's own fly-in aurora).
// Fades in behind the white backdrop as the sphere opens, holds through the
// portfolio, fades out as the camera flies on to the target.
export const auroraOpacity = (p: number) => {
  const v = vScroll(p);
  const fadeIn = clamp01((v - 1200) / 350); // in by ~1550 (white backdrop gone by 1500)
  const fadeOut = 1 - clamp01((v - 2900) / 350); // out by ~3250 (after portfolio exits)
  return Math.min(fadeIn, fadeOut);
};

// ── Portfolio ───────────────────────────────────────────────────────────────
const pfProgress = (p: number) => clamp01((vScroll(p) - PS) / PF_DUR);
const pfEnter = (p: number) => smooth(clamp01(pfProgress(p) / 0.267));
const pfSlide = (p: number) => clamp01((pfProgress(p) - 0.267) / 0.453);
const pfExit = (p: number) => smooth(clamp01((pfProgress(p) - 0.72) / 0.28));

export const portfolioActive = (p: number) => vScroll(p) > PS;
export const portfolioTransform = (p: number) => {
  if (!portfolioActive(p)) return "translateY(100%)";
  const ty = (1 - pfEnter(p)) * 100;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  if (isMobile) return `translateY(${ty}%)`;
  
  const sc = 1 - pfExit(p) * 0.62;
  const tx = -pfExit(p) * 130;
  return `translate(${tx}vw, ${ty}%) scale(${sc})`;
};
export const pfTrackTransform = (p: number, maxPan: number) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  return isMobile
    ? `translateY(${-pfSlide(p) * maxPan}px)`
    : `translateX(${-pfSlide(p) * maxPan}px)`;
};

// ── Camera-rig flight + target block (phases 6–7) ──────────────────────────
const flightActive = (p: number) => vScroll(p) > GRID_START;
const p6 = (p: number) => clamp01((vScroll(p) - GRID_START) / 1000);
const p7 = (p: number) => clamp01((vScroll(p) - P7_START) / (P7_END - P7_START));
const easeP7 = (p: number) => {
  const t = p7(p);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const cameraRigTransform = (p: number) => {
  if (!flightActive(p)) return "translate(0vw, 0vh) translateZ(0px)";
  const rigX = -250 * Math.sin((p6(p) * Math.PI) / 2);
  const rigY = -100 * (1 - Math.cos((p6(p) * Math.PI) / 2));
  const rigZ = 2250 * easeP7(p);
  return `translate(${rigX}vw, ${rigY}vh) translateZ(${rigZ}px)`;
};
export const targetOpacity = (p: number) => (flightActive(p) ? 1 : 0);

/** CTA reveal — fades/rises in over the last half of the camera flight into the
 *  target block (p7 0.5→1), so the call-to-action lands as the camera arrives. */
export const ctaReveal = (p: number) => smooth(clamp01((p7(p) - 0.5) / 0.5));

/** Final-block metal frame — appears almost at the very end of the camera flight
 *  (p7 0.8→1), snapping in as the scene settles into the target block. */
export const finalFrameReveal = (p: number) => smooth(clamp01((p7(p) - 0.8) / 0.2));

// ── Per-canvas visibility (render-loop gating) ──────────────────────────────
// The showreel mounts several WebGL canvases at once; rendering all of them
// every frame (incl. the 34k-particle sphere + chrome star) is the main cause of
// scroll lag. Each canvas is only on-screen during a slice of the scroll, so we
// pause its render loop (`frameloop="never"`) when out of range. Ranges carry a
// margin so a scene is live slightly before it appears (no pop-in / frozen
// first frame). Derived from the same thresholds as the transforms above.
export interface SceneVisibility {
  hero: boolean;
  aurora: boolean;
  sphere: boolean;
  target: boolean;
  /** Portfolio video cards — gates their (heavy) `<video>` loading/playback. */
  portfolio: boolean;
}
export const sceneVisibility = (p: number): SceneVisibility => {
  const g = gp(p);
  const v = vScroll(p);
  return {
    // Hero card stays until the star has covered it (~gp 0.75).
    hero: g < 0.8,
    // Unified aurora backdrop for the sphere + portfolio blocks (the portfolio
    // has no canvas of its own now, so this also covers its range).
    aurora: v > 1000 && v < PF_END + 350,
    // The star (sphere panel) appears on the last gallery cover and stays until
    // the camera flies past it.
    sphere: v > 600 && v < GRID_START + 400,
    // Target star: the camera-flight + final block.
    target: v > GRID_START - 300,
    // Portfolio cards: live across the portfolio scroll range (with a lead-in
    // margin so the videos buffer just before the section flies into view).
    portfolio: v > PS - 600 && v < PF_END + 350,
  };
};
export const targetTransform = () =>
  "translate(calc(-50% + 250vw), calc(-50% + 100vh)) translateZ(-2250px)";
export const targetRadius = (p: number) => (flightActive(p) ? 30 * (1 - easeP7(p)) : 30);

// ── Parallax grid items ─────────────────────────────────────────────────────
export interface GridItem {
  tx: number; // vw
  ty: number; // vh
  w: string; // width (vw)
  h: string; // height (vh)
  z: number; // px depth
  scale: number;
  image: string; // background image url (URL-encoded)
}

/** Source images for the parallax grid (public/assets/grid-images). Distributed
 *  across the 14 items deterministically below (SSR-stable, fixed per reload).
 *  Spaces in the filenames are URL-encoded for use in `url()`. */
const GRID_IMAGES = [
  "/assets/grid-images/image-1.webp",
  "/assets/grid-images/image-2.webp",
  "/assets/grid-images/image-3.webp",
  "/assets/grid-images/image-4.webp",
  "/assets/grid-images/image-5.webp",
  "/assets/grid-images/image-6.webp",
  "/assets/grid-images/image-7.webp",
  "/assets/grid-images/image-8.webp",
  "/assets/grid-images/image-9.webp",
  "/assets/grid-images/image-10.webp",
  "/assets/grid-images/image-11.webp",
];

/** The 14 placeholder positions from the original markup, with deterministic
 *  pseudo-random depth (so the parallax pattern is fixed across reloads). */
const RAW_GRID: Array<{ tx: number; ty: number; w: string; h: string }> = [
  { tx: -85, ty: -60, w: "45vw", h: "70vh" },
  { tx: -80, ty: 55, w: "40vw", h: "65vh" },
  { tx: 85, ty: -60, w: "40vw", h: "75vh" },
  { tx: 80, ty: 55, w: "45vw", h: "70vh" },
  { tx: -15, ty: -110, w: "45vw", h: "75vh" },
  { tx: 15, ty: 120, w: "50vw", h: "80vh" },
  { tx: 50, ty: 120, w: "45vw", h: "70vh" },
  { tx: 120, ty: -10, w: "40vw", h: "80vh" },
  { tx: 0, ty: 160, w: "45vw", h: "75vh" },
  { tx: 150, ty: 0, w: "50vw", h: "80vh" },
  { tx: 200, ty: 30, w: "45vw", h: "75vh" },
  { tx: 300, ty: 40, w: "40vw", h: "70vh" },
  { tx: 190, ty: 160, w: "45vw", h: "80vh" },
  { tx: 310, ty: 170, w: "50vw", h: "75vh" },
];

export const GRID_ITEMS: GridItem[] = RAW_GRID.map((it, index) => {
  const pseudoRandom = Math.abs(Math.sin((index + 1) * 12.9898) * 43758.5453) % 1;
  const z = -500 - pseudoRandom * 2500;
  const scale = PERSP / (PERSP - z);
  // Decorrelated pseudo-random pick (different multiplier) so the image spread
  // doesn't track the depth pattern.
  const imgRand = Math.abs(Math.sin((index + 1) * 78.233) * 12345.678) % 1;
  const image = GRID_IMAGES[Math.floor(imgRand * GRID_IMAGES.length)];
  return { ...it, z, scale, image };
});

export const gridItemTransform = (item: GridItem) =>
  `translate(calc(-50% + ${item.tx}vw), calc(-50% + ${item.ty}vh)) translateZ(${item.z}px) scale(${item.scale})`;
export const gridItemRadius = (item: GridItem) => `${12 / item.scale}px`;

export const gridOpacity = (p: number) => {
  const v = vScroll(p);
  if (v <= GRID_START) return 0;
  const gridFadeIn = clamp01((v - GRID_START) / (PF_END - GRID_START));
  if (v <= PF_END) return gridFadeIn;
  // Fade back out as the camera reaches the target block (phase 7).
  const fade =
    v > P7_START ? easeP7(p) : 0;
  return 1 - fade;
};

// ── Pinned-text letter choreography ─────────────────────────────────────────
// These two headings are scrubbed by the global scroll while their card is
// pinned, so the viewport-triggered TextEngine can't reach them (see ADR).
export interface LetterStyle {
  transform: string;
  filter: string;
  opacity: number;
}

/** Sphere block heading — letters rise from below + come into focus. */
export const blockLetterStyle = (p: number, index: number, total: number): LetterStyle => {
  const ap = clamp01((gp(p) - 0.6) / 0.135);
  const delay = (index / total) * 0.55;
  const lp = clamp01((ap - delay) / 0.45);
  const inv = 1 - smooth(lp);
  return {
    transform: `translateY(${inv * 70}%)`,
    filter: `blur(${inv * 2.0}vmin)`,
    opacity: Math.max(0, 1 - inv * 1.3),
  };
};
