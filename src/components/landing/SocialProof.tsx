"use client";
import { useEffect, useRef, useState } from "react";

export function LiveViewerWidget() {
  const [count, setCount] = useState(() => 6 + Math.floor(Math.random() * 7));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const updateTimer = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(4, Math.min(17, c + delta));
      });
    }, 30000 + Math.random() * 30000);
    const dismissTimer = setTimeout(() => setDismissed(true), 18000);
    return () => { clearInterval(updateTimer); clearTimeout(dismissTimer); };
  }, [dismissed]);

  if (dismissed) return null;
  return (
    <div className="lvw-slide-in" style={{
      position: "fixed", bottom: 80, left: 20,
      background: "rgba(11,18,38,0.94)",
      border: "1px solid rgba(116,168,122,0.45)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      padding: "14px 18px 14px 16px",
      borderRadius: 4,
      zIndex: 39,
      display: "flex", alignItems: "center", gap: 14,
      maxWidth: "min(340px, calc(100vw - 40px))",
      boxShadow: "0 16px 40px -12px rgba(0,0,0,0.5)",
    }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#74a87a", boxShadow: "0 0 0 2px rgba(116,168,122,0.25)" }} />
        <div className="lvw-dot-ring" style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "rgba(116,168,122,0.4)" }} />
      </div>
      <div style={{ flex: 1, color: "#f3ecde", fontSize: 12.5, lineHeight: 1.4 }}>
        <strong style={{ color: "#a8d2ad", fontWeight: 700 }}>{count} engenheiros</strong> analisando suas obras agora
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: "none", border: 0, color: "rgba(243,236,222,0.4)", cursor: "pointer", padding: 4, fontSize: 14, lineHeight: 1 }} aria-label="Fechar">×</button>
    </div>
  );
}

const RECENT_ACTIVITIES = [
  { name: "Carlos M.", city: "Curitiba, PR", action: "baixou um laudo de concretagem", min: 2 },
  { name: "Mariana S.", city: "Campinas, SP", action: "iniciou um diagnóstico de alvenaria", min: 4 },
  { name: "Eng. Rogério A.", city: "Belo Horizonte, MG", action: "desbloqueou o relatório completo", min: 6 },
  { name: "Felipe T.", city: "Porto Alegre, RS", action: "calculou a RUP de instalações", min: 9 },
  { name: "Renata C.", city: "Salvador, BA", action: "baixou um laudo de fundações", min: 12 },
  { name: "André V.", city: "Brasília, DF", action: "desbloqueou o relatório completo", min: 17 },
  { name: "Daniel P.", city: "Recife, PE", action: "iniciou um novo diagnóstico", min: 21 },
];

export function RecentActivityToaster() {
  const [current, setCurrent] = useState<(typeof RECENT_ACTIVITIES)[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const nextDelayMs = () => 90000 + Math.random() * 120000;
    const show = () => {
      const item = RECENT_ACTIVITIES[idxRef.current % RECENT_ACTIVITIES.length];
      idxRef.current++;
      setCurrent(item);
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        timer = setTimeout(show, nextDelayMs());
      }, 6500);
    };
    timer = setTimeout(show, 30000);
    return () => clearTimeout(timer);
  }, []);

  if (!current) return null;
  return (
    <div style={{
      position: "fixed", bottom: 80, right: 20,
      background: "rgba(11,18,38,0.96)",
      border: "1px solid rgba(201,165,116,0.4)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      padding: "14px 18px",
      borderRadius: 4,
      zIndex: 39,
      display: "flex", alignItems: "center", gap: 14,
      maxWidth: "min(360px, calc(100vw - 40px))",
      boxShadow: "0 20px 50px -12px rgba(0,0,0,0.55)",
      transform: visible ? "translateY(0)" : "translateY(140%)",
      opacity: visible ? 1 : 0,
      transition: "all 380ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        background: "rgba(201,165,116,0.12)",
        border: "1px solid var(--gold-line)",
        color: "var(--gold-500)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 14, letterSpacing: "0.04em",
      }}>{current.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#f3ecde", lineHeight: 1.4 }}>
          <strong style={{ color: "#f3ecde" }}>{current.name}</strong>
          <span style={{ color: "rgba(243,236,222,0.7)" }}> · {current.city}</span>
        </div>
        <div style={{ marginTop: 3, fontSize: 12, color: "rgba(243,236,222,0.65)" }}>
          {current.action} <span style={{ color: "var(--gold-500)", fontWeight: 600 }}>· há {current.min} min</span>
        </div>
      </div>
    </div>
  );
}
