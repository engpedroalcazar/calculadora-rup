import type { Metadata } from "next";
import "./globals.css";

const APP_URL = "https://www.obraradarapp.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Obra Radar — Diagnóstico de Produtividade RUP",
    template: "%s | Obra Radar",
  },
  description: "Diagnóstico técnico de produtividade de mão de obra para a construção civil. Calcule a RUP da sua equipe, identifique desvios e receba um laudo técnico comparativo com benchmarks normativos.",
  keywords: [
    "RUP", "razão unitária de produção", "produtividade de mão de obra", "construção civil",
    "diagnóstico de obra", "laudo técnico", "engenharia civil", "gestão de obra",
    "controle de produtividade", "benchmark obra", "hora-homem", "obra radar",
  ],
  authors: [{ name: "Alcazar Engenharia", url: "https://alcazarengenharia.com" }],
  creator: "P H Alcazar Brito Engenharia",
  publisher: "Obra Radar",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: APP_URL,
    siteName: "Obra Radar",
    title: "Obra Radar — Diagnóstico de Produtividade RUP",
    description: "Calcule a RUP da sua equipe em menos de 3 minutos e receba um laudo técnico com benchmarks normativos. Para engenheiros, mestres de obra e gestores.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Obra Radar — Diagnóstico de Produtividade RUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Obra Radar — Diagnóstico de Produtividade RUP",
    description: "Calcule a RUP da sua equipe em menos de 3 minutos e receba um laudo técnico com benchmarks normativos.",
    images: ["/assets/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
