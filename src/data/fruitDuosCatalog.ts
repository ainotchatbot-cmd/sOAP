// Luxury Fruit Duos & Dead Sea Botanical Jelly Collection
// 3 Colorways: Bright · Dark · Holiday — Half-Translucent Botanical Jelly / Half-Opaque Sablé Butter
// Featuring Alphonso Mangifera, Mara Fragaria, Valrhona Dark Choco, and Brownish Translucent Dead Sea Mud & Seaweed
// Embossed Monogram Subtype Codes (GB·C, GB·S, GB·M, GB·K, GB·CS, GB·MS), 24k Rose/Yellow Gold Leaf & End-Souvenir Gem

import duoAlphonsoMangoImg from '../assets/images/duo_alphonso_mango_bright_1795424502037.jpg';
import duoGarnetStrawberryDarkImg from '../assets/images/duo_garnet_strawberry_dark_1795424502200.jpg';
import duoDeadSeaSeaweedChocoImg from '../assets/images/duo_deadsea_seaweed_choco_1795424501050.jpg';
import duoHolidayMangoStrawberryImg from '../assets/images/duo_holiday_mango_strawberry_reserve_1795424502675.jpg';
import brightPinkPomImg from '../assets/images/tall_pink_pomegranate_1794830258922.jpg';
import holidayLunarNewYearImg from '../assets/images/tall_lunar_mandarin_1794830283892.jpg';

import type { SoapCreation } from './soaps';
import { type EngravingGrooveKind, GROOVE_SPECS } from './engravingSpecs';
import type { BathBombCreation } from './bathBombs';
import type { VaultPairedFormulation } from './memberVaultCatalog';

export type FruitDuoColorway = 'bright' | 'dark' | 'holiday';
export type EndSouvenirType = '24k-rose-gold' | '24k-yellow-gold';

export interface FruitDuoCreation extends SoapCreation {
  engStampCode: string;
  subtypeCode: 'C' | 'S' | 'M' | 'K' | 'CS' | 'MS';
  colorway: FruitDuoColorway;
  endSouvenir: EndSouvenirType;
  endSouvenirEn: string;
  endSouvenirTh: string;
  activeHeadlineEn: string;
  activeHeadlineTh: string;
  halfSplitNoteEn: string;
  halfSplitNoteTh: string;
  frenchAtelierName: string;
  grooveStyle: EngravingGrooveKind;
  grooveLabelEn: string;
  grooveLabelTh: string;
  gentleBubbleSeal: string;
  pairedBombId: string;
}

export interface SoapSideBadgeSpec {
  position: 'left' | 'right';
  code: string;
  shortLabel: string;
  shortLabelTh: string;
  kind: 'vit-c' | 'salicylic' | 'dead-sea' | 'kojic' | 'botanical' | 'gold-leaf' | 'souvenir' | 'monogram';
  accentHex: string;
}

export const LUXURY_FRUIT_DUOS_LINE: FruitDuoCreation[] = [
  // ==========================================================================
  // BRIGHT COLORWAY (2)
  // ==========================================================================
  {
    id: 'duo-mangifera-lumina',
    line: 'bright',
    colorway: 'bright',
    engStampCode: 'GB·C',
    subtypeCode: 'C',
    frenchAtelierName: 'Mangifera Lumina N°C',
    grooveStyle: 'diagonal',
    grooveLabelEn: GROOVE_SPECS.diagonal.en,
    grooveLabelTh: GROOVE_SPECS.diagonal.th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-mangifera-lumina',
    endSouvenir: '24k-yellow-gold',
    endSouvenirEn: '24k Yellow Gold Leaf + Diagonal 3D Grooves',
    endSouvenirTh: 'ทองคำเปลวแท้ 24K + ร่องสลักเฉียง 3 มิติ',
    activeHeadlineEn: '5.0% Stabilized Vitamin C · Cold-Milled Alphonso Mango',
    activeHeadlineTh: 'วิตามินซีเสถียร 5.0% · มะม่วงอัลฟองโซสกัดเย็น',
    halfSplitNoteEn: '50% Translucent Sunlit Mango Jelly / 50% Opaque Jasmine Rice Sablé',
    halfSplitNoteTh: '50% เจลใสสีมะม่วงสุกส่องแสง / 50% ครีมซาเบล่ข้าวมะลิทึบแสง',
    editionNumber: 'FD-I',
    batchHarvestId: 'FD#104-GBC',
    name: 'Mangifera Lumina · Alphonso & Jasmine Sablé',
    formulaBrand: 'Engraved GB·C · Stay-C 50 Vitamin C 5.0%',
    colorThemeLabel: 'Bright Sunlit · Half-Clear Mango',
    whisperSubtitle: 'Translucent Sunlit Mango Crystal · Opaque Hom Mali Sablé Cream',
    sableDescription:
      'Half translucent Alphonso mango enzyme crystal lit from within by 24k yellow gold leaf flakes; half opaque silky jasmine rice sablé biscuit deeply carved with signature diagonal grip grooves and crisp GB·C engraving.',
    botanicalLayers: {
      crystalTitle: 'Translucent Alphonso Mangifera Jelly',
      crystalNote: 'Sun-ripened Alphonso mango pulp & 5.0% Vitamin C ester refine radiance cleanly.',
      crystalColorHex: '#F39A27',
      creamTitle: 'Opaque Jasmine Rice & Oat Sablé',
      creamNote: 'Whipped Thai jasmine rice milk, shea biscuit butter & squalane shield softness.',
      creamColorHex: '#F8EFE0',
    },
    palettePair: ['#F39A27', '#F8EFE0'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Yellow Gold + 3D Grooves',
      whisperDetail: '24k yellow gold leaf ribbons floating inside amber mango jelly with deep diagonal carvings.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'yellow-gold',
    thaiSubtitle: 'แมงกิเฟอรา ลูมินา · มะม่วงอัลฟองโซและซาเบล่ข้าวมะลิ (GB·C 5%)',
    editionNote: 'Bright Duo 01 · 5.0% Vit C',
    specMetric: '5.0% Vitamin C · 24k Yellow Gold Leaf · Diagonal 3D Grooves',
    emotionalNeed: 'Dewy morning radiance bottled between translucent mango jelly and warm biscuit cream.',
    scentMood: 'Sun-Ripe Alphonso Mango & Warm Rice Milk',
    scentIntensity: 4,
    scentIntensityLabel: 'Ripe Alphonso Mango & Toasted Hom Mali Sablé',
    mapX: 30,
    mapY: 70,
    packagingMarkers: ['split-5050', 'vit-cead'],
    ingredients: [
      'Stabilized Vitamin C Ester (5.0%)',
      'Alphonso Mango Enzyme Extract',
      'Jasmine Rice Milk Sablé',
      '24k Edible Yellow Gold Leaf',
    ],
    bioActives: {
      headlineCompound: '5.0% Stabilized Vitamin C (GB·C) + Alphonso Carotenoids',
      actives: ['Vitamin C 5.0% (GB·C)', 'Alphonso Mango Ester', 'Rice Milk Ceramide 2%', '24k Edible Yellow Gold Leaf'],
      mineralCore: '24k Gold Leaf + Diagonal 3D Carved Grooves',
      skinBenefit: 'Visibly brightens uneven tone while rice sablé lipids prevent tightness.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: duoAlphonsoMangoImg,
    imageAlt:
      'Mangifera Lumina half-transparent golden Alphonso mango soap bar paired with opaque ivory sablé engraved GB·C, 24k yellow gold leaf, and deep 3D diagonal grooves',
    fallbackGradient: 'from-[#F39A27] via-[#F7CE8A] to-[#F8EFE0]',
    senses: {
      sight: 'Clear amber-gold mango glass fused flush to crisp cream sablé carved GB·C.',
      scent: 'Sun-warmed mango orchard brushing against steamed jasmine biscuit.',
      touch: 'Precision 3D carved grooves glide smoothly while milky rice butter softens skin.',
      sound: 'Crisp porcelain chime across hand-carved botanical ridges.',
      taste: 'Chilled Alphonso mango sorbet beside buttery French sablé.',
      sixthSense: 'Radiant, sunlit buoyancy.',
    },
  },
  {
    id: 'duo-fragaria-alba',
    line: 'bright',
    colorway: 'bright',
    engStampCode: 'GB·K',
    subtypeCode: 'K',
    frenchAtelierName: 'Fragaria Alba N°K',
    grooveStyle: 'era-inspired',
    grooveLabelEn: GROOVE_SPECS['era-inspired'].en,
    grooveLabelTh: GROOVE_SPECS['era-inspired'].th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-fragaria-alba',
    endSouvenir: '24k-rose-gold',
    endSouvenirEn: '24k Rose Gold Leaf + Era Relief Grooves',
    endSouvenirTh: 'ทองโรสโกลด์ 24K + ร่องสลักประจำยุค',
    activeHeadlineEn: '3.0% Kojic Dipalmitate + 2.0% Vit C · Mara Strawberry',
    activeHeadlineTh: 'โคจิก 3.0% + วิตามินซี 2.0% · สตรอว์เบอร์รี่มารา เดอ บัว',
    halfSplitNoteEn: '50% Translucent Rose-Ruby Strawberry Jelly / 50% Opaque Sweet Almond Cream',
    halfSplitNoteTh: '50% เจลใสสตรอว์เบอร์รี่สีชมพูระเรื่อ / 50% ครีมซาเบล่อัลมอนด์',
    editionNumber: 'FD-II',
    batchHarvestId: 'FD#108-GBK',
    name: 'Fragaria Alba · Mara Strawberry & Rose Milk',
    formulaBrand: 'Engraved GB·K · 3.0% Kojic + Strawberry Polyphenols',
    colorThemeLabel: 'Bright Blossom · Half-Clear Strawberry',
    whisperSubtitle: 'Translucent Rose Strawberry Crystal · Opaque Almond Milk Sablé',
    sableDescription:
      'Pressed alpine Mara des Bois strawberry nectar suspended in luminous rose translucency beside whipped sweet-almond sablé cream, finished with hammered 24k rose gold leaf and intricate era relief grooves.',
    botanicalLayers: {
      crystalTitle: 'Translucent Mara Fragaria Crystal',
      crystalNote: 'Cold-steeped French alpine strawberry juice, hibiscus AHA & 3.0% Kojic complex.',
      crystalColorHex: '#EA7A92',
      creamTitle: 'Opaque Almond Milk Sablé',
      creamNote: 'Whipped sweet almond butter & silk peptide milk cocoon delicate skin.',
      creamColorHex: '#FCECF0',
    },
    palettePair: ['#EA7A92', '#FCECF0'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Rose Gold + Era Grooves',
      whisperDetail: '24k pink-rose gold leaf ribbons along classical fluted bar edges.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'rose-gold',
    thaiSubtitle: 'ฟราการ์เรีย อัลบา · สตรอว์เบอร์รี่ฝรั่งเศสและครีมอัลมอนด์ (GB·K 3%)',
    editionNote: 'Bright Duo 02 · 3.0% Kojic',
    specMetric: '3.0% Kojic + 2.0% Vit C · 24k Rose Gold + Relief Grooves',
    emotionalNeed: 'Crushed pink berry lightness anchored in porcelain almond cream.',
    scentMood: 'Alpine Mara Strawberry & Whipped Almond Nectar',
    scentIntensity: 4,
    scentIntensityLabel: 'Wild French Strawberry & White Peach Cream',
    mapX: 34,
    mapY: 54,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: [
      'Kojic Dipalmitate (3.0% GB·K)',
      'Mara des Bois Strawberry Ellagic Acid (2.0%)',
      'Sweet Almond Silk Butter',
      '24k Edible Rose Gold Leaf',
    ],
    bioActives: {
      headlineCompound: '3.0% Kojic Dipalmitate (GB·K) + 2.0% Strawberry Vitamin C',
      actives: ['Kojic 3.0% (GB·K)', 'Vitamin C 2.0%', 'Almond Silk Peptide 2%', '24k Edible Rose Gold Leaf'],
      mineralCore: '24k Rose Gold Leaf + Fluted 3D Relief',
      skinBenefit: 'Softly polishes complexion clarity without stripping the lipid mantle.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: brightPinkPomImg,
    imageAlt:
      'Fragaria Alba translucent blush strawberry jelly and opaque almond cream bar with engraved GB·K mark, 24k rose gold leaf, and fluted 3D grooves',
    fallbackGradient: 'from-[#EA7A92] via-[#F4B4C2] to-[#FCECF0]',
    senses: {
      sight: 'Sunlit pink strawberry crystal catching rose-gold leaf shimmer beside snowy almond butter.',
      scent: 'Crushed morning garden strawberries dusted in white vanilla sugar.',
      touch: 'Featherlight berry froth guided smoothly by scalloped botanical grooves.',
      sound: 'Ribbon sliding across glazed porcelain.',
      taste: 'Wild strawberry blancmange & almond tuile.',
      sixthSense: 'Poised, incandescent clarity.',
    },
  },

  // ==========================================================================
  // DARK COLORWAY (2) — DEAD SEA MUD SEAWEED + DARK CHOCO & SALICYLIC RUBY
  // ==========================================================================
  {
    id: 'duo-abyssal-maris',
    line: 'dark',
    colorway: 'dark',
    engStampCode: 'GB·M',
    subtypeCode: 'M',
    frenchAtelierName: 'Abyssal Maris & Valrhona N°M',
    grooveStyle: 'futuristic-fractal',
    grooveLabelEn: GROOVE_SPECS['futuristic-fractal'].en,
    grooveLabelTh: GROOVE_SPECS['futuristic-fractal'].th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-abyssal-maris',
    endSouvenir: '24k-rose-gold',
    endSouvenirEn: '24k Yellow Gold Leaf + Futuristic Fractal Grooves',
    endSouvenirTh: 'ทองคำเปลว 24K + ร่องสลักฟรักทัล',
    activeHeadlineEn: '10.0% Dead Sea Silt + Kelp + 85% Valrhona Dark Choco',
    activeHeadlineTh: 'โคลนทะเลเดดซี 10% สาหร่ายเคลป์ และดาร์กช็อกโกแลต 85%',
    halfSplitNoteEn: '50% Brownish Translucent Dead Sea Seaweed Jelly / 50% Opaque Dark Choco Sablé',
    halfSplitNoteTh: '50% เจลโปร่งแสงสีน้ำตาลอำพันโคลนเดดซีและสาหร่าย / 50% ซาเบล่ดาร์กช็อกโกแลตทึบ',
    editionNumber: 'FD-III',
    batchHarvestId: 'FD#201-GBM',
    name: 'Abyssal Maris · Dead Sea Kelp & Dark Choco',
    formulaBrand: 'Engraved GB·M · 10% Dead Sea Brine + Kelp + Valrhona Noir',
    colorThemeLabel: 'Dark Amber Brine · Brownish Jelly + Noir Cacao',
    whisperSubtitle: 'Brownish Translucent Dead Sea Seaweed Gel · Opaque 85% Dark Cacao Sablé',
    sableDescription:
      'Half brownish transparent mineral-amber jelly steeped with 10.0% Dead Sea mud & deep-ocean kelp seaweed; half opaque 85% dark Valrhona cacao sablé—engraved GB·M with 24k yellow gold leaf and fractal 3D grip grooves.',
    botanicalLayers: {
      crystalTitle: 'Brownish Translucent Dead Sea Mud & Kelp Jelly',
      crystalNote: '10.0% Dead Sea magnesium brine & marine kelp suspended in smoky bronze gel.',
      crystalColorHex: '#7A5434',
      creamTitle: 'Opaque 85% Valrhona Dark Choco Sablé',
      creamNote: 'Unroasted cacao polyphenols & black oat lipids restore silky resilience.',
      creamColorHex: '#2B1B15',
    },
    palettePair: ['#7A5434', '#2B1B15'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Yellow Gold + Fractal Grooves',
      whisperDetail: '24k yellow gold leaf gleaming inside smoky Dead Sea jelly with fractal carved ribs.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'yellow-gold',
    thaiSubtitle: 'อะบิสซัล มาริส · โคลนเดดซี 10% สาหร่าย และดาร์กช็อกโกแลต (GB·M)',
    editionNote: 'Dark Duo 01 · 10% Dead Sea',
    specMetric: '10% Dead Sea Mud · 24k Yellow Gold · Fractal 3D Grooves',
    emotionalNeed: 'Mineral depth of the Dead Sea balanced by velvet dark chocolate indulgence.',
    scentMood: 'Smoked Sea Salt Kelp & 85% Dark Cacao Ganache',
    scentIntensity: 5,
    scentIntensityLabel: 'Deep Valrhona Dark Chocolate, Sea Salt Brine & Amber Kelp',
    mapX: 82,
    mapY: 28,
    packagingMarkers: ['split-5050', 'coffee-mg', 'ginseng-root'],
    ingredients: [
      'Dead Sea Mineral Silt & Brine (10.0% GB·M)',
      'Atlantic Laminaria Kelp Seaweed (3.0%)',
      '85% Valrhona Cacao Butter Sablé',
      '24k Edible Yellow Gold Leaf',
    ],
    bioActives: {
      headlineCompound: '10.0% Dead Sea Mg Brine (GB·M) + 3.0% Kelp Bio-Iodine',
      actives: ['Dead Sea Silt 10% (GB·M)', 'Laminaria Kelp 3.0%', 'Cacao Polyphenols', '24k Edible Yellow Gold Leaf'],
      mineralCore: '24k Yellow Gold Leaf + Fractal 3D Channels',
      skinBenefit: 'Draws congestion cleanly with Dead Sea brine while cacao lipids cocoon skin in velvet.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: duoDeadSeaSeaweedChocoImg,
    imageAlt:
      'Abyssal Maris soap bar with brownish transparent Dead Sea mud and seaweed jelly left fused to opaque dark Valrhona chocolate engraved GB·M right with 24k gold leaf',
    fallbackGradient: 'from-[#7A5434] via-[#4D3221] to-[#2B1B15]',
    senses: {
      sight: 'Warm bronze seaweed ribbons suspended in clear Dead Sea amber beside dark cacao velvet.',
      scent: 'Warm sea-salted dark chocolate ganache steeped over toasted Atlantic kelp.',
      touch: 'Sculpted fractal grooves release lush cacao cream beside mineral kelp gel.',
      sound: 'Deep twilight surf retreating across smooth basalt pebbles.',
      taste: 'Sea-salted 85% single-origin dark truffle.',
      sixthSense: 'Quiet restorative sovereignty.',
    },
  },
  {
    id: 'duo-nocturne-fragaria',
    line: 'dark',
    colorway: 'dark',
    engStampCode: 'GB·S',
    subtypeCode: 'S',
    frenchAtelierName: 'Nocturne Fragaria N°S',
    grooveStyle: 'diagonal',
    grooveLabelEn: GROOVE_SPECS.diagonal.en,
    grooveLabelTh: GROOVE_SPECS.diagonal.th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-nocturne-fragaria',
    endSouvenir: '24k-rose-gold',
    endSouvenirEn: '24k Rose Gold Leaf + Diagonal 3D Grooves',
    endSouvenirTh: 'ทองโรสโกลด์ 24K + ร่องสลักเฉียง 3 มิติ',
    activeHeadlineEn: '2.0% Salicylic Acid (BHA) · Dark Ruby Strawberry + Noir Cacao',
    activeHeadlineTh: 'กรดซาลิไซลิก 2.0% · สตรอว์เบอร์รี่ทับทิมดำและซาเบล่โกโก้',
    halfSplitNoteEn: '50% Dark Garnet Strawberry Jelly / 50% Opaque Obsidian Cacao Cream',
    halfSplitNoteTh: '50% เจลสตรอว์เบอร์รี่สีโกเมนเข้ม / 50% ครีมโกโก้ออบซิเดียนทึบแสง',
    editionNumber: 'FD-IV',
    batchHarvestId: 'FD#206-GBS',
    name: 'Nocturne Fragaria · Garnet Berry & Obsidian Sablé',
    formulaBrand: 'Engraved GB·S · 2.0% Salicylic Acid (BHA)',
    colorThemeLabel: 'Dark Nocturne · Garnet Berry + Noir',
    whisperSubtitle: 'Translucent Garnet Strawberry Jelly · Opaque Obsidian Cacao Sablé',
    sableDescription:
      'Deep wine-garnet translucent strawberry crystal fortified with clarifying 2.0% Salicylic Acid (stamped GB·S) fused beside obsidian dark-cacao cream, veiled in 24k rose gold leaf and etched with deep diagonal scrubbing grooves.',
    botanicalLayers: {
      crystalTitle: 'Garnet-Ruby Strawberry BHA Jelly',
      crystalNote: '2.0% Salicylic Acid & dark anthocyanin berry crystal clarify pores cleanly.',
      crystalColorHex: '#7E1728',
      creamTitle: 'Obsidian Dark Cacao Sablé',
      creamNote: 'Binchotan bamboo mist, black sesame lipid & shea butter calm nighttime renewal.',
      creamColorHex: '#1E181A',
    },
    palettePair: ['#7E1728', '#1E181A'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Rose Gold + Diagonal Grooves',
      whisperDetail: '24k pink-rose gold leaf suspended beside deep garnet glass with diagonal grooves.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'rose-gold',
    thaiSubtitle: 'น็อกเทิร์น ฟราการ์เรีย · สตรอว์เบอร์รี่สีโกเมนและซาลิไซลิก 2% (GB·S)',
    editionNote: 'Dark Duo 02 · 2.0% BHA',
    specMetric: '2.0% Salicylic BHA · 24k Rose Gold + Diagonal 3D Grooves',
    emotionalNeed: 'Targeted twilight pore clarity cloaked inside opulent dark-berry velvet.',
    scentMood: 'Dark Garnet Strawberry & Smoked Cacao Bean',
    scentIntensity: 5,
    scentIntensityLabel: 'Macerated Black Strawberry & Dark Roasted Cocoa',
    mapX: 86,
    mapY: 54,
    packagingMarkers: ['split-5050', 'coffee-mg', 'collagen-1-2'],
    ingredients: [
      'Salicylic Acid BHA (2.0% GB·S)',
      'Dark Macerated Strawberry Anthocyanins',
      'Obsidian Cacao & Binchotan Sablé',
      '24k Edible Rose Gold Leaf',
    ],
    bioActives: {
      headlineCompound: '2.0% Salicylic Acid BHA (GB·S) + Strawberry Anthocyanins',
      actives: ['Salicylic Acid 2.0% (GB·S)', 'Garnet Berry AHA 1.5%', 'Binchotan Lipid', '24k Edible Rose Gold Leaf'],
      mineralCore: '24k Rose Gold Leaf + Diagonal 3D Scrub Grooves',
      skinBenefit: 'Decongests pores gently overnight while keeping barrier bounce plush.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: duoGarnetStrawberryDarkImg,
    imageAlt:
      'Nocturne Fragaria dark garnet half-transparent strawberry and obsidian cacao soap bar engraved GB·S with 24k rose gold leaf and diagonal 3D grooves',
    fallbackGradient: 'from-[#7E1728] via-[#4C1821] to-[#1E181A]',
    senses: {
      sight: 'Deep blood-garnet strawberry crystal flashing pink gold beside matte obsidian cacao.',
      scent: 'Crushed dark macerated strawberries dipped into smoked bitter ganache.',
      touch: 'Crisp BHA berry glide sealing swiftly into velvety black-cacao butter.',
      sound: 'Velvet theater curtain drawing quietly shut at midnight.',
      taste: 'Dark chocolate-dipped black strawberry truffle.',
      sixthSense: 'Clarified nocturnal composure.',
    },
  },

  // ==========================================================================
  // HOLIDAY COLORWAY (2) — MANGO + STRAWBERRY DUO & DEAD SEA HOLIDAY RESERVE
  // ==========================================================================
  {
    id: 'duo-solstice-citrus-berry',
    line: 'holiday',
    colorway: 'holiday',
    holidayOccasion: 'Solstice Gala Reserve',
    engStampCode: 'GB·CS',
    subtypeCode: 'CS',
    frenchAtelierName: 'Solstice Mangifera-Fragaria N°CS',
    grooveStyle: 'era-inspired',
    grooveLabelEn: GROOVE_SPECS['era-inspired'].en,
    grooveLabelTh: GROOVE_SPECS['era-inspired'].th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-solstice-citrus-berry',
    endSouvenir: '24k-rose-gold',
    endSouvenirEn: '24k Dual Gold Leaf + Classical Relief Grooves',
    endSouvenirTh: 'ทองคำเปลวคู่ 24K + ร่องสลักประจำยุค',
    activeHeadlineEn: '3.0% Vitamin C + 1.0% Salicylic BHA · Mango & Strawberry',
    activeHeadlineTh: 'วิตามินซี 3.0% + ซาลิไซลิก 1.0% · ดูโอมะม่วงและสตรอว์เบอร์รี่',
    halfSplitNoteEn: '50% Translucent Mango-Strawberry Jewel Gel / 50% Champagne Oat Sablé',
    halfSplitNoteTh: '50% เจลใสมะม่วงผสานสตรอว์เบอร์รี่ / 50% ครีมซาเบล่แชมเปญและข้าวโอ๊ต',
    editionNumber: 'FD-V',
    batchHarvestId: 'FD#301-GBCS',
    name: 'Solstice Reserve · Mango, Fragaria & Champagne',
    formulaBrand: 'Engraved GB·CS · 3.0% Vit C + 1.0% BHA',
    colorThemeLabel: 'Events Crimson & Amber · Mango + Strawberry',
    whisperSubtitle: 'Translucent Mango-Strawberry Jewel Gel · Opaque Champagne Oat Sablé',
    sableDescription:
      'Our festive events flagship uniting Alphonso mango and Mara strawberry inside a radiant half-translucent ruby-amber crystal stamped GB·CS, anchored to whipped champagne oat sablé with dual 24k gold leaf and era-inspired grooves.',
    botanicalLayers: {
      crystalTitle: 'Mango-Strawberry Dual Fruit Gel',
      crystalNote: '3.0% Vitamin C + 1.0% gentle Salicylic BHA in shimmering fruit-amber crystal.',
      crystalColorHex: '#D8483E',
      creamTitle: 'Champagne Oat & Honey Sablé',
      creamNote: 'Colloidal oat cream, rosehip oil & nectar biscuit hydrate celebratory skin.',
      creamColorHex: '#EFE1CC',
    },
    palettePair: ['#D8483E', '#EFE1CC'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Gold Leaf + Era Grooves',
      whisperDetail: 'Swirled 24k rose & yellow gold flakes over champagne sablé and sculptural relief grooves.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'yellow-gold',
    thaiSubtitle: 'โซลสติซ รีเสิร์ฟ · ดูโอมะม่วงสตรอว์เบอร์รี่และซาเบล่แชมเปญ (GB·CS 3%+1%)',
    editionNote: 'Events Duo 01 · 3% Vit C + 1% BHA',
    specMetric: '3% Vit C + 1% BHA · 24k Gold Leaf + Relief Grooves',
    emotionalNeed: 'Pure celebratory radiance uniting sweet tropical mango and alpine berry.',
    scentMood: 'Alphonso Mango, Alpine Strawberry & Pear Champagne',
    scentIntensity: 5,
    scentIntensityLabel: 'Candied Alphonso Mango, Crushed Berry & Toasted Sablé',
    mapX: 52,
    mapY: 46,
    packagingMarkers: ['split-5050', 'vit-cead', 'collagen-1-2'],
    ingredients: [
      'Stabilized Vitamin C (3.0%) + Salicylic BHA (1.0%)',
      'Alphonso Mango & Mara Strawberry Nectar',
      'Champagne Oat Sablé Butter',
      '24k Edible Rose & Yellow Gold Leaf',
    ],
    bioActives: {
      headlineCompound: 'Dual Synergy 3.0% Vit C + 1.0% BHA (GB·CS)',
      actives: ['Vitamin C 3.0% (GB·CS)', 'Salicylic BHA 1.0%', 'Alphonso & Fragaria Nectar', '24k Edible Gold Leaf'],
      mineralCore: '24k Dual Gold Leaf + Classical Relief Grooves',
      skinBenefit: 'Dual-clarifies pores and illuminates dull winter tone simultaneously.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: duoHolidayMangoStrawberryImg,
    imageAlt:
      'Solstice Reserve holiday duo soap combining translucent mango-strawberry amber jelly and champagne sablé engraved GB·CS with 24k gold leaf and sculptural 3D grooves',
    fallbackGradient: 'from-[#D8483E] via-[#EA985A] to-[#EFE1CC]',
    senses: {
      sight: 'Sunset amber-mango dissolving seamlessly into ruby-strawberry glass beside champagne cream.',
      scent: 'Chilled fruit bellini poured slowly beside warm almond sablé tarts.',
      touch: 'Sparkling silk wrapping skin in plush golden-oat comfort.',
      sound: 'Champagne flutes chiming warmly at midnight.',
      taste: 'Mango-strawberry mille-feuille glazed in spun sugar.',
      sixthSense: 'Incandescent holiday joy.',
    },
  },
  {
    id: 'duo-equinox-sargassum',
    line: 'holiday',
    colorway: 'holiday',
    holidayOccasion: 'Autumn & Coastal Tide Gala',
    engStampCode: 'GB·MS',
    subtypeCode: 'MS',
    frenchAtelierName: 'Equinox Sargassum & Choco N°MS',
    grooveStyle: 'futuristic-fractal',
    grooveLabelEn: GROOVE_SPECS['futuristic-fractal'].en,
    grooveLabelTh: GROOVE_SPECS['futuristic-fractal'].th,
    gentleBubbleSeal: 'GentleBubble',
    pairedBombId: 'bb-duo-equinox-sargassum',
    endSouvenir: '24k-yellow-gold',
    endSouvenirEn: '24k Rose Gold Leaf + Fractal 3D Grooves',
    endSouvenirTh: 'ทองโรสโกลด์ 24K + ร่องสลักฟรักทัล',
    activeHeadlineEn: '8.0% Dead Sea Kelp + 1.5% BHA · Mandarin & Dark Choco',
    activeHeadlineTh: 'โคลนเดดซี 8.0% สาหร่ายและซาลิไซลิก 1.5% · ส้มโกโก้เข้ม',
    halfSplitNoteEn: '50% Translucent Amber-Bronze Seaweed Jelly / 50% Spiced Dark Choco & Mandarin',
    halfSplitNoteTh: '50% เจลใสสาหร่ายและโคลนทะเลสีน้ำตาล / 50% ครีมโกโก้เข้มและส้มมงคล',
    editionNumber: 'FD-VI',
    batchHarvestId: 'FD#309-GBMS',
    name: 'Equinox Sargassum · Brine Mud, Mandarin & Cacao',
    formulaBrand: 'Engraved GB·MS · 8% Dead Sea + 1.5% BHA + Dark Choco',
    colorThemeLabel: 'Events Amber-Noir · Mud Kelp + Mandarin Choco',
    whisperSubtitle: 'Brownish Translucent Kelp Brine Gel · Opaque Spiced Dark Cacao Cream',
    sableDescription:
      'Festive coastal alchemy: brownish transparent 8.0% Dead Sea mud & Sargassum seaweed jelly stamped GB·MS with 1.5% BHA meets spiced dark chocolate sablé and candied mandarin zest with 24k rose gold leaf and deep fractal grooves.',
    botanicalLayers: {
      crystalTitle: 'Brownish Amber Sargassum & Mud Jelly',
      crystalNote: '8.0% Dead Sea trace brine, marine seaweed & 1.5% BHA glow in translucent amber.',
      crystalColorHex: '#8E4924',
      creamTitle: 'Opaque Spiced Dark Cacao & Mandarin',
      creamNote: 'Rich 80% dark chocolate ganache whipped lightly with candied mandarin peel.',
      creamColorHex: '#3A231B',
    },
    palettePair: ['#8E4924', '#3A231B'],
    luxuryInlay: {
      type: 'gold-leaf',
      label: '24k Rose Gold + Fractal Grooves',
      whisperDetail: 'Fluttering 24k rose-gold leaf inside brown brine jelly with ribbed 3D water grooves.',
    },
    signatureFinish: 'translucent',
    edibleGoldLeaf: 'rose-gold',
    thaiSubtitle: 'อิควินอกซ์ ซาร์กัสซัม · โคลนเดดซี 8% ส้มแมนดาริน และดาร์กโกโก้ (GB·MS)',
    editionNote: 'Events Duo 02 · 8% Mud + 1.5% BHA',
    specMetric: '8% Dead Sea + 1.5% BHA · 24k Rose Gold + Fractal Grooves',
    emotionalNeed: 'Spiced citrus warmth floating above mineral Dead Sea serenity.',
    scentMood: 'Candied Mandarin Peel, Sea Kelp & Dark Truffle',
    scentIntensity: 5,
    scentIntensityLabel: 'Candied Mandarin, Dark Chocolate Ganache & Warm Ocean Amber',
    mapX: 60,
    mapY: 64,
    packagingMarkers: ['split-5050', 'coffee-mg'],
    ingredients: [
      'Dead Sea Mud & Sargassum Seaweed (8.0% GB·MS)',
      'Salicylic BHA (1.5%) + Mandarin Peel Oil',
      'Spiced Dark Chocolate Ganache Sablé',
      '24k Edible Rose Gold Leaf',
    ],
    bioActives: {
      headlineCompound: '8.0% Dead Sea Brine + 1.5% BHA (GB·MS) + Mandarin Vitamin C',
      actives: ['Dead Sea Mud 8.0%', 'Salicylic BHA 1.5%', 'Sargassum Kelp 2.5%', '24k Edible Rose Gold Leaf'],
      mineralCore: '24k Rose Gold Leaf + Futuristic Fractal 3D Grooves',
      skinBenefit: 'Balances winter congestion and leaves skin glowing and chocolate-soft.',
    },
    priceUsd: 1000,
    slice100gUsd: 600,
    hugeBlockThb: 2500,
    imageUrl: holidayLunarNewYearImg,
    imageAlt:
      'Equinox Sargassum brownish translucent mud jelly and spiced mandarin dark cacao bar engraved GB·MS with 24k rose gold leaf and deep fractal grooves',
    fallbackGradient: 'from-[#8E4924] via-[#663620] to-[#3A231B]',
    senses: {
      sight: 'Warm spiced amber brine glass glowing next to rich ganache sablé.',
      scent: 'Candied tangerine chocolate orangettes resting near ocean driftwood.',
      touch: 'Silk mineral lather warming directly into luscious cacao-butter cream.',
      sound: 'Distant harbor bell drifting through spiced evening air.',
      taste: 'Candied dark-chocolate orange peel truffle.',
      sixthSense: 'Auspicious, grounded elegance.',
    },
  },
];

// ============================================================================
// REAL-LIFE ACTIVE CONCENTRATION % & SIDE EMBLEM BADGES (Active %, 24k Gold Leaf, 3D Grooves / Salt Crystals)
// ============================================================================

export function getSoapActivePercentText(soap: SoapCreation, lang: 'en' | 'th' = 'en'): string {
  const txt = `${soap.formulaBrand} ${soap.bioActives.headlineCompound} ${soap.ingredients.join(' ')}`;
  const pctMatch = txt.match(/\d+(?:\.\d+)?\s*%/);
  const lower = txt.toLowerCase();

  if (lower.includes('dead sea') || lower.includes('kelp')) {
    const p = pctMatch?.[0] ?? '10%';
    return lang === 'th' ? `แร่เดดซี ${p} + สาหร่าย` : `${p} Dead Sea & Kelp`;
  }
  if (lower.includes('salicylic') || lower.includes('bha')) {
    const p = pctMatch?.[0] ?? '2.0%';
    return lang === 'th' ? `ซาลิไซลิก ${p} BHA` : `${p} Salicylic BHA`;
  }
  if (lower.includes('kojic')) {
    const p = pctMatch?.[0] ?? '3.0%';
    return lang === 'th' ? `โคจิก ${p} + วิตซี` : `${p} Kojic + Vit C`;
  }
  if (lower.includes('vitamin c') || lower.includes('vit c') || soap.packagingMarkers.includes('vit-cead')) {
    const p = pctMatch?.[0] ?? '5.0%';
    return lang === 'th' ? `วิตามินซีเสถียร ${p}` : `${p} Stabilized Vit C`;
  }
  if (lower.includes('hyaluronic')) {
    const p = pctMatch?.[0] ?? '2.5%';
    return lang === 'th' ? `ไฮยาลูรอน ${p} + B5` : `${p} Hyaluronic + B5`;
  }
  if (lower.includes('squalane') || lower.includes('niacin')) {
    const p = pctMatch?.[0] ?? '4.0%';
    return lang === 'th' ? `สควาเลน ${p} + B3` : `${p} Squalane + B3`;
  }
  if (lower.includes('resveratrol') || lower.includes('wine') || lower.includes('pomegranate')) {
    return lang === 'th' ? 'โพลีฟีนอลไวน์ 3.0%' : '3.0% Wine Resveratrol';
  }
  if (lower.includes('cacao') || lower.includes('espresso') || lower.includes('coffee')) {
    return lang === 'th' ? 'คาเฟอีน & โกโก้ 4.0%' : '4.0% Cacao Caffeine';
  }
  if (lower.includes('matcha') || lower.includes('spirulina')) {
    return lang === 'th' ? 'อีจีซีจีชาเขียว 3.0%' : '3.0% Matcha EGCG';
  }
  return lang === 'th' ? 'ไบโอแอคทีฟเข้มข้น 4.0%' : '4.0% Botanical Actives';
}

export function getBombActivePercentText(bomb: BathBombCreation, lang: 'en' | 'th' = 'en'): string {
  const txt = `${bomb.heroActivesEn} ${bomb.brighteningNoteEn}`.toLowerCase();
  if (txt.includes('dead sea') || txt.includes('kelp')) {
    return lang === 'th' ? 'เกลือเดดซี & เคลป์ 12%' : '12% Dead Sea Salt & Kelp';
  }
  if (txt.includes('salicylic') || txt.includes('bha')) {
    return lang === 'th' ? 'ซาลิไซลิก 2.0% + เกลือแร่' : '2.0% BHA + Epsom Crystal';
  }
  if (txt.includes('kojic')) {
    return lang === 'th' ? 'โคจิก 3.0% + เกลือชมพู' : '3.0% Kojic + Pink Salt';
  }
  if (bomb.nutrientFocus === 'wine-vitamins') {
    return lang === 'th' ? 'วิตามินซี 5.0% + เกลือสปา' : '5.0% Vit C + Salt Crystals';
  }
  if (bomb.nutrientFocus === 'milk-peptides') {
    return lang === 'th' ? 'ไนอะซินาไมด์ 4.0% + เปปไทด์' : '4.0% Niacinamide + Milk';
  }
  if (bomb.nutrientFocus === 'marine-tea') {
    return lang === 'th' ? 'ไอโอดีนสาหร่าย 5.0% + เกลือ' : '5.0% Marine Kelp + Salts';
  }
  return lang === 'th' ? 'แมกนีเซียมซัลเฟต 15%' : '15% Pure Bath Salt Crystals';
}

export function getVaultActivePercentText(pair: VaultPairedFormulation, lang: 'en' | 'th' = 'en'): string {
  const combined = `${pair.soapName} ${pair.bombName} ${pair.categoryId}`.toLowerCase();
  if (combined.includes('bha') || combined.includes('salicylic') || pair.categoryId === 'exfoliating-clarifying') {
    return lang === 'th' ? '2.0% BHA + เกลือแร่คริสตัล' : '2.0% BHA + Salt Crystals';
  }
  if (pair.categoryId === 'brightening-even-tone') {
    return lang === 'th' ? '5.0% วิตามินซี & โคจิก' : '5.0% Vit C & Kojic';
  }
  if (pair.categoryId === 'deep-hydration') {
    return lang === 'th' ? '4.0% ไฮยา-แพนทีนอล B5' : '4.0% Hyaluronic & B5';
  }
  if (pair.categoryId === 'barrier-repair') {
    return lang === 'th' ? '5.0% เซราไมด์ & ซิก้า' : '5.0% Ceramide & Cica';
  }
  return lang === 'th' ? '3.5% เปปไทด์คอปเปอร์' : '3.5% Peptide Firming';
}

export function getSoapSideBadges(soap: SoapCreation): SoapSideBadgeSpec[] {
  const isFruitDuo = 'engStampCode' in soap;
  const duo = isFruitDuo ? (soap as FruitDuoCreation) : null;
  const activesJoined = `${soap.name} ${soap.formulaBrand} ${soap.bioActives.headlineCompound} ${soap.ingredients.join(' ')}`.toLowerCase();
  const pctMatch = activesJoined.match(/\d+(?:\.\d+)?%/);

  let primaryCode = duo?.subtypeCode ?? 'V';
  let primaryLabel = `${pctMatch?.[0] ?? '5%'} VIT C`;
  let primaryLabelTh = `วิตซี ${pctMatch?.[0] ?? '5%'}`;
  let primaryKind: SoapSideBadgeSpec['kind'] = 'vit-c';
  let primaryHex = '#D97B29';

  if (duo?.subtypeCode === 'M' || activesJoined.includes('dead sea') || activesJoined.includes('kelp')) {
    primaryCode = duo?.subtypeCode ?? 'M';
    primaryLabel = `${pctMatch?.[0] ?? '10%'} DEAD SEA`;
    primaryLabelTh = `เดดซี ${pctMatch?.[0] ?? '10%'}`;
    primaryKind = 'dead-sea';
    primaryHex = '#7A5434';
  } else if (duo?.subtypeCode === 'S' || activesJoined.includes('salicylic') || activesJoined.includes('bha')) {
    primaryCode = duo?.subtypeCode ?? 'S';
    primaryLabel = `${pctMatch?.[0] ?? '2%'} BHA`;
    primaryLabelTh = `BHA ${pctMatch?.[0] ?? '2%'}`;
    primaryKind = 'salicylic';
    primaryHex = '#9E2434';
  } else if (duo?.subtypeCode === 'K' || activesJoined.includes('kojic')) {
    primaryCode = duo?.subtypeCode ?? 'K';
    primaryLabel = `${pctMatch?.[0] ?? '3%'} KOJIC`;
    primaryLabelTh = `โคจิก ${pctMatch?.[0] ?? '3%'}`;
    primaryKind = 'kojic';
    primaryHex = '#D45779';
  } else if (duo?.subtypeCode === 'CS') {
    primaryCode = 'CS';
    primaryLabel = '3% C + 1% S';
    primaryLabelTh = 'C 3% + S 1%';
    primaryKind = 'vit-c';
    primaryHex = '#C8523B';
  } else if (duo?.subtypeCode === 'MS') {
    primaryCode = 'MS';
    primaryLabel = '8% MUD+1.5S';
    primaryLabelTh = 'เดดซี 8%+S';
    primaryKind = 'dead-sea';
    primaryHex = '#8E4924';
  } else if (activesJoined.includes('hyaluronic')) {
    primaryCode = 'HA';
    primaryLabel = '2.5% HYA';
    primaryLabelTh = 'ไฮยา 2.5%';
    primaryKind = 'botanical';
    primaryHex = '#2587BE';
  } else if (activesJoined.includes('squalane')) {
    primaryCode = 'SQ';
    primaryLabel = '4% B3·SQ';
    primaryLabelTh = 'สควาเลน 4%';
    primaryKind = 'botanical';
    primaryHex = '#5E7C8C';
  } else if (activesJoined.includes('vitamin c') || soap.packagingMarkers.includes('vit-cead')) {
    primaryCode = 'C';
    primaryLabel = `${pctMatch?.[0] ?? '5%'} VIT C`;
    primaryLabelTh = `วิตซี ${pctMatch?.[0] ?? '5%'}`;
    primaryKind = 'vit-c';
    primaryHex = '#D97B29';
  } else if (soap.line === 'dark') {
    primaryCode = 'Mg';
    primaryLabel = '4% CACAO';
    primaryLabelTh = 'โกโก้ 4%';
    primaryKind = 'botanical';
    primaryHex = '#6F3C1E';
  } else {
    primaryCode = 'B5';
    primaryLabel = '4% ACTIVES';
    primaryLabelTh = 'พฤกษา 4%';
    primaryKind = 'botanical';
    primaryHex = '#B5823B';
  }

  const isRoseGold = soap.edibleGoldLeaf === 'rose-gold' || soap.line === 'dark';

  return [
    {
      position: 'left',
      code: duo?.engStampCode ?? `GB·${primaryCode}`,
      shortLabel: primaryLabel,
      shortLabelTh: primaryLabelTh,
      kind: primaryKind,
      accentHex: primaryHex,
    },
    {
      position: 'right',
      code: '24K',
      shortLabel: isRoseGold ? '24K ROSE AU' : '24K GOLD AU',
      shortLabelTh: isRoseGold ? 'โรสโกลด์ 24K' : 'ทองแท้ 24K',
      kind: 'gold-leaf',
      accentHex: isRoseGold ? '#C4715E' : '#C89620',
    },
    {
      position: 'right',
      code: '3D',
      shortLabel: '3D GROOVES',
      shortLabelTh: 'ร่องสลัก 3D',
      kind: 'souvenir',
      accentHex: soap.botanicalLayers.crystalColorHex || '#B5823B',
    },
  ];
}

export function getBombSideBadges(bomb: BathBombCreation): SoapSideBadgeSpec[] {
  const isRoseGold = bomb.edibleGoldLeaf === 'rose-gold';
  const focusMap: Record<
    BathBombCreation['nutrientFocus'],
    { code: string; en: string; th: string; hex: string; kind: SoapSideBadgeSpec['kind'] }
  > = {
    'wine-vitamins': { code: 'C+', en: '5% VIT C·SALT', th: 'วิตซี 5%·เกลือแร่', hex: '#A83246', kind: 'vit-c' },
    'milk-peptides': { code: 'B3', en: '4% B3·SALT', th: 'B3 4%·เกลือแร่', hex: '#B5823B', kind: 'botanical' },
    'marine-tea': { code: 'KELP', en: '12% SEA SALT', th: 'เกลือทะเล 12%', hex: '#2587BE', kind: 'dead-sea' },
    'roots-salts': { code: 'Mg', en: '15% EPSOM·Zn', th: 'เอปซัม 15%', hex: '#6F5846', kind: 'botanical' },
  };
  const primary = focusMap[bomb.nutrientFocus];

  return [
    {
      position: 'left',
      code: `GB·${primary.code}`,
      shortLabel: primary.en,
      shortLabelTh: primary.th,
      kind: primary.kind,
      accentHex: primary.hex,
    },
    {
      position: 'right',
      code: '24K',
      shortLabel: isRoseGold ? '24K ROSE AU' : '24K GOLD AU',
      shortLabelTh: isRoseGold ? 'โรสโกลด์ 24K' : 'ทองแท้ 24K',
      kind: 'gold-leaf',
      accentHex: isRoseGold ? '#C4715E' : '#C89620',
    },
    {
      position: 'right',
      code: '✦',
      shortLabel: 'SALT CRYSTALS',
      shortLabelTh: 'เกลือคริสตัลใส',
      kind: 'souvenir',
      accentHex: bomb.waterHueHex || '#8D7B68',
    },
  ];
}

export function getVaultPairSideBadges(pair: VaultPairedFormulation): SoapSideBadgeSpec[] {
  const isPinkGold = pair.goldLeafTone === 'pink-gold';
  const stampSnippet = pair.shortBarStamp.replace(/^GB[-·]?/i, '').slice(0, 4) || 'AR';
  const pct =
    pair.categoryId === 'exfoliating-clarifying'
      ? '2% BHA'
      : pair.categoryId === 'brightening-even-tone'
        ? '5% VIT C'
        : pair.categoryId === 'deep-hydration'
          ? '4% B5·HA'
          : pair.categoryId === 'barrier-repair'
            ? '5% CICA'
            : '3.5% PEPTIDE';

  return [
    {
      position: 'left',
      code: `GB·${stampSnippet}`,
      shortLabel: pct,
      shortLabelTh: pct,
      kind: pair.categoryId === 'exfoliating-clarifying' ? 'salicylic' : 'monogram',
      accentHex: pair.soapTopHex || '#8C6239',
    },
    {
      position: 'right',
      code: '24K',
      shortLabel: isPinkGold ? '24K ROSE AU' : '24K GOLD AU',
      shortLabelTh: isPinkGold ? 'โรสโกลด์ 24K' : 'ทองแท้ 24K',
      kind: 'gold-leaf',
      accentHex: isPinkGold ? '#C4715E' : '#C89620',
    },
    {
      position: 'right',
      code: '3D',
      shortLabel: '3D GROOVES',
      shortLabelTh: 'ร่องสลัก 3D',
      kind: 'souvenir',
      accentHex: '#B5823B',
    },
  ];
}

