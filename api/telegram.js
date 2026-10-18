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

function slugify(str) {
  const trMap = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  return (
    str
      .split('')
      .map((c) => trMap[c] || c)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 45) || 'kurumsal-site'
  );
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
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function detectSector(combinedText) {
  const t = combinedText.toLocaleLowerCase('tr-TR');
  if (
    /(garage|garaj|detailing|pasta cila|seramik kaplama|elmas kaplama|ppf|kaput filmi|araç kaplama|arac kaplama|cam filmi|boyasız göçük|boyasiz gocuk|jant boyama|bodykit|oto kuaför|oto kuafor|car care)/.test(
      t
    )
  ) {
    return 'auto_detailing';
  }
  if (
    /(börek|borek|poğaça|pogaca|simit|fırın|firin|unlu mamül|unlu mamul|baklava|künefe|kunefe|katmer|gözleme|gozleme)/.test(
      t
    )
  ) {
    return 'bakery_breakfast';
  }
  if (
    /(kafe|cafe|kahve|coffe|espresso|latte|patisserie|pastane|magnolia|profiterol|tiramisu|cheesecake|san sebastian|bistro|dondurma|waffle|çikolata|cikolata|nargile|çay evi|cay bahcesi|tatlı|tatli)/.test(
      t
    )
  ) {
    return 'cafe_dessert';
  }
  if (/(kahvaltı|kahvalti|kruvasan|ekmek|mantı|manti)/.test(t)) {
    return 'bakery_breakfast';
  }
  if (
    /(çorba|corba|paça|paca|işkembe|iskembe|beyran|mercimek|tarhana|ezogelin|sulu yemek|ev yemekleri|lokanta)/.test(
      t
    )
  ) {
    return 'soup_restaurant';
  }
  if (
    /(restoran|restaurant|aspava|kebap|ocakbaşı|ocakbasi|pide|lahmacun|yemek|et lokanta|et restoran|steakhouse|balık|balik|döner|doner|iskender|köfte|kofte|izgara|ızgara|mutfak|lezzet|steak|burger|pizza|kokoreç|tantuni|ciğer|ciger|mangal|dürüm|durum|tavuk)/.test(
      t
    )
  ) {
    return 'grill_restaurant';
  }
  if (
    /(diş|dis|dental|dent|klinik|poliklinik|sağlık|saglik|medikal|estetik|doktor|hekim|eczane|optik|hastane|psikolog|fizyoterapi|veteriner)/.test(
      t
    )
  ) {
    return 'dental_medical';
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
    /(soba|kuzine|şömine|somine|döküm|dokum|metal|makina|makine|üretim|uretim|fabrika|kazan|plastik|ambalaj|mermer|demir doğrama)/.test(
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
  return 'corporate_editorial';
}

function getSectorLabel(sector) {
  const labels = {
    auto_detailing: 'OTO DETAİLİNG, PASTA CİLA, SERAMİK & PPF GARAJI (Koyu Karbon & Altın Kehribar + Polisaj Videosu)',
    bakery_breakfast: 'BÖREKÇİ, FIRIN & KAHVALTI TEMASI (Sıcak Altın Kehribar & Koyu Antrasit)',
    soup_restaurant: 'ÇORBACI & GELENEKSEL LOKANTA TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    cafe_dessert: 'KAFE, KAHVE & TATLI TEMASI (Espresso & Altın Kehribar)',
    grill_restaurant: 'RESTORAN, KEBAP & IZGARA TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    restaurant: 'RESTORAN & GASTRONOMİ TEMASI (Sıcak Kehribar & Koyu Antrasit)',
    dental_medical: 'SAĞLIK & DİŞ KLİNİĞİ TEMASI (Ferah Beyaz & Medikal Turkuaz)',
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
    auto_detailing: '🚘 Oto Detailing / Pasta Cila / Kaplama Garajı',
    auto_service: '🔧 Oto Tamir & Mekanik Servis',
    mercedes_luxury: '⭐ Mercedes / Lüks Oto Servisi',
    vag_automotive: '🚙 Volkswagen / VAG Özel Servis',
    cafe_dessert: '☕ Kafe / Kahve / Patisserie / Tatlı',
    bakery_breakfast: '🥐 Börekçi / Fırın / Kahvaltı',
    grill_restaurant: '🥩 Restoran / Kebap / Izgara',
    soup_restaurant: '🍲 Çorbacı / Geleneksel Lokanta',
    appliance_service: '📱 Telefon / Teknoloji / Teknik Servis',
    dental_medical: '🦷 Diş Kliniği / Sağlık / Estetik',
    industrial_heating: '🏭 Sanayi / Üretim / Fabrika',
    corporate_editorial: '🏢 Kurumsal İşletme / Mağaza / Ofis',
  };
  return shortLabels[sector] || shortLabels.corporate_editorial;
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
    ['insaat', 'İnşaat'],
    ['mobilya', 'Mobilya'],
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
    ['borek', 'Börek'],
    ['corba', 'Çorba'],
    ['kebap', 'Kebap'],
    ['kafe', 'Kafe'],
    ['cafe', 'Cafe'],
    ['pastane', 'Pastane'],
    ['emlak', 'Emlak'],
    ['gayrimenkul', 'Gayrimenkul'],
    ['mimarlik', 'Mimarlık'],
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
      return `${formattedPrefix} ${prettySuf}${rest ? ' ' + rest : ''}`.trim();
    }
  }
  return clean
    .split(' ')
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w[0].slice(1)))
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
      '/images/diestrogarage/1.jpg',
      '/images/diestrogarage/2.jpg',
      '/images/diestrogarage/3.jpg',
      '/images/diestrogarage/4.jpg',
      '/images/diestrogarage/5.jpg',
      '/images/diestrogarage/6.jpg',
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

    // 1. Try Residential Instagram Bridge first (for full RelayPrefetchedStreamCache photos, logo & bio)
    if (IG_RESIDENTIAL_BRIDGE_URL) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4500);
        const bRes = await fetch(
          `${IG_RESIDENTIAL_BRIDGE_URL}/?u=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        clearTimeout(timer);
        if (bRes.ok) {
          const bData = await bRes.json();
          if (bData?.ok) {
            if (bData.fullName) fullName = bData.fullName;
            if (bData.biography) biography = bData.biography;
            if (bData.logo) logoUrl = bData.logo;
            if (Array.isArray(bData.photos)) {
              for (const p of bData.photos) {
                if (p && !photos.includes(p)) photos.push(p);
              }
            }
            if (Array.isArray(bData.captions)) {
              for (const c of bData.captions) {
                if (c) captions.push(c);
              }
            }
          }
        }
      } catch (_) {}
    }

    // 2. Direct scrape fallback (Googlebot + OpenGraph crawlers)
    if (photos.length === 0 || !biography || !logoUrl) {
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
      if (!html.includes('"biography"') || !html.includes('"candidates"')) {
        for (const fallbackUa of [
          'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'WhatsApp/2.23.20.0',
          'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
          'TelegramBot (like TwitterBot)',
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
      if (!logoUrl) {
        const hdPicMatch = combinedHtml.match(
          /"hd_profile_pic_url_info":\{"height":\d+,"url":"((?:\\.|[^"\\])*)"/
        );
        const picMatch = hdPicMatch || combinedHtml.match(/"profile_pic_url":"((?:\\.|[^"\\])*)"/);
        if (picMatch) {
          try {
            logoUrl = JSON.parse(`"${picMatch[1]}"`);
          } catch (_) {}
        }
      }

      if (!fullName) {
        const titleMatch =
          combinedHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
        if (titleMatch) {
          const rawTitle = unescapeHtml(titleMatch[1]);
          const tName = rawTitle.match(/^([^(@•]+?)\s*\(@/i);
          if (tName) fullName = tName[1].trim();
        }
      }

      if (!biography) {
        const descMatch =
          combinedHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
          combinedHtml.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
          combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
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
          if (!/Meta AI|yapay zeka koşullarını/i.test(txt)) {
            captions.push(txt);
          }
        } catch (_) {}
      }

      for (const im of combinedHtml.matchAll(/"candidates":\[\{"height":\d+,"url":"((?:\\.|[^"\\])*)"/g)) {
        try {
          const pUrl = JSON.parse(`"${im[1]}"`);
          if (pUrl && pUrl.startsWith('http') && !photos.includes(pUrl)) {
            photos.push(pUrl);
          }
        } catch (_) {}
      }

      const imgMatch =
        combinedHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgMatch) {
        const ogImg = unescapeHtml(imgMatch[1]);
        if (ogImg && ogImg.startsWith('http')) {
          if (!logoUrl) logoUrl = ogImg;
          if (photos.length === 0) photos.push(ogImg);
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

    return {
      businessName: formatInstagramHandle(username, fullName),
      logo: logoUrl,
      categories,
      address,
      phone,
      photos: photos.slice(0, 6),
      rawText: `${biography} ${captions.join(' ')}`,
    };
  } catch (_) {
    return null;
  }
}

async function extractWebsiteOrInstagramPhotos(siteUrl) {
  const found = [];
  if (!siteUrl) return found;
  try {
    const res = await fetch(siteUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    const html = await res.text();
    const ogMatches = [
      ...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi),
      ...html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi),
    ];
    for (const m of ogMatches) {
      const imgUrl = unescapeHtml(m[1]);
      if (imgUrl && imgUrl.startsWith('http') && !found.includes(imgUrl)) {
        found.push(imgUrl);
      }
    }
    const imgTags = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)];
    for (const m of imgTags) {
      const imgUrl = unescapeHtml(m[1]);
      if (
        imgUrl &&
        !/logo|icon|avatar|sprite|pixel|badge/i.test(imgUrl) &&
        !found.includes(imgUrl)
      ) {
        found.push(imgUrl);
      }
    }
  } catch (_) {}
  return found.slice(0, 6);
}

async function resolveBusinessInfo(rawText) {
  const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
  const inputUrl = urlMatch ? urlMatch[0] : '';
  const extraNotes = rawText.replace(/https?:\/\/[^\s]+/gi, '').trim();

  let businessName = '';
  let address = '';
  let phone = '';
  let logo = '';
  let categories = [];
  let website = '';
  let mapQuery = '';
  let photos = [];
  let reviews = [];
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

            if (Array.isArray(d[175]?.[9]?.[0]?.[0])) {
              for (const revWrap of d[175][9][0][0]) {
                try {
                  const rev = revWrap?.[0];
                  const author = rev?.[1]?.[4]?.[5]?.[0] || 'Google Kullanıcısı';
                  const stars = rev?.[2]?.[0]?.[0] || 5;
                  const rText = rev?.[2]?.[15]?.[0]?.[0] || '';
                  if (rText && rText.length >= 15 && stars >= 4) {
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
        const directPhotos = await extractWebsiteOrInstagramPhotos(inputUrl);
        for (const dp of directPhotos) {
          if (!photos.includes(dp)) photos.push(dp);
        }
      }
    } catch (_) {}
  }

  if (website && photos.length < 4) {
    const webPhotos = await extractWebsiteOrInstagramPhotos(website);
    for (const wp of webPhotos) {
      if (!photos.includes(wp)) photos.push(wp);
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
  const sector = detectSector(
    `${businessName} ${categoryText} ${address} ${extraNotes} ${pageText} ${searchSnippets}`
  );

  const proxiedLogo = logo
    ? logo.startsWith('/')
      ? logo
      : `/api/telegram?img=${encodeURIComponent(logo)}`
    : '';

  const proxiedPhotos = photos
    .slice(0, 6)
    .map((pUrl) => (pUrl.startsWith('/') ? pUrl : `/api/telegram?img=${encodeURIComponent(pUrl)}`));

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
    resolvedUrl,
    photos: proxiedPhotos,
    reviews: reviews.slice(0, 6),
  };
}

function parseEmbeddedWizardState(text = '') {
  const linkMatch = text.match(/🔗 Link:\s*(https?:\/\/[^\s\n]+)/i) || text.match(/(https?:\/\/[^\s\n]+)/i);
  const cityMatch = text.match(/🌆 Şehir:\s*([^\n]+)/i);
  const sectorMatch = text.match(/🎯 SektörKod:\s*([a-z_]+)/i);
  const districtMatch = text.match(/📍 Bölge:\s*([^\n]+)/i);
  return {
    url: linkMatch ? linkMatch[1].trim() : '',
    city: cityMatch ? cityMatch[1].trim() : 'Ankara',
    sector: sectorMatch ? sectorMatch[1].trim() : '',
    district: districtMatch ? districtMatch[1].trim() : 'keep',
  };
}

async function finalizeAndSendWebsite(chatId, wizardState, customNotes = '') {
  const chosenCity = wizardState.city === 'Samsun' ? 'Samsun' : 'Ankara';
  const baseUrl = chosenCity === 'Ankara' ? ANKARA_BASE_URL : SITE_BASE_URL;

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

  // Apply custom notes (phone, address, or custom service categories) if user typed any
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
      .replace(/^[\s,-]+|[\s,-]+$/g, '')
      .trim();

    if (remainingText.length > 3) {
      if (/(mah\.|mahallesi|cad\.|caddesi|sok\.|sokak|bulvar|osb|no:|kat)/i.test(remainingText)) {
        fullInfo.a = remainingText.includes(chosenCity)
          ? remainingText
          : `${remainingText}, ${chosenCity}`;
      } else {
        fullInfo.c = fullInfo.c ? `${fullInfo.c} • ${remainingText}` : remainingText;
      }
    }
  }

  fullInfo.q = `${fullInfo.n}, ${fullInfo.a}`;

  const slug = slugify(fullInfo.n);
  const compactPayload = {
    n: fullInfo.n,
    a: fullInfo.a,
    p: fullInfo.p,
    c: fullInfo.c,
    s: fullInfo.s,
    q: fullInfo.q,
    u: fullInfo.u,
  };
  if (fullInfo.l && fullInfo.l.startsWith('/images/')) {
    compactPayload.l = fullInfo.l;
  }

  const encodedPayload = Buffer.from(JSON.stringify(compactPayload), 'utf8').toString('base64url');
  const liveUrl = `${baseUrl}/${slug}?s=${encodedPayload}`;
  const themeLabel = getSectorLabel(fullInfo.s);

  await sendTelegram(
    chatId,
    `✅ Kurumsal Web Sitesi Hazırlandı ve Yayına Alındı!\n\n🏢 Firma: ${fullInfo.n}\n🌆 Şehir / Alan Adı: ${chosenCity} (${baseUrl.replace(
      'https://',
      ''
    )})\n🎯 Sektör & Konsept: ${getShortSectorLabel(fullInfo.s)}\n🏷️ Hizmetler: ${
      fullInfo.c || themeLabel
    }\n📍 Adres: ${fullInfo.a}\n📞 Telefon: ${fullInfo.p}\n🖼️ Orijinal Logo: ${
      fullInfo.logo ? 'Eklendi ✅' : 'Kurumsal Monogram ✅'
    }\n📸 Çekilen Gerçek Fotoğraf: ${fullInfo.photos.length} Adet\n🎨 Tema: ${themeLabel}\n\n🌐 Canlı Web Sitesi Linki:\n${liveUrl}`
  );

  return { liveUrl, fullInfo };
}

const LAST_WIZARD_STATE_BY_CHAT = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.query?.img) {
    try {
      const targetImg = req.query.img;
      const imgRes = await fetch(targetImg, {
        headers: {
          'User-Agent': GMAPS_HEADERS['User-Agent'],
          Referer: 'https://www.google.com/',
        },
      });
      if (!imgRes.ok) {
        return res.status(404).end();
      }
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800');
      return res.status(200).send(Buffer.from(arrayBuf));
    } catch (_) {
      return res.status(500).end();
    }
  }

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
    return res.status(200).json({ ok: true, status: 'Telegram Webhook & Place API Aktif (7/24 Anlik)' });
  }

  try {
    const update = req.body;

    // 1. Handle Step-by-Step Interactive Wizard Callback Buttons
    if (update?.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const data = cb.data || '';
      const msgText = cb.message?.text || '';
      const state = parseEmbeddedWizardState(msgText);

      if (!chatId) {
        return res.status(200).json({ ok: true });
      }

      // Legacy city: button support + Step 1 -> Step 2 (City chosen -> Ask Sector & Video)
      if (data.startsWith('w1:') || data.startsWith('city:')) {
        const chosenCity = data.includes('Samsun') ? 'Samsun' : 'Ankara';
        await answerCallbackQuery(cb.id, `🌆 ${chosenCity} seçildi — Şimdi sektörü seçin`);

        const info = await resolveBusinessInfo(state.url);
        const autoSector = info.s || 'corporate_editorial';
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          url: state.url,
          city: chosenCity,
          sector: autoSector,
          district: 'keep',
          ts: Date.now(),
        });

        const step2Text =
          `🎨 Adım Adım Site Kurulumu (2/4 — Sektör & Video Seçimi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `📸 Görsel: ${info.photos.length} Fotoğraf ${info.logo ? '+ Orijinal Logo ✅' : ''}\n` +
          `🔗 Link: ${state.url}\n\n` +
          `❓ 2. SORU: Bu işletmenin tam sektörü ve arka plan videosu hangisi olsun?\n` +
          `(Otomatik algılanan: ${getShortSectorLabel(autoSector)})`;

        await editTelegramMessage(chatId, messageId, step2Text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `✨ Otomatik: ${getShortSectorLabel(autoSector)}`,
                  callback_data: `w2:${chosenCity}:${autoSector}`,
                },
              ],
              [
                {
                  text: '🚘 Oto Detailing / Pasta Cila / Kaplama',
                  callback_data: `w2:${chosenCity}:auto_detailing`,
                },
              ],
              [
                { text: '🔧 Oto Tamir / Mekanik', callback_data: `w2:${chosenCity}:auto_service` },
                { text: '⭐ Mercedes / Lüks Oto', callback_data: `w2:${chosenCity}:mercedes_luxury` },
              ],
              [
                { text: '☕ Kafe / Patisserie / Tatlı', callback_data: `w2:${chosenCity}:cafe_dessert` },
                { text: '🥐 Börekçi / Fırın / Kahvaltı', callback_data: `w2:${chosenCity}:bakery_breakfast` },
              ],
              [
                { text: '🥩 Restoran / Kebap / Izgara', callback_data: `w2:${chosenCity}:grill_restaurant` },
                { text: '🍲 Çorbacı / Lokanta', callback_data: `w2:${chosenCity}:soup_restaurant` },
              ],
              [
                { text: '📱 Telefon / Teknoloji / Tamir', callback_data: `w2:${chosenCity}:appliance_service` },
                { text: '🦷 Diş Kliniği / Sağlık', callback_data: `w2:${chosenCity}:dental_medical` },
              ],
              [
                { text: '🏭 Sanayi / Üretim / Fabrika', callback_data: `w2:${chosenCity}:industrial_heating` },
                { text: '🏢 Kurumsal / Mağaza / Ofis', callback_data: `w2:${chosenCity}:corporate_editorial` },
              ],
            ],
          },
        });

        return res.status(200).json({ ok: true, step: 2 });
      }

      // Step 2 -> Step 3 (Sector chosen -> Ask District / Location)
      if (data.startsWith('w2:')) {
        const parts = data.split(':');
        const chosenCity = parts[1] === 'Samsun' ? 'Samsun' : 'Ankara';
        const chosenSector = parts[2] || 'corporate_editorial';

        await answerCallbackQuery(cb.id, `🎯 Sektör seçildi — Şimdi ilçe/konum seçin`);

        const info = await resolveBusinessInfo(state.url);
        const currentAddr =
          info.a && info.a !== 'Merkez / Türkiye' ? info.a : `${chosenCity} Merkez`;

        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          url: state.url,
          city: chosenCity,
          sector: chosenSector,
          district: 'keep',
          ts: Date.now(),
        });

        const districtButtons =
          chosenCity === 'Ankara'
            ? [
                [
                  {
                    text: `📍 Mevcut Adresi Koru (${currentAddr.slice(0, 28)})`,
                    callback_data: `w3:Ankara:${chosenSector}:keep`,
                  },
                ],
                [
                  { text: '🏛️ Çankaya', callback_data: `w3:Ankara:${chosenSector}:Çankaya` },
                  { text: '🏙️ Yenimahalle', callback_data: `w3:Ankara:${chosenSector}:Yenimahalle` },
                ],
                [
                  {
                    text: '🔧 İvedik / Ostim / Şaşmaz',
                    callback_data: `w3:Ankara:${chosenSector}:İvedik OSB, Yenimahalle`,
                  },
                  { text: '🏢 Sincan / Etimesgut', callback_data: `w3:Ankara:${chosenSector}:Sincan` },
                ],
                [
                  { text: '🏘️ Keçiören / Altındağ', callback_data: `w3:Ankara:${chosenSector}:Keçiören` },
                  { text: '🌳 Mamak / Gölbaşı', callback_data: `w3:Ankara:${chosenSector}:Mamak` },
                ],
                [
                  {
                    text: '🌲 Çayyolu / Ümitköy / Beytepe',
                    callback_data: `w3:Ankara:${chosenSector}:Çayyolu, Çankaya`,
                  },
                  {
                    text: '🚇 Batıkent / Eryaman',
                    callback_data: `w3:Ankara:${chosenSector}:Batıkent, Yenimahalle`,
                  },
                ],
              ]
            : [
                [
                  {
                    text: `📍 Mevcut Adresi Koru (${currentAddr.slice(0, 28)})`,
                    callback_data: `w3:Samsun:${chosenSector}:keep`,
                  },
                ],
                [
                  { text: '🌊 Atakum', callback_data: `w3:Samsun:${chosenSector}:Atakum` },
                  { text: '🏛️ İlkadım', callback_data: `w3:Samsun:${chosenSector}:İlkadım` },
                ],
                [
                  {
                    text: '🔧 Canik / Gülsan Sanayi',
                    callback_data: `w3:Samsun:${chosenSector}:Gülsan Sanayi, Canik`,
                  },
                  { text: '🏭 Tekkeköy / OSB', callback_data: `w3:Samsun:${chosenSector}:Tekkeköy` },
                ],
                [
                  { text: '🌿 Bafra', callback_data: `w3:Samsun:${chosenSector}:Bafra` },
                  { text: '🌾 Çarşamba / Terme', callback_data: `w3:Samsun:${chosenSector}:Çarşamba` },
                ],
              ];

        const step3Text =
          `📍 Adım Adım Site Kurulumu (3/4 — İlçe & Konum Seçimi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Algılanan Adres: ${currentAddr}\n` +
          `🔗 Link: ${state.url}\n\n` +
          `❓ 3. SORU: İşletme ${chosenCity} içinde hangi ilçede / bölgede yer alıyor?`;

        await editTelegramMessage(chatId, messageId, step3Text, {
          reply_markup: { inline_keyboard: districtButtons },
        });

        return res.status(200).json({ ok: true, step: 3 });
      }

      // Step 3 -> Step 4 (District chosen -> Ask Phone / Extra Services OR Generate Now)
      if (data.startsWith('w3:')) {
        const parts = data.split(':');
        const chosenCity = parts[1] === 'Samsun' ? 'Samsun' : 'Ankara';
        const chosenSector = parts[2] || state.sector || 'corporate_editorial';
        const chosenDistrict = parts.slice(3).join(':') || 'keep';

        await answerCallbackQuery(cb.id, `📍 Bölge kaydedildi — Son onay adımı`);

        const info = await resolveBusinessInfo(state.url);
        const displayDistrict =
          chosenDistrict === 'keep'
            ? info.a && info.a !== 'Merkez / Türkiye'
              ? info.a
              : `${chosenCity} Merkez`
            : `${chosenDistrict}, ${chosenCity}`;

        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          url: state.url,
          city: chosenCity,
          sector: chosenSector,
          district: chosenDistrict,
          ts: Date.now(),
        });

        const step4Text =
          `📞 Adım Adım Site Kurulumu (4/4 — Son Kontrol & Yayına Alma)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Bölge: ${chosenDistrict}\n` +
          `📍 Gösterilecek Adres: ${displayDistrict}\n` +
          `📞 Telefon: ${info.p}\n` +
          `🏷️ Hizmetler: ${info.c || 'Sektörel standart hizmetler'}\n` +
          `📸 Görsel: ${info.photos.length} Gerçek Fotoğraf ${info.logo ? '+ Orijinal Logo ✅' : ''}\n` +
          `🔗 Link: ${state.url}\n\n` +
          `❓ 4. SORU: Özel bir telefon numarası, tam açık adres veya ekstra hizmet eklemek ister misiniz, yoksa hemen yayına alalım mı?`;

        await editTelegramMessage(chatId, messageId, step4Text, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 Bilgiler Doğru — Siteyi Hemen Oluştur!',
                  callback_data: 'w4:go',
                },
              ],
              [
                {
                  text: '✍️ Telefon / Açık Adres / Özel Hizmet Yaz',
                  callback_data: 'w4:custom',
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

        return res.status(200).json({ ok: true, step: 4 });
      }

      // Step 4A: User clicked "🚀 Bilgiler Doğru — Siteyi Hemen Oluştur!"
      if (data === 'w4:go') {
        await answerCallbackQuery(cb.id, '🚀 Kurumsal web sitesi hazırlanıyor...');
        if (messageId) {
          await editTelegramMessage(
            chatId,
            messageId,
            `⏳ Seçimleriniz onaylandı! İşletmenin orijinal logosu, gerçek fotoğrafları, sektörel videosu ve kurumsal web sitesi yayına alınıyor...\n\n🔗 Link: ${state.url}`
          );
        }
        LAST_WIZARD_STATE_BY_CHAT.delete(chatId);
        const { liveUrl } = await finalizeAndSendWebsite(chatId, state);
        return res.status(200).json({ ok: true, liveUrl });
      }

      // Step 4B: User clicked "✍️ Telefon / Açık Adres / Özel Hizmet Yaz"
      if (data === 'w4:custom') {
        await answerCallbackQuery(cb.id, '✍️ Bilgileri yazıp gönderin');
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
          ...state,
          ts: Date.now(),
        });
        await sendTelegram(
          chatId,
          `✍️ Lütfen eklemek istediğiniz telefon numarasını, açık adresi veya özel hizmetleri bu mesaja yanıt olarak yazıp gönderin:\n` +
            `(Örn: "0532 111 22 33, İvedik OSB 1354. Cad, Seramik Kaplama ve PPF")\n\n` +
            `🌆 Şehir: ${state.city}\n` +
            `🎯 SektörKod: ${state.sector}\n` +
            `📍 Bölge: ${state.district}\n` +
            `🔗 Link: ${state.url}`,
          {
            reply_markup: {
              force_reply: true,
              selective: true,
            },
          }
        );
        return res.status(200).json({ ok: true, step: '4_custom_prompt' });
      }

      return res.status(200).json({ ok: true });
    }

    const msg = update?.message || update?.edited_message;
    if (!msg || !msg.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    // 2. Check if user is replying to Step 4 with custom phone / address / services!
    if (msg.reply_to_message?.text && msg.reply_to_message.text.includes('🔗 Link:')) {
      const replyState = parseEmbeddedWizardState(msg.reply_to_message.text);
      if (replyState.url) {
        LAST_WIZARD_STATE_BY_CHAT.delete(chatId);
        await sendTelegram(
          chatId,
          `⏳ Yazdığınız özel bilgiler (${text}) eklendi! Kurumsal web sitesi hazırlanıyor...`
        );
        const { liveUrl } = await finalizeAndSendWebsite(chatId, replyState, text);
        return res.status(200).json({ ok: true, liveUrl });
      }
    }

    if (text === '/start' || text.toLowerCase() === 'merhaba') {
      await sendTelegram(
        chatId,
        '⚡ 7/24 Akıllı Kurumsal Web Sitesi Fabrikası Aktif!\n\nBana herhangi bir Google Maps, Instagram veya işletme linki gönderin; size adım adım:\n1️⃣ Şehir (Ankara / Samsun)\n2️⃣ Sektör & Arka Plan Videosu\n3️⃣ İlçe / Bölge\n4️⃣ Telefon & Özel Hizmet detaylarını sorarak işletmenin orijinal logosu ve gerçek fotoğraflarıyla en doğru kurumsal web sitesini hazırlayayım.'
      );
      return res.status(200).json({ ok: true });
    }

    if (!/https?:\/\//i.test(text)) {
      const cachedState = LAST_WIZARD_STATE_BY_CHAT.get(chatId);
      if (cachedState && cachedState.url && Date.now() - cachedState.ts < 30 * 60 * 1000) {
        LAST_WIZARD_STATE_BY_CHAT.delete(chatId);
        await sendTelegram(
          chatId,
          `⏳ Yazdığınız özel bilgiler (${text}) eklendi! Kurumsal web sitesi hazırlanıyor...`
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

    // 3. New Link Received -> Pre-analyze & Start Step 1 of 4 Questionnaire
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    const cleanUrl = urlMatch ? urlMatch[0] : text;
    const previewInfo = await resolveBusinessInfo(text);

    LAST_WIZARD_STATE_BY_CHAT.set(chatId, {
      url: cleanUrl,
      city: 'Ankara',
      sector: previewInfo.s,
      district: 'keep',
      ts: Date.now(),
    });

    await sendTelegram(
      chatId,
      `🔍 Link İncelendi — Adım Adım Site Kurulumu (1/4)\n\n` +
        `🏢 Algılanan İşletme: ${previewInfo.n}\n` +
        `🎯 Önerilen Sektör: ${getShortSectorLabel(previewInfo.s)}\n` +
        `📸 Çekilen Görsel: ${previewInfo.photos.length} Fotoğraf ${
          previewInfo.logo ? '+ Orijinal Logo ✅' : ''
        }\n` +
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
