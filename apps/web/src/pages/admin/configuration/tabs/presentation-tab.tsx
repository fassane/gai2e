import type { UseFormReturn } from 'react-hook-form';
import type { SiteConfigInput } from '@gai2e/shared-types';
import { TextareaInput } from '@gai2e/ui';

export function PresentationTab({ form }: { form: UseFormReturn<SiteConfigInput> }) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const length = watch('description')?.length ?? 0;

  return (
    <div>
      <TextareaInput
        label="Description de GAI2E Conseils"
        required
        rows={5}
        placeholder="Présentez GAI2E Conseils en une ou deux phrases…"
        fieldHelp={`Affichée dans le pied de page du site. ${length} / 500 caractères.`}
        {...register('description')}
        error={errors.description}
      />
    </div>
  );
}
