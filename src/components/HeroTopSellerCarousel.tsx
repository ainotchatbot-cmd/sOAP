import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, ScrollText } from 'lucide-react';
import {
  ALL_SOAP_CREATIONS,
  formatThb,
  SOAP_BY_ID,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import {
  BATH_BOMB_BY_ID,
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombPackTier,
} from '../data/bathBombs';
import { useLanguage } from '../data/i18n';
import { getPoeticBombMood, getPoeticSoapMood } from '../data/poeticMoods';
import { ResilientImage } from './ResilientImage';

interface HeroTopSellerCarouselProps {
  mode: 'soaps' | 'bath-bombs';
  primarySpotlightId: string;
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  totalSold?: number;
  onToggleWishlist: (itemId: string) => void;
  onOpenPodium: (soapId: string) => void;
  onOpenBombNutrition: (bombId: string) => void;
  onAddSoapToBag: (soap: SoapCreation, quantity: number, sizeTier: SoapSizeTier) => void;
  onAddBombToBag: (bomb: BathBombCreation, quantity: number, packTier: BathBombPackTier) => void;
}

const DEFAULT_LINE_TOP_SELLERS: Record<'dark' | 'bright' | 'holiday', string> = {
  bright: 'bright-coconut-pearl',
  dark: 'dark-espresso-noir',
  holiday: 'holiday-coronation-royal',
};

const DEFAULT_BOMB_TOP_SELLERS: string[] = [
  'bb-bright-white-wine',
  'bb-dark-red-wine',
  'bb-holiday-coronation-gold',
];

const preloadedCarouselUrls = new Set<string>();

function preloadCarouselImage(url: string): void {
  if (typeof window === 'undefined' || !url || preloadedCarouselUrls.has(url)) return;
  preloadedCarouselUrls.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.referrerPolicy = 'no-referrer';
  img.src = url;
  if (typeof img.decode === 'function') {
    img.decode().catch(() => {
      // Allow regular browser load without surfacing decode interruptions
    });
  }
}

export const HeroTopSellerCarousel: React.FC<HeroTopSellerCarouselProps> = ({
  mode,
  primarySpotlightId,
  accentHex,
  accentTextHex,
  wishlistIds,
  totalSold = 1428,
  onToggleWishlist,
  onOpenPodium,
  onOpenBombNutrition,
  onAddSoapToBag,
  onAddBombToBag,
}) => {
  const { lang, t, getSoapDisplay } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const soapSlides = useMemo<SoapCreation[]>(() => {
    const primary = SOAP_BY_ID.get(primarySpotlightId) ?? ALL_SOAP_CREATIONS[0];
    const lineOrder: Array<'bright' | 'dark' | 'holiday'> = ['bright', 'dark', 'holiday'];
    const remainingLines = lineOrder.filter((line) => line !== primary.line);

    const others = remainingLines
      .map((line) => SOAP_BY_ID.get(DEFAULT_LINE_TOP_SELLERS[line]))
      .filter((s): s is SoapCreation => Boolean(s));

    return [primary, ...others].slice(0, 3);
  }, [primarySpotlightId]);

  const bombSlides = useMemo<BathBombCreation[]>(() => {
    return DEFAULT_BOMB_TOP_SELLERS.map((id) => BATH_BOMB_BY_ID.get(id)).filter(
      (b): b is BathBombCreation => Boolean(b),
    );
  }, []);

  const totalSlides = mode === 'bath-bombs' ? bombSlides.length : soapSlides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [mode, primarySpotlightId]);

  // Preload active, next, and previous slide images immediately + warm the alternate mode on idle
  useEffect(() => {
    const activeSlides = mode === 'bath-bombs' ? bombSlides : soapSlides;
    if (activeSlides.length === 0) return;

    const orderedIndices = [
      activeIndex,
      (activeIndex + 1) % activeSlides.length,
      (activeIndex - 1 + activeSlides.length) % activeSlides.length,
    ];

    orderedIndices.forEach((idx) => {
      const slide = activeSlides[idx];
      if (slide?.imageUrl) {
        preloadCarouselImage(slide.imageUrl);
      }
    });

    const alternateFirstUrl =
      mode === 'bath-bombs' ? soapSlides[0]?.imageUrl : bombSlides[0]?.imageUrl;

    if (!alternateFirstUrl) return;
    const idleHandle = window.setTimeout(() => {
      preloadCarouselImage(alternateFirstUrl);
    }, 600);

    return () => window.clearTimeout(idleHandle);
  }, [activeIndex, bombSlides, mode, soapSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % totalSlides);

  const activeSoap = soapSlides[activeIndex] ?? soapSlides[0];
  const activeBomb = bombSlides[activeIndex] ?? bombSlides[0];

  const activeItem =
    mode === 'bath-bombs'
      ? {
          id: activeBomb.id,
          line: activeBomb.line,
          name: lang === 'th' ? activeBomb.nameTh : activeBomb.nameEn,
          subtitle: getPoeticBombMood(activeBomb, lang),
          imageUrl: activeBomb.imageUrl,
          imageAlt: activeBomb.imageAlt,
          fallbackGradient: activeBomb.fallbackGradient,
          price: BATH_BOMB_PRICE_TIERS.single,
        }
      : {
          id: activeSoap.id,
          line: activeSoap.line,
          name: getSoapDisplay(activeSoap).name,
          subtitle: getPoeticSoapMood(activeSoap, lang, getSoapDisplay(activeSoap).scentMood),
          imageUrl: activeSoap.imageUrl,
          imageAlt: activeSoap.imageAlt,
          fallbackGradient: activeSoap.fallbackGradient,
          price: activeSoap.priceUsd,
        };

  const isWishlisted = wishlistIds.includes(activeItem.id);
  const lineLabel =
    activeItem.line === 'dark'
      ? t.darkColTitle
      : activeItem.line === 'bright'
        ? t.brightColTitle
        : t.occasionsColTitle;

  const handleInspect = () => {
    if (mode === 'bath-bombs') {
      onOpenBombNutrition(activeBomb.id);
    } else {
      onOpenPodium(activeSoap.id);
    }
  };

  const handleReserve = () => {
    if (mode === 'bath-bombs') {
      onAddBombToBag(activeBomb, 1, 'single');
    } else {
      onAddSoapToBag(activeSoap, 1, 'full');
    }
  };

  return (
    <div
      className="luxury-3d-card max-w-[500px] lg:max-w-[520px] mx-auto overflow-hidden flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.topSellerLabel}
    >
      <div
        onClick={handleInspect}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0.25, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.25, scale: 0.99 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <ResilientImage
              src={activeItem.imageUrl}
              alt={activeItem.imageAlt}
              fallbackTitle={activeItem.name}
              fallbackGradient={activeItem.fallbackGradient}
              priority
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden="true" className="shimmer shimmer-enlarged z-20" />
      </div>

      {/* Top Seller Carousel Control Strip */}
      <div className="px-5 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[11px] font-semibold tracking-[0.12em] uppercase truncate"
            style={{ color: accentHex }}
          >
            {t.topSellerLabel} · {lineLabel}
          </span>
          <span aria-hidden="true" className="text-[var(--muted)] text-[10px]">·</span>
          <span className="text-[10px] font-medium text-[var(--muted)] tabular-figures whitespace-nowrap shrink-0">
            {totalSold.toLocaleString()} {t.atelierSoldTotalLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={t.topSellerLabel}>
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Spotlight ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  className="h-2 rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    width: selected ? '20px' : '8px',
                    backgroundColor: selected ? accentHex : 'var(--border)',
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous top seller"
              className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next top seller"
              className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two-Line Accent Caption & Concise Actions */}
      <div className="px-5 sm:px-6 py-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--surface-card)]">
        <div className="space-y-0.5 min-w-0 flex-1">
          <p className="font-serif fluid-card-display font-bold text-[var(--ink)] truncate">
            {activeItem.name}
          </p>
          <p className="text-xs font-semibold truncate" style={{ color: accentHex }}>
            {activeItem.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleWishlist(activeItem.id)}
            aria-label={isWishlisted ? t.favRemove : t.favAdd}
            className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'}`}
            />
          </button>
          <button
            type="button"
            onClick={handleInspect}
            className="px-3.5 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium inline-flex items-center gap-1.5 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
          >
            <ScrollText className="w-3.5 h-3.5" style={{ color: accentHex }} />
            <span>{mode === 'bath-bombs' ? t.bathNutritionBtn : t.inspectBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleReserve}
            className="luxury-3d-pill px-4 h-9 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures"
            style={{ backgroundColor: accentHex, color: accentTextHex }}
          >
            {t.reserveBtn} · {formatThb(activeItem.price)}
          </button>
        </div>
      </div>
    </div>
  );
};
