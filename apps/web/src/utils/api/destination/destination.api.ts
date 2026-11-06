import type {
  AdminDestination,
  AdminDestinationDetail,
  AdminProcedureStep,
  CreateDestinationInput,
  CreateProcedureStepInput,
  DestinationDetail,
  DestinationSummary,
  DocumentTypeOption,
  UpdateDestinationInput,
  UpdateProcedureStepInput,
} from '@gai2e/shared-types';
import { BaseApi } from '../base-api';

// Destinations publiques (apps/api/src/app/destinations)
export const DestinationApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query<DestinationSummary[], void>({
      query: () => 'destinations',
      providesTags: ['Destination'],
    }),
    getDestination: builder.query<DestinationDetail, string>({
      query: (slug) => `destinations/${encodeURIComponent(slug)}`,
      providesTags: ['Destination'],
    }),
  }),
});

export const { useGetDestinationsQuery, useGetDestinationQuery } = DestinationApi;

// Back-office : gestion des destinations et des étapes (administrateurs).
// Le tag commun rafraîchit aussi les fiches publiques après chaque modification.
export const AdminDestinationApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDestinations: builder.query<AdminDestination[], void>({
      query: () => 'admin/destinations',
      providesTags: ['Destination'],
    }),
    getAdminDestination: builder.query<AdminDestinationDetail, string>({
      query: (id) => `admin/destinations/${id}`,
      providesTags: ['Destination'],
    }),
    getDocumentTypes: builder.query<DocumentTypeOption[], void>({
      query: () => 'admin/document-types',
    }),
    createDestination: builder.mutation<AdminDestination, CreateDestinationInput>({
      query: (body) => ({ url: 'admin/destinations', method: 'POST', body }),
      invalidatesTags: ['Destination'],
    }),
    updateDestination: builder.mutation<AdminDestination, { id: string } & UpdateDestinationInput>({
      query: ({ id, ...body }) => ({ url: `admin/destinations/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Destination'],
    }),
    reorderDestinations: builder.mutation<void, string[]>({
      query: (ids) => ({ url: 'admin/destinations/order', method: 'PUT', body: { ids } }),
      invalidatesTags: ['Destination'],
    }),
    createProcedureStep: builder.mutation<AdminProcedureStep, { destinationId: string } & CreateProcedureStepInput>({
      query: ({ destinationId, ...body }) => ({
        url: `admin/destinations/${destinationId}/steps`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Destination'],
    }),
    updateProcedureStep: builder.mutation<
      AdminProcedureStep,
      { destinationId: string; stepId: string } & UpdateProcedureStepInput
    >({
      query: ({ destinationId, stepId, ...body }) => ({
        url: `admin/destinations/${destinationId}/steps/${stepId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Destination'],
    }),
    reorderProcedureSteps: builder.mutation<void, { destinationId: string; ids: string[] }>({
      query: ({ destinationId, ids }) => ({
        url: `admin/destinations/${destinationId}/steps/order`,
        method: 'PUT',
        body: { ids },
      }),
      invalidatesTags: ['Destination'],
    }),
  }),
});

export const {
  useGetAdminDestinationsQuery,
  useGetAdminDestinationQuery,
  useGetDocumentTypesQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useReorderDestinationsMutation,
  useCreateProcedureStepMutation,
  useUpdateProcedureStepMutation,
  useReorderProcedureStepsMutation,
} = AdminDestinationApi;
