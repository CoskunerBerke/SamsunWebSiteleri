import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      num: '01',
      title: 'Dijital & Analog Takograf Servisi',
      desc: 'Ticari kamyon, tır ve otobüsler için dijital takograf montajı, periyodik muayene, kalibrasyon, hız sınırlayıcı ve sensör kontrolleri.',
      detail: 'Dijital Takograf • Kalibrasyon • Muayene & Belgelendirme',
    },
    {
      num: '02',
      title: 'Marş & Şarj Dinamosu Bakımı',
      desc: 'Marş basmama veya şarj lambası uyarılarında dinamo sökümü, kollektör, kömür, diyot tablası, konjektör ve rulman değişimi.',
      detail: 'Marş Motoru • Alternatör • Konjektör & Rulman',
    },
    {
      num: '03',
      title: 'Akü Satışı, Değişimi & Kaçak Testi',
      desc: 'Start-Stop (AGM/EFB), binek ve ağır vasıta akü satışı; dijital test cihazı ile akü ömür ölçümü ve araç içi elektrik kaçağı tespiti.',
      detail: 'Garantili Akü • Start-Stop • Kaçak Akım Ölçümü',
    },
    {
      num: '04',
      title: 'Oto Elektrik Tesisat & Aydınlatma',
      desc: 'Far, stop, sinyal, sigorta kutusu, röle, silecek motoru, cam kriko elektroniği ve kopuk/kısa devre kablo tesisatı onarımları.',
      detail: 'Kablo Tesisatı • Far & Aydınlatma • Sigorta & Röle',
    },
    {
      num: '05',
      title: 'Taksimetre Montaj & Ayar Hizmetleri',
      desc: 'Ticari taksiler için taksimetre montajı, tarife güncellemesi, bağlantı kontrolü ve arıza onarım işlemleri.',
      detail: 'Taksimetre Montajı • Tarife Ayarı • Periyodik Kontrol',
    },
    {
      num: '06',
      title: 'Bilgisayarlı Elektronik Arıza Tespiti',
      desc: 'Motor, ABS, Airbag ve konfor elektroniği arıza lambalarının diyagnostik cihaz ile okunması, sensör kontrolü ve arıza giderimi.',
      detail: 'Diyagnostik Cihaz • Sensör Testi • Elektronik Onarım',
    },
  ];

  return (
    <section id="hizmetler" className="py-20 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">
            SERVİS HİZMETLERİMİZ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Oto Elektrik, Akü ve Takograf Çözümlerimiz
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.num}
              className="bg-white rounded-lg p-7 border border-zinc-200 flex flex-col justify-between"
            >
              <div>
                <span className="block text-xs font-mono font-bold text-amber-600 mb-4">
                  {service.num}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{service.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">{service.desc}</p>
              </div>

              <div className="pt-4 border-t border-zinc-100 text-xs font-medium text-zinc-500">
                {service.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
