import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const BASE_ATELIER_SOLD_COUNT = 1428;
export const ADMIN_BOOTSTRAP_EMAIL = 'ipedmaak@gmail.com';
const LOCAL_EXTRA_SOLD_KEY = 'gentle_bubble_local_extra_sold_v1';
const LOCAL_ITEM_SOLD_KEY = 'gentle_bubble_item_sold_map_v1';
const LOCAL_ATELIER_ORDERS_KEY = 'gentle_bubble_atelier_orders_v1';
const LOCAL_ACCOUNTS_DB_KEY = 'gentle_bubble_local_accounts_db_v1';
const LOCAL_ACTIVE_ACCOUNT_ID_KEY = 'gentle_bubble_active_local_account_v1';
const LOCAL_ACCOUNT_HISTORY_KEY = 'gentle_bubble_local_account_history_v1';

export type AtelierOrderStatus =
  | 'queued'
  | 'molding'
  | 'batching'
  | 'curing'
  | 'packing'
  | 'shipped';

export type PaymentStatus = 'paid' | 'pending' | 'cod' | 'refunded';

export interface LocalAccountProfile {
  accountId: string;
  email: string;
  displayName: string;
  defaultAddress?: string;
  gpsLabel?: string;
  linkedGoogleUid?: string;
  createdAtMs: number;
  lastActiveAtMs: number;
}

export interface AtelierOrderLineItem {
  cartKey: string;
  editionId: string;
  name: string;
  scentName: string;
  priceUsd: number;
  quantity: number;
  giftNote?: string;
  imageUrl?: string;
}

export interface AtelierOrderRecord {
  orderNumber: string;
  accountId?: string;
  customerUid?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  gpsLabel?: string;
  engravingNote?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paidAtMs?: number;
  paymentReference?: string;
  trackingCode?: string;
  carrier?: string;
  items: AtelierOrderLineItem[];
  subtotalThb: number;
  shippingThb: number;
  totalThb: number;
  status: AtelierOrderStatus;
  completedSteps: string[];
  createdAtMs: number;
  updatedAtMs: number;
  source?: 'firestore' | 'server' | 'local';
}

export interface SavedHistoryItem {
  entryId: string;
  itemId: string;
  itemType: 'soap' | 'bath-bomb' | 'marble-case' | 'order';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  priceThb?: number;
  viewedAtMs: number;
}

export interface SavedOrderItem {
  orderNumber: string;
  totalThb: number;
  itemCount: number;
  summaryTitle: string;
  paymentMethod: string;
  status?: AtelierOrderStatus;
  paymentStatus?: PaymentStatus;
  paidAtMs?: number;
  paymentReference?: string;
  trackingCode?: string;
  carrier?: string;
  createdAtMs: number;
}

export interface CookiePreferences {
  configured: boolean;
  essential: true;
  savedHistory: boolean;
  adCookies: boolean;
}

/** Deterministic per-product sold baseline so miniature counters reflect realistic atelier velocity. */
export function getDeterministicItemSoldBase(itemId: string): number {
  let hash = 0;
  for (let i = 0; i < itemId.length; i += 1) {
    hash = (hash * 31 + itemId.charCodeAt(i)) % 97;
  }
  return 24 + (hash % 71);
}

export function loadLocalItemSoldMap(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(LOCAL_ITEM_SOLD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed as Record<string, number>;
    }
  } catch {
    // Ignore storage issues
  }
  return {};
}

export function incrementLocalSoldCounts(itemDeltas: Array<{ id: string; qty: number }>): number {
  const totalAdded = itemDeltas.reduce((sum, entry) => sum + Math.max(1, entry.qty), 0);
  try {
    const prevExtra = Number(window.localStorage.getItem(LOCAL_EXTRA_SOLD_KEY) || '0') || 0;
    window.localStorage.setItem(LOCAL_EXTRA_SOLD_KEY, String(prevExtra + totalAdded));

    const prevMap = loadLocalItemSoldMap();
    const nextMap = { ...prevMap };
    for (const entry of itemDeltas) {
      nextMap[entry.id] = (nextMap[entry.id] || 0) + Math.max(1, entry.qty);
    }
    window.localStorage.setItem(LOCAL_ITEM_SOLD_KEY, JSON.stringify(nextMap));
  } catch {
    // Ignore storage issues
  }
  return totalAdded;
}

export function readLocalExtraSold(): number {
  try {
    return Number(window.localStorage.getItem(LOCAL_EXTRA_SOLD_KEY) || '0') || 0;
  } catch {
    return 0;
  }
}

export function subscribeGlobalSoldCounter(onChange: (totalSold: number) => void): () => void {
  const localBaseline = BASE_ATELIER_SOLD_COUNT + readLocalExtraSold();
  onChange(localBaseline);

  const counterRef = doc(db, 'site_metrics', 'counters');
  return onSnapshot(
    counterRef,
    (snap) => {
      if (snap.exists()) {
        const remote = snap.data()?.totalSold;
        if (typeof remote === 'number' && remote >= BASE_ATELIER_SOLD_COUNT) {
          onChange(Math.max(remote, BASE_ATELIER_SOLD_COUNT + readLocalExtraSold()));
        }
      }
    },
    () => {
      // Fall back quietly to local baseline when offline
    },
  );
}

export async function recordGlobalSoldIncrement(
  delta: number,
  currentTotal: number,
  isSignedIn: boolean,
): Promise<void> {
  if (!isSignedIn || delta <= 0 || delta > 50) return;
  const counterRef = doc(db, 'site_metrics', 'counters');
  const nextTotal = Math.max(BASE_ATELIER_SOLD_COUNT, currentTotal) + delta;
  try {
    await updateDoc(counterRef, {
      totalSold: nextTotal,
      updatedAt: serverTimestamp(),
    });
  } catch {
    try {
      await setDoc(counterRef, {
        totalSold: nextTotal,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Do not block checkout confirmation if network unavailable
    }
  }
}

export async function recordUserHistory(
  uid: string,
  payload: {
    itemId: string;
    itemType: 'soap' | 'bath-bomb' | 'marble-case' | 'order';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    priceThb?: number;
  },
): Promise<void> {
  const safeEntryId = `${payload.itemType}_${payload.itemId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const path = `users/${uid}/history/${safeEntryId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'history', safeEntryId), {
      uid,
      itemId: payload.itemId.slice(0, 120),
      itemType: payload.itemType,
      title: payload.title.slice(0, 155),
      ...(payload.subtitle ? { subtitle: payload.subtitle.slice(0, 195) } : {}),
      ...(payload.imageUrl && payload.imageUrl.length <= 490 ? { imageUrl: payload.imageUrl } : {}),
      ...(typeof payload.priceThb === 'number' ? { priceThb: payload.priceThb } : {}),
      viewedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserHistory(
  uid: string,
  onChange: (entries: SavedHistoryItem[]) => void,
): () => void {
  const path = `users/${uid}/history`;
  const q = query(
    collection(db, 'users', uid, 'history'),
    where('uid', '==', uid),
    orderBy('viewedAt', 'desc'),
    limit(18),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedHistoryItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          entryId: d.id,
          itemId: String(data.itemId ?? ''),
          itemType: (data.itemType as SavedHistoryItem['itemType']) ?? 'soap',
          title: String(data.title ?? ''),
          subtitle: data.subtitle ? String(data.subtitle) : undefined,
          imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
          priceThb: typeof data.priceThb === 'number' ? data.priceThb : undefined,
          viewedAtMs: data.viewedAt?.toMillis?.() ?? Date.now(),
        };
      });
      onChange(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function clearUserHistory(uid: string): Promise<void> {
  const path = `users/${uid}/history`;
  try {
    const q = query(collection(db, 'users', uid, 'history'), where('uid', '==', uid));
    const snaps = await getDocs(q);
    await Promise.all(snaps.docs.map((d) => deleteDoc(d.ref)));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function recordUserOrder(
  uid: string,
  order: {
    orderNumber: string;
    totalThb: number;
    itemCount: number;
    summaryTitle: string;
    paymentMethod: string;
    status?: AtelierOrderStatus;
    paymentStatus?: PaymentStatus;
    paidAtMs?: number;
    paymentReference?: string;
  },
): Promise<void> {
  const safeOrderId = order.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
  const path = `users/${uid}/orders/${safeOrderId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'orders', safeOrderId), {
      uid,
      orderNumber: safeOrderId,
      totalThb: Math.max(0, Math.min(1000000, order.totalThb)),
      itemCount: Math.max(1, Math.min(100, order.itemCount)),
      summaryTitle: order.summaryTitle.slice(0, 195),
      paymentMethod: order.paymentMethod.slice(0, 60),
      status: order.status ?? 'queued',
      ...(order.paymentStatus ? { paymentStatus: order.paymentStatus } : {}),
      ...(typeof order.paidAtMs === 'number' ? { paidAtMs: order.paidAtMs } : {}),
      ...(order.paymentReference ? { paymentReference: order.paymentReference.slice(0, 80) } : {}),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserOrders(
  uid: string,
  onChange: (orders: SavedOrderItem[]) => void,
): () => void {
  const path = `users/${uid}/orders`;
  const q = query(
    collection(db, 'users', uid, 'orders'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(15),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedOrderItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          orderNumber: String(data.orderNumber ?? d.id),
          totalThb: Number(data.totalThb ?? 0),
          itemCount: Number(data.itemCount ?? 1),
          summaryTitle: String(data.summaryTitle ?? ''),
          paymentMethod: String(data.paymentMethod ?? ''),
          status: (data.status as AtelierOrderStatus | undefined) ?? 'queued',
          paymentStatus: (data.paymentStatus as PaymentStatus | undefined) ?? 'paid',
          paidAtMs: typeof data.paidAtMs === 'number' ? data.paidAtMs : undefined,
          paymentReference: data.paymentReference ? String(data.paymentReference) : undefined,
          trackingCode: data.trackingCode ? String(data.trackingCode) : undefined,
          carrier: data.carrier ? String(data.carrier) : undefined,
          createdAtMs: data.createdAt?.toMillis?.() ?? Date.now(),
        };
      });
      onChange(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function subscribeToMailingList(payload: {
  email: string;
  lang: 'th' | 'en';
  topics: string[];
  adCookiesAccepted: boolean;
  uid?: string | null;
}): Promise<void> {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const safeSubId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `mailing_list/${safeSubId}`;
  try {
    await setDoc(doc(db, 'mailing_list', safeSubId), {
      email: normalizedEmail.slice(0, 155),
      lang: payload.lang,
      topics: payload.topics.slice(0, 6),
      adCookiesAccepted: Boolean(payload.adCookiesAccepted),
      ...(payload.uid ? { uid: payload.uid.slice(0, 125) } : {}),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// First-Party Browser Cookies for Saved History & Ad Personalization
function setBrowserCookie(name: string, value: string, days = 180): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 86400;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function getBrowserCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');
  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

export function loadCookiePreferences(): CookiePreferences {
  const consent = getBrowserCookie('gb_cookie_consent');
  const historyCookie = getBrowserCookie('gb_saved_history');
  const adCookie = getBrowserCookie('gb_ads_personalization');

  return {
    configured: consent === '1',
    essential: true,
    savedHistory: historyCookie !== 'denied',
    adCookies: adCookie === 'granted',
  };
}

export function persistCookiePreferences(prefs: {
  savedHistory: boolean;
  adCookies: boolean;
}): CookiePreferences {
  setBrowserCookie('gb_cookie_consent', '1');
  setBrowserCookie('gb_saved_history', prefs.savedHistory ? 'granted' : 'denied');
  setBrowserCookie('gb_ads_personalization', prefs.adCookies ? 'granted' : 'denied');

  if (prefs.adCookies) {
    setBrowserCookie('gb_ad_segments', 'botanical_gold_bath_soaks');
  } else {
    setBrowserCookie('gb_ad_segments', '', 0);
  }

  return {
    configured: true,
    essential: true,
    savedHistory: prefs.savedHistory,
    adCookies: prefs.adCookies,
  };
}

export function trackAdInterestCookie(segment: string): void {
  const prefs = loadCookiePreferences();
  if (!prefs.adCookies) return;
  setBrowserCookie('gb_ad_segments', segment.slice(0, 64));
}

// ============================================================================
// LOCAL ACCOUNTS DATABASE (Collector Profiles + Per-Account History & Tracking)
// ============================================================================

export function deriveLocalAccountId(email: string): string {
  const norm = email.trim().toLowerCase();
  let h1 = 2166136261;
  for (let i = 0; i < norm.length; i += 1) {
    h1 ^= norm.charCodeAt(i);
    h1 = Math.imul(h1, 16777619);
  }
  const slug = norm
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 18);
  return `acct_${slug || 'collector'}_${(h1 >>> 0).toString(36)}`.slice(0, 64);
}

function normalizeLegacyOrder(raw: AtelierOrderRecord): AtelierOrderRecord {
  const paymentMethod = raw.paymentMethod || 'Credit Card';
  const inferredStatus: PaymentStatus =
    raw.paymentStatus ?? (paymentMethod === 'PromptPay QR' ? 'pending' : 'paid');
  const accountId = raw.accountId || deriveLocalAccountId(raw.customerEmail || 'guest@gentlebubble.com');
  return {
    ...raw,
    accountId,
    paymentMethod,
    paymentStatus: inferredStatus,
    ...(inferredStatus === 'paid' && !raw.paidAtMs ? { paidAtMs: raw.createdAtMs } : {}),
    ...(raw.paymentReference
      ? { paymentReference: raw.paymentReference }
      : { paymentReference: `REF-${raw.orderNumber}` }),
  };
}

export function loadLocalAtelierOrders(): AtelierOrderRecord[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_ATELIER_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as AtelierOrderRecord[]).map(normalizeLegacyOrder);
  } catch {
    return [];
  }
}

export function saveLocalAtelierOrders(orders: AtelierOrderRecord[]): void {
  try {
    window.localStorage.setItem(LOCAL_ATELIER_ORDERS_KEY, JSON.stringify(orders.slice(0, 100)));
  } catch {
    // Ignore storage constraints
  }
}

function saveLocalAccountsDatabase(accounts: LocalAccountProfile[]): void {
  try {
    window.localStorage.setItem(LOCAL_ACCOUNTS_DB_KEY, JSON.stringify(accounts.slice(0, 50)));
  } catch {
    // Ignore storage constraints
  }
}

export function loadLocalAccountsDatabase(): LocalAccountProfile[] {
  let stored: LocalAccountProfile[] = [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        stored = parsed as LocalAccountProfile[];
      }
    }
  } catch {
    stored = [];
  }

  // Auto-index any orders already placed locally so existing checkout buyers immediately have an account entry
  const byEmail = new Map<string, LocalAccountProfile>();
  for (const acct of stored) {
    if (acct && typeof acct.email === 'string') {
      byEmail.set(acct.email.trim().toLowerCase(), acct);
    }
  }

  let modified = false;
  for (const ord of loadLocalAtelierOrders()) {
    const email = ord.customerEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) continue;
    const prev = byEmail.get(email);
    if (!prev) {
      byEmail.set(email, {
        accountId: ord.accountId || deriveLocalAccountId(email),
        email,
        displayName: ord.customerName || email.split('@')[0],
        defaultAddress: ord.shippingAddress,
        gpsLabel: ord.gpsLabel,
        ...(ord.customerUid ? { linkedGoogleUid: ord.customerUid } : {}),
        createdAtMs: ord.createdAtMs || Date.now(),
        lastActiveAtMs: ord.updatedAtMs || ord.createdAtMs || Date.now(),
      });
      modified = true;
    }
  }

  const list = Array.from(byEmail.values()).sort((a, b) => b.lastActiveAtMs - a.lastActiveAtMs);
  if (modified) {
    saveLocalAccountsDatabase(list);
  }
  return list;
}

export function getActiveLocalAccount(): LocalAccountProfile | null {
  try {
    const activeId = window.localStorage.getItem(LOCAL_ACTIVE_ACCOUNT_ID_KEY);
    if (!activeId) return null;
    const accounts = loadLocalAccountsDatabase();
    return accounts.find((a) => a.accountId === activeId) ?? null;
  } catch {
    return null;
  }
}

export function switchActiveLocalAccount(accountId: string): LocalAccountProfile | null {
  const accounts = loadLocalAccountsDatabase();
  const target = accounts.find((a) => a.accountId === accountId);
  if (!target) return null;
  const updated: LocalAccountProfile = { ...target, lastActiveAtMs: Date.now() };
  const nextList = [updated, ...accounts.filter((a) => a.accountId !== accountId)];
  saveLocalAccountsDatabase(nextList);
  try {
    window.localStorage.setItem(LOCAL_ACTIVE_ACCOUNT_ID_KEY, updated.accountId);
  } catch {
    // Ignore storage constraints
  }
  return updated;
}

export function signOutLocalAccount(): void {
  try {
    window.localStorage.removeItem(LOCAL_ACTIVE_ACCOUNT_ID_KEY);
  } catch {
    // Ignore storage constraints
  }
}

export function upsertLocalAccount(
  input: {
    email: string;
    displayName?: string;
    defaultAddress?: string;
    gpsLabel?: string;
    linkedGoogleUid?: string;
  },
  setActive = true,
): LocalAccountProfile {
  const email = input.email.trim().toLowerCase().slice(0, 155);
  const accountId = deriveLocalAccountId(email);
  const accounts = loadLocalAccountsDatabase();
  const prev = accounts.find((a) => a.accountId === accountId || a.email === email);
  const now = Date.now();

  const nextAccount: LocalAccountProfile = {
    accountId: prev?.accountId || accountId,
    email,
    displayName: (input.displayName?.trim() || prev?.displayName || email.split('@')[0]).slice(0, 115),
    ...(input.defaultAddress?.trim()
      ? { defaultAddress: input.defaultAddress.trim().slice(0, 295) }
      : prev?.defaultAddress
        ? { defaultAddress: prev.defaultAddress }
        : {}),
    ...(input.gpsLabel?.trim()
      ? { gpsLabel: input.gpsLabel.trim().slice(0, 60) }
      : prev?.gpsLabel
        ? { gpsLabel: prev.gpsLabel }
        : {}),
    ...(input.linkedGoogleUid?.trim()
      ? { linkedGoogleUid: input.linkedGoogleUid.trim().slice(0, 125) }
      : prev?.linkedGoogleUid
        ? { linkedGoogleUid: prev.linkedGoogleUid }
        : {}),
    createdAtMs: prev?.createdAtMs || now,
    lastActiveAtMs: now,
  };

  const nextList = [nextAccount, ...accounts.filter((a) => a.accountId !== nextAccount.accountId && a.email !== email)];
  saveLocalAccountsDatabase(nextList);
  if (setActive) {
    try {
      window.localStorage.setItem(LOCAL_ACTIVE_ACCOUNT_ID_KEY, nextAccount.accountId);
    } catch {
      // Ignore storage constraints
    }
  }
  return nextAccount;
}

export function syncGoogleUserToLocalAccount(
  uid: string,
  email?: string | null,
  displayName?: string | null,
): LocalAccountProfile | null {
  if (!email) return null;
  return upsertLocalAccount(
    {
      email,
      displayName: displayName || email.split('@')[0],
      linkedGoogleUid: uid,
    },
    true,
  );
}

function readAllLocalHistoryBuckets(): Record<string, SavedHistoryItem[]> {
  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNT_HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, SavedHistoryItem[]>) : {};
  } catch {
    return {};
  }
}

export function loadLocalAccountHistory(accountId: string): SavedHistoryItem[] {
  const buckets = readAllLocalHistoryBuckets();
  const entries = buckets[accountId];
  return Array.isArray(entries) ? entries : [];
}

export function recordLocalAccountHistory(
  accountId: string,
  payload: {
    itemId: string;
    itemType: 'soap' | 'bath-bomb' | 'marble-case' | 'order';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    priceThb?: number;
  },
): SavedHistoryItem[] {
  const entryId = `${payload.itemType}_${payload.itemId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const newEntry: SavedHistoryItem = {
    entryId,
    itemId: payload.itemId.slice(0, 120),
    itemType: payload.itemType,
    title: payload.title.slice(0, 155),
    ...(payload.subtitle ? { subtitle: payload.subtitle.slice(0, 195) } : {}),
    ...(payload.imageUrl && payload.imageUrl.length <= 490 ? { imageUrl: payload.imageUrl } : {}),
    ...(typeof payload.priceThb === 'number' ? { priceThb: payload.priceThb } : {}),
    viewedAtMs: Date.now(),
  };

  const buckets = readAllLocalHistoryBuckets();
  const current = Array.isArray(buckets[accountId]) ? buckets[accountId] : [];
  const next = [newEntry, ...current.filter((item) => item.entryId !== entryId)].slice(0, 24);
  buckets[accountId] = next;
  try {
    window.localStorage.setItem(LOCAL_ACCOUNT_HISTORY_KEY, JSON.stringify(buckets));
  } catch {
    // Ignore storage constraints
  }
  return next;
}

export function clearLocalAccountHistory(accountId: string): void {
  const buckets = readAllLocalHistoryBuckets();
  delete buckets[accountId];
  try {
    window.localStorage.setItem(LOCAL_ACCOUNT_HISTORY_KEY, JSON.stringify(buckets));
  } catch {
    // Ignore storage constraints
  }
}

export function getOrdersForAccount(
  account: { accountId?: string; email?: string | null; uid?: string | null } | null,
): AtelierOrderRecord[] {
  if (!account) return [];
  const normEmail = account.email?.trim().toLowerCase();
  return loadLocalAtelierOrders()
    .filter(
      (ord) =>
        (account.accountId && ord.accountId === account.accountId) ||
        (normEmail && ord.customerEmail.trim().toLowerCase() === normEmail) ||
        (account.uid && ord.customerUid === account.uid),
    )
    .sort((a, b) => b.createdAtMs - a.createdAtMs);
}

export async function fetchLiveOrderTracking(
  orderNumber: string,
  email: string,
): Promise<Partial<AtelierOrderRecord> | null> {
  try {
    const resp = await fetch(
      `/api/orders/${encodeURIComponent(orderNumber)}/tracking?email=${encodeURIComponent(email)}`,
    );
    if (!resp.ok) return null;
    const json = (await resp.json()) as {
      ok?: boolean;
      tracking?: Partial<AtelierOrderRecord>;
    };
    if (!json.ok || !json.tracking) return null;
    return json.tracking;
  } catch {
    return null;
  }
}

// ============================================================================
// ATELIER PRODUCTION QUEUE & ADMIN SESSION AUTH
// ============================================================================

export async function getAdminPinStatus(): Promise<{
  configured: boolean;
  mode: 'env' | 'claimed' | 'needs_setup' | 'unconfigured';
}> {
  try {
    const resp = await fetch('/api/admin/status');
    if (resp.ok) {
      return (await resp.json()) as {
        configured: boolean;
        mode: 'env' | 'claimed' | 'needs_setup' | 'unconfigured';
      };
    }
  } catch {
    // Ignore network error
  }
  return { configured: false, mode: 'needs_setup' };
}

export async function setupInitialAdminPin(
  pin: string,
): Promise<{ ok: boolean; token?: string; error?: string }> {
  try {
    const resp = await fetch('/api/admin/setup-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin.trim() }),
    });
    const json = (await resp.json().catch(() => ({}))) as {
      ok?: boolean;
      token?: string;
      error?: string;
    };
    return {
      ok: resp.ok && Boolean(json.ok),
      token: json.token,
      error: json.error,
    };
  } catch {
    return { ok: false, error: 'Unable to reach Atelier server to configure initial PIN.' };
  }
}

export async function verifyAdminPin(
  pin: string,
): Promise<{ ok: boolean; token?: string; needsSetup?: boolean; error?: string }> {
  const trimmed = pin.trim();
  if (!trimmed) return { ok: false, error: 'Please enter your PIN.' };
  try {
    const resp = await fetch('/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: trimmed }),
    });
    const json = (await resp.json().catch(() => ({}))) as {
      ok?: boolean;
      token?: string;
      needsSetup?: boolean;
      error?: string;
    };
    return {
      ok: resp.ok && Boolean(json.ok),
      token: json.token,
      needsSetup: json.needsSetup,
      error: json.error,
    };
  } catch {
    return { ok: false, error: 'Unable to reach Atelier authentication server.' };
  }
}

export async function recordAtelierOrder(payload: {
  orderNumber: string;
  customerUid?: string | null;
  customerEmailVerified?: boolean;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  gpsLabel?: string;
  engravingNote?: string;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
  items: AtelierOrderLineItem[];
  subtotalThb: number;
  shippingThb: number;
  totalThb: number;
}): Promise<AtelierOrderRecord> {
  const safeOrderId = payload.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
  const now = Date.now();
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerEmail.trim())
    ? payload.customerEmail.trim().toLowerCase().slice(0, 155)
    : 'guest@gentlebubble.com';

  // Ensure a matching Local Account exists & is updated with customer's shipping/GPS details
  const localProfile = upsertLocalAccount(
    {
      email: safeEmail,
      displayName: payload.customerName,
      defaultAddress: payload.shippingAddress,
      gpsLabel: payload.gpsLabel,
      ...(payload.customerUid && payload.customerEmailVerified
        ? { linkedGoogleUid: payload.customerUid }
        : {}),
    },
    true,
  );

  const resolvedPayStatus: PaymentStatus =
    payload.paymentStatus ?? (payload.paymentMethod === 'PromptPay QR' ? 'pending' : 'paid');
  const resolvedPayRef =
    payload.paymentReference?.trim().slice(0, 80) ||
    `TXN-${safeOrderId}-${String(now).slice(-4)}`;

  const sanitizedItems: AtelierOrderLineItem[] = payload.items.slice(0, 30).map((it) => ({
    cartKey: String(it.cartKey || '').slice(0, 180),
    editionId: String(it.editionId || '').slice(0, 128),
    name: String(it.name || '').slice(0, 160),
    scentName: String(it.scentName || '').slice(0, 200),
    priceUsd: Number(it.priceUsd || 0),
    quantity: Math.max(1, Math.min(99, Number(it.quantity || 1))),
    ...(it.giftNote?.trim() ? { giftNote: it.giftNote.trim().slice(0, 80) } : {}),
    ...(it.imageUrl && it.imageUrl.length <= 480 ? { imageUrl: it.imageUrl } : {}),
  }));

  const localRecord: AtelierOrderRecord = {
    orderNumber: safeOrderId,
    accountId: localProfile.accountId,
    ...(payload.customerUid && payload.customerEmailVerified
      ? { customerUid: payload.customerUid.slice(0, 125) }
      : {}),
    customerName: (payload.customerName.trim() || 'Maison Collector').slice(0, 115),
    customerEmail: safeEmail,
    shippingAddress: (payload.shippingAddress.trim() || 'Atelier Collection Pickup').slice(0, 295),
    ...(payload.gpsLabel?.trim() ? { gpsLabel: payload.gpsLabel.trim().slice(0, 60) } : {}),
    ...(payload.engravingNote?.trim()
      ? { engravingNote: payload.engravingNote.trim().slice(0, 75) }
      : {}),
    paymentMethod: (payload.paymentMethod || 'Credit Card').slice(0, 60),
    paymentStatus: resolvedPayStatus,
    ...(resolvedPayStatus === 'paid' ? { paidAtMs: now } : {}),
    paymentReference: resolvedPayRef,
    carrier: 'GentleBubble White-Glove Express',
    items: sanitizedItems,
    subtotalThb: Math.max(0, Math.min(2000000, Math.round(payload.subtotalThb))),
    shippingThb: Math.max(0, Math.min(50000, Math.round(payload.shippingThb))),
    totalThb: Math.max(0, Math.min(2050000, Math.round(payload.totalThb))),
    status: 'queued',
    completedSteps: [],
    createdAtMs: now,
    updatedAtMs: now,
    source: 'local',
  };

  // 1. Save locally right away in Local Accounts & Orders DB
  const existingLocal = loadLocalAtelierOrders().filter((o) => o.orderNumber !== safeOrderId);
  saveLocalAtelierOrders([localRecord, ...existingLocal]);

  // 2. Mirror to Express backend queue (if available)
  void fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localRecord),
  }).catch(() => {});

  // 3. Persist directly to Firestore /atelier_orders/{orderId}
  const firestorePath = `atelier_orders/${safeOrderId}`;
  try {
    await setDoc(doc(db, 'atelier_orders', safeOrderId), {
      orderNumber: safeOrderId,
      accountId: localProfile.accountId,
      ...(localRecord.customerUid ? { customerUid: localRecord.customerUid } : {}),
      customerName: localRecord.customerName,
      customerEmail: localRecord.customerEmail,
      shippingAddress: localRecord.shippingAddress,
      ...(localRecord.gpsLabel ? { gpsLabel: localRecord.gpsLabel } : {}),
      ...(localRecord.engravingNote ? { engravingNote: localRecord.engravingNote } : {}),
      paymentMethod: localRecord.paymentMethod,
      paymentStatus: localRecord.paymentStatus,
      ...(typeof localRecord.paidAtMs === 'number' ? { paidAtMs: localRecord.paidAtMs } : {}),
      ...(localRecord.paymentReference ? { paymentReference: localRecord.paymentReference } : {}),
      ...(localRecord.carrier ? { carrier: localRecord.carrier } : {}),
      items: localRecord.items,
      subtotalThb: localRecord.subtotalThb,
      shippingThb: localRecord.shippingThb,
      totalThb: localRecord.totalThb,
      status: 'queued',
      completedSteps: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.CREATE, firestorePath);
    } catch {
      // Handled gracefully
    }
  }

  return localRecord;
}

export async function fetchAdminServerOrders(sessionToken: string): Promise<AtelierOrderRecord[]> {
  if (!sessionToken) return [];
  try {
    const resp = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (!resp.ok) return [];
    const json = (await resp.json()) as { orders?: AtelierOrderRecord[] };
    if (!Array.isArray(json.orders)) return [];
    return json.orders.map((o) => normalizeLegacyOrder({ ...o, source: 'server' as const }));
  } catch {
    return [];
  }
}

export function subscribeAdminAtelierOrders(
  adminEmail: string | null | undefined,
  emailVerified: boolean | undefined,
  onChange: (orders: AtelierOrderRecord[]) => void,
  onPermissionError?: (errMessage: string) => void,
): () => void {
  const isBootstrapped =
    Boolean(emailVerified) && adminEmail?.trim().toLowerCase() === ADMIN_BOOTSTRAP_EMAIL;
  if (!isBootstrapped) {
    return () => {};
  }

  const path = 'atelier_orders';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AtelierOrderRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return normalizeLegacyOrder({
          orderNumber: String(data.orderNumber ?? d.id),
          accountId: data.accountId ? String(data.accountId) : undefined,
          customerUid: data.customerUid ? String(data.customerUid) : undefined,
          customerName: String(data.customerName ?? 'Maison Collector'),
          customerEmail: String(data.customerEmail ?? ''),
          shippingAddress: String(data.shippingAddress ?? ''),
          gpsLabel: data.gpsLabel ? String(data.gpsLabel) : undefined,
          engravingNote: data.engravingNote ? String(data.engravingNote) : undefined,
          paymentMethod: String(data.paymentMethod ?? ''),
          paymentStatus: (data.paymentStatus as PaymentStatus | undefined) ?? 'paid',
          paidAtMs: typeof data.paidAtMs === 'number' ? data.paidAtMs : undefined,
          paymentReference: data.paymentReference ? String(data.paymentReference) : undefined,
          trackingCode: data.trackingCode ? String(data.trackingCode) : undefined,
          carrier: data.carrier ? String(data.carrier) : undefined,
          items: Array.isArray(data.items) ? (data.items as AtelierOrderLineItem[]) : [],
          subtotalThb: Number(data.subtotalThb ?? 0),
          shippingThb: Number(data.shippingThb ?? 0),
          totalThb: Number(data.totalThb ?? 0),
          status: (data.status as AtelierOrderStatus) ?? 'queued',
          completedSteps: Array.isArray(data.completedSteps)
            ? data.completedSteps.map(String)
            : [],
          createdAtMs: data.createdAt?.toMillis?.() ?? Date.now(),
          updatedAtMs: data.updatedAt?.toMillis?.() ?? Date.now(),
          source: 'firestore',
        });
      });
      onChange(list);
    },
    (error) => {
      onPermissionError?.(error instanceof Error ? error.message : 'Unable to stream Firestore orders');
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Surfaced via onPermissionError banner in Admin Studio
      }
    },
  );
}

export async function updateAtelierOrderProgress(params: {
  orderNumber: string;
  customerUid?: string;
  status: AtelierOrderStatus;
  completedSteps: string[];
  paymentStatus?: PaymentStatus;
  paidAtMs?: number;
  paymentReference?: string;
  trackingCode?: string;
  carrier?: string;
  sessionToken: string;
  isCloudAdmin: boolean;
}): Promise<void> {
  const safeOrderId = params.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32);
  const safeSteps = params.completedSteps.slice(0, 200);
  const now = Date.now();
  const nextPaidAtMs =
    params.paymentStatus === 'paid' ? params.paidAtMs ?? now : params.paidAtMs;

  // 1. Update local mirror immediately
  const local = loadLocalAtelierOrders();
  const nextLocal = local.map((o) =>
    o.orderNumber === safeOrderId
      ? {
          ...o,
          status: params.status,
          completedSteps: safeSteps,
          ...(params.paymentStatus ? { paymentStatus: params.paymentStatus } : {}),
          ...(typeof nextPaidAtMs === 'number' ? { paidAtMs: nextPaidAtMs } : {}),
          ...(params.paymentReference !== undefined ? { paymentReference: params.paymentReference } : {}),
          ...(params.trackingCode !== undefined ? { trackingCode: params.trackingCode } : {}),
          ...(params.carrier !== undefined ? { carrier: params.carrier } : {}),
          updatedAtMs: now,
        }
      : o,
  );
  saveLocalAtelierOrders(nextLocal);

  // 2. Sync to Express server queue
  if (params.sessionToken) {
    void fetch(`/api/admin/orders/${encodeURIComponent(safeOrderId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.sessionToken}`,
      },
      body: JSON.stringify({
        status: params.status,
        completedSteps: safeSteps,
        ...(params.paymentStatus ? { paymentStatus: params.paymentStatus } : {}),
        ...(typeof nextPaidAtMs === 'number' ? { paidAtMs: nextPaidAtMs } : {}),
        ...(params.paymentReference !== undefined ? { paymentReference: params.paymentReference } : {}),
        ...(params.trackingCode !== undefined ? { trackingCode: params.trackingCode } : {}),
        ...(params.carrier !== undefined ? { carrier: params.carrier } : {}),
      }),
    }).catch(() => {});
  }

  // 3. Persist to Firestore if authenticated as bootstrapped admin
  if (params.isCloudAdmin) {
    const path = `atelier_orders/${safeOrderId}`;
    try {
      const patchPayload: Record<string, unknown> = {
        status: params.status,
        completedSteps: safeSteps,
        updatedAt: serverTimestamp(),
      };
      if (params.paymentStatus) patchPayload.paymentStatus = params.paymentStatus;
      if (typeof nextPaidAtMs === 'number') patchPayload.paidAtMs = nextPaidAtMs;
      if (params.paymentReference) patchPayload.paymentReference = params.paymentReference.slice(0, 80);
      if (params.trackingCode) patchPayload.trackingCode = params.trackingCode.slice(0, 48);
      if (params.carrier) patchPayload.carrier = params.carrier.slice(0, 64);

      await updateDoc(doc(db, 'atelier_orders', safeOrderId), patchPayload);

      if (params.customerUid) {
        const userOrderPatch: Record<string, unknown> = { status: params.status };
        if (params.paymentStatus) userOrderPatch.paymentStatus = params.paymentStatus;
        if (typeof nextPaidAtMs === 'number') userOrderPatch.paidAtMs = nextPaidAtMs;
        if (params.paymentReference) userOrderPatch.paymentReference = params.paymentReference.slice(0, 80);
        if (params.trackingCode) userOrderPatch.trackingCode = params.trackingCode.slice(0, 48);
        if (params.carrier) userOrderPatch.carrier = params.carrier.slice(0, 64);
        await updateDoc(doc(db, 'users', params.customerUid, 'orders', safeOrderId), userOrderPatch).catch(
          () => {},
        );
      }
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, path);
      } catch {
        // Ignore non-fatal sync issue when offline
      }
    }
  }
}

// ============================================================================
// CLOUDFLARE D1 & EDGE WORKER SYNC (Google Sign-In -> Cloudflare D1 Collectors)
// ============================================================================

export interface EdgeCollectorSyncResult {
  ok: boolean;
  collector?: {
    accountId: string;
    uid: string;
    email: string;
    displayName: string;
  };
  history?: SavedHistoryItem[];
  orders?: AtelierOrderRecord[];
}

export async function syncFirebaseCollectorWithEdge(
  idToken: string,
): Promise<EdgeCollectorSyncResult | null> {
  if (!idToken) return null;
  try {
    const resp = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ syncedAtMs: Date.now() }),
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as EdgeCollectorSyncResult;
    if (!data.ok || !data.collector) return null;

    const syncedAccount = upsertLocalAccount(
      {
        email: data.collector.email,
        displayName: data.collector.displayName,
        linkedGoogleUid: data.collector.uid,
      },
      true,
    );

    if (Array.isArray(data.orders) && data.orders.length > 0) {
      const existing = loadLocalAtelierOrders();
      const byNum = new Map<string, AtelierOrderRecord>();
      for (const ord of existing) {
        byNum.set(ord.orderNumber, ord);
      }
      for (const remote of data.orders) {
        const normalized = normalizeLegacyOrder({
          ...remote,
          accountId: remote.accountId || syncedAccount.accountId,
          source: 'server',
        });
        const prev = byNum.get(normalized.orderNumber);
        if (!prev || normalized.updatedAtMs >= prev.updatedAtMs) {
          byNum.set(normalized.orderNumber, normalized);
        }
      }
      saveLocalAtelierOrders(Array.from(byNum.values()));
    }

    if (Array.isArray(data.history) && data.history.length > 0) {
      for (const item of [...data.history].reverse()) {
        recordLocalAccountHistory(syncedAccount.accountId, {
          itemId: item.itemId,
          itemType: item.itemType,
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.imageUrl,
          priceThb: item.priceThb,
        });
      }
    }

    return data;
  } catch {
    return null;
  }
}

export async function syncCollectorHistoryEdge(
  idToken: string,
  payload: {
    itemId: string;
    itemType: 'soap' | 'bath-bomb' | 'marble-case' | 'order';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    priceThb?: number;
  },
): Promise<void> {
  if (!idToken) return;
  try {
    await fetch('/api/collector/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking background sync to Cloudflare D1
  }
}

