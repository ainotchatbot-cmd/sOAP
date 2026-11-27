import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, RotateCcw, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';

export interface ZoomableImageTarget {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  activeBadge?: string;
  fallbackGradient?: string;
}

interface ImageZoomModalProps {
  target: ZoomableImageTarget | null;
  accentHex: string;
  onClose: () => void;
}

const ZOOM_STEPS = [1, 1.5, 2, 3, 4] as const;

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  target,
  accentHex,
  onClose,
}) => {
  const { lang } = useLanguage();
  const [zoom, setZoom] = useState<number>(1.5);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null,
  );

  useEffect(() => {
    if (!target) return;
    setZoom(1.5);
    setPan({ x: 0, y: 0 });
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)));
      }
      if (e.key === '-') {
        setZoom((z) => {
          const next = Math.max(1, +(z - 0.5).toFixed(1));
          if (next <= 1) setPan({ x: 0, y: 0 });
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, target]);

  if (!target || typeof document === 'undefined') return null;

  const clampPan = (nx: number, ny: number, currentZoom: number) => {
    const limit = (currentZoom - 1) * 190;
    return {
      x: Math.max(-limit, Math.min(limit, nx)),
      y: Math.max(-limit, Math.min(limit, ny)),
    };
  };

  const handleSelectZoom = (nextZoom: number) => {
    setZoom(nextZoom);
    if (nextZoom <= 1) {
      setPan({ x: 0, y: 0 });
    } else {
      setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) {
      handleSelectZoom(2.5);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragOriginRef.current) return;
    const dx = e.clientX - dragOriginRef.current.startX;
    const dy = e.clientY - dragOriginRef.current.startY;
    setPan(clampPan(dragOriginRef.current.panX + dx, dragOriginRef.current.panY + dy, zoom));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if not captured
      }
      setIsDragging(false);
      dragOriginRef.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.5 : -0.5;
    const next = Math.max(1, Math.min(4, +(zoom + delta).toFixed(1)));
    handleSelectZoom(next);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="zoom-4k-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={`4K Detail View: ${target.title}`}
        onClick={onClose}
        className="fixed inset-0 z-[80] flex flex-col bg-black/88 backdrop-blur-md text-white p-3 sm:p-6"
      >
        {/* Top Control Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
              <ZoomIn className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
              <span>{lang === 'th' ? 'มุมมองรายละเอียด 4K' : '4K Craft Detail View'}</span>
              {target.activeBadge && (
                <>
                  <span aria-hidden="true" className="text-white/40">
                    ·
                  </span>
                  <span className="tabular-figures text-amber-200">{target.activeBadge}</span>
                </>
              )}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white truncate">
              {target.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="Zoom level"
              className="inline-flex items-center gap-1 p-1 rounded-full bg-white/10 border border-white/15"
            >
              <button
                type="button"
                onClick={() => handleSelectZoom(Math.max(1, +(zoom - 0.5).toFixed(1)))}
                aria-label="Zoom out"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              {ZOOM_STEPS.map((step) => {
                const active = Math.abs(zoom - step) < 0.26;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleSelectZoom(step)}
                    className={`px-2.5 h-8 rounded-full text-xs font-semibold tabular-figures transition-colors cursor-pointer ${
                      active ? 'bg-white text-black' : 'text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {step}×
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleSelectZoom(Math.min(4, +(zoom + 0.5).toFixed(1)))}
                aria-label="Zoom in"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectZoom(1)}
                aria-label="Reset zoom"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close 4K view"
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Pan & Zoom Viewport */}
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className={`flex-1 max-w-5xl w-full mx-auto my-3 relative rounded-2xl overflow-hidden bg-black/50 border border-white/15 flex items-center justify-center select-none ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
        >
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              willChange: 'transform',
            }}
          >
            <ResilientImage
              src={target.src}
              alt={target.alt}
              fallbackTitle={target.title}
              fallbackGradient={target.fallbackGradient}
              priority
              className="max-h-[74dvh] max-w-full object-contain pointer-events-none"
            />
          </div>

          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/65 border border-white/15 text-[11px] text-white/85 whitespace-nowrap">
            {lang === 'th'
              ? 'เลื่อนลูกกลิ้งเมาส์หรือลากภาพเพื่อชมร่องแกะสลักและทอง 24K ชัดระดับ 4K'
              : 'Scroll or drag to inspect carved grooves & 24k gold craft up to 4×'}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};
