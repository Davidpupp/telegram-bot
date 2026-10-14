import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DemoNotice } from "@/components/admin/DemoNotice";
import s from "@/components/admin/shell.module.css";
import { cx } from "@/motion/lib/cx";

// TODO backend: proteger este grupo com a sessão (cookie httpOnly) e mandar para /admin/login/ sem login.
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cx("admin", s.admin)}>
      <a className="skip-link" href="#conteudo-painel">
        Pular para o conteúdo
      </a>
      <AdminSidebar />
      <main id="conteudo-painel" className="admin__main">
        <DemoNotice />
        {children}
      </main>
    </div>
  );
}
