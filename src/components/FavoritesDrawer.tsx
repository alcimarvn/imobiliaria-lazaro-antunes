"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, BROKER } from "@/lib/data";
import { useFavorites } from "@/lib/useFavorites";
import { Property } from "@/lib/types";
import { Heart, X, Trash2, ArrowRight, MessageCircle, Building2 } from "lucide-react";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brokerPhone?: string;
}

export function FavoritesDrawer({ isOpen, onClose, brokerPhone }: FavoritesDrawerProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/properties")
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.data) {
            setAllProperties(data.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const favoriteProps = allProperties.filter((p) => favorites.includes(p.id));
  const phone = brokerPhone || BROKER.whatsapp;

  const whatsappMessage = encodeURIComponent(
    `Olá Lázaro! Selecionei estes imóveis como meus favoritos no seu site e gostaria de agendar uma consultoria:\n\n` +
      favoriteProps
        .map(
          (p, i) =>
            `${i + 1}. *${p.title}* (#${p.id}) em ${p.city} - ${formatCurrency(p.price)}\nhttps://lazaroantunesimoveis.com.br/imoveis/${p.id}`
        )
        .join("\n\n")
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-brand-950 text-white flex items-center justify-between border-b border-brand-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Meus Imóveis Salvos</h3>
                <span className="text-xs text-gold-300 font-medium">
                  {favorites.length} {favorites.length === 1 ? "imóvel selecionado" : "imóveis selecionados"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Imóveis */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm">Carregando seus imóveis...</div>
            ) : favoriteProps.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-base">Nenhum imóvel salvo ainda</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Clique no ícone de coração nos imóveis que você mais gostar para criar sua lista personalizada.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-bold text-brand-900 hover:underline cursor-pointer"
                >
                  Explorar catálogo de imóveis
                </button>
              </div>
            ) : (
              favoriteProps.map((prop) => {
                const img = prop.images && prop.images[0] ? prop.images[0] : "/assets/hero-home.jpg";
                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex gap-3.5 items-center relative group"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image src={img} alt={prop.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                        {prop.city} • #{prop.id}
                      </span>
                      <Link
                        href={`/imoveis/${prop.id}`}
                        onClick={onClose}
                        className="font-bold text-sm text-slate-900 hover:text-brand-900 transition-colors line-clamp-1 block"
                      >
                        {prop.title}
                      </Link>
                      <span className="font-black text-sm text-slate-900 block mt-0.5">
                        {formatCurrency(prop.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFavorite(prop.id)}
                      title="Remover dos favoritos"
                      className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé com Botão WhatsApp de Conversão */}
          {favoriteProps.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-200 space-y-3">
              <a
                href={`https://wa.me/${phone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enviar Lista Completa no WhatsApp</span>
              </a>

              <p className="text-[11px] text-slate-400 text-center font-medium">
                Lázaro Antunes receberá todos os imóveis selecionados para checagem imediata de disponibilidade.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
