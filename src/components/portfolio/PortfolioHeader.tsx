'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TransitionLink } from "@/components/ui/transition-link";

function CopyItem({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-left text-base font-normal text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group"
    >
      <span>{label}</span>
      <span
        className={`text-xs font-medium bg-gray-900 text-white px-2 py-0.5 rounded-full transition-all duration-300 ${
          copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
        }`}
      >
        Copiado
      </span>
    </button>
  );
}

export function PortfolioHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hablemosRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const THRESHOLD = 80;    // px from top before hide kicks in
    const DELTA = 5;         // min px delta to trigger show/hide

    const show = () => {
      if (!hiddenRef.current) return;
      hiddenRef.current = false;
      gsap.to([headerRef.current, logoRef.current, hablemosRef.current], {
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const hide = () => {
      if (hiddenRef.current) return;
      hiddenRef.current = true;
      gsap.to([headerRef.current, logoRef.current, hablemosRef.current], {
        y: -120,
        duration: 0.45,
        ease: 'power3.in',
        overwrite: true,
      });
    };

    const onScroll = () => {
      // Use pageYOffset for broadest compatibility including Lenis
      const currentY = window.pageYOffset;
      const delta = currentY - lastYRef.current;

      if (currentY < THRESHOLD) {
        show();
      } else if (delta > DELTA && !isMenuOpen) {
        hide();
      } else if (delta < -DELTA) {
        show();
      }

      lastYRef.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  // Always show when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      hiddenRef.current = false;
      gsap.to([headerRef.current, logoRef.current, hablemosRef.current], {
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Logo (Izquierda) */}
      <div ref={logoRef} className="fixed top-8 left-4 md:left-12 z-50 mix-blend-difference pointer-events-none mt-2 md:mt-3">
        <TransitionLink href="/" className="font-normal text-white text-xl md:text-2xl tracking-tighter pointer-events-auto hover:opacity-75 transition-opacity block">
          Manuel Herrera
        </TransitionLink>
      </div>

      {/* Botón Hablemos (Derecha Extrema) */}
      <div ref={hablemosRef} className="fixed top-8 right-4 md:right-12 z-50 mix-blend-difference pointer-events-none mt-3 md:mt-4 hidden md:block">
        <TransitionLink href="/contacto" className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          Hablemos
        </TransitionLink>
      </div>

      {/* Contenedor del Menú Desplegable (Navbar) */}
      <div
        ref={headerRef}
        className={`fixed top-8 right-4 md:right-[140px] z-50 bg-gray-50/90 backdrop-blur-sm w-[calc(100vw-2rem)] md:w-[420px] rounded-md pointer-events-auto transition-[max-height] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${isMenuOpen ? 'max-h-[600px]' : 'max-h-[60px]'}`}
      >
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-6 h-[60px] w-full flex justify-between items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <span className="text-sm font-medium">{isMenuOpen ? 'Cerrar' : 'Menú'}</span>
          <div className="w-8 h-[8px] relative">
            <div className={`absolute top-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>
            <div className={`absolute bottom-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? '-translate-y-[3.5px] -rotate-[15deg]' : ''}`}></div>
          </div>
        </button>

        <nav className={`flex flex-col gap-6 px-8 pt-6 text-2xl font-semibold text-gray-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
          <TransitionLink href="/" className="hover:text-gray-500 transition-colors">Inicio</TransitionLink>
          <TransitionLink href="/trabajo" className="hover:text-gray-500 transition-colors">Trabajo</TransitionLink>
          <TransitionLink href="/contacto" className="hover:text-gray-500 transition-colors">Contacto</TransitionLink>
        </nav>

        <div className={`px-8 pt-8 pb-10 flex flex-col gap-3 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-150' : 'opacity-0'}`}>
          <CopyItem value="contmanuel77@gmail.com" label="contmanuel77@gmail.com" />
          <CopyItem value="+525610168992" label="+52 56 1016 8992" />
        </div>
      </div>
    </>
  );
}
