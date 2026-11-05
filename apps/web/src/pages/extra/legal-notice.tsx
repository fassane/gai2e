import { LegalPage } from './legal-page';

const LegalNotice = () => (
  <LegalPage
    pageId="mentions-legales"
    related={{ label: 'Politique de confidentialité', to: '/politique-de-confidentialite' }}
  />
);

export default LegalNotice;
