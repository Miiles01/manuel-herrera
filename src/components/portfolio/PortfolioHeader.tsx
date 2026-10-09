'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { TransitionLink } from "@/components/ui/transition-link";
import { LanguageButton, LanguagePanel } from "@/components/portfolio/LanguageSwitcher";

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

/** Menu opening, after Haven (havenconstructions.com.au): the panel grows open
 *  (0.5s, cubic-bezier(.4,0,.2,1)), and each item rises from below the panel's
 *  clipped edge — row and content each travel a bit (30px + 50px) on a long ease
 *  (0.6s, cubic-bezier(.65,0,0,1)) — in a 40ms stagger. No fades. The easings are
 *  written out literally in the classes: Tailwind only generates classes it can
 *  read in the source. */
const ITEM_STAGGER_MS = 40;

function MenuItem({ open, index, children }: { open: boolean; index: number; children: React.ReactNode }) {
  const delay = { transitionDelay: open ? `${index * ITEM_STAGGER_MS}ms` : "0ms" };
  const move = "transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0,1)]";
  return (
    <div className={`${move} ${open ? "translate-y-0" : "translate-y-[30px]"}`} style={delay}>
      <div className={`${move} ${open ? "translate-y-0" : "translate-y-[50px]"}`} style={delay}>
        {children}
      </div>
    </div>
  );
}

export function PortfolioHeader({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const closeLang = useCallback(() => setIsLangOpen(false), []);
  const slideTargets = () =>
    [headerRef.current, logoRef.current].filter(Boolean);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const THRESHOLD = 80;    // px from top before hide kicks in
    const DELTA = 5;         // min px delta to trigger show/hide

    const show = () => {
      if (!hiddenRef.current) return;
      hiddenRef.current = false;
      gsap.to(slideTargets(), {
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const hide = () => {
      if (hiddenRef.current) return;
      hiddenRef.current = true;
      gsap.to(slideTargets(), {
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
      gsap.to(slideTargets(), {
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

      {/* Contenedor del Menú Desplegable (Navbar). El wrapper exterior (sin overflow)
          ancla el dropdown de idioma; la caja interior (vidrio) crece al abrir.
          The page-transition name sits on the glass box itself, not the wrapper:
          an element with a view-transition-name isolates the backdrop of its
          descendants, which killed the backdrop blur. */}
      <div ref={headerRef} className="fixed top-8 right-4 md:right-12 z-50">
      <div
        className={`bg-gray-50/90 backdrop-blur-sm md:w-[420px] rounded-md pointer-events-auto overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMenuOpen ? 'w-[calc(100vw-2rem)]' : 'w-[calc(100vw-6.5rem)]'}`}
        style={{ viewTransitionName: "site-nav" }}
      >
        <div className="px-5 md:px-6 h-[60px] w-full flex justify-between items-center text-gray-600">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-full flex-1 text-left text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer">
            {isMenuOpen ? (lang === 'en' ? 'Close' : 'Cerrar') : (lang === 'en' ? 'Menu' : 'Menú')}
          </button>
          <div className="flex h-full items-center gap-5">
            <LanguageButton lang={lang} open={isLangOpen} onToggle={() => setIsLangOpen((o) => !o)} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? (lang === 'en' ? 'Close menu' : 'Cerrar menú') : (lang === 'en' ? 'Open menu' : 'Abrir menú')}
              className="h-full flex items-center hover:text-gray-900 transition-colors cursor-pointer"
            >
              <div className="w-8 h-[8px] relative">
                <div className={`absolute top-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? 'translate-y-[3.5px] rotate-[15deg]' : ''}`}></div>
                <div className={`absolute bottom-0 left-0 h-px bg-gray-600 w-full transition-all duration-300 origin-center ${isMenuOpen ? '-translate-y-[3.5px] -rotate-[15deg]' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Collapsible body: grows from 0 to its real height (grid 0fr → 1fr), so
            the timing matches the content instead of an arbitrary max-height. */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          inert={!isMenuOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <nav className="flex flex-col gap-6 px-8 pt-6 text-2xl font-semibold text-gray-900">
              <MenuItem open={isMenuOpen} index={0}>
                <TransitionLink href={lang === 'en' ? '/en' : '/es'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Home' : 'Inicio'}</TransitionLink>
              </MenuItem>
              <MenuItem open={isMenuOpen} index={1}>
                <TransitionLink href={lang === 'en' ? '/en/work' : '/es/trabajo'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Work' : 'Trabajo'}</TransitionLink>
              </MenuItem>
            </nav>

            <div className="px-8 pt-8 pb-10 flex flex-col gap-3">
              <MenuItem open={isMenuOpen} index={2}>
                <CopyItem value="contmanuel77@gmail.com" label="contmanuel77@gmail.com" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
              </MenuItem>
              <MenuItem open={isMenuOpen} index={3}>
                <CopyItem value="+525610168992" label="+52 56 1016 8992" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
              </MenuItem>
              <MenuItem open={isMenuOpen} index={4}>
                <a href="https://www.linkedin.com/in/manuel-herrera-perfil/" target="_blank" rel="noopener noreferrer" className="text-left text-base font-normal text-gray-600 hover:text-gray-900 transition-colors w-fit pt-1 flex items-center gap-2">
                  LinkedIn
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </MenuItem>
            </div>
          </div>
        </div>
      </div>
      <LanguagePanel lang={lang} open={isLangOpen} onClose={closeLang} />
      </div>
    </>
  );
}
