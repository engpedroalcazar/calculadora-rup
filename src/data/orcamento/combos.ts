// Sugestões automáticas de atividades complementares.
// Quando o cliente adiciona uma atividade "gatilho" no orçamento, mostramos um
// banner sugerindo as atividades complementares naturais (ex: alvenaria → pintura).
//
// Decisão (Iter #4, Fase 10): hardcoded em TS em vez de tabela no banco.
// Combos são constantes de negócio que mudam raramente — versionar em git é
// mais simples que ter um admin de combos. Se um dia virar configurável pelo
// cliente, migra pra schema.

export type ComboSugerido = {
  /** ID da atividade sugerida (do catálogo em atividades-custo.ts). */
  atividadeId: string;
  /**
   * Se `true`, a quantidade da sugestão é preenchida automaticamente com a
   * mesma quantidade da atividade gatilho. Útil quando faz sentido físico
   * (ex: m² de chapisco = m² de alvenaria). Se `false`, cliente preenche.
   */
  herdaQuantidade: boolean;
};

/**
 * Mapa atividadeGatilho → lista de sugestões.
 * Múltiplas variantes de uma mesma "família" (ex: A001 a A006 — alvenarias)
 * compartilham a mesma cadeia de sugestões.
 */
export const COMBOS_SUGERIDOS: Record<string, ComboSugerido[]> = {
  // ===== ALVENARIAS → revestimento interno completo + pintura =====
  // Toda alvenaria interna pede chapisco + emboço + reboco + selador + pintura.
  // Quantidades iguais à alvenaria (mesma área em m²).
  ...gerarMapa(
    ["A001", "A002", "A003", "A004", "A005", "A006"],
    [
      { atividadeId: "RI001", herdaQuantidade: true }, // chapisco rolo
      { atividadeId: "RI003", herdaQuantidade: true }, // emboço interno
      { atividadeId: "RI004", herdaQuantidade: true }, // reboco interno
      { atividadeId: "PT001", herdaQuantidade: true }, // selador + massa
      { atividadeId: "PT002", herdaQuantidade: true }, // pintura PVA
    ],
  ),

  // ===== FORMA DE SAPATA → armação + concretagem =====
  // Forma é em m², armação em kg, concretagem em m³ — quantidades não herdam
  // (cliente preenche o que pegou do projeto estrutural).
  F001: [
    { atividadeId: "F002", herdaQuantidade: false }, // armação sapata
    { atividadeId: "F003", herdaQuantidade: false }, // concretagem sapata
  ],

  // ===== VIGA BALDRAME (forma) → armação + concretagem =====
  F004: [
    { atividadeId: "F005", herdaQuantidade: false }, // armação viga baldrame
    { atividadeId: "F006", herdaQuantidade: false }, // concretagem viga baldrame
  ],

  // ===== FORMAS ESTRUTURAIS → armação + concretagem + desforma =====
  // Forma de pilar/viga/laje pede sempre armação CA-50 e concretagem.
  // Desforma herda quantidade da forma (mesma área em m²).
  ...gerarMapa(
    ["E001", "E002", "E003"],
    [
      { atividadeId: "E004", herdaQuantidade: false }, // armação CA-50
      { atividadeId: "E006", herdaQuantidade: false }, // concretagem pilar (genérica)
      { atividadeId: "E009", herdaQuantidade: true }, // desforma (m²)
    ],
  ),

  // ===== CONTRAPISO → piso cerâmico + rodapé + rejunte =====
  // Quantidade do piso herda do contrapiso (mesma área).
  // Rodapé é em m, não herda. Rejunte é em m², herda.
  ...gerarMapa(
    ["PI001", "PI002"],
    [
      { atividadeId: "PI003", herdaQuantidade: true }, // piso cerâmico até 60x60
      { atividadeId: "PI007", herdaQuantidade: false }, // rodapé cerâmico (m)
      { atividadeId: "SF003", herdaQuantidade: true }, // rejuntamento
    ],
  ),

  // ===== COBERTURA — estrutura → telha + calha =====
  CB001: [
    { atividadeId: "CB002", herdaQuantidade: true }, // telha cerâmica
    { atividadeId: "CB004", herdaQuantidade: false }, // calha e rufo (m)
  ],

  // ===== REVESTIMENTO EXTERNO — chapisco → emboço + textura =====
  RE001: [
    { atividadeId: "RE002", herdaQuantidade: true }, // emboço externo taliscado
    { atividadeId: "RE003", herdaQuantidade: true }, // textura acrílica
  ],

  // ===== PAREDE CERÂMICA → rejunte =====
  ...gerarMapa(
    ["PC001", "PC002", "PC003"],
    [{ atividadeId: "SF003", herdaQuantidade: true }],
  ),
};

/** Helper interno — replica a mesma lista de sugestões para várias atividades gatilho. */
function gerarMapa(
  gatilhos: string[],
  sugestoes: ComboSugerido[],
): Record<string, ComboSugerido[]> {
  const out: Record<string, ComboSugerido[]> = {};
  for (const g of gatilhos) out[g] = sugestoes;
  return out;
}

/**
 * Retorna as sugestões de combo para a atividade gatilho, FILTRANDO as que o
 * cliente já adicionou no orçamento (pra não sugerir o que já tá lá).
 */
export function buscarSugestoes(
  atividadeGatilhoId: string,
  atividadesJaSelecionadas: string[],
): ComboSugerido[] {
  const candidatos = COMBOS_SUGERIDOS[atividadeGatilhoId];
  if (!candidatos) return [];
  const jaSelecionadas = new Set(atividadesJaSelecionadas);
  return candidatos.filter((c) => !jaSelecionadas.has(c.atividadeId));
}
