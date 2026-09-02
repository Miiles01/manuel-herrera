import re

with open('src/views/home/marquee.tsx', 'r') as f:
    content = f.read()

# Make it safe for mobile: smaller text on mobile, huge on md and up
content = content.replace('text-[16vw]', 'text-[11vw] md:text-[16vw]')

with open('src/views/home/marquee.tsx', 'w') as f:
    f.write(content)
