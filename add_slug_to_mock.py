import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

# Replace PortfolioItem interface
old_interface = """export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  image?: string;
}"""
new_interface = """export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  image?: string;
  slug?: string;
}"""
content = content.replace(old_interface, new_interface)

# Replace the portfolio items data to add slugs
content = content.replace(
    'title: "Mar & Vic",',
    'title: "Mar & Vic",\n        slug: "mar-vic",'
)
content = content.replace(
    'title: "Salon de Barbier",',
    'title: "Salon de Barbier",\n        slug: "original",'
)
content = content.replace(
    'title: "Colorfit",',
    'title: "Colorfit",\n        slug: "colorfit",'
)
content = content.replace(
    'title: "Jambú",',
    'title: "Jambú",\n        slug: "jambu",'
)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
