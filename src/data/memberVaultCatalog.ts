// Members-Only Percentage Skincare Paired Catalog (30 Formulations · 60 SKUs · 5 Categories · 30 Brands)
// Verbatim from Percentage Skincare Bar Soaps & Bath Bombs Catalog + 3 Victorian-Grooved Marble Coffrets (3 of each)

import vaultMarbleWhiteImg from '../assets/images/vault_marble_white_1795001812172.jpg';
import vaultMarbleDarkImg from '../assets/images/vault_marble_dark_1795001812568.jpg';
import vaultMarbleCheckeredImg from '../assets/images/vault_marble_checkered_1795001814126.jpg';

import vaultPairExfoliatingTealImg from '../assets/images/vault_pair_exfoliating_teal_1795001815549.jpg';
import vaultPairExfoliatingAmberImg from '../assets/images/vault_pair_exfoliating_amber_1795001815542.jpg';
import vaultPairExfoliatingCharcoalImg from '../assets/images/vault_pair_exfoliating_charcoal_1795001816068.jpg';
import vaultPairExfoliatingMatchaImg from '../assets/images/vault_pair_exfoliating_matcha_1795001836383.jpg';
import vaultPairExfoliatingRosewoodImg from '../assets/images/vault_pair_exfoliating_rosewood_1795001837100.jpg';
import vaultPairBrighteningLumenImg from '../assets/images/vault_pair_brightening_lumen_1795001838000.jpg';
import vaultPairBrighteningCitrusImg from '../assets/images/vault_pair_brightening_citrus_1795001838451.jpg';
import vaultPairBrighteningTranexImg from '../assets/images/vault_pair_brightening_tranex_1795001839521.jpg';
import vaultPairHydrationHyalunaImg from '../assets/images/vault_pair_hydration_hyaluna_1795001840264.jpg';
import vaultPairHydrationKariteImg from '../assets/images/vault_pair_hydration_karite_1795001854647.jpg';
import vaultPairHydrationNattodewImg from '../assets/images/vault_pair_hydration_nattodew_1795001855630.jpg';
import vaultPairBarrierCeramoriImg from '../assets/images/vault_pair_barrier_ceramori_1795001856191.jpg';
import vaultPairBarrierPantheImg from '../assets/images/vault_pair_barrier_panthe_1795001857288.jpg';
import vaultPairFirmingBabchiImg from '../assets/images/vault_pair_firming_babchi_1795001857968.jpg';
import vaultPairFirmingCuprumImg from '../assets/images/vault_pair_firming_cuprum_1795001857902.jpg';

export type VaultBenefitCategoryId =
  | 'exfoliating-clarifying'
  | 'brightening-even-tone'
  | 'deep-hydration'
  | 'barrier-repair'
  | 'firming-recovery';

export type VictorianGrooveStyle =
  | 'fluted-crest'
  | 'botanical-scroll'
  | 'crown-filigree'
  | 'lattice-cameo'
  | 'imperial-ribbed';

export interface VaultCategoryMeta {
  id: VaultBenefitCategoryId;
  labelEn: string;
  labelTh: string;
  victorianStyle: VictorianGrooveStyle;
  accentToneHex: string;
}

export const VAULT_CATEGORIES: VaultCategoryMeta[] = [
  {
    id: 'exfoliating-clarifying',
    labelEn: 'Exfoliating & Clarifying',
    labelTh: 'ผลัดผิวและทำความสะอาดรูขุมขน',
    victorianStyle: 'fluted-crest',
    accentToneHex: '#8E6B56',
  },
  {
    id: 'brightening-even-tone',
    labelEn: 'Brightening & Even Tone',
    labelTh: 'ผิวกระจ่างใสและปรับสีผิวสม่ำเสมอ',
    victorianStyle: 'crown-filigree',
    accentToneHex: '#C7963A',
  },
  {
    id: 'deep-hydration',
    labelEn: 'Deep Hydration & Moisture Lock',
    labelTh: 'เติมความชุ่มชื้นลึกและล็อกน้ำในผิว',
    victorianStyle: 'botanical-scroll',
    accentToneHex: '#5D8AA0',
  },
  {
    id: 'barrier-repair',
    labelEn: 'Barrier Repair & Soothing',
    labelTh: 'ฟื้นฟูเกราะผิวและปลอบประโลม',
    victorianStyle: 'lattice-cameo',
    accentToneHex: '#7A9A78',
  },
  {
    id: 'firming-recovery',
    labelEn: 'Firming, Energizing & Recovery',
    labelTh: 'กระชับผิวและฟื้นพลังความสดชื่น',
    victorianStyle: 'imperial-ribbed',
    accentToneHex: '#A6636C',
  },
];

export interface VaultPairedFormulation {
  itemNumber: number;
  id: string;
  categoryId: VaultBenefitCategoryId;
  categoryLabel: string;
  brandName: string;
  activeFormula: string;
  soapName: string;
  shortBarStamp: string;
  bombName: string;
  shortBombStamp: string;
  victorianStyle: VictorianGrooveStyle;
  imageUrl: string;
  soapTopHex: string;
  soapBottomHex: string;
  bombCoreHex: string;
  bombRimHex: string;
  barPriceThb: number;
  bombPriceThb: number;
  pairedDuoPriceThb: number;
}

export interface VaultMarbleBoxEdition {
  id: string;
  stoneType: 'bright-marble' | 'dark-marble' | 'checkered-occasions';
  victorianGroove: VictorianGrooveStyle;
  titleEn: string;
  titleTh: string;
  themeLabelEn: string;
  themeLabelTh: string;
  descEn: string;
  descTh: string;
  grooveDetailEn: string;
  grooveDetailTh: string;
  imageUrl: string;
  priceThb: number;
  compareAtThb: number;
  includedPairIds: [string, string, string];
}

export const VAULT_PRICING = {
  barThb: 950,
  bombThb: 750,
  pairedDuoThb: 1550,
};

interface VaultSeed {
  itemNumber: number;
  categoryId: VaultBenefitCategoryId;
  categoryLabel: string;
  brandName: string;
  activeFormula: string;
  soapName: string;
  shortBarStamp: string;
  bombName: string;
  shortBombStamp: string;
  soapTopHex: string;
  soapBottomHex: string;
  bombCoreHex: string;
  bombRimHex: string;
}

const STYLE_BY_CATEGORY: Record<VaultBenefitCategoryId, VictorianGrooveStyle> = {
  'exfoliating-clarifying': 'fluted-crest',
  'brightening-even-tone': 'crown-filigree',
  'deep-hydration': 'botanical-scroll',
  'barrier-repair': 'lattice-cameo',
  'firming-recovery': 'imperial-ribbed',
};

const RAW_VAULT_SEEDS: VaultSeed[] = [
  {
    itemNumber: 1,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Aetheris Lab',
    activeFormula: 'Salicylic Acid 2% + Zinc PCA 1%',
    soapName: 'Aetheris Lab Salicylic Acid 2% + Zinc PCA 1% Detox Bar',
    shortBarStamp: 'AETHERIS BHA 2%',
    bombName: 'Aetheris Lab Salicylic Acid 2% + Zinc PCA 1% Pore Soak Bomb',
    shortBombStamp: 'AETHERIS 2%',
    soapTopHex: '#3B4248',
    soapBottomHex: '#D8CFC2',
    bombCoreHex: '#505B63',
    bombRimHex: '#E9E0D3',
  },
  {
    itemNumber: 2,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Vespera Derm',
    activeFormula: 'Glycolic Acid 5% + Willow Bark 2%',
    soapName: 'Vespera Derm Glycolic Acid 5% + Willow Bark 2% Micro-Peel Bar',
    shortBarStamp: 'VESPERA AHA 5%',
    bombName: 'Vespera Derm Glycolic Acid 5% + Willow Bark 2% Smoothing Bomb',
    shortBombStamp: 'VESPERA 5%',
    soapTopHex: '#634A5A',
    soapBottomHex: '#EDE0D8',
    bombCoreHex: '#7A5B6E',
    bombRimHex: '#F3EAE2',
  },
  {
    itemNumber: 3,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Oat & Ore',
    activeFormula: 'Lactic Acid 5% + Colloidal Oatmeal 2%',
    soapName: 'Oat & Ore Lactic Acid 5% + Colloidal Oatmeal 2% Creamy Bar',
    shortBarStamp: 'OAT&ORE LA 5%',
    bombName: 'Oat & Ore Lactic Acid 5% + Colloidal Oatmeal 2% Milky Bomb',
    shortBombStamp: 'OAT&ORE 5%',
    soapTopHex: '#C5AC8C',
    soapBottomHex: '#F7EFE3',
    bombCoreHex: '#D7C1A3',
    bombRimHex: '#FAF4EA',
  },
  {
    itemNumber: 4,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Sylphide Botanics',
    activeFormula: 'Mandelic Acid 5% + Green Tea 1%',
    soapName: 'Sylphide Botanics Mandelic Acid 5% + Green Tea 1% Polish Bar',
    shortBarStamp: 'SYLPHIDE MA 5%',
    bombName: 'Sylphide Botanics Mandelic Acid 5% + Green Tea 1% Renewal Bomb',
    shortBombStamp: 'SYLPHIDE 5%',
    soapTopHex: '#5E7C64',
    soapBottomHex: '#EAE7D9',
    bombCoreHex: '#75967B',
    bombRimHex: '#F1EFE4',
  },
  {
    itemNumber: 5,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Nymphaea Pure',
    activeFormula: 'Gluconolactone (PHA) 4% + Panthenol 2%',
    soapName: 'Nymphaea Pure Gluconolactone 4% + Panthenol 2% Exfoliant Bar',
    shortBarStamp: 'NYMPHAEA PHA 4%',
    bombName: 'Nymphaea Pure Gluconolactone 4% + Panthenol 2% Barrier Bomb',
    shortBombStamp: 'NYMPHAEA 4%',
    soapTopHex: '#C69EA5',
    soapBottomHex: '#F9F1ED',
    bombCoreHex: '#D6B1B7',
    bombRimHex: '#FCF6F3',
  },
  {
    itemNumber: 6,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'KeraFlux',
    activeFormula: 'AHA 7% + BHA 1%',
    soapName: 'KeraFlux AHA 7% + BHA 1% Back & Body Resurfacing Bar',
    shortBarStamp: 'KERAFLUX 7+1%',
    bombName: 'KeraFlux AHA 7% + BHA 1% Full-Body Renewal Bomb',
    shortBombStamp: 'KERAFLUX 8%',
    soapTopHex: '#7B4C49',
    soapBottomHex: '#E8D5C7',
    bombCoreHex: '#925D59',
    bombRimHex: '#EFE1D6',
  },
  {
    itemNumber: 7,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Brimstone & Leaf',
    activeFormula: 'Sulfur 3% + Tea Tree Oil 1%',
    soapName: 'Brimstone & Leaf Sulfur 3% + Tea Tree Oil 1% Purifying Bar',
    shortBarStamp: 'BRIMSTONE S3%',
    bombName: 'Brimstone & Leaf Sulfur 3% + Tea Tree Oil 1% Clarifying Bomb',
    shortBombStamp: 'BRIMSTONE 3%',
    soapTopHex: '#B69C4B',
    soapBottomHex: '#EAE5D2',
    bombCoreHex: '#C8AF5D',
    bombRimHex: '#F3EFE0',
  },
  {
    itemNumber: 8,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Obsidian Apothecary',
    activeFormula: 'Activated Charcoal 5% + Kaolin Clay 10%',
    soapName: 'Obsidian Apothecary Charcoal 5% + Kaolin 10% Pore-Drawing Bar',
    shortBarStamp: 'OBSIDIAN C5%',
    bombName: 'Obsidian Apothecary Charcoal 5% + Kaolin 10% Black Detox Bomb',
    shortBombStamp: 'OBSIDIAN 5%',
    soapTopHex: '#2C2A2E',
    soapBottomHex: '#BEB6AC',
    bombCoreHex: '#3B383E',
    bombRimHex: '#D8D1C7',
  },
  {
    itemNumber: 9,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'TerraVibe Clinical',
    activeFormula: 'Bentonite Clay 10% + Apple Cider Vinegar 2%',
    soapName: 'TerraVibe Clinical Bentonite 10% + ACV 2% Oil-Control Bar',
    shortBarStamp: 'TERRAVIBE 10%',
    bombName: 'TerraVibe Clinical Bentonite 10% + ACV 2% pH-Balance Bomb',
    shortBombStamp: 'TERRAVIBE 10%',
    soapTopHex: '#846D58',
    soapBottomHex: '#E5DBD0',
    bombCoreHex: '#9C826A',
    bombRimHex: '#EEE6DC',
  },
  {
    itemNumber: 10,
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Azelia Mist',
    activeFormula: 'Azelaic Acid 5% + Licorice Root 1%',
    soapName: 'Azelia Mist Azelaic Acid 5% + Licorice Root 1% Soothing Bar',
    shortBarStamp: 'AZELIA AZ 5%',
    bombName: 'Azelia Mist Azelaic Acid 5% + Licorice Root 1% Calming Bomb',
    shortBombStamp: 'AZELIA 5%',
    soapTopHex: '#8A9A8B',
    soapBottomHex: '#F3EFE6',
    bombCoreHex: '#A0B1A1',
    bombRimHex: '#F9F6F0',
  },
  {
    itemNumber: 11,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Lumeniscent',
    activeFormula: 'Niacinamide 5% + Zinc 1%',
    soapName: 'Lumeniscent Niacinamide 5% + Zinc 1% Brightening Cleansing Bar',
    shortBarStamp: 'LUMEN B3 5%',
    bombName: 'Lumeniscent Niacinamide 5% + Zinc 1% Radiance Soak Bomb',
    shortBombStamp: 'LUMEN 5%',
    soapTopHex: '#D8B979',
    soapBottomHex: '#FBF6EB',
    bombCoreHex: '#E5CA90',
    bombRimHex: '#FFFBF2',
  },
  {
    itemNumber: 12,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Solaia C',
    activeFormula: 'Ascorbyl Glucoside 5% + Ferulic Acid 0.5%',
    soapName: 'Solaia C Ascorbyl Glucoside 5% + Ferulic Acid 0.5% Antioxidant Bar',
    shortBarStamp: 'SOLAIA VITC 5%',
    bombName: 'Solaia C Ascorbyl Glucoside 5% + Ferulic Acid 0.5% Glow Bomb',
    shortBombStamp: 'SOLAIA C5%',
    soapTopHex: '#DB9258',
    soapBottomHex: '#FAF0E1',
    bombCoreHex: '#E7A670',
    bombRimHex: '#FDF5EB',
  },
  {
    itemNumber: 13,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Arbutelle',
    activeFormula: 'Alpha Arbutin 2% + Niacinamide 3%',
    soapName: 'Arbutelle Alpha Arbutin 2% + Niacinamide 3% Even-Tone Bar',
    shortBarStamp: 'ARBUTELLE AA2%',
    bombName: 'Arbutelle Alpha Arbutin 2% + Niacinamide 3% Luminosity Bomb',
    shortBombStamp: 'ARBUTELLE 2%',
    soapTopHex: '#D7A39E',
    soapBottomHex: '#F9F2EE',
    bombCoreHex: '#E4B7B2',
    bombRimHex: '#FCF7F5',
  },
  {
    itemNumber: 14,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Curcuma Alchemy',
    activeFormula: 'Kojic Acid 1% + Turmeric Extract 2%',
    soapName: 'Curcuma Alchemy Kojic Acid 1% + Turmeric 2% Brightening Bar',
    shortBarStamp: 'CURCUMA KA 1%',
    bombName: 'Curcuma Alchemy Kojic Acid 1% + Turmeric 2% Golden Glow Bomb',
    shortBombStamp: 'CURCUMA 1%',
    soapTopHex: '#C68B3A',
    soapBottomHex: '#F5E8CE',
    bombCoreHex: '#D7A052',
    bombRimHex: '#FAF0DC',
  },
  {
    itemNumber: 15,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Tranexis',
    activeFormula: 'Tranexamic Acid 2% + Vitamin B5 1%',
    soapName: 'Tranexis Tranexamic Acid 2% + Vitamin B5 1% Tone-Correcting Bar',
    shortBarStamp: 'TRANEXIS TX 2%',
    bombName: 'Tranexis Tranexamic Acid 2% + Vitamin B5 1% Clarifying Bomb',
    shortBombStamp: 'TRANEXIS 2%',
    soapTopHex: '#A88FA8',
    soapBottomHex: '#F5EFF5',
    bombCoreHex: '#BCA5BC',
    bombRimHex: '#FAF5FA',
  },
  {
    itemNumber: 16,
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Carica Zest',
    activeFormula: 'Papain Enzyme 3% + Vitamin E 1%',
    soapName: 'Carica Zest Papain 3% + Vitamin E 1% Gentle Enzyme Polish Bar',
    shortBarStamp: 'CARICA PAP 3%',
    bombName: 'Carica Zest Papain 3% + Vitamin E 1% Tropical Radiance Bomb',
    shortBombStamp: 'CARICA 3%',
    soapTopHex: '#DD956B',
    soapBottomHex: '#FBF1E6',
    bombCoreHex: '#E9AA84',
    bombRimHex: '#FDF7EF',
  },
  {
    itemNumber: 17,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Hyaluna',
    activeFormula: 'Hyaluronic Acid 1% + Glycerin 10%',
    soapName: 'Hyaluna Hyaluronic Acid 1% + Glycerin 10% Hydro-Lock Bar',
    shortBarStamp: 'HYALUNA HA 1%',
    bombName: 'Hyaluna Hyaluronic Acid 1% + Glycerin 10% Plumping Soak Bomb',
    shortBombStamp: 'HYALUNA 1%',
    soapTopHex: '#73A6BD',
    soapBottomHex: '#EEF6FA',
    bombCoreHex: '#8BBBD0',
    bombRimHex: '#F5FAFC',
  },
  {
    itemNumber: 18,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Karité Velours',
    activeFormula: 'Shea Butter 15% + Squalane 3%',
    soapName: 'Karité Velours Shea Butter 15% + Squalane 3% Ultra-Creamy Bar',
    shortBarStamp: 'KARITE SB 15%',
    bombName: 'Karité Velours Shea Butter 15% + Squalane 3% Velvet Bomb',
    shortBombStamp: 'KARITE 15%',
    soapTopHex: '#CDB491',
    soapBottomHex: '#FAF3E7',
    bombCoreHex: '#DAC4A5',
    bombRimHex: '#FCF8F0',
  },
  {
    itemNumber: 19,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'UreDermis',
    activeFormula: 'Urea 5% + Lactic Acid 2%',
    soapName: 'UreDermis Urea 5% + Lactic Acid 2% Keratin-Softening Bar',
    shortBarStamp: 'UREDERMIS U5%',
    bombName: 'UreDermis Urea 5% + Lactic Acid 2% Intensive Softening Bomb',
    shortBombStamp: 'UREDERMIS 5%',
    soapTopHex: '#8C9CAE',
    soapBottomHex: '#F1F4F7',
    bombCoreHex: '#A1B0C1',
    bombRimHex: '#F7F9FB',
  },
  {
    itemNumber: 20,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'NattoDew',
    activeFormula: 'Polyglutamic Acid 0.5% + Aloe Vera 5%',
    soapName: 'NattoDew Polyglutamic Acid 0.5% + Aloe Vera 5% Moisture Bar',
    shortBarStamp: 'NATTODEW 0.5%',
    bombName: 'NattoDew Polyglutamic Acid 0.5% + Aloe Vera 5% Hydro-Gel Bomb',
    shortBombStamp: 'NATTODEW .5%',
    soapTopHex: '#79AD94',
    soapBottomHex: '#EDF6F1',
    bombCoreHex: '#92C0AA',
    bombRimHex: '#F5FAF7',
  },
  {
    itemNumber: 21,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Amandine Silk',
    activeFormula: 'Sweet Almond Oil 10% + Vitamin E 2%',
    soapName: 'Amandine Silk Sweet Almond Oil 10% + Vitamin E 2% Conditioning Bar',
    shortBarStamp: 'AMANDINE 10%',
    bombName: 'Amandine Silk Sweet Almond Oil 10% + Vitamin E 2% Oil-Infused Bomb',
    shortBombStamp: 'AMANDINE 10%',
    soapTopHex: '#D1A988',
    soapBottomHex: '#FBF2E9',
    bombCoreHex: '#DEBCA0',
    bombRimHex: '#FDF7F1',
  },
  {
    itemNumber: 22,
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Tremella Cloud',
    activeFormula: 'Snow Mushroom 2% + Betaine 3%',
    soapName: 'Tremella Cloud Snow Mushroom 2% + Betaine 3% Cushioning Bar',
    shortBarStamp: 'TREMELLA 2%',
    bombName: 'Tremella Cloud Snow Mushroom 2% + Betaine 3% Dew-Drop Bomb',
    shortBombStamp: 'TREMELLA 2%',
    soapTopHex: '#C2CDD8',
    soapBottomHex: '#F8FAFC',
    bombCoreHex: '#D3DCE6',
    bombRimHex: '#FFFFFF',
  },
  {
    itemNumber: 23,
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'Ceramori',
    activeFormula: 'Ceramide Complex 1% + Cholesterol 0.5%',
    soapName: 'Ceramori Ceramide Complex 1% + Cholesterol 0.5% Lipid Bar',
    shortBarStamp: 'CERAMORI 1%',
    bombName: 'Ceramori Ceramide Complex 1% + Cholesterol 0.5% Barrier Bomb',
    shortBombStamp: 'CERAMORI 1%',
    soapTopHex: '#B69A87',
    soapBottomHex: '#F7F0EA',
    bombCoreHex: '#C7AE9D',
    bombRimHex: '#FCF7F3',
  },
  {
    itemNumber: 24,
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'CicaVeda',
    activeFormula: 'Centella Asiatica 5% + Madecassoside 0.2%',
    soapName: 'CicaVeda Centella Asiatica 5% + Madecassoside 0.2% Recovery Bar',
    shortBarStamp: 'CICAVEDA 5%',
    bombName: 'CicaVeda Centella Asiatica 5% + Madecassoside 0.2% Relief Bomb',
    shortBombStamp: 'CICAVEDA 5%',
    soapTopHex: '#688F6A',
    soapBottomHex: '#EEF4EC',
    bombCoreHex: '#7FA481',
    bombRimHex: '#F5F9F4',
  },
  {
    itemNumber: 25,
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'PantheCalm',
    activeFormula: 'Panthenol (B5) 5% + Allantoin 0.5%',
    soapName: 'PantheCalm Panthenol 5% + Allantoin 0.5% Comfort Cleansing Bar',
    shortBarStamp: 'PANTHE B5 5%',
    bombName: 'PantheCalm Panthenol 5% + Allantoin 0.5% Skin-Soothing Bomb',
    shortBombStamp: 'PANTHE 5%',
    soapTopHex: '#89A7BF',
    soapBottomHex: '#F1F6FA',
    bombCoreHex: '#9FBAD0',
    bombRimHex: '#F7FAFC',
  },
  {
    itemNumber: 26,
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'AvenaSoothe',
    activeFormula: 'Colloidal Oatmeal 5% + Bisabolol 0.5%',
    soapName: 'AvenaSoothe Colloidal Oatmeal 5% + Bisabolol 0.5% Itch-Relief Bar',
    shortBarStamp: 'AVENA OAT 5%',
    bombName: 'AvenaSoothe Colloidal Oatmeal 5% + Bisabolol 0.5% Calming Bomb',
    shortBombStamp: 'AVENA 5%',
    soapTopHex: '#C5B091',
    soapBottomHex: '#F8F2E7',
    bombCoreHex: '#D5C3A8',
    bombRimHex: '#FCF8F1',
  },
  {
    itemNumber: 27,
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'Ectoshield',
    activeFormula: 'Ectoin 1% + Beta-Glucan 1%',
    soapName: 'Ectoshield Ectoin 1% + Beta-Glucan 1% Barrier-Defense Bar',
    shortBarStamp: 'ECTOSHIELD 1%',
    bombName: 'Ectoshield Ectoin 1% + Beta-Glucan 1% Stress-Recovery Bomb',
    shortBombStamp: 'ECTO 1%',
    soapTopHex: '#8E8BA8',
    soapBottomHex: '#F2F1F7',
    bombCoreHex: '#A2A0BA',
    bombRimHex: '#F8F7FB',
  },
  {
    itemNumber: 28,
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Babchi & Briar',
    activeFormula: 'Bakuchiol 1% + Rosehip Oil 5%',
    soapName: 'Babchi & Briar Bakuchiol 1% + Rosehip Oil 5% Youth-Renewal Bar',
    shortBarStamp: 'BABCHI BAK 1%',
    bombName: 'Babchi & Briar Bakuchiol 1% + Rosehip Oil 5% Elasticity Bomb',
    shortBombStamp: 'BABCHI 1%',
    soapTopHex: '#9A6378',
    soapBottomHex: '#F5E9EE',
    bombCoreHex: '#B0798E',
    bombRimHex: '#FAF3F6',
  },
  {
    itemNumber: 29,
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Cuprum Peptide',
    activeFormula: 'Copper Tripeptide-1 0.5% + Niacinamide 2%',
    soapName: 'Cuprum Peptide Copper Tripeptide-1 0.5% + Niacinamide 2% Firming Bar',
    shortBarStamp: 'CUPRUM .5%',
    bombName: 'Cuprum Peptide Copper Tripeptide-1 0.5% + Niacinamide 2% Tonic Bomb',
    shortBombStamp: 'CUPRUM .5%',
    soapTopHex: '#4F859B',
    soapBottomHex: '#E9F3F7',
    bombCoreHex: '#669CB2',
    bombRimHex: '#F3F9FB',
  },
  {
    itemNumber: 30,
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Kinetix Salt',
    activeFormula: 'Caffeine 2% + Magnesium Sulfate 15%',
    soapName: 'Kinetix Salt Caffeine 2% + Magnesium Sulfate 15% Scrub Bar',
    shortBarStamp: 'KINETIX CAF2%',
    bombName: 'Kinetix Salt Caffeine 2% + Magnesium Sulfate 15% Recovery Bomb',
    shortBombStamp: 'KINETIX 2%',
    soapTopHex: '#624B3E',
    soapBottomHex: '#E8DDD4',
    bombCoreHex: '#7A6052',
    bombRimHex: '#F2EAE3',
  },
];

const VAULT_IMAGE_BY_NUMBER: Record<number, string> = {
  1: vaultPairExfoliatingTealImg,
  2: vaultPairExfoliatingAmberImg,
  3: vaultPairExfoliatingAmberImg,
  4: vaultPairExfoliatingMatchaImg,
  5: vaultPairExfoliatingTealImg,
  6: vaultPairExfoliatingRosewoodImg,
  7: vaultPairExfoliatingMatchaImg,
  8: vaultPairExfoliatingCharcoalImg,
  9: vaultPairExfoliatingRosewoodImg,
  10: vaultPairBrighteningTranexImg,
  11: vaultPairBrighteningLumenImg,
  12: vaultPairBrighteningCitrusImg,
  13: vaultPairBrighteningLumenImg,
  14: vaultPairBrighteningCitrusImg,
  15: vaultPairBrighteningTranexImg,
  16: vaultPairBrighteningCitrusImg,
  17: vaultPairHydrationHyalunaImg,
  18: vaultPairHydrationKariteImg,
  19: vaultPairHydrationHyalunaImg,
  20: vaultPairHydrationNattodewImg,
  21: vaultPairHydrationKariteImg,
  22: vaultPairHydrationHyalunaImg,
  23: vaultPairBarrierCeramoriImg,
  24: vaultPairHydrationNattodewImg,
  25: vaultPairBarrierPantheImg,
  26: vaultPairBarrierCeramoriImg,
  27: vaultPairBarrierPantheImg,
  28: vaultPairFirmingBabchiImg,
  29: vaultPairFirmingCuprumImg,
  30: vaultPairExfoliatingCharcoalImg,
};

export const VAULT_PAIRED_FORMULATIONS: VaultPairedFormulation[] = RAW_VAULT_SEEDS.map((seed) => ({
  ...seed,
  id: `vault-${String(seed.itemNumber).padStart(2, '0')}`,
  victorianStyle: STYLE_BY_CATEGORY[seed.categoryId],
  imageUrl: VAULT_IMAGE_BY_NUMBER[seed.itemNumber] ?? vaultPairExfoliatingTealImg,
  barPriceThb: VAULT_PRICING.barThb,
  bombPriceThb: VAULT_PRICING.bombThb,
  pairedDuoPriceThb: VAULT_PRICING.pairedDuoThb,
}));

export const VAULT_PAIR_BY_ID = new Map<string, VaultPairedFormulation>(
  VAULT_PAIRED_FORMULATIONS.map((item) => [item.id, item]),
);

// 3 Special Victorian-Grooved Marble Coffrets — Each holding 3 of each (3 Engraved Bars + 3 Matching Bombs + 2 Loofahs)
export const VAULT_MARBLE_BOXES: VaultMarbleBoxEdition[] = [
  {
    id: 'vault-marble-calacatta',
    stoneType: 'bright-marble',
    victorianGroove: 'fluted-crest',
    titleEn: 'Porcelain Calacatta Victorian Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนขาววิกตอเรียนคาลากัตตา · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'BRIGHT RADIANCE & HYDRATION · 3 OF EACH',
    themeLabelTh: 'ผิวกระจ่างใสและชุ่มชื้น · อย่างละ 3 ชิ้น',
    descEn:
      'Hand-carved white Calacatta marble chest featuring deep Victorian fluted grooves along all four walls—housing 3 engraved bars, 3 grooved bath spheres, and 2 natural loofahs.',
    descTh:
      'กล่องหินอ่อนขาวคาลากัตตาแกะร่องเสาวิกตอเรียนรอบขอบกล่องทั้ง 4 ด้าน บรรจุสบู่ก้อนสลักตรา 3 ก้อน + บาธบอมบ์ 3 ลูก + บวบขัดผิว 2 ชิ้น',
    grooveDetailEn: 'Fluted Crest & Botanical Cameo Marble Relief',
    grooveDetailTh: 'ร่องเสาวิกตอเรียนและลายนูนพฤกษศาสตร์รอบกล่อง',
    imageUrl: vaultMarbleWhiteImg,
    priceThb: 4850,
    compareAtThb: 5650,
    includedPairIds: ['vault-11', 'vault-17', 'vault-23'],
  },
  {
    id: 'vault-marble-obsidian',
    stoneType: 'dark-marble',
    victorianGroove: 'imperial-ribbed',
    titleEn: 'Obsidian Nero Victorian Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนดำเนโรวิกตอเรียน · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CLARIFYING & RECOVERY · 3 OF EACH',
    themeLabelTh: 'ดีท็อกซ์รูขุมขนและฟื้นบำรุง · อย่างละ 3 ชิ้น',
    descEn:
      'Architectural Nero Marquina black marble chest carved with deep Victorian ribbed fluting and floral scrollwork—housing 3 charcoal-active bars, 3 spheres, and 2 hemp loofahs.',
    descTh:
      'กล่องหินอ่อนดำเนโรแกะร่องเสาวิกตอเรียนและลวดลายเถาไม้รอบกล่อง บรรจุสบู่สลักตรา 3 ก้อน + บาธบอมบ์ 3 ลูก + บวบถ่านไม้ไผ่ 2 ชิ้น',
    grooveDetailEn: 'Imperial Ribbed & Charcoal Scrollwork Marble Carving',
    grooveDetailTh: 'ร่องริ้วจักรพรรดิและลายแกะสลักหินอ่อนดำ',
    imageUrl: vaultMarbleDarkImg,
    priceThb: 4950,
    compareAtThb: 5750,
    includedPairIds: ['vault-01', 'vault-08', 'vault-30'],
  },
  {
    id: 'vault-marble-checkered',
    stoneType: 'checkered-occasions',
    victorianGroove: 'lattice-cameo',
    titleEn: 'Checkered Plum & Rose Victorian Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนลายหมากรุกวิกตอเรียน · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'BARRIER SILK & FIRM GLOW · 3 OF EACH',
    themeLabelTh: 'เกราะผิวเนียนและกระชับโกลว์ · อย่างละ 3 ชิ้น',
    descEn:
      'Inlaid cream-and-plum checkered marble chest bordered with Victorian lattice and crown cameo reliefs—carrying 3 matching bars, 3 mineral spheres, and 2 silk honeycomb loofahs.',
    descTh:
      'กล่องหินอ่อนสลับลายหมากรุกครีม-พลัมแกะร่องตารางและมงกุฎวิกตอเรียน บรรจุสบู่ 3 ก้อน + บาธบอมบ์ 3 ลูก + บวบรวงผึ้ง 2 ชิ้น',
    grooveDetailEn: 'Diamond Lattice & Royal Crown Marble Carving',
    grooveDetailTh: 'ร่องตารางเพชรและมงกุฎวิกตอเรียนสลักมือ',
    imageUrl: vaultMarbleCheckeredImg,
    priceThb: 5100,
    compareAtThb: 5900,
    includedPairIds: ['vault-15', 'vault-18', 'vault-28'],
  },
];

