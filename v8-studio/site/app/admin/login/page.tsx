import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/admin/DemoNotice";
import { LoginForm } from "@/components/admin/LoginForm";
import m from "@/components/admin/login.module.css";

export const metadata: Metadata = { title: "Entrar" };

// TODO backend: autenticação. Hoje o formulário entra direto no painel ao enviar, sem conferir nada.
export default function LoginPage() {
  return (
    <main className={m.page}>
      <div className={m.wrap}>
        <DemoNotice />
        <LoginForm />
        <Link href="/" className={m.back}>
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}
