import os

os.makedirs('src/components/portfolio', exist_ok=True)

# 1. PortfolioHeader.tsx
with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write("""'use client';
import { useState } from 'react';
import Link from 'next/link';

export function PortfolioHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Logo (Izquierda) */}
      <div className="fixed top-8 left-4 md:left-12 z-50 mix-blend-difference pointer-events-none mt-2 md:mt-3">
        <Link href="/" className="font-bold text-white text-xl md:text-2xl tracking-tighter pointer-events-auto hover:opacity-75 transition-opacity block">
          Manuel Herrera
        </Link>
      </div>

      {/* Botón Hablemos (Derecha Extrema) */}
      <div className="fixed top-8 right-4 md:right-12 z-50 mix-blend-difference pointer-events-none mt-3 md:mt-4 hidden md:block">
        <Link href="/contacto.html" className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          Hablemos
        </Link>
      </div>

      {/* Contenedor del Menú Desplegable (Navbar) */}
      <div className={`fixed top-8 right-[100px] md:right-[140px] z-50 bg-gray-50/90 backdrop-blur-sm w-72 md:w-96 rounded-md pointer-events-auto shadow-sm transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${isMenuOpen ? 'max-h-[600px]' : 'max-h-[50px]'}`}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-6 h-[50px] w-full flex justify-between items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <span className="text-sm font-medium">{isMenuOpen ? 'Cerrar' : 'Menú'}</span>
          <div className="flex flex-col gap-1.5 w-8 relative">
            <div className={`h-px bg-gray-600 w-full transition-transform duration-300 ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>
            <div className={`h-px bg-gray-600 w-full transition-transform duration-300 ${isMenuOpen ? 'translate-y-[-3.5px] rotate-[-15deg]' : ''}`}></div>
          </div>
        </button>

        <nav className={`flex flex-col gap-6 px-8 pt-6 pb-12 text-2xl font-bold text-gray-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
          <Link href="/trabajo.html" className="hover:text-gray-500 transition-colors">Mis trabajos</Link>
          <Link href="/contacto.html" className="hover:text-gray-500 transition-colors">Contactar</Link>
        </nav>
      </div>
    </>
  );
}
""")

# 2. PortfolioHero.tsx
with open('src/components/portfolio/PortfolioHero.tsx', 'w') as f:
    f.write("""'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PortfolioHero() {
  const heroRef = useRef(null);
  
  useGSAP(() => {
    // Parallax del Hero (Efecto "Tapar")
    gsap.to('.hero-content-inner', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Expansión y Parallax de la imagen Gris
    gsap.to('.scrub-container-inner', {
      width: '100%',
      height: '100vh',
      borderRadius: '0px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.scrub-container-inner',
        start: 'top 90%', 
        end: 'top 10%',   
        scrub: true
      }
    });

    gsap.fromTo('.scrub-image-inner', 
      { yPercent: -20 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.scrub-container-inner',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }, { scope: heroRef });

  return (
    <div ref={heroRef} className="relative z-10 bg-[#FFFFFF]">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="hero-content-inner flex flex-col items-center justify-center w-full z-10 mix-blend-difference mt-20 md:mt-32">
          <p className="intro-text text-white text-lg md:text-2xl font-medium tracking-tight mb-8 md:mb-12 text-center max-w-2xl px-4" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}>
            Hola, soy Manuel. Desarrollador web y diseñador estratégico. Transformo ideas complejas en experiencias digitales fluidas y memorables.
          </p>
          <h1 id="hero-name" className="text-[34vw] font-medium text-white leading-none tracking-tighter text-center" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'}}>
            Manu
          </h1>
        </div>
      </section>

      {/* 2. Scroll reveal image (Gris) */}
      <section className="h-[120vh] relative flex items-center justify-center bg-[#FFFFFF] z-20">
        <div className="scrub-container-inner w-[40%] h-[40vh] md:h-[60vh] rounded-[2rem] overflow-hidden relative">
          <img className="scrub-image-inner absolute top-0 left-0 w-full h-[140%] object-cover" src="https://picsum.photos/id/400/1200/1600" alt="Placeholder hero" />
        </div>
      </section>
    </div>
  );
}
""")

# 3. PortfolioMarquee.tsx
with open('src/components/portfolio/PortfolioMarquee.tsx', 'w') as f:
    f.write("""'use client';
export function PortfolioMarquee() {
  return (
    <section className="bg-[#FFFFFF] py-20 overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <h2 className="text-8xl md:text-[12rem] font-bold text-gray-900 tracking-tighter mx-8 uppercase">Estrategia de crecimiento •</h2>
        </div>
        <div className="animate-marquee inline-block" aria-hidden="true">
          <h2 className="text-8xl md:text-[12rem] font-bold text-gray-900 tracking-tighter mx-8 uppercase">Estrategia de crecimiento •</h2>
        </div>
      </div>
    </section>
  );
}
""")

