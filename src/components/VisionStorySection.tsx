import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ATELIER_BRAND, ATELIER_MEDIA } from '../data/soaps';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { RedesignedLogoMotif } from './RedesignedLogoMotif';
import { CloudSheepMotif } from './CloudSheepMotif';
import { BrandWordmark } from './BrandWordmark';

interface VisionStorySectionProps {
  accentHex: string;
  isTwilight?: boolean;
}

export const VisionStorySection: React.FC<VisionStorySectionProps> = ({
  accentHex,
}) => {
  const { lang, t } = useLanguage();
  const [engravingText, setEngravingText] = useState('GENTLEBUBBLE BY AR');

  const founderDisplay =
    lang === 'th' ? ATELIER_BRAND.founderThaiName : ATELIER_BRAND.founderName;
  const sloganDisplay =
    lang === 'th' ? `${t.heroLine1} ${t.heroLine2}` : ATELIER_BRAND.slogan;

  return (
    <section
      id="atelier"
      className="relative z-10 border-b border-[var(--border)] bg-[var(--canvas)]/78 text-[var(--ink)] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-14 space-y-10">
        {/* Story of GentleBubble by AR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2.5">
              <p className="font-cursive text-2xl sm:text-3xl leading-none" style={{ color: accentHex }}>
                {t.cursiveTagline}
              </p>

              <h2 className="marshmallow-text text-3xl sm:text-4xl font-medium leading-[1.08] text-[var(--ink)] balance-text">
                <BrandWordmark accentHex={accentHex} />
              </h2>

              <p className="text-sm text-[var(--muted)]">
                {t.storyHandPoured}{' '}
                <span className="font-semibold text-[var(--ink)]">{founderDisplay}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{t.originLocation}</span>
              </p>
            </div>

            <div className="luxury-3d-card flex items-center gap-4 p-4">
              <CloudSheepMotif size={64} accentHex={accentHex} className="shrink-0" />
              <div className="space-y-0.5 min-w-0">
                <p className="font-serif text-lg font-medium text-[var(--ink)] truncate">
                  {sloganDisplay}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {founderDisplay} · {t.originLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="luxury-3d-card w-full flex flex-col overflow-hidden"
            >
              <div className="flex-1 min-h-[260px] lg:min-h-[340px] overflow-hidden bg-[var(--surface)]">
                <ResilientImage
                  src={ATELIER_MEDIA.founderIllustrationUrl}
                  alt="Editorial portrait illustration of founder Archawee Chatkul Na Ayutthaya"
                  fallbackTitle={founderDisplay}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface-card)] flex flex-wrap items-center justify-between gap-2 text-[var(--ink)]">
                <p className="font-serif text-lg font-medium">{founderDisplay}</p>
                <p className="font-cursive text-xl" style={{ color: accentHex }}>
                  {t.cursiveTagline}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wood Plate Emblem & Engraving */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-stretch pt-6 border-t border-[var(--border)]">
          <div className="luxury-3d-card md:col-span-5 overflow-hidden aspect-[4/3]">
            <ResilientImage
              src={ATELIER_MEDIA.vintageLaserSoapUrl}
              alt="Handcrafted walnut and teak wood soap plate engraved with GentleBubble emblem"
              fallbackTitle="GentleBubble by AR"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="luxury-3d-card md:col-span-7 flex flex-col justify-center gap-4 p-5">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0">
                <RedesignedLogoMotif
                  variant="original-3d"
                  size={136}
                  engravingNote={engravingText || 'GENTLEBUBBLE'}
                />
              </div>
              <div className="space-y-2 flex-1 w-full">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: accentHex }}>
                  {t.storyKeepsakeSeal}
                </p>
                <h3 className="marshmallow-text font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.storyCustomCrest}
                </h3>
                <input
                  type="text"
                  maxLength={24}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  aria-label={t.storyCustomCrest}
                  placeholder={t.storyPlaceholder}
                  className="w-full px-3.5 py-2 text-xs rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
