import { z } from 'zod';
import { emailSchema, nameSchema, userRoleSchema } from './auth';

// =====================================================
// Back-office : tableau de bord
// =====================================================

export const dossierStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']);
export type DossierStatus = z.infer<typeof dossierStatusSchema>;

export const dossierStatusLabels: Record<DossierStatus, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  IN_PROGRESS: 'En cours',
  ON_HOLD: 'En pause',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

export const leadStatusSchema = z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED']);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'Nouveau',
  CONTACTED: 'Contacté',
  CONVERTED: 'Converti',
  CLOSED: 'Clos',
};

export const dashboardSchema = z.object({
  // Périmètre : tous les dossiers (admin) ou ceux du conseiller connecté
  scope: z.enum(['all', 'mine']),
  kpis: z.object({
    // Soumis, en cours ou en pause
    activeDossiers: z.number().int(),
    // Soumis sans conseiller
    awaitingAssignment: z.number().int(),
    // Pièces déposées ou en revue
    documentsToReview: z.number().int(),
    // Étapes non terminées dont l'échéance est passée, sur les dossiers actifs
    overdueSteps: z.number().int(),
    // Prospects de la landing à recontacter
    newLeads: z.number().int(),
    students: z.number().int(),
  }),
  dossiersByStatus: z.array(z.object({ status: dossierStatusSchema, count: z.number().int() })),
  dossiersByDestination: z.array(z.object({ countryCode: z.string(), name: z.string(), count: z.number().int() })),
  // Prochaines échéances (14 jours) des dossiers actifs
  upcomingSteps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      dueAt: z.string(),
      dossierReference: z.string(),
      studentName: z.string(),
      countryCode: z.string(),
    }),
  ),
  recentLeads: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      destination: z.string().nullable(),
      countryCode: z.string().nullable(),
      status: leadStatusSchema,
      createdAt: z.string(),
    }),
  ),
});
export type Dashboard = z.infer<typeof dashboardSchema>;

// =====================================================
// Back-office : équipe (conseillers et administrateurs)
// =====================================================

export const staffRoleSchema = userRoleSchema.extract(['ADVISOR', 'ADMIN']);
export type StaffRole = z.infer<typeof staffRoleSchema>;

export const roleLabels: Record<z.infer<typeof userRoleSchema>, string> = {
  STUDENT: 'Étudiant',
  ADVISOR: 'Conseiller',
  ADMIN: 'Administrateur',
};

export const teamMemberSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: staffRoleSchema,
  isActive: z.boolean(),
  // Invitation pas encore acceptée (aucun mot de passe choisi)
  invitationPending: z.boolean(),
  lastLoginAt: z.string().nullable(),
  activeDossiers: z.number().int(),
  createdAt: z.string(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;

export const inviteTeamMemberSchema = z.object({
  email: emailSchema,
  firstName: nameSchema('le prénom'),
  lastName: nameSchema('le nom'),
  role: staffRoleSchema,
});
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;

export const updateTeamMemberSchema = z.object({
  isActive: z.boolean(),
});
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
