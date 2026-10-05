import { Manrope, Marck_Script } from "next/font/google";

import { getSiteStructuredData } from "@/utils/seo/structured-data";
import type { Lang } from "@/utils/seo/routes";

import { LazyCookie } from "@/components/common/Cookie";
import { AdaptiveGrid } from "@/components/common/grid";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { GlobalLoader } from "@/components/common/global-loader";

import "@/app/globals.css";

// Primary sans for all UI/headings (variable font, latin subset only).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Handwritten accent face — the italic "Works" in the portfolio title.
const marckScript = Marck_Script({
  variable: "--font-marck",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

/**
 * Shared document shell. Each language group (`(es)`, `(en)`) is its own root
 * layout so `<html lang>` is correct in the server-rendered HTML.
 */
export function RootShell({
  lang,
  children,
}: Readonly<{ lang: Lang; children: React.ReactNode }>) {
  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${marckScript.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData(lang)),
          }}
        />
        <ScrollLayout>
          <AdaptiveGrid />
          <ReducedMotion />
          <LazyCookie />
          <GlobalLoader />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
