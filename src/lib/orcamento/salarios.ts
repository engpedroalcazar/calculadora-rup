import { ENCARGOS_SOCIAIS_MULTIPLICADOR, JORNADA_MENSAL_HORAS } from "./encargos";

export type CategoriaProfissional =
  | "servente"
  | "meio-oficial"
  | "pedreiro"
  | "carpinteiro"
  | "armador"
  | "eletricista"
  | "encanador"
  | "pintor"
  | "azulejista";

// Salário base nacional (jun/2026) — média de convenções coletivas dos sindicatos da construção civil.
// Valor mensal CLT, sem encargos.
const SALARIO_BASE_NACIONAL: Record<CategoriaProfissional, number> = {
  servente: 1700,
  "meio-oficial": 2100,
  pedreiro: 2700,
  carpinteiro: 2800,
  armador: 2800,
  eletricista: 3100,
  encanador: 2900,
  pintor: 2600,
  azulejista: 2900,
};

// Fator regional sobre o salário-base nacional (1.00 = média Brasil).
// Calibrado por CUB regional e convenções estaduais de sindicato.
const FATOR_REGIONAL: Record<string, number> = {
  SP: 1.20, RJ: 1.18, DF: 1.20,
  PR: 1.05, SC: 1.07, RS: 1.05,
  MG: 1.02, ES: 1.00,
  GO: 0.95, MT: 0.95, MS: 0.95,
  BA: 0.90, PE: 0.88, CE: 0.88, RN: 0.85, PB: 0.85, AL: 0.83, SE: 0.85, MA: 0.82, PI: 0.80,
  PA: 0.92, AM: 0.95, AC: 0.90, RO: 0.92, RR: 0.95, AP: 0.92, TO: 0.88,
};

const UFS_VALIDAS = Object.keys(FATOR_REGIONAL);

export function isUfValida(uf: string): boolean {
  return UFS_VALIDAS.includes(uf.toUpperCase());
}

export function listarUfs(): string[] {
  return [...UFS_VALIDAS].sort();
}

// Retorna o custo TOTAL hora-homem (HH) já com encargos sociais, na região informada.
// Esse é o valor que multiplica HH Total na fórmula de custo de mão de obra.
export function custoHoraHomem(
  categoria: CategoriaProfissional,
  uf: string
): number {
  const ufNormalizada = uf.toUpperCase();
  const fator = FATOR_REGIONAL[ufNormalizada] ?? 1.0;
  const salarioMensal = SALARIO_BASE_NACIONAL[categoria] * fator;
  const custoHora = salarioMensal / JORNADA_MENSAL_HORAS;
  return custoHora * ENCARGOS_SOCIAIS_MULTIPLICADOR;
}
