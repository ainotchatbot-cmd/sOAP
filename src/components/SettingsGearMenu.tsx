import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Languages, Monitor, Palette, Settings, Volume2, X } from 'lucide-react';
import { DREAM_PRESETS, DreamPreset, DreamPresetId } from '../data/palette';
import { PRESET_LABELS_SHORT_EN, PRESET_LABELS_TH, useLanguage } from '../data/i18n';
import { MusicTuneStyle } from '../utils/harpAudio';
import { HarpTunePlayer } from './HarpTunePlayer';

interface SettingsGearMenuProps {
  presetId: DreamPresetId;
  activePreset: DreamPreset;
  accentHex: string;
  accentTextHex: string;
  musicStyle: MusicTuneStyle;
  isAmbienceOn: boolean;
  isTvMode: boolean;
  isAutoTvDetected: boolean;
  onSelectPreset: (nextId: DreamPresetId) => void;
  onChangeMusicStyle: (style: MusicTuneStyle) => void;
  onToggleAmbience: () => void;
  onToggleTvMode: () => void;
}

export const SettingsGearMenu: React.FC<SettingsGearMenuProps> = ({
  presetId,
  activePreset,
  accentHex,
  accentTextHex,
  musicStyle,
  isAmbienceOn,
  isTvMode,
  isAutoTvDetected,
  onSelectPreset,
  onChangeMusicStyle,
  onToggleAmbience,
  onToggleTvMode,
}) => {
  const { lang, activeButtonLang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (hostRef.current && !hostRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={hostRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t.settingsGearLabel}
        title={t.settingsGearLabel}
        className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/35 text-[var(--ink)] inline-flex items-center justify-center transition-transform duration-150 cursor-pointer shrink-0"
      >
        <Settings
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          style={{ color: accentHex }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={t.settingsGearLabel}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] w-[min(92vw,370px)] p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/96 backdrop-blur-xl shadow-2xl z-50 space-y-4 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" style={{ color: accentHex }} />
                <span className="font-serif text-sm font-semibold text-[var(--ink)]">
                  {t.settingsGearLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="w-7 h-7 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. Color Palette & Mood */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                <Palette className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>{t.settingsPaletteSection}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {DREAM_PRESETS.map((preset) => {
                  const selected = preset.id === presetId;
                  const shortLabel =
                    lang === 'th'
                      ? PRESET_LABELS_TH[preset.id]
                      : PRESET_LABELS_SHORT_EN[preset.id];
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset(preset.id)}
                      aria-pressed={selected}
                      className="px-2.5 py-2 rounded-xl border text-xs font-medium inline-flex items-center justify-between gap-1.5 transition-colors cursor-pointer"
                      style={{
                        borderColor: selected ? preset.accentHex : 'var(--border)',
                        backgroundColor: selected ? preset.accentHex : 'var(--surface)',
                        color: selected ? preset.accentTextHex : 'var(--ink)',
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <span
                          aria-hidden="true"
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
                          style={{
                            backgroundColor: selected
                              ? preset.accentTextHex
                              : preset.accentHex,
                          }}
                        />
                        <span className="truncate">{shortLabel}</span>
                      </span>
                      {selected && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Soundscape Acoustics */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                <Volume2 className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>{t.settingsAudioSection}</span>
              </div>

              <div className="overflow-x-auto pb-0.5 no-scrollbar">
                <HarpTunePlayer
                  scaleKey={activePreset.harpScale}
                  season={activePreset.seasonAudioKey}
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  musicStyle={musicStyle}
                  onChangeMusicStyle={onChangeMusicStyle}
                  isAmbienceOn={isAmbienceOn}
                  onToggleAmbience={onToggleAmbience}
                />
              </div>
            </div>

            {/* 3. Language Selection */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                <Languages className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>{t.settingsLangSection}</span>
              </div>

              <div
                role="group"
                aria-label="Language Switcher"
                className="inline-flex items-center p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setLang('th')}
                  aria-pressed={activeButtonLang === 'th'}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeButtonLang === 'th' ? accentHex : 'transparent',
                    color: activeButtonLang === 'th' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  ไทย
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  aria-pressed={activeButtonLang === 'en'}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeButtonLang === 'en' ? accentHex : 'transparent',
                    color: activeButtonLang === 'en' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  EN
                </button>
              </div>
            </div>

            {/* 4. TV Showroom Mode */}
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  <Monitor className="w-3.5 h-3.5" style={{ color: accentHex }} />
                  <span>{t.settingsTvSection}</span>
                </div>
                {isAutoTvDetected && (
                  <span className="text-[10px] font-medium text-[var(--muted)]">
                    {t.tvModeAutoDetectedLabel}
                  </span>
                )}
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isTvMode}
                onClick={onToggleTvMode}
                className="w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-3"
                style={{
                  borderColor: isTvMode ? accentHex : 'var(--border)',
                  backgroundColor: isTvMode ? 'var(--accent-soft)' : 'var(--surface)',
                }}
              >
                <span className="text-xs font-medium text-[var(--ink)] leading-snug">
                  {t.tvModeToggleLabel}
                </span>
                <span
                  className="w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 inline-flex items-center"
                  style={{
                    backgroundColor: isTvMode ? accentHex : 'var(--border)',
                    justifyContent: isTvMode ? 'flex-end' : 'flex-start',
                  }}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
