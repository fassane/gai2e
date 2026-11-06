# GAI2E Conseils — contexte projet

Plateforme d'accompagnement des **étudiants d'Afrique subsaharienne** qui veulent poursuivre leurs études
à l'étranger : **France, Canada, Japon, Royaume-Uni, Chine**… D'autres destinations suivront : tout ce qui
dépend d'un pays (procédure, pièces, calendrier) est de la **configuration**, jamais du code.

Modèle : **accompagnement par les conseillers de GAI2E Conseils**. L'étudiant crée son compte et son dossier, un
conseiller le suit étape par étape (orientation, candidatures, finances, visa, logement, départ, arrivée).
**Pas de paiement** dans un premier temps.

Principe directeur : **automatiser tout ce qui peut l'être** (étapes générées depuis la destination,
échéances calculées depuis la rentrée visée, rappels, alertes d'expiration) pour que le conseiller se
concentre sur le conseil et la vérification des pièces.

**État d'avancement et prochaines étapes** : [`docs/etat-du-projet.md`](docs/etat-du-projet.md), à lire en
reprenant le travail et à mettre à jour à chaque étape terminée.


## ⛔ RÈGLE ABSOLUE : AUCUNE MIGRATION PAR UN AGENT

Claude Code, Codex, ou tout autre assistant ou générateur de code ne doit **JAMAIS, en aucun cas**, faire les migrations de base de données lui-même. Cette règle ne souffre aucune exception, même si un test, une commande ou une demande semble l'exiger.

Il est interdit de :
- lancer `prisma migrate dev`, `prisma migrate deploy`, `prisma migrate reset`, `prisma migrate resolve`, `prisma migrate diff` ou `prisma db push` (ni via `npx`, ni via les scripts npm `prisma:migrate` / `prisma:deploy`, `nx`, `docker compose run migrate` ou un script) ;
- créer, modifier, renommer ou supprimer un fichier dans `libs/db/prisma/migrations/` ;
- appliquer, annuler ou marquer comme appliquée une migration sur une base, qu'elle soit locale, de recette ou de production.

Quand une modification du schéma Prisma (`libs/db/prisma/schema.prisma`) demande une migration :
1. modifier le schéma ;
2. **s'arrêter** ;
3. signaler clairement au développeur qu'une migration est nécessaire, et pourquoi.

C'est le développeur qui génère, relit et applique la migration lui-même.

**Seule exception : la base de test jetable `gai2e_test`.** Un agent peut lancer `npx nx test api`, qui crée
cette base et y applique les migrations existantes (`globalSetup` Jest : `apps/api/test/global-setup.ts`, URL dans `test-database.ts`). Cette
exception ne couvre que ce mécanisme automatique : elle n'autorise ni à générer une migration, ni à toucher
au dossier `migrations/`, ni à migrer une autre base (`gai2e` locale, recette, production).

## Stack

- Monorepo **Nx** (npm), alias TypeScript `@gai2e/*`
- `apps/api` : **NestJS** — API REST du site (landing, espace étudiant, back-office conseillers)
- `apps/web` : **React** (Vite) — landing page, espace étudiant (`/espace`) et back-office (`/admin`)
- `apps/worker` (à créer) : **NestJS** — jobs **BullMQ** (Redis), crons (`@nestjs/schedule`), envoi des notifications
- `libs/db` : **Prisma 7** + PostgreSQL (`PrismaService` via `@prisma/adapter-pg`, `DbModule` global, schema dans `libs/db/prisma/schema.prisma`, client généré dans `libs/db/src/generated` — non versionné, et config dans `prisma.config.ts` à la racine)
- `libs/shared-types` : schémas zod et DTOs partagés api ↔ web
- `libs/email-templates` : emails transactionnels et notifications, templates **Markdown + Mustache** par langue dans un layout HTML responsive (`renderEmail`, voir `libs/email-templates/README.md`) ; aperçu : `npm run email:preview`
- `libs/ui` : composants **shadcn/ui** (Radix + Tailwind v4) et thème partagés par les apps front (`@gai2e/ui`, voir `libs/ui/README.md`) ; une nouvelle app front importe `libs/ui/src/styles/theme.css` et réutilise ces composants au lieu d'en recréer ; thème clair / sombre (`ThemeProvider`, `ThemeToggle`) : couleurs toujours par tokens (`bg-card`, `bg-brand`…), jamais en dur

## Dev local

```bash
cp .env.example .env
docker compose -p gai2e up -d   # Postgres 17 sur le port 5434, Redis 7 sur 6380 (ports décalés : Ikoddi, Habaru)
npm install                       # lance aussi prisma generate
npm run prisma:migrate            # prisma migrate dev
npm run prisma:seed               # destinations, types de pièces, étapes des procédures (idempotent)
npx nx serve api                  # port 3000
npx nx serve web                  # port 4200
npm run prisma:gai2e:studio       # Prisma Studio sur le port 5557
npm run user:create -- --email … --role ADMIN   # crée un compte (mot de passe demandé), en attendant l'inscription
npx nx test api                   # tests d'intégration : base gai2e_test (créée et migrée par Jest), Postgres requis
```

Swagger : http://localhost:3000/api/ (spécification JSON sur `/api/docs-json`).

## Front : appels à l'API (Redux Toolkit)

- Back-office `/admin` (ADMIN et ADVISOR) : `layouts/dashboard-layout.tsx` (sidebar, header) ; les entrées du menu sont dans `layouts/components/dashboard-menu.ts`, une page par dossier `pages/admin/<onglet>/`. Paramètres (onglet Équipe : invitation des conseillers, désactivation) réservés aux ADMIN ; profil de chacun sur `/admin/profile` (`pages/common/my-profile`, réutilisable par l'espace étudiant) ; l'invitation réutilise le jeton de réinitialisation (`/reset-password?token=…&invitation=1`, 7 jours).
- `apps/web/src/redux/` : `store.ts`, `hooks.ts` (`useAppDispatch`, `useAppSelector`, `useAuth`), `slice/` (`auth.slice.ts` : statut, utilisateur, jeton d'accès).
- `apps/web/src/utils/api/` : **un seul** `createApi` (`base-api.ts`), complété par domaine avec `injectEndpoints` dans `<domaine>/<domaine>.api.ts` (cache et tags communs, invalidation d'un domaine à l'autre). Types des requêtes et réponses importés de `@gai2e/shared-types`, jamais redéfinis.
- `auth-base-query.ts` : `fetchBaseQuery` sur `/api` (même origine), renouvellement unique et partagé de la session sur un 401, puis la requête est rejouée ; `restoreSession` au chargement de l'app.
- Pages : la logique des formulaires dans `pages/<domaine>/hooks/use-*.ts` (react-hook-form + zod + mutation `.unwrap()`), messages d'erreur via `getApiErrorMessage` (`utils/api/errors.ts`).

## DTOs et validation

- Les DTOs sont des classes générées depuis des schémas zod avec **nestjs-zod** : `class XDto extends createZodDto(xSchema) {}`, utilisées comme des DTOs classiques (`@Body() body: XDto`, `@ApiOkResponse({ type: XDto })`).
- Les schémas vivent dans `libs/shared-types`, pour que `apps/web` valide ses formulaires avec les mêmes règles que l'API. Jamais redéfinis d'un côté ou de l'autre.
- Validation par le `Gai2eValidationPipe` global (`apps/api/src/app/validation.pipe.ts`, 400 « Payload invalide » avec les `issues` zod). Pas de class-validator.
- Swagger : `cleanupOpenApiDoc` (dans `swagger.ts`) est obligatoire pour que les schémas des DTOs zod apparaissent.
- Habillage de Swagger aux couleurs de la charte : `apps/api/src/assets/docs` (`swagger.css`, `favicon.svg`), servi sur `/api/docs-assets/` par `main.ts` et copié dans l'image api.

## CI et déploiement (GitHub Actions + VPS)

- Dépôt sur GitHub. Branches : `main` (développement), `recette` et `prod`. On déploie en poussant (ou en mergeant `main`) sur `recette` ou `prod`.
- `.github/workflows/` : `ci.yml` (`main`), `recette.yml` et `prod.yml` appellent `checks.yml` (lint, types, tests, build, et contrôle que les migrations correspondent au schéma) ; `recette.yml` / `prod.yml` appellent ensuite `deploy.yml` : images Docker poussées sur **GHCR** (`ghcr.io/<propriétaire>/gai2e-{api,web,migrate}`, taguées par commit et par environnement), déploiement par SSH sur le **VPS** et vérification de `GET /api/health`. Sur une PR vers `recette` / `prod`, les images sont construites sans être poussées.
- Sur le VPS : une stack Docker Compose par environnement (`gai2e-recette`, `gai2e-prod`, fichier `deploy/docker-compose.yml`) avec son Postgres et son Redis. Les ports n'écoutent que sur `127.0.0.1`, derrière le **Nginx** existant (HTTPS via certbot). Mise en place et exploitation : `deploy/README.md`.
- Migrations : image dédiée `libs/db/Dockerfile` (CLI Prisma + migrations), lancée avant chaque redémarrage (`docker compose run --rm -T migrate < /dev/null` : sans `-T` ni `< /dev/null`, `run` avale la suite du script de déploiement).
- Image api : construite à partir de `dist/` ; le runtime `@prisma/client` y est installé explicitement, car Nx ne le détecte pas (le client généré est ignoré par git).
- Le seed n'est jamais lancé en CI : une fois par environnement (puis à chaque mise à jour de la configuration de référence), depuis un poste de dev, via un tunnel SSH vers Postgres.

## Décisions d'architecture

### Comptes et rôles
- Un seul modèle `User` avec un rôle : `STUDENT`, `ADVISOR`, `ADMIN`. Profils séparés : `StudentProfile` (état civil, parcours, budget) et `AdvisorProfile` (destinations maîtrisées, langues, plafond de dossiers).
- Authentification email + mot de passe, email vérifié obligatoire avant de soumettre un dossier. Sessions avec refresh token (seul le hash est stocké, `Session`), jetons à usage unique (`AuthToken`) pour la vérification d'email et la réinitialisation du mot de passe.
- Implémentation (`apps/api/src/app/auth`) : mots de passe hachés avec scrypt ; jeton d'accès JWT court (15 min) envoyé en `Bearer`, gardé en mémoire côté web (state Redux, jamais le localStorage) ; refresh token opaque en cookie httpOnly `gai2e_refresh` (chemin `/api/auth`, `SameSite=Strict`), renouvelé à chaque usage. `JwtAuthGuard` global : toute route est privée sauf `@Public()`. Limite de débit (`@nestjs/throttler`) resserrée sur connexion et mot de passe oublié. Le web et l'api partagent la même origine (`/api` relayé par Nginx, et par Vite en dev).
- Mot de passe oublié : lien `/reset-password?token=…` valable 1 h, seul le dernier envoyé est valide ; la réponse ne révèle jamais si l'email existe ; la réinitialisation ferme toutes les sessions.
- Téléphone et **WhatsApp** en format E.164 : c'est souvent le canal qui fonctionne le mieux pour joindre l'étudiant.
- Fuseau par défaut `Africa/Ouagadougou`, toutes les dates stockées en UTC.

### Destinations et procédures (configuration)
- `Destination` (un pays, code ISO), avec ses `ProcedureStepTemplate` ordonnées par catégorie (`ORIENTATION`, `LANGUAGE`, `ADMISSION`, `FINANCES`, `VISA`, `HOUSING`, `TRAVEL`, `ARRIVAL`) et les `DocumentType` requis pour chaque étape.
- Exemples : France (Études en France / Campus France, VLS-TS), Canada (CAQ ou LAP, permis d'études IRCC), Japon (COE), Royaume-Uni (CAS, Student visa), Chine (JW202, visa X1).
- Une étape porte une échéance indicative en **jours avant la rentrée visée** : les dates du dossier sont calculées automatiquement.
- Configuration initiale dans `libs/db/prisma/seed.ts` (upsert sur les codes), éditable ensuite dans le back-office. Les procédures évoluent : à faire relire par les conseillers avant chaque rentrée.
- Catalogue : `Institution` → `Program` (niveau, filière, langue d'enseignement, frais, mois de rentrée). Les candidatures peuvent aussi viser un établissement hors catalogue (saisie libre).

### Dossier d'accompagnement
- `Dossier` : un projet d'études pour **une destination et une rentrée** (`@@unique([studentId, destinationId, targetIntake])`). Un étudiant peut en mener plusieurs en parallèle. Référence lisible (`GAI-2027-00042`) pour les échanges.
- Statuts : `DRAFT` → `SUBMITTED` → `IN_PROGRESS` (↔ `ON_HOLD`) → `COMPLETED` (ou `CANCELLED`).
- À la création, les étapes de la destination sont **copiées** dans `DossierStep` : modifier un modèle ne change pas les dossiers en cours. Le conseiller peut sauter une étape optionnelle ou en ajouter une.
- Statuts d'étape : `TODO`, `IN_PROGRESS`, `WAITING_STUDENT`, `WAITING_THIRD_PARTY`, `DONE`, `SKIPPED`.
- `Application` : candidatures à des formations, avec la plateforme utilisée (Études en France, Parcoursup, UCAS…), l'ordre de préférence et la décision.
- `DossierEvent` : historique du dossier (timeline), écrit à chaque changement de statut, étape, pièce ou candidature.
- Assignation d'un conseiller compétent sur la destination, dans la limite de `maxActiveDossiers`.

### Pièces justificatives
- `Document` appartient à l'**étudiant** (réutilisable entre dossiers), rattaché éventuellement à un dossier et une étape.
- Fichiers dans un **stockage objet** compatible S3, derrière une interface `StorageProvider` ; jamais publics, accès par **URL signée** à durée courte. Taille et types de fichiers contrôlés (PDF, images).
- Revue par le conseiller : `UPLOADED` → `IN_REVIEW` → `APPROVED` / `REJECTED` (avec motif). Pièces à validité limitée (`DocumentType.hasExpiry`) : alerte avant expiration (passeport surtout).

### Échanges
- Messagerie par dossier (`Message`), avec des **notes internes** entre conseillers (`isInternal`), jamais visibles par l'étudiant.
- Rendez-vous avec le conseiller (`Appointment`) : visio, téléphone, WhatsApp ou présentiel. Les rendez-vous externes (consulat, Campus France) sont des étapes du dossier.

### Notifications
- Emails envoyés par **Resend** (`RESEND_API_KEY`, `MAIL_FROM` sur un domaine vérifié) via `MailerService` (`apps/api/src/app/mail`) ; SMTP possible (`SMTP_URL`) ; sans configuration, ils sont écrits dans les logs.
- `Notification` par utilisateur et par canal : `IN_APP`, `EMAIL`, `WHATSAPP`, `SMS`, derrière une interface `Notifier` (le fournisseur SMS / WhatsApp peut être Ikoddi).
- Événements : dossier assigné, échéance proche ou dépassée, pièce validée / refusée / bientôt expirée, candidature mise à jour, nouveau message, rendez-vous confirmé et rappel.
- Idempotence via `dedupeKey` (ex. `STEP_DUE_SOON:<stepId>:J-7:EMAIL`) : un cron peut repasser sans renvoyer.

### Configuration du site
- `SiteConfig` : ligne unique (`id = 'default'`) des réglages du site, modifiables par un ADMIN dans le back-office (`/admin/configuration`) : présentation, coordonnées (email, WhatsApp, téléphone, adresse, horaires), réseaux sociaux. Lus par la landing, le footer et les emails (`GET /api/site-config`, public ; `PUT /api/admin/site-config`). Sans ligne enregistrée, `defaultSiteConfig` (`libs/shared-types`) s'applique. Côté web : hook `useSiteConfig`.

### Pages légales
- `LegalPage` : mentions légales et politique de confidentialité, modifiables par un ADMIN (Paramètres, éditeur de texte riche). `GET /api/legal-pages/:id` (public) ; `PUT /api/admin/legal-pages/:id` (HTML nettoyé par `sanitize-html` avant enregistrement). Sans ligne enregistrée, le texte par défaut de `apps/web/src/data/legal.data.ts` s'applique.

### Landing page et prospects
- Tarifs : page `/tarifs` et résumé sur la landing (`pricingSteps`, `paymentMethods`, `pricingFaq` dans `apps/web/src/data/home.data.ts`) : 3 paiements selon l'évolution du dossier, après l'évaluation du profil ; Mobile Money ou carte bancaire. Pas de paiement sur la plateforme pour l'instant.
- Le formulaire de la landing crée un `Lead` (destination et niveau visés, attribution UTM), traité par l'équipe puis converti en compte (`Lead.userId`).

### Sécurité et données personnelles
- Données sensibles (état civil, passeport, relevés, preuves de fonds) : minimiser ce qui est collecté, chiffrer les champs suffixés `Enc` (service AES, clé en variable d'environnement), ne jamais exposer un fichier sans contrôle d'accès.
- Un étudiant ne voit que ses dossiers ; un conseiller, les dossiers qui lui sont assignés ; un admin, tout.
- API : `@Roles('ADMIN', 'ADVISOR')` sur une route ou un contrôleur (`RolesGuard` global, après `JwtAuthGuard`). Web : `PrivateRoute roles={...}` dans `routes/route-guards.tsx`.
- Seuls la landing (formulaire de contact) et l'inscription / connexion sont publics.

## Modèles Prisma (résumé)

`User`, `Session`, `AuthToken`, `StudentProfile`, `AcademicRecord`, `LanguageTest`, `AdvisorProfile`,
`Destination`, `Institution`, `Program`, `DocumentType`, `ProcedureStepTemplate`, `Dossier`, `DossierStep`,
`Application`, `Document`, `Message`, `Appointment`, `DossierEvent`, `Notification`, `Lead`, `SiteConfig`, `LegalPage`.
Voir `libs/db/prisma/schema.prisma` pour le détail.

## Ordre de développement

1. **Landing page** + formulaire de contact (`Lead`).
2. Comptes : inscription, vérification d'email, connexion, mot de passe oublié.
3. Profil étudiant : état civil, parcours académique, tests de langue.
4. Dossier : création à partir d'une destination (étapes générées, échéances calculées), soumission.
5. Back-office conseillers : file des dossiers, assignation, suivi des étapes.
6. Pièces justificatives : stockage objet, dépôt, revue, alertes d'expiration.
7. Candidatures + catalogue établissements / formations.
8. Messagerie et rendez-vous.
9. `apps/worker` : notifications (email, WhatsApp / SMS) et rappels d'échéances.
10. Plus tard : paiement des formules d'accompagnement, bourses, multi-langue (anglais pour l'Afrique anglophone).

## Conventions

- Tout ce qui est spécifique à une destination vit en **configuration** (`Destination`, `ProcedureStepTemplate`, `DocumentType`), jamais en code.
- Montants en entiers (unités mineures) avec leur devise ; pays en ISO 3166-1 alpha-2, langues en ISO 639-1.
- Toute opération déclenchée par un cron ou un événement externe doit être **idempotente**.
- Interface en **français** pour l'instant (`User.locale` prévu pour la suite).
