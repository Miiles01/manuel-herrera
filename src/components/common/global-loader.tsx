"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { usePageTransition } from "@/hooks/use-page-transition";

export function GlobalLoader() {
  const router = useRouter();
  
  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);
  
  const { isTransitioning, targetUrl, finishTransition } = usePageTransition();
  
  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);

  // phase: "initial-loading", "done", "transitioning"
  const [phase, setPhase] = useState<"initial-loading" | "done" | "transitioning">("initial-loading");

  useGSAP(() => {
    // 1. INITIAL LOAD LOGIC
    if (phase === "initial-loading") {
      stopScroll();
      
      const greetings = ["Hola", "Hi", "Bonjour"];
      let currentGreetingIndex = 0;
      let isLoaded = false;
      
      const playNextGreeting = () => {
        if (!greetingRef.current || isLoaded) return;
        
        greetingRef.current.textContent = greetings[currentGreetingIndex];
        const split = new SplitType(greetingRef.current, { types: 'chars' });
        
        gsap.set(split.chars, { yPercent: 100 });
        
        const tl = gsap.timeline({
          onComplete: () => {
            if (!isLoaded) {
              currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
              playNextGreeting();
            }
          }
        });
        
        tl.to(split.chars, {
          yPercent: 0,
          stagger: { each: 0.05, from: "random" },
          duration: 0.6,
          ease: "power2.out"
        })
        .to(split.chars, {
          yPercent: -100,
          stagger: { each: 0.04, from: "random" },
          duration: 0.5,
          ease: "power2.in",
          delay: 0.4
        });
      };
      
      playNextGreeting();

      const finishInitialLoader = () => {
        if (isLoaded) return;
        isLoaded = true;
        gsap.killTweensOf(greetingRef.current?.querySelectorAll('.char') || []);

        const tlExit = gsap.timeline({
          onComplete: () => {
            startScroll();
            setReady(true);
            setRevealed(true);
            setPhase("done");
          }
        });

        tlExit.to(greetingRef.current, {
          autoAlpha: 0,
          duration: 0.3
        })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power3.inOut'
        }, "<0.1"); 
      };

      if (document.readyState === 'complete') {
        setTimeout(finishInitialLoader, 800); 
      } else {
        window.addEventListener('load', finishInitialLoader);
        setTimeout(finishInitialLoader, 3500);
      }
      
      return () => {
        window.removeEventListener('load', finishInitialLoader);
      };
    }
  }, { scope: loaderRef, dependencies: [phase] });


  // 2. PAGE TRANSITION LOGIC
  useEffect(() => {
    if (isTransitioning && targetUrl && phase === "done") {
      setPhase("transitioning");
      stopScroll();
      
      const tl = gsap.timeline();
      
      // Reset greeting for transition
      if (greetingRef.current) {
        greetingRef.current.textContent = "Hola";
        gsap.set(greetingRef.current, { autoAlpha: 1 });
      }

      // Slide down
      tl.set(loaderRef.current, { yPercent: -100, display: "flex" })
        .to(loaderRef.current, {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.inOut"
        });

      // Animate greeting
      tl.add(() => {
        if (greetingRef.current) {
          const split = new SplitType(greetingRef.current, { types: 'chars' });
          gsap.set(split.chars, { yPercent: 100 });
          gsap.to(split.chars, {
            yPercent: 0,
            stagger: 0.04,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              // Trigger the Next.js route change once covered and text is showing
              router.push(targetUrl);
              window.scrollTo(0, 0);
              useScroll.getState().lenis?.scrollTo(0, { immediate: true });
              
              // Slide text out
              gsap.to(split.chars, {
                yPercent: -100,
                stagger: 0.03,
                duration: 0.4,
                ease: "power2.in",
                delay: 0.2,
                onComplete: () => {
                  // Slide loader up
                  gsap.to(loaderRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onComplete: () => {
                      gsap.set(loaderRef.current, { display: "none" });
                      startScroll();
                      finishTransition();
                      setPhase("done");
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }, [isTransitioning, targetUrl, phase, router, startScroll, stopScroll, finishTransition]);

  // Hide completely when done to prevent pointer events blocking
  const isHidden = phase === "done" && !isTransitioning;

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black will-change-transform"
      style={{ display: isHidden ? "none" : "flex" }}
    >
      <h2 ref={greetingRef} className="text-white text-5xl md:text-7xl font-semibold tracking-tighter" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}></h2>
    </div>
  );
}
