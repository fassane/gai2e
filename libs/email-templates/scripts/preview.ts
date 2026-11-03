import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { renderEmail } from '../src';

// Aperçu des emails dans le navigateur, avec des données d'exemple :
//   npm run email:preview   →   dist/email-previews/<template>.html (et .txt)
// Ajouter ici chaque nouveau template.
const samples: Record<string, Record<string, unknown>> = {
  'auth/password-reset': {
    firstName: 'Awa',
    link: 'http://localhost:4200/reset-password?token=exemple',
    minutes: 60,
  },
};

const outDir = resolve(__dirname, '../../../dist/email-previews');
for (const [template, data] of Object.entries(samples)) {
  const email = renderEmail(template, data, { webUrl: process.env['WEB_URL'] ?? 'http://localhost:4200' });
  const file = join(outDir, template);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(`${file}.html`, email.html);
  writeFileSync(`${file}.txt`, `Objet : ${email.subject}\n\n${email.text}\n`);
  console.log(`${template} : ${file}.html`);
}
