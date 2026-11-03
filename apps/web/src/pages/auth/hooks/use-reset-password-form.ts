import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { authApi } from '@/api/auth.api';
import { getApiErrorMessage } from '@/api/http';

export function useResetPasswordForm() {
  const navigate = useNavigate();
  // Jeton du lien reçu par email : /reset-password?token=...
  const token = useSearchParams()[0].get('token') ?? '';

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', passwordConfirmation: '' },
  });

  const onSubmit = handleSubmit(async (input) => {
    try {
      const { message } = await authApi.resetPassword(input);
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
    isLoading: isSubmitting,
    hasToken: !!token,
    password: watch('password'),
  };
}
