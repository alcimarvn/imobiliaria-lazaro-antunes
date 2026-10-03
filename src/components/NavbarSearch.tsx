"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, MapPin, ArrowRight, Building2 } from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/data";

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Chamada AJAX com debounce de 250ms
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/imoveis/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Erro na busca AJAX:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Fechar dropdown ao clicar fora ou pressionar ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/imoveis?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Campo de Entrada AJAX */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex items-center w-40 sm:w-48 lg:w-56 focus-within:w-60 lg:focus-within:w-64 transition-all duration-300">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim()) setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim() && results.length > 0) setIsOpen(true);
            }}
            placeholder="Buscar imóveis..."
            className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-semibold pl-9 pr-8 py-2 rounded-full border border-slate-200/90 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-inner focus:shadow-md transition-all outline-none"
            aria-label="Buscar imóveis na Serra Gaúcha"
          />

          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />

          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-brand-700 animate-spin absolute right-3 pointer-events-none" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Painel Flutuante Suspenso de Resultados AJAX */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-fadeIn backdrop-blur-md">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isLoading ? "Buscando..." : `${results.length} resultado${results.length === 1 ? "" : "s"} para "${query}"`}
            </span>
            <span className="text-[10px] text-slate-400">ESC para fechar</span>
          </div>

          {/* Lista de Imóveis Encontrados */}
          {results.length > 0 ? (
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/imoveis/${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-brand-100 text-brand-800">
                        {item.city}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-900 truncate leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                  href={`/imoveis?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 py-1"
                >
                  <span>Ver todos os resultados no catálogo</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="py-6 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Nenhum imóvel encontrado para "{query}"
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tente buscar por "Canela", "Gramado", "Chalé", "Casa", "Centro" ou fale diretamente com Lázaro.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}