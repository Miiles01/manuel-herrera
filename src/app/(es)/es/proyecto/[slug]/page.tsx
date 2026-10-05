import { notFound } from "next/navigation";

import { portfolioProjects } from "@/data/portfolio";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import ProyectoPage from "@/views/pages/proyecto";

type Params = { slug: string };

const findProject = (slug: string) =>
  Object.values(portfolioProjects).find((p) => p.slug === slug);

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return Object.values(portfolioProjects).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  return buildMetadata({
    lang: "es",
    route: "project",
    slug,
    title: `${project.title} — Caso de estudio | Manuel Herrera`,
    description: project.subtitle.es,
    image: `/proyectos/${project.folder}/${project.previewImages[0]}`,
  });
}

export default function Page() {
  return <ProyectoPage />;
}
