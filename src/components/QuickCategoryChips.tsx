"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TreePine, Home, Building2, Sparkles, Compass, ArrowUpRight } from "lucide-react";
import { PROPERTIES } from "@/lib/data";
import { TiltCard } from "@/components/TiltCard";

interface CategoryCard {
  label: string;
  sublabel: string;
  type: string;
  badge: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: "Chalés & Cabanas",
    sublabel: "Estilo suíço e alpino com lareira",
    type: "Chale",
    badge: "Refúgio da Serra",
    image: "/assets/cat-chale.webp",
    icon: TreePine,
  },
  {
    label: "Casas em Condomínio",
    sublabel: "Segurança armada 24h e bosques",
    type: "Casa",
    badge: "Privacidade & Lazer",
    image: "/assets/cat-casa.webp",
    icon: Home,
  },
  {
    label: "Apartamentos Centrais",
    sublabel: "A poucos passos da Rua Coberta",
    type: "Apartamento",
    badge: "Praticidade & Renda",
    image: "/assets/cat-apartamento.webp",
    icon: Building2,
  },
  {
    label: "Coberturas Nobres",
    sublabel: "Vistas panorâmicas e terraço gourmet",
    type: "Cobertura",
    badge: "Alto Luxo Exclusivo",
    image: "/assets/cat-cobertura.webp",
    icon: Sparkles,
  },
  {
    label: "Terrenos & Lotes",
    sublabel: "Para construir seu projeto sob medida",
    type: "Terreno",
    badge: "Potencial & Natureza",
    image: "/assets/cat-terreno.webp",
    icon: Compass,
  },
];

export function QuickCategoryChips() {
  // Contagem dinâmica de imóveis por categoria
  const getCount = (type: string) => {
    const count = PROPERTIES.filter((p) => p.type === type).length;
    return count > 0 ? `${count} ${count === 1 ? "imóvel" : "imóveis"}` : "Sob consulta";
  };

  return (
    <section className="bg-slate-50 py-16 border-b border-slate-200 relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              Exploração por Estilo de Vida
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              O que você procura na Serra Gaúcha?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl">
              Selecione o tipo de imóvel desejado e descubra opções selecionadas a dedo em toda a Serra Gaúcha.
            </p>
          </div>

          <Link
            href="/imoveis"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 hover:text-brand-950 bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:border-gold-400 shadow-xs hover:shadow-md transition-all self-start md:self-auto"
          >
            <span>Ver todo o portfólio</span>
            <ArrowUpRight className="w-4 h-4 text-gold-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid de 5 Cards Visuais Imersivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const countLabel = getCount(cat.type);

            return (
              <TiltCard
                key={cat.type}
                maxRotation={6}
                scale={1.03}
                className="h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <Link
                  href={`/imoveis?type=${cat.type}`}
                  className="group relative h-[310px] w-full flex flex-col justify-between p-5 rounded-2xl overflow-hidden block border border-slate-200/80 hover:border-gold-400 transition-colors"
                >
                  {/* Foto de Fundo em Alta Resolução */}
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradiente Escuro Cinematográfico para Legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-black/25 group-hover:via-brand-950/70 transition-colors" />

                  {/* Topo do Card: Ícone e Contagem */}
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-900/85 backdrop-blur-md border border-gold-400/30 text-gold-400 flex items-center justify-center shadow-lg group-hover:bg-gold-400 group-hover:text-brand-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      {countLabel}
                    </span>
                  </div>

                  {/* Base do Card: Informações e CTA */}
                  <div className="relative z-10 space-y-2">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold-300/90">
                      {cat.badge}
                    </span>

                    <h3 className="text-lg font-black text-white leading-tight group-hover:text-gold-300 transition-colors">
                      {cat.label}
                    </h3>

                    <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-2">
                      {cat.sublabel}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-gold-400 group-hover:text-gold-300 group-hover:translate-x-1 transition-all">
                      <span>Explorar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
