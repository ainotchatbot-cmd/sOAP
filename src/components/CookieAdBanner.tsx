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
  const { t } = useLanguage();
  const [savedHistoryToggle, setSavedHistoryToggle] = useState(preferences.savedHistory);
  const [adCookiesToggle, setAdCookiesToggle] = useState(preferences.adCookies);

  const showFloatingBar = !preferences.configured && !isModalOpen;

  return (
    <>
      {showFloatingBar && (
        <aside
          role="region"
          aria-label={t.cookieTitle}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 luxury-3d-card p-4 sm:p-5 bg-[var(--surface-card)]/96 backdrop-blur-md shadow-2xl border border-[var(--border)] space-y-3"
        >
          <div className="flex items-start gap-2.5">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--surface)', color: accentHex }}
            >
              <Cookie className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <p className="font-serif text-base font-medium text-[var(--ink)] leading-snug">
                {t.cookieTitle}
              </p>
              <p className="text-[11.5px] text-[var(--muted)] leading-relaxed">{t.cookieDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSavePreferences({ savedHistory: true, adCookies: true })}
              className="luxury-3d-pill flex-1 h-9 px-3.5 rounded-full text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentHex, color: accentTextHex }}
            >
              {t.cookieAcceptAll}
            </button>
            <button
              type="button"
              onClick={() => onSavePreferences({ savedHistory: true, adCookies: false })}
              className="h-9 px-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/30 cursor-pointer whitespace-nowrap"
            >
              {t.cookieEssentialOnly}
            </button>
            <button
              type="button"
              onClick={() => {
                setSavedHistoryToggle(preferences.savedHistory);
                setAdCookiesToggle(preferences.adCookies);
                onOpenModal();
              }}
              aria-label={t.cookieCustomize}
              className="h-9 px-3 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{t.cookieCustomize}</span>
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
            className="w-full max-w-md luxury-3d-card bg-[var(--surface-card)] border border-[var(--border)] p-5 sm:p-6 space-y-4 shadow-2xl"
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
