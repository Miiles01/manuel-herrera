import re

with open('src/app/proyecto/[slug]/page.tsx', 'r') as f:
    content = f.read()

# Make sure notFound is imported
if 'import { notFound } from "next/navigation";' not in content:
    content = content.replace('import { useParams } from "next/navigation";', 'import { useParams, notFound } from "next/navigation";')

# Replace the manual fallback with notFound()
manual_fallback = """  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 font-sans">
        <h1 className="text-4xl font-normal tracking-tight mb-4 text-black">Proyecto no encontrado</h1>
        <p className="text-gray-500 mb-8 font-light">El proyecto que buscas no existe o ha sido movido.</p>
        <Link href="/trabajo" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-normal hover:bg-neutral-800 transition-colors">
          Volver a proyectos
        </Link>
      </div>
    );
  }"""

content = content.replace(manual_fallback, '  if (!project) return notFound();')

with open('src/app/proyecto/[slug]/page.tsx', 'w') as f:
    f.write(content)
