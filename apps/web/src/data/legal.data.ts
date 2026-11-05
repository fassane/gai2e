// Texte par défaut des pages légales, tant qu'elles n'ont pas été modifiées dans le back-office
// (Paramètres). À faire relire par un juriste avant la mise en ligne.
// Les passages entre crochets « [À compléter : …] » sont surlignés sur la page tant qu'ils ne sont pas remplacés.

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  // Paragraphes après la liste
  closing?: string[];
};

export type LegalContact = { email: string; address: string; whatsappDisplay: string };

export type LegalPageContent = {
  title: string;
  intro: string;
  updatedAt: string;
  sections: (contact: LegalContact) => LegalSection[];
};

export const legalNotice: LegalPageContent = {
  title: 'Mentions légales',
  intro:
    "Les informations sur l'éditeur et l'hébergeur du site gai2e.com, et les règles qui encadrent son utilisation.",
  updatedAt: '2026-11-05',
  sections: ({ email, address, whatsappDisplay }) => [
    {
      title: 'Éditeur du site',
      paragraphs: ['Le site gai2e.com est édité par :'],
      items: [
        'Dénomination : GAI2E Conseils',
        'Forme juridique : __',
        'Immatriculation : __',
        `Siège : ${address}`,
        `Email : ${email}`,
        `WhatsApp : ${whatsappDisplay}`,
        'Directeur de la publication : Aliou Bolly',
      ],
    },
    {
      title: 'Hébergement',
      paragraphs: [
        'Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France (RCS Lille Métropole 424 761 419 00045). Site web : www.ovhcloud.com.',
      ],
    },
    {
      title: 'Objet du site',
      paragraphs: [
        "GAI2E Conseils accompagne les étudiants dans leur projet d'études à l'étranger : orientation, candidatures, finances, visa, logement, départ et arrivée.",
        'Les informations publiées sont données à titre indicatif. Les procédures évoluent et les décisions d’admission et de visa appartiennent aux établissements et aux autorités compétentes : GAI2E Conseils ne peut pas les garantir.',
      ],
    },
    {
      title: 'Propriété intellectuelle',
      paragraphs: [
        'Les textes, visuels, logos et éléments graphiques du site sont protégés. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable de GAI2E Conseils est interdite.',
      ],
    },
    {
      title: 'Responsabilité',
      paragraphs: [
        'GAI2E Conseils s’efforce de maintenir des informations exactes et un site accessible, sans pouvoir garantir l’absence d’erreur ou d’interruption. Les liens vers des sites tiers sont fournis pour information : GAI2E Conseils n’est pas responsable de leur contenu.',
      ],
    },
    {
      title: 'Données personnelles',
      paragraphs: ['Le traitement de vos données est détaillé dans notre politique de confidentialité.'],
    },
    {
      title: 'Droit applicable',
      paragraphs: ['Le site et les présentes mentions sont soumis au droit burkinabè.'],
    },
  ],
};

export const privacyPolicy: LegalPageContent = {
  title: 'Politique de confidentialité',
  intro:
    'Quelles données nous collectons pour vous accompagner, pourquoi, avec qui elles sont partagées et quels sont vos droits.',
  updatedAt: '2026-11-05',
  sections: ({ email, address }) => [
    {
      title: 'Responsable du traitement',
      paragraphs: [
        `GAI2E Conseils, ${address}, est responsable du traitement de vos données. Pour toute question : ${email}.`,
        "Au Burkina Faso, ces traitements sont encadrés par la loi n° 001-2021/AN du 30 mars 2021 portant protection des personnes à l'égard du traitement des données à caractère personnel, sous le contrôle de la Commission de l'Informatique et des Libertés (CIL).",
      ],
    },
    {
      title: 'Données collectées',
      paragraphs: ['Nous ne demandons que ce qui est utile à votre accompagnement :'],
      items: [
        'Compte : nom, prénom, adresse email, téléphone, WhatsApp et mot de passe (conservé sous forme hachée, jamais en clair).',
        'Prise de contact : pays d’origine, destinations souhaitées et contenu de vos messages.',
        'Dossier : état civil, parcours scolaire, tests de langue, budget, destination et rentrée visées, candidatures.',
        'Pièces justificatives : passeport, diplômes, relevés de notes, justificatifs de ressources et autres documents que vous déposez.',
        'Échanges : messages et rendez-vous avec votre conseiller.',
        'Données techniques : informations de session (appareil, adresse IP), pour sécuriser votre compte.',
      ],
    },
    {
      title: 'Pourquoi nous les utilisons',
      items: [
        'Répondre à vos demandes et évaluer votre projet.',
        'Constituer et suivre votre dossier, préparer vos candidatures et vos démarches de visa.',
        'Vous envoyer les messages liés à votre compte et à votre dossier : rappels d’échéances, documents validés ou à corriger.',
        'Sécuriser la plateforme et respecter nos obligations légales.',
      ],
      closing: ['Vos données ne sont jamais vendues et ne servent pas à de la publicité ciblée.'],
    },
    {
      title: 'Qui peut y accéder',
      items: [
        'Votre conseiller et les administrateurs de GAI2E Conseils, selon leurs droits : un conseiller ne voit que les dossiers qui lui sont confiés.',
        'Les établissements, plateformes de candidature et autorités consulaires concernés, lorsque votre projet le demande.',
        'Nos prestataires techniques, pour le service qu’ils assurent : Resend (envoi des emails), WhatsApp (si vous nous écrivez par ce canal), OVH SAS (hébergement du site) et Amazon Web Services (stockage des documents).',
      ],
    },
    {
      title: 'Transferts hors du pays',
      paragraphs: [
        "Un projet d'études à l'étranger implique de transmettre certaines données aux établissements et aux autorités du pays visé. Certains de nos prestataires peuvent aussi traiter des données hors du Burkina Faso. Nous limitons ces transmissions à ce qui est nécessaire à votre projet.",
      ],
    },
    {
      title: 'Durée de conservation',
      paragraphs: [
        '[À compléter : durées de conservation des comptes, des dossiers, des pièces et des demandes de contact]',
      ],
    },
    {
      title: 'Sécurité',
      paragraphs: [
        'Connexions chiffrées (HTTPS), mots de passe hachés, données les plus sensibles chiffrées, documents jamais publics et accès limité selon le rôle de chacun. Aucun système n’étant infaillible, gardez votre mot de passe confidentiel.',
      ],
    },
    {
      title: 'Cookies et stockage local',
      paragraphs: [
        'Le site n’utilise ni publicité ni outil de suivi. Il n’enregistre sur votre appareil que ce qui est nécessaire à son fonctionnement :',
      ],
      items: [
        'gai2e_refresh (cookie) : maintient votre session ouverte, jusqu’à 30 jours.',
        'sidebar_state (cookie) : mémorise l’état du menu du back-office, 7 jours.',
        'gai2e-theme (stockage local) : mémorise votre choix de thème clair ou sombre.',
      ],
    },
    {
      title: 'Vos droits',
      paragraphs: [
        `Vous pouvez demander l'accès à vos données, leur rectification ou leur suppression, et vous opposer à un traitement, en écrivant à ${email}. Certaines données peuvent devoir être conservées lorsque la loi l'impose.`,
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la Commission de l'Informatique et des Libertés (CIL) du Burkina Faso, ou l'autorité de protection des données de votre pays.",
      ],
    },
    {
      title: 'Modifications',
      paragraphs: [
        'Cette politique peut évoluer avec nos services. La date de dernière mise à jour figure en haut de cette page.',
      ],
    },
  ],
};

// Pages par identifiant (aussi leur URL publique)
export const legalPageContents = {
  'mentions-legales': legalNotice,
  'politique-de-confidentialite': privacyPolicy,
};
