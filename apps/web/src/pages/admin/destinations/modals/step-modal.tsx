import { stepCategoryLabels, stepCategorySchema, type AdminProcedureStep } from '@gai2e/shared-types';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  SelectInput,
  Skeleton,
  TextareaInput,
} from '@gai2e/ui';
import { useGetDocumentTypesQuery } from '@/utils/api/destination/destination.api';
import { useStepForm } from '../hooks/use-step-form';

const categoryOptions = stepCategorySchema.options.map((value) => ({ value, label: stepCategoryLabels[value] }));

function StepForm({
  destinationId,
  step,
  onClose,
}: {
  destinationId: string;
  step?: AdminProcedureStep;
  onClose: () => void;
}) {
  const { register, errors, onSubmit, isLoading } = useStepForm(destinationId, step, onClose);
  const { data: documentTypes, isLoading: isLoadingTypes } = useGetDocumentTypesQuery();

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root && (
        <Alert variant="error" className="mb-5">
          {errors.root.message}
        </Alert>
      )}
      <Input label="Titre" required {...register('title')} error={errors.title} />
      <TextareaInput label="Description" required rows={3} {...register('description')} error={errors.description} />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <SelectInput
          label="Catégorie"
          required
          options={categoryOptions}
          {...register('category')}
          error={errors.category}
        />
        <Input
          label="Échéance (jours avant la rentrée)"
          type="number"
          placeholder="90"
          fieldHelp="Négatif : après la rentrée. Vide : pas d'échéance."
          {...register('dueDaysBeforeIntake', {
            setValueAs: (value: unknown) => (value === '' || value === null ? null : Number(value)),
          })}
          error={errors.dueDaysBeforeIntake}
        />
      </div>
      <Input
        label="Lien officiel"
        type="url"
        placeholder="https://…"
        {...register('externalUrl')}
        error={errors.externalUrl}
      />
      <label className="mb-5 flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" className="mt-0.5 size-4 accent-primary" {...register('isOptional')} />
        <span>
          <span className="font-medium">Étape selon le projet</span>
          <span className="block text-xs text-muted-foreground">
            Le conseiller la garde ou la saute (ex. CAQ pour le Québec uniquement).
          </span>
        </span>
      </label>
      <fieldset className="mb-2">
        <legend className="mb-2 text-sm font-medium">Pièces demandées</legend>
        {isLoadingTypes ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <div className="grid max-h-48 gap-2 overflow-y-auto rounded-2xl border p-3 sm:grid-cols-2">
            {documentTypes?.map((type) => (
              <label key={type.code} className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  value={type.code}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  {...register('documentTypeCodes')}
                />
                {type.label}
              </label>
            ))}
          </div>
        )}
      </fieldset>
      <DialogFooter className="mt-5">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" variant="cta" isLoading={isLoading}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}

export function StepModal({
  open,
  destinationId,
  step,
  onOpenChange,
}: {
  open: boolean;
  destinationId: string;
  step?: AdminProcedureStep;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{step ? 'Modifier l’étape' : 'Ajouter une étape'}</DialogTitle>
          <DialogDescription>
            Visible aussitôt sur la fiche publique. Les dossiers déjà ouverts gardent leurs étapes.
          </DialogDescription>
        </DialogHeader>
        {open && <StepForm destinationId={destinationId} step={step} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
