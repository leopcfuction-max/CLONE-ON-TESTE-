import React, { useState } from 'react';
import { Star, Check, Sparkles } from 'lucide-react';
import { Review } from '../types';

interface ReviewTabProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'userAvatar'>) => void;
}

export default function ReviewTab({ reviews, onAddReview }: ReviewTabProps) {
  const [packageName, setPackageName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName || !comment || !userName) return;

    onAddReview({
      userName,
      packageName,
      rating,
      comment
    });

    setSubmitted(true);
    setComment('');
    setUserName('');
    setPackageName('');
    setRating(5);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="font-sans space-y-16 py-6">
      {/* Editorial Header */}
      <section className="text-center space-y-3">
        <h1 className="font-display font-black text-3xl md:text-4xl text-[#00112f] tracking-tight">Experiências Reais</h1>
        <p className="text-[#44474e] text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
          Veja o que nossos viajantes mais ilustres estão relatando sobre as estadias de descanso guiadas e pacotes de luxo da Angel Voyage. Sua próxima aventura de prestígio começa aqui.
        </p>
      </section>

      {/* Bento Grid: Summary + Review form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Rating Summary Display */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_25px_rgba(15,38,76,0.04)] p-8 flex flex-col justify-center items-center text-center space-y-6">
          <div>
            <h2 className="font-display font-bold text-base text-[#00112f] mb-1">Avaliação Geral</h2>
            <p className="text-xs text-[#44474e]">Baseado em milhares de jornadas personalizadas.</p>
          </div>

          <div className="flex items-end gap-2.5">
            <span className="font-display font-black text-5xl tracking-tighter text-[#00112f]">4.9</span>
            <span className="font-display font-bold text-gray-400 text-sm pb-1.5">/ 5</span>
          </div>

          {/* Interactive or Beautiful Static Stars */}
          <div className="flex gap-1 text-[#ff5a5f]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-6 h-6 fill-current text-amber-400" />
            ))}
          </div>

          <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            Mais de 1.500+ avaliações auditadas
          </span>

          {/* Detailed distribution bars */}
          <div className="w-full space-y-3.5 pt-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 w-3">5</span>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff5a5f] rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold w-6">92%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 w-3">4</span>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff5a5f] rounded-full opacity-80" style={{ width: '6%' }}></div>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold w-6">6%</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 w-3">3</span>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '2%' }}></div>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold w-6">2%</span>
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_45px_rgba(15,38,76,0.06)] p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d8e2ff]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10">
            <h2 className="font-display font-medium text-base text-[#00112f] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff5a5f]" />
              Compartilhe sua Experiência
            </h2>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#00112f]">Sua avaliação foi publicada!</h3>
                <p className="text-xs text-gray-500 max-w-sm leading-normal">
                  Sua contribuição impulsiona a nossa contínua busca pela excelência na hotelaria mundial. Muito obrigado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Seu Nome / Iniciais</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ex: Carlos Mendes"
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pacote ou Destino</label>
                    <select
                      required
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all"
                    >
                      <option value="">Selecione sua viagem...</option>
                      <option value="Maldivas - Resort Exclusivo">Maldivas - Resort Exclusivo</option>
                      <option value="Paris - Romance e Cultura">Paris - Romance e Cultura</option>
                      <option value="Tóquio - Aventura Urbana">Tóquio - Aventura Urbana</option>
                      <option value="Santorini - Suites Clássicas">Santorini - Suites Clássicas</option>
                      <option value="Cairo - Maravilhas dos Faraós">Cairo - Maravilhas dos Faraós</option>
                      <option value="Zermatt - Chalet de Neve">Zermatt - Chalet de Neve</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sua Nota</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="text-gray-300 hover:text-amber-400 transition-colors animate-pulse cursor-pointer outline-none"
                        >
                          <Star 
                            className={`w-7 h-7 ${isFilled ? 'fill-current text-amber-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mensagem ou Comentário</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Espelhe como as reservas, o concierge local ou os transfers enriqueceram o conforto de sua expedição..."
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff5a5f] focus:ring-1 focus:ring-[#ff5a5f] transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0f264c] hover:bg-[#00112f] text-white text-xs font-semibold px-6 py-3 rounded-lg shadow-md cursor-pointer active:scale-95 transition-all uppercase tracking-wider"
                  >
                    Publicar Avaliação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Recent Reviews List Container */}
      <section className="space-y-8">
        <h2 className="font-display font-bold text-xl text-[#00112f] border-b border-gray-100 pb-3 flex items-center justify-between">
          <span>Avaliações Recentes</span>
          <span className="text-xs text-gray-400 font-medium font-sans">Mostrando {reviews.length} avaliações</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <article 
              key={rev.id} 
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(15,38,76,0.06)] hover:-translate-y-0.5 duration-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Review Header card info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rev.userAvatar} 
                      alt={rev.userName} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0" 
                    />
                    <div className="text-left leading-normal">
                      <h3 className="font-display font-semibold text-xs text-[#00112f]">{rev.userName}</h3>
                      <p className="text-[10px] text-gray-400 font-medium">{rev.packageName}</p>
                    </div>
                  </div>
                  
                  {/* Item Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-current text-amber-400' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-xs italic leading-relaxed text-left">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="text-left pt-4 mt-4 border-t border-gray-50 text-[10px] text-gray-400">
                {rev.date}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
