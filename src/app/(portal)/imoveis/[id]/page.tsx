import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/data";
import { getPropertyById, getAllProperties, getBrokerInfo } from "@/lib/crm-db";
import { PropertyDetailsClient } from "@/components/PropertyDetailsClient";

interface PropertyDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyDetailsPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id);

  if (!property) {
    return {
      title: "Imóvel não encontrado | " + getBrokerInfo().name,
    };
  }

  const title = `${property.title} (${property.city}) - ${formatCurrency(property.price)} | ${getBrokerInfo().name}`;
  const description = `${property.type} à venda em ${property.city} - RS (${property.neighborhood}). ${property.area} m², ${property.bedrooms} dormitórios. Confira detalhes e agende sua visita com Lázaro Antunes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.images && property.images.length > 0 ? [property.images[0]] : ["/assets/hero-home.jpg"],
      locale: "pt_BR",
      type: "article",
    },
  };
}

export function generateStaticParams() {
  const properties = getAllProperties();
  return properties.map((prop) => ({
    id: String(prop.id),
  }));
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const property = getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const broker = getBrokerInfo();

  // Obter até 3 imóveis semelhantes (da mesma cidade ou tipo, excluindo o atual)
  const similarProperties = getAllProperties().filter((p) => p.id !== property.id)
    .sort((a, b) => {
      // Prioriza mesma cidade
      if (a.city === property.city && b.city !== property.city) return -1;
      if (a.city !== property.city && b.city === property.city) return 1;
      // Depois mesmo tipo
      if (a.type === property.type && b.type !== property.type) return -1;
      if (a.type !== property.type && b.type === property.type) return 1;
      return 0;
    })
    .slice(0, 3);

  // Schema.org para o Google Search (Rich Snippets)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://lazaroantunesimoveis.com.br/imoveis/${property.id}`,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "validFrom": property.createdAt || new Date().toISOString(),
    },
    "category": property.type,
    "image": property.images && property.images.length > 0 ? property.images : undefined,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressRegion": "RS",
      "addressCountry": "BR",
      "streetAddress": property.neighborhood || property.address,
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailsClient
        property={property}
        broker={broker}
        similarProperties={similarProperties}
      />
    </>
  );
}
