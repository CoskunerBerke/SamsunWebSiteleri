import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Hakkımızda', href: '#kurumsal' },
    { name: 'Hizmetler', href: '#hizmetler' },
    { name: 'Yorumlar', href: '#yorumlar' },
    { name: 'Atölye', href: '#galeri' },
    { name: 'İletişim', href: '#iletisim' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-zinc-950/85 backdrop-blur-sm border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Brand (shrink-0 & whitespace-nowrap) */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 shrink-0">
              <Zap className="w-5 h-5 fill-zinc-950" />
            </div>
            <div className="whitespace-nowrap">
              <span className="block text-white font-bold text-base tracking-tight leading-none">
                BEKTAŞ OTO ELEKTRİK
              </span>
              <span className="block text-amber-400 text-[11px] font-medium tracking-widest uppercase mt-1">
                AKÜ & DİJİTAL TAKOGRAF SERVİSİ
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Single word, never wraps */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right CTA - shrink-0 & whitespace-nowrap prevents overlap */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="tel:+903622666670"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-white hover:bg-white/10 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>0362 266 66 70</span>
            </a>
            <a
              href="https://wa.me/905057727033?text=Merhaba%20Bekta%C5%9F%20Oto%2C%20servis%20ve%20randevu%20bilgisi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Randevu Al
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-200 hover:text-white hover:bg-white/10 shrink-0"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-white/10 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2.5">
              <a
                href="tel:+903622666670"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/10 text-white text-sm font-semibold"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>0362 266 66 70</span>
              </a>
              <a
                href="tel:+905057727033"
                className="flex items-center justify-center py-2.5 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold"
              >
                0505 772 70 33
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
