import React, { useEffect, useRef, useState } from 'react';
import { harpEngine } from '../utils/harpAudio';

interface BubbleSpec {
  id: number;
  leftPct: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  swayPx: number;
  opacity: number;
  hueTint: string;
  rimTint: string;
  iridescentTint: string;
}

const FLOATING_BUBBLES: BubbleSpec[] = [
  {
    id: 1,
    leftPct: 5,
    sizePx: 118,
    durationSec: 52,
    delaySec: -10,
    swayPx: 18,
    opacity: 0.3,
    hueTint: 'rgba(255, 248, 236, 0.16)',
    rimTint: 'rgba(232, 206, 174, 0.44)',
    iridescentTint: 'rgba(246, 210, 224, 0.22)',
  },
  {
    id: 2,
    leftPct: 19,
    sizePx: 164,
    durationSec: 68,
    delaySec: -28,
    swayPx: -22,
    opacity: 0.27,
    hueTint: 'rgba(248, 234, 240, 0.14)',
    rimTint: 'rgba(228, 198, 212, 0.42)',
    iridescentTint: 'rgba(196, 228, 246, 0.24)',
  },
  {
    id: 3,
    leftPct: 37,
    sizePx: 136,
    durationSec: 58,
    delaySec: -44,
    swayPx: 16,
    opacity: 0.29,
    hueTint: 'rgba(234, 246, 255, 0.15)',
    rimTint: 'rgba(196, 222, 238, 0.44)',
    iridescentTint: 'rgba(248, 222, 198, 0.22)',
  },
  {
    id: 4,
    leftPct: 54,
    sizePx: 188,
    durationSec: 74,
    delaySec: -19,
    swayPx: -24,
    opacity: 0.25,
    hueTint: 'rgba(254, 244, 230, 0.14)',
    rimTint: 'rgba(226, 204, 168, 0.4)',
    iridescentTint: 'rgba(228, 210, 248, 0.24)',
  },
  {
    id: 5,
    leftPct: 70,
    sizePx: 148,
    durationSec: 62,
    delaySec: -51,
    swayPx: 20,
    opacity: 0.28,
    hueTint: 'rgba(246, 236, 248, 0.15)',
    rimTint: 'rgba(216, 198, 232, 0.42)',
    iridescentTint: 'rgba(210, 242, 236, 0.22)',
  },
  {
    id: 6,
    leftPct: 84,
    sizePx: 174,
    durationSec: 70,
    delaySec: -34,
    swayPx: -18,
    opacity: 0.26,
    hueTint: 'rgba(255, 246, 232, 0.14)',
    rimTint: 'rgba(230, 206, 168, 0.42)',
    iridescentTint: 'rgba(246, 212, 228, 0.22)',
  },
  {
    id: 7,
    leftPct: 91,
    sizePx: 112,
    durationSec: 49,
    delaySec: -7,
    swayPx: -14,
    opacity: 0.31,
    hueTint: 'rgba(236, 246, 250, 0.16)',
    rimTint: 'rgba(198, 224, 236, 0.45)',
    iridescentTint: 'rgba(244, 228, 200, 0.22)',
  },
];

const POP_SPARK_ANGLES = [0, 60, 120, 180, 240, 300];

export const FloatingSoapBubblesOverlay: React.FC = React.memo(() => {
  const [poppedIds, setPoppedIds] = useState<Record<number, boolean>>({});
  const [generations, setGenerations] = useState<Record<number, number>>({});
  const bubbleRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const timersRef = useRef<number[]>([]);
  const poppedRef = useRef<Record<number, boolean>>({});

  poppedRef.current = poppedIds;

  useEffect(() => {
    const handleBackgroundPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest(
          'button, a, input, select, textarea, label, [role="button"], [role="tab"], [role="radio"], [role="dialog"], img, .luxury-3d-card',
        )
      ) {
        return;
      }

      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = FLOATING_BUBBLES.length - 1; i >= 0; i--) {
        const bubble = FLOATING_BUBBLES[i];
        if (poppedRef.current[bubble.id]) continue;
        const el = bubbleRefs.current[bubble.id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        if (Math.hypot(clickX - cx, clickY - cy) <= radius + 10) {
          harpEngine.playBubblePop(bubble.sizePx);
          setPoppedIds((prev) => ({ ...prev, [bubble.id]: true }));

          const timer = window.setTimeout(() => {
            setPoppedIds((prev) => ({ ...prev, [bubble.id]: false }));
            setGenerations((prev) => ({ ...prev, [bubble.id]: (prev[bubble.id] ?? 0) + 1 }));
          }, 900);
          timersRef.current.push(timer);
          break;
        }
      }
    };

    window.addEventListener('pointerdown', handleBackgroundPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleBackgroundPointerDown);
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden select-none"
    >
      {FLOATING_BUBBLES.map((bubble) => {
        const isPopped = Boolean(poppedIds[bubble.id]);
        const gen = generations[bubble.id] ?? 0;
        const shiftedLeft = ((bubble.leftPct + gen * 15) % 86) + 2;

        const customVars = {
          left: `${shiftedLeft}%`,
          width: `${bubble.sizePx}px`,
          height: `${bubble.sizePx}px`,
          animationDuration: `${bubble.durationSec}s`,
          animationDelay: gen > 0 ? '0s' : `${bubble.delaySec}s`,
          ['--bubble-sway' as string]: `${bubble.swayPx}px`,
          ['--bubble-opacity' as string]: bubble.opacity,
        } as React.CSSProperties;

        return (
          <div
            key={`${bubble.id}-${gen}`}
            ref={(el) => {
              bubbleRefs.current[bubble.id] = el;
            }}
            className="floating-soap-bubble pointer-events-none absolute top-0 rounded-full"
            style={customVars}
          >
            {isPopped ? (
              <span className="relative block w-full h-full pointer-events-none">
                <span
                  className="bubble-pop-ring absolute inset-0 rounded-full border-2 pointer-events-none"
                  style={{
                    borderColor: bubble.rimTint,
                    boxShadow: `0 0 28px ${bubble.rimTint}`,
                  }}
                />
                <span
                  className="bubble-pop-ring absolute inset-3 rounded-full border border-white/70 pointer-events-none"
                />
                {POP_SPARK_ANGLES.map((deg) => (
                  <span
                    key={deg}
                    className="bubble-pop-mist absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/85"
                    style={{ ['--mist-angle' as string]: `${deg}deg` } as React.CSSProperties}
                  />
                ))}
              </span>
            ) : (
              <span
                className="relative block w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle at 28% 26%, rgba(255, 255, 255, 0.72) 0%, ${bubble.hueTint} 34%, ${bubble.iridescentTint} 62%, rgba(255, 255, 255, 0.04) 76%, ${bubble.rimTint} 95%, rgba(255, 255, 255, 0.84) 100%)`,
                  boxShadow: `inset 0 0 26px rgba(255, 255, 255, 0.58), inset -8px -10px 26px ${bubble.rimTint}, 0 12px 34px rgba(170, 200, 225, 0.14)`,
                }}
              >
                <span
                  className="absolute rounded-full bg-white/90"
                  style={{
                    top: '14%',
                    left: '17%',
                    width: '32%',
                    height: '15%',
                    transform: 'rotate(-34deg)',
                    filter: 'blur(0.8px)',
                  }}
                />
                <span
                  className="absolute rounded-full bg-white/75"
                  style={{
                    bottom: '17%',
                    right: '19%',
                    width: '11%',
                    height: '11%',
                  }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

FloatingSoapBubblesOverlay.displayName = 'FloatingSoapBubblesOverlay';
