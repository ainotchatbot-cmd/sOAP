import React, { useEffect, useState } from 'react';
import { Check, Droplets, FlaskConical, Heart, Thermometer, Timer, X } from 'lucide-react';
import {
  BATH_BOMB_BY_ID,
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombPackTier,
  NutrientFactRow,
} from '../data/bathBombs';
import { formatThb } from '../data/soaps';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';

interface BathBombNutritionModalProps {
  bombId: string | null;
  accentHex: string;
  accentTextHex: string;
  wishlistIds: string[];
  onClose: () => void;
  onToggleWishlist: (bombId: string) => void;
  onAddBombToBag: (
    bomb: BathBombCreation,
    quantity: number,
    packTier: BathBombPackTier,
  ) => void;
}

export const BathBombNutritionModal: React.FC<BathBombNutritionModalProps> = ({
  bombId,
  accentHex,
  accentTextHex,
  wishlistIds,
  onClose,
  onToggleWishlist,
  onAddBombToBag,
}) => {
  const { lang, t } = useLanguage();
  const [packTier, setPackTier] = useState<BathBombPackTier>('single');
  const [justAdded, setJustAdded] = useState(false);

  const bomb = bombId ? BATH_BOMB_BY_ID.get(bombId) ?? null : null;

  useEffect(() => {
    if (!bomb) return;
    setPackTier('single');
    setJustAdded(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bomb, onClose]);

  if (!bomb) return null;

  const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
  const soakMood = lang === 'th' ? bomb.soakMoodTh : bomb.soakMoodEn;
  const brighteningNote = lang === 'th' ? bomb.brighteningNoteTh : bomb.brighteningNoteEn;
  const waterHueName = lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn;
  const fizzDuration = lang === 'th' ? bomb.fizzDurationTh : bomb.fizzDurationEn;
  const servingSize =
    lang === 'th' ? bomb.nutritionPack.servingSizeTh : bomb.nutritionPack.servingSizeEn;
  const isWishlisted = wishlistIds.includes(bomb.id);
  const price = BATH_BOMB_PRICE_TIERS[packTier];

  const handleAdd = () => {
    onAddBombToBag(bomb, 1, packTier);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const renderNutritionGroup = (groupTitle: string, rows: NutrientFactRow[]) => (
    <div className="space-y-1">
      <div className="bg-[var(--surface)] px-2.5 py-1 border-y border-[var(--ink)]/20">
        <p className="text-[11px] font-bold tracking-wide text-[var(--ink)]">{groupTitle}</p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {rows.map((row) => (
          <div
            key={row.labelEn}
            className="grid grid-cols-12 items-baseline gap-2 px-2 py-1.5 text-[11.5px] leading-snug"
          >
            <span className="col-span-6 sm:col-span-7 text-[var(--ink)]">
              {lang === 'th' ? row.labelTh : row.labelEn}
            </span>
            <span className="col-span-4 sm:col-span-3 text-right font-semibold text-[var(--ink)] tabular-figures">
              {row.amount}
            </span>
            <span className="col-span-2 text-right font-medium text-[var(--muted)] tabular-figures">
              {row.dailyValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="luxury-3d-card w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[var(--surface-card)] text-[var(--ink)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Studio Photo + Dissolved Water Preview + Pack Reservation */}
          <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface)]/55 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: accentHex }}>
                    {bomb.editionNumber} · {bomb.edibleGoldLeaf === 'rose-gold' ? t.goldFilterRose : t.goldFilterYellow}
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-[var(--ink)] leading-snug">
                    {title}
                  </h2>
                  <p className="text-xs text-[var(--muted)]">{soakMood}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="lg:hidden w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-[3/4] w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                <ResilientImage
                  src={bomb.imageUrl}
                  alt={bomb.imageAlt}
                  fallbackTitle={title}
                  fallbackGradient={bomb.fallbackGradient}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Real Water-Soaking & Skin-Brightening Telemetry */}
              <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-8 h-8 rounded-full border border-[var(--border)] shrink-0 shadow-inner"
                      style={{ background: bomb.waterGradient }}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                        <Droplets className="w-3 h-3" style={{ color: accentHex }} />
                        <span>{t.bathWaterHueLabel}</span>
                      </p>
                      <p className="text-xs font-semibold text-[var(--ink)] truncate">{waterHueName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-[11px]">
                  <div className="space-y-0.5">
                    <span className="text-[var(--muted)] flex items-center gap-1">
                      <Timer className="w-3 h-3" style={{ color: accentHex }} />
                      <span>{t.bathFizzDurationLabel}</span>
                    </span>
                    <p className="font-medium text-[var(--ink)]">{fizzDuration}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[var(--muted)] flex items-center gap-1">
                      <Thermometer className="w-3 h-3" style={{ color: accentHex }} />
                      <span>{t.bathSoakTempLabel}</span>
                    </span>
                    <p className="font-medium text-[var(--ink)] tabular-figures">{bomb.soakTemp}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
                  <span className="font-medium text-[var(--ink)]">{t.bathEngravedLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[var(--ink)]">{t.bathGroovesLabel}</span>
                </div>

                <div className="pt-2 border-t border-[var(--border)] space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentHex }}>
                    {t.bathBrighteningTitle}
                  </p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{brighteningNote}</p>
                </div>
              </div>
            </div>

            {/* Pack Tier Selection & Reserve Button */}
            <div className="space-y-2.5 pt-2">
              <div
                role="group"
                aria-label={title}
                className="grid grid-cols-3 gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]"
              >
                {(
                  [
                    { id: 'single', label: t.bathSinglePack },
                    { id: 'duo', label: t.bathDuoPack },
                    { id: 'coffer', label: t.bathCofferPack },
                  ] as const
                ).map((tier) => {
                  const selected = packTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPackTier(tier.id)}
                      className="py-1.5 px-2 rounded-full text-[11px] font-medium transition-colors cursor-pointer tabular-figures whitespace-nowrap"
                      style={{
                        backgroundColor: selected ? accentHex : 'transparent',
                        color: selected ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      {tier.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(bomb.id)}
                  aria-label={isWishlisted ? t.favRemove : t.favAdd}
                  className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="luxury-3d-pill flex-1 h-10 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.reservedBtn}</span>
                    </>
                  ) : (
                    <span className="tabular-figures">
                      {t.bathReserveBomb} · {formatThb(price)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Full Animal Pak-Inspired Multi-Vitamin & Mineral Bath Supplement Facts Label */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase flex items-center gap-1.5" style={{ color: accentHex }}>
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>{t.bathNutritionFactsTitle}</span>
                  </p>
                  <p className="text-xs text-[var(--muted)]">{t.bathNutritionSubtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="hidden lg:flex w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] items-center justify-center shrink-0 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Official FDA/Animal-Pak Style Tabular Facts Frame */}
              <div className="border-2 border-[var(--ink)] rounded-xl overflow-hidden bg-[var(--surface-card)]">
                <div className="p-3 border-b-4 border-[var(--ink)] space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                    Supplement &amp; Bath Facts
                  </h3>
                  <p className="text-xs font-medium text-[var(--muted)]">{servingSize}</p>
                </div>

                <div className="grid grid-cols-12 gap-2 px-2 py-1.5 border-b-2 border-[var(--ink)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  <span className="col-span-6 sm:col-span-7">{t.bathNutrientCol}</span>
                  <span className="col-span-4 sm:col-span-3 text-right">{t.bathAmountCol}</span>
                  <span className="col-span-2 text-right">{t.bathDvCol}</span>
                </div>

                <div className="space-y-2 pb-2">
                  {renderNutritionGroup(t.bathVitaminsHeader, bomb.nutritionPack.vitamins)}
                  {renderNutritionGroup(t.bathMineralsHeader, bomb.nutritionPack.minerals)}
                  {renderNutritionGroup(t.bathAminoHeader, bomb.nutritionPack.aminoAndBrighteners)}
                  {renderNutritionGroup(t.bathEnzymesHeader, bomb.nutritionPack.enzymesAndBotanicals)}
                </div>

                <div className="px-3 py-2 border-t-2 border-[var(--ink)] bg-[var(--surface)]/70 text-[10.5px] text-[var(--muted)]">
                  {t.bathDvFootnote}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
