"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TreePine,
  Home,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ChevronRight,
  MapPin,
  SlidersHorizontal,
  DollarSign
} from "lucide-react";
import { BROKER, PROPERTIES, formatCurrency } from "@/lib/data";
import { Property } from "@/lib/types";

interface Option {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

interface Step {
  title: string;
  subtitle: string;
  options: Option[];
}

const QUIZ_STEPS: Step[] = [
  {
    title: "1. Qual é o seu objetivo principal na Serra Gaúcha?",
    subtitle: "Selecione o momento de vida que melhor descreve sua intenção de compra.",
    options: [
      {
        id: "investimento",
        label: "Investimento para Renda (Airbnb / Temporada)",
        description: "Alta taxa de ocupação com turismo ininterrupto e valorização patrimonial.",
        icon: TrendingUp,
        tag: "Alta Rentabilidade",
      },
      {
        id: "moradia",
        label: "Moradia Familiar ou Mudança de Vida",
        description: "Qualidade de vida, ar puro e um dos melhores índices de segurança do país.",
        icon: Home,
        tag: "Segurança & Vida",
      },
      {
        id: "refugio",
        label: "Refúgio de Lazer, Férias e Finais de Semana",
        description: "Seu segundo lar na serra para relaxar junto à lareira com a família e amigos.",
        icon: TreePine,
        tag: "Lazer & Descanso",
      },
      {
        id: "todos_objetivos",
        label: "Aberto a Oportunidades (Todos os Objetivos)",
        description: "Quero conhecer o que há de melhor e mais vantajoso no mercado no momento.",
        icon: Compass,
        tag: "Visão Geral",
      },
    ],
  },
  {
    title: "2. Que tipo de imóvel você procura?",
    subtitle: "Escolha o estilo que atende às suas necessidades ou selecione 'Todos'.",
    options: [
      {
        id: "Apartamento",
        label: "Apartamentos & Lançamentos",
        description: "Práticos, perto de serviços e excelentes para locação de temporada.",
        icon: Building2,
        tag: "Praticidade",
      },
      {
        id: "Chale",
        label: "Chalés Serranos & Alpinos",
        description: "Estilo europeu em madeira e pedra com lareira, cercados de araucárias.",
        icon: TreePine,
        tag: "Charme Serrano",
      },
      {
        id: "Casa",
        label: "Casas em Condomínio Fechado",
        description: "Amplo espaço, privacidade total, clube de lazer e segurança armada 24h.",
        icon: ShieldCheck,
        tag: "Exclusividade",
      },
      {
        id: "Cobertura",
        label: "Coberturas Panorâmicas",
        description: "Espaço gourmet privativo, terraço com spa e vista para a cidade ou montanhas.",
        icon: Sparkles,
        tag: "Alto Padrão",
      },
      {
        id: "Terreno",
        label: "Terrenos & Lotes em Condomínio",
        description: "Lotes planos para construir a casa dos seus sonhos no seu próprio ritmo.",
        icon: Compass,
        tag: "Construção",
      },
      {
        id: "todos_tipos",
        label: "Todos os Tipos de Imóveis",
        description: "Não tenho preferência fixa, quero ver todas as opções disponíveis.",
        icon: SlidersHorizontal,
        tag: "Completo",
      },
    ],
  },
  {
    title: "3. Em qual cidade você tem preferência?",
    subtitle: "Gramado e Canela são cidades vizinhas e complementares na Serra Gaúcha.",
    options: [
      {
        id: "Gramado",
        label: "Gramado",
        description: "Polo gastronômico, charme europeu, Rua Coberta e grande valorização.",
        icon: MapPin,
        tag: "Internacional",
      },
      {
        id: "Canela",
        label: "Canela",
        description: "Tranquilidade, natureza exuberante, Catedral de Pedra e condomínios verdes.",
        icon: MapPin,
        tag: "Natureza & Paz",
      },
      {
        id: "ambas",
        label: "Tanto Gramado quanto Canela (Ambas)",
        description: "Estou aberto às melhores oportunidades em qualquer uma das duas cidades.",
        icon: Compass,
        tag: "Sem Restrição",
      },
    ],
  },
  {
    title: "4. Qual a sua faixa de investimento planejada?",
    subtitle: "Para apresentarmos imóveis compatíveis com o seu planejamento financeiro.",
    options: [
      {
        id: "ate_800k",
        label: "Até R$ 800.000,00",
        description: "Excelente para investimento de entrada com alta liquidez ou primeira moradia.",
        icon: DollarSign,
      },
      {
        id: "800k_15m",
        label: "De R$ 800.000,00 a R$ 1.500.000,00",
        description: "Apartamentos centrais refinados e chalés aconchegantes com vista.",
        icon: DollarSign,
      },
      {
        id: "acima_15m",
        label: "Acima de R$ 1.500.000,00",
        description: "Casas em condomínio de luxo, coberturas panorâmicas e propriedades nobres.",
        icon: DollarSign,
      },
      {
        id: "qualquer_valor",
        label: "Qualquer Faixa de Valor",
        description: "O foco principal é encontrar o imóvel perfeito, independentemente do preço.",
        icon: Sparkles,
      },
    ],
  },
];

export function PropertyQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (optionId: string) => {
    const updated = { ...answers, [currentStep]: optionId };
    setAnswers(updated);

    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // Filtragem que contempla 100% dos imóveis da base real
  const recommendedProperties = useMemo(() => {
    if (!isCompleted) return [];

    const goal = answers[0] || "todos_objetivos";
    const selectedType = answers[1] || "todos_tipos";
    const selectedCity = answers[2] || "ambas";
    const selectedPrice = answers[3] || "qualquer_valor";

    let results = PROPERTIES.filter((p) => {
      // 1. Filtro de Tipo
      if (selectedType !== "todos_tipos" && p.type !== selectedType) {
        return false;
      }

      // 2. Filtro de Cidade
      if (selectedCity !== "ambas" && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // 3. Filtro de Faixa de Preço
      if (selectedPrice === "ate_800k" && p.price > 800000) {
        return false;
      }
      if (selectedPrice === "800k_15m" && (p.price < 800000 || p.price > 1500000)) {
        return false;
      }
      if (selectedPrice === "acima_15m" && p.price < 1500000) {
        return false;
      }

      return true;
    });

    // Se a combinação super restrita não encontrar imóveis, relaxa a busca para mostrar os mais próximos da cidade/tipo
    if (results.length === 0) {
      if (selectedType !== "todos_tipos") {
        results = PROPERTIES.filter((p) => p.type === selectedType);
      }
      if (results.length === 0 && selectedCity !== "ambas") {
        results = PROPERTIES.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
      }
      if (results.length === 0) {
        results = PROPERTIES.slice(0, 4);
      }
    }

    return results;
  }, [isCompleted, answers]);

  // Textos para resumo do perfil
  const profileSummary = useMemo(() => {
    const goalMap: { [key: string]: string } = {
      investimento: "Investimento para Renda (Airbnb / Temporada)",
      moradia: "Moradia Familiar / Mudança de Vida",
      refugio: "Refúgio de Lazer & Férias",
      todos_objetivos: "Oportunidades em Geral",
    };
    const typeMap: { [key: string]: string } = {
      Apartamento: "Apartamentos & Lançamentos",
      Chale: "Chalés Serranos",
      Casa: "Casas em Condomínio Fechado",
      Cobertura: "Coberturas Panorâmicas",
      Terreno: "Terrenos & Lotes em Condomínio",
      todos_tipos: "Todos os Tipos de Imóveis",
    };
    const cityMap: { [key: string]: string } = {
      Gramado: "Gramado",
      Canela: "Canela",
      ambas: "Gramado e Canela (Ambas)",
    };

    return {
      goal: goalMap[answers[0]] || "Todos os Objetivos",
      type: typeMap[answers[1]] || "Todos os Tipos",
      city: cityMap[answers[2]] || "Gramado e Canela",
    };
  }, [answers]);

  const whatsappQuizText = `Olá Lázaro! Fiz o quiz no seu site e selecionei:
- Objetivo: ${profileSummary.goal}
- Tipo de Imóvel: ${profileSummary.type}
- Cidade: ${profileSummary.city}
Gostaria de ver as opções disponíveis para o meu perfil!`;

  const whatsappUrl = `https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent(whatsappQuizText)}`;

  const progressPercentage = isCompleted
    ? 100
    : Math.round(((currentStep + 1) / QUIZ_STEPS.length) * 100);

  return (
    <section id="quiz" className="bg-slate-900 text-white py-20 relative overflow-hidden border-b border-brand-900">
      {/* Luz de fundo decorativa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Assistente Interativo de Escolha</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Descubra seu <span className="text-gold-400">Imóvel Ideal</span> na Serra Gaúcha
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Responda 4 perguntas rápidas para filtrar casas, chalés, apartamentos e terrenos em Gramado e Canela.
          </p>
        </div>

        {/* Card do Quiz com Efeito Glass */}
        <div className="bg-brand-950/90 border border-brand-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Barra de Progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <span>{isCompleted ? "Resultado Personalizado" : `Etapa ${currentStep + 1} de ${QUIZ_STEPS.length}`}</span>
              <span className="text-gold-400">{progressPercentage}% concluído</span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {!isCompleted ? (
            /* Perguntas */
            <div className="space-y-6">
              <div className="text-left space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {QUIZ_STEPS[currentStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-normal">
                  {QUIZ_STEPS[currentStep].subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {QUIZ_STEPS[currentStep].options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = answers[currentStep] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-brand-900/90 border-gold-400 shadow-lg scale-[1.01]"
                          : "bg-brand-900/40 hover:bg-brand-900/70 border-brand-800/80 hover:border-gold-500/50 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-300 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-brand-950 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        {opt.tag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-800 text-slate-300 border border-brand-700">
                            {opt.tag}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-gold-300 transition-colors flex items-center justify-between">
                          <span>{opt.label}</span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentStep > 0 && (
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    &larr; Voltar para etapa anterior
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Tela Final de Resultado */
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-400/40 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
                  Perfil Identificado com Sucesso
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Imóveis que Combinam com o Seu Perfil
                </h3>
                <p className="text-sm text-slate-300 max-w-xl mx-auto font-normal">
                  Foco: <strong>{profileSummary.type}</strong> em <strong>{profileSummary.city}</strong> para <strong>{profileSummary.goal}</strong>.
                </p>
              </div>

              {/* Grid de Imóveis Compatíveis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-brand-900/60 rounded-2xl border border-brand-800 p-4 flex flex-col justify-between space-y-3 hover:border-gold-500/50 transition-colors"
                  >
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-800">
                      <Image
                        src={prop.images[0]}
                        alt={prop.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-brand-950/90 px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase">
                          {prop.city} • RS
                        </span>
                        <span className="bg-brand-800/90 px-2 py-0.5 rounded-md text-[10px] font-bold text-gold-300 uppercase">
                          {prop.type}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-lg font-black text-white block">
                        {formatCurrency(prop.price)}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {prop.neighborhood}, {prop.city}
                      </p>
                    </div>

                    <Link
                      href={`/imoveis/${prop.id}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-brand-700"
                    >
                      <span>Ver Ficha Completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Ação de Conversão VIP */}
              <div className="pt-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900 to-brand-800 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">
                    Quer receber mais opções deste perfil?
                  </h4>
                  <p className="text-xs text-slate-300 font-normal">
                    Fale com Lázaro Antunes no WhatsApp e receba oportunidades que acabaram de entrar no catálogo.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Falar com Lázaro no WhatsApp</span>
                  </a>

                  <button
                    onClick={resetQuiz}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/20"
                    title="Recomeçar o quiz"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refazer Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}