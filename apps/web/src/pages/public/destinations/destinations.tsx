import { Link } from 'react-router-dom';
import { LuArrowRight, LuListChecks } from 'react-icons/lu';
import { Alert, Button, EmptyAlert, Flag, Skeleton } from '@gai2e/ui';
import { ContactCard } from '@/components/shared/contact-card';
import { PageBanner } from '@/components/shared/page-banner';
import { siteData, studyDestinations } from '@/data';
import { getApiErrorMessage } from '@/utils/api/errors';
import { useGetDestinationsQuery } from '@/utils/api/destination/destination.api';

// Liste des destinations : fiche détaillée pour les pays dont la procédure est configurée,
// simple mention pour les autres pays proposés.
const DestinationsPage = () => {
  const { data, isLoading, error, refetch } = useGetDestinationsQuery();
  const withProcedure = new Set(data?.map((destination) => destination.countryCode));
  const others = studyDestinations.filter((destination) => !withProcedure.has(destination.countryCode));

  return (
    <div>
      <PageBanner
        title="Nos destinations"
        paragraph="Chaque pays a ses démarches : candidature, finances, visa, arrivée. Découvrez les étapes à prévoir et les pièces à préparer."
      >
        <Button asChild variant="cta" size="lg" className="mt-6">
          <Link to={siteData.preRegistrationPath}>
            Faire évaluer mon profil
            <LuArrowRight />
          </Link>
        </Button>
      </PageBanner>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 md:px-6 md:py-16">
        <section aria-labelledby="destination-guides">
          <h2 id="destination-guides" className="mb-6 font-heading text-2xl font-semibold">
            Les procédures par pays
          </h2>
          {error ? (
            <Alert variant="error">
              {getApiErrorMessage(error, 'Impossible de charger les destinations.')}{' '}
              <Button variant="link" size="sm" className="h-auto p-0" onClick={refetch}>
                Réessayer
              </Button>
            </Alert>
          ) : isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-56 rounded-3xl" />
              ))}
            </div>
          ) : data?.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((destination) => (
                <li key={destination.slug}>
                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="group flex h-full flex-col rounded-3xl border bg-card p-7 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <Flag countryCode={destination.countryCode} className="size-10" />
                      <span className="font-heading text-xl font-semibold">{destination.name}</span>
                    </span>
                    {destination.summary && (
                      <span className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {destination.summary}
                      </span>
                    )}
                    <span className="mt-6 flex items-center justify-between gap-3 border-t pt-4 text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <LuListChecks className="size-4" />
                        {destination.stepCount} étapes
                      </span>
                      <span className="flex items-center gap-1 font-medium text-primary">
                        Voir la fiche
                        <LuArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAlert text="Les procédures par pays arrivent bientôt." />
          )}
        </section>

        {!error && !isLoading && others.length > 0 && (
          <section aria-labelledby="other-destinations">
            <h2 id="other-destinations" className="font-heading text-2xl font-semibold">
              D'autres pays possibles
            </h2>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Parlez-en à votre conseiller : il vous précisera les démarches lors de l'évaluation de votre profil.
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {others.map((destination) => (
                <li
                  key={destination.countryCode}
                  className="inline-flex items-center gap-2 rounded-full border bg-card py-1.5 pr-4 pl-1.5 text-sm font-medium"
                >
                  <Flag countryCode={destination.countryCode} className="size-6" />
                  {destination.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ContactCard />
      </div>
    </div>
  );
};

export default DestinationsPage;
