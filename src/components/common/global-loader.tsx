"use client";

/**
 * GlobalLoader — página-aware, sin conflictos React/GSAP.
 *
 * DISEÑO CLAVE:
 * ─────────────────────────────────────────────────────────────────────────────
 * • El <h2> NUNCA tiene hijos JSX. Su texto lo controla SOLO JavaScript vía ref.
 *   Esto evita que React re-renderice el h2 (causando flash) cuando pathname
 *   cambia tras router.push().
 *
 * • El display del loader NUNCA lo controla React vía inline-style.
 *   GSAP es el único responsable de show/hide. El elemento arranca como
 *   display:flex (cubre la pantalla en el primer render) y GSAP lo oculta
 *   al final de la animación inicial.
 *
 * • El state de "fase" usa useRef (no useState) para que los cambios de fase
 *   no provoquen re-renders que interfieran con GSAP.
 *
 * FASES:
 *   "initial"      → loader visible, animación de entrada de la primera carga
 *   "idle"         → loader oculto (display:none, yPercent:-100), página visible
 *   "transitioning"→ loader entrando/saliendo entre páginas
 */

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition, getLoaderLabel } from "@/hooks/use-page-transition";

// ─── Helpers de animación ────────────────────────────────────────────────────

function splitAndAnimateIn(el: HTMLElement, onDone: () => void): SplitType {
  // Restablecer el texto plano antes de dividir (evita spans anidados)
  const text = el.dataset.text || el.textContent || "";
  el.dataset.text = text;
  el.textContent = text;

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

function animateOut(chars: Element[] | null, delay: number, onDone: () => void) {
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

  const setReady   = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);

  const { isTransitioning, targetUrl, label, finishTransition } = usePageTransition();

  const stopScroll  = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLHeadingElement>(null);
  // Ref de fase: cambios NO causan re-renders (no hay useState)
  const phaseRef   = useRef<"initial" | "idle" | "transitioning">("initial");

  // ─── 1. CARGA INICIAL ────────────────────────────────────────────────────
  useEffect(() => {
    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;
    if (phaseRef.current !== "initial") return;

    stopScroll();

    // Texto de la página actual (sin tocar JSX)
    const initialLabel = getLoaderLabel(pathname);
    text.textContent   = initialLabel;
    text.dataset.text  = initialLabel;

    let exited = false;

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

    const startExit = () => {
      if (exited) return;
      exited = true;
      animateOut(split.chars, 0, slideUp);
    };

    const split = splitAndAnimateIn(text, () => {
      // Esperar a que la página termine de cargar (o máximo 2.5 s)
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

    // Cleanup: matar tweens si el componente se desmonta (HMR, StrictMode)
    return () => { gsap.killTweensOf(split.chars); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencional: sólo en mount

  // ─── 2. TRANSICIONES ENTRE PÁGINAS ──────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !targetUrl) return;
    if (phaseRef.current !== "idle") return;

    const loader = loaderRef.current;
    const text   = textRef.current;
    if (!loader || !text) return;

    phaseRef.current = "transitioning";
    stopScroll();

    // Texto de destino → escrito en el DOM directamente (React nunca lo toca)
    text.textContent  = label;
    text.dataset.text = label;

    // Paso 1: pantalla baja desde arriba cubriendo el contenido
    gsap.set(loader, { display: "flex", yPercent: -100 });
    gsap.to(loader, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Paso 2: letras entran
        const split = splitAndAnimateIn(text, () => {
          // Paso 3: navegar mientras la cortina está abajo
          router.push(targetUrl);
          window.scrollTo(0, 0);
          useScroll.getState().lenis?.scrollTo(0, { immediate: true });

          // Paso 4: pausa de lectura → letras salen
          animateOut(split.chars, 0.5, () => {
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
  }, [isTransitioning, targetUrl]); // Solo estas dos disparan la transición

  // ─── Render ───────────────────────────────────────────────────────────────
  // IMPORTANTE: sin display inline-style (GSAP lo controla)
  // IMPORTANTE: h2 sin hijos JSX (JS lo controla vía ref)
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
