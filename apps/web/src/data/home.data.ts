// Contenu de la page d'accueil.
// Les destinations reprennent la configuration du seed (libs/db/prisma/seed.ts) ;
// elles viendront de l'API quand l'endpoint public des destinations existera.

export type Continent = 'Amérique du Nord' | 'Europe' | 'Afrique' | 'Asie' | 'Océanie';

export interface DestinationCard {
  countryCode: string;
  continent: Continent;
  slug: string;
  name: string;
  // Démarches clés, pour montrer qu'on connaît la procédure du pays
  procedure: string;
}

export const destinations: DestinationCard[] = [
  { countryCode: 'FR', continent: 'Europe', slug: 'france', name: 'France', procedure: 'Campus France · Visa VLS-TS' },
  { countryCode: 'CA', continent: 'Amérique du Nord', slug: 'canada', name: 'Canada', procedure: "CAQ · Permis d'études" },
  { countryCode: 'JP', continent: 'Asie', slug: 'japon', name: 'Japon', procedure: 'COE · Bourse MEXT' },
  { countryCode: 'GB', continent: 'Europe', slug: 'royaume-uni', name: 'Royaume-Uni', procedure: 'UCAS · CAS · Student visa' },
  { countryCode: 'CN', continent: 'Asie', slug: 'chine', name: 'Chine', procedure: 'JW202 · Visa X1 · Bourse CSC' },
];

// Pays d'origine des étudiants accompagnés (bandeau sous le hero)
export const originCountries = [
  { countryCode: 'BF', name: 'Burkina Faso' },
  { countryCode: 'SN', name: 'Sénégal' },
  { countryCode: 'CI', name: "Côte d'Ivoire" },
  { countryCode: 'ML', name: 'Mali' },
  { countryCode: 'CM', name: 'Cameroun' },
  { countryCode: 'BJ', name: 'Bénin' },
  { countryCode: 'TG', name: 'Togo' },
  { countryCode: 'NE', name: 'Niger' },
  { countryCode: 'GN', name: 'Guinée' },
  { countryCode: 'TD', name: 'Tchad' },
  { countryCode: 'GA', name: 'Gabon' },
  { countryCode: 'CG', name: 'Congo' },
  { countryCode: 'CD', name: 'RD Congo' },
  { countryCode: 'NG', name: 'Nigeria' },
  { countryCode: 'GH', name: 'Ghana' },
];

// Ordre d'affichage des continents (seuls ceux qui ont une destination apparaissent)
export const continentOrder: Continent[] = ['Amérique du Nord', 'Europe', 'Afrique', 'Asie', 'Océanie'];

// Engagements du service, affichés sous le hero (pas de statistiques tant qu'on n'a pas de chiffres réels)
export const highlights = [
  { id: 'destinations', value: `${destinations.length}`, label: 'destinations' },
  { id: 'response', value: '24 h', label: 'pour être recontacté' },
  { id: 'advisor', value: '1', label: 'conseiller dédié' },
];

// Ce que fait l'accompagnement, de bout en bout
export const services = [
  {
    id: 'admission',
    title: 'Orientation & admission',
    description:
      'Choix du pays, de l’établissement et de la formation, puis candidatures (Études en France, UCAS…) jusqu’à la lettre d’admission.',
  },
  {
    id: 'visa',
    title: 'Finances & visa',
    description:
      'Preuve de fonds, pièces vérifiées par votre conseiller et demande de visa déposée dans les délais.',
  },
  {
    id: 'arrival',
    title: 'Logement & arrivée',
    description: 'Logement, billet, démarches sur place : nous restons à vos côtés jusqu’à votre installation.',
  },
];

export const processSteps = [
  {
    id: 'pre-registration',
    title: 'Pré-inscription',
    description: 'Remplissez le formulaire en ligne : un conseiller vous contacte sous 24 h.',
  },
  {
    id: 'evaluation',
    title: 'Évaluation',
    description: 'Nous analysons votre profil, votre budget et vos objectifs pour choisir les bonnes formations.',
  },
  {
    id: 'admission',
    title: 'Admission',
    description: 'Nous préparons et suivons vos candidatures jusqu’à la lettre d’admission.',
  },
  {
    id: 'visa',
    title: 'Visa & départ',
    description: 'Preuve de fonds, demande de visa, logement, billet : on vous accompagne jusqu’à l’arrivée.',
  },
];

// TODO : exemples fictifs pour la maquette. À remplacer par de vrais témoignages
// (avec l'accord écrit des étudiants) avant la mise en ligne.
export const testimonials = [
  {
    id: 't1',
    name: 'Prénom N.',
    origin: 'Burkina Faso',
    destinationCode: 'FR',
    program: 'Master en informatique',
    quote:
      "Je ne savais pas par où commencer avec Campus France. Mon conseiller m'a guidé à chaque étape, de l'entretien jusqu'au visa.",
  },
  {
    id: 't2',
    name: 'Prénom N.',
    origin: 'Sénégal',
    destinationCode: 'CA',
    program: 'DEC en techniques informatiques',
    quote:
      "Le CAQ puis le permis d'études : deux procédures que je n'aurais jamais réussi seule. Tout était suivi dans mon espace en ligne.",
  },
  {
    id: 't3',
    name: 'Prénom N.',
    origin: "Côte d'Ivoire",
    destinationCode: 'JP',
    program: 'École de langue japonaise',
    quote: "L'équipe m'a aidé à préparer le dossier du COE et à trouver un logement avant mon arrivée à Tokyo.",
  },
  {
    id: 't4',
    name: 'Prénom N.',
    origin: 'Cameroun',
    destinationCode: 'GB',
    program: 'MSc in Data Science',
    quote: 'Des rappels clairs pour chaque échéance : je n’ai raté aucune date, du test IELTS jusqu’au CAS.',
  },
  {
    id: 't5',
    name: 'Prénom N.',
    origin: 'Mali',
    destinationCode: 'CN',
    program: 'Licence en commerce international',
    quote: 'Mon conseiller m’a orienté vers une bourse et a vérifié chaque pièce avant l’envoi à l’université.',
  },
];

// TODO : faire valider les réponses par l'équipe.
export const faq = [
  {
    question: 'Quelles destinations proposez-vous ?',
    answer:
      'La France, le Canada, le Japon, le Royaume-Uni et la Chine. Nous ajoutons de nouvelles destinations au fil des demandes.',
  },
  {
    question: 'Depuis quels pays puis-je m’inscrire ?',
    answer:
      "Depuis tous les pays d'Afrique subsaharienne. Toutes les démarches se font en ligne et les échanges par visio, téléphone ou WhatsApp.",
  },
  {
    question: 'Quand dois-je commencer mes démarches ?',
    answer:
      'Idéalement 10 à 12 mois avant la rentrée visée : certaines procédures (Campus France, CAQ, COE) prennent plusieurs mois.',
  },
  {
    question: 'Quels documents dois-je préparer ?',
    answer:
      'Un passeport valide, vos diplômes et relevés de notes, un test de langue selon le pays et un justificatif de ressources. Votre conseiller vous donne la liste exacte pour votre destination.',
  },
  {
    question: 'Comment suis-je accompagné ?',
    answer:
      'Un conseiller dédié suit votre dossier. Vous retrouvez vos étapes, vos documents et vos échanges dans votre espace en ligne, avec des rappels avant chaque échéance.',
  },
  {
    question: 'GAI2E Conseils garantit-il l’obtention du visa ?',
    answer:
      'Non : la décision appartient aux établissements et aux autorités consulaires. Notre rôle est de vous aider à présenter un dossier complet et solide, dans les délais.',
  },
];
