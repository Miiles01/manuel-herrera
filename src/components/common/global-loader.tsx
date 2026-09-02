"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";

/** Map a URL path to the word shown in the loader */
function getLoaderLabel(url: string): string {
  if (url === "/" || url === "") return "Hola";
  if (url.startsWith("/trabajo")) return "Trabajo";
  if (url.startsWith("/contacto")) return "Contacto";
  if (url.startsWith("/proyecto/")) {
    const slug = url.replace("/proyecto/", "");
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "Hola";
}

/** Split text and animate chars IN. Returns the chars array. */
function runIn(el: HTMLElement, onDone: () => void): SplitType {
  // Fresh split every time
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

/** Animate chars OUT. Calls onDone when done. */
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
  const { isTransitioning, targetUrl, finishTransition } = usePageTransition();
  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"initial-loading" | "done" | "transitioning">("initial-loading");

  // ─── 1. INITIAL LOAD ────────────────────────────────────────────────────────
  useGSAP(() => {
    if (phase !== "initial-loading") return;
    if (!greetingRef.current || !loaderRef.current) return;

    stopScroll();

    greetingRef.current.textContent = "Hola";

    let split: SplitType | null = null;
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
      runOut(split?.chars ?? null, 0, slideUp);
    };

    // After IN anim completes, wait for page load or 800ms timeout
    split = runIn(greetingRef.current, () => {
      if (document.readyState === "complete") {
        setTimeout(startExit, 600);
      } else {
        const onLoad = () => { clearTimeout(safety); setTimeout(startExit, 300); };
        const safety = setTimeout(startExit, 2000);
        window.addEventListener("load", onLoad, { once: true });
      }
    });
  }, { scope: loaderRef, dependencies: [phase] });


  // ─── 2. PAGE TRANSITION ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl || phase !== "done") return;
    if (!greetingRef.current || !loaderRef.current) return;

    setPhase("transitioning");
    stopScroll();

    const label = getLoaderLabel(targetUrl);
    greetingRef.current.textContent = label;
    gsap.set(greetingRef.current, { autoAlpha: 1 });

    // Step 1: screen slides DOWN
    gsap.set(loaderRef.current, { yPercent: -100, display: "flex" });
    gsap.to(loaderRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Step 2: letters slide IN
        const split = runIn(greetingRef.current!, () => {
          // Step 3: navigate (behind the curtain)
          router.push(targetUrl);
          window.scrollTo(0, 0);
          useScroll.getState().lenis?.scrollTo(0, { immediate: true });

          // Step 4: wait 0.5s so text is readable, then letters slide OUT
          runOut(split.chars, 0.5, () => {
            // Step 5: screen slides UP
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
        className="text-white font-semibold tracking-tighter leading-none"
        style={{
          fontSize: "clamp(3rem, 16vw, 14rem)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}
