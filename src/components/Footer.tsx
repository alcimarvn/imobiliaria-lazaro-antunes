import React from "react";
import Link from "next/link";
import { BROKER } from "@/lib/data";
import { BrokerInfo } from "@/lib/types";
import { Phone, Mail, MapPin, Instagram, ShieldCheck, Building2 } from "lucide-react";

export function Footer({ broker }: { broker?: BrokerInfo } = {}) {
  const currentBroker = broker || BROKER;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-800 text-gold-400 flex items-center justify-center font-bold shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentBroker.name}</h3>
                <p className="text-xs text-gold-300 font-semibold">CRECI {currentBroker.creci}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Assessoria imobiliária boutique focada em propriedades nobres, condomínios fechados e investimentos de alta rentabilidade em Gramado e Canela.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-200 bg-brand-900/90 p-2.5 rounded-lg border border-brand-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>CRECI-RS 088652-F • Fiscalizado e regular</span>
            </div>
          </div>

          {/* Coluna 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="hover:text-white transition-colors">
                  Todos os Imóveis
                </Link>
              </li>
              <li>
                <Link href="/imoveis?city=Gramado" className="hover:text-white transition-colors">
                  Imóveis em Gramado
                </Link>
              </li>
              <li>
                <Link href="/imoveis?city=Canela" className="hover:text-white transition-colors">
                  Imóveis em Canela
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato e Agendamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/imoveis?type=Chale" className="hover:text-white transition-colors">
                  Chalés Alpinos
                </Link>
              </li>
              <li>
                <Link href="/imoveis?type=Casa" className="hover:text-white transition-colors">
                  Casas em Condomínio
                </Link>
              </li>
              <li>
                <Link href="/imoveis?type=Apartamento" className="hover:text-white transition-colors">
                  Apartamentos no Centro
                </Link>
              </li>
              <li>
                <Link href="/imoveis?type=Cobertura" className="hover:text-white transition-colors">
                  Coberturas
                </Link>
              </li>
              <li>
                <Link href="/imoveis?type=Terreno" className="hover:text-white transition-colors">
                  Terrenos e Lotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4">
              Atendimento
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{currentBroker.address}, {currentBroker.city} - RS</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${currentBroker.phone.replace(/\D/g, "")}`} className="hover:text-white transition-colors">
                  {currentBroker.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${currentBroker.email}`} className="hover:text-white transition-colors">
                  {currentBroker.email}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={currentBroker.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram @lazaroantunes.corretor</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-900 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} {currentBroker.name} • CRECI {currentBroker.creci} • Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Gramado e Canela - Serra Gaúcha / RS</span>
            <span>•</span>
            <Link href="/dashboard" className="text-slate-400 hover:text-gold-300 transition-colors font-medium">
              Painel de Gestão
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
