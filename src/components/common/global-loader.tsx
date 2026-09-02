"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";

/** Map a URL path to the word that appears in the loader */
function getLoaderLabel(url: string): string {
  if (url === "/" || url === "") return "Hola";
  if (url.startsWith("/trabajo")) return "Trabajo";
  if (url.startsWith("/contacto")) return "Contacto";
  if (url.startsWith("/proyecto/")) {
    // Try to extract a readable slug: "mar-vic" → "Mar & Vic" etc.
    const slug = url.replace("/proyecto/", "");
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "Hola";
}

/** Animate characters IN (slide up from below) */
function animateIn(chars: Element[]) {
  return gsap.fromTo(
    chars,
    { yPercent: 110 },
    {
      yPercent: 0,
      stagger: { each: 0.06, from: "start" },
      duration: 0.65,
      ease: "power3.out",
    }
  );
}

/** Animate characters OUT (slide up and away) */
function animateOut(chars: Element[], delay = 0) {
  return gsap.to(chars, {
    yPercent: -110,
    stagger: { each: 0.04, from: "start" },
    duration: 0.5,
    ease: "power3.in",
    delay,
  });
}

export function GlobalLoader() {
  const router = useRouter();

  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);

  const { isTransitioning, targetUrl, finishTransition } = usePageTransition();

  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);

  const [phase, setPhase] = useState<"initial-loading" | "done" | "transitioning">("initial-loading");

  // ─── 1. INITIAL LOAD ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (phase !== "initial-loading") return;

    stopScroll();

    if (!greetingRef.current) return;

    greetingRef.current.textContent = "Hola";
    const split = new SplitType(greetingRef.current, { types: "chars" });
    if (!split.chars) return;

    let isLoaded = false;

    // Chars start below clip
    gsap.set(split.chars, { yPercent: 110 });

    const tl = gsap.timeline();

    // Letters slide in
    tl.to(split.chars, {
      yPercent: 0,
      stagger: { each: 0.06, from: "start" },
      duration: 0.65,
      ease: "power3.out",
    });

    // Hold — visible for at least 0.6s after fully in
    tl.addPause("+=0.5");

    const finishInitialLoader = () => {
      if (isLoaded) return;
      isLoaded = true;

      // Resume the paused timeline — it will then play the exit
      tl.resume();

      // Letters slide out
      tl.to(split.chars, {
        yPercent: -110,
        stagger: { each: 0.04, from: "start" },
        duration: 0.5,
        ease: "power3.in",
      });

      // Screen slides up
      tl.to(
        loaderRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete: () => {
            startScroll();
            setReady(true);
            setRevealed(true);
            setPhase("done");
          },
        },
        "-=0.15"
      );
    };

    if (document.readyState === "complete") {
      // Page already loaded — wait a tiny bit so letters are readable
      setTimeout(finishInitialLoader, 900);
    } else {
      window.addEventListener("load", () => setTimeout(finishInitialLoader, 400));
      setTimeout(finishInitialLoader, 3500); // safety cap
    }

    return () => {
      window.removeEventListener("load", finishInitialLoader);
    };
  }, { scope: loaderRef, dependencies: [phase] });


  // ─── 2. PAGE TRANSITION ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl || phase !== "done") return;

    setPhase("transitioning");
    stopScroll();

    const label = getLoaderLabel(targetUrl);

    if (greetingRef.current) {
      greetingRef.current.textContent = label;
      gsap.set(greetingRef.current, { autoAlpha: 1 });
    }

    const tl = gsap.timeline();

    // Screen slides DOWN to cover
    tl.set(loaderRef.current, { yPercent: -100, display: "flex" })
      .to(loaderRef.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });

    // Letters slide IN
    tl.add(() => {
      if (!greetingRef.current) return;
      const split = new SplitType(greetingRef.current, { types: "chars" });
      if (!split.chars) return;

      gsap.set(split.chars, { yPercent: 110 });

      gsap.to(split.chars, {
        yPercent: 0,
        stagger: { each: 0.06, from: "start" },
        duration: 0.65,
        ease: "power3.out",
        onComplete: () => {
          // Navigate while text is visible
          router.push(targetUrl);
          window.scrollTo(0, 0);
          useScroll.getState().lenis?.scrollTo(0, { immediate: true });

          // Hold briefly so text is readable, then exit
          gsap.to(split.chars, {
            yPercent: -110,
            stagger: { each: 0.04, from: "start" },
            duration: 0.5,
            ease: "power3.in",
            delay: 0.5,
            onComplete: () => {
              // Screen slides UP
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
            },
          });
        },
      });
    });
  }, [isTransitioning, targetUrl, phase, router, startScroll, stopScroll, finishTransition]);

  const isHidden = phase === "done" && !isTransitioning;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black will-change-transform"
      style={{ display: isHidden ? "none" : "flex" }}
    >
      <h2
        ref={greetingRef}
        className="text-white text-[18vw] md:text-[14vw] font-semibold tracking-tighter leading-none"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
      />
    </div>
  );
}
