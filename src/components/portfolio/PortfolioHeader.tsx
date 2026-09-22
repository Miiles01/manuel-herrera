'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TransitionLink } from "@/components/ui/transition-link";

function CopyItem({ value, label, copiedText = "{copiedText}" }: { value: string; label: string; copiedText?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="relative flex items-center gap-2 text-left text-base font-normal text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group w-fit"
    >
      <span>{label}</span>
      
      {/* Icono de copiar (aparece al hacer hover, desaparece al copiar) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-4 h-4 transition-all duration-300 ${copied ? 'opacity-0 scale-75' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.5V19.5A2.25 2.25 0 0 1 13.5 21.75h-9a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 4.5 8.25H7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5h9A2.25 2.25 0 0 1 19.5 6.75v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9A2.25 2.25 0 0 1 8.25 4.5Z" />
      </svg>
      
      {/* Etiqueta de copiado */}
      <span
        className={`absolute left-full ml-1 text-xs font-medium bg-gray-900 text-white px-2 py-0.5 rounded-full transition-all duration-300 whitespace-nowrap ${
          copied ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
        }`}
      >
        {copiedText}
      </span>
    </button>
  );
}

export function PortfolioHeader({ lang = 'es' }: { lang?: 'es' | 'en' }) {
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
        <TransitionLink href={lang === 'en' ? '/en' : '/es'} className="font-normal text-white text-xl md:text-2xl tracking-tighter pointer-events-auto hover:opacity-75 transition-opacity block">
          <span className="md:hidden">Manu</span>
          <span className="hidden md:inline">Manuel Herrera</span>
        </TransitionLink>
      </div>

      {/* Botón {lang === 'en' ? "Let's talk" : 'Hablemos'} (Derecha Extrema) */}
      <div ref={hablemosRef} className="fixed top-8 right-4 md:right-12 z-50 mix-blend-difference pointer-events-none mt-3 md:mt-4 hidden md:block">
        <TransitionLink href={lang === 'en' ? '/en/contact' : '/es/contacto'} className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          {lang === 'en' ? "Let's talk" : 'Hablemos'}
        </TransitionLink>
      </div>

      {/* Contenedor del Menú Desplegable (Navbar) */}
      <div
        ref={headerRef}
        className={`fixed top-8 right-4 md:right-[140px] z-50 bg-gray-50/90 backdrop-blur-sm md:w-[420px] rounded-md pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-hidden ${isMenuOpen ? 'max-h-[600px] w-[calc(100vw-2rem)]' : 'max-h-[60px] w-[115px]'}`}
      >
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-5 md:px-6 h-[60px] w-full flex justify-between items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <span className="text-sm font-medium">{isMenuOpen ? (lang === 'en' ? 'Close' : 'Cerrar') : (lang === 'en' ? 'Menu' : 'Menú')}</span>
          <div className="w-8 h-[8px] relative">
            <div className={`absolute top-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>
            <div className={`absolute bottom-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? '-translate-y-[3.5px] -rotate-[15deg]' : ''}`}></div>
          </div>
        </button>

        <nav className={`flex flex-col gap-6 px-8 pt-6 text-2xl font-semibold text-gray-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
          <TransitionLink href={lang === 'en' ? '/en' : '/es'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Home' : 'Inicio'}</TransitionLink>
          <TransitionLink href={lang === 'en' ? '/en/work' : '/es/trabajo'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Work' : 'Trabajo'}</TransitionLink>
          <TransitionLink href={lang === 'en' ? '/en/contact' : '/es/contacto'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Contact' : 'Contacto'}</TransitionLink>
        </nav>

        <div className={`px-8 pt-8 pb-10 flex flex-col gap-3 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-150' : 'opacity-0'}`}>
          <CopyItem value="contmanuel77@gmail.com" label="contmanuel77@gmail.com" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
          <CopyItem value="+525610168992" label="+52 56 1016 8992" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
        </div>
      </div>
    </>
  );
}
