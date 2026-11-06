import { LuArrowRight, LuX } from 'react-icons/lu';
import { Badge, Button, Flag, SelectInput } from '@gai2e/ui';
import { heroStats, MAX_DESTINATIONS, originOptions } from '@/data';
import { destinationName, useProjectSelection } from '../project-selection';

// Carte « Votre dossier » : pays d'origine et vœux de destination (choisis dans la section Destinations)
const ProjectCard = () => {
  const { origin, setOrigin, destinations, toggleDestination, evaluationUrl } = useProjectSelection();

  return (
    <div
      id="evaluation"
      className="w-full scroll-mt-24 rounded-3xl border bg-card p-6 shadow-2xl shadow-primary/10 md:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold">Votre dossier</h2>
        <Badge variant="success">Gratuit</Badge>
      </div>

      <SelectInput
        label="Je viens de"
        name="origin"
        value={origin}
        onChange={(event) => setOrigin(event.target.value)}
        options={originOptions.map((country) => ({ value: country.countryCode, label: country.name }))}
      />

      <p className="mb-1.5 text-sm font-medium">Je souhaite étudier en</p>
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-input bg-card px-3 py-2">
        {destinations.length ? (
          destinations.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary py-1 pr-1.5 pl-1 text-xs font-medium text-secondary-foreground"
            >
              <Flag countryCode={code} className="size-5" />
              {destinationName(code)}
              <button
                type="button"
                onClick={() => toggleDestination(code)}
                aria-label={`Retirer ${destinationName(code)}`}
                className="cursor-pointer rounded-full p-0.5 hover:bg-background/60"
              >
                <LuX className="size-3" />
              </button>
            </span>
          ))
        ) : (
          <a href="#destinations" className="text-sm text-muted-foreground hover:text-primary">
            Choisissez jusqu'à {MAX_DESTINATIONS} destinations dans la liste plus bas.
          </a>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {destinations.length} / {MAX_DESTINATIONS} destinations choisies
      </p>

      <Button asChild variant="cta" size="lg" className="mt-5 w-full">
        <a href={evaluationUrl} target="_blank" rel="noreferrer">
          Faire évaluer mon profil
          <LuArrowRight />
        </a>
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Sans engagement · Réponse sous 48 h</p>
    </div>
  );
};

const Hero = () => (
  <section className="bg-warm-gradient">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-12 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
      <div>
        <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          <span className="font-bold text-primary">GAI2E</span> · Global Assistance Inscription Études à l'Étranger
        </p>
        <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
          Étudier à l'étranger, <em className="text-primary">sans se perdre</em> dans les démarches.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          GAI2E Conseils accompagne les étudiants, où qu'ils vivent, du premier entretien jusqu'à l'arrivée sur le
          campus.
        </p>
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {heroStats.map((stat) => (
            <div key={stat.id}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-4xl font-semibold text-primary">{stat.value}</dd>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <ProjectCard />
    </div>
  </section>
);

export default Hero;
