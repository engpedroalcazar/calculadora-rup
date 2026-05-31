"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Ruler,
  MapPin,
  Sliders,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";
import { QuizProgress } from "@/components/orcamento/QuizProgress";
import {
  ATIVIDADES,
  listarCategorias,
  atividadesPorCategoria,
} from "@/data/orcamento/atividades-custo";
import { listarUfs } from "@/lib/orcamento/salarios";
import type { PadraoAcabamento } from "@/lib/orcamento/calculo";

const LABELS_ETAPAS = ["Serviço", "Quantidade", "Local", "Padrão", "Contato"];

export default function OrcarPage() {
  const [etapa, setEtapa] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [atividadeId, setAtividadeId] = useState<string>("");
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [padrao, setPadrao] = useState<PadraoAcabamento>("medio");
  const [bdi, setBdi] = useState(25);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const categorias = listarCategorias();
  const ufs = listarUfs();
  const atividadeAtual = useMemo(
    () => ATIVIDADES.find((a) => a.id === atividadeId),
    [atividadeId]
  );

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return null;
    return ATIVIDADES.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.categoria.toLowerCase().includes(termo)
    );
  }, [busca]);

  function podeAvancar(): boolean {
    switch (etapa) {
      case 1:
        return Boolean(atividadeId);
      case 2: {
        const q = parseFloat(quantidade.replace(",", "."));
        return !isNaN(q) && q > 0;
      }
      case 3:
        return Boolean(uf);
      case 4:
        return bdi >= 0 && bdi <= 50;
      case 5:
        return nome.trim().length >= 2 && /\S+@\S+\.\S+/.test(email);
      default:
        return false;
    }
  }

  function avancar() {
    setErro(null);
    if (!podeAvancar()) return;
    if (etapa < 5) {
      setEtapa(etapa + 1);
    } else {
      enviar();
    }
  }

  function voltar() {
    setErro(null);
    if (etapa > 1) setEtapa(etapa - 1);
  }

  async function enviar() {
    setSubmitting(true);
    setErro(null);
    try {
      const r = await fetch("/api/orcamento/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atividadeId,
          quantidade: parseFloat(quantidade.replace(",", ".")),
          uf,
          cidade: cidade.trim() || undefined,
          padraoAcabamento: padrao,
          bdiPercentual: bdi,
          nome: nome.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErro(data?.erro ?? "Não foi possível calcular agora. Tente novamente.");
        return;
      }
      // A API retorna `redirectTo` apontando para /orcamento/resultado/[leadId] onde
      // o cliente vê a prévia e (se for o caso) destrava o relatório completo.
      if (data?.redirectTo) {
        window.location.href = data.redirectTo;
        return;
      }
      setErro("Resposta inesperada do servidor. Tente novamente.");
    } catch {
      setErro("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <BrandHeader variant="inner" />

      <main className="container-x flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
              <p className="t-label">Orçamento guiado · 5 etapas</p>
              <h1 className="display display-xb mt-3 text-3xl text-cream-50 md:text-4xl">
                Vamos calcular sua obra
              </h1>
              <p className="mt-3 text-sm text-[var(--fg-on-dark-muted)]">
                Etapa {etapa} de 5 — {LABELS_ETAPAS[etapa - 1]}
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <QuizProgress etapaAtual={etapa} totalEtapas={5} labels={LABELS_ETAPAS} />
            </div>

            <div
              className="mx-auto mt-10 max-w-3xl rounded-3xl bg-cream-50 p-7 text-ink-900 md:p-10"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {etapa === 1 && (
                <EtapaAtividade
                  atividadeId={atividadeId}
                  setAtividadeId={setAtividadeId}
                  busca={busca}
                  setBusca={setBusca}
                  categorias={categorias}
                  atividadesFiltradas={atividadesFiltradas}
                />
              )}

              {etapa === 2 && (
                <EtapaQuantidade
                  quantidade={quantidade}
                  setQuantidade={setQuantidade}
                  unidade={atividadeAtual?.unidade ?? "—"}
                  atividadeNome={atividadeAtual?.nome ?? ""}
                />
              )}

              {etapa === 3 && (
                <EtapaLocal
                  uf={uf}
                  setUf={setUf}
                  cidade={cidade}
                  setCidade={setCidade}
                  ufs={ufs}
                />
              )}

              {etapa === 4 && (
                <EtapaPadrao
                  padrao={padrao}
                  setPadrao={setPadrao}
                  bdi={bdi}
                  setBdi={setBdi}
                />
              )}

              {etapa === 5 && (
                <EtapaContato
                  nome={nome}
                  setNome={setNome}
                  email={email}
                  setEmail={setEmail}
                  whatsapp={whatsapp}
                  setWhatsapp={setWhatsapp}
                />
              )}

              {erro && (
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-[var(--color-sev-critico)]/30 bg-[var(--color-sev-critico)]/10 p-3 text-sm text-[var(--color-sev-critico)]">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{erro}</span>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={voltar}
                  disabled={etapa === 1 || submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink-700/15 bg-white px-6 py-3 text-sm font-bold text-ink-700 transition-colors hover:bg-ink-700/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={avancar}
                  disabled={!podeAvancar() || submitting}
                  className="btn-cta disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Calculando...
                    </>
                  ) : etapa === 5 ? (
                    <>
                      Calcular meu orçamento
                      <Receipt className="h-5 w-5" />
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
          Seus dados são usados apenas para gerar e enviar o orçamento. Não compartilhamos com terceiros.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

// ============================================================
// ETAPA 1 — Atividade
// ============================================================
function EtapaAtividade({
  atividadeId,
  setAtividadeId,
  busca,
  setBusca,
  categorias,
  atividadesFiltradas,
}: {
  atividadeId: string;
  setAtividadeId: (v: string) => void;
  busca: string;
  setBusca: (v: string) => void;
  categorias: string[];
  atividadesFiltradas: typeof ATIVIDADES | null;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Ruler className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Qual serviço você quer orçar?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Escolha a atividade da obra
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        76 atividades catalogadas, agrupadas por etapa da obra. Digite pra buscar ou navegue por categoria.
      </p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="ex: alvenaria, piso, gesso, fundação..."
          className="w-full rounded-xl border border-ink-700/15 bg-white py-3 pl-11 pr-4 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
        />
      </div>

      <div className="mt-5 max-h-[420px] overflow-y-auto rounded-xl border border-ink-700/10 bg-white">
        {atividadesFiltradas ? (
          atividadesFiltradas.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-400">
              Nenhuma atividade encontrada. Tente outra palavra.
            </p>
          ) : (
            <ul>
              {atividadesFiltradas.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setAtividadeId(a.id)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-ink-700/5 px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--gold-soft)] ${
                      atividadeId === a.id ? "bg-[var(--gold-soft)]" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-ink-900">{a.nome}</p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {a.categoria} · unidade: {a.unidade}
                      </p>
                    </div>
                    {atividadeId === a.id && (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-gold-600" />
                    )}
                  </button>
                </li>
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
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setAtividadeId(a.id)}
                      className={`flex w-full items-center justify-between gap-3 border-b border-ink-700/5 px-4 py-3 pl-8 text-left text-sm transition-colors hover:bg-[var(--gold-soft)] ${
                        atividadeId === a.id ? "bg-[var(--gold-soft)]" : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-ink-900">{a.nome}</p>
                        <p className="mt-0.5 text-xs text-ink-400">
                          unidade: {a.unidade}
                        </p>
                      </div>
                      {atividadeId === a.id && (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-gold-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// ETAPA 2 — Quantidade
// ============================================================
function EtapaQuantidade({
  quantidade,
  setQuantidade,
  unidade,
  atividadeNome,
}: {
  quantidade: string;
  setQuantidade: (v: string) => void;
  unidade: string;
  atividadeNome: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Ruler className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Quanto vai executar?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Informe a quantidade
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Serviço selecionado: <strong className="text-ink-700">{atividadeNome}</strong>
      </p>

      <div className="mt-8 flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-bold text-ink-700">Quantidade</label>
          <input
            type="text"
            inputMode="decimal"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="ex: 120"
            autoFocus
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-4 text-2xl font-bold text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <div className="flex h-[60px] items-center rounded-xl bg-navy-900 px-5">
          <span className="display text-xl text-gold-500">{unidade}</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-400">
        Dica: se for área (m²), multiplique o comprimento pela altura. Se for volume (m³), multiplique comprimento × largura × altura.
      </p>
    </div>
  );
}

// ============================================================
// ETAPA 3 — Local
// ============================================================
function EtapaLocal({
  uf,
  setUf,
  cidade,
  setCidade,
  ufs,
}: {
  uf: string;
  setUf: (v: string) => void;
  cidade: string;
  setCidade: (v: string) => void;
  ufs: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <MapPin className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Onde será a obra?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Localização da obra
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        O custo de mão de obra varia conforme o estado (CUB regional + convenções de sindicato).
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_2fr]">
        <div>
          <label className="block text-sm font-bold text-ink-700">Estado (UF)</label>
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          >
            <option value="">Selecione...</option>
            {ufs.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">
            Cidade <span className="font-normal text-ink-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="ex: Maringá"
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ETAPA 4 — Padrão de acabamento + BDI
// ============================================================
function EtapaPadrao({
  padrao,
  setPadrao,
  bdi,
  setBdi,
}: {
  padrao: PadraoAcabamento;
  setPadrao: (p: PadraoAcabamento) => void;
  bdi: number;
  setBdi: (v: number) => void;
}) {
  const opcoes: { id: PadraoAcabamento; titulo: string; desc: string }[] = [
    { id: "economico", titulo: "Econômico", desc: "Materiais básicos, acabamento simples" },
    { id: "medio", titulo: "Médio", desc: "Padrão de mercado, equilibrado" },
    { id: "alto", titulo: "Alto", desc: "Materiais premium, acabamento sofisticado" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Sliders className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Padrão e margem
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Padrão de acabamento e BDI
      </h2>

      <div className="mt-6">
        <label className="block text-sm font-bold text-ink-700">Padrão de acabamento</label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {opcoes.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setPadrao(o.id)}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                padrao === o.id
                  ? "border-gold-500 bg-[var(--gold-soft)]"
                  : "border-ink-700/10 bg-white hover:border-ink-700/30"
              }`}
            >
              <p
                className={`display text-lg ${
                  padrao === o.id ? "text-gold-600" : "text-ink-900"
                }`}
              >
                {o.titulo}
              </p>
              <p className="mt-1 text-xs text-ink-500">{o.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-ink-700">
            BDI <span className="font-normal text-ink-400">(Bonificação e Despesas Indiretas)</span>
          </label>
          <span className="display text-2xl text-gold-600">{bdi}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={bdi}
          onChange={(e) => setBdi(parseInt(e.target.value))}
          className="mt-3 w-full accent-gold-500"
        />
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-ink-400">
          <span>0%</span>
          <span>25% (padrão de mercado)</span>
          <span>50%</span>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          BDI é a margem aplicada sobre o custo direto (material + mão de obra) — cobre lucro, impostos, administração e imprevistos. Em obras residenciais médias, fica entre 20% e 30%.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ETAPA 5 — Contato
// ============================================================
function EtapaContato({
  nome,
  setNome,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
}: {
  nome: string;
  setNome: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <User className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Pra onde mandamos seu orçamento?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Seus dados de contato
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Vamos calcular agora. Você verá o resultado na próxima tela e também receberá uma cópia por e-mail.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-ink-700">Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="ex: Pedro Alcazar"
            autoFocus
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com.br"
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">
            WhatsApp <span className="font-normal text-ink-400">(opcional)</span>
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(44) 99999-9999"
            className="mt-2 w-full rounded-xl border border-ink-700/15 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
      </div>
    </div>
  );
}
