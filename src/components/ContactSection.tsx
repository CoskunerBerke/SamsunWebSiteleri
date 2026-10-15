import React, { useState } from 'react';

const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Merhaba Bektaş Oto Elektrik, ben ${name || 'Müşteriniz'}. Aracım: ${
      carModel || 'Belirtilmedi'
    }. Talebim: ${note || 'Servis / takograf randevusu almak istiyorum.'}`;
    window.open(
      `https://wa.me/905057727033?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section id="iletisim" className="py-20 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">
            İLETİŞİM & KONUM
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Randevu ve Yol Tarifi
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left: Clean Architectural Contact Details */}
          <div className="bg-white rounded-lg p-7 sm:p-8 border border-zinc-200 flex flex-col justify-between">
            <div className="divide-y divide-zinc-200">
              <div className="pb-5">
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  TELEFON & WHATSAPP HATLARI
                </span>
                <a
                  href="tel:+903622666670"
                  className="text-2xl font-bold text-zinc-900 hover:text-amber-600 transition-colors mt-1 block"
                >
                  0362 266 66 70
                </a>
                <a
                  href="tel:+905057727033"
                  className="text-lg font-semibold text-amber-600 hover:text-amber-500 transition-colors mt-1 block"
                >
                  GSM / WhatsApp: 0505 772 70 33
                </a>
              </div>

              <div className="py-5">
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  ADRES
                </span>
                <p className="text-base font-semibold text-zinc-900 mt-1">
                  İstiklal Mah. (Kutlukent), İlkadım Sanayi Sitesi, 51. Sokak No: 58–60, Tekkeköy / Samsun
                </p>
              </div>

              <div className="pt-5">
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  ÇALIŞMA SAATLERİ
                </span>
                <p className="text-base font-semibold text-zinc-900 mt-1">
                  Pazartesi – Cumartesi: 08:00 – 19:00
                </p>
                <span className="text-sm text-zinc-500">Pazar günü kapalıdır</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-200 flex flex-wrap gap-3">
              <a
                href="https://maps.app.goo.gl/TKhWHqJnwCV54U2J9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
              >
                Google Haritalar’da Yol Tarifi Aç
              </a>
            </div>
          </div>

          {/* Right: Clean 3-Field Form */}
          <div className="bg-white rounded-lg p-7 sm:p-8 border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Servis & Takograf Randevu Talebi</h3>
            <p className="text-sm text-zinc-600 mb-6">
              Formu doldurduğunuzda talebiniz doğrudan WhatsApp hattımıza (0505 772 70 33) iletilir.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Adınız Soyadınız / Firma
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Araç Marka / Modeli
                </label>
                <input
                  type="text"
                  required
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="Örn: Ford Cargo / Mercedes Actros / Binek Araç"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Yapılacak İşlem
                </label>
                <textarea
                  rows={3}
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Örn: Dijital takograf kalibrasyonu, akü değişimi, marş/şarj dinamosu bakımı..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors"
              >
                WhatsApp ile Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white h-[360px]">
          <iframe
            title="Bektaş Oto Elektrik ve Takograf Servisi Konumu"
            src="https://maps.google.com/maps?q=41.2414799,36.4143233&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
