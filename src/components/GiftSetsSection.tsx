import React, { memo, useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Flame, Gift, ZoomIn } from 'lucide-react';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import {
  formatThb,
  LOOFAH_SCRUB_OPTIONS,
  MARBLE_CASSETTE_SETS,
  MarbleCassetteEdition,
  RIBBON_SEAL_OPTIONS,
  SOAP_BY_ID,
} from '../data/soaps';
import { getMatchingCandleForLine, MARBLE_CASE_SUITE_IMAGE_URL } from '../data/aromaticCandles';
import { LOOFAH_TH, RIBBON_TH, useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { RedesignedLogoMotif } from './RedesignedLogoMotif';
import { MarbleBoxRibbonMockup } from './MarbleBoxRibbonMockup';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface GiftSetsSectionProps {
  accentHex: string;
  accentTextHex?: string;
  onOpenPodium: (soapId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddGiftSetToBag: (
    giftSet: MarbleCassetteEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
    sourceEl?: HTMLElement | null,
  ) => void;
}

const LoofahScrubVisual: React.FC<{ swatchHex: string }> = ({ swatchHex }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `lufa-${swatchHex.replace('#', '')}-${uid}`;

  return (
    <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
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
        <path d="M18 11 Q21 24 17 37 M24 9 Q26 24 24 39 M30 11 Q28 24 31 37" />
      </g>
      <circle cx="24" cy="24" r="4" fill="none" stroke="rgba(90,72,54,0.35)" strokeWidth="1.2" />
    </svg>
  );
};

interface ThemedMarbleCaseCardProps {
  edition: MarbleCassetteEdition;
  themeLabel: string;
  accentHex: string;
  accentTextHex: string;
  onOpenPodium: (soapId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddGiftSetToBag: (
    giftSet: MarbleCassetteEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
    sourceEl?: HTMLElement | null,
  ) => void;
}

const ThemedMarbleCaseCard: React.FC<ThemedMarbleCaseCardProps> = memo(({
  edition,
  themeLabel,
  accentHex,
  accentTextHex,
  onOpenPodium,
  onZoomImage,
  onAddGiftSetToBag,
}) => {
  const { lang, t, getCaseDisplay, getSoapDisplay } = useLanguage();
  const [selectedRibbonId, setSelectedRibbonId] = useState<string>(
    edition.stoneType === 'dark-marble'
      ? 'wax-espresso'
      : edition.stoneType === 'checkered-occasions'
        ? 'wax-crimson'
        : 'wax-gold',
  );
  const [loofahOneId, setLoofahOneId] = useState<string>(
    edition.stoneType === 'dark-marble'
      ? LOOFAH_SCRUB_OPTIONS[2].id
      : edition.stoneType === 'checkered-occasions'
        ? LOOFAH_SCRUB_OPTIONS[3].id
        : LOOFAH_SCRUB_OPTIONS[0].id,
  );
  const [studioView, setStudioView] = useState<'coffret' | 'suite'>('coffret');
  const [engravingNote, setEngravingNote] = useState<string>('GENTLEBUBBLE BY AR');
  const [justAdded, setJustAdded] = useState(false);

  const engravingInputId = useId();
  const caseCopy = getCaseDisplay(edition);
  const matchingCandle = getMatchingCandleForLine(edition.stoneType);
  const candleName = lang === 'th' ? matchingCandle.nameTh : matchingCandle.nameEn;
  const candleSplit = lang === 'th' ? matchingCandle.splitSpecTh : matchingCandle.splitSpecEn;
  const candleAroma = lang === 'th' ? matchingCandle.aromaTh : matchingCandle.aromaEn;

  const selectedRibbon =
    RIBBON_SEAL_OPTIONS.find((r) => r.id === selectedRibbonId) ?? RIBBON_SEAL_OPTIONS[0];
  const ribbonName =
    lang === 'th' ? RIBBON_TH[selectedRibbon.id] ?? selectedRibbon.name : selectedRibbon.name;

  const includedBars = useMemo(
    () =>
      [...edition.darkRowIds, ...edition.brightRowIds, ...(edition.holidayRowIds ?? [])]
        .map((id) => SOAP_BY_ID.get(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [edition.darkRowIds, edition.brightRowIds, edition.holidayRowIds],
  );

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

  const handleReserve = (e: React.MouseEvent<HTMLButtonElement>) => {
    const l1 = getLoofahDisplay(loofahOne);
    onAddGiftSetToBag(
      edition,
      `${ribbonName} · ${l1.label} + ${candleName}`,
      engravingNote.trim(),
      edition.imageUrl,
      e.currentTarget,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const activePhotoSrc = studioView === 'coffret' ? edition.imageUrl : MARBLE_CASE_SUITE_IMAGE_URL;

  return (
    <motion.article
      whileHover={SABLE_CARD_HOVER}
      className="group sable-motion-card luxury-3d-card overflow-hidden flex flex-col"
    >
      {/* Large Aspect-Square Studio Stage with Floating Title/Price Scrim, Suite Toggle & 4K Zoom */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
        <ResilientImage
          src={activePhotoSrc}
          alt={caseCopy.name}
          fallbackTitle={caseCopy.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
        />

        {/* Top-left Photo View Toggle (Coffret vs. 1× Loofah + 1× Candle Suite) */}
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
                alt: caseCopy.name,
                title: caseCopy.shortTitle,
                activeBadge: `${formatThb(edition.priceUsd)} · ${t.soapsAnd2Loofahs}`,
              })
            }
            aria-label={`${t.zoom4kLabel} ${caseCopy.shortTitle}`}
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
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 text-white space-y-1">
          <div className="flex items-center justify-between gap-2 text-[10.5px] text-amber-200 font-semibold">
            <span className="truncate">{themeLabel}</span>
            <span className="inline-flex items-baseline gap-1.5 shrink-0 tabular-figures">
              <span className="text-sm font-bold text-white">{formatThb(edition.priceUsd)}</span>
              <span className="text-[10px] line-through text-white/60">
                {formatThb(edition.compareAtUsd)}
              </span>
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white leading-snug line-clamp-1 drop-shadow-sm">
            {caseCopy.shortTitle}
          </h3>
          <p className="text-[11px] text-white/85 line-clamp-1">{caseCopy.description}</p>
        </div>

        <div aria-hidden="true" className="shimmer z-10" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">

          {/* 3D Interactive Marble Coffret & Silk Ribbon Lid Mockup */}
          <MarbleBoxRibbonMockup
            stoneType={edition.stoneType}
            setName={caseCopy.shortTitle}
            ribbon={{ ...selectedRibbon, name: ribbonName }}
            engravingNote={engravingNote}
          />

          {/* 10 Real Soaps Inside Case */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[var(--ink)]">{t.interiorLabel}</span>
              <span className="tabular-figures font-medium" style={{ color: accentHex }}>
                {includedBars.length} {t.interiorCountSuffix}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {includedBars.map((soap) => {
                const soapDisplay = getSoapDisplay(soap);
                return (
                  <button
                    key={soap.id}
                    type="button"
                    onClick={() => onOpenPodium(soap.id)}
                    title={soapDisplay.name}
                    className="group/thumb flex flex-col gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/35 transition-colors cursor-pointer text-left"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border border-[var(--border)]">
                      <img
                        src={soap.imageUrl}
                        alt={soapDisplay.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                      />
                      <div aria-hidden="true" className="shimmer" />
                    </div>
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
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--ink)]/40 transition-colors cursor-pointer text-left"
                  >
                    <LoofahScrubVisual swatchHex={loofahOne.swatchHex} />
                    <div className="min-w-0">
                      <p
                        className="text-[9.5px] font-semibold uppercase tracking-wider truncate"
                        style={{ color: accentHex }}
                      >
                        {t.loofahSlotLabel}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--ink)] truncate">
                        {lCopy.label}
                      </p>
                      <p className="text-[9.5px] text-[var(--muted)] truncate">{lCopy.material}</p>
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
                className="flex items-center gap-2.5 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 hover:border-[var(--ink)]/40 transition-colors cursor-pointer text-left group/candle"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
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
                  <p className="text-[11px] font-semibold text-[var(--ink)] truncate">{candleName}</p>
                  <p className="text-[9.5px] text-[var(--muted)] truncate">{candleAroma}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Ribbon Swatches & Brass Plaque Engraving */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--muted)] truncate">
                {t.ribbonLabel}: <strong className="text-[var(--ink)] font-medium">{ribbonName}</strong>
              </span>

              <div
                role="radiogroup"
                aria-label={`${caseCopy.shortTitle} ${t.ribbonLabel}`}
                className="inline-flex items-center gap-1.5 shrink-0"
              >
                {RIBBON_SEAL_OPTIONS.map((ribbon) => {
                  const selected = ribbon.id === selectedRibbon.id;
                  const optLabel =
                    lang === 'th' ? RIBBON_TH[ribbon.id] ?? ribbon.name : ribbon.name;
                  return (
                    <button
                      key={ribbon.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={optLabel}
                      title={optLabel}
                      onClick={() => setSelectedRibbonId(ribbon.id)}
                      className="w-5 h-5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 34% 30%, ${ribbon.highlightHex} 0%, ${ribbon.swatch} 58%, ${ribbon.shadowHex} 100%)`,
                        boxShadow: selected
                          ? `0 0 0 2px var(--surface-card), 0 0 0 3.5px ${ribbon.swatch}`
                          : 'inset 0 1px 2px rgba(255,255,255,0.45)',
                        transform: selected ? 'scale(1.12)' : undefined,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-2.5">
              <RedesignedLogoMotif
                variant="wax-seal"
                size={38}
                engravingNote={engravingNote || 'GENTLEBUBBLE'}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-0.5">
                <label
                  htmlFor={engravingInputId}
                  className="block text-[10px] font-medium text-[var(--muted)] truncate"
                >
                  {t.brassEngravingLabel}
                </label>
                <input
                  id={engravingInputId}
                  type="text"
                  maxLength={40}
                  value={engravingNote}
                  onChange={(e) => setEngravingNote(e.target.value)}
                  placeholder={t.brassPlaceholder}
                  className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-[var(--border)] bg-[var(--surface-card)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReserve}
          className="luxury-3d-pill w-full h-10 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: accentHex, color: accentTextHex }}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t.reservedCaseBtn}</span>
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              <span className="tabular-figures">
                {t.reserveCaseBtn} · {formatThb(edition.priceUsd)}
              </span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
});

ThemedMarbleCaseCard.displayName = 'ThemedMarbleCaseCard';

export const GiftSetsSection: React.FC<GiftSetsSectionProps> = memo(({
  accentHex,
  accentTextHex = '#FFFFFF',
  onOpenPodium,
  onZoomImage,
  onAddGiftSetToBag,
}) => {
  const { t } = useLanguage();

  const darkCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'dark-marble') ?? MARBLE_CASSETTE_SETS[1];
  const brightCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'bright-marble') ?? MARBLE_CASSETTE_SETS[0];
  const occasionsCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'checkered-occasions') ?? MARBLE_CASSETTE_SETS[2];

  const orderedThemeCases = [
    { edition: brightCase, themeLabel: t.brightSetTheme },
    { edition: darkCase, themeLabel: t.darkSetTheme },
    { edition: occasionsCase, themeLabel: t.occasionsSetTheme },
  ];

  return (
    <section
      id="gifting"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-8">
        <div className="border-b border-[var(--border)] pb-5 space-y-1">
          <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: accentHex }}>
            {t.casesEyebrow}
          </p>
          <h2 className="marshmallow-text font-serif fluid-section-display font-medium text-[var(--ink)] balance-text">
            {t.casesHeading}
          </h2>
          <p className="text-xs text-[var(--muted)] tabular-figures">
            {t.casesSubSummary}
          </p>
        </div>

        {/* 3 Themed Marble Case Set Boxes (Bright · Dark · Events) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 2xl:gap-9 items-stretch">
          {orderedThemeCases.map(({ edition, themeLabel }) => (
            <div key={edition.id} className="w-full flex [&>*]:w-full">
              <ThemedMarbleCaseCard
                edition={edition}
                themeLabel={themeLabel}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                onOpenPodium={onOpenPodium}
                onZoomImage={onZoomImage}
                onAddGiftSetToBag={onAddGiftSetToBag}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

GiftSetsSection.displayName = 'GiftSetsSection';
