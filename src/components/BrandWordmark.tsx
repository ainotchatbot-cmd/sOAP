import React from 'react';

interface BrandWordmarkProps {
  className?: string;
  arClassName?: string;
  accentHex?: string;
}

/**
 * Renders "GentleBubble" in large display typography with a visibly smaller,
 * understated "by AR" signature.
 */
export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
  arClassName = '',
  accentHex,
}) => {
  return (
    <span className={`inline-flex items-baseline gap-1.5 font-serif tracking-tight ${className}`}>
      <span>GentleBubble</span>
      <span
        className={`font-sans font-normal tracking-[0.06em] opacity-80 ${arClassName}`}
        style={{
          fontSize: '0.48em',
          color: accentHex ?? 'var(--muted)',
        }}
      >
        by <span className="font-semibold tracking-[0.08em]">AR</span>
      </span>
    </span>
  );
};
