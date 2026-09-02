import re

with open('src/views/home/marquee.tsx', 'r') as f:
    content = f.read()

# Make text larger (text-[7vw] -> text-[11vw])
# And slightly adjust the bullet translation to stay centered
content = content.replace('text-[7vw]', 'text-[11vw]')
content = content.replace('translate-y-[0.8vw]', 'translate-y-[1.2vw]')

with open('src/views/home/marquee.tsx', 'w') as f:
    f.write(content)
