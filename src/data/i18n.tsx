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
  storyHandPoured: string;
  storyKeepsakeSeal: string;
  storyCustomCrest: string;
  storyPlaceholder: string;
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
  heroLine1: 'อาบฟองนุ่มดุจเมฆ',
  heroLine2: 'เปล่งประกายดุจแพรไหม',
  heroSummary: '10 ดาร์ก · 10 ไบรท์ · 10 เทศกาล · 3 กล่องหินอ่อนพร้อมบวบธรรมชาติ',
  explore30: 'สำรวจสบู่ 30 สูตร',
  casesCta: '3 กล่องหินอ่อน',
  dayMode: 'โหมดกลางวัน',
  nightMode: 'โหมดยามค่ำ',
  inspectBtn: 'ดูส่วนผสม',
  reserveBtn: 'สั่งจอง',
  reservedBtn: 'เพิ่มลงถุงแล้ว',
  favAdd: 'บันทึกในรายการโปรด',
  favRemove: 'นำออกจากรายการโปรด',
  collectionEyebrow: '30 สูตรสบู่พฤกษศาสตร์ · 10 / 10 / 10',
  collectionHeading: 'ดาร์ก · ไบรท์ · เทศกาลพิเศษ',
  allLinesTab: 'ทั้งหมด 3 ไลน์ (30)',
  darkTab: 'ดาร์ก (10)',
  brightTab: 'ไบรท์ (10)',
  occasionsTab: 'เทศกาล (10)',
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
  casesEyebrow: '3 กล่องหินอ่อนซิกเนเจอร์',
  casesHeading: 'กล่องหินอ่อนและบวบขัดผิวคู่',
  casesSubSummary: 'หินอ่อนขาว · หินอ่อนดำ · ลายหมากรุกเทศกาล · สบู่จริง 10 ก้อน + บวบ 2 ช่อง',
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
  storyHandPoured: 'เทมือทุกก้อนอย่างประณีตโดย',
  storyKeepsakeSeal: 'ตราประทับซาวงเนอรี',
  storyCustomCrest: 'ทดลองสลักชื่อบนตราประทับ',
  storyPlaceholder: 'กรอกข้อความบนตราประทับ...',
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
  modalDualStandard: 'มาตรฐานสบู่ทูโทน 50/50',
  modalBenefits: 'มาตรฐานคุณประโยชน์เชิงภาพ',
  modalScent: 'ความหอมระดับ',
  modalActiveRatios: 'สัดส่วนสารสำคัญและเบส',
  modalBotanicalVisuals: 'สารสกัดพฤกษศาสตร์หลัก',
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
  heroLine1: 'Wash in Clouds.',
  heroLine2: 'Bloom in Silk.',
  heroSummary: '10 Dark · 10 Bright · 10 Occasions · 3 Marble Loofah Cases',
  explore30: 'Explore 30 Bars',
  casesCta: '3 Marble Cases',
  dayMode: 'Cloud Day',
  nightMode: 'Twilight Night',
  inspectBtn: 'Inspect',
  reserveBtn: 'Reserve',
  reservedBtn: 'Reserved',
  favAdd: 'Save favorite',
  favRemove: 'Remove favorite',
  collectionEyebrow: '30 Creations · 10 / 10 / 10',
  collectionHeading: 'Dark · Bright · Occasions',
  allLinesTab: 'All 3 Lines (30)',
  darkTab: 'Dark (10)',
  brightTab: 'Bright (10)',
  occasionsTab: 'Occasions (10)',
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
  casesEyebrow: '3 Signature Cases',
  casesHeading: 'Marble Cases & Dual Loofahs',
  casesSubSummary: 'Bright · Dark · Checkered Occasions · 10 Real Soaps + 2 Loofah Scrub Slots',
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
  storyHandPoured: 'Hand-poured by',
  storyKeepsakeSeal: 'Keepsake Seal',
  storyCustomCrest: 'Custom Crest Preview',
  storyPlaceholder: 'Enter custom stamp text',
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
  modalDualStandard: '50/50 Dual Bar Visual Standard',
  modalBenefits: 'Visual Benefit Standards',
  modalScent: 'Scent',
  modalActiveRatios: 'Active & Base Ratios',
  modalBotanicalVisuals: 'Botanical Active Visuals',
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
