export type Tab = 'inicio' | 'destinos' | 'pacotes' | 'reservas' | 'favoritos' | 'avaliacoes' | 'sobre_nos' | 'login' | 'simulador_uml';

export interface Destination {
  id: string;
  name: string;
  country: string;
  price: number;
  image: string;
  description: string;
  bestSeason: string;
  rating: number;
  lat?: number;
  lng?: number;
}

export interface Accommodation {
  name: string;
  stars: number;
  description: string;
  image: string;
  amenities: string[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  hotel: string;
  stars: number;
  flight: string;
  durationDays: number;
  durationNights: number;
  originalPrice: number;
  currentPrice: number;
  isPromo?: boolean;
  promoLabel?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  images?: string[];
  accommodation?: Accommodation;
  itinerary?: ItineraryItem[];
  includedExperiences?: { icon: string; title: string; description: string }[];
}

export interface Passenger {
  fullName: string;
  cpf: string;
  document: string;
  birthDate: string;
  nationality: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Reservation {
  id: string; // e.g. "VE-789012"
  packageId: string;
  packageTitle: string;
  image: string;
  startDate: string;
  endDate: string;
  adultsCount: number;
  childrenCount: number;
  status: 'Confirmada' | 'Pendente Pagamento' | 'Cancelada';
  passengers: Passenger[];
  paymentMethod: string;
  totalPaid: number;
  daysToTrip: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  packageName: string;
  rating: number;
  comment: string;
  date: string;
}
