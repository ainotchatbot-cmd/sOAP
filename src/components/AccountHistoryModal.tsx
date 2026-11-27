import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  History,
  LogIn,
  LogOut,
  MapPin,
  PackageCheck,
  Receipt,
  RefreshCw,
  Trash2,
  Truck,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { User } from '../firebase';
import { useLanguage } from '../data/i18n';
import { formatThb } from '../data/soaps';
import {
  AtelierOrderRecord,
  AtelierOrderStatus,
  LocalAccountProfile,
  PaymentStatus,
  SavedHistoryItem,
} from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';

interface AccountHistoryModalProps {
  isOpen: boolean;
  user: User | null;
  activeLocalAccount: LocalAccountProfile | null;
  localAccounts: LocalAccountProfile[];
  historyItems: SavedHistoryItem[];
  orderItems: AtelierOrderRecord[];
  accentHex: string;
  accentTextHex?: string;
  onClose: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onClearHistory: () => void;
  onSelectHistoryItem: (entry: SavedHistoryItem) => void;
  onConnectLocalAccount: (displayName: string, email: string) => void;
  onSwitchLocalAccount: (accountId: string) => void;
  onDisconnectLocalAccount: () => void;
  onRefreshTracking?: () => Promise<void>;
}

const ORDER_STAGES: Array<{
  id: AtelierOrderStatus;
  labelTh: string;
  labelEn: string;
}> = [
  { id: 'queued', labelTh: 'รับคำสั่ง', labelEn: 'Queued' },
  { id: 'molding', labelTh: 'สลักลาย', labelEn: 'Carved Craft' },
  { id: 'batching', labelTh: 'ปรุงสูตร', labelEn: 'Batching' },
  { id: 'curing', labelTh: 'บ่ม/แช่แข็ง', labelEn: 'Curing' },
  { id: 'packing', labelTh: 'แพ็คผนึก', labelEn: 'Packing' },
  { id: 'shipped', labelTh: 'จัดส่งแล้ว', labelEn: 'Shipped' },
];

const PAYMENT_STATUS_STYLE: Record<
  PaymentStatus,
  { labelEn: string; labelTh: string; bg: string; fg: string; border: string }
> = {
  paid: {
    labelEn: 'PAID',
    labelTh: 'ชำระแล้ว',
    bg: 'rgba(22, 163, 74, 0.14)',
    fg: '#15803D',
    border: 'rgba(22, 163, 74, 0.35)',
  },
  pending: {
    labelEn: 'PENDING PAYMENT',
    labelTh: 'รอตรวจสอบยอด',
    bg: 'rgba(217, 119, 6, 0.14)',
    fg: '#B45309',
    border: 'rgba(217, 119, 6, 0.35)',
  },
  cod: {
    labelEn: 'COLLECT ON DELIVERY',
    labelTh: 'เก็บเงินปลายทาง',
    bg: 'rgba(79, 70, 229, 0.12)',
    fg: '#4338CA',
    border: 'rgba(79, 70, 229, 0.3)',
  },
  refunded: {
    labelEn: 'REFUNDED',
    labelTh: 'คืนเงินแล้ว',
    bg: 'rgba(107, 114, 128, 0.14)',
    fg: '#4B5563',
    border: 'rgba(107, 114, 128, 0.3)',
  },
};

export const AccountHistoryModal: React.FC<AccountHistoryModalProps> = ({
  isOpen,
  user,
  activeLocalAccount,
  localAccounts,
  historyItems,
  orderItems,
  accentHex,
  accentTextHex = '#FFFFFF',
  onClose,
  onSignIn,
  onSignOut,
  onClearHistory,
  onSelectHistoryItem,
  onConnectLocalAccount,
  onSwitchLocalAccount,
  onDisconnectLocalAccount,
  onRefreshTracking,
}) => {
  const { lang, t } = useLanguage();
  const [tab, setTab] = useState<'orders' | 'viewed' | 'accounts'>(
    orderItems.length > 0 ? 'orders' : 'viewed',
  );
  const [localNameInput, setLocalNameInput] = useState('');
  const [localEmailInput, setLocalEmailInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasConnectedProfile = Boolean(user || activeLocalAccount);

  useEffect(() => {
    if (isOpen && tab === 'orders' && orderItems.length > 0 && onRefreshTracking) {
      setIsRefreshing(true);
      void onRefreshTracking().finally(() => setIsRefreshing(false));
    }
  }, [isOpen, tab, orderItems.length, onRefreshTracking]);

  if (!isOpen) return null;

  const handleLocalCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = localEmailInput.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError(
        lang === 'th'
          ? 'กรุณาระบุอีเมลที่ถูกต้องสำหรับเชื่อมต่อบัญชี'
          : 'Please enter a valid email address to connect your local account.',
      );
      return;
    }
    setFormError(null);
    onConnectLocalAccount(localNameInput.trim() || cleanEmail.split('@')[0], cleanEmail);
    setLocalNameInput('');
    setLocalEmailInput('');
    setTab('orders');
  };

  const activeEmail = user?.email || activeLocalAccount?.email || '';
  const activeName =
    user?.displayName || activeLocalAccount?.displayName || activeEmail || 'Collector';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241E2C]/65 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.historyTitle}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90dvh] flex flex-col luxury-3d-card bg-[var(--surface-card)] border border-[var(--border)] overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[var(--ink)]">{t.historyTitle}</h2>
            <p className="text-[11px] text-[var(--muted)]">
              {lang === 'th'
                ? 'ดูประวัติรายการที่เข้าชมและสถานะคำสั่งซื้อของคุณแบบเรียลไทม์'
                : 'Track your viewed rituals and order status in real time'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface-card)] flex items-center justify-center text-[var(--ink)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Active Profile Bar or Quick Connect */}
          {hasConnectedProfile ? (
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={activeName}
                    className="w-9 h-9 rounded-full border border-[var(--border)] shrink-0 object-cover"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ backgroundColor: accentHex, color: accentTextHex }}
                  >
                    {activeName[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[var(--ink)] truncate">{activeName}</p>
                    <span className="px-1.5 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border)] text-[9.5px] font-medium text-[var(--muted)]">
                      {user
                        ? 'Google'
                        : lang === 'th'
                          ? 'บัญชีสมาชิก'
                          : 'Saved Profile'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] truncate">{activeEmail}</p>
                  {activeLocalAccount?.defaultAddress && (
                    <p className="text-[10.5px] text-[var(--muted)] truncate inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                      <span className="truncate">{activeLocalAccount.defaultAddress}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!user && (
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentHex, color: accentTextHex }}
                  >
                    <LogIn className="w-3 h-3" />
                    <span>{lang === 'th' ? 'เชื่อม Google' : 'Sync Google'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      onSignOut();
                    } else {
                      onDisconnectLocalAccount();
                    }
                  }}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/30 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.signOutBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
                    <History className="w-4 h-4" style={{ color: accentHex }} />
                    <span>
                      {lang === 'th'
                        ? 'เชื่อมต่อบัญชีเพื่อบันทึกประวัติและติดตามคำสั่งซื้อ'
                        : 'Connect an Account to Track Orders & Paid Status'}
                    </span>
                  </p>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    {t.historySignInPrompt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onSignIn}
                  className="luxury-3d-pill inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90 shrink-0"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.signInBtn} Google</span>
                </button>
              </div>

              {/* Instant Local Collector Account Creation */}
              <form
                onSubmit={handleLocalCreateSubmit}
                className="pt-3 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-2"
              >
                <input
                  type="text"
                  value={localNameInput}
                  onChange={(e) => setLocalNameInput(e.target.value)}
                  placeholder={lang === 'th' ? 'ชื่อลูกค้า (เช่น อาชาวี)' : 'Collector Name (e.g. Archawee)'}
                  className="sm:col-span-4 px-3 py-2 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <input
                  type="email"
                  value={localEmailInput}
                  onChange={(e) => {
                    setFormError(null);
                    setLocalEmailInput(e.target.value);
                  }}
                  placeholder={lang === 'th' ? 'อีเมลสำหรับติดตามพัสดุ' : 'Email for order tracking'}
                  className="sm:col-span-5 px-3 py-2 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="sm:col-span-3 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/35 text-xs font-semibold text-[var(--ink)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" style={{ color: accentHex }} />
                  <span>{lang === 'th' ? 'บันทึกโปรไฟล์' : 'Save Profile'}</span>
                </button>
              </form>
              {formError && <p className="text-[11px] text-red-500 font-medium">{formError}</p>}
            </div>
          )}

          {/* Tabs: Orders & Tracking | Viewed Formulas | Local Accounts Directory */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex-1 min-w-[260px]">
              <button
                type="button"
                onClick={() => setTab('orders')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: tab === 'orders' ? accentHex : 'transparent',
                  color: tab === 'orders' ? accentTextHex : 'var(--muted)',
                }}
              >
                <Receipt className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {t.historyOrdersTab} ({orderItems.length})
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTab('viewed')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: tab === 'viewed' ? accentHex : 'transparent',
                  color: tab === 'viewed' ? accentTextHex : 'var(--muted)',
                }}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {t.historyViewedTab} ({historyItems.length})
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTab('accounts')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: tab === 'accounts' ? accentHex : 'transparent',
                  color: tab === 'accounts' ? accentTextHex : 'var(--muted)',
                }}
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {lang === 'th' ? 'บัญชีที่บันทึก' : 'Accounts'} ({localAccounts.length})
                </span>
              </button>
            </div>

            {tab === 'viewed' && historyItems.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--muted)] hover:text-red-500 inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.historyClearBtn}</span>
              </button>
            )}

            {tab === 'orders' && orderItems.length > 0 && onRefreshTracking && (
              <button
                type="button"
                disabled={isRefreshing}
                onClick={() => {
                  setIsRefreshing(true);
                  void onRefreshTracking().finally(() => setIsRefreshing(false));
                }}
                className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[11px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/30 inline-flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{lang === 'th' ? 'อัปเดตสถานะ' : 'Refresh'}</span>
              </button>
            )}
          </div>

          {tab === 'accounts' ? (
            <div className="space-y-3">
              <form
                onSubmit={handleLocalCreateSubmit}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] grid grid-cols-1 sm:grid-cols-12 gap-2"
              >
                <input
                  type="text"
                  value={localNameInput}
                  onChange={(e) => setLocalNameInput(e.target.value)}
                  placeholder={lang === 'th' ? 'เพิ่มชื่อบัญชีใหม่' : 'New account name'}
                  className="sm:col-span-4 px-3 py-1.5 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <input
                  type="email"
                  value={localEmailInput}
                  onChange={(e) => {
                    setFormError(null);
                    setLocalEmailInput(e.target.value);
                  }}
                  placeholder="you@gentlebubble.com"
                  className="sm:col-span-5 px-3 py-1.5 text-xs rounded-lg bg-[var(--surface-card)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="sm:col-span-3 px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'เพิ่ม/สลับ' : 'Add / Switch'}</span>
                </button>
              </form>
              {formError && <p className="text-[11px] text-red-500 font-medium">{formError}</p>}

              {localAccounts.length === 0 ? (
                <p className="py-8 text-center text-xs text-[var(--muted)]">
                  {lang === 'th'
                    ? 'ยังไม่มีบัญชีที่บันทึกไว้บนอุปกรณ์นี้'
                    : 'No local collector accounts saved on this device yet.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {localAccounts.map((acct) => {
                    const isActive =
                      activeLocalAccount?.accountId === acct.accountId ||
                      (user?.email && user.email.toLowerCase() === acct.email.toLowerCase());
                    return (
                      <div
                        key={acct.accountId}
                        className="p-3 rounded-xl border bg-[var(--surface)] flex items-center justify-between gap-3"
                        style={{
                          borderColor: isActive ? accentHex : 'var(--border)',
                        }}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-[var(--ink)] truncate">
                              {acct.displayName}
                            </p>
                            {isActive && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase"
                                style={{ backgroundColor: 'var(--accent-soft)', color: accentHex }}
                              >
                                {lang === 'th' ? 'ใช้งานอยู่' : 'Active'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--muted)] truncate">{acct.email}</p>
                          {acct.defaultAddress && (
                            <p className="text-[10.5px] text-[var(--muted)] truncate">
                              {acct.defaultAddress}
                            </p>
                          )}
                        </div>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchLocalAccount(acct.accountId);
                              setTab('orders');
                            }}
                            className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/35 text-[11px] font-semibold text-[var(--ink)] cursor-pointer shrink-0"
                          >
                            {lang === 'th' ? 'สลับใช้บัญชี' : 'Switch'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : tab === 'viewed' ? (
            historyItems.length === 0 ? (
              <p className="py-10 text-center text-xs text-[var(--muted)]">
                {t.historyEmptyViewed}
              </p>
            ) : (
              <div className="space-y-2.5">
                {historyItems.map((entry) => (
                  <button
                    key={entry.entryId}
                    type="button"
                    onClick={() => {
                      onSelectHistoryItem(entry);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/30 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-card)]">
                      {entry.imageUrl && (
                        <ResilientImage
                          src={entry.imageUrl}
                          alt={entry.title}
                          fallbackTitle={entry.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--ink)] truncate">
                        {entry.title}
                      </p>
                      {entry.subtitle && (
                        <p className="text-[11px] text-[var(--muted)] truncate">
                          {entry.subtitle}
                        </p>
                      )}
                      <p className="text-[10px] text-[var(--muted)] mt-0.5 tabular-figures">
                        {new Date(entry.viewedAtMs).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                        {typeof entry.priceThb === 'number' ? ` · ${formatThb(entry.priceThb)}` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : orderItems.length === 0 ? (
            <p className="py-10 text-center text-xs text-[var(--muted)]">
              {t.historyEmptyOrders}
            </p>
          ) : (
            <div className="space-y-3">
              {orderItems.map((ord) => {
                const payStatus = ord.paymentStatus || 'paid';
                const payBadge = PAYMENT_STATUS_STYLE[payStatus];
                const stageIndex = Math.max(
                  0,
                  ORDER_STAGES.findIndex((s) => s.id === ord.status),
                );
                const summaryTitle =
                  ord.items.length > 0
                    ? ord.items.map((it) => `${it.quantity}× ${it.name}`).join(' · ')
                    : ord.orderNumber;
                return (
                  <div
                    key={ord.orderNumber}
                    className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--ink)] tabular-figures">
                            #{ord.orderNumber}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                            style={{
                              backgroundColor: payBadge.bg,
                              color: payBadge.fg,
                              borderColor: payBadge.border,
                            }}
                          >
                            <CreditCard className="w-2.5 h-2.5" />
                            <span>{lang === 'th' ? payBadge.labelTh : payBadge.labelEn}</span>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[var(--ink)] truncate">
                          {summaryTitle}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {ord.paymentMethod}
                          {ord.paymentReference ? ` · ${ord.paymentReference}` : ''} ·{' '}
                          {new Date(ord.createdAtMs).toLocaleDateString(
                            lang === 'th' ? 'th-TH' : 'en-US',
                          )}
                        </p>
                      </div>

                      <span
                        className="text-sm font-bold tabular-figures shrink-0"
                        style={{ color: accentHex }}
                      >
                        {formatThb(ord.totalThb)}
                      </span>
                    </div>

                    {/* 6-Stage Production & Delivery Progress Tracker */}
                    <div className="pt-2 border-t border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-semibold text-[var(--ink)] inline-flex items-center gap-1">
                          {ord.status === 'shipped' ? (
                            <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Truck className="w-3.5 h-3.5" style={{ color: accentHex }} />
                          )}
                          <span>
                            {lang === 'th'
                              ? `สถานะ: ${ORDER_STAGES[stageIndex].labelTh}`
                              : `Stage: ${ORDER_STAGES[stageIndex].labelEn}`}
                          </span>
                        </span>
                        <span className="font-mono text-[10px] text-[var(--muted)]">
                          {stageIndex + 1} / {ORDER_STAGES.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-1">
                        {ORDER_STAGES.map((st, idx) => {
                          const done = idx <= stageIndex;
                          return (
                            <div key={st.id} className="space-y-1">
                              <div
                                className="h-1.5 rounded-full transition-colors"
                                style={{
                                  backgroundColor: done ? accentHex : 'var(--border)',
                                  opacity: idx === stageIndex ? 1 : done ? 0.72 : 0.4,
                                }}
                              />
                              <p
                                className={`text-[9px] text-center truncate ${
                                  idx === stageIndex
                                    ? 'font-bold text-[var(--ink)]'
                                    : 'text-[var(--muted)]'
                                }`}
                              >
                                {lang === 'th' ? st.labelTh : st.labelEn}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {(ord.trackingCode || ord.carrier || ord.shippingAddress) && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10.5px] text-[var(--muted)]">
                          <span className="inline-flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                            <span className="truncate">{ord.shippingAddress}</span>
                          </span>
                          {ord.trackingCode ? (
                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-[var(--ink)] bg-[var(--surface-card)] px-2 py-0.5 rounded border border-[var(--border)] shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>
                                {ord.carrier ? `${ord.carrier}: ` : ''}
                                {ord.trackingCode}
                              </span>
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] shrink-0">
                              {ord.carrier || 'GentleBubble White-Glove Express'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
