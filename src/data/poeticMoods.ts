// Pure Emotion, Poetry & Sensory Ritual Whispers for Card Frontstages
// Keeps clinical compounds, vitamin potencies, and chemical ratios tucked inside
// Vintage Parchment Tickets & Apothecary Ledgers below.

import { SoapCreation } from './soaps';
import { BathBombCreation } from './bathBombs';

export interface BilingualWhisper {
  en: string;
  th: string;
}

const BATH_BOMB_POETIC_MOODS: Record<string, BilingualWhisper> = {
  'bb-dark-red-wine': {
    en: 'Velvet candlelight, aged cellar dusk & rosewood warmth',
    th: 'แสงเทียนกำมะหยี่ กลิ่นไวน์วินเทจ และความอบอุ่นยามค่ำคืน',
  },
  'bb-dark-garlic-ginseng': {
    en: 'Earthy forest steam, toasted roots & quiet fireside rest',
    th: 'ไออุ่นจากผืนป่า รากไม้หอมละมุน และความสงบข้างเตาผิง',
  },
  'bb-dark-black-salt': {
    en: 'Warm dusk mineral mist & tranquil stone-spring stillness',
    th: 'ละอองน้ำแร่ยามสนธยาและความเงียบสงบดุจบ่อน้ำศิลา',
  },
  'bb-dark-purple-yam': {
    en: 'Velvet twilight cream & warm hearthstone sweetness',
    th: 'ครีมอุ่นสีม่วงพลัมยามสนธยาและสัมผัสละมุนชวนฝัน',
  },
  'bb-dark-espresso-matcha': {
    en: 'Midnight tea house, roasted bean warmth & silk shadow',
    th: 'โรงน้ำชายามเที่ยงคืน กลิ่นกาแฟคั่วหอมกรุ่น และเงาแพรไหม',
  },
  'bb-dark-shiitake-konjac': {
    en: 'Rain-washed woodland mist & plush cloud-soft embrace',
    th: 'ไอหมอกหลังฝนในป่าลึกและสัมผัสนุ่มเด้งดุจปุยเมฆ',
  },
  'bb-dark-sea-kelp': {
    en: 'Midnight ocean tide, cool sea breeze & velvet lagoon hush',
    th: 'เกลียวคลื่นทะเลราตรี สายลมเย็น และความสงบแห่งลากูนลึก',
  },
  'bb-dark-pomegranate-plum': {
    en: 'Crimson orchard twilight & crushed jewel-fruit romance',
    th: 'สวนผลไม้ยามค่ำคืนและความเย้ายวนแห่งทับทิมสีแดงก่ำ',
  },
  'bb-dark-cacao-banana': {
    en: 'Warm praline silk, golden dusk & unhurried indulgence',
    th: 'ความหวานละมุนแห่งโกโก้อุ่นและแสงทองยามเย็น',
  },
  'bb-dark-vetiver-epsom': {
    en: 'Cool vetiver shadow, deep shoulder release & night stillness',
    th: 'กลิ่นรากแฝกหอมเย็นลึก คลายความเหนื่อยล้าสู่ค่ำคืนอันเงียบสงบ',
  },
  'bb-bright-white-wine': {
    en: 'Chilled vineyard breeze, orchard pear & sunlit porcelain',
    th: 'สายลมไร่องุ่นยามเช้า กลิ่นแพร์สดใส และผิวละมุนดุจพอร์ซเลน',
  },
  'bb-bright-camel-milk': {
    en: 'Warm desert cream cloud & whispered vanilla bean silk',
    th: 'ม่านเมฆน้ำนมอุ่นนุ่มและวานิลลาหอมละมุนราวความฝัน',
  },
  'bb-bright-goat-milk': {
    en: 'Fresh morning meadow silk & tender porcelain calm',
    th: 'ความอ่อนโยนของน้ำนมยามเช้าและสัมผัสเนียนนุ่มดุจผ้าไหม',
  },
  'bb-bright-matcha-spirulina': {
    en: 'Sunlit Kyoto tea garden & dewy jade-morning air',
    th: 'สวนชาเขียวต้องแสงแดดอ่อนและอากาศบริสุทธิ์ยามรุ่งอรุณ',
  },
  'bb-bright-sea-kelp-aqua': {
    en: 'Crystalline cerulean tide & sunlit coastal pearl breeze',
    th: 'สายน้ำทะเลสีฟ้าใสและประกายไข่มุกต้องแสงตะวัน',
  },
  'bb-bright-epsom-pink-salt': {
    en: 'Blush rose-quartz mist & luminous spa-morning ease',
    th: 'ม่านหมอกควอตซ์สีชมพูระเรื่อและความผ่อนคลายยามเช้า',
  },
  'bb-bright-konjac-tremella': {
    en: 'Translucent dewdrop veil & weightless petal silk',
    th: 'ม่านน้ำค้างใสบริสุทธิ์และสัมผัสกลีบดอกไม้อันบางเบา',
  },
  'bb-bright-banana-yam': {
    en: 'Golden sunlit custard warmth & barefoot summer serenity',
    th: 'ความอบอุ่นสีทองละมุนดุจแสงแดดฤดูร้อนอันแสนสงบ',
  },
  'bb-bright-white-ginseng': {
    en: 'Honeyed morning mist, porcelain light & quiet vitality',
    th: 'หมอกน้ำผึ้งยามเช้า แสงพอร์ซเลน และความเปล่งปลั่งจากภายใน',
  },
  'bb-bright-rice-vitamin': {
    en: 'Soft jasmine-steam sanctuary & heirloom silk softness',
    th: 'ไอน้ำข้าวหอมมะลินุ่มละมุนและความอ่อนโยนประดุจแพรไหม',
  },
  'bb-holiday-halloween-yam': {
    en: 'Spiced autumn hearth, amber lantern glow & velvet dusk',
    th: 'แสงตะเกียงอำพันในค่ำคืนฤดูใบไม้ร่วงและกลิ่นเครื่องเทศอุ่น',
  },
  'bb-holiday-christmas-wine': {
    en: 'Winter evergreen cabin, spiced mulled glow & snow-quiet bliss',
    th: 'กระท่อมสนฤดูหนาว ไออุ่นไวน์เครื่องเทศ และความสุขในคืนหิมะโปรย',
  },
  'bb-holiday-coronation-gold': {
    en: 'Royal jasmine garland, sunlit marigold & gilded ceremony',
    th: 'พวงมาลัยมะลิหลวง แสงดอกดาวเรือง และความสง่างามแห่งทองคำ',
  },
  'bb-holiday-songkran-kelp': {
    en: 'Cool silver bowl water, summer jasmine & joyful freshness',
    th: 'น้ำอบมะลิเย็นฉ่ำในขันเงินและความเบิกบานแห่งฤดูร้อน',
  },
  'bb-holiday-loy-krathong': {
    en: 'Candlelit river lotus ripples & whispered midnight wish',
    th: 'แสงประทีปกลีบบัวกลางสายน้ำและคำอธิษฐานยามเที่ยงคืน',
  },
  'bb-holiday-lunar-mandarin': {
    en: 'Auspicious crimson orchard, lantern warmth & sunlit fortune',
    th: 'สวนส้มมงคลสีชาด แสงโคมไฟอุ่น และความเบิกบานรับปีใหม่',
  },
  'bb-holiday-valentine-rose': {
    en: 'Blush Damascus petals, champagne whisper & tender romance',
    th: 'กลีบกุหลาบดามัสก์สีชมพูระเรื่อและมนต์เสน่ห์แห่งความรัก',
  },
  'bb-holiday-solstice-opal': {
    en: 'Midnight amethyst lagoon & starlit winter solstice dream',
    th: 'ลากูนอเมทิสต์ใต้แสงดาวและความฝันแห่งค่ำคืนเหมายัน',
  },
  'bb-holiday-harvest-honey': {
    en: 'Golden meadow harvest, toasted cream & wildflower honey',
    th: 'ทุ่งรวงทองยามเก็บเกี่ยว ครีมอุ่น และน้ำผึ้งดอกไม้ป่า',
  },
  'bb-holiday-gala-elixir': {
    en: 'Grand soirée velvet rose-gold shimmer & midnight celebration',
    th: 'ค่ำคืนงานเลี้ยงหรูหรา ประกายโรสโกลด์ และช่วงเวลาแห่งการเฉลิมฉลอง',
  },
};

const SOAP_POETIC_OVERRIDES: Record<string, BilingualWhisper> = {
  'dark-sulfur-salicylic': {
    en: 'Warm golden amber stillness & dusk botanical clarity',
    th: 'แสงอำพันยามสนธยาและความบริสุทธิ์อันเงียบสงบ',
  },
  'bright-spirulina-hyaluronic': {
    en: 'Sunlit azure lagoon mist & weightless oceanic silk',
    th: 'ม่านหมอกลากูนสีฟ้าครามและความนุ่มเบาแห่งท้องทะเล',
  },
  'bright-squalane-lecithin': {
    en: 'Pure spun cotton cloud & quiet morning milk hush',
    th: 'ปุยเมฆฝ้ายขาวบริสุทธิ์และความอ่อนโยนยามรุ่งอรุณ',
  },
  'bright-piroctone-purifying': {
    en: 'Cool sea-glass breeze & luminous coastal dawn',
    th: 'สายลมทะเลสีอควาเย็นฉ่ำและแสงรุ่งอรุณริมชายฝั่ง',
  },
};

export function getPoeticSoapMood(soap: SoapCreation, lang: 'th' | 'en', fallbackMood: string): string {
  const override = SOAP_POETIC_OVERRIDES[soap.id];
  if (override) return lang === 'th' ? override.th : override.en;
  return fallbackMood;
}

export function getPoeticBombMood(bomb: BathBombCreation, lang: 'th' | 'en'): string {
  const mapped = BATH_BOMB_POETIC_MOODS[bomb.id];
  if (mapped) return lang === 'th' ? mapped.th : mapped.en;
  return lang === 'th' ? bomb.soakMoodTh : bomb.soakMoodEn;
}
