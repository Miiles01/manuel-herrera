import re

with open('src/views/home/portfolio.tsx', 'r') as f:
    content = f.read()

# Replace the video block with nothing
pattern_video = r'\{\s*/\* Each clip is multi-MB.*?\*/\s*\n\s*\{active && \(\s*<video.*?/>\s*\)\s*\}'
content = re.sub(pattern_video, '', content, flags=re.DOTALL)

# Replace the background color of the article
content = content.replace('bg-pf-card', 'bg-[#1e1e1e]')

with open('src/views/home/portfolio.tsx', 'w') as f:
    f.write(content)
