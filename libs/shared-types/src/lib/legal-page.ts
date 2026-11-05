import { z } from 'zod';

// Pages légales modifiables dans le back-office (Paramètres). L'identifiant est aussi l'URL publique.
export const legalPageIdSchema = z.enum(['mentions-legales', 'politique-de-confidentialite']);
export type LegalPageId = z.infer<typeof legalPageIdSchema>;

// content nul : jamais modifiée, le texte par défaut du site s'applique (apps/web/src/data/legal.data.ts)
export const legalPageSchema = z.object({
  id: legalPageIdSchema,
  content: z.string().nullable(),
  updatedAt: z.string().nullable(),
});
export type LegalPage = z.infer<typeof legalPageSchema>;

// Le texte seul, sans les balises de l'éditeur
export const legalPageHasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0;

export const updateLegalPageSchema = z.object({
  content: z
    .string()
    .max(200_000, 'Texte trop long')
    .refine(legalPageHasText, { message: 'Le contenu ne peut pas être vide' }),
});
export type UpdateLegalPageInput = z.infer<typeof updateLegalPageSchema>;
