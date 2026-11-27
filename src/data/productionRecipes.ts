import {
  ALL_SOAP_CREATIONS,
  MARBLE_CASSETTE_SETS,
  SOAP_BY_ID,
  SoapCreation,
} from './soaps';
import {
  ALL_BATH_BOMBS,
  BATH_BOMB_BY_ID,
  BATH_BOMB_MARBLE_CASES,
  BathBombCreation,
} from './bathBombs';
import {
  ART_ERA_BY_ID,
  VAULT_MARBLE_BOXES,
  VAULT_PAIR_BY_ID,
  VAULT_PAIRED_FORMULATIONS,
  VaultPairedFormulation,
} from './memberVaultCatalog';
import type { AtelierOrderLineItem, AtelierOrderRecord } from '../services/atelierStoreService';

export type MakerProductCategory =
  | 'soap-bar'
  | 'bath-bomb'
  | 'vault-pair'
  | 'marble-box';

export type CureMethodType = 'press-30-days' | 'deep-freeze-chill' | 'hybrid-press-freeze';

export interface ProductionStep {
  id: string;
  stepNumber: number;
  phase: '3d-print' | 'procurement' | 'compounding' | 'molding' | 'cure-freeze' | 'finishing';
  title: string;
  actionDetail: string;
  durationBadge: string;
  tempOrSetting?: string;
}

export interface MaterialLineItem {
  id: string;
  category: '3d-mold' | 'gold-inlay' | 'glycerin-base' | 'bath-salts' | 'oats-honey' | 'actives-oils' | 'packaging';
  label: string;
  amount: string;
  gramsNumeric?: number;
  orderNeeded?: boolean;
}

export interface ProductMakerBlueprint {
  skuKey: string;
  editionId: string;
  category: MakerProductCategory;
  title: string;
  subtitle: string;
  imageUrl: string;
  quantity: number;
  unitWeightGrams: number;
  totalBatchGrams: number;
  cureMethod: CureMethodType;
  moldSpec: string;
  engravingStamp: string;
  goldLeafSpec: string;
  pressDuration: string;
  deepFreezeDuration: string;
  rackCureDuration: string;
  materials: MaterialLineItem[];
  steps: ProductionStep[];
  subItems?: ProductMakerBlueprint[];
}

export interface OrderCombinedPrepSummary {
  totalUnits: number;
  totalBatchGrams: number;
  moldsToPrint: string[];
  goldAndInlaysToOrder: string[];
  totalGlycerinGrams: number;
  totalCreamOrFizzGrams: number;
  totalBathSaltsGrams: number;
  totalOatsHoneyGrams: number;
  maxCureDays: number;
  requiresDeepFreeze: boolean;
  requires30DayPress: boolean;
}

const VICTORIAN_GROOVE_LABELS: Record<string, string> = {
  'fluted-crest': 'Victorian Fluted Crest Sleeve + Raised Medallion Rim',
  'crown-filigree': 'Royal Crown Filigree Collar + Beaded Oval Recess',
  'botanical-scroll': 'Acanthus Botanical Scroll Wall Insert',
  'lattice-cameo': 'Roman Lattice & Cameo Frame Relief Collar',
  'imperial-ribbed': 'Imperial Ribbed Pillar Grooves + Crest Seal',
};

function formatGrams(g: number): string {
  if (g >= 1000) {
    return `${(g / 1000).toFixed(2)} kg (${Math.round(g)} g)`;
  }
  return `${Math.round(g * 10) / 10} g`;
}

function detectSoapWeightTier(cartKey: string): { label: string; grams: number } {
  if (cartKey.endsWith('__small')) return { label: '100g Travel Cut', grams: 100 };
  if (cartKey.endsWith('__mega')) return { label: '300g Atelier Reserve Block', grams: 300 };
  return { label: '150g Architectural 50/50 Bar', grams: 150 };
}

function detectBombPackCount(cartKey: string): { label: string; spheresPerUnit: number } {
  if (cartKey.endsWith('__coffer')) return { label: '4-Sphere Atelier Coffer', spheresPerUnit: 4 };
  if (cartKey.endsWith('__duo')) return { label: '2-Sphere Duo', spheresPerUnit: 2 };
  return { label: 'Single 180g Sphere', spheresPerUnit: 1 };
}

function buildSoapBlueprint(
  soap: SoapCreation,
  quantity: number,
  cartKey: string,
  giftNote?: string,
  orderPrefix = 'item',
): ProductMakerBlueprint {
  const tier = detectSoapWeightTier(cartKey);
  const totalGrams = tier.grams * quantity;
  const crystalGrams = totalGrams * 0.5;
  const creamGrams = totalGrams * 0.5;

  const hasOatsOrHoney =
    soap.ingredients.some((i) => /oat|honey|milk|cacao|mud|salt|clay/i.test(i)) ||
    soap.bioActives.actives.some((i) => /oat|honey|sulfur|salicylic/i.test(i));
  const hasSalt = soap.ingredients.some((i) => /salt|mineral|epsom/i.test(i));
  const oatsHoneyGrams = hasOatsOrHoney ? Math.round(totalGrams * 0.12) : 0;
  const bathSaltGrams = hasSalt ? Math.round(totalGrams * 0.08) : 0;

  const isGoldLeaf = soap.luxuryInlay.type === 'gold-leaf';
  const goldLeafType =
    soap.edibleGoldLeaf === 'rose-gold' ? '24k Edible Rose Gold Leaf' : '24k Edible Yellow Gold Leaf';
  const goldSheetsNeeded = isGoldLeaf ? Math.max(1, quantity) : 0;

  const stampText = giftNote?.trim()
    ? giftNote.trim().toUpperCase().slice(0, 18)
    : `AR · ${soap.editionNumber}`;

  const cureMethod: CureMethodType = hasOatsOrHoney ? 'hybrid-press-freeze' : 'deep-freeze-chill';
  const pressDuration = hasOatsOrHoney ? 'Hydraulic Cold-Cream Press + 30-Day Cedar Cure' : 'Silicone Seam Clamp · 4 hrs';
  const deepFreezeDuration = 'Deep Freeze -18°C · 45 mins (clean silicone release & bubbles lock)';
  const rackCureDuration = hasOatsOrHoney ? '30 Days ventilated cedar rack (20°C / 45% RH)' : '48 hrs curing rack harden before wax wrap';

  const materials: MaterialLineItem[] = [
    {
      id: `${orderPrefix}_mold`,
      category: '3d-mold',
      label: `3D Print Architectural 50/50 Mold (${tier.label}) + Brass Stamp Die "${stampText}"`,
      amount: `${Math.min(quantity, 4)} cavity mold set`,
      orderNeeded: true,
    },
    ...(isGoldLeaf
      ? [
          {
            id: `${orderPrefix}_gold`,
            category: 'gold-inlay' as const,
            label: `${goldLeafType} (Order / Pull Certified Cosmetic Gold Sheets)`,
            amount: `${goldSheetsNeeded} sheet${goldSheetsNeeded > 1 ? 's' : ''} (${quantity} seam strips)`,
            orderNeeded: true,
          },
        ]
      : [
          {
            id: `${orderPrefix}_inlay`,
            category: 'gold-inlay' as const,
            label: `Pull Signature Inlay: ${soap.luxuryInlay.label}`,
            amount: `${quantity} × portion (${soap.luxuryInlay.whisperDetail})`,
            orderNeeded: true,
          },
        ]),
    {
      id: `${orderPrefix}_glyc`,
      category: 'glycerin-base',
      label: `Clear Botanical Suspension Glycerin Base (${soap.botanicalLayers.crystalTitle})`,
      amount: formatGrams(crystalGrams),
      gramsNumeric: crystalGrams,
    },
    {
      id: `${orderPrefix}_cream`,
      category: 'glycerin-base',
      label: `Whipped Cream & Syndet Half (${soap.botanicalLayers.creamTitle})`,
      amount: formatGrams(creamGrams),
      gramsNumeric: creamGrams,
    },
    ...(oatsHoneyGrams > 0
      ? [
          {
            id: `${orderPrefix}_oats_honey`,
            category: 'oats-honey' as const,
            label: 'Raw Wildflower Honey + Colloidal & Rolled Oats Blend',
            amount: formatGrams(oatsHoneyGrams),
            gramsNumeric: oatsHoneyGrams,
          },
        ]
      : []),
    ...(bathSaltGrams > 0
      ? [
          {
            id: `${orderPrefix}_salts`,
            category: 'bath-salts' as const,
            label: 'Micro-Milled Mineral / Sea Salt Actives',
            amount: formatGrams(bathSaltGrams),
            gramsNumeric: bathSaltGrams,
          },
        ]
      : []),
    {
      id: `${orderPrefix}_actives`,
      category: 'actives-oils',
      label: `Clinical Actives & Fragrance: ${soap.bioActives.actives.join(', ')}`,
      amount: `${formatGrams(totalGrams * 0.06)} total dose (${soap.scentMood})`,
    },
    {
      id: `${orderPrefix}_pack`,
      category: 'packaging',
      label: 'Acid-free Glassine Parchment + Maison AR Wax Seal',
      amount: `${quantity} wrap set`,
    },
  ];

  const steps: ProductionStep[] = [
    {
      id: `${orderPrefix}_s1`,
      stepNumber: 1,
      phase: '3d-print',
      title: `3D Print 50/50 Mold Cavity & Engraving Stamp Die`,
      actionDetail: `Print food-safe PETG master housing (${tier.label}) with vertical split baffle & engraved relief plate reading "${stampText}". Pour platinum-cure silicone liner if printing new cavity.`,
      durationBadge: 'Print ~1 hr 40 min',
      tempOrSetting: '0.16mm layer · 240°C PETG',
    },
    {
      id: `${orderPrefix}_s2`,
      stepNumber: 2,
      phase: 'procurement',
      title: isGoldLeaf
        ? `Order / Pull ${goldLeafType} & Key Botanicals`
        : `Stage ${soap.luxuryInlay.label} & Active Botanicals`,
      actionDetail: `Prepare ${goldLeafType} (${goldSheetsNeeded} sheets) or ${soap.luxuryInlay.label}, plus ${soap.ingredients.join(', ')}. Verify skin-safe pH 5.5 buffer strips.`,
      durationBadge: 'Prep 15 min',
    },
    {
      id: `${orderPrefix}_s3`,
      stepNumber: 3,
      phase: 'compounding',
      title: `Melt & Pour Crystal Glycerin Half (${formatGrams(crystalGrams)})`,
      actionDetail: `Warm botanical suspension glycerin gently to 68°C. Cool to 58°C, suspend actives (${soap.botanicalLayers.crystalTitle}), spritz surface with 99% isopropyl to clear bubbles, and pour Half A into tilted mold.`,
      durationBadge: 'Pour & Skin-Set 25 min',
      tempOrSetting: 'Melt 68°C · Pour 58°C',
    },
    {
      id: `${orderPrefix}_s4`,
      stepNumber: 4,
      phase: 'molding',
      title: `Add Oats/Honey & Pour Cream Half (${formatGrams(creamGrams)})`,
      actionDetail: `Melt shea/coconut cream base at 62°C; fold in ${oatsHoneyGrams > 0 ? `${formatGrams(oatsHoneyGrams)} raw honey & oatmeal` : 'bio-actives'} + ${soap.bioActives.headlineCompound}. Score crystal seam, mist alcohol, and pour Half B.`,
      durationBadge: 'Compounding 20 min',
      tempOrSetting: 'Pour 54°C · pH 5.5–6.2',
    },
    {
      id: `${orderPrefix}_s5`,
      stepNumber: 5,
      phase: 'cure-freeze',
      title: hasOatsOrHoney
        ? `Deep Freeze Release (45 min) + Press & Cure 30 Days`
        : `Deep Freeze Flash Release (-18°C · 45 min) + 48h Rack Harden`,
      actionDetail: hasOatsOrHoney
        ? `Transfer sealed mold to Deep Freezer (-18°C) for 45 mins for crisp 50/50 edge release. Demold onto breathable cedar racks and press/cure 30 days at 20°C / 45% RH so moisture stabilizes cleanly.`
        : `Chill in Deep Freezer (-18°C) for 45 mins so translucent crystal pops free without clouding. Rest 48 hrs on drying trays before wrapping.`,
      durationBadge: hasOatsOrHoney ? 'Freeze 45m + Cure 30d' : 'Freeze 45m + Cure 48h',
      tempOrSetting: '-18°C Flash · 20°C Cure',
    },
    {
      id: `${orderPrefix}_s6`,
      stepNumber: 6,
      phase: 'finishing',
      title: `Stamp "${stampText}", Gild Gold Leaf & Seal`,
      actionDetail: `Press warmed brass die ("${stampText}") cleanly onto beveled bar face. Apply ${isGoldLeaf ? goldLeafType : soap.luxuryInlay.label} delicately along the 50/50 divide, wrap in vintage glassine parchment, and seal.`,
      durationBadge: 'Finish 10 min / bar',
    },
  ];

  return {
    skuKey: cartKey,
    editionId: soap.id,
    category: 'soap-bar',
    title: `${soap.name} (${tier.label})`,
    subtitle: `${soap.formulaBrand} · ${soap.bioActives.headlineCompound}`,
    imageUrl: soap.imageUrl,
    quantity,
    unitWeightGrams: tier.grams,
    totalBatchGrams: totalGrams,
    cureMethod,
    moldSpec: `3D-Printed 50/50 Vertical Split Block (${tier.label})`,
    engravingStamp: stampText,
    goldLeafSpec: isGoldLeaf ? `${goldLeafType} × ${goldSheetsNeeded} sheets` : soap.luxuryInlay.label,
    pressDuration,
    deepFreezeDuration,
    rackCureDuration,
    materials,
    steps,
  };
}

function buildBathBombBlueprint(
  bomb: BathBombCreation,
  quantity: number,
  cartKey: string,
  orderPrefix = 'item',
): ProductMakerBlueprint {
  const pack = detectBombPackCount(cartKey);
  const totalSpheres = quantity * pack.spheresPerUnit;
  const totalGrams = totalSpheres * 180;

  const bicarbGrams = Math.round(totalGrams * 0.48);
  const citricGrams = Math.round(totalGrams * 0.24);
  const bathSaltGrams = Math.round(totalGrams * 0.14);
  const clayStarchGrams = Math.round(totalGrams * 0.08);
  const liquidOilHoneyGrams = Math.round(totalGrams * 0.06);

  const goldType =
    bomb.edibleGoldLeaf === 'rose-gold' ? '24k Edible Rose Gold Leaf' : '24k Edible Yellow Gold Leaf';

  const materials: MaterialLineItem[] = [
    {
      id: `${orderPrefix}_mold`,
      category: '3d-mold',
      label: `3D Print 70mm Spherical Press Mold + Victorian Rim Stamp ("AR · ${bomb.editionNumber}")`,
      amount: `${Math.min(totalSpheres, 6)} 2-piece sphere molds`,
      orderNeeded: true,
    },
    {
      id: `${orderPrefix}_gold`,
      category: 'gold-inlay',
      label: `${goldType} + Botanical Shimmer (${bomb.waterHueNameEn})`,
      amount: `${totalSpheres} core strips + mica dust`,
      orderNeeded: true,
    },
    {
      id: `${orderPrefix}_fizz`,
      category: 'glycerin-base',
      label: 'USP Sodium Bicarbonate + Anhydrous Citric Acid + Kaolin',
      amount: `${formatGrams(bicarbGrams + citricGrams + clayStarchGrams)}`,
      gramsNumeric: bicarbGrams + citricGrams + clayStarchGrams,
    },
    {
      id: `${orderPrefix}_salts`,
      category: 'bath-salts',
      label: 'Epsom Magnesium Sulfate + Dead Sea & Pink Mineral Bath Salts',
      amount: formatGrams(bathSaltGrams),
      gramsNumeric: bathSaltGrams,
    },
    {
      id: `${orderPrefix}_wet`,
      category: 'oats-honey',
      label: 'Cold-Pressed Almond Oil, Glycerin Binder, Raw Honey Mist & Polysorbate-80',
      amount: formatGrams(liquidOilHoneyGrams),
      gramsNumeric: liquidOilHoneyGrams,
    },
    {
      id: `${orderPrefix}_actives`,
      category: 'actives-oils',
      label: `28-Vitamin Complex: ${bomb.heroActivesEn}`,
      amount: `${totalSpheres} × multi-vitamin ampoule doses`,
    },
  ];

  const steps: ProductionStep[] = [
    {
      id: `${orderPrefix}_s1`,
      stepNumber: 1,
      phase: '3d-print',
      title: `3D Print 70mm Press Hemispheres (${totalSpheres} Spheres)`,
      actionDetail: `Print high-infill PETG spherical press hemispheres with interlocking alignment pins and raised "AR · ${bomb.editionNumber}" equatorial embossing collar.`,
      durationBadge: 'Print ~55 min',
      tempOrSetting: '40% gyroid infill · PETG',
    },
    {
      id: `${orderPrefix}_s2`,
      stepNumber: 2,
      phase: 'procurement',
      title: `Order / Stage ${goldType}, Bath Salts & 28-Vitamin Matrix`,
      actionDetail: `Stage ${goldType} (${totalSpheres} gold cores), fine Epsom/Himalayan salts (${formatGrams(bathSaltGrams)}), ${bomb.heroActivesEn}, and food-grade water-soluble pigment (${bomb.waterHueNameEn}).`,
      durationBadge: 'Prep 15 min',
    },
    {
      id: `${orderPrefix}_s3`,
      stepNumber: 3,
      phase: 'compounding',
      title: `Sift Dry Salts & Blend Wet Oils + Actives`,
      actionDetail: `Sift ${formatGrams(bicarbGrams)} baking soda, ${formatGrams(citricGrams)} citric acid, ${formatGrams(bathSaltGrams)} bath salts, and ${formatGrams(clayStarchGrams)} kaolin clay. Slowly mist ${formatGrams(liquidOilHoneyGrams)} carrier oil + glycerin + vitamin actives until mix holds firm "damp sand" texture.`,
      durationBadge: 'Mix 20 min',
      tempOrSetting: 'Room Humidity < 38%',
    },
    {
      id: `${orderPrefix}_s4`,
      stepNumber: 4,
      phase: 'molding',
      title: `Gild Mold Wall & Hydraulic / Pneumatic Sphere Press`,
      actionDetail: `Place ${goldType} ribbon along inner hemisphere cup. Over-mound both halves loosely, sandwich together inside 3D-printed press collar, and apply firm 60kg hydraulic/clamp press (do NOT twist).`,
      durationBadge: 'Press 15 sec / sphere',
      tempOrSetting: 'High-Density Press',
    },
    {
      id: `${orderPrefix}_s5`,
      stepNumber: 5,
      phase: 'cure-freeze',
      title: `Deep Freeze Flash-Lock (45 min) + Dehumidified Tray Cure`,
      actionDetail: `Place pressed molds into Deep Freezer (-18°C) for 45 mins to crystallize binders and prevent citric premature fizz. Unmold delicately onto perforated trays and harden for 48–72 hrs before shrink wrapping.`,
      durationBadge: 'Freeze 45m + Cure 48h',
      tempOrSetting: '-18°C Freeze · <35% RH Cure',
    },
    {
      id: `${orderPrefix}_s6`,
      stepNumber: 6,
      phase: 'finishing',
      title: `Shrink-Seal, Label Nutrition Ledger & Pack (${pack.label})`,
      actionDetail: `Seal spheres in crystal moisture-barrier film, attach the Vintage Apothecary Vitamin Ledger tag, and pack inside cushioned velvet tray.`,
      durationBadge: 'Finish 10 min',
    },
  ];

  return {
    skuKey: cartKey,
    editionId: bomb.id,
    category: 'bath-bomb',
    title: `${bomb.nameEn} (${pack.label})`,
    subtitle: `${bomb.heroActivesEn} · ${bomb.waterHueNameEn}`,
    imageUrl: bomb.imageUrl,
    quantity,
    unitWeightGrams: 180 * pack.spheresPerUnit,
    totalBatchGrams: totalGrams,
    cureMethod: 'deep-freeze-chill',
    moldSpec: `3D-Printed 70mm 2-Part Sphere Press Collar (${totalSpheres} spheres)`,
    engravingStamp: `AR · ${bomb.editionNumber}`,
    goldLeafSpec: `${goldType} × ${totalSpheres} centers`,
    pressDuration: 'Hydraulic Sphere Press Lock · 60 kg pressure',
    deepFreezeDuration: 'Deep Freeze -18°C · 45 mins inside mold shells',
    rackCureDuration: '48–72 hrs Dehumidified Chamber (<35% RH)',
    materials,
    steps,
  };
}

function buildVaultPairBlueprint(
  pair: VaultPairedFormulation,
  quantity: number,
  cartKey: string,
  orderPrefix = 'item',
): ProductMakerBlueprint {
  const isBarOnly = cartKey.endsWith('__bar');
  const isBombOnly = cartKey.endsWith('__bomb');
  const includesBar = !isBombOnly;
  const includesBomb = !isBarOnly;

  const barGrams = includesBar ? 150 * quantity : 0;
  const bombGrams = includesBomb ? 180 * quantity : 0;
  const totalGrams = barGrams + bombGrams;

  const eraMeta = ART_ERA_BY_ID.get(pair.eraId);
  const grooveLabel = `${eraMeta?.labelEn ?? 'Atelier'} · ${pair.eraGrooveEn} (${
    VICTORIAN_GROOVE_LABELS[pair.victorianStyle] ?? 'Architectural Relief'
  })`;
  const hasOatsOrHoney = /oat|honey|shea|urea|butter|ceramide|almond/i.test(pair.activeFormula);
  const hasSalts = /salt|magnesium|sulfur|charcoal|clay|bentonite|kaolin/i.test(pair.activeFormula);

  const glycerinGrams = includesBar ? Math.round(barGrams * 0.5) : 0;
  const creamGrams = includesBar ? Math.round(barGrams * 0.5) : 0;
  const saltGrams = includesBomb ? Math.round(bombGrams * 0.16) : hasSalts ? Math.round(barGrams * 0.08) : 0;
  const oatsHoneyGrams = hasOatsOrHoney ? Math.round(totalGrams * 0.1) : 0;

  const goldLeafLabel =
    pair.goldLeafTone === 'pink-gold'
      ? '24K Edible Rose Pink Gold Leaf'
      : '24K Edible Yellow Gold Leaf';
  const jewelLabel =
    pair.goldLeafTone === 'pink-gold'
      ? 'Transparent Himalayan Pink Bath Salt Crystals & 24k Rose Gold Ribbons'
      : 'Transparent Dead Sea & Epsom Bath Salt Crystals + 24k Yellow Gold Leaf';
  const jewelCount = quantity * (includesBar && includesBomb ? 2 : 1);

  const materials: MaterialLineItem[] = [
    {
      id: `${orderPrefix}_mold`,
      category: '3d-mold',
      label: `3D Print ${grooveLabel} + "GentleBubble" Emblem Plate & Stamp (${
        includesBar ? `Bar "${pair.shortBarStamp}"` : ''
      }${includesBar && includesBomb ? ' + ' : ''}${includesBomb ? `Bomb "${pair.shortBombStamp}"` : ''})`,
      amount: `${includesBar && includesBomb ? '2 matched 50/50 dies' : '1 half-clear mold die'}`,
      orderNeeded: true,
    },
    {
      id: `${orderPrefix}_gold`,
      category: 'gold-inlay',
      label: `${goldLeafLabel} + ${jewelLabel}`,
      amount: `${jewelCount} gold seam ribbons + carved 3D groove sleeves`,
      orderNeeded: true,
    },
    ...(includesBar
      ? [
          {
            id: `${orderPrefix}_glyc`,
            category: 'glycerin-base' as const,
            label: `Clear Clinical Suspension Glycerin (${formatGrams(glycerinGrams)}) + Velvet Cream Base (${formatGrams(creamGrams)})`,
            amount: formatGrams(barGrams),
            gramsNumeric: barGrams,
          },
        ]
      : []),
    ...(includesBomb
      ? [
          {
            id: `${orderPrefix}_bomb_fizz`,
            category: 'bath-salts' as const,
            label: `USP Bicarb/Citric Matrix + ${saltGrams > 0 ? `Bath Salts (${formatGrams(saltGrams)})` : 'Mineral Salts'}`,
            amount: formatGrams(bombGrams),
            gramsNumeric: bombGrams,
          },
        ]
      : saltGrams > 0
        ? [
            {
              id: `${orderPrefix}_bar_salt`,
              category: 'bath-salts' as const,
              label: 'Micro-Milled Therapeutic Clay / Mineral Salts',
              amount: formatGrams(saltGrams),
              gramsNumeric: saltGrams,
            },
          ]
        : []),
    ...(oatsHoneyGrams > 0
      ? [
          {
            id: `${orderPrefix}_oats_honey`,
            category: 'oats-honey' as const,
            label: 'Colloidal Oatmeal / Oat Lipid + Raw Honey / Shea Complex',
            amount: formatGrams(oatsHoneyGrams),
            gramsNumeric: oatsHoneyGrams,
          },
        ]
      : []),
    {
      id: `${orderPrefix}_actives`,
      category: 'actives-oils',
      label: `Precise Clinical Percentage Formula: ${pair.activeFormula}`,
      amount: `Batch-scaled for ${formatGrams(totalGrams)}`,
    },
  ];

  const steps: ProductionStep[] = [
    {
      id: `${orderPrefix}_s1`,
      stepNumber: 1,
      phase: '3d-print',
      title: `3D Print ${eraMeta?.labelEn ?? 'Era'} Grooved Mold & Engraved Stamp(s)`,
      actionDetail: `Print "${pair.eraGrooveEn}" sleeve insert & color-separation divider. Verify crisp stamp plates: ${
        includesBar ? `Flat Bar Stamp [${pair.shortBarStamp}] (≤14 chars)` : ''
      }${includesBar && includesBomb ? ' & ' : ''}${
        includesBomb ? `Curved Bomb Stamp [${pair.shortBombStamp}] (≤12 chars)` : ''
      }.`,
      durationBadge: 'Print ~1 hr 20 min',
      tempOrSetting: '0.12mm ultra-fine resin/PETG',
    },
    {
      id: `${orderPrefix}_s2`,
      stepNumber: 2,
      phase: 'procurement',
      title: `Pull Active % Concentrate, ${goldLeafLabel} & Transparent Mineral Salt Crystals`,
      actionDetail: `Measure clinical actives (${pair.activeFormula}) plus era mineral tone (${pair.eraPigmentEn}), ${
        oatsHoneyGrams > 0 ? `${formatGrams(oatsHoneyGrams)} soothing oat/butter complex, ` : ''
      }${saltGrams > 0 ? `${formatGrams(saltGrams)} transparent bath salt crystals, ` : ''}${jewelCount} × ${jewelLabel}.`,
      durationBadge: 'Weigh 15 min',
    },
    ...(includesBar
      ? [
          {
            id: `${orderPrefix}_s3`,
            stepNumber: 3,
            phase: 'compounding' as const,
            title: `Pour 50/50 Half-Translucent Bar (${pair.brandName} · ${formatGrams(barGrams)})`,
            actionDetail: `Pour high-clarity glycerine (${formatGrams(glycerinGrams)}) into translucent window at 58°C; suspend ${goldLeafLabel} ribbons along deep 3D grooves. Pour opaque butter half (${formatGrams(creamGrams)}) debossed with "GentleBubble" emblem at 54°C.`,
            durationBadge: 'Batch 30 min',
            tempOrSetting: '54–68°C · pH 5.5',
          },
        ]
      : []),
    ...(includesBomb
      ? [
          {
            id: `${orderPrefix}_${includesBar ? 's4' : 's3'}`,
            stepNumber: includesBar ? 4 : 3,
            phase: 'molding' as const,
            title: `Press Half-Clear Glazed Sphere (${formatGrams(bombGrams)})`,
            actionDetail: `Sift USP bicarb, citric acid & mineral salts (${formatGrams(saltGrams)}) with ${pair.activeFormula}; press mineral hemisphere bearing "GentleBubble" relief, then seal clear glycerine crown housing ${goldLeafLabel} & ${jewelLabel}.`,
            durationBadge: 'Press 25 min',
            tempOrSetting: '60 kg Clamp Press',
          },
        ]
      : []),
    {
      id: `${orderPrefix}_s5`,
      stepNumber: includesBar && includesBomb ? 5 : 4,
      phase: 'cure-freeze',
      title: `Deep Freeze Release (45 min) & ${hasOatsOrHoney ? '30-Day Press Cure' : '48h Moisture-Locked Cure'}`,
      actionDetail: `Place grooved silicone molds in Deep Freezer (-18°C) for 45 mins so translucent jewel window & Victorian flutes release crystal clear. Transfer to cedar racks (${
        hasOatsOrHoney ? '30 days breathable curing' : '48–72 hrs <35% RH cure'
      }).`,
      durationBadge: hasOatsOrHoney ? 'Freeze 45m + Cure 30d' : 'Freeze 45m + Cure 48h',
      tempOrSetting: '-18°C Deep Freeze',
    },
    {
      id: `${orderPrefix}_s6`,
      stepNumber: includesBar && includesBomb ? 6 : 5,
      phase: 'finishing',
      title: `Inspect Jewel Visibility, Stamp Seal & Pack Ledger`,
      actionDetail: `Verify visible stone & ${goldLeafLabel} shimmer through translucent side, crisp "GentleBubble" crest + stamp [${includesBar ? pair.shortBarStamp : pair.shortBombStamp}], and enclose vintage parchment card.`,
      durationBadge: 'Inspect & Pack 10 min',
    },
  ];

  return {
    skuKey: cartKey,
    editionId: pair.id,
    category: 'vault-pair',
    title: `${pair.brandName} · ${isBarOnly ? 'Bar Soap' : isBombOnly ? 'Bath Bomb' : 'Matched Paired Duo'}`,
    subtitle: `${pair.activeFormula} · ${grooveLabel}`,
    imageUrl: pair.imageUrl,
    quantity,
    unitWeightGrams: (includesBar ? 150 : 0) + (includesBomb ? 180 : 0),
    totalBatchGrams: totalGrams,
    cureMethod: hasOatsOrHoney ? 'hybrid-press-freeze' : 'deep-freeze-chill',
    moldSpec: `3D-Printed ${grooveLabel}`,
    engravingStamp: `GentleBubble · ${pair.shortBarStamp} / ${pair.shortBombStamp}`,
    goldLeafSpec: `${goldLeafLabel} + ${jewelLabel}`,
    pressDuration: includesBomb ? 'Hydraulic Press + Brass Stamp' : 'Silicone Stamp Press',
    deepFreezeDuration: 'Deep Freeze -18°C · 45 mins for crisp Victorian grooves',
    rackCureDuration: hasOatsOrHoney ? '30 Days Cedar Rack Cure' : '48–72 hrs Dehumidified Cure',
    materials,
    steps,
  };
}

export function resolveBlueprintForOrderItem(
  item: AtelierOrderLineItem,
  orderPrefix = 'item',
): ProductMakerBlueprint {
  const qty = Math.max(1, item.quantity || 1);

  // 1. Check Secret Vault Marble Boxes (3 of each)
  const vaultBox = VAULT_MARBLE_BOXES.find((b) => b.id === item.editionId);
  if (vaultBox) {
    const subItems = vaultBox.includedPairIds
      .map((pairId, idx) => {
        const pair = VAULT_PAIR_BY_ID.get(pairId);
        return pair
          ? buildVaultPairBlueprint(pair, qty, `${pair.id}__pair`, `${orderPrefix}_sub${idx}`)
          : null;
      })
      .filter((x): x is ProductMakerBlueprint => x !== null);

    const totalBatchGrams = subItems.reduce((s, b) => s + b.totalBatchGrams, 0);
    const ribbonChoice = item.scentName || 'Champagne Silk Ribbon · Loofah & 50/50 Candle';
    const engraving = item.giftNote || 'GENTLEBUBBLE BY AR';

    const steps: ProductionStep[] = [
      {
        id: `${orderPrefix}_s1`,
        stepNumber: 1,
        phase: '3d-print',
        title: `Carve Victorian-Grooved Marble Chest & 3D Print Velvet Divider Tray`,
        actionDetail: `Prepare ${vaultBox.stoneType} marble outer box with ${vaultBox.grooveDetailEn}. 3D print custom 8-slot cradle organizer (3 bar bays + 3 sphere wells + 1 loofah bay + 1 candle recess) lined in champagne velvet.`,
        durationBadge: 'Print + Carve ~3 hrs',
        tempOrSetting: 'CNC Marble + PETG Cradle',
      },
      {
        id: `${orderPrefix}_s2`,
        stepNumber: 2,
        phase: 'procurement',
        title: `Order / Stage Marble Chest, 24k Gold Leaf, 1 Loofah, 1 Candle & Brass Plaque`,
        actionDetail: `Order/pull ${vaultBox.titleEn} chest, 1 loofah pad + 1 matching 50/50 aromatic candle (${ribbonChoice}), silk ribbon swatch, and engravable solid brass plaque reading "${engraving}".`,
        durationBadge: 'Prep 25 min',
      },
      {
        id: `${orderPrefix}_s3`,
        stepNumber: 3,
        phase: 'compounding',
        title: `Compound All 3 Vault Pairings (3 Bars + 3 Matching Bath Bombs)`,
        actionDetail: `Follow the 3 linked sub-recipes below (${subItems.map((s) => s.title.split('·')[0].trim()).join(', ')}) — pour glycerin/cream 50/50 bars and compress matching mineral bath spheres.`,
        durationBadge: 'Batch ~2 hrs',
      },
      {
        id: `${orderPrefix}_s4`,
        stepNumber: 4,
        phase: 'cure-freeze',
        title: `Deep Freeze Release (45 min) & 14–30 Day Coffret Equilibrium Cure`,
        actionDetail: `Deep-freeze all Victorian-grooved molds (-18°C for 45 mins) for razor-sharp scroll/fluted grooves. Cure on ventilated racks until completely firm so fragrances never cross-bleed inside the stone chest.`,
        durationBadge: 'Freeze 45m + Cure 30d',
        tempOrSetting: '-18°C Release · 20°C Cure',
      },
      {
        id: `${orderPrefix}_s5`,
        stepNumber: 5,
        phase: 'finishing',
        title: `Laser-Engrave Brass Plaque "${engraving}", Assemble & Wax Seal`,
        actionDetail: `Seat the 3 glassine-wrapped bars, 3 sealed spheres, 1 natural loofah disc, and 1 50/50 aromatic candle into compartments. Affix engraved brass plaque ("${engraving}"), tie ribbon (${ribbonChoice}), and stamp molten Maison wax seal.`,
        durationBadge: 'Assembly 20 min',
      },
    ];

    return {
      skuKey: item.cartKey,
      editionId: vaultBox.id,
      category: 'marble-box',
      title: vaultBox.titleEn,
      subtitle: `Ribbon & Companion: ${ribbonChoice} · Engraving: "${engraving}"`,
      imageUrl: vaultBox.imageUrl,
      quantity: qty,
      unitWeightGrams: 990,
      totalBatchGrams,
      cureMethod: 'hybrid-press-freeze',
      moldSpec: `${vaultBox.grooveDetailEn} + 3D Printed 8-Slot Interior Cradle`,
      engravingStamp: engraving,
      goldLeafSpec: '24k Gold Leaf across all 3 pairs + Engraved Brass Plaque',
      pressDuration: 'Marble Grooved Box + Hydraulic Bomb Press',
      deepFreezeDuration: 'Deep Freeze -18°C · 45 mins on all 6 castings',
      rackCureDuration: '30 Days Box Equilibrium Cure (45% RH)',
      materials: [
        {
          id: `${orderPrefix}_box`,
          category: '3d-mold',
          label: `${vaultBox.titleEn} (${vaultBox.grooveDetailEn}) + 3D Cradle Tray`,
          amount: `${qty} coffret set`,
          orderNeeded: true,
        },
        {
          id: `${orderPrefix}_loofah`,
          category: 'packaging',
          label: `1 Natural Loofah + 1 50/50 Candle + Silk Ribbon (${ribbonChoice})`,
          amount: `${qty} loofah + ${qty} candle + ${qty} brass plaque`,
          orderNeeded: true,
        },
        {
          id: `${orderPrefix}_sub_total`,
          category: 'glycerin-base',
          label: 'Combined Interior Batches (3× 150g Bars + 3× 180g Bombs)',
          amount: formatGrams(totalBatchGrams),
          gramsNumeric: totalBatchGrams,
        },
      ],
      steps,
      subItems,
    };
  }

  // 2. Check Soap Marble Cases (10 Soaps + 1 Loofah + 1 50/50 Candle)
  const soapCase = MARBLE_CASSETTE_SETS.find((c) => c.id === item.editionId);
  if (soapCase) {
    const childIds = [...soapCase.brightRowIds, ...soapCase.darkRowIds, ...(soapCase.holidayRowIds ?? [])];
    const subItems = childIds
      .map((id, idx) => {
        const soap = SOAP_BY_ID.get(id);
        return soap ? buildSoapBlueprint(soap, qty, soap.id, item.giftNote, `${orderPrefix}_sc${idx}`) : null;
      })
      .filter((x): x is ProductMakerBlueprint => x !== null);
    const totalBatchGrams = subItems.reduce((s, b) => s + b.totalBatchGrams, 0);
    const engraving = item.giftNote || 'GENTLEBUBBLE BY AR';

    return {
      skuKey: item.cartKey,
      editionId: soapCase.id,
      category: 'marble-box',
      title: soapCase.name,
      subtitle: `${item.scentName || 'Signature Silk Ribbon'} · Plaque "${engraving}"`,
      imageUrl: soapCase.imageUrl,
      quantity: qty,
      unitWeightGrams: 1500,
      totalBatchGrams,
      cureMethod: 'hybrid-press-freeze',
      moldSpec: `Carved ${soapCase.stoneType} Stone Box + 10-Bar + 1 Loofah & 1 Candle Insert`,
      engravingStamp: engraving,
      goldLeafSpec: 'Mixed 24k Yellow & Rose Gold Leaf across 10 bars',
      pressDuration: '30-Day Cedar Cure before casing',
      deepFreezeDuration: 'Deep Freeze -18°C · 45 mins per silicone mold batch',
      rackCureDuration: '30 Days Full Batch Stabilization',
      materials: [
        {
          id: `${orderPrefix}_stone`,
          category: '3d-mold',
          label: `Carved ${soapCase.stoneType} Marble Coffret + 3D Printed 12-Slot Tray`,
          amount: `${qty} marble chest`,
          orderNeeded: true,
        },
        {
          id: `${orderPrefix}_loofah`,
          category: 'packaging',
          label: `1 Natural Loofah + 1 Matching 50/50 Candle + Brass Plaque "${engraving}"`,
          amount: `${qty} loofah + ${qty} candle`,
          orderNeeded: true,
        },
        {
          id: `${orderPrefix}_bars`,
          category: 'glycerin-base',
          label: 'Total 10-Bar Botanical Glycerin + Cream Batches',
          amount: formatGrams(totalBatchGrams),
          gramsNumeric: totalBatchGrams,
        },
      ],
      steps: [
        {
          id: `${orderPrefix}_s1`,
          stepNumber: 1,
          phase: '3d-print',
          title: `3D Print 10-Bar Master Rack + Velvet Interior Dividers`,
          actionDetail: `Prepare 10-cavity 150g 50/50 architectural silicone molds & print flocked velvet compartment grid fitted for ${soapCase.name}.`,
          durationBadge: 'Print ~2.5 hrs',
        },
        {
          id: `${orderPrefix}_s2`,
          stepNumber: 2,
          phase: 'procurement',
          title: `Order Stone Chest, 24k Gold Leaf, 1 Loofah & 1 50/50 Candle`,
          actionDetail: `Pull ${soapCase.stoneType} marble box, brass plaque stamped "${engraving}", ${item.scentName || 'Champagne silk ribbon'}, 1 loofah scrubber, and 1 color-matched 50/50 candle.`,
          durationBadge: 'Prep 30 min',
        },
        {
          id: `${orderPrefix}_s3`,
          stepNumber: 3,
          phase: 'compounding',
          title: `Pour All 10 Dual-Pour Botanical 50/50 Bars`,
          actionDetail: `Batch-pour crystal translucent halves (68°C -> 58°C) followed by whipped cream halves (54°C) using each bar's sub-recipe below.`,
          durationBadge: 'Batch ~3 hrs',
        },
        {
          id: `${orderPrefix}_s4`,
          stepNumber: 4,
          phase: 'cure-freeze',
          title: `Deep Freeze Release (45m) + Press & Cure 30 Days`,
          actionDetail: `Flash-chill molds at -18°C (45 mins) for razor-clean 50/50 seams, then cure all 10 bars on cedar racks for 30 days.`,
          durationBadge: 'Freeze 45m + Cure 30d',
        },
        {
          id: `${orderPrefix}_s5`,
          stepNumber: 5,
          phase: 'finishing',
          title: `Assemble Sealed Coffret & Wax-Stamp Gift Box`,
          actionDetail: `Place all 10 parchment-wrapped bars, 1 loofah & 1 50/50 candle into marble chest, fix engraved brass plaque "${engraving}", tie ribbon, and stamp Maison wax seal.`,
          durationBadge: 'Finish 20 min',
        },
      ],
      subItems,
    };
  }

  // 3. Check Bath Bomb Marble Cases (9 Bombs + 1 Loofah + 1 50/50 Candle)
  const bombCase = BATH_BOMB_MARBLE_CASES.find((c) => c.id === item.editionId);
  if (bombCase) {
    const childIds = [...bombCase.darkBombIds, ...bombCase.brightBombIds, ...bombCase.holidayBombIds];
    const subItems = childIds
      .map((id, idx) => {
        const bomb = BATH_BOMB_BY_ID.get(id);
        return bomb ? buildBathBombBlueprint(bomb, qty, bomb.id, `${orderPrefix}_bbc${idx}`) : null;
      })
      .filter((x): x is ProductMakerBlueprint => x !== null);
    const totalBatchGrams = subItems.reduce((s, b) => s + b.totalBatchGrams, 0);
    const engraving = item.giftNote || 'GENTLEBUBBLE BY AR';

    return {
      skuKey: item.cartKey,
      editionId: bombCase.id,
      category: 'marble-box',
      title: bombCase.titleEn,
      subtitle: `${item.scentName || 'Signature Silk Ribbon'} · Plaque "${engraving}"`,
      imageUrl: bombCase.imageUrl,
      quantity: qty,
      unitWeightGrams: 1620,
      totalBatchGrams,
      cureMethod: 'deep-freeze-chill',
      moldSpec: `Carved ${bombCase.stoneType} Stone Chest + 9-Sphere Velvet Pocket Grid`,
      engravingStamp: engraving,
      goldLeafSpec: '24k Yellow & Rose Gold Leaf Cores inside all 9 spheres',
      pressDuration: '60 kg Hydraulic Sphere Press on 9 bombs',
      deepFreezeDuration: 'Deep Freeze -18°C · 45 mins per sphere mold tray',
      rackCureDuration: '48–72 hrs Dehumidified Cure (<35% RH)',
      materials: [
        {
          id: `${orderPrefix}_case`,
          category: '3d-mold',
          label: `${bombCase.titleEn} + 3D Printed 9-Sphere Cushion Divider`,
          amount: `${qty} coffret`,
          orderNeeded: true,
        },
        {
          id: `${orderPrefix}_salts_total`,
          category: 'bath-salts',
          label: 'Total Multi-Vitamin Bicarb, Citric Acid & Epsom Salt Load',
          amount: formatGrams(totalBatchGrams),
          gramsNumeric: totalBatchGrams,
        },
      ],
      steps: [
        {
          id: `${orderPrefix}_s1`,
          stepNumber: 1,
          phase: '3d-print',
          title: `3D Print 70mm Sphere Press Shells & 9-Pocket Cushion Insert`,
          actionDetail: `Prepare 9 spherical press cavities & print protective stone-box cradle pockets.`,
          durationBadge: 'Print ~2 hrs',
        },
        {
          id: `${orderPrefix}_s2`,
          stepNumber: 2,
          phase: 'procurement',
          title: `Pull Marble Chest, 24k Gold Leaf, 1 Loofah, 1 Candle & Brass Plaque`,
          actionDetail: `Stage stone coffret, 1 loofah disc, 1 matching 50/50 aromatic candle, 24k gold cores, and engrave brass plaque "${engraving}".`,
          durationBadge: 'Prep 25 min',
        },
        {
          id: `${orderPrefix}_s3`,
          stepNumber: 3,
          phase: 'molding',
          title: `Press All 9 Multi-Vitamin Bath Spheres (3 Dark + 3 Bright + 3 Holiday)`,
          actionDetail: `Compound wet/dry salt mixes per the 9 linked recipes below and press firmly at 60 kg pressure.`,
          durationBadge: 'Press ~90 min',
        },
        {
          id: `${orderPrefix}_s4`,
          stepNumber: 4,
          phase: 'cure-freeze',
          title: `Deep Freeze Flash-Lock (45m) & Humidity Cure (72 hrs)`,
          actionDetail: `Deep freeze shells at -18°C for 45 mins before unmolding; cure 72 hrs in <35% humidity room prior to shrink-wrapping.`,
          durationBadge: 'Freeze 45m + Cure 72h',
        },
        {
          id: `${orderPrefix}_s5`,
          stepNumber: 5,
          phase: 'finishing',
          title: `Pack 9 Sealed Spheres + 1 Loofah + 1 50/50 Candle & Wax-Seal Box`,
          actionDetail: `Arrange 3×3 spheres + 1 loofah + 1 matching 50/50 candle cleanly in stone case, tie ribbon (${item.scentName}), mount engraved plaque "${engraving}", and stamp wax seal.`,
          durationBadge: 'Pack 20 min',
        },
      ],
      subItems,
    };
  }

  // 4. Check Secret Vault 30 Formulations
  const vaultPair = VAULT_PAIR_BY_ID.get(item.editionId);
  if (vaultPair) {
    return buildVaultPairBlueprint(vaultPair, qty, item.cartKey, orderPrefix);
  }

  // 5. Check Regular Bath Bombs
  const bomb = BATH_BOMB_BY_ID.get(item.editionId);
  if (bomb) {
    return buildBathBombBlueprint(bomb, qty, item.cartKey, orderPrefix);
  }

  // 6. Check Regular Bar Soaps
  const soap = SOAP_BY_ID.get(item.editionId);
  if (soap) {
    return buildSoapBlueprint(soap, qty, item.cartKey, item.giftNote, orderPrefix);
  }

  // Fallback blueprint for any custom/unlisted SKU
  return {
    skuKey: item.cartKey,
    editionId: item.editionId,
    category: 'soap-bar',
    title: item.name,
    subtitle: item.scentName,
    imageUrl: item.imageUrl || ALL_SOAP_CREATIONS[0].imageUrl,
    quantity: qty,
    unitWeightGrams: 150,
    totalBatchGrams: 150 * qty,
    cureMethod: 'deep-freeze-chill',
    moldSpec: '3D-Printed Architectural Atelier Mold',
    engravingStamp: item.giftNote || 'GENTLEBUBBLE BY AR',
    goldLeafSpec: '24k Gold Leaf Finish',
    pressDuration: 'Silicone Clamp Press',
    deepFreezeDuration: 'Deep Freeze -18°C · 45 mins',
    rackCureDuration: '48 hrs Rack Harden',
    materials: [
      {
        id: `${orderPrefix}_custom`,
        category: 'glycerin-base',
        label: `Custom Atelier Formulation Base (${item.scentName})`,
        amount: formatGrams(150 * qty),
        gramsNumeric: 150 * qty,
      },
    ],
    steps: [
      {
        id: `${orderPrefix}_s1`,
        stepNumber: 1,
        phase: '3d-print',
        title: '3D Print Custom Mold & Engraving Plate',
        actionDetail: `Prepare custom mold and stamp "${item.giftNote || 'GENTLEBUBBLE BY AR'}".`,
        durationBadge: 'Print ~90 min',
      },
      {
        id: `${orderPrefix}_s2`,
        stepNumber: 2,
        phase: 'compounding',
        title: 'Compound Base, Actives & 24k Gold Inlay',
        actionDetail: `Blend ${item.scentName} at 58°C and cast cleanly.`,
        durationBadge: 'Batch 30 min',
      },
      {
        id: `${orderPrefix}_s3`,
        stepNumber: 3,
        phase: 'cure-freeze',
        title: 'Deep Freeze Release & Rack Cure',
        actionDetail: 'Freeze at -18°C for 45 mins, demold, cure on trays, and wax seal.',
        durationBadge: 'Freeze 45m + Cure 48h',
      },
    ],
  };
}

export function buildOrderCombinedPrepSummary(
  order: AtelierOrderRecord,
): {
  blueprints: ProductMakerBlueprint[];
  summary: OrderCombinedPrepSummary;
} {
  const blueprints = order.items.map((item, idx) =>
    resolveBlueprintForOrderItem(item, `item_${idx}`),
  );

  let totalUnits = 0;
  let totalBatchGrams = 0;
  let totalGlycerinGrams = 0;
  let totalCreamOrFizzGrams = 0;
  let totalBathSaltsGrams = 0;
  let totalOatsHoneyGrams = 0;
  let maxCureDays = 2;
  let requiresDeepFreeze = false;
  let requires30DayPress = false;

  const moldsSet = new Set<string>();
  const inlaysSet = new Set<string>();

  for (const bp of blueprints) {
    totalUnits += bp.quantity;
    totalBatchGrams += bp.totalBatchGrams;
    moldsSet.add(bp.moldSpec);
    inlaysSet.add(bp.goldLeafSpec);

    if (bp.cureMethod === 'press-30-days' || bp.cureMethod === 'hybrid-press-freeze') {
      requires30DayPress = true;
      maxCureDays = Math.max(maxCureDays, 30);
    } else {
      maxCureDays = Math.max(maxCureDays, 3);
    }
    if (bp.deepFreezeDuration) {
      requiresDeepFreeze = true;
    }

    for (const mat of bp.materials) {
      if (mat.category === 'glycerin-base' && mat.gramsNumeric) {
        if (/cream|fizz|bicarb/i.test(mat.label)) {
          totalCreamOrFizzGrams += mat.gramsNumeric;
        } else {
          totalGlycerinGrams += mat.gramsNumeric;
        }
      } else if (mat.category === 'bath-salts' && mat.gramsNumeric) {
        totalBathSaltsGrams += mat.gramsNumeric;
      } else if (mat.category === 'oats-honey' && mat.gramsNumeric) {
        totalOatsHoneyGrams += mat.gramsNumeric;
      }
    }
  }

  return {
    blueprints,
    summary: {
      totalUnits,
      totalBatchGrams,
      moldsToPrint: Array.from(moldsSet),
      goldAndInlaysToOrder: Array.from(inlaysSet),
      totalGlycerinGrams,
      totalCreamOrFizzGrams,
      totalBathSaltsGrams,
      totalOatsHoneyGrams,
      maxCureDays,
      requiresDeepFreeze,
      requires30DayPress,
    },
  };
}

export interface MasterLibraryEntry {
  key: string;
  group: 'Bar Soaps (30)' | 'Bath Bombs (30)' | 'Secret Vault Pairs (30)' | 'Marble Coffrets (11)';
  blueprint: ProductMakerBlueprint;
}

let cachedMasterLibrary: MasterLibraryEntry[] | null = null;

export function getMasterFormulationLibrary(): MasterLibraryEntry[] {
  if (cachedMasterLibrary) return cachedMasterLibrary;
  const entries: MasterLibraryEntry[] = [];

  for (const soap of ALL_SOAP_CREATIONS) {
    entries.push({
      key: `lib_soap_${soap.id}`,
      group: 'Bar Soaps (30)',
      blueprint: buildSoapBlueprint(soap, 1, soap.id, undefined, `lib_${soap.id}`),
    });
  }
  for (const bomb of ALL_BATH_BOMBS) {
    entries.push({
      key: `lib_bomb_${bomb.id}`,
      group: 'Bath Bombs (30)',
      blueprint: buildBathBombBlueprint(bomb, 1, bomb.id, `lib_${bomb.id}`),
    });
  }
  for (const pair of VAULT_PAIRED_FORMULATIONS) {
    entries.push({
      key: `lib_vault_${pair.id}`,
      group: 'Secret Vault Pairs (30)',
      blueprint: buildVaultPairBlueprint(pair, 1, `${pair.id}__pair`, `lib_${pair.id}`),
    });
  }
  for (const box of [...VAULT_MARBLE_BOXES]) {
    entries.push({
      key: `lib_vbox_${box.id}`,
      group: 'Marble Coffrets (11)',
      blueprint: resolveBlueprintForOrderItem(
        {
          cartKey: box.id,
          editionId: box.id,
          name: box.titleEn,
          scentName: 'Champagne Silk · Loofah Duo',
          priceUsd: box.priceThb,
          quantity: 1,
          imageUrl: box.imageUrl,
        },
        `lib_${box.id}`,
      ),
    });
  }
  for (const c of MARBLE_CASSETTE_SETS) {
    entries.push({
      key: `lib_scase_${c.id}`,
      group: 'Marble Coffrets (11)',
      blueprint: resolveBlueprintForOrderItem(
        {
          cartKey: c.id,
          editionId: c.id,
          name: c.name,
          scentName: 'Champagne Silk Ribbon',
          priceUsd: c.priceUsd,
          quantity: 1,
          imageUrl: c.imageUrl,
        },
        `lib_${c.id}`,
      ),
    });
  }
  for (const c of BATH_BOMB_MARBLE_CASES) {
    entries.push({
      key: `lib_bbcase_${c.id}`,
      group: 'Marble Coffrets (11)',
      blueprint: resolveBlueprintForOrderItem(
        {
          cartKey: c.id,
          editionId: c.id,
          name: c.titleEn,
          scentName: 'Crimson Silk Ribbon',
          priceUsd: c.priceThb,
          quantity: 1,
          imageUrl: c.imageUrl,
        },
        `lib_${c.id}`,
      ),
    });
  }

  cachedMasterLibrary = entries;
  return entries;
}
