import re

with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { Zen_Kaku_Gothic_New, Marck_Script } from "next/font/google";',
    'import { Zen_Kaku_Gothic_New, Marck_Script, Manrope } from "next/font/google";'
)

manrope_setup = """// Portfolio specific font
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
"""

content = content.replace(
    'const marckScript = Marck_Script({',
    manrope_setup + '\nconst marckScript = Marck_Script({'
)

content = content.replace(
    'className={`${zenKaku.variable} ${marckScript.variable}`}',
    'className={`${zenKaku.variable} ${marckScript.variable} ${manrope.variable}`}'
)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)

