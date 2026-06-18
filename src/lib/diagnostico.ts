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
      resumo: `A atividade de ${nome} apresentou RUP real de ${fmt(rupReal)} Hh/${unidade}, bem abaixo da referência de ${fmt(rupRef)} Hh/${unidade} (desvio de ${fmt(desvio, 1)}%). Produtividade acima do esperado — vale confirmar os dados antes de adotar como referência.`,
      causas: [
        "Equipe experiente ou com alta repetição da atividade (curva de aprendizado)",
        "Frente de serviço bem abastecida e sem interferências",
        "Condições de execução favoráveis (acesso, clima, projeto detalhado)",
        "Possível superestimativa da quantidade ou subcontagem de horas no lançamento",
      ],
      acoes: [
        "Confirmar a quantidade executada e as horas lançadas com o campo",
        "Verificar se a referência normativa corresponde ao método executivo usado",
        "Se os dados se confirmarem, registrar a equipe e o método como benchmark interno",
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
      "Abastecimento de materiais na frente com pequenas interrupções",
      "Interferências entre equipes ou com outras frentes de serviço",
      "Frente de trabalho parcialmente liberada (precedências atrasadas)",
      "Ferramental ou equipamento aquém do ideal para o ritmo",
    ],
    ALERTA: [
      "Dimensionamento da equipe incompatível com a frente disponível",
      "Retrabalho por falhas de qualidade ou de projeto",
      "Paradas recorrentes por falta de material ou de frente liberada",
      "Transporte e movimentação interna consumindo tempo produtivo",
      "Supervisão insuficiente para o tamanho da frente",
    ],
    CRÍTICO: [
      "Equipe muito subdimensionada para a meta de produção",
      "Retrabalho sistemático por qualidade, projeto ou compatibilização",
      "Paralisações frequentes por falta de material, frente ou equipamento",
      "Método executivo inadequado ou desatualizado para o serviço",
      "Baixa qualificação, alta rotatividade ou fadiga acentuada da equipe",
      "Condições de canteiro desfavoráveis (acesso, layout, clima)",
    ],
  };

  const acoes: Record<NivelAlto, string[]> = {
    ATENÇÃO: [
      "Mapear com o encarregado as interrupções de abastecimento na frente",
      "Revisar o sequenciamento das equipes para reduzir interferências",
      "Conferir a liberação das atividades precedentes",
      "Monitorar por mais alguns dias antes de mexer no dimensionamento",
    ],
    ALERTA: [
      "Reequilibrar a composição da equipe (oficiais e ajudantes) para a atividade",
      "Investigar e tratar a origem dos retrabalhos recentes",
      "Garantir abastecimento e liberação contínua da frente",
      "Avaliar a logística de transporte interno (gruas, elevadores, distâncias)",
      "Reforçar a supervisão direta da frente",
    ],
    CRÍTICO: [
      "Ação imediata: revisar composição, qualificação e tamanho da equipe",
      "Levantar com o encarregado os gargalos de produção da frente",
      "Eliminar a causa-raiz dos retrabalhos (projeto, qualidade ou método)",
      "Reavaliar o método executivo e o ferramental ou equipamento empregado",
      "Recalcular o impacto no orçamento e no prazo e replanejar a frente",
    ],
  };

  const nivel = severidade as NivelAlto;
  return { resumo, causas: causas[nivel], acoes: acoes[nivel], confiabilidade };
}
