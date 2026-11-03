import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteTeamMemberSchema, type InviteTeamMemberInput } from '@gai2e/shared-types';
import { customToast } from '@gai2e/ui';
import { useInviteTeamMemberMutation } from '@/utils/api/admin/admin.api';
import { getApiErrorMessage } from '@/utils/api/errors';

export function useInviteMemberForm(onDone: () => void) {
  const [invite, { isLoading }] = useInviteTeamMemberMutation();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<InviteTeamMemberInput>({
    resolver: zodResolver(inviteTeamMemberSchema),
    defaultValues: { email: '', firstName: '', lastName: '', role: 'ADVISOR' },
  });

  const onSubmit = handleSubmit(async (input) => {
    try {
      const member = await invite(input).unwrap();
      customToast.success({ message: `Invitation envoyée à ${member.email}.`, duration: 4000 });
      reset();
      onDone();
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (message.startsWith('Un compte existe déjà')) setError('email', { message });
      else setError('root', { message });
    }
  });

  return { register, errors, onSubmit, isLoading, reset };
}
