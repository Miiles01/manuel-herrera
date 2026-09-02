import re

with open('src/components/common/global-loader.tsx', 'r') as f:
    content = f.read()

# Add standard scroll reset after router push
scroll_fix = """              // Trigger the Next.js route change once covered and text is showing
              router.push(targetUrl);
              window.scrollTo(0, 0);
              useScroll.getState().lenis?.scrollTo(0, { immediate: true });"""

content = content.replace('              // Trigger the Next.js route change once covered and text is showing\n              router.push(targetUrl);', scroll_fix)

with open('src/components/common/global-loader.tsx', 'w') as f:
    f.write(content)
