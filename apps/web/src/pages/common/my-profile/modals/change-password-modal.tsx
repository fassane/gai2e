import { passwordRules } from '@gai2e/shared-types';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  InputPassword,
  PasswordCheck,
} from '@gai2e/ui';
import { useChangePasswordForm } from '../hooks/use-change-password-form';

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const { register, errors, onSubmit, isLoading, password } = useChangePasswordForm(onClose);

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root && (
        <Alert variant="error" className="mb-5">
          {errors.root.message}
        </Alert>
      )}
      <InputPassword
        label="Mot de passe actuel"
        autoComplete="current-password"
        {...register('currentPassword')}
        error={errors.currentPassword}
      />
      <InputPassword
        label="Nouveau mot de passe"
        placeholder="8 caractères minimum"
        autoComplete="new-password"
        customClassContainer="mb-3"
        {...register('password')}
        error={errors.password}
      />
      {!!password && <PasswordCheck value={password} rules={passwordRules} />}
      <InputPassword
        label="Confirmer le nouveau mot de passe"
        autoComplete="new-password"
        {...register('passwordConfirmation')}
        error={errors.passwordConfirmation}
      />
      <div className="mt-2 flex gap-3">
        <Button type="submit" variant="cta" className="flex-1" isLoading={isLoading}>
          Mettre à jour
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

export function ChangePasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Sécurisez votre compte avec un nouveau mot de passe. Vos autres appareils seront déconnectés.
          </DialogDescription>
        </DialogHeader>
        {/* Formulaire démonté à la fermeture : il repart vide à chaque ouverture */}
        {open && <ChangePasswordForm onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
