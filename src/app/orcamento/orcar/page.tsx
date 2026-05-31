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
  Plus,
  Trash2,
  Sparkles,
  X,
} from "lucide-react";
import { BrandHeader } from "@/components/orcamento/BrandHeader";
import { SiteFooter } from "@/components/orcamento/SiteFooter";
import { QuizProgress } from "@/components/orcamento/QuizProgress";
import {
  ATIVIDADES,
  buscarAtividade,
  listarCategorias,
  atividadesPorCategoria,
} from "@/data/orcamento/atividades-custo";
import { buscarSugestoes } from "@/data/orcamento/combos";
import { listarUfs } from "@/lib/orcamento/salarios";
import type { PadraoAcabamento } from "@/lib/orcamento/calculo";

const LABELS_ETAPAS = ["Serviços", "Quantidade", "Local", "Margem", "Contato"];
const MAX_ITENS = 20;

// Um serviço dentro do orçamento. A partir da Iter #4 o quiz monta uma lista.
type ItemQuiz = {
  atividadeId: string;
  quantidade: string; // input controlado — convertido pra número no envio
  padrao: PadraoAcabamento;
  origem: "manual" | "sugerido";
  comboTriggerId?: string;
};

export default function OrcarPage() {
  const [etapa, setEtapa] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [itens, setItens] = useState<ItemQuiz[]>([]);
  const [busca, setBusca] = useState("");
  const [combosOcultos, setCombosOcultos] = useState<Set<string>>(new Set());

  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [bdi, setBdi] = useState(25);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const categorias = listarCategorias();
  const ufs = listarUfs();

  const selecionadasIds = useMemo(() => itens.map((i) => i.atividadeId), [itens]);

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return null;
    return ATIVIDADES.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.categoria.toLowerCase().includes(termo)
    );
  }, [busca]);

  // Sugestões de combo: para cada item adicionado manualmente, buscamos as
  // atividades complementares que ainda não estão no orçamento e que o usuário
  // não dispensou. Cada sugestão lembra qual atividade gatilho a originou.
  const sugestoesAtuais = useMemo(() => {
    const map = new Map<
      string,
      { atividadeId: string; herdaQuantidade: boolean; comboTriggerId: string }
    >();
    for (const item of itens) {
      if (item.origem !== "manual") continue;
      for (const s of buscarSugestoes(item.atividadeId, selecionadasIds)) {
        if (combosOcultos.has(s.atividadeId)) continue;
        if (!map.has(s.atividadeId)) {
          map.set(s.atividadeId, {
            atividadeId: s.atividadeId,
            herdaQuantidade: s.herdaQuantidade,
            comboTriggerId: item.atividadeId,
          });
        }
      }
    }
    return Array.from(map.values());
  }, [itens, selecionadasIds, combosOcultos]);

  function toggleAtividade(id: string) {
    setErro(null);
    setItens((prev) => {
      const existe = prev.find((i) => i.atividadeId === id);
      if (existe) return prev.filter((i) => i.atividadeId !== id);
      if (prev.length >= MAX_ITENS) return prev;
      return [
        ...prev,
        { atividadeId: id, quantidade: "", padrao: "medio", origem: "manual" },
      ];
    });
  }

  function removerItem(id: string) {
    setItens((prev) => prev.filter((i) => i.atividadeId !== id));
  }

  function atualizarItem(id: string, patch: Partial<ItemQuiz>) {
    setItens((prev) =>
      prev.map((i) => (i.atividadeId === id ? { ...i, ...patch } : i))
    );
  }

  function adicionarSugestoes(ids: string[]) {
    setItens((prev) => {
      const jaTem = new Set(prev.map((i) => i.atividadeId));
      const novos: ItemQuiz[] = [];
      for (const id of ids) {
        if (jaTem.has(id) || prev.length + novos.length >= MAX_ITENS) continue;
        const sug = sugestoesAtuais.find((s) => s.atividadeId === id);
        if (!sug) continue;
        const trigger = prev.find((i) => i.atividadeId === sug.comboTriggerId);
        const herda =
          sug.herdaQuantidade && trigger && trigger.quantidade.trim() !== "";
        novos.push({
          atividadeId: id,
          quantidade: herda ? trigger!.quantidade : "",
          padrao: trigger?.padrao ?? "medio",
          origem: "sugerido",
          comboTriggerId: sug.comboTriggerId,
        });
      }
      return [...prev, ...novos];
    });
  }

  function ignorarSugestoes(ids: string[]) {
    setCombosOcultos((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function podeAvancar(): boolean {
    switch (etapa) {
      case 1:
        return itens.length >= 1;
      case 2:
        return (
          itens.length >= 1 &&
          itens.every((i) => {
            const q = parseFloat(i.quantidade.replace(",", "."));
            return !isNaN(q) && q > 0;
          })
        );
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
          itens: itens.map((i) => ({
            atividadeId: i.atividadeId,
            quantidade: parseFloat(i.quantidade.replace(",", ".")),
            padraoAcabamento: i.padrao,
            origem: i.origem,
            comboTriggerId: i.comboTriggerId,
          })),
          uf,
          cidade: cidade.trim() || undefined,
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
            <EtapaServicos
              selecionadasIds={selecionadasIds}
              totalSelecionadas={itens.length}
              toggleAtividade={toggleAtividade}
              busca={busca}
              setBusca={setBusca}
              categorias={categorias}
              atividadesFiltradas={atividadesFiltradas}
            />
          )}

          {etapa === 2 && (
            <EtapaQuantidades
              itens={itens}
              atualizarItem={atualizarItem}
              removerItem={removerItem}
              sugestoes={sugestoesAtuais}
              onAdicionarSugestoes={adicionarSugestoes}
              onIgnorarSugestoes={ignorarSugestoes}
              onAdicionarMais={() => setEtapa(1)}
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

          {etapa === 4 && <EtapaMargem bdi={bdi} setBdi={setBdi} />}

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
// ETAPA 1 — Serviços (multi-seleção)
// ============================================================
function EtapaServicos({
  selecionadasIds,
  totalSelecionadas,
  toggleAtividade,
  busca,
  setBusca,
  categorias,
  atividadesFiltradas,
}: {
  selecionadasIds: string[];
  totalSelecionadas: number;
  toggleAtividade: (id: string) => void;
  busca: string;
  setBusca: (v: string) => void;
  categorias: string[];
  atividadesFiltradas: typeof ATIVIDADES | null;
}) {
  const selecionadas = new Set(selecionadasIds);

  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Ruler className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Quais serviços você quer orçar?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Escolha as atividades da obra
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Selecione quantos serviços quiser — você pode orçar a obra inteira de uma vez. Na próxima etapa informa a quantidade de cada um.
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

      {totalSelecionadas > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--gold-soft)] px-4 py-3 text-sm font-semibold text-gold-600">
          <CheckCircle2 className="h-4 w-4" />
          {totalSelecionadas} serviço{totalSelecionadas > 1 ? "s" : ""} selecionado
          {totalSelecionadas > 1 ? "s" : ""}
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
                  selecionada={selecionadas.has(a.id)}
                  onToggle={() => toggleAtividade(a.id)}
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
                    selecionada={selecionadas.has(a.id)}
                    onToggle={() => toggleAtividade(a.id)}
                    indentada
                  />
                ))}
              </ul>
            </details>
          ))
        )}
      </div>
    </div>
  );
}

function LinhaAtividade({
  nome,
  detalhe,
  selecionada,
  onToggle,
  indentada,
}: {
  nome: string;
  detalhe: string;
  selecionada: boolean;
  onToggle: () => void;
  indentada?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 border-b border-ink-700/5 px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--gold-soft)] ${
          indentada ? "pl-8" : ""
        } ${selecionada ? "bg-[var(--gold-soft)]" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
              selecionada
                ? "border-gold-500 bg-gold-500 text-navy-900"
                : "border-ink-700/25 bg-white"
            }`}
          >
            {selecionada && <CheckCircle2 className="h-3.5 w-3.5" />}
          </span>
          <div>
            <p className="font-semibold text-ink-900">{nome}</p>
            <p className="mt-0.5 text-xs text-ink-400">{detalhe}</p>
          </div>
        </div>
      </button>
    </li>
  );
}

// ============================================================
// ETAPA 2 — Quantidades + padrão por item + combos
// ============================================================
function EtapaQuantidades({
  itens,
  atualizarItem,
  removerItem,
  sugestoes,
  onAdicionarSugestoes,
  onIgnorarSugestoes,
  onAdicionarMais,
}: {
  itens: ItemQuiz[];
  atualizarItem: (id: string, patch: Partial<ItemQuiz>) => void;
  removerItem: (id: string) => void;
  sugestoes: { atividadeId: string; herdaQuantidade: boolean; comboTriggerId: string }[];
  onAdicionarSugestoes: (ids: string[]) => void;
  onIgnorarSugestoes: (ids: string[]) => void;
  onAdicionarMais: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Ruler className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Quanto vai executar de cada serviço?
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">
        Quantidade e padrão por serviço
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Informe a quantidade de cada serviço e escolha o padrão de acabamento —
        cada item pode ter um padrão diferente.
      </p>

      {sugestoes.length > 0 && (
        <BannerCombos
          key={sugestoes.map((s) => s.atividadeId).join(",")}
          sugestoes={sugestoes}
          onAdicionar={onAdicionarSugestoes}
          onIgnorar={onIgnorarSugestoes}
        />
      )}

      <div className="mt-6 space-y-4">
        {itens.map((item) => (
          <CardItem
            key={item.atividadeId}
            item={item}
            atualizarItem={atualizarItem}
            removerItem={removerItem}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAdicionarMais}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-dashed border-gold-500/50 bg-white px-5 py-3 text-sm font-bold text-gold-600 transition-colors hover:bg-[var(--gold-soft)]"
      >
        <Plus className="h-4 w-4" />
        Adicionar mais serviços
      </button>
    </div>
  );
}

function CardItem({
  item,
  atualizarItem,
  removerItem,
}: {
  item: ItemQuiz;
  atualizarItem: (id: string, patch: Partial<ItemQuiz>) => void;
  removerItem: (id: string) => void;
}) {
  const atividade = buscarAtividade(item.atividadeId);
  const padroes: { id: PadraoAcabamento; label: string }[] = [
    { id: "economico", label: "Econômico" },
    { id: "medio", label: "Médio" },
    { id: "alto", label: "Alto" },
  ];

  return (
    <div className="rounded-2xl border border-ink-700/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-ink-900">{atividade?.nome ?? item.atividadeId}</p>
            {item.origem === "sugerido" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                <Sparkles className="h-3 w-3" /> sugerido
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-400">{atividade?.categoria}</p>
        </div>
        <button
          type="button"
          onClick={() => removerItem(item.atividadeId)}
          aria-label="Remover serviço"
          className="flex-shrink-0 rounded-lg p-2 text-ink-400 transition-colors hover:bg-[var(--color-sev-critico)]/10 hover:text-[var(--color-sev-critico)]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">
            Quantidade
          </label>
          <div className="mt-2 flex items-stretch gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={item.quantidade}
              onChange={(e) =>
                atualizarItem(item.atividadeId, { quantidade: e.target.value })
              }
              placeholder="ex: 120"
              className="w-full rounded-xl border border-ink-700/15 bg-white px-3 py-2.5 text-lg font-bold text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
            <div className="flex items-center rounded-xl bg-navy-900 px-3">
              <span className="display text-base text-gold-500">
                {atividade?.unidade ?? "—"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">
            Padrão de acabamento
          </label>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {padroes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => atualizarItem(item.atividadeId, { padrao: p.id })}
                className={`rounded-lg border-2 px-2 py-2.5 text-xs font-bold transition-colors ${
                  item.padrao === p.id
                    ? "border-gold-500 bg-[var(--gold-soft)] text-gold-600"
                    : "border-ink-700/10 bg-white text-ink-500 hover:border-ink-700/30"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerCombos({
  sugestoes,
  onAdicionar,
  onIgnorar,
}: {
  sugestoes: { atividadeId: string; herdaQuantidade: boolean; comboTriggerId: string }[];
  onAdicionar: (ids: string[]) => void;
  onIgnorar: (ids: string[]) => void;
}) {
  const [marcadas, setMarcadas] = useState<Set<string>>(
    () => new Set(sugestoes.map((s) => s.atividadeId))
  );

  function toggle(id: string) {
    setMarcadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const todosIds = sugestoes.map((s) => s.atividadeId);
  const marcadasArr = todosIds.filter((id) => marcadas.has(id));

  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-gold-500/40 bg-[var(--gold-soft)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-gold-600">
          <Sparkles className="h-5 w-5" />
          <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
            Combo recomendado
          </p>
        </div>
        <button
          type="button"
          onClick={() => onIgnorar(todosIds)}
          aria-label="Dispensar sugestões"
          className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-white hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-700">
        Esses serviços costumam vir junto. Marque os que quiser incluir:
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {sugestoes.map((s) => {
          const atividade = buscarAtividade(s.atividadeId);
          const marcada = marcadas.has(s.atividadeId);
          return (
            <button
              key={s.atividadeId}
              type="button"
              onClick={() => toggle(s.atividadeId)}
              className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                marcada
                  ? "border-gold-500 bg-white text-gold-600"
                  : "border-ink-700/15 bg-white/60 text-ink-400"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  marcada ? "border-gold-500 bg-gold-500" : "border-ink-700/25"
                }`}
              >
                {marcada && <CheckCircle2 className="h-3 w-3 text-navy-900" />}
              </span>
              {atividade?.nome ?? s.atividadeId}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={marcadasArr.length === 0}
          onClick={() => onAdicionar(marcadasArr)}
          className="inline-flex items-center gap-2 rounded-2xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-cream-50 transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Adicionar {marcadasArr.length > 0 ? marcadasArr.length : ""} ao orçamento
        </button>
        <button
          type="button"
          onClick={() => onIgnorar(todosIds)}
          className="text-sm font-semibold text-ink-500 underline-offset-2 hover:underline"
        >
          Agora não
        </button>
      </div>
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
      <h2 className="display mt-3 text-2xl text-ink-900">Localização da obra</h2>
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
// ETAPA 4 — Margem (BDI)
// ============================================================
function EtapaMargem({
  bdi,
  setBdi,
}: {
  bdi: number;
  setBdi: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-600">
        <Sliders className="h-5 w-5" />
        <p className="t-label t-label-on-cream" style={{ color: "inherit" }}>
          Margem do orçamento
        </p>
      </div>
      <h2 className="display mt-3 text-2xl text-ink-900">BDI</h2>
      <p className="mt-2 text-sm text-ink-500">
        O padrão de acabamento já foi definido por serviço na etapa anterior. Aqui
        você ajusta só a margem aplicada sobre o custo direto de toda a obra.
      </p>

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
      <h2 className="display mt-3 text-2xl text-ink-900">Seus dados de contato</h2>
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
