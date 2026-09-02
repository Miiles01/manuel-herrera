'use client';

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

export function PortfolioLoader() {
  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);
  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const loaderRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);

  const [phase, setPhase] = useState("loading");
  
  useGSAP(() => {
    if (phase === "done") return;
    
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

    const finishLoader = () => {
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

    // Simulate load event + safety timeout
    if (document.readyState === 'complete') {
      setTimeout(finishLoader, 800); 
    } else {
      window.addEventListener('load', finishLoader);
      setTimeout(finishLoader, 3500);
    }
    
    return () => {
      window.removeEventListener('load', finishLoader);
    };
  }, { scope: loaderRef });

  if (phase === "done") return null;

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] flex items-center justify-center bg-black will-change-transform">
      <h2 ref={greetingRef} className="text-white text-5xl md:text-7xl font-semibold tracking-tighter" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}></h2>
    </div>
  );
}
