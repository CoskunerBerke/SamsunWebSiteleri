import React from 'react';

const WorkshopGallery: React.FC = () => {
  const photos = [
    {
      src: '/vw/vw-service.jpg',
      title: 'Oto Elektrik & Dijital Takograf Atölyesi',
      subtitle: 'İlkadım Sanayi Sitesi 51. Sokak No:58 Tekkeköy / Samsun',
    },
    {
      src: '/vw/spare-parts.jpg',
      title: 'Akü, Dinamo & Elektrik Yedek Parça Stoğu',
      subtitle: 'Binek ve ağır vasıta aküleri, marş-şarj dinamo parçaları',
    },
    {
      src: '/vw/office-lounge.png',
      title: 'Takograf Kalibrasyon & Belgelendirme Ofisi',
      subtitle: 'Hızlı kayıt, kalibrasyon işlemi ve müşteri danışma',
    },
    {
      src: '/vw/waiting-room.png',
      title: 'Müşteri Bekleme Salonu',
      subtitle: 'Aracınızın işlemleri yapılırken dinlenebileceğiniz alanımız',
    },
  ];

  return (
    <section id="galeri" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">
            ATÖLYEMİZ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Servis ve Yedek Parça Alanımız
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.title}
              className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50"
            >
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 bg-white border-t border-zinc-200">
                <h3 className="text-base font-bold text-zinc-900">{photo.title}</h3>
                <p className="text-sm text-zinc-600 mt-1">{photo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopGallery;
