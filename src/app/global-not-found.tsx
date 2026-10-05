import "./globals.css";
import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "404 — Manuel Herrera",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center text-black">
          <h1 className="text-7xl font-normal tracking-tighter">404</h1>
          <p className="max-w-md text-lg font-light text-gray-500">
            Esta página no existe · This page does not exist.
          </p>
          <nav className="flex gap-4 text-base font-medium">
            <a href="/es" className="rounded-full bg-black px-8 py-4 text-white">Inicio</a>
            <a href="/en" className="rounded-full border border-black px-8 py-4">Home</a>
          </nav>
        </main>
      </body>
    </html>
  );
}
