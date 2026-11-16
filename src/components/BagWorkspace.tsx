import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Heart,
  Loader2,
  Lock,
  MapPin,
  Minus,
  PenTool,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ALL_SOAP_CREATIONS, formatThb, SoapCreation } from '../data/soaps';
import { useLanguage } from '../data/i18n';
import { ResilientImage } from './ResilientImage';
import { RedesignedLogoMotif } from './RedesignedLogoMotif';
import { MarbleEngravingPreview } from './MarbleEngravingPreview';

export interface BagItem {
  cartKey: string;
  editionId: string;
  name: string;
  scentName: string;
  priceUsd: number;
  quantity: number;
  imageUrl: string;
  fallbackGradient: string;
  giftNote?: string;
}

export type PaymentOption = 'Apple Pay via Stripe' | 'Card (Stripe)' | 'PromptPay QR';

export interface OrderReceipt {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  gpsLabel?: string;
  engravingNote?: string;
  paymentMethod: PaymentOption;
  items: BagItem[];
  subtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
}

interface BagContentProps {
  items: BagItem[];
  wishlistIds: string[];
  accentHex: string;
  accentTextHex?: string;
  recentAddedKey: string | null;
  isDraggingOverGlobal?: boolean;
  openCheckoutNonce?: number;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearBag: () => void;
  onToggleWishlist: (soapId: string) => void;
  onOpenPodium: (soapId: string) => void;
  onAddSoapToBag: (
    soap: SoapCreation,
    quantity: number,
    asSlice: boolean,
    sourceEl?: HTMLElement | null,
  ) => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING_THB = 150;

export const BagContent: React.FC<BagContentProps> = ({
  items,
  wishlistIds,
  accentHex,
  accentTextHex = '#FFFFFF',
  recentAddedKey,
  isDraggingOverGlobal = false,
  openCheckoutNonce = 0,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
  onToggleWishlist,
  onOpenPodium,
  onAddSoapToBag,
  onClose,
  isDrawer = false,
}) => {
  const { lang, t, getSoapDisplay } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bag' | 'wishlist'>('bag');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'located' | 'error'>('idle');
  const [gpsCoords, setGpsCoords] = useState<string>('');
  const [engravingEnabled, setEngravingEnabled] = useState<boolean>(true);
  const [engravingNote, setEngravingNote] = useState<string>('GENTLEBUBBLE BY AR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('Apple Pay via Stripe');
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragHover, setIsDragHover] = useState(false);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    if (openCheckoutNonce > 0 && items.length > 0) {
      setActiveTab('bag');
      setCheckoutOpen(true);
    }
  }, [openCheckoutNonce, items.length]);

  const subtotalUsd = items.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingUsd =
    subtotalUsd === 0 || subtotalUsd >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_THB;
  const totalUsd = subtotalUsd + shippingUsd;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalUsd);
  const progressPct = Math.min(100, (subtotalUsd / FREE_SHIPPING_THRESHOLD) * 100);

  const wishlistedSoaps = ALL_SOAP_CREATIONS.filter((soap) => wishlistIds.includes(soap.id));

  const handleDetectGps = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsStatus('error');
      setFormError(
        lang === 'th'
          ? 'เบราว์เซอร์ไม่รองรับ GPS กรุณาพิมพ์ที่อยู่จัดส่ง'
          : 'GPS location is unavailable on this browser. Please type your delivery address.',
      );
      return;
    }

    setGpsStatus('locating');
    setFormError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordString = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
        setGpsCoords(coordString);

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );
          if (resp.ok) {
            const data = await resp.json();
            const addr = data?.address;
            const formatted = [
              addr?.road || addr?.neighbourhood || addr?.suburb,
              addr?.city || addr?.town || addr?.state,
              addr?.country,
            ]
              .filter(Boolean)
              .join(', ');
            if (formatted) {
              setShippingAddress(`${formatted} (GPS ${coordString})`);
              setGpsStatus('located');
              return;
            }
          }
        } catch {
          // Graceful fallback to coordinates
        }

        setShippingAddress(`GPS Verified (${coordString})`);
        setGpsStatus('located');
      },
      () => {
        setGpsStatus('error');
        setFormError(
          lang === 'th'
            ? 'ไม่ได้รับสิทธิ์เข้าถึงตำแหน่ง — กรุณากรอกที่อยู่จัดส่งด้วยตนเอง'
            : 'Location permission declined — type your address or retry GPS.',
        );
      },
      { enableHighAccuracy: true, timeout: 9000 },
    );
  };

  const finalizeOrder = (methodOverride?: PaymentOption) => {
    const activeMethod = methodOverride ?? paymentMethod;
    const trimmedName = customerName.trim() || (activeMethod === 'Apple Pay via Stripe' ? 'Apple Pay Express' : '');
    const trimmedEmail =
      customerEmail.trim() || (activeMethod === 'Apple Pay via Stripe' ? 'express@gentlebubble.com' : '');
    const trimmedAddress = shippingAddress.trim();

    if (!trimmedAddress) {
      setFormError(
        lang === 'th'
          ? 'แตะ "ใช้พิกัด GPS" หรือกรอกที่อยู่สำหรับจัดส่ง'
          : 'Tap "Use GPS" or enter your street delivery address.',
      );
      return;
    }

    if (activeMethod !== 'Apple Pay via Stripe') {
      if (!trimmedName || !trimmedEmail) {
        setFormError(
          lang === 'th'
            ? 'กรุณากรอกชื่อ อีเมล และที่อยู่จัดส่งให้ครบถ้วน'
            : 'Please enter your name, email, and delivery address.',
        );
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setFormError(
          lang === 'th'
            ? 'กรุณาระบุรูปแบบอีเมลให้ถูกต้อง'
            : 'Please enter a valid email address for your confirmation.',
        );
        return;
      }
    }

    setFormError(null);
    const suffix = Math.floor(1040 + Math.random() * 8900);
    setReceipt({
      orderNumber: `GB-${suffix}`,
      customerName: trimmedName,
      customerEmail: trimmedEmail,
      shippingAddress: trimmedAddress,
      gpsLabel: gpsCoords || undefined,
      engravingNote: engravingEnabled && engravingNote.trim() ? engravingNote.trim() : undefined,
      paymentMethod: activeMethod,
      items: [...items],
      subtotalUsd,
      shippingUsd,
      totalUsd,
    });
    onClearBag();
    setCheckoutOpen(false);
  };

  const handleCheckoutSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    finalizeOrder();
  };

  const handleResetOrder = () => {
    setReceipt(null);
    setCheckoutOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setShippingAddress('');
    setGpsStatus('idle');
    setGpsCoords('');
    onClose?.();
  };

  const handleDropOnBag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragHover(false);
    const raw = e.dataTransfer.getData('application/x-gentle-soap');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { soapId: string; asSlice?: boolean };
      const soap = ALL_SOAP_CREATIONS.find((s) => s.id === parsed.soapId);
      if (soap) {
        onAddSoapToBag(soap, 1, Boolean(parsed.asSlice), e.currentTarget);
        setActiveTab('bag');
      }
    } catch {
      // Ignore invalid payload
    }
  };

  return (
    <div
      data-drop-basket="true"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragHover(true);
      }}
      onDragLeave={() => setIsDragHover(false)}
      onDrop={handleDropOnBag}
      className="relative flex flex-col h-full justify-between bg-[var(--surface-card)] text-[var(--ink)] transition-colors"
      style={{
        outline: isDragHover || isDraggingOverGlobal ? `2px dashed ${accentHex}` : 'none',
        outlineOffset: '-4px',
      }}
    >
      {/* Visual Drag-and-Drop Overlay Cue */}
      {(isDragHover || isDraggingOverGlobal) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 z-30 rounded-xl border-2 border-dashed flex items-center justify-center backdrop-blur-[2px]"
          style={{
            borderColor: accentHex,
            backgroundColor: 'var(--accent-soft)',
          }}
        >
          <span
            className="px-4 py-2 rounded-full text-xs font-semibold shadow-lg"
            style={{ backgroundColor: accentHex, color: accentTextHex }}
          >
            {t.bagDropHint}
          </span>
        </div>
      )}

      {/* Header + Bag / Wishlist Tabs */}
      <div className="px-5 pt-4 pb-3 border-b border-[var(--border)] space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[var(--ink)]">
              {receipt
                ? t.bagConfirmed
                : checkoutOpen
                  ? t.bagCheckoutTitle
                  : activeTab === 'wishlist'
                    ? t.bagWishlistTitle
                    : t.bagTitle}
            </h2>
            {!receipt && (
              <p className="text-xs text-[var(--muted)] mt-0.5 tabular-figures">
                {activeTab === 'wishlist'
                  ? `${wishlistedSoaps.length} ${t.bagSavedCount}`
                  : `${totalCount} ${t.bagCreationsNote}`}
              </p>
            )}
          </div>

          {isDrawer && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!receipt && (
          <div
            role="tablist"
            aria-label={t.bagTitle}
            className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bag'}
              onClick={() => setActiveTab('bag')}
              className="py-1.5 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer tabular-figures"
              style={{
                backgroundColor: activeTab === 'bag' ? accentHex : 'transparent',
                color: activeTab === 'bag' ? accentTextHex : 'var(--muted)',
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.bagTab} ({totalCount})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'wishlist'}
              onClick={() => {
                setCheckoutOpen(false);
                setActiveTab('wishlist');
              }}
              className="py-1.5 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer tabular-figures"
              style={{
                backgroundColor: activeTab === 'wishlist' ? accentHex : 'transparent',
                color: activeTab === 'wishlist' ? accentTextHex : 'var(--muted)',
              }}
            >
              <Heart
                className={`w-3.5 h-3.5 ${wishlistedSoaps.length > 0 && activeTab !== 'wishlist' ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span>{t.wishlistTab} ({wishlistedSoaps.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Complimentary Shipping Progress */}
      {!receipt && activeTab === 'bag' && items.length > 0 && (
        <div className="px-5 py-3 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
          <div className="flex items-center justify-between text-xs text-[var(--ink)] mb-1.5 gap-2">
            <span className="truncate">
              {remainingForFreeShipping === 0
                ? t.bagFreeShippingDone
                : t.bagFreeShippingAway.replace('{amount}', formatThb(remainingForFreeShipping))}
            </span>
            <span className="tabular-figures font-medium shrink-0" style={{ color: accentHex }}>
              {formatThb(subtotalUsd)} / {formatThb(FREE_SHIPPING_THRESHOLD)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progressPct}%`, backgroundColor: accentHex }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {receipt ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
              <div className="pointer-events-none absolute -bottom-5 -right-5">
                <RedesignedLogoMotif variant="watermark" size={105} />
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <Check className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-xs text-[var(--muted)]">{t.bagReceiptHeader}</p>
                  <p className="font-semibold text-sm text-[var(--ink)] tabular-figures">
                    {t.bagOrderNum}{receipt.orderNumber}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[var(--muted)] space-y-1 leading-relaxed">
                <p>
                  {t.bagPaidVia}{' '}
                  <span className="font-semibold text-[var(--ink)]">{receipt.paymentMethod}</span>{' '}
                  {t.bagForCustomer} <span className="font-medium text-[var(--ink)]">{receipt.customerName}</span>
                </p>
                <p>
                  {t.bagDestination}{' '}
                  <span className="font-medium text-[var(--ink)]">{receipt.shippingAddress}</span>
                </p>
                {receipt.engravingNote && (
                  <p>
                    {t.bagEngraving}{' '}
                    <span className="font-semibold" style={{ color: accentHex }}>
                      “{receipt.engravingNote}”
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {receipt.items.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex items-center justify-between gap-2 text-xs py-2 border-b border-[var(--border)]"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--ink)] truncate">{item.name}</p>
                    <p className="text-[var(--muted)] truncate">
                      {t.bagQty} {item.quantity} · {item.scentName}
                    </p>
                  </div>
                  <span className="font-medium text-[var(--ink)] tabular-figures shrink-0">
                    {formatThb(item.priceUsd * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-semibold pt-1">
                <span>{t.bagTotalPaid}</span>
                <span className="tabular-figures">{formatThb(receipt.totalUsd)} THB</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetOrder}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: accentHex, color: accentTextHex }}
            >
              {t.bagStartAnother}
            </button>
          </motion.div>
        ) : activeTab === 'wishlist' ? (
          wishlistedSoaps.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] mx-auto flex items-center justify-center text-[var(--muted)]">
                <Heart className="w-5 h-5" />
              </div>
              <p className="font-serif text-xl text-[var(--ink)]">{t.bagNoWishlistTitle}</p>
              <p className="text-xs text-[var(--muted)] max-w-[26ch] mx-auto leading-relaxed">
                {t.bagNoWishlistDesc}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistedSoaps.map((soap) => {
                const soapCopy = getSoapDisplay(soap);
                return (
                  <div
                    key={soap.id}
                    className="flex gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenPodium(soap.id)}
                      className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] cursor-pointer"
                    >
                      <ResilientImage
                        src={soap.imageUrl}
                        alt={soapCopy.name}
                        fallbackTitle={soapCopy.name}
                        fallbackGradient={soap.fallbackGradient}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--ink)] truncate">
                            {soapCopy.name}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] truncate">
                            {soapCopy.themeLabel} · {soapCopy.scentMood}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(soap.id)}
                          aria-label={t.favRemove}
                          className="p-1 text-red-500 hover:opacity-75 transition-opacity cursor-pointer shrink-0"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            onAddSoapToBag(soap, 1, false, e.currentTarget);
                            setActiveTab('bag');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-md text-[11px] font-semibold cursor-pointer transition-opacity hover:opacity-90 tabular-figures"
                          style={{ backgroundColor: accentHex, color: accentTextHex }}
                        >
                          + {t.sizeFull}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            onAddSoapToBag(soap, 1, true, e.currentTarget);
                            setActiveTab('bag');
                          }}
                          className="py-1.5 px-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--ink)] cursor-pointer hover:border-[var(--ink)]/30 tabular-figures"
                        >
                          + {t.sizeSmall}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenPodium(soap.id)}
                          aria-label={t.inspectBtn}
                          className="p-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-card)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : items.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-[var(--surface)] border border-[var(--border)] mx-auto flex items-center justify-center text-[var(--muted)]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="font-serif text-xl text-[var(--ink)]">{t.bagEmptyTitle}</p>
            <p className="text-xs text-[var(--muted)] max-w-[26ch] mx-auto leading-relaxed">
              {t.bagEmptyDesc}
            </p>
          </div>
        ) : checkoutOpen ? (
          <form onSubmit={handleCheckoutSubmit} className="space-y-3.5" noValidate>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[var(--ink)]">
                {t.bagCheckoutHeader}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCheckoutOpen(false);
                  setFormError(null);
                }}
                className="text-xs font-medium hover:underline cursor-pointer"
                style={{ color: accentHex }}
              >
                {t.bagEditItems}
              </button>
            </div>

            {/* GPS Location Autofill */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="bag-address"
                  className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: accentHex }} />
                  <span>{t.bagDeliveryLocation}</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={gpsStatus === 'locating'}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  {gpsStatus === 'locating' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t.bagGpsLocating}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3" />
                      <span>{gpsStatus === 'located' ? t.bagGpsLocked : t.bagUseGps}</span>
                    </>
                  )}
                </button>
              </div>

              <input
                id="bag-address"
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t.bagAddressPlaceholder}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
              />
            </div>

            {/* Complimentary Laser Engraving */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="bag-engraving-toggle"
                  className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" style={{ color: accentHex }} />
                  <span>{t.bagLaserEngraving}</span>
                </label>
                <input
                  id="bag-engraving-toggle"
                  type="checkbox"
                  checked={engravingEnabled}
                  onChange={(e) => setEngravingEnabled(e.target.checked)}
                  className="w-4 h-4 accent-current cursor-pointer"
                  style={{ accentColor: accentHex }}
                />
              </div>

              {engravingEnabled && (
                <input
                  type="text"
                  maxLength={36}
                  value={engravingNote}
                  onChange={(e) => setEngravingNote(e.target.value)}
                  aria-label={t.bagLaserEngraving}
                  placeholder={t.bagEngravingPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              )}

              <MarbleEngravingPreview
                text={engravingNote}
                enabled={engravingEnabled}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
              />
            </div>

            {/* Stripe Express Apple Pay */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('Apple Pay via Stripe');
                  finalizeOrder('Apple Pay via Stripe');
                }}
                className="w-full h-11 px-4 rounded-xl bg-black border border-white/25 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors cursor-pointer shadow-md"
              >
                <span className="text-base leading-none"> Pay</span>
                <span className="text-[11px] font-medium text-white/75">via Stripe · {formatThb(totalUsd)}</span>
              </button>

              <p className="text-[11px] text-center text-[var(--muted)] flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>{t.bagApplePayNote}</span>
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="bag-name" className="block text-[11px] font-medium text-[var(--muted)] mb-1">
                  {t.bagFullName}
                </label>
                <input
                  id="bag-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Archawee Chatkul"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bag-email" className="block text-[11px] font-medium text-[var(--muted)] mb-1">
                  {t.bagEmail}
                </label>
                <input
                  id="bag-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@gentlebubble.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['Apple Pay via Stripe', 'Card (Stripe)', 'PromptPay QR'] as const).map((method) => {
                const selected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className="px-2 py-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer truncate"
                    style={{
                      borderColor: selected ? accentHex : 'var(--border)',
                      backgroundColor: selected ? accentHex : 'var(--surface)',
                      color: selected ? accentTextHex : 'var(--ink)',
                    }}
                  >
                    {method === 'Apple Pay via Stripe' ? ' Pay · Stripe' : method}
                  </button>
                );
              })}
            </div>

            {formError && (
              <p role="alert" className="text-xs text-red-500 font-medium">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer tabular-figures"
              style={{ backgroundColor: accentHex, color: accentTextHex }}
            >
              {t.bagCompleteOrder} ({paymentMethod}) · {formatThb(totalUsd)}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const isJustAdded = recentAddedKey === item.cartKey;
                return (
                  <motion.div
                    key={item.cartKey}
                    layout
                    initial={{ opacity: 0, x: 18, scale: 0.96 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      borderColor: isJustAdded ? accentHex : 'var(--border)',
                    }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3 p-3 rounded-xl border bg-[var(--surface)]"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.name}
                        fallbackTitle={item.name}
                        fallbackGradient={item.fallbackGradient}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--ink)] truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] truncate">
                            {item.scentName}
                          </p>
                          {item.giftNote && (
                            <p className="text-[11px] italic text-[var(--muted)] truncate mt-0.5">
                              “{item.giftNote}”
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartKey)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors p-1 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-card)]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, -1)}
                            aria-label="-"
                            className="w-7 h-7 flex items-center justify-center text-[var(--ink)] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium tabular-figures">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, 1)}
                            aria-label="+"
                            className="w-7 h-7 flex items-center justify-center text-[var(--ink)] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[var(--ink)] tabular-figures">
                          {formatThb(item.priceUsd * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Totals + Checkout CTA */}
      {!receipt && activeTab === 'bag' && items.length > 0 && !checkoutOpen && (
        <div className="p-5 border-t border-[var(--border)] bg-[var(--surface-card)] space-y-3 shrink-0">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-[var(--muted)]">
              <span>{t.bagSubtotal}</span>
              <span className="tabular-figures font-medium text-[var(--ink)]">{formatThb(subtotalUsd)}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>{t.bagShipping}</span>
              <span className="tabular-figures font-medium text-[var(--ink)]">
                {shippingUsd === 0 ? t.bagComplimentary : formatThb(shippingUsd)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[var(--ink)] pt-2 border-t border-[var(--border)]">
              <span>{t.bagTotal}</span>
              <span className="tabular-figures">{formatThb(totalUsd)} THB</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: accentHex, color: accentTextHex }}
          >
            {t.bagCheckoutCta} · {formatThb(totalUsd)}
          </button>
        </div>
      )}
    </div>
  );
};

interface MobileBagDrawerProps extends BagContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileBagDrawer: React.FC<MobileBagDrawerProps> = ({
  isOpen,
  onClose,
  ...rest
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#241E2C]/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md h-[90vh] sm:h-full rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-[var(--border)] shadow-2xl overflow-hidden"
          >
            <BagContent {...rest} isDrawer onClose={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
