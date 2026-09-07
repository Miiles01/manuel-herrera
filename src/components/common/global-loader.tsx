"use client";

/**
 * GlobalLoader — versión estable.
 *
 * PRINCIPIOS:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. El <h2> NUNCA tiene hijos JSX. Texto controlado 100% por JS vía ref.
 * 2. El display/visibilidad del loader está controlado 100% por GSAP.
 * 3. El estado de fase usa useRef (no useState) → sin re-renders que interfieran.
 * 4. La animación inicial usa un flag global (ref fuera del componente) para
 *    sobrevivir al double-invoke de React 18 Strict Mode en desarrollo.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function splitIn(el: HTMLElement, onDone: () => void): SplitType {
  const plain = el.dataset.plain || el.textContent || "";
  el.dataset.plain = plain;
  el.textContent = plain;

  const split = new SplitType(el, { types: "chars" });
  const chars = split.chars ?? [];

  gsap.set(chars, { yPercent: 110 });
  gsap.to(chars, {
    yPercent: 0,
    stagger: { each: 0.06, from: "start" },
    duration: 0.65,
    ease: "power3.out",
    onComplete: onDone,
  });
  return split;
}

function splitOut(chars: Element[] | null, delay: number, onDone: () => void) {
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

// ─── Componente ──────────────────────────────────────────────────────────────

export function GlobalLoader() {
  const router    = useRouter();
  const pathname  = usePathname();

  const setReady    = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);
  // Leemos si ya se reveló globalmente para saber si es HMR (Fast Refresh)
  const isAlreadyRevealed = useLoaderStore((s) => s.revealed);

  const { isTransitioning, targetUrl, finishTransition } = usePageTransition();

  const stopScroll  = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLHeadingElement>(null);
  const splitRef  = useRef<SplitType | null>(null);
  
  // En HMR, si ya se reveló antes, empezamos en "idle"
  const phaseRef  = useRef<"initial" | "idle" | "transitioning">("initial");

  const [waitingForPath, setWaitingForPath] = useState<string | null>(null);

  // ─── 1. ANIMACIÓN INICIAL ────────────────────────────────────────────────
  useGSAP(() => {
    // Si ya estamos idle (por ej. HMR re-mount) o ya se reveló antes
    if (phaseRef.current === "idle" || isAlreadyRevealed) {
      gsap.set(loaderRef.current, { display: "none" });
      phaseRef.current = "idle";
      return;
    }

    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;

    stopScroll();

    // Texto fijo según petición
    const lbl = "Manu";
    text.textContent  = lbl;
    text.dataset.plain = lbl;

    const slideUp = () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(loader, { display: "none" });
          phaseRef.current = "idle";
          startScroll();
          setReady(true);
          setRevealed(true);
        },
      });
    };

    let exited = false;
    const startExit = () => {
      if (exited) return;
      exited = true;
      splitOut(splitRef.current?.chars || null, 0, slideUp);
    };

    splitRef.current = splitIn(text, () => {
      if (document.readyState === "complete") {
        setTimeout(startExit, 700);
      } else {
        const safety = setTimeout(startExit, 2500);
        window.addEventListener("load", () => {
          clearTimeout(safety);
          setTimeout(startExit, 400);
        }, { once: true });
      }
    });

  }, { scope: loaderRef });

  // ─── 2. INICIAR TRANSICIÓN A OTRA PÁGINA ────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl) return;
    if (phaseRef.current !== "idle") return;

    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;

    phaseRef.current = "transitioning";
    stopScroll();

    // Siempre dice "Manu"
    const lbl = "Manu";
    text.textContent  = lbl;
    text.dataset.plain = lbl;

    // Paso 1: pantalla baja cubriendo el contenido
    gsap.set(loader, { display: "flex", yPercent: -100 });
    gsap.to(loader, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Paso 2: letras entran
        splitRef.current = splitIn(text, () => {
          // Paso 3: Disparar la navegación en Next.js
          router.push(targetUrl);
          
          // Extraemos solo el path del targetUrl para compararlo con `pathname` de Next
          // (ignorando posibles query params o hashes en targetUrl por si acaso)
          const targetPathname = targetUrl.split('?')[0].split('#')[0];
          setWaitingForPath(targetPathname);
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, targetUrl]);

  // ─── 3. REVELAR CUANDO LA PÁGINA CARGÓ ──────────────────────────────────
  useEffect(() => {
    if (waitingForPath && pathname === waitingForPath) {
      setWaitingForPath(null);

      // Reseteamos el scroll al principio de la nueva página
      window.scrollTo(0, 0);
      useScroll.getState().lenis?.scrollTo(0, { immediate: true });

      const loader = loaderRef.current;
      if (!loader) return;

      // Paso 4: Pausa mínima legible, letras salen
      splitOut(splitRef.current?.chars || null, 0.3, () => {
        // Paso 5: pantalla sube revelando la nueva página YA CARGADA
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(loader, { display: "none" });
            phaseRef.current = "idle";
            startScroll();
            finishTransition();
          },
        });
      });
    }
  }, [pathname, waitingForPath, startScroll, finishTransition]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black will-change-transform"
    >
      <h2
        ref={textRef}
        suppressHydrationWarning
        className="text-white font-semibold tracking-tighter leading-none select-none"
        style={{
          fontSize: "clamp(3rem, 16vw, 14rem)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}
