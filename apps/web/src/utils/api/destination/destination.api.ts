import type { DestinationDetail, DestinationSummary } from '@gai2e/shared-types';
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
