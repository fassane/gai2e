import { brandOf, defaultSiteConfig } from './site-config';

// Coordonnées par défaut de GAI2E Conseils (avant tout réglage enregistré dans le back-office).
// Les valeurs réelles viennent des réglages du site : GET /api/site-config.
export const brand = brandOf(defaultSiteConfig);
