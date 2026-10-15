import React from 'react';

const AboutWorkshop: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Dijital Takograf & Taksimetre',
      desc: 'Ticari ve ağır vasıta araçlar için dijital takograf montajı, periyodik kalibrasyon, muayene ve taksimetre ayar işlemleri.',
    },
    {
      num: '02',
      title: 'Marş & Şarj Dinamosu Revizyonu',
      desc: 'Alternatör (şarj dinamosu) ve marş motoru arızalarında konjektör, rulman, kömür ve kollektör yenileme işlemleri.',
    },
    {
      num: '03',
      title: 'Garantili Akü Satışı & Ölçümü',
      desc: 'Binek, hafif ticari ve ağır vasıta araçlar için yüksek marş güçlü akü değişimi, şarj ve kaçak akım testi.',
    },
    {
      num: '04',
      title: 'Bilgisayarlı Elektronik Teşhis',
      desc: 'Araç elektrik tesisatı, aydınlatma grupları, sensör hataları ve beyin kaynaklı elektrik arızalarının tespiti ve onarımı.',
    },
  ];

  return (
    <section id="kurumsal" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">
              HAKKIMIZDA
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-5">
              Samsun Tekkeköy’de Oto Elektrik, Akü ve Takograf Uzmanlığı
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed mb-4">
              Tekkeköy İlkadım Sanayi Sitesi 51. Sokak’ta faaliyet gösteren <strong>Bektaş Oto</strong>;
              binek otomobillerden ticari araçlara ve ağır vasıta kamyon/çekici gruplarına kadar
              tüm araçların oto elektrik, elektronik ve takograf ihtiyaçlarına çözüm üretmektedir.
            </p>
            <p className="text-zinc-600 text-base leading-relaxed mb-6">
              Deneyimli usta kadromuz ve modern test cihazlarımızla marş-şarj dinamosu revizyonu,
              akü satışı, dijital takograf kalibrasyonu ve komple elektrik tesisatı onarımlarını
              garantili olarak gerçekleştiriyoruz.
            </p>

            <div className="border-t border-zinc-200 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block font-bold text-zinc-900">Oto Elektrik</span>
                <span className="text-zinc-500 text-xs">Tesisat & Onarım</span>
              </div>
              <div>
                <span className="block font-bold text-zinc-900">Takograf</span>
                <span className="text-zinc-500 text-xs">Dijital Kalibrasyon</span>
              </div>
              <div>
                <span className="block font-bold text-zinc-900">Akü Servisi</span>
                <span className="text-zinc-500 text-xs">Binek & Ağır Vasıta</span>
              </div>
              <div>
                <span className="block font-bold text-zinc-900">Taksimetre</span>
                <span className="text-zinc-500 text-xs">Montaj & Ayar</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6">
            <div className="aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
              <img
                src="/vw/vw-service.jpg"
                alt="Bektaş Oto Elektrik ve Takograf Servisi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 Numbered Architectural Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-12 border-t border-zinc-200">
          {pillars.map((item) => (
            <div key={item.num}>
              <span className="block text-xs font-mono font-bold text-amber-600 mb-2">
                {item.num}
              </span>
              <h3 className="text-base font-bold text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutWorkshop;
