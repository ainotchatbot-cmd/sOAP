import React from 'react';
import { Music, Palmtree, Sparkles, Volume2, VolumeX, Waves } from 'lucide-react';
import { harpEngine, HarpScaleKey, MusicTuneStyle, SeasonKey } from '../utils/harpAudio';
import { useLanguage } from '../data/i18n';

interface HarpTunePlayerProps {
  scaleKey: HarpScaleKey;
  season: SeasonKey;
  accentHex: string;
  accentTextHex?: string;
  musicStyle: MusicTuneStyle;
  onChangeMusicStyle: (style: MusicTuneStyle) => void;
  isAmbienceOn: boolean;
  onToggleAmbience: () => void;
}

export const HarpTunePlayer: React.FC<HarpTunePlayerProps> = ({
  scaleKey,
  accentHex,
  accentTextHex = '#FFFFFF',
  musicStyle,
  onChangeMusicStyle,
  isAmbienceOn,
  onToggleAmbience,
}) => {
  const { t } = useLanguage();

  const MUSIC_STYLES: { id: MusicTuneStyle; label: string }[] = [
    { id: 'off', label: t.instOff },
    { id: 'kalimba', label: t.instKalimba },
    { id: 'ukulele', label: t.instUke },
    { id: 'steelpan', label: t.instSteelpan },
  ];

  const handlePluck = () => {
    harpEngine.strumGlissando(scaleKey);
  };

  return (
    <div className="inline-flex flex-nowrap items-center gap-1.5 shrink-0 whitespace-nowrap">
      {/* Island Acoustic Instruments: Off | Kalimba | Uke | Steelpan */}
      <div
        role="group"
        aria-label={t.consoleHeading}
        className="inline-flex flex-nowrap items-center p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)]"
      >
        {MUSIC_STYLES.map((item) => {
          const active = musicStyle === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMusicStyle(item.id)}
              aria-pressed={active}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: active ? accentHex : 'transparent',
                color: active ? accentTextHex : 'var(--muted)',
              }}
            >
              {item.id === 'off' ? (
                <VolumeX className="w-3 h-3" />
              ) : item.id === 'ukulele' ? (
                <Palmtree className="w-3 h-3" />
              ) : (
                <Music className="w-3 h-3" />
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Island Lagoon Atmosphere Toggle */}
      <button
        type="button"
        onClick={onToggleAmbience}
        aria-pressed={isAmbienceOn}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap bg-[var(--surface-card)]"
        style={{
          borderColor: isAmbienceOn ? accentHex : 'var(--border)',
          color: isAmbienceOn ? 'var(--ink)' : 'var(--muted)',
        }}
      >
        {isAmbienceOn ? (
          <Volume2 className="w-3 h-3" style={{ color: accentHex }} />
        ) : (
          <Waves className="w-3 h-3" />
        )}
        <span>{isAmbienceOn ? t.lagoonOn : t.islandBreeze}</span>
      </button>

      {/* Instant Acoustic Strum */}
      <button
        type="button"
        onClick={handlePluck}
        aria-label={t.chimeBtn}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap"
      >
        <Sparkles className="w-3 h-3" style={{ color: accentHex }} />
        <span>{t.chimeBtn}</span>
      </button>
    </div>
  );
};
