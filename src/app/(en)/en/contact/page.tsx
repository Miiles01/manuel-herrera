import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import ContactPage from "@/views/pages/contact";

export const metadata = buildMetadata({
  lang: "en",
  route: "contact",
  title: "Contact — Manuel Herrera",
  description:
    "Get in touch to talk about your project: brand strategy, branding, web design and digital experiences.",
});

export default function Page() {
  return <ContactPage />;
}
