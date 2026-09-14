import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const metadata = generateMetadata({
  title: "Manuel Herrera — Portafolio",
  description: "Portafolio creativo de Manuel Herrera. Desarrollo web, diseño de interfaces y experiencias digitales.",
  locale: "es_MX"
});

import { HomeView } from "@/views/home";

export default function Home() {
  return <HomeView />;
}
