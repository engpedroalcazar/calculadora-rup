import { buscarAtividade, type AtividadeCusto } from "@/data/orcamento/atividades-custo";
import { custoHoraHomem } from "./salarios";
import { INSUMOS, type Insumo } from "@/data/orcamento/insumos";
import { ATIVIDADE_INSUMOS } from "@/data/orcamento/atividade-insumos";

export type PadraoAcabamento = "economico" | "medio" | "alto";

// Fator que ajusta o custo de material conforme o padrão escolhido pelo usuário.
// Padrão econômico usa materiais mais baratos; alto usa premium.
const FATOR_PADRAO: Record<PadraoAcabamento, number> = {
  economico: 0.85,
  medio: 1.00,
  alto: 1.30,
};

const BDI_PADRAO = 25; // percentual padrão da indústria para pequena/média obra
const HORAS_DIA_PADRAO = 8;

export type InputOrcamento = {
  atividadeId: string;
  quantidade: number;
  uf: string;
  padraoAcabamento: PadraoAcabamento;
  bdiPercentual?: number; // default 25
};

// Linha individual da lista de materiais — é o que vai aparecer no relatório
// completo (após paywall). Cada linha é 1 insumo da atividade selecionada,
// já multiplicado pela quantidade pedida e pelos fatores aplicáveis.
export type InsumoCalculado = {
  codigo: string;
  descricao: string;
  unidade: string;
  qtdePorUnidadeAtividade: number;
  qtdeTotal: number;        // qtdePorUnidade × quantidade × fatorPerda × fatorPadrao
  custoUnitarioMedio: number; // R$ por unidade do insumo (sem perda, sem padrão)
  custoTotal: number;       // qtdeTotal × custoUnitarioMedio
  fatorPerda: number;
  fonte: string;
};

export type ResultadoOrcamento = {
  atividade: AtividadeCusto;
  inputs: {
    quantidade: number;
    uf: string;
    padraoAcabamento: PadraoAcabamento;
    bdiPercentual: number;
  };
  // Detalhamento da mão de obra
  hhTotal: number;
  custoHoraHomem: number;
  custoMaoObra: number;
  // Detalhamento do material — agora vem da soma insumo a insumo
  custoMaterialUnitario: number;
  custoMaterialTotal: number;
  insumosCalculados: InsumoCalculado[];
  // Totais
  custoDireto: number;
  bdiValor: number;
  custoFinal: number;
  custoPorUnidade: number;
  // Prazo
  equipeSugerida: number;
  prazoDias: number;
};

// Heurística simples de tamanho de equipe baseado em quantidade total a executar.
function sugerirEquipe(quantidade: number, unidade: string): number {
  if (unidade === "un") {
    if (quantidade <= 10) return 1;
    if (quantidade <= 50) return 2;
    return 3;
  }
  if (quantidade <= 30) return 1;
  if (quantidade <= 120) return 2;
  if (quantidade <= 400) return 3;
  if (quantidade <= 1000) return 4;
  return 5;
}

// Lookup local in-memory dos insumos por codigo (fonte de verdade: src/data/orcamento/insumos.ts).
// Mantemos esse lookup no motor pra que o cálculo seja síncrono e o smoke test não precise
// abrir conexão com o banco. Em runtime web, os mesmos dados estão também no Postgres via seed.
const INSUMO_POR_CODIGO: Map<string, Insumo> = new Map(INSUMOS.map((i) => [i.codigo, i]));

export function calcularOrcamento(input: InputOrcamento): ResultadoOrcamento {
  const atividade = buscarAtividade(input.atividadeId);
  if (!atividade) {
    throw new Error(`Atividade não encontrada: ${input.atividadeId}`);
  }
  if (input.quantidade <= 0) {
    throw new Error("Quantidade deve ser positiva");
  }

  const bdi = input.bdiPercentual ?? BDI_PADRAO;
  const fatorPadrao = FATOR_PADRAO[input.padraoAcabamento];

  // Material — soma insumo a insumo da decomposição da atividade
  const linksAtividade = ATIVIDADE_INSUMOS.filter((a) => a.atividadeId === atividade.id);
  if (linksAtividade.length === 0) {
    throw new Error(
      `Atividade ${atividade.id} não tem insumos cadastrados em src/data/orcamento/atividade-insumos.ts`,
    );
  }

  const insumosCalculados: InsumoCalculado[] = [];
  let custoMaterialTotal = 0;

  for (const link of linksAtividade) {
    const insumo = INSUMO_POR_CODIGO.get(link.insumoCodigo);
    if (!insumo) {
      throw new Error(
        `Insumo '${link.insumoCodigo}' referenciado por '${atividade.id}' não está cadastrado.`,
      );
    }
    // qtdeTotal representa o consumo FÍSICO real (volume/peso/unidades), e não muda
    // com o padrão de acabamento — mesma obra precisa do mesmo volume de concreto,
    // mesmo tempo de bomba, mesmo número de blocos. O padrão de acabamento afeta
    // o PREÇO do material (premium custa mais), capturado abaixo no custoUnitarioAjustado.
    const qtdeTotal =
      link.qtdePorUnidade * input.quantidade * link.fatorPerda;
    const custoUnitarioAjustado = insumo.custoUnitarioMedio * fatorPadrao;
    const custoTotal = qtdeTotal * custoUnitarioAjustado;
    custoMaterialTotal += custoTotal;
    insumosCalculados.push({
      codigo: insumo.codigo,
      descricao: insumo.descricao,
      unidade: insumo.unidade,
      qtdePorUnidadeAtividade: link.qtdePorUnidade,
      qtdeTotal,
      custoUnitarioMedio: custoUnitarioAjustado,
      custoTotal,
      fatorPerda: link.fatorPerda,
      fonte: insumo.fonte,
    });
  }

  // Ordena por custo descendente — assim a "prévia paywall" mostra os itens mais relevantes.
  insumosCalculados.sort((a, b) => b.custoTotal - a.custoTotal);

  const custoMaterialUnitario =
    input.quantidade > 0 ? custoMaterialTotal / input.quantidade : 0;

  // Mão de obra
  const hhTotal = atividade.rupReferencia * input.quantidade;
  const custoHH = custoHoraHomem(atividade.categoriaProfissional, input.uf);
  const custoMaoObra = hhTotal * custoHH;

  // Total direto + BDI
  const custoDireto = custoMaterialTotal + custoMaoObra;
  const bdiValor = custoDireto * (bdi / 100);
  const custoFinal = custoDireto + bdiValor;
  const custoPorUnidade = custoFinal / input.quantidade;

  // Prazo estimado (dias úteis, jornada 8h)
  const equipeSugerida = sugerirEquipe(input.quantidade, atividade.unidade);
  const prazoDias = Math.max(
    1,
    Math.ceil(hhTotal / (equipeSugerida * HORAS_DIA_PADRAO)),
  );

  return {
    atividade,
    inputs: {
      quantidade: input.quantidade,
      uf: input.uf,
      padraoAcabamento: input.padraoAcabamento,
      bdiPercentual: bdi,
    },
    hhTotal,
    custoHoraHomem: custoHH,
    custoMaoObra,
    custoMaterialUnitario,
    custoMaterialTotal,
    insumosCalculados,
    custoDireto,
    bdiValor,
    custoFinal,
    custoPorUnidade,
    equipeSugerida,
    prazoDias,
  };
}

export function formatarBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatarQuantidade(valor: number, unidade: string): string {
  const n =
    valor >= 100
      ? valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
      : valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  return `${n} ${unidade}`;
}
