import type { CategoriaProfissional } from "@/lib/orcamento/salarios";

export type AtividadeCusto = {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  // Produtividade — HH/unid, alinhada ao banco do ObraRadar (Calculadora RUP).
  rupReferencia: number;
  // Custo médio de material por unidade executada (R$). Base SINAPI nacional jun/2026.
  custoMaterialMedio: number;
  // Coeficiente de perda física aplicado ao consumo de material (1.00 = sem perda).
  fatorPerda: number;
  // Categoria profissional dominante na execução do serviço.
  categoriaProfissional: CategoriaProfissional;
};

export const ATIVIDADES: AtividadeCusto[] = [
  // P — PRELIMINARES
  { id: "P001", nome: "Locação de obra", categoria: "Preliminares", unidade: "m²", rupReferencia: 0.15, custoMaterialMedio: 4, fatorPerda: 1.05, categoriaProfissional: "servente" },
  { id: "P002", nome: "Tapume de madeira", categoria: "Preliminares", unidade: "m²", rupReferencia: 0.44, custoMaterialMedio: 35, fatorPerda: 1.10, categoriaProfissional: "carpinteiro" },
  { id: "P003", nome: "Escavação manual de vala", categoria: "Preliminares", unidade: "m³", rupReferencia: 3.20, custoMaterialMedio: 0.6, fatorPerda: 1.00, categoriaProfissional: "servente" },
  { id: "P004", nome: "Aterro compactado manual", categoria: "Preliminares", unidade: "m³", rupReferencia: 2.00, custoMaterialMedio: 55, fatorPerda: 1.05, categoriaProfissional: "servente" },
  { id: "P005", nome: "Movimentação e descarte de entulhos", categoria: "Preliminares", unidade: "m³", rupReferencia: 0.25, custoMaterialMedio: 25, fatorPerda: 1.00, categoriaProfissional: "servente" },

  // F — FUNDAÇÕES
  { id: "F001", nome: "Forma de sapata (madeira)", categoria: "Fundações", unidade: "m²", rupReferencia: 1.45, custoMaterialMedio: 42, fatorPerda: 1.15, categoriaProfissional: "carpinteiro" },
  { id: "F002", nome: "Armação sapata CA-50", categoria: "Fundações", unidade: "kg", rupReferencia: 0.15, custoMaterialMedio: 9, fatorPerda: 1.10, categoriaProfissional: "armador" },
  { id: "F003", nome: "Concretagem sapata (bomba)", categoria: "Fundações", unidade: "m³", rupReferencia: 1.23, custoMaterialMedio: 520, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "F004", nome: "Viga baldrame — forma", categoria: "Fundações", unidade: "m²", rupReferencia: 1.60, custoMaterialMedio: 45, fatorPerda: 1.15, categoriaProfissional: "carpinteiro" },
  { id: "F005", nome: "Viga baldrame — armação CA-50", categoria: "Fundações", unidade: "kg", rupReferencia: 0.15, custoMaterialMedio: 9, fatorPerda: 1.10, categoriaProfissional: "armador" },
  { id: "F006", nome: "Viga baldrame — concretagem", categoria: "Fundações", unidade: "m³", rupReferencia: 1.45, custoMaterialMedio: 480, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },

  // E — ESTRUTURA
  { id: "E001", nome: "Forma de pilar", categoria: "Estrutura", unidade: "m²", rupReferencia: 1.23, custoMaterialMedio: 50, fatorPerda: 1.15, categoriaProfissional: "carpinteiro" },
  { id: "E002", nome: "Forma de viga", categoria: "Estrutura", unidade: "m²", rupReferencia: 1.45, custoMaterialMedio: 50, fatorPerda: 1.15, categoriaProfissional: "carpinteiro" },
  { id: "E003", nome: "Forma de laje", categoria: "Estrutura", unidade: "m²", rupReferencia: 0.89, custoMaterialMedio: 38, fatorPerda: 1.15, categoriaProfissional: "carpinteiro" },
  { id: "E004", nome: "Armação CA-50 pilares e vigas", categoria: "Estrutura", unidade: "kg", rupReferencia: 0.15, custoMaterialMedio: 9, fatorPerda: 1.10, categoriaProfissional: "armador" },
  { id: "E005", nome: "Armação CA-60 laje nervurada", categoria: "Estrutura", unidade: "kg", rupReferencia: 0.15, custoMaterialMedio: 11, fatorPerda: 1.10, categoriaProfissional: "armador" },
  { id: "E006", nome: "Concretagem pilar", categoria: "Estrutura", unidade: "m³", rupReferencia: 1.78, custoMaterialMedio: 510, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "E007", nome: "Concretagem viga", categoria: "Estrutura", unidade: "m³", rupReferencia: 1.60, custoMaterialMedio: 510, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "E008", nome: "Concretagem laje", categoria: "Estrutura", unidade: "m³", rupReferencia: 1.33, custoMaterialMedio: 490, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "E009", nome: "Desforma (geral)", categoria: "Estrutura", unidade: "m²", rupReferencia: 0.25, custoMaterialMedio: 0.1, fatorPerda: 1.00, categoriaProfissional: "carpinteiro" },
  { id: "E010", nome: "Laje pré-moldada (assentamento)", categoria: "Estrutura", unidade: "m²", rupReferencia: 0.35, custoMaterialMedio: 200, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },

  // A — ALVENARIA
  { id: "A001", nome: "Alvenaria bloco cerâmico 9cm", categoria: "Alvenaria", unidade: "m²", rupReferencia: 0.67, custoMaterialMedio: 52, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "A002", nome: "Alvenaria bloco cerâmico 14cm", categoria: "Alvenaria", unidade: "m²", rupReferencia: 0.84, custoMaterialMedio: 70, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "A003", nome: "Alvenaria bloco cerâmico 19cm", categoria: "Alvenaria", unidade: "m²", rupReferencia: 1.07, custoMaterialMedio: 92, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "A004", nome: "Alvenaria bloco concreto 14cm", categoria: "Alvenaria", unidade: "m²", rupReferencia: 0.89, custoMaterialMedio: 78, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "A005", nome: "Alvenaria bloco concreto 19cm", categoria: "Alvenaria", unidade: "m²", rupReferencia: 1.14, custoMaterialMedio: 95, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "A006", nome: "Alvenaria tijolo furado 2 furos", categoria: "Alvenaria", unidade: "m²", rupReferencia: 0.57, custoMaterialMedio: 48, fatorPerda: 1.15, categoriaProfissional: "pedreiro" },
  { id: "A007", nome: "Verga e contraverga moldada", categoria: "Alvenaria", unidade: "m", rupReferencia: 0.35, custoMaterialMedio: 22, fatorPerda: 1.10, categoriaProfissional: "armador" },

  // RI — REVESTIMENTO INTERNO
  { id: "RI001", nome: "Chapisco (rolo)", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.15, custoMaterialMedio: 8, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI002", nome: "Chapisco convencional", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.15, custoMaterialMedio: 7, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI003", nome: "Emboço interno", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.50, custoMaterialMedio: 15, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI004", nome: "Reboco interno", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.55, custoMaterialMedio: 18, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI005", nome: "Massa única interna", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.64, custoMaterialMedio: 22, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI006", nome: "Gesso liso parede", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.30, custoMaterialMedio: 16, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI007", nome: "Gesso liso teto", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.44, custoMaterialMedio: 18, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RI008", nome: "Forro de gesso acartonado", categoria: "Revestimento Interno", unidade: "m²", rupReferencia: 0.55, custoMaterialMedio: 45, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },

  // RE — REVESTIMENTO EXTERNO
  { id: "RE001", nome: "Chapisco externo", categoria: "Revestimento Externo", unidade: "m²", rupReferencia: 0.18, custoMaterialMedio: 9, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RE002", nome: "Emboço externo taliscado", categoria: "Revestimento Externo", unidade: "m²", rupReferencia: 0.70, custoMaterialMedio: 22, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "RE003", nome: "Textura acrílica (rolo)", categoria: "Revestimento Externo", unidade: "m²", rupReferencia: 0.20, custoMaterialMedio: 18, fatorPerda: 1.10, categoriaProfissional: "pintor" },
  { id: "RE004", nome: "Pastilha cerâmica 5x5cm", categoria: "Revestimento Externo", unidade: "m²", rupReferencia: 2.67, custoMaterialMedio: 95, fatorPerda: 1.15, categoriaProfissional: "azulejista" },
  { id: "RE005", nome: "Revestimento cerâmico externo", categoria: "Revestimento Externo", unidade: "m²", rupReferencia: 1.78, custoMaterialMedio: 80, fatorPerda: 1.15, categoriaProfissional: "azulejista" },

  // PI — PISOS
  { id: "PI001", nome: "Contrapiso desempenado", categoria: "Pisos", unidade: "m²", rupReferencia: 0.44, custoMaterialMedio: 25, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "PI002", nome: "Contrapiso sarrafeado", categoria: "Pisos", unidade: "m²", rupReferencia: 0.35, custoMaterialMedio: 22, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "PI003", nome: "Piso cerâmico até 60x60cm", categoria: "Pisos", unidade: "m²", rupReferencia: 0.89, custoMaterialMedio: 65, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PI004", nome: "Piso porcelanato 60x60cm", categoria: "Pisos", unidade: "m²", rupReferencia: 1.07, custoMaterialMedio: 95, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PI005", nome: "Piso porcelanato 90x90cm+", categoria: "Pisos", unidade: "m²", rupReferencia: 1.45, custoMaterialMedio: 140, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PI006", nome: "Piso vinílico (régua)", categoria: "Pisos", unidade: "m²", rupReferencia: 0.35, custoMaterialMedio: 110, fatorPerda: 1.05, categoriaProfissional: "meio-oficial" },
  { id: "PI007", nome: "Rodapé cerâmico", categoria: "Pisos", unidade: "m", rupReferencia: 0.28, custoMaterialMedio: 12, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PI008", nome: "Regularização com argamassa", categoria: "Pisos", unidade: "m²", rupReferencia: 0.30, custoMaterialMedio: 12, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },

  // PC — PAREDE CERÂMICA
  { id: "PC001", nome: "Azulejo até 30x30cm", categoria: "Parede Cerâmica", unidade: "m²", rupReferencia: 1.07, custoMaterialMedio: 55, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PC002", nome: "Cerâmica parede 45x45cm", categoria: "Parede Cerâmica", unidade: "m²", rupReferencia: 1.23, custoMaterialMedio: 70, fatorPerda: 1.10, categoriaProfissional: "azulejista" },
  { id: "PC003", nome: "Porcelanato parede 60x120cm", categoria: "Parede Cerâmica", unidade: "m²", rupReferencia: 1.60, custoMaterialMedio: 140, fatorPerda: 1.15, categoriaProfissional: "azulejista" },

  // IM — IMPERMEABILIZAÇÃO
  { id: "IM001", nome: "Manta asfáltica", categoria: "Impermeabilização", unidade: "m²", rupReferencia: 0.55, custoMaterialMedio: 35, fatorPerda: 1.15, categoriaProfissional: "pedreiro" },
  { id: "IM002", nome: "Cristalizante", categoria: "Impermeabilização", unidade: "m²", rupReferencia: 0.25, custoMaterialMedio: 28, fatorPerda: 1.05, categoriaProfissional: "pedreiro" },
  { id: "IM003", nome: "Argamassa polimérica", categoria: "Impermeabilização", unidade: "m²", rupReferencia: 0.30, custoMaterialMedio: 25, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },

  // CB — COBERTURA
  { id: "CB001", nome: "Estrutura de madeira (tesoura)", categoria: "Cobertura", unidade: "m²", rupReferencia: 0.80, custoMaterialMedio: 75, fatorPerda: 1.10, categoriaProfissional: "carpinteiro" },
  { id: "CB002", nome: "Telha cerâmica", categoria: "Cobertura", unidade: "m²", rupReferencia: 0.55, custoMaterialMedio: 35, fatorPerda: 1.15, categoriaProfissional: "pedreiro" },
  { id: "CB003", nome: "Telha fibrocimento ondulada", categoria: "Cobertura", unidade: "m²", rupReferencia: 0.30, custoMaterialMedio: 28, fatorPerda: 1.10, categoriaProfissional: "pedreiro" },
  { id: "CB004", nome: "Calha e rufo alumínio", categoria: "Cobertura", unidade: "m", rupReferencia: 0.35, custoMaterialMedio: 32, fatorPerda: 1.05, categoriaProfissional: "encanador" },

  // PT — PINTURA
  { id: "PT001", nome: "Selador + massa PVA (2 demãos)", categoria: "Pintura", unidade: "m²", rupReferencia: 0.20, custoMaterialMedio: 10, fatorPerda: 1.10, categoriaProfissional: "pintor" },
  { id: "PT002", nome: "Pintura PVA (2 demãos)", categoria: "Pintura", unidade: "m²", rupReferencia: 0.25, custoMaterialMedio: 9, fatorPerda: 1.10, categoriaProfissional: "pintor" },
  { id: "PT003", nome: "Pintura látex acrílica (2 demãos)", categoria: "Pintura", unidade: "m²", rupReferencia: 0.30, custoMaterialMedio: 12, fatorPerda: 1.10, categoriaProfissional: "pintor" },
  { id: "PT004", nome: "Pintura esmalte (2 demãos)", categoria: "Pintura", unidade: "m²", rupReferencia: 0.40, custoMaterialMedio: 18, fatorPerda: 1.10, categoriaProfissional: "pintor" },
  { id: "PT005", nome: "Pintura epóxi (piso industrial)", categoria: "Pintura", unidade: "m²", rupReferencia: 0.35, custoMaterialMedio: 45, fatorPerda: 1.05, categoriaProfissional: "pintor" },

  // HI — INSTALAÇÕES HIDROSSANITÁRIAS
  { id: "HI001", nome: "Tubulação PVC esgoto (ramal)", categoria: "Inst. Hidrossanitárias", unidade: "m", rupReferencia: 0.55, custoMaterialMedio: 18, fatorPerda: 1.10, categoriaProfissional: "encanador" },
  { id: "HI002", nome: "Tubulação PVC água fria (embutida)", categoria: "Inst. Hidrossanitárias", unidade: "m", rupReferencia: 0.64, custoMaterialMedio: 14, fatorPerda: 1.10, categoriaProfissional: "encanador" },
  { id: "HI003", nome: "Conjunto sanitário (bacia + lavatório)", categoria: "Inst. Hidrossanitárias", unidade: "un", rupReferencia: 4.50, custoMaterialMedio: 700, fatorPerda: 1.05, categoriaProfissional: "encanador" },
  { id: "HI004", nome: "Metais torneiras e registros", categoria: "Inst. Hidrossanitárias", unidade: "un", rupReferencia: 1.23, custoMaterialMedio: 95, fatorPerda: 1.05, categoriaProfissional: "encanador" },

  // EL — INSTALAÇÕES ELÉTRICAS
  { id: "EL001", nome: "Eletroduto embutido", categoria: "Inst. Elétricas", unidade: "m", rupReferencia: 0.50, custoMaterialMedio: 8, fatorPerda: 1.10, categoriaProfissional: "eletricista" },
  { id: "EL002", nome: "Passagem de fio (fiação)", categoria: "Inst. Elétricas", unidade: "m", rupReferencia: 0.15, custoMaterialMedio: 5, fatorPerda: 1.10, categoriaProfissional: "eletricista" },
  { id: "EL003", nome: "Ponto de tomada / interruptor", categoria: "Inst. Elétricas", unidade: "un", rupReferencia: 1.45, custoMaterialMedio: 38, fatorPerda: 1.05, categoriaProfissional: "eletricista" },
  { id: "EL004", nome: "Ponto de iluminação", categoria: "Inst. Elétricas", unidade: "un", rupReferencia: 1.78, custoMaterialMedio: 52, fatorPerda: 1.05, categoriaProfissional: "eletricista" },

  // SF — SERVIÇOS FINAIS
  { id: "SF001", nome: "Limpeza fina de obra", categoria: "Serviços Finais", unidade: "m²", rupReferencia: 0.15, custoMaterialMedio: 1.1, fatorPerda: 1.00, categoriaProfissional: "servente" },
  { id: "SF002", nome: "Limpeza grossa (entulho)", categoria: "Serviços Finais", unidade: "m²", rupReferencia: 0.20, custoMaterialMedio: 3, fatorPerda: 1.00, categoriaProfissional: "servente" },
  { id: "SF003", nome: "Rejuntamento (piso e parede)", categoria: "Serviços Finais", unidade: "m²", rupReferencia: 0.35, custoMaterialMedio: 8, fatorPerda: 1.15, categoriaProfissional: "azulejista" },
  { id: "SF004", nome: "Silicone (arremate geral)", categoria: "Serviços Finais", unidade: "m", rupReferencia: 0.20, custoMaterialMedio: 6, fatorPerda: 1.10, categoriaProfissional: "meio-oficial" },
];

export function buscarAtividade(id: string): AtividadeCusto | undefined {
  return ATIVIDADES.find((a) => a.id === id);
}

export function listarCategorias(): string[] {
  return Array.from(new Set(ATIVIDADES.map((a) => a.categoria)));
}

export function atividadesPorCategoria(categoria: string): AtividadeCusto[] {
  return ATIVIDADES.filter((a) => a.categoria === categoria);
}
