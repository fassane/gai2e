import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProcedureStepSchema, type AdminProcedureStep, type CreateProcedureStepInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import {
  useCreateProcedureStepMutation,
  useUpdateProcedureStepMutation,
} from '@/utils/api/destination/destination.api';
import { getApiErrorMessage } from '@/utils/api/errors';

// Formulaire d'une étape : ajout, ou modification si `step` est fourni
export function useStepForm(destinationId: string, step: AdminProcedureStep | undefined, onDone: () => void) {
  const [create, { isLoading: isCreating }] = useCreateProcedureStepMutation();
  const [update, { isLoading: isUpdating }] = useUpdateProcedureStepMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateProcedureStepInput>({
    resolver: zodResolver(createProcedureStepSchema),
    defaultValues: {
      title: step?.title ?? '',
      description: step?.description ?? '',
      category: step?.category ?? 'ORIENTATION',
      dueDaysBeforeIntake: step?.dueDaysBeforeIntake ?? null,
      isOptional: step?.isOptional ?? false,
      externalUrl: step?.externalUrl ?? '',
      documentTypeCodes: step?.documents.map(({ code }) => code) ?? [],
    },
  });

  const onSubmit = handleSubmit(async (input) => {
    try {
      if (step) await update({ destinationId, stepId: step.id, ...input }).unwrap();
      else await create({ destinationId, ...input }).unwrap();
      customToast.success({ message: step ? 'Étape modifiée.' : 'Étape ajoutée.' });
      onDone();
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return { register, errors, onSubmit, isLoading: isCreating || isUpdating };
}
