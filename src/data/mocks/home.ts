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
    lines: ["Crear con", "intención"],
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
    href: "/es/trabajo",
  },
  sphere: {
    headingTop: "",
    headingBottom: ["Piensa", "diferente"],
    body: [
      "Naabi Kanabi <span class=\"opacity-50\">—</span> <strong>Co-Fundador | Marketing Manager</strong><br/><span class=\"opacity-75 block mt-1 leading-snug text-[0.9em]\">Posicionamiento de marca, SEO/SEM y paid media, contenido para redes, vibe coding.</span>",
      "Miiles AI <span class=\"opacity-50\">—</span> <strong>CEO</strong><br/><span class=\"opacity-75 block mt-1 leading-snug text-[0.9em]\">Funnels de adquisición con IA, ventas corporativas B2B, vibe coding y automatización. Campañas en Ads, A/B testing, lifecycle marketing y configuración email.</span>",
      "Claro Pay <span class=\"opacity-50\">—</span> <strong>Diseñador de Experiencia del Usuario</strong><br/><span class=\"opacity-75 block mt-1 leading-snug text-[0.9em]\">Investigación UX para app de pagos, benchmarking, pruebas de usabilidad.</span>",
      "BRIX Agency <span class=\"opacity-50\">—</span> <strong>Diseñador de Experiencia del Usuario</strong><br/><span class=\"opacity-75 block mt-1 leading-snug text-[0.9em]\">Diseño UX/UI en Figma, pruebas de usabilidad.</span>",
      "Fiverr <span class=\"opacity-50\">—</span> <strong>Branding Freelancer</strong><br/><span class=\"opacity-75 block mt-1 leading-snug text-[0.9em]\">+50 clientes en LATAM, identidad visual, colaboraciones con influencers.</span>"
    ],
    cardLabel: "",
    cardUrl: "",
    cardHeading: "Desde la idea hasta la ejecución",
  },
  portfolio: {
    items: [
      {
        year: "2024",
        client: "Naabi Kanabi",
        title: "Naabi Kanabi",
        slug: "naabi-kanabi",
        subtitle: "Diseño de experiencia y branding para productos de bienestar natural.",
        discipline: "Skincare y Dermocosmética",
        image: "/proyectos/Naabi-Kanabi/portada-home-v2.webp",
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
        client: "The Decant Society",
        title: "The Decant Society",
        slug: "the-decant-society",
        subtitle: "Elegante identidad visual y plataforma e-commerce para perfumería premium.",
        discipline: "Perfumery & Beauty",
        image: "/proyectos/the-decant-society/portada-home.webp",
      },
    ],
  },
  cta: {
    heading: "Hagamos esa",
    headingFaded: "idea realidad",
    sub: "",
    button: "Ver proyectos",
    href: "/es/trabajo",
  },
};

export const homeContentEn: ShowreelContent = {
  ...homeContent,
  marquee: [
    "Branding",
    "Social Media",
    "Vibe Coding",
    "Analytics",
  ],
  hero: {
    ...homeContent.hero,
    lines: ["Create with", "intention"],
    templatesTitle: "We create\nexperiences",
    bottomBlock: {
      leftText: "My mission is to help others create projects that transform communities.",
      rightText: "11 years creating",
      avatars: []
    }
  },
  catalistDark: {
    ...homeContent.catalistDark,
    url: "strategy",
    pillLabel: "Marketing",
    pillTitle: "Social Media",
    lead: "Empowering brands with ",
    leadStrong: "purpose",
  },
  carouselCta: {
    button: "View projects",
    href: "/en/work",
  },
  sphere: {
    ...homeContent.sphere,
    cardHeading: "From idea to execution",
  },
  portfolio: {
    items: [
      {
        year: "2024",
        client: "Naabi Kanabi",
        title: "Naabi Kanabi",
        slug: "naabi-kanabi",
        subtitle: "Experience design and branding for natural wellness products.",
        discipline: "Skincare & Dermocosmetics",
        image: "/proyectos/Naabi-Kanabi/portada-home-v2.webp",
      },
      {
        year: "2024",
        client: "Miiles AI",
        title: "Miiles AI",
        slug: "miiles",
        subtitle: "Intelligent talent management and recruitment platform.",
        discipline: "AI & Consulting",
        image: "/proyectos/Miiles/portada-1.webp",
      },
      {
        year: "2024",
        client: "Virreinal Tepeyac",
        title: "Virreinal Tepeyac",
        slug: "virreinal-tepeyac",
        subtitle: "Brand building and web design for a high-caliber boutique venue.",
        discipline: "Events & Boutique Venue",
        image: "/proyectos/virreinal-tepeyac/portada-home.webp",
      },
      {
        year: "2024",
        client: "The Decant Society",
        title: "The Decant Society",
        slug: "the-decant-society",
        subtitle: "Elegant visual identity and e-commerce platform for premium perfumery.",
        discipline: "Perfumery & Beauty",
        image: "/proyectos/the-decant-society/portada-home.webp",
      },
    ],
  },
  cta: {
    heading: "Let's make that idea",
    headingFaded: "a reality",
    sub: "",
    button: "View projects",
    href: "/en/work",
  },
};
