import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Check, CreditCard, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';
import { TravelPackage, Passenger, Reservation } from '../types';

interface BookingWizardProps {
  packageData: TravelPackage;
  currentUser: any;
  onBookingSuccess: (reservation: Reservation) => void;
  onCancel: () => void;
}

export default function BookingWizard({ packageData, currentUser, onBookingSuccess, onCancel }: BookingWizardProps) {
  const [step, setStep] = useState<2 | 3 | 4 | 5>(2);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  
  // Passenger info
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      fullName: currentUser?.name || 'Carlos Eduardo Silva',
      cpf: '123.456.789-00',
      document: 'RG 45.678.912-X',
      birthDate: '15/08/1985',
      nationality: 'Brasil',
      gender: 'Masculino',
    },
    {
      fullName: 'Ana Carolina Mendes',
      cpf: '987.654.321-11',
      document: 'RG 12.345.678-Y',
      birthDate: '24/11/1989',
      nationality: 'Brasil',
      gender: 'Feminino',
    }
  ]);

  // Seat Assignments
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['12A', '12B']);
  
  // Custom Payment Info
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix'>('credit');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Carlos Eduardo Silva');
  const [cardNumber, setCardNumber] = useState('4455 8822 9911 3245');
  const [cardExpiry, setCardExpiry] = useState('09/2031');
  const [cardCVV, setCardCVV] = useState('982');
  const [installments, setInstallments] = useState(1);
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Generated confirmation code
  const [confirmationCode] = useState(() => `AV-${Math.floor(100000 + Math.random() * 900000)}`);

  // Calculates financial balances
  const basePrice = packageData.currentPrice * (adultsCount + childrenCount * 0.5);
  const taxAmount = 250.00;
  
  // 5% à vista discount
  const isCashDiscount = paymentMethod === 'pix' || installments === 1;
  const cashDiscountAmount = isCashDiscount ? basePrice * 0.05 : 0;
  
  const couponDiscountAmount = appliedDiscount > 0 ? basePrice * appliedDiscount : 0;
  const totalPrice = basePrice + taxAmount - cashDiscountAmount - couponDiscountAmount;

  // Helper formatting masks
  const formatCPF = (v: string) => {
    let val = v.replace(/\D/g, ''); // Remove non-digits
    val = val.substring(0, 11);     // Limit to 11 digits
    if (val.length > 9) {
      return `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6, 9)}-${val.substring(9)}`;
    } else if (val.length > 6) {
      return `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6)}`;
    } else if (val.length > 3) {
      return `${val.substring(0, 3)}.${val.substring(3)}`;
    }
    return val;
  };

  const formatRG = (v: string) => {
    const cleanVal = v.toUpperCase();
    const hasOtherLetters = /[A-W|Y-Z]/.test(cleanVal);
    if (hasOtherLetters) {
      return v; // Keep as-is for passports
    }
    let val = cleanVal.replace(/[^0-9X]/g, ''); // Allow digits and 'X'
    val = val.substring(0, 9); // Limit to 9 char
    if (val.length > 8) {
      return `${val.substring(0, 2)}.${val.substring(2, 5)}.${val.substring(5, 8)}-${val.substring(8)}`;
    } else if (val.length > 5) {
      return `${val.substring(0, 2)}.${val.substring(2, 5)}.${val.substring(5)}`;
    } else if (val.length > 2) {
      return `${val.substring(0, 2)}.${val.substring(2)}`;
    }
    return val;
  };

  const formatBirthDate = (v: string) => {
    let val = v.replace(/\D/g, ''); // Only digits
    val = val.substring(0, 8);      // Limit to 8 digits
    if (val.length > 4) {
      return `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4)}`;
    } else if (val.length > 2) {
      return `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    return val;
  };

  // Manage passenger updates
  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    let processedValue = value;

    if (field === 'cpf') {
      processedValue = formatCPF(value);
    } else if (field === 'document') {
      processedValue = formatRG(value);
    } else if (field === 'birthDate') {
      processedValue = formatBirthDate(value);
    }

    updated[index] = { ...updated[index], [field]: processedValue };
    setPassengers(updated);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'ANGEL10' || code === 'VOYAGE10') {
      setAppliedDiscount(0.10);
      setCouponSuccess('Cupom Elite ativo! 10% de desconto adicional aplicado.');
    } else if (code === 'OFFER5') {
      setAppliedDiscount(0.05);
      setCouponSuccess('Cupom promocional! 5% de desconto adicional aplicado.');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const handleConfirmOrder = () => {
    const reservationRecord: Reservation = {
      id: confirmationCode,
      packageId: packageData.id,
      packageTitle: packageData.title,
      image: packageData.image,
      startDate: '12 Nov 2026',
      endDate: '20 Nov 2026',
      adultsCount,
      childrenCount,
      status: paymentMethod === 'pix' ? 'Pendente Pagamento' : 'Confirmada',
      passengers,
      paymentMethod: paymentMethod === 'pix' ? 'Pix QrCode' : `Cartão de Crédito (${installments}x)`,
      totalPaid: totalPrice,
      daysToTrip: 45
    };
    onBookingSuccess(reservationRecord);
    setStep(5);
  };

  const downloadVoucher = () => {
    // Elegant Client side download trigger
    const voucherText = `
=========================================
      ANGEL VOYAGE - VOUCHER DE CONFIRMAÇÃO
=========================================
Código da Reserva: ${confirmationCode}
Destino: ${packageData.destination}, ${packageData.country}
Hotel Curado: ${packageData.hotel} (${packageData.stars} Estrelas)
Voo: ${packageData.flight}
Passageiros:
${passengers.map((p, i) => `  [${i + 1}] ${p.fullName} - CPF: ${p.cpf}`).join('\n')}
Assentos Escolhidos: ${selectedSeats.join(', ')}

Total Pago: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Forma de Pagamento: ${paymentMethod === 'pix' ? 'Pix À Vista' : `Cartão de Crédito em ${installments}x`}
Status da Reserva: CONFIRMADA E EMITIDA

Desejamos a você uma extraordinária jornada de luxo e descanso!
=========================================
    Av. Brigadeiro Faria Lima, 3000 | Angel Voyage
    `;
    const blob = new Blob([voucherText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Voucher-AngelVoyage-${confirmationCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans text-[#00112f] my-6">
      
      {/* Checkout Steps bar indicator */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 mb-8 overflow-x-auto no-scrollbar gap-4">
        {[2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-semibold transition-all text-xs ${
                step === s 
                  ? 'bg-[#ff5a5f] text-white shadow-md shadow-red-200' 
                  : step > s 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s - 1}
            </div>
            <span className={`text-xs font-semibold ${step === s ? 'text-[#ff5a5f]' : 'text-gray-400'}`}>
              {s === 2 ? 'Dados dos Passageiros' : s === 3 ? 'Assentos e Resumo' : s === 4 ? 'Forma de Pagamento' : 'Emissão de Voucher'}
            </span>
          </div>
        ))}
      </div>

      {/* Main Core Form Block */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(15,38,76,0.04)] p-6 md:p-8">
        
        {/* STEP 2: Passenger Data Profile */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-display font-bold text-lg text-[#00112f]">Dados Requeridos para Embarque</h2>
              <p className="text-gray-400 text-xs">Os nomes devem constar idênticos aos cadastrados no passaporte ou RG nacional.</p>
            </div>

            {passengers.map((passenger, idx) => (
              <div key={idx} className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 relative space-y-4 text-left">
                <span className="absolute top-4 right-4 bg-gray-200 text-[#0f264c] font-display font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                  Passageiro {idx + 1}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Completo</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
                      value={passenger.fullName}
                      onChange={(e) => updatePassenger(idx, 'fullName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">C.P.F</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
                      value={passenger.cpf}
                      onChange={(e) => updatePassenger(idx, 'cpf', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Nº RG ou Passaporte</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
                      value={passenger.document}
                      onChange={(e) => updatePassenger(idx, 'document', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Nascimento</label>
                    <input
                      type="text"
                      placeholder="DD/MM/AAAA"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
                      value={passenger.birthDate}
                      onChange={(e) => updatePassenger(idx, 'birthDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Gênero</label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(idx, 'gender', e.target.value)}
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Prefiro não declarar</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => {
                  setPassengers([
                    ...passengers,
                    { fullName: '', cpf: '', document: '', birthDate: '', nationality: 'Brasil', gender: 'Feminino' }
                  ]);
                }}
                className="text-xs font-semibold text-[#ff5a5f] hover:underline"
              >
                + Adicionar Outro Passageiro
              </button>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-lg border border-gray-200 font-semibold text-xs text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-left"
              >
                Cancelar Reserva
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="bg-[#0f264c] hover:bg-[#00112f] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Avançar: Seleção de Assentos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Airplane Seat selection & Resumo */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-display font-bold text-lg text-[#00112f]">Mapa de Assentos Exclusivo (Premium Cabin)</h2>
              <p className="text-gray-400 text-xs">Selecione poltronas conjuntas para sua conveniência estética de voo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Airplane Seat Map mock */}
              <div className="bg-[#00112f] text-white p-6 rounded-2xl text-center space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Classe Executiva Boing 777-300ER</span>
                
                {/* Cockpit Indicator */}
                <div className="w-16 h-7 bg-white/20 mx-auto rounded-t-full flex items-center justify-center">
                  <span className="text-[8px] text-gray-300 font-bold uppercase font-sans">Cockpit</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 max-w-[200px] mx-auto pt-4">
                  {['10A', '10B', '', '10C', '11A', '11B', '', '11C', '12A', '12B', '', '12C', '14A', '14B', '', '14C'].map((seatName, i) => {
                    if (!seatName) return <div key={i} className="w-4"></div>;
                    const isSelected = selectedSeats.includes(seatName);

                    return (
                      <button
                        key={seatName}
                        onClick={() => {
                          if (selectedSeats.includes(seatName)) {
                            setSelectedSeats(selectedSeats.filter(s => s !== seatName));
                          } else {
                            setSelectedSeats([...selectedSeats, seatName]);
                          }
                        }}
                        className={`py-2 rounded text-xs font-semibold cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#ff5a5f] text-white font-bold ring-2 ring-red-300' 
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {seatName}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-4 pt-2 border-t border-white/10 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#ff5a5f] rounded-sm"></span>
                    <span>Reservado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-white/10 rounded-sm"></span>
                    <span>Livre</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Booking Summary Cards */}
              <div className="text-left bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-500">Curadoria de Itens Selecionados</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Pacote Curado:</span>
                    <span className="text-[#0f264c]">{packageData.title}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Hotel:</span>
                    <span className="text-gray-600">{packageData.hotel} ({packageData.stars}★)</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Aéreos Inclusos:</span>
                    <span className="text-gray-600">{packageData.flight}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Passageiros:</span>
                    <span className="text-gray-600">{passengers.length} Adultos</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Assentos Reservados:</span>
                    <span className="text-[#ff5a5f] font-bold">{selectedSeats.join(', ') || 'Nenhum selecionado'}</span>
                  </div>
                </div>

                <hr className="border-gray-200" />
                <div className="flex justify-between font-display font-extrabold text-[#00112f] text-sm">
                  <span>Subtotal Previsto:</span>
                  <span>R$ {basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 font-semibold text-xs text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-left flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
              
              <button
                onClick={() => setStep(4)}
                className="bg-[#0f264c] hover:bg-[#00112f] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Avançar para Pagamento
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Forma de Pagamento */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 text-left">
              <h2 className="font-display font-bold text-lg text-[#00112f]">Dados Legais do Pagamento Fiduciário</h2>
              <p className="text-gray-400 text-xs">Suas reservas contam com seguro-fiança total contra imprevistos de cancelamento.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Interactive payment entries */}
              <div className="lg:col-span-7 space-y-4 text-left">
                
                {/* Method selector buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('credit');
                      setInstallments(1); // Defaults to single installment to allow Cash checkout
                    }}
                    className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'credit'
                        ? 'border-[#ff5a5f] bg-red-50/50 text-[#ff5a5f] font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-[#0f264c]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('pix');
                      setInstallments(1);
                    }}
                    className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-[#ff5a5f] bg-red-50/50 text-[#ff5a5f] font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-[#0f264c]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Pix (Desconto 5%)
                  </button>
                </div>

                {paymentMethod === 'credit' ? (
                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Nome no Cartão</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Número do Cartão de Crédito</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Código CVV</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Vencimento</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Opções de Parcelamento</label>
                      <select
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f]"
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                      >
                        <option value={1}>1x sem juros de R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Desconto 5% ativo)</option>
                        <option value={2}>2x sem juros de R$ {(totalPrice / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                        <option value={3}>3x sem juros de R$ {(totalPrice / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                        <option value={6}>6x sem juros de R$ {(totalPrice / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                        <option value={10}>10x sem juros de R$ {(totalPrice / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 text-center space-y-4">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">Pix Gerado sob Demanda</span>
                    <p className="text-gray-600 text-xs">
                      Será gerado um QR Code válido por 15 minutos na tela de confirmação. O desconto de <strong>5% à vista</strong> já está contemplado no demonstrativo ao lado.
                    </p>
                  </div>
                )}

                {/* Promo Coupons */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 uppercase focus:outline-none focus:border-[#ff5a5f] flex-grow"
                      placeholder="Ex: VOYAGE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#0f264c] hover:bg-[#00112f] text-white text-[11px] font-semibold px-4 py-2 rounded-lg"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-green-600 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" />{couponSuccess}</p>}
                  <p className="text-[10px] text-gray-400">Dica: Use <strong>VOYAGE10</strong> para testar um desconto de 10% adicional.</p>
                </div>
              </div>

              {/* Financial Ledger card panel */}
              <div className="lg:col-span-5 bg-white border border-gray-100 rounded-xl p-5 text-left space-y-4 shadow-sm">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gray-500">Demostrativo de Valores</h4>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Pacote Base ({passengers.length} pax):</span>
                    <span>R$ {basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxas de Serviços de Aeroportos:</span>
                    <span>R$ {taxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {isCashDiscount && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Desconto 5% (À Vista/Pix):</span>
                      <span>- R$ {cashDiscountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#ff5a5f] font-semibold">
                      <span>Desconto Cupom ({appliedDiscount * 100}%):</span>
                      <span>- R$ {couponDiscountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-display font-black text-[#00112f] text-base pt-1">
                    <span>Total Líquido:</span>
                    <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3.5 rounded-lg text-[10px] text-blue-800 leading-normal flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f264c] shrink-0" />
                  <span>Ambiente blindado e criptografado com certificação SSL Premium.</span>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 font-semibold text-xs text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-left flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
              
              <button
                onClick={handleConfirmOrder}
                className="bg-[#ff5a5f] hover:bg-[#e0454a] text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                {paymentMethod === 'pix' ? 'Gerar Qr Code Pix' : 'Confirmar e Finalizar Reserva'}
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Invoice Voucher & Success */}
        {step === 5 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-[#e8f5e9] text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-[#00112f]">Sua Viagem foi Confirmada!</h2>
              <p className="text-gray-500 text-xs">
                O voucher oficial e os bilhetes de embarque eletrônicos foram encaminhados para o seu e-mail cadastrado.
              </p>
            </div>

            {paymentMethod === 'pix' && (
              <div className="max-w-xs mx-auto p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase">Pendente Pagamento Pix</span>
                
                {/* Fake QRCode representation box */}
                <div className="w-32 h-32 bg-white border border-gray-200 mx-auto flex items-center justify-center p-2 rounded">
                  <div className="w-full h-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-[9px] text-gray-400 font-semibold uppercase">QR CODE PIX</span>
                  </div>
                </div>

                <p className="text-gray-500 text-[10px] leading-relaxed">
                  Escaneie o código acima usando o aplicativo do seu banco para consolidar os <strong>5% de desconto à vista</strong>.
                </p>
              </div>
            )}

            {/* Receipt Summary printable block */}
            <div className="bg-gray-50 max-w-xl mx-auto rounded-xl p-5 border border-gray-100 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-500">LOCALIZADOR VOYAGE</span>
                <span className="font-display font-bold text-black uppercase tracking-wider">{confirmationCode}</span>
              </div>

              <div className="space-y-2 text-gray-600">
                <p><strong>Destino:</strong> {packageData.destination}, {packageData.country}</p>
                <p><strong>Hotel Premium:</strong> {packageData.hotel} ({packageData.stars}★)</p>
                <p><strong>Aéreo Confirmado:</strong> {packageData.flight}</p>
                <p><strong>Assentos Reservados:</strong> {selectedSeats.join(', ')}</p>
                <p>
                  <strong>Passageiros Cadastrados:</strong>{' '}
                  {passengers.map((p) => p.fullName).join('; ')}
                </p>
                <p><strong>Total Pago / Liquidado:</strong> R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-8 max-w-md mx-auto">
              <button
                onClick={downloadVoucher}
                className="w-full sm:w-auto bg-[#ff5a5f] hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar Voucher Oficial
              </button>

              <button
                onClick={onCancel}
                className="w-full sm:w-auto bg-[#0f264c] hover:bg-[#00112f] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md cursor-pointer"
              >
                Voltar ao Início
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
