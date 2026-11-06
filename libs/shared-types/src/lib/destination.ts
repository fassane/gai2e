import { z } from 'zod';

// Destinations publiques (fiches pays) : configuration en base, jamais en code.

export const stepCategorySchema = z.enum([
  'ORIENTATION',
  'LANGUAGE',
  'ADMISSION',
  'FINANCES',
  'VISA',
  'HOUSING',
  'TRAVEL',
  'ARRIVAL',
]);
export type StepCategory = z.infer<typeof stepCategorySchema>;

export const stepCategoryLabels: Record<StepCategory, string> = {
  ORIENTATION: 'Orientation',
  LANGUAGE: 'Langue',
  ADMISSION: 'Admission',
  FINANCES: 'Finances',
  VISA: 'Visa',
  HOUSING: 'Logement',
  TRAVEL: 'Voyage',
  ARRIVAL: 'Arrivée',
};

export const destinationSummarySchema = z.object({
  countryCode: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string().nullable(),
  stepCount: z.number().int(),
});
export type DestinationSummary = z.infer<typeof destinationSummarySchema>;

const destinationDocumentSchema = z.object({ code: z.string(), label: z.string() });

export const destinationDetailSchema = destinationSummarySchema.extend({
  steps: z.array(
    z.object({
      code: z.string(),
      title: z.string(),
      description: z.string(),
      category: stepCategorySchema,
      // Jours avant la rentrée visée (négatif : après la rentrée), indicatif
      dueDaysBeforeIntake: z.number().int().nullable(),
      // Étape conditionnelle : le conseiller la garde ou la saute selon le projet
      isOptional: z.boolean(),
      externalUrl: z.string().nullable(),
      documents: z.array(destinationDocumentSchema),
    }),
  ),
  // Pièces de toutes les étapes, sans doublon
  documents: z.array(destinationDocumentSchema),
});
export type DestinationDetail = z.infer<typeof destinationDetailSchema>;

// =====================================================
// Back-office : gestion des destinations et des étapes (ADMIN)
// =====================================================

// « Corée du Sud » → « coree-du-sud » (adresse des fiches, codes des étapes)
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const destinationFields = {
  name: z.string().trim().min(1, 'Saisissez le nom du pays').max(100, 'Trop long (100 caractères maximum)'),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Code devise à 3 lettres (ex. EUR, CAD)'),
  summary: z
    .string()
    .trim()
    .max(500, 'Trop long (500 caractères maximum)')
    .nullable()
    .or(z.literal('').transform(() => null)),
};

export const createDestinationSchema = z.object({
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'Code pays à 2 lettres (ISO, ex. CA, FR)'),
  ...destinationFields,
});
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;

// Le code pays et l'adresse de la fiche ne changent pas après la création (liens et référencement)
export const updateDestinationSchema = z
  .object(destinationFields)
  .partial()
  .extend({ isActive: z.boolean().optional() });
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;

export const reorderSchema = z.object({ ids: z.array(z.string()).min(1) });
export type ReorderInput = z.infer<typeof reorderSchema>;

const stepFields = {
  title: z.string().trim().min(1, 'Saisissez le titre').max(150, 'Trop long (150 caractères maximum)'),
  description: z.string().trim().min(1, 'Saisissez la description').max(2000, 'Trop long (2000 caractères maximum)'),
  category: stepCategorySchema,
  dueDaysBeforeIntake: z
    .number({ message: 'Saisissez un nombre de jours' })
    .int('Saisissez un nombre entier')
    .min(-365, 'Entre -365 et 1000 jours')
    .max(1000, 'Entre -365 et 1000 jours')
    .nullable(),
  isOptional: z.boolean(),
  externalUrl: z
    .string()
    .trim()
    .max(500, 'Lien trop long')
    .pipe(z.url({ protocol: /^https?$/, message: 'Lien invalide (https://…)' }))
    .nullable()
    .or(z.literal('').transform(() => null)),
  documentTypeCodes: z.array(z.string()),
};

export const createProcedureStepSchema = z.object(stepFields);
export type CreateProcedureStepInput = z.infer<typeof createProcedureStepSchema>;

export const updateProcedureStepSchema = z.object(stepFields).partial().extend({ isActive: z.boolean().optional() });
export type UpdateProcedureStepInput = z.infer<typeof updateProcedureStepSchema>;

export const documentTypeOptionSchema = z.object({ code: z.string(), label: z.string() });
export type DocumentTypeOption = z.infer<typeof documentTypeOptionSchema>;

export const adminProcedureStepSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  category: stepCategorySchema,
  dueDaysBeforeIntake: z.number().int().nullable(),
  isOptional: z.boolean(),
  externalUrl: z.string().nullable(),
  isActive: z.boolean(),
  documents: z.array(documentTypeOptionSchema),
});
export type AdminProcedureStep = z.infer<typeof adminProcedureStepSchema>;

export const adminDestinationSchema = z.object({
  id: z.string(),
  countryCode: z.string(),
  slug: z.string(),
  name: z.string(),
  currency: z.string(),
  summary: z.string().nullable(),
  isActive: z.boolean(),
  activeStepCount: z.number().int(),
  updatedAt: z.string(),
});
export type AdminDestination = z.infer<typeof adminDestinationSchema>;

export const adminDestinationDetailSchema = adminDestinationSchema.extend({
  steps: z.array(adminProcedureStepSchema),
});
export type AdminDestinationDetail = z.infer<typeof adminDestinationDetailSchema>;
