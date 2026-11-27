/**
 * Shared Framer Motion 'sablé' hover & transition curves for luxury product cards.
 * Uses only compositor-safe transforms (translateY) within the <=200ms routine
 * interaction budget so cards settle like warm hand-molded French porcelain.
 */

export const SABLE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SABLE_CARD_TRANSITION = {
  duration: 0.2,
  ease: SABLE_EASE,
} as const;

export const SABLE_CARD_HOVER = {
  y: -2.5,
  transition: SABLE_CARD_TRANSITION,
} as const;
