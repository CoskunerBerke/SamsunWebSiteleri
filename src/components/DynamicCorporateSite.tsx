import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Menu, X, Star, ExternalLink } from 'lucide-react';
import BrandLogo from './BrandLogo';

export interface DynamicSiteInfo {
  n: string; // Business Name
  a: string; // Address
  p: string; // Phone Display
  c?: string; // Real Google Maps Categories
  s: string; // Sector key
  q: string; // Map query
  u: string; // Original URL
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
  pillars: { num: string; title: string; desc: string }[];
  servicesSectionTitle: string;
  services: { num: string; title: string; desc: string; detail: string }[];
  reviews: { author: string; role: string; group: string; text: string }[];
  gallery: { src: string; title: string; subtitle: string }[];
}

function getSectorConfig(info: DynamicSiteInfo): SectorConfig {
  const name = info.n;
  const catLabel = info.c ? info.c.toLocaleUpperCase('tr-TR') : '';
  const combinedText = `${info.n} ${info.c || ''} ${info.q}`.toLocaleLowerCase('tr-TR');

  const isBakery =
    info.s === 'bakery_breakfast' ||
    /(börek|borek|poğaça|pogaca|simit|kahvaltı|kahvalti|fırın|firin|unlu|pastane|baklava|künefe|gözleme|mantı|ekmek)/i.test(
      combinedText
    );
  const isCafe =
    !isBakery &&
    (info.s === 'cafe_dessert' ||
      /(kafe|cafe|kahve|coffee|espresso|tatlı|tatli|pasta|waffle|dondurma|çikolata|cikolata)/i.test(combinedText));
  const isSoupPlace =
    !isBakery &&
    !isCafe &&
    (info.s === 'soup_restaurant' ||
      /(çorba|corba|paça|paca|işkembe|iskembe|beyran|mercimek|tarhana|kelle)/i.test(combinedText));

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
    return {
      eyebrow: catLabel || 'KAFE, KAHVE & TATLI MERKEZİ',
      navActionLabel: 'İletişim & Konum',
      servicesNavLabel: 'Menümüz',
      galleryNavLabel: 'Mekanımız',
      heroSubtitle: `${name} olarak taze kavrulmuş kahve çekirdeklerimiz, günlük hazırlanan özel tatlılarımız ve konforlu atmosferimizle keyifli buluşmalarınıza ev sahipliği yapıyoruz.`,
      aboutTitle: 'Özel Kahve Çekirdekleri ve Günlük Taze Tatlılar',
      aboutP1: `${name}, nitelikli kahve kültürünü ve günlük taze pastacılık ürünlerini ferah ve samimi bir mekan tasarımıyla bir araya getirmektedir.`,
      aboutP2:
        'Deneyimli baristalarımızın hazırladığı sıcak ve soğuk kahve çeşitlerimiz, taze demleme çayımız ve usta ellerden çıkan tatlılarımızla günün her saati yanınızdayız.',
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
      pillars: [
        { num: '01', title: 'Taze Kavrulmuş Kahve', desc: 'Seçkin kahve çekirdeklerinden anında öğütülerek hazırlanan espresso ve demleme kahveler.' },
        { num: '02', title: 'Günlük Taze Tatlılar', desc: 'Her gün taze malzemelerle üretilen pasta, cheesecake, sütlü ve çikolatalı tatlı çeşitleri.' },
        { num: '03', title: 'Ferah & Konforlu Ortam', desc: 'Arkadaşlarınızla ve ailenizle keyifle vakit geçirebileceğiniz özenli iç ve dış mekan.' },
        { num: '04', title: 'Güler Yüzlü Sunum', desc: 'Hızlı servis, hijyenik hazırlık ve misafir memnuniyeti odaklı hizmet anlayışı.' },
      ],
      servicesSectionTitle: 'Kahve, Tatlı ve İçecek Menümüz',
      services: [
        { num: '01', title: 'Espresso Bazlı Sıcak Kahveler', desc: 'Latte, Cappuccino, Americano, Flat White, Mocha ve geleneksel közde/kumda Türk kahvesi.', detail: 'Taze Çekirdek • Usta Barista • İdeal Kıvam' },
        { num: '02', title: 'Günlük Pasta & Tatlı Çeşitleri', desc: 'San Sebastian cheesecake, tiramisu, magnolia, kruvasan ve günlük özel dilim pastalar.', detail: 'Günlük Üretim • Doğal Malzeme • Taze Sunum' },
        { num: '03', title: 'Soğuk Kahveler & Ev Yapımı İçecekler', desc: 'Iced Latte, Cold Brew, Frappe, taze meyveli frozen, smoothie ve ev yapımı limonata.', detail: 'Ferahlatıcı Lezzet • Doğal Meyve • Buzlu Sunum' },
        { num: '04', title: 'Kahvaltı & Sıcak Atıştırmalıklar', desc: 'Sandviç çeşitleri, bazlama tost, kruvasan tabakları ve güne zinde başlatan kahvaltılıklar.', detail: 'Sıcak Hazırlık • Doyurucu Porsiyon • Taze Ekmek' },
        { num: '05', title: 'Bitki Çayları & Taze Demleme Çay', desc: 'Özel harman yaprak çaylardan demlenen taze çay ve doğal kış/bitki çayı alternatifleri.', detail: 'Taze Demleme • Doğal Bitkiler • Sıcak İkram' },
        { num: '06', title: 'Grup Buluşmaları & Paket Servis', desc: 'Özel kutlamalar, arkadaş buluşmaları ve paket kahve-tatlı siparişleri için hızlı servis.', detail: 'Konforlu Salon • Paket Servis • Yüksek Hijyen' },
      ],
      reviews: [
        { author: 'Selin Y.', role: 'Google Yorumu', group: 'Kahve & Tatlı', text: 'Kahveleri çok lezzetli, tatlıları her zaman taze. Ortamı çok ferah ve çalışanlar son derece ilgili.' },
        { author: 'Mert K.', role: 'Google Yorumu', group: 'Mekan & Atmosfer', text: 'Arkadaşlarla oturup sohbet etmek için bölgedeki en nezih ve temiz mekanlardan biri.' },
        { author: 'Zeynep A.', role: 'Google Yorumu', group: 'Taze Pasta & Türk Kahvesi', text: 'Sunumları çok şık, fiyatları makul ve hizmet kalitesi gerçekten çok yüksek.' },
        { author: 'Caner T.', role: 'Google Yorumu', group: 'Soğuk İçecekler & Servis', text: 'Yaz kış uğradığımız, kalitesini hiç bozmayan harika bir işletme.' },
      ],
      gallery: [
        { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85', title: `${name} Mekan & Atmosfer`, subtitle: info.a },
        { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85', title: `${name} Nitelikli Kahve Sunumu`, subtitle: 'Taze öğütülmüş kahve çeşitlerimiz' },
        { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85', title: `${name} Günlük Taze Tatlılar`, subtitle: 'Özel tariflerle hazırlanan tatlı ve pastalar' },
        { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85', title: `${name} Misafir ağırlama Alanı`, subtitle: info.a },
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
  const isPhoneOrTech = /(telefon|cep telefonu|iphone|samsung|xiaomi|aksesuar|tablet|bilgisayar|laptop|teknoloji|bilişim|bilisim)/i.test(
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

  // 8. GENEL KURUMSAL İŞLETME / MAĞAZA / KUAFÖR / EMLAK / OFİS / HİZMET
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
      posterSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
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

  // 9. DEFAULT: OTOMOTİV / OTO ELEKTRİK / VAG / OTO SERVİS
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
  const [liveInfo, setLiveInfo] = useState<DynamicSiteInfo>(info);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formNote, setFormNote] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch real Google Maps / Instagram photos, phone, address, categories, and reviews on mount
  useEffect(() => {
    let cancelled = false;
    if (info.u && /^https?:\/\//i.test(info.u)) {
      fetch(`/api/telegram?place=${encodeURIComponent(info.u)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled && data?.ok && data?.info) {
            setLiveInfo((prev) => ({
              ...prev,
              n: data.info.n || prev.n,
              a: data.info.a && data.info.a !== 'Merkez / Türkiye' ? data.info.a : prev.a,
              p: data.info.p && data.info.p !== '0544 477 56 57' ? data.info.p : prev.p,
              c: data.info.c || prev.c,
              s: data.info.s || prev.s,
              q: data.info.q || prev.q,
              photos: Array.isArray(data.info.photos) && data.info.photos.length > 0 ? data.info.photos : prev.photos,
              reviews: Array.isArray(data.info.reviews) && data.info.reviews.length > 0 ? data.info.reviews : prev.reviews,
            }));
          }
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [info.u]);

  const cfg = getSectorConfig(liveInfo);

  // Replace default gallery images with real Google Maps / Instagram photos when available
  const realPhotos = liveInfo.photos || [];
  const activeGallery = cfg.gallery.map((item, idx) => {
    if (realPhotos[idx]) {
      return {
        src: realPhotos[idx],
        title:
          idx === 0
            ? `${liveInfo.n} — İşletme Görseli`
            : idx === 1
            ? `${liveInfo.n} — Hizmet & Ürün Alanı`
            : idx === 2
            ? `${liveInfo.n} — Uygulama & Detay`
            : `${liveInfo.n} — Mekan & Dış Görünüm`,
        subtitle: idx === 0 ? liveInfo.a : liveInfo.c || item.subtitle,
      };
    }
    return item;
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
                size="md"
              />
              <div className="whitespace-nowrap">
                <span className={`block ${cfg.headerText} font-bold text-base tracking-tight leading-none`}>
                  {liveInfo.n.toLocaleUpperCase('tr-TR')}
                </span>
                <span className={`block ${cfg.headerSub} text-[11px] font-medium tracking-widest uppercase mt-1 max-w-[230px] sm:max-w-[340px] truncate`}>
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
              poster={cfg.posterSrc}
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
                  href={liveInfo.u}
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
                  <img
                    src={activeGallery[0].src}
                    alt={liveInfo.n}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
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
                    <img
                      src={photo.src}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
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

                <div className="pt-6 mt-6 border-t border-zinc-200">
                  <a
                    href={liveInfo.u}
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
            href={liveInfo.u}
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
