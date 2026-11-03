import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AppRoutes } from '@/routes/router';

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


export function App() {
  const routes = useRoutes(AppRoutes);
  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}

export default App;
