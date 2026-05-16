import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { calcularRUP, corSeveridade, fmt, moeda } from "@/lib/rup";
import { gerarDiagnostico } from "@/lib/diagnostico";
import { PrintButton } from "@/components/PrintButton";
import type { Severidade } from "@/lib/rup";

const sevColor: Record<Severidade, string> = {
  VERIFICAR: "#6b8fb5", NORMAL: "#74a87a", ATENÇÃO: "#d4a04a", ALERTA: "#d97c4a", CRÍTICO: "#c95a4a",
};

export default async function RelatorioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const lead = await prisma.lead.findUnique({ where: { id } }).catch(() => null);

  if (!lead) notFound();

  const isAdmin = token === process.env.ADMIN_TOKEN;
  if (!lead.pago && !isAdmin) redirect(`/checkout?id=${id}`);

  const resultado = calcularRUP({
    atividadeId: lead.atividadeId,
    quantidade: lead.quantidade,
    trabalhadores: lead.trabalhadores,
    horasPorDia: lead.horasPorDia,
    dias: lead.dias,
    custoHora: lead.custoHora,
  });

  const diagnostico = gerarDiagnostico(lead.atividadeId, resultado);
  const cor = corSeveridade(resultado.severidade);
  void cor;

  const dataFormatada = new Date(lead.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const metricas = [
    { label: "HH Total", value: `${fmt(resultado.hhTotal)} Hh`, sub: `${lead.trabalhadores} trab × ${lead.horasPorDia}h × ${lead.dias} dias` },
    { label: "RUP Real", value: `${fmt(resultado.rupReal)} Hh/${lead.unidade}`, sub: `Referência: ${fmt(resultado.rupRef)} Hh/${lead.unidade}` },
    { label: "Desvio", value: `${resultado.desvio > 0 ? "+" : ""}${fmt(resultado.desvio, 1)}%`, sub: "em relação à referência" },
    resultado.custoTotal != null
      ? { label: "Custo Total MO", value: moeda(resultado.custoTotal), sub: resultado.custoUnitario != null ? `Custo unit.: ${moeda(resultado.custoUnitario)}/${lead.unidade}` : "" }
      : { label: "Custo Total MO", value: "—", sub: "Custo por hora não informado" },
    resultado.perdaEstimativa != null && resultado.perdaEstimativa > 0
      ? { label: "Perda Estimada", value: moeda(resultado.perdaEstimativa), sub: `${fmt(resultado.perdaHH)} Hh acima da referência` }
      : { label: "Perda Estimada", value: resultado.perdaHH > 0 ? `${fmt(resultado.perdaHH)} Hh` : "—", sub: "Sem custo informado" },
    { label: "Quantidade", value: `${fmt(lead.quantidade, 0)} ${lead.unidade}`, sub: "executada no período" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", color: "#f3ecde", fontFamily: "var(--font-body)" }}>

      {/* Admin banner */}
      {isAdmin && !lead.pago && (
        <div style={{ background: "#1a2a1a", borderBottom: "1px solid rgba(116,168,122,0.4)", padding: "8px 20px", textAlign: "center", fontSize: 12, color: "#74a87a", fontWeight: 600, letterSpacing: "0.08em" }}>
          👁 VISUALIZAÇÃO ADMIN — Lead não pagou. Apenas você vê este relatório.
        </div>
      )}

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(11,18,38,0.92)", borderBottom: "1px solid var(--navy-line)", backdropFilter: "blur(12px)" }} className="print:hidden">
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/assets/obraradar-mark-clean.png" alt="ObraRadar" width={48} height={30} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>OBRA RADAR</span>
          </Link>
          <PrintButton />
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Cabeçalho do relatório */}
        <div style={{ marginBottom: 24, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-500)" }}>Relatório de Produtividade</p>
              <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)", fontSize: "clamp(20px, 4vw, 28px)", color: "#f3ecde", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {lead.atividadeNome}
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(243,236,222,0.5)" }}>
                {lead.nome} · {dataFormatada}{lead.cidade ? ` · ${lead.cidade}` : ""}
              </p>
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: sevColor[resultado.severidade],
              color: "#fff", padding: "8px 20px",
              borderRadius: 40, fontFamily: "var(--font-display)",
              fontSize: 16, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0,
            }}>
              {resultado.severidade}
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {metricas.map(({ label, value, sub }) => (
            <div key={label} style={{ padding: 18, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-500)" }}>{label}</p>
              <p style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontSize: 20, color: "#f3ecde", lineHeight: 1.1, wordBreak: "break-word" }}>{value}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(243,236,222,0.45)" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Diagnóstico */}
        <div className="relatorio-bloco" style={{ marginBottom: 20, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-500)" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>DIAGNÓSTICO AUTOMÁTICO</p>
          </div>
          <p style={{ lineHeight: 1.8, color: "rgba(243,236,222,0.8)", fontSize: 14, margin: 0 }}>{diagnostico.resumo}</p>
          <div style={{ marginTop: 14, display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", background: "rgba(243,236,222,0.04)", borderRadius: "var(--radius-md)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(243,236,222,0.4)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(243,236,222,0.45)", lineHeight: 1.6 }}>{diagnostico.confiabilidade}</p>
          </div>
        </div>

        {/* Causas */}
        {diagnostico.causas.length > 0 && (
          <div className="relatorio-bloco" style={{ marginBottom: 20, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>CAUSAS MAIS PROVÁVEIS</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {diagnostico.causas.map((c) => (
                <li key={c} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(243,236,222,0.8)", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a04a" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 3l10 18H2z"/><path d="M12 10v5"/><circle cx="12" cy="18" r="0.8" fill="#d4a04a"/></svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ações */}
        <div className="relatorio-bloco" style={{ marginBottom: 20, padding: 24, background: "rgba(201,165,116,0.06)", border: "1px solid var(--gold-line)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>AÇÕES RECOMENDADAS</p>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
            {diagnostico.acoes.map((a, i) => (
              <li key={a} style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: 14, color: "rgba(243,236,222,0.8)", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, flexShrink: 0, borderRadius: "50%", background: "var(--gold-500)", color: "#0b1226", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
        </div>

        {/* Dados do lançamento */}
        <div className="relatorio-bloco" style={{ marginBottom: 20, padding: 24, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.1)", borderRadius: "var(--radius-md)", breakInside: "avoid", pageBreakInside: "avoid" }}>
          <p style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 16, color: "#f3ecde", letterSpacing: "0.04em" }}>DADOS DO LANÇAMENTO</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
            {[
              ["Atividade", lead.atividadeNome],
              ["Quantidade executada", `${fmt(lead.quantidade, 0)} ${lead.unidade}`],
              ["Trabalhadores", String(lead.trabalhadores)],
              ["Horas por dia", `${fmt(lead.horasPorDia)} h`],
              ["Dias", String(lead.dias)],
              ["Custo médio Hh", lead.custoHora ? `R$ ${fmt(lead.custoHora, 2)}/Hh` : "Não informado"],
              ["Perfil", lead.perfil ?? "—"],
              ["Tipo de obra", lead.tipoObra ?? "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(243,236,222,0.06)" }}>
                <span style={{ fontSize: 13, color: "rgba(243,236,222,0.5)" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f3ecde", textAlign: "right", marginLeft: 16, wordBreak: "break-word" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aviso técnico */}
        <div style={{ padding: 20, background: "rgba(243,236,222,0.03)", border: "1px solid rgba(243,236,222,0.08)", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.7, color: "rgba(243,236,222,0.5)" }}>
          <strong style={{ color: "rgba(243,236,222,0.7)" }}>Aviso técnico:</strong> este diagnóstico é estimativo, baseado em referências médias de produtividade. A RUP real pode variar conforme método executivo, equipe, logística e qualidade da medição. Para maior confiabilidade, acompanhe por no mínimo 6 lançamentos.
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }} className="print:hidden">
          <Link href="/diagnostico" style={{ display: "inline-block", padding: "12px 24px", border: "1px solid rgba(243,236,222,0.2)", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 600, color: "rgba(243,236,222,0.7)" }}>
            Analisar outra atividade
          </Link>
        </div>
      </div>
    </div>
  );
}
