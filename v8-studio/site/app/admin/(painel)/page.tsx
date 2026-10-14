import { Dashboard } from "@/components/admin/Dashboard";
import { PageHead } from "@/components/admin/PageHead";
import { diaMesCurto, PERIODO } from "@/content/admin-demo";

export default function PainelPage() {
  return (
    <>
      <PageHead kicker={`${PERIODO.rotulo}, de ${diaMesCurto(PERIODO.inicio)} a ${diaMesCurto(PERIODO.fim)}`} title="Painel" />
      <Dashboard />
    </>
  );
}
