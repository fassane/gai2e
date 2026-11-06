# État du projet

Dernière mise à jour : 6 novembre 2026. À tenir à jour à chaque étape terminée.

## En place

- **Site public** : landing, tarifs, destinations et fiches par pays, FAQ, pages légales, référencement.
- **Comptes** : connexion, mot de passe oublié, invitation de l'équipe. Pas encore d'inscription des étudiants.
- **Back-office** : tableau de bord, destinations et procédures, configuration du site, équipe, pages légales, profil.
- **Socle** : thème clair et sombre, emails transactionnels (Resend), CI et déploiement sur le VPS.

## À faire avant la mise en ligne

- Faire relire les 5 fiches pays par les conseillers, et appliquer les corrections dans le back-office.
- Vérifier le domaine `gai2e.com` dans Resend.
- Compléter les pages légales : forme juridique et capital, RCCM et IFU, durées de conservation. Les faire relire par un
  juriste, ainsi que les promesses de sécurité de la politique de confidentialité sur ce qui n'est pas encore développé.
- Obtenir les réponses du client sur les tarifs :
  - évaluation du profil gratuite ou non ;
  - politique de remboursement ;
  - frais d'inscription et de visa inclus ou non ;
  - conditions de vente.
- Sur le VPS de production : ne pas reprendre le `X-Robots-Tag` du vhost de recette, et rediriger `www` vers `gai2e.com`.

## Prochaines étapes

- **Formulaire de prospects (`Lead`)** : aujourd'hui, les demandes partent sur WhatsApp et rien n'est enregistré.
- **Fin de la gestion des destinations** :
  - gérer les types de pièces dans le back-office ;
  - générer le `sitemap.xml` depuis l'API (il est écrit à la main) ;
  - n'avoir qu'une seule liste de pays (la landing garde la sienne dans `home.data.ts`) ;
  - élargir la liste des drapeaux du composant `Flag`.
- **Suite du parcours** (voir « Ordre de développement » dans `CLAUDE.md`) : inscription, profil étudiant, dossier, etc.

## Prochaines versions

Évolutions des procédures, écartées pour l'instant. Toutes demandent une migration.

### Date de dernière relecture

Afficher « Procédure vérifiée le… » sur la fiche publique.

- **Schéma** : `reviewedAt` et `reviewedById` sur `Destination`.
- **API** : `POST /api/admin/destinations/:id/review`, et `reviewedAt` dans les réponses publique et admin.
- **Back-office** : bouton « Marquer comme vérifiée », colonne « Vérifiée le », badge si la relecture est ancienne.
- **À décider** : le seuil d'ancienneté (12 mois, ou avant chaque rentrée), et si une modification d'étape efface la date
  (proposition : non).
- **Attention** : une date affichée engage GAI2E. La poser uniquement après une vraie relecture par un conseiller.

### Auteur des modifications

Afficher « Modifiée le… par… » dans le back-office.

- **Schéma** : `updatedById` sur `Destination` et `ProcedureStepTemplate` (`onDelete: SetNull`).
- **API** : transmettre l'utilisateur connecté aux créations et modifications, et renvoyer le nom de l'auteur.
- **Limite** : seul le dernier auteur est conservé. Un historique détaillé demanderait une table dédiée.

### Validation avant publication

Un conseiller propose une modification, un administrateur la valide. Utile seulement si les conseillers modifient un jour
les procédures : aujourd'hui, seuls les administrateurs le peuvent.

- **Schéma** : table `ProcedureChangeRequest` (changements proposés, statut `PENDING` / `APPROVED` / `REJECTED`, auteur,
  relecteur, motif de refus). Un simple statut brouillon ou publié ne suffit pas : la version publiée doit rester visible
  pendant la relecture.
- **API** : proposer ; lister, approuver ou refuser (l'approbation applique les changements en une transaction).
- **Back-office** : mode proposition pour les conseillers, file « À valider » avec comparaison avant / après.
- **Notifications** : prévenir l'administrateur d'une proposition, et le conseiller de la décision.
