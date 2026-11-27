import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowDownRight,
  Feather,
  FlaskConical,
  History,
  Layers,
  LogIn,
  Monitor,
  ScrollText,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  DREAM_PRESETS,
  DreamPresetId,
  getDreamPreset,
  SoapLineKey,
} from './data/palette';
import {
  ALL_SOAP_CREATIONS,
  ATELIER_MEDIA,
  MarbleCassetteEdition,
  SOAP_BY_ID,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from './data/soaps';
import {
  BATH_BOMB_BY_ID,
  BATH_BOMB_PRICE_TIERS,
  BathBombCreation,
  BathBombMarbleCaseEdition,
  BathBombPackTier,
} from './data/bathBombs';
import {
  ART_ERA_BY_ID,
  ART_ERAS,
  ArtEraId,
  VAULT_PRICING,
  VaultMarbleBoxEdition,
  VaultPairedFormulation,
} from './data/memberVaultCatalog';
import { useLanguage } from './data/i18n';
import { harpEngine, MusicTuneStyle } from './utils/harpAudio';
import { ResilientImage } from './components/ResilientImage';
import { StarfallNightAtmosphere } from './components/StarfallNightAtmosphere';
import { SettingsGearMenu } from './components/SettingsGearMenu';
import { CategoryHoverPreview } from './components/CategoryHoverPreview';
import { RedesignedLogoMotif } from './components/RedesignedLogoMotif';
import { BrandWordmark } from './components/BrandWordmark';
import { FloatingSoapBubblesOverlay } from './components/FloatingSoapBubblesOverlay';
import { HeroTopSellerCarousel } from './components/HeroTopSellerCarousel';
import type { BagItem, OrderReceipt } from './components/BagWorkspace';
import { MailingListBanner } from './components/MailingListBanner';
import { CookieAdBanner } from './components/CookieAdBanner';
import { SmartFrenchScroller } from './components/SmartFrenchScroller';
import { LazyGallerySection, triggerRevealSection } from './components/LazyGallerySection';
import { ImageZoomModal, type ZoomableImageTarget } from './components/ImageZoomModal';

const TopTenDuosSection = lazy(() =>
  import('./components/TopTenDuosSection').then((m) => ({ default: m.TopTenDuosSection })),
);
const GiftSetsSection = lazy(() =>
  import('./components/GiftSetsSection').then((m) => ({ default: m.GiftSetsSection })),
);
const SocialProofSection = lazy(() =>
  import('./components/SocialProofSection').then((m) => ({ default: m.SocialProofSection })),
);
const VisionStorySection = lazy(() =>
  import('./components/VisionStorySection').then((m) => ({ default: m.VisionStorySection })),
);
const ReviewsSection = lazy(() =>
  import('./components/ReviewsSection').then((m) => ({ default: m.ReviewsSection })),
);
const SeoAtelierSection = lazy(() =>
  import('./components/SeoAtelierSection').then((m) => ({ default: m.SeoAtelierSection })),
);
const BathBombsSection = lazy(() =>
  import('./components/BathBombsSection').then((m) => ({ default: m.BathBombsSection })),
);
const BathBombMarbleCasesSection = lazy(() =>
  import('./components/BathBombMarbleCasesSection').then((m) => ({
    default: m.BathBombMarbleCasesSection,
  })),
);
const BathBombNutritionModal = lazy(() =>
  import('./components/BathBombNutritionModal').then((m) => ({
    default: m.BathBombNutritionModal,
  })),
);
const SoapPodiumModal = lazy(() =>
  import('./components/SoapPodiumModal').then((m) => ({ default: m.SoapPodiumModal })),
);
const AccountHistoryModal = lazy(() =>
  import('./components/AccountHistoryModal').then((m) => ({ default: m.AccountHistoryModal })),
);
const MobileBagDrawer = lazy(() =>
  import('./components/BagWorkspace').then((m) => ({ default: m.MobileBagDrawer })),
);
const SecretVaultSection = lazy(() =>
  import('./components/SecretVaultSection').then((m) => ({ default: m.SecretVaultSection })),
);
const LuxuryFruitDuosSection = lazy(() =>
  import('./components/LuxuryFruitDuosSection').then((m) => ({
    default: m.LuxuryFruitDuosSection,
  })),
);
const CategoryTwoArchiveSection = lazy(() =>
  import('./components/CategoryTwoArchiveSection').then((m) => ({
    default: m.CategoryTwoArchiveSection,
  })),
);
const AtelierAdminDashboard = lazy(() =>
  import('./components/AtelierAdminDashboard').then((m) => ({ default: m.AtelierAdminDashboard })),
);
import {
  auth,
  getFirebaseIdToken,
  onAuthStateChanged,
  signInWithGooglePopup,
  signOutAccount,
  testFirestoreConnection,
  User,
} from './firebase';
import {
  AtelierOrderRecord,
  BASE_ATELIER_SOLD_COUNT,
  clearLocalAccountHistory,
  clearUserHistory,
  CookiePreferences,
  fetchLiveOrderTracking,
  getActiveLocalAccount,
  getOrdersForAccount,
  incrementLocalSoldCounts,
  loadCookiePreferences,
  loadLocalAccountHistory,
  loadLocalAccountsDatabase,
  loadLocalAtelierOrders,
  loadLocalItemSoldMap,
  LocalAccountProfile,
  persistCookiePreferences,
  recordAtelierOrder,
  recordGlobalSoldIncrement,
  recordLocalAccountHistory,
  recordUserHistory,
  recordUserOrder,
  saveLocalAtelierOrders,
  SavedHistoryItem,
  SavedOrderItem,
  signOutLocalAccount,
  subscribeGlobalSoldCounter,
  subscribeUserHistory,
  subscribeUserOrders,
  switchActiveLocalAccount,
  syncCollectorHistoryEdge,
  syncFirebaseCollectorWithEdge,
  syncGoogleUserToLocalAccount,
  trackAdInterestCookie,
  upsertLocalAccount,
} from './services/atelierStoreService';

type CatalogPageMode = 'soaps' | 'bath-bombs' | 'fruit-duos' | 'category-2' | ArtEraId;

const VALID_CATALOG_MODES = new Set<CatalogPageMode>([
  'soaps',
  'bath-bombs',
  'fruit-duos',
  'category-2',
  'medieval',
  'renaissance',
  'baroque',
  'romanticism',
  'enlightenment',
]);

const BAG_STORAGE_KEY = 'gentle_bubble_bag_v9_thb';
const WISHLIST_STORAGE_KEY = 'gentle_bubble_wishlist_v8';
const PRESET_STORAGE_KEY = 'gentle_bubble_preset_v8';
const TV_MODE_STORAGE_KEY = 'gentle_bubble_tv_mode_v1';

export default function App() {
  const {
    lang,
    isLangTransitioning,
    t,
    getSoapDisplay,
    getCaseDisplay,
  } = useLanguage();
  const [presetId, setPresetId] = useState<DreamPresetId>(() => {
    try {
      const saved = window.localStorage.getItem(PRESET_STORAGE_KEY) as DreamPresetId | null;
      if (saved && DREAM_PRESETS.some((p) => p.id === saved)) return saved;
    } catch {
      // Ignore storage restrictions
    }
    return 'midnight-reverie';
  });

  const [catalogMode, setCatalogMode] = useState<CatalogPageMode>(() => {
    if (typeof window === 'undefined') return 'soaps';
    try {
      const rawCat = new URLSearchParams(window.location.search).get('category') as CatalogPageMode | null;
      if (rawCat && VALID_CATALOG_MODES.has(rawCat)) return rawCat;
    } catch {
      // Ignore URL parsing issues
    }
    return 'soaps';
  });
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const hoverClearTimerRef = React.useRef<number | null>(null);

  const [isAutoTvDetected, setIsAutoTvDetected] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(min-width: 1920px)').matches;
  });
  const [tvManualOverride, setTvManualOverride] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(TV_MODE_STORAGE_KEY);
      if (raw === 'true') return true;
      if (raw === 'false') return false;
    } catch {
      // Ignore storage restrictions
    }
    return null;
  });
  const isTvMode = tvManualOverride ?? isAutoTvDetected;

  const [activeLineFilter, setActiveLineFilter] = useState<'parallel' | SoapLineKey>('parallel');
  const [musicStyle, setMusicStyle] = useState<MusicTuneStyle>('off');
  const [isAmbienceOn, setIsAmbienceOn] = useState<boolean>(false);

  const [podiumSoapId, setPodiumSoapId] = useState<string | null>(null);
  const [activeBombNutritionId, setActiveBombNutritionId] = useState<string | null>(null);
  const [heroInspectedVaultPair, setHeroInspectedVaultPair] = useState<VaultPairedFormulation | null>(null);
  const [zoomTarget, setZoomTarget] = useState<ZoomableImageTarget | null>(null);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage restrictions
    }
    return ['bright-coconut-pearl', 'holiday-coronation-royal'];
  });

  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(BAG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage restrictions
    }
    return [];
  });

  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [bagMounted, setBagMounted] = useState(false);
  const [recentAddedKey, setRecentAddedKey] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [localAccounts, setLocalAccounts] = useState<LocalAccountProfile[]>(() =>
    loadLocalAccountsDatabase(),
  );
  const [activeLocalAccount, setActiveLocalAccount] = useState<LocalAccountProfile | null>(() =>
    getActiveLocalAccount(),
  );
  const [localHistory, setLocalHistory] = useState<SavedHistoryItem[]>(() => {
    const active = getActiveLocalAccount();
    return active ? loadLocalAccountHistory(active.accountId) : [];
  });
  const [localOrders, setLocalOrders] = useState<AtelierOrderRecord[]>(() => {
    const active = getActiveLocalAccount();
    return active ? getOrdersForAccount(active) : [];
  });
  const [savedHistory, setSavedHistory] = useState<SavedHistoryItem[]>([]);
  const [savedOrders, setSavedOrders] = useState<SavedOrderItem[]>([]);
  const [totalSoldCount, setTotalSoldCount] = useState<number>(BASE_ATELIER_SOLD_COUNT);
  const [itemSoldDeltas, setItemSoldDeltas] = useState<Record<string, number>>(() =>
    loadLocalItemSoldMap(),
  );
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(() => loadCookiePreferences());
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#admin' || window.location.search.includes('admin=1');
  });

  const activePreset = getDreamPreset(presetId);
  const isTwilight = activePreset.mode === 'twilight';
  const accentHex = activePreset.accentHex;
  const accentTextHex = activePreset.accentTextHex;

  // Sync Daylight Cloud Cream (:root) vs Pastel Twilight Lavender (.dark)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isTwilight);
    root.style.setProperty('--canvas', activePreset.canvasHex);
    root.style.setProperty('--surface', activePreset.surfaceHex);
    root.style.setProperty('--surface-card', activePreset.surfaceCardHex);
    root.style.setProperty('--border', activePreset.borderHex);
    root.style.setProperty('--ink', activePreset.inkHex);
    root.style.setProperty('--muted', activePreset.mutedHex);
    root.style.setProperty('--accent', activePreset.accentHex);
    root.style.setProperty('--accent-soft', activePreset.accentSoft);

    try {
      window.localStorage.setItem(PRESET_STORAGE_KEY, activePreset.id);
    } catch {
      // Ignore storage restrictions
    }
  }, [activePreset, isTwilight]);

  useEffect(() => {
    harpEngine.setScale(activePreset.harpScale);
    harpEngine.setSeasonAtmosphere(activePreset.seasonAudioKey);
  }, [activePreset.harpScale, activePreset.seasonAudioKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(min-width: 1920px)');
    const onChange = (e: MediaQueryListEvent) => setIsAutoTvDetected(e.matches);
    setIsAutoTvDetected(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    void testFirestoreConnection();
    const unsubscribeSold = subscribeGlobalSoldCounter(setTotalSoldCount);
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => {
      unsubscribeSold();
      unsubscribeAuth();
      if (hoverClearTimerRef.current !== null) {
        window.clearTimeout(hoverClearTimerRef.current);
      }
      harpEngine.stop();
      harpEngine.stopAtmosphere();
    };
  }, []);

  const refreshLocalAccountState = useCallback(
    (overrideAccount?: LocalAccountProfile | null, overrideUser?: User | null) => {
      const effectiveAccount =
        overrideAccount !== undefined ? overrideAccount : getActiveLocalAccount();
      const effectiveUser = overrideUser !== undefined ? overrideUser : user;
      setLocalAccounts(loadLocalAccountsDatabase());
      setActiveLocalAccount(effectiveAccount);
      setLocalHistory(
        effectiveAccount ? loadLocalAccountHistory(effectiveAccount.accountId) : [],
      );
      setLocalOrders(
        effectiveAccount || effectiveUser
          ? getOrdersForAccount({
              accountId: effectiveAccount?.accountId,
              email: effectiveUser?.email || effectiveAccount?.email,
              uid: effectiveUser?.uid,
            })
          : [],
      );
    },
    [user],
  );

  useEffect(() => {
    if (!user) {
      setSavedHistory([]);
      setSavedOrders([]);
      const active = getActiveLocalAccount();
      setLocalAccounts(loadLocalAccountsDatabase());
      setActiveLocalAccount(active);
      setLocalHistory(active ? loadLocalAccountHistory(active.accountId) : []);
      setLocalOrders(active ? getOrdersForAccount(active) : []);
      return;
    }
    const synced = syncGoogleUserToLocalAccount(user.uid, user.email, user.displayName);
    const active = synced ?? getActiveLocalAccount();
    setLocalAccounts(loadLocalAccountsDatabase());
    setActiveLocalAccount(active);
    setLocalHistory(active ? loadLocalAccountHistory(active.accountId) : []);
    setLocalOrders(
      getOrdersForAccount({
        accountId: active?.accountId,
        email: user.email || active?.email,
        uid: user.uid,
      }),
    );

    const unsubHistory = subscribeUserHistory(user.uid, setSavedHistory);
    const unsubOrders = subscribeUserOrders(user.uid, setSavedOrders);

    let cancelled = false;
    void getFirebaseIdToken().then((token) => {
      if (!token || cancelled) return;
      return syncFirebaseCollectorWithEdge(token).then((result) => {
        if (!cancelled && result?.ok) {
          refreshLocalAccountState();
        }
      });
    });

    return () => {
      cancelled = true;
      unsubHistory();
      unsubOrders();
    };
  }, [refreshLocalAccountState, user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore storage restrictions
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage restrictions
    }
  }, [wishlistIds]);

  const handleSelectPreset = (nextId: DreamPresetId) => {
    setPresetId(nextId);
    const nextPreset = getDreamPreset(nextId);
    if (musicStyle !== 'off') {
      const nextStyle =
        nextPreset.recommendedMusic === 'off' ? 'kalimba' : nextPreset.recommendedMusic;
      setMusicStyle(nextStyle);
      harpEngine.start(nextPreset.harpScale, nextStyle);
    }
  };

  const handleChangeMusicStyle = (next: MusicTuneStyle) => {
    setMusicStyle(next);
    if (next === 'off') {
      harpEngine.stop();
    } else {
      harpEngine.start(activePreset.harpScale, next);
    }
  };

  const handleToggleAmbience = () => {
    if (isAmbienceOn) {
      harpEngine.stopAtmosphere();
      setIsAmbienceOn(false);
    } else {
      harpEngine.startAtmosphere(activePreset.seasonAudioKey);
      setIsAmbienceOn(true);
    }
  };

  const heroSpotlightSoap =
    SOAP_BY_ID.get(activePreset.spotlightSoapId) ?? ALL_SOAP_CREATIONS[0];

  const totalBagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems],
  );

  const handleToggleWishlist = useCallback((soapId: string) => {
    setWishlistIds((prev) =>
      prev.includes(soapId) ? prev.filter((id) => id !== soapId) : [...prev, soapId],
    );
  }, []);

  const handleToggleTvMode = useCallback(() => {
    const next = !isTvMode;
    setTvManualOverride(next);
    try {
      window.localStorage.setItem(TV_MODE_STORAGE_KEY, String(next));
    } catch {
      // Ignore storage restrictions
    }
  }, [isTvMode]);

  const handleTabMouseEnter = useCallback((tabId: string) => {
    if (hoverClearTimerRef.current !== null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
    setHoveredTab(tabId);
  }, []);

  const handleCancelClearHover = useCallback(() => {
    if (hoverClearTimerRef.current !== null) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
  }, []);

  const handleScheduleClearHover = useCallback(() => {
    if (hoverClearTimerRef.current !== null) {
      window.clearTimeout(hoverClearTimerRef.current);
    }
    hoverClearTimerRef.current = window.setTimeout(() => {
      setHoveredTab(null);
      hoverClearTimerRef.current = null;
    }, 150);
  }, []);

  const handleSelectCatalogMode = useCallback(
    (nextMode: CatalogPageMode) => {
      setCatalogMode(nextMode);
      setHoveredTab(null);
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          if (nextMode === 'soaps') {
            url.searchParams.delete('category');
          } else {
            url.searchParams.set('category', nextMode);
          }
          window.history.replaceState(null, '', url.toString());
        } catch {
          // Ignore URL state updates
        }
      }
      if (cookiePrefs.adCookies) {
        trackAdInterestCookie(
          nextMode === 'bath-bombs'
            ? 'vitamin_bath_bombs_soak'
            : nextMode === 'soaps'
              ? 'gold_leaf_bar_soaps'
              : nextMode === 'fruit-duos'
                ? 'luxury_fruit_duos_deadsea'
                : nextMode === 'category-2'
                  ? 'atelier_category_two_archive'
                  : `art_era_${nextMode}`,
        );
      }
    },
    [cookiePrefs.adCookies],
  );

  const isEraMode =
    catalogMode === 'medieval' ||
    catalogMode === 'renaissance' ||
    catalogMode === 'baroque' ||
    catalogMode === 'romanticism' ||
    catalogMode === 'enlightenment';
  const activeEraMeta = isEraMode ? (ART_ERA_BY_ID.get(catalogMode) ?? null) : null;

  const getEraBtnLabel = (eraId: ArtEraId) => {
    switch (eraId) {
      case 'medieval':
        return t.modeMedievalBtn;
      case 'renaissance':
        return t.modeRenaissanceBtn;
      case 'baroque':
        return t.modeBaroqueBtn;
      case 'romanticism':
        return t.modeRomanticismBtn;
      case 'enlightenment':
        return t.modeEnlightenmentBtn;
    }
  };

  const handleOpenPodium = useCallback(
    (id: string) => {
      setPodiumSoapId(id);
      const soap = SOAP_BY_ID.get(id);
      if (soap) {
        if (cookiePrefs.adCookies) {
          trackAdInterestCookie(`soap_${soap.line}_${soap.luxuryInlay.type}`);
        }
        if (cookiePrefs.savedHistory) {
          const display = getSoapDisplay(soap);
          const historyPayload = {
            itemId: soap.id,
            itemType: 'soap' as const,
            title: display.name,
            subtitle: `${display.themeLabel} · ${display.scentMood}`,
            imageUrl: soap.imageUrl,
            priceThb: soap.priceUsd,
          };
          if (user) {
            void recordUserHistory(user.uid, historyPayload).catch(() => {});
            void getFirebaseIdToken().then((token) => {
              if (token) void syncCollectorHistoryEdge(token, historyPayload);
            });
          }
          if (activeLocalAccount) {
            setLocalHistory(recordLocalAccountHistory(activeLocalAccount.accountId, historyPayload));
          }
        }
      }
    },
    [activeLocalAccount, cookiePrefs.adCookies, cookiePrefs.savedHistory, getSoapDisplay, user],
  );

  const handleOpenBombNutrition = useCallback(
    (id: string) => {
      setActiveBombNutritionId(id);
      const bomb = BATH_BOMB_BY_ID.get(id);
      if (bomb) {
        if (cookiePrefs.adCookies) {
          trackAdInterestCookie(`bomb_${bomb.line}_${bomb.nutrientFocus}`);
        }
        if (cookiePrefs.savedHistory) {
          const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
          const soakMood = lang === 'th' ? bomb.soakMoodTh : bomb.soakMoodEn;
          const historyPayload = {
            itemId: bomb.id,
            itemType: 'bath-bomb' as const,
            title,
            subtitle: soakMood,
            imageUrl: bomb.imageUrl,
            priceThb: BATH_BOMB_PRICE_TIERS.single,
          };
          if (user) {
            void recordUserHistory(user.uid, historyPayload).catch(() => {});
            void getFirebaseIdToken().then((token) => {
              if (token) void syncCollectorHistoryEdge(token, historyPayload);
            });
          }
          if (activeLocalAccount) {
            setLocalHistory(recordLocalAccountHistory(activeLocalAccount.accountId, historyPayload));
          }
        }
      }
    },
    [activeLocalAccount, cookiePrefs.adCookies, cookiePrefs.savedHistory, lang, user],
  );

  const handleOpenBagDrawer = useCallback(() => {
    setBagMounted(true);
    setIsBagDrawerOpen(true);
  }, []);

  const handleCloseBagDrawer = useCallback(() => {
    setIsBagDrawerOpen(false);
  }, []);

  const handleClearBag = useCallback(() => {
    setBagItems([]);
  }, []);

  const handleClosePodium = useCallback(() => {
    setPodiumSoapId(null);
  }, []);

  const handleCloseBombModal = useCallback(() => {
    setActiveBombNutritionId(null);
  }, []);

  const handleOrderCompleted = useCallback(
    (completedReceipt: OrderReceipt) => {
      const deltas = completedReceipt.items.map((item) => ({
        id: item.editionId,
        qty: item.quantity,
      }));
      const totalQty = incrementLocalSoldCounts(deltas);
      setItemSoldDeltas(loadLocalItemSoldMap());
      setTotalSoldCount((prev) => prev + totalQty);

      // Persist full itemized production order & auto-link into Local Accounts DB
      void recordAtelierOrder({
        orderNumber: completedReceipt.orderNumber,
        customerUid: user?.uid ?? null,
        customerEmailVerified: Boolean(user?.emailVerified),
        customerName: completedReceipt.customerName,
        customerEmail: completedReceipt.customerEmail,
        shippingAddress: completedReceipt.shippingAddress,
        gpsLabel: completedReceipt.gpsLabel,
        engravingNote: completedReceipt.engravingNote,
        paymentMethod: completedReceipt.paymentMethod,
        paymentStatus: completedReceipt.paymentStatus,
        paymentReference: completedReceipt.paymentReference,
        items: completedReceipt.items.map((it) => ({
          cartKey: it.cartKey,
          editionId: it.editionId,
          name: it.name,
          scentName: it.scentName,
          priceUsd: it.priceUsd,
          quantity: it.quantity,
          giftNote: it.giftNote,
          imageUrl: it.imageUrl,
        })),
        subtotalThb: completedReceipt.subtotalUsd,
        shippingThb: completedReceipt.shippingUsd,
        totalThb: completedReceipt.totalUsd,
      }).then((recorded) => {
        const nextActive = getActiveLocalAccount();
        setLocalAccounts(loadLocalAccountsDatabase());
        setActiveLocalAccount(nextActive);
        setLocalOrders(
          getOrdersForAccount({
            accountId: recorded.accountId || nextActive?.accountId,
            email: user?.email || recorded.customerEmail || nextActive?.email,
            uid: user?.uid,
          }),
        );
      });

      if (user) {
        void recordGlobalSoldIncrement(totalQty, totalSoldCount, true);
        if (cookiePrefs.savedHistory) {
          const firstName = completedReceipt.items[0]?.name ?? 'GentleBubble Atelier';
          const summaryTitle =
            completedReceipt.items.length > 1
              ? `${firstName} +${completedReceipt.items.length - 1}`
              : firstName;
          void recordUserOrder(user.uid, {
            orderNumber: completedReceipt.orderNumber,
            totalThb: completedReceipt.totalUsd,
            itemCount: totalQty,
            summaryTitle,
            paymentMethod: completedReceipt.paymentMethod,
            paymentStatus: completedReceipt.paymentStatus,
            ...(completedReceipt.paymentStatus === 'paid' ? { paidAtMs: Date.now() } : {}),
            paymentReference: completedReceipt.paymentReference,
          }).catch(() => {});
        }
      }
    },
    [cookiePrefs.savedHistory, totalSoldCount, user],
  );

  const handleSelectHistoryItem = useCallback((entry: SavedHistoryItem) => {
    if (entry.itemType === 'bath-bomb') {
      setCatalogMode('bath-bombs');
      setActiveBombNutritionId(entry.itemId);
    } else if (entry.itemType === 'soap') {
      setCatalogMode('soaps');
      setPodiumSoapId(entry.itemId);
    }
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      await signInWithGooglePopup();
    } catch {
      // User closed popup or popup blocked
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutAccount();
    } catch {
      // Ignore sign out issues
    }
  }, []);

  const handleClearHistory = useCallback(async () => {
    if (user) {
      try {
        await clearUserHistory(user.uid);
      } catch {
        // Ignore error cleanly
      }
    }
    if (activeLocalAccount) {
      clearLocalAccountHistory(activeLocalAccount.accountId);
      setLocalHistory([]);
    }
  }, [activeLocalAccount, user]);

  const handleConnectLocalAccount = useCallback(
    (displayName: string, email: string) => {
      const connected = upsertLocalAccount({ email, displayName }, true);
      refreshLocalAccountState(connected);
    },
    [refreshLocalAccountState],
  );

  const handleSwitchLocalAccount = useCallback(
    (accountId: string) => {
      const switched = switchActiveLocalAccount(accountId);
      refreshLocalAccountState(switched);
    },
    [refreshLocalAccountState],
  );

  const handleDisconnectLocalAccount = useCallback(() => {
    signOutLocalAccount();
    refreshLocalAccountState(null);
  }, [refreshLocalAccountState]);

  const mergedHistory = useMemo(() => {
    const byId = new Map<string, SavedHistoryItem>();
    for (const item of [...savedHistory, ...localHistory]) {
      const prev = byId.get(item.entryId);
      if (!prev || item.viewedAtMs > prev.viewedAtMs) {
        byId.set(item.entryId, item);
      }
    }
    return Array.from(byId.values()).sort((a, b) => b.viewedAtMs - a.viewedAtMs);
  }, [localHistory, savedHistory]);

  const mergedOrderItems = useMemo(() => {
    const byOrderNumber = new Map<string, AtelierOrderRecord>();
    for (const ord of localOrders) {
      byOrderNumber.set(ord.orderNumber, ord);
    }
    for (const s of savedOrders) {
      const existing = byOrderNumber.get(s.orderNumber);
      if (existing) {
        byOrderNumber.set(s.orderNumber, {
          ...existing,
          status: s.status ?? existing.status,
          paymentStatus: s.paymentStatus ?? existing.paymentStatus,
          paidAtMs: s.paidAtMs ?? existing.paidAtMs,
          paymentReference: s.paymentReference ?? existing.paymentReference,
          trackingCode: s.trackingCode ?? existing.trackingCode,
          carrier: s.carrier ?? existing.carrier,
          updatedAtMs: Math.max(existing.updatedAtMs, s.createdAtMs),
        });
      } else {
        byOrderNumber.set(s.orderNumber, {
          orderNumber: s.orderNumber,
          accountId: activeLocalAccount?.accountId,
          customerUid: user?.uid,
          customerName: user?.displayName || activeLocalAccount?.displayName || 'Maison Collector',
          customerEmail: user?.email || activeLocalAccount?.email || '',
          shippingAddress: activeLocalAccount?.defaultAddress || '',
          paymentMethod: s.paymentMethod,
          paymentStatus: s.paymentStatus ?? 'paid',
          paidAtMs: s.paidAtMs,
          paymentReference: s.paymentReference,
          trackingCode: s.trackingCode,
          carrier: s.carrier,
          items: [
            {
              cartKey: s.orderNumber,
              editionId: s.orderNumber,
              name: s.summaryTitle,
              scentName: `${s.itemCount} items`,
              priceUsd: s.totalThb,
              quantity: 1,
            },
          ],
          subtotalThb: s.totalThb,
          shippingThb: 0,
          totalThb: s.totalThb,
          status: s.status ?? 'queued',
          completedSteps: [],
          createdAtMs: s.createdAtMs,
          updatedAtMs: s.createdAtMs,
          source: 'firestore',
        });
      }
    }
    return Array.from(byOrderNumber.values()).sort((a, b) => b.createdAtMs - a.createdAtMs);
  }, [activeLocalAccount, localOrders, savedOrders, user]);

  const handleRefreshOrderTracking = useCallback(async () => {
    const fallbackEmail = activeLocalAccount?.email || user?.email || '';
    const targets = mergedOrderItems.slice(0, 8).filter((o) => o.customerEmail || fallbackEmail);
    if (targets.length === 0) return;

    const updates = await Promise.all(
      targets.map(async (ord) => {
        const tracking = await fetchLiveOrderTracking(
          ord.orderNumber,
          ord.customerEmail || fallbackEmail,
        );
        return tracking ? { orderNumber: ord.orderNumber, tracking } : null;
      }),
    );

    const updateMap = new Map(
      updates
        .filter((u): u is NonNullable<typeof u> => Boolean(u))
        .map((u) => [u.orderNumber, u.tracking]),
    );
    if (updateMap.size === 0) return;

    const currentLocal = loadLocalAtelierOrders();
    const updatedLocal = currentLocal.map((ord) => {
      const patch = updateMap.get(ord.orderNumber);
      return patch ? { ...ord, ...patch } : ord;
    });
    saveLocalAtelierOrders(updatedLocal);
    refreshLocalAccountState();
  }, [activeLocalAccount, mergedOrderItems, refreshLocalAccountState, user]);

  const handleSaveCookiePrefs = useCallback(
    (next: { savedHistory: boolean; adCookies: boolean }) => {
      setCookiePrefs(persistCookiePreferences(next));
    },
    [],
  );

  const highlightRecentItem = useCallback((cartKey: string) => {
    setRecentAddedKey(cartKey);
    window.setTimeout(() => {
      setRecentAddedKey((curr) => (curr === cartKey ? null : curr));
    }, 1100);
  }, []);

  const handleAddSoapToBag = useCallback(
    (soap: SoapCreation, quantity: number, sizeOrSlice: boolean | SoapSizeTier) => {
      const sizeTier: SoapSizeTier =
        typeof sizeOrSlice === 'boolean' ? (sizeOrSlice ? 'small' : 'full') : sizeOrSlice;
      const cartKey = sizeTier === 'full' ? soap.id : `${soap.id}__${sizeTier}`;
      const unitPrice =
        sizeTier === 'small'
          ? soap.slice100gUsd
          : sizeTier === 'mega'
            ? soap.hugeBlockThb ?? SOAP_PRICE_TIERS.mega
            : soap.priceUsd;
      const sizeLabel =
        sizeTier === 'small'
          ? t.sizeSmall
          : sizeTier === 'mega'
            ? t.sizeMega
            : t.sizeFull;
      const display = getSoapDisplay(soap);

      setBagItems((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: soap.id,
            name: `${display.name} (${sizeLabel})`,
            scentName: `${display.scentMood} · ${display.inlayLabel}`,
            priceUsd: unitPrice,
            quantity,
            imageUrl: soap.imageUrl,
            fallbackGradient: soap.fallbackGradient,
          },
        ];
      });

      highlightRecentItem(cartKey);
    },
    [getSoapDisplay, highlightRecentItem, t.sizeFull, t.sizeMega, t.sizeSmall],
  );

  const handleAddBombToBag = useCallback(
    (bomb: BathBombCreation, quantity: number, packTier: BathBombPackTier) => {
      const cartKey = packTier === 'single' ? bomb.id : `${bomb.id}__${packTier}`;
      const unitPrice = BATH_BOMB_PRICE_TIERS[packTier];
      const packLabel =
        packTier === 'single'
          ? t.bathSinglePack
          : packTier === 'duo'
            ? t.bathDuoPack
            : t.bathCofferPack;
      const bombName = lang === 'th' ? bomb.nameTh : bomb.nameEn;
      const waterHueName = lang === 'th' ? bomb.waterHueNameTh : bomb.waterHueNameEn;
      const soakMood = lang === 'th' ? bomb.soakMoodTh : bomb.soakMoodEn;

      setBagItems((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: bomb.id,
            name: `${bombName} (${packLabel})`,
            scentName: `${waterHueName} · ${soakMood}`,
            priceUsd: unitPrice,
            quantity,
            imageUrl: bomb.imageUrl,
            fallbackGradient: bomb.fallbackGradient,
          },
        ];
      });

      highlightRecentItem(cartKey);
    },
    [highlightRecentItem, lang, t.bathCofferPack, t.bathDuoPack, t.bathSinglePack],
  );

  const handleAddGiftSetToBag = useCallback(
    (
      giftSet: MarbleCassetteEdition,
      ribbonFinish: string,
      giftNote: string,
      imageUrl: string,
    ) => {
      const normalizedNote = giftNote.trim();
      const cartKey = `${giftSet.id}__${ribbonFinish}__${normalizedNote || 'none'}`;
      const caseDisplay = getCaseDisplay(giftSet);
      setBagItems((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: giftSet.id,
            name: caseDisplay.name,
            scentName: ribbonFinish,
            priceUsd: giftSet.priceUsd,
            quantity: 1,
            imageUrl,
            fallbackGradient: 'from-[#F1E6D6] via-[#E5D3BD] to-[#C69C60]',
            giftNote: normalizedNote || undefined,
          },
        ];
      });

      highlightRecentItem(cartKey);
    },
    [getCaseDisplay, highlightRecentItem],
  );

  const handleAddBathBombCaseToBag = useCallback(
    (
      bombCase: BathBombMarbleCaseEdition,
      ribbonFinish: string,
      giftNote: string,
      imageUrl: string,
    ) => {
      const normalizedNote = giftNote.trim();
      const cartKey = `${bombCase.id}__${ribbonFinish}__${normalizedNote || 'none'}`;
      const caseTitle = lang === 'th' ? bombCase.titleTh : bombCase.titleEn;

      setBagItems((prev) => {
        const existing = prev.find((item) => item.cartKey === cartKey);
        if (existing) {
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: bombCase.id,
            name: caseTitle,
            scentName: ribbonFinish,
            priceUsd: bombCase.priceThb,
            quantity: 1,
            imageUrl,
            fallbackGradient: 'from-[#F1E6D6] via-[#E5D3BD] to-[#C69C60]',
            giftNote: normalizedNote || undefined,
          },
        ];
      });

      highlightRecentItem(cartKey);
    },
    [highlightRecentItem, lang],
  );

  const handleAddVaultToBag = useCallback(
    (item: VaultPairedFormulation, variant: 'bar' | 'bomb' | 'pair') => {
      const cartKey = `${item.id}__${variant}`;
      const unitPrice =
        variant === 'bar'
          ? VAULT_PRICING.barThb
          : variant === 'bomb'
            ? VAULT_PRICING.bombThb
            : VAULT_PRICING.pairedDuoThb;
      const itemLabel =
        variant === 'bar'
          ? `${item.brandName} · ${item.shortBarStamp}`
          : variant === 'bomb'
            ? `${item.brandName} · ${item.shortBombStamp}`
            : `${item.brandName} · Paired Duo (${item.shortBarStamp} + ${item.shortBombStamp})`;
      const emotionalNote = lang === 'th' ? item.emotionalTeaseTh : item.emotionalTeaseEn;
      const goldCoreNote = `${item.goldLeafTone === 'pink-gold' ? t.vaultPinkGoldTag : t.vaultYellowGoldTag} · ${
        item.crystalFinish === 'salt-crystals' ? t.vaultSaltCrystalTag : t.vaultCarvedGrooveTag
      }`;
      const scentLabel = `${emotionalNote} · ${goldCoreNote} · ${
        variant === 'bar' ? item.soapName : variant === 'bomb' ? item.bombName : `${item.soapName} + ${item.bombName}`
      }`;

      setBagItems((prev) => {
        const existing = prev.find((bagItem) => bagItem.cartKey === cartKey);
        if (existing) {
          return prev.map((bagItem) =>
            bagItem.cartKey === cartKey ? { ...bagItem, quantity: bagItem.quantity + 1 } : bagItem,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: item.id,
            name: itemLabel,
            scentName: scentLabel,
            priceUsd: unitPrice,
            quantity: 1,
            imageUrl: item.imageUrl,
            fallbackGradient: 'from-[#FAF2EA] via-[#EFE0D3] to-[#C8A890]',
          },
        ];
      });

      if (cookiePrefs.savedHistory) {
        const historyPayload = {
          itemId: item.id,
          itemType: variant === 'bomb' ? ('bath-bomb' as const) : ('soap' as const),
          title: itemLabel,
          subtitle: `${emotionalNote} · ${goldCoreNote}`,
          imageUrl: item.imageUrl.slice(0, 480),
          priceThb: unitPrice,
        };
        if (user) {
          void recordUserHistory(user.uid, historyPayload).catch(() => {});
        }
        if (activeLocalAccount) {
          setLocalHistory(recordLocalAccountHistory(activeLocalAccount.accountId, historyPayload));
        }
      }

      highlightRecentItem(cartKey);
    },
    [
      activeLocalAccount,
      cookiePrefs.savedHistory,
      highlightRecentItem,
      lang,
      t.vaultCarvedGrooveTag,
      t.vaultPinkGoldTag,
      t.vaultSaltCrystalTag,
      t.vaultYellowGoldTag,
      user,
    ],
  );

  const handleAddVaultMarbleBoxToBag = useCallback(
    (box: VaultMarbleBoxEdition, ribbonAndLoofahs: string, engravingNote: string) => {
      const normalizedNote = engravingNote.trim();
      const cartKey = `${box.id}__${ribbonAndLoofahs}__${normalizedNote || 'none'}`;
      const boxTitle = lang === 'th' ? box.titleTh : box.titleEn;

      setBagItems((prev) => {
        const existing = prev.find((bagItem) => bagItem.cartKey === cartKey);
        if (existing) {
          return prev.map((bagItem) =>
            bagItem.cartKey === cartKey ? { ...bagItem, quantity: bagItem.quantity + 1 } : bagItem,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            editionId: box.id,
            name: boxTitle,
            scentName: ribbonAndLoofahs,
            priceUsd: box.priceThb,
            quantity: 1,
            imageUrl: box.imageUrl,
            fallbackGradient: 'from-[#F1E6D6] via-[#E5D3BD] to-[#C69C60]',
            giftNote: normalizedNote || undefined,
          },
        ];
      });

      if (cookiePrefs.savedHistory) {
        const historyPayload = {
          itemId: box.id,
          itemType: 'marble-case' as const,
          title: boxTitle.slice(0, 150),
          subtitle: ribbonAndLoofahs.slice(0, 190),
          imageUrl: box.imageUrl.slice(0, 480),
          priceThb: box.priceThb,
        };
        if (user) {
          void recordUserHistory(user.uid, historyPayload).catch(() => {});
        }
        if (activeLocalAccount) {
          setLocalHistory(recordLocalAccountHistory(activeLocalAccount.accountId, historyPayload));
        }
      }

      highlightRecentItem(cartKey);
    },
    [activeLocalAccount, cookiePrefs.savedHistory, highlightRecentItem, lang, user],
  );

  const handleUpdateBagQuantity = (cartKey: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveBagItem = (cartKey: string) => {
    setBagItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-clip flex flex-col bg-transparent text-[var(--ink)] transition-colors duration-300">
        {/* Global Ambient Sky Layer + Per-Tab Floral Wallpapers + Gentle Sable Bubbles */}
        <StarfallNightAtmosphere preset={activePreset} catalogMode={catalogMode} />
        <FloatingSoapBubblesOverlay />

        {/* Clean 3-Zone Sticky Header (un-pins on ultra-short landscape phones to preserve viewport height) */}
        <header className="atelier-sticky-header z-40 border-b border-[var(--border)] bg-[var(--canvas)]/84 backdrop-blur-md transition-colors duration-300">
          <div className="atelier-container h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
            <a
              href="#hero"
              className="inline-flex items-center gap-2 sm:gap-2.5 text-[var(--ink)] whitespace-nowrap shrink-0"
            >
              <RedesignedLogoMotif variant="original-3d" size={36} className="shrink-0" />
              <BrandWordmark
                className="text-lg sm:text-xl lg:text-2xl font-medium text-[var(--ink)]"
                accentHex={accentHex}
              />
            </a>

            <nav
              aria-label="Primary sections"
              className={`hidden lg:flex items-center lg:gap-7 xl:gap-9 text-sm font-medium text-[var(--muted)] transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLangTransitioning ? 'opacity-20' : 'opacity-100'}`}
            >
              <a
                href="#collection"
                onClick={() => triggerRevealSection('collection')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {lang === 'th' ? 'คอลเลกชัน' : 'Collections'}
              </a>
              <a
                href="#gifting"
                onClick={() => triggerRevealSection('gifting')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navCases}
              </a>
              <a
                href="#atelier"
                onClick={() => triggerRevealSection('atelier')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navStory}
              </a>
              <a
                href="#reviews"
                onClick={() => triggerRevealSection('reviews')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navReviews}
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Saved History / Local Accounts / Google Account Sign-In Trigger */}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/30 text-[11px] font-medium text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
              >
                {user || activeLocalAccount ? (
                  <>
                    <History className="w-3.5 h-3.5" style={{ color: accentHex }} />
                    <span className="hidden sm:inline max-w-[110px] truncate">
                      {user ? t.historyBtn : activeLocalAccount?.displayName || t.historyBtn}
                    </span>
                    {mergedOrderItems.length > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tabular-figures"
                        style={{ backgroundColor: accentHex, color: accentTextHex }}
                      >
                        {mergedOrderItems.length}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" style={{ color: accentHex }} />
                    <span className="hidden sm:inline">{t.signInBtn}</span>
                  </>
                )}
              </button>

              {/* Settings Wheel Dropdown: Palettes, Acoustic Tunes, Languages & TV Showroom Mode */}
              <SettingsGearMenu
                presetId={presetId}
                activePreset={activePreset}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                musicStyle={musicStyle}
                isAmbienceOn={isAmbienceOn}
                isTvMode={isTvMode}
                isAutoTvDetected={isAutoTvDetected}
                onSelectPreset={handleSelectPreset}
                onChangeMusicStyle={handleChangeMusicStyle}
                onToggleAmbience={handleToggleAmbience}
                onToggleTvMode={handleToggleTvMode}
              />

              <button
                type="button"
                onClick={handleOpenBagDrawer}
                className="luxury-3d-pill px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0 tabular-figures inline-flex items-center gap-2"
                style={{
                  backgroundColor: accentHex,
                  color: accentTextHex,
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>
                  {t.bagBtn} ({totalBagCount})
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Balanced 1440px Editorial Gallery with smooth faded language transition */}
        <main
          className={`relative z-10 flex-1 min-w-0 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLangTransitioning ? 'opacity-15' : 'opacity-100'}`}
          style={{ willChange: isLangTransitioning ? 'opacity' : 'auto' }}
        >
          {/* Clean Single-Row Collection Mode Bar with Topic-Matched Hover Preview */}
          <div
            onMouseLeave={handleScheduleClearHover}
            className="relative z-30 border-b border-[var(--border)] bg-[var(--canvas)]/72 backdrop-blur-md"
          >
            <div className="atelier-container py-2 flex items-center justify-center">
              <div
                role="tablist"
                aria-label="Collection Mode"
                className="no-scrollbar inline-flex items-center gap-1 overflow-x-auto max-w-full whitespace-nowrap snap-x py-0.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'soaps'}
                  onMouseEnter={() => handleTabMouseEnter('soaps')}
                  onFocus={() => handleTabMouseEnter('soaps')}
                  onClick={() => handleSelectCatalogMode('soaps')}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[36px] sm:min-h-0 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                  style={{
                    backgroundColor: catalogMode === 'soaps' ? accentHex : 'transparent',
                    color: catalogMode === 'soaps' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.modeSoapsBtn}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'bath-bombs'}
                  onMouseEnter={() => handleTabMouseEnter('bath-bombs')}
                  onFocus={() => handleTabMouseEnter('bath-bombs')}
                  onClick={() => handleSelectCatalogMode('bath-bombs')}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[36px] sm:min-h-0 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                  style={{
                    backgroundColor: catalogMode === 'bath-bombs' ? accentHex : 'transparent',
                    color: catalogMode === 'bath-bombs' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <ScrollText className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.modeBathBombsBtn}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'fruit-duos'}
                  onMouseEnter={() => handleTabMouseEnter('fruit-duos')}
                  onFocus={() => handleTabMouseEnter('fruit-duos')}
                  onClick={() => handleSelectCatalogMode('fruit-duos')}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[36px] sm:min-h-0 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                  style={{
                    backgroundColor: catalogMode === 'fruit-duos' ? accentHex : 'transparent',
                    color: catalogMode === 'fruit-duos' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.modeFruitDuosBtn}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'category-2'}
                  onMouseEnter={() => handleTabMouseEnter('category-2')}
                  onFocus={() => handleTabMouseEnter('category-2')}
                  onClick={() => handleSelectCatalogMode('category-2')}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[36px] sm:min-h-0 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                  style={{
                    backgroundColor: catalogMode === 'category-2' ? accentHex : 'transparent',
                    color: catalogMode === 'category-2' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.modeCategoryTwoBtn}</span>
                </button>

                <span aria-hidden="true" className="h-3.5 w-px bg-[var(--border)] mx-1 shrink-0" />

                {ART_ERAS.map((era) => {
                  const selected = catalogMode === era.id;
                  const eraBtnLabel = getEraBtnLabel(era.id);
                  return (
                    <button
                      key={era.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onMouseEnter={() => handleTabMouseEnter(era.id)}
                      onFocus={() => handleTabMouseEnter(era.id)}
                      onClick={() => handleSelectCatalogMode(era.id)}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 min-h-[36px] sm:min-h-0 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 snap-start"
                      style={{
                        backgroundColor: selected ? accentHex : 'transparent',
                        color: selected ? accentTextHex : 'var(--muted)',
                      }}
                    >
                      <span>{eraBtnLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <CategoryHoverPreview
              hoveredTab={hoveredTab}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              onMouseEnterPreview={handleCancelClearHover}
              onMouseLeavePreview={handleScheduleClearHover}
              onInspectSoap={(soapId) => {
                setHoveredTab(null);
                handleOpenPodium(soapId);
              }}
              onOpenFruitDuosTab={() => {
                setHoveredTab(null);
                handleSelectCatalogMode('fruit-duos');
                triggerRevealSection('#collection');
              }}
            />
          </div>

          {/* HERO SECTION */}
          <section
            id="hero"
            className="relative border-b border-[var(--border)] bg-transparent overflow-hidden"
          >
            <div className="atelier-container py-5 sm:py-7 lg:py-9">
              <div className="hero-landscape-grid grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
                {/* Editorial Spotlight Card across full width for balanced proportions above the 3-card Top Sellers shelf */}
                <div className="hero-landscape-col-copy md:col-span-12">
                  <motion.div
                    key={catalogMode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-landscape-card luxury-3d-card p-5 sm:p-6 lg:p-8 bg-[var(--surface-card)]/94 backdrop-blur-md flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <p
                        className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: accentHex }}
                      >
                        {activeEraMeta
                          ? lang === 'th'
                            ? activeEraMeta.periodTagTh
                            : activeEraMeta.periodTagEn
                          : catalogMode === 'fruit-duos'
                            ? t.fruitDuosEyebrow
                            : catalogMode === 'category-2'
                              ? t.categoryTwoEyebrow
                              : t.heroAtelierLabel}
                      </p>

                      <div className="space-y-2.5">
                        <h1 className="marshmallow-text font-serif fluid-hero-display tracking-tight text-[var(--ink)]">
                          <span className="block">
                            {activeEraMeta
                              ? lang === 'th'
                                ? activeEraMeta.heroLine1Th
                                : activeEraMeta.heroLine1En
                              : catalogMode === 'bath-bombs'
                                ? t.bathHeroLine1
                                : catalogMode === 'fruit-duos'
                                  ? t.fruitDuosHeading
                                  : catalogMode === 'category-2'
                                    ? t.categoryTwoHeading
                                    : t.heroLine1}
                          </span>
                          <span className="block mt-1 rainbow-sparkle-text">
                            {activeEraMeta
                              ? lang === 'th'
                                ? activeEraMeta.heroLine2Th
                                : activeEraMeta.heroLine2En
                              : catalogMode === 'bath-bombs'
                                ? t.bathHeroLine2
                                : catalogMode === 'fruit-duos'
                                  ? lang === 'th'
                                    ? 'มะม่วง · สตรอว์เบอร์รี · เกลือแร่ทะเลเดดซี'
                                    : 'Mango · Strawberry · Sea Mineral'
                                  : catalogMode === 'category-2'
                                    ? lang === 'th'
                                      ? 'สบู่ก้อน & บาธบอมบ์ครบชุด'
                                      : 'Complete Soaps & Bath Bombs'
                                    : t.heroLine2}
                          </span>
                        </h1>
                        <p className="fluid-lead-copy text-[var(--muted)] max-w-xl">
                          {activeEraMeta
                            ? lang === 'th'
                              ? activeEraMeta.heroSummaryTh
                              : activeEraMeta.heroSummaryEn
                            : catalogMode === 'bath-bombs'
                              ? t.bathHeroSummary
                              : catalogMode === 'fruit-duos'
                                ? t.fruitDuosSub
                                : catalogMode === 'category-2'
                                  ? t.categoryTwoSub
                                  : t.heroSummary}
                        </p>
                      </div>
                    </div>

                    {/* Primary & Secondary Editorial Actions */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <a
                        href={activeEraMeta ? '#secret-vault' : '#collection'}
                        onClick={() =>
                          triggerRevealSection(activeEraMeta ? '#secret-vault' : '#collection')
                        }
                        className="luxury-3d-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
                        style={{ backgroundColor: accentHex, color: accentTextHex }}
                      >
                        <span>
                          {activeEraMeta
                            ? t.vaultExploreEraBtn
                            : catalogMode === 'bath-bombs'
                              ? t.bathExploreBtn
                              : catalogMode === 'fruit-duos'
                                ? t.modeFruitDuosBtn
                                : catalogMode === 'category-2'
                                  ? t.modeCategoryTwoBtn
                                  : t.explore30}
                        </span>
                        <ArrowDownRight className="w-4 h-4" />
                      </a>

                      {activeEraMeta ? (
                        <a
                          href="#vault-marble-boxes"
                          onClick={() => triggerRevealSection('#secret-vault')}
                          className="luxury-3d-pill inline-flex items-center px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                        >
                          {t.vaultEraCoffretEyebrow.split('·')[0].trim()}
                        </a>
                      ) : catalogMode === 'soaps' ? (
                        <a
                          href="#gifting"
                          onClick={() => triggerRevealSection('#gifting')}
                          className="luxury-3d-pill inline-flex items-center px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                        >
                          {t.casesCta}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBombNutrition('bb-bright-white-wine')}
                          className="luxury-3d-pill inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <ScrollText className="w-3.5 h-3.5" style={{ color: accentHex }} />
                          <span>{t.bathNutritionBtn}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Full-Width 3-Card Top Bestsellers Shelf across tablet & desktop */}
                <div className="hero-landscape-col-carousel md:col-span-12">
                  <HeroTopSellerCarousel
                    mode={catalogMode}
                    primarySpotlightId={heroSpotlightSoap.id}
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    wishlistIds={wishlistIds}
                    itemSoldDeltas={itemSoldDeltas}
                    totalSold={totalSoldCount}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenPodium={handleOpenPodium}
                    onOpenBombNutrition={handleOpenBombNutrition}
                    onZoomImage={setZoomTarget}
                    onInspectVaultPair={(pair) => {
                      setHeroInspectedVaultPair(pair);
                      triggerRevealSection('#secret-vault');
                    }}
                    onAddSoapToBag={handleAddSoapToBag}
                    onAddBombToBag={handleAddBombToBag}
                    onAddVaultToBag={handleAddVaultToBag}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* TV DISPLAY SHOWROOM BANNER */}
          {isTvMode && (
            <section className="relative z-10 border-b border-[var(--border)] bg-[var(--surface-card)]/90 backdrop-blur-md">
              <div className="atelier-container py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Monitor className="w-4 h-4 shrink-0" style={{ color: accentHex }} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--ink)] truncate">
                      {t.tvModeBannerTitle}
                    </p>
                    <p className="text-[11px] text-[var(--muted)] truncate">
                      {t.tvModeBannerSubtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleTvMode}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--ink)] hover:border-[var(--ink)]/35 cursor-pointer shrink-0"
                >
                  {t.tvModeToggleLabel}
                </button>
              </div>
            </section>
          )}

          {/* SECTION 2: TV Panoramic Showroom OR 6-Set Featured Category / Fruit Duos / Category 2 / Art Era */}
          {isTvMode ? (
            <div className="space-y-0">
              <Suspense fallback={null}>
                <TopTenDuosSection
                  isTvMode
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  wishlistIds={wishlistIds}
                  itemSoldDeltas={itemSoldDeltas}
                  activeLineFilter={activeLineFilter}
                  onChangeLineFilter={setActiveLineFilter}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenPodium={handleOpenPodium}
                  onOpenBombNutrition={handleOpenBombNutrition}
                  onZoomImage={setZoomTarget}
                  onAddToBag={handleAddSoapToBag}
                  onAddMarbleSuiteToBag={handleAddGiftSetToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <GiftSetsSection
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  onOpenPodium={handleOpenPodium}
                  onZoomImage={setZoomTarget}
                  onAddGiftSetToBag={handleAddGiftSetToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <LuxuryFruitDuosSection
                  isTvMode
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  wishlistIds={wishlistIds}
                  itemSoldDeltas={itemSoldDeltas}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenPodium={handleOpenPodium}
                  onZoomImage={setZoomTarget}
                  onOpenBombNutrition={handleOpenBombNutrition}
                  onAddToBag={handleAddSoapToBag}
                  onAddMarbleSuiteToBag={handleAddGiftSetToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <BathBombsSection
                  isTvMode
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  wishlistIds={wishlistIds}
                  itemSoldDeltas={itemSoldDeltas}
                  activeLineFilter={activeLineFilter}
                  onChangeLineFilter={setActiveLineFilter}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenNutritionModal={handleOpenBombNutrition}
                  onZoomImage={setZoomTarget}
                  onAddBombToBag={handleAddBombToBag}
                  onAddBombMarbleSuiteToBag={handleAddBathBombCaseToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <BathBombMarbleCasesSection
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  onOpenNutritionModal={handleOpenBombNutrition}
                  onZoomImage={setZoomTarget}
                  onAddBombCaseToBag={handleAddBathBombCaseToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <CategoryTwoArchiveSection
                  isTvMode
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  wishlistIds={wishlistIds}
                  itemSoldDeltas={itemSoldDeltas}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenPodium={handleOpenPodium}
                  onOpenBombNutrition={handleOpenBombNutrition}
                  onZoomImage={setZoomTarget}
                  onAddSoapToBag={handleAddSoapToBag}
                  onAddBombToBag={handleAddBombToBag}
                  onAddMarbleSuiteToBag={handleAddGiftSetToBag}
                />
              </Suspense>
              <Suspense fallback={null}>
                <SecretVaultSection
                  isTvMode
                  activeEra={isEraMode ? catalogMode : 'medieval'}
                  user={user}
                  accentHex={accentHex}
                  accentTextHex={accentTextHex}
                  wishlistIds={wishlistIds}
                  itemSoldDeltas={itemSoldDeltas}
                  externalInspectedPair={heroInspectedVaultPair}
                  onClearExternalInspectedPair={() => setHeroInspectedVaultPair(null)}
                  onSelectEra={(era) => handleSelectCatalogMode(era)}
                  onSignIn={handleSignIn}
                  onToggleWishlist={handleToggleWishlist}
                  onZoomImage={setZoomTarget}
                  onAddVaultToBag={handleAddVaultToBag}
                  onAddVaultMarbleBoxToBag={handleAddVaultMarbleBoxToBag}
                />
              </Suspense>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {catalogMode === 'soaps' ? (
                <motion.div
                  key="mode-soaps"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="collection">
                    <TopTenDuosSection
                      isTvMode={false}
                      accentHex={accentHex}
                      accentTextHex={accentTextHex}
                      wishlistIds={wishlistIds}
                      itemSoldDeltas={itemSoldDeltas}
                      activeLineFilter={activeLineFilter}
                      onChangeLineFilter={setActiveLineFilter}
                      onOpenCategoryTwo={() => {
                        handleSelectCatalogMode('category-2');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenPodium={handleOpenPodium}
                      onOpenBombNutrition={handleOpenBombNutrition}
                      onZoomImage={setZoomTarget}
                      onAddToBag={handleAddSoapToBag}
                    />
                  </div>

                  <LazyGallerySection id="gifting" minHeightClass="min-h-[540px]" rootMargin="420px 0px">
                    <GiftSetsSection
                      accentHex={accentHex}
                      accentTextHex={accentTextHex}
                      onOpenPodium={handleOpenPodium}
                      onZoomImage={setZoomTarget}
                      onAddGiftSetToBag={handleAddGiftSetToBag}
                    />
                  </LazyGallerySection>
                </motion.div>
              ) : catalogMode === 'bath-bombs' ? (
                <motion.div
                  key="mode-bath-bombs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="collection">
                    <BathBombsSection
                      isTvMode={false}
                      accentHex={accentHex}
                      accentTextHex={accentTextHex}
                      wishlistIds={wishlistIds}
                      itemSoldDeltas={itemSoldDeltas}
                      activeLineFilter={activeLineFilter}
                      onChangeLineFilter={setActiveLineFilter}
                      onOpenCategoryTwo={() => {
                        handleSelectCatalogMode('category-2');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenNutritionModal={handleOpenBombNutrition}
                      onZoomImage={setZoomTarget}
                      onAddBombToBag={handleAddBombToBag}
                    />
                  </div>

                  <LazyGallerySection id="gifting" minHeightClass="min-h-[540px]" rootMargin="420px 0px">
                    <BathBombMarbleCasesSection
                      accentHex={accentHex}
                      accentTextHex={accentTextHex}
                      onOpenNutritionModal={handleOpenBombNutrition}
                      onZoomImage={setZoomTarget}
                      onAddBombCaseToBag={handleAddBathBombCaseToBag}
                    />
                  </LazyGallerySection>
                </motion.div>
              ) : catalogMode === 'fruit-duos' ? (
                <motion.div
                  key="mode-fruit-duos"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="collection">
                    <Suspense fallback={null}>
                      <LuxuryFruitDuosSection
                        isTvMode={false}
                        accentHex={accentHex}
                        accentTextHex={accentTextHex}
                        wishlistIds={wishlistIds}
                        itemSoldDeltas={itemSoldDeltas}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenPodium={handleOpenPodium}
                        onZoomImage={setZoomTarget}
                        onOpenBombNutrition={handleOpenBombNutrition}
                        onAddToBag={handleAddSoapToBag}
                        onAddMarbleSuiteToBag={handleAddGiftSetToBag}
                      />
                    </Suspense>
                  </div>

                  <LazyGallerySection id="gifting" minHeightClass="min-h-[540px]" rootMargin="420px 0px">
                    <GiftSetsSection
                      accentHex={accentHex}
                      accentTextHex={accentTextHex}
                      onOpenPodium={handleOpenPodium}
                      onZoomImage={setZoomTarget}
                      onAddGiftSetToBag={handleAddGiftSetToBag}
                    />
                  </LazyGallerySection>
                </motion.div>
              ) : catalogMode === 'category-2' ? (
                <motion.div
                  key="mode-category-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="collection">
                    <Suspense fallback={null}>
                      <CategoryTwoArchiveSection
                        isTvMode={false}
                        accentHex={accentHex}
                        accentTextHex={accentTextHex}
                        wishlistIds={wishlistIds}
                        itemSoldDeltas={itemSoldDeltas}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenPodium={handleOpenPodium}
                        onOpenBombNutrition={handleOpenBombNutrition}
                        onZoomImage={setZoomTarget}
                        onAddSoapToBag={handleAddSoapToBag}
                        onAddBombToBag={handleAddBombToBag}
                        onAddMarbleSuiteToBag={handleAddGiftSetToBag}
                      />
                    </Suspense>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`mode-era-${catalogMode}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div id="collection">
                    <Suspense fallback={null}>
                      <SecretVaultSection
                        isTvMode={false}
                        activeEra={catalogMode}
                        user={user}
                        accentHex={accentHex}
                        accentTextHex={accentTextHex}
                        wishlistIds={wishlistIds}
                        itemSoldDeltas={itemSoldDeltas}
                        externalInspectedPair={heroInspectedVaultPair}
                        onClearExternalInspectedPair={() => setHeroInspectedVaultPair(null)}
                        onSelectEra={(era) => handleSelectCatalogMode(era)}
                        onSignIn={handleSignIn}
                        onToggleWishlist={handleToggleWishlist}
                        onZoomImage={setZoomTarget}
                        onAddVaultToBag={handleAddVaultToBag}
                        onAddVaultMarbleBoxToBag={handleAddVaultMarbleBoxToBag}
                      />
                    </Suspense>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* SECTION 3: Instagram Tagged Social Proof Mentions */}
          <LazyGallerySection id="social-proof" minHeightClass="min-h-[340px]" rootMargin="440px 0px">
            <SocialProofSection accentHex={accentHex} accentTextHex={accentTextHex} />
          </LazyGallerySection>

          {/* SECTION 4: Maison Heritage, Founder Story & Custom Stamp */}
          <LazyGallerySection id="atelier" minHeightClass="min-h-[420px]" rootMargin="440px 0px">
            <VisionStorySection accentHex={accentHex} isTwilight={isTwilight} />
          </LazyGallerySection>

          {/* SECTION 5: Collector Voices */}
          <LazyGallerySection id="reviews" minHeightClass="min-h-[300px]" rootMargin="440px 0px">
            <ReviewsSection accentHex={accentHex} />
          </LazyGallerySection>

          {/* SECTION 6: Botanical Guide & Mailing List */}
          <LazyGallerySection id="botanical-guide" minHeightClass="min-h-[300px]" rootMargin="440px 0px">
            <SeoAtelierSection accentHex={accentHex} onSelectMode={handleSelectCatalogMode} />
          </LazyGallerySection>
          <MailingListBanner
            accentHex={accentHex}
            accentTextHex={accentTextHex}
            userEmail={user?.email}
            userUid={user?.uid}
            adCookiesAccepted={cookiePrefs.adCookies}
          />

          {/* Clean Maison Footer & Single Non-Duplicated Archival Correspondence Banner */}
          <footer className="relative z-10 border-t border-[var(--border)] bg-transparent py-8 sm:py-10">
            <div className="atelier-container space-y-5">
              {/* Unboxed Hairline Quick-Jump Footer Strip */}
              <div className="pb-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-medium text-[var(--muted)]">{t.originLocation}</span>

                <nav className="flex flex-wrap items-center gap-5 text-xs font-medium text-[var(--muted)]">
                  <a
                    href="#collection"
                    onClick={() => triggerRevealSection('collection')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {lang === 'th' ? 'คอลเลกชัน' : 'Collections'}
                  </a>
                  <a
                    href="#gifting"
                    onClick={() => triggerRevealSection('gifting')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.navCases}
                  </a>
                  <a
                    href="#social-proof"
                    onClick={() => triggerRevealSection('social-proof')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.scrollerTypeSocial}
                  </a>
                  <a
                    href="#atelier"
                    onClick={() => triggerRevealSection('atelier')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.navStory}
                  </a>
                  <a
                    href="#reviews"
                    onClick={() => triggerRevealSection('reviews')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.navReviews}
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(true)}
                    className="hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {user || activeLocalAccount ? t.historyBtn : t.signInBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCookieModalOpen(true)}
                    className="hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {t.cookieManageFooter}
                  </button>
                </nav>
              </div>

              {/* Clear 2-Column Archival Correspondence Banner (Blush Cameo & Victorian Filigree Adaptation) */}
              <div className="luxury-3d-card relative overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
                {/* Left Column: Blush Cameo Medallion + Lace Monogram 'A' Seal over Archival Parchment */}
                <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto md:min-h-[235px] overflow-hidden bg-[#F7ECE5] flex items-center justify-center p-5">
                  <ResilientImage
                    src={ATELIER_MEDIA.featherLetterBorderUrl}
                    alt="Official archival parchment stationery border with white ostrich feather quill and GentleBubble by AR seal"
                    fallbackTitle="GentleBubble by AR Correspondence"
                    className="absolute inset-0 w-full h-full object-cover opacity-55"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-[#FBF4EE]/75 via-[#F1DCD7]/55 to-[#E4C2B9]/65"
                  />

                  {/* Corner Rose-Gold Filigree Flourishes (adapted botanical filigree framing) */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 120"
                    className="pointer-events-none absolute top-2.5 left-2.5 w-11 h-11 text-[#B9896B]/65"
                    fill="none"
                  >
                    <path
                      d="M6 76 C6 34, 34 6, 76 6 M14 54 C16 26, 26 16, 54 14 M22 28 C30 22, 38 24, 42 30 C35 34, 28 32, 22 28 Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="14" cy="14" r="2.2" fill="#FFFDF9" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 120"
                    className="pointer-events-none absolute bottom-2.5 right-2.5 w-11 h-11 text-[#B9896B]/65 rotate-180"
                    fill="none"
                  >
                    <path
                      d="M6 76 C6 34, 34 6, 76 6 M14 54 C16 26, 26 16, 54 14 M22 28 C30 22, 38 24, 42 30 C35 34, 28 32, 22 28 Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="14" cy="14" r="2.2" fill="#FFFDF9" stroke="currentColor" strokeWidth="1" />
                  </svg>

                  {/* Beaded Oval Cameo Frame housing the Victorian Lace 'A' Crest for Archawee (AR) */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-full p-2.5 bg-gradient-to-b from-[#FAF3EB] via-[#F2D9D4] to-[#E6C3BC] shadow-[0_14px_30px_-10px_rgba(116,74,64,0.34),inset_0_2px_4px_rgba(255,255,255,0.9)] border-2 border-[#D4AD7D]">
                      {/* Subtle Dotted Bead Ring */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[3px] rounded-full border-[2.5px] border-dotted border-[#FFFDF8]/95"
                      />
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#FDF9F5] to-[#F6E6E2] border border-[#C99B72]/55 flex items-center justify-center p-3">
                        <img
                          src="/assets/aistudio/Victorian_Lace_Alphabet_Clipart_Printable__1__16758b81.jpg"
                          alt="Victorian lace and rose-gold filigree A monogram crest adapted for GentleBubble by AR"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain mix-blend-multiply scale-105"
                        />
                      </div>
                    </div>

                    {/* Blush Satin Cameo Bow Crest Label (Adapted for Maison AR) */}
                    <div className="-mt-3 relative z-20 inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-[#E9C1B8] via-[#F5DDD8] to-[#E9C1B8] border border-[#C99B72] shadow-sm text-[10.5px] font-serif italic font-semibold tracking-wider text-[#4C322B]">
                      <span>Maison A · R</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Archival Correspondence Dispatch framed with Ribbon & Rose Watermark */}
                <div className="md:col-span-7 relative p-5 sm:p-7 bg-[var(--surface-card)] flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-[var(--border)] overflow-hidden">
                  <img
                    src="/assets/aistudio/802485227409076504_6ba34077.jpg"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none select-none absolute -right-4 -bottom-4 w-44 h-44 object-contain opacity-[0.12] mix-blend-multiply dark:mix-blend-soft-light"
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 80 80"
                    className="pointer-events-none absolute top-3 right-3 w-8 h-8 text-[#C59876]/45"
                    fill="none"
                  >
                    <path
                      d="M72 48 C72 22, 58 8, 32 8 M62 34 C60 18, 52 14, 42 12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <circle cx="64" cy="16" r="1.8" fill="currentColor" />
                  </svg>

                  <div className="space-y-2 pr-6">
                    <p
                      className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                      style={{ color: accentHex }}
                    >
                      {t.footerDispatchTag}
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-[var(--ink)] leading-snug balance-text">
                      {t.footerBannerTitle}
                    </h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
                      {t.footerBannerDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                      <Feather className="w-3.5 h-3.5" style={{ color: accentHex }} />
                      <BrandWordmark className="text-sm font-medium text-[var(--ink)]" accentHex={accentHex} />
                    </span>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)]/80"
                        aria-label="Savonnerie Artisanale Signature"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-flex h-3 w-4 rounded-[2px] overflow-hidden border border-[var(--border)] shrink-0"
                        >
                          <span className="w-1/3 h-full bg-[#F5EBE0]" />
                          <span className="w-1/3 h-full bg-[#DFB4AC]" />
                          <span className="w-1/3 h-full bg-[#92735F]" />
                        </span>
                        <span className="font-serif italic text-[11.5px] text-[var(--ink)]">
                          {t.frenchMotto}
                        </span>
                      </span>
                      <span className="font-serif italic text-xs tracking-wide" style={{ color: accentHex }}>
                        {t.frenchTag}
                      </span>
                    </div>

                    <span className="font-cursive text-lg text-[var(--ink)]">
                      {t.cursiveTagline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* Quiet Slide-Over Concierge Bag Drawer (Code-split until opened) */}
        {bagMounted && (
          <Suspense fallback={null}>
            <MobileBagDrawer
              isOpen={isBagDrawerOpen}
              onClose={handleCloseBagDrawer}
              items={bagItems}
              wishlistIds={wishlistIds}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              recentAddedKey={recentAddedKey}
              activeAccountEmail={user?.email || activeLocalAccount?.email || undefined}
              activeAccountName={user?.displayName || activeLocalAccount?.displayName || undefined}
              activeAccountAddress={activeLocalAccount?.defaultAddress}
              onUpdateQuantity={handleUpdateBagQuantity}
              onRemoveItem={handleRemoveBagItem}
              onClearBag={handleClearBag}
              onToggleWishlist={handleToggleWishlist}
              onOpenPodium={(id) => {
                setIsBagDrawerOpen(false);
                handleOpenPodium(id);
              }}
              onOpenBombNutrition={(id) => {
                setIsBagDrawerOpen(false);
                handleOpenBombNutrition(id);
              }}
              onAddSoapToBag={handleAddSoapToBag}
              onAddBombToBag={handleAddBombToBag}
              onOrderCompleted={handleOrderCompleted}
            />
          </Suspense>
        )}

        {/* Sensory Inspection Dialog (Bar Soaps) */}
        {podiumSoapId && (
          <Suspense fallback={null}>
            <SoapPodiumModal
              soapId={podiumSoapId}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              wishlistIds={wishlistIds}
              onClose={handleClosePodium}
              onSelectSoapId={handleOpenPodium}
              onToggleWishlist={handleToggleWishlist}
              onZoomImage={setZoomTarget}
              onAddToBag={handleAddSoapToBag}
            />
          </Suspense>
        )}

        {/* Animal Pak-Style Multi-Vitamin & Mineral Nutrition Facts Dialog (Bath Bombs) */}
        {activeBombNutritionId && (
          <Suspense fallback={null}>
            <BathBombNutritionModal
              bombId={activeBombNutritionId}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              wishlistIds={wishlistIds}
              onClose={handleCloseBombModal}
              onToggleWishlist={handleToggleWishlist}
              onZoomImage={setZoomTarget}
              onAddBombToBag={handleAddBombToBag}
            />
          </Suspense>
        )}

        {/* Interactive 4K Craft Detail Zoom Lightbox */}
        <ImageZoomModal
          target={zoomTarget}
          accentHex={accentHex}
          onClose={() => setZoomTarget(null)}
        />

        {/* Account Sign-In, Local Accounts DB, Saved History & Paid/Tracking Order Portal */}
        {isAccountModalOpen && (
          <Suspense fallback={null}>
            <AccountHistoryModal
              isOpen={isAccountModalOpen}
              user={user}
              activeLocalAccount={activeLocalAccount}
              localAccounts={localAccounts}
              historyItems={mergedHistory}
              orderItems={mergedOrderItems}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              onClose={() => setIsAccountModalOpen(false)}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
              onConnectLocalAccount={handleConnectLocalAccount}
              onSwitchLocalAccount={handleSwitchLocalAccount}
              onDisconnectLocalAccount={handleDisconnectLocalAccount}
              onRefreshTracking={handleRefreshOrderTracking}
            />
          </Suspense>
        )}

        {/* Cookie Consent & Personalized Ad Preferences */}
        <CookieAdBanner
          preferences={cookiePrefs}
          isModalOpen={isCookieModalOpen}
          accentHex={accentHex}
          accentTextHex={accentTextHex}
          onSavePreferences={handleSaveCookiePrefs}
          onCloseModal={() => setIsCookieModalOpen(false)}
          onOpenModal={() => setIsCookieModalOpen(true)}
        />

        {/* PIN-Protected Atelier Admin Maker & Production Workbench */}
        {isAdminOpen && (
          <Suspense fallback={null}>
            <AtelierAdminDashboard
              isOpen={isAdminOpen}
              user={user}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              onClose={() => setIsAdminOpen(false)}
              onSignInAdminGoogle={handleSignIn}
            />
          </Suspense>
        )}

        {/* French Tricolor Bell-Pinch Smart Scroller with Type-Based Jump */}
        <SmartFrenchScroller
          catalogMode={catalogMode}
          activeLineFilter={activeLineFilter}
          accentHex={accentHex}
          accentTextHex={accentTextHex}
          onSelectCatalogMode={handleSelectCatalogMode}
          onSelectLineFilter={setActiveLineFilter}
        />
      </div>
    </MotionConfig>
  );
}
