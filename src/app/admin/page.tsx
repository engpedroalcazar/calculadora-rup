"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Gauge, Download, TrendingUp, Users, DollarSign, AlertTriangle,
  Search, X, Phone, Mail, MapPin, Building, ChevronLeft, ChevronRight,
  RefreshCw, BarChart2, Target,
} from "lucide-react";
import { corSeveridade, fmt } from "@/lib/rup";
import type { Severidade } from "@/lib/rup";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────── */
interface Lead {
  id: string; nome: string; whatsapp: string; email: string | null;
  perfil: string | null; tipoObra: string | null; cidade: string | null;
  atividadeNome: string; severidade: string; desvio: number;
  rupReal: number; rupRef: number; hhTotal: number;
  pago: boolean; valor: number | null; metodoPagamento: string | null; createdAt: string;
}
interface LeadsResp { leads: Lead[]; total: number; page: number; limit: number; pages: number; }
interface Stats {
  total: number; pagos: number;
  porSeveridade: { severidade: string; _count: { id: number } }[];
  recentes: Lead[];
}
interface Analytics {
  leadsByDay: { date: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
  paidLeads: { id: string; nome: string; atividadeNome: string; severidade: string; valor: number; createdAt: string; email: string | null }[];
  conversionBySev: { severidade: string; total: number; pagos: number; taxa: number }[];
  topAtividades: { nome: string; count: number }[];
  ticketMedio: number;
  totalReceita: number;
}

function MetodoBadge({ metodo }: { metodo: string | null }) {
  if (!metodo) return <span className="text-xs text-slate-400">—</span>;
  const map: Record<string, { label: string; cls: string }> = {
    pix:         { label: "PIX",    cls: "bg-emerald-100 text-emerald-700" },
    credit_card: { label: "Cartão", cls: "bg-blue-100 text-blue-700" },
    debit_card:  { label: "Débito", cls: "bg-indigo-100 text-indigo-700" },
    ticket:      { label: "Boleto", cls: "bg-yellow-100 text-yellow-700" },
    manual:      { label: "Manual", cls: "bg-slate-100 text-slate-500" },
  };
  const m = map[metodo] ?? { label: metodo, cls: "bg-slate-100 text-slate-500" };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", m.cls)}>{m.label}</span>;
}

const SEV_ORDER: Severidade[] = ["CRÍTICO", "ALERTA", "ATENÇÃO", "NORMAL", "VERIFICAR"];
const SEV_COLORS: Record<string, string> = {
  CRÍTICO: "#ef4444", ALERTA: "#f97316", ATENÇÃO: "#eab308", NORMAL: "#22c55e", VERIFICAR: "#3b82f6",
};

/* ── SVG Charts ─────────────────────────────────────── */
function BarChart({ data, color = "#6366f1", height = 100 }: {
  data: { label: string; value: number }[]; color?: string; height?: number;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div
              title={`${d.label}: ${d.value}`}
              style={{
                width: "100%",
                height: `${Math.max((d.value / max) * 100, d.value > 0 ? 3 : 0)}%`,
                background: color,
                borderRadius: "3px 3px 0 0",
                opacity: 0.85,
                transition: "height 0.3s ease",
                cursor: "default",
              }}
            />
          </div>
          {data.length <= 15 && (
            <span style={{ fontSize: 8, color: "#94a3b8", whiteSpace: "nowrap", transform: data.length > 8 ? "rotate(-45deg)" : "none", display: "block" }}>
              {d.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color = "#10b981", height = 100 }: {
  data: { label: string; value: number }[]; color?: string; height?: number;
}) {
  if (data.length < 2) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12 }}>Sem dados suficientes</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 400; const h = height;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.value / max) * (h - 10) - 5;
    return `${x},${y}`;
  });
  const area = `M${pts.join(" L")} L${w},${h} L0,${h} Z`;
  const line = `M${pts.join(" L")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => d.value > 0 && (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (d.value / max) * (h - 10) - 5}
          r="3" fill={color} opacity="0.8">
          <title>{`${d.label}: ${d.value}`}</title>
        </circle>
      ))}
    </svg>
  );
}

function HBarChart({ data, colorFn }: { data: { label: string; value: number; color?: string }[]; colorFn?: (l: string) => string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#64748b", width: 120, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label}</span>
          <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${(d.value / max) * 100}%`,
              background: d.color ?? colorFn?.(d.label) ?? "#6366f1",
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", width: 30, textAlign: "right" }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Analytics Modal ─────────────────────────────────── */
type ModalType = "leads" | "pagos" | "receita" | "conversao" | null;

function AnalyticsModal({ type, stats, analytics, onClose }: {
  type: ModalType; stats: Stats; analytics: Analytics | null; onClose: () => void;
}) {
  if (!type) return null;
  const TITLES: Record<string, string> = {
    leads: "📊 Leads — Evolução 30 dias",
    pagos: "💳 Vendas Realizadas",
    receita: "💰 Receita — Detalhe",
    conversao: "🎯 Taxa de Conversão por Severidade",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <p className="font-black text-slate-950 text-lg">{TITLES[type]}</p>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
          {!analytics ? (
            <div className="flex items-center justify-center h-32">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
            </div>
          ) : type === "leads" ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Total geral", v: stats.total },
                  { l: "Últimos 30 dias", v: analytics.leadsByDay.reduce((s, d) => s + d.count, 0) },
                  { l: "Média/dia", v: (analytics.leadsByDay.reduce((s, d) => s + d.count, 0) / 30).toFixed(1) },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">{l}</p>
                    <p className="text-2xl font-black text-slate-950">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Leads por dia (últimos 30 dias)</p>
                <LineChart
                  data={analytics.leadsByDay.map(d => ({ label: d.date.slice(5), value: d.count }))}
                  color="#6366f1" height={120}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Top atividades calculadas</p>
                <HBarChart data={analytics.topAtividades.map(a => ({ label: a.nome, value: a.count }))} colorFn={() => "#6366f1"} />
              </div>
            </>
          ) : type === "pagos" ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Total vendas", v: analytics.paidLeads.length },
                  { l: "Ticket médio", v: `R$ ${analytics.ticketMedio.toFixed(2).replace(".", ",")}` },
                  { l: "Receita total", v: `R$ ${analytics.totalReceita.toFixed(2).replace(".", ",")}` },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <p className="text-xs text-emerald-600 mb-1">{l}</p>
                    <p className="text-xl font-black text-emerald-800">{v}</p>
                  </div>
                ))}
              </div>
              {analytics.paidLeads.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Histórico de vendas</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {analytics.paidLeads.map(l => (
                      <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-slate-950">{l.nome}</p>
                          <p className="text-xs text-slate-500">{l.atividadeNome} · {new Date(l.createdAt).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-700">R$ {Number(l.valor).toFixed(2).replace(".", ",")}</p>
                          <span className="text-xs" style={{ color: SEV_COLORS[l.severidade] }}>{l.severidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-8">Nenhuma venda realizada ainda.</p>
              )}
            </>
          ) : type === "receita" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Receita total", v: `R$ ${analytics.totalReceita.toFixed(2).replace(".", ",")}` },
                  { l: "Ticket médio", v: `R$ ${analytics.ticketMedio.toFixed(2).replace(".", ",")}` },
                  { l: "Projeção mês", v: `R$ ${(analytics.totalReceita * 2).toFixed(0)}` },
                  { l: "Conversão geral", v: `${stats.total > 0 ? ((stats.pagos / stats.total) * 100).toFixed(2) : 0}%` },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs text-amber-600 mb-1">{l}</p>
                    <p className="text-xl font-black text-amber-900">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Receita por dia (últimos 30 dias)</p>
                <BarChart
                  data={analytics.revenueByDay.map(d => ({ label: d.date.slice(5), value: d.amount }))}
                  color="#f59e0b" height={120}
                />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Planos disponíveis</p>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-white border border-slate-200 p-3 text-center">
                    <p className="text-xs text-slate-500">Individual</p>
                    <p className="font-black text-slate-950">R$ 39,90</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white border border-slate-200 p-3 text-center">
                    <p className="text-xs text-slate-500">Pacote 10x</p>
                    <p className="font-black text-slate-950">R$ 249,90</p>
                  </div>
                </div>
              </div>
            </>
          ) : type === "conversao" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Total leads", v: stats.total },
                  { l: "Convertidos", v: stats.pagos },
                  { l: "Taxa geral", v: `${stats.total > 0 ? ((stats.pagos / stats.total) * 100).toFixed(2) : 0}%` },
                  { l: "Potencial", v: `R$ ${(stats.total * 39.9).toFixed(0)}` },
                ].map(({ l, v }) => (
                  <div key={l} className="rounded-2xl bg-violet-50 p-4 text-center">
                    <p className="text-xs text-violet-600 mb-1">{l}</p>
                    <p className="text-xl font-black text-violet-900">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Conversão por nível de severidade</p>
                <div className="space-y-3">
                  {analytics.conversionBySev.map(s => (
                    <div key={s.severidade} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold" style={{ color: SEV_COLORS[s.severidade] ?? "#64748b" }}>{s.severidade}</span>
                        <span className="text-xs text-slate-500">{s.pagos}/{s.total} leads · <strong>{s.taxa.toFixed(2)}%</strong></span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(s.taxa, 100)}%`, background: SEV_COLORS[s.severidade] ?? "#6366f1" }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {s.severidade === "CRÍTICO" ? "🔴 Alta urgência — maior potencial de conversão" :
                         s.severidade === "ALERTA" ? "🟠 Urgência moderada — bom potencial" :
                         s.severidade === "ATENÇÃO" ? "🟡 Atenção recomendada — potencial médio" :
                         s.severidade === "NORMAL" ? "🟢 Situação ok — menor senso de urgência" :
                         "🔵 Abaixo da referência — verificar dados"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ── Severity Pill ───────────────────────────────────── */
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
    <button onClick={onClick} className={cn("flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition-all", c.bg, c.text, active ? `ring-2 ${c.ring} scale-105 shadow-sm` : "opacity-70 hover:opacity-100")}>
      {sev}
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-black", active ? "bg-white/60" : "bg-white/40")}>{count}</span>
    </button>
  );
}

/* ── Lead Modal ──────────────────────────────────────── */
function LeadModal({ lead, onClose, token }: { lead: Lead; onClose: () => void; token: string }) {
  const cor = corSeveridade(lead.severidade as Severidade);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="font-black text-slate-950 text-lg">{lead.nome}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 rounded px-2 py-0.5">{`ORD-${lead.id.slice(-8).toUpperCase()}`}</span>
              <span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleString("pt-BR")}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 hover:bg-emerald-100 transition-colors">
              <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-700">WhatsApp</p>
                <p className="text-sm font-bold text-emerald-900 truncate">{lead.whatsapp}</p>
              </div>
            </a>
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100 transition-colors">
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
          <div className="grid grid-cols-2 gap-3 text-sm">
            {lead.cidade && <div className="flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" /><span>{lead.cidade}</span></div>}
            {lead.tipoObra && <div className="flex items-center gap-2 text-slate-600"><Building className="h-4 w-4 flex-shrink-0 text-slate-400" /><span>{lead.tipoObra}</span></div>}
            {lead.perfil && <div className="flex items-center gap-2 text-slate-600"><Users className="h-4 w-4 flex-shrink-0 text-slate-400" /><span>{lead.perfil}</span></div>}
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium truncate max-w-xs">{lead.atividadeNome}</p>
              <span className={cn("rounded-full px-3 py-1 text-xs font-black", cor.badge)}>{lead.severidade}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[["RUP Real", lead.rupReal.toFixed(3)], ["RUP Ref.", lead.rupRef.toFixed(3)], ["Desvio", `${lead.desvio > 0 ? "+" : ""}${fmt(lead.desvio, 1)}%`]].map(([l, v]) => (
                <div key={l} className="text-center">
                  <p className="text-xs text-slate-500">{l}</p>
                  <p className={cn("font-black", l === "Desvio" ? (lead.desvio > 20 ? "text-red-600" : lead.desvio > 10 ? "text-orange-500" : "text-emerald-600") : "text-slate-950")}>{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-xs text-slate-500">Total HH</span>
              <span className="font-bold text-slate-700">{lead.hhTotal.toFixed(1)} HH</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn("rounded-full px-3 py-1 text-sm font-bold", lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
              {lead.pago ? `✓ Pago${lead.valor ? ` · R$ ${lead.valor}` : ""}` : "Não pagou"}
              {lead.metodoPagamento && <span className="ml-2"><MetodoBadge metodo={lead.metodoPagamento} /></span>}
            </span>
            <Link href={`/relatorio/${lead.id}?token=${token}`} target="_blank" className={cn("text-sm font-bold underline hover:no-underline", lead.pago ? "text-slate-950" : "text-slate-400")}>
              {lead.pago ? "Ver relatório →" : "Ver relatório (admin) →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────── */
function AdminConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErro, setLoginErro] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [sevFilter, setSevFilter] = useState<Severidade | "">("");
  const [pagoFilter, setPagoFilter] = useState<"" | "sim" | "nao">("");
  const [busca, setBusca] = useState("");
  const [buscaInput, setBuscaInput] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  async function login(t: string) {
    setLoginLoading(true); setLoginErro("");
    try {
      const res = await fetch(`/api/admin/stats?token=${t}`);
      if (res.status === 401) { setLoginErro("Token inválido"); return; }
      const data = await res.json();
      setStats(data); setAutenticado(true);
      sessionStorage.setItem("admin_token", t);
      router.replace("/admin", { scroll: false });
      // Carregar analytics em background
      fetch(`/api/admin/analytics?token=${t}`).then(r => r.json()).then(setAnalytics).catch(() => {});
    } catch { setLoginErro("Erro ao conectar"); } finally { setLoginLoading(false); }
  }

  useEffect(() => {
    const t = searchParams.get("token") ?? sessionStorage.getItem("admin_token") ?? "";
    if (t) { setToken(t); login(t); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = useCallback(async (opts: { page: number; sev: Severidade | ""; pago: "" | "sim" | "nao"; busca: string; tok: string }) => {
    setLeadsLoading(true);
    try {
      const p = new URLSearchParams({ token: opts.tok, page: String(opts.page), limit: "50" });
      if (opts.sev) p.set("severidade", opts.sev);
      if (opts.pago) p.set("pago", opts.pago);
      if (opts.busca) p.set("busca", opts.busca);
      const res = await fetch(`/api/admin/leads?${p}`);
      if (!res.ok) return;
      const data: LeadsResp = await res.json();
      setLeads(data.leads); setTotal(data.total); setPages(data.pages); setPage(data.page);
    } finally { setLeadsLoading(false); }
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    fetchLeads({ page, sev: sevFilter, pago: pagoFilter, busca, tok: token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticado, page, sevFilter, pagoFilter, busca, token]);

  function applyBusca() { setBusca(buscaInput.trim()); setPage(1); }
  function toggleSev(s: Severidade) { setSevFilter(p => p === s ? "" : s); setPage(1); }
  function exportCSV() {
    const p = new URLSearchParams({ token, format: "csv" });
    if (sevFilter) p.set("severidade", sevFilter);
    if (pagoFilter) p.set("pago", pagoFilter);
    if (busca) p.set("busca", busca);
    window.open(`/api/admin/leads?${p}`, "_blank");
  }
  function refreshAll() {
    fetchLeads({ page, sev: sevFilter, pago: pagoFilter, busca, tok: token });
    fetch(`/api/admin/stats?token=${token}`).then(r => r.json()).then(setStats).catch(() => {});
    fetch(`/api/admin/analytics?token=${token}`).then(r => r.json()).then(setAnalytics).catch(() => {});
  }

  const porSev = Object.fromEntries((stats?.porSeveridade ?? []).map(s => [s.severidade, s._count.id]));
  const receita = (stats?.pagos ?? 0) * 39.9;

  /* ── KPI cards config ── */
  const kpis = [
    {
      id: "leads" as ModalType,
      label: "Total de leads",
      value: stats?.total ?? 0,
      icon: Users,
      color: "text-slate-950",
      bg: "hover:bg-slate-50",
      hint: "Ver evolução",
      HintIcon: BarChart2,
    },
    {
      id: "pagos" as ModalType,
      label: "Relatórios pagos",
      value: stats?.pagos ?? 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "hover:bg-emerald-50/50",
      hint: "Ver vendas",
      HintIcon: BarChart2,
    },
    {
      id: "receita" as ModalType,
      label: "Receita estimada",
      value: `R$ ${receita.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "hover:bg-emerald-50/50",
      hint: "Ver detalhe",
      HintIcon: BarChart2,
    },
    {
      id: "conversao" as ModalType,
      label: "Taxa de conversão",
      value: (stats?.total ?? 0) > 0 ? `${(((stats?.pagos ?? 0) / (stats?.total ?? 1)) * 100).toFixed(2)}%` : "—",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "hover:bg-orange-50/50",
      hint: "Ver funil",
      HintIcon: Target,
    },
  ];

  /* ── Login ── */
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2"><Gauge className="h-6 w-6" /><span className="font-black text-xl">ObraRadar Admin</span></div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Token de acesso</span>
            <input type="password" value={token} onChange={e => setToken(e.target.value)} onKeyDown={e => e.key === "Enter" && login(token)}
              className="h-12 rounded-xl border border-slate-300 px-4 text-base focus:border-slate-950 focus:outline-none" placeholder="Insira o token" />
          </label>
          {loginErro && <p className="mt-2 text-sm text-red-600">{loginErro}</p>}
          <button onClick={() => login(token)} disabled={loginLoading || !token}
            className="mt-4 h-12 w-full rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {loginLoading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Gauge className="h-5 w-5" />
            <span className="font-black text-slate-950 hidden sm:block">ObraRadar Admin</span>
          </Link>
          <div className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <input type="text" placeholder="Buscar por nome, e-mail, telefone, cidade…"
              value={buscaInput} onChange={e => setBuscaInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyBusca()}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            {buscaInput && <button onClick={() => { setBuscaInput(""); setBusca(""); setPage(1); }}><X className="h-4 w-4 text-slate-400 hover:text-slate-700" /></button>}
            <button onClick={applyBusca} className="rounded-lg bg-slate-950 px-3 py-1 text-xs font-bold text-white hover:bg-slate-700 transition-colors">Buscar</button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={refreshAll} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 transition-colors" title="Atualizar"><RefreshCw className="h-4 w-4 text-slate-600" /></button>
            <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4" /><span className="hidden sm:block">CSV</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* KPIs clicáveis */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {kpis.map(({ id, label, value, icon: Icon, color, bg, hint, HintIcon }) => (
            <button key={id} onClick={() => { setActiveModal(id); }}
              className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left transition-all group cursor-pointer", bg, "hover:shadow-md hover:border-slate-300")}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-500">{label}</p>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <p className={cn("text-2xl font-black", color)}>{value}</p>
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <HintIcon className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-400">{hint}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Severity filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-slate-500 mr-1">Filtrar por severidade:</p>
            {SEV_ORDER.map(s => (
              <SevPill key={s} sev={s} count={porSev[s] ?? 0} active={sevFilter === s} onClick={() => toggleSev(s)} />
            ))}
            {sevFilter && <button onClick={() => { setSevFilter(""); setPage(1); }} className="ml-auto text-xs text-slate-500 hover:text-slate-800 underline">Limpar filtro</button>}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Pagamento:</p>
            {(["", "sim", "nao"] as const).map(v => (
              <button key={v} onClick={() => { setPagoFilter(v); setPage(1); }}
                className={cn("rounded-xl px-3 py-1 text-xs font-bold transition-colors", pagoFilter === v ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                {v === "" ? "Todos" : v === "sim" ? "✓ Pagos" : "✗ Não pagos"}
              </button>
            ))}
          </div>
        </div>

        {/* Leads table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="font-black text-slate-950">Leads</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {leadsLoading ? "Carregando…" : (busca || sevFilter || pagoFilter)
                  ? `${total} resultado${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`
                  : `${total} lead${total !== 1 ? "s" : ""} no total`}
              </p>
            </div>
            {pages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-sm font-semibold text-slate-700 px-1">{page} / {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
                  className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  {["Nº Pedido", "Nome", "Contato", "Cidade", "Atividade", "Severidade", "Desvio", "Pago", "Método", "Data", ""].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadsLoading ? (
                  <tr><td colSpan={9} className="px-6 py-16 text-center"><div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" /></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={9} className="px-6 py-16 text-center text-slate-400">{busca || sevFilter || pagoFilter ? "Nenhum lead encontrado para este filtro." : "Nenhum lead ainda."}</td></tr>
                ) : leads.map(lead => {
                  const cor = corSeveridade(lead.severidade as Severidade);
                  const pedidoId = `ORD-${lead.id.slice(-8).toUpperCase()}`;
                  return (
                    <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">{pedidoId}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-950 whitespace-nowrap">
                        {lead.nome}{lead.perfil && <span className="ml-2 text-xs font-normal text-slate-400">{lead.perfil}</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-slate-700 font-medium">{lead.whatsapp}</div>
                        {lead.email && <div className="text-xs text-slate-400 truncate max-w-36">{lead.email}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{lead.cidade ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-44 truncate">{lead.atividadeNome}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-black", cor.badge)}>{lead.severidade}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        <span className={lead.desvio > 20 ? "text-red-600" : lead.desvio > 10 ? "text-orange-500" : "text-slate-700"}>
                          {lead.desvio > 0 ? "+" : ""}{fmt(lead.desvio, 1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {lead.pago ? (lead.valor ? `R$ ${lead.valor}` : "Sim") : "Não"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><MetodoBadge metodo={lead.metodoPagamento} /></td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <Link href={`/relatorio/${lead.id}?token=${token}`} target="_blank"
                          className={cn("text-xs font-semibold underline hover:no-underline", lead.pago ? "text-emerald-700" : "text-slate-400")}>
                          {lead.pago ? "Relatório" : "Ver (admin)"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pages > 1 && !leadsLoading && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">Exibindo {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} de {total}</p>
              <div className="flex items-center gap-1">
                {[["«", 1], ["‹", Math.max(1, page - 1)]].map(([l, p]) => (
                  <button key={l as string} onClick={() => setPage(p as number)} disabled={page <= 1}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors">{l}</button>
                ))}
                {Array.from({ length: Math.min(5, pages) }, (_, i) => Math.max(1, Math.min(page - 2, pages - 4)) + i).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn("rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors", p === page ? "bg-slate-950 text-white" : "hover:bg-slate-200 text-slate-700")}>{p}</button>
                ))}
                {[["›", Math.min(pages, page + 1)], ["»", pages]].map(([l, p]) => (
                  <button key={l as string} onClick={() => setPage(p as number)} disabled={page >= pages}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors">{l}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal && <AnalyticsModal type={activeModal} stats={stats!} analytics={analytics} onClose={() => setActiveModal(null)} />}
      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} token={token} />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" /></div>}>
      <AdminConteudo />
    </Suspense>
  );
}
