import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@gai2e/ui';
import DashboardHeader from './components/dashboard-header';
import { DashboardSidebar } from './components/dashboard-sidebar';

// Layout du back-office (/admin) : sidebar repliable, header avec fil d'Ariane et menu du compte.
const DashboardLayout = () => (
  <SidebarProvider style={{ '--sidebar-width': '16rem' } as CSSProperties}>
    <DashboardSidebar />
    <SidebarInset className="bg-workspace">
      <DashboardHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-16 md:px-6">
        <Outlet />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export default DashboardLayout;
