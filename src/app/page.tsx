import PortalLayout from '@/app/(portal)/layout';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getBrokerInfo } from "@/lib/crm-db";
import { getFeaturedProperties } from "@/lib/crm-db";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterBar } from "@/components/FilterBar";
import { HeroBackgroundSlider } from "@/components/HeroBackgroundSlider";
import { QuickCategoryChips } from "@/components/QuickCategoryChips";
import { HeroParticles } from "@/components/HeroParticles";
import { TiltCard } from "@/components/TiltCard";
import { PropertyQuiz } from "@/components/PropertyQuiz";
import { FAQSection } from "@/components/FAQSection";
import {
  ShieldCheck,
  TrendingUp,
  TreePine,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Building,
  Award,
  Lock,
  Compass,
  Building2,
  MessageCircle,
  Video,
  Wine,
  CalendarCheck,
  FileCheck,
  Users,
  MapPin
} from "lucide-react";

export default function HomePage() {
  const BROKER = getBrokerInfo();
  const featuredProperties = getFeaturedProperties();

  return (
    <PortalLayout>
    <main>
      {/* 1. Hero com as Imagens Oficiais em Transição */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center bg-brand-950 text-white px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <HeroBackgroundSlider />
        <HeroParticles />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-800/90 text-gold-300 border border-gold-500/40 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Curadoria Exclusiva • Gramado &amp; Canela</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            O seu refúgio na Serra Gaúcha começa com a <br />
            <span className="text-gradient-gold font-black">assessoria certa e exclusiva.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-100 font-normal leading-relaxed drop-shadow-sm">
            Comprar um imóvel ou mudar de vida em Gramado e Canela exige confiança absoluta. Lázaro Antunes (CRECI 088652-F) oferece uma consultoria boutique e criteriosa, unindo curadoria de propriedades nobres, segurança jurídica e acompanhamento dedicado de ponta a ponta.
          </p>

          {/* Barra de Filtros com 50% de Transparência */}
          <div className="pt-3">
            <FilterBar />
          </div>

          {/* Selos de Confiança no Hero */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-brand-800">
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white block">CRECI-RS</span>
              <span className="text-xs text-gold-300 font-semibold">088652-F Regular</span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white block">+10 Anos</span>
              <span className="text-xs text-gold-300 font-semibold">Vivência na Serra Gaúcha</span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white block">100% Auditados</span>
              <span className="text-xs text-gold-300 font-semibold">Inspeção &amp; Matrícula</span>
            </div>
            <div className="p-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white block">Boutique</span>
              <span className="text-xs text-gold-300 font-semibold">Curadoria Exclusiva</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Chips de Categorias Visuais Rápidas */}
      <QuickCategoryChips />

      {/* 3. Dois Caminhos Estratégicos: Mudança vs Investimento */}
      <section className="bg-slate-100/70 py-20 border-b border-slate-200 relative overflow-hidden">
        {/* Luz ambiente sutil */}
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Cabeçalho de Alto Impacto */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              Consultoria Sob Medida • Gramado &amp; Canela
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Qual é o seu objetivo na Serra Gaúcha?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Entendemos que escolher o novo endereço da sua família ou selecionar um ativo imobiliário de alta performance exigem olhares e estratégias distintas. Conte com direcionamento técnico e exclusivo em cada etapa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Mudar para Gramado (Residencial) */}
            <TiltCard maxRotation={4} scale={1.02} className="h-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
              <div className="group relative h-full min-h-[500px] flex flex-col justify-between p-8 sm:p-10 rounded-3xl overflow-hidden border border-slate-200 hover:border-gold-400/80 transition-colors">
                {/* Imagem de Fundo com Zoom Suave */}
                <Image
                  src="/assets/atmosfera-mudanca.webp"
                  alt="Floresta de pinheiros e araucárias ao amanhecer na Serra Gaúcha"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradiente Escuro Nobre com Transparência */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-950/45 group-hover:via-brand-950/80 transition-colors" />

                {/* Topo do Card */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/90 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>01 / MORADIA &amp; FAMÍLIA</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
                    Transição Tranquila &amp; Segura
                  </span>
                </div>

                {/* Conteúdo Principal */}
                <div className="relative z-10 my-6 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-gold-200 transition-colors">
                    Quero me mudar para Gramado ou Canela
                  </h3>
                  <p className="text-sm text-slate-200 font-normal leading-relaxed">
                    Acompanhamento consultivo de ponta a ponta: seleção minuciosa dos bairros mais nobres e seguros, análise de conforto térmico e insolação das residências, até a completa assessoria de ambientação da sua família.
                  </p>

                  {/* 3 Benefícios Exclusivos */}
                  <div className="pt-2 space-y-2.5 border-t border-white/10">
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Auditoria documental e matrícula 100% verificadas antes de qualquer proposta</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Mapeamento dos condomínios mais prestigiados, arborizados e seguros</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Suporte atencioso na transição e adaptação da rotina familiar na Serra</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação com WhatsApp e btn-shine */}
                <div className="relative z-10 pt-4">
                  <a
                    href={`https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent("Olá Lázaro, gostaria de planejar a mudança da minha família para a Serra Gaúcha.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 cursor-pointer w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Planejar Mudança com Lázaro</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </TiltCard>

            {/* Card 2: Comprar ou Investir (Patrimônio) */}
            <TiltCard maxRotation={4} scale={1.02} className="h-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
              <div className="group relative h-full min-h-[500px] flex flex-col justify-between p-8 sm:p-10 rounded-3xl overflow-hidden border border-slate-200 hover:border-gold-400/80 transition-colors">
                {/* Imagem de Fundo com Zoom Suave */}
                <Image
                  src="/assets/atmosfera-investimento.webp"
                  alt="Chalé de alto padrão em pedra e madeira na Serra Gaúcha"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradiente Escuro Nobre com Transparência */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-950/45 group-hover:via-brand-950/80 transition-colors" />

                {/* Topo do Card */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/90 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>02 / PATRIMÔNIO &amp; RENTABILIDADE</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
                    Alta Demanda Anual (Airbnb)
                  </span>
                </div>

                {/* Conteúdo Principal */}
                <div className="relative z-10 my-6 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-gold-200 transition-colors">
                    Quero investir com rentabilidade e valorização
                  </h3>
                  <p className="text-sm text-slate-200 font-normal leading-relaxed">
                    Posicione seu capital em um dos destinos imobiliários mais cobiçados e valorizados do país. Curadoria restrita a imóveis com excelente taxa de ocupação para locação de temporada e liquidez comprovada.
                  </p>

                  {/* 3 Benefícios Exclusivos */}
                  <div className="pt-2 space-y-2.5 border-t border-white/10">
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Projeção técnica de diárias médias e rendimento líquido anual</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Seleção criteriosa nos eixos de maior fluxo turístico e valorização</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                      <span>Dossiê financeiro e operacional transparente, sem custos ocultos</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação para Vitrine com btn-shine */}
                <div className="relative z-10 pt-4">
                  <Link
                    href="/imoveis"
                    className="btn-shine inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-brand-900 to-brand-850 hover:from-brand-850 hover:to-brand-800 text-gold-300 hover:text-white border border-gold-400/40 font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Explorar Carteira de Investimentos</span>
                    <ArrowRight className="w-4 h-4 text-gold-400" />
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

            {/* 4. Vitrine de Imóveis Reais Cadastrados */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block mb-1">
                Curadoria Exclusiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Propriedades Selecionadas com Rigor
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-normal">
                Uma seleção criteriosa de ativos nobres em Gramado e Canela, auditados para garantir segurança jurídica e liquidez.
              </p>
            </div>
            <Link
              href="/imoveis"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900 group"
            >
              <span>Ver portfólio completo</span>
              <ArrowRight className="w-4 h-4 text-brand-700 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 🎯 Quiz Interativo: "Descubra seu Imóvel Ideal" */}
      <PropertyQuiz />

      {/* 6. Seção de Estilo de Vida & Valorização da Serra Gaúcha (Lifestyle) */}
      <section className="bg-slate-50 py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
              Patrimônio Sólido &amp; Estilo de Vida Singular
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Por que a Serra Gaúcha é o refúgio mais valorizado do Brasil?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              Mais do que adquirir um imóvel, você conquista um estilo de vida incomparável, onde segurança de padrão internacional, natureza preservada e valorização patrimonial caminham lado a lado.
            </p>
          </div>

          {/* Grid de 4 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Segurança */}
            <TiltCard maxRotation={6} scale={1.03} className="h-full">
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-gold-300 transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/assets/lifestyle-seguranca.webp"
                  alt="Segurança e tranquilidade nas ruas de Gramado"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-900/85 backdrop-blur-md text-gold-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-gold-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Padrão Internacional</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                    Segurança &amp; Paz Plena
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Índices de tranquilidade comparáveis aos melhores destinos da Europa. Caminhe com serenidade pelas ruas arborizadas a qualquer hora e desfrute da liberdade autêntica que sua família merece.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-brand-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Bairros nobres e condomínios monitorados
                </div>
              </div>
            </div>
            </TiltCard>

            {/* Card 2: +7 Milhões de Turistas */}
            <TiltCard maxRotation={6} scale={1.03} className="h-full">
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-gold-300 transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/assets/lifestyle-turismo.webp"
                  alt="Turistas na Rua Coberta em Gramado"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-900/85 backdrop-blur-md text-gold-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-gold-400/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Alta Rentabilidade</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                    +7 Milhões de Visitantes/Ano
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Demanda aquecida e ininterrupta durante as quatro estações: do charme gelado do inverno e Páscoa ao consagrado Festival de Cinema e a magia do Natal Luz, assegurando rentabilidade sólida para locação de temporada.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-brand-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Taxa de ocupação de destaque nacional
                </div>
              </div>
            </div>
            </TiltCard>

            {/* Card 3: Gastronomia & Cultura */}
            <TiltCard maxRotation={6} scale={1.03} className="h-full">
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-gold-300 transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/assets/lifestyle-gastronomia.webp"
                  alt="Alta gastronomia e fondue na Serra Gaúcha"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-900/85 backdrop-blur-md text-gold-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-gold-400/30">
                  <Wine className="w-3.5 h-3.5" />
                  <span>Alta Gastronomia</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                    Polo Enogastronômico Premiado
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Centenas de restaurantes conceituados, vinícolas boutique, alta confeitaria e fondues tradicionais, aliados a um calendário cultural sofisticado e de prestígio global.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-brand-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Roteiros de vinhos e experiências nobres
                </div>
              </div>
            </div>
            </TiltCard>

            {/* Card 4: Clima & Natureza Serena */}
            <TiltCard maxRotation={6} scale={1.03} className="h-full">
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-gold-300 transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/assets/lifestyle-natureza.webp"
                  alt="Natureza serena, bosques e araucárias na Serra Gaúcha"
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-900/85 backdrop-blur-md text-gold-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-gold-400/30">
                  <TreePine className="w-3.5 h-3.5" />
                  <span>Clima Serrano</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                    Clima Serrano &amp; Natureza Preservada
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    As quatro estações em sua máxima expressão: o aconchego da lareira e do vinho em dias frios, a floração das hortênsias na primavera e a pureza do ar das matas de araucárias centenárias.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-brand-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Ar puro e araucárias centenárias
                </div>
              </div>
            </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 7. Consultoria Remota para Clientes de Fora do RS (Concierge Virtual) */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-brand-800 shadow-2xl relative overflow-hidden">
            {/* Decoração de fundo sutil */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
                  <Video className="w-4 h-4 text-gold-400" />
                  <span>Atendimento à Distância • Clientes de Todo o Brasil</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Reside em outro estado? Conheça os melhores imóveis da Serra <span className="text-gold-400">sem sair de casa.</span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  Grande parte dos nossos clientes reside em São Paulo, Rio de Janeiro, Brasília, Belo Horizonte e no Nordeste. Desenvolvemos uma assessoria virtual completa, com vistorias em vídeo, análise topográfica e due diligence jurídica para você tomar decisões seguras antes de viajar.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <Video className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Videoconferência &amp; Vistoria ao Vivo:</strong> Apresentação em tempo real do imóvel, incidência solar, vizinhança e relevo.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <FileCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Dossiê Financeiro &amp; Operacional:</strong> Levantamento detalhado de custos, IPTU, taxas condominiais e projeção de retorno.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Due Diligence Jurídica:</strong> Matrícula atualizada no Registro de Imóveis conferida antes de qualquer proposta.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <CalendarCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Roteiro Presencial Sob Medida:</strong> Ao chegar à Serra, você visita apenas as propriedades pré-qualificadas.</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={`https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent("Olá Lázaro! Sou de fora do RS e gostaria de agendar uma consultoria em vídeo para conhecer as oportunidades em Gramado e Canela.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shine inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Agendar Consultoria Virtual com Lázaro</span>
                  </a>
                </div>
              </div>

              {/* Card Resumo Lateral */}
              <div className="lg:col-span-5 bg-brand-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-brand-700/80 space-y-5">
                <h3 className="text-xl font-bold text-white border-b border-brand-800 pb-3">
                  Como funciona a Consultoria Remota:
                </h3>
                <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-brand-950 font-black flex items-center justify-center shrink-0 text-xs">1</span>
                    <span><strong>Diagnóstico de Perfil:</strong> Alinhamento inicial de 15 minutos para mapear o objetivo da sua família ou meta de investimento.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-brand-950 font-black flex items-center justify-center shrink-0 text-xs">2</span>
                    <span><strong>Curadoria Exclusiva:</strong> Apresentação de imóveis selecionados com fotos reais, vídeos em alta resolução e análise de localização.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-brand-950 font-black flex items-center justify-center shrink-0 text-xs">3</span>
                    <span><strong>Visita Guiada Presencial:</strong> Recepção personalizada na Serra Gaúcha para conhecer seus imóveis favoritos com assessoria VIP.</span>
                  </li>
                </ol>
                <div className="pt-2 text-center">
                  <span className="text-xs text-gold-300 font-semibold">
                    ✓ Atendimento consultivo, exclusivo e sem qualquer compromisso de compra
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Apresentação Oficial do Consultor Lázaro Antunes com Foto Recortada em Destaque 3D */}
      <section id="sobre" className="bg-brand-950 text-white py-20 border-t border-brand-900 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Foto Oficial Recortada em Apresentação de Revista com Efeito e Ação no Hover */}
            <div className="lg:col-span-5 relative flex justify-center">
              <a
                href={`https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent(BROKER.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                title="Clique para conversar diretamente com Lázaro Antunes via WhatsApp"
                className="group relative w-full max-w-sm sm:max-w-md h-[520px] sm:h-[590px] rounded-3xl overflow-hidden border-2 border-gold-400/40 hover:border-gold-400 shadow-2xl hover:shadow-[0_0_45px_rgba(212,169,70,0.45)] flex items-end justify-center cursor-pointer transition-all duration-500 block"
              >
                {/* 1. Imagem de Fundo: Vista Aérea Oficial de Gramado */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src="/assets/gramado-aerea.webp"
                    alt="Vista aérea de Gramado com condomínios e relevo da Serra Gaúcha"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover group-hover:scale-115 group-hover:brightness-90 transition-transform duration-700 ease-out"
                  />
                  {/* Gradiente escuro nobre para integrar perfeitamente com a foto de Lázaro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/25 group-hover:via-brand-950/40 transition-colors duration-500" />
                </div>

                {/* 2. Resplendor Dourado Suave atrás dos ombros - Brilha e expande no hover */}
                <div className="absolute top-16 w-80 h-80 bg-gold-400/20 group-hover:bg-gold-400/40 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-700 group-hover:scale-125"></div>

                {/* Badge Flutuante no Topo (Efeito de Ação no Hover) */}
                <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-950/90 backdrop-blur-md border border-gold-500/40 text-gold-300 text-[11px] font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Disponível para Consultoria</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xl">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp VIP</span>
                  </div>
                </div>

                {/* 3. Imagem Recortada de Lázaro Antunes na Frente com Zoom, Elevação 3D e Aura Dourada */}
                <div className="relative z-20 w-full h-full flex items-end justify-center pt-14 pb-2">
                  <Image
                    src="/assets/lazaro-antunes-recorte.webp"
                    alt="Lázaro Antunes, consultor imobiliário na Serra Gaúcha"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] group-hover:drop-shadow-[0_20px_45px_rgba(212,169,70,0.5)] origin-bottom group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out"
                  />
                </div>

                {/* Gradiente sutil na base para apoiar o selo */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent pointer-events-none z-20" />

                {/* Selo no Rodapé da Foto com Efeito Interativo no Hover */}
                <div className="absolute bottom-4 inset-x-4 bg-brand-950/90 group-hover:bg-brand-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-brand-800 group-hover:border-gold-400/80 text-center shadow-2xl z-30 transition-all duration-300">
                  <span className="font-extrabold text-sm sm:text-base text-white block group-hover:text-gold-300 transition-colors">
                    Lázaro Antunes
                  </span>
                  <span className="text-[11px] text-gold-300 font-semibold tracking-wider uppercase block mt-0.5">
                    CRECI 088652-F • Especialista em Gramado &amp; Canela
                  </span>
                  {/* Chamada para Ação que desliza suavemente no Hover */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-hover:mt-2.5 overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold text-brand-950 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 py-1.5 px-4 rounded-xl shadow-md">
                    <MessageCircle className="w-3.5 h-3.5 text-brand-950" />
                    <span>Clique para Falar no WhatsApp &rarr;</span>
                  </div>
                </div>
              </a>

              {/* Badge Flutuante +10 anos na Serra */}
              <div className="absolute -bottom-5 -right-2 sm:-right-4 bg-gold-500 text-brand-950 p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-gold-300 hidden sm:block text-center z-20">
                <span className="font-black text-2xl sm:text-3xl block leading-none">+10 anos</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block mt-1">
                  Na Serra Gaúcha
                </span>
              </div>
            </div>

            {/* Texto de Apresentação */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-800 border border-brand-700 text-gold-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Consultoria Boutique • CRECI {BROKER.creci}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                A precisão técnica e a ética de quem conhece cada rua, cada solo e cada oportunidade desta terra.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Diferente das imobiliárias focadas em metas de vendas em massa, meu trabalho é alicerçado na escuta atenta, na discrição e na defesa irrestrita dos interesses do cliente. Cada negociação é conduzida com rigor técnico, auditoria documental aprofundada e consultoria contínua antes, durante e após a escritura.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200 border-b border-brand-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Vistoria técnica presencial e rigorosa em cada propriedade</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200 border-b border-brand-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Análise de viabilidade e valorização baseada em dados reais de mercado</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200 border-b border-brand-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Assessoria completa de transição e concierge para a sua família</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200 border-b border-brand-800 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>Acesso prioritário a propriedades nobres e oportunidades off-market</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent(BROKER.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Falar com Lázaro no WhatsApp</span>
                </a>
                <Link
                  href="/contato"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-colors"
                >
                  Solicitar Atendimento Exclusivo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Interativo de Moradia & Investimento */}
      <FAQSection />
    </main>
    </PortalLayout>
  );
}