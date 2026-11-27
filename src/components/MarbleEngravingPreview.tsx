import React, { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../data/i18n';

interface MarbleEngravingPreviewProps {
  text: string;
  enabled: boolean;
  accentHex: string;
  accentTextHex?: string;
}

type StoneFinish = 'white-calacatta' | 'dark-obsidian';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const MarbleEngravingPreview: React.FC<MarbleEngravingPreviewProps> = ({
  text,
  enabled,
  accentHex,
  accentTextHex = '#14100B',
}) => {
  const { t } = useLanguage();
  const [stoneFinish, setStoneFinish] = useState<StoneFinish>('dark-obsidian');

  const displayText = useMemo(() => {
    const cleaned = text.trim();
    if (!enabled) return '';
    return (cleaned || 'GENTLEBUBBLE BY AR').toUpperCase();
  }, [text, enabled]);

  // Split nicely into 1 or 2 crisp lines if text is longer than 18 characters
  const lines = useMemo(() => {
    if (!displayText) return [];
    if (displayText.length <= 18) return [displayText];
    const words = displayText.split(/\s+/);
    if (words.length === 1) {
      const mid = Math.ceil(displayText.length / 2);
      return [displayText.slice(0, mid), displayText.slice(mid)];
    }
    let line1 = '';
    let line2 = '';
    for (const word of words) {
      if ((line1 + ' ' + word).trim().length <= 18) {
        line1 = (line1 + ' ' + word).trim();
      } else {
        line2 = (line2 + ' ' + word).trim();
      }
    }
    return [line1, line2].filter(Boolean);
  }, [displayText]);

  // Dynamic CSS mask data URI built from crisp typography so CSS masks etch the actual soap surface layers
  const maskUrl = useMemo(() => {
    if (!enabled || lines.length === 0) return 'none';
    const fontSize = lines.length > 1 ? 23 : displayText.length > 14 ? 25 : 29;
    const textElements =
      lines.length === 1
        ? `<text x="210" y="76" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-weight="600" font-size="${fontSize}" letter-spacing="3.2" fill="white">${escapeXml(lines[0])}</text>`
        : `<text x="210" y="58" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-weight="600" font-size="${fontSize}" letter-spacing="2.8" fill="white">${escapeXml(lines[0])}</text>
           <text x="210" y="92" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-weight="600" font-size="${fontSize}" letter-spacing="2.8" fill="white">${escapeXml(lines[1] ?? '')}</text>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 144">
      <rect x="26" y="16" width="368" height="112" rx="16" fill="none" stroke="white" stroke-width="1.8" stroke-opacity="0.72" />
      <circle cx="42" cy="32" r="2.2" fill="white" fill-opacity="0.75" />
      <circle cx="378" cy="32" r="2.2" fill="white" fill-opacity="0.75" />
      <circle cx="42" cy="112" r="2.2" fill="white" fill-opacity="0.75" />
      <circle cx="378" cy="112" r="2.2" fill="white" fill-opacity="0.75" />
      ${textElements}
    </svg>`;

    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [enabled, lines, displayText.length]);

  const isWhiteStone = stoneFinish === 'white-calacatta';

  // Dual-formula pearlescent top-glaze + veined marble soap surface gradients
  const marbleBaseGradient = isWhiteStone
    ? `
      radial-gradient(circle at 22% 24%, rgba(255,255,255,0.92), transparent 45%),
      linear-gradient(118deg, rgba(214, 203, 190, 0.42) 0%, transparent 28%, rgba(162, 146, 128, 0.25) 33%, transparent 37%),
      linear-gradient(62deg, transparent 48%, rgba(145, 129, 110, 0.22) 51%, transparent 55%),
      linear-gradient(155deg, #FBF8F3 0%, #EFE9DF 54%, #E6DDD0 100%)
    `
    : `
      radial-gradient(circle at 20% 25%, rgba(255,255,255,0.12), transparent 46%),
      linear-gradient(120deg, transparent 22%, rgba(219, 197, 158, 0.28) 25%, transparent 29%),
      linear-gradient(58deg, transparent 58%, rgba(240, 224, 198, 0.22) 61%, transparent 65%),
      linear-gradient(155deg, #2C292A 0%, #1F1C1D 55%, #141213 100%)
    `;

  const carvedDepthFill = isWhiteStone
    ? 'linear-gradient(180deg, #6E6256 0%, #9D8F7F 75%, #C7BAA9 100%)'
    : 'linear-gradient(180deg, #090808 0%, #4E453D 68%, #D8C29E 100%)';

  const rimHighlightFill = isWhiteStone
    ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)'
    : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(246, 224, 184, 0.55) 100%)';

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)]">
          <Sparkles className="w-3 h-3" style={{ color: accentHex }} />
          <span>{t.marbleEtchingLabel}</span>
        </span>

        <div
          role="group"
          aria-label={t.marbleEtchingLabel}
          className="inline-flex items-center p-0.5 rounded-md border border-[var(--border)] bg-[var(--surface-card)] text-[10px] font-medium"
        >
          <button
            type="button"
            onClick={() => setStoneFinish('white-calacatta')}
            className="px-2 py-0.5 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: isWhiteStone ? accentHex : 'transparent',
              color: isWhiteStone ? accentTextHex : 'var(--muted)',
            }}
          >
            {t.marbleWhite}
          </button>
          <button
            type="button"
            onClick={() => setStoneFinish('dark-obsidian')}
            className="px-2 py-0.5 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: !isWhiteStone ? accentHex : 'transparent',
              color: !isWhiteStone ? accentTextHex : 'var(--muted)',
            }}
          >
            {t.marbleDark}
          </button>
        </div>
      </div>

      {/* Virtual Sculpted Dual-Formula Marble Soap Block */}
      <div
        className="relative h-28 w-full rounded-2xl overflow-hidden border shadow-inner select-none transition-all duration-300"
        style={{
          borderColor: isWhiteStone ? '#D8CEC0' : '#3B3635',
          background: marbleBaseGradient,
          boxShadow: isWhiteStone
            ? 'inset 0 2px 5px rgba(255,255,255,0.95), inset 0 -6px 12px rgba(130,115,96,0.18), 0 6px 14px rgba(31,27,24,0.06)'
            : 'inset 0 1px 4px rgba(255,255,255,0.16), inset 0 -8px 14px rgba(0,0,0,0.65), 0 8px 18px rgba(0,0,0,0.16)',
        }}
        aria-live="polite"
      >
        {/* Subtle Dual-Glaze Top Quartz Strip */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-5 opacity-45"
          style={{
            background: `linear-gradient(90deg, ${accentHex}38 0%, ${accentHex}14 55%, rgba(255,255,255,0.4) 100%)`,
            borderBottom: '1px solid rgba(255,255,255,0.35)',
          }}
        />

        {/* Specular Diagonal Marble Light Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(125deg, rgba(255,255,255,0.28) 0%, transparent 38%, rgba(255,255,255,0.06) 65%, transparent 100%)',
          }}
        />

        {enabled ? (
          <>
            {/* CSS Mask Layer 1: Beveled Rim Light Catch Inside Chiseled Letters */}
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-all duration-150"
              style={{
                background: rimHighlightFill,
                transform: 'translateY(1.25px)',
                maskImage: maskUrl,
                WebkitMaskImage: maskUrl,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
              }}
            />

            {/* CSS Mask Layer 2: Etched Recessed Mineral Cavity */}
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-all duration-150"
              style={{
                background: carvedDepthFill,
                transform: 'translateY(-0.5px)',
                maskImage: maskUrl,
                WebkitMaskImage: maskUrl,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
              }}
            />

            {/* CSS Mask Layer 3: Subtle Accent Mineral Gleam Inside Carving */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25 mix-blend-multiply transition-all duration-150"
              style={{
                backgroundColor: accentHex,
                maskImage: maskUrl,
                WebkitMaskImage: maskUrl,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
              }}
            />
            <span className="sr-only">
              Engraving preview on virtual {isWhiteStone ? 'white' : 'dark'} marble soap: {displayText}
            </span>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className={`text-[11px] font-medium ${
                isWhiteStone ? 'text-[#7B7165]' : 'text-[#A9A098]'
              }`}
            >
              {t.marbleUnengraved}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
