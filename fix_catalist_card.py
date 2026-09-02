import re

with open('src/views/home/catalist-card.tsx', 'r') as f:
    content = f.read()

# Change the dynamic ink to just a fixed dark gray (same as hero card)
content = content.replace('className={`relative size-full overflow-hidden rounded-card ${ink}`}', 'className="relative size-full overflow-hidden rounded-card bg-[#1e1e1e]"')

# Remove the background image
content = re.sub(r'<Image src=\{bg\}.*?/>\n', '', content)

with open('src/views/home/catalist-card.tsx', 'w') as f:
    f.write(content)
