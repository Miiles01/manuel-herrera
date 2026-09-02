import re

with open('src/views/home/showreel-stage.tsx', 'r') as f:
    content = f.read()

# Remove the TargetStar import
content = re.sub(r'import \{ TargetStar \} from "@/components/3d/target-star";\n', '', content)

# Remove the TargetStar component usage
content = re.sub(r'\s*<TargetStar className="absolute inset-0" active=\{vis\.target\} />', '', content)

# Change bg-ink to bg-[#1e1e1e] for the Target block container
content = content.replace(
    'className="absolute left-1/2 top-1/2 z-[-1] h-screen w-screen overflow-hidden bg-ink"',
    'className="absolute left-1/2 top-1/2 z-[-1] h-screen w-screen overflow-hidden bg-[#1e1e1e]"'
)

with open('src/views/home/showreel-stage.tsx', 'w') as f:
    f.write(content)
