"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BROKER, getPropertyById } from "@/lib/data";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  MessageCircle
} from "lucide-react";

function ContatoContent() {
  const [broker, setBroker] = useState(BROKER);

  useEffect(() => {
    fetch('/api/content/site-info')
      .then(r => r.json())
      .then(json => {
        if (json.ok && json.data) {
          const d = json.data;
          setBroker({
            name: d.broker_name || broker.name,
            role: d.broker_role || BROKER.role,
            creci: d.broker_creci || broker.creci,
            phone: d.broker_phone || broker.phone,
            whatsapp: d.broker_whatsapp || broker.whatsapp,
            whatsappMessage: d.broker_whatsapp_message || broker.whatsappMessage,
            email: d.broker_email || broker.email,
            address: d.broker_address || broker.address,
            city: d.broker_city || broker.city,
            state: d.broker_state || broker.state,
            bio: d.broker_bio || BROKER.bio,
            instagram: d.broker_instagram || BROKER.instagram,
          });
        }
      })
      .catch(() => {});
  }, []);
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const [relatedProperty, setRelatedProperty] = useState<any>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    tipoInteresse: propertyId ? `Imóvel Cód #${propertyId}` : "Comprar Imóvel",
    mensagem: "",
  });

  useEffect(() => {
    if (propertyId) {
      fetch(`/api/properties/${propertyId}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.ok && json.data) {
            setRelatedProperty(json.data);
            setFormData((prev) => ({
              ...prev,
              tipoInteresse: `Imóvel Cód #${json.data.id} - ${json.data.title}`,
              mensagem: prev.mensagem || `Olá Lázaro, tenho interesse no imóvel #${json.data.id} (${json.data.title}) em ${json.data.city}. Gostaria de mais informações e agendar uma visita.`,
            }));
          }
        })
        .catch(() => {});
    }
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nome,
          phone: formData.telefone,
          email: formData.email,
          message: `[Interesse: ${formData.tipoInteresse}] ${formData.mensagem}`,
          property_id: propertyId || (relatedProperty ? relatedProperty.id : null),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível enviar sua mensagem.");
      }
      setFormSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Erro ao conectar com o servidor. Tente novamente ou use o WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 block">
            Atendimento Boutique • Serra Gaúcha
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consultoria Personalizada &amp; Canal Direto
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
            Estamos à sua disposição para compreender o seu momento, agendar visitas exclusivas e apresentar as propriedades mais nobres de Gramado e Canela.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Formulário */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Mensagem Enviada com Sucesso!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed font-normal">
                    Obrigado pelo contato, {formData.nome}. Lázaro Antunes responderá sua mensagem com prioridade via WhatsApp ou ligação.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Envie sua Solicitação</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Preencha os campos abaixo para receber uma consultoria atenciosa e confidencial.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          WhatsApp / Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="(54) 99999-9999"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seuemail@exemplo.com"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Tipo de Interesse
                      </label>
                      <select
                        value={formData.tipoInteresse}
                        onChange={(e) => setFormData({ ...formData, tipoInteresse: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
                      >
                        {relatedProperty && (
                          <option value={`Imóvel Cód #${relatedProperty.id} - ${relatedProperty.title}`}>
                            Imóvel Cód #${relatedProperty.id} - {relatedProperty.title}
                          </option>
                        )}
                        <option value="Comprar Imóvel">Comprar Imóvel para Moradia</option>
                        <option value="Investir em Temporada">Investimento para Renda (Temporada / Airbnb)</option>
                        <option value="Vender meu Imóvel">Quero vender meu imóvel em Gramado ou Canela</option>
                        <option value="Consultoria Geral">Dúvidas ou Consultoria Geral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Mensagem *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder="Descreva o que você procura (quantidade de quartos, localização preferida, etc.)..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-900 hover:bg-brand-800 disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-gold-400" />
                    <span>{isSubmitting ? "Enviando Mensagem..." : "Enviar Mensagem"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Dados de Contato Direto com Foto Oficial do Corretor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="relative w-14 h-14 rounded-2xl bg-brand-900 border-2 border-gold-400/80 overflow-hidden shadow-xs shrink-0">
                  <Image
                    src="/assets/lazaro-antunes-recorte.webp"
                    alt={broker.name}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{broker.name}</h3>
                  <p className="text-xs text-brand-700 font-bold uppercase">CRECI {broker.creci}</p>
                  <p className="text-xs text-slate-500">Gramado e Canela - RS</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Endereço
                    </span>
                    <p className="text-slate-600 mt-0.5">{broker.address}, {broker.city} - {broker.state}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Telefone &amp; WhatsApp
                    </span>
                    <p className="text-slate-600 mt-0.5">{broker.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      E-mail Direto
                    </span>
                    <p className="text-slate-600 mt-0.5">{broker.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                      Horário de Atendimento
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Segunda a Sábado das 08h30 às 19h00 (Domingos sob agendamento)
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de WhatsApp Padronizado */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${broker.whatsapp}?text=${encodeURIComponent(broker.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Falar no WhatsApp Agora</span>
                </a>
              </div>
            </div>

            {/* Sigilo */}
            <div className="bg-brand-900 text-white rounded-2xl p-6 flex items-start gap-4">
              <Lock className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">Segurança e Sigilo Absolutos</h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Todas as negociações são conduzidas com sigilo profissional e acompanhamento jurídico até a assinatura da escritura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContatoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-16 text-center text-slate-500 font-medium">Carregando contato...</div>}>
      <ContatoContent />
    </Suspense>
  );
}