import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flame,
  FlaskConical,
  Heart,
  Leaf,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  Waves,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  ALL_SOAP_CREATIONS,
  formatThb,
  getSoapGoldLeafType,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from '../data/soaps';
import { getMatchingCandleForLine } from '../data/aromaticCandles';
import { BENEFIT_LABELS_TH, MARKER_LABELS_TH, useLanguage } from '../data/i18n';
import { getSoapActivePercentText } from '../data/fruitDuosCatalog';
import { getPoeticSoapMood } from '../data/poeticMoods';
import { InlayGlyph } from './InlayGlyph';
import { PackagingIconGlyph, PACKAGING_MARKER_SPECS } from './PackagingSymbols';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface SoapPodiumModalProps {
  soapId: string | null;
  accentHex: string;
  accentTextHex?: string;
  wishlistIds: string[];
  onClose: () => void;
  onSelectSoapId: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddToBag: (
    soap: SoapCreation,
    quantity: number,
    sizeOrSlice: boolean | SoapSizeTier,
    sourceEl?: HTMLElement | null,
  ) => void;
}

interface VisualBenefitMetric {
  id: string;
  label: string;
  level: 1 | 2 | 3 | 4 | 5;
  icon: React.FC<{ className?: string }>;
}

function getVisualBenefitStandards(soap: SoapCreation, lang: 'th' | 'en'): VisualBenefitMetric[] {
  const haystack = `${soap.name} ${soap.bioActives.headlineCompound} ${soap.ingredients.join(' ')}`.toLowerCase();
  const isClarifying =
    haystack.includes('salicylic') ||
    haystack.includes('sulfur') ||
    haystack.includes('piroctone') ||
    haystack.includes('charcoal') ||
    haystack.includes('oolong') ||
    haystack.includes('coffee');
  const isBarrier =
    haystack.includes('squalane') ||
    haystack.includes('lecithin') ||
    haystack.includes('oat') ||
    haystack.includes('honey') ||
    haystack.includes('coconut') ||
    haystack.includes('avocado');
  const isGlow =
    haystack.includes('hyaluronic') ||
    haystack.includes('retinol') ||
    haystack.includes('silk') ||
    haystack.includes('pomegranate') ||
    haystack.includes('turmeric') ||
    soap.signatureFinish === 'shimmer' ||
    soap.signatureFinish === 'stardust';
  const isScrub = soap.signatureFinish === 'scrub' || soap.luxuryInlay.type === 'loofah';

  return [
    {
      id: 'hydration',
      label: lang === 'th' ? BENEFIT_LABELS_TH.hydration : 'Moisture Lock',
      level: isBarrier || haystack.includes('hyaluronic') ? 5 : 4,
      icon: Droplets,
    },
    {
      id: 'clarifying',
      label: lang === 'th' ? BENEFIT_LABELS_TH.clarifying : 'Pore Clarity',
      level: isClarifying ? 5 : soap.line === 'dark' ? 4 : 3,
      icon: FlaskConical,
    },
    {
      id: 'barrier',
      label: lang === 'th' ? BENEFIT_LABELS_TH.barrier : 'Barrier Calm',
      level: isBarrier || soap.nutritionFacts ? 5 : 4,
      icon: ShieldCheck,
    },
    {
      id: 'luminosity',
      label: lang === 'th' ? BENEFIT_LABELS_TH.luminosity : 'Silk Glow',
      level: isGlow || soap.signatureFinish === 'translucent' ? 5 : 4,
      icon: Sun,
    },
    {
      id: 'polish',
      label: lang === 'th' ? BENEFIT_LABELS_TH.polish : 'Gentle Polish',
      level: isScrub ? 5 : isClarifying ? 4 : 3,
      icon: Waves,
    },
  ];
}

function getIngredientVisualIcon(name: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes('hyaluronic') ||
    lower.includes('glycerin') ||
    lower.includes('squalane') ||
    lower.includes('water') ||
    lower.includes('milk')
  ) {
    return Droplets;
  }
  if (
    lower.includes('salicylic') ||
    lower.includes('sulfur') ||
    lower.includes('piroctone') ||
    lower.includes('retinol') ||
    lower.includes('syndet') ||
    lower.includes('propanediol')
  ) {
    return FlaskConical;
  }
  if (
    lower.includes('silk') ||
    lower.includes('gold') ||
    lower.includes('stardust') ||
    lower.includes('mica') ||
    lower.includes('vitamin')
  ) {
    return Sparkles;
  }
  if (lower.includes('oat') || lower.includes('honey') || lower.includes('lecithin')) {
    return ShieldCheck;
  }
  return Leaf;
}

function parsePhMarkerPercent(phText: string): number {
  const nums = phText.match(/\d+(\.\d+)?/g)?.map(Number) ?? [5.5];
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.max(8, Math.min(92, ((avg - 4.0) / 3.5) * 100));
}

export const SoapPodiumModal: React.FC<SoapPodiumModalProps> = ({
  soapId,
  accentHex,
  accentTextHex = '#261E14',
  wishlistIds,
  onClose,
  onSelectSoapId,
  onToggleWishlist,
  onZoomImage,
  onAddToBag,
}) => {
  const { lang, t, getSoapDisplay, translateIngredient } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [format, setFormat] = useState<SoapSizeTier>('full');
  const [translucencyPct, setTranslucencyPct] = useState<number>(72);

  const currentIdx = ALL_SOAP_CREATIONS.findIndex((s) => s.id === soapId);
  const soap = currentIdx >= 0 ? ALL_SOAP_CREATIONS[currentIdx] : null;

  useEffect(() => {
    if (!soap) return;
    if (soap.signatureFinish === 'translucent') {
      setTranslucencyPct(86);
    } else if (soap.signatureFinish === 'shimmer' || soap.signatureFinish === 'stardust') {
      setTranslucencyPct(78);
    } else {
      setTranslucencyPct(68);
    }
  }, [soap]);

  if (!soap) return null;

  const display = getSoapDisplay(soap);
  const isWishlisted = wishlistIds.includes(soap.id);
  const activePrice =
    format === 'small'
      ? soap.slice100gUsd
      : format === 'mega'
        ? soap.hugeBlockThb ?? SOAP_PRICE_TIERS.mega
        : soap.priceUsd;
  const barPrimary = soap.botanicalLayers.crystalColorHex;
  const barSecondary = soap.botanicalLayers.creamColorHex;

  const imageTransparencyAlpha = Math.max(0.7, 1 - (translucencyPct / 100) * 0.28);
  const opaqueVeilOpacity = Math.max(0, (54 - translucencyPct) / 54);
  const crystalSheenOpacity = Math.max(0, (translucencyPct - 20) / 80);

  const opticalStageLabel =
    translucencyPct <= 28
      ? t.modalStageVelvet
      : translucencyPct >= 72
        ? t.modalStageLuminous
        : t.modalStageBalanced;

  const lineLabel =
    soap.line === 'holiday'
      ? display.themeLabel
      : soap.line === 'dark'
        ? t.darkColTitle
        : t.brightColTitle;

  const finishTag =
    lang === 'th'
      ? soap.signatureFinish === 'shimmer'
        ? 'ชิมเมอร์แพรไหม 24K'
        : soap.signatureFinish === 'scrub'
          ? 'สครับแร่ธรรมชาติ'
          : soap.signatureFinish === 'stardust'
            ? 'ประกายสตาร์ดัสต์'
            : soap.signatureFinish === 'translucent'
              ? 'ชิมเมอร์เจลโปร่งแสง'
              : 'คริสตัลแวววาวละมุน'
      : soap.signatureFinish === 'shimmer'
        ? 'Satin Silk Shimmer'
        : soap.signatureFinish === 'scrub'
          ? 'Mineral Scrub'
          : soap.signatureFinish === 'stardust'
            ? 'Stardust Sparkle'
            : soap.signatureFinish === 'translucent'
              ? 'Translucent Shimmer'
              : 'Translucent Crystal Sheen';

  const benefitStandards = getVisualBenefitStandards(soap, lang);
  const goldLeafType = getSoapGoldLeafType(soap);
  const isRoseGoldLeaf = goldLeafType === 'rose-gold';

  const handleStep = (delta: number) => {
    const nextIdx =
      (currentIdx + delta + ALL_SOAP_CREATIONS.length) % ALL_SOAP_CREATIONS.length;
    onSelectSoapId(ALL_SOAP_CREATIONS[nextIdx].id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x: ny, y: nx });
  };

  return (
    <AnimatePresence>
      {soapId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={display.name}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B1622]/45 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-3d-card relative z-10 w-full max-w-5xl 2xl:max-w-6xl min-[2400px]:max-w-7xl max-h-[92dvh] overflow-y-auto text-[var(--ink)] bg-[var(--surface-card)]/92 backdrop-blur-2xl"
          >
            {/* Header Strip */}
            <div className="px-5 sm:px-7 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  aria-label="Previous"
                  className="luxury-3d-pill w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium tabular-figures text-[var(--muted)] px-1.5">
                  {soap.editionNumber} · {soap.batchHarvestId}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  aria-label="Next"
                  className="luxury-3d-pill w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(soap.id)}
                  aria-label={isWishlisted ? t.favRemove : t.favAdd}
                  className="luxury-3d-pill w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="luxury-3d-pill w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 p-6 sm:p-8 items-start">
              {/* Left: Backlit Partial-Transparency Lightbox + Gentle Translucent Shimmer */}
              <div
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setTilt({ x: 0, y: 0 })}
                className="lg:col-span-6 relative rounded-[24px] p-5 sm:p-6 flex flex-col items-center justify-center overflow-hidden border border-[var(--border)] space-y-5 backdrop-blur-md"
                style={{
                  background: `radial-gradient(circle at 50% 38%, rgba(255,255,255,0.72) 0%, ${barPrimary}2E 44%, rgba(255,255,255,0.12) 100%)`,
                  perspective: '900px',
                }}
              >
                <motion.div
                  animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  className="relative z-10 w-full max-w-[340px] mx-auto aspect-[3/4] rounded-[20px] overflow-hidden shadow-xl border border-white/45"
                  style={{
                    background: `radial-gradient(circle at 48% 46%, rgba(255,252,244,0.92) 0%, ${barPrimary}3A 56%, ${barSecondary}88 100%)`,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-4 rounded-2xl blur-xl transition-opacity duration-300"
                    style={{
                      opacity: 0.35 + crystalSheenOpacity * 0.55,
                      background: `radial-gradient(circle at 50% 45%, #FFFDF8 0%, ${barPrimary}88 55%, transparent 100%)`,
                    }}
                  />

                  <img
                    src={soap.imageUrl}
                    alt={display.name}
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-cover transition-all duration-300"
                    style={{
                      opacity: imageTransparencyAlpha,
                      filter: `brightness(${0.97 + (translucencyPct / 100) * 0.16}) contrast(${
                        0.96 + (translucencyPct / 100) * 0.08
                      })`,
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
                    style={{
                      opacity: opaqueVeilOpacity * 0.62,
                      background: `linear-gradient(145deg, ${barSecondary}CC 0%, rgba(250, 244, 232, 0.85) 55%, ${barPrimary}44 100%)`,
                      mixBlendMode: 'soft-light',
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
                    style={{
                      opacity: crystalSheenOpacity * 0.78,
                      background: `radial-gradient(circle at 42% 38%, rgba(255,255,255,0.58) 0%, ${barPrimary}38 46%, transparent 76%), linear-gradient(125deg, transparent 22%, rgba(255,255,255,0.44) 48%, transparent 72%)`,
                      mixBlendMode: 'screen',
                    }}
                  />

                  <div aria-hidden="true" className="shimmer shimmer-enlarged z-20" />

                  {onZoomImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onZoomImage({
                          src: soap.imageUrl,
                          alt: display.name,
                          title: display.name,
                          activeBadge: getSoapActivePercentText(soap, lang),
                          fallbackGradient: soap.fallbackGradient,
                        });
                      }}
                      aria-label={`${t.zoom4kLabel} ${display.name}`}
                      className="absolute top-3 right-3 z-30 px-2.5 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold inline-flex items-center gap-1 border border-white/25 backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>4K</span>
                    </button>
                  )}
                </motion.div>

                {/* Backlit Crystal Transparency Slider */}
                <div className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface-card)]/78 backdrop-blur-md p-4 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: accentHex }} />
                      <span>{t.modalShimmerLight}</span>
                    </span>
                    <span className="font-medium tabular-figures" style={{ color: accentHex }}>
                      {opticalStageLabel} · {translucencyPct}%
                    </span>
                  </div>

                  <div className="relative pt-1">
                    <div
                      aria-hidden="true"
                      className="h-2.5 w-full rounded-full border border-[var(--border)] overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, ${barSecondary} 0%, ${barPrimary}99 55%, rgba(255,255,255,0.95) 100%)`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={translucencyPct}
                      onChange={(e) => setTranslucencyPct(Number(e.target.value))}
                      aria-label={t.modalShimmerLight}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[var(--surface-card)] border-2 shadow-md transition-transform"
                      style={{
                        left: `${translucencyPct}%`,
                        borderColor: accentHex,
                        boxShadow: `0 2px 8px ${barPrimary}55`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] font-medium text-[var(--muted)]">
                    <button
                      type="button"
                      onClick={() => setTranslucencyPct(14)}
                      className="hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {t.modalOpaqueButter}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranslucencyPct(56)}
                      className="hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {t.modalFrostedGlow}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranslucencyPct(94)}
                      className="hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {t.modalBacklitCrystal}
                    </button>
                  </div>
                </div>

                {/* Packaging Standard Glyph Badges Row */}
                <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {soap.packagingMarkers.map((markerId) => {
                    const spec =
                      lang === 'th' ? MARKER_LABELS_TH[markerId] : PACKAGING_MARKER_SPECS[markerId];
                    return (
                      <div
                        key={markerId}
                        title={spec.specDetail}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface-card)]/75 px-2.5 py-2 flex flex-col items-center text-center gap-1"
                      >
                        <PackagingIconGlyph id={markerId} accentHex={accentHex} size={18} />
                        <span className="text-[10px] font-medium leading-tight text-[var(--ink)]">
                          {spec.shortTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Visual Benefit Standards, 50/50 Visual Key & Ingredient Ratios */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1.5">
                  <p
                    className="text-[11px] tracking-[0.14em] uppercase flex flex-wrap items-center gap-2 font-semibold"
                    style={{ color: accentHex }}
                  >
                    <span>{lineLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{finishTag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-figures">{getSoapActivePercentText(soap, lang)}</span>
                  </p>
                  <h2 className="marshmallow-text font-serif text-3xl sm:text-4xl font-medium text-[var(--ink)] balance-text">
                    {display.name}
                  </h2>
                  <p className="font-serif italic text-sm text-[var(--muted)]">
                    {getPoeticSoapMood(soap, lang, display.scentMood)}
                  </p>
                </div>

                {/* 50/50 Visual Layer Architecture Split Diagram + Keepsake Icon */}
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/80 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    <span>{t.modalDualStandard}</span>
                    <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                      <InlayGlyph type={soap.luxuryInlay.type} size={14} />
                      <span>{display.inlayLabel}</span>
                    </span>
                  </div>

                  {/* Proportional Visual Split Bar Diagram */}
                  <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-[var(--border)]">
                    <div
                      className="relative px-3 py-2.5 flex items-center gap-2 overflow-hidden"
                      style={{ backgroundColor: `${barPrimary}28` }}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full shrink-0 ring-1 ring-white/70"
                        style={{ backgroundColor: barPrimary }}
                      />
                      <span className="text-[11px] font-semibold text-[var(--ink)] truncate">
                        {display.crystalTitle}
                      </span>
                    </div>
                    <div
                      className="relative px-3 py-2.5 flex items-center gap-2 border-l border-[var(--border)]"
                      style={{ backgroundColor: `${barSecondary}66` }}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-[var(--border)]"
                        style={{ backgroundColor: barSecondary }}
                      />
                      <span className="text-[11px] font-semibold text-[var(--ink)] truncate">
                        {display.creamTitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edible 24k Gold Leaf · Custom Bar Engraving · 3D Diagonal Scrub Craftsmanship */}
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/80 p-3.5 space-y-2">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {t.craftStandardHeading}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-card)]/90 px-2.5 py-2 flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-4 h-4 rounded-full shrink-0 border border-white/60 shadow-xs"
                        style={{
                          background: isRoseGoldLeaf
                            ? 'linear-gradient(135deg, #FBE3DA 0%, #DF927F 55%, #B76857 100%)'
                            : 'linear-gradient(135deg, #FFF4BD 0%, #E2B341 55%, #B58118 100%)',
                        }}
                      />
                      <span className="text-[10.5px] font-semibold leading-tight text-[var(--ink)]">
                        {isRoseGoldLeaf ? t.roseGoldLeafLabel : t.yellowGoldLeafLabel}
                      </span>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-card)]/90 px-2.5 py-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                      <span className="text-[10.5px] font-semibold leading-tight text-[var(--ink)] truncate">
                        {t.engravedStampLabel}
                      </span>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-card)]/90 px-2.5 py-2 flex items-center gap-2">
                      <Waves className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                      <span className="text-[10.5px] font-semibold leading-tight text-[var(--ink)] truncate">
                        {t.diagonalGroovesLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color- & Scent-Matched 50/50 Aromatic Candle Pairing */}
                {(() => {
                  const candle = getMatchingCandleForLine(soap.line);
                  const candleName = lang === 'th' ? candle.nameTh : candle.nameEn;
                  const candleSplit = lang === 'th' ? candle.splitSpecTh : candle.splitSpecEn;
                  const candleAroma = lang === 'th' ? candle.aromaTh : candle.aromaEn;
                  return (
                    <button
                      type="button"
                      onClick={() =>
                        onZoomImage?.({
                          src: candle.imageUrl,
                          alt: candleName,
                          title: candleName,
                          activeBadge: candleSplit,
                        })
                      }
                      className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/85 hover:border-[var(--ink)]/35 p-3 flex items-center gap-3 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={candle.imageUrl}
                        alt={candleName}
                        className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.12em] inline-flex items-center gap-1"
                          style={{ color: accentHex }}
                        >
                          <Flame className="w-3 h-3 shrink-0" />
                          <span>{t.matchingCandleLabel}</span>
                        </p>
                        <p className="text-xs font-semibold text-[var(--ink)] truncate">{candleName}</p>
                        <p className="text-[11px] text-[var(--muted)] truncate">{candleAroma}</p>
                      </div>
                    </button>
                  );
                })()}

                {/* Visual Skin Benefit Standards */}
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)]/80 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      {t.modalBenefits}
                    </span>
                    <span className="text-[10.5px] font-medium text-[var(--muted)] tabular-figures">
                      {t.modalScent} {soap.scentIntensity}/5
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {benefitStandards.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div
                          key={metric.id}
                          className="rounded-xl border border-[var(--border)] bg-[var(--surface-card)]/85 px-3 py-2 flex items-center justify-between gap-2.5"
                        >
                          <span className="inline-flex items-center gap-2 min-w-0">
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-[var(--border)]"
                              style={{
                                backgroundColor: `${barPrimary}1E`,
                                color: accentHex,
                              }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-medium text-[var(--ink)] truncate">
                              {metric.label}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0" aria-label={`${metric.label} ${metric.level}/5`}>
                            {[1, 2, 3, 4, 5].map((pip) => (
                              <span
                                key={pip}
                                className="w-2.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    pip <= metric.level ? barPrimary : 'var(--border)',
                                }}
                              />
                            ))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Antique Parchment Botanical Dossier & Formula pH Ledger */}
                {soap.nutritionFacts ? (
                  <div className="border border-[#B99E74]/60 dark:border-[#E6C589]/28 bg-[#F6EEDD] dark:bg-[#2D2840] p-1">
                    <div className="border border-[#B99E74]/45 dark:border-[#E6C589]/22 bg-[#FAF4E7]/90 dark:bg-[#262138]/85 p-3.5 space-y-3 text-[#463626] dark:text-[#E5D9C4]">
                      <div className="flex items-center justify-between gap-2 border-b border-dotted border-[#B99E74]/55 dark:border-[#E6C589]/25 pb-2">
                        <span className="font-serif text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7B6244] dark:text-[#CBBCA6]">
                          {t.modalActiveRatios} · {soap.nutritionFacts.servingSize}
                        </span>
                        <span
                          className="font-serif text-xs font-semibold tabular-figures"
                          style={{ color: accentHex }}
                        >
                          pH {soap.nutritionFacts.pHLevel}
                        </span>
                      </div>

                      {/* Visual pH Balance Meter (pH 4.0 to 7.5) */}
                      <div className="space-y-1">
                        <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300 border border-[#B99E74]/45">
                          <span
                            aria-hidden="true"
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FAF4E7] border-2 shadow"
                            style={{
                              left: `${parsePhMarkerPercent(soap.nutritionFacts.pHLevel)}%`,
                              borderColor: accentHex,
                            }}
                          />
                        </div>
                        <div className="flex justify-between font-serif text-[9.5px] text-[#7B6244] dark:text-[#CBBCA6] tabular-figures">
                          <span>{t.modalPhAcidic}</span>
                          <span>{t.modalPhIdeal}</span>
                          <span>{t.modalPhNeutral}</span>
                        </div>
                      </div>

                      {/* Vintage Botanical Ingredient Cards + Proportional Bars */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries({
                          ...soap.nutritionFacts.activeIngredients,
                          ...soap.nutritionFacts.baseAndHydration,
                        }).map(([ingredient, pct]) => {
                          const IngIcon = getIngredientVisualIcon(ingredient);
                          const numPct = Math.min(100, Math.max(8, parseFloat(pct) || 12));
                          return (
                            <div
                              key={ingredient}
                              className="border border-[#C9B38C]/55 dark:border-[#E6C589]/22 bg-[#FDF9F0] dark:bg-[#312B46] px-3 py-2 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2 font-serif text-[11px]">
                                <span className="inline-flex items-center gap-1.5 min-w-0 font-medium text-[#3C2D1E] dark:text-[#F4EBD9]">
                                  <IngIcon className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                                  <span className="truncate">{translateIngredient(ingredient)}</span>
                                </span>
                                <span className="font-semibold tabular-figures shrink-0 text-[#55422E] dark:text-[#EADCC4]">
                                  {pct}
                                </span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-[#E8DEC8] dark:bg-[#231E34] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${numPct}%`,
                                    backgroundColor: barPrimary,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#B99E74]/60 dark:border-[#E6C589]/28 bg-[#F6EEDD] dark:bg-[#2D2840] p-1">
                    <div className="border border-[#B99E74]/45 dark:border-[#E6C589]/22 bg-[#FAF4E7]/90 dark:bg-[#262138]/85 p-3.5 space-y-2.5 text-[#463626] dark:text-[#E5D9C4]">
                      <span className="block font-serif text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7B6244] dark:text-[#CBBCA6] border-b border-dotted border-[#B99E74]/55 dark:border-[#E6C589]/25 pb-1.5">
                        {t.modalBotanicalVisuals}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {soap.bioActives.actives.map((activeName, idx) => {
                          const ActiveIcon = getIngredientVisualIcon(activeName);
                          const barWidth = Math.max(58, 92 - idx * 11);
                          return (
                            <div
                              key={activeName}
                              className="border border-[#C9B38C]/55 dark:border-[#E6C589]/22 bg-[#FDF9F0] dark:bg-[#312B46] px-3 py-2 space-y-1.5"
                            >
                              <div className="flex items-center gap-1.5 font-serif text-[11px] font-medium text-[#3C2D1E] dark:text-[#F4EBD9]">
                                <ActiveIcon className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                                <span className="truncate">{translateIngredient(activeName)}</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-[#E8DEC8] dark:bg-[#231E34] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${barWidth}%`,
                                    backgroundColor: idx % 2 === 0 ? barPrimary : accentHex,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3-Tier Bar Size & Decoy Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('small')}
                    className="p-3 rounded-[18px] border text-left transition-colors cursor-pointer"
                    style={{
                      borderColor: format === 'small' ? accentHex : 'var(--border)',
                      backgroundColor: format === 'small' ? 'var(--surface)' : 'transparent',
                    }}
                  >
                    <p className="text-[11px] font-semibold text-[var(--ink)]">{t.modalSmallSize}</p>
                    <p className="text-sm font-bold tabular-figures mt-0.5" style={{ color: accentHex }}>
                      {formatThb(soap.slice100gUsd)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('full')}
                    className="p-3 rounded-[18px] border-2 text-left transition-colors cursor-pointer"
                    style={{
                      borderColor: format === 'full' ? accentHex : 'var(--border)',
                      backgroundColor: format === 'full' ? 'var(--surface)' : 'transparent',
                    }}
                  >
                    <p className="text-[11px] font-semibold text-[var(--ink)]">
                      {t.modalFullBar} <span style={{ color: accentHex }}>· {t.sizePopular}</span>
                    </p>
                    <p className="text-sm font-bold tabular-figures mt-0.5" style={{ color: accentHex }}>
                      {formatThb(soap.priceUsd)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('mega')}
                    className="p-3 rounded-[18px] border text-left transition-colors cursor-pointer"
                    style={{
                      borderColor: format === 'mega' ? accentHex : 'var(--border)',
                      backgroundColor: format === 'mega' ? 'var(--surface)' : 'transparent',
                    }}
                  >
                    <p className="text-[11px] font-semibold text-[var(--ink)]">{t.modalHugeBlock}</p>
                    <p className="text-sm font-bold tabular-figures mt-0.5" style={{ color: accentHex }}>
                      {formatThb(soap.hugeBlockThb ?? SOAP_PRICE_TIERS.mega)}
                    </p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    onAddToBag(soap, 1, format, e.currentTarget);
                    onClose();
                  }}
                  className="luxury-3d-pill w-full h-11 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="tabular-figures">
                    {t.modalReserveCreation} · {formatThb(activePrice)}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
