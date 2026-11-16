import React, { useId } from 'react';

interface CloudSheepMotifProps {
  size?: number;
  withBubbles?: boolean;
  className?: string;
  accentHex?: string;
}

export const CloudSheepMotif: React.FC<CloudSheepMotifProps> = ({
  size = 84,
  withBubbles = true,
  className = '',
  accentHex = '#D4A85E',
}) => {
  const uid = useId().replace(/:/g, '');
  const woolGradId = `sheep-wool-${uid}`;
  const faceGradId = `sheep-face-${uid}`;
  const bubbleGradId = `sheep-bubble-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 120"
      role="img"
      aria-label="GentleBubble by AR Marshmallow Cloud Sheep"
      className={`select-none sheep-cloud-bob ${className}`}
    >
      <defs>
        <radialGradient id={woolGradId} cx="40%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="68%" stopColor="#FBF6EE" />
          <stop offset="100%" stopColor="#EADFD1" />
        </radialGradient>

        <radialGradient id={faceGradId} cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#7C5E4E" />
          <stop offset="70%" stopColor="#5D4437" />
          <stop offset="100%" stopColor="#432F25" />
        </radialGradient>

        <radialGradient id={bubbleGradId} cx="32%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="48%" stopColor="#B8EAFF" stopOpacity="0.4" />
          <stop offset="86%" stopColor="#FFD0E6" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.78" />
        </radialGradient>
      </defs>

      {/* Soft marshmallow floor puff */}
      <ellipse cx="70" cy="108" rx="40" ry="6.5" fill="rgba(160, 138, 118, 0.16)" />

      {/* Cute stubby biscuit hooves */}
      <rect x="46" y="88" width="10" height="17" rx="5" fill="#4A352A" />
      <rect x="64" y="90" width="10" height="16" rx="5" fill="#5D4437" />
      <rect x="82" y="89" width="10" height="16" rx="5" fill="#4A352A" />

      {/* Puffy Marshmallow Cloud-Wool Fleece Body */}
      <g fill={`url(#${woolGradId})`} stroke="rgba(180, 156, 132, 0.35)" strokeWidth="1.2">
        <circle cx="44" cy="64" r="20" />
        <circle cx="62" cy="48" r="22" />
        <circle cx="85" cy="52" r="21" />
        <circle cx="101" cy="68" r="18" />
        <circle cx="86" cy="81" r="19" />
        <circle cx="58" cy="80" r="20" />
        <circle cx="72" cy="68" r="22" stroke="none" />
      </g>

      {/* Fluffy Top Wool Tuft */}
      <g fill={`url(#${woolGradId})`} stroke="rgba(180, 156, 132, 0.3)" strokeWidth="1">
        <circle cx="34" cy="48" r="8" />
        <circle cx="44" cy="44" r="9.5" />
        <circle cx="54" cy="49" r="7.5" />
      </g>

      {/* Droopy Soft Ears */}
      <ellipse
        cx="25"
        cy="60"
        rx="8.5"
        ry="5.2"
        transform="rotate(-24 25 60)"
        fill="#594033"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="8.5"
        ry="5.2"
        transform="rotate(24 60 60)"
        fill="#594033"
      />

      {/* Serene Marshmallow Sheep Face */}
      <ellipse cx="43" cy="66" rx="16.5" ry="15" fill={`url(#${faceGradId})`} />

      {/* Little forehead puff */}
      <circle cx="43" cy="51" r="7.5" fill={`url(#${woolGradId})`} />
      <circle cx="36" cy="53" r="5.5" fill={`url(#${woolGradId})`} />
      <circle cx="50" cy="53" r="5.5" fill={`url(#${woolGradId})`} />

      {/* Calm Happy Closed Eyes & Rosy Blush */}
      <path
        d="M 33 65 Q 36 62 39 65"
        fill="none"
        stroke="#FFF6EC"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 47 65 Q 50 62 53 65"
        fill="none"
        stroke="#FFF6EC"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="69.5" rx="3.4" ry="2" fill="#F29EB0" opacity="0.72" />
      <ellipse cx="54" cy="69.5" rx="3.4" ry="2" fill="#F29EB0" opacity="0.72" />

      {/* Gentle tiny smile */}
      <path
        d="M 40.5 72 Q 43 74.5 45.5 72"
        fill="none"
        stroke="#FFF6EC"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Satin Neck Bell Accent */}
      <circle cx="46" cy="83" r="3.4" fill={accentHex} stroke="#FFFFFF" strokeWidth="0.9" />

      {/* Rising Mini Iridescent Soap Bubbles Beside Sheep */}
      {withBubbles && (
        <g>
          <circle
            cx="17"
            cy="38"
            r="6.5"
            fill={`url(#${bubbleGradId})`}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="0.8"
          />
          <ellipse
            cx="15"
            cy="35.8"
            rx="1.8"
            ry="1"
            transform="rotate(-35 15 35.8)"
            fill="#FFFFFF"
          />

          <circle
            cx="26"
            cy="22"
            r="9.2"
            fill={`url(#${bubbleGradId})`}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="0.8"
          />
          <ellipse
            cx="23"
            cy="19"
            rx="2.6"
            ry="1.3"
            transform="rotate(-35 23 19)"
            fill="#FFFFFF"
          />

          <circle
            cx="116"
            cy="36"
            r="5.2"
            fill={`url(#${bubbleGradId})`}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="0.7"
          />
        </g>
      )}
    </svg>
  );
};
