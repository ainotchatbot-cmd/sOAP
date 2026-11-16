import React, { memo, useState } from 'react';
import { Check, Eye, Heart, Minus, Plus } from 'lucide-react';
import { SoapLineKey } from '../data/palette';
import {
  BRIGHT_5050_LINE,
  DARK_5050_LINE,
  formatThb,
  getSoapGoldLeafType,
  HOLIDAY_EDITION_LINE,
  LuxuryInlayType,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import { INLAY_LABELS_TH, useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { InlayGlyph } from './InlayGlyph';
import { CloudSheepMotif } from './CloudSheepMotif';

type ViewColumnFilter = 'parallel' | SoapLineKey;
type InlayFilter = 'all' | LuxuryInlayType;

interface TopTenDuosSectionProps {
  accentHex: string;
  accentTextHex?: string;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onOpenPodium: (id: string) => void;
  onAddToBag: (
    soap: SoapCreation,
    quantity: number,
    sizeOrSlice: boolean | SoapSizeTier,
    sourceEl?: HTMLElement | null,
  ) => void;
}

interface LuxuryDuoCardProps {
  soap: SoapCreation;
  accentTextHex: string;
  isWishlisted: boolean;
  sizeTier: SoapSizeTier;
  qty: number;
  justAdded: boolean;
  onToggleWishlist: () => void;
  onOpenPodium: () => void;
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
  justAdded,
  onToggleWishlist,
  onOpenPodium,
  onSelectSizeTier,
  onStepQty,
  onAdd,
}) => {
  const { t, getSoapDisplay } = useLanguage();
  const display = getSoapDisplay(soap);

  const unitPrice =
    sizeTier === 'small'
      ? soap.slice100gUsd
      : sizeTier === 'mega'
        ? soap.hugeBlockThb ?? SOAP_PRICE_TIERS.mega
        : soap.priceUsd;
  const crystalColor = soap.botanicalLayers.crystalColorHex;
  const creamColor = soap.botanicalLayers.creamColorHex;
  const leafType = getSoapGoldLeafType(soap);
  const isRoseGold = leafType === 'rose-gold';

  return (
    <article className="group relative">
      <div
        className="luxury-3d-card relative z-10 overflow-hidden flex flex-col"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div
          onClick={onOpenPodium}
          className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
        >
          <ResilientImage
            src={soap.imageUrl}
            alt={soap.imageAlt}
            fallbackTitle={display.name}
            fallbackGradient={soap.fallbackGradient}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div aria-hidden="true" className="shimmer z-20" />
        </div>

        {/* Crisp Scannable Card Details Below Photo */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]">
              <span className="tabular-figures font-medium">{soap.editionNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: crystalColor }}
                />
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: creamColor }}
                />
              </span>
              <span className="truncate max-w-[140px]">{display.themeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-figures font-semibold text-[var(--ink)]">
                {formatThb(unitPrice)}
              </span>
            </div>

            <h4
              onClick={onOpenPodium}
              className="font-serif text-lg sm:text-xl leading-snug font-medium text-[var(--ink)] cursor-pointer hover:opacity-85 transition-opacity line-clamp-1"
            >
              {display.name}
            </h4>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]">
              <span className="truncate max-w-[165px]">{display.scentMood}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[var(--ink)] shrink-0">
                <InlayGlyph type={soap.luxuryInlay.type} size={13} />
                <span>{display.inlayLabel}</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--muted)] pt-0.5">
              <span className="inline-flex items-center gap-1 text-[var(--ink)] font-medium">
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: isRoseGold
                      ? 'linear-gradient(135deg, #FBE3DA, #C4715E)'
                      : 'linear-gradient(135deg, #FFF4BD, #C89620)',
                  }}
                />
                <span>{isRoseGold ? t.roseGoldLeafLabel : t.yellowGoldLeafLabel}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{t.diagonalGroovesLabel}</span>
            </div>
          </div>

          {/* Uniform 3-Tier Decoy Pricing & Reserve Controls */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
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
                  className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  aria-label={isWishlisted ? t.favRemove : t.favAdd}
                  className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center border border-[var(--border)] rounded-full bg-[var(--surface)] h-8 px-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onStepQty(-1)}
                  aria-label="-"
                  className="w-5 h-full flex items-center justify-center text-[var(--ink)] cursor-pointer"
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
                  className="w-5 h-full flex items-center justify-center text-[var(--ink)] cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={onAdd}
                className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
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
      </div>
    </article>
  );
});

LuxuryDuoCard.displayName = 'LuxuryDuoCard';

export const TopTenDuosSection: React.FC<TopTenDuosSectionProps> = memo(({
  accentHex,
  accentTextHex = '#261E14',
  wishlistIds,
  onToggleWishlist,
  onOpenPodium,
  onAddToBag,
}) => {
  const { lang, t } = useLanguage();
  const [viewFilter, setViewFilter] = useState<ViewColumnFilter>('parallel');
  const [inlayFilter, setInlayFilter] = useState<InlayFilter>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sizeTierMap, setSizeTierMap] = useState<Record<string, SoapSizeTier>>({});
  const [addedId, setAddedId] = useState<string | null>(null);

  const INLAY_FILTERS: { id: InlayFilter; label: string }[] = [
    { id: 'all', label: lang === 'th' ? 'ของขวัญในสบู่ทั้งหมด' : 'All Keepsakes' },
    { id: 'pearl', label: lang === 'th' ? INLAY_LABELS_TH.pearl : '1 Pearl' },
    { id: 'gold-leaf', label: lang === 'th' ? INLAY_LABELS_TH['gold-leaf'] : '24k Gold Leaf' },
    { id: 'loofah', label: lang === 'th' ? INLAY_LABELS_TH.loofah : 'Raw Loofah' },
    {
      id: 'cosmetic-sponge',
      label: lang === 'th' ? INLAY_LABELS_TH['cosmetic-sponge'] : 'Silk Sponge',
    },
  ];

  const filterByInlay = (list: SoapCreation[]) =>
    inlayFilter === 'all' ? list : list.filter((s) => s.luxuryInlay.type === inlayFilter);

  const darkColumnSoaps = filterByInlay(DARK_5050_LINE);
  const brightColumnSoaps = filterByInlay(BRIGHT_5050_LINE);
  const holidayColumnSoaps = filterByInlay(HOLIDAY_EDITION_LINE);

  const handleAdd = (soap: SoapCreation, e: React.MouseEvent<HTMLButtonElement>) => {
    const qty = quantities[soap.id] ?? 1;
    const sizeTier: SoapSizeTier = sizeTierMap[soap.id] ?? 'full';
    onAddToBag(soap, qty, sizeTier, e.currentTarget);
    setAddedId(soap.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  const renderSoapCard = (soap: SoapCreation) => (
    <LuxuryDuoCard
      key={soap.id}
      soap={soap}
      accentTextHex={accentTextHex}
      isWishlisted={wishlistIds.includes(soap.id)}
      sizeTier={sizeTierMap[soap.id] ?? 'full'}
      qty={quantities[soap.id] ?? 1}
      justAdded={addedId === soap.id}
      onToggleWishlist={() => onToggleWishlist(soap.id)}
      onOpenPodium={() => onOpenPodium(soap.id)}
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
      className="relative z-10 border-b border-[var(--border)] bg-[var(--canvas)]/76 text-[var(--ink)] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-14 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <CloudSheepMotif size={60} accentHex={accentHex} className="hidden sm:block shrink-0" />
              <div className="space-y-0.5">
                <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: accentHex }}>
                  {t.collectionEyebrow}
                </p>
                <h2 className="marshmallow-text font-serif text-3xl sm:text-4xl font-medium leading-[1.08] text-[var(--ink)] balance-text">
                  {t.collectionHeading}
                </h2>
              </div>
            </div>

            <div
              role="tablist"
              aria-label={t.collectionHeading}
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

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {INLAY_FILTERS.map((opt) => {
              const selected = inlayFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setInlayFilter((curr) => (curr === opt.id ? 'all' : opt.id))}
                  className="luxury-3d-pill h-8 px-3.5 rounded-full border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  style={{
                    borderColor: selected ? accentHex : 'var(--border)',
                    backgroundColor: selected ? 'var(--surface-card)' : 'var(--surface)',
                    color: selected ? accentHex : 'var(--muted)',
                  }}
                >
                  {opt.id !== 'all' && <InlayGlyph type={opt.id} size={13} />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Parallel Vertical Columns (Dark | Bright | Occasions) from 768px+ */}
        {viewFilter === 'parallel' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-start">
            {/* Vertical Column 1: 10 Dark Accents */}
            <div className="space-y-5">
              <div className="pb-2.5 border-b border-[var(--border)] flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.darkColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures">
                  {darkColumnSoaps.length} {t.barsUnit} · {t.darkColSub}
                </span>
              </div>

              <div className="space-y-5">
                {darkColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>

            {/* Vertical Column 2: 10 Bright Accents */}
            <div className="space-y-5">
              <div className="pb-2.5 border-b border-[var(--border)] flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.brightColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures">
                  {brightColumnSoaps.length} {t.barsUnit} · {t.brightColSub}
                </span>
              </div>

              <div className="space-y-5">
                {brightColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>

            {/* Vertical Column 3: 10 Occasions & Holidays */}
            <div className="space-y-5">
              <div className="pb-2.5 border-b border-[var(--border)] flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                  {t.occasionsColTitle}
                </h3>
                <span className="text-[11px] text-[var(--muted)] tabular-figures">
                  {holidayColumnSoaps.length} {t.barsUnit} · {t.occasionsColSub}
                </span>
              </div>

              <div className="space-y-5">
                {holidayColumnSoaps.map((soap) => renderSoapCard(soap))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-start">
            {(viewFilter === 'dark'
              ? darkColumnSoaps
              : viewFilter === 'bright'
                ? brightColumnSoaps
                : holidayColumnSoaps
            ).map((soap) => renderSoapCard(soap))}
          </div>
        )}
      </div>
    </section>
  );
});

TopTenDuosSection.displayName = 'TopTenDuosSection';
