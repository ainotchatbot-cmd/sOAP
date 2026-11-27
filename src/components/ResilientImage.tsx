import React, { memo, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackGradient?: string;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = memo(({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle = 'GentleBubble by AR',
  fallbackGradient = 'from-[#F3EAE8] via-[#FAF7F5] to-[#EBDAD7]',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${fallbackGradient} text-[#725D63] p-6 text-center`}
      >
        <Sparkles className="w-6 h-6 mb-2 text-[#9E3B57]" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-serif text-lg text-[#2A1C20]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
});

ResilientImage.displayName = 'ResilientImage';
