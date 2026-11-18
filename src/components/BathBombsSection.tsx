import React, { memo, useMemo, useState } from 'react';
import { ArrowUpDown, Check, Heart, Minus, Plus } from 'lucide-react';
import { SoapLineKey } from '../data/palette';
import {
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombPackTier,
  BRIGHT_BATH_BOMBS,
  DARK_BATH_BOMBS,
  HOLIDAY_BATH_BOMBS,
  NutrientFocusCategory,
} from '../data/bathBombs';
import { formatThb } from '../data/soaps';
import { useLanguage } from '../data/i18n';
import { getPoeticBombMood } from '../data/poeticMoods';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';
import { ApothecaryColophonBanner, VintageParchmentTicket } from './VintageApothecaryBanner';

type BombColumnFilter = 'parallel' | SoapLineKey;
type NutrientFilter = 'all' | NutrientFocusCategory;
type GoldFilter = 'all' | 'rose-gold' | 'yellow-gold';
type BombSortKey = 'edition' | 'brightening' | 'scent' | 'gold-leaf' | 'name';

interface BathBombsSectionProps {
  accentHex: string;
  accentTextHex?: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  activeLineFilter?: BombColumnFilter;
  onChangeLineFilter?: (next: BombColumnFilter) => void;
  onToggleWishlist: (id: string) => void;
  onOpenNutritionModal: (bombId: string) => void;
  onAddBombToBag: (
    bomb: BathBombCreation,
    quantity: number,
    packTier: BathBombPackTier,
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
  onSelectPackTier,
  onStepQty,
  onAdd,
}) => {
  const { lang, t } = useLanguage();
  const unitPrice = BATH_BOMB_PRICE_TIERS[packTier];
  const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
  const poeticMood = getPoeticBombMood(bomb, lang);
  const waterHueName = lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn;
  const highlights = lang === 'th' ? bomb.highlightsTh : bomb.highlightsEn;
  const heroActives = lang === 'th' ? bomb.heroActivesTh : bomb.heroActivesEn;
  const isRoseGold = bomb.edibleGoldLeaf === 'rose-gold';

  const finePrintText = `${heroActives} — ${highlights[0]} · ${highlights[1]}`;
  const craftSpecText = `${isRoseGold ? t.roseGoldLeafLabel : t.yellowGoldLeafLabel} · ${t.bathGroovesLabel}`;

  return (
    <article className="group relative cv-product-card">
      <div
        className="luxury-3d-card relative z-10 overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          onClick={onOpenNutrition}
          className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
        >
          <ResilientImage
            src={bomb.imageUrl}
            alt={bomb.imageAlt}
            fallbackTitle={title}
            fallbackGradient={bomb.fallbackGradient}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div aria-hidden="true" className="shimmer z-20" />
        </div>

        {/* Pure Mood, Bold Two-Line Accent Box & Reservation Frontstage */}
        <div className="p-3.5 sm:p-4 space-y-2.5">
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]">
              <span className="tabular-figures font-semibold">{bomb.editionNumber}</span>
              <span aria-hidden="true">·</span>
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full border border-[var(--border)] shrink-0"
                style={{ background: bomb.waterGradient }}
              />
              <span className="truncate max-w-[135px]">{waterHueName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-figures font-bold text-[var(--ink)]">
                {formatThb(unitPrice)}
              </span>
            </div>

            <h3
              onClick={onOpenNutrition}
              className="font-serif fluid-card-display font-bold text-[var(--ink)] truncate cursor-pointer hover:opacity-85 transition-opacity"
            >
              {title}
            </h3>
            <p className="text-xs font-semibold line-clamp-1" style={{ color: 'var(--accent)' }}>
              {poeticMood}
            </p>
          </div>

          <div className="pt-2.5 border-t border-[var(--border)] space-y-2.5">
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
              <div className="inline-flex items-center h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] px-1 shrink-0">
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
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
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
                className="luxury-3d-pill flex-1 h-8 px-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap min-w-0"
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

        {/* Recessed Antique Parchment Ticket Hiding Vitamin, Wine, Milk & Salt Provenance */}
        <VintageParchmentTicket
          assayCode={`${t.ledgerFolioPrefix} ${bomb.editionNumber} · ${waterHueName}`}
          finePrintText={finePrintText}
          craftSpecText={craftSpecText}
          soldCount={soldCount}
          soldUnitLabel={t.soldUnitLabel}
          ledgerActionLabel={t.ledgerActionLabel}
          onInspectLedger={onOpenNutrition}
        />
      </div>
    </article>
  );
});

BathBombCard.displayName = 'BathBombCard';

export const BathBombsSection: React.FC<BathBombsSectionProps> = memo(({
  accentHex,
  accentTextHex = '#261E14',
  wishlistIds,
  itemSoldDeltas = {},
  activeLineFilter,
  onChangeLineFilter,
  onToggleWishlist,
  onOpenNutritionModal,
  onAddBombToBag,
}) => {
  const { lang, t } = useLanguage();
  const [internalViewFilter, setInternalViewFilter] = useState<BombColumnFilter>('parallel');
  const viewFilter = activeLineFilter ?? internalViewFilter;
  const setViewFilter = (next: BombColumnFilter) => {
    setInternalViewFilter(next);
    onChangeLineFilter?.(next);
  };
  const [nutrientFilter, setNutrientFilter] = useState<NutrientFilter>('all');
  const [goldFilter, setGoldFilter] = useState<GoldFilter>('all');
  const [sortBy, setSortBy] = useState<BombSortKey>('edition');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [packTierMap, setPackTierMap] = useState<Record<string, BathBombPackTier>>({});
  const [addedId, setAddedId] = useState<string | null>(null);

  const NUTRIENT_FILTERS: { id: NutrientFilter; label: string }[] = [
    { id: 'all', label: t.bathFocusAll },
    { id: 'wine-vitamins', label: t.bathFocusWine },
    { id: 'milk-peptides', label: t.bathFocusMilk },
    { id: 'marine-tea', label: t.bathFocusMarine },
    { id: 'roots-salts', label: t.bathFocusRoots },
  ];

  const applyFilterAndSort = useMemo(() => {
    return (list: BathBombCreation[]) => {
      const filtered = list.filter((b) => {
        if (nutrientFilter !== 'all' && b.nutrientFocus !== nutrientFilter) return false;
        if (goldFilter !== 'all' && b.edibleGoldLeaf !== goldFilter) return false;
        return true;
      });
      if (sortBy === 'edition') return filtered;

      return [...filtered].sort((a, b) => {
        if (sortBy === 'brightening') return b.brighteningScore - a.brighteningScore;
        if (sortBy === 'scent') return b.scentIntensity - a.scentIntensity;
        if (sortBy === 'gold-leaf') {
          if (a.edibleGoldLeaf !== b.edibleGoldLeaf) {
            return a.edibleGoldLeaf === 'rose-gold' ? -1 : 1;
          }
          return 0;
        }
        const nameA = lang === 'th' ? a.nameTh : a.nameEn;
        const nameB = lang === 'th' ? b.nameTh : b.nameEn;
        return nameA.localeCompare(nameB, lang === 'th' ? 'th' : 'en');
      });
    };
  }, [nutrientFilter, goldFilter, sortBy, lang]);

  const darkBombs = applyFilterAndSort(DARK_BATH_BOMBS);
  const brightBombs = applyFilterAndSort(BRIGHT_BATH_BOMBS);
  const holidayBombs = applyFilterAndSort(HOLIDAY_BATH_BOMBS);
  const totalVisibleCount = darkBombs.length + brightBombs.length + holidayBombs.length;

  const handleAdd = (bomb: BathBombCreation) => {
    const qty = quantities[bomb.id] ?? 1;
    const tier = packTierMap[bomb.id] ?? 'single';
    onAddBombToBag(bomb, qty, tier);
    setAddedId(bomb.id);
    window.setTimeout(() => setAddedId(null), 1200);
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
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-14 space-y-7">
        <div className="space-y-4">
          <div className="luxury-3d-card px-5 py-4 bg-[var(--surface-card)]/94 backdrop-blur-md flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: accentHex }}>
                {t.bathCollectionEyebrow}
              </p>
              <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
                {t.bathCollectionHeading}
              </h2>
            </div>

            <div
              role="tablist"
              aria-label={t.bathCollectionHeading}
              className="luxury-3d-pill inline-flex flex-wrap items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)] self-start lg:self-end shrink-0"
            >
              {(
                [
                  { id: 'parallel', label: t.allLinesTab },
                  { id: 'dark', label: t.darkTab },
                  { id: 'bright', label: t.brightTab },
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

          {/* Nutrient Focus, Gold Leaf & Sort Toolbar */}
          <div className="luxury-3d-card px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[var(--surface-card)]/94">
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label={t.goldFilterAll}
                className="inline-flex items-center p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] shrink-0"
              >
                {(
                  [
                    { id: 'all', label: t.goldFilterAll },
                    { id: 'rose-gold', label: t.goldFilterRose },
                    { id: 'yellow-gold', label: t.goldFilterYellow },
                  ] as const
                ).map((opt) => {
                  const active = goldFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGoldFilter(opt.id)}
                      className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                      style={{
                        backgroundColor: active ? accentHex : 'transparent',
                        color: active ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {NUTRIENT_FILTERS.map((opt) => {
                  const selected = nutrientFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setNutrientFilter((curr) => (curr === opt.id ? 'all' : opt.id))
                      }
                      className="h-7 px-3 rounded-full border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      style={{
                        borderColor: selected ? accentHex : 'var(--border)',
                        backgroundColor: selected ? 'var(--surface)' : 'transparent',
                        color: selected ? accentHex : 'var(--muted)',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0">
              <span className="text-[11px] text-[var(--muted)] tabular-figures">
                {t.inventoryReadoutPrefix} <strong className="text-[var(--ink)]">{totalVisibleCount}</strong> {t.bathReadoutSuffix}
              </span>

              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--ink)] cursor-pointer">
                <ArrowUpDown className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                <span className="sr-only">{t.sortLabel}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as BombSortKey)}
                  aria-label={t.sortLabel}
                  className="bg-transparent text-xs font-medium text-[var(--ink)] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="edition">{t.sortEdition}</option>
                  <option value="brightening">{t.bathSortBrightening}</option>
                  <option value="scent">{t.sortScentDesc}</option>
                  <option value="gold-leaf">{t.sortGoldLeaf}</option>
                  <option value="name">{t.sortNameAsc}</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* 3 Parallel Vertical Columns (Dark | Bright | Holidays) */}
        {viewFilter === 'parallel' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-start">
            <div id="type-dark" className="space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-4 py-3 flex items-baseline justify-between gap-2 shadow-sm">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.darkColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures truncate">
                  {darkBombs.length} {t.bathBombsUnit} · {t.bathDarkColSub}
                </span>
              </div>
              <div className="space-y-5">{darkBombs.map((bomb) => renderCard(bomb))}</div>
            </div>

            <div id="type-bright" className="space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-4 py-3 flex items-baseline justify-between gap-2 shadow-sm">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.brightColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures truncate">
                  {brightBombs.length} {t.bathBombsUnit} · {t.bathBrightColSub}
                </span>
              </div>
              <div className="space-y-5">{brightBombs.map((bomb) => renderCard(bomb))}</div>
            </div>

            <div id="type-holiday" className="space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-4 py-3 flex items-baseline justify-between gap-2 shadow-sm">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.occasionsColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures truncate">
                  {holidayBombs.length} {t.bathBombsUnit} · {t.bathOccasionsColSub}
                </span>
              </div>
              <div className="space-y-5">{holidayBombs.map((bomb) => renderCard(bomb))}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-start">
            {(viewFilter === 'dark'
              ? darkBombs
              : viewFilter === 'bright'
                ? brightBombs
                : holidayBombs
            ).map((bomb) => renderCard(bomb))}
          </div>
        )}

        {/* Full-Width Antique Parchment Provenance Colophon Banner */}
        <ApothecaryColophonBanner
          mode="bath-bombs"
          accentHex={accentHex}
          onOpenSampleLedger={() => onOpenNutritionModal(BRIGHT_BATH_BOMBS[0].id)}
        />
      </div>
    </section>
  );
});

BathBombsSection.displayName = 'BathBombsSection';
