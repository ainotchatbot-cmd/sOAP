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
}

const FLOATING_BUBBLES: BubbleSpec[] = [
  { id: 1, leftPct: 2, sizePx: 175, durationSec: 22, delaySec: -4, swayPx: 32, opacity: 0.62, hueTint: 'rgba(166, 232, 255, 0.16)', rimTint: 'rgba(255, 198, 226, 0.56)' },
  { id: 2, leftPct: 14, sizePx: 230, durationSec: 27, delaySec: -11, swayPx: -26, opacity: 0.58, hueTint: 'rgba(255, 214, 236, 0.15)', rimTint: 'rgba(170, 234, 255, 0.54)' },
  { id: 3, leftPct: 28, sizePx: 145, durationSec: 19, delaySec: -7, swayPx: 28, opacity: 0.6, hueTint: 'rgba(214, 198, 255, 0.15)', rimTint: 'rgba(255, 228, 178, 0.52)' },
  { id: 4, leftPct: 43, sizePx: 260, durationSec: 29, delaySec: -16, swayPx: -30, opacity: 0.56, hueTint: 'rgba(182, 245, 224, 0.15)', rimTint: 'rgba(255, 200, 230, 0.54)' },
  { id: 5, leftPct: 58, sizePx: 190, durationSec: 23, delaySec: -3, swayPx: 24, opacity: 0.6, hueTint: 'rgba(255, 232, 188, 0.14)', rimTint: 'rgba(166, 228, 255, 0.54)' },
  { id: 6, leftPct: 71, sizePx: 240, durationSec: 26, delaySec: -14, swayPx: -28, opacity: 0.58, hueTint: 'rgba(178, 226, 255, 0.16)', rimTint: 'rgba(220, 196, 255, 0.54)' },
  { id: 7, leftPct: 82, sizePx: 165, durationSec: 20, delaySec: -9, swayPx: 26, opacity: 0.62, hueTint: 'rgba(255, 204, 230, 0.16)', rimTint: 'rgba(182, 242, 255, 0.55)' },
  { id: 8, leftPct: 48, sizePx: 125, durationSec: 18, delaySec: -6, swayPx: -20, opacity: 0.56, hueTint: 'rgba(196, 244, 232, 0.15)', rimTint: 'rgba(255, 220, 180, 0.52)' },
];

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
      // Strictly ignore any clicks on interactive navigation, controls, inputs, images, dialogs, or product cards
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

      // Hit-test huge background bubbles cleanly from frontmost id downward without blocking pointer events
      for (let i = FLOATING_BUBBLES.length - 1; i >= 0; i--) {
        const bubble = FLOATING_BUBBLES[i];
        if (poppedRef.current[bubble.id]) continue;
        const el = bubbleRefs.current[bubble.id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        if (Math.hypot(clickX - cx, clickY - cy) <= radius) {
          harpEngine.playBubblePop(bubble.sizePx);
          setPoppedIds((prev) => ({ ...prev, [bubble.id]: true }));

          const timer = window.setTimeout(() => {
            setPoppedIds((prev) => ({ ...prev, [bubble.id]: false }));
            setGenerations((prev) => ({ ...prev, [bubble.id]: (prev[bubble.id] ?? 0) + 1 }));
          }, 850);
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
        const shiftedLeft = ((bubble.leftPct + gen * 13) % 84) + 2;

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
              <span
                className="bubble-pop-ring absolute inset-0 rounded-full border-2 pointer-events-none"
                style={{
                  borderColor: bubble.rimTint,
                  boxShadow: `0 0 26px ${bubble.rimTint}`,
                }}
              />
            ) : (
              <span
                className="relative block w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.68) 0%, ${bubble.hueTint} 36%, rgba(255, 255, 255, 0.03) 68%, ${bubble.rimTint} 96%, rgba(255, 255, 255, 0.78) 100%)`,
                  boxShadow: `inset 0 0 24px rgba(255, 255, 255, 0.56), inset -6px -8px 22px ${bubble.rimTint}, 0 10px 30px rgba(170, 200, 225, 0.14)`,
                }}
              >
                {/* Primary Curved Specular Crescent Reflection */}
                <span
                  className="absolute rounded-full bg-white/90"
                  style={{
                    top: '14%',
                    left: '17%',
                    width: '30%',
                    height: '16%',
                    transform: 'rotate(-34deg)',
                    filter: 'blur(0.75px)',
                  }}
                />
                {/* Secondary Bounce Catchlight */}
                <span
                  className="absolute rounded-full bg-white/80"
                  style={{
                    bottom: '18%',
                    right: '20%',
                    width: '12%',
                    height: '12%',
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
