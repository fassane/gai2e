import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Message lisible d'une erreur d'appel à l'api ({ message } renvoyé par NestJS), sinon le message par défaut.
export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue. Réessayez.'): string {
  const fetchError = error as FetchBaseQueryError | SerializedError | undefined;
  if (!fetchError || !('status' in fetchError)) return fallback;
  if (fetchError.status === 'FETCH_ERROR')
    return 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
  if (fetchError.status === 429) return 'Trop de tentatives. Patientez une minute avant de réessayer.';
  const message = (fetchError.data as { message?: unknown } | undefined)?.message;
  if (typeof message === 'string' && message !== 'Payload invalide') return message;
  return fallback;
}
