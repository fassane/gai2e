import { Outlet } from 'react-router-dom';
import { LuFileText, LuShieldCheck, LuUsers } from 'react-icons/lu';
import { NavTabs, TopTitle, type NavTab } from '@gai2e/ui';

//
const tabs: NavTab[] = [
  { id: 'team', title: 'Équipe', link: '/admin/settings/team', icon: <LuUsers className="size-4" /> },
  {
    id: 'legal-notice',
    title: 'Mentions légales',
    link: '/admin/settings/mentions-legales',
    icon: <LuFileText className="size-4" />,
  },
  {
    id: 'privacy-policy',
    title: 'Politique de confidentialité',
    link: '/admin/settings/politique-de-confidentialite',
    icon: <LuShieldCheck className="size-4" />,
  },
];

const AdminSettings = () => (
  <div>
    <TopTitle title="Paramètres" paragraph="Configuration de la plateforme GAI2E Conseils." />
    <NavTabs tabs={tabs} />
    <Outlet />
  </div>
);

export default AdminSettings;
