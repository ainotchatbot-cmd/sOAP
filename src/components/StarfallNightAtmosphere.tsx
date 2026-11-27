import React, { useEffect, useRef } from 'react';
import { DreamPreset } from '../data/palette';

export type AtmosphereTabMode =
  | 'soaps'
  | 'bath-bombs'
  | 'fruit-duos'
  | 'category-2'
  | 'medieval'
  | 'renaissance'
  | 'baroque'
  | 'romanticism'
  | 'enlightenment';

interface StarfallNightAtmosphereProps {
  preset: DreamPreset;
  catalogMode?: AtmosphereTabMode;
}

interface FallingStreak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  maxLife: number;
  thickness: number;
}

const TAB_WALLPAPERS: Record<AtmosphereTabMode, { url: string; daylightOpacity: number; twilightOpacity: number; size: string; sepiaHint?: string }> = {
  soaps: {
    url: '/assets/aistudio/Rice_paper_for_decoupage_-_Ornate_floral_triptych_in_pastel_hues_A4_a431d20b.jpg',
    daylightOpacity: 0.88,
    twilightOpacity: 0.36,
    size: 'clamp(520px, 46vw, 760px) auto',
  },
  'bath-bombs': {
    url: '/assets/aistudio/Download_premium_image_of_Vintage_floral_wallpaper__hummingbird__orchid__hummingbird__elegant_pastel_wallpaper_by_ae_about_pink_floral_pattern__vintage_pink__hummingbird_vintage_illustration__wallpaper__and_frame_2_378c9668.jpg',
    daylightOpacity: 0.86,
    twilightOpacity: 0.34,
    size: 'clamp(460px, 38vw, 640px) auto',
  },
  'fruit-duos': {
    url: '/assets/aistudio/Flowers_Scrapbook_Page_b4fdfc71.jpg',
    daylightOpacity: 0.88,
    twilightOpacity: 0.36,
    size: 'clamp(460px, 40vw, 680px) auto',
  },
  'category-2': {
    url: '/assets/aistudio/download__7__91997a89.jpg',
    daylightOpacity: 0.84,
    twilightOpacity: 0.34,
    size: 'clamp(480px, 42vw, 700px) auto',
  },
  medieval: {
    url: '/assets/aistudio/Shaylee_Morehouse_added_a_new_photo__-_Shaylee_Morehouse_d6407719.jpg',
    daylightOpacity: 0.78,
    twilightOpacity: 0.32,
    size: 'clamp(480px, 40vw, 680px) auto',
    sepiaHint: 'sepia(0.24) contrast(0.95)',
  },
  renaissance: {
    url: '/assets/aistudio/Shaylee_Morehouse_added_a_new_photo__-_Shaylee_Morehouse_d6407719.jpg',
    daylightOpacity: 0.88,
    twilightOpacity: 0.36,
    size: 'clamp(480px, 40vw, 680px) auto',
  },
  baroque: {
    url: '/assets/aistudio/download__7__91997a89.jpg',
    daylightOpacity: 0.86,
    twilightOpacity: 0.35,
    size: 'clamp(460px, 38vw, 640px) auto',
  },
  romanticism: {
    url: '/assets/aistudio/Flowers_Scrapbook_Page_b4fdfc71.jpg',
    daylightOpacity: 0.88,
    twilightOpacity: 0.35,
    size: 'clamp(460px, 38vw, 640px) auto',
  },
  enlightenment: {
    url: '/assets/aistudio/Download_premium_image_of_Vintage_floral_wallpaper__hummingbird__orchid__hummingbird__elegant_pastel_wallpaper_by_ae_about_pink_floral_pattern__vintage_pink__hummingbird_vintage_illustration__wallpaper__and_frame_2_378c9668.jpg',
    daylightOpacity: 0.88,
    twilightOpacity: 0.36,
    size: 'clamp(460px, 38vw, 640px) auto',
  },
};

export const StarfallNightAtmosphere: React.FC<StarfallNightAtmosphereProps> = React.memo(({
  preset,
  catalogMode = 'soaps',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isTwilight = preset.mode === 'twilight';
  const wallpaper = TAB_WALLPAPERS[catalogMode] ?? TAB_WALLPAPERS.soaps;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = canvas.offsetWidth * dpr);
    let height = (canvas.height = canvas.offsetHeight * dpr);

    if (!isTwilight || reducedMotion) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };

    const streaks: FallingStreak[] = [];
    let nextStreakTick = 120;
    let frameTick = 0;

    const spawnStreak = () => {
      const startX = (0.18 + Math.random() * 0.72) * width;
      const startY = (0.06 + Math.random() * 0.24) * height;
      const speedScale = (2.8 + Math.random() * 1.8) * dpr;
      const angle = (Math.PI / 180) * (130 + Math.random() * 12);
      streaks.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speedScale,
        vy: Math.sin(angle) * speedScale,
        len: (42 + Math.random() * 52) * dpr,
        life: 0,
        maxLife: 68 + Math.floor(Math.random() * 28),
        thickness: (0.9 + Math.random() * 0.5) * dpr,
      });
    };

    const draw = () => {
      frameTick += 1;
      ctx.clearRect(0, 0, width, height);

      if (frameTick >= nextStreakTick && streaks.length < 1) {
        spawnStreak();
        nextStreakTick = frameTick + 320 + Math.floor(Math.random() * 260);
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const m = streaks[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const progress = m.life / m.maxLife;
        const opacity = Math.sin(progress * Math.PI) * 0.3;
        const mag = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / mag) * m.len;
        const tailY = m.y - (m.vy / mag) * m.len;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.35, preset.starColor);
        grad.addColorStop(0.75, preset.trailColor);
        grad.addColorStop(1, 'transparent');

        ctx.globalAlpha = Math.max(0, opacity);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (m.life >= m.maxLife) {
          streaks.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [preset.starColor, preset.trailColor, isTwilight]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Per-Tab Uploaded Floral Wallpaper Layer with Smooth Sable Cross-Fade */}
      <div
        key={wallpaper.url}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${wallpaper.url}')`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
          backgroundSize: wallpaper.size,
          opacity: isTwilight ? wallpaper.twilightOpacity : wallpaper.daylightOpacity,
          filter: isTwilight
            ? 'brightness(0.74) saturate(0.84)'
            : wallpaper.sepiaHint,
        }}
      />

      {/* Calm Readability Veil + Accent Horizon Tint */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isTwilight
            ? `linear-gradient(180deg, rgba(28, 22, 42, 0.62) 0%, rgba(24, 19, 38, 0.7) 100%), radial-gradient(ellipse 72% 45% at 78% 12%, ${preset.accentSoft}, transparent 70%)`
            : `linear-gradient(180deg, rgba(250, 246, 240, 0.16) 0%, rgba(247, 242, 234, 0.24) 100%), radial-gradient(ellipse 75% 48% at 76% 12%, ${preset.accentSoft}, transparent 72%)`,
        }}
      />

      {isTwilight && (
        <canvas ref={canvasRef} className="relative z-10 w-full h-full block opacity-75" />
      )}
    </div>
  );
});

StarfallNightAtmosphere.displayName = 'StarfallNightAtmosphere';
