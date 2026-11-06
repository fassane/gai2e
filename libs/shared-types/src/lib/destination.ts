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
