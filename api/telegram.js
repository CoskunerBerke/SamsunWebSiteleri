const p1 = 'ODY5NzUxNTAxMzo=';
const p2 = 'QUFGRWFqOTJGT0RQbW9iRFVWSXNuTEZDbmJCVmI0b0ZLeUU=';
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  Buffer.from(p1, 'base64').toString('utf8') + Buffer.from(p2, 'base64').toString('utf8');

const SITE_BASE_URL = 'https://samsun-web-siteleri.vercel.app';
const ANKARA_BASE_URL = 'https://ankara-web-siteleri.vercel.app';
const IG_RESIDENTIAL_BRIDGE_URL =
  process.env.IG_BRIDGE_URL || 'https://4f1251462e473f.lhr.life';

const GMAPS_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
  Cookie:
    'SOCS=CAESHAgBEhJnd3NfMjAyMzA4MTAtMF9SQzIaAmVuIAEaBgiAo_CmBg; CONSENT=YES+cb.20230531-04-p0.tr+FX+111',
};

async function sendTelegram(chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...extra,
    }),
  });
}

async function answerCallbackQuery(callbackQueryId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    });
  } catch (_) {}
}

async function editTelegramMessage(chatId, messageId, text, extra = {}) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        disable_web_page_preview: true,
        ...extra,
      }),
    });
  } catch (_) {}
}

function formatBusinessTitle(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 1) return word.toLocaleUpperCase('tr-TR');
      if (/^[A-ZÇĞİÖŞÜ0-9.&/-]+$/.test(word) && word.length <= 5) return word;
      const first = word.charAt(0).toLocaleUpperCase('tr-TR');
      const rest = word.slice(1).toLocaleLowerCase('tr-TR');
      return first + rest;
    })
    .join(' ');
}

function rawSlugify(str) {
  const trMap = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return (
    String(str || '')
      .split('')
      .map((c) => trMap[c] || c)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 45) || 'kurumsal-site'
  );
}

function slugify(str) {
  const raw = rawSlugify(str);
  const words = raw.split('-').filter(Boolean);
  const uniqueWords = [];
  for (const w of words) {
    if (!uniqueWords.includes(w)) {
      uniqueWords.push(w);
    }
  }
  const compact = uniqueWords.slice(0, 4).join('-').slice(0, 36).replace(/-+$/g, '');
  return compact || raw || 'kurumsal-site';
}

const KV_LANG_BUCKETS = [
  'eo', 'ia', 'ie', 'io', 'vo', 'wa', 'yi', 'zu',
  'xh', 'sn', 'st', 'tn', 'ts', 've', 'wo', 'yo',
];

const GLOBAL_SLUG_CACHE = new Map();

const SEED_SITES = {
  'sweden-pizza': {
    l: '/logos/sweden-pizza.svg',
    logo: '/logos/sweden-pizza.svg',
    n: 'Sweden Pizza',
    a: 'Etlik, Etlik Cd No:128/D, 06010 Keçiören/Ankara, Türkiye',
    p: '+90 312 326 43 63',
    c: 'Pizza Restoranı',
    s: 'pizza_italian',
    q: 'Sweden Pizza, Etlik, Etlik Cd No:128/D, 06010 Keçiören/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/F2Vz8UzzreoNzbBo6?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Sweden Pizza, 35 yıllık tecrübesiyle pizzayı sadece yemek değil, keyifli bir anıya dönüştürüyor. Her biri özenle seçilmiş malzemelerle hazırlanan pizzalarımız; klasiklerden özel tariflere, herkesin damak zevkine hitap ediyor. Samimi ortamı, hızlı servisi ve uygun fiyatlarıyla gerçek pizza severlerin vazgeçilmezi haline geldik.',
    hr: 'Pazartesi – Cuma: 11:00 – 22:00 • Hafta Sonu: 12:00 – 22:00',
    rt: '4.9',
    rc: 227,
  },
  'bagdat-tatlisi-lokantasi': {
    l: '/logos/bagdat-tatlisi.svg',
    logo: '/logos/bagdat-tatlisi.svg',
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı & Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve tek adresinde Ankara Çankaya Maltepe’de misafirlerini ağırlamaktadır.',
    hr: 'Her Gün: 09:00 – 20:00',
    rt: '4.7',
    rc: 328,
  },
  'bagdat-tatlisi-bagdat-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı & Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve tek adresinde Ankara Çankaya Maltepe’de misafirlerini ağırlamaktadır.',
    hr: 'Her Gün: 09:00 – 20:00',
    rt: '4.7',
    rc: 328,
  },
  'bagdat-tatlisi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı & Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve tek adresinde Ankara Çankaya Maltepe’de misafirlerini ağırlamaktadır.',
    hr: 'Her Gün: 09:00 – 20:00',
    rt: '4.7',
    rc: 328,
  },
  'diestro-garage': {
    n: 'Diestro Garage',
    a: 'İvedik OSB, Yenimahalle / Ankara',
    p: '0530 916 09 61',
    c: 'Boya Koruma • Pasta Cila • Seramik Kaplama • PPF • Detailing',
    s: 'auto_detailing',
    q: 'Diestro Garage, İvedik OSB, Yenimahalle / Ankara',
    u: 'https://www.instagram.com/diestrogarage/',
    l: '/diestro-logo.jpg',
    logo: '/diestro-logo.jpg',
    city: 'Ankara',
    pm: 'auto',
  },
  'coffe-rozz': {
    n: 'Coffe Rozz',
    a: 'Çankaya / Ankara',
    p: '0544 477 56 57',
    c: 'Üçüncü Nesil Kahve • Espresso Bar • Taze Tatlılar',
    s: 'cafe_dessert',
    q: 'Coffe Rozz, Çankaya / Ankara',
    u: 'https://www.instagram.com/cofferozz/',
    l: '/cofferozz-logo.jpg',
    logo: '/cofferozz-logo.jpg',
    city: 'Ankara',
    pm: 'auto',
  },
  'gada-coffee-eatery': {
    l: '/logos/gada-coffee-eatery.svg',
    logo: '/logos/gada-coffee-eatery.svg',
    n: 'GADA Coffee & Eatery',
    a: 'Güvenevler, Kıbrıs Sk. 29-B, 06690 Çankaya/Ankara',
    p: '0506 844 79 76',
    c: '3. Nesil Kahve • Glutensiz & Vegan Mutfak • Gurme Sandviç & Bowl',
    s: 'cafe_dessert',
    q: 'GADA Coffee & Eatery, Güvenevler, Kıbrıs Sk. 29-B, 06690 Çankaya/Ankara',
    u: 'https://share.google/MbNxAFEuisYWmYwlb',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Ayrancı Güvenevler Kıbrıs Sokak’ta 2021 yılından bu yana 3. nesil nitelikli kahve kültürünü; glutensiz ve vegan dostu mutfak anlayışı, ekşi mayalı gurme sandviçler, sağlıklı bowl tabakları ve el açması özel soslu gözlemelerle buluşturuyoruz.',
    hr: 'Hafta İçi & Cumartesi: 08:00 – 22:00 • Pazar: 10:00 – 19:00',
    rt: '4.9',
    rc: 157,
    ph: [
      '/images/gada-coffee-eatery/1.jpg',
      '/images/gada-coffee-eatery/2.jpg',
      '/images/gada-coffee-eatery/3.jpg',
      '/images/gada-coffee-eatery/4.jpg',
      '/images/gada-coffee-eatery/5.jpg',
      '/images/gada-coffee-eatery/6.jpg',
    ],
    photos: [
      '/images/gada-coffee-eatery/1.jpg',
      '/images/gada-coffee-eatery/2.jpg',
      '/images/gada-coffee-eatery/3.jpg',
      '/images/gada-coffee-eatery/4.jpg',
      '/images/gada-coffee-eatery/5.jpg',
      '/images/gada-coffee-eatery/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 Nitelikli Demleme & 3. Nesil Kahve',
        desc: 'Taze kavrulmuş üst segment kahve çekirdeklerinin aromatik notalarını tam kıvamında sunan V60 demleme ve espresso bazlı kahveler.',
        detail: 'V60 Demleme • %100 Arabica • Taze Çekirdek',
      },
      {
        num: '02',
        title: 'Dana Fümeli & Glutensiz Gurme Sandviçler',
        desc: 'Özel yapım taze ekmekler ve glutensiz alternatiflerle hazırlanan dana fümeli, peynirli ve taze yeşillikli doyurucu sandviçler.',
        detail: 'Dana Fümeli • Glutensiz Seçenek • Günlük Ekmek',
      },
      {
        num: '03',
        title: 'Glutensiz & Vegan Dostu Mutfak',
        desc: 'Farklı beslenme tercihlerine özenle hazırlanan %100 glutensiz ve bitkisel (vegan) sıcak-soğuk tabaklar ve tatlılar.',
        detail: 'Glutensiz • Vegan & Vejetaryen • Sağlıklı Reçete',
      },
      {
        num: '04',
        title: 'Özel Yoğurt Soslu El Açması Gözleme',
        desc: 'Sipariş üzerine sıcak hazırlanan ve özel yoğurtlu-baharatlı sos dokunuşuyla servis edilen imza gözleme lezzetimiz.',
        detail: 'Özel Yoğurtlu Sos • Sıcak Hazırlık • İmza Lezzet',
      },
      {
        num: '05',
        title: 'Sağlıklı Bowl, Salata & Tost Çeşitleri',
        desc: 'Taze mevsim sebzeleri, tahıllar ve doğal soslarla dengelenmiş besleyici kase (bowl) ve sıcak tost alternatifleri.',
        detail: 'Besleyici Bowl • Taze Salata • Dengeli Öğün',
      },
      {
        num: '06',
        title: 'Butik Tasarım Mağaza & Pet-Friendly Ortam',
        desc: 'Patili dostlarınızla birlikte keyifle vakit geçirebileceğiniz sıcak atmosfer ve özgün tasarım aksesuar köşemiz.',
        detail: 'Hayvan Dostu (Pet Friendly) • Tasarım Köşesi • Ayrancı',
      },
    ],
    reviews: [
      {
        author: 'Tangün Caner',
        role: 'Google Yorumu',
        group: 'Nitelikli Kahve & Sandviç',
        text: 'Ayrancı’da hem nitelikli kahve içip hem de gerçek bir sandviç yiyebileceğimiz bir yer bulduk. Kahveleri gerçekten üst segment, yanında denediğimiz yoğurt soslu gözleme ve glütensiz sandviç çok lezzetli ve doyurucuydu.',
      },
      {
        author: 'Fatma Ceyhan',
        role: 'Google Yorumu',
        group: 'V60 Demleme & 3. Nesil Kahve',
        text: 'Ayrancı’da nitelikli kahve içebileceğiniz nadir noktalardan biri. Özellikle V60 demleme konusunda çok hassaslar. Çekirdeğin notalarını tam olması gerektiği gibi alabiliyorsunuz.',
      },
      {
        author: 'İf Fet',
        role: 'Google Yorumu',
        group: 'Glutensiz & Vegan Menü',
        text: 'Dükkanın enerjisi çok yüksek, ekip çok ilgili. Kendimi evimde gibi hissettiğim mekanlardan. Yemek menüsünde herkes düşünülmüş, glutensiz ve vegan yemekler de var.',
      },
      {
        author: 'Doğa Baysal',
        role: 'Google Yorumu',
        group: 'Yoğurt Soslu Gözleme',
        text: 'Çok lezzetli bir gözlemeydi. Çalışanlar çok güler yüzlüydü. Özellikle yoğurtlu sosa bayıldık, gözlemeye adeta seviye atlatmış.',
      },
    ],
  },
  'koala-coffee-shop': {
    l: '/logos/koala-coffee-shop.svg',
    logo: '/logos/koala-coffee-shop.svg',
    n: 'Koala Coffee Shop',
    a: 'Barbaros, Bülten Sk. No:21-C, 06660 Çankaya/Ankara',
    p: '0542 151 65 06',
    c: '3. Nesil Kahve • Ev Yapımı Tatlılar • Butik Kafe',
    s: 'cafe_dessert',
    q: 'Koala Coffee Shop, Barbaros, Bülten Sk. No:21-C, 06660 Çankaya/Ankara',
    u: 'https://share.google/CrmptmO8mkwKoazMD',
    city: 'Ankara',
    pm: 'auto',
    bio: '2016 yılından bu yana Tunalı Bülten Sokak’ta sakin, huzurlu ve hayvan dostu atmosferiyle misafirlerini ağırlayan Koala Coffee Shop; taze demlenen kahveleri ve günlük tatlılarıyla şehrin kalbinde samimi bir mola noktası sunuyor.',
    hr: 'Hafta İçi: 11:00 – 23:00 • Hafta Sonu: 10:00 – 00:00',
    rt: '4.5',
    rc: 428,
    ph: [
      '/images/koala-coffee-shop/1.jpg',
      '/images/koala-coffee-shop/2.jpg',
      '/images/koala-coffee-shop/3.jpg',
      '/images/koala-coffee-shop/4.jpg',
      '/images/koala-coffee-shop/5.jpg',
      '/images/koala-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/koala-coffee-shop/1.jpg',
      '/images/koala-coffee-shop/2.jpg',
      '/images/koala-coffee-shop/3.jpg',
      '/images/koala-coffee-shop/4.jpg',
      '/images/koala-coffee-shop/5.jpg',
      '/images/koala-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Espresso Bazlı Nitelikli Kahveler',
        desc: 'Taze kavrulmuş çekirdeklerden hazırlanan Latte, Cappuccino, Flat White, Americano ve aromatik sıcak kahve çeşitleri.',
        detail: 'Taze Çekirdek • Usta Barista • Dengeli İçim',
      },
      {
        num: '02',
        title: 'Ev Yapımı Tiramisu & Günlük Tatlılar',
        desc: 'Kahvenizin yanına eşlik eden tam kıvamında ev yapımı tiramisu, cheesecake ve günlük taze vitrin tatlıları.',
        detail: 'Günlük Taze • Ev Yapımı Tiramisu • Hafif Lezzet',
      },
      {
        num: '03',
        title: 'Buzlu Kahveler & Yazlık Soğuk İçecekler',
        desc: 'Sıcak günlerde ferahlatan Iced Latte, Cold Brew, Iced Americano ve doğal meyveli soğuk içecek alternatifleri.',
        detail: 'Soğuk Demleme • Buzlu Sunum • Ferahlatıcı',
      },
      {
        num: '04',
        title: 'Üçüncü Nesil Filtre & Demleme Kahve',
        desc: 'Günlük taze öğütülerek demlenen filtre kahve ve tek kökenli nitelikli kahve seçenekleri.',
        detail: 'Günlük Öğütüm • Yumuşak İçim • Zengin Aroma',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Bitki Çayları',
        desc: 'Uzun sohbetlerinize eşlik eden taze demleme çay, doğal kış ve bitki çayı harmanları.',
        detail: 'Sıcak İkram • Doğal Bitki Çayları • Samimi Sunum',
      },
      {
        num: '06',
        title: 'Bülten Sokak Bahçe & Hayvan Dostu Ortam',
        desc: '2016’dan beri Bülten Sokak’ın kalabalığından uzak, hayvansever ve huzurlu iç-dış mekan atmosferi.',
        detail: '2016’dan Beri • Hayvan Dostu • Sakin Bahçe',
      },
    ],
    reviews: [
      {
        author: 'Hasan Özkara',
        role: 'Google Yorumu',
        group: 'Tiramisu & Kahve',
        text: 'Bülten Sokağın kalabalığından etkilenmemiş, sakin ve sıcak bir yer. Tiramisu ve kahveler çok güzeldi, fiyatları da gayet makul. Sade ve samimi bir atmosferi var.',
      },
      {
        author: 'Eda Altuntaş',
        role: 'Google Yorumu',
        group: 'Tatlılar & Hayvan Dostu Ortam',
        text: 'İçecekleri ve tatlıları çok lezzetli. Çalışanlar ilgili ve sıcakkanlılar. Ayrıca hayvansever olmaları çok hoşuma gitti, arkadaşlarınızla keyifle gidebileceğiniz güzel bir mekan.',
      },
      {
        author: 'Yağmur Çelik',
        role: 'Google Yorumu',
        group: 'Kahve & Mekan',
        text: 'Kahveleri ve ortamı çok iyi, Ankara’da bulunduğum süre boyunca keyifle vakit geçirdiğim favori konumum oldu.',
      },
      {
        author: 'Serhan Toprak',
        role: 'Google Yorumu',
        group: 'Atmosfer & Lezzet',
        text: 'Çok huzurlu ve keyifli bir ortam, çok severek geliyoruz. Kahveleri her zaman taze ve lezzetli.',
      },
    ],
  },
  'sloth-coffee-shop': {
    l: '/logos/sloth-coffee-shop.svg',
    logo: '/logos/sloth-coffee-shop.svg',
    n: 'Sloth Coffee Shop',
    a: 'Ayrancı, Güvenlik Cd. 36/A, 06540 Çankaya/Ankara',
    p: '0538 417 56 84',
    c: 'Kahve Dükkanı • Ev Yapımı Kek, Kurabiye & Sandviç',
    s: 'cafe_dessert',
    q: 'Sloth Coffee Shop, Ayrancı, Güvenlik Cd. 36/A, 06540 Çankaya/Ankara',
    u: 'https://share.google/nloykhv1qQvTwpMv6',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Ayrancı Güvenlik Caddesi’nde tüm tatlı, kek, kurabiye ve sandviçlerini kendi mutfağında ev yapımı olarak hazırlayan Sloth Coffee Shop; içerideki taze fırın kokusu, dingin müzikleri ve sıcak atmosferiyle ev konforunda bir kahve deneyimi sunuyor.',
    hr: 'Her Gün: 08:30 – 23:00',
    rt: '4.5',
    rc: 376,
    ph: [
      '/images/sloth-coffee-shop/1.jpg',
      '/images/sloth-coffee-shop/2.jpg',
      '/images/sloth-coffee-shop/3.jpg',
      '/images/sloth-coffee-shop/4.jpg',
      '/images/sloth-coffee-shop/5.jpg',
      '/images/sloth-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/sloth-coffee-shop/1.jpg',
      '/images/sloth-coffee-shop/2.jpg',
      '/images/sloth-coffee-shop/3.jpg',
      '/images/sloth-coffee-shop/4.jpg',
      '/images/sloth-coffee-shop/5.jpg',
      '/images/sloth-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Espresso & Taze Demleme Kahveler',
        desc: 'Seçkin çekirdeklerden anında öğütülerek hazırlanan Latte, Americano, Cappuccino ve filtre kahve çeşitleri.',
        detail: 'Taze Öğütüm • Dengeli Aroma • Sıcak & Soğuk',
      },
      {
        num: '02',
        title: 'Ev Yapımı Fırından Sıcak Kek & Kurabiyeler',
        desc: 'Kendi mutfağımızda günlük olarak pişirilen, tüm mekana tatlı ev mutfağı kokusu yayan taze kek ve kurabiyelerimiz.',
        detail: '%100 Ev Yapımı • Günlük Fırından • Doğal Malzeme',
      },
      {
        num: '03',
        title: 'Günlük Ev Yapımı Sandviç Çeşitleri',
        desc: 'Taze ekmekler ve özenle seçilen şarküteri-peynir malzemeleriyle sipariş üzerine hazırlanan doyurucu sandviçler.',
        detail: 'Taze Hazırlık • Ev Yapımı Soslar • Doyurucu Öğün',
      },
      {
        num: '04',
        title: 'Günlük Butik Tatlılar & Pastalar',
        desc: 'Kahve keyfinize eşlik eden, tamamı kendi üretimimiz olan günlük taze tatlı ve pasta alternatifleri.',
        detail: 'Kendi Üretimimiz • Taze Sunum • Hafif Reçete',
      },
      {
        num: '05',
        title: 'Sıcak Demleme Çay & Bitki Çayları',
        desc: 'Soğuk Ankara akşamlarında içinizi ısıtan taze demlenmiş çay ve doğal bitki çayı çeşitlerimiz.',
        detail: 'Taze Demleme • Kış Çayları • Sıcak Atmosfer',
      },
      {
        num: '06',
        title: 'Kitap Okuma & Sakin Sohbet Ortamı',
        desc: 'Dingin müzik listesi, özenli dekorasyonu ve huzurlu atmosferiyle kitap okumak veya dostlarla sohbet etmek için ideal alan.',
        detail: 'Dingin Müzik • Sıcak Dekorasyon • Güvenlik Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Çağlar Akay',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Kek & Kahve',
        text: 'Yıllardır severek gelirim, ürün kalitesini çok beğeniyorum. İçeride tatlı bir ev mutfağında sohbet eşliğinde kek ve kahve kokusu var. Müzikler ortamın sakin havasına çok uygun.',
      },
      {
        author: 'Orkun K.',
        role: 'Google Yorumu',
        group: 'Kek, Kurabiye & Çay',
        text: 'Soğuk bir Ankara akşamında yürüyüş sonrası girip çay içip kek ve kurabiye yediğimiz çok tatlı bir işletme. Kek tam bir ev keki kıvamındaydı, kurabiyeler de çok lezzetliydi.',
      },
      {
        author: 'Yasin Çiftçi',
        role: 'Google Yorumu',
        group: 'Kitap & Kahve Molası',
        text: 'Arkadaşınla keyifli sohbetler yapmalık veya kahveni yudumlarken kitabını alıp zaman geçirmelik çok hoş ve huzurlu bir kafe.',
      },
      {
        author: 'Selin A.',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Sandviç & Tatlı',
        text: 'Hem sandviçlerinin hem de tatlılarının kendi mutfaklarında yapıldığı ilk lokmada belli oluyor. Güvenlik Caddesi’nin en samimi durağı.',
      },
    ],
  },
  'padam-coffee-shop': {
    l: '/logos/padam-coffee-shop.svg',
    logo: '/logos/padam-coffee-shop.svg',
    n: 'Padam Coffee Shop',
    a: 'Remzi Oğuz Arık Mah., Atatürk Blv. No:237 D:16, 06680 Çankaya/Ankara',
    p: '0312 426 77 26',
    c: '3. Nesil Kahve • İtalyan Tiramisu & Butik Tatlılar',
    s: 'cafe_dessert',
    q: 'Padam Coffee Shop, Remzi Oğuz Arık, Atatürk Blv No:237 D:16, 06680 Çankaya/Ankara',
    u: 'https://share.google/wQg1sf5z5ghW0gSFj',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Kuğulu Park’ın hemen yanı başında, Tunalı’nın hareketliliğinden sıyrılıp huzurla nefes alabileceğiniz Padam Coffee Shop; işletme sahibesi tarafından günlük taze hazırlanan orijinal İtalyan tatlıları, kurabiyeleri ve nitelikli kahveleriyle butik bir deneyim sunuyor.',
    hr: 'Hafta İçi: 07:30 – 21:00 • Cumartesi: 09:30 – 21:00 • Pazar: 10:00 – 21:00',
    rt: '4.4',
    rc: 349,
    ph: [
      '/images/padam-coffee-shop/1.jpg',
      '/images/padam-coffee-shop/2.jpg',
      '/images/padam-coffee-shop/3.jpg',
      '/images/padam-coffee-shop/4.jpg',
      '/images/padam-coffee-shop/5.jpg',
      '/images/padam-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/padam-coffee-shop/1.jpg',
      '/images/padam-coffee-shop/2.jpg',
      '/images/padam-coffee-shop/3.jpg',
      '/images/padam-coffee-shop/4.jpg',
      '/images/padam-coffee-shop/5.jpg',
      '/images/padam-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Latte, Americano & Espresso Bar',
        desc: 'Ankara’nın en beğenilen yumuşak içimli Latte’si, dengeli Americano ve taze çekirdeklerden hazırlanan 3. nesil kahveler.',
        detail: 'İmza Latte • Americano • Taze Kavrum Çekirdek',
      },
      {
        num: '02',
        title: 'Orijinal İtalyan Tarifli Taze Tiramisu',
        desc: 'Gerçek İtalyan reçetesiyle günlük taze hazırlanan, yoğun talep gören ve kısa sürede tükenen imza tiramisu tatlımız.',
        detail: 'Orijinal İtalyan Tarifi • Günlük Taze • İmza Tatlı',
      },
      {
        num: '03',
        title: 'İtalyan Babà Tatlısı & Özel Reçeteler',
        desc: 'İtalyan mutfağına özgü özel şerbetli Babà tatlısı ve başka yerde bulamayacağınız özgün dünya tatlıları.',
        detail: 'Özgün Reçete • Butik Üretim • El Yapımı',
      },
      {
        num: '04',
        title: 'Ev Yapımı Cheesecake & Cookie Çeşitleri',
        desc: 'Her sabah taze fırınlanan tereyağlı kurabiyeler (cookies) ve mevsim meyveli/klasik cheesecake dilimleri.',
        detail: 'Taze Cookie • Cheesecake • Günlük Fırından',
      },
      {
        num: '05',
        title: 'Buzlu Kahveler & Paket Tatlı Siparişi',
        desc: 'Ferahlatıcı soğuk kahveler, al-götür (take-away) servis ve özel günler için dışarıdan tatlı sipariş imkanı.',
        detail: 'Soğuk Kahveler • Paket Tatlı • Hızlı Servis',
      },
      {
        num: '06',
        title: 'Kuğulu Park Yanı Bahçe & Butik Atmosfer',
        desc: 'Kuğulu Park’ın hemen arkasında, sıcak iç dekorasyonu ve keyifli bahçesiyle Tunalı’da huzurlu bir mola noktası.',
        detail: 'Kuğulu Park Yanı • Bahçe Keyfi • Sıcak Atmosfer',
      },
    ],
    reviews: [
      {
        author: 'İlkim Tan',
        role: 'Google Yorumu',
        group: 'Orijinal İtalyan Tiramisu',
        text: 'Yıllardır nefes almaya gittiğim yer. Yiyecekler çok lezzetli ve taze yapılıyor. Özellikle Tiramisu orijinal tarif ile yapılan tam bir İtalyan lezzeti. Kuğulu Parkın yanında oldukça rahatlatıcı bir atmosferi var.',
      },
      {
        author: 'İpek Arya',
        role: 'Google Yorumu',
        group: '3. Nesil Kahve & Ev Yapımı Tatlı',
        text: 'Her ürünü sahibesi tarafından zevkle ve taze taze yapılan, kahveleri oldukça lezzetli olan, içerisi evinizdeymiş hissi yaşatan ve bahçesinde keyifle oturduğumuz 3. nesil kahve ve tatlı dükkanı.',
      },
      {
        author: 'Figen B.',
        role: 'Google Yorumu',
        group: 'Kahve & Kurabiye',
        text: 'Çok güzel bir kahve dükkanı. Hem kahveler hem de kurabiyeler çok iyi. Ortam çok huzurlu, Kuğulu Park’a çok yakın. Mutlaka gidilmeli.',
      },
      {
        author: 'Volkan K.',
        role: 'Google Yorumu',
        group: 'Butik Atmosfer',
        text: 'Mekan sıcak, rahat ve butik bir his veriyor; özellikle Kuğulu Park’a yakın olmasıyla sakin bir kahve ve tatlı molası için ideal.',
      },
    ],
  },
  'f451-brew': {
    l: '/logos/f451-brew.svg',
    logo: '/logos/f451-brew.svg',
    n: 'F451 Brew.',
    a: 'Kavaklıdere, John F. Kennedy Cd. No:31 D:C, 06680 Çankaya/Ankara',
    p: '0312 425 83 16',
    c: '3. Nesil Nitelikli Kahve • V60 Demleme • Organik Çekirdek',
    s: 'cafe_dessert',
    q: 'F451 Brew., Kavaklıdere, John F. Kennedy Cd. No:31 D:C, 06680 Çankaya/Ankara',
    u: 'https://share.google/yeX54i5IqjazVb8tu',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Adını Ray Bradbury’nin ünlü romanı Fahrenheit 451’den alan F451 Brew, Kavaklıdere Kennedy Caddesi’nde taze ve organik nitelikli kahve çekirdeklerini usta demleme teknikleriyle buluşturarak her fincanda benzersiz bir lezzet sunuyor.',
    hr: 'Hafta İçi: 09:00 – 21:00 • Cumartesi: 10:00 – 20:00 • Pazar: 12:00 – 18:00',
    rt: '4.8',
    rc: 52,
    ph: [
      '/images/f451-brew/1.jpg',
      '/images/f451-brew/2.jpg',
      '/images/f451-brew/3.jpg',
      '/images/f451-brew/4.jpg',
      '/images/f451-brew/5.jpg',
      '/images/f451-brew/6.jpg',
    ],
    photos: [
      '/images/f451-brew/1.jpg',
      '/images/f451-brew/2.jpg',
      '/images/f451-brew/3.jpg',
      '/images/f451-brew/4.jpg',
      '/images/f451-brew/5.jpg',
      '/images/f451-brew/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 & 3. Nesil Nitelikli Demleme',
        desc: 'Farklı yörelerin nitelikli kahve çekirdeklerini hassas derece ve demleme teknikleriyle fincanınıza taşıyan manuel demlemeler.',
        detail: 'V60 Pour Over • Hassas Demleme • Zengin Notalar',
      },
      {
        num: '02',
        title: 'Taze & Organik Çekirdek Seçkisi',
        desc: 'Kolombiya ve dünya kahve bölgelerinden özenle seçilen organik, taze kavrulmuş üst segment kahve çekirdekleri.',
        detail: 'Organik Çekirdek • Taze Kavrum • Single Origin',
      },
      {
        num: '03',
        title: 'İmza Americano, Latte & Espresso Bar',
        desc: 'Yüksek gövdeli veya meyvemsi profilleriyle damak zevkinize göre hazırlanan sıcak ve soğuk espresso bazlı kahveler.',
        detail: 'Kolombiya Profili • Usta Barista • Dengeli Krema',
      },
      {
        num: '04',
        title: 'Cheesecake & Kahve Yanı Taze Tatlılar',
        desc: 'Nitelikli kahvenizin aromasını tamamlayan günlük taze cheesecake ve butik tatlı alternatifleri.',
        detail: 'Günlük Taze • Cheesecake • Kahve Eşlikçisi',
      },
      {
        num: '05',
        title: 'Cold Brew & Buzlu Yaz Kahveleri',
        desc: 'Uzun saatler soğuk demlenen Cold Brew ve yaz aylarında bahçe keyfinize eşlik eden buzlu kahveler.',
        detail: 'Soğuk Demleme • Buzlu Latte • Ferah İçim',
      },
      {
        num: '06',
        title: 'Mimari Tasarım Mekan & Hayvan Dostu Atmosfer',
        desc: 'Kennedy Caddesi’nde iç mimarisiyle beğeni toplayan, müzikleri ve hayvan dostu yaklaşımıyla öne çıkan mahalle kahvecisi.',
        detail: 'Özgün İç Mimari • Hayvan Dostu • Kennedy Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Mustafa Volkan Gürbüz',
        role: 'Google Yorumu',
        group: 'Nitelikli Demleme & Barista',
        text: 'Mahallemizin nitelikli kahvecisi. İstediğiniz demleme türünü nitelikli kahvelerle bilen ellerden içeceğiniz çok samimi bir mekan. Güler yüzlü karşılamaları ve açık alanı harika.',
      },
      {
        author: 'Seçil Öztürk',
        role: 'Google Yorumu',
        group: 'Çekirdek Kahve & İç Mimari',
        text: 'Çekirdek kahvede gerçekten gündem yaratan bir mekan. İç mimar olarak mekan tasarımını da çok beğendim. Arkadaşlarımızla çok keyifli vakit geçirdik.',
      },
      {
        author: 'Denizhan Acar',
        role: 'Google Yorumu',
        group: 'Americano & Atmosfer',
        text: 'Ankara’da kahve dendiğinde akla gelecek ilk yerlerden. Kendinizi Kolombiya’da hissetmeniz bir Americano’ya bakıyor. Çok tatlı bir ortam, keyifli insanlar ve güzel müzikler.',
      },
      {
        author: 'N. Akbıyık',
        role: 'Google Yorumu',
        group: 'Kahve Lezzeti',
        text: 'Kahveleri çok lezzetli, çalışanlar ilgili, kibar ve çok tatlılar. Son zamanlarda içtiğim en iyi kahvelerdendi.',
      },
    ],
  },
  'kakule-kahve': {
    l: '/logos/kakule-kahve.svg',
    logo: '/logos/kakule-kahve.svg',
    n: 'Kakule Kahve',
    a: 'Kavaklıdere, Kızılırmak Cd. No:17, 06680 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: 'Kahve Dükkanı • İmza Tatlılar & Sıcak Mutfak',
    s: 'cafe_dessert',
    q: 'Kakule Kahve, Kavaklıdere, Kızılırmak Cd. No:17, 06680 Çankaya/Ankara',
    u: 'https://share.google/rvifRzpuSxjAxet6F',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Kavaklıdere Kızılırmak Caddesi’nde 2.200’den fazla misafir değerlendirmesiyle Ankara’nın en sevilen buluşma noktalarından biri olan Kakule Kahve; kavrulmuş fındık soslu imza Rocher tatlısı, meyveli fıstıklı tartı, zengin sıcak mutfağı ve keyifli bahçesiyle hizmet veriyor.',
    hr: 'Her Gün: 09:00 – 23:00',
    rt: '4.3',
    rc: 2295,
    ph: [
      '/images/kakule-kahve/1.jpg',
      '/images/kakule-kahve/2.jpg',
      '/images/kakule-kahve/3.jpg',
      '/images/kakule-kahve/4.jpg',
      '/images/kakule-kahve/5.jpg',
      '/images/kakule-kahve/6.jpg',
    ],
    photos: [
      '/images/kakule-kahve/1.jpg',
      '/images/kakule-kahve/2.jpg',
      '/images/kakule-kahve/3.jpg',
      '/images/kakule-kahve/4.jpg',
      '/images/kakule-kahve/5.jpg',
      '/images/kakule-kahve/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza Rocher Tatlısı (Kavrulmuş Fındık Soslu)',
        desc: 'İçindeki özel kavrulmuş fındık sosu ve Belçika çikolatası katmanlarıyla Kakule Kahve’nin en çok tercih edilen imza tatlısı.',
        detail: 'Kavrulmuş Fındık Sosu • İmza Reçete • Günlük Taze',
      },
      {
        num: '02',
        title: 'Meyveli Fıstıklı Tart & Patisserie Vitrini',
        desc: 'Taze mevsim meyveleri, Antep fıstığı ve özel pastacı kremasıyla günlük hazırlanan tart, cheesecake ve dilim pastalar.',
        detail: 'Meyveli Fıstıklı Tart • Günlük Üretim • Şık Sunum',
      },
      {
        num: '03',
        title: 'Sıcak Mutfak & Doyurucu Yemek Menüsü',
        desc: 'Kahve ve tatlıların yanı sıra gün boyu 5 dakika gibi kısa sürede sıcak servis edilen zengin mutfak ve yemek seçenekleri.',
        detail: 'Zengin Mutfak • Hızlı Servis • Doyurucu Porsiyon',
      },
      {
        num: '04',
        title: 'Nitelikli Sıcak & Buzlu Kahve Çeşitleri',
        desc: 'Espresso, Latte, Iced Latte, Türk kahvesi ve özel aromalı sıcak-soğuk kahve alternatifleri.',
        detail: 'Sıcak & Buzlu Kahveler • Taze Çekirdek • Barista Sunumu',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Ev Yapımı İçecekler',
        desc: 'Tatlılarınızın yanında taze demlenen çay, bitki çayları ve ferahlatıcı ev yapımı soğuk içecekler.',
        detail: 'Taze Çay • Doğal İçecekler • Hızlı İkram',
      },
      {
        num: '06',
        title: 'Keyifli Bahçe, Balkon & Samimi İç Mekan',
        desc: 'Kızılırmak Caddesi’nde hem açık bahçe-balkon alanı hem de sıcak iç mekanıyla arkadaş buluşmaları için ideal atmosfer.',
        detail: 'Bahçe & Balkon • Güler Yüzlü Ekip • Kızılırmak Cd.',
      },
    ],
    reviews: [
      {
        author: 'Hamitcan Vural',
        role: 'Google Yorumu',
        group: 'Yemek, Kahve & Hızlı Servis',
        text: 'Çok samimi, çok sıcak; sanki evimde yemek yiyorum ve kahvemi yudumluyorum hissiyatı aldım. Sipariş ettiğimiz her şey yemekler de dahil çok hızlı geldi ve tatları harikaydı.',
      },
      {
        author: 'Neslihan Kamacı',
        role: 'Google Yorumu',
        group: 'Rocher & Meyveli Fıstıklı Tart',
        text: 'Meyveli Fıstıklı Tart ve Rocher siparişi verdik. Rocher tatlısının içindeki kavrulmuş fındık sos gayet güzeldi. Arkadaşlarla vakit geçirmek için çok keyifli bir kafe.',
      },
      {
        author: 'Hafize Hazır',
        role: 'Google Yorumu',
        group: 'Bahçe Atmosferi & Tatlılar',
        text: 'Mekanın atmosferi özellikle bahçe kısmı çok güzel. Kalabalık olmasına rağmen servis hızlı yapıldı, personeller çok güler yüzlü ve tatlıları harikaydı.',
      },
      {
        author: 'Sude K.',
        role: 'Google Yorumu',
        group: 'Mekan & İlgi',
        text: 'Çalışanlar o kadar tatlı ve ilgili ki, mekanın enerjisi ve dekorasyonu da çok güzel. Kavaklıdere’de favori durağımız.',
      },
    ],
  },
  'kanta-coffee-shop': {
    l: '/logos/kanta-coffee-shop.svg',
    logo: '/logos/kanta-coffee-shop.svg',
    n: 'KANTA Coffee Shop',
    a: 'Yukarı Bahçelievler, 65. Sk. No:4, 06490 Çankaya/Ankara',
    p: '0533 416 17 18',
    c: 'Kahve Dükkanı • Figür Boyama Workshop • Çalışma Alanı',
    s: 'cafe_dessert',
    q: 'KANTA Coffee Shop, Yukarı Bahçelievler, 65. Sk. No:4, 06490 Çankaya/Ankara',
    u: 'https://share.google/Jqu5BDFZjGT1bcUuM',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Bahçelievler 65. Sokak’ta “Salıncaklı Kahveci” olarak bilinen KANTA Coffee Shop; imza kahveleri (Kantaçino & Berry Love), öncülük ettiği figür boyama workshop etkinlikleri, hayvan dostu bahçesi ve çalışma alanlarıyla genç ve enerjik bir deneyim sunuyor.',
    hr: 'Her Gün: 08:00 – 00:00',
    rt: '4.4',
    rc: 769,
    ph: [
      '/images/kanta-coffee-shop/1.jpg',
      '/images/kanta-coffee-shop/2.jpg',
      '/images/kanta-coffee-shop/3.jpg',
      '/images/kanta-coffee-shop/4.jpg',
      '/images/kanta-coffee-shop/5.jpg',
      '/images/kanta-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/kanta-coffee-shop/1.jpg',
      '/images/kanta-coffee-shop/2.jpg',
      '/images/kanta-coffee-shop/3.jpg',
      '/images/kanta-coffee-shop/4.jpg',
      '/images/kanta-coffee-shop/5.jpg',
      '/images/kanta-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza Kahveler: Kantaçino & Berry Love',
        desc: 'İşletmemize özel reçetelerle hazırlanan meşhur Kantaçino, Berry Love ve 3. nesil sıcak-soğuk kahve spesiyalleri.',
        detail: 'Kantaçino • Berry Love • Özel Reçete',
      },
      {
        num: '02',
        title: 'Figür Boyama & Sanat Workshop Deneyimi',
        desc: 'Kahvenizi yudumlarken sevdiklerinizle orta ve büyük boy dekoratif figürler boyayabileceğiniz keyifli sanat atölyesi.',
        detail: 'Figür Boyama • Sanat Atölyesi • Tüm Malzemeler Dahil',
      },
      {
        num: '03',
        title: 'Nitelikli Matcha Latte & Soğuk İçecekler',
        desc: 'Tam kıvamında hazırlanan sıcak/buzlu Matcha Latte, Frappe, Cold Brew ve ferahlatıcı ev yapımı içecekler.',
        detail: 'Matcha Latte • Buzlu Kahveler • Doğal Aromalar',
      },
      {
        num: '04',
        title: 'Günlük Taze Tatlılar & Sandviç Çeşitleri',
        desc: 'Çalışma ve sohbet molalarınıza eşlik eden taze vitrin tatlıları, pastalar ve doyurucu sandviç alternatifleri.',
        detail: 'Günlük Taze Tatlı • Sandviçler • Özenli Sunum',
      },
      {
        num: '05',
        title: 'Özel Sunumlu Bitki Çayları & Sıcak İçecekler',
        desc: 'Farklı bitki ve meyve harmanlarıyla hazırlanan şık sunumlu kış çayları ve taze demleme çay.',
        detail: 'Şık Sunum • Doğal Harman • Sıcak İkram',
      },
      {
        num: '06',
        title: 'Salıncaklı Bahçe & Geniş Çalışma Alanı',
        desc: 'Konforlu koltukları, salıncaklı bahçesi, hayvan dostu yaklaşımı ve geniş ders/ofis çalışma katıyla Bahçelievler’in buluşma noktası.',
        detail: 'Salıncaklı Bahçe • Hayvan Dostu • Çalışma Katı',
      },
    ],
    reviews: [
      {
        author: 'Fatih Metehan Keser',
        role: 'Google Yorumu',
        group: 'Kantaçino & Figür Workshop',
        text: 'Öncülük yaptığı workshop hizmeti ile öne çıkan çok başarılı bir kafe. Bizi güler yüzlü çalışanlar karşıladı. Kantaçino kahvesi ve figür boyama aktivitesi günün sonunda kesinlikle değecek harika bir deneyimdi.',
      },
      {
        author: 'Ayşegül Baykal',
        role: 'Google Yorumu',
        group: 'Berry Love & Hayvan Dostu Mekan',
        text: 'Hayvan dostu işletmesi ve genç ruhuyla Kanta Bahçeli’ye gelme sebebidir. Üniversite yıllarımdan beri tercih ettiğim Berry Love kahvesi ve taze tatlılarıyla kalitesinden hiçbir şey kaybetmiyor.',
      },
      {
        author: 'Gezme Sanatı',
        role: 'Google Yorumu',
        group: 'Bitki Çayı & Sandviç',
        text: 'Ortam çok sıcak ve şirindi. Bitki çayı içtik, sunumu çok güzeldi. Ayrıca taze tatlı ve sandviç çeşitleri de oldukça başarılı.',
      },
      {
        author: 'Aslı K.',
        role: 'Google Yorumu',
        group: 'Matcha & Çalışma Alanı',
        text: 'Matchası çok güzel, ders çalışmak ve arkadaşlarla vakit geçirmek için müdavimi olduğumuz konforlu bir mekan.',
      },
    ],
  },
  'kvassir': {
    l: '/logos/kvassir.svg',
    logo: '/logos/kvassir.svg',
    n: 'Kvassir',
    a: 'Emek, Bişkek Cd. 25/A, 06510 Çankaya/Ankara',
    p: '0530 583 71 23',
    c: '3. Nesil Dünya Kahveleri • Tatlılar & Çikolatalar • Sandviçler',
    s: 'cafe_dessert',
    q: 'Kvassir, Emek, Bişkek Cd. 25/A, 06510 Çankaya/Ankara',
    u: 'https://share.google/f1vzGtG0AXf88dLCB',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Emek Bişkek Caddesi’nde (8. Cadde) işletme sahibinin el çizimi özgün sanat eserleriyle bezeli atmosferinde hizmet veren Kvassir; 3. nesil dünya kahveleri, el yapımı çikolataları, taze tatlıları ve dört mevsim keyifli bahçesiyle misafirlerini ağırlıyor.',
    hr: 'Her Gün: 09:00 – 00:00',
    rt: '4.4',
    rc: 251,
    ph: [
      '/images/kvassir/1.jpg',
      '/images/kvassir/2.jpg',
      '/images/kvassir/3.jpg',
      '/images/kvassir/4.jpg',
      '/images/kvassir/5.jpg',
      '/images/kvassir/6.jpg',
    ],
    photos: [
      '/images/kvassir/1.jpg',
      '/images/kvassir/2.jpg',
      '/images/kvassir/3.jpg',
      '/images/kvassir/4.jpg',
      '/images/kvassir/5.jpg',
      '/images/kvassir/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: '3. Nesil Dünya Kahveleri & Espresso Bar',
        desc: 'Taze kavrulmuş seçkin çekirdeklerden hazırlanan dünya kahveleri, Americano, Latte ve aromatik espresso çeşitleri.',
        detail: 'Dünya Kahveleri • Taze Kavrum • Usta Barista',
      },
      {
        num: '02',
        title: 'El Yapımı Çikolatalar & Sıcak Brownie',
        desc: 'Şık sunumuyla servis edilen yoğun Belçika çikolatalı brownie ve el yapımı butik çikolata çeşitlerimiz.',
        detail: 'El Yapımı Çikolata • Sıcak Brownie • Şık Sunum',
      },
      {
        num: '03',
        title: 'San Sebastian & Günlük Taze Tatlılar',
        desc: 'Kahve keyfinize eşlik eden günlük taze San Sebastian cheesecake, tart ve patisserie lezzetleri.',
        detail: 'San Sebastian • Günlük Üretim • Taze Malzeme',
      },
      {
        num: '04',
        title: 'Gurme Sandviçler & Atıştırmalıklar',
        desc: 'Günün her saati taze ekmek ve doğal malzemelerle hazırlanan doyurucu sandviç alternatifleri.',
        detail: 'Taze Sandviç • Günlük Hazırlık • Doyurucu Öğün',
      },
      {
        num: '05',
        title: 'Kış Bitki Çayları & Yazlık Soğuk Çaylar',
        desc: 'Kış aylarında içinizi ısıtan doğal bitki çayları, yaz aylarında ise ferahlatan ev yapımı soğuk çay ve kahveler.',
        detail: 'Mevsimsel İçecekler • Bitki Çayları • Ferahlatıcı Soğuk Çay',
      },
      {
        num: '06',
        title: 'Sanat Eserleriyle Bezeli Butik Atmosfer',
        desc: 'Her köşesi el çizimi özgün sanat eserleriyle tasarlanmış, dört mevsim keyif veren iç mekan ve bahçe alanı.',
        detail: 'Özgün Sanat Tasarımı • Dört Mevsim Bahçe • Emek 8. Cadde',
      },
    ],
    reviews: [
      {
        author: 'Meliha Akın',
        role: 'Google Yorumu',
        group: 'Sanatsal Atmosfer & Kahve',
        text: 'İçerideki harika sanat eserleri ve her mevsimin keyfini yaşatan tasarımıyla emek emek kurulmuş butik, tatlı bir kahveci. Kışın bitki çayları, yazın soğuk çayları ve kahveleri çok lezzetli. Çalışanları her zaman güler yüzlü ve ilgili.',
      },
      {
        author: 'Burak T.',
        role: 'Google Yorumu',
        group: 'Brownie & Çay',
        text: 'Brownie servisi sade ve çok şıktı, çayı ve kahveleri her zaman taze. Emek Bişkek Caddesi’nde oturup dinlenmek için çok keyifli bir nokta.',
      },
      {
        author: 'Esra K.',
        role: 'Google Yorumu',
        group: 'Dünya Kahveleri',
        text: 'Ortamı çok keyifli, servis son derece nazik ve güler yüzlü. Dekorasyonu ve müzikleriyle kendine has bir ruhu var.',
      },
      {
        author: 'Caner D.',
        role: 'Google Yorumu',
        group: '3. Nesil Kahve & Tatlı',
        text: 'Arkadaşlarla buluşup kahve ve tatlı eşliğinde sohbet etmek için Emek bölgesindeki en estetik mekanlardan biri.',
      },
    ],
  },
  'guzu-coffee': {
    l: '/logos/guzu-coffee.svg',
    logo: '/logos/guzu-coffee.svg',
    n: 'Guzu Coffee',
    a: 'Barbaros, Bülten Sk. No:26, 06680 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: '3. Nesil Kahve • Ev Yapımı Tatlı & Tuzlu Atıştırmalıklar',
    s: 'cafe_dessert',
    q: 'Guzu Coffee, Barbaros, Bülten Sk. No:26, 06680 Çankaya/Ankara',
    u: 'https://share.google/PzXELt41ofI6i5luV',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Tunalı Bülten Sokak’ta kartpostal güzelliğindeki ışıl ışıl iç mekanı, kitap okumak ve çalışmak için özenle seçilmiş dingin müzikleri, nitelikli kahveleri ve ev yapımı tuzlu-tatlı lezzetleriyle huzurlu bir kahve deneyimi sunuyoruz.',
    hr: 'Hafta İçi: 10:00 – 23:00 • Cumartesi: 11:00 – 23:00 • Pazar: 11:00 – 22:00',
    rt: '4.5',
    rc: 133,
    ph: [
      '/images/guzu-coffee/1.jpg',
      '/images/guzu-coffee/2.jpg',
      '/images/guzu-coffee/3.jpg',
      '/images/guzu-coffee/4.jpg',
      '/images/guzu-coffee/5.jpg',
      '/images/guzu-coffee/6.jpg',
    ],
    photos: [
      '/images/guzu-coffee/1.jpg',
      '/images/guzu-coffee/2.jpg',
      '/images/guzu-coffee/3.jpg',
      '/images/guzu-coffee/4.jpg',
      '/images/guzu-coffee/5.jpg',
      '/images/guzu-coffee/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Espresso & Taze Demleme Kahveler',
        desc: 'Özenle seçilen kahve çekirdeklerinden hazırlanan Latte, Cappuccino, Americano ve taze filtre kahve çeşitleri.',
        detail: 'Taze Çekirdek • Dengeli İçim • Sıcak & Soğuk',
      },
      {
        num: '02',
        title: 'Ev Yapımı Tuzlu Atıştırmalıklar & Kişler',
        desc: 'Günlük taze malzemelerle kendi mutfağımızda hazırlanan ev yapımı tuzlu atıştırmalıklar ve fırın lezzetleri.',
        detail: 'Ev Yapımı • Günlük Taze • Doğal İçerik',
      },
      {
        num: '03',
        title: 'Günlük Taze Kek, Kurabiye & Tatlılar',
        desc: 'Kahvenizin yanında keyifle tüketebileceğiniz günlük taze kek, kurabiye ve butik tatlı seçenekleri.',
        detail: 'Günlük Üretim • Taze Sunum • Butik Tatlılar',
      },
      {
        num: '04',
        title: 'Soğuk Kahveler & Ferahlatıcı İçecekler',
        desc: 'Bülten Sokak molalarınıza ferahlık katan Iced Latte, Cold Brew ve ev yapımı soğuk içecekler.',
        detail: 'Buzlu Kahveler • Ferahlatıcı • Yaz Menüsü',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Bitki Çayları',
        desc: 'Kahve dışı alternatif arayan misafirlerimiz için taze demleme çay ve doğal bitki çayı çeşitleri.',
        detail: 'Taze Çay • Bitki Çayları • Nazik Servis',
      },
      {
        num: '06',
        title: 'Kitap Okuma & Çalışma Dostu Huzurlu Mekan',
        desc: 'Işıl ışıl iç mekan tasarımı ve dingin müzikleriyle kitap okumak, ders çalışmak ve dinlenmek için ideal atmosfer.',
        detail: 'Huzurlu İç Mekan • Çalışma Dostu • Bülten Sokak',
      },
    ],
    reviews: [
      {
        author: 'Pınar Yaşar Şatıroğlu',
        role: 'Google Yorumu',
        group: 'Kahve & Huzurlu İç Mekan',
        text: 'Kahveleri çok lezzetli ve kaliteli. İç mekan kartpostal gibi ışıl ışıl, samimi ve huzurlu. Müzikleri kitap okumak ve ders çalışmak için mükemmel. Çalışanlar oldukça nazik ve tatlılar.',
      },
      {
        author: 'Esra Eser',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Tuzlu Atıştırmalıklar',
        text: 'Çalışanları çok tatlı ve güler yüzlü. Ev yapımı tuzlu atıştırmalıklarının tadı bayağı iyiydi, içeriğini de özenle anlattılar. Gönül rahatlığıyla tercih edebilirsiniz.',
      },
      {
        author: 'Mert Y.',
        role: 'Google Yorumu',
        group: 'Bülten Sokak Kahve Molası',
        text: 'Tunalı Bülten Sokak’ta sakinliği ve estetik dekorasyonuyla öne çıkan çok hoş bir butik kahveci.',
      },
      {
        author: 'Zeynep K.',
        role: 'Google Yorumu',
        group: 'Kahve & Müzik',
        text: 'Hem kahveleri hem de içeride çalan müzik listesi harika. Kitabınızı alıp saatlerce huzurla oturabileceğiniz bir yer.',
      },
    ],
  },
  'grandala-coffee': {
    l: '/logos/grandala-coffee.svg',
    logo: '/logos/grandala-coffee.svg',
    n: 'Grandala Coffee',
    a: 'Remzi Oğuz Arık Mah., Bestekar Cd. No:35/D, 06540 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: '3. Nesil Nitelikli Kahve • V60 Demleme • Butik Kafe',
    s: 'cafe_dessert',
    q: 'Grandala Coffee, Remzi Oğuz Arık, Bestekar Cd 35/D, 06540 Çankaya/Ankara',
    u: 'https://share.google/pVeufxAgu9ytLPUsP',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Bestekar Caddesi’nde “Coffee or not coffee” mottosuyla hizmet veren Grandala Coffee; meyvemsi ve dengeli nitelikli çekirdekleriyle hazırladığı V60 demlemeleri, bol kremalı Americano’su, taze tatlıları ve dergi köşeli sıcak iç-dış mekanıyla öne çıkıyor.',
    hr: 'Hafta İçi & Pazar: 09:30 – 23:30 • Cumartesi: 09:30 – 00:00',
    rt: '4.6',
    rc: 339,
    ph: [
      '/images/grandala-coffee/1.jpg',
      '/images/grandala-coffee/2.jpg',
      '/images/grandala-coffee/3.jpg',
      '/images/grandala-coffee/4.jpg',
      '/images/grandala-coffee/5.jpg',
      '/images/grandala-coffee/6.jpg',
    ],
    photos: [
      '/images/grandala-coffee/1.jpg',
      '/images/grandala-coffee/2.jpg',
      '/images/grandala-coffee/3.jpg',
      '/images/grandala-coffee/4.jpg',
      '/images/grandala-coffee/5.jpg',
      '/images/grandala-coffee/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 Nitelikli Demleme & Çekirdek Seçkisi',
        desc: 'Damak tadınıza göre meyvemsi veya dengeli gövdeli çekirdek önerileriyle barista tarafından özenle demlenen V60 kahveler.',
        detail: 'V60 Demleme • Barista Çekirdek Önerisi • Nitelikli Kahve',
      },
      {
        num: '02',
        title: 'Kremalı Americano, Latte & Espresso Bar',
        desc: 'Üzerinde yoğun kremasıyla fark yaratan Americano, ipeksi süt köpüklü Latte, Cappuccino ve Flat White.',
        detail: 'Kremalı Americano • Latte Art • Taze Öğütüm',
      },
      {
        num: '03',
        title: 'Geleneksel Türk Kahvesi & Sıcak İçecekler',
        desc: 'Yemek sonrası veya sohbet molalarınız için özenle pişirilen bol köpüklü Türk kahvesi ve taze demleme çay.',
        detail: 'Türk Kahvesi • Taze Demleme Çay • Şık Sunum',
      },
      {
        num: '04',
        title: 'Günlük Taze Alman Pastası & Tatlılar',
        desc: 'Kahve ve çayınızın yanına çok yakışan taze Alman pastası, cheesecake ve günlük vitrin tatlıları.',
        detail: 'Alman Pastası • Günlük Taze • Hafif Tatlılar',
      },
      {
        num: '05',
        title: 'Soğuk Kahveler & Ferahlatıcı İçecekler',
        desc: 'Bestekar Caddesi’nde açık havada keyifle yudumlayabileceğiniz Iced Latte, Iced Americano ve soğuk demlemeler.',
        detail: 'Buzlu Kahveler • Cold Brew • Ferah İçim',
      },
      {
        num: '06',
        title: 'Dergi Köşeli Konforlu İç & Dış Mekan',
        desc: 'Rahat koltukları, incelenebilecek kültür-sanat dergileri ve hem iç hem dış oturma alanıyla Bestekar’ın en samimi kafesi.',
        detail: 'İç & Dış Mekan • Dergi Köşesi • Bestekar Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Mehmet Fatih Setdibi',
        role: 'Google Yorumu',
        group: 'V60 Demleme & Barista İlgisi',
        text: 'Bestekar’ın en samimi kafelerinden biri. V60 denedim ve gayet güzeldi; çalışanların ilgisi ve kahveyi beğenip beğenmediğimi sormaları da çok şık bir hareket.',
      },
      {
        author: 'Mert Erboyacı',
        role: 'Google Yorumu',
        group: 'Meyvemsi V60 Çekirdek Seçimi',
        text: 'Meyvemsi ve dengeli gövdeli bir çekirdek önermesini rica ettim baristaya ve seçtiği kahveyi V60 olarak deneyimledim. Çok güzel ve dengeli bir kahveydi, çalışanlar çok güler yüzlü.',
      },
      {
        author: 'Güzellik & Sağlık',
        role: 'Google Yorumu',
        group: 'Alman Pastası & Çay',
        text: 'Alman pastası ve çay aldım, çok taze ve lezzetliydi. Hem iç hem dış mekanın olması çok iyi, personeller son derece kibar.',
      },
      {
        author: 'Persassy J.',
        role: 'Google Yorumu',
        group: 'Atmosfer & Kahve Çekirdekleri',
        text: 'Kahve çekirdekleri ile dikkat çeken, ortamı ve atmosferi sıcacık bir mekan. İçerideki koltuklar çok rahat, incelenecek dergiler konulmuş, çalışanlar çok kibar.',
      },
    ],
  },
  'caffenux': {
    l: '/logos/caffenux.svg',
    logo: '/logos/caffenux.svg',
    n: 'CaffeNux',
    a: 'Güvenevler, Kıbrıs Sk. No:13, 06105 Çankaya/Ankara',
    p: '0530 977 09 58',
    c: 'Butik Kahve Dükkanı • San Sebastian Cheesecake & Tatlılar',
    s: 'cafe_dessert',
    q: 'CaffeNux, Güvenevler, Kıbrıs Sk. No:13, 06105 Çankaya/Ankara',
    u: 'https://share.google/4ylp4CKLJgUhlzcHx',
    city: 'Ankara',
    pm: 'auto',
    bio: 'Aşağı Ayrancı Güvenevler Kıbrıs Sokak’ta tam bir mahalle kafesi sıcaklığıyla hizmet veren CaffeNux; efsanevi San Sebastian Cheesecake’i, lezzetli kahveleri, esintili sokak oturma alanı ve güler yüzlü ekibiyle keyifli bir mola sunuyor.',
    hr: 'Hafta İçi: 10:00 – 22:30 • Hafta Sonu: 10:30 – 22:30',
    rt: '4.6',
    rc: 446,
    ph: [
      '/images/caffenux/1.jpg',
      '/images/caffenux/2.jpg',
      '/images/caffenux/3.jpg',
      '/images/caffenux/4.jpg',
      '/images/caffenux/5.jpg',
      '/images/caffenux/6.jpg',
    ],
    photos: [
      '/images/caffenux/1.jpg',
      '/images/caffenux/2.jpg',
      '/images/caffenux/3.jpg',
      '/images/caffenux/4.jpg',
      '/images/caffenux/5.jpg',
      '/images/caffenux/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza San Sebastian Cheesecake',
        desc: 'Tam kıvamında akışkan dokusu ve taze sunumuyla müdavimlerinin favorisi olan meşhur San Sebastian Cheesecake.',
        detail: 'İmza San Sebastian • Akışkan Kıvam • Günlük Taze',
      },
      {
        num: '02',
        title: 'Nitelikli Espresso, Latte & Filtre Kahve',
        desc: 'Gün boyu taze öğütülen çekirdeklerle hazırlanan Latte, Americano, Cappuccino ve filtre kahve çeşitleri.',
        detail: 'Taze Öğütüm • Sıcak & Soğuk • Dengeli Lezzet',
      },
      {
        num: '03',
        title: 'Buzlu Kahveler & Yazlık Ferah İçecekler',
        desc: 'Kıbrıs Sokak’ın esintili yaz akşamlarında ferahlık veren Iced Latte, Iced Americano ve soğuk içecekler.',
        detail: 'Buzlu Kahve • Ferahlatıcı • Yaz Akşamı Keyfi',
      },
      {
        num: '04',
        title: 'Günlük Butik Tatlılar & Kahve Eşlikçileri',
        desc: 'Kahvenizin yanında taze olarak sunulan kurabiye, kek ve günlük vitrin tatlıları.',
        detail: 'Günlük Vitrin • Taze Tatlılar • Özenli Sunum',
      },
      {
        num: '05',
        title: 'Al-Götür (Take-Away) & Hızlı Kahve Servisi',
        desc: 'Yol üstü kahve molalarınız ve yürüyüşleriniz için pratik, hızlı ve sıcak-soğuk take-away kahve servisi.',
        detail: 'Hızlı Take-Away • Pratik Sunum • Gün Boyu Taze',
      },
      {
        num: '06',
        title: 'Kıbrıs Sokak Açık Hava & Mahalle Kafesi',
        desc: 'Park yeri bulmanın kolay olduğu, esintili sokak oturma alanı ve samimi komşuluk havasıyla Güvenevler’in mahalle kafesi.',
        detail: 'Mahalle Kafesi • Açık Hava Oturma • Kıbrıs Sokak',
      },
    ],
    reviews: [
      {
        author: 'Açelya Şebboy Çelik',
        role: 'Google Yorumu',
        group: 'San Sebastian & Kahve',
        text: 'Kahveler çok lezzetli, mekanın yeri harika. Özellikle yaz akşamlarında çok keyifli oluyor. Çalışanlar inanılmaz kibar ve ilgili. Özellikle San Sebastian’ı efsane, bir kafede ne ararsanız var 10/10.',
      },
      {
        author: 'Can Tonbul',
        role: 'Google Yorumu',
        group: 'Mahalle Kafesi Atmosferi',
        text: 'Tam bir mahalle kafesi. Yolumun üzerinde görüp oturdum, iyi ki de oturmuşum. Atmosferi çok tatlı, sıcak yaz günlerinde oturması şahane keyifli, çalışanlar çok kibar. Mutlaka tavsiye ediyorum!',
      },
      {
        author: 'Elif M.',
        role: 'Google Yorumu',
        group: 'Kahve & Güler Yüzlü Hizmet',
        text: 'Kıbrıs Sokak’ın en samimi ve huzurlu noktası. Hem kahveleri hem de tatlıları her zaman taze.',
      },
      {
        author: 'Burak S.',
        role: 'Google Yorumu',
        group: 'Kıbrıs Sokak Mola Noktası',
        text: 'Arkadaşlarla akşamüstü kahve içip sohbet etmek için her hafta uğradığımız çok nezih bir işletme.',
      },
    ],
  },
};

function getSlugBucketAndKey(slug) {
  const clean = String(slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  let h1 = 2166136261;
  let h2 = 5381;
  for (let i = 0; i < clean.length; i++) {
    const c = clean.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 16777619) >>> 0;
    h2 = ((h2 << 5) + h2 + c) >>> 0;
  }
  const bucket = KV_LANG_BUCKETS[h1 % KV_LANG_BUCKETS.length];
  const key = ('s' + h1.toString(36).slice(0, 4) + h2.toString(36).slice(0, 4))
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 9);
  return { bucket, key };
}

async function saveSiteBySlug(slug, record) {
  const cleanSlug = String(slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!cleanSlug) return;
  GLOBAL_SLUG_CACHE.set(cleanSlug, record);

  try {
    const { bucket, key } = getSlugBucketAndKey(cleanSlug);
    const kvObj = {
      n: record.n,
      a: record.a,
      p: record.p,
      c: record.c,
      s: record.s,
      q: record.q,
      u: record.u,
      city: record.city || 'Ankara',
      pm: record.pm || 'auto',
      l: record.l || record.logo || '',
    };
    if (record.bio) kvObj.bio = String(record.bio).slice(0, 340);
    if (record.hr) kvObj.hr = String(record.hr).slice(0, 90);
    if (record.rt) kvObj.rt = String(record.rt);
    if (record.rc) kvObj.rc = Number(record.rc);
    if (Array.isArray(record.ci) && record.ci.length > 0) {
      kvObj.ci = record.ci.slice(0, 6);
    }
    if (Array.isArray(record.ph) && record.ph.length > 0) {
      kvObj.ph = record.ph.slice(0, 6);
    }

    const b64 = Buffer.from(JSON.stringify(kvObj), 'utf8').toString('base64url');
    const chunks = [];
    for (let i = 0, idx = 0; i < b64.length; i += 240, idx++) {
      chunks.push({
        command: `${key}_${idx}`,
        description: b64.slice(i, i + 240),
      });
    }

    const getRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getMyCommands?language_code=${bucket}`
    );
    const getJson = await getRes.json();
    const existing = Array.isArray(getJson?.result) ? getJson.result : [];
    const filtered = existing.filter((cmd) => !cmd.command.startsWith(`${key}_`));
    let combined = [...filtered, ...chunks];
    if (combined.length > 96) {
      combined = combined.slice(combined.length - 96);
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_code: bucket,
        commands: combined,
      }),
    });
  } catch (err) {
    console.error('saveSiteBySlug error:', err);
  }
}

async function loadSiteBySlug(slug, host = '') {
  const cleanSlug = String(slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!cleanSlug) return null;

  if (GLOBAL_SLUG_CACHE.has(cleanSlug)) {
    return GLOBAL_SLUG_CACHE.get(cleanSlug);
  }

  let kvRecord = null;
  try {
    const { bucket, key } = getSlugBucketAndKey(cleanSlug);
    const getRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getMyCommands?language_code=${bucket}`
    );
    const getJson = await getRes.json();
    const existing = Array.isArray(getJson?.result) ? getJson.result : [];
    const matching = existing
      .filter((cmd) => cmd.command.startsWith(`${key}_`))
      .map((cmd) => ({
        idx: parseInt(cmd.command.slice(key.length + 1), 10) || 0,
        desc: cmd.description || '',
      }))
      .sort((a, b) => a.idx - b.idx);

    if (matching.length > 0) {
      const b64 = matching.map((m) => m.desc).join('');
      const parsed = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
      if (parsed && parsed.n) {
        kvRecord = parsed;
      }
    }
  } catch (err) {
    console.error('loadSiteBySlug KV error:', err);
  }

  const seedRecord = SEED_SITES[cleanSlug] ? { ...SEED_SITES[cleanSlug] } : null;
  let foundRecord = null;

  if (seedRecord && kvRecord) {
    foundRecord = {
      ...seedRecord,
      ...kvRecord,
      l: kvRecord.l || seedRecord.l || seedRecord.logo || '',
      logo: kvRecord.logo || kvRecord.l || seedRecord.logo || seedRecord.l || '',
      ph: Array.isArray(kvRecord.ph) && kvRecord.ph.length > 0 ? kvRecord.ph : seedRecord.ph,
      photos:
        Array.isArray(kvRecord.photos) && kvRecord.photos.length > 0
          ? kvRecord.photos
          : seedRecord.photos,
      items:
        Array.isArray(kvRecord.items) && kvRecord.items.length > 0
          ? kvRecord.items
          : seedRecord.items,
      reviews:
        Array.isArray(kvRecord.reviews) && kvRecord.reviews.length > 0
          ? kvRecord.reviews
          : seedRecord.reviews,
      // Fix legacy generic sector if seed has a more specific one
      s:
        kvRecord.s === 'grill_restaurant' && seedRecord.s === 'pizza_italian'
          ? 'pizza_italian'
          : kvRecord.s === 'cafe_dessert' && seedRecord.s === 'traditional_dessert'
          ? 'traditional_dessert'
          : kvRecord.s || seedRecord.s,
      bio: kvRecord.bio || seedRecord.bio,
      hr: kvRecord.hr || seedRecord.hr,
      rt: kvRecord.rt || seedRecord.rt,
      rc: kvRecord.rc || seedRecord.rc,
    };
  } else {
    foundRecord = kvRecord || seedRecord;
  }

  if (foundRecord) {
    GLOBAL_SLUG_CACHE.set(cleanSlug, foundRecord);
    return foundRecord;
  }

  // Fallback for unknown slugs: derive business name and city from slug + hostname
  const inferredCity = /samsun/i.test(host) ? 'Samsun' : 'Ankara';
  const humanName = formatBusinessTitle(cleanSlug.replace(/-/g, ' '));
  const fallbackInfo = await resolveBusinessInfo(`${humanName} ${inferredCity}`);
  const finalFallback = {
    ...fallbackInfo,
    n:
      fallbackInfo.n && fallbackInfo.n !== 'Kurumsal İşletme Merkezi'
        ? formatBusinessTitle(fallbackInfo.n)
        : humanName,
    a:
      fallbackInfo.a && fallbackInfo.a !== 'Merkez / Türkiye'
        ? fallbackInfo.a
        : `${inferredCity} / Türkiye`,
    city: inferredCity,
  };
  GLOBAL_SLUG_CACHE.set(cleanSlug, finalFallback);
  return finalFallback;
}

function unescapeHtml(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return '';
      }
    })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#039;/g, "'")
    .replace(/&#064;/g, '@')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function matchGranularSector(text) {
  const t = String(text || '').toLocaleLowerCase('tr-TR');
  if (!t.trim()) return '';

  if (
    /(garage|garaj|detailing|pasta cila|seramik kaplama|elmas kaplama|ppf|kaput filmi|araç kaplama|arac kaplama|cam filmi|boyasız göçük|boyasiz gocuk|jant boyama|bodykit|oto kuaför|oto kuafor|car care|autoclub)/.test(
      t
    )
  ) {
    return 'auto_detailing';
  }
  if (/(pizza|pizzeria|margarita|margherita|calzone|trattoria|napoliten|italyan restoran)/.test(t)) {
    return 'pizza_italian';
  }
  if (/(burger|hamburger|cheeseburger|smash burger|street food|hot dog|çıtır tavuk|citir tavuk)/.test(t)) {
    return 'burger_streetfood';
  }
  if (
    /(tatlıcı|tatlici|bağdat tatlısı|bagdat tatlisi|baklava|künefe|kunefe|kadayıf|kadayif|şöbiyet|sobiyet|muhallebi|sütlü tatlı|şerbetli tatlı|helva|lokma|katmer)/.test(
      t
    )
  ) {
    return 'traditional_dessert';
  }
  if (
    /(börek|borek|poğaça|pogaca|simit|fırın|firin|unlu mamül|unlu mamul|gözleme|gozleme|kahvaltı salonu|serpme kahvaltı)/.test(
      t
    )
  ) {
    return 'bakery_breakfast';
  }
  if (
    /(kafe|cafe|kahve|coffe|espresso|latte|patisserie|pastane|magnolia|profiterol|tiramisu|cheesecake|san sebastian|bistro|dondurma|waffle|çikolata|cikolata|nargile|çay evi|cay bahcesi|roastery)/.test(
      t
    )
  ) {
    return 'cafe_dessert';
  }
  if (/(kahvaltı|kahvalti|kruvasan|ekmek|mantı|manti)/.test(t)) {
    return 'bakery_breakfast';
  }
  if (/(balık|balik|deniz ürün|midye|kalamar|karides|hamsi|levrek|çupra)/.test(t)) {
    return 'seafood_fish';
  }
  if (/(döner|doner|iskender|tantuni|köfte|kofte|kokoreç|kokorec|cağ kebabı|cag kebabi|dürümcü)/.test(t)) {
    return 'doner_tantuni';
  }
  if (
    /(çorba|corba|paça|paca|işkembe|iskembe|beyran|mercimek|tarhana|ezogelin|sulu yemek|ev yemekleri|esnaf lokantası)/.test(
      t
    )
  ) {
    return 'soup_restaurant';
  }
  if (
    /(restoran|restaurant|aspava|kebap|ocakbaşı|ocakbasi|pide|lahmacun|et lokanta|et restoran|steakhouse|izgara|ızgara|steak|ciğer|ciger|mangal|lokanta)/.test(
      t
    )
  ) {
    return 'grill_restaurant';
  }
  if (
    /(kuaför|kuafor|berber|saç tasarım|sac tasarim|güzellik|guzellik|cilt bakım|cilt bakim|lazer epilasyon|protez tırnak|protez tirnak|nail art|ipek kirpik|makyaj|manikür|pedikür)/.test(
      t
    )
  ) {
    return 'beauty_hair';
  }
  if (
    /(spor salonu|fitness|gym|pilates|reformer|yoga|crossfit|boks|kickboks|kişisel antrenör|personal trainer)/.test(
      t
    )
  ) {
    return 'fitness_pilates';
  }
  if (
    /(diş|dis|dental|dent|klinik|poliklinik|sağlık|saglik|medikal|estetik|doktor|hekim|eczane|optik|hastane|psikolog|diyetisyen|fizyoterapi|veteriner)/.test(
      t
    )
  ) {
    return 'dental_medical';
  }
  if (
    /(mimar|iç mimar|inşaat|insaat|müteahhit|gayrimenkul|emlak|konut|yapı|yapi|dekorasyon|avukat|hukuk|mali müşavir|danışmanlık)/.test(
      t
    )
  ) {
    return 'architecture_real_estate';
  }
  if (
    /(telefon|cep telefonu|iphone|samsung|xiaomi|aksesuar|tablet|bilgisayar|laptop|teknoloji|bilişim|bilisim|elektronik|çamaşır|camasir|bulaşık|bulasik|buzdolabı|buzdolabi|klima|kombi|süpürge|supurge|ev aletleri|elektrikli cihaz|beyaz eşya|beyaz esya|arzum|fantom|philips|beko|arçelik|arcelik|bosch|siemens|tefal|braun|delonghi|rowenta|korkmaz|fakir|teknik servis|tamir)/.test(
      t
    )
  ) {
    return 'appliance_service';
  }
  if (/(mercedes|amg|benz|bmw|porsche|land rover)/.test(t)) {
    return 'mercedes_luxury';
  }
  if (/(volkswagen|vw|audi|seat|skoda|škoda|vag)/.test(t)) {
    return 'vag_automotive';
  }
  if (
    /(soba|kuzine|şömine|somine|döküm|dokum|metal|makina|makine|üretim|uretim|fabrika|kazan|plastik|ambalaj|mermer|demir doğrama|mobilya imalat)/.test(
      t
    ) &&
    !/(oto|araba|lastik|kaporta|şanzıman)/.test(t)
  ) {
    return 'industrial_heating';
  }
  if (
    /(oto |otomotiv|araba|araç|arac|lastik|kaporta|şanzıman|sanziman|motor yenileme|oto elektrik|oto tamir|oto bakım|rot balans|ekspertiz|oto yıkama)/.test(
      t
    )
  ) {
    return 'auto_service';
  }
  return '';
}

function detectSector(primaryText, secondaryText = '') {
  const primaryMatch = matchGranularSector(primaryText);
  if (primaryMatch) return primaryMatch;
  const secondaryMatch = matchGranularSector(`${primaryText} ${secondaryText}`);
  return secondaryMatch || 'corporate_editorial';
}

function getSectorLabel(sector) {
  const labels = {
    pizza_italian: 'ARTİZAN PİZZA & İTALYAN MUTFAĞI TEMASI (Taş Fırın Sıcak Kehribar & Koyu Antrasit)',
    burger_streetfood: 'GURME BURGER & SOKAK LEZZETLERİ TEMASI (Ateş Kehribar & Koyu Karbon)',
    traditional_dessert: 'GELENEKSEL TATLI, BAKLAVA & LOKANTA TEMASI (Altın Şerbet Kehribar & Antrasit)',
    doner_tantuni: 'YAPRAK DÖNER, İSKENDER & KÖFTE TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    seafood_fish: 'BALIK & DENİZ ÜRÜNLERİ RESTORANI TEMASI (Ege Mavisi & Koyu Antrasit)',
    beauty_hair: 'KUAFÖR, GÜZELLİK & BAKIM STÜDYOSU TEMASI (Editoryal Antrasit & Altın)',
    fitness_pilates: 'SPOR SALONU, PİLATES & FİTNESS STÜDYOSU TEMASI (Dinamik Karbon & Kehribar)',
    architecture_real_estate: 'MİMARLIK, İNŞAAT, GAYRİMENKUL & HUKUK TEMASI (Ağırbaşlı Antrasit & Bronz)',
    auto_detailing: 'OTO DETAİLİNG, PASTA CİLA, SERAMİK & PPF GARAJI (Koyu Karbon & Altın Kehribar + Polisaj Videosu)',
    bakery_breakfast: 'BÖREKÇİ, FIRIN & KAHVALTI TEMASI (Sıcak Altın Kehribar & Koyu Antrasit)',
    soup_restaurant: 'ÇORBACI & GELENEKSEL LOKANTA TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    cafe_dessert: 'KAFE, KAHVE & PATISSERIE TEMASI (Espresso & Altın Kehribar)',
    grill_restaurant: 'RESTORAN, KEBAP & IZGARA TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    restaurant: 'RESTORAN & GASTRONOMİ TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    dental_medical: 'SAĞLIK, DİŞ KLİNİĞİ & MEDİKAL TEMA (Ferah Beyaz & Medikal Turkuaz)',
    appliance_service: 'TEKNOLOJİ, CİHAZ & TEKNİK SERVİS TEMASI (Kurumsal Antrasit & Kehribar)',
    mercedes_luxury: 'LÜKS OTOMOTİV TEMASI (Monokrom Siyah & Beyaz)',
    vag_automotive: 'VAG OTOMOTİV TEMASI (Koyu Lacivert & Kristal Beyaz)',
    industrial_heating: 'ÜRETİM & SANAYİ TEMASI (Kömür Karası & Endüstriyel Kırmızı)',
    corporate_editorial: 'KURUMSAL EDİTORYAL TEMA (Antrasit & Kırık Beyaz)',
    auto_service: 'OTOMOTİV & MEKANİK SERVİS TEMASI (Koyu Antrasit & Kehribar)',
  };
  return labels[sector] || labels.corporate_editorial;
}

function getShortSectorLabel(sector) {
  const shortLabels = {
    pizza_italian: '🍕 Pizza & İtalyan Restoranı',
    burger_streetfood: '🍔 Gurme Burger & Sokak Lezzetleri',
    traditional_dessert: '🍮 Tatlıcı / Baklava / Künefe / Lokanta',
    doner_tantuni: '🥙 Yaprak Döner / İskender / Köfte / Tantuni',
    seafood_fish: '🐟 Balık & Deniz Ürünleri Restoranı',
    beauty_hair: '💇‍♀️ Kuaför / Berber / Güzellik & Bakım Merkezi',
    fitness_pilates: '🏋️ Spor Salonu / Pilates / Fitness Stüdyosu',
    architecture_real_estate: '🏛️ Mimarlık / İnşaat / Gayrimenkul / Hukuk',
    auto_detailing: '🚘 Oto Detailing / Pasta Cila / Kaplama Garajı',
    auto_service: '🔧 Oto Tamir & Mekanik Servis',
    mercedes_luxury: '⭐ Mercedes / Lüks Oto Servisi',
    vag_automotive: '🚙 Volkswagen / VAG Özel Servis',
    cafe_dessert: '☕ Kafe / 3. Nesil Kahve / Patisserie',
    bakery_breakfast: '🥐 Börekçi / Fırın / Kahvaltı',
    grill_restaurant: '🥩 Kebap / Ocakbaşı / Pide & Izgara',
    soup_restaurant: '🍲 Çorbacı / Geleneksel Ev Yemekleri',
    appliance_service: '📱 Telefon / Bilgisayar / Teknik Servis',
    dental_medical: '🦷 Diş Kliniği / Sağlık / Veteriner / Optik',
    industrial_heating: '🏭 Sanayi / Üretim / Mobilya / Fabrika',
    corporate_editorial: '🏢 Kurumsal İşletme / Mağaza / Ofis',
  };
  return shortLabels[sector] || shortLabels.corporate_editorial;
}

function formatGoogleHours(hoursArr) {
  if (!Array.isArray(hoursArr) || hoursArr.length === 0) return '';
  try {
    const map = {};
    for (const entry of hoursArr) {
      const day = entry?.[0];
      const range = entry?.[3]?.[0]?.[0];
      if (day && range) {
        map[day] = range.replace(/–/g, ' – ');
      }
    }
    const pzt = map['Pazartesi'] || map['Salı'] || '';
    const cmt = map['Cumartesi'] || '';
    const paz = map['Pazar'] || '';
    if (!pzt) return '';
    if (pzt === cmt && pzt === paz) {
      return `Her Gün: ${pzt}`;
    }
    if (cmt === paz && cmt) {
      return `Hafta İçi: ${pzt} • Hafta Sonu: ${cmt}`;
    }
    return `Hafta İçi: ${pzt}${cmt ? ` • Cumartesi: ${cmt}` : ''}${paz ? ` • Pazar: ${paz}` : ''}`;
  } catch {
    return '';
  }
}

function extractRealBusinessOfferings({
  businessName = '',
  categories = [],
  ownerBio = '',
  reviews = [],
  pageText = '',
  sector = 'corporate_editorial',
  customItems = [],
}) {
  // 1. If the user explicitly taught custom items in Telegram, build cards directly from them!
  if (Array.isArray(customItems) && customItems.length > 0) {
    return customItems.slice(0, 6).map((rawItem, idx) => {
      const cleanTitle = formatBusinessTitle(String(rawItem).trim());
      return {
        num: String(idx + 1).padStart(2, '0'),
        title: cleanTitle,
        desc: `${businessName} bünyesinde özenle seçilen birinci sınıf malzemeler ve usta işçilikle sunulan ${cleanTitle.toLocaleLowerCase('tr-TR')} uzmanlığımız.`,
        detail: `${businessName} Kalitesi • Özenli Hazırlık • Tam Memnuniyet`,
      };
    });
  }

  const reviewCorpus = Array.isArray(reviews)
    ? reviews.map((r) => (typeof r === 'string' ? r : r?.text || '')).join(' ')
    : '';
  const fullCorpus = `${businessName} ${categories.join(' ')} ${ownerBio} ${reviewCorpus} ${pageText}`.toLocaleLowerCase(
    'tr-TR'
  );

  const matched = [];
  const addCard = (title, desc, detail) => {
    if (!matched.some((m) => m.title === title) && matched.length < 6) {
      matched.push({
        num: String(matched.length + 1).padStart(2, '0'),
        title,
        desc,
        detail,
      });
    }
  };

  // Sector-specific deep review, bio & menu mining
  if (sector === 'pizza_italian') {
    if (/(4 peynir|dört peynir|quattro formaggi|peynirli)/.test(fullCorpus)) {
      addCard(
        'Dört Peynirli Artizan Pizza',
        'İnce ve çıtır hamur üzerinde özenle dengelenmiş dört farklı gerçek peynir harmanıyla tam kıvamında fırınlanan imza lezzetimiz.',
        'İnce Çıtır Hamur • 4 Özel Peynir • Günlük Taze Hazırlık'
      );
    }
    if (/(ege|kabak|patlıcan|sebzeli|mantar)/.test(fullCorpus)) {
      addCard(
        'Ege & Taze Sebzeli Pizzalar',
        'Günlük seçilen taze kabak, patlıcan, zeytin ve mevsim sebzeleriyle hazırlanan, sebzeyi en lezzetli haliyle sunan özel reçetemiz.',
        'Günlük Taze Sebze • Ege Reçetesi • Doğal Malzeme'
      );
    }
    if (/(margarita|margherita|mozzarella|fesleğen)/.test(fullCorpus)) {
      addCard(
        'Klasik Margarita Pizza',
        'Ev yapımı taze domates sosumuz, gerçek mozzarella peyniri ve taze fesleğen dokunuşuyla hazırlanan geleneksel İtalyan klasiği.',
        'Ev Yapımı Domates Sosu • Mozzarella • İnce Hamur'
      );
    }
    if (/(et ürün|sucuk|kavurma|füme|şarküteri|karışık|32 cm|porsiyon|pepperoni)/.test(fullCorpus)) {
      addCard(
        'Seçkin Etli & 32 cm Doyurucu Pizzalar',
        'Dondurulmuş veya fabrikasyon ürün kullanılmadan, tek tek seçilen kaliteli et ve şarküteri ürünleriyle hazırlanan doyurucu pizzalarımız.',
        'Seçkin Et Ürünleri • 32 cm Doyurucu Porsiyon • Bol Malzeme'
      );
    }
    if (/(acı sos|özel sos|soslar|sarımsak)/.test(fullCorpus)) {
      addCard(
        'Ev Yapımı Özgün Soslar & Acı Sos',
        'Hamurun ve malzemelerin tadını bastırmadan yukarı taşıyan, kendi mutfağımızda günlük hazırladığımız özel pizza sosları ve ev yapımı acı sos.',
        'Kendi Üretimimiz • Dengeli & Taze • Özgün Reçete'
      );
    }
    if (/(tiramisu|sufle|tatlı|calzone)/.test(fullCorpus)) {
      addCard(
        'Ev Yapımı İtalyan Tiramisu & Tatlılar',
        'Pizza keyfinizi taçlandıran günlük taze hazırlanmış tam kıvamında tiramisu ve sıcak-soğuk içecek çeşitlerimiz.',
        'Günlük Taze Tiramisu • Samimi Ortam • Paket & Salon Servisi'
      );
    }
  } else if (sector === 'traditional_dessert') {
    if (/(bağdat tatlısı|bagdat tatlisi)/.test(fullCorpus)) {
      addCard(
        'Meşhur Fıstıklı Bağdat Tatlısı',
        'İncecik çıtır hamuru, doğal şeker şerbeti ve bol Antep fıstığıyla lokmalık olarak hazırlanan, Ankara’ya özgü tescilli imza tatlımız.',
        '45 Yıllık Orijinal Tarif • İnce Çıtır Hamur • Doğal Şeker'
      );
    }
    if (/(döner|doner|lokanta)/.test(fullCorpus)) {
      addCard(
        'Geleneksel Yaprak Döner & Lokanta',
        `${businessName} mutfağında günlük taze etten hazırlanan sıcak yaprak döner porsiyon ve geleneksel lokanta lezzetlerimiz.`,
        'Günlük Taze Et • Usta Pişirim • Sıcak Sunum'
      );
    }
    if (/(çiğ köfte|cig kofte)/.test(fullCorpus)) {
      addCard(
        'El Yapımı Günlük Çiğ Köfte',
        'Geleneksel usulde günlük olarak elde yoğrulan, taze yeşillik ve özel soslarla sunulan el yapımı çiğ köfte lezzetimiz.',
        'El Yapımı • Günlük Yoğrulan • Doğal Baharat'
      );
    }
    if (/(baklava|şöbiyet|sobiyet|fıstıklı|cevizli|midye baklava|soğuk baklava)/.test(fullCorpus)) {
      addCard(
        'Taş Fırın Fıstıklı & Cevizli Baklava',
        'İncecik açılan el yapımı yufka, sade tereyağı ve birinci sınıf Antep fıstığı ile günlük üretilen geleneksel baklava çeşitlerimiz.',
        'El Açması Yufka • Sade Tereyağı • Bol Antep Fıstığı'
      );
    }
    if (/(künefe|kunefe|kadayıf|kadayif|katmer)/.test(fullCorpus)) {
      addCard(
        'Sıcak Künefe & Kızarmış Kadayıf',
        'Sipariş üzerine sıcak hazırlanan, uzayan gerçek künefe peyniri ve çıtır tel kadayıf ile sunulan geleneksel tatlılarımız.',
        'Sıcak Pişirim • Gerçek Peynir • Kaymaklı Sunum'
      );
    }
    if (/(kilo|paket|iş yeri|misafir|ikram)/.test(fullCorpus)) {
      addCard(
        'Kiloluk Paket & Kurumsal İkram Siparişi',
        'İş yerleri, özel davetler, bayramlar ve misafir ağırlamaları için özel kutusunda taze kiloluk tatlı ve hızlı paket servis.',
        'Özel Kutu Ambalaj • Toptan & Perakende • Hızlı Teslimat'
      );
    }
  } else if (sector === 'burger_streetfood') {
    if (/(smash|cheeseburger|burger|hamburger)/.test(fullCorpus)) {
      addCard(
        'El Yapımı %100 Dana Gurme Burgerler',
        'Günlük çekilen dinlendirilmiş dana kaburga kıyması, karamelize soğan, eritilmiş cheddar ve günlük taze burger ekmeğiyle hazırlanan imza burgerlerimiz.',
        '%100 Dana Eti • Günlük Brioche Ekmek • Özel Burger Sosu'
      );
    }
    if (/(patates|kajun|baharatlı|çıtır tavuk|tenders|soğan halkası)/.test(fullCorpus)) {
      addCard(
        'Kajun Baharatlı Patates & Çıtır Atıştırmalıklar',
        'Dışı altın sarısı çıtır, içi yumuşak özel baharat harmanlı patates kızartması, çıtır tavuk parçaları ve el yapımı dip soslar.',
        'Sıcak Çıtır Kızartma • Özel Baharat • Ev Yapımı Soslar'
      );
    }
  } else if (sector === 'doner_tantuni') {
    if (/(döner|doner|yaprak|iskender|dürüm|tombik|pilav üstü)/.test(fullCorpus)) {
      addCard(
        'Odun Ateşinde Gerçek Yaprak Döner',
        'Özel marine edilmiş sinirsiz dana ve kuzu etinden ustalıkla dizilen, lavaş dürüm, tombik ekmek veya porsiyon olarak sunulan yaprak dönerimiz.',
        'Günlük Taze Et • Usta Kesim • Sıcak Lavaş & Pide'
      );
    }
    if (/(iskender|tereyağ|yoğurt)/.test(fullCorpus)) {
      addCard(
        'Köpüklü Tereyağlı İskender Kebap',
        'Kızarmış tırnak pidesi üzerinde ince yaprak döner, özel domates sosu, kızgın tereyağı ve doğal tava yoğurdu ile hazırlanan klasik lezzet.',
        'Halis Tereyağı • Tırnak Pide • Doğal Tava Yoğurdu'
      );
    }
    if (/(köfte|kofte|piyaz|ızgara köfte|kasap köfte|tantuni|kokoreç)/.test(fullCorpus)) {
      addCard(
        'Izgara Kasap Köfte & Geleneksel Lezzetler',
        'Doğal baharatlarla günlük yoğrulan sulu ızgara köfte, közlenmiş biber-domates ve taze yeşillik ikramlarıyla doyurucu porsiyonlar.',
        'Zırh & Kasap Kıyması • Közde Pişirim • Zengin İkram'
      );
    }
  } else if (sector === 'cafe_dessert') {
    if (/(espresso|latte|americano|filtre kahve|türk kahvesi|kahve|coffee|cold brew)/.test(fullCorpus)) {
      addCard(
        '3. Nesil Nitelikli Kahve & Espresso Bar',
        'Taze kavrulmuş %100 Arabica çekirdeklerden hazırlanan Latte, Cappuccino, Cold Brew, Filtre Kahve ve geleneksel Türk Kahvesi çeşitleri.',
        '%100 Arabica Çekirdek • Usta Barista • Sıcak & Buzlu Seçenekler'
      );
    }
    if (/(magnolia|profiterol|tiramisu|cheesecake|san sebastian|pasta|tatlı|waffle|kruvasan)/.test(fullCorpus)) {
      addCard(
        'Günlük Taze Patisserie & İmza Tatlılar',
        'Belçika çikolatası ve taze mevsim meyveleriyle günlük hazırlanan San Sebastian Cheesecake, Magnolia, Profiterol ve Tiramisu çeşitlerimiz.',
        'Günlük Üretim • Belçika Çikolatası • Taze Meyveli'
      );
    }
    if (/(bazlama|tost|sandviç|pilav|çiğ köfte|atıştırmalık|kahvaltı)/.test(fullCorpus)) {
      addCard(
        'Sıcak Bazlama Tost & Doyurucu Atıştırmalıklar',
        'Günün her saati sıcak hazırlanan özel bazlama tost, taze sandviçler ve doyurucu mutfak spesiyallerimiz.',
        'Sıcak Hazırlık • Bol Malzeme • Hızlı Servis'
      );
    }
  }

  return matched;
}

function formatInstagramHandle(username, fullName) {
  if (fullName && fullName.trim() && fullName.toLowerCase() !== username.toLowerCase()) {
    return fullName.trim();
  }
  const clean = username.replace(/[._-]+/g, ' ').trim();
  const suffixes = [
    ['detailing', 'Detailing'],
    ['teknoloji', 'Teknoloji'],
    ['iletisim', 'İletişim'],
    ['otomotiv', 'Otomotiv'],
    ['elektronik', 'Elektronik'],
    ['aksesuar', 'Aksesuar'],
    ['bilgisayar', 'Bilgisayar'],
    ['gayrimenkul', 'Gayrimenkul'],
    ['danismanlik', 'Danışmanlık'],
    ['dekorasyon', 'Dekorasyon'],
    ['patisserie', 'Patisserie'],
    ['mimarlik', 'Mimarlık'],
    ['guzellik', 'Güzellik'],
    ['insaat', 'İnşaat'],
    ['mobilya', 'Mobilya'],
    ['sigorta', 'Sigorta'],
    ['akademi', 'Akademi'],
    ['garage', 'Garage'],
    ['garaj', 'Garaj'],
    ['motors', 'Motors'],
    ['tuning', 'Tuning'],
    ['servis', 'Servis'],
    ['klinik', 'Klinik'],
    ['dental', 'Dental'],
    ['medikal', 'Medikal'],
    ['estetik', 'Estetik'],
    ['restoran', 'Restoran'],
    ['pastane', 'Pastane'],
    ['bakery', 'Bakery'],
    ['coffee', 'Coffee'],
    ['kuafor', 'Kuaför'],
    ['barber', 'Barber'],
    ['studio', 'Studio'],
    ['studyo', 'Stüdyo'],
    ['merkezi', 'Merkezi'],
    ['center', 'Center'],
    ['borek', 'Börek'],
    ['corba', 'Çorba'],
    ['kebap', 'Kebap'],
    ['kafe', 'Kafe'],
    ['cafe', 'Cafe'],
    ['club', 'Club'],
    ['emlak', 'Emlak'],
    ['ankara', 'Ankara'],
    ['samsun', 'Samsun'],
    ['oto', 'Oto'],
    ['auto', 'Auto'],
  ];
  for (const [rawSuf, prettySuf] of suffixes) {
    const idx = clean.toLowerCase().indexOf(rawSuf);
    if (idx > 0) {
      const prefix = clean.slice(0, idx).trim();
      const rest = clean.slice(idx + rawSuf.length).trim();
      const formattedPrefix =
        prefix.length <= 3 ? prefix.toUpperCase() : prefix[0].toUpperCase() + prefix.slice(1);
      return `${formattedPrefix} ${prettySuf}${rest ? ' ' + rest.toUpperCase() : ''}`.trim();
    }
  }
  return clean
    .split(' ')
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

const KNOWN_INSTAGRAM_PROFILES = {
  diestrogarage: {
    businessName: 'Diestro Garage Luxury',
    logo: '/images/diestrogarage/logo.jpg',
    categories: [
      'Seramik & Elmas Kaplama',
      'PPF Kaput Filmi & Araç Kaplama',
      'Pasta Cila, Jant Boyama & Boyasız Göçük Düzeltme',
    ],
    address: 'Ankara',
    phone: '0544 477 56 57',
    photos: [
      '/images/diestrogarage/1.jpg?v=2',
      '/images/diestrogarage/2.jpg?v=2',
      '/images/diestrogarage/3.jpg?v=2',
      '/images/diestrogarage/4.jpg?v=2',
      '/images/diestrogarage/6.jpg?v=2',
      '/images/diestrogarage/5.jpg?v=2',
    ],
    rawText:
      'DİESTRO GARAGE LUXURY Seramik Kaplama Araç Kaplama Elmas Kaplama Jant Boyama Kaput Filmi Cam Filmi Bodykit Aksesuar Boyasız Göçük Düzeltme Pasta Cila Detailing Ankara',
  },
  kyteknoloji: {
    businessName: 'KY Teknoloji',
    logo: '/images/kyteknoloji/logo.jpg',
    categories: ['Telefon Aksesuar ve Tamir', '2. El ve Sıfır Telefon'],
    address: 'Sincan 1. OSB Asora İş Merkezi (Boss Otel Yanı Zemin Kat), Sincan / Ankara',
    phone: '0544 477 56 57',
    photos: [
      '/images/kyteknoloji/1.jpg',
      '/images/kyteknoloji/2.jpg',
      '/images/kyteknoloji/3.jpg',
      '/images/kyteknoloji/4.jpg',
      '/images/kyteknoloji/5.jpg',
      '/images/kyteknoloji/6.jpg',
    ],
    rawText:
      'KY Teknoloji Telefon Aksesuar ve Tamir 2. El ve Sıfır Telefon Sincan 1. Osb Asora iş merkezi Boss otel yanı zemin kat Sincan Ankara',
  },
  cofferozz: {
    businessName: 'Cofferoz Kafe & Patisserie',
    logo: '/images/cofferozz/logo.jpg',
    categories: [
      'Kahve & Patisserie',
      'Kızılcahamam Bazlama Tost',
      'Kovada Tavuklu Pilav & Çiğ Köfte',
    ],
    address: 'Hacettepe Üniversitesi Beytepe Kampüsü, Çankaya / Ankara',
    phone: '0544 477 56 57',
    photos: [
      '/images/cofferozz/1.jpg',
      '/images/cofferozz/2.jpg',
      '/images/cofferozz/3.jpg',
      '/images/cofferozz/4.jpg',
      '/images/cofferozz/5.jpg',
      '/images/cofferozz/6.jpg',
    ],
    rawText:
      'Cofferoz Kafe & Patisserie Kahve Magnolia Profiterol Tiramisu San Sebastian Kızılcahamam Bazlama Tost Kovada Tavuklu Pilav Bayram Usta Çiğ Köfte Hacettepe Beytepe Ankara',
  },
  cofferoz: {
    businessName: 'Cofferoz Kafe & Patisserie',
    logo: '/images/cofferozz/logo.jpg',
    categories: [
      'Kahve & Patisserie',
      'Kızılcahamam Bazlama Tost',
      'Kovada Tavuklu Pilav & Çiğ Köfte',
    ],
    address: 'Hacettepe Üniversitesi Beytepe Kampüsü, Çankaya / Ankara',
    phone: '0544 477 56 57',
    photos: [
      '/images/cofferozz/1.jpg',
      '/images/cofferozz/2.jpg',
      '/images/cofferozz/3.jpg',
      '/images/cofferozz/4.jpg',
      '/images/cofferozz/5.jpg',
      '/images/cofferozz/6.jpg',
    ],
    rawText:
      'Cofferoz Kafe & Patisserie Kahve Magnolia Profiterol Tiramisu San Sebastian Kızılcahamam Bazlama Tost Kovada Tavuklu Pilav Bayram Usta Çiğ Köfte Hacettepe Beytepe Ankara',
  },
};

async function extractInstagramProfileData(igUrl) {
  try {
    const m = igUrl.match(/instagram\.com\/(?:_u\/)?([A-Za-z0-9._]+)/i);
    if (!m) return null;
    const username = m[1];
    const lowerUser = username.toLowerCase();
    if (['p', 'reel', 'reels', 'stories', 'explore', 'accounts'].includes(lowerUser)) {
      return null;
    }

    if (KNOWN_INSTAGRAM_PROFILES[lowerUser]) {
      return KNOWN_INSTAGRAM_PROFILES[lowerUser];
    }

    let fullName = '';
    let biography = '';
    let logoUrl = '';
    const photos = [];
    const captions = [];

    // 1. Primary Universal Endpoint: Instagram /embed/ with curl/8.4.0 UA (returns PolarisEmbedSimple + contextJSON)
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const rEmbed = await fetch(`https://www.instagram.com/${username}/embed/`, {
        headers: {
          'User-Agent': 'curl/8.4.0',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'tr-TR,tr;q=0.9',
        },
        signal: controller.signal,
      });
      clearTimeout(timer);
      const embedHtml = await rEmbed.text();
      const ctxMatch = embedHtml.match(/"contextJSON":"((?:\\.|[^"\\])*)"/);
      if (ctxMatch) {
        const innerJson = JSON.parse(`"${ctxMatch[1]}"`);
        const parsedCtx = JSON.parse(innerJson);
        const ctx = parsedCtx?.context || {};
        if (ctx.full_name && !fullName) fullName = ctx.full_name;
        if (ctx.profile_pic_url && !logoUrl) logoUrl = ctx.profile_pic_url;
        if (Array.isArray(ctx.graphql_media)) {
          const imagePosts = [];
          const videoPosts = [];
          for (const item of ctx.graphql_media) {
            const sm = item?.shortcode_media;
            if (!sm) continue;
            const cap = sm?.edge_media_to_caption?.edges?.[0]?.node?.text || '';
            if (cap && !captions.includes(cap)) captions.push(cap);
            const locName = sm?.location?.name || '';
            if (locName && !captions.includes(locName)) captions.push(locName);
            if (sm.display_url && sm.display_url.startsWith('http')) {
              if (sm.is_video) videoPosts.push(sm.display_url);
              else imagePosts.push(sm.display_url);
            }
          }
          for (const p of [...imagePosts, ...videoPosts]) {
            if (!photos.includes(p)) photos.push(p);
          }
        }
      }
    } catch (_) {}

    // 2. Try Residential Instagram Bridge (fast 1.8s timeout, enriches biography & HD profile pic if online)
    if (IG_RESIDENTIAL_BRIDGE_URL && (!biography || photos.length === 0)) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1800);
        const bRes = await fetch(
          `${IG_RESIDENTIAL_BRIDGE_URL}/?u=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        clearTimeout(timer);
        if (bRes.ok && (bRes.headers.get('content-type') || '').includes('application/json')) {
          const bData = await bRes.json();
          if (bData?.ok) {
            if (bData.fullName && !fullName) fullName = bData.fullName;
            if (bData.biography && !biography) biography = bData.biography;
            if (bData.logo) logoUrl = bData.logo;
            if (Array.isArray(bData.photos)) {
              for (const p of bData.photos) {
                if (p && !photos.includes(p)) photos.push(p);
              }
            }
            if (Array.isArray(bData.captions)) {
              for (const c of bData.captions) {
                if (c && !captions.includes(c)) captions.push(c);
              }
            }
          }
        }
      } catch (_) {}
    }

    // 3. Direct scrape fallback (Googlebot + OpenGraph crawlers for biography & HD logo)
    if (!biography || !logoUrl || !fullName) {
      let html = '';
      try {
        const rGb = await fetch(`https://www.instagram.com/${username}/`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept-Language': 'tr-TR,tr;q=0.9',
          },
        });
        html = await rGb.text();
      } catch (_) {}

      let fbHtml = '';
      if (!html.includes('"biography"') || !html.includes('og:title')) {
        for (const fallbackUa of [
          'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'WhatsApp/2.23.20.0',
        ]) {
          try {
            const rFb = await fetch(`https://www.instagram.com/${username}/`, {
              headers: {
                'User-Agent': fallbackUa,
                'Accept-Language': 'tr-TR,tr;q=0.9',
              },
            });
            const textFb = await rFb.text();
            if (textFb.includes('og:title') || textFb.includes('og:image')) {
              fbHtml = textFb;
              break;
            }
          } catch (_) {}
        }
      }

      const combinedHtml = `${html}\n${fbHtml}`;

      if (!fullName) {
        const fnMatch = combinedHtml.match(/"full_name":"((?:\\.|[^"\\])*)"/);
        if (fnMatch) {
          try {
            fullName = JSON.parse(`"${fnMatch[1]}"`);
          } catch (_) {}
        }
      }
      if (!biography) {
        const bioMatch = combinedHtml.match(/"biography":"((?:\\.|[^"\\])*)"/);
        if (bioMatch) {
          try {
            biography = JSON.parse(`"${bioMatch[1]}"`);
          } catch (_) {}
        }
      }

      const hdPicMatch = combinedHtml.match(
        /"hd_profile_pic_url_info":\{"height":\d+,"url":"((?:\\.|[^"\\])*)"/
      );
      const picMatch = hdPicMatch || combinedHtml.match(/"profile_pic_url":"((?:\\.|[^"\\])*)"/);
      if (picMatch) {
        try {
          const parsedPic = JSON.parse(`"${picMatch[1]}"`);
          if (parsedPic && parsedPic.startsWith('http')) {
            logoUrl = parsedPic;
          }
        } catch (_) {}
      }

      if (!fullName) {
        const titleMatch =
          combinedHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:title["']/i);
        if (titleMatch) {
          const rawTitle = unescapeHtml(titleMatch[1]);
          const tName = rawTitle.match(/^([^(@•]+?)\s*\(@/i);
          if (tName) fullName = tName[1].trim();
        }
      }

      if (!biography) {
        const descMatch =
          combinedHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i) ||
          combinedHtml.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+property=["']og:description["']/i);
        if (descMatch) {
          const rawDesc = unescapeHtml(descMatch[1]);
          const bioQuote = rawDesc.match(/:\s*"([\s\S]*)"\s*$/);
          if (bioQuote) {
            biography = bioQuote[1].trim();
          }
        }
      }

      for (const cm of combinedHtml.matchAll(/"text":"((?:\\.|[^"\\]){5,600})"/g)) {
        try {
          const txt = JSON.parse(`"${cm[1]}"`);
          if (!/Meta AI|yapay zeka koşullarını/i.test(txt) && !captions.includes(txt)) {
            captions.push(txt);
          }
        } catch (_) {}
      }

      for (const im of combinedHtml.matchAll(/"candidates":\[\{"height":\d+,"url":"((?:\\.|[^"\\])*)"/g)) {
        try {
          const pUrl = JSON.parse(`"${im[1]}"`);
          if (pUrl && pUrl.startsWith('http') && pUrl !== logoUrl && !photos.includes(pUrl)) {
            photos.push(pUrl);
          }
        } catch (_) {}
      }

      const imgMatch =
        combinedHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgMatch) {
        const ogImg = unescapeHtml(imgMatch[1]);
        if (ogImg && ogImg.startsWith('http') && !logoUrl) {
          logoUrl = ogImg;
        }
      }
    }

    const stripEmojis = (str) =>
      str
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const bioLines = biography
      .split(/\r?\n/)
      .map(stripEmojis)
      .filter((l) => l.length > 2);

    let address = '';
    const categories = [];
    const allLines = [...bioLines, ...captions.flatMap((c) => c.split(/\r?\n|\|/).map(stripEmojis))];

    const addrRegex =
      /(?:\b(?:mahallesi|mah\.?|bulvarı|blv\.?|caddesi|cad\.?|sokak|sok\.?|sk\.?|osb|organize sanayi|sanayi sitesi|iş merkezi|is merkezi|plaza|avm|kat\b|no\s*:|sincan|çankaya|keçiören|yenimahalle|mamak|etimesgut|altındağ|gölbaşı|ivedik|ostim|şaşmaz|kızılay|çayyolu|ümitköy|batıkent|eryaman|hacettepe|beytepe|odtü|bilkent|atakum|ilkadım|canik|tekkeköy|bafra|çarşamba)\b)/i;

    for (const line of allLines) {
      if (!line || line.startsWith('#') || line.startsWith('@')) continue;
      if (!address && addrRegex.test(line) && line.length >= 10 && line.length <= 140) {
        address = line.replace(/@[A-Za-z0-9._]+/g, '').trim();
      } else if (categories.length < 3 && bioLines.includes(line) && !addrRegex.test(line)) {
        categories.push(line);
      }
    }

    const allCombined = `${biography} ${captions.join(' ')}`.toLocaleLowerCase('tr-TR');
    if (
      /(ankara|sincan|çankaya|cankaya|keçiören|kecioren|yenimahalle|mamak|etimesgut|altındağ|gölbaşı|kızılcahamam|ivedik|ostim|şaşmaz|kızılay|çayyolu|batıkent|eryaman|hacettepe|beytepe|odtü|odtu|bilkent)/.test(
        allCombined
      )
    ) {
      if (address && !/ankara/i.test(address)) {
        address = `${address}, Ankara`;
      } else if (!address) {
        address = 'Ankara';
      }
    }

    let phone = '';
    const pMatch = `${biography} ${captions.join(' ')}`.match(
      /(?:0\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2}|\+90\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2})/
    );
    if (pMatch) {
      phone = pMatch[0].trim();
    }

    const cleanPhotos = photos.filter((p) => p && p !== logoUrl).slice(0, 6);

    return {
      businessName: formatInstagramHandle(username, fullName),
      logo: logoUrl,
      categories,
      address,
      phone,
      photos: cleanPhotos,
      rawText: `${biography} ${captions.join(' ')}`,
    };
  } catch (_) {
    return null;
  }
}

async function extractWebsiteLogoAndPhotos(siteUrl) {
  const result = { logo: '', photos: [] };
  if (!siteUrl) return result;
  if (/instagram\.com/i.test(siteUrl)) {
    const ig = await extractInstagramProfileData(siteUrl);
    if (ig) {
      result.logo = ig.logo || '';
      result.photos = ig.photos || [];
    }
    return result;
  }
  try {
    const res = await fetch(siteUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    const html = await res.text();
    const resolveHref = (rawUrl) => {
      try {
        return new URL(unescapeHtml(rawUrl), siteUrl).href;
      } catch {
        return '';
      }
    };

    // 1. Check for explicit logo img or apple-touch-icon
    const logoImgMatch =
      html.match(/<img[^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/i) ||
      html.match(/<img[^>]+src=["']([^"']*logo[^"']*\.(?:png|jpg|jpeg|webp|svg)[^"']*)["']/i) ||
      html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
    if (logoImgMatch) {
      const lUrl = resolveHref(logoImgMatch[1]);
      if (lUrl && lUrl.startsWith('http')) result.logo = lUrl;
    }

    const ogMatches = [
      ...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi),
      ...html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi),
    ];
    for (const m of ogMatches) {
      const imgUrl = resolveHref(m[1]);
      if (imgUrl && imgUrl.startsWith('http')) {
        if (!result.logo) result.logo = imgUrl;
        else if (!result.photos.includes(imgUrl)) result.photos.push(imgUrl);
      }
    }

    const imgTags = [...html.matchAll(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)];
    for (const m of imgTags) {
      const imgUrl = resolveHref(m[1]);
      if (
        imgUrl &&
        imgUrl.startsWith('http') &&
        !/icon|avatar|sprite|pixel|badge|flag/i.test(imgUrl)
      ) {
        if (/logo/i.test(imgUrl) && !result.logo) {
          result.logo = imgUrl;
        } else if (imgUrl !== result.logo && !result.photos.includes(imgUrl)) {
          result.photos.push(imgUrl);
        }
      }
    }
  } catch (_) {}
  result.photos = result.photos.slice(0, 6);
  return result;
}

async function resolveBusinessInfo(rawText) {
  const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
  const inputUrl = urlMatch ? urlMatch[0] : '';
  const extraNotes = rawText.replace(/https?:\/\/[^\s]+/gi, '').trim();

  if (inputUrl && !extraNotes) {
    const cleanInput = inputUrl.replace(/\/+$/, '');
    for (const seedEntry of Object.values(SEED_SITES)) {
      if (seedEntry.u && seedEntry.u.replace(/\/+$/, '') === cleanInput) {
        return { ...seedEntry };
      }
    }
  }

  let businessName = '';
  let address = '';
  let phone = '';
  let logo = '';
  let categories = [];
  let website = '';
  let mapQuery = '';
  let photos = [];
  let reviews = [];
  let allReviewTexts = [];
  let ownerBio = '';
  let hours = '';
  let rating = '';
  let reviewCount = 0;
  let pageText = '';
  let resolvedUrl = inputUrl;

  if (inputUrl && /instagram\.com/i.test(inputUrl)) {
    const igData = await extractInstagramProfileData(inputUrl);
    if (igData) {
      if (igData.businessName) businessName = igData.businessName;
      if (igData.logo) logo = igData.logo;
      if (igData.categories?.length) categories = igData.categories;
      if (igData.address) address = igData.address;
      if (igData.phone) phone = igData.phone;
      if (igData.photos?.length) photos = igData.photos;
      if (igData.rawText) pageText = igData.rawText;
    }
  }

  if (inputUrl && !/instagram\.com/i.test(inputUrl)) {
    try {
      const res1 = await fetch(inputUrl, {
        redirect: 'follow',
        headers: GMAPS_HEADERS,
      });
      const finalUrl = res1.url || inputUrl;
      resolvedUrl = finalUrl;
      let pageHtml = await res1.text();

      if (!pageHtml.includes('/maps/preview/place')) {
        try {
          const uObj = new URL(finalUrl);
          const qVal = uObj.searchParams.get('q') || '';
          const ftidVal = uObj.searchParams.get('ftid') || '';
          if (qVal) {
            const parts = qVal.split(',');
            businessName = parts[0].trim();
            if (parts.length > 1) {
              address = parts.slice(1).join(',').trim();
            }
            mapQuery = qVal.trim();
          }
          if (qVal && ftidVal) {
            const placeUrl = `https://www.google.com/maps/place/${encodeURIComponent(
              qVal
            )}/data=!4m2!3m1!1s${ftidVal}?hl=tr&gl=tr`;
            const resPlace = await fetch(placeUrl, { headers: GMAPS_HEADERS });
            pageHtml = await resPlace.text();
          } else if (qVal) {
            const searchRes = await fetch(
              `https://www.google.com/maps/search/${encodeURIComponent(qVal)}?hl=tr&gl=tr`,
              { headers: GMAPS_HEADERS }
            );
            const searchHtml = await searchRes.text();
            const tbmMatch = searchHtml.match(/href="(\/search\?tbm=map[^"]+)"/);
            if (tbmMatch) {
              const tbmUrl = 'https://www.google.com' + unescapeHtml(tbmMatch[1]);
              const tbmRes = await fetch(tbmUrl, { headers: GMAPS_HEADERS });
              const tbmTxt = await tbmRes.text();
              const ftids = [
                ...new Set(tbmTxt.match(/0x[0-9a-f]+:0x[0-9a-f]+/gi) || []),
              ].filter((f) => !f.startsWith('0x0:'));
              if (ftids[0]) {
                const placeUrl = `https://www.google.com/maps/place/${encodeURIComponent(
                  qVal
                )}/data=!4m2!3m1!1s${ftids[0]}?hl=tr&gl=tr`;
                const resPlace = await fetch(placeUrl, { headers: GMAPS_HEADERS });
                pageHtml = await resPlace.text();
              }
            }
          }
        } catch (_) {}
      }

      const previewMatch = pageHtml.match(/href="(\/maps\/preview\/place\?[^"]+)"/);
      if (previewMatch) {
        const previewUrl = 'https://www.google.com' + unescapeHtml(previewMatch[1]);
        const prevRes = await fetch(previewUrl, { headers: GMAPS_HEADERS });
        const rawJsonText = await prevRes.text();
        const firstBracket = rawJsonText.indexOf('[');
        if (firstBracket !== -1) {
          const parsed = JSON.parse(rawJsonText.slice(firstBracket));
          const d = parsed[6];
          if (Array.isArray(d)) {
            if (typeof d[11] === 'string' && d[11].trim()) {
              businessName = d[11].trim();
            }
            if (Array.isArray(d[13])) {
              categories = d[13].filter((c) => typeof c === 'string');
            }
            if (typeof d[39] === 'string' && d[39].trim()) {
              address = d[39].trim();
            } else if (Array.isArray(d[2])) {
              address = d[2].join(', ');
            }
            if (Array.isArray(d[178]) && Array.isArray(d[178][0]) && typeof d[178][0][0] === 'string') {
              phone = d[178][0][0].trim();
            }
            if (Array.isArray(d[7]) && typeof d[7][0] === 'string') {
              website = d[7][0].trim();
            }
            // Extract Owner's Official Business Description (Hakkında / İşletme Sahibinden)
            if (typeof d[154]?.[0]?.[0] === 'string' && d[154][0][0].trim()) {
              ownerBio = d[154][0][0].trim();
            }
            // Extract Official Working Hours
            if (Array.isArray(d[203]?.[0])) {
              hours = formatGoogleHours(d[203][0]);
            }
            // Extract Official Google Rating & Review Count
            if (d[4]?.[7] !== undefined && d[4]?.[7] !== null) {
              rating = String(d[4][7]);
            }
            if (typeof d[4]?.[8] === 'number') {
              reviewCount = d[4][8];
            }

            if (Array.isArray(d[51]) && Array.isArray(d[51][0])) {
              for (const pItem of d[51][0]) {
                try {
                  let pUrl = pItem?.[6]?.[0];
                  if (typeof pUrl === 'string' && pUrl.length > 10) {
                    if (pUrl.startsWith('//')) pUrl = 'https:' + pUrl;
                    pUrl = pUrl.split('=')[0] + '=w1200-h800-k-no';
                    if (!photos.includes(pUrl)) photos.push(pUrl);
                  }
                } catch (_) {}
              }
            }

            const extraPhotoMatches = rawJsonText.match(
              /https:\/\/lh[35]\.googleusercontent\.com\/(?:grass-cs|gps-cs-s|p)\/[A-Za-z0-9_=-]+/g
            );
            if (extraPhotoMatches) {
              for (const rawP of extraPhotoMatches) {
                const cleanP = rawP.split('=')[0] + '=w1200-h800-k-no';
                if (!photos.includes(cleanP)) photos.push(cleanP);
              }
            }

            const negativeReviewRegex =
              /(bir daha yiyeceğimi sanmıyorum|eski lezzeti alamadım|memnun kalmadım|tavsiye etmem|önermiyorum|hayal kırıklığı|kötü olmuş|kötüydü|pek beğenemedim|beğenmedim|sevmedik|sevmedim|kirli|bayat|yavaştı|maalesef|bozmuş|berbat|özensiz|havasız|yanık|lezzetsiz)/i;

            if (Array.isArray(d[175]?.[9]?.[0]?.[0])) {
              for (const revWrap of d[175][9][0][0]) {
                try {
                  const rev = revWrap?.[0];
                  const author = rev?.[1]?.[4]?.[5]?.[0] || 'Google Kullanıcısı';
                  const stars = rev?.[2]?.[0]?.[0] || 5;
                  const rText = rev?.[2]?.[15]?.[0]?.[0] || '';
                  if (rText) {
                    allReviewTexts.push(rText);
                  }
                  if (
                    rText &&
                    rText.length >= 15 &&
                    stars >= 4 &&
                    !negativeReviewRegex.test(rText)
                  ) {
                    reviews.push({
                      author,
                      role: 'Google Yorumu',
                      group: categories[0] || businessName,
                      text: rText,
                    });
                  }
                } catch (_) {}
              }
            }
          }
        }
      }

      const decoded = decodeURIComponent(finalUrl.replace(/\+/g, ' '));
      if (!businessName) {
        const placeMatch = decoded.match(/\/maps\/place\/([^/@?]+)/i);
        if (placeMatch) {
          const rawPlace = placeMatch[1].trim();
          const parts = rawPlace.split(',');
          businessName = parts[0].trim();
          if (!address && parts.length > 1) {
            address = parts.slice(1).join(',').trim();
          }
          mapQuery = rawPlace;
        }
      }

      if (!inputUrl.includes('google.com') && !inputUrl.includes('goo.gl')) {
        pageText = pageHtml.replace(/<[^>]+>/g, ' ');
        const ogTitle = pageHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
        const titleTag = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
        const rawTitle = (ogTitle && ogTitle[1]) || (titleTag && titleTag[1]) || '';
        if (!businessName && rawTitle && !/google maps|instagram/i.test(rawTitle.trim())) {
          businessName = unescapeHtml(rawTitle).split('|')[0].split(' - ')[0].trim();
        }
        const directMedia = await extractWebsiteLogoAndPhotos(inputUrl);
        if (directMedia.logo && !logo) logo = directMedia.logo;
        for (const dp of directMedia.photos) {
          if (!photos.includes(dp)) photos.push(dp);
        }
      }
    } catch (_) {}
  }

  if (website && (!logo || photos.length < 4)) {
    if (/instagram\.com/i.test(website)) {
      const igFromWeb = await extractInstagramProfileData(website);
      if (igFromWeb) {
        if (igFromWeb.logo && !logo) logo = igFromWeb.logo;
        if (igFromWeb.photos?.length) {
          for (const ip of igFromWeb.photos) {
            if (!photos.includes(ip)) photos.push(ip);
          }
        }
      }
    } else {
      const webMedia = await extractWebsiteLogoAndPhotos(website);
      if (webMedia.logo && !logo) logo = webMedia.logo;
      for (const wp of webMedia.photos) {
        if (!photos.includes(wp)) photos.push(wp);
      }
    }
  }

  const userPhoneMatch = extraNotes.match(
    /(?:0\s*\(?\s*\d{3}\s*\)?\s*\d{3}\s*\d{2}\s*\d{2}|\+90\s*\(?\s*\d{3}\s*\)?\s*\d{3}\s*\d{2}\s*\d{2})/
  );
  if (userPhoneMatch) {
    phone = userPhoneMatch[0].trim();
  }

  if (!businessName && extraNotes) {
    businessName = extraNotes.split('\n')[0].slice(0, 60).trim();
  }
  if (!businessName || /^google maps$/i.test(businessName)) {
    businessName = 'Kurumsal İşletme Merkezi';
  }

  let searchSnippets = '';
  if (!phone || !address) {
    const searchEngines = [
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(`${businessName} ${address || ''} telefon adres`.trim())}`,
      `https://search.yahoo.com/search?p=${encodeURIComponent(`${businessName} ${address || ''} telefon`.trim())}`,
    ];

    for (const searchUrl of searchEngines) {
      if (phone && address) break;
      try {
        const sRes = await fetch(searchUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        });
        const sHtml = await sRes.text();
        const textSnippet = sHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        searchSnippets += ' ' + textSnippet;

        if (!phone) {
          const pMatch = textSnippet.match(
            /(?:0\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2}|\+90\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2})/
          );
          if (pMatch) {
            phone = pMatch[0].trim();
          }
        }

        if (!address) {
          const addrMatch = textSnippet.match(
            /([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s.,/-]{10,65}(?:Mahallesi|Mah\.|Bulvarı|Blv\.|Caddesi|Cad\.|Sokak|Sok\.|Sanayi Sitesi)[A-ZÇĞİÖŞÜa-zçğıöşü0-9\s.,/:-]{5,50})/i
          );
          if (addrMatch) {
            address = addrMatch[1].trim();
          }
        }
      } catch (_) {}
    }
  }

  if (!phone) {
    phone = '0544 477 56 57';
  }
  if (!address) {
    address = 'Merkez / Türkiye';
  }
  if (!mapQuery) {
    mapQuery = `${businessName}, ${address}`;
  }

  const categoryText = categories.join(' • ');
  // Primary text (businessName + categories + extraNotes) takes strict priority over secondary snippets
  const sector = detectSector(
    `${businessName} ${categoryText} ${extraNotes}`,
    `${ownerBio} ${pageText} ${address} ${searchSnippets}`
  );

  const learnedItems = extractRealBusinessOfferings({
    businessName,
    categories,
    ownerBio,
    reviews: allReviewTexts.length > 0 ? allReviewTexts : reviews,
    pageText,
    sector,
  });

  // Try discovering Instagram profile logo if no logo was found yet
  if (!logo && businessName && businessName !== 'Kurumsal İşletme Merkezi') {
    const baseSlug = slugify(businessName);
    const candidateHandles = [
      baseSlug.replace(/-/g, ''),
      baseSlug.replace(/-/g, '.'),
    ].filter((h) => h.length >= 4);
    for (const h of candidateHandles) {
      try {
        const igTry = await extractInstagramProfileData(`https://www.instagram.com/${h}/`);
        if (igTry?.logo) {
          logo = igTry.logo;
          break;
        }
      } catch (_) {}
    }
  }

  const proxiedLogo = logo
    ? logo.startsWith('/')
      ? logo
      : `/api/telegram?img=${encodeURIComponent(logo)}`
    : `/api/telegram?svglogo=1&n=${encodeURIComponent(formatBusinessTitle(businessName))}&s=${encodeURIComponent(sector)}`;

  const proxiedPhotos = photos
    .filter((pUrl) => pUrl && pUrl !== logo)
    .slice(0, 6)
    .map((pUrl) => (pUrl.startsWith('/') ? pUrl : `/api/telegram?img=${encodeURIComponent(pUrl)}`));

  businessName = formatBusinessTitle(businessName);

  return {
    n: businessName,
    a: address,
    p: phone,
    c: categoryText,
    s: sector,
    q: mapQuery,
    u: inputUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
    l: proxiedLogo,
    logo: proxiedLogo,
    bio: ownerBio || undefined,
    hr: hours || undefined,
    rt: rating || undefined,
    rc: reviewCount || undefined,
    items: learnedItems.length > 0 ? learnedItems : undefined,
    resolvedUrl,
    photos: proxiedPhotos,
    reviews: reviews.slice(0, 6),
  };
}

function parseEmbeddedWizardState(text = '') {
  const liveSlugMatch = text.match(
    /https?:\/\/(?:ankara|samsun)-web-siteleri\.vercel\.app\/([a-z0-9-]+)/i
  );
  const linkMatch =
    text.match(/🔗 (?:Link|Kaynak):\s*(https?:\/\/[^\s\n]+)/i) ||
    text.match(/(https?:\/\/(?!(?:ankara|samsun)-web-siteleri)[^\s\n]+)/i);
  const cityMatch = text.match(/🌆 Şehir(?:\s*\/\s*Alan Adı)?:\s*(Ankara|Samsun)/i);
  const sectorMatch = text.match(/🎯 SektörKod:\s*([a-z_]+)/i);
  const districtMatch = text.match(/📍 Bölge:\s*([^\n]+)/i);
  const photoModeMatch = text.match(/📸 GörselMod:\s*(auto|studio)/i);
  return {
    url: linkMatch ? linkMatch[1].trim() : '',
    city: cityMatch ? cityMatch[1].trim() : 'Ankara',
    sector: sectorMatch ? sectorMatch[1].trim() : '',
    district: districtMatch ? districtMatch[1].trim() : 'keep',
    photoMode: photoModeMatch ? photoModeMatch[1].trim() : 'auto',
    slug: liveSlugMatch ? liveSlugMatch[1].trim() : '',
  };
}

const LAST_WIZARD_STATE_BY_CHAT = new Map();

async function finalizeAndSendWebsite(chatId, wizardState, customNotes = '') {
  const chosenCity = wizardState.city === 'Samsun' ? 'Samsun' : 'Ankara';
  const baseUrl = chosenCity === 'Ankara' ? ANKARA_BASE_URL : SITE_BASE_URL;
  const cached = LAST_WIZARD_STATE_BY_CHAT.get(chatId);

  const fullInfo = await resolveBusinessInfo(`${wizardState.url} ${customNotes}`.trim());

  if (wizardState.sector) {
    fullInfo.s = wizardState.sector;
  }

  // Apply District / City selection
  if (wizardState.district && wizardState.district !== 'keep') {
    if (
      fullInfo.a === 'Merkez / Türkiye' ||
      fullInfo.a === 'Ankara' ||
      fullInfo.a === 'Samsun' ||
      fullInfo.a === 'Ankara / Türkiye' ||
      fullInfo.a === 'Samsun / Türkiye'
    ) {
      fullInfo.a = `${wizardState.district}, ${chosenCity}`;
    } else if (!fullInfo.a.toLocaleLowerCase('tr-TR').includes(wizardState.district.toLocaleLowerCase('tr-TR'))) {
      fullInfo.a = `${fullInfo.a}, ${wizardState.district} / ${chosenCity}`;
    }
  } else {
    if (
      fullInfo.a === 'Merkez / Türkiye' ||
      fullInfo.a === 'Ankara' ||
      fullInfo.a === 'Samsun' ||
      fullInfo.a === 'Ankara / Türkiye' ||
      fullInfo.a === 'Samsun / Türkiye'
    ) {
      fullInfo.a = `${chosenCity} / Türkiye`;
    } else if (!fullInfo.a.toLocaleLowerCase('tr-TR').includes(chosenCity.toLocaleLowerCase('tr-TR'))) {
      fullInfo.a = `${fullInfo.a}, ${chosenCity}`;
    }
  }

  let customItems = wizardState.customItems || cached?.customItems || [];

  // Apply custom notes (phone, address, or custom taught menu/services) if user typed any
  if (customNotes.trim()) {
    const pMatch = customNotes.match(
      /(?:0\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2}|\+90\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2})/
    );
    if (pMatch) {
      fullInfo.p = pMatch[0].trim();
    }
    const remainingText = customNotes
      .replace(
        /(?:0\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2}|\+90\s*\(?\s*(?:2\d{2}|3\d{2}|4\d{2}|5\d{2})\s*\)?\s*\d{3}\s*\d{2}\s*\d{2})/g,
        ''
      )
      .replace(/^(?:menü|menu|hizmetler|ürünler|urunler)\s*:\s*/i, '')
      .replace(/^[\s,-]+|[\s,-]+$/g, '')
      .trim();

    if (remainingText.length > 3) {
      if (
        /(mah\.|mahallesi|cad\.|caddesi|sok\.|sokak|bulvar|osb|no:|kat\b)/i.test(remainingText) &&
        !wizardState.teachingItems
      ) {
        fullInfo.a = remainingText.includes(chosenCity)
          ? remainingText
          : `${remainingText}, ${chosenCity}`;
      } else {
        const splitItems = remainingText
          .split(/[,•\n;]+/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 2);
        if (splitItems.length >= 2 || wizardState.teachingItems) {
          customItems = splitItems.slice(0, 6);
        }
        fullInfo.c = fullInfo.c ? `${fullInfo.c} • ${remainingText}` : remainingText;
      }
    }
  }

  if (customItems.length > 0) {
    fullInfo.ci = customItems;
    fullInfo.items = extractRealBusinessOfferings({
      businessName: fullInfo.n,
      sector: fullInfo.s,
      customItems,
    });
  }

  fullInfo.n = formatBusinessTitle(fullInfo.n);
  fullInfo.q = `${fullInfo.n}, ${fullInfo.a}`;

  const photoMode = wizardState.photoMode === 'studio' ? 'studio' : 'auto';
  const tgLogo = wizardState.tgLogo || cached?.tgLogo || '';
  const tgPhotos = wizardState.tgPhotos || cached?.tgPhotos || [];

  if (tgLogo) {
    fullInfo.l = `/api/telegram?tgfile=${encodeURIComponent(tgLogo)}`;
    fullInfo.logo = fullInfo.l;
  }

  const slug = slugify(fullInfo.n);
  const rawSlug = rawSlugify(fullInfo.n);
  const siteRecord = {
    n: fullInfo.n,
    a: fullInfo.a,
    p: fullInfo.p,
    c: fullInfo.c,
    s: fullInfo.s,
    q: fullInfo.q,
    u: fullInfo.u,
    city: chosenCity,
    district: wizardState.district || 'keep',
    pm: photoMode,
    l: fullInfo.l || '',
    logo: fullInfo.logo || fullInfo.l || '',
    bio: fullInfo.bio,
    hr: fullInfo.hr,
    rt: fullInfo.rt,
    rc: fullInfo.rc,
    ci: customItems.length > 0 ? customItems : undefined,
    items: fullInfo.items,
    ph:
      tgPhotos.length > 0
        ? tgPhotos.slice(0, 6).map((fid) => `/api/telegram?tgfile=${encodeURIComponent(fid)}`)
        : undefined,
    photos: fullInfo.photos,
    reviews: fullInfo.reviews,
  };

  await saveSiteBySlug(slug, siteRecord);
  if (rawSlug && rawSlug !== slug) {
    await saveSiteBySlug(rawSlug, siteRecord);
  }

  LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
    url: wizardState.url,
    city: chosenCity,
    sector: fullInfo.s,
    district: wizardState.district || 'keep',
    photoMode,
    tgLogo,
    tgPhotos,
    customItems,
    slug,
    ts: Date.now(),
  });

  const liveUrl = `${baseUrl}/${slug}`;
  const themeLabel = getSectorLabel(fullInfo.s);
  const oppositeCity = chosenCity === 'Ankara' ? 'Samsun' : 'Ankara';

  const photoSummaryText =
    tgPhotos.length > 0
      ? `${tgPhotos.length} Adet Telegram'dan Yüklenen Fotoğraf ✅`
      : photoMode === 'studio'
      ? '6 Adet Profesyonel 16:10 Yatay Sektör Stüdyo Fotoğrafı ✨'
      : `${fullInfo.photos.length} Adet İşletme Fotoğrafı + HD Stüdyo Tamamlama ✅`;

  const learnedSummary =
    Array.isArray(fullInfo.items) && fullInfo.items.length > 0
      ? fullInfo.items.map((it) => it.title).join(', ')
      : fullInfo.c || themeLabel;

  await sendTelegram(
    chatId,
    `✅ Kurumsal Web Sitesi İncelendi, Öğrenildi ve Yayına Alındı!\n\n` +
      `🏢 İşletme: ${fullInfo.n}\n` +
      `🌆 Şehir: ${chosenCity}\n` +
      `🎯 Konsept: ${getShortSectorLabel(fullInfo.s)}\n` +
      (fullInfo.rt ? `⭐ Google Puanı: ${fullInfo.rt} / 5 (${fullInfo.rc || 'Onaylı'} Yorum)\n` : '') +
      (fullInfo.hr ? `🕒 Çalışma Saatleri: ${fullInfo.hr}\n` : '') +
      `📍 Adres: ${fullInfo.a}\n` +
      `📞 Telefon: ${fullInfo.p}\n` +
      `🧠 Öğrenilen Menü / Hizmetler: ${learnedSummary}\n` +
      `🖼️ Logo: ${fullInfo.logo ? 'Orijinal Logo Eklendi ✅' : 'Kurumsal Monogram ✅'}\n` +
      `📸 Görseller: ${photoSummaryText}\n` +
      `🔗 Kaynak: ${wizardState.url}\n\n` +
      `🌐 Müşteriye Gönderilecek Kısa Link:\n${liveUrl}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🧠 Menü / Hizmetleri Öğret & Düzenle',
              callback_data: 'qf:items',
            },
          ],
          [
            photoMode === 'studio'
              ? { text: '📸 İşletmenin Kendi Fotoğraflarını Kullan', callback_data: 'qf:auto' }
              : {
                  text: '✨ Fotoğrafları 16:10 Stüdyo HD Yap (Afişleri Kaldır)',
                  callback_data: 'qf:studio',
                },
          ],
          [
            { text: '🎯 Sektör / Video Değiştir', callback_data: `w1:${chosenCity}` },
            { text: `🌆 Şehri ${oppositeCity} Yap`, callback_data: `qf:city:${oppositeCity}` },
          ],
        ],
      },
    }
  );

  return { liveUrl, fullInfo };
}

function generateBespokeSvgLogo(rawName = 'Kurumsal', sector = 'corporate_editorial') {
  const clean = String(rawName || 'Kurumsal')
    .replace(/[<>&"']/g, '')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const mainTitle = (words[0] || 'MARKA').slice(0, 10).toLocaleUpperCase('tr-TR');
  const subTitle = (
    words.length > 1 ? words.slice(1).join(' ') : getShortSectorLabel(sector)
  )
    .slice(0, 18)
    .toLocaleUpperCase('tr-TR');

  let h = 2166136261;
  for (let i = 0; i < clean.length; i++) {
    h ^= clean.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }

  const palettes = [
    { bg: '#141417', primary: '#EAB308', secondary: '#FEF08A', text: '#EAB308' },
    { bg: '#0B5340', primary: '#A7F3D0', secondary: '#E6F4EA', text: '#FFFFFF' },
    { bg: '#231712', primary: '#E05A47', secondary: '#F4D3B2', text: '#FFF8F0' },
    { bg: '#1D5B4F', primary: '#E2CEA5', secondary: '#F5EBE0', text: '#E2CEA5' },
    { bg: '#6B1D24', primary: '#FDE68A', secondary: '#FFFBEB', text: '#FFFBEB' },
    { bg: '#090D16', primary: '#38BDF8', secondary: '#BAE6FD', text: '#E0F2FE' },
    { bg: '#181824', primary: '#F59E0B', secondary: '#FDE68A', text: '#FFFFFF' },
    { bg: '#1C1917', primary: '#FB923C', secondary: '#FED7AA', text: '#FFFFFF' },
  ];

  let pal = palettes[h % palettes.length];
  if (sector === 'dental_medical') {
    pal = { bg: '#0F172A', primary: '#14B8A6', secondary: '#99F6E4', text: '#FFFFFF' };
  } else if (sector === 'mercedes_luxury' || sector === 'auto_detailing') {
    pal = { bg: '#09090B', primary: '#E4E4E7', secondary: '#A1A1AA', text: '#FFFFFF' };
  } else if (sector === 'industrial_heating' || sector === 'pizza_italian') {
    pal = { bg: '#7F1D1D', primary: '#FBBF24', secondary: '#FDE68A', text: '#FFFFFF' };
  }

  const fontSize = mainTitle.length <= 4 ? 32 : mainTitle.length <= 6 ? 24 : 18;
  const variant = h % 3;
  const frame =
    variant === 0
      ? `<rect width="120" height="120" rx="26" fill="${pal.bg}"/><rect x="6" y="6" width="108" height="108" rx="20" stroke="${pal.primary}" stroke-width="2.6"/>`
      : variant === 1
      ? `<rect width="120" height="120" rx="60" fill="${pal.bg}"/><circle cx="60" cy="60" r="53" stroke="${pal.primary}" stroke-width="2.6"/><circle cx="60" cy="60" r="48" stroke="${pal.secondary}" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.5"/>`
      : `<rect width="120" height="120" rx="26" fill="${pal.bg}"/><path d="M18 104V50C18 27.9086 36.804 10 60 10C83.196 10 102 27.9086 102 50V104H18Z" stroke="${pal.primary}" stroke-width="2.5" fill="none"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  ${frame}
  <circle cx="60" cy="26" r="3.5" fill="${pal.primary}"/>
  <text x="60" y="63" text-anchor="middle" fill="${pal.text}" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="${fontSize}" letter-spacing="1.8">${mainTitle}</text>
  <line x1="26" y1="74" x2="94" y2="74" stroke="${pal.primary}" stroke-width="1.5" stroke-opacity="0.55"/>
  <text x="60" y="92" text-anchor="middle" fill="${pal.secondary}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="9" letter-spacing="2.2">${subTitle}</text>
</svg>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 0A. Bespoke Dynamic SVG Logo Generator (GET /api/telegram?svglogo=1&n=<name>&s=<sector>)
  if (req.method === 'GET' && req.query?.svglogo) {
    const svg = generateBespokeSvgLogo(req.query.n || 'Kurumsal', req.query.s || 'corporate_editorial');
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    return res.status(200).send(svg);
  }

  // 0. Clean Slug Site Resolver (GET /api/telegram?slug=<slug>&host=<host>)
  if (req.method === 'GET' && req.query?.slug) {
    try {
      const info = await loadSiteBySlug(req.query.slug, req.query.host || '');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).json({ ok: true, info });
    } catch (e) {
      return res.status(500).json({ ok: false, error: String(e) });
    }
  }

  // 1. Telegram Uploaded File Proxy (GET /api/telegram?tgfile=<file_id>)
  if (req.method === 'GET' && req.query?.tgfile) {
    try {
      const fileId = req.query.tgfile;
      const metaRes = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`
      );
      const metaJson = await metaRes.json();
      const filePath = metaJson?.result?.file_path;
      if (!filePath) {
        return res.status(404).end();
      }
      const imgRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`);
      if (!imgRes.ok) {
        return res.status(404).end();
      }
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      return res.status(200).send(Buffer.from(arrayBuf));
    } catch (_) {
      return res.status(500).end();
    }
  }

  // 2. External Image Proxy (GET /api/telegram?img=<url>) — bypasses Instagram/Facebook SameOrigin CORP blocks
  if (req.method === 'GET' && req.query?.img) {
    try {
      const targetImg = req.query.img;
      const isIgCdn = /instagram\.com|fbcdn\.net|cdninstagram\.com/i.test(targetImg);
      const imgRes = await fetch(targetImg, {
        headers: {
          'User-Agent': GMAPS_HEADERS['User-Agent'],
          Referer: isIgCdn ? 'https://www.instagram.com/' : 'https://www.google.com/',
        },
      });
      if (!imgRes.ok) {
        return res.status(404).end();
      }
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800, immutable');
      return res.status(200).send(Buffer.from(arrayBuf));
    } catch (_) {
      return res.status(500).end();
    }
  }

  // 3. Place & Instagram Live Info Endpoint (GET /api/telegram?place=<url>)
  if (req.method === 'GET' && req.query?.place) {
    try {
      const info = await resolveBusinessInfo(req.query.place);
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      return res.status(200).json({ ok: true, info });
    } catch (e) {
      return res.status(500).json({ ok: false, error: String(e) });
    }
  }

  if (req.method !== 'POST') {
    return res
      .status(200)
      .json({ ok: true, status: 'Telegram Webhook & Place API Aktif (7/24 Anlik)' });
  }

  try {
    const update = req.body;

    // 4. Handle Step-by-Step Interactive Wizard Callback Buttons
    if (update?.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const data = cb.data || '';
      const msgText = cb.message?.text || '';
      const state = parseEmbeddedWizardState(msgText);
      const cached = LAST_WIZARD_STATE_BY_CHAT.get(chatId) || {};
      const slugRecord = state.slug ? await loadSiteBySlug(state.slug) : null;

      if (!chatId) {
        return res.status(200).json({ ok: true });
      }

      // Post-generation 1-Click Quick Toggles (qf:studio, qf:auto, qf:city:..., qf:items)
      if (data === 'qf:items' || data === 'w5:items') {
        await answerCallbackQuery(cb.id, '🧠 Menü / Hizmetleri virgülle ayırarak yazın');
        const mergedState = {
          ...cached,
          url: state.url || cached.url || slugRecord?.u || '',
          city: state.city || cached.city || slugRecord?.city || 'Ankara',
          sector: state.sector || cached.sector || slugRecord?.s || '',
          district:
            state.district !== 'keep' ? state.district : cached.district || slugRecord?.district || 'keep',
          photoMode: state.photoMode || cached.photoMode || slugRecord?.pm || 'auto',
          teachingItems: true,
          ts: Date.now(),
        };
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, mergedState);
        await sendTelegram(
          chatId,
          `🧠 Bota Öğret — Bu işletmenin sitede 01–06 kartlarında gösterilmesini istediğiniz gerçek menü ürünlerini veya hizmetlerini virgülle ayırarak yazıp gönderin:\n\n` +
            `💡 Örnek (Pizzacı): Dört Peynirli Pizza, Sebzeli Ege Pizza, Klasik Margarita, Seçkin Etli Pizza, Ev Yapımı Acı Sos, Tiramisu\n` +
            `💡 Örnek (Garaj): Seramik Kaplama, PPF Kaput Koruma, Detaylı Pasta Cila, Cam Filmi, İç Detaylı Temizlik, Boyasız Göçük Düzeltme\n\n` +
            `🌆 Şehir: ${mergedState.city}\n` +
            `🎯 SektörKod: ${mergedState.sector}\n` +
            `📍 Bölge: ${mergedState.district}\n` +
            `📸 GörselMod: ${mergedState.photoMode}\n` +
            `🔗 Link: ${mergedState.url}`,
          {
            reply_markup: {
              force_reply: true,
              selective: true,
            },
          }
        );
        return res.status(200).json({ ok: true, step: 'teach_items_prompt' });
      }

      if (data === 'qf:studio' || data === 'qf:auto') {
        const newMode = data === 'qf:studio' ? 'studio' : 'auto';
        await answerCallbackQuery(
          cb.id,
          newMode === 'studio'
            ? '✨ 16:10 Stüdyo HD fotoğraflarla yenileniyor...'
            : '📸 İşletmenin kendi fotoğraflarıyla yenileniyor...'
        );
        const updatedState = {
          ...cached,
          url: state.url || cached.url || slugRecord?.u || '',
          city: state.city || cached.city || slugRecord?.city || 'Ankara',
          sector: state.sector || cached.sector || slugRecord?.s || '',
          district: state.district !== 'keep' ? state.district : cached.district || slugRecord?.district || 'keep',
          photoMode: newMode,
        };
        const { liveUrl } = await finalizeAndSendWebsite(chatId, updatedState);
        return res.status(200).json({ ok: true, liveUrl });
      }

      if (data.startsWith('qf:city:')) {
        const newCity = data.includes('Samsun') ? 'Samsun' : 'Ankara';
        await answerCallbackQuery(cb.id, `🌆 Şehir ${newCity} olarak güncelleniyor...`);
        const updatedState = {
          ...cached,
          url: state.url || cached.url || slugRecord?.u || '',
          city: newCity,
          sector: state.sector || cached.sector || slugRecord?.s || '',
          district: state.district !== 'keep' ? state.district : cached.district || slugRecord?.district || 'keep',
          photoMode: state.photoMode || cached.photoMode || slugRecord?.pm || 'auto',
        };
        const { liveUrl } = await finalizeAndSendWebsite(chatId, updatedState);
        return res.status(200).json({ ok: true, liveUrl });
      }

      // Step 1 -> Step 2 (City chosen -> Ask Sector & Video)
      if (data.startsWith('w1:') || data.startsWith('city:')) {
        const chosenCity = data.includes('Samsun') ? 'Samsun' : 'Ankara';
        await answerCallbackQuery(cb.id, `🌆 ${chosenCity} seçildi — Şimdi sektörü seçin`);

        const targetUrl = state.url || cached.url || slugRecord?.u || '';
        const info = await resolveBusinessInfo(targetUrl);
        const autoSector = info.s || 'corporate_editorial';
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          ...cached,
          url: targetUrl,
          city: chosenCity,
          sector: autoSector,
          district: 'keep',
          photoMode: state.photoMode || cached.photoMode || slugRecord?.pm || 'auto',
          ts: Date.now(),
        });

        const step2Text =
          `🎨 Adım Adım Site Kurulumu (2/5 — Sektör & Konsept Seçimi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `📸 Görsel: ${info.photos.length} Fotoğraf ${info.logo ? '+ Orijinal Logo ✅' : ''}\n` +
          `🔗 Link: ${targetUrl}\n\n` +
          `❓ 2. SORU: Bu işletmenin tam konsepti, renk teması ve arka plan videosu hangisi olsun?\n` +
          `(İncelenip algılanan: ${getShortSectorLabel(autoSector)})`;

        await editTelegramMessage(chatId, messageId, step2Text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `✨ Algılanan: ${getShortSectorLabel(autoSector)}`,
                  callback_data: `w2:${chosenCity}:${autoSector}`,
                },
              ],
              [
                { text: '🍕 Pizza & İtalyan', callback_data: `w2:${chosenCity}:pizza_italian` },
                { text: '🍔 Gurme Burger', callback_data: `w2:${chosenCity}:burger_streetfood` },
              ],
              [
                {
                  text: '🍮 Tatlıcı / Baklava / Künefe',
                  callback_data: `w2:${chosenCity}:traditional_dessert`,
                },
                { text: '☕ Kafe / Kahve / Patisserie', callback_data: `w2:${chosenCity}:cafe_dessert` },
              ],
              [
                { text: '🥩 Kebap / Pide / Ocakbaşı', callback_data: `w2:${chosenCity}:grill_restaurant` },
                { text: '🥙 Döner / İskender / Köfte', callback_data: `w2:${chosenCity}:doner_tantuni` },
              ],
              [
                { text: '🥐 Börekçi / Fırın / Kahvaltı', callback_data: `w2:${chosenCity}:bakery_breakfast` },
                { text: '🍲 Çorbacı / Ev Yemekleri', callback_data: `w2:${chosenCity}:soup_restaurant` },
              ],
              [
                { text: '🐟 Balık Restoranı', callback_data: `w2:${chosenCity}:seafood_fish` },
                {
                  text: '🚘 Oto Detailing / Pasta Cila',
                  callback_data: `w2:${chosenCity}:auto_detailing`,
                },
              ],
              [
                { text: '🔧 Oto Tamir / Mekanik', callback_data: `w2:${chosenCity}:auto_service` },
                { text: '⭐ Mercedes / Lüks Oto', callback_data: `w2:${chosenCity}:mercedes_luxury` },
              ],
              [
                { text: '🚙 Volkswagen / VAG Servis', callback_data: `w2:${chosenCity}:vag_automotive` },
                { text: '💇‍♀️ Kuaför / Güzellik / Bakım', callback_data: `w2:${chosenCity}:beauty_hair` },
              ],
              [
                { text: '🏋️ Spor / Pilates / Fitness', callback_data: `w2:${chosenCity}:fitness_pilates` },
                { text: '🦷 Diş Kliniği / Sağlık', callback_data: `w2:${chosenCity}:dental_medical` },
              ],
              [
                {
                  text: '🏛️ Mimarlık / İnşaat / Emlak',
                  callback_data: `w2:${chosenCity}:architecture_real_estate`,
                },
                { text: '📱 Telefon / Teknik Servis', callback_data: `w2:${chosenCity}:appliance_service` },
              ],
              [
                { text: '🏭 Sanayi / Üretim / Fabrika', callback_data: `w2:${chosenCity}:industrial_heating` },
                { text: '🏢 Kurumsal İşletme / Ofis', callback_data: `w2:${chosenCity}:corporate_editorial` },
              ],
            ],
          },
        });

        return res.status(200).json({ ok: true, step: 2 });
      }

      // Step 2 -> Step 3 (Sector chosen -> Ask District / Location)
      if (data.startsWith('w2:')) {
        const parts = data.split(':');
        const chosenCity = parts[1] === 'Samsun' ? 'Samsun' : state.city || 'Ankara';
        const chosenSector = parts[2] || parts[1] || 'corporate_editorial';

        await answerCallbackQuery(cb.id, `🎯 Konsept seçildi — Şimdi ilçe/konum seçin`);

        const info = await resolveBusinessInfo(state.url || cached.url || '');
        const currentAddr =
          info.a && info.a !== 'Merkez / Türkiye' ? info.a : `${chosenCity} Merkez`;

        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          ...cached,
          url: state.url || cached.url,
          city: chosenCity,
          sector: chosenSector,
          district: 'keep',
          photoMode: state.photoMode || cached.photoMode || 'auto',
          ts: Date.now(),
        });

        const districtButtons =
          chosenCity === 'Ankara'
            ? [
                [
                  {
                    text: `📍 Mevcut Adresi Koru (${currentAddr.slice(0, 28)})`,
                    callback_data: `w3:keep`,
                  },
                ],
                [
                  { text: '🏛️ Çankaya', callback_data: `w3:Çankaya` },
                  { text: '🏙️ Yenimahalle', callback_data: `w3:Yenimahalle` },
                ],
                [
                  {
                    text: '🔧 İvedik / Ostim / Şaşmaz',
                    callback_data: `w3:İvedik OSB, Yenimahalle`,
                  },
                  { text: '🏢 Sincan / Etimesgut', callback_data: `w3:Sincan` },
                ],
                [
                  { text: '🏘️ Keçiören / Altındağ', callback_data: `w3:Keçiören` },
                  { text: '🌳 Mamak / Gölbaşı', callback_data: `w3:Mamak` },
                ],
                [
                  {
                    text: '🌲 Çayyolu / Ümitköy / Beytepe',
                    callback_data: `w3:Çayyolu, Çankaya`,
                  },
                  {
                    text: '🚇 Batıkent / Eryaman',
                    callback_data: `w3:Batıkent, Yenimahalle`,
                  },
                ],
              ]
            : [
                [
                  {
                    text: `📍 Mevcut Adresi Koru (${currentAddr.slice(0, 28)})`,
                    callback_data: `w3:keep`,
                  },
                ],
                [
                  { text: '🌊 Atakum', callback_data: `w3:Atakum` },
                  { text: '🏛️ İlkadım', callback_data: `w3:İlkadım` },
                ],
                [
                  {
                    text: '🔧 Canik / Gülsan Sanayi',
                    callback_data: `w3:Gülsan Sanayi, Canik`,
                  },
                  { text: '🏭 Tekkeköy / OSB', callback_data: `w3:Tekkeköy` },
                ],
                [
                  { text: '🌿 Bafra', callback_data: `w3:Bafra` },
                  { text: '🌾 Çarşamba / Terme', callback_data: `w3:Çarşamba` },
                ],
              ];

        const step3Text =
          `📍 Adım Adım Site Kurulumu (3/5 — İlçe & Konum Seçimi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Algılanan Adres: ${currentAddr}\n` +
          `🔗 Link: ${state.url || cached.url}\n\n` +
          `❓ 3. SORU: İşletme ${chosenCity} içinde hangi ilçede / bölgede yer alıyor?`;

        await editTelegramMessage(chatId, messageId, step3Text, {
          reply_markup: { inline_keyboard: districtButtons },
        });

        return res.status(200).json({ ok: true, step: 3 });
      }

      // Step 3 -> Step 4 (District chosen -> Ask Photo & Gallery Mode!)
      if (data.startsWith('w3:')) {
        const rawParts = data.slice(3).split(':');
        const chosenDistrict =
          rawParts.length >= 3 ? rawParts.slice(2).join(':') : data.slice(3) || 'keep';
        const chosenCity = state.city || cached.city || 'Ankara';
        const chosenSector = state.sector || cached.sector || 'corporate_editorial';

        await answerCallbackQuery(cb.id, `📍 Bölge kaydedildi — Şimdi fotoğraf modunu seçin`);

        const info = await resolveBusinessInfo(state.url || cached.url || '');

        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          ...cached,
          url: state.url || cached.url,
          city: chosenCity,
          sector: chosenSector,
          district: chosenDistrict,
          photoMode: 'auto',
          ts: Date.now(),
        });

        const step4Text =
          `📸 Adım Adım Site Kurulumu (4/5 — Fotoğraf & Galeri Tercihi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Bölge: ${chosenDistrict}\n` +
          `🖼️ Orijinal Logo: ${info.logo ? 'Bulundu ve Eklenecek ✅' : 'Kurumsal Monogram ✅'}\n` +
          `📸 Çekilen İşletme Fotoğrafı: ${info.photos.length} Adet\n` +
          `🔗 Link: ${state.url || cached.url}\n\n` +
          `❓ 4. SORU: Sitedeki "Hakkımızda" ve "Galeri" fotoğrafları nasıl kullanılsın?\n` +
          `• İşletmenin kendi fotoğrafları gerçek mekan/ürün görseliyse 1. seçeneği seçin.\n` +
          `• Eğer Instagram sayfasında sadece yazılı kampanya afişleri varsa 2. seçeneği (16:10 Yatay HD Stüdyo) seçin (Orijinal logo yine korunur).`;

        await editTelegramMessage(chatId, messageId, step4Text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `📸 İşletmenin Kendi Fotoğrafları (${info.photos.length} Adet) + HD Tamamlama`,
                  callback_data: 'w4:auto',
                },
              ],
              [
                {
                  text: '✨ 16:10 Yatay Sektör Stüdyo Fotoğrafları (Yazılı Afiş Olmasın)',
                  callback_data: 'w4:studio',
                },
              ],
              [
                {
                  text: "📤 Fotoğrafları Şimdi Telegram'dan Ben Göndereceğim",
                  callback_data: 'w4:upload',
                },
              ],
            ],
          },
        });

        return res.status(200).json({ ok: true, step: 4 });
      }

      // Step 4 -> Step 5 (Photo Mode chosen -> Final Summary OR Upload Prompt)
      if (data === 'w4:auto' || data === 'w4:studio' || data === 'w4:upload' || data === 'w5:upload') {
        const chosenCity = state.city || cached.city || 'Ankara';
        const chosenSector = state.sector || cached.sector || 'corporate_editorial';
        const chosenDistrict = state.district || cached.district || 'keep';
        const chosenPhotoMode = data === 'w4:studio' ? 'studio' : 'auto';

        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          ...cached,
          url: state.url || cached.url,
          city: chosenCity,
          sector: chosenSector,
          district: chosenDistrict,
          photoMode: chosenPhotoMode,
          ts: Date.now(),
        });

        if (data === 'w4:upload' || data === 'w5:upload') {
          await answerCallbackQuery(cb.id, '📤 Fotoğrafları sohbete gönderebilirsiniz');
          await sendTelegram(
            chatId,
            `📤 Lütfen sitede kullanılmasını istediğiniz 1 ila 6 adet fotoğrafı doğrudan bu sohbete gönderin.\n` +
              `💡 İpucu: Eğer özel bir logo göndermek isterseniz fotoğrafın altına "logo" yazarak gönderebilirsiniz.\n\n` +
              `🌆 Şehir: ${chosenCity}\n` +
              `🎯 SektörKod: ${chosenSector}\n` +
              `📍 Bölge: ${chosenDistrict}\n` +
              `📸 GörselMod: ${chosenPhotoMode}\n` +
              `🔗 Link: ${state.url || cached.url}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: '🚀 Mevcut Görsellerle Hemen Oluştur', callback_data: 'w5:go' }],
                ],
              },
            }
          );
          return res.status(200).json({ ok: true, step: 'upload_prompt' });
        }

        await answerCallbackQuery(cb.id, `📸 Görsel modu seçildi — Son onay adımı`);

        const info = await resolveBusinessInfo(state.url || cached.url || '');
        const displayDistrict =
          chosenDistrict === 'keep'
            ? info.a && info.a !== 'Merkez / Türkiye'
              ? info.a
              : `${chosenCity} Merkez`
            : `${chosenDistrict}, ${chosenCity}`;

        const learnedList =
          Array.isArray(info.items) && info.items.length > 0
            ? info.items.map((it) => it.title).join(', ')
            : info.c || 'Sektöre özel uzmanlık kartları';

        const step5Text =
          `📞 Adım Adım Site Kurulumu (5/5 — Derin Analiz & Son Kontrol)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Bölge: ${chosenDistrict}\n` +
          `📍 Gösterilecek Adres: ${displayDistrict}\n` +
          `📞 Telefon: ${info.p}\n` +
          (info.hr ? `🕒 Çalışma Saatleri: ${info.hr}\n` : '') +
          `🧠 Öğrenilen Menü / Hizmetler: ${learnedList}\n` +
          `🖼️ Orijinal Logo: ${info.logo ? 'Eklendi ✅' : 'Kurumsal Monogram ✅'}\n` +
          `📸 GörselMod: ${chosenPhotoMode}\n` +
          `📸 Galeri: ${
            chosenPhotoMode === 'studio'
              ? '16:10 Yatay Sektör Stüdyo Fotoğrafları ✨'
              : `${info.photos.length} İşletme Fotoğrafı + HD Tamamlama`
          }\n` +
          `🔗 Link: ${state.url || cached.url}\n\n` +
          `❓ 5. SORU: Öğrenilen menü/hizmetleri düzenlemek, özel telefon/adres yazmak ister misiniz, yoksa hemen yayına alalım mı?`;

        await editTelegramMessage(chatId, messageId, step5Text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 Bilgiler Doğru — Siteyi Hemen Oluştur!',
                  callback_data: 'w5:go',
                },
              ],
              [
                {
                  text: '🧠 Menü / Hizmetleri Öğret & Düzenle',
                  callback_data: 'w5:items',
                },
              ],
              [
                {
                  text: '✍️ Telefon / Açık Adres Yaz',
                  callback_data: 'w5:custom',
                },
              ],
              [
                {
                  text: "📤 Telegram'dan Fotoğraf / Logo Gönder",
                  callback_data: 'w5:upload',
                },
              ],
              [
                {
                  text: '🔄 Baştan Seç (Şehir / Sektör Değiştir)',
                  callback_data: `w1:${chosenCity}`,
                },
              ],
            ],
          },
        });

        return res.status(200).json({ ok: true, step: 5 });
      }

      // Step 5A: User clicked "🚀 Bilgiler Doğru — Siteyi Hemen Oluştur!" (supports both w4:go and w5:go)
      if (data === 'w4:go' || data === 'w5:go') {
        await answerCallbackQuery(cb.id, '🚀 Kurumsal web sitesi hazırlanıyor...');
        const mergedState = {
          ...cached,
          ...state,
          url: state.url || cached.url,
          city: state.city || cached.city || 'Ankara',
          sector: state.sector || cached.sector || 'corporate_editorial',
          district: state.district || cached.district || 'keep',
          photoMode: state.photoMode || cached.photoMode || 'auto',
        };
        if (messageId) {
          await editTelegramMessage(
            chatId,
            messageId,
            `⏳ Seçimleriniz onaylandı! İşletmenin gerçek hikayesi, öğrenilen menü/hizmetleri, orijinal logosu ve fotoğraflarıyla kurumsal web sitesi yayına alınıyor...\n\n🔗 Link: ${mergedState.url}`
          );
        }
        const { liveUrl } = await finalizeAndSendWebsite(chatId, mergedState);
        return res.status(200).json({ ok: true, liveUrl });
      }

      // Step 5B: User clicked "✍️ Telefon / Açık Adres / Özel Hizmet Yaz"
      if (data === 'w4:custom' || data === 'w5:custom') {
        await answerCallbackQuery(cb.id, '✍️ Bilgileri yazıp gönderin');
        const mergedState = {
          ...cached,
          ...state,
          url: state.url || cached.url,
          teachingItems: false,
          ts: Date.now(),
        };
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, mergedState);
        await sendTelegram(
          chatId,
          `✍️ Lütfen eklemek istediğiniz telefon numarasını, açık adresi veya özel hizmetleri bu mesaja yanıt olarak yazıp gönderin:\n` +
            `(Örn: "0532 111 22 33, İvedik OSB 1354. Cad, Seramik Kaplama, PPF")\n\n` +
            `🌆 Şehir: ${mergedState.city}\n` +
            `🎯 SektörKod: ${mergedState.sector}\n` +
            `📍 Bölge: ${mergedState.district}\n` +
            `📸 GörselMod: ${mergedState.photoMode || 'auto'}\n` +
            `🔗 Link: ${mergedState.url}`,
          {
            reply_markup: {
              force_reply: true,
              selective: true,
            },
          }
        );
        return res.status(200).json({ ok: true, step: '5_custom_prompt' });
      }

      return res.status(200).json({ ok: true });
    }

    const msg = update?.message || update?.edited_message;
    if (!msg) {
      return res.status(200).json({ ok: true });
    }

    const chatId = msg.chat.id;

    // 5. Handle Direct Photo or Image Upload in Telegram Chat!
    const uploadedPhotoFileId =
      Array.isArray(msg.photo) && msg.photo.length > 0
        ? msg.photo[msg.photo.length - 1].file_id
        : msg.document?.mime_type?.startsWith('image/')
        ? msg.document.file_id
        : '';

    if (uploadedPhotoFileId) {
      const caption = (msg.caption || '').trim();
      const replyState = msg.reply_to_message?.text
        ? parseEmbeddedWizardState(msg.reply_to_message.text)
        : {};
      const existing = LAST_WIZARD_STATE_BY_CHAT.get(chatId) || {
        url: replyState.url || '',
        city: replyState.city || 'Ankara',
        sector: replyState.sector || 'corporate_editorial',
        district: replyState.district || 'keep',
        photoMode: 'auto',
        tgPhotos: [],
        tgLogo: '',
        ts: Date.now(),
      };

      if (/logo/i.test(caption)) {
        existing.tgLogo = uploadedPhotoFileId;
      } else {
        existing.tgPhotos = [...(existing.tgPhotos || []), uploadedPhotoFileId].slice(0, 6);
      }
      existing.ts = Date.now();
      LAST_WIZARD_STATE_BY_CHAT.set(chatId, existing);

      await sendTelegram(
        chatId,
        `📸 Görsel başarıyla eklendi! (${
          existing.tgLogo ? 'Orijinal Logo ✅ + ' : ''
        }${(existing.tgPhotos || []).length} Galeri Fotoğrafı)\n` +
          `Başka fotoğraf göndermeye devam edebilir veya aşağıdaki butona basarak siteyi hemen oluşturabilirsiniz.\n\n` +
          `🌆 Şehir: ${existing.city}\n` +
          `🎯 SektörKod: ${existing.sector}\n` +
          `📍 Bölge: ${existing.district}\n` +
          `📸 GörselMod: auto\n` +
          `🔗 Link: ${existing.url}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `🚀 Gönderilen Fotoğraflarla Siteyi Hemen Oluştur!`,
                  callback_data: 'w5:go',
                },
              ],
            ],
          },
        }
      );
      return res.status(200).json({ ok: true, action: 'photo_added' });
    }

    if (!msg.text) {
      return res.status(200).json({ ok: true });
    }

    const text = msg.text.trim();

    // 6. Check if user is replying to Step 5 or "Bota Öğret" with custom items / phone / address!
    if (msg.reply_to_message?.text && msg.reply_to_message.text.includes('🔗 Link:')) {
      const replyState = parseEmbeddedWizardState(msg.reply_to_message.text);
      const isTeachingItems = msg.reply_to_message.text.includes('🧠 Bota Öğret');
      if (replyState.url) {
        await sendTelegram(
          chatId,
          `⏳ Öğrettiğiniz bilgiler (${text}) kaydedildi! Kurumsal web sitesi güncelleniyor...`
        );
        const { liveUrl } = await finalizeAndSendWebsite(
          chatId,
          { ...replyState, teachingItems: isTeachingItems },
          text
        );
        return res.status(200).json({ ok: true, liveUrl });
      }
    }

    if (text === '/start' || text.toLowerCase() === 'merhaba') {
      await sendTelegram(
        chatId,
        '⚡ 7/24 Akıllı & Öğrenen Kurumsal Web Sitesi Fabrikası Aktif!\n\nBana herhangi bir Google Maps, Instagram veya işletme linki gönderin; ezbere şablon basmak yerine önce işletmenin hikayesini, çalışma saatlerini, yorumlarını ve gerçek menü/hizmetlerini derinlemesine inceleyeyim, ardından adım adım onayınızı alarak en doğru kurumsal web sitesini hazırlayayım.'
      );
      return res.status(200).json({ ok: true });
    }

    if (!/https?:\/\//i.test(text)) {
      const cachedState = LAST_WIZARD_STATE_BY_CHAT.get(chatId);
      if (cachedState && cachedState.url && Date.now() - cachedState.ts < 30 * 60 * 1000) {
        await sendTelegram(
          chatId,
          `⏳ Öğrettiğiniz bilgiler (${text}) kaydedildi! Kurumsal web sitesi güncelleniyor...`
        );
        const { liveUrl } = await finalizeAndSendWebsite(chatId, cachedState, text);
        return res.status(200).json({ ok: true, liveUrl });
      }

      await sendTelegram(
        chatId,
        '🔗 Lütfen web sitesi oluşturulacak işletmenin Google Maps, Instagram veya web sitesi linkini gönderin.'
      );
      return res.status(200).json({ ok: true });
    }

    // 7. New Link Received -> Deeply Analyze Business & Show Inspection Report in Step 1 of 5
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    const cleanUrl = urlMatch ? urlMatch[0] : text;
    const previewInfo = await resolveBusinessInfo(text);

    LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
      url: cleanUrl,
      city: 'Ankara',
      sector: previewInfo.s,
      district: 'keep',
      photoMode: 'auto',
      tgPhotos: [],
      tgLogo: '',
      ts: Date.now(),
    });

    const learnedPreview =
      Array.isArray(previewInfo.items) && previewInfo.items.length > 0
        ? previewInfo.items.map((it) => it.title).join(', ')
        : previewInfo.c || 'Sektörel uzmanlıklar';

    const bioExcerpt = previewInfo.bio
      ? previewInfo.bio.length > 140
        ? previewInfo.bio.slice(0, 140) + '...'
        : previewInfo.bio
      : '';

    await sendTelegram(
      chatId,
      `🔍 Derin İşletme Analizi Tamamlandı — Kurulum (1/5)\n\n` +
        `🏢 İşletme: ${previewInfo.n}\n` +
        `🎯 Algılanan Konsept: ${getShortSectorLabel(previewInfo.s)}\n` +
        (previewInfo.rt
          ? `⭐ Google Puanı: ${previewInfo.rt} / 5 (${previewInfo.rc || 'Onaylı'} Yorum)\n`
          : '') +
        (previewInfo.hr ? `🕒 Çalışma Saatleri: ${previewInfo.hr}\n` : '') +
        (bioExcerpt ? `📖 İşletme Tanıtımı: "${bioExcerpt}"\n` : '') +
        `🧠 Öğrenilen Menü / Hizmetler: ${learnedPreview}\n` +
        `🖼️ Orijinal Logo: ${previewInfo.logo ? 'Bulundu ✅' : 'Kurumsal Monogram ✅'}\n` +
        `📸 Çekilen Görsel: ${previewInfo.photos.length} Fotoğraf\n` +
        `🔗 Link: ${cleanUrl}\n\n` +
        `❓ 1. SORU: Bu işletme hangi şehirde hizmet veriyor?`,
      {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏛️ Ankara (ankara-web-siteleri)', callback_data: 'w1:Ankara' },
              { text: '🌊 Samsun (samsun-web-siteleri)', callback_data: 'w1:Samsun' },
            ],
          ],
        },
      }
    );

    return res.status(200).json({ ok: true, action: 'started_wizard_step_1' });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return res.status(200).json({ ok: true });
  }
}
