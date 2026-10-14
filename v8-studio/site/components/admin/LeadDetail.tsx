"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  COMPAT,
  dataHoraBR,
  ORDEM_PERGUNTAS,
  origemDe,
  PERGUNTAS,
  quandoCurto,
  resposta,
  SERVICO_ROTULO,
  STATUS,
  STATUS_ORDEM,
  type Lead,
  type LeadStatus,
} from "@/content/admin-demo";
import { useInView, useMounted, useTimeline } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { clamp, sp } from "@/motion/lib/timing";
import { Reveal } from "@/motion/Reveal";
import { CountUp, PressButton } from "./controls";
import { IconVoltar } from "./icons";
import { CardHead, PageHead } from "./PageHead";
import { Segmented } from "./Segmented";
import { adicionarNota, mudarStatus, useLead, type EventoPainel } from "./store";
import d from "./lead.module.css";
import s from "./ui.module.css";

const COR: Record<LeadStatus, string> = {
  novo: "var(--color-blue)",
  contato: "var(--color-warn)",
  proposta: "var(--color-ink)",
  fechado: "var(--color-ok)",
  perdido: "var(--color-bad)",
};

/** Barra da compatibilidade que cresce com a mola pesada quando aparece. */
function Barra({ n }: { n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const mounted = useMounted();
  const frame = useTimeline({ play: inView, duration: 110 });
  const u = mounted ? sp(frame, 6, "heavy") : 1;
  return (
    <div ref={ref} className="progress" aria-hidden="true">
      <div className="progress__bar" style={{ width: `${(n * Math.min(1, u)).toFixed(2)}%` }} />
    </div>
  );
}

function Copiar({ valor, rotulo }: { valor: string; rotulo: string }) {
  const [estado, setEstado] = useState<"" | "ok" | "erro">("");
  const t = useRef<number | undefined>(undefined);
  const copiar = () => {
    const fim = (e: "ok" | "erro") => {
      setEstado(e);
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setEstado(""), 2000);
    };
    if (!navigator.clipboard) return fim("erro");
    navigator.clipboard.writeText(valor).then(
      () => fim("ok"),
      () => fim("erro"),
    );
  };
  return (
    <button type="button" className={d.copy} onClick={copiar} aria-label={estado ? undefined : `Copiar ${rotulo}`}>
      <span aria-live="polite">{estado === "ok" ? "Copiado" : estado === "erro" ? "Não copiou" : "Copiar"}</span>
    </button>
  );
}

/** Um evento da linha do tempo. Os que a equipe acabou de criar entram com a mola rápida. */
function Item({ e, origem }: { e: EventoPainel; origem: string }) {
  const frame = useTimeline({ play: Boolean(e.novo), duration: 50 });
  const u = e.novo ? sp(frame, 0, "snappy") : 1;
  const style = u >= 0.9995 ? undefined : { opacity: clamp(u * 1.4), transform: `translateY(${((1 - u) * -10).toFixed(2)}px)` };
  const quando = <time dateTime={e.em.replace(" ", "T")}>{dataHoraBR(e.em)}</time>;
  let dot: React.CSSProperties | undefined;
  let corpo: React.ReactNode;
  switch (e.tipo) {
    case "recebido":
      corpo = (
        <>
          <div className={d.itemHead}>
            <strong>Pedido recebido pelo formulário Começar</strong>
            {quando}
          </div>
          <p className={d.itemSub}>Começou em: {origem}</p>
        </>
      );
      break;
    case "aviso":
      corpo = (
        <div className={d.itemHead}>
          <strong>Aviso de lead novo enviado para a equipe</strong>
          {quando}
        </div>
      );
      break;
    case "status":
      dot = { background: COR[e.status] };
      corpo = (
        <>
          <div className={d.itemHead}>
            <strong>Status: {STATUS[e.status]}</strong>
            {quando}
          </div>
          <p className={d.itemSub}>Antes: {STATUS[e.de]}</p>
        </>
      );
      break;
    case "nota":
      corpo = (
        <>
          <div className={d.itemHead}>
            <strong>Nota de {e.autor}</strong>
            {quando}
          </div>
          <p className={d.noteText}>{e.texto}</p>
        </>
      );
      break;
  }
  return (
    <li className={d.item} style={style}>
      <span className={cx(d.dot, e.tipo === "nota" && d.dotNota)} style={dot} aria-hidden="true" />
      <div>{corpo}</div>
    </li>
  );
}

export function LeadDetail({ base }: { base: Lead }) {
  const lead = useLead(base);
  const [texto, setTexto] = useState("");
  const origem = origemDe(lead.origem.caminho);
  const mudancas = lead.eventos.filter((e) => e.tipo === "status");
  const ultima = mudancas.at(-1);
  const { total, motivos, limitado } = lead.compat;
  const notas = lead.eventos.filter((e) => e.tipo === "nota").length;
  // Mais novo primeiro, com chaves estáveis (a posição de cada evento na ordem em que aconteceu).
  const linha = lead.eventos.map((e, i) => ({ e, k: i })).reverse();

  const enviarNota = (ev: React.FormEvent) => {
    ev.preventDefault();
    const t = texto.trim();
    if (!t) return;
    // TODO backend: POST /api/leads/:id/notas
    adicionarNota(lead.id, t);
    setTexto("");
  };

  return (
    <>
      <Link href="/admin/leads/" className={d.back}>
        <IconVoltar />
        Voltar para leads
      </Link>
      <PageHead
        kicker={`Lead ${lead.id} · ${PERGUNTAS.segmento.opcoes[lead.respostas.segmento]}`}
        title={lead.nome}
        meta={`${SERVICO_ROTULO[lead.respostas.need]} · recebido em ${dataHoraBR(lead.quando)} · ${origem.rotulo}`}
      />

      <Reveal className={cx("card", d.statusCard)}>
        <div className={d.statusRow}>
          <div>
            <h2 className={s.cardTitle}>Status</h2>
            <p className={s.cardSub}>{ultima ? `Última mudança: ${quandoCurto(ultima.em)}.` : "Ainda sem contato. A promessa é responder em até 1 dia útil."}</p>
          </div>
          <Segmented
            name="status"
            legend="Status do lead"
            options={STATUS_ORDEM.map((st) => ({ value: st, label: STATUS[st], status: st }))}
            value={lead.status}
            onChange={(v) => mudarStatus(lead, v) /* TODO backend: PATCH /api/leads/:id { status } */}
          />
        </div>
      </Reveal>

      <div className={d.cols}>
        <div className={d.main}>
          <Reveal as="section" className={cx("card", d.oRespostas)}>
            <CardHead title="Respostas do formulário" sub={`As sete perguntas do Começar, enviadas em ${dataHoraBR(lead.quando)}.`} />
            <dl className={d.answers}>
              {ORDEM_PERGUNTAS.map((id) => (
                <div key={id}>
                  <dt>{PERGUNTAS[id].titulo}</dt>
                  <dd>{resposta(id, lead.respostas)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="section" className={cx("card", d.oHistorico)}>
            <CardHead title="Notas e histórico" sub={notas === 1 ? "1 nota da equipe. Só quem acessa o painel vê." : `${notas} notas da equipe. Só quem acessa o painel vê.`} />
            <form className={cx("field", d.noteForm)} onSubmit={enviarNota}>
              <label htmlFor="nova-nota" className="visually-hidden">
                Nova nota
              </label>
              <textarea id="nova-nota" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="O que foi conversado, próximos passos, combinados." rows={3} />
              <div className={d.noteActions}>
                <PressButton type="submit" className="btn btn--primary btn--sm" disabled={!texto.trim()}>
                  Adicionar nota
                </PressButton>
                <span className={d.noteHint}>A nota entra no histórico com a data e a hora.</span>
              </div>
            </form>
            <ol className={d.timeline} aria-label="Histórico, do mais novo para o mais antigo">
              {linha.map(({ e, k }) => (
                <Item key={k} e={e} origem={origem.rotulo} />
              ))}
            </ol>
          </Reveal>
        </div>

        <div className={d.side}>
          <Reveal as="section" className={cx("card", d.oContato)} delay={4}>
            <CardHead title="Contato" sub="Informado pelo cliente no fim do formulário." />
            <dl className={d.info}>
              <div>
                <dt>Nome</dt>
                <dd>
                  <span>{lead.nome}</span>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <span>{lead.contato.whatsapp}</span>
                  <Copiar valor={lead.contato.whatsapp} rotulo="WhatsApp" />
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <span>{lead.contato.email}</span>
                  <Copiar valor={lead.contato.email} rotulo="E-mail" />
                </dd>
              </div>
            </dl>
            <p className={d.consent}>
              Aceitou a política de privacidade em {dataHoraBR(lead.consentimento.em)}, {lead.consentimento.versao}.
            </p>
          </Reveal>

          <Reveal as="section" className={cx("card", d.oCompat)} delay={8}>
            <CardHead title="Compatibilidade" sub="Calculada pelo formulário com as respostas do cliente." />
            <div className={d.bigScore}>
              <b>
                <CountUp value={total} delay={8} />
              </b>
              <span>de 100</span>
            </div>
            <Barra n={total} />
            <ul className={d.why}>
              <li>
                <b>{COMPAT.base}</b>
                <span>Ponto de partida de todo pedido</span>
              </li>
              {motivos.map((m) => (
                <li key={m.texto}>
                  <b className={m.pontos < 0 ? d.neg : d.pos}>{m.pontos < 0 ? `−${Math.abs(m.pontos)}` : `+${m.pontos}`}</b>
                  <span>{m.texto}</span>
                </li>
              ))}
              {motivos.length === 0 ? (
                <li>
                  <b>0</b>
                  <span>Nenhum ajuste: as respostas combinam com o ponto de partida</span>
                </li>
              ) : null}
            </ul>
            <p className={d.whyNote}>
              {limitado ? `A conta passou do limite e ficou em ${total}. ` : ""}O resultado fica sempre entre {COMPAT.min} e {COMPAT.max}.
            </p>
          </Reveal>

          <Reveal as="section" className={cx("card", d.oOrigem)} delay={12}>
            <CardHead title="Origem" sub="Onde o pedido começou e a campanha que trouxe a visita." />
            <dl className={d.info}>
              <div>
                <dt>Página</dt>
                <dd>
                  <span>
                    {origem.rotulo}
                    <small>{lead.origem.caminho}</small>
                  </span>
                </dd>
              </div>
              {lead.origem.utm ? (
                (["source", "medium", "campaign"] as const).map((k) => (
                  <div key={k}>
                    <dt>utm_{k}</dt>
                    <dd>
                      <span>{lead.origem.utm?.[k]}</span>
                    </dd>
                  </div>
                ))
              ) : (
                <div>
                  <dt>Campanha</dt>
                  <dd>
                    <span>Sem parâmetros de campanha (UTM)</span>
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </div>
    </>
  );
}
