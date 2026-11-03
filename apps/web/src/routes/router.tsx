import type { RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import Home from '@/pages/public/home/home';
import NotFound from '@/pages/extra/not-found';
import Login from '@/pages/auth/login';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import { GuestRoute } from './route-guards';

// Pages publiques sous AppLayout ; pages d'authentification en plein écran (AuthWrapper).
// À venir : /pre-inscription, l'inscription, l'espace étudiant (/espace) et le back-office (/admin),
// protégés par PrivateRoute (routes/route-guards.tsx).
export const AppRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
  },
  // Accessible connecté ou non : le lien de l'email doit toujours fonctionner
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
