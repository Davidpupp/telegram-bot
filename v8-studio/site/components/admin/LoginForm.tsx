"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/site/Logo";
import { cx } from "@/motion/lib/cx";
import { KineticText } from "@/motion/KineticText";
import { Reveal } from "@/motion/Reveal";
import { PressButton } from "./controls";
import m from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [ajuda, setAjuda] = useState(false);

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO backend: autenticação. POST /api/login com e-mail e senha (hash forte, limite de tentativas),
    // sessão em cookie httpOnly (mais longa com "manter conectado") e erro claro sem dizer qual campo errou.
    router.push("/admin/");
  };

  return (
    <Reveal className={cx("card", m.card)} y={20}>
      <form className={m.form} onSubmit={entrar} noValidate>
        <Link href="/" className="logo" aria-label="V8 Studio, ir para o site">
          <LogoMark />
          <span>Studio</span>
        </Link>
        <KineticText as="h1" text="Entrar no painel" delay={6} />
        <p className={m.lead}>Leads, posts, landing pages e configurações do site.</p>
        <div className="field">
          <label htmlFor="login-email">E-mail</label>
          <input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com.br" />
        </div>
        <div className="field">
          <label htmlFor="login-senha">Senha</label>
          <div className={m.pass}>
            <input id="login-senha" type={ver ? "text" : "password"} autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button type="button" className={m.show} onClick={() => setVer((v) => !v)} aria-pressed={ver} aria-controls="login-senha">
              {ver ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
        <div className={m.row}>
          <label className="check">
            <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
            Manter conectado
          </label>
          <button type="button" className={m.forgot} onClick={() => setAjuda((v) => !v)} aria-expanded={ajuda} aria-controls="login-ajuda">
            Esqueci a senha
          </button>
        </div>
        {ajuda ? (
          <p id="login-ajuda" className={m.help}>
            Peça um novo acesso para quem administra o painel. A troca de senha por e-mail chega com o backend.
          </p>
        ) : null}
        <PressButton type="submit" className={cx("btn btn--primary", m.submit)}>
          Entrar
        </PressButton>
        <p className={m.demoNote}>Na demonstração, o botão entra direto no painel.</p>
      </form>
    </Reveal>
  );
}
