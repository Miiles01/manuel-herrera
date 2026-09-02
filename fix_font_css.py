import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

# Replace the tailwind mapping to use the literal 'Manrope' string
content = content.replace('--font-sans: var(--font-manrope);', "--font-sans: 'Manrope', sans-serif;")

with open('src/app/globals.css', 'w') as f:
    f.write(content)
