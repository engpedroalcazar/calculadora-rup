"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atividades } from "@/lib/rup";
import Link from "next/link";
import Image from "next/image";

const TOTAL_STEPS = 6;

const opcoesGrupo = {
  perfil: [
    "Engenheiro civil",
    "Encarregado de obras",
    "Estagiário de engenharia",
    "Construtor / Empreiteiro",
    "Proprietário",
  ],
  tipoObra: [
    "Residencial",
    "Corporativa",
    "Incorporação",
    "Industrial",
    "Infraestrutura",
    "Outra",
  ],
  preocupacao: [
    "Atraso na obra",
    "Mão de obra cara",
    "Baixa produtividade",
    "Falta de controle",
    "Estouro de custo",
    "Não sei exatamente",
  ],
  controle: [
    "Sim, com sistema digital",
    "Sim, com planilha Excel",
    "De forma manual / verbal",
    "Não controlo produtividade",
  ],
};

type FormData = {
  perfil: string; tipoObra: string; preocupacao: string; controle: string;
  atividadeId: string; quantidade: string; trabalhadores: string;
  horasPorDia: string; dias: string; custoHora: string;
  cidade: string; nome: string; whatsapp: string; email: string;
};

const init: FormData = {
  perfil: "", tipoObra: "", preocupacao: "", controle: "", atividadeId: "",
  quantidade: "", trabalhadores: "", horasPorDia: "", dias: "",
  custoHora: "", cidade: "", nome: "", whatsapp: "", email: "",
};

const stepTitles = [
  "Qual é o seu perfil?",
  "Qual tipo de obra?",
  "Qual sua maior preocupação?",
  "Você controla produtividade?",
  "Qual atividade analisar?",
  "Dados da produção",
];
const stepSubs = [
  "Selecione a opção que melhor te descreve.",
  "Tipo da obra que você está gerenciando.",
  "O que mais tira o seu sono na obra.",
  "Como você acompanha o desempenho atual.",
  "Escolha a atividade para calcular a RUP.",
  "Informe os números da frente de serviço.",
];

/* ── Chip de seleção ─────────────────────────────────────────────── */
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 18px",
        textAlign: "left",
        fontSize: 15,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        background: selected ? "var(--gold-500)" : "rgba(243,236,222,0.04)",
        color: selected ? "#0b1226" : "#f3ecde",
        border: selected ? "1px solid var(--gold-500)" : "1px solid rgba(243,236,222,0.18)",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "all 0.15s",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}

/* ── Campo de texto ──────────────────────────────────────────────── */
function Campo({ label, placeholder, value, onChange, type = "text", inputMode, required, hint }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean; hint?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-500)" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          height: 48,
          padding: "0 16px",
          background: "rgba(243,236,222,0.05)",
          border: "1px solid rgba(243,236,222,0.2)",
          borderRadius: "var(--radius-md)",
          color: "#f3ecde",
          fontSize: 15,
          fontFamily: "var(--font-body)",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--gold-500)")}
        onBlur={e => (e.target.style.borderColor = "rgba(243,236,222,0.2)")}
      />
      {hint && <span style={{ fontSize: 12, color: "rgba(243,236,222,0.45)" }}>{hint}</span>}
    </label>
  );
}

export default function DiagnosticoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(init);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  function set(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const atSelecionada = atividades.find((a) => a.id === form.atividadeId);
  const atividadesFiltradas = busca.trim()
    ? atividades.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()) || a.categoria.toLowerCase().includes(busca.toLowerCase()))
    : atividades;

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); setErro(""); }

  function autoNext(field: keyof FormData, value: string) {
    set(field, value);
    setTimeout(next, 180);
  }

  async function handleSubmit() {
    setErro("");
    if (!form.nome.trim() || !form.whatsapp.trim() || !form.quantidade || !form.trabalhadores || !form.horasPorDia || !form.dias) {
      setErro("Preencha os campos obrigatórios marcados com *");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantidade: Number(form.quantidade.replace(",", ".")),
          trabalhadores: Number(form.trabalhadores),
          horasPorDia: Number(form.horasPorDia.replace(",", ".")),
          dias: Number(form.dias),
          custoHora: form.custoHora ? Number(form.custoHora.replace(",", ".")) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao calcular");
      localStorage.setItem("rup_resultado", JSON.stringify(data));
      router.push(`/resultado?id=${data.id}`);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const pct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,18,38,0.92)",
        borderBottom: "1px solid var(--navy-line)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 64 }}>
          {step > 1 ? (
            <button onClick={back} style={{ background: "none", border: "none", color: "rgba(243,236,222,0.6)", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
          ) : (
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image src="/assets/obraradar-mark-clean.png" alt="ObraRadar" width={52} height={33} style={{ objectFit: "contain" }} />
            </Link>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "rgba(243,236,222,0.5)", textTransform: "uppercase" }}>
                Etapa {step}/{TOTAL_STEPS}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-500)", letterSpacing: "0.1em" }}>{pct}%</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(243,236,222,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold-500)", borderRadius: 4, transition: "width 0.35s ease" }} />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Step label */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 32px)", color: "#f3ecde", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {stepTitles[step - 1]}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(243,236,222,0.6)", margin: 0 }}>{stepSubs[step - 1]}</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: "grid", gap: 10 }}>
            {opcoesGrupo.perfil.map((op) => (
              <Chip key={op} label={op} selected={form.perfil === op} onClick={() => autoNext("perfil", op)} />
            ))}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: "grid", gap: 10 }}>
            {opcoesGrupo.tipoObra.map((op) => (
              <Chip key={op} label={op} selected={form.tipoObra === op} onClick={() => autoNext("tipoObra", op)} />
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ display: "grid", gap: 10 }}>
            {opcoesGrupo.preocupacao.map((op) => (
              <Chip key={op} label={op} selected={form.preocupacao === op} onClick={() => autoNext("preocupacao", op)} />
            ))}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ display: "grid", gap: 10 }}>
            {opcoesGrupo.controle.map((op) => (
              <Chip key={op} label={op} selected={form.controle === op} onClick={() => autoNext("controle", op)} />
            ))}
          </div>
        )}

        {/* Step 5 — Atividade */}
        {step === 5 && (
          <div>
            <input
              type="text"
              placeholder="Buscar atividade..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{
                width: "100%", height: 46, padding: "0 16px", marginBottom: 16,
                background: "rgba(243,236,222,0.06)",
                border: "1px solid rgba(243,236,222,0.2)",
                borderRadius: "var(--radius-md)",
                color: "#f3ecde", fontSize: 14,
                fontFamily: "var(--font-body)", outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--gold-500)")}
              onBlur={e => (e.target.style.borderColor = "rgba(243,236,222,0.2)")}
            />
            <div style={{ display: "grid", gap: 8 }}>
              {atividadesFiltradas.map((at) => (
                <button
                  key={at.id}
                  onClick={() => autoNext("atividadeId", at.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 18px",
                    background: form.atividadeId === at.id ? "var(--gold-500)" : "rgba(243,236,222,0.04)",
                    color: form.atividadeId === at.id ? "#0b1226" : "#f3ecde",
                    border: form.atividadeId === at.id ? "1px solid var(--gold-500)" : "1px solid rgba(243,236,222,0.15)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "var(--font-body)",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{at.nome}</span>
                  <span style={{ fontSize: 12, opacity: 0.7, flexShrink: 0, marginLeft: 12 }}>{at.unidade}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6 — Dados */}
        {step === 6 && (
          <div style={{ display: "grid", gap: 16 }}>
            {/* Atividade selecionada */}
            {atSelecionada && (
              <div style={{ padding: "14px 18px", background: "rgba(201,165,116,0.1)", border: "1px solid rgba(201,165,116,0.3)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--gold-500)", textTransform: "uppercase" }}>Atividade selecionada</span>
                <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 15, color: "#f3ecde" }}>{atSelecionada.nome}</p>
              </div>
            )}

            {/* Produção */}
            <div style={{ padding: 20, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)", margin: "0 0 16px" }}>Produção</p>
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <Campo
                  label={`Quantidade executada (${atSelecionada?.unidade ?? "unid"})`}
                  placeholder="Ex: 40"
                  value={form.quantidade} onChange={(v) => set("quantidade", v)}
                  inputMode="decimal" required
                />
                <Campo
                  label="Nº de trabalhadores"
                  placeholder="Ex: 4"
                  value={form.trabalhadores} onChange={(v) => set("trabalhadores", v)}
                  inputMode="numeric" required
                />
                <Campo
                  label="Horas por trabalhador/dia"
                  placeholder="Ex: 8"
                  value={form.horasPorDia} onChange={(v) => set("horasPorDia", v)}
                  inputMode="decimal" required
                />
                <Campo
                  label="Número de dias"
                  placeholder="Ex: 3"
                  value={form.dias} onChange={(v) => set("dias", v)}
                  inputMode="numeric" required
                />
                <Campo
                  label="Custo médio por HH (R$)"
                  placeholder="Ex: 35 — opcional"
                  value={form.custoHora} onChange={(v) => set("custoHora", v)}
                  inputMode="decimal"
                  hint="Calcula o impacto financeiro se informado"
                />
                <Campo
                  label="Cidade"
                  placeholder="Ex: Maringá"
                  value={form.cidade} onChange={(v) => set("cidade", v)}
                />
              </div>
            </div>

            {/* Contato */}
            <div style={{ padding: 20, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)", margin: "0 0 16px" }}>Seus dados</p>
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <Campo label="Seu nome" placeholder="João Paulo" value={form.nome} onChange={(v) => set("nome", v)} required />
                <Campo label="WhatsApp" placeholder="(44) 99999-9999" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} inputMode="tel" required />
                <div style={{ gridColumn: "1 / -1" }}>
                  <Campo label="E-mail" placeholder="seu@email.com (opcional)" value={form.email} onChange={(v) => set("email", v)} type="email" />
                </div>
              </div>
            </div>

            {erro && (
              <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "var(--radius-md)", fontSize: 14, color: "#fca5a5" }}>
                {erro}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "18px 24px",
                background: loading ? "rgba(16,185,129,0.5)" : "var(--cta-500)",
                color: "#fff",
                border: "none", borderRadius: "var(--radius-md)",
                fontSize: 16, fontWeight: 800,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.04em",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "var(--cta-glow)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Calculando...
                </>
              ) : "Calcular minha RUP"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(243,236,222,0.4)" }}>
              Seus dados não serão compartilhados com terceiros.
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
