import React, { useId } from 'react';

export type MotifVariant =
  | 'original-3d'
  | 'atelier-gold'
  | 'nocturne-crimson'
  | 'laser-engraved'
  | 'wax-seal'
  | 'watermark';

interface RedesignedLogoMotifProps {
  variant?: MotifVariant;
  size?: number;
  engravingNote?: string;
  className?: string;
}

/**
 * Fixed & Improved 3D Gentle Bubble Heritage Crest:
 * Preserves the original scalloped mint medallion & pearl ring, "ARTISAN SOAP & CO." top arch,
 * 3D-lit glazed porcelain clawfoot bathtub with brushed gold feet, volumetric iridescent soap
 * bubbles with specular highlights, extruded serif "GENTLE BUBBLE", and "UNWIND WITH GENTLE BUBBLES".
 */
export const RedesignedLogoMotif: React.FC<RedesignedLogoMotifProps> = ({
  variant = 'original-3d',
  size = 240,
  engravingNote = 'WASH IN CLOUDS · BLOOM IN SILK',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const arcTopId = `gb3d-top-${uid}`;
  const dropId = `gb3d-drop-${uid}`;
  const medallionGradId = `gb3d-medallion-${uid}`;
  const rimBevelId = `gb3d-rim-${uid}`;
  const goldGradId = `gb3d-gold-${uid}`;
  const tubPorcelainId = `gb3d-tub-${uid}`;
  const bubbleGlassId = `gb3d-bubble-${uid}`;

  const cx = 160;
  const cy = 160;

  // Authentic 24-scallop scalloped badge path + pearl dot centers
  const scallopCount = 24;
  const outerR = 148;
  const pearlR = 131;

  const scallopPath = Array.from({ length: scallopCount }, (_, i) => {
    const a1 = (i / scallopCount) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / scallopCount) * Math.PI * 2 - Math.PI / 2;
    const mid = (a1 + a2) / 2;
    const p1x = cx + Math.cos(a1) * (outerR - 6);
    const p1y = cy + Math.sin(a1) * (outerR - 6);
    const cpx = cx + Math.cos(mid) * (outerR + 8);
    const cpy = cy + Math.sin(mid) * (outerR + 8);
    const p2x = cx + Math.cos(a2) * (outerR - 6);
    const p2y = cy + Math.sin(a2) * (outerR - 6);
    return i === 0
      ? `M ${p1x.toFixed(2)},${p1y.toFixed(2)} Q ${cpx.toFixed(2)},${cpy.toFixed(2)} ${p2x.toFixed(2)},${p2y.toFixed(2)}`
      : `Q ${cpx.toFixed(2)},${cpy.toFixed(2)} ${p2x.toFixed(2)},${p2y.toFixed(2)}`;
  }).join(' ') + ' Z';

  const pearlDots = Array.from({ length: scallopCount }, (_, i) => {
    const a = ((i + 0.5) / scallopCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(a) * pearlR,
      y: cy + Math.sin(a) * pearlR,
    };
  });

  const config = {
    'original-3d': {
      medTop: '#CFE0DB',
      medMid: '#B7CECA',
      medBot: '#94B4AE',
      goldHi: '#F3D687',
      goldMid: '#B7923E',
      goldDeep: '#7A5B1C',
      tubHi: '#FFFFFF',
      tubMid: '#EFECE8',
      tubDeep: '#CFC6BE',
      pearlFill: '#FAF7F2',
      textInk: '#9E7B2E',
    },
    'atelier-gold': {
      medTop: '#24201E',
      medMid: '#181514',
      medBot: '#0F0D0C',
      goldHi: '#F6DB93',
      goldMid: '#C79B42',
      goldDeep: '#7A5B1E',
      tubHi: '#FFFFFF',
      tubMid: '#EAE4DC',
      tubDeep: '#BFB4A8',
      pearlFill: '#F6DB93',
      textInk: '#E7BF69',
    },
    'nocturne-crimson': {
      medTop: '#261419',
      medMid: '#170B0E',
      medBot: '#0D0608',
      goldHi: '#F293A2',
      goldMid: '#C24658',
      goldDeep: '#6B1825',
      tubHi: '#FFF5F7',
      tubMid: '#E6CFD4',
      tubDeep: '#B8949B',
      pearlFill: '#F8D4DA',
      textInk: '#F08394',
    },
    'laser-engraved': {
      medTop: 'rgba(122,82,54,0.06)',
      medMid: 'rgba(122,82,54,0.1)',
      medBot: 'rgba(90,58,36,0.14)',
      goldHi: '#7A5236',
      goldMid: '#5A3A24',
      goldDeep: '#3D2514',
      tubHi: '#EFE5DA',
      tubMid: '#D8C7B6',
      tubDeep: '#B39A82',
      pearlFill: '#F6EFE8',
      textInk: '#4A2F1D',
    },
    'wax-seal': {
      medTop: '#AF2C40',
      medMid: '#8F1E2F',
      medBot: '#61111D',
      goldHi: '#FCE2E6',
      goldMid: '#E8AEB7',
      goldDeep: '#B86A76',
      tubHi: '#FFF5F6',
      tubMid: '#EFD0D5',
      tubDeep: '#C9949D',
      pearlFill: '#FCE2E6',
      textInk: '#FCE2E6',
    },
    watermark: {
      medTop: 'transparent',
      medMid: 'transparent',
      medBot: 'transparent',
      goldHi: '#B7923E',
      goldMid: '#967227',
      goldDeep: '#6E5118',
      tubHi: 'transparent',
      tubMid: 'transparent',
      tubDeep: 'transparent',
      pearlFill: 'transparent',
      textInk: '#967227',
    },
  }[variant];

  const isWatermark = variant === 'watermark';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      role="img"
      aria-label="GentleBubble by AR 3D Porcelain Bathtub Artisan Medallion"
      className={`select-none ${isWatermark ? 'opacity-20' : ''} ${className}`}
    >
      <defs>
        <path id={arcTopId} d="M 60,152 A 100,100 0 0,1 260,152" />

        <filter id={dropId} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.28" />
          <feDropShadow dx="0" dy="-1" stdDeviation="1" floodColor="#FFFFFF" floodOpacity="0.35" />
        </filter>

        <radialGradient id={medallionGradId} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor={config.medTop} />
          <stop offset="55%" stopColor={config.medMid} />
          <stop offset="100%" stopColor={config.medBot} />
        </radialGradient>

        <linearGradient id={rimBevelId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.goldHi} />
          <stop offset="50%" stopColor={config.goldMid} />
          <stop offset="100%" stopColor={config.goldDeep} />
        </linearGradient>

        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={config.goldHi} />
          <stop offset="52%" stopColor={config.goldMid} />
          <stop offset="100%" stopColor={config.goldDeep} />
        </linearGradient>

        <linearGradient id={tubPorcelainId} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor={config.tubHi} />
          <stop offset="55%" stopColor={config.tubMid} />
          <stop offset="100%" stopColor={config.tubDeep} />
        </linearGradient>

        <radialGradient id={bubbleGlassId} cx="32%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#D8F3F0" stopOpacity="0.38" />
          <stop offset="82%" stopColor="#A6C8EB" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.72" />
        </radialGradient>
      </defs>

      <g filter={isWatermark ? undefined : `url(#${dropId})`}>
        {/* 3D Scalloped Outer Medallion */}
        <path
          d={scallopPath}
          fill={isWatermark ? 'transparent' : `url(#${medallionGradId})`}
          stroke={`url(#${rimBevelId})`}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Recessed Inner Chamfer Ring */}
        <circle
          cx={cx}
          cy={cy}
          r="116"
          fill="none"
          stroke={`url(#${rimBevelId})`}
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />

        {/* 24 Volumetric Pearl Dots Along Scallops */}
        {!isWatermark &&
          pearlDots.map((dot, idx) => (
            <circle
              key={idx}
              cx={dot.x}
              cy={dot.y}
              r="5.2"
              fill={config.pearlFill}
              stroke={config.goldDeep}
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          ))}

        {/* Arched Vintage Crest Title */}
        <text
          fill={`url(#${goldGradId})`}
          fontSize="14.2"
          fontWeight="600"
          letterSpacing="3"
          fontFamily="Cinzel, Playfair Display, Georgia, serif"
        >
          <textPath href={`#${arcTopId}`} startOffset="50%" textAnchor="middle">
            GENTLEBUBBLE
          </textPath>
        </text>

        {/* 3D Sculpted Porcelain Clawfoot Bathtub & Iridescent Soap Bubbles */}
        <g transform="translate(86, 86)">
          {/* Soft ambient foam bed along tub rim */}
          <ellipse cx="48" cy="31" rx="22" ry="7" fill="#FFFFFF" fillOpacity={isWatermark ? 0 : 0.72} />
          <ellipse cx="78" cy="30" rx="24" ry="8" fill="#FFFFFF" fillOpacity={isWatermark ? 0 : 0.8} />
          <ellipse cx="108" cy="27" rx="18" ry="6.5" fill="#FFFFFF" fillOpacity={isWatermark ? 0 : 0.75} />

          {/* Floating 3D Soap Bubbles with specular glaze highlights */}
          {[
            { x: 18, y: 12, r: 7.2 },
            { x: 35, y: 20, r: 4.5 },
            { x: 53, y: 15, r: 5.8 },
            { x: 86, y: 12, r: 6.4 },
            { x: 103, y: 19, r: 4.2 },
            { x: 124, y: 11, r: 5.5 },
          ].map((b, i) => (
            <g key={i}>
              <circle
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill={isWatermark ? 'transparent' : `url(#${bubbleGlassId})`}
                stroke={config.goldHi}
                strokeWidth="0.55"
                strokeOpacity="0.65"
              />
              {!isWatermark && (
                <ellipse
                  cx={b.x - b.r * 0.34}
                  cy={b.y - b.r * 0.34}
                  rx={b.r * 0.28}
                  ry={b.r * 0.16}
                  transform={`rotate(-35 ${b.x - b.r * 0.34} ${b.y - b.r * 0.34})`}
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                />
              )}
            </g>
          ))}

          {/* 3D Embossed Antique Gold Lion Claw Feet */}
          <path
            d="M 41,60 C 39,67 35,70 42,71 C 47,71 48,65 50,60 Z"
            fill={`url(#${goldGradId})`}
          />
          <path
            d="M 101,60 C 103,65 104,71 109,71 C 115,70 111,66 109,60 Z"
            fill={`url(#${goldGradId})`}
          />

          {/* 3D Glazed Porcelain Tub Body */}
          <path
            d="M 16,32 C 19,35 23,58 35,61 L 111,61 C 122,58 126,29 135,24 L 138,23 C 136,20 128,20 123,23 C 96,29 52,32 16,30 Z"
            fill={`url(#${tubPorcelainId})`}
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Specular ceramic rim highlight */}
          {!isWatermark && (
            <path
              d="M 24,36 C 48,39 94,37 125,29"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
          )}
        </g>

        {/* Extruded Vintage Classic Serif Wordmark: GENTLE BUBBLE */}
        <text
          x={cx}
          y="196"
          textAnchor="middle"
          fill={config.goldDeep}
          fillOpacity="0.48"
          fontSize="33"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="Playfair Display, Georgia, serif"
          transform="translate(0, 1.4)"
        >
          GENTLE
        </text>
        <text
          x={cx}
          y="196"
          textAnchor="middle"
          fill={`url(#${goldGradId})`}
          fontSize="33"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="Playfair Display, Georgia, serif"
        >
          GENTLE
        </text>

        <text
          x={cx}
          y="228"
          textAnchor="middle"
          fill={config.goldDeep}
          fillOpacity="0.48"
          fontSize="33"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="Playfair Display, Georgia, serif"
          transform="translate(0, 1.4)"
        >
          BUBBLE
        </text>
        <text
          x={cx}
          y="228"
          textAnchor="middle"
          fill={`url(#${goldGradId})`}
          fontSize="33"
          fontWeight="700"
          letterSpacing="2.2"
          fontFamily="Playfair Display, Georgia, serif"
        >
          BUBBLE
        </text>

        {/* Subordinate Delicate by AR */}
        <text
          x={cx}
          y="246"
          textAnchor="middle"
          fill={config.textInk}
          fontSize="6.4"
          fontWeight="500"
          letterSpacing="1.8"
          fontFamily="Cinzel, Georgia, serif"
          opacity="0.78"
        >
          BY AR · {engravingNote.toUpperCase()}
        </text>

        {/* Refined Cursive Script Calligraphic Signature */}
        <text
          x={cx}
          y="268"
          textAnchor="middle"
          fill={`url(#${goldGradId})`}
          fontSize="16"
          fontFamily="Pinyon Script, Playfair Display, Georgia, serif"
          opacity="0.94"
        >
          Artisanal Savonnerie
        </text>
      </g>
    </svg>
  );
};
