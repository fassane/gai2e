import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthSession } from '@gai2e/shared-types';

declare module 'axios' {
  interface AxiosRequestConfig {
    // Ne pas tenter de renouveler la session sur un 401 (routes /auth elles-mêmes)
    skipAuthRefresh?: boolean;
  }
}

// Client HTTP de l'API. Même origine que le site : /api est relayé vers l'api par Nginx
// (et par le proxy de Vite en dev), le cookie de session suit donc sans configuration CORS.
export const http = axios.create({ baseURL: '/api', withCredentials: true });

// Jeton d'accès gardé en mémoire seulement (jamais dans le localStorage) ;
// après un rechargement, il est redemandé à /auth/refresh grâce au cookie httpOnly.
let accessToken: string | null = null;
let onSessionChange: ((session: AuthSession | null) => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

// Prévenu quand la session est renouvelée ou perdue (AuthProvider)
export function subscribeToSession(listener: (session: AuthSession | null) => void) {
  onSessionChange = listener;
  return () => {
    onSessionChange = null;
  };
}

http.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Un seul refresh à la fois, partagé par les requêtes qui échouent en même temps
let refreshing: Promise<AuthSession | null> | null = null;

export function refreshSession(): Promise<AuthSession | null> {
  refreshing ??= http
    .post<AuthSession>('/auth/refresh', undefined, { skipAuthRefresh: true })
    .then(({ data }) => {
      setAccessToken(data.accessToken);
      onSessionChange?.(data);
      return data;
    })
    .catch(() => {
      setAccessToken(null);
      onSessionChange?.(null);
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Jeton d'accès expiré (401) : on renouvelle la session puis on rejoue la requête une fois.
http.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined;
  if (error.response?.status !== 401 || !config || config._retried || config.skipAuthRefresh || !accessToken) {
    throw error;
  }
  config._retried = true;
  const session = await refreshSession();
  if (!session) throw error;
  return http(config);
});

// Message lisible d'une erreur d'API ({ message } renvoyé par NestJS), sinon le message par défaut.
export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue. Réessayez.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
    if (error.response.status === 429) return 'Trop de tentatives. Patientez une minute avant de réessayer.';
    const message = (error.response.data as { message?: unknown } | undefined)?.message;
    if (typeof message === 'string' && message !== 'Payload invalide') return message;
  }
  return fallback;
}
