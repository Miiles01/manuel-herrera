import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    code = f.read()

# Fix 1: Add max-sm:hidden to the individual tiles
old_grid_class = 'className="absolute left-1/2 top-1/2 z-[-1] overflow-hidden bg-cover bg-center"'
new_grid_class = 'className="absolute left-1/2 top-1/2 z-[-1] overflow-hidden bg-cover bg-center max-sm:hidden"'
code = code.replace(old_grid_class, new_grid_class)

# Fix 2: Remove the wrapper div that broke the 3D context
old_wrapper = '<div className="max-sm:hidden">{gridTiles}</div>'
new_wrapper = '{gridTiles}'
code = code.replace(old_wrapper, new_wrapper)

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(code)

print("Fixed grid tiles 3D context")
