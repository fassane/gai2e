import { cn } from '@gai2e/ui';

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatLegalDate = (date: string) => dateFormat.format(new Date(date));

// Surligne les passages « [À compléter : …] » encore à remplacer
const highlightPlaceholders = (html: string) =>
  html.replace(
    /\[À compléter[^\]<]*\]/g,
    (text) => `<mark class="rounded bg-peach-soft px-1 text-foreground">${text}</mark>`,
  );

// Contenu d'une page légale. HTML nettoyé par l'api à l'enregistrement, ou texte par défaut échappé (use-legal-page).
export function LegalContent({ html, className }: { html: string; className?: string }) {
  return (
    <article
      className={cn(
        'text-[15px] leading-relaxed text-muted-foreground',
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2:first-child]:mt-0',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground',
        '[&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:marker:text-peach',
        '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5',
        '[&_a]:text-primary [&_a]:underline [&_strong]:text-foreground',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: highlightPlaceholders(html) }}
    />
  );
}
