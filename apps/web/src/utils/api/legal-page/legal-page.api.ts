import type { LegalPage, LegalPageId, UpdateLegalPageInput } from '@gai2e/shared-types';
import { BaseApi } from '../base-api';

// Pages légales (apps/api/src/app/legal-pages)
export const LegalPageApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalPage: builder.query<LegalPage, LegalPageId>({
      query: (id) => `legal-pages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'LegalPage', id }],
    }),
    updateLegalPage: builder.mutation<LegalPage, { id: LegalPageId } & UpdateLegalPageInput>({
      query: ({ id, ...body }) => ({ url: `admin/legal-pages/${id}`, method: 'PUT', body }),
      // La réponse contient la page à jour : le site l'affiche aussitôt, sans attendre un rechargement
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) dispatch(LegalPageApi.util.upsertQueryData('getLegalPage', id, data));
      },
    }),
  }),
});

export const { useGetLegalPageQuery, useUpdateLegalPageMutation } = LegalPageApi;
