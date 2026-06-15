import React, { useState } from 'react';
import { 
  Compass, Heart, Calendar, Star, Search, Share2, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, Eye, EyeOff, User, Mail, Lock, X, Check, HelpCircle
} from 'lucide-react';
import { Tab, TravelPackage, Destination, Reservation, Review } from './types';
import { INITIAL_DESTINATIONS, INITIAL_PACKAGES, INITIAL_RESERVATIONS, INITIAL_REVIEWS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutUsTab from './components/AboutUsTab';
import ReviewTab from './components/ReviewTab';
import BookingWizard from './components/BookingWizard';
import UMLSimulationPanel from './components/UMLSimulationPanel';
import NearbySuggestions from './components/NearbySuggestions';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab | 'detail' | 'checkout'>('inicio');
  
  // Data State
  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [packages, setPackages] = useState<TravelPackage[]>(INITIAL_PACKAGES);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [favorites, setFavorites] = useState<string[]>(['dest-santorini']); // Default favorited item
  
  // Selection/Interaction State
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('Todos');

  // Custom User Session
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Carlos Eduardo Silva',
    email: 'carlos.eduardo@voyageelite.com'
  });

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Toggle favorite helper
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Add customized package review
  const handleAddNewReview = (newReviewData: Omit<Review, 'id' | 'date' | 'userAvatar'>) => {
    const freshReview: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqpyxZ8sW8rKUaYGQa0X-k2yTr41U6pj6Sc3ojfd3hCAopuTwdCznhTZFfUlBdxFpcY1hMHjeRU7QEqvXuDqOfscrh9beAThX1JgvViIuAnU9kubFmtQKvGyYyeCwVaADY5LtKzV5Qwk9TUZjBYwhfFpcpB9FiHfvxbECciwnt0vUqDP5utUfWZxAMtbIK2VcQU1B_Qm2pNfNhQCl77hv8VNErvhGUxz56zXtdHnGB676oIeHnqboN7BthIebWKrlnVlEa0jshOag'
    };
    setReviews([freshReview, ...reviews]);
  };

  // Handles adding newly created travel bookings
  const handleBookingCompleted = (newReservation: Reservation) => {
    setReservations([newReservation, ...reservations]);
    setActiveTab('reservas');
  };

  // Cancel dynamic trip bookings
  const cancelReservation = (id: string) => {
    const confirmCancel = window.confirm('Tem certeza que deseja solicitar o cancelamento desta viagem de luxo curada?');
    if (confirmCancel) {
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: 'Cancelada' as 'Cancelada' } : res
      ));
      alert('Seu cancelamento foi solicitado e está sendo processado.');
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      if (!loginName || !loginEmail || !loginPassword) return;
      setCurrentUser({ name: loginName, email: loginEmail });
    } else {
      if (!loginEmail || !loginPassword) return;
      setCurrentUser({ name: loginEmail.split('@')[0], email: loginEmail });
    }
    setActiveTab('inicio');
    // reset form fields
    setLoginEmail('');
    setLoginPassword('');
    setLoginName('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('inicio');
  };

  // Extract unique countries for filter list
  const allCountries = ['Todos', ...Array.from(new Set(packages.map(p => p.country)))];

  // Filtering calculations
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountryFilter === 'Todos' || pkg.country === selectedCountryFilter;
    return matchesSearch && matchesCountry;
  });

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#00112f] font-sans pt-20 flex flex-col justify-between">
      
      {/* Dynamic Header Component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(newTab) => {
          setActiveTab(newTab);
          setSelectedPackage(null);
        }} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* TAB 1: INÍCIO (LANDING FEED) */}
        {activeTab === 'inicio' && (
          <div className="space-y-16 animate-fade-in">
            {/* Elegant Editorial Hero Banner with embedded search */}
            <section className="relative rounded-2xl overflow-hidden h-[450px] flex items-center justify-center p-6 bg-[#00112f]">
              <div className="absolute inset-0 z-0">
                <img 
                  className="w-full h-full object-cover object-center opacity-65 scale-105 transition-all duration-1000" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_EtYtDHGcIdOpZrTJe6NqaLjmqVvzXGJtqKG8mcUD9-uAPR67n_44JptrV1UGK3FrXHphlXG-7iX1_94zWTZ0N95raSqtp6mku6CChzH-FcWKYurJV_UoAJYw2zJ1RGYhkjJaf-7-NWFplvA3nzY5ady358cHyUu9NZxJJ1XSjPF3nhxwJgRzcntjh0VIi2vGRnuspmGpYd14_aqZDZFfw3C_3qahy0ybLtsaoGVGUeSgVK6Px1DUZddKlHHMAYD4P8tYQxCzwQg" 
                  alt="Scenic pristine Maldives overwater resort" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00112f]/80 via-transparent to-[#00112f]/30"></div>
              </div>

              {/* Central Text Panel */}
              <div className="relative z-10 w-full max-w-2xl text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Curadoria Select 2026</span>
                </div>
                
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase">
                  Desenhe sua próxima <span className="text-[#ff5a5f]">Jornada Singular</span>
                </h1>
                
                <p className="text-gray-200 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  Refúgios de excelência intocados e hospitalidade impecavelmente orquestrada pelas principais companhias de turismo do mundo.
                </p>

                {/* Micro Input Search Wrapper */}
                <div className="bg-white p-2 rounded-2xl shadow-xl max-w-lg mx-auto flex items-center gap-1.5 border border-gray-100">
                  <span className="p-2.5 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Procure por ilhas, resorts, hotéis..."
                    className="flex-grow bg-transparent text-xs text-gray-800 font-medium focus:outline-none placeholder-gray-400"
                    id="hero-search-input"
                  />
                  <button 
                    onClick={() => setActiveTab('pacotes')}
                    className="bg-[#0f264c] hover:bg-[#00112f] text-white text-[11px] font-bold tracking-wide uppercase px-4 py-2.5 rounded-xl transition-all shadow"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Country Filters */}
            <section className="flex flex-wrap items-center gap-2 pb-2 justify-center">
              <span className="text-xs font-bold text-gray-500 mr-2">Orquestrar por região:</span>
              {allCountries.map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountryFilter(country)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    selectedCountryFilter === country
                      ? 'bg-[#ff5a5f] text-white border-[#ff5a5f] shadow'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#ff5a5f]/60'
                  }`}
                >
                  {country}
                </button>
              ))}
            </section>

            {/* Geolocation Nearby Suggestions section */}
            <NearbySuggestions 
              destinations={destinations}
              packages={packages}
              onSelectPackage={(pkg) => {
                setSelectedPackage(pkg);
                setActiveTab('detail');
              }}
              setActiveTab={setActiveTab}
              setSelectedPackage={setSelectedPackage}
            />

            {/* Top Destinos Bento Grid section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 text-left">
                <div>
                  <h2 className="font-display font-black text-2xl tracking-tight text-[#00112f]">Refúgios de Curadoria</h2>
                  <p className="text-gray-400 text-xs">Propriedades e destinos recomendados para temporadas de repouso absoluto.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('destinos')}
                  className="text-xs font-bold text-[#ff5a5f] hover:underline"
                >
                  Todos os destinos →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredDestinations.slice(0, 4).map((dest) => {
                  const isFav = favorites.includes(dest.id);
                  return (
                    <div 
                      key={dest.id}
                      onClick={() => {
                        // Tries to find matching package
                        const matchingPkg = packages.find(p => p.destination === dest.name);
                        if (matchingPkg) {
                          setSelectedPackage(matchingPkg);
                          setActiveTab('detail');
                        } else {
                          setActiveTab('pacotes');
                        }
                      }}
                      className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Destination Image background */}
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-700 transition" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Header elements: Favorite trigger */}
                      <button
                        onClick={(e) => toggleFavorite(dest.id, e)}
                        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:text-red-500 hover:bg-white active:scale-95 transition-all z-20"
                        title={isFav ? "Remover de Favoritos" : "Adicionar aos Favoritos"}
                        id={`fav-btn-${dest.id}`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-red-500' : 'text-white'}`} />
                      </button>

                      {/* Footer elements */}
                      <div className="absolute bottom-4 left-4 right-4 text-left space-y-1 z-10">
                        <div className="flex justify-between items-center">
                          <span className="font-display font-bold text-lg text-white leading-tight">{dest.name}</span>
                          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {dest.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">{dest.country}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{dest.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Destaques Exclusivos (Packages Layout) */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 text-left">
                <div>
                  <h2 className="font-display font-black text-2xl tracking-tight text-[#00112f]">All-Inclusive Pacotes</h2>
                  <p className="text-gray-400 text-xs">Itinerários finamente orquestrados contendo voos na classe executiva e estadias em resorts premiados.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('pacotes')}
                  className="text-xs font-bold text-[#ff5a5f] hover:underline"
                >
                  Ver todos os pacotes →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.slice(0, 3).map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_12px_35px_rgba(15,38,76,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header with tag and favorites */}
                      <div className="relative h-56">
                        <img 
                          src={pkg.image} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                        {pkg.isPromo && (
                          <span className="absolute top-4 left-4 bg-red-500 text-white font-display font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow tracking-wider">
                            {pkg.promoLabel}
                          </span>
                        )}

                        <span className="absolute bottom-4 right-4 bg-[#0f264c] text-white font-display font-semibold text-[11px] px-3 py-1 rounded-md">
                          {pkg.durationDays} Dias / {pkg.durationNights} Noites
                        </span>
                      </div>

                      {/* Card Content details */}
                      <div className="p-6 space-y-4 text-left">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase text-[#ff5a5f] tracking-widest font-black">{pkg.destination} • {pkg.country}</span>
                            <h3 className="font-display font-bold text-base text-[#00112f] leading-tight mt-1">{pkg.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {pkg.rating}
                          </div>
                        </div>

                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>

                        <div className="space-y-2 pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-2 text-xs text-[#0f264c] font-semibold">
                            <span className="w-1.5 h-1.5 bg-[#ff5a5f] rounded-full"></span>
                            <span>Hospedagem: <strong>{pkg.hotel}</strong> ({pkg.stars}★)</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#0f264c] font-semibold">
                            <span className="w-1.5 h-1.5 bg-[#4f4f4f] rounded-full"></span>
                            <span>Voo incluso: <strong>{pkg.flight}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-6 pb-6 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        {pkg.originalPrice > pkg.currentPrice && (
                          <span className="text-gray-400 text-[11px] line-through">De R$ {pkg.originalPrice.toLocaleString('pt-BR')}</span>
                        )}
                        <span className="font-display font-black text-lg text-[#00112f]">
                          R$ {pkg.currentPrice.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-[9px] text-[#2e7d32] font-semibold">ou até 10x sem juros</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setActiveTab('detail');
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#0f264c] hover:bg-gray-50 cursor-pointer active:scale-95 transition-all"
                        >
                          Detalhes
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setActiveTab('checkout');
                          }}
                          className="bg-[#ff5a5f] hover:bg-rose-600 text-white px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                        >
                          Reservar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: DESTINOS EXCLUSIVOS list */}
        {activeTab === 'destinos' && (
          <div className="space-y-8 text-left animate-fade-in">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="font-display font-black text-3xl text-[#00112f]">Destinos Curados</h1>
              <p className="text-gray-500 text-xs">Propriedades e destinos recomendados para repouso de excelência por todo o globo.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map(dest => {
                const isFav = favorites.includes(dest.id);
                return (
                  <div 
                    key={dest.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-60">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => toggleFavorite(dest.id, e)}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-500 hover:bg-white transition-all scale-95"
                      >
                        <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-current text-red-500' : 'text-white'}`} />
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-display font-extrabold text-lg text-[#00112f]">{dest.name}</h3>
                        <span className="text-[10px] tracking-widest text-[#ff5a5f] font-bold uppercase">{dest.country}</span>
                      </div>

                      <p className="text-gray-600 text-xs leading-relaxed">
                        {dest.description}
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-50 text-xs">
                        <div className="font-medium text-gray-500">
                          Melhor temporada: <strong className="text-[#00112f]">{dest.bestSeason}</strong>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-4.5 h-4.5 fill-current" />
                          {dest.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PACKAGES list */}
        {activeTab === 'pacotes' && (
          <div className="space-y-8 text-left animate-fade-in">
            <header className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
              <div>
                <h1 className="font-display font-black text-3xl text-[#00112f]">Nossos Pacotes de Luxo</h1>
                <p className="text-gray-500 text-xs">Itinerários cuidadosamente desenhados com os parceiros mais confiáveis de hotelaria.</p>
              </div>

              {/* In-tab search bar */}
              <div className="flex bg-white border border-gray-200 rounded-xl px-3 py-1.5 w-full max-w-sm shadow-sm">
                <Search className="w-4.5 h-4.5 text-gray-400 self-center mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar pacotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none w-full"
                />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-52">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                    {pkg.isPromo && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white font-display text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                        {pkg.promoLabel}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-grow">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-rose-500 font-bold">{pkg.destination} • {pkg.country}</span>
                      <h3 className="font-display font-bold text-base text-[#00112f] leading-snug mt-1">{pkg.title}</h3>
                    </div>

                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-400">Hotel:</span>
                        <span className="text-gray-800">{pkg.hotel} ({pkg.stars}★)</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-400">Aéreo:</span>
                        <span className="text-gray-800">{pkg.flight}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-[10px]">A partir de:</span>
                      <p className="font-display font-black text-lg text-[#00112f]">R$ {pkg.currentPrice.toLocaleString('pt-BR')}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setActiveTab('detail');
                        }}
                        className="px-3 py-2 border border-gray-200 text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-gray-50"
                      >
                        Detalhes
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setActiveTab('checkout');
                        }}
                        className="bg-[#ff5a5f] hover:bg-rose-500 text-white px-3.5 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg shadow"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESERVAS HISTORIC list */}
        {activeTab === 'reservas' && (
          <div className="space-y-8 text-left animate-fade-in max-w-4xl mx-auto">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="font-display font-black text-3xl text-[#00112f]">Suas Reservas Elite</h1>
              <p className="text-gray-500 text-xs">Visualize suas jornadas consolidadas, baixe vouchers eletrônicos e consulte status.</p>
            </header>

            {reservations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
                <p className="text-gray-400 text-xs">Nenhum itinerário reservado associado à sua conta de cliente.</p>
                <button 
                  onClick={() => setActiveTab('pacotes')} 
                  className="bg-[#ff5a5f] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Procurar Destinos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map((res) => (
                  <div 
                    key={res.id} 
                    className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center gap-6"
                  >
                    <img 
                      src={res.image} 
                      alt={res.packageTitle} 
                      className="w-full md:w-32 h-32 rounded-xl object-cover shrink-0" 
                    />

                    <div className="flex-grow space-y-2 text-left w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2">
                        <span className="font-display font-bold text-[#00112f] text-sm md:text-base">{res.packageTitle}</span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 w-fit ${
                          res.status === 'Confirmada' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : res.status === 'Pendente Pagamento' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Localizador</span>
                          <p className="text-xs font-mono font-bold text-gray-800">{res.id}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Período</span>
                          <p className="text-xs font-semibold text-gray-700">{res.startDate} a {res.endDate}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Total Líquido</span>
                          <p className="text-xs font-bold text-[#ff5a5f]">R$ {res.totalPaid.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Passageiros</span>
                          <p className="text-xs font-medium text-gray-700">{res.passengers?.[0]?.fullName || 'Eduardo Giraldes'}</p>
                        </div>
                      </div>

                      {res.status === 'Confirmada' && (
                        <div className="bg-emerald-50/50 p-2.5 rounded-lg text-[10px] text-emerald-800 font-medium flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Parabéns! Sua viagem começa em <strong>{res.daysToTrip} dias</strong>. Prepare os passaportes com 6 meses de validade mínima.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex-wrap">
                      <button 
                        onClick={() => {
                          const mockText = `CÓDIGO DE LOCALIZADOR: ${res.id}\nPAC0TE: ${res.packageTitle}\nPERÍODO: ${res.startDate} a ${res.endDate}\nVALOR TOTAL DE RESERVA: R$ ${res.totalPaid.toLocaleString('pt-BR')}\nSTATUS: ${res.status}`;
                          const blob = new Blob([mockText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `Voucher-${res.id}.txt`;
                          link.click();
                        }}
                        className="flex-grow p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[10px] uppercase font-bold text-[#0f264c] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Voucher
                      </button>

                      {res.status !== 'Cancelada' && (
                        <button 
                          onClick={() => cancelReservation(res.id)}
                          className="flex-grow p-2 rounded-lg border border-red-200 hover:bg-red-50 text-[10px] uppercase font-bold text-red-500 cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FAVORITOS List page */}
        {activeTab === 'favoritos' && (
          <div className="space-y-8 text-left animate-fade-in">
            <header className="border-b border-gray-100 pb-4">
              <h1 className="font-display font-black text-3xl text-[#00112f]">Sua Lista de Desejos</h1>
              <p className="text-gray-500 text-xs">Propriedades e destinos favoritados para futuro agendamento.</p>
            </header>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
                <p className="text-gray-400 text-xs">Você não salvou propriedades de curadoria ainda.</p>
                <button 
                  onClick={() => setActiveTab('inicio')} 
                  className="bg-[#ff5a5f] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider pb-2"
                >
                  Explorar Destinos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.filter(d => favorites.includes(d.id)).map(dest => (
                  <div 
                    key={dest.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow"
                  >
                    <div className="relative h-56">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => toggleFavorite(dest.id, e)}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-[#ff5a5f] hover:text-gray-300 transition-all cursor-pointer"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-display font-bold text-base text-[#00112f]">{dest.name}</h3>
                        <span className="text-[10px] tracking-widest text-[#ff5a5f] font-bold uppercase">{dest.country}</span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{dest.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AVALIAÇÕES tab component */}
        {activeTab === 'avaliacoes' && (
          <ReviewTab reviews={reviews} onAddReview={handleAddNewReview} />
        )}

        {/* TAB 7: SOBRE NÓS corporate profile info */}
        {activeTab === 'sobre_nos' && (
          <AboutUsTab />
        )}

        {/* TAB 8: SIMULADOR UML & BACKEND */}
        {activeTab === 'simulador_uml' && (
          <UMLSimulationPanel 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            reservations={reservations}
            setReservations={setReservations}
            packages={packages}
            setPackages={setPackages}
            reviews={reviews}
            onAddNewReview={handleAddNewReview}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 8: LOGIN/REGISTER client panel */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto font-sans text-left my-10 animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_12px_50px_rgba(15,38,76,0.06)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff5a5f]/5 rounded-full blur-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div>
                  <h1 className="font-display font-extrabold text-2xl text-[#00112f] mb-1">
                    {isRegisterMode ? 'Crie sua Conta Elite' : 'Acesse seu Portal Concierge'}
                  </h1>
                  <p className="text-gray-400 text-xs max-w-xs mx-auto">
                    {isRegisterMode ? 'Faça parte do clube de viajantes de alto padrão.' : 'Gerencie reservas na classe executiva e consulte seus transfers.'}
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  {isRegisterMode && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
                          placeholder="Ex: Carlos Mendes"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">E-mail de Cadastro</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff5a5f]"
                        placeholder="nome@email.net"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Sua Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff5a5f]"
                        placeholder="Insira sua senha segura"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ff5a5f] hover:bg-rose-600 text-white font-sans text-xs font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                  >
                    {isRegisterMode ? 'Finalizar Cadastro' : 'Entrar no Concierge'}
                  </button>
                </form>

                <div className="space-y-4 pt-4 border-t border-gray-100 text-xs">
                  <p className="text-gray-500">
                    {isRegisterMode ? 'Já possui login cadastrado?' : 'Ainda não é um Membro Elite?'}
                    <button
                      onClick={() => setIsRegisterMode(!isRegisterMode)}
                      className="text-[#ff5a5f] font-bold ml-1 hover:underline"
                    >
                      {isRegisterMode ? 'Faça login' : 'Cadastre-se grátis'}
                    </button>
                  </p>

                  <button
                    onClick={() => {
                      setCurrentUser({ name: 'Visitante VIP', email: 'guest@voyage.com' });
                      setActiveTab('inicio');
                    }}
                    className="text-[11px] text-[#0f264c] font-semibold hover:underline"
                  >
                    Acessar temporariamente como Convidado (Guest)
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* COMPONENT TAB 9: VER DETALHES (PACKAGE DETAIL SHEET) */}
        {activeTab === 'detail' && selectedPackage && (
          <div className="space-y-12 text-left animate-fade-in">
            {/* Nav Back Header buttons */}
            <div className="flex gap-4 items-center">
              <button
                onClick={() => {
                  setSelectedPackage(null);
                  setActiveTab('inicio');
                }}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                ← Voltar ao Início
              </button>
            </div>

            {/* Editorial Header Panel */}
            <header className="relative rounded-3xl overflow-hidden h-96 flex items-end p-6 md:p-10 text-white shadow-md">
              <div className="absolute inset-0 z-0">
                <img src={selectedPackage.image} alt={selectedPackage.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
              </div>

              <div className="relative z-10 space-y-2 max-w-3xl">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-black/40 px-3 py-1 rounded-full tracking-widest">
                  {selectedPackage.destination} • {selectedPackage.country}
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase leading-snug">
                  {selectedPackage.title}
                </h1>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xl">
                  {selectedPackage.description}
                </p>
              </div>
            </header>

            {/* Bento details Grid info: Accommodation, Itinerary, included */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left major side: Accommodation, Experiences, Itinerario */}
              <div className="lg:col-span-8 space-y-8">

                {selectedPackage.accommodation && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#00112f] border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Estrutura de Acomodação Curada
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <img 
                        src={selectedPackage.accommodation.image} 
                        alt={selectedPackage.accommodation.name} 
                        className="md:col-span-4 w-full h-36 rounded-xl object-cover" 
                      />

                      <div className="md:col-span-8 space-y-2">
                        <div className="flex gap-1.5 items-center">
                          <h4 className="font-display font-bold text-sm text-[#00112f]">{selectedPackage.accommodation.name}</h4>
                          <span className="text-xs text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            {selectedPackage.accommodation.stars}★ Class
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {selectedPackage.accommodation.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {selectedPackage.accommodation.amenities.map(amenity => (
                            <span key={amenity} className="bg-gray-100 text-[#0f264c] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                              • {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itinerary Steps day-by-day */}
                {selectedPackage.itinerary && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#00112f] border-b border-gray-100 pb-2">
                      Roteiro de Experiências Orquestradas
                    </h3>

                    <div className="space-y-6">
                      {selectedPackage.itinerary.map(item => (
                        <div key={item.day} className="flex gap-4 items-start">
                          <div className="w-10 h-10 bg-[#ff5a5f] text-white rounded-full flex items-center justify-center font-display font-bold shrink-0 shadow-sm text-xs">
                            Dia {item.day}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-display font-semibold text-xs md:text-sm text-[#00112f]">{item.title}</h4>
                            <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experiences list cards */}
                {selectedPackage.includedExperiences && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#00112f] border-b border-gray-100 pb-2">
                      Experiências Inclusas Finas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPackage.includedExperiences.map((exp, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 flex gap-3 items-start">
                          <span className="w-10 h-10 bg-[#0f264c] text-white rounded-lg flex items-center justify-center shrink-0">
                            <Compass className="w-5 h-5" />
                          </span>
                          <div className="text-left space-y-1">
                            <h4 className="font-display font-bold text-xs text-[#00112f]">{exp.title}</h4>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right smaller side page layout: Pricing card actions */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Investimento Recomendado</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-black text-2xl text-[#00112f]">
                      R$ {selectedPackage.currentPrice.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-gray-400">/ por viajante</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Desconto de 5% já contemplado para Pix ou boleto corporativo à vista.</p>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-gray-100 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-400">Duração:</span>
                    <span className="text-gray-800 font-bold">{selectedPackage.durationDays} dias / {selectedPackage.durationNights} noites</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-400">Classificação:</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1 font-sans">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {selectedPackage.rating} ({selectedPackage.reviewsCount} avaliações)
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-400">Polos aéreos:</span>
                    <span className="text-gray-800 font-bold">{selectedPackage.flight}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => setActiveTab('checkout')}
                    className="w-full bg-[#ff5a5f] hover:bg-rose-500 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    Prosseguir para Reserva
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPackage(null);
                      setActiveTab('inicio');
                    }}
                    className="w-full p-2.5 border border-gray-200 hover:bg-gray-50 text-[11px] font-bold uppercase text-[#0f264c] rounded-lg tracking-wider transition-all text-center"
                  >
                    Voltar para Seleção
                  </button>
                </div>

                <div className="bg-red-50/50 p-4 rounded-xl text-[10px] text-gray-500 leading-relaxed flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff5a5f] shrink-0" />
                  <span>Curadoria Segura: Seus bilhetes e reservas podem ser cancelados com até 7 dias de antecedência para reembolso fiduciário integral de 100%.</span>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* COMPONENT TAB 10: CHECKOUT SYSTEM */}
        {activeTab === 'checkout' && selectedPackage && (
          <div className="space-y-6">
            <header className="text-left border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h1 className="font-display font-black text-2xl md:text-3xl text-[#00112f]">Sua Viagem Sob Medida</h1>
                <p className="text-gray-500 text-xs">Preencha os dados dos hóspedes e escolha a melhor modalidade financeira de pagamento.</p>
              </div>

              <button
                onClick={() => setActiveTab('inicio')}
                className="p-1 px-3 border border-gray-200 rounded hover:bg-gray-50 text-xs font-extrabold"
              >
                Voltar
              </button>
            </header>

            <BookingWizard 
              packageData={selectedPackage} 
              currentUser={currentUser} 
              onBookingSuccess={handleBookingCompleted}
              onCancel={() => {
                setSelectedPackage(null);
                setActiveTab('inicio');
              }}
            />
          </div>
        )}

      </main>

      {/* Footer System Component */}
      <Footer onNav={(targetTab) => {
        setActiveTab(targetTab);
        setSelectedPackage(null);
      }} />

    </div>
  );
}
