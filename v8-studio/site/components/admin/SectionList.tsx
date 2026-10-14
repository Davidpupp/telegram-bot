"use client";

import { useEffect, useRef, useState } from "react";
import { SECOES, type SecaoId } from "@/content/admin-demo";
import { useSpringTo } from "@/motion/hooks";
import { SPRINGS } from "@/motion/lib/timing";
import { Switch } from "./controls";
import { IconDescer, IconSubir } from "./icons";
import l from "./landing.module.css";

export type SecaoLp = { id: SecaoId; ligada: boolean };
const ROW = 68;
const PASSO = ROW + 8;

const ORDINAL = ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "7ª", "8ª", "9ª"];

/** Seções ligadas que encostam uma na outra com fundo azul (a marca nunca põe duas faixas azuis seguidas). */
export function faixasAzuisSeguidas(secoes: SecaoLp[]) {
  const ligadas = secoes.filter((x) => x.ligada);
  const pares: [SecaoId, SecaoId][] = [];
  for (let i = 1; i < ligadas.length; i++) {
    if (SECOES[ligadas[i - 1].id].fundo === "azul" && SECOES[ligadas[i].id].fundo === "azul") pares.push([ligadas[i - 1].id, ligadas[i].id]);
  }
  return pares;
}

function Linha({
  sec,
  index,
  total,
  passo,
  conflito,
  onToggle,
  onMove,
}: {
  sec: SecaoLp;
  index: number;
  total: number;
  passo: number;
  conflito: boolean;
  onToggle: (on: boolean) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  // A posição persegue o novo lugar com a mola base: a linha desliza quando a ordem muda.
  const y = useSpringTo(index * passo, SPRINGS.base);
  const info = SECOES[sec.id];
  return (
    <li className={l.secRow} style={{ transform: `translateY(${y.toFixed(2)}px)` }} data-off={!sec.ligada} data-conflito={conflito}>
      <span className={l.swatch} data-fundo={info.fundo} aria-hidden="true" />
      <span className={l.secText}>
        <strong>{info.nome}</strong>
        <small>{info.descricao}</small>
      </span>
      {info.fixa ? (
        <span className={l.fixa}>Sempre primeiro</span>
      ) : (
        <>
          <Switch on={sec.ligada} onChange={onToggle} label={`Mostrar a seção ${info.nome}`} />
          <span className={l.moves}>
            <button type="button" id={`mover-${sec.id}--1`} className={l.move} disabled={index <= 1} aria-label={`Subir ${info.nome}`} onClick={() => onMove(-1)}>
              <IconSubir />
            </button>
            <button type="button" id={`mover-${sec.id}-1`} className={l.move} disabled={index >= total - 1} aria-label={`Descer ${info.nome}`} onClick={() => onMove(1)}>
              <IconDescer />
            </button>
          </span>
        </>
      )}
    </li>
  );
}

/** Lista das seções da landing page: liga, desliga e muda a ordem. O Topo fica sempre em primeiro. */
export function SectionList({ secoes, onChange }: { secoes: SecaoLp[]; onChange: (s: SecaoLp[]) => void }) {
  const passo = PASSO;
  const [anuncio, setAnuncio] = useState("");
  const foco = useRef<{ id: SecaoId; dir: -1 | 1 } | null>(null);
  const pares = faixasAzuisSeguidas(secoes);
  const emConflito = new Set(pares.flat());

  // Depois de mover, o foco volta para o botão que foi usado (ou para o outro, se este ficou desativado).
  useEffect(() => {
    const f = foco.current;
    if (!f) return;
    foco.current = null;
    const alvo = document.getElementById(`mover-${f.id}-${f.dir}`) as HTMLButtonElement | null;
    const outro = document.getElementById(`mover-${f.id}-${-f.dir}`) as HTMLButtonElement | null;
    (alvo && !alvo.disabled ? alvo : outro)?.focus();
  }, [secoes]);

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 1 || j >= secoes.length) return;
    const nova = [...secoes];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    foco.current = { id: secoes[i].id, dir };
    setAnuncio(`${SECOES[secoes[i].id].nome} agora é a ${ORDINAL[j]} seção de ${secoes.length}.`);
    onChange(nova);
  };
  const ligar = (i: number, on: boolean) => {
    const nova = secoes.map((x, k) => (k === i ? { ...x, ligada: on } : x));
    setAnuncio(`${SECOES[secoes[i].id].nome} ${on ? "ligada" : "desligada"}.`);
    onChange(nova);
  };

  return (
    <>
      <ol className={l.secList} style={{ height: secoes.length * passo - (passo - ROW) }} aria-label="Seções da página, na ordem em que aparecem">
        {secoes.map((sec, i) => (
          <Linha
            key={sec.id}
            sec={sec}
            index={i}
            total={secoes.length}
            passo={passo}
            conflito={sec.ligada && emConflito.has(sec.id)}
            onToggle={(on) => ligar(i, on)}
            onMove={(dir) => mover(i, dir)}
          />
        ))}
      </ol>
      <p className={l.legend} aria-hidden="true">
        <span>
          <i className={l.swatch} data-fundo="branco" /> Fundo branco
        </span>
        <span>
          <i className={l.swatch} data-fundo="papel" /> Fundo cinza-claro
        </span>
        <span>
          <i className={l.swatch} data-fundo="azul" /> Faixa azul
        </span>
      </p>
      <div className={l.warnBox} role="status">
        {pares.length ? (
          <p className={l.warn}>
            Duas faixas azuis ficaram seguidas: {pares.map(([a, b]) => `${SECOES[a].nome} e ${SECOES[b].nome}`).join("; ")}. Ligue uma seção de fundo branco entre elas ou mude a ordem.
          </p>
        ) : null}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {anuncio}
      </p>
    </>
  );
}
