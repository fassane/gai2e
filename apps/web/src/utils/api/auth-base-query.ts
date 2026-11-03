import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { AuthSession } from '@gai2e/shared-types';
import { onLogout, onSetSession, type AuthState } from '@/redux/slice/auth.slice';

// Même origine que l'api : /api est relayé par Nginx (et par le proxy de Vite en dev),
// le cookie de session suit sans configuration CORS.
export const API_BASE_URL = '/api';

const accessTokenOf = (state: unknown) => (state as { auth: AuthState }).auth.accessToken;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = accessTokenOf(getState());
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

type Dispatch = (action: ReturnType<typeof onSetSession> | ReturnType<typeof onLogout>) => unknown;

/**
 * Renouvelle la session à partir du cookie httpOnly. Un seul renouvellement à la fois pour toute l'app :
 * l'api remplace le refresh token à chaque usage, deux renouvellements simultanés s'annuleraient
 * (requêtes parallèles, double effet du StrictMode). Tous les appelants attendent la même promesse.
 */
let pending: Promise<boolean> | null = null;

export function refreshSession(dispatch: Dispatch): Promise<boolean> {
  pending ??= fetch(`${API_BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      dispatch(onSetSession((await response.json()) as AuthSession));
      return true;
    })
    .catch(() => {
      dispatch(onLogout());
      return false;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

// Au chargement de l'app : restaure la session si le cookie est encore valable, sinon visiteur anonyme
export const restoreSession = () => (dispatch: Dispatch) => refreshSession(dispatch);

/**
 * fetchBaseQuery avec renouvellement silencieux : un 401 sur une route privée renouvelle la session
 * une fois, puis rejoue la requête. Si le renouvellement échoue, l'utilisateur est déconnecté (onLogout).
 * Les routes publiques de l'authentification (NO_REFRESH) n'en déclenchent jamais.
 */
// Routes publiques ou de session : un 401 y est une vraie réponse (mauvais mot de passe...), pas un jeton expiré
const NO_REFRESH = ['auth/login', 'auth/refresh', 'auth/logout', 'auth/forgot-password', 'auth/reset-password'];

export const authBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extra,
) => {
  if (pending) await pending;

  const result = await rawBaseQuery(args, api, extra);
  const url = typeof args === 'string' ? args : args.url;
  if (result.error?.status !== 401 || NO_REFRESH.includes(url) || !accessTokenOf(api.getState())) return result;

  return (await refreshSession(api.dispatch)) ? rawBaseQuery(args, api, extra) : result;
};
