import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { applyPageMeta, pageMetaOf } from '@/routes/page-meta';
import { AppRoutes } from '@/routes/router';
import { useAppDispatch } from '@/redux/hooks';
import { restoreSession } from '@/utils/api/auth-base-query';

// Remonte en haut à chaque changement de page, ou défile jusqu'à l'ancre (/#destinations).
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// Titre et règles d'indexation de la page courante
const PageMetaManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    applyPageMeta(pageMetaOf(pathname, window.location.hostname));
  }, [pathname]);
  return null;
};

export function App() {
  const routes = useRoutes(AppRoutes);
  const dispatch = useAppDispatch();

  // Restaure la session (cookie httpOnly) au chargement ; status passe de 'loading' à 'authenticated' ou 'anonymous'
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <PageMetaManager />
      {routes}
    </>
  );
}

export default App;
