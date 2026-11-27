import React, { memo, useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Flame, Gift, ZoomIn } from 'lucide-react';
import { SABLE_CARD_HOVER } from '../utils/sableMotion';
import {
  BATH_BOMB_BY_ID,
  BATH_BOMB_MARBLE_CASES,
  BathBombCreation,
  BathBombMarbleCaseEdition,
} from '../data/bathBombs';
import {
  formatThb,
  LOOFAH_SCRUB_OPTIONS,
  RIBBON_SEAL_OPTIONS,
} from '../data/soaps';
import { getMatchingCandleForLine, MARBLE_CASE_SUITE_IMAGE_URL } from '../data/aromaticCandles';
import { LOOFAH_TH, RIBBON_TH, useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { RedesignedLogoMotif } from './RedesignedLogoMotif';
import { MarbleBoxRibbonMockup } from './MarbleBoxRibbonMockup';
import type { ZoomableImageTarget } from './ImageZoomModal';

interface BathBombMarbleCasesSectionProps {
  accentHex: string;
  accentTextHex?: string;
  onOpenNutritionModal: (bombId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddBombCaseToBag: (
    bombCase: BathBombMarbleCaseEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
  ) => void;
}

const LoofahPadSvg: React.FC<{ swatchHex: string }> = ({ swatchHex }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `bb-lufa-${swatchHex.replace('#', '')}-${uid}`;

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

interface BathBombMarbleCaseCardProps {
  edition: BathBombMarbleCaseEdition;
  accentHex: string;
  accentTextHex: string;
  onOpenNutritionModal: (bombId: string) => void;
  onZoomImage?: (target: ZoomableImageTarget) => void;
  onAddBombCaseToBag: (
    bombCase: BathBombMarbleCaseEdition,
    ribbonFinish: string,
    giftNote: string,
    imageUrl: string,
  ) => void;
}

const BathBombMarbleCaseCard: React.FC<BathBombMarbleCaseCardProps> = memo(({
  edition,
  accentHex,
  accentTextHex,
  onOpenNutritionModal,
  onZoomImage,
  onAddBombCaseToBag,
}) => {
  const { lang, t } = useLanguage();
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
  const title = lang === 'th' ? edition.titleTh : edition.titleEn;
  const themeLabel = lang === 'th' ? edition.themeLabelTh : edition.themeLabelEn;
  const desc = lang === 'th' ? edition.descTh : edition.descEn;

  const matchingCandle = getMatchingCandleForLine(edition.stoneType);
  const candleName = lang === 'th' ? matchingCandle.nameTh : matchingCandle.nameEn;
  const candleSplit = lang === 'th' ? matchingCandle.splitSpecTh : matchingCandle.splitSpecEn;
  const candleAroma = lang === 'th' ? matchingCandle.aromaTh : matchingCandle.aromaEn;

  const selectedRibbon =
    RIBBON_SEAL_OPTIONS.find((r) => r.id === selectedRibbonId) ?? RIBBON_SEAL_OPTIONS[0];
  const ribbonName =
    lang === 'th' ? RIBBON_TH[selectedRibbon.id] ?? selectedRibbon.name : selectedRibbon.name;

  const interiorGroups = useMemo(() => {
    const resolveBombs = (ids: string[]): BathBombCreation[] =>
      ids
        .map((id) => BATH_BOMB_BY_ID.get(id))
        .filter((b): b is BathBombCreation => Boolean(b));

    return [
      { label: t.bathCasesBrightRow, items: resolveBombs(edition.brightBombIds) },
      { label: t.bathCasesDarkRow, items: resolveBombs(edition.darkBombIds) },
      { label: t.bathCasesHolidayRow, items: resolveBombs(edition.holidayBombIds) },
    ];
  }, [
    edition.brightBombIds,
    edition.darkBombIds,
    edition.holidayBombIds,
    t.bathCasesBrightRow,
    t.bathCasesDarkRow,
    t.bathCasesHolidayRow,
  ]);

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
    onAddBombCaseToBag(
      edition,
      `${ribbonName} · ${l1.label} + ${candleName}`,
      engravingNote.trim(),
      edition.imageUrl,
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
      {/* Large Aspect-Square Studio 9-Bomb Marble Case Stage with Suite Toggle & 4K Zoom */}
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
                activeBadge: `${formatThb(edition.priceThb)} · ${t.bathCasesInteriorCount}`,
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20"
        />
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 text-white space-y-1">
          <div className="flex items-center justify-between gap-2 text-[10.5px] text-amber-200 font-semibold">
            <span className="truncate">{themeLabel}</span>
            <span className="inline-flex items-baseline gap-1.5 shrink-0 tabular-figures">
              <span className="text-sm font-bold text-white">{formatThb(edition.priceThb)}</span>
              <span className="text-[10px] line-through text-white/60">
                {formatThb(edition.compareAtThb)}
              </span>
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white leading-snug line-clamp-1 drop-shadow-sm">
            {title}
          </h3>
          <p className="text-[11px] text-white/85 line-clamp-1">{desc}</p>
        </div>
        <div aria-hidden="true" className="shimmer z-10" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">

          {/* 3D Interactive Marble Coffret & Silk Ribbon Lid Mockup */}
          <MarbleBoxRibbonMockup
            stoneType={edition.stoneType}
            setName={title}
            ribbon={{ ...selectedRibbon, name: ribbonName }}
            engravingNote={engravingNote}
          />

          {/* 9 Bath Bombs Inside Coffret (3 Dark + 3 Bright + 3 Holidays) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[var(--ink)]">{t.bathCasesInteriorLabel}</span>
              <span className="tabular-figures font-medium" style={{ color: accentHex }}>
                {t.bathCasesInteriorCount}
              </span>
            </div>

            <div className="space-y-2">
              {interiorGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {group.items.map((bomb) => {
                      const bombName = lang === 'th' ? bomb.nameTh : bomb.nameEn;
                      return (
                        <button
                          key={bomb.id}
                          type="button"
                          onClick={() => onOpenNutritionModal(bomb.id)}
                          title={`${bombName} · ${t.bathNutritionBtn}`}
                          className="group/thumb flex flex-col gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/35 transition-colors cursor-pointer text-left"
                        >
                          <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border border-[var(--border)]">
                            <img
                              src={bomb.imageUrl}
                              alt={bombName}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                            />
                            <div aria-hidden="true" className="shimmer" />
                          </div>
                          <span className="text-[9.5px] font-medium text-[var(--ink)] truncate px-0.5">
                            {bombName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                    <LoofahPadSvg swatchHex={loofahOne.swatchHex} />
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

          {/* Silk Ribbon & Brass Plaque Engraving */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--muted)] truncate">
                {t.ribbonLabel}: <strong className="text-[var(--ink)] font-medium">{ribbonName}</strong>
              </span>

              <div
                role="radiogroup"
                aria-label={`${title} ${t.ribbonLabel}`}
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
                {t.reserveCaseBtn} · {formatThb(edition.priceThb)}
              </span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
});

BathBombMarbleCaseCard.displayName = 'BathBombMarbleCaseCard';

export const BathBombMarbleCasesSection: React.FC<BathBombMarbleCasesSectionProps> = memo(({
  accentHex,
  accentTextHex = '#FFFFFF',
  onOpenNutritionModal,
  onZoomImage,
  onAddBombCaseToBag,
}) => {
  const { t } = useLanguage();

  const darkCase = BATH_BOMB_MARBLE_CASES.find((c) => c.stoneType === 'dark-marble') ?? BATH_BOMB_MARBLE_CASES[0];
  const brightCase = BATH_BOMB_MARBLE_CASES.find((c) => c.stoneType === 'bright-marble') ?? BATH_BOMB_MARBLE_CASES[1];
  const holidaysCase = BATH_BOMB_MARBLE_CASES.find((c) => c.stoneType === 'checkered-occasions') ?? BATH_BOMB_MARBLE_CASES[2];

  const orderedCases = [brightCase, darkCase, holidaysCase];

  return (
    <section
      id="gifting"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="atelier-container py-10 lg:py-14 2xl:py-16 space-y-8">
        <div className="border-b border-[var(--border)] pb-5 space-y-1">
          <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: accentHex }}>
            {t.bathCasesEyebrow}
          </p>
          <h2 className="marshmallow-text font-serif fluid-section-display font-medium text-[var(--ink)] balance-text">
            {t.bathCasesHeading}
          </h2>
          <p className="text-xs text-[var(--muted)] tabular-figures">
            {t.bathCasesSubSummary}
          </p>
        </div>

        {/* 3 Matching Marble Cases (Bright · Dark · Events) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 2xl:gap-9 items-stretch">
          {orderedCases.map((edition) => (
            <div key={edition.id} className="w-full flex [&>*]:w-full">
              <BathBombMarbleCaseCard
                edition={edition}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                onOpenNutritionModal={onOpenNutritionModal}
                onZoomImage={onZoomImage}
                onAddBombCaseToBag={onAddBombCaseToBag}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

BathBombMarbleCasesSection.displayName = 'BathBombMarbleCasesSection';
