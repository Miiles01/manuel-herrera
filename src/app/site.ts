import { publicEnv } from "@/env";

export const siteConfig = {
  name: "Manuel Herrera",
  tagline: "Portafolio Creativo",
  description:
    "Portafolio creativo de Manuel Herrera. Desarrollo, diseño de interfaces y experiencias digitales sin límites.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://meetmanuel.com",
  twitterHandle: "@manuelherrera",
  author: "Manuel Herrera",
  themeColor: "#000000",
} as const;
