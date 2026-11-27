// Self-generated Calm Kalimba, Hawaiian Ukulele, Caribbean Steelpan,
// Bubble Pop SFX & Tropical Soundscape Web Audio Engine

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';
export type MusicTuneStyle = 'off' | 'kalimba' | 'ukulele' | 'steelpan';
export type NatureSoundscapeId = 'off' | 'rainforest' | 'seashore' | 'birdsong';
export type HarpScaleKey =
  | 'luminous'
  | 'mint'
  | 'marigold'
  | 'rose'
  | 'cobalt'
  | 'oolong'
  | 'slate'
  | 'crimson'
  | 'forest'
  | 'oud';

interface ScaleConfig {
  bpm: number;
  notesHz: number[];
}

// Island Major-6th / Pentatonic-rich calm tunings for Kalimba, Hawaiian Ukulele & Steelpan
const ISLAND_SCALES: Record<HarpScaleKey, ScaleConfig> = {
  luminous: {
    bpm: 64,
    notesHz: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99],
  },
  mint: {
    bpm: 62,
    notesHz: [261.63, 329.63, 392.0, 440.0, 493.88, 523.25, 659.25, 783.99, 880.0],
  },
  marigold: {
    bpm: 66,
    notesHz: [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0],
  },
  rose: {
    bpm: 58,
    notesHz: [220.0, 261.63, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99, 880.0],
  },
  cobalt: {
    bpm: 62,
    notesHz: [246.94, 293.66, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0],
  },
  oolong: {
    bpm: 54,
    notesHz: [233.08, 293.66, 349.23, 440.0, 466.16, 587.33, 698.46, 783.99, 880.0],
  },
  slate: {
    bpm: 56,
    notesHz: [261.63, 329.63, 392.0, 493.88, 523.25, 659.25, 783.99, 880.0, 987.77],
  },
  crimson: {
    bpm: 60,
    notesHz: [220.0, 261.63, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99, 880.0],
  },
  forest: {
    bpm: 56,
    notesHz: [246.94, 293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99],
  },
  oud: {
    bpm: 54,
    notesHz: [261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 783.99],
  },
};

// Relaxed Caribbean / Hawaiian melodic contour indices
const KALIMBA_STEPS = [0, 4, 2, 5, 3, 6, 4, 7, 5, 3, 2, 4, 1, 5, 3, 0];
const UKULELE_ARPEGGIO = [0, 2, 4, 5, 4, 2, 1, 3, 5, 6, 5, 3, 0, 2, 4, 7];
const STEELPAN_PHRASE = [0, 2, 4, 6, 5, 4, 2, 3, 5, 7, 6, 4, 2, 1, 3, 0];

const SEASON_AMBIENCE_FILTER: Record<SeasonKey, { centerHz: number; chordHz: [number, number] }> = {
  spring: { centerHz: 880, chordHz: [261.63, 392.0] },
  summer: { centerHz: 1120, chordHz: [293.66, 440.0] },
  autumn: { centerHz: 740, chordHz: [220.0, 329.63] },
  winter: { centerHz: 600, chordHz: [233.08, 349.23] },
};

class IslandAcousticEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private timerId: number | null = null;
  private stepIndex = 0;
  private activeScale: HarpScaleKey = 'mint';
  private activeStyle: MusicTuneStyle = 'off';
  private activeSeason: SeasonKey = 'spring';
  private volume = 0.44;
  private isAtmospherePlaying = false;

  private ambienceGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private surfLfo: OscillatorNode | null = null;
  private surfLfoGain: GainNode | null = null;
  private natureTimerId: number | null = null;
  private activeSoundscape: NatureSoundscapeId = 'off';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);

      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.24, this.ctx.currentTime);

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1750, this.ctx.currentTime);

      this.delayNode.connect(delayFilter);
      delayFilter.connect(feedback);
      feedback.connect(this.delayNode);
      delayFilter.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  /** Calm Wooden Kalimba Tine Pluck */
  public playKalimbaNote(freqHz: number, velocity = 0.19) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.delayNode) return;

    const now = ctx.currentTime;
    const duration = 2.1;

    // Resonant coconut-wood box filter
    const bodyResonator = ctx.createBiquadFilter();
    bodyResonator.type = 'lowpass';
    bodyResonator.frequency.setValueAtTime(Math.min(3400, freqHz * 5.2), now);
    bodyResonator.frequency.exponentialRampToValueAtTime(Math.max(420, freqHz * 1.45), now + 0.9);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(velocity, now + 0.007);
    env.gain.exponentialRampToValueAtTime(0.0007, now + duration);

    // Fundamental pure metallic tine sine
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freqHz, now);

    // Classic kalimba thumb-tine 2.98x soft transient click/overtone
    const oscTine = ctx.createOscillator();
    oscTine.type = 'triangle';
    oscTine.frequency.setValueAtTime(freqHz * 2.98, now);

    const tineGain = ctx.createGain();
    tineGain.gain.setValueAtTime(0.22, now);
    tineGain.gain.exponentialRampToValueAtTime(0.004, now + 0.14);

    // Subtle warm sub wood-hole resonance
    const woodSub = ctx.createOscillator();
    woodSub.type = 'sine';
    woodSub.frequency.setValueAtTime(freqHz * 0.5, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.16, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc1.connect(bodyResonator);
    oscTine.connect(tineGain);
    tineGain.connect(bodyResonator);
    woodSub.connect(subGain);
    subGain.connect(bodyResonator);

    bodyResonator.connect(env);
    env.connect(this.masterGain);
    env.connect(this.delayNode);

    osc1.start(now);
    oscTine.start(now);
    woodSub.start(now);
    osc1.stop(now + duration + 0.05);
    oscTine.stop(now + 0.22);
    woodSub.stop(now + 0.72);
  }

  /** Warm Hawaiian Slack-Key Nylon Ukulele String */
  public playUkuleleNote(freqHz: number, velocity = 0.17) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.delayNode) return;

    const now = ctx.currentTime;
    const duration = 2.4;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(2600, freqHz * 4.5), now);
    lp.frequency.exponentialRampToValueAtTime(Math.max(380, freqHz * 1.2), now + 1.3);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(velocity, now + 0.016);
    env.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    const nylonFundamental = ctx.createOscillator();
    nylonFundamental.type = 'triangle';
    nylonFundamental.frequency.setValueAtTime(freqHz, now);

    const secondHarmonic = ctx.createOscillator();
    secondHarmonic.type = 'sine';
    secondHarmonic.frequency.setValueAtTime(freqHz * 2, now);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.24, now);
    harmGain.gain.exponentialRampToValueAtTime(0.02, now + 0.6);

    nylonFundamental.connect(lp);
    secondHarmonic.connect(harmGain);
    harmGain.connect(lp);

    lp.connect(env);
    env.connect(this.masterGain);
    env.connect(this.delayNode);

    nylonFundamental.start(now);
    secondHarmonic.start(now);
    nylonFundamental.stop(now + duration + 0.05);
    secondHarmonic.stop(now + duration + 0.05);
  }

  /** Silky Caribbean Steelpan (Steel Drum) Harmonic Bloom */
  public playSteelpanNote(freqHz: number, velocity = 0.16) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.delayNode) return;

    const now = ctx.currentTime;
    const duration = 2.5;

    const bp = ctx.createBiquadFilter();
    bp.type = 'lowpass';
    bp.frequency.setValueAtTime(Math.min(3600, freqHz * 5.8), now);
    bp.frequency.exponentialRampToValueAtTime(Math.max(460, freqHz * 1.8), now + 1.1);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    // Soft rubber mallet bloom attack (~18ms)
    env.gain.linearRampToValueAtTime(velocity, now + 0.018);
    env.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    const f1 = ctx.createOscillator();
    f1.type = 'sine';
    f1.frequency.setValueAtTime(freqHz, now);

    // Steelpan characteristic tuned octave harmonic
    const f2 = ctx.createOscillator();
    f2.type = 'sine';
    f2.frequency.setValueAtTime(freqHz * 2, now);

    const f2Gain = ctx.createGain();
    f2Gain.gain.setValueAtTime(0.36, now);
    f2Gain.gain.exponentialRampToValueAtTime(0.03, now + 0.75);

    // Subtle tuned 3rd partial shimmer
    const f3 = ctx.createOscillator();
    f3.type = 'sine';
    f3.frequency.setValueAtTime(freqHz * 3, now);

    const f3Gain = ctx.createGain();
    f3Gain.gain.setValueAtTime(0.12, now);
    f3Gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

    f1.connect(bp);
    f2.connect(f2Gain);
    f2Gain.connect(bp);
    f3.connect(f3Gain);
    f3Gain.connect(bp);

    bp.connect(env);
    env.connect(this.masterGain);
    env.connect(this.delayNode);

    f1.start(now);
    f2.start(now);
    f3.start(now);
    f1.stop(now + duration + 0.05);
    f2.stop(now + duration + 0.05);
    f3.stop(now + 0.45);
  }

  public pluckNote(freqHz: number, _durationSec = 2.2, velocity = 0.18) {
    if (this.activeStyle === 'ukulele') {
      this.playUkuleleNote(freqHz, velocity);
    } else if (this.activeStyle === 'steelpan') {
      this.playSteelpanNote(freqHz, velocity);
    } else {
      this.playKalimbaNote(freqHz, velocity);
    }
  }

  /** Liquid Soap Bubble Pop Acoustic SFX (pitched by bubble diameter) */
  public playBubblePop(sizePx = 72) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.delayNode) return;

    const now = ctx.currentTime;
    const clampedSize = Math.max(44, Math.min(140, sizePx));
    const startFreq = 460 - ((clampedSize - 44) / 96) * 210; // larger bubble -> deeper bloop
    const endFreq = startFreq * 2.35;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.068);

    const popGain = ctx.createGain();
    popGain.gain.setValueAtTime(0.0001, now);
    popGain.gain.linearRampToValueAtTime(0.24, now + 0.008);
    popGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.095);

    // Gentle kalimba sparkle harmonic scaled to the active palette key
    const notes = ISLAND_SCALES[this.activeScale].notesHz;
    const chimeHz = notes[Math.floor(Math.random() * notes.length)] * 2;
    const sparkle = ctx.createOscillator();
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(chimeHz, now);

    const sparkleGain = ctx.createGain();
    sparkleGain.gain.setValueAtTime(0.0001, now);
    sparkleGain.gain.linearRampToValueAtTime(0.06, now + 0.01);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0004, now + 0.28);

    osc.connect(popGain);
    popGain.connect(this.masterGain);
    popGain.connect(this.delayNode);

    sparkle.connect(sparkleGain);
    sparkleGain.connect(this.masterGain);
    sparkleGain.connect(this.delayNode);

    osc.start(now);
    sparkle.start(now);
    osc.stop(now + 0.12);
    sparkle.stop(now + 0.32);
  }

  public strumGlissando(scaleKey: HarpScaleKey) {
    const notes = ISLAND_SCALES[scaleKey].notesHz.slice(0, 6);
    notes.forEach((freq, idx) => {
      window.setTimeout(() => {
        if (this.activeStyle === 'ukulele') {
          this.playUkuleleNote(freq, 0.16);
        } else if (this.activeStyle === 'steelpan') {
          this.playSteelpanNote(freq, 0.15);
        } else {
          this.playKalimbaNote(freq, 0.17);
        }
      }, idx * 85);
    });
  }

  public start(scaleKey: HarpScaleKey, style: Exclude<MusicTuneStyle, 'off'> = 'kalimba') {
    this.activeScale = scaleKey;
    this.activeStyle = style;
    this.ensureContext();
    this.stopTimerOnly();

    const intervalMs =
      style === 'ukulele'
        ? Math.round((60 / ISLAND_SCALES[scaleKey].bpm / 2) * 1000)
        : style === 'steelpan'
          ? Math.round((60 / (ISLAND_SCALES[scaleKey].bpm + 4) / 2) * 1000)
          : Math.round((60 / ISLAND_SCALES[scaleKey].bpm / 2) * 1000);

    const triggerNext = () => {
      if (this.activeStyle === 'off') return;
      const scale = ISLAND_SCALES[this.activeScale].notesHz;

      if (this.activeStyle === 'ukulele') {
        const idx = UKULELE_ARPEGGIO[this.stepIndex % UKULELE_ARPEGGIO.length];
        const freq = scale[idx % scale.length];
        this.playUkuleleNote(freq, 0.15);
        // Gentle warm bass root every 4 beats
        if (this.stepIndex % 4 === 0) {
          this.playUkuleleNote(scale[0] * 0.5, 0.11);
        }
      } else if (this.activeStyle === 'steelpan') {
        const idx = STEELPAN_PHRASE[this.stepIndex % STEELPAN_PHRASE.length];
        const freq = scale[idx % scale.length];
        this.playSteelpanNote(freq, 0.14);
        if (this.stepIndex % 8 === 0) {
          this.playSteelpanNote(scale[2 % scale.length] * 0.5, 0.09);
        }
      } else {
        // Calm Kalimba thumb-piano phrasing with occasional soft dyad harmony
        const idx = KALIMBA_STEPS[this.stepIndex % KALIMBA_STEPS.length];
        const freq = scale[idx % scale.length];
        this.playKalimbaNote(freq, 0.16);
        if (this.stepIndex % 6 === 0 && scale.length > 4) {
          this.playKalimbaNote(scale[(idx + 2) % scale.length], 0.09);
        }
      }
      this.stepIndex += 1;
    };

    triggerNext();
    this.timerId = window.setInterval(triggerNext, intervalMs);
  }

  public startAtmosphere(season: SeasonKey) {
    this.activeSeason = season;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    this.stopAtmosphere();
    this.isAtmospherePlaying = true;

    const now = ctx.currentTime;
    const cfg = SEASON_AMBIENCE_FILTER[season];

    this.ambienceGain = ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.0001, now);
    this.ambienceGain.gain.linearRampToValueAtTime(0.085, now + 0.9);
    this.ambienceGain.connect(this.masterGain);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * 0.24;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.setValueAtTime(cfg.centerHz, now);
    this.noiseFilter.Q.setValueAtTime(0.7, now);

    // Gentle island trade-wind / lagoon swell LFO
    this.surfLfo = ctx.createOscillator();
    this.surfLfo.type = 'sine';
    this.surfLfo.frequency.setValueAtTime(0.11, now);
    this.surfLfoGain = ctx.createGain();
    this.surfLfoGain.gain.setValueAtTime(220, now);
    this.surfLfo.connect(this.surfLfoGain);
    this.surfLfoGain.connect(this.noiseFilter.frequency);
    this.surfLfo.start(now);

    const noiseLevel = ctx.createGain();
    noiseLevel.gain.setValueAtTime(0.55, now);

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(noiseLevel);
    noiseLevel.connect(this.ambienceGain);
    this.noiseSource.start(now);

    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(cfg.chordHz[0] * 0.5, now);

    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(cfg.chordHz[1] * 0.5, now);

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.16, now);

    this.droneOsc1.connect(padGain);
    this.droneOsc2.connect(padGain);
    padGain.connect(this.ambienceGain);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  public setSeasonAtmosphere(season: SeasonKey) {
    this.activeSeason = season;
    if (this.isAtmospherePlaying && this.ctx) {
      const cfg = SEASON_AMBIENCE_FILTER[season];
      const now = this.ctx.currentTime;
      this.noiseFilter?.frequency.setTargetAtTime(cfg.centerHz, now, 0.35);
      this.droneOsc1?.frequency.setTargetAtTime(cfg.chordHz[0] * 0.5, now, 0.35);
      this.droneOsc2?.frequency.setTargetAtTime(cfg.chordHz[1] * 0.5, now, 0.35);
    }
  }

  public startSoundscape(id: Exclude<NatureSoundscapeId, 'off'>) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    this.stopAtmosphere();
    this.activeSoundscape = id;
    this.isAtmospherePlaying = true;

    const now = ctx.currentTime;
    const scaleNotes = ISLAND_SCALES[this.activeScale].notesHz;

    this.ambienceGain = ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.0001, now);
    this.ambienceGain.gain.linearRampToValueAtTime(
      id === 'seashore' ? 0.11 : id === 'rainforest' ? 0.095 : 0.085,
      now + 0.9,
    );
    this.ambienceGain.connect(this.masterGain);

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * 0.24;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    const noiseLevel = ctx.createGain();

    if (id === 'rainforest') {
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(980, now);
      this.noiseFilter.Q.setValueAtTime(0.55, now);
      noiseLevel.gain.setValueAtTime(0.65, now);

      this.natureTimerId = window.setInterval(() => {
        if (this.activeSoundscape !== 'rainforest' || !this.ctx || !this.ambienceGain) return;
        const notes = ISLAND_SCALES[this.activeScale].notesHz;
        const pick = notes[Math.floor(Math.random() * notes.length)] * 2;
        this.triggerSoftDroplet(pick);
      }, 1500);
    } else if (id === 'seashore') {
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(430, now);
      this.noiseFilter.Q.setValueAtTime(0.85, now);
      noiseLevel.gain.setValueAtTime(0.76, now);

      this.surfLfo = ctx.createOscillator();
      this.surfLfo.type = 'sine';
      this.surfLfo.frequency.setValueAtTime(0.115, now);

      this.surfLfoGain = ctx.createGain();
      this.surfLfoGain.gain.setValueAtTime(340, now);

      this.surfLfo.connect(this.surfLfoGain);
      this.surfLfoGain.connect(this.noiseFilter.frequency);
      this.surfLfo.start(now);
    } else {
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(640, now);
      this.noiseFilter.Q.setValueAtTime(0.85, now);
      noiseLevel.gain.setValueAtTime(0.32, now);

      this.natureTimerId = window.setInterval(() => {
        if (this.activeSoundscape !== 'birdsong' || !this.ctx || !this.ambienceGain) return;
        this.triggerHarmonicBirdCall();
      }, 2100);
      window.setTimeout(() => {
        if (this.activeSoundscape === 'birdsong') this.triggerHarmonicBirdCall();
      }, 360);
    }

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(noiseLevel);
    noiseLevel.connect(this.ambienceGain);
    this.noiseSource.start(now);

    const padLow = scaleNotes[0] * 0.5;
    const padFifth = scaleNotes[3] ? scaleNotes[3] * 0.5 : padLow * 1.5;

    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(padLow, now);

    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(padFifth, now);

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(id === 'seashore' ? 0.13 : 0.11, now);

    this.droneOsc1.connect(padGain);
    this.droneOsc2.connect(padGain);
    padGain.connect(this.ambienceGain);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  private triggerSoftDroplet(freqHz: number) {
    if (!this.ctx || !this.ambienceGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqHz * 0.92, now);
    osc.frequency.exponentialRampToValueAtTime(freqHz * 1.06, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ambienceGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  private triggerHarmonicBirdCall() {
    if (!this.ctx || !this.ambienceGain) return;
    const notes = ISLAND_SCALES[this.activeScale].notesHz;
    const baseNote = notes[Math.floor(Math.random() * Math.min(6, notes.length))] * 4;
    const offsets = [0, 0.14, 0.28];

    offsets.forEach((delayOffset, step) => {
      if (!this.ctx || !this.ambienceGain) return;
      const startAt = this.ctx.currentTime + delayOffset;
      const chirpFreq = baseNote * (step === 1 ? 1.125 : step === 2 ? 1.25 : 1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(chirpFreq * 0.94, startAt);
      osc.frequency.exponentialRampToValueAtTime(chirpFreq * 1.08, startAt + 0.07);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(0.13, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0005, startAt + 0.16);
      osc.connect(gain);
      gain.connect(this.ambienceGain);
      osc.start(startAt);
      osc.stop(startAt + 0.18);
    });
  }

  public stopAtmosphere() {
    this.isAtmospherePlaying = false;
    this.activeSoundscape = 'off';
    if (this.natureTimerId !== null) {
      window.clearInterval(this.natureTimerId);
      this.natureTimerId = null;
    }
    try {
      this.surfLfo?.stop();
      this.surfLfo?.disconnect();
      this.surfLfoGain?.disconnect();
      this.noiseSource?.stop();
      this.droneOsc1?.stop();
      this.droneOsc2?.stop();
      this.ambienceGain?.disconnect();
    } catch {
      // Ignore already-stopped nodes
    }
    this.surfLfo = null;
    this.surfLfoGain = null;
    this.noiseSource = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.ambienceGain = null;
    this.noiseFilter = null;
  }

  public setScale(scaleKey: HarpScaleKey) {
    this.activeScale = scaleKey;
    if (this.activeStyle !== 'off') {
      this.start(scaleKey, this.activeStyle);
    }
    if (this.activeSoundscape !== 'off' && this.ctx) {
      const notes = ISLAND_SCALES[scaleKey].notesHz;
      const now = this.ctx.currentTime;
      const padLow = notes[0] * 0.5;
      const padFifth = notes[3] ? notes[3] * 0.5 : padLow * 1.5;
      this.droneOsc1?.frequency.setTargetAtTime(padLow, now, 0.4);
      this.droneOsc2?.frequency.setTargetAtTime(padFifth, now, 0.4);
    }
  }

  private stopTimerOnly() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public stop() {
    this.activeStyle = 'off';
    this.stopTimerOnly();
  }
}

export const harpEngine = new IslandAcousticEngine();
