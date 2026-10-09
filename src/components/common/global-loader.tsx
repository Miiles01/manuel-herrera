"use client";

/**
 * GlobalLoader — the intro "Manu" curtain on the first visit, and the page
 * transition on every navigation after that.
 *
 * Intro, built not to stutter (it plays while React is still hydrating and the
 * home is mounting — the busiest moment of the page's life):
 * 1. The letters are rendered by the server ALREADY HIDDEN (each char is its own
 *    span at translateY(110%) inside a clipped heading), so nothing flashes in and
 *    out before the animation starts.
 * 2. Every movement runs on the Web Animations API with transform only, i.e. on
 *    the compositor — a long task on the main thread (hydration, the stage
 *    mounting) can't freeze it mid-way the way a JS-ticked tween would.
 * 3. A module-level flag makes the intro start once, even when Strict Mode runs
 *    the effect twice in development.
 * Phase lives in a ref (no re-renders while it runs).
 */

import { useEffect, useRef, memo, forwardRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";
import { prepareImageReveal } from "@/components/common/image-reveal";

/** Longest a page transition waits for the next route before giving up on the
 *  slide and just swapping (browsers abort view-transition updates after ~4s). */
const NAV_BUDGET_MS = 3500;

/** Page transition (after Haven, havenconstructions.com.au): the incoming page
 *  rises from below ON TOP and covers the old one; the outgoing page stays
 *  underneath, drifts up a little (parallax) and darkens — its snapshot fades
 *  toward the black view-transition backdrop (globals.css). Opacity, not a
 *  `filter`, so the GPU composites it: an animated filter over a full-page
 *  snapshot is re-rasterised every frame and stuttered on phones. */
const PAGE_EASE = "cubic-bezier(0.76, 0, 0.24, 1)"; // easeInOutQuart
const SLIDE_IN = { duration: 1000, easing: PAGE_EASE };
const SLIDE_OUT = { duration: 1000, easing: PAGE_EASE };
/** How far the outgoing page drifts up, and how dark it gets (1 = untouched). */
const OUT_DRIFT = "-20%";
const OUT_DIM = 0.65; // old page opacity over black ≈ a black overlay at 35%

// ─── Intro timing (same choreography as before, now compositor-driven) ──────
const INTRO_WORD = "Manu";
const EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)"; // power3.out
const EASE_IN = "cubic-bezier(0.55, 0.055, 0.675, 0.19)"; // power3.in
const EASE_IN_OUT = "cubic-bezier(0.645, 0.045, 0.355, 1)"; // power3.inOut
const LETTER_IN = { duration: 650, stagger: 60 };
const LETTER_OUT = { duration: 500, stagger: 40 };
const CURTAIN_UP_MS = 900;
/** Hold after the letters land: once the page has loaded… */
const HOLD_LOADED_MS = 700;
/** …or, if it's still loading, wait for `load` (+ a beat), at most this long. */
const HOLD_SAFETY_MS = 2500;
const HOLD_AFTER_LOAD_MS = 400;

/** One intro per page load, even if Strict Mode mounts the effect twice. */
let introStarted = false;

/** The word, one span per letter, server-rendered already hidden below the
 *  heading's clip — so it never flashes before animating in. */
const LoaderText = memo(
  forwardRef<HTMLHeadingElement>(function LoaderText(_props, ref) {
    return (
      <h2
        ref={ref}
        aria-label={INTRO_WORD}
        className="flex text-black font-semibold tracking-tighter leading-none select-none"
        style={{
          fontSize: "clamp(3rem, 16vw, 14rem)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        {[...INTRO_WORD].map((ch, i) => (
          <span key={i} aria-hidden="true" data-char="" className="inline-block" style={{ transform: "translateY(110%)" }}>
            {ch}
          </span>
        ))}
      </h2>
    );
  }),
  () => true, // never re-render: the animation owns these nodes
);

/** Animate every char; resolves when the last one finishes. */
function animateChars(
  chars: HTMLElement[],
  from: string,
  to: string,
  { duration, stagger }: { duration: number; stagger: number },
  easing: string,
) {
  const anims = chars.map((el, i) =>
    el.animate({ transform: [from, to] }, { duration, delay: i * stagger, easing, fill: "forwards" }),
  );
  return Promise.all(anims.map((a) => a.finished)).then(() => undefined);
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function GlobalLoader() {
  const router    = useRouter();
  const pathname  = usePathname();

  const setReady    = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);
  // Already revealed globally → this is an HMR (Fast Refresh) remount.
  const isAlreadyRevealed = useLoaderStore((s) => s.revealed);

  const { isTransitioning, targetUrl, finishTransition } = usePageTransition();

  const stopScroll  = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLHeadingElement>(null);

  const phaseRef  = useRef<"initial" | "idle" | "transitioning">("initial");

  // ─── 1. ANIMACIÓN INICIAL ────────────────────────────────────────────────
  useEffect(() => {
    const loader = loaderRef.current;
    const text = textRef.current;
    if (!loader || !text) return;

    const hide = () => { loader.style.display = "none"; };
    const reveal = () => {
      hide();
      phaseRef.current = "idle";
      startScroll();
      setReady(true);
      setRevealed(true);
    };

    // HMR remount after the intro already played: just keep the curtain away.
    if (isAlreadyRevealed) { hide(); phaseRef.current = "idle"; return; }
    // Strict Mode's second run of this effect: the intro is already playing.
    if (introStarted) return;

    // Language switch: skip the intro (the page reloads because each language is
    // its own root layout, but the visitor has already seen it).
    let skipIntro = false;
    try {
      skipIntro = sessionStorage.getItem("skip-intro") === "1";
      if (skipIntro) sessionStorage.removeItem("skip-intro");
    } catch { /* storage unavailable */ }
    if (skipIntro) { introStarted = true; reveal(); return; }

    introStarted = true;
    stopScroll();
    const chars = [...text.querySelectorAll<HTMLElement>("[data-char]")];

    const waitForPage = () =>
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") { setTimeout(resolve, HOLD_LOADED_MS); return; }
        const safety = setTimeout(resolve, HOLD_SAFETY_MS);
        window.addEventListener("load", () => {
          clearTimeout(safety);
          setTimeout(resolve, HOLD_AFTER_LOAD_MS);
        }, { once: true });
      });

    (async () => {
      await animateChars(chars, "translateY(110%)", "translateY(0%)", LETTER_IN, EASE_OUT);
      await waitForPage();
      await animateChars(chars, "translateY(0%)", "translateY(-110%)", LETTER_OUT, EASE_IN);
      await loader.animate(
        { transform: ["translateY(0%)", "translateY(-100%)"] },
        { duration: CURTAIN_UP_MS, easing: EASE_IN_OUT, fill: "forwards" },
      ).finished;
      reveal();
    })();
    // Runs once per mount; the flag above guards Strict Mode's double invoke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 2. TRANSICIÓN DE PÁGINA
  // The new page rises from below on top of the current one, which drifts up a
  // little and darkens underneath — see SLIDE_IN / SLIDE_OUT / OUT_DIM. Done with the View
  // Transitions API: the browser snapshots the old page, Next renders the new
  // route behind it, and the slide only starts once the new page is in the DOM —
  // so a slow route never shows a half-rendered page. Images then fade up as
  // each one loads (image-reveal.ts). The intro "Manu" loader is not used here.
  const pendingRef = useRef<{ path: string; resolve: () => void } | null>(null);

  useEffect(() => {
    if (!isTransitioning || !targetUrl) return;
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "transitioning";
    stopScroll();

    const targetPath = targetUrl.split(/[?#]/)[0];
    let timedOut = false;
    let stopReveal: (() => void) | null = null;

    // Resolves once the new route has rendered (see effect 3), or after the
    // budget — the browser aborts view transitions whose update runs too long.
    const toTop = () => {
      window.scrollTo(0, 0);
      useScroll.getState().lenis?.scrollTo(0, { immediate: true });
    };

    const navigate = () =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          timedOut = true;
          // Too slow for a slide: let it go, and when the page does arrive just
          // put it at the top and reveal its images (effect 3 calls this).
          if (pendingRef.current) {
            pendingRef.current.resolve = () => { toTop(); stopReveal = prepareImageReveal()(); };
          }
          resolve();
        }, NAV_BUDGET_MS);
        pendingRef.current = { path: targetPath, resolve: () => { clearTimeout(timer); resolve(); } };
        router.push(targetUrl);
      });

    const finish = () => {
      phaseRef.current = "idle";
      startScroll();
      finishTransition();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      navigate().then(() => {
        toTop();
        stopReveal = prepareImageReveal()();
        finish();
      });
      return () => stopReveal?.();
    }

    let startReveal: (() => () => void) | null = null;
    const vt = document.startViewTransition(async () => {
      await navigate();
      if (timedOut) return; // still the old page — nothing to prepare yet
      toTop();
      // Hide the new page's images before the snapshot; they fade up later.
      startReveal = prepareImageReveal();
    });

    vt.ready
      .then(() => {
        if (timedOut) { vt.skipTransition(); return; }
        const root = document.documentElement;
        root.animate(
          {
            transform: ["translateY(0)", `translateY(${OUT_DRIFT})`],
            opacity: [1, OUT_DIM],
          },
          { ...SLIDE_OUT, fill: "both", pseudoElement: "::view-transition-old(root)" },
        );
        root.animate(
          { transform: ["translateY(100%)", "translateY(0)"] },
          { ...SLIDE_IN, fill: "both", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => { /* transition skipped — the page is already swapped */ });

    vt.finished.finally(() => {
      stopReveal = startReveal?.() ?? null;
      finish();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, targetUrl]);

  // ─── 3. LA RUTA NUEVA YA RENDERIZÓ → soltar la transición ────────────────
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending || pathname !== pending.path) return;
    pendingRef.current = null;
    // Resolve right away: this effect runs after React has committed the new
    // route, so the DOM is ready for the snapshot. (Not requestAnimationFrame —
    // rendering is paused while a view transition waits on its update, so a rAF
    // would never fire and the transition would hit its timeout.)
    pending.resolve();
  }, [pathname]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--loader-bg)] will-change-transform"
    >
      <LoaderText ref={textRef} />
    </div>
  );
}
