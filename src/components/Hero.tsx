import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center bg-zinc-950 pt-24 pb-16 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/vw/vw-service.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/vw/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-zinc-950/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2px] bg-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              İLKADIM SANAYİ SİTESİ • TEKKEKÖY / SAMSUN
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-6">
            Bektaş Oto Elektrik, Akü ve Dijital Takograf Servisi.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-9 max-w-2xl">
            Samsun Tekkeköy İlkadım Sanayi Sitesi’nde binek, ticari ve ağır vasıta araçlar için
            oto elektrik onarımı, marş ve şarj dinamosu revizyonu, garantili akü satışı, dijital
            takograf ve taksimetre servis hizmeti sunuyoruz.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <a
              href="tel:+903622666670"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm sm:text-base transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0362 266 66 70</span>
            </a>

            <a
              href="tel:+905057727033"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base border border-white/20 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>GSM: 0505 772 70 33</span>
            </a>

            <a
              href="https://maps.app.goo.gl/TKhWHqJnwCV54U2J9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-zinc-200 hover:text-white font-medium text-sm sm:text-base transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Haritada Yol Tarifi</span>
            </a>
          </div>

          <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 text-xs sm:text-sm text-zinc-400">
            <span>Adres: İstiklal Mah. (Kutlukent) İlkadım Sanayi Sitesi 51. Sokak No:58 Tekkeköy / Samsun</span>
            <span className="hidden sm:inline">•</span>
            <span>Pazartesi – Cumartesi: 08:00 – 19:00</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
