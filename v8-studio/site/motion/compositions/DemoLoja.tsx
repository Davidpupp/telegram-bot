import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, SHADOW_HI } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import { Browser, CheckBadge, Cursor, Ripple, Toast, Words, pathAt, shadowK } from "./kit";

// Demonstração "Lojas virtuais" (800 × 720, 7 s, loop): a vitrine de um ateliê de cerâmica fictício
// se monta, o produto vai para o carrinho num arco, o carrinho abre, a compra é finalizada e o pedido
// chega como notificação.
const BRAND = { name: "Barro", full: "Ateliê Barro", url: "ateliebarro.com.br", color: "#B4532A", soft: "#F8ECE5" };
const B = { x: 40, y: 40, w: 720, h: 640, bar: 60 };
const OX = B.x;
const OY = B.y + B.bar;

type Art = "mug" | "vase" | "pot";
const PRODUCTS: { name: string; price: string; art: Art }[] = [
  { name: "Caneca Areia", price: "R$ 59,00", art: "mug" },
  { name: "Vaso Duna", price: "R$ 129,00", art: "vase" },
  { name: "Bule Terra", price: "R$ 189,00", art: "pot" },
];
const PICK = 1;
const GRID = { y: 196, w: 204, h: 340, gap: 18, img: 190, btnTop: 276, btnH: 48 };
const cardX = (i: number) => 36 + i * (GRID.w + GRID.gap);
const ADD = { x: OX + cardX(PICK) + GRID.w / 2 + 10, y: OY + GRID.y + GRID.btnTop + GRID.btnH / 2 + 4 };
const THUMB_FROM = { x: OX + cardX(PICK) + GRID.w / 2, y: OY + GRID.y + GRID.img / 2 };
const CART = { x: 640, y: 22, size: 38 };
const CART_C = { x: OX + CART.x + CART.size / 2, y: OY + CART.y + CART.size / 2 + 3 };
const POP = { x: 344, y: 80, w: 340, h: 322 };
const BUY = { x: OX + POP.x + POP.w / 2 + 12, y: OY + POP.y + 240 + 33 };

const T = {
  add: 100,
  fly: 106,
  land: 150,
  open: 172,
  buy: 214,
  paid: 222,
  toast: 262,
  exit: 356,
};

/** Peças de cerâmica em traço, na cor da marca. */
const Ware: React.FC<{ art: Art; size: number; color?: string }> = ({ art, size, color = BRAND.color }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
      {art === "mug" ? (
        <>
          <path d="M156 92 Q194 92 194 122 Q194 152 156 152" {...s} />
          <path d="M54 62 L54 158 Q54 184 80 184 L130 184 Q156 184 156 158 L156 62 Z" {...s} fill={C.white} />
          <path d="M54 88 L156 88" {...s} strokeWidth={6} opacity={0.45} />
        </>
      ) : art === "vase" ? (
        <>
          <path d="M88 32 L132 32 L127 60 Q172 90 166 140 Q160 188 110 190 Q60 188 54 140 Q48 90 93 60 Z" {...s} fill={C.white} />
          <path d="M60 124 Q110 140 160 124" {...s} strokeWidth={6} opacity={0.45} />
        </>
      ) : (
        <>
          <path d="M60 122 Q34 116 24 86" {...s} />
          <path d="M162 98 Q198 100 196 132 Q194 162 162 162" {...s} />
          <path d="M58 112 Q58 74 110 74 Q162 74 162 112 L162 150 Q162 180 132 180 L88 180 Q58 180 58 150 Z" {...s} fill={C.white} />
          <path d="M82 74 Q110 50 138 74" {...s} />
          <circle cx={110} cy={52} r={8} {...s} fill={C.white} />
        </>
      )}
    </svg>
  );
};

const BagIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} fill="none" stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    <path d="M7 14 L33 14 L31 33 Q30.8 36 28 36 L12 36 Q9.2 36 9 33 Z" />
    <path d="M14 14 L14 11 Q14 4.5 20 4.5 Q26 4.5 26 11 L26 14" />
  </svg>
);

const rise = (v: number, dy: number): React.CSSProperties => ({ opacity: clamp(v * 1.5), transform: `translateY(${(1 - v) * dy}px)` });

/** Ponto de uma curva quadrática de Bézier. */
const quad = (t: number, a: number, c: number, b: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

const DemoLoja: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, T.exit, T.exit + 32, E.in);
  const pageIn = sp(f, 0, "base");

  // Miniatura em arco até o carrinho.
  const fly = ramp(f, T.fly, T.land, E.io);
  const ctrl = { x: 560, y: 60 };
  const tx = quad(fly, THUMB_FROM.x, ctrl.x, CART_C.x);
  const ty = quad(fly, THUMB_FROM.y, ctrl.y, CART_C.y);
  const lift = sp(f, T.add + 2, "snappy");
  const thumbScale = lerp(1, 0.22, fly) * lerp(0.94, 1, clamp(lift)) * (1 - ramp(f, T.land - 4, T.land + 2));
  const showThumb = f >= T.add + 2 && f < T.land + 3;

  // Carrinho: o ícone afunda, o contador aparece e o número sobe.
  const cartBump = bump(f, T.land, 16);
  const badge = sp(f, T.land, "snappy");
  const digit = sp(f, T.land + 3, "text");

  const pop = sp(f, T.open, "base");
  const paid = sp(f, T.paid, "snappy");
  const check = sp(f, T.paid + 6, "snappy");
  const toast = sp(f, T.toast, "base");

  const keys: [number, number, number][] = [
    [60, 770, 770],
    [96, ADD.x, ADD.y],
    [180, ADD.x, ADD.y],
    [208, BUY.x, BUY.y],
    [232, BUY.x, BUY.y],
    [276, 900, 830],
  ];
  const cur = pathAt(f, keys);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}>
      <div style={{ opacity: clamp(pageIn * 1.5), transform: `translateY(${(1 - pageIn) * 40}px)` }}>
        <Browser x={B.x} y={B.y} w={B.w} h={B.h} bar={B.bar} url={BRAND.url} radius={26}>
          {/* Cabeçalho da loja */}
          <div style={{ position: "absolute", left: 36, top: 22, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: BRAND.color, letterSpacing: "-0.03em" }}>
            {BRAND.name}
          </div>
          {[
            ["Coleção", 456],
            ["Sobre", 563],
          ].map(([label, x]) => (
            <div key={label} style={{ position: "absolute", left: x, top: 28, fontFamily: FONT.ui, fontWeight: 500, fontSize: 20, lineHeight: "26px", color: C.gray }}>
              {label}
            </div>
          ))}
          <div style={{ position: "absolute", left: CART.x, top: CART.y, width: CART.size, height: CART.size, transform: `scale(${1 + 0.14 * cartBump})` }}>
            <BagIcon size={CART.size} />
          </div>
          <div
            style={{
              position: "absolute",
              left: CART.x + CART.size - 12,
              top: CART.y - 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              background: BRAND.color,
              overflow: "hidden",
              transform: `scale(${badge})`,
              boxShadow: `0 0 0 3px ${C.white}`,
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 700, fontSize: 18, color: C.white, transform: `translateY(${(1 - digit) * 100}%)` }}>
              1
            </div>
          </div>

          {/* Vitrine */}
          <Words text="Cerâmica feita à mão." frame={f} start={10} size={46} color={C.ink} align="left" x={36} y={88} width={648} />
          <div style={{ position: "absolute", left: 36, top: 148, fontFamily: FONT.ui, fontSize: 20, color: C.gray, ...rise(sp(f, 22, "soft"), 14) }}>
            Peças únicas, feitas em pequenos lotes.
          </div>
          {PRODUCTS.map((p, i) => {
            const press = i === PICK ? bump(f, T.add, 12) : 0;
            return (
              <div
                key={p.name}
                style={{
                  position: "absolute",
                  left: cardX(i),
                  top: GRID.y,
                  width: GRID.w,
                  height: GRID.h,
                  borderRadius: 22,
                  background: C.white,
                  boxShadow: `inset 0 0 0 2px ${C.line}`,
                  overflow: "hidden",
                  ...rise(sp(f, 30 + i * 8, "soft"), 60),
                }}
              >
                <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: GRID.img, background: BRAND.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ware art={p.art} size={128} />
                </div>
                <div style={{ position: "absolute", left: 18, top: 206, fontFamily: FONT.ui, fontWeight: 600, fontSize: 21, color: C.ink }}>{p.name}</div>
                <div style={{ position: "absolute", left: 18, top: 236, fontFamily: FONT.ui, fontWeight: 500, fontSize: 20, color: C.gray }}>{p.price}</div>
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    top: GRID.btnTop,
                    height: GRID.btnH,
                    borderRadius: GRID.btnH / 2,
                    background: BRAND.color,
                    color: C.white,
                    fontFamily: FONT.ui,
                    fontWeight: 600,
                    fontSize: 19,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${1 - 0.06 * press})`,
                  }}
                >
                  Adicionar
                </div>
              </div>
            );
          })}

          {/* Carrinho aberto */}
          {f >= T.open ? (
            <div
              style={{
                position: "absolute",
                left: POP.x,
                top: POP.y,
                width: POP.w,
                height: POP.h,
                borderRadius: 24,
                background: C.white,
                boxShadow: SHADOW_HI,
                overflow: "hidden",
                opacity: clamp(pop * 1.6),
                transformOrigin: "88% 0%",
                transform: `translateY(${(1 - pop) * -16}px) scale(${lerp(0.9, 1, pop)})`,
                zIndex: 50,
              }}
            >
              <div style={{ position: "absolute", inset: 0, opacity: clamp(1 - paid * 1.6), transform: `translateY(${-30 * paid}px)` }}>
                <div style={{ position: "absolute", left: 24, top: 22, fontFamily: FONT.display, fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", color: C.ink }}>Seu carrinho</div>
                <div style={{ position: "absolute", left: 24, top: 74, width: 76, height: 76, borderRadius: 16, background: BRAND.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ware art={PRODUCTS[PICK].art} size={58} />
                </div>
                <div style={{ position: "absolute", left: 116, top: 84, fontFamily: FONT.ui, fontWeight: 600, fontSize: 21, color: C.ink }}>{PRODUCTS[PICK].name}</div>
                <div style={{ position: "absolute", left: 116, top: 114, fontFamily: FONT.ui, fontSize: 19, color: C.gray }}>1 × {PRODUCTS[PICK].price}</div>
                <div style={{ position: "absolute", left: 24, right: 24, top: 172, height: 2, background: C.line }} />
                <div style={{ position: "absolute", left: 24, top: 192, fontFamily: FONT.ui, fontWeight: 500, fontSize: 20, color: C.gray }}>Total</div>
                <div style={{ position: "absolute", right: 24, top: 190, fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, color: C.ink }}>{PRODUCTS[PICK].price}</div>
                <div
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    top: 240,
                    height: 58,
                    borderRadius: 29,
                    background: BRAND.color,
                    color: C.white,
                    fontFamily: FONT.ui,
                    fontWeight: 600,
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${1 - 0.05 * bump(f, T.buy, 12)})`,
                  }}
                >
                  Finalizar compra
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  opacity: clamp(paid * 1.5),
                  transform: `translateY(${(1 - paid) * 30}px)`,
                }}
              >
                <div style={{ transform: `scale(${lerp(0.5, 1, clamp(check))})`, opacity: clamp(check * 2) }}>
                  <CheckBadge size={76} bg={BRAND.color} fg={C.white} />
                </div>
                <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", color: C.ink, marginTop: 6 }}>Pagamento aprovado</div>
                <div style={{ fontFamily: FONT.ui, fontSize: 19, color: C.gray }}>Obrigado pela compra.</div>
              </div>
            </div>
          ) : null}
        </Browser>
      </div>

      {showThumb ? (
        <div
          style={{
            position: "absolute",
            left: tx - 60,
            top: ty - 60,
            width: 120,
            height: 120,
            borderRadius: 26,
            background: BRAND.soft,
            boxShadow: shadowK(clamp(lift) * 1.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${thumbScale}) rotate(${-10 * Math.sin(Math.PI * fly)}deg)`,
            zIndex: 55,
          }}
        >
          <Ware art={PRODUCTS[PICK].art} size={92} />
        </div>
      ) : null}
      {f >= T.toast ? <Toast x={270} y={lerp(-130, 22, toast)} w={500} h={96} title="Novo pedido recebido" sub={`${BRAND.full} · agora`} z={60} /> : null}
      <Ripple x={ADD.x} y={ADD.y} frame={f} start={T.add} color={BRAND.color} />
      <Ripple x={CART_C.x} y={CART_C.y} frame={f} start={T.land} color={BRAND.color} maxR={46} dur={20} />
      <Ripple x={BUY.x} y={BUY.y} frame={f} start={T.buy} color={BRAND.color} maxR={90} />
      <Cursor
        x={cur.x}
        y={cur.y}
        size={48}
        scale={1 - 0.14 * (bump(f, T.add, 9) + bump(f, T.buy, 9))}
        opacity={ramp(f, 60, 64) * (1 - ramp(f, 262, 276))}
      />
    </AbsoluteFill>
  );
};

export default DemoLoja;
