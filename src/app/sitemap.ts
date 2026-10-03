import { MetadataRoute } from 'next';
import { getAllProperties, getAllCities } from '@/lib/crm-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazaroantunesimoveis.com.br';
  const properties = getAllProperties();
  const cities = getAllCities();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${baseUrl}/imoveis/${prop.id}`,
    lastModified: prop.createdAt ? new Date(prop.createdAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: prop.featured ? 0.9 : 0.8,
  }));

  const cityUrls: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/imoveis?city=${encodeURIComponent(city.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...cityUrls, ...propertyUrls];
}
