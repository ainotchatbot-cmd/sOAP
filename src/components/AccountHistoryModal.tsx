import React, { useState } from 'react';
import { Clock, History, LogIn, LogOut, Receipt, Trash2, X } from 'lucide-react';
import { User } from '../firebase';
import { useLanguage } from '../data/i18n';
import { formatThb } from '../data/soaps';
import { SavedHistoryItem, SavedOrderItem } from '../services/atelierStoreService';
import { ResilientImage } from './ResilientImage';

interface AccountHistoryModalProps {
  isOpen: boolean;
  user: User | null;
  historyItems: SavedHistoryItem[];
  orderItems: SavedOrderItem[];
  accentHex: string;
  accentTextHex?: string;
  onClose: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onClearHistory: () => void;
  onSelectHistoryItem: (entry: SavedHistoryItem) => void;
}

export const AccountHistoryModal: React.FC<AccountHistoryModalProps> = ({
  isOpen,
  user,
  historyItems,
  orderItems,
  accentHex,
  accentTextHex = '#FFFFFF',
  onClose,
  onSignIn,
  onSignOut,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  const { lang, t } = useLanguage();
  const [tab, setTab] = useState<'viewed' | 'orders'>('viewed');

  if (!isOpen) return null;

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
        className="w-full max-w-xl max-h-[88vh] flex flex-col luxury-3d-card bg-[var(--surface-card)] border border-[var(--border)] overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[var(--ink)]">{t.historyTitle}</h2>
            <p className="text-[11px] text-[var(--muted)]">{t.historySubtitle}</p>
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
          {!user ? (
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-4">
              <div
                className="w-11 h-11 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-card)', color: accentHex }}
              >
                <History className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                {t.historySignInPrompt}
              </p>
              <button
                type="button"
                onClick={onSignIn}
                className="luxury-3d-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.signInBtn}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Logged-in User Profile Card */}
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? 'Member'}
                      className="w-9 h-9 rounded-full border border-[var(--border)] shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ backgroundColor: accentHex, color: accentTextHex }}
                    >
                      {(user.displayName || user.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--ink)] truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[11px] text-[var(--muted)] truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/30 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.signOutBtn}</span>
                </button>
              </div>

              {/* Tabs: Viewed vs Orders */}
              <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex-1">
                  <button
                    type="button"
                    onClick={() => setTab('viewed')}
                    className="py-1.5 px-3 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: tab === 'viewed' ? accentHex : 'transparent',
                      color: tab === 'viewed' ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.historyViewedTab} ({historyItems.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('orders')}
                    className="py-1.5 px-3 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: tab === 'orders' ? accentHex : 'transparent',
                      color: tab === 'orders' ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{t.historyOrdersTab} ({orderItems.length})</span>
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
              </div>

              {tab === 'viewed' ? (
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
                <div className="space-y-2.5">
                  {orderItems.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--ink)] tabular-figures">
                          #{ord.orderNumber} · {ord.summaryTitle}
                        </p>
                        <p className="text-[11px] text-[var(--muted)] truncate">
                          {ord.itemCount} {t.bagQty} · {ord.paymentMethod} ·{' '}
                          {new Date(ord.createdAtMs).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold tabular-figures shrink-0"
                        style={{ color: accentHex }}
                      >
                        {formatThb(ord.totalThb)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
