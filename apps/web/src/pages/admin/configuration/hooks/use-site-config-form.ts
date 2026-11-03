import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteConfigSchema, type SiteConfig, type SiteConfigInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useGetSiteConfigQuery, useUpdateSiteConfigMutation } from '@/utils/api/site-config/site-config.api';
import { getApiErrorMessage } from '@/utils/api/errors';

// Valeurs du formulaire : la configuration sans sa date de modification
const valuesOf = (config: SiteConfig): SiteConfigInput => {
  const values: Partial<SiteConfig> = { ...config };
  delete values.updatedAt;
  return values as SiteConfigInput;
};

// Formulaire des réglages du site : chargés par GET /site-config, enregistrés par PUT /admin/site-config.
// onInvalid : appelé avec les champs en erreur (pour afficher l'onglet concerné).
export function useSiteConfigForm(onInvalid: (fields: string[]) => void) {
  const { data, isLoading: isFetching, error: fetchError } = useGetSiteConfigQuery();
  const [update, { isLoading }] = useUpdateSiteConfigMutation();

  const form = useForm<SiteConfigInput>({ resolver: zodResolver(siteConfigSchema) });

  useEffect(() => {
    if (data) form.reset(valuesOf(data));
  }, [data, form]);

  const onSubmit = form.handleSubmit(
    async (input) => {
      try {
        await update(input).unwrap();
        customToast.success({ message: 'Configuration enregistrée. Le site est à jour.' });
      } catch (error) {
        form.setError('root', { message: getApiErrorMessage(error) });
      }
    },
    (errors) => onInvalid(Object.keys(errors)),
  );

  return { form, onSubmit, isLoading, isFetching, fetchError, updatedAt: data?.updatedAt ?? null };
}
