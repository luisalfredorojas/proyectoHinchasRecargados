import type { Store, StoreCategory, PrizeType } from '@/types';

// ─── Stores ───────────────────────────────────────────────────────────────────

/**
 * Ordered list of all valid purchase locations.
 * This array is the single source of truth rendered inside the wizard Select.
 */
export const STORES: Store[] = [
  'Coral Hipermercados',
  'Mi Comisariato/Hipermarket',
  'Ferrisariato',
  'Fybeca',
  'Pharmacys',
  'Kywi',
  'Promart',
];

// ─── Store → Category mapping ─────────────────────────────────────────────────

/**
 * Classifies each store into its promotional category:
 * - autoservicio → supermarkets / hardware stores
 * - farmacia     → pharmacy chains
 */
export const STORE_CATEGORY_MAP: Record<Store, StoreCategory> = {
  'Coral Hipermercados': 'autoservicio',
  'Mi Comisariato/Hipermarket': 'autoservicio',
  Ferrisariato: 'autoservicio',
  Fybeca: 'farmacia',
  Pharmacys: 'farmacia',
  Kywi: 'autoservicio',
  Promart: 'autoservicio',
};

// ─── Category → Prize mapping ─────────────────────────────────────────────────

/**
 * Maps a store category to the prize type awarded to participants.
 */
export const PRIZE_MAP: Record<StoreCategory, PrizeType> = {
  autoservicio: 'cine_en_casa',
  farmacia: 'camiseta_ecuador',
};

// ─── Prize → Message mapping ──────────────────────────────────────────────────

/**
 * User-facing success messages shown in the confirmation modal.
 */
export const PRIZE_MESSAGES: Record<PrizeType, string> = {
  cine_en_casa: '¡Ya estás participando por un cine en casa!',
  camiseta_ecuador: '¡Ya estás participando por una camiseta original de Ecuador!',
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Derives the prize type for a given store.
 *
 * @param store - A valid store name
 * @returns The corresponding PrizeType
 *
 * @example
 * getPrizeType('Fybeca') // → 'camiseta_ecuador'
 * getPrizeType('Kywi')   // → 'cine_en_casa'
 */
export function getPrizeType(store: Store): PrizeType {
  const category = STORE_CATEGORY_MAP[store];
  return PRIZE_MAP[category];
}

/**
 * Returns the localised success message for a given prize type.
 *
 * @param prizeType - The prize the participant will compete for
 * @returns Human-readable Spanish message for the confirmation screen
 *
 * @example
 * getPrizeMessage('cine_en_casa')       // → '¡Ya estás participando por un cine en casa!'
 * getPrizeMessage('camiseta_ecuador')   // → '¡Ya estás participando por una camiseta original de Ecuador!'
 */
export function getPrizeMessage(prizeType: PrizeType): string {
  return PRIZE_MESSAGES[prizeType];
}
