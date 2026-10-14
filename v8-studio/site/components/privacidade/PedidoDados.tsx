"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion, useTimeline } from "@/motion/hooks";
import { PressLink } from "@/motion/Lift";
import { clamp, sp } from "@/motion/lib/timing";
import s from "./privacidade.module.css";

// Pedidos previstos no art. 18 da LGPD, em linguagem simples.
const TIPOS = [
  { v: "confirmar", t: "Confirmar se vocês têm dados meus" },
  { v: "acesso", t: "Receber uma cópia dos meus dados" },
  { v: "correcao", t: "Corrigir dados errados ou desatualizados" },
  { v: "eliminacao", t: "Apagar os meus dados" },
  { v: "portabilidade", t: "Levar os meus dados para outro fornecedor" },
  { v: "compartilhamento", t: "Saber com quem os meus dados foram compartilhados" },
  { v: "oposicao", t: "Me opor a um uso dos meus dados" },
  { v: "revisao", t: "Revisar uma decisão tomada por sistema automático" },
  { v: "consentimento", t: "Revogar um consentimento" },
  { v: "outro", t: "Outro pedido" },
];
/** Pedidos que só dá para atender com uma explicação. */
const PRECISA_DETALHES = new Set(["correcao", "oposicao", "revisao", "outro"]);
const MAX_DETALHES = 1000;

type Campos = { nome: string; email: string; tipo: string; detalhes: string; titular: boolean };
type Erros = Partial<Record<keyof Campos, string>>;

const VAZIO: Campos = { nome: "", email: "", tipo: "", detalhes: "", titular: false };

function validar(c: Campos): Erros {
  const e: Erros = {};
  if (c.nome.trim().length < 3) e.nome = "Digite o seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = "Digite um e-mail válido, como nome@empresa.com.br.";
  if (!c.tipo) e.tipo = "Escolha o tipo de pedido.";
  if (PRECISA_DETALHES.has(c.tipo) && c.detalhes.trim().length < 10) e.detalhes = "Conte um pouco mais para a gente entender o pedido.";
  if (c.detalhes.length > MAX_DETALHES) e.detalhes = `Use até ${MAX_DETALHES} caracteres.`;
  if (!c.titular) e.titular = "Confirme que você é o titular dos dados ou quem o representa.";
  return e;
}

const ORDEM: (keyof Campos)[] = ["nome", "email", "tipo", "detalhes", "titular"];

/** Confirmação que entra com a mola rápida, como as notificações do filme. */
function Recebido({ email, onNovo }: { email: string; onNovo: () => void }) {
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: true, duration: 80 });
  const title = useRef<HTMLHeadingElement>(null);
  // Leva o foco para a confirmação, para quem usa leitor de tela ouvir o resultado.
  useEffect(() => title.current?.focus({ preventScroll: true }), []);
  const rise = (start: number): React.CSSProperties | undefined => {
    if (reduce) return undefined;
    const u = sp(frame, start, "snappy");
    if (Math.abs(1 - u) < 0.0005) return undefined;
    return { opacity: clamp(u * 1.4), transform: `translateY(${((1 - u) * 18).toFixed(2)}px)` };
  };
  return (
    <div className={s.done} role="status">
      <h3 className={s.doneTitle} tabIndex={-1} ref={title} style={rise(0)}>
        Pedido recebido.
      </h3>
      <p style={rise(6)}>
        A gente responde no e-mail <strong>{email}</strong> em até 15 dias. A confirmação de recebimento chega em até 1 dia útil.
      </p>
      <p className={s.doneNote} style={rise(10)}>
        Para proteger os seus dados, podemos pedir uma confirmação de identidade antes de atender o pedido.
      </p>
      <div className={s.doneActions} style={rise(14)}>
        <button type="button" className="btn btn--ghost" onClick={onNovo}>
          Fazer outro pedido
        </button>
        <PressLink href="/" className="btn btn--quiet">
          Voltar ao início
        </PressLink>
      </div>
    </div>
  );
}

/**
 * Formulário de pedidos sobre dados pessoais (LGPD). Valida no navegador e mostra a confirmação.
 * Ainda não envia nada: precisa da rota do backend antes de o site ir ao ar.
 */
export function PedidoDados() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [c, setC] = useState<Campos>(VAZIO);
  const [tentou, setTentou] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);

  const erros = tentou ? validar(c) : {};
  const set = <K extends keyof Campos>(k: K, v: Campos[K]) => setC((old) => ({ ...old, [k]: v }));
  const precisa = PRECISA_DETALHES.has(c.tipo);

  const enviar = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setTentou(true);
    const e = validar(c);
    const primeiro = ORDEM.find((k) => e[k]);
    if (primeiro) {
      document.getElementById(id(primeiro))?.focus();
      return;
    }
    // TODO backend: enviar { nome, email, tipo, detalhes, data e versão desta política } para a rota de pedidos LGPD,
    // com isca contra robôs e limite de envios por IP; avisar a equipe por e-mail e só então mostrar a confirmação.
    setEnviado(c.email.trim());
  };

  if (enviado) {
    return (
      <Recebido
        email={enviado}
        onNovo={() => {
          setC(VAZIO);
          setTentou(false);
          setEnviado(null);
        }}
      />
    );
  }

  const desc = (k: keyof Campos, hint?: string) => [erros[k] ? id(`${k}-erro`) : null, hint].filter(Boolean).join(" ") || undefined;

  return (
    <form className={s.form} onSubmit={enviar} noValidate aria-label="Pedido sobre dados pessoais">
      <div className="field">
        <label htmlFor={id("nome")}>Nome completo</label>
        <input
          id={id("nome")}
          name="nome"
          type="text"
          autoComplete="name"
          value={c.nome}
          onChange={(e) => set("nome", e.target.value)}
          aria-invalid={erros.nome ? true : undefined}
          aria-describedby={desc("nome")}
        />
        {erros.nome ? (
          <p className="field__error" id={id("nome-erro")}>
            {erros.nome}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={id("email")}>E-mail para a resposta</label>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@empresa.com.br"
          value={c.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={erros.email ? true : undefined}
          aria-describedby={desc("email", id("email-dica"))}
        />
        <p className="field__hint" id={id("email-dica")}>
          Use o mesmo e-mail que você informou no formulário Começar, se for o caso.
        </p>
        {erros.email ? (
          <p className="field__error" id={id("email-erro")}>
            {erros.email}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={id("tipo")}>O que você quer pedir?</label>
        <span className={s.select}>
          <select
            id={id("tipo")}
            name="tipo"
            value={c.tipo}
            onChange={(e) => set("tipo", e.target.value)}
            aria-invalid={erros.tipo ? true : undefined}
            aria-describedby={desc("tipo")}
          >
            <option value="" disabled>
              Escolha uma opção
            </option>
            {TIPOS.map((t) => (
              <option key={t.v} value={t.v}>
                {t.t}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
        {erros.tipo ? (
          <p className="field__error" id={id("tipo-erro")}>
            {erros.tipo}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor={id("detalhes")}>{precisa ? "Detalhes do pedido" : "Detalhes do pedido (opcional)"}</label>
        <textarea
          id={id("detalhes")}
          name="detalhes"
          rows={5}
          value={c.detalhes}
          onChange={(e) => set("detalhes", e.target.value)}
          aria-invalid={erros.detalhes ? true : undefined}
          aria-describedby={desc("detalhes", id("detalhes-dica"))}
        />
        <p className="field__hint" id={id("detalhes-dica")}>
          <span>{c.tipo === "correcao" ? "Diga qual dado está errado e qual é o certo." : "Não escreva senhas nem dados de saúde."}</span>
          <span className={c.detalhes.length > MAX_DETALHES ? "over" : undefined}>
            {c.detalhes.length}/{MAX_DETALHES}
          </span>
        </p>
        {erros.detalhes ? (
          <p className="field__error" id={id("detalhes-erro")}>
            {erros.detalhes}
          </p>
        ) : null}
      </div>

      <div className={s.checkField}>
        <label className="check" htmlFor={id("titular")}>
          <input
            id={id("titular")}
            name="titular"
            type="checkbox"
            checked={c.titular}
            onChange={(e) => set("titular", e.target.checked)}
            aria-invalid={erros.titular ? true : undefined}
            aria-describedby={desc("titular")}
          />
          <span>Sou o titular dos dados ou represento legalmente quem é.</span>
        </label>
        {erros.titular ? (
          <p className="field__error" id={id("titular-erro")}>
            {erros.titular}
          </p>
        ) : null}
      </div>

      <div className={s.submitRow}>
        <button type="submit" className="btn btn--primary">
          Enviar pedido
        </button>
        <p className={s.submitNote}>Resposta em até 15 dias, sem custo.</p>
      </div>
    </form>
  );
}
