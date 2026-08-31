/**
 * Placeholder content for the Baseline home page.
 *
 * Mock data only — passed into the home view via props (never imported into a
 * component directly). Copy is original; asset paths point at the real on-court
 * photography in `public/assets/` (the hero keeps its dedicated background plate).
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FeaturedCollection {
  brand: string;
  title: string;
  blurb: string;
  cta: string;
  image: string;
  imageAlt: string;
}

export interface MembershipStat {
  value: string;
  caption: string;
  image: string;
  imageAlt: string;
}

export interface HeroContent {
  titleLines: string[];
  taglineLines: string[];
  backgroundImage: string;
  backgroundAlt: string;
  collections: FeaturedCollection[];
  membership: MembershipStat;
}

export interface TrustSlide {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  /** Four oversized ghost words shown behind this coach (2 rows of 2). */
  headline: [string, string, string, string];
}

export interface TrustContent {
  percent: { value: string; caption: string };
  badge: {
    index: string;
    title: string;
    body: string;
  };
  slides: TrustSlide[];
}

export interface Program {
  index: string;
  name: string;
  description: string;
  href: string;
}

export interface ProgramsContent {
  eyebrow: string;
  titleLines: string[];
  programs: Program[];
}

export interface CourtCard {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  tone: "clay" | "blue";
}

export interface FacilitiesContent {
  icon: string;
  iconAlt: string;
  titleLines: string[];
  body: string;
  courts: CourtCard[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsContent {
  eyebrow: string;
  titleLines: string[];
  stats: StatItem[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  titleLines: string[];
  testimonials: Testimonial[];
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface FooterContent {
  blurb: string;
  columns: FooterColumn[];
  contact: { email: string; phone: string; address: string };
  social: NavLink[];
  legal: NavLink[];
  copyright: string;
}

export interface HomeContent {
  brand: string;
  navLeft: NavLink[];
  cta: string;
  hero: HeroContent;
  trust: TrustContent;
  programs: ProgramsContent;
  facilities: FacilitiesContent;
  stats: StatsContent;
  testimonials: TestimonialsContent;
  footer: FooterContent;
}

export const homeContent: HomeContent = {
  brand: "Baseline",
  navLeft: [
    { label: "Programs & Coaches", href: "#programs" },
    { label: "Club & Events", href: "#facilities" },
  ],
  cta: "Book a Visit",
  hero: {
    titleLines: ["Own The Court"],
    taglineLines: ["Show Up,", "Level Up"],
    backgroundImage: "/assets/hero/hero-court.webp",
    backgroundAlt: "Player lunging for a shot on a hard court",
    collections: [
      {
        brand: "Baseline Pro",
        title: "Featured Gear",
        blurb: "Tour-grade rackets and apparel, picked by our coaching team.",
        cta: "Shop the kit",
        image: "/assets/2.webp",
        imageAlt: "Player driving a backhand on a hard court",
      },
      {
        brand: "Court Series",
        title: "Summer Drop",
        blurb: "Breathable on-court apparel built for long sessions.",
        cta: "View the line",
        image: "/assets/3.webp",
        imageAlt: "Player stretching for a forehand on clay",
      },
      {
        brand: "Academy Kit",
        title: "Junior Range",
        blurb: "Lighter frames and grips sized for developing players.",
        cta: "Browse juniors",
        image: "/assets/5.webp",
        imageAlt: "Player set in a ready stance on clay",
      },
    ],
    membership: {
      value: "9K+",
      caption: "Members on court",
      image: "/assets/1.webp",
      imageAlt: "Player waiting to return on a clay court",
    },
  },
  trust: {
    percent: { value: "100%", caption: "Coaching built around your game" },
    badge: {
      index: "#01",
      title: "Trusted by serious players",
      body: "From first-timers to nationally ranked juniors, players train here because the progress shows up on the scoreboard.",
    },
    slides: [
      {
        name: "Marco Vidal",
        role: "Head Coach",
        image: "/assets/5.webp",
        imageAlt: "Head coach set in a ready stance on clay",
        headline: ["Expert", "Result-", "Driven", "Coaching"],
      },
      {
        name: "Elena Sokolova",
        role: "Performance Coach",
        image: "/assets/4.webp",
        imageAlt: "Performance coach following through on a serve",
        headline: ["Sharper", "Faster", "Stronger", "Player"],
      },
      {
        name: "James Okoro",
        role: "Juniors Lead",
        image: "/assets/1.webp",
        imageAlt: "Juniors lead waiting to return on clay",
        headline: ["Future", "Champions", "Start", "Here"],
      },
    ],
  },
  programs: {
    eyebrow: "Training programs",
    titleLines: ["Built for", "every level"],
    programs: [
      {
        index: "01",
        name: "Junior Development",
        description: "Fundamentals, footwork, and match play for ages 6–14.",
        href: "#junior",
      },
      {
        index: "02",
        name: "Performance Squad",
        description: "High-volume training for competitive and ranked players.",
        href: "#performance",
      },
      {
        index: "03",
        name: "Adult Clinics",
        description: "Small-group sessions to sharpen technique and fitness.",
        href: "#adult",
      },
      {
        index: "04",
        name: "Private Coaching",
        description: "One-to-one sessions tailored to your goals and schedule.",
        href: "#private",
      },
    ],
  },
  facilities: {
    icon: "/assets/3.webp",
    iconAlt: "Player stretching for a forehand on clay",
    titleLines: ["Tour Our", "World-Class", "Courts"],
    body: "Reserve a court for focused practice, squad drills, or private sessions — and train in the same conditions you'll compete in.",
    courts: [
      {
        name: "Redline Clay",
        description: "A fast outdoor clay court tuned for long, physical rallies.",
        image: "/assets/1.webp",
        imageAlt: "Player on the baseline of an outdoor clay court",
        tone: "clay",
      },
      {
        name: "Harbor Court",
        description: "A sheltered hard court built for precision and night play.",
        image: "/assets/4.webp",
        imageAlt: "Player following through on a blue hard court",
        tone: "blue",
      },
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    titleLines: ["A club that", "keeps score"],
    stats: [
      { value: "24", label: "Certified coaches" },
      { value: "12", label: "Championship courts" },
      { value: "9K+", label: "Members training" },
      { value: "15", label: "Years on the baseline" },
    ],
  },
  testimonials: {
    eyebrow: "What players say",
    titleLines: ["Loved by", "the locker room"],
    testimonials: [
      {
        quote:
          "I added a level to my serve in one season. The coaching is detailed and it actually sticks.",
        name: "Priya Anand",
        role: "Performance Squad",
      },
      {
        quote:
          "Best courts in the city and a team that treats every member like a competitor.",
        name: "Lukas Brenner",
        role: "Adult Clinics",
      },
      {
        quote:
          "My daughter went from shy beginner to club champion. Worth every minute.",
        name: "Dana Okafor",
        role: "Parent, Junior Development",
      },
    ],
  },
  footer: {
    blurb:
      "A members' tennis club and academy where focused coaching meets championship courts.",
    columns: [
      {
        heading: "Programs",
        links: [
          { label: "Junior Development", href: "#junior" },
          { label: "Performance Squad", href: "#performance" },
          { label: "Adult Clinics", href: "#adult" },
          { label: "Private Coaching", href: "#private" },
        ],
      },
      {
        heading: "Club",
        links: [
          { label: "Membership", href: "#membership" },
          { label: "Facilities", href: "#facilities" },
          { label: "Events", href: "#club" },
          { label: "Pro Shop", href: "#shop" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About", href: "#about" },
          { label: "Coaches", href: "#programs" },
          { label: "Careers", href: "#careers" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
    contact: {
      email: "play@baseline.club",
      phone: "+1 (212) 555-0148",
      address: "120 Court Lane, New York",
    },
    social: [
      { label: "Instagram", href: "#instagram" },
      { label: "X", href: "#x" },
      { label: "YouTube", href: "#youtube" },
      { label: "LinkedIn", href: "#linkedin" },
    ],
    legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
    ],
    copyright: "© 2026 Baseline Tennis Club. All rights reserved.",
  },
};
