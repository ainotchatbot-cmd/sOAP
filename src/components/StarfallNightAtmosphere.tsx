import React, { useEffect, useRef } from 'react';
import { DreamPreset } from '../data/palette';

interface StarfallNightAtmosphereProps {
  preset: DreamPreset;
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

const FLORAL_TRIPTYCH_WALLPAPER_URL =
  '/assets/aistudio/Rice_paper_for_decoupage_-_Ornate_floral_triptych_in_pastel_hues_A4_a431d20b.jpg';

export const StarfallNightAtmosphere: React.FC<StarfallNightAtmosphereProps> = React.memo(({ preset }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isTwilight = preset.mode === 'twilight';

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
    let nextStreakTick = 54;
    let frameTick = 0;

    const spawnStreak = () => {
      const startX = (0.14 + Math.random() * 0.8) * width;
      const startY = (0.04 + Math.random() * 0.28) * height;
      const speedScale = (4.2 + Math.random() * 3.4) * dpr;
      const angle = (Math.PI / 180) * (128 + Math.random() * 16);
      streaks.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speedScale,
        vy: Math.sin(angle) * speedScale,
        len: (56 + Math.random() * 80) * dpr,
        life: 0,
        maxLife: 46 + Math.floor(Math.random() * 24),
        thickness: (1.1 + Math.random() * 0.8) * dpr,
      });
    };

    const draw = () => {
      frameTick += 1;
      ctx.clearRect(0, 0, width, height);

      if (frameTick >= nextStreakTick && streaks.length < 2) {
        spawnStreak();
        nextStreakTick = frameTick + 120 + Math.floor(Math.random() * 140);
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const m = streaks[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const progress = m.life / m.maxLife;
        const opacity = Math.sin(progress * Math.PI) * 0.68;
        const mag = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / mag) * m.len;
        const tailY = m.y - (m.vy / mag) * m.len;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.35, preset.starColor);
        grad.addColorStop(0.7, preset.trailColor);
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
      {/* Fixed Stationary Ornate Floral Triptych Wallpaper (stays pinned while content scrolls above) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url('${FLORAL_TRIPTYCH_WALLPAPER_URL}')`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'clamp(520px, 46vw, 760px) auto',
          opacity: isTwilight ? 0.44 : 0.94,
          filter: isTwilight ? 'brightness(0.76) saturate(0.88)' : undefined,
        }}
      />

      {/* Whisper-light Daylight Glaze / Balanced Twilight Tint so ornate flowers stay sharp */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isTwilight
            ? `linear-gradient(180deg, rgba(28, 22, 42, 0.56) 0%, rgba(24, 19, 38, 0.62) 100%), radial-gradient(ellipse 75% 48% at 78% 12%, ${preset.accentSoft}, transparent 70%)`
            : `linear-gradient(180deg, rgba(250, 246, 240, 0.08) 0%, rgba(247, 242, 234, 0.14) 100%), radial-gradient(ellipse 78% 50% at 76% 12%, ${preset.accentSoft}, transparent 72%)`,
        }}
      />

      {isTwilight && (
        <canvas ref={canvasRef} className="relative z-10 w-full h-full block opacity-90" />
      )}
    </div>
  );
});

StarfallNightAtmosphere.displayName = 'StarfallNightAtmosphere';
