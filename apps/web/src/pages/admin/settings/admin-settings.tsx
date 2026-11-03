import { Outlet } from 'react-router-dom';
import { LuUsers } from 'react-icons/lu';
import { NavTabs, TopTitle, type NavTab } from '@gai2e/ui';

// Paramètres de la plateforme (administrateurs). Le profil de chacun est sur /admin/profile.
// Les prochains onglets (destinations, procédures, types de pièces...) s'ajoutent ici.
const tabs: NavTab[] = [
  { id: 'team', title: 'Équipe', link: '/admin/settings/team', icon: <LuUsers className="size-4" /> },
];

const AdminSettings = () => (
  <div>
    <TopTitle title="Paramètres" paragraph="Configuration de la plateforme GAI2E Conseils." />
    <NavTabs tabs={tabs} />
    <Outlet />
  </div>
);

export default AdminSettings;
