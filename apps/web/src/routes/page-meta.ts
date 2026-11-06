// Référencement par page. index.html porte les valeurs de la landing. Seules la landing, la FAQ et les tarifs sont indexés ;
// le reste du site (connexion, back-office, 404, recette) est exclu des moteurs.

export const SITE_URL = 'https://gai2e.com';
const SITE_NAME = 'GAI2E Conseils';
const HOME_TITLE = `${SITE_NAME} | Accompagnement pour étudier à l'étranger`;
const HOME_DESCRIPTION =
  "Étudiez à l'étranger avec un conseiller dédié : orientation, candidatures, visa, logement et arrivée. GAI2E Conseils vous accompagne, où que vous viviez.";
const FAQS_DESCRIPTION =
  "Destinations, démarches, documents, accompagnement : les réponses aux questions fréquentes sur les études à l'étranger avec GAI2E Conseils.";

const PRICING_DESCRIPTION =
  "Tarifs de l'accompagnement pour étudier à l'étranger : un paiement en 3 étapes, selon l'évolution de votre dossier, par Mobile Money ou carte bancaire.";

export type PageMeta = {
  title: string;
  description: string;
  noindex: boolean;
  // URL officielle de la page, absente si elle n'est pas indexée
  canonical: string | null;
};

// Pages non indexées : les pages légales n'ont pas besoin d'apparaître dans les résultats
const privatePages: Record<string, string> = {
  '/mentions-legales': 'Mentions légales',
  '/politique-de-confidentialite': 'Politique de confidentialité',
  '/login': 'Connexion',
  '/forgot-password': 'Mot de passe oublié',
  '/reset-password': 'Nouveau mot de passe',
};

export function pageMetaOf(pathname: string, hostname: string): PageMeta {
  // Recette, développement : jamais indexés
  const isProduction = hostname === 'gai2e.com' || hostname === 'www.gai2e.com';
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      noindex: !isProduction,
      canonical: isProduction ? `${SITE_URL}/` : null,
    };
  }
  if (path === '/tarifs') {
    return {
      title: `Tarifs | ${SITE_NAME}`,
      description: PRICING_DESCRIPTION,
      noindex: !isProduction,
      canonical: isProduction ? `${SITE_URL}/tarifs` : null,
    };
  }
  if (path === '/faqs') {
    return {
      title: `Foire aux questions | ${SITE_NAME}`,
      description: FAQS_DESCRIPTION,
      noindex: !isProduction,
      canonical: isProduction ? `${SITE_URL}/faqs` : null,
    };
  }
  const label = path.startsWith('/admin') ? 'Back-office' : (privatePages[path] ?? 'Page introuvable');
  return { title: `${label} | ${SITE_NAME}`, description: HOME_DESCRIPTION, noindex: true, canonical: null };
}

// Applique les balises de la page sur le <head> existant (celles écrites dans index.html)
export function applyPageMeta({ title, description, noindex, canonical }: PageMeta) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document
    .querySelector('meta[name="robots"]')
    ?.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = canonical;
}
