import { z } from 'zod';

// ─── Store enum (single source of truth, mirrors Store type) ─────────────────

export const storeEnum = z.enum([
  'Coral Hipermercados',
  'Fybeca',
  'Pharmacys',
  'Kywi',
  'Promart',
], {
  error: 'Selecciona el local donde realizaste tu compra',
});

// ─── Registration schema (shared between frontend and API route) ──────────────

export const registerSchema = z.object({
  /**
   * Full name: required, min 3 chars, letters and spaces only.
   * Accepts standard Latin letters plus Spanish diacritics (á é í ó ú Á É Í Ó Ú ñ Ñ ü Ü).
   */
  full_name: z
    .string()
    .min(3, { message: 'Por favor ingresa tu nombre completo' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
      message: 'Por favor ingresa tu nombre completo',
    }),

  /**
   * Cédula / national ID: required, digits only, 9–13 characters.
   * Covers Ecuadorian cédula (10 digits) and RUC (13 digits).
   */
  cedula: z
    .string()
    .regex(/^(\d{10}|\d{13})$/, {
      message: 'La cédula debe tener 10 dígitos o el RUC 13 dígitos',
    }),

  /**
   * Mobile phone number: required, digits only, exactly 9 characters.
   * The +593 country code is shown as a prefix in the UI, so the user
   * enters only the local part without the leading 0 (Ej: 991234567).
   */
  phone: z
    .string()
    .regex(/^\d{9}$/, {
      message: 'Ingresa un número de celular válido (9 dígitos)',
    }),

  /**
   * Purchase store: must be one of the five valid options.
   */
  store: storeEnum,

  /**
   * Ecuadorian province where the purchase was made.
   */
  province: z
    .string()
    .min(1, { message: 'Selecciona tu provincia' }),

  /**
   * City within the selected province.
   */
  city: z
    .string()
    .min(1, { message: 'Selecciona tu ciudad' }),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type RegisterSchemaInput = z.input<typeof registerSchema>;
export type RegisterSchemaOutput = z.output<typeof registerSchema>;
