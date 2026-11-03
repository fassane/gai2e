# GAI2E Conseils

Plateforme d'accompagnement des étudiants d'Afrique subsaharienne qui veulent étudier à l'étranger
(France, Canada, Japon, Royaume-Uni, Chine…). L'étudiant monte son dossier en ligne, un conseiller de
GAI2E Conseils le suit à chaque étape : orientation, candidatures, finances, visa, logement, départ et arrivée.

Monorepo Nx :

| Dossier | Contenu |
|---|---|
| `apps/api` | API REST NestJS (PostgreSQL via Prisma, Redis / BullMQ) |
| `apps/web` | Front React (Vite, Tailwind) : landing, espace étudiant, back-office |
| `libs/db` | Schéma Prisma, migrations, seed, `PrismaService` |
| `libs/shared-types` | Schémas zod partagés api ↔ web, importés via `@gai2e/shared-types` |
| `libs/ui` | Kit UI partagé (shadcn/ui + thème GAI2E), importé via `@gai2e/ui` |
| `libs/email-templates` | Emails transactionnels (React Email) |
| `deploy` | Stack du VPS et procédure de déploiement |

Architecture et conventions : [CLAUDE.md](CLAUDE.md).

## Installation

Prérequis : Node 24, Docker.

```sh
npm install
```

Lorsqu'un conflit de dépendances entre pairs bloque l'installation d'un ou plusieurs paquets :

```sh
npm install --legacy-peer-deps
```

Copier le fichier d'environnement :

```sh
cp .env.example .env
```

## API

Démarrer la base de données et Redis (Postgres sur le port 5434, Redis sur 6380)

```sh
docker compose -p gai2e up -d
```

Appliquer les migrations

```sh
npm run prisma:migrate
```

Remplir les données de référence (destinations, types de pièces, étapes des procédures). Idempotent : peut être relancé.

```sh
npm run prisma:seed
```

Démarrer l'API (port 3000)

```sh
npx nx serve api
```

Documentation de l'API (Swagger) : http://localhost:3000/api/

Explorer la base avec Prisma Studio (port 5557)

```sh
npm run prisma:gai2e:studio
```

## Front

```sh
npx nx serve web
```

Le site est servi sur http://localhost:4200.

Les composants d'interface (boutons, formulaires, tableaux, modales…) et le thème sont dans `libs/ui` :
une nouvelle app front les réutilise au lieu d'en recréer. Voir [libs/ui/README.md](libs/ui/README.md).

## Tests et lint

```sh
npx nx run-many -t lint test build --projects=web,ui   # front
npx nx lint api
npx nx test api                                         # tests d'intégration, Postgres requis
```

Les tests de l'API utilisent une base dédiée `gai2e_test`, créée et migrée automatiquement.

## Déploiement

Un push sur `recette` déploie la recette, un push sur `prod` déploie la production (GitHub Actions → images GHCR → VPS).
Sur chaque PR et sur `main`, la CI lance le lint, les tests et le build.
Détails et mise en place : [`deploy/README.md`](deploy/README.md).

## Suivi

État d'avancement et prochaines étapes : [docs/etat-du-projet.md](docs/etat-du-projet.md).
