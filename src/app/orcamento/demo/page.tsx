"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calculator,
  AlertCircle,
  Users,
  Clock,
} from "lucide-react";
import {
  ATIVIDADES,
  listarCategorias,
  atividadesPorCategoria,
} from "@/data/orcamento/atividades-custo";
import { listarUfs } from "@/lib/orcamento/salarios";
import {
  calcularOrcamento,
  formatarBRL,
  type PadraoAcabamento,
  type ResultadoOrcamento,
} from "@/lib/orcamento/calculo";

export default function DemoPage() {
  const categorias = listarCategorias();
  const ufs = listarUfs();

  const [atividadeId, setAtividadeId] = useState("A002");
  const [quantidade, setQuantidade] = useState("120");
  const [uf, setUf] = useState("SP");
  const [padrao, setPadrao] = useState<PadraoAcabamento>("medio");
  const [bdi, setBdi] = useState("25");
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoOrcamento | null>(null);

  const atividadeAtual = useMemo(
    () => ATIVIDADES.find((a) => a.id === atividadeId),
    [atividadeId]
  );

  function calcular() {
    setErro(null);
    const qtd = parseFloat(quantidade.replace(",", "."));
    const bdiNum = parseFloat(bdi.replace(",", "."));
    if (isNaN(qtd) || qtd <= 0) {
      setErro("Informe uma quantidade válida (maior que zero).");
      setResultado(null);
      return;
    }
    if (isNaN(bdiNum) || bdiNum < 0 || bdiNum > 100) {
      setErro("BDI deve ser entre 0 e 100.");
      setResultado(null);
      return;
    }
    try {
      const r = calcularOrcamento({
        atividadeId,
        quantidade: qtd,
        uf,
        padraoAcabamento: padrao,
        bdiPercentual: bdiNum,
      });
      setResultado(r);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao calcular.");
      setResultado(null);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <header className="sticky top-0 z-50 border-b border-[var(--navy-line)] bg-navy-900/85 backdrop-blur">
        <div className="container-x flex items-center justify-between py-5">
          <Link
            href="/orcamento"
            className="flex items-center gap-2 text-sm font-semibold text-cream-50 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <p className="t-label">Demonstração do motor de cálculo</p>
        </div>
      </header>

      <main className="container-x py-14">
        <div className="max-w-3xl">
          <p className="t-label">Ferramenta interna · cálculo rápido</p>
          <h1 className="display display-xb mt-4 text-4xl text-cream-50 md:text-5xl">
            Teste o cálculo de orçamento
          </h1>
          <p className="mt-4 text-base text-[var(--fg-on-dark-muted)]">
            Versão direta do motor — uma atividade por vez, sem coleta de dados.
            Pro fluxo completo de orçamento, use o <Link href="/orcamento/orcar" className="text-gold-500 underline underline-offset-4 hover:text-gold-400">quiz guiado</Link>.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Formulário */}
          <div
            className="rounded-3xl bg-cream-50 p-7 text-ink-900"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-2 text-gold-600">
              <Calculator className="h-5 w-5" />
              <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
                Dados da obra
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-ink-700">
                  Atividade
                </label>
                <select
                  value={atividadeId}
                  onChange={(e) => setAtividadeId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                >
                  {categorias.map((cat) => (
                    <optgroup label={cat} key={cat}>
                      {atividadesPorCategoria(cat).map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.id} — {a.nome}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {atividadeAtual && (
                  <p className="mt-1.5 text-xs text-ink-500">
                    Unidade: {atividadeAtual.unidade} · RUP de referência:{" "}
                    {atividadeAtual.rupReferencia} HH/{atividadeAtual.unidade}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-ink-700">
                    Quantidade ({atividadeAtual?.unidade ?? "—"})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="ex: 120"
                    className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-700">
                    Estado
                  </label>
                  <select
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  >
                    {ufs.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-700">
                  Padrão de acabamento
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["economico", "medio", "alto"] as PadraoAcabamento[]).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPadrao(p)}
                        className={`rounded-xl border px-3 py-3 text-sm font-bold capitalize transition-colors ${
                          padrao === p
                            ? "border-gold-500 bg-gold-500 text-navy-900"
                            : "border-ink-700/15 bg-white text-ink-700 hover:border-ink-700/30"
                        }`}
                      >
                        {p === "economico"
                          ? "Econômico"
                          : p === "medio"
                          ? "Médio"
                          : "Alto"}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-700">
                  BDI (%) — Bonificação e Despesas Indiretas
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bdi}
                  onChange={(e) => setBdi(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
                <p className="mt-1.5 text-xs text-ink-500">
                  Padrão de mercado: 20–30% para pequena/média obra.
                </p>
              </div>

              {erro && (
                <div className="flex items-start gap-2 rounded-xl border border-[var(--color-sev-critico)]/30 bg-[var(--color-sev-critico)]/10 p-3 text-sm text-[var(--color-sev-critico)]">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{erro}</span>
                </div>
              )}

              <button onClick={calcular} className="btn-cta w-full">
                Calcular orçamento
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div
            className="rounded-3xl bg-cream-50 p-7 text-ink-900"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <p className="t-label t-label-on-cream">Resultado</p>

            {!resultado && (
              <div className="mt-16 text-center text-ink-400">
                <Calculator className="mx-auto h-12 w-12 opacity-40" />
                <p className="mt-4 text-sm">
                  Preencha os dados e clique em <strong>Calcular orçamento</strong>.
                </p>
              </div>
            )}

            {resultado && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-navy-900 p-6 text-cream-50">
                  <p className="text-xs uppercase tracking-wider text-gold-500">
                    Custo final estimado
                  </p>
                  <p className="display mt-2 text-4xl text-cream-50">
                    {formatarBRL(resultado.custoFinal)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--fg-on-dark-muted)]">
                    {formatarBRL(resultado.custoPorUnidade)} por{" "}
                    {resultado.atividade.unidade} · {resultado.atividade.nome}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-ink-700/10 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-wider text-ink-500">
                      Material
                    </p>
                    <p className="display mt-1 text-xl text-ink-900">
                      {formatarBRL(resultado.custoMaterialTotal)}
                    </p>
                    <p className="text-[11px] text-ink-400">
                      perda{" "}
                      {Math.round((resultado.atividade.fatorPerda - 1) * 100)}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink-700/10 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-wider text-ink-500">
                      Mão de obra
                    </p>
                    <p className="display mt-1 text-xl text-ink-900">
                      {formatarBRL(resultado.custoMaoObra)}
                    </p>
                    <p className="text-[11px] text-ink-400">
                      {resultado.hhTotal.toFixed(1)} HH ·{" "}
                      {formatarBRL(resultado.custoHoraHomem)}/h
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink-700/10 bg-white p-4">
                    <p className="text-[11px] uppercase tracking-wider text-ink-500">
                      Custo direto
                    </p>
                    <p className="display mt-1 text-xl text-ink-900">
                      {formatarBRL(resultado.custoDireto)}
                    </p>
                    <p className="text-[11px] text-ink-400">material + MO</p>
                  </div>
                  <div className="rounded-xl border border-gold-500/30 bg-[var(--gold-soft)] p-4">
                    <p className="text-[11px] uppercase tracking-wider text-ink-500">
                      BDI {resultado.inputs.bdiPercentual}%
                    </p>
                    <p className="display mt-1 text-xl text-gold-600">
                      {formatarBRL(resultado.bdiValor)}
                    </p>
                    <p className="text-[11px] text-ink-400">margem</p>
                  </div>
                </div>

                <div className="rounded-xl border border-ink-700/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-gold-600">
                    <Clock className="h-4 w-4" />
                    <p className="text-[11px] font-bold uppercase tracking-wider">
                      Prazo de execução
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-700">
                    <Users className="mr-1 inline h-4 w-4" />
                    {resultado.equipeSugerida}{" "}
                    {resultado.atividade.categoriaProfissional}
                    {resultado.equipeSugerida > 1 ? "s" : ""} ×{" "}
                    {resultado.prazoDias} dia(s) úteis (jornada 8h)
                  </p>
                </div>

                <p className="pt-2 text-center text-[11px] text-ink-400">
                  Custo de mão de obra com encargos sociais (×1,835) calibrado
                  pela região {resultado.inputs.uf}.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
