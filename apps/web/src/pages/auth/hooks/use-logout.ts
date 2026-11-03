import { customToast } from '@gai2e/ui';
import { useLogoutMutation } from '@/utils/api/auth/auth.api';

// Déconnexion : session fermée côté api, store et cache vidés (endpoint logout, onQueryStarted)
export function useLogout() {
  const [logout, { isLoading }] = useLogoutMutation();

  const onLogout = async () => {
    await logout().catch(() => undefined);
    customToast.success({ message: 'Vous êtes déconnecté.' });
  };

  return { onLogout, isLoading };
}
