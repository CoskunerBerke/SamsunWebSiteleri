import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Menu, X, Star, ExternalLink, MessageCircle } from 'lucide-react';
import VwLogo from './VwLogo';

export interface DynamicSiteInfo {
  n: string; // Business Name
  a: string; // Address
  p: string; // Phone Display
  s: string; // Sector key
  q: string; // Map query
  u: string; // Original URL
}

interface SectorConfig {
  eyebrow: string;
  navActionLabel: string;
  servicesNavLabel: string;
  galleryNavLabel: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  hours: string;
  isLightHeader?: boolean;
  headerBg: string;
  headerText: string;
  headerSub: string;
  navLink: string;
  ctaBtn: string;
  heroBg: string;
  heroLine: string;
  heroEyebrow: string;
  accentText: string;
  videoSrc: string;
  posterSrc: string;
  pillars: { num: string; title: string; desc: string }[];
  servicesSectionTitle: string;
  services: { num: string; title: string; desc: string; detail: string }[];
  reviews: { author: string; role: string; group: string; text: string }[];
  gallery: { src: string; title: string; subtitle: string }[];
}

function getSectorConfig(info: DynamicSiteInfo): SectorConfig {
  const name = info.n;

  if (info.s === 'restaurant') {
    return {
      eyebrow: 'GELENEKSEL LEZZET & RESTORAN',
      navActionLabel: 'Rezervasyon & Sipariş',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak günlük taze malzemelerle hazırlanan çorba çeşitlerimiz, geleneksel ana yemeklerimiz ve hijyenik mutfağımızla misafirlerimize gerçek lezzet deneyimi sunuyoruz.`,
      aboutTitle: 'Usta Ellerden Çıkan Geleneksel ve Taze Lezzetler',
      aboutP1: `${name}, özenle seçilen doğal malzemeleri geleneksel tariflerle buluşturarak her gün taze üretim yapmaktadır. Kemik suyuna hazırlanan şifalı çorbalarımızdan ızgara ve yöresel yemeklerimize kadar tüm menümüz usta aşçılarımız tarafından hazırlanır.`,
      aboutP2: 'Ferah salonumuz, güler yüzlü servis ekibimiz ve yüksek hijyen standartlarımızla hem ailelerin hem de lezzet tutkunlarının güvenle tercih ettiği buluşma noktasıyız.',
      hours: 'Her Gün: 06:00 – 02:00',
      headerBg: 'bg-stone-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-restaurant-kitchen-43474-large.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
      pillars: [
        { num: '01', title: 'Günlük Taze Hazırlık', desc: 'Tüm çorba ve yemeklerimiz her sabah taze et, kemik suyu ve doğal yöresel malzemelerle günlük olarak hazırlanır.' },
        { num: '02', title: 'Geleneksel Usta Tarifleri', desc: 'Yılların tecrübesiyle korunan orijinal reçeteler ve odun/taş ocağı lezzetiyle pişirilen özel menü.' },
        { num: '03', title: 'Tam Hijyen & Kalite', desc: 'Mutfağımızda ve servis alanımızda gıda güvenliği ile hijyen kuralları en üst seviyede uygulanır.' },
        { num: '04', title: 'Hızlı Servis & Sıcak Sunum', desc: 'Hem salon servisimizde hem de paket siparişlerde bekletmeden, sıcak ve bol porsiyonlu sunum.' },
      ],
      servicesSectionTitle: 'Öne Çıkan Lezzetlerimiz ve Menü Gruplarımız',
      services: [
        { num: '01', title: 'Günün Özel Çorba Çeşitleri', desc: 'Kemik suyuna hazırlanan beyran, kelle paça, ayak paça, işkembe, mercimek ve yöresel Maraş tarhana çorbaları.', detail: 'Doğal Kemik Suyu • Bol Malzeme • Sıcak Sunum' },
        { num: '02', title: 'Yöresel & Geleneksel Ana Yemekler', desc: 'Usta ellerde hazırlanan güveç, kavurma, haşlama ve günlük değişen geleneksel tencere yemekleri.', detail: 'Yöresel Tarifler • Günlük Üretim • Doğal Lezzet' },
        { num: '03', title: 'Izgara & Kebap Çeşitleri', desc: 'Özel dinlendirilmiş etlerden hazırlanan ızgara köfte, şiş ve kebap çeşitlerimiz.', detail: 'Seçkin Et Kalitesi • Usta Pişirim • Zengin Garnitür' },
        { num: '04', title: 'Taze Salata, Meze & İkramlar', desc: 'Yemeklerinizin yanında taze mevsim yeşillikleri, közlenmiş biber, sarımsak-sos ve fırından sıcak ekmek ikramı.', detail: 'Mevsim Yeşillikleri • Özel Soslar • Sıcak Lavaş/Pide' },
        { num: '05', title: 'Geleneksel Tatlılar & İçecekler', desc: 'Yemek sonrası fırın sütlaç, künefe, kadayıf çeşitleri, yayık ayranı ve taze demleme çay.', detail: 'Fırın Sütlaç • Tatlı Çeşitleri • Demleme Çay' },
        { num: '06', title: 'Paket Servis & Grup Ağırlama', desc: 'Aile yemekleri, iş toplantıları ve bulunduğunuz konuma hızlı sıcak paket servis imkanı.', detail: 'Aile Salonu • Hızlı Paket • Gece & Gündüz Açık' },
      ],
      reviews: [
        { author: 'Ahmet Y.', role: 'Google Yorumu', group: 'Çorba & Yöresel Lezzetler', text: 'Çorbalarının lezzeti ve kıvamı gerçekten harika. Porsiyonlar oldukça doyurucu, mekan tertemiz ve çalışanlar çok ilgili.' },
        { author: 'Selim K.', role: 'Google Yorumu', group: 'Aile Salonu & Servis', text: 'Ailecek uğradığımız, ikramları bol ve servisi çok hızlı bir mekan. Özellikle kemik suyuna yapılan çorbalarını herkese tavsiye ederim.' },
        { author: 'Burak T.', role: 'Google Yorumu', group: 'Gece & Gündüz Sıcak Çorba', text: 'Günün hangi saatinde giderseniz gidin aynı tazelikte ve sıcaklıkta servis yapıyorlar. Fiyat-performans olarak bölgenin en iyisi.' },
        { author: 'Mustafa D.', role: 'Google Yorumu', group: 'Mutfak & Hijyen', text: 'Esnaflıkları, güler yüzlü karşılamaları ve mutfak temizliği 10 numara. Yıllardır kalitesini hiç bozmayan nadir yerlerden.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', title: 'Ferah ve Konforlu Salonumuz', subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80', title: 'Günlük Taze Çorba ve Sıcak Mutfağımız', subtitle: 'Geleneksel tariflerle hazırlanan doğal lezzetler' },
        { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', title: 'Izgara ve Yöresel Ana Yemeklerimiz', subtitle: 'Usta aşçılarımızdan bol porsiyonlu sunumlar' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', title: 'Aile ve Misafir Ağırlama Alanımız', subtitle: 'Hijyenik, nezih ve hızlı servis anlayışı' },
      ],
    };
  }

  if (info.s === 'dental_medical') {
    return {
      eyebrow: 'AĞIZ VE DİŞ SAĞLIĞI / KLİNİK MERKEZİ',
      navActionLabel: 'Randevu Al',
      servicesNavLabel: 'Tedaviler',
      galleryNavLabel: 'Kliniğimiz',
      heroSubtitle: `${name} olarak modern görüntüleme teknolojileri, steril klinik altyapımız ve uzman hekim kadromuzla sağlıklı ve estetik gülüşler için güvenilir tedavi çözümleri sunuyoruz.`,
      aboutTitle: 'Hijyenik, Konforlu ve Modern Klinik Standartları',
      aboutP1: `${name}, hasta konforunu ve uluslararası sterilizasyon protokollerini merkeze alarak koruyucu ve tedavi edici sağlık hizmetleri sunmaktadır.`,
      aboutP2: 'Dijital teşhis yöntemlerimiz ve kişiye özel tedavi planlamamızla tüm süreçleri şeffaf, ağrısız ve güven veren bir yaklaşımla yürütüyoruz.',
      hours: 'Pazartesi – Cumartesi: 09:00 – 19:00',
      isLightHeader: true,
      headerBg: 'bg-white/95 border-slate-200',
      headerText: 'text-slate-900',
      headerSub: 'text-teal-600',
      navLink: 'text-slate-600 hover:text-teal-600',
      ctaBtn: 'bg-teal-600 hover:bg-teal-500 text-white',
      heroBg: 'bg-slate-900',
      heroLine: 'bg-teal-400',
      heroEyebrow: 'text-teal-300',
      accentText: 'text-teal-600',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-with-tools-44564-large.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80',
      pillars: [
        { num: '01', title: 'Dijital Teşhis & Planlama', desc: 'Modern görüntüleme cihazları ile hızlı, doğru teşhis ve kişiye özel tedavi planlaması.' },
        { num: '02', title: 'Üst Düzey Sterilizasyon', desc: 'Tüm klinik ekipmanlarımızda uluslararası hijyen ve otoklav sterilizasyon standartları.' },
        { num: '03', title: 'Uzman Hekim Kadrosu', desc: 'Estetik, cerrahi ve koruyucu tedavilerde deneyimli ve güler yüzlü yaklaşım.' },
        { num: '04', title: 'Konforlu & Ağrısız Süreç', desc: 'Hasta memnuniyetini ve konforunu ön planda tutan modern klinik ortamı.' },
      ],
      servicesSectionTitle: 'Uyguladığımız Başlıca Tedavi ve Hizmetler',
      services: [
        { num: '01', title: 'İmplant & Cerrahi Uygulamalar', desc: 'Eksik dişlerin fonksiyonel ve estetik olarak tamamlanması için garantili dental implant tedavileri.', detail: 'Dijital Planlama • Steril Cerrahi • Kalıcı Çözüm' },
        { num: '02', title: 'Gülüş Tasarımı & Zirkonyum', desc: 'Doğal diş estetiğine en yakın ışık geçirgenliğine sahip zirkonyum ve lamina porselen uygulamaları.', detail: 'Zirkonyum • E-Max Lamina • Estetik Tasarım' },
        { num: '03', title: 'Diş Beyazlatma & Diş Eti Bakımı', desc: 'Diş taşı temizliği (detertraj) ve klinik tipi lazer diş beyazlatma işlemleri.', detail: 'Ofis Tipi Beyazlatma • Sağlıklı Diş Eti • Ferah Gülüş' },
        { num: '04', title: 'Kanal Tedavisi & Dolgu', desc: 'Doğal dişlerin korunmasını sağlayan modern endodontik kanal tedavisi ve estetik kompozit dolgular.', detail: 'Ağrısız Uygulama • Estetik Dolgu • Diş Koruma' },
        { num: '05', title: 'Ortodonti & Şeffaf Plak', desc: 'Diş çapraşıklıklarının tel tedavisi veya telsiz şeffaf plaklarla konforlu şekilde düzeltilmesi.', detail: 'Şeffaf Plak • Ortodonti • Düzenli Takip' },
        { num: '06', title: 'Çocuk Diş Hekimliği & Kontroller', desc: 'Çocuklara özel koruyucu uygulamalar ve düzenli periyodik ağız-diş muayeneleri.', detail: 'Koruyucu Hekimlik • Çocuk Dostu • Periyodik Muayene' },
      ],
      reviews: [
        { author: 'Zeynep A.', role: 'Google Yorumu', group: 'Gülüş Tasarımı & Zirkonyum', text: 'Kliniğin temizliği, doktorların ilgisi ve yapılan işlemin doğallığı beklentimin çok üzerindeydi. Gönül rahatlığıyla tavsiye ederim.' },
        { author: 'Emre S.', role: 'Google Yorumu', group: 'İmplant Tedavisi', text: 'Çok korkarak gitmeme rağmen hiç ağrı hissetmeden implant işlemim tamamlandı. Süreç boyunca her detayı sabırla anlattılar.' },
        { author: 'Elif K.', role: 'Google Yorumu', group: 'Diş Temizliği & Dolgu', text: 'Randevu saatine tam uyum, tertemiz bir ortam ve çok nazik bir ekip. Ailecek tek tercihimiz.' },
        { author: 'Hakan M.', role: 'Google Yorumu', group: 'Kanal Tedavisi', text: 'Şiddetli diş ağrısıyla gittim ve aynı gün içinde sağlığıma kavuştum. Ellerinize sağlık.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80', title: 'Modern Muayene ve Tedavi Ünitelerimiz', subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80', title: 'Sterilizasyon ve Dijital Donanım', subtitle: 'Uluslararası hijyen standartlarında klinik altyapı' },
        { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80', title: 'Estetik ve Koruyucu Hekimlik', subtitle: 'Kişiye özel tedavi ve gülüş planlaması' },
        { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80', title: 'Hasta Kabul ve Dinlenme Alanımız', subtitle: 'Ferah ve konforlu bekleme salonumuz' },
      ],
    };
  }

  if (info.s === 'mercedes_luxury') {
    return {
      eyebrow: 'ÖZEL SERVİS & YEDEK PARÇA MERKEZİ',
      navActionLabel: 'Randevu Al',
      servicesNavLabel: 'Hizmetler',
      galleryNavLabel: 'Atölye',
      heroSubtitle: `${name} olarak bilgisayarlı arıza tespiti, periyodik bakım, şanzıman-motor onarımı ve orijinal yedek parça hizmetlerini uzman kadromuzla sunuyoruz.`,
      aboutTitle: 'Standartlara Uygun Profesyonel Bakım ve Onarım',
      aboutP1: `${name}, modern diyagnostik test cihazları ve deneyimli teknisyen kadrosuyla aracınızın tüm mekanik ve elektronik bakım süreçlerini titizlikle yürütür.`,
      aboutP2: 'Orijinal ve Alman OEM yedek parça stoğumuzla aracınızın fabrika verilerini ve ikinci el değerini koruyoruz.',
      hours: 'Pazartesi – Cumartesi: 08:00 – 19:00',
      headerBg: 'bg-black/95 border-white/15',
      headerText: 'text-white',
      headerSub: 'text-neutral-400',
      navLink: 'text-neutral-300 hover:text-white',
      ctaBtn: 'bg-white hover:bg-neutral-200 text-black',
      heroBg: 'bg-black',
      heroLine: 'bg-white',
      heroEyebrow: 'text-neutral-300',
      accentText: 'text-neutral-900',
      videoSrc: '/vw/hero-bg.mp4',
      posterSrc: '/vw/vw-service.jpg',
      pillars: [
        { num: '01', title: 'Bilgisayarlı Arıza Tespiti', desc: 'Orijinal diyagnostik cihazlar ile elektronik ve mekanik arızaların nokta atışı tespiti.' },
        { num: '02', title: 'Motor & Şanzıman Uzmanlığı', desc: 'Otomatik şanzıman bakımı, zincir/triger değişimi ve komple motor revizyon işlemleri.' },
        { num: '03', title: 'Orijinal & OEM Yedek Parça', desc: 'Aracınızın performansını koruyan logolu orijinal ve birinci sınıf OEM parçalar.' },
        { num: '04', title: 'Şeffaf Servis Süreci', desc: 'İşlem öncesi net maliyet bilgilendirmesi ve garantili işçilik.' },
      ],
      servicesSectionTitle: 'Atölyemizde Yapılan Başlıca İşlemler',
      services: [
        { num: '01', title: 'Periyodik Bakım & Filtre Değişimi', desc: 'Üretici onaylı motor yağları ve orijinal filtre setleri ile garantili periyodik bakım.', detail: 'Orijinal Filtre • Motor Yağı • Servis Sıfırlama' },
        { num: '02', title: 'Bilgisayarlı Diyagnostik & Kodlama', desc: 'Elektronik kontrol ünitesi (ECU) okuma, adaptasyon, partikül ve sensör testleri.', detail: 'ECU Teşhis • Adaptasyon • Elektronik Onarım' },
        { num: '03', title: 'Otomatik Şanzıman Bakım & Onarımı', desc: 'Şanzıman yağ ve filtre değişimi, türbin/mekatronik revizyonu ve vites kalibrasyonu.', detail: 'Şanzıman Yağı • Kalibrasyon • Revizyon' },
        { num: '04', title: 'Motor Mekanik & Triger Bakımı', desc: 'Zincir ve triger seti değişimi, turbo, enjektör ve soğutma sistemi onarımları.', detail: 'Motor Revizyon • Turbo • Soğutma Sistemi' },
        { num: '05', title: 'Fren, Süspansiyon & Ön Takım', desc: 'Fren diski ve balata değişimi, amortisör, salıncak ve direksiyon sistemi kontrolleri.', detail: 'Fren Disk & Balata • Amortisör • Ön Takım' },
        { num: '06', title: 'Orijinal Yedek Parça Temini', desc: 'Zengin yedek parça stoğumuzla bekleme süresini ortadan kaldıran hızlı parça tedariki.', detail: 'Stoktan Teslim • Garantili Parça • Hızlı Montaj' },
      ],
      reviews: [
        { author: 'Serkan K.', role: 'Google Yorumu', group: 'Periyodik Bakım & Şanzıman', text: 'Aracımın tüm bakımlarını gönül rahatlığıyla yaptırıyorum. Hem teşhiste hem parça kalitesinde çok başarılılar.' },
        { author: 'Oğuzhan T.', role: 'Google Yorumu', group: 'Bilgisayarlı Arıza Tespiti', text: 'Başka yerde çözülemeyen elektronik arızayı cihazla bağlanıp yarım saatte çözdüler. Gerçekten işinin ehli ustalar.' },
        { author: 'Murat B.', role: 'Google Yorumu', group: 'Motor & Mekanik', text: 'Temiz işçilik, şeffaf fiyatlandırma ve zamanında teslimat. Herkese tavsiye ederim.' },
        { author: 'Hüseyin A.', role: 'Google Yorumu', group: 'Yedek Parça & Bakım', text: 'Orijinal parçalarla gözünüzün önünde tertemiz bakım yapıyorlar. İlgi ve alakaları için teşekkürler.' },
      ],
      gallery: [
        { src: '/vw/vw-service.jpg', title: 'Mekanik Bakım & Arıza Tespit Atölyesi', subtitle: info.a },
        { src: '/vw/spare-parts.jpg', title: 'Orijinal & OEM Yedek Parça Stoğu', subtitle: 'Zengin parça çeşitliliği ve garantili montaj' },
        { src: '/vw/office-lounge.png', title: 'Servis Kabul & Müşteri Danışma', subtitle: 'Şeffaf servis planlaması ve bilgilendirme' },
        { src: '/vw/waiting-room.png', title: 'Müşteri Bekleme Salonu', subtitle: 'Aracınızın bakımı yapılırken konforlu dinlenme alanı' },
      ],
    };
  }

  if (info.s === 'industrial_heating') {
    return {
      eyebrow: 'ÜRETİM, SANAYİ & TOPTAN SATIŞ MERKEZİ',
      navActionLabel: 'Teklif & İletişim',
      servicesNavLabel: 'Ürünler',
      galleryNavLabel: 'Tesisimiz',
      heroSubtitle: `${name} olarak standartlara uygun üretim altyapımız, yüksek kaliteli hammadde kullanımımız ve geniş sevkiyat ağımızla sektöre uzun ömürlü çözümler sunuyoruz.`,
      aboutTitle: 'Kaliteli Üretim ve Güvenilir Sanayi Altyapısı',
      aboutP1: `${name}, modern üretim tesisinde dayanıklılık ve yüksek verimlilik kriterlerini esas alarak seri imalat ve tedarik faaliyetlerini sürdürmektedir.`,
      aboutP2: 'Deneyimli teknik kadromuz ve kalite kontrol süreçlerimizle hem toptan bayilerimize hem de bireysel müşterilerimize doğrudan hizmet veriyoruz.',
      hours: 'Pazartesi – Cumartesi: 08:00 – 18:30',
      headerBg: 'bg-zinc-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-red-500',
      navLink: 'text-zinc-300 hover:text-white',
      ctaBtn: 'bg-red-700 hover:bg-red-600 text-white',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-red-600',
      heroEyebrow: 'text-red-400',
      accentText: 'text-red-700',
      videoSrc: '/vw/hero-bg.mp4',
      posterSrc: '/vw/vw-service.jpg',
      pillars: [
        { num: '01', title: 'Standartlara Uygun Üretim', desc: 'Kalite standartlarına uygun hammadde ve modern üretim parkuruyla yüksek dayanımlı imalat.' },
        { num: '02', title: 'Yüksek Verimlilik', desc: 'Uzun yıllar güvenli kullanım sağlayan mühendislik ve kalite kontrol süreçleri.' },
        { num: '03', title: 'Toptan & Perakende Sevkiyat', desc: 'Geniş lojistik ağımızla bayilerimize ve müşterilerimize zamanında teslimat.' },
        { num: '04', title: 'Yedek Parça & Destek', desc: 'Tüm ürün gruplarımız için kesintisiz yedek parça ve satış sonrası teknik destek.' },
      ],
      servicesSectionTitle: 'Ürün Gruplarımız ve Üretim Çözümlerimiz',
      services: [
        { num: '01', title: 'Seri Üretim & Ana Ürün Grupları', desc: 'Yüksek mukavemetli malzemelerle üretilen standartlara uygun ana ürün serilerimiz.', detail: 'Yüksek Dayanım • Kalite Kontrol • Garantili İmalat' },
        { num: '02', title: 'Özel Ölçü & Kurumsal Projeler', desc: 'İşletmelerin ve projelerin ihtiyaçlarına özel kapasite ve ebatlarda üretim çözümleri.', detail: 'Proje Üretimi • Özel Tasarım • Mühendislik' },
        { num: '03', title: 'Toptan Bayi Sevkiyatı', desc: 'Türkiye genelindeki satış noktalarına ve bayilere düzenli, güvenli sevkiyat organizasyonu.', detail: 'Bayi Ağı • Toptan Satış • Hızlı Lojistik' },
        { num: '04', title: 'Yedek Parça & Aksesuar Grubu', desc: 'Ürettiğimiz tüm modellere birebir uyumlu orijinal yedek parça ve tamamlayıcı ekipmanlar.', detail: 'Orijinal Parça • Stoktan Teslim • Tam Uyum' },
        { num: '05', title: 'Kalite Test & Denetim', desc: 'Her üretim partisinde uygulanan sızdırmazlık, dayanıklılık ve yüzey kalite kontrolleri.', detail: 'Sıkı Denetim • Uzun Ömür • Güvenli Kullanım' },
        { num: '06', title: 'Fabrika Doğrudan Satış & Danışma', desc: 'Üretim merkezimizden doğrudan fiyatlandırma, teknik bilgilendirme ve sipariş desteği.', detail: 'Fabrika Fiyatı • Doğrudan İletişim • Kurumsal Güvence' },
      ],
      reviews: [
        { author: 'Mehmet K.', role: 'Google Yorumu', group: 'Toptan Bayi', text: 'Yıllardır ürünlerini satıyoruz, malzeme kalitesi ve sevkiyat hızı konusunda hiçbir sorun yaşamadık.' },
        { author: 'Ali Rıza Ç.', role: 'Google Yorumu', group: 'Kurumsal Müşteri', text: 'Sağlam işçilik ve dürüst ticaret anlayışıyla çalışan örnek bir üretim tesisi.' },
        { author: 'İbrahim Y.', role: 'Google Yorumu', group: 'Perakende Müşteri', text: 'Ürünün kalitesi ilk bakışta belli oluyor. İlgileri ve hızlı teslimatları için teşekkür ederim.' },
        { author: 'Hasan D.', role: 'Google Yorumu', group: 'Bayi & İş Ortağı', text: 'Satış sonrasında da her zaman ürünlerinin arkasında duran güvenilir bir firma.' },
      ],
      gallery: [
        { src: '/vw/vw-service.jpg', title: 'Üretim ve İmalat Hattımız', subtitle: info.a },
        { src: '/vw/spare-parts.jpg', title: 'Stok ve Sevkiyat Hazırlık Alanı', subtitle: 'Toptan ve perakende siparişler için güçlü stok' },
        { src: '/vw/office-lounge.png', title: 'Kurumsal İdari Ofis & Satış', subtitle: 'Bayi ve müşteri koordinasyon merkezi' },
        { src: '/vw/waiting-room.png', title: 'Misafir Ağırlama Salonu', subtitle: 'Fabrika ve mağaza müşteri kabul alanımız' },
      ],
    };
  }

  // Default: Automotive / Auto Electric / VAG / Corporate Service
  return {
    eyebrow: info.s === 'vag_automotive' ? 'ÖZEL SERVİS & YEDEK PARÇA MERKEZİ' : 'KURUMSAL HİZMET & TEKNİK SERVİS MERKEZİ',
    navActionLabel: 'Randevu Al',
    servicesNavLabel: 'Hizmetler',
    galleryNavLabel: 'Galeri',
    heroSubtitle: `${name} olarak uzman kadromuz, modern ekipman altyapımız ve garantili hizmet anlayışımızla müşterilerimize hızlı, şeffaf ve güvenilir çözümler sunuyoruz.`,
    aboutTitle: `${name} Kurumsal Hizmet ve Kalite Anlayışı`,
    aboutP1: `${name}, sektöründeki teknik tecrübesi ve modern donanımıyla tüm bakım, onarım ve uygulama süreçlerini standartlara uygun olarak gerçekleştirmektedir.`,
    aboutP2: 'İşlem öncesi şeffaf bilgilendirme, kaliteli malzeme/parça kullanımı ve zamanında teslimat ilkelerimizle her zaman yanınızdayız.',
    hours: 'Pazartesi – Cumartesi: 08:00 – 19:00',
    headerBg: 'bg-zinc-950/95 border-white/10',
    headerText: 'text-white',
    headerSub: info.s === 'vag_automotive' ? 'text-zinc-400' : 'text-amber-400',
    navLink: 'text-zinc-300 hover:text-white',
    ctaBtn: info.s === 'vag_automotive' ? 'bg-white hover:bg-zinc-200 text-zinc-950' : 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
    heroBg: 'bg-zinc-950',
    heroLine: info.s === 'vag_automotive' ? 'bg-white' : 'bg-amber-500',
    heroEyebrow: info.s === 'vag_automotive' ? 'text-zinc-300' : 'text-amber-400',
    accentText: info.s === 'vag_automotive' ? 'text-zinc-900' : 'text-amber-600',
    videoSrc: '/vw/hero-bg.mp4',
    posterSrc: '/vw/vw-service.jpg',
    pillars: [
      { num: '01', title: 'Bilgisayarlı Teşhis & Analiz', desc: 'Modern test cihazları ile deneme-yanılma yapmadan nokta atışı arıza ve ihtiyaç tespiti.' },
      { num: '02', title: 'Uzman Usta Kadrosu', desc: 'Alanında deneyimli teknisyenlerimizle tüm işlemlerde standartlara uygun, titiz işçilik.' },
      { num: '03', title: 'Orijinal & Garantili Parça', desc: 'Uzun ömürlü ve güvenli kullanım sağlayan birinci sınıf yedek parça ve ekipmanlar.' },
      { num: '04', title: 'Şeffaf Fiyat & Zamanında Teslim', desc: 'İşlem öncesinde net bilgilendirme yapıyor, onayınız olmadan ekstra işlem uygulamıyoruz.' },
    ],
    servicesSectionTitle: 'Sunduğumuz Başlıca Hizmetler ve Çözümler',
    services: [
      { num: '01', title: 'Periyodik Bakım & Genel Kontrol', desc: 'Güvenli ve verimli kullanım için gerekli tüm periyodik bakım, filtre, sıvı ve güvenlik kontrolleri.', detail: 'Periyodik Bakım • Güvenlik Testi • Garantili İşlem' },
      { num: '02', title: 'Bilgisayarlı Arıza Tespiti', desc: 'Gelişmiş diyagnostik cihazlarımızla elektronik ve mekanik sistemlerin detaylı kontrolü ve arıza giderimi.', detail: 'Diyagnostik Teşhis • Elektronik Kontrol • Hızlı Çözüm' },
      { num: '03', title: 'Elektrik, Elektronik & Akü Servisi', desc: 'Marş-şarj sistemleri, akü ölçümü, aydınlatma ve elektronik donanım onarım işlemleri.', detail: 'Elektrik & Elektronik • Akü Testi • Tesisat Bakımı' },
      { num: '04', title: 'Mekanik Onarım & Revizyon', desc: 'Motor, şanzıman, fren ve yürür aksam parçalarında uzman kadromuzla garantili mekanik onarım.', detail: 'Motor & Mekanik • Fren Sistemi • Ön Takım' },
      { num: '05', title: 'Orijinal Yedek Parça Temini', desc: 'Geniş yedek parça stoğumuzla zaman kaybı yaşatmadan orijinal ve OEM parça montajı.', detail: 'Orijinal Yedek Parça • Stoktan Temin • Uygun Fiyat' },
      { num: '06', title: 'Bireysel & Kurumsal Filo Hizmeti', desc: 'Hem bireysel müşterilerimize hem de kurumsal araç filolarına öncelikli ve hızlı servis desteği.', detail: 'Bireysel & Filo • Aynı Gün Teslim • Kurumsal Destek' },
    ],
    reviews: [
      { author: 'Emre K.', role: 'Google Yorumu', group: 'Periyodik Bakım & Onarım', text: 'Gözünüzün önünde şeffaf şekilde çalışıyorlar, kullanılan parçalar orijinal ve işçilikleri gerçekten çok temiz.' },
      { author: 'Mustafa Ç.', role: 'Google Yorumu', group: 'Arıza Tespiti', text: 'Cihazla bağlanıp arızayı nokta atışı tespit ettiler. Gereksiz hiçbir parça değiştirmeden aynı gün teslim ettiler.' },
      { author: 'Serdar Y.', role: 'Google Yorumu', group: 'Mekanik & Elektrik Servisi', text: 'Dürüst esnaflık, güler yüzlü karşılama ve makul fiyatlar için tüm ekibe teşekkür ederim.' },
      { author: 'Gökhan D.', role: 'Google Yorumu', group: 'Kurumsal Hizmet', text: 'Tüm araçlarımızın bakımlarını burada yaptırıyoruz. İşimizi aksatmadan zamanında teslim ediyorlar.' },
    ],
    gallery: [
      { src: '/vw/vw-service.jpg', title: `${name} Hizmet & Uygulama Alanı`, subtitle: info.a },
      { src: '/vw/spare-parts.jpg', title: 'Zengin Yedek Parça ve Ekipman Stoğu', subtitle: 'Orijinal ve garantili parça tedariki' },
      { src: '/vw/office-lounge.png', title: 'Müşteri Kabul ve Danışma Ofisi', subtitle: 'Şeffaf süreç planlaması ve bilgilendirme' },
      { src: '/vw/waiting-room.png', title: 'Konforlu Müşteri Bekleme Salonu', subtitle: 'İşlemleriniz tamamlanırken dinlenebileceğiniz alanımız' },
    ],
  };
}

export const DynamicCorporateSite: React.FC<{ info: DynamicSiteInfo }> = ({ info }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formNote, setFormNote] = useState('');

  const cfg = getSectorConfig(info);
  const digits = info.p.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  const phoneHref = `+90${digits || '5444775657'}`;
  const isMobilePhone = digits.startsWith('5');
  const repeatedReviews = [...cfg.reviews, ...cfg.reviews];

  useEffect(() => {
    document.title = `${info.n} | Kurumsal Web Sitesi`;
  }, [info.n]);

  const navLinks = [
    { name: 'Hakkımızda', href: '#kurumsal' },
    { name: cfg.servicesNavLabel, href: '#hizmetler' },
    { name: 'Yorumlar', href: '#yorumlar' },
    { name: cfg.galleryNavLabel, href: '#galeri' },
    { name: 'İletişim', href: '#iletisim' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMobilePhone) {
      const msg = `Merhaba ${info.n}, ben ${formName}. Konu: ${formSubject}. Not: ${formNote}`;
      window.open(`https://wa.me/90${digits}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `tel:${phoneHref}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      {/* 1. Single-Line Bug-Free Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${cfg.headerBg} backdrop-blur-md border-b py-4`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            <a href="#" className="flex items-center gap-3 shrink-0">
              {info.s === 'vag_automotive' && <VwLogo className="w-9 h-9 shrink-0" />}
              <div className="whitespace-nowrap">
                <span className={`block ${cfg.headerText} font-bold text-base tracking-tight leading-none`}>
                  {info.n.toUpperCase()}
                </span>
                <span className={`block ${cfg.headerSub} text-[11px] font-medium tracking-widest uppercase mt-1`}>
                  {cfg.eyebrow}
                </span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium ${cfg.navLink} transition-colors whitespace-nowrap`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href={`tel:${phoneHref}`}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg ${cfg.headerText} text-sm font-semibold transition-colors whitespace-nowrap shrink-0`}
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{info.p}</span>
              </a>
              <a
                href="#iletisim"
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg ${cfg.ctaBtn} text-sm font-semibold transition-colors whitespace-nowrap shrink-0`}
              >
                {cfg.navActionLabel}
              </a>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${cfg.headerText} shrink-0`}
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-zinc-500/20 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${cfg.headerText}`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${phoneHref}`}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border border-zinc-500/30 ${cfg.headerText} text-sm font-semibold`}
                >
                  <Phone className="w-4 h-4" />
                  <span>{info.p}</span>
                </a>
                <a
                  href="#iletisim"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center py-2.5 rounded-lg ${cfg.ctaBtn} text-sm font-semibold`}
                >
                  {cfg.navActionLabel}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Full-Bleed Video Hero */}
      <main>
        <section className={`relative min-h-[88vh] flex items-center ${cfg.heroBg} pt-24 pb-16 overflow-hidden`}>
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={cfg.posterSrc}
              className="w-full h-full object-cover object-center"
            >
              <source src={cfg.videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-zinc-950/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <span className={`w-8 h-[2px] ${cfg.heroLine}`} />
                <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.heroEyebrow}`}>
                  {cfg.eyebrow}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-6">
                {info.n}.
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-9 max-w-2xl">
                {cfg.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-12">
                <a
                  href={`tel:${phoneHref}`}
                  className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg ${cfg.ctaBtn} font-semibold text-sm sm:text-base transition-colors`}
                >
                  <Phone className="w-4 h-4" />
                  <span>{info.p}</span>
                </a>

                <a
                  href={info.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base border border-white/20 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Haritada Yol Tarifi</span>
                </a>
              </div>

              <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 text-xs sm:text-sm text-zinc-400">
                <span>Adres: {info.a}</span>
                <span className="hidden sm:inline">•</span>
                <span>{cfg.hours}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. About Section */}
        <section id="kurumsal" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.accentText} mb-3`}>
                  HAKKIMIZDA
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-5">
                  {cfg.aboutTitle}
                </h2>
                <p className="text-zinc-600 text-base leading-relaxed mb-4">{cfg.aboutP1}</p>
                <p className="text-zinc-600 text-base leading-relaxed">{cfg.aboutP2}</p>
              </div>

              <div className="lg:col-span-6">
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img src={cfg.gallery[0].src} alt={info.n} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-12 border-t border-zinc-200">
              {cfg.pillars.map((item) => (
                <div key={item.num}>
                  <span className={`block text-xs font-mono font-bold ${cfg.accentText} mb-2`}>
                    {item.num}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Services / Menu Section */}
        <section id="hizmetler" className="py-20 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.accentText} mb-3`}>
                {cfg.servicesNavLabel.toUpperCase()}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                {cfg.servicesSectionTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cfg.services.map((service) => (
                <div
                  key={service.num}
                  className="bg-white rounded-lg p-7 border border-zinc-200 flex flex-col justify-between"
                >
                  <div>
                    <span className={`block text-xs font-mono font-bold ${cfg.accentText} mb-4`}>
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

        {/* 5. Continuous Review River */}
        <section id="yorumlar" className="py-20 bg-zinc-950 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  MÜŞTERİ & MİSAFİR YORUMLARI
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {info.n} Hakkında Görüşler
                </h2>
              </div>
              <a
                href={info.u}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium text-white border border-white/15 transition-colors self-start sm:self-auto whitespace-nowrap"
              >
                <span>Google Haritalar’da Gör</span>
                <ExternalLink className="w-4 h-4 text-zinc-300" />
              </a>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex gap-6 animate-river-continuous w-max px-4">
              {repeatedReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="w-[340px] sm:w-[400px] shrink-0 rounded-lg bg-zinc-900 border border-white/10 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400">{review.role}</span>
                    </div>
                    <p className="text-zinc-200 text-sm leading-relaxed mb-5">"{review.text}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="font-semibold text-sm text-white">{review.author}</span>
                    <span className="text-xs text-zinc-400">{review.group}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Gallery & Contact + Map */}
        <section id="galeri" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.accentText} mb-3`}>
                {cfg.galleryNavLabel.toUpperCase()}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                {info.n} Görselleri
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cfg.gallery.map((photo) => (
                <div key={photo.title} className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
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

        <section id="iletisim" className="py-20 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.accentText} mb-3`}>
                İLETİŞİM & KONUM
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                İletişim Bilgileri ve Yol Tarifi
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-white rounded-lg p-7 sm:p-8 border border-zinc-200 flex flex-col justify-between">
                <div className="divide-y divide-zinc-200">
                  <div className="pb-5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      TELEFON
                    </span>
                    <a href={`tel:${phoneHref}`} className="text-2xl font-bold text-zinc-900 mt-1 block">
                      {info.p}
                    </a>
                  </div>

                  <div className="py-5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      ADRES
                    </span>
                    <p className="text-base font-semibold text-zinc-900 mt-1">{info.a}</p>
                  </div>

                  <div className="pt-5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      ÇALIŞMA SAATLERİ
                    </span>
                    <p className="text-base font-semibold text-zinc-900 mt-1">{cfg.hours}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-200">
                  <a
                    href={info.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
                  >
                    Google Haritalar’da Yol Tarifi Aç
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg p-7 sm:p-8 border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Hızlı İletişim & {cfg.navActionLabel}</h3>
                <p className="text-sm text-zinc-600 mb-6">
                  Bilgi, fiyat veya randevu talebiniz için bize doğrudan ulaşabilirsiniz.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Konu
                    </label>
                    <input
                      type="text"
                      required
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="Talebinizin konusu"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Mesajınız
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formNote}
                      onChange={(e) => setFormNote(e.target.value)}
                      placeholder="Mesajınızı kısaca yazınız..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 px-6 rounded-lg ${cfg.ctaBtn} font-semibold text-sm transition-colors`}
                  >
                    Hemen İletişime Geç ({info.p})
                  </button>
                </form>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white h-[360px]">
              <iframe
                title={`${info.n} Konumu`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(info.q)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
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
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 pb-24 sm:pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="block text-white font-bold text-sm">{info.n.toUpperCase()}</span>
              <span className="block text-xs text-zinc-400 mt-1">{cfg.eyebrow}</span>
            </div>
            <div className="text-sm text-zinc-300">
              {info.a} • {info.p}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} {info.n}. Tüm hakları saklıdır.</p>
            <p>Kurumsal Web Sitesi</p>
          </div>
        </div>
      </footer>

      {/* Mobile Quick Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-zinc-950 border-t border-white/15 px-3 py-2.5">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${phoneHref}`}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg ${cfg.ctaBtn} font-semibold text-xs`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hemen Ara</span>
          </a>
          <a
            href={info.u}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-zinc-800 text-white font-medium text-xs border border-white/15"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Yol Tarifi</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DynamicCorporateSite;
