import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

# Update hero
hero_old = """  hero: {
    lines: ["Prompts that", "think ahead"],
    templatesTitle: "Browse our\\ntemplates",
    bottomBlock: {
      leftText: "Turn engagement into conversions, trends into traffic, and views into revenue. All with a team that knows how to make social media work for you.",
      rightText: "From crafting scroll-stopping content to engineering algorithms we help your brand break through the noise and go viral.",
      avatars: [
        "https://i.pravatar.cc/100?img=1",
        "https://i.pravatar.cc/100?img=2",
        "https://i.pravatar.cc/100?img=3",
        "https://i.pravatar.cc/100?img=4",
        "https://i.pravatar.cc/100?img=5",
      ]
    }
  },"""

hero_new = """  hero: {
    lines: ["Ideas que", "conectan"],
    templatesTitle: "Creamos\\nexperiencias",
    bottomBlock: {
      leftText: "Diseño minimalista y estrategia digital.",
      rightText: "Desarrollo y creatividad.",
      avatars: []
    }
  },"""

content = content.replace(hero_old, hero_new)

# Update catalistDark
cd_old = """  catalistDark: {
    url: "Catalist.co.uk",
    pillLabel: "Catalist Lendings",
    pillTitle: "Apply for Loan",
    lead: "The Ultimate Engine for ",
    leadStrong: "Business Lending",
  },"""

cd_new = """  catalistDark: {
    url: "estrategia",
    pillLabel: "Marketing",
    pillTitle: "Redes Sociales",
    lead: "Impulsando marcas con ",
    leadStrong: "propósito",
  },"""

content = content.replace(cd_old, cd_new)

# Update catalistLight
cl_old = """  catalistLight: {
    url: "Catalist.co.uk",
    searchText: "Catalist business loan application",
    lead: "Access loans, ",
    leadStrong: "faster than ever",
  },"""

cl_new = """  catalistLight: {
    url: "desarrollo",
    searchText: "Experiencias interactivas",
    lead: "Soluciones ",
    leadStrong: "tecnológicas",
  },"""

content = content.replace(cl_old, cl_new)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
