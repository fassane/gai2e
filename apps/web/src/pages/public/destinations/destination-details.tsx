import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuArrowLeft, LuArrowRight, LuCalendarClock, LuExternalLink, LuFileText, LuInfo } from 'react-icons/lu';
import { stepCategoryLabels } from '@gai2e/shared-types';
import { Alert, Badge, Button, ColgateWrapper, Flag, Skeleton } from '@gai2e/ui';
import { PageBanner } from '@/components/shared/page-banner';
import { siteData } from '@/data';
import NotFound from '@/pages/extra/not-found';
import { applyPageMeta, pageMetaOf } from '@/routes/page-meta';
import { useGetDestinationQuery } from '@/utils/api/destination/destination.api';
import { getApiErrorMessage } from '@/utils/api/errors';

// Échéance indicative en clair : 300 → « Environ 10 mois avant la rentrée », -30 → « Environ 1 mois après la rentrée »
function dueLabel(days: number | null) {
  if (days === null) return null;
  if (days === 0) return 'À la rentrée';
  const distance = Math.abs(days);
  const moment = days > 0 ? 'avant' : 'après';
  if (distance < 45) return `Environ ${distance} jour${distance > 1 ? 's' : ''} ${moment} la rentrée`;
  return `Environ ${Math.round(distance / 30)} mois ${moment} la rentrée`;
}

const DestinationDetails = () => {
  const { slug = '' } = useParams();
  const { data, isLoading, error, refetch } = useGetDestinationQuery(slug);
  const notFound = !!error && 'status' in error && error.status === 404;

  // Référencement : titre et description de la fiche une fois chargée, jamais d'indexation d'une fiche inconnue
  useEffect(() => {
    const base = pageMetaOf(window.location.pathname, window.location.hostname);
    if (notFound)
      applyPageMeta({ ...base, title: `Page introuvable | ${siteData.name}`, noindex: true, canonical: null });
    else if (data) {
      applyPageMeta({
        ...base,
        title: `Étudier à l'étranger : ${data.name}, procédure et documents | ${siteData.name}`,
        description:
          data.summary ?? `Les étapes de la procédure et les pièces à préparer pour vos études : ${data.name}.`,
      });
    }
  }, [data, notFound]);

  if (notFound) return <NotFound />;

  return (
    <div>
      <PageBanner
        title={data?.name ?? 'Destination'}
        paragraph={data?.summary ?? undefined}
        eyebrow={
          <Link to="/destinations" className="inline-flex items-center gap-1.5 hover:underline">
            <LuArrowLeft className="size-3.5" />
            Toutes les destinations
          </Link>
        }
        icon={data && <Flag countryCode={data.countryCode} className="size-12" />}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        {error ? (
          <Alert variant="error">
            {getApiErrorMessage(error, 'Impossible de charger cette destination.')}{' '}
            <Button variant="link" size="sm" className="h-auto p-0" onClick={refetch}>
              Réessayer
            </Button>
          </Alert>
        ) : isLoading || !data ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
            <section aria-labelledby="procedure-steps">
              <h2 id="procedure-steps" className="mb-6 font-heading text-2xl font-semibold">
                Les {data.stepCount} étapes de la procédure
              </h2>
              <ol className="space-y-4">
                {data.steps.map((step, index) => {
                  const due = dueLabel(step.dueDaysBeforeIntake);
                  return (
                    <li key={step.code} className="flex gap-4 rounded-3xl border bg-card p-5 shadow-xs md:p-6">
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-sm font-semibold text-primary"
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="muted">{stepCategoryLabels[step.category]}</Badge>
                          {step.isOptional && <Badge variant="info">Selon votre projet</Badge>}
                        </div>
                        <h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                        {(due || step.externalUrl) && (
                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                            {due && (
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <LuCalendarClock className="size-4 shrink-0" />
                                {due}
                              </span>
                            )}
                            {step.externalUrl && (
                              <a
                                href={step.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                              >
                                Site officiel
                                <LuExternalLink className="size-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                        {step.documents.length > 0 && (
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {step.documents.map((document) => (
                              <li key={document.code}>
                                <Badge variant="secondary">{document.label}</Badge>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-24">
              {data.documents.length > 0 && (
                <ColgateWrapper>
                  <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
                    <LuFileText className="size-5 text-primary" />
                    Pièces à prévoir
                  </h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-peach">
                    {data.documents.map((document) => (
                      <li key={document.code}>{document.label}</li>
                    ))}
                  </ul>
                </ColgateWrapper>
              )}
              <div className="rounded-3xl bg-secondary p-6">
                <h2 className="font-heading text-lg font-semibold">Votre projet : {data.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Un conseiller évalue votre profil et vous dit ce qui est réaliste pour votre rentrée.
                </p>
                <Button asChild variant="cta" className="mt-4 w-full">
                  <Link to={siteData.preRegistrationPath}>
                    Faire évaluer mon profil
                    <LuArrowRight />
                  </Link>
                </Button>
              </div>
              <p className="flex gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
                <LuInfo className="mt-0.5 size-3.5 shrink-0" />
                Procédure et échéances données à titre indicatif : elles évoluent selon les pays et votre projet. Votre
                conseiller confirme ce qui s'applique à votre dossier.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetails;
