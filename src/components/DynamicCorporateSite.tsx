import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Menu, X, Star, ExternalLink } from 'lucide-react';
import BrandLogo from './BrandLogo';

export interface DynamicSiteInfo {
  n: string; // Business Name
  a: string; // Address
  p: string; // Phone Display
  c?: string; // Real Google Maps / Instagram Categories
  s: string; // Sector key
  q: string; // Map query
  u: string; // Original URL
  l?: string; // Compact Logo URL
  logo?: string; // Real Business Logo URL
  bio?: string; // Official Owner Description / Story (from Google Maps d[154] or IG)
  hr?: string; // Official Working Hours (from Google Maps d[203])
  rt?: string; // Official Google Star Rating (from d[4][7])
  rc?: number; // Official Google Review Count (from d[4][8])
  ci?: string[]; // Custom learned/taught offerings from Telegram user
  items?: { num: string; title: string; desc: string; detail: string }[]; // Real extracted offerings
  pm?: 'auto' | 'studio'; // Photo mode: 'auto' (business photos + HD fill) or 'studio' (16:10 clean sector photos)
  ph?: string[]; // Compact Photos Array baked into URL
  photos?: string[]; // Real Google Maps / Instagram photos
  reviews?: { author: string; role: string; group: string; text: string }[]; // Real Google Maps reviews
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
  aboutImgSrc: string;
  pillars: { num: string; title: string; desc: string }[];
  servicesSectionTitle: string;
  services: { num: string; title: string; desc: string; detail: string }[];
  reviews: { author: string; role: string; group: string; text: string }[];
  gallery: { src: string; title: string; subtitle: string }[];
}

const SmartBusinessImage: React.FC<{
  src: string;
  fallbackSrc: string;
  alt: string;
}> = ({ src, fallbackSrc, alt }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [isPortraitOrSquare, setIsPortraitOrSquare] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setIsPortraitOrSquare(false);
  }, [src, fallbackSrc]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight / img.naturalWidth > 1.35) {
      setIsPortraitOrSquare(true);
    } else {
      setIsPortraitOrSquare(false);
    }
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsPortraitOrSquare(false);
    }
  };

  if (isPortraitOrSquare) {
    return (
      <div className="relative w-full h-full bg-zinc-950 overflow-hidden flex items-center justify-center">
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-50 saturate-150 pointer-events-none select-none"
        />
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          onError={handleError}
          className="relative z-10 max-h-full max-w-full w-auto h-full object-contain p-1.5 drop-shadow-2xl"
        />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onLoad={handleLoad}
      onError={handleError}
      className="w-full h-full object-cover"
    />
  );
};

function buildBaseSectorConfig(info: DynamicSiteInfo): SectorConfig {
  const name = info.n;
  const catLabel = info.c ? info.c.toLocaleUpperCase('tr-TR') : '';
  const combinedText = `${info.n} ${info.c || ''} ${info.q}`.toLocaleLowerCase('tr-TR');

  const isPizzaItalian =
    info.s === 'pizza_italian' ||
    /(pizza|pizzeria|margarita|margherita|calzone|trattoria|napoliten|italyan restoran)/i.test(combinedText);

  const isTraditionalDessert =
    !isPizzaItalian &&
    (info.s === 'traditional_dessert' ||
      /(tatlıcı|tatlici|bağdat tatlısı|bagdat tatlisi|baklava|künefe|kunefe|kadayıf|kadayif|şöbiyet|sobiyet|katmer|şerbetli tatlı)/i.test(
        combinedText
      ));

  const isBurgerStreetFood =
    !isPizzaItalian &&
    !isTraditionalDessert &&
    (info.s === 'burger_streetfood' ||
      /(burger|hamburger|cheeseburger|smash burger|street food|hot dog|çıtır tavuk)/i.test(combinedText));

  const isDonerTantuni =
    !isPizzaItalian &&
    !isTraditionalDessert &&
    !isBurgerStreetFood &&
    (info.s === 'doner_tantuni' ||
      /(döner|doner|iskender|tantuni|köfte|kofte|kokoreç|kokorec|cağ kebabı|dürümcü)/i.test(combinedText));

  const isSeafoodFish =
    !isPizzaItalian &&
    (info.s === 'seafood_fish' ||
      /(balık|balik|deniz ürün|midye|kalamar|karides|hamsi|levrek|çupra)/i.test(combinedText));

  const isBeautyHair =
    info.s === 'beauty_hair' ||
    /(kuaför|kuafor|berber|saç tasarım|sac tasarim|güzellik|guzellik|cilt bakım|lazer epilasyon|protez tırnak|nail art|ipek kirpik|makyaj)/i.test(
      combinedText
    );

  const isFitnessPilates =
    info.s === 'fitness_pilates' ||
    /(spor salonu|fitness|gym|pilates|reformer|yoga|crossfit|boks|kickboks)/i.test(combinedText);

  const isArchitectureRealEstate =
    info.s === 'architecture_real_estate' ||
    /(mimar|iç mimar|inşaat|insaat|müteahhit|gayrimenkul|emlak|konut|yapı|dekorasyon|avukat|hukuk|mali müşavir)/i.test(
      combinedText
    );

  // 0A. PİZZA & İTALYAN MUTFAĞI (ÖRN: SWEDEN PİZZA) — ASLA KEBAP/LAHMACUN YAZMAZ!
  if (isPizzaItalian) {
    return {
      eyebrow: catLabel || 'ARTİZAN PİZZA & İTALYAN MUTFAĞI',
      navActionLabel: 'Sipariş & Rezervasyon',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak günlük dinlendirilmiş ince ve çıtır hamurumuz, kendi mutfağımızda hazırladığımız taze domates ve özel pizza soslarımız, özenle seçilmiş gerçek peynir ve şarküteri ürünlerimizle gerçek pizza deneyimi sunuyoruz.`,
      aboutTitle: `${name} — Özgün Hamur, Taze Malzeme ve Gerçek Pizza Tutkusu`,
      aboutP1:
        info.bio ||
        `${name}, dondurulmuş veya fabrikasyon ürün kullanmadan, her sabah taze yoğrulan ve ideal sürede dinlendirilen özel pizza hamurunu günlük seçilen taze sebzeler, gerçek mozzarella ve seçkin et ürünleriyle buluşturmaktadır.`,
      aboutP2:
        'Kendi mutfağımızda günlük hazırladığımız özgün pizza soslarımız, ince ve çıtır tabanımız, doyurucu porsiyonlarımız ve ev yapımı tatlılarımızla hem sıcak salonumuzda hem de paket servisimizde aynı lezzeti koruyoruz.',
      hours: info.hr || 'Hafta İçi: 11:00 – 22:00 • Hafta Sonu: 12:00 – 22:00',
      headerBg: 'bg-stone-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/bakery.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Günlük Dinlendirilmiş Hamur', desc: 'Her gün taze hazırlanan, ince ve çıtır dokusuyla mideyi yormayan özel reçete pizza hamuru.' },
        { num: '02', title: 'Gerçek Peynir & Seçkin Malzeme', desc: 'Dondurulmuş ürün kullanmadan, günlük taze sebzeler, gerçek mozzarella ve seçkin şarküteri ürünleri.' },
        { num: '03', title: 'Ev Yapımı Özgün Soslar', desc: 'Malzemelerin lezzetini öne çıkaran taze domates sosu, fesleğenli soslar ve ev yapımı özel acı sos.' },
        { num: '04', title: 'Taze Fırından Sıcak Sunum', desc: 'Sipariş üzerine taş tabanda tam kıvamında fırınlanan 32 cm doyurucu pizzalar ve ev yapımı tiramisu.' },
      ],
      servicesSectionTitle: `${name} Öne Çıkan Pizza, Sos ve Tatlı Menümüz`,
      services: [
        { num: '01', title: 'Dört Peynirli Artizan Pizza', desc: 'İnce ve çıtır hamur üzerinde özenle dengelenmiş dört farklı gerçek peynir harmanıyla tam kıvamında fırınlanan imza lezzetimiz.', detail: 'İnce Çıtır Hamur • 4 Özel Peynir • Günlük Taze Hazırlık' },
        { num: '02', title: 'Ege & Taze Sebzeli Pizzalar', desc: 'Günlük seçilen taze kabak, patlıcan, zeytin, biber ve mevsim sebzeleriyle hazırlanan, sebzeyi en lezzetli haliyle sunan özel reçetemiz.', detail: 'Günlük Taze Sebze • Ege Reçetesi • Doğal Malzeme' },
        { num: '03', title: 'Klasik Margarita & Mozzarella', desc: 'Ev yapımı taze domates sosumuz, bol mozzarella peyniri ve taze fesleğen dokunuşuyla hazırlanan geleneksel İtalyan klasiği.', detail: 'Ev Yapımı Domates Sosu • Mozzarella • İnce Hamur' },
        { num: '04', title: 'Seçkin Etli & Karışık Pizzalar', desc: 'Dondurulmuş ürün kullanılmadan, tek tek seçilen kaliteli sucuk, füme et ve şarküteri ürünleriyle hazırlanan 32 cm doyurucu pizzalarımız.', detail: 'Seçkin Et Ürünleri • 32 cm Doyurucu Porsiyon • Bol Malzeme' },
        { num: '05', title: 'Ev Yapımı Özgün Soslar & Acı Sos', desc: 'Hamurun ve malzemelerin tadını bastırmadan yukarı taşıyan, kendi mutfağımızda günlük hazırladığımız özel pizza sosları ve ev yapımı acı sos.', detail: 'Kendi Üretimimiz • Dengeli & Taze • Özgün Reçete' },
        { num: '06', title: 'Ev Yapımı İtalyan Tiramisu & İçecekler', desc: 'Pizza keyfinizi taçlandıran günlük taze hazırlanmış tam kıvamında ev yapımı tiramisu ve soğuk-sıcak içecek çeşitlerimiz.', detail: 'Günlük Taze Tiramisu • Samimi Ortam • Paket & Salon Servisi' },
      ],
      reviews: [
        { author: 'Gökhan K.', role: 'Google Yorumu', group: 'Dört Peynirli & Ege Pizza', text: 'Hamuru incecik ve çıtır, malzemeleri son derece kaliteli ve taze. Özellikle dört peynirli ve sebzeli Ege pizzası Ankara’da yediğimiz en iyi pizzalardan.' },
        { author: 'Selin T.', role: 'Google Yorumu', group: 'Ev Yapımı Soslar & Tiramisu', text: 'Kendi yaptıkları acı sos ve pizza sosları harika, üzerine yediğimiz ev yapımı tiramisu da tam kıvamındaydı.' },
        { author: 'Mert Y.', role: 'Google Yorumu', group: 'Seçkin Etli Pizza', text: 'Fabrikasyon zincir pizzacılarla kıyaslanamayacak kadar doğal ve lezzetli. 32 cm porsiyonları oldukça doyurucu.' },
        { author: 'Zeynep D.', role: 'Google Yorumu', group: 'Mekan & Misafirperverlik', text: 'Sıcak, samimi ve tertemiz bir işletme. İşlerini severek yaptıkları her dilimde belli oluyor.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85', title: `${name} Artizan Pizza Sunumu`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=85', title: `${name} İnce & Çıtır Hamur Ustalığı`, subtitle: 'Günlük dinlendirilmiş hamur ve taze malzeme' },
        { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85', title: `${name} Özgün Soslar & Fırından Sıcak Lezzet`, subtitle: 'Ev yapımı soslar ve gerçek peynir kalitesi' },
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 0B. GELENEKSEL TATLICI / BAKLAVA / KÜNEFE / BAĞDAT TATLISI & LOKANTA
  if (isTraditionalDessert) {
    return {
      eyebrow: catLabel || 'GELENEKSEL TATLI, BAKLAVA & LEZZET MERKEZİ',
      navActionLabel: 'Sipariş & İletişim',
      servicesNavLabel: 'Tatlı & Lezzetler',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak yılların değişmeyen ustalığıyla günlük taze hazırlanan geleneksel şerbetli tatlılarımız, birinci sınıf Antep fıstıklı lezzetlerimiz ve özenli mutfağımızla misafirlerimizi ağırlıyoruz.`,
      aboutTitle: `${name} — Yılların Değişmeyen Geleneksel Tatlı ve Lezzet Ustalığı`,
      aboutP1:
        info.bio ||
        `${name}, doğal pancar şekeri, birinci sınıf tereyağı, bol Antep fıstığı ve incecik açılan çıtır hamur ustalığıyla her gün taze üretim yaparak geleneksel lezzet mirasını yaşatmaktadır.`,
      aboutP2:
        'İç baymayan dengeli şerbet kıvamımız, günlük taze üretimimiz ve güler yüzlü esnaflık anlayışımızla hem salonumuzda hem de kiloluk paket siparişlerinizde aynı yüksek kaliteyi sunuyoruz.',
      hours: info.hr || 'Her Gün: 08:30 – 22:00',
      headerBg: 'bg-stone-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/bakery.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Asırlık & Orijinal Tarif', desc: 'Nesilden nesile aktarılan ustalıkla her sabah günlük olarak hazırlanan çıtır ve taze tatlılar.' },
        { num: '02', title: 'Doğal Şerbet & Gerçek Malzeme', desc: 'Glikoz içermeyen doğal pancar şekeri şerbeti, sade tereyağı ve birinci sınıf Antep fıstığı.' },
        { num: '03', title: 'Günlük Sıcak Mutfak & İkram', desc: 'Tatlılarımızın yanı sıra günlük taze hazırlanan geleneksel lokanta ve mutfak spesiyallerimiz.' },
        { num: '04', title: 'Kiloluk Kutu & Paket Servis', desc: 'Misafir ağırlamaları, bayramlar ve kurumsal davetler için özel kutusunda taze paket servis.' },
      ],
      servicesSectionTitle: `${name} Öne Çıkan Tatlı ve Mutfak Lezzetlerimiz`,
      services: [
        { num: '01', title: 'Meşhur Fıstıklı Bağdat Tatlısı & Özel Tatlılar', desc: 'İncecik çıtır hamuru, hafif doğal şerbeti ve bol Antep fıstığıyla lokmalık olarak hazırlanan tescilli imza tatlımız.', detail: 'Orijinal Tarif • İnce Çıtır Hamur • Doğal Şeker' },
        { num: '02', title: 'Taş Fırın Baklava, Şöbiyet & Kadayıf', desc: 'El açması ince yufka, sade tereyağı ve bol fıstık-ceviz ile günlük üretilen geleneksel şerbetli tatlı çeşitlerimiz.', detail: 'El Açması Yufka • Sade Tereyağı • Günlük Taze' },
        { num: '03', title: 'Geleneksel Yaprak Döner & Lokanta', desc: `${name} mutfağında günlük taze etten hazırlanan sıcak yaprak döner porsiyon ve geleneksel lokanta lezzetlerimiz.`, detail: 'Günlük Taze Et • Usta Pişirim • Sıcak Sunum' },
        { num: '04', title: 'El Yapımı Günlük Çiğ Köfte & Spesiyaller', desc: 'Geleneksel usulde günlük olarak elde yoğrulan, taze yeşillik ve özel soslarla sunulan el yapımı lezzetlerimiz.', detail: 'El Yapımı • Günlük Yoğrulan • Doğal Baharat' },
        { num: '05', title: 'Kiloluk Kutu & Özel Davet Siparişleri', desc: 'Ev ve iş yeri ziyaretleriniz, bayramlar ve özel davetleriniz için özenle paketlenen kiloluk tatlı kutularımız.', detail: 'Özel Kutu Ambalaj • Toptan & Perakende • Taze Teslimat' },
        { num: '06', title: 'Salon İkramı & Hızlı Paket Servis', desc: 'Taze demleme çay eşliğinde nezih salon servisimiz ve bulunduğunuz konuma hızlı paket gönderimi.', detail: 'Nezih Aile Ortamı • Taze Çay • Hızlı Paket' },
      ],
      reviews: [
        { author: 'Ahmet B.', role: 'Google Yorumu', group: 'İmza Tatlı & Lezzet', text: 'Tatlısı o kadar hafif ve çıtır ki yedikçe yiyesiniz geliyor, şerbeti asla iç baymıyor. Yıllardır kalitesini koruyan gerçek bir lezzet durağı.' },
        { author: 'Meltem K.', role: 'Google Yorumu', group: 'Kiloluk Paket & Tazelik', text: 'Misafirliğe giderken sürekli kiloluk olarak alıyoruz. Her zaman günlük, taze ve bol fıstıklı.' },
        { author: 'Serdar T.', role: 'Google Yorumu', group: 'Döner & Tatlı', text: 'Hem yemekleri hem de üzerine yediğimiz meşhur tatlısı 10 numara. Esnaflıkları ve temizliği örnek alınacak seviyede.' },
        { author: 'Ayşe Y.', role: 'Google Yorumu', group: 'Geleneksel Tarif', text: 'Gerçek şekerle yapıldığı ilk lokmada anlaşılıyor, mideyi hiç rahatsız etmiyor. Herkese tavsiye ederim.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1000&q=85', title: `${name} Günlük Taze Tatlı Sunumu`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=85', title: `${name} Fıstıklı & Çıtır Geleneksel Lezzetler`, subtitle: 'Doğal pancar şekeri ve birinci sınıf malzeme' },
        { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85', title: `${name} Usta İşçilik & Günlük Üretim`, subtitle: 'Her sabah taze çıkan tepsi lezzetleri' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 0C. GURME BURGER & STREET FOOD
  if (isBurgerStreetFood) {
    return {
      eyebrow: catLabel || 'EL YAPIMI GURME BURGER & STREET FOOD',
      navActionLabel: 'Sipariş & Konum',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak günlük çekilen %100 dana kaburga kıyması, her sabah fırından çıkan taze brioche burger ekmeklerimiz, özel reçete soslarımız ve çıtır atıştırmalıklarımızla gerçek gurme burger deneyimi sunuyoruz.`,
      aboutTitle: `${name} — %100 Dana Eti, Günlük Brioche Ekmek ve İmza Soslar`,
      aboutP1:
        info.bio ||
        `${name}, dondurulmuş köfte kullanmadan günlük olarak hazırlanan %100 dana burger köftelerini, el yapımı karamelize soğan, füme et ve kendi üretimi özel soslarla buluşturmaktadır.`,
      aboutP2: 'Döküm ızgarada tam kıvamında mühürlenen sulu burgerlerimiz, kajun baharatlı çıtır patateslerimiz ve enerjik atmosferimizle lezzet tutkunlarını ağırlıyoruz.',
      hours: info.hr || 'Her Gün: 11:30 – 23:30',
      headerBg: 'bg-zinc-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/restaurant.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Günlük Çekim %100 Dana Eti', desc: 'Katkısız ve dondurulmamış dinlendirilmiş dana kaburga etinden günlük hazırlanan sulu burger köfteleri.' },
        { num: '02', title: 'Taze Brioche Burger Ekmeği', desc: 'Her sabah günlük fırınlanan tereyağlı, yumuşacık el yapımı burger ekmekleri.' },
        { num: '03', title: 'El Yapımı İmza Soslar', desc: 'Trüflü mayonez, özel burger sosu, barbekü ve acı soslarımızla katmanlı lezzet.' },
        { num: '04', title: 'Sıcak & Çıtır Servis', desc: 'Kajun baharatlı patates kızartması ve çıtır tavuklarla doyurucu menüler.' },
      ],
      servicesSectionTitle: `${name} Gurme Burger ve Atıştırmalık Menümüz`,
      services: [
        { num: '01', title: 'Klasik & Double Cheeseburger', desc: '%100 dana burger köftesi, çift kat eritilmiş cheddar peyniri, karamelize soğan, turşu ve özel burger sosu.', detail: '%100 Dana Eti • Çift Cheddar • Brioche Ekmek' },
        { num: '02', title: 'Smash Burger & Füme Etli Burgerler', desc: 'Döküm ızgarada çıtır karamelize kabuklu smash köfte, dana füme kaburga ve cheddar peyniri.', detail: 'Smash Tekniği • Dana Füme • Yoğun Lezzet' },
        { num: '03', title: 'Mantarlı & Trüf Soslu Gurme Burger', desc: 'Sote kültür mantarı, karamelize soğan, eritilmiş peynir ve özel trüflü sos ile hazırlanan gurme lezzet.', detail: 'Sote Mantar • Özel Sos • Günlük Hazırlık' },
        { num: '04', title: 'Çıtır Tavuk Burger & Tenders', desc: 'Özel baharatlı kaplamasıyla dışı çıtır, içi sulu tavuk göğsü dilimleri ve taze coleslaw salata.', detail: 'Özel Kaplama • Çıtır Tavuk • Taze Soslar' },
        { num: '05', title: 'Kajun Baharatlı Patates & Yan Lezzetler', desc: 'Özel baharat harmanlı çıtır patates kızartması, cheddar soslu patates ve soğan halkaları.', detail: 'Kajun Baharatı • Cheddar Sos • Sıcak Sunum' },
        { num: '06', title: 'Ev Yapımı Soslar & Soğuk İçecekler', desc: 'Burger keyfinizi tamamlayan el yapımı dip soslar, soğuk meşrubatlar ve hızlı paket servis.', detail: 'El Yapımı Dip Sos • Hızlı Paket • Doyurucu Menü' },
      ],
      reviews: [
        { author: 'Caner K.', role: 'Google Yorumu', group: 'Smash Burger & Patates', text: 'Ekmeği yumuşacık, eti tam kıvamında sulu ve lezzetli. Kajun patatesleri ve kendi yaptıkları soslar harika.' },
        { author: 'Ece T.', role: 'Google Yorumu', group: 'Cheeseburger Menüsü', text: 'Gerçek et tadı alabileceğiniz, porsiyonları gayet doyurucu ve tertemiz bir gurme burgerci.' },
        { author: 'Burak M.', role: 'Google Yorumu', group: 'Füme Burger', text: 'Füme etli ve karamelize soğanlı burgeri favorimiz oldu. Paket serviste bile sıcacık geliyor.' },
        { author: 'Emre S.', role: 'Google Yorumu', group: 'Lezzet & Servis', text: 'Malzeme kalitesinden hiç ödün vermiyorlar, çalışanlar çok ilgili ve servis çok hızlı.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85', title: `${name} Gurme Burger Sunumu`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=85', title: `${name} %100 Dana Burger & Çıtır Patates`, subtitle: 'Günlük çekim et ve taze brioche ekmek' },
        { src: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=85', title: `${name} Döküm Izgara & Özel Soslar`, subtitle: 'Sipariş üzerine sıcak mühürlenen lezzetler' },
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 0D. YAPRAK DÖNER / İSKENDER / KÖFTE / TANTUNİ
  if (isDonerTantuni) {
    return {
      eyebrow: catLabel || 'YAPRAK DÖNER, İSKENDER & KÖFTE MERKEZİ',
      navActionLabel: 'Sipariş & Rezervasyon',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak özel marine edilmiş sinirsiz etten ustalıkla hazırlanan gerçek yaprak dönerimiz, halis tereyağlı İskenderimiz, ızgara kasap köftemiz ve zengin ikramlarımızla hizmetinizdeyiz.`,
      aboutTitle: `${name} — Gerçek Yaprak Döner ve Usta İşi Izgara Lezzetleri`,
      aboutP1:
        info.bio ||
        `${name}, kıyma karıştırmadan %100 yaprak etten günlük olarak dizilen döneri ve doğal baharatlarla yoğrulan kasap köftesini geleneksel pişirme ustalığıyla sunmaktadır.`,
      aboutP2: 'Sıcak tırnak pidemiz, halis tereyağımız, doğal tava yoğurdumuz ve bol köpüklü yayık ayranımızla hem aile salonumuzda hem de paket servisimizde doyurucu lezzetler hazırlıyoruz.',
      hours: info.hr || 'Her Gün: 10:30 – 22:00',
      headerBg: 'bg-stone-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/restaurant.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: '%100 Gerçek Yaprak Et', desc: 'Sinirlerinden arındırılmış seçkin dana ve kuzu etinden günlük dizilen katkısız yaprak döner.' },
        { num: '02', title: 'Halis Tereyağı & Tırnak Pide', desc: 'Fırından sıcak çıkan tırnak pide ve lavaş üzerinde cızırdayan gerçek tereyağı lezzeti.' },
        { num: '03', title: 'Izgara Köfte & Yöresel Tatlar', desc: 'Günlük taze çekilen kasap köfte, tantuni ve geleneksel sıcak başlangıçlar.' },
        { num: '04', title: 'Hızlı Servis & Zengin İkram', desc: 'Mevsim salata, ezme, turşu ve yemek sonrası taze demleme çay ikramı.' },
      ],
      servicesSectionTitle: `${name} Öne Çıkan Döner, İskender ve Izgara Menümüz`,
      services: [
        { num: '01', title: 'Porsiyon & Pilav Üstü Yaprak Döner', desc: 'İncecik kesilen sıcak yaprak döner; tereyağlı pirinç pilavı, kızarmış patates, köz biber ve sıcak lavaş eşliğinde.', detail: '%100 Yaprak Döner • Bol Porsiyon • Sıcak Lavaş' },
        { num: '02', title: 'Tereyağlı İskender Kebap', desc: 'Küp doğranmış sıcak tırnak pidesi üzerinde yaprak döner, özel domates sosu, kızgın tereyağı ve tava yoğurdu.', detail: 'Halis Tereyağı • Tırnak Pide • Tava Yoğurdu' },
        { num: '03', title: 'Lavaş Dürüm, Gobit & Tombik Döner', desc: 'Fırından yeni çıkmış tombik pide veya sıcak lavaş arasında bol malzemeli yaprak döner lezzetleri.', detail: 'Sıcak Tombik Pide • Çift Lavaş • Hızlı Servis' },
        { num: '04', title: 'Izgara Kasap Köfte & Piyaz', desc: 'Özel baharatlarla günlük hazırlanan sulu ızgara köfte, közlenmiş domates-biber ve geleneksel piyaz.', detail: 'Günlük Kasap Köfte • Köz Garnitür • Geleneksel Piyaz' },
        { num: '05', title: 'Günün Sıcak Çorbası & Salata İkramları', desc: 'Yemek öncesi sıcak süzme mercimek çorbası ve masanıza ücretsiz sunulan taze meze-salata çeşitleri.', detail: 'Süzme Mercimek • Taze Yeşillik • Turşu & Ezme' },
        { num: '06', title: 'Yayık Ayranı, Tatlılar & Paket Servis', desc: 'Bol köpüklü yayık ayranı, yemek sonrası fırın sütlaç-künefe ve adresinize sıcak paket servis.', detail: 'Bol Köpüklü Ayran • Fırın Sütlaç • Hızlı Paket' },
      ],
      reviews: [
        { author: 'Murat K.', role: 'Google Yorumu', group: 'Yaprak Döner & İskender', text: 'Eti gerçekten sinirsiz ve tam kıvamında pişmiş gerçek yaprak döner. Tereyağlı İskenderi ve ikramları çok başarılı.' },
        { author: 'Serkan Y.', role: 'Google Yorumu', group: 'Tombik Döner & Ayran', text: 'Sıcak tombik ekmek arası döneri ve köpüklü ayranı efsane. Öğle yemeklerinde tek adresimiz.' },
        { author: 'Hakan T.', role: 'Google Yorumu', group: 'Izgara Köfte', text: 'Köftesi ve döneri çok lezzetli, porsiyonları doyurucu. Mekan tertemiz ve servis çok hızlı.' },
        { author: 'Fatih D.', role: 'Google Yorumu', group: 'Aile Salonu & Hizmet', text: 'Güler yüzlü esnaflık, kaliteli et ve uygun fiyat. Ailecek güvenle yemek yediğimiz nezih bir yer.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85', title: `${name} Yaprak Döner & Sıcak Sunum`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: 'Ferah ve hijyenik aile salonu' },
        { src: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=1000&q=85', title: `${name} Usta Pişirim & Zengin İkramlar`, subtitle: 'Günlük taze et ve sıcak pide' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85', title: `${name} Misafir Ağırlama`, subtitle: info.a },
      ],
    };
  }

  // 0E. BALIK & DENİZ ÜRÜNLERİ RESTORANI
  if (isSeafoodFish) {
    return {
      eyebrow: catLabel || 'TAZE BALIK & DENİZ ÜRÜNLERİ RESTORANI',
      navActionLabel: 'Rezervasyon & Sipariş',
      servicesNavLabel: 'Deniz Menüsü',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak günlük taze mevsim balıkları, usta ellerde hazırlanan deniz mahsulleri, zengin Ege mezeleri ve sıcak helva keyfiyle misafirlerimizi ağırlıyoruz.`,
      aboutTitle: `${name} — Günlük Taze Mevsim Balıkları ve Usta Pişirim`,
      aboutP1:
        info.bio ||
        `${name}, denizden sofranıza günlük ulaşan taze mevsim balıklarını ızgara, tava ve fırın pişirme teknikleriyle kılçıksız ve tam kıvamında hazırlamaktadır.`,
      aboutP2: 'Günlük hazırlanan soğuk deniz mezelerimiz, kalamar ve karides güveçlerimiz, taze roka-mısır ekmeği ikramımız ve sıcak fırın helvamızla eksiksiz bir balık sofrası sunuyoruz.',
      hours: info.hr || 'Her Gün: 11:00 – 23:00',
      headerBg: 'bg-slate-950/95 border-sky-500/20',
      headerText: 'text-white',
      headerSub: 'text-sky-400',
      navLink: 'text-slate-300 hover:text-sky-400',
      ctaBtn: 'bg-sky-600 hover:bg-sky-500 text-white',
      heroBg: 'bg-slate-950',
      heroLine: 'bg-sky-500',
      heroEyebrow: 'text-sky-400',
      accentText: 'text-sky-600',
      videoSrc: '/videos/restaurant.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Günlük Taze Deniz Balıkları', desc: 'Her sabah halden özenle seçilen taze mevsim balıkları ve deniz ürünleri.' },
        { num: '02', title: 'Izgara, Tava & Buğulama', desc: 'Balığın lezzetini ve suyunu koruyan usta işi ızgara, mısır unlu tava ve kiremitte fırın pişirim.' },
        { num: '03', title: 'Zengin Salata & Mezeler', desc: 'Taze roka salatası, zeytinyağlı Ege mezeleri ve sıcak mısır ekmeği.' },
        { num: '04', title: 'Fırında Sıcak Tahin Helvası', desc: 'Balık keyfinin ardından güveçte sıcak fırın helvası ve demleme çay ikramı.' },
      ],
      servicesSectionTitle: `${name} Günlük Taze Balık ve Deniz Ürünleri Menümüz`,
      services: [
        { num: '01', title: 'Izgara Levrek, Çupra & Somon', desc: 'Kömür ateşinde tam kıvamında pişirilen günlük taze levrek, çupra ve Norveç somon porsiyonlarımız.', detail: 'Kömür Izgara • Günlük Taze • Kılçıksız Fileto Seçeneği' },
        { num: '02', title: 'Mısır Unlu Hamsi, İstavrit & Mezgit Tava', desc: 'Altın sarısı çıtırlıkta, hiç yağ çekmeden pişirilen günlük taze hamsi, mezgit, barbun ve istavrit tava.', detail: 'Çıtır Mısır Unu • Hafif Pişirim • Sıcak Sunum' },
        { num: '03', title: 'Tereyağlı Karides Güveç & Kalamar Tava', desc: 'Sarımsak ve tereyağı ile güveçte fokurdayan karides ve özel tarator soslu yumuşacık kalamar tava.', detail: 'Güveçte Karides • Taratorlu Kalamar • Ara Sıcaklar' },
        { num: '04', title: 'Balık Ekmek & Kılçıksız Dürüm', desc: 'Taze yeşillik, kırmızı soğan ve özel sosla hazırlanan doyurucu ızgara balık ekmek ve dürüm.', detail: 'Kılçıksız Fileto • Sıcak Ekmek • Hızlı Servis' },
        { num: '05', title: 'Zeytinyağlı Mezeler & Roka Salatası', desc: 'Balığın yanına en çok yakışan taze roka-soğan salatası, deniz börülcesi, fava ve mısır ekmeği.', detail: 'Ege Mezeleri • Taze Roka • Mısır Ekmeği' },
        { num: '06', title: 'Güveçte Sıcak Helva & Paket Servis', desc: 'Yemek sonrası fırından sıcak çıkan fındıklı tahin helvası ve evinize sıcak pişmiş balık servisi.', detail: 'Fırında Helva • Aile Salonu • Pişmiş Paket Servis' },
      ],
      reviews: [
        { author: 'Kemal Y.', role: 'Google Yorumu', group: 'Izgara Levrek & Mezgit', text: 'Balıklar her zaman günlük ve çok taze. Pişirme kıvamı, yanındaki roka salatası ve sıcak mısır ekmeği harika.' },
        { author: 'Deniz A.', role: 'Google Yorumu', group: 'Karides Güveç & Helva', text: 'Tereyağlı karides güveci ve yemek üstüne gelen fırında sıcak helvası tek kelimeyle mükemmel.' },
        { author: 'Sinan K.', role: 'Google Yorumu', group: 'Hamsi Tava', text: 'Hiç yağ çekmeden çıtır çıtır pişiriyorlar, içeride ağır balık kokusu bile yok, çok temiz bir aile mekanı.' },
        { author: 'Pınar T.', role: 'Google Yorumu', group: 'Aile Salonu & Hizmet', text: 'Güler yüzlü servis, taze balık ve makul fiyatlar. Ailecek balık yemek için tek tercihimiz.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85', title: `${name} Günlük Taze Balık Reyonu & Izgara`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85', title: `${name} Deniz Ürünleri & Ara Sıcaklar`, subtitle: 'Usta ellerde hazırlanan taze deniz lezzetleri' },
        { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85', title: `${name} Zengin Salata & Meze Sofrası`, subtitle: 'Mevsim yeşillikleri ve sıcak fırın helvası' },
        { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85', title: `${name} Aile Salonu`, subtitle: info.a },
      ],
    };
  }

  // 0F. KUAFÖR / BERBER / GÜZELLİK & BAKIM STÜDYOSU
  if (isBeautyHair) {
    return {
      eyebrow: catLabel || 'SAÇ TASARIM, GÜZELLİK & KİŞİSEL BAKIM STÜDYOSU',
      navActionLabel: 'Randevu Al',
      servicesNavLabel: 'Uygulamalar',
      galleryNavLabel: 'Stüdyomuz',
      heroSubtitle: `${name} olarak profesyonel saç kesim ve renklendirme, cilt bakımı, kalıcı oje & protez tırnak, ipek kirpik ve kişisel bakım uygulamalarını hijyenik stüdyomuzda uzman ekibimizle sunuyoruz.`,
      aboutTitle: `${name} — Modern Saç Tasarım ve Kişisel Bakım Stüdyosu`,
      aboutP1:
        info.bio ||
        `${name}, dünyaca ünlü profesyonel kozmetik ürünleri, kişiye özel anatomik saç-yüz analizi ve üst düzey hijyen standartlarıyla güzellik ve bakım hizmeti sunmaktadır.`,
      aboutP2: 'Deneyimli uzman kadromuzla saç sağlığınızı ve doğal görünümünüzü koruyarak, tarzınıza en çok yakışan modern dokunuşları gerçekleştiriyoruz.',
      hours: info.hr || 'Salı – Pazar: 09:00 – 20:00',
      headerBg: 'bg-zinc-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/corporate.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Kişiye Özel Tasarım', desc: 'Yüz hatlarınıza ve yaşam tarzınıza en uygun saç kesim, renklendirme ve bakım analizi.' },
        { num: '02', title: 'Birinci Sınıf Ürünler', desc: 'Saç ve cilt sağlığını koruyan orijinal, profesyonel dünya markası bakım serileri.' },
        { num: '03', title: 'Steril & Hijyenik Ekipman', desc: 'Her misafirimiz öncesi UV ve otoklav ile sterilize edilen kişisel bakım ekipmanları.' },
        { num: '04', title: 'Randevulu Konforlu Hizmet', desc: 'Beklemeden, size ayrılan özel zaman diliminde özenli ve keyifli bakım deneyimi.' },
      ],
      servicesSectionTitle: `${name} Saç Tasarım, Güzellik ve Bakım Hizmetlerimiz`,
      services: [
        { num: '01', title: 'Anatomik Saç Kesimi & Şekillendirme', desc: 'Yüz tipinize özel modern saç kesimi, fön, maşa, özel gün topuz ve profesyonel şekillendirme.', detail: 'Kişiye Özel Kesim • Modern Stil • Profesyonel Fön' },
        { num: '02', title: 'Ombre, Sombre, Balyaj & Renklendirme', desc: 'Saç yıpranmasını önleyen koruyucu bakımlar eşliğinde doğal geçişli ombre, sombre ve dip boya işlemleri.', detail: 'Doğal Geçişler • Saç Koruma • Uzman Renk Analizi' },
        { num: '03', title: 'Keratin Bakım & Saç Botoksu', desc: 'Yıpranmış ve nemini kaybetmiş saçları kökten uca onaran, parlaklık ve yumuşaklık kazandıran keratin bakımı.', detail: 'Yoğun Onarım • İpeksi Parlaklık • Uzun Süreli Etki' },
        { num: '04', title: 'Protez Tırnak, Kalıcı Oje & Manikür', desc: 'Steril koşullarda medikal el-ayak bakımı, jel güçlendirme, protez tırnak ve nail art tasarımları.', detail: 'Steril Manikür • Kalıcı Oje • Nail Art' },
        { num: '05', title: 'Cilt Bakımı, İpek Kirpik & Kaş Tasarımı', desc: 'Altın oran kaş alımı, kirpik lifting, ipek kirpik ve profesyonel nem-leke karşıtı cilt bakımı.', detail: 'Altın Oran Kaş • Kirpik Lifting • Hydrafacial Bakım' },
        { num: '06', title: 'Gelin Saçı, Makyaj & VIP Paketler', desc: 'Düğün, nişan ve özel davetleriniz için profesyonel porselen makyaj ve özel gün saç tasarımı.', detail: 'Profesyonel Makyaj • Gelin Paketi • Özel Randevu' },
      ],
      reviews: [
        { author: 'Büşra K.', role: 'Google Yorumu', group: 'Ombre & Saç Kesimi', text: 'Saçlarımı hiç yıpratmadan tam istediğim doğal tonda renklendirme yaptılar. Kesimi ve ilgileri gerçekten harika.' },
        { author: 'Gizem T.', role: 'Google Yorumu', group: 'Keratin Bakım & Fön', text: 'İçeri girdiğiniz andan itibaren çok güler yüzlü ve profesyonel bir ekiple karşılaşıyorsunuz. Kullandıkları ürünler çok kaliteli.' },
        { author: 'Seda Y.', role: 'Google Yorumu', group: 'Manikür & Kalıcı Oje', text: 'Hijyen konusunda çok titizler, tüm aletler steril paketinden açılıyor. Gönül rahatlığıyla tavsiye ederim.' },
        { author: 'Ceren M.', role: 'Google Yorumu', group: 'Saç Tasarım', text: 'Yıllardır başka yere gitmiyorum, her seferinde salondan çok mutlu ayrılıyorum.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85', title: `${name} Saç Tasarım & Bakım Stüdyosu`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85', title: `${name} Profesyonel Renklendirme & Bakım`, subtitle: 'Dünya markası ürünlerle sağlıklı saçlar' },
        { src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=85', title: `${name} Kişisel Bakım & Steril Uygulama`, subtitle: 'Kişiye özel randevulu hizmet' },
        { src: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1000&q=85', title: `${name} Konforlu Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 0G. SPOR SALONU / PİLATES / FİTNESS STÜDYOSU
  if (isFitnessPilates) {
    return {
      eyebrow: catLabel || 'SPOR SALONU, REFORMER PİLATES & FİTNESS MERKEZİ',
      navActionLabel: 'Üyelik & Deneme Dersi',
      servicesNavLabel: 'Programlar',
      galleryNavLabel: 'Salonumuz',
      heroSubtitle: `${name} olarak modern antrenman ekipmanlarımız, uzman eğitmen kadromuz, kişiye özel egzersiz programlarımız ve ferah stüdyomuzla sağlıklı ve güçlü bir yaşam için yanınızdayız.`,
      aboutTitle: `${name} — Profesyonel Eğitmenler Eşliğinde Bilimsel Antrenman`,
      aboutP1:
        info.bio ||
        `${name}, her seviyeden üyemizin hedeflerine güvenle ulaşması için vücut analizi, kişiye özel antrenman planlaması ve birebir eğitmen takibi sunmaktadır.`,
      aboutP2: 'Yüksek tavanlı ferah çalışma alanlarımız, hijyenik soyunma odalarımız ve motivasyonu yüksek atmosferimizle sporu yaşam tarzınıza dönüştürüyoruz.',
      hours: info.hr || 'Hafta İçi: 07:00 – 22:30 • Hafta Sonu: 09:00 – 20:00',
      headerBg: 'bg-zinc-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/corporate.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Uzman Antrenör Kadrosu', desc: 'Sertifikalı eğitmenlerle doğru form, sakatlık önleyici ve sonuç odaklı çalışma.' },
        { num: '02', title: 'Modern Ekipman Parkuru', desc: 'Yeni nesil kardiyo, serbest ağırlık, fonksiyonel antrenman ve reformer pilates ekipmanları.' },
        { num: '03', title: 'Vücut Analizi & Takip', desc: 'Düzenli kas-yağ ölçümü ve hedefe göre güncellenen kişisel antrenman programı.' },
        { num: '04', title: 'Hijyenik & Ferah Stüdyo', desc: 'Güçlü havalandırma sistemi, tertemiz ekipmanlar ve konforlu dinlenme alanları.' },
      ],
      servicesSectionTitle: `${name} Antrenman ve Stüdyo Programlarımız`,
      services: [
        { num: '01', title: 'Fitness & Vücut Geliştirme', desc: 'Kas kütlesi artışı, sıkılaşma ve kondisyon gelişimi için modern makinelerle programlı antrenman.', detail: 'Kişisel Program • Modern Ekipman • Eğitmen Desteği' },
        { num: '02', title: 'Aletli Pilates (Reformer & Cadillac)', desc: 'Duruş bozukluklarını düzelten, esneklik ve core kuvveti kazandıran birebir veya düet reformer pilates dersleri.', detail: 'Reformer Pilates • Postür Analizi • Birebir Ders' },
        { num: '03', title: 'Personal Training (Birebir Özel Ders)', desc: 'Hedefinize en kısa ve güvenli yoldan ulaşmanız için antrenör eşliğinde birebir özel antrenman.', detail: '1-e-1 Koçluk • Vücut Analizi • Maksimum Verim' },
        { num: '04', title: 'Fonksiyonel Antrenman & Kardiyo', desc: 'Yağ yakımını hızlandıran, dayanıklılık ve çeviklik geliştiren yüksek enerjili fonksiyonel egzersizler.', detail: 'Yağ Yakımı • Yüksek Kondisyon • Dinamik Parkur' },
        { num: '05', title: 'Grup Dersleri & Esneklik Çalışmaları', desc: 'Motivasyonu artıran mat pilates, yoga, spinning ve grup kondisyon seansları.', detail: 'Grup Motivasyonu • Esneklik • Enerjik Atmosfer' },
        { num: '06', title: 'Beslenme Yönlendirmesi & Ölçüm Takibi', desc: 'Aylık profesyonel vücut kompozisyonu ölçümü ve antrenmanınızı destekleyen beslenme rehberliği.', detail: 'Aylık Ölçüm • Gelişim Takibi • Sağlıklı Yaşam' },
      ],
      reviews: [
        { author: 'Mert A.', role: 'Google Yorumu', group: 'Fitness & Personal Training', text: 'Ekipmanlar çok yeni ve salon her zaman tertemiz. Hocalar her hareketin doğru formunu gösteriyor, çok ilgili bir ekip.' },
        { author: 'Zeynep K.', role: 'Google Yorumu', group: 'Reformer Pilates', text: 'Sırt ve bel ağrılarım için başladığım reformer derslerinden inanılmaz memnun kaldım. Stüdyo çok ferah.' },
        { author: 'Can B.', role: 'Google Yorumu', group: 'Salon & Atmosfer', text: 'Havalandırması, soyunma odalarının temizliği ve nezih ortamıyla bölgedeki en kaliteli spor salonu.' },
        { author: 'Elif T.', role: 'Google Yorumu', group: 'Birebir Antrenman', text: 'Düzenli ölçüm ve program takibi sayesinde 3 ayda hedefime ulaştım. Tüm hocalara teşekkürler.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85', title: `${name} Antrenman & Fitness Alanı`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85', title: `${name} Reformer Pilates & Stüdyo`, subtitle: 'Uzman eğitmenlerle birebir ve grup dersleri' },
        { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=85', title: `${name} Modern Ekipman Parkuru`, subtitle: 'Hijyenik ve ferah spor ortamı' },
        { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=85', title: `${name} Fonksiyonel Çalışma Alanı`, subtitle: info.a },
      ],
    };
  }

  // 0H. MİMARLIK / İNŞAAT / GAYRİMENKUL / HUKUK / DANIŞMANLIK
  if (isArchitectureRealEstate) {
    return {
      eyebrow: catLabel || 'MİMARLIK, İNŞAAT & GAYRİMENKUL DANIŞMANLIĞI',
      navActionLabel: 'Randevu & Teklif',
      servicesNavLabel: 'Hizmetlerimiz',
      galleryNavLabel: 'Projelerimiz',
      heroSubtitle: `${name} olarak mimari tasarım, anahtar teslim inşaat ve tadilat uygulamaları, profesyonel gayrimenkul yatırım danışmanlığı ve kurumsal proje yönetiminde güvenilir çözümler sunuyoruz.`,
      aboutTitle: `${name} — Güven, Estetik ve Profesyonel Proje Yönetimi`,
      aboutP1:
        info.bio ||
        `${name}, mühendislik ve mimari standartları şeffaf iş yönetimiyle birleştirerek konut, ticari alan, dekorasyon ve gayrimenkul süreçlerinde yüksek katma değer üretmektedir.`,
      aboutP2: 'Sözleşmeli, zamanında teslim ve doğru bütçe planlaması ilkelerimizle tüm yatırımlarınızda ve yaşam alanı projelerinizde yanınızdayız.',
      hours: info.hr || 'Pazartesi – Cumartesi: 09:00 – 19:00',
      headerBg: 'bg-zinc-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/corporate.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Uzman Proje & Danışmanlık', desc: 'Mimari, teknik ve hukuki süreçlerde deneyimli kadro ile eksiksiz planlama.' },
        { num: '02', title: 'Şeffaf Sözleşme & Bütçe', desc: 'Başlangıçtan teslimata kadar sürpriz maliyetlere yer vermeyen net ve yazılı süreç yönetimi.' },
        { num: '03', title: 'Birinci Sınıf İşçilik', desc: 'Standartlara uygun malzeme seçimi ve titiz saha denetimi ile uzun ömürlü uygulamalar.' },
        { num: '04', title: 'Doğru Yatırım & Değerleme', desc: 'Bölge hakimiyeti ve gerçek piyasa verileriyle yüksek kazançlı gayrimenkul ve proje çözümleri.' },
      ],
      servicesSectionTitle: `${name} Proje, Uygulama ve Danışmanlık Hizmetlerimiz`,
      services: [
        { num: '01', title: 'Mimari Tasarım & İç Mimarlık', desc: 'Konut, ofis ve ticari mekanlar için 3D görselleştirme, fonksiyonel yerleşim ve modern iç mimari projelendirme.', detail: '3D Tasarım • İç Mimari • Fonksiyonel Planlama' },
        { num: '02', title: 'Anahtar Teslim İnşaat & Tadilat', desc: 'Mutfak, banyo ve komple daire/iş yeri yenileme işlemlerinin sözleşmeli ve anahtar teslim uygulanması.', detail: 'Anahtar Teslim • Garantili İşçilik • Zamanında Teslim' },
        { num: '03', title: 'Gayrimenkul Alım, Satım & Kiralama', desc: 'Konut, ticari mülk ve arsa yatırımlarınızda doğru ekspertiz, profesyonel sunum ve güvenli tapu süreci.', detail: 'Ekspertiz • Güvenli Tapu • Geniş Portföy' },
        { num: '04', title: 'Kurumsal Proje & Yatırım Danışmanlığı', desc: 'Yatırımcılar ve işletmeler için fizibilite analizi, değerleme ve stratejik süreç danışmanlığı.', detail: 'Fizibilite • Değerleme • Kurumsal Çözüm' },
        { num: '05', title: 'Özel Mobilya & Dekorasyon Uygulamaları', desc: 'Mekana özel ölçü mutfak dolabı, vestiyer, banyo ve ticari teşhir üniteleri tasarımı ve montajı.', detail: 'Özel Ölçü Üretim • Birinci Sınıf Malzeme • Montaj' },
        { num: '06', title: 'Süreç Takibi & Resmi İşlemler', desc: 'Ruhsat, abonelik, tapu ve uygulama denetim süreçlerinin uzman ekibimizce baştan sona yürütülmesi.', detail: 'Resmi Süreç Takibi • Şeffaf Raporlama • Tam Güvence' },
      ],
      reviews: [
        { author: 'Serhat K.', role: 'Google Yorumu', group: 'Tadilat & İç Mimari', text: 'Evimizin komple tadilatını söz verdikleri tarihte ve çok temiz bir işçilikle teslim ettiler. Süreç boyunca her aşamayı paylaştılar.' },
        { author: 'Onur T.', role: 'Google Yorumu', group: 'Gayrimenkul & Danışmanlık', text: 'Dürüst, şeffaf ve bölgeye çok hakim bir ekip. Yatırım sürecimizde tüm detaylarla profesyonelce ilgilendiler.' },
        { author: 'Neslihan Y.', role: 'Google Yorumu', group: 'Proje & Tasarım', text: 'Hem tasarım vizyonları hem de malzeme kaliteleri çok üst düzeyde. Gönül rahatlığıyla tavsiye ederim.' },
        { author: 'Ahmet M.', role: 'Google Yorumu', group: 'Kurumsal Hizmet', text: 'Güvenilir yaklaşımları ve çözüm odaklı çalışmaları için tüm ekibe teşekkür ederiz.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85', title: `${name} Mimari & Kurumsal Projeler`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85', title: `${name} İç Mimari & Ofis Tasarımı`, subtitle: 'Estetik ve fonksiyonel yaşam alanları' },
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85', title: `${name} Konut & Anahtar Teslim Uygulama`, subtitle: 'Birinci sınıf malzeme ve garantili işçilik' },
        { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85', title: `${name} Danışmanlık & Merkez Ofis`, subtitle: info.a },
      ],
    };
  }

  const isAutoDetailing =
    info.s === 'auto_detailing' ||
    (info.s === 'corporate_editorial' &&
      /(garage|garaj|detailing|pasta cila|seramik kaplama|elmas kaplama|ppf|kaput filmi|araç kaplama|arac kaplama|cam filmi|boyasız göçük|boyasiz gocuk|jant boyama|bodykit|oto kuaför|oto kuafor|car care)/i.test(
        combinedText
      ));

  const hasExplicitBorekOrBakery =
    !isAutoDetailing &&
    /(börek|borek|poğaça|pogaca|simit|fırın|firin|unlu mam|baklava|künefe|gözleme)/i.test(combinedText);
  const isCafe =
    !isAutoDetailing &&
    !hasExplicitBorekOrBakery &&
    (info.s === 'cafe_dessert' ||
      (info.s === 'corporate_editorial' &&
        /(kafe|cafe|kahve|coffe|espresso|latte|patisserie|pastane|magnolia|profiterol|tiramisu|cheesecake|san sebastian|tatlı|tatli|yaş pasta|dilim pasta|waffle|dondurma|çikolata|cikolata)/i.test(
          combinedText
        )));
  const isBakery =
    !isAutoDetailing &&
    !isCafe &&
    (info.s === 'bakery_breakfast' ||
      (info.s === 'corporate_editorial' &&
        /(börek|borek|poğaça|pogaca|simit|kahvaltı|kahvalti|fırın|firin|unlu|pastane|baklava|künefe|gözleme|mantı|ekmek)/i.test(
          combinedText
        )));
  const isSoupPlace =
    !isAutoDetailing &&
    !isBakery &&
    !isCafe &&
    (info.s === 'soup_restaurant' ||
      (info.s === 'corporate_editorial' &&
        /(çorba|corba|paça|paca|işkembe|iskembe|beyran|mercimek|tarhana|kelle)/i.test(combinedText)));

  // 0. OTO DETAİLİNG / PASTA CİLA / SERAMİK KAPLAMA / PPF / ARAÇ KAPLAMA GARAJI (ÖNCELİKLİ)
  if (isAutoDetailing) {
    return {
      eyebrow: catLabel || 'OTO DETAİLİNG, SERAMİK KAPLAMA & PPF GARAJI',
      navActionLabel: 'Randevu & Fiyat Al',
      servicesNavLabel: 'Uygulamalar',
      galleryNavLabel: 'Garajımız',
      heroSubtitle: `${name} olarak profesyonel pasta cila ve boya düzeltme, 9H seramik ve elmas kaplama, PPF şeffaf boya koruma filmi, araç kaplama, cam filmi, jant boyama, bodykit ve boyasız göçük düzeltme (PDR) uygulamalarıyla aracınıza kusursuz showroom parlaklığı kazandırıyoruz.`,
      aboutTitle: `${name} — Profesyonel Boya Koruma, Kaplama ve Detailing Stüdyosu`,
      aboutP1: `${name}, özel aydınlatmalı kapalı garaj stüdyosunda birinci sınıf seramik-elmas kaplama kimyasalları, yüksek mikronlu TPU PPF filmler ve profesyonel polisaj ekipmanlarıyla üst segment araç bakım ve koruma uygulamaları gerçekleştirmektedir.`,
      aboutP2:
        'Aracınızın boya değerini ve estetik görünümünü en üst seviyeye taşıyan seramik kaplama, kaput ve komple PPF kaplama, renk değişimi, cam filmi, jant boyama, bodykit ve boyasız göçük düzeltme işlemlerimizi uzman kadromuzla garantili olarak sunuyoruz.',
      hours: 'Pazartesi – Cumartesi: 09:00 – 20:00',
      headerBg: 'bg-zinc-950/95 border-amber-500/20',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/detailing.mp4',
      posterSrc: '/images/diestrogarage/5.jpg?v=2',
      aboutImgSrc: '/images/diestrogarage/1.jpg?v=2',
      pillars: [
        { num: '01', title: 'Seramik & Elmas Kaplama', desc: 'Boya yüzeyinde hidrofobik kristal zırh oluşturan, UV ve çizik dirençli 9H seramik ve elmas kaplama.' },
        { num: '02', title: 'PPF & Araç Kaplama', desc: 'Taş vuruğu ve sürtmelere karşı kendini yenileyen TPU şeffaf kaput filmi ve profesyonel araç kaplama.' },
        { num: '03', title: 'Pasta Cila & Boya Düzeltme', desc: 'Kılcal çizik, hare ve matlaşmayı ortadan kaldıran çok aşamalı profesyonel polisaj ve ayna parlaklığı.' },
        { num: '04', title: 'PDR Göçük, Jant & Bodykit', desc: 'Orijinalliği bozmadan boyasız göçük düzeltme, jant boyama, garantili cam filmi ve bodykit aksesuar.' },
      ],
      servicesSectionTitle: 'Garajımızda Uygulanan Profesyonel Detailing ve Kaplama İşlemleri',
      services: [
        { num: '01', title: 'Seramik Kaplama & Elmas Kaplama', desc: 'Aracınızın boyasını dış etkenlere, güneş yanığına ve kimyasallara karşı koruyan, derin ıslak görünüm ve su iticilik sağlayan kristal kaplama.', detail: '9H Kristal Koruma • Su & Kir İtici • Derin Parlaklık' },
        { num: '02', title: 'PPF Şeffaf Kaput Filmi & Araç Kaplama', desc: 'Taş çarpmalarına ve çiziklere karşı kendini ısıyla yenileyen TPU şeffaf PPF boya koruma filmi ve özel renk değişimi folyo kaplama.', detail: 'TPU Şeffaf PPF • Kaput & Komple • Renk Değişimi' },
        { num: '03', title: 'Profesyonel Pasta Cila & Hare Giderme', desc: 'Yıkama ve fırça kaynaklı kılcal çiziklerin mikron ölçümü yapılarak çok aşamalı polisaj ile giderilmesi ve ilk günkü parlaklığa kavuşturulması.', detail: 'Boya Ölçümü • Çizik Giderme • Showroom Parlaklığı' },
        { num: '04', title: 'Garantili Cam Filmi & Detaylı İç Kuaför', desc: 'Yüksek ısı ve UV blokajlı çizilmez cam filmi uygulaması; antibakteriyel detaylı iç temizlik, deri bakımı ve ozon sterilizasyonu.', detail: 'Isı & UV Korumalı Film • Deri Bakımı • Detaylı Kuaför' },
        { num: '05', title: 'Boyasız Göçük Düzeltme (PDR)', desc: 'Park hasarları, kapı vurukları ve dolu göçüklerinin boyama veya macun işlemi yapılmadan, aracın orijinalliği korunarak düzeltilmesi.', detail: 'Orijinal Boya Koruma • Değer Kaybı Yok • Hassas İşçilik' },
        { num: '06', title: 'Jant Boyama, Kaliper & Bodykit Aksesuar', desc: 'Kaldırım sürtmesi olan jantların onarımı ve özel renk boyaması, kaliper renklendirme ve modele özel bodykit/difüzör montajı.', detail: 'Jant Yenileme • Bodykit Montaj • Sportif Görünüm' },
      ],
      reviews: [
        { author: 'Burak K.', role: 'Müşteri Yorumu', group: 'Seramik & Elmas Kaplama', text: 'Aracımın pasta cila ve seramik kaplama işlemi için tercih ettim. Araba galeriden sıfır çıkmış gibi ayna parlaklığında oldu, işçilik kusursuz.' },
        { author: 'Emre Y.', role: 'Müşteri Yorumu', group: 'PPF Kaput Filmi & Cam Filmi', text: 'Kaput PPF ve cam filmi uygulaması yaptırdım. Kesim yerleri hiç belli olmuyor, kullanılan malzeme ve garajın temizliği 10 numara.' },
        { author: 'Oğuzhan T.', role: 'Müşteri Yorumu', group: 'Boyasız Göçük Düzeltme', text: 'Kapıdaki göçüğü boyasız şekilde milimetrik olarak düzelttiler, hiçbir iz kalmadı. Jant boyama işçilikleri de harika.' },
        { author: 'Serkan D.', role: 'Müşteri Yorumu', group: 'Araç Kaplama & Bodykit', text: 'Hem esnaflıkları hem de detaylara verdikleri önem çok üst seviyede. Aracınızı gözünüz kapalı teslim edebileceğiniz profesyonel bir garaj.' },
      ],
      gallery: [
        { src: '/images/diestrogarage/2.jpg?v=2', title: `${name} Seramik & Elmas Kaplama Stüdyosu`, subtitle: info.a },
        { src: '/images/diestrogarage/3.jpg?v=2', title: `${name} Detaylı Yıkama & Boya Hazırlık`, subtitle: 'Özel LED aydınlatmalı stüdyoda kusursuz yüzey hazırlığı' },
        { src: '/images/diestrogarage/4.jpg?v=2', title: `${name} 9H Kristal Seramik & Elmas Kaplama`, subtitle: 'Üst segment araçlara özel garantili boya koruma uygulamaları' },
        { src: '/images/diestrogarage/6.jpg?v=2', title: `${name} Profesyonel Pasta Cila & Showroom Parlaklığı`, subtitle: info.a },
      ],
    };
  }

  // 1. BÖREKÇİ / KAHVALTI SALONU / FIRIN / UNLU MAMULLER
  if (isBakery) {
    return {
      eyebrow: catLabel || 'TAZE BÖREK, KAHVALTI & UNLU MAMULLER',
      navActionLabel: 'Sipariş & İletişim',
      servicesNavLabel: 'Lezzetler',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak her sabah ilk ışıklarla birlikte günlük açılan çıtır börek çeşitlerimiz, sıcak poğaçalarımız, zengin kahvaltı lezzetlerimiz ve taze demleme çayımızla misafirlerimizi ağırlıyoruz.`,
      aboutTitle: 'Usta Ellerden Günlük Açılan Sıcak Börek ve Kahvaltı Lezzetleri',
      aboutP1: `${name}, geleneksel el açması börek ustalığını birinci sınıf tereyağı, doğal peynir, taze kıyma ve özenle seçilen un kalitesiyle buluşturarak her gün taze üretim yapmaktadır.`,
      aboutP2:
        'Sabahın erken saatlerinden itibaren fırından sıcak çıkan su böreği, kol böreği, serpme ve sıcak kahvaltı çeşitlerimizle hem salonumuzda hem de paket ve tepsi siparişlerinizde aynı tazeliği sunuyoruz.',
      hours: 'Her Gün: 05:30 – 21:00',
      headerBg: 'bg-stone-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/bakery.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'El Açması & Günlük Üretim', desc: 'Tüm börek ve unlu mamullerimiz her sabah günlük olarak açılır ve fırından sıcak servis edilir.' },
        { num: '02', title: 'Doğal İç Harç & Tereyağı', desc: 'Yöresel peynir, taze çekilmiş dana kıyma, ıspanak ve gerçek tereyağı ile hazırlanan geleneksel tarifler.' },
        { num: '03', title: 'Zengin Sıcak Kahvaltı', desc: 'Sıcak börek tabakları, kahvaltı çeşitleri ve tavşan kanı demleme çayla güne lezzetli başlangıç.' },
        { num: '04', title: 'Tepsi & Paket Siparişi', desc: 'Özel günleriniz, misafir ağırlamalarınız ve iş yerleriniz için sıcak tepsi börek ve hızlı paket imkanı.' },
      ],
      servicesSectionTitle: 'Günlük Taze Börek ve Kahvaltı Menümüz',
      services: [
        { num: '01', title: 'El Açması Su Böreği & Kol Böreği', desc: 'Bol peynirli ve tereyağlı su böreği ile kıymalı, peynirli, patatesli ve ıspanaklı çıtır kol böreği çeşitlerimiz.', detail: 'El Açması Hamur • Gerçek Tereyağı • Sıcak Servis' },
        { num: '02', title: 'Kürt Böreği & Karaköy Böreği', desc: 'Üzerine pudra şekeri serpilerek veya sade olarak sıcak servis edilen geleneksel sade ve kıymalı böreklerimiz.', detail: 'Çıtır Dokulu • Günlük Fırından • Geleneksel Tarif' },
        { num: '03', title: 'Kahvaltı Tabağı & Sıcak Sunumlar', desc: 'Doğal peynir ve zeytin çeşitleri, söğüş, bal-tereyağı, sahanda yumurta ve sıcak börek eşliğinde kahvaltı.', detail: 'Zengin Kahvaltı • Doğal Ürünler • Taze Demleme Çay' },
        { num: '04', title: 'Günlük Sıcak Poğaça, Açma & Simit', desc: 'Sabah fırından yeni çıkmış yumuşacık tereyağlı açma, çeşit çeşit poğaça ve çıtır simit alternatifleri.', detail: 'Sabah Sıcak Çıkış • Bol Malzemeli • Günlük Üretim' },
        { num: '05', title: 'Özel Gün & Davetlere Tepsi Siparişi', desc: 'Misafirleriniz, toplantılarınız ve özel davetleriniz için istediğiniz saatte fırından sıcak teslim tepsi börekler.', detail: 'Tam Tepsi Üretim • Zamanında Teslim • Özel Hazırlık' },
        { num: '06', title: 'Taş Fırın & Geleneksel Lezzetler', desc: 'Usta ellerde hazırlanan kır pidesi, gözleme ve çay saatlerinize eşlik eden taze tatlı-tuzlu unlu mamuller.', detail: 'Usta İşçilik • Hijyenik Mutfak • Paket Servis' },
      ],
      reviews: [
        { author: 'Yusuf K.', role: 'Google Yorumu', group: 'El Açması Börek & Kahvaltı', text: 'Sabahları fırından yeni çıkmış sıcak börekleri gerçekten efsane. Hamuru incecik, iç malzemesi bol ve hiç mideyi rahatsız etmiyor.' },
        { author: 'Merve T.', role: 'Google Yorumu', group: 'Su Böreği & Çay', text: 'Ailecek kahvaltı için uğradık, su böreği ve kıymalı kol böreği harikaydı. Mekan tertemiz, çalışanlar çok güler yüzlü.' },
        { author: 'Hakan B.', role: 'Google Yorumu', group: 'Tepsi Börek Siparişi', text: 'Misafirlerimiz için tepsiyle börek sipariş ettik, tam saatinde sıcacık ve çıtır çıtır teslim ettiler. Herkese tavsiye ederim.' },
        { author: 'Sinan D.', role: 'Google Yorumu', group: 'Sabah Kahvaltısı', text: 'Bölgede gerçek el açması börek yiyebileceğiniz en kaliteli ve hijyenik adres. Çayı her zaman taze.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85', title: `${name} Günlük Sıcak Börek & Fırın`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85', title: `${name} El Açması Hamur & Unlu Mamuller`, subtitle: 'Her sabah taze açılan çıtır lezzetler' },
        { src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=85', title: `${name} Zengin Kahvaltı & Sıcak Sunum`, subtitle: 'Taze demleme çay eşliğinde kahvaltı keyfi' },
        { src: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 2. KAFE / KAHVE / TATLI / PASTANE
  if (isCafe) {
    const isMultiConceptCafe = /(bazlama|tavuklu pilav|çiğ köfte|cig kofte|cofferoz)/i.test(combinedText);
    return {
      eyebrow: catLabel || (isMultiConceptCafe ? 'KAFE, PATISSERIE & SOKAK LEZZETLERİ' : 'KAFE, KAHVE & TATLI MERKEZİ'),
      navActionLabel: 'İletişim',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: isMultiConceptCafe
        ? `${name} olarak taze öğütülmüş kahve çeşitlerimiz, günlük hazırlanan magnolia, profiterol ve San Sebastian tatlılarımız, meşhur Kızılcahamam bazlama tostumuz, kovada tavuklu pilav ve çiğ köfte lezzetlerimizle günün her saati yanınızdayız.`
        : `${name} olarak taze kavrulmuş kahve çekirdeklerimiz, günlük hazırlanan özel tatlılarımız ve konforlu atmosferimizle keyifli buluşmalarınıza ev sahipliği yapıyoruz.`,
      aboutTitle: isMultiConceptCafe
        ? `${name} — Kahve, Patisserie ve Sıcak Kampüs Lezzetleri`
        : 'Özel Kahve Çekirdekleri ve Günlük Taze Tatlılar',
      aboutP1: isMultiConceptCafe
        ? `${name}, nitelikli kahve ve günlük taze patisserie tatlılarını; doyurucu Kızılcahamam bazlama tost, tereyağlı kovada tavuklu pilav ve meşhur Adıyaman çiğ köfte lezzetleriyle tek çatı altında buluşturmaktadır.`
        : `${name}, nitelikli kahve kültürünü ve günlük taze pastacılık ürünlerini ferah ve samimi bir mekan tasarımıyla bir araya getirmektedir.`,
      aboutP2: isMultiConceptCafe
        ? 'Samimi ve enerjik atmosferimiz, günlük taze vitrin ürünlerimiz, hızlı servisimiz ve ekonomik kampüs menülerimizle hem kahve-tatlı molalarınızda hem de öğünlerinizde lezzet dolu bir deneyim sunuyoruz.'
        : 'Deneyimli baristalarımızın hazırladığı sıcak ve soğuk kahve çeşitlerimiz, taze demleme çayımız ve usta ellerden çıkan tatlılarımızla günün her saati yanınızdayız.',
      hours: 'Her Gün: 08:00 – 23:30',
      headerBg: 'bg-stone-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: '/videos/cafe.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85',
      pillars: isMultiConceptCafe
        ? [
            { num: '01', title: 'Günlük Patisserie & Tatlı', desc: 'Vitrinde her gün taze hazırlanan Magnolia, kupta Profiterol, Tiramisu, San Sebastian ve dilim pastalar.' },
            { num: '02', title: 'Kızılcahamam Bazlama Tost', desc: 'Taptaze bazlama ekmeği arasında bol kaşarlı, sucuklu ve kavurmalı sıcak bazlama tost çeşitleri.' },
            { num: '03', title: 'Kovada Pilav & Çiğ Köfte', desc: 'Tereyağlı kovada tavuklu pilav ve meşhur Bayram Usta Adıyaman çiğ köfte dürüm-porsiyon lezzetleri.' },
            { num: '04', title: 'Nitelikli Kahve & Çay', desc: 'Taze çekirdek espresso bazlı sıcak-soğuk kahveler ve tatlıların yanında taze demleme çay.' },
          ]
        : [
            { num: '01', title: 'Taze Kavrulmuş Kahve', desc: 'Seçkin kahve çekirdeklerinden anında öğütülerek hazırlanan espresso ve demleme kahveler.' },
            { num: '02', title: 'Günlük Taze Tatlılar', desc: 'Her gün taze malzemelerle üretilen pasta, cheesecake, sütlü ve çikolatalı tatlı çeşitleri.' },
            { num: '03', title: 'Ferah & Konforlu Ortam', desc: 'Arkadaşlarınızla ve ailenizle keyifle vakit geçirebileceğiniz özenli iç ve dış mekan.' },
            { num: '04', title: 'Güler Yüzlü Sunum', desc: 'Hızlı servis, hijyenik hazırlık ve misafir memnuniyeti odaklı hizmet anlayışı.' },
          ],
      servicesSectionTitle: isMultiConceptCafe
        ? 'Öne Çıkan Kahve, Patisserie ve Sıcak Lezzet Menümüz'
        : 'Kahve, Tatlı ve İçecek Menümüz',
      services: isMultiConceptCafe
        ? [
            { num: '01', title: 'Kızılcahamam Bazlama Tost & Sıcak Tostlar', desc: 'Taptaze günlük bazlama ekmeği arasında bol kaşarlı, sucuklu, kavurmalı, atom ve karışık sıcak bazlama tost çeşitlerimiz.', detail: 'Taptaze Bazlama • Bol Malzeme • Sıcak Sunum' },
            { num: '02', title: 'Günlük Patisserie & Kupta Tatlılar', desc: 'Çilekli ve muzlu Magnolia, kupta bol çikolatalı Profiterol, İtalyan Tiramisu, San Sebastian Cheesecake ve yaş pastalar.', detail: 'Magnolia & Profiterol • San Sebastian • Günlük Üretim' },
            { num: '03', title: 'Nitelikli Sıcak & Soğuk Kahveler', desc: 'Taze çekirdeklerden hazırlanan Espresso, Latte, Cappuccino, Mocha, Soğuk Kahveler, Türk kahvesi ve taze demleme çay.', detail: 'Taze Kahve Çekirdeği • Sıcak & Buzlu • Tatlı Yanı İkram' },
            { num: '04', title: 'Kovada Tavuklu Nohutlu Pilav', desc: 'Tereyağlı tane tane pirinç pilavı üzerine bol didiklenmiş tavuk eti, karabiber ve bol köpüklü ayran menüsü.', detail: 'Tereyağlı Pilav • Bol Tavuklu • Doyurucu Kova Porsiyon' },
            { num: '05', title: 'Meşhur Adıyaman Çiğ Köfte (Bayram Usta)', desc: 'Günlük taze yoğrulan özel baharatlı çiğ köfte; taze nane, marul, limon ve nar ekşisi eşliğinde dürüm ve porsiyon servis.', detail: 'Günlük Taze • Bol Yeşillik • Dürüm & Porsiyon' },
            { num: '06', title: 'Kampüs Menüleri & Hızlı Servis', desc: 'Öğrencilere ve kampüs misafirlerine özel ekonomik tatlı-kahve ve tost-içecek menü kombinasyonları, hızlı paket servis.', detail: 'Ekonomik Kampüs Menü • Hızlı Servis • Yüksek Hijyen' },
          ]
        : [
            { num: '01', title: 'Espresso Bazlı Sıcak Kahveler', desc: 'Latte, Cappuccino, Americano, Flat White, Mocha ve geleneksel közde/kumda Türk kahvesi.', detail: 'Taze Çekirdek • Usta Barista • İdeal Kıvam' },
            { num: '02', title: 'Günlük Pasta & Tatlı Çeşitleri', desc: 'San Sebastian cheesecake, tiramisu, magnolia, kruvasan ve günlük özel dilim pastalar.', detail: 'Günlük Üretim • Doğal Malzeme • Taze Sunum' },
            { num: '03', title: 'Soğuk Kahveler & Ev Yapımı İçecekler', desc: 'Iced Latte, Cold Brew, Frappe, taze meyveli frozen, smoothie ve ev yapımı limonata.', detail: 'Ferahlatıcı Lezzet • Doğal Meyve • Buzlu Sunum' },
            { num: '04', title: 'Kahvaltı & Sıcak Atıştırmalıklar', desc: 'Sandviç çeşitleri, bazlama tost, kruvasan tabakları ve güne zinde başlatan kahvaltılıklar.', detail: 'Sıcak Hazırlık • Doyurucu Porsiyon • Taze Ekmek' },
            { num: '05', title: 'Bitki Çayları & Taze Demleme Çay', desc: 'Özel harman yaprak çaylardan demlenen taze çay ve doğal kış/bitki çayı alternatifleri.', detail: 'Taze Demleme • Doğal Bitkiler • Sıcak İkram' },
            { num: '06', title: 'Grup Buluşmaları & Paket Servis', desc: 'Özel kutlamalar, arkadaş buluşmaları ve paket kahve-tatlı siparişleri için hızlı servis.', detail: 'Konforlu Salon • Paket Servis • Yüksek Hijyen' },
          ],
      reviews: isMultiConceptCafe
        ? [
            { author: 'Elif K.', role: 'Müşteri Yorumu', group: 'Magnolia & San Sebastian', text: 'Tatlıları gerçekten harika, özellikle kupta profiterol ve çilekli magnoliası çok taze. Kahveyle birlikte tam bir fiyat-performans yeri.' },
            { author: 'Burak T.', role: 'Müşteri Yorumu', group: 'Kızılcahamam Bazlama Tost', text: 'Bazlama tostu sıcacık ve içi gerçekten çok bol malzemeli geliyor. Kampüs çevresinde yiyebileceğiniz en iyi tost kesinlikle burada.' },
            { author: 'Emre D.', role: 'Müşteri Yorumu', group: 'Kovada Tavuklu Pilav & Ayran', text: 'Kovada tavuklu pilavı hem çok doyurucu hem de lezzeti yerinde. Yanında çiğ köfte ve ayranla hızlıca öğle yemeği için bir numara.' },
            { author: 'Zeynep M.', role: 'Müşteri Yorumu', group: 'Kafe & Patisserie Ortamı', text: 'Çalışanlar çok güler yüzlü, vitrindeki pastalar her gün taze çıkıyor. Arkadaşlarla ders arası uğradığımız favori mekanımız.' },
          ]
        : [
            { author: 'Selin Y.', role: 'Google Yorumu', group: 'Kahve & Tatlı', text: 'Kahveleri çok lezzetli, tatlıları her zaman taze. Ortamı çok ferah ve çalışanlar son derece ilgili.' },
            { author: 'Mert K.', role: 'Google Yorumu', group: 'Mekan & Atmosfer', text: 'Arkadaşlarla oturup sohbet etmek için bölgedeki en nezih ve temiz mekanlardan biri.' },
            { author: 'Zeynep A.', role: 'Google Yorumu', group: 'Taze Pasta & Türk Kahvesi', text: 'Sunumları çok şık, fiyatları makul ve hizmet kalitesi gerçekten çok yüksek.' },
            { author: 'Caner T.', role: 'Google Yorumu', group: 'Soğuk İçecekler & Servis', text: 'Yaz kış uğradığımız, kalitesini hiç bozmayan harika bir işletme.' },
          ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85', title: `${name} — Mekan & Atmosfer`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85', title: `${name} — Nitelikli Kahve & İçecek Sunumu`, subtitle: 'Taze kavrulmuş kahve çekirdekleri ve imza içecekler' },
        { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85', title: `${name} — Günlük Taze Lezzetler`, subtitle: 'Özel reçetelerle günlük hazırlanan tatlı ve mutfak ürünleri' },
        { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85', title: `${name} — İç & Dış Mekan Deneyimi`, subtitle: info.a },
      ],
    };
  }

  // 3. ÇORBACI / GELENEKSEL LOKANTA / IZGARA & KEBAP RESTORANI
  if (info.s === 'restaurant' || info.s === 'soup_restaurant' || info.s === 'grill_restaurant') {
    return {
      eyebrow: catLabel || (isSoupPlace ? 'GELENEKSEL ÇORBA & LEZZET MERKEZİ' : 'RESTORAN, IZGARA & YÖRESEL LEZZETLER'),
      navActionLabel: 'Rezervasyon & Sipariş',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: isSoupPlace
        ? `${name} olarak günlük taze kemik suyuna hazırlanan şifalı çorba çeşitlerimiz, yöresel sıcak yemeklerimiz ve hijyenik mutfağımızla misafirlerimize gerçek lezzet deneyimi sunuyoruz.`
        : `${name} olarak özenle seçilen taze et ve doğal malzemelerle hazırlanan ızgara çeşitlerimiz, taş fırın lezzetlerimiz ve zengin mutfağımızla misafirlerimizi ağırlıyoruz.`,
      aboutTitle: 'Usta Ellerden Çıkan Geleneksel ve Taze Lezzetler',
      aboutP1: isSoupPlace
        ? `${name}, doğal malzemeleri geleneksel tariflerle buluşturarak her gün taze üretim yapmaktadır. Kemik suyuna hazırlanan çorbalarımızdan yöresel ana yemeklerimize kadar tüm menümüz usta aşçılarımız tarafından hazırlanır.`
        : `${name}, birinci sınıf malzeme kalitesini usta aşçılık geleneğiyle buluşturarak her gün taze hazırlık yapmaktadır. Izgara, kebap, pide ve günlük ana yemeklerimiz siparişinizle birlikte sıcak olarak sunulur.`,
      aboutP2:
        'Ferah aile salonumuz, güler yüzlü servis ekibimiz ve yüksek hijyen standartlarımızla hem ailelerin hem de lezzet tutkunlarının güvenle tercih ettiği buluşma noktasıyız.',
      hours: 'Her Gün: 07:00 – 01:00',
      headerBg: 'bg-stone-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-stone-300 hover:text-amber-400',
      ctaBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
      heroBg: 'bg-stone-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-700',
      videoSrc: isSoupPlace ? '/videos/soup.mp4' : '/videos/restaurant.mp4',
      posterSrc: isSoupPlace
        ? 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=85'
        : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Günlük Taze Hazırlık', desc: 'Tüm menümüz her sabah taze et, doğal sebzeler ve yöresel malzemelerle günlük olarak hazırlanır.' },
        { num: '02', title: 'Geleneksel Usta Tarifleri', desc: 'Yılların tecrübesiyle korunan orijinal reçeteler ve usta ellerde pişirilen özel lezzetler.' },
        { num: '03', title: 'Tam Hijyen & Kalite', desc: 'Mutfağımızda ve servis alanımızda gıda güvenliği ile hijyen kuralları en üst seviyede uygulanır.' },
        { num: '04', title: 'Hızlı Servis & Bol İkram', desc: 'Hem salon servisimizde hem de paket siparişlerde bekletmeden, sıcak ve zengin ikramlı sunum.' },
      ],
      servicesSectionTitle: isSoupPlace
        ? 'Öne Çıkan Çorba ve Yöresel Yemek Gruplarımız'
        : 'Öne Çıkan Izgara, Ana Yemek ve Menü Gruplarımız',
      services: isSoupPlace
        ? [
            { num: '01', title: 'Günün Özel Çorba Çeşitleri', desc: 'Kemik suyuna hazırlanan beyran, kelle paça, ayak paça, işkembe, mercimek ve yöresel tarhana çorbaları.', detail: 'Doğal Kemik Suyu • Bol Malzeme • Sıcak Kase Sunum' },
            { num: '02', title: 'Yöresel & Geleneksel Ana Yemekler', desc: 'Usta ellerde hazırlanan güveç, kavurma, haşlama ve günlük değişen geleneksel tencere yemekleri.', detail: 'Yöresel Tarifler • Günlük Üretim • Doğal Lezzet' },
            { num: '03', title: 'Izgara & Kebap Çeşitleri', desc: 'Özel dinlendirilmiş etlerden hazırlanan ızgara köfte, şiş ve kebap çeşitlerimiz.', detail: 'Seçkin Et Kalitesi • Usta Pişirim • Zengin Garnitür' },
            { num: '04', title: 'Taze Salata, Meze & İkramlar', desc: 'Yemeklerinizin yanında taze mevsim yeşillikleri, közlenmiş biber, sarımsak-sos ve fırından sıcak ekmek ikramı.', detail: 'Mevsim Yeşillikleri • Özel Soslar • Sıcak Pide' },
            { num: '05', title: 'Geleneksel Tatlılar & İçecekler', desc: 'Yemek sonrası fırın sütlaç, künefe, kadayıf çeşitleri, yayık ayranı ve taze demleme çay.', detail: 'Fırın Sütlaç • Tatlı Çeşitleri • Demleme Çay' },
            { num: '06', title: 'Paket Servis & Grup Ağırlama', desc: 'Aile yemekleri, iş toplantıları ve bulunduğunuz konuma hızlı sıcak paket servis imkanı.', detail: 'Aile Salonu • Hızlı Paket • Gece & Gündüz Açık' },
          ]
        : [
            { num: '01', title: 'Izgara & Kebap Çeşitleri', desc: 'Özel zırh kıyması kebaplar, ızgara köfte, kuzu şiş, tavuk şiş ve karışık ızgara tabaklarımız.', detail: 'Seçkin Et Kalitesi • Odun Ateşi • Sıcak Sunum' },
            { num: '02', title: 'Taş Fırın Pide & Lahmacun', desc: 'İncecik çıtır hamur üzerine hazırlanan kıymalı, kuşbaşılı, kaşarlı pide ve taş fırın lahmacun.', detail: 'Taş Fırın • Günlük Hamur • Bol Malzeme' },
            { num: '03', title: 'Günün Sıcak Çorbaları & Başlangıçlar', desc: 'Yemek öncesi sıcak süzme mercimek, ezogelin ve geleneksel çorba çeşitlerimiz.', detail: 'Günlük Taze • Doğal Tereyağlı • Sıcak Başlangıç' },
            { num: '04', title: 'Zengin Meze, Salata & İkramlar', desc: 'Siparişlerinizin yanında ücretsiz sunulan mevsim salata, ezme, közlenmiş biber ve sıcak lavaş ikramı.', detail: 'Bol İkram • Taze Yeşillik • Sıcak Lavaş' },
            { num: '05', title: 'Tatlılar & Soğuk-Sıcak İçecekler', desc: 'Künefe, fırın sütlaç, baklava çeşitleri, bol köpüklü ayran ve yemek sonrası demleme çay.', detail: 'Geleneksel Tatlılar • Bol Köpüklü Ayran • Çay İkramı' },
            { num: '06', title: 'Aile Salonu & Hızlı Paket Servis', desc: 'Geniş aile salonumuzda konforlu ağırlama, toplu yemek organizasyonları ve adrese sıcak paket servis.', detail: 'Aile Salonu • Hızlı Paket • Grup Rezervasyonu' },
          ],
      reviews: [
        { author: 'Ahmet Y.', role: 'Google Yorumu', group: 'Lezzet & Porsiyon', text: 'Yemeklerin lezzeti ve porsiyonların doyuruculuğu gerçekten harika. Mekan tertemiz ve çalışanlar çok ilgili.' },
        { author: 'Selim K.', role: 'Google Yorumu', group: 'Aile Salonu & Servis', text: 'Ailecek uğradığımız, ikramları bol ve servisi çok hızlı bir mekan. Herkese gönül rahatlığıyla tavsiye ederim.' },
        { author: 'Burak T.', role: 'Google Yorumu', group: 'Taze Malzeme & Sıcak Sunum', text: 'Ne zaman gitsek aynı tazelikte ve sıcaklıkta servis yapıyorlar. Fiyat-performans olarak bölgenin en iyisi.' },
        { author: 'Mustafa D.', role: 'Google Yorumu', group: 'Mutfak & Hijyen', text: 'Esnaflıkları, güler yüzlü karşılamaları ve mutfak temizliği 10 numara. Yıllardır kalitesini hiç bozmayan nadir yerlerden.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=85', title: `${name} Lezzet Sunumu`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85', title: `${name} Sıcak Mutfak & Özel Menü`, subtitle: 'Günlük taze ve doğal malzemelerle hazırlanan lezzetler' },
        { src: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=1000&q=85', title: `${name} Usta İşçilik & Zengin İkramlar`, subtitle: 'Usta aşçılarımızdan bol porsiyonlu sıcak sunumlar' },
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85', title: `${name} Salon & Misafir Alanı`, subtitle: info.a },
      ],
    };
  }

  // 4. DİŞ KLİNİĞİ / SAĞLIK / ESTETİK / MEDİKAL
  if (info.s === 'dental_medical') {
    return {
      eyebrow: catLabel || 'AĞIZ VE DİŞ SAĞLIĞI / KLİNİK MERKEZİ',
      navActionLabel: 'Randevu Al',
      servicesNavLabel: 'Tedaviler',
      galleryNavLabel: 'Kliniğimiz',
      heroSubtitle: `${name} olarak modern görüntüleme teknolojileri, steril klinik altyapımız ve uzman hekim kadromuzla sağlıklı ve estetik gülüşler için güvenilir tedavi çözümleri sunuyoruz.`,
      aboutTitle: 'Hijyenik, Konforlu ve Modern Diş Kliniği Standartları',
      aboutP1: `${name}, hasta konforunu ve uluslararası sterilizasyon protokollerini merkeze alarak koruyucu ve tedavi edici ağız ve diş sağlığı hizmetleri sunmaktadır.`,
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
      videoSrc: '/videos/dental.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Dijital Teşhis & Planlama', desc: 'Modern görüntüleme cihazları ile hızlı, doğru teşhis ve kişiye özel tedavi planlaması.' },
        { num: '02', title: 'Üst Düzey Sterilizasyon', desc: 'Tüm klinik ekipmanlarımızda uluslararası hijyen ve otoklav sterilizasyon standartları.' },
        { num: '03', title: 'Uzman Hekim Kadrosu', desc: 'Estetik, cerrahi ve koruyucu tedavilerde deneyimli ve güler yüzlü yaklaşım.' },
        { num: '04', title: 'Konforlu & Ağrısız Süreç', desc: 'Hasta memnuniyetini ve konforunu ön planda tutan modern klinik ortamı.' },
      ],
      servicesSectionTitle: 'Uyguladığımız Başlıca Diş Tedavileri',
      services: [
        { num: '01', title: 'İmplant & Cerrahi Uygulamalar', desc: 'Eksik dişlerin fonksiyonel ve estetik olarak tamamlanması için garantili dental implant tedavileri.', detail: 'Dijital Planlama • Steril Cerrahi • Kalıcı Çözüm' },
        { num: '02', title: 'Gülüş Tasarımı & Zirkonyum', desc: 'Doğal diş estetiğine en yakın ışık geçirgenliğine sahip zirkonyum ve lamina porselen uygulamaları.', detail: 'Zirkonyum • E-Max Lamina • Estetik Tasarım' },
        { num: '03', title: 'Diş Beyazlatma & Diş Eti Bakımı', desc: 'Diş taşı temizliği (detertraj) ve klinik tipi lazer diş beyazlatma işlemleri.', detail: 'Ofis Tipi Beyazlatma • Sağlıklı Diş Eti • Ferah Gülüş' },
        { num: '04', title: 'Kanal Tedavisi & Estetik Dolgu', desc: 'Doğal dişlerin korunmasını sağlayan modern endodontik kanal tedavisi ve estetik kompozit dolgular.', detail: 'Ağrısız Uygulama • Estetik Dolgu • Diş Koruma' },
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
        { src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=85', title: `${name} Muayene ve Tedavi Ünitesi`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=85', title: `${name} Estetik Diş Hekimliği`, subtitle: 'Zirkonyum, implant ve koruyucu diş tedavileri' },
        { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85', title: `${name} Sterilizasyon & Donanım`, subtitle: 'Uluslararası hijyen standartlarında klinik altyapı' },
        { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85', title: `${name} Hasta Kabul Alanı`, subtitle: info.a },
      ],
    };
  }

  // 5. TELEFON & TEKNOLOJİ / EV ALETLERİ / BEYAZ EŞYA / TEKNİK SERVİS
  const isPhoneOrTech =
    (info.s === 'appliance_service' || info.s === 'corporate_editorial') &&
    /(telefon|cep telefonu|iphone|samsung|xiaomi|aksesuar|tablet|bilgisayar|laptop|teknoloji|bilişim|bilisim)/i.test(
      combinedText
    );
  if (info.s === 'appliance_service' || isPhoneOrTech) {
    if (isPhoneOrTech) {
      return {
        eyebrow: catLabel || 'TELEFON, AKSESUAR & TEKNİK SERVİS MERKEZİ',
        navActionLabel: 'İletişim & Fiyat Al',
        servicesNavLabel: 'Hizmetler',
        galleryNavLabel: 'Mağazamız',
        heroSubtitle: `${name} olarak ${
          info.c || 'sıfır ve 2. el cep telefonu, orijinal aksesuar çeşitleri ve garantili telefon-tablet tamiri'
        } alanında hızlı, şeffaf ve güvenilir çözümler sunuyoruz.`,
        aboutTitle: `${name} Telefon, Aksesuar ve Garantili Teknik Servis Merkezi`,
        aboutP1: `${name}, uzman teknik servis kadrosu ve geniş ürün yelpazesiyle tüm akıllı telefon ve tablet modellerinde ekran değişimi, batarya yenileme, anakart onarımı ile sıfır ve 2. el cihaz alım-satım hizmeti sunmaktadır.`,
        aboutP2:
          'Zengin kılıf, kırılmaz cam, orijinal şarj adaptörü, kablo ve ses aksesuarlarımızla cihazlarınızı koruyor; tüm tamir işlemlerimizi hızlı ve garantili şekilde tamamlıyoruz.',
        hours: 'Pazartesi – Cumartesi: 09:00 – 20:30',
        headerBg: 'bg-zinc-950/95 border-white/10',
        headerText: 'text-white',
        headerSub: 'text-amber-400',
        navLink: 'text-zinc-300 hover:text-white',
        ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
        heroBg: 'bg-zinc-950',
        heroLine: 'bg-amber-500',
        heroEyebrow: 'text-amber-400',
        accentText: 'text-amber-600',
        videoSrc: '/videos/corporate.mp4',
        posterSrc: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=85',
        aboutImgSrc: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=85',
        pillars: [
          { num: '01', title: 'Hızlı & Garantili Tamir', desc: 'Ekran, batarya, şarj soketi ve anakart arızalarında uzman ekipmanlarla aynı gün hızlı onarım.' },
          { num: '02', title: 'Sıfır & 2. El Telefon', desc: 'Kontrolleri yapılmış, temiz ve güvenilir ikinci el ile kapalı kutu sıfır cep telefonu seçenekleri.' },
          { num: '03', title: 'Zengin Aksesuar Çeşidi', desc: 'Her modele uyumlu kılıf, hayalet/nano kırılmaz cam, hızlı şarj aleti, kulaklık ve powerbank.' },
          { num: '04', title: 'Şeffaf Fiyat & Güven', desc: 'Onarım ve cihaz takas işlemlerinde net bilgilendirme ve müşteri memnuniyeti odaklı esnaflık.' },
        ],
        servicesSectionTitle: 'Telefon, Aksesuar ve Teknik Servis Hizmetlerimiz',
        services: [
          { num: '01', title: 'Ekran & Ön Cam Değişimi', desc: 'Kırık veya dokunmatiği arızalı telefon ekranlarının orijinal kalitede yedek parçalarla garantili değişimi.', detail: 'Orijinal Kalite • Aynı Gün Teslim • Hassas Montaj' },
          { num: '02', title: '2. El ve Sıfır Telefon Alım & Satım', desc: 'Tüm fonksiyonları test edilmiş güvenilir 2. el telefonlar, sıfır cihazlar ve değerinde takas imkanı.', detail: 'Güvenilir Cihazlar • Takas İmkanı • Uygun Fiyat' },
          { num: '03', title: 'Batarya, Şarj Soketi & Hoparlör Tamiri', desc: 'Pil ömrü azalan cihazlar için yüksek kapasiteli batarya değişimi, şarj soketi, mikrofon ve kamera onarımı.', detail: 'Yüksek Kapasiteli Pil • Hızlı İşlem • Garantili Parça' },
          { num: '04', title: 'Kılıf, Kırılmaz Cam & Orijinal Aksesuarlar', desc: 'Darbeye dayanıklı lansman ve tasarım kılıflar, kamera koruyucular, hızlı şarj adaptörleri ve kablolar.', detail: 'Zengin Çeşit • Tam Koruma • Orijinal Aksesuar' },
          { num: '05', title: 'Anakart, Sıvı Teması & Entegre Onarımı', desc: 'Sıvı temasına maruz kalmış veya açılmayan cihazlarda profesyonel mikro-lehimleme ve anakart tamiri.', detail: 'Mikro Onarım • Arıza Tespiti • Uzman İşçilik' },
          { num: '06', title: 'Yazılım, Kurulum & Veri Aktarımı', desc: 'Yeni cihaz kurulumu, rehber-fotoğraf aktarımı, yazılım güncelleme ve teknik destek hizmetleri.', detail: 'Güvenli Aktarım • Yazılım Desteği • Hızlı Çözüm' },
        ],
        reviews: [
          { author: 'Emre K.', role: 'Müşteri Yorumu', group: 'Telefon Tamir & Aksesuar', text: 'Telefonumun ekran değişimini çok kısa sürede ve tertemiz yaptılar. Fiyatları da esnaflıkları da 10 numara.' },
          { author: 'Burak T.', role: 'Müşteri Yorumu', group: '2. El & Sıfır Telefon', text: 'Güvenerek telefon alışverişi yapabileceğiniz, her konuda dürüstçe yardımcı olan çok ilgili bir işletme.' },
          { author: 'Merve A.', role: 'Müşteri Yorumu', group: 'Kılıf & Kırılmaz Cam', text: 'Aksesuar çeşitleri çok bol ve kaliteli, kırılmaz cam uygulamasını da kusursuz yaptılar.' },
          { author: 'Serkan Y.', role: 'Müşteri Yorumu', group: 'Teknik Servis', text: 'Şarj soketi ve batarya değişimi için gittim, gözümün önünde yarım saatte hallettiler. Teşekkür ederim.' },
        ],
        gallery: [
          { src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85', title: `${name} Mağaza & Ürün Alanı`, subtitle: info.a },
          { src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85', title: `${name} Garantili Teknik Servis`, subtitle: 'Ekran, batarya ve anakart onarım merkezi' },
          { src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85', title: `${name} Sıfır & 2. El Telefonlar`, subtitle: 'Test edilmiş güvenilir cihaz ve takas seçenekleri' },
          { src: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=1000&q=85', title: `${name} Zengin Aksesuar Çeşitleri`, subtitle: info.a },
        ],
      };
    }

    return {
      eyebrow: catLabel || 'YETKİLİ & ÖZEL TEKNİK SERVİS MERKEZİ',
      navActionLabel: 'Servis Kaydı',
      servicesNavLabel: 'Hizmetler',
      galleryNavLabel: 'Servisimiz',
      heroSubtitle: `${name} olarak ${
        info.c || 'küçük ev aletleri, beyaz eşya, klima ve elektrikli cihaz'
      } alanında arıza tespiti, garantili bakım-onarım ve orijinal yedek parça temini hizmeti sunuyoruz.`,
      aboutTitle: `${name} Garantili Tamir, Bakım ve Yedek Parça Merkezi`,
      aboutP1: `${name}, deneyimli teknisyen kadrosu ve zengin orijinal yedek parça stoğu ile elektrikli ev aletleri, süpürge, çay-kahve makineleri, ütü, beyaz eşya ve iklimlendirme cihazlarının bakım ve onarımını titizlikle gerçekleştirmektedir.`,
      aboutP2:
        'Hızlı arıza tespiti, şeffaf fiyatlandırma ve orijinal yedek parça güvencesiyle cihazlarınızı ilk günkü performansına kavuşturuyoruz.',
      hours: 'Pazartesi – Cumartesi: 08:30 – 19:00',
      headerBg: 'bg-zinc-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-white',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/corporate.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Hızlı Arıza Tespiti', desc: 'Cihazlarınızdaki elektronik, motor ve mekanik arızaların uzman teknisyenlerimizce hızlı ve doğru tespiti.' },
        { num: '02', title: 'Orijinal Yedek Parça', desc: 'Önde gelen tüm ev aletleri ve beyaz eşya markalarına uyumlu zengin orijinal yedek parça ve aksesuar stoğu.' },
        { num: '03', title: 'Yetkili & Uzman Kadro', desc: 'Garantili işçilik ve standartlara uygun onarım prosedürleriyle uzun ömürlü cihaz kullanımı.' },
        { num: '04', title: 'Aynı Gün Çözüm Odaklı', desc: 'Onayınız sonrasında bekletmeden hızlı parça değişimi, test ve zamanında teslimat.' },
      ],
      servicesSectionTitle: 'Sunduğumuz Teknik Servis ve Yedek Parça Hizmetleri',
      services: [
        { num: '01', title: 'Küçük Ev Aletleri Bakım & Onarımı', desc: 'Elektrikli süpürge, robot süpürge, kahve ve çay makineleri, blender, mikser, tost makinesi ve ütü onarımı.', detail: 'Motor & Kart Onarımı • Orijinal Parça • Hızlı Teslim' },
        { num: '02', title: 'Çamaşır, Kurutma & Beyaz Eşya Servisi', desc: 'Çamaşır makinesi, kurutma makinesi ve bulaşık makinelerinde pompa, rezistans, rulman ve elektronik kart tamiri.', detail: 'Yerinde & Atölye Servis • Garantili İşçilik • Test' },
        { num: '03', title: 'Klima & İklimlendirme Bakım Servisi', desc: 'Klima periyodik bakımı, gaz dolumu, iç-dış ünite temizliği ve elektronik arıza onarım işlemleri.', detail: 'Periyodik Bakım • Performans Testi • Hijyenik Temizlik' },
        { num: '04', title: 'Orijinal Yedek Parça & Aksesuar Satışı', desc: 'Süpürge hortumu, başlık, filtre, toz torbası, hazne, rezistans ve tüm orijinal aksesuarların doğrudan temini.', detail: 'Stoktan Teslim • Tam Uyum • Orijinal Ürün' },
        { num: '05', title: 'Elektronik Kart & Motor Revizyonu', desc: 'Cihazların elektronik güç/kontrol kartlarının onarımı ve yüksek devirli motor değişim işlemleri.', detail: 'Hassas Ölçüm • Garantili Parça • Uzun Ömür' },
        { num: '06', title: 'Periyodik Kontrol & Teknik Danışma', desc: 'Cihazlarınızın ömrünü uzatan bakım uygulamaları ve parça uyumluluk desteği.', detail: 'Şeffaf Bilgi • Uygun Maliyet • Müşteri Memnuniyeti' },
      ],
      reviews: [
        { author: 'Cengiz T.', role: 'Google Yorumu', group: 'Yetkili Teknik Servis', text: 'Uzun zamandır gittiğim servis olup her seferinde çok yardımcı olmaktadırlar. Kendilerine çok teşekkür ederim.' },
        { author: 'Mehmet Ö.', role: 'Google Yorumu', group: 'Yedek Parça & Tamir', text: 'Süpürge parça değişimi için gittim, 10 dakikada orijinal parçayla hallettiler. Çok teşekkür ederim.' },
        { author: 'Kadir A.', role: 'Google Yorumu', group: 'Ev Aletleri Onarımı', text: 'Güler yüzlü esnaflık, arızayı hemen tespit edip uygun fiyata garantili şekilde tamir ettiler.' },
        { author: 'Ayşe K.', role: 'Google Yorumu', group: 'Teknik Servis', text: 'Aradığım yedek parçayı stoktan hemen verdiler, işçilikleri ve ilgileri çok güven verici.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85', title: `${name} Servis Merkezi`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=85', title: `${name} Teknik Onarım & Test`, subtitle: 'Uzman teknisyen kadromuz ve modern test ekipmanlarımız' },
        { src: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=85', title: `${name} Orijinal Yedek Parça Stoğu`, subtitle: 'Tüm modellere uyumlu zengin yedek parça ve aksesuar çeşidi' },
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85', title: `${name} Müşteri Kabul & Danışma`, subtitle: info.a },
      ],
    };
  }

  // 6. MERCEDES / LÜKS OTOMOTİV SERVİSİ
  if (info.s === 'mercedes_luxury') {
    return {
      eyebrow: catLabel || 'ÖZEL SERVİS & YEDEK PARÇA MERKEZİ',
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
      aboutImgSrc: '/vw/vw-engine.jpg',
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
        { src: '/vw/vw-service.jpg', title: `${name} Mekanik Bakım Atölyesi`, subtitle: info.a },
        { src: '/vw/spare-parts.jpg', title: `${name} Orijinal Yedek Parça Stoğu`, subtitle: 'Zengin parça çeşitliliği ve garantili montaj' },
        { src: '/vw/office-lounge.png', title: `${name} Servis Kabul & Danışma`, subtitle: 'Şeffaf servis planlaması ve bilgilendirme' },
        { src: '/vw/waiting-room.png', title: `${name} Müşteri Bekleme Salonu`, subtitle: info.a },
      ],
    };
  }

  // 7. SANAYİ / ÜRETİM / ISITMA / METAL / İMALAT
  if (info.s === 'industrial_heating') {
    return {
      eyebrow: catLabel || 'ÜRETİM, SANAYİ & TOPTAN SATIŞ MERKEZİ',
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
      videoSrc: '/videos/industrial.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=85',
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
        { src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=85', title: `${name} Üretim ve İmalat Hattı`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', title: `${name} Mühendislik ve Kalite Kontrol`, subtitle: 'Yüksek dayanımlı malzeme ve hassas işçilik' },
        { src: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1000&q=85', title: `${name} Stok ve Sevkiyat Alanı`, subtitle: 'Toptan ve perakende siparişler için güçlü stok' },
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85', title: `${name} İdari Ofis & Satış Merkezi`, subtitle: info.a },
      ],
    };
  }

  // 9. GENEL KURUMSAL İŞLETME / MAĞAZA / KUAFÖR / EMLAK / OFİS / HİZMET
  if (info.s === 'corporate_editorial') {
    const cleanCategory = info.c || 'Kurumsal Hizmet ve Çözüm';
    return {
      eyebrow: catLabel || 'KURUMSAL İŞLETME & HİZMET MERKEZİ',
      navActionLabel: 'İletişim & Randevu',
      servicesNavLabel: 'Hizmetler',
      galleryNavLabel: 'Galeri',
      heroSubtitle: `${name} olarak ${cleanCategory.toLocaleLowerCase('tr-TR')} alanında deneyimli ekibimiz, kaliteli ürün/hizmet standartlarımız ve müşteri memnuniyeti odaklı yaklaşımımızla yanınızdayız.`,
      aboutTitle: `${name} Kurumsal Hizmet ve Kalite Standartları`,
      aboutP1: `${name}, ${cleanCategory.toLocaleLowerCase('tr-TR')} sektöründeki tecrübesi ve profesyonel kadrosuyla müşterilerine güvenilir, şeffaf ve yüksek standartlarda hizmet sunmaktadır.`,
      aboutP2:
        'Güler yüzlü iletişim, doğru bilgilendirme ve titiz uygulama ilkelerimizle her zaman beklentilerinizin üzerinde bir deneyim sağlamayı hedefliyoruz.',
      hours: 'Pazartesi – Cumartesi: 09:00 – 19:30',
      headerBg: 'bg-zinc-950/95 border-white/10',
      headerText: 'text-white',
      headerSub: 'text-amber-400',
      navLink: 'text-zinc-300 hover:text-white',
      ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      heroBg: 'bg-zinc-950',
      heroLine: 'bg-amber-500',
      heroEyebrow: 'text-amber-400',
      accentText: 'text-amber-600',
      videoSrc: '/videos/corporate.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
      aboutImgSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85',
      pillars: [
        { num: '01', title: 'Uzman & Deneyimli Ekip', desc: `${cleanCategory} alanında bilgi birikimi yüksek, güler yüzlü ve profesyonel kadro.` },
        { num: '02', title: 'Kaliteli Ürün & Uygulama', desc: 'Tüm hizmet ve ürün gruplarımızda birinci sınıf malzeme ve titiz işçilik standardı.' },
        { num: '03', title: 'Şeffaf & Güvenilir Süreç', desc: 'İhtiyacınıza en uygun çözümlerin açık, dürüst ve net fiyatlandırma ile sunulması.' },
        { num: '04', title: 'Yüksek Müşteri Memnuniyeti', desc: 'Satış ve uygulama sonrasında da kesintisiz destek ve uzun vadeli güven ilişkisi.' },
      ],
      servicesSectionTitle: `${name} Başlıca Hizmet ve Çözüm Alanlarımız`,
      services: [
        { num: '01', title: `${cleanCategory} Uygulamaları`, desc: `${name} bünyesinde standartlara uygun, titiz ve müşteri beklentilerine özel profesyonel hizmet.`, detail: 'Profesyonel Yaklaşım • Kaliteli Hizmet • Tam Memnuniyet' },
        { num: '02', title: 'Kişiye & Kuruma Özel Çözümler', desc: 'İhtiyaç analizine dayalı, size veya işletmenize en uygun ürün ve uygulama planlaması.', detail: 'İhtiyaç Analizi • Özel Planlama • Doğru Çözüm' },
        { num: '03', title: 'Danışmanlık & Bilgilendirme', desc: 'Süreç öncesinde tüm alternatiflerin ve detayların uzman ekibimizce şeffaf şekilde paylaşılması.', detail: 'Uzman Görüşü • Şeffaf Bilgi • Güvenilir Rehberlik' },
        { num: '04', title: 'Zengin Ürün & Hizmet Çeşitliliği', desc: 'Farklı beklenti ve bütçelere hitap eden güncel, kaliteli ve garantili seçenekler.', detail: 'Güncel Portföy • Kalite Garantisi • Uygun Seçenekler' },
        { num: '05', title: 'Hızlı Randevu & Zamanında Teslim', desc: 'Vaktinize değer veren planlı çalışma sistemi ve söz verilen sürede eksiksiz tamamlanan işlemler.', detail: 'Planlı Süreç • Zamanında Teslim • Hızlı İletişim' },
        { num: '06', title: 'Uygulama Sonrası Destek', desc: 'Hizmet veya ürün teslimi sonrasında da her türlü soru ve talebiniz için doğrudan ulaşılabilirlik.', detail: 'Sürekli Destek • Kurumsal Güvence • Güler Yüzlü Hizmet' },
      ],
      reviews: [
        { author: 'Emre K.', role: 'Google Yorumu', group: cleanCategory, text: 'İlk andan itibaren çok ilgili ve güler yüzlü davrandılar. İşlerini gerçekten titizlikle yapıyorlar.' },
        { author: 'Ayşe T.', role: 'Google Yorumu', group: 'Müşteri Memnuniyeti', text: 'Hem kalitesi hem de dürüst yaklaşımları ile güven veren örnek bir işletme. Herkese tavsiye ederim.' },
        { author: 'Burak S.', role: 'Google Yorumu', group: 'Profesyonel Hizmet', text: 'Beklentimizin çok üzerinde bir hizmet aldık, zamanında ve eksiksiz yardımcı oldular.' },
        { author: 'Elif D.', role: 'Google Yorumu', group: cleanCategory, text: 'Temiz, düzenli ve işinin ehli bir ekip. Gönül rahatlığıyla tercih edebilirsiniz.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85', title: `${name} Hizmet & Misafir Alanı`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85', title: `${name} Kurumsal Çalışma Ortamı`, subtitle: cleanCategory },
        { src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=85', title: `${name} Müşteri Kabul & Danışma`, subtitle: 'Şeffaf ve güvenilir hizmet anlayışı' },
        { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85', title: `${name} Kurumsal Merkez`, subtitle: info.a },
      ],
    };
  }

  // 10. DEFAULT: OTOMOTİV / OTO ELEKTRİK / VAG / OTO SERVİS
  return {
    eyebrow:
      catLabel ||
      (info.s === 'vag_automotive' ? 'ÖZEL SERVİS & YEDEK PARÇA MERKEZİ' : 'OTOMOTİV & TEKNİK SERVİS MERKEZİ'),
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
    aboutImgSrc: '/vw/vw-engine.jpg',
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

function getSectorConfig(info: DynamicSiteInfo): SectorConfig {
  const base = buildBaseSectorConfig(info);

  // 1. Overlay real Owner Bio (Hakkında / İşletme Sahibinden) from Google Maps / Instagram
  if (info.bio && info.bio.trim().length > 20) {
    base.aboutP1 = info.bio.trim();
    base.heroSubtitle = info.bio.trim();
  }

  if (info.c && info.c.includes('•')) {
    const topCats = info.c
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(' & ');
    if (topCats) {
      base.aboutTitle = `${info.n} — ${topCats}`;
    }
  }

  // 2. Overlay real Working Hours from Google Maps
  if (info.hr && info.hr.trim()) {
    base.hours = info.hr.trim();
  }

  // 3. Overlay real learned items onto Pillars 01–03 and Google Star Rating onto Pillar 04
  if (Array.isArray(info.items) && info.items.length >= 3 && base.pillars.length >= 4) {
    base.pillars = [
      {
        num: '01',
        title: info.items[0].title,
        desc: info.items[0].desc,
      },
      {
        num: '02',
        title: info.items[1].title,
        desc: info.items[1].desc,
      },
      {
        num: '03',
        title: info.items[2].title,
        desc: info.items[2].desc,
      },
      base.pillars[3],
    ];
  }

  if (info.rt && base.pillars.length >= 4) {
    base.pillars = [
      ...base.pillars.slice(0, 3),
      {
        num: '04',
        title: `${info.rt} ★ Google Memnuniyeti`,
        desc: `${
          info.rc ? `${info.rc}+ gerçek müşteri değerlendirmesi` : 'Yüksek müşteri memnuniyeti'
        } ile onaylanmış güvenilir kalite ve hizmet standardı.`,
      },
    ];
  }

  // 4. Overlay real learned or user-taught offerings (info.ci or info.items) onto Services 01–06
  const customCards =
    Array.isArray(info.ci) && info.ci.length > 0
      ? info.ci.slice(0, 6).map((rawTitle, idx) => {
          const cleanTitle = String(rawTitle).trim();
          return {
            num: String(idx + 1).padStart(2, '0'),
            title: cleanTitle,
            desc: `${info.n} bünyesinde birinci sınıf malzemeler ve usta işçilikle sunulan ${cleanTitle.toLocaleLowerCase(
              'tr-TR'
            )} uzmanlığımız.`,
            detail: `${info.n} Kalitesi • Özenli Hazırlık • Tam Memnuniyet`,
          };
        })
      : Array.isArray(info.items) && info.items.length > 0
      ? info.items
      : [];

  if (customCards.length > 0) {
    const merged = [...customCards];
    for (const defCard of base.services) {
      if (merged.length >= 6) break;
      const isDuplicate = merged.some(
        (m) =>
          m.title.toLocaleLowerCase('tr-TR') === defCard.title.toLocaleLowerCase('tr-TR') ||
          m.title.toLocaleLowerCase('tr-TR').includes(defCard.title.toLocaleLowerCase('tr-TR').slice(0, 10))
      );
      if (!isDuplicate) {
        merged.push(defCard);
      }
    }
    base.services = merged.slice(0, 6).map((card, idx) => ({
      ...card,
      num: String(idx + 1).padStart(2, '0'),
    }));
  }

  return base;
}

function getKnownLocalPhotos(name: string, url: string): string[] {
  const combined = `${name} ${url}`.toLocaleLowerCase('tr-TR');
  if (combined.includes('diestro')) {
    return [
      '/images/diestrogarage/1.jpg?v=2',
      '/images/diestrogarage/2.jpg?v=2',
      '/images/diestrogarage/3.jpg?v=2',
      '/images/diestrogarage/4.jpg?v=2',
      '/images/diestrogarage/6.jpg?v=2',
      '/images/diestrogarage/5.jpg?v=2',
    ];
  }
  if (combined.includes('ky teknoloji') || combined.includes('kyteknoloji')) {
    return [
      '/images/kyteknoloji/1.jpg',
      '/images/kyteknoloji/2.jpg',
      '/images/kyteknoloji/3.jpg',
      '/images/kyteknoloji/4.jpg',
      '/images/kyteknoloji/5.jpg',
      '/images/kyteknoloji/6.jpg',
    ];
  }
  if (combined.includes('cofferoz')) {
    return [
      '/images/cofferozz/1.jpg',
      '/images/cofferozz/2.jpg',
      '/images/cofferozz/3.jpg',
      '/images/cofferozz/4.jpg',
      '/images/cofferozz/5.jpg',
      '/images/cofferozz/6.jpg',
    ];
  }
  return [];
}

export const DynamicCorporateSite: React.FC<{ info: DynamicSiteInfo }> = ({ info }) => {
  const [liveInfo, setLiveInfo] = useState<DynamicSiteInfo>(info);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formNote, setFormNote] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setLiveInfo((prev) => ({
      ...prev,
      ...info,
      photos: info.photos && info.photos.length > 0 ? info.photos : prev.photos,
      reviews: info.reviews && info.reviews.length > 0 ? info.reviews : prev.reviews,
      items: info.items && info.items.length > 0 ? info.items : prev.items,
    }));
  }, [info]);

  useEffect(() => {
    if (liveInfo.n) {
      document.title = `${liveInfo.n} | Kurumsal Web Sitesi`;
    }
  }, [liveInfo.n]);

  // Fetch real Google Maps / Instagram photos, logo, phone, address, categories, bio, hours, rating, learned items, and reviews on mount
  useEffect(() => {
    let cancelled = false;
    if (info.u && /^https?:\/\//i.test(info.u)) {
      fetch(`/api/telegram?place=${encodeURIComponent(info.u)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled && data?.ok && data?.info) {
            setLiveInfo((prev) => {
              const isGenericPrevAddr =
                !prev.a ||
                prev.a === 'Merkez / Türkiye' ||
                prev.a === 'Ankara / Türkiye' ||
                prev.a === 'Samsun / Türkiye' ||
                prev.a === 'Ankara' ||
                prev.a === 'Samsun';
              const isGenericApiAddr =
                !data.info.a ||
                data.info.a === 'Merkez / Türkiye' ||
                data.info.a === 'Ankara / Türkiye' ||
                data.info.a === 'Samsun / Türkiye' ||
                data.info.a === 'Ankara' ||
                data.info.a === 'Samsun';

              return {
                ...prev,
                n: prev.n && prev.n !== 'Kurumsal İşletme Merkezi' ? prev.n : data.info.n || prev.n,
                a: !isGenericPrevAddr ? prev.a : !isGenericApiAddr ? data.info.a : prev.a || data.info.a,
                p: prev.p && prev.p !== '0544 477 56 57' ? prev.p : data.info.p || prev.p,
                c: prev.c || data.info.c,
                s:
                  prev.s && prev.s !== 'corporate_editorial' && prev.s !== 'grill_restaurant'
                    ? prev.s
                    : data.info.s || prev.s,
                q: prev.q || data.info.q,
                bio: prev.bio || data.info.bio,
                hr: prev.hr || data.info.hr,
                rt: prev.rt || data.info.rt,
                rc: prev.rc || data.info.rc,
                items:
                  prev.items && prev.items.length > 0
                    ? prev.items
                    : Array.isArray(data.info.items) && data.info.items.length > 0
                    ? data.info.items
                    : prev.items,
                logo: prev.logo || prev.l || data.info.logo || data.info.l,
                photos:
                  prev.ph && prev.ph.length > 0
                    ? prev.ph
                    : Array.isArray(data.info.photos) &&
                      data.info.photos.length >= (prev.photos?.length || 0) &&
                      data.info.photos.length > 0
                    ? data.info.photos
                    : prev.photos,
                reviews:
                  Array.isArray(data.info.reviews) && data.info.reviews.length > 0
                    ? data.info.reviews
                    : prev.reviews,
              };
            });
          }
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [info.u]);

  const cfg = getSectorConfig(liveInfo);

  // Replace default gallery images with real Google Maps / Instagram / Telegram photos when available (unless pm === 'studio')
  const fallbackLocalPhotos = getKnownLocalPhotos(liveInfo.n, liveInfo.u);
  const rawRealPhotos =
    liveInfo.pm === 'studio'
      ? []
      : liveInfo.ph && liveInfo.ph.length > 0
      ? liveInfo.ph
      : fallbackLocalPhotos.length > 0
      ? fallbackLocalPhotos
      : liveInfo.photos && liveInfo.photos.length > 0
      ? liveInfo.photos
      : [];

  // Deduplicate and filter out logo URL so the logo never appears as a gallery photo
  const effectiveLogoUrl = liveInfo.logo || liveInfo.l || '';
  const realPhotos = [...new Set(rawRealPhotos)].filter(
    (p) => p && p !== effectiveLogoUrl
  );

  // Always use realPhotos[0] for Hakkımızda and start Galeri at realPhotos[1] so Hakkımızda and Galeri NEVER show the same image
  const aboutPhotoSrc = realPhotos[0] || cfg.aboutImgSrc || cfg.gallery[0].src;
  const activeGallery = cfg.gallery.map((item, idx) => {
    const candidatePhoto = realPhotos[idx + 1];
    if (candidatePhoto) {
      return {
        src: candidatePhoto,
        fallbackSrc: item.src,
        title:
          item.title ||
          (idx === 0
            ? `${liveInfo.n} — İşletme Görseli`
            : idx === 1
            ? `${liveInfo.n} — Hizmet & Ürün Alanı`
            : idx === 2
            ? `${liveInfo.n} — Uygulama & Detay`
            : `${liveInfo.n} — Mekan & Dış Görünüm`),
        subtitle: idx === 0 ? liveInfo.a : liveInfo.c || item.subtitle,
      };
    }
    return { ...item, fallbackSrc: item.src };
  });

  // Combine real Google Maps reviews with sector reviews so ReviewRiver always has at least 4 items
  const combinedReviews =
    liveInfo.reviews && liveInfo.reviews.length > 0
      ? [...liveInfo.reviews, ...cfg.reviews].slice(0, Math.max(4, liveInfo.reviews.length))
      : cfg.reviews;
  const repeatedReviews = [...combinedReviews, ...combinedReviews];

  const digits = liveInfo.p.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  const phoneHref = `+90${digits || '5444775657'}`;
  const isMobilePhone = digits.startsWith('5');

  useEffect(() => {
    document.title = `${liveInfo.n} | Kurumsal Web Sitesi`;
  }, [liveInfo.n]);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.play().catch(() => {});
    }
  }, [cfg.videoSrc]);

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
      const msg = `Merhaba ${liveInfo.n}, ben ${formName}. Konu: ${formSubject}. Not: ${formNote}`;
      window.open(`https://wa.me/90${digits}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `tel:${phoneHref}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      {/* 1. Single-Line Bug-Free Navbar with Bespoke Brand Logo */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${cfg.headerBg} backdrop-blur-md border-b py-3.5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            <a href="#" className="flex items-center gap-3.5 shrink-0 group">
              <BrandLogo
                name={liveInfo.n}
                sector={liveInfo.s}
                category={liveInfo.c}
                logo={liveInfo.logo || liveInfo.l}
                size="md"
              />
              <div className="whitespace-nowrap min-w-0">
                <span className={`block ${cfg.headerText} font-bold text-base tracking-tight leading-none max-w-[200px] sm:max-w-[280px] xl:max-w-[360px] truncate`}>
                  {liveInfo.n.toLocaleUpperCase('tr-TR')}
                </span>
                <span className={`block ${cfg.headerSub} text-[11px] font-medium tracking-widest uppercase mt-1 max-w-[200px] sm:max-w-[280px] xl:max-w-[360px] truncate`}>
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
                <span>{liveInfo.p}</span>
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
                  <span>{liveInfo.p}</span>
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
              ref={videoRef}
              key={cfg.videoSrc}
              src={cfg.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={realPhotos[5] || realPhotos[0] || cfg.posterSrc}
              className="w-full h-full object-cover object-center"
            >
              <source src={cfg.videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/65 to-zinc-950/45" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <BrandLogo
                  name={liveInfo.n}
                  sector={liveInfo.s}
                  category={liveInfo.c}
                  logo={liveInfo.logo || liveInfo.l}
                  size="lg"
                />
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-[2px] ${cfg.heroLine} shrink-0`} />
                  <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${cfg.heroEyebrow}`}>
                    {cfg.eyebrow}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-6">
                {liveInfo.n}.
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
                  <span>{liveInfo.p}</span>
                </a>

                <a
                  href={
                    /instagram\.com/i.test(liveInfo.u)
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(liveInfo.q)}`
                      : liveInfo.u
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-white font-medium text-sm sm:text-base border border-white/20 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Haritada Yol Tarifi</span>
                </a>
              </div>

              <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 text-xs sm:text-sm text-zinc-400">
                <span>Adres: {liveInfo.a}</span>
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
                  <SmartBusinessImage
                    src={aboutPhotoSrc}
                    fallbackSrc={cfg.aboutImgSrc || cfg.gallery[0].src}
                    alt={liveInfo.n}
                  />
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
                {cfg.servicesNavLabel.toLocaleUpperCase('tr-TR')}
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
                  {liveInfo.n} Hakkında Görüşler
                </h2>
              </div>
              <a
                href={liveInfo.u}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium text-white border border-white/15 transition-colors self-start sm:self-auto whitespace-nowrap"
              >
                <span>{/instagram\.com/i.test(liveInfo.u) ? 'Instagram’da Gör' : 'Google Haritalar’da Gör'}</span>
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
                {cfg.galleryNavLabel.toLocaleUpperCase('tr-TR')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                {liveInfo.n} Görselleri
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGallery.map((photo, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <SmartBusinessImage
                      src={photo.src}
                      fallbackSrc={photo.fallbackSrc || cfg.gallery[idx]?.src || cfg.aboutImgSrc}
                      alt={photo.title}
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
                      {liveInfo.p}
                    </a>
                  </div>

                  <div className="py-5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      ADRES
                    </span>
                    <p className="text-base font-semibold text-zinc-900 mt-1">{liveInfo.a}</p>
                  </div>

                  <div className="pt-5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      ÇALIŞMA SAATLERİ
                    </span>
                    <p className="text-base font-semibold text-zinc-900 mt-1">{cfg.hours}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-200 flex flex-wrap gap-3">
                  <a
                    href={
                      /instagram\.com/i.test(liveInfo.u)
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(liveInfo.q)}`
                        : liveInfo.u
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
                  >
                    Google Haritalar’da Yol Tarifi Aç
                  </a>
                  {/instagram\.com/i.test(liveInfo.u) && (
                    <a
                      href={liveInfo.u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-900 text-sm font-semibold transition-colors"
                    >
                      Resmi Instagram Hesabı
                    </a>
                  )}
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
                    Hemen İletişime Geç ({liveInfo.p})
                  </button>
                </form>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white h-[360px]">
              <iframe
                title={`${liveInfo.n} Konumu`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(liveInfo.q)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
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

      {/* Footer with Brand Logo */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 pb-24 sm:pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <BrandLogo
                name={liveInfo.n}
                sector={liveInfo.s}
                category={liveInfo.c}
                logo={liveInfo.logo || liveInfo.l}
                size="md"
              />
              <div>
                <span className="block text-white font-bold text-sm">{liveInfo.n.toLocaleUpperCase('tr-TR')}</span>
                <span className="block text-xs text-zinc-400 mt-1">{cfg.eyebrow}</span>
              </div>
            </div>
            <div className="text-sm text-zinc-300">
              {liveInfo.a} • {liveInfo.p}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} {liveInfo.n}. Tüm hakları saklıdır.</p>
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
            href={
              /instagram\.com/i.test(liveInfo.u)
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(liveInfo.q)}`
                : liveInfo.u
            }
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
