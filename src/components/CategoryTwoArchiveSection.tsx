import React, { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Eye, Heart, Sparkles, ZoomIn } from 'lucide-react';
import {
  BRIGHT_5050_LINE,
  DARK_5050_LINE,
  formatThb,
  HOLIDAY_EDITION_LINE,
  MARBLE_CASSETTE_SETS,
  MarbleCassetteEdition,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import {
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombPackTier,
  BRIGHT_BATH_BOMBS,
  DARK_BATH_BOMBS,
  HOLIDAY_BATH_BOMBS,
} from '../data/bathBombs';
import {
  getBombActivePercentText,
  getBombSideBadges,
  getSoapActivePercentText,
  getSoapSideBadges,
} from '../data/fruitDuosCatalog';
import { useLanguage } from '../data/i18n';
import { getPoeticBombMood, getPoeticSoapMood } from '../data/poeticMoods';
import { SoapLineKey } from '../data/palette';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import { ResilientImage } from './ResilientImage';
import { SoapSideEmblems } from './SoapSideEmblems';
import { VintageParchmentTicket } from './VintageApothecaryBanner';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface CategoryTwoArchiveSectionProps {
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  isTvMode?: boolean;
  onToggleWishlist: (id: string) => void;
  onOpenPodium: (soapId: string) => void;
  onOpenBombNutrition: (bombId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddSoapToBag: (
    soap: SoapCreation,
    quantity: number,
    sizeOrSlice: boolean | SoapSizeTier,
    sourceEl?: HTMLElement | null,
  ) => void;
  onAddBombToBag: (
    bomb: BathBombCreation,
    quantity: number,
    packTier: BathBombPackTier,
  ) => void;
  onAddMarbleSuiteToBag?: (
    giftSet: MarbleCassetteEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
  ) => void;
}

export const CategoryTwoArchiveSection: React.FC<CategoryTwoArchiveSectionProps> = memo(({
  accentHex,
  accentTextHex,
  wishlistIds,
  itemSoldDeltas = {},
  isTvMode = false,
  onToggleWishlist,
  onOpenPodium,
  onOpenBombNutrition,
  onZoomImage,
  onAddSoapToBag,
  onAddBombToBag,
  onAddMarbleSuiteToBag,
}) => {
  const { lang, t, getSoapDisplay, getCaseDisplay } = useLanguage();
  const [kindFilter, setKindFilter] = useState<'all' | 'soaps' | 'bath-bombs'>('all');
  const [lineFilter, setLineFilter] = useState<'all' | SoapLineKey>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Slide everything beyond the primary 2-per-line featured 6 sets cleanly into Category 2
  const overflowSoaps = useMemo(
    () => [
      ...DARK_5050_LINE.slice(2),
      ...BRIGHT_5050_LINE.slice(2),
      ...HOLIDAY_EDITION_LINE.slice(2),
    ],
    [],
  );

  const overflowBombs = useMemo(
    () => [
      ...DARK_BATH_BOMBS.slice(2),
      ...BRIGHT_BATH_BOMBS.slice(2),
      ...HOLIDAY_BATH_BOMBS.slice(2),
    ],
    [],
  );

  const visibleSoaps = useMemo(() => {
    if (kindFilter === 'bath-bombs') return [];
    return lineFilter === 'all'
      ? overflowSoaps
      : overflowSoaps.filter((s) => s.line === lineFilter);
  }, [kindFilter, lineFilter, overflowSoaps]);

  const visibleBombs = useMemo(() => {
    if (kindFilter === 'soaps') return [];
    return lineFilter === 'all'
      ? overflowBombs
      : overflowBombs.filter((b) => b.line === lineFilter);
  }, [kindFilter, lineFilter, overflowBombs]);

  const flashAdded = (id: string) => {
    setAddedId(id);
    window.setTimeout(() => setAddedId(null), 1100);
  };

  const renderSoapCard = (soap: SoapCreation) => {
    const display = getSoapDisplay(soap);
    const isWishlisted = wishlistIds.includes(soap.id);
    const poeticMood = getPoeticSoapMood(soap, lang, display.scentMood);
    const soldCount = getDeterministicItemSoldBase(soap.id) + (itemSoldDeltas[soap.id] ?? 0);

    const activeText = getSoapActivePercentText(soap, lang);

    return (
      <motion.article
        key={soap.id}
        whileHover={SABLE_CARD_HOVER}
        className="group sable-motion-host relative cv-product-card"
      >
        <div className="luxury-3d-card relative z-10 overflow-hidden flex flex-col">
          <div
            onClick={() => onOpenPodium(soap.id)}
            className="relative aspect-square w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
          >
            <ResilientImage
              src={soap.imageUrl}
              alt={soap.imageAlt}
              fallbackTitle={display.name}
              fallbackGradient={soap.fallbackGradient}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.024]"
            />
            <SoapSideEmblems badges={getSoapSideBadges(soap)} />

            {onZoomImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomImage({
                    src: soap.imageUrl,
                    alt: soap.imageAlt,
                    title: display.name,
                    activeBadge: activeText,
                    fallbackGradient: soap.fallbackGradient,
                  });
                }}
                aria-label={`${t.zoom4kLabel} ${display.name}`}
                className="absolute top-2.5 right-2.5 z-30 px-2 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3 h-3" />
                <span>4K</span>
              </button>
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
            />
            <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 text-white space-y-1">
              <div className="flex items-center justify-between gap-2 text-[10.5px] text-white/90">
                <span className="truncate font-medium">
                  <span className="font-semibold tabular-figures">{soap.editionNumber}</span> ·{' '}
                  {display.inlayLabel}
                </span>
                <span className="font-bold text-white tabular-figures shrink-0">
                  {formatThb(soap.priceUsd)}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold leading-snug text-white line-clamp-1 drop-shadow-sm">
                {display.name}
              </h4>
              <p className="text-[11px] font-semibold text-amber-200 tabular-figures line-clamp-1">
                {activeText}
              </p>
              <p className="text-[11px] text-white/85 line-clamp-1">{poeticMood}</p>
            </div>
            <div aria-hidden="true" className="shimmer z-20" />
          </div>

          <div className="p-3 sm:p-3.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenPodium(soap.id)}
                aria-label={`${t.inspectBtn} ${display.name}`}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(soap.id)}
                aria-label={isWishlisted ? t.favRemove : t.favAdd}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  onAddSoapToBag(soap, 1, 'full', e.currentTarget);
                  flashAdded(soap.id);
                }}
                className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                {addedId === soap.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.reservedBtn}</span>
                  </>
                ) : (
                  <span className="tabular-figures">
                    {t.reserveBtn} · {formatThb(soap.priceUsd)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <VintageParchmentTicket
            assayCode={soap.editionNumber}
            finePrintText=""
            craftSpecText=""
            soldCount={soldCount}
            soldUnitLabel={t.soldUnitLabel}
            ledgerActionLabel={t.ledgerActionLabel}
            onInspectLedger={() => onOpenPodium(soap.id)}
          />
        </div>
      </motion.article>
    );
  };

  const renderBombCard = (bomb: BathBombCreation) => {
    const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
    const poeticMood = getPoeticBombMood(bomb, lang);
    const waterHueName = lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn;
    const isWishlisted = wishlistIds.includes(bomb.id);
    const soldCount = getDeterministicItemSoldBase(bomb.id) + (itemSoldDeltas[bomb.id] ?? 0);

    const activeText = getBombActivePercentText(bomb, lang);

    return (
      <motion.article
        key={bomb.id}
        whileHover={SABLE_CARD_HOVER}
        className="group sable-motion-host relative cv-product-card"
      >
        <div className="luxury-3d-card relative z-10 overflow-hidden flex flex-col">
          <div
            onClick={() => onOpenBombNutrition(bomb.id)}
            className="relative aspect-square w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
          >
            <ResilientImage
              src={bomb.imageUrl}
              alt={bomb.imageAlt}
              fallbackTitle={title}
              fallbackGradient={bomb.fallbackGradient}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.024]"
            />
            <SoapSideEmblems badges={getBombSideBadges(bomb)} />

            {onZoomImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomImage({
                    src: bomb.imageUrl,
                    alt: bomb.imageAlt,
                    title,
                    activeBadge: activeText,
                    fallbackGradient: bomb.fallbackGradient,
                  });
                }}
                aria-label={`${t.zoom4kLabel} ${title}`}
                className="absolute top-2.5 right-2.5 z-30 px-2 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3 h-3" />
                <span>4K</span>
              </button>
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
            />
            <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 text-white space-y-1">
              <div className="flex items-center justify-between gap-2 text-[10.5px] text-white/90">
                <span className="truncate font-medium">
                  <span className="font-semibold tabular-figures">{bomb.editionNumber}</span> ·{' '}
                  {waterHueName}
                </span>
                <span className="font-bold text-white tabular-figures shrink-0">
                  {formatThb(BATH_BOMB_PRICE_TIERS.single)}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold leading-snug text-white line-clamp-1 drop-shadow-sm">
                {title}
              </h4>
              <p className="text-[11px] font-semibold text-amber-200 tabular-figures line-clamp-1">
                {activeText}
              </p>
              <p className="text-[11px] text-white/85 line-clamp-1">{poeticMood}</p>
            </div>
            <div aria-hidden="true" className="shimmer z-20" />
          </div>

          <div className="p-3 sm:p-3.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenBombNutrition(bomb.id)}
                aria-label={`${t.bathNutritionBtn} ${title}`}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleWishlist(bomb.id)}
                aria-label={isWishlisted ? t.favRemove : t.favAdd}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddBombToBag(bomb, 1, 'single');
                  flashAdded(bomb.id);
                }}
                className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                {addedId === bomb.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.reservedBtn}</span>
                  </>
                ) : (
                  <span className="tabular-figures">
                    {t.reserveBtn} · {formatThb(BATH_BOMB_PRICE_TIERS.single)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <VintageParchmentTicket
            assayCode={bomb.editionNumber}
            finePrintText=""
            craftSpecText=""
            soldCount={soldCount}
            soldUnitLabel={t.soldUnitLabel}
            ledgerActionLabel={t.ledgerActionLabel}
            onInspectLedger={() => onOpenBombNutrition(bomb.id)}
          />
        </div>
      </motion.article>
    );
  };

  return (
    <section
      id="category-2-archive"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-7">
        {/* Clean Unboxed Header & Hairline Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: accentHex }}>
                {t.categoryTwoEyebrow}
              </p>
              <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
                {t.categoryTwoHeading}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {t.categoryTwoSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end shrink-0">
              <div
                role="group"
                aria-label={t.categoryTwoHeading}
                className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/90"
              >
                {(
                  [
                    { id: 'all', label: lang === 'th' ? 'ทั้งหมด' : 'All' },
                    { id: 'soaps', label: t.modeSoapsBtn },
                    { id: 'bath-bombs', label: t.modeBathBombsBtn },
                  ] as const
                ).map((tab) => {
                  const selected = kindFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setKindFilter(tab.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                      style={{
                        backgroundColor: selected ? accentHex : 'transparent',
                        color: selected ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div
                role="group"
                aria-label={t.allLinesTab}
                className="inline-flex items-center gap-1 text-xs"
              >
                {(
                  [
                    { id: 'all', label: t.allLinesTab },
                    { id: 'bright', label: t.brightColTitle },
                    { id: 'dark', label: t.darkColTitle },
                    { id: 'holiday', label: t.occasionsColTitle },
                  ] as const
                ).map((tab) => {
                  const selected = lineFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setLineFilter(tab.id)}
                      className="px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                      style={{
                        backgroundColor: selected ? accentHex : 'transparent',
                        color: selected ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Overflow Bar Soaps (Bright Left · Dark Middle · Events Right when All) */}
        {visibleSoaps.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between gap-2 border-b border-[var(--border)] pb-2">
              <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                {t.modeSoapsBtn}
              </h3>
              <span className="text-xs text-[var(--muted)] tabular-figures">
                {visibleSoaps.length} {t.barsUnit} · {t.sizeFull}
              </span>
            </div>

            {lineFilter === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.brightColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleSoaps.filter((s) => s.line === 'bright').length} {t.barsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleSoaps.filter((s) => s.line === 'bright').map(renderSoapCard)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.darkColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleSoaps.filter((s) => s.line === 'dark').length} {t.barsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleSoaps.filter((s) => s.line === 'dark').map(renderSoapCard)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.occasionsColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleSoaps.filter((s) => s.line === 'holiday').length} {t.barsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleSoaps.filter((s) => s.line === 'holiday').map(renderSoapCard)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 items-start">
                {visibleSoaps.map(renderSoapCard)}
              </div>
            )}
          </div>
        )}

        {/* Overflow Bath Bombs (Bright Left · Dark Middle · Events Right when All) */}
        {visibleBombs.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-baseline justify-between gap-2 border-b border-[var(--border)] pb-2">
              <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                {t.modeBathBombsBtn}
              </h3>
              <span className="text-xs text-[var(--muted)] tabular-figures">
                {visibleBombs.length} {t.bathBombsUnit} · {t.bathSinglePack}
              </span>
            </div>

            {lineFilter === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.brightColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleBombs.filter((b) => b.line === 'bright').length} {t.bathBombsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleBombs.filter((b) => b.line === 'bright').map(renderBombCard)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.darkColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleBombs.filter((b) => b.line === 'dark').length} {t.bathBombsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleBombs.filter((b) => b.line === 'dark').map(renderBombCard)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xl font-medium text-[var(--ink)]">
                      {t.occasionsColTitle}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-figures">
                      {visibleBombs.filter((b) => b.line === 'holiday').length} {t.bathBombsUnit}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {visibleBombs.filter((b) => b.line === 'holiday').map(renderBombCard)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 items-start">
                {visibleBombs.map(renderBombCard)}
              </div>
            )}
          </div>
        )}

        {/* Roman-Grooved Marble Boxes + 1 Natural Loofah + 1 Matching 50/50 Candle Underneath Category 2 */}
        <div className="pt-6 border-t border-[var(--border)] space-y-4">
          <div className="space-y-1">
            <p
              className="text-[10.5px] font-bold tracking-[0.16em] uppercase inline-flex items-center gap-1.5"
              style={{ color: accentHex }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.casesEyebrow}</span>
            </p>
            <p className="text-xs text-[var(--muted)]">
              {isTvMode ? t.tvSuiteBarDesc : t.casesSubSummary}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MARBLE_CASSETTE_SETS.map((box) => {
              const cDisplay = getCaseDisplay(box);
              const matchingCandle = getMatchingCandleForLine(box.stoneType);
              const candleName = lang === 'th' ? matchingCandle.nameTh : matchingCandle.nameEn;
              return (
                <div
                  key={box.id}
                  className="luxury-3d-card flex items-center gap-3 p-3 bg-[var(--surface-card)]/92"
                >
                  <button
                    type="button"
                    onClick={() =>
                      onZoomImage?.({
                        src: box.imageUrl,
                        alt: cDisplay.name,
                        title: cDisplay.shortTitle,
                        activeBadge: t.soapsAnd2Loofahs,
                      })
                    }
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 cursor-pointer group/boximg"
                    aria-label={`${t.zoom4kLabel} ${cDisplay.shortTitle}`}
                  >
                    <img
                      src={box.imageUrl}
                      alt={cDisplay.name}
                      className="w-full h-full object-cover"
                    />
                    {onZoomImage && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold">
                        4K
                      </span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-serif text-sm font-bold text-[var(--ink)] truncate">
                      {cDisplay.shortTitle}
                    </p>
                    <p className="text-[10.5px] text-[var(--muted)] truncate">
                      {t.soapsAnd2Loofahs}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onAddMarbleSuiteToBag?.(
                          box,
                          lang === 'th'
                            ? `บวบธรรมชาติ 1 ชิ้น + ${candleName} · ริบบิ้นซาติน`
                            : `1 Natural Loofah + ${candleName} · Satin Ribbon`,
                          'ROMAN MARBLE SUITE',
                          box.imageUrl,
                        );
                        flashAdded(box.id);
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer tabular-figures"
                      style={{ backgroundColor: accentHex, color: accentTextHex }}
                    >
                      {addedId === box.id
                        ? t.reservedBtn
                        : `${t.reserveBtn} · ${formatThb(box.priceUsd)}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

CategoryTwoArchiveSection.displayName = 'CategoryTwoArchiveSection';
