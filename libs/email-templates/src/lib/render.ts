import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import Mustache from 'mustache';
import { brand } from './brand';

// Emails transactionnels, sur le modèle d'ikoddi : un template Markdown + Mustache par email et par langue
// (templates/<langue>/<module>/<nom>.md), dont la première ligne `# Titre` donne l'objet,
// inséré dans le layout HTML responsive aux couleurs de la charte (templates/layout.html).

export type EmailLocale = 'fr';
const defaultLocale: EmailLocale = 'fr';

export type RenderedEmail = { subject: string; html: string; text: string };

export type RenderEmailOptions = {
  // Langue de l'utilisateur (User.locale) ; repli sur le français si le template n'existe pas
  locale?: string;
  // Texte d'aperçu affiché par les messageries à côté de l'objet
  preheader?: string;
  // URL du site (logo, liens), WEB_URL côté api
  webUrl: string;
};

// Bouton : <a href="..." class="btn">Libellé</a> dans le Markdown, mis en forme ici (styles en ligne,
// seuls fiables dans toutes les messageries)
const buttonStyle = [
  'display:inline-block',
  'margin:8px 0 16px 0',
  'padding:14px 28px',
  'border-radius:999px',
  'background-color:#176b6b',
  'color:#ffffff',
  'font-weight:600',
  'font-size:15px',
  'line-height:1',
  'text-decoration:none',
].join(';');

// Dossier des templates : copié dans dist/apps/<app>/assets/email-templates au build,
// lu directement depuis les sources en test.
function templatesDir(): string {
  const candidates = [
    process.env['EMAIL_TEMPLATES_DIR'],
    join(__dirname, 'assets', 'email-templates'),
    join(__dirname, '..', 'templates'),
  ].filter((dir): dir is string => !!dir);
  const dir = candidates.find((candidate) => existsSync(join(candidate, 'layout.html')));
  if (!dir) throw new Error(`Templates d'email introuvables (cherchés dans : ${candidates.join(', ')})`);
  return dir;
}

const cache = new Map<string, string>();
function read(path: string): string {
  let content = cache.get(path);
  if (content === undefined) {
    content = readFileSync(path, 'utf8');
    cache.set(path, content);
  }
  return content;
}

function readTemplate(name: string, locale: string): string {
  const dir = templatesDir();
  const localized = join(dir, locale, `${name}.md`);
  return read(existsSync(localized) ? localized : join(dir, defaultLocale, `${name}.md`));
}

// Sépare la ligne `# Objet` du reste du message
function splitSubject(markdown: string): { subject: string; body: string } {
  const [firstLine, ...rest] = markdown.trimStart().split('\n');
  if (!firstLine.startsWith('# ')) throw new Error("Un template d'email doit commencer par `# Objet`");
  return { subject: firstLine.slice(2).trim(), body: rest.join('\n').trim() };
}

// Version texte : boutons en « Libellé : URL », sans balises ni gras Markdown
function toText(markdown: string): string {
  return markdown
    .replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '$2 : $1')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n');
}

export function renderEmail(
  template: string,
  data: Record<string, unknown>,
  { locale = defaultLocale, preheader, webUrl }: RenderEmailOptions,
): RenderedEmail {
  const source = readTemplate(template, locale);

  // HTML : variables échappées ; texte : variables brutes
  const { subject, body } = splitSubject(Mustache.render(source, data));
  const { body: textBody } = splitSubject(Mustache.render(source, data, {}, { escape: (value) => String(value) }));

  const content = (marked.parse(body, { async: false }) as string).replace(/class="btn"/g, `style="${buttonStyle}"`);
  const html = Mustache.render(read(join(templatesDir(), 'layout.html')), {
    locale,
    title: subject,
    preheader: preheader ?? subject,
    content,
    webUrl: webUrl.replace(/\/$/, ''),
    brand,
  });

  const text = [toText(textBody), "L'équipe GAI2E Conseils", `${brand.name} · ${brand.address}`].join('\n\n');
  return { subject: toText(subject), html, text };
}
