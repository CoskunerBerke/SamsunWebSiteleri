import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { reviewsList } from '../data/reviewsData';

const ReviewRiver: React.FC = () => {
  const repeatedReviews = [...reviewsList, ...reviewsList];

  return (
    <section id="yorumlar" className="py-20 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">
              MÜŞTERİ YORUMLARI
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Bektaş Oto’yu Tercih Eden Araç Sahipleri
            </h2>
          </div>
          <a
            href="https://maps.app.goo.gl/TKhWHqJnwCV54U2J9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium text-white border border-white/15 transition-colors self-start sm:self-auto whitespace-nowrap"
          >
            <span>Google Haritalar’da Gör</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-river-continuous w-max px-4">
          {repeatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="w-[340px] sm:w-[400px] shrink-0 rounded-lg bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400">{review.role}</span>
                </div>
                <p className="text-zinc-200 text-sm leading-relaxed mb-5">"{review.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-semibold text-sm text-white">{review.author}</span>
                <span className="text-xs text-amber-400">{review.productGroup}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewRiver;
