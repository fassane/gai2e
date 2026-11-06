import { Navigate, type RouteObject } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import DashboardLayout from '@/layouts/dashboard-layout';
import Home from '@/pages/public/home/home';
import FaqsPage from '@/pages/public/faqs/faqs';
import PricingPage from '@/pages/public/pricing/pricing';
import DestinationsPage from '@/pages/public/destinations/destinations';
import DestinationDetails from '@/pages/public/destinations/destination-details';
import NotFound from '@/pages/extra/not-found';
import LegalNotice from '@/pages/extra/legal-notice';
import PrivacyPolicy from '@/pages/extra/privacy-policy';
import Login from '@/pages/auth/login';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import AdminDashboard from '@/pages/admin/dashboard/admin-dashboard';
import AdminSettings from '@/pages/admin/settings/admin-settings';
import AdminConfiguration from '@/pages/admin/configuration/admin-configuration';
import MyProfile from '@/pages/common/my-profile/my-profile';
import SettingTeam from '@/pages/admin/settings/tabs/setting-team';
import LegalPageTab from '@/pages/admin/settings/tabs/legal-page-tab';
import { STAFF_ROLES } from '@/utils/user';
import { GuestRoute, PrivateRoute } from './route-guards';

// Pages publiques sous AppLayout ; pages d'authentification en plein écran (AuthWrapper) ;
// back-office (/admin) sous DashboardLayout, réservé à l'équipe.
// À venir : /pre-inscription, l'inscription et l'espace étudiant (/espace).
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
  // Accessible connecté ou non : le lien de l'email (réinitialisation, invitation) doit toujours fonctionner
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={STAFF_ROLES}>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'profile', element: <MyProfile /> },
      {
        path: 'configuration',
        element: (
          <PrivateRoute roles={['ADMIN']}>
            <AdminConfiguration />
          </PrivateRoute>
        ),
      },
      // Paramètres de la plateforme : administrateurs seulement
      {
        path: 'settings',
        element: (
          <PrivateRoute roles={['ADMIN']}>
            <AdminSettings />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="team" replace /> },
          { path: 'team', element: <SettingTeam /> },
          { path: 'mentions-legales', element: <LegalPageTab key="legal-notice" pageId="mentions-legales" /> },
          {
            path: 'politique-de-confidentialite',
            element: <LegalPageTab key="privacy-policy" pageId="politique-de-confidentialite" />,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'faqs', element: <FaqsPage /> },
      { path: 'tarifs', element: <PricingPage /> },
      { path: 'destinations', element: <DestinationsPage /> },
      { path: 'destinations/:slug', element: <DestinationDetails /> },
      { path: 'mentions-legales', element: <LegalNotice /> },
      { path: 'politique-de-confidentialite', element: <PrivacyPolicy /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
