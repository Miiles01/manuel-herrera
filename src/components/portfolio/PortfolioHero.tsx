'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoaderStore } from "@/hooks/use-loader";

gsap.registerPlugin(ScrollTrigger);

// Custom ease used in the original project

export function PortfolioHero() {
  const heroRef = useRef(null);
  const isRevealed = useLoaderStore((s) => s.revealed);
  
  useGSAP(() => {
    // Inicializar SplitType
    const heroText = new SplitType('#hero-name', { types: 'chars' });
    gsap.set(heroText.chars, { yPercent: 100 });

    const introText = new SplitType('#intro-text', { types: 'lines, words' });
    introText.lines?.forEach(line => {
      line.style.overflow = 'hidden';
      line.style.paddingBottom = '0.2em';
      line.style.marginBottom = '-0.2em';
    });
    gsap.set(introText.words, { yPercent: 110 });

    // Parallax del Hero
    gsap.to('#hero-content', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      heroText.revert();
      introText.revert();
    };
  }, { scope: heroRef });

  // Disparar la animación de entrada cuando el loader termina
  useGSAP(() => {
    if (isRevealed) {
      const heroChars = document.querySelectorAll('#hero-name .char');
      const introWords = document.querySelectorAll('#intro-text .word');

      if (heroChars.length) {
        gsap.to(heroChars, {
          yPercent: 0,
          stagger: { each: 0.05, from: "random" },
          duration: 0.8,
          ease: "power2.out",
        });
      }

      if (introWords.length) {
        gsap.to(introWords, {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out"
        });
      }
    }
  }, [isRevealed]);

  return (
    <div ref={heroRef} className="relative z-10 bg-[#FFFFFF]">
      <section id="hero-section" className="h-[90vh] w-full flex flex-col justify-end px-4 md:px-12 lg:px-16 pb-4 pt-32 relative z-0">
        <div id="hero-content" className="w-full relative">
          {/* Texto pequeño a la derecha */}
          <div className="w-full flex justify-end mb-0 translate-y-6 md:translate-y-10 relative z-10">
            <div className="max-w-xs md:max-w-sm md:mr-16">
              <p id="intro-text" className="text-base md:text-lg text-gray-800 font-medium leading-snug">
                Soy Manuel, Marketer y me dedico a escalar negocios.
              </p>
            </div>
          </div>

          {/* Texto Gigante */}
          <h1 id="hero-name" className="text-[34vw] font-medium text-black leading-none tracking-tighter text-center" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}>
            Manu
          </h1>
          
          {/* Subtextos inferiores */}
          <div className="flex justify-between w-full text-xs font-medium text-gray-500 px-2 mt-2">
            <span>Est. 2026</span>
            <span>México</span>
          </div>
        </div>
      </section>
    </div>
  );
}
