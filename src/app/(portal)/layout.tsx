import { getBrokerInfo } from "@/lib/crm-db";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { BackToTopButton } from "@/components/BackToTopButton";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const broker = getBrokerInfo();

  return (
    <>
      {/* Barra de Progresso Dourada no Topo */}
      <ScrollProgressBar />

      {/* Spotlight Interativo que segue o cursor */}
      <CursorSpotlight />

      <Navbar broker={broker} />

      <div className="flex-1">
        {children}
      </div>

      <Footer broker={broker} />

      {/* Botao Voltar ao Topo e WhatsApp flutuante exclusivo do portal publico */}
      <BackToTopButton />
      <WhatsAppButton broker={broker} />
    </>
  );
}
