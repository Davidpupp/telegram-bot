import type { Metadata } from "next";
import { PageHead } from "@/components/admin/PageHead";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHead kicker="Painel" title="Configurações" meta="Dados da empresa, avisos de lead novo, prazo de resposta e medição." />
      <SettingsForm />
    </>
  );
}
