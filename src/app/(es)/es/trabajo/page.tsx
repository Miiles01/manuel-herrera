import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import TrabajoPage from "@/views/pages/trabajo";

export const metadata = buildMetadata({
  lang: "es",
  route: "work",
  title: "Proyectos — Manuel Herrera",
  description:
    "Proyectos de branding, diseño web, redes sociales y estrategia digital de Manuel Herrera para marcas que buscan autenticidad y escalabilidad.",
});

export default function Page() {
  return <TrabajoPage />;
}
