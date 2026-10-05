import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import ContactoPage from "@/views/pages/contacto";

export const metadata = buildMetadata({
  lang: "es",
  route: "contact",
  title: "Contacto — Manuel Herrera",
  description:
    "Escríbeme para hablar de tu proyecto: estrategia de marca, branding, diseño web y experiencias digitales.",
});

export default function Page() {
  return <ContactoPage />;
}
