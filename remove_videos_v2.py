import re

with open('src/views/home/portfolio.tsx', 'r') as f:
    content = f.read()

# Replace the {active && ( <video ... /> )} block
pattern = r'\{active && \(\s*<video.*?</video>|/>\s*\)\s*\}'
# We also have to be careful with nested or self-closing tags
pattern = r'\{active && \(\s*<video[^>]*?/>\s*\)\}'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(content)
