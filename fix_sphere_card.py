import re

with open('src/views/home/sphere-card.tsx', 'r') as f:
    content = f.read()

content = content.replace('style={{ background: "var(--card-violet)" }}', 'style={{ background: "#1e1e1e" }}')

with open('src/views/home/sphere-card.tsx', 'w') as f:
    f.write(content)
