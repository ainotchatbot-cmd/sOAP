import React, { memo } from 'react';
import { FlaskConical, Sparkles } from 'lucide-react';
import { ATELIER_BRAND, ATELIER_MEDIA } from '../data/soaps';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';

interface VisionStorySectionProps {
  accentHex: string;
  isTwilight?: boolean;
}

export const VisionStorySection: React.FC<VisionStorySectionProps> = memo(({
  accentHex,
}) => {
  const { lang, t } = useLanguage();

  const founderDisplay =
    lang === 'th' ? ATELIER_BRAND.founderThaiName : ATELIER_BRAND.founderName;

  return (
    <section
      id="atelier"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-14">
        {/* 3-Column Leveled Showcase: Biotech Founder Story | Owner Portrait | Walnut Soap Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Biotech Engineer Founder & Hobbies Story */}
          <article className="luxury-3d-card p-6 sm:p-7 flex flex-col justify-between gap-5 h-full">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase"
                  style={{ color: accentHex }}
                >
                  {t.storyEyebrow}
                </p>
                <h2 className="marshmallow-text font-serif text-2xl sm:text-3xl font-medium leading-[1.15] text-[var(--ink)] balance-text">
                  {t.storyHeading}
                </h2>
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-3 text-sm leading-relaxed text-[var(--muted)]">
                <p>{t.storyParagraph1}</p>
                <p>{t.storyParagraph2}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] space-y-1.5">
              <p className="text-xs font-semibold text-[var(--ink)] flex items-center gap-2">
                <FlaskConical className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                <span>
                  {t.storyHandPoured} {founderDisplay}
                </span>
              </p>
              <p className="text-[11px] text-[var(--muted)]">{t.storyPillars}</p>
            </div>
          </article>

          {/* Card 2: Owner Illustration Portrait (Leveled Height) */}
          <article className="luxury-3d-card flex flex-col overflow-hidden h-full">
            <div className="relative flex-1 min-h-[300px] overflow-hidden bg-[var(--surface)]">
              <ResilientImage
                src={ATELIER_MEDIA.founderIllustrationUrl}
                alt={`Editorial portrait of founder ${founderDisplay}`}
                fallbackTitle={founderDisplay}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--surface-card)] space-y-0.5">
              <p className="font-serif text-lg font-medium text-[var(--ink)] truncate">
                {founderDisplay}
              </p>
              <p className="text-xs font-medium text-[var(--muted)] truncate">
                {t.storyRole}
              </p>
            </div>
          </article>

          {/* Card 3: Handcrafted Wooden Soap Board (Leveled Side-by-Side with Owner) */}
          <article className="luxury-3d-card flex flex-col overflow-hidden h-full">
            <div className="relative flex-1 min-h-[300px] overflow-hidden bg-[var(--surface)]">
              <ResilientImage
                src={ATELIER_MEDIA.vintageLaserSoapUrl}
                alt="Handcrafted walnut and teak wood soap board engraved with GentleBubble emblem"
                fallbackTitle="GentleBubble by AR Soap Board"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--surface-card)] space-y-0.5">
              <p className="font-serif text-lg font-medium text-[var(--ink)] truncate flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                <span className="truncate">{t.soapBoardTitle}</span>
              </p>
              <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                {t.soapBoardDesc}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
});

VisionStorySection.displayName = 'VisionStorySection';
