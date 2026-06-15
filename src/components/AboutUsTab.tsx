import React, { useState } from 'react';
import { Award, Compass, Eye, ShieldCheck, Check, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUsTab() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destinationInterest: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const stats = [
    { value: '5.000+', label: 'Clientes Atendidos', desc: 'Indivíduos exigentes com satisfação de alto padrão' },
    { value: '120+', label: 'Destinos Globais', desc: 'Curadoria nos seis continentes de resorts premiados' },
    { value: '50+', label: 'Guias Especialistas', desc: 'Sommeliers, historiadores e bilingues locais dedicados' },
  ];

  const pillars = [
    {
      title: 'Missão',
      icon: <Compass className="w-8 h-8 text-[#0f264c]" />,
      desc: 'Proporcionar experiências de viagem inesquecíveis e altamente personalizadas, conectando viajantes exigentes aos destinos mais exclusivos e requintados do mundo com excelência incomparável.',
      bg: 'bg-blue-50/50',
    },
    {
      title: 'Visão',
      icon: <Eye className="w-8 h-8 text-[#735c00]" />,
      desc: 'Ser a principal referência global em curadoria de viagens de luxo, reconhecida por nossa integridade corporativa, inovação no serviço de hospitalidade e capacidade de superar consistentemente as mais altas expectativas.',
      bg: 'bg-amber-50/50',
    },
    {
      title: 'Valores',
      icon: <Award className="w-8 h-8 text-[#ff5a5f]" />,
      desc: 'Exclusividade impecável, curadoria meticulosa, confiabilidade institucional e um compromisso inabalável com a sustentabilidade e o respeito às culturas locais em cada itinerário que desenhamos.',
      bg: 'bg-red-50/50',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', destinationInterest: '', message: '' });
    }, 4000);
  };

  return (
    <div className="font-sans space-y-24 py-6">
      {/* Editorial Banner */}
      <section className="relative w-full h-[400px] rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnH8FMwPJe5jxNw7pJrlkPxuvUDxWOzJFtgKUJdWyZxf8W0xYUyID8a-XAdPGk0uX8w6vryFIv87NHlp7eUe9JpVR2Evo69DpsGlsVBYhmK9IOUQOlMKYx1y3TP6CdfEtTa9yaCVPE1TZ52U0Q4Y6dJyDjgfbyf1OuTVTjn3GE5d_pBN30nvOZhGhoUoah3EiITOVXnDTifgBdRaEvULzZeaQRzItMT1nIfKviMHysvdSVGTXA27b3W2775CK-bgd8Ppsgx9WdCHg" 
            alt="Pristine coastal yacht" 
          />
          <div className="absolute inset-0 bg-[#00112f]/40"></div>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-white/20">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#00112f] tracking-tight mb-4">A Arte da Descoberta</h1>
            <p className="text-[#0f264c] text-sm md:text-base font-semibold leading-relaxed">
              &ldquo;Desde 2024 elevando o patamar de viagens de luxo.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div 
              key={pillar.title} 
              className={`${pillar.bg} rounded-xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  {pillar.icon}
                </div>
                <h3 className="font-display font-bold text-[#00112f] text-lg mb-3">{pillar.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trajectory Counter banner */}
      <section className="bg-[#00112f] text-white rounded-2xl py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-3">Nossa Trajetória em Números</h2>
          <p className="text-gray-400 text-xs">Crescendo de forma sustentada e garantindo atendimento impecável para cada expedição desenhada.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-4">
              <span className="font-display font-black text-4xl lg:text-5xl text-[#ff5a5f] mb-2">{stat.value}</span>
              <span className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-2">{stat.label}</span>
              <span className="text-xs text-gray-400 leading-normal max-w-xs">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Consultation Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 md:p-12 border border-gray-100 shadow-[0_12px_40px_rgba(15,38,76,0.06)] flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-[#00112f] leading-tight">Pronto para sua próxima descoberta?</h2>
            <p className="text-[#44474e] text-sm leading-relaxed">
              Nossa equipe de concierges e consultores especialistas está inteiramente à disposição para desenhar um itinerário sob medida, adaptado milimetricamente às suas expectativas de luxo, tempo e locomoção.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-red-50 text-[#ff5a5f] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </span>
                <span className="text-[#00112f] font-semibold text-xs md:text-sm">+55 (11) 99999-0000</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-blue-50 text-[#0f264c] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </span>
                <span className="text-[#00112f] font-semibold text-xs md:text-sm">concierge@voyageelite.com</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-amber-50 text-[#735c00] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <span className="text-[#00112f] font-semibold text-xs md:text-sm">Av. Brigadeiro Faria Lima, 3000 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 bg-gray-50/60 border border-gray-100/80 rounded-xl relative overflow-hidden">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-emerald-950">Solicitação Enviada!</h3>
                <p className="text-emerald-800 text-xs max-w-sm">
                  Obrigado por nos contatar, {formData.name}. Um Consultor Elite entrará em contato comercial em até 2 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-display font-semibold text-sm text-[#00112f] uppercase tracking-wider mb-2">Agende uma Assessoria VIP</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                    placeholder="Ex: Carlos Eduardo Silva"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail Corporativo</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                      placeholder="seu@corporate.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                      placeholder="+55 (11) 99999-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Destino de Interesse</label>
                  <select
                    value={formData.destinationInterest}
                    onChange={(e) => setFormData({ ...formData, destinationInterest: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                  >
                    <option value="">Selecione o seu refúgio...</option>
                    <option value="Maldivas">Maldivas: Atol de Noonu</option>
                    <option value="Santorini">Santorini: Clássico Grego</option>
                    <option value="Suica">Zermatt: Alpes Suíços</option>
                    <option value="Dubai">Dubai: Luxo Urbano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Breves observações (opcional)</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all resize-none"
                    placeholder="Comunique-nos suas datas estimadas, restrições alimentares ou transfers particulares requeridos..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff5a5f] text-white py-3 rounded-lg text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer hover:bg-red-500 hover:shadow-lg transition-all"
                >
                  Solicitar Ligação Executiva
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
