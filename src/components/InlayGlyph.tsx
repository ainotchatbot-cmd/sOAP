import React from 'react';
import { LuxuryInlaySpec } from '../data/soaps';

export const InlayGlyph: React.FC<{ type: LuxuryInlaySpec['type']; size?: number }> = ({
  type,
  size = 18,
}) => {
  switch (type) {
    case 'pearl':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="pearlGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#F2EADF" />
              <stop offset="100%" stopColor="#B8A99A" />
            </radialGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="7.5"
            fill="url(#pearlGrad)"
            stroke="#C9B79C"
            strokeWidth="0.9"
          />
          <ellipse
            cx="9.6"
            cy="9.2"
            rx="2"
            ry="1.2"
            transform="rotate(-24 9.6 9.2)"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </svg>
      );
    case 'gold-leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 14L10 6l5 3 4-3-2 9-6 3-6-4z"
            fill="#E7C678"
            stroke="#B5823B"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <path d="M9 11l3.5 1.5L16 9" stroke="#8C6423" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
      );
    case 'loofah':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="7.5"
            fill="#E8D9B8"
            fillOpacity="0.45"
            stroke="#B99C6B"
            strokeWidth="1"
          />
          <path
            d="M7 10c3-2 7 2 10 0M7 14c3 2 7-2 10 0M10 6.5c1.5 3.5-1.5 7.5 0 11M14 6.5c-1.5 3.5 1.5 7.5 0 11"
            stroke="#9C7F50"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'cosmetic-sponge':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.5 11.5C6.5 7.8 9 5.5 12 5.5s5.5 2.3 5.5 6c0 4-2 6.8-5.5 6.8s-5.5-2.8-5.5-6.8z"
            fill="#F5D3DC"
            fillOpacity="0.95"
            stroke="#C98A99"
            strokeWidth="1"
          />
          <circle cx="10" cy="10.2" r="0.7" fill="#9E6A78" opacity="0.65" />
          <circle cx="13.8" cy="11.6" r="0.65" fill="#9E6A78" opacity="0.65" />
          <circle cx="11.6" cy="14" r="0.75" fill="#9E6A78" opacity="0.65" />
        </svg>
      );
  }
};
