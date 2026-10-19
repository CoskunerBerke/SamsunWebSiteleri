import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutWorkshop from './components/AboutWorkshop';
import Services from './components/Services';
import ReviewRiver from './components/ReviewRiver';
import WorkshopGallery from './components/WorkshopGallery';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MobileQuickBar from './components/MobileQuickBar';
import DynamicCorporateSite, { DynamicSiteInfo } from './components/DynamicCorporateSite';

const SEED_SITES_CLIENT: Record<string, DynamicSiteInfo> = {
  'bagdat-tatlisi-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı',
    s: 'cafe_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
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
    pm: 'auto',
  },
};

const ANKARA_ROOT_SITE: DynamicSiteInfo = {
  n: 'Ankara Kurumsal İşletme & Hizmet Merkezi',
  a: 'Çankaya / Ankara',
  p: '0544 477 56 57',
  c: 'Kurumsal Hizmet • Danışmanlık • Profesyonel Uygulama',
  s: 'corporate_editorial',
  q: 'Çankaya, Ankara',
};

function getCleanPathSlug(): string {
  try {
    const raw = decodeURIComponent(window.location.pathname || '')
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase();
    if (!raw || raw === 'index.html' || raw.startsWith('api/')) return '';
    return raw;
  } catch {
    return '';
  }
}

function decodeSiteParam(slug: string): DynamicSiteInfo | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (s) {
      const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const jsonStr = new TextDecoder('utf-8').decode(bytes);
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.n) {
        if (slug) {
          try {
            sessionStorage.setItem(`site_slug_${slug}`, JSON.stringify(parsed));
          } catch {}
          // Automatically strip the long ?s=... query parameter from the browser address bar!
          try {
            window.history.replaceState({}, '', `/${slug}`);
          } catch {}
        }
        return parsed as DynamicSiteInfo;
      }
    }

    if (slug) {
      if (SEED_SITES_CLIENT[slug]) {
        return SEED_SITES_CLIENT[slug];
      }
      try {
        const cached = sessionStorage.getItem(`site_slug_${slug}`);
        if (cached) {
          const parsedCached = JSON.parse(cached);
          if (parsedCached && parsedCached.n) {
            return parsedCached as DynamicSiteInfo;
          }
        }
      } catch {}
    }
  } catch (e) {
    console.error('Parametre cozumleme hatasi:', e);
  }
  return null;
}

export function App() {
  const slug = useMemo(() => getCleanPathSlug(), []);
  const initialInfo = useMemo(() => decodeSiteParam(slug), [slug]);
  const [resolvedInfo, setResolvedInfo] = useState<DynamicSiteInfo | null>(initialInfo);
  const [loadingSlug, setLoadingSlug] = useState<boolean>(Boolean(slug && !initialInfo));

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(
      `/api/telegram?slug=${encodeURIComponent(slug)}&host=${encodeURIComponent(
        window.location.hostname || ''
      )}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data?.info && data.info.n) {
          try {
            sessionStorage.setItem(`site_slug_${slug}`, JSON.stringify(data.info));
          } catch {}
          setResolvedInfo((prev) => ({
            ...(prev || {}),
            ...data.info,
          }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoadingSlug(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (resolvedInfo) {
    return <DynamicCorporateSite info={resolvedInfo} />;
  }

  if (loadingSlug && slug) {
    const displayTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
      .join(' ');
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-5" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {displayTitle}
        </h1>
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400 mt-2">
          Kurumsal Web Sitesi Yükleniyor
        </p>
      </div>
    );
  }

  // If visiting the root domain of ankara-web-siteleri.vercel.app directly, never show Samsun Volkswagen!
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().includes('ankara')
  ) {
    return <DynamicCorporateSite info={ANKARA_ROOT_SITE} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutWorkshop />
        <Services />
        <ReviewRiver />
        <WorkshopGallery />
        <ContactSection />
      </main>
      <Footer />
      <MobileQuickBar />
    </div>
  );
}

export default App;
