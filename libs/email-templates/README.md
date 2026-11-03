# @gai2e/email-templates

Emails transactionnels de GAI2E Conseils, sur le modèle d'ikoddi : un template **Markdown + Mustache**
par email et par langue, inséré dans un layout HTML responsive aux couleurs de la charte.
Utilisé par l'api, puis par le worker (notifications).

```
src/templates/
  layout.html                    layout commun (logo, carte, pied de page)
  fr/auth/password-reset.md      un template par email : templates/<langue>/<module>/<nom>.md
```

## Écrire un template

La première ligne `# …` donne l'objet de l'email (et le titre affiché). Variables Mustache
`{{ variable }}`, échappées dans la version HTML. Un bouton s'écrit en HTML avec la classe `btn` :

```md
# Réinitialisation de votre mot de passe

Bonjour {{ firstName }},

<a href="{{ link }}" class="btn">Choisir un nouveau mot de passe</a>

Ce lien est valable **{{ minutes }} minutes**.
```

La signature (« L'équipe GAI2E Conseils ») et le pied de page sont ajoutés par le layout.
Coordonnées du pied de page : `brand` de `@gai2e/shared-types` (les mêmes que sur le site).

## Envoyer

```ts
import { renderEmail } from '@gai2e/email-templates';

const email = renderEmail('auth/password-reset', { firstName, link, minutes: 60 }, {
  locale: user.locale, // repli sur fr si le template n'existe pas dans la langue
  webUrl,              // WEB_URL : logo et liens
  preheader: 'Texte d’aperçu affiché à côté de l’objet',
});
await mailer.send({ to: user.email, ...email }); // { subject, html, text }
```

Les templates sont lus au runtime : le build de chaque app les copie dans
`dist/apps/<app>/assets/email-templates` (voir `apps/api/webpack.config.js`).

## Aperçu

```sh
npm run email:preview   # dist/email-previews/<template>.html et .txt
```

Ajouter chaque nouveau template, avec des données d'exemple, dans `scripts/preview.ts`.
