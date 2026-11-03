import { LuHandshake } from 'react-icons/lu';
import { Button } from '@gai2e/ui';
import { siteData } from '@/data';

const Partner = () => (
  <section id="partenaires" className="px-4 pb-4">
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border bg-card p-8 shadow-xs md:flex-row md:p-10">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-peach-soft text-peach">
        <LuHandshake className="size-6" />
      </span>
      <div className="flex-1 text-center md:text-left">
        <h2 className="font-serif text-2xl font-semibold">Devenez partenaire GAI2E Conseils</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Établissements, écoles de langue, agences et conseillers indépendants : rejoignez notre réseau.
        </p>
      </div>
      <Button asChild variant="outline" size="lg">
        <a href={`mailto:${siteData.contact.email}?subject=Demande de partenariat`}>Demande de partenariat</a>
      </Button>
    </div>
  </section>
);

export default Partner;
