import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

content = content.replace('"Web Coding"', '"Vibe Coding"')

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
