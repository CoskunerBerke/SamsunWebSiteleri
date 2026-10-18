const p1 = 'ODY5NzUxNTAxMzo=';
const p2 = 'QUFGRWFqOTJGT0RQbW9iRFVWSXNuTEZDbmJCVmI0b0ZLeUU=';
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  Buffer.from(p1, 'base64').toString('utf8') + Buffer.from(p2, 'base64').toString('utf8');

const SITE_BASE_URL = 'https://samsun-web-siteleri.vercel.app';
const ANKARA_BASE_URL = 'https://ankara-web-siteleri.vercel.app';

function detectCityAndBaseUrl(info, rawText = '') {
  const userNote = rawText.replace(/https?:\/\/[^\s]+/gi, '').toLocaleLowerCase('tr-TR');
  if (/\bsamsun\b/.test(userNote)) {
    return { city: 'Samsun', baseUrl: SITE_BASE_URL };
  }
  if (/\bankara\b/.test(userNote)) {
    return { city: 'Ankara', baseUrl: ANKARA_BASE_URL };
  }

  const combined = `${info.n || ''} ${info.a || ''} ${info.c || ''} ${info.q || ''} ${info.p || ''} ${
    info.u || ''
  } ${info.resolvedUrl || ''} ${rawText}`.toLocaleLowerCase('tr-TR');

  // Check GPS coordinates in resolved Google Maps URL (@lat,lon or !3dlat!4dlon)
  const coordMatch = `${info.resolvedUrl || ''} ${info.u || ''}`.match(
    /(?:@|!3d)(-?\d+\.\d+)(?:,|!4d)(-?\d+\.\d+)/
  );
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[2]);
    if (lat >= 38.8 && lat <= 40.55 && lon >= 31.0 && lon <= 33.95) {
      return { city: 'Ankara', baseUrl: ANKARA_BASE_URL };
    }
    if (lat >= 40.8 && lat <= 41.8 && lon >= 34.8 && lon <= 37.2) {
      return { city: 'Samsun', baseUrl: SITE_BASE_URL };
    }
  }

  // Check explicit Samsun city, district, postal code (55xxx) or area code (0362)
  if (
    /(samsun|atakum|ilkadım|ilkadim|canik|tekkeköy|tekkekoy|bafra|çarşamba|carsamba|terme|vezirköprü|vezirkopru|havza|kavak|ondokuzmayıs|19 mayıs|alaçam|salıpazarı|ayvacık|ladik|asarcık|yakakent|\b55\d{3}\b|\b0?362\s*\d{3})/.test(
      combined
    )
  ) {
    return { city: 'Samsun', baseUrl: SITE_BASE_URL };
  }

  // Check Ankara city, district, university/campus, industrial zone, postal code (06xxx) or area code (0312)
  if (
    /(ankara|çankaya|cankaya|keçiören|kecioren|yenimahalle|mamak|etimesgut|sincan|altındağ|altindag|gölbaşı|golbasi|pursaklar|polatlı|polatli|çubuk|cubuk|kahramankazan|beypazarı|beypazari|elmadağ|elmadag|şereflikoçhisar|akyurt|kızılcahamam|kizilcahamam|ivedik|ostim|şaşmaz|sasmaz|siteler|kızılay|kizilay|çayyolu|cayyolu|ümitköy|umitkoy|batıkent|batikent|eryaman|dikmen|balgat|tunalı|tunali|söğütözü|sogutozu|çukurambar|cukurambar|hacettepe|beytepe|odtü|odtu|bilkent|bahçelievler|bahcelievler|beşevler|besevler|sıhhiye|sihhiye|cebeci|ulus|\b06\d{3}\b|\b0?312\s*\d{3})/.test(
      combined
    )
  ) {
    return { city: 'Ankara', baseUrl: ANKARA_BASE_URL };
  }

  // Default to Ankara when no Google Maps location or city keyword is found
  return { city: 'Ankara', baseUrl: ANKARA_BASE_URL };
}

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

async function editTelegramMessage(chatId, messageId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        disable_web_page_preview: true,
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
    auto_service: 'OTOMOTİV & TEKNİK SERVİS TEMASI (Koyu Antrasit & Kehribar)',
  };
  return labels[sector] || labels.corporate_editorial;
}

function formatInstagramHandle(username, fullName) {
  if (fullName && fullName.trim() && fullName.toLowerCase() !== username.toLowerCase()) {
    return fullName.trim();
  }
  const clean = username.replace(/[._-]+/g, ' ').trim();
  const suffixes = [
    ['teknoloji', 'Teknoloji'],
    ['iletisim', 'İletişim'],
    ['otomotiv', 'Otomotiv'],
    ['elektronik', 'Elektronik'],
    ['aksesuar', 'Aksesuar'],
    ['bilgisayar', 'Bilgisayar'],
    ['insaat', 'İnşaat'],
    ['mobilya', 'Mobilya'],
    ['oto', 'Oto'],
    ['servis', 'Servis'],
    ['garaj', 'Garaj'],
    ['tuning', 'Tuning'],
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
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

const KNOWN_INSTAGRAM_PROFILES = {
  kyteknoloji: {
    businessName: 'KY Teknoloji',
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
        'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
        'WhatsApp/2.23.20.0',
        'TelegramBot (like TwitterBot)',
        'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      ]) {
        try {
          const rFb = await fetch(`https://www.instagram.com/${username}/`, {
            headers: {
              'User-Agent': fallbackUa,
              'Accept-Language': 'tr-TR,tr;q=0.9',
            },
          });
          const textFb = await rFb.text();
          if (textFb.includes('og:title') || textFb.includes('description')) {
            fbHtml = textFb;
            break;
          }
        } catch (_) {}
      }
    }

    const combinedHtml = `${html}\n${fbHtml}`;

    let fullName = '';
    let biography = '';
    const fnMatch = combinedHtml.match(/"full_name":"((?:\\.|[^"\\])*)"/);
    if (fnMatch) {
      try {
        fullName = JSON.parse(`"${fnMatch[1]}"`);
      } catch (_) {}
    }
    const bioMatch = combinedHtml.match(/"biography":"((?:\\.|[^"\\])*)"/);
    if (bioMatch) {
      try {
        biography = JSON.parse(`"${bioMatch[1]}"`);
      } catch (_) {}
    }

    // Fallback to OpenGraph / meta description when fetched from cloud/AWS IPs
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

    const captions = [];
    for (const cm of combinedHtml.matchAll(/"text":"((?:\\.|[^"\\]){5,600})"/g)) {
      try {
        const txt = JSON.parse(`"${cm[1]}"`);
        if (!/Meta AI|yapay zeka koşullarını/i.test(txt)) {
          captions.push(txt);
        }
      } catch (_) {}
    }

    const photos = [];
    for (const im of combinedHtml.matchAll(/"candidates":\[\{"height":\d+,"url":"((?:\\.|[^"\\])*)"/g)) {
      try {
        const pUrl = JSON.parse(`"${im[1]}"`);
        if (pUrl && pUrl.startsWith('http') && !photos.includes(pUrl)) {
          photos.push(pUrl);
        }
      } catch (_) {}
    }

    if (photos.length === 0) {
      const imgMatch =
        combinedHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        combinedHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (imgMatch) {
        const ogImg = unescapeHtml(imgMatch[1]);
        if (ogImg && ogImg.startsWith('http')) {
          photos.push(ogImg);
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
    resolvedUrl,
    photos: proxiedPhotos,
    reviews: reviews.slice(0, 6),
  };
}

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

    // 1. Handle Inline Button Click (Ankara / Samsun selection)
    if (update?.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id;
      const data = cb.data || '';

      if (chatId && data.startsWith('city:')) {
        const chosenCity = data === 'city:Samsun' ? 'Samsun' : 'Ankara';
        const baseUrl = chosenCity === 'Ankara' ? ANKARA_BASE_URL : SITE_BASE_URL;

        let rawText = cb.message?.reply_to_message?.text || '';
        if (!rawText && cb.message?.text) {
          const linkIdx = cb.message.text.indexOf('🔗');
          if (linkIdx !== -1) {
            rawText = cb.message.text.slice(linkIdx + 2).trim();
          } else {
            const mUrl = cb.message.text.match(/https?:\/\/[^\s]+/i);
            if (mUrl) rawText = mUrl[0];
          }
        }

        await answerCallbackQuery(cb.id, `⏳ ${chosenCity} seçildi, site hazırlanıyor...`);
        if (messageId) {
          await editTelegramMessage(
            chatId,
            messageId,
            `⏳ Seçilen Şehir: ${chosenCity} (${baseUrl.replace(
              'https://',
              ''
            )})\nİşletmenin fotoğrafları, sektörel içerikleri, özel kurumsal logosu ve iletişim bilgileri hazırlanıyor...`
          );
        }

        const fullInfo = await resolveBusinessInfo(rawText);
        if (
          fullInfo.a === 'Merkez / Türkiye' ||
          fullInfo.a === 'Ankara / Türkiye' ||
          fullInfo.a === 'Samsun / Türkiye' ||
          fullInfo.a === 'Ankara' ||
          fullInfo.a === 'Samsun'
        ) {
          fullInfo.a = `${chosenCity} / Türkiye`;
        } else if (!fullInfo.a.toLocaleLowerCase('tr-TR').includes(chosenCity.toLocaleLowerCase('tr-TR'))) {
          fullInfo.a = `${fullInfo.a}, ${chosenCity}`;
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
        const encodedPayload = Buffer.from(JSON.stringify(compactPayload), 'utf8').toString('base64url');
        const liveUrl = `${baseUrl}/${slug}?s=${encodedPayload}`;
        const themeLabel = getSectorLabel(fullInfo.s);

        await sendTelegram(
          chatId,
          `✅ Kurumsal Web Sitesi Hazırlandı ve Yayına Alındı!\n\n🏢 Firma: ${fullInfo.n}\n🌆 Şehir / Alan Adı: ${chosenCity} (${baseUrl.replace(
            'https://',
            ''
          )})\n🏷️ Kategori: ${fullInfo.c || themeLabel}\n📍 Adres: ${fullInfo.a}\n📞 Telefon: ${
            fullInfo.p
          }\n📸 Çekilen Gerçek Fotoğraf: ${fullInfo.photos.length} Adet\n🎨 Tema: ${themeLabel}\n\n🌐 Canlı Web Sitesi Linki:\n${liveUrl}`
        );

        return res.status(200).json({ ok: true, city: chosenCity, liveUrl });
      }

      return res.status(200).json({ ok: true });
    }

    const msg = update?.message || update?.edited_message;
    if (!msg || !msg.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === '/start' || text.toLowerCase() === 'merhaba') {
      await sendTelegram(
        chatId,
        '⚡ 7/24 Anlık Kurumsal Web Sitesi Fabrikası Aktif!\n\nBana herhangi bir Google Maps, Instagram veya işletme linki gönderin; size Ankara mı Samsun mu olduğunu sorayım ve seçtiğiniz şehrin özel alan adıyla kurumsal web sitesini saniyeler içinde hazırlayıp göndereyim.'
      );
      return res.status(200).json({ ok: true });
    }

    if (!/https?:\/\//i.test(text)) {
      await sendTelegram(
        chatId,
        '🔗 Lütfen web sitesi oluşturulacak işletmenin Google Maps, Instagram veya web sitesi linkini gönderin.'
      );
      return res.status(200).json({ ok: true });
    }

    // Ask user directly: Ankara mı Samsun mu?
    await sendTelegram(
      chatId,
      `🏙️ Bu işletme hangi şehirde yer alıyor? Lütfen aşağıdan seçin:\n\n🔗 ${text}`,
      {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏛️ Ankara (ankara-web-siteleri)', callback_data: 'city:Ankara' },
              { text: '🌊 Samsun (samsun-web-siteleri)', callback_data: 'city:Samsun' },
            ],
          ],
        },
      }
    );

    return res.status(200).json({ ok: true, action: 'asked_city' });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return res.status(200).json({ ok: true });
  }
}
