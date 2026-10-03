# 🌲 Imobiliária Boutique • Lázaro Antunes (Serra Gaúcha)

Plataforma imobiliária de alto padrão desenvolvida para o mercado de luxo de **Gramado e Canela - RS**. O projeto combina uma experiência de usuário fluida e responsiva com um painel administrativo completo e geração de anúncios com Inteligência Artificial (Google Gemini).

---

## ✨ Principais Funcionalidades

### 🏛️ Portal Público (Website)
- **Design de Alto Padrão:** Layout moderno com tipografia sofisticada (*Playfair Display* e *Plus Jakarta Sans*) e paleta elegante inspirada na Serra Gaúcha.
- **Filtros Rápidos & Busca em Tempo Real:** Filtragem por cidade (Gramado / Canela), bairro, tipo de imóvel, faixa de preço em Real Brasileiro (`R$ 1.359.683,00`) e quantidade de dormitórios.
- **🎯 Quiz Interativo de Imóveis:** Assistente visual que identifica se o cliente busca moradia familiar ou investimento em temporada (Airbnb) e recomenda propriedades sob medida.
- **❤️ Sistema de Favoritos:** Lista de desejos salva no navegador com disparo direto de todos os imóveis selecionados para o WhatsApp do corretor.
- **Página de Contato & Captação:** Formulário conectado ao CRM com salvamento automático de leads e opção de contato direto via WhatsApp oficial.
- **SEO & Otimização Extrema:** Schema.org `RealEstateListing` (JSON-LD), Sitemap dinâmico (`/sitemap.xml`), Robots (`/robots.txt`), compressão de imagens via Sharp (-94% de tamanho) e páginas com geração estática ultrarrápida.

### 🛡️ Painel Administrativo (`/dashboard`)
- **Autenticação Segura:** Protegido por middleware com sessões assinadas via HMAC-SHA256 e cookies HttpOnly.
- **Gestão Completa de Imóveis:** Cadastro, edição, remoção, galeria de fotos com reordenação e controle de destaque.
- **Gestão de Cidades e Categorias:** Criação de novas cidades e tipos de imóveis com atualização dinâmica em todo o site.
- **CRM Integrado:** Acompanhamento de leads gerados pelos formulários do site.
- **✨ Assistente de IA (Google Gemini):**
  - Geração automática de títulos comerciais e redação completa para anúncios no site e portais (ZAP, Viva Real, Imovelweb).
  - Botão de preenchimento automático de descrição direto no formulário de cadastro.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Banco de Dados:** SQLite nativo (`node:sqlite`)
- **Inteligência Artificial:** [Google Gemini API](https://ai.google.dev/) (`gemini-3.5-flash`)
- **Compressão de Imagens:** [Sharp](https://sharp.pixelplumbing.com/)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env.local` na raiz com base no `.env.example`:
```env
GEMINI_API_KEY=sua_chave_gemini_aqui
ADMIN_EMAIL=contato@lazaroantunes.com.br
ADMIN_PASSWORD=SuaSenhaSegura@2026
AUTH_SECRET=chave-secreta-para-assinatura-de-sessao-e-cookies
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 👤 Corretor Responsável
- **Lázaro Antunes** • CRECI-RS 088652-F
- **Especialidade:** Imóveis de Alto Padrão e Investimentos na Serra Gaúcha (Gramado e Canela)
- **E-mail:** contato@lazaroantunes.com.br
