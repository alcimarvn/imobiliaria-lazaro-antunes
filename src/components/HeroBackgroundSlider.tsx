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
    alt: "Igreja Matriz S�o Pedro iluminada � noite no centro de Gramado",
    location: "Igreja Matriz & Centro Iluminado",
    city: "Gramado",
  },
  {
    url: "/assets/hero-canela-catedral-pedra.webp",
    alt: "Catedral de Pedra Nossa Senhora de Lourdes em Canela",
    location: "Catedral de Pedra & Pra�a Central",
    city: "Canela",
  },
  {
    url: "/assets/hero-gramado-portico.webp",
    alt: "P�rtico de entrada estilo b�varo de Gramado",
    location: "P�rtico de Entrada Tur�stico",
    city: "Gramado",
  },
  {
    url: "/assets/hero-canela-cascata-caracol.webp",
    alt: "Bondinhos a�reos com vista panor�mica para a Cascata do Caracol em Canela",
    location: "Bondinhos & Cascata do Caracol",
    city: "Canela",
  },
  {
    url: "/assets/hero-canela-roda-gigante.webp",
    alt: "Roda Gigante de Canela e vista das arauc�rias da serra",
    location: "Roda Canela & Parques da Serra",
    city: "Canela",
  },
];

export function HeroBackgroundSlider() {
  const [current, setCurrent] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<number[]>([0]);

  // Carregar os pr�ximos slides progressivamente em segundo plano apenas ap�s a renderiza��o inicial
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setLoadedIndices((prev) => {
        const nextIdx = (current + 1) % HERO_SLIDES.length;
        if (!prev.includes(nextIdx)) {
          return [...prev, nextIdx];
        }
        return prev;
      });
    }, 3000);

    return () => clearTimeout(preloadTimer);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        setLoadedIndices((loaded) => (loaded.includes(next) ? loaded : [...loaded, next]));
        return next;
      });
    }, 7000); // 7 segundos de exibi��o cont�nua para cada foto

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Imagens com Efeito Ken Burns Cont�nuo */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        const shouldRender = loadedIndices.includes(index) || isActive;

        if (!shouldRender) {
          return null;
        }

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
              sizes="100vw"
              className={`object-cover ${isActive ? "animate-kenburns" : ""}`}
            />
          </div>
        );
      })}

      {/* Camada de Sobreposi��o Azul Marinho com 50% de Transpar�ncia Exata */}
      <div className="absolute inset-0 bg-brand-950/50 z-10 pointer-events-none" />

      {/* Etiqueta Flutuante da Cidade e Ponto Tur�stico */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-3 bg-brand-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-brand-800 text-xs text-white shadow-xl">
        <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span className="font-bold text-gold-300">
          {HERO_SLIDES[current].city} � RS
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
