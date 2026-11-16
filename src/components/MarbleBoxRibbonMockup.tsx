import React, { memo, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MarbleCassetteEdition, RibbonSealOption } from '../data/soaps';

interface MarbleBoxRibbonMockupProps {
  stoneType: MarbleCassetteEdition['stoneType'];
  setName: string;
  ribbon: RibbonSealOption;
  engravingNote: string;
}

export const MarbleBoxRibbonMockup: React.FC<MarbleBoxRibbonMockupProps> = memo(({
  stoneType,
  setName,
  ribbon,
  engravingNote,
}) => {
  const uid = useId().replace(/:/g, '');
  const shouldReduceMotion = useReducedMotion();
  const isDarkStone = stoneType === 'dark-marble';
  const isCheckeredStone = stoneType === 'checkered-occasions';

  const plaqueLabel = (engravingNote.trim() || 'GENTLEBUBBLE BY AR').toUpperCase();

  const idTopStone = `coffret-top-stone-${uid}`;
  const idCheckeredLid = `checkered-marble-lid-${uid}`;
  const idCheckeredFront = `checkered-marble-front-${uid}`;
  const idFrontStone = `coffret-front-stone-${uid}`;
  const idSideStone = `coffret-side-stone-${uid}`;
  const idBrassPlaque = `coffret-brass-plaque-${uid}`;
  const idRibbonVert = `ribbon-vertical-band-${uid}`;
  const idRibbonHoriz = `ribbon-horizontal-band-${uid}`;
  const idRibbonFold = `ribbon-front-fold-${uid}`;
  const idRibbonBow = `ribbon-bow-loop-${uid}`;
  const idWaxSeal = `ribbon-wax-seal-${uid}`;
  const idShadow = `ribbon-soft-shadow-${uid}`;

  return (
    <div
      className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 overflow-hidden select-none"
      aria-label={`Interactive 3D marble coffret preview for ${setName} wrapped in ${ribbon.name} ribbon`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 25%, rgba(255, 255, 255, 0.22), transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-[300px]">
        <svg
          viewBox="0 0 380 212"
          className="w-full h-auto drop-shadow-[0_14px_18px_rgba(32,22,16,0.16)]"
          role="img"
          aria-label={`3D marble coffret box with ${ribbon.name} silk ribbon`}
        >
          <defs>
            {/* Stone Lid Surface */}
            <linearGradient id={idTopStone} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkStone ? '#332E30' : '#FCF9F3'} />
              <stop offset="52%" stopColor={isDarkStone ? '#231F21' : '#F2ECE1'} />
              <stop offset="100%" stopColor={isDarkStone ? '#171416' : '#E5DDD0'} />
            </linearGradient>

            {/* Alternating Black & Cream Marble Checkerboard Pattern for Occasions Box */}
            <pattern id={idCheckeredLid} width="36" height="24" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="18" height="12" fill="#F5EFE5" />
              <rect x="18" y="0" width="18" height="12" fill="#232022" />
              <rect x="0" y="12" width="18" height="12" fill="#232022" />
              <rect x="18" y="12" width="18" height="12" fill="#F5EFE5" />
              <path d="M2 3 L14 9" stroke="rgba(165,142,108,0.28)" strokeWidth="0.6" />
              <path d="M20 4 L33 10" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
            </pattern>

            <pattern id={idCheckeredFront} width="36" height="32" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="18" height="16" fill="#232022" />
              <rect x="18" y="0" width="18" height="16" fill="#EAE1D3" />
              <rect x="0" y="16" width="18" height="16" fill="#EAE1D3" />
              <rect x="18" y="16" width="18" height="16" fill="#232022" />
            </pattern>

            {/* Front & Right Extruded Stone Bevels */}
            <linearGradient id={idFrontStone} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDarkStone ? '#1D1A1C' : '#DED4C5'} />
              <stop offset="100%" stopColor={isDarkStone ? '#121011' : '#CEC2B0'} />
            </linearGradient>
            <linearGradient id={idSideStone} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkStone ? '#2A2527' : '#EAE2D6'} />
              <stop offset="100%" stopColor={isDarkStone ? '#151213' : '#D5C9B7'} />
            </linearGradient>

            {/* Brass Engraved Lid Plaque */}
            <linearGradient id={idBrassPlaque} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E6BE" />
              <stop offset="50%" stopColor="#D6B16A" />
              <stop offset="100%" stopColor="#A9823C" />
            </linearGradient>

            {/* 3D Satin Ribbon Gradients */}
            <linearGradient id={idRibbonVert} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ribbon.shadowHex} />
              <stop offset="22%" stopColor={ribbon.swatch} />
              <stop offset="48%" stopColor={ribbon.highlightHex} />
              <stop offset="78%" stopColor={ribbon.swatch} />
              <stop offset="100%" stopColor={ribbon.shadowHex} />
            </linearGradient>

            <linearGradient id={idRibbonHoriz} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ribbon.shadowHex} />
              <stop offset="24%" stopColor={ribbon.swatch} />
              <stop offset="50%" stopColor={ribbon.highlightHex} />
              <stop offset="78%" stopColor={ribbon.swatch} />
              <stop offset="100%" stopColor={ribbon.shadowHex} />
            </linearGradient>

            <linearGradient id={idRibbonFold} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ribbon.shadowHex} />
              <stop offset="45%" stopColor={ribbon.swatch} />
              <stop offset="100%" stopColor={ribbon.shadowHex} />
            </linearGradient>

            <linearGradient id={idRibbonBow} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ribbon.highlightHex} />
              <stop offset="52%" stopColor={ribbon.swatch} />
              <stop offset="100%" stopColor={ribbon.shadowHex} />
            </linearGradient>

            <radialGradient id={idWaxSeal} cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor={ribbon.highlightHex} />
              <stop offset="58%" stopColor={ribbon.sealHex} />
              <stop offset="100%" stopColor={ribbon.shadowHex} />
            </radialGradient>

            <filter id={idShadow} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1A120E" floodOpacity="0.28" />
            </filter>
          </defs>

          <ellipse cx="192" cy="184" rx="146" ry="20" fill="rgba(28, 20, 14, 0.14)" />

          {/* Right Stone Wall */}
          <polygon
            points="324,84 352,102 352,164 324,146"
            fill={isCheckeredStone ? `url(#${idCheckeredFront})` : `url(#${idSideStone})`}
            stroke={isDarkStone ? '#3B3436' : '#D4C7B5'}
            strokeWidth="0.9"
          />

          {/* Front Wall */}
          <path
            d="M 28 112 L 324 112 L 324 168 Q 324 176 314 176 L 38 176 Q 28 176 28 168 Z"
            fill={isCheckeredStone ? `url(#${idCheckeredFront})` : `url(#${idFrontStone})`}
            stroke={isDarkStone ? '#3D3537' : '#CFC2AE'}
            strokeWidth="1"
          />

          <line
            x1="28"
            y1="130"
            x2="324"
            y2="130"
            stroke={isDarkStone || isCheckeredStone ? 'rgba(216,184,120,0.4)' : 'rgba(120,104,84,0.22)'}
            strokeWidth="1"
          />

          {/* Top Beveled Lid Plane */}
          <polygon
            points="58,42 350,42 324,112 28,112"
            fill={isCheckeredStone ? `url(#${idCheckeredLid})` : `url(#${idTopStone})`}
            stroke={isDarkStone ? '#4A4143' : '#FFFFFF'}
            strokeWidth="1.2"
          />

          {/* Natural Mineral Veining (for Calacatta & Nero lids) */}
          {!isCheckeredStone && (
            <g
              fill="none"
              stroke={isDarkStone ? 'rgba(220, 198, 160, 0.24)' : 'rgba(155, 138, 118, 0.26)'}
              strokeLinecap="round"
            >
              <path d="M 74 52 C 110 66, 132 58, 168 78" strokeWidth="1.4" />
              <path d="M 218 48 C 254 70, 272 64, 318 96" strokeWidth="1.2" />
              <path d="M 54 92 C 96 86, 118 102, 146 106" strokeWidth="0.9" />
              <path d="M 244 98 C 276 92, 298 104, 326 88" strokeWidth="1.1" />
            </g>
          )}

          {/* Royal Brass Engraved Plaque */}
          <g transform="translate(216, 79)">
            <rect
              x="0"
              y="0"
              width="92"
              height="22"
              rx="4"
              fill={`url(#${idBrassPlaque})`}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="0.7"
            />
            <text
              x="46"
              y="13.5"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="6.4"
              fontWeight="700"
              letterSpacing="0.8"
              fill="#2B2014"
            >
              {plaqueLabel.slice(0, 18)}
            </text>
          </g>

          {/* 3D Wrap-Around Silk Horizontal Ribbon Band */}
          <g filter={`url(#${idShadow})`}>
            <polygon points="44,71 339,71 335,84 40,84" fill={`url(#${idRibbonHoriz})`} />
            <line
              x1="43"
              y1="72.4"
              x2="338"
              y2="72.4"
              stroke={ribbon.edgeHex}
              strokeWidth="0.8"
              strokeOpacity="0.65"
            />
            <line
              x1="40.5"
              y1="82.6"
              x2="335.5"
              y2="82.6"
              stroke={ribbon.edgeHex}
              strokeWidth="0.8"
              strokeOpacity="0.45"
            />
            <polygon
              points="339,71 352,80 352,144 335,134 335,84"
              fill={`url(#${idRibbonFold})`}
              opacity="0.92"
            />
          </g>

          {/* 3D Wrap-Around Silk Vertical Ribbon Band */}
          <g filter={`url(#${idShadow})`}>
            <polygon points="154,42 184,42 168,112 136,112" fill={`url(#${idRibbonVert})`} />
            <line
              x1="156.5"
              y1="42"
              x2="138.5"
              y2="112"
              stroke={ribbon.edgeHex}
              strokeWidth="0.9"
              strokeOpacity="0.7"
            />
            <line
              x1="181.5"
              y1="42"
              x2="165.5"
              y2="112"
              stroke={ribbon.edgeHex}
              strokeWidth="0.9"
              strokeOpacity="0.55"
            />

            <rect x="136" y="112" width="32" height="64" fill={`url(#${idRibbonFold})`} />
            <line
              x1="138.2"
              y1="112"
              x2="138.2"
              y2="176"
              stroke={ribbon.edgeHex}
              strokeWidth="0.85"
              strokeOpacity="0.55"
            />
            <line
              x1="165.8"
              y1="112"
              x2="165.8"
              y2="176"
              stroke={ribbon.edgeHex}
              strokeWidth="0.85"
              strokeOpacity="0.45"
            />
          </g>

          {/* Sculpted 3D Satin Bow & Wax Crest */}
          <motion.g
            key={ribbon.id}
            initial={shouldReduceMotion ? false : { scale: 0.94, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '160px 76px' }}
            filter={`url(#${idShadow})`}
          >
            <path d="M 154 81 L 122 126 L 132 121 L 138 128 L 158 84 Z" fill={`url(#${idRibbonBow})`} />
            <path d="M 164 81 L 194 128 L 184 122 L 178 130 L 159 84 Z" fill={`url(#${idRibbonBow})`} />

            <path
              d="M 157 74 C 128 50, 108 60, 118 78 C 126 90, 146 84, 157 78 Z"
              fill={ribbon.shadowHex}
            />
            <path
              d="M 163 74 C 194 49, 214 60, 204 78 C 196 90, 174 84, 163 78 Z"
              fill={ribbon.shadowHex}
            />

            <path
              d="M 157 75 C 124 44, 102 58, 114 75 C 122 86, 145 81, 157 77 Z"
              fill={`url(#${idRibbonBow})`}
              stroke={ribbon.edgeHex}
              strokeWidth="0.7"
              strokeOpacity="0.7"
            />
            <path
              d="M 163 75 C 198 44, 219 58, 207 75 C 199 86, 175 81, 163 77 Z"
              fill={`url(#${idRibbonBow})`}
              stroke={ribbon.edgeHex}
              strokeWidth="0.7"
              strokeOpacity="0.7"
            />

            <ellipse cx="144" cy="73" rx="6" ry="2.2" fill={ribbon.shadowHex} opacity="0.55" />
            <ellipse cx="176" cy="73" rx="6" ry="2.2" fill={ribbon.shadowHex} opacity="0.55" />

            <circle
              cx="160"
              cy="76"
              r="11.5"
              fill={`url(#${idWaxSeal})`}
              stroke={ribbon.edgeHex}
              strokeWidth="1.2"
            />
            <circle
              cx="160"
              cy="76"
              r="7.8"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.7"
              strokeDasharray="1.5 1.5"
            />
            <text
              x="160"
              y="78.5"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="7"
              fontWeight="700"
              fill="#FFFDF8"
              opacity="0.92"
            >
              GB
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
});

MarbleBoxRibbonMockup.displayName = 'MarbleBoxRibbonMockup';
