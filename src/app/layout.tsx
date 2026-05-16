import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Obra Radar — Diagnóstico de Produtividade RUP",
  description: "Diagnóstico técnico de produtividade de mão de obra. Calcule a RUP da sua equipe e identifique desvios com precisão de laudo de engenharia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
