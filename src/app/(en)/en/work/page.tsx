import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import WorkPage from "@/views/pages/work";

export const metadata = buildMetadata({
  lang: "en",
  route: "work",
  title: "Projects — Manuel Herrera",
  description:
    "Branding, web design, social media and digital strategy projects by Manuel Herrera for brands seeking authenticity and scale.",
});

export default function Page() {
  return <WorkPage />;
}
