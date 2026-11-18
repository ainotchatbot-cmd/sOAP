import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../data/i18n';

interface VintageParchmentTicketProps {
  assayCode: string;
  finePrintText: string;
  craftSpecText: string;
  soldCount: number;
  soldUnitLabel: string;
  ledgerActionLabel: string;
  onInspectLedger: () => void;
}

/**
 * Recessed Antique Parchment Ticket attached beneath sensory cards.
 * Keeps clinical ingredients, gold leaf ratios, grooves, and sold tallies
 * quietly documented in vintage serif micro-type without interrupting the
 * emotional dream above.
 */
export const VintageParchmentTicket: React.FC<VintageParchmentTicketProps> = ({
  assayCode,
  finePrintText,
  craftSpecText,
  soldCount,
  soldUnitLabel,
  ledgerActionLabel,
  onInspectLedger,
}) => {
  return (
    <div
      onClick={onInspectLedger}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInspectLedger();
        }
      }}
      aria-label={`${assayCode} — ${ledgerActionLabel}`}
      className="group/ticket relative border-t border-dotted border-[#B69B71]/60 dark:border-[#E6C589]/25 bg-[#F7F0E2] dark:bg-[#2D2840] px-4 sm:px-5 py-2.5 text-left cursor-pointer transition-colors duration-150 hover:bg-[#F3E9D6] dark:hover:bg-[#342E4A]"
    >
      {/* Subtle Vintage Coupon Seam Notches */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[var(--surface-card)] border border-[#C9B38C]/50 dark:border-[#E6C589]/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[var(--surface-card)] border border-[#C9B38C]/50 dark:border-[#E6C589]/20"
      />

      {/* Inner Archival Hairline Ticket Box */}
      <div className="border border-[#C9B38C]/55 dark:border-[#E6C589]/22 px-2.5 py-2 space-y-1 bg-[#FAF5EB]/70 dark:bg-[#262138]/55">
        <div className="flex items-center justify-between gap-2 text-[9px] font-serif tracking-[0.14em] uppercase text-[#7B6449] dark:text-[#CBBCA6]">
          <span className="truncate">{assayCode}</span>
          <span className="tabular-figures shrink-0">
            {soldCount.toLocaleString()} {soldUnitLabel}
          </span>
        </div>

        <p className="font-serif italic text-[10px] leading-[1.45] text-[#4E3D2B] dark:text-[#E5D9C4] line-clamp-2">
          {finePrintText}
        </p>

        <div className="pt-1 border-t border-dotted border-[#C9B38C]/55 dark:border-[#E6C589]/20 flex items-center justify-between gap-2 text-[9.5px] font-serif text-[#745D44] dark:text-[#CBBCA6]">
          <span className="truncate">{craftSpecText}</span>
          <span className="shrink-0 font-medium underline decoration-[#B89A6C]/60 underline-offset-2 group-hover/ticket:text-[#2D2115] dark:group-hover/ticket:text-[#FFF8EC] transition-colors">
            {ledgerActionLabel} →
          </span>
        </div>
      </div>
    </div>
  );
};

interface ApothecaryColophonBannerProps {
  mode: 'soaps' | 'bath-bombs';
  accentHex: string;
  onOpenSampleLedger: () => void;
}

/**
 * Full-Width Antique Parchment Broadsheet Ticket placed gently below the
 * sensory gallery columns—delivering rational ingredient & biotech proof
 * as an heirloom discovery.
 */
export const ApothecaryColophonBanner: React.FC<ApothecaryColophonBannerProps> = ({
  mode,
  onOpenSampleLedger,
}) => {
  const { t } = useLanguage();
  const [isAssayExpanded, setIsAssayExpanded] = useState(false);

  const isBombs = mode === 'bath-bombs';

  return (
    <aside
      aria-label={t.colophonBannerTitle}
      className="relative bg-[#F6EEDD] dark:bg-[#2D2840] border border-[#B99E74]/60 dark:border-[#E6C589]/28 p-1.5 shadow-[0_14px_34px_-16px_rgba(92,70,42,0.18)]"
    >
      {/* Inner Double-Hairline Broadsheet Border */}
      <div className="relative border border-[#B99E74]/45 dark:border-[#E6C589]/22 px-5 sm:px-8 py-5 sm:py-6 bg-[#FAF4E7]/85 dark:bg-[#262138]/75 space-y-4">
        {/* Corner Registration Marks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#9F8256]/75 dark:border-[#E6C589]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#9F8256]/75 dark:border-[#E6C589]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#9F8256]/75 dark:border-[#E6C589]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#9F8256]/75 dark:border-[#E6C589]/45"
        />

        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-dotted border-[#B99E74]/60 dark:border-[#E6C589]/25 pb-3.5">
          <div className="space-y-1">
            <p className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#7B6244] dark:text-[#D5C3A5]">
              {t.colophonEyebrow}
            </p>
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#3C2D1E] dark:text-[#F4EBD9]">
              {isBombs ? t.colophonBombsTitle : t.colophonSoapsTitle}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSampleLedger}
              className="font-serif text-[11px] font-medium text-[#5A442E] dark:text-[#E6D5BA] underline decoration-[#A6885C]/65 underline-offset-4 hover:text-[#2D2013] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.colophonSampleLedgerBtn} →
            </button>
            <button
              type="button"
              onClick={() => setIsAssayExpanded((prev) => !prev)}
              aria-expanded={isAssayExpanded}
              className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#B99E74]/65 dark:border-[#E6C589]/30 bg-[#F2E7D2]/80 dark:bg-[#332D48] font-serif text-[11px] font-medium text-[#463423] dark:text-[#EFE4D0] hover:bg-[#EBDEC5] dark:hover:bg-[#3B3454] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{isAssayExpanded ? t.colophonHideAssayBtn : t.colophonReadAssayBtn}</span>
              {isAssayExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Fine-Print 3-Column Provenance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 font-serif text-[11px] leading-[1.6] text-[#55422E] dark:text-[#DCD0BA]">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#7B6244] dark:text-[#C8B79B] font-semibold">
              {t.colophonCol1Label}
            </p>
            <p>{isBombs ? t.colophonBombsCol1Text : t.colophonSoapsCol1Text}</p>
          </div>
          <div className="space-y-1 md:border-l md:border-dotted md:border-[#B99E74]/50 dark:md:border-[#E6C589]/22 md:pl-5">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#7B6244] dark:text-[#C8B79B] font-semibold">
              {t.colophonCol2Label}
            </p>
            <p>{isBombs ? t.colophonBombsCol2Text : t.colophonSoapsCol2Text}</p>
          </div>
          <div className="space-y-1 md:border-l md:border-dotted md:border-[#B99E74]/50 dark:md:border-[#E6C589]/22 md:pl-5">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#7B6244] dark:text-[#C8B79B] font-semibold">
              {t.colophonCol3Label}
            </p>
            <p>{isBombs ? t.colophonBombsCol3Text : t.colophonSoapsCol3Text}</p>
          </div>
        </div>

        {/* Expandable Deep Botanical & Vitamin Formulation Index */}
        {isAssayExpanded && (
          <div className="pt-4 border-t border-dotted border-[#B99E74]/60 dark:border-[#E6C589]/25 space-y-2.5 font-serif text-[10.5px] leading-[1.65] text-[#5C4936] dark:text-[#D7CAAF]">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#7B6244] dark:text-[#C8B79B] font-semibold">
              {t.colophonExpandedTitle}
            </p>
            <p>{isBombs ? t.colophonBombsExpandedText : t.colophonSoapsExpandedText}</p>
            <p className="italic text-[#7B6244] dark:text-[#BFB096]">
              {t.colophonBiotechFootnote}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
