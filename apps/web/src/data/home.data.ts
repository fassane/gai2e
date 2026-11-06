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

// L'accompagnement proposé
export const studentService = {
  title: "Études à l'étranger",
  description:
    "De l'orientation au choix de l'université jusqu'à la lettre d'admission et au visa : une équipe suit votre dossier du début à la fin.",
  items: [
    'Orientation et choix de la filière',
    'Constitution et suivi du dossier',
    'Candidatures et admission',
    'Dossier de visa',
  ],
};

// Tarifs des études à l'étranger. Montants en unités mineures : le franc CFA n'a pas de centimes, l'euro si.
export const pricingSteps = [
  {
    id: 'orientation',
    title: "Proposition d'universités",
    amountXof: 49_000,
    amountEurCents: 7_500,
    description:
      "Cela vous donne droit à un fichier complet résumant la proposition d'universités correspondant à votre profil académique et votre budget, avec la description des procédures d'admission et de visa et d'autres informations pratiques qui vous permettront de déposer votre demande d'admission sans assistance si vous le souhaitez.",
  },
  {
    id: 'admission',
    title: "Demande d'admission",
    amountXof: 86_000,
    amountEurCents: 13_200,
    description:
      "Après avoir effectué ce paiement, nous établissons un programme de travail pour vous assister dans la procédure de la demande d'admission, en fonction de votre disponibilité.",
  },
  {
    id: 'visa',
    title: 'Demande de visa',
    amountXof: 140_000,
    amountEurCents: 21_400,
    description:
      "Après avoir effectué ce paiement, la procédure de la demande de visa commence. Nous vous assistons dans la préparation, le remplissage des formulaires, la vérification de vos documents financiers et la préparation de l'entretien s'il y a lieu.",
  },
];

// Moyens de paiement acceptés
export const paymentMethods = [
  { id: 'mobile-money', title: 'Mobile Money', options: ['Orange Money', 'Moov', 'Telecel Money', 'Wave'] },
  { id: 'card', title: 'Carte bancaire', options: [] as string[] },
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
    description:
      'Nous vous assistons dans la vérification de vos documents nécessaires, le remplissage des formulaires et le téléchargement des documents sur les plateformes, puis suivons chaque réponse jusqu’à la fin de la procédure.',
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

// Questions de la page Tarifs. S'en tenir à ce que le client a confirmé (pas de promesse sur le remboursement
// ni sur les frais d'inscription et de visa tant qu'ils ne sont pas précisés).
export const pricingFaq = [
  {
    question: 'À quel moment dois-je payer ?',
    answer:
      "Le paiement intervient après l'évaluation de votre profil par un conseiller. Il se fait ensuite en 3 étapes, au fur et à mesure de l'évolution de votre dossier.",
  },
  {
    question: 'Dois-je payer les 3 étapes ?',
    answer:
      "Pas forcément. L'étape 1 vous donne un fichier complet qui vous permet de déposer votre demande d'admission sans assistance si vous le souhaitez. Les étapes 2 et 3 correspondent à notre accompagnement pour la demande d'admission, puis pour la demande de visa.",
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Le Mobile Money (Orange Money, Moov, Telecel Money, Wave) et la carte bancaire.',
  },
  {
    question: "Que comprend l'accompagnement pour le visa ?",
    answer:
      "Nous vous assistons dans la préparation, le remplissage des formulaires, la vérification de vos documents financiers et la préparation de l'entretien s'il y a lieu.",
  },
];
