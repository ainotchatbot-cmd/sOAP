import React, { Suspense, useEffect, useRef, useState } from 'react';

interface LazyGallerySectionProps {
  id: string;
  minHeightClass?: string;
  rootMargin?: string;
  immediate?: boolean;
  children: React.ReactNode;
}

export function triggerRevealSection(targetSelector: string) {
  if (typeof window === 'undefined') return;
  const cleanId = targetSelector.replace(/^#/, '');
  window.dispatchEvent(new CustomEvent('atelier:reveal-section', { detail: { id: cleanId } }));
}

export const LazyGallerySection: React.FC<LazyGallerySectionProps> = ({
  id,
  minHeightClass = 'min-h-[360px]',
  rootMargin = '420px 0px',
  immediate = false,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(immediate);

  useEffect(() => {
    if (shouldRender) return;

    const currentHash = window.location.hash.replace(/^#/, '');
    if (currentHash === id) {
      setShouldRender(true);
      return;
    }

    const handleReveal = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id || detail.id === id || detail.id.startsWith('type-')) {
        setShouldRender(true);
      }
    };

    const handleHashChange = () => {
      const nextHash = window.location.hash.replace(/^#/, '');
      if (nextHash === id) {
        setShouldRender(true);
      }
    };

    window.addEventListener('atelier:reveal-section', handleReveal);
    window.addEventListener('hashchange', handleHashChange);

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return () => {
        window.removeEventListener('atelier:reveal-section', handleReveal);
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener('atelier:reveal-section', handleReveal);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [id, rootMargin, shouldRender]);

  const skeleton = (
    <div
      className={`max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 ${minHeightClass}`}
      aria-busy="true"
    >
      <div className="luxury-3d-card h-full min-h-[260px] p-6 bg-[var(--surface-card)]/75 animate-pulse flex flex-col justify-between gap-4">
        <div className="h-5 w-48 rounded bg-[var(--surface)]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          <div className="h-44 rounded-2xl bg-[var(--surface)]" />
          <div className="h-44 rounded-2xl bg-[var(--surface)] hidden md:block" />
          <div className="h-44 rounded-2xl bg-[var(--surface)] hidden md:block" />
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} id={shouldRender ? undefined : id} className="w-full">
      {shouldRender ? <Suspense fallback={skeleton}>{children}</Suspense> : skeleton}
    </div>
  );
};
