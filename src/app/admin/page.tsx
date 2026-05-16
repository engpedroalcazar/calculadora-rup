"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Gauge, Download, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { corSeveridade, fmt } from "@/lib/rup";
import type { Severidade } from "@/lib/rup";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  total: number;
  pagos: number;
  porSeveridade: { severidade: string; _count: { id: number } }[];
  recentes: {
    id: string; nome: string; atividadeNome: string; severidade: string;
    pago: boolean; createdAt: string; desvio: number;
  }[];
}

function AdminConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function buscarStats(t: string) {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`/api/admin/stats?token=${t}`);
      if (res.status === 401) { setErro("Token inválido"); setAutenticado(false); return; }
      const data = await res.json();
      setStats(data);
      setAutenticado(true);
      sessionStorage.setItem("admin_token", t);
      router.replace("/admin", { scroll: false });
    } catch {
      setErro("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urlToken = searchParams.get("token");
    const storedToken = sessionStorage.getItem("admin_token");
    const t = urlToken ?? storedToken;
    if (t) { setToken(t); buscarStats(t); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportarCSV() {
    const t = sessionStorage.getItem("admin_token") ?? token;
    window.open(`/api/admin/leads?token=${t}&format=csv`, "_blank");
  }

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
              onKeyDown={(e) => e.key === "Enter" && buscarStats(token)}
              className="h-12 rounded-xl border border-slate-300 px-4 text-base focus:border-slate-950 focus:outline-none"
              placeholder="Insira o token"
            />
          </label>
          {erro && <p className="mt-2 text-sm text-red-600">{erro}</p>}
          <button
            onClick={() => buscarStats(token)}
            disabled={loading || !token}
            className="mt-4 h-12 w-full rounded-2xl bg-slate-950 font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
      </div>
    );
  }

  const porSev = Object.fromEntries(stats.porSeveridade.map((s) => [s.severidade, s._count.id]));
  const receita = stats.pagos * Number(process.env.NEXT_PUBLIC_PRECO ?? 29.9);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            <span className="font-black">ObraRadar Admin</span>
          </Link>
          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total de leads", value: stats.total, icon: Users, color: "text-slate-950" },
            { label: "Relatórios pagos", value: stats.pagos, icon: DollarSign, color: "text-emerald-600" },
            { label: "Receita estimada", value: `R$ ${receita.toFixed(2).replace(".", ",")}`, icon: TrendingUp, color: "text-emerald-600" },
            { label: "Taxa de conversão", value: stats.total > 0 ? `${((stats.pagos / stats.total) * 100).toFixed(1)}%` : "—", icon: AlertTriangle, color: "text-orange-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{label}</p>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <p className={cn("text-2xl font-black", color)}>{value}</p>
            </div>
          ))}
        </div>

        {/* Por severidade */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6">
          <p className="mb-4 font-black text-slate-950">Diagnósticos por severidade</p>
          <div className="flex flex-wrap gap-3">
            {(["CRÍTICO", "ALERTA", "ATENÇÃO", "NORMAL", "VERIFICAR"] as Severidade[]).map((s) => {
              const cor = corSeveridade(s);
              return (
                <div key={s} className={cn("flex items-center gap-2 rounded-2xl border px-4 py-2", cor.badge)}>
                  <span className="font-bold">{s}</span>
                  <span className="font-black text-lg">{porSev[s] ?? 0}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads recentes */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <p className="font-black text-slate-950">Leads recentes</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-500">Nome</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Atividade</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Severidade</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Desvio</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Pago</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Data</th>
                  <th className="px-6 py-3 font-semibold text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentes.map((lead) => {
                  const cor = corSeveridade(lead.severidade as Severidade);
                  return (
                    <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-950">{lead.nome}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-48 truncate">{lead.atividadeNome}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn(cor.badge, "text-xs")}>{lead.severidade}</Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        <span className={lead.desvio > 20 ? "text-red-600" : lead.desvio > 10 ? "text-orange-500" : "text-slate-700"}>
                          {lead.desvio > 0 ? "+" : ""}{fmt(lead.desvio, 1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", lead.pago ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {lead.pago ? "Sim" : "Não"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        {lead.pago && (
                          <Link href={`/relatorio/${lead.id}`} className="text-xs font-semibold text-slate-950 hover:underline">
                            Ver relatório
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {stats.recentes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Nenhum lead ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
