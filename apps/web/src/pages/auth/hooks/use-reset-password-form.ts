import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useResetPasswordMutation } from '@/utils/api/auth/auth.api';
import { getApiErrorMessage } from '@/utils/api/errors';

export function useResetPasswordForm() {
  const navigate = useNavigate();
  // Jeton du lien reçu par email : /reset-password?token=...
  const token = useSearchParams()[0].get('token') ?? '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', passwordConfirmation: '' },
  });

  const onSubmit = handleSubmit(async (input) => {
    try {
      const { message } = await resetPassword(input).unwrap();
      customToast.success({ message, duration: 4000 });
      navigate('/login', { replace: true });
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return {
    register,
    errors,
    onSubmit,
    isLoading,
    hasToken: !!token,
    password: watch('password'),
  };
}
