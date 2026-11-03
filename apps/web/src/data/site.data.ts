// Coordonnées et liens du site.
// TODO : remplacer les valeurs provisoires (email, WhatsApp, réseaux) avant la mise en ligne.
const whatsappNumber = '22600000000';

export const siteData = {
  name: 'GAI2E Conseils',
  tagline:
    "Votre partenaire pour étudier à l'étranger : France, Canada, Japon, Royaume-Uni, Chine et bientôt d'autres destinations.",
  preRegistrationPath: '/pre-inscription',
  // Photo du hero : à déposer dans apps/web/public (un visuel de repli s'affiche tant qu'elle manque)
  heroImage: '/images/hero-etudiants.jpg',
  contact: {
    email: 'contact@domaine-a-definir.com',
    whatsappDisplay: '+226 00 00 00 00',
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    address: 'Ouagadougou, Burkina Faso',
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
  { id: 'process', title: 'Comment ça marche', to: '/#comment-ca-marche' },
  { id: 'destinations', title: 'Destinations', to: '/#destinations' },
  { id: 'testimonials', title: 'Témoignages', to: '/#temoignages' },
  { id: 'faq', title: 'FAQ', to: '/#faq' },
];
