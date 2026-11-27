import React, { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Eye, Heart, Minus, Plus, Sparkles, ZoomIn } from 'lucide-react';
import {
  FruitDuoColorway,
  FruitDuoCreation,
  getSoapActivePercentText,
  getSoapSideBadges,
  LUXURY_FRUIT_DUOS_LINE,
} from '../data/fruitDuosCatalog';
import {
  formatThb,
  MARBLE_CASSETTE_SETS,
  MarbleCassetteEdition,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import { useLanguage } from '../data/i18n';
import { getPoeticSoapMood } from '../data/poeticMoods';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import { ResilientImage } from './ResilientImage';
import { SoapSideEmblems } from './SoapSideEmblems';
import { VintageParchmentTicket } from './VintageApothecaryBanner';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface LuxuryFruitDuosSectionProps {
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  isTvMode?: boolean;
  onToggleWishlist: (id: string) => void;
  onOpenPodium: (id: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onOpenBombNutrition?: (bombId: string) => void;
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

export const LuxuryFruitDuosSection: React.FC<LuxuryFruitDuosSectionProps> = memo(({
  accentHex,
  accentTextHex,
  wishlistIds,
  itemSoldDeltas = {},
  isTvMode = false,
  onToggleWishlist,
  onOpenPodium,
  onZoomImage,
  onAddToBag,
  onAddMarbleSuiteToBag,
}) => {
  const { lang, t, getSoapDisplay, getCaseDisplay } = useLanguage();
  const [colorFilter, setColorFilter] = useState<'all' | FruitDuoColorway>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sizeTierMap, setSizeTierMap] = useState<Record<string, SoapSizeTier>>({});
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedBoxId, setAddedBoxId] = useState<string | null>(null);

  const brightItems = LUXURY_FRUIT_DUOS_LINE.filter((s) => s.colorway === 'bright');
  const darkItems = LUXURY_FRUIT_DUOS_LINE.filter((s) => s.colorway === 'dark');
  const holidayItems = LUXURY_FRUIT_DUOS_LINE.filter((s) => s.colorway === 'holiday');

  const handleReserve = (duo: FruitDuoCreation, e: React.MouseEvent<HTMLButtonElement>) => {
    const qty = quantities[duo.id] ?? 1;
    const sizeTier: SoapSizeTier = sizeTierMap[duo.id] ?? 'full';
    onAddToBag(duo, qty, sizeTier, e.currentTarget);
    setAddedId(duo.id);
    window.setTimeout(() => setAddedId(null), 1100);
  };

  const handleQuickReserveBox = (box: MarbleCassetteEdition) => {
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

  const renderDuoCard = (duo: FruitDuoCreation) => {
    const display = getSoapDisplay(duo);
    const sizeTier = sizeTierMap[duo.id] ?? 'full';
    const qty = quantities[duo.id] ?? 1;
    const unitPrice =
      sizeTier === 'small'
        ? duo.slice100gUsd
        : sizeTier === 'mega'
          ? duo.hugeBlockThb ?? SOAP_PRICE_TIERS.mega
          : duo.priceUsd;
    const isWishlisted = wishlistIds.includes(duo.id);
    const soldCount = getDeterministicItemSoldBase(duo.id) + (itemSoldDeltas[duo.id] ?? 0);
    const sideBadges = getSoapSideBadges(duo);
    const crystalColor = duo.botanicalLayers.crystalColorHex;
    const poeticMood = getPoeticSoapMood(duo, lang, display.scentMood);
    const activeText = getSoapActivePercentText(duo, lang);

    return (
      <motion.article
        key={duo.id}
        whileHover={SABLE_CARD_HOVER}
        className="group sable-motion-host relative cv-product-card"
      >
        <div
          className="luxury-3d-card relative z-10 overflow-hidden flex flex-col"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            onClick={() => onOpenPodium(duo.id)}
            className="relative aspect-square w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
          >
            <ResilientImage
              src={duo.imageUrl}
              alt={duo.imageAlt}
              fallbackTitle={display.name}
              fallbackGradient={duo.fallbackGradient}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.024]"
            />
            <SoapSideEmblems badges={sideBadges} />

            {onZoomImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoomImage({
                    src: duo.imageUrl,
                    alt: duo.imageAlt,
                    title: display.name,
                    activeBadge: activeText,
                    fallbackGradient: duo.fallbackGradient,
                  });
                }}
                aria-label={`${t.zoom4kLabel} ${display.name}`}
                className="absolute top-2.5 right-2.5 z-30 px-2 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3 h-3" />
                <span>4K</span>
              </button>
            )}

            {/* Floating Core Data Over High-Contrast Scrim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
            />
            <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 text-white space-y-1">
              <div className="flex items-center justify-between gap-2 text-[10.5px] text-white/90">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <span className="font-semibold">{duo.editionNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{display.inlayLabel}</span>
                </span>
                <span className="tabular-figures font-bold text-white shrink-0">
                  {formatThb(unitPrice)}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold leading-snug text-white line-clamp-1 drop-shadow-sm">
                {display.name}
              </h3>

              <p className="text-[11px] font-semibold text-amber-200 tabular-figures line-clamp-1">
                {activeText}
              </p>
              <p className="text-[11px] text-white/85 line-clamp-1">{poeticMood}</p>
            </div>

            <div aria-hidden="true" className="shimmer z-20" />
          </div>

          <div className="p-3 sm:p-3.5 space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1.5">
                <div
                  role="group"
                  aria-label={display.name}
                  className="flex-1 grid grid-cols-3 p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[9.5px] lg:text-[10px] font-medium overflow-hidden"
                >
                  {(
                    [
                      { id: 'small' as const, label: t.sizeSmall },
                      { id: 'full' as const, label: t.sizeFull },
                      { id: 'mega' as const, label: t.sizeMega },
                    ]
                  ).map((tier) => {
                    const active = sizeTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() =>
                          setSizeTierMap((prev) => ({ ...prev, [duo.id]: tier.id }))
                        }
                        className="px-1 py-1 rounded-full cursor-pointer transition-colors whitespace-nowrap truncate text-center tabular-figures"
                        style={{
                          backgroundColor: active ? crystalColor : 'transparent',
                          color: active ? '#FFFFFF' : 'var(--muted)',
                        }}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenPodium(duo.id)}
                    aria-label={`${t.inspectBtn} ${display.name}`}
                    className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(duo.id)}
                    aria-label={isWishlisted ? t.favRemove : t.favAdd}
                    className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center border border-[var(--border)] rounded-full bg-[var(--surface)] h-8 px-1 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [duo.id]: Math.max(1, (prev[duo.id] ?? 1) - 1),
                      }))
                    }
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
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [duo.id]: Math.min(12, (prev[duo.id] ?? 1) + 1),
                      }))
                    }
                    aria-label="+"
                    className="w-6 h-full flex items-center justify-center text-[var(--ink)] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleReserve(duo, e)}
                  className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  {addedId === duo.id ? (
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
            assayCode={duo.editionNumber}
            finePrintText=""
            craftSpecText=""
            soldCount={soldCount}
            soldUnitLabel={t.soldUnitLabel}
            ledgerActionLabel={t.ledgerActionLabel}
            onInspectLedger={() => onOpenPodium(duo.id)}
          />
        </div>
      </motion.article>
    );
  };

  return (
    <section
      id="fruit-duos-collection"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-8">
        {/* Clean Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="space-y-1 max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: accentHex }}>
              {t.fruitDuosEyebrow}
            </p>
            <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
              {t.fruitDuosHeading}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              {t.fruitDuosSub}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={t.fruitDuosHeading}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/90 self-start lg:self-end shrink-0"
          >
            {(
              [
                { id: 'all', label: t.allLinesTab },
                { id: 'bright', label: t.brightTab },
                { id: 'dark', label: t.darkTab },
                { id: 'holiday', label: t.occasionsTab },
              ] as const
            ).map((tab) => {
              const selected = colorFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setColorFilter(tab.id)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
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

        {/* Clean Symmetric 3-Column Rhythm: Bright Left · Dark Middle · Events Right */}
        {colorFilter === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 2xl:gap-8 items-start">
            <div className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.brightColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">
                  {lang === 'th' ? 'มะม่วงสุกและสตรอว์เบอร์รี่' : 'Sunlit Mango & Berry'}
                </span>
              </div>
              <div className="space-y-4">{brightItems.map(renderDuoCard)}</div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.darkColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">
                  {lang === 'th' ? 'ดาร์กช็อกโกและโคลนเดดซี' : 'Dark Cacao & Sea Mineral'}
                </span>
              </div>
              <div className="space-y-4">{darkItems.map(renderDuoCard)}</div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                  {t.occasionsColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)]">
                  {lang === 'th' ? 'กาล่าผลไม้และเจลลี่เดดซี' : 'Festive Satin Duos'}
                </span>
              </div>
              <div className="space-y-4">{holidayItems.map(renderDuoCard)}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {(colorFilter === 'dark'
              ? darkItems
              : colorFilter === 'bright'
                ? brightItems
                : holidayItems
            ).map(renderDuoCard)}
          </div>
        )}

        {/* TV Showroom Companion: Marble Boxes + 1 Loofah + 1 Matching 50/50 Candle */}
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
                        onClick={() => handleQuickReserveBox(box)}
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

LuxuryFruitDuosSection.displayName = 'LuxuryFruitDuosSection';
