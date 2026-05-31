// Decomposição das 76 atividades em insumos.
// Cada linha: para 1 unidade da atividade (m², m³, m, un, kg…), quanto de cada insumo consome.
// `fatorPerda` é específico do insumo dentro da atividade (cerâmica de pastilha tem mais perda
// que cerâmica grande; aço estrutural tem perda diferente de arame).
//
// Calibrado pela base SINAPI nacional (referência jun/2026), revisado em 2026-05-28
// após auditoria que identificou subestimação em chapiscos/pinturas/contrapisos e
// superestimação em telha cerâmica. Variação média atual vs. baseline antigo: ~15-20%.

export type AtividadeInsumoMap = {
  atividadeId: string;
  insumoCodigo: string;
  qtdePorUnidade: number;
  fatorPerda: number;
  observacao?: string;
};

export const ATIVIDADE_INSUMOS: AtividadeInsumoMap[] = [
  // ═══════════════════════════════════════════════════════════
  // P — PRELIMINARES
  // ═══════════════════════════════════════════════════════════
  // P001 — Locação de obra (m²)
  { atividadeId: "P001", insumoCodigo: "estaca-madeira-locacao-un", qtdePorUnidade: 0.4, fatorPerda: 1.05 },
  { atividadeId: "P001", insumoCodigo: "tabua-pinus-3a-m2", qtdePorUnidade: 0.04, fatorPerda: 1.05 },
  { atividadeId: "P001", insumoCodigo: "linha-nylon-locacao-m", qtdePorUnidade: 0.7, fatorPerda: 1.05 },
  { atividadeId: "P001", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.015, fatorPerda: 1.05 },

  // P002 — Tapume de madeira (m²)
  { atividadeId: "P002", insumoCodigo: "tabua-pinus-3a-m2", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "P002", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 0.7, fatorPerda: 1.10 },
  { atividadeId: "P002", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },

  // P003 — Escavação manual de vala (m³) — serviço puro, sem material consumível significativo
  { atividadeId: "P003", insumoCodigo: "agua-m3", qtdePorUnidade: 0.05, fatorPerda: 1.00, observacao: "Umedecimento e limpeza" },

  // P004 — Aterro compactado manual (m³)
  { atividadeId: "P004", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.55, fatorPerda: 1.05, observacao: "Material de empréstimo" },

  // P005 — Movimentação e descarte de entulhos (m³)
  { atividadeId: "P005", insumoCodigo: "cacamba-entulho-5m3", qtdePorUnidade: 0.06, fatorPerda: 1.00, observacao: "1 caçamba a cada ~16m³ entulho compactado" },

  // ═══════════════════════════════════════════════════════════
  // F — FUNDAÇÕES
  // ═══════════════════════════════════════════════════════════
  // F001 — Forma de sapata (m²)
  { atividadeId: "F001", insumoCodigo: "tabua-pinus-3a-m2", qtdePorUnidade: 0.7, fatorPerda: 1.15 },
  { atividadeId: "F001", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 1.2, fatorPerda: 1.15 },
  { atividadeId: "F001", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.12, fatorPerda: 1.10 },
  { atividadeId: "F001", insumoCodigo: "desmoldante-l", qtdePorUnidade: 0.08, fatorPerda: 1.05 },

  // F002 — Armação sapata CA-50 (kg)
  { atividadeId: "F002", insumoCodigo: "aco-ca50-kg", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "F002", insumoCodigo: "arame-recozido-18-kg", qtdePorUnidade: 0.02, fatorPerda: 1.10 },
  { atividadeId: "F002", insumoCodigo: "espacador-plastico-un", qtdePorUnidade: 0.6, fatorPerda: 1.05 },

  // F003 — Concretagem sapata (m³)
  { atividadeId: "F003", insumoCodigo: "concreto-usinado-fck25-m3", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "F003", insumoCodigo: "bomba-concreto-hora", qtdePorUnidade: 0.05, fatorPerda: 1.00 },

  // F004 — Viga baldrame — forma (m²)
  { atividadeId: "F004", insumoCodigo: "tabua-pinus-3a-m2", qtdePorUnidade: 0.75, fatorPerda: 1.15 },
  { atividadeId: "F004", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 1.3, fatorPerda: 1.15 },
  { atividadeId: "F004", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.13, fatorPerda: 1.10 },
  { atividadeId: "F004", insumoCodigo: "desmoldante-l", qtdePorUnidade: 0.09, fatorPerda: 1.05 },

  // F005 — Viga baldrame — armação CA-50 (kg)
  { atividadeId: "F005", insumoCodigo: "aco-ca50-kg", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "F005", insumoCodigo: "arame-recozido-18-kg", qtdePorUnidade: 0.02, fatorPerda: 1.10 },
  { atividadeId: "F005", insumoCodigo: "espacador-plastico-un", qtdePorUnidade: 0.5, fatorPerda: 1.05 },

  // F006 — Viga baldrame — concretagem (m³)
  { atividadeId: "F006", insumoCodigo: "concreto-usinado-fck25-m3", qtdePorUnidade: 1.0, fatorPerda: 1.05 },

  // ═══════════════════════════════════════════════════════════
  // E — ESTRUTURA
  // ═══════════════════════════════════════════════════════════
  // E001 — Forma de pilar (m²)
  { atividadeId: "E001", insumoCodigo: "chapa-compensado-resinado-10mm-m2", qtdePorUnidade: 0.6, fatorPerda: 1.15 },
  { atividadeId: "E001", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 1.4, fatorPerda: 1.15 },
  { atividadeId: "E001", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.15, fatorPerda: 1.10 },
  { atividadeId: "E001", insumoCodigo: "desmoldante-l", qtdePorUnidade: 0.1, fatorPerda: 1.05 },

  // E002 — Forma de viga (m²)
  { atividadeId: "E002", insumoCodigo: "chapa-compensado-resinado-10mm-m2", qtdePorUnidade: 0.55, fatorPerda: 1.15 },
  { atividadeId: "E002", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 1.6, fatorPerda: 1.15 },
  { atividadeId: "E002", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.15, fatorPerda: 1.10 },
  { atividadeId: "E002", insumoCodigo: "desmoldante-l", qtdePorUnidade: 0.1, fatorPerda: 1.05 },

  // E003 — Forma de laje (m²)
  { atividadeId: "E003", insumoCodigo: "chapa-compensado-resinado-10mm-m2", qtdePorUnidade: 0.45, fatorPerda: 1.15 },
  { atividadeId: "E003", insumoCodigo: "pontalete-pinus-7-7-m", qtdePorUnidade: 1.0, fatorPerda: 1.15 },
  { atividadeId: "E003", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },
  { atividadeId: "E003", insumoCodigo: "desmoldante-l", qtdePorUnidade: 0.08, fatorPerda: 1.05 },

  // E004 — Armação CA-50 pilares e vigas (kg)
  { atividadeId: "E004", insumoCodigo: "aco-ca50-kg", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "E004", insumoCodigo: "arame-recozido-18-kg", qtdePorUnidade: 0.02, fatorPerda: 1.10 },
  { atividadeId: "E004", insumoCodigo: "espacador-plastico-un", qtdePorUnidade: 0.6, fatorPerda: 1.05 },

  // E005 — Armação CA-60 laje nervurada (kg)
  { atividadeId: "E005", insumoCodigo: "aco-ca60-kg", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "E005", insumoCodigo: "arame-recozido-18-kg", qtdePorUnidade: 0.025, fatorPerda: 1.10 },
  { atividadeId: "E005", insumoCodigo: "espacador-plastico-un", qtdePorUnidade: 0.6, fatorPerda: 1.05 },

  // E006 — Concretagem pilar (m³)
  { atividadeId: "E006", insumoCodigo: "concreto-usinado-fck30-m3", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "E006", insumoCodigo: "bomba-concreto-hora", qtdePorUnidade: 0.06, fatorPerda: 1.00 },

  // E007 — Concretagem viga (m³)
  { atividadeId: "E007", insumoCodigo: "concreto-usinado-fck30-m3", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "E007", insumoCodigo: "bomba-concreto-hora", qtdePorUnidade: 0.06, fatorPerda: 1.00 },

  // E008 — Concretagem laje (m³)
  { atividadeId: "E008", insumoCodigo: "concreto-usinado-fck25-m3", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "E008", insumoCodigo: "bomba-concreto-hora", qtdePorUnidade: 0.05, fatorPerda: 1.00 },

  // E009 — Desforma (m²) — serviço puro, custo material residual (limpeza/prego)
  { atividadeId: "E009", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.005, fatorPerda: 1.00 },

  // E010 — Laje pré-moldada — assentamento (m²) — agora completo com vigota e tavela
  { atividadeId: "E010", insumoCodigo: "vigota-trelicada-h12-m", qtdePorUnidade: 3.3, fatorPerda: 1.05, observacao: "espaçamento ~40cm entre vigotas" },
  { atividadeId: "E010", insumoCodigo: "tavela-eps-un", qtdePorUnidade: 6.5, fatorPerda: 1.05, observacao: "enchimento entre vigotas (30×40cm)" },
  { atividadeId: "E010", insumoCodigo: "aco-ca50-kg", qtdePorUnidade: 4.5, fatorPerda: 1.10, observacao: "Armação complementar de distribuição" },
  { atividadeId: "E010", insumoCodigo: "concreto-usinado-fck25-m3", qtdePorUnidade: 0.05, fatorPerda: 1.05, observacao: "Capeamento 4-5cm" },

  // ═══════════════════════════════════════════════════════════
  // A — ALVENARIA
  // ═══════════════════════════════════════════════════════════
  // A001 — Alvenaria bloco cerâmico 9cm (m²)
  { atividadeId: "A001", insumoCodigo: "bloco-ceramico-9cm-un", qtdePorUnidade: 25, fatorPerda: 1.05 },
  { atividadeId: "A001", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.45, fatorPerda: 1.10 },
  { atividadeId: "A001", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.05, fatorPerda: 1.10 },

  // A002 — Alvenaria bloco cerâmico 14cm (m²)
  { atividadeId: "A002", insumoCodigo: "bloco-ceramico-14cm-un", qtdePorUnidade: 13, fatorPerda: 1.05 },
  { atividadeId: "A002", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.55, fatorPerda: 1.10 },
  { atividadeId: "A002", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.08, fatorPerda: 1.10 },

  // A003 — Alvenaria bloco cerâmico 19cm (m²)
  { atividadeId: "A003", insumoCodigo: "bloco-ceramico-19cm-un", qtdePorUnidade: 13, fatorPerda: 1.05 },
  { atividadeId: "A003", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.7, fatorPerda: 1.10 },
  { atividadeId: "A003", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },

  // A004 — Alvenaria bloco concreto 14cm (m²)
  { atividadeId: "A004", insumoCodigo: "bloco-concreto-14cm-un", qtdePorUnidade: 12.5, fatorPerda: 1.05 },
  { atividadeId: "A004", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.55, fatorPerda: 1.10 },
  { atividadeId: "A004", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.08, fatorPerda: 1.10 },

  // A005 — Alvenaria bloco concreto 19cm (m²)
  { atividadeId: "A005", insumoCodigo: "bloco-concreto-19cm-un", qtdePorUnidade: 12.5, fatorPerda: 1.05 },
  { atividadeId: "A005", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.7, fatorPerda: 1.10 },
  { atividadeId: "A005", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },

  // A006 — Alvenaria tijolo 2 furos (m²)
  { atividadeId: "A006", insumoCodigo: "tijolo-2furos-un", qtdePorUnidade: 40, fatorPerda: 1.15 },
  { atividadeId: "A006", insumoCodigo: "argamassa-assentamento-sc20kg", qtdePorUnidade: 0.45, fatorPerda: 1.10 },
  { atividadeId: "A006", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.06, fatorPerda: 1.10 },

  // A007 — Verga e contraverga moldada (m)
  { atividadeId: "A007", insumoCodigo: "aco-ca50-kg", qtdePorUnidade: 2.2, fatorPerda: 1.10 },
  { atividadeId: "A007", insumoCodigo: "concreto-usinado-fck25-m3", qtdePorUnidade: 0.008, fatorPerda: 1.05 },
  { atividadeId: "A007", insumoCodigo: "tabua-pinus-3a-m2", qtdePorUnidade: 0.12, fatorPerda: 1.15 },
  { atividadeId: "A007", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.02, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // RI — REVESTIMENTO INTERNO
  // ═══════════════════════════════════════════════════════════
  // RI001 — Chapisco rolo (m²) — argamassa industrializada
  { atividadeId: "RI001", insumoCodigo: "argamassa-reboco-sc20kg", qtdePorUnidade: 0.35, fatorPerda: 1.10 },
  { atividadeId: "RI001", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.05, fatorPerda: 1.10 },

  // RI002 — Chapisco convencional (m²) — cimento + areia traço 1:3 → ~6 kg cimento/m²
  { atividadeId: "RI002", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.13, fatorPerda: 1.10 },
  { atividadeId: "RI002", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.01, fatorPerda: 1.10 },

  // RI003 — Emboço interno (m²)
  { atividadeId: "RI003", insumoCodigo: "argamassa-reboco-sc20kg", qtdePorUnidade: 0.5, fatorPerda: 1.10 },
  { atividadeId: "RI003", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.08, fatorPerda: 1.10 },
  { atividadeId: "RI003", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.008, fatorPerda: 1.10 },

  // RI004 — Reboco interno (m²)
  { atividadeId: "RI004", insumoCodigo: "argamassa-reboco-sc20kg", qtdePorUnidade: 0.75, fatorPerda: 1.10 },
  { atividadeId: "RI004", insumoCodigo: "cal-hidratada-sc20kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },

  // RI005 — Massa única interna (m²)
  { atividadeId: "RI005", insumoCodigo: "argamassa-reboco-sc20kg", qtdePorUnidade: 1.0, fatorPerda: 1.10 },
  { atividadeId: "RI005", insumoCodigo: "cal-hidratada-sc20kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },
  { atividadeId: "RI005", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.05, fatorPerda: 1.10 },

  // RI006 — Gesso liso parede (m²)
  { atividadeId: "RI006", insumoCodigo: "gesso-pasta-sc40kg", qtdePorUnidade: 0.5, fatorPerda: 1.10 },

  // RI007 — Gesso liso teto (m²)
  { atividadeId: "RI007", insumoCodigo: "gesso-pasta-sc40kg", qtdePorUnidade: 0.6, fatorPerda: 1.15 },

  // RI008 — Forro de gesso acartonado (m²)
  { atividadeId: "RI008", insumoCodigo: "placa-gesso-acartonado-st-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "RI008", insumoCodigo: "perfil-metalico-gesso-m", qtdePorUnidade: 2.0, fatorPerda: 1.05 },
  { atividadeId: "RI008", insumoCodigo: "parafuso-drywall-kg", qtdePorUnidade: 0.05, fatorPerda: 1.10 },
  { atividadeId: "RI008", insumoCodigo: "fita-papel-drywall-m", qtdePorUnidade: 2.0, fatorPerda: 1.10 },
  { atividadeId: "RI008", insumoCodigo: "massa-rejunte-drywall-kg", qtdePorUnidade: 0.3, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // RE — REVESTIMENTO EXTERNO
  // ═══════════════════════════════════════════════════════════
  // RE001 — Chapisco externo (m²) — cimento + areia mais reforçado
  { atividadeId: "RE001", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.16, fatorPerda: 1.10 },
  { atividadeId: "RE001", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.015, fatorPerda: 1.10 },

  // RE002 — Emboço externo taliscado (m²)
  { atividadeId: "RE002", insumoCodigo: "argamassa-reboco-sc20kg", qtdePorUnidade: 0.7, fatorPerda: 1.10 },
  { atividadeId: "RE002", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.1, fatorPerda: 1.10 },
  { atividadeId: "RE002", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.012, fatorPerda: 1.10 },

  // RE003 — Textura acrílica rolo (m²)
  { atividadeId: "RE003", insumoCodigo: "selador-acrilico-l", qtdePorUnidade: 0.12, fatorPerda: 1.10 },
  { atividadeId: "RE003", insumoCodigo: "textura-acrilica-balde-25kg", qtdePorUnidade: 0.07, fatorPerda: 1.10 },

  // RE004 — Pastilha cerâmica 5×5cm (m²)
  { atividadeId: "RE004", insumoCodigo: "pastilha-5x5-m2", qtdePorUnidade: 1.05, fatorPerda: 1.15 },
  { atividadeId: "RE004", insumoCodigo: "argamassa-colante-ac3-sc20kg", qtdePorUnidade: 0.3, fatorPerda: 1.10 },
  { atividadeId: "RE004", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.6, fatorPerda: 1.10 },

  // RE005 — Revestimento cerâmico externo (m²)
  { atividadeId: "RE005", insumoCodigo: "ceramica-externa-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "RE005", insumoCodigo: "argamassa-colante-ac3-sc20kg", qtdePorUnidade: 0.25, fatorPerda: 1.10 },
  { atividadeId: "RE005", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.4, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // PI — PISOS
  // ═══════════════════════════════════════════════════════════
  // PI001 — Contrapiso desempenado (m²) — traço 1:4 cimento:areia, ~5cm
  { atividadeId: "PI001", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.3, fatorPerda: 1.05 },
  { atividadeId: "PI001", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.06, fatorPerda: 1.10 },
  { atividadeId: "PI001", insumoCodigo: "brita-1-m3", qtdePorUnidade: 0.04, fatorPerda: 1.10 },

  // PI002 — Contrapiso sarrafeado (m²)
  { atividadeId: "PI002", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.32, fatorPerda: 1.05 },
  { atividadeId: "PI002", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.06, fatorPerda: 1.10 },

  // PI003 — Piso cerâmico até 60×60cm (m²)
  { atividadeId: "PI003", insumoCodigo: "ceramica-piso-60x60-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "PI003", insumoCodigo: "argamassa-colante-ac2-sc20kg", qtdePorUnidade: 0.22, fatorPerda: 1.10 },
  { atividadeId: "PI003", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.5, fatorPerda: 1.10 },

  // PI004 — Piso porcelanato 60×60cm (m²)
  { atividadeId: "PI004", insumoCodigo: "porcelanato-60x60-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "PI004", insumoCodigo: "argamassa-colante-ac3-sc20kg", qtdePorUnidade: 0.25, fatorPerda: 1.10 },
  { atividadeId: "PI004", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.4, fatorPerda: 1.10 },

  // PI005 — Piso porcelanato 90×90cm+ (m²)
  { atividadeId: "PI005", insumoCodigo: "porcelanato-90x90-m2", qtdePorUnidade: 1.07, fatorPerda: 1.10 },
  { atividadeId: "PI005", insumoCodigo: "argamassa-colante-ac3-sc20kg", qtdePorUnidade: 0.28, fatorPerda: 1.10 },
  { atividadeId: "PI005", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.35, fatorPerda: 1.10 },

  // PI006 — Piso vinílico régua (m²)
  { atividadeId: "PI006", insumoCodigo: "piso-vinilico-regua-m2", qtdePorUnidade: 1.05, fatorPerda: 1.05 },
  { atividadeId: "PI006", insumoCodigo: "manta-acustica-vinilico-m2", qtdePorUnidade: 1.05, fatorPerda: 1.05 },
  { atividadeId: "PI006", insumoCodigo: "cola-piso-vinilico-l", qtdePorUnidade: 0.25, fatorPerda: 1.05 },

  // PI007 — Rodapé cerâmico (m)
  { atividadeId: "PI007", insumoCodigo: "rodape-ceramico-m", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "PI007", insumoCodigo: "argamassa-colante-ac2-sc20kg", qtdePorUnidade: 0.04, fatorPerda: 1.10 },
  { atividadeId: "PI007", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.08, fatorPerda: 1.10 },

  // PI008 — Regularização com argamassa (m²) — camada fina ~2cm
  { atividadeId: "PI008", insumoCodigo: "cimento-cp2-sc50kg", qtdePorUnidade: 0.18, fatorPerda: 1.05 },
  { atividadeId: "PI008", insumoCodigo: "areia-media-lavada-m3", qtdePorUnidade: 0.04, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // PC — PAREDE CERÂMICA
  // ═══════════════════════════════════════════════════════════
  // PC001 — Azulejo até 30×30cm (m²)
  { atividadeId: "PC001", insumoCodigo: "ceramica-parede-30x30-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "PC001", insumoCodigo: "argamassa-colante-ac2-sc20kg", qtdePorUnidade: 0.2, fatorPerda: 1.10 },
  { atividadeId: "PC001", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.45, fatorPerda: 1.10 },

  // PC002 — Cerâmica parede 45×45cm (m²)
  { atividadeId: "PC002", insumoCodigo: "ceramica-parede-45x45-m2", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "PC002", insumoCodigo: "argamassa-colante-ac2-sc20kg", qtdePorUnidade: 0.22, fatorPerda: 1.10 },
  { atividadeId: "PC002", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.4, fatorPerda: 1.10 },

  // PC003 — Porcelanato parede 60×120cm (m²)
  { atividadeId: "PC003", insumoCodigo: "porcelanato-parede-60x120-m2", qtdePorUnidade: 1.07, fatorPerda: 1.15 },
  { atividadeId: "PC003", insumoCodigo: "argamassa-colante-ac3-sc20kg", qtdePorUnidade: 0.3, fatorPerda: 1.10 },
  { atividadeId: "PC003", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.3, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // IM — IMPERMEABILIZAÇÃO
  // ═══════════════════════════════════════════════════════════
  // IM001 — Manta asfáltica (m²)
  { atividadeId: "IM001", insumoCodigo: "manta-asfaltica-3mm-m2", qtdePorUnidade: 1.1, fatorPerda: 1.15 },
  { atividadeId: "IM001", insumoCodigo: "primer-asfaltico-l", qtdePorUnidade: 0.3, fatorPerda: 1.10 },

  // IM002 — Cristalizante (m²) — 2-3 demãos, consumo realista ~0.5-0.6 l/m²
  { atividadeId: "IM002", insumoCodigo: "cristalizante-l", qtdePorUnidade: 0.6, fatorPerda: 1.05 },

  // IM003 — Argamassa polimérica (m²) — 2 demãos, consumo ~10 kg/m² (0.55 sc de 18kg)
  { atividadeId: "IM003", insumoCodigo: "argamassa-polimerica-sc18kg", qtdePorUnidade: 0.55, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // CB — COBERTURA
  // ═══════════════════════════════════════════════════════════
  // CB001 — Estrutura madeira tesoura (m²)
  { atividadeId: "CB001", insumoCodigo: "madeira-tesoura-cobertura-m", qtdePorUnidade: 1.2, fatorPerda: 1.10 },
  { atividadeId: "CB001", insumoCodigo: "madeira-caibro-cobertura-m", qtdePorUnidade: 2.5, fatorPerda: 1.10 },
  { atividadeId: "CB001", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.18, fatorPerda: 1.10 },

  // CB002 — Telha cerâmica (m²) — rendimento real 13 un/m² (portuguesa)
  { atividadeId: "CB002", insumoCodigo: "telha-ceramica-portuguesa-un", qtdePorUnidade: 13, fatorPerda: 1.15 },
  { atividadeId: "CB002", insumoCodigo: "madeira-ripa-cobertura-m", qtdePorUnidade: 2.5, fatorPerda: 1.10 },
  { atividadeId: "CB002", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.05, fatorPerda: 1.10 },

  // CB003 — Telha fibrocimento ondulada (m²)
  { atividadeId: "CB003", insumoCodigo: "telha-fibrocimento-ondulada-m2", qtdePorUnidade: 1.1, fatorPerda: 1.10 },
  { atividadeId: "CB003", insumoCodigo: "prego-comum-kg", qtdePorUnidade: 0.03, fatorPerda: 1.10, observacao: "Parafuso telha" },

  // CB004 — Calha e rufo alumínio (m)
  { atividadeId: "CB004", insumoCodigo: "calha-aluminio-m", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "CB004", insumoCodigo: "rufo-aluminio-m", qtdePorUnidade: 0.3, fatorPerda: 1.05 },
  { atividadeId: "CB004", insumoCodigo: "silicone-neutro-un", qtdePorUnidade: 0.08, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // PT — PINTURA
  // ═══════════════════════════════════════════════════════════
  // PT001 — Selador + massa PVA 2 demãos (m²)
  { atividadeId: "PT001", insumoCodigo: "selador-acrilico-l", qtdePorUnidade: 0.13, fatorPerda: 1.10 },
  { atividadeId: "PT001", insumoCodigo: "massa-pva-balde-25kg", qtdePorUnidade: 0.03, fatorPerda: 1.10 },
  { atividadeId: "PT001", insumoCodigo: "lixa-folha", qtdePorUnidade: 0.4, fatorPerda: 1.00 },

  // PT002 — Pintura PVA 2 demãos (m²) — tinta econômica rende ~5m²/l por demão
  { atividadeId: "PT002", insumoCodigo: "tinta-pva-l", qtdePorUnidade: 0.4, fatorPerda: 1.10 },
  { atividadeId: "PT002", insumoCodigo: "fita-crepe-rolo", qtdePorUnidade: 0.02, fatorPerda: 1.00 },

  // PT003 — Pintura látex acrílica 2 demãos (m²)
  { atividadeId: "PT003", insumoCodigo: "tinta-acrilica-premium-l", qtdePorUnidade: 0.35, fatorPerda: 1.10 },
  { atividadeId: "PT003", insumoCodigo: "fita-crepe-rolo", qtdePorUnidade: 0.02, fatorPerda: 1.00 },

  // PT004 — Pintura esmalte 2 demãos (m²) — esmalte rende menos por demão
  { atividadeId: "PT004", insumoCodigo: "tinta-esmalte-l", qtdePorUnidade: 0.3, fatorPerda: 1.10 },
  { atividadeId: "PT004", insumoCodigo: "lixa-folha", qtdePorUnidade: 0.4, fatorPerda: 1.00 },

  // PT005 — Pintura epóxi piso (m²)
  { atividadeId: "PT005", insumoCodigo: "tinta-epoxi-kit-3kg", qtdePorUnidade: 0.16, fatorPerda: 1.05 },
  { atividadeId: "PT005", insumoCodigo: "lixa-folha", qtdePorUnidade: 0.5, fatorPerda: 1.00 },

  // ═══════════════════════════════════════════════════════════
  // HI — INSTALAÇÕES HIDROSSANITÁRIAS
  // ═══════════════════════════════════════════════════════════
  // HI001 — Tubulação PVC esgoto ramal (m) — mix entre primário (100mm) e secundário (50mm)
  { atividadeId: "HI001", insumoCodigo: "tubo-pvc-esgoto-100mm-m", qtdePorUnidade: 0.6, fatorPerda: 1.10, observacao: "ramais primários (vaso)" },
  { atividadeId: "HI001", insumoCodigo: "tubo-pvc-esgoto-50mm-m", qtdePorUnidade: 0.4, fatorPerda: 1.10, observacao: "ramais secundários (pia, lavatório, máquina)" },
  { atividadeId: "HI001", insumoCodigo: "conexao-pvc-esgoto-un", qtdePorUnidade: 0.3, fatorPerda: 1.10 },
  { atividadeId: "HI001", insumoCodigo: "cola-pvc-bisn", qtdePorUnidade: 0.05, fatorPerda: 1.05 },

  // HI002 — Tubulação PVC água fria embutida (m)
  { atividadeId: "HI002", insumoCodigo: "tubo-pvc-soldavel-25mm-m", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "HI002", insumoCodigo: "conexao-pvc-soldavel-un", qtdePorUnidade: 0.6, fatorPerda: 1.10 },
  { atividadeId: "HI002", insumoCodigo: "cola-pvc-bisn", qtdePorUnidade: 0.04, fatorPerda: 1.05 },
  { atividadeId: "HI002", insumoCodigo: "fita-veda-rosca-un", qtdePorUnidade: 0.08, fatorPerda: 1.05 },

  // HI003 — Conjunto sanitário completo (un) — 1 bacia + 1 lavatório por unidade ("1 banheiro")
  { atividadeId: "HI003", insumoCodigo: "bacia-sanitaria-caixa-un", qtdePorUnidade: 1.0, fatorPerda: 1.00 },
  { atividadeId: "HI003", insumoCodigo: "lavatorio-coluna-un", qtdePorUnidade: 1.0, fatorPerda: 1.00 },
  { atividadeId: "HI003", insumoCodigo: "engate-flexivel-un", qtdePorUnidade: 2.0, fatorPerda: 1.05 },
  { atividadeId: "HI003", insumoCodigo: "silicone-neutro-un", qtdePorUnidade: 0.4, fatorPerda: 1.05 },

  // HI004 — Metais torneiras e registros (un)
  { atividadeId: "HI004", insumoCodigo: "torneira-cozinha-un", qtdePorUnidade: 0.5, fatorPerda: 1.00 },
  { atividadeId: "HI004", insumoCodigo: "registro-gaveta-un", qtdePorUnidade: 0.6, fatorPerda: 1.00 },
  { atividadeId: "HI004", insumoCodigo: "fita-veda-rosca-un", qtdePorUnidade: 0.2, fatorPerda: 1.05 },

  // ═══════════════════════════════════════════════════════════
  // EL — INSTALAÇÕES ELÉTRICAS
  // ═══════════════════════════════════════════════════════════
  // EL001 — Eletroduto embutido (m)
  { atividadeId: "EL001", insumoCodigo: "eletroduto-corrugado-25mm-m", qtdePorUnidade: 1.05, fatorPerda: 1.10 },
  { atividadeId: "EL001", insumoCodigo: "caixa-4x2-un", qtdePorUnidade: 0.4, fatorPerda: 1.05 },

  // EL002 — Passagem de fio fiação (m) — fio dimensionado 2,5mm² circuito de iluminação/tomada
  { atividadeId: "EL002", insumoCodigo: "fio-2-5mm2-m", qtdePorUnidade: 1.3, fatorPerda: 1.10 },

  // EL003 — Ponto tomada/interruptor (un) — mix 70/30 entre tomada e interruptor
  { atividadeId: "EL003", insumoCodigo: "tomada-2p-t-completa-un", qtdePorUnidade: 0.7, fatorPerda: 1.05 },
  { atividadeId: "EL003", insumoCodigo: "interruptor-1t-completo-un", qtdePorUnidade: 0.3, fatorPerda: 1.05 },
  { atividadeId: "EL003", insumoCodigo: "caixa-4x2-un", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "EL003", insumoCodigo: "fio-2-5mm2-m", qtdePorUnidade: 4, fatorPerda: 1.10 },

  // EL004 — Ponto iluminação (un) — agora com 1 plafon + 1 lâmpada por ponto
  { atividadeId: "EL004", insumoCodigo: "caixa-octogonal-un", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "EL004", insumoCodigo: "plafon-soquete-un", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "EL004", insumoCodigo: "lampada-led-bulbo-un", qtdePorUnidade: 1.0, fatorPerda: 1.05 },
  { atividadeId: "EL004", insumoCodigo: "fio-2-5mm2-m", qtdePorUnidade: 3, fatorPerda: 1.10 },

  // ═══════════════════════════════════════════════════════════
  // SF — SERVIÇOS FINAIS
  // ═══════════════════════════════════════════════════════════
  // SF001 — Limpeza fina obra (m²)
  { atividadeId: "SF001", insumoCodigo: "detergente-l", qtdePorUnidade: 0.05, fatorPerda: 1.00 },
  { atividadeId: "SF001", insumoCodigo: "desincrustante-l", qtdePorUnidade: 0.05, fatorPerda: 1.00 },

  // SF002 — Limpeza grossa entulho (m²)
  { atividadeId: "SF002", insumoCodigo: "cacamba-entulho-5m3", qtdePorUnidade: 0.008, fatorPerda: 1.00 },

  // SF003 — Rejuntamento piso/parede (m²)
  { atividadeId: "SF003", insumoCodigo: "rejunte-acabamento-kg", qtdePorUnidade: 0.55, fatorPerda: 1.15 },

  // SF004 — Silicone arremate geral (m)
  { atividadeId: "SF004", insumoCodigo: "silicone-neutro-un", qtdePorUnidade: 0.3, fatorPerda: 1.10 },
];

export function insumosDaAtividade(atividadeId: string): AtividadeInsumoMap[] {
  return ATIVIDADE_INSUMOS.filter((a) => a.atividadeId === atividadeId);
}
