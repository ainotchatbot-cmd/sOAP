import React, { memo, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Flame,
  Gift,
  Heart,
  Search,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import type { User } from '../firebase';
import {
  formatThb,
  LOOFAH_SCRUB_OPTIONS,
  RIBBON_SEAL_OPTIONS,
} from '../data/soaps';
import { LOOFAH_TH, RIBBON_TH, useLanguage } from '../data/i18n';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import {
  ART_ERA_BY_ID,
  ART_ERAS,
  ArtEraId,
  VAULT_MARBLE_BOXES,
  VAULT_PAIR_BY_ID,
  VAULT_PAIRED_FORMULATIONS,
  VAULT_PRICING,
  VaultLineFilterId,
  VaultMarbleBoxEdition,
  VaultPairedFormulation,
} from '../data/memberVaultCatalog';
import { getVaultActivePercentText, getVaultPairSideBadges } from '../data/fruitDuosCatalog';
import { getMatchingCandleForLine, MARBLE_CASE_SUITE_IMAGE_URL } from '../data/aromaticCandles';
import { ResilientImage } from './ResilientImage';
import { SoapSideEmblems } from './SoapSideEmblems';
import { MarbleBoxRibbonMockup } from './MarbleBoxRibbonMockup';
import { VintageParchmentTicket } from './VintageApothecaryBanner';
import { SABLE_CARD_HOVER, SABLE_EASE } from '../utils/sableMotion';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface SecretVaultSectionProps {
  activeEra: ArtEraId;
  user: User | null;
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  externalInspectedPair?: VaultPairedFormulation | null;
  isTvMode?: boolean;
  onClearExternalInspectedPair?: () => void;
  onSelectEra?: (era: ArtEraId) => void;
  onSignIn: () => Promise<void> | void;
  onToggleWishlist: (itemId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddVaultToBag: (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => void;
  onAddVaultMarbleBoxToBag: (
    box: VaultMarbleBoxEdition,
    ribbonAndLoofahs: string,
    engravingNote: string,
  ) => void;
}

const LoofahScrubSwatch: React.FC<{ swatchHex: string }> = ({ swatchHex }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `vault-lufa-${swatchHex.replace('#', '')}-${uid}`;
  return (
    <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.85" />
          <stop offset="55%" stopColor={swatchHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6D5E4C" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="19"
        fill={`url(#${gradId})`}
        stroke="rgba(120,104,84,0.4)"
        strokeWidth="1.2"
      />
      <g stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" fill="none">
        <circle cx="24" cy="24" r="13" strokeDasharray="2 2" />
        <path d="M12 18 Q24 12 36 18 M10 24 Q24 19 38 24 M12 30 Q24 25 36 30" />
      </g>
    </svg>
  );
};

interface VaultPairedCardProps {
  item: VaultPairedFormulation;
  cardIndex: number;
  accentHex: string;
  accentTextHex: string;
  isWishlisted: boolean;
  soldCount: number;
  recentKey: string | null;
  onToggleWishlist: () => void;
  onInspectItem: () => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onReserveVariant: (variant: 'bar' | 'bomb' | 'pair') => void;
}

const VaultPairedCard: React.FC<VaultPairedCardProps> = memo(({
  item,
  cardIndex,
  accentHex,
  accentTextHex,
  isWishlisted,
  soldCount,
  recentKey,
  onToggleWishlist,
  onInspectItem,
  onZoomImage,
  onReserveVariant,
}) => {
  const { lang, t } = useLanguage();
  const emotionalTease = lang === 'th' ? item.emotionalTeaseTh : item.emotionalTeaseEn;
  const activeText = getVaultActivePercentText(item, lang);

  const lineLabel =
    item.line === 'dark'
      ? t.darkColTitle
      : item.line === 'bright'
        ? t.brightColTitle
        : t.occasionsColTitle;

  const barAdded = recentKey === `${item.id}_bar`;
  const bombAdded = recentKey === `${item.id}_bomb`;
  const pairAdded = recentKey === `${item.id}_pair`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, delay: Math.min(cardIndex, 5) * 0.04, ease: SABLE_EASE }}
      whileHover={SABLE_CARD_HOVER}
      className="group sable-motion-host relative cv-product-card flex"
    >
      <div className="luxury-3d-card w-full overflow-hidden flex flex-col justify-between bg-[var(--surface-card)]">
        {/* Era Studio Half-Translucent Photography Stage + Floating Core Scrim + 4K Zoom */}
        <div
          onClick={onInspectItem}
          className="relative aspect-square w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
        >
          <ResilientImage
            src={item.imageUrl}
            alt={`${item.brandName} — ${emotionalTease}`}
            fallbackTitle={item.brandName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.024]"
          />
          <SoapSideEmblems badges={getVaultPairSideBadges(item)} compact />

          {onZoomImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onZoomImage({
                  src: item.imageUrl,
                  alt: item.brandName,
                  title: item.brandName,
                  activeBadge: activeText,
                });
              }}
              aria-label={`${t.zoom4kLabel} ${item.brandName}`}
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
              <span className="inline-flex items-center gap-1.5 font-medium truncate">
                <span className="tabular-figures font-semibold">
                  No. {String(item.itemNumber).padStart(2, '0')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full border border-white/50"
                    style={{ backgroundColor: item.soapTopHex }}
                  />
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full border border-white/50"
                    style={{ backgroundColor: item.bombCoreHex }}
                  />
                </span>
                <span className="truncate">{lineLabel}</span>
              </span>
              <span className="tabular-figures font-bold text-white shrink-0">
                {formatThb(VAULT_PRICING.pairedDuoThb)}
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold leading-snug text-white line-clamp-1 drop-shadow-sm">
              {item.brandName}
            </h3>
            <p className="text-[11px] font-semibold text-amber-200 tabular-figures line-clamp-1">
              {activeText}
            </p>
            <p className="text-[11px] text-white/85 line-clamp-1">{emotionalTease}</p>
          </div>
          <div aria-hidden="true" className="shimmer z-20" />
        </div>

        {/* Direct Bar / Bomb / Paired Duo Concierge Controls */}
        <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-end">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onReserveVariant('bar')}
                className="h-9 sm:h-8 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 text-[10.5px] font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1"
              >
                {barAdded ? <Check className="w-3 h-3 shrink-0" /> : null}
                <span>{barAdded ? t.reservedBtn : t.vaultReserveBar}</span>
              </button>

              <button
                type="button"
                onClick={() => onReserveVariant('bomb')}
                className="h-9 sm:h-8 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 text-[10.5px] font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1"
              >
                {bombAdded ? <Check className="w-3 h-3 shrink-0" /> : null}
                <span>{bombAdded ? t.reservedBtn : t.vaultReserveBomb}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleWishlist}
                aria-label={isWishlisted ? t.favRemove : t.favAdd}
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => onReserveVariant('pair')}
                className="luxury-3d-pill flex-1 h-10 sm:h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                {pairAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.reservedBtn}</span>
                  </>
                ) : (
                  <span>
                    {t.vaultReservePair} · {formatThb(VAULT_PRICING.pairedDuoThb)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <VintageParchmentTicket
          assayCode={`No. ${String(item.itemNumber).padStart(2, '0')}`}
          finePrintText=""
          craftSpecText=""
          soldCount={soldCount}
          soldUnitLabel={t.soldUnitLabel}
          ledgerActionLabel={t.ledgerActionLabel}
          onInspectLedger={onInspectItem}
        />
      </div>
    </motion.article>
  );
});

VaultPairedCard.displayName = 'VaultPairedCard';

interface VaultMarbleBoxCardProps {
  box: VaultMarbleBoxEdition;
  accentHex: string;
  accentTextHex: string;
  onInspectPair: (pair: VaultPairedFormulation) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onReserveBox: (
    box: VaultMarbleBoxEdition,
    ribbonAndLoofahs: string,
    engravingNote: string,
  ) => void;
}

const VaultMarbleBoxCard: React.FC<VaultMarbleBoxCardProps> = memo(({
  box,
  accentHex,
  accentTextHex,
  onInspectPair,
  onZoomImage,
  onReserveBox,
}) => {
  const { lang, t } = useLanguage();
  const [selectedRibbonId, setSelectedRibbonId] = useState<string>(
    box.stoneType === 'dark-marble'
      ? 'wax-espresso'
      : box.stoneType === 'checkered-occasions'
        ? 'wax-crimson'
        : 'wax-gold',
  );
  const [loofahOneId, setLoofahOneId] = useState<string>(
    box.stoneType === 'dark-marble'
      ? LOOFAH_SCRUB_OPTIONS[2].id
      : box.stoneType === 'checkered-occasions'
        ? LOOFAH_SCRUB_OPTIONS[3].id
        : LOOFAH_SCRUB_OPTIONS[0].id,
  );
  const [studioView, setStudioView] = useState<'coffret' | 'suite'>('coffret');
  const [engravingNote, setEngravingNote] = useState<string>('GENTLEBUBBLE BY AR');
  const [justAdded, setJustAdded] = useState(false);

  const engravingInputId = useId();
  const title = lang === 'th' ? box.titleTh : box.titleEn;
  const themeLabel = lang === 'th' ? box.themeLabelTh : box.themeLabelEn;
  const desc = lang === 'th' ? box.descTh : box.descEn;
  const grooveDetail = lang === 'th' ? box.grooveDetailTh : box.grooveDetailEn;

  const matchingCandle = getMatchingCandleForLine(box.stoneType);
  const candleName = lang === 'th' ? matchingCandle.nameTh : matchingCandle.nameEn;
  const candleSplit = lang === 'th' ? matchingCandle.splitSpecTh : matchingCandle.splitSpecEn;
  const candleAroma = lang === 'th' ? matchingCandle.aromaTh : matchingCandle.aromaEn;

  const includedPairs = useMemo(
    () =>
      box.includedPairIds
        .map((id) => VAULT_PAIR_BY_ID.get(id))
        .filter((p): p is VaultPairedFormulation => Boolean(p)),
    [box.includedPairIds],
  );

  const selectedRibbon =
    RIBBON_SEAL_OPTIONS.find((r) => r.id === selectedRibbonId) ?? RIBBON_SEAL_OPTIONS[0];
  const ribbonName =
    lang === 'th' ? RIBBON_TH[selectedRibbon.id] ?? selectedRibbon.name : selectedRibbon.name;

  const loofahOne = LOOFAH_SCRUB_OPTIONS.find((l) => l.id === loofahOneId) ?? LOOFAH_SCRUB_OPTIONS[0];

  const getLoofahDisplay = (opt: (typeof LOOFAH_SCRUB_OPTIONS)[number]) =>
    lang === 'th'
      ? LOOFAH_TH[opt.id] ?? { label: opt.label, material: opt.material }
      : { label: opt.label, material: opt.material };

  const handleCycleLoofah = () => {
    const idx = LOOFAH_SCRUB_OPTIONS.findIndex((l) => l.id === loofahOne.id);
    const nextOption = LOOFAH_SCRUB_OPTIONS[(idx + 1) % LOOFAH_SCRUB_OPTIONS.length];
    setLoofahOneId(nextOption.id);
  };

  const handleReserve = () => {
    const l1 = getLoofahDisplay(loofahOne);
    onReserveBox(box, `${ribbonName} · ${l1.label} + ${candleName}`, engravingNote.trim());
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const activePhotoSrc = studioView === 'coffret' ? box.imageUrl : MARBLE_CASE_SUITE_IMAGE_URL;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: SABLE_EASE }}
      whileHover={SABLE_CARD_HOVER}
      className="group sable-motion-card luxury-3d-card overflow-hidden flex flex-col"
    >
      {/* Large Aspect-Square Studio Carved Marble Coffret Photograph with Floating Core Info & 4K Zoom */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
        <ResilientImage
          src={activePhotoSrc}
          alt={title}
          fallbackTitle={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
        />

        <div className="absolute top-2.5 left-2.5 z-30 inline-flex items-center p-0.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setStudioView('coffret')}
            className={`px-2 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
              studioView === 'coffret' ? 'bg-white text-black' : 'text-white/85 hover:text-white'
            }`}
          >
            {lang === 'th' ? 'กล่องหินอ่อน' : 'Coffret'}
          </button>
          <button
            type="button"
            onClick={() => setStudioView('suite')}
            className={`px-2 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
              studioView === 'suite' ? 'bg-white text-black' : 'text-white/85 hover:text-white'
            }`}
          >
            {lang === 'th' ? 'บวบ + เทียน' : '1+1 Suite'}
          </button>
        </div>

        {onZoomImage && (
          <button
            type="button"
            onClick={() =>
              onZoomImage({
                src: activePhotoSrc,
                alt: title,
                title,
                activeBadge: `${formatThb(box.priceThb)} · ${grooveDetail}`,
              })
            }
            aria-label={`${t.zoom4kLabel} ${title}`}
            className="absolute top-2.5 right-2.5 z-30 px-2 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3 h-3" />
            <span>4K</span>
          </button>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/88 via-black/45 to-transparent z-20"
        />
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 text-white space-y-1">
          <div className="flex items-center justify-between gap-2 text-[10.5px] text-amber-200 font-semibold">
            <span className="truncate">{themeLabel}</span>
            <span className="inline-flex items-baseline gap-1.5 shrink-0 tabular-figures">
              <span className="text-sm font-bold text-white">{formatThb(box.priceThb)}</span>
              <span className="text-[10px] line-through text-white/60">
                {formatThb(box.compareAtThb)}
              </span>
            </span>
          </div>
          <h4 className="font-serif text-xl font-bold text-white leading-snug line-clamp-1 drop-shadow-sm">
            {title}
          </h4>
          <p className="text-[11px] font-semibold text-amber-200 line-clamp-1">{grooveDetail}</p>
          <p className="text-[11px] text-white/85 line-clamp-1">{desc}</p>
        </div>
        <div aria-hidden="true" className="shimmer z-10" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">

          {/* Live 3D Marble Lid Ribbon & Brass Engraving Mockup */}
          <MarbleBoxRibbonMockup
            stoneType={box.stoneType}
            setName={title}
            ribbon={{ ...selectedRibbon, name: ribbonName }}
            engravingNote={engravingNote}
          />

          {/* 3 Matched Bar Soaps + 3 Matching Bath Bombs Inside Marble Box (Dark + Bright + Occasions) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[var(--ink)]">{t.vaultBoxesInteriorLabel}</span>
              <span className="tabular-figures font-semibold" style={{ color: accentHex }}>
                {t.vaultBoxesInteriorCount}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {includedPairs.map((pair) => {
                const pairLineLabel =
                  pair.line === 'dark'
                    ? t.darkColTitle
                    : pair.line === 'bright'
                      ? t.brightColTitle
                      : t.occasionsColTitle;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => onInspectPair(pair)}
                    className="group/thumb flex flex-col gap-1 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/35 transition-colors cursor-pointer text-left"
                  >
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-[var(--border)]">
                      <img
                        src={pair.imageUrl}
                        alt={pair.brandName}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-[1.03]"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[var(--ink)] truncate">
                      {pair.brandName}
                    </p>
                    <p className="text-[9px] text-[var(--muted)] truncate">
                      {pairLineLabel} · {getVaultActivePercentText(pair, lang)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1× Natural Loofah Scrub + 1× Color-Matched 50/50 Aromatic Candle */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between gap-2 text-[10.5px] text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">{t.loofahTitle}</span>
              <span className="truncate">{t.loofahTapHint}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(() => {
                const lCopy = getLoofahDisplay(loofahOne);
                return (
                  <button
                    type="button"
                    onClick={handleCycleLoofah}
                    className="flex items-center gap-2 p-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--ink)]/40 transition-colors cursor-pointer text-left"
                  >
                    <LoofahScrubSwatch swatchHex={loofahOne.swatchHex} />
                    <div className="min-w-0">
                      <p
                        className="text-[9.5px] font-semibold uppercase tracking-wider truncate"
                        style={{ color: accentHex }}
                      >
                        {t.loofahSlotLabel}
                      </p>
                      <p className="text-[10.5px] font-semibold text-[var(--ink)] truncate">
                        {lCopy.label}
                      </p>
                      <p className="text-[9px] text-[var(--muted)] truncate">{lCopy.material}</p>
                    </div>
                  </button>
                );
              })()}

              <button
                type="button"
                onClick={() =>
                  onZoomImage?.({
                    src: matchingCandle.imageUrl,
                    alt: candleName,
                    title: candleName,
                    activeBadge: candleSplit,
                  })
                }
                className="flex items-center gap-2 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 hover:border-[var(--ink)]/40 transition-colors cursor-pointer text-left group/candle"
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                  <img
                    src={matchingCandle.imageUrl}
                    alt={candleName}
                    className="w-full h-full object-cover group-hover/candle:scale-105 transition-transform"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white/80"
                    style={{
                      background: `linear-gradient(135deg, ${matchingCandle.gelTintHex} 50%, ${matchingCandle.creamTintHex} 50%)`,
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[9.5px] font-semibold uppercase tracking-wider truncate inline-flex items-center gap-1"
                    style={{ color: accentHex }}
                  >
                    <Flame className="w-2.5 h-2.5 shrink-0" />
                    <span>{t.matchingCandleSlotTitle}</span>
                  </p>
                  <p className="text-[10.5px] font-semibold text-[var(--ink)] truncate">{candleName}</p>
                  <p className="text-[9px] text-[var(--muted)] truncate">{candleAroma}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Silk Ribbon Selector & Custom Brass Plaque Engraving */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-[var(--ink)]">{t.ribbonLabel}</span>
              <div className="flex items-center gap-1.5">
                {RIBBON_SEAL_OPTIONS.map((opt) => {
                  const active = selectedRibbonId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedRibbonId(opt.id)}
                      aria-label={lang === 'th' ? RIBBON_TH[opt.id] ?? opt.name : opt.name}
                      className="w-5 h-5 rounded-full border-2 transition-transform cursor-pointer"
                      style={{
                        backgroundColor: opt.swatch,
                        borderColor: active ? accentHex : 'transparent',
                        transform: active ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor={engravingInputId}
                className="block text-[10.5px] font-medium text-[var(--muted)] mb-1"
              >
                {t.brassEngravingLabel}
              </label>
              <input
                id={engravingInputId}
                type="text"
                maxLength={28}
                value={engravingNote}
                onChange={(e) => setEngravingNote(e.target.value)}
                placeholder={t.brassPlaceholder}
                className="w-full h-8 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReserve}
          className="luxury-3d-pill w-full h-10 px-4 rounded-full text-xs font-bold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures"
          style={{ backgroundColor: accentHex, color: accentTextHex }}
        >
          {justAdded ? <Check className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
          <span>
            {justAdded ? t.vaultReservedBoxBtn : t.vaultReserveBoxBtn} ·{' '}
            {formatThb(box.priceThb)}
          </span>
        </button>
      </div>
    </motion.article>
  );
});

VaultMarbleBoxCard.displayName = 'VaultMarbleBoxCard';

export const SecretVaultSection: React.FC<SecretVaultSectionProps> = memo(({
  activeEra,
  user,
  accentHex,
  accentTextHex,
  wishlistIds,
  itemSoldDeltas = {},
  externalInspectedPair = null,
  isTvMode = false,
  onClearExternalInspectedPair,
  onToggleWishlist,
  onZoomImage,
  onAddVaultToBag,
  onAddVaultMarbleBoxToBag,
}) => {
  const { lang, t } = useLanguage();
  const [selectedLine, setSelectedLine] = useState<'all' | VaultLineFilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReserveKey, setRecentReserveKey] = useState<string | null>(null);
  const [inspectedPair, setInspectedPair] = useState<VaultPairedFormulation | null>(null);

  const eraMeta = ART_ERA_BY_ID.get(activeEra) ?? ART_ERAS[0];

  const eraPairs = useMemo(
    () => VAULT_PAIRED_FORMULATIONS.filter((item) => item.eraId === activeEra),
    [activeEra],
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return eraPairs.filter((item) => {
      if (selectedLine !== 'all' && item.line !== selectedLine) return false;
      if (!q) return true;
      return (
        item.brandName.toLowerCase().includes(q) ||
        item.emotionalTeaseEn.toLowerCase().includes(q) ||
        item.emotionalTeaseTh.toLowerCase().includes(q) ||
        item.scentColorMoodEn.toLowerCase().includes(q) ||
        item.scentColorMoodTh.toLowerCase().includes(q) ||
        item.shortBarStamp.toLowerCase().includes(q) ||
        item.shortBombStamp.toLowerCase().includes(q) ||
        item.soapName.toLowerCase().includes(q) ||
        item.bombName.toLowerCase().includes(q) ||
        item.eraGrooveEn.toLowerCase().includes(q) ||
        item.eraGrooveTh.toLowerCase().includes(q)
      );
    });
  }, [eraPairs, searchQuery, selectedLine]);

  const activeBox = useMemo(
    () => VAULT_MARBLE_BOXES.find((b) => b.eraId === activeEra) ?? VAULT_MARBLE_BOXES[0],
    [activeEra],
  );

  const activeModalPair = inspectedPair ?? externalInspectedPair ?? null;

  const handleCloseModal = () => {
    setInspectedPair(null);
    onClearExternalInspectedPair?.();
  };

  const handleReserveVariant = (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => {
    onAddVaultToBag(item, variant);
    const flashKey = `${item.id}_${variant}`;
    setRecentReserveKey(flashKey);
    window.setTimeout(() => {
      setRecentReserveKey((curr) => (curr === flashKey ? null : curr));
    }, 1200);
  };

  return (
    <section
      id="secret-vault"
      aria-label={lang === 'th' ? eraMeta.labelTh : eraMeta.labelEn}
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] py-12 lg:py-16"
    >
      <div className="atelier-container space-y-10 sm:space-y-12">
        {/* PART 1: Clean Unboxed Era Header + Hairline Bright · Dark · Events Filters */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5 max-w-2xl">
              <p
                className="text-[11px] font-semibold tracking-[0.16em] uppercase"
                style={{ color: accentHex }}
              >
                {t.vaultUnlockedBadge}
                {user?.displayName ? ` · ${user.displayName.split(' ')[0]}` : ''} ·{' '}
                {lang === 'th' ? eraMeta.periodTagTh : eraMeta.periodTagEn}
              </p>

              <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
                <span>
                  {lang === 'th' ? eraMeta.heroLine1Th : eraMeta.heroLine1En}
                </span>{' '}
                <span className="rainbow-sparkle-text">
                  {lang === 'th' ? eraMeta.heroLine2Th : eraMeta.heroLine2En}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {lang === 'th' ? eraMeta.heroSummaryTh : eraMeta.heroSummaryEn}
              </p>
            </div>

            <div className="py-2.5 border-y border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {(
                  [
                    { id: 'all', label: t.vaultEraFilterAll },
                    { id: 'bright', label: t.vaultFilterBright },
                    { id: 'dark', label: t.vaultFilterDark },
                    { id: 'holiday', label: t.vaultFilterHolidays },
                  ] as const
                ).map((tab) => {
                  const isSelected = selectedLine === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedLine(tab.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
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

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <label className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.vaultSearchPlaceholder}
                    aria-label={t.vaultSearchPlaceholder}
                    className="w-full h-8 pl-8 pr-3 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/90 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </label>

                <a
                  href="#vault-marble-boxes"
                  className="text-xs font-semibold hover:underline transition-opacity whitespace-nowrap shrink-0"
                  style={{ color: accentHex }}
                >
                  {lang === 'th'
                    ? activeBox.titleTh.split('·')[0].trim()
                    : activeBox.titleEn.split('·')[0].trim()}{' '}
                  →
                </a>
              </div>
            </div>
          </div>

          {/* Spacious 3-Column Storefront (Bright Left · Dark Middle · Events Right when viewing all 6 duos) */}
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                key={`empty-${activeEra}-${selectedLine}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: SABLE_EASE }}
                className="luxury-3d-card p-10 text-center text-sm text-[var(--muted)]"
              >
                {t.vaultEmptyMatch}
              </motion.div>
            ) : selectedLine === 'all' && !searchQuery.trim() ? (
              <motion.div
                key={`cols-${activeEra}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.32, ease: SABLE_EASE }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 2xl:gap-8 items-start"
              >
                {(
                  [
                    {
                      key: 'bright' as const,
                      title: t.brightColTitle,
                      items: filteredItems.filter((i) => i.line === 'bright'),
                    },
                    {
                      key: 'dark' as const,
                      title: t.darkColTitle,
                      items: filteredItems.filter((i) => i.line === 'dark'),
                    },
                    {
                      key: 'holiday' as const,
                      title: t.occasionsColTitle,
                      items: filteredItems.filter((i) => i.line === 'holiday'),
                    },
                  ] as const
                ).map((col) => (
                  <div key={col.key} className="space-y-4">
                    <div className="border-b border-[var(--border)] pb-2 flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                        {col.title}
                      </h3>
                      <span className="text-[11px] text-[var(--muted)] tabular-figures">
                        {col.items.length} {t.barsUnit}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {col.items.map((item, idx) => (
                        <VaultPairedCard
                          key={item.id}
                          item={item}
                          cardIndex={idx}
                          accentHex={accentHex}
                          accentTextHex={accentTextHex}
                          isWishlisted={wishlistIds.includes(item.id)}
                          soldCount={
                            getDeterministicItemSoldBase(item.id) + (itemSoldDeltas[item.id] ?? 0)
                          }
                          recentKey={recentReserveKey}
                          onToggleWishlist={() => onToggleWishlist(item.id)}
                          onInspectItem={() => setInspectedPair(item)}
                          onZoomImage={onZoomImage}
                          onReserveVariant={(variant) => handleReserveVariant(item, variant)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${activeEra}-${selectedLine}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.32, ease: SABLE_EASE }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 2xl:gap-10 items-stretch"
              >
                {filteredItems.map((item, idx) => (
                  <VaultPairedCard
                    key={item.id}
                    item={item}
                    cardIndex={idx}
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    isWishlisted={wishlistIds.includes(item.id)}
                    soldCount={
                      getDeterministicItemSoldBase(item.id) + (itemSoldDeltas[item.id] ?? 0)
                    }
                    recentKey={recentReserveKey}
                    onToggleWishlist={() => onToggleWishlist(item.id)}
                    onInspectItem={() => setInspectedPair(item)}
                    onZoomImage={onZoomImage}
                    onReserveVariant={(variant) => handleReserveVariant(item, variant)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PART 2: 1 Bespoke Marble Coffret Dedicated to Active Art Era (1 Dark + 1 Bright + 1 Occasions) */}
        <div id="vault-marble-boxes" className="pt-6 border-t border-[var(--border)] space-y-6">
          <div className="space-y-1.5 max-w-4xl mx-auto text-center">
            <p
              className="text-[11px] font-bold tracking-[0.18em] uppercase"
              style={{ color: accentHex }}
            >
              {t.vaultEraCoffretEyebrow} · {lang === 'th' ? eraMeta.labelTh : eraMeta.labelEn}
            </p>
            <h3 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
              {lang === 'th' ? activeBox.titleTh : activeBox.titleEn}
            </h3>
            <p className="fluid-lead-copy text-[var(--muted)] max-w-2xl mx-auto">
              {t.vaultBoxesSub}
            </p>
          </div>

          {isTvMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {VAULT_MARBLE_BOXES.slice(0, 3).map((box) => (
                <VaultMarbleBoxCard
                  key={box.id}
                  box={box}
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  onInspectPair={(pair) => setInspectedPair(pair)}
                  onZoomImage={onZoomImage}
                  onReserveBox={onAddVaultMarbleBoxToBag}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl 2xl:max-w-3xl mx-auto">
              <VaultMarbleBoxCard
                key={activeBox.id}
                box={activeBox}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                onInspectPair={(pair) => setInspectedPair(pair)}
                onZoomImage={onZoomImage}
                onReserveBox={onAddVaultMarbleBoxToBag}
              />
            </div>
          )}
        </div>
      </div>

      {/* Emotional Atelier & Engraved Stamp Inspection Modal */}
      {activeModalPair && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalPair.brandName}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/55 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="luxury-3d-card relative w-full max-w-2xl 2xl:max-w-3xl max-h-[92dvh] overflow-y-auto bg-[var(--surface-card)] p-5 sm:p-7 space-y-5"
          >
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close"
              className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center absolute top-4 right-4 hover:border-[var(--ink)]/30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="relative sm:col-span-6 aspect-square rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                <ResilientImage
                  src={activeModalPair.imageUrl}
                  alt={activeModalPair.brandName}
                  className="w-full h-full object-cover"
                />
                {onZoomImage && (
                  <button
                    type="button"
                    onClick={() =>
                      onZoomImage({
                        src: activeModalPair.imageUrl,
                        alt: activeModalPair.brandName,
                        title: activeModalPair.brandName,
                        activeBadge: getVaultActivePercentText(activeModalPair, lang),
                      })
                    }
                    aria-label={`${t.zoom4kLabel} ${activeModalPair.brandName}`}
                    className="absolute top-3 right-3 px-2.5 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>4K</span>
                  </button>
                )}
              </div>

              <div className="sm:col-span-6 space-y-3">
                <p
                  className="text-[10.5px] font-bold tracking-[0.14em] uppercase"
                  style={{ color: accentHex }}
                >
                  #{String(activeModalPair.itemNumber).padStart(2, '0')} ·{' '}
                  {lang === 'th'
                    ? ART_ERA_BY_ID.get(activeModalPair.eraId)?.labelTh
                    : ART_ERA_BY_ID.get(activeModalPair.eraId)?.labelEn}{' '}
                  ·{' '}
                  {activeModalPair.line === 'dark'
                    ? t.darkColTitle
                    : activeModalPair.line === 'bright'
                      ? t.brightColTitle
                      : t.occasionsColTitle}
                </p>
                <h4 className="font-serif fluid-card-display font-bold text-[var(--ink)]">
                  {activeModalPair.brandName}
                </h4>
                <p className="text-sm font-semibold" style={{ color: accentHex }}>
                  {lang === 'th'
                    ? activeModalPair.emotionalTeaseTh
                    : activeModalPair.emotionalTeaseEn}
                </p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {lang === 'th'
                    ? activeModalPair.scentColorMoodTh
                    : activeModalPair.scentColorMoodEn}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[var(--ink)] pt-0.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                  <span>
                    {getVaultActivePercentText(activeModalPair, lang)} ·{' '}
                    {activeModalPair.goldLeafTone === 'pink-gold'
                      ? t.vaultPinkGoldTag
                      : t.vaultYellowGoldTag}{' '}
                    ·{' '}
                    {lang === 'th' ? activeModalPair.halfSplitTh : activeModalPair.halfSplitEn} ·{' '}
                    {lang === 'th' ? activeModalPair.grooveLabelTh : activeModalPair.grooveLabelEn}
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80">
                    <p className="font-mono font-bold text-[var(--ink)]">
                      {t.vaultBarStampTag}: {activeModalPair.shortBarStamp} ·{' '}
                      {activeModalPair.gentleBubbleSeal}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{activeModalPair.soapName}</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80">
                    <p className="font-mono font-bold text-[var(--ink)]">
                      {t.vaultBombStampTag}: {activeModalPair.shortBombStamp}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{activeModalPair.bombName}</p>
                  </div>

                  {(() => {
                    const pairCandle = getMatchingCandleForLine(activeModalPair.line);
                    const cName = lang === 'th' ? pairCandle.nameTh : pairCandle.nameEn;
                    const cSplit = lang === 'th' ? pairCandle.splitSpecTh : pairCandle.splitSpecEn;
                    const cAroma = lang === 'th' ? pairCandle.aromaTh : pairCandle.aromaEn;
                    return (
                      <button
                        type="button"
                        onClick={() =>
                          onZoomImage?.({
                            src: pairCandle.imageUrl,
                            alt: cName,
                            title: cName,
                            activeBadge: cSplit,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 flex items-center gap-2.5 text-left hover:border-[var(--ink)]/35 transition-colors cursor-pointer"
                      >
                        <img
                          src={pairCandle.imageUrl}
                          alt={cName}
                          className="w-10 h-10 rounded-lg object-cover border border-[var(--border)] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1"
                            style={{ color: accentHex }}
                          >
                            <Flame className="w-3 h-3 shrink-0" />
                            <span>{t.matchingCandleLabel}</span>
                          </p>
                          <p className="text-xs font-semibold text-[var(--ink)] truncate">{cName}</p>
                          <p className="text-[10.5px] text-[var(--muted)] truncate">{cAroma}</p>
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleReserveVariant(activeModalPair, 'bar')}
                className="px-4 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] cursor-pointer"
              >
                {t.vaultReserveBar}
              </button>
              <button
                type="button"
                onClick={() => handleReserveVariant(activeModalPair, 'bomb')}
                className="px-4 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] cursor-pointer"
              >
                {t.vaultReserveBomb}
              </button>
              <button
                type="button"
                onClick={() => handleReserveVariant(activeModalPair, 'pair')}
                className="luxury-3d-pill px-5 h-9 rounded-full text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t.vaultReservePair} · {formatThb(VAULT_PRICING.pairedDuoThb)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

SecretVaultSection.displayName = 'SecretVaultSection';
