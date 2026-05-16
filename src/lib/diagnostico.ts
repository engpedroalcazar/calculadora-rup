import { atividades, fmt, moeda } from "./rup";
import type { ResultadoRUP, Severidade } from "./rup";

export interface Diagnostico {
  resumo: string;
  causas: string[];
  acoes: string[];
  confiabilidade: string;
}

export function gerarDiagnostico(
  atividadeId: string,
  r: ResultadoRUP,
  qtdLancamentos = 1
): Diagnostico {
  const at = atividades.find((a) => a.id === atividadeId);
  const nome = at?.nome ?? "Atividade";
  const unidade = at?.unidade ?? "-";
  const { rupReal, rupRef, desvio, severidade, perdaEstimativa } = r;

  const confiabilidade =
    qtdLancamentos >= 6 ? "Alta confiabilidade" :
    qtdLancamentos >= 3 ? "Média confiabilidade" :
    "Baixa confiabilidade — baseada em apenas 1 lançamento";

  if (severidade === "VERIFICAR") {
    return {
      resumo: `A atividade de ${nome} apresentou RUP real de ${fmt(rupReal)} Hh/${unidade}, muito abaixo da referência de ${fmt(rupRef)} Hh/${unidade} (desvio de ${fmt(desvio, 1)}%). Verifique a medição antes de concluir.`,
      causas: [
        "Quantidade superestimada no lançamento",
        "Erro de medição em campo",
        "Lançamento incorreto de horas trabalhadas",
        "Equipe excepcionalmente produtiva (confirmar)",
      ],
      acoes: [
        "Conferir a medição da quantidade executada",
        "Revisar o lançamento de horas e número de trabalhadores",
        "Validar os dados com o responsável de campo",
      ],
      confiabilidade,
    };
  }

  if (severidade === "NORMAL") {
    return {
      resumo: `A atividade de ${nome} está dentro da faixa esperada. RUP real de ${fmt(rupReal)} Hh/${unidade} contra referência de ${fmt(rupRef)} Hh/${unidade} — desvio de ${fmt(desvio, 1)}%. Resultado positivo.`,
      causas: [],
      acoes: [
        "Manter o padrão atual de gestão da equipe",
        "Continuar monitorando a produtividade nos próximos dias",
        "Documentar as boas práticas para referência futura",
      ],
      confiabilidade,
    };
  }

  const impacto =
    perdaEstimativa != null && perdaEstimativa > 0
      ? ` Impacto estimado de ${moeda(perdaEstimativa)} em mão de obra acima da referência.`
      : "";

  const resumo = `A atividade de ${nome} está com RUP real de ${fmt(rupReal)} Hh/${unidade}, contra referência de ${fmt(rupRef)} Hh/${unidade}. Desvio de +${fmt(Math.abs(desvio), 1)}% acima da média — classificação ${severidade}.${impacto}`;

  type NivelAlto = Exclude<Severidade, "NORMAL" | "VERIFICAR">;

  const causas: Record<NivelAlto, string[]> = {
    ATENÇÃO: [
      "Logística de materiais irregular",
      "Pequenas interferências e paralisações",
      "Ritmo de produção levemente abaixo do esperado",
    ],
    ALERTA: [
      "Subdimensionamento da equipe ou frente de serviço",
      "Falta de material ou suprimento irregular",
      "Interferências e paralisações parciais",
      "Retrabalho por problemas de qualidade",
    ],
    CRÍTICO: [
      "Equipe subdimensionada para a demanda da atividade",
      "Retrabalho sistemático por qualidade",
      "Paralisações frequentes por falta de material",
      "Método executivo inadequado ou desatualizado",
      "Fadiga ou alta rotatividade da equipe",
    ],
  };

  const acoes: Record<NivelAlto, string[]> = {
    ATENÇÃO: [
      "Verificar logística de materiais e disponibilidade de frente",
      "Conversar com o encarregado sobre interferências",
      "Monitorar por mais dias antes de ações corretivas",
    ],
    ALERTA: [
      "Revisar o dimensionamento da equipe para esta atividade",
      "Investigar retrabalhos e paralisações recentes",
      "Verificar abastecimento de materiais e liberação de frente",
      "Considerar ajuste de escala ou método executivo",
    ],
    CRÍTICO: [
      "Ação imediata: revisar composição e dimensionamento da equipe",
      "Identificar gargalos de produção com o encarregado",
      "Verificar se há retrabalho sistemático na atividade",
      "Avaliar substituição de método executivo",
      "Calcular impacto no orçamento e prazo total da obra",
    ],
  };

  const nivel = severidade as NivelAlto;
  return { resumo, causas: causas[nivel], acoes: acoes[nivel], confiabilidade };
}
