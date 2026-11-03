import { Controller, type UseFormReturn } from 'react-hook-form';
import { LuClock, LuMail, LuMapPin } from 'react-icons/lu';
import type { SiteConfigInput } from '@gai2e/shared-types';
import { Input, InputPhone } from '@gai2e/ui';

export function ContactTab({ form }: { form: UseFormReturn<SiteConfigInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Affichées sur le site (pied de page, section « Parlons de votre projet », bouton WhatsApp) et dans les emails.
      </p>
      <div className="grid gap-x-4 md:grid-cols-2">
        <Input
          label="Email de contact"
          type="email"
          required
          icon={<LuMail className="size-4" />}
          placeholder="contact@gai2e.com"
          {...register('contactEmail')}
          error={errors.contactEmail}
        />
        <Controller
          control={control}
          name="whatsappPhone"
          render={({ field }) => (
            <InputPhone
              label="WhatsApp"
              required
              name={field.name}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              fieldHelp="Numéro des demandes d'évaluation et du bouton WhatsApp du site."
              error={errors.whatsappPhone}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <InputPhone
              label="Téléphone (appels)"
              name={field.name}
              value={field.value ?? ''}
              onChange={(value) => field.onChange(value || null)}
              onBlur={field.onBlur}
              fieldHelp="Facultatif, si différent du WhatsApp."
              error={errors.phone}
            />
          )}
        />
        <Input
          label="Horaires"
          icon={<LuClock className="size-4" />}
          placeholder="Du lundi au vendredi, 8 h – 17 h"
          {...register('openingHours')}
          error={errors.openingHours}
        />
      </div>
      <Input
        label="Adresse"
        required
        icon={<LuMapPin className="size-4" />}
        placeholder="Quartier, ville, pays"
        customClassContainer="mb-0"
        {...register('address')}
        error={errors.address}
      />
    </div>
  );
}
