import React from 'react';
import { Tab } from '../types';

interface FooterProps {
  onNav: (tab: Tab) => void;
}

export default function Footer({ onNav }: FooterProps) {
  return (
    <footer className="bg-[#00112f] text-gray-400 font-sans border-t border-[#0f264c] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand/About */}
          <div className="col-span-1 space-y-4">
            <div className="flex items-center cursor-pointer group select-none" onClick={() => onNav('inicio')}>
              <svg viewBox="0 0 240 60" className="h-10 w-auto" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="45" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="32" fill="#ffffff" className="group-hover:fill-[#ff5a5f] transition-colors duration-300">Angel</text>
                <path d="M120 15 L140 45 L100 45 Z" fill="#ff6b6b" opacity="0.8" className="group-hover:translate-y-[-2px] transition-transform duration-300" />
                <text x="135" y="45" fontFamily="Montserrat, sans-serif" fontWeight="300" fontSize="28" fill="#ffffff" className="group-hover:fill-[#ff5a5f] transition-colors duration-300">Voyage</text>
              </svg>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Curadoria de excelência para experiências de viagem extraordinárias. Elevando de forma inabalável a arte de viajar pelo mundo desde 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex flex-col space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wide">Explore</h4>
            <button onClick={() => onNav('inicio')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">Início</button>
            <button onClick={() => onNav('destinos')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">Destinos Exclusivos</button>
            <button onClick={() => onNav('pacotes')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">All-Inclusive Pacotes</button>
          </div>

          {/* About us / review */}
          <div className="col-span-1 flex flex-col space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wide">Companhia</h4>
            <button onClick={() => onNav('sobre_nos')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">Sobre Nós</button>
            <button onClick={() => onNav('avaliacoes')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">Avaliações de Clientes</button>
            <button onClick={() => onNav('favoritos')} className="text-xs text-gray-400 hover:text-white hover:underline transition-all text-left">Meus Favoritos</button>
          </div>

          {/* Contact */}
          <div className="col-span-1 flex flex-col space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wide">Suporte & Contato</h4>
            <p className="text-xs text-gray-400">Dúvidas ou agendamento telefônico?</p>
            <p className="text-xs text-white font-semibold">+55 (11) 99999-0000</p>
            <p className="text-xs text-white font-semibold">concierge@voyageelite.com</p>
            <p className="text-[11px] text-gray-500">Av. Brigadeiro Faria Lima, 3000 - São Paulo, SP</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Angel Voyage Travel Agency. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-white cursor-pointer">Política de Privacidade</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
