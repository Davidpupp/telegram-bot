"use client";

import Link from "next/link";
import { useState } from "react";
import { serviceHref, SERVICES } from "@/content/services";
import { useReducedMotion, useTimeline } from "@/motion/hooks";
import { PressLink } from "@/motion/Lift";
import { clamp, lerp, sp } from "@/motion/lib/timing";

type Option = { key: string; label: string; hint: string; reply: string; service: string };

const OPTIONS: Option[] = [
  {
    key: "contatos",
    label: "Trazer mais contatos",
    hint: "Orçamentos e agendamentos",
    reply:
      "Então o melhor começo costuma ser uma landing page: uma página com um objetivo só, um botão claro e um formulário curto. Quem chega sabe exatamente o que fazer.",
    service: "landing-pages",
  },
  {
    key: "vender",
    label: "Vender pela internet",
    hint: "Catálogo, carrinho e pagamento",
    reply: "Uma loja virtual resolve: catálogo organizado, carrinho simples e pagamento sem atrito, para vender todos os dias e não só no horário comercial.",
    service: "lojas-virtuais",
  },
  {
    key: "confianca",
    label: "Passar mais confiança",
    hint: "Quem somos, o que fazemos",
    reply: "Um site institucional bem feito faz isso: mostra quem você é, o que faz e por que escolher você, com clareza e em poucos segundos.",
    service: "sites",
  },
  {
    key: "organizar",
    label: "Organizar o atendimento",
    hint: "Pedidos, agenda, equipe",
    reply: "Um sistema sob medida junta pedidos, agenda e atendimento num lugar só, do jeito que a sua equipe já trabalha.",
    service: "sistemas",
  },
  {
    key: "celular",
    label: "Estar no celular do cliente",
    hint: "Avisos, acesso rápido",
    reply: "Um aplicativo deixa o seu serviço a um toque do cliente, com avisos na hora certa e acesso rápido ao que ele mais usa.",
    service: "aplicativos",
  },
];

/** Uma bolha que entra como as notificações do filme: sobe e cresce a partir do canto. */
function useBubble(frame: number, start: number, reduce: boolean): React.CSSProperties | undefined {
  if (reduce) return undefined;
  const u = sp(frame, start, "snappy");
  if (frame < start) return { opacity: 0, transform: "translateY(16px) scale(0.92)" };
  if (Math.abs(1 - u) < 0.0005) return undefined;
  return { opacity: clamp(u * 1.6), transform: `translateY(${((1 - u) * 16).toFixed(2)}px) scale(${lerp(0.92, 1, clamp(u)).toFixed(4)})` };
}

function Conversation({ option }: { option: Option }) {
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: true, duration: 150 });
  const me = useBubble(frame, 0, reduce);
  const typingOn = !reduce && frame >= 16 && frame < 74;
  const reply = useBubble(frame, 74, reduce);
  const service = SERVICES.find((s) => s.slug === option.service)!;
  const dot = (i: number) => ({ transform: `translateY(${(-5 * Math.max(0, Math.sin(((frame - 16) / 60) * Math.PI * 3 - i * 0.9))).toFixed(2)}px)` });

  return (
    <>
      <p className="bubble bubble--me" style={me}>
        {option.label}
      </p>
      {typingOn ? (
        <p className="bubble bubble--v8 typing" aria-label="V8 Studio está escrevendo">
          <i style={dot(0)} />
          <i style={dot(1)} />
          <i style={dot(2)} />
        </p>
      ) : null}
      {reduce || frame >= 74 ? (
        <div className="bubble bubble--v8" style={reply} aria-live="polite">
          <span className="bubble__who">V8 Studio</span>
          {option.reply}
          <div className="row" style={{ gap: 12, marginTop: 4 }}>
            <PressLink href={`/comecar/?objetivo=${option.key}`} className="btn btn--primary btn--sm">
              Começar com esse objetivo
            </PressLink>
            <Link href={serviceHref(service.slug)} className="btn btn--quiet">
              Ver {service.name.toLowerCase()}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Conversa rápida: o visitante escolhe o que quer do site e recebe uma resposta com o caminho certo. */
export function ChatDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  const option = OPTIONS.find((o) => o.key === picked) ?? null;
  return (
    <div className="chat">
      <p className="bubble bubble--v8">
        <span className="bubble__who">V8 Studio</span>
        Oi. O que você mais quer que o seu site faça?
      </p>
      <div className="chat__options" role="group" aria-label="Respostas">
        {OPTIONS.map((o, i) => (
          <button
            key={o.key}
            type="button"
            className="option"
            aria-pressed={picked === o.key}
            onClick={() => setPicked(o.key)}
            style={i === OPTIONS.length - 1 ? { gridColumn: "1 / -1" } : undefined}
          >
            <strong>{o.label}</strong>
            <span>{o.hint}</span>
          </button>
        ))}
      </div>
      {option ? <Conversation key={option.key} option={option} /> : null}
    </div>
  );
}
