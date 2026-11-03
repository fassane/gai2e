import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, StepCategory } from '../src/generated/prisma/client';

// Configuration de référence : types de pièces, destinations et étapes de leurs procédures.
// Idempotent : peut être relancé sans risque (upsert sur les codes).
// Les procédures évoluent (consulats, plateformes) : à faire relire par les conseillers
// avant chaque rentrée. Ce n'est qu'un point de départ, modifiable ensuite dans le back-office.

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

const documentTypes = [
  { code: 'PASSPORT', label: 'Passeport', hasExpiry: true },
  { code: 'BIRTH_CERTIFICATE', label: 'Acte de naissance' },
  { code: 'ID_PHOTO', label: "Photo d'identité" },
  { code: 'HIGH_SCHOOL_DIPLOMA', label: 'Diplôme du baccalauréat' },
  { code: 'DIPLOMA', label: "Diplômes de l'enseignement supérieur" },
  { code: 'TRANSCRIPT', label: 'Relevés de notes' },
  { code: 'CV', label: 'CV' },
  { code: 'MOTIVATION_LETTER', label: 'Lettre de motivation' },
  { code: 'RECOMMENDATION_LETTER', label: 'Lettre de recommandation' },
  { code: 'LANGUAGE_CERTIFICATE', label: 'Attestation de test de langue', hasExpiry: true },
  { code: 'ADMISSION_LETTER', label: "Lettre d'admission" },
  { code: 'FINANCIAL_PROOF', label: 'Justificatif de ressources' },
  { code: 'SPONSOR_LETTER', label: 'Attestation de prise en charge du garant' },
  { code: 'SCHOLARSHIP_LETTER', label: "Attestation de bourse" },
  { code: 'HOUSING_PROOF', label: "Justificatif d'hébergement" },
  { code: 'MEDICAL_CERTIFICATE', label: 'Certificat ou examen médical' },
  { code: 'CRIMINAL_RECORD', label: 'Extrait de casier judiciaire', hasExpiry: true },
  { code: 'TRAVEL_INSURANCE', label: 'Assurance voyage / santé', hasExpiry: true },
  { code: 'VISA', label: 'Visa ou permis d’études', hasExpiry: true },
].map((type, index) => ({ hasExpiry: false, ...type, displayOrder: index }));

interface StepConfig {
  code: string;
  title: string;
  description: string;
  category: StepCategory;
  defaultDueDaysBeforeIntake?: number;
  isOptional?: boolean;
  externalUrl?: string;
  documents?: string[];
}

interface DestinationConfig {
  countryCode: string;
  slug: string;
  name: string;
  currency: string;
  summary: string;
  steps: StepConfig[];
}

const { ORIENTATION, LANGUAGE, ADMISSION, FINANCES, VISA, HOUSING, TRAVEL, ARRIVAL } = StepCategory;

const commonStart: StepConfig[] = [
  {
    code: 'projet-etudes',
    title: "Définir le projet d'études",
    description: 'Entretien avec le conseiller : niveau, filières, budget, villes et établissements visés.',
    category: ORIENTATION,
    defaultDueDaysBeforeIntake: 330,
  },
  {
    code: 'passeport',
    title: 'Passeport valide',
    description:
      'Vérifier que le passeport couvre toute la durée du séjour (sinon lancer le renouvellement tout de suite).',
    category: ORIENTATION,
    defaultDueDaysBeforeIntake: 300,
    documents: ['PASSPORT'],
  },
];

const commonEnd: StepConfig[] = [
  {
    code: 'logement',
    title: 'Trouver un logement',
    description: 'Résidence universitaire, logement privé ou hébergement chez un proche.',
    category: HOUSING,
    defaultDueDaysBeforeIntake: 45,
    documents: ['HOUSING_PROOF'],
  },
  {
    code: 'voyage',
    title: 'Préparer le voyage',
    description: "Billet d'avion, assurance, copies des documents, budget des premières semaines.",
    category: TRAVEL,
    defaultDueDaysBeforeIntake: 20,
    documents: ['TRAVEL_INSURANCE'],
  },
];

const destinations: DestinationConfig[] = [
  {
    countryCode: 'FR',
    slug: 'france',
    name: 'France',
    currency: 'EUR',
    summary:
      'Première destination des étudiants d’Afrique francophone, avec des frais de scolarité publics modérés.',
    steps: [
      ...commonStart,
      {
        code: 'test-langue',
        title: 'Test de français (TCF / DELF)',
        description: 'Exigé pour certaines formations et pour les candidats non francophones.',
        category: LANGUAGE,
        defaultDueDaysBeforeIntake: 290,
        isOptional: true,
        documents: ['LANGUAGE_CERTIFICATE'],
      },
      {
        code: 'etudes-en-france',
        title: 'Dossier « Études en France »',
        description:
          'Création du compte, saisie du parcours, dépôt des pièces et paiement des frais Campus France.',
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 270,
        externalUrl: 'https://pastel.diplomatie.gouv.fr/etudesenfrance/',
        documents: ['HIGH_SCHOOL_DIPLOMA', 'TRANSCRIPT', 'CV', 'MOTIVATION_LETTER', 'ID_PHOTO'],
      },
      {
        code: 'entretien-campus-france',
        title: 'Entretien Campus France',
        description: "Entretien pédagogique avec l'Espace Campus France du pays de résidence.",
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 210,
      },
      {
        code: 'reponses-etablissements',
        title: 'Réponses des établissements et choix définitif',
        description: "Suivre les réponses, accepter l'offre retenue sur la plateforme.",
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 120,
        documents: ['ADMISSION_LETTER'],
      },
      {
        code: 'ressources',
        title: 'Justificatif de ressources',
        description:
          'Attestation bancaire, bourse ou prise en charge par un garant, selon le montant mensuel exigé par le consulat.',
        category: FINANCES,
        defaultDueDaysBeforeIntake: 100,
        documents: ['FINANCIAL_PROOF', 'SPONSOR_LETTER', 'SCHOLARSHIP_LETTER'],
      },
      {
        code: 'visa-vls-ts',
        title: 'Demande de visa étudiant (VLS-TS)',
        description: 'Demande sur France-Visas puis rendez-vous au centre de dépôt (biométrie).',
        category: VISA,
        defaultDueDaysBeforeIntake: 80,
        externalUrl: 'https://france-visas.gouv.fr',
        documents: ['PASSPORT', 'ADMISSION_LETTER', 'FINANCIAL_PROOF', 'HOUSING_PROOF', 'ID_PHOTO'],
      },
      ...commonEnd,
      {
        code: 'validation-vls-ts',
        title: 'Valider le VLS-TS en ligne',
        description: "Dans les 3 mois suivant l'arrivée, sur le site de l'administration française.",
        category: ARRIVAL,
        defaultDueDaysBeforeIntake: -60,
      },
    ],
  },
  {
    countryCode: 'CA',
    slug: 'canada',
    name: 'Canada',
    currency: 'CAD',
    summary: 'Études en français (Québec) ou en anglais, avec des possibilités de travail pendant et après les études.',
    steps: [
      ...commonStart,
      {
        code: 'test-langue',
        title: 'Test de langue (TCF / TEF / IELTS)',
        description: "Selon la langue d'enseignement et les exigences de l'établissement.",
        category: LANGUAGE,
        defaultDueDaysBeforeIntake: 300,
        isOptional: true,
        documents: ['LANGUAGE_CERTIFICATE'],
      },
      {
        code: 'candidatures',
        title: 'Candidatures auprès des établissements (EED)',
        description: "Candidater dans des établissements d'enseignement désignés.",
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 270,
        documents: ['HIGH_SCHOOL_DIPLOMA', 'TRANSCRIPT', 'CV', 'MOTIVATION_LETTER'],
      },
      {
        code: 'lettre-acceptation',
        title: "Lettre d'acceptation",
        description: "Accepter l'offre et payer le dépôt éventuel demandé par l'établissement.",
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 180,
        documents: ['ADMISSION_LETTER'],
      },
      {
        code: 'caq',
        title: "Certificat d'acceptation du Québec (CAQ)",
        description: 'Obligatoire pour étudier au Québec, à obtenir avant le permis d’études.',
        category: VISA,
        defaultDueDaysBeforeIntake: 160,
        isOptional: true,
      },
      {
        code: 'lettre-attestation-provinciale',
        title: "Lettre d'attestation provinciale (LAP)",
        description: "Hors Québec : délivrée par la province, généralement via l'établissement.",
        category: VISA,
        defaultDueDaysBeforeIntake: 160,
        isOptional: true,
      },
      {
        code: 'preuve-fonds',
        title: 'Preuve de fonds',
        description: 'Frais de scolarité de la première année et frais de subsistance au montant exigé par IRCC.',
        category: FINANCES,
        defaultDueDaysBeforeIntake: 140,
        documents: ['FINANCIAL_PROOF', 'SPONSOR_LETTER', 'SCHOLARSHIP_LETTER'],
      },
      {
        code: 'permis-etudes',
        title: "Demande de permis d'études (IRCC)",
        description: 'Demande en ligne, puis biométrie et examen médical si demandés.',
        category: VISA,
        defaultDueDaysBeforeIntake: 120,
        externalUrl: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada.html',
        documents: ['PASSPORT', 'ADMISSION_LETTER', 'FINANCIAL_PROOF', 'MEDICAL_CERTIFICATE'],
      },
      ...commonEnd,
    ],
  },
  {
    countryCode: 'JP',
    slug: 'japon',
    name: 'Japon',
    currency: 'JPY',
    summary: 'Universités de haut niveau, écoles de langue et bourses du gouvernement japonais (MEXT).',
    steps: [
      ...commonStart,
      {
        code: 'bourse-mext',
        title: 'Bourse MEXT',
        description: "Candidature via l'ambassade du Japon, au calendrier de la bourse.",
        category: FINANCES,
        defaultDueDaysBeforeIntake: 360,
        isOptional: true,
      },
      {
        code: 'test-langue',
        title: 'Test de langue (JLPT / EJU / IELTS)',
        description: "JLPT ou EJU pour les cursus en japonais, IELTS / TOEFL pour les programmes en anglais.",
        category: LANGUAGE,
        defaultDueDaysBeforeIntake: 300,
        documents: ['LANGUAGE_CERTIFICATE'],
      },
      {
        code: 'candidatures',
        title: 'Candidatures (université ou école de langue)',
        description: 'Dossier transmis directement à l’établissement.',
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 240,
        documents: ['HIGH_SCHOOL_DIPLOMA', 'TRANSCRIPT', 'MOTIVATION_LETTER', 'FINANCIAL_PROOF'],
      },
      {
        code: 'coe',
        title: "Certificate of Eligibility (COE)",
        description: "Demandé par l'établissement auprès de l'immigration japonaise après l'admission.",
        category: VISA,
        defaultDueDaysBeforeIntake: 120,
        documents: ['ADMISSION_LETTER'],
      },
      {
        code: 'visa',
        title: 'Visa étudiant',
        description: "Demande à l'ambassade du Japon avec le COE.",
        category: VISA,
        defaultDueDaysBeforeIntake: 60,
        documents: ['PASSPORT', 'ID_PHOTO'],
      },
      ...commonEnd,
      {
        code: 'carte-residence',
        title: 'Carte de résident et inscription à la mairie',
        description: "Carte remise à l'aéroport, adresse à déclarer à la mairie après l'installation.",
        category: ARRIVAL,
        defaultDueDaysBeforeIntake: -14,
      },
    ],
  },
  {
    countryCode: 'GB',
    slug: 'royaume-uni',
    name: 'Royaume-Uni',
    currency: 'GBP',
    summary: 'Formations en anglais reconnues dans le monde entier, Masters en un an.',
    steps: [
      ...commonStart,
      {
        code: 'test-langue',
        title: "Test d'anglais (IELTS for UKVI…)",
        description: "Selon les exigences de l'université et du visa.",
        category: LANGUAGE,
        defaultDueDaysBeforeIntake: 300,
        documents: ['LANGUAGE_CERTIFICATE'],
      },
      {
        code: 'candidatures',
        title: 'Candidatures (UCAS ou directes)',
        description: 'UCAS pour le premier cycle, candidature directe auprès des universités pour les Masters.',
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 270,
        documents: ['TRANSCRIPT', 'DIPLOMA', 'MOTIVATION_LETTER', 'RECOMMENDATION_LETTER', 'CV'],
      },
      {
        code: 'offre',
        title: 'Offre et levée des conditions',
        description: 'Transformer une offre conditionnelle en offre définitive (unconditional).',
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 150,
        documents: ['ADMISSION_LETTER'],
      },
      {
        code: 'test-tuberculose',
        title: 'Test de dépistage de la tuberculose',
        description: 'Exigé pour les résidents de nombreux pays, dans un centre agréé.',
        category: VISA,
        defaultDueDaysBeforeIntake: 110,
        isOptional: true,
        documents: ['MEDICAL_CERTIFICATE'],
      },
      {
        code: 'cas',
        title: 'CAS (Confirmation of Acceptance for Studies)',
        description: "Délivré par l'université une fois l'offre définitive et le dépôt éventuel payé.",
        category: VISA,
        defaultDueDaysBeforeIntake: 100,
      },
      {
        code: 'preuve-fonds',
        title: 'Preuve de fonds',
        description: 'Fonds détenus sur la durée exigée par le Home Office avant la demande de visa.',
        category: FINANCES,
        defaultDueDaysBeforeIntake: 100,
        documents: ['FINANCIAL_PROOF', 'SPONSOR_LETTER', 'SCHOLARSHIP_LETTER'],
      },
      {
        code: 'student-visa',
        title: 'Student visa (et IHS)',
        description: "Demande en ligne, surcharge santé (IHS), puis biométrie au centre de dépôt.",
        category: VISA,
        defaultDueDaysBeforeIntake: 80,
        externalUrl: 'https://www.gov.uk/student-visa',
        documents: ['PASSPORT', 'FINANCIAL_PROOF'],
      },
      ...commonEnd,
    ],
  },
  {
    countryCode: 'CN',
    slug: 'chine',
    name: 'Chine',
    currency: 'CNY',
    summary: 'Coûts accessibles, nombreuses bourses (CSC, universités) et programmes en anglais ou en chinois.',
    steps: [
      ...commonStart,
      {
        code: 'bourse-csc',
        title: 'Bourse du gouvernement chinois (CSC)',
        description: "Candidature via l'ambassade de Chine ou directement auprès des universités.",
        category: FINANCES,
        defaultDueDaysBeforeIntake: 300,
        isOptional: true,
      },
      {
        code: 'test-langue',
        title: 'Test de langue (HSK / IELTS)',
        description: 'HSK pour les cursus en chinois, IELTS ou TOEFL pour les programmes en anglais.',
        category: LANGUAGE,
        defaultDueDaysBeforeIntake: 280,
        isOptional: true,
        documents: ['LANGUAGE_CERTIFICATE'],
      },
      {
        code: 'candidatures',
        title: 'Candidatures auprès des universités',
        description: 'Dossier en ligne sur le portail de chaque université.',
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 240,
        documents: [
          'HIGH_SCHOOL_DIPLOMA',
          'TRANSCRIPT',
          'MOTIVATION_LETTER',
          'RECOMMENDATION_LETTER',
          'CRIMINAL_RECORD',
          'MEDICAL_CERTIFICATE',
        ],
      },
      {
        code: 'jw202',
        title: "Lettre d'admission et formulaire JW201 / JW202",
        description: "Envoyés par l'université après l'admission.",
        category: ADMISSION,
        defaultDueDaysBeforeIntake: 90,
        documents: ['ADMISSION_LETTER'],
      },
      {
        code: 'visa-x1',
        title: 'Visa étudiant X1',
        description: "Demande à l'ambassade ou au centre de visas avec la lettre d'admission et le JW202.",
        category: VISA,
        defaultDueDaysBeforeIntake: 60,
        documents: ['PASSPORT', 'ID_PHOTO', 'MEDICAL_CERTIFICATE'],
      },
      ...commonEnd,
      {
        code: 'permis-residence',
        title: 'Permis de résidence',
        description: "À demander dans les 30 jours suivant l'arrivée avec le visa X1.",
        category: ARRIVAL,
        defaultDueDaysBeforeIntake: -30,
      },
    ],
  },
];

async function seed() {
  for (const type of documentTypes) {
    await prisma.documentType.upsert({ where: { code: type.code }, create: type, update: type });
  }
  console.log(`${documentTypes.length} types de pièces à jour`);

  for (const [index, { steps, ...destination }] of destinations.entries()) {
    const data = { ...destination, displayOrder: index };
    const { id: destinationId } = await prisma.destination.upsert({
      where: { countryCode: destination.countryCode },
      create: data,
      update: data,
    });

    for (const [position, { documents = [], ...step }] of steps.entries()) {
      const requiredDocumentTypes = documents.map((code) => ({ code }));
      const stepData = { ...step, position, isOptional: step.isOptional ?? false };
      await prisma.procedureStepTemplate.upsert({
        where: { destinationId_code: { destinationId, code: step.code } },
        create: { ...stepData, destinationId, requiredDocumentTypes: { connect: requiredDocumentTypes } },
        update: { ...stepData, requiredDocumentTypes: { set: requiredDocumentTypes } },
      });
    }
    console.log(`${destination.name} : ${steps.length} étapes à jour`);
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
