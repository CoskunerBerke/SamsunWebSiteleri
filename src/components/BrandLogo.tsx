import React from 'react';
import VwLogo from './VwLogo';

interface BrandLogoProps {
  name: string;
  sector: string;
  category?: string;
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

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  sector,
  category = '',
  size = 'md',
  className = '',
}) => {
  if (sector === 'vag_automotive') {
    const dim = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
    return <VwLogo className={`${dim} shrink-0 ${className}`} />;
  }

  const initials = getInitials(name);
  const combined = `${name} ${category} ${sector}`.toLocaleLowerCase('tr-TR');

  const isBakery =
    sector === 'bakery_breakfast' ||
    /(börek|borek|kahvaltı|kahvalti|fırın|firin|pastane|poğaça|simit|baklava|unlu)/.test(combined);
  const isFood =
    isBakery ||
    sector === 'restaurant' ||
    sector === 'soup_restaurant' ||
    sector === 'grill_restaurant' ||
    sector === 'cafe_dessert';
  const isDental = sector === 'dental_medical';
  const isMercedes = sector === 'mercedes_luxury';
  const isIndustrial = sector === 'industrial_heating';

  // Color palette per sector
  let strokePrimary = '#f59e0b'; // Amber 500
  let strokeSecondary = '#fde68a'; // Amber 200
  let bgFill = '#18181b'; // Zinc 900
  let textFill = '#ffffff';

  if (isDental) {
    strokePrimary = '#0d9488'; // Teal 600
    strokeSecondary = '#5eead4'; // Teal 300
    bgFill = '#0f172a'; // Slate 900
    textFill = '#ffffff';
  } else if (isMercedes) {
    strokePrimary = '#e5e5e5';
    strokeSecondary = '#a3a3a3';
    bgFill = '#0a0a0a';
    textFill = '#ffffff';
  } else if (isIndustrial) {
    strokePrimary = '#dc2626'; // Red 600
    strokeSecondary = '#fca5a5';
    bgFill = '#09090b';
    textFill = '#ffffff';
  } else if (isFood) {
    strokePrimary = '#f59e0b';
    strokeSecondary = '#fcd34d';
    bgFill = '#1c1917'; // Stone 900
    textFill = '#fffbeb';
  }

  const sizeClass =
    size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';

  return (
    <div
      className={`${sizeClass} shrink-0 relative inline-flex items-center justify-center select-none ${className}`}
      title={`${name} Kurumsal Logosu`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Background Crest Shape */}
        {isFood ? (
          <>
            {/* Double-ring artisanal gastronomy/bakery seal */}
            <circle cx="32" cy="32" r="30" fill={bgFill} stroke={strokePrimary} strokeWidth="2.2" />
            <circle
              cx="32"
              cy="32"
              r="25.5"
              stroke={strokeSecondary}
              strokeWidth="0.9"
              strokeDasharray="2.5 2"
              strokeOpacity="0.75"
            />
            {/* Top Artisanal Crown / Wheat Flourish */}
            <path
              d="M24 14.5C26.5 12.5 29.2 11.5 32 11.5C34.8 11.5 37.5 12.5 40 14.5"
              stroke={strokePrimary}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="32" cy="11" r="1.6" fill={strokeSecondary} />
            <circle cx="26.5" cy="12.5" r="1.1" fill={strokePrimary} />
            <circle cx="37.5" cy="12.5" r="1.1" fill={strokePrimary} />
            {/* Bottom Heritage Line */}
            <path
              d="M23 50.5H41"
              stroke={strokePrimary}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            <circle cx="32" cy="50.5" r="1.5" fill={strokeSecondary} />
          </>
        ) : isDental ? (
          <>
            {/* Rounded Medical Shield Emblem */}
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="16"
              fill={bgFill}
              stroke={strokePrimary}
              strokeWidth="2.4"
            />
            <rect
              x="8.5"
              y="8.5"
              width="47"
              height="47"
              rx="12"
              stroke={strokeSecondary}
              strokeWidth="0.9"
              strokeOpacity="0.6"
            />
            {/* Subtle Medical Cross at Top */}
            <path
              d="M32 11.5V16.5M29.5 14H34.5"
              stroke={strokeSecondary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Precision Hexagonal / Octagonal Corporate & Technical Crest */}
            <polygon
              points="32,3 56,14 61,32 56,50 32,61 8,50 3,32 8,14"
              fill={bgFill}
              stroke={strokePrimary}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="32,7.5 52,17 56.5,32 52,47 32,56.5 12,47 7.5,32 12,17"
              stroke={strokeSecondary}
              strokeWidth="0.9"
              strokeOpacity="0.55"
              strokeLinejoin="round"
            />
            {/* Top & Bottom Precision Accents */}
            <line x1="25" y1="13" x2="39" y2="13" stroke={strokePrimary} strokeWidth="1.6" strokeLinecap="round" />
            <line x1="27" y1="51" x2="37" y2="51" stroke={strokePrimary} strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}

        {/* Central Bold Brand Initials Monogram */}
        <text
          x="32"
          y="38.5"
          textAnchor="middle"
          fill={textFill}
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="1"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
};

export default BrandLogo;
