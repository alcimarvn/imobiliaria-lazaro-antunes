"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface Slide {
  url: string;
  alt: string;
  location: string;
  city: "Gramado" | "Canela";
}

const HERO_SLIDES: Slide[] = [
  {
    url: "/assets/hero-gramado-igreja.webp",
    alt: "Igreja Matriz São Pedro iluminada à noite no centro de Gramado",
    location: "Igreja Matriz & Centro Iluminado",
    city: "Gramado",
  },
  {
    url: "/assets/hero-canela-catedral-pedra.webp",
    alt: "Catedral de Pedra Nossa Senhora de Lourdes em Canela",
    location: "Catedral de Pedra & Praça Central",
    city: "Canela",
  },
  {
    url: "/assets/hero-gramado-portico.webp",
    alt: "Pórtico de entrada estilo bávaro de Gramado",
    location: "Pórtico de Entrada Turístico",
    city: "Gramado",
  },
  {
    url: "/assets/hero-canela-cascata-caracol.webp",
    alt: "Bondinhos aéreos com vista panorâmica para a Cascata do Caracol em Canela",
    location: "Bondinhos & Cascata do Caracol",
    city: "Canela",
  },
  {
    url: "/assets/hero-canela-roda-gigante.webp",
    alt: "Roda Gigante de Canela e vista das araucárias da serra",
    location: "Roda Canela & Parques da Serra",
    city: "Canela",
  },
];

export function HeroBackgroundSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // 6 segundos de exibição contínua para cada foto

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Imagens com Efeito Ken Burns Contínuo durante toda a exibição */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              key={isActive ? `${slide.url}-active` : `${slide.url}-idle`}
              src={slide.url}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className={`object-cover ${isActive ? "animate-kenburns" : ""}`}
            />
          </div>
        );
      })}

      {/* Camada de Sobreposição Azul Marinho com 50% de Transparência Exata */}
      <div className="absolute inset-0 bg-brand-950/50 z-10 pointer-events-none" />

      {/* Etiqueta Flutuante da Cidade e Ponto Turístico */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-3 bg-brand-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-800 text-xs text-white shadow-xl">
        <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span className="font-bold text-gold-300">
          {HERO_SLIDES[current].city} • RS
        </span>
        <span className="text-slate-300">({HERO_SLIDES[current].location})</span>

        {/* Indicadores de Slide */}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-brand-800">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Ir para imagem ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === current ? "w-5 bg-gold-400" : "w-1.5 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}