import { BrokerInfo, Property } from "./types";

export const BROKER: BrokerInfo = {
  name: "Lázaro Antunes",
  role: "Corretor de Imóveis • Especialista na Serra Gaúcha",
  creci: "088652-F",
  phone: "(54) 9983-6456",
  whatsapp: "555499836456",
  whatsappMessage: "Olá Lázaro! Visitei seu site e gostaria de orientação para comprar ou investir em imóveis na Serra Gaúcha.",
  email: "contato@lazaroantunes.com.br",
  address: "Centro",
  city: "Gramado",
  state: "RS",
  bio: "Consultoria boutique para quem quer se mudar para Gramado ou investir em imóveis de alto padrão na Serra Gaúcha. Mais de 10 anos de vivência local, com suporte premium, segurança jurídica e clareza.",
  instagram: "https://www.instagram.com/lazaroantunescorretor/",
};

export const PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "apartamento-subtelhado-2-suites-rooftop-canela",
    title: "Apartamento Subtelhado com 2 Suítes e Rooftop em Canela",
    description: "A opção mais premium para você viver com sofisticação e tranquilidade na Serra Gaúcha! Este lindíssimo apartamento conta com amplos 93,28 m² de área privativa, 2 espaçosas suítes e lavabo. Living integrado à sacada com churrasqueira individual, vidros duplos, persianas automatizadas e esperas para lareira e split. Condomínio boutique com apenas 26 unidades, rooftop decorado, espaço gourmet e academia a 800 metros da Catedral de Pedra.",
    type: "Apartamento",
    status: "Venda",
    city: "Canela",
    neighborhood: "Centro",
    price: 1359683,
    area: 93,
    bedrooms: 2,
    suites: 2,
    bathrooms: 3,
    parkingSpots: 1,
    featured: true,
    images: [
      "/uploads/property-subtelhado-canela.webp",
      "/assets/atmosfera-investimento.jpg"
    ],
    features: [
      "Subtelhado exclusivo",
      "2 amplas suítes + lavabo",
      "Vidros duplos termoacústicos",
      "Sacada com churrasqueira",
      "Rooftop gourmet e academia"
    ],
    createdAt: "2026-09-01"
  },
  {
    id: "2",
    slug: "amplo-apartamento-2-dormitorios-rua-coberta-gramado",
    title: "Amplo Apartamento a Poucas Quadras da Rua Coberta",
    description: "Oportunidade premium para investir ou morar no coração de Gramado! Apartamento com 74 m² de área privativa, 2 dormitórios (1 suíte), ampla sala de estar e jantar conectadas à sacada com churrasqueira a carvão. Espera para lareira a lenha e climatização, piso vinílico e porcelanato, rebaixo em gesso e fechadura eletrônica. O condomínio oferece pit fire ao ar livre, salão de festas e serviço de gestão inteligente para locação por temporada.",
    type: "Apartamento",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Centro",
    price: 962000,
    area: 74,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    parkingSpots: 1,
    featured: true,
    images: [
      "/uploads/property-ruacoberta-gramado.webp",
      "/assets/hero-home.jpg"
    ],
    features: [
      "A poucas quadras da Rua Coberta",
      "Gestão completa para Airbnb",
      "Sacada com churrasqueira",
      "Espera para lareira a lenha",
      "Pit fire ao ar livre"
    ],
    createdAt: "2026-09-05"
  },
  {
    id: "3",
    slug: "chale-suico-tradicional-vista-vale-canela",
    title: "Chalé Suíço Tradicional em Madeira Nobre e Pedra com Vista",
    description: "Autêntico chalé alpino no estilo da serra, construído em madeira de lei e alvenaria de pedra. Ampla sala de estar com imponente lareira a lenha, pé direito duplo, varanda gourmet envidraçada com vista permanente para o vale e as araucárias. Possui 3 dormitórios (2 suítes), calefação instalada, cozinha rústica com fogão campeiro e jardim privativo de 600 m².",
    type: "Chale",
    status: "Venda",
    city: "Canela",
    neighborhood: "Vila Suzana",
    price: 1250000,
    area: 160,
    bedrooms: 3,
    suites: 2,
    bathrooms: 3,
    parkingSpots: 2,
    featured: true,
    images: [
      "/assets/atmosfera-investimento.jpg",
      "/assets/atmosfera-mudanca.jpg"
    ],
    features: [
      "Autêntico estilo alpino suíço",
      "Lareira a lenha de pedra natural",
      "Vista permanente para o vale",
      "Terreno amplo com araucárias",
      "Calefação e água quente instalada"
    ],
    createdAt: "2026-09-06"
  },
  {
    id: "4",
    slug: "casa-alto-padrao-condominio-fechado-gramado",
    title: "Casa de Alto Padrão em Condomínio Fechado com Clube em Gramado",
    description: "Residência contemporânea cinematográfica em um dos condomínios mais cobiçados de Gramado. 4 suítes completas (sendo 1 master com hidromassagem e closet), living integrado com lareira ecológica, espaço gourmet com churrasqueira automatizada, adega climatizada e deck externo de madeira com vista para o bosque. Condomínio com segurança armada 24h, quadras de tênis de saibro, lagos privativos e piscina térmica coberta.",
    type: "Casa",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Planalto",
    price: 2450000,
    area: 285,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parkingSpots: 3,
    featured: true,
    images: [
      "/assets/atmosfera-mudanca.jpg",
      "/assets/atmosfera-investimento.jpg"
    ],
    features: [
      "Condomínio fechado com segurança armada 24h",
      "4 suítes completas + adega",
      "Deck de contemplação com spa",
      "Clube com quadras de tênis e lago",
      "Isolamento termoacústico importado"
    ],
    createdAt: "2026-09-07"
  },
  {
    id: "5",
    slug: "cobertura-duplex-vista-panoramica-catedral-canela",
    title: "Cobertura Duplex Panorâmica com Vista para a Catedral de Pedra",
    description: "Espetacular cobertura duplex no último andar com vista aberta de 180° para Canela e as torres da Catedral de Pedra. Terraço gourmet privativo com churrasqueira e hidromassagem aquecida ao ar livre, 3 suítes, lareira a lenha no living social e 2 vagas de garagem demarcadas. Um imóvel único com altíssimo potencial de renda para temporada de luxo.",
    type: "Cobertura",
    status: "Venda",
    city: "Canela",
    neighborhood: "Centro",
    price: 1680000,
    area: 145,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    parkingSpots: 2,
    featured: true,
    images: [
      "/uploads/property-subtelhado-canela.webp",
      "/uploads/property-lancamento-canela.webp"
    ],
    features: [
      "Vista deslumbrante da Catedral de Pedra",
      "Terraço privativo com spa aquecido",
      "3 suítes independentes",
      "Lareira a lenha e churrasqueira",
      "2 vagas de garagem cobertas"
    ],
    createdAt: "2026-09-08"
  },
  {
    id: "6",
    slug: "terreno-nobre-condominio-araucarias-gramado",
    title: "Terreno Plano em Condomínio Nobre com Bosque de Araucárias",
    description: "Lote exclusivo com 820 m² de área privativa, totalmente plano, com excelente orientação solar (norte/oeste) e cercado por araucárias centenárias preservadas. Projeto arquitetônico aprovado na prefeitura de Gramado para residência de alto padrão. Condomínio com infraestrutura completa de lazer, portaria blindada, trilhas ecológicas e fiação subterrânea.",
    type: "Terreno",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Bavária",
    price: 680000,
    area: 820,
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    parkingSpots: 0,
    featured: false,
    images: [
      "/assets/atmosfera-mudanca.jpg",
      "/assets/hero-home.jpg"
    ],
    features: [
      "820 m² privativos 100% aproveitáveis",
      "Condomínio com fiação subterrânea",
      "Projeto aprovado na prefeitura",
      "Trilhas ecológicas e bosque",
      "Segurança 24h e portaria blindada"
    ],
    createdAt: "2026-09-09"
  },
  {
    id: "7",
    slug: "lancamento-centro-gramado-2-dormitorios-alta-rentabilidade",
    title: "Lançamento no Centro de Gramado: 2 Dormitórios para Rentabilidade",
    description: "Excelente oportunidade para investimento seguro com alto potencial de rentabilidade na Serra Gaúcha! Apartamento com 60 m² privativos, 2 dormitórios (1 suíte), banheiro social, cozinha americana e sacada com churrasqueira a carvão. Fechadura eletrônica, piso vinílico, academia, salão de festas e pit fire.",
    type: "Apartamento",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Centro",
    price: 780000,
    area: 60,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    parkingSpots: 1,
    featured: true,
    images: [
      "/uploads/property-centro-gramado.webp",
      "/assets/hero-home.jpg"
    ],
    features: [
      "Alta rentabilidade comprovada",
      "Centro de Gramado",
      "Gestão completa de locação",
      "Sacada com churrasqueira",
      "Pit fire ao ar livre"
    ],
    createdAt: "2026-09-10"
  },
  {
    id: "8",
    slug: "apartamento-vista-vale-resort-gramado",
    title: "Apartamento com Vista para o Vale e Lazer de Resort em Gramado",
    description: "Excelente oportunidade com infraestrutura completíssima na Serra Gaúcha! 42 m² privativos, 1 dormitório e vaga de garagem. Vista cinematográfica para o vale verde com portaria e reconhecimento facial. Lazer completo: 2 salões de festas, academia, coworking, lavanderia industrial, espaço kids, secret garden, horta e fire pit a 3 minutos do centro.",
    type: "Apartamento",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Várzea Grande",
    price: 590000,
    area: 42,
    bedrooms: 1,
    suites: 0,
    bathrooms: 1,
    parkingSpots: 1,
    featured: false,
    images: [
      "/uploads/property-resort-gramado.webp",
      "/assets/atmosfera-mudanca.jpg"
    ],
    features: [
      "Infraestrutura completa de resort",
      "Vista panorâmica perene para o vale",
      "Coworking e salões de festas",
      "Academia e áreas de fire pit",
      "Portaria com reconhecimento facial"
    ],
    createdAt: "2026-09-12"
  },
  {
    id: "9",
    slug: "residencial-boa-vista-1-gramado-mcmv",
    title: "Residencial Boa Vista I - 2 Dormitórios em Gramado",
    description: "Oportunidade acessível na Serra Gaúcha! Apartamento com 54 m² privativos, 2 dormitórios, sala de estar integrada, cozinha e vaga de garagem. Excelente localização no bairro Várzea Grande, perfeito para primeira moradia ou investimento com valor de entrada facilitado.",
    type: "Apartamento",
    status: "Venda",
    city: "Gramado",
    neighborhood: "Várzea Grande",
    price: 353524,
    area: 54,
    bedrooms: 2,
    suites: 0,
    bathrooms: 1,
    parkingSpots: 1,
    featured: false,
    images: [
      "/uploads/property-mcmv-gramado.webp"
    ],
    features: [
      "Entrada facilitada",
      "2 dormitórios bem distribuídos",
      "Condomínio com segurança",
      "Localização residencial tranquila"
    ],
    createdAt: "2026-09-14"
  }
];

export function formatCurrency(value: number | string | undefined | null): string {
  const num = typeof value === "number" ? value : Number(value) || 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function getFeaturedProperties(): Property[] {
  return PROPERTIES.filter((p) => p.featured);
}

export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id || p.slug === id);
}