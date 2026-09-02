import re

with open('src/layouts/scroll-layout.tsx', 'r') as f:
    content = f.read()

# Add scroll reset to pathname change effect
fix = """  useEffect(() => {
    if (savedPathname.current !== pathname) {
      savedPathname.current = pathname;
      // ALWAYS RESET SCROLL ON ROUTE CHANGE (UNLESS IT'S JUST A HASH CHANGE)
      // Actually if there's a hash, we scroll to hash, otherwise scroll to top.
      if (pathname.includes("#")) {
        const hash = pathname.split("#").pop();
        if (hash) {
          setHash(hash);
        }
      } else {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, setHash, lenis]);"""

content = re.sub(r'  useEffect\(\(\) => \{\n    if \(savedPathname.current !== pathname\) \{\n      savedPathname.current = pathname;\n      if \(pathname.includes\("#"\)\) \{\n        const hash = pathname.split\("#"\).pop\(\);\n        if \(hash\) \{\n          setHash\(hash\);\n        \}\n      \}\n    \}\n  \}, \[pathname, setHash\]\);', fix, content)

with open('src/layouts/scroll-layout.tsx', 'w') as f:
    f.write(content)
