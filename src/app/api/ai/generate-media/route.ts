import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const property = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Chave GEMINI_API_KEY não configurada no arquivo de ambiente (.env.local).' 
      }, { status: 500 });
    }

    const prompt = `Você é um especialista sênior em copywriting imobiliário e redação de anúncios para propriedades de alto padrão e luxo na Serra Gaúcha (Gramado, Canela e região).
Sua missão é criar os TEXTOS OFICIAIS DE PUBLICAÇÃO DO ANÚNCIO para cadastrar e divulgar este imóvel no site oficial da imobiliária e nos principais portais imobiliários (ZAP Imóveis, Viva Real, Imovelweb, OLX).

DADOS DO IMÓVEL:
- Título Atual: ${property.title}
- Tipo: ${property.type}
- Localização: ${property.neighborhood ? property.neighborhood + ', ' : ''}${property.city}
- Preço: R$ ${Number(property.price).toLocaleString('pt-BR')}
- Área Privativa: ${property.area} m²
- Terreno: ${property.land_area ? property.land_area + ' m²' : 'Não informado'}
- Quartos: ${property.bedrooms} quartos (${property.suites} suítes)
- Banheiros: ${property.bathrooms || 'Não informado'}
- Vagas de Garagem: ${property.parking_spots || 'Não informado'}
- Condições de Pagamento: ${property.payment_conditions || 'Consulte condições'}
- Características / Diferenciais: ${property.features ? (typeof property.features === 'string' ? property.features : property.features.join(', ')) : 'Alto padrão'}
- Descrição Base: ${property.description || 'Não informada'}

INSTRUÇÕES DE FORMATAÇÃO E TOM:
Estruture a resposta EXCLUSIVAMENTE focada na PUBLICAÇÃO E ANÚNCIO DO IMÓVEL, com tom refinado, aspiracional e comercial, exatamente no formato Markdown abaixo:

## 🏷️ Título Comercial Atraente para o Anúncio
(Crie uma headline magnética de alto padrão para o anúncio no site e nos portais)

## 📖 Descrição Completa para Publicação no Site e Portais
(Texto persuasivo, elegante e completo, com 3 a 5 parágrafos bem estruturados abordando: o conceito do imóvel e a atmosfera serrana; a integração dos ambientes internos, acabamentos e conforto; os detalhes da área externa/condomínio e localização; e por que é uma excelente oportunidade para moradia ou investimento)

## 💎 Destaques & Ficha Técnica do Imóvel
(Lista organizada em tópicos/bullet points com as principais características e medidas para facilitar a leitura rápida do comprador)

## 📝 Versão Compacta para Portais Imobiliários (ZAP / Viva Real / OLX)
(Texto compacto e direto, pronto para copiar e colar em portais de anúncios imobiliários com limite de caracteres)

## 🤝 Condições & Agendamento de Visita
(Chamada elegante para agendamento de visita exclusiva com o corretor Lázaro Antunes • CRECI 088652-F • Telefone/WhatsApp: (54) 9983-6456 • E-mail: contato@lazaroantunes.com.br)`;

    // Lista de modelos suportados para redundância automática
    const models = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.8-flash'];
    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        if (data.error) {
          lastError = data.error.message || JSON.stringify(data.error);
          continue;
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const text = data.candidates[0].content.parts[0].text;
          return NextResponse.json({ ok: true, data: text });
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    throw new Error(lastError || 'Não foi possível gerar o conteúdo com a IA no momento.');
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
