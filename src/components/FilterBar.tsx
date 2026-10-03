"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Home, DollarSign, Search, X, BedDouble, Navigation } from "lucide-react";

export interface FilterBarValues {
  city: string;
  neighborhood: string;
  type: string;
  maxPrice: string;
  priceRange: string;
  bedrooms: string;
  search: string;
}

interface FilterBarProps {
  initialCity?: string;
  initialNeighborhood?: string;
  initialType?: string;
  initialMaxPrice?: string;
  initialPriceRange?: string;
  initialBedrooms?: string;
  initialSearch?: string;
  onFilterChange?: (filters: FilterBarValues) => void;
}

export const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  Gramado: [
    "Centro",
    "Bavária",
    "Planalto",
    "Várzea Grande",
    "Carniel",
    "Carazal",
    "Mato Queimado",
    "Moura",
    "Prinstrop",
    "Vale das Montanhas",
    "Floresta",
    "Pórtico"
  ],
  Canela: [
    "Centro",
    "Vila Suzana",
    "Bairro São Lucas",
    "São José",
    "São Luiz",
    "Vila Wortmann",
    "Quinta da Serra",
    "Eugênio Ferreira"
  ],
  "Nova Petrópolis": [
    "Centro",
    "Pousada da Neve",
    "Logradouro",
    "Piá"
  ],
  "São Francisco de Paula": [
    "Centro",
    "Recanto Paraíso",
    "Rondinha"
  ]
};

export function FilterBar({
  initialCity = "",
  initialNeighborhood = "",
  initialType = "",
  initialMaxPrice = "",
  initialPriceRange = "",
  initialBedrooms = "",
  initialSearch = "",
  onFilterChange,
}: FilterBarProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);
  const [type, setType] = useState(initialType);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setCity((prev) => (prev !== initialCity ? initialCity : prev));
  }, [initialCity]);

  useEffect(() => {
    setNeighborhood((prev) => (prev !== initialNeighborhood ? initialNeighborhood : prev));
  }, [initialNeighborhood]);

  useEffect(() => {
    setType((prev) => (prev !== initialType ? initialType : prev));
  }, [initialType]);

  useEffect(() => {
    setMaxPrice((prev) => (prev !== initialMaxPrice ? initialMaxPrice : prev));
  }, [initialMaxPrice]);

  useEffect(() => {
    setPriceRange((prev) => (prev !== initialPriceRange ? initialPriceRange : prev));
  }, [initialPriceRange]);

  useEffect(() => {
    setBedrooms((prev) => (prev !== initialBedrooms ? initialBedrooms : prev));
  }, [initialBedrooms]);

  useEffect(() => {
    setSearch((prev) => (prev !== initialSearch ? initialSearch : prev));
  }, [initialSearch]);

  // Lista de bairros disponíveis baseada na cidade selecionada
  const availableNeighborhoods = useMemo(() => {
    if (city && NEIGHBORHOODS_BY_CITY[city]) {
      return NEIGHBORHOODS_BY_CITY[city];
    }
    return [];
  }, [city]);

  const applyFilter = (
    newCity: string,
    newNeighborhood: string,
    newType: string,
    newMaxPrice: string,
    newPriceRange: string,
    newBedrooms: string,
    newSearch: string
  ) => {
    if (onFilterChange) {
      onFilterChange({
        city: newCity,
        neighborhood: newNeighborhood,
        type: newType,
        maxPrice: newMaxPrice,
        priceRange: newPriceRange,
        bedrooms: newBedrooms,
        search: newSearch,
      });
    } else {
      const params = new URLSearchParams();
      if (newCity) params.set("city", newCity);
      if (newNeighborhood) params.set("neighborhood", newNeighborhood);
      if (newType) params.set("type", newType);
      if (newMaxPrice) params.set("maxPrice", newMaxPrice);
      if (newPriceRange) params.set("priceRange", newPriceRange);
      if (newBedrooms) params.set("bedrooms", newBedrooms);
      if (newSearch) params.set("search", newSearch);
      router.push(`/imoveis?${params.toString()}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    applyFilter(city, neighborhood, type, maxPrice, priceRange, bedrooms, val);
  };

  const clearSearch = () => {
    setSearch("");
    applyFilter(city, neighborhood, type, maxPrice, priceRange, bedrooms, "");
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    // Se trocou de cidade e o bairro atual não pertence a ela, reseta o bairro
    let newNeighborhood = neighborhood;
    if (val && NEIGHBORHOODS_BY_CITY[val] && !NEIGHBORHOODS_BY_CITY[val].includes(neighborhood)) {
      newNeighborhood = "";
      setNeighborhood("");
    }
    applyFilter(val, newNeighborhood, type, maxPrice, priceRange, bedrooms, search);
  };

  const handleNeighborhoodChange = (val: string) => {
    setNeighborhood(val);
    applyFilter(city, val, type, maxPrice, priceRange, bedrooms, search);
  };

  const handleTypeChange = (val: string) => {
    setType(val);
    applyFilter(city, neighborhood, val, maxPrice, priceRange, bedrooms, search);
  };

  const handlePriceRangeChange = (val: string) => {
    setPriceRange(val);
    let max = "";
    if (val === "ate-500") max = "500000";
    else if (val === "500-1m") max = "1000000";
    else if (val === "1m-2m") max = "2000000";
    setMaxPrice(max);
    applyFilter(city, neighborhood, type, max, val, bedrooms, search);
  };

  const handleBedroomsChange = (val: string) => {
    setBedrooms(val);
    applyFilter(city, neighborhood, type, maxPrice, priceRange, val, search);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/30 max-w-5xl mx-auto space-y-3">
      {/* Campo de Busca Textual Livre */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por bairro, condomínio, rua ou diferencial (ex: lareira, piscina, churrasqueira, vista)..."
          className="w-full bg-white hover:bg-slate-50/80 focus:bg-white border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs transition-colors"
        />
        {search && (
          <button
            onClick={clearSearch}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selects em Colunas (5 colunas responsivas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 text-left pt-1 border-t border-slate-100">
        {/* Cidade */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-900" />
            <span>Cidade</span>
          </label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="">Todas as Cidades</option>
            <option value="Gramado">Gramado</option>
            <option value="Canela">Canela</option>
            <option value="Nova Petrópolis">Nova Petrópolis</option>
            <option value="São Francisco de Paula">São Francisco de Paula</option>
          </select>
        </div>

        {/* Bairro */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-brand-900" />
            <span>Bairro</span>
          </label>
          <select
            value={neighborhood}
            onChange={(e) => handleNeighborhoodChange(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="">{city ? `Todos os Bairros (${city})` : "Todos os Bairros"}</option>
            {city && availableNeighborhoods.length > 0 ? (
              availableNeighborhoods.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))
            ) : (
              <>
                <optgroup label="Gramado">
                  {NEIGHBORHOODS_BY_CITY.Gramado.map((b) => (
                    <option key={`Gramado-${b}`} value={b}>{b} (Gramado)</option>
                  ))}
                </optgroup>
                <optgroup label="Canela">
                  {NEIGHBORHOODS_BY_CITY.Canela.map((b) => (
                    <option key={`Canela-${b}`} value={b}>{b} (Canela)</option>
                  ))}
                </optgroup>
                <optgroup label="Nova Petrópolis">
                  {NEIGHBORHOODS_BY_CITY["Nova Petrópolis"].map((b) => (
                    <option key={`NP-${b}`} value={b}>{b} (Nova Petrópolis)</option>
                  ))}
                </optgroup>
              </>
            )}
          </select>
        </div>

        {/* Tipo de Imóvel */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Home className="w-3 h-3 text-brand-900" />
            <span>Tipo</span>
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="">Todos os Tipos</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa em Condomínio</option>
            <option value="Chale">Chalé Suíço / Alpino</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Terreno">Terreno / Lote</option>
          </select>
        </div>

        {/* Faixa de Preço */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-brand-900" />
            <span>Faixa de Preço</span>
          </label>
          <select
            value={priceRange}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="">Qualquer valor</option>
            <option value="ate-500">Até R$ 500.000,00</option>
            <option value="500-1m">R$ 500.000,00 a R$ 1.000.000,00</option>
            <option value="1m-2m">R$ 1.000.000,00 a R$ 2.000.000,00</option>
            <option value="2m+">Acima de R$ 2.000.000,00</option>
          </select>
        </div>

        {/* Quartos */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <BedDouble className="w-3 h-3 text-brand-900" />
            <span>Quartos</span>
          </label>
          <select
            value={bedrooms}
            onChange={(e) => handleBedroomsChange(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-colors shadow-xs"
          >
            <option value="">Todos</option>
            <option value="1">1+ dormitório</option>
            <option value="2">2+ dormitórios</option>
            <option value="3">3+ dormitórios</option>
            <option value="4">4+ dormitórios</option>
          </select>
        </div>
      </div>
    </div>
  );
}
