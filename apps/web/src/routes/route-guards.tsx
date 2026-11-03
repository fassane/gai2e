import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@gai2e/shared-types';
import { Spinner } from '@gai2e/ui';
import { useAuth } from '@/redux/hooks';
import { homePathOf } from '@/utils/user';

function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}

// Pages réservées aux visiteurs non connectés (connexion, mot de passe oublié) :
// un utilisateur déjà connecté est renvoyé vers la page d'où il venait, sinon l'accueil de son espace.
export function GuestRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from;
  if (status === 'loading') return <FullPageLoader />;
  if (status === 'authenticated') return <Navigate to={from ?? homePathOf(user)} replace />;
  return children;
}

// Pages réservées aux utilisateurs connectés, éventuellement à certains rôles :
// le visiteur est envoyé vers la connexion puis ramené ici ; un rôle non autorisé, vers l'accueil de son espace.
export function PrivateRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <FullPageLoader />;
  if (status === 'anonymous' || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathOf(user)} replace />;
  return children;
}
