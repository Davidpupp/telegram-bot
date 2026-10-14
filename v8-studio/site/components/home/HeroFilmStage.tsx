"use client";

import { useState } from "react";
import { SEGMENT_KEYS, SEGMENTS, type SegmentKey } from "@/motion/film/segments";
import { MotionPlayer } from "@/motion/MotionPlayer";
import { Reveal } from "@/motion/Reveal";

/**
 * O filme do topo e a pergunta que conversa com o visitante: ao trocar o tipo de negócio,
 * o filme recomeça com a busca, os concorrentes e o site daquele negócio.
 */
export function HeroFilmStage() {
  const [seg, setSeg] = useState<SegmentKey>("odonto");
  const s = SEGMENTS[seg];
  return (
    <Reveal className="hero-film" delay={30} y={48}>
      <div className="player-frame hero-film__frame">
        <MotionPlayer
          id="hero-film"
          inputProps={{ seg }}
          restartKey={seg}
          label={`Animação: alguém procura "${s.query}" e só encontra outras empresas. Com um site da V8, encontra ${s.brand}; o site se monta e os contatos começam a chegar.`}
        />
      </div>
      <div className="hero-film__ask">
        <label htmlFor="hero-negocio">Imagine que você tem</label>
        <span className="select-inline">
          <select id="hero-negocio" value={seg} onChange={(e) => setSeg(e.target.value as SegmentKey)}>
            {SEGMENT_KEYS.map((k) => (
              <option key={k} value={k}>
                {SEGMENTS[k].label}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      <p className="hero-film__note small muted">Exemplo ilustrativo. Os nomes das empresas são fictícios.</p>
    </Reveal>
  );
}
