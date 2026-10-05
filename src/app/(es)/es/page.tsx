import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { HomeView } from "@/views/home";

export const metadata = buildMetadata({
  lang: "es",
  route: "home",
  title: "Manuel Herrera — Estratega de marca y creador visual",
  description:
    "Portafolio de Manuel Herrera: estrategia de marca, branding, redes sociales, vibe coding y experiencias digitales para negocios que quieren escalar.",
});

export default function Home() {
  return <HomeView />;
}
