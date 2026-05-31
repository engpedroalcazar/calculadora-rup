// Catálogo de insumos da Calculadora de Orçamento.
// Fonte de verdade dos materiais usados na decomposição das 76 atividades.
// Preços calibrados pela base SINAPI nacional (referência jun/2026).
// O `codigo` é a chave estável usada em src/data/atividade-insumos.ts e no seed do Prisma.

export type Insumo = {
  codigo: string;
  descricao: string;
  unidade: string;
  custoUnitarioMedio: number;
  codigoSinapi?: string;
  fonte: string;
};

const FONTE_PADRAO = "SINAPI nacional 06/2026";

export const INSUMOS: Insumo[] = [
  // ───── Aglomerantes e granulados ─────
  { codigo: "cimento-cp2-sc50kg", descricao: "Cimento Portland CP-II 32, saco 50kg", unidade: "sc", custoUnitarioMedio: 38, fonte: FONTE_PADRAO },
  { codigo: "cal-hidratada-sc20kg", descricao: "Cal hidratada CH-I, saco 20kg", unidade: "sc", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "areia-media-lavada-m3", descricao: "Areia média lavada, posta na obra", unidade: "m³", custoUnitarioMedio: 95, fonte: FONTE_PADRAO },
  { codigo: "brita-1-m3", descricao: "Brita nº 1 (≈19mm)", unidade: "m³", custoUnitarioMedio: 115, fonte: FONTE_PADRAO },
  { codigo: "agua-m3", descricao: "Água de amassamento", unidade: "m³", custoUnitarioMedio: 12, fonte: FONTE_PADRAO },

  // ───── Concretos usinados ─────
  { codigo: "concreto-usinado-fck25-m3", descricao: "Concreto usinado bombeado fck 25 MPa", unidade: "m³", custoUnitarioMedio: 490, fonte: FONTE_PADRAO },
  { codigo: "concreto-usinado-fck30-m3", descricao: "Concreto usinado bombeado fck 30 MPa", unidade: "m³", custoUnitarioMedio: 520, fonte: FONTE_PADRAO },
  { codigo: "bomba-concreto-hora", descricao: "Locação de bomba de concreto (hora)", unidade: "h", custoUnitarioMedio: 250, fonte: FONTE_PADRAO },

  // ───── Argamassas industrializadas ─────
  { codigo: "argamassa-assentamento-sc20kg", descricao: "Argamassa assentamento alvenaria, saco 20kg", unidade: "sc", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "argamassa-reboco-sc20kg", descricao: "Argamassa reboco/emboço, saco 20kg", unidade: "sc", custoUnitarioMedio: 16, fonte: FONTE_PADRAO },
  { codigo: "argamassa-colante-ac2-sc20kg", descricao: "Argamassa colante AC-II, saco 20kg", unidade: "sc", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "argamassa-colante-ac3-sc20kg", descricao: "Argamassa colante AC-III, saco 20kg", unidade: "sc", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "argamassa-polimerica-sc18kg", descricao: "Argamassa polimérica impermeabilizante, saco 18kg", unidade: "sc", custoUnitarioMedio: 32, fonte: FONTE_PADRAO },
  { codigo: "rejunte-acabamento-kg", descricao: "Rejunte flexível para piso/parede", unidade: "kg", custoUnitarioMedio: 12, fonte: FONTE_PADRAO },

  // ───── Aço e armaduras ─────
  { codigo: "aco-ca50-kg", descricao: "Aço CA-50 (barra nervurada)", unidade: "kg", custoUnitarioMedio: 8.2, fonte: FONTE_PADRAO },
  { codigo: "aco-ca60-kg", descricao: "Aço CA-60 (fio)", unidade: "kg", custoUnitarioMedio: 10, fonte: FONTE_PADRAO },
  { codigo: "arame-recozido-18-kg", descricao: "Arame recozido nº 18 (amarração)", unidade: "kg", custoUnitarioMedio: 14, fonte: FONTE_PADRAO },
  { codigo: "espacador-plastico-un", descricao: "Espaçador plástico para armadura", unidade: "un", custoUnitarioMedio: 0.18, fonte: FONTE_PADRAO },

  // ───── Madeiras de forma ─────
  { codigo: "tabua-pinus-3a-m2", descricao: "Tábua de pinus 2,5×30cm (forma)", unidade: "m²", custoUnitarioMedio: 38, fonte: FONTE_PADRAO },
  { codigo: "pontalete-pinus-7-7-m", descricao: "Pontalete pinus 7×7cm", unidade: "m", custoUnitarioMedio: 7, fonte: FONTE_PADRAO },
  { codigo: "prego-comum-kg", descricao: "Prego comum 17×27", unidade: "kg", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "desmoldante-l", descricao: "Desmoldante para forma de madeira", unidade: "l", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },

  // ───── Tapume / locação ─────
  { codigo: "chapa-compensado-resinado-10mm-m2", descricao: "Chapa compensado resinado 10mm", unidade: "m²", custoUnitarioMedio: 42, fonte: FONTE_PADRAO },
  { codigo: "estaca-madeira-locacao-un", descricao: "Estaca de madeira p/ locação", unidade: "un", custoUnitarioMedio: 4.5, fonte: FONTE_PADRAO },
  { codigo: "linha-nylon-locacao-m", descricao: "Linha de nylon p/ gabarito", unidade: "m", custoUnitarioMedio: 0.3, fonte: FONTE_PADRAO },

  // ───── Entulho / movimentação ─────
  { codigo: "cacamba-entulho-5m3", descricao: "Locação caçamba estacionária 5m³ (1 troca)", unidade: "un", custoUnitarioMedio: 380, fonte: FONTE_PADRAO },

  // ───── Alvenaria ─────
  { codigo: "bloco-ceramico-9cm-un", descricao: "Bloco cerâmico vedação 9×19×19cm", unidade: "un", custoUnitarioMedio: 1.8, fonte: FONTE_PADRAO },
  { codigo: "bloco-ceramico-14cm-un", descricao: "Bloco cerâmico vedação 14×19×29cm", unidade: "un", custoUnitarioMedio: 3.2, fonte: FONTE_PADRAO },
  { codigo: "bloco-ceramico-19cm-un", descricao: "Bloco cerâmico vedação 19×19×29cm", unidade: "un", custoUnitarioMedio: 4.6, fonte: FONTE_PADRAO },
  { codigo: "bloco-concreto-14cm-un", descricao: "Bloco concreto vedação 14×19×39cm", unidade: "un", custoUnitarioMedio: 4.2, fonte: FONTE_PADRAO },
  { codigo: "bloco-concreto-19cm-un", descricao: "Bloco concreto estrutural 19×19×39cm", unidade: "un", custoUnitarioMedio: 5.8, fonte: FONTE_PADRAO },
  { codigo: "tijolo-2furos-un", descricao: "Tijolo cerâmico 2 furos 9×14×19cm", unidade: "un", custoUnitarioMedio: 1.15, fonte: FONTE_PADRAO },

  // ───── Laje pré-moldada ─────
  { codigo: "vigota-trelicada-h12-m", descricao: "Vigota treliçada pré-fabricada h=12cm", unidade: "m", custoUnitarioMedio: 32, fonte: FONTE_PADRAO },
  { codigo: "tavela-eps-un", descricao: "Tavela EPS p/ enchimento de laje (30×40cm)", unidade: "un", custoUnitarioMedio: 5, fonte: FONTE_PADRAO },

  // ───── Revestimento cerâmico ─────
  { codigo: "ceramica-piso-60x60-m2", descricao: "Cerâmica esmaltada 60×60cm padrão médio", unidade: "m²", custoUnitarioMedio: 52, fonte: FONTE_PADRAO },
  { codigo: "porcelanato-60x60-m2", descricao: "Porcelanato 60×60cm padrão médio", unidade: "m²", custoUnitarioMedio: 78, fonte: FONTE_PADRAO },
  { codigo: "porcelanato-90x90-m2", descricao: "Porcelanato 90×90cm ou maior", unidade: "m²", custoUnitarioMedio: 120, fonte: FONTE_PADRAO },
  { codigo: "ceramica-parede-30x30-m2", descricao: "Azulejo cerâmico 30×30cm", unidade: "m²", custoUnitarioMedio: 42, fonte: FONTE_PADRAO },
  { codigo: "ceramica-parede-45x45-m2", descricao: "Cerâmica parede 45×45cm", unidade: "m²", custoUnitarioMedio: 58, fonte: FONTE_PADRAO },
  { codigo: "porcelanato-parede-60x120-m2", descricao: "Porcelanato parede 60×120cm", unidade: "m²", custoUnitarioMedio: 125, fonte: FONTE_PADRAO },
  { codigo: "pastilha-5x5-m2", descricao: "Pastilha cerâmica 5×5cm em placa", unidade: "m²", custoUnitarioMedio: 78, fonte: FONTE_PADRAO },
  { codigo: "ceramica-externa-m2", descricao: "Cerâmica externa antiderrapante", unidade: "m²", custoUnitarioMedio: 65, fonte: FONTE_PADRAO },
  { codigo: "rodape-ceramico-m", descricao: "Rodapé cerâmico h=7cm", unidade: "m", custoUnitarioMedio: 9, fonte: FONTE_PADRAO },

  // ───── Piso vinílico ─────
  { codigo: "piso-vinilico-regua-m2", descricao: "Piso vinílico em régua espessura 3mm", unidade: "m²", custoUnitarioMedio: 95, fonte: FONTE_PADRAO },
  { codigo: "cola-piso-vinilico-l", descricao: "Cola acrílica para piso vinílico", unidade: "l", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "manta-acustica-vinilico-m2", descricao: "Manta acústica sob piso vinílico", unidade: "m²", custoUnitarioMedio: 14, fonte: FONTE_PADRAO },

  // ───── Gesso ─────
  { codigo: "gesso-pasta-sc40kg", descricao: "Pasta de gesso comum saco 40kg", unidade: "sc", custoUnitarioMedio: 25, fonte: FONTE_PADRAO },
  { codigo: "placa-gesso-acartonado-st-m2", descricao: "Placa gesso acartonado ST 12,5mm", unidade: "m²", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "perfil-metalico-gesso-m", descricao: "Perfil metálico guia/montante p/ drywall", unidade: "m", custoUnitarioMedio: 7, fonte: FONTE_PADRAO },
  { codigo: "parafuso-drywall-kg", descricao: "Parafuso drywall ponta agulha", unidade: "kg", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "fita-papel-drywall-m", descricao: "Fita papel microperfurada drywall", unidade: "m", custoUnitarioMedio: 0.6, fonte: FONTE_PADRAO },
  { codigo: "massa-rejunte-drywall-kg", descricao: "Massa rejunte drywall", unidade: "kg", custoUnitarioMedio: 9, fonte: FONTE_PADRAO },

  // ───── Cobertura ─────
  { codigo: "telha-ceramica-portuguesa-un", descricao: "Telha cerâmica portuguesa", unidade: "un", custoUnitarioMedio: 2.1, fonte: FONTE_PADRAO },
  { codigo: "telha-fibrocimento-ondulada-m2", descricao: "Telha fibrocimento ondulada 6mm", unidade: "m²", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "madeira-tesoura-cobertura-m", descricao: "Estrutura madeira p/ tesoura (peças)", unidade: "m", custoUnitarioMedio: 32, fonte: FONTE_PADRAO },
  { codigo: "madeira-ripa-cobertura-m", descricao: "Ripa pinus 2,5×5cm", unidade: "m", custoUnitarioMedio: 5, fonte: FONTE_PADRAO },
  { codigo: "madeira-caibro-cobertura-m", descricao: "Caibro pinus 5×6cm", unidade: "m", custoUnitarioMedio: 8, fonte: FONTE_PADRAO },
  { codigo: "calha-aluminio-m", descricao: "Calha de alumínio + rufo", unidade: "m", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "rufo-aluminio-m", descricao: "Rufo de alumínio dobrado", unidade: "m", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },

  // ───── Impermeabilização ─────
  { codigo: "manta-asfaltica-3mm-m2", descricao: "Manta asfáltica 3mm com filme polietileno", unidade: "m²", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "primer-asfaltico-l", descricao: "Primer asfáltico", unidade: "l", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "cristalizante-l", descricao: "Impermeabilizante cristalizante", unidade: "l", custoUnitarioMedio: 35, fonte: FONTE_PADRAO },

  // ───── Pintura ─────
  { codigo: "selador-acrilico-l", descricao: "Selador acrílico interno", unidade: "l", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "massa-pva-balde-25kg", descricao: "Massa corrida PVA balde 25kg", unidade: "balde", custoUnitarioMedio: 95, fonte: FONTE_PADRAO },
  { codigo: "tinta-pva-l", descricao: "Tinta PVA látex econômica", unidade: "l", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "tinta-acrilica-premium-l", descricao: "Tinta acrílica premium fosca", unidade: "l", custoUnitarioMedio: 28, fonte: FONTE_PADRAO },
  { codigo: "tinta-esmalte-l", descricao: "Tinta esmalte sintético", unidade: "l", custoUnitarioMedio: 38, fonte: FONTE_PADRAO },
  { codigo: "tinta-epoxi-kit-3kg", descricao: "Tinta epóxi bicomponente kit 3kg", unidade: "kit", custoUnitarioMedio: 220, fonte: FONTE_PADRAO },
  { codigo: "textura-acrilica-balde-25kg", descricao: "Textura acrílica balde 25kg", unidade: "balde", custoUnitarioMedio: 195, fonte: FONTE_PADRAO },
  { codigo: "lixa-folha", descricao: "Lixa folha grão 120/180", unidade: "un", custoUnitarioMedio: 4, fonte: FONTE_PADRAO },
  { codigo: "fita-crepe-rolo", descricao: "Fita crepe 24mm rolo 50m", unidade: "un", custoUnitarioMedio: 12, fonte: FONTE_PADRAO },

  // ───── Hidráulica ─────
  { codigo: "tubo-pvc-esgoto-100mm-m", descricao: "Tubo PVC esgoto Ø100mm", unidade: "m", custoUnitarioMedio: 24, fonte: FONTE_PADRAO },
  { codigo: "tubo-pvc-esgoto-50mm-m", descricao: "Tubo PVC esgoto Ø50mm", unidade: "m", custoUnitarioMedio: 12, fonte: FONTE_PADRAO },
  { codigo: "tubo-pvc-soldavel-25mm-m", descricao: "Tubo PVC soldável água fria Ø25mm", unidade: "m", custoUnitarioMedio: 7, fonte: FONTE_PADRAO },
  { codigo: "conexao-pvc-esgoto-un", descricao: "Conexão PVC esgoto (joelho/tê) média", unidade: "un", custoUnitarioMedio: 8, fonte: FONTE_PADRAO },
  { codigo: "conexao-pvc-soldavel-un", descricao: "Conexão PVC soldável água fria média", unidade: "un", custoUnitarioMedio: 4, fonte: FONTE_PADRAO },
  { codigo: "cola-pvc-bisn", descricao: "Cola PVC bisnaga 75g", unidade: "un", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "fita-veda-rosca-un", descricao: "Fita veda-rosca rolo 18m", unidade: "un", custoUnitarioMedio: 4, fonte: FONTE_PADRAO },
  { codigo: "bacia-sanitaria-caixa-un", descricao: "Bacia sanitária com caixa acoplada", unidade: "un", custoUnitarioMedio: 320, fonte: FONTE_PADRAO },
  { codigo: "lavatorio-coluna-un", descricao: "Lavatório de louça com coluna", unidade: "un", custoUnitarioMedio: 280, fonte: FONTE_PADRAO },
  { codigo: "torneira-cozinha-un", descricao: "Torneira cozinha de bancada", unidade: "un", custoUnitarioMedio: 95, fonte: FONTE_PADRAO },
  { codigo: "registro-gaveta-un", descricao: "Registro gaveta bruto 3/4\"", unidade: "un", custoUnitarioMedio: 48, fonte: FONTE_PADRAO },
  { codigo: "engate-flexivel-un", descricao: "Engate flexível inox 40cm", unidade: "un", custoUnitarioMedio: 12, fonte: FONTE_PADRAO },

  // ───── Elétrica ─────
  { codigo: "eletroduto-corrugado-25mm-m", descricao: "Eletroduto corrugado PEAD Ø25mm", unidade: "m", custoUnitarioMedio: 3, fonte: FONTE_PADRAO },
  { codigo: "fio-2-5mm2-m", descricao: "Fio cobre flexível 2,5mm²", unidade: "m", custoUnitarioMedio: 3.2, fonte: FONTE_PADRAO },
  { codigo: "caixa-octogonal-un", descricao: "Caixa octogonal PVC para teto", unidade: "un", custoUnitarioMedio: 6, fonte: FONTE_PADRAO },
  { codigo: "caixa-4x2-un", descricao: "Caixa retangular PVC 4×2 parede", unidade: "un", custoUnitarioMedio: 5, fonte: FONTE_PADRAO },
  { codigo: "tomada-2p-t-completa-un", descricao: "Tomada 2P+T 10A com placa", unidade: "un", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },
  { codigo: "interruptor-1t-completo-un", descricao: "Interruptor 1 tecla com placa", unidade: "un", custoUnitarioMedio: 16, fonte: FONTE_PADRAO },
  { codigo: "plafon-soquete-un", descricao: "Plafon LED soquete E27", unidade: "un", custoUnitarioMedio: 22, fonte: FONTE_PADRAO },
  { codigo: "lampada-led-bulbo-un", descricao: "Lâmpada LED bulbo 9W E27", unidade: "un", custoUnitarioMedio: 14, fonte: FONTE_PADRAO },

  // ───── Acabamento / arremate ─────
  { codigo: "silicone-neutro-un", descricao: "Silicone neutro 280ml", unidade: "un", custoUnitarioMedio: 18, fonte: FONTE_PADRAO },

  // ───── Limpeza ─────
  { codigo: "detergente-l", descricao: "Detergente neutro profissional", unidade: "l", custoUnitarioMedio: 8, fonte: FONTE_PADRAO },
  { codigo: "desincrustante-l", descricao: "Desincrustante ácido", unidade: "l", custoUnitarioMedio: 14, fonte: FONTE_PADRAO },
];

export function buscarInsumo(codigo: string): Insumo | undefined {
  return INSUMOS.find((i) => i.codigo === codigo);
}
