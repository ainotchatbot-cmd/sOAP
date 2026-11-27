export type EngravingGrooveKind = 'diagonal' | 'era-inspired' | 'futuristic-fractal';

export const GROOVE_SPECS: Record<
  EngravingGrooveKind,
  { en: string; th: string; shortEn: string; shortTh: string }
> = {
  diagonal: {
    en: '3D Diagonal Botanical Channels',
    th: 'ร่องขัดผิว 3 มิติแนวทแยง',
    shortEn: 'Diagonal Grooves',
    shortTh: 'ร่องแนวทแยง',
  },
  'era-inspired': {
    en: 'Era-Inspired Architectural Relief',
    th: 'ร่องสลักศิลปะประจำยุค',
    shortEn: 'Era-Inspired Relief',
    shortTh: 'ร่องศิลปะประจำยุค',
  },
  'futuristic-fractal': {
    en: 'Futuristic Roundish Fractal Ripple Grooves',
    th: 'ร่องวงโค้งฟรักทัลล้ำสมัย',
    shortEn: 'Fractal Grooves',
    shortTh: 'ร่องฟรักทัลโค้ง',
  },
};
