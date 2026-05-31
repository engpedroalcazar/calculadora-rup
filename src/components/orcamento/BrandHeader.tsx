import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

type Props = {
  variant?: "landing" | "inner";
};

export function BrandHeader({ variant = "landing" }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--navy-line)] bg-navy-900/85 backdrop-blur">
      <div className="container-x flex items-center justify-between py-5">
        <Link href="/orcamento" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image
              src="/logos/orcamento/obraradar-icon.jpg"
              alt="ObraRadar"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-cover"
            />
          </div>
          <div>
            <p className="display text-lg leading-none text-cream-50">ObraRadar</p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-[var(--fg-on-dark-muted)]">
              CALCULADORA DE ORÇAMENTO
            </p>
          </div>
        </Link>

        {variant === "inner" && (
          <Link
            href="/orcamento"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cream-50 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Início
          </Link>
        )}
      </div>
    </header>
  );
}
