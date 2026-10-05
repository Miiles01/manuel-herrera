'use client';
import { useEffect } from 'react';
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

/** "ES ▾" button that lives INSIDE the navbar bar (next to the menu icon). */
export function LanguageButton({
  lang,
  open,
  onToggle,
}: {
  lang: Lang;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-lang-switcher
      aria-haspopup="true"
      aria-expanded={open}
      aria-label={lang === 'en' ? 'Change language' : 'Cambiar idioma'}
      onClick={onToggle}
      className="flex h-full items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
    >
      {LABELS[lang].short}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

/**
 * Dropdown for `LanguageButton`. It is rendered by the header OUTSIDE the
 * navbar's `overflow-hidden` box (so it isn't clipped) but anchored to the bar.
 * Selecting a language is a plain link: each language is its own root layout, so
 * it's a full page load.
 */
export function LanguagePanel({
  lang,
  open,
  onClose,
}: {
  lang: Lang;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-lang-switcher]')) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onClose, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onClose);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div data-lang-switcher className="absolute right-2 top-[64px] z-10 min-w-[150px] rounded-md bg-gray-50/95 backdrop-blur-sm p-1.5 shadow-lg">
      <ul>
        {LANGS.map((l) => (
          <li key={l}>
            <a
              href={localizedPath(pathname, l)}
              hrefLang={HREFLANG[l]}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              onClick={l === lang ? (e) => { e.preventDefault(); onClose(); } : markSwitch}
              className={`flex items-center justify-between gap-6 rounded px-3 py-2 text-sm hover:bg-gray-200/70 transition-colors ${l === lang ? 'font-semibold text-gray-900' : 'font-normal text-gray-600'}`}
            >
              {LABELS[l].name}
              {l === lang && <span aria-hidden="true">✓</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
