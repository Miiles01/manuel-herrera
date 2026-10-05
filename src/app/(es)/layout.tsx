import type { Metadata, Viewport } from "next";

import { generateMetadata, generateViewport } from "@/utils/seo/generate-page-metadata";
import { RootShell } from "@/layouts/root-shell";

export const metadata: Metadata = generateMetadata({ lang: "es" });
export const viewport: Viewport = generateViewport();

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="es">{children}</RootShell>;
}
