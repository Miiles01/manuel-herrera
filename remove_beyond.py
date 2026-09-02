import re

with open('src/views/home/sphere-card.tsx', 'r') as f:
    content = f.read()

pattern = r'\s*<h2 className="pointer-events-none absolute left-\[4vmin\] top-\[4vmin\] z-\[4\] m-0 whitespace-nowrap text-left text-\[var\(--sr-heading-1\)\] font-normal leading-\[0\.85\] text-white">\s*<ScrollLetters\s*text=\{headingTop\}\s*p=\{p\}\s*styleFn=\{blockLetterStyle\}\s*indexOffset=\{0\}\s*totalOverride=\{total\}\s*/>\s*</h2>'

content = re.sub(pattern, '', content)

with open('src/views/home/sphere-card.tsx', 'w') as f:
    f.write(content)
