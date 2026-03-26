import type { Store, StoreCategory, PrizeType } from '@/types';

// ─── Stores ───────────────────────────────────────────────────────────────────

/**
 * Ordered list of all valid purchase locations.
 * This array is the single source of truth rendered inside the wizard Select.
 */
export const STORES: Store[] = [
  'Coral Hipermercados',
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

// ─── Ecuador geography ────────────────────────────────────────────────────────

export const ECUADOR_PROVINCES: string[] = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora-Chinchipe',
];

export const PROVINCE_CITIES: Record<string, string[]> = {
  'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Sigsig', 'Girón', 'Chordeleg', 'Nabón', 'Oña', 'Pucará', 'San Fernando', 'Sevilla de Oro', 'Guachapala', 'El Pan', 'Camilo Ponce Enríquez'],
  'Bolívar': ['Guaranda', 'Caluma', 'Chillanes', 'Chimbo', 'Echeandía', 'Las Naves', 'San Miguel'],
  'Cañar': ['Azogues', 'Biblián', 'Cañar', 'La Troncal', 'El Tambo', 'Déleg', 'Suscal'],
  'Carchi': ['Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca'],
  'Chimborazo': ['Riobamba', 'Alausí', 'Chambo', 'Chunchi', 'Colta', 'Cumandá', 'Guamote', 'Guano', 'Pallatanga', 'Penipe'],
  'Cotopaxi': ['Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'],
  'El Oro': ['Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo', 'Huaquillas', 'Las Lajas', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
  'Esmeraldas': ['Esmeraldas', 'Atacames', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'Rioverde', 'San Lorenzo'],
  'Galápagos': ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'],
  'Guayas': ['Guayaquil', 'Alfredo Baquerizo Moreno', 'Balao', 'Balzar', 'Colimes', 'Daule', 'Durán', 'El Empalme', 'El Triunfo', 'General Antonio Elizalde', 'Isidro Ayora', 'Lomas de Sargentillo', 'Marcelino Maridueña', 'Milagro', 'Naranjal', 'Naranjito', 'Nobol', 'Palestina', 'Pedro Carbo', 'Playas', 'Salitre', 'Samborondón', 'Santa Lucía', 'Simón Bolívar', 'Yaguachi'],
  'Imbabura': ['Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro', 'San Miguel de Urcuquí'],
  'Loja': ['Loja', 'Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola', 'Gonzanamá', 'Macará', 'Olmedo', 'Paltas', 'Pindal', 'Puyango', 'Quilanga', 'Saraguro', 'Sozoranga', 'Zapotillo'],
  'Los Ríos': ['Babahoyo', 'Baba', 'Buena Fe', 'Mocache', 'Montalvo', 'Palenque', 'Puebloviejo', 'Quevedo', 'Quinsaloma', 'Urdaneta', 'Valencia', 'Ventanas', 'Vinces'],
  'Manabí': ['Portoviejo', 'Bolívar', 'Chone', 'El Carmen', 'Flavio Alfaro', 'Jama', 'Jaramijó', 'Jipijapa', 'Junín', 'Manta', 'Montecristi', 'Olmedo', 'Paján', 'Pedernales', 'Pichincha', 'Puerto López', 'Rocafuerte', 'San Vicente', 'Santa Ana', 'Sucre', 'Tosagua', '24 de Mayo'],
  'Morona Santiago': ['Macas', 'Gualaquiza', 'Huamboya', 'Limón Indanza', 'Logroño', 'Morona', 'Pablo Sexto', 'Palora', 'San Juan Bosco', 'Santiago', 'Sucúa', 'Taisha', 'Tiwintza'],
  'Napo': ['Tena', 'Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos'],
  'Orellana': ['Francisco de Orellana', 'Aguarico', 'La Joya de los Sachas', 'Loreto'],
  'Pastaza': ['Puyo', 'Arajuno', 'Mera', 'Santa Clara'],
  'Pichincha': ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'Puerto Quito', 'Rumiñahui', 'San Miguel de los Bancos'],
  'Santa Elena': ['Santa Elena', 'La Libertad', 'Salinas'],
  'Santo Domingo de los Tsáchilas': ['Santo Domingo', 'La Concordia'],
  'Sucumbíos': ['Nueva Loja', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Lago Agrio', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
  'Tungurahua': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Pelileo', 'Píllaro', 'Quero', 'Tisaleo'],
  'Zamora-Chinchipe': ['Zamora', 'Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza'],
};
