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
  'bagdat-tatlisi-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı',
    s: 'cafe_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
  },
  'bagdat-tatlisi-bagdat-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı',
    s: 'cafe_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
  },
  'bagdat-tatlisi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı',
    s: 'cafe_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    city: 'Ankara',
    pm: 'auto',
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

  let foundRecord = SEED_SITES[cleanSlug] ? { ...SEED_SITES[cleanSlug] } : null;

  if (!foundRecord) {
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
          foundRecord = parsed;
        }
      }
    } catch (err) {
      console.error('loadSiteBySlug KV error:', err);
    }
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

function detectSector(combinedText) {
  const t = combinedText.toLocaleLowerCase('tr-TR');
  if (
    /(garage|garaj|detailing|pasta cila|seramik kaplama|elmas kaplama|ppf|kaput filmi|araç kaplama|arac kaplama|cam filmi|boyasız göçük|boyasiz gocuk|jant boyama|bodykit|oto kuaför|oto kuafor|car care|autoclub)/.test(
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
        const directMedia = await extractWebsiteLogoAndPhotos(inputUrl);
        if (directMedia.logo && !logo) logo = directMedia.logo;
        for (const dp of directMedia.photos) {
          if (!photos.includes(dp)) photos.push(dp);
        }
      }
    } catch (_) {}
  }

  if (website && (!logo || photos.length < 4)) {
    const webMedia = await extractWebsiteLogoAndPhotos(website);
    if (webMedia.logo && !logo) logo = webMedia.logo;
    for (const wp of webMedia.photos) {
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

  await sendTelegram(
    chatId,
    `✅ Kurumsal Web Sitesi Hazırlandı ve Yayına Alındı!\n\n` +
      `🏢 İşletme: ${fullInfo.n}\n` +
      `🌆 Şehir: ${chosenCity}\n` +
      `🎯 Konsept: ${getShortSectorLabel(fullInfo.s)}\n` +
      `📍 Adres: ${fullInfo.a}\n` +
      `📞 Telefon: ${fullInfo.p}\n` +
      `🏷️ Hizmetler: ${fullInfo.c || themeLabel}\n` +
      `🖼️ Logo: ${fullInfo.logo ? 'Orijinal Logo Eklendi ✅' : 'Kurumsal Monogram ✅'}\n` +
      `📸 Görseller: ${photoSummaryText}\n` +
      `🔗 Kaynak: ${wizardState.url}\n\n` +
      `🌐 Müşteriye Gönderilecek Kısa Link:\n${liveUrl}`,
    {
      reply_markup: {
        inline_keyboard: [
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

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

      // Post-generation 1-Click Quick Toggles (qf:studio, qf:auto, qf:city:...)
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
          `🎨 Adım Adım Site Kurulumu (2/5 — Sektör & Video Seçimi)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `📸 Görsel: ${info.photos.length} Fotoğraf ${info.logo ? '+ Orijinal Logo ✅' : ''}\n` +
          `🔗 Link: ${targetUrl}\n\n` +
          `❓ 2. SORU: Bu işletmenin tam sektörü, renk teması ve arka plan videosu hangisi olsun?\n` +
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
                { text: '🚙 Volkswagen / VAG Servis', callback_data: `w2:${chosenCity}:vag_automotive` },
                { text: '🏭 Sanayi / Üretim / Fabrika', callback_data: `w2:${chosenCity}:industrial_heating` },
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
                {
                  text: '🏢 Kurumsal İşletme / Mağaza / Ofis',
                  callback_data: `w2:${chosenCity}:corporate_editorial`,
                },
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

        await answerCallbackQuery(cb.id, `🎯 Sektör seçildi — Şimdi ilçe/konum seçin`);

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

        const step5Text =
          `📞 Adım Adım Site Kurulumu (5/5 — Son Kontrol & Yayına Alma)\n\n` +
          `🏢 İşletme: ${info.n}\n` +
          `🌆 Şehir: ${chosenCity}\n` +
          `🎯 Sektör: ${getShortSectorLabel(chosenSector)}\n` +
          `🎯 SektörKod: ${chosenSector}\n` +
          `📍 Bölge: ${chosenDistrict}\n` +
          `📍 Gösterilecek Adres: ${displayDistrict}\n` +
          `📞 Telefon: ${info.p}\n` +
          `🏷️ Hizmetler: ${info.c || 'Sektörel standart hizmetler'}\n` +
          `🖼️ Orijinal Logo: ${info.logo ? 'Eklendi ✅' : 'Kurumsal Monogram ✅'}\n` +
          `📸 GörselMod: ${chosenPhotoMode}\n` +
          `📸 Galeri: ${
            chosenPhotoMode === 'studio'
              ? '16:10 Yatay Sektör Stüdyo Fotoğrafları ✨'
              : `${info.photos.length} İşletme Fotoğrafı + HD Tamamlama`
          }\n` +
          `🔗 Link: ${state.url || cached.url}\n\n` +
          `❓ 5. SORU: Özel bir telefon numarası, tam açık adres veya ekstra hizmet eklemek ister misiniz, yoksa hemen yayına alalım mı?`;

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
                  text: '✍️ Telefon / Açık Adres / Özel Hizmet Yaz',
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
            `⏳ Seçimleriniz onaylandı! İşletmenin orijinal logosu, fotoğrafları, sektörel videosu ve kurumsal web sitesi yayına alınıyor...\n\n🔗 Link: ${mergedState.url}`
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
          ts: Date.now(),
        };
        LAST_WIZARD_STATE_BY_CHAT.set(chatId, mergedState);
        await sendTelegram(
          chatId,
          `✍️ Lütfen eklemek istediğiniz telefon numarasını, açık adresi veya özel hizmetleri bu mesaja yanıt olarak yazıp gönderin:\n` +
            `(Örn: "0532 111 22 33, İvedik OSB 1354. Cad, Seramik Kaplama ve PPF")\n\n` +
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

    // 6. Check if user is replying to Step 5 with custom phone / address / services!
    if (msg.reply_to_message?.text && msg.reply_to_message.text.includes('🔗 Link:')) {
      const replyState = parseEmbeddedWizardState(msg.reply_to_message.text);
      if (replyState.url) {
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
        '⚡ 7/24 Akıllı Kurumsal Web Sitesi Fabrikası Aktif!\n\nBana herhangi bir Google Maps, Instagram veya işletme linki gönderin; size adım adım:\n1️⃣ Şehir (Ankara / Samsun)\n2️⃣ Sektör & Arka Plan Videosu\n3️⃣ İlçe / Bölge\n4️⃣ Görsel & Galeri Modu (İşletme Fotoğrafları / 16:10 HD Stüdyo / Telegram Fotoğraf Yükleme)\n5️⃣ Telefon & Özel Hizmet detaylarını sorarak işletmenin orijinal logosu ve gerçek fotoğraflarıyla en doğru kurumsal web sitesini hazırlayayım.'
      );
      return res.status(200).json({ ok: true });
    }

    if (!/https?:\/\//i.test(text)) {
      const cachedState = LAST_WIZARD_STATE_BY_CHAT.get(chatId);
      if (cachedState && cachedState.url && Date.now() - cachedState.ts < 30 * 60 * 1000) {
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

    // 7. New Link Received -> Pre-analyze & Start Step 1 of 5 Questionnaire
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

    await sendTelegram(
      chatId,
      `🔍 Link İncelendi — Adım Adım Site Kurulumu (1/5)\n\n` +
        `🏢 Algılanan İşletme: ${previewInfo.n}\n` +
        `🎯 Önerilen Sektör: ${getShortSectorLabel(previewInfo.s)}\n` +
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
