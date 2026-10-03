"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BROKER } from "@/lib/data";
import { BrokerInfo } from "@/lib/types";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ broker }: { broker?: BrokerInfo } = {}) {
  const currentBroker = broker || BROKER;
  const [isHovered, setIsHovered] = useState(false);
  const url = `https://wa.me/${currentBroker.whatsapp}?text=${encodeURIComponent(currentBroker.whatsappMessage)}`;

  return (
    <aside aria-label="Atendimento por WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-black/25 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Falar com o corretor no WhatsApp"
      >
        {/* Tooltip Humanizado com Foto de Lázaro Antunes */}
        <span
          className={`absolute right-16 px-4 py-2.5 rounded-2xl bg-brand-950/95 text-white text-xs font-semibold whitespace-nowrap shadow-2xl border border-brand-800 backdrop-blur-md transition-all duration-300 pointer-events-none flex items-center gap-3 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 hidden sm:flex"
          }`}
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-400 shrink-0 bg-brand-900">
            <Image
              src="/assets/lazaro-antunes-recorte.webp"
              alt="Lázaro Antunes"
              fill
              className="object-cover object-top"
              sizes="32px"
            />
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-xs">Falar com Lázaro Antunes</p>
            <p className="text-[10px] text-emerald-400 font-medium">Online agora no WhatsApp</p>
          </div>
          <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 border-4 border-transparent border-l-brand-950/95"></span>
        </span>

        {/* Indicador de Status Online Discreto */}
        <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#25D366]"></span>
        </span>

        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}