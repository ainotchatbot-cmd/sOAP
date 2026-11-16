// Pure Botanical Atelier Collection — Unified Sculptural Blueprint
// Dark Line · Bright Line · Thai & Global Holiday Editions

import darkCappuccinoChocoImg from '../assets/images/tall_espresso_noir_1794830230537.jpg';
import darkPomegranateRubyImg from '../assets/images/tall_pomegranate_ruby_1794830231208.jpg';
import darkCacaoOatImg from '../assets/images/tall_cacao_oat_1794830232343.jpg';
import darkSambucaAniseImg from '../assets/images/tall_sambuca_anise_1794830233667.jpg';
import darkMatchaSesameImg from '../assets/images/tall_matcha_sesame_1794830234318.jpg';
import darkChaiQuartzImg from '../assets/images/tall_chai_quartz_1794830234609.jpg';
import darkOolongCarbonImg from '../assets/images/tall_oolong_carbon_1794830236153.jpg';

import darkVetiverObsidianImg from '../assets/images/tall_vetiver_obsidian_1794830238317.jpg';

import brightCoconutWhiteImg from '../assets/images/tall_coconut_pearl_1794830255446.jpg';
import brightAvocadoGreenImg from '../assets/images/tall_avocado_leaf_1794830256762.jpg';
import brightHoneySableImg from '../assets/images/tall_honey_sable_1794830257574.jpg';
import brightSkyAnchanImg from '../assets/images/tall_anchan_sky_1794830258394.jpg';
import brightPinkPomImg from '../assets/images/tall_pink_pomegranate_1794830258922.jpg';
import brightMoonmilkPearlImg from '../assets/images/tall_moonmilk_pearl_1794830260492.jpg';
import brightMintBlossomImg from '../assets/images/tall_tiffany_mint_1794830261306.jpg';

import holidayHalloweenImg from '../assets/images/tall_halloween_orange_1794830279980.jpg';
import holidayChristmasImg from '../assets/images/tall_christmas_pine_1794830280305.jpg';
import holidayCoronationImg from '../assets/images/tall_coronation_yolk_1794830306488.jpg';
import holidaySongkranImg from '../assets/images/tall_songkran_jasmine_1794830282978.jpg';
import holidayLoyKrathongImg from '../assets/images/tall_loy_krathong_1794830283622.jpg';
import holidayLunarNewYearImg from '../assets/images/tall_lunar_mandarin_1794830283892.jpg';
import holidayValentineRoseImg from '../assets/images/tall_valentine_rose_1794830285499.jpg';

// Unique Feature Artisanal Additions: Shimmer · Scrub · Stardust · Translucent Crystal
import shimmerOpalImg from '../assets/images/tall_champagne_opal_1794830287907.jpg';
import scrubVolcanicImg from '../assets/images/tall_volcanic_scrub_1794830237283.jpg';
import stardustVioletImg from '../assets/images/tall_stardust_violet_1794830286498.jpg';
import spirulinaBlueImg from '../assets/images/tall_blue_spirulina_1794830261694.jpg';

// Clinical-Botanical 50/50 Syndet & Suspension Bars
import sulfurSalicylicImg from '../assets/images/tall_sulfur_salicylic_1794830238291.jpg';
import squalaneLecithinImg from '../assets/images/tall_squalane_barrier_1794830263629.jpg';
import piroctonePurifyingImg from '../assets/images/tall_piroctone_aqua_1794830264522.jpg';
import goldenOatmealHoneyImg from '../assets/images/tall_oatmeal_honey_1794830287666.jpg';

// 3 Signature Marble Cases with Dedicated 2-Loofah Scrub Compartments
import caseBrightMarbleLoofahImg from '../assets/images/case_bright_marble_loofah_1794827149643.jpg';
import caseDarkMarbleLoofahImg from '../assets/images/case_dark_marble_loofah_1794827151204.jpg';
import caseCheckeredOccasionsLoofahImg from '../assets/images/case_checkered_occasions_loofah_1794827151713.jpg';

// Editorial Heritage & Keepsake Props
import featherLetterBorderImg from '../assets/images/feather_letter_border_1794738931128.jpg';
import woodPlateGentleBubbleImg from '../assets/images/wood_plate_gentle_bubble_logo_1794708237063.jpg';
import giftBoxSealedImg from '../assets/images/gift_packaging_seal_detail_1794678322890.jpg';
import mascotHuskyImg from '../assets/images/mascot_bubble_husky_1794678831098.jpg';
import thaiPomeloImg from '../assets/images/thai_soap_siam_pomelo_1794678322105.jpg';
import thaiLotusImg from '../assets/images/thai_soap_lotus_pandan_1794678322548.jpg';
import thaiJasmineImg from '../assets/images/thai_soap_jasmine_rice_1794678321617.jpg';

import { SoapLineKey } from './palette';
import { PackagingMarkerId } from '../components/PackagingSymbols';

export interface SixSenses {
  sight: string;
  scent: string;
  touch: string;
  sound: string;
  taste: string;
  sixthSense: string;
}

export interface BioActiveComplex {
  headlineCompound: string;
  actives: string[];
  mineralCore: string;
  skinBenefit: string;
}

export type LuxuryInlayType = 'pearl' | 'gold-leaf' | 'loofah' | 'cosmetic-sponge';

export interface LuxuryInlaySpec {
  type: LuxuryInlayType;
  label: string;
  whisperDetail: string;
}

export interface BotanicalLayerSpec {
  crystalTitle: string;
  crystalNote: string;
  crystalColorHex: string;
  creamTitle: string;
  creamNote: string;
  creamColorHex: string;
}

export interface SoapNutritionFacts {
  servingSize: string;
  activeIngredients: Record<string, string>;
  baseAndHydration: Record<string, string>;
  pHLevel: string;
}

export type EdibleGoldLeafType = 'rose-gold' | 'yellow-gold';

export interface SoapCreation {
  id: string;
  line: SoapLineKey;
  holidayOccasion?: string;
  editionNumber: string;
  batchHarvestId: string;
  name: string;
  formulaBrand: string;
  colorThemeLabel: string;
  whisperSubtitle: string;
  sableDescription: string;
  botanicalLayers: BotanicalLayerSpec;
  palettePair: [string, string];
  luxuryInlay: LuxuryInlaySpec;
  signatureFinish?: 'shimmer' | 'scrub' | 'stardust' | 'translucent';
  edibleGoldLeaf?: EdibleGoldLeafType;
  nutritionFacts?: SoapNutritionFacts;
  thaiSubtitle: string;
  editionNote: string;
  specMetric: string;
  emotionalNeed: string;
  scentMood: string;
  scentIntensity: 1 | 2 | 3 | 4 | 5;
  scentIntensityLabel: string;
  mapX: number;
  mapY: number;
  packagingMarkers: PackagingMarkerId[];
  ingredients: string[];
  bioActives: BioActiveComplex;
  priceUsd: number;
  slice100gUsd: number;
  hugeBlockThb?: number;
  imageUrl: string;
  imageAlt: string;
  fallbackGradient: string;
  senses: SixSenses;
}

export type SoapSizeTier = 'small' | 'full' | 'mega';

export const SOAP_PRICE_TIERS: Record<SoapSizeTier, number> = {
  small: 600,
  full: 1000,
  mega: 2500,
};

export function formatThb(amount: number): string {
  return `฿${amount.toLocaleString('en-US')}`;
}

export interface ThaiTurntableEdition {
  id: string;
  name: string;
  thaiTitle: string;
  priceUsd: number;
  imageUrl: string;
  imageAlt: string;
  fallbackGradient: string;
  description: string;
  chimeFrequencyHz: number;
  angles: {
    angle: number;
    label: string;
    detail: string;
  }[];
}

export interface LoofahSlotSpec {
  slotNumber: 1 | 2;
  label: string;
  material: string;
  swatchHex: string;
}

export interface MarbleCassetteEdition {
  id: string;
  name: string;
  stoneType: 'bright-marble' | 'dark-marble' | 'checkered-occasions';
  subtitle: string;
  scarcityTag: string;
  priceUsd: number;
  compareAtUsd: number;
  imageUrl: string;
  contents: string;
  brightRowIds: string[];
  darkRowIds: string[];
  holidayRowIds?: string[];
  loofahSlots: [LoofahSlotSpec, LoofahSlotSpec];
  description: string;
}

export interface CustomerVoice {
  quote: string;
  author: string;
  city: string;
  soapName: string;
}

const usedBatchNumbers = new Set<number>();
function generateBatchHarvestId(code: string): string {
  let num = Math.floor(11 + Math.random() * 880);
  while (usedBatchNumbers.has(num)) {
    num = ((num + 17) % 989) + 10;
  }
  usedBatchNumbers.add(num);
  return `B#${String(num).padStart(3, '0')}-${code}`;
}

export const ATELIER_MEDIA = {
  heroDreamPearlUrl: brightCoconutWhiteImg,
  featherLetterBorderUrl: featherLetterBorderImg,
  videoUrl: '/assets/aistudio/IMG_8232_c4a11c39.mp4',
  founderIllustrationUrl: '/assets/aistudio/2026-11-05_22.13.14_f3e84c47.png',
  mascotUrl: mascotHuskyImg,
  whiteMarbleCassetteUrl: caseBrightMarbleLoofahImg,
  darkMarbleCassetteUrl: caseDarkMarbleLoofahImg,
  giftBoxSealedUrl: giftBoxSealedImg,
  vintageLaserSoapUrl: woodPlateGentleBubbleImg,
  extraJasmineUrl: thaiJasmineImg,
};

export const ATELIER_BRAND = {
  houseName: 'GentleBubble by AR',
  shortWordmark: 'GentleBubble',
  slogan: 'Wash in Clouds. Bloom in Silk.',
  founderName: 'Archawee Chatkul Na Ayutthaya',
  founderThaiName: 'อาชาวี ฉัตรกุล ณ อยุธยา',
  origin: 'Lad Phrao, Bangkok',
  established: 'Artisanal Savonnerie · Bangkok',
  mascotName: 'Khun Bubble',
  mascotCaption: 'Archawee & Cloud Sheep · Bangkok Studio',
};

const DARK_THEME_HOLIDAY_IDS = new Set([
  'holiday-halloween-nocturne',
  'holiday-christmas-evergreen',
  'holiday-lunar-new-year',
  'holiday-stardust-wish',
]);

export function getSoapGoldLeafType(soap: Pick<SoapCreation, 'id' | 'line' | 'edibleGoldLeaf'>): EdibleGoldLeafType {
  if (soap.edibleGoldLeaf) return soap.edibleGoldLeaf;
  if (soap.line === 'dark') return 'rose-gold';
  if (soap.line === 'bright') return 'yellow-gold';
  return DARK_THEME_HOLIDAY_IDS.has(soap.id) ? 'rose-gold' : 'yellow-gold';
}

const applyStandardThbPricing = (items: SoapCreation[]): SoapCreation[] =>
  items.map((item) => {
    const leafType = getSoapGoldLeafType(item);
    const leafActiveName =
      leafType === 'rose-gold' ? '24k Edible Rose Gold Leaf' : '24k Edible Yellow Gold Leaf';
    const hasLeafActive = item.bioActives.actives.some((a) =>
      a.toLowerCase().includes('gold leaf'),
    );

    return {
      ...item,
      edibleGoldLeaf: leafType,
      priceUsd: SOAP_PRICE_TIERS.full,
      slice100gUsd: SOAP_PRICE_TIERS.small,
      hugeBlockThb: SOAP_PRICE_TIERS.mega,
      bioActives: {
        ...item.bioActives,
        actives: hasLeafActive
          ? item.bioActives.actives
          : [...item.bioActives.actives, leafActiveName],
      },
    };
  });

// ============================================================================
// DARK ACCENT CREATIONS (Espresso Coffee · Pomegranate Ruby · Black Sesame)
// ============================================================================
const RAW_DARK_LINE: SoapCreation[] = [
  {
    id: 'dark-espresso-noir',
    line: 'dark',
    editionNumber: 'I',
    batchHarvestId: generateBatchHarvestId('ESP'),
    name: 'Café Espresso & Choco Bean',
    formulaBrand: 'Roasted Arabica · Cacao Butter',
    colorThemeLabel: 'Roasted Brown · Coffee & Cacao',
    whisperSubtitle: 'Whole Bean Espresso Crystal · Cappuccino Froth Butter',
    sableDescription:
      'Like a crisp brown cacao sablé steeped beside fresh espresso: warm amber coffee glaze wakes dull skin with real roasted beans, while cappuccino butter cream leaves a tender, comforted finish.',
    botanicalLayers: {
      crystalTitle: 'Amber Espresso Bean Gel',
      crystalNote: 'Organic Arabica beans & natural coffee polyphenols lift morning fatigue.',
      crystalColorHex: '#6F3C1E',
      creamTitle: 'Whipped Cappuccino Cream',
      creamNote: 'Raw organic cacao butter & steamed oat milk melt without dryness.',
      creamColorHex: '#DFC7AE',
    },
    palettePair: ['#6F3C1E', '#DFC7AE'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'One pure 24k gold flake resting neatly along the coffee-cream seam.',
    },
    thaiSubtitle: 'เอสเปรสโซ่คั่วและช็อกโกแลตบีน',
    editionNote: 'Dark 01 · Roasted Coffee',
    specMetric: 'Organic Arabica & Cacao Butter',
    emotionalNeed: 'Roasted espresso clarity cushioned by creamy brown cappuccino butter.',
    scentMood: 'Cappuccino & Choco Bean',
    scentIntensity: 5,
    scentIntensityLabel: 'Fresh Espresso & Cacao Nib',
    mapX: 84,
    mapY: 22,
    packagingMarkers: ['split-5050', 'coffee-mg', 'collagen-1-2', 'vit-cead'],
    ingredients: ['Organic Arabica Bean', 'Raw Cacao Nib Butter', 'Chelated Magnesium', '24k Gold Leaf'],
    bioActives: {
      headlineCompound: 'Organic Arabica Caffeine + Theobroma Cacao Butter',
      actives: ['Roasted Espresso Bean', 'Raw Cacao Polyphenols', 'Chelated Magnesium', 'Oat Lipid'],
      mineralCore: 'Micro-Ground Coffee & Cacao Butter',
      skinBenefit: 'Energizes circulation on legs and shoulders while cacao cream restores softness.',
    },
    priceUsd: 38,
    slice100gUsd: 19,
    imageUrl: darkCappuccinoChocoImg,
    imageAlt: 'Cafe Espresso and Choco Bean sculptural soap bar with amber coffee bean gel and creamy cappuccino butter on travertine stone',
    fallbackGradient: 'from-[#6F3C1E] via-[#A98260] to-[#DFC7AE]',
    senses: {
      sight: 'Whole roasted coffee beans suspended in amber clarity beside brushed crema.',
      scent: 'Warm café espresso poured over dark chocolate sablé.',
      touch: 'Silky foam that buffers lightly then finishes soft as butter.',
      sound: 'Crisp snap of cooled caramel sugar.',
      taste: 'Unsweetened cappuccino froth with roasted cocoa.',
      sixthSense: 'Alert, composed warmth for early mornings.',
    },
  },
  {
    id: 'dark-pomegranate-ruby',
    line: 'dark',
    editionNumber: 'II',
    batchHarvestId: generateBatchHarvestId('POM'),
    name: 'Ruby Pomegranate & Rosehip',
    formulaBrand: 'Cold-Pressed Punica · Red Fruit Butter',
    colorThemeLabel: 'Crimson Red · Organic Pomegranate',
    whisperSubtitle: 'Pomegranate Nectar Gel · Rosehip & Cocoa Cream',
    sableDescription:
      'Jewel-bright crimson pomegranate pressed into a tender berry sablé bar: translucent nectar cleanses gently with natural fruit acids while velvety crimson butter cushions skin against dryness.',
    botanicalLayers: {
      crystalTitle: 'Translucent Pomegranate Gel',
      crystalNote: 'Organic pomegranate aril juice & hibiscus alpha-hydroxy glow.',
      crystalColorHex: '#9E1B2B',
      creamTitle: 'Velvet Ruby Seed Cream',
      creamNote: 'Punicic omega-5 seed oil & wild rosehip butter replenish moisture.',
      creamColorHex: '#842430',
    },
    palettePair: ['#9E1B2B', '#6B1C26'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One ultra-fine blush cosmetic sponge whipped neatly for dense ruby foam.',
    },
    thaiSubtitle: 'ทับทิมแดงออร์แกนิกและโรสฮิป',
    editionNote: 'Dark 02 · Red Fruit Complex',
    specMetric: 'Organic Pomegranate Omega-5',
    emotionalNeed: 'Deep crimson pomegranate radiance locked into velvet berry cream.',
    scentMood: 'Spiced Ruby Pomegranate',
    scentIntensity: 4,
    scentIntensityLabel: 'Pomegranate Arils & Wild Rosehip',
    mapX: 80,
    mapY: 72,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Cold-Pressed Pomegranate', 'Punicic Seed Oil', 'Wild Rosehip', 'Red Hibiscus'],
    bioActives: {
      headlineCompound: 'Cold-Pressed Punica Pomegranate (Omega-5 + Ellagic Acid)',
      actives: ['Pomegranate Seed Oil', 'Hibiscus Fruit Acids', 'Rosehip Lycopene', 'Vitamin C'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Anthocyanins',
      skinBenefit: 'Smooths uneven dullness with gentle fruit enzymes and protective berry lipids.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: darkPomegranateRubyImg,
    imageAlt: 'Ruby Pomegranate and Rosehip rectangular bar with deep red crystal gel and crimson velvet butter on travertine stone',
    fallbackGradient: 'from-[#9E1B2B] via-[#6B1C26] to-[#3B1016]',
    senses: {
      sight: 'Sunlit stained-glass crimson joined flush to matte garnet butter.',
      scent: 'Crushed red pomegranate arils warmed with petals.',
      touch: 'Cool fruit jelly gliding swiftly into creamy rosehip balm.',
      sound: 'Clean cut through firm ruby jelly.',
      taste: 'Tart sun-ripened pomegranate nectar.',
      sixthSense: 'Quiet crimson vitality after sundown.',
    },
  },
  {
    id: 'dark-cacao-crema',
    line: 'dark',
    editionNumber: 'III',
    batchHarvestId: generateBatchHarvestId('CAC'),
    name: 'Café Cacao & Oat Latte',
    formulaBrand: 'Roasted Bean · Creamy Oat Sablé',
    colorThemeLabel: 'Espresso Brown · Coffee & Oat',
    whisperSubtitle: 'Roasted Cacao Swirl · Toasted Oat Sablé Cream',
    sableDescription:
      'A comforting dark cacao biscuit steeped in morning coffee: golden-brown espresso crystal glides lightly across tired shoulders while stone-milled oat cream leaves a powdery soft touch.',
    botanicalLayers: {
      crystalTitle: 'Dark Cacao Nibs Crystal',
      crystalNote: 'Roasted bean infusion & raw cane sugar clear revitalizing wash.',
      crystalColorHex: '#59331C',
      creamTitle: 'Toasted Oat Sablé Cream',
      creamNote: 'Colloidal organic oat milk & raw cacao butter calm redness.',
      creamColorHex: '#D8CFC2',
    },
    palettePair: ['#59331C', '#D8CFC2'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Raw Silk Loofah',
      whisperDetail: 'One sun-cured Siam loofah slice tucked inside for smooth body buffing.',
    },
    thaiSubtitle: 'กาแฟโกโก้และครีมโอ๊ตลาเต้',
    editionNote: 'Dark 03 · Espresso & Oat',
    specMetric: 'Roasted Cacao Nibs & Oat Milk',
    emotionalNeed: 'Cozy café mocha warmth paired with gentle oat milk softness.',
    scentMood: 'Cacao Toffee & Latte',
    scentIntensity: 5,
    scentIntensityLabel: 'Toasted Coffee Bean & Warm Oats',
    mapX: 90,
    mapY: 36,
    packagingMarkers: ['split-5050', 'coffee-mg', 'ginseng-root'],
    ingredients: ['Whole Coffee Beans', 'Organic Cacao Butter', 'Colloidal Oat Milk', 'Raw Siam Loofah'],
    bioActives: {
      headlineCompound: 'Espresso Bean + Beta-Glucan Oat Latte',
      actives: ['Coffee Bean Extract', 'Oat Beta-Glucan', 'Cacao Sterols', 'Vitamin E'],
      mineralCore: 'Natural Siam Loofah & Coffee Antioxidants',
      skinBenefit: 'De-puffs tired skin with natural caffeine while oats cocoon moisture.',
    },
    priceUsd: 35,
    slice100gUsd: 18,
    imageUrl: darkCacaoOatImg,
    imageAlt: 'Cafe Cacao and Oat Latte rectangular bar with dark cacao crystal left and speckled oat sable butter right',
    fallbackGradient: 'from-[#59331C] via-[#9C7D66] to-[#D8CFC2]',
    senses: {
      sight: 'Cacao nibs suspended in rich espresso amber beside speckled oat milk.',
      scent: 'Warm cacao toffee drifting over steamed latte milk.',
      touch: 'Creamy biscuit froth with gentle oat grain buffer.',
      sound: 'Porcelain cup warming between palms.',
      taste: 'Bittersweet dark cocoa latte cookie.',
      sixthSense: 'Grounded architectural peace.',
    },
  },
  {
    id: 'dark-sambuca-roast',
    line: 'dark',
    editionNumber: 'IV',
    batchHarvestId: generateBatchHarvestId('SAM'),
    name: 'Brazilian Sambuca & Anise',
    formulaBrand: 'Dark Berry & Spice · Vanilla Bean Cream',
    colorThemeLabel: 'Bordeaux Red · Anise & Bean',
    whisperSubtitle: 'Star Anise Bordeaux Gel · Speckled Vanilla Bean Cream',
    sableDescription:
      'Spiced garnet clarity set cleanly beside vanilla-speckled butter cream: deep botanical wine crystal rinses impurities away while warm vanilla-shea butter leaves skin supple like silk.',
    botanicalLayers: {
      crystalTitle: 'Spiced Bordeaux Anise Gel',
      crystalNote: 'Crushed star anise, blackcurrant & dark coffee botanical clarity.',
      crystalColorHex: '#6E1420',
      creamTitle: 'Vanilla Bean Butter Cream',
      creamNote: 'Real Bourbon vanilla specks folded into whipped shea butter.',
      creamColorHex: '#E5DCCD',
    },
    palettePair: ['#6E1420', '#CBBFA9'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One silky buffer core whips rich cream lather immediately in warm water.',
    },
    thaiSubtitle: 'ซัมบูก้าวนิลาบีน',
    editionNote: 'Dark 04 · Spiced Garnet',
    specMetric: 'Star Anise & Bourbon Vanilla',
    emotionalNeed: 'Rich aromatic star anise spice smoothed by real vanilla bean cream.',
    scentMood: 'Brazilian Sambuca',
    scentIntensity: 5,
    scentIntensityLabel: 'Star Anise & Smoked Vanilla',
    mapX: 84,
    mapY: 58,
    packagingMarkers: ['split-5050', 'coffee-mg', 'ginseng-root', 'vit-cead'],
    ingredients: ['Crushed Star Anise', 'Bourbon Vanilla Bean', 'Brazilian Arabica', 'Shea Butter'],
    bioActives: {
      headlineCompound: 'Star Anise Phytosterols + Real Vanilla Bean Lipid',
      actives: ['Star Anise Extract', 'Brazilian Coffee Oil', 'Vanilla Vanillin', 'Shea Butter'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Mica',
      skinBenefit: 'Clarifies congested pores and replenishes delicate winter-dry skin.',
    },
    priceUsd: 38,
    slice100gUsd: 19,
    imageUrl: darkSambucaAniseImg,
    imageAlt: 'Brazilian Sambuca and Anise rectangular soap with bordeaux star anise crystal left and vanilla bean speckled cream right',
    fallbackGradient: 'from-[#6E1420] via-[#9E7876] to-[#E5DCCD]',
    senses: {
      sight: 'Botanical star anise jewels floating in deep wine glass beside vanilla cream.',
      scent: 'Warm star anise espresso smoothed with sweet vanilla bean.',
      touch: 'Satin buffer turning instantly into cushiony vanilla froth.',
      sound: 'Heavy crystal swirling dark cordial.',
      taste: 'Warm spiced vanilla shortbread.',
      sixthSense: 'Quiet, assured evening confidence.',
    },
  },
  {
    id: 'dark-avocado-sesame',
    line: 'dark',
    editionNumber: 'V',
    batchHarvestId: generateBatchHarvestId('SES'),
    name: 'Dark Matcha & Black Sesame',
    formulaBrand: 'Forest Botanical · Roasted Sesame Oil',
    colorThemeLabel: 'Forest Green & Charcoal · Tea & Seed',
    whisperSubtitle: 'Deep Emerald Tea Crystal · Cold-Milled Black Sesame Butter',
    sableDescription:
      'Cool forest leaf crystal fused smoothly beside nutty black sesame stone cream: rich in organic tea catechins and natural sesamol vitamin E so dry elbows and knees feel remarkably supple.',
    botanicalLayers: {
      crystalTitle: 'Forest Matcha Leaf Gel',
      crystalNote: 'Whole steeped green tea leaf catechins purify & tone gently.',
      crystalColorHex: '#157A54',
      creamTitle: 'Black Sesame Seed Butter',
      creamNote: 'Cold-pressed black sesame oil & dark cocoa nourish barrier.',
      creamColorHex: '#2B3034',
    },
    palettePair: ['#157A54', '#2B3034'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One hidden natural pearl resting gently inside the translucent emerald side.',
    },
    thaiSubtitle: 'ชาเขียวเข้มและงาดำบดเย็น',
    editionNote: 'Dark 05 · Jade & Sesame',
    specMetric: 'Matcha Catechins & Sesamol E',
    emotionalNeed: 'Deep green botanical freshness grounded in cold-milled black sesame oil.',
    scentMood: 'Matcha Leaf & Sesame',
    scentIntensity: 4,
    scentIntensityLabel: 'Wild Matcha & Toasted Sesame',
    mapX: 66,
    mapY: 28,
    packagingMarkers: ['split-5050', 'vit-cead', 'pearl-minerals'],
    ingredients: ['Organic Matcha Leaf', 'Cold-Milled Black Sesame', 'Avocado Oil', '1 Freshwater Pearl'],
    bioActives: {
      headlineCompound: 'Green Tea EGCG Catechins + Cold-Milled Sesamol Vitamin E',
      actives: ['Green Tea EGCG', 'Cold-Pressed Sesame', 'Chlorophyll', 'Avocado Phytosterols'],
      mineralCore: '1 Freshwater Pearl & Trace Calcium',
      skinBenefit: 'Buffs flaky spots softly with fine toasted seeds and antioxidant oils.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: darkMatchaSesameImg,
    imageAlt: 'Dark Matcha and Black Sesame rectangular bar with forest green tea leaf gel left and charcoal black sesame butter right',
    fallbackGradient: 'from-[#157A54] via-[#1C3B32] to-[#2B3034]',
    senses: {
      sight: 'Jewel emerald leaf gel bonded seamlessly beside matte sesame stone.',
      scent: 'Crushed green tea garden meeting warm roasted black sesame.',
      touch: 'Gentle seed grain quickly softened in silky oil foam.',
      sound: 'Quiet stone pestle turning roasted sesame.',
      taste: 'Matcha latte paired with black sesame biscuit.',
      sixthSense: 'Poised, meditative clarity.',
    },
  },
  {
    id: 'dark-chai-quartz',
    line: 'dark',
    editionNumber: 'VI',
    batchHarvestId: generateBatchHarvestId('CHY'),
    name: 'Red Chai & Velvet Quartz',
    formulaBrand: 'Spiced Tea · Silk Almond Butter',
    colorThemeLabel: 'Plum Red & Ivory · Tea & Pearl',
    whisperSubtitle: 'Spiced Tea Petal Crystal · Whipped Almond Biscuit Cream',
    sableDescription:
      'Delicate lavender-plum tea translucency beside soft almond biscuit soap: organic black tea tannins wake dull skin while sweet almond cream keeps every wash tender.',
    botanicalLayers: {
      crystalTitle: 'Spiced Red Chai Gel',
      crystalNote: 'Organic red chai petals & cardamom awaken radiance.',
      crystalColorHex: '#8E6274',
      creamTitle: 'Almond Biscuit Butter',
      creamNote: 'Whipped sweet almond milk & coconut lipids hug dry skin.',
      creamColorHex: '#EAE3D6',
    },
    palettePair: ['#8E6274', '#E3DACB'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One luminous freshwater pearl nested inside the clear botanical crown.',
    },
    thaiSubtitle: 'ชาแดงและอัลมอนด์บัตเตอร์',
    editionNote: 'Dark 06 · Velvet Quartz',
    specMetric: 'Red Chai Tannins & Almond',
    emotionalNeed: 'Soft spiced tea tranquility cushioned inside creamy almond butter.',
    scentMood: 'Spiced Chai & Benzoin',
    scentIntensity: 4,
    scentIntensityLabel: 'Red Tea, Cardamom & Almond',
    mapX: 74,
    mapY: 46,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2'],
    ingredients: ['Spiced Red Tea', 'Sweet Almond Cream', 'Benzoin Resin', '1 Freshwater Pearl'],
    bioActives: {
      headlineCompound: 'Red Chai Polyphenols + Sweet Almond Lipid',
      actives: ['Assam Chai Extract', 'Sweet Almond Milk', 'Siam Benzoin', 'Collagen I + II'],
      mineralCore: 'Freshwater Pearl Amino Calcium',
      skinBenefit: 'Calms sensitivity while silky tea foam leaves skin softly glowing.',
    },
    priceUsd: 35,
    slice100gUsd: 18,
    imageUrl: darkChaiQuartzImg,
    imageAlt: 'Red Chai and Velvet Quartz rectangular bar with plum crystal petals left and ivory almond butter cream right',
    fallbackGradient: 'from-[#8E6274] via-[#C6B3B7] to-[#EAE3D6]',
    senses: {
      sight: 'Dusty amethyst crystal infused with red tea petals beside ivory cream.',
      scent: 'Warm cardamom chai tea with gentle Siam benzoin mist.',
      touch: 'Featherlight bubble glaze smoothing swiftly like silk cream.',
      sound: 'Quiet silver spoon resting beside porcelain teapot.',
      taste: 'Spiced almond tea cookie.',
      sixthSense: 'Unrushed serenity after sunset.',
    },
  },
  {
    id: 'dark-charcoal-oolong',
    line: 'dark',
    editionNumber: 'VII',
    batchHarvestId: generateBatchHarvestId('OOL'),
    name: 'Smoked Oolong & Cacao Carbon',
    formulaBrand: 'High-Mountain Tea · Bamboo Ash Butter',
    colorThemeLabel: 'Amber & Espresso Slate · Tea & Carbon',
    whisperSubtitle: 'Smoked Longan & Oolong Crystal · Bamboo Carbon Cocoa Cream',
    sableDescription:
      'Sun-amber roasted tea crystal paired with velvety charcoal cacao cream: mineral carbon draws out urban impurities cleanly while warm longan nectar restores silky suppleness.',
    botanicalLayers: {
      crystalTitle: 'Amber Oolong Longan Gel',
      crystalNote: 'Whole dried longan & roasted high-mountain oolong tea clarity.',
      crystalColorHex: '#9C6220',
      creamTitle: 'Bamboo Carbon Cacao Cream',
      creamNote: 'Activated micro-bamboo carbon whipped smoothly into shea butter.',
      creamColorHex: '#232629',
    },
    palettePair: ['#9C6220', '#232629'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Raw Silk Loofah',
      whisperDetail: 'One golden loofah weave inlaid beside the roasted oolong crystal.',
    },
    thaiSubtitle: 'ชาอู่หลงลำไยรมควัน',
    editionNote: 'Dark 07 · Binchotan Tea',
    specMetric: 'Oolong Tea & Bamboo Carbon',
    emotionalNeed: 'Clean city pore detox balanced by warm smoky amber tea sweetness.',
    scentMood: 'Smoked Oolong & Longan',
    scentIntensity: 5,
    scentIntensityLabel: 'Roasted Oolong Tea & Dried Longan',
    mapX: 70,
    mapY: 78,
    packagingMarkers: ['split-5050', 'ginseng-root', 'vit-cead'],
    ingredients: ['High-Mountain Oolong', 'Smoked Golden Longan', 'Bamboo Charcoal', 'Shea Butter'],
    bioActives: {
      headlineCompound: 'Roasted Oolong Antioxidants + Micro-Bamboo Carbon',
      actives: ['Roasted Oolong Leaf', 'Smoked Longan Nectar', 'Bamboo Charcoal', 'Red Ginseng'],
      mineralCore: 'Silk Loofah Fiber & Alkaline Bamboo Trace',
      skinBenefit: 'Decongests skin effortlessly without stripping natural oils.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: darkOolongCarbonImg,
    imageAlt: 'Smoked Oolong and Cacao Carbon rectangular bar with golden longan tea crystal left and dark bamboo charcoal butter right',
    fallbackGradient: 'from-[#9C6220] via-[#4D3B2B] to-[#232629]',
    senses: {
      sight: 'Sunlit honey-amber fruit crystal bonded clean against volcanic charcoal.',
      scent: 'Warm caramelized longan smoke steeping beside toasted oolong leaf.',
      touch: 'Ultra-clean mineral slate wash followed by silky tea lather.',
      sound: 'Crisp roasted leaves crackling in warm water.',
      taste: 'Caramelized longan tea infusion.',
      sixthSense: 'Complete evening renewal.',
    },
  },
  {
    id: 'dark-volcanic-scrub',
    line: 'dark',
    editionNumber: 'VIII',
    batchHarvestId: generateBatchHarvestId('VSB'),
    name: 'Volcanic Pumice & Oat Scrub',
    formulaBrand: 'Basalt Pumice Scrub · Wildflower Honey',
    colorThemeLabel: 'Granite Charcoal · Honey Scrub',
    whisperSubtitle: 'Crushed Volcanic Grain · Toasted Oat & Shea Butter',
    sableDescription:
      'Dual-textured exfoliating mineral scrub fusing fine volcanic basalt pumice, toasted oats, and crushed apricot shell beside wildflower-honeyed shea butter.',
    botanicalLayers: {
      crystalTitle: 'Volcanic Pumice Mineral Scrub',
      crystalNote: 'Micro-milled basalt pumice & toasted oat bran polish skin cleanly.',
      crystalColorHex: '#524E4A',
      creamTitle: 'Honeyed Shea Butter Base',
      creamNote: 'Unrefined wildflower honey & whipped organic shea calm freshly buffed skin.',
      creamColorHex: '#E8DEC8',
    },
    palettePair: ['#524E4A', '#E8DEC8'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Natural Loofah Fiber',
      whisperDetail: 'Botanical exfoliating mesh woven cleanly through the mineral scrub side.',
    },
    signatureFinish: 'scrub',
    thaiSubtitle: 'สครับหินภูเขาไฟและข้าวโอ๊ตน้ำผึ้ง',
    editionNote: 'Dark 08 · Botanical Scrub',
    specMetric: 'Basalt Pumice & Rolled Oats',
    emotionalNeed: 'Invigorating mineral scrub buffing cushioned by golden honey cream.',
    scentMood: 'Toasted Oat & Warm Honey Scrub',
    scentIntensity: 4,
    scentIntensityLabel: 'Earth Mineral & Wild Honey',
    mapX: 68,
    mapY: 36,
    packagingMarkers: ['split-5050', 'collagen-1-2', 'vit-cead', 'pearl-minerals'],
    ingredients: ['Volcanic Pumice Grain', 'Toasted Oat Bran', 'Wildflower Honey', 'Raw Shea Butter'],
    bioActives: {
      headlineCompound: 'Micro-Basalt Silica + Colloidal Oat Lipids',
      actives: ['Volcanic Pumice', 'Rolled Oat Bran', 'Wildflower Honey', 'Vitamin E'],
      mineralCore: 'Exfoliating Basalt Grain & Honey Glaze',
      skinBenefit: 'Smooths elbows, heels, and shoulders while sealing in warm moisture.',
    },
    priceUsd: 40,
    slice100gUsd: 20,
    imageUrl: scrubVolcanicImg,
    imageAlt: 'Volcanic Pumice and Oat Scrub artisan soap bar with speckled charcoal mineral grain and honeyed shea butter on travertine stone',
    fallbackGradient: 'from-[#524E4A] via-[#9E8865] to-[#E8DEC8]',
    senses: {
      sight: 'Speckled volcanic stone polish fused cleanly with golden honey seam.',
      scent: 'Warm toasted oats drizzled with dark orchard honey.',
      touch: 'Crisp tactile mineral grains dissolving into silky cream.',
      sound: 'Gentle effervescent crackle across wet river pebble.',
      taste: 'Honey-toasted oat sablé wafer.',
      sixthSense: 'Grounded physical renewal.',
    },
  },
  {
    id: 'dark-sulfur-salicylic',
    line: 'dark',
    editionNumber: 'IX',
    batchHarvestId: generateBatchHarvestId('SLF'),
    name: 'Sulfur & Salicylic Acid Pore-Clearing Bar',
    formulaBrand: 'Salicylic BHA 2.0% · Precipitated Sulfur 3.0%',
    colorThemeLabel: 'Pale Yellow & Amber Glycerin · 50/50 Syndet',
    whisperSubtitle: 'Matte Pale-Yellow Sulfur Syndet · Crystal Amber BHA Glycerin',
    sableDescription:
      'Unclogs pores and absorbs excess sebum without harshness.',
    botanicalLayers: {
      crystalTitle: 'Translucent Amber Salicylic (BHA 2.0%) Gel',
      crystalNote: 'Propanediol & 7.0% vegetable glycerin carry 2.0% Salicylic Acid gently into pores.',
      crystalColorHex: '#D69A32',
      creamTitle: 'Matte Pale-Yellow Precipitated Sulfur 3.0% Base',
      creamNote: '75.0% soap-free syndet base buffers sebum cleanly at skin-kind pH 4.5 - 5.2.',
      creamColorHex: '#EDE69A',
    },
    palettePair: ['#D69A32', '#EDE69A'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One airy micro-sponge lifts gentle clarifying lather without abrasion.',
    },
    signatureFinish: 'translucent',
    nutritionFacts: {
      servingSize: '100g Bar',
      activeIngredients: {
        'Salicylic Acid (BHA)': '2.0%',
        'Precipitated Sulfur': '3.0%',
      },
      baseAndHydration: {
        'Soap-Free Syndet Base': '75.0%',
        Propanediol: '12.0%',
        'Vegetable Glycerin': '7.0%',
        Preservative: '1.0%',
      },
      pHLevel: '4.5 - 5.2',
    },
    thaiSubtitle: 'ซัลเฟอร์และกรดซาลิไซลิก 50/50 กระชับรูขุมขน',
    editionNote: 'Dark 09 · BHA & Sulfur Clarifying',
    specMetric: '2.0% BHA · 3.0% Sulfur · pH 4.5 - 5.2',
    emotionalNeed: 'Calm pore clarity without tightness or barrier stripping.',
    scentMood: 'Warm Amber Resin & Clean Herb',
    scentIntensity: 3,
    scentIntensityLabel: 'Crisp Botanical Amber',
    mapX: 76,
    mapY: 64,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Salicylic Acid (BHA 2.0%)', 'Precipitated Sulfur (3.0%)', 'Soap-Free Syndet Base', 'Vegetable Glycerin'],
    bioActives: {
      headlineCompound: '2.0% Salicylic Acid (BHA) + 3.0% Precipitated Sulfur · pH 4.5 - 5.2',
      actives: ['Salicylic Acid 2.0%', 'Precipitated Sulfur 3.0%', 'Propanediol 12.0%', 'Vegetable Glycerin 7.0%'],
      mineralCore: 'pH-Balanced 75.0% Soap-Free Syndet Matrix',
      skinBenefit: 'Unclogs pores and absorbs excess sebum without harshness.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: sulfurSalicylicImg,
    imageAlt: 'Sulfur and Salicylic Acid Pore-Clearing Bar split 50/50 opaque matte pale-yellow and crystal-clear translucent amber glycerin on stone',
    fallbackGradient: 'from-[#D69A32] via-[#E3C165] to-[#EDE69A]',
    senses: {
      sight: 'Matte pale-yellow botanical cream joined seamlessly to sunlit amber glycerin.',
      scent: 'Clean mineral amber softened by mild herbal notes.',
      touch: 'Weightless cushioned syndet foam rinsing crisp and comfortable.',
      sound: 'Cool water gliding cleanly over smooth stone.',
      taste: 'Warm citrus peel and mineral tea.',
      sixthSense: 'Balanced, clarified calm.',
    },
  },
  {
    id: 'dark-vetiver-obsidian',
    line: 'dark',
    editionNumber: 'X',
    batchHarvestId: generateBatchHarvestId('OBS'),
    name: 'Obsidian Vetiver & Smoky Quartz',
    formulaBrand: 'Black Sesame Clay · Wild Vetiver Root',
    colorThemeLabel: 'Obsidian Black & Smoky Violet',
    whisperSubtitle: 'Obsidian Charcoal Cream · Smoky Translucent Quartz Gel',
    sableDescription:
      'Velvety obsidian charcoal cream paired beside smoked amber-violet mineral gel steeped in wild Thai vetiver.',
    botanicalLayers: {
      crystalTitle: 'Smoky Amber-Violet Crystal Gel',
      crystalNote: 'Wild vetiver root & mineral mica sparkle softly across translucent amber gel.',
      crystalColorHex: '#5A4A64',
      creamTitle: 'Obsidian Charcoal & Sesame Butter',
      creamNote: 'Binchotan bamboo carbon & black sesame oil purify without drying.',
      creamColorHex: '#25262A',
    },
    palettePair: ['#5A4A64', '#25262A'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Raw Dark Loofah',
      whisperDetail: 'Fine woven botanical loofah fiber cushioned beneath mineral foam.',
    },
    signatureFinish: 'shimmer',
    thaiSubtitle: 'แฝกหอมสีนิลและควอตซ์รมควัน',
    editionNote: 'Dark 10 · Obsidian Vetiver',
    specMetric: 'Bamboo Carbon & Vetiver Root',
    emotionalNeed: 'Deep smoky evening clarity finished with silky charcoal moisture.',
    scentMood: 'Smoked Vetiver & Black Amber',
    scentIntensity: 4,
    scentIntensityLabel: 'Deep Earth Vetiver & Smoke',
    mapX: 84,
    mapY: 74,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Binchotan Carbon', 'Wild Vetiver Root', 'Black Sesame Oil', 'Mineral Mica'],
    bioActives: {
      headlineCompound: 'Wild Vetiver Root + Bamboo Carbon',
      actives: ['Binchotan Carbon', 'Vetiver Distillate', 'Black Sesame', 'Vitamin E'],
      mineralCore: 'Obsidian Clay & Translucent Quartz',
      skinBenefit: 'Draws out urban impurities while keeping skin barrier supple.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: darkVetiverObsidianImg,
    imageAlt: 'Obsidian Vetiver and Smoky Quartz 50/50 bar matte charcoal left and translucent smoky crystal right on dark stone',
    fallbackGradient: 'from-[#5A4A64] via-[#3A3540] to-[#25262A]',
    senses: {
      sight: 'Obsidian stone cream meeting clear smoky quartz glass.',
      scent: 'Rain-soaked vetiver root and warm amber wood.',
      touch: 'Silky mineral foam gliding effortlessly clean.',
      sound: 'Cool stream brushing dark basalt stone.',
      taste: 'Roasted oolong leaf & dark fig.',
      sixthSense: 'Quiet midnight grounding.',
    },
  },
];

export const DARK_5050_LINE: SoapCreation[] = applyStandardThbPricing(RAW_DARK_LINE);

// ============================================================================
// BRIGHT ACCENT CREATIONS (Thai Coconut · Avocado Green · Spirulina · Shimmer)
// ============================================================================
const RAW_BRIGHT_LINE: SoapCreation[] = [
  {
    id: 'bright-coconut-pearl',
    line: 'bright',
    editionNumber: 'I',
    batchHarvestId: generateBatchHarvestId('COC'),
    name: 'Thai Coconut Milk & Pearl',
    formulaBrand: 'Virgin Coco Lauric · Freshwater Nacre',
    colorThemeLabel: 'Pure Ivory White · Organic Coconut',
    whisperSubtitle: 'Crystal Coconut Dew · Snowy Thai Coconut Milk Cream',
    sableDescription:
      'Pure snowy Thai coconut milk whipped like delicate meringues beside crystal-clear dew: cold-pressed virgin coconut lipids flood thirsty skin with comforting white silk.',
    botanicalLayers: {
      crystalTitle: 'Crystal Coconut Dew Gel',
      crystalNote: 'Pure coconut water electrolytes & luminous pearl amino rinse.',
      crystalColorHex: '#8FBCD9',
      creamTitle: 'Snowy Coconut Milk Cream',
      creamNote: 'Virgin Thai coconut oil & rich lauric butter milk lock in glow.',
      creamColorHex: '#F3EDE1',
    },
    palettePair: ['#9EC8E5', '#F3EDE1'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One genuine shimmering freshwater pearl gifted right beside every bar.',
    },
    thaiSubtitle: 'น้ำนมมะพร้าวบริสุทธิ์และไข่มุก',
    editionNote: 'Bright 01 · Pure White Coconut',
    specMetric: 'Organic Thai Coconut & Pearl',
    emotionalNeed: 'Pure minimalist hydration powered by organic Thai coconut oil and cream.',
    scentMood: 'Thai Coconut Oil Cream',
    scentIntensity: 3,
    scentIntensityLabel: 'Fresh Whipped Coconut & Milk Silk',
    mapX: 28,
    mapY: 32,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2'],
    ingredients: ['Thai Coconut Milk Oil', 'Virgin Coconut Butter', '1 Freshwater Pearl', 'Collagen I+II'],
    bioActives: {
      headlineCompound: 'Cold-Pressed Virgin Thai Coconut Lauric Cream + Pearl',
      actives: ['Virgin Coconut Oil', 'Fresh Coconut Milk', 'Pearl Conchiolin', 'Panthenol B5'],
      mineralCore: 'Freshwater Pearl & Natural Coconut Electrolytes',
      skinBenefit: 'Cushions sensitive and dry skin in weightless tropical silk with zero residue.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: brightCoconutWhiteImg,
    imageAlt: 'Thai Coconut Milk and Pearl rectangular bar with clear crystal left and snowy coconut butter cream right beside a pearl',
    fallbackGradient: 'from-[#DCE9F2] via-[#F2F4F7] to-[#F9F6EE]',
    senses: {
      sight: 'Glass-clear water block fused seamlessly against pure snowy coconut cream.',
      scent: 'Warm fresh-pressed Thai coconut cream and clean cotton dew.',
      touch: 'Lush creamy coconut milk lather leaving zero dryness.',
      sound: 'Cool water drops glistening along white marble.',
      taste: 'Sweet chilled coconut custard over crisp meringue.',
      sixthSense: 'Quiet, unhurried sanctuary.',
    },
  },
  {
    id: 'bright-avocado-matcha',
    line: 'bright',
    editionNumber: 'II',
    batchHarvestId: generateBatchHarvestId('AVO'),
    name: 'Green Avocado & Leaf Dew',
    formulaBrand: 'Cold-Pressed Avocado · Organic Chlorophyll',
    colorThemeLabel: 'Fresh Green · Organic Avocado',
    whisperSubtitle: 'Green Herbal Leaf Crystal · Whipped Organic Avocado Butter',
    sableDescription:
      'Crisp green leaf crystal joined smoothly to pale whipped avocado butter: packed with cold-pressed avocado phytosterols and chlorophyll to plump tired skin with tender nourishment.',
    botanicalLayers: {
      crystalTitle: 'Emerald Herbal Leaf Gel',
      crystalNote: 'Organic botanical leaf infusion & refreshing chlorophyll clear rinse.',
      crystalColorHex: '#5CA96A',
      creamTitle: 'Whipped Avocado Butter',
      creamNote: 'Cold-pressed Hass avocado butter, squalane & vitamin E lipid.',
      creamColorHex: '#B6CFA0',
    },
    palettePair: ['#5CA96A', '#B6CFA0'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Raw Silk Loofah',
      whisperDetail: 'One airy Siam botanical loofah sliver pressed gently into fresh leaf gel.',
    },
    thaiSubtitle: 'อะโวคาโดสกัดเย็นและใบชาเขียว',
    editionNote: 'Bright 02 · Cold-Pressed Avocado',
    specMetric: 'Cold-Pressed Avocado & Leaf',
    emotionalNeed: 'Green garden botanical clarity paired with creamy vitamin-rich avocado oil.',
    scentMood: 'Crushed Leaf & Avocado Cream',
    scentIntensity: 3,
    scentIntensityLabel: 'Fresh Orchard Leaf & Soft Avocado',
    mapX: 16,
    mapY: 74,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Cold-Pressed Avocado Oil', 'Organic Chlorophyll', 'Matcha Leaf', 'Vitamin E + D3'],
    bioActives: {
      headlineCompound: 'Cold-Pressed Hass Avocado Phytosterols + Matcha Leaf',
      actives: ['Unrefined Avocado Oil', 'Botanical Chlorophyll', 'Olive Squalane', 'Vitamin E'],
      mineralCore: 'Raw Siam Loofah & Avocado Oleic Acid',
      skinBenefit: 'Replenishes dry, tight skin immediately with avocado omegas and soothing leaf.',
    },
    priceUsd: 33,
    slice100gUsd: 17,
    imageUrl: brightAvocadoGreenImg,
    imageAlt: 'Green Avocado and Leaf Dew rectangular bar with translucent green herb crystal left and pastel avocado butter right',
    fallbackGradient: 'from-[#5CA96A] via-[#89BE86] to-[#B6CFA0]',
    senses: {
      sight: 'Sun-filtered green herbal gel bonded effortlessly beside whipped avocado pastel.',
      scent: 'Crisp crushed garden herbs resting on sweet creamy avocado.',
      touch: 'Deceptively silky oil-rich lather that cushions even wind-chapped hands.',
      sound: 'Soft breeze moving across orchard leaves.',
      taste: 'Fresh cream avocado & chilled green tea.',
      sixthSense: 'Restorative morning freshness.',
    },
  },
  {
    id: 'bright-sable-honey',
    line: 'bright',
    editionNumber: 'III',
    batchHarvestId: generateBatchHarvestId('SAB'),
    name: 'Butter Sablé & Honeycomb',
    formulaBrand: 'French Biscuit Cream · Raw Blossom Honey',
    colorThemeLabel: 'Warm Biscuit Gold · Butter & Honey',
    whisperSubtitle: 'Blossom Comb Honey Crystal · Oat & Butter Sablé Cream',
    sableDescription:
      'Baked-warm French butter cookie softness beside clear golden honeycomb: wildflower enzymes polish lightly while oat-milk biscuit butter cocoons your skin after a long shower.',
    botanicalLayers: {
      crystalTitle: 'Golden Honeycomb Gel',
      crystalNote: 'Organic highland blossom comb honey & gentle enzyme rinse.',
      crystalColorHex: '#D88D2A',
      creamTitle: 'Butter Sablé Oat Cream',
      creamNote: 'Toasted oat crumble & cultured buttercream seal soft satin comfort.',
      creamColorHex: '#EAD3B1',
    },
    palettePair: ['#D88D2A', '#EAD3B1'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'One crisp edible 24k gold flake sealed neatly along the honeycomb edge.',
    },
    thaiSubtitle: 'บัตเตอร์ซาเบล่และน้ำผึ้งป่า',
    editionNote: 'Bright 03 · French Butter Sablé',
    specMetric: 'Wild Blossom Honey & Oat Sablé',
    emotionalNeed: 'Oven-warm biscuit coziness sealed cleanly inside raw honey transparency.',
    scentMood: 'Butter Sablé & Acacia Honey',
    scentIntensity: 4,
    scentIntensityLabel: 'Warm Shortbread Biscuit & Comb Honey',
    mapX: 34,
    mapY: 18,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Raw Honeycomb Gel', 'Cultured Oat Sablé', '24k Gold Leaf', 'Vitamins D3 + E'],
    bioActives: {
      headlineCompound: 'Highland Honeycomb Enzymes + Colloidal Oat Sablé',
      actives: ['Raw Comb Honey', 'Toasted Oat Crumble', 'Sweet Butter Lipid', 'Provitamin A'],
      mineralCore: '24k Edible Gold Leaf & Honey Trace Enzymes',
      skinBenefit: 'Gently buffs rough patches with fine toasted oats while locking honeyed moisture.',
    },
    priceUsd: 32,
    slice100gUsd: 16,
    imageUrl: brightHoneySableImg,
    imageAlt: 'Butter Sable and Honeycomb rectangular soap with golden honeycomb crystal left and toasted oat sable butter right',
    fallbackGradient: 'from-[#D88D2A] via-[#DFB06E] to-[#EAD3B1]',
    senses: {
      sight: 'Sun-golden honeycomb glinting beside speckled French shortbread cream.',
      scent: 'Warm vanilla butter sablé drizzled lightly in golden blossom honey.',
      touch: 'Delicate oat crumble gliding effortlessly into biscuit milk mousse.',
      sound: 'Crisp golden biscuit breaking gently.',
      taste: 'Honey-glazed French butter sablé beside warm milk.',
      sixthSense: 'Golden comforting warmth.',
    },
  },
  {
    id: 'bright-anchan-sable',
    line: 'bright',
    editionNumber: 'IV',
    batchHarvestId: generateBatchHarvestId('AZU'),
    name: 'Sky Anchan & Cookie Cream',
    formulaBrand: 'Blue Butterfly Pea · Golden Biscuit',
    colorThemeLabel: 'Sky Blue & Gold · Anchan & Sablé',
    whisperSubtitle: 'Celestial Blue Anchan Crystal · Golden Butter Cookie Cream',
    sableDescription:
      'Crystal-blue Anchan flower sky joined smoothly to golden butter-cookie cream: blue anthocyanins cool and refresh skin clarity, while golden biscuit lipids keep skin tender and dewy.',
    botanicalLayers: {
      crystalTitle: 'Sky Blue Anchan Crystal',
      crystalNote: 'Blue butterfly pea & blue spirulina mineral gel cools skin.',
      crystalColorHex: '#72B3DF',
      creamTitle: 'Golden Cookie Cream',
      creamNote: 'Whipped shea, golden oat crumble & coconut cookie cream.',
      creamColorHex: '#D8B36A',
    },
    palettePair: ['#72B3DF', '#D8B36A'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'One floating 24k gold whisper catching sky-blue sunlight.',
    },
    thaiSubtitle: 'ดอกอัญชันสีฟ้าและคุกกี้ครีม',
    editionNote: 'Bright 04 · Sky Blue & Cookie',
    specMetric: 'Anchan Petal & Golden Cookie',
    emotionalNeed: 'Cool sky-blue mineral refreshment balanced on warm golden cookie butter.',
    scentMood: 'Blue Anchan & Butter Cookie',
    scentIntensity: 3,
    scentIntensityLabel: 'Blue Petal Dew & Golden Biscuit',
    mapX: 14,
    mapY: 56,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'coffee-mg', 'vit-cead'],
    ingredients: ['Blue Anchan Petal', 'Blue Spirulina', 'Golden Cookie Cream', '24k Gold Leaf'],
    bioActives: {
      headlineCompound: 'Blue Butterfly Pea Anthocyanins + Golden Cookie Cream',
      actives: ['Clitoria Ternatea Anchan', 'Blue Spirulina', 'Golden Oat Butter', 'Marine Mg'],
      mineralCore: '24k Gold Leaf & Deep-Sea Magnesium',
      skinBenefit: 'Calms flushed heat instantly while buttery oat biscuit seals lasting hydration.',
    },
    priceUsd: 34,
    slice100gUsd: 17,
    imageUrl: brightSkyAnchanImg,
    imageAlt: 'Sky Anchan and Cookie Cream rectangular bar with cerulean sky blue gold-fleck gel left and golden biscuit cream right',
    fallbackGradient: 'from-[#72B3DF] via-[#A9CBE2] to-[#D8B36A]',
    senses: {
      sight: 'Clear pastel sky-blue crystal sparkling beside warm toasted biscuit.',
      scent: 'Cool blue rainwater mist settling into warm baked butter cookie.',
      touch: 'Crisp cooling splash transitioning into soothing golden balm.',
      sound: 'Calm lagoon tide kissing warm sand.',
      taste: 'Sweet butterfly-pea milk with crisp shortbread.',
      sixthSense: 'Clear sunlit optimism.',
    },
  },
  {
    id: 'bright-pomegranate-rose',
    line: 'bright',
    editionNumber: 'V',
    batchHarvestId: generateBatchHarvestId('ROS'),
    name: 'Pink Pomegranate & Rose Milk',
    formulaBrand: 'Punica Fruit Glow · Damask Rose Cream',
    colorThemeLabel: 'Pink Ruby · Pomegranate & Rose',
    whisperSubtitle: 'Pink Pomegranate Aril Crystal · Whipped Rose Milk Butter',
    sableDescription:
      'Pastel pink pomegranate jewels suspended in crystal rose jelly beside soft blush milk cream: fruit antioxidants brighten naturally while creamy rose-butter leaves a baby-soft bloom.',
    botanicalLayers: {
      crystalTitle: 'Pink Pomegranate Rose Gel',
      crystalNote: 'Fresh pink pomegranate fruit jewels & damask rose hydro-glow.',
      crystalColorHex: '#D85873',
      creamTitle: 'Whipped Rose Milk Butter',
      creamNote: 'Cold-pressed pomegranate butter & rosehip milk plump skin.',
      creamColorHex: '#E9C5C8',
    },
    palettePair: ['#D85873', '#E9C5C8'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One rose-tinted fine makeup buffer pad whips rich floral milk.',
    },
    thaiSubtitle: 'ทับทิมชมพูและนมกุหลาบ',
    editionNote: 'Bright 05 · Pastel Pomegranate',
    specMetric: 'Pink Pomegranate & Damask Rose',
    emotionalNeed: 'Soft pastel rose clarity topped with antioxidant-rich pink pomegranate.',
    scentMood: 'Pink Pomegranate & Rose Milk',
    scentIntensity: 4,
    scentIntensityLabel: 'Fresh Pink Pomegranate & Damask Rose',
    mapX: 38,
    mapY: 70,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Pink Pomegranate Arils', 'Damask Rosewater', 'Whipped Rose Milk', 'Cosmetic Sponge'],
    bioActives: {
      headlineCompound: 'Pink Pomegranate Ellagic Polyphenols + Damask Rose Milk',
      actives: ['Pink Pomegranate Juice', 'Damask Rosewater', 'Vitamin C + E', 'Rosehip Butter'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Carotenoids',
      skinBenefit: 'Gently brightens dull skin while rose-milk lipids keep cheeks bouncy.',
    },
    priceUsd: 33,
    slice100gUsd: 17,
    imageUrl: brightPinkPomImg,
    imageAlt: 'Pink Pomegranate and Rose Milk rectangular bar with translucent rose pomegranate aril gel left and pastel blush cream right',
    fallbackGradient: 'from-[#D85873] via-[#E49CA8] to-[#E9C5C8]',
    senses: {
      sight: 'Sparkling pink pomegranate jewels glinting beside blush velvet cream.',
      scent: 'Juicy crushed pink pomegranate wrapped in sweet rose milk.',
      touch: 'Plush rose silk sponge foaming into light rosy cloud.',
      sound: 'Morning dew dropping onto rose petals.',
      taste: 'Chilled rose milk topped with sweet ruby pomegranate.',
      sixthSense: 'Tender, radiant lightness.',
    },
  },
  {
    id: 'bright-moonmilk-pearl',
    line: 'bright',
    editionNumber: 'VI',
    batchHarvestId: generateBatchHarvestId('NAC'),
    name: 'Moonmilk Pearl & Lavender',
    formulaBrand: 'Freshwater Nacre · Provence Lavender Cream',
    colorThemeLabel: 'Pearl Violet & White · Nacre & Lavender',
    whisperSubtitle: 'Crystal Pearl Dew · Lavender Swirl Milk Butter',
    sableDescription:
      'Moonlit pearl translucency paired cleanly beside dreamy lavender swirl cream: delicate freshwater nacre illuminates while serene lavender butter quiets skin for effortless evening rest.',
    botanicalLayers: {
      crystalTitle: 'Freshwater Pearl Crystal',
      crystalNote: 'Translucent dew cradling a luminous natural freshwater pearl.',
      crystalColorHex: '#A997C6',
      creamTitle: 'Lavender Swirl Milk Cream',
      creamNote: 'French lavender oil & whipped coconut milk calm redness.',
      creamColorHex: '#EAE2F3',
    },
    palettePair: ['#A997C6', '#EDE9F2'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One genuine lustrous freshwater pearl released cleanly as the gel wears.',
    },
    thaiSubtitle: 'ไข่มุกมูนมิลค์และลาเวนเดอร์',
    editionNote: 'Bright 06 · Pearl Nacre Reserve',
    specMetric: 'Freshwater Pearl & Lavender Milk',
    emotionalNeed: 'Dreamy pastel twilight tranquility paired with iridescent freshwater pearl.',
    scentMood: 'Moonmilk Lavender & Pearl',
    scentIntensity: 3,
    scentIntensityLabel: 'Soft Provence Lavender & Sweet Milk',
    mapX: 20,
    mapY: 42,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2'],
    ingredients: ['1 Freshwater Pearl', 'Provence Lavender Oil', 'Whipped Coconut Milk', 'Nacre Amino'],
    bioActives: {
      headlineCompound: 'Freshwater Pearl Nacre Calcium + Provence Lavender Milk',
      actives: ['Pearl Conchiolin', 'Provence Lavender', 'Coconut Milk Lipids', 'Collagen I + II'],
      mineralCore: 'Real Freshwater Pearl & Mineral Silica',
      skinBenefit: 'Leaves skin calm, radiant, and satin-soft before sleep.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: brightMoonmilkPearlImg,
    imageAlt: 'Moonmilk Pearl and Lavender rectangular bar with clear gel cradling one luminous pearl left and pastel lavender swirl cream right',
    fallbackGradient: 'from-[#EDE9F2] via-[#D8CCE6] to-[#C2A8D8]',
    senses: {
      sight: 'Clear water crystal holding one real pearl beside ribboned lavender cream.',
      scent: 'Chilled evening milk steeped lightly in French lavender sprigs.',
      touch: 'Zero-weight satin lather gliding like liquid silk.',
      sound: 'Pearl chiming softly against porcelain tray.',
      taste: 'Sweet lavender vanilla macaron.',
      sixthSense: 'Deep, luminous calm at bedtime.',
    },
  },
  {
    id: 'bright-tiffany-mint',
    line: 'bright',
    editionNumber: 'VII',
    batchHarvestId: generateBatchHarvestId('MNT'),
    name: 'Tiffany Mint & Whipped Shea',
    formulaBrand: 'Cooling Spearmint · Pure Ivory Shea',
    colorThemeLabel: 'Sea Aqua & Cream · Mint & Shea',
    whisperSubtitle: 'Iced Spearmint Crystal · Snowy Ivory Shea Cream',
    sableDescription:
      'Cool aqua sea-glass infused with fresh spearmint leaves beside snowy shea biscuit cream: crisp botanical clarity cools tropical heat while unrefined butter leaves zero tightness.',
    botanicalLayers: {
      crystalTitle: 'Iced Mint Leaf Crystal',
      crystalNote: 'Whole crushed garden mint leaves & sparkling marine dew rinse.',
      crystalColorHex: '#5CC3CE',
      creamTitle: 'Whipped Ivory Shea Cream',
      creamNote: 'Unrefined shea butter & sweet rice milk cream seal soft glow.',
      creamColorHex: '#EFE8D8',
    },
    palettePair: ['#5CC3CE', '#EFE8D8'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One cooling azure silk sponge tucked cleanly inside whipped ivory butter.',
    },
    thaiSubtitle: 'ทิฟฟานี่มินต์และเชียร์บัตเตอร์',
    editionNote: 'Bright 07 · Aqua Spearmint',
    specMetric: 'Garden Spearmint & Rice Milk',
    emotionalNeed: 'Refreshing sea-glass mint breeze softened by creamy unrefined shea.',
    scentMood: 'Tiffany Spearmint & Cream',
    scentIntensity: 4,
    scentIntensityLabel: 'Crushed Spearmint & Clean Vanilla Shea',
    mapX: 24,
    mapY: 86,
    packagingMarkers: ['split-5050', 'coffee-mg', 'vit-cead'],
    ingredients: ['Garden Spearmint Leaf', 'Unrefined Ivory Shea', 'Marine Magnesium', 'Cosmetic Sponge'],
    bioActives: {
      headlineCompound: 'Garden Menthol Dew + Unrefined Shea Butter',
      actives: ['Fresh Spearmint Leaf', 'Unrefined Shea Lipid', 'Marine Magnesium', 'Vitamin C'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Marine Minerals',
      skinBenefit: 'Cools humid skin cleanly while keeping the lipid barrier plush and calm.',
    },
    priceUsd: 32,
    slice100gUsd: 16,
    imageUrl: brightMintBlossomImg,
    imageAlt: 'Tiffany Mint and Whipped Shea rectangular bar with icy green mint leaf gel left and snowy white cream right',
    fallbackGradient: 'from-[#5CC3CE] via-[#9FD7DC] to-[#EFE8D8]',
    senses: {
      sight: 'Sparkling Tiffany-aqua mint leaves suspended beside snowy white cream.',
      scent: 'Chilled crushed spearmint leaves drifting over sweet butter.',
      touch: 'Cool tingling gel sliding immediately into rich creamy foam.',
      sound: 'Sparkling mint soda brushing chilled glass.',
      taste: 'Cool mint cream wafer biscuit.',
      sixthSense: 'Bright-eyed breeze from head to toe.',
    },
  },
  {
    id: 'bright-spirulina-hyaluronic',
    line: 'bright',
    editionNumber: 'VIII',
    batchHarvestId: generateBatchHarvestId('SPR'),
    name: 'Blue Spirulina, Hyaluronic Acid & Retinol',
    formulaBrand: 'Blue Phycocyanin · Hyaluronic Acid · Retinol',
    colorThemeLabel: 'Half Blue · Half Translucent Blue',
    whisperSubtitle: 'Translucent Sapphire Gel · Creamy Spirulina Retinol Butter',
    sableDescription:
      'Sculpted fifty-fifty in marine phycocyanin blue spirulina: half luminous translucent sapphire-aqua glycerin infused with Hyaluronic Acid, and half velvety blue butter enriched with encapsulated Retinol.',
    botanicalLayers: {
      crystalTitle: 'Translucent Blue Spirulina & Hyaluronic Acid Gel',
      crystalNote: 'Marine blue spirulina phycocyanin + multi-weight Hyaluronic Acid flood skin with weightless hydration.',
      crystalColorHex: '#2587BE',
      creamTitle: 'Opaque Blue Spirulina & Retinol Cream',
      creamNote: 'Whipped shea & encapsulated Retinol smooth skin tone beside soothing spirulina lipids.',
      creamColorHex: '#71B4DB',
    },
    palettePair: ['#2587BE', '#71B4DB'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One serene freshwater pearl nestled along the sapphire crystal seam.',
    },
    signatureFinish: 'translucent',
    thaiSubtitle: 'สไปรูลิน่าสีฟ้า ไฮยาลูรอนิค แอซิด และเรตินอล',
    editionNote: 'Bright 08 · Marine Renewal',
    specMetric: 'Blue Spirulina · Hyaluronic · Retinol',
    emotionalNeed: 'Deep oceanic hydration balanced by gentle overnight cellular smoothing.',
    scentMood: 'Marine Neroli & Cool Blue Mist',
    scentIntensity: 3,
    scentIntensityLabel: 'Ocean Mist & White Neroli',
    mapX: 24,
    mapY: 62,
    packagingMarkers: ['split-5050', 'collagen-1-2', 'vit-cead', 'pearl-minerals'],
    ingredients: ['Blue Spirulina (Phycocyanin)', 'Hyaluronic Acid', 'Encapsulated Retinol', 'Freshwater Pearl'],
    bioActives: {
      headlineCompound: 'Blue Spirulina Phycocyanin + Hyaluronic Acid + Encapsulated Retinol',
      actives: ['Blue Spirulina Extract', 'Multi-Weight Hyaluronic Acid', 'Gentle Retinol', 'Marine Collagen'],
      mineralCore: 'Translucent Sapphire Gel & Velvet Blue Cream',
      skinBenefit: 'Binds deep surface hydration while visibly refining texture and radiance.',
    },
    priceUsd: 45,
    slice100gUsd: 23,
    imageUrl: spirulinaBlueImg,
    imageAlt: 'Blue Spirulina Hyaluronic Acid and Retinol soap bar half opaque creamy blue and half glowing translucent blue crystal on travertine stone',
    fallbackGradient: 'from-[#2587BE] via-[#4BA4D6] to-[#71B4DB]',
    senses: {
      sight: 'Sunlit sapphire crystal glowing cleanly beside whipped ocean-blue cream.',
      scent: 'Crisp sea breeze drifting over white neroli blossoms.',
      touch: 'Plumping serum-soft foam leaving skin supple and glass-smooth.',
      sound: 'Calm tidal surf brushing polished sea glass.',
      taste: 'Chilled coconut water with blue butterfly pea mist.',
      sixthSense: 'Clear oceanic renewal.',
    },
  },
  {
    id: 'bright-squalane-lecithin',
    line: 'bright',
    editionNumber: 'IX',
    batchHarvestId: generateBatchHarvestId('SQL'),
    name: 'Squalane & Lecithin Barrier Bar',
    formulaBrand: 'Olive Squalane 5.0% · Lecithin 3.0% · pH 5.5',
    colorThemeLabel: 'Creamy Ivory & Frosted Gel · 50/50 Barrier',
    whisperSubtitle: 'Creamy Opaque Ivory · Semi-Translucent Frosted Glass Gel',
    sableDescription:
      'Restores the skin moisture barrier and cleanses sensitive skin at pH 5.5.',
    botanicalLayers: {
      crystalTitle: 'Frosted Milky-Glass Humectant Gel',
      crystalNote: '10.0% vegetable glycerin & 3.0% sodium lactate bind tender hydration.',
      crystalColorHex: '#DCE5EC',
      creamTitle: 'Creamy Olive Squalane & Lecithin Core',
      creamNote: '5.0% olive squalane, 3.0% lecithin & 1.0% Vitamin E inside 78.0% syndet.',
      creamColorHex: '#F3EEE4',
    },
    palettePair: ['#DCE5EC', '#F3EEE4'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One serene ivory freshwater pearl resting beside frosted barrier silk.',
    },
    signatureFinish: 'translucent',
    nutritionFacts: {
      servingSize: '100g Bar',
      activeIngredients: {
        'Olive Squalane': '5.0%',
        'Soy/Sunflower Lecithin': '3.0%',
        'Vitamin E': '1.0%',
      },
      baseAndHydration: {
        'Soap-Free Syndet Base': '78.0%',
        'Vegetable Glycerin': '10.0%',
        'Sodium Lactate': '3.0%',
      },
      pHLevel: '5.5',
    },
    thaiSubtitle: 'สควาเลนและเลซิติน ฟื้นฟูเกราะป้องกันผิว pH 5.5',
    editionNote: 'Bright 11 · Sensitive Barrier pH 5.5',
    specMetric: '5.0% Squalane · 3.0% Lecithin · pH 5.5',
    emotionalNeed: 'Ultra-gentle barrier replenishment for reactive, sensitive skin.',
    scentMood: 'Unscented Milk Silk & Soft Cotton',
    scentIntensity: 1,
    scentIntensityLabel: 'Soft Pure Ivory',
    mapX: 20,
    mapY: 42,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2'],
    ingredients: ['Olive Squalane (5.0%)', 'Soy/Sunflower Lecithin (3.0%)', 'Sodium Lactate (3.0%)', 'Vitamin E (1.0%)'],
    bioActives: {
      headlineCompound: '5.0% Olive Squalane + 3.0% Lecithin + Sodium Lactate · pH 5.5',
      actives: ['Olive Squalane 5.0%', 'Lecithin 3.0%', 'Vitamin E 1.0%', 'Sodium Lactate 3.0%'],
      mineralCore: 'pH 5.5 Soap-Free Syndet & Humectant Matrix',
      skinBenefit: 'Restores the skin moisture barrier and cleanses sensitive skin at pH 5.5.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: squalaneLecithinImg,
    imageAlt: 'Squalane and Lecithin Barrier Bar oval soap split 50/50 creamy opaque ivory and semi-translucent frosted milky glass gel on ceramic dish',
    fallbackGradient: 'from-[#DCE5EC] via-[#EAECEF] to-[#F3EEE4]',
    senses: {
      sight: 'Smooth porcelain ivory resting cleanly beside frosted milky glass.',
      scent: 'Quiet clean cotton milk with zero harsh fragrance.',
      touch: 'Lush, creamy lipid cushion leaving sensitive cheeks supple.',
      sound: 'Quiet ceramic spoon stirring warm oat milk.',
      taste: 'Sweet steamed rice milk.',
      sixthSense: 'Restorative calm for delicate skin.',
    },
  },
  {
    id: 'bright-piroctone-purifying',
    line: 'bright',
    editionNumber: 'X',
    batchHarvestId: generateBatchHarvestId('PRC'),
    name: 'Piroctone Olamine Purifying Bar',
    formulaBrand: 'Piroctone Olamine 0.8% · Soap-Free Syndet 82%',
    colorThemeLabel: 'Seafoam Blue & Aqua Gel · 50/50 Purifying',
    whisperSubtitle: 'Pastel Seafoam-Blue Syndet · Clear Translucent Aqua Gel',
    sableDescription:
      'Targets acne bacteria and fungal yeast while protecting the skin barrier.',
    botanicalLayers: {
      crystalTitle: 'Translucent Aqua Propanediol Gel',
      crystalNote: '10.0% propanediol & 6.2% vegetable glycerin maintain weightless clarity.',
      crystalColorHex: '#59C3CE',
      creamTitle: 'Seafoam-Blue Piroctone Olamine 0.8% Core',
      creamNote: '82.0% soap-free syndet base delivers targeted purifying care at pH 5.0 - 5.5.',
      creamColorHex: '#A7DCE3',
    },
    palettePair: ['#59C3CE', '#A7DCE3'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One cool aqua-lit freshwater pearl cradled along the beveled seafoam edge.',
    },
    signatureFinish: 'translucent',
    nutritionFacts: {
      servingSize: '100g Bar',
      activeIngredients: {
        'Piroctone Olamine': '0.8%',
      },
      baseAndHydration: {
        'Soap-Free Syndet Base': '82.0%',
        Propanediol: '10.0%',
        'Vegetable Glycerin': '6.2%',
        Preservative: '1.0%',
      },
      pHLevel: '5.0 - 5.5',
    },
    thaiSubtitle: 'ไพรอกโทน โอลามีน 0.8% ดูแลสิวและสมดุลผิว',
    editionNote: 'Bright 12 · Microbiome Purifying',
    specMetric: '0.8% Piroctone Olamine · pH 5.0 - 5.5',
    emotionalNeed: 'Clinical scalp-to-body purifying clarity without barrier disruption.',
    scentMood: 'Cool Aqua Mist & Fresh Seafoam',
    scentIntensity: 2,
    scentIntensityLabel: 'Crisp Mineral Dew',
    mapX: 38,
    mapY: 40,
    packagingMarkers: ['split-5050', 'vit-cead', 'pearl-minerals'],
    ingredients: ['Piroctone Olamine (0.8%)', 'Soap-Free Syndet Base (82.0%)', 'Propanediol (10.0%)', 'Vegetable Glycerin (6.2%)'],
    bioActives: {
      headlineCompound: '0.8% Piroctone Olamine + 82.0% Soap-Free Syndet · pH 5.0 - 5.5',
      actives: ['Piroctone Olamine 0.8%', 'Propanediol 10.0%', 'Vegetable Glycerin 6.2%', 'Mild Syndet 82.0%'],
      mineralCore: 'pH 5.0 - 5.5 Purifying Aqua Matrix',
      skinBenefit: 'Targets acne bacteria and fungal yeast while protecting the skin barrier.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: piroctonePurifyingImg,
    imageAlt: 'Piroctone Olamine Purifying Bar beveled rectangular bar split 50/50 pastel seafoam-blue and clear translucent aqua gel on wet slate',
    fallbackGradient: 'from-[#59C3CE] via-[#84D1DA] to-[#A7DCE3]',
    senses: {
      sight: 'Beveled seafoam pastel joined sharply to crystal-clear aqua gel.',
      scent: 'Crisp morning mist rising off wet river slate.',
      touch: 'Cool, breathable micro-foam that rinses squeak-free and soft.',
      sound: 'Gentle fountain trickle across polished slate.',
      taste: 'Chilled mineral spring water.',
      sixthSense: 'Clean, composed skin equilibrium.',
    },
  },
];

export const BRIGHT_5050_LINE: SoapCreation[] = applyStandardThbPricing(RAW_BRIGHT_LINE);

// ============================================================================
// THAI & GLOBAL HOLIDAY THIRD LINE EDITIONS
// Halloween · Christmas · Thai Coronation Mustard-Yolk · Songkran · Loy Krathong · Lunar · Valentine
// ============================================================================
const RAW_HOLIDAY_LINE: SoapCreation[] = [
  {
    id: 'holiday-halloween-nocturne',
    line: 'holiday',
    holidayOccasion: 'Halloween Edition',
    editionNumber: 'H-I',
    batchHarvestId: generateBatchHarvestId('HLW'),
    name: 'Halloween Spiced Orange & Jet Sesame',
    formulaBrand: 'Roasted Pumpkin & Marigold · Black Sesame Butter',
    colorThemeLabel: 'Orange & Black · Halloween Reserve',
    whisperSubtitle: 'Spiced Tangerine Amber Crystal · Velvet Jet-Black Charcoal Cream',
    sableDescription:
      'Created for October nights: glowing tangerine marigold crystal studded with pumpkin enzymes beside deep velvety black sesame charcoal butter—bright citrus clarity followed by silky dark mineral comfort.',
    botanicalLayers: {
      crystalTitle: 'Spiced Tangerine Amber Gel',
      crystalNote: 'Organic pumpkin enzyme, sweet tangerine oil & marigold petals renew glow.',
      crystalColorHex: '#D86714',
      creamTitle: 'Velvet Jet Black Sesame Cream',
      creamNote: 'Cold-pressed black sesame oil & bamboo carbon cocoon winter-dry skin.',
      creamColorHex: '#1F2124',
    },
    palettePair: ['#D86714', '#1F2124'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'Spun ember gold flecks woven through amber pumpkin clarity.',
    },
    thaiSubtitle: 'รุ่นพิเศษฮาโลวีน ส้มมารีโกลด์และงาดำ',
    editionNote: 'Holiday 01 · Halloween Orange & Black',
    specMetric: 'Pumpkin Enzyme & Black Sesame',
    emotionalNeed: 'Crisp autumn lantern glow balanced with velvet midnight comfort.',
    scentMood: 'Spiced Mandarin & Toasted Sesame',
    scentIntensity: 5,
    scentIntensityLabel: 'Tangerine Clove & Smoked Black Sesame',
    mapX: 88,
    mapY: 50,
    packagingMarkers: ['split-5050', 'vit-cead', 'ginseng-root'],
    ingredients: ['Pumpkin Enzyme Gel', 'Sweet Tangerine Zest', 'Black Sesame Butter', 'Bamboo Carbon'],
    bioActives: {
      headlineCompound: 'Pumpkin Fruit AHA Enzymes + Cold-Milled Black Sesame Lipid',
      actives: ['Pumpkin Seed Oil', 'Tangerine Carotene', 'Black Sesame Vitamin E', 'Bamboo Carbon'],
      mineralCore: '24k Gold Leaf & Activated Sesame Trace',
      skinBenefit: 'Refines dull autumn skin smoothly while restoring deep dark-butter suppleness.',
    },
    priceUsd: 39,
    slice100gUsd: 20,
    imageUrl: holidayHalloweenImg,
    imageAlt: 'Halloween Orange and Black rectangular soap bar with translucent pumpkin-tangerine crystal left and jet black sesame butter right',
    fallbackGradient: 'from-[#D86714] via-[#66361A] to-[#1F2124]',
    senses: {
      sight: 'Glowing carved-lantern orange translucency joined sharp beside pitch-black butter.',
      scent: 'Warm candied tangerine peel and toasted midnight sesame seeds.',
      touch: 'Satin citrus cleanse finishing swiftly with cushiony black sesame silk.',
      sound: 'Autumn leaves stirring softly along gravel paths.',
      taste: 'Spiced pumpkin tart beside roasted black sesame creme.',
      sixthSense: 'Playful midnight glamour.',
    },
  },
  {
    id: 'holiday-christmas-evergreen',
    line: 'holiday',
    holidayOccasion: 'Christmas Edition',
    editionNumber: 'H-II',
    batchHarvestId: generateBatchHarvestId('XMS'),
    name: 'Christmas Evergreen & Crimson Cranberry',
    formulaBrand: 'Winter Pine & Matcha · Cranberry Pomegranate Cream',
    colorThemeLabel: 'Green & Red · Christmas Collector',
    whisperSubtitle: 'Emerald Pine Needle Crystal · Ruby Cranberry Berry Butter',
    sableDescription:
      'Festive winter forest captured in botanical form: translucent emerald pine-needle gel briskly awakens winter skin beside rich ruby cranberry and cocoa butter spun soft as velvet ribbon.',
    botanicalLayers: {
      crystalTitle: 'Evergreen Pine Emerald Gel',
      crystalNote: 'Wild pine needle & cypress extract refresh and tone briskly.',
      crystalColorHex: '#157448',
      creamTitle: 'Crimson Cranberry Berry Cream',
      creamNote: 'Crushed Nordic cranberry, pomegranate & cocoa butter lock hydration.',
      creamColorHex: '#941E2B',
    },
    palettePair: ['#157448', '#941E2B'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One ruby silk sponge whipped neatly to build festive berry cream.',
    },
    thaiSubtitle: 'รุ่นพิเศษคริสต์มาส สนเขียวและแครนเบอร์รี่แดง',
    editionNote: 'Holiday 02 · Christmas Green & Red',
    specMetric: 'Pine Needle & Ruby Cranberry',
    emotionalNeed: 'Crisp winter evergreen mornings gathered beside warm crimson hearth warmth.',
    scentMood: 'Winter Pine & Spiced Cranberry',
    scentIntensity: 5,
    scentIntensityLabel: 'Fresh Silver Pine & Red Berry Tart',
    mapX: 52,
    mapY: 78,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Wild Pine Needle', 'Crushed Cranberry', 'Red Pomegranate Oil', 'Cacao Butter'],
    bioActives: {
      headlineCompound: 'Winter Cypress Phytoncides + Cranberry Ellagic Berry Cream',
      actives: ['Pine Needle Distillate', 'Cranberry Seed Omega', 'Pomegranate Sterols', 'Vitamin C'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Forest Chlorophyl',
      skinBenefit: 'Invigorates chilly morning circulation and seals cold-weather softness.',
    },
    priceUsd: 39,
    slice100gUsd: 20,
    imageUrl: holidayChristmasImg,
    imageAlt: 'Christmas Green and Red rectangular soap bar with emerald pine crystal left and crimson cranberry cream right',
    fallbackGradient: 'from-[#157448] via-[#4D3A3B] to-[#941E2B]',
    senses: {
      sight: 'Jeweled forest pine needles suspended beside rich crimson velvet.',
      scent: 'Sunlit evergreen boughs opening toward warm cranberry jam.',
      touch: 'Cool forest jelly warming immediately into plush winter cream.',
      sound: 'Crisp ribbon untying over cedar wood.',
      taste: 'Spiced cranberry sablé beside herbal winter tea.',
      sixthSense: 'Festive warmth worth keeping.',
    },
  },
  {
    id: 'holiday-coronation-royal',
    line: 'holiday',
    holidayOccasion: 'Thai Coronation Day (Wan Chaloem)',
    editionNumber: 'H-III',
    batchHarvestId: generateBatchHarvestId('COR'),
    name: 'Coronation Saffron Mustard & Golden Yolk',
    formulaBrand: 'Royal Marigold Turmeric · Luminous Chamomile Yolk Core',
    colorThemeLabel: 'Mustard Yellow & Gold Core · Royal Thailand',
    whisperSubtitle: 'Warm Saffron-Mustard Butter · Glowing Golden Egg-Yolk Crystal Core',
    sableDescription:
      'Honoring Thailand’s Wan Chaloem Coronation Day in royal yellow gold: rich saffron-mustard whipped turmeric sablé tenderly cradles a glowing golden egg-yolk translucent chamomile heart at its center.',
    botanicalLayers: {
      crystalTitle: 'Golden Egg-Yolk Chamomile Core',
      crystalNote: 'Sun-amber saffron threads, lotus stamen & wildflower nectar heart.',
      crystalColorHex: '#EAA81B',
      creamTitle: 'Royal Mustard Turmeric Sablé',
      creamNote: 'Wild Thai Plai turmeric, marigold petal butter & golden honey shield glow.',
      creamColorHex: '#B68928',
    },
    palettePair: ['#EAA81B', '#B68928'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One royal cream freshwater pearl resting gently alongside golden saffron silk.',
    },
    thaiSubtitle: 'รุ่นวันฉัตรมงคล สีเหลืองมัสตาร์ดและแกนทองคำขมิ้นชัน',
    editionNote: 'Holiday 03 · Coronation Mustard & Gold Core',
    specMetric: 'Thai Plai, Saffron & Golden Core',
    emotionalNeed: 'Ceremonial Thai gold radiance bringing calm grace and luminous glow.',
    scentMood: 'Saffron Marigold & Warm Honey',
    scentIntensity: 4,
    scentIntensityLabel: 'Sacred Lotus Stamen, Marigold & Honey',
    mapX: 48,
    mapY: 50,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'ginseng-root', 'vit-cead'],
    ingredients: ['Thai Royal Plai Turmeric', 'Saffron Stamen', 'Marigold Petal', 'Chamomile Honey Core'],
    bioActives: {
      headlineCompound: 'Siam Plai Curcuminoids + Saffron-Chamomile Luminous Heart',
      actives: ['Thai Golden Turmeric', 'Marigold Lutein', 'Lotus Stamen', 'Royal Wildflower Honey'],
      mineralCore: 'Freshwater Pearl & Golden Lecithin',
      skinBenefit: 'Traditionally prized in Thai court skincare to brighten uneven skin with silk glow.',
    },
    priceUsd: 42,
    slice100gUsd: 21,
    imageUrl: holidayCoronationImg,
    imageAlt: 'Thai Coronation Day rectangular mustard yellow soap bar sliced to show glowing circular golden egg-yolk crystal core inside',
    fallbackGradient: 'from-[#EAA81B] via-[#C9962B] to-[#9E7522]',
    senses: {
      sight: 'Warm saffron-mustard velvet split to reveal an incandescent golden yolk orb.',
      scent: 'Steamed marigold blossom garlands wrapped in royal honey.',
      touch: 'Lush, silky turmeric-lecithin froth polishing skin effortlessly.',
      sound: 'Temple bells chiming gently across morning courtyards.',
      taste: 'Traditional Thai Thong Yip egg-yolk silk confection & jasmine tea.',
      sixthSense: 'Poised, sovereign radiance.',
    },
  },
  {
    id: 'holiday-songkran-water',
    line: 'holiday',
    holidayOccasion: 'Songkran Thai New Year',
    editionNumber: 'H-IV',
    batchHarvestId: generateBatchHarvestId('SGK'),
    name: 'Songkran Clear Water & Jasmine Blessing',
    formulaBrand: 'Cooled Water Blue · Triple Bangkok Jasmine Milk',
    colorThemeLabel: 'Cerulean Blue & Snow White · Songkran',
    whisperSubtitle: 'Sky Water Blessing Crystal · Snowy Jasmine Rice Milk Cream',
    sableDescription:
      'Cooling April water blessings sealed beside snowy rice-milk cream: sparkling aquamarine jasmine petal jelly lifts tropical humidity away while Thai rice-bran butter leaves skin serene.',
    botanicalLayers: {
      crystalTitle: 'Cerulean Blessing Water Gel',
      crystalNote: 'Chilled blue anchan, winter mint & whole Mali jasmine petals.',
      crystalColorHex: '#6DBCE0',
      creamTitle: 'Bangkok Jasmine Rice Cream',
      creamNote: 'First-press jasmine rice milk & virgin coconut oil soften softly.',
      creamColorHex: '#F7F3EA',
    },
    palettePair: ['#6DBCE0', '#F7F3EA'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One pristine white freshwater pearl echoing blessing bowls.',
    },
    thaiSubtitle: 'รุ่นพิเศษสงกรานต์ น้ำอบฟ้าใสและนมมะลิขาว',
    editionNote: 'Holiday 04 · Songkran Water Festival',
    specMetric: 'Jasmine Petals & Thai Rice Milk',
    emotionalNeed: 'Instant cool-water relief across sun-warmed tropical afternoons.',
    scentMood: 'Cold Jasmine & Cooling Water',
    scentIntensity: 3,
    scentIntensityLabel: 'Chilled Jasmine Garlands & Clean Linen',
    mapX: 22,
    mapY: 64,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2'],
    ingredients: ['Thai Jasmine Buds', 'Cooling Water Mint', 'Jasmine Rice Milk', '1 Freshwater Pearl'],
    bioActives: {
      headlineCompound: 'Hydro-Cooled Mali Jasmine + Thai Oryza Rice Ceramides',
      actives: ['Mali Jasmine Petals', 'Rice Milk Ceramides', 'Cool Mint Dew', 'Virgin Coconut'],
      mineralCore: 'Freshwater Pearl & Soft Clay Powder',
      skinBenefit: 'Refreshes sun-flushed skin and locks lightweight moisture all day.',
    },
    priceUsd: 36,
    slice100gUsd: 18,
    imageUrl: holidaySongkranImg,
    imageAlt: 'Songkran Water Blessing rectangular bar with aquamarine jasmine petal gel left and pure white rice milk cream right',
    fallbackGradient: 'from-[#6DBCE0] via-[#CBE4F0] to-[#F7F3EA]',
    senses: {
      sight: 'Fresh white jasmine buds drifting in cool sky-blue water crystal.',
      scent: 'Chilled terracotta bowls of iced jasmine blossom water.',
      touch: 'Crisp cooling splash finishing cleanly like baby powder milk.',
      sound: 'Silver bowl pouring scented water over hands.',
      taste: 'Chilled jasmine-flower water (Nam Loi Dok Mali).',
      sixthSense: 'Bright Thai New Year renewal.',
    },
  },
  {
    id: 'holiday-loy-krathong',
    line: 'holiday',
    holidayOccasion: 'Loy Krathong Lantern Night',
    editionNumber: 'H-V',
    batchHarvestId: generateBatchHarvestId('LOY'),
    name: 'Loy Krathong Lantern Gold & Pandan',
    formulaBrand: 'Glowing Candlelight Honey · Sacred Pandan Lotus Cream',
    colorThemeLabel: 'Lantern Gold & Lotus Green · Full Moon',
    whisperSubtitle: 'Lantern Amber Gold-Leaf Crystal · Fragrant Pandan Lotus Butter',
    sableDescription:
      'Candlelight drifting softly over dark rivers: translucent lantern-gold honey infused with fluttering 24k gold flecks fused beside sage-green steamed pandan leaf & sacred lotus butter cream.',
    botanicalLayers: {
      crystalTitle: 'Lantern Honey Gold Gel',
      crystalNote: 'Golden wildflower nectar & shimmering 24k lantern gold leaf.',
      crystalColorHex: '#D8A638',
      creamTitle: 'Pandan & Lotus Sage Cream',
      creamNote: 'Sweet steamed Thai pandan extract & sacred lotus lipid calm skin.',
      creamColorHex: '#B6C9A5',
    },
    palettePair: ['#D8A638', '#B6C9A5'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'Dancing 24k gold flakes reminiscent of floating Krathong candlelight.',
    },
    thaiSubtitle: 'รุ่นพิเศษลอยกระทง ทองคำเปลวและใบเตยดอกบัว',
    editionNote: 'Holiday 05 · Loy Krathong Full Moon',
    specMetric: '24k Lantern Gold & Pandan Lotus',
    emotionalNeed: 'Peaceful riverside moonbeams wrapped in honeyed leaf fragrance.',
    scentMood: 'Pandan Leaf & Candle Honey',
    scentIntensity: 4,
    scentIntensityLabel: 'Fresh Pandan Leaf, Lotus & Warm Honey',
    mapX: 44,
    mapY: 34,
    packagingMarkers: ['split-5050', 'ginseng-root', 'vit-cead'],
    ingredients: ['Sweet Thai Pandan Leaf', 'Sacred Pink Lotus', 'Wildflower Honey', '24k Gold Leaf'],
    bioActives: {
      headlineCompound: 'Sacred Lotus Pollen + Steamed Pandan Chlorophyll',
      actives: ['Sacred Lotus Extract', 'Fresh Pandan Leaf', 'Lantern Honey', '24k Gold Leaf'],
      mineralCore: 'Edible Gold Leaf & Botanical Zinc',
      skinBenefit: 'Restores luminous elasticity after evening air with gentle leaf moisture.',
    },
    priceUsd: 38,
    slice100gUsd: 19,
    imageUrl: holidayLoyKrathongImg,
    imageAlt: 'Loy Krathong Lantern Gold rectangular bar with golden amber gold-leaf crystal left and pastel sage green pandan cream right',
    fallbackGradient: 'from-[#D8A638] via-[#C6BC74] to-[#B6C9A5]',
    senses: {
      sight: 'Warm lantern gold sparkles floating next to calm sage pandan silk.',
      scent: 'Steamed sweet Thai pandan cakes and fresh pond lotus petals.',
      touch: 'Luminous honey foam yielding swiftly to silky herbal cream.',
      sound: 'Soft river ripples greeting glowing floating lanterns.',
      taste: 'Warm coconut custard infused in fresh green pandan leaf.',
      sixthSense: 'Grateful moonlit release.',
    },
  },
  {
    id: 'holiday-lunar-new-year',
    line: 'holiday',
    holidayOccasion: 'Chinese Lunar New Year',
    editionNumber: 'H-VI',
    batchHarvestId: generateBatchHarvestId('LNY'),
    name: 'Lunar Vermilion Tangerine & Pearl Cream',
    formulaBrand: 'Fortune Mandarin Hibiscus · Lucky Coconut Pearl',
    colorThemeLabel: 'Vermilion Red & Pearl White · Prosperity',
    whisperSubtitle: 'Mandarin & Hibiscus Vermilion Crystal · Snowy Coconut Pearl Cream',
    sableDescription:
      'Brisk sweet mandarin tangerine zest & scarlet hibiscus crystal fused flush against snowy white pearl coconut butter—a radiant good-fortune gift symbolising bright clarity and pure peace.',
    botanicalLayers: {
      crystalTitle: 'Vermilion Mandarin Crystal',
      crystalNote: 'Sun-sweet mandarin peel & red hibiscus flower glow brighten skin.',
      crystalColorHex: '#D1311E',
      creamTitle: 'Lucky White Pearl Cream',
      creamNote: 'Cold-pressed coconut cream & crushed nacre leave skin silky.',
      creamColorHex: '#F7F3EA',
    },
    palettePair: ['#D1311E', '#F7F3EA'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'Paired with one round ivory freshwater pearl symbolising wholeness.',
    },
    thaiSubtitle: 'รุ่นตรุษจีน ส้มแมนดารินแดงมงคลและไข่มุกขาว',
    editionNote: 'Holiday 06 · Lunar New Year',
    specMetric: 'Mandarin Zest & Freshwater Pearl',
    emotionalNeed: 'Crisp citrus auspicious energy paired with clean ivory coconut calm.',
    scentMood: 'Sweet Mandarin & Creamy Pearl',
    scentIntensity: 4,
    scentIntensityLabel: 'Fresh Mandarin Zest & Warm Ivory Cream',
    mapX: 60,
    mapY: 64,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'vit-cead'],
    ingredients: ['Golden Mandarin Zest', 'Crimson Hibiscus', 'Virgin Coconut Cream', '1 Freshwater Pearl'],
    bioActives: {
      headlineCompound: 'Mandarin Citrus Vitamin C + Freshwater Pearl Conchiolin',
      actives: ['Mandarin Peel Oil', 'Hibiscus Petals', 'Virgin Coconut Milk', 'Pearl Calcium'],
      mineralCore: 'Round Freshwater Pearl & Natural Citrus',
      skinBenefit: 'Energizes winter sluggishness cleanly while preserving barrier moisture.',
    },
    priceUsd: 38,
    slice100gUsd: 19,
    imageUrl: holidayLunarNewYearImg,
    imageAlt: 'Lunar New Year Vermilion Mandarin and Pearl rectangular soap bar with red gold-fleck crystal left and ivory coconut butter right beside a pearl',
    fallbackGradient: 'from-[#D1311E] via-[#E58A7E] to-[#F7F3EA]',
    senses: {
      sight: 'Festive vermilion crystal dotted in gold leaf beside pure white silk.',
      scent: 'Peeled sweet mandarin oranges arranged over white porcelain.',
      touch: 'Smooth citrus wash finishing rich as fresh coconut silk.',
      sound: 'Crisp silk red paper rustling gently at dawn.',
      taste: 'Sweet tangerine segments and almond milk pudding.',
      sixthSense: 'Joyful abundance for the year ahead.',
    },
  },
  {
    id: 'holiday-valentine-rose',
    line: 'holiday',
    holidayOccasion: 'Valentine & Rose Day',
    editionNumber: 'H-VII',
    batchHarvestId: generateBatchHarvestId('VAL'),
    name: 'Velvet Damask Rose & Blush Almond',
    formulaBrand: 'Pressed Damask Rose Petals · Sweet Almond Silk',
    colorThemeLabel: 'Rose Ruby & Blush Pink · Celebration',
    whisperSubtitle: 'Crystal Damask Petal Gel · Whipped Blush Almond Milk Butter',
    sableDescription:
      'Real pressed damask rose petals suspended in translucent berry jelly beside whipped pastel pink almond milk cream—tender flora care crafted for heartfelt gifting.',
    botanicalLayers: {
      crystalTitle: 'Damask Rose Petal Gel',
      crystalNote: 'Whole pink rose petals & hibiscus nectar revive dullness.',
      crystalColorHex: '#CF6578',
      creamTitle: 'Blush Almond Silk Cream',
      creamNote: 'Cold-pressed sweet almond milk & shea butter nourish softly.',
      creamColorHex: '#ECC7CE',
    },
    palettePair: ['#CF6578', '#ECC7CE'],
    luxuryInlay: {
      type: 'cosmetic-sponge',
      label: 'Silk Cosmetic Sponge',
      whisperDetail: 'One blush velvet sponge cushion tucked cleanly for creamy rose foam.',
    },
    thaiSubtitle: 'รุ่นพิเศษกุหลาบแดงและนมอัลมอนด์ชมพู',
    editionNote: 'Holiday 07 · Rose & Almond Celebration',
    specMetric: 'Pressed Damask Rose & Almond Milk',
    emotionalNeed: 'Soft romantic flora radiance cushioned inside whipped almond butter.',
    scentMood: 'Fresh Damask Rose & Sweet Almond',
    scentIntensity: 4,
    scentIntensityLabel: 'Morning Rose Garden & Vanilla Almond',
    mapX: 34,
    mapY: 54,
    packagingMarkers: ['split-5050', 'collagen-1-2', 'vit-cead'],
    ingredients: ['Whole Damask Rose Petals', 'Hibiscus Fruit Gel', 'Sweet Almond Milk', 'Shea Butter'],
    bioActives: {
      headlineCompound: 'Damask Rose Otto + Cold-Pressed Sweet Almond Proteins',
      actives: ['Damask Rose Petals', 'Sweet Almond Milk', 'Rosehip Oil', 'Collagen I + II'],
      mineralCore: 'Silk Cosmetic Sponge & Natural Petal Polyphenols',
      skinBenefit: 'Calms wind-chapped cheeks and leaves arms exquisitely velvety.',
    },
    priceUsd: 37,
    slice100gUsd: 19,
    imageUrl: holidayValentineRoseImg,
    imageAlt: 'Valentine Rose rectangular soap bar with translucent rose petal crystal left and pastel blush almond milk butter right',
    fallbackGradient: 'from-[#CF6578] via-[#E29BA8] to-[#ECC7CE]',
    senses: {
      sight: 'Delicate pink rose petals floating weightlessly beside baby-pink butter.',
      scent: 'Dew-kissed morning damask roses meeting warm toasted almond.',
      touch: 'Creamy feather-soft foam rinsing clean without heaviness.',
      sound: 'Satin ribbon fluttering across linen box lid.',
      taste: 'French rosewater macaron filled with sweet almond cream.',
      sixthSense: 'Unspoken tenderness.',
    },
  },
  {
    id: 'holiday-stardust-wish',
    line: 'holiday',
    holidayOccasion: 'Celestial Edition',
    editionNumber: 'H-VIII',
    batchHarvestId: generateBatchHarvestId('STR'),
    name: 'Twilight Stardust Sprinkle',
    formulaBrand: 'Butterfly Pea Indigo · Celestial Stardust',
    colorThemeLabel: 'Midnight Violet · Gold Stardust',
    whisperSubtitle: 'Starlight Sprinkled Gel · Moonmilk Cream',
    sableDescription:
      'Indigo butterfly-pea translucent crystal dusted generously with fine celestial gold and silver stardust sparkles above velvet moonmilk butter.',
    botanicalLayers: {
      crystalTitle: 'Stardust-Sprinkled Violet Gel',
      crystalNote: 'Cosmic mineral sparkles suspended cleanly in twilight indigo crystal.',
      crystalColorHex: '#59619E',
      creamTitle: 'Velvet Moonmilk Butter',
      creamNote: 'Sweet rice milk cream & chamomile butter leave skin dreamy and calm.',
      creamColorHex: '#F3ECE0',
    },
    palettePair: ['#59619E', '#F3ECE0'],
    luxuryInlay: {
      type: 'pearl',
      label: '1 Freshwater Pearl',
      whisperDetail: 'One luminous nacre pearl hidden gently inside the starry seam.',
    },
    signatureFinish: 'stardust',
    thaiSubtitle: 'ละอองดาวราตรีและครีมน้ำนม',
    editionNote: 'Holiday 08 · Celestial Wishes',
    specMetric: 'Stardust Mica & Moonmilk Cream',
    emotionalNeed: 'Dreamy bedtime sparkle paired with calm chamomile cloud foam.',
    scentMood: 'Lavender Starlight & Sweet Cream',
    scentIntensity: 3,
    scentIntensityLabel: 'Chamomile Mist & Vanilla',
    mapX: 46,
    mapY: 78,
    packagingMarkers: ['split-5050', 'pearl-minerals', 'collagen-1-2', 'vit-cead'],
    ingredients: ['Butterfly Pea Crystal', 'Celestial Gold Stardust', 'Sweet Rice Milk', 'Chamomile Butter'],
    bioActives: {
      headlineCompound: 'Clitoria Ternatea + Cosmetic Celestial Mica',
      actives: ['Stardust Sparkle Mica', 'Rice Milk Protein', 'Roman Chamomile', 'Freshwater Pearl'],
      mineralCore: 'Iridescent Night-Sky Sparkle Gel',
      skinBenefit: 'Calms evening restlessness while leaving subtle starry softness.',
    },
    priceUsd: 44,
    slice100gUsd: 22,
    imageUrl: stardustVioletImg,
    imageAlt: 'Twilight Stardust Sprinkle sculptural soap bar with midnight blue translucent crystal dusted in gold stardust above moonmilk butter',
    fallbackGradient: 'from-[#59619E] via-[#9BA0CA] to-[#F3ECE0]',
    senses: {
      sight: 'A twilight indigo horizon dusted with fine golden stardust.',
      scent: 'Warm sweet milk steeped beside cool midnight lavender.',
      touch: 'Velvety feather lather with weightless sparkle rinse.',
      sound: 'Quiet lullaby chime beneath a calm night sky.',
      taste: 'Warm vanilla rice milk biscuit.',
      sixthSense: 'Quiet bedtime wonder.',
    },
  },
  {
    id: 'holiday-golden-oatmeal-honey',
    line: 'holiday',
    holidayOccasion: 'Sanctuary Harvest Edition',
    editionNumber: 'H-IX',
    batchHarvestId: generateBatchHarvestId('OAT'),
    name: 'Golden Oatmeal & Honey Soothing Bar',
    formulaBrand: 'Raw Honey 5.0% · Rolled Oats 4.0% · Colloidal Oatmeal 3.0%',
    colorThemeLabel: 'Creamy Oat-Beige & Golden Honey · 50/50 Soothing',
    whisperSubtitle: 'Creamy Oat-Beige Butter · Golden Honey Glycerin with Rolled Oats',
    sableDescription:
      'Calms redness, relieves itching, and gently exfoliates dry skin.',
    botanicalLayers: {
      crystalTitle: 'Translucent Golden Honey & Rolled Oat Gel',
      crystalNote: '5.0% raw honey & 4.0% suspended whole rolled oat flakes inside 85.0% suspension glycerin.',
      crystalColorHex: '#D69828',
      creamTitle: 'Opaque Creamy Colloidal Oatmeal 3.0% Base',
      creamNote: '3.0% colloidal oatmeal, 2.0% jojoba oil & 1.0% Vitamin E cocoon reactive skin.',
      creamColorHex: '#E8DAC2',
    },
    palettePair: ['#D69828', '#E8DAC2'],
    luxuryInlay: {
      type: 'loofah',
      label: 'Raw Silk Loofah',
      whisperDetail: 'Natural oat flakes & botanical sponge weave buffer dry patches gently.',
    },
    signatureFinish: 'scrub',
    nutritionFacts: {
      servingSize: '100g Bar',
      activeIngredients: {
        'Raw Honey': '5.0%',
        'Rolled Oats': '4.0%',
        'Colloidal Oatmeal': '3.0%',
        'Jojoba Oil': '2.0%',
        'Vitamin E': '1.0%',
      },
      baseAndHydration: {
        'Suspension Glycerin Base': '85.0%',
      },
      pHLevel: '5.5 - 6.5',
    },
    thaiSubtitle: 'ข้าวโอ๊ตสีทองและน้ำผึ้งแท้ ปลอบประโลมผิวแห้ง',
    editionNote: 'Holiday 09 · Oatmeal & Raw Honey Harvest',
    specMetric: '5.0% Honey · 7.0% Oats · pH 5.5 - 6.5',
    emotionalNeed: 'Warm comforting relief for dry, itchy, or redness-prone skin.',
    scentMood: 'Warm Wildflower Honey & Steamed Oats',
    scentIntensity: 3,
    scentIntensityLabel: 'Golden Honey & Oat Milk',
    mapX: 56,
    mapY: 28,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: ['Raw Honey (5.0%)', 'Rolled Oats (4.0%)', 'Colloidal Oatmeal (3.0%)', 'Jojoba Oil (2.0%)'],
    bioActives: {
      headlineCompound: '5.0% Raw Honey + 3.0% Colloidal Oatmeal + 4.0% Rolled Oats · pH 5.5 - 6.5',
      actives: ['Raw Honey 5.0%', 'Rolled Oats 4.0%', 'Colloidal Oatmeal 3.0%', 'Jojoba Oil 2.0%'],
      mineralCore: '85.0% Botanical Suspension Glycerin & Vitamin E 1.0%',
      skinBenefit: 'Calms redness, relieves itching, and gently exfoliates dry skin.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: goldenOatmealHoneyImg,
    imageAlt: 'Golden Oatmeal and Honey Soothing Bar rustic soap split 50/50 creamy oat-beige and translucent golden-amber honey glycerin with rolled oats on linen',
    fallbackGradient: 'from-[#D69828] via-[#E0BA72] to-[#E8DAC2]',
    senses: {
      sight: 'Whole golden rolled oat flakes floating cleanly inside warm honey amber.',
      scent: 'Warm morning oatmeal bowl drizzled with unheated wildflower honey.',
      touch: 'Tender oat buffer dissolving into soothing milky honey lotion.',
      sound: 'Crisp linen settling over a sunlit wooden bath tray.',
      taste: 'Warm honey-oat shortbread cookie.',
      sixthSense: 'Deep comforting solace for dry skin.',
    },
  },
  {
    id: 'holiday-champagne-opal',
    line: 'holiday',
    holidayOccasion: 'New Year Gala Edition',
    editionNumber: 'H-X',
    batchHarvestId: generateBatchHarvestId('GNY'),
    name: 'Champagne Opal Shimmer',
    formulaBrand: 'Pearlescent Mica Swirl · Silk Nacre',
    colorThemeLabel: 'Opalescent Gold · Pearl Shimmer',
    whisperSubtitle: 'Luminous Mica Silk · Ivory Shea Cream',
    sableDescription:
      'Swirling champagne mica ribbons shimmer inside golden crystal bonded to ivory shea butter and real gold leaf.',
    botanicalLayers: {
      crystalTitle: 'Swirling Champagne Mica Crystal',
      crystalNote: 'Mineral pearl mica catches gala candlelight in liquid silk ribbons.',
      crystalColorHex: '#C99B58',
      creamTitle: 'Whipped Ivory Nacre Cream',
      creamNote: 'Sweet almond oil & sea pearl calcium cocoon skin in satin glow.',
      creamColorHex: '#F7EFE1',
    },
    palettePair: ['#C99B58', '#F7EFE1'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf',
      whisperDetail: 'Hand-laid 24k gold flake gleaming directly along the shimmer seam.',
    },
    signatureFinish: 'shimmer',
    thaiSubtitle: 'ประกายมุกแชมเปญฉลองปีใหม่และทองคำบริสุทธิ์',
    editionNote: 'Occasion 10 · New Year Toast',
    specMetric: 'Mineral Mica & Pearl Nacre',
    emotionalNeed: 'Festive liquid-silk glow for celebratory evenings.',
    scentMood: 'Champagne Blossom & White Amber',
    scentIntensity: 3,
    scentIntensityLabel: 'Sparkling Pear & White Amber',
    mapX: 52,
    mapY: 44,
    packagingMarkers: ['split-5050', 'collagen-1-2', 'pearl-minerals', 'vit-cead'],
    ingredients: ['Cosmetic Pearl Mica', 'White Amber Resin', 'Whipped Shea Butter', '24k Gold Leaf'],
    bioActives: {
      headlineCompound: 'Ultrafine Pearl Mica + Silk Amino Acids',
      actives: ['Mineral Champagne Mica', '24k Gold Leaf', 'Shea Nacre', 'Vitamin C'],
      mineralCore: 'Light-Refracting Pearl Crystal',
      skinBenefit: 'Leaves arms and collarbones softly radiant.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: shimmerOpalImg,
    imageAlt: 'Champagne Opal Shimmer dual-layer soap bar with swirling gold pearl shimmer over ivory butter cream and 24k gold flake',
    fallbackGradient: 'from-[#C99B58] via-[#E5C896] to-[#F7EFE1]',
    senses: {
      sight: 'Iridescent champagne tides swirling quietly above matte ivory.',
      scent: 'Crushed pear blossom floating over warm white amber.',
      touch: 'Lather glides like warm silk satin across skin.',
      sound: 'Soft crystal rim chime at midnight toast.',
      taste: 'Chilled pear champagne sorbet.',
      sixthSense: 'Quiet sunlit celebration.',
    },
  },
];

export const HOLIDAY_EDITION_LINE: SoapCreation[] = applyStandardThbPricing(RAW_HOLIDAY_LINE);

export const ALL_SOAP_CREATIONS: SoapCreation[] = [
  ...DARK_5050_LINE,
  ...BRIGHT_5050_LINE,
  ...HOLIDAY_EDITION_LINE,
];

// ============================================================================
// 3 SIGNATURE MARBLE CASES — EACH WITH 10 REAL LINE SOAPS + 2 LOOFAH SCRUB SLOTS
// ============================================================================
export const LOOFAH_SCRUB_OPTIONS = [
  { id: 'egyptian-raw', label: 'Raw Egyptian Loofah', material: 'Sun-cured botanical gourd fiber', swatchHex: '#DEC9A4' },
  { id: 'silk-mesh', label: 'Soft Silk Loofah', material: 'Double-spun fine exfoliating cushion', swatchHex: '#EFE6D5' },
  { id: 'charcoal-hemp', label: 'Charcoal Hemp Loofah', material: 'Binchotan-woven scrub weave', swatchHex: '#46413E' },
  { id: 'honey-comb', label: 'Golden Honey Loofah', material: 'Soft unbleached bath buff pad', swatchHex: '#CFA663' },
] as const;

export const MARBLE_CASSETTE_SETS: MarbleCassetteEdition[] = [
  {
    id: 'cassette-bright-marble-loofah',
    name: 'Bright Marble Case · 10 Bars + 2 Loofahs',
    stoneType: 'bright-marble',
    subtitle: 'Carved White Calacatta Case · Full 10 Bright Line + 2 Loofah Scrub Slots',
    scarcityTag: '10 Bright Bars + 2 Loofahs',
    priceUsd: 8800,
    compareAtUsd: 10600,
    imageUrl: caseBrightMarbleLoofahImg,
    contents: 'Calacatta Ivory Box · 10 Bright 50/50 Soaps + 2 Carved Loofah Scrub Holders',
    brightRowIds: BRIGHT_5050_LINE.map((s) => s.id),
    darkRowIds: [],
    loofahSlots: [
      {
        slotNumber: 1,
        label: 'Loofah Scrub 01',
        material: 'Raw Egyptian Loofah Disc',
        swatchHex: '#DEC9A4',
      },
      {
        slotNumber: 2,
        label: 'Loofah Scrub 02',
        material: 'Soft Silk Mesh Loofah Pad',
        swatchHex: '#EFE6D5',
      },
    ],
    description:
      'Carved white Calacatta stone coffret fitted with all 10 Bright soaps and 2 circular loofah scrub holders.',
  },
  {
    id: 'cassette-dark-marble-loofah',
    name: 'Dark Marble Case · 10 Bars + 2 Loofahs',
    stoneType: 'dark-marble',
    subtitle: 'Carved Nero Marquina Case · Full 10 Dark Line + 2 Loofah Scrub Slots',
    scarcityTag: '10 Dark Bars + 2 Loofahs',
    priceUsd: 8800,
    compareAtUsd: 10600,
    imageUrl: caseDarkMarbleLoofahImg,
    contents: 'Nero Black Stone Box · 10 Dark 50/50 Soaps + 2 Carved Loofah Scrub Holders',
    brightRowIds: [],
    darkRowIds: DARK_5050_LINE.map((s) => s.id),
    loofahSlots: [
      {
        slotNumber: 1,
        label: 'Loofah Scrub 01',
        material: 'Charcoal-Woven Loofah Pad',
        swatchHex: '#46413E',
      },
      {
        slotNumber: 2,
        label: 'Loofah Scrub 02',
        material: 'Natural Hemp-Loofah Scrubber',
        swatchHex: '#9C8E7B',
      },
    ],
    description:
      'Dark Nero black marble coffret housing all 10 Dark line creations beside 2 woven loofah scrub holders.',
  },
  {
    id: 'cassette-checkered-occasions-loofah',
    name: 'Occasions Checkered Marble Case · 10 + 2 Loofahs',
    stoneType: 'checkered-occasions',
    subtitle: 'Checkered Black & Ivory Marble Chest · 10 Holiday Bars + 2 Loofah Scrub Slots',
    scarcityTag: '10 Occasion Bars + 2 Loofahs',
    priceUsd: 9200,
    compareAtUsd: 11000,
    imageUrl: caseCheckeredOccasionsLoofahImg,
    contents: 'Checkered Marble Chest · 10 Festive Holiday Soaps + 2 Natural Loofah Holders',
    brightRowIds: [],
    darkRowIds: [],
    holidayRowIds: HOLIDAY_EDITION_LINE.map((s) => s.id),
    loofahSlots: [
      {
        slotNumber: 1,
        label: 'Loofah Scrub 01',
        material: 'Golden Fiber Bath Loofah',
        swatchHex: '#CFA663',
      },
      {
        slotNumber: 2,
        label: 'Loofah Scrub 02',
        material: 'Cotton-Loop Exfoliating Pad',
        swatchHex: '#E7D8BE',
      },
    ],
    description:
      'Signature alternating ivory-and-black checkered marble chest enclosing all 10 Holiday editions plus 2 natural loofah scrub slots.',
  },
];

export interface RibbonSealOption {
  id: string;
  name: string;
  swatch: string;
  highlightHex: string;
  shadowHex: string;
  edgeHex: string;
  sealHex: string;
}

export const RIBBON_SEAL_OPTIONS: RibbonSealOption[] = [
  {
    id: 'wax-gold',
    name: 'Champagne Silk',
    swatch: '#D8B878',
    highlightHex: '#F7E9C4',
    shadowHex: '#947030',
    edgeHex: '#FFF6DE',
    sealHex: '#C59A46',
  },
  {
    id: 'wax-crimson',
    name: 'Crimson Lacquer',
    swatch: '#9E2434',
    highlightHex: '#D95B6C',
    shadowHex: '#590C16',
    edgeHex: '#F3B0B9',
    sealHex: '#B62D3F',
  },
  {
    id: 'wax-azure',
    name: 'Celestial Blue',
    swatch: '#73B1E4',
    highlightHex: '#BCE0FC',
    shadowHex: '#3B6F9E',
    edgeHex: '#EBF6FF',
    sealHex: '#5A99CF',
  },
  {
    id: 'wax-emerald',
    name: 'Evergreen Jade',
    swatch: '#2D6E4E',
    highlightHex: '#5DAB84',
    shadowHex: '#153E29',
    edgeHex: '#B2E4CA',
    sealHex: '#3D8863',
  },
  {
    id: 'wax-rose',
    name: 'Damask Blush',
    swatch: '#DCA0B0',
    highlightHex: '#FAD6E0',
    shadowHex: '#9E6172',
    edgeHex: '#FFF2F5',
    sealHex: '#C28092',
  },
  {
    id: 'wax-espresso',
    name: 'Espresso Velvet',
    swatch: '#3E2B22',
    highlightHex: '#735345',
    shadowHex: '#1B110D',
    edgeHex: '#C9AB96',
    sealHex: '#573D31',
  },
];

export const THAI_TURNTABLES: ThaiTurntableEdition[] = [
  {
    id: 'thai-siam-pomelo',
    name: 'Siam Ruby Pomelo & Lemongrass',
    thaiTitle: 'ส้มโอทับทิมสยามและตะไคร้',
    priceUsd: 1000,
    imageUrl: thaiPomeloImg,
    imageAlt: 'Siam Ruby Pomelo translucent citrus and lemongrass cream bar',
    fallbackGradient: 'from-[#9E2434] via-[#C6797B] to-[#EFE8DB]',
    description: 'Amphawa ruby pomelo gel paired cleanly with whipped lemongrass coconut cream.',
    chimeFrequencyHz: 523.25,
    angles: [
      { angle: 0, label: '0° Clear Crown', detail: 'Ruby citrus translucency.' },
      { angle: 90, label: '90° Silk Join', detail: 'Hand-joined 50/50 seam.' },
      { angle: 180, label: '180° Maison Seal', detail: 'Bangkok lotus botanical stamp.' },
      { angle: 270, label: '270° Chamfer Edge', detail: 'Smooth palm-contoured bevel.' },
    ],
  },
  {
    id: 'thai-lotus-pandan',
    name: 'Pink Lotus, Pandan & Coconut Cream',
    thaiTitle: 'บัวชมพูใบเตยและน้ำอบไทย',
    priceUsd: 1000,
    imageUrl: thaiLotusImg,
    imageAlt: 'Pink Lotus Pandan and Coconut Milk heritage botanical bar',
    fallbackGradient: 'from-[#D6929C] via-[#9EB89B] to-[#F3ECE2]',
    description: 'Freshwater lotus mist, pandan extract, and traditional Thai coconut cream.',
    chimeFrequencyHz: 440.0,
    angles: [
      { angle: 0, label: '0° Lotus Veil', detail: 'Petal-soft botanical gel.' },
      { angle: 90, label: '90° Pandan Cut', detail: 'Vibrant green leaf seam.' },
      { angle: 180, label: '180° Reverse Seal', detail: 'Steeped sandalwood finish.' },
      { angle: 270, label: '270° Satin Heel', detail: 'Dense moisture-rich base.' },
    ],
  },
  {
    id: 'thai-charcoal-oolong',
    name: 'Jasmine Rice & Cream Sablé',
    thaiTitle: 'มะลิขาวและครีมน้ำนมข้าว',
    priceUsd: 1000,
    imageUrl: thaiJasmineImg,
    imageAlt: 'Jasmine Rice and Cream Sable sculptural bar on travertine stone',
    fallbackGradient: 'from-[#E2DDD2] via-[#ECE5D5] to-[#D6C3A4]',
    description: 'Whole Hom Mali jasmine flowers suspended in clear gel beside rice-bran cream.',
    chimeFrequencyHz: 392.0,
    angles: [
      { angle: 0, label: '0° Jasmine Crown', detail: 'Whole jasmine buds in gel.' },
      { angle: 90, label: '90° Silk Line', detail: 'Precision hand-poured seam.' },
      { angle: 180, label: '180° Rice Cream', detail: 'Ceramide rice-bran butter.' },
      { angle: 270, label: '270° Slim Profile', detail: 'Balanced architectural cut.' },
    ],
  },
];

export const CUSTOMER_VOICES: CustomerVoice[] = [
  {
    quote: 'Cloud-soft coconut foam and zero tightness after rinsing.',
    author: 'Natcha S.',
    city: 'Bangkok',
    soapName: 'Thai Coconut Milk & Pearl',
  },
  {
    quote: 'Stunning gold yolk center that scents the whole bath calmly.',
    author: 'Elena V.',
    city: 'London',
    soapName: 'Coronation Saffron & Golden Yolk',
  },
  {
    quote: 'Checkered marble case arrived sealed with two natural loofahs.',
    author: 'Pimchanok K.',
    city: 'Singapore',
    soapName: 'Occasions Checkered Marble Case',
  },
];
