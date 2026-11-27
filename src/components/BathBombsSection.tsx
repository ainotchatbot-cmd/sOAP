import React, { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Minus, Plus, Sparkles, ZoomIn } from 'lucide-react';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import { SoapLineKey } from '../data/palette';
import {
  BATH_BOMB_MARBLE_CASES,
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombMarbleCaseEdition,
  BathBombPackTier,
  BRIGHT_BATH_BOMBS,
  DARK_BATH_BOMBS,
  HOLIDAY_BATH_BOMBS,
} from '../data/bathBombs';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import { formatThb } from '../data/soaps';
import { getBombActivePercentText, getBombSideBadges } from '../data/fruitDuosCatalog';
import { useLanguage } from '../data/i18n';
import { getPoeticBombMood } from '../data/poeticMoods';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';
import { SoapSideEmblems } from './SoapSideEmblems';
import { VintageParchmentTicket } from './VintageApothecaryBanner';
import type { ZoomableImageTarget } from './ImageZoomModal';

type BombColumnFilter = 'parallel' | SoapLineKey;

interface BathBombsSectionProps {
  accentHex: string;
  accentTextHex?: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  activeLineFilter?: BombColumnFilter;
  isTvMode?: boolean;
  onChangeLineFilter?: (next: BombColumnFilter) => void;
  onOpenCategoryTwo?: () => void;
  onToggleWishlist: (id: string) => void;
  onOpenNutritionModal: (bombId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddBombToBag: (
    bomb: BathBombCreation,
    quantity: number,
    packTier: BathBombPackTier,
  ) => void;
  onAddBombMarbleSuiteToBag?: (
    bombCase: BathBombMarbleCaseEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
  ) => void;
}

interface BathBombCardProps {
  bomb: BathBombCreation;
  accentTextHex: string;
  isWishlisted: boolean;
  packTier: BathBombPackTier;
  qty: number;
  soldCount: number;
  justAdded: boolean;
  onToggleWishlist: () => void;
  onOpenNutrition: () => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onSelectPackTier: (tier: BathBombPackTier) => void;
  onStepQty: (delta: number) => void;
  onAdd: () => void;
}

const BathBombCard: React.FC<BathBombCardProps> = memo(({
  bomb,
  accentTextHex,
  isWishlisted,
  packTier,
  qty,
  soldCount,
  justAdded,
  onToggleWishlist,
  onOpenNutrition,
  onZoomImage,
  onSelectPackTier,
  onStepQty,
  onAdd,
}) => {
  const { lang, t } = useLanguage();
  const unitPrice = BATH_BOMB_PRICE_TIERS[packTier];
  const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
  const poeticMood = getPoeticBombMood(bomb, lang);
  const waterHueName = lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn;
  const activeText = getBombActivePercentText(bomb, lang);

  return (
    <motion.article
      whileHover={SABLE_CARD_HOVER}
      className="group sable-motion-host relative cv-product-card"
    >
      <div
        className="luxury-3d-card relative z-10 overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          onClick={onOpenNutrition}
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

          {/* Floating Bottom Scrim & Core Data */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
          />
          <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 text-white space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10.5px] text-white/90">
              <span className="inline-flex items-center gap-1.5 truncate">
                <span className="tabular-figures font-semibold">{bomb.editionNumber}</span>
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                  style={{ background: bomb.waterGradient }}
                />
                <span className="truncate">{waterHueName}</span>
              </span>
              <span className="tabular-figures font-bold text-white shrink-0">
                {formatThb(unitPrice)}
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold leading-snug text-white truncate drop-shadow-sm">
              {title}
            </h3>

            <p className="text-[11px] font-semibold text-amber-200 tabular-figures line-clamp-1">
              {activeText}
            </p>
            <p className="text-[11px] text-white/85 line-clamp-1">{poeticMood}</p>
          </div>

          <div aria-hidden="true" className="shimmer z-20" />
        </div>

        <div className="p-3 sm:p-3.5 space-y-2">
          <div className="space-y-2.5">
            {/* Pack Selector */}
            <div
              role="group"
              aria-label={title}
              className="grid grid-cols-3 gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]"
            >
              {(
                [
                  { id: 'single', label: t.bathSinglePack },
                  { id: 'duo', label: t.bathDuoPack },
                  { id: 'coffer', label: t.bathCofferPack },
                ] as const
              ).map((tier) => {
                const selected = packTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onSelectPackTier(tier.id)}
                    className="py-1 px-1.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer tabular-figures whitespace-nowrap truncate"
                    style={{
                      backgroundColor: selected ? 'var(--accent)' : 'transparent',
                      color: selected ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            {/* Qty + Wishlist + Reserve */}
            <div className="flex items-center gap-1.5">
              <div className="inline-flex items-center h-9 sm:h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] px-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onStepQty(-1)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-4 text-center text-xs font-medium tabular-figures text-[var(--ink)]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onStepQty(1)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={onToggleWishlist}
                aria-label={isWishlisted ? t.favRemove : t.favAdd}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--muted)]'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={onAdd}
                className="luxury-3d-pill flex-1 h-9 sm:h-8 px-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap min-w-0"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: accentTextHex,
                }}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.reservedBtn}</span>
                  </>
                ) : (
                  <span className="tabular-figures truncate">
                    {t.reserveBtn} · {formatThb(unitPrice * qty)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <VintageParchmentTicket
          assayCode={bomb.editionNumber}
          finePrintText=""
          craftSpecText=""
          soldCount={soldCount}
          soldUnitLabel={t.soldUnitLabel}
          ledgerActionLabel={t.ledgerActionLabel}
          onInspectLedger={onOpenNutrition}
        />
      </div>
    </motion.article>
  );
});

BathBombCard.displayName = 'BathBombCard';

export const BathBombsSection: React.FC<BathBombsSectionProps> = memo(({
  accentHex,
  accentTextHex = '#261E14',
  wishlistIds,
  itemSoldDeltas = {},
  activeLineFilter,
  isTvMode = false,
  onChangeLineFilter,
  onOpenCategoryTwo,
  onToggleWishlist,
  onOpenNutritionModal,
  onZoomImage,
  onAddBombToBag,
  onAddBombMarbleSuiteToBag,
}) => {
  const { lang, t } = useLanguage();
  const [internalViewFilter, setInternalViewFilter] = useState<BombColumnFilter>('parallel');
  const viewFilter = activeLineFilter ?? internalViewFilter;
  const setViewFilter = (next: BombColumnFilter) => {
    setInternalViewFilter(next);
    onChangeLineFilter?.(next);
  };
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [packTierMap, setPackTierMap] = useState<Record<string, BathBombPackTier>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedCaseId, setAddedCaseId] = useState<string | null>(null);

  const isCappedToFeaturedSix = !isTvMode;

  const darkBombs = isCappedToFeaturedSix
    ? DARK_BATH_BOMBS.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : DARK_BATH_BOMBS;
  const brightBombs = isCappedToFeaturedSix
    ? BRIGHT_BATH_BOMBS.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : BRIGHT_BATH_BOMBS;
  const holidayBombs = isCappedToFeaturedSix
    ? HOLIDAY_BATH_BOMBS.slice(0, viewFilter === 'parallel' ? 2 : 6)
    : HOLIDAY_BATH_BOMBS;

  const handleAdd = (bomb: BathBombCreation) => {
    const qty = quantities[bomb.id] ?? 1;
    const tier = packTierMap[bomb.id] ?? 'single';
    onAddBombToBag(bomb, qty, tier);
    setAddedId(bomb.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  const handleQuickReserveBombCase = (bombCase: BathBombMarbleCaseEdition) => {
    const candle = getMatchingCandleForLine(bombCase.stoneType);
    const candleName = lang === 'th' ? candle.nameTh : candle.nameEn;
    onAddBombMarbleSuiteToBag?.(
      bombCase,
      lang === 'th'
        ? `บวบธรรมชาติ 1 ชิ้น + ${candleName}`
        : `1 Natural Loofah + ${candleName}`,
      'TV SHOWROOM RESERVE',
      bombCase.imageUrl,
    );
    setAddedCaseId(bombCase.id);
    window.setTimeout(() => setAddedCaseId(null), 1200);
  };

  const renderCard = (bomb: BathBombCreation) => (
    <BathBombCard
      key={bomb.id}
      bomb={bomb}
      accentTextHex={accentTextHex}
      isWishlisted={wishlistIds.includes(bomb.id)}
      packTier={packTierMap[bomb.id] ?? 'single'}
      qty={quantities[bomb.id] ?? 1}
      soldCount={getDeterministicItemSoldBase(bomb.id) + (itemSoldDeltas[bomb.id] ?? 0)}
      justAdded={addedId === bomb.id}
      onToggleWishlist={() => onToggleWishlist(bomb.id)}
      onOpenNutrition={() => onOpenNutritionModal(bomb.id)}
      onZoomImage={onZoomImage}
      onSelectPackTier={(tier) => setPackTierMap((prev) => ({ ...prev, [bomb.id]: tier }))}
      onStepQty={(delta) =>
        setQuantities((prev) => ({
          ...prev,
          [bomb.id]: Math.max(1, Math.min(12, (prev[bomb.id] ?? 1) + delta)),
        }))
      }
      onAdd={() => handleAdd(bomb)}
    />
  );

  return (
    <section
      id="collection"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-7">
        <div className="border-b border-[var(--border)] pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: accentHex }}>
              {t.bathCollectionEyebrow}
            </p>
            <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
              {t.bathCollectionHeading}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label={t.bathCollectionHeading}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/90 self-start lg:self-end shrink-0"
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
        </div>

        {/* Clean Symmetric 3-Column Grid: Bright Left · Dark Middle · Events Right (6 featured sets) */}
        {viewFilter === 'parallel' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 2xl:gap-8 items-start">
            <div id="type-bright" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.brightColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] truncate">{t.bathBrightColSub}</span>
              </div>
              <div className="space-y-4">{brightBombs.map((bomb) => renderCard(bomb))}</div>
            </div>

            <div id="type-dark" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.darkColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] truncate">{t.bathDarkColSub}</span>
              </div>
              <div className="space-y-4">{darkBombs.map((bomb) => renderCard(bomb))}</div>
            </div>

            <div id="type-holiday" className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.occasionsColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] truncate">{t.bathOccasionsColSub}</span>
              </div>
              <div className="space-y-4">{holidayBombs.map((bomb) => renderCard(bomb))}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[2400px]:grid-cols-4 gap-5 lg:gap-7 2xl:gap-9 items-start">
            {(viewFilter === 'dark'
              ? darkBombs
              : viewFilter === 'bright'
                ? brightBombs
                : holidayBombs
            ).map((bomb) => renderCard(bomb))}
          </div>
        )}

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

        {/* TV Showroom Companion: Bath Bomb Marble Boxes + 2 Natural Loofahs */}
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
              {BATH_BOMB_MARBLE_CASES.map((bombCase) => {
                const cTitle = lang === 'th' ? bombCase.titleTh : bombCase.titleEn;
                return (
                  <div
                    key={bombCase.id}
                    className="luxury-3d-card flex items-center gap-3 p-3 bg-[var(--surface-card)]/92"
                  >
                    <img
                      src={bombCase.imageUrl}
                      alt={cTitle}
                      className="w-20 h-20 rounded-xl object-cover border border-[var(--border)] shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-serif text-sm font-bold text-[var(--ink)] truncate">
                        {cTitle}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate">
                        {t.soapsAnd2Loofahs}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleQuickReserveBombCase(bombCase)}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer tabular-figures"
                        style={{ backgroundColor: accentHex, color: accentTextHex }}
                      >
                        {addedCaseId === bombCase.id
                          ? t.reservedBtn
                          : `${t.reserveBtn} · ${formatThb(bombCase.priceThb)}`}
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

BathBombsSection.displayName = 'BathBombsSection';
