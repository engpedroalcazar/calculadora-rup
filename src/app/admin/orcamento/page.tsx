"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ExternalLink,
  FileDown,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

type LeadItem = {
  id: string;
  atividadeNome: string;
  unidade: string;
  quantidade: number;
  padraoAcabamento: string;
  custoDireto: number;
  origem: string;
};

type Lead = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string | null;
  uf: string;
  cidade: string | null;
  bdiPercentual: number;
  custoMaterialTotal: number;
  custoMaoObra: number;
  custoDireto: number;
  custoFinal: number;
  hhTotal: number;
  prazoDias: number;
  equipeSugerida: number;
  pago: boolean;
  valor: number | null;
  metodoPagamento: string | null;
  createdAt: string;
  itens: LeadItem[];
};

type Stats = {
  totalLeads: number;
  totalPagos: number;
  receita: number;
  ticketMedio: number;
};

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function rotuloPadrao(p: string): string {
  if (p === "economico") return "Econômico";
  if (p === "alto") return "Alto";
  return "Médio";
}

function MetodoBadge({ metodo }: { metodo: string | null }) {
  if (!metodo) return <span className="text-xs text-slate-400">—</span>;
  const map: Record<string, { label: string; cls: string }> = {
    pix: { label: "PIX", cls: "bg-emerald-100 text-emerald-700" },
    credit_card: { label: "Cartão", cls: "bg-blue-100 text-blue-700" },
    debit_card: { label: "Débito", cls: "bg-indigo-100 text-indigo-700" },
    ticket: { label: "Boleto", cls: "bg-yellow-100 text-yellow-700" },
    manual: { label: "Manual", cls: "bg-slate-100 text-slate-500" },
    "dev-unlock": { label: "Dev", cls: "bg-purple-100 text-purple-700" },
  };
  const m = map[metodo] ?? { label: metodo, cls: "bg-slate-100 text-slate-500" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${m.cls}`}>{m.label}</span>;
}

function LeadModal({
  lead,
  token,
  onClose,
  onUpdated,
}: {
  lead: Lead;
  token: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [marcando, setMarcando] = useState(false);
  const [erroMarcar, setErroMarcar] = useState("");
  const numeroPedido = `ORC-${lead.id.slice(-8).toUpperCase()}`;
  const local = lead.cidade ? `${lead.cidade}/${lead.uf}` : lead.uf;
  const data = new Date(lead.createdAt).toLocaleString("pt-BR");

  async function marcarPago() {
    setMarcando(true);
    setErroMarcar("");
    try {
      const res = await fetch("/api/admin/orcamento/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: lead.id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErroMarcar(j.error ?? "Falha ao marcar como pago");
        return;
      }
      onUpdated();
      onClose();
    } finally {
      setMarcando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <div>
            <p className="font-black text-slate-950 text-lg">{lead.nome}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">
                {numeroPedido}
              </span>
              <span className="text-xs text-slate-400">{data}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {lead.whatsapp ? (
              <a
                href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 hover:bg-emerald-100"
              >
                <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-emerald-700">WhatsApp</p>
                  <p className="text-sm font-bold text-emerald-900 truncate">{lead.whatsapp}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-400 italic">Sem WhatsApp</p>
              </div>
            )}
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100"
            >
              <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-blue-700">E-mail</p>
                <p className="text-sm font-bold text-blue-900 truncate">{lead.email}</p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <span>{local}</span>
            <span className="text-slate-300">·</span>
            <span>BDI {lead.bdiPercentual}%</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lead.itens.length} {lead.itens.length === 1 ? "serviço" : "serviços"}
              </p>
              <p className="text-xl font-black text-slate-950">{formatBRL(lead.custoFinal)}</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {lead.itens.map((it) => (
                <div
                  key={it.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-white p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{it.atividadeNome}</p>
                    <p className="text-xs text-slate-500">
                      {it.quantidade.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} {it.unidade} · padrão {rotuloPadrao(it.padraoAcabamento)}
                      {it.origem === "sugerido" && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          sugerido
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {formatBRL(it.custoDireto)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-xs">
              <div>
                <p className="text-slate-500">Material</p>
                <p className="font-bold text-slate-900">{formatBRL(lead.custoMaterialTotal)}</p>
              </div>
              <div>
                <p className="text-slate-500">Mão de obra</p>
                <p className="font-bold text-slate-900">{formatBRL(lead.custoMaoObra)}</p>
              </div>
              <div>
                <p className="text-slate-500">BDI</p>
                <p className="font-bold text-slate-900">
                  {formatBRL(lead.custoFinal - lead.custoDireto)}
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">Equipe</p>
                <p className="font-bold text-slate-900">{lead.equipeSugerida} pessoa(s)</p>
              </div>
              <div>
                <p className="text-slate-500">Prazo</p>
                <p className="font-bold text-slate-900">{lead.prazoDias} dia(s)</p>
              </div>
              <div>
                <p className="text-slate-500">Homem-hora</p>
                <p className="font-bold text-slate-900">{lead.hhTotal.toFixed(0)} h</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
            {lead.pago ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    Pago{lead.valor != null ? ` · ${formatBRL(lead.valor)}` : ""}
                  </p>
                  <MetodoBadge metodo={lead.metodoPagamento} />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-700">Lead ainda não pagou</p>
                <p className="text-xs text-slate-500">
                  Use o botão abaixo se confirmar pagamento por fora (PIX/transferência).
                </p>
                {erroMarcar && <p className="mt-1 text-xs text-red-600">{erroMarcar}</p>}
              </div>
            )}
            {!lead.pago && (
              <button
                onClick={marcarPago}
                disabled={marcando}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {marcando ? "Marcando..." : "Marcar pago"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/orcamento/resultado/${lead.id}`}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Ver orçamento
            </Link>
            <Link
              href={`/orcamento/relatorio/${lead.id}?token=${token}`}
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            >
              <FileDown className="h-4 w-4" />
              Ver relatório
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrcamentoConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErro, setLoginErro] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [pagoFilter, setPagoFilter] = useState<"" | "sim" | "nao">("");
  const [periodoFilter, setPeriodoFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(
    async (opts: {
      page: number;
      pago: "" | "sim" | "nao";
      periodo: "all" | "7d" | "30d" | "90d";
      busca: string;
      tok: string;
    }) => {
      setLeadsLoading(true);
      try {
        const p = new URLSearchParams({
          token: opts.tok,
          page: String(opts.page),
          limit: "50",
          periodo: opts.periodo,
        });
        if (opts.pago) p.set("pago", opts.pago);
        if (opts.busca) p.set("busca", opts.busca);
        const res = await fetch(`/api/admin/orcamento/leads?${p}`);
        if (!res.ok) return;
        const data = await res.json();
        setLeads(data.leads);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
        setStats(data.stats);
      } finally {
        setLeadsLoading(false);
      }
    },
    [],
  );

  async function login(t: string) {
    setLoginLoading(true);
    setLoginErro("");
    try {
      const p = new URLSearchParams({ token: t, page: "1", limit: "1", periodo: "all" });
      const res = await fetch(`/api/admin/orcamento/leads?${p}`);
      if (res.status === 401) {
        setLoginErro("Token inválido");
        return;
      }
      if (!res.ok) {
        setLoginErro("Erro ao conectar");
        return;
      }
      setAutenticado(true);
      sessionStorage.setItem("admin_token", t);
      router.replace("/admin/orcamento", { scroll: false });
    } catch {
      setLoginErro("Erro ao conectar");
    } finally {
      setLoginLoading(false);
    }
  }

  useEffect(() => {
    const t = searchParams.get("token") ?? sessionStorage.getItem("admin_token") ?? "";
    if (t) {
      setToken(t);
      login(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    fetchLeads({ page, pago: pagoFilter, periodo: periodoFilter, busca, tok: token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticado, page, pagoFilter, periodoFilter, busca, token]);

  function applyBusca() {
    setBusca(buscaInput.trim());
    setPage(1);
  }

  function refresh() {
    fetchLeads({ page, pago: pagoFilter, periodo: periodoFilter, busca, tok: token });
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-amber-600" />
            <span className="font-black text-xl text-slate-950">ObraRadar Admin · Orçamento</span>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Token de acesso</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login(token)}
              className="h-12 rounded-xl border border-slate-300 px-4 text-base focus:border-slate-950 focus:outline-none"
              placeholder="Insira o token"
            />
          </label>
          {loginErro && <p className="mt-2 text-sm text-red-600">{loginErro}</p>}
          <button
            onClick={() => login(token)}
            disabled={loginLoading || !token}
            className="mt-4 h-12 w-full rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loginLoading ? "Carregando..." : "Entrar"}
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">
            Mesmo token do admin do RUP. <Link href="/admin" className="underline">Voltar ao RUP →</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/admin" className="rounded-xl p-2 hover:bg-slate-100" title="Voltar ao admin RUP">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Link>
            <Calculator className="h-5 w-5 text-amber-600" />
            <span className="font-black text-slate-950 hidden sm:block">Orçamento · Admin</span>
          </div>
          <div className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, cidade…"
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyBusca()}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {buscaInput && (
              <button
                onClick={() => {
                  setBuscaInput("");
                  setBusca("");
                  setPage(1);
                }}
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
            <button
              onClick={applyBusca}
              className="rounded-lg bg-slate-950 px-3 py-1 text-xs font-bold text-white hover:bg-slate-700"
            >
              Buscar
            </button>
          </div>
          <button
            onClick={refresh}
            className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
            title="Atualizar"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total de leads",
              value: stats?.totalLeads ?? 0,
              Icon: Users,
              color: "text-slate-950",
            },
            {
              label: "Pagos",
              value: stats?.totalPagos ?? 0,
              Icon: CheckCircle2,
              color: "text-emerald-600",
            },
            {
              label: "Receita",
              value: formatBRL(stats?.receita ?? 0),
              Icon: DollarSign,
              color: "text-amber-600",
            },
            {
              label: "Ticket médio",
              value: formatBRL(stats?.ticketMedio ?? 0),
              Icon: DollarSign,
              color: "text-blue-600",
            },
          ].map(({ label, value, Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500">{label}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold text-slate-500">Pagamento:</p>
            {(
              [
                ["", "Todos"],
                ["sim", "✓ Pagos"],
                ["nao", "✗ Não pagos"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                onClick={() => {
                  setPagoFilter(v);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1 text-xs font-bold ${
                  pagoFilter === v
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="text-slate-300">·</span>
            <p className="text-xs font-semibold text-slate-500">Período:</p>
            {(
              [
                ["7d", "7 dias"],
                ["30d", "30 dias"],
                ["90d", "90 dias"],
                ["all", "Tudo"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                onClick={() => {
                  setPeriodoFilter(v);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1 text-xs font-bold ${
                  periodoFilter === v
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="font-black text-slate-950">Leads do orçamento</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {leadsLoading
                  ? "Carregando…"
                  : busca || pagoFilter || periodoFilter !== "all"
                    ? `${total} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
                    : `${total} lead${total !== 1 ? "s" : ""} no total`}
              </p>
            </div>
            {pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-700 px-1">
                  {page} / {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  {["Nº Pedido", "Nome", "Contato", "Local", "Serviços", "Custo final", "Pago", "Data"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {leadsLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                      {busca || pagoFilter || periodoFilter !== "all"
                        ? "Nenhum lead encontrado para este filtro."
                        : "Nenhum lead ainda."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const pedidoId = `ORC-${lead.id.slice(-8).toUpperCase()}`;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="border-b border-slate-50 hover:bg-amber-50/40 cursor-pointer"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">
                            {pedidoId}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-950 whitespace-nowrap">
                          {lead.nome}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {lead.whatsapp && (
                            <div className="text-slate-700 font-medium">{lead.whatsapp}</div>
                          )}
                          <div className="text-xs text-slate-400 truncate max-w-44">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {lead.cidade ? `${lead.cidade}/${lead.uf}` : lead.uf}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                            {lead.itens.length} {lead.itens.length === 1 ? "serviço" : "serviços"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                          {formatBRL(lead.custoFinal)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                          >
                            {lead.pago
                              ? lead.valor != null
                                ? formatBRL(lead.valor)
                                : "Sim"
                              : "Não"}
                          </span>
                          {lead.metodoPagamento && (
                            <span className="ml-1">
                              <MetodoBadge metodo={lead.metodoPagamento} />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          token={token}
          onClose={() => setSelectedLead(null)}
          onUpdated={refresh}
        />
      )}
    </div>
  );
}

export default function AdminOrcamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
        </div>
      }
    >
      <AdminOrcamentoConteudo />
    </Suspense>
  );
}
