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

// ============================================================
// MULTI-ATIVIDADE (Iter #4) — orçar vários serviços de uma vez
// ============================================================

export type ItemOrcamento = {
  atividadeId: string;
  quantidade: number;
  padraoAcabamento: PadraoAcabamento;
};

export type InputOrcamentoMulti = {
  itens: ItemOrcamento[];
  uf: string;
  bdiPercentual?: number;
};

export type ItemResultado = {
  atividadeId: string;
  atividadeNome: string;
  unidade: string;
  categoriaProfissional: string;
  quantidade: number;
  padraoAcabamento: PadraoAcabamento;
  custoMaterialTotal: number;
  custoMaoObra: number;
  custoDireto: number;          // material + MO (sem BDI rateado)
  hhTotal: number;
  prazoDias: number;
  insumosCalculados: InsumoCalculado[];
};

/**
 * Linha de mão de obra agregada por categoria profissional.
 * Soma horas de todos os itens cuja categoria bate (ex: pedreiro de alvenaria + pedreiro de chapisco).
 */
export type MoConsolidada = {
  categoriaProfissional: string;
  hhTotal: number;
  custoTotal: number;
};

export type ResultadoOrcamentoMulti = {
  inputs: { uf: string; bdiPercentual: number };
  itens: ItemResultado[];
  // Consolidações — somatórios entre itens
  insumosConsolidados: InsumoCalculado[]; // mesmo código somado entre itens; ordenado por custo desc
  moConsolidada: MoConsolidada[];         // ordenado por hh desc
  // Totais
  custoMaterialTotal: number;
  custoMaoObra: number;
  custoDireto: number;
  bdiValor: number;
  custoFinal: number;
  hhTotal: number;
  // Equipe e prazo — premissa: execução sequencial (1 frente de trabalho)
  equipeSugerida: number;     // máximo entre itens (não soma — em série basta a maior equipe)
  prazoDias: number;          // soma dos prazos individuais
};

/**
 * Calcula um orçamento composto por vários itens (cada um com sua atividade,
 * quantidade e padrão de acabamento). Consolida insumos repetidos entre itens,
 * agrega mão de obra por categoria profissional e devolve totais.
 *
 * Estratégia: reusa `calcularOrcamento` por item (zero risco no motor já
 * calibrado da Iter #3) e faz a agregação aqui em cima.
 */
export function calcularOrcamentoMulti(
  input: InputOrcamentoMulti,
): ResultadoOrcamentoMulti {
  if (!input.itens || input.itens.length === 0) {
    throw new Error("Pelo menos 1 item é obrigatório no orçamento.");
  }

  const bdi = input.bdiPercentual ?? BDI_PADRAO;

  // 1) Calcula cada item isoladamente (sem BDI — BDI aplica no agregado)
  const itensResultado: ItemResultado[] = input.itens.map((item) => {
    const r = calcularOrcamento({
      atividadeId: item.atividadeId,
      quantidade: item.quantidade,
      uf: input.uf,
      padraoAcabamento: item.padraoAcabamento,
      bdiPercentual: 0, // suprime BDI por item — aplicamos só no agregado
    });
    return {
      atividadeId: r.atividade.id,
      atividadeNome: r.atividade.nome,
      unidade: r.atividade.unidade,
      categoriaProfissional: r.atividade.categoriaProfissional,
      quantidade: item.quantidade,
      padraoAcabamento: item.padraoAcabamento,
      custoMaterialTotal: r.custoMaterialTotal,
      custoMaoObra: r.custoMaoObra,
      custoDireto: r.custoDireto,
      hhTotal: r.hhTotal,
      prazoDias: r.prazoDias,
      insumosCalculados: r.insumosCalculados,
    };
  });

  // 2) Consolida insumos por código — soma qtde e custo entre itens.
  //    Custo unitário final = média ponderada (soma custo / soma qtde) —
  //    necessário porque padrões diferentes geram custos unitários distintos
  //    pro mesmo insumo (ex: cimento padrão alto custa 1.30× cimento médio).
  const insumosMap = new Map<
    string,
    {
      codigo: string;
      descricao: string;
      unidade: string;
      qtdeTotal: number;
      custoTotal: number;
      fatorPerda: number;       // do primeiro encontro — informativo
      fonte: string;
    }
  >();
  for (const item of itensResultado) {
    for (const ins of item.insumosCalculados) {
      const existente = insumosMap.get(ins.codigo);
      if (existente) {
        existente.qtdeTotal += ins.qtdeTotal;
        existente.custoTotal += ins.custoTotal;
      } else {
        insumosMap.set(ins.codigo, {
          codigo: ins.codigo,
          descricao: ins.descricao,
          unidade: ins.unidade,
          qtdeTotal: ins.qtdeTotal,
          custoTotal: ins.custoTotal,
          fatorPerda: ins.fatorPerda,
          fonte: ins.fonte,
        });
      }
    }
  }
  const insumosConsolidados: InsumoCalculado[] = Array.from(insumosMap.values())
    .map((c) => ({
      codigo: c.codigo,
      descricao: c.descricao,
      unidade: c.unidade,
      qtdePorUnidadeAtividade: 0, // não faz sentido entre múltiplos itens
      qtdeTotal: c.qtdeTotal,
      custoUnitarioMedio: c.qtdeTotal > 0 ? c.custoTotal / c.qtdeTotal : 0,
      custoTotal: c.custoTotal,
      fatorPerda: c.fatorPerda,
      fonte: c.fonte,
    }))
    .sort((a, b) => b.custoTotal - a.custoTotal);

  // 3) Agrega MO por categoria profissional.
  const moMap = new Map<string, { hh: number; custo: number }>();
  for (const item of itensResultado) {
    const slot = moMap.get(item.categoriaProfissional) ?? { hh: 0, custo: 0 };
    slot.hh += item.hhTotal;
    slot.custo += item.custoMaoObra;
    moMap.set(item.categoriaProfissional, slot);
  }
  const moConsolidada: MoConsolidada[] = Array.from(moMap.entries())
    .map(([categoriaProfissional, { hh, custo }]) => ({
      categoriaProfissional,
      hhTotal: hh,
      custoTotal: custo,
    }))
    .sort((a, b) => b.hhTotal - a.hhTotal);

  // 4) Totais
  const custoMaterialTotal = itensResultado.reduce((s, i) => s + i.custoMaterialTotal, 0);
  const custoMaoObra = itensResultado.reduce((s, i) => s + i.custoMaoObra, 0);
  const custoDireto = custoMaterialTotal + custoMaoObra;
  const bdiValor = custoDireto * (bdi / 100);
  const custoFinal = custoDireto + bdiValor;
  const hhTotal = itensResultado.reduce((s, i) => s + i.hhTotal, 0);

  // 5) Equipe e prazo (premissa: execução sequencial / 1 frente de trabalho)
  const equipeSugerida = itensResultado.reduce(
    (max, i) => {
      const itemEquipe = sugerirEquipe(i.quantidade, i.unidade);
      return itemEquipe > max ? itemEquipe : max;
    },
    1,
  );
  const prazoDias = itensResultado.reduce((s, i) => s + i.prazoDias, 0);

  return {
    inputs: { uf: input.uf, bdiPercentual: bdi },
    itens: itensResultado,
    insumosConsolidados,
    moConsolidada,
    custoMaterialTotal,
    custoMaoObra,
    custoDireto,
    bdiValor,
    custoFinal,
    hhTotal,
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
