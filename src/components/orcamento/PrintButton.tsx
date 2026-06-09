"use client";

import { FileDown } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-900 transition hover:bg-gold-400"
    >
      <FileDown className="h-4 w-4" />
      Imprimir / Salvar PDF
    </button>
  );
}
