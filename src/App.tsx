import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowDownRight,
  Feather,
  History,
  Lock,
  LogIn,
  MoonStar,
  ScrollText,
  ShoppingBag,
  Sparkles,
  Sun,
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
  VAULT_PRICING,
  VaultMarbleBoxEdition,
  VaultPairedFormulation,
} from './data/memberVaultCatalog';
import {
  PRESET_LABELS_SHORT_EN,
  PRESET_LABELS_TH,
  useLanguage,
} from './data/i18n';
import { harpEngine, MusicTuneStyle } from './utils/harpAudio';
import { ResilientImage } from './components/ResilientImage';
import { StarfallNightAtmosphere } from './components/StarfallNightAtmosphere';
import { HarpTunePlayer } from './components/HarpTunePlayer';
import { RedesignedLogoMotif } from './components/RedesignedLogoMotif';
import { BrandWordmark } from './components/BrandWordmark';
import { FloatingSoapBubblesOverlay } from './components/FloatingSoapBubblesOverlay';
import { HeroTopSellerCarousel } from './components/HeroTopSellerCarousel';
import type { BagItem, OrderReceipt } from './components/BagWorkspace';
import { MailingListBanner } from './components/MailingListBanner';
import { CookieAdBanner } from './components/CookieAdBanner';
import { SmartFrenchScroller } from './components/SmartFrenchScroller';
import { LazyGallerySection, triggerRevealSection } from './components/LazyGallerySection';

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
import {
  auth,
  onAuthStateChanged,
  signInWithGooglePopup,
  signOutAccount,
  testFirestoreConnection,
  User,
} from './firebase';
import {
  BASE_ATELIER_SOLD_COUNT,
  clearUserHistory,
  CookiePreferences,
  incrementLocalSoldCounts,
  loadCookiePreferences,
  loadLocalItemSoldMap,
  persistCookiePreferences,
  recordGlobalSoldIncrement,
  recordUserHistory,
  recordUserOrder,
  SavedHistoryItem,
  SavedOrderItem,
  subscribeGlobalSoldCounter,
  subscribeUserHistory,
  subscribeUserOrders,
  trackAdInterestCookie,
} from './services/atelierStoreService';

type CatalogPageMode = 'soaps' | 'bath-bombs';

const BAG_STORAGE_KEY = 'gentle_bubble_bag_v9_thb';
const WISHLIST_STORAGE_KEY = 'gentle_bubble_wishlist_v8';
const PRESET_STORAGE_KEY = 'gentle_bubble_preset_v8';

export default function App() {
  const {
    lang,
    activeButtonLang,
    isLangTransitioning,
    setLang,
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

  const [catalogMode, setCatalogMode] = useState<CatalogPageMode>('soaps');
  const [activeLineFilter, setActiveLineFilter] = useState<'parallel' | SoapLineKey>('parallel');
  const [musicStyle, setMusicStyle] = useState<MusicTuneStyle>('off');
  const [isAmbienceOn, setIsAmbienceOn] = useState<boolean>(false);

  const [podiumSoapId, setPodiumSoapId] = useState<string | null>(null);
  const [activeBombNutritionId, setActiveBombNutritionId] = useState<string | null>(null);

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
  const [savedHistory, setSavedHistory] = useState<SavedHistoryItem[]>([]);
  const [savedOrders, setSavedOrders] = useState<SavedOrderItem[]>([]);
  const [totalSoldCount, setTotalSoldCount] = useState<number>(BASE_ATELIER_SOLD_COUNT);
  const [itemSoldDeltas, setItemSoldDeltas] = useState<Record<string, number>>(() =>
    loadLocalItemSoldMap(),
  );
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(() => loadCookiePreferences());
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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
    void testFirestoreConnection();
    const unsubscribeSold = subscribeGlobalSoldCounter(setTotalSoldCount);
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => {
      unsubscribeSold();
      unsubscribeAuth();
      harpEngine.stop();
      harpEngine.stopAtmosphere();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedHistory([]);
      setSavedOrders([]);
      return;
    }
    const unsubHistory = subscribeUserHistory(user.uid, setSavedHistory);
    const unsubOrders = subscribeUserOrders(user.uid, setSavedOrders);
    return () => {
      unsubHistory();
      unsubOrders();
    };
  }, [user]);

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

  const handleQuickToggleDayNight = () => {
    handleSelectPreset(isTwilight ? 'midnight-reverie' : 'moonmilk-velvet');
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

  const handleSelectCatalogMode = useCallback(
    (nextMode: CatalogPageMode) => {
      setCatalogMode(nextMode);
      if (cookiePrefs.adCookies) {
        trackAdInterestCookie(
          nextMode === 'bath-bombs' ? 'vitamin_bath_bombs_soak' : 'gold_leaf_bar_soaps',
        );
      }
    },
    [cookiePrefs.adCookies],
  );

  const handleOpenPodium = useCallback(
    (id: string) => {
      setPodiumSoapId(id);
      const soap = SOAP_BY_ID.get(id);
      if (soap) {
        if (cookiePrefs.adCookies) {
          trackAdInterestCookie(`soap_${soap.line}_${soap.luxuryInlay.type}`);
        }
        if (user && cookiePrefs.savedHistory) {
          const display = getSoapDisplay(soap);
          void recordUserHistory(user.uid, {
            itemId: soap.id,
            itemType: 'soap',
            title: display.name,
            subtitle: `${display.themeLabel} · ${display.scentMood}`,
            imageUrl: soap.imageUrl,
            priceThb: soap.priceUsd,
          }).catch(() => {});
        }
      }
    },
    [cookiePrefs.adCookies, cookiePrefs.savedHistory, getSoapDisplay, user],
  );

  const handleOpenBombNutrition = useCallback(
    (id: string) => {
      setActiveBombNutritionId(id);
      const bomb = BATH_BOMB_BY_ID.get(id);
      if (bomb) {
        if (cookiePrefs.adCookies) {
          trackAdInterestCookie(`bomb_${bomb.line}_${bomb.nutrientFocus}`);
        }
        if (user && cookiePrefs.savedHistory) {
          const title = lang === 'th' ? bomb.nameTh : bomb.nameEn;
          const soakMood = lang === 'th' ? bomb.soakMoodTh : bomb.soakMoodEn;
          void recordUserHistory(user.uid, {
            itemId: bomb.id,
            itemType: 'bath-bomb',
            title,
            subtitle: soakMood,
            imageUrl: bomb.imageUrl,
            priceThb: BATH_BOMB_PRICE_TIERS.single,
          }).catch(() => {});
        }
      }
    },
    [cookiePrefs.adCookies, cookiePrefs.savedHistory, lang, user],
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
    if (!user) return;
    try {
      await clearUserHistory(user.uid);
    } catch {
      // Ignore error cleanly
    }
  }, [user]);

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
      const scentLabel = `${item.activeFormula} · ${
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

      if (user && cookiePrefs.savedHistory) {
        void recordUserHistory(user.uid, {
          itemId: item.id,
          itemType: variant === 'bomb' ? 'bath-bomb' : 'soap',
          title: itemLabel,
          subtitle: item.activeFormula,
          imageUrl: item.imageUrl.slice(0, 480),
          priceThb: unitPrice,
        }).catch(() => {});
      }

      highlightRecentItem(cartKey);
    },
    [cookiePrefs.savedHistory, highlightRecentItem, user],
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

      if (user && cookiePrefs.savedHistory) {
        void recordUserHistory(user.uid, {
          itemId: box.id,
          itemType: 'marble-case',
          title: boxTitle.slice(0, 150),
          subtitle: ribbonAndLoofahs.slice(0, 190),
          imageUrl: box.imageUrl.slice(0, 480),
          priceThb: box.priceThb,
        }).catch(() => {});
      }

      highlightRecentItem(cartKey);
    },
    [cookiePrefs.savedHistory, highlightRecentItem, lang, user],
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
      <div className="relative min-h-screen flex flex-col bg-transparent text-[var(--ink)] transition-colors duration-300">
        {/* Global Ambient Sky Layer + Real Rising Iridescent Soap Bubbles */}
        <StarfallNightAtmosphere preset={activePreset} />
        <FloatingSoapBubblesOverlay />

        {/* Clean 3-Zone Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--canvas)]/84 backdrop-blur-md transition-colors duration-300">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-4 sm:gap-8">
            <a
              href="#hero"
              className="inline-flex items-center gap-2.5 text-[var(--ink)] whitespace-nowrap shrink-0"
            >
              <RedesignedLogoMotif variant="original-3d" size={38} className="shrink-0" />
              <BrandWordmark
                className="text-xl sm:text-2xl font-medium text-[var(--ink)]"
                accentHex={accentHex}
              />
            </a>

            <nav
              className={`hidden md:flex items-center gap-7 lg:gap-10 text-sm font-medium text-[var(--muted)] transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${isLangTransitioning ? 'opacity-20' : 'opacity-100'}`}
            >
              <a
                href="#collection"
                onClick={() => {
                  handleSelectCatalogMode('soaps');
                  triggerRevealSection('#collection');
                }}
                className={`hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0 ${catalogMode === 'soaps' ? 'text-[var(--ink)] font-semibold' : ''}`}
              >
                {t.modeSoapsBtn}
              </a>
              <a
                href="#collection"
                onClick={() => {
                  handleSelectCatalogMode('bath-bombs');
                  triggerRevealSection('#collection');
                }}
                className={`hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0 ${catalogMode === 'bath-bombs' ? 'text-[var(--ink)] font-semibold' : ''}`}
              >
                {t.modeBathBombsBtn}
              </a>
              <a
                href="#secret-vault"
                onClick={() => triggerRevealSection('#secret-vault')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 shrink-0" style={{ color: accentHex }} />
                <span>{t.navVault}</span>
              </a>
              <a
                href="#atelier"
                onClick={() => triggerRevealSection('#atelier')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navStory}
              </a>
              <a
                href="#reviews"
                onClick={() => triggerRevealSection('#reviews')}
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navReviews}
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Saved History / Google Account Sign-In Trigger */}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:border-[var(--ink)]/30 text-[11px] font-medium text-[var(--ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
              >
                {user ? (
                  <>
                    <History className="w-3.5 h-3.5" style={{ color: accentHex }} />
                    <span className="hidden sm:inline">{t.historyBtn}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" style={{ color: accentHex }} />
                    <span className="hidden sm:inline">{t.signInBtn}</span>
                  </>
                )}
              </button>

              {/* Instant 1-Click Thai / English Toggle with smooth cross-fade */}
              <div
                role="group"
                aria-label="Language Switcher"
                className="inline-flex items-center p-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setLang('th')}
                  aria-pressed={activeButtonLang === 'th'}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: activeButtonLang === 'th' ? accentHex : 'transparent',
                    color: activeButtonLang === 'th' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  ไทย
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  aria-pressed={activeButtonLang === 'en'}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: activeButtonLang === 'en' ? accentHex : 'transparent',
                    color: activeButtonLang === 'en' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  EN
                </button>
              </div>

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
          {/* PAGE MODE SWITCHER BAR (Bar Soaps <-> Vitamin Bath Bombs) + Miniature Atelier Sold Counter */}
          <div className="border-b border-[var(--border)] bg-[var(--surface-card)]/75 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-3">
              <span className="hidden lg:inline-block w-36" aria-hidden="true" />

              <div
                role="tablist"
                aria-label="Collection Mode"
                className="inline-flex items-center gap-1.5 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 shadow-sm mx-auto lg:mx-0"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'soaps'}
                  onClick={() => handleSelectCatalogMode('soaps')}
                  className="luxury-3d-pill inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: catalogMode === 'soaps' ? accentHex : 'transparent',
                    color: catalogMode === 'soaps' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.modeSoapsBtn}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={catalogMode === 'bath-bombs'}
                  onClick={() => handleSelectCatalogMode('bath-bombs')}
                  className="luxury-3d-pill inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: catalogMode === 'bath-bombs' ? accentHex : 'transparent',
                    color: catalogMode === 'bath-bombs' ? accentTextHex : 'var(--muted)',
                  }}
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>{t.modeBathBombsBtn}</span>
                </button>
              </div>

              <div className="hidden md:flex items-center justify-end gap-1.5 text-[11px] font-medium text-[var(--muted)] tabular-figures">
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentHex }}
                />
                <strong className="text-[var(--ink)]">{totalSoldCount.toLocaleString()}</strong>
                <span>{t.atelierSoldTotalLabel}</span>
              </div>
            </div>
          </div>

          {/* HERO SECTION */}
          <section
            id="hero"
            className="relative border-b border-[var(--border)] bg-transparent overflow-hidden"
          >
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Clean Porcelain Editorial Card (no duplicate brand logo above fold) */}
                <div className="lg:col-span-6">
                  <motion.div
                    key={catalogMode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="luxury-3d-card p-6 sm:p-8 bg-[var(--surface-card)]/94 backdrop-blur-md space-y-6"
                  >
                    <p
                      className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                      style={{ color: accentHex }}
                    >
                      {t.heroAtelierLabel}
                    </p>

                    <div className="space-y-3">
                      <h1 className="marshmallow-text font-serif fluid-hero-display tracking-tight text-[var(--ink)]">
                        <span className="block">
                          {catalogMode === 'bath-bombs' ? t.bathHeroLine1 : t.heroLine1}
                        </span>
                        <span className="block mt-1" style={{ color: accentHex }}>
                          {catalogMode === 'bath-bombs' ? t.bathHeroLine2 : t.heroLine2}
                        </span>
                      </h1>
                      <p className="fluid-lead-copy text-[var(--muted)] max-w-xl">
                        {catalogMode === 'bath-bombs' ? t.bathHeroSummary : t.heroSummary}
                      </p>
                    </div>

                    {/* Editorial Navigation & Theme Toggle */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="#collection"
                        onClick={() => triggerRevealSection('#collection')}
                        className="luxury-3d-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
                        style={{ backgroundColor: accentHex, color: accentTextHex }}
                      >
                        <span>{catalogMode === 'bath-bombs' ? t.bathExploreBtn : t.explore30}</span>
                        <ArrowDownRight className="w-4 h-4" />
                      </a>

                      {catalogMode === 'soaps' ? (
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

                      <button
                        type="button"
                        onClick={handleQuickToggleDayNight}
                        aria-label={isTwilight ? t.dayMode : t.nightMode}
                        className="luxury-3d-pill inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isTwilight ? (
                          <>
                            <Sun className="w-3.5 h-3.5" style={{ color: accentHex }} />
                            <span>{t.dayMode}</span>
                          </>
                        ) : (
                          <>
                            <MoonStar className="w-3.5 h-3.5" style={{ color: accentHex }} />
                            <span>{t.nightMode}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Right: 3-Slide Top Sellers Spotlight Carousel */}
                <div className="lg:col-span-6">
                  <HeroTopSellerCarousel
                    mode={catalogMode}
                    primarySpotlightId={heroSpotlightSoap.id}
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    wishlistIds={wishlistIds}
                    totalSold={totalSoldCount}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenPodium={handleOpenPodium}
                    onOpenBombNutrition={handleOpenBombNutrition}
                    onAddSoapToBag={handleAddSoapToBag}
                    onAddBombToBag={handleAddBombToBag}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Lazy-Loaded Parallel 3-Column Storefront (Soaps OR Bath Bombs) */}
          <AnimatePresence mode="wait">
            {catalogMode === 'soaps' ? (
              <motion.div
                key="mode-soaps"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <LazyGallerySection id="collection" minHeightClass="min-h-[680px]" rootMargin="380px 0px">
                  <TopTenDuosSection
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    wishlistIds={wishlistIds}
                    itemSoldDeltas={itemSoldDeltas}
                    activeLineFilter={activeLineFilter}
                    onChangeLineFilter={setActiveLineFilter}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenPodium={handleOpenPodium}
                    onAddToBag={handleAddSoapToBag}
                  />
                </LazyGallerySection>

                <LazyGallerySection id="gifting" minHeightClass="min-h-[540px]" rootMargin="420px 0px">
                  <GiftSetsSection
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    onOpenPodium={handleOpenPodium}
                    onAddGiftSetToBag={handleAddGiftSetToBag}
                  />
                </LazyGallerySection>
              </motion.div>
            ) : (
              <motion.div
                key="mode-bath-bombs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <LazyGallerySection id="collection" minHeightClass="min-h-[680px]" rootMargin="380px 0px">
                  <BathBombsSection
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    wishlistIds={wishlistIds}
                    itemSoldDeltas={itemSoldDeltas}
                    activeLineFilter={activeLineFilter}
                    onChangeLineFilter={setActiveLineFilter}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenNutritionModal={handleOpenBombNutrition}
                    onAddBombToBag={handleAddBombToBag}
                  />
                </LazyGallerySection>

                <LazyGallerySection id="gifting" minHeightClass="min-h-[540px]" rootMargin="420px 0px">
                  <BathBombMarbleCasesSection
                    accentHex={accentHex}
                    accentTextHex={accentTextHex}
                    onOpenNutritionModal={handleOpenBombNutrition}
                    onAddBombCaseToBag={handleAddBathBombCaseToBag}
                  />
                </LazyGallerySection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 2.5: Members-Only Secret Store Vault (30 Matched Pairs + 3 Victorian Marble Boxes) */}
          <LazyGallerySection id="secret-vault" minHeightClass="min-h-[460px]" rootMargin="380px 0px">
            <SecretVaultSection
              user={user}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              wishlistIds={wishlistIds}
              itemSoldDeltas={itemSoldDeltas}
              onSignIn={handleSignIn}
              onToggleWishlist={handleToggleWishlist}
              onAddVaultToBag={handleAddVaultToBag}
              onAddVaultMarbleBoxToBag={handleAddVaultMarbleBoxToBag}
            />
          </LazyGallerySection>

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

          {/* Unified Single-Line Day & Twilight Hues + Sound Settings Bar */}
          <section
            id="preset-engine"
            aria-label={t.consoleHeading}
            className="relative z-10 border-t border-[var(--border)] bg-[var(--surface)]/78 backdrop-blur-md px-5 sm:px-8 lg:px-10 py-3.5 transition-colors duration-300"
          >
            <div className="max-w-[1440px] mx-auto flex flex-nowrap items-center justify-between gap-3 overflow-x-auto whitespace-nowrap">
              <div className="inline-flex flex-nowrap items-center gap-2 shrink-0">
                <span className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)] shrink-0">
                  {t.consoleHeading}
                </span>

                <div
                  role="group"
                  aria-label={t.consoleHeading}
                  className="inline-flex flex-nowrap items-center gap-1.5"
                >
                  {DREAM_PRESETS.map((preset) => {
                    const isSelected = preset.id === presetId;
                    const shortPresetLabel =
                      lang === 'th'
                        ? PRESET_LABELS_TH[preset.id]
                        : PRESET_LABELS_SHORT_EN[preset.id];
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        aria-pressed={isSelected}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                        style={{
                          borderColor: isSelected ? preset.accentHex : 'var(--border)',
                          backgroundColor: isSelected
                            ? preset.accentHex
                            : 'var(--surface-card)',
                          color: isSelected ? preset.accentTextHex : 'var(--ink)',
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: isSelected
                              ? preset.accentTextHex
                              : preset.accentHex,
                          }}
                        />
                        <span>{shortPresetLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <span aria-hidden="true" className="h-5 w-px bg-[var(--border)] shrink-0" />

              <HarpTunePlayer
                scaleKey={activePreset.harpScale}
                season={activePreset.seasonAudioKey}
                accentHex={accentHex}
                accentTextHex={accentTextHex}
                musicStyle={musicStyle}
                onChangeMusicStyle={handleChangeMusicStyle}
                isAmbienceOn={isAmbienceOn}
                onToggleAmbience={handleToggleAmbience}
              />
            </div>
          </section>

          {/* Clean Maison Footer & Single Non-Duplicated Archival Correspondence Banner */}
          <footer className="relative z-10 border-t border-[var(--border)] bg-transparent py-8 sm:py-10">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 space-y-5">
              {/* Compact Porcelain Quick-Jump Navigation Strip (no duplicate logo block) */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)]/94 backdrop-blur-md px-5 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <span className="text-xs font-medium text-[var(--muted)]">{t.originLocation}</span>

                <nav className="flex flex-wrap items-center gap-5 text-xs font-medium text-[var(--muted)]">
                  <a
                    href="#collection"
                    onClick={() => handleSelectCatalogMode('soaps')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.modeSoapsBtn}
                  </a>
                  <a
                    href="#collection"
                    onClick={() => handleSelectCatalogMode('bath-bombs')}
                    className="hover:text-[var(--ink)] transition-colors"
                  >
                    {t.modeBathBombsBtn}
                  </a>
                  <a
                    href="#secret-vault"
                    onClick={() => triggerRevealSection('secret-vault')}
                    className="hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" style={{ color: accentHex }} />
                    <span>{t.navVault}</span>
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
                    {user ? t.historyBtn : t.signInBtn}
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

              {/* Clear 2-Column Archival Correspondence Banner (Blush-Pearl Cameo & Victorian Filigree Adaptation) */}
              <div className="luxury-3d-card relative overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
                {/* Left Column: Blush-Pearl Cameo Medallion + Lace Monogram 'A' Seal over Archival Parchment */}
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

                  {/* Seed-Pearl Oval Cameo Frame housing the Victorian Lace 'A' Crest for Archawee (AR) */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-full p-2.5 bg-gradient-to-b from-[#FAF3EB] via-[#F2D9D4] to-[#E6C3BC] shadow-[0_14px_30px_-10px_rgba(116,74,64,0.34),inset_0_2px_4px_rgba(255,255,255,0.9)] border-2 border-[#D4AD7D]">
                      {/* Subtle Seed-Pearl Bead Ring */}
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

                {/* Right Column: Archival Correspondence Dispatch framed with delicate Rose-Gold Corner Filigree */}
                <div className="md:col-span-7 relative p-5 sm:p-7 bg-[var(--surface-card)] flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-[var(--border)]">
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
              onAddBombToBag={handleAddBombToBag}
            />
          </Suspense>
        )}

        {/* Account Sign-In, Saved History & Order Receipts Dialog */}
        {isAccountModalOpen && (
          <Suspense fallback={null}>
            <AccountHistoryModal
              isOpen={isAccountModalOpen}
              user={user}
              historyItems={savedHistory}
              orderItems={savedOrders}
              accentHex={accentHex}
              accentTextHex={accentTextHex}
              onClose={() => setIsAccountModalOpen(false)}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
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
