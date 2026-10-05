import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { HomeView } from "@/views/home";

export const metadata = buildMetadata({
  lang: "en",
  route: "home",
  title: "Manuel Herrera — Brand Strategist & Visual Creator",
  description:
    "Manuel Herrera's portfolio: brand strategy, branding, social media, vibe coding and digital experiences for businesses ready to scale.",
});

export default function HomeEn() {
  return <HomeView lang="en" />;
}
