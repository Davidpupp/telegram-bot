import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp, typedCount, typingSchedule } from "../lib/timing";
import { Browser, CheckBadge, Cursor, Ripple, Toast, pathAt } from "./kit";

// Demonstração "Landing pages" (800 × 720, 7 s, loop): a página se monta, alguém preenche o formulário,
// envia, e o pedido chega como notificação. Marca fictícia.
const B = { x: 40, y: 40, w: 720, h: 640, bar: 52 };
const FORM = { x: 36, y: 250, w: 648, h: 300 };
const NAME = "Marina Costa";
const KIND = "Cozinha";
const T_NAME = typingSchedule(NAME, 96, 3, 3);
const T_KIND = typingSchedule(KIND, 170, 3.4, 5);
// Centros dos campos e do botão em coordenadas da composição.
const ox = B.x + FORM.x;
const oy = B.y + B.bar + FORM.y;
const F1 = { x: ox + 40 + 120, y: oy + 82 };
const F2 = { x: ox + 40 + 120, y: oy + 160 };
const BTN = { x: ox + FORM.w / 2, y: oy + 240 };

const Field: React.FC<{ label: string; value: string; focus: number; caret: boolean; y: number; opacity: number }> = ({ label, value, focus, caret, y, opacity }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: y, opacity }}>
    <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 8 }}>{label}</div>
    <div
      style={{
        height: 48,
        borderRadius: 14,
        boxShadow: `inset 0 0 0 2px ${focus > 0.5 ? C.blue : C.line}${focus > 0.5 ? ", 0 0 0 4px rgba(35,71,214,0.14)" : ""}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: 18,
        fontFamily: FONT.ui,
        fontSize: 18,
        color: C.ink,
      }}
    >
      {value}
      <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, background: C.blue, opacity: caret ? 1 : 0 }} />
    </div>
  </div>
);

const DemoLanding: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, 360, 392, E.in);
  const pageIn = sp(f, 0, "base");
  const word = (i: number) => sp(f, 10 + i * 3.3, "text");
  const formIn = sp(f, 30, "soft");

  const name = NAME.slice(0, typedCount(f, T_NAME));
  const kind = KIND.slice(0, typedCount(f, T_KIND));
  const focus1 = f >= 90 && f < 164 ? 1 : 0;
  const focus2 = f >= 164 && f < 236 ? 1 : 0;
  const sent = ramp(f, 242, 254);
  const ok = sp(f, 254, "snappy");
  const press = bump(f, 236, 12);
  const toast = sp(f, 276, "base");

  const keys: [number, number, number][] = [
    [44, 760, 760],
    [86, F1.x, F1.y],
    [140, F1.x, F1.y],
    [160, F2.x, F2.y],
    [200, F2.x, F2.y],
    [226, BTN.x, BTN.y],
    [270, BTN.x, BTN.y],
    [312, 900, 820],
  ];
  const cur = pathAt(f, keys);
  const headline = [["Reforma", "sem"], ["dor", "de", "cabeça."]];

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}>
      <div style={{ opacity: clamp(pageIn * 1.5), transform: `translateY(${(1 - pageIn) * 40}px)` }}>
        <Browser x={B.x} y={B.y} w={B.w} h={B.h} bar={B.bar} url="clarareformas.com.br" radius={26}>
          <div style={{ position: "absolute", left: 36, right: 36, top: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 26, color: C.blue, letterSpacing: "-0.03em" }}>Clara</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 44, height: 6, borderRadius: 3, background: C.line }} />
              ))}
              <div style={{ height: 34, padding: "0 16px", borderRadius: 17, background: C.blue, color: C.white, fontFamily: FONT.ui, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center" }}>Orçamento</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 36, top: 84, width: 648, fontFamily: FONT.display, fontWeight: 800, fontSize: 48, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.ink }}>
            {headline.map((line, li) => (
              <div key={li} style={{ display: "flex", columnGap: "0.24em", whiteSpace: "nowrap" }}>
                {line.map((w, wi) => {
                  const u = word(li * 2 + wi);
                  return (
                    <span key={wi} style={{ display: "inline-block", overflow: "hidden", padding: "0.12em 0.05em 0.16em", margin: "-0.12em -0.05em -0.16em" }}>
                      <span style={{ display: "inline-block", transformOrigin: "0% 100%", transform: `translateY(${(1 - u) * 112}%) rotate(${(1 - clamp(u)) * 6}deg)` }}>{w}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 36, top: 196, fontFamily: FONT.ui, fontSize: 18, color: C.gray, opacity: ramp(f, 24, 36) }}>
            Orçamento detalhado e obra com prazo combinado.
          </div>
          <div
            style={{
              position: "absolute",
              left: FORM.x,
              top: FORM.y,
              width: FORM.w,
              height: FORM.h,
              borderRadius: 24,
              background: C.white,
              boxShadow: `inset 0 0 0 2px ${C.line}`,
              opacity: clamp(formIn * 1.5),
              transform: `translateY(${(1 - formIn) * 50}px)`,
              overflow: "hidden",
            }}
          >
            <Field label="Seu nome" value={name} focus={focus1} caret={focus1 > 0 && f % 40 < 24} y={30} opacity={1 - sent} />
            <Field label="O que você quer reformar?" value={kind} focus={focus2} caret={focus2 > 0 && f % 40 < 24} y={108} opacity={1 - sent} />
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: 210,
                height: 60,
                borderRadius: 30,
                background: C.blue,
                color: C.white,
                fontFamily: FONT.ui,
                fontWeight: 600,
                fontSize: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 1 - sent,
                transform: `scale(${1 - 0.05 * press})`,
              }}
            >
              Quero meu orçamento
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: clamp(ok * 1.4), transform: `translateY(${(1 - ok) * 24}px)` }}>
              <div style={{ transform: `scale(${lerp(0.6, 1, clamp(ok))})` }}>
                <CheckBadge size={72} bg={C.blue} fg={C.white} />
              </div>
              <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 34, letterSpacing: "-0.03em", color: C.ink }}>Pedido enviado.</div>
              <div style={{ fontFamily: FONT.ui, fontSize: 18, color: C.gray }}>A Clara responde ainda hoje.</div>
            </div>
          </div>
        </Browser>
      </div>
      {f >= 276 ? <Toast x={270} y={lerp(-130, 22, toast)} w={500} h={96} title="Novo pedido de orçamento" sub="Clara Reformas · agora" z={60} /> : null}
      <Ripple x={F1.x} y={F1.y} frame={f} start={90} />
      <Ripple x={F2.x} y={F2.y} frame={f} start={164} />
      <Ripple x={BTN.x} y={BTN.y} frame={f} start={236} maxR={90} />
      <Cursor x={cur.x} y={cur.y} size={48} scale={1 - 0.14 * (bump(f, 90, 9) + bump(f, 164, 9) + bump(f, 236, 9))} opacity={ramp(f, 44, 48) * (1 - ramp(f, 300, 312))} />
    </AbsoluteFill>
  );
};

export default DemoLanding;
