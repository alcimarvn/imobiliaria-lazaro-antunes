"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/types";
import { formatCurrency, BROKER } from "@/lib/data";
import { TiltCard } from "@/components/TiltCard";
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);
  const images = property.images && property.images.length > 0 ? property.images : ["/assets/hero-home.jpg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isAirbnbFriendly =
    property.purpose === "temporada" ||
    property.features.some(
      (f) =>
        f.toLowerCase().includes("airbnb") ||
        f.toLowerCase().includes("rentabilidade") ||
        f.toLowerCase().includes("temporada")
    ) ||
    property.description.toLowerCase().includes("airbnb");

  const whatsappText = encodeURIComponent(
    `Olá Lázaro! Gostei do imóvel "${property.title}" em ${property.neighborhood}, ${property.city} no valor de ${formatCurrency(property.price)} (Cód. #${property.id}). Poderia me passar mais detalhes e disponibilidade?`
  );

  return (
    <TiltCard maxRotation={3} scale={1.015} className="h-full flex flex-col">
      <article className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-gold-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
        {/* Carrossel de Imagens */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100 select-none">
          <Link href={`/imoveis/${property.id}`} className="block w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-900/95 text-white shadow-md backdrop-blur-xs">
                {property.city} • RS
              </span>

              {/* Tag Editorial Esmeralda Exclusiva (Estilo site oficial) */}
              {property.highlight_tag && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.14em] bg-emerald-700/95 text-white shadow-md backdrop-blur-xs font-bold border border-emerald-500/30">
                  {property.highlight_tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {isAirbnbFriendly && (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Airbnb</span>
                </span>
              )}
              {property.featured && (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-amber-950 shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Destaque</span>
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
                title={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
                aria-label={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer backdrop-blur-xs ${
                  favorited
                    ? "bg-rose-600 text-white scale-105"
                    : "bg-black/55 hover:bg-black/80 text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? "fill-current text-white" : "text-white"}`} />
              </button>
            </div>
          </div>

          {/* Controles de Foto */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold backdrop-blur-xs">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}

          {/* Tipo de Imóvel na Base */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-900/85 text-white backdrop-blur-xs">
              {property.type}
            </span>
          </div>
        </div>

        {/* Conteúdo do Card */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
          <div className="space-y-2">
            {/* Preço em Destaque */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(property.price)}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Venda
              </span>
            </div>

            {/* Localização */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
              <span className="truncate">
                {property.neighborhood}, {property.city} - RS
              </span>
            </div>

            {/* Título do Imóvel */}
            <Link href={`/imoveis/${property.id}`} className="block">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-900 transition-colors line-clamp-1 leading-snug">
                {property.title}
              </h3>
            </Link>

            {/* Descrição Curta */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {property.description}
            </p>

            
          </div>

          {/* Ficha Técnica Rápida */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <Maximize2 className="w-4 h-4 text-brand-700 mx-auto mb-1" />
              <span className="font-bold block">{property.area} m²</span>
              <span className="text-[10px] text-slate-500">área</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <BedDouble className="w-4 h-4 text-brand-700 mx-auto mb-1" />
              <span className="font-bold block">{property.bedrooms}</span>
              <span className="text-[10px] text-slate-500">quartos</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <Bath className="w-4 h-4 text-brand-700 mx-auto mb-1" />
              <span className="font-bold block">{property.bathrooms}</span>
              <span className="text-[10px] text-slate-500">banhos</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <Car className="w-4 h-4 text-brand-700 mx-auto mb-1" />
              <span className="font-bold block">{property.parkingSpots}</span>
              <span className="text-[10px] text-slate-500">vagas</span>
            </div>
          </div>

          {/* Ações: Ver Detalhes + WhatsApp Direto */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/imoveis/${property.id}`}
              className="flex-1 py-3 px-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs text-center"
            >
              <span>Ver Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={`https://wa.me/${BROKER.whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Conversar no WhatsApp sobre ${property.title}`}
              title="Tirar dúvidas no WhatsApp de Lázaro Antunes"
              className="p-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.001-.47-1.671-.692-2.73-2.42-2.813-2.531-.084-.112-.676-.901-.676-1.718 0-.817.427-1.219.579-1.385.152-.166.332-.208.443-.208.111 0 .222 0 .319.005.103.005.241-.039.377.291.144.348.492 1.201.536 1.29.044.089.073.193.014.31-.059.117-.089.191-.176.292-.088.102-.186.227-.266.305-.088.087-.181.182-.078.36.103.177.458.756.984 1.224.678.604 1.25.79 1.428.879.178.088.282.078.388-.044.106-.122.455-.53.577-.712.122-.182.244-.152.41-.09.167.062 1.061.5 1.243.59.182.091.304.135.349.212.045.077.045.447-.099.852z"/>
              </svg>
            </a>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
