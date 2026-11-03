import type { SiteConfig, SiteConfigInput } from '@gai2e/shared-types';
import { BaseApi } from '../base-api';

// Réglages du site (apps/api/src/app/site-config)
export const SiteConfigApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteConfig: builder.query<SiteConfig, void>({
      query: () => 'site-config',
      providesTags: ['SiteConfig'],
    }),
    updateSiteConfig: builder.mutation<SiteConfig, SiteConfigInput>({
      query: (body) => ({ url: 'admin/site-config', method: 'PUT', body }),
      invalidatesTags: ['SiteConfig'],
    }),
  }),
});

export const { useGetSiteConfigQuery, useUpdateSiteConfigMutation } = SiteConfigApi;
