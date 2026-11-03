import { LuCheck, LuPlus } from 'react-icons/lu';
import { cn, Flag } from '@gai2e/ui';
import { SectionTitle } from '@/components/ui/section-title';
import { continentOrder, MAX_DESTINATIONS, studyDestinations } from '@/data';
import { useProjectSelection } from '../project-selection';

// Choix des destinations (jusqu'à 3 vœux), repris dans la carte du hero et le récapitulatif
const Destinations = () => {
  const { destinations: selected, toggleDestination, isFull } = useProjectSelection();
  const continents = continentOrder
    .map((continent) => ({
      continent,
      countries: studyDestinations.filter((destination) => destination.continent === continent),
    }))
    .filter((group) => group.countries.length > 0);

  return (
    <section id="destinations" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Destinations"
            title="Votre destination pour vos études ?"
            subtitle={`Faites votre choix — jusqu'à ${MAX_DESTINATIONS} vœux à la fois.`}
            align="left"
            className="mb-0"
          />
          <span className="rounded-full border bg-card px-4 py-1.5 text-sm font-medium tabular-nums" aria-live="polite">
            {selected.length} / {MAX_DESTINATIONS} choisis
          </span>
        </div>

        <dl className="divide-y">
          {continents.map(({ continent, countries }) => (
            <div key={continent} className="grid gap-4 py-6 first:pt-0 md:grid-cols-[12rem_1fr]">
              <dt className="flex items-start gap-3 font-serif text-lg font-semibold">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-peach" />
                {continent}
              </dt>
              <dd className="flex flex-wrap gap-2.5">
                {countries.map((country) => {
                  const isSelected = selected.includes(country.countryCode);
                  const disabled = !isSelected && isFull;
                  return (
                    <button
                      key={country.countryCode}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={disabled}
                      onClick={() => toggleDestination(country.countryCode)}
                      title={
                        disabled
                          ? `${MAX_DESTINATIONS} vœux maximum : retirez-en un pour en choisir un autre`
                          : undefined
                      }
                      className={cn(
                        'inline-flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-2 pl-1.5 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'bg-card hover:border-primary/40 hover:bg-secondary',
                      )}
                    >
                      <Flag countryCode={country.countryCode} className="size-6" />
                      {country.name}
                      <span
                        className={cn(
                          'flex size-5 items-center justify-center rounded-full',
                          isSelected ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {isSelected ? <LuCheck className="size-3" /> : <LuPlus className="size-3" />}
                      </span>
                    </button>
                  );
                })}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Destinations;
