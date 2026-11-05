import { brand } from '@gai2e/shared-types';

// Données fixes du site. Les coordonnées, la présentation et les réseaux sociaux sont des réglages
// modifiables dans le back-office (Configuration) : hook useSiteConfig.
export const siteData = {
  name: brand.name,
  // Carte « Votre dossier » du hero, en attendant une page de pré-inscription (header, footer)
  preRegistrationPath: '/#evaluation',
  // Photo de la bannière sous le hero (une version .webp du même nom est servie en priorité)
  heroImage: '/images/hero-etudiants.jpg',
};

// Liens du header. Les sections de la page d'accueil sont des ancres.
export const navItems = [
  { id: 'services', title: 'Services', to: '/#services' },
  // { id: 'process', title: 'Comment ça marche', to: '/#comment-ca-marche' },
  { id: 'destinations', title: 'Destinations', to: '/#destinations' },
  // { id: 'testimonials', title: 'Témoignages', to: '/#temoignages' },
  { id: 'faq', title: 'FAQ', to: '/faqs' },
];
