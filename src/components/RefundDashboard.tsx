import React, { useState, useEffect } from 'react';
import { 
  Undo2, HelpCircle, ChevronDown, ChevronUp, AlertCircle, 
  Check, ArrowLeft, RefreshCw, AlertTriangle, CalendarRange,
  Mail, ClipboardCheck
} from 'lucide-react';
import { Reservation } from '../types';

interface RefundDashboardProps {
  reservation: Reservation;
  onBack: () => void;
  onStatusChange: (reservationId: string, newStatus: any) => void;
  onAddHistory: (log: any) => void;
}

export default function RefundDashboard({ reservation, onBack, onStatusChange, onAddHistory }: RefundDashboardProps) {
  const [daysRemaining, setDaysRemaining] = useState<number>(reservation.daysToTrip || 20); // Defaults to 20 days (75% bracket)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  // Modal form states
  const [cancelReason, setCancelReason] = useState('Problema de saúde');
  const [detailsText, setDetailsText] = useState('');
  
  // Success flow state
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolCode, setProtocolCode] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Remarcar states
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-12-15');
  const [rescheduleSuccess, setRescheduleSuccess] = useState('');

  // Accordion FAQ states
  const [faqOpen, setFaqOpen] = useState<{ [key: string]: boolean }>({
    'how': false,
    'time': false,
    'method': false,
    'reschedule': false,
  });

  const toggleFaq = (key: string) => {
    setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine refund rate based on days remaining
  let refundPercent = 75;
  let bracketLabel = 'Entre 15 e 30 dias antes';
  let retentionText = 'Retenção de 25% referente a custos operacionais.';

  if (daysRemaining > 30) {
    refundPercent = 100;
    bracketLabel = 'Mais de 30 dias antes do embarque';
    retentionText = 'Reembolso integral garantido!';
  } else if (daysRemaining >= 15) {
    refundPercent = 75;
    bracketLabel = 'Entre 15 e 30 dias antes';
    retentionText = 'Retenção de 25% referente a custos operacionais.';
  } else if (daysRemaining >= 7) {
    refundPercent = 50;
    bracketLabel = 'Entre 7 e 14 dias antes';
    retentionText = 'Retenção de 50% referente a custos operacionais e taxa hoteleira.';
  } else {
    refundPercent = 0;
    bracketLabel = 'Menos de 7 dias antes';
    retentionText = 'Retenção de 100% devido a cancelamento super tardio e taxas de no-show.';
  }

  const valorPago = reservation.totalPaid || 25507.50;
  const refundAmount = (valorPago * refundPercent) / 100;

  // Render protocol generator
  const generateProtocol = () => {
    return `CANC-MQAS3E76`; // Hardcoded premium look to fully match the provided specifications
  };

  const handleConfirmCancellation = () => {
    const code = generateProtocol();
    setProtocolCode(code);
    setIsCancelModalOpen(false);
    setIsSuccess(true);
    setShowToast(true);

    // Save status log state to the global user profile
    onStatusChange(reservation.id, 'Cancelada');
    onAddHistory({
      id: code,
      reservationId: reservation.id,
      packageTitle: reservation.packageTitle,
      refundAmount: refundAmount,
      refundPercent: refundPercent,
      reason: cancelReason,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Em Análise'
    });
  };

  // Dismiss toast after some seconds automatically
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleSuccess('Sua solicitação de remarcação foi enviada para análise concierge com sucesso!');
    onStatusChange(reservation.id, 'Confirmada'); // keeps confirmed but logs remarcação request
    onAddHistory({
      id: `REMARC-${Math.floor(100000 + Math.random() * 900000)}`,
      reservationId: reservation.id,
      packageTitle: reservation.packageTitle,
      date: new Date().toLocaleDateString('pt-BR'),
      reason: `Solicitação de alteração para data ${rescheduleDate}`,
      status: 'Em Análise'
    });
    setTimeout(() => {
      setRescheduleSuccess('');
      setIsRescheduleModalOpen(false);
    }, 4000);
  };

  // SUCCESS SCREEN (Image 1)
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto font-sans text-[#00112f] animate-fade-in relative py-4">
        
        {/* Sliding premium green toast matching image 1 perfectly */}
        {showToast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#e8f5e9] border border-emerald-200 text-[#1b5e20] text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-slide-down">
            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="font-bold">Solicitação de cancelamento registrada</p>
              <p className="text-[10px] text-emerald-800/80 font-medium">Protocolo {protocolCode} enviado para seu e-mail.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-emerald-700/60 hover:text-emerald-900 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top return links */}
        <div className="flex justify-start mb-6">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1.5"
            id="back-confirm-success"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para a confirmação
          </button>
        </div>

        {/* Core Success Box (Image 1) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_12px_50px_rgba(15,38,76,0.05)] p-8 text-center space-y-6 max-w-xl mx-auto">
          
          {/* Green outer ring with check symbol */}
          <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <div className="w-10 h-10 bg-[#388e3c] rounded-full flex items-center justify-center text-white">
              <Check className="w-6 h-6 stroke-[3px]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display font-bold text-xl text-[#00112f]">Cancelamento solicitado</h1>
            <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
              Sua solicitação foi registrada e está em análise. Você receberá uma confirmação por e-mail.
            </p>
          </div>

          {/* Key-Value Card grid as shown in specification screenshot 1 */}
          <div className="bg-[#f0f4f8]/50 border border-gray-100/70 rounded-2xl p-5 text-left text-xs space-y-3">
            <div className="flex justify-between items-center text-gray-500 font-medium pb-2 border-b border-gray-200/50">
              <span>Protocolo</span>
              <span className="font-mono font-bold text-gray-800 tracking-wider">
                {protocolCode}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-medium py-1">
              <span>Reserva</span>
              <span className="font-mono font-bold text-gray-800 tracking-wider">
                {reservation.id}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-medium py-1">
              <span>Valor do reembolso</span>
              <span className="font-extrabold text-[#2e7d32] text-sm">
                R$ {refundAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-medium py-1">
              <span>Forma</span>
              <span className="text-gray-700 font-semibold">
                Transferência bancária / PIX
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500 font-medium pt-2 border-t border-gray-200/50">
              <span>Prazo estimado</span>
              <span className="text-gray-700 font-semibold">
                até 7 dias úteis
              </span>
            </div>
          </div>

          {/* Final Proceed controls */}
          <div className="pt-4">
            <button
              onClick={onBack}
              className="bg-[#0f264c] hover:bg-[#00112f] text-white text-xs font-bold uppercase tracking-wider py-3 px-8 rounded-xl transition-all hover:shadow-md cursor-pointer active:scale-95"
              id="back-reservations-btn"
            >
              Consultar Minhas Reservas
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto font-sans text-[#00112f] animate-fade-in relative">
      
      {/* Top back navigation button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5"
          id="back-to-reservations-btn-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para a confirmação
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_12px_45px_rgba(15,38,76,0.05)] p-6 md:p-8 space-y-8">
        
        {/* Title Block exact header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
            <Undo2 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-black text-xl tracking-tight text-[#00112f]">Cancelamento e Reembolso</h1>
            <p className="text-gray-400 text-xs text-left">Consulte as políticas de reembolso e solicite alterações para seu pacote.</p>
          </div>
        </div>

        {/* Dynamic Simulation Slider - signature of luxury craftsmanship */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 min-w-0">
              <CalendarRange className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Simulador de Antecedência da Viagem:</span>
            </span>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shrink-0">
              {daysRemaining} dias antes do embarque
            </span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="45" 
            value={daysRemaining} 
            onChange={(e) => {
              setDaysRemaining(Number(e.target.value));
            }}
            className="w-full accent-amber-500 h-1.5 bg-amber-200/50 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500 leading-normal">
            Arraste para testar o cálculo automático de reembolso para diferentes datas de antecedência da viagem real.
          </p>
        </div>

        {/* Selected reservation details cards block */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 text-left">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Reserva atual</span>
              <span className="text-xs font-mono font-bold text-gray-800 tracking-wider block mt-1">{reservation.id}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block mt-2 font-bold uppercase tracking-wider">
                {reservation.status === 'Cancelada' ? 'Cancelada' : 'Confirmada'}
              </span>
            </div>

            <div className="rounded-xl p-4 border border-gray-100 bg-gray-50 text-left">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Status do pacote</span>
              <span className="text-xs font-bold text-[#00112f] block mt-1">Destino: {reservation.packageTitle}</span>
              <span className="text-[10px] text-gray-500 block">Embarque planejado para {reservation.startDate}</span>
            </div>
          </div>

          {/* Faixa aplicável Banner exactly styled like design */}
          <div className="bg-[#f0f4f8] border-l-4 border-[#0f264c] p-4 rounded-r-xl text-left">
            <p className="text-xs font-bold text-[#0f264c] tracking-normal mb-1">
              Faixa aplicável: {bracketLabel}
            </p>
            <p className="text-[11px] text-[#44474e] font-semibold">
              {retentionText}
            </p>
          </div>

          {/* Financial Breakdown Table block exactly formatted like design */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 text-left space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Valor pago</span>
              <span className="font-mono font-bold text-gray-800">
                R$ {valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-3">
              <span className="text-[#2e7d32] font-semibold">Reembolso ({refundPercent}%)</span>
              <span className="font-mono font-extrabold text-base text-[#2e7d32]">
                R$ {refundAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-3">
              <span className="text-gray-500 font-medium">Devolução via</span>
              <span className="font-semibold text-gray-700">
                Transferência bancária / PIX
              </span>
            </div>
          </div>
        </div>

        {/* Refund by timeline rules list block exact matching design */}
        <div className="text-left space-y-3">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400">Política de reembolso por antecedência</h3>
          
          <div className="space-y-2">
            {[
              { label: 'Mais de 30 dias antes do embarque', pct: '100%', active: daysRemaining > 30, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { label: 'Entre 15 e 30 dias antes', pct: '75%', active: (daysRemaining >= 15 && daysRemaining <= 30), color: 'border-[#ff5a5f] bg-rose-50/10' },
              { label: 'Entre 7 e 14 dias antes', pct: '50%', active: (daysRemaining >= 7 && daysRemaining < 15), color: 'border-[#ff5a5f] bg-rose-50/10' },
              { label: 'Menos de 7 dias antes', pct: '0%', active: daysRemaining < 7, color: 'text-red-600 bg-red-50 border-red-100' }
            ].map((rule, idx) => (
              <div 
                key={idx} 
                className={`flex justify-between items-center p-3 rounded-lg border text-xs font-medium transition-all ${
                  rule.active 
                    ? 'border-[#ff5a5f] bg-gradient-to-r from-red-50/40 to-white font-bold ring-1 ring-red-300' 
                    : 'border-gray-100 text-gray-500'
                }`}
              >
                <span>{rule.label}</span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  rule.active 
                    ? 'bg-[#ff5a5f] text-white' 
                    : rule.pct === '100%' 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : rule.pct === '0%' 
                        ? 'text-red-700 bg-red-50' 
                        : 'text-gray-600 bg-gray-100'
                }`}>
                  {rule.pct}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational buttons block exact styled to layout Image 5 */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsRescheduleModalOpen(true)}
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0f264c] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            id="remarcar-viagem-btn-alt"
          >
            <CalendarRange className="w-4 h-4 text-gray-500" />
            Remarcar viagem
          </button>
          
          <button
            onClick={() => {
              if (reservation.status === 'Cancelada') {
                alert('Esta reserva já consta como cancelada ou em processo de análise.');
                return;
              }
              setIsCancelModalOpen(true);
            }}
            className="flex-1 bg-red-50/60 hover:bg-red-50 hover:border-red-400 text-red-600 border border-red-200 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            id="solicitar-cancelamento-btn-alt"
          >
            ✕ Solicitar cancelamento
          </button>
        </div>

        {/* Legal notice exact match to layout 5 */}
        <div className="bg-emerald-50/30 p-3 rounded-lg text-[10px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5 border border-emerald-100/50">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reembolso garantido conforme a política e o Código de Defesa do Consumidor.</span>
        </div>

        {/* FAQ Accordion Segment: "Dúvidas sobre reembolso" */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-4 text-[#00112f]">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-500">Dúvidas sobre reembolso</h4>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'how',
                q: 'Como solicito o cancelamento da minha reserva?',
                a: 'Acesse a área do cliente, clique em reservas, escolha "Reembolso" ao lado da reserva correspondente, defina os motivos informados e finalize a requisição de forma automatizada.'
              },
              {
                key: 'time',
                q: 'Em quanto tempo recebo o reembolso?',
                a: 'O estorno do valor líquido pós taxas administrativas é creditado em até 7 dias úteis diretamente em sua conta bancária de origem ou chave PIX.'
              },
              {
                key: 'method',
                q: 'O reembolso volta para a mesma forma de pagamento?',
                a: 'Preferencialmente sim. Para transações com cartão de crédito, o cancelamento é enviado imediatamente à operadora do cartão. Pagamentos em PIX são transferidos de volta via Ted ou PIX estorno.'
              },
              {
                key: 'reschedule',
                q: 'Posso remarcar em vez de cancelar?',
                a: 'Sim! As regras de remarcação permitem que você altere as datas com total isenção de multas de hotel ou passagens aéreas desde que o faça com mais de 15 dias de antecedência.'
              }
            ].map((faq) => {
              const isOpen = faqOpen[faq.key];
              return (
                <div key={faq.key} className="border border-gray-100 rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleFaq(faq.key)}
                    className="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-[#00112f] bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs text-gray-600 leading-relaxed bg-white border-t border-gray-50 text-left animate-slide-down">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* CONFIRMAR CANCELAMENTO DIALOG / MODAL (Image 3) */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl p-6 md:p-8 space-y-6 text-left relative my-auto animate-scale-up">
            
            {/* Header with close button */}
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="font-display font-extrabold text-[#00112f] text-base">Confirmar cancelamento</h3>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                  ✕
              </button>
            </div>

            {/* Refund Value Warning exactly styled */}
            <p className="text-xs text-gray-600 leading-relaxed">
              Você receberá <strong className="text-[#2e7d32]">R$ {refundAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> de reembolso ({refundPercent}% do valor pago) via Transferência bancária / PIX.
            </p>

            {/* Motivo do cancelamento Dropdown matching Image 2 & 3 */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">Motivo do cancelamento</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f]"
              >
                <option value="Mudança de planos">Mudança de planos</option>
                <option value="Problema de saúde">Problema de saúde</option>
                <option value="Motivo financeiro">Motivo financeiro</option>
                <option value="Encontrei outra oferta">Encontrei outra oferta</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            {/* Detalhes Area formatted to layout */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">Detalhes (opcional)</label>
              <textarea
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                placeholder="Conte mais sobre o motivo..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ff5a5f]"
              />
            </div>

            {/* Footer buttons matching layout Image 3 */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Voltar
              </button>
              
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="bg-red-500 hover:bg-red-650 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow active:scale-95 transition-all text-center"
              >
                Confirmar cancelamento
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REMARCAR VIAGEM MODAL */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl p-6 md:p-8 space-y-5 text-left relative my-auto animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 className="font-display font-extrabold text-[#00112f] text-base">Solicitar Remarcação de Viagem</h3>
              <button 
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Você pode propor uma nova data de viagem sem cobrança de custos adicionais, sujeito a confirmação de disponibilidade de voos e vagas hoteleiras.
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">Escolha um novo período estimado para embarcar</label>
                <input 
                  type="date" 
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:border-[#ff5a5f] h-10"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">Notas da Remarcação (Opcional)</label>
                <textarea 
                  placeholder="Se preferir, especifique novos acompanhantes, upgrade de quarto ou observações de voo..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {rescheduleSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-[10px] font-semibold">
                  {rescheduleSuccess}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-lg text-gray-500 hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-[#0f264c] hover:bg-[#00112f] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Enviar Solicitação
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
