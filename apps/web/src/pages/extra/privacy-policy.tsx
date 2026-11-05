import { LegalPage } from './legal-page';

const PrivacyPolicy = () => (
  <LegalPage pageId="politique-de-confidentialite" related={{ label: 'Mentions légales', to: '/mentions-legales' }} />
);

export default PrivacyPolicy;
