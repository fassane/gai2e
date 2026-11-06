import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowUp,
  LuCalendarClock,
  LuExternalLink,
  LuPencil,
  LuPlus,
  LuPower,
} from 'react-icons/lu';
import { stepCategoryLabels, type AdminProcedureStep } from '@gai2e/shared-types';
import {
  Alert,
  Badge,
  Button,
  cn,
  ColgateWrapper,
  confirmAlert,
  customToast,
  EmptyAlert,
  Flag,
  Skeleton,
} from '@gai2e/ui';
import {
  useGetAdminDestinationQuery,
  useReorderProcedureStepsMutation,
  useUpdateProcedureStepMutation,
} from '@/utils/api/destination/destination.api';
import { getApiErrorMessage } from '@/utils/api/errors';
import { dueLabel } from '@/utils/destination';
import { DestinationModal } from './modals/destination-modal';
import { StepModal } from './modals/step-modal';

function StepCard({
  step,
  index,
  total,
  destinationId,
  isReordering,
  onMove,
  onEdit,
}: {
  step: AdminProcedureStep;
  index: number;
  total: number;
  destinationId: string;
  isReordering: boolean;
  onMove: (offset: number) => void;
  onEdit: () => void;
}) {
  const [update] = useUpdateProcedureStepMutation();
  const due = dueLabel(step.dueDaysBeforeIntake);

  const onToggle = async () => {
    const { isActive, title } = step;
    const { isConfirmed, value: error } = await confirmAlert<string | null>({
      title: `${isActive ? 'Désactiver' : 'Réactiver'} « ${title} » ?`,
      text: isActive
        ? 'Cette étape disparaît de la fiche publique et des nouveaux dossiers. Les dossiers ouverts la conservent.'
        : 'Cette étape réapparaît sur la fiche publique.',
      confirmLabel: isActive ? 'Désactiver' : 'Réactiver',
      destructive: isActive,
      preConfirm: () =>
        update({ destinationId, stepId: step.id, isActive: !isActive })
          .unwrap()
          .then(() => null)
          .catch((updateError: unknown) => getApiErrorMessage(updateError)),
    });
    if (!isConfirmed) return;
    if (error) customToast.error({ message: error });
    else customToast.success({ message: isActive ? 'Étape désactivée.' : 'Étape réactivée.' });
  };

  return (
    <li className={cn('flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row', !step.isActive && 'bg-muted/60')}>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-sm font-semibold text-primary"
      >
        {index + 1}
      </span>
      <div className={cn('min-w-0 flex-1', !step.isActive && 'opacity-60')}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{stepCategoryLabels[step.category]}</Badge>
          {step.isOptional && <Badge variant="info">Selon le projet</Badge>}
          {!step.isActive && <Badge variant="warning">Désactivée</Badge>}
        </div>
        <h3 className="mt-2 font-semibold">{step.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {due && (
            <span className="flex items-center gap-1">
              <LuCalendarClock className="size-3.5" />
              {due}
            </span>
          )}
          {step.externalUrl && (
            <a
              href={step.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Lien officiel
              <LuExternalLink className="size-3" />
            </a>
          )}
        </div>
        {step.documents.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {step.documents.map((document) => (
              <li key={document.code}>
                <Badge variant="secondary">{document.label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Monter ${step.title}`}
          disabled={index === 0 || isReordering}
          onClick={() => onMove(-1)}
        >
          <LuArrowUp />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Descendre ${step.title}`}
          disabled={index === total - 1 || isReordering}
          onClick={() => onMove(1)}
        >
          <LuArrowDown />
        </Button>
        <Button variant="secondary" size="icon-sm" aria-label={`Modifier ${step.title}`} onClick={onEdit}>
          <LuPencil />
        </Button>
        <Button
          variant={step.isActive ? 'danger' : 'secondary'}
          size="icon-sm"
          aria-label={`${step.isActive ? 'Désactiver' : 'Réactiver'} ${step.title}`}
          onClick={onToggle}
        >
          <LuPower />
        </Button>
      </div>
    </li>
  );
}

const AdminDestinationDetails = () => {
  const { id = '' } = useParams();
  const { data, isLoading, error } = useGetAdminDestinationQuery(id);
  const [reorder, { isLoading: isReordering }] = useReorderProcedureStepsMutation();
  const [editingDestination, setEditingDestination] = useState(false);
  // undefined : fermée ; null : ajout ; étape : modification
  const [editingStep, setEditingStep] = useState<AdminProcedureStep | null | undefined>(undefined);

  const moveStep = async (index: number, offset: number) => {
    if (!data) return;
    const ids = data.steps.map((step) => step.id);
    [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];
    try {
      await reorder({ destinationId: id, ids }).unwrap();
    } catch (moveError) {
      customToast.error({ message: getApiErrorMessage(moveError) });
    }
  };

  return (
    <div>
      <Link
        to="/admin/destinations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <LuArrowLeft className="size-4" />
        Toutes les destinations
      </Link>

      {error ? (
        <Alert variant="error">{getApiErrorMessage(error, 'Impossible de charger cette destination.')}</Alert>
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <ColgateWrapper>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <Flag countryCode={data.countryCode} className="size-12" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-heading text-2xl font-semibold">{data.name}</h1>
                    {data.isActive ? (
                      <Badge variant="success">Publiée</Badge>
                    ) : (
                      <Badge variant="muted">Désactivée</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data.countryCode} · {data.currency} · /destinations/{data.slug}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.isActive && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`/destinations/${data.slug}`} target="_blank" rel="noreferrer">
                      <LuExternalLink />
                      Voir la fiche
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditingDestination(true)}>
                  <LuPencil />
                  Modifier
                </Button>
              </div>
            </div>
            {data.summary && <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{data.summary}</p>}
          </ColgateWrapper>

          <ColgateWrapper>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-semibold">Étapes de la procédure</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.activeStepCount} active{data.activeStepCount > 1 ? 's' : ''} sur {data.steps.length}. Les
                  dossiers déjà ouverts gardent leurs étapes.
                </p>
              </div>
              <Button variant="cta" onClick={() => setEditingStep(null)}>
                <LuPlus />
                Ajouter une étape
              </Button>
            </div>
            {data.steps.length ? (
              <ol className="space-y-3">
                {data.steps.map((step, index) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={index}
                    total={data.steps.length}
                    destinationId={id}
                    isReordering={isReordering}
                    onMove={(offset) => moveStep(index, offset)}
                    onEdit={() => setEditingStep(step)}
                  />
                ))}
              </ol>
            ) : (
              <EmptyAlert text="Aucune étape pour le moment. Ajoutez la première." />
            )}
          </ColgateWrapper>

          <DestinationModal open={editingDestination} destination={data} onOpenChange={setEditingDestination} />
          <StepModal
            open={editingStep !== undefined}
            destinationId={id}
            step={editingStep ?? undefined}
            onOpenChange={(open) => !open && setEditingStep(undefined)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDestinationDetails;
