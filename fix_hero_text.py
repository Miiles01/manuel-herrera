with open('src/data/mocks/home.ts', 'r') as f:
    code = f.read()

# ES version
old_es = 'lines: ["Amo crear con", "intención"],'
new_es = 'lines: ["Crear con", "intención"],'
code = code.replace(old_es, new_es)

# Let's also check if there is an EN version to fix, like "I love creating with intention"
# It currently says: 'lines: ["I love creating with", "intention"]'
# Maybe change to 'lines: ["Create with", "intention"]'
old_en = 'lines: ["I love creating with", "intention"],'
new_en = 'lines: ["Create with", "intention"],'
code = code.replace(old_en, new_en)

with open('src/data/mocks/home.ts', 'w') as f:
    f.write(code)

print("Updated hero lines in home.ts")
