"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { BROKER } from "@/lib/data";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Como funciona a rentabilidade com aluguel por temporada (Airbnb) em Gramado e Canela?",
    answer:
      "A Serra Gaúcha recebe mais de 7 milhões de visitantes ao ano com turismo distribuído estrategicamente entre as quatro estações: o inverno rigoroso, a Páscoa, o renomado Festival de Cinema e os quase três meses de programação do Natal Luz. Imóveis bem posicionados em Gramado e Canela alcançam taxas de ocupação expressivas e rentabilidade líquida entre 8% e 14% ao ano, superando com folga os índices da locação residencial tradicional e de outros centros urbanos.",
  },
  {
    question: "Resido em outro estado. É realmente seguro adquirir uma propriedade à distância?",
    answer:
      "Sim, com total respaldo e segurança jurídica, desde que conduzido por um corretor devidamente credenciado e com vivência local. Realizamos um minucioso processo de due diligence para clientes de fora do Rio Grande do Sul: auditoria de matrícula atualizada no Cartório de Registro de Imóveis, certidões negativas de ônus fiscais e trabalhistas, verificação de habite-se, vistoria técnica em tempo real por vídeo e assinatura contratual com certificação digital de validade jurídica nacional.",
  },
  {
    question: "Quais são as diferenças estratégicas entre escolher Gramado ou Canela?",
    answer:
      "Gramado é o epicentro cosmopolita da Serra, consolidado internacionalmente, com o maior valor de metro quadrado e excelente liquidez para aluguel de temporada. Canela, situada a apenas 7 km, preserva um perfil bucólico e sereno, com terrenos mais amplos, condomínios com abundância de araucárias e valores de aquisição atrativos — sendo a escolha predileta de quem busca residência fixa, segundo lar com privacidade ou excelente margem de valorização futura.",
  },
  {
    question: "Como funcionam as condições de pagamento, parcelamento direto e permutas?",
    answer:
      "O mercado imobiliário da Serra Gaúcha é notável pela flexibilidade comercial. É bastante comum a negociação com parcelamento direto com construtoras e proprietários em até 60x a 84x com correção suave (normalmente INCC-M ou IPCA), além da possibilidade de inclusão de veículos ou outros imóveis como parte do pagamento. Em nossa consultoria, estruturamos a proposta mais vantajosa para o seu fluxo financeiro.",
  },
  {
    question: "Quais são os custos médios com condomínio e IPTU na região?",
    answer:
      "Os valores variam conforme a infraestrutura de cada empreendimento. Apartamentos bem localizados têm cotas condominiais habituais entre R$ 350 e R$ 750 mensais. Residências em condomínios fechados de altíssimo luxo (com segurança armada 24h, clube social, quadras e lagos privativos) variam de R$ 600 a R$ 1.800 mensais. Fornecemos uma lâmina financeira completa com todos os custos fixos previstos antes de qualquer tomada de decisão.",
  },
  {
    question: "Por que optar pela consultoria de Lázaro Antunes em vez de uma imobiliária tradicional?",
    answer:
      "Enquanto as imobiliárias convencionais operam orientadas a metas de volume e catálogos massificados, meu trabalho (CRECI 088652-F) é estritamente consultivo e sob medida. Atuo como seu assessor de confiança na Serra Gaúcha, defendendo os seus interesses patrimoniais, filtrando com rigor apenas oportunidades idôneas e oferecendo suporte integral e discreto, da escolha do imóvel à assinatura da escritura definitiva.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-700" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes sobre Morar ou Investir
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-normal">
            Respostas claras para as principais dúvidas de quem planeja adquirir um patrimônio seguro na Serra Gaúcha.
          </p>
        </div>

        {/* Acordeão */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-brand-900 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chamada para tirar outra dúvida */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Tem outra pergunta específica?</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Fale diretamente com Lázaro Antunes e receba uma orientação personalizada sem compromisso.
            </p>
          </div>
          <a
            href={`https://wa.me/${BROKER.whatsapp}?text=${encodeURIComponent("Olá Lázaro! Tenho uma dúvida sobre compra de imóveis na Serra Gaúcha.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Tirar Dúvida no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}