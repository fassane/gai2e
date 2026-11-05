import type { ReactNode } from 'react';
import { siteData } from '@/data';

// Petite bannière en haut des pages publiques : surtitre, titre, texte d'introduction.
export function PageBanner({
  title,
  paragraph,
  children,
}: {
  title: string;
  paragraph?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-warm-gradient">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-peach uppercase">{siteData.name}</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {paragraph && <p className="mt-4 max-w-2xl text-muted-foreground">{paragraph}</p>}
        {children}
      </div>
    </section>
  );
}
