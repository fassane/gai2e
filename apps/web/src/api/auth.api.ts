import type {
  AuthSession,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  MessageResponse,
  ResetPasswordInput,
} from '@gai2e/shared-types';
import { http } from './http';

// Appels de l'API d'authentification (apps/api/src/app/auth)
export const authApi = {
  login: (body: LoginInput) =>
    http.post<AuthSession>('/auth/login', body, { skipAuthRefresh: true }).then((r) => r.data),
  logout: () => http.post<void>('/auth/logout', undefined, { skipAuthRefresh: true }).then(() => undefined),
  me: () => http.get<AuthUser>('/auth/me').then((r) => r.data),
  forgotPassword: (body: ForgotPasswordInput) =>
    http.post<MessageResponse>('/auth/forgot-password', body, { skipAuthRefresh: true }).then((r) => r.data),
  resetPassword: (body: ResetPasswordInput) =>
    http.post<MessageResponse>('/auth/reset-password', body, { skipAuthRefresh: true }).then((r) => r.data),
};
