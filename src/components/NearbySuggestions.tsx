import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, AlertCircle, RefreshCw, Star, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Destination, TravelPackage } from '../types';

interface NearbySuggestionsProps {
  destinations: Destination[];
  packages: TravelPackage[];
  onSelectPackage: (pkg: TravelPackage) => void;
  setActiveTab: (tab: any) => void;
  setSelectedPackage: (pkg: TravelPackage) => void;
}

interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  isSimulated: boolean;
}

const PRESET_LOCATIONS = [
  { name: 'São Paulo (Brasil)', lat: -23.5505, lng: -46.6333 },
  { name: 'Lisboa (Portugal)', lat: 38.7222, lng: -9.1393 },
  { name: 'Nova York (EUA)', lat: 40.7128, lng: -74.0060 },
  { name: 'Tóquio (Japão)', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney (Austrália)', lat: -33.8688, lng: 151.2093 }
];

// Haversine algorithm to compute distance in kilometers
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function NearbySuggestions({
  destinations,
  packages,
  onSelectPackage,
  setActiveTab,
  setSelectedPackage
}: NearbySuggestionsProps) {
  // Try to default to São Paulo coordinates for simulation
  const [location, setLocation] = useState<UserLocation>({
    lat: -23.5505,
    lng: -46.6333,
    name: 'São Paulo (Brasil) - Padrão',
    isSimulated: true
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(8000); // 8,000 km default radius
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Fetch real browser geolocation
  const fetchRealLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('A API de Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          name: 'Sua Localização Real',
          isSimulated: false
        });
        setPermissionState('granted');
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setPermissionState('denied');
        
        let customErr = 'Permissão de localização negada ou indisponível.';
        if (err.code === 1) {
          customErr = 'O acesso à geolocalização foi negado. Você pode simular mudando o ponto de partida abaixo.';
        } else if (err.code === 2) {
          customErr = 'Não foi possível determinar a localização física. Mudando para simulação.';
        } else if (err.code === 3) {
          customErr = 'Tempo limite esgotado ao obter localização.';
        }
        setErrorMsg(customErr);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Auto-request on component mount (optional, let's request once softly or let them click, best to try once silently)
  useEffect(() => {
    // We check if API is available and try to resolve
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then((status) => {
        setPermissionState(status.state as any);
        if (status.state === 'granted') {
          fetchRealLocation();
        }
      }).catch(() => {
        // Fallback for browsers not supporting permissions query
      });
    }
  }, []);

  const handleSelectPresetLocation = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLocation({
      lat: preset.lat,
      lng: preset.lng,
      name: `${preset.name} (Simulado)`,
      isSimulated: true
    });
    setErrorMsg(null);
  };

  // Enhance destinations with dynamic distances
  const processedDestinations = destinations
    .map(dest => {
      // If destination has coordinates, calculate distance; else mock it high
      const dLat = dest.lat ?? 0;
      const dLng = dest.lng ?? 0;
      const distance = dLat && dLng ? getHaversineDistance(location.lat, location.lng, dLat, dLng) : 999999;
      return {
        ...dest,
        distance
      };
    })
    // Filter within selected interest radius
    .filter(dest => dest.distance <= radiusKm)
    // Sort closest first
    .sort((a, b) => a.distance - b.distance);

  const handleDestinationClick = (destName: string) => {
    const matchingPkg = packages.find(p => p.destination === destName);
    if (matchingPkg) {
      setSelectedPackage(matchingPkg);
      setActiveTab('detail');
    } else {
      setActiveTab('pacotes');
    }
  };

  return (
    <section className="bg-slate-50 rounded-3xl p-6 border border-gray-100 text-left space-y-6" id="nearby-destination-suggestions">
      
      {/* Feature Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
            <Navigation className="w-3 h-3 text-rose-600 animate-pulse" />
            Sugestão Por Geolocalização
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight text-[#00112f] flex items-center gap-2">
            Descobertas sob Medida Próximas a Você
          </h2>
          <p className="text-gray-400 text-xs">
            A Angel Voyage utiliza a rede de satélites para encontrar os refúgios perfeitos mais próximos de você.
          </p>
        </div>

        {/* Action Button for GPS fetch */}
        <div className="flex flex-wrap items-center gap-2">
          {permissionState === 'denied' && (
            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 rounded-lg px-2 text-right py-1.5 md:max-w-xs leading-normal">
              ⚠️ GPS Bloqueado. Use o seletor rápido para simular.
            </span>
          )}
          <button
            onClick={fetchRealLocation}
            disabled={loading}
            className="bg-[#0f264c] hover:bg-[#00112f] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 shrink-0 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Obtendo GPS...' : 'Usar Minha Localização Atual'}
          </button>
        </div>
      </div>

      {/* Control Panel: Radius + Simulation Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
        
        {/* Radius Range Slider Selector */}
        <div className="col-span-1 lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Raio de Interesse Ativo:</span>
            <span className="font-mono font-bold text-rose-600 text-sm bg-rose-50 px-2 py-0.5 rounded">
              {radiusKm.toLocaleString('pt-BR')} km
            </span>
          </div>

          <input
            type="range"
            min="1000"
            max="20000"
            step="500"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-mono font-bold">
            <span>REGIONAL (1.000 KM)</span>
            <span>GLOBAL (20.000 KM)</span>
          </div>
        </div>

        {/* Simulated Coordinate Switcher */}
        <div className="col-span-1 lg:col-span-6 space-y-3">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px] block">
            Simulador de Ponto de Origem:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_LOCATIONS.map((preset) => {
              const isSelected = getHaversineDistance(location.lat, location.lng, preset.lat, preset.lng) === 0;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPresetLocation(preset)}
                  className={`text-[11px] px-3 py-1.5 font-bold rounded-lg border transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-gray-50 border-gray-200/60 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-rose-500' : 'text-gray-400'}`} />
                  {preset.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Origin Info Strip */}
      <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/60 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-rose-900 leading-normal">
          <Navigation className="w-4 h-4 text-rose-600 rotate-45 shrink-0" />
          <span>
            Buscando de: <strong>{location.name}</strong> • Lat: <code className="bg-white/70 px-1 py-0.5 rounded">{location.lat.toFixed(4)}</code> | Lng: <code className="bg-white/70 px-1 py-0.5 rounded">{location.lng.toFixed(4)}</code>
          </span>
        </div>
        {!location.isSimulated && (
          <span className="bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-[10px] uppercase font-bold py-0.5 px-2 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> GPS Autenticado
          </span>
        )}
      </div>

      {/* Suggested Destination Cards Slider / Grid */}
      {processedDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center space-y-2">
          <Compass className="w-8 h-8 text-rose-400 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
          <h3 className="font-display font-bold text-sm text-[#00112f]">Nenhum destino encontrado neste raio</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Aumente o raio do seu slider de interesse ou mude seu ponto de partida para varrer mais continentes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processedDestinations.map((dest) => {
            const hasPackage = packages.some(p => p.destination === dest.name);
            return (
              <div
                key={dest.id}
                onClick={() => handleDestinationClick(dest.name)}
                className="group bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 duration-500 transition"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Distance Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wide font-bold flex items-center gap-1 shadow-md">
                      <Navigation className="w-3 h-3 text-rose-400 rotate-45" />
                      A {dest.distance.toLocaleString('pt-BR')} km
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 text-slate-800 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {dest.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Card Header & Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-baseline gap-1">
                      <h3 className="font-display font-black text-lg text-[#00112f] leading-tight">
                        {dest.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-mono font-semibold uppercase">{dest.country}</span>
                    </div>

                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 h-8">
                      {dest.description}
                    </p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="p-5 pt-0 border-t border-gray-50 mt-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">A partir de</span>
                    <strong className="text-rose-500 text-sm font-black font-display">
                      R$ {dest.price.toLocaleString('pt-BR')}
                    </strong>
                  </div>

                  <span className="text-xs font-bold text-[#0f264c] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    {hasPackage ? 'Reservar Pacote' : 'Ver Detalhes'}
                    <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Hint banner */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-normal">
          <strong>Políticas de Privacidade:</strong> Suas coordenadas Geográficas de GPS são processadas estritamente de maneira local no seu navegador. Os dados não são persistidos nem divididos com terceiras firmas de publicidade ou marketing.
        </p>
      </div>

    </section>
  );
}
