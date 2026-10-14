"use client";

import { useRef } from "react";
import type { PhoneApp } from "@/content/lps";
import { useInView, useReducedMotion, useTimeline } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { clamp, lerp, sp } from "@/motion/lib/timing";
import s from "./PhonePair.module.css";

// Linha do tempo (60 fps): os celulares sobem, e a cada 5,5 s um aviso desce nos dois ao mesmo tempo.
const ENTER = 40;
const CYCLE = 330;
const DOWN = 24;
const UP = 250;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
};

type Notice = PhoneApp["notices"][number];

function Phone({ kind, app, notice, down, style }: { kind: "ios" | "android"; app: PhoneApp; notice: Notice | null; down: number; style?: React.CSSProperties }) {
  return (
    <div className={s.device} style={style}>
      <div className={cx(s.phone, kind === "ios" ? s.ios : s.android)}>
        <div className={s.screen}>
          <div className={s.status}>
            <span>9:41</span>
            <i className={s.camera} />
            <span className={s.signal}>
              <b />
              <b />
              <b />
            </span>
          </div>
          <div className={s.appBar}>
            <span className={s.brand}>{app.name}</span>
            <span className={s.avatar} />
          </div>
          <div className={s.title}>{app.title}</div>
          {app.subtitle ? <div className={s.subtitle}>{app.subtitle}</div> : null}
          <div className={s.rows}>
            {app.rows.map((r, i) => (
              <div
                key={r.title}
                className={s.row}
                style={notice?.row === i && down > 0.001 ? { boxShadow: `inset 0 0 0 2px ${rgba(app.color, clamp(down))}` } : undefined}
              >
                <b>{r.title}</b>
                <span>{r.meta}</span>
              </div>
            ))}
          </div>
          <div className={s.action}>{app.action}</div>
          <i className={s.bar} />
          {notice ? (
            <div className={s.notice} style={{ opacity: clamp(down * 2), transform: `translateY(${lerp(-150, 0, down).toFixed(2)}%)` }}>
              <i className={s.icon}>{app.name.charAt(0)}</i>
              <div>
                <b>{notice.title}</b>
                <span>{notice.text}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <p className={s.caption}>{kind === "ios" ? "iPhone" : "Android"}</p>
    </div>
  );
}

/**
 * O mesmo aplicativo fictício num iPhone e num Android, desenhado em código. Quando aparece, os dois sobem
 * (mola suave) e o mesmo aviso desce nas duas telas ao mesmo tempo (mola rápida). Fora da tela, para.
 */
export function PhonePair({ app, label }: { app: PhoneApp; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { threshold: 0.3 });
  const visible = useInView(ref, { threshold: 0, once: false, rootMargin: "0px" });
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: seen && visible, reducedFrame: ENTER + 120 });
  const live = reduce || seen || frame > 0;

  const t = frame - ENTER;
  const local = t < 0 ? -1 : t % CYCLE;
  const notice = app.notices.length ? app.notices[(t < 0 ? 0 : Math.floor(t / CYCLE)) % app.notices.length] : null;
  const down = local < 0 ? 0 : clamp(sp(local, DOWN, "snappy") - sp(local, UP, "base"));

  const enter = (i: number): React.CSSProperties | undefined => {
    if (!live || reduce) return undefined;
    const u = sp(frame, i * 8, "soft");
    return Math.abs(1 - u) < 0.0005 ? undefined : { opacity: clamp(u * 1.5), transform: `translateY(${((1 - u) * 48).toFixed(2)}px)` };
  };

  return (
    <div
      ref={ref}
      className={cx(s.stage, live && s.live)}
      style={{ "--app": app.color, "--app-soft": app.soft } as React.CSSProperties}
      role="img"
      aria-label={label}
    >
      <Phone kind="ios" app={app} notice={notice} down={down} style={enter(0)} />
      <Phone kind="android" app={app} notice={notice} down={down} style={enter(1)} />
    </div>
  );
}
