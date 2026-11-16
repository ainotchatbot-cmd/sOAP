import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowDownRight,
  Feather,
  Heart,
  MoonStar,
  ShoppingBag,
  Sparkles,
  Sun,
} from 'lucide-react';
import {
  DREAM_PRESETS,
  DreamPresetId,
  getDreamPreset,
} from './data/palette';
import {
  ALL_SOAP_CREATIONS,
  ATELIER_MEDIA,
  formatThb,
  MarbleCassetteEdition,
  SOAP_PRICE_TIERS,
  SoapCreation,
  SoapSizeTier,
} from './data/soaps';
import {
  PRESET_LABELS_SHORT_EN,
  PRESET_LABELS_TH,
  useLanguage,
} from './data/i18n';
import { harpEngine, MusicTuneStyle } from './utils/harpAudio';
import { ResilientImage } from './components/ResilientImage';
import { StarfallNightAtmosphere } from './components/StarfallNightAtmosphere';
import { TopTenDuosSection } from './components/TopTenDuosSection';
import { GiftSetsSection } from './components/GiftSetsSection';
import { VisionStorySection } from './components/VisionStorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { HarpTunePlayer } from './components/HarpTunePlayer';
import { RedesignedLogoMotif } from './components/RedesignedLogoMotif';
import { BrandWordmark } from './components/BrandWordmark';
import { FloatingSoapBubblesOverlay } from './components/FloatingSoapBubblesOverlay';
import { CloudSheepMotif } from './components/CloudSheepMotif';
import { BagItem, MobileBagDrawer } from './components/BagWorkspace';
import { SoapPodiumModal } from './components/SoapPodiumModal';

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

  const [musicStyle, setMusicStyle] = useState<MusicTuneStyle>('off');
  const [isAmbienceOn, setIsAmbienceOn] = useState<boolean>(false);

  const [podiumSoapId, setPodiumSoapId] = useState<string | null>(null);

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
  const [recentAddedKey, setRecentAddedKey] = useState<string | null>(null);

  const heroContainerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });
  const heroImageScale = useTransform(heroScrollProgress, [0, 1], [1, 1.04]);
  const heroImageY = useTransform(heroScrollProgress, [0, 1], ['0%', '3%']);

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
    return () => {
      harpEngine.stop();
      harpEngine.stopAtmosphere();
    };
  }, []);

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
    ALL_SOAP_CREATIONS.find((s) => s.id === activePreset.spotlightSoapId) ??
    ALL_SOAP_CREATIONS[0];
  const heroSpotlightDisplay = getSoapDisplay(heroSpotlightSoap);
  const isHeroWishlisted = wishlistIds.includes(heroSpotlightSoap.id);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleToggleWishlist = useCallback((soapId: string) => {
    setWishlistIds((prev) =>
      prev.includes(soapId) ? prev.filter((id) => id !== soapId) : [...prev, soapId],
    );
  }, []);

  const handleOpenPodium = useCallback((id: string) => {
    setPodiumSoapId(id);
  }, []);

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
    [getSoapDisplay, t.sizeFull, t.sizeMega, t.sizeSmall],
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
      <div className="relative min-h-screen flex flex-col bg-[var(--canvas)] text-[var(--ink)] transition-colors duration-300">
        {/* Global Ambient Sky Layer + Real Rising Iridescent Soap Bubbles */}
        <StarfallNightAtmosphere preset={activePreset} />
        <FloatingSoapBubblesOverlay />

        {/* Clean 3-Zone Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--canvas)]/90 backdrop-blur-md transition-colors duration-300">
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
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navLines}
              </a>
              <a
                href="#gifting"
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navCases}
              </a>
              <a
                href="#atelier"
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navStory}
              </a>
              <a
                href="#reviews"
                className="hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
              >
                {t.navReviews}
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                onClick={() => setIsBagDrawerOpen(true)}
                className="luxury-3d-pill px-4 py-2 rounded-full text-xs font-semibold transition-all hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0 tabular-figures inline-flex items-center gap-2"
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
          {/* HERO SECTION */}
          <section
            id="hero"
            ref={heroContainerRef}
            className="relative border-b border-[var(--border)] bg-transparent overflow-hidden"
          >
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  {/* Editorial Brand Crest & Cloud Sheep Lockup */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="luxury-3d-card px-5 py-3.5 flex items-center justify-between gap-4 max-w-xl"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <RedesignedLogoMotif
                        variant="original-3d"
                        size={86}
                        className="shrink-0 drop-shadow-sm"
                      />
                      <div className="space-y-1 min-w-0">
                        <p className="marshmallow-text leading-tight truncate">
                          <BrandWordmark
                            className="text-2xl sm:text-[1.7rem] font-semibold text-[var(--ink)]"
                            accentHex={accentHex}
                          />
                        </p>
                        <p
                          className="font-cursive text-xl sm:text-2xl leading-none truncate"
                          style={{ color: accentHex }}
                        >
                          {t.cursiveTagline}
                        </p>
                        <p className="text-[11px] text-[var(--muted)] flex flex-wrap items-center gap-1.5">
                          <span>{t.originLocation}</span>
                        </p>
                      </div>
                    </div>
                    <CloudSheepMotif
                      size={70}
                      accentHex={accentHex}
                      className="hidden sm:block shrink-0"
                    />
                  </motion.div>

                  {/* Hero Marshmallow Editorial Slogan */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.48, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2.5"
                  >
                    <h1
                      className="marshmallow-text font-serif font-medium leading-[1.06] tracking-tight text-[var(--ink)] balance-text"
                      style={{ fontSize: 'clamp(2.25rem, 3.6vw, 3.6rem)' }}
                    >
                      <span className="block">{t.heroLine1}</span>
                      <span className="block" style={{ color: accentHex }}>
                        {t.heroLine2}
                      </span>
                    </h1>
                    <p className="text-sm text-[var(--muted)]">{t.heroSummary}</p>
                  </motion.div>

                  {/* Editorial Navigation & Theme Toggle */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href="#collection"
                      className="luxury-3d-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
                      style={{ backgroundColor: accentHex, color: accentTextHex }}
                    >
                      <span>{t.explore30}</span>
                      <ArrowDownRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#gifting"
                      className="luxury-3d-pill inline-flex items-center px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-card)] hover:bg-[var(--surface)] text-[var(--ink)] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                    >
                      {t.casesCta}
                    </a>
                    <button
                      type="button"
                      onClick={handleQuickToggleDayNight}
                      aria-label={isTwilight ? t.dayMode : t.nightMode}
                      className="luxury-3d-pill inline-flex items-center gap-2 px-4 py-3 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
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
                </div>

                {/* Right: Pure Studio Spotlight Photograph + Clean Caption Below Image */}
                <div className="lg:col-span-6">
                  <div className="luxury-3d-card max-w-[430px] mx-auto overflow-hidden flex flex-col">
                    <div
                      onClick={() => setPodiumSoapId(heroSpotlightSoap.id)}
                      className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface)] cursor-pointer"
                    >
                      <motion.div
                        key={heroSpotlightSoap.id}
                        style={{ scale: heroImageScale, y: heroImageY }}
                        className="w-full h-full will-change-transform"
                      >
                        <ResilientImage
                          src={heroSpotlightSoap.imageUrl}
                          alt={heroSpotlightSoap.imageAlt}
                          fallbackTitle={heroSpotlightDisplay.name}
                          fallbackGradient={heroSpotlightSoap.fallbackGradient}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div aria-hidden="true" className="shimmer shimmer-enlarged z-20" />
                    </div>

                    <div className="px-5 sm:px-6 py-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--surface-card)]">
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-serif text-2xl font-medium text-[var(--ink)] truncate">
                          {heroSpotlightDisplay.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate">
                          {heroSpotlightDisplay.scentMood}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(heroSpotlightSoap.id)}
                          aria-label={isHeroWishlisted ? t.favRemove : t.favAdd}
                          className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 ${isHeroWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[var(--ink)]'}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPodiumSoapId(heroSpotlightSoap.id)}
                          className="px-3.5 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium inline-flex items-center gap-1.5 hover:border-[var(--ink)]/30 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" style={{ color: accentHex }} />
                          <span>{t.inspectBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSoapToBag(heroSpotlightSoap, 1, 'full')}
                          className="luxury-3d-pill px-4 h-9 rounded-full text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap tabular-figures"
                          style={{ backgroundColor: accentHex, color: accentTextHex }}
                        >
                          {t.reserveBtn} · {formatThb(heroSpotlightSoap.priceUsd)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Parallel Columns — Dark Line, Bright Line & Occasions Line */}
          <TopTenDuosSection
            accentHex={accentHex}
            accentTextHex={accentTextHex}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenPodium={handleOpenPodium}
            onAddToBag={handleAddSoapToBag}
          />

          {/* SECTION 3: 3 Themed Marble Case Set Boxes Aligned Below Each Vertical Line */}
          <GiftSetsSection
            accentHex={accentHex}
            accentTextHex={accentTextHex}
            onOpenPodium={handleOpenPodium}
            onAddGiftSetToBag={handleAddGiftSetToBag}
          />

          {/* SECTION 4: Maison Heritage, Founder Story & Custom Stamp */}
          <VisionStorySection accentHex={accentHex} isTwilight={isTwilight} />

          {/* SECTION 5: Collector Voices */}
          <ReviewsSection accentHex={accentHex} />

          {/* Unified Single-Line Day & Twilight Hues + Sound Settings Bar */}
          <section
            id="preset-engine"
            aria-label={t.consoleHeading}
            className="relative z-10 border-t border-[var(--border)] bg-[var(--surface)]/92 px-5 sm:px-8 lg:px-10 py-3.5 transition-colors duration-300"
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

          {/* Clean Maison Footer & Official Feather-Quill Correspondence Border */}
          <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--canvas)]/95 pb-10">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-3.5">
                <RedesignedLogoMotif
                  variant="original-3d"
                  size={64}
                  className="shrink-0"
                />
                <CloudSheepMotif
                  size={54}
                  accentHex={accentHex}
                  withBubbles={false}
                  className="shrink-0"
                />
                <div className="space-y-0.5">
                  <p className="marshmallow-text leading-tight">
                    <BrandWordmark
                      className="text-xl sm:text-2xl font-medium text-[var(--ink)]"
                      accentHex={accentHex}
                    />
                  </p>
                  <p className="font-cursive text-xl leading-none" style={{ color: accentHex }}>
                    {t.cursiveTagline}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">{t.originLocation}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[var(--muted)]">
                <a href="#collection" className="hover:text-[var(--ink)] transition-colors">
                  {t.navLines}
                </a>
                <a href="#gifting" className="hover:text-[var(--ink)] transition-colors">
                  {t.navCases}
                </a>
                <a href="#atelier" className="hover:text-[var(--ink)] transition-colors">
                  {t.navStory}
                </a>
                <a href="#reviews" className="hover:text-[var(--ink)] transition-colors">
                  {t.navReviews}
                </a>
              </div>
            </div>

            {/* Clean Feather-Quill Correspondence Border */}
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
              <div className="luxury-3d-card overflow-hidden">
                <div className="aspect-[16/3] sm:aspect-[20/3] w-full overflow-hidden bg-[#F9F4EA]">
                  <ResilientImage
                    src={ATELIER_MEDIA.featherLetterBorderUrl}
                    alt="Official archival parchment stationery border with white ostrich feather quill and GentleBubble by AR seal"
                    fallbackTitle="GentleBubble by AR Correspondence"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface-card)] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                    <Feather className="w-3.5 h-3.5" style={{ color: accentHex }} />
                    <BrandWordmark className="text-sm font-medium text-[var(--ink)]" accentHex={accentHex} />
                  </span>

                  {/* French Flag Tricolore & French Motto Signature */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)]/80"
                      aria-label="French Maison Savonnerie Signature"
                    >
                      <svg
                        width="22"
                        height="15"
                        viewBox="0 0 24 16"
                        className="rounded-[2px] border border-[var(--border)] shrink-0 shadow-xs"
                        role="img"
                        aria-label="Flag of France"
                      >
                        <rect x="0" y="0" width="8" height="16" fill="#0055A4" />
                        <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
                        <rect x="16" y="0" width="8" height="16" fill="#EF4135" />
                      </svg>
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
          </footer>
        </main>

        {/* Quiet Slide-Over Concierge Bag Drawer (Opened only from Header Bag CTA) */}
        <MobileBagDrawer
          isOpen={isBagDrawerOpen}
          onClose={() => setIsBagDrawerOpen(false)}
          items={bagItems}
          wishlistIds={wishlistIds}
          accentHex={accentHex}
          accentTextHex={accentTextHex}
          recentAddedKey={recentAddedKey}
          onUpdateQuantity={handleUpdateBagQuantity}
          onRemoveItem={handleRemoveBagItem}
          onClearBag={() => setBagItems([])}
          onToggleWishlist={handleToggleWishlist}
          onOpenPodium={(id) => {
            setIsBagDrawerOpen(false);
            setPodiumSoapId(id);
          }}
          onAddSoapToBag={handleAddSoapToBag}
        />

        {/* Sensory Inspection Dialog */}
        <SoapPodiumModal
          soapId={podiumSoapId}
          accentHex={accentHex}
          accentTextHex={accentTextHex}
          wishlistIds={wishlistIds}
          onClose={() => setPodiumSoapId(null)}
          onSelectSoapId={(id) => setPodiumSoapId(id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToBag={handleAddSoapToBag}
        />
      </div>
    </MotionConfig>
  );
}
