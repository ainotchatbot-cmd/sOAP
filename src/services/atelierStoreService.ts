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
const LOCAL_EXTRA_SOLD_KEY = 'gentle_bubble_local_extra_sold_v1';
const LOCAL_ITEM_SOLD_KEY = 'gentle_bubble_item_sold_map_v1';

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
    limit(12),
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
