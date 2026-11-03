// Contenu de la page d'accueil (vitrine). La liste des pays d'accueil est commerciale : seuls les pays
// configurés en base (libs/db/prisma/seed.ts) ont aujourd'hui une procédure suivie étape par étape.

export type Continent = 'Amérique du Nord' | 'Europe' | 'Afrique' | 'Asie' | 'Océanie';

export interface StudyDestination {
  countryCode: string;
  name: string;
  continent: Continent;
}

// Pays d'accueil proposés sur la landing (« jusqu'à 3 vœux »)
export const studyDestinations: StudyDestination[] = [
  { countryCode: 'CA', name: 'Canada', continent: 'Amérique du Nord' },
  { countryCode: 'US', name: 'USA', continent: 'Amérique du Nord' },
  { countryCode: 'FR', name: 'France', continent: 'Europe' },
  { countryCode: 'BE', name: 'Belgique', continent: 'Europe' },
  { countryCode: 'GB', name: 'Royaume-Uni', continent: 'Europe' },
  { countryCode: 'DE', name: 'Allemagne', continent: 'Europe' },
  { countryCode: 'ES', name: 'Espagne', continent: 'Europe' },
  { countryCode: 'IT', name: 'Italie', continent: 'Europe' },
  { countryCode: 'NO', name: 'Norvège', continent: 'Europe' },
  { countryCode: 'TR', name: 'Turquie', continent: 'Europe' },
  { countryCode: 'TN', name: 'Tunisie', continent: 'Afrique' },
  { countryCode: 'CN', name: 'Chine', continent: 'Asie' },
  { countryCode: 'IN', name: 'Inde', continent: 'Asie' },
  { countryCode: 'JP', name: 'Japon', continent: 'Asie' },
  { countryCode: 'KR', name: 'Corée du Sud', continent: 'Asie' },
  { countryCode: 'AU', name: 'Australie', continent: 'Océanie' },
];

// Nombre de vœux de destination par demande d'évaluation
export const MAX_DESTINATIONS = 3;

// Ordre d'affichage des continents
export const continentOrder: Continent[] = ['Amérique du Nord', 'Europe', 'Afrique', 'Asie', 'Océanie'];

// Pays d'origine des étudiants accompagnés (bandeau défilant et choix « Je viens de »)
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

// Choix « Je viens de » : les pays ci-dessus, et tout autre pays (accompagnement ouvert à toutes les nationalités)
export const OTHER_ORIGIN = 'OTHER';
export const originOptions = [...originCountries, { countryCode: OTHER_ORIGIN, name: 'Autre pays' }];

// Chiffres sous le titre du hero, calculés depuis les listes ci-dessus
export const heroStats = [
  { id: 'countries', value: `${studyDestinations.length}`, label: "pays d'accueil" },
  { id: 'continents', value: `${new Set(studyDestinations.map((d) => d.continent)).size}`, label: 'continents' },
  { id: 'advisor', value: '1', label: 'conseiller dédié' },
];

// Les deux offres d'accompagnement
export const services = [
  {
    id: 'studies',
    title: "Études à l'étranger",
    description:
      "De l'orientation au choix de l'université jusqu'à la lettre d'admission et au visa : une équipe suit votre dossier du début à la fin.",
    items: [
      'Orientation et choix de la filière',
      'Constitution et suivi du dossier',
      'Candidatures et admission',
      'Dossier de visa',
    ],
    tone: 'primary' as const,
  },
  {
    id: 'workers',
    title: 'Immigration de travailleurs',
    description:
      "Un projet professionnel à l'étranger ? Nous préparons votre dossier, principalement vers le Canada et l'Australie.",
    items: [
      'Étude de votre profil',
      'Programme adapté à votre métier',
      'Constitution du dossier',
      "Suivi jusqu'à la décision",
    ],
    tone: 'peach' as const,
  },
];

export const processSteps = [
  {
    id: 'pre-registration',
    title: 'Pré-inscription',
    description: 'Vous remplissez le formulaire de contact, un conseiller vous rappelle et précise votre besoin.',
  },
  {
    id: 'evaluation',
    title: 'Évaluation du profil',
    description:
      'Diplômes, niveau de langue, budget et objectifs : nous définissons ensemble les destinations réalistes.',
  },
  {
    id: 'admission',
    title: 'Dossier et admission',
    description: 'Nous réunissons les pièces, rédigeons et déposons vos candidatures, puis suivons chaque réponse.',
  },
  {
    id: 'settling',
    title: 'Visa et installation',
    description: 'Préparation du dossier de visa, entretien, logement et préparation de votre arrivée sur place.',
  },
];

// TODO : faire valider les réponses par l'équipe.
export const faq = [
  {
    question: 'Quelles destinations proposez-vous ?',
    answer:
      "Une quinzaine de pays sur cinq continents : Canada, France, Belgique, Royaume-Uni, Allemagne, Chine, Japon, Australie… Vous pouvez formuler jusqu'à trois vœux.",
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
