export type PropertyType = "Casa" | "Apartamento" | "Chale" | "Terreno" | "Cobertura" | string;
export type PropertyStatus = "Venda" | "Aluguel" | string;
export type City = "Gramado" | "Canela" | "Nova Petrópolis" | "São Francisco de Paula" | string;

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  city: City;
  neighborhood: string;
  price: number;
  area: number; // m²
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  featured: boolean;
  images: string[];
  image_captions?: string[];
  highlight_tag?: string;
  payment_conditions?: string;
  purpose?: "lancamento" | "pronto" | "temporada" | "terreno" | "todos";
  features: string[];
  address?: string;
  owner_name?: string;
  owner_phone?: string;
  video_url?: string;
  createdAt: string;
}

export interface BrokerInfo {
  name: string;
  role: string;
  creci: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  city: string;
  state: string;
  bio: string;
  instagram: string;
}
