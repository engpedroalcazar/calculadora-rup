export const atividades = [
  // PRELIMINARES
  { id: "P001", nome: "Locação de obra",                         categoria: "Preliminares",                unidade: "m²", rup: 0.15 },
  { id: "P002", nome: "Tapume de madeira",                       categoria: "Preliminares",                unidade: "m²", rup: 0.44 },
  { id: "P003", nome: "Escavação manual de vala",                categoria: "Preliminares",                unidade: "m³", rup: 3.20 },
  { id: "P004", nome: "Aterro compactado manual",                categoria: "Preliminares",                unidade: "m³", rup: 2.00 },
  { id: "P005", nome: "Movimentação e descarte de entulhos",     categoria: "Preliminares",                unidade: "m³", rup: 0.25 },

  // FUNDAÇÕES
  { id: "F001", nome: "Forma de sapata (madeira)",               categoria: "Fundações",                   unidade: "m²", rup: 1.45 },
  { id: "F002", nome: "Armação sapata CA-50",                    categoria: "Fundações",                   unidade: "kg", rup: 0.15 },
  { id: "F003", nome: "Concretagem sapata (bomba)",              categoria: "Fundações",                   unidade: "m³", rup: 1.23 },
  { id: "F004", nome: "Viga baldrame — forma",                   categoria: "Fundações",                   unidade: "m²", rup: 1.60 },
  { id: "F005", nome: "Viga baldrame — armação CA-50",           categoria: "Fundações",                   unidade: "kg", rup: 0.15 },
  { id: "F006", nome: "Viga baldrame — concretagem",             categoria: "Fundações",                   unidade: "m³", rup: 1.45 },

  // ESTRUTURA
  { id: "E001", nome: "Forma de pilar (madeira reaproveitável)", categoria: "Estrutura",                   unidade: "m²", rup: 1.23 },
  { id: "E002", nome: "Forma de viga (madeira reaproveitável)",  categoria: "Estrutura",                   unidade: "m²", rup: 1.45 },
  { id: "E003", nome: "Forma de laje (madeira + escoramento)",   categoria: "Estrutura",                   unidade: "m²", rup: 0.89 },
  { id: "E004", nome: "Armação CA-50 pilares e vigas",           categoria: "Estrutura",                   unidade: "kg", rup: 0.15 },
  { id: "E005", nome: "Armação CA-60 laje nervurada",            categoria: "Estrutura",                   unidade: "kg", rup: 0.15 },
  { id: "E006", nome: "Concretagem pilar (bomba)",               categoria: "Estrutura",                   unidade: "m³", rup: 1.78 },
  { id: "E007", nome: "Concretagem viga (bomba)",                categoria: "Estrutura",                   unidade: "m³", rup: 1.60 },
  { id: "E008", nome: "Concretagem laje (bomba)",                categoria: "Estrutura",                   unidade: "m³", rup: 1.33 },
  { id: "E009", nome: "Desforma (geral)",                        categoria: "Estrutura",                   unidade: "m²", rup: 0.25 },
  { id: "E010", nome: "Laje pré-moldada (assentamento)",         categoria: "Estrutura",                   unidade: "m²", rup: 0.35 },

  // ALVENARIA
  { id: "A001", nome: "Alvenaria bloco cerâmico 9cm",            categoria: "Alvenaria",                   unidade: "m²", rup: 0.67 },
  { id: "A002", nome: "Alvenaria bloco cerâmico 14cm",           categoria: "Alvenaria",                   unidade: "m²", rup: 0.84 },
  { id: "A003", nome: "Alvenaria bloco cerâmico 19cm",           categoria: "Alvenaria",                   unidade: "m²", rup: 1.07 },
  { id: "A004", nome: "Alvenaria bloco concreto 14cm",           categoria: "Alvenaria",                   unidade: "m²", rup: 0.89 },
  { id: "A005", nome: "Alvenaria bloco concreto 19cm",           categoria: "Alvenaria",                   unidade: "m²", rup: 1.14 },
  { id: "A006", nome: "Alvenaria tijolo furado 2 furos",         categoria: "Alvenaria",                   unidade: "m²", rup: 0.57 },
  { id: "A007", nome: "Verga e contraverga moldada",             categoria: "Alvenaria",                   unidade: "m",  rup: 0.35 },

  // REVESTIMENTO INTERNO
  { id: "RI001", nome: "Chapisco (rolo)",                        categoria: "Revestimento Interno",        unidade: "m²", rup: 0.15 },
  { id: "RI002", nome: "Chapisco convencional",                  categoria: "Revestimento Interno",        unidade: "m²", rup: 0.15 },
  { id: "RI003", nome: "Emboço interno",                         categoria: "Revestimento Interno",        unidade: "m²", rup: 0.50 },
  { id: "RI004", nome: "Reboco interno",                         categoria: "Revestimento Interno",        unidade: "m²", rup: 0.55 },
  { id: "RI005", nome: "Massa única interna",                    categoria: "Revestimento Interno",        unidade: "m²", rup: 0.64 },
  { id: "RI006", nome: "Gesso liso — parede",                    categoria: "Revestimento Interno",        unidade: "m²", rup: 0.30 },
  { id: "RI007", nome: "Gesso liso — teto",                      categoria: "Revestimento Interno",        unidade: "m²", rup: 0.44 },
  { id: "RI008", nome: "Forro de gesso acartonado",              categoria: "Revestimento Interno",        unidade: "m²", rup: 0.55 },

  // REVESTIMENTO EXTERNO
  { id: "RE001", nome: "Chapisco externo",                       categoria: "Revestimento Externo",        unidade: "m²", rup: 0.18 },
  { id: "RE002", nome: "Emboço externo taliscado",               categoria: "Revestimento Externo",        unidade: "m²", rup: 0.70 },
  { id: "RE003", nome: "Textura acrílica (rolo)",                categoria: "Revestimento Externo",        unidade: "m²", rup: 0.20 },
  { id: "RE004", nome: "Pastilha cerâmica 5×5cm",                categoria: "Revestimento Externo",        unidade: "m²", rup: 2.67 },
  { id: "RE005", nome: "Revestimento cerâmico externo",          categoria: "Revestimento Externo",        unidade: "m²", rup: 1.78 },

  // PISOS
  { id: "PI001", nome: "Contrapiso desempenado",                 categoria: "Pisos",                       unidade: "m²", rup: 0.44 },
  { id: "PI002", nome: "Contrapiso sarrafeado",                  categoria: "Pisos",                       unidade: "m²", rup: 0.35 },
  { id: "PI003", nome: "Piso cerâmico até 60×60cm",             categoria: "Pisos",                       unidade: "m²", rup: 0.89 },
  { id: "PI004", nome: "Piso porcelanato 60×60cm",               categoria: "Pisos",                       unidade: "m²", rup: 1.07 },
  { id: "PI005", nome: "Piso porcelanato 90×90cm+",              categoria: "Pisos",                       unidade: "m²", rup: 1.45 },
  { id: "PI006", nome: "Piso vinílico (régua)",                  categoria: "Pisos",                       unidade: "m²", rup: 0.35 },
  { id: "PI007", nome: "Rodapé cerâmico",                        categoria: "Pisos",                       unidade: "m",  rup: 0.28 },
  { id: "PI008", nome: "Regularização com argamassa",            categoria: "Pisos",                       unidade: "m²", rup: 0.30 },

  // PAREDE CERÂMICA
  { id: "PC001", nome: "Azulejo até 30×30cm",                   categoria: "Parede Cerâmica",             unidade: "m²", rup: 1.07 },
  { id: "PC002", nome: "Cerâmica parede 45×45cm",               categoria: "Parede Cerâmica",             unidade: "m²", rup: 1.23 },
  { id: "PC003", nome: "Porcelanato parede 60×120cm",           categoria: "Parede Cerâmica",             unidade: "m²", rup: 1.60 },

  // IMPERMEABILIZAÇÃO
  { id: "IM001", nome: "Manta asfáltica",                        categoria: "Impermeabilização",           unidade: "m²", rup: 0.55 },
  { id: "IM002", nome: "Cristalizante",                          categoria: "Impermeabilização",           unidade: "m²", rup: 0.25 },
  { id: "IM003", nome: "Argamassa polimérica",                   categoria: "Impermeabilização",           unidade: "m²", rup: 0.30 },

  // COBERTURA
  { id: "CB001", nome: "Estrutura de madeira (tesoura)",         categoria: "Cobertura",                   unidade: "m²", rup: 0.80 },
  { id: "CB002", nome: "Telha cerâmica",                         categoria: "Cobertura",                   unidade: "m²", rup: 0.55 },
  { id: "CB003", nome: "Telha fibrocimento ondulada",            categoria: "Cobertura",                   unidade: "m²", rup: 0.30 },
  { id: "CB004", nome: "Calha e rufo alumínio",                  categoria: "Cobertura",                   unidade: "m",  rup: 0.35 },

  // PINTURA
  { id: "PT001", nome: "Selador + massa PVA (2 demãos)",         categoria: "Pintura",                     unidade: "m²", rup: 0.20 },
  { id: "PT002", nome: "Pintura PVA (2 demãos)",                 categoria: "Pintura",                     unidade: "m²", rup: 0.25 },
  { id: "PT003", nome: "Pintura látex acrílica (2 demãos)",      categoria: "Pintura",                     unidade: "m²", rup: 0.30 },
  { id: "PT004", nome: "Pintura esmalte (2 demãos)",             categoria: "Pintura",                     unidade: "m²", rup: 0.40 },
  { id: "PT005", nome: "Pintura epóxi (piso industrial)",        categoria: "Pintura",                     unidade: "m²", rup: 0.35 },

  // INSTALAÇÕES HIDROSSANITÁRIAS
  { id: "HI001", nome: "Tubulação PVC esgoto (ramal)",          categoria: "Inst. Hidrossanitárias",      unidade: "m",  rup: 0.55 },
  { id: "HI002", nome: "Tubulação PVC água fria (embutida)",    categoria: "Inst. Hidrossanitárias",      unidade: "m",  rup: 0.64 },
  { id: "HI003", nome: "Louça sanitária (instalação)",          categoria: "Inst. Hidrossanitárias",      unidade: "un", rup: 2.67 },
  { id: "HI004", nome: "Metais — torneiras e registros",        categoria: "Inst. Hidrossanitárias",      unidade: "un", rup: 1.23 },

  // INSTALAÇÕES ELÉTRICAS
  { id: "EL001", nome: "Eletroduto embutido (roço + fixação)",  categoria: "Inst. Elétricas",             unidade: "m",  rup: 0.50 },
  { id: "EL002", nome: "Passagem de fio (fiação)",              categoria: "Inst. Elétricas",             unidade: "m",  rup: 0.15 },
  { id: "EL003", nome: "Ponto de tomada / interruptor",         categoria: "Inst. Elétricas",             unidade: "un", rup: 1.45 },
  { id: "EL004", nome: "Ponto de iluminação",                   categoria: "Inst. Elétricas",             unidade: "un", rup: 1.78 },

  // SERVIÇOS FINAIS
  { id: "SF001", nome: "Limpeza fina de obra",                   categoria: "Serviços Finais",             unidade: "m²", rup: 0.15 },
  { id: "SF002", nome: "Limpeza grossa (entulho)",               categoria: "Serviços Finais",             unidade: "m²", rup: 0.20 },
  { id: "SF003", nome: "Rejuntamento (piso e parede)",           categoria: "Serviços Finais",             unidade: "m²", rup: 0.35 },
  { id: "SF004", nome: "Silicone (arremate geral)",              categoria: "Serviços Finais",             unidade: "m",  rup: 0.20 },
] as const;

export type AtividadeId = typeof atividades[number]["id"];
export type Categoria   = typeof atividades[number]["categoria"];
export type Severidade  = "NORMAL" | "ATENÇÃO" | "ALERTA" | "CRÍTICO" | "VERIFICAR";

export const categorias = Array.from(
  new Set(atividades.map((a) => a.categoria))
) as Categoria[];

export interface ResultadoRUP {
  hhTotal: number;
  rupReal: number;
  rupRef: number;
  desvio: number;
  severidade: Severidade;
  custoTotal: number | null;
  custoUnitario: number | null;
  perdaHH: number;
  perdaEstimativa: number | null;
}

export interface EntradaCalculo {
  quantidade: number;
  trabalhadores: number;
  horasPorDia: number;
  dias: number;
  custoHora: number | null;
  atividadeId: string;
}

export function calcularRUP(e: EntradaCalculo): ResultadoRUP {
  const atividade = atividades.find((a) => a.id === e.atividadeId);
  const rupRef = atividade?.rup ?? 0;

  const hhTotal = e.trabalhadores * e.horasPorDia * e.dias;
  const rupReal = e.quantidade > 0 ? hhTotal / e.quantidade : 0;
  const desvio = rupRef > 0 ? ((rupReal - rupRef) / rupRef) * 100 : 0;
  const severidade = classificarSeveridade(desvio);

  const custoTotal = e.custoHora != null ? hhTotal * e.custoHora : null;
  const custoUnitario =
    custoTotal != null && e.quantidade > 0 ? custoTotal / e.quantidade : null;
  const perdaHH = Math.max(0, hhTotal - rupRef * e.quantidade);
  const perdaEstimativa = e.custoHora != null ? perdaHH * e.custoHora : null;

  return { hhTotal, rupReal, rupRef, desvio, severidade, custoTotal, custoUnitario, perdaHH, perdaEstimativa };
}

export function classificarSeveridade(desvio: number): Severidade {
  if (desvio < -10) return "VERIFICAR";
  if (desvio <= 10)  return "NORMAL";
  if (desvio <= 20)  return "ATENÇÃO";
  if (desvio <= 30)  return "ALERTA";
  return "CRÍTICO";
}

export function corSeveridade(s: Severidade) {
  const m: Record<Severidade, { badge: string; ring: string; text: string }> = {
    NORMAL:    { badge: "bg-emerald-100 text-emerald-800 border border-emerald-200", ring: "ring-emerald-200", text: "text-emerald-600" },
    ATENÇÃO:   { badge: "bg-yellow-100  text-yellow-800  border border-yellow-200",  ring: "ring-yellow-200",  text: "text-yellow-600"  },
    VERIFICAR: { badge: "bg-blue-100    text-blue-800    border border-blue-200",    ring: "ring-blue-200",    text: "text-blue-600"    },
    ALERTA:    { badge: "bg-orange-100  text-orange-800  border border-orange-200",  ring: "ring-orange-200",  text: "text-orange-600"  },
    CRÍTICO:   { badge: "bg-red-100     text-red-800     border border-red-200",     ring: "ring-red-200",     text: "text-red-600"     },
  };
  return m[s];
}

export function fmt(v: number, casas = 2) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

export function moeda(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
