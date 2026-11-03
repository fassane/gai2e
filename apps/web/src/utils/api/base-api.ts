import { createApi } from '@reduxjs/toolkit/query/react';
import { authBaseQuery } from './auth-base-query';

// Un seul createApi pour toute l'app : chaque domaine y ajoute ses endpoints (injectEndpoints,
// dans utils/api/<domaine>/<domaine>.api.ts). Cache et tags communs : une mutation d'un domaine
// peut invalider les données d'un autre (pièce validée → dossier).
export const BaseApi = createApi({
  reducerPath: 'api',
  baseQuery: authBaseQuery,
  tagTypes: ['User', 'Dashboard', 'Team'],
  endpoints: () => ({}),
});
