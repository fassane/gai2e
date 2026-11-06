import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDestinationSchema, type AdminDestination, type CreateDestinationInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useCreateDestinationMutation, useUpdateDestinationMutation } from '@/utils/api/destination/destination.api';
import { getApiErrorMessage } from '@/utils/api/errors';

// Formulaire d'une destination : création, ou modification si `destination` est fourni
export function useDestinationForm(destination: AdminDestination | undefined, onDone: () => void) {
  const [create, { isLoading: isCreating }] = useCreateDestinationMutation();
  const [update, { isLoading: isUpdating }] = useUpdateDestinationMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateDestinationInput>({
    resolver: zodResolver(createDestinationSchema),
    defaultValues: {
      countryCode: destination?.countryCode ?? '',
      name: destination?.name ?? '',
      currency: destination?.currency ?? '',
      summary: destination?.summary ?? '',
    },
  });

  const onSubmit = handleSubmit(async ({ countryCode, ...fields }) => {
    try {
      if (destination) await update({ id: destination.id, ...fields }).unwrap();
      else await create({ countryCode, ...fields }).unwrap();
      customToast.success({ message: destination ? 'Destination modifiée.' : 'Destination ajoutée.' });
      onDone();
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  });

  return { register, errors, onSubmit, isLoading: isCreating || isUpdating };
}
