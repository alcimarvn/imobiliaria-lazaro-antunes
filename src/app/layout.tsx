import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { BROKER } from "@/lib/data";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lazaroantunesimoveis.com.br"),
  title: `${BROKER.name} | Imóveis na Serra Gaúcha - CRECI ${BROKER.creci}`,
  description: `Imóveis exclusivos na Serra Gaúcha. Chalés, casas em condomínios e apartamentos em Gramado, Canela e região com assessoria completa do corretor ${BROKER.name}.`,
  openGraph: {
    title: `${BROKER.name} | Imóveis na Serra Gaúcha`,
    description: `Imóveis exclusivos e consultoria de alto padrão na Serra Gaúcha e região.`,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`scroll-smooth ${sans.variable} ${heading.variable}`}>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-brand-900 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
