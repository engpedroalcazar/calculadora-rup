import type { Metadata } from "next";
import "./orcamento.css";

export const metadata: Metadata = {
  title: "ObraRadar — Calculadora de Orçamento de Obra",
  description:
    "Calcule o custo real da sua obra em menos de 5 minutos: material, mão de obra, BDI e prazo, com SINAPI atualizado e RUP de referência. Para engenheiros, construtores e gestores.",
};

/**
 * Layout aninhado do produto Calculadora de Orçamento.
 *
 * Tudo dentro de /orcamento/* roda envolvido por este wrapper.
 *
 * O atributo data-product="orcamento" é o que ATIVA as
 * redefinições escopadas em orcamento.css (botões dourados,
 * t-label sem linha decorativa) sem afetar páginas do RUP.
 *
 * As fontes Tijolo + Mulish já são carregadas no layout raiz
 * do RUP (src/app/layout.tsx), então este layout não precisa
 * recarregá-las. Mesmo paths /fonts/Tijolo-*.woff2.
 */
export default function OrcamentoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div data-product="orcamento">{children}</div>;
}
