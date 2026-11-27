import React, { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Eye, Heart, Minus, Plus, Sparkles, ZoomIn } from 'lucide-react';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import { SoapLineKey } from '../data/palette';
import {
  BRIGHT_5050_LINE,
  DARK_5050_LINE,
  formatThb,
  HOLIDAY_EDITION_LINE,
  MARBLE_CASSETTE_SETS,
  MarbleCassetteEdition,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import { getSoapActivePercentText, getSoapSideBadges } from '../data/fruitDuosCatalog';
import { useLanguage } from '../data/i18n';
import { getPoeticSoapMood } from '../data/poeticMoods';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';
import { InlayGlyph } from './InlayGlyph';
import { SoapSideEmblems } from './SoapSideEmblems';
import { VintageParchmentTicket } from './VintageApothecaryBanner';
import type { ZoomableImageTarget } from './ImageZoomModal';

type ViewColumnFilter = 'parallel' | SoapLineKey;

interface TopTenDuosSectionProps {
  accentHex: string;
  accentTextHex?: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  activeLineFilter?: ViewColumnFilter;
  isTvMode?: boolean;
  onChangeLineFilter?: (next: ViewColumnFilter) => void;
  onOpenCategoryTwo?: () => void;
  onToggleWishlist: (id: string) => void;
  onOpenPodium: (id: string) => void;
  onOpenBombNutrition?: (bombId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddToBag: (
    soap: SoapCreation,
    quantity: number,
    sizeOrSlice: boolean | SoapSizeTier,
    sourceEl?: HTMLElement | null,
  ) => void;
  onAddMarbleSuiteToBag?: (
    giftSet: MarbleCassetteEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
  ) => void;
}

interface LuxuryDuoCardProps {
  soap: SoapCreation;
  accentTextHex: string;
  isWishlisted: boolean;
  sizeTier: SoapSizeTier;
  qty: number;
  soldCount: number;
  justAdded: boolean;
  onToggleWishlist: () => void;
  onOpenPodium: () => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onOpenBombNutrition?: (bombId: string) => void;
  onSelectSizeTier: (tier: SoapSizeTier) => void;
  onStepQty: (delta: number) => void;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LuxuryDuoCard: React.FC<LuxuryDuoCardProps> = memo(({
  soap,
  accentTextHex,
  isWishlisted,
  sizeTier,
  qty,
  soldCount,
  justAdded,
  onToggleWishlist,
  onOpenPodium,
  onZoomImage,
  onSelectSizeTier,
  onStepQty,
  onAdd,
}) => {
  const { lang, t, getSoapDisplay } = useLanguage();
  const display = getSoapDisplay(soap);

  const unitPrice =
    sizeTier === 'small'
      ? soap.slice100gUsd
      : sizeTier === 'mega'
        ? soap.hugeBlockThb ?? SOAP_PRICE_TIERS.mega
        : soap.priceUsd;
  const crystalColor = soap.botanicalLayers.crystalColorHex;
  const poeticMood = getPoeticSoapMood(soap, lang, display.scentMood);
  const activeText = getSoapActivePercentText(soap, lang);

  return (
    <motion.article
      whileHover={SABLE_CARD_HOVER}
      className="group sable-motion-host relative cv-product-card"
    >
      <div
        className="luxury-3d-card relative z-10 overflow-hidden flex flex-col"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div
          onClick={onOpenPodium}
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

          {/* High-Contrast Bottom Scrim with Floating Core Spec */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
          />
          <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 text-white space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10.5px] text-white/90">
              <span className="inline-flex items-center gap-1 font-medium truncate">
                <span className="tabular-figures font-semibold">{soap.editionNumber}</span>
                <span aria-hidden="true">·</span>
                <InlayGlyph type={soap.luxuryInlay.type} size={11} />
                <span className="truncate">{display.inlayLabel}</span>
              </span>
              <span className="tabular-figures font-bold text-white shrink-0">
                {formatThb(unitPrice)}
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

        <div className="p-3 sm:p-3.5 space-y-2">
          {/* Uniform 3-Tier Pricing & Reserve Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1.5">
              <div
                role="group"
                aria-label={display.name}
                className="flex-1 grid grid-cols-3 p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[9.5px] lg:text-[10px] font-medium overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => onSelectSizeTier('small')}
                  className="px-1 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap truncate text-center tabular-figures"
                  style={{
                    backgroundColor: sizeTier === 'small' ? crystalColor : 'transparent',
                    color: sizeTier === 'small' ? '#FFFFFF' : 'var(--muted)',
                  }}
                >
                  {t.sizeSmall}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSizeTier('full')}
                  className="px-1 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap truncate text-center font-semibold tabular-figures"
                  style={{
                    backgroundColor: sizeTier === 'full' ? crystalColor : 'transparent',
                    color: sizeTier === 'full' ? '#FFFFFF' : 'var(--ink)',
                  }}
                >
                  {t.sizeFull}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSizeTier('mega')}
                  className="px-1 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap truncate text-center tabular-figures"
                  style={{
                    backgroundColor: sizeTier === 'mega' ? crystalColor : 'transparent',
                    color: sizeTier === 'mega' ? '#FFFFFF' : 'var(--muted)',
                  }}
                >
                  {t.sizeMega}
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onOpenPodium}
                  aria-label={`${t.inspectBtn} ${display.name}`}
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  aria-label={isWishlisted ? t.favRemove : t.favAdd}
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center border border-[var(--border)] rounded-full bg-[var(--surface)] h-9 sm:h-8 px-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onStepQty(-1)}
                  aria-label="-"
                  className="w-6 h-full flex items-center justify-center text-[var(--ink)] cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 text-xs font-medium tabular-figures text-[var(--ink)]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onStepQty(1)}
                  aria-label="+"
                  className="w-6 h-full flex items-center justify-center text-[var(--ink)] cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={onAdd}
                className="luxury-3d-pill flex-1 h-9 sm:h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: accentTextHex,
                }}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.reservedBtn}</span>
                  </>
                ) : (
                  <span className="tabular-figures">
                    {t.reserveBtn} · {formatThb(unitPrice * qty)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <VintageParchmentTicket
          assayCode={soap.editionNumber}
          finePrintText=""
          craftSpecText=""
          soldCount={soldCount}
          soldUnitLabel={t.soldUnitLabel}
          ledgerActionLabel={t.ledgerActionLabel}
          onInspectLedger={onOpenPodium}
        />
      </div>
    </motion.article>
  );
});

LuxuryDuoCard.displayName = 'LuxuryDuoCard';

export const TopTenDuosSection: React.FC<TopTenDuosSectionProps> = memo(({
  accentHex,
  accentTextHex = '#261E14',
  wishlistIds,
  itemSoldDeltas = {},
  activeLineFilter,
  isTvMode = false,
  onChangeLineFilter,
  onOpenCategoryTwo,
  onToggleWishlist,
  onOpenPodium,
  onOpenBombNutrition,
  onZoomImage,
  onAddToBag,
  onAddMarbleSuiteToBag,
}) => {
  const { lang, t, getCaseDisplay } = useLanguage();
  const [internalViewFilter, setInternalViewFilter] = useState<ViewColumnFilter>('parallel');
  const viewFilter = activeLineFilter ?? internalViewFilter;
  const setViewFilter = (next: ViewColumnFilter) => {
    setInternalViewFilter(next);
    onChangeLineFilter?.(next);
  };
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sizeTierMap, setSizeTierMap] = useState<Record<string, SoapSizeTier>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedBoxId, setAddedBoxId] = useState<string | null>(null);

  const isCappedToFeaturedSix = !isTvMode;

  const darkColumnSoaps = isCappedToFeaturedSix
    ? DARK_5050_LINE.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : DARK_5050_LINE;
  const brightColumnSoaps = isCappedToFeaturedSix
    ? BRIGHT_5050_LINE.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : BRIGHT_5050_LINE;
  const holidayColumnSoaps = isCappedToFeaturedSix
    ? HOLIDAY_EDITION_LINE.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : HOLIDAY_EDITION_LINE;

  const handleAdd = (soap: SoapCreation, e: React.MouseEvent<HTMLButtonElement>) => {
    const qty = quantities[soap.id] ?? 1;
    const sizeTier: SoapSizeTier = sizeTierMap[soap.id] ?? 'full';
    onAddToBag(soap, qty, sizeTier, e.currentTarget);
    setAddedId(soap.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  const handleQuickReserveMarbleBox = (box: MarbleCassetteEdition) => {
    const candle = getMatchingCandleForLine(box.stoneType);
    const candleName = lang === 'th' ? candle.nameTh : candle.nameEn;
    onAddMarbleSuiteToBag?.(
      box,
      lang === 'th'
        ? `บวบธรรมชาติ 1 ชิ้น + ${candleName}`
        : `1 Natural Loofah + ${candleName}`,
      'TV SHOWROOM RESERVE',
      box.imageUrl,
    );
    setAddedBoxId(box.id);
    window.setTimeout(() => setAddedBoxId(null), 1200);
  };

  const renderSoapCard = (soap: SoapCreation) => (
    <LuxuryDuoCard
      key={soap.id}
      soap={soap}
      accentTextHex={accentTextHex}
      isWishlisted={wishlistIds.includes(soap.id)}
      sizeTier={sizeTierMap[soap.id] ?? 'full'}
      qty={quantities[soap.id] ?? 1}
      soldCount={getDeterministicItemSoldBase(soap.id) + (itemSoldDeltas[soap.id] ?? 0)}
      justAdded={addedId === soap.id}
      onToggleWishlist={() => onToggleWishlist(soap.id)}
      onOpenPodium={() => onOpenPodium(soap.id)}
      onZoomImage={onZoomImage}
      onOpenBombNutrition={onOpenBombNutrition}
      onSelectSizeTier={(tier) =>
        setSizeTierMap((prev) => ({ ...prev, [soap.id]: tier }))
      }
      onStepQty={(delta) =>
        setQuantities((prev) => ({
          ...prev,
          [soap.id]: Math.max(1, Math.min(12, (prev[soap.id] ?? 1) + delta)),
        }))
      }
      onAdd={(e) => handleAdd(soap, e)}
    />
  );

  return (
    <section
      id="collection"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-7">
        {/* Clean Single Editorial Section Header */}
        <div className="border-b border-[var(--border)] pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: accentHex }}>
              {t.collectionEyebrow}
            </p>
            <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
              {t.collectionHeading}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end shrink-0">
            <div
              role="tablist"
              aria-label={t.collectionHeading}
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/90"
            >
              {(
                [
                  { id: 'parallel', label: t.allLinesTab },
                  { id: 'bright', label: t.brightTab },
                  { id: 'dark', label: t.darkTab },
                  { id: 'holiday', label: t.occasionsTab },
                ] as const
              ).map((tab) => {
                const isSelected = viewFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setViewFilter(tab.id)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: isSelected ? accentHex : 'transparent',
                      color: isSelected ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <a
              href="#gifting"
              className="text-xs font-semibold hover:underline transition-opacity whitespace-nowrap shrink-0"
              style={{ color: accentHex }}
            >
              {t.marbleCasesQuickTab} →
            </a>
          </div>
        </div>

        {/* Clean Symmetric 3-Column Grid: Bright Left · Dark Middle · Events Right (6 featured sets) */}
        {viewFilter === 'parallel' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 2xl:gap-8 items-start">
            <div id="type-bright" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.brightColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">{t.brightColSub}</span>
              </div>

              <div className="space-y-4">
                {brightColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>

            <div id="type-dark" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.darkColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">{t.darkColSub}</span>
              </div>

              <div className="space-y-4">
                {darkColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>

            <div id="type-holiday" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.occasionsColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">{t.occasionsColSub}</span>
              </div>

              <div className="space-y-4">
                {holidayColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[2400px]:grid-cols-4 gap-5 lg:gap-7 2xl:gap-9 items-start">
            {(viewFilter === 'dark'
              ? darkColumnSoaps
              : viewFilter === 'bright'
                ? brightColumnSoaps
                : holidayColumnSoaps
            ).map((soap) => renderSoapCard(soap))}
          </div>
        )}

        {/* Quiet Link to Extended Library */}
        {isCappedToFeaturedSix && onOpenCategoryTwo && (
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--muted)]">{t.featuredSixNotice}</p>
            <button
              type="button"
              onClick={onOpenCategoryTwo}
              className="text-xs font-semibold hover:underline cursor-pointer whitespace-nowrap self-start sm:self-auto"
              style={{ color: accentHex }}
            >
              {t.viewCategoryTwoCta} →
            </button>
          </div>
        )}

        {/* TV Showroom Companion: Marble Boxes + 2 Natural Loofahs */}
        {isTvMode && (
          <div className="pt-6 border-t border-[var(--border)] space-y-4">
            <div>
              <p
                className="text-[10.5px] font-bold tracking-[0.16em] uppercase inline-flex items-center gap-1.5"
                style={{ color: accentHex }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.tvSuiteBarEyebrow}</span>
              </p>
              <p className="text-xs text-[var(--muted)]">{t.tvSuiteBarDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MARBLE_CASSETTE_SETS.map((box) => {
                const cDisplay = getCaseDisplay(box);
                return (
                  <div
                    key={box.id}
                    className="luxury-3d-card flex items-center gap-3 p-3 bg-[var(--surface-card)]/92"
                  >
                    <img
                      src={box.imageUrl}
                      alt={cDisplay.name}
                      className="w-20 h-20 rounded-xl object-cover border border-[var(--border)] shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-serif text-sm font-bold text-[var(--ink)] truncate">
                        {cDisplay.shortTitle}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {t.soapsAnd2Loofahs}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleQuickReserveMarbleBox(box)}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer tabular-figures"
                        style={{ backgroundColor: accentHex, color: accentTextHex }}
                      >
                        {addedBoxId === box.id
                          ? t.reservedBtn
                          : `${t.reserveBtn} · ${formatThb(box.priceUsd)}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

TopTenDuosSection.displayName = 'TopTenDuosSection';
