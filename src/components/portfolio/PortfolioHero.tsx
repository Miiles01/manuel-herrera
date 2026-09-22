'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoaderStore } from "@/hooks/use-loader";

gsap.registerPlugin(ScrollTrigger);

// Custom ease used in the original project

export function PortfolioHero({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const heroRef = useRef(null);
  const isRevealed = useLoaderStore((s) => s.revealed);
  
  useGSAP(() => {
    // Inicializar SplitType
    const heroText = new SplitType('#hero-name', { types: 'chars' });
    gsap.set(heroText.chars, { yPercent: 100 });

    const introText = new SplitType('#intro-text', { types: 'lines,words' });
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
      <section id="hero-section" className="min-h-[75vh] md:h-[90vh] w-full flex flex-col justify-start md:justify-end px-4 md:px-12 lg:px-16 pb-16 md:pb-4 pt-[18vh] md:pt-32 relative z-0">
        <div id="hero-content" className="w-full relative flex flex-col">
          
          {/* Texto pequeño a la derecha (arriba en desktop, centro en mobile) */}
          <div className="order-2 md:order-1 w-full flex justify-start md:justify-end mt-8 md:mt-0 mb-0 translate-y-0 md:translate-y-10 relative z-10 max-sm:px-3">
            <div className="max-w-[85vw] md:max-w-sm md:mr-16">
              <p id="intro-text" className="text-[5vw] md:text-lg text-gray-800 font-medium leading-[1.3] md:leading-snug">
                {lang === 'en' ? "Hi! I'm Manuel Herrera, entrepreneur, visual creator, and strategist. I'm dedicated to scaling businesses." : '¡Hola! Soy Manuel Herrera, emprendedor, creador visual y estratega. Me dedico a escalar negocios.'}
              </p>
            </div>
          </div>

          {/* Texto Gigante (abajo en desktop, arriba en mobile) */}
          <h1 id="hero-name" className="order-1 md:order-2 text-[34vw] font-medium text-black leading-none tracking-tighter text-center" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}>
            Manu
          </h1>
          
          {/* Subtextos inferiores (debajo de intro en mobile, debajo de Manu en desktop) */}
          <div className="order-3 flex justify-between w-full text-sm md:text-base font-medium text-gray-500 max-sm:px-4 md:px-2 mt-8 md:mt-2">
            <span>Est. 2026</span>
            <span>{lang === 'en' ? 'Mexico' : 'México'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
