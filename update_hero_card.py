import re

with open('src/views/home/hero-card.tsx', 'r') as f:
    content = f.read()

# Replace the buttons
content = re.sub(
    r'<div className="flex items-center gap-4 max-sm:flex-col max-sm:items-stretch max-sm:gap-3">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# Replace the divider
content = re.sub(
    r'\{/\* Divider \+ social-proof row.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# Replace the avatars block
content = re.sub(
    r'<div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-1\.5 pl-2 pr-4 pointer-events-auto">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# Remove the HeroGradient import
content = re.sub(
    r'import \{ HeroGradient \}.*?\n',
    '',
    content
)

# Remove the HeroGradient component and change background to gray
content = re.sub(
    r'<div className="relative size-full overflow-hidden rounded-card bg-black">\s*<HeroGradient className="absolute inset-0 z-\[1\]" active=\{active\} />',
    '<div className="relative size-full overflow-hidden rounded-card bg-[#1e1e1e]">',
    content
)

with open('src/views/home/hero-card.tsx', 'w') as f:
    f.write(content)

