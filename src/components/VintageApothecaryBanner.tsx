import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../data/i18n';

const RIBBON_AND_ROSE_ARTIFACT_URL = '/assets/aistudio/802485227409076504_6ba34077.jpg';

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
 * Decorated quietly with a blended Ribbon & Rose archival rose-spray watermark
 * while keeping engraved seal crests and sensory promises framed cleanly.
 */
export const VintageParchmentTicket: React.FC<VintageParchmentTicketProps> = ({
  assayCode,
  soldCount,
  soldUnitLabel,
  ledgerActionLabel,
  onInspectLedger,
}) => {
  return (
    <button
      type="button"
      onClick={onInspectLedger}
      aria-label={`${assayCode} — ${ledgerActionLabel}`}
      className="group/ticket w-full border-t border-[var(--border)] px-4 py-2.5 flex items-center justify-between gap-2 text-[11px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/65 transition-colors cursor-pointer"
    >
      <span className="tabular-figures truncate">
        {soldCount.toLocaleString()} {soldUnitLabel}
      </span>
      <span className="font-medium shrink-0 text-[var(--ink)]/85 group-hover/ticket:text-[var(--ink)]">
        {ledgerActionLabel} →
      </span>
    </button>
  );
};

interface ApothecaryColophonBannerProps {
  mode: 'soaps' | 'bath-bombs';
  accentHex: string;
  onOpenSampleLedger: () => void;
}

/**
 * Full-Width Antique Parchment Broadsheet Ticket placed gently below the
 * sensory gallery columns—stamped quietly with the Ribbon & Rose stationery watermarks.
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
      className="relative overflow-hidden bg-[#F6EEDD] dark:bg-[#2D2840] border border-[#B99E74]/60 dark:border-[#E6C589]/28 p-1.5 shadow-[0_12px_28px_-16px_rgba(92,70,42,0.16)]"
    >
      {/* Inner Double-Hairline Broadsheet Border */}
      <div className="relative overflow-hidden border border-[#B99E74]/45 dark:border-[#E6C589]/22 px-5 sm:px-8 py-5 sm:py-6 bg-[#FAF4E7]/88 dark:bg-[#262138]/80 space-y-4">
        {/* Top-Right Satin Bow & Rose Cameo Stationery Watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 right-6 w-28 h-24 opacity-18 dark:opacity-10 mix-blend-multiply bg-no-repeat"
          style={{
            backgroundImage: `url('${RIBBON_AND_ROSE_ARTIFACT_URL}')`,
            backgroundPosition: '14% 16%',
            backgroundSize: '340%',
          }}
        />
        {/* Bottom-Left Lace Mirror & Pearl Seal Watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -left-2 w-28 h-28 opacity-15 dark:opacity-8 mix-blend-multiply bg-no-repeat"
          style={{
            backgroundImage: `url('${RIBBON_AND_ROSE_ARTIFACT_URL}')`,
            backgroundPosition: '88% 60%',
            backgroundSize: '390%',
          }}
        />

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
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-dotted border-[#B99E74]/60 dark:border-[#E6C589]/25 pb-3.5">
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
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 font-serif text-[11px] leading-[1.6] text-[#55422E] dark:text-[#DCD0BA]">
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

        {/* Expandable Provenance Story Index */}
        {isAssayExpanded && (
          <div className="relative z-10 pt-4 border-t border-dotted border-[#B99E74]/60 dark:border-[#E6C589]/25 space-y-2.5 font-serif text-[10.5px] leading-[1.65] text-[#5C4936] dark:text-[#D7CAAF]">
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
