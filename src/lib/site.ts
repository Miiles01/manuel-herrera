import { publicEnv } from "@/env";

export const siteConfig = {
  name: "Manuel Herrera",
  tagline: "Portafolio Creativo",
  linkedin: "https://www.linkedin.com/in/manuel-herrera-perfil/",
  description:
    "Portafolio creativo de Manuel Herrera. Desarrollo, diseño de interfaces y experiencias digitales sin límites.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://meetmanuel.com",
  author: "Manuel Herrera",
  themeColor: "#000000",
} as const;
