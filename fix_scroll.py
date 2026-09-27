with open('src/layouts/scroll-layout.tsx', 'r') as f:
    code = f.read()

# Replace lenis configs
code = code.replace('lerp: 0.055', 'lerp: 0.045')
code = code.replace('wheelMultiplier: 0.55', 'wheelMultiplier: 0.45')

with open('src/layouts/scroll-layout.tsx', 'w') as f:
    f.write(code)
