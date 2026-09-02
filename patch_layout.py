import re

with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

# Add import
if 'import { GlobalLoader } from "@/components/common/global-loader";' not in content:
    content = content.replace('import { ScrollLayout } from "@/layouts/scroll-layout";', 'import { ScrollLayout } from "@/layouts/scroll-layout";\nimport { GlobalLoader } from "@/components/common/global-loader";')

# Inject into tree
if '<GlobalLoader />' not in content:
    content = content.replace('<LazyCookie />', '<LazyCookie />\n          <GlobalLoader />')

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)
