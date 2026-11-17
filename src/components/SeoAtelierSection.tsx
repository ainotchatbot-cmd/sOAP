import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '../data/i18n';

interface SeoAtelierSectionProps {
  accentHex: string;
  onSelectMode?: (mode: 'soaps' | 'bath-bombs') => void;
}

export const SeoAtelierSection: React.FC<SeoAtelierSectionProps> = ({
  accentHex,
  onSelectMode,
}) => {
  const { t } = useLanguage();

  return (
    <section
      id="botanical-guide"
      aria-labelledby="seo-atelier-heading"
      className="relative z-10 border-t border-[var(--border)] bg-transparent text-[var(--ink)]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-12">
        <article className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/94 backdrop-blur-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div className="space-y-1.5">
              <p
                className="text-[11px] font-semibold tracking-[0.15em] uppercase inline-flex items-center gap-1.5"
                style={{ color: accentHex }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.seoGuideEyebrow}</span>
              </p>
              <h2
                id="seo-atelier-heading"
                className="font-serif text-2xl sm:text-3xl font-medium text-[var(--ink)] leading-snug"
              >
                {t.seoGuideTitle}
              </h2>
            </div>

            <nav
              aria-label="Botanical Catalog Links"
              className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--muted)] shrink-0"
            >
              <a
                href="#collection"
                onClick={() => onSelectMode?.('soaps')}
                className="hover:text-[var(--ink)] transition-colors underline underline-offset-4"
              >
                {t.modeSoapsBtn}
              </a>
              <a
                href="#collection"
                onClick={() => onSelectMode?.('bath-bombs')}
                className="hover:text-[var(--ink)] transition-colors underline underline-offset-4"
              >
                {t.modeBathBombsBtn}
              </a>
              <a
                href="#mailing-list"
                className="hover:text-[var(--ink)] transition-colors underline underline-offset-4"
              >
                {t.mailingEyebrow}
              </a>
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-[13px] text-[var(--muted)] leading-relaxed">
            <p>{t.seoGuideP1}</p>
            <p>{t.seoGuideP2}</p>
            <p>{t.seoGuideP3}</p>
          </div>
        </article>
      </div>
    </section>
  );
};
