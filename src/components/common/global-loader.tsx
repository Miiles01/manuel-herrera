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

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition, getLoaderLabel } from "@/hooks/use-page-transition";

// Flag fuera del componente: sobrevive al Strict Mode double-invoke
// Asegura que la animación inicial sólo corra UNA vez aunque el efecto
// se monte/desmonte dos veces en desarrollo.
let initialAnimationPlayed = false;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function splitIn(el: HTMLElement, onDone: () => void): SplitType {
  // Resetear a texto plano antes de cada split (evita spans anidados)
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

  const { isTransitioning, targetUrl, label, finishTransition } = usePageTransition();

  const stopScroll  = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLHeadingElement>(null);
  const phaseRef  = useRef<"initial" | "idle" | "transitioning">("initial");

  // ─── 1. ANIMACIÓN INICIAL ────────────────────────────────────────────────
  useEffect(() => {
    // Si ya se corrió (Strict Mode double-invoke, HMR), salir
    if (initialAnimationPlayed) {
      // Si ya está idle, sólo asegurar que el loader está oculto
      if (phaseRef.current === "idle") {
        gsap.set(loaderRef.current, { display: "none" });
      }
      return;
    }

    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;

    initialAnimationPlayed = true;
    stopScroll();

    // Texto de la página actual
    const lbl = getLoaderLabel(pathname);
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
      splitOut(split.chars, 0, slideUp);
    };

    const split = splitIn(text, () => {
      // Esperar a que termine la carga (o límite de 2.5 s)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 2. TRANSICIONES ENTRE PÁGINAS ──────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl) return;
    if (phaseRef.current !== "idle") return;

    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;

    phaseRef.current = "transitioning";
    stopScroll();

    // Escribir el texto de destino directamente en el DOM (React nunca lo toca)
    text.textContent  = label;
    text.dataset.plain = label;

    // Paso 1: pantalla baja cubriendo el contenido
    gsap.set(loader, { display: "flex", yPercent: -100 });
    gsap.to(loader, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Paso 2: letras entran
        const split = splitIn(text, () => {
          // Paso 3: navegar mientras la cortina está cerrada
          router.push(targetUrl);
          window.scrollTo(0, 0);
          useScroll.getState().lenis?.scrollTo(0, { immediate: true });

          // Paso 4: pausa legible → letras salen
          splitOut(split.chars, 0.5, () => {
            // Paso 5: pantalla sube revelando la nueva página
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
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, targetUrl]);

  // ─── Render ──────────────────────────────────────────────────────────────
  // Sin display inline (GSAP lo controla)
  // Sin hijos en h2 (JS lo controla vía ref)
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
