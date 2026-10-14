"use client";

import { Browser, ResultCard, SearchPill, Toast } from "@/motion/compositions/kit";
import { C } from "@/motion/lib/theme";

// Peças das composições do Remotion mostradas paradas na prancha de componentes, em escala reduzida.
// A escala vem da variável --k (0,5 no computador, 0,3 no celular), definida no contêiner.

function Scaled({ w, h, children, label }: { w: number; h: number; children: React.ReactNode; label: string }) {
  return (
    <div role="img" aria-label={label} style={{ position: "relative", width: `calc(${w}px * var(--k, 0.5))`, height: `calc(${h}px * var(--k, 0.5))`, maxWidth: "100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: "scale(var(--k, 0.5))", transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}

export function KitPill() {
  return (
    <Scaled w={1000} h={104} label="Pílula de busca com o texto dentista perto de mim">
      <SearchPill cx={500} cy={52} w={1000} h={104} borderColor={C.blue} borderWidth={3} text="dentista perto de mim" caret />
    </Scaled>
  );
}

export function KitButtonPill() {
  return (
    <Scaled w={320} h={84} label="A mesma pílula como botão Começar">
      <SearchPill cx={160} cy={42} w={320} h={84} bg={C.blue} borderWidth={0} shadow={0.85} contentOpacity={0} label="Começar" labelOpacity={1} />
    </Scaled>
  );
}

export function KitResult() {
  return (
    <Scaled w={1000} h={132} label="Resultado de busca destacado em azul">
      <ResultCard x={0} y={0} fav="V" favColor={C.teal} url="clinicavida.com.br" title="Clínica Vida" desc="Seu sorriso em boas mãos. Agende online em poucos cliques." highlight={1} />
    </Scaled>
  );
}

export function KitToast() {
  return (
    <Scaled w={600} h={104} label="Notificação de nova consulta agendada">
      <Toast x={0} y={0} title="Nova consulta agendada" sub="Clínica Vida · agora" />
    </Scaled>
  );
}

export function KitBrowser() {
  return (
    <Scaled w={1000} h={560} label="Moldura de navegador vazia">
      <Browser x={0} y={0} w={1000} h={560} url="clinicavida.com.br">
        <div style={{ position: "absolute", inset: 0, background: C.paper }} />
      </Browser>
    </Scaled>
  );
}
