import React, { memo, useId, useMemo, useState } from 'react';
import {
  Check,
  Crown,
  Gift,
  Heart,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Unlock,
  X,
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
  VAULT_CATEGORIES,
  VAULT_MARBLE_BOXES,
  VAULT_PAIR_BY_ID,
  VAULT_PAIRED_FORMULATIONS,
  VAULT_PRICING,
  VaultBenefitCategoryId,
  VaultMarbleBoxEdition,
  VaultPairedFormulation,
  VictorianGrooveStyle,
} from '../data/memberVaultCatalog';
import { ResilientImage } from './ResilientImage';
import { MarbleBoxRibbonMockup } from './MarbleBoxRibbonMockup';
import { ApothecaryColophonBanner, VintageParchmentTicket } from './VintageApothecaryBanner';

interface SecretVaultSectionProps {
  user: User | null;
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  itemSoldDeltas?: Record<string, number>;
  onSignIn: () => Promise<void> | void;
  onToggleWishlist: (itemId: string) => void;
  onAddVaultToBag: (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => void;
  onAddVaultMarbleBoxToBag: (
    box: VaultMarbleBoxEdition,
    ribbonAndLoofahs: string,
    engravingNote: string,
  ) => void;
}

const GROOVE_STYLE_LABELS: Record<VictorianGrooveStyle, { en: string; th: string }> = {
  'fluted-crest': { en: 'Fluted Crest', th: 'ร่องเสาคลาสสิก' },
  'crown-filigree': { en: 'Crown Filigree', th: 'ลายมงกุฎฟิลิกรี' },
  'botanical-scroll': { en: 'Acanthus Scroll', th: 'ลายเถาพฤกษา' },
  'lattice-cameo': { en: 'Lattice Cameo', th: 'ลายตารางคามีโอ' },
  'imperial-ribbed': { en: 'Imperial Sunburst', th: 'ร่องรัศมีจักรพรรดิ' },
};

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
  accentHex: string;
  accentTextHex: string;
  isWishlisted: boolean;
  soldCount: number;
  recentKey: string | null;
  onToggleWishlist: () => void;
  onInspectItem: () => void;
  onReserveVariant: (variant: 'bar' | 'bomb' | 'pair') => void;
}

const VaultPairedCard: React.FC<VaultPairedCardProps> = memo(({
  item,
  accentHex,
  accentTextHex,
  isWishlisted,
  soldCount,
  recentKey,
  onToggleWishlist,
  onInspectItem,
  onReserveVariant,
}) => {
  const { lang, t } = useLanguage();
  const catMeta = VAULT_CATEGORIES.find((c) => c.id === item.categoryId);
  const categoryText =
    lang === 'th' ? (catMeta?.labelTh ?? item.categoryLabel) : item.categoryLabel;
  const grooveLabel = GROOVE_STYLE_LABELS[item.victorianStyle][lang];

  const barAdded = recentKey === `${item.id}_bar`;
  const bombAdded = recentKey === `${item.id}_bomb`;
  const pairAdded = recentKey === `${item.id}_pair`;

  return (
    <article className="group relative cv-product-card flex">
      <div className="luxury-3d-card w-full overflow-hidden flex flex-col justify-between bg-[var(--surface-card)]">
        {/* Same Storefront Blueprint: Travertine Studio Product Photography Stage + Silk Shimmer */}
        <div
          onClick={onInspectItem}
          className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
        >
          <ResilientImage
            src={item.imageUrl}
            alt={`${item.brandName} — ${item.soapName} & ${item.bombName}`}
            fallbackTitle={item.brandName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div aria-hidden="true" className="shimmer z-20" />
        </div>

        {/* Clean Emotional & Formulation Frontstage */}
        <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--muted)]">
              <span className="tabular-figures font-semibold text-[var(--ink)]">
                #{String(item.itemNumber).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.soapTopHex }}
                />
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: item.bombCoreHex }}
                />
              </span>
              <span className="truncate max-w-[140px]">{categoryText}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-figures font-bold text-[var(--ink)]">
                {formatThb(VAULT_PRICING.pairedDuoThb)}
              </span>
            </div>

            {/* Bold Two-Line Accent Text Box */}
            <div className="space-y-0.5 cursor-pointer" onClick={onInspectItem}>
              <h3 className="font-serif fluid-card-display font-bold text-[var(--ink)] hover:opacity-85 transition-opacity line-clamp-1">
                {item.brandName}
              </h3>
              <p className="text-xs font-semibold line-clamp-1" style={{ color: accentHex }}>
                {item.activeFormula}
              </p>
            </div>

            {/* Mold-Ready Debossed Stamps Strip */}
            <div className="pt-1.5 flex items-center justify-center gap-2 text-[10px] font-medium text-[var(--muted)]">
              <span className="px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)]/80 font-mono text-[var(--ink)] truncate">
                {item.shortBarStamp}
              </span>
              <span aria-hidden="true">+</span>
              <span className="px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)]/80 font-mono text-[var(--ink)] truncate">
                {item.shortBombStamp}
              </span>
            </div>
          </div>

          {/* Direct Bar / Bomb / Paired Duo Concierge Controls */}
          <div className="pt-2.5 border-t border-[var(--border)] space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onReserveVariant('bar')}
                className="h-8 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 text-[10.5px] font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1"
              >
                {barAdded ? <Check className="w-3 h-3 shrink-0" /> : null}
                <span>{barAdded ? t.reservedBtn : t.vaultReserveBar}</span>
              </button>

              <button
                type="button"
                onClick={() => onReserveVariant('bomb')}
                className="h-8 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 text-[10.5px] font-semibold text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap tabular-figures inline-flex items-center justify-center gap-1"
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
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
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
                className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures"
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

        {/* Recessed Antique Parchment Ticket matching storefront blueprint */}
        <VintageParchmentTicket
          assayCode={`${t.ledgerFolioPrefix} #${String(item.itemNumber).padStart(2, '0')} · ${grooveLabel}`}
          finePrintText={`${item.soapName} · ${item.bombName}`}
          craftSpecText={`${item.shortBarStamp} / ${item.shortBombStamp}`}
          soldCount={soldCount}
          soldUnitLabel={t.soldUnitLabel}
          ledgerActionLabel={t.ledgerActionLabel}
          onInspectLedger={onInspectItem}
        />
      </div>
    </article>
  );
});

VaultPairedCard.displayName = 'VaultPairedCard';

interface VaultMarbleBoxCardProps {
  box: VaultMarbleBoxEdition;
  accentHex: string;
  accentTextHex: string;
  onInspectPair: (pair: VaultPairedFormulation) => void;
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
  const [loofahTwoId, setLoofahTwoId] = useState<string>(LOOFAH_SCRUB_OPTIONS[1].id);
  const [engravingNote, setEngravingNote] = useState<string>('GENTLEBUBBLE VAULT');
  const [justAdded, setJustAdded] = useState(false);

  const engravingInputId = useId();
  const title = lang === 'th' ? box.titleTh : box.titleEn;
  const themeLabel = lang === 'th' ? box.themeLabelTh : box.themeLabelEn;
  const desc = lang === 'th' ? box.descTh : box.descEn;
  const grooveDetail = lang === 'th' ? box.grooveDetailTh : box.grooveDetailEn;

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

  const handleReserve = () => {
    const l1 = getLoofahDisplay(loofahOne);
    const l2 = getLoofahDisplay(loofahTwo);
    onReserveBox(box, `${ribbonName} · ${l1.label} + ${l2.label}`, engravingNote.trim());
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="luxury-3d-card overflow-hidden flex flex-col">
      {/* Storefront Marble Case Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/75 flex items-center justify-between gap-2">
        <span
          className="text-[11px] font-semibold tracking-[0.05em] truncate"
          style={{ color: accentHex }}
        >
          {themeLabel}
        </span>
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="text-sm font-bold tabular-figures text-[var(--ink)]">
            {formatThb(box.priceThb)}
          </span>
          <span className="text-[10.5px] line-through tabular-figures text-[var(--muted)]">
            {formatThb(box.compareAtThb)}
          </span>
        </div>
      </div>

      {/* Studio Victorian-Grooved Marble Coffret Photograph */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface)]">
        <ResilientImage
          src={box.imageUrl}
          alt={title}
          fallbackTitle={title}
          className="w-full h-full object-cover"
        />
        <div aria-hidden="true" className="shimmer z-10" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-serif fluid-card-display font-bold text-[var(--ink)]">{title}</h4>
            <p className="text-xs font-semibold" style={{ color: accentHex }}>
              {grooveDetail}
            </p>
            <p className="text-[11.5px] text-[var(--muted)] leading-relaxed">{desc}</p>
          </div>

          {/* Live 3D Marble Lid Ribbon & Brass Engraving Mockup */}
          <MarbleBoxRibbonMockup
            stoneType={box.stoneType}
            setName={title}
            ribbon={{ ...selectedRibbon, name: ribbonName }}
            engravingNote={engravingNote}
          />

          {/* 3 Matched Bar Soaps + 3 Matching Bath Bombs Inside Marble Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[var(--ink)]">{t.vaultBoxesInteriorLabel}</span>
              <span className="tabular-figures font-semibold" style={{ color: accentHex }}>
                {t.vaultBoxesInteriorCount}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {includedPairs.map((pair) => (
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
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-[var(--ink)] truncate">{pair.brandName}</p>
                  <p className="text-[9px] font-mono text-[var(--muted)] truncate">
                    {pair.shortBarStamp}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 2 Natural Loofah Scrub Holders */}
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
                    <LoofahScrubSwatch swatchHex={option.swatchHex} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--ink)] truncate">
                        {lCopy.label}
                      </p>
                      <p className="text-[9px] text-[var(--muted)] truncate">{lCopy.material}</p>
                    </div>
                  </button>
                );
              })}
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
    </article>
  );
});

VaultMarbleBoxCard.displayName = 'VaultMarbleBoxCard';

export const SecretVaultSection: React.FC<SecretVaultSectionProps> = memo(({
  user,
  accentHex,
  accentTextHex,
  wishlistIds,
  itemSoldDeltas = {},
  onSignIn,
  onToggleWishlist,
  onAddVaultToBag,
  onAddVaultMarbleBoxToBag,
}) => {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | VaultBenefitCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReserveKey, setRecentReserveKey] = useState<string | null>(null);
  const [inspectedPair, setInspectedPair] = useState<VaultPairedFormulation | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VAULT_PAIRED_FORMULATIONS.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.brandName.toLowerCase().includes(q) ||
        item.activeFormula.toLowerCase().includes(q) ||
        item.shortBarStamp.toLowerCase().includes(q) ||
        item.shortBombStamp.toLowerCase().includes(q) ||
        item.soapName.toLowerCase().includes(q) ||
        item.bombName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleReserveVariant = (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => {
    onAddVaultToBag(item, variant);
    const flashKey = `${item.id}_${variant}`;
    setRecentReserveKey(flashKey);
    window.setTimeout(() => {
      setRecentReserveKey((curr) => (curr === flashKey ? null : curr));
    }, 1200);
  };

  const kpiCards = [
    { value: '30', label: t.vaultKpiFormulations },
    { value: '5', label: t.vaultKpiCategories },
    { value: '60', label: t.vaultKpiProducts },
    { value: '30', label: t.vaultKpiBrands },
  ];

  // STRICT MEMBERS-ONLY LOGIN GATE (No catalog items revealed until Google Sign-In)
  if (!user) {
    return (
      <section
        id="secret-vault"
        aria-label={t.navVault}
        className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] py-12 lg:py-16"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="luxury-3d-card relative overflow-hidden p-6 sm:p-10 lg:p-12 bg-[var(--surface-card)]/96 backdrop-blur-md">
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-inner">
                <Lock className="w-6 h-6" style={{ color: accentHex }} />
              </div>

              <div className="space-y-2.5">
                <p
                  className="text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: accentHex }}
                >
                  {t.vaultEyebrow}
                </p>
                <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
                  <span className="block">{t.vaultLockedLine1}</span>
                  <span className="block mt-1" style={{ color: accentHex }}>
                    {t.vaultLockedLine2}
                  </span>
                </h2>
                <p className="fluid-lead-copy text-[var(--muted)] max-w-2xl mx-auto">
                  {t.vaultLockedDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {kpiCards.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/85 px-3 py-3.5 text-center"
                  >
                    <p
                      className="font-serif text-2xl sm:text-3xl font-bold tabular-figures"
                      style={{ color: accentHex }}
                    >
                      {kpi.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">{kpi.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => void onSignIn()}
                  className="luxury-3d-pill inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-transform hover:scale-[1.02] cursor-pointer whitespace-nowrap shadow-md"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <Unlock className="w-4 h-4" />
                  <span>{t.vaultUnlockBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="secret-vault"
      aria-label={t.navVault}
      className="relative z-10 border-b border-[var(--border)] bg-transparent text-[var(--ink)] py-12 lg:py-16"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
        {/* PART 1: Storefront-Aligned Secret Vault Header & Filter Bar */}
        <div className="space-y-4">
          <div className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/96 backdrop-blur-md space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div
                  className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase"
                  style={{ color: accentHex }}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    {t.vaultUnlockedBadge} · {user.displayName || user.email}
                  </span>
                </div>

                <h2 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
                  <span className="block">{t.vaultHeadingLine1}</span>
                  <span className="block mt-1" style={{ color: accentHex }}>
                    {t.vaultHeadingLine2}
                  </span>
                </h2>
                <p className="fluid-lead-copy text-[var(--muted)]">{t.vaultSublead}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                {kpiCards.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-2.5 text-center"
                  >
                    <p
                      className="font-serif text-xl sm:text-2xl font-bold tabular-figures"
                      style={{ color: accentHex }}
                    >
                      {kpi.value}
                    </p>
                    <p className="text-[10.5px] font-medium text-[var(--muted)] whitespace-nowrap">
                      {kpi.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  style={{
                    borderColor: selectedCategory === 'all' ? accentHex : 'var(--border)',
                    backgroundColor: selectedCategory === 'all' ? accentHex : 'var(--surface)',
                    color: selectedCategory === 'all' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  {t.vaultAllFilter}
                </button>

                {VAULT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      style={{
                        borderColor: isSelected ? accentHex : 'var(--border)',
                        backgroundColor: isSelected ? accentHex : 'var(--surface)',
                        color: isSelected ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      {lang === 'th' ? cat.labelTh : cat.labelEn}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <label className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.vaultSearchPlaceholder}
                    aria-label={t.vaultSearchPlaceholder}
                    className="w-full h-9 pl-8 pr-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </label>

                <a
                  href="#vault-marble-boxes"
                  className="luxury-3d-pill h-9 px-3.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] text-xs font-semibold text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Crown className="w-3.5 h-3.5" style={{ color: accentHex }} />
                  <span>{t.vaultBoxesHeading.split('(')[0].trim()} (3) →</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3-Column Storefront Grid Matching TopTenDuosSection & BathBombsSection Blueprint */}
          {filteredItems.length === 0 ? (
            <div className="luxury-3d-card p-10 text-center text-sm text-[var(--muted)]">
              {t.vaultEmptyMatch}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 items-stretch">
              {filteredItems.map((item) => (
                <VaultPairedCard
                  key={item.id}
                  item={item}
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  isWishlisted={wishlistIds.includes(item.id)}
                  soldCount={
                    getDeterministicItemSoldBase(item.id) + (itemSoldDeltas[item.id] ?? 0)
                  }
                  recentKey={recentReserveKey}
                  onToggleWishlist={() => onToggleWishlist(item.id)}
                  onInspectItem={() => setInspectedPair(item)}
                  onReserveVariant={(variant) => handleReserveVariant(item, variant)}
                />
              ))}
            </div>
          )}
        </div>

        {/* PART 2: 3 Special Victorian-Grooved Marble Boxes ("3 of each": 3 Soaps + 3 Bombs per chest) */}
        <div id="vault-marble-boxes" className="pt-4 space-y-6">
          <div className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/96 backdrop-blur-md space-y-1.5">
            <p
              className="text-[11px] font-bold tracking-[0.18em] uppercase"
              style={{ color: accentHex }}
            >
              {t.vaultBoxesEyebrow}
            </p>
            <h3 className="marshmallow-text font-serif fluid-section-display text-[var(--ink)]">
              {t.vaultBoxesHeading}
            </h3>
            <p className="fluid-lead-copy text-[var(--muted)] max-w-3xl">{t.vaultBoxesSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {VAULT_MARBLE_BOXES.map((box) => (
              <VaultMarbleBoxCard
                key={box.id}
                box={box}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                onInspectPair={(pair) => setInspectedPair(pair)}
                onReserveBox={onAddVaultMarbleBoxToBag}
              />
            ))}
          </div>
        </div>

        {/* Bottom Antique Parchment Provenance Colophon Banner */}
        <ApothecaryColophonBanner
          mode="soaps"
          accentHex={accentHex}
          onOpenSampleLedger={() => setInspectedPair(VAULT_PAIRED_FORMULATIONS[0])}
        />
      </div>

      {/* Vault Apothecary & Mold Engraving Inspection Modal */}
      {inspectedPair && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={inspectedPair.brandName}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
          onClick={() => setInspectedPair(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="luxury-3d-card relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface-card)] p-5 sm:p-7 space-y-5"
          >
            <button
              type="button"
              onClick={() => setInspectedPair(null)}
              aria-label="Close"
              className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center absolute top-4 right-4 hover:border-[var(--ink)]/30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                <ResilientImage
                  src={inspectedPair.imageUrl}
                  alt={inspectedPair.brandName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-6 space-y-3">
                <p
                  className="text-[10.5px] font-bold tracking-[0.14em] uppercase"
                  style={{ color: accentHex }}
                >
                  #{String(inspectedPair.itemNumber).padStart(2, '0')} ·{' '}
                  {GROOVE_STYLE_LABELS[inspectedPair.victorianStyle][lang]}
                </p>
                <h4 className="font-serif fluid-card-display font-bold text-[var(--ink)]">
                  {inspectedPair.brandName}
                </h4>
                <p className="text-sm font-bold" style={{ color: accentHex }}>
                  {inspectedPair.activeFormula}
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80">
                    <p className="font-mono font-bold text-[var(--ink)]">
                      {t.vaultBarStampTag}: {inspectedPair.shortBarStamp}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{inspectedPair.soapName}</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80">
                    <p className="font-mono font-bold text-[var(--ink)]">
                      {t.vaultBombStampTag}: {inspectedPair.shortBombStamp}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">{inspectedPair.bombName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleReserveVariant(inspectedPair, 'bar')}
                className="px-4 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] cursor-pointer"
              >
                {t.vaultReserveBar}
              </button>
              <button
                type="button"
                onClick={() => handleReserveVariant(inspectedPair, 'bomb')}
                className="px-4 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] cursor-pointer"
              >
                {t.vaultReserveBomb}
              </button>
              <button
                type="button"
                onClick={() => handleReserveVariant(inspectedPair, 'pair')}
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
