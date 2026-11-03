import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LuLayoutDashboard, LuSettings, LuSlidersHorizontal } from 'react-icons/lu';
import type { UserRole } from '@gai2e/shared-types';

export type DashboardMenuItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  // Rôles qui voient l'entrée (tous les rôles du back-office par défaut)
  roles?: UserRole[];
};

export type DashboardMenuSection = {
  id: string;
  title: string;
  items: DashboardMenuItem[];
};

// Menu du back-office. Les prochains onglets (Dossiers, Étudiants, Prospects, Destinations...) s'ajoutent ici.
export const dashboardMenu: DashboardMenuSection[] = [
  {
    id: 'overview',
    title: "Vue d'ensemble",
    items: [
      {
        id: 'dashboard',
        label: 'Tableau de bord',
        path: '/admin/dashboard',
        icon: createElement(LuLayoutDashboard),
      },
    ],
  },
  {
    id: 'system',
    title: 'Système',
    items: [
      {
        id: 'configuration',
        label: 'Configuration',
        path: '/admin/configuration',
        icon: createElement(LuSlidersHorizontal),
        roles: ['ADMIN'],
      },
      {
        id: 'settings',
        label: 'Paramètres',
        path: '/admin/settings',
        icon: createElement(LuSettings),
        roles: ['ADMIN'],
      },
    ],
  },
];

// Pages hors menu (accessibles depuis le menu du compte)
const otherPages = [{ path: '/admin/profile', label: 'Mon profil' }];

// Libellé de la page courante (fil d'Ariane)
export function pageLabelOf(pathname: string): string {
  const pages = [...dashboardMenu.flatMap((section) => section.items), ...otherPages];
  return pages.find((page) => pathname.startsWith(page.path))?.label ?? 'Tableau de bord';
}
