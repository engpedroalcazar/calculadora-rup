"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HardHat,
  ClipboardList,
} from "lucide-react";
import { atividades, categorias } from "@/lib/rup";
import { QuizProgress } from "@/components/orcamento/QuizProgress";

const TOTAL_STEPS = 2;
const LABELS_ETAPAS = ["Atividade", "Produção e contato"];

type FormData = {
  perfil: string; tipoObra: string; preocupacao: string; controle: string;
  atividadeId: string; quantidade: string; trabalhadores: string;
  horasPorDia: string; dias: string; custoEquipeDia: string;
  cidade: string; nome: string; whatsapp: string; email: string;
};

const init: FormData = {
  perfil: "", tipoObra: "", preocupacao: "", controle: "", atividadeId: "",
  quantidade: "", trabalhadores: "", horasPorDia: "", dias: "",
  custoEquipeDia: "", cidade: "", nome: "", whatsapp: "", email: "",
};

/* ── Campo de texto (tema claro, padrão ORC) ─────────────────────── */
function Campo({ label, placeholder, value, onChange, type = "text", inputMode, required, hint }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean; hint?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700">
        {label}{required && <span style={{ color: "var(--sev-critico)" }}> *</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-ink-700/15 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
      />
      {hint && <span className="text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

/* ── Linha de atividade (single-select, padrão visual ORC) ───────── */
function LinhaAtividade({ nome, detalhe, selecionada, onSelect, indentada }: {
  nome: string; detalhe: string; selecionada: boolean; onSelect: () => void; indentada?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between gap-3 border-b border-ink-700/5 px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--gold-soft)] ${
          indentada ? "pl-8" : ""
        } ${selecionada ? "bg-[var(--gold-soft)]" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selecionada ? "border-gold-500 bg-gold-500 text-navy-900" : "border-ink-700/25 bg-white"
            }`}
          >
            {selecionada && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12l5 5L20 6" /></svg>
            )}
          </span>
          <span className="font-semibold text-ink-900">{nome}</span>
        </div>
        <span className="flex-shrink-0 text-xs text-ink-400">{detalhe}</span>
      </button>
    </li>
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

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return null;
    return atividades.filter(
      (a) => a.nome.toLowerCase().includes(termo) || a.categoria.toLowerCase().includes(termo)
    );
  }, [busca]);

  function voltar() {
    setStep((s) => Math.max(s - 1, 1));
    setErro("");
  }

  function avancar() {
    if (step === 1) {
      if (!form.atividadeId) {
        setErro("Selecione uma atividade para continuar.");
        return;
      }
      setErro("");
      setStep(2);
      return;
    }
    handleSubmit();
  }

  async function handleSubmit() {
    setErro("");
    if (!form.atividadeId) {
      setErro("Selecione uma atividade antes de continuar. Volte ao passo anterior.");
      return;
    }
    if (!form.nome.trim() || !form.whatsapp.trim() || !form.email.trim() || !form.quantidade || !form.trabalhadores || !form.horasPorDia || !form.dias) {
      setErro("Preencha os campos obrigatórios marcados com *");
      return;
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setErro("Informe um e-mail válido para receber o relatório.");
      return;
    }
    setLoading(true);

    // Converte custo equipe/dia → custo por HH para o cálculo
    const custoEquipeDia = form.custoEquipeDia ? Number(form.custoEquipeDia.replace(",", ".")) : null;
    const trab = Number(form.trabalhadores);
    const hpd = Number(form.horasPorDia.replace(",", "."));
    const custoHora = custoEquipeDia && trab > 0 && hpd > 0 ? custoEquipeDia / trab / hpd : null;

    try {
      const res = await fetch("/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantidade: Number(form.quantidade.replace(",", ".")),
          trabalhadores: trab,
          horasPorDia: hpd,
          dias: Number(form.dias),
          custoHora,
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

  const atividadesPorCategoria = (cat: string) => atividades.filter((a) => a.categoria === cat);

  return (
    <div className="flex min-h-screen flex-col bg-navy-900" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--navy-line)]" style={{ background: "rgba(11,18,38,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px]">
              <Image src="/logos/orcamento/obraradar-icon.jpg" alt="Obra Radar" width={36} height={36} className="h-9 w-9 object-cover" />
            </span>
            <span className="display text-sm text-cream-50" style={{ letterSpacing: "0.03em" }}>OBRA RADAR</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500">Diagnóstico RUP</span>
        </div>
      </header>

      <main className="container-x flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="t-label">Diagnóstico guiado · 2 etapas</p>
          <h1 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
            Vamos medir sua produtividade
          </h1>
          <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
            Etapa {step} de {TOTAL_STEPS} — {LABELS_ETAPAS[step - 1]}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <QuizProgress etapaAtual={step} totalEtapas={TOTAL_STEPS} labels={LABELS_ETAPAS} />
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl bg-cream-50 p-7 text-ink-900 md:p-10" style={{ boxShadow: "var(--shadow-card)" }}>
          {/* Etapa 1 — Atividade */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 text-gold-600">
                <HardHat className="h-5 w-5" />
                <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
                  Qual atividade você quer analisar?
                </p>
              </div>
              <h2 className="display mt-3 text-2xl text-ink-900">
                Escolha a atividade da obra
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Selecione o serviço executado pela equipe — a RUP compara as horas-homem gastas com o benchmark normativo dessa atividade. Na próxima etapa você informa os números.
              </p>

              <div className="relative mt-6">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="ex: alvenaria, piso, concretagem, pintura..."
                  className="w-full rounded-xl border border-ink-700/15 bg-white py-3 pl-11 pr-4 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
              </div>

              {atSelecionada && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--gold-soft)] px-4 py-3 text-sm font-semibold text-gold-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Selecionada: {atSelecionada.nome}
                </div>
              )}

              <div className="mt-5 max-h-[420px] overflow-y-auto rounded-xl border border-ink-700/10 bg-white">
                {atividadesFiltradas ? (
                  atividadesFiltradas.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-ink-400">
                      Nenhuma atividade encontrada. Tente outra palavra.
                    </p>
                  ) : (
                    <ul>
                      {atividadesFiltradas.map((a) => (
                        <LinhaAtividade
                          key={a.id}
                          nome={a.nome}
                          detalhe={`${a.categoria} · unidade: ${a.unidade}`}
                          selecionada={form.atividadeId === a.id}
                          onSelect={() => set("atividadeId", a.id)}
                        />
                      ))}
                    </ul>
                  )
                ) : (
                  categorias.map((cat) => (
                    <details key={cat} className="border-b border-ink-700/5 last:border-b-0">
                      <summary className="cursor-pointer px-4 py-3 text-sm font-bold uppercase tracking-wider text-ink-700 transition-colors hover:bg-ink-700/5">
                        {cat}
                      </summary>
                      <ul className="bg-ink-700/[0.02]">
                        {atividadesPorCategoria(cat).map((a) => (
                          <LinhaAtividade
                            key={a.id}
                            nome={a.nome}
                            detalhe={`unidade: ${a.unidade}`}
                            selecionada={form.atividadeId === a.id}
                            onSelect={() => set("atividadeId", a.id)}
                            indentada
                          />
                        ))}
                      </ul>
                    </details>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Etapa 2 — Produção e contato */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-gold-600">
                <ClipboardList className="h-5 w-5" />
                <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
                  Últimos números e pronto
                </p>
              </div>
              <h2 className="display mt-3 text-2xl text-ink-900">
                Dados da produção
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Informe os números da frente de serviço e onde te enviamos o resultado.
              </p>

              {/* Atividade selecionada */}
              {atSelecionada && (
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--gold-soft)] px-4 py-3 text-sm font-semibold text-gold-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {atSelecionada.nome}
                </div>
              )}

              {/* Produção */}
              <div className="mt-5 rounded-xl border border-ink-700/10 bg-white p-5">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">Produção</p>
                <div className="grid gap-4 sm:grid-cols-2">
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
                    label="Custo da equipe por dia (R$)"
                    placeholder="Ex: 800 — opcional"
                    value={form.custoEquipeDia} onChange={(v) => set("custoEquipeDia", v)}
                    inputMode="decimal"
                    hint="Total pago por dia para toda a equipe. Calcula o impacto financeiro."
                  />
                  <Campo
                    label="Cidade"
                    placeholder="Ex: Maringá"
                    value={form.cidade} onChange={(v) => set("cidade", v)}
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="mt-5 rounded-xl border border-ink-700/10 bg-white p-5">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">Seus dados</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Campo label="Seu nome" placeholder="Seu nome completo" value={form.nome} onChange={(v) => set("nome", v)} required />
                  <Campo label="WhatsApp" placeholder="(00) 00000-0000" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} inputMode="tel" required />
                  <div className="sm:col-span-2">
                    <Campo label="E-mail" placeholder="seu@email.com" value={form.email} onChange={(v) => set("email", v)} type="email" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {erro && (
            <div className="mt-6 flex items-start gap-2 rounded-xl p-3 text-sm" style={{ border: "1px solid rgba(201,90,74,0.3)", background: "rgba(201,90,74,0.1)", color: "var(--sev-critico)" }}>
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={voltar}
              disabled={step === 1 || loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink-700/15 bg-white px-6 py-3 text-sm font-bold text-ink-700 transition-colors hover:bg-ink-700/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <button
              type="button"
              onClick={avancar}
              disabled={loading || (step === 1 && !form.atividadeId)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3 text-sm font-extrabold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "var(--cta-500)", boxShadow: "var(--cta-glow)", letterSpacing: "0.03em" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Calculando...
                </>
              ) : step === TOTAL_STEPS ? (
                <>
                  Calcular minha RUP
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Próxima etapa
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-[var(--fg-on-dark-muted)]">
          Seus dados são usados apenas para gerar e enviar o diagnóstico. Não compartilhamos com terceiros.
        </p>
      </main>
    </div>
  );
}
