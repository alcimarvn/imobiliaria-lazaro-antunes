// @ts-ignore — node:sqlite é experimental no Node 22
import { DatabaseSync } from 'node:sqlite';
import * as path from 'path';
import * as fs from 'fs';
import type { Property, BrokerInfo } from './types';

let db: InstanceType<typeof DatabaseSync>;

/** Retorna a instância singleton do banco SQLite */
export function getDb() {
  if (db) return db;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'crm.db');
  db = new DatabaseSync(dbPath);

  // Migração de novas colunas
  const newCols = ['image_captions', 'highlight_tag', 'payment_conditions', 'purpose'];
  newCols.forEach(c => {
    try { db.exec(`ALTER TABLE properties ADD COLUMN ${c} TEXT DEFAULT ''`); } catch (_) {}
  });


  // Criar todas as tabelas
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      slug TEXT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'Venda',
      city TEXT NOT NULL,
      neighborhood TEXT,
      price REAL NOT NULL,
      area REAL,
      bedrooms INTEGER DEFAULT 0,
      suites INTEGER DEFAULT 0,
      bathrooms INTEGER DEFAULT 0,
      parking_spots INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      images TEXT DEFAULT '[]',
      features TEXT DEFAULT '[]',
      address TEXT DEFAULT '',
      owner_name TEXT DEFAULT '',
      owner_phone TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      highlight_tag TEXT DEFAULT '',
      payment_conditions TEXT DEFAULT '',
      purpose TEXT DEFAULT 'todos',
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      state TEXT DEFAULT 'RS',
      active INTEGER DEFAULT 1,
      order_num INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      city TEXT,
      status TEXT DEFAULT 'novo',
      source TEXT,
      budget TEXT,
      property_interest TEXT,
      priority TEXT DEFAULT 'media',
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      type TEXT,
      notes TEXT,
      created_at TEXT,
      FOREIGN KEY(lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      title TEXT NOT NULL,
      due_date TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_origin TEXT,
      photo TEXT,
      comment TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      active INTEGER DEFAULT 1,
      order_num INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      active INTEGER DEFAULT 1,
      order_num INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      message TEXT NOT NULL,
      property_id TEXT,
      created_at TEXT,
      read INTEGER DEFAULT 0
    );
  `);

  // Popular dados iniciais
  seedDatabase();

  return db;
}

/** Popula o banco com os dados iniciais */
function seedDatabase() {
  // ─── Imóveis ───
  const countProps = (db.prepare('SELECT COUNT(*) as count FROM properties').get() as any).count;
  if (countProps === 0) {
    const ins = db.prepare(`INSERT INTO properties (id, slug, title, description, type, status, city, neighborhood, price, area, bedrooms, suites, bathrooms, parking_spots, featured, images, features, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const props: any[][] = [
      ['1', 'apartamento-subtelhado-2-suites-rooftop-canela', 'Apartamento Subtelhado com 2 Suítes e Rooftop em Canela', 'Apartamento Subtelhado de alto padrão com 2 suítes amplas, lavabo, vidros duplos termoacústicos, sacada com churrasqueira e acesso exclusivo ao rooftop gourmet com academia.', 'Apartamento', 'Venda', 'Canela', 'Centro', 1359683, 93, 2, 2, 3, 1, 1, '["/uploads/property-subtelhado-canela.webp","/assets/atmosfera-investimento.jpg"]', '["Subtelhado exclusivo","2 amplas suítes + lavabo","Vidros duplos termoacústicos","Sacada com churrasqueira","Rooftop gourmet e academia"]', '2026-09-01', '2026-09-01'],
      ['2', 'amplo-apartamento-2-dormitorios-rua-coberta-gramado', 'Amplo Apartamento a Poucas Quadras da Rua Coberta', 'Apartamento amplo e moderno localizado a poucas quadras da famosa Rua Coberta de Gramado. Ideal para investimento em Airbnb.', 'Apartamento', 'Venda', 'Gramado', 'Centro', 962000, 74, 2, 1, 2, 1, 1, '["/uploads/property-ruacoberta-gramado.webp","/assets/hero-home.jpg"]', '["A poucas quadras da Rua Coberta","Gestão completa para Airbnb","Sacada com churrasqueira","Espera para lareira a lenha","Pit fire ao ar livre"]', '2026-09-05', '2026-09-05'],
      ['3', 'chale-suico-tradicional-vista-vale-canela', 'Chalé Suíço Tradicional em Madeira Nobre e Pedra com Vista', 'Chalé autêntico no estilo alpino suíço, construído em madeira nobre e pedra natural. Com lareira a lenha e vista para o vale.', 'Chale', 'Venda', 'Canela', 'Vila Suzana', 1250000, 160, 3, 2, 3, 2, 1, '["/assets/atmosfera-investimento.jpg","/assets/atmosfera-mudanca.jpg"]', '["Autêntico estilo alpino suíço","Lareira a lenha de pedra natural","Vista permanente para o vale","Terreno amplo com araucárias","Calefação e água quente instalada"]', '2026-09-06', '2026-09-06'],
      ['4', 'casa-alto-padrao-condominio-fechado-gramado', 'Casa de Alto Padrão em Condomínio Fechado com Clube em Gramado', 'Residência de alto padrão em condomínio fechado com segurança armada 24h, 4 suítes completas, adega e clube.', 'Casa', 'Venda', 'Gramado', 'Planalto', 2450000, 285, 4, 4, 5, 3, 1, '["/assets/atmosfera-mudanca.jpg","/assets/atmosfera-investimento.jpg"]', '["Condomínio fechado com segurança armada 24h","4 suítes completas + adega","Deck de contemplação com spa","Clube com quadras de tênis e lago","Isolamento termoacústico importado"]', '2026-09-07', '2026-09-07'],
      ['5', 'cobertura-duplex-vista-panoramica-catedral-canela', 'Cobertura Duplex Panorâmica com Vista para a Catedral de Pedra', 'Cobertura duplex com vista deslumbrante para a Catedral de Pedra. Terraço privativo com spa aquecido e 3 suítes.', 'Cobertura', 'Venda', 'Canela', 'Centro', 1680000, 145, 3, 3, 4, 2, 1, '["/uploads/property-subtelhado-canela.webp","/uploads/property-lancamento-canela.webp"]', '["Vista deslumbrante da Catedral de Pedra","Terraço privativo com spa aquecido","3 suítes independentes","Lareira a lenha e churrasqueira","2 vagas de garagem cobertas"]', '2026-09-08', '2026-09-08'],
      ['6', 'terreno-nobre-condominio-araucarias-gramado', 'Terreno Plano em Condomínio Nobre com Bosque de Araucárias', 'Terreno plano de 820m² em condomínio nobre com fiação subterrânea e projeto aprovado na prefeitura.', 'Terreno', 'Venda', 'Gramado', 'Bavária', 680000, 820, 0, 0, 0, 0, 0, '["/assets/atmosfera-mudanca.jpg","/assets/hero-home.jpg"]', '["820 m² privativos 100% aproveitáveis","Condomínio com fiação subterrânea","Projeto aprovado na prefeitura","Trilhas ecológicas e bosque","Segurança 24h e portaria blindada"]', '2026-09-09', '2026-09-09'],
      ['7', 'lancamento-centro-gramado-2-dormitorios-alta-rentabilidade', 'Lançamento no Centro de Gramado: 2 Dormitórios para Rentabilidade', 'Apartamento de lançamento no Centro de Gramado com alta rentabilidade comprovada e gestão completa de locação.', 'Apartamento', 'Venda', 'Gramado', 'Centro', 780000, 60, 2, 1, 2, 1, 1, '["/uploads/property-centro-gramado.webp","/assets/hero-home.jpg"]', '["Alta rentabilidade comprovada","Centro de Gramado","Gestão completa de locação","Sacada com churrasqueira","Pit fire ao ar livre"]', '2026-09-10', '2026-09-10'],
      ['8', 'apartamento-vista-vale-resort-gramado', 'Apartamento com Vista para o Vale e Lazer de Resort em Gramado', 'Apartamento com infraestrutura completa de resort, vista panorâmica para o vale e portaria com reconhecimento facial.', 'Apartamento', 'Venda', 'Gramado', 'Várzea Grande', 590000, 42, 1, 0, 1, 1, 0, '["/uploads/property-resort-gramado.webp","/assets/atmosfera-mudanca.jpg"]', '["Infraestrutura completa de resort","Vista panorâmica perene para o vale","Coworking e salões de festas","Academia e áreas de fire pit","Portaria com reconhecimento facial"]', '2026-09-12', '2026-09-12'],
      ['9', 'residencial-boa-vista-1-gramado-mcmv', 'Residencial Boa Vista I - 2 Dormitórios em Gramado', 'Apartamento de 2 dormitórios no Residencial Boa Vista I em Gramado. Entrada facilitada e localização tranquila.', 'Apartamento', 'Venda', 'Gramado', 'Várzea Grande', 353524, 54, 2, 0, 1, 1, 0, '["/uploads/property-mcmv-gramado.webp"]', '["Entrada facilitada","2 dormitórios bem distribuídos","Condomínio com segurança","Localização residencial tranquila"]', '2026-09-14', '2026-09-14'],
    ];

    props.forEach(p => ins.run(...p));
  }

  // ─── Cidades ───
  const countCities = (db.prepare('SELECT COUNT(*) as count FROM cities').get() as any).count;
  if (countCities === 0) {
    const insCity = db.prepare('INSERT INTO cities (id, name, state, order_num) VALUES (?, ?, ?, ?)');
    insCity.run('1', 'Gramado', 'RS', 1);
    insCity.run('2', 'Canela', 'RS', 2);
    insCity.run('3', 'Nova Petrópolis', 'RS', 3);
    insCity.run('4', 'São Francisco de Paula', 'RS', 4);
  }

  // ─── Categorias ───
  const countCats = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as any).count;
  if (countCats === 0) {
    const insCat = db.prepare('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)');
    insCat.run('1', 'Apartamento', 'apartamento');
    insCat.run('2', 'Casa', 'casa');
    insCat.run('3', 'Chalé', 'chale');
    insCat.run('4', 'Cobertura', 'cobertura');
    insCat.run('5', 'Terreno', 'terreno');
  }

  // ─── Configurações do Site ───
  const countSettings = (db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as any).count;
  if (countSettings === 0) {
    const insSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
    const settings: string[][] = [
      ['broker_name', 'Lázaro Antunes'],
      ['broker_role', 'Corretor de Imóveis • Especialista na Serra Gaúcha'],
      ['broker_creci', '088652-F'],
      ['broker_phone', '(54) 9983-6456'],
      ['broker_whatsapp', '555499836456'],
      ['broker_whatsapp_message', 'Olá Lázaro! Visitei seu site e gostaria de orientação para comprar ou investir em imóveis na Serra Gaúcha.'],
      ['broker_email', 'contato@lazaroantunes.com.br'],
      ['broker_address', 'Centro'],
      ['broker_city', 'Gramado'],
      ['broker_state', 'RS'],
      ['broker_bio', 'Consultoria boutique para quem quer se mudar para Gramado ou investir em imóveis de alto padrão na Serra Gaúcha. Mais de 10 anos de vivência local, com suporte premium, segurança jurídica e clareza.'],
      ['broker_instagram', 'https://www.instagram.com/lazaroantunescorretor/'],
    ];
    settings.forEach(s => insSetting.run(s[0], s[1]));
  }

  // ─── Depoimentos padrão ───
  const countTest = (db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as any).count;
  if (countTest === 0) {
    const insTest = db.prepare('INSERT INTO testimonials (id, client_name, client_origin, comment, rating, order_num) VALUES (?, ?, ?, ?, ?, ?)');
    insTest.run('1', 'Marcos & Juliana', 'São Paulo', 'O Lázaro foi impecável do início ao fim. Encontramos nosso chalé dos sonhos em Canela graças à consultoria dele!', 5, 1);
    insTest.run('2', 'Dr. Ricardo Almeida', 'Curitiba', 'Investir em Gramado foi a melhor decisão financeira que tomei. O Lázaro me apresentou oportunidades que eu jamais encontraria sozinho.', 5, 2);
    insTest.run('3', 'Família Bertolucci', 'Porto Alegre', 'Profissional sério, transparente e com profundo conhecimento da região. Recomendamos de olhos fechados!', 5, 3);
  }

  // ─── FAQs padrão ───
  const countFaqs = (db.prepare('SELECT COUNT(*) as count FROM faqs').get() as any).count;
  if (countFaqs === 0) {
    const insFaq = db.prepare('INSERT INTO faqs (id, question, answer, category, order_num) VALUES (?, ?, ?, ?, ?)');
    insFaq.run('1', 'Posso comprar um imóvel em Gramado morando em outro estado?', 'Sim! A maior parte dos meus clientes está fora do RS. Cuido de toda a burocracia à distância — visitas virtuais, documentação e suporte jurídico completo.', 'compra', 1);
    insFaq.run('2', 'É um bom investimento comprar imóvel na Serra Gaúcha?', 'A Serra Gaúcha tem uma das maiores valorizações do Sul do Brasil. Além da valorização patrimonial, a renda com Airbnb pode superar 1% ao mês em alta temporada.', 'investimento', 2);
    insFaq.run('3', 'Como funciona a gestão de Airbnb do imóvel?', 'Posso conectar você a gestoras profissionais que cuidam de tudo: anúncio, check-in, limpeza e manutenção. Você recebe os rendimentos sem preocupação.', 'investimento', 3);
    insFaq.run('4', 'Quais os custos adicionais na compra?', 'Além do valor do imóvel, considere ITBI (2-3%), escritura, registro e eventuais taxas de condomínio. Preparo uma planilha completa personalizada para cada cliente.', 'compra', 4);
    insFaq.run('5', 'Vocês trabalham com financiamento?', 'Sim! Trabalho com as principais instituições financeiras e posso simular as melhores condições de financiamento para o seu perfil.', 'financiamento', 5);
  }
}

// ─── Funções Auxiliares ───

/** Converte uma linha do banco para o tipo Property */
function mapRow(row: any): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    type: row.type,
    status: row.status || 'Venda',
    city: row.city,
    neighborhood: row.neighborhood || '',
    price: row.price,
    area: row.area || 0,
    bedrooms: row.bedrooms || 0,
    suites: row.suites || 0,
    bathrooms: row.bathrooms || 0,
    parkingSpots: row.parking_spots || 0,
    featured: row.featured === 1,
    images: JSON.parse(row.images || '[]'),
    image_captions: JSON.parse(row.image_captions || '[]'),
    features: JSON.parse(row.features || '[]'),
    highlight_tag: row.highlight_tag || '',
    payment_conditions: row.payment_conditions || '',
    purpose: row.purpose || 'todos',
    createdAt: row.created_at || '',
  };
}

/** Retorna todos os imóveis */
export function getAllProperties(): Property[] {
  const database = getDb();
  return (database.prepare('SELECT * FROM properties ORDER BY created_at DESC').all() as any[]).map(mapRow);
}

/** Retorna um imóvel pelo ID */
export function getPropertyById(id: string): Property | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;
  return row ? mapRow(row) : null;
}

/** Retorna os imóveis em destaque */
export function getFeaturedProperties(): Property[] {
  const database = getDb();
  return (database.prepare('SELECT * FROM properties WHERE featured = 1 ORDER BY created_at DESC').all() as any[]).map(mapRow);
}

/** Tipos exportados para Cidades e Categorias */
export interface CityRecord {
  id: string;
  name: string;
  state: string;
  active: number;
  order_num: number;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: number;
}

/** Retorna todas as cidades ativas */
export function getAllCities(): CityRecord[] {
  const database = getDb();
  return database.prepare('SELECT * FROM cities WHERE active = 1 ORDER BY order_num ASC, name ASC').all() as CityRecord[];
}

/** Retorna todas as categorias ativas */
export function getAllCategories(): CategoryRecord[] {
  const database = getDb();
  return database.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY name ASC').all() as CategoryRecord[];
}

/** Retorna as informações do corretor lidas do banco */
export function getBrokerInfo(): BrokerInfo {
  const database = getDb();
  const rows = database.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  rows.forEach(r => { map[r.key] = r.value; });

  return {
    name: map.broker_name || '',
    role: map.broker_role || '',
    creci: map.broker_creci || '',
    phone: map.broker_phone || '',
    whatsapp: map.broker_whatsapp || '',
    whatsappMessage: map.broker_whatsapp_message || '',
    email: map.broker_email || '',
    address: map.broker_address || '',
    city: map.broker_city || '',
    state: map.broker_state || '',
    bio: map.broker_bio || '',
    instagram: map.broker_instagram || '',
  };
}
