import React, { memo } from 'react';
import { Star } from 'lucide-react';
import { CUSTOMER_VOICES } from '../data/soaps';
import { REVIEWS_TH, useLanguage } from '../data/i18n';

interface ReviewsSectionProps {
  accentHex: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = memo(({ accentHex }) => {
  const { lang, t } = useLanguage();
  const voices = lang === 'th' ? REVIEWS_TH : CUSTOMER_VOICES;

  return (
    <section
      id="reviews"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-12 2xl:py-16 space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-5 py-3.5 flex flex-wrap items-baseline justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="marshmallow-text font-serif fluid-section-display font-medium text-[var(--ink)]">
              {t.reviewsHeading}
            </h2>
            <span className="text-xs font-medium tabular-figures" style={{ color: accentHex }}>
              {t.reviewsRating}
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">{t.reviewsVerified}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-7">
          {voices.map((voice, idx) => (
            <blockquote
              key={idx}
              className={`luxury-3d-card p-5 flex flex-col justify-between gap-3.5 ${
                idx === voices.length - 1 && voices.length % 2 === 1
                  ? 'sm:col-span-2 lg:col-span-1'
                  : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5 fill-current"
                      style={{ color: accentHex }}
                    />
                  ))}
                </div>
                <p className="font-serif text-base leading-snug text-[var(--ink)] line-clamp-2">
                  “{voice.quote}”
                </p>
              </div>

              <footer className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[var(--ink)] truncate">
                  {voice.author} · <span className="font-normal text-[var(--muted)]">{voice.city}</span>
                </span>
                <span className="truncate font-medium shrink-0" style={{ color: accentHex }}>
                  {voice.soapName}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
});

ReviewsSection.displayName = 'ReviewsSection';
