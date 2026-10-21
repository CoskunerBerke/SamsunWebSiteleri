import React, { useState, useEffect } from 'react';
import VwLogo from './VwLogo';

interface BrandLogoProps {
  name: string;
  sector: string;
  category?: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  const cleaned = name
    .replace(/[-–—|/.,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter((w) => w.length > 1);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toLocaleUpperCase('tr-TR');
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toLocaleUpperCase('tr-TR');
  }
  return 'KR';
}

export function getKnownLocalLogo(name: string): string {
  const lower = (name || '').toLocaleLowerCase('tr-TR');
  if (lower.includes('gada')) return '/logos/gada-coffee-eatery.svg';
  if (lower.includes('koala')) return '/logos/koala-coffee-shop.svg';
  if (lower.includes('sloth')) return '/logos/sloth-coffee-shop.svg';
  if (lower.includes('padam')) return '/logos/padam-coffee-shop.svg';
  if (lower.includes('f451') || lower.includes('451')) return '/logos/f451-brew.svg';
  if (lower.includes('kakule')) return '/logos/kakule-kahve.svg';
  if (lower.includes('kanta')) return '/logos/kanta-coffee-shop.svg';
  if (lower.includes('kvassir') || lower.includes('kvasir')) return '/logos/kvassir.svg';
  if (lower.includes('guzu')) return '/logos/guzu-coffee.svg';
  if (lower.includes('grandala')) return '/logos/grandala-coffee.svg';
  if (lower.includes('caffenux') || lower.includes('caffe nux')) return '/logos/caffenux.svg';
  if (lower.includes('sweden')) return '/logos/sweden-pizza.svg';
  if (lower.includes('bağdat') || lower.includes('bagdat')) return '/logos/bagdat-tatlisi.svg';
  if (lower.includes('diestro')) return '/images/diestrogarage/logo.jpg';
  if (lower.includes('ky teknoloji') || lower.includes('kyteknoloji')) return '/images/kyteknoloji/logo.jpg';
  if (lower.includes('cofferoz')) return '/images/cofferozz/logo.jpg';
  return '';
}

function hashBusinessName(str: string): number {
  let h = 2166136261;
  const s = (str || 'Kurumsal').toLocaleLowerCase('tr-TR');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const BESPOKE_PALETTES = [
  { bg: '#18181b', primary: '#f59e0b', secondary: '#fde68a', text: '#ffffff' }, // Obsidian & Gold
  { bg: '#0b4f3e', primary: '#a7f3d0', secondary: '#ecfdf5', text: '#ffffff' }, // Emerald & Mint Ivory
  { bg: '#5c1922', primary: '#fcd34d', secondary: '#fef3c7', text: '#fffbeb' }, // Burgundy & Champagne
  { bg: '#0f172a', primary: '#38bdf8', secondary: '#bae6fd', text: '#f0f9ff' }, // Midnight & Ice Blue
  { bg: '#271712', primary: '#e05a47', secondary: '#f4d3b2', text: '#fff8f0' }, // Espresso & Terracotta
  { bg: '#1e3a2f', primary: '#a3c9a8', secondary: '#eae4d3', text: '#fffdf9' }, // Botanical Sage & Cream
  { bg: '#1e1b4b', primary: '#fbbf24', secondary: '#fde68a', text: '#ffffff' }, // Royal Indigo & Amber
  { bg: '#1c1917', primary: '#fb923c', secondary: '#fed7aa', text: '#fff7ed' }, // Charcoal & Warm Copper
];

export function buildDynamicSvgMarkup(name: string, sector: string, category = ''): string {
  const initials = getInitials(name);
  const shortWord = (name || 'MARKA')
    .replace(/[^A-Za-zÇĞİÖŞÜçğıöşü0-9\s]/g, '')
    .trim()
    .split(/\s+/)[0]
    .slice(0, 9)
    .toLocaleUpperCase('tr-TR');

  const h = hashBusinessName(name);
  const isDental = sector === 'dental_medical';
  const isMercedes = sector === 'mercedes_luxury';
  const isIndustrial = sector === 'industrial_heating';

  let palette = BESPOKE_PALETTES[h % BESPOKE_PALETTES.length];
  if (isDental) {
    palette = { bg: '#0f172a', primary: '#14b8a6', secondary: '#99f6e4', text: '#ffffff' };
  } else if (isMercedes) {
    palette = { bg: '#09090b', primary: '#e4e4e7', secondary: '#a1a1aa', text: '#ffffff' };
  } else if (isIndustrial) {
    palette = { bg: '#09090b', primary: '#dc2626', secondary: '#fca5a5', text: '#ffffff' };
  }

  const shapeVariant = h % 4;
  let frameMarkup = '';
  if (shapeVariant === 0) {
    // Rounded Luxury Square
    frameMarkup = `
      <rect width="64" height="64" rx="15" fill="${palette.bg}"/>
      <rect x="4" y="4" width="56" height="56" rx="12" stroke="${palette.primary}" stroke-width="2.2"/>
      <rect x="7.5" y="7.5" width="49" height="49" rx="9" stroke="${palette.secondary}" stroke-width="0.8" stroke-opacity="0.45"/>
    `;
  } else if (shapeVariant === 1) {
    // Artisanal Double-Ring Medallion
    frameMarkup = `
      <rect width="64" height="64" rx="32" fill="${palette.bg}"/>
      <circle cx="32" cy="32" r="28" stroke="${palette.primary}" stroke-width="2.2"/>
      <circle cx="32" cy="32" r="24" stroke="${palette.secondary}" stroke-width="0.9" stroke-dasharray="3 2" stroke-opacity="0.65"/>
    `;
  } else if (shapeVariant === 2) {
    // Architectural Octagon Crest
    frameMarkup = `
      <rect width="64" height="64" rx="14" fill="${palette.bg}"/>
      <polygon points="20,4 44,4 60,20 60,44 44,60 20,60 4,44 4,20" fill="${palette.bg}" stroke="${palette.primary}" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22" stroke="${palette.secondary}" stroke-width="0.8" stroke-opacity="0.5" stroke-linejoin="round"/>
    `;
  } else {
    // Arched Heritage Plaque
    frameMarkup = `
      <rect width="64" height="64" rx="15" fill="${palette.bg}"/>
      <path d="M10 56V28C10 15.8497 19.8497 6 32 6C44.1503 6 54 15.8497 54 28V56H10Z" fill="${palette.bg}" stroke="${palette.primary}" stroke-width="2.2"/>
      <line x1="16" y1="50" x2="48" y2="50" stroke="${palette.secondary}" stroke-width="1" stroke-opacity="0.5"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
    ${frameMarkup}
    <text x="32" y="35" text-anchor="middle" fill="${palette.text}" font-family="'Outfit', 'Inter', system-ui, sans-serif" font-weight="800" font-size="19" letter-spacing="1.2">${initials}</text>
    <text x="32" y="46.5" text-anchor="middle" fill="${palette.primary}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="6.2" letter-spacing="1.4">${shortWord}</text>
  </svg>`;
}

export function getBusinessFaviconHref(
  name: string,
  sector: string,
  category = '',
  logo = ''
): string {
  const effectiveLogo = logo || getKnownLocalLogo(name);
  if (effectiveLogo) {
    return effectiveLogo;
  }
  if (sector === 'vag_automotive') {
    return '/vw-logo.svg';
  }
  const svg = buildDynamicSvgMarkup(name, sector, category);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  sector,
  category = '',
  logo = '',
  size = 'md',
  className = '',
}) => {
  const effectiveLogo = logo || getKnownLocalLogo(name);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [effectiveLogo]);

  if (effectiveLogo && !imgFailed) {
    const dim = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
    return (
      <div
        className={`${dim} shrink-0 relative inline-flex items-center justify-center rounded-xl overflow-hidden bg-zinc-950 shadow-md select-none ${className}`}
        title={`${name} Orijinal Logosu`}
      >
        <img
          src={effectiveLogo}
          alt={`${name} Logo`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (sector === 'vag_automotive') {
    const dim = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
    return <VwLogo className={`${dim} shrink-0 ${className}`} />;
  }

  const sizeClass =
    size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
    buildDynamicSvgMarkup(name, sector, category)
  )}`;

  return (
    <div
      className={`${sizeClass} shrink-0 relative inline-flex items-center justify-center select-none ${className}`}
      title={`${name} Kurumsal Logosu`}
    >
      <img
        src={svgDataUri}
        alt={`${name} Logo`}
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </div>
  );
};

export default BrandLogo;
