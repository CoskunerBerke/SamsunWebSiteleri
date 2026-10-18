const p1 = 'ODY5NzUxNTAxMzo=';
const p2 = 'QUFGRWFqOTJGT0RQbW9iRFVWSXNuTEZDbmJCVmI0b0ZLeUU=';
const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  Buffer.from(p1, 'base64').toString('utf8') + Buffer.from(p2, 'base64').toString('utf8');

const SITE_BASE_URL = 'https://samsun-web-siteleri.vercel.app';
const ANKARA_BASE_URL = 'https://ankara-web-siteleri.vercel.app';

function detectCityAndBaseUrl(info, rawText = '') {
  const combined = `${info.n || ''} ${info.a || ''} ${info.q || ''} ${info.p || ''} ${info.u || ''} ${
    info.resolvedUrl || ''
  } ${rawText}`.toLocaleLowerCase('tr-TR');

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
  }

  // Check Ankara city, district, industrial zone, postal code (06xxx) or area code (0312)
  if (
    /(ankara|çankaya|cankaya|keçiören|kecioren|yenimahalle|mamak|etimesgut|sincan|altındağ|altindag|gölbaşı|golbasi|pursaklar|polatlı|polatli|çubuk|cubuk|kahramankazan|beypazarı|beypazari|elmadağ|elmadag|şereflikoçhisar|akyurt|kızılcahamam|ivedik|ostim|şaşmaz|sasmaz|siteler|kızılay|kizilay|çayyolu|cayyolu|ümitköy|umitkoy|batıkent|batikent|eryaman|dikmen|balgat|tunalı|tunali|söğütözü|sogutozu|çukurambar|cukurambar|\b06\d{3}\b|\b0?312\s*\d{3})/.test(
      combined
    )
  ) {
    return { city: 'Ankara', baseUrl: ANKARA_BASE_URL };
  }

  return { city: 'Samsun', baseUrl: SITE_BASE_URL };
}

const GMAPS_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
  Cookie:
    'SOCS=CAESHAgBEhJnd3NfMjAyMzA4MTAtMF9SQzIaAmVuIAEaBgiAo_CmBg; CONSENT=YES+cb.20230531-04-p0.tr+FX+111',
};

async function sendTelegram(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false,
    }),
  });
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
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function detectSector(combinedText) {
  const t = combinedText.toLocaleLowerCase('tr-TR');
  if (
    /(börek|borek|poğaça|pogaca|simit|kahvaltı|kahvalti|fırın|firin|unlu mamül|unlu mamul|pastane|baklava|künefe|kunefe|kruvasan|ekmek|katmer|gözleme|gozleme|mantı|manti)/.test(
      t
    )
  ) {
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
    /(kafe|cafe|kahve|coffee|espresso|latte|bistro|dondurma|waffle|çikolata|cikolata|nargile|çay evi|cay bahcesi|tatlı|tatli)/.test(
      t
    )
  ) {
    return 'cafe_dessert';
  }
  if (
    /(restoran|restaurant|aspava|kebap|ocakbaşı|ocakbasi|pide|lahmacun|yemek|et |balık|balik|döner|doner|iskender|köfte|kofte|izgara|ızgara|mutfak|lezzet|steak|burger|pizza|kokoreç|tantuni|ciğer|ciger|mangal|dürüm|durum|tavuk)/.test(
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
    /(çamaşır|camasir|bulaşık|bulasik|buzdolabı|buzdolabi|klima|kombi|süpürge|supurge|ev aletleri|elektrikli cihaz|beyaz eşya|beyaz esya|arzum|fantom|philips|beko|arçelik|arcelik|bosch|siemens|tefal|braun|delonghi|rowenta|korkmaz|fakir|teknik servis|tamir servisi)/.test(
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
    appliance_service: 'TEKNİK SERVİS & ELEKTRİKLİ CİHAZ TEMASI (Kurumsal Antrasit & Kehribar)',
    mercedes_luxury: 'LÜKS OTOMOTİV TEMASI (Monokrom Siyah & Beyaz)',
    vag_automotive: 'VAG OTOMOTİV TEMASI (Koyu Lacivert & Kristal Beyaz)',
    industrial_heating: 'ÜRETİM & SANAYİ TEMASI (Kömür Karası & Endüstriyel Kırmızı)',
    corporate_editorial: 'KURUMSAL EDİTORYAL TEMA (Antrasit & Kırık Beyaz)',
    auto_service: 'OTOMOTİV & TEKNİK SERVİS TEMASI (Koyu Antrasit & Kehribar)',
  };
  return labels[sector] || labels.corporate_editorial;
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

  if (inputUrl) {
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
    .map((pUrl) => `/api/telegram?img=${encodeURIComponent(pUrl)}`);

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
    const msg = update?.message || update?.edited_message;
    if (!msg || !msg.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === '/start' || text.toLowerCase() === 'merhaba') {
      await sendTelegram(
        chatId,
        '⚡ 7/24 Anlık Kurumsal Web Sitesi Fabrikası Aktif!\n\nBana herhangi bir Google Maps, Instagram veya işletme linki gönderin; işletmenin bulunduğu şehre (Ankara / Samsun) göre özel alan adıyla, gerçek fotoğrafları, telefonu, adresi ve özel logosuyla kurumsal web sitesini saniyeler içinde hazırlayıp göndereyim.'
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

    await sendTelegram(
      chatId,
      '⏳ İşletmenin Google Maps fotoğrafları, sektörel içerikleri, özel kurumsal logosu ve iletişim bilgileri hazırlanıyor...'
    );

    const fullInfo = await resolveBusinessInfo(text);
    const { city, baseUrl } = detectCityAndBaseUrl(fullInfo, text);
    if (fullInfo.a === 'Merkez / Türkiye' && city === 'Ankara') {
      fullInfo.a = 'Ankara / Türkiye';
    }

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
      `✅ Kurumsal Web Sitesi Hazırlandı ve Yayına Alındı!\n\n🏢 Firma: ${fullInfo.n}\n🌆 Şehir / Alan Adı: ${city} (${baseUrl.replace(
        'https://',
        ''
      )})\n🏷️ Kategori: ${fullInfo.c || themeLabel}\n📍 Adres: ${fullInfo.a}\n📞 Telefon: ${
        fullInfo.p
      }\n📸 Çekilen Gerçek Fotoğraf: ${fullInfo.photos.length} Adet\n🎨 Tema: ${themeLabel}\n\n🌐 Canlı Web Sitesi Linki:\n${liveUrl}`
    );

    return res.status(200).json({ ok: true, city, liveUrl });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return res.status(200).json({ ok: true });
  }
}
