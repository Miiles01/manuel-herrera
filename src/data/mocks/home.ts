/**
 * Placeholder content for the Showreel home page ("Prompts that think ahead").
 * Mirrors the copy of the original vanilla showreel. Fed to the view via props
 * so no string is hardcoded in a component.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface CatalistContent {
  url: string;
  /** Headline / subhead split into plain + emphasised (bold) runs. */
  lead: string;
  leadStrong: string;
  /** Dark card: pill label + title. Light card: search query text. */
  pillLabel?: string;
  pillTitle?: string;
  searchText?: string;
}

export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  image?: string;
  slug?: string;
  subtitle?: string;
}

export interface ShowreelContent {
  brand: string;
  logo: string;
  nav: NavLink[];
  /** Black CTA pinned to the right of the header bar. */
  headerCta: { label: string; href: string };
  marquee: string[];
  hero: { 
    lines: string[]; 
    templatesTitle: string;
    bottomBlock?: {
      leftText: string;
      rightText: string;
      avatars: string[];
    };
  };
  catalistDark: CatalistContent;
  catalistLight: CatalistContent;
  /** CTA pinned under the 4-card carousel (the second block). */
  carouselCta: {
    button: string;
    href: string;
  };
  sphere: {
    headingTop: string;
    headingBottom: string[];
    /** Supporting paragraphs shown in the open sphere scene. */
    body: string[];
    /** Carousel-face chrome (slot-4 card preview). */
    cardLabel: string;
    cardUrl: string;
    cardHeading: string;
  };
  portfolio: {
    items: PortfolioItem[];
  };
  cta: {
    heading: string;
    /** Second heading line, rendered semi-transparent (like the hero subtitle). */
    headingFaded: string;
    sub: string;
    button: string;
    href: string;
  };
}

const A = "/assets/showreel";

export const homeContent: ShowreelContent = {
  brand: "Superconscious",
  logo: `${A}/star.svg`,
  nav: [
    { label: "Wearable", href: "#wearable" },
    { label: "Neural", href: "#neural" },
    { label: "Programs", href: "#programs" },
    { label: "Updates", href: "#updates" },
    { label: "Search", href: "#search" },
  ],
  headerCta: { label: "Get Started", href: "#get-started" },
  marquee: [
    "Branding",
    "Redes Sociales",
    "Vibe Coding",
    "Analítica",
  ],
  hero: {
    lines: ["Amo crear con", "intención"],
    templatesTitle: "Creamos\nexperiencias",
    bottomBlock: {
      leftText: "Mi misión es ayudar a otros a crear proyectos que transforman comunidades.",
      rightText: "11 años creando",
      avatars: []
    }
  },
  catalistDark: {
    url: "estrategia",
    pillLabel: "Marketing",
    pillTitle: "Redes Sociales",
    lead: "Impulsando marcas con ",
    leadStrong: "propósito",
  },
  catalistLight: {
    url: "Catalist.co.uk",
    searchText: "Analyze impact of lending in Business [Field]",
    lead: "Use AI-based system analyser — ",
    leadStrong: "all through one intelligent platform.",
  },
  carouselCta: {
    button: "Ver proyectos",
    href: "/trabajo",
  },
  sphere: {
    headingTop: "Beyond",
    headingBottom: ["all", "limits"],
    body: [
      "Superconscious is a neural engine that turns intent into action — anticipating your next move before you make it, across every device you already own.",
      "One model, every surface: wearable, neural, and beyond. No ceilings, no limits — just intelligence that keeps pace with the way you think.",
    ],
    cardLabel: "",
    cardUrl: "",
    cardHeading: "Inteligencia sin límites",
  },
  portfolio: {
    items: [
      {
        year: "2024",
        client: "Mar & Vic",
        title: "Mar & Vic",
        slug: "mar-vic",
        subtitle: "Branding sofisticado y ecosistema e-commerce para diseño de interiores.",
        discipline: "Retail & Interior Design",
        image: "/proyectos/Mar-Vic/portada-1.webp",
      },
      {
        year: "2024",
        client: "Miiles AI",
        title: "Miiles AI",
        slug: "miiles",
        subtitle: "Plataforma de gestión de talento y reclutamiento inteligente.",
        discipline: "AI & Consulting",
        image: "/proyectos/Miiles/portada-1.webp",
      },
      {
        year: "2024",
        client: "Virreinal Tepeyac",
        title: "Virreinal Tepeyac",
        slug: "virreinal-tepeyac",
        subtitle: "Construcción de marca y diseño web para un venue boutique de alto calibre.",
        discipline: "Events & Boutique Venue",
        image: "/proyectos/virreinal-tepeyac/portada-home.webp",
      },
      {
        year: "2024",
        client: "Jambú",
        title: "Jambú",
        slug: "jambu",
        subtitle: "Rediseño de identidad y packaging inspirado en la riqueza natural.",
        discipline: "Food & Consumer Goods",
        image: "/proyectos/Jambu/portada-1.webp",
      },
    ],
  },
  cta: {
    heading: "Hagamos esa idea",
    headingFaded: "realidad",
    sub: "Escríbeme y empecemos a trabajar en ese proyecto.",
    button: "Contactar",
    href: "/contacto",
  },
};
