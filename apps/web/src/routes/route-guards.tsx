import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@gai2e/ui';
import { useAuth } from '@/auth/auth-context';

function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}

// Pages réservées aux visiteurs non connectés (connexion, mot de passe oublié) :
// un utilisateur déjà connecté est renvoyé vers la page d'où il venait, sinon l'accueil.
export function GuestRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  if (status === 'loading') return <FullPageLoader />;
  if (status === 'authenticated') return <Navigate to={from} replace />;
  return children;
}

// Pages réservées aux utilisateurs connectés (espace étudiant, back-office, à venir) :
// le visiteur est envoyé vers la connexion, puis ramené ici.
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <FullPageLoader />;
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
