import { z } from 'zod';

// Schémas de l'authentification, partagés par l'api (DTOs nestjs-zod) et le web (formulaires).

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Saisissez votre adresse email')
  .pipe(z.email('Adresse email invalide'));

// Règles du mot de passe, affichées une à une dans le formulaire (PasswordCheck).
export const passwordRules = [
  { id: 'length', label: 'Au moins 8 caractères', test: (value: string) => value.length >= 8 },
  { id: 'lowercase', label: 'Une minuscule', test: (value: string) => /[a-z]/.test(value) },
  { id: 'uppercase', label: 'Une majuscule', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'digit', label: 'Un chiffre', test: (value: string) => /\d/.test(value) },
  { id: 'special', label: 'Un caractère spécial', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export const passwordSchema = z
  .string()
  .max(128, 'Mot de passe trop long (128 caractères maximum)')
  .refine((value) => passwordRules.every((rule) => rule.test(value)), {
    message: 'Le mot de passe ne respecte pas toutes les règles',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Saisissez votre mot de passe').max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    // Jeton reçu dans le lien de l'email
    token: z.string().min(1, 'Lien de réinitialisation invalide').max(256),
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, 'Confirmez le mot de passe'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation'],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const userRoleSchema = z.enum(['STUDENT', 'ADVISOR', 'ADMIN']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: userRoleSchema,
  emailVerified: z.boolean(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

// Réponse de /auth/login et /auth/refresh. Le refresh token n'y figure pas :
// il est posé dans un cookie httpOnly, illisible par le JavaScript du navigateur.
export const authSessionSchema = z.object({
  accessToken: z.string(),
  // Durée de validité du jeton d'accès, en secondes
  expiresIn: z.number().int(),
  user: authUserSchema,
});
export type AuthSession = z.infer<typeof authSessionSchema>;

export const messageResponseSchema = z.object({
  message: z.string(),
});
export type MessageResponse = z.infer<typeof messageResponseSchema>;
