import { notFound } from "next/navigation";
import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { projects } from "@/data/projects";

export const alt = "TrinityByte project";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return renderOgImage(project.title);
}
