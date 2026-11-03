import type { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import Home from '@/pages/public/home/home';
import NotFound from '@/pages/extra/not-found';

// Pages publiques sous AppLayout. À venir : /pre-inscription, /login,
// espace étudiant (/espace, StudentLayout) et back-office (/admin, DashboardLayout),
// protégés par des guards dans routes/routerUtils.tsx.
export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
