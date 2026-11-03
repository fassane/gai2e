import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@gai2e/shared-types';
import { authApi } from '@/api/auth.api';
import { getApiErrorMessage } from '@/api/http';

export function useForgotPasswordForm() {
  // Adresse à laquelle le lien a été envoyé : la page affiche alors la confirmation
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async (input) => {
    try {
      await authApi.forgotPassword(input);
      setSentTo(input.email);
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  // Saisir une autre adresse
  const restart = () => {
    reset();
    setSentTo(null);
  };

  return { register, errors, onSubmit, isLoading: isSubmitting, sentTo, restart };
}
