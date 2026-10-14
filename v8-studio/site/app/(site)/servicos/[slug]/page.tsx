import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingTemplate } from "@/components/lp/LandingTemplate";
import { SERVICE_LPS, serviceLp } from "@/content/lps";

// As 5 landing pages de serviço, geradas na exportação estática. Qualquer outro slug vira 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_LPS.map((lp) => ({ slug: lp.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lp = serviceLp(slug);
  if (!lp) return {};
  return { title: lp.seo.title, description: lp.seo.description };
}

export default async function ServicePage({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const lp = serviceLp(slug);
  if (!lp) notFound();
  return <LandingTemplate lp={lp} />;
}
