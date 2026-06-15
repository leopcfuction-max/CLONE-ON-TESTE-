import React, { useState, useEffect } from 'react';
import { 
  Database, Play, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2, 
  HelpCircle, UserCheck, ToggleLeft, ToggleRight, Settings, Users, 
  Layers, CreditCard, Ticket, AlertTriangle, LogIn, ChevronRight, Sparkles, 
  DollarSign, MapPin, Percent, HelpCircle as HelpIcon, FileText, Send, Trash2
} from 'lucide-react';
import { TravelPackage, Reservation, Passenger, Review } from '../types';

interface UMLSimulationPanelProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  packages: TravelPackage[];
  setPackages: React.Dispatch<React.SetStateAction<TravelPackage[]>>;
  reviews: Review[];
  onAddNewReview: (newReviewData: Omit<Review, 'id' | 'date' | 'userAvatar'>) => void;
  setActiveTab: (tab: any) => void;
}

// Simulated full database representing all classes in UML diagram
interface UMLDatabase {
  agencias: any[];
  usuarios: any[];
  perfis: any[];
  funcionarios: any[];
  clientes: any[];
  passageiros: any[];
  enderecos: any[];
  hoteis: any[];
  quartos: any[];
  voos: any[];
  destinos: any[];
  reservas: any[];
  itensReserva: any[];
  cupons: any[];
  pagamentos: any[];
  transacoes: any[];
  reembolsos: any[];
}

export default function UMLSimulationPanel({ 
  currentUser, 
  setCurrentUser, 
  reservations, 
  setReservations, 
  packages, 
  setPackages,
  reviews,
  onAddNewReview,
  setActiveTab 
}: UMLSimulationPanelProps) {

  // Current sub-tab inside the UML simulator
  const [activeUmlTab, setActiveUmlTab] = useState<'usecases' | 'seq_reembolso' | 'seq_reserva' | 'classes'>('usecases');
  
  // Current Active Role simulation
  const [selectedRole, setSelectedRole] = useState<'sem_login' | 'logged_in' | 'admin'>('logged_in');

  // Multi-step delay sequence trace state
  const [traceLogs, setTraceLogs] = useState<{ message: string; source: string; target: string; payload?: string; step: number }[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunningTrace, setIsRunningTrace] = useState<boolean>(false);
  
  // Refund simulator state
  const [selectedReservationId, setSelectedReservationId] = useState<string>('');
  const [refundEligibility, setRefundEligibility] = useState<'elegivel' | 'nao_elegivel'>('elegivel');
  const [refundDelay, setRefundDelay] = useState<number>(600); // ms delay per step
  
  // Create Booking Simulator state
  const [bookingPkgId, setBookingPkgId] = useState<string>('');
  const [clientSearchEmail, setClientSearchEmail] = useState<string>('carlos.eduardo@voyageelite.com');
  const [bookingCoupon, setBookingCoupon] = useState<string>('VOYAGE10');
  const [paymentMethodForm, setPaymentMethodForm] = useState<'Cartao' | 'Pix'>('Cartao');
  const [forcePaymentSuccess, setForcePaymentSuccess] = useState<boolean>(true);
  const [bookingPassengers, setBookingPassengers] = useState<Passenger[]>([
    { fullName: 'Carlos Eduardo Silva', cpf: '123.456.789-00', document: 'RG 45.678.912-X', birthDate: '15/08/1985', nationality: 'Brasil', gender: 'Masculino' },
    { fullName: 'Ana Carolina Mendes', cpf: '987.654.321-11', document: 'RG 12.345.678-Y', birthDate: '24/11/1989', nationality: 'Brasil', gender: 'Feminino' }
  ]);

  // DB Schema Manager State
  const [db, setDb] = useState<UMLDatabase>({
    agencias: [
      { id: 1, nome_fantasia: 'Angel Voyage', razao_social: 'Angel Voyage Curadoria de Viagens Ltda', CNPJ: '23.456.789/0001-99', telefone: '+55 11 3000-4000', email: 'concierge@angelvoyage.com', site: 'build.angelvoyage.com' }
    ],
    usuarios: [
      { id: 101, email: 'carlos.eduardo@voyageelite.com', senha: '••••••••', status: true, tipo_conta: 'Cliente' },
      { id: 102, email: 'secretaria.luxo@angelvoyage.com', senha: '••••••••', status: true, tipo_conta: 'Funcionario' },
      { id: 103, email: 'diretor.gerência@angelvoyage.com', senha: '••••••••', status: true, tipo_conta: 'Administrador' }
    ],
    perfis: [
      { id: 201, nome: 'Perfil Executivo', descricao: 'Acesso a descontos exclusivos de classe executiva' }
    ],
    funcionarios: [
      { id: 301, data_admissao: '12/01/2024', status: true, email: 'secretaria.luxo@angelvoyage.com', descriçao: 'Consultor Sênior de Viagens' }
    ],
    clientes: [
      { id: 401, data_cadastro: '18/02/2025', status: true, email: 'carlos.eduardo@voyageelite.com' }
    ],
    passageiros: [
      { id: 501, nome: 'Carlos Eduardo Silva', cpf: '123.456.789-00', documento: 'RG 45.678.912-X', nacionalidade: 'Brasil' },
      { id: 502, nome: 'Ana Carolina Mendes', cpf: '987.654.321-11', documento: 'RG 12.345.678-Y', nacionalidade: 'Brasil' }
    ],
    enderecos: [
      { id: 601, rua: 'Av. Brigadeiro Faria Lima', numero: '3000', bairro: 'Itaim Bibi', cidade: 'São Paulo', cep: '01451-001', UF: 'SP', pais: 'Brasil', complemento: 'Andar 12' }
    ],
    hoteis: [
      { id: 701, nome: 'Katikies Hotel', categoria: 'Luxury 5★', telefone: '+30 2286 071400', email: 'info@katikies.com', checkin_padrao: '14:00', checkout_padrao: '11:00' },
      { id: 702, nome: 'Atlantis The Palm', categoria: 'Resort 5★', telefone: '+971 4 426 2000', email: 'guest@atlantis.com', checkin_padrao: '15:00', checkout_padrao: '12:00' }
    ],
    quartos: [
      { id: 801, hotelId: 701, tipo: 'Master Suite com Piscina Privativa', capacidade: 2, preco: 14500, descricao: 'Suíte esculpida na rocha com terraço amplo com vista panorâmica do vulcão.' }
    ],
    voos: [
      { id: 901, companhia: 'Emirates', numero_voo: 'EK 262', data_partida: '12/11/2026', data_chegada: '13/11/2026', classe: 'Executiva Business', status: true }
    ],
    destinos: [
      { id: 1001, nome: 'Santorini', descricao: 'Cúpulas azuis e pôr do sol inesquecível', tipo: 'Praia / Romance', status: true }
    ],
    reservas: [], // will sync on mount
    itensReserva: [],
    cupons: [
      { id: 11, codigo: 'ANGEL10', tipo_desconto: 'Percentual', valor_desconto: 0.10, status: true, descricao: 'Cupom de Boas Vindas de Luxo' },
      { id: 12, codigo: 'VOYAGE10', tipo_desconto: 'Percentual', valor_desconto: 0.10, status: true, descricao: 'Desconto Voucher Executiva' },
      { id: 13, codigo: 'OFFER5', tipo_desconto: 'Percentual', valor_desconto: 0.05, status: true, descricao: 'Promoção Especial' }
    ],
    pagamentos: [],
    transacoes: [],
    reembolsos: [
      { id: 'RE-8812', valor: 14500.00, status: 'Concluído', data_reembolso: '10/05/2026' }
    ]
  });

  // Selected database view table name
  const [selectedDbTable, setSelectedDbTable] = useState<keyof UMLDatabase>('reservas');

  // Input fields for adding items to DB (e.g. creating custom coupons)
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState('10');

  // Sync DB with main application state
  useEffect(() => {
    // Populate active reservation & items
    const syncedReservas = reservations.map(res => {
      // Find associated travel package to map with Diagrama de Classes attributes
      const pkg = packages.find(p => p.id === res.packageId);
      return {
        id: res.id,
        data_criacao: '11/06/2026',
        data_inicio: res.startDate,
        data_fim: res.endDate,
        status: res.status,
        valor: res.totalPaid,
        desconto: res.totalPaid * 0.1, // simulated discount
        passageiros: res.passengers?.map(p => p.fullName).join(', ') || 'Nenhum'
      };
    });

    const syncedItens = reservations.map((res, idx) => {
      return {
        id: 1500 + idx,
        reservaId: res.id,
        tipo_item: 'Passagem Aérea + Hotel',
        referencia: res.packageTitle,
        quantidade: res.adultsCount + res.childrenCount,
        valor_unitario: res.totalPaid,
        valor_total: res.totalPaid
      };
    });

    const syncedPagamentos = reservations.map((res, idx) => {
      return {
        id: 2500 + idx,
        reservaId: res.id,
        valor_total: res.totalPaid,
        valor_pago: res.status === 'Confirmada' ? res.totalPaid : 0,
        moeda: 'BRL',
        forma_pagamento: res.paymentMethod,
        status: res.status === 'Confirmada' ? 'Pago' : 'Pendente',
        data_vencimento: '11/06/2026',
        parcelas: res.paymentMethod.includes('x') ? parseInt(res.paymentMethod) : 1
      };
    });

    const syncedTransacoes = reservations.map((res, idx) => {
      return {
        id: 3500 + idx,
        pagamentoId: 2500 + idx,
        valor: res.status === 'Confirmada' ? res.totalPaid : 0,
        status: res.status === 'Confirmada' ? 'Aprovada' : 'Pendente'
      };
    });

    setDb(prev => ({
      ...prev,
      reservas: syncedReservas,
      itensReserva: syncedItens,
      pagamentos: syncedPagamentos,
      transacoes: syncedTransacoes
    }));

    if (reservations.length > 0 && !selectedReservationId) {
      setSelectedReservationId(reservations[0].id);
    }
  }, [reservations, packages]);

  // Handle active role sync
  useEffect(() => {
    if (selectedRole === 'sem_login') {
      setCurrentUser(null);
    } else if (selectedRole === 'logged_in') {
      setCurrentUser({
        name: 'Carlos Eduardo Silva',
        email: 'carlos.eduardo@voyageelite.com'
      });
    } else if (selectedRole === 'admin') {
      setCurrentUser({
        name: 'Concierge Administrador',
        email: 'diretor.gerência@angelvoyage.com',
        role: 'Admin'
      });
    }
  }, [selectedRole]);

  // Execute Step-by-Step Sequence for "Refund"
  const startRefundSequence = () => {
    if (!selectedReservationId) {
      alert('Nenhuma reserva ativa disponível para simular cancelamento.');
      return;
    }
    
    setIsRunningTrace(true);
    setCurrentStepIndex(-1);
    
    const targetReservation = reservations.find(r => r.id === selectedReservationId);
    if (!targetReservation) return;

    // Generate trace steps matching Diagrama de Sequência - Reembolso
    const steps = [
      {
        step: 1,
        source: 'Cliente',
        target: 'Interface',
        message: 'Aperta "Cancelar" na reserva ativa',
        payload: `ID: ${selectedReservationId}`
      },
      {
        step: 2,
        source: 'Interface',
        target: 'Controlador',
        message: 'SolicitarCancelamento()',
        payload: `ReservaId: ${selectedReservationId}`
      },
      {
        step: 3,
        source: 'Controlador',
        target: 'Reserva',
        message: 'ConsultarReserva()',
        payload: `Buscando dados da reserva (${targetReservation.packageTitle})`
      },
      {
        step: 4,
        source: 'Reserva',
        target: 'Controlador',
        message: 'DadosReserva',
        payload: `Status: ${targetReservation.status}, Valor: R$ ${targetReservation.totalPaid.toLocaleString('pt-BR')}`
      },
      {
        step: 5,
        source: 'Controlador',
        target: 'Reserva',
        message: 'VerificarElegibilidade()',
        payload: `Análise de prazos e multas (Diferença de dias: ${targetReservation.daysToTrip} dias)`
      },
      {
        step: 6,
        source: 'Reserva',
        target: 'Controlador',
        message: refundEligibility === 'elegivel' ? 'Elégivel' : 'nãoElegivel',
        payload: refundEligibility === 'elegivel' 
          ? 'Elegível para reembolso integral sem taxas de multa' 
          : 'Fora do prazo. Aplicar taxa de retenção de 20%'
      },
      {
        step: 7,
        source: 'Controlador',
        target: 'Pagamento',
        message: 'ConsultarPagamento()',
        payload: `Consultando método de pagamento (${targetReservation.paymentMethod})`
      },
      {
        step: 8,
        source: 'Pagamento',
        target: 'Controlador',
        message: 'PagamentoEncontrado',
        payload: `Total pago: R$ ${targetReservation.totalPaid.toLocaleString('pt-BR')}`
      },
      {
        step: 9,
        source: 'Controlador',
        target: 'Reembolso',
        message: 'CriarReembolso()',
        payload: `Registrando reembolso de R$ ${targetReservation.totalPaid.toLocaleString('pt-BR')} no faturamento`
      },
      {
        step: 10,
        source: 'Reembolso',
        target: 'Controlador',
        message: 'ReembolsoCriado',
        payload: `Reembolso ID: RE-${Math.floor(1000 + Math.random() * 9000)}, Status: Concluído`
      },
      {
        step: 11,
        source: 'Controlador',
        target: 'Reserva',
        message: 'AtualizarStatus("Cancelada")',
        payload: 'Marcando reserva no banco de dados como cancelada'
      },
      {
        step: 12,
        source: 'Reserva',
        target: 'Controlador',
        message: 'StatusAtualizado',
        payload: 'Persistido no banco de dados com sucesso'
      },
      {
        step: 13,
        source: 'Controlador',
        target: 'Interface',
        message: 'CancelamentoConfirmado',
        payload: 'Remetido confirmação para renderizadores'
      },
      {
        step: 14,
        source: 'Interface',
        target: 'Cliente',
        message: 'Confirmação exibida!',
        payload: 'Notificação pop-up e e-mail de estorno enviados'
      }
    ];

    setTraceLogs(steps);
    animateTrace(steps, 0);
  };

  // Run travel booking sequence diagram
  const startBookingSequence = () => {
    if (!bookingPkgId) {
      alert('Selecione um pacote na lista para simular a contratação.');
      return;
    }

    const selectedPkg = packages.find(p => p.id === bookingPkgId);
    if (!selectedPkg) return;

    setIsRunningTrace(true);
    setCurrentStepIndex(-1);

    const steps = [
      {
        step: 1,
        source: 'Cliente',
        target: 'Funcionário Agência',
        message: 'Solicita reserva de viagem/pacote',
        payload: `Pacote: ${selectedPkg.title}`
      },
      {
        step: 2,
        source: 'Funcionário Agência',
        target: 'Interface Agência',
        message: 'Consulta cliente no terminal',
        payload: `Filtrar por: ${clientSearchEmail}`
      },
      {
        step: 3,
        source: 'Interface Agência',
        target: 'Controlador Reserva',
        message: 'Buscar dados do cliente',
        payload: `Query de e-mail: ${clientSearchEmail}`
      },
      {
        step: 4,
        source: 'Controlador Reserva',
        target: 'Cliente Entidade',
        message: 'Consultar cadastro',
        payload: 'Verificando tabela CLIENTE + USUARIO'
      },
      {
        step: 5,
        source: 'Cliente Entidade',
        target: 'Controlador Reserva',
        message: clientSearchEmail === 'carlos.eduardo@voyageelite.com' ? 'Dados cadastrais encontrados' : 'Cliente não encontrado',
        payload: clientSearchEmail === 'carlos.eduardo@voyageelite.com' 
          ? 'Carlos Eduardo Silva (CPF 123.456.789-00)'
          : 'Simulando cláusula OPT: Criando cadastro (Executar Manter Cliente)'
      },
      {
        step: 6,
        source: 'Funcionário Agência',
        target: 'Interface Agência',
        message: 'Pesquisar pacotes disponíveis',
        payload: `Destino: ${selectedPkg.destination}`
      },
      {
        step: 7,
        source: 'Interface Agência',
        target: 'Controlador Reserva',
        message: 'Buscar pacotes disponíveis',
        payload: `PacoteId: ${bookingPkgId}`
      },
      {
        step: 8,
        source: 'Controlador Reserva',
        target: 'Pacote Viagem',
        message: 'Consultar disponibilidade',
        payload: 'Checando limite de reservas no hotel e voo'
      },
      {
        step: 9,
        source: 'Pacote Viagem',
        target: 'Controlador Reserva',
        message: 'Lista de pacotes e poltronas livres',
        payload: `Voo ${selectedPkg.flight} - Disponível`
      },
      {
        step: 10,
        source: 'Funcionário Agência',
        target: 'Interface Agência',
        message: 'Informar dados do passageiro (Loop para cada pax)',
        payload: `${bookingPassengers.length} passageiros cadastrados no bilhete`
      },
      {
        step: 11,
        source: 'Interface Agência',
        target: 'Controlador Reserva',
        message: 'Registrar passageiros no voo',
        payload: bookingPassengers.map(p => p.fullName).join('; ')
      },
      {
        step: 12,
        source: 'Controlador Reserva',
        target: 'Passageiro',
        message: 'Criar registro',
        payload: 'Instanciando tabelas PASSAGEIRO vinculadas à Reserva'
      },
      {
        step: 13,
        source: 'Passageiro',
        target: 'Controlador Reserva',
        message: 'Passageiro registrado',
        payload: 'Chaves estrangeiras geradas'
      },
      {
        step: 14,
        source: 'Funcionário Agência',
        target: 'Interface Agência',
        message: 'Informar cupom de desconto (Loop opcional)',
        payload: `Cupom digitado: ${bookingCoupon || 'Sem cupom'}`
      },
      {
        step: 15,
        source: 'Interface Agência',
        target: 'Controlador Reserva',
        message: 'Validar cupom',
        payload: `Código: ${bookingCoupon}`
      },
      {
        step: 16,
        source: 'Controlador Reserva',
        target: 'Cupom',
        message: 'Verificar validade',
        payload: 'Verifica campo status=true'
      },
      {
        step: 17,
        source: 'Cupom',
        target: 'Controlador Reserva',
        message: bookingCoupon === 'VOYAGE10' ? 'Cupom válido (-10%)' : 'Cupom inválido',
        payload: bookingCoupon === 'VOYAGE10' ? 'Desconto ativo de 10%' : 'Nenhum desconto inserido'
      },
      {
        step: 18,
        source: 'Controlador Reserva',
        target: 'Reserva',
        message: 'Criar reserva',
        payload: `Valor estimado: R$ ${(selectedPkg.currentPrice * bookingPassengers.length).toLocaleString('pt-BR')}`
      },
      {
        step: 19,
        source: 'Reserva',
        target: 'Controlador Reserva',
        message: 'Reserva criada (Status: Pendente)',
        payload: `Localizador: AV-${Math.floor(100000 + Math.random() * 900000)}`
      },
      {
        step: 20,
        source: 'Funcionário Agência',
        target: 'Interface Agência',
        message: 'Registrar forma de pagamento',
        payload: `Forma: ${paymentMethodForm}`
      },
      {
        step: 21,
        source: 'Interface Agência',
        target: 'Controlador Reserva',
        message: 'Processar pagamento',
        payload: `Método: ${paymentMethodForm}`
      },
      {
        step: 22,
        source: 'Controlador Reserva',
        target: 'Pagamento',
        message: 'Criar pagamento',
        payload: 'Instancia classe PAGAMENTO'
      },
      {
        step: 23,
        source: 'Pagamento',
        target: 'Transação',
        message: 'Processar transação',
        payload: forcePaymentSuccess ? 'Aprovado pelo gateway' : 'Recusado pelo gateway (Crédito sem limite)'
      },
      {
        step: 24,
        source: 'Transação',
        target: 'Pagamento',
        message: forcePaymentSuccess ? 'Processado / Aprovado' : 'Recusado / Pagamento falhou',
        payload: forcePaymentSuccess ? 'Retorno status = Código 200' : 'Código 502 recusado'
      },
      {
        step: 25,
        source: 'Pagamento',
        target: 'Controlador Reserva',
        message: forcePaymentSuccess ? 'Pagamento confirmado' : 'Pagamento falhou',
        payload: forcePaymentSuccess ? 'Reserva movida para CONFIRMADA' : 'Reserva mantida em PENDENTE'
      },
      {
        step: 26,
        source: 'Controlador Reserva',
        target: 'Reserva',
        message: forcePaymentSuccess ? 'Reserva confirmada' : 'Informar falha',
        payload: forcePaymentSuccess ? 'Emissão de bilhete concluída' : 'Reserva cancelada automaticamente por expiração'
      },
      {
        step: 27,
        source: 'Controlador Reserva',
        target: 'Interface Agência',
        message: forcePaymentSuccess ? 'Gerar voucher' : 'Exibe erro',
        payload: forcePaymentSuccess ? 'Voucher oficial gerado em formato text/pdf' : 'Pagamento Recusado'
      },
      {
        step: 28,
        source: 'Interface Agência',
        target: 'Funcionário Agência',
        message: forcePaymentSuccess ? 'Comprovante gerado' : 'Exibe erro',
        payload: forcePaymentSuccess ? 'Impressão autorizada do localizador' : 'Cancelar transação'
      }
    ];

    setTraceLogs(steps);
    animateTrace(steps, 0);
  };

  const animateTrace = (stepsList: any[], currentIdx: number) => {
    if (currentIdx >= stepsList.length) {
      setIsRunningTrace(false);
      
      // If we finished the refund simulation successfully, actually update the reservation status in the main app!
      if (activeUmlTab === 'seq_reembolso' && refundEligibility === 'elegivel') {
        setReservations(prev => prev.map(res => 
          res.id === selectedReservationId ? { ...res, status: 'Cancelada' } : res
        ));
      }
      
      // If we finished a successful booking simulation, append a real reservation in the main app to prove backend connection!
      if (activeUmlTab === 'seq_reserva' && forcePaymentSuccess) {
        const pkgSelected = packages.find(p => p.id === bookingPkgId);
        if (pkgSelected) {
          const freshReservation: Reservation = {
            id: `AV-${Math.floor(100000 + Math.random() * 900000)}`,
            packageId: pkgSelected.id,
            packageTitle: pkgSelected.title,
            image: pkgSelected.image,
            startDate: '22 Dez 2026',
            endDate: '30 Dez 2026',
            adultsCount: bookingPassengers.length,
            childrenCount: 0,
            status: 'Confirmada',
            passengers: bookingPassengers,
            paymentMethod: paymentMethodForm === 'Cartao' ? 'Cartão de Crédito 1x' : 'Pix Confirmado',
            totalPaid: pkgSelected.currentPrice * bookingPassengers.length * (bookingCoupon === 'VOYAGE10' ? 0.9 : 1),
            daysToTrip: 120
          };
          setReservations(prev => [freshReservation, ...prev]);
        }
      }

      return;
    }

    setCurrentStepIndex(currentIdx);
    setTimeout(() => {
      animateTrace(stepsList, currentIdx + 1);
    }, refundDelay);
  };

  const handleAddNewCoupon = () => {
    if (!newCouponCode) return;
    const cleanCode = newCouponCode.trim().toUpperCase();
    const valFloat = parseFloat(newCouponVal) / 100;
    
    const nextCoupon = {
      id: db.cupons.length + 100,
      codigo: cleanCode,
      tipo_desconto: 'Percentual',
      valor_desconto: valFloat,
      status: true,
      descricao: `Criado no gerenciador administrativo`
    };

    setDb(prev => ({
      ...prev,
      cupons: [...prev.cupons, nextCoupon]
    }));
    setNewCouponCode('');
    alert(`Cupom ${cleanCode} cadastrado com sucesso no banco de dados UML!`);
  };

  const handleDeleteCoupon = (id: number) => {
    setDb(prev => ({
      ...prev,
      cupons: prev.cupons.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-8 text-left animate-fade-in my-4" id="uml-simulation-panel">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 px-2.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] uppercase font-bold rounded-full">Simulador UML & Backend</span>
            <span className="p-1 px-2 bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-bold rounded-full">Operações Reais</span>
          </div>
          <h1 className="font-display font-black text-2xl text-[#00112f] tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            Consola de Arquitetura & Integração de Dados
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Execute em tempo real os diagramas de classe, sequência e casos de uso requisitados para o sistema fiduciário Angel Voyage.</p>
        </div>

        {/* Global Role selector demonstrating Diagrama de Casos de Uso */}
        <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-gray-500 uppercase px-2">Perfil de Caso de Uso:</span>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-lg text-xs font-semibold py-1.5 px-3 text-[#0f264c] focus:outline-none"
          >
            <option value="sem_login">Cliente (Sem login - Visitante)</option>
            <option value="logged_in">Cliente (Com login - Carlos Eduardo)</option>
            <option value="admin">Administrador (Gestão Geral)</option>
          </select>
        </div>
      </div>

      {/* UML tabs switcher */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveUmlTab('usecases')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
            activeUmlTab === 'usecases'
              ? 'bg-[#0f264c] text-white border-[#0f264c] shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          1. Casos de Uso (Permissões de Escopo)
        </button>

        <button
          onClick={() => setActiveUmlTab('seq_reembolso')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
            activeUmlTab === 'seq_reembolso'
              ? 'bg-[#0f264c] text-white border-[#0f264c] shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Sequência: Cancelamento / Reembolso
        </button>

        <button
          onClick={() => setActiveUmlTab('seq_reserva')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
            activeUmlTab === 'seq_reserva'
              ? 'bg-[#0f264c] text-white border-[#0f264c] shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          3. Sequência: Reserva de Viagens
        </button>

        <button
          onClick={() => setActiveUmlTab('classes')}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
            activeUmlTab === 'classes'
              ? 'bg-[#0f264c] text-white border-[#0f264c] shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Database className="w-4 h-4" />
          4. Tabelas de Classes (Banco de Dados)
        </button>
      </div>

      {/* TAB SUB-CONTENT 1: USE CASES INTERACTIVE MATRIX */}
      {activeUmlTab === 'usecases' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-xs text-indigo-900 uppercase">Mapeador Dinâmico de Funções (Diagrama de Caso de Uso)</h4>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                As ações e permissões do sistema são totalmente filtradas de acordo com o papel atualmente simulado no seletor do topo. Alterne os perfis para habilitar ou desabilitar recursos na interface principal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User sem login */}
            <div className={`p-5 rounded-2xl border transition-all ${selectedRole === 'sem_login' ? 'border-amber-400 bg-amber-50/20 shadow-sm ring-1 ring-amber-400' : 'border-gray-100 opacity-65 bg-gray-50/30'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">Cliente Sem Login</span>
                {selectedRole === 'sem_login' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              </div>
              <h3 className="font-display font-bold text-sm text-[#00112f] mb-2">Ações Permitidas</h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">✓ Buscar destinos e pacotes</li>
                <li className="flex items-center gap-1.5">✓ Verificar detalhes de pacotes</li>
                <li className="flex items-center gap-1.5">✓ Consultar disponibilidade</li>
                <li className="flex items-center gap-1.5 text-red-500 font-semibold">✗ Realizar Reservas (Requer Login)</li>
                <li className="flex items-center gap-1.5 text-red-500 font-semibold">✗ Cancelar Reservas / Ver Histórico</li>
              </ul>
              {selectedRole !== 'sem_login' && (
                <button 
                  onClick={() => setSelectedRole('sem_login')} 
                  className="mt-4 w-full bg-white hover:bg-gray-50 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg border border-gray-200 block text-center"
                >
                  Simular Este Perfil
                </button>
              )}
            </div>

            {/* User com login */}
            <div className={`p-5 rounded-2xl border transition-all ${selectedRole === 'logged_in' ? 'border-[#ff5a5f] bg-[#ff5a5f]/5 shadow-sm ring-1 ring-[#ff5a5f]' : 'border-gray-100 opacity-65 bg-gray-50/30'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold text-[#ff5a5f] bg-red-50 px-2 py-0.5 rounded uppercase">Cliente Com Login</span>
                {selectedRole === 'logged_in' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              </div>
              <h3 className="font-display font-bold text-sm text-[#00112f] mb-2">Ações Permitidas</h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">✓ Buscar, selecionar, consultar</li>
                <li className="flex items-center gap-1.5">✓ Informar dados de passageiros</li>
                <li className="flex items-center gap-1.5">✓ Aplicar cupons de desconto</li>
                <li className="flex items-center gap-1.5">✓ Efetuar pagamento eletrônico</li>
                <li className="flex items-center gap-1.5 font-bold text-indigo-700">✓ Cancelar reservas & Solicitar Reembolso</li>
                <li className="flex items-center gap-1.5">✓ Compor avaliações de viagens</li>
              </ul>
              {selectedRole !== 'logged_in' && (
                <button 
                  onClick={() => setSelectedRole('logged_in')} 
                  className="mt-4 w-full bg-white hover:bg-gray-50 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg border border-gray-200 block text-center"
                >
                  Simular Este Perfil
                </button>
              )}
            </div>

            {/* Administrador / Funcionario */}
            <div className={`p-5 rounded-2xl border transition-all ${selectedRole === 'admin' ? 'border-indigo-600 bg-indigo-50/10 shadow-sm ring-1 ring-indigo-600' : 'border-gray-100 opacity-65 bg-gray-50/30'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">Administrador / Agente</span>
                {selectedRole === 'admin' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              </div>
              <h3 className="font-display font-bold text-sm text-[#00112f] mb-2">Ações Permitidas</h3>
              <ul className="space-y-1.5 text-xs text-indigo-900 font-medium">
                <li className="flex items-center gap-1.5">⚙️ Gerenciar pacotes de luxo e promoções</li>
                <li className="flex items-center gap-1.5">⚙️ Gerenciar usuários e ficha de clientes</li>
                <li className="flex items-center gap-1.5">⚙️ Emitir reembolsos e apurar transações</li>
                <li className="flex items-center gap-1.5">⚙️ Gerenciar cupons ativos no banco fiduciário</li>
                <li className="flex items-center gap-1.5">⚙️ Coletar auditorias de logs e diagramas</li>
              </ul>
              {selectedRole !== 'admin' && (
                <button 
                  onClick={() => setSelectedRole('admin')} 
                  className="mt-4 w-full bg-white hover:bg-gray-50 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg border border-gray-200 block text-center"
                >
                  Simular Este Perfil
                </button>
              )}
            </div>

          </div>

          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">Quer realizar um teste prático de navegação?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => { setActiveTab('pacotes'); }}
                className="bg-[#0f264c] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg"
              >
                Explorar Pacotes
              </button>
              <button 
                onClick={() => { setActiveTab('reservas'); }}
                className="border border-[#0f264c] text-[#0f264c] bg-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg"
              >
                Minhas Reservas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB SUB-CONTENT 2: SEQUENTIAL TRACE FOR CANCEL/REFUND */}
      {activeUmlTab === 'seq_reembolso' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Settings for simulator */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Selecione uma Reserva</label>
              <select
                value={selectedReservationId}
                onChange={(e) => setSelectedReservationId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                {reservations.length === 0 ? (
                  <option value="">Nenhuma reserva ativa encontrada</option>
                ) : (
                  reservations.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.id} - {res.packageTitle} ({res.status})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Análise de Elegibilidade</label>
              <select
                value={refundEligibility}
                onChange={(e) => setRefundEligibility(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value="elegivel">Elegível - Reembolso Integral (100%)</option>
                <option value="nao_elegivel">Não Elegível - Taxas aplicar (Retém 20%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Velocidade da Transição</label>
              <select
                value={refundDelay}
                onChange={(e) => setRefundDelay(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value={150}>Instantâneo (150ms)</option>
                <option value={600}>Velocidade Normal (600ms)</option>
                <option value={1500}>Câmara Lenta (1.5s)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startRefundSequence}
                disabled={isRunningTrace || !selectedReservationId}
                className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                Iniciar Fluxo
              </button>
              
              <button
                onClick={() => {
                  setCurrentStepIndex(-1);
                  setTraceLogs([]);
                }}
                disabled={isRunningTrace}
                className="bg-white border border-gray-200 p-2 text-gray-500 rounded-lg hover:bg-gray-50"
                title="Resetar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Lifelines visual sequencer */}
            <div className="lg:col-span-8 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block">Mensageiro UML de Sequência</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded font-bold">
                  Reembolso de Passagens
                </span>
              </div>

              {/* Graphical vertical trace log */}
              <div className="space-y-3 min-h-[350px] overflow-y-auto no-scrollbar max-h-[450px]">
                {traceLogs.length === 0 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                    <Layers className="w-8 h-8 text-slate-600 animate-pulse" />
                    <p className="text-xs">Clique em "Iniciar Fluxo" para começar o mapeamento de mensagens de canais backend.</p>
                  </div>
                ) : (
                  traceLogs.map((log, i) => {
                    const isPassed = currentStepIndex >= i;
                    const isActive = currentStepIndex === i;

                    return (
                      <div 
                        key={i} 
                        className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-3 border ${
                          isActive 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500 font-semibold' 
                            : isPassed 
                              ? 'bg-slate-800/40 border-emerald-500/40 text-gray-300 opacity-80' 
                              : 'bg-transparent border-transparent text-gray-600 opacity-40'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-gray-400'
                        }`}>
                          {log.step}
                        </span>

                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-1">
                          <span className="text-[11px] font-mono shrink-0">
                            <strong>{log.source}</strong> ➔ <strong>{log.target}</strong>
                          </span>
                          <span className="text-xs text-white/95">{log.message}</span>
                          <span className="text-[10px] text-gray-400 font-mono italic text-right truncate" title={log.payload}>
                            {log.payload}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* UML Entity details inspector panel */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400 leading-normal">Instanciador de Estado UML</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs flex items-start gap-2.5">
                  <Database className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-gray-700">Persistência Reais:</span>
                    <p className="text-gray-500 text-[10px] leading-relaxed">
                      Ao completar com sucesso, a reserva é marcada como <strong>"Cancelada"</strong> em tempo real no banco principal do site.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Entidades Afetadas no Diagrama de Classes</span>
                  
                  {/* Entity status block templates */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#0f264c] bg-indigo-50 px-2 py-0.5 rounded">Reserva</span>
                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Status do Registro:</span>
                      <strong className={currentStepIndex >= 11 ? 'text-red-500' : 'text-emerald-600'}>
                        {currentStepIndex >= 11 ? 'Cancelada' : 'Ativa'}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#0f264c] bg-indigo-50 px-2 py-0.5 rounded">Reembolso</span>
                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Mock instanciado:</span>
                      <strong className={currentStepIndex >= 9 ? 'text-emerald-600' : 'text-gray-400'}>
                        {currentStepIndex >= 9 ? 'Criado / Em Estorno' : 'Não Instanciado'}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#0f264c] bg-indigo-50 px-2 py-0.5 rounded">Agência Fiduciária</span>
                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Contas a Pagar:</span>
                      <strong className={currentStepIndex >= 9 ? 'text-[#ff5a5f]' : 'text-gray-600'}>
                        {currentStepIndex >= 9 ? 'Total Estornado' : 'Sem pendências'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB SUB-CONTENT 3: TRIP BOOKING SEQUENCE DIAGRAM SIMULATOR */}
      {activeUmlTab === 'seq_reserva' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Escolha o Pacote de Viagem</label>
              <select
                value={bookingPkgId}
                onChange={(e) => setBookingPkgId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value="">Selecione um pacote...</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.destination} - {pkg.title} (R$ {pkg.currentPrice.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cadastrado / OPT clause</label>
              <select
                value={clientSearchEmail}
                onChange={(e) => setClientSearchEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value="carlos.eduardo@voyageelite.com">Cadastrado (Carlos Eduardo)</option>
                <option value="visitante.novo@email.com">Não Cadastrado (Executar Manter Cliente)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Simular Falha de Pagamento</label>
              <select
                value={forcePaymentSuccess ? 'sim' : 'nao'}
                onChange={(e) => setForcePaymentSuccess(e.target.value === 'sim')}
                className="w-full bg-white border border-gray-200 rounded-lg text-xs py-1.5 px-3 focus:outline-none"
              >
                <option value="sim">Aprovar Pagamento (Com Juros/Sem Juros) [Aprovado]</option>
                <option value="nao">Recusar Pagamento (Crédito Recusado) [Malsucedida]</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startBookingSequence}
                disabled={isRunningTrace || !bookingPkgId}
                className="flex-grow bg-[#ff5a5f] hover:bg-rose-600 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                Criar Reserva
              </button>
              
              <button
                onClick={() => {
                  setCurrentStepIndex(-1);
                  setTraceLogs([]);
                }}
                disabled={isRunningTrace}
                className="bg-white border border-gray-200 p-2 text-gray-500 rounded-lg"
                title="Resetar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-8 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block">Mensageiro UML de Sequência</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-mono px-2 py-0.5 rounded font-bold">
                  Reserva de Viagens e Pacotes
                </span>
              </div>

              <div className="space-y-3 min-h-[400px] overflow-y-auto no-scrollbar max-h-[500px]">
                {traceLogs.length === 0 ? (
                  <div className="h-[350px] flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                    <Layers className="w-8 h-8 text-slate-600 animate-pulse" />
                    <p className="text-xs">Clique em "Criar Reserva" para rodar o fluxograma sequencial de aquisição com o banco.</p>
                  </div>
                ) : (
                  traceLogs.map((log, i) => {
                    const isPassed = currentStepIndex >= i;
                    const isActive = currentStepIndex === i;

                    return (
                      <div 
                        key={i} 
                        className={`p-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 border ${
                          isActive 
                            ? 'bg-[#ff5a5f]/20 border-[#ff5a5f] text-white ring-1 ring-red-400 font-semibold' 
                            : isPassed 
                              ? 'bg-slate-800/40 border-emerald-500/40 text-gray-300 opacity-80' 
                              : 'bg-transparent border-transparent text-gray-600 opacity-40'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-gray-400'
                        }`}>
                          {log.step}
                        </span>

                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-1">
                          <span className="text-[11px] font-mono shrink-0">
                            <strong>{log.source}</strong> ➔ <strong>{log.target}</strong>
                          </span>
                          <span className="text-xs text-white/95">{log.message}</span>
                          <span className="text-[10px] text-gray-400 font-mono italic text-right truncate" title={log.payload}>
                            {log.payload}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400 leading-normal">Comprovante de Execução</h3>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold block text-gray-700 mb-1">Mapeamento UML em Ação:</span>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    Esta ferramenta de simulação conecta o fluxo do <strong>Diagrama de Sequência de Contratação</strong> diretamente às classes de dados, adicionando novos itens na lista quando o pagamento for aprovado.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-xs space-y-2">
                  <span className="text-[10px] font-mono text-[#0f264c] bg-indigo-50 px-2 py-0.5 rounded font-bold block w-fit">Cupom de Desconto</span>
                  <div>
                    <label className="block text-[9px] text-gray-400 uppercase font-bold">Cupom Aplicado:</label>
                    <input 
                      type="text" 
                      value={bookingCoupon} 
                      onChange={(e) => setBookingCoupon(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-gray-200 rounded p-1 text-[11px] focus:outline-none"
                    />
                  </div>
                  <p className="text-[9px] text-gray-400">Insira "VOYAGE10" para simular a validação com sucesso do cupom, ou outro código para simular falha ou recusa.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB SUB-CONTENT 4: DATABASE SCHEMAS BROWSER */}
      {activeUmlTab === 'classes' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <Settings className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs text-indigo-900 uppercase">Inspetor de Entidades do Diagrama de Classes</h4>
              <p className="text-gray-600 text-[11px]">
                Nossos modelos lógicos de front e simulação do back-end foram unificados! Selecione qualquer tabela de classes abaixo e visualize os dados instanciados de acordo com os atributos definidos no diagrama UML de classes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar tables list */}
            <div className="md:col-span-3 space-y-1 bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1 block">Tabelas UML de Classes</span>
              
              {/* Table selectors */}
              {[
                { name: 'agencias', label: 'Agência (Empresa)' },
                { name: 'usuarios', label: 'Usuário & Credencial' },
                { name: 'perfis', label: 'Perfil Geral' },
                { name: 'funcionarios', label: 'Funcionários Concierge' },
                { name: 'clientes', label: 'Clientes (Titulares)' },
                { name: 'passageiros', label: 'Passageiros Cadastrados' },
                { name: 'enderecos', label: 'Endereço (Pessoa)' },
                { name: 'hoteis', label: 'Hotel' },
                { name: 'quartos', label: 'Quarto' },
                { name: 'voos', label: 'Voo' },
                { name: 'destinos', label: 'Destino' },
                { name: 'cupons', label: 'Cupom de Desconto' },
                { name: 'reservas', label: 'Reserva' },
                { name: 'itensReserva', label: 'itemReserva (Itens)' },
                { name: 'pagamentos', label: 'Pagamento' },
                { name: 'transacoes', label: 'TransacaoPagamento' },
                { name: 'reembolsos', label: 'Reembolso' }
              ].map((table) => {
                const isSelected = selectedDbTable === table.name;
                const rowCount = db[table.name as keyof UMLDatabase]?.length || 0;

                return (
                  <button
                    key={table.name}
                    onClick={() => setSelectedDbTable(table.name as keyof UMLDatabase)}
                    className={`w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <span>{table.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {rowCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid display and entity creator */}
            <div className="md:col-span-9 bg-white border border-gray-100 rounded-2xl p-5 space-y-6">
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#00112f] uppercase">Tabela: {selectedDbTable}</h3>
                  <p className="text-gray-400 text-[10px]">Esquema unificado contendo dados inseridos no banco de dados.</p>
                </div>

                {/* Show a tool to quickly add coupons to database if viewing 'cupons' */}
                {selectedDbTable === 'cupons' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="NOVO_CODIGO"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs uppercase focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded py-1 px-1.5 text-xs text-gray-600"
                    >
                      <option value="5">5% desconto</option>
                      <option value="10">10% desconto</option>
                      <option value="15">15% desconto</option>
                      <option value="20">20% desconto</option>
                    </select>
                    <button
                      onClick={handleAddNewCoupon}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded"
                    >
                      + Cadastrar
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Real Table Grid rendering */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {db[selectedDbTable]?.length > 0 ? (
                        Object.keys(db[selectedDbTable][0]).map((key) => (
                          <th key={key} className="p-3 font-mono">{key}</th>
                        ))
                      ) : (
                        <th className="p-3">Sem atributos cadastrados</th>
                      )}
                      {selectedDbTable === 'cupons' && <th className="p-3 text-right">Ação</th>}
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-gray-100">
                    {db[selectedDbTable]?.length > 0 ? (
                      db[selectedDbTable].map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.keys(row).map((key) => (
                            <td key={key} className="p-3 font-mono text-[11px] text-gray-700">
                              {typeof row[key] === 'boolean' ? (
                                row[key] ? (
                                  <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Ativo</span>
                                ) : (
                                  <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Inativo</span>
                                )
                              ) : typeof row[key] === 'number' && key.includes('valor') || key.includes('preco') ? (
                                `R$ ${row[key].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              ) : row[key]?.toString() || '—'}
                            </td>
                          ))}
                          {selectedDbTable === 'cupons' && (
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteCoupon(row.id)}
                                className="text-red-500 hover:text-red-600 p-1"
                                title="Deletar cupom do banco fiduciário"
                              >
                                <Trash2 className="w-4 h-4 inline-block" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                          Tabela vazia. Faça uma simulação ou use os controles administrativos para adicionar novos registros no esquema UML.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
