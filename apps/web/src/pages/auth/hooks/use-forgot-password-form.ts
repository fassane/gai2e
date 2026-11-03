import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@gai2e/shared-types';
import { useForgotPasswordMutation } from '@/utils/api/auth/auth.api';
import { getApiErrorMessage } from '@/utils/api/errors';

export function useForgotPasswordForm() {
  // Adresse à laquelle le lien a été envoyé : la page affiche alors la confirmation
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async (input) => {
    try {
      await forgotPassword(input).unwrap();
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

  return { register, errors, onSubmit, isLoading, sentTo, restart };
}
