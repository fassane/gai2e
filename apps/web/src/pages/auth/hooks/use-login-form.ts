import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useLoginMutation } from '@/utils/api/auth/auth.api';
import { getApiErrorMessage } from '@/utils/api/errors';
import { homePathOf } from '@/utils/user';

export function useLoginForm() {
  const navigate = useNavigate();
  // Page demandée avant d'être renvoyé vers la connexion (PrivateRoute)
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  // La session est enregistrée dans le store par l'endpoint login (onQueryStarted)
  const onSubmit = handleSubmit(async (input) => {
    try {
      const { user } = await login(input).unwrap();
      customToast.success({ message: `Bienvenue, ${user.firstName} !` });
      // Sinon l'accueil de son espace (back-office pour l'équipe)
      navigate(from ?? homePathOf(user), { replace: true });
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return {
    register,
    errors,
    onSubmit,
    isLoading,
  };
}
