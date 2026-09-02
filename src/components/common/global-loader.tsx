"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";

/** Animate chars IN (slide up from below) and call onDone when finished */
function runIn(el: HTMLElement, onDone: () => void): SplitType {
  el.innerHTML = el.textContent || "";
  const split = new SplitType(el, { types: "chars" });
  gsap.set(split.chars, { yPercent: 110 });
  gsap.to(split.chars, {
    yPercent: 0,
    stagger: { each: 0.06, from: "start" },
    duration: 0.65,
    ease: "power3.out",
    onComplete: onDone,
  });
  return split;
}

/** Animate chars OUT (slide up and away) and call onDone when finished */
function runOut(chars: Element[] | null, delay: number, onDone: () => void) {
  if (!chars || chars.length === 0) { onDone(); return; }
  gsap.to(chars, {
    yPercent: -110,
    stagger: { each: 0.04, from: "start" },
    duration: 0.5,
    ease: "power3.in",
    delay,
    onComplete: onDone,
  });
}

export function GlobalLoader() {
  const router = useRouter();

  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);

  // Read label from store — computed at click time, always the DESTINATION
  const { isTransitioning, targetUrl, label, finishTransition } = usePageTransition();

  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);

  const [phase, setPhase] = useState<"initial-loading" | "done" | "transitioning">("initial-loading");

  // ─── 1. INITIAL LOAD: always says "Hola" ────────────────────────────────────
  useGSAP(() => {
    if (phase !== "initial-loading") return;
    if (!greetingRef.current || !loaderRef.current) return;

    stopScroll();

    // Force "Hola" — no URL reading, no derived state
    greetingRef.current.textContent = "Hola";

    let exitCalled = false;

    const slideUp = () => {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          startScroll();
          setReady(true);
          setRevealed(true);
          setPhase("done");
        },
      });
    };

    const startExit = () => {
      if (exitCalled) return;
      exitCalled = true;
      runOut(split.chars, 0, slideUp);
    };

    // Letters slide IN, then wait for page load, then exit
    const split = runIn(greetingRef.current, () => {
      if (document.readyState === "complete") {
        setTimeout(startExit, 600);
      } else {
        const safety = setTimeout(startExit, 2500);
        window.addEventListener("load", () => {
          clearTimeout(safety);
          setTimeout(startExit, 400);
        }, { once: true });
      }
    });
  }, { scope: loaderRef, dependencies: [phase] });


  // ─── 2. PAGE TRANSITION ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl || phase !== "done") return;
    if (!greetingRef.current || !loaderRef.current) return;

    setPhase("transitioning");
    stopScroll();

    // `label` was computed at click time in the Zustand store — guaranteed correct
    greetingRef.current.textContent = label;
    gsap.set(greetingRef.current, { autoAlpha: 1 });

    // Step 1 → screen slides DOWN covering the page
    gsap.set(loaderRef.current, { yPercent: -100, display: "flex" });
    gsap.to(loaderRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Step 2 → letters slide IN
        const split = runIn(greetingRef.current!, () => {
          // Step 3 → navigate while the curtain is down
          router.push(targetUrl);
          window.scrollTo(0, 0);
          useScroll.getState().lenis?.scrollTo(0, { immediate: true });

          // Step 4 → hold 0.5s so text is readable, then letters slide OUT
          runOut(split.chars, 0.5, () => {
            // Step 5 → screen slides UP revealing the new page
            gsap.to(loaderRef.current, {
              yPercent: -100,
              duration: 0.85,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(loaderRef.current, { display: "none" });
                startScroll();
                finishTransition();
                setPhase("done");
              },
            });
          });
        });
      },
    });
  }, [isTransitioning, targetUrl, label, phase, router, startScroll, stopScroll, finishTransition]);

  const isHidden = phase === "done" && !isTransitioning;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black will-change-transform"
      style={{ display: isHidden ? "none" : "flex" }}
    >
      {/* Default text "Hola" visible before any JS runs — prevents flash of empty */}
      <h2
        ref={greetingRef}
        className="text-white font-semibold tracking-tighter leading-none select-none"
        style={{
          fontSize: "clamp(3rem, 16vw, 14rem)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        Hola
      </h2>
    </div>
  );
}
