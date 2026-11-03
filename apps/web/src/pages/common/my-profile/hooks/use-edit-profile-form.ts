import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type AuthUser, type UpdateProfileInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useAuth } from '@/redux/hooks';
import { useUpdateMeMutation } from '@/utils/api/auth/auth.api';
import { getApiErrorMessage } from '@/utils/api/errors';

const valuesOf = (user: AuthUser | null): UpdateProfileInput => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  phone: user?.phone ?? null,
  whatsappPhone: user?.whatsappPhone ?? null,
});

// Formulaire du profil : valeurs du compte connecté, enregistrées par PATCH /auth/me.
// onSaved : appelé après un enregistrement réussi (sortie du mode édition).
export function useEditProfileForm(onSaved: () => void) {
  const { user } = useAuth();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: valuesOf(user),
  });

  // Valeurs à jour du compte (chargement, puis après chaque enregistrement)
  useEffect(() => {
    form.reset(valuesOf(user));
  }, [user, form]);

  const resetForm = useCallback(() => form.reset(valuesOf(user)), [form, user]);

  const onSubmit = form.handleSubmit(async (input) => {
    try {
      await updateMe(input).unwrap();
      customToast.success({ message: 'Vos informations ont été enregistrées.' });
      onSaved();
    } catch (error) {
      form.setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return { form, onSubmit, isLoading, resetForm };
}
