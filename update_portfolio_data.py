import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

# Replace PortfolioItem interface
old_interface = """export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  video: string;
}"""
new_interface = """export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  image?: string;
}"""
content = content.replace(old_interface, new_interface)

# Replace portfolio items data
old_portfolio = """  portfolio: {
    items: [
      {
        year: "2023",
        client: "logan cee",
        title: "Archin",
        discipline: "Architecture Design · Website",
        video: `${A}/portfolio-1.mp4`,
      },
      {
        year: "2024",
        client: "zumar",
        title: "Zumar",
        discipline: "Web Design & Development",
        video: `${A}/portfolio-2.mp4`,
      },
      {
        year: "2024",
        client: "nova",
        title: "Nova",
        discipline: "Brand · Motion · Web",
        video: `${A}/portfolio-3.mp4`,
      },
    ],
  },"""
new_portfolio = """  portfolio: {
    items: [
      {
        year: "2024",
        client: "Mar & Vic",
        title: "Mar & Vic",
        discipline: "Retail & Interior Design",
        image: "/proyectos/Mar-Vic/portada-1.webp",
      },
      {
        year: "2024",
        client: "Original",
        title: "Salon de Barbier",
        discipline: "Barbershop & Grooming",
        image: "/proyectos/Original/portada-1.webp",
      },
      {
        year: "2024",
        client: "Colorfit",
        title: "Colorfit",
        discipline: "Fitness & Wellness",
        image: "/proyectos/Colorfit/portada-1.webp",
      },
      {
        year: "2024",
        client: "Jambú",
        title: "Jambú",
        discipline: "Food & Consumer Goods",
        image: "/proyectos/Jambu/portada-1.webp",
      },
    ],
  },"""
content = content.replace(old_portfolio, new_portfolio)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
