import re

with open('src/data/mocks/home.ts', 'r') as f:
    content = f.read()

# Replace PortfolioItem interface to add subtitle
content = content.replace(
    '  slug?: string;\n}',
    '  slug?: string;\n  subtitle?: string;\n}'
)

# Add subtitle to items
content = content.replace(
    'slug: "mar-vic",',
    'slug: "mar-vic",\n        subtitle: "Branding sofisticado y ecosistema e-commerce para diseño de interiores.",'
)
content = content.replace(
    'slug: "original",',
    'slug: "original",\n        subtitle: "Dirección de arte y diseño web orientado a reservas y conversión.",'
)
content = content.replace(
    'slug: "colorfit",',
    'slug: "colorfit",\n        subtitle: "Identidad visual y branding para marca de moda y fitness contemporánea.",'
)
content = content.replace(
    'slug: "jambu",',
    'slug: "jambu",\n        subtitle: "Rediseño de identidad y packaging inspirado en la riqueza natural.",'
)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(content)
