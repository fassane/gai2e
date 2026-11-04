# Déploiement sur le VPS

Deux environnements sur le même VPS, chacun dans sa propre stack Docker Compose
(Postgres, Redis, migrations, api, web) :

| Branche | Stack Compose | Dossier |
|---|---|---|
| `recette` | `gai2e-recette` | `/opt/gai2e/recette` |
| `prod` | `gai2e-prod` | `/opt/gai2e/prod` |

Workflows (`.github/workflows/`) :

| Fichier | Déclencheur | Rôle |
|---|---|---|
| `ci.yml` | push et PR sur `main` | contrôles seulement |
| `recette.yml` | push et PR sur `recette` | contrôles, puis images et déploiement de la recette |
| `prod.yml` | push et PR sur `prod` | contrôles, puis images et déploiement de la prod |
| `checks.yml` | réutilisable | lint, types, tests (avec Postgres), migrations alignées sur le schéma, build |
| `deploy.yml` | réutilisable | images GHCR et déploiement SSH |

Sur une PR vers `recette` ou `prod`, les images sont seulement construites (vérification des
Dockerfiles), sans être poussées ni déployées.

Un push sur `recette` ou `prod` (ou le merge de `main` dans ces branches) pousse les images sur GHCR
(`ghcr.io/<propriétaire>/gai2e-{api,web,migrate}`, taguées par commit et par environnement),
puis déploie par SSH :

1. copie de `deploy/docker-compose.yml` dans le dossier de l'environnement ;
2. `docker compose pull`, démarrage de Postgres et Redis ;
3. migrations Prisma (`docker compose run --rm -T migrate`) ;
4. redémarrage de api et web sur les nouvelles images ;
5. vérification : `GET /api/health` doit répondre 200 (api démarrée et base joignable), puis le
   site ; sinon le déploiement échoue en affichant les logs ;
6. nettoyage des images de plus d'une semaine (les plus récentes restent pour un retour arrière).

## Mise en place (une fois)

### 1. Sur le VPS

```bash
# Utilisateur de déploiement, membre du groupe docker (déjà présent si Habaru tourne sur le VPS)
sudo adduser --disabled-password deploy
sudo usermod -aG docker deploy
sudo mkdir -p /opt/gai2e/recette /opt/gai2e/prod
sudo chown -R deploy: /opt/gai2e

# Clé SSH dédiée à la CI : la clé publique dans ~deploy/.ssh/authorized_keys,
# la clé privée dans le secret GitHub VPS_SSH_PRIVATE_KEY
# (avec une passphrase : la mettre dans le secret SSH_PASSPHRASE)
ssh-keygen -t ed25519 -f gai2e-deploy -N '' -C 'github-actions gai2e'
```

Pour chaque environnement, créer `/opt/gai2e/<env>/.env` à partir de
[`.env.example`](.env.example) (`chmod 600`), avec un mot de passe Postgres fort et
**des ports différents** entre recette et prod (et des autres projets du VPS), par exemple :

| | `API_PORT` | `WEB_PORT` | `POSTGRES_PORT` |
|---|---|---|---|
| recette | 3300 | 3301 | 5450 |
| prod | 3400 | 3401 | 5451 |

Les ports n'écoutent que sur `127.0.0.1` : rien n'est exposé directement sur internet.

Le même `.env` porte les variables de l'api : `JWT_ACCESS_SECRET` (secret propre à chaque
environnement, `openssl rand -base64 48`), `WEB_URL` (URL publique du site, pour les liens des
emails), `RESEND_API_KEY` et `MAIL_FROM` (envoi des emails par Resend, expéditeur sur un domaine
vérifié ; `SMTP_URL` possible à la place de Resend). Changer `JWT_ACCESS_SECRET` déconnecte les
utilisateurs au plus tard 15 minutes après (jetons d'accès), sans fermer leurs sessions.

### 2. Nginx

Un domaine par environnement (ex. `recette.gai2e.example`), qui sert le site et
relaie `/api/` vers l'API. L'enregistrement A pointe vers le VPS.

Copier [`nginx/gai2e.conf.example`](nginx/gai2e.conf.example) dans
`/etc/nginx/sites-available/gai2e-<env>.conf` (`server_name` et ports), l'activer, puis
activer HTTPS :

```bash
sudo ln -s /etc/nginx/sites-available/gai2e-recette.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d recette.gai2e.example
```

HTTPS est obligatoire : comptes, sessions et pièces justificatives (données personnelles).

### 3. Sur GitHub

- **Secrets** (Settings → Secrets and variables → Actions) : `VPS_HOST`, `VPS_USER`
  (`deploy`), `VPS_SSH_PRIVATE_KEY` (clé privée), `SSH_PASSPHRASE` (si la clé en a une),
  `VPS_PORT` (optionnel). Ils peuvent être définis au niveau du dépôt, ou dans les
  environnements `recette` / `prod` si les valeurs diffèrent.
- **Variable** `DEPLOY_PATH` (optionnelle, par environnement) : dossier de la stack sur le VPS,
  `/opt/gai2e/<env>` par défaut.
- **Variables du dépôt** `RECETTE_SITE_URL` et `PROD_SITE_URL` (optionnelles) : URL publique du
  site, affichée comme lien sur chaque déploiement dans GitHub. Elles doivent être créées au niveau
  du *dépôt* (Variables → Repository variables), pas dans l'environnement : les workflows les lisent
  avant d'y entrer.
- Les ports (`API_PORT`, `WEB_PORT`, `POSTGRES_PORT`) restent dans le `.env` du VPS, à côté
  du vhost Nginx qui les utilise : ce ne sont pas des variables GitHub.
- **Environnement `prod`** (Settings → Environments) : ajouter une règle « Required reviewers »
  pour qu'un déploiement en prod attende une validation.
- Les images GHCR sont privées par défaut : la CI se connecte au registre sur le VPS avec le
  `GITHUB_TOKEN` automatique du job, le temps du `pull` ; aucun token (PAT) à créer, aucun
  token permanent stocké sur le VPS.

### 4. Premier déploiement et seed

Pousser sur `recette`. Une fois la stack en place, lancer le seed (destinations, types de
pièces, étapes des procédures) depuis un poste de dev, via un tunnel SSH vers Postgres.
Il est idempotent et peut être relancé pour mettre à jour la configuration de référence :

```bash
ssh -N -L 5450:127.0.0.1:5450 deploy@<vps> &
DATABASE_URL=postgresql://gai2e:<mot-de-passe>@localhost:5450/gai2e npm run prisma:seed
```

Le seed ne crée aucun compte. Créer le premier administrateur par le même tunnel (le mot de passe est
demandé dans le terminal) ; il invitera ensuite les autres membres depuis Paramètres > Équipe :

```bash
DATABASE_URL=postgresql://gai2e:<mot-de-passe>@localhost:5450/gai2e \
  npm run user:create -- --email <email> --first-name <prénom> --last-name <nom> --role ADMIN
```

Si le compte existe déjà, le script remplace son mot de passe et son rôle, et le réactive.

Le même tunnel permet d'ouvrir Prisma Studio sur l'environnement
(`DATABASE_URL=... npm run prisma:gai2e:studio`).

## Exploitation

```bash
cd /opt/gai2e/prod
docker compose -p gai2e-prod ps
docker compose -p gai2e-prod logs -f api

# Sauvegarde de la base
docker compose -p gai2e-prod exec -T postgres pg_dump -U gai2e gai2e | gzip > gai2e-prod-$(date +%F).sql.gz
```

Retour arrière : relancer le workflow d'un commit précédent depuis l'onglet Actions
(« Re-run all jobs »), qui redéploie les images de ce commit. Les migrations ne sont pas
annulées : une migration destructive doit être pensée pour rester compatible avec la version précédente.
