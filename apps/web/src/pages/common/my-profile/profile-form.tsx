import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, Input, InputPhone } from '@gai2e/ui';
import type { useEditProfileForm } from './hooks/use-edit-profile-form';

type ProfileFormProps = Pick<ReturnType<typeof useEditProfileForm>, 'form' | 'onSubmit'> & {
  formId: string;
  editing: boolean;
  email: string;
  roleLabel: string;
};

export function ProfileSection({ title, first, children }: { title: string; first?: boolean; children: ReactNode }) {
  return (
    <section className={first ? '' : 'mt-6 border-t pt-6'}>
      <h2 className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">{title}</h2>
      {children}
    </section>
  );
}

// Champs du profil, en lecture seule tant que l'utilisateur n'a pas cliqué sur « Modifier ».
export function ProfileForm({ form, onSubmit, formId, editing, email, roleLabel }: ProfileFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form id={formId} onSubmit={onSubmit} noValidate>
      {errors.root && (
        <Alert variant="error" className="mb-5">
          {errors.root.message}
        </Alert>
      )}

      <ProfileSection title="Identité" first>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Input
            label="Prénom"
            required={editing}
            autoComplete="given-name"
            disabled={!editing}
            {...register('firstName')}
            error={errors.firstName}
          />
          <Input
            label="Nom"
            required={editing}
            autoComplete="family-name"
            disabled={!editing}
            {...register('lastName')}
            error={errors.lastName}
          />
        </div>
      </ProfileSection>

      <ProfileSection title="Coordonnées">
        <Input
          label="Adresse email"
          value={email}
          disabled
          readOnly
          fieldHelp={editing ? "Pour changer d'adresse email, contactez un administrateur." : undefined}
        />
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputPhone
                label="Téléphone"
                name={field.name}
                disabled={!editing}
                value={field.value ?? ''}
                onChange={(value) => field.onChange(value || null)}
                onBlur={field.onBlur}
                error={errors.phone}
              />
            )}
          />
          <Controller
            control={control}
            name="whatsappPhone"
            render={({ field }) => (
              <InputPhone
                label="WhatsApp"
                name={field.name}
                disabled={!editing}
                value={field.value ?? ''}
                onChange={(value) => field.onChange(value || null)}
                onBlur={field.onBlur}
                error={errors.whatsappPhone}
              />
            )}
          />
        </div>
      </ProfileSection>

      <ProfileSection title="Rôle">
        <Input label="Rôle sur la plateforme" value={roleLabel} disabled readOnly customClassContainer="mb-0" />
      </ProfileSection>
    </form>
  );
}
