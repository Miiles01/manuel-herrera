"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { Spring } from "@/components/animation/springs/spring";
import { Hover } from "@/components/animation/springs/hover";
import { BrandMark } from "@/components/ui/brand-mark";
import { PillButton } from "@/components/ui/pill-button";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { useContactModal } from "@/hooks/use-contact-modal";
import { anchorScroll } from "@/utils/anchor-scroll";
import type { NavLink } from "@/data/mocks/home";

export interface SiteHeaderProps {
  brand: string;
  navLeft: NavLink[];
  cta: string;
}

const MENU_LINKS: NavLink[] = [
  { label: "Programs", href: "#programs" },
  { label: "Facilities", href: "#facilities" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const SiteHeader = ({ brand, navLeft, cta }: SiteHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stop = useScroll((s) => s.stop);
  const start = useScroll((s) => s.start);
  const openContact = useContactModal((s) => s.open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) stop();
    else start();
    return () => start();
  }, [open, stop, start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 px-6 pt-6 text-xs sm:px-10 sm:pt-8">
      <nav aria-label="Primary" className="hidden flex-1 gap-8 lg:flex">
        {navLeft.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={anchorScroll(link.href)}
            className="whitespace-nowrap leading-tight opacity-90 outline-none hover:opacity-100 focus-visible:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/"
        aria-label={`${brand} home`}
        className="flex items-center gap-2 text-base font-medium tracking-[0.2em] uppercase outline-none focus-visible:underline lg:flex-1 lg:justify-center"
      >
        <BrandMark className="size-5" title={`${brand} logo`} />
        {brand}
      </Link>

      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
        <button
          type="button"
          onClick={openContact}
          className="hidden cursor-pointer uppercase tracking-wide underline-offset-4 outline-none hover:underline focus-visible:underline sm:inline"
        >
          {cta}
        </button>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="grid size-10 cursor-pointer place-items-center rounded-pill bg-on-brand/15 outline-none backdrop-blur hover:bg-on-brand/25 focus-visible:ring-2 focus-visible:ring-on-brand"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block h-px w-4 bg-on-brand" />
            <span className="block h-px w-4 bg-on-brand" />
          </span>
        </button>
      </div>

      {mounted &&
        createPortal(
          <MenuOverlay
            open={open}
            brand={brand}
            cta={cta}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
    </header>
  );
};

const MenuOverlay = ({
  open,
  brand,
  cta,
  onClose,
}: {
  open: boolean;
  brand: string;
  cta: string;
  onClose: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openContact = useContactModal((s) => s.open);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] flex flex-col ${open ? "" : "pointer-events-none"}`}
    >
      <Spring
        tag="div"
        enabled={open}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ tension: 260, friction: 30 }}
        className="absolute inset-0 bg-brand-deep"
        onClick={onClose}
      />

      <Spring
        tag="div"
        enabled={open}
        from={{ opacity: 0, y: -24 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 220, friction: 28 }}
        // Outer padding mirrors <main>'s p-2/sm:p-3 inset; the inner padding
        // mirrors the hero header's px/pt — together they put the close button
        // exactly where the burger sits, so the icon swap is seamless.
        className="relative flex h-full flex-col p-2 text-on-brand sm:p-3"
      >
        <div className="flex h-full flex-col px-6 pt-6 pb-6 sm:px-10 sm:pb-8 sm:pt-8">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-medium uppercase tracking-[0.2em]">
            <BrandMark className="size-5" title={`${brand} logo`} />
            {brand}
          </span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid size-10 cursor-pointer place-items-center rounded-pill bg-on-brand/15 outline-none hover:bg-on-brand/25 focus-visible:ring-2 focus-visible:ring-on-brand"
          >
            <Hover
              tag="span"
              trigger={closeRef}
              from={{ rotate: 0 }}
              to={{ rotate: 90 }}
              config={{ tension: 300, friction: 18 }}
              className="grid place-items-center"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </Hover>
          </button>
        </div>

        <nav
          aria-label="Menu"
          className="flex flex-1 flex-col justify-center gap-2"
        >
          {MENU_LINKS.map((link, i) => (
            <Spring
              key={link.href}
              tag="div"
              enabled={open}
              from={{ opacity: 0, y: 28 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={120 + i * 70}
              config={{ tension: 200, friction: 26 }}
            >
              <Link
                href={link.href}
                onClick={anchorScroll(link.href, onClose)}
                className="block w-fit text-5xl font-medium tracking-tight outline-none hover:text-brand-light focus-visible:text-brand-light sm:text-7xl"
              >
                {link.label}
              </Link>
            </Spring>
          ))}
        </nav>

        <div className="flex flex-col gap-6 border-t border-on-brand/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <PillButton
            variant="light"
            onClick={() => {
              onClose();
              openContact();
            }}
          >
            {cta}
          </PillButton>
          <nav aria-label="Social" className="flex gap-5 text-sm text-on-brand/70">
            {["Instagram", "X", "YouTube", "LinkedIn"].map((s) => (
              <Link
                key={s}
                href="#"
                className="outline-none hover:text-on-brand focus-visible:text-on-brand"
              >
                {s}
              </Link>
            ))}
          </nav>
        </div>
        </div>
      </Spring>
    </div>
  );
};
