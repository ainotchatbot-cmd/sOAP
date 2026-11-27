// Art Era Paired Atelier Catalog (30 Bespoke Formulations · 5 Art Eras · 5 Roman-Grooved Marble Coffrets)
// Evenly balanced at 6 Creations per Era (2 Bright + 2 Dark + 2 Events), uniting 50/50 half-transparent Bar Soap + Mineral Salt Crystal Bath Bomb,
// 24K Pink or Yellow Gold Leaf, GentleBubble engraving & signature 3D grooves across every creation.

import { type EngravingGrooveKind, GROOVE_SPECS } from './engravingSpecs';

import sculptMed01Img from '../assets/images/sculpt_med_01_aetheris_1795341658440.jpg';
import sculptMed02Img from '../assets/images/sculpt_med_02_vespera_1795341658728.jpg';
import sculptMed03Img from '../assets/images/sculpt_med_03_oat_ore_1795341658963.jpg';
import sculptMed04Img from '../assets/images/sculpt_med_04_sylphide_b_1795341674367.jpg';
import sculptMed05Img from '../assets/images/sculpt_med_05_nymphaea_1795341658516.jpg';
import sculptMed06Img from '../assets/images/sculpt_med_06_keraflux_1795341659114.jpg';

import sculptRen07Img from '../assets/images/sculpt_ren_07_brimstone_1795341659603.jpg';
import sculptRen08Img from '../assets/images/sculpt_ren_08_obsidian_1795341658617.jpg';
import sculptRen09Img from '../assets/images/sculpt_ren_09_terravibe_1795341658489.jpg';
import sculptRen10Img from '../assets/images/sculpt_ren_10_azelia_1795341659014.jpg';
import sculptRen11Img from '../assets/images/sculpt_ren_11_lumeniscent_1795341659163.jpg';
import sculptRen12Img from '../assets/images/sculpt_ren_12_solaia_1795341674926.jpg';

import sculptBar13Img from '../assets/images/sculpt_bar_13_arbutelle_1795341741186.jpg';
import sculptBar14Img from '../assets/images/sculpt_bar_14_curcuma_1795341741781.jpg';
import sculptBar15Img from '../assets/images/sculpt_bar_15_tranexis_1795341740718.jpg';
import sculptBar16Img from '../assets/images/sculpt_bar_16_carica_1795341740786.jpg';
import sculptBar17Img from '../assets/images/sculpt_bar_17_hyaluna_1795341741615.jpg';
import sculptBar18Img from '../assets/images/sculpt_bar_18_karite_1795341741869.jpg';

import sculptRom19Img from '../assets/images/sculpt_rom_19_uredermis_1795341742063.jpg';
import sculptRom20Img from '../assets/images/sculpt_rom_20_nattodew_1795341741626.jpg';
import sculptRom21Img from '../assets/images/sculpt_rom_21_amandine_1795341741728.jpg';
import sculptRom22Img from '../assets/images/sculpt_rom_22_tremella_1795341741286.jpg';
import sculptRom23Img from '../assets/images/sculpt_rom_23_ceramori_1795341779179.jpg';
import sculptRom24Img from '../assets/images/sculpt_rom_24_cicaveda_1795341778971.jpg';

import sculptEnl25Img from '../assets/images/sculpt_enl_25_panthecalm_1795341779277.jpg';
import sculptEnl26Img from '../assets/images/sculpt_enl_26_avenasoothe_1795341779129.jpg';
import sculptEnl27Img from '../assets/images/sculpt_enl_27_ectoshield_1795341780071.jpg';
import sculptEnl28Img from '../assets/images/sculpt_enl_28_babchi_1795341779614.jpg';
import sculptEnl29Img from '../assets/images/sculpt_enl_29_cuprum_1795341779955.jpg';
import sculptEnl30Img from '../assets/images/sculpt_enl_30_kinetix_1795341779314.jpg';

import eraMedievalCoffretImg from '../assets/images/era_medieval_coffret_nero_1795004048727.jpg';
import eraRenaissanceCoffretImg from '../assets/images/era_renaissance_coffret_calacatta_1795004078833.jpg';
import eraBaroqueCoffretImg from '../assets/images/sculpt_coffret_baroque_noir_1795341779438.jpg';
import eraRomanticismCoffretImg from '../assets/images/sculpt_coffret_romanticism_rose_1795341779321.jpg';
import eraEnlightenmentCoffretImg from '../assets/images/era_enlightenment_coffret_checkered_1795004105039.jpg';

export type ArtEraId =
  | 'medieval'
  | 'renaissance'
  | 'baroque'
  | 'romanticism'
  | 'enlightenment';

export type VaultLineFilterId = 'dark' | 'bright' | 'holiday';

export type VaultGoldLeafTone = 'pink-gold' | 'yellow-gold';

export type VaultCrystalFinish = 'salt-crystals' | 'carved-grooves';

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

export interface ArtEraMeta {
  id: ArtEraId;
  chapterRoman: string;
  labelEn: string;
  labelTh: string;
  periodTagEn: string;
  periodTagTh: string;
  artSchoolEn: string;
  artSchoolTh: string;
  heroLine1En: string;
  heroLine1Th: string;
  heroLine2En: string;
  heroLine2Th: string;
  heroSummaryEn: string;
  heroSummaryTh: string;
  carvingDescEn: string;
  carvingDescTh: string;
  paletteNoteEn: string;
  paletteNoteTh: string;
  coffretId: string;
  spotlightImageUrl: string;
}

export const ART_ERAS: ArtEraMeta[] = [
  {
    id: 'medieval',
    chapterRoman: 'I',
    labelEn: 'Medieval',
    labelTh: 'ยุคกลาง',
    periodTagEn: 'Chapter I · Cloister Twilight & Stone Relief',
    periodTagTh: 'บทที่ I · อารามยามสนธยาและศิลาแกะสลัก',
    artSchoolEn: 'Classical Roman & Greek Stonecraft (Sculptors, Architects & Mosaicists)',
    artSchoolTh: 'สถาปัตยกรรมกรีก-โรมันและงานโมเสกศิลาโบราณ',
    heroLine1En: 'Candlelit Stone & Cloister Mist.',
    heroLine1Th: 'ศิลายามเทียนไขและหมอกอาราม',
    heroLine2En: 'Gilded in 24k Gold Leaf & 3D Grooves.',
    heroLine2Th: 'ประดับทองคำเปลว 24K และร่องแกะสลัก 3 มิติ',
    heroSummaryEn:
      'Rain-washed slate, plum velvet, roasted oat milk, and moss mist carved in Gothic arches—splitting half-clear on bar soaps with 24K gold leaf and studded in transparent mineral bath salt crystals on bath spheres.',
    heroSummaryTh:
      'กลิ่นอายฝนโปรยบนศิลา พลัมกำมะหยี่ น้ำนมข้าวโอ๊ตอบ และมอสส์อาราม สบู่ก้อนผสานครึ่งใสทองคำเปลว 24K จับคู่บาธบอมบ์ผลึกเกลือแร่ใสแกะร่อง',
    carvingDescEn: 'Gothic Quatrefoil Grooves · 24K Gold Leaf & Salt Crystals',
    carvingDescTh: 'ร่องโค้งกอธิค 3 มิติ · ทองคำเปลว 24K และผลึกเกลือแร่ใส',
    paletteNoteEn: 'Smoky Slate · Damask Plum · Abbey Sage · Terracotta Clay',
    paletteNoteTh: 'เทาศิลา · พลัมเข้ม · เขียวอาราม · ดินเผาอุ่น',
    coffretId: 'vault-marble-obsidian',
    spotlightImageUrl: sculptMed01Img,
  },
  {
    id: 'renaissance',
    chapterRoman: 'II',
    labelEn: 'Renaissance',
    labelTh: 'เรอเนซองส์',
    periodTagEn: 'Chapter II · Florentine Fresco & Sunlit Marble',
    periodTagTh: 'บทที่ II · ปูนเปียกฟลอเรนซ์และหินอ่อนต้องแสง',
    artSchoolEn: 'Italian Renaissance Masters (da Vinci, Michelangelo, Botticelli)',
    artSchoolTh: 'จิตวิญญาณเรอเนซองส์อิตาลี (ดาวินชี · มีเกลันเจโล · บอตติเชลลี)',
    heroLine1En: 'Sunlit Fresco & Saffron Silk.',
    heroLine1Th: 'ปูนเปียกต้องตะวันและแพรไหมหญ้าฝรั่น',
    heroLine2En: 'Sculpted Gold Light Sealed Inside.',
    heroLine2Th: 'เปล่งประกายทองคำ 24K และร่องแกะสลักคลาสสิก',
    heroSummaryEn:
      'Honeyed saffron, warm basalt, toasted apricot, and Tuscan herb dew framed like marble pilasters—suspended half-clear in bars and faceted in sparkling mineral salt crystals on bath spheres.',
    heroSummaryTh:
      'กลิ่นน้ำผึ้งหญ้าฝรั่น หินบะซอลต์อุ่น แอปริคอตทัสคานี และสมุนไพรยามเช้า สลักลายเสาคลาสสิกพร้อมริ้วทองคำแท้ 24K และผลึกเกลือแร่ธรรมชาติ',
    carvingDescEn: 'Florentine Column Fluting · Pink & Yellow 24K Gold Leaf',
    carvingDescTh: 'ร่องเสาฟลอเรนซ์ประดับทองโรสโกลด์และเยลโลว์โกลด์',
    paletteNoteEn: 'Sunlit Saffron · Obsidian Ink · Apricot Glow · Sage Cream',
    paletteNoteTh: 'ทองหญ้าฝรั่น · หมึกออบซิเดียน · แอปริคอต · เขียวเซจ',
    coffretId: 'vault-marble-calacatta',
    spotlightImageUrl: sculptRen11Img,
  },
  {
    id: 'baroque',
    chapterRoman: 'III',
    labelEn: 'Baroque',
    labelTh: 'บาโรก',
    periodTagEn: 'Chapter III · Gilded Chiaroscuro & Rococo Silk',
    periodTagTh: 'บทที่ III · แสงเงาอันวิจิตรและแพรพรรณโรโคโค',
    artSchoolEn: 'Dutch Golden Age & 18th-Century Rococo (Rembrandt, Vermeer, Fragonard, Boucher)',
    artSchoolTh: 'ยุคทองดัตช์และโรโคโคฝรั่งเศส (แรมบรันดต์ · แฟร์เมร์ · ฟรากอนาร์ด · บูเชร์)',
    heroLine1En: 'Velvet Shadows & Gilded Blush.',
    heroLine1Th: 'เงากำมะหยี่และกลีบกุหลาบเคลือบทอง',
    heroLine2En: 'Ruffled in Acanthus Filigree.',
    heroLine2Th: 'ริ้วใบอะแคนธัสอันหรูหรานุ่มนวล',
    heroSummaryEn:
      'Luminous silk porcelain, spiced golden turmeric, midnight fig, and whipped shea clouds carved in dramatic baroque scrolls with glistening 24K gold leaf and pure sea salt crystals.',
    heroSummaryTh:
      'เฉดพอร์ซเลนชมพู ขมิ้นทองอุ่น มะเดื่อยามค่ำ และฟองเชียบัตเตอร์ สลักร่องอะแคนธัสบาโรกประดับทองคำเปลว 24K และผลึกเกลือแร่ใส',
    carvingDescEn: 'Baroque Acanthus Scrolls · Chiaroscuro Gold Inlay',
    carvingDescTh: 'ลายเถาอะแคนธัสบาโรกและประกายทองคำตัดแสงเงา',
    paletteNoteEn: 'Porcelain Rose · Molten Turmeric · Lapis Dew · Cream Shea',
    paletteNoteTh: 'กุหลาบพอร์ซเลน · ทองขมิ้น · ฟ้าลาพิส · ครีมเชีย',
    coffretId: 'vault-marble-baroque',
    spotlightImageUrl: sculptBar13Img,
  },
  {
    id: 'romanticism',
    chapterRoman: 'IV',
    labelEn: 'Romanticism',
    labelTh: 'โรแมนติก',
    periodTagEn: 'Chapter IV · Twilight Gardens & Floral Ribbons',
    periodTagTh: 'บทที่ IV · สวนสนธยาและริบบิ้นกลีบกุหลาบ',
    artSchoolEn: '19th-Century Romanticism & Art Nouveau (Delacroix, Mucha)',
    artSchoolTh: 'ศิลปะโรแมนติกและอาร์ตนูโวศตวรรษที่ 19 (เดอลาครัวซ์ · มูคา)',
    heroLine1En: 'Whispered Petals & Almond Mist.',
    heroLine1Th: 'กลีบดอกไม้กระซิบและหมอกน้ำนมอัลมอนด์',
    heroLine2En: 'Rose-Gold Swirls & Salt Crystals.',
    heroLine2Th: 'ลายโค้งอ่อนช้อยคู่โรสโกลด์ 24K และผลึกเกลือแร่',
    heroSummaryEn:
      'Soft glacier mist, wild almond blossom, crushed cedar, and dew-kissed eucalyptus captured in sinuous Art Nouveau ripples with rose-gold leaf ribbons and mineral bath salt crystals.',
    heroSummaryTh:
      'หมอกสีเงิน กลีบอัลมอนด์ป่า ไม้ซีดาร์อุ่น และน้ำค้างยูคาลิปตัส แกะลายโค้งอ่อนช้อยแบบอาร์ตนูโวผสานทองโรสโกลด์ 24K และผลึกเกลือแร่ธรรมชาติ',
    carvingDescEn: 'Art Nouveau Whiplash Ripples · Rose-Gold Satin Channels',
    carvingDescTh: 'ร่องโค้งพฤกษาอาร์ตนูโวและสายทองโรสโกลด์',
    paletteNoteEn: 'Frost Blue · Caramel Almond · Warm Cedar · Celadon Leaf',
    paletteNoteTh: 'ฟ้าหิมะ · อัลมอนด์อุ่น · ซีดาร์ลึก · เขียวเซลาดอน',
    coffretId: 'vault-marble-romanticism',
    spotlightImageUrl: sculptRom21Img,
  },
  {
    id: 'enlightenment',
    chapterRoman: 'V',
    labelEn: 'Enlightenment',
    labelTh: 'ภูมิธรรม',
    periodTagEn: 'Chapter V · Wedgwood Cameo & Gilded Horizon',
    periodTagTh: 'บทที่ V · พอร์ซเลนเวดจ์วูดและเส้นขอบฟ้าสีทอง',
    artSchoolEn: 'Early 20th-Century Art Deco & Neoclassical Poise (Klimt, Picasso, Wedgwood)',
    artSchoolTh: 'ศิลปะอาร์ตเดโคและนีโอคลาสสิก (คลิมท์ · ปิกัสโซ · เวดจ์วูด)',
    heroLine1En: 'Porcelain Blue & Espresso Dusk.',
    heroLine1Th: 'พอร์ซเลนสีฟ้าและเอสเปรสโซยามสนธยา',
    heroLine2En: 'Faceted Poise & 24K Gold Leaf.',
    heroLine2Th: 'เส้นรัศมีอันสมดุลและทองคำเปลว 24K',
    heroSummaryEn:
      'Sky Wedgwood blue, wild briar rose, smoky twilight violet, and warm espresso wood sculpted with radial sunburst geometry around luminous 24K gold leaf and mineral bath crystals.',
    heroSummaryTh:
      'ฟ้าเวดจ์วูด กุหลาบป่า ม่วงกริซายยามค่ำ และไม้เอสเปรสโซเข้ม แกะร่องรัศมีทรงเรขาคณิตประดับทองคำเปลว 24K และผลึกเกลือแร่ใส',
    carvingDescEn: 'Compass-Rose Radial Sunburst & Klimt Gold Filigree',
    carvingDescTh: 'ร่องรัศมีเข็มทิศและประกายทองคำสไตล์คลิมท์',
    paletteNoteEn: 'Wedgwood Azure · Wild Briar · Twilight Violet · Espresso Oak',
    paletteNoteTh: 'ฟ้าเวดจ์วูด · กุหลาบป่า · ม่วงหม่น · เอสเปรสโซโอ๊ก',
    coffretId: 'vault-marble-checkered',
    spotlightImageUrl: sculptEnl25Img,
  },
];

export const ART_ERA_BY_ID = new Map<ArtEraId, ArtEraMeta>(ART_ERAS.map((e) => [e.id, e]));

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
  eraId: ArtEraId;
  line: VaultLineFilterId;
  categoryId: VaultBenefitCategoryId;
  categoryLabel: string;
  brandName: string;
  goldLeafTone: VaultGoldLeafTone;
  crystalFinish: VaultCrystalFinish;
  emotionalTeaseEn: string;
  emotionalTeaseTh: string;
  scentColorMoodEn: string;
  scentColorMoodTh: string;
  activeFormula: string;
  soapName: string;
  shortBarStamp: string;
  bombName: string;
  shortBombStamp: string;
  victorianStyle: VictorianGrooveStyle;
  grooveKind: EngravingGrooveKind;
  grooveLabelEn: string;
  grooveLabelTh: string;
  halfSplitEn: string;
  halfSplitTh: string;
  gentleBubbleSeal: string;
  eraGrooveEn: string;
  eraGrooveTh: string;
  eraPigmentEn: string;
  eraPigmentTh: string;
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
  eraId: ArtEraId;
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
  eraId: ArtEraId;
  line: VaultLineFilterId;
  categoryId: VaultBenefitCategoryId;
  categoryLabel: string;
  brandName: string;
  goldLeafTone: VaultGoldLeafTone;
  crystalFinish: VaultCrystalFinish;
  emotionalTeaseEn: string;
  emotionalTeaseTh: string;
  scentColorMoodEn: string;
  scentColorMoodTh: string;
  activeFormula: string;
  soapName: string;
  shortBarStamp: string;
  bombName: string;
  shortBombStamp: string;
  eraGrooveEn: string;
  eraGrooveTh: string;
  eraPigmentEn: string;
  eraPigmentTh: string;
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
  // ── CHAPTER I: MEDIEVAL ATELIER (01–06 · 2 Dark + 2 Bright + 2 Occasions) ──
  {
    itemNumber: 1,
    eraId: 'medieval',
    line: 'dark',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Aetheris Lab',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Moonlit slate mist & cool juniper stillness',
    emotionalTeaseTh: 'หมอกศิลาใต้แสงจันทร์และกลิ่นสนจูนิเปอร์เย็นสงบ',
    scentColorMoodEn: 'Smoky slate-grey fades into clear honey glass · Night cedar & silver sage',
    scentColorMoodTh: 'สีเทาศิลาเข้มไล่เฉดสู่เนื้อคริสตัลใส · กลิ่นไม้ซีดาร์ยามค่ำและใบเซจ',
    activeFormula: 'Salicylic Acid 2% + Zinc PCA 1%',
    soapName: 'Aetheris Lab Cloister Slate Bar',
    shortBarStamp: 'AETHERIS BHA 2%',
    bombName: 'Aetheris Lab Mineral Soak Sphere',
    shortBombStamp: 'AETHERIS 2%',
    eraGrooveEn: 'Gothic Quatrefoil Half-Clear 24K Gold Window',
    eraGrooveTh: 'ร่องหน้าต่างกอธิคครึ่งใสเผยทองคำ 24K',
    eraPigmentEn: 'Slate Charcoal & Honed Stone Cream',
    eraPigmentTh: 'เทาศิลาเข้มตัดครีมหินปูน',
    soapTopHex: '#3B4248',
    soapBottomHex: '#D8CFC2',
    bombCoreHex: '#505B63',
    bombRimHex: '#E9E0D3',
  },
  {
    itemNumber: 2,
    eraId: 'medieval',
    line: 'bright',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Vespera Derm',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Damask plum velvet & warm beeswax glow',
    emotionalTeaseTh: 'พลัมกำมะหยี่สีชมพูหม่นและแสงเทียนขี้ผึ้งอุ่น',
    scentColorMoodEn: 'Pressed lilac-plum meets translucent blush · Black fig & velvet rosewood',
    scentColorMoodTh: 'ม่วงพลัมละมุนตัดเนื้อเจลสีชมพูระเรื่อ · กลิ่นมะเดื่อดำและไม้โรสวูด',
    activeFormula: 'Glycolic Acid 5% + Willow Bark 2%',
    soapName: 'Vespera Derm Damask Velvet Bar',
    shortBarStamp: 'VESPERA AHA 5%',
    bombName: 'Vespera Derm Plum Rose Sphere',
    shortBombStamp: 'VESPERA 5%',
    eraGrooveEn: 'Cathedral Lancet Flute & 24K Rose Gold',
    eraGrooveTh: 'ซุ้มโค้งมหาวิหารประดับทองโรสโกลด์ 24K',
    eraPigmentEn: 'Damask Plum & Vellum Blush',
    eraPigmentTh: 'ม่วงพลัมไวน์และครีมดอกกุหลาบ',
    soapTopHex: '#634A5A',
    soapBottomHex: '#EDE0D8',
    bombCoreHex: '#7A5B6E',
    bombRimHex: '#F3EAE2',
  },
  {
    itemNumber: 3,
    eraId: 'medieval',
    line: 'bright',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Oat & Ore',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Morning hearth oat milk & warm wildflower honey',
    emotionalTeaseTh: 'น้ำนมข้าวโอ๊ตยามเช้าและหยาดน้ำผึ้งดอกไม้ป่าอุ่น',
    scentColorMoodEn: 'Toasted biscuit beige into clear amber dew · Honeyed oat & vanilla bean',
    scentColorMoodTh: 'สีเบจข้าวโอ๊ตอบสู่เจลสีอำพันใส · กลิ่นข้าวโอ๊ตน้ำผึ้งและวานิลลา',
    activeFormula: 'Lactic Acid 5% + Colloidal Oatmeal 2%',
    soapName: 'Oat & Ore Golden Honey Bar',
    shortBarStamp: 'OAT&ORE LA 5%',
    bombName: 'Oat & Ore Milky Hearth Sphere',
    shortBombStamp: 'OAT&ORE 5%',
    eraGrooveEn: 'Abbey Honeycomb Flute & Yellow Gold Leaf',
    eraGrooveTh: 'ลายรวงผึ้งอารามประดับเยลโลว์โกลด์ 24K',
    eraPigmentEn: 'Toasted Oat & Amber Glass',
    eraPigmentTh: 'ข้าวโอ๊ตอบสีทองและครีมน้ำผึ้งใส',
    soapTopHex: '#C5AC8C',
    soapBottomHex: '#F7EFE3',
    bombCoreHex: '#D7C1A3',
    bombRimHex: '#FAF4EA',
  },
  {
    itemNumber: 4,
    eraId: 'medieval',
    line: 'holiday',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Sylphide Botanics',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Dew-soaked abbey ivy & crisp green tea breeze',
    emotionalTeaseTh: 'เถาไอวีต้องน้ำค้างและสายลมชาเขียวแห่งหุบเขา',
    scentColorMoodEn: 'Forest sage cream into crystal moss · Crushed matcha leaf & neroli',
    scentColorMoodTh: 'เขียวเซจละมุนตัดเจลคริสตัลใส · กลิ่นใบชาเขียวอ่อนและดอกส้มเนโรลี',
    activeFormula: 'Mandelic Acid 5% + Green Tea 1%',
    soapName: 'Sylphide Botanics Cloister Ivy Bar',
    shortBarStamp: 'SYLPHIDE MA 5%',
    bombName: 'Sylphide Botanics Emerald Gala Sphere',
    shortBombStamp: 'SYLPHIDE 5%',
    eraGrooveEn: 'Trefoil Vine Relief & Clear Salt Crystals',
    eraGrooveTh: 'ลายเถาใบไอวีประดับผลึกเกลือแร่ใสในเนื้อคริสตัล',
    eraPigmentEn: 'Abbey Herb Moss & Limestone Sage',
    eraPigmentTh: 'เขียวมอสส์อารามและหินเซจ',
    soapTopHex: '#5E7C64',
    soapBottomHex: '#EAE7D9',
    bombCoreHex: '#75967B',
    bombRimHex: '#F1EFE4',
  },
  {
    itemNumber: 5,
    eraId: 'medieval',
    line: 'holiday',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Nymphaea Pure',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Rosewater silk ribbon & sparkling champagne mist',
    emotionalTeaseTh: 'แพรไหมน้ำดอกกุหลาบและละอองแชมเปญระยิบระยับ',
    scentColorMoodEn: 'Dusty tapestry rose beside clear mineral salt crystal · Vintage peony & white musk',
    scentColorMoodTh: 'ชมพูกุหลาบโบราณคู่ผลึกเกลือแร่ใส · กลิ่นพีโอนีและไวท์มัสก์',
    activeFormula: 'Gluconolactone (PHA) 4% + Panthenol 2%',
    soapName: 'Nymphaea Pure Rosewater Ribbon Bar',
    shortBarStamp: 'NYMPHAEA PHA 4%',
    bombName: 'Nymphaea Pure Starlit Petal Sphere',
    shortBombStamp: 'NYMPHAEA 4%',
    eraGrooveEn: 'Pointed-Arch Rosette & Clear Salt Crystals',
    eraGrooveTh: 'ซุ้มโค้งดอกกุหลาบประดับผลึกเกลือแร่ใสและทองคำเปลว',
    eraPigmentEn: 'Tapestry Dusty Rose & Crystal Blush',
    eraPigmentTh: 'ชมพูกุหลาบโบราณและเนื้อคริสตัลใส',
    soapTopHex: '#C69EA5',
    soapBottomHex: '#F9F1ED',
    bombCoreHex: '#D6B1B7',
    bombRimHex: '#FCF6F3',
  },
  {
    itemNumber: 6,
    eraId: 'medieval',
    line: 'dark',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'KeraFlux',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Sun-baked Tuscan terracotta & spiced blood orange',
    emotionalTeaseTh: 'ดินเผาสีเข้มต้องไออุ่นและส้มสีเลือดหอมลึกซึ้ง',
    scentColorMoodEn: 'Oxblood clay beside amber translucent gold · Spiced cardamom & ember',
    scentColorMoodTh: 'แดงดินเผาเข้มตัดเจลใสประกายทอง · กลิ่นกระวานอบอุ่นและอำพัน',
    activeFormula: 'AHA 7% + BHA 1%',
    soapName: 'KeraFlux Ember Terracotta Bar',
    shortBarStamp: 'KERAFLUX 7+1%',
    bombName: 'KeraFlux Crimson Amber Sphere',
    shortBombStamp: 'KERAFLUX 8%',
    eraGrooveEn: 'Heraldic Shield Fluting & 24K Gold Leaf',
    eraGrooveTh: 'ร่องโล่โบราณประดับทองคำเปลว 24K',
    eraPigmentEn: 'Oxblood Terracotta & Sandstone Clay',
    eraPigmentTh: 'ดินเผาอ็อกซ์บลัดและหินทรายอุ่น',
    soapTopHex: '#7B4C49',
    soapBottomHex: '#E8D5C7',
    bombCoreHex: '#925D59',
    bombRimHex: '#EFE1D6',
  },

  // ── CHAPTER II: RENAISSANCE STUDIO (07–12 · 2 Dark + 2 Bright + 2 Occasions) ──
  {
    itemNumber: 7,
    eraId: 'renaissance',
    line: 'dark',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Brimstone & Leaf',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Spiced myrrh incense & gilded saffron honey',
    emotionalTeaseTh: 'กำยานไมร์ร่าอุ่นลึกและน้ำผึ้งหญ้าฝรั่นเคลือบทอง',
    scentColorMoodEn: 'Illuminated ochre gold fading into clear amber · Bergamot peel & warm ambergris',
    scentColorMoodTh: 'สีทองอำพันเข้มคู่เจลโปร่งแสง · กลิ่นผิวมะกรูดและยางไม้อุ่น',
    activeFormula: 'Sulfur 3% + Tea Tree Oil 1%',
    soapName: 'Brimstone & Leaf Gilded Amber Bar',
    shortBarStamp: 'BRIMSTONE S3%',
    bombName: 'Brimstone & Leaf Saffron Resin Sphere',
    shortBombStamp: 'BRIMSTONE 3%',
    eraGrooveEn: 'Classical Roman Signet Column & 24K Gold Leaf',
    eraGrooveTh: 'เสาโรมันสลักลายและทองคำเปลว 24K ในเจลใส',
    eraPigmentEn: 'Manuscript Gold Ochre & Travertine',
    eraPigmentTh: 'ทองอำพันสมุดข่อยและหินทราเวอร์ทีน',
    soapTopHex: '#B69C4B',
    soapBottomHex: '#EAE5D2',
    bombCoreHex: '#C8AF5D',
    bombRimHex: '#F3EFE0',
  },
  {
    itemNumber: 8,
    eraId: 'renaissance',
    line: 'dark',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Obsidian Apothecary',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Midnight volcanic stone & smoky roasted vetiver',
    emotionalTeaseTh: 'ศิลาภูเขาไฟยามเที่ยงคืนและรากหญ้าแฝกรมควัน',
    scentColorMoodEn: 'Deep ink charcoal beside pure quartz glass · Smoked vetiver & black pepper',
    scentColorMoodTh: 'ถ่านดำสนิทตัดเจลคริสตัลใสสะอาด · กลิ่นหญ้าแฝกและพริกไทยดำ',
    activeFormula: 'Activated Charcoal 5% + Kaolin Clay 10%',
    soapName: 'Obsidian Apothecary Midnight Basalt Bar',
    shortBarStamp: 'OBSIDIAN C5%',
    bombName: 'Obsidian Apothecary Black Marble Sphere',
    shortBombStamp: 'OBSIDIAN 5%',
    eraGrooveEn: 'Bastion Pillar Fluting & Pure Cream Veil',
    eraGrooveTh: 'ร่องเสาคลาสสิกตัดคมลึกเผยเนื้อครีมขาวบริสุทธิ์',
    eraPigmentEn: 'Pitch Charcoal & Quartz Basalt',
    eraPigmentTh: 'ถ่านดำสนิทและหินควอตซ์สีเถ้า',
    soapTopHex: '#2C2A2E',
    soapBottomHex: '#BEB6AC',
    bombCoreHex: '#3B383E',
    bombRimHex: '#D8D1C7',
  },
  {
    itemNumber: 9,
    eraId: 'renaissance',
    line: 'bright',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'TerraVibe Clinical',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Sunlit sandstone earth & crisp Tuscan apple',
    emotionalTeaseTh: 'ดินหินทรายต้องแดดและกลิ่นแอปเปิลทัสคานีสดใส',
    scentColorMoodEn: 'Warm umber silk beside champagne glass · Orchard orchard pear & crisp oak',
    scentColorMoodTh: 'สีอุมเบอร์นุ่มละมุนคู่เจลแชมเปญใส · กลิ่นลูกแพร์สวนและไม้โอ๊ก',
    activeFormula: 'Bentonite Clay 10% + Apple Cider Vinegar 2%',
    soapName: 'TerraVibe Sunlit Clay Silk Bar',
    shortBarStamp: 'TERRAVIBE 10%',
    bombName: 'TerraVibe Villa Earth Sphere',
    shortBombStamp: 'TERRAVIBE 10%',
    eraGrooveEn: 'Tuscan Lattice Flutes & 24K Rose Gold',
    eraGrooveTh: 'ร่องตารางทัสคานีประดับโรสโกลด์ 24K',
    eraPigmentEn: 'Villa Umber Earth & Flax Silk',
    eraPigmentTh: 'ดินอุมเบอร์และผ้าไหมลินิน',
    soapTopHex: '#846D58',
    soapBottomHex: '#E5DBD0',
    bombCoreHex: '#9C826A',
    bombRimHex: '#EEE6DC',
  },
  {
    itemNumber: 10,
    eraId: 'renaissance',
    line: 'bright',
    categoryId: 'exfoliating-clarifying',
    categoryLabel: 'Exfoliating & Clarifying',
    brandName: 'Azelia Mist',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Florentine garden sage & powdery white tea',
    emotionalTeaseTh: 'ใบเซจแห่งสวนฟลอเรนซ์และชาขาวละมุนดุจแพรไหม',
    scentColorMoodEn: 'Soft lichen green beside blush crystal · White tea blossom & sweet iris',
    scentColorMoodTh: 'เขียวสมุนไพรละมุนคู่คริสตัลสีชมพู · กลิ่นดอกชาขาวและไอริส',
    activeFormula: 'Azelaic Acid 5% + Licorice Root 1%',
    soapName: 'Azelia Mist White Tea Garden Bar',
    shortBarStamp: 'AZELIA AZ 5%',
    bombName: 'Azelia Mist Pastel Sage Sphere',
    shortBombStamp: 'AZELIA 5%',
    eraGrooveEn: 'Renaissance Rose-Window Channels & Rose Gold',
    eraGrooveTh: 'ร่องรัศมีหน้าต่างกุหลาบพร้อมทองโรสโกลด์ 24K',
    eraPigmentEn: 'Lichen Herb Sage & Pale Parchment',
    eraPigmentTh: 'เขียวสมุนไพรและครีมพาร์ชเมนต์',
    soapTopHex: '#8A9A8B',
    soapBottomHex: '#F3EFE6',
    bombCoreHex: '#A0B1A1',
    bombRimHex: '#F9F6F0',
  },
  {
    itemNumber: 11,
    eraId: 'renaissance',
    line: 'holiday',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Lumeniscent',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Gilded champagne toast & warm golden mimosa',
    emotionalTeaseTh: 'แชมเปญสีทองฉลองค่ำคืนและดอกมิโมซ่าต้องแสง',
    scentColorMoodEn: 'Liquid gold-saffron cream beside translucent salt crystals · Golden neroli & champagne',
    scentColorMoodTh: 'ครีมทองหญ้าฝรั่นคู่ผลึกเกลือแร่ใส · กลิ่นเนโรลีสีทองและแชมเปญ',
    activeFormula: 'Niacinamide 5% + Zinc 1%',
    soapName: 'Lumeniscent Golden Aura Bar',
    shortBarStamp: 'LUMEN B3 5%',
    bombName: 'Lumeniscent Champagne Crown Sphere',
    shortBombStamp: 'LUMEN 5%',
    eraGrooveEn: 'Ionic Column Flutes & Floating Gold Leaf',
    eraGrooveTh: 'ร่องเสาไอโอนิกประดับทองคำเปลว 24K และเกลือแร่ใส',
    eraPigmentEn: 'Gilded Saffron Champagne & Ivory',
    eraPigmentTh: 'แชมเปญหญ้าฝรั่นเคลือบทองและงาช้าง',
    soapTopHex: '#D8B979',
    soapBottomHex: '#FBF6EB',
    bombCoreHex: '#E5CA90',
    bombRimHex: '#FFFBF2',
  },
  {
    itemNumber: 12,
    eraId: 'renaissance',
    line: 'holiday',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Solaia C',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Mediterranean sunlit apricot & candied orange zest',
    emotionalTeaseTh: 'แอปริคอตต้องแสงเมดิเตอร์เรเนียนและผิวส้มหวานเชื่อม',
    scentColorMoodEn: 'Florentine sunset peach beside sparkling glass · Sweet mandarin & sunbeam blossom',
    scentColorMoodTh: 'สีพีชตะวันตกดินคู่คริสตัลสว่าง · กลิ่นส้มแมนดารินและดอกส้ม',
    activeFormula: 'Ascorbyl Glucoside 5% + Ferulic Acid 0.5%',
    soapName: 'Solaia C Sunburst Apricot Bar',
    shortBarStamp: 'SOLAIA VITC 5%',
    bombName: 'Solaia C Solstice Citrus Sphere',
    shortBombStamp: 'SOLAIA C5%',
    eraGrooveEn: 'Sunburst Rays & Clear Salt Crystal Core',
    eraGrooveTh: 'ร่องรัศมีตะวันและผลึกเกลือแร่ใสกลางแก้วเจล',
    eraPigmentEn: 'Florentine Apricot & Sunlit Ivory',
    eraPigmentTh: 'แอปริคอตฟลอเรนซ์และงาช้างต้องแดด',
    soapTopHex: '#DB9258',
    soapBottomHex: '#FAF0E1',
    bombCoreHex: '#E7A670',
    bombRimHex: '#FDF5EB',
  },

  // ── CHAPTER III: BAROQUE SALON (13–18 · 2 Dark + 2 Bright + 2 Occasions) ──
  {
    itemNumber: 13,
    eraId: 'baroque',
    line: 'bright',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Arbutelle',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Rococo fresco blush & velvet peach blossom',
    emotionalTeaseTh: 'สีบลัชโรโคโคแสนหวานและดอกท้อกำมะหยี่',
    scentColorMoodEn: 'Porcelain rose silk beside rose-gold crystal · White peach & damask petal',
    scentColorMoodTh: 'ชมพูพอร์ซเลนละมุนคู่เจลโรสโกลด์ · กลิ่นพีชขาวและกลีบกุหลาบ',
    activeFormula: 'Alpha Arbutin 2% + Niacinamide 3%',
    soapName: 'Arbutelle Fresco Blush Bar',
    shortBarStamp: 'ARBUTELLE AA2%',
    bombName: 'Arbutelle Rococo Rose Sphere',
    shortBombStamp: 'ARBUTELLE 2%',
    eraGrooveEn: 'Scalloped Shell Scroll & Rose Gold Leaf',
    eraGrooveTh: 'ซุ้มโค้งโรโคโคประดับโรสโกลด์ 24K',
    eraPigmentEn: 'Tuscan Fresco Rose-Clay & Silk Blush',
    eraPigmentTh: 'ชมพูโคลนทัสคานีและเนื้อครีมบลัช',
    soapTopHex: '#D7A39E',
    soapBottomHex: '#F9F2EE',
    bombCoreHex: '#E4B7B2',
    bombRimHex: '#FCF7F5',
  },
  {
    itemNumber: 14,
    eraId: 'baroque',
    line: 'dark',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Curcuma Alchemy',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Chiaroscuro spiced honey & molten amber gold',
    emotionalTeaseTh: 'น้ำผึ้งเครื่องเทศในแสงเงาบาโรกและทองคำหลอมละลาย',
    scentColorMoodEn: 'Deep burnished saffron cream into glowing amber · Cardamom spice & sandalwood',
    scentColorMoodTh: 'ทองขมิ้นเข้มตัดเจลใสสีอำพันเรืองรอง · กลิ่นเครื่องเทศอุ่นและไม้จันทน์',
    activeFormula: 'Kojic Acid 1% + Turmeric Extract 2%',
    soapName: 'Curcuma Alchemy Molten Gold Bar',
    shortBarStamp: 'CURCUMA KA 1%',
    bombName: 'Curcuma Alchemy Chiaroscuro Sphere',
    shortBombStamp: 'CURCUMA 1%',
    eraGrooveEn: 'Baroque Acanthus Leaf Relief & Gold Leaf',
    eraGrooveTh: 'ลายใบอะแคนธัสบาโรกประดับเยลโลว์โกลด์ 24K',
    eraPigmentEn: 'Venetian Turmeric Ochre & Warm Cream',
    eraPigmentTh: 'ขมิ้นเวนิสสีทองอุ่นและครีมเนย',
    soapTopHex: '#C68B3A',
    soapBottomHex: '#F5E8CE',
    bombCoreHex: '#D7A052',
    bombRimHex: '#FAF0DC',
  },
  {
    itemNumber: 15,
    eraId: 'baroque',
    line: 'dark',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Tranexis',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Royal plum tapestry & hushed lavender dusk',
    emotionalTeaseTh: 'ผ้าไหมสีม่วงรอยัลและสายลมลาเวนเดอร์ยามพลบค่ำ',
    scentColorMoodEn: 'Deep mauve velvet paired with clear lilac · Velvet plum & dark iris',
    scentColorMoodTh: 'ม่วงหม่นกำมะหยี่คู่เจลใสสีดอกไลแลค · กลิ่นลูกพลัมและไอริสเข้ม',
    activeFormula: 'Tranexamic Acid 2% + Vitamin B5 1%',
    soapName: 'Tranexis Royal Plum Velvet Bar',
    shortBarStamp: 'TRANEXIS TX 2%',
    bombName: 'Tranexis Twilight Cameo Sphere',
    shortBombStamp: 'TRANEXIS 2%',
    eraGrooveEn: 'Baroque Oval Portrait Frame & Carved Relief',
    eraGrooveTh: 'กรอบคามีโอรูปไข่สไตล์บาโรกแกะร่องประณีต',
    eraPigmentEn: 'Imperial Plum-Mauve & Soft Alabaster',
    eraPigmentTh: 'ม่วงพลัมละมุนและเนื้ออะลาบาสเตอร์',
    soapTopHex: '#A88FA8',
    soapBottomHex: '#F5EFF5',
    bombCoreHex: '#BCA5BC',
    bombRimHex: '#FAF5FA',
  },
  {
    itemNumber: 16,
    eraId: 'baroque',
    line: 'holiday',
    categoryId: 'brightening-even-tone',
    categoryLabel: 'Brightening & Even Tone',
    brandName: 'Carica Zest',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Festive candied mandarin & champagne garland',
    emotionalTeaseTh: 'พวงมาลาผลส้มหวานฉลองเทศกาลและฟองแชมเปญสว่าง',
    scentColorMoodEn: 'Warm coral-peach cream beside sunlit salt crystals · Nectarine & sweet champagne',
    scentColorMoodTh: 'ส้มคอรัลละมุนคู่เจลคริสตัลเกลือแร่สว่าง · กลิ่นเนคทารีนและแชมเปญ',
    activeFormula: 'Papain Enzyme 3% + Vitamin E 1%',
    soapName: 'Carica Zest Gala Mandarin Bar',
    shortBarStamp: 'CARICA PAP 3%',
    bombName: 'Carica Zest Sunlit Garland Sphere',
    shortBombStamp: 'CARICA 3%',
    eraGrooveEn: 'Baroque Fruit Garland & Sunlit Crystal Window',
    eraGrooveTh: 'ลายพวงมาลาซิตรัสบาโรกและผลึกเกลือแร่ใส',
    eraPigmentEn: 'Sicilian Terracotta Peach & Linen',
    eraPigmentTh: 'ส้มดินเผาซิซิลีและครีมผ้าลินิน',
    soapTopHex: '#DD956B',
    soapBottomHex: '#FBF1E6',
    bombCoreHex: '#E9AA84',
    bombRimHex: '#FDF7EF',
  },
  {
    itemNumber: 17,
    eraId: 'baroque',
    line: 'bright',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Hyaluna',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Cool porcelain fountain & morning sea-spray dew',
    emotionalTeaseTh: 'น้ำพุพอร์ซเลนเย็นชื่นใจและละอองน้ำค้างยามรุ่งอรุณ',
    scentColorMoodEn: 'Cerulean azure silk beside translucent lagoon · Water lily & chilled white rain',
    scentColorMoodTh: 'สีฟ้าลาพิสละมุนคู่เจลใสราวสายน้ำ · กลิ่นดอกบัวขาวและสายฝนเย็น',
    activeFormula: 'Hyaluronic Acid 1% + Glycerin 10%',
    soapName: 'Hyaluna Cerulean Dew Bar',
    shortBarStamp: 'HYALUNA HA 1%',
    bombName: 'Hyaluna Porcelain Lagoon Sphere',
    shortBombStamp: 'HYALUNA 1%',
    eraGrooveEn: 'Fountain Shell Fluting & Rose Gold Leaf',
    eraGrooveTh: 'ร่องน้ำพุบาโรกประดับโรสโกลด์ 24K',
    eraPigmentEn: 'Lapis Cerulean & Porcelain Crystal',
    eraPigmentTh: 'ฟ้าคริสตัลลาพิสและขาวพอร์ซเลน',
    soapTopHex: '#73A6BD',
    soapBottomHex: '#EEF6FA',
    bombCoreHex: '#8BBBD0',
    bombRimHex: '#F5FAFC',
  },
  {
    itemNumber: 18,
    eraId: 'baroque',
    line: 'holiday',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Karité Velours',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Whipped cashmere cream & winter tonka embrace',
    emotionalTeaseTh: 'ครีมแคชเมียร์หนานุ่มและไออุ่นตองก้าบีนยามค่ำคืน',
    scentColorMoodEn: 'Ivory cashmere cloud beside rose-gold salt crystals · Whipped vanilla & warm shea',
    scentColorMoodTh: 'ครีมแคชเมียร์งาช้างคู่ผลึกเกลือแร่และโรสโกลด์ · กลิ่นวานิลลาและเชีย',
    activeFormula: 'Shea Butter 15% + Squalane 3%',
    soapName: 'Karité Velours Cashmere Silk Bar',
    shortBarStamp: 'KARITE SB 15%',
    bombName: 'Karité Velours Velvet Gala Sphere',
    shortBombStamp: 'KARITE 15%',
    eraGrooveEn: 'Coffer Salt-Crystal Rosette & 24K Rose Gold',
    eraGrooveTh: 'ร่องดอกโรเซ็ตต์ประดับผลึกเกลือแร่ใสและโรสโกลด์',
    eraPigmentEn: 'Biscuit Cashmere & Crystal Ivory',
    eraPigmentTh: 'สีครีมแคชเมียร์และงาช้างใส',
    soapTopHex: '#CDB491',
    soapBottomHex: '#FAF3E7',
    bombCoreHex: '#DAC4A5',
    bombRimHex: '#FCF8F0',
  },

  // ── CHAPTER IV: ROMANTICISM & ART NOUVEAU (19–24 · 2 Dark + 2 Bright + 2 Occasions) ──
  {
    itemNumber: 19,
    eraId: 'romanticism',
    line: 'bright',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'UreDermis',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Mist over alpine stone & soft cotton blossom',
    emotionalTeaseTh: 'ม่านหมอกเหนือขุนเขาและดอกฝ้ายขาวบริสุทธิ์',
    scentColorMoodEn: 'Carrara misty slate-blue beside frosted silk · Soft cotton flower & rain',
    scentColorMoodTh: 'ฟ้าเทาหินคาร์ราราคู่เนื้อคริสตัลใสซาติน · กลิ่นดอกฝ้ายและสายฝน',
    activeFormula: 'Urea 5% + Lactic Acid 2%',
    soapName: 'UreDermis Alpine Mist Silk Bar',
    shortBarStamp: 'UREDERMIS U5%',
    bombName: 'UreDermis Carrara Dew Sphere',
    shortBombStamp: 'UREDERMIS 5%',
    eraGrooveEn: 'Romantic Ribbon Pediment & 24K Rose Gold',
    eraGrooveTh: 'ลายริ้วอ่อนช้อยประดับโรสโกลด์ 24K',
    eraPigmentEn: 'Carrara Blue-Grey & Marble White',
    eraPigmentTh: 'เทาอมฟ้าหินคาร์ราราและขาวนวล',
    soapTopHex: '#8C9CAE',
    soapBottomHex: '#F1F4F7',
    bombCoreHex: '#A1B0C1',
    bombRimHex: '#F7F9FB',
  },
  {
    itemNumber: 20,
    eraId: 'romanticism',
    line: 'bright',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'NattoDew',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Dewy celadon moss & crushed olive leaf',
    emotionalTeaseTh: 'น้ำค้างบนมอสส์เซลาดอนและใบมะกอกคั้นสด',
    scentColorMoodEn: 'Cool celadon leaf beside crystal mint glass · Fresh verbena & cucumber dew',
    scentColorMoodTh: 'เขียวเซลาดอนละมุนคู่เจลใสสีมิ้นต์อ่อน · กลิ่นเวอร์บีนาและน้ำค้าง',
    activeFormula: 'Polyglutamic Acid 0.5% + Aloe Vera 5%',
    soapName: 'NattoDew Celadon Silk Bar',
    shortBarStamp: 'NATTODEW 0.5%',
    bombName: 'NattoDew Leaf Dew Sphere',
    shortBombStamp: 'NATTODEW .5%',
    eraGrooveEn: 'Art Nouveau Olive Ripple & 24K Rose Gold',
    eraGrooveTh: 'ลายโค้งกิ่งมะกอกอาร์ตนูโวและโรสโกลด์ 24K',
    eraPigmentEn: 'Celadon Green & Translucent Mint',
    eraPigmentTh: 'เขียวเซลาดอนและมิ้นต์โปร่งแสง',
    soapTopHex: '#79AD94',
    soapBottomHex: '#EDF6F1',
    bombCoreHex: '#92C0AA',
    bombRimHex: '#F5FAF7',
  },
  {
    itemNumber: 21,
    eraId: 'romanticism',
    line: 'holiday',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Amandine Silk',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Warm marzipan honey & velvet satin ribbon',
    emotionalTeaseTh: 'อัลมอนด์มาร์ซิแพนน้ำผึ้งและริบบิ้นผ้าซาตินแสนหวาน',
    scentColorMoodEn: 'Caramelized almond cream beside clear salt crystals · Toasted almond & sweet milk',
    scentColorMoodTh: 'ครีมอัลมอนด์คาราเมลคู่ผลึกเกลือแร่ใส · กลิ่นอัลมอนด์อบและน้ำนม',
    activeFormula: 'Sweet Almond Oil 10% + Vitamin E 2%',
    soapName: 'Amandine Silk Satin Ribbon Bar',
    shortBarStamp: 'AMANDINE 10%',
    bombName: 'Amandine Silk Velvet Honey Sphere',
    shortBombStamp: 'AMANDINE 10%',
    eraGrooveEn: 'Rose-Gold Beaded Cameo & Salt Crystal Core',
    eraGrooveTh: 'กรอบคามีโอประดับโรสโกลด์และผลึกเกลือแร่ใส',
    eraPigmentEn: 'Caramel Almond & Rose-Gold Ivory',
    eraPigmentTh: 'อัลมอนด์คาราเมลและงาช้างโรสโกลด์',
    soapTopHex: '#D1A988',
    soapBottomHex: '#FBF2E9',
    bombCoreHex: '#DEBCA0',
    bombRimHex: '#FDF7F1',
  },
  {
    itemNumber: 22,
    eraId: 'romanticism',
    line: 'holiday',
    categoryId: 'deep-hydration',
    categoryLabel: 'Deep Hydration & Moisture Lock',
    brandName: 'Tremella Cloud',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'First snowfall stillness & silver iris musk',
    emotionalTeaseTh: 'ความสงบของหิมะแรกและมัสก์ดอกไอริสสีเงิน',
    scentColorMoodEn: 'Frosted glacier silver into clear mineral crystals · Crisp snow blossom & pure musk',
    scentColorMoodTh: 'เงินน้ำแข็งใสคู่ผลึกเกลือแร่ธรรมชาติ · กลิ่นดอกไม้หิมะและมัสก์บริสุทธิ์',
    activeFormula: 'Snow Mushroom 2% + Betaine 3%',
    soapName: 'Tremella Cloud Snow Iris Bar',
    shortBarStamp: 'TREMELLA 2%',
    bombName: 'Tremella Cloud Crystal Snowflake Sphere',
    shortBombStamp: 'TREMELLA 2%',
    eraGrooveEn: 'Art Nouveau Iris Wave & Clear Salt Crystals',
    eraGrooveTh: 'ริ้วคลื่นดอกไอริสและผลึกเกลือแร่กลางคริสตัลใส',
    eraPigmentEn: 'Frosted Cloud Mist & Pure Porcelain',
    eraPigmentTh: 'หมอกสีเงินโปร่งแสงและขาวพอร์ซเลน',
    soapTopHex: '#C2CDD8',
    soapBottomHex: '#F8FAFC',
    bombCoreHex: '#D3DCE6',
    bombRimHex: '#FFFFFF',
  },
  {
    itemNumber: 23,
    eraId: 'romanticism',
    line: 'dark',
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'Ceramori',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Fireside cedarwood & warm jasper cashmere',
    emotionalTeaseTh: 'ไม้ซีดาร์หน้าเตาผิงและแคชเมียร์สีแจสเปอร์อบอุ่น',
    scentColorMoodEn: 'Deep jasper taupe beside golden amber glass · Spiced cedar & vanilla woods',
    scentColorMoodTh: 'โทปอุ่นสีแจสเปอร์คู่เจลสีทองอำพัน · กลิ่นไม้ซีดาร์และวานิลลา',
    activeFormula: 'Ceramide Complex 1% + Cholesterol 0.5%',
    soapName: 'Ceramori Fireside Cashmere Bar',
    shortBarStamp: 'CERAMORI 1%',
    bombName: 'Ceramori Amber Sanctuary Sphere',
    shortBombStamp: 'CERAMORI 1%',
    eraGrooveEn: 'Romantic Cameo Swirls & 24K Gold Leaf',
    eraGrooveTh: 'ลายคามีโอโค้งมนประดับเยลโลว์โกลด์ 24K',
    eraPigmentEn: 'Warm Jasper Taupe & Golden Amber',
    eraPigmentTh: 'แจสเปอร์โทปอุ่นและอำพันสีทอง',
    soapTopHex: '#B69A87',
    soapBottomHex: '#F7F0EA',
    bombCoreHex: '#C7AE9D',
    bombRimHex: '#FCF7F3',
  },
  {
    itemNumber: 24,
    eraId: 'romanticism',
    line: 'dark',
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'CicaVeda',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Midnight botanical greenhouse & cool eucalyptus rain',
    emotionalTeaseTh: 'เรือนกระจกพฤกษศาสตร์ยามค่ำและฝนยูคาลิปตัสเย็นสงบ',
    scentColorMoodEn: 'Deep eucalyptus leaf beside clear moss glass · Wild centella & green cypress',
    scentColorMoodTh: 'เขียวยูคาลิปตัสลึกคู่เจลใสสีมอสส์ · กลิ่นใบบัวบกป่าและไซเปรส',
    activeFormula: 'Centella Asiatica 5% + Madecassoside 0.2%',
    soapName: 'CicaVeda Midnight Conservatory Bar',
    shortBarStamp: 'CICAVEDA 5%',
    bombName: 'CicaVeda Emerald Mist Sphere',
    shortBombStamp: 'CICAVEDA 5%',
    eraGrooveEn: 'Mucha Botanical Vine Channels & 24K Gold',
    eraGrooveTh: 'ลายเถาพฤกษาแบบมูคาพร้อมทองคำเปลว 24K',
    eraPigmentEn: 'Deep Eucalyptus & Translucent Sage',
    eraPigmentTh: 'เขียวยูคาลิปตัสและเซจโปร่งแสง',
    soapTopHex: '#688F6A',
    soapBottomHex: '#EEF4EC',
    bombCoreHex: '#7FA481',
    bombRimHex: '#F5F9F4',
  },

  // ── CHAPTER V: ENLIGHTENMENT CABINET (25–30 · 2 Dark + 2 Bright + 2 Occasions) ──
  {
    itemNumber: 25,
    eraId: 'enlightenment',
    line: 'bright',
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'PantheCalm',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Classic Wedgwood sky & serene silk linen',
    emotionalTeaseTh: 'สีฟ้าเวดจ์วูดคลาสสิกและผ้าลินินนุ่มละมุนยามเช้า',
    scentColorMoodEn: 'Powder blue porcelain beside rose-gold glass · Fresh bergamot & chamomile silk',
    scentColorMoodTh: 'พอร์ซเลนสีฟ้าอ่อนคู่เจลโรสโกลด์ · กลิ่นเบอร์กาม็อตและคาโมมายล์',
    activeFormula: 'Panthenol (B5) 5% + Allantoin 0.5%',
    soapName: 'PantheCalm Wedgwood Silk Bar',
    shortBarStamp: 'PANTHE B5 5%',
    bombName: 'PantheCalm Porcelain Cloud Sphere',
    shortBombStamp: 'PANTHE 5%',
    eraGrooveEn: 'Neoclassical Wedgwood Swag & 24K Rose Gold',
    eraGrooveTh: 'ลายคล้องผ้านีโอคลาสสิกประดับโรสโกลด์ 24K',
    eraPigmentEn: 'Classic Wedgwood Sky & Chalk Crystal',
    eraPigmentTh: 'ฟ้าเวดจ์วูดคลาสสิกและคริสตัลขาว',
    soapTopHex: '#89A7BF',
    soapBottomHex: '#F1F6FA',
    bombCoreHex: '#9FBAD0',
    bombRimHex: '#F7FAFC',
  },
  {
    itemNumber: 26,
    eraId: 'enlightenment',
    line: 'bright',
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'AvenaSoothe',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Golden wheatfield breeze & warm sweet cream',
    emotionalTeaseTh: 'สายลมทุ่งข้าวสาลีสีทองและครีมนมอุ่นละมุน',
    scentColorMoodEn: 'Sandstone oat silk beside golden crystal · Warm oat milk & sweet chamomile',
    scentColorMoodTh: 'ข้าวโอ๊ตหินทรายคู่คริสตัลสีทองอุ่น · กลิ่นน้ำนมข้าวโอ๊ตและคาโมมายล์',
    activeFormula: 'Colloidal Oatmeal 5% + Bisabolol 0.5%',
    soapName: 'AvenaSoothe Golden Cream Bar',
    shortBarStamp: 'AVENA OAT 5%',
    bombName: 'AvenaSoothe Meadow Silk Sphere',
    shortBombStamp: 'AVENA 5%',
    eraGrooveEn: 'Louis XVI Guilloché Ribbon & 24K Gold Leaf',
    eraGrooveTh: 'ขอบเชือกถักหลุยส์ที่ 16 ประดับเยลโลว์โกลด์ 24K',
    eraPigmentEn: 'Sandstone Oat & Warm Silk Cream',
    eraPigmentTh: 'ข้าวโอ๊ตหินทรายและครีมนม',
    soapTopHex: '#C5B091',
    soapBottomHex: '#F8F2E7',
    bombCoreHex: '#D5C3A8',
    bombRimHex: '#FCF8F1',
  },
  {
    itemNumber: 27,
    eraId: 'enlightenment',
    line: 'dark',
    categoryId: 'barrier-repair',
    categoryLabel: 'Barrier Repair & Soothing',
    brandName: 'Ectoshield',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Smoky lavender twilight & quiet library oak',
    emotionalTeaseTh: 'ลาเวนเดอร์หม่นยามสนธยาและกลิ่นไม้โอ๊กห้องสมุดโบราณ',
    scentColorMoodEn: 'Smoky grisaille violet into honey glass · Evening lavender & aged white cedar',
    scentColorMoodTh: 'ม่วงหม่นกริซายคู่เจลใสสีน้ำผึ้ง · กลิ่นลาเวนเดอร์ค่ำและไม้ซีดาร์',
    activeFormula: 'Ectoin 1% + Beta-Glucan 1%',
    soapName: 'Ectoshield Twilight Grisaille Bar',
    shortBarStamp: 'ECTOSHIELD 1%',
    bombName: 'Ectoshield Velvet Sanctuary Sphere',
    shortBombStamp: 'ECTO 1%',
    eraGrooveEn: 'Art Deco Octagon Geometry & 24K Gold Leaf',
    eraGrooveTh: 'เรขาคณิตแปดเหลี่ยมอาร์ตเดโคและทองคำเปลว 24K',
    eraPigmentEn: 'Smoky Grisaille Violet & Gold Stone',
    eraPigmentTh: 'ม่วงหม่นกริซายและศิลาทอง',
    soapTopHex: '#8E8BA8',
    soapBottomHex: '#F2F1F7',
    bombCoreHex: '#A2A0BA',
    bombRimHex: '#F8F7FB',
  },
  {
    itemNumber: 28,
    eraId: 'enlightenment',
    line: 'holiday',
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Babchi & Briar',
    goldLeafTone: 'pink-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Dusky briar-rose petals & celebratory rosewater',
    emotionalTeaseTh: 'กลีบกุหลาบป่าสีมัลเบอร์รีและน้ำกุหลาบแห่งการเฉลิมฉลอง',
    scentColorMoodEn: 'Mulberry rose velvet beside translucent salt crystals · Briar rose & spiced berry',
    scentColorMoodTh: 'ชมพูมัลเบอร์รีเข้มคู่ผลึกเกลือแร่ใส · กลิ่นกุหลาบป่าและเบอร์รี',
    activeFormula: 'Bakuchiol 1% + Rosehip Oil 5%',
    soapName: 'Babchi & Briar Gala Rose Bar',
    shortBarStamp: 'BABCHI BAK 1%',
    bombName: 'Babchi & Briar Rosewater Salt Sphere',
    shortBombStamp: 'BABCHI 1%',
    eraGrooveEn: 'Briar-Rose Medallion & Salt Crystal Core',
    eraGrooveTh: 'ภาพนูนกุหลาบป่าประดับโรสโกลด์และผลึกเกลือแร่ใส',
    eraPigmentEn: 'Mulberry Rose & Blush Porcelain',
    eraPigmentTh: 'ชมพูมัลเบอร์รีและพอร์ซเลนอ่อน',
    soapTopHex: '#9A6378',
    soapBottomHex: '#F5E9EE',
    bombCoreHex: '#B0798E',
    bombRimHex: '#FAF3F6',
  },
  {
    itemNumber: 29,
    eraId: 'enlightenment',
    line: 'holiday',
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Cuprum Peptide',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'salt-crystals',
    emotionalTeaseEn: 'Gilded horizon azure & crisp sea mineral',
    emotionalTeaseTh: 'เส้นขอบฟ้าสีฟ้าคอปเปอร์และแร่ธาตุทะเลอันบริสุทธิ์',
    scentColorMoodEn: 'Copper verdigris azure beside mineral crystals · Sea salt mist & silver fir',
    scentColorMoodTh: 'ฟ้าแร่คอปเปอร์คู่ผลึกเกลือแร่ใส · กลิ่นไอทะเลและสนเงิน',
    activeFormula: 'Copper Tripeptide-1 0.5% + Niacinamide 2%',
    soapName: 'Cuprum Peptide Verdigris Gala Bar',
    shortBarStamp: 'CUPRUM .5%',
    bombName: 'Cuprum Peptide Azurite Tonic Sphere',
    shortBombStamp: 'CUPRUM .5%',
    eraGrooveEn: 'Compass-Rose Horizon & Salt Crystal Core',
    eraGrooveTh: 'เข็มทิศรัศมีสีทองและผลึกเกลือแร่ในเจลฟ้าใส',
    eraPigmentEn: 'Copper Verdigris Azure & Crystal',
    eraPigmentTh: 'ฟ้าแร่คอปเปอร์เวอร์ดิกริสและคริสตัลใส',
    soapTopHex: '#4F859B',
    soapBottomHex: '#E9F3F7',
    bombCoreHex: '#669CB2',
    bombRimHex: '#F3F9FB',
  },
  {
    itemNumber: 30,
    eraId: 'enlightenment',
    line: 'dark',
    categoryId: 'firming-recovery',
    categoryLabel: 'Firming, Energizing & Recovery',
    brandName: 'Kinetix Salt',
    goldLeafTone: 'yellow-gold',
    crystalFinish: 'carved-grooves',
    emotionalTeaseEn: 'Roasted mahogany espresso & mineral dusk salt',
    emotionalTeaseTh: 'เอสเปรสโซไม้มะฮอกกานีคั่วเข้มและเกลือแร่ยามสนธยา',
    scentColorMoodEn: 'Espresso mahogany brown beside warm gold glass · Dark roasted coffee & black vetiver',
    scentColorMoodTh: 'น้ำตาลเอสเปรสโซเข้มคู่เจลสีทองอุ่น · กลิ่นกาแฟคั่วและหญ้าแฝก',
    activeFormula: 'Caffeine 2% + Magnesium Sulfate 15%',
    soapName: 'Kinetix Salt Espresso Mahogany Bar',
    shortBarStamp: 'KINETIX CAF2%',
    bombName: 'Kinetix Salt Dark Mineral Sphere',
    shortBombStamp: 'KINETIX 2%',
    eraGrooveEn: 'Klimt Rectilinear Plinth & 24K Gold Leaf',
    eraGrooveTh: 'ร่องเส้นตรงเรขาคณิตประดับทอง 24K แท้',
    eraPigmentEn: 'Espresso Mahogany & Travertine Gold',
    eraPigmentTh: 'น้ำตาลมะฮอกกานีเอสเปรสโซและทองอุ่น',
    soapTopHex: '#624B3E',
    soapBottomHex: '#E8DDD4',
    bombCoreHex: '#7A6052',
    bombRimHex: '#F2EAE3',
  },
];

const VAULT_IMAGE_BY_NUMBER: Record<number, string> = {
  1: sculptMed01Img,
  2: sculptMed02Img,
  3: sculptMed03Img,
  4: sculptMed04Img,
  5: sculptMed05Img,
  6: sculptMed06Img,
  7: sculptRen07Img,
  8: sculptRen08Img,
  9: sculptRen09Img,
  10: sculptRen10Img,
  11: sculptRen11Img,
  12: sculptRen12Img,
  13: sculptBar13Img,
  14: sculptBar14Img,
  15: sculptBar15Img,
  16: sculptBar16Img,
  17: sculptBar17Img,
  18: sculptBar18Img,
  19: sculptRom19Img,
  20: sculptRom20Img,
  21: sculptRom21Img,
  22: sculptRom22Img,
  23: sculptRom23Img,
  24: sculptRom24Img,
  25: sculptEnl25Img,
  26: sculptEnl26Img,
  27: sculptEnl27Img,
  28: sculptEnl28Img,
  29: sculptEnl29Img,
  30: sculptEnl30Img,
};

const VAULT_GROOVE_CYCLE: EngravingGrooveKind[] = [
  'diagonal',
  'era-inspired',
  'futuristic-fractal',
];

export const VAULT_PAIRED_FORMULATIONS: VaultPairedFormulation[] = RAW_VAULT_SEEDS.map((seed) => {
  const grooveKind = VAULT_GROOVE_CYCLE[(seed.itemNumber - 1) % VAULT_GROOVE_CYCLE.length];
  const grooveMeta = GROOVE_SPECS[grooveKind];
  const eraGrooveEn =
    grooveKind === 'futuristic-fractal'
      ? `${seed.eraGrooveEn} · Futuristic Roundish Fractal Grooves`
      : grooveKind === 'diagonal'
        ? `${seed.eraGrooveEn} · 3D Diagonal Botanical Channels`
        : seed.eraGrooveEn;
  const eraGrooveTh =
    grooveKind === 'futuristic-fractal'
      ? `${seed.eraGrooveTh} · ร่องวงโค้งฟรักทัลล้ำสมัย`
      : grooveKind === 'diagonal'
        ? `${seed.eraGrooveTh} · ร่องขัดผิว 3 มิติแนวทแยง`
        : seed.eraGrooveTh;

  return {
    ...seed,
    id: `vault-${String(seed.itemNumber).padStart(2, '0')}`,
    victorianStyle: STYLE_BY_CATEGORY[seed.categoryId],
    grooveKind,
    grooveLabelEn: grooveMeta.en,
    grooveLabelTh: grooveMeta.th,
    halfSplitEn: 'Bar: 50/50 Half-Transparent Botanical Crystal · Bath Bomb: Transparent Mineral Salt Crystals + 24K Gold Leaf',
    halfSplitTh: 'สบู่ก้อน: ครึ่งใสครึ่งครีม 50/50 · บาธบอมบ์: ผลึกเกลือแร่ใส + ทองคำเปลว 24K + ร่อง 3D',
    gentleBubbleSeal: 'GentleBubble',
    eraGrooveEn,
    eraGrooveTh,
    imageUrl: VAULT_IMAGE_BY_NUMBER[seed.itemNumber] ?? sculptMed01Img,
    barPriceThb: VAULT_PRICING.barThb,
    bombPriceThb: VAULT_PRICING.bombThb,
    pairedDuoPriceThb: VAULT_PRICING.pairedDuoThb,
  };
});

export const VAULT_PAIR_BY_ID = new Map<string, VaultPairedFormulation>(
  VAULT_PAIRED_FORMULATIONS.map((item) => [item.id, item]),
);

// 5 Special Era-Dedicated Roman-Grooved Marble Coffrets — 1 Bespoke Chest per Art Era
// Each coffret gathers 1 Bright + 1 Dark + 1 Events matched bar & sphere pairing + 1 natural loofah + 1 matching 50/50 candle
export const VAULT_MARBLE_BOXES: VaultMarbleBoxEdition[] = [
  {
    id: 'vault-marble-obsidian',
    eraId: 'medieval',
    stoneType: 'dark-marble',
    victorianGroove: 'imperial-ribbed',
    titleEn: 'Medieval Heraldic Roman Nero Marble Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนดำร่องเสาโรมันยุคกลาง · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CHAPTER I · MEDIEVAL · 1 LOOFAH + 1 CANDLE 50/50',
    themeLabelTh: 'บทที่ I · ยุคกลาง · บวบ 1 + เทียนหอม 50/50',
    descEn:
      'Roman-fluted Nero Marquina black marble chest with 24k gold-leaf trim—housing Bright, Dark, and Events pairs with 1 charcoal loofah and 1 matching 50/50 velvet cacao candle.',
    descTh:
      'หีบหินอ่อนดำเนโรเซาะร่องเสาโรมันประดับทองคำเปลว—บรรจุคู่ไบรท์ · ดาร์ก · อีเวนต์ พร้อมบวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 กลิ่นโกโก้อำพัน',
    grooveDetailEn: 'Roman-Style Fluted Nero Columns & Gothic Relief',
    grooveDetailTh: 'ร่องเสาโรมันบนหินอ่อนดำและซุ้มโค้งกอธิค',
    imageUrl: eraMedievalCoffretImg,
    priceThb: 4950,
    compareAtThb: 5750,
    includedPairIds: ['vault-01', 'vault-02', 'vault-04'],
  },
  {
    id: 'vault-marble-calacatta',
    eraId: 'renaissance',
    stoneType: 'bright-marble',
    victorianGroove: 'fluted-crest',
    titleEn: 'Renaissance Florentine Roman Calacatta Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนขาวร่องเสาโรมันเรอเนซองส์ · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CHAPTER II · RENAISSANCE · 1 LOOFAH + 1 CANDLE 50/50',
    themeLabelTh: 'บทที่ II · เรอเนซองส์ · บวบ 1 + เทียนหอม 50/50',
    descEn:
      'Hand-carved white-and-gold Calacatta marble chest bordered in Roman-fluted pilasters—carrying Bright, Dark, and Events mineral crystal pairs with 1 sunlit loofah and 1 mango 50/50 candle.',
    descTh:
      'หีบหินอ่อนขาวคาลากัตตาเซาะร่องเสาโรมันฟลอเรนซ์—บรรจุคู่ไบรท์ · ดาร์ก · อีเวนต์ พร้อมบวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 กลิ่นมะม่วงซิตรัส',
    grooveDetailEn: 'Roman-Style Fluted Column Grooves & Florentine Gold Cameo',
    grooveDetailTh: 'ร่องเสาโรมันแกะสลักและจี้คามีโอทองคำฟลอเรนซ์',
    imageUrl: eraRenaissanceCoffretImg,
    priceThb: 4850,
    compareAtThb: 5650,
    includedPairIds: ['vault-08', 'vault-09', 'vault-11'],
  },
  {
    id: 'vault-marble-baroque',
    eraId: 'baroque',
    stoneType: 'dark-marble',
    victorianGroove: 'botanical-scroll',
    titleEn: 'Baroque Roman-Fluted Chiaroscuro Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนดำร่องเสาโรมันบาโรก · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CHAPTER III · BAROQUE · 1 LOOFAH + 1 CANDLE 50/50',
    themeLabelTh: 'บทที่ III · บาโรก · บวบ 1 + เทียนหอม 50/50',
    descEn:
      'Opulent dark marble coffret with Roman-fluted column sides—uniting Bright, Dark, and Events botanical pairs with 1 woven loofah and 1 matching 50/50 dark cacao-amber candle.',
    descTh:
      'หีบหินอ่อนดำร่องเสาโรมันสลักเถาบาโรกทองคำ—รวบรวมคู่ไบรท์ · ดาร์ก · อีเวนต์ พร้อมบวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 กลิ่นดาร์กโกโก้',
    grooveDetailEn: 'Roman Fluting & Baroque Gilded Acanthus Scrolls',
    grooveDetailTh: 'ร่องเสาโรมันและลายเถาบาโรกทองคำสลักนูน',
    imageUrl: eraBaroqueCoffretImg,
    priceThb: 5150,
    compareAtThb: 5950,
    includedPairIds: ['vault-14', 'vault-13', 'vault-16'],
  },
  {
    id: 'vault-marble-romanticism',
    eraId: 'romanticism',
    stoneType: 'bright-marble',
    victorianGroove: 'crown-filigree',
    titleEn: 'Romanticism Rose Roman Marble Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนชมพูร่องเสาโรมันโรแมนติก · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CHAPTER IV · ROMANTICISM · 1 LOOFAH + 1 CANDLE 50/50',
    themeLabelTh: 'บทที่ IV · โรแมนติก · บวบ 1 + เทียนหอม 50/50',
    descEn:
      'Warm rose-veined marble chest carved with Roman vertical grooves—holding Bright, Dark, and Events crystal pairs alongside 1 silk loofah and 1 matching 50/50 sunlit nectar candle.',
    descTh:
      'หีบหินอ่อนลายแร่ชมพูเซาะร่องเสาโรมันและริ้วโรสโกลด์—บรรจุคู่ไบรท์ · ดาร์ก · อีเวนต์ พร้อมบวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 เข้าคู่สีและกลิ่น',
    grooveDetailEn: 'Roman Column Fluting & Rose-Gold Floral Trim',
    grooveDetailTh: 'ร่องเสาโรมันแนวตั้งและลายพฤกษาโรสโกลด์',
    imageUrl: eraRomanticismCoffretImg,
    priceThb: 5050,
    compareAtThb: 5850,
    includedPairIds: ['vault-23', 'vault-19', 'vault-21'],
  },
  {
    id: 'vault-marble-checkered',
    eraId: 'enlightenment',
    stoneType: 'checkered-occasions',
    victorianGroove: 'lattice-cameo',
    titleEn: 'Enlightenment Checkered Roman Marble Coffret · 3 Bars + 3 Bombs',
    titleTh: 'หีบหินอ่อนลายหมากรุกร่องเสาโรมันยุคภูมิธรรม · สบู่ 3 ก้อน + บอมบ์ 3 ลูก',
    themeLabelEn: 'CHAPTER V · ENLIGHTENMENT · 1 LOOFAH + 1 CANDLE 50/50',
    themeLabelTh: 'บทที่ V · ภูมิธรรม · บวบ 1 + เทียนหอม 50/50',
    descEn:
      'Inlaid ivory-and-slate checkered marble chest in Roman-fluted stone trim—carrying Bright, Dark, and Events pairs with 1 honeyed loofah and 1 champagne rose 50/50 candle.',
    descTh:
      'หีบหินอ่อนลายหมากรุกงาช้างเซาะร่องเสาโรมันนีโอคลาสสิก—บรรจุคู่ไบรท์ · ดาร์ก · อีเวนต์ พร้อมบวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 กลิ่นแชมเปญกุหลาบ',
    grooveDetailEn: 'Roman Column Grooves & Neoclassical Cameo Carving',
    grooveDetailTh: 'ร่องเสาโรมันและจี้คามีโอนีโอคลาสสิกสลักมือ',
    imageUrl: eraEnlightenmentCoffretImg,
    priceThb: 5100,
    compareAtThb: 5900,
    includedPairIds: ['vault-27', 'vault-25', 'vault-28'],
  },
];
