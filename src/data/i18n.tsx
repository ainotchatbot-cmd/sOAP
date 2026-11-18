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
    themeLabel: 'ม่วงพลัมและงาช้าง · ชาและไข่มุก',
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
    name: 'น้ำนมมะพร้าวไทยและไข่มุก',
    themeLabel: 'ขาวงาช้างบริสุทธิ์ · มะพร้าวสกัดเย็น',
    scentMood: 'ครีมน้ำนมมะพร้าวบริสุทธิ์',
    crystalTitle: 'เจลน้ำมะพร้าวใสบริสุทธิ์',
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
    name: 'ไข่มุกมูนมิลค์และลาเวนเดอร์',
    themeLabel: 'ม่วงไข่มุกและขาว · หอยมุกและลาเวนเดอร์',
    scentMood: 'มูนมิลค์ลาเวนเดอร์และไข่มุก',
    crystalTitle: 'เจลใสไข่มุกน้ำจืด',
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
    name: 'ตรุษจีนส้มแมนดารินแดงและไข่มุกขาว',
    themeLabel: 'เทศกาลตรุษจีนมงคล',
    scentMood: 'ส้มแมนดารินหวานและครีมไข่มุก',
    crystalTitle: 'เจลแดงชาดส้มแมนดาริน',
    creamTitle: 'ครีมมะพร้าวไข่มุกนำโชค',
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
    name: 'ประกายมุกแชมเปญ โอปอล ชิมเมอร์',
    themeLabel: 'รุ่นพิเศษฉลองปีใหม่',
    scentMood: 'ดอกแพร์แชมเปญและอำพันขาว',
    crystalTitle: 'เจลริบบิ้นประกายมุกแชมเปญ',
    creamTitle: 'ครีมไข่มุกงาช้างเนียนนุ่ม',
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
  'Pearl Conchiolin': 'โปรตีนไข่มุกคอนชิโอลิน',
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
  'Pearl Calcium': 'แคลเซียมจากไข่มุก',
  'Damask Rose Petals': 'กลีบกุหลาบดามัสก์แท้',
  'Rosehip Oil': 'น้ำมันโรสฮิป',
  'Stardust Sparkle Mica': 'ไมก้าละอองดาวระยิบระยับ',
  'Rice Milk Protein': 'โปรตีนน้ำนมข้าว',
  'Roman Chamomile': 'คาโมมายล์โรมัน',
  'Freshwater Pearl': 'ไข่มุกน้ำจืดแท้',
  'Mineral Champagne Mica': 'ไมก้าแชมเปญประกายมุก',
  'Shea Nacre': 'เชียบัตเตอร์และหอยมุก',
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
  inspectBtn: 'เปิดตำรับ',
  reserveBtn: 'สั่งจอง',
  reservedBtn: 'เพิ่มลงถุงแล้ว',
  favAdd: 'บันทึกในรายการโปรด',
  favRemove: 'นำออกจากรายการโปรด',
  collectionEyebrow: 'คอลเลกชันสบู่แกะสลักแห่งความทรงจำ',
  collectionHeading: 'ดาร์ก · ไบรท์ · เทศกาลพิเศษ',
  allLinesTab: 'ทั้งหมด 3 ไลน์ (30)',
  darkTab: 'ดาร์ก (10)',
  brightTab: 'ไบรท์ (10)',
  occasionsTab: 'เทศกาล (10)',
  marbleCasesQuickTab: 'กล่องหินอ่อน (3)',
  sortLabel: 'จัดเรียงคลังสินค้า',
  sortEdition: 'เรียงตามลำดับสูตร I–X',
  sortGoldLeaf: 'เรียงตามทองคำเปลว (โรส / เยลโลว์)',
  sortScentDesc: 'ระดับความหอม: เข้ม → อ่อนโยน',
  sortScentAsc: 'ระดับความหอม: อ่อนโยน → เข้ม',
  sortNameAsc: 'เรียงตามชื่อ ก–ฮ / A–Z',
  goldFilterAll: 'ทองคำเปลวทั้งหมด',
  goldFilterRose: 'โรสโกลด์ 24K',
  goldFilterYellow: 'เยลโลว์โกลด์ 24K',
  inventoryReadoutPrefix: 'แสดง',
  inventoryReadoutSuffix: 'ก้อน จาก 3 ไลน์ · 3 กล่องหินอ่อน',
  darkColTitle: 'ไลน์ดาร์ก',
  darkColSub: 'กาแฟคั่วและถ่านไม้ไผ่',
  brightColTitle: 'ไลน์ไบรท์',
  brightColSub: 'น้ำนมบริสุทธิ์และอควา',
  occasionsColTitle: 'ไลน์เทศกาล',
  occasionsColSub: 'วันสำคัญและรุ่นพิเศษ',
  barsUnit: 'ก้อน',
  sizeSmall: 'เล็ก ฿600',
  sizeFull: 'ปกติ ฿1,000',
  sizeMega: 'จัมโบ้ ฿2,500',
  sizePopular: 'ยอดนิยม',
  casesEyebrow: '3 ไลน์ · กล่องหินอ่อนซิกเนเจอร์',
  casesHeading: '3 ไลน์สบู่และกล่องหินอ่อนบวบคู่',
  casesSubSummary: 'เรียงคู่ 3 ไลน์: หินอ่อนดำ · หินอ่อนขาว · ลายหมากรุกเทศกาล · สบู่จริง 10 ก้อน + บวบ 2 ช่อง',
  caseSortLabel: 'เรียงลำดับกล่องหินอ่อน',
  caseSortMatch: 'จับคู่ตาม 3 ไลน์ (ดาร์ก · ไบรท์ · เทศกาล)',
  caseSortBrightFirst: 'หินอ่อนขาวสว่างขึ้นก่อน',
  caseSortOccasionsFirst: 'รุ่นลายหมากรุกเทศกาลขึ้นก่อน',
  soapsAnd2Loofahs: 'สบู่ 10 ก้อน · บวบขัดผิว 2 ชิ้น',
  interiorLabel: 'ภายในกล่องหินอ่อน',
  interiorCountSuffix: 'ก้อน + ช่องวางบวบ 2 ช่อง',
  loofahTitle: 'ช่องวางบวบธรรมชาติ 2 ช่อง',
  loofahTapHint: 'แตะเพื่อสลับชนิดบวบขัดผิว',
  loofahSlotLabel: 'ช่องบวบที่ 0',
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
  bagApplePayNote: 'ชำระปลอดภัยผ่าน Stripe หรือเลือกบัตรเครดิต / พร้อมเพย์ด้านล่าง',
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
  occasionsSetTheme: 'ชุดกล่องหินอ่อน · ธีมเทศกาล',
  roseGoldLeafLabel: 'ทองคำเปลวโรสโกลด์ 24K (กินได้)',
  yellowGoldLeafLabel: 'ทองคำเปลวเยลโลว์โกลด์ 24K (กินได้)',
  diagonalGroovesLabel: 'ร่องขัดผิว 3 มิติแนวทแยง',
  engravedStampLabel: 'สลักชื่อแบรนด์เฉพาะก้อน',
  craftStandardHeading: 'มาตรฐานศิลปะสบู่ลักชัวรีทุกก้อน',
  modeSoapsBtn: 'สบู่ก้อนพฤกษศาสตร์',
  modeBathBombsBtn: 'บาธบอมบ์สปาแช่ตัว',
  bathHeroLine1: 'ดื่มด่ำในห้วงอ่างกำมะหยี่',
  bathHeroLine2: 'ตื่นรับผิวเปล่งประกายพอร์ซเลน',
  bathHeroSummary: 'ฟองอาบน้ำละมุนดุจม่านหมอกยามค่ำ ผสานกลิ่นไวน์วินเทจ น้ำนมละมุน และไออุ่นแห่งเกลือแร่เพื่อช่วงเวลาพักผ่อนอันแสนสงบ',
  bathExploreBtn: 'สำรวจบาธบอมบ์',
  bathCollectionEyebrow: 'พิธีกรรมสปาแช่ตัวและฟองฟู่ชวนฝัน',
  bathCollectionHeading: 'ดาร์ก · ไบรท์ · เทศกาลพิเศษ',
  bathDarkColSub: 'มนต์เสน่ห์ยามค่ำและความอบอุ่นลุ่มลึก',
  bathBrightColSub: 'น้ำนมรุ่งอรุณและแสงพอร์ซเลน',
  bathOccasionsColSub: 'คืนเฉลิมฉลองและฤดูกาลแห่งความสุข',
  bathBombsUnit: 'ก้อน',
  bathNutritionBtn: 'เปิดตำรับโอสถ',
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
  bathCasesHeading: 'กล่องหินอ่อนซิกเนเจอร์ 3 แบบ (9 ก้อนต่อกล่อง)',
  bathCasesSubSummary: 'แต่ละกล่องรวมครบ 3 ไลน์: ดาร์ก 3 ก้อน · ไบรท์ 3 ก้อน · เทศกาล 3 ก้อน พร้อมบวบขัดผิว 2 ชิ้น',
  bathCasesInteriorLabel: 'บาธบอมบ์ภายในกล่อง (3+3+3)',
  bathCasesInteriorCount: '9 ก้อน + บวบ 2 ชิ้น',
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
  scrollerAriaLabel: 'แถบเลื่อนสบู่ 3 สีแบบซ่อนอัตโนมัติ',
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
  socialSubtitle: 'อัปเดตโพสต์ที่ลูกค้าแท็ก @gentlebubble.ar บน Instagram ล่าสุดแบบเรียลไทม์',
  socialRefreshBtn: 'รีเฟรชโพสต์',
  socialViewPostBtn: 'ดูโพสต์บน Instagram',
  socialFollowLink: 'เยี่ยมชม @gentlebubble.ar',
  socialEmptyTitle: 'รอรับภาพแท็กใหม่จาก @gentlebubble.ar',
  socialEmptyDesc: 'ยังไม่มีโพสต์ที่ถูกแท็กล่าสุด ลองแท็ก @gentlebubble.ar บน Instagram เพื่อร่วมแบ่งปันประสบการณ์สปาของคุณ',
  socialAwaitingConfigDesc: 'โพสต์ที่ถูกแท็กจะปรากฏที่นี่โดยอัตโนมัติเมื่อเชื่อมต่อบัญชี Instagram Graph API บนเซิร์ฟเวอร์เรียบร้อยแล้ว',
  socialErrorDesc: 'ไม่สามารถเชื่อมต่อฟีดโพสต์แท็กจาก Instagram ได้ชั่วคราว กรุณาลองใหม่อีกครั้ง',
  socialRetryBtn: 'ลองดึงข้อมูลใหม่',
  socialTaggedPrefix: 'แท็กโดย',
  ledgerActionLabel: 'เปิดตำรับโอสถ',
  colophonEyebrow: 'เอกสารรับรองตำรับเมซง · พิมพ์ละเอียดบนกระดาษวินเทจ',
  colophonBannerTitle: 'บันทึกส่วนผสมและงานฝีมือเบื้องหลังความฝัน',
  colophonSoapsTitle: 'สิ่งที่ซ่อนอยู่ในฟองนุ่ม — ตำรับสกัดเย็น 50/50 และงานทองคำ 24K',
  colophonBombsTitle: 'สิ่งที่ซ่อนอยู่ในฟองฟู่ — ตำรับไวน์ น้ำนม แร่ธาตุ และวิตามิน A–Z',
  colophonSampleLedgerBtn: 'เปิดดูตัวอย่างสมุดบัญชีโอสถ',
  colophonReadAssayBtn: 'อ่านบันทึกสารสกัดฉบับเต็ม',
  colophonHideAssayBtn: 'พับเก็บบันทึกสารสกัด',
  colophonCol1Label: 'I. งานปรุงชีวภาพ (The Actives)',
  colophonCol2Label: 'II. งานแกะสลัก (The Craft)',
  colophonCol3Label: 'III. มาตรฐานผิว (Skin Balance)',
  colophonSoapsCol1Text: 'ผสานเจลใสพฤกษศาสตร์ 50% และครีมบัตเตอร์ออร์แกนิก 50% ด้วยกรดซาลิไซลิก ซัลเฟอร์ สควาเลน เลซิติน สไปรูลิน่า และน้ำนมมะพร้าว',
  colophonSoapsCol2Text: 'ทุกก้อนสลักตรา GentleBubble แกะสลักร่องขัดผิว 3 มิติแนวทแยง และประดับทองคำเปลวแท้ 24K โรสโกลด์หรือเยลโลว์โกลด์',
  colophonSoapsCol3Text: 'ควบคุมสมดุลผิวอ่อนโยนที่ pH 4.5–5.5 พร้อมของขวัญล้ำค่าภายในก้อน ทั้งไข่มุกแท้ ใยบวบสยาม หรือฟองน้ำไหมนุ่ม',
  colophonBombsCol1Text: 'อัดแน่นด้วยเรสเวอราทรอลจากไวน์ขาว-แดง น้ำนมอูฐ-นมแพะ สาหร่ายเคลป์ไอโอดีน บุกคอนยัค เห็ดชิตาเกะ กล้วย มันเทศ กระเทียม และโสม',
  colophonBombsCol2Text: 'ขึ้นรูปด้วยร่องเกลียว 3 มิติเพื่อเร่งการซึมผ่านและละลายในน้ำอุ่นภายใน 2.5–3.5 นาที พร้อมประทับตรา GentleBubble และทองคำ 24K',
  colophonBombsCol3Text: 'เสริมเกลือชมพูหิมาลัย เกลือดำเอปซอม วิตามินรวม A, C, D3, E, K2, B-Complex ครบชุด และเอนไซม์ผลไม้เพื่อผิวสว่างเนียน',
  colophonExpandedTitle: 'บันทึกห้องปฏิบัติการ GentleBubble โดยวิศวกรเทคโนโลยีชีวภาพ',
  colophonSoapsExpandedText: 'เบื้องหลังสัมผัสราวปุยเมฆคือการคำนวณอัตราส่วนอิมัลชันและค่า HLB ในห้องแล็บ เพื่อไม่ให้สารสกัดพฤกษศาสตร์สูญเสียฤทธิ์ขณะขึ้นรูป ทำให้คุณได้ดื่มด่ำกับความงามโดยไม่ต้องกังวลเรื่องผิวแห้งตึง',
  colophonBombsExpandedText: 'บาธบอมบ์ทั้ง 30 ตำรับถูกปรุงให้คงความเสถียรของวิตามิน C 1,000mg ไนอาซินาไมด์ แมกนีเซียม และแร่ธาตุทะเลจนวินาทีที่สัมผัสน้ำอุ่นในอ่าง เพื่อให้ทุกการแช่เป็นทั้งการพักผ่อนทางอารมณ์และการฟื้นบำรุงผิวอย่างแท้จริง',
  colophonBiotechFootnote: '— บันทึกโดย อาชาวี ฉัตรกุล ณ อยุธยา · วศ.บ. เทคโนโลยีชีวภาพ · ลาดพร้าว กรุงเทพฯ',
  ledgerHeading: 'สมุดบัญชีโอสถและสารสกัดเมซง',
  ledgerFolioPrefix: 'ระเบียนตำรับ',
  ledgerRitualTitle: 'สัมผัสแห่งการแช่และบำบัดผิว',
  navVault: 'คลังลับ 30 สูตร',
  scrollerTypeVault: 'คลังลับสมาชิก',
  vaultEyebrow: 'คลังลับเฉพาะสมาชิก · 60 สูตรคู่ปรับสภาพผิว',
  vaultLockedLine1: 'ห้องปรุงสูตรลับเฉพาะสมาชิก',
  vaultLockedLine2: 'ลงชื่อเข้าใช้เพื่อปลดล็อก 30 คู่แบรนด์',
  vaultLockedDesc: 'เข้าสู่ระบบด้วย Google เพื่อชมสบู่ก้อนและบาธบอมบ์สูตรเปอร์เซ็นต์ 30 แบรนด์เคียงคู่กัน พร้อมร่องวิกตอเรียนและตราประทับเฉพาะสูตร',
  vaultUnlockBtn: 'เข้าสู่ระบบ Google เพื่อเปิดคลังลับ',
  vaultUnlockedBadge: 'ปลดล็อกคลังลับสมาชิกแล้ว',
  vaultHeadingLine1: 'สบู่ก้อนและบาธบอมบ์เคียงคู่ 30 แบรนด์',
  vaultHeadingLine2: 'ร่องวิกตอเรียนและตราประทับสารสกัด %',
  vaultSublead: 'วางเคียงข้างกันครบทั้ง 30 สูตร 5 กลุ่มบำรุงผิว (60 SKUs) พร้อมร่องแกะสลักสไตล์วิกตอเรียนและตราประทับแบรนด์-เปอร์เซ็นต์บนเนื้อผลิตภัณฑ์',
  vaultKpiFormulations: 'สูตรเฉพาะ (Formulations)',
  vaultKpiCategories: 'กลุ่มบำรุงผิว (Categories)',
  vaultKpiProducts: 'สินค้ารวม (Paired SKUs)',
  vaultKpiBrands: 'แบรนด์ไลน์ (Brand Lines)',
  vaultAllFilter: 'ทุกกลุ่มบำรุงผิว (30)',
  vaultSearchPlaceholder: 'ค้นหาชื่อแบรนด์ สารสกัด % หรือตราประทับ...',
  vaultBarLabel: 'สบู่ก้อนร่องวิกตอเรียน',
  vaultBombLabel: 'บาธบอมบ์ตราประทับโค้ง',
  vaultBarStampTag: 'ตราประทับสบู่ ≤14',
  vaultBombStampTag: 'ตราประทับบอมบ์ ≤12',
  vaultGrooveStylePrefix: 'ร่องวิกตอเรียน',
  vaultReserveBar: 'สบู่ ฿950',
  vaultReserveBomb: 'บอมบ์ ฿750',
  vaultReservePair: 'จองคู่ (สบู่+บอมบ์)',
  vaultCountSuffix: 'คู่สูตรพิเศษพร้อมสั่งจอง',
  vaultEmptyMatch: 'ไม่พบสูตรคู่ที่ตรงกับตัวกรองในขณะนี้',
  vaultBoxesEyebrow: 'หีบหินอ่อนพิเศษสลักร่องวิกตอเรียน · อย่างละ 3 ชิ้น',
  vaultBoxesHeading: '3 หีบหินอ่อนวิกตอเรียน (สบู่ 3 ก้อน + บาธบอมบ์ 3 ลูก)',
  vaultBoxesSub: 'แกะร่องวิกตอเรียนแบบเดียวกับตัวผลิตภัณฑ์ตลอดขอบหีบหินอ่อน พร้อมบวบธรรมชาติ 2 ช่อง ริบบิ้นซาติน และป้ายทองเหลืองสลักชื่อ',
  vaultBoxesInteriorLabel: 'ชุดคู่ภายในหีบหินอ่อน (อย่างละ 3 ชิ้น)',
  vaultBoxesInteriorCount: 'สบู่ 3 ก้อน + บอมบ์ 3 ลูก + บวบ 2 ชิ้น',
  vaultReserveBoxBtn: 'สั่งจองหีบหินอ่อนวิกตอเรียน',
  vaultReservedBoxBtn: 'เพิ่มหีบหินอ่อนลงถุงแล้ว',
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
  explore30: 'Explore Sculpted Soaps',
  casesCta: '3 Marble Cases',
  dayMode: 'Cloud Day',
  nightMode: 'Twilight Night',
  inspectBtn: 'Apothecary Ledger',
  reserveBtn: 'Reserve',
  reservedBtn: 'Reserved',
  favAdd: 'Save favorite',
  favRemove: 'Remove favorite',
  collectionEyebrow: 'Collectible Savonnerie · Three Moods',
  collectionHeading: 'Dark · Bright · Occasions',
  allLinesTab: 'All 3 Lines (30)',
  darkTab: 'Dark (10)',
  brightTab: 'Bright (10)',
  occasionsTab: 'Occasions (10)',
  marbleCasesQuickTab: 'Marble Cases (3)',
  sortLabel: 'Sort Inventory',
  sortEdition: 'Edition Order (I–X)',
  sortGoldLeaf: 'Gold Leaf (Rose / Yellow)',
  sortScentDesc: 'Scent: Rich → Subtle',
  sortScentAsc: 'Scent: Subtle → Rich',
  sortNameAsc: 'Alphabetical A–Z',
  goldFilterAll: 'All Gold Leaf',
  goldFilterRose: '24k Rose Gold',
  goldFilterYellow: '24k Yellow Gold',
  inventoryReadoutPrefix: 'Showing',
  inventoryReadoutSuffix: 'bars across 3 Lines · 3 Marble Cases',
  darkColTitle: 'Dark Line',
  darkColSub: 'Roast & Carbon',
  brightColTitle: 'Bright Line',
  brightColSub: 'Milk & Aqua',
  occasionsColTitle: 'Occasions Line',
  occasionsColSub: 'Holidays & Gala',
  barsUnit: 'Bars',
  sizeSmall: 'Small ฿600',
  sizeFull: 'Full ฿1,000',
  sizeMega: 'Huge ฿2,500',
  sizePopular: 'Popular',
  casesEyebrow: '3 Lines · Marble Cases',
  casesHeading: '3 Lines & Signature Marble Cases',
  casesSubSummary: 'Aligned with the 3 Lines: Dark · Bright · Occasions · 10 Real Soaps + 2 Loofah Scrub Slots',
  caseSortLabel: 'Arrange Marble Cases',
  caseSortMatch: 'Match 3 Lines (Dark · Bright · Occasions)',
  caseSortBrightFirst: 'Bright Marble First',
  caseSortOccasionsFirst: 'Checkered Occasions First',
  soapsAnd2Loofahs: '10 Soaps · 2 Loofah Scrubs',
  interiorLabel: 'Case Interior Compartment',
  interiorCountSuffix: 'Soaps + 2 Loofah Holders',
  loofahTitle: '2 Carved Loofah Scrub Slots',
  loofahTapHint: 'Tap either slot to change scrub',
  loofahSlotLabel: 'Loofah Slot 0',
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
  bagEmptyDesc: 'Reserve any Dark, Bright, Occasion bar, or Marble Case with 2 loofah scrubs.',
  bagCheckoutHeader: 'GPS & Engraving Checkout',
  bagEditItems: 'Edit items',
  bagDeliveryLocation: 'Delivery Location',
  bagUseGps: 'Use GPS',
  bagGpsLocating: 'Locating...',
  bagGpsLocked: 'GPS Locked',
  bagAddressPlaceholder: 'Tap Use GPS or type street address...',
  bagLaserEngraving: 'Laser Engraving (Marble Lid / Bar Seal)',
  bagEngravingPlaceholder: 'Initials, date, or GentleBubble...',
  bagApplePayNote: 'Encrypted Stripe Checkout or pay below by Card / PromptPay',
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
  occasionsSetTheme: 'Occasions Line Marble Set',
  roseGoldLeafLabel: '24k Edible Rose Gold Leaf',
  yellowGoldLeafLabel: '24k Edible Yellow Gold Leaf',
  diagonalGroovesLabel: '3D Diagonal Scrub Grooves',
  engravedStampLabel: 'Custom Engraved Bar Seal',
  craftStandardHeading: 'Atelier Luxury Bar Craftsmanship',
  modeSoapsBtn: 'Artisan Bar Soaps',
  modeBathBombsBtn: 'Effervescent Bath Spheres',
  bathHeroLine1: 'Melt into Velvet Skies.',
  bathHeroLine2: 'Awaken in Porcelain Glow.',
  bathHeroSummary: 'Slow-risen bath spheres woven from vintage cellar notes, warm silk milk, and luminous dusk mist for an unhurried sanctuary.',
  bathExploreBtn: 'Explore Bath Spheres',
  bathCollectionEyebrow: 'Effervescent Soak Sanctuary · Three Moods',
  bathCollectionHeading: 'Dark · Bright · Holidays',
  bathDarkColSub: 'Velvet Dusk & Fireside Warmth',
  bathBrightColSub: 'Morning Milk & Sunlit Mist',
  bathOccasionsColSub: 'Candlelit & Gala Rituals',
  bathBombsUnit: 'Bombs',
  bathNutritionBtn: 'Apothecary Ledger',
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
  bathCasesHeading: 'Matching Marble Cases (9 Bombs Per Chest)',
  bathCasesSubSummary: 'Each coffret unites all 3 lines: 3 Dark + 3 Bright + 3 Holidays bath bombs + 2 natural loofah holders',
  bathCasesInteriorLabel: 'Coffret Interior (3 Dark · 3 Bright · 3 Holidays)',
  bathCasesInteriorCount: '9 Bombs + 2 Loofahs',
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
  scrollerAriaLabel: 'Three-color sablé soap bar scroller',
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
  socialSubtitle: 'Live tagged posts mentioning @gentlebubble.ar fetched directly from Instagram',
  socialRefreshBtn: 'Refresh Mentions',
  socialViewPostBtn: 'View on Instagram',
  socialFollowLink: 'Visit @gentlebubble.ar',
  socialEmptyTitle: 'Awaiting New Tagged Mentions',
  socialEmptyDesc: 'No tagged posts are returned yet. Tag @gentlebubble.ar on Instagram to share your bath ritual with our atelier.',
  socialAwaitingConfigDesc: 'Live tagged mentions from Instagram will appear here automatically once Instagram Graph API server credentials are connected.',
  socialErrorDesc: 'Unable to reach Instagram tagged mentions right now. Please try again.',
  socialRetryBtn: 'Retry Fetch',
  socialTaggedPrefix: 'Tagged by',
  ledgerActionLabel: 'Apothecary Ledger',
  colophonEyebrow: 'Archival Apothecary Provenance · Antique Fine Print',
  colophonBannerTitle: 'Hidden Beneath the Dream — Formulation & Craft Assay',
  colophonSoapsTitle: 'Inside the Silk Cloud — 50/50 Bio-Botanical Architecture & 24k Gold Leaf',
  colophonBombsTitle: 'Inside the Effervescence — Cellar Wines, Milks, Sea Kelp & Full A–Z Vitamins',
  colophonSampleLedgerBtn: 'Inspect Sample Elixir Ledger',
  colophonReadAssayBtn: 'Unfold Complete Assay',
  colophonHideAssayBtn: 'Fold Assay Notes',
  colophonCol1Label: 'I. Botanical Chemistry',
  colophonCol2Label: 'II. Sculpted Craft',
  colophonCol3Label: 'III. Skin Standard',
  colophonSoapsCol1Text: 'Each bar unites 50% translucent botanical crystal with 50% whipped butter infused with squalane, lecithin, salicylic BHA, sulfur, spirulina, and cold-pressed coconut milk.',
  colophonSoapsCol2Text: 'Individually debossed with the GentleBubble crown seal, hand-carved 3D diagonal scrub grooves, and authentic 24k edible rose or yellow gold leaf.',
  colophonSoapsCol3Text: 'Calibrated to skin-kind pH 4.5–5.5 with a hidden keepsake inside every bar: freshwater pearl, raw Siamese loofah, gold leaf, or silk sponge.',
  colophonBombsCol1Text: 'Enriched with red & white wine resveratrol, camel & goat milk peptides, green tea spirulina, sea kelp bio-iodine, konjac, shiitake, banana, yam, aged garlic & Korean ginseng.',
  colophonBombsCol2Text: 'Molded with debossed GentleBubble lettering and deep 3D spiral water grooves for rapid 2.5–3.5 minute warm-bath effervescence and mineral dispersion.',
  colophonBombsCol3Text: 'Fortified with USP pink Himalayan & black Kala Namak Epsom salts, complete Vitamins A–Z (C, D3, E, K2, B-Complex), and gentle fruit enzymes.',
  colophonExpandedTitle: 'Biotechnology Studio Notes — Formulated by Archawee',
  colophonSoapsExpandedText: 'Hidden behind every poetic scent cloud is precise formulation engineering—balancing gentle cleansers, barrier lipids, and mineral pigments so your skin feels calm, luminous, and never stripped.',
  colophonBombsExpandedText: 'Every 220g bath sphere stabilizes high-potency brightening vitamins (Vitamin C 1,000mg, Niacinamide B3), marine iodine, and trace electrolytes in dry botanical butter until the moment warm water awakens the soak.',
  colophonBiotechFootnote: '— Attested by Archawee Chatkul Na Ayutthaya · B.Eng. Biotechnology · Lad Phrao, Bangkok',
  ledgerHeading: 'Atelier Apothecary Elixir Ledger',
  ledgerFolioPrefix: 'Folio',
  ledgerRitualTitle: 'Soak Atmosphere & Luminosity',
  navVault: 'Secret Vault',
  scrollerTypeVault: 'Secret Vault',
  vaultEyebrow: 'Members-Only Private Vault · 60 Paired SKUs',
  vaultLockedLine1: 'Members-Only Secret Store.',
  vaultLockedLine2: 'Sign In to Reveal 30 Clinical Pairings.',
  vaultLockedDesc: 'Log in with Google to enter our private vault of 30 matched Bar Soaps & Bath Bombs—individually embossed with brand stamps, active percentages, and sculpted Victorian grooves.',
  vaultUnlockBtn: 'Sign In with Google to Unlock Vault',
  vaultUnlockedBadge: 'Member Vault Unlocked',
  vaultHeadingLine1: '30 Matched Bar Soaps & Bath Bombs.',
  vaultHeadingLine2: 'Victorian Grooves & Active % Engravings.',
  vaultSublead: 'Paired side by side across 5 skin-benefit categories (60 SKUs), complete with ornate Victorian channels and debossed mold stamps.',
  vaultKpiFormulations: 'Total Formulations',
  vaultKpiCategories: 'Benefit Categories',
  vaultKpiProducts: 'Total Paired SKUs',
  vaultKpiBrands: 'Unique Brand Lines',
  vaultAllFilter: 'All Benefits (30)',
  vaultSearchPlaceholder: 'Search brand, active % formula, or stamp...',
  vaultBarLabel: 'Victorian Bar Soap',
  vaultBombLabel: 'Curved Bath Bomb',
  vaultBarStampTag: 'Bar Stamp ≤14',
  vaultBombStampTag: 'Bomb Stamp ≤12',
  vaultGrooveStylePrefix: 'Victorian Groove',
  vaultReserveBar: 'Bar ฿950',
  vaultReserveBomb: 'Bomb ฿750',
  vaultReservePair: 'Paired Duo',
  vaultCountSuffix: 'paired formulations unlocked',
  vaultEmptyMatch: 'No formulations match your current filter.',
  vaultBoxesEyebrow: '3 Special Victorian-Grooved Marble Boxes · 3 of Each',
  vaultBoxesHeading: 'Victorian Marble Coffrets (3 Soaps + 3 Bath Bombs)',
  vaultBoxesSub: 'Hand-carved solid marble chests embossed with matching Victorian grooves around the stone casing—paired with 3 matching bars, 3 grooved bombs, and 2 natural loofah pads.',
  vaultBoxesInteriorLabel: 'Inside Coffret (3 Matched Pairings)',
  vaultBoxesInteriorCount: '3 Soaps + 3 Bombs + 2 Loofahs',
  vaultReserveBoxBtn: 'Reserve Victorian Marble Box',
  vaultReservedBoxBtn: 'Reserved Marble Box',
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
  pearl: 'ไข่มุกแท้ 1 เม็ด',
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
    shortTitle: 'กล่องหินอ่อนสว่าง',
    name: 'กล่องหินอ่อนสว่าง · สบู่ 10 ก้อน + บวบ 2 ชิ้น',
    description: 'กล่องหินอ่อนขาวคาลากัตตาแกะสลัก บรรจุสบู่ไลน์ไบรท์ครบ 10 ก้อนพร้อมช่องบวบขัดผิว 2 ช่อง',
  },
  'cassette-dark-marble-loofah': {
    shortTitle: 'กล่องหินอ่อนดำ',
    name: 'กล่องหินอ่อนดำ · สบู่ 10 ก้อน + บวบ 2 ชิ้น',
    description: 'กล่องหินอ่อนดำเนโร มาร์ควินา บรรจุสบู่ไลน์ดาร์กครบ 10 ก้อนพร้อมช่องบวบขัดผิว 2 ช่อง',
  },
  'cassette-checkered-occasions-loofah': {
    shortTitle: 'กล่องลายหมากรุกเทศกาล',
    name: 'กล่องหินอ่อนลายหมากรุก · สบู่เทศกาล 10 ก้อน + บวบ 2 ชิ้น',
    description: 'หีบหินอ่อนลายตารางสลับขาวดำซิกเนเจอร์ บรรจุสบู่เทศกาลครบ 10 ก้อนพร้อมบวบธรรมชาติ 2 ชิ้น',
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
    shortTitle: 'ไข่มุกและน้ำนมมะพร้าว',
    specDetail: 'กรดอะมิโนจากไข่มุกน้ำจืดและน้ำนมมะพร้าวไทยสกัดเย็น',
  },
};

export const REVIEWS_TH = [
  {
    quote: 'ฟองนุ่มละมุนเหมือนวิปครีม ล้างออกแล้วผิวชุ่มชื้นไม่แห้งตึงเลย',
    author: 'ณัชชา ส.',
    city: 'กรุงเทพฯ',
    soapName: 'น้ำนมมะพร้าวไทยและไข่มุก',
  },
  {
    quote: 'แกนทองคำสวยประณีตมาก กลิ่นหญ้าฝรั่นและดอกไม้ไทยหอมผ่อนคลายทั้งห้องน้ำ',
    author: 'เอเลน่า ว.',
    city: 'ลอนดอน',
    soapName: 'วันฉัตรมงคล หญ้าฝรั่นและแกนทองคำ',
  },
  {
    quote: 'กล่องหินอ่อนลายหมากรุกงานเนี้ยบมาก เปิดมาเจอสบู่จริง 10 ก้อนกับบวบคู่สวยหรู',
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
            ? 'Bright Marble Case'
            : edition.stoneType === 'dark-marble'
              ? 'Dark Marble Case'
              : 'Occasions Checkered Case';
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
