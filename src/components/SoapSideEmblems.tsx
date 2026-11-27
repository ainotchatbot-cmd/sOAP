import React, { memo } from 'react';
import { SoapSideBadgeSpec } from '../data/fruitDuosCatalog';
import { useLanguage } from '../data/i18n';

interface SoapSideEmblemsProps {
  badges: SoapSideBadgeSpec[];
  compact?: boolean;
}

const BadgeVectorIcon: React.FC<{ kind: SoapSideBadgeSpec['kind']; hex: string }> = ({
  kind,
  hex,
}) => {
  switch (kind) {
    case 'vit-c':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill={hex} fillOpacity="0.18" stroke={hex} strokeWidth="1.4" />
          <path
            d="M15.4 8.8A4.6 4.6 0 1 0 15.4 15.2"
            fill="none"
            stroke={hex}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <circle cx="17" cy="12" r="1.1" fill={hex} />
        </svg>
      );
    case 'salicylic':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <polygon
            points="12,2.8 19.8,7.3 19.8,16.7 12,21.2 4.2,16.7 4.2,7.3"
            fill={hex}
            fillOpacity="0.16"
            stroke={hex}
            strokeWidth="1.3"
          />
          <text
            x="12"
            y="15.3"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fontFamily="serif"
            fill={hex}
          >
            S
          </text>
        </svg>
      );
    case 'dead-sea':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill={hex} fillOpacity="0.2" stroke={hex} strokeWidth="1.3" />
          <path
            d="M5.5 13.2 C7.8 10.6, 10.2 15.2, 12.5 12.6 C14.5 10.4, 16.6 14.5, 18.5 12.2"
            fill="none"
            stroke={hex}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8.5 8.5 Q12 6 15.5 8.5"
            fill="none"
            stroke={hex}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'kojic':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="5"
            fill={hex}
            fillOpacity="0.16"
            stroke={hex}
            strokeWidth="1.3"
          />
          <text
            x="12"
            y="15.2"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="700"
            fontFamily="serif"
            fill={hex}
          >
            K
          </text>
        </svg>
      );
    case 'gold-leaf':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <path
            d="M12 3.2 L14.4 9.2 L20.6 11.4 L14.4 13.8 L12 20.4 L9.6 13.8 L3.4 11.4 L9.6 9.2 Z"
            fill={hex}
            fillOpacity="0.24"
            stroke={hex}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'souvenir':
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <polygon
            points="12,3.5 19.5,11 12,20.5 4.5,11"
            fill={hex}
            fillOpacity="0.18"
            stroke={hex}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="2.1" fill={hex} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill={hex} fillOpacity="0.16" stroke={hex} strokeWidth="1.3" />
          <path
            d="M8.5 14.5 L12 7.5 L15.5 14.5 Z"
            fill="none"
            stroke={hex}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

export const SoapSideEmblems: React.FC<SoapSideEmblemsProps> = memo(({ badges, compact = false }) => {
  const { lang } = useLanguage();
  const primary = badges.find((b) => b.position === 'left') ?? badges[0];
  const secondary = badges.find((b) => b.position === 'right');
  if (!primary) return null;

  const primaryLabel = lang === 'th' ? primary.shortLabelTh : primary.shortLabel;
  const secondaryLabel = secondary ? (lang === 'th' ? secondary.shortLabelTh : secondary.shortLabel) : null;

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-2.5 top-2.5 z-30 ${
          compact ? 'scale-90 origin-top-left' : ''
        }`}
      >
        <div className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-[var(--surface-card)]/90 backdrop-blur-md border border-white/45 shadow-sm">
          <BadgeVectorIcon kind={primary.kind} hex={primary.accentHex} />
          <span className="text-[10px] font-bold tracking-wide text-[var(--ink)] whitespace-nowrap tabular-figures">
            {primaryLabel}
          </span>
        </div>
      </div>

      {secondary && secondaryLabel && !compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-2.5 z-30"
        >
          <div className="inline-flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-full bg-[var(--surface-card)]/88 backdrop-blur-md border border-white/45 shadow-sm">
            <BadgeVectorIcon kind={secondary.kind} hex={secondary.accentHex} />
            <span className="text-[9.5px] font-semibold tracking-wide text-[var(--ink)]/90 whitespace-nowrap">
              {secondaryLabel}
            </span>
          </div>
        </div>
      )}
    </>
  );
});

SoapSideEmblems.displayName = 'SoapSideEmblems';
