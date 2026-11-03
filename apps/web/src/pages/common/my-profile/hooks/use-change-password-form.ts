import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useChangePasswordMutation } from '@/utils/api/auth/auth.api';
import { getApiErrorMessage } from '@/utils/api/errors';

// onDone : appelé après le changement (fermeture de la modale)
export function useChangePasswordForm(onDone: () => void) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' },
  });

  const onSubmit = handleSubmit(async (input) => {
    try {
      const { message } = await changePassword(input).unwrap();
      customToast.success({ message: `${message} Vos autres appareils ont été déconnectés.`, duration: 4000 });
      onDone();
    } catch (error) {
      const message = getApiErrorMessage(error);
      // Erreur sur le mot de passe actuel : affichée sous le champ concerné
      if (message === 'Mot de passe actuel incorrect') setError('currentPassword', { message });
      else setError('root', { message });
    }
  });

  return { register, errors, onSubmit, isLoading, password: watch('password') };
}
