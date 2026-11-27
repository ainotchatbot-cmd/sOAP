import candleBrightMangoImg from '../assets/images/candle_bright_mango_vitc_1795773094436.jpg';
import candleDarkChocoImg from '../assets/images/candle_dark_choco_amber_1795773094442.jpg';
import candleHolidayStrawberryImg from '../assets/images/candle_holiday_strawberry_champagne_1795773095794.jpg';
import marbleCaseCandleLoofahImg from '../assets/images/marble_case_candle_loofah_suite_1795773096860.jpg';
import type { SoapLineKey } from './palette';

export interface AromaticCandlePair {
  id: string;
  line: SoapLineKey;
  nameEn: string;
  nameTh: string;
  splitSpecEn: string;
  splitSpecTh: string;
  aromaEn: string;
  aromaTh: string;
  accentHex: string;
  gelTintHex: string;
  creamTintHex: string;
  burnHours: number;
  imageUrl: string;
}

export const MARBLE_CASE_SUITE_IMAGE_URL = marbleCaseCandleLoofahImg;

export const AROMATIC_CANDLE_BY_LINE: Record<SoapLineKey, AromaticCandlePair> = {
  bright: {
    id: 'candle-bright-5050',
    line: 'bright',
    nameEn: 'Sunlit Mango & Citrus 50/50 Candle',
    nameTh: 'เทียนหอม 50/50 มะม่วงสุกและซิตรัสทองคำ',
    splitSpecEn: '50% Clear Mango Gel Wax · 50% Fluted Ivory Soy · 24k Gold Leaf',
    splitSpecTh: 'เจลใสมะม่วง 50% · ไขถั่วเหลืองแกะร่อง 50% · ทองคำเปลว 24K',
    aromaEn: 'Sunlit Alphonso Mango, White Neroli & Warm Linen',
    aromaTh: 'มะม่วงอัลฟองโซ ส้มเนโรลี และลินินยามเช้า',
    accentHex: '#D97B29',
    gelTintHex: '#F3B65B',
    creamTintHex: '#FAF3E6',
    burnHours: 48,
    imageUrl: candleBrightMangoImg,
  },
  dark: {
    id: 'candle-dark-5050',
    line: 'dark',
    nameEn: 'Velvet Cacao & Amber 50/50 Candle',
    nameTh: 'เทียนหอม 50/50 ดาร์กโกโก้และอำพันสนธยา',
    splitSpecEn: '50% Smoky Amber Gel Wax · 50% Carved Dark Cacao Soy · 24k Rose Gold',
    splitSpecTh: 'เจลใสอำพัน 50% · ไขถั่วเหลืองดาร์กโกโก้ 50% · โรสโกลด์ 24K',
    aromaEn: 'Roasted Criollo Cacao, Sea Kelp Musk & Warm Vanilla Resin',
    aromaTh: 'โกโก้คั่วเข้ม มัสก์ทะเลลึก และวานิลลาเรซิน',
    accentHex: '#9E2434',
    gelTintHex: '#7A4C2C',
    creamTintHex: '#2F1F1B',
    burnHours: 52,
    imageUrl: candleDarkChocoImg,
  },
  holiday: {
    id: 'candle-holiday-5050',
    line: 'holiday',
    nameEn: 'Champagne Strawberry & Rose 50/50 Candle',
    nameTh: 'เทียนหอม 50/50 สตรอว์เบอร์รีแชมเปญและกุหลาบ',
    splitSpecEn: '50% Rose-Quartz Clear Gel · 50% Sunburst Cream Soy · 24k Gold Leaf',
    splitSpecTh: 'เจลใสโรสควอตซ์ 50% · ไขถั่วเหลืองลายรัศมี 50% · ทองคำเปลว 24K',
    aromaEn: 'Sparkling Brut Champagne, Garnet Berry & Damask Petal',
    aromaTh: 'แชมเปญเย็น สตรอว์เบอร์รีการ์เนต และกลีบกุหลาบดามัสก์',
    accentHex: '#D45779',
    gelTintHex: '#E58AA0',
    creamTintHex: '#FCECF0',
    burnHours: 50,
    imageUrl: candleHolidayStrawberryImg,
  },
};

export function getMatchingCandleForLine(
  line: SoapLineKey | 'dark-marble' | 'bright-marble' | 'checkered-occasions',
): AromaticCandlePair {
  if (line === 'dark' || line === 'dark-marble') return AROMATIC_CANDLE_BY_LINE.dark;
  if (line === 'holiday' || line === 'checkered-occasions') return AROMATIC_CANDLE_BY_LINE.holiday;
  return AROMATIC_CANDLE_BY_LINE.bright;
}
