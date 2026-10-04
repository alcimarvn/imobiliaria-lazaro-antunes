"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BROKER, PROPERTIES } from "@/lib/data";
import { BrokerInfo } from "@/lib/types";
import { Phone, Menu, X, MapPin, Sparkles, MessageCircle, ChevronDown, Building2, Heart } from "lucide-react";
import { NavbarSearch } from "./NavbarSearch";
import { FavoritesDrawer } from "./FavoritesDrawer";
import { useFavorites } from "@/lib/useFavorites";

export function Navbar({ broker }: { broker?: BrokerInfo } = {}) {
  const currentBroker = broker || BROKER;
  const [isOpen, setIsOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileCityOpen, setIsMobileCityOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { favorites } = useFavorites();
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [currentQuery, setCurrentQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentQuery(window.location.search);
      const handleLocationChange = () => setCurrentQuery(window.location.search);
      window.addEventListener("popstate", handleLocationChange);
      return () => window.removeEventListener("popstate", handleLocationChange);
    }
  }, [pathname]);

  // Fechar dropdown de cidades ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lista dinâmica de cidades com imóveis cadastrados
  const citiesWithCount = useMemo(() => {
    const counts: { [city: string]: number } = {};
    PROPERTIES.forEach((p) => {
      counts[p.city] = (counts[p.city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => a.city.localeCompare(b.city));
  }, []);

  const isCityActive = currentQuery.toLowerCase().includes("city=");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Bar Institucional de Alto Contraste */}
      <div className="hidden lg:block bg-brand-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gold-300 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Imóveis de Alto Padrão • Serra Gaúcha</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-gold-400" />
              <span>Gramado &amp; Canela - RS</span>
            </span>
          </div>
          <div className="flex items-center gap-5 text-slate-200 font-medium">
            <span className="bg-brand-800 px-2 py-0.5 rounded text-white font-bold">
              CRECI {currentBroker.creci}
            </span>
            <a
              href={`tel:${currentBroker.phone.replace(/\D/g, "")}`}
              className="hover:text-gold-300 transition-colors"
            >
              Plantão: {currentBroker.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo com Foto Oficial do Corretor */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-900 border-2 border-gold-400/80 overflow-hidden shadow-sm group-hover:border-gold-300 group-hover:scale-105 transition-all shrink-0">
              <Image
                src="/assets/lazaro-antunes-recorte.webp"
                alt={currentBroker.name}
                fill
                sizes="48px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="block font-heading text-base sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-brand-900 transition-colors truncate">
                {currentBroker.name}
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
                Corretor • CRECI {currentBroker.creci}
              </span>
            </div>
          </Link>

          {/* Links Desktop Modernos em Cápsula (Dock Navigation) */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 hover:bg-slate-100 p-1.5 rounded-full border border-slate-200/90 shadow-inner backdrop-blur-xs transition-colors">
            {/* Início */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                pathname === "/" && !currentQuery.includes("city")
                  ? "bg-brand-900 text-white shadow-sm"
                  : "text-slate-700 hover:text-brand-900 hover:bg-white"
              }`}
            >
              Início
            </Link>

            {/* Imóveis */}
            <Link
              href="/imoveis"
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                pathname === "/imoveis" && !currentQuery.includes("city")
                  ? "bg-brand-900 text-white shadow-sm"
                  : "text-slate-700 hover:text-brand-900 hover:bg-white"
              }`}
            >
              Imóveis
            </Link>

            {/* Dropdown de Cidades com Imóveis Cadastrados */}
            <div
              ref={cityDropdownRef}
              className="relative"
              onMouseEnter={() => setIsCityDropdownOpen(true)}
              onMouseLeave={() => setIsCityDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isCityActive
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-slate-700 hover:text-brand-900 hover:bg-white"
                }`}
                aria-expanded={isCityDropdownOpen}
              >
                <MapPin className="w-3 h-3 text-gold-400" />
                <span>Cidades</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCityDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu Suspenso de Cidades */}
              {isCityDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-fadeIn backdrop-blur-md before:absolute before:-top-2 before:left-0 before:w-full before:h-2">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Onde temos imóveis:
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {citiesWithCount.map(({ city, count }) => {
                      const isSelected = currentQuery.toLowerCase().includes(`city=${city.toLowerCase()}`);
                      return (
                        <Link
                          key={city}
                          href={`/imoveis?city=${encodeURIComponent(city)}`}
                          onClick={() => setIsCityDropdownOpen(false)}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-brand-50 text-brand-900 border border-brand-200"
                              : "text-slate-700 hover:bg-slate-100 hover:text-brand-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-brand-700" />
                            <span>{city}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                              RS
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {count} {count === 1 ? "imóvel" : "imóveis"}
                          </span>
                        </Link>
                      );
                    })}

                    <div className="pt-1.5 border-t border-slate-100 mt-1">
                      <Link
                        href="/imoveis"
                        onClick={() => setIsCityDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        <span>Ver Todas as Cidades</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quiz */}
            <Link
              href="/#quiz"
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-gold-800 hover:bg-gold-50/80 transition-all duration-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Quiz</span>
            </Link>

            {/* Contato */}
            <Link
              href="/contato"
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                pathname === "/contato"
                  ? "bg-brand-900 text-white shadow-sm"
                  : "text-slate-700 hover:text-brand-900 hover:bg-white"
              }`}
            >
              Contato
            </Link>
          </nav>

          {/* Área Direita: Busca AJAX de Imóveis + Favoritos + CTA WhatsApp */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Busca em AJAX dos Imóveis */}
            <NavbarSearch />

            {/* Botão de Favoritos */}
            <button
              onClick={() => setIsFavoritesOpen(true)}
              title="Ver imóveis favoritados"
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
              aria-label="Ver imóveis favoritos"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Botão Falar no WhatsApp */}
            <a
              href={`https://wa.me/${currentBroker.whatsapp}?text=${encodeURIComponent(currentBroker.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <NavbarSearch />
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Favoritos"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-4 pb-6 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${
              pathname === "/" && !currentQuery.includes("city")
                ? "bg-brand-900 text-white"
                : "text-slate-800 hover:bg-slate-100 hover:text-brand-900"
            }`}
          >
            Início
          </Link>

          <Link
            href="/imoveis"
            onClick={() => setIsOpen(false)}
            className={`block py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${
              pathname === "/imoveis" && !currentQuery.includes("city")
                ? "bg-brand-900 text-white"
                : "text-slate-800 hover:bg-slate-100 hover:text-brand-900"
            }`}
          >
            Todos os Imóveis
          </Link>

          {/* Acordeão de Cidades no Mobile */}
          <div>
            <button
              type="button"
              onClick={() => setIsMobileCityOpen(!isMobileCityOpen)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>Cidades</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  isMobileCityOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileCityOpen && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-100">
                {citiesWithCount.map(({ city, count }) => (
                  <Link
                    key={city}
                    href={`/imoveis?city=${encodeURIComponent(city)}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-2 text-xs font-semibold text-slate-700 hover:text-brand-900"
                  >
                    <span>Imóveis em {city}</span>
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/#quiz"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold text-gold-700 hover:bg-gold-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Descubra seu Imóvel (Quiz)</span>
          </Link>

          <Link
            href="/contato"
            onClick={() => setIsOpen(false)}
            className={`block py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${
              pathname === "/contato"
                ? "bg-brand-900 text-white"
                : "text-slate-800 hover:bg-slate-100 hover:text-brand-900"
            }`}
          >
            Contato
          </Link>

          <div className="pt-3">
            <a
              href={`https://wa.me/${currentBroker.whatsapp}?text=${encodeURIComponent(currentBroker.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Atendimento via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Drawer Lateral de Favoritos */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        brokerPhone={currentBroker.whatsapp}
      />
    </header>
  );
}