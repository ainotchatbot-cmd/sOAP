import React, { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LUXURY_FRUIT_DUOS_LINE, FruitDuoCreation } from '../data/fruitDuosCatalog';
import { formatThb } from '../data/soaps';
import { useLanguage } from '../data/i18n';

interface CategoryHoverPreviewProps {
  hoveredTab: string | null;
  accentHex: string;
  accentTextHex: string;
  onMouseEnterPreview: () => void;
  onMouseLeavePreview: () => void;
  onInspectSoap: (soapId: string) => void;
  onOpenFruitDuosTab: () => void;
}

const TOPIC_MATCHED_PAIRINGS: Record<string, { headlineEn: string; headlineTh: string; ids: [string, string, string] }> = {
  soaps: {
    headlineEn: 'Botanical Pairings · Mango Silk, Dead Sea Cacao & Festive Berry',
    headlineTh: 'กลิ่นแนะนำที่เข้ากัน · มะม่วงซิลค์ เดดซีช็อกโก และสตรอว์เบอร์รี่',
    ids: ['duo-mangifera-lumina', 'duo-abyssal-maris', 'duo-solstice-citrus-berry'],
  },
  'bath-bombs': {
    headlineEn: 'Soak Pairings · Dark Sea Mineral, Velvet Berry & Sunlit Mango',
    headlineTh: 'จับคู่สปาแช่ตัว · แร่ธาตุทะเลเดดซี สตรอว์เบอร์รี่ และมะม่วงซิลค์',
    ids: ['duo-abyssal-maris', 'duo-nocturne-fragaria', 'duo-mangifera-lumina'],
  },
  'fruit-duos': {
    headlineEn: 'Orchard & Sea Rituals · Alphonso Mango, Berry & Dead Sea Mud',
    headlineTh: 'สบู่ผลไม้และทะเลเดดซี · มะม่วงสุก สตรอว์เบอร์รี่ และโคลนเดดซีช็อกโก',
    ids: ['duo-solstice-citrus-berry', 'duo-abyssal-maris', 'duo-equinox-sargassum'],
  },
  'category-2': {
    headlineEn: 'Complete Library · Pair Full Collections with Orchard & Sea',
    headlineTh: 'คลังกลิ่นเพิ่มเติม · จับคู่กับสบู่ผลไม้และโคลนเดดซี',
    ids: ['duo-fragaria-alba', 'duo-abyssal-maris', 'duo-equinox-sargassum'],
  },
  medieval: {
    headlineEn: 'Medieval Chapter · Smoked Sea Brine, Dark Cacao & Spiced Berry',
    headlineTh: 'ยุคกลาง · โคลนเดดซี ดาร์กช็อกโก และสตรอว์เบอร์รี่สีโกเมน',
    ids: ['duo-abyssal-maris', 'duo-nocturne-fragaria', 'duo-equinox-sargassum'],
  },
  renaissance: {
    headlineEn: 'Renaissance Chapter · Sunlit Mango, Coastal Silk & Garnet Berry',
    headlineTh: 'เรอเนซองส์ · มะม่วงอัลฟองโซ แร่ธาตุเดดซี และสตรอว์เบอร์รี่',
    ids: ['duo-mangifera-lumina', 'duo-abyssal-maris', 'duo-nocturne-fragaria'],
  },
  baroque: {
    headlineEn: 'Baroque Chapter · Festive Citrus Berry, Dark Cacao & Soft Rose',
    headlineTh: 'บาโรก · ส้มแชมเปญ ดาร์กช็อกโกเดดซี และมาราสตรอว์เบอร์รี่',
    ids: ['duo-solstice-citrus-berry', 'duo-abyssal-maris', 'duo-fragaria-alba'],
  },
  romanticism: {
    headlineEn: 'Romanticism Chapter · Rose Strawberry, Velvet Mango & Sea Dew',
    headlineTh: 'โรแมนติก · สตรอว์เบอร์รี่สีชมพู มะม่วงละมุน และเกลือแร่เดดซี',
    ids: ['duo-fragaria-alba', 'duo-mangifera-lumina', 'duo-equinox-sargassum'],
  },
  enlightenment: {
    headlineEn: 'Enlightenment Chapter · Sunlit Amber, Spiced Berry & Sea Mineral',
    headlineTh: 'ภูมิธรรม · มะม่วงอำพัน สตรอว์เบอร์รี่ และแร่ธาตุเดดซี',
    ids: ['duo-mangifera-lumina', 'duo-nocturne-fragaria', 'duo-abyssal-maris'],
  },
};

export const CategoryHoverPreview: React.FC<CategoryHoverPreviewProps> = memo(({
  hoveredTab,
  accentHex,
  onMouseEnterPreview,
  onMouseLeavePreview,
  onInspectSoap,
  onOpenFruitDuosTab,
}) => {
  const { lang, t, getSoapDisplay } = useLanguage();
  const topicConfig = hoveredTab ? TOPIC_MATCHED_PAIRINGS[hoveredTab] ?? TOPIC_MATCHED_PAIRINGS.soaps : null;

  const cards = topicConfig
    ? topicConfig.ids
        .map((id) => LUXURY_FRUIT_DUOS_LINE.find((s) => s.id === id))
        .filter((item): item is FruitDuoCreation => Boolean(item))
    : [];

  return (
    <AnimatePresence>
      {hoveredTab && topicConfig && cards.length > 0 && (
        <motion.div
          key={hoveredTab}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={onMouseEnterPreview}
          onMouseLeave={onMouseLeavePreview}
          className="hidden md:block absolute left-0 right-0 top-full z-40 border-b border-[var(--border)] bg-[var(--surface-card)]/96 backdrop-blur-xl shadow-xl"
        >
          <div className="atelier-container py-3 space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                <span
                  className="text-[10.5px] font-bold tracking-[0.14em] uppercase shrink-0"
                  style={{ color: accentHex }}
                >
                  {t.hoverPreviewEyebrow}
                </span>
                <span aria-hidden="true" className="text-[var(--muted)]">·</span>
                <span className="text-xs font-medium text-[var(--ink)] truncate">
                  {lang === 'th' ? topicConfig.headlineTh : topicConfig.headlineEn}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenFruitDuosTab}
                className="text-xs font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer shrink-0"
                style={{ color: accentHex }}
              >
                <span>{t.hoverPreviewPairCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {cards.map((duo) => {
                const display = getSoapDisplay(duo);
                return (
                  <button
                    key={duo.id}
                    type="button"
                    onClick={() => onInspectSoap(duo.id)}
                    className="group/item flex items-center gap-3 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--ink)]/35 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-14 h-16 rounded-lg overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-card)]">
                      <img
                        src={duo.imageUrl}
                        alt={display.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: accentHex }}
                        >
                          {duo.colorway === 'bright'
                            ? t.brightColTitle
                            : duo.colorway === 'dark'
                              ? t.darkColTitle
                              : t.occasionsColTitle}
                        </span>
                        <span className="text-[10.5px] font-bold tabular-figures text-[var(--ink)]">
                          {formatThb(duo.priceUsd)}
                        </span>
                      </div>
                      <p className="font-serif text-xs font-semibold text-[var(--ink)] truncate">
                        {display.name}
                      </p>
                      <p className="text-[10.5px] text-[var(--muted)] truncate">
                        {display.scentMood}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

CategoryHoverPreview.displayName = 'CategoryHoverPreview';
