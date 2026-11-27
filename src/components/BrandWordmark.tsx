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
    <span
      className={`inline-flex items-baseline gap-1 font-serif tracking-tight whitespace-nowrap shrink-0 leading-none ${className}`}
    >
      <span className="rainbow-sparkle-text font-semibold">GentleBubble</span>
      <span
        className={`font-sans font-medium tracking-[0.05em] whitespace-nowrap shrink-0 ${arClassName}`}
        style={{
          fontSize: '0.46em',
          color: accentHex ?? 'var(--muted)',
        }}
      >
        by <span className="font-bold tracking-[0.07em]">AR</span>
      </span>
    </span>
  );
};
