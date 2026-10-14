import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadsBrowser, LeadsBrowserFromQuery } from "@/components/admin/LeadsBrowser";
import { PageHead } from "@/components/admin/PageHead";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <>
      <PageHead kicker="Pedidos do formulário Começar" title="Leads" />
      {/* Os filtros vêm da URL; sem Suspense, a exportação estática não gera esta página. */}
      <Suspense fallback={<LeadsBrowser />}>
        <LeadsBrowserFromQuery />
      </Suspense>
    </>
  );
}
