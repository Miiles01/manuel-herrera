import { generateMetadata } from "@/utils/seo/generate-page-metadata";

export const metadata = generateMetadata({
  title: "Manuel Herrera — Creative Portfolio",
  description: "Creative portfolio of Manuel Herrera. Web development, interface design and digital experiences.",
  locale: "en_US"
});

import { HomeView } from "@/views/home";

export default function HomeEn() {
  return <HomeView lang="en" />;
}
