import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import { Flag } from '@gai2e/ui';
import { SectionTitle } from '@/components/ui/section-title';
import { continentOrder, destinations, siteData } from '@/data';

// Destinations regroupées par continent (les continents sans destination ne s'affichent pas)
const groups = continentOrder
  .map((continent) => ({ continent, items: destinations.filter((d) => d.continent === continent) }))
  .filter((group) => group.items.length > 0);

const Destinations = () => (
  <section id="destinations" className="bg-warm-gradient py-20">
    <div className="mx-auto max-w-6xl px-4">
      <SectionTitle
        eyebrow="Destinations"
        title="Nos destinations"
        subtitle="Chaque pays a sa procédure : nous la connaissons étape par étape. Faites votre choix."
      />
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.continent}>
            <h3 className="mb-3 text-xs font-medium text-muted-foreground">{group.continent}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((destination) => (
                <Link
                  key={destination.slug}
                  to={`${siteData.preRegistrationPath}?destination=${destination.slug}`}
                  className="group flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3.5 shadow-xs ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Flag countryCode={destination.countryCode} className="size-7" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{destination.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{destination.procedure}</span>
                  </span>
                  <LuArrowRight className="size-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">D'autres destinations arrivent bientôt.</p>
    </div>
  </section>
);

export default Destinations;
