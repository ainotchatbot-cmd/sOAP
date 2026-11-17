import React, { memo, useId, useMemo, useState } from 'react';
import { ArrowUpDown, Check, Gift } from 'lucide-react';
import {
  formatThb,
  LOOFAH_SCRUB_OPTIONS,
  MARBLE_CASSETTE_SETS,
  MarbleCassetteEdition,
  RIBBON_SEAL_OPTIONS,
  SOAP_BY_ID,
} from '../data/soaps';
import { LOOFAH_TH, RIBBON_TH, useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { RedesignedLogoMotif } from './RedesignedLogoMotif';
import { MarbleBoxRibbonMockup } from './MarbleBoxRibbonMockup';

interface GiftSetsSectionProps {
  accentHex: string;
  accentTextHex?: string;
  onOpenPodium: (soapId: string) => void;
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
  const [loofahTwoId, setLoofahTwoId] = useState<string>(LOOFAH_SCRUB_OPTIONS[1].id);
  const [engravingNote, setEngravingNote] = useState<string>('GENTLEBUBBLE BY AR');
  const [justAdded, setJustAdded] = useState(false);

  const engravingInputId = useId();
  const caseCopy = getCaseDisplay(edition);
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
  const loofahTwo = LOOFAH_SCRUB_OPTIONS.find((l) => l.id === loofahTwoId) ?? LOOFAH_SCRUB_OPTIONS[1];

  const getLoofahDisplay = (opt: (typeof LOOFAH_SCRUB_OPTIONS)[number]) =>
    lang === 'th'
      ? LOOFAH_TH[opt.id] ?? { label: opt.label, material: opt.material }
      : { label: opt.label, material: opt.material };

  const handleCycleLoofah = (slot: 1 | 2) => {
    const currentId = slot === 1 ? loofahOne.id : loofahTwo.id;
    const idx = LOOFAH_SCRUB_OPTIONS.findIndex((l) => l.id === currentId);
    const nextOption = LOOFAH_SCRUB_OPTIONS[(idx + 1) % LOOFAH_SCRUB_OPTIONS.length];
    if (slot === 1) setLoofahOneId(nextOption.id);
    else setLoofahTwoId(nextOption.id);
  };

  const handleReserve = (e: React.MouseEvent<HTMLButtonElement>) => {
    const l1 = getLoofahDisplay(loofahOne);
    const l2 = getLoofahDisplay(loofahTwo);
    onAddGiftSetToBag(
      edition,
      `${ribbonName} · ${l1.label} + ${l2.label}`,
      engravingNote.trim(),
      edition.imageUrl,
      e.currentTarget,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="luxury-3d-card overflow-hidden flex flex-col">
      {/* Column Theme Header + Studio Case Image */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/75 flex items-center justify-between gap-2">
        <span
          className="text-[11px] font-semibold tracking-[0.06em] truncate"
          style={{ color: accentHex }}
        >
          {themeLabel}
        </span>
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="text-sm font-semibold tabular-figures text-[var(--ink)]">
            {formatThb(edition.priceUsd)}
          </span>
          <span className="text-[10.5px] line-through tabular-figures text-[var(--muted)]">
            {formatThb(edition.compareAtUsd)}
          </span>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface)]">
        <ResilientImage
          src={edition.imageUrl}
          alt={caseCopy.name}
          fallbackTitle={caseCopy.name}
          className="w-full h-full object-cover"
        />
        <div aria-hidden="true" className="shimmer z-10" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-medium text-[var(--ink)] leading-snug">
              {caseCopy.shortTitle}
            </h3>
            <p className="text-[11.5px] text-[var(--muted)] leading-relaxed">
              {caseCopy.description}
            </p>
          </div>

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

          {/* Dedicated 2 Natural Loofah Scrub Slots */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between gap-2 text-[10.5px] text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">{t.loofahTitle}</span>
              <span className="truncate">{t.loofahTapHint}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { slot: 1 as const, option: loofahOne },
                { slot: 2 as const, option: loofahTwo },
              ].map(({ slot, option }) => {
                const lCopy = getLoofahDisplay(option);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleCycleLoofah(slot)}
                    className="flex items-center gap-2 p-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/80 hover:border-[var(--ink)]/40 transition-colors cursor-pointer text-left"
                  >
                    <LoofahScrubVisual swatchHex={option.swatchHex} />
                    <div className="min-w-0">
                      <p
                        className="text-[9.5px] font-semibold uppercase tracking-wider truncate"
                        style={{ color: accentHex }}
                      >
                        {t.loofahSlotLabel}{slot}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--ink)] truncate">
                        {lCopy.label}
                      </p>
                    </div>
                  </button>
                );
              })}
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
    </article>
  );
});

ThemedMarbleCaseCard.displayName = 'ThemedMarbleCaseCard';

export const GiftSetsSection: React.FC<GiftSetsSectionProps> = memo(({
  accentHex,
  accentTextHex = '#FFFFFF',
  onOpenPodium,
  onAddGiftSetToBag,
}) => {
  const { t } = useLanguage();
  const [caseOrder, setCaseOrder] = useState<'match-3-lines' | 'bright-first' | 'occasions-first'>(
    'match-3-lines',
  );

  const darkCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'dark-marble') ?? MARBLE_CASSETTE_SETS[1];
  const brightCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'bright-marble') ?? MARBLE_CASSETTE_SETS[0];
  const occasionsCase = MARBLE_CASSETTE_SETS.find((c) => c.stoneType === 'checkered-occasions') ?? MARBLE_CASSETTE_SETS[2];

  const darkEntry = { edition: darkCase, themeLabel: t.darkSetTheme };
  const brightEntry = { edition: brightCase, themeLabel: t.brightSetTheme };
  const occasionsEntry = { edition: occasionsCase, themeLabel: t.occasionsSetTheme };

  const orderedThemeCases =
    caseOrder === 'bright-first'
      ? [brightEntry, darkEntry, occasionsEntry]
      : caseOrder === 'occasions-first'
        ? [occasionsEntry, brightEntry, darkEntry]
        : [darkEntry, brightEntry, occasionsEntry];

  return (
    <section
      id="gifting"
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-14 space-y-8">
        <div className="luxury-3d-card px-5 py-4 bg-[var(--surface-card)]/94 backdrop-blur-md flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: accentHex }}>
              {t.casesEyebrow}
            </p>
            <h2 className="marshmallow-text font-serif text-3xl sm:text-4xl font-medium text-[var(--ink)] balance-text">
              {t.casesHeading}
            </h2>
            <p className="text-xs text-[var(--muted)] tabular-figures">
              {t.casesSubSummary}
            </p>
          </div>

          <label className="luxury-3d-pill inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-xs font-medium text-[var(--ink)] cursor-pointer self-start lg:self-end shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
            <span className="sr-only">{t.caseSortLabel}</span>
            <select
              value={caseOrder}
              onChange={(e) =>
                setCaseOrder(
                  e.target.value as 'match-3-lines' | 'bright-first' | 'occasions-first',
                )
              }
              aria-label={t.caseSortLabel}
              className="bg-transparent text-xs font-medium text-[var(--ink)] focus:outline-none cursor-pointer pr-1"
            >
              <option value="match-3-lines">{t.caseSortMatch}</option>
              <option value="bright-first">{t.caseSortBrightFirst}</option>
              <option value="occasions-first">{t.caseSortOccasionsFirst}</option>
            </select>
          </label>
        </div>

        {/* 3 Themed Marble Case Set Boxes Aligned Directly Below Dark | Bright | Occasions Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
          {orderedThemeCases.map(({ edition, themeLabel }) => (
            <ThemedMarbleCaseCard
              key={edition.id}
              edition={edition}
              themeLabel={themeLabel}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              onOpenPodium={onOpenPodium}
              onAddGiftSetToBag={onAddGiftSetToBag}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

GiftSetsSection.displayName = 'GiftSetsSection';
