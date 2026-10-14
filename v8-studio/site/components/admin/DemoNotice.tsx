import s from "./ui.module.css";

/** Aviso fixo no topo de todas as telas do painel enquanto não há backend. */
export function DemoNotice() {
  return (
    <p className={s.notice} role="note">
      <span>
        <strong>Modo demonstração:</strong> dados de exemplo. Os pedidos reais aparecem aqui quando o backend for ligado.
      </span>
    </p>
  );
}
