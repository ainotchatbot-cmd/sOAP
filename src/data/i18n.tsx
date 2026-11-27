import React, {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DreamPresetId } from './palette';
import { LuxuryInlayType, MarbleCassetteEdition, SoapCreation } from './soaps';
import { PackagingMarkerId } from '../components/PackagingSymbols';

export type AppLanguage = 'th' | 'en';

const LANG_STORAGE_KEY = 'gentle_bubble_lang_v1';

export interface LocalizedSoapCopy {
  name: string;
  themeLabel: string;
  scentMood: string;
  crystalTitle: string;
  creamTitle: string;
}

export const SOAP_THAI_COPY: Record<string, LocalizedSoapCopy> = {
  // DARK LINE (10)
  'dark-espresso-noir': {
    name: 'เอสเปรสโซ่คั่วและช็อกโกแลตบีน',
    themeLabel: 'น้ำตาลเอสเปรสโซ่ · กาแฟและโกโก้',
    scentMood: 'คาปูชิโน่และเมล็ดโกโก้คั่ว',
    crystalTitle: 'เจลเมล็ดกาแฟเอสเปรสโซ่',
    creamTitle: 'ครีมฟองคาปูชิโน่บัตเตอร์',
  },
  'dark-pomegranate-ruby': {
    name: 'ทับทิมแดงออร์แกนิกและโรสฮิป',
    themeLabel: 'แดงทับทิม · ผลไม้สีแดง',
    scentMood: 'ทับทิมสไปซ์และโรสฮิป',
    crystalTitle: 'เจลใสน้ำทับทิมสกัดเย็น',
    creamTitle: 'ครีมเมล็ดทับทิมกำมะหยี่',
  },
  'dark-cacao-crema': {
    name: 'กาแฟโกโก้และครีมโอ๊ตลาเต้',
    themeLabel: 'น้ำตาลโกโก้ · กาแฟและโอ๊ต',
    scentMood: 'โกโก้ทอฟฟี่และโอ๊ตลาเต้',
    crystalTitle: 'คริสตัลโกโก้คั่วเข้ม',
    creamTitle: 'ครีมซาเบล่ข้าวโอ๊ตคั่ว',
  },
  'dark-sambuca-roast': {
    name: 'บราซิลเลียนซัมบูก้าและโป๊ยกั๊ก',
    themeLabel: 'แดงบอร์โดซ์ · โป๊ยกั๊กและวานิลลา',
    scentMood: 'ซัมบูก้าและวานิลลาบีน',
    crystalTitle: 'เจลโป๊ยกั๊กบอร์โดซ์',
    creamTitle: 'ครีมบัตเตอร์เมล็ดวานิลลา',
  },
  'dark-avocado-sesame': {
    name: 'มัทฉะเข้มและงาดำบดเย็น',
    themeLabel: 'เขียวเข้มและชาร์โคล · ชาและงา',
    scentMood: 'ใบมัทฉะและงาดำคั่ว',
    crystalTitle: 'เจลชาเขียวมัทฉะออร์แกนิก',
    creamTitle: 'ครีมบัตเตอร์งาดำสกัดเย็น',
  },
  'dark-chai-quartz': {
    name: 'ชาแดงสไปซ์และควอตซ์กำมะหยี่',
    themeLabel: 'ม่วงพลัมและงาช้าง · ชาและทอง 24K',
    scentMood: 'ชาชัยสไปซ์และกำยานสยาม',
    crystalTitle: 'เจลชาแดงและกระวาน',
    creamTitle: 'ครีมอัลมอนด์บิสกิตเนียนนุ่ม',
  },
  'dark-charcoal-oolong': {
    name: 'อู่หลงลำไยรมควันและถ่านไม้ไผ่',
    themeLabel: 'อำพันและชาร์โคล · ชาและถ่าน',
    scentMood: 'ชาอู่หลงคั่วและลำไยอบแห้ง',
    crystalTitle: 'เจลลำไยสีทองและชาอู่หลง',
    creamTitle: 'ครีมโกโก้ถ่านไม้ไผ่',
  },
  'dark-volcanic-scrub': {
    name: 'สครับหินภูเขาไฟและข้าวโอ๊ตน้ำผึ้ง',
    themeLabel: 'ชาร์โคลแกรนิต · สครับน้ำผึ้ง',
    scentMood: 'ข้าวโอ๊ตคั่วและน้ำผึ้งป่า',
    crystalTitle: 'สครับแร่หินภูเขาไฟบดละเอียด',
    creamTitle: 'ครีมเชียบัตเตอร์ผสมน้ำผึ้ง',
  },
  'dark-sulfur-salicylic': {
    name: 'ซัลเฟอร์และกรดซาลิไซลิก กระชับรูขุมขน',
    themeLabel: 'เหลืองนวลและเจลอำพัน · สูตร 50/50',
    scentMood: 'อำพันบริสุทธิ์และสมุนไพรสะอาด',
    crystalTitle: 'เจลใสซาลิไซลิก (BHA 2.0%)',
    creamTitle: 'เบสซัลเฟอร์สกัดบริสุทธิ์ 3.0%',
  },
  'dark-vetiver-obsidian': {
    name: 'แฝกหอมสีนิลและควอตซ์รมควัน',
    themeLabel: 'ดำออบซิเดียนและม่วงควัน',
    scentMood: 'รากแฝกหอมและอำพันดำ',
    crystalTitle: 'เจลคริสตัลควอตซ์สีม่วงควัน',
    creamTitle: 'ครีมถ่านไม้ไผ่และงาดำ',
  },

  // BRIGHT LINE (10)
  'bright-coconut-pearl': {
    name: 'น้ำนมมะพร้าวไทยและทองคำ 24K',
    themeLabel: 'ขาวงาช้างบริสุทธิ์ · มะพร้าว 10%',
    scentMood: 'ครีมน้ำนมมะพร้าวบริสุทธิ์',
    crystalTitle: 'เจลน้ำมะพร้าวใสประกายทอง',
    creamTitle: 'ครีมน้ำนมมะพร้าวขาวนวล',
  },
  'bright-avocado-matcha': {
    name: 'อะโวคาโดเขียวและน้ำค้างใบชา',
    themeLabel: 'เขียวสด · อะโวคาโดออร์แกนิก',
    scentMood: 'ใบไม้บดสดและครีมอะโวคาโด',
    crystalTitle: 'เจลใบชาเขียวมรกต',
    creamTitle: 'ครีมบัตเตอร์อะโวคาโดสกัดเย็น',
  },
  'bright-sable-honey': {
    name: 'บัตเตอร์ซาเบล่และรวงผึ้งป่า',
    themeLabel: 'ทองบิสกิต · เนยและน้ำผึ้ง',
    scentMood: 'บิสกิตซาเบล่และน้ำผึ้งดอกไม้ป่า',
    crystalTitle: 'เจลน้ำผึ้งรวงทอง',
    creamTitle: 'ครีมซาเบล่ข้าวโอ๊ตเนยสด',
  },
  'bright-anchan-sable': {
    name: 'อัญชันฟ้าครามและครีมคุกกี้',
    themeLabel: 'ฟ้าสดใสและทอง · อัญชันและซาเบล่',
    scentMood: 'ดอกอัญชันและคุกกี้เนยทอง',
    crystalTitle: 'เจลอัญชันสีฟ้าคราม',
    creamTitle: 'ครีมคุกกี้เนยสีทอง',
  },
  'bright-pomegranate-rose': {
    name: 'ทับทิมชมพูและนมกุหลาบดามัสก์',
    themeLabel: 'ชมพูโรส · ทับทิมและกุหลาบ',
    scentMood: 'ทับทิมชมพูและนมกุหลาบสด',
    crystalTitle: 'เจลเมล็ดทับทิมและกุหลาบ',
    creamTitle: 'ครีมบัตเตอร์นมกุหลาบชมพู',
  },
  'bright-moonmilk-pearl': {
    name: 'มูนมิลค์โรสโกลด์และลาเวนเดอร์',
    themeLabel: 'ม่วงพาสเทลและขาว · ไนอะซินาไมด์ 4%',
    scentMood: 'มูนมิลค์ลาเวนเดอร์และน้ำผึ้ง',
    crystalTitle: 'เจลใสประกายทองโรสโกลด์',
    creamTitle: 'ครีมนมหมุนวนกลิ่นลาเวนเดอร์',
  },
  'bright-tiffany-mint': {
    name: 'ทิฟฟานี่มินต์และเชียบัตเตอร์',
    themeLabel: 'ฟ้าอควาและครีม · มินต์และเชีย',
    scentMood: 'สเปียร์มินต์เย็นและครีมเชีย',
    crystalTitle: 'เจลใบมินต์เย็นสดชื่น',
    creamTitle: 'ครีมเชียบัตเตอร์ขาวบริสุทธิ์',
  },
  'bright-spirulina-hyaluronic': {
    name: 'สไปรูลิน่าฟ้า ไฮยาลูรอนิค และเรตินอล',
    themeLabel: 'ฟ้าทึบครึ่ง · เจลใสสีฟ้าครึ่ง',
    scentMood: 'เนโรลีทะเลและละอองน้ำสีฟ้า',
    crystalTitle: 'เจลสไปรูลิน่าฟ้าและไฮยาลูรอนิค',
    creamTitle: 'ครีมสไปรูลิน่าฟ้าและเรตินอล',
  },
  'bright-squalane-lecithin': {
    name: 'สควาเลนและเลซิติน ฟื้นฟูเกราะผิว',
    themeLabel: 'ครีมงาช้างและเจลฝ้า · pH 5.5',
    scentMood: 'น้ำนมบริสุทธิ์และฝ้ายอ่อนโยน',
    crystalTitle: 'เจลกระจกฝ้ากักเก็บความชุ่มชื้น',
    creamTitle: 'ครีมสควาเลนมะกอกและเลซิติน',
  },
  'bright-piroctone-purifying': {
    name: 'ไพรอกโทน โอลามีน สูตรคุมสิวอ่อนโยน',
    themeLabel: 'ฟ้าซีโฟมและเจลอควา · สูตร 50/50',
    scentMood: 'ละอองน้ำอควาและฟองทะเลสด',
    crystalTitle: 'เจลใสอควาโพรเพนไดออล',
    creamTitle: 'ครีมฟ้าซีโฟมไพรอกโทน 0.8%',
  },

  // OCCASIONS / HOLIDAYS LINE (10)
  'holiday-halloween-nocturne': {
    name: 'ฮาโลวีนส้มสไปซ์และงาดำเข้ม',
    themeLabel: 'เทศกาลฮาโลวีน',
    scentMood: 'ส้มแมนดารินสไปซ์และงาดำคั่ว',
    crystalTitle: 'เจลฟักทองสีส้มอำพัน',
    creamTitle: 'ครีมงาดำคั่วและถ่านไม้ไผ่',
  },
  'holiday-christmas-evergreen': {
    name: 'คริสต์มาสสนเขียวและแครนเบอร์รี่แดง',
    themeLabel: 'เทศกาลคริสต์มาส',
    scentMood: 'ใบสนฤดูหนาวและแครนเบอร์รี่',
    crystalTitle: 'เจลใบสนมรกตสดชื่น',
    creamTitle: 'ครีมแครนเบอร์รี่และทับทิมแดง',
  },
  'holiday-coronation-royal': {
    name: 'วันฉัตรมงคล หญ้าฝรั่นและแกนทองคำ',
    themeLabel: 'วันฉัตรมงคล (รุ่นพิเศษไทย)',
    scentMood: 'หญ้าฝรั่น ดาวเรือง และน้ำผึ้ง',
    crystalTitle: 'แกนเจลทองคำคาโมมายล์',
    creamTitle: 'ครีมขมิ้นชันและดอกดาวเรือง',
  },
  'holiday-songkran-water': {
    name: 'สงกรานต์น้ำอบฟ้าใสและนมมะลิขาว',
    themeLabel: 'เทศกาลสงกรานต์ไทย',
    scentMood: 'มะลิเย็นฉ่ำและน้ำอบไทย',
    crystalTitle: 'เจลน้ำอบฟ้าและดอกมะลิซ้อน',
    creamTitle: 'ครีมน้ำนมข้าวมะลิขาว',
  },
  'holiday-loy-krathong': {
    name: 'ลอยกระทงทองคำเปลวและใบเตยดอกบัว',
    themeLabel: 'เทศกาลลอยกระทง',
    scentMood: 'ใบเตยหอมและน้ำผึ้งแสงเทียน',
    crystalTitle: 'เจลน้ำผึ้งทองคำเปลว',
    creamTitle: 'ครีมใบเตยหอมและเกสรบัวหลวง',
  },
  'holiday-lunar-new-year': {
    name: 'ตรุษจีนส้มแมนดารินแดงและทองคำ 24K',
    themeLabel: 'เทศกาลตรุษจีนมงคล · วิตามินซี 4%',
    scentMood: 'ส้มแมนดารินหวานและครีมไหมนุ่ม',
    crystalTitle: 'เจลแดงชาดส้มแมนดาริน',
    creamTitle: 'ครีมมะพร้าวและทองคำ 24K นำโชค',
  },
  'holiday-valentine-rose': {
    name: 'วาเลนไทน์กุหลาบดามัสก์และนมอัลมอนด์',
    themeLabel: 'เทศกาลแห่งความรัก',
    scentMood: 'กุหลาบดามัสก์และสวีทอัลมอนด์',
    crystalTitle: 'เจลกลีบกุหลาบดามัสก์',
    creamTitle: 'ครีมนมอัลมอนด์สีชมพู',
  },
  'holiday-stardust-wish': {
    name: 'ทไวไลท์สตาร์ดัสต์ ละอองดาวราตรี',
    themeLabel: 'รุ่นพิเศษประกายดวงดาว',
    scentMood: 'ลาเวนเดอร์แสงดาวและครีมหวาน',
    crystalTitle: 'เจลม่วงครามโปรยละอองดาวทอง',
    creamTitle: 'ครีมมูนมิลค์คาโมมายล์',
  },
  'holiday-golden-oatmeal-honey': {
    name: 'ข้าวโอ๊ตสีทองและน้ำผึ้งแท้ ปลอบประโลมผิว',
    themeLabel: 'รุ่นพิเศษเก็บเกี่ยวสมุนไพร',
    scentMood: 'น้ำผึ้งดอกไม้ป่าและข้าวโอ๊ตอบ',
    crystalTitle: 'เจลน้ำผึ้งแท้และเกล็ดข้าวโอ๊ต',
    creamTitle: 'ครีมข้าวโอ๊ตคอลลอยด์ 3.0%',
  },
  'holiday-champagne-opal': {
    name: 'ประกายทองแชมเปญ ชิมเมอร์ 24K',
    themeLabel: 'รุ่นพิเศษฉลองปีใหม่',
    scentMood: 'ดอกแพร์แชมเปญและอำพันขาว',
    crystalTitle: 'เจลริบบิ้นประกายทองแชมเปญ',
    creamTitle: 'ครีมงาช้างและทองคำ 24K เนียนนุ่ม',
  },

  // LUXURY FRUIT DUOS & DEAD SEA KELP LINE (6)
  'duo-mangifera-lumina': {
    name: 'แมงกิเฟอรา ลูมินา · มะม่วงอัลฟองโซ (GB·C)',
    themeLabel: 'ไบรท์ดูโอ · วิตามินซี 5.0%',
    scentMood: 'มะม่วงอัลฟองโซสุกฉ่ำและซาเบล่ข้าวมะลิ',
    crystalTitle: 'เจลใสสีมะม่วงอัลฟองโซ',
    creamTitle: 'ครีมซาเบล่ข้าวมะลิทึบแสง',
  },
  'duo-fragaria-alba': {
    name: 'ฟราการ์เรีย อัลบา · สตรอว์เบอร์รี่มารา (GB·K)',
    themeLabel: 'ไบรท์ดูโอ · โคจิกและวิตามินซี',
    scentMood: 'สตรอว์เบอร์รี่ฝรั่งเศสและครีมอัลมอนด์',
    crystalTitle: 'เจลใสสตรอว์เบอร์รี่สีชมพู',
    creamTitle: 'ครีมซาเบล่อัลมอนด์นุ่มนวล',
  },
  'duo-abyssal-maris': {
    name: 'อะบิสซัล มาริส · โคลนเดดซี สาหร่ายและดาร์กช็อกโก (GB·M)',
    themeLabel: 'ดาร์กดูโอ · โคลนเดดซีและช็อกโกแลต 85%',
    scentMood: 'สาหร่ายทะเลเดดซี เกลือแร่ และดาร์กช็อกโกแลต',
    crystalTitle: 'เจลลี่โปร่งแสงสีน้ำตาลโคลนเดดซีและสาหร่าย',
    creamTitle: 'ซาเบล่ดาร์กช็อกโกแลต 85%',
  },
  'duo-nocturne-fragaria': {
    name: 'น็อกเทิร์น ฟราการ์เรีย · สตรอว์เบอร์รี่สีโกเมน (GB·S)',
    themeLabel: 'ดาร์กดูโอ · กรดซาลิไซลิก 2.0%',
    scentMood: 'สตรอว์เบอร์รี่เข้มและโกโก้ออบซิเดียน',
    crystalTitle: 'เจลใสสตรอว์เบอร์รี่สีโกเมน BHA',
    creamTitle: 'ครีมซาเบล่โกโก้ออบซิเดียน',
  },
  'duo-solstice-citrus-berry': {
    name: 'โซลสติซ รีเสิร์ฟ · มะม่วงสตรอว์เบอร์รี่ (GB·CS)',
    themeLabel: 'ฮอลิเดย์ดูโอ · วิตามินซี + BHA',
    scentMood: 'มะม่วงอัลฟองโซ สตรอว์เบอร์รี่ และแชมเปญ',
    crystalTitle: 'เจลใสมะม่วงผสานสตรอว์เบอร์รี่',
    creamTitle: 'ซาเบล่แชมเปญและข้าวโอ๊ตทองคำ',
  },
  'duo-equinox-sargassum': {
    name: 'อิควินอกซ์ ซาร์กัสซัม · โคลนเดดซีและโกโก้ส้ม (GB·MS)',
    themeLabel: 'ฮอลิเดย์ดูโอ · โคลนเดดซี + ส้มดาร์กช็อกโก',
    scentMood: 'ส้มแมนดาริน สาหร่ายเคลป์ และดาร์กโกโก้',
    crystalTitle: 'เจลใสโคลนเดดซีสีน้ำตาลอำพัน',
    creamTitle: 'ซาเบล่ดาร์กช็อกโกแลตและส้มมงคล',
  },
};

export const INGREDIENT_TH: Record<string, string> = {
  'Salicylic Acid (BHA)': 'กรดซาลิไซลิก (BHA)',
  'Precipitated Sulfur': 'ซัลเฟอร์บริสุทธิ์',
  'Soap-Free Syndet Base': 'เบสซินเดตไร้สบู่',
  Propanediol: 'โพรเพนไดออล',
  'Vegetable Glycerin': 'กลีเซอรีนจากพืช',
  Preservative: 'สารกันเสียอ่อนโยน',
  'Olive Squalane': 'สควาเลนจากมะกอก',
  'Soy/Sunflower Lecithin': 'เลซิตินจากถั่วเหลืองและทานตะวัน',
  'Vitamin E': 'วิตามินอี',
  'Sodium Lactate': 'โซเดียมแลคเตต',
  'Piroctone Olamine': 'ไพรอกโทน โอลามีน',
  'Raw Honey': 'น้ำผึ้งแท้บริสุทธิ์',
  'Rolled Oats': 'เกล็ดข้าวโอ๊ตเต็มใบ',
  'Colloidal Oatmeal': 'ข้าวโอ๊ตคอลลอยด์',
  'Jojoba Oil': 'น้ำมันโจโจ้บา',
  'Suspension Glycerin Base': 'เบสกลีเซอรีนพยุงอนุภาค',
  'Roasted Espresso Bean': 'เมล็ดกาแฟเอสเปรสโซ่คั่ว',
  'Raw Cacao Polyphenols': 'โพลีฟีนอลโกโก้ดิบ',
  'Chelated Magnesium': 'แมกนีเซียมคีเลต',
  'Oat Lipid': 'ลิพิดจากข้าวโอ๊ต',
  'Pomegranate Seed Oil': 'น้ำมันเมล็ดทับทิม',
  'Hibiscus Fruit Acids': 'กรดผลไม้ดอกชบา',
  'Rosehip Lycopene': 'ไลโคปีนจากโรสฮิป',
  'Vitamin C': 'วิตามินซี',
  'Coffee Bean Extract': 'สารสกัดเมล็ดกาแฟ',
  'Oat Beta-Glucan': 'เบต้ากลูแคนข้าวโอ๊ต',
  'Cacao Sterols': 'สเตอรอลจากโกโก้',
  'Star Anise Extract': 'สารสกัดโป๊ยกั๊ก',
  'Brazilian Coffee Oil': 'น้ำมันกาแฟบราซิล',
  'Vanilla Vanillin': 'วานิลลินธรรมชาติ',
  'Shea Butter': 'เชียบัตเตอร์',
  'Green Tea EGCG': 'สารต้านอนุมูลอิสระ EGCG ชาเขียว',
  'Cold-Pressed Sesame': 'น้ำมันงาดำสกัดเย็น',
  Chlorophyll: 'คลอโรฟิลล์ธรรมชาติ',
  'Avocado Phytosterols': 'ไฟโตสเตอรอลอะโวคาโด',
  'Assam Chai Extract': 'สารสกัดชาแดงอัสสัม',
  'Sweet Almond Milk': 'น้ำนมสวีทอัลมอนด์',
  'Siam Benzoin': 'กำยานสยามแท้',
  'Collagen I + II': 'คอลลาเจน ชนิด I + II',
  'Roasted Oolong Leaf': 'ใบชาอู่หลงคั่ว',
  'Smoked Longan Nectar': 'น้ำหวานลำไยรมควัน',
  'Bamboo Charcoal': 'ถ่านไม้ไผ่ญี่ปุ่น',
  'Red Ginseng': 'รากโสมแดง',
  'Volcanic Pumice': 'แร่หินภูเขาไฟบดละเอียด',
  'Rolled Oat Bran': 'รำข้าวโอ๊ตอบ',
  'Wildflower Honey': 'น้ำผึ้งดอกไม้ป่า',
  'Binchotan Carbon': 'ถ่านบินโชตันบริสุทธิ์',
  'Vetiver Distillate': 'น้ำกลั่นรากแฝกหอม',
  'Black Sesame': 'งาดำคั่วบดเย็น',
  'Virgin Coconut Oil': 'น้ำมันมะพร้าวบริสุทธิ์สกัดเย็น',
  'Fresh Coconut Milk': 'น้ำนมมะพร้าวสด',
  'Pearl Conchiolin': 'ไหมอะมิโนน้ำนมธรรมชาติ',
  'Panthenol B5': 'แพนทีนอล B5',
  'Unrefined Avocado Oil': 'น้ำมันอะโวคาโดไม่ขัดสี',
  'Botanical Chlorophyll': 'คลอโรฟิลล์พฤกษศาสตร์',
  'Raw Comb Honey': 'น้ำผึ้งรวงดิบ',
  'Toasted Oat Crumble': 'ข้าวโอ๊ตคั่วบด',
  'Sweet Butter Lipid': 'ลิพิดเนยสดฝรั่งเศส',
  'Provitamin A': 'โปรวิตามินเอ',
  'Clitoria Ternatea Anchan': 'ดอกอัญชันสยาม',
  'Blue Spirulina': 'สไปรูลิน่าสีฟ้า',
  'Golden Oat Butter': 'บัตเตอร์ข้าวโอ๊ตสีทอง',
  'Marine Mg': 'แมกนีเซียมจากทะเลลึก',
  'Pink Pomegranate Juice': 'น้ำทับทิมชมพูสกัด',
  'Damask Rosewater': 'น้ำกุหลาบดามัสก์',
  'Vitamin C + E': 'วิตามินซี + อี',
  'Rosehip Butter': 'บัตเตอร์โรสฮิป',
  'Provence Lavender': 'ลาเวนเดอร์โปรวองซ์',
  'Coconut Milk Lipids': 'ลิพิดน้ำนมมะพร้าว',
  'Fresh Spearmint Leaf': 'ใบสเปียร์มินต์สด',
  'Unrefined Shea Lipid': 'เชียบัตเตอร์บริสุทธิ์',
  'Marine Magnesium': 'แร่แมกนีเซียมทะเล',
  'Blue Spirulina Extract': 'สารสกัดสไปรูลิน่าสีฟ้า',
  'Multi-Weight Hyaluronic Acid': 'ไฮยาลูรอนิค แอซิด หลายโมเลกุล',
  'Gentle Retinol': 'เรตินอลสูตรอ่อนโยน',
  'Marine Collagen': 'คอลลาเจนจากทะเลลึก',
  'Pumpkin Seed Oil': 'น้ำมันเมล็ดฟักทอง',
  'Tangerine Carotene': 'แคโรทีนส้มแมนดาริน',
  'Black Sesame Vitamin E': 'วิตามินอีงาดำ',
  'Pine Needle Distillate': 'น้ำกลั่นใบสนฤดูหนาว',
  'Cranberry Seed Omega': 'โอเมก้าเมล็ดแครนเบอร์รี่',
  'Pomegranate Sterols': 'สเตอรอลทับทิม',
  'Thai Golden Turmeric': 'ขมิ้นชันไทยสีทอง',
  'Marigold Lutein': 'ลูทีนจากดอกดาวเรือง',
  'Lotus Stamen': 'เกสรดอกบัวหลวง',
  'Royal Wildflower Honey': 'น้ำผึ้งป่าหลวง',
  'Mali Jasmine Petals': 'กลีบดอกมะลิซ้อนไทย',
  'Rice Milk Ceramides': 'เซราไมด์น้ำนมข้าวหอมมะลิ',
  'Cool Mint Dew': 'น้ำค้างมินต์เย็น',
  'Virgin Coconut': 'น้ำมันมะพร้าวบริสุทธิ์',
  'Sacred Lotus Extract': 'สารสกัดดอกบัวหลวง',
  'Fresh Pandan Leaf': 'ใบเตยหอมสด',
  'Lantern Honey': 'น้ำผึ้งสีอำพัน',
  '24k Gold Leaf': 'ทองคำเปลว 24K บริสุทธิ์',
  'Mandarin Peel Oil': 'น้ำมันผิวส้มแมนดาริน',
  'Hibiscus Petals': 'กลีบดอกชบาแดง',
  'Virgin Coconut Milk': 'กะทิมะพร้าวสกัดเย็น',
  'Pearl Calcium': 'แคลเซียมจากแร่ธรรมชาติ',
  'Damask Rose Petals': 'กลีบกุหลาบดามัสก์แท้',
  'Rosehip Oil': 'น้ำมันโรสฮิป',
  'Stardust Sparkle Mica': 'ไมก้าละอองดาวระยิบระยับ',
  'Rice Milk Protein': 'โปรตีนน้ำนมข้าว',
  'Roman Chamomile': 'คาโมมายล์โรมัน',
  'Freshwater Pearl': 'น้ำนมไหมบริสุทธิ์',
  'Mineral Champagne Mica': 'ไมก้าแชมเปญประกายทอง',
  'Shea Nacre': 'เชียบัตเตอร์ซาตินโกลว์',
  '24k Edible Rose Gold Leaf': 'ทองคำเปลวกินได้โรสโกลด์ 24K',
  '24k Edible Yellow Gold Leaf': 'ทองคำเปลวกินได้เยลโลว์โกลด์ 24K',
};

export interface I18nUiStrings {
  documentTitle: string;
  cursiveTagline: string;
  originLocation: string;
  navLines: string;
  navCases: string;
  navStory: string;
  navReviews: string;
  bagBtn: string;
  heroAtelierLabel: string;
  topSellerLabel: string;
  heroLine1: string;
  heroLine2: string;
  heroSummary: string;
  explore30: string;
  casesCta: string;
  dayMode: string;
  nightMode: string;
  inspectBtn: string;
  reserveBtn: string;
  reservedBtn: string;
  favAdd: string;
  favRemove: string;
  collectionEyebrow: string;
  collectionHeading: string;
  allLinesTab: string;
  darkTab: string;
  brightTab: string;
  occasionsTab: string;
  marbleCasesQuickTab: string;
  sortLabel: string;
  sortEdition: string;
  sortGoldLeaf: string;
  sortScentDesc: string;
  sortScentAsc: string;
  sortNameAsc: string;
  goldFilterAll: string;
  goldFilterRose: string;
  goldFilterYellow: string;
  inventoryReadoutPrefix: string;
  inventoryReadoutSuffix: string;
  darkColTitle: string;
  darkColSub: string;
  brightColTitle: string;
  brightColSub: string;
  occasionsColTitle: string;
  occasionsColSub: string;
  barsUnit: string;
  sizeSmall: string;
  sizeFull: string;
  sizeMega: string;
  sizePopular: string;
  casesEyebrow: string;
  casesHeading: string;
  casesSubSummary: string;
  caseSortLabel: string;
  caseSortMatch: string;
  caseSortBrightFirst: string;
  caseSortOccasionsFirst: string;
  soapsAnd2Loofahs: string;
  interiorLabel: string;
  interiorCountSuffix: string;
  loofahTitle: string;
  loofahTapHint: string;
  loofahSlotLabel: string;
  ribbonLabel: string;
  brassEngravingLabel: string;
  brassPlaceholder: string;
  reserveCaseBtn: string;
  reservedCaseBtn: string;
  storyEyebrow: string;
  storyHeading: string;
  storyHandPoured: string;
  storyRole: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyPillars: string;
  soapBoardEyebrow: string;
  soapBoardTitle: string;
  soapBoardDesc: string;
  reviewsHeading: string;
  reviewsRating: string;
  reviewsVerified: string;
  consoleHeading: string;
  instOff: string;
  instKalimba: string;
  instUke: string;
  instSteelpan: string;
  lagoonOn: string;
  islandBreeze: string;
  chimeBtn: string;
  frenchMotto: string;
  frenchTag: string;
  footerBannerTitle: string;
  footerBannerDesc: string;
  footerDispatchTag: string;
  modalDualStandard: string;
  modalBenefits: string;
  modalScent: string;
  modalActiveRatios: string;
  modalBotanicalVisuals: string;
  modalShimmerLight: string;
  modalOpaqueButter: string;
  modalFrostedGlow: string;
  modalBacklitCrystal: string;
  modalStageVelvet: string;
  modalStageLuminous: string;
  modalStageBalanced: string;
  modalPhAcidic: string;
  modalPhIdeal: string;
  modalPhNeutral: string;
  modalSmallSize: string;
  modalFullBar: string;
  modalHugeBlock: string;
  modalReserveCreation: string;
  bagDropHint: string;
  bagConfirmed: string;
  bagCheckoutTitle: string;
  bagWishlistTitle: string;
  bagTitle: string;
  bagSavedCount: string;
  bagCreationsNote: string;
  bagTab: string;
  wishlistTab: string;
  bagFreeShippingDone: string;
  bagFreeShippingAway: string;
  bagReceiptHeader: string;
  bagOrderNum: string;
  bagPaidVia: string;
  bagForCustomer: string;
  bagDestination: string;
  bagEngraving: string;
  bagQty: string;
  bagTotalPaid: string;
  bagStartAnother: string;
  bagNoWishlistTitle: string;
  bagNoWishlistDesc: string;
  bagEmptyTitle: string;
  bagEmptyDesc: string;
  bagCheckoutHeader: string;
  bagEditItems: string;
  bagDeliveryLocation: string;
  bagUseGps: string;
  bagGpsLocating: string;
  bagGpsLocked: string;
  bagAddressPlaceholder: string;
  bagLaserEngraving: string;
  bagEngravingPlaceholder: string;
  bagApplePayNote: string;
  bagFullName: string;
  bagEmail: string;
  bagCompleteOrder: string;
  bagSubtotal: string;
  bagShipping: string;
  bagComplimentary: string;
  bagTotal: string;
  bagCheckoutCta: string;
  marbleEtchingLabel: string;
  marbleWhite: string;
  marbleDark: string;
  marbleUnengraved: string;
  darkSetTheme: string;
  brightSetTheme: string;
  occasionsSetTheme: string;
  roseGoldLeafLabel: string;
  yellowGoldLeafLabel: string;
  diagonalGroovesLabel: string;
  engravedStampLabel: string;
  craftStandardHeading: string;
  modeSoapsBtn: string;
  modeBathBombsBtn: string;
  bathHeroLine1: string;
  bathHeroLine2: string;
  bathHeroSummary: string;
  bathExploreBtn: string;
  bathCollectionEyebrow: string;
  bathCollectionHeading: string;
  bathDarkColSub: string;
  bathBrightColSub: string;
  bathOccasionsColSub: string;
  bathBombsUnit: string;
  bathNutritionBtn: string;
  bathWaterHueLabel: string;
  bathFizzDurationLabel: string;
  bathSoakTempLabel: string;
  bathBrighteningTitle: string;
  bathNutritionFactsTitle: string;
  bathNutritionSubtitle: string;
  bathNutrientCol: string;
  bathAmountCol: string;
  bathDvCol: string;
  bathVitaminsHeader: string;
  bathMineralsHeader: string;
  bathAminoHeader: string;
  bathEnzymesHeader: string;
  bathDvFootnote: string;
  bathSinglePack: string;
  bathDuoPack: string;
  bathCofferPack: string;
  bathFocusAll: string;
  bathFocusWine: string;
  bathFocusMilk: string;
  bathFocusMarine: string;
  bathFocusRoots: string;
  bathSortBrightening: string;
  bathReadoutSuffix: string;
  bathReserveBomb: string;
  bathCasesEyebrow: string;
  bathCasesHeading: string;
  bathCasesSubSummary: string;
  bathCasesInteriorLabel: string;
  bathCasesInteriorCount: string;
  bathCasesDarkRow: string;
  bathCasesBrightRow: string;
  bathCasesHolidayRow: string;
  soldUnitLabel: string;
  atelierSoldTotalLabel: string;
  bathEngravedLabel: string;
  bathGroovesLabel: string;
  signInBtn: string;
  signOutBtn: string;
  historyBtn: string;
  historyTitle: string;
  historySubtitle: string;
  historySignInPrompt: string;
  historyViewedTab: string;
  historyOrdersTab: string;
  historyEmptyViewed: string;
  historyEmptyOrders: string;
  historyClearBtn: string;
  mailingEyebrow: string;
  mailingTitle: string;
  mailingSubtitle: string;
  mailingEmailPlaceholder: string;
  mailingSubmitBtn: string;
  mailingSuccessMsg: string;
  mailingErrorMsg: string;
  mailingTopicDrops: string;
  mailingTopicRestocks: string;
  mailingTopicBathBombs: string;
  mailingTopicSeasonal: string;
  cookieTitle: string;
  cookieDesc: string;
  cookieAcceptAll: string;
  cookieEssentialOnly: string;
  cookieCustomize: string;
  cookieHistoryToggle: string;
  cookieAdsToggle: string;
  cookieSavePrefs: string;
  cookieManageFooter: string;
  seoGuideEyebrow: string;
  seoGuideTitle: string;
  seoGuideP1: string;
  seoGuideP2: string;
  seoGuideP3: string;
  scrollerAriaLabel: string;
  scrollerTypesBtn: string;
  scrollerTypeSpotlight: string;
  scrollerTypeAllLines: string;
  scrollerTypeDark: string;
  scrollerTypeBright: string;
  scrollerTypeHolidays: string;
  scrollerTypeCases: string;
  scrollerTypeStory: string;
  scrollerTypeReviews: string;
  scrollerTypeGuide: string;
  scrollerTypeSocial: string;
  socialEyebrow: string;
  socialHeading: string;
  socialSubtitle: string;
  socialRefreshBtn: string;
  socialViewPostBtn: string;
  socialFollowLink: string;
  socialEmptyTitle: string;
  socialEmptyDesc: string;
  socialAwaitingConfigDesc: string;
  socialErrorDesc: string;
  socialRetryBtn: string;
  socialTaggedPrefix: string;
  ledgerActionLabel: string;
  colophonEyebrow: string;
  colophonBannerTitle: string;
  colophonSoapsTitle: string;
  colophonBombsTitle: string;
  colophonSampleLedgerBtn: string;
  colophonReadAssayBtn: string;
  colophonHideAssayBtn: string;
  colophonCol1Label: string;
  colophonCol2Label: string;
  colophonCol3Label: string;
  colophonSoapsCol1Text: string;
  colophonSoapsCol2Text: string;
  colophonSoapsCol3Text: string;
  colophonBombsCol1Text: string;
  colophonBombsCol2Text: string;
  colophonBombsCol3Text: string;
  colophonExpandedTitle: string;
  colophonSoapsExpandedText: string;
  colophonBombsExpandedText: string;
  colophonBiotechFootnote: string;
  ledgerHeading: string;
  ledgerFolioPrefix: string;
  ledgerRitualTitle: string;
  navVault: string;
  scrollerTypeVault: string;
  vaultEyebrow: string;
  vaultLockedLine1: string;
  vaultLockedLine2: string;
  vaultLockedDesc: string;
  vaultUnlockBtn: string;
  vaultUnlockedBadge: string;
  vaultHeadingLine1: string;
  vaultHeadingLine2: string;
  vaultSublead: string;
  vaultKpiFormulations: string;
  vaultKpiCategories: string;
  vaultKpiProducts: string;
  vaultKpiBrands: string;
  vaultAllFilter: string;
  vaultSearchPlaceholder: string;
  vaultBarLabel: string;
  vaultBombLabel: string;
  vaultBarStampTag: string;
  vaultBombStampTag: string;
  vaultGrooveStylePrefix: string;
  vaultReserveBar: string;
  vaultReserveBomb: string;
  vaultReservePair: string;
  vaultCountSuffix: string;
  vaultEmptyMatch: string;
  vaultBoxesEyebrow: string;
  vaultBoxesHeading: string;
  vaultBoxesSub: string;
  vaultBoxesInteriorLabel: string;
  vaultBoxesInteriorCount: string;
  vaultReserveBoxBtn: string;
  vaultReservedBoxBtn: string;
  modeMedievalBtn: string;
  modeRenaissanceBtn: string;
  modeBaroqueBtn: string;
  modeRomanticismBtn: string;
  modeEnlightenmentBtn: string;
  vaultExploreEraBtn: string;
  vaultRevealRemainingBtn: string;
  vaultShowFeaturedBtn: string;
  vaultEraFilterAll: string;
  vaultFilterDark: string;
  vaultFilterBright: string;
  vaultFilterHolidays: string;
  vaultPinkGoldTag: string;
  vaultYellowGoldTag: string;
  vaultSaltCrystalTag: string;
  vaultCarvedGrooveTag: string;
  vaultHalfTranslucentTag: string;
  vaultEngravedBrandTag: string;
  vaultArtSchoolLabel: string;
  vaultEraCoffretEyebrow: string;
  vaultEraInvitationEyebrow: string;
  vaultEraInvitationHeading: string;
  vaultEraInvitationDesc: string;
  modeFruitDuosBtn: string;
  modeCategoryTwoBtn: string;
  featuredSixNotice: string;
  viewCategoryTwoCta: string;
  settingsGearLabel: string;
  settingsPaletteSection: string;
  settingsAudioSection: string;
  settingsLangSection: string;
  settingsTvSection: string;
  tvModeToggleLabel: string;
  tvModeAutoDetectedLabel: string;
  tvModeBannerTitle: string;
  tvModeBannerSubtitle: string;
  tvSuiteBarEyebrow: string;
  tvSuiteBarDesc: string;
  fruitDuosEyebrow: string;
  fruitDuosHeading: string;
  fruitDuosSub: string;
  categoryTwoEyebrow: string;
  categoryTwoHeading: string;
  categoryTwoSub: string;
  hoverPreviewEyebrow: string;
  hoverPreviewPairCta: string;
  grooveDiagonalLabel: string;
  grooveEraLabel: string;
  grooveFractalLabel: string;
  halfTransparentTag: string;
  gentleBubbleEngravedTag: string;
  subBrandMotifLabel: string;
  top3SoldCarouselLabel: string;
  quickViewBtn: string;
  quickViewEyebrow: string;
  quickViewScentLabel: string;
  quickViewCraftLabel: string;
  quickViewBenefitLabel: string;
  quickViewFullDetailsBtn: string;
  matchingCandleLabel: string;
  matchingCandleSlotTitle: string;
  zoom4kLabel: string;
  quickBuyBtn: string;
  quickAddedToast: string;
  compareBtn: string;
  comparingBtn: string;
  compareModalTitle: string;
  compareModalSubtitle: string;
  compareNowBtn: string;
  compareClearBtn: string;
  compareIngredientsLabel: string;
  comparePriceLabel: string;
  compareSelectHint: string;
  compareRemoveLabel: string;
  compareSelectedLabel: string;
}

const TH_STRINGS: I18nUiStrings = {
  documentTitle: 'GentleBubble by AR — อาบฟองนุ่มดุจเมฆ เปล่งประกายดุจแพรไหม',
  cursiveTagline: 'Artisanal Savonnerie · กรุงเทพฯ',
  originLocation: 'ลาดพร้าว · กรุงเทพมหานคร',
  navLines: '3 ไลน์สบู่',
  navCases: 'กล่องหินอ่อน',
  navStory: 'เรื่องราว',
  navReviews: 'รีวิว',
  bagBtn: 'ถุงช้อปปิ้ง',
  heroAtelierLabel: 'เมซงแห่งความหอมละมุน · ลาดพร้าว กรุงเทพฯ',
  topSellerLabel: 'กลิ่นยอดนิยมประจำเมซง',
  heroLine1: 'อาบฟองนุ่มดุจเมฆ',
  heroLine2: 'เปล่งประกายดุจแพรไหม',
  heroSummary: 'พิธีกรรมแห่งการอาบน้ำที่หลอมรวมความละมุนดุจปุยเมฆ กลิ่นหอมชวนฝัน และประกายทองคำเปลวแท้ เพื่อผิวที่นุ่มนวลประดุจแพรไหม',
  explore30: 'สำรวจสบู่ 30 สูตร',
  casesCta: '3 กล่องหินอ่อน',
  dayMode: 'โหมดกลางวัน',
  nightMode: 'โหมดยามค่ำ',
  inspectBtn: 'ดูรายละเอียด',
  reserveBtn: 'สั่งจอง',
  reservedBtn: 'เพิ่มลงถุงแล้ว',
  favAdd: 'บันทึกในรายการโปรด',
  favRemove: 'นำออกจากรายการโปรด',
  collectionEyebrow: 'คอลเลกชันซิกเนเจอร์',
  collectionHeading: 'สามเฉดอารมณ์แห่งความหอม',
  allLinesTab: 'ทั้งหมด 3 โทน',
  darkTab: 'ดาร์ก',
  brightTab: 'ไบรท์',
  occasionsTab: 'อีเวนต์',
  marbleCasesQuickTab: 'กล่องหินอ่อน',
  sortLabel: 'จัดเรียง',
  sortEdition: 'ลำดับแนะนำ',
  sortGoldLeaf: 'โทนทองคำเปลว',
  sortScentDesc: 'กลิ่นหอม: เข้ม → อ่อนโยน',
  sortScentAsc: 'กลิ่นหอม: อ่อนโยน → เข้ม',
  sortNameAsc: 'เรียงตามชื่อ ก–ฮ / A–Z',
  goldFilterAll: 'ทุกโทนทอง',
  goldFilterRose: 'โรสโกลด์',
  goldFilterYellow: 'เยลโลว์โกลด์',
  inventoryReadoutPrefix: 'แสดง',
  inventoryReadoutSuffix: 'ชุด',
  darkColTitle: 'ดาร์ก',
  darkColSub: 'ลุ่มลึกและอบอุ่น',
  brightColTitle: 'ไบรท์',
  brightColSub: 'น้ำนมและความสดใส',
  occasionsColTitle: 'อีเวนต์',
  occasionsColSub: 'เฉลิมฉลองและค่ำคืนพิเศษ',
  barsUnit: 'ชุด',
  sizeSmall: 'เล็ก ฿600',
  sizeFull: 'ปกติ ฿1,000',
  sizeMega: 'ใหญ่ ฿2,500',
  sizePopular: 'ยอดนิยม',
  casesEyebrow: 'กล่องหินอ่อนคู่บวบธรรมชาติ & เทียนหอม 50/50',
  casesHeading: 'กล่องหินอ่อนร่องโรมัน + บวบ 1 ชิ้น & เทียนหอม 1 เล่ม',
  casesSubSummary: 'หีบหินอ่อนแกะสลักจับคู่สีและกลิ่นเข้ากับบวบธรรมชาติ 1 ชิ้นและเทียนหอมครึ่งใส 50/50 เล่มพิเศษ',
  caseSortLabel: 'เรียงลำดับกล่องหินอ่อน',
  caseSortMatch: 'เรียงตาม 3 ไลน์ (ไบรท์ · ดาร์ก · อีเวนต์)',
  caseSortBrightFirst: 'หินอ่อนขาวสว่างขึ้นก่อน',
  caseSortOccasionsFirst: 'รุ่นลายหมากรุกอีเวนต์ขึ้นก่อน',
  soapsAnd2Loofahs: 'สบู่ 10 ก้อน · บวบ 1 ชิ้น + เทียนหอม 50/50',
  interiorLabel: 'ภายในกล่องหินอ่อน',
  interiorCountSuffix: 'ก้อน + บวบ 1 & เทียน 1',
  loofahTitle: 'ชุดคู่ในกล่อง: บวบธรรมชาติ 1 ชิ้น + เทียนหอม 50/50',
  loofahTapHint: 'แตะเลือกบวบและชมเทียนหอมคู่สี',
  loofahSlotLabel: 'บวบธรรมชาติ #1',
  ribbonLabel: 'ริบบิ้นผ้าซาติน',
  brassEngravingLabel: 'ข้อความสลักแผ่นทองเหลือง',
  brassPlaceholder: 'ชื่อย่อหรือข้อความสลัก...',
  reserveCaseBtn: 'สั่งจองกล่องหินอ่อน',
  reservedCaseBtn: 'เพิ่มกล่องลงถุงแล้ว',
  storyEyebrow: 'เรื่องราวผู้ก่อตั้งและสตูดิโอ',
  storyHeading: 'จากวิศวกรรมชีวภาพ สู่ศิลปะสบู่ทำมือ',
  storyHandPoured: 'ปรุงสูตรและเทมือโดย',
  storyRole: 'วิศวกรเทคโนโลยีชีวภาพและผู้ก่อตั้ง',
  storyParagraph1:
    'หลังจากสำเร็จการศึกษาด้านวิศวกรรมเทคโนโลยีชีวภาพ (Biotechnology Engineering) คุณอาชาวีทำงานวิจัยด้านเอนไซม์จากธรรมชาติ กรดไขมันจำเป็น และค่าสมดุล pH ที่อ่อนโยนต่อเกราะป้องกันผิว',
  storyParagraph2:
    'นอกเวลาห้องปฏิบัติการ เธอทุ่มเทให้งานอดิเรกที่รักทั้งงานวาดพฤกษศาสตร์ งานปั้นเซรามิก และการหล่อสบู่ศิลปะ จนก่อตั้ง GentleBubble by AR เพื่อผสานศาสตร์ไบโอเทคเข้ากับทองคำเปลวกินได้ 24K และร่องสครับ 3 มิติบนแท่นไม้แกะสลัก',
  storyPillars: 'วศ.บ. เทคโนโลยีชีวภาพ · สมดุลผิว pH 4.5–5.5 · งานอดิเรกสู่สตูดิโอ',
  soapBoardEyebrow: 'งานไม้แกะสลักประจำสตูดิโอ',
  soapBoardTitle: 'แท่นวางสบู่ไม้วอลนัตสลักตราแบรนด์',
  soapBoardDesc: 'แท่นไม้เนื้อแข็งระบายน้ำที่ออกแบบควบคู่กับสบู่ทั้ง 30 สูตรเพื่อถนอมร่องสครับและเนื้อครีม',
  reviewsHeading: 'รีวิวจากนักสะสมสบู่',
  reviewsRating: '4.9 / 5 ดาว',
  reviewsVerified: 'ยืนยันจากคำสั่งซื้อจริง',
  consoleHeading: 'โทนสี & เสียง',
  instOff: 'ปิดเสียง',
  instKalimba: 'คาลิมบา',
  instUke: 'อูคูเลเล่',
  instSteelpan: 'สตีลแพน',
  lagoonOn: 'เปิดเสียงน้ำ',
  islandBreeze: 'เสียงทะเล',
  chimeBtn: 'กระดิ่ง',
  frenchMotto: '« ศิลปะแห่งสบู่พฤกษศาสตร์ · บริสุทธิ์ เจิดจรัส และอ่อนโยน »',
  frenchTag: 'GentleBubble โดย AR',
  footerBannerTitle: 'จดหมายรับรองต้นตำรับ · สตูดิโอลาดพร้าว กรุงเทพฯ',
  footerBannerDesc:
    'สบู่ทุกก้อนเทผสาน 50/50 ด้วยมือในชุดผลิตจำนวนจำกัด พร้อมทองคำเปลว 24K ร่องขัดผิว 3 มิติ และบรรจุภัณฑ์หินอ่อนสลักชื่อเฉพาะคุณ',
  footerDispatchTag: 'จัดส่งกรุงเทพฯ และทั่วโลก · มาตรฐานสตูดิโอฝรั่งเศส-ไทย',
  modalDualStandard: 'สมดุลสองเนื้อสัมผัส 50/50',
  modalBenefits: 'สัมผัสแห่งการปรนนิบัติผิว',
  modalScent: 'ความหอมระดับ',
  modalActiveRatios: 'บัญชีสารสกัดพฤกษศาสตร์และสัดส่วนโอสถ',
  modalBotanicalVisuals: 'บันทึกสารสกัดธรรมชาติประจำตำรับ',
  modalShimmerLight: 'ประกายชิมเมอร์และแสงโปร่งแสง',
  modalOpaqueButter: 'เนื้อบัตเตอร์นุ่ม',
  modalFrostedGlow: 'กึ่งโปร่งแสง',
  modalBacklitCrystal: 'คริสตัลโปร่งแสง',
  modalStageVelvet: 'เนื้อครีมกำมะหยี่',
  modalStageLuminous: 'คริสตัลเปล่งประกาย',
  modalStageBalanced: 'สมดุลโปร่งแสง',
  modalPhAcidic: 'pH 4.0 กรดอ่อน',
  modalPhIdeal: 'pH 5.5 สมดุลผิว',
  modalPhNeutral: 'pH 7.5 กลาง',
  modalSmallSize: 'ขนาดเล็ก',
  modalFullBar: 'ขนาดปกติ',
  modalHugeBlock: 'ก้อนใหญ่พิเศษ',
  modalReserveCreation: 'สั่งจองสบู่ก้อนนี้',
  bagDropHint: 'วางสบู่ที่นี่เพื่อใส่ถุงช้อปปิ้ง',
  bagConfirmed: 'ยืนยันคำสั่งซื้อแล้ว',
  bagCheckoutTitle: 'ชำระเงินและจัดส่ง',
  bagWishlistTitle: 'รายการโปรดของคุณ',
  bagTitle: 'ถุงช้อปปิ้ง',
  bagSavedCount: 'รายการที่บันทึกไว้',
  bagCreationsNote: 'รายการ · ห่อกล่องหินอ่อนสลักชื่อ',
  bagTab: 'ถุงสินค้า',
  wishlistTab: 'รายการโปรด',
  bagFreeShippingDone: 'ได้รับสิทธิ์จัดส่งฟรีจากสตูดิโอแล้ว',
  bagFreeShippingAway: 'เพิ่มอีก {amount} เพื่อรับสิทธิ์จัดส่งฟรี',
  bagReceiptHeader: 'ใบเสร็จรับเงิน GentleBubble by AR',
  bagOrderNum: 'คำสั่งซื้อ #',
  bagPaidVia: 'ชำระผ่าน',
  bagForCustomer: 'สำหรับคุณ',
  bagDestination: 'ที่อยู่จัดส่ง:',
  bagEngraving: 'ข้อความสลักพิเศษ:',
  bagQty: 'จำนวน',
  bagTotalPaid: 'ยอดชำระรวมทั้งหมด',
  bagStartAnother: 'เลือกซื้อสินค้าเพิ่มเติม',
  bagNoWishlistTitle: 'ยังไม่มีรายการโปรด',
  bagNoWishlistDesc: 'แตะไอคอนหัวใจบนสบู่ที่คุณชื่นชอบเพื่อบันทึกไว้ดูภายหลัง',
  bagEmptyTitle: 'ถุงช้อปปิ้งยังว่างอยู่',
  bagEmptyDesc: 'เลือกชมสบู่ไลน์ดาร์ก ไบรท์ เทศกาล หรือกล่องหินอ่อนพร้อมบวบธรรมชาติ',
  bagCheckoutHeader: 'ระบุพิกัดจัดส่งและสลักชื่อ',
  bagEditItems: 'แก้ไขสินค้า',
  bagDeliveryLocation: 'สถานที่จัดส่ง',
  bagUseGps: 'ใช้พิกัด GPS',
  bagGpsLocating: 'กำลังค้นหา...',
  bagGpsLocked: 'ล็อกพิกัดแล้ว',
  bagAddressPlaceholder: 'แตะใช้พิกัด GPS หรือพิมพ์ที่อยู่จัดส่งในกรุงเทพฯ/ต่างจังหวัด...',
  bagLaserEngraving: 'บริการเลเซอร์สลักชื่อ (ฝาหินอ่อน / เนื้อสบู่)',
  bagEngravingPlaceholder: 'ชื่อย่อ วันที่ หรือ GentleBubble...',
  bagApplePayNote: 'ชำระปลอดภัยผ่าน Apple Pay บัตรเครดิต หรือพร้อมเพย์ QR',
  bagFullName: 'ชื่อ-นามสกุล',
  bagEmail: 'อีเมล',
  bagCompleteOrder: 'ยืนยันคำสั่งซื้อ',
  bagSubtotal: 'ยอดรวมสินค้า',
  bagShipping: 'ค่าจัดส่งกรุงเทพฯ และทั่วโลก',
  bagComplimentary: 'จัดส่งฟรี',
  bagTotal: 'ยอดสุทธิ',
  bagCheckoutCta: 'ดำเนินการชำระเงิน (GPS · สลักชื่อ ·  Pay)',
  marbleEtchingLabel: 'ตัวอย่างสลักชื่อบนเนื้อสบู่หินอ่อน',
  marbleWhite: 'หินอ่อนขาว',
  marbleDark: 'หินอ่อนดำ',
  marbleUnengraved: 'เนื้อสบู่หินอ่อนเรียบเนียนไม่สลักลาย',
  darkSetTheme: 'ชุดกล่องหินอ่อน · ธีมดาร์ก',
  brightSetTheme: 'ชุดกล่องหินอ่อน · ธีมไบรท์',
  occasionsSetTheme: 'ชุดกล่องหินอ่อน · ธีมอีเวนต์',
  roseGoldLeafLabel: 'ทองคำเปลวโรสโกลด์ 24K (กินได้)',
  yellowGoldLeafLabel: 'ทองคำเปลวเยลโลว์โกลด์ 24K (กินได้)',
  diagonalGroovesLabel: 'ร่องแนวทแยง · ยุคศิลปะ · ฟรักทัลโค้ง',
  engravedStampLabel: 'สลักตรา GentleBubble ทุกชิ้น',
  craftStandardHeading: 'มาตรฐาน 50/50 ครึ่งใสและร่องแกะสลัก GentleBubble',
  modeSoapsBtn: 'สบู่ซิกเนเจอร์',
  modeBathBombsBtn: 'บาธบอมบ์สปา',
  bathHeroLine1: 'ดื่มด่ำในห้วงอ่างกำมะหยี่',
  bathHeroLine2: 'ตื่นรับผิวเปล่งประกายพอร์ซเลน',
  bathHeroSummary: 'ฟองอาบน้ำละมุนดุจม่านหมอกยามค่ำ ผสานกลิ่นไวน์วินเทจ น้ำนมละมุน และไออุ่นแห่งเกลือแร่เพื่อช่วงเวลาพักผ่อนอันแสนสงบ',
  bathExploreBtn: 'สำรวจบาธบอมบ์',
  bathCollectionEyebrow: 'พิธีกรรมสปาแช่ตัว',
  bathCollectionHeading: 'สามเฉดอารมณ์แห่งการแช่ตัว',
  bathDarkColSub: 'อบอุ่นยามค่ำคืน',
  bathBrightColSub: 'ละมุนรุ่งอรุณ',
  bathOccasionsColSub: 'ค่ำคืนแห่งการเฉลิมฉลอง',
  bathBombsUnit: 'ชุด',
  bathNutritionBtn: 'ดูรายละเอียด',
  bathWaterHueLabel: 'สีน้ำหลังละลาย',
  bathFizzDurationLabel: 'จังหวะการฟู่ละลาย',
  bathSoakTempLabel: 'อุณหภูมิน้ำอุ่น',
  bathBrighteningTitle: 'บันทึกการดูแลผิวและความกระจ่างใสในตำรับ',
  bathNutritionFactsTitle: 'สมุดบัญชีตำรับโอสถและวิตามิน (Atelier Elixir Ledger)',
  bathNutritionSubtitle: 'รายละเอียดวิตามิน แร่ธาตุ และสารสกัดชีวภาพที่ซ่อนอยู่ใต้ฟองนุ่ม',
  bathNutrientCol: 'รายการสารสกัดและวิตามินบำรุงผิว',
  bathAmountCol: 'ปริมาณต่อก้อน',
  bathDvCol: '% ความเข้มข้น',
  bathVitaminsHeader: 'I. หมวดวิตามินบำรุงผิว (Vitamins A · C · D3 · E · K2 · B-Complex)',
  bathMineralsHeader: 'II. หมวดเกลือแร่และไอโอดีนทะเลลึก (Epsom · Iodine · Zinc)',
  bathAminoHeader: 'III. หมวดไวน์สกัด น้ำนม และเปปไทด์ผิวกระจ่างใส',
  bathEnzymesHeader: 'IV. หมวดเอนไซม์ผลไม้ บุกคอนยัค เห็ด และรากพฤกษศาสตร์',
  bathDvFootnote: '** บัญชีสูตรตำรับเมซงเพื่อการแช่อาบภายนอกเท่านั้น ความเข้มข้นเทียบตามมาตรฐานชีวภาพของสตูดิโอ',
  bathSinglePack: 'เดี่ยว ฿750',
  bathDuoPack: 'คู่ ฿1,400',
  bathCofferPack: 'เซต 3 ก้อน ฿2,000',
  bathFocusAll: 'สารสกัดทั้งหมด',
  bathFocusWine: 'ไวน์และวิตามิน C',
  bathFocusMilk: 'น้ำนมและเปปไทด์',
  bathFocusMarine: 'สาหร่ายเคลป์และชาเขียว',
  bathFocusRoots: 'โสม มันเทศ กล้วย และเกลือแร่',
  bathSortBrightening: 'เรียงตามพลังผิวกระจ่างใส',
  bathReadoutSuffix: 'ก้อน จาก 3 ไลน์สปาแช่ตัว',
  bathReserveBomb: 'สั่งจองบาธบอมบ์',
  bathCasesEyebrow: 'กล่องหินอ่อนคู่ขนาน · เซตบาธบอมบ์ 9 ก้อน',
  bathCasesHeading: 'กล่องหินอ่อนซิกเนเจอร์ 3 แบบ (9 ก้อน + บวบ 1 + เทียน 1)',
  bathCasesSubSummary: 'รวมบาธบอมบ์ 9 ก้อน พร้อมบวบธรรมชาติ 1 ชิ้นและเทียนหอมครึ่งใส 50/50 เข้าคู่สีกล่อง',
  bathCasesInteriorLabel: 'บาธบอมบ์ภายในกล่อง (3+3+3)',
  bathCasesInteriorCount: '9 ก้อน · บวบ 1 · เทียน 1',
  bathCasesDarkRow: 'ดาร์ก (3)',
  bathCasesBrightRow: 'ไบรท์ (3)',
  bathCasesHolidayRow: 'เทศกาล (3)',
  soldUnitLabel: 'จำหน่ายแล้ว',
  atelierSoldTotalLabel: 'ยอดจำหน่ายรวม',
  bathEngravedLabel: 'สลักโลโก้ GentleBubble บนเนื้อบอมบ์',
  bathGroovesLabel: 'ร่องเกลียว 3D ละลายน้ำไว',
  signInBtn: 'เข้าสู่ระบบ',
  signOutBtn: 'ออกจากระบบ',
  historyBtn: 'ประวัติที่บันทึก',
  historyTitle: 'บัญชีลูกค้าและประวัติที่บันทึก',
  historySubtitle: 'ซิงค์รายการที่เปิดชมและคำสั่งซื้อของคุณอย่างปลอดภัยเมื่อเข้าสู่ระบบ',
  historySignInPrompt: 'เข้าสู่ระบบด้วยบัญชี Google เพื่อบันทึกประวัติการเลือกชมและใบเสร็จคำสั่งซื้อข้ามอุปกรณ์',
  historyViewedTab: 'เพิ่งเข้าชม',
  historyOrdersTab: 'คำสั่งซื้อที่บันทึก',
  historyEmptyViewed: 'ยังไม่มีประวัติการเข้าชมสูตรใด ๆ',
  historyEmptyOrders: 'ยังไม่มีคำสั่งซื้อที่บันทึกไว้ในบัญชีนี้',
  historyClearBtn: 'ล้างประวัติ',
  mailingEyebrow: 'จดหมายข่าวและแจ้งเตือนอัปเดต',
  mailingTitle: 'รับอีเมลแจ้งเตือนคอลเลกชันใหม่และอัปเดตเว็บไซต์',
  mailingSubtitle: 'ลงทะเบียนรับข่าวสารการเปิดตัวสบู่แกะสลัก บาธบอมบ์วิตามินสูตรใหม่ และการเติมสต็อกทองคำเปลว 24K',
  mailingEmailPlaceholder: 'ระบุอีเมลของคุณ (เช่น you@example.com)...',
  mailingSubmitBtn: 'สมัครรับแจ้งเตือน',
  mailingSuccessMsg: 'ลงทะเบียนรับอีเมลแจ้งเตือนอัปเดตเรียบร้อยแล้ว',
  mailingErrorMsg: 'กรุณากรอกอีเมลที่ถูกต้องก่อนกดสมัคร',
  mailingTopicDrops: 'สูตรใหม่ประจำเดือน',
  mailingTopicRestocks: 'เติมสต็อกทองคำเปลว 24K',
  mailingTopicBathBombs: 'บาธบอมบ์วิตามินรวม',
  mailingTopicSeasonal: 'กล่องหินอ่อนเทศกาล',
  cookieTitle: 'ความเป็นส่วนตัวและคุกกี้โฆษณา',
  cookieDesc: 'เราใช้คุกกี้ที่จำเป็นต่อระบบตะกร้าสินค้า รวมถึงคุกกี้บันทึกประวัติเมื่อเข้าสู่ระบบ และคุกกี้โฆษณาเพื่อนำเสนอโปรโมชันที่เหมาะกับคุณ',
  cookieAcceptAll: 'ยอมรับทั้งหมด (รวมคุกกี้โฆษณา)',
  cookieEssentialOnly: 'เฉพาะคุกกี้จำเป็น',
  cookieCustomize: 'ตั้งค่าคุกกี้',
  cookieHistoryToggle: 'คุกกี้บันทึกประวัติการเข้าชมและธีม',
  cookieAdsToggle: 'คุกกี้เพื่อโฆษณาและการปรับแต่งข้อเสนอ (Ad Cookies)',
  cookieSavePrefs: 'บันทึกการตั้งค่าคุกกี้',
  cookieManageFooter: 'ตั้งค่าคุกกี้และโฆษณา',
  seoGuideEyebrow: 'สารานุกรมพฤกษศาสตร์และสปา · GentleBubble by AR',
  seoGuideTitle: 'สบู่พฤกษศาสตร์สครับ 3D ทองคำ 24K และบาธบอมบ์ร่องเกลียวละลายไว',
  seoGuideP1: 'GentleBubble by AR คือสตูดิโอสบู่ชีวภาพในลาดพร้าว กรุงเทพฯ ที่ออกแบบโดยวิศวกรเทคโนโลยีชีวภาพ ทุกก้อนปั้นด้วยเทคนิคผสาน 50/50 ระหว่างเจลใสพฤกษศาสตร์และครีมบัตเตอร์ แกะสลักร่องสครับ 3D พร้อมสลักตราแบรนด์ GentleBubble และประดับทองคำเปลวแท้ 24K ทั้งโรสโกลด์และเยลโลว์โกลด์',
  seoGuideP2: 'กลุ่มบาธบอมบ์วิตามิน 30 สูตร (ดาร์ก 10 · ไบรท์ 10 · เทศกาล 10) สลักตรา GentleBubble พร้อมร่องเกลียว 3D ที่เร่งการซึมผ่านของน้ำอุ่นให้ฟองฟู่กระจายตัวรวดเร็ว อัดแน่นด้วยไวน์ขาว-แดง นมอูฐ-นมแพะ ชาเขียวสไปรูลิน่า สาหร่ายเคลป์ไอโอดีน บุกคอนยัค เห็ดชิตาเกะ เกลือชมพูและเกลือดำเอปซอม กล้วย มันเทศ กระเทียมบ่ม และโสมเกาหลี',
  seoGuideP3: 'จัดเก็บและมอบเป็นของขวัญระดับมาสเตอร์พีซในกล่องหินอ่อนแกะสลักพร้อมบวบขัดผิวธรรมชาติ เลือกสลับชมได้ทั้งสองกลุ่มสินค้าพร้อมบริการจัดส่งทั่วกรุงเทพฯ และต่างประเทศ',
  scrollerAriaLabel: 'แถบเลื่อนอ่างอาบน้ำฟองสบู่ 3 สี',
  scrollerTypesBtn: 'เลือกประเภท',
  scrollerTypeSpotlight: 'ไฮไลต์ยอดนิยม',
  scrollerTypeAllLines: 'ครบทั้ง 3 ไลน์',
  scrollerTypeDark: 'ประเภท: ดาร์ก',
  scrollerTypeBright: 'ประเภท: ไบรท์',
  scrollerTypeHolidays: 'ประเภท: เทศกาล',
  scrollerTypeCases: 'กล่องหินอ่อน',
  scrollerTypeStory: 'เรื่องราวแบรนด์',
  scrollerTypeReviews: 'รีวิวลูกค้า',
  scrollerTypeGuide: 'คู่มือพฤกษศาสตร์',
  scrollerTypeSocial: 'แท็กจากอินสตาแกรม',
  socialEyebrow: 'คอมมูนิตี้และภาพแท็กจริงบน Instagram',
  socialHeading: 'ภาพรีวิวจากผู้ใช้งานจริง',
  socialSubtitle: 'อัปเดตโพสต์ที่ลูกค้าแท็ก @gentlebubble.ar บน Instagram ล่าสุด',
  socialRefreshBtn: 'รีเฟรชโพสต์',
  socialViewPostBtn: 'ดูโพสต์บน Instagram',
  socialFollowLink: 'เยี่ยมชม @gentlebubble.ar',
  socialEmptyTitle: 'รอรับภาพแท็กใหม่จาก @gentlebubble.ar',
  socialEmptyDesc: 'ยังไม่มีโพสต์ที่ถูกแท็กล่าสุด ลองแท็ก @gentlebubble.ar บน Instagram เพื่อร่วมแบ่งปันประสบการณ์สปาของคุณ',
  socialAwaitingConfigDesc: 'แท็ก @gentlebubble.ar บน Instagram เพื่อร่วมแบ่งปันช่วงเวลาการอาบน้ำแร่และสบู่ 24K ของคุณที่นี่',
  socialErrorDesc: 'ไม่สามารถเชื่อมต่อฟีดโพสต์แท็กจาก Instagram ได้ชั่วคราว กรุณาลองใหม่อีกครั้ง',
  socialRetryBtn: 'ลองดึงข้อมูลใหม่',
  socialTaggedPrefix: 'แท็กโดย',
  ledgerActionLabel: 'ดูรายละเอียด',
  colophonEyebrow: 'บันทึกเมซง',
  colophonBannerTitle: 'รายละเอียดส่วนผสมและงานฝีมือ',
  colophonSoapsTitle: 'บันทึกงานสร้างสรรค์สบู่ทำมือ',
  colophonBombsTitle: 'บันทึกงานสร้างสรรค์บาธบอมบ์',
  colophonSampleLedgerBtn: 'ดูรายละเอียดสูตร',
  colophonReadAssayBtn: 'อ่านเพิ่มเติม',
  colophonHideAssayBtn: 'ซ่อนรายละเอียด',
  colophonCol1Label: 'I. พฤกษศาสตร์ธรรมชาติ',
  colophonCol2Label: 'II. งานแกะสลักมือ',
  colophonCol3Label: 'III. ความอ่อนโยนต่อผิว',
  colophonSoapsCol1Text: 'ผสานเจลใสพฤกษศาสตร์และครีมบัตเตอร์ออร์แกนิกจากธรรมชาติอย่างอ่อนโยน',
  colophonSoapsCol2Text: 'ประทับตรา GentleBubble พร้อมลวดลายแกะสลักมือและทองคำเปลวแท้',
  colophonSoapsCol3Text: 'สมดุลผิวอ่อนโยนพร้อมของขวัญซ่อนอยู่ภายในทุกก้อน',
  colophonBombsCol1Text: 'คัดสรรสารสกัดจากไวน์ น้ำนม สาหร่ายทะเล และรากพฤกษศาสตร์นานาชนิด',
  colophonBombsCol2Text: 'ขึ้นรูปด้วยร่องเกลียวให้ละลายฟู่นุ่มอย่างสม่ำเสมอในน้ำอุ่น',
  colophonBombsCol3Text: 'ผสานเกลือแร่บริสุทธิ์และวิตามินบำรุงเพื่อความผ่อนคลาย',
  colophonExpandedTitle: 'บันทึกห้องสตูดิโอ GentleBubble',
  colophonSoapsExpandedText: 'ออกแบบเพื่อการทำความสะอาดที่นุ่มนวลและมอบความชุ่มชื้นสบายผิวในทุกวัน',
  colophonBombsExpandedText: 'ปลดปล่อยกลิ่นหอมและแร่ธาตุบำรุงผิวทันทีเมื่อสัมผัสน้ำอุ่นในอ่าง',
  colophonBiotechFootnote: '— สตูดิโอ GentleBubble · ลาดพร้าว กรุงเทพฯ',
  ledgerHeading: 'บันทึกสูตรและส่วนผสม',
  ledgerFolioPrefix: 'ชุดที่',
  ledgerRitualTitle: 'สัมผัสแห่งการแช่และบำบัดผิว',
  navVault: 'คอลเลกชันศิลปะ',
  scrollerTypeVault: 'คอลเลกชันศิลปะ',
  vaultEyebrow: 'คอลเลกชันแรงบันดาลใจทางศิลปะ',
  vaultLockedLine1: 'ก้าวสู่ห้วงภวังค์แห่งการอาบน้ำใต้แสงเทียน',
  vaultLockedLine2: 'ที่ซึ่งสบู่สลักลายและฟองแร่กลายเป็นบทกวี',
  vaultLockedDesc: 'ช่วงเวลาอ่อนโยนเพื่อผิวเนียนนุ่มและใจที่สงบ คัดสรรสบู่ก้อนคู่บาธบอมบ์จากห้ายุคศิลปะ',
  vaultUnlockBtn: 'สำรวจคอลเลกชัน',
  vaultUnlockedBadge: 'คอลเลกชันศิลปะ · GentleBubble',
  vaultHeadingLine1: 'พิธีกรรมการอาบน้ำอันแสนละมุน',
  vaultHeadingLine2: 'ไบรท์ · ดาร์ก · อีเวนต์',
  vaultSublead: 'จับคู่สบู่ 50/50 และบาธบอมบ์ผลึกเกลือแร่เพื่อช่วงเวลาปรนนิบัติผิวของคุณ',
  vaultKpiFormulations: 'ชุดพิเศษ',
  vaultKpiCategories: 'โทนสี',
  vaultKpiProducts: 'พิธีกรรมคู่',
  vaultKpiBrands: 'แรงบันดาลใจ',
  vaultAllFilter: 'ทั้งหมด',
  vaultSearchPlaceholder: 'ค้นหากลิ่นหอมหรือชื่อชุด...',
  vaultBarLabel: 'สบู่ก้อนซิกเนเจอร์',
  vaultBombLabel: 'บาธบอมบ์ซิกเนเจอร์',
  vaultBarStampTag: 'ตราประทับบนสบู่',
  vaultBombStampTag: 'ตราประทับบนบอมบ์',
  vaultGrooveStylePrefix: 'ลวดลายแกะสลัก',
  vaultReserveBar: 'สบู่ ฿950',
  vaultReserveBomb: 'บอมบ์ ฿750',
  vaultReservePair: 'จองเป็นคู่',
  vaultCountSuffix: 'ชุด',
  vaultEmptyMatch: 'ไม่พบกลิ่นสัมผัสที่ตรงกับการค้นหาในขณะนี้',
  vaultBoxesEyebrow: 'กล่องของขวัญหินอ่อน + บวบ 1 ชิ้น & เทียนหอม 50/50',
  vaultBoxesHeading: 'กล่องหินอ่อนแกะร่องโรมัน',
  vaultBoxesSub: 'บรรจุสบู่ 3 ก้อน บาธบอมบ์ 3 ลูก บวบธรรมชาติ 1 ชิ้น และเทียนหอม 50/50 เข้าคู่สี 1 เล่ม',
  vaultBoxesInteriorLabel: 'สินค้าภายในกล่อง',
  vaultBoxesInteriorCount: 'สบู่ 3 + บอมบ์ 3 + บวบ 1 + เทียน 1',
  vaultReserveBoxBtn: 'สั่งจองกล่องหินอ่อน',
  vaultReservedBoxBtn: 'เพิ่มกล่องลงถุงแล้ว',
  modeMedievalBtn: 'ยุคกลาง',
  modeRenaissanceBtn: 'เรอเนซองส์',
  modeBaroqueBtn: 'บาโรก',
  modeRomanticismBtn: 'โรแมนติก',
  modeEnlightenmentBtn: 'ภูมิธรรม',
  vaultExploreEraBtn: 'สำรวจชุดนี้',
  vaultRevealRemainingBtn: 'ดูทั้งหมดในคอลเลกชัน',
  vaultShowFeaturedBtn: 'แสดงเฉพาะชุดเด่น',
  vaultEraFilterAll: 'ทั้งหมด 3 โทน',
  vaultFilterDark: 'ดาร์ก',
  vaultFilterBright: 'ไบรท์',
  vaultFilterHolidays: 'อีเวนต์',
  vaultPinkGoldTag: 'โรสโกลด์ 24K',
  vaultYellowGoldTag: 'เยลโลว์โกลด์ 24K',
  vaultSaltCrystalTag: 'ผลึกเกลือแร่ใส',
  vaultCarvedGrooveTag: 'ร่องแกะสลัก 3 มิติ',
  vaultHalfTranslucentTag: '50/50 · ผลึกเกลือแร่ใส',
  vaultEngravedBrandTag: 'สลัก GentleBubble',
  vaultArtSchoolLabel: 'แรงบันดาลใจ',
  vaultEraCoffretEyebrow: 'กล่องหินอ่อนร่องโรมัน + บวบ 1 ชิ้น & เทียนหอม 1 เล่ม',
  vaultEraInvitationEyebrow: 'คอลเลกชันศิลปะ',
  vaultEraInvitationHeading: 'เลือกชมคอลเลกชันตามยุคศิลปะ',
  vaultEraInvitationDesc: 'สบู่และบาธบอมบ์จับคู่พิเศษที่ได้แรงบันดาลใจจากความงามทั้ง 5 ยุคศิลปะ',
  modeFruitDuosBtn: 'ฟรุ๊ต & เดดซี',
  modeCategoryTwoBtn: 'คลังกลิ่นเพิ่มเติม',
  featuredSixNotice: 'คัดสรร 6 ชุดซิกเนเจอร์ (ไบรท์ 2 · ดาร์ก 2 · อีเวนต์ 2)',
  viewCategoryTwoCta: 'ดูกลิ่นทั้งหมดในคลังเพิ่มเติม',
  settingsGearLabel: 'ตั้งค่าสตูดิโอ',
  settingsPaletteSection: 'เปลี่ยนโทนสีและบรรยากาศ',
  settingsAudioSection: 'ดนตรีและเสียงธรรมชาติ',
  settingsLangSection: 'ภาษา · Language',
  settingsTvSection: 'โหมดแสดงผลจอทีวี',
  tvModeToggleLabel: 'แสดงทุกหมวดพร้อมกล่องหินอ่อน บวบ 1 ชิ้น และเทียนหอม 50/50',
  tvModeAutoDetectedLabel: 'ตรวจพบหน้าจอขนาดใหญ่/ทีวีอัตโนมัติ',
  tvModeBannerTitle: 'โหมดโชว์รูมทีวี · แสดงทุกคอลเลกชันพร้อมกล่องหินอ่อนและเทียนหอมคู่',
  tvModeBannerSubtitle: 'แสดงสบู่ บาธบอมบ์ ฟรุ๊ตดูโอ โคลนเดดซี คอลเลกชันศิลปะ พร้อมบวบ 1 ชิ้นและเทียนหอม 50/50',
  tvSuiteBarEyebrow: 'กล่องของขวัญหินอ่อน + บวบ 1 ชิ้น & เทียนหอม 50/50',
  tvSuiteBarDesc: 'จับคู่สีกล่องหินอ่อนแกะร่องโรมันกับบวบธรรมชาติ 1 ชิ้นและเทียนหอมครึ่งใส 50/50',
  fruitDuosEyebrow: 'ฟรุ๊ตดูโอ & แร่ธาตุทะเลเดดซี',
  fruitDuosHeading: 'มะม่วง สตรอว์เบอร์รี่ & เดดซีช็อกโก',
  fruitDuosSub: 'ความฉ่ำใสของผลไม้สดคู่ความอบอุ่นของดาร์กโกโก้และแร่เดดซี เติมผิวนุ่มละมุนตลอดวัน',
  categoryTwoEyebrow: 'คลังกลิ่นเพิ่มเติม',
  categoryTwoHeading: 'สบู่และบาธบอมบ์เพิ่มเติมทั้งหมด',
  categoryTwoSub: 'กลิ่นสัมผัสพิเศษครบทุกโทน พร้อมกล่องหินอ่อน บวบ 1 ชิ้น และเทียนหอม 50/50',
  hoverPreviewEyebrow: 'กลิ่นแนะนำที่เข้ากัน',
  hoverPreviewPairCta: 'เปิดชมทั้งหมด',
  grooveDiagonalLabel: 'ร่องแนวทแยง',
  grooveEraLabel: 'ลวดลายยุคศิลปะ',
  grooveFractalLabel: 'ร่องโค้งฟรักทัล',
  halfTransparentTag: 'ครึ่งใสครึ่งครีม',
  gentleBubbleEngravedTag: 'สลัก GentleBubble',
  subBrandMotifLabel: 'คอลเลกชัน',
  top3SoldCarouselLabel: '3 อันดับขายดี',
  quickViewBtn: 'ดูแบบย่อ',
  quickViewEyebrow: 'ข้อมูลสินค้าโดยย่อ',
  quickViewScentLabel: 'สัมผัสกลิ่นหอม',
  quickViewCraftLabel: 'งานฝีมือและของขวัญ',
  quickViewBenefitLabel: 'จุดเด่นสำหรับผิว',
  quickViewFullDetailsBtn: 'รายละเอียดทั้งหมด',
  matchingCandleLabel: 'เทียนหอม 50/50 เข้าคู่กลิ่นและสี',
  matchingCandleSlotTitle: 'เทียนหอม 50/50 เข้าคู่ #2',
  zoom4kLabel: 'ซูม 4K',
  quickBuyBtn: 'ซื้อด่วน',
  quickAddedToast: 'เพิ่มลงถุงแล้ว',
  compareBtn: 'เปรียบเทียบ',
  comparingBtn: 'เลือกเทียบ',
  compareModalTitle: 'เปรียบเทียบสินค้าแบบเคียงข้าง',
  compareModalSubtitle: 'เทียบส่วนผสมสำคัญ ราคา และสัมผัสกลิ่นหอมเคียงข้างกัน',
  compareNowBtn: 'เปรียบเทียบเลย',
  compareClearBtn: 'ล้างทั้งหมด',
  compareIngredientsLabel: 'ส่วนผสมและสารสกัดสำคัญ',
  comparePriceLabel: 'ราคา',
  compareSelectHint: 'เลือกอย่างน้อย 2 รายการเพื่อเปิดเปรียบเทียบ',
  compareRemoveLabel: 'นำออก',
  compareSelectedLabel: 'ที่เลือกเทียบ',
};

const EN_STRINGS: I18nUiStrings = {
  documentTitle: 'GentleBubble by AR — Wash in Clouds. Bloom in Silk.',
  cursiveTagline: 'Artisanal Savonnerie · Bangkok',
  originLocation: 'Lad Phrao, Bangkok',
  navLines: '3 Lines',
  navCases: 'Marble Cases',
  navStory: 'Story',
  navReviews: 'Reviews',
  bagBtn: 'Bag',
  heroAtelierLabel: 'Maison de Beauté · Lad Phrao, Bangkok',
  topSellerLabel: 'Maison Spotlight',
  heroLine1: 'Wash in Clouds.',
  heroLine2: 'Bloom in Silk.',
  heroSummary: 'Hand-poured bathing rituals spun from moonlight calm, warm botanicals, and a whisper of 24k gold—for silk-soft, luminous skin.',
  explore30: 'Explore Signature Soaps',
  casesCta: 'Marble Gift Boxes',
  dayMode: 'Cloud Day',
  nightMode: 'Twilight Night',
  inspectBtn: 'View Details',
  reserveBtn: 'Reserve',
  reservedBtn: 'Reserved',
  favAdd: 'Save favorite',
  favRemove: 'Remove favorite',
  collectionEyebrow: 'Signature Collection',
  collectionHeading: 'Three Curated Moods',
  allLinesTab: 'All Lines',
  darkTab: 'Dark',
  brightTab: 'Bright',
  occasionsTab: 'Events',
  marbleCasesQuickTab: 'Marble Boxes',
  sortLabel: 'Sort',
  sortEdition: 'Curated Order',
  sortGoldLeaf: 'Gold Leaf Tone',
  sortScentDesc: 'Scent: Rich → Subtle',
  sortScentAsc: 'Scent: Subtle → Rich',
  sortNameAsc: 'Alphabetical A–Z',
  goldFilterAll: 'All Gold Tones',
  goldFilterRose: 'Rose Gold',
  goldFilterYellow: 'Yellow Gold',
  inventoryReadoutPrefix: 'Showing',
  inventoryReadoutSuffix: 'sets',
  darkColTitle: 'Dark',
  darkColSub: 'Rich & Grounded',
  brightColTitle: 'Bright',
  brightColSub: 'Milk & Morning Dew',
  occasionsColTitle: 'Events',
  occasionsColSub: 'Festive & Gala',
  barsUnit: 'Sets',
  sizeSmall: 'Small ฿600',
  sizeFull: 'Full ฿1,000',
  sizeMega: 'Large ฿2,500',
  sizePopular: 'Popular',
  casesEyebrow: 'Paired With 1 Loofah & 1 Matching 50/50 Candle',
  casesHeading: 'Roman Marble Boxes · Loofah & Candle Suite',
  casesSubSummary: 'Carved marble coffrets color-matched with 1 botanical loofah and 1 50/50 translucent aromatic candle.',
  caseSortLabel: 'Arrange Marble Cases',
  caseSortMatch: 'Match 3 Columns (Bright · Dark · Events)',
  caseSortBrightFirst: 'Bright Marble First',
  caseSortOccasionsFirst: 'Events Checkered First',
  soapsAnd2Loofahs: '10 Soaps · 1 Loofah + 1 50/50 Candle',
  interiorLabel: 'Case Interior Compartment',
  interiorCountSuffix: 'Soaps · 1 Loofah + 1 Candle',
  loofahTitle: 'Matched Chest Pairing · 1× Loofah + 1× 50/50 Candle',
  loofahTapHint: 'Tap loofah to switch · Click candle to zoom 4K',
  loofahSlotLabel: 'Loofah #1',
  ribbonLabel: 'Silk Ribbon',
  brassEngravingLabel: 'Brass Plaque Engraving',
  brassPlaceholder: 'Initials or message...',
  reserveCaseBtn: 'Reserve Case',
  reservedCaseBtn: 'Reserved Case',
  storyEyebrow: 'Founder Story & Atelier',
  storyHeading: 'Biotech Precision Meets Hand-Sculpted Craft',
  storyHandPoured: 'Formulated & crafted by',
  storyRole: 'Biotech Engineer & Founder',
  storyParagraph1:
    'Graduating as a Biotechnology Engineer, Archawee spent years studying botanical enzymes, lipid barriers, and skin-kind pH chemistry inside formulation labs.',
  storyParagraph2:
    'After hours, she pursued her creative hobbies—botanical illustration, porcelain craft, and cold-process soap sculpting—founding GentleBubble by AR to unite biotech precision with 24k edible gold leaf and 3D scrub bars.',
  storyPillars: 'B.Eng. Biotechnology · pH 4.5–5.5 Formulated · Crafted Hobbies',
  soapBoardEyebrow: 'Studio Craftsmanship',
  soapBoardTitle: 'Carved Walnut & Teak Soap Board',
  soapBoardDesc: 'Slotted hardwood soap deck crafted alongside our 30 bars to keep 3D scrub grooves dry between rituals.',
  reviewsHeading: 'Collector Reviews',
  reviewsRating: '4.9 / 5 Stars',
  reviewsVerified: 'Verified Maison Orders',
  consoleHeading: 'Hues & Sound',
  instOff: 'Off',
  instKalimba: 'Kalimba',
  instUke: 'Uke',
  instSteelpan: 'Steelpan',
  lagoonOn: 'Lagoon On',
  islandBreeze: 'Breeze',
  chimeBtn: 'Chime',
  frenchMotto: '« L’Art du Savon Botanique · Pureté, Lumière & Douceur »',
  frenchTag: 'GentleBubble par AR',
  footerBannerTitle: 'Archival Maison Correspondence · Bangkok Atelier',
  footerBannerDesc:
    'Every bar is hand-poured in small 50/50 botanical batches with genuine 24k edible gold leaf, carved 3D diagonal scrub grooves, and custom marble gifting.',
  footerDispatchTag: 'Bangkok & Worldwide Dispatch · Artisanal Savonnerie',
  modalDualStandard: '50/50 Dual Texture Harmony',
  modalBenefits: 'Sensory & Skin Ritual Profile',
  modalScent: 'Scent',
  modalActiveRatios: 'Apothecary Ratio & pH Ledger',
  modalBotanicalVisuals: 'Botanical Formulation Dossier',
  modalShimmerLight: 'Crystal Shimmer & Light',
  modalOpaqueButter: 'Opaque Butter',
  modalFrostedGlow: 'Frosted Glow',
  modalBacklitCrystal: 'Backlit Crystal',
  modalStageVelvet: 'Velvet Butter',
  modalStageLuminous: 'Luminous Translucent',
  modalStageBalanced: 'Balanced Clarity',
  modalPhAcidic: 'pH 4.0 Acidic',
  modalPhIdeal: 'pH 5.5 Skin Ideal',
  modalPhNeutral: 'pH 7.5 Neutral',
  modalSmallSize: 'Small Size',
  modalFullBar: 'Full Bar',
  modalHugeBlock: 'Huge Block',
  modalReserveCreation: 'Reserve Creation',
  bagDropHint: 'Drop Soap Here to Add to Bag',
  bagConfirmed: 'Allocation Confirmed',
  bagCheckoutTitle: 'Concierge Checkout',
  bagWishlistTitle: 'Private Archive',
  bagTitle: 'Concierge Bag',
  bagSavedCount: 'saved for later',
  bagCreationsNote: 'creations · Engraved marble wrap',
  bagTab: 'Bag',
  wishlistTab: 'Wishlist',
  bagFreeShippingDone: 'Complimentary studio shipping unlocked',
  bagFreeShippingAway: '{amount} away from free delivery',
  bagReceiptHeader: 'GentleBubble by AR Receipt',
  bagOrderNum: 'Order #',
  bagPaidVia: 'Paid via',
  bagForCustomer: 'for',
  bagDestination: 'Destination:',
  bagEngraving: 'Custom Engraving:',
  bagQty: 'Qty',
  bagTotalPaid: 'Total Paid',
  bagStartAnother: 'Start Another Order',
  bagNoWishlistTitle: 'No favorites saved yet',
  bagNoWishlistDesc: 'Tap the heart on any soap bar to save formulas for later.',
  bagEmptyTitle: 'Your Concierge Bag is empty',
  bagEmptyDesc: 'Reserve any Dark, Bright, Occasion bar, or Marble Case with loofah & matching candle.',
  bagCheckoutHeader: 'GPS & Engraving Checkout',
  bagEditItems: 'Edit items',
  bagDeliveryLocation: 'Delivery Location',
  bagUseGps: 'Use GPS',
  bagGpsLocating: 'Locating...',
  bagGpsLocked: 'GPS Locked',
  bagAddressPlaceholder: 'Tap Use GPS or type street address...',
  bagLaserEngraving: 'Laser Engraving (Marble Lid / Bar Seal)',
  bagEngravingPlaceholder: 'Initials, date, or GentleBubble...',
  bagApplePayNote: 'Encrypted checkout via Apple Pay, Credit Card, or PromptPay QR',
  bagFullName: 'Full Name',
  bagEmail: 'Email Address',
  bagCompleteOrder: 'Complete Order',
  bagSubtotal: 'Subtotal',
  bagShipping: 'Bangkok & Global Shipping',
  bagComplimentary: 'Complimentary',
  bagTotal: 'Total',
  bagCheckoutCta: 'Checkout (GPS · Engraving ·  Pay)',
  marbleEtchingLabel: 'Live Marble Soap Etching',
  marbleWhite: 'White Marble',
  marbleDark: 'Dark Marble',
  marbleUnengraved: 'Smooth un-engraved marble bar finish',
  darkSetTheme: 'Dark Line Marble Set',
  brightSetTheme: 'Bright Line Marble Set',
  occasionsSetTheme: 'Events Line Marble Set',
  roseGoldLeafLabel: '24k Edible Rose Gold Leaf',
  yellowGoldLeafLabel: '24k Edible Yellow Gold Leaf',
  diagonalGroovesLabel: 'Diagonal · Era-Inspired · Fractal Grooves',
  engravedStampLabel: 'Debossed GentleBubble Seal',
  craftStandardHeading: '50/50 Half-Transparent & GentleBubble Craft Standard',
  modeSoapsBtn: 'Signature Soaps',
  modeBathBombsBtn: 'Bath Bombs',
  bathHeroLine1: 'Melt into Velvet Skies.',
  bathHeroLine2: 'Awaken in Porcelain Glow.',
  bathHeroSummary: 'Slow-risen mineral bath spheres woven from cellar botanicals, silk milk, and luminous dusk mist.',
  bathExploreBtn: 'Explore Bath Bombs',
  bathCollectionEyebrow: 'Mineral Soak Sanctuary',
  bathCollectionHeading: 'Three Soak Moods',
  bathDarkColSub: 'Velvet Dusk & Warmth',
  bathBrightColSub: 'Morning Milk & Mist',
  bathOccasionsColSub: 'Evening Celebrations',
  bathBombsUnit: 'Sets',
  bathNutritionBtn: 'View Details',
  bathWaterHueLabel: 'Dissolved Tub Hue',
  bathFizzDurationLabel: 'Dissolve Cadence',
  bathSoakTempLabel: 'Bath Warmth',
  bathBrighteningTitle: 'Elixir Note & Skin Luminosity',
  bathNutritionFactsTitle: 'Atelier Elixir & Assay Ledger',
  bathNutritionSubtitle: 'Complete apothecary breakdown of vitamins, mineral salts, wines & milks beneath the veil',
  bathNutrientCol: 'Botanical / Micronutrient Entry',
  bathAmountCol: 'Assay / Soak',
  bathDvCol: '% Potency',
  bathVitaminsHeader: 'I. Essential Vitamin Complex (A · C · D3 · E · K2 · B-Complex)',
  bathMineralsHeader: 'II. Deep Sea & Salt Electrolytes (Epsom · Iodine · Zinc)',
  bathAminoHeader: 'III. Cellar Wine, Silk Milk & Luminosity Complex',
  bathEnzymesHeader: 'IV. Fruit Enzymes, Konjac, Mushrooms & Botanical Roots',
  bathDvFootnote: '** Archival maison formulation standard prepared strictly for warm-water bathing rituals.',
  bathSinglePack: 'Single ฿750',
  bathDuoPack: 'Duo ฿1,400',
  bathCofferPack: 'Coffer (3) ฿2,000',
  bathFocusAll: 'All Bio-Actives',
  bathFocusWine: 'Wine & Vitamin C',
  bathFocusMilk: 'Camel & Goat Milk',
  bathFocusMarine: 'Sea Kelp & Green Tea',
  bathFocusRoots: 'Ginseng, Yam, Banana & Salts',
  bathSortBrightening: 'Skin-Brightening Power',
  bathReadoutSuffix: 'bath bombs across 3 Lines',
  bathReserveBomb: 'Reserve Bath Bomb',
  bathCasesEyebrow: '3 Matching Marble Coffrets · 9-Sphere Editions',
  bathCasesHeading: 'Matching Marble Cases (9 Bombs · 1 Loofah + 1 Candle)',
  bathCasesSubSummary: 'Each chest holds 9 spheres plus 1 natural loofah and 1 matching 50/50 aromatic candle',
  bathCasesInteriorLabel: 'Coffret Interior (3 Dark · 3 Bright · 3 Holidays)',
  bathCasesInteriorCount: '9 Bombs · 1 Loofah + 1 Candle',
  bathCasesDarkRow: 'Dark (3)',
  bathCasesBrightRow: 'Bright (3)',
  bathCasesHolidayRow: 'Holidays (3)',
  soldUnitLabel: 'sold',
  atelierSoldTotalLabel: 'Atelier Sold',
  bathEngravedLabel: 'Debossed GentleBubble Crown Seal',
  bathGroovesLabel: '3D Fast-Dissolve Water Grooves',
  signInBtn: 'Sign In',
  signOutBtn: 'Sign Out',
  historyBtn: 'Saved History',
  historyTitle: 'Member Account & Saved History',
  historySubtitle: 'Cloud-synced formula inspections and concierge order receipts when logged in',
  historySignInPrompt: 'Sign in with Google to save your viewed formulas, preferred bath actives, and order receipts across sessions.',
  historyViewedTab: 'Viewed Formulas',
  historyOrdersTab: 'Saved Orders',
  historyEmptyViewed: 'No inspected formulas recorded yet.',
  historyEmptyOrders: 'No completed orders saved to your account yet.',
  historyClearBtn: 'Clear History',
  mailingEyebrow: 'Site Updates & Dispatch Mailing List',
  mailingTitle: 'Receive Email Notifications & Atelier Releases',
  mailingSubtitle: 'Join the GentleBubble by AR dispatch list for seasonal formula drops, fast-dissolve bath bomb releases, and 24k gold restocks.',
  mailingEmailPlaceholder: 'Enter your email address (e.g. you@example.com)...',
  mailingSubmitBtn: 'Subscribe for Updates',
  mailingSuccessMsg: 'Subscribed! Email notifications for GentleBubble by AR updates are active.',
  mailingErrorMsg: 'Please enter a valid email address to subscribe.',
  mailingTopicDrops: 'New Soap & Bath Drops',
  mailingTopicRestocks: '24k Gold Leaf Restocks',
  mailingTopicBathBombs: 'Vitamin Bath Bombs',
  mailingTopicSeasonal: 'Marble Holiday Coffrets',
  cookieTitle: 'Saved History & Ad Cookies',
  cookieDesc: 'We use essential cookies for your bag, saved-history cookies when signed in, and advertising cookies to tailor botanical offers.',
  cookieAcceptAll: 'Accept All (Incl. Ad Cookies)',
  cookieEssentialOnly: 'Essential Only',
  cookieCustomize: 'Preferences',
  cookieHistoryToggle: 'Saved History & Theme Memory Cookies',
  cookieAdsToggle: 'Personalized Advertising Cookies (Ad Tracking)',
  cookieSavePrefs: 'Save Cookie Preferences',
  cookieManageFooter: 'Cookie & Ad Settings',
  seoGuideEyebrow: 'Botanical Craft Index · GentleBubble by AR',
  seoGuideTitle: '24k Gold Scrub Soaps, Fast-Dissolve Grooved Bath Bombs & Marble Coffrets',
  seoGuideP1: 'GentleBubble by AR is an artisanal bio-botanical savonnerie in Lad Phrao, Bangkok. Every upright sculpted soap bar unites translucent crystal gel and whipped organic butter in a 50/50 pour with deep 3D diagonal scrub grooves, debossed GentleBubble engraving, and 24k edible Rose Gold or Yellow Gold leaf.',
  seoGuideP2: 'Our parallel 30-edition Vitamin Bath Bomb line (10 Dark, 10 Bright, 10 Holidays) is molded with signature debossed GentleBubble lettering and deep 3D spiral fast-dissolve water grooves for instant hydro-effervescence—infused with red & white wine resveratrol, camel & goat milk, green tea spirulina, sea kelp bio-iodine, konjac mushroom, Himalayan pink & black Epsom salts, banana, yam, aged garlic, and Korean ginseng.',
  seoGuideP3: 'Presented in bespoke white Calacatta, dark Nero Marquina, and checkered marble coffrets with natural loofah scrub holders, silk ribbons, and custom brass engraving for collectors worldwide.',
  scrollerAriaLabel: 'Floating porcelain bathtub scroller',
  scrollerTypesBtn: 'By Type',
  scrollerTypeSpotlight: 'Spotlight',
  scrollerTypeAllLines: 'All 3 Lines',
  scrollerTypeDark: 'Dark Line',
  scrollerTypeBright: 'Bright Line',
  scrollerTypeHolidays: 'Holidays',
  scrollerTypeCases: 'Marble Cases',
  scrollerTypeStory: 'Maison Story',
  scrollerTypeReviews: 'Reviews',
  scrollerTypeGuide: 'Craft Guide',
  scrollerTypeSocial: 'Instagram Mentions',
  socialEyebrow: 'Verified Community · Tagged on Instagram',
  socialHeading: 'Social Proof from the Atelier Community',
  socialSubtitle: 'Community bath moments shared with @gentlebubble.ar',
  socialRefreshBtn: 'Refresh Mentions',
  socialViewPostBtn: 'View on Instagram',
  socialFollowLink: 'Visit @gentlebubble.ar',
  socialEmptyTitle: 'Awaiting New Tagged Mentions',
  socialEmptyDesc: 'Tag @gentlebubble.ar on Instagram to share your mineral bath soak and engraved bar ritual here.',
  socialAwaitingConfigDesc: 'Tag @gentlebubble.ar on Instagram to have your bathing ritual featured in our community gallery.',
  socialErrorDesc: 'Unable to reach Instagram tagged mentions right now. Please try again.',
  socialRetryBtn: 'Retry Fetch',
  socialTaggedPrefix: 'Tagged by',
  ledgerActionLabel: 'View Details',
  colophonEyebrow: 'Atelier Notes',
  colophonBannerTitle: 'Craft & Formulation Notes',
  colophonSoapsTitle: 'Hand-Poured Bar Architecture',
  colophonBombsTitle: 'Mineral Bath Sphere Craft',
  colophonSampleLedgerBtn: 'View Sample Notes',
  colophonReadAssayBtn: 'Read Notes',
  colophonHideAssayBtn: 'Close Notes',
  colophonCol1Label: 'I. Botanical Extracts',
  colophonCol2Label: 'II. Sculpted Craft',
  colophonCol3Label: 'III. Skin Kindness',
  colophonSoapsCol1Text: 'Translucent botanical gel paired with organic whipped butter.',
  colophonSoapsCol2Text: 'Pressed with our GentleBubble seal and signature surface grooves.',
  colophonSoapsCol3Text: 'Gentle everyday cleansing with a thoughtful keepsake inside.',
  colophonBombsCol1Text: 'Enriched with wine notes, silk milk peptides, kelp, and roots.',
  colophonBombsCol2Text: 'Carved spiral channels release warm mineral effervescence smoothly.',
  colophonBombsCol3Text: 'Blended with pink salt, vitamins, and soothing fruit extracts.',
  colophonExpandedTitle: 'Atelier Craft Notes by Archawee',
  colophonSoapsExpandedText: 'Formulated to cleanse gently while keeping your skin barrier supple and comfortable.',
  colophonBombsExpandedText: 'Balanced botanicals dissolve effortlessly when touched by warm bath water.',
  colophonBiotechFootnote: '— GentleBubble Studio · Bangkok',
  ledgerHeading: 'Ingredients & Craft Notes',
  ledgerFolioPrefix: 'Edition',
  ledgerRitualTitle: 'Bath Atmosphere',
  navVault: 'Art Collections',
  scrollerTypeVault: 'Art Collections',
  vaultEyebrow: 'Art-Inspired Bathing',
  vaultLockedLine1: 'Step Inside the Candlelit Sanctuary.',
  vaultLockedLine2: 'Where Carved Soap & Mist Become Poetry.',
  vaultLockedDesc: 'Your quiet pause to unwind—hand-carved 50/50 soaps and mineral bath spheres across five artistic eras.',
  vaultUnlockBtn: 'Explore Art Collections',
  vaultUnlockedBadge: 'Art Collection · GentleBubble',
  vaultHeadingLine1: 'Whispered Bathing Rituals.',
  vaultHeadingLine2: 'Bright · Dark · Events',
  vaultSublead: 'Soft skin-kind formulas with warm scents curated to restore calm after long days.',
  vaultKpiFormulations: 'Pairings',
  vaultKpiCategories: 'Moods',
  vaultKpiProducts: 'Rituals',
  vaultKpiBrands: 'Collections',
  vaultAllFilter: 'All Moods',
  vaultSearchPlaceholder: 'Search scents or names...',
  vaultBarLabel: 'Signature Soap Bar',
  vaultBombLabel: 'Signature Bath Bomb',
  vaultBarStampTag: 'Soap Crest',
  vaultBombStampTag: 'Bomb Crest',
  vaultGrooveStylePrefix: 'Carved Motif',
  vaultReserveBar: 'Bar ฿950',
  vaultReserveBomb: 'Bomb ฿750',
  vaultReservePair: 'Reserve Set',
  vaultCountSuffix: 'rituals',
  vaultEmptyMatch: 'No rituals match your current search.',
  vaultBoxesEyebrow: 'Marble Chest · 1× Loofah + 1× 50/50 Candle',
  vaultBoxesHeading: 'Roman Marble Gift Chests',
  vaultBoxesSub: 'Hand-carved marble chests holding matched soaps, bath bombs, 1 botanical loofah, and 1 color-matched 50/50 candle.',
  vaultBoxesInteriorLabel: 'Inside the Chest',
  vaultBoxesInteriorCount: '3 Bars + 3 Bombs · 1 Loofah + 1 Candle',
  vaultReserveBoxBtn: 'Reserve Marble Chest',
  vaultReservedBoxBtn: 'Reserved Marble Chest',
  modeMedievalBtn: 'Medieval',
  modeRenaissanceBtn: 'Renaissance',
  modeBaroqueBtn: 'Baroque',
  modeRomanticismBtn: 'Romanticism',
  modeEnlightenmentBtn: 'Enlightenment',
  vaultExploreEraBtn: 'Explore Collection',
  vaultRevealRemainingBtn: 'Show Full Collection',
  vaultShowFeaturedBtn: 'Show Featured Only',
  vaultEraFilterAll: 'All Lines',
  vaultFilterDark: 'Dark',
  vaultFilterBright: 'Bright',
  vaultFilterHolidays: 'Events',
  vaultPinkGoldTag: '24k Rose Gold',
  vaultYellowGoldTag: '24k Yellow Gold',
  vaultSaltCrystalTag: 'Mineral Salt Crystals',
  vaultCarvedGrooveTag: 'Carved 3D Grooves',
  vaultHalfTranslucentTag: '50/50 · Clear Salt Crystals',
  vaultEngravedBrandTag: 'GentleBubble Seal',
  vaultArtSchoolLabel: 'Inspiration',
  vaultEraCoffretEyebrow: 'Roman Marble Chest · 1× Loofah + 1× 50/50 Candle',
  vaultEraInvitationEyebrow: 'Art Collections',
  vaultEraInvitationHeading: 'Browse Five Art-Inspired Chapters',
  vaultEraInvitationDesc: 'Half-translucent bar soaps and mineral bath bombs across five artistic eras.',
  modeFruitDuosBtn: 'Fruit & Dead Sea',
  modeCategoryTwoBtn: 'Complete Library',
  featuredSixNotice: 'Showing 6 featured sets across Bright, Dark & Events',
  viewCategoryTwoCta: 'Explore Complete Library',
  settingsGearLabel: 'Atelier Settings',
  settingsPaletteSection: 'Color Palette & Mood',
  settingsAudioSection: 'Acoustic Soundscape',
  settingsLangSection: 'Language · ภาษา',
  settingsTvSection: 'TV Display Mode',
  tvModeToggleLabel: 'Showroom panorama with Marble Boxes, Loofah & 50/50 Candle',
  tvModeAutoDetectedLabel: 'TV / widescreen detected',
  tvModeBannerTitle: 'TV Showroom View · All Collections + Marble Candle Suites',
  tvModeBannerSubtitle: 'Displaying every collection alongside Roman-fluted marble coffrets, 1× loofah & matching 50/50 candle.',
  tvSuiteBarEyebrow: 'Marble Boxes · 1× Loofah + 1× Matching 50/50 Candle',
  tvSuiteBarDesc: 'Color-matched Roman marble coffrets with 1 botanical loofah and 1 aromatic 50/50 candle.',
  fruitDuosEyebrow: 'Orchard & Dead Sea Collection',
  fruitDuosHeading: 'Mango, Strawberry & Dead Sea Duos',
  fruitDuosSub: 'Glow-giving vitamin C fruits and soothing Dead Sea minerals designed for soft, comforted skin.',
  categoryTwoEyebrow: 'Complete Library',
  categoryTwoHeading: 'More Soaps & Bath Bombs',
  categoryTwoSub: 'Explore every scent across Bright, Dark, and Events with matching candle marble coffrets below.',
  hoverPreviewEyebrow: 'Curated Pairings',
  hoverPreviewPairCta: 'Open Collection',
  grooveDiagonalLabel: 'Diagonal Grooves',
  grooveEraLabel: 'Era Relief',
  grooveFractalLabel: 'Fractal Grooves',
  halfTransparentTag: 'Half-Translucent',
  gentleBubbleEngravedTag: 'GentleBubble',
  subBrandMotifLabel: 'Collection',
  top3SoldCarouselLabel: 'Top 3 Bestsellers',
  quickViewBtn: 'Quick View',
  quickViewEyebrow: 'Quick View',
  quickViewScentLabel: 'Scent & Atmosphere',
  quickViewCraftLabel: 'Craft & Keepsake',
  quickViewBenefitLabel: 'Skin Ritual',
  quickViewFullDetailsBtn: 'Full Details',
  matchingCandleLabel: 'Matching 50/50 Aromatic Candle',
  matchingCandleSlotTitle: '50/50 Candle #2',
  zoom4kLabel: '4K Zoom',
  quickBuyBtn: 'Quick Buy',
  quickAddedToast: 'Added to Bag',
  compareBtn: 'Compare',
  comparingBtn: 'Comparing',
  compareModalTitle: 'Side-by-Side Product Comparison',
  compareModalSubtitle: 'Compare key botanical ingredients, pricing, scent profiles, and gold craft',
  compareNowBtn: 'Compare Now',
  compareClearBtn: 'Clear',
  compareIngredientsLabel: 'Key Ingredients & Botanicals',
  comparePriceLabel: 'Price',
  compareSelectHint: 'Select at least 2 products to compare',
  compareRemoveLabel: 'Remove',
  compareSelectedLabel: 'Selected to Compare',
};

export const PRESET_LABELS_TH: Record<DreamPresetId, string> = {
  'midnight-reverie': 'ครีมเมฆกลางวัน',
  'astral-amber': 'ฟ้าซาเบล่',
  'moonmilk-velvet': 'ลาเวนเดอร์ยามค่ำ',
  'eclipse-noir': 'โรสวูดสนธยา',
};

export const PRESET_LABELS_SHORT_EN: Record<DreamPresetId, string> = {
  'midnight-reverie': 'Cloud Day',
  'astral-amber': 'Sky Day',
  'moonmilk-velvet': 'Lavender',
  'eclipse-noir': 'Rosewood',
};

export const INLAY_LABELS_TH: Record<LuxuryInlayType, string> = {
  pearl: 'ทองคำเปลวและร่อง 3D',
  'gold-leaf': 'ทองคำเปลว 24K',
  loofah: 'บวบธรรมชาติสยาม',
  'cosmetic-sponge': 'ฟองน้ำไหมนุ่ม',
};

export const LOOFAH_TH: Record<string, { label: string; material: string }> = {
  'egyptian-raw': {
    label: 'บวบอียิปต์ธรรมชาติ',
    material: 'เส้นใยบวบตากแดดแท้',
  },
  'silk-mesh': {
    label: 'บวบใยไหมสัมผัสนุ่ม',
    material: 'ฟองน้ำถักละเอียดสองชั้น',
  },
  'charcoal-hemp': {
    label: 'บวบถ่านไม้ไผ่ป่าน',
    material: 'เส้นใยถักทอผสมผงถ่าน',
  },
  'honey-comb': {
    label: 'บวบใยรวงผึ้งสีทอง',
    material: 'แผ่นขัดผิวนุ่มไม่ฟอกสี',
  },
};

export const MARBLE_CASE_TH: Record<
  MarbleCassetteEdition['id'],
  { shortTitle: string; name: string; description: string }
> = {
  'cassette-bright-marble-loofah': {
    shortTitle: 'กล่องหินอ่อนสว่าง + เทียนหอม',
    name: 'กล่องหินอ่อนสว่าง · สบู่ 10 ก้อน + บวบ 1 + เทียนหอม 50/50',
    description: 'กล่องหินอ่อนขาวคาลากัตตาแกะสลัก บรรจุสบู่ไลน์ไบรท์ 10 ก้อน บวบธรรมชาติ 1 ชิ้น และเทียนหอมมะม่วงซิตรัส 50/50',
  },
  'cassette-dark-marble-loofah': {
    shortTitle: 'กล่องหินอ่อนดำ + เทียนหอม',
    name: 'กล่องหินอ่อนดำ · สบู่ 10 ก้อน + บวบ 1 + เทียนหอม 50/50',
    description: 'กล่องหินอ่อนดำเนโร มาร์ควินา บรรจุสบู่ไลน์ดาร์ก 10 ก้อน บวบธรรมชาติ 1 ชิ้น และเทียนหอมโกโก้อำพัน 50/50',
  },
  'cassette-checkered-occasions-loofah': {
    shortTitle: 'กล่องลายหมากรุก + เทียนหอม',
    name: 'กล่องหินอ่อนลายหมากรุก · สบู่เทศกาล 10 ก้อน + บวบ 1 + เทียนหอม 50/50',
    description: 'หีบหินอ่อนลายตารางสลับขาวดำซิกเนเจอร์ บรรจุสบู่เทศกาล 10 ก้อน บวบ 1 ชิ้น และเทียนหอมสตรอว์เบอร์รีแชมเปญ 50/50',
  },
};

export const RIBBON_TH: Record<string, string> = {
  'wax-gold': 'ไหมทองแชมเปญ',
  'wax-crimson': 'แดงคริมสัน',
  'wax-azure': 'ฟ้าซีเลสเชียล',
  'wax-emerald': 'เขียวหยก',
  'wax-rose': 'ชมพูกุหลาบดามัสก์',
  'wax-espresso': 'น้ำตาลกำมะหยี่',
};

export const BENEFIT_LABELS_TH: Record<string, string> = {
  hydration: 'ล็อกความชุ่มชื้น',
  clarifying: 'ทำความสะอาดรูขุมขน',
  barrier: 'ปลอบประโลมเกราะผิว',
  luminosity: 'ผิวโกลว์กระจ่างใส',
  polish: 'ผลัดเซลล์อย่างอ่อนโยน',
};

export const MARKER_LABELS_TH: Record<PackagingMarkerId, { shortTitle: string; specDetail: string }> = {
  'split-5050': {
    shortTitle: 'เทผสาน 50/50',
    specDetail: 'เจลใสพฤกษศาสตร์ผสานครีมบัตเตอร์ออร์แกนิกอย่างลงตัว',
  },
  'collagen-1-2': {
    shortTitle: 'คอลลาเจน I + II',
    specDetail: 'คอลลาเจนมารีน ชนิดที่ 1 และ 2 เพื่อผิวยืดหยุ่นเรียบเนียน',
  },
  'coffee-mg': {
    shortTitle: 'เอสเปรสโซ่ & Mg',
    specDetail: 'เมล็ดกาแฟออร์แกนิก โกโก้ และแมกนีเซียมคีเลต',
  },
  'ginseng-root': {
    shortTitle: 'รากโสมแดงสกัด',
    specDetail: 'สารสกัดรากโสมแดงและโกโก้ฟื้นบำรุงความมีชีวิตชีวา',
  },
  'vit-cead': {
    shortTitle: 'วิตามิน C·E·A·D',
    specDetail: 'วิตามินบำรุงผิวกระจ่างใสจากผลไม้และอะโวคาโดออร์แกนิก',
  },
  'pearl-minerals': {
    shortTitle: 'ทองคำ 24K และน้ำนมมะพร้าว',
    specDetail: 'ทองคำเปลวบริสุทธิ์และน้ำนมมะพร้าวไทยสกัดเย็น',
  },
};

export const REVIEWS_TH = [
  {
    quote: 'ฟองนุ่มละมุนเหมือนวิปครีม ล้างออกแล้วผิวชุ่มชื้นไม่แห้งตึงเลย',
    author: 'ณัชชา ส.',
    city: 'กรุงเทพฯ',
    soapName: 'น้ำนมมะพร้าวไทยและทองคำ 24K',
  },
  {
    quote: 'แกนทองคำสวยประณีตมาก กลิ่นหญ้าฝรั่นและดอกไม้ไทยหอมผ่อนคลายทั้งห้องน้ำ',
    author: 'เอเลน่า ว.',
    city: 'ลอนดอน',
    soapName: 'วันฉัตรมงคล หญ้าฝรั่นและแกนทองคำ',
  },
  {
    quote: 'กล่องหินอ่อนลายหมากรุกงานเนี้ยบมาก เปิดมาเจอสบู่จริง 10 ก้อน บวบ 1 ชิ้น และเทียนหอม 50/50 เข้าคู่สวยหรู',
    author: 'พิมพ์ชนก ก.',
    city: 'สิงคโปร์',
    soapName: 'กล่องหินอ่อนลายหมากรุกเทศกาล',
  },
];

interface LanguageContextValue {
  lang: AppLanguage;
  activeButtonLang: AppLanguage;
  isLangTransitioning: boolean;
  setLang: (next: AppLanguage) => void;
  toggleLang: () => void;
  t: I18nUiStrings;
  translateIngredient: (name: string) => string;
  getSoapDisplay: (soap: SoapCreation) => {
    name: string;
    themeLabel: string;
    scentMood: string;
    crystalTitle: string;
    creamTitle: string;
    inlayLabel: string;
  };
  getCaseDisplay: (edition: MarbleCassetteEdition) => {
    shortTitle: string;
    name: string;
    description: string;
  };
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'th' || saved === 'en') return saved;
    } catch {
      // Ignore storage access failures
    }
    return 'th';
  });
  const [activeButtonLang, setActiveButtonLang] = useState<AppLanguage>(lang);
  const [isLangTransitioning, setIsLangTransitioning] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);
  const targetLangRef = useRef<AppLanguage>(lang);

  const t = lang === 'th' ? TH_STRINGS : EN_STRINGS;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.documentTitle;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access failures
    }
  }, [lang, t.documentTitle]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const setLang = useCallback((next: AppLanguage) => {
    if (next === targetLangRef.current && next === lang) return;
    targetLangRef.current = next;
    setActiveButtonLang(next);
    setIsLangTransitioning(true);

    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
    }

    fadeTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        setLangState(next);
      });
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsLangTransitioning(false);
        });
      });
    }, 125);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(targetLangRef.current === 'th' ? 'en' : 'th');
  }, [setLang]);

  const translateIngredient = useCallback(
    (name: string): string => {
      if (lang === 'en') return name;
      return INGREDIENT_TH[name] ?? name;
    },
    [lang],
  );

  const getSoapDisplay = useCallback(
    (soap: SoapCreation) => {
      if (lang === 'en') {
        return {
          name: soap.name,
          themeLabel: soap.holidayOccasion ?? soap.colorThemeLabel,
          scentMood: soap.scentMood,
          crystalTitle: soap.botanicalLayers.crystalTitle,
          creamTitle: soap.botanicalLayers.creamTitle,
          inlayLabel: soap.luxuryInlay.label,
        };
      }
      const copy = SOAP_THAI_COPY[soap.id];
      return {
        name: copy?.name ?? soap.thaiSubtitle ?? soap.name,
        themeLabel: copy?.themeLabel ?? soap.holidayOccasion ?? soap.colorThemeLabel,
        scentMood: copy?.scentMood ?? soap.scentMood,
        crystalTitle: copy?.crystalTitle ?? soap.botanicalLayers.crystalTitle,
        creamTitle: copy?.creamTitle ?? soap.botanicalLayers.creamTitle,
        inlayLabel: INLAY_LABELS_TH[soap.luxuryInlay.type] ?? soap.luxuryInlay.label,
      };
    },
    [lang],
  );

  const getCaseDisplay = useCallback(
    (edition: MarbleCassetteEdition) => {
      if (lang === 'en') {
        const shortTitle =
          edition.stoneType === 'bright-marble'
            ? 'Bright Roman Marble Case'
            : edition.stoneType === 'dark-marble'
              ? 'Dark Roman Marble Case'
              : 'Events Checkered Roman Case';
        return {
          shortTitle,
          name: edition.name,
          description: edition.description,
        };
      }
      return (
        MARBLE_CASE_TH[edition.id] ?? {
          shortTitle: edition.name,
          name: edition.name,
          description: edition.description,
        }
      );
    },
    [lang],
  );

  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      lang,
      activeButtonLang,
      isLangTransitioning,
      setLang,
      toggleLang,
      t,
      translateIngredient,
      getSoapDisplay,
      getCaseDisplay,
    }),
    [
      lang,
      activeButtonLang,
      isLangTransitioning,
      setLang,
      toggleLang,
      t,
      translateIngredient,
      getSoapDisplay,
      getCaseDisplay,
    ],
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
