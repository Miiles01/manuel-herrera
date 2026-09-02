import re

with open('src/views/home/hero-card.tsx', 'r') as f:
    content = f.read()

# Remove the perspective block containing images
images_block = r'<div className="pointer-events-none absolute inset-0 z-\[6\] \[perspective:1400px\]">.*?</div>\n        </animated\.div>\n      </div>'
content = re.sub(images_block, '', content, flags=re.DOTALL)

with open('src/views/home/hero-card.tsx', 'w') as f:
    f.write(content)
