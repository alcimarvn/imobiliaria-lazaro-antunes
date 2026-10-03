"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterBar, FilterBarValues } from "@/components/FilterBar";
import {
  Building2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Home,
  ArrowUpDown,
  KeyRound,
  Compass,
  MessageCircle
} from "lucide-react";

type SortOption = "featured" | "price_asc" | "price_desc" | "area_desc" | "newest";
type IntentOption = "todos" | "lancamento" | "pronto" | "temporada";

function ImoveisContent() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setProperties(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "";
  const initialNeighborhood = searchParams.get("neighborhood") || "";
  const initialType = searchParams.get("type") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialPriceRange = searchParams.get("priceRange") || "";
  const initialBedrooms = searchParams.get("bedrooms") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialIntent = (searchParams.get("intent") as IntentOption) || "todos";

  const [filters, setFilters] = useState<FilterBarValues>({
    city: initialCity,
    neighborhood: initialNeighborhood,
    type: initialType,
    maxPrice: initialMaxPrice,
    priceRange: initialPriceRange,
    bedrooms: initialBedrooms,
    search: initialSearch,
  });

  const [intent, setIntent] = useState<IntentOption>(initialIntent);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredProperties = useMemo(() => {
    let list = properties.filter((property) => {
      // 1. Filtro por Intenção
      if (intent !== "todos") {
        if (intent === "lancamento") {
          const isLanc =
            property.purpose === "lancamento" ||
            property.title.toLowerCase().includes("lançamento") ||
            property.description.toLowerCase().includes("planta") ||
            property.description.toLowerCase().includes("lançamento");
          if (!isLanc) return false;
        } else if (intent === "pronto") {
          const isPronto =
            property.purpose === "pronto" ||
            property.title.toLowerCase().includes("pronto") ||
            property.description.toLowerCase().includes("pronto para morar") ||
            property.description.toLowerCase().includes("nunca habitada") ||
            property.description.toLowerCase().includes("mobiliado");
          if (!isPronto) return false;
        } else if (intent === "temporada") {
          const isTemporada =
            property.purpose === "temporada" ||
            property.description.toLowerCase().includes("airbnb") ||
            property.description.toLowerCase().includes("temporada") ||
            property.description.toLowerCase().includes("rentabilidade") ||
            property.features.some((f: string) =>
              f.toLowerCase().includes("airbnb") ||
              f.toLowerCase().includes("rentabilidade") ||
              f.toLowerCase().includes("temporada")
            );
          if (!isTemporada) return false;
        }
      }

      // 2. Filtro de Cidade
      if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // 2.1 Filtro de Bairro
      if (filters.neighborhood && property.neighborhood) {
        if (!property.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) {
          return false;
        }
      }

      // 3. Filtro de Tipo
      if (filters.type && property.type.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }

      // 4. Filtro de Faixa de Preço
      if (filters.priceRange) {
        if (filters.priceRange === "ate-500" && property.price > 500000) return false;
        if (filters.priceRange === "500-1m" && (property.price < 500000 || property.price > 1000000)) return false;
        if (filters.priceRange === "1m-2m" && (property.price < 1000000 || property.price > 2000000)) return false;
        if (filters.priceRange === "2m+" && property.price < 2000000) return false;
      } else if (filters.maxPrice && property.price > Number(filters.maxPrice)) {
        return false;
      }

      // 5. Filtro de Quartos (1+, 2+, 3+, 4+)
      if (filters.bedrooms && Number(filters.bedrooms) > 0) {
        if (property.bedrooms < Number(filters.bedrooms)) return false;
      }

      // 6. Filtro por Busca Textual Livre
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const inTitle = property.title.toLowerCase().includes(q);
        const inDesc = property.description.toLowerCase().includes(q);
        const inCity = property.city.toLowerCase().includes(q);
        const inNeighborhood = property.neighborhood.toLowerCase().includes(q);
        const inFeatures = property.features.some((f: string) => f.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inCity && !inNeighborhood && !inFeatures) {
          return false;
        }
      }
      return true;
    });

    // Ordenação
    list.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "area_desc":
          return b.area - a.area;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "featured":
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return list;
  }, [properties, filters, intent, sortBy]);

  const resetFilters = () => {
    setFilters({ city: "", neighborhood: "", type: "", maxPrice: "", priceRange: "", bedrooms: "", search: "" });
    setIntent("todos");
    setSortBy("featured");
  };

  const isFiltered = Boolean(
    filters.city ||
    filters.neighborhood ||
    filters.type ||
    filters.maxPrice ||
    filters.priceRange ||
    filters.bedrooms ||
    filters.search ||
    intent !== "todos"
  );

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Barra Superior Compacta: Título + Abas de Intenção + Ordenador (1 Linha) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          {/* Título Enxuto com Contador */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {filters.city ? `Imóveis em ${filters.city}` : "Imóveis na Serra Gaúcha"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-900 text-white shrink-0">
              {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel" : "imóveis"}
            </span>
            {filters.neighborhood && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700 text-white shrink-0">
                {filters.neighborhood}
              </span>
            )}
          </div>

          {/* Abas Compactas de Intenção em 1 Linha (Pílulas Rápidas) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto no-scrollbar text-xs font-bold">
            <button
              onClick={() => setIntent("todos")}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                intent === "todos"
                  ? "bg-brand-950 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-gold-400" />
              <span>Todos os Imóveis</span>
            </button>

            <button
              onClick={() => setIntent("lancamento")}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                intent === "lancamento"
                  ? "bg-brand-950 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-gold-400" />
              <span>Lançamentos</span>
            </button>

            <button
              onClick={() => setIntent("pronto")}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                intent === "pronto"
                  ? "bg-brand-950 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-gold-400" />
              <span>Prontos para Morar</span>
            </button>

            <button
              onClick={() => setIntent("temporada")}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                intent === "temporada"
                  ? "bg-brand-950 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
              <span>Airbnb / Temporada</span>
            </button>
          </div>

          {/* Ordenador + Botão Limpar */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
              >
                <option value="featured">Destaques</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="area_desc">Maior Área</option>
                <option value="newest">Mais Recentes</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Filtros Compacta (Busca + Cidade + Bairro + Tipo + Preço + Quartos) */}
        <div>
          <FilterBar
            initialCity={filters.city}
            initialNeighborhood={filters.neighborhood}
            initialType={filters.type}
            initialMaxPrice={filters.maxPrice}
            initialPriceRange={filters.priceRange}
            initialBedrooms={filters.bedrooms}
            initialSearch={filters.search}
            onFilterChange={(newFilters) => setFilters(newFilters)}
          />
        </div>

        {/* Grade de Imóveis (Aparece IMEDIATAMENTE no topo da tela) */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-9 h-9 border-4 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Carregando imóveis...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-brand-50 text-brand-900 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7 text-brand-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Nenhum imóvel encontrado com esses filtros
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Não localizamos propriedades com esses critérios exatos. Tente ajustar os filtros ou solicite uma busca personalizada off-market diretamente com Lázaro Antunes.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={resetFilters}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
              <a
                href="https://wa.me/555499836456?text=Ol%C3%A1%20L%C3%A1zaro%2C%20procuro%20um%20im%C3%B3vel%20espec%C3%ADfico%20na%20Serra%20Ga%C3%BAcha%20e%20gostaria%20de%20ajuda%20para%20encontrar."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Solicitar Imóvel sob Medida</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImoveisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ImoveisContent />
    </Suspense>
  );
}
