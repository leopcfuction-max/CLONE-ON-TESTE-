import { Destination, TravelPackage, Reservation, Review } from './types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Grécia',
    price: 3200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcxLmCxg6gksIOtNaqOk6Yh2vEIsmtHAtnx9baol1BkCg1BkMRKcEf-EIbjttTw_ocLwLPb8JzdMf01IpWFbnBK6Vnli8IcMFfaEhGf91WrSVwdGmTcVUrEcJWluVA4X4m5GRiL0g005fOyZN4x5aDAxmfMNrODGHMXn7bVJYrNSfxt6IscnmnNyL-eNxT1Fu-CsPjkj09eXyaNO6yNJmDqiWiDkICQpD3TBlyQmk1KcCfUUlkOxq0Xb7Kjv8x7xWGyP4o_zPz2Ho',
    description: 'Pôr do sol inesquecível, arquitetura icônica e praias de areia vulcânica em uma ilha deslumbrante no mar Egeu.',
    bestSeason: 'Mai - Out',
    rating: 4.9,
    lat: 36.412,
    lng: 25.432
  },
  {
    id: 'dest-cairo',
    name: 'Cairo',
    country: 'Egito',
    price: 2800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDMtYmJka_fDX64EZLl5oiIUr9OxcE_PZECEkFXv1_VoCubaqtDL_kFcX6S29y9LeJ2sXzn7XlRldzklDebD_DvPog8RNa45BCUEOV4ezQlIHF8wFX4BLXJ_Av0vzieR6sKf3wSDh9ktl71B9Buf-EFA-WXy_V4pLm7xnnLontnQFgnwsjBh-SOZZizVjtlVHH2RWO4S4uD-NjpR-kFRjMd5e-A9HEs1lVA05uNvVBSxg09BzmOuU_43n6VEee5388uAerXTayvk4',
    description: 'Explore os mistérios dos faraós, as Grandes Pirâmides e navegue pelas águas históricas do rio Nilo com total exclusividade.',
    bestSeason: 'Out - Abr',
    rating: 4.8,
    lat: 30.044,
    lng: 31.235
  },
  {
    id: 'dest-zermatt',
    name: 'Zermatt',
    country: 'Suíça',
    price: 4500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8QNNGb3O2zSJcWhP649biUy-gGwRKV497nZSyhYi-pUBDoIm7Z62j4Qb6qo2-60U_YIlcW7NlkdF5KrHN648wSEQIcHPZuWUddI81kwejrRdx3rNhRL0A_KCRZge8xj9_TpbSz1VWVKJvD64bIVL9K-uhuFiC87KLTrQq9QnU5il4Hv37n08NNNTQITd3jclsg2MCcbyLIBdGYJAtltOD9MxKd_GnAGdUo5CCuPSbnSKqDR-S5ebRtolN0Wd_DyHHpkLZHfuxW7A',
    description: 'Elegância nos Alpes, resorts de esqui de classe mundial e vistas panorâmicas do majestoso Matterhorn.',
    bestSeason: 'Dez - Mar',
    rating: 4.5,
    lat: 46.02,
    lng: 7.749
  },
  {
    id: 'dest-noronha',
    name: 'Fernando de Noronha',
    country: 'Brasil',
    price: 2100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAWf3Bb-eOWOU206RqsUxC3E1Su2NZhErJOyeGlPP6oNvKgJnkAmKZBfDIcad_N3QMjPQRdnz36KxRDQHEkwNRqFs1isbVf-uhzVigVzyBVFvGcqo0nMRUon8lirfGq3KqAibIf97smddCbJd54ZzHQVcKSppr9u14FY6GPyWULz-GKQGJvlATjLdMWI0fGDWTlJtdQxz_bGjXSRD2b2PRPsY5dH1nmiHFctgZpNWbyVCQvtxgtW6HLRLf52qK_cLpIu2eXAdda_Y',
    description: 'Santuário ecológico intocado com as praias mais belas do mundo, ideal para mergulho e imersão na natureza.',
    bestSeason: 'Ago - Dez',
    rating: 4.7,
    lat: -3.854,
    lng: -32.426
  },
  {
    id: 'dest-angra',
    name: 'Angra dos Reis',
    country: 'Brasil',
    price: 1950,
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&auto=format&fit=crop&q=80',
    description: 'Águas verde-esmeralda, ilhas exclusivas de areia branca e iates luxuosos no litoral sul fluminense.',
    bestSeason: 'Dez - Mar',
    rating: 4.8,
    lat: -23.001,
    lng: -44.318
  },
  {
    id: 'dest-bora-bora',
    name: 'Bora Bora',
    country: 'Polinésia Francesa',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800&auto=format&fit=crop&q=80',
    description: 'Bangalôs sobre a água nas lagoas mais turquesas do mundo sob picos icônicos tropicais.',
    bestSeason: 'Mai - Out',
    rating: 4.9,
    lat: -16.5,
    lng: -151.741
  }
];

export const INITIAL_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-santorini',
    title: 'Escapada Clássica no Egeu',
    destination: 'Santorini',
    country: 'Grécia',
    hotel: 'Katikies Hotel',
    stars: 5,
    flight: 'Voo Direto (TAP)',
    durationDays: 7,
    durationNights: 6,
    originalPrice: 16200,
    currentPrice: 14500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HrPepSNIBuUp8XhkhYjITDlj_bBK2XRV8mySCqZqN1937RIns8PBTc6ETGY6xtSrdDBicTTu_5TujCVZIy60hIsO8VtzNws5kq7Cp4CXVLATn1KRGNhTyhXTEOU6I1dDU1LG7ftIJbsuZ_bl28EfKjPBai1RJuSpq8Q23oU4mRK7UWosdbHzTpsdYHbLGkIiLOMG8NyT4lvbDkyP-K6vgKYGL08DzfOnTVTGqhty8ZJ2Vu7V6Ep6XxeKScRHfI3SbVAs75ubKQc',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6HrPepSNIBuUp8XhkhYjITDlj_bBK2XRV8mySCqZqN1937RIns8PBTc6ETGY6xtSrdDBicTTu_5TujCVZIy60hIsO8VtzNws5kq7Cp4CXVLATn1KRGNhTyhXTEOU6I1dDU1LG7ftIJbsuZ_bl28EfKjPBai1RJuSpq8Q23oU4mRK7UWosdbHzTpsdYHbLGkIiLOMG8NyT4lvbDkyP-K6vgKYGL08DzfOnTVTGqhty8ZJ2Vu7V6Ep6XxeKScRHfI3SbVAs75ubKQc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCw7Q_OoaothNvyAVWSYqhNTcxEj8eLaaDsOQ7CjTG_lD26DjfdHhIvBLgGowSDUkZQc8saAf_a0xgezviEusEzfhvrRetJVn6IUC7USMi2x_1dfKEk-RXaxg2QomrfycVcAD3HXGZZDaQ3AK05uy1JooHEvpoEDv4b4TOhdnMQwXF33uj9t8J6bG4BvLHTR5yV0ifyqhT6Xji7B_LzrXuN1ml-W7dW86RmtbRJS0GmcU0bxaCrwfHJthk3PXZye0Wht3n5OSW-DTg',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewsCount: 128,
    description: 'Vivencie o epítome do romance grego. Desfrute da inigualável arquitetura branca e cúpulas azuis no Katikies Hotel, com vistas panorâmicas sobre a caldeira do vulcão e pôr do sol lendário de Oia.',
    accommodation: {
      name: 'Katikies Hotel Santorini',
      stars: 5,
      description: 'Aninhado nas falésias dramáticas de Oia, o Katikies Hotel oferece suítes de luxo esculpidas na rocha vulcânica com piscinas infinitas privativas aquecidas e serviço de mordomo dedicado.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw7Q_OoaothNvyAVWSYqhNTcxEj8eLaaDsOQ7CjTG_lD26DjfdHhIvBLgGowSDUkZQc8saAf_a0xgezviEusEzfhvrRetJVn6IUC7USMi2x_1dfKEk-RXaxg2QomrfycVcAD3HXGZZDaQ3AK05uy1JooHEvpoEDv4b4TOhdnMQwXF33uj9t8J6bG4BvLHTR5yV0ifyqhT6Xji7B_LzrXuN1ml-W7dW86RmtbRJS0GmcU0bxaCrwfHJthk3PXZye0Wht3n5OSW-DTg',
      amenities: ['Piscina Infinita', 'Serviço de Borda Líquida', 'Restaurante Michelin', 'Mordomo 24h']
    },
    itinerary: [
      { day: 1, title: 'Chegada VIP e Sunset Drink', description: 'Recepção VIP no aeroporto de Santorini com transfer executivo. Check-in na suíte luxo e brinde de boas-vindas ao pôr do sol.' },
      { day: 2, title: 'Cruzeiro Privativo em Catamarã', description: 'Explore a Caldeira de Santorini em um veleiro privativo com mergulho nas águas termais e almoço gourmet de frutos do mar a bordo.' },
      { day: 3, title: 'Degustação Histórica em Vinícolas Assadas', description: 'Tour de destilados e vinhos raros vulcânicos acompanhado de sommelier particular em vinícola escavada em caverna.' }
    ],
    includedExperiences: [
      { icon: 'scuba_diving', title: 'Mergulho na Caldeira', description: 'Exploração subaquática guiada por águas termais enriquecidas do vulcão.' },
      { icon: 'sailing', title: 'Sunset Private Cruise', description: 'Navegação ao entardecer sob as falésias douradas com chef exclusivo.' }
    ]
  },
  {
    id: 'pkg-dubai',
    title: 'Luxo Urbano e Deserto',
    destination: 'Dubai',
    country: 'EAU',
    hotel: 'Atlantis The Palm',
    stars: 5,
    flight: 'Emirates Airlines',
    durationDays: 5,
    durationNights: 4,
    originalPrice: 21000,
    currentPrice: 18200,
    isPromo: true,
    promoLabel: 'PROMOÇÃO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEUvRw9djQBIxsjcLWPAx738ZPnjdZNR5omJTEtGfnn9MapB4_CCeDnC1612uNSJPP0sKeczGtKa8klgkt2VkBld03wLFA9FBzRro7O_ba1lXnOTOmdcjN5-khaBEnfaDzjh3f2gts_ygcKv3tqJpYReAmvEdMaIEGR5M4PCt_n-LW6q2hkSXuNvj03qWr7edWi_uWzQigf5GiF6M5D4WFCl5hUt2Oegca3N1RpNDqE9y3ZQNU1ujdtrDxz9nH0gWfTSgzzE_psk4',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEUvRw9djQBIxsjcLWPAx738ZPnjdZNR5omJTEtGfnn9MapB4_CCeDnC1612uNSJPP0sKeczGtKa8klgkt2VkBld03wLFA9FBzRro7O_ba1lXnOTOmdcjN5-khaBEnfaDzjh3f2gts_ygcKv3tqJpYReAmvEdMaIEGR5M4PCt_n-LW6q2hkSXuNvj03qWr7edWi_uWzQigf5GiF6M5D4WFCl5hUt2Oegca3N1RpNDqE9y3ZQNU1ujdtrDxz9nH0gWfTSgzzE_psk4',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewsCount: 94,
    description: 'Experimente a opulência extravagante do Atlantis The Palm em Dubai. Desde parques aquáticos futuristas, gastronomia com estrelas Michelin, até safáris dourados nas dunas privativas do deserto.',
    accommodation: {
      name: 'Atlantis The Palm Dubai',
      stars: 5,
      description: 'O resort de cinco estrelas definitivo, coroando a icônica ilha de Palm Jumeirah. Apresenta o maior aquário do mundo, praias particulares de areia macia e quartos subaquáticos majestosos.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEUvRw9djQBIxsjcLWPAx738ZPnjdZNR5omJTEtGfnn9MapB4_CCeDnC1612uNSJPP0sKeczGtKa8klgkt2VkBld03wLFA9FBzRro7O_ba1lXnOTOmdcjN5-khaBEnfaDzjh3f2gts_ygcKv3tqJpYReAmvEdMaIEGR5M4PCt_n-LW6q2hkSXuNvj03qWr7edWi_uWzQigf5GiF6M5D4WFCl5hUt2Oegca3N1RpNDqE9y3ZQNU1ujdtrDxz9nH0gWfTSgzzE_psk4',
      amenities: ['Parque Aquático', 'Suíte Subaquática', 'Gastronomia Michelin', 'Heliponto Privado']
    },
    itinerary: [
      { day: 1, title: 'Boas-Vindas Reais em Palm Jumeirah', description: 'Recepção com limusine no aeroporto internacional e check-in exclusivo. Jantar VIP com vista para o aquário flutuante.' },
      { day: 2, title: 'Aventura Real no Deserto', description: 'Safári de SUV 4x4 gourmet com falcoaria clássica, passeio de camelo de elite e banquete em tenda luxuosa de tapetes persas.' },
      { day: 3, title: 'Helicóptero City Premium Tour', description: 'Voo panorâmico de helicóptero sobre as maiores maravilhas da engenharia humana, Burj Khalifa e Palm Islands.' }
    ],
    includedExperiences: [
      { icon: 'scuba_diving', title: 'Aquarium Dive Pro', description: 'Mergulho de cilindro no majestoso tanque do aquário gigante entre tubarões.' },
      { icon: 'explore', title: 'Desert Golden Safari', description: 'Aventura nas dunas vermelhas com acampamento beduíno estrelado premium.' }
    ]
  },
  {
    id: 'pkg-maldivas',
    title: 'Paraíso Intocado',
    destination: 'Maldivas',
    country: 'Maldivas',
    hotel: 'Soneva Jani Resort',
    stars: 5,
    flight: 'Qatar Airways',
    durationDays: 10,
    durationNights: 9,
    originalPrice: 39500,
    currentPrice: 35800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfosPS1TtLc_IRnEP0BJRg3J39LMPsNXSKJRakAcKUQlZi2sy9_NWtX2oqXBaLCUFnwNQjDwbG0DsMfICJ0vgWpvUG2-4nK86vuWr2UilFU2UeysY2pnoG-ZbYD7upDBOWhhUmQyB4ksx2xmx9VmrFHLa2U1JoSN07MeQP6woIxCnZzbOT_mUCzB81yvQsB7SIsnIn8tiZcAGBiBLn_Sw0sO9OObR0GyqTV7R2t2WfxgZjAmPAycuFf_rtwNENycmjZzbaj20WQms',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfosPS1TtLc_IRnEP0BJRg3J39LMPsNXSKJRakAcKUQlZi2sy9_NWtX2oqXBaLCUFnwNQjDwbG0DsMfICJ0vgWpvUG2-4nK86vuWr2UilFU2UeysY2pnoG-ZbYD7upDBOWhhUmQyB4ksx2xmx9VmrFHLa2U1JoSN07MeQP6woIxCnZzbOT_mUCzB81yvQsB7SIsnIn8tiZcAGBiBLn_Sw0sO9OObR0GyqTV7R2t2WfxgZjAmPAycuFf_rtwNENycmjZzbaj20WQms',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8-OCPmWgD2ZOXZmfFrQTy2fuS8O1ft-4WZMag8lxvZ9VF8axXKc2oeY3RC5OdQzVBxI74H2QQxj84egFZi9sZPM69QKXpWOAvl1_5H1VDD0VutHvn1mfyFS_-Q1PxBz7v5QeILlcw_zVAyu6FSnvq-I-K88nt95dMobJRjwaZ4BQdCzXtnrsh7AItVqRNczp0zkQnTDa1AhsxBxMnqApYXqpBLuk5oKH0lKiyfO5Ap6L2QblIe9ruLQfazJ5l4iHiDp0sL9vOss',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewsCount: 342,
    description: 'Desconecte-se de tudo nas majestosas águas turquesas do arquipélago das Maldivas. Usufrua de uma villa de dois andares com escorregador direto para a lagoa de coral azul elétrico.',
    accommodation: {
      name: 'Soneva Jani Resort Maldivas',
      stars: 5,
      description: 'Water Retreat de 1 Quarto com escorregador direto para a lagoa cristalina, teto retrátil sobre a cama master para observar as constelações equatoriais, e piscina particular suspensa com vista infinita.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8-OCPmWgD2ZOXZmfFrQTy2fuS8O1ft-4WZMag8lxvZ9VF8axXKc2oeY3RC5OdQzVBxI74H2QQxj84egFZi9sZPM69QKXpWOAvl1_5H1VDD0VutHvn1mfyFS_-Q1PxBz7v5QeILlcw_zVAyu6FSnvq-I-K88nt95dMobJRjwaZ4BQdCzXtnrsh7AItVqRNczp0zkQnTDa1AhsxBxMnqApYXqpBLuk5oKH0lKiyfO5Ap6L2QblIe9ruLQfazJ5l4iHiDp0sL9vOss',
      amenities: ['Wi-Fi Premium', 'Spa Terapêutico', 'Piscina Privada', 'Mordomo 24h']
    },
    itinerary: [
      { day: 1, title: 'Chegada e Recepção VIP', description: 'Chegada no Aeroporto Internacional de Malé. Recepção exclusiva no lounge da Soneva com bebidas de boas-vindas, seguida de traslado em hidroavião panorâmico até o resort. Check-in na sua Water Villa.' },
      { day: 2, title: 'Exploração Submarina', description: 'Manhã dedicada ao mergulho guiado por biólogos marinhos nos recifes próximos. Tarde livre para aproveitar a piscina privativa. Jantar sob as estrelas no observatório do resort.' },
      { day: 3, title: 'Relaxamento Profundo', description: 'Sessão matinal de yoga à beira-mar. À tarde, tratamento de assinatura de 90 minutos no Soneva Spa. Cruzeiro ao pôr do sol em um dhoni tradicional com champanhe e canapés.' }
    ],
    includedExperiences: [
      { icon: 'scuba_diving', title: 'Snorkeling em Recife Privativo', description: 'Equipamento premium e guia especializado para explorar a biodiversidade local.' },
      { icon: 'sailing', title: 'Cruzeiro ao Pôr do Sol', description: 'Navegação em barco tradicional com serviço de espumante e aperitivos finos.' }
    ]
  },
  {
    id: 'pkg-zermatt',
    title: 'Retiro Alpino Exclusivo',
    destination: 'Zermatt',
    country: 'Suíça',
    hotel: 'Mont Cervin Palace',
    stars: 4,
    flight: 'Swiss Int. Airlines',
    durationDays: 6,
    durationNights: 5,
    originalPrice: 24800,
    currentPrice: 22400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXEeHnLxxZxa9qGg7lidsrXjJBUaKH4RAQBcGEQVsZ7S_bmTCkZCaaaKYNoz27WELUOyd7pdZrVBK8HsLO_-ATLA53RB2cQ_xZ_xX7Rz8kE8QfC1AibrjXGEDFUw_qasaegyUeKMwRcWDBzrddhE5oARFj9iJwuCWekyZYXWvKxnSZM4X2LLuUaGVQtwHqduYyIXQOphwiJK1z8puW9z77lmro_TvF9xLfdrHpUzk-wb4PSCMpOrwBPkuE52ZCXTRdb2XCiofLik8',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXEeHnLxxZxa9qGg7lidsrXjJBUaKH4RAQBcGEQVsZ7S_bmTCkZCaaaKYNoz27WELUOyd7pdZrVBK8HsLO_-ATLA53RB2cQ_xZ_xX7Rz8kE8QfC1AibrjXGEDFUw_qasaegyUeKMwRcWDBzrddhE5oARFj9iJwuCWekyZYXWvKxnSZM4X2LLuUaGVQtwHqduYyIXQOphwiJK1z8puW9z77lmro_TvF9xLfdrHpUzk-wb4PSCMpOrwBPkuE52ZCXTRdb2XCiofLik8',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewsCount: 76,
    description: 'Aproveite a autêntica hospitalidade suíça em Zermatt, a vila livre de carros aos pés do lendário Matterhorn. Esqui alpino em pistas perfeitas e aconchego com lareiras aquecidas de pedra.',
    accommodation: {
      name: 'Mont Cervin Palace Zermatt',
      stars: 4,
      description: 'Com mais de 150 anos de história de excelência, o Mont Cervin Palace acolhe seus hóspedes com elegância tirolesa, banhos de jacuzzi térmicos externos e gastronomia acolhedora alpina de luxo.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXEeHnLxxZxa9qGg7lidsrXjJBUaKH4RAQBcGEQVsZ7S_bmTCkZCaaaKYNoz27WELUOyd7pdZrVBK8HsLO_-ATLA53RB2cQ_xZ_xX7Rz8kE8QfC1AibrjXGEDFUw_qasaegyUeKMwRcWDBzrddhE5oARFj9iJwuCWekyZYXWvKxnSZM4X2LLuUaGVQtwHqduYyIXQOphwiJK1z8puW9z77lmro_TvF9xLfdrHpUzk-wb4PSCMpOrwBPkuE52ZCXTRdb2XCiofLik8',
      amenities: ['Ski-in/Ski-out', 'Jacuzzi Térmica', 'Restaurante Fondue', 'Serviço de Carruagem']
    },
    itinerary: [
      { day: 1, title: 'Passeio de Carruagem e Alta Gastronomia', description: 'Recepção mágica na estação de Zermatt com uma carruagem clássica puxada a cavalos. Jantar de fondue trufado particular.' },
      { day: 2, title: 'Ski VIP Pass Matterhorn', description: 'Acesso prioritário às pistas mais exclusivas do Matterhorn Glacier Paradise com instrutor campeão olímpico dedicado.' },
      { day: 3, title: 'Spa Térmico ao Ar Livre', description: 'Tarde de terapia corporal de chocolate alpino seguida de banho termal sob flocos de neve silenciosos.' }
    ],
    includedExperiences: [
      { icon: 'snowboarding', title: 'Ski Pass Pro ilimitado', description: 'Acesso privativo total guiado à zona transfronteiriça com a Itália.' },
      { icon: 'spa', title: 'Hot Stone Alpine Relief', description: 'Massagem térmica com pedras vulcânicas do pico de Monte Rosa.' }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'VE-789012',
    packageId: 'pkg-paris-romance',
    packageTitle: 'Escapada Romântica em Paris',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWVYM9fX2VtZFjic9vrjl-D9J3AjkMeh7_GK4UR16L8FMeud7a_QJ5b7pBJYS_nCg-pBpeHsV8ThR2qSycRRow8YHMugoMayzxvP5H9QyygiD82422pe0UtppTjA0dBD0Fy5YyW9P622I5_xAXTcps1LxS2nOeG5Cu7LwBYyCXDcvJybdIEJb0jNip8ifVClaSEW02WCjwCT8uDb5Xq5X5K0r5VdLo0Xas05ZZhtdLjuleiFMXmpUchA_FI9-yHzVDeoqOAoyD6QA',
    startDate: '12 Nov 2024',
    endDate: '18 Nov 2024',
    adultsCount: 2,
    childrenCount: 0,
    status: 'Confirmada',
    paymentMethod: 'À Vista',
    totalPaid: 25507.50,
    daysToTrip: 15,
    passengers: [
      {
        fullName: 'Carlos Eduardo Silva',
        cpf: '123.456.789-00',
        document: 'RG 45.678.912-X',
        birthDate: '15/08/1985',
        nationality: 'Brasil',
        gender: 'Masculino'
      }
    ]
  },
  {
    id: 'VE-883291',
    packageId: 'pkg-maldivas',
    packageTitle: 'Retiro nas Maldivas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_EtYtDHGcIdOpZrTJe6NqaLjmqVvzXGJtqKG8mcUD9-uAPR67n_44JptrV1UGK3FrXHphlXG-7iX1_94zWTZ0N95raSqtp6mku6CChzH-FcWKYurJV_UoAJYw2zJ1RGYhkjJaf-7-NWFplvA3nzY5ady358cHyUu9NZxJJ1XSjPF3nhxwJgRzcntjh0VIi2vGRnuspmGpYd14_aqZDZFfw3C_3qahy0ybLtsaoGVGUeSgVK6Px1DUZddKlHHMAYD4P8tYQxCzwQg',
    startDate: '05 Jan 2025',
    endDate: '12 Jan 2025',
    adultsCount: 2,
    childrenCount: 0,
    status: 'Pendente Pagamento',
    paymentMethod: 'A Confirmar',
    totalPaid: 35800.00,
    daysToTrip: 45,
    passengers: [
      {
        fullName: 'Carlos Eduardo Silva',
        cpf: '123.456.789-00',
        document: 'RG 45.678.912-X',
        birthDate: '15/08/1985',
        nationality: 'Brasil',
        gender: 'Masculino'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-ana',
    userName: 'Ana Silva',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbsIs-uIjT_9aoLeneBRAKm0H5o6czDEpE1xKWQtoLLZqVhbCdRg7-FJ4FzKEA44Q7HDCku133U-mRJXn0ZrMKHlbAuGTEy-OYHtWPypY397wYF-yk7dAPhKyQF64RDXavntPaR-eH8ygr4F2yCkfhrgZNECALC4lQJjT_rMMv7RfLJ8W6LwPcZG392z3oJFCDmp1tBbA5L4sy-V5sOr057yRbrCH_k6wkizT9RjUBtr48O_ZHDt_a2rx5yE_ZXnBMKIp2mQyljSc',
    packageName: 'Maldivas - Resort Exclusivo',
    rating: 5,
    comment: 'A viagem dos sonhos! O resort nas Maldivas superou todas as expectativas. A organização da Angel Voyage foi impecável, desde o voo até os passeios locais. Recomendo de olhos fechados.',
    date: '12 de Outubro, 2024'
  },
  {
    id: 'rev-carlos',
    userName: 'Carlos Mendes',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqpyxZ8sW8rKUaYGQa0X-k2yTr41U6pj6Sc3ojfd3hCAopuTwdCznhTZFfUlBdxFpcY1hMHjeRU7QEqvXuDqOfscrh9beAThX1JgvViIuAnU9kubFmtQKvGyYyeCwVaADY5LtKzV5Qwk9TUZjBYwhfFpcpB9FiHfvxbECciwnt0vUqDP5utUfWZxAMtbIK2VcQU1B_Qm2pNfNhQCl77hv8VNErvhGUxz56zXtdHnGB676oIeHnqboN7BthIebWKrlnVlEa0jshOag',
    packageName: 'Paris - Romance e Cultura',
    rating: 4,
    comment: 'Excelente pacote. O hotel tinha uma vista linda para a Torre Eiffel. Tivemos um pequeno atraso no transfer do aeroporto, mas a equipe resolveu rapidamente.',
    date: '05 de Outubro, 2024'
  },
  {
    id: 'rev-mariana',
    userName: 'Mariana Costa',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWzWbp4mt6UJCUfwSz5bkRzJMUCLRkC5E3QpftIq3muKKnjn5Lpx19CINyNXU7ib5L2183j_hP6VHhcrECaPkboQDeIUFPhtGf3pVQszxHjshqG1pnUWIJgyiwpAKEUTUOzyb1fcA5T9utna2AXpzq78BaPanHoghBMlYmyNEYt1HeH0v64iyZhrw6QVhJTXyt6sztiJSlEYpqHkIgBmvBow_pdpKK3ImRDSNW0E53zsYWEMRAf0ratwWJWabWBJHNNQ4_JhQHWa0',
    packageName: 'Tóquio - Aventura Urbana',
    rating: 5,
    comment: 'Uma imersão cultural fantástica. O guia sugerido pela agência falava português perfeito e nos levou a lugares incríveis que não estavam nos guias turísticos comuns. Serviço de luxo.',
    date: '28 de Setembro, 2024'
  }
];
