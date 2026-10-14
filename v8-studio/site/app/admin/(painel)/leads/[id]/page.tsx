import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { LEADS, leadPorId } from "@/content/admin-demo";

// Só os leads de exemplo existem enquanto não há backend.
// TODO backend: com servidor, trocar por renderização sob demanda (GET /api/leads/:id) e tirar o dynamicParams.
export const dynamicParams = false;

export function generateStaticParams() {
  return LEADS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/admin/leads/[id]">): Promise<Metadata> {
  const { id } = await params;
  const lead = leadPorId(id);
  return { title: lead ? lead.nome : "Lead" };
}

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const lead = leadPorId(id);
  if (!lead) notFound();
  return <LeadDetail base={lead} />;
}
