import React, { useMemo } from 'react';
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

function decodeSiteParam(): DynamicSiteInfo | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (!s) return null;
    const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder('utf-8').decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.n) {
      return parsed as DynamicSiteInfo;
    }
  } catch (e) {
    console.error('Parametre cozumleme hatasi:', e);
  }
  return null;
}

export function App() {
  const dynamicInfo = useMemo(() => decodeSiteParam(), []);

  if (dynamicInfo) {
    return <DynamicCorporateSite info={dynamicInfo} />;
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
