'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HREFLANG, LANGS, localizedPath, type Lang } from '@/utils/seo/routes';

const LABELS: Record<Lang, { short: string; name: string }> = {
  es: { short: 'ES', name: 'Español' },
  en: { short: 'EN', name: 'English' },
};

/** Flag read by `GlobalLoader` so a language switch doesn't replay the intro. */
export const SKIP_INTRO_KEY = 'skip-intro';

const markSwitch = () => {
  try {
    sessionStorage.setItem(SKIP_INTRO_KEY, '1');
  } catch {
    /* storage unavailable — the intro simply replays */
  }
};

/**
 * Desktop language button + dropdown. The button is its own fixed layer (forwarded
 * ref, so the header can slide it away on scroll) because it uses
 * `mix-blend-difference` like the other header items; the dropdown panel is a
 * separate un-blended layer so it keeps its normal colours. Selecting a language
 * is a plain link: each language is its own root layout, so it's a full page load.
 */
export const LanguageSwitcher = forwardRef<HTMLDivElement, { lang: Lang }>(function LanguageSwitcher({ lang }, ref) {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-lang-switcher]')) close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', close);
    };
  }, [open]);

  return (
    <>
      <div ref={ref} className="fixed top-8 right-[132px] z-50 mix-blend-difference pointer-events-none mt-4 hidden md:block">
        <button
          type="button"
          data-lang-switcher
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={lang === 'en' ? 'Change language' : 'Cambiar idioma'}
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto flex items-center gap-1 text-sm font-medium text-white hover:opacity-75 cursor-pointer"
        >
          {LABELS[lang].short}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <div data-lang-switcher className="fixed top-20 right-[120px] z-50 hidden md:block min-w-[150px] rounded-md bg-gray-50/95 backdrop-blur-sm p-1.5 shadow-lg">
          <ul>
            {LANGS.map((l) => (
              <li key={l}>
                <a
                  href={localizedPath(pathname, l)}
                  hrefLang={HREFLANG[l]}
                  lang={l}
                  aria-current={l === lang ? 'true' : undefined}
                  onClick={l === lang ? (e) => { e.preventDefault(); setOpen(false); } : markSwitch}
                  className={`flex items-center justify-between gap-6 rounded px-3 py-2 text-sm hover:bg-gray-200/70 transition-colors ${l === lang ? 'font-semibold text-gray-900' : 'font-normal text-gray-600'}`}
                >
                  {LABELS[l].name}
                  {l === lang && <span aria-hidden="true">✓</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
});

/** Mobile: language links inside the open menu panel. */
export function MobileLanguageLinks({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? '/';
  return (
    <div className="flex items-center gap-3 text-base text-gray-600 md:hidden">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="text-gray-300">/</span>}
          <a
            href={localizedPath(pathname, l)}
            hrefLang={HREFLANG[l]}
            lang={l}
            aria-current={l === lang ? 'true' : undefined}
            onClick={l === lang ? undefined : markSwitch}
            className={l === lang ? 'font-semibold text-gray-900' : 'hover:text-gray-900'}
          >
            {LABELS[l].name}
          </a>
        </span>
      ))}
    </div>
  );
}
