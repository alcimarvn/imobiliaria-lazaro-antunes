"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property, BrokerInfo } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  CheckCircle,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Building2,
  Sparkles,
  MessageCircle,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Calculator,
  TrendingUp,
  Video,
  Compass,
  PhoneCall,
  DollarSign,
  Landmark,
  Coffee,
  Plane
} from "lucide-react";

interface PropertyDetailsClientProps {
  property: Property;
  broker: BrokerInfo;
  similarProperties: Property[];
}

export function PropertyDetailsClient({
  property,
  broker,
  similarProperties,
}: PropertyDetailsClientProps) {
  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Compartilhamento
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulador Financeiro
  const [simTab, setSimTab] = useState<"financiamento" | "rentabilidade">("financiamento");
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30); // 30% padrão
  const [installmentsCount, setInstallmentsCount] = useState<number>(360); // 30 anos

  // Cálculos do simulador de financiamento
  const downPaymentValue = (property.price * downPaymentPercent) / 100;
  const financedValue = property.price - downPaymentValue;
  // Taxa média estimada (aprox. 0.85% a.m. Price / SAC)
  const monthlyRate = 0.0085;
  const estimatedMonthlyPayment =
    (financedValue * (monthlyRate * Math.pow(1 + monthlyRate, installmentsCount))) /
    (Math.pow(1 + monthlyRate, installmentsCount) - 1);

  // Cálculos do simulador de rentabilidade (Airbnb)
  // Estimativa baseada no valor do imóvel: diária de luxo em Gramado
  const estimatedDailyRate = Math.round(property.price * 0.00065); // Ex: 780k -> ~R$ 507/dia
  const occupancyRateHigh = 0.72; // 72% ocupação média anual em pontos centrais
  const estimatedAnnualGross = estimatedDailyRate * 365 * occupancyRateHigh;
  const estimatedNetYield = ((estimatedAnnualGross * 0.75) / property.price) * 100; // Líquido após despesas ~25%

  
  // Extrair ID do YouTube
  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };
  const videoEmbedUrl = getYouTubeEmbedUrl(property.video_url);

    // Imagens e Legendas vindas 100% do banco de dados SQLite
  const images: string[] = property.images && property.images.length > 0 ? property.images : ["/assets/hero-home.jpg"];
  const captions: string[] = (property as any).image_captions || (property as any).imageCaptions || [];

  // Helper para obter URL otimizada de thumbnail (~6KB a 10KB para carregamento instantâneo)
  const getThumbUrl = (url: string) => {
    if (!url) return "/assets/hero-home.jpg";
    if (url.startsWith("/uploads/")) {
      return url.replace(/\.(jpeg|jpg|png|webp)$/i, "-thumb.webp");
    }
    return url;
  };

  // Pré-carregamento suave em memória sob demanda
  const preloadImage = (src: string) => {
    if (typeof window !== "undefined" && src) {
      const img = new window.Image();
      img.src = src;
    }
  };

  // Descrição / Legenda vinda do banco de dados (com fallback contextual se vazia)
  const getImageDescription = (index: number) => {
    // 1. PRIORIDADE MÁXIMA: Se a imagem tem legenda cadastrada no banco de dados, utiliza ela diretamente!
    if (captions[index] && captions[index].trim()) {
      return captions[index].trim();
    }

    // 2. Fallbacks inteligentes caso não haja legenda cadastrada no banco
    if (property.id === "7") {
      const descriptions7 = [
        "Perspectiva da fachada contemporânea do empreendimento no Centro de Gramado",
        "Proximidade imediata da Rua Coberta, restaurantes estrelados e comércio nobre",
        "Living integrado planejado para locação por temporada de alto padrão (Airbnb e Booking)",
        "Dormitórios aconchegantes com isolamento térmico, acústico e piso aquecido",
        "Vista panorâmica e relevo deslumbrante de Gramado e da Serra Gaúcha",
        "Infraestrutura de lazer com pit fire ao ar livre para noites de vinho sob as estrelas"
      ];
      if (descriptions7[index]) return descriptions7[index];
    }

    const genericDescriptions = [
      `Fachada principal e conceito arquitetônico exclusivo em ${property.city}`,
      `Living integrado e ambientes sociais de estar e jantar com iluminação natural`,
      `Dormitórios amplos com conforto térmico, isolamento acústico e privacidade`,
      `Sacada com churrasqueira gourmet privativa e vista privilegiada para a Serra`,
      `Infraestrutura completa de lazer e comodidades do condomínio boutique`,
      `Acabamentos de alto padrão e detalhes construtivos nobres selecionados`
    ];
    return genericDescriptions[index % genericDescriptions.length];
  };

  // WhatsApp
  const whatsappText = `Olá Lázaro! Tenho interesse no imóvel "${property.title}" (Cód: #${property.id}) em ${property.city} no valor de ${formatCurrency(property.price)}. Gostaria de mais informações e agendar uma visita.`;
  const whatsappUrl = `https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  const videoTourText = `Olá Lázaro! Sou de fora do RS e gostaria de agendar uma transmissão em vídeo privada para conhecer o imóvel "${property.title}" (Cód: #${property.id}) em ${property.city}.`;
  const videoTourUrl = `https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(videoTourText)}`;

  const simWhatsappText = `Olá Lázaro! Fiz uma simulação de financiamento no site para o imóvel "${property.title}" (Cód: #${property.id}) com entrada de ${formatCurrency(downPaymentValue)}. Poderia fazer uma simulação bancária oficial para mim?`;
  const simWhatsappUrl = `https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(simWhatsappText)}`;

  // Copiar link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Lightbox navigation
  const openLightbox = (idx: number) => {
    setActivePhotoIndex(idx);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % images.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Barra Superior de Navegação & Ações */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-brand-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-brand-700" />
            <span>Voltar ao catálogo</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Copiar link deste imóvel"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copiar Link</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Confira este imóvel em ${property.city}: ${property.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Compartilhar no WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </a>
          </div>
        </div>

        {/* Cabeçalho do Imóvel: Título e Preço */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-900 text-white shadow-xs">
                {property.status}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                {property.type}
              </span>
              {property.featured && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Destaque Exclusivo</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold text-slate-500 bg-white border border-slate-200 shadow-2xs">
                Cód: #{property.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
              <span>
                {property.neighborhood}, {property.city} - Serra Gaúcha / RS
              </span>
            </div>
          </div>

          <div className="text-left lg:text-right bg-white p-5 lg:p-0 rounded-2xl border lg:border-none border-slate-200 shadow-xs lg:shadow-none shrink-0">
            <span className="text-xs uppercase tracking-wider text-slate-500 block font-bold">
              Valor de Aquisição
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(property.price)}
            </span>
            <span className="block text-[11px] font-semibold text-emerald-700 mt-0.5">
              Condições sob consulta • Aceita proposta
            </span>
          </div>
        </div>

        {/* Galeria de Fotos Interativa com Miniaturas e Descrição da Imagem */}
        <div className="space-y-4">
          {/* Foto Principal em Destaque */}
          <div className="relative h-[380px] sm:h-[500px] lg:h-[560px] rounded-3xl overflow-hidden shadow-xl bg-slate-900 group">
            <Image
              src={images[activePhotoIndex] || "/assets/hero-home.jpg"}
              alt={`${property.title} - ${getImageDescription(activePhotoIndex)}`}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            />

            {/* Gradientes sutis para legibilidade dos controles e da legenda */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/50 to-transparent pointer-events-none" />

            {/* Topo da Imagem: Badge de Contagem e Botão Expandir */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <span className="bg-brand-950/80 backdrop-blur-md text-gold-300 border border-gold-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Foto {activePhotoIndex + 1} de {images.length}</span>
              </span>

              <button
                onClick={() => openLightbox(activePhotoIndex)}
                className="bg-brand-950/80 hover:bg-brand-900/90 backdrop-blur-md text-white border border-white/20 hover:border-gold-400/60 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                title="Ver em tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver em Tela Cheia</span>
              </button>
            </div>

            {/* Botões de Navegação Direta na Foto Principal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-950/70 hover:bg-brand-900/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-xs opacity-80 hover:opacity-100 z-10 transform hover:scale-110"
                  title="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-950/70 hover:bg-brand-900/90 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-xs opacity-80 hover:opacity-100 z-10 transform hover:scale-110"
                  title="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Legenda / Descrição da Imagem Atual no Rodapé da Foto */}
            <div className="absolute bottom-4 inset-x-4 z-10">
              <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl flex items-center gap-3 text-white shadow-2xl">
                <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-gold-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 block">
                    Detalhe do Imóvel • Foto {activePhotoIndex + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 mt-0.5">
                    {getImageDescription(activePhotoIndex)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trilho de Miniaturas de TODAS as Fotos do Imóvel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Miniaturas do imóvel ({images.length} fotos disponíveis):</span>
              <span className="text-brand-900 font-bold">Clique em qualquer foto para selecionar</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
              {images.map((img, idx) => {
                const thumbSrc = getThumbUrl(img);
                return (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    onMouseEnter={() => preloadImage(img)}
                    className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer shadow-xs ${
                      activePhotoIndex === idx
                        ? "border-gold-500 ring-4 ring-gold-400/25 scale-103 shadow-md"
                        : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                    }`}
                    title={getImageDescription(idx)}
                  >
                    <Image
                      src={thumbSrc}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 33vw, 16vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target && target.src !== img) {
                          target.src = img;
                        }
                      }}
                    />
                    {/* Badge de numeração da miniatura */}
                    <span className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs ${
                      activePhotoIndex === idx
                        ? "bg-gold-500 text-brand-950"
                        : "bg-black/60 text-white"
                    }`}>
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ficha Técnica e Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Principal da Esquerda (8 Colunas) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Características Chave */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <Maximize2 className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-semibold block uppercase">Área Privativa</span>
                <span className="text-lg font-extrabold text-slate-900">{property.area} m²</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <BedDouble className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-semibold block uppercase">Dormitórios</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {property.bedrooms} {property.suites > 0 ? `(${property.suites} suítes)` : ""}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <Bath className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-semibold block uppercase">Banheiros</span>
                <span className="text-lg font-extrabold text-slate-900">{property.bathrooms}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <Car className="w-5 h-5 text-brand-700 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-semibold block uppercase">Vagas</span>
                <span className="text-lg font-extrabold text-slate-900">{property.parkingSpots}</span>
              </div>
            </div>

            {/* Descrição Detalhada */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-700" />
                <span>Sobre este Imóvel</span>
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Diferenciais e Comodidades */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-700" />
                <span>Diferenciais e Infraestrutura</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 font-medium"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização Estratégica e Distâncias */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-700" />
                  <span>Localização e Acessos</span>
                </h2>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {property.neighborhood} • {property.city}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600">
                Posicionamento privilegiado na Serra Gaúcha, combinando conveniência urbana, tranquilidade residencial e valorização patrimonial constante.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Rua Coberta & Centro Turístico</span>
                    <span className="text-xs text-slate-500">~3 a 5 minutos de deslocamento fácil</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Polo Gastronômico & Cafés Coloniais</span>
                    <span className="text-xs text-slate-500">Próximo aos melhores restaurantes da região</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Lago Negro & Parques Naturais</span>
                    <span className="text-xs text-slate-500">~6 a 8 minutos com vista para a serra</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Aeroporto Regional de Caxias do Sul</span>
                    <span className="text-xs text-slate-500">~1h10 com acesso por rodovia duplicada</span>
                  </div>
                </div>
              </div>

              {/* Mapa de Localização */}
              <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-inner h-[300px] relative w-full bg-slate-100 group">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.neighborhood}, ${property.city}, RS, Brasil`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </div>

            {/* Simulador Financeiro e de Rentabilidade Interativo */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-brand-700" />
                    <span>Planejamento Financeiro & Rentabilidade</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simule as condições para aquisição residencial ou investimento na Serra Gaúcha
                  </p>
                </div>

                {/* Abas */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setSimTab("financiamento")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simTab === "financiamento"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Financiamento
                  </button>
                  <button
                    onClick={() => setSimTab("rentabilidade")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simTab === "rentabilidade"
                        ? "bg-white text-emerald-800 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Rentabilidade Airbnb
                  </button>
                </div>
              </div>

              {/* Aba 1: Financiamento */}
              {simTab === "financiamento" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Entrada */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Entrada Sugerida ({downPaymentPercent}%)</span>
                        <span className="text-brand-900 font-extrabold">{formatCurrency(downPaymentValue)}</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        step={5}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-brand-800 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Mín. 20% ({formatCurrency((property.price * 20) / 100)})</span>
                        <span>80% ({formatCurrency((property.price * 80) / 100)})</span>
                      </div>
                    </div>

                    {/* Prazo */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Prazo Estimado</span>
                        <span className="text-brand-900 font-extrabold">{installmentsCount / 12} anos ({installmentsCount} meses)</span>
                      </div>
                      <select
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <option value={120}>10 anos (120 meses)</option>
                        <option value={240}>20 anos (240 meses)</option>
                        <option value={360}>30 anos (360 meses)</option>
                        <option value={420}>35 anos (420 meses)</option>
                      </select>
                    </div>
                  </div>

                  {/* Resumo da Simulação */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-brand-50/60 rounded-2xl border border-brand-100 text-center">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Valor Financiado</span>
                      <span className="text-base font-extrabold text-slate-900">{formatCurrency(financedValue)}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Parcela Inicial Estimada</span>
                      <span className="text-base font-black text-brand-900">{formatCurrency(estimatedMonthlyPayment)}/mês</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Bancos Conveniados</span>
                      <span className="text-xs font-bold text-slate-700 mt-1 block">Caixa, Itaú, BB, Santander</span>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      *Simulação meramente informativa. Sujeita à análise cadastral e aprovação bancária.
                    </p>
                    <a
                      href={simWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Pedir Simulação Bancária Oficial</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Aba 2: Rentabilidade Airbnb */}
              {simTab === "rentabilidade" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-xs text-emerald-800 font-semibold block">Diária Média Estimada</span>
                      <span className="text-xl font-black text-emerald-950 mt-1 block">
                        {formatCurrency(estimatedDailyRate)}
                      </span>
                      <span className="text-[10px] text-emerald-700">Média alta/baixa temporada</span>
                    </div>

                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-xs text-emerald-800 font-semibold block">Ocupação Média Projetada</span>
                      <span className="text-xl font-black text-emerald-950 mt-1 block">
                        ~72% ao ano
                      </span>
                      <span className="text-[10px] text-emerald-700">Com eventos e Natal Luz</span>
                    </div>

                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-xs text-emerald-800 font-semibold block">Retorno Líquido Projetado</span>
                      <span className="text-xl font-black text-emerald-950 mt-1 block">
                        ~{estimatedNetYield.toFixed(1)}% ao ano
                      </span>
                      <span className="text-[10px] text-emerald-700">+ valorização imobiliária</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    A Serra Gaúcha conta com fluxo turístico contínuo ao longo dos 12 meses do ano. Lázaro Antunes orienta sobre as melhores administradoras de locação de temporada locais para você receber rendimentos no piloto automático.
                  </p>

                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(`Olá Lázaro! Gostaria de entender a projeção de rentabilidade e gestão de aluguel por temporada para o imóvel "${property.title}" (Cód: #${property.id}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Conversar sobre Gestão de Temporada</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

                        {/* Tour Virtual (YouTube Embed) */}
            {videoEmbedUrl && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-brand-700" />
                  <span>Vídeo de Apresentação</span>
                </h2>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-slate-900">
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Bloco: Tour em Vídeo para Compradores de Outros Estados */}
            <div className="rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-brand-900 p-6 sm:p-8 text-white border border-gold-400/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-[11px] font-bold uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5 text-gold-400" />
                  <span>Atendimento Especial para Fora do RS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Mora em outro estado ou não pode viajar agora?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  Lázaro Antunes realiza uma transmissão em vídeo privada e ao vivo pelo WhatsApp diretamente no imóvel para você e sua família tirarem todas as dúvidas em tempo real.
                </p>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <a
                  href={videoTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Agendar Vídeo Tour Ao Vivo</span>
                </a>
              </div>
            </div>
          </div>

          {/* Coluna Lateral da Direita: Sidebar Fixa (4 Colunas) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl sticky top-28 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                  Valor de Aquisição
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatCurrency(property.price)}
                </div>
                <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                  Disponível para negociação direta
                </span>
              </div>

              {/* Informações do Corretor */}
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="relative w-12 h-12 rounded-xl bg-brand-900 border-2 border-gold-400/80 overflow-hidden shadow-xs shrink-0">
                  <Image
                    src="/assets/lazaro-antunes-recorte.webp"
                    alt={broker.name}
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{broker.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">CRECI {broker.creci}</p>
                  <p className="text-xs text-brand-700 font-bold">Especialista Serra Gaúcha</p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Agendar Visita no WhatsApp</span>
                </a>

                <a
                  href={videoTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Solicitar Vídeo Tour</span>
                </a>

                <Link
                  href={`/contato?propertyId=${property.id}`}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-300 shadow-2xs"
                >
                  <span>Enviar Mensagem Formal</span>
                </Link>
              </div>

              {/* Garantias de Segurança */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Matrícula e certidões regularizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>Visitas com agendamento prévio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>CRECI-RS 088652-F • Registro ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vitrine: Imóveis Semelhantes na Região */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
                  Sugestões da Curadoria
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Outras Oportunidades Selecionadas
                </h2>
              </div>

              <Link
                href="/imoveis"
                className="text-xs font-bold uppercase tracking-wider text-brand-800 hover:text-brand-950"
              >
                Ver todo o catálogo →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Barra Fixa Flutuante no Mobile (Sticky Bottom Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Valor</span>
          <span className="text-base font-black text-slate-900">{formatCurrency(property.price)}</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
          <span>Falar com Lázaro</span>
        </a>
      </div>

      {/* Lightbox / Visualizador em Tela Cheia */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 select-none animate-in fade-in duration-200">
          {/* Topo do Lightbox */}
          <div className="flex items-center justify-between text-white py-2 px-2 z-10">
            <div className="text-xs font-semibold">
              Foto {activePhotoIndex + 1} de {images.length} • {getImageDescription(activePhotoIndex)}
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Fechar (ESC)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centro do Lightbox (Imagem) */}
          <div className="relative flex-1 flex items-center justify-center my-auto w-full max-w-6xl mx-auto overflow-hidden">
            <div className="relative w-full h-full max-h-[82vh]">
              <Image
                src={images[activePhotoIndex]}
                alt={`${property.title} foto ${activePhotoIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Setas de navegação */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  title="Foto anterior (Seta Esquerda)"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  title="Próxima foto (Seta Direita)"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas na Base do Lightbox */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto no-scrollbar z-10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activePhotoIndex === idx ? "border-gold-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={getThumbUrl(img)}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="64px"
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target && target.src !== img) target.src = img;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
