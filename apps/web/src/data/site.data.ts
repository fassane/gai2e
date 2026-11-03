import { brand } from '@gai2e/shared-types';

// Coordonnées et liens du site. Les coordonnées viennent de libs/shared-types (brand),
// partagées avec les emails.
// TODO : remplacer les liens des réseaux sociaux avant la mise en ligne.
export const siteData = {
  name: brand.name,
  tagline:
    "Votre partenaire pour étudier à l'étranger : France, Canada, Japon, Royaume-Uni, Chine et bientôt d'autres destinations.",
  preRegistrationPath: '/pre-inscription',
  // Photo du hero : à déposer dans apps/web/public (un visuel de repli s'affiche tant qu'elle manque)
  heroImage: '/images/hero-etudiants.jpg',
  contact: {
    email: brand.email,
    whatsappDisplay: brand.whatsappDisplay,
    whatsappUrl: brand.whatsappUrl,
    address: brand.address,
  },
  socials: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    tiktok: '#',
  },
};

// Liens du header. Les sections de la page d'accueil sont des ancres.
export const navItems = [
  { id: 'services', title: 'Services', to: '/#services' },
  // { id: 'process', title: 'Comment ça marche', to: '/#comment-ca-marche' },
  { id: 'destinations', title: 'Destinations', to: '/#destinations' },
  // { id: 'testimonials', title: 'Témoignages', to: '/#temoignages' },
  { id: 'faq', title: 'FAQ', to: '/#faq' },
];
