import React from 'react';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 pb-24 sm:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 shrink-0">
              <Zap className="w-4 h-4 fill-zinc-950" />
            </div>
            <div>
              <span className="block text-white font-bold text-sm">
                BEKTAŞ OTO ELEKTRİK & TAKOGRAF SERVİSİ
              </span>
              <span className="block text-xs text-zinc-400">
                Oto Elektrik • Akü Satışı • Dijital Takograf & Taksimetre Servisi
              </span>
            </div>
          </div>

          <div className="text-sm text-zinc-300">
            İlkadım Sanayi Sitesi 51. Sokak No:58 Tekkeköy / Samsun • 0362 266 66 70 / 0505 772 70 33
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Bektaş Oto Elektrik & Takograf Servisi. Tüm hakları saklıdır.</p>
          <p>Tekkeköy / Samsun</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
