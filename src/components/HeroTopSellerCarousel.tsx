import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Eye,
  Flame,
  Heart,
  Scale,
  ScrollText,
  ShoppingBag,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  ALL_SOAP_CREATIONS,
  BRIGHT_5050_LINE,
  DARK_5050_LINE,
  formatThb,
  getSoapGoldLeafType,
  HOLIDAY_EDITION_LINE,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import {
  ALL_BATH_BOMBS,
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombPackTier,
  BRIGHT_BATH_BOMBS,
  DARK_BATH_BOMBS,
  HOLIDAY_BATH_BOMBS,
} from '../data/bathBombs';
import {
  ART_ERA_BY_ID,
  ArtEraId,
  VAULT_PAIRED_FORMULATIONS,
  VAULT_PRICING,
  VaultPairedFormulation,
} from '../data/memberVaultCatalog';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import type { SoapLineKey } from '../data/palette';
import { useLanguage } from '../data/i18n';
import { getPoeticBombMood, getPoeticSoapMood } from '../data/poeticMoods';
import {
  getBombActivePercentText,
  getBombSideBadges,
  getSoapActivePercentText,
  getSoapSideBadges,
  getVaultActivePercentText,
  getVaultPairSideBadges,
  LUXURY_FRUIT_DUOS_LINE,
  SoapSideBadgeSpec,
} from '../data/fruitDuosCatalog';
import { getDeterministicItemSoldBase } from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';
import { SoapSideEmblems } from './SoapSideEmblems';
import type { ZoomableImageTarget } from './ImageZoomModal';

export type CarouselCatalogMode = 'soaps' | 'bath-bombs' | 'fruit-duos' | 'category-2' | ArtEraId;

const MAX_COMPARE_ITEMS = 3;

interface HeroTopSellerCarouselProps {
  mode: CarouselCatalogMode;
  primarySpotlightId: string;
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  totalSold?: number;
  onToggleWishlist: (itemId: string) => void;
  onOpenPodium: (soapId: string) => void;
  onOpenBombNutrition: (bombId: string) => void;
  onInspectVaultPair?: (pair: VaultPairedFormulation) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddSoapToBag: (soap: SoapCreation, quantity: number, sizeTier: SoapSizeTier) => void;
  onAddBombToBag: (bomb: BathBombCreation, quantity: number, packTier: BathBombPackTier) => void;
  onAddVaultToBag?: (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => void;
}

interface TopSellerCardData {
  id: string;
  rank: number;
  line: SoapLineKey;
  eraTag: string;
  name: string;
  activePercentText: string;
  subtitle: string;
  description: string;
  scentDetail: string;
  craftDetail: string;
  benefitDetail: string;
  ingredients: string[];
  imageUrl: string;
  imageAlt: string;
  fallbackGradient: string;
  price: number;
  badges: SoapSideBadgeSpec[];
  onInspectFull: () => void;
  onReserveItem: () => void;
}

export const HeroTopSellerCarousel: React.FC<HeroTopSellerCarouselProps> = ({
  mode,
  primarySpotlightId,
  accentHex,
  accentTextHex,
  wishlistIds,
  itemSoldDeltas = {},
  onToggleWishlist,
  onOpenPodium,
  onOpenBombNutrition,
  onInspectVaultPair,
  onZoomImage,
  onAddSoapToBag,
  onAddBombToBag,
  onAddVaultToBag,
}) => {
  const { lang, t, getSoapDisplay, translateIngredient } = useLanguage();
  const [quickViewItemId, setQuickViewItemId] = useState<string | null>(null);
  const [quickReservedId, setQuickReservedId] = useState<string | null>(null);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const isEraMode =
    mode === 'medieval' ||
    mode === 'renaissance' ||
    mode === 'baroque' ||
    mode === 'romanticism' ||
    mode === 'enlightenment';

  const getSoldCount = useCallback(
    (id: string) => getDeterministicItemSoldBase(id) + (itemSoldDeltas[id] ?? 0),
    [itemSoldDeltas],
  );

  // Dynamically rank Top 3 Sold Items inside each category/era tab
  const soapSlides = useMemo<SoapCreation[]>(() => {
    const pool: SoapCreation[] =
      mode === 'fruit-duos'
        ? [...LUXURY_FRUIT_DUOS_LINE]
        : mode === 'category-2'
          ? [
              ...BRIGHT_5050_LINE.slice(2),
              ...DARK_5050_LINE.slice(2),
              ...HOLIDAY_EDITION_LINE.slice(2),
            ]
          : [
              ...BRIGHT_5050_LINE.slice(0, 2),
              ...DARK_5050_LINE.slice(0, 2),
              ...HOLIDAY_EDITION_LINE.slice(0, 2),
            ];

    return [...pool]
      .sort((a, b) => getSoldCount(b.id) - getSoldCount(a.id))
      .slice(0, 3);
  }, [getSoldCount, mode]);

  const bombSlides = useMemo<BathBombCreation[]>(() => {
    const pool = [
      ...BRIGHT_BATH_BOMBS.slice(0, 2),
      ...DARK_BATH_BOMBS.slice(0, 2),
      ...HOLIDAY_BATH_BOMBS.slice(0, 2),
    ];
    return [...pool].sort((a, b) => getSoldCount(b.id) - getSoldCount(a.id)).slice(0, 3);
  }, [getSoldCount]);

  const eraSlides = useMemo<VaultPairedFormulation[]>(() => {
    if (!isEraMode) return [];
    const pool = VAULT_PAIRED_FORMULATIONS.filter((p) => p.eraId === mode);
    return [...pool].sort((a, b) => getSoldCount(b.id) - getSoldCount(a.id)).slice(0, 3);
  }, [getSoldCount, isEraMode, mode]);

  useEffect(() => {
    setQuickViewItemId(null);
  }, [mode, primarySpotlightId]);

  useEffect(() => {
    if (!quickViewItemId && !isCompareOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCompareOpen) {
          setIsCompareOpen(false);
        } else if (quickViewItemId) {
          setQuickViewItemId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareOpen, quickViewItemId]);

  const eraMeta = isEraMode ? ART_ERA_BY_ID.get(mode) : undefined;

  const subBrandName =
    isEraMode && eraMeta
      ? `${eraMeta.chapterRoman}. ${lang === 'th' ? eraMeta.labelTh : eraMeta.labelEn}`
      : mode === 'fruit-duos'
        ? t.modeFruitDuosBtn
        : mode === 'bath-bombs'
          ? t.modeBathBombsBtn
          : mode === 'category-2'
            ? t.modeCategoryTwoBtn
            : t.modeSoapsBtn;

  const flashReserved = useCallback((itemId: string) => {
    setQuickReservedId(itemId);
    window.setTimeout(() => {
      setQuickReservedId((curr) => (curr === itemId ? null : curr));
    }, 1100);
  }, []);

  const mapVaultPairToCard = useCallback(
    (pair: VaultPairedFormulation, rank: number): TopSellerCardData => {
      const goldLeafText =
        pair.goldLeafTone === 'pink-gold' ? t.vaultPinkGoldTag : t.vaultYellowGoldTag;
      const lineTag =
        pair.line === 'bright'
          ? t.brightColTitle
          : pair.line === 'dark'
            ? t.darkColTitle
            : t.occasionsColTitle;
      const grooveLabel = lang === 'th' ? pair.grooveLabelTh : pair.grooveLabelEn;
      const activeTokens = pair.activeFormula
        .split('+')
        .map((token) => displayInlaySafe(token.trim()))
        .filter(Boolean);
      const crystalNote =
        pair.crystalFinish === 'salt-crystals'
          ? lang === 'th'
            ? 'ผลึกเกลือแร่สปาใส'
            : 'Translucent Mineral Salt Crystals'
          : grooveLabel;
      const ingredients = dedupeStrings([
        ...activeTokens,
        goldLeafText,
        crystalNote,
        displayInlaySafe(lang === 'th' ? pair.eraPigmentTh : pair.eraPigmentEn),
      ]).slice(0, 6);

      return {
        id: pair.id,
        rank,
        line: pair.line,
        eraTag: lineTag,
        name: pair.brandName,
        activePercentText: getVaultActivePercentText(pair, lang),
        subtitle: lang === 'th' ? pair.emotionalTeaseTh : pair.emotionalTeaseEn,
        description: lang === 'th' ? pair.scentColorMoodTh : pair.scentColorMoodEn,
        scentDetail: lang === 'th' ? pair.scentColorMoodTh : pair.scentColorMoodEn,
        craftDetail: `${goldLeafText} · ${grooveLabel} · ${lang === 'th' ? pair.halfSplitTh : pair.halfSplitEn}`,
        benefitDetail: `${t.vaultBarLabel} + ${t.vaultBombLabel}`,
        ingredients,
        imageUrl: pair.imageUrl,
        imageAlt: `${pair.brandName} — ${pair.emotionalTeaseEn}`,
        fallbackGradient: 'from-[#EFE6DC] via-[#DFCEBE] to-[#8E6B56]',
        price: VAULT_PRICING.pairedDuoThb,
        badges: getVaultPairSideBadges(pair),
        onInspectFull: () => {
          if (onInspectVaultPair) {
            onInspectVaultPair(pair);
          } else {
            document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        onReserveItem: () => {
          onAddVaultToBag?.(pair, 'pair');
          flashReserved(pair.id);
        },
      };
    },
    [flashReserved, lang, onAddVaultToBag, onInspectVaultPair, t],
  );

  const mapBombToCard = useCallback(
    (bomb: BathBombCreation, rank: number): TopSellerCardData => {
      const goldText =
        bomb.edibleGoldLeaf === 'rose-gold' ? t.goldFilterRose : t.goldFilterYellow;
      const grooveLabel = lang === 'th' ? bomb.grooveLabelTh : bomb.grooveLabelEn;
      const highlights = lang === 'th' ? bomb.highlightsTh : bomb.highlightsEn;
      const lineTag =
        bomb.line === 'bright'
          ? t.brightColTitle
          : bomb.line === 'dark'
            ? t.darkColTitle
            : t.occasionsColTitle;

      const nutritionRows = [
        ...bomb.nutritionPack.aminoAndBrighteners,
        ...bomb.nutritionPack.enzymesAndBotanicals,
        ...bomb.nutritionPack.minerals.slice(0, 2),
        ...bomb.nutritionPack.vitamins.slice(0, 2),
      ];
      const ingredients = dedupeStrings([
        lang === 'th' ? bomb.heroActivesTh : bomb.heroActivesEn,
        ...nutritionRows.map((row) =>
          displayInlaySafe(lang === 'th' ? row.labelTh : row.labelEn),
        ),
      ]).slice(0, 6);

      return {
        id: bomb.id,
        rank,
        line: bomb.line,
        eraTag: lineTag,
        name: lang === 'th' ? bomb.nameTh : bomb.nameEn,
        activePercentText: getBombActivePercentText(bomb, lang),
        subtitle: getPoeticBombMood(bomb, lang),
        description: lang === 'th' ? bomb.brighteningNoteTh : bomb.brighteningNoteEn,
        scentDetail: `${lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn} · ${
          lang === 'th' ? bomb.fizzDurationTh : bomb.fizzDurationEn
        }`,
        craftDetail: `${goldText} · ${grooveLabel} · ${lang === 'th' ? bomb.halfSplitTh : bomb.halfSplitEn}`,
        benefitDetail: highlights.join(' · '),
        ingredients,
        imageUrl: bomb.imageUrl,
        imageAlt: bomb.imageAlt,
        fallbackGradient: bomb.fallbackGradient,
        price: BATH_BOMB_PRICE_TIERS.single,
        badges: getBombSideBadges(bomb),
        onInspectFull: () => onOpenBombNutrition(bomb.id),
        onReserveItem: () => {
          onAddBombToBag(bomb, 1, 'single');
          flashReserved(bomb.id);
        },
      };
    },
    [flashReserved, lang, onAddBombToBag, onOpenBombNutrition, t],
  );

  const mapSoapToCard = useCallback(
    (soap: SoapCreation, rank: number): TopSellerCardData => {
      const soapDisplay = getSoapDisplay(soap);
      const goldType = getSoapGoldLeafType(soap);
      const goldLabel = goldType === 'rose-gold' ? t.goldFilterRose : t.goldFilterYellow;
      const lineTag =
        soap.line === 'bright'
          ? t.brightColTitle
          : soap.line === 'dark'
            ? t.darkColTitle
            : t.occasionsColTitle;

      const ingredients = dedupeStrings([
        ...soap.bioActives.actives.map((item) => displayInlaySafe(translateIngredient(item))),
        ...soap.ingredients.map((item) => displayInlaySafe(translateIngredient(item))),
      ]).slice(0, 6);

      return {
        id: soap.id,
        rank,
        line: soap.line,
        eraTag: lineTag,
        name: soapDisplay.name,
        activePercentText: getSoapActivePercentText(soap, lang),
        subtitle: getPoeticSoapMood(soap, lang, soapDisplay.scentMood),
        description: lang === 'th' ? soapDisplay.themeLabel : soap.sableDescription,
        scentDetail: soapDisplay.scentMood,
        craftDetail: `${goldLabel} · ${displayInlaySafe(soapDisplay.inlayLabel)} · ${t.halfTransparentTag}`,
        benefitDetail: soap.bioActives.skinBenefit,
        ingredients,
        imageUrl: soap.imageUrl,
        imageAlt: soap.imageAlt,
        fallbackGradient: soap.fallbackGradient,
        price: soap.priceUsd,
        badges: getSoapSideBadges(soap),
        onInspectFull: () => onOpenPodium(soap.id),
        onReserveItem: () => {
          onAddSoapToBag(soap, 1, 'full');
          flashReserved(soap.id);
        },
      };
    },
    [flashReserved, getSoapDisplay, lang, onAddSoapToBag, onOpenPodium, t, translateIngredient],
  );

  const topThreeCards = useMemo<TopSellerCardData[]>(() => {
    if (isEraMode) {
      return eraSlides.map((pair, idx) => mapVaultPairToCard(pair, idx + 1));
    }
    if (mode === 'bath-bombs') {
      return bombSlides.map((bomb, idx) => mapBombToCard(bomb, idx + 1));
    }
    return soapSlides.map((soap, idx) => mapSoapToCard(soap, idx + 1));
  }, [bombSlides, eraSlides, isEraMode, mapBombToCard, mapSoapToCard, mapVaultPairToCard, mode, soapSlides]);

  const resolveCardById = useCallback(
    (id: string): TopSellerCardData | null => {
      const activeMatch = topThreeCards.find((card) => card.id === id);
      if (activeMatch) return activeMatch;

      const soapMatch = ALL_SOAP_CREATIONS.find((s) => s.id === id);
      if (soapMatch) return mapSoapToCard(soapMatch, 1);

      const bombMatch = ALL_BATH_BOMBS.find((b) => b.id === id);
      if (bombMatch) return mapBombToCard(bombMatch, 1);

      const vaultMatch = VAULT_PAIRED_FORMULATIONS.find((v) => v.id === id);
      if (vaultMatch) return mapVaultPairToCard(vaultMatch, 1);

      return null;
    },
    [mapBombToCard, mapSoapToCard, mapVaultPairToCard, topThreeCards],
  );

  const comparedCards = useMemo<TopSellerCardData[]>(
    () =>
      comparedIds
        .map((id) => resolveCardById(id))
        .filter((card): card is TopSellerCardData => card !== null),
    [comparedIds, resolveCardById],
  );

  const toggleCompareItem = useCallback((id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length < 2) {
          setIsCompareOpen(false);
        }
        return next;
      }
      return [...prev, id].slice(-MAX_COMPARE_ITEMS);
    });
  }, []);

  const clearCompareItems = useCallback(() => {
    setComparedIds([]);
    setIsCompareOpen(false);
  }, []);

  const quickViewItem = useMemo(
    () => topThreeCards.find((card) => card.id === quickViewItemId) ?? null,
    [quickViewItemId, topThreeCards],
  );

  const isModalWishlisted = quickViewItem ? wishlistIds.includes(quickViewItem.id) : false;

  const quickViewModal =
    quickViewItem && typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            <motion.div
              key="carousel-quick-view-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${t.quickViewBtn}: ${quickViewItem.name}`}
              onClick={() => setQuickViewItemId(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="luxury-3d-card relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[var(--surface-card)] text-[var(--ink)] grid grid-cols-1 sm:grid-cols-12 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setQuickViewItemId(null)}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/92 text-[var(--ink)] flex items-center justify-center absolute top-3 right-3 z-30 hover:border-[var(--ink)]/35 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Left: Core Product Photography + 4K Zoom */}
                <div className="sm:col-span-5 relative aspect-square sm:aspect-auto sm:min-h-[360px] bg-[var(--surface)] overflow-hidden">
                  <ResilientImage
                    src={quickViewItem.imageUrl}
                    alt={quickViewItem.imageAlt}
                    fallbackTitle={quickViewItem.name}
                    fallbackGradient={quickViewItem.fallbackGradient}
                    className="w-full h-full object-cover"
                  />
                  <SoapSideEmblems compact badges={quickViewItem.badges} />
                  {onZoomImage && (
                    <button
                      type="button"
                      onClick={() =>
                        onZoomImage({
                          src: quickViewItem.imageUrl,
                          alt: quickViewItem.imageAlt,
                          title: quickViewItem.name,
                          activeBadge: quickViewItem.activePercentText,
                          fallbackGradient: quickViewItem.fallbackGradient,
                        })
                      }
                      aria-label={t.zoom4kLabel}
                      className="absolute bottom-3 right-3 z-30 px-2.5 h-8 rounded-full bg-black/70 hover:bg-black/85 text-white text-[11px] font-semibold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>4K</span>
                    </button>
                  )}
                </div>

                {/* Modal Right: Clean Simplified Product Details + Matching 50/50 Candle */}
                <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 pr-8">
                      <span
                        className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: accentHex }}
                      >
                        #{quickViewItem.rank} · {subBrandName} · {quickViewItem.eraTag}
                      </span>
                      <span className="font-serif text-base font-bold text-[var(--ink)] tabular-figures">
                        {formatThb(quickViewItem.price)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="rainbow-sparkle-text font-serif text-xl sm:text-2xl font-bold leading-snug">
                        {quickViewItem.name}
                      </h3>
                      <p className="text-xs font-semibold tabular-figures" style={{ color: accentHex }}>
                        {quickViewItem.activePercentText} · {quickViewItem.subtitle}
                      </p>
                    </div>

                    <dl className="pt-2 border-t border-[var(--border)] space-y-2 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          {t.quickViewScentLabel}
                        </dt>
                        <dd className="text-[var(--ink)] font-medium">{quickViewItem.scentDetail}</dd>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          {t.quickViewCraftLabel}
                        </dt>
                        <dd className="text-[var(--ink)] font-medium">{quickViewItem.craftDetail}</dd>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          {t.quickViewBenefitLabel}
                        </dt>
                        <dd className="text-[var(--ink)]/90">{quickViewItem.benefitDetail}</dd>
                      </div>
                    </dl>

                    {(() => {
                      const candle = getMatchingCandleForLine(quickViewItem.line);
                      const candleName = lang === 'th' ? candle.nameTh : candle.nameEn;
                      const candleAroma = lang === 'th' ? candle.aromaTh : candle.aromaEn;
                      const candleSplit = lang === 'th' ? candle.splitSpecTh : candle.splitSpecEn;
                      return (
                        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/85 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              onZoomImage?.({
                                src: candle.imageUrl,
                                alt: candleName,
                                title: candleName,
                                activeBadge: '50/50 Gel + Soy Candle',
                              })
                            }
                            aria-label={candleName}
                            className="relative w-12 h-12 rounded-lg overflow-hidden border border-[var(--border)] shrink-0 cursor-pointer group"
                          >
                            <img
                              src={candle.imageUrl}
                              alt={candleName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[8px] text-white font-bold">
                              4K
                            </span>
                          </button>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1"
                              style={{ color: accentHex }}
                            >
                              <Flame className="w-3 h-3" />
                              <span>{t.matchingCandleLabel}</span>
                            </p>
                            <p className="text-xs font-semibold text-[var(--ink)] truncate">{candleName}</p>
                            <p className="text-[10.5px] text-[var(--muted)] truncate">
                              {candleSplit} · {candleAroma}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(quickViewItem.id)}
                      aria-label={isModalWishlisted ? t.favRemove : t.favAdd}
                      className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer shrink-0"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isModalWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const openFull = quickViewItem.onInspectFull;
                        setQuickViewItemId(null);
                        openFull();
                      }}
                      className="px-3.5 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium inline-flex items-center gap-1.5 hover:border-[var(--ink)]/30 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ScrollText className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                      <span>{t.quickViewFullDetailsBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={quickViewItem.onReserveItem}
                      className="luxury-3d-pill flex-1 px-4 h-9 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: accentHex, color: accentTextHex }}
                    >
                      {quickReservedId === quickViewItem.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.quickAddedToast}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {t.quickBuyBtn} · {formatThb(quickViewItem.price)}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  const compareModal =
    isCompareOpen && comparedCards.length >= 2 && typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            <motion.div
              key="carousel-compare-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-label={t.compareModalTitle}
              data-testid="compare-modal"
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="luxury-3d-card relative w-full max-w-5xl max-h-[90dvh] flex flex-col bg-[var(--surface-card)] text-[var(--ink)] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-start justify-between gap-3 bg-[var(--surface)]/65">
                  <div className="min-w-0 space-y-0.5">
                    <p
                      className="text-[10.5px] font-bold uppercase tracking-[0.16em] inline-flex items-center gap-1.5"
                      style={{ color: accentHex }}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>
                        {comparedCards.length} / {MAX_COMPARE_ITEMS} {t.compareSelectedLabel}
                      </span>
                    </p>
                    <h3 className="rainbow-sparkle-text font-serif text-lg sm:text-2xl font-bold leading-snug">
                      {t.compareModalTitle}
                    </h3>
                    <p className="text-xs text-[var(--muted)]">{t.compareModalSubtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={clearCompareItems}
                      className="px-3 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] text-xs font-medium hover:border-[var(--ink)]/30 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t.compareClearBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCompareOpen(false)}
                      aria-label="Close"
                      className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/35 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Side-by-Side Matrix */}
                <div className="overflow-y-auto overflow-x-auto flex-1">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--border)] align-top bg-[var(--surface)]/30">
                        <th
                          scope="col"
                          className="w-32 sm:w-44 min-w-[120px] p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] align-bottom"
                        >
                          {t.subBrandMotifLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <th
                            key={item.id}
                            scope="col"
                            data-testid={`compare-col-${item.id}`}
                            className="min-w-[210px] sm:min-w-[235px] p-3.5 sm:p-4 border-l border-[var(--border)] align-top font-normal"
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider"
                                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                                >
                                  {item.eraTag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleCompareItem(item.id)}
                                  aria-label={`${t.compareRemoveLabel} ${item.name}`}
                                  className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)]/30 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                                <ResilientImage
                                  src={item.imageUrl}
                                  alt={item.imageAlt}
                                  fallbackTitle={item.name}
                                  fallbackGradient={item.fallbackGradient}
                                  className="w-full h-full object-cover"
                                />
                                {onZoomImage && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onZoomImage({
                                        src: item.imageUrl,
                                        alt: item.imageAlt,
                                        title: item.name,
                                        activeBadge: item.activePercentText,
                                        fallbackGradient: item.fallbackGradient,
                                      })
                                    }
                                    aria-label={`${t.zoom4kLabel} ${item.name}`}
                                    className="absolute bottom-2 right-2 px-2 h-6 rounded-full bg-black/70 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 cursor-pointer"
                                  >
                                    <ZoomIn className="w-3 h-3" />
                                    <span>4K</span>
                                  </button>
                                )}
                              </div>

                              <div>
                                <p className="font-serif text-base font-bold text-[var(--ink)] leading-snug">
                                  {item.name}
                                </p>
                                <p
                                  className="text-[11px] font-semibold tabular-figures mt-0.5"
                                  style={{ color: accentHex }}
                                >
                                  {item.activePercentText}
                                </p>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border)] text-xs">
                      {/* Price */}
                      <tr>
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]/30 align-middle"
                        >
                          {t.comparePriceLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <td
                            key={item.id}
                            className="p-3.5 sm:p-4 border-l border-[var(--border)] align-middle"
                          >
                            <span className="font-serif text-lg font-bold text-[var(--ink)] tabular-figures">
                              {formatThb(item.price)}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Scent Profile */}
                      <tr>
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]/30 align-top"
                        >
                          {t.quickViewScentLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <td
                            key={item.id}
                            className="p-3.5 sm:p-4 border-l border-[var(--border)] align-top space-y-1"
                          >
                            <p className="font-medium text-[var(--ink)] leading-relaxed">
                              {item.scentDetail}
                            </p>
                            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                              {item.subtitle}
                            </p>
                          </td>
                        ))}
                      </tr>

                      {/* Ingredients & Botanicals */}
                      <tr>
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]/30 align-top"
                        >
                          {t.compareIngredientsLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <td
                            key={item.id}
                            className="p-3.5 sm:p-4 border-l border-[var(--border)] align-top"
                          >
                            <ul className="space-y-1.5">
                              {item.ingredients.map((ing) => (
                                <li
                                  key={ing}
                                  className="text-[var(--ink)]/95 leading-snug flex items-start gap-1.5"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                    style={{ backgroundColor: accentHex }}
                                  />
                                  <span>{ing}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>

                      {/* Craft & Gold Leaf */}
                      <tr>
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]/30 align-top"
                        >
                          {t.quickViewCraftLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <td
                            key={item.id}
                            className="p-3.5 sm:p-4 border-l border-[var(--border)] align-top text-[var(--ink)]/90 leading-relaxed"
                          >
                            {item.craftDetail}
                          </td>
                        ))}
                      </tr>

                      {/* Skin Ritual */}
                      <tr>
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]/30 align-top"
                        >
                          {t.quickViewBenefitLabel}
                        </th>
                        {comparedCards.map((item) => (
                          <td
                            key={item.id}
                            className="p-3.5 sm:p-4 border-l border-[var(--border)] align-top text-[var(--ink)]/90 leading-relaxed"
                          >
                            {item.benefitDetail}
                          </td>
                        ))}
                      </tr>

                      {/* Direct Quick Buy Action Row */}
                      <tr className="bg-[var(--surface)]/35">
                        <th
                          scope="row"
                          className="p-3.5 sm:p-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] align-middle"
                        >
                          {t.quickBuyBtn}
                        </th>
                        {comparedCards.map((item) => {
                          const isColReserved = quickReservedId === item.id;
                          return (
                            <td
                              key={item.id}
                              className="p-3.5 sm:p-4 border-l border-[var(--border)] align-middle"
                            >
                              <button
                                type="button"
                                onClick={item.onReserveItem}
                                className="luxury-3d-pill w-full h-9 px-3.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1.5"
                                style={{ backgroundColor: accentHex, color: accentTextHex }}
                              >
                                {isColReserved ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 shrink-0" />
                                    <span>{t.quickAddedToast}</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                      {t.quickBuyBtn} · {formatThb(item.price)}
                                    </span>
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className="w-full space-y-3"
        role="region"
        aria-label={t.top3SoldCarouselLabel}
        data-testid="hero-top-seller-grid"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
            <span
              className="text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{ color: accentHex }}
            >
              {t.top3SoldCarouselLabel}
            </span>
            <span aria-hidden="true" className="text-[var(--muted)] text-xs">
              ·
            </span>
            <span className="text-xs font-semibold text-[var(--ink)] truncate">{subBrandName}</span>
          </div>
          <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
            {lang === 'th'
              ? 'ซื้อด่วนได้ทันที หรือเลือกเปรียบเทียบเคียงข้าง'
              : 'Instant Quick Buy or select items to compare side-by-side'}
          </span>
        </div>

        {/* Always show all 3 Top Bestsellers cleanly across tablet & desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {topThreeCards.map((item) => {
            const isCardWishlisted = wishlistIds.includes(item.id);
            const isCardReserved = quickReservedId === item.id;
            const isComparing = comparedIds.includes(item.id);
            return (
              <motion.article
                key={item.id}
                data-testid="hero-top-seller-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: (item.rank - 1) * 0.05 }}
                className="luxury-3d-card overflow-hidden flex flex-col justify-between bg-[var(--surface-card)]/95"
              >
                <div>
                  <div
                    onClick={() => setQuickViewItemId(item.id)}
                    className="relative aspect-square w-full overflow-hidden bg-[var(--surface)] cursor-pointer group"
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fallbackTitle={item.name}
                      fallbackGradient={item.fallbackGradient}
                      priority
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                    <SoapSideEmblems badges={item.badges} />

                    {onZoomImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onZoomImage({
                            src: item.imageUrl,
                            alt: item.imageAlt,
                            title: item.name,
                            activeBadge: item.activePercentText,
                            fallbackGradient: item.fallbackGradient,
                          });
                        }}
                        aria-label={`${t.zoom4kLabel} ${item.name}`}
                        className="absolute top-2.5 right-2.5 z-30 px-2 h-7 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3" />
                        <span>4K</span>
                      </button>
                    )}

                    {/* Floating Core Metadata Overlay Scrim */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/82 via-black/38 to-transparent z-20"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-30 p-3 text-white space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-wider uppercase shadow-sm"
                          style={{ backgroundColor: accentHex, color: accentTextHex }}
                        >
                          #{item.rank} · {item.eraTag}
                        </span>
                        <span className="text-xs font-bold tabular-figures text-white drop-shadow">
                          {formatThb(item.price)}
                        </span>
                      </div>
                      <p className="font-serif text-base font-bold leading-tight text-white truncate drop-shadow-sm">
                        {item.name}
                      </p>
                      <p className="text-[10.5px] font-semibold text-amber-200 truncate tabular-figures">
                        {item.activePercentText} · {item.subtitle}
                      </p>
                    </div>

                    <div aria-hidden="true" className="shimmer z-20" />
                  </div>
                </div>

                {/* Card Footer: Quick View + Compare toggle + Instant Quick Buy */}
                <div className="px-3 pb-3 pt-2.5 border-t border-[var(--border)] bg-[var(--surface)]/45 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(item.id)}
                      aria-label={isCardWishlisted ? t.favRemove : t.favAdd}
                      className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer shrink-0"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isCardWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickViewItemId(item.id)}
                      className="flex-1 min-w-0 px-2 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:border-[var(--ink)]/35 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                      <span className="truncate">{t.quickViewBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompareItem(item.id)}
                      aria-pressed={isComparing}
                      data-testid={`compare-toggle-${item.id}`}
                      className="flex-1 min-w-0 px-2 h-8 rounded-full border text-[11px] font-semibold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                      style={
                        isComparing
                          ? {
                              borderColor: accentHex,
                              backgroundColor: `${accentHex}1F`,
                              color: 'var(--ink)',
                            }
                          : {
                              borderColor: 'var(--border)',
                              backgroundColor: 'var(--surface-card)',
                              color: 'var(--ink)',
                            }
                      }
                    >
                      {isComparing ? (
                        <Check className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                      ) : (
                        <Scale className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                      )}
                      <span className="truncate">
                        {isComparing ? t.comparingBtn : t.compareBtn}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={item.onReserveItem}
                    data-testid={`quick-buy-${item.id}`}
                    className="luxury-3d-pill w-full px-3 h-9 rounded-full text-[11.5px] font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: accentHex, color: accentTextHex }}
                  >
                    {isCardReserved ? (
                      <>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.quickAddedToast}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {t.quickBuyBtn} · {formatThb(item.price)}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Inline Comparison Bar */}
        <AnimatePresence>
          {comparedCards.length > 0 && (
            <motion.div
              key="compare-selection-bar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              data-testid="compare-selection-bar"
              className="luxury-3d-card px-3.5 py-2.5 bg-[var(--surface-card)]/95 border border-[var(--border)] flex flex-wrap items-center justify-between gap-2.5"
            >
              <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 tabular-figures"
                  style={{ color: accentHex }}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>
                    {comparedCards.length}/{MAX_COMPARE_ITEMS}
                  </span>
                </span>

                {comparedCards.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 max-w-[180px]"
                  >
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="text-[11px] font-medium text-[var(--ink)] truncate">
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompareItem(item.id)}
                      aria-label={`${t.compareRemoveLabel} ${item.name}`}
                      className="w-4 h-4 rounded-full hover:bg-[var(--ink)]/10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {comparedCards.length < 2 && (
                  <span className="text-[11px] text-[var(--muted)]">{t.compareSelectHint}</span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={clearCompareItems}
                  className="px-3 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-[11px] font-medium hover:border-[var(--ink)]/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.compareClearBtn}
                </button>
                <button
                  type="button"
                  disabled={comparedCards.length < 2}
                  data-testid="open-compare-modal-btn"
                  onClick={() => setIsCompareOpen(true)}
                  className="luxury-3d-pill px-4 h-8 rounded-full text-[11.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center gap-1.5"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {t.compareNowBtn} ({comparedCards.length})
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {quickViewModal}
      {compareModal}
    </>
  );
};

function displayInlaySafe(raw: string): string {
  return raw.replace(/pearl/gi, '24k Gold Leaf').replace(/ไข่มุก/g, 'ทองคำเปลว 24K');
}

function dedupeStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const cleaned = raw.trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(cleaned);
    }
  }
  return out;
}
