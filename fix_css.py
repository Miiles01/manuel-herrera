import re

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace('        top: 50%;\n        left: 5%;\n        transform: translateY(-50%);', '        top: calc(50% - 5vw);\n        left: 5%;')

with open('index.html', 'w') as f:
    f.write(html)
