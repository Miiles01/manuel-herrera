"use client";

import Link from "next/link";

import { Inview } from "@/components/animation/springs/in-view";
import { BrandMark } from "@/components/ui/brand-mark";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillButton } from "@/components/ui/pill-button";
import { StackedLines } from "@/components/ui/stacked-lines";
import { useContactModal } from "@/hooks/use-contact-modal";
import { anchorScroll } from "@/utils/anchor-scroll";
import type { FooterContent } from "@/data/mocks/home";

export interface SiteFooterProps {
  brand: string;
  cta: string;
  footer: FooterContent;
}

export const SiteFooter = ({ brand, cta, footer }: SiteFooterProps) => {
  const openContact = useContactModal((s) => s.open);

  return (
    <footer
      id="contact"
      className="mt-3 rounded-card-lg bg-brand-deep px-6 py-14 text-on-brand sm:px-10 sm:py-16"
    >
    {/* CTA */}
    <div className="flex flex-col gap-8 border-b border-on-brand/15 pb-14 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow tone="light">Get started</Eyebrow>
        <StackedLines
          tag="p"
          lines={["Ready to", "play?"]}
          className="mt-4 text-6xl font-medium leading-[0.92] tracking-tight"
        />
      </div>
      <Inview
        tag="div"
        mode="once"
        from={{ opacity: 0, y: 20 }}
        to={{ opacity: 1, y: 0 }}
        delayIn={150}
        config={{ tension: 200, friction: 24 }}
      >
        <PillButton variant="light" onClick={openContact}>
          {cta}
        </PillButton>
      </Inview>
    </div>

    {/* Brand + link columns */}
    <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="max-w-xs">
        <span className="flex items-center gap-2 text-lg font-medium tracking-[0.2em] uppercase">
          <BrandMark className="size-5" title={`${brand} logo`} />
          {brand}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-on-brand/65">
          {footer.blurb}
        </p>
        <address className="mt-6 space-y-1 text-sm not-italic text-on-brand/80">
          <Link href={`mailto:${footer.contact.email}`} className="block hover:text-on-brand">
            {footer.contact.email}
          </Link>
          <Link href={`tel:${footer.contact.phone.replace(/[^+\d]/g, "")}`} className="block hover:text-on-brand">
            {footer.contact.phone}
          </Link>
          <span className="block text-on-brand/55">{footer.contact.address}</span>
        </address>
      </div>

      {footer.columns.map((column) => (
        <nav key={column.heading} aria-label={column.heading}>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-on-brand/50">
            {column.heading}
          </span>
          <ul className="mt-4 space-y-3 text-sm">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={anchorScroll(link.href)}
                  className="text-on-brand/80 outline-none hover:text-on-brand focus-visible:text-on-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="flex flex-col gap-4 border-t border-on-brand/15 pt-8 text-sm text-on-brand/60 sm:flex-row sm:items-center sm:justify-between">
      <p>{footer.copyright}</p>
      <nav aria-label="Social" className="flex gap-5">
        {footer.social.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-on-brand"
            rel="noopener"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Legal" className="flex gap-5">
        {footer.legal.map((link) => (
          <Link key={link.label} href={link.href} className="hover:text-on-brand">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
    </footer>
  );
};
