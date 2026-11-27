import React, { useState } from 'react';

export type PackagingMarkerId =
  | 'split-5050'
  | 'collagen-1-2'
  | 'coffee-mg'
  | 'ginseng-root'
  | 'vit-cead'
  | 'pearl-minerals';

export interface PackagingMarkerSpec {
  id: PackagingMarkerId;
  shortTitle: string;
  specDetail: string;
}

export const PACKAGING_MARKER_SPECS: Record<PackagingMarkerId, PackagingMarkerSpec> = {
  'split-5050': {
    id: 'split-5050',
    shortTitle: 'Dual Botanical Pour',
    specDetail: 'Translucent Botanical Crystal Balanced with Whipped Organic Butter',
  },
  'collagen-1-2': {
    id: 'collagen-1-2',
    shortTitle: 'Collagen I + II',
    specDetail: 'Marine Type I & Hydrolyzed Type II Elasticity Complex',
  },
  'coffee-mg': {
    id: 'coffee-mg',
    shortTitle: 'Espresso & Magnesium',
    specDetail: 'Organic Arabica Coffee Bean, Cacao Nib & Chelated Magnesium',
  },
  'ginseng-root': {
    id: 'ginseng-root',
    shortTitle: 'Red Ginseng Root',
    specDetail: 'Botanical Ginseng Root Extract & Cacao Nectar Vitality',
  },
  'vit-cead': {
    id: 'vit-cead',
    shortTitle: 'Vitamins C · E · A · D',
    specDetail: 'Organic Avocado, Pomegranate & Fruit Radiance Vitamins',
  },
  'pearl-minerals': {
    id: 'pearl-minerals',
    shortTitle: 'Silk Amino & Coconut Cream',
    specDetail: 'Botanical Silk Amino Complex & Cold-Pressed Thai Coconut Cream',
  },
};

export const PackagingIconGlyph: React.FC<{
  id: PackagingMarkerId;
  accentHex: string;
  size?: number;
}> = ({ id, accentHex, size = 18 }) => {
  switch (id) {
    case 'split-5050':
      // Feminine dual crescent-petal botanical seal
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11.2 4.2C7.4 5.5 5 8.8 5 12.6c0 3.7 2.4 6.8 6.2 7.2V4.2z"
            fill={accentHex}
            fillOpacity="0.82"
          />
          <path
            d="M12.8 4.2c3.8 1.3 6.2 4.6 6.2 8.4 0 3.7-2.4 6.8-6.2 7.2V4.2z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'collagen-1-2':
      // Delicate intertwined silk ribbon double-helix
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7.5 4.2c0 4 9 4 9 7.8s-9 3.8-9 7.8M16.5 4.2c0 4-9 4-9 7.8s9 3.8 9 7.8"
            stroke={accentHex}
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8.2" r="1.1" fill="currentColor" />
          <circle cx="12" cy="15.8" r="1.1" fill="currentColor" />
        </svg>
      );
    case 'coffee-mg':
      // Feminine floral-crested roasted espresso bean
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse
            cx="12"
            cy="12"
            rx="5.5"
            ry="7.5"
            transform="rotate(24 12 12)"
            fill={accentHex}
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M10.8 5.5c-.6 3.5 1.8 7.5 1.5 13"
            stroke={accentHex}
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <circle cx="17.5" cy="6.5" r="1.3" fill={accentHex} />
        </svg>
      );
    case 'ginseng-root':
      // Delicate lotus blossom above botanical taproot
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5c-1.5 2-1.5 4 0 5.5 1.5-1.5 1.5-3.5 0-5.5z"
            fill={accentHex}
            fillOpacity="0.85"
          />
          <path
            d="M7 6.5c1.5.5 3.2 1.4 5 2.5 1.8-1.1 3.5-2 5-2.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M12 9c-1.6 3-2 6.5-4.2 11M12 9c1.5 3.2 2.2 6.6 3.8 10.5M12 11.5v9"
            stroke={accentHex}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'vit-cead':
      // Four-petal lotus jewel prism
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3l2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.6" fill={accentHex} fillOpacity="0.85" />
        </svg>
      );
    case 'pearl-minerals':
      // Luminous freshwater pearl dewdrop
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5C8.5 8 6.5 11.5 6.5 14.8a5.5 5.5 0 0 0 11 0C17.5 11.5 15.5 8 12 3.5z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="12" cy="14.8" r="2.7" fill={accentHex} />
          <circle cx="11.1" cy="13.8" r="0.85" fill="#FFFFFF" />
        </svg>
      );
  }
};

export const PackagingMarkerStrip: React.FC<{
  markers: PackagingMarkerId[];
  accentHex: string;
}> = ({ markers, accentHex }) => {
  const [hoveredId, setHoveredId] = useState<PackagingMarkerId | null>(null);

  return (
    <div className="relative flex items-center gap-2">
      {markers.map((markerId) => {
        const spec = PACKAGING_MARKER_SPECS[markerId];
        const active = hoveredId === markerId;
        return (
          <button
            key={markerId}
            type="button"
            onMouseEnter={() => setHoveredId(markerId)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(markerId)}
            onBlur={() => setHoveredId(null)}
            onClick={() => setHoveredId((prev) => (prev === markerId ? null : markerId))}
            aria-label={`${spec.shortTitle}: ${spec.specDetail}`}
            title={`${spec.shortTitle} — ${spec.specDetail}`}
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer bg-[var(--surface)]"
            style={{
              borderColor: active ? accentHex : 'var(--border)',
              color: active ? accentHex : 'var(--ink)',
            }}
          >
            <PackagingIconGlyph id={markerId} accentHex={accentHex} size={16} />
          </button>
        );
      })}

      {hoveredId && (
        <span
          role="status"
          className="ml-1 text-[11px] font-medium truncate max-w-[180px] sm:max-w-[230px]"
          style={{ color: accentHex }}
        >
          {PACKAGING_MARKER_SPECS[hoveredId].shortTitle}
        </span>
      )}
    </div>
  );
};
