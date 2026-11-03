import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { getApiErrorMessage } from '@/api/http';
import { useAuth } from '@/auth/auth-context';

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // Page demandée avant d'être renvoyé vers la connexion (GuestRoute / futures routes protégées)
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async (input) => {
    try {
      const user = await login(input);
      customToast.success({ message: `Bienvenue, ${user.firstName} !` });
      navigate(from, { replace: true });
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return { register, errors, onSubmit, isLoading: isSubmitting };
}
