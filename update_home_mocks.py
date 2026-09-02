import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

# Replace marquee array
old_marquee = """  marquee: [
    "Templates that work",
    "Design that sells",
    "Speed without compromise",
    "AI prompts on another level",
  ],"""

new_marquee = """  marquee: [
    "Branding",
    "Redes Sociales",
    "Web Coding",
    "Analítica",
  ],"""

content = content.replace(old_marquee, new_marquee)

# Replace carouselCta button
content = content.replace(
    'button: "Explore the collection",',
    'button: "Explorar toda la colección",'
)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
