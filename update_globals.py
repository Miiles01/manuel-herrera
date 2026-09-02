import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

content = content.replace("font-family: 'Manrope', sans-serif;", "font-family: var(--font-manrope), sans-serif;")

with open('src/app/globals.css', 'w') as f:
    f.write(content)
