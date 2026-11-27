import { HarpScaleKey, MusicTuneStyle, SeasonKey } from '../utils/harpAudio';

export type ThemeMode = 'day' | 'twilight';
export type SoapLineKey = 'bright' | 'dark' | 'holiday';

export type DreamPresetId =
  | 'midnight-reverie'
  | 'moonmilk-velvet'
  | 'astral-amber'
  | 'eclipse-noir';

export interface DreamPreset {
  id: DreamPresetId;
  mode: ThemeMode;
  label: string;
  poeticWhisper: string;
  canvasHex: string;
  surfaceHex: string;
  surfaceCardHex: string;
  borderHex: string;
  inkHex: string;
  mutedHex: string;
  accentHex: string;
  accentTextHex: string;
  accentSoft: string;
  heroBgHex: string;
  starColor: string;
  trailColor: string;
  harpScale: HarpScaleKey;
  recommendedMusic: MusicTuneStyle;
  seasonAudioKey: SeasonKey;
  spotlightSoapId: string;
}

export const DREAM_PRESETS: DreamPreset[] = [
  {
    id: 'midnight-reverie',
    mode: 'day',
    label: 'Cloud Cream Day',
    poeticWhisper: 'Whipped porcelain daylight with iridescent soap-bubble shimmer.',
    canvasHex: '#FAF6F0',
    surfaceHex: '#F2ECE3',
    surfaceCardHex: '#FFFFFF',
    borderHex: 'rgba(176, 144, 102, 0.22)',
    inkHex: '#2A211C',
    mutedHex: '#76695F',
    accentHex: '#B5823B',
    accentTextHex: '#FFFFFF',
    accentSoft: 'rgba(181, 130, 59, 0.14)',
    heroBgHex: '#F6F0E7',
    starColor: '#C59A4B',
    trailColor: 'rgba(181, 130, 59, 0.34)',
    harpScale: 'mint',
    recommendedMusic: 'kalimba',
    seasonAudioKey: 'spring',
    spotlightSoapId: 'bright-coconut-pearl',
  },
  {
    id: 'astral-amber',
    mode: 'day',
    label: 'Sky & Biscuit Day',
    poeticWhisper: 'Sunlit azure cloud mist paired with toasted sablé biscuit cream.',
    canvasHex: '#F4F8FC',
    surfaceHex: '#E9F0F7',
    surfaceCardHex: '#FFFFFF',
    borderHex: 'rgba(97, 158, 212, 0.24)',
    inkHex: '#1F2A36',
    mutedHex: '#5E6E80',
    accentHex: '#2D6DA3',
    accentTextHex: '#FFFFFF',
    accentSoft: 'rgba(45, 109, 163, 0.14)',
    heroBgHex: '#EDF4FA',
    starColor: '#619ED4',
    trailColor: 'rgba(97, 158, 212, 0.34)',
    harpScale: 'cobalt',
    recommendedMusic: 'ukulele',
    seasonAudioKey: 'summer',
    spotlightSoapId: 'bright-anchan-sable',
  },
  {
    id: 'moonmilk-velvet',
    mode: 'twilight',
    label: 'Twilight Lavender',
    poeticWhisper: 'Pastel iris dusk where shooting stars brush over silk-glazed porcelain.',
    canvasHex: '#252136',
    surfaceHex: '#302B44',
    surfaceCardHex: '#3A3452',
    borderHex: 'rgba(235, 222, 248, 0.18)',
    inkHex: '#F8F3FA',
    mutedHex: '#C2B8D4',
    accentHex: '#E6C589',
    accentTextHex: '#261E14',
    accentSoft: 'rgba(230, 197, 137, 0.18)',
    heroBgHex: '#2A253D',
    starColor: '#F5E4C3',
    trailColor: 'rgba(230, 197, 137, 0.42)',
    harpScale: 'rose',
    recommendedMusic: 'kalimba',
    seasonAudioKey: 'autumn',
    spotlightSoapId: 'dark-espresso-noir',
  },
  {
    id: 'eclipse-noir',
    mode: 'twilight',
    label: 'Rosewood Dusk',
    poeticWhisper: 'Soft dusty mauve twilight steeped in pomegranate & rosewood.',
    canvasHex: '#2E2331',
    surfaceHex: '#392C3D',
    surfaceCardHex: '#433548',
    borderHex: 'rgba(242, 206, 215, 0.18)',
    inkHex: '#FAF2F4',
    mutedHex: '#D0BCC4',
    accentHex: '#E8909D',
    accentTextHex: '#281418',
    accentSoft: 'rgba(232, 144, 157, 0.18)',
    heroBgHex: '#332736',
    starColor: '#F6CED5',
    trailColor: 'rgba(232, 144, 157, 0.4)',
    harpScale: 'marigold',
    recommendedMusic: 'steelpan',
    seasonAudioKey: 'winter',
    spotlightSoapId: 'dark-pomegranate-ruby',
  },
];

export function getDreamPreset(id: DreamPresetId): DreamPreset {
  return DREAM_PRESETS.find((p) => p.id === id) ?? DREAM_PRESETS[0];
}
