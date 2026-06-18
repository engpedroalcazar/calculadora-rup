import Link from "next/link";
import Image from "next/image";

type ItemLink = {
  label: string;
  href: string;
  emBreve?: boolean;
  externo?: boolean;
};

const PRODUTO: ItemLink[] = [
  { label: "Calcular orçamento", href: "/orcamento/orcar" },
  { label: "Demo do motor", href: "/orcamento/demo" },
  { label: "Base técnica", href: "/orcamento#base-tecnica" },
  { label: "Preço", href: "#", emBreve: true },
];

const EMPRESA: ItemLink[] = [
  { label: "Sobre", href: "https://alcazarengenharia.com/", externo: true },
  { label: "Contato", href: "mailto:eng.pedroalcazar@gmail.com" },
  { label: "Suporte", href: "/orcamento/suporte" },
  { label: "FAQ", href: "/orcamento/faq" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--navy-line)] bg-navy-900">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Coluna 1 — marca + descrição */}
          <div>
            <Link href="/orcamento" className="inline-flex items-center gap-3">
              <Image
                src="/logos/orcamento/obraradar-icon.jpg"
                alt="ObraRadar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div>
                <p className="display text-base leading-none text-cream-50">
                  OBRA RADAR
                </p>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-gold-500">
                  CALCULADORA DE ORÇAMENTO
                </p>
              </div>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[var(--fg-on-dark-muted)]">
              Cálculo de orçamento de obra com material SINAPI, mão de obra
              regional e BDI configurável — pra engenheiros e construtores
              que decidem com número.
            </p>
          </div>

          {/* Coluna 2 — PRODUTO */}
          <div>
            <p className="t-label" style={{ letterSpacing: "0.2em" }}>
              Produto
            </p>
            <ul className="mt-5 space-y-3">
              {PRODUTO.map((item) => (
                <li key={item.label}>
                  {item.emBreve ? (
                    <span className="text-sm text-[var(--fg-on-dark-muted)]/60">
                      {item.label}{" "}
                      <span className="ml-1 text-[10px] uppercase tracking-wider text-gold-500/70">
                        em breve
                      </span>
                    </span>
                  ) : item.externo ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--fg-on-dark)] transition-colors hover:text-gold-500"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--fg-on-dark)] transition-colors hover:text-gold-500"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — EMPRESA */}
          <div>
            <p className="t-label" style={{ letterSpacing: "0.2em" }}>
              Empresa
            </p>
            <ul className="mt-5 space-y-3">
              {EMPRESA.map((item) => (
                <li key={item.label}>
                  {item.emBreve ? (
                    <span className="text-sm text-[var(--fg-on-dark-muted)]/60">
                      {item.label}{" "}
                      <span className="ml-1 text-[10px] uppercase tracking-wider text-gold-500/70">
                        em breve
                      </span>
                    </span>
                  ) : item.externo ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--fg-on-dark)] transition-colors hover:text-gold-500"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--fg-on-dark)] transition-colors hover:text-gold-500"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha divisória + bottom */}
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[var(--navy-line)] pt-8 text-xs text-[var(--fg-on-dark-muted)] md:flex-row md:items-center">
          <p>© 2026 OBRA RADAR — Calculadora de Orçamento</p>
          <p>CNPJ 61.288.947/0001-34</p>
        </div>
      </div>
    </footer>
  );
}
