"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Gauge, Download, TrendingUp, Users, DollarSign, AlertTriangle,
  Search, X, Phone, Mail, MapPin, Building, ChevronLeft, ChevronRight, RefreshCw,
} from "lucide-react";
import { corSeveridade, fmt } from "@/lib/rup";
import type { Severidade } from "@/lib/rup";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────────────── */
interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email: string | null;
  perfil: string | null;
  tipoObra: string | null;
  cidade: string | null;
  atividadeNome: string;
  severidade: string;
  desvio: number;
  rupReal: number;
  rupRef: number;
  hhTotal: number;
  pago: boolean;
  valor: number | null;
  createdAt: string;
}

interface LeadsResp {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface Stats {
  total: number;
  pagos: number;
  porSeveridade: { severidade: string; _count: { id: number } }[];
  recentes: Lead[];
}

const SEV_ORDER: Severidade[] = ["CRÍTICO", "ALERTA", "ATENÇÃO", "NORMAL", "VERIFICAR"];

/* ── Severity badge colours (pill style) ────────────────────────────── */
function SevPill({ sev, count, active, onClick }: {
  sev: Severidade; count: number; active: boolean; onClick: () => void;
}) {
  const MAP: Record<Severidade, { bg: string; text: string; ring: string }> = {
    CRÍTICO:  { bg: "bg-red-100",    text: "text-red-700",    ring: "ring-red-400" },
    ALERTA:   { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-400" },
    ATENÇÃO:  { bg: "bg-yellow-100", text: "text-yellow-800", ring: "ring-yellow-400" },
    NORMAL:   { bg: "bg-emerald-100",text: "text-emerald-700",ring: "ring-emerald-400" },
    VERIFICAR:{ bg: "bg-blue-100",   text: "text-blue-700",   ring: "ring-blue-400" },
  };
  const c = MAP[sev];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition-all",
        c.bg, c.text,
        active ? `ring-2 ${c.ring} scale-105 shadow-sm` : "opacity-70 hover:opacity-100",
      )}
    >
      {sev}
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-black", active ? "bg-white/60" : "bg-white/40")}>
        {count}
      </span>
    </button>
  );
}

/* ── Lead detail modal ───────────────────────────────────────────────── */
function LeadModal({ lead, onClose, token }: { lead: Lead; onClose: () => void; token: string }) {
  const cor = corSeveridade(lead.severidade as Severidade);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="font-black text-slate-950 text-lg">{lead.nome}</p>
            <p className="text-sm text-slate-500">{new Date(lead.createdAt).toLocaleString("pt-BR")}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Contacts */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 hover:bg-emerald-100 transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-700">WhatsApp</p>
                <p className="text-sm font-bold text-emerald-900 truncate">{lead.whatsapp}</p>
              </div>
            </a>
            {lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-blue-700">E-mail</p>
                  <p className="text-sm font-bold text-blue-900 truncate">{lead.email}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-400 italic">Sem e-mail</p>
              </div>
            )}
          </div>

          {/* Context */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {lead.cidade && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{lead.cidade}</span>
              </div>
            )}
            {lead.tipoObra && (
              <div className="flex items-center gap-2 text-slate-600">
                <Building className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{lead.tipoObra}</span>
              </div>
            )}
            {lead.perfil && (
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{lead.perfil}</span>
              </div>
            )}
          </div>

          {/* Diagnosis */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium truncate max-w-xs">{lead.atividadeNome}</p>
              <span className={cn("rounded-full px-3 py-1 text-xs font-black", cor.badge)}>{lead.severidade}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-slate-500">RUP Real</p>
                <p className="font-black text-slate-950">{lead.rupReal.toFixed(3)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">RUP Ref.</p>
                <p className="font-black text-slate-950">{lead.rupRef.toFixed(3)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Desvio</p>
                <p className={cn("font-black", lead.desvio > 20 ? "text-red-600" : lead.desvio > 10 ? "text-orange-500" : "text-emerald-600")}>
                  {lead.desvio > 0 ? "+" : ""}{fmt(lead.desvio, 1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-xs text-slate-500">Total HH</span>
              <span className="font-bold text-slate-700">{lead.hhTotal.toFixed(1)} HH</span>
            </div>
          </div>

          {/* Payment + actions */}
          <div className="flex items-center justify-between">
            <span className={cn(
              "rounded-full px-3 py-1 text-sm font-bold",
              lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
            )}>
              {lead.pago ? `✓ Pago${lead.valor ? ` · R$ ${lead.valor}` : ""}` : "Não pagou"}
            </span>
            <Link
              href={`/relatorio/${lead.id}?token=${token}`}
              target="_blank"
              className={cn(
                "text-sm font-bold underline hover:no-underline",
                lead.pago ? "text-slate-950" : "text-slate-400",
              )}
            >
              {lead.pago ? "Ver relatório →" : "Ver relatório (admin) →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main dashboard ─────────────────────────────────────────────────── */
function AdminConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auth
  const [token, setToken] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErro, setLoginErro] = useState("");

  // Stats (summary)
  const [stats, setStats] = useState<Stats | null>(null);

  // Leads table
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Filters
  const [sevFilter, setSevFilter] = useState<Severidade | "">("");
  const [pagoFilter, setPagoFilter] = useState<"" | "sim" | "nao">("");
  const [busca, setBusca] = useState("");
  const [buscaInput, setBuscaInput] = useState("");

  // Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  /* ── Auth ─────────────────────────────────────────────────── */
  async function login(t: string) {
    setLoginLoading(true);
    setLoginErro("");
    try {
      const res = await fetch(`/api/admin/stats?token=${t}`);
      if (res.status === 401) { setLoginErro("Token inválido"); return; }
      const data = await res.json();
      setStats(data);
      setAutenticado(true);
      sessionStorage.setItem("admin_token", t);
      router.replace("/admin", { scroll: false });
    } catch {
      setLoginErro("Erro ao conectar");
    } finally {
      setLoginLoading(false);
    }
  }

  useEffect(() => {
    const urlToken = searchParams.get("token");
    const storedToken = sessionStorage.getItem("admin_token");
    const t = urlToken ?? storedToken ?? "";
    if (t) { setToken(t); login(t); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Fetch leads ──────────────────────────────────────────── */
  const fetchLeads = useCallback(async (opts: {
    page: number; sev: Severidade | ""; pago: "" | "sim" | "nao"; busca: string; tok: string;
  }) => {
    setLeadsLoading(true);
    try {
      const params = new URLSearchParams({
        token: opts.tok,
        page: String(opts.page),
        limit: "50",
      });
      if (opts.sev) params.set("severidade", opts.sev);
      if (opts.pago) params.set("pago", opts.pago);
      if (opts.busca) params.set("busca", opts.busca);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) return;
      const data: LeadsResp = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
      setPages(data.pages);
      setPage(data.page);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    fetchLeads({ page, sev: sevFilter, pago: pagoFilter, busca, tok: token });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticado, page, sevFilter, pagoFilter, busca, token]);

  /* ── Helpers ─────────────────────────────────────────────── */
  function applyBusca() {
    setBusca(buscaInput.trim());
    setPage(1);
  }

  function toggleSev(s: Severidade) {
    setSevFilter((prev) => (prev === s ? "" : s));
    setPage(1);
  }

  function exportCSV() {
    const params = new URLSearchParams({ token, format: "csv" });
    if (sevFilter) params.set("severidade", sevFilter);
    if (pagoFilter) params.set("pago", pagoFilter);
    if (busca) params.set("busca", busca);
    window.open(`/api/admin/leads?${params}`, "_blank");
  }

  const porSev = Object.fromEntries(
    (stats?.porSeveridade ?? []).map((s) => [s.severidade, s._count.id])
  );
  const receita = (stats?.pagos ?? 0) * 29.9;

  /* ── Login screen ─────────────────────────────────────────── */
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Gauge className="h-6 w-6" />
            <span className="font-black text-xl">ObraRadar Admin</span>
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
            className="mt-4 h-12 w-full rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loginLoading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Dashboard ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Gauge className="h-5 w-5" />
            <span className="font-black text-slate-950 hidden sm:block">ObraRadar Admin</span>
          </Link>

          {/* Search bar */}
          <div className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, telefone, cidade…"
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyBusca()}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {buscaInput && (
              <button onClick={() => { setBuscaInput(""); setBusca(""); setPage(1); }}>
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
            <button
              onClick={applyBusca}
              className="rounded-lg bg-slate-950 px-3 py-1 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Buscar
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => fetchLeads({ page, sev: sevFilter, pago: pagoFilter, busca, tok: token })}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 transition-colors"
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4 text-slate-600" />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:block">CSV</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total de leads", value: stats?.total ?? 0, icon: Users, color: "text-slate-950" },
            { label: "Relatórios pagos", value: stats?.pagos ?? 0, icon: DollarSign, color: "text-emerald-600" },
            { label: "Receita estimada", value: `R$ ${receita.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, icon: TrendingUp, color: "text-emerald-600" },
            {
              label: "Taxa de conversão",
              value: (stats?.total ?? 0) > 0
                ? `${(((stats?.pagos ?? 0) / (stats?.total ?? 1)) * 100).toFixed(1)}%`
                : "—",
              icon: AlertTriangle, color: "text-orange-500",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500">{label}</p>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className={cn("text-2xl font-black", color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Severity filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-slate-500 mr-1">Filtrar por severidade:</p>
            {SEV_ORDER.map((s) => (
              <SevPill
                key={s}
                sev={s}
                count={porSev[s] ?? 0}
                active={sevFilter === s}
                onClick={() => toggleSev(s)}
              />
            ))}
            {sevFilter && (
              <button
                onClick={() => { setSevFilter(""); setPage(1); }}
                className="ml-auto text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Limpar filtro
              </button>
            )}
          </div>

          {/* Pago filter */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Pagamento:</p>
            {(["", "sim", "nao"] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setPagoFilter(v); setPage(1); }}
                className={cn(
                  "rounded-xl px-3 py-1 text-xs font-bold transition-colors",
                  pagoFilter === v
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {v === "" ? "Todos" : v === "sim" ? "✓ Pagos" : "✗ Não pagos"}
              </button>
            ))}
          </div>
        </div>

        {/* Leads table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="font-black text-slate-950">Leads</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {leadsLoading ? "Carregando…" : (
                  busca || sevFilter || pagoFilter
                    ? `${total} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
                    : `${total} lead${total !== 1 ? "s" : ""} no total`
                )}
              </p>
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-700 px-1">
                  {page} / {pages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Nome</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Contato</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Cidade</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Atividade</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Severidade</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Desvio</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Pago</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">Data</th>
                  <th className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {leadsLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-slate-400">
                      {busca || sevFilter || pagoFilter ? "Nenhum lead encontrado para este filtro." : "Nenhum lead ainda."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const cor = corSeveridade(lead.severidade as Severidade);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-950 whitespace-nowrap">
                          {lead.nome}
                          {lead.perfil && (
                            <span className="ml-2 text-xs font-normal text-slate-400">{lead.perfil}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-slate-700 font-medium">{lead.whatsapp}</div>
                          {lead.email && <div className="text-xs text-slate-400 truncate max-w-36">{lead.email}</div>}
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lead.cidade ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-44 truncate">{lead.atividadeNome}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-black", cor.badge)}>
                            {lead.severidade}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">
                          <span className={lead.desvio > 20 ? "text-red-600" : lead.desvio > 10 ? "text-orange-500" : "text-slate-700"}>
                            {lead.desvio > 0 ? "+" : ""}{fmt(lead.desvio, 1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-bold",
                            lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
                          )}>
                            {lead.pago ? "Sim" : "Não"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/relatorio/${lead.id}?token=${token}`}
                            target="_blank"
                            className={cn(
                              "text-xs font-semibold underline hover:no-underline",
                              lead.pago ? "text-emerald-700" : "text-slate-400",
                            )}
                          >
                            {lead.pago ? "Relatório" : "Ver (admin)"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          {pages > 1 && !leadsLoading && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">
                Exibindo {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} de {total}
              </p>
              <div className="flex items-center gap-1">
                {/* First */}
                <button
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  «
                </button>
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  ‹
                </button>
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, pages - 4));
                  return start + i;
                }).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      p === page ? "bg-slate-950 text-white" : "hover:bg-slate-200 text-slate-700",
                    )}
                  >
                    {p}
                  </button>
                ))}
                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  ›
                </button>
                {/* Last */}
                <button
                  onClick={() => setPage(pages)}
                  disabled={page >= pages}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead modal */}
      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} token={token} />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
      </div>
    }>
      <AdminConteudo />
    </Suspense>
  );
}
