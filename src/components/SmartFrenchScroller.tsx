import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, FlaskConical, Layers, Sparkles } from 'lucide-react';
import { SoapLineKey } from '../data/palette';
import { useLanguage } from '../data/i18n';
import { triggerRevealSection } from './LazyGallerySection';

export type ScrollerLineFilter = 'parallel' | SoapLineKey;
export type ScrollerCatalogMode = 'soaps' | 'bath-bombs';

interface SmartFrenchScrollerProps {
  catalogMode: ScrollerCatalogMode;
  activeLineFilter: ScrollerLineFilter;
  accentHex: string;
  accentTextHex: string;
  onSelectCatalogMode: (mode: ScrollerCatalogMode) => void;
  onSelectLineFilter: (line: ScrollerLineFilter) => void;
}

interface TypeStop {
  id: string;
  label: string;
  targetSelector: string;
  lineFilter?: ScrollerLineFilter;
  swatchHex: string;
  railRatio: number;
}

const HEADER_OFFSET = 76;
const AUTO_HIDE_DELAY_MS = 1400;

export const SmartFrenchScroller: React.FC<SmartFrenchScrollerProps> = ({
  catalogMode,
  activeLineFilter,
  accentHex,
  accentTextHex,
  onSelectCatalogMode,
  onSelectLineFilter,
}) => {
  const { t } = useLanguage();
  const asideRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [trackHeight, setTrackHeight] = useState(460);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string>('spotlight');

  const typeStops: TypeStop[] = useMemo(
    () => [
      {
        id: 'spotlight',
        label: t.scrollerTypeSpotlight,
        targetSelector: '#hero',
        swatchHex: '#E8DDD0',
        railRatio: 0.03,
      },
      {
        id: 'all-lines',
        label: t.scrollerTypeAllLines,
        targetSelector: '#collection',
        lineFilter: 'parallel',
        swatchHex: '#DFC7B8',
        railRatio: 0.16,
      },
      {
        id: 'dark',
        label: t.scrollerTypeDark,
        targetSelector: '#collection',
        lineFilter: 'dark',
        swatchHex: '#846554',
        railRatio: 0.3,
      },
      {
        id: 'bright',
        label: t.scrollerTypeBright,
        targetSelector: '#collection',
        lineFilter: 'bright',
        swatchHex: '#F3ECE2',
        railRatio: 0.44,
      },
      {
        id: 'holiday',
        label: t.scrollerTypeHolidays,
        targetSelector: '#collection',
        lineFilter: 'holiday',
        swatchHex: '#D8B0A7',
        railRatio: 0.58,
      },
      {
        id: 'cases',
        label: t.scrollerTypeCases,
        targetSelector: '#gifting',
        swatchHex: '#CBB8A6',
        railRatio: 0.66,
      },
      {
        id: 'secret-vault',
        label: t.scrollerTypeVault,
        targetSelector: '#secret-vault',
        swatchHex: '#C99B72',
        railRatio: 0.74,
      },
      {
        id: 'social',
        label: t.scrollerTypeSocial,
        targetSelector: '#social-proof',
        swatchHex: '#E0B9B1',
        railRatio: 0.81,
      },
      {
        id: 'story',
        label: t.scrollerTypeStory,
        targetSelector: '#atelier',
        swatchHex: '#B69A87',
        railRatio: 0.87,
      },
      {
        id: 'reviews',
        label: t.scrollerTypeReviews,
        targetSelector: '#reviews',
        swatchHex: '#D7C5B6',
        railRatio: 0.93,
      },
      {
        id: 'guide',
        label: t.scrollerTypeGuide,
        targetSelector: '#botanical-guide',
        swatchHex: '#A88D79',
        railRatio: 0.98,
      },
    ],
    [t],
  );

  const scheduleAutoHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      if (!isPressed && !isHovered && !isTypeMenuOpen) {
        setIsVisible(false);
      }
    }, AUTO_HIDE_DELAY_MS);
  }, [isHovered, isPressed, isTypeMenuOpen]);

  const revealScroller = useCallback(() => {
    setIsVisible(true);
    scheduleAutoHide();
  }, [scheduleAutoHide]);

  // Measure live track height so the sablé rail runs cleanly across the full viewport height
  useEffect(() => {
    const measureTrack = () => {
      if (trackRef.current) {
        setTrackHeight(Math.max(220, trackRef.current.clientHeight));
      }
    };
    measureTrack();
    window.addEventListener('resize', measureTrack, { passive: true });
    return () => window.removeEventListener('resize', measureTrack);
  }, []);

  // Sync live scroll position, detect current section type, and show scroller only while scrolling
  useEffect(() => {
    const syncFromScroll = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setScrollRatio(ratio);

      const probeY = window.scrollY + window.innerHeight * 0.34;
      const guideEl = document.querySelector('#botanical-guide') as HTMLElement | null;
      const reviewsEl = document.querySelector('#reviews') as HTMLElement | null;
      const atelierEl = document.querySelector('#atelier') as HTMLElement | null;
      const socialEl = document.querySelector('#social-proof') as HTMLElement | null;
      const vaultEl = document.querySelector('#secret-vault') as HTMLElement | null;
      const giftingEl = document.querySelector('#gifting') as HTMLElement | null;
      const collectionEl = document.querySelector('#collection') as HTMLElement | null;

      if (guideEl && probeY >= guideEl.offsetTop) {
        setActiveStopId('guide');
      } else if (reviewsEl && probeY >= reviewsEl.offsetTop) {
        setActiveStopId('reviews');
      } else if (atelierEl && probeY >= atelierEl.offsetTop) {
        setActiveStopId('story');
      } else if (socialEl && probeY >= socialEl.offsetTop) {
        setActiveStopId('social');
      } else if (vaultEl && probeY >= vaultEl.offsetTop) {
        setActiveStopId('secret-vault');
      } else if (giftingEl && probeY >= giftingEl.offsetTop) {
        setActiveStopId('cases');
      } else if (collectionEl && probeY >= collectionEl.offsetTop) {
        setActiveStopId(
          activeLineFilter === 'dark'
            ? 'dark'
            : activeLineFilter === 'bright'
              ? 'bright'
              : activeLineFilter === 'holiday'
                ? 'holiday'
                : 'all-lines',
        );
      } else {
        setActiveStopId('spotlight');
      }
    };

    const handleScroll = () => {
      revealScroller();
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeLineFilter, revealScroller]);

  useEffect(() => {
    if (isPressed || isHovered || isTypeMenuOpen) {
      setIsVisible(true);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    } else {
      scheduleAutoHide();
    }
  }, [isPressed, isHovered, isTypeMenuOpen, scheduleAutoHide]);

  useEffect(() => {
    if (!isTypeMenuOpen) return;
    const handleOutsidePointer = (e: PointerEvent) => {
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        setIsTypeMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handleOutsidePointer);
    return () => window.removeEventListener('pointerdown', handleOutsidePointer);
  }, [isTypeMenuOpen]);

  const scrollToClientY = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    window.scrollTo({
      top: ratio * maxScroll,
      behavior: 'instant',
    });
    setScrollRatio(ratio);
  }, []);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPressed(true);
    setIsVisible(true);
    scrollToClientY(e.clientY);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressed) return;
    scrollToClientY(e.clientY);
  };

  const handleTrackPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressed) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsPressed(false);
  };

  const handleJumpToType = useCallback(
    (stop: TypeStop) => {
      setIsPressed(true);
      setIsVisible(true);
      triggerRevealSection(stop.targetSelector);
      if (stop.lineFilter) {
        onSelectLineFilter(stop.lineFilter);
      }
      setActiveStopId(stop.id);

      window.requestAnimationFrame(() => {
        const targetEl = document.querySelector(stop.targetSelector) as HTMLElement | null;
        if (targetEl) {
          const targetTop = Math.max(
            0,
            targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
          );
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });

      window.setTimeout(() => {
        setIsPressed(false);
      }, 320);
    },
    [onSelectLineFilter],
  );

  const handleSwitchModeAndScroll = useCallback(
    (nextMode: ScrollerCatalogMode) => {
      setIsPressed(true);
      setIsVisible(true);
      onSelectCatalogMode(nextMode);
      triggerRevealSection('#collection');

      let attempts = 0;
      const tryScroll = () => {
        const targetEl = document.querySelector('#collection') as HTMLElement | null;
        if (targetEl) {
          const targetTop = Math.max(
            0,
            targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
          );
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
          setIsPressed(false);
          return;
        }
        attempts += 1;
        if (attempts < 24) {
          window.setTimeout(tryScroll, 40);
        } else {
          setIsPressed(false);
        }
      };
      window.setTimeout(tryScroll, 60);
    },
    [onSelectCatalogMode],
  );

  const paddingY = 20;
  const thumbY = paddingY + scrollRatio * Math.max(40, trackHeight - paddingY * 2);
  const activeStop = typeStops.find((s) => s.id === activeStopId) ?? typeStops[0];
  const scrollPercent = Math.round(scrollRatio * 100);

  // Subtle pinch waist path along the quiet sablé full-length hairline rail when pressed
  const pinchDelta = isPressed ? 3.2 : 0;
  const pinchSpan = 28;
  const yTop = Math.max(6, thumbY - pinchSpan);
  const yMid = thumbY;
  const yBot = Math.min(trackHeight - 6, thumbY + pinchSpan);

  const leftLinePath = isPressed
    ? `M 9 6 L 9 ${yTop} C 9 ${yTop + 10}, ${9 + pinchDelta} ${yMid - 8}, ${9 + pinchDelta} ${yMid} C ${9 + pinchDelta} ${yMid + 8}, 9 ${yBot - 10}, 9 ${yBot} L 9 ${trackHeight - 6}`
    : `M 9 6 L 9 ${trackHeight - 6}`;

  const rightLinePath = isPressed
    ? `M 15 6 L 15 ${yTop} C 15 ${yTop + 10}, ${15 - pinchDelta} ${yMid - 8}, ${15 - pinchDelta} ${yMid} C ${15 - pinchDelta} ${yMid + 8}, 15 ${yBot - 10}, 15 ${yBot} L 15 ${trackHeight - 6}`
    : `M 15 6 L 15 ${trackHeight - 6}`;

  return (
    <aside
      ref={asideRef}
      aria-label={t.scrollerAriaLabel}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={`fixed right-1 sm:right-2 top-[72px] bottom-3 z-40 flex items-stretch gap-2 select-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-auto'
      }`}
    >
      {/* Discreet Sablé Type Menu Drawer when opened */}
      <AnimatePresence>
        {isTypeMenuOpen && isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="self-center w-48 p-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-xl shadow-lg space-y-2"
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--border)]">
              <div className="flex items-center gap-1.5 min-w-0">
                {/* Tiny 3-Color Soap Bar Swatch */}
                <span
                  aria-hidden="true"
                  className="inline-flex flex-col h-3 w-3 rounded-[3px] overflow-hidden border border-[var(--border)] shrink-0"
                >
                  <span className="h-1/3 w-full bg-[#F5EBE0]" />
                  <span className="h-1/3 w-full bg-[#DFB4AC]" />
                  <span className="h-1/3 w-full bg-[#92735F]" />
                </span>
                <span className="text-[11px] font-medium text-[var(--ink)] truncate">
                  {t.scrollerTypesBtn}
                </span>
              </div>
              <span className="text-[10px] tabular-figures text-[var(--muted)]">
                {scrollPercent}%
              </span>
            </div>

            {/* Quiet Collection Mode Toggle */}
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]">
              <button
                type="button"
                onClick={() => handleSwitchModeAndScroll('soaps')}
                className="px-2 py-1 rounded-full text-[10px] font-medium inline-flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap truncate"
                style={{
                  backgroundColor: catalogMode === 'soaps' ? accentHex : 'transparent',
                  color: catalogMode === 'soaps' ? accentTextHex : 'var(--muted)',
                }}
              >
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{t.modeSoapsBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchModeAndScroll('bath-bombs')}
                className="px-2 py-1 rounded-full text-[10px] font-medium inline-flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap truncate"
                style={{
                  backgroundColor: catalogMode === 'bath-bombs' ? accentHex : 'transparent',
                  color: catalogMode === 'bath-bombs' ? accentTextHex : 'var(--muted)',
                }}
              >
                <FlaskConical className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{t.modeBathBombsBtn}</span>
              </button>
            </div>

            {/* Quiet Sablé Type Waypoints */}
            <div className="space-y-0.5 max-h-[260px] overflow-y-auto pr-0.5">
              {typeStops.map((stop) => {
                const isActive = activeStopId === stop.id;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => handleJumpToType(stop)}
                    className="w-full px-2.5 py-1.5 rounded-xl text-left text-[11px] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isActive ? 'var(--surface)' : 'transparent',
                      color: isActive ? 'var(--ink)' : 'var(--muted)',
                      border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    }}
                  >
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full shrink-0 border border-[var(--border)]"
                        style={{ backgroundColor: stop.swatchHex }}
                      />
                      <span className={`truncate ${isActive ? 'font-semibold' : ''}`}>
                        {stop.label}
                      </span>
                    </span>
                    <span className="text-[9.5px] tabular-figures opacity-70 shrink-0">
                      {Math.round(stop.railRatio * 100)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Height Auto-Hiding Sablé Rail + 3-Color Soap Bar Thumb */}
      <div className="flex flex-col items-center h-full gap-1.5 py-1">
        {/* Quiet "By Type" Toggle Trigger */}
        <button
          type="button"
          onClick={() => setIsTypeMenuOpen((prev) => !prev)}
          aria-expanded={isTypeMenuOpen}
          title={t.scrollerTypesBtn}
          className={`px-1.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/86 backdrop-blur-md text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer inline-flex items-center gap-0.5 text-[10px] font-medium shrink-0 ${
            isVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <Layers className="w-3 h-3" />
          <ChevronDown
            className={`w-2.5 h-2.5 transition-transform duration-200 ${
              isTypeMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Full-Length Scroll Track spanning top-to-bottom */}
        <div
          ref={trackRef}
          role="slider"
          aria-label={t.scrollerAriaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={scrollPercent}
          tabIndex={0}
          onKeyDown={(e) => {
            revealScroller();
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
              e.preventDefault();
              window.scrollBy({ top: e.key === 'PageDown' ? 520 : 180, behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
              e.preventDefault();
              window.scrollBy({ top: e.key === 'PageUp' ? -520 : -180, behavior: 'smooth' });
            }
          }}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerEnd}
          onPointerCancel={handleTrackPointerEnd}
          className="relative flex-1 w-6 flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Quiet Sablé Pinched Hairline Rail */}
          <svg
            width="24"
            height={trackHeight}
            viewBox={`0 0 24 ${trackHeight}`}
            className="pointer-events-none h-full w-6 overflow-visible"
            aria-hidden="true"
          >
            <rect
              x="11.25"
              y="6"
              width="1.5"
              height={Math.max(10, trackHeight - 12)}
              rx="0.75"
              fill="var(--muted)"
              opacity={isPressed ? 0.28 : 0.16}
            />
            <motion.path
              animate={{ d: leftLinePath }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              fill="none"
              stroke="var(--muted)"
              strokeOpacity={isPressed ? 0.36 : 0.14}
              strokeWidth="0.9"
            />
            <motion.path
              animate={{ d: rightLinePath }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              fill="none"
              stroke="var(--muted)"
              strokeOpacity={isPressed ? 0.36 : 0.14}
              strokeWidth="0.9"
            />
          </svg>

          {/* Subtle Clickable Type Pips Along Full Viewport Height */}
          {typeStops.map((stop) => {
            const pipTop = paddingY + stop.railRatio * Math.max(40, trackHeight - paddingY * 2);
            const isActive = activeStopId === stop.id;
            return (
              <button
                key={stop.id}
                type="button"
                aria-label={stop.label}
                title={stop.label}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJumpToType(stop);
                }}
                style={{ top: `${pipTop}px` }}
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity cursor-pointer ${
                  isActive ? 'w-2 h-2 opacity-90' : 'w-1.5 h-1.5 opacity-35 hover:opacity-85'
                }`}
              >
                <span
                  className="block w-full h-full rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: stop.swatchHex }}
                />
              </button>
            );
          })}

          {/* 3-Color Artisanal Soap Bar Thumb that Softly Pinches Like a Bell When Pressed */}
          <motion.div
            style={{ top: `${thumbY}px` }}
            animate={
              isPressed
                ? { scaleX: 1.12, scaleY: 1.06 }
                : { scaleX: isHovered ? 1.04 : 1, scaleY: 1 }
            }
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center"
          >
            {/* Sculpted 3-Color Soap Bar SVG — morphs softly into a pinched bell waist on press */}
            <svg
              width="24"
              height="40"
              viewBox="0 0 24 40"
              className="drop-shadow-[0_3px_8px_rgba(42,33,28,0.18)] overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="sableSoapBellClip">
                  <motion.path
                    animate={{
                      d: isPressed
                        ? 'M12 2 C9.2 2 8.4 6.5 8 11.5 C7.5 18 4.2 26 2.8 31.2 C2.3 33.4 3.8 36 6.4 36 L17.6 36 C20.2 36 21.7 33.4 21.2 31.2 C19.8 26 16.5 18 16 11.5 C15.6 6.5 14.8 2 12 2 Z'
                        : 'M7 3 C4.8 3 4 4.4 4 6.8 L4 33.2 C4 35.6 4.8 37 7 37 L17 37 C19.2 37 20 35.6 20 33.2 L20 6.8 C20 4.4 19.2 3 17 3 Z',
                    }}
                    transition={{ type: 'spring', stiffness: 440, damping: 21 }}
                  />
                </clipPath>
              </defs>

              {/* 3-Color Artisanal Sablé Soap Bar Layers (Cream Ivory · Dusty Blush Rose · Sablé Cacao) */}
              <g clipPath="url(#sableSoapBellClip)">
                <rect x="0" y="0" width="24" height="13.5" fill="#F5EBE0" />
                <rect x="0" y="13.5" width="24" height="12.5" fill="#DFB4AC" />
                <rect x="0" y="26" width="24" height="14" fill="#92735F" />
                {/* Subtle diagonal scrub groove lines & soap glaze highlight */}
                <path
                  d="M5 10 L19 16 M5 19 L19 25 M5 28 L19 34"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="0.7"
                />
                <path
                  d="M6.8 6 L6.8 33"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>

              {/* Quiet Porcelaneous Soap Outline */}
              <motion.path
                animate={{
                  d: isPressed
                    ? 'M12 2 C9.2 2 8.4 6.5 8 11.5 C7.5 18 4.2 26 2.8 31.2 C2.3 33.4 3.8 36 6.4 36 L17.6 36 C20.2 36 21.7 33.4 21.2 31.2 C19.8 26 16.5 18 16 11.5 C15.6 6.5 14.8 2 12 2 Z'
                    : 'M7 3 C4.8 3 4 4.4 4 6.8 L4 33.2 C4 35.6 4.8 37 7 37 L17 37 C19.2 37 20 35.6 20 33.2 L20 6.8 C20 4.4 19.2 3 17 3 Z',
                }}
                transition={{ type: 'spring', stiffness: 440, damping: 21 }}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
              />
            </svg>

            {/* Quiet Sablé Readout Pill beside the Soap Bar when dragging/hovering */}
            <AnimatePresence>
              {(isPressed || isHovered) && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-7 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md shadow-sm whitespace-nowrap flex items-center gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full border border-[var(--border)] shrink-0"
                    style={{ backgroundColor: activeStop.swatchHex }}
                  />
                  <span className="text-[11px] font-medium text-[var(--ink)]">
                    {activeStop.label}
                  </span>
                  <span className="text-[10px] tabular-figures text-[var(--muted)]">
                    · {scrollPercent}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </aside>
  );
};
