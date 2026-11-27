import React, { useState } from 'react';
import { Cookie, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '../data/i18n';
import { CookiePreferences } from '../services/atelierStoreService';

interface CookieAdBannerProps {
  preferences: CookiePreferences;
  isModalOpen: boolean;
  accentHex: string;
  accentTextHex?: string;
  onSavePreferences: (next: { savedHistory: boolean; adCookies: boolean }) => void;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const CookieAdBanner: React.FC<CookieAdBannerProps> = ({
  preferences,
  isModalOpen,
  accentHex,
  accentTextHex = '#FFFFFF',
  onSavePreferences,
  onCloseModal,
  onOpenModal,
}) => {
  const { lang, t } = useLanguage();
  const [savedHistoryToggle, setSavedHistoryToggle] = useState(preferences.savedHistory);
  const [adCookiesToggle, setAdCookiesToggle] = useState(preferences.adCookies);

  const showFloatingBar = !preferences.configured && !isModalOpen;

  return (
    <>
      {showFloatingBar && (
        <aside
          role="region"
          aria-label={t.cookieTitle}
          className="fixed bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-[max(0.65rem,env(safe-area-inset-left))] right-[max(0.65rem,env(safe-area-inset-right))] sm:right-auto sm:max-w-[336px] z-40 rounded-2xl px-3 py-2.5 bg-[var(--surface-card)]/95 backdrop-blur-md shadow-lg border border-[var(--border)] space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--surface)', color: accentHex }}
              >
                <Cookie className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-serif text-xs font-semibold text-[var(--ink)] truncate leading-tight">
                  {t.cookieTitle}
                </p>
                <p className="text-[10.5px] text-[var(--muted)] truncate leading-tight">
                  {t.cookieDesc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSavedHistoryToggle(preferences.savedHistory);
                setAdCookiesToggle(preferences.adCookies);
                onOpenModal();
              }}
              aria-label={t.cookieCustomize}
              title={t.cookieCustomize}
              className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSavePreferences({ savedHistory: true, adCookies: true })}
              className="luxury-3d-pill flex-1 h-8 px-3 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentHex, color: accentTextHex }}
            >
              {lang === 'th' ? 'ยอมรับทั้งหมด' : 'Accept All'}
            </button>
            <button
              type="button"
              onClick={() => onSavePreferences({ savedHistory: true, adCookies: false })}
              className="h-8 px-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/30 cursor-pointer whitespace-nowrap"
            >
              {t.cookieEssentialOnly}
            </button>
          </div>
        </aside>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241E2C]/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.cookieTitle}
          onClick={onCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90dvh] overflow-y-auto luxury-3d-card bg-[var(--surface-card)] border border-[var(--border)] p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p
                  className="text-[11px] font-semibold tracking-[0.14em] uppercase flex items-center gap-1.5"
                  style={{ color: accentHex }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.cookieCustomize}</span>
                </p>
                <h2 className="font-serif text-xl font-medium text-[var(--ink)]">{t.cookieTitle}</h2>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                aria-label="Close"
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--ink)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">{t.cookieDesc}</p>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <span className="text-xs font-medium text-[var(--ink)]">{t.cookieHistoryToggle}</span>
                <input
                  type="checkbox"
                  checked={savedHistoryToggle}
                  onChange={(e) => setSavedHistoryToggle(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: accentHex }}
                />
              </label>

              <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
                <span className="text-xs font-medium text-[var(--ink)]">{t.cookieAdsToggle}</span>
                <input
                  type="checkbox"
                  checked={adCookiesToggle}
                  onChange={(e) => setAdCookiesToggle(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: accentHex }}
                />
              </label>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSavePreferences({
                    savedHistory: savedHistoryToggle,
                    adCookies: adCookiesToggle,
                  });
                  onCloseModal();
                }}
                className="luxury-3d-pill flex-1 h-10 px-4 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                {t.cookieSavePrefs}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
