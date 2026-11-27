import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  CloudOff,
  Delete,
  FlaskConical,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  MapPin,
  Package,
  PlusCircle,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tag,
  Timer,
  X,
} from 'lucide-react';
import { formatThb } from '../data/soaps';
import {
  ADMIN_BOOTSTRAP_EMAIL,
  AtelierOrderRecord,
  AtelierOrderStatus,
  fetchAdminServerOrders,
  getAdminPinStatus,
  loadLocalAccountsDatabase,
  loadLocalAtelierOrders,
  PaymentStatus,
  recordAtelierOrder,
  setupInitialAdminPin,
  subscribeAdminAtelierOrders,
  updateAtelierOrderProgress,
  verifyAdminPin,
} from '../services/atelierStoreService';
import {
  buildOrderCombinedPrepSummary,
  getMasterFormulationLibrary,
  MasterLibraryEntry,
  ProductMakerBlueprint,
} from '../data/productionRecipes';
import { ResilientImage } from './ResilientImage';
import type { User } from '../firebase';

interface AtelierAdminDashboardProps {
  isOpen: boolean;
  user: User | null;
  accentHex: string;
  accentTextHex: string;
  onClose: () => void;
  onSignInAdminGoogle: () => Promise<void>;
}

const PAYMENT_STATUS_META: Array<{
  id: PaymentStatus;
  label: string;
  bg: string;
  fg: string;
}> = [
  { id: 'paid', label: 'Paid', bg: 'rgba(22, 163, 74, 0.14)', fg: '#15803D' },
  { id: 'pending', label: 'Pending', bg: 'rgba(217, 119, 6, 0.14)', fg: '#B45309' },
  { id: 'cod', label: 'COD', bg: 'rgba(79, 70, 229, 0.12)', fg: '#4338CA' },
  { id: 'refunded', label: 'Refunded', bg: 'rgba(107, 114, 128, 0.14)', fg: '#4B5563' },
];

const STATUS_META: Array<{
  id: AtelierOrderStatus;
  label: string;
  shortLabel: string;
  pillBg: string;
  pillText: string;
}> = [
  {
    id: 'queued',
    label: '1. Queued',
    shortLabel: 'Queued',
    pillBg: 'rgba(180, 130, 70, 0.14)',
    pillText: '#8E6228',
  },
  {
    id: 'molding',
    label: '2. 3D Mold & Pull',
    shortLabel: '3D Mold',
    pillBg: 'rgba(92, 120, 168, 0.15)',
    pillText: '#3A5888',
  },
  {
    id: 'batching',
    label: '3. Mixing & Pouring',
    shortLabel: 'Batching',
    pillBg: 'rgba(138, 92, 148, 0.15)',
    pillText: '#6B3D78',
  },
  {
    id: 'curing',
    label: '4. Freeze / 30d Press',
    shortLabel: 'Curing',
    pillBg: 'rgba(42, 138, 138, 0.15)',
    pillText: '#1D6B6B',
  },
  {
    id: 'packing',
    label: '5. Stamp & Wax Seal',
    shortLabel: 'Packing',
    pillBg: 'rgba(199, 132, 46, 0.15)',
    pillText: '#9A5E14',
  },
  {
    id: 'shipped',
    label: '6. Dispatched',
    shortLabel: 'Shipped',
    pillBg: 'rgba(46, 132, 74, 0.15)',
    pillText: '#1F6A38',
  },
];

const MATERIAL_BADGE_STYLE: Record<string, { label: string; bg: string; fg: string }> = {
  '3d-mold': { label: '3D PRINT MOLD', bg: 'rgba(72, 108, 168, 0.12)', fg: '#33578F' },
  'gold-inlay': { label: 'ORDER / INLAY', bg: 'rgba(188, 142, 42, 0.16)', fg: '#855E10' },
  'glycerin-base': { label: 'BASE WEIGHT', bg: 'rgba(128, 106, 86, 0.12)', fg: '#5D4838' },
  'bath-salts': { label: 'BATH SALTS', bg: 'rgba(64, 132, 146, 0.14)', fg: '#236470' },
  'oats-honey': { label: 'OATS & HONEY', bg: 'rgba(196, 134, 40, 0.15)', fg: '#8B5610' },
  'actives-oils': { label: 'ACTIVES & OILS', bg: 'rgba(136, 78, 118, 0.13)', fg: '#6E365C' },
  packaging: { label: 'SEAL & WRAP', bg: 'rgba(92, 92, 92, 0.11)', fg: '#444444' },
};

function mergeOrderLists(
  firestoreOrders: AtelierOrderRecord[],
  serverOrders: AtelierOrderRecord[],
  localOrders: AtelierOrderRecord[],
): AtelierOrderRecord[] {
  const byNumber = new Map<string, AtelierOrderRecord>();
  // Lowest priority -> highest priority merge so freshest updatedAtMs wins
  for (const list of [localOrders, serverOrders, firestoreOrders]) {
    for (const order of list) {
      const prev = byNumber.get(order.orderNumber);
      if (!prev || order.updatedAtMs >= prev.updatedAtMs) {
        byNumber.set(order.orderNumber, order);
      }
    }
  }
  return Array.from(byNumber.values()).sort((a, b) => b.createdAtMs - a.createdAtMs);
}

const MakerBlueprintCard: React.FC<{
  blueprint: ProductMakerBlueprint;
  orderNumber?: string;
  completedStepSet?: Set<string>;
  onToggleStep?: (stepKey: string) => void;
  accentHex: string;
  accentTextHex: string;
  isNested?: boolean;
}> = ({
  blueprint,
  orderNumber,
  completedStepSet,
  onToggleStep,
  accentHex,
  accentTextHex,
  isNested = false,
}) => {
  const [showSubRecipes, setShowSubRecipes] = useState(false);

  const stepPrefix = orderNumber ? `${orderNumber}__${blueprint.skuKey}` : blueprint.skuKey;
  const doneCount = completedStepSet
    ? blueprint.steps.filter((s) => completedStepSet.has(`${stepPrefix}__${s.id}`)).length
    : 0;

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] overflow-hidden shadow-sm ${
        isNested ? 'border-dashed bg-[var(--surface)]/70' : ''
      }`}
    >
      {/* Top Product Identity & Thermal Cure Bar */}
      <div className="p-4 sm:p-5 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shrink-0">
            <ResilientImage
              src={blueprint.imageUrl}
              alt={blueprint.title}
              fallbackTitle={blueprint.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                QTY ×{blueprint.quantity}
              </span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[10px] font-mono text-[var(--ink)]">
                {blueprint.editionId}
              </span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[10px] font-semibold text-[var(--muted)]">
                Batch: {blueprint.totalBatchGrams}g
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-semibold text-[var(--ink)] leading-snug">
              {blueprint.title}
            </h4>
            <p className="text-xs text-[var(--muted)] truncate">{blueprint.subtitle}</p>
          </div>
        </div>

        {completedStepSet && (
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--ink)] tabular-figures">
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accentHex }} />
              {doneCount} / {blueprint.steps.length} steps
            </span>
          </div>
        )}
      </div>

      {/* Quick Maker Spec Strip: 3D Mold, Stamp, Gold Leaf, Press & Deep Freeze */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-4 bg-[var(--surface)]/65 border-b border-[var(--border)] text-xs">
        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Printer className="w-3 h-3" style={{ color: accentHex }} />
            3D Mold & Stamp
          </p>
          <p className="mt-1 font-medium text-[var(--ink)] leading-snug">{blueprint.moldSpec}</p>
          <p className="mt-1 font-mono text-[10.5px] font-bold text-[var(--ink)] bg-[var(--surface)] px-1.5 py-0.5 rounded inline-block">
            STAMP: {blueprint.engravingStamp}
          </p>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Sparkles className="w-3 h-3" style={{ color: accentHex }} />
            Gold Leaf & Inlay
          </p>
          <p className="mt-1 font-medium text-[var(--ink)] leading-snug">
            {blueprint.goldLeafSpec}
          </p>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Snowflake className="w-3 h-3" style={{ color: accentHex }} />
            Deep Freeze Protocol
          </p>
          <p className="mt-1 font-medium text-[var(--ink)] leading-snug">
            {blueprint.deepFreezeDuration}
          </p>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" style={{ color: accentHex }} />
            Press & Cure Timer
          </p>
          <p className="mt-1 font-medium text-[var(--ink)] leading-snug">
            {blueprint.pressDuration}
          </p>
          <p className="mt-0.5 text-[10.5px] text-[var(--muted)]">{blueprint.rackCureDuration}</p>
        </div>
      </div>

      {/* Bill of Materials (What to Order & Weigh) */}
      <div className="p-4 border-b border-[var(--border)] space-y-2.5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" style={{ color: accentHex }} />
          Ingredients & Materials to Stage / Order (Scaled for ×{blueprint.quantity})
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {blueprint.materials.map((mat) => {
            const badge = MATERIAL_BADGE_STYLE[mat.category] ?? MATERIAL_BADGE_STYLE.packaging;
            return (
              <div
                key={mat.id}
                className="flex items-start justify-between gap-2.5 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/45"
              >
                <div className="min-w-0 space-y-1">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase"
                    style={{ backgroundColor: badge.bg, color: badge.fg }}
                  >
                    {badge.label}
                  </span>
                  <p className="text-xs font-medium text-[var(--ink)] leading-snug">{mat.label}</p>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-[var(--ink)] font-mono bg-[var(--surface-card)] px-2 py-1 rounded-lg border border-[var(--border)] tabular-figures">
                  {mat.amount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Interactive Maker Checklist */}
      <div className="p-4 space-y-2.5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Step-by-Step Atelier Bench Instructions
        </p>
        <div className="space-y-2">
          {blueprint.steps.map((step) => {
            const stepKey = `${stepPrefix}__${step.id}`;
            const isChecked = completedStepSet ? completedStepSet.has(stepKey) : false;
            return (
              <button
                key={step.id}
                type="button"
                disabled={!onToggleStep}
                onClick={() => onToggleStep?.(stepKey)}
                className={`w-full text-left p-3 rounded-xl border transition-colors flex items-start gap-3 ${
                  onToggleStep ? 'cursor-pointer hover:border-[var(--ink)]/35' : 'cursor-default'
                } ${
                  isChecked
                    ? 'border-emerald-600/35 bg-emerald-500/5'
                    : 'border-[var(--border)] bg-[var(--surface)]/35'
                }`}
              >
                <span
                  className="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 text-[11px] font-bold transition-colors"
                  style={{
                    borderColor: isChecked ? '#1F7A4D' : 'var(--border)',
                    backgroundColor: isChecked ? '#1F7A4D' : 'var(--surface-card)',
                    color: isChecked ? '#FFFFFF' : 'var(--ink)',
                  }}
                >
                  {isChecked ? <Check className="w-3.5 h-3.5" /> : step.stepNumber}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p
                      className={`text-xs sm:text-[13px] font-semibold ${
                        isChecked ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'
                      }`}
                    >
                      Step {step.stepNumber}: {step.title}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {step.tempOrSetting && (
                        <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[10px] font-mono text-[var(--muted)]">
                          {step.tempOrSetting}
                        </span>
                      )}
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1"
                        style={{ backgroundColor: 'var(--accent-soft)', color: accentHex }}
                      >
                        <Timer className="w-2.5 h-2.5" />
                        {step.durationBadge}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {step.actionDetail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nested Interior Recipes if Marble Coffret / Case */}
      {blueprint.subItems && blueprint.subItems.length > 0 && (
        <div className="px-4 pb-4 pt-1">
          <button
            type="button"
            onClick={() => setShowSubRecipes((v) => !v)}
            className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] transition-colors flex items-center justify-between text-xs font-semibold text-[var(--ink)] cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: accentHex }} />
              <span>
                Interior Recipes Inside Coffret ({blueprint.subItems.length} included formulations)
              </span>
            </span>
            {showSubRecipes ? (
              <ChevronDown className="w-4 h-4 text-[var(--muted)]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
            )}
          </button>

          {showSubRecipes && (
            <div className="mt-3 space-y-3 pl-0 sm:pl-3 border-l-2 border-[var(--border)]">
              {blueprint.subItems.map((sub) => (
                <MakerBlueprintCard
                  key={sub.skuKey}
                  blueprint={sub}
                  orderNumber={orderNumber}
                  completedStepSet={completedStepSet}
                  onToggleStep={onToggleStep}
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  isNested
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AtelierAdminDashboard: React.FC<AtelierAdminDashboardProps> = ({
  isOpen,
  user,
  accentHex,
  accentTextHex,
  onClose,
  onSignInAdminGoogle,
}) => {
  // Store signed admin Bearer token strictly in memory (never localStorage/sessionStorage)
  const [sessionToken, setSessionToken] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinAuthMode, setPinAuthMode] = useState<'env' | 'claimed' | 'needs_setup' | 'unconfigured'>('env');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [trackingDraft, setTrackingDraft] = useState('');
  const [carrierDraft, setCarrierDraft] = useState('GentleBubble White-Glove Express');

  const [activeTab, setActiveTab] = useState<'orders' | 'library'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | AtelierOrderStatus>('all');
  const [localOrders, setLocalOrders] = useState<AtelierOrderRecord[]>([]);
  const [localAccountsCount, setLocalAccountsCount] = useState<number>(0);
  const [serverOrders, setServerOrders] = useState<AtelierOrderRecord[]>([]);
  const [firestoreOrders, setFirestoreOrders] = useState<AtelierOrderRecord[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [firestoreWarning, setFirestoreWarning] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Master Library State
  const [libraryFilter, setLibraryFilter] = useState<
    'all' | MasterLibraryEntry['group']
  >('all');
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedLibraryKey, setSelectedLibraryKey] = useState<string | null>(null);

  const isCloudAdmin =
    Boolean(user?.emailVerified) &&
    user?.email?.trim().toLowerCase() === ADMIN_BOOTSTRAP_EMAIL;

  useEffect(() => {
    if (!isOpen || isUnlocked) return;
    void getAdminPinStatus().then((st) => {
      setPinAuthMode(st.mode);
    });
  }, [isOpen, isUnlocked]);

  const refreshLocalAndServer = useCallback(async (activeToken: string) => {
    setLocalOrders(loadLocalAtelierOrders());
    setLocalAccountsCount(loadLocalAccountsDatabase().length);
    if (activeToken) {
      const srv = await fetchAdminServerOrders(activeToken);
      setServerOrders(srv);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    void refreshLocalAndServer(sessionToken);
  }, [isOpen, isUnlocked, refreshLocalAndServer, sessionToken]);

  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    setFirestoreWarning(null);
    const unsub = subscribeAdminAtelierOrders(
      user?.email,
      user?.emailVerified,
      (orders) => {
        setFirestoreOrders(orders);
      },
      (err) => {
        setFirestoreWarning(err);
      },
    );
    return () => unsub();
  }, [isOpen, isUnlocked, user?.email, user?.emailVerified]);

  const mergedOrders = useMemo(
    () => mergeOrderLists(firestoreOrders, serverOrders, localOrders),
    [firestoreOrders, serverOrders, localOrders],
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return mergedOrders;
    return mergedOrders.filter((o) => o.status === statusFilter);
  }, [mergedOrders, statusFilter]);

  const selectedOrder = useMemo(() => {
    if (!filteredOrders.length) return null;
    if (selectedOrderNumber) {
      const match = filteredOrders.find((o) => o.orderNumber === selectedOrderNumber);
      if (match) return match;
    }
    return filteredOrders[0];
  }, [filteredOrders, selectedOrderNumber]);

  useEffect(() => {
    if (!selectedOrder) return;
    setTrackingDraft(selectedOrder.trackingCode || '');
    setCarrierDraft(selectedOrder.carrier || 'GentleBubble White-Glove Express');
  }, [selectedOrder?.orderNumber, selectedOrder?.trackingCode, selectedOrder?.carrier]);

  const selectedOrderPrep = useMemo(() => {
    if (!selectedOrder) return null;
    return buildOrderCombinedPrepSummary(selectedOrder);
  }, [selectedOrder]);

  const masterLibrary = useMemo(() => getMasterFormulationLibrary(), []);
  const filteredLibrary = useMemo(() => {
    const q = librarySearch.trim().toLowerCase();
    return masterLibrary.filter((entry) => {
      if (libraryFilter !== 'all' && entry.group !== libraryFilter) return false;
      if (!q) return true;
      return (
        entry.blueprint.title.toLowerCase().includes(q) ||
        entry.blueprint.subtitle.toLowerCase().includes(q) ||
        entry.blueprint.engravingStamp.toLowerCase().includes(q) ||
        entry.blueprint.materials.some((m) => m.label.toLowerCase().includes(q))
      );
    });
  }, [libraryFilter, librarySearch, masterLibrary]);

  const selectedLibraryEntry = useMemo(() => {
    if (!filteredLibrary.length) return null;
    if (selectedLibraryKey) {
      const match = filteredLibrary.find((e) => e.key === selectedLibraryKey);
      if (match) return match;
    }
    return filteredLibrary[0];
  }, [filteredLibrary, selectedLibraryKey]);

  const handleVerifyPinSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pinInput.length < 4 || isVerifyingPin) return;
    setIsVerifyingPin(true);
    setPinError(null);

    const res =
      pinAuthMode === 'needs_setup'
        ? await setupInitialAdminPin(pinInput)
        : await verifyAdminPin(pinInput);

    setIsVerifyingPin(false);
    if ('needsSetup' in res && res.needsSetup) {
      setPinAuthMode('needs_setup');
      setPinError('Set a 4–12 digit Atelier PIN below.');
      setPinInput('');
      return;
    }
    if (!res.ok || !res.token) {
      setPinError(res.error || 'Incorrect Atelier PIN code.');
      setPinInput('');
      return;
    }

    setSessionToken(res.token);
    setPinAuthMode('claimed');
    setIsUnlocked(true);
    setPinInput('');
  };

  const handleLockWorkshop = () => {
    setSessionToken('');
    setIsUnlocked(false);
    setPinInput('');
  };

  const handleToggleOrderStep = async (stepKey: string) => {
    if (!selectedOrder) return;
    const prevSet = new Set(selectedOrder.completedSteps);
    if (prevSet.has(stepKey)) {
      prevSet.delete(stepKey);
    } else {
      prevSet.add(stepKey);
    }
    const nextSteps = Array.from(prevSet);
    await updateAtelierOrderProgress({
      orderNumber: selectedOrder.orderNumber,
      customerUid: selectedOrder.customerUid,
      status: selectedOrder.status,
      completedSteps: nextSteps,
      paymentStatus: selectedOrder.paymentStatus,
      paidAtMs: selectedOrder.paidAtMs,
      paymentReference: selectedOrder.paymentReference,
      trackingCode: selectedOrder.trackingCode,
      carrier: selectedOrder.carrier,
      sessionToken,
      isCloudAdmin,
    });
    await refreshLocalAndServer(sessionToken);
  };

  const handleUpdateOrderStatus = async (nextStatus: AtelierOrderStatus) => {
    if (!selectedOrder) return;
    await updateAtelierOrderProgress({
      orderNumber: selectedOrder.orderNumber,
      customerUid: selectedOrder.customerUid,
      status: nextStatus,
      completedSteps: selectedOrder.completedSteps,
      paymentStatus: selectedOrder.paymentStatus,
      paidAtMs: selectedOrder.paidAtMs,
      paymentReference: selectedOrder.paymentReference,
      trackingCode: selectedOrder.trackingCode,
      carrier: selectedOrder.carrier,
      sessionToken,
      isCloudAdmin,
    });
    await refreshLocalAndServer(sessionToken);
  };

  const handleUpdatePaymentStatus = async (nextPaymentStatus: PaymentStatus) => {
    if (!selectedOrder) return;
    await updateAtelierOrderProgress({
      orderNumber: selectedOrder.orderNumber,
      customerUid: selectedOrder.customerUid,
      status: selectedOrder.status,
      completedSteps: selectedOrder.completedSteps,
      paymentStatus: nextPaymentStatus,
      paidAtMs: nextPaymentStatus === 'paid' ? selectedOrder.paidAtMs || Date.now() : undefined,
      paymentReference: selectedOrder.paymentReference,
      trackingCode: selectedOrder.trackingCode,
      carrier: selectedOrder.carrier,
      sessionToken,
      isCloudAdmin,
    });
    await refreshLocalAndServer(sessionToken);
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    await updateAtelierOrderProgress({
      orderNumber: selectedOrder.orderNumber,
      customerUid: selectedOrder.customerUid,
      status: selectedOrder.status,
      completedSteps: selectedOrder.completedSteps,
      paymentStatus: selectedOrder.paymentStatus,
      paidAtMs: selectedOrder.paidAtMs,
      paymentReference: selectedOrder.paymentReference,
      trackingCode: trackingDraft.trim(),
      carrier: carrierDraft.trim() || 'GentleBubble White-Glove Express',
      sessionToken,
      isCloudAdmin,
    });
    await refreshLocalAndServer(sessionToken);
  };

  const handleCreateSampleOrder = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const code = Math.floor(2100 + Math.random() * 7800);
    const sample = await recordAtelierOrder({
      orderNumber: `GB-${code}`,
      customerUid: user?.uid ?? null,
      customerEmailVerified: Boolean(user?.emailVerified),
      customerName: 'Natcha S. (Test X·Y·Z)',
      customerEmail: user?.email || 'collector@gentlebubble.com',
      shippingAddress: '88 Sukhumvit 39, Watthana, Bangkok 10110',
      gpsLabel: '13.7367°, 100.5698°',
      engravingNote: 'NATCHA · GOLD EDITION',
      paymentMethod: 'Apple Pay',
      paymentStatus: 'paid',
      subtotalThb: 7500,
      shippingThb: 0,
      totalThb: 7500,
      items: [
        {
          cartKey: 'holiday-oatmeal-honey',
          editionId: 'holiday-oatmeal-honey',
          name: 'Golden Oatmeal & Raw Honey Bar (150g Full)',
          scentName: 'Warm Wildflower Honey & Steamed Oats · 24k Gold Leaf',
          priceUsd: 1000,
          quantity: 1,
          giftNote: 'NATCHA 24K',
        },
        {
          cartKey: 'vault-01__pair',
          editionId: 'vault-01',
          name: 'Aetheris Lab · Paired Duo (AETHERIS BHA 2% + AETHERIS 2%)',
          scentName: 'Salicylic Acid 2% + Zinc PCA 1%',
          priceUsd: 1550,
          quantity: 1,
        },
        {
          cartKey: 'vault-marble-obsidian__Charcoal Hemp Loofah__NATCHA GOLD',
          editionId: 'vault-marble-obsidian',
          name: 'Obsidian Nero Victorian Coffret · 3 Bars + 3 Bombs',
          scentName: 'Crimson Lacquer Ribbon · Charcoal Hemp & Hemp-Loofah',
          priceUsd: 4950,
          quantity: 1,
          giftNote: 'NATCHA · GOLD EDITION',
        },
      ],
    });
    await refreshLocalAndServer(sessionToken);
    setSelectedOrderNumber(sample.orderNumber);
    setStatusFilter('all');
    setActiveTab('orders');
    setIsSimulating(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-2 sm:p-5"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[1380px] 2xl:max-w-[1680px] min-[2400px]:max-w-[2080px] h-[94dvh] rounded-3xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <header className="px-5 sm:px-7 py-3.5 border-b border-[var(--border)] bg-[var(--surface-card)] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: accentHex, color: accentTextHex }}
              >
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                  GentleBubble Atelier · Maker &amp; Production Studio
                </h2>
                <p className="text-[11px] text-[var(--muted)]">
                  3D Mold Fabrication · Gold Leaf &amp; Actives BOM · Deep-Freeze &amp; 30-Day Curing Queue
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isUnlocked && (
                <>
                  {isCloudAdmin ? (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Connected ({user?.email})</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void onSignInAdminGoogle()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)]/35 text-[11px] font-medium text-[var(--ink)] cursor-pointer"
                    >
                      <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Connect Admin Google</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleLockWorkshop}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock PIN</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Admin Studio"
                className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] flex items-center justify-center text-[var(--ink)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* PIN Gate vs Unlocked Studio */}
          {!isUnlocked ? (
            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
              <form
                onSubmit={handleVerifyPinSubmit}
                className="luxury-3d-card w-full max-w-md p-6 sm:p-8 bg-[var(--surface-card)] space-y-6 text-center"
              >
                <div className="space-y-2">
                  <div
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-soft)', color: accentHex }}
                  >
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[var(--ink)]">
                    {pinAuthMode === 'needs_setup'
                      ? 'Initialize Atelier Master PIN'
                      : 'Atelier Workshop Access'}
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    {pinAuthMode === 'needs_setup'
                      ? 'Set your 4–12 digit Atelier PIN to access incoming orders and studio schedules.'
                      : 'Enter your atelier PIN to review incoming orders and studio schedules.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    inputMode="numeric"
                    autoFocus
                    maxLength={12}
                    value={pinInput}
                    onChange={(e) => {
                      setPinError(null);
                      setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                    }}
                    placeholder="••••••••"
                    aria-label="Atelier PIN Code"
                    className="w-full h-12 px-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center font-mono text-xl tracking-[0.4em] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  />

                  {/* Tactile Numeric Keypad */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => {
                          setPinError(null);
                          setPinInput((p) => (p.length < 12 ? p + digit : p));
                        }}
                        className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] font-mono text-base font-semibold text-[var(--ink)] transition-colors cursor-pointer"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPinInput('')}
                      className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] text-xs font-medium text-[var(--muted)] cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPinError(null);
                        setPinInput((p) => (p.length < 12 ? p + '0' : p));
                      }}
                      className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] font-mono text-base font-semibold text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => setPinInput((p) => p.slice(0, -1))}
                      aria-label="Backspace"
                      className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-card)] flex items-center justify-center text-[var(--ink)] cursor-pointer"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {pinError && (
                  <p className="text-xs font-medium text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3">
                    {pinError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pinInput.length < 4 || isVerifyingPin}
                  className="luxury-3d-pill w-full h-11 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isVerifyingPin
                      ? 'Verifying PIN…'
                      : pinAuthMode === 'needs_setup'
                        ? 'Claim & Unlock Studio'
                        : 'Unlock Maker Studio'}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Sub-nav Toolbar */}
              <div className="px-5 sm:px-7 py-3 border-b border-[var(--border)] bg-[var(--surface)]/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: activeTab === 'orders' ? accentHex : 'transparent',
                      color: activeTab === 'orders' ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Customer Orders ({mergedOrders.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: activeTab === 'library' ? accentHex : 'transparent',
                      color: activeTab === 'library' ? accentTextHex : 'var(--muted)',
                    }}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Master Recipes ({masterLibrary.length} SKUs)</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] text-[11px] font-medium text-[var(--muted)] tabular-figures">
                    Local Accounts DB: <strong className="text-[var(--ink)]">{localAccountsCount}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => void refreshLocalAndServer(sessionToken)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/30 text-[11px] font-medium text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleCreateSampleOrder()}
                    disabled={isSimulating}
                    className="luxury-3d-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer"
                    style={{ backgroundColor: accentHex, color: accentTextHex }}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>
                      {isSimulating ? 'Creating…' : 'Simulate Sample Order (X · Y · Z)'}
                    </span>
                  </button>
                </div>
              </div>

              {firestoreWarning && !isCloudAdmin && (
                <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2 shrink-0">
                  <span>
                    Showing local &amp; server workshop orders. Sign in with{' '}
                    <strong>{ADMIN_BOOTSTRAP_EMAIL}</strong> to sync live cloud Firestore orders across devices.
                  </span>
                </div>
              )}

              {/* TAB 1: ORDERS PRODUCTION QUEUE */}
              {activeTab === 'orders' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
                  {/* Left Sidebar: Queued Orders */}
                  <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface)]/45 flex flex-col min-h-0 overflow-hidden">
                    <div className="p-3 border-b border-[var(--border)] flex flex-wrap gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold border cursor-pointer"
                        style={{
                          borderColor: statusFilter === 'all' ? accentHex : 'var(--border)',
                          backgroundColor:
                            statusFilter === 'all' ? accentHex : 'var(--surface-card)',
                          color: statusFilter === 'all' ? accentTextHex : 'var(--ink)',
                        }}
                      >
                        All ({mergedOrders.length})
                      </button>
                      {STATUS_META.map((st) => {
                        const count = mergedOrders.filter((o) => o.status === st.id).length;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setStatusFilter(st.id)}
                            className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold border cursor-pointer"
                            style={{
                              borderColor: statusFilter === st.id ? accentHex : 'var(--border)',
                              backgroundColor:
                                statusFilter === st.id ? accentHex : 'var(--surface-card)',
                              color: statusFilter === st.id ? accentTextHex : 'var(--ink)',
                            }}
                          >
                            {st.shortLabel} ({count})
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                      {filteredOrders.length === 0 ? (
                        <div className="p-6 text-center space-y-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-card)]">
                          <Package className="w-8 h-8 mx-auto text-[var(--muted)] opacity-60" />
                          <p className="text-xs font-medium text-[var(--ink)]">
                            No orders in this queue yet.
                          </p>
                          <p className="text-[11px] text-[var(--muted)]">
                            When customers complete checkout—or when you click &ldquo;Simulate Sample Order&rdquo;—full
                            manufacturing blueprints appear here automatically.
                          </p>
                        </div>
                      ) : (
                        filteredOrders.map((order) => {
                          const isSelected = selectedOrder?.orderNumber === order.orderNumber;
                          const statusMeta =
                            STATUS_META.find((s) => s.id === order.status) ?? STATUS_META[0];
                          const payMeta =
                            PAYMENT_STATUS_META.find((p) => p.id === order.paymentStatus) ??
                            PAYMENT_STATUS_META[0];
                          return (
                            <button
                              key={order.orderNumber}
                              type="button"
                              onClick={() => setSelectedOrderNumber(order.orderNumber)}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                                isSelected
                                  ? 'bg-[var(--surface-card)] shadow-md'
                                  : 'bg-[var(--surface-card)]/70 hover:bg-[var(--surface-card)]'
                              }`}
                              style={{
                                borderColor: isSelected ? accentHex : 'var(--border)',
                              }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-[var(--ink)]">
                                    #{order.orderNumber}
                                  </span>
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase"
                                    style={{ backgroundColor: payMeta.bg, color: payMeta.fg }}
                                  >
                                    {payMeta.label}
                                  </span>
                                </div>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                  style={{
                                    backgroundColor: statusMeta.pillBg,
                                    color: statusMeta.pillText,
                                  }}
                                >
                                  {statusMeta.shortLabel}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[var(--ink)] truncate">
                                  {order.customerName}
                                </p>
                                <p className="text-[11px] text-[var(--muted)] truncate">
                                  {order.items.map((it) => `${it.quantity}× ${it.name}`).join(' · ')}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-[10.5px] text-[var(--muted)] pt-1 border-t border-[var(--border)]">
                                <span>{new Date(order.createdAtMs).toLocaleString()}</span>
                                <strong className="text-[var(--ink)] tabular-figures">
                                  {formatThb(order.totalThb)}
                                </strong>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </aside>

                  {/* Right Main Workspace: Full Manufacturing Breakdown */}
                  <section className="lg:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--canvas)]">
                    {selectedOrder && selectedOrderPrep ? (
                      <>
                        {/* Order Header & Stage Controller */}
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-5 space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm font-bold text-[var(--ink)]">
                                  Order #{selectedOrder.orderNumber}
                                </span>
                                <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[10.5px] font-medium text-[var(--muted)]">
                                  {selectedOrder.paymentMethod}
                                </span>
                                <span className="text-xs font-bold tabular-figures" style={{ color: accentHex }}>
                                  {formatThb(selectedOrder.totalThb)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-[var(--ink)]">
                                {selectedOrder.customerName} ({selectedOrder.customerEmail})
                              </p>
                              <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentHex }} />
                                <span>{selectedOrder.shippingAddress}</span>
                              </p>
                              {selectedOrder.engravingNote && (
                                <p className="text-xs font-medium text-[var(--ink)] pt-1 inline-flex items-center gap-1.5">
                                  <Tag className="w-3.5 h-3.5" style={{ color: accentHex }} />
                                  <span>
                                    Brass Plaque / Soap Stamp:{' '}
                                    <strong className="font-mono">{selectedOrder.engravingNote}</strong>
                                  </span>
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {STATUS_META.map((st) => {
                                const active = selectedOrder.status === st.id;
                                return (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => void handleUpdateOrderStatus(st.id)}
                                    className="px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer"
                                    style={{
                                      borderColor: active ? accentHex : 'var(--border)',
                                      backgroundColor: active ? accentHex : 'var(--surface)',
                                      color: active ? accentTextHex : 'var(--ink)',
                                    }}
                                  >
                                    {st.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Payment Verification & Shipment Tracking Controls */}
                          <div className="pt-3 border-t border-[var(--border)] grid grid-cols-1 xl:grid-cols-12 gap-3 items-end">
                            <div className="xl:col-span-5 space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                Payment Verification ({selectedOrder.paymentReference || 'TXN'})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {PAYMENT_STATUS_META.map((pm) => {
                                  const active = selectedOrder.paymentStatus === pm.id;
                                  return (
                                    <button
                                      key={pm.id}
                                      type="button"
                                      onClick={() => void handleUpdatePaymentStatus(pm.id)}
                                      className="px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                      style={{
                                        borderColor: active ? pm.fg : 'var(--border)',
                                        backgroundColor: active ? pm.bg : 'var(--surface)',
                                        color: active ? pm.fg : 'var(--muted)',
                                      }}
                                    >
                                      {pm.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <form
                              onSubmit={(e) => void handleSaveTracking(e)}
                              className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end"
                            >
                              <div className="sm:col-span-5 space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                  Courier / Service
                                </label>
                                <input
                                  type="text"
                                  value={carrierDraft}
                                  onChange={(e) => setCarrierDraft(e.target.value)}
                                  placeholder="GentleBubble Express"
                                  className="w-full h-8 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink)] focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-4 space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                  Tracking Number
                                </label>
                                <input
                                  type="text"
                                  value={trackingDraft}
                                  onChange={(e) => setTrackingDraft(e.target.value)}
                                  placeholder="TH-GB-88412"
                                  className="w-full h-8 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--ink)] focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <button
                                  type="submit"
                                  className="w-full h-8 px-3 rounded-lg text-[11px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
                                  style={{ backgroundColor: accentHex, color: accentTextHex }}
                                >
                                  Save Tracking
                                </button>
                              </div>
                            </form>
                          </div>

                          {/* Combined Workshop Prep Sheet across X, Y, Z */}
                          <div className="pt-4 border-t border-[var(--border)] space-y-2.5">
                            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                              Combined Workshop Shopping &amp; Prep List for Order #{selectedOrder.orderNumber}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 space-y-1">
                                <p className="text-[10px] font-bold uppercase text-[var(--muted)] flex items-center gap-1">
                                  <Printer className="w-3.5 h-3.5" style={{ color: accentHex }} />
                                  3D Print Queue
                                </p>
                                <p className="font-semibold text-[var(--ink)]">
                                  {selectedOrderPrep.summary.moldsToPrint.length} mold setup(s)
                                </p>
                                <p className="text-[11px] text-[var(--muted)] line-clamp-2">
                                  {selectedOrderPrep.summary.moldsToPrint.join(' · ')}
                                </p>
                              </div>

                              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 space-y-1">
                                <p className="text-[10px] font-bold uppercase text-[var(--muted)] flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" style={{ color: accentHex }} />
                                  Order / Pull Gold Leaf &amp; Inlays
                                </p>
                                <p className="font-semibold text-[var(--ink)]">
                                  {selectedOrderPrep.summary.goldAndInlaysToOrder.length} inlay type(s)
                                </p>
                                <p className="text-[11px] text-[var(--muted)] line-clamp-2">
                                  {selectedOrderPrep.summary.goldAndInlaysToOrder.join(' · ')}
                                </p>
                              </div>

                              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 space-y-1">
                                <p className="text-[10px] font-bold uppercase text-[var(--muted)] flex items-center gap-1">
                                  <Box className="w-3.5 h-3.5" style={{ color: accentHex }} />
                                  Total Base &amp; Salts Needed
                                </p>
                                <p className="font-mono font-semibold text-[var(--ink)]">
                                  Batch: {Math.round(selectedOrderPrep.summary.totalBatchGrams)}g
                                </p>
                                <p className="text-[11px] text-[var(--muted)]">
                                  Glyc {Math.round(selectedOrderPrep.summary.totalGlycerinGrams)}g · Salts{' '}
                                  {Math.round(selectedOrderPrep.summary.totalBathSaltsGrams)}g · Oats/Honey{' '}
                                  {Math.round(selectedOrderPrep.summary.totalOatsHoneyGrams)}g
                                </p>
                              </div>

                              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 space-y-1">
                                <p className="text-[10px] font-bold uppercase text-[var(--muted)] flex items-center gap-1">
                                  <Snowflake className="w-3.5 h-3.5" style={{ color: accentHex }} />
                                  Cure &amp; Freeze Window
                                </p>
                                <p className="font-semibold text-[var(--ink)]">
                                  {selectedOrderPrep.summary.requires30DayPress
                                    ? '30-Day Press + Deep Freeze'
                                    : '48–72h Cure + Deep Freeze'}
                                </p>
                                <p className="text-[11px] text-[var(--muted)]">
                                  {selectedOrderPrep.summary.requiresDeepFreeze
                                    ? '-18°C / 45m freeze release'
                                    : 'Room temperature set'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item-by-Item Step Guides (X, Y, Z) */}
                        <div className="space-y-4">
                          <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                            Production Cards by Item ({selectedOrderPrep.blueprints.length})
                          </h3>
                          {selectedOrderPrep.blueprints.map((bp, idx) => (
                            <MakerBlueprintCard
                              key={`${selectedOrder.orderNumber}_${bp.skuKey}_${idx}`}
                              blueprint={bp}
                              orderNumber={selectedOrder.orderNumber}
                              completedStepSet={new Set(selectedOrder.completedSteps)}
                              onToggleStep={(stepKey) => void handleToggleOrderStep(stepKey)}
                              accentHex={accentHex}
                              accentTextHex={accentTextHex}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-10">
                        <div className="max-w-sm space-y-3">
                          <Package className="w-10 h-10 mx-auto text-[var(--muted)] opacity-50" />
                          <h3 className="font-serif text-xl font-medium text-[var(--ink)]">
                            Select or Simulate an Order
                          </h3>
                          <p className="text-xs text-[var(--muted)]">
                            Choose an order on the left—or click &ldquo;Simulate Sample Order (X · Y · Z)&rdquo;
                            above—to see exact 3D mold files, gold leaf quantities, glycerin, bath salts,
                            oats &amp; honey weights, and press/deep-freeze cure timers.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                /* TAB 2: MASTER FORMULATION & MOLD LIBRARY (ALL 99 SKUS) */
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
                  <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface)]/45 flex flex-col min-h-0 overflow-hidden">
                    <div className="p-3 border-b border-[var(--border)] space-y-2.5 shrink-0">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={librarySearch}
                          onChange={(e) => setLibrarySearch(e.target.value)}
                          placeholder="Search SKU, oats, honey, gold leaf, BHA…"
                          className="w-full h-9 pl-8 pr-3 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            'all',
                            'Bar Soaps (30)',
                            'Bath Bombs (30)',
                            'Secret Vault Pairs (30)',
                            'Marble Coffrets (11)',
                          ] as const
                        ).map((grp) => (
                          <button
                            key={grp}
                            type="button"
                            onClick={() => setLibraryFilter(grp)}
                            className="px-2.5 py-1 rounded-full border text-[10.5px] font-semibold cursor-pointer"
                            style={{
                              borderColor: libraryFilter === grp ? accentHex : 'var(--border)',
                              backgroundColor:
                                libraryFilter === grp ? accentHex : 'var(--surface-card)',
                              color: libraryFilter === grp ? accentTextHex : 'var(--ink)',
                            }}
                          >
                            {grp === 'all' ? 'All SKUs' : grp}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {filteredLibrary.map((entry) => {
                        const active = selectedLibraryEntry?.key === entry.key;
                        return (
                          <button
                            key={entry.key}
                            type="button"
                            onClick={() => setSelectedLibraryKey(entry.key)}
                            className="w-full text-left p-2.5 rounded-xl border bg-[var(--surface-card)] hover:border-[var(--ink)]/35 transition-colors flex items-center gap-3 cursor-pointer"
                            style={{ borderColor: active ? accentHex : 'var(--border)' }}
                          >
                            <div className="w-11 h-11 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                              <ResilientImage
                                src={entry.blueprint.imageUrl}
                                alt={entry.blueprint.title}
                                fallbackTitle={entry.blueprint.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                {entry.group}
                              </p>
                              <p className="text-xs font-semibold text-[var(--ink)] truncate">
                                {entry.blueprint.title}
                              </p>
                              <p className="text-[10.5px] font-mono text-[var(--muted)] truncate">
                                {entry.blueprint.engravingStamp}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section className="lg:col-span-8 overflow-y-auto p-4 sm:p-6 bg-[var(--canvas)]">
                    {selectedLibraryEntry ? (
                      <MakerBlueprintCard
                        blueprint={selectedLibraryEntry.blueprint}
                        accentHex={accentHex}
                        accentTextHex={accentTextHex}
                      />
                    ) : null}
                  </section>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
