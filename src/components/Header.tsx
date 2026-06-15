import React, { useState } from 'react';
import { Compass, Heart, Calendar, Star, Menu, X, LogIn, User, Database } from 'lucide-react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab | 'detail' | 'checkout';
  setActiveTab: (tab: Tab) => void;
  currentUser: any;
  onLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, currentUser, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Início', icon: <Compass className="w-4 h-4" /> },
    { id: 'destinos', label: 'Destinos', icon: <Star className="w-4 h-4" /> },
    { id: 'pacotes', label: 'Pacotes', icon: <Calendar className="w-4 h-4" /> },
    { id: 'reservas', label: 'Reservas', icon: <Calendar className="w-4 h-4" /> },
    { id: 'favoritos', label: 'Favoritos', icon: <Heart className="w-4 h-4" /> },
    { id: 'avaliacoes', label: 'Avaliações', icon: <Star className="w-4 h-4" /> },
    { id: 'sobre_nos', label: 'Sobre Nós', icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_15px_rgba(15,38,76,0.03)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('inicio')} 
          className="flex items-center cursor-pointer group select-none"
          id="brand-logo"
        >
          <svg viewBox="0 0 200 60" className="h-12 w-auto animate-fade-in" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="45" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="32" fill="#0f264c" className="group-hover:fill-[#ff5a5f] transition-colors duration-300">Angel</text>
            <path d="M120 15 L140 45 L100 45 Z" fill="#ff6b6b" opacity="0.8" className="group-hover:translate-y-[-2px] transition-transform duration-300" />
            <text x="125" y="45" fontFamily="Montserrat, sans-serif" fontWeight="300" fontSize="28" fill="#0f264c" className="group-hover:fill-[#ff5a5f] transition-colors duration-300">Voyage</text>
          </svg>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0f264c] text-white shadow-md'
                    : 'text-[#44474e] hover:text-[#00112f] hover:bg-gray-100/70'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User / Authentication Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-gray-50/80 border border-gray-100 px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-[#0f264c] text-white flex items-center justify-center font-bold font-display text-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#00112f]">{currentUser.name}</span>
                <button 
                  onClick={onLogout} 
                  className="text-[10px] text-red-500 hover:text-red-600 font-medium text-left cursor-pointer transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="px-6 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase border-2 border-[#0f264c] text-[#0f264c] hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center gap-2"
              id="header-login-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          {currentUser && (
            <div className="w-8 h-8 rounded-full bg-[#0f264c] text-white flex items-center justify-center font-bold text-xs" title={currentUser.name}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#00112f] hover:text-[#ff5a5f] p-1 cursor-pointer transition-colors"
            id="mobile-menu-toggle"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute top-20 left-0 w-full shadow-lg z-40 p-4 transition-all duration-300">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-sans text-[14px] font-semibold text-left flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#0f264c] text-white'
                      : 'text-[#44474e] hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
            <hr className="border-gray-100 my-2" />
            {currentUser ? (
              <div className="p-3 flex items-center justify-between bg-gray-50 rounded-lg">
                <span className="text-xs font-semibold text-gray-700">{currentUser.email}</span>
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-500 font-bold"
                >
                  Sair da Conta
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#ff5a5f] text-white py-3 rounded-lg font-sans text-xs font-bold tracking-wider uppercase text-center shadow-md cursor-pointer hover:bg-red-500"
              >
                Fazer Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
